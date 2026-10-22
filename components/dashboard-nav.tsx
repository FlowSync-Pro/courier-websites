"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const base = [
  ["/dashboard", "Today"],
  ["/dashboard/quotes", "Quotes"],
  ["/dashboard/clients", "Clients"],
  ["/dashboard/jobs", "Jobs"],
  ["/dashboard/expenses", "Expenses"],
  ["/dashboard/money", "Money"],
] as const;

const commercial = [
  ["/dashboard/vehicles", "Vehicles"],
  ["/dashboard/drivers", "Drivers"],
  ["/dashboard/scale", "Scale"],
  ["/dashboard/dates", "Dates"],
] as const;

export function DashboardNav({ level }: { level: "A" | "B" }) {
  const pathname = usePathname();
  const links = level === "B" ? [...base, ...commercial] : base;
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
        {level === "B" ? "Level B · commercial" : "Level A · small vehicle"}
      </p>
      <nav className="flex gap-2 overflow-x-auto pb-1 md:flex-col">
        {links.map(([href, label]) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "shrink-0 rounded-md px-3 py-2 text-sm font-semibold",
                active ? "bg-brand text-white" : "bg-white text-brand",
              )}
            >
              {label}
            </Link>
          );
        })}
        <a
          href="/dashboard/export"
          className="shrink-0 rounded-md bg-accent px-3 py-2 text-center text-sm font-semibold text-accent-fg"
        >
          Export CSV
        </a>
      </nav>
    </div>
  );
}
