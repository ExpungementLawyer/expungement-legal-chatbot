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
          className="flex h-9 w-9 items-center justify-center rounded border border-[#4b5e7e] bg-[#162a49] text-[#f5f7fb] transition hover:border-legal-gold hover:text-white"
          aria-label="Close"
          title="Close"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </header>
  );
}
