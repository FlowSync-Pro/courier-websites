import { client } from "@/config/site";

export function Logo({ tone = "light" }: { tone?: "light" | "dark" }) {
  const text = tone === "light" ? "text-white" : "text-brand";
  return (
    <span className={`flex min-w-0 items-center gap-2 ${text}`}>
      {client.logoSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={client.logoSrc} alt="" className="h-8 w-8 object-contain" />
      ) : (
        <svg viewBox="0 0 32 32" className="h-8 w-8 shrink-0" aria-hidden="true">
          <rect width="32" height="32" rx="6" fill="currentColor" />
          <path d="M5 21.5h15.5L24 15H9.2L5 21.5Z" fill="var(--accent)" />
          <circle cx="11" cy="23.5" r="1.7" fill={tone === "light" ? "#0E1C33" : "white"} />
          <circle cx="21" cy="23.5" r="1.7" fill={tone === "light" ? "#0E1C33" : "white"} />
        </svg>
      )}
      <span className="truncate font-display text-[1.65rem] font-bold leading-none tracking-tight">
        {client.shortName}
      </span>
    </span>
  );
}
