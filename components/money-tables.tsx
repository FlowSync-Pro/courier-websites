import { formatMoney } from "@/lib/utils";

export function MoneyTables({
  byClient,
  byService,
}: {
  byClient: { key: string; label: string; incomeCents: number; profitCents: number }[];
  byService: { key: string; label: string; incomeCents: number; profitCents: number }[];
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Breakdown title="Profit by client" rows={byClient} empty="No jobs this month, so there is no client profit yet." />
      <Breakdown title="Profit by service" rows={byService} empty="No jobs this month, so there is no service profit yet." />
    </div>
  );
}

function Breakdown({
  title,
  rows,
  empty,
}: {
  title: string;
  rows: { key: string; label: string; incomeCents: number; profitCents: number }[];
  empty: string;
}) {
  return (
    <section className="rounded-lg border border-line bg-white p-4">
      <h2 className="font-display text-3xl font-bold">{title}</h2>
      {rows.length === 0 ? (
        <p className="mt-3 text-sm text-muted">{empty}</p>
      ) : (
        <table className="mt-3 w-full text-left text-sm">
          <thead>
            <tr className="text-muted">
              <th className="py-1 font-semibold">Name</th>
              <th className="py-1 font-semibold">Income</th>
              <th className="py-1 font-semibold">Profit</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key} className="border-t border-line">
                <td className="py-2 pr-2">{row.label}</td>
                <td className="py-2 pr-2">{formatMoney(row.incomeCents)}</td>
                <td className="py-2 font-semibold">{formatMoney(row.profitCents)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <p className="mt-3 text-xs text-muted">Shared expenses are split by each row&apos;s share of income.</p>
    </section>
  );
}
