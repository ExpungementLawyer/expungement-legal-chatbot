export async function postJson(url, body) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body || {}),
  });

  if (!response.ok) {
    let errMessage = 'Request failed.';
    try {
      const payload = await response.json();
      if (payload?.error) errMessage = payload.error;
    } catch {
      // no-op
    }
    throw new Error(errMessage);
  }

  return response.json();
}

export async function streamAssistantReply({ apiBase, message, sessionId, onChunk }) {
  const response = await fetch(`${apiBase}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, sessionId }),
  });

  if (!response.ok) {
    let errMessage = 'Failed to get AI response.';
    try {
      const payload = await response.json();
      if (payload?.error) errMessage = payload.error;
    } catch {
      // no-op
    }
    throw new Error(errMessage);
  }

  if (!response.body) throw new Error('Stream unavailable.');

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  let buffer = '';
  let fullText = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const rawLine of lines) {
      if (!rawLine.startsWith('data: ')) continue;
      const data = rawLine.slice(6).trim();
      if (!data || data === '[DONE]') continue;

      try {
        const parsed = JSON.parse(data);
        let delta = '';

        if (parsed.choices?.[0]?.delta?.content) {
          delta = parsed.choices[0].delta.content;
        } else if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
          delta = parsed.delta.text;
        }

        if (delta) {
          fullText += delta;
          if (typeof onChunk === 'function') onChunk(fullText);
        }
      } catch {
        // Ignore malformed chunk
      }
    }
  }

  return fullText;
}
