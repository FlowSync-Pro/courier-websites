import type { Metadata } from "next";
import Link from "next/link";
import { client } from "@/config/site";
import { buttonVariants } from "@/components/ui/button";
import { offeredServices, vehiclesFor } from "@/lib/catalog";

export const metadata: Metadata = { title: "Services" };

export default function ServicesPage() {
  const services = offeredServices();
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <p className="text-sm font-semibold uppercase tracking-wide text-accent-ink">Services</p>
      <h1 className="mt-1 font-display text-5xl font-bold leading-none">What we run</h1>
      <p className="mt-3 text-lg text-muted">{client.servicesIntro}</p>
      {client.showDemandNotes ? (
        <p className="mt-4 rounded-md border border-line bg-white p-4 text-sm leading-relaxed">
          Demand labels and hourly ranges below are suggested starting points for a driver choosing work.
          They are not guaranteed pay, and they are not a customer rate card. Small-vehicle work is quoted
          from the hour. Big-vehicle work is quoted per load.
        </p>
      ) : null}
      <div className="mt-8 grid gap-6">
        {services.map((service) => {
          const vehicles = vehiclesFor(service);
          return (
            <article key={service.id} id={service.id} className="scroll-mt-20 rounded-lg border border-line bg-white p-5">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-4xl font-bold">{service.name}</h2>
                {client.showDemandNotes && service.demand ? (
                  <span className="rounded-full bg-paper px-2 py-1 text-xs font-semibold">Demand: {service.demand}</span>
                ) : null}
              </div>
              <p className="mt-3 text-lg">{service.what}</p>
              <h3 className="mt-4 text-sm font-semibold uppercase tracking-wide text-muted">Included</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {service.included.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="mt-4 text-sm">
                <span className="font-semibold">Vehicle: </span>
                {vehicles.map((vehicle) => vehicle.name).join(", ")}
              </p>
              {client.showDemandNotes ? (
                <p className="mt-3 text-sm text-muted">
                  Suggested for quoting: {service.suggestedRate}. Not guaranteed pay.
                </p>
              ) : null}
              <Link href="/quote" className={`${buttonVariants()} mt-5`}>
                Get a Quote
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}
