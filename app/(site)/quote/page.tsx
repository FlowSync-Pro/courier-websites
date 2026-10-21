import type { Metadata } from "next";
import { client } from "@/config/site";
import { QuoteForm } from "@/components/quote-form";
import { piecesLabel, smsHref, telHref } from "@/lib/catalog";

export const metadata: Metadata = { title: "Get a Quote" };

export default function QuotePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <p className="text-sm font-semibold uppercase tracking-wide text-accent-ink">Quote</p>
      <h1 className="mt-1 font-display text-5xl font-bold leading-none">Get a Quote</h1>
      <p className="mt-3 text-lg text-muted">
        Tell us the pickup, the drop-off, and when you need it. If forms are not your thing, call or text{" "}
        {client.phoneDisplay}.
      </p>
      <div className="mt-6">
        <QuoteForm
          piecesLabel={piecesLabel()}
          phoneDisplay={client.phoneDisplay}
          telHref={telHref()}
          smsHref={smsHref()}
        />
      </div>
    </div>
  );
}
