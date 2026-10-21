import { redirect } from "next/navigation";
import { client } from "@/config/site";
import { setDriverPaid } from "@/lib/actions";
import { DriverForm } from "@/components/driver-form";
import { dashboardLevel } from "@/lib/catalog";
import { jobsInMonth, listDrivers } from "@/lib/queries";
import { formatMoney, monthKey, monthLabel } from "@/lib/utils";

export default async function DriversPage() {
  if (dashboardLevel() !== "B") redirect("/dashboard");
  const month = monthKey(client.timezone);
  const drivers = await listDrivers();
  const jobs = (await jobsInMonth(month)).filter((job) => job.driver_name);
  const names = new Set([...drivers.map((driver) => driver.name), ...jobs.map((job) => job.driver_name)]);
  return (
    <div className="grid gap-4">
      <div>
        <h1 className="font-display text-4xl font-bold">Drivers</h1>
        <p className="text-muted">{monthLabel(month)} — what each driver ran, and what they are owed.</p>
      </div>
      <DriverForm />
      {[...names].length === 0 ? (
        <p className="text-muted">No drivers yet. Add one here, or type a name when you log a job.</p>
      ) : (
        [...names].sort().map((name) => {
          const driverJobs = jobs.filter((job) => job.driver_name === name);
          const billed = driverJobs.reduce((total, job) => total + job.amount_cents, 0);
          const pay = driverJobs.reduce((total, job) => total + (job.driver_pay_cents ?? 0), 0);
          const owed = driverJobs
            .filter((job) => !job.driver_paid)
            .reduce((total, job) => total + (job.driver_pay_cents ?? 0), 0);
          const phone = drivers.find((driver) => driver.name === name)?.phone;
          return (
            <article key={name} className="rounded-lg border border-line bg-white p-4">
              <h2 className="font-display text-3xl font-bold">{name}</h2>
              <p className="text-sm text-muted">{phone || "No phone on file"}</p>
              <dl className="mt-3 grid grid-cols-3 gap-2 text-sm">
                <div>
                  <dt className="text-muted">Jobs</dt>
                  <dd className="text-lg font-semibold">{driverJobs.length}</dd>
                </div>
                <div>
                  <dt className="text-muted">Billed</dt>
                  <dd className="text-lg font-semibold">{formatMoney(billed)}</dd>
                </div>
                <div>
                  <dt className="text-muted">Owed</dt>
                  <dd className="text-lg font-semibold">{formatMoney(owed)}</dd>
                </div>
              </dl>
              <p className="mt-2 text-xs text-muted">Driver pay entered on jobs this month: {formatMoney(pay)}.</p>
              <ul className="mt-3 grid gap-2">
                {driverJobs.map((job) => (
                  <li key={job.id} className="flex flex-wrap items-center justify-between gap-2 border-t border-line pt-2 text-sm">
                    <span>
                      {job.job_date} · {job.client_name} · {job.pickup} → {job.dropoff}
                    </span>
                    <form action={setDriverPaid}>
                      <input type="hidden" name="id" value={job.id} />
                      <input type="hidden" name="paid" value={job.driver_paid ? "0" : "1"} />
                      <button type="submit" className="font-semibold text-accent-ink">
                        {job.driver_paid ? "Paid" : "Mark payout paid"}
                      </button>
                    </form>
                  </li>
                ))}
              </ul>
            </article>
          );
        })
      )}
    </div>
  );
}
