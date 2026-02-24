import React from 'react';

export default function QuickReplies({ items, onSelect, disabled = false }) {
  if (!items?.length) return null;

  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(item)}
          className="rounded border border-legal-border bg-white px-3 py-2 text-sm font-semibold text-legal-navy transition hover:border-legal-gold hover:bg-[#f8f3e8] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
