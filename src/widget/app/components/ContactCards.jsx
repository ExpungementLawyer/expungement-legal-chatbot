import React, { useState } from 'react';

export function ContactCaptureCard({ onSubmit, disabled }) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  return (
    <article className="el-card-animate w-full rounded border border-legal-border bg-white px-4 py-4 shadow-panel">
      <h4 className="font-display text-[18px] font-bold text-legal-navy">Contact Details</h4>
      <p className="mt-2 text-[14px] text-legal-text">Share an email or phone number so we can provide tailored follow-up guidance.</p>

      <div className="mt-3 grid gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          className="rounded border border-legal-border px-3 py-2 text-sm outline-none focus:border-legal-gold focus:ring-2 focus:ring-[#dcc48f]"
        />
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone number"
          className="rounded border border-legal-border px-3 py-2 text-sm outline-none focus:border-legal-gold focus:ring-2 focus:ring-[#dcc48f]"
        />
      </div>

      <div className="mt-3 flex justify-end">
        <button
          type="button"
          disabled={disabled || (!email.trim() && !phone.trim())}
          onClick={() => onSubmit({ email: email.trim(), phone: phone.trim() })}
          className="rounded border border-legal-navy bg-legal-navy px-4 py-2 text-sm font-bold text-legal-cream transition hover:bg-legal-navyDeep disabled:cursor-not-allowed disabled:bg-[#7d8798]"
        >
          Continue
        </button>
      </div>
    </article>
  );
}

export function LeadCaptureCard({ onSubmit, disabled }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  return (
    <article className="el-card-animate w-full rounded border border-legal-border bg-white px-4 py-4 shadow-panel">
      <h4 className="font-display text-[18px] font-bold text-legal-navy">Request Attorney Follow-Up</h4>
      <p className="mt-2 text-[14px] text-legal-text">Provide contact details and our team will follow up within one business day.</p>

      <div className="mt-3 grid gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="rounded border border-legal-border px-3 py-2 text-sm outline-none focus:border-legal-gold focus:ring-2 focus:ring-[#dcc48f]"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          className="rounded border border-legal-border px-3 py-2 text-sm outline-none focus:border-legal-gold focus:ring-2 focus:ring-[#dcc48f]"
        />
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone number (optional)"
          className="rounded border border-legal-border px-3 py-2 text-sm outline-none focus:border-legal-gold focus:ring-2 focus:ring-[#dcc48f]"
        />
      </div>

      <div className="mt-3 flex justify-end">
        <button
          type="button"
          disabled={disabled || (!name.trim() && !email.trim() && !phone.trim())}
          onClick={() => onSubmit({ name: name.trim(), email: email.trim(), phone: phone.trim() })}
          className="rounded border border-legal-navy bg-legal-navy px-4 py-2 text-sm font-bold text-legal-cream transition hover:bg-legal-navyDeep disabled:cursor-not-allowed disabled:bg-[#7d8798]"
        >
          Submit Request
        </button>
      </div>
    </article>
  );
}
