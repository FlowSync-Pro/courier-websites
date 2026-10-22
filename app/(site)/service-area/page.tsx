import type { Metadata } from "next";
import Link from "next/link";
import { client } from "@/config/site";
import { SectionHeading } from "../_components/section-heading";
import "../_components/site.module.css";

export const metadata: Metadata = { title: "Service area" };

export default function ServiceAreaPage() {
  return (
    <div className={`${"wrap"} ${"page"}`}>
      <SectionHeading title={client.serviceArea.region} />
      <p className={"lede"} style={{ textAlign: "center", marginTop: 16 }}>
        {client.serviceArea.intro}
      </p>
      <div className={"cards"}>
        {client.serviceArea.areas.map((area) => (
          <article key={area.name} className={"pageCard"}>
            <h2>{area.name}</h2>
            <p>{area.body}</p>
          </article>
        ))}
      </div>
      <p className={"pageCard"} style={{ marginTop: 18 }}>
        {client.serviceArea.outsideNote}
      </p>
      <p style={{ textAlign: "center", marginTop: 20 }}>
        <Link href="/#quote" className={`${"pill"} ${"centerCta"}`}>
          <b>Get My Free Quote</b>
          <span>Across {client.serviceArea.region}</span>
        </Link>
      </p>
    </div>
  );
}
