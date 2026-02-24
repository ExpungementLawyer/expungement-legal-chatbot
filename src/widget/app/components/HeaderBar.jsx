import React from 'react';

export default function HeaderBar({ onClose }) {
  return (
    <header className="border-b border-legal-border bg-legal-navy px-5 py-4 text-legal-cream">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="font-display text-xl font-bold tracking-tight">Expungement.Legal</div>
          <div className="mt-1 flex items-center gap-2 text-sm font-semibold text-[#d6c08f]">
            <span className="h-2 w-2 rounded-full bg-legal-gold" />
            AI Legal Assistant Online
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded border border-[#4b5e7e] px-2 py-1 text-sm text-[#e8ecf5] transition hover:border-legal-gold hover:text-white"
          aria-label="Close"
        >
          Close
        </button>
      </div>
    </header>
  );
}
