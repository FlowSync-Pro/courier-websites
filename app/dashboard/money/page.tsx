import { client } from "@/config/site";
import { monthBooks } from "@/lib/books";
import { dashboardLevel } from "@/lib/catalog";
import { MoneyTables } from "@/components/money-tables";
import { buttonVariants } from "@/components/ui/button";
import { formatMoney, monthKey, monthLabel } from "@/lib/utils";

export default async function MoneyPage() {
  const month = monthKey(client.timezone);
  const books = await monthBooks(month);
  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl font-bold">Money</h1>
          <p className="text-muted">{monthLabel(month)}</p>
        </div>
        <a href="/dashboard/export" className={buttonVariants()}>
          Export CSV
        </a>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Tile label="Income in" value={formatMoney(books.incomeCents)} />
        <Tile label="Expenses out" value={formatMoney(books.expenseCents)} />
        <Tile label="Profit" value={formatMoney(books.profitCents)} dark />
      </div>
      <MoneyTables byClient={books.byClient} byService={books.byService} />
      <p className="text-sm text-muted">
        {books.jobs.length} job{books.jobs.length === 1 ? "" : "s"} and {books.expenses.length} expense
        {books.expenses.length === 1 ? "" : "s"} this month. Profit is income minus logged expenses.
        {dashboardLevel() === "B" ? " Driver pay stays on the Drivers page and is not subtracted again." : ""}
      </p>
    </div>
  );
}

function Tile({ label, value, dark = false }: { label: string; value: string; dark?: boolean }) {
  return (
    <div className={`rounded-lg p-3 ${dark ? "bg-brand text-white" : "border border-line bg-white"}`}>
      <p className={`text-xs font-semibold uppercase tracking-wide ${dark ? "text-white/70" : "text-muted"}`}>{label}</p>
      <p className="mt-1 font-display text-2xl font-bold leading-none sm:text-4xl">{value}</p>
    </div>
  );
}
