export function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <circle cx="9" cy="9" r="9" fill="#16C15A" />
      <path d="M5 9.2 7.6 12 13 6.2" fill="none" stroke="#fff" strokeWidth="2" />
    </svg>
  );
}

export function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <rect x="3" y="7" width="10" height="7" rx="1.5" fill="currentColor" />
      <path d="M5 7V5a3 3 0 0 1 6 0v2" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function StepIcon({ name }: { name: "quote" | "price" | "truck" | "done" }) {
  if (name === "quote") {
    return (
      <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true">
        <rect x="8" y="6" width="20" height="24" rx="3" {...stroke} />
        <path d="M13 14h10M13 19h10M13 24h6" {...stroke} />
      </svg>
    );
  }
  if (name === "price") {
    return (
      <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true">
        <circle cx="18" cy="18" r="10" {...stroke} />
        <path d="M18 12v12M15 15.5c.6-1 1.6-1.5 3-1.5 1.8 0 3 1 3 2.4S19.8 19 18 19s-3 .8-3 2.3 1.3 2.4 3.1 2.4c1.4 0 2.4-.5 3-1.4" {...stroke} />
      </svg>
    );
  }
  if (name === "truck") {
    return (
      <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true">
        <path d="M6 23V13h14v10M20 17h6l4 4v2H20" {...stroke} />
        <circle cx="12" cy="25" r="2.2" {...stroke} />
        <circle cx="25" cy="25" r="2.2" {...stroke} />
      </svg>
    );
  }
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true">
      <circle cx="18" cy="18" r="10" {...stroke} />
      <path d="m13 18 3.2 3.2L23 14.5" {...stroke} />
    </svg>
  );
}
