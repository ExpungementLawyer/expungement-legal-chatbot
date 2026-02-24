import React from 'react';

function ParagraphBlock({ text, className = '' }) {
  const paragraphs = String(text || '')
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className={className}>
      {paragraphs.map((p, idx) => (
        <p key={idx} className={idx > 0 ? 'mt-3' : ''}>
          {p}
        </p>
      ))}
    </div>
  );
}

function SectionList({ title, items, tone = 'default' }) {
  if (!items?.length) return null;

  const toneClass =
    tone === 'warning'
      ? 'border-legal-goldSoft bg-[#f6f1e3] text-legal-warning'
      : 'border-legal-border bg-[#f9f6ef] text-legal-text';

  return (
    <section className={`mt-4 rounded border px-3 py-2 ${toneClass}`}>
      <h5 className="font-display text-sm font-bold tracking-tight">{title}</h5>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-[15px] leading-relaxed">
        {items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

export function UserCard({ entry }) {
  return (
    <article className="el-card-animate w-full rounded border border-legal-border bg-white px-4 py-3 shadow-panel">
      <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-legal-muted">Your Input</div>
      <ParagraphBlock text={entry.body} className="mt-2 text-[16px] leading-relaxed text-legal-text" />
      <div className="mt-3 text-xs font-semibold text-legal-muted">{entry.timestamp}</div>
    </article>
  );
}

export function AssistantCard({ entry }) {
  return (
    <article className="el-card-animate w-full rounded border border-legal-border bg-legal-card px-4 py-4 shadow-panel">
      <div className="flex items-start justify-between gap-3">
        <h4 className="font-display text-[20px] font-bold leading-tight text-legal-navy">{entry.title || 'Legal Guidance'}</h4>
        <span className="whitespace-nowrap text-xs font-semibold text-legal-muted">{entry.timestamp}</span>
      </div>

      <ParagraphBlock text={entry.body} className="mt-3 text-[15px] leading-relaxed text-legal-text" />

      <SectionList title="Key Points" items={entry.bulletItems} />
      <SectionList title="Important Notes" items={entry.notes} tone="warning" />
    </article>
  );
}

export function EligibilityCard({ entry }) {
  return (
    <article className="el-card-animate w-full rounded border border-legal-border bg-legal-card px-4 py-4 shadow-panel">
      <div className="flex items-start justify-between gap-3">
        <h4 className="font-display text-[20px] font-bold leading-tight text-legal-navy">Eligibility Insight</h4>
        <span className="whitespace-nowrap text-xs font-semibold text-legal-muted">{entry.timestamp}</span>
      </div>

      <ParagraphBlock text={entry.body} className="mt-3 text-[15px] leading-relaxed text-legal-text" />

      <SectionList title="Recommended Next Steps" items={entry.bulletItems} />
      <SectionList title="Important Notes" items={entry.notes} tone="warning" />
    </article>
  );
}
