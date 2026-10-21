import { redirect } from "next/navigation";
import { client } from "@/config/site";
import { monthBooks } from "@/lib/books";
import { dashboardLevel } from "@/lib/catalog";
import { MoneyTables } from "@/components/money-tables";
import { formatMoney, monthKey, monthLabel } from "@/lib/utils";

export default async function ScalePage() {
  if (dashboardLevel() !== "B") redirect("/dashboard");
  const current = monthKey(client.timezone);
  const previous = monthKey(client.timezone, -1);
  const now = await monthBooks(current);
  const last = await monthBooks(previous);
  const delta = now.incomeCents - last.incomeCents;
  return (
    <div className="grid gap-5">
      <div>
        <h1 className="font-display text-4xl font-bold">Scale</h1>
        <p className="text-muted">The whole operation for {monthLabel(current)}, on one screen.</p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Tile label="Income" value={formatMoney(now.incomeCents)} />
        <Tile label="Expenses" value={formatMoney(now.expenseCents)} />
        <Tile label="Profit" value={formatMoney(now.profitCents)} dark />
      </div>
      <p className="rounded-lg border border-line bg-white p-4 text-lg">
        {last.incomeCents === 0 && now.incomeCents === 0
          ? `No income logged for ${monthLabel(previous)} or this month yet.`
          : delta === 0
            ? `Income matches ${monthLabel(previous)}.`
            : delta > 0
              ? `Income is up ${formatMoney(delta)} from ${monthLabel(previous)}.`
              : `Income is down ${formatMoney(Math.abs(delta))} from ${monthLabel(previous)}.`}
      </p>
      <section className="rounded-lg border border-line bg-white p-4">
        <h2 className="font-display text-3xl font-bold">Profit per vehicle</h2>
        <table className="mt-3 w-full text-left text-sm">
          <thead>
            <tr className="text-muted">
              <th className="py-1 font-semibold">Vehicle</th>
              <th className="py-1 font-semibold">Income</th>
              <th className="py-1 font-semibold">Costs</th>
              <th className="py-1 font-semibold">Profit</th>
            </tr>
          </thead>
          <tbody>
            {now.byVehicle.map((vehicle) => (
              <tr key={vehicle.id} className="border-t border-line">
                <td className="py-2 pr-2">{vehicle.label}</td>
                <td className="py-2 pr-2">{formatMoney(vehicle.incomeCents)}</td>
                <td className="py-2 pr-2">{formatMoney(vehicle.directExpenseCents + vehicle.overheadCents)}</td>
                <td className="py-2 font-semibold">{formatMoney(vehicle.profitCents)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <MoneyTables byClient={now.byClient} byService={now.byService} />
      <section className="rounded-lg border border-line bg-white p-4">
        <h2 className="font-display text-3xl font-bold">Recurring routes</h2>
        {now.recurring.length === 0 ? (
          <p className="mt-2 text-muted">No standing routes yet. Mark a client as recurring on the Clients page.</p>
        ) : (
          <ul className="mt-3 grid gap-2">
            {now.recurring.map((item) => (
              <li key={item.id}>
                <span className="font-semibold">{item.business_name || item.name}</span>
                <span className="text-muted"> — {item.schedule || "Schedule not written down yet"}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
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
