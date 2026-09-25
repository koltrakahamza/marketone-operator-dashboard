export function Brand({ light = false }: { light?: boolean }) {
  return (
    <div className={`brand ${light ? 'brand-light' : ''}`} aria-label="MarketOne">
      <svg className="brand-mark" viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <rect width="40" height="40" rx="12" fill="currentColor" />
        <path
          d="M10 27V15a2 2 0 0 1 3.5-1.3L20 22l6.5-8.3A2 2 0 0 1 30 15v12"
          stroke="var(--brand-mark-ink, #e4efc8)"
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>
        market<span className="brand-one">one</span>
        <span className="brand-dot">.</span>
      </span>
    </div>
  );
}
