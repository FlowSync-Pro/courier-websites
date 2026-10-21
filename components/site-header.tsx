import Link from "next/link";
import { client } from "@/config/site";
import { Logo } from "@/components/logo";
import { telHref } from "@/lib/catalog";

const links = [
  ["/", "Home"],
  ["/services", "Services"],
  ["/service-area", "Service Area"],
  ["/about", "About"],
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-brand text-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4">
        <Link href="/" className="min-w-0" aria-label={client.legalName}>
          <Logo />
        </Link>
        <nav className="hidden items-center gap-5 text-sm font-semibold md:flex">
          {links.map(([href, label]) => (
            <Link key={href} href={href} className="hover:text-accent">
              {label}
            </Link>
          ))}
          <a href={telHref()} className="hover:text-accent">
            {client.phoneDisplay}
          </a>
          <Link href="/quote" className="rounded-md bg-accent px-3 py-2 text-brand">
            Get a Quote
          </Link>
        </nav>
        <details className="relative md:hidden">
          <summary className="cursor-pointer rounded-md px-2 py-1 text-sm font-semibold">
            Menu
          </summary>
          <nav className="absolute right-0 z-50 mt-2 w-52 rounded-md border border-line bg-white p-2 text-brand shadow-lg">
            {links.map(([href, label]) => (
              <Link key={href} href={href} className="block rounded px-3 py-2 font-semibold hover:bg-paper">
                {label}
              </Link>
            ))}
            <Link href="/quote" className="block rounded px-3 py-2 font-semibold hover:bg-paper">
              Get a Quote
            </Link>
            <Link href="/login" className="block rounded px-3 py-2 text-sm text-muted hover:bg-paper">
              Owner login
            </Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
