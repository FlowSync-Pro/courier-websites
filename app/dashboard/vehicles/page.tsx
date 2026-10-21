import { redirect } from "next/navigation";
import { client } from "@/config/site";
import { monthBooks } from "@/lib/books";
import { dashboardLevel } from "@/lib/catalog";
import { formatMoney, monthKey, monthLabel } from "@/lib/utils";

export default async function VehiclesPage() {
  if (dashboardLevel() !== "B") redirect("/dashboard");
  const month = monthKey(client.timezone);
  const books = await monthBooks(month);
  return (
    <div className="grid gap-4">
      <div>
        <h1 className="font-display text-4xl font-bold">Vehicles</h1>
        <p className="text-muted">{monthLabel(month)} — which truck makes money, and which one eats it.</p>
      </div>
      <div className="grid gap-3">
        {books.byVehicle.map((vehicle) => (
          <article key={vehicle.id} className="rounded-lg border border-line bg-white p-4">
            <h2 className="font-display text-3xl font-bold">{vehicle.label}</h2>
            <dl className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
              <div>
                <dt className="text-muted">Income</dt>
                <dd className="text-lg font-semibold">{formatMoney(vehicle.incomeCents)}</dd>
              </div>
              <div>
                <dt className="text-muted">Direct costs</dt>
                <dd className="text-lg font-semibold">{formatMoney(vehicle.directExpenseCents)}</dd>
              </div>
              <div>
                <dt className="text-muted">Overhead share</dt>
                <dd className="text-lg font-semibold">{formatMoney(vehicle.overheadCents)}</dd>
              </div>
              <div>
                <dt className="text-muted">Profit</dt>
                <dd className="text-lg font-semibold">{formatMoney(vehicle.profitCents)}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
      <p className="text-sm text-muted">
        Fuel, maintenance, insurance, and tires tagged to a vehicle stay on that vehicle. Overhead is split by
        each vehicle&apos;s share of income. Untagged overhead this month: {formatMoney(books.overheadCents)}.
      </p>
    </div>
  );
}
