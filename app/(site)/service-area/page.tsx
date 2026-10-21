import type { Metadata } from "next";
import Link from "next/link";
import { client } from "@/config/site";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = { title: "Service area" };

export default function ServiceAreaPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <p className="text-sm font-semibold uppercase tracking-wide text-accent-ink">Service area</p>
      <h1 className="mt-1 font-display text-5xl font-bold leading-none">{client.serviceArea.region}</h1>
      <p className="mt-4 text-lg">{client.serviceArea.intro}</p>
      <div className="mt-8 grid gap-6">
        {client.serviceArea.areas.map((area) => (
          <article key={area.name}>
            <h2 className="font-display text-3xl font-bold">{area.name}</h2>
            <p className="mt-2 text-lg leading-relaxed">{area.body}</p>
          </article>
        ))}
      </div>
      <p className="mt-8 rounded-md bg-brand px-4 py-4 text-lg text-white">{client.serviceArea.outsideNote}</p>
      <Link href="/quote" className={`${buttonVariants({ size: "lg" })} mt-6`}>
        Get a Quote
      </Link>
    </div>
  );
}
