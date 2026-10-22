import Link from "next/link";
import { setQuoteStatus } from "@/lib/actions";
import { listQuotes } from "@/lib/queries";
import { formatDay } from "@/lib/utils";

const statuses = ["new", "quoted", "won", "lost"] as const;

export default async function QuotesPage() {
  const quotes = await listQuotes();
  return (
    <div className="grid gap-4">
      <h1 className="font-display text-4xl font-bold">Quote requests</h1>
      {quotes.length === 0 ? (
        <p className="rounded-lg border border-line bg-white p-4 text-muted">
          Nothing yet. A quote from the public form shows up here as New, and the sender is saved under Clients.
        </p>
      ) : (
        quotes.map((quote) => (
          <article key={quote.id} className="rounded-lg border border-line bg-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h2 className="text-lg font-semibold">
                  {quote.client_name}
                  {quote.business_name ? ` · ${quote.business_name}` : ""}
                </h2>
                <p className="text-sm text-muted">
                  {quote.phone} · {quote.email}
                </p>
              </div>
              <span className="rounded-full bg-paper px-2 py-1 text-xs font-semibold uppercase">{quote.status}</span>
            </div>
            <p className="mt-3">
              {quote.pickup} → {quote.dropoff}
            </p>
            <p className="mt-1">{quote.description}</p>
            <p className="mt-1 text-sm text-muted">
              {quote.date_needed ? `Needed ${formatDay(quote.date_needed)}` : ""}
              {quote.pieces ? ` · ${quote.pieces}` : ""}
              {quote.weight ? ` · ${quote.weight}` : ""}
            </p>
            {quote.notes ? <p className="mt-2 text-sm">{quote.notes}</p> : null}
            {quote.photo_path ? (
              <a href={`/media/${quote.photo_path}`} className="mt-3 inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/media/${quote.photo_path}`}
                  alt="Photo attached to the quote"
                  className="h-28 w-28 rounded-md object-cover"
                />
              </a>
            ) : null}
            <div className="mt-4 flex flex-wrap gap-2">
              {statuses.map((status) => (
                <form key={status} action={setQuoteStatus}>
                  <input type="hidden" name="id" value={quote.id} />
                  <input type="hidden" name="status" value={status} />
                  <button
                    type="submit"
                    className={`h-10 rounded-md px-3 text-sm font-semibold ${
                      quote.status === status ? "bg-brand text-white" : "border border-line bg-white"
                    }`}
                  >
                    {status[0].toUpperCase() + status.slice(1)}
                  </button>
                </form>
              ))}
              <Link
                href={`/dashboard/jobs/new?client=${quote.client_id}&pickup=${encodeURIComponent(quote.pickup)}&dropoff=${encodeURIComponent(quote.dropoff)}`}
                className="inline-flex h-10 items-center rounded-md bg-accent px-3 text-sm font-semibold text-accent-fg"
              >
                Log job
              </Link>
            </div>
          </article>
        ))
      )}
    </div>
  );
}
