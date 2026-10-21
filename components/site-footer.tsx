import Link from "next/link";
import { client } from "@/config/site";
import { smsHref, telHref } from "@/lib/catalog";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-brand text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <p className="font-display text-3xl font-bold">{client.legalName}</p>
          <p className="mt-2 max-w-sm text-white/80">{client.ownerLine}</p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">Reach us</p>
          <a href={telHref()} className="mt-2 block text-2xl font-semibold">
            {client.phoneDisplay}
          </a>
          <a href={smsHref()} className="mt-1 block text-white/80">
            Text this number
          </a>
          <a href={`mailto:${client.email}`} className="mt-1 block text-white/80">
            {client.email}
          </a>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">Service area</p>
          <p className="mt-2 text-white/80">{client.serviceArea.region}</p>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            <Link href="/services">Services</Link>
            <Link href="/service-area">Service area</Link>
            <Link href="/about">About</Link>
            <Link href="/quote">Get a Quote</Link>
            <Link href="/login">Owner login</Link>
          </div>
        </div>
      </div>
      <p className="border-t border-white/10 px-4 py-3 text-center text-[11px] text-white/60">
        Photos are credited under each picture. Placeholder phone: {client.phoneDisplay}.
      </p>
    </footer>
  );
}
