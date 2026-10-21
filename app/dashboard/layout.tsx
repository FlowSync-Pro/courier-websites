import Link from "next/link";
import { client } from "@/config/site";
import { logout } from "@/lib/actions";
import { requireUser } from "@/lib/auth";
import { dashboardLevel } from "@/lib/catalog";
import { DashboardNav } from "@/components/dashboard-nav";

export const runtime = "nodejs";
export const metadata = { title: "Dashboard", robots: { index: false, follow: false } };

export default async function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  await requireUser();
  const level = dashboardLevel();
  return (
    <div className="min-h-full bg-paper">
      <header className="border-b border-white/10 bg-brand text-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4">
          <div className="min-w-0">
            <p className="truncate font-display text-2xl font-bold leading-none">{client.shortName}</p>
            <p className="text-xs text-white/70">Owner dashboard</p>
          </div>
          <div className="flex items-center gap-3 text-sm font-semibold">
            <Link href="/" className="hover:text-accent">
              View site
            </Link>
            <form action={logout}>
              <button type="submit" className="hover:text-accent">
                Log out
              </button>
            </form>
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-6xl gap-5 px-4 py-5 md:grid-cols-[220px_1fr]">
        <DashboardNav level={level} />
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
