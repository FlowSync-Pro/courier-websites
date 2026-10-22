import { client } from "@/config/site";

export function Logo() {
  return (
    <span className="flex min-w-0 items-center gap-2" style={{ color: "var(--brand)" }}>
      {client.logoSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={client.logoSrc} alt="" className="h-9 w-9 object-contain" />
      ) : (
        <svg viewBox="0 0 32 32" className="h-9 w-9 shrink-0" aria-hidden="true">
          <rect width="32" height="32" rx="8" fill="currentColor" />
          <path d="M5 21.5h15.5L24 15H9.2L5 21.5Z" fill="var(--accent)" />
          <circle cx="11" cy="23.5" r="1.7" fill="#fff" />
          <circle cx="21" cy="23.5" r="1.7" fill="#fff" />
        </svg>
      )}
      <span className="truncate text-[1.35rem] font-extrabold leading-none tracking-tight">{client.shortName}</span>
    </span>
  );
}
