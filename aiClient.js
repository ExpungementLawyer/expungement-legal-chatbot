const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6';

// Delay helper
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Fetch wrapper with exponential backoff for rate limits and server errors.
 */
async function fetchWithRetry(url, options, maxRetries = 3) {
    let lastError;
    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fetch(url, options);

            // Retry on rate limits (429) or server errors (5xx)
            if (response.status === 429 || response.status >= 500) {
                const text = await response.text().catch(() => 'unknown error');
                console.warn(`[aiClient] ⚠️ API HTTP ${response.status} (Attempt ${i + 1}/${maxRetries}): ${text}`);
                lastError = new Error(`HTTP ${response.status}: ${text}`);

                // Exponential backoff: 1s, 2s, 4s...
                const delay = Math.min(1000 * Math.pow(2, i), 10000);
                await sleep(delay);
                continue;
            }

            // Do not retry client errors (4xx) like bad requests
            if (!response.ok) {
                const text = await response.text().catch(() => 'unknown error');
                console.error(`[aiClient] ❌ Fatal API HTTP ${response.status}: ${text}`);
                throw new Error(`HTTP ${response.status}: ${text}`);
            }

            return response;
        } catch (err) {
            console.warn(`[aiClient] ⚠️ Network Error (Attempt ${i + 1}/${maxRetries}):`, err.message);
            lastError = err;
            const delay = Math.min(1000 * Math.pow(2, i), 10000);
            await sleep(delay);
        }
    }
    console.error(`[aiClient] ❌ Failed after ${maxRetries} attempts.`);
    throw lastError;
}

/**
 * Initiates a streaming chat completion request to Anthropic.
 */
async function streamChat({ systemPrompt, messages, tools, sessionId }) {
    if (!ANTHROPIC_API_KEY) {
        throw new Error('ANTHROPIC_API_KEY is not defined in the environment.');
    }

    const payload = {
        model: ANTHROPIC_MODEL,
        max_tokens: 1024,
        system: systemPrompt,
        stream: true,
        messages: messages,
    };

    if (tools && tools.length > 0) {
        payload.tools = tools;
    }

    console.log(`[aiClient] 📡 Sending request to Anthropic model "${ANTHROPIC_MODEL}" (Session: ${sessionId || 'unknown'})`);
    const startTime = Date.now();

    const response = await fetchWithRetry(`https://api.anthropic.com/v1/messages`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify(payload),
    });

    console.log(`[aiClient] ⚡ Streaming response started in ${Date.now() - startTime}ms (Session: ${sessionId || 'unknown'})`);

    return response;
}

module.exports = {
    streamChat
};
