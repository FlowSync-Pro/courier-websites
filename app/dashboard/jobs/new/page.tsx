import Link from "next/link";
import { client } from "@/config/site";
import { JobForm } from "@/components/job-form";
import { dashboardLevel, offeredServices } from "@/lib/catalog";
import { listClients, listDrivers } from "@/lib/queries";
import { todayISO } from "@/lib/utils";

export default async function NewJobPage({
  searchParams,
}: {
  searchParams: Promise<{ client?: string; pickup?: string; dropoff?: string }>;
}) {
  const params = await searchParams;
  const level = dashboardLevel();
  const clients = await listClients();
  const drivers = await listDrivers();
  return (
    <div className="grid gap-4">
      <div>
        <Link href="/dashboard/jobs" className="text-sm font-semibold text-accent-ink">
          Back to jobs
        </Link>
        <h1 className="font-display text-4xl font-bold">Log a job</h1>
        <p className="text-muted">Client, route, amount. Under a minute on a phone.</p>
      </div>
      <div className="rounded-lg border border-line bg-white p-4">
        <JobForm
          level={level}
          clients={clients.map((item) => ({
            id: item.id,
            name: item.business_name ? `${item.name} · ${item.business_name}` : item.name,
          }))}
          services={offeredServices().map((service) => ({ id: service.id, name: service.name }))}
          vehicles={client.vehicles.map((vehicle) => ({ id: vehicle.id, name: vehicle.name }))}
          drivers={drivers.map((driver) => driver.name)}
          defaultDate={todayISO(client.timezone)}
          defaultClient={params.client ?? ""}
          defaultPickup={params.pickup ?? ""}
          defaultDropoff={params.dropoff ?? ""}
        />
      </div>
    </div>
  );
}
