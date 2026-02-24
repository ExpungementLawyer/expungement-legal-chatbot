import React from 'react';

export default function InputComposer({
  value,
  onChange,
  onSubmit,
  disabled,
  placeholder,
  singleLine = false,
  inputMode = 'text',
  autoCapitalize = 'none',
  containerRef = null,
  inputRef = null,
  onInputFocus = null,
  onInputBlur = null,
}) {
  const handleKeyDown = (event) => {
    if (!singleLine) return;
    if (event.key !== 'Enter') return;
    event.preventDefault();
    onSubmit();
  };

  return (
    <div ref={containerRef} className="el-composer border-t border-legal-border bg-[#f7f2e8] p-4">
      <label htmlFor="el-legal-composer" className="sr-only">
        Describe your situation
      </label>
      {singleLine ? (
        <input
          ref={inputRef}
          id="el-legal-composer"
          type="text"
          value={value}
          inputMode={inputMode}
          autoCapitalize={autoCapitalize}
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="send"
          onKeyDown={handleKeyDown}
          onFocus={onInputFocus || undefined}
          onBlur={onInputBlur || undefined}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || 'Describe your situation...'}
          className="w-full rounded border border-legal-border bg-white px-3 py-3 text-base leading-relaxed text-legal-text outline-none transition focus:border-legal-gold focus:ring-2 focus:ring-[#dcc48f]"
        />
      ) : (
        <textarea
          ref={inputRef}
          id="el-legal-composer"
          rows={3}
          value={value}
          autoCapitalize={autoCapitalize}
          onFocus={onInputFocus || undefined}
          onBlur={onInputBlur || undefined}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || 'Describe your situation...'}
          className="w-full resize-none rounded border border-legal-border bg-white px-3 py-2 text-base leading-relaxed text-legal-text outline-none transition focus:border-legal-gold focus:ring-2 focus:ring-[#dcc48f] sm:resize-y sm:text-[15px]"
        />
      )}
      <div className="mt-3 flex justify-end">
        <button
          type="button"
          disabled={disabled || !value.trim()}
          onClick={onSubmit}
          className="rounded border border-legal-navy bg-legal-navy px-4 py-2 text-sm font-bold uppercase tracking-wide text-legal-cream transition hover:bg-legal-navyDeep disabled:cursor-not-allowed disabled:border-[#6a7890] disabled:bg-[#7d8798]"
        >
          Get Guidance
        </button>
      </div>
    </div>
  );
}
