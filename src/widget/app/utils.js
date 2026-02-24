export function getSessionId() {
  const key = 'el_legal_dashboard_session';
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = `ses_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
    sessionStorage.setItem(key, id);
  }
  return id;
}

export function formatTime(ts = Date.now()) {
  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(ts);
}

function cleanText(text) {
  return String(text || '')
    .replace(/\r/g, '')
    .replace(/\t/g, ' ')
    .replace(/\s+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function toLines(text) {
  return cleanText(text)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

export function parseAssistantText(text) {
  const lines = toLines(text);
  const bulletItems = [];
  const notes = [];
  const bodyParts = [];

  for (const line of lines) {
    if (/^([-*•]|\d+\.)\s+/.test(line)) {
      bulletItems.push(line.replace(/^([-*•]|\d+\.)\s+/, '').trim());
      continue;
    }

    if (/(not legal advice|general information|may vary|depends on|cannot guarantee|no guarantee)/i.test(line)) {
      notes.push(line);
      continue;
    }

    bodyParts.push(line);
  }

  const body = bodyParts.join('\n\n') || cleanText(text);

  let title = 'Legal Guidance';
  if (/(eligib|qualif|expung|nondisclosure)/i.test(text)) title = 'Eligibility Insight';
  else if (/(next step|next,|what to do|recommend)/i.test(text)) title = 'Recommended Guidance';
  else if (/(warning|important|note)/i.test(text)) title = 'Important Considerations';

  return {
    title,
    body,
    bulletItems,
    notes,
  };
}

function summarize(text) {
  const plain = cleanText(text).replace(/\n+/g, ' ');
  if (plain.length <= 220) return plain;
  return `${plain.slice(0, 217).trim()}...`;
}

function splitSteps(text) {
  const lines = toLines(text)
    .map((line) => line.replace(/^([-*•]|\d+\.)\s+/, '').trim())
    .filter(Boolean);

  return lines.slice(0, 5);
}

export function buildGuidanceFromAssistant({ text, parsed, eligibilityResult }) {
  if (eligibilityResult) {
    const resultSummary = eligibilityResult.reason || 'Review completed. Your situation may require attorney review.';
    const steps = splitSteps(eligibilityResult.nextSteps || 'Schedule a legal review\nGather your case paperwork');
    const notes = splitSteps(eligibilityResult.disclaimer || '')
      .concat(['This tool provides general information and not legal advice.'])
      .filter(Boolean);

    return {
      summary: summarize(resultSummary),
      nextSteps: steps.length ? steps : ['Schedule a legal review', 'Gather your case paperwork'],
      importantNotes: notes.slice(0, 3),
    };
  }

  const base = parsed || parseAssistantText(text);
  const nextSteps = base.bulletItems.length
    ? base.bulletItems.slice(0, 5)
    : ['Gather dismissal/disposition records', 'Confirm offense level and dates', 'Schedule attorney review for final eligibility'];

  const importantNotes = base.notes.length
    ? base.notes.slice(0, 3)
    : ['This guidance is informational and not legal advice.', 'Eligibility depends on full court history and county records.'];

  return {
    summary: summarize(base.body),
    nextSteps,
    importantNotes,
  };
}
