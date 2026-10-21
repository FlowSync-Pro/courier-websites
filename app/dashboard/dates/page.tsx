import { redirect } from "next/navigation";
import { client } from "@/config/site";
import { dashboardLevel } from "@/lib/catalog";
import { daysUntil, formatDay } from "@/lib/utils";

const labels = [
  ["insurance", "Insurance"],
  ["registration", "Registration"],
  ["dot", "DOT"],
  ["mc", "MC"],
] as const;

export default function DatesPage() {
  if (dashboardLevel() !== "B") redirect("/dashboard");
  const rows = client.vehicles.flatMap((vehicle) =>
    labels.flatMap(([key, label]) => {
      const iso = vehicle.keyDates?.[key];
      if (!iso) return [];
      return [{ vehicle: vehicle.name, label, iso, days: daysUntil(iso, client.timezone) }];
    }),
  );
  return (
    <div className="grid gap-4">
      <div>
        <h1 className="font-display text-4xl font-bold">Key dates</h1>
        <p className="text-muted">Insurance, registration, DOT, and MC, so a renewal does not lapse quietly.</p>
      </div>
      {rows.length === 0 ? (
        <p className="rounded-lg border border-line bg-white p-4 text-muted">
          No dates on file. Add them under each vehicle in the client config.
        </p>
      ) : (
        <ul className="grid gap-3">
          {rows.map((row) => (
            <li key={`${row.vehicle}-${row.label}`} className="rounded-lg border border-line bg-white p-4">
              <p className="text-sm text-muted">{row.vehicle}</p>
              <p className="font-display text-3xl font-bold">
                {row.label} · {formatDay(row.iso)}
              </p>
              <p className={`mt-1 text-sm font-semibold ${row.days < 0 ? "text-red-700" : row.days <= 45 ? "text-accent-ink" : "text-muted"}`}>
                {row.days < 0 ? `${Math.abs(row.days)} days past due` : row.days === 0 ? "Due today" : `${row.days} days left`}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
