import Link from "next/link";
import { setJobPaid } from "@/lib/actions";
import { dashboardLevel, serviceName, vehicleName } from "@/lib/catalog";
import { listJobs } from "@/lib/queries";
import { buttonVariants } from "@/components/ui/button";
import { formatDay, formatMoney } from "@/lib/utils";

export default function JobsPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  return <JobsBody searchParams={searchParams} />;
}

async function JobsBody({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const params = await searchParams;
  const level = dashboardLevel();
  const jobs = await listJobs();
  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-4xl font-bold">Jobs</h1>
        <Link href="/dashboard/jobs/new" className={buttonVariants()}>
          Log a job
        </Link>
      </div>
      {params.saved ? <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-900">Job saved.</p> : null}
      {jobs.length === 0 ? (
        <p className="rounded-lg border border-line bg-white p-4 text-muted">
          No jobs yet. Logging one takes a client, a route, and an amount.
        </p>
      ) : (
        <ul className="grid gap-3">
          {jobs.map((job) => (
            <li key={job.id} className="rounded-lg border border-line bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">
                    {formatDay(job.job_date)} · {job.client_name}
                  </p>
                  <p>
                    {job.pickup} → {job.dropoff}
                  </p>
                  <p className="text-sm text-muted">
                    {serviceName(job.service_id)}
                    {job.miles != null ? ` · ${job.miles} mi` : ""}
                    {level === "B" && job.vehicle_id ? ` · ${vehicleName(job.vehicle_id)}` : ""}
                    {level === "B" && job.driver_name ? ` · ${job.driver_name}` : ""}
                  </p>
                  {level === "B" && (job.pallets || job.pieces || job.weight || job.liftgate || job.waiting_minutes) ? (
                    <p className="mt-1 text-sm">
                      {[
                        job.pallets && `${job.pallets} pallets`,
                        job.pieces && `${job.pieces} pieces`,
                        job.weight && job.weight,
                        job.liftgate ? "Liftgate" : "",
                        job.waiting_minutes ? `${job.waiting_minutes} min waiting` : "",
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  ) : null}
                </div>
                <p className="font-display text-3xl font-bold">{formatMoney(job.amount_cents)}</p>
              </div>
              {level === "B" && job.pod_photo_path ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`/media/${job.pod_photo_path}`}
                  alt="Proof of delivery"
                  className="mt-3 h-24 w-24 rounded-md object-cover"
                />
              ) : null}
              <form action={setJobPaid} className="mt-3">
                <input type="hidden" name="id" value={job.id} />
                <input type="hidden" name="paid" value={job.paid ? "0" : "1"} />
                <button type="submit" className="text-sm font-semibold text-accent-ink">
                  {job.paid ? "Mark unpaid" : "Mark paid"}
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
