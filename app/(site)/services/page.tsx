import type { Metadata } from "next";
import Link from "next/link";
import { client } from "@/config/site";
import { offeredServices, vehiclesFor } from "@/lib/catalog";
import { SectionHeading } from "../_components/section-heading";
import "../_components/site.module.css";

export const metadata: Metadata = { title: "Services" };

export default function ServicesPage() {
  const services = offeredServices();
  return (
    <div className={`${"wrap"} ${"page"}`}>
      <SectionHeading title="What we [[run]]" />
      <p className={"lede"} style={{ textAlign: "center", marginTop: 16 }}>
        {client.servicesIntro}
      </p>
      {client.showDemandNotes ? (
        <p className={"demand"} style={{ marginTop: 18 }}>
          Demand labels and hourly ranges below are suggested starting points for a driver choosing work. They are not
          guaranteed pay, and they are not a customer rate card.
        </p>
      ) : null}
      <div className={"cards"}>
        {services.map((service) => {
          const vehicles = vehiclesFor(service);
          return (
            <article key={service.id} id={service.id} className={"pageCard"} style={{ scrollMarginTop: 96 }}>
              <h2>{service.name}</h2>
              {client.showDemandNotes && service.demand ? (
                <p className={"demand"}>Demand: {service.demand}</p>
              ) : null}
              <p>{service.what}</p>
              <ul>
                {service.included.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p>
                <b>Vehicle: </b>
                {vehicles.map((vehicle) => vehicle.name).join(", ")}
              </p>
              {client.showDemandNotes ? <p>Suggested for quoting: {service.suggestedRate}. Not guaranteed pay.</p> : null}
              <Link href="/#quote" className={"more"}>
                Get a Quote
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}
