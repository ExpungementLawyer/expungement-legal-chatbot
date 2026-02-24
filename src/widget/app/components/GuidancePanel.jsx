import React from 'react';

function GuidanceSection({ title, items }) {
  return (
    <section className="rounded border border-legal-border bg-white px-4 py-3 shadow-panel">
      <h5 className="font-display text-[17px] font-bold text-legal-navy">{title}</h5>
      {Array.isArray(items) ? (
        <ul className="mt-2 list-disc space-y-1 pl-5 text-[14px] leading-relaxed text-legal-text">
          {items.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-[14px] leading-relaxed text-legal-text">{items}</p>
      )}
    </section>
  );
}

export default function GuidancePanel({ guidance }) {
  const safeGuidance = guidance || {
    summary: 'Provide a few details about your case to generate a tailored summary.',
    nextSteps: ['Describe your charges and case outcome.', 'Include dates when available.'],
    importantNotes: ['This tool provides general legal information only.'],
  };

  return (
    <aside className="h-full overflow-y-auto border-l border-legal-border bg-legal-panel px-4 py-4 lg:sticky lg:top-0">
      <div className="rounded border border-legal-goldSoft bg-[#efe6d2] px-4 py-3">
        <h4 className="font-display text-[20px] font-bold text-legal-navy">Legal Guidance Panel</h4>
        <p className="mt-1 text-[13px] text-legal-muted">Updated from the latest assistant response.</p>
      </div>

      <div className="mt-4 space-y-3">
        <GuidanceSection title="Your Situation Summary" items={safeGuidance.summary} />
        <GuidanceSection title="Recommended Next Steps" items={safeGuidance.nextSteps} />
        <GuidanceSection title="Important Notes" items={safeGuidance.importantNotes} />
      </div>
    </aside>
  );
}
