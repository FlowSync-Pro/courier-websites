import Link from "next/link";
import { client } from "@/config/site";
import { monthBooks } from "@/lib/books";
import { dashboardLevel } from "@/lib/catalog";
import { listQuotes } from "@/lib/queries";
import { buttonVariants } from "@/components/ui/button";
import { formatMoney, monthKey, monthLabel } from "@/lib/utils";

export default async function DashboardHome() {
  const level = dashboardLevel();
  const month = monthKey(client.timezone);
  const books = await monthBooks(month);
  const quotes = await listQuotes();
  const fresh = quotes.filter((quote) => quote.status === "new");
  return (
    <div className="grid gap-5">
      <div>
        <h1 className="font-display text-4xl font-bold">{monthLabel(month)}</h1>
        <p className="text-muted">
          {level === "B"
            ? "Commercial books: income, expenses, and the vehicles and drivers behind them."
            : "Small-vehicle books: quotes, clients, jobs, expenses, and profit."}
        </p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Stat label="Income" value={formatMoney(books.incomeCents)} />
        <Stat label="Expenses" value={formatMoney(books.expenseCents)} />
        <Stat label="Profit" value={formatMoney(books.profitCents)} emphasis />
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        <Link href="/dashboard/jobs/new" className={buttonVariants({ size: "lg" })}>
          Log a job
        </Link>
        <Link href="/dashboard/expenses/new" className={buttonVariants({ variant: "outline", size: "lg" })}>
          Log an expense
        </Link>
        <a href="/dashboard/export" className={buttonVariants({ variant: "brand", size: "lg" })}>
          Export CSV
        </a>
      </div>
      <section className="rounded-lg border border-line bg-white p-4">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="font-display text-3xl font-bold">New quotes</h2>
          <Link href="/dashboard/quotes" className="text-sm font-semibold text-accent-ink">
            All quotes
          </Link>
        </div>
        {fresh.length === 0 ? (
          <p className="mt-3 text-muted">
            No new quote requests. When someone uses the quote form, they land here and under Clients.
          </p>
        ) : (
          <ul className="mt-3 grid gap-3">
            {fresh.slice(0, 4).map((quote) => (
              <li key={quote.id} className="border-t border-line pt-3">
                <p className="font-semibold">
                  {quote.client_name}
                  {quote.business_name ? ` · ${quote.business_name}` : ""}
                </p>
                <p className="text-sm text-muted">
                  {quote.pickup} → {quote.dropoff}
                </p>
                <p className="text-sm">{quote.description}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value, emphasis = false }: { label: string; value: string; emphasis?: boolean }) {
  return (
    <div className={`rounded-lg p-3 ${emphasis ? "bg-brand text-white" : "border border-line bg-white"}`}>
      <p className={`text-xs font-semibold uppercase tracking-wide ${emphasis ? "text-white/70" : "text-muted"}`}>
        {label}
      </p>
      <p className="mt-1 font-display text-2xl font-bold leading-none sm:text-3xl">{value}</p>
    </div>
  );
}
