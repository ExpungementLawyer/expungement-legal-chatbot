require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const { evaluateEligibility, buildEligibilityContext } = require('./eligibility-engine');
const { createSession, getCurrentStep, processInput, getResultQuickReplies } = require('./conversation-flow');
const { recordLead, recordEvent, ensureHeaders } = require('./sheets-api');
const { streamChat } = require('./aiClient');

const app = express();

// ═══════════════════════════════════════════════════════════════════════════
// Config
// ═══════════════════════════════════════════════════════════════════════════
const PORT = process.env.PORT || 3001;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'http://localhost:3001')
    .split(',')
    .map((o) => o.trim());

if (!ANTHROPIC_API_KEY) {
    console.error('❌  ANTHROPIC_API_KEY not set. Check .env file.');
    process.exit(1);
}

// ─── System prompt (behavior + guardrails only — no knowledge dump) ────────
const SYSTEM_PROMPT = `You are the Expungement.Legal assistant — a warm, empathetic, and professional chatbot on the expungement.legal website. You serve clients in TEXAS ONLY.

ROLE:
- Help Texas visitors understand if they may be eligible to clear their criminal records
- Answer questions about our services, pricing, and process
- Guide visitors through our eligibility check
- Encourage them to get started or speak with our team

TONE:
- Warm and empathetic — many visitors feel shame or anxiety about their records
- Non-judgmental and encouraging
- Plain language, no legal jargon
- Concise: 2-4 short paragraphs max

SAFETY RULES (CRITICAL — never violate these):
- NEVER give definitive legal advice — always use "may", "could", "might"
- NEVER say "you will be eligible" or "guaranteed" — say "you may be eligible"
- ALWAYS note this is general information, not legal advice
- NEVER ask for SSN, full case numbers, or other sensitive PII
- If unsure, recommend speaking with our attorneys

TEXAS LAW CONTEXT:
- Texas has two paths: Expunction (complete removal for acquittals, dismissals, pardons) and Nondisclosure Orders (sealing for completed deferred adjudication)
- Nondisclosure does NOT apply to convictions — only deferred adjudication completions

PRICING:
- Standard Processing: $1,395 (3-6 months)
- Rush Processing: $2,000 (expedited)
- Payment plans available, no interest
- Free eligibility check: no cost, no obligation

When eligibility context is provided below, use it to inform your response but always maintain the safety rules above.`;

// ═══════════════════════════════════════════════════════════════════════════
// Middleware
// ═══════════════════════════════════════════════════════════════════════════
app.use(
    cors({
        origin: (origin, cb) => {
            if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
            cb(new Error('Not allowed by CORS'));
        },
        methods: ['POST', 'GET', 'OPTIONS'],
        allowedHeaders: ['Content-Type'],
    })
);
app.use(express.json({ limit: '16kb' }));
app.use(express.static(path.join(__dirname, 'public')));

// ═══════════════════════════════════════════════════════════════════════════
// Rate limiter (per IP, in-memory)
// ═══════════════════════════════════════════════════════════════════════════
const rateLimitMap = new Map();
const RATE_WINDOW = 60_000;
const RATE_MAX = 20;

function rateLimiter(req, res, next) {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    let entry = rateLimitMap.get(ip);
    if (!entry || now - entry.start > RATE_WINDOW) {
        entry = { start: now, count: 1 };
        rateLimitMap.set(ip, entry);
        return next();
    }
    entry.count++;
    if (entry.count > RATE_MAX) {
        return res.status(429).json({ error: 'Too many requests. Please slow down.' });
    }
    next();
}

setInterval(() => {
    const now = Date.now();
    for (const [ip, e] of rateLimitMap) {
        if (now - e.start > RATE_WINDOW * 2) rateLimitMap.delete(ip);
    }
}, RATE_WINDOW);

// ═══════════════════════════════════════════════════════════════════════════
// Input sanitization + PII detection
// ═══════════════════════════════════════════════════════════════════════════
const PII_PATTERNS = [
    /\b\d{3}-\d{2}-\d{4}\b/,           // SSN
    /\b\d{9}\b/,                         // 9-digit number (potential SSN)
    /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/, // Credit card
];

function sanitizeInput(text) {
    if (typeof text !== 'string') return '';
    // Strip HTML tags
    let clean = text.replace(/<[^>]*>/g, '');
    // Collapse whitespace
    clean = clean.replace(/\s+/g, ' ').trim();
    return clean;
}

function containsPII(text) {
    return PII_PATTERNS.some((p) => p.test(text));
}

// ═══════════════════════════════════════════════════════════════════════════
// Safety filter (output side)
// ═══════════════════════════════════════════════════════════════════════════
const BANNED_PHRASES = [
    /you will (?:definitely |certainly )?(?:be eligible|qualify|get|receive)/i,
    /guaranteed/i,
    /100%|100 percent/i,
    /i can confirm (?:you|your)/i,
    /we guarantee/i,
];

function addSafetyDisclaimer(text) {
    // If the response doesn't already include a disclaimer, append one
    if (!text.toLowerCase().includes('not legal advice') && !text.toLowerCase().includes('general information')) {
        text += '\n\n_This is general information and not legal advice. Every case is unique._';
    }
    return text;
}

function scanBannedPhrases(text) {
    for (const pattern of BANNED_PHRASES) {
        if (pattern.test(text)) {
            // Replace with softer language
            text = text.replace(pattern, 'you may be eligible');
        }
    }
    return text;
}

// ═══════════════════════════════════════════════════════════════════════════
// Session store (in-memory — for production use Redis)
// ═══════════════════════════════════════════════════════════════════════════
const sessions = new Map();
const SESSION_TTL = 30 * 60 * 1000; // 30 minutes

function getOrCreateSession(sessionId) {
    let session = sessions.get(sessionId);
    if (!session) {
        session = createSession();
        sessions.set(sessionId, session);
    }
    session.lastAccess = Date.now();
    return session;
}

// Cleanup stale sessions
setInterval(() => {
    const now = Date.now();
    for (const [id, s] of sessions) {
        if (now - (s.lastAccess || 0) > SESSION_TTL) sessions.delete(id);
    }
}, SESSION_TTL);

// ═══════════════════════════════════════════════════════════════════════════
// Routes
// ═══════════════════════════════════════════════════════════════════════════

// ─── Flow: get current state ───────────────────────────────────────────────
app.post('/api/flow/state', rateLimiter, (req, res) => {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ error: 'sessionId required' });

    const session = getOrCreateSession(sessionId);
    const step = getCurrentStep(session);

    res.json({
        step: step.id,
        message: step.message,
        quickReplies: step.quickReplies,
        inputType: step.inputType || null,
    });
});

// ─── Flow: advance state ──────────────────────────────────────────────────
app.post('/api/flow/advance', rateLimiter, (req, res) => {
    const { sessionId, input } = req.body;
    if (!sessionId) return res.status(400).json({ error: 'sessionId required' });

    const session = getOrCreateSession(sessionId);

    // If contact_form input, also save as a lead early
    if (input && typeof input === 'object' && (input.email || input.phone)) {
        recordLead({
            sessionId,
            name: session.collectedData.firstName || '',
            email: sanitizeInput(input.email || ''),
            phone: sanitizeInput(input.phone || ''),
            state: session.collectedData.jurisdiction || '',
            offenseType: session.collectedData.offenseLevel || '',
            eligibilityResult: 'in_progress',
        });
        recordEvent({ sessionId, event: 'contact_captured_early', data: { hasEmail: !!input.email } });
    }

    const { step, needsEligibility, eligibilityInput } = processInput(session, input);

    let eligibilityResult = null;
    let quickReplies = step.quickReplies;

    if (needsEligibility && eligibilityInput) {
        eligibilityResult = evaluateEligibility(eligibilityInput);
        session.eligibilityResult = eligibilityResult;
        session.bucket = eligibilityResult.bucket;
        session.status = eligibilityResult.status;

        // Set status-specific quick replies
        quickReplies = getResultQuickReplies(eligibilityResult);

        recordEvent({
            sessionId,
            event: 'eligibility_check',
            data: {
                offenseLevel: eligibilityInput.offenseLevel,
                outcome: eligibilityInput.caseOutcome,
                bucket: eligibilityResult.bucket,
                status: eligibilityResult.status,
            },
        });
    }

    res.json({
        step: step.id,
        message: step.message,
        quickReplies,
        inputType: step.inputType || null,
        eligibilityResult,
    });
});

// ─── Chat: AI-powered free-form chat ──────────────────────────────────────
app.post('/api/chat', rateLimiter, async (req, res) => {
    const { message, sessionId } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
        return res.status(400).json({ error: 'message is required.' });
    }
    if (message.length > 2000) {
        return res.status(400).json({ error: 'Message too long (max 2000 chars).' });
    }

    const clean = sanitizeInput(message);
    if (containsPII(clean)) {
        return res.status(400).json({
            error: 'For your safety, please do not share sensitive personal information like SSN or credit card numbers in chat. Our team will collect necessary information securely.',
        });
    }

    // Build context from session eligibility data
    const session = sessionId ? getOrCreateSession(sessionId) : null;
    let extraContext = '';

    // Load knowledge base dynamically so user can edit it
    try {
        const kbPath = path.join(__dirname, 'knowledge-base.md');
        if (fs.existsSync(kbPath)) {
            const kbText = fs.readFileSync(kbPath, 'utf8');
            extraContext += '\n\n## Knowledge Base / FAQs\n' + kbText;
        }
    } catch (e) {
        console.error('Failed to load knowledge-base.md', e);
    }

    if (session?.eligibilityResult) {
        extraContext += '\n\n' + buildEligibilityContext(session.eligibilityResult);
    }

    try {
        const tools = [
            {
                name: "check_county_docket",
                description: "Queries the county court API to check the public docket status for a specific case.",
                input_schema: {
                    type: "object",
                    properties: {
                        case_number: { type: "string", description: "The court case number (e.g., CR-2023-1234)" },
                        county: { type: "string", description: "The Texas county name (e.g., Travis, Harris)" }
                    },
                    required: ["case_number", "county"]
                }
            }
        ];

        const response = await streamChat({
            systemPrompt: SYSTEM_PROMPT + extraContext,
            messages: [{ role: 'user', content: clean }],
            tools: tools,
            sessionId: sessionId
        });

        // Track analytics
        if (sessionId) {
            recordEvent({ sessionId, event: 'chat_message', data: { length: clean.length } });
        }

        // Stream SSE to client
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no');

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                res.write(decoder.decode(value, { stream: true }));
            }
        } catch (err) {
            console.error('Stream error:', err.message);
        }

        res.end();
    } catch (err) {
        console.error('Proxy error:', err.message);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Internal server error.' });
        }
    }
});

// ─── Lead capture ─────────────────────────────────────────────────────────
app.post('/api/lead', rateLimiter, async (req, res) => {
    const { sessionId, name, email, phone } = req.body;

    if (!name && !email && !phone) {
        return res.status(400).json({ error: 'At least one contact field required.' });
    }

    const session = sessionId ? sessions.get(sessionId) : null;
    const eligResult = session?.eligibilityResult;

    await recordLead({
        sessionId: sessionId || 'unknown',
        name: sanitizeInput(name || ''),
        email: sanitizeInput(email || ''),
        phone: sanitizeInput(phone || ''),
        state: session?.collectedData?.jurisdiction || '',
        offenseType: session?.collectedData?.offenseLevel || '',
        eligibilityResult: eligResult?.status || '',
    });

    // Track analytics
    if (sessionId) {
        recordEvent({ sessionId, event: 'lead_captured', data: { hasEmail: !!email, hasPhone: !!phone } });
    }

    res.json({ success: true, message: 'Thank you! Our team will be in touch.' });
});

// ─── Analytics event ──────────────────────────────────────────────────────
app.post('/api/event', rateLimiter, (req, res) => {
    const { sessionId, event, data } = req.body;
    if (!event) return res.status(400).json({ error: 'event required' });
    recordEvent({ sessionId: sessionId || 'unknown', event, data });
    res.json({ ok: true });
});

// ─── Health check ─────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ═══════════════════════════════════════════════════════════════════════════
// Start
// ═══════════════════════════════════════════════════════════════════════════
app.listen(PORT, async () => {
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║  Expungement.Legal Chatbot                                ║
║  ─────────────────────────────────────────────────────── ║
║  Server:   http://localhost:${String(PORT).padEnd(5)}                        ║
║  Agent:    Anthropic API (claude-3-5-sonnet)              ║
║  CORS:     ${ALLOWED_ORIGINS.join(', ').substring(0, 44).padEnd(44)} ║
╚═══════════════════════════════════════════════════════════╝
  `);

    // Initialize Google Sheets (non-blocking)
    await ensureHeaders().catch(() => { });
});
