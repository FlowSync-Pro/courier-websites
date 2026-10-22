import type { Metadata } from "next";
import Link from "next/link";
import { client } from "@/config/site";
import { PhotoFrame } from "@/components/photo-frame";
import { formatDay } from "@/lib/utils";
import { SectionHeading } from "../_components/section-heading";
import "../_components/site.module.css";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  const compliance = client.compliance;
  const hasCompliance = Boolean(compliance && (compliance.insurance || compliance.dot || compliance.mc));
  return (
    <div className={`${"wrap"} ${"page"}`}>
      <SectionHeading title={client.about.heading} />
      <div className={"cards"} style={{ marginTop: 28 }}>
        {client.about.story.map((sentence) => (
          <p key={sentence} className={"lede"} style={{ margin: 0 }}>
            {sentence}
          </p>
        ))}
      </div>
      <div className={"cards"}>
        {client.vehicles.map((vehicle) => (
          <article key={vehicle.id} className={"pageCard"}>
            <PhotoFrame
              src={vehicle.photo.src}
              alt={vehicle.photo.alt}
              credit={vehicle.photo.credit}
              className="h-56 w-full rounded-2xl object-cover"
            />
            <h2 style={{ marginTop: 12 }}>{vehicle.name}</h2>
            <p>{vehicle.summary}</p>
            <dl className={"grid2"}>
              {vehicle.specs.map((spec) => (
                <div key={spec.label}>
                  <dt className={"credit"}>{spec.label}</dt>
                  <dd>
                    <b>{spec.value}</b>
                  </dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
      </div>
      {hasCompliance && compliance ? (
        <section className={"pageCard"} style={{ marginTop: 18 }}>
          <h2>Insurance, DOT, and MC</h2>
          {compliance.insurance ? (
            <dl className={"grid2"}>
              <div>
                <dt className={"credit"}>Carrier</dt>
                <dd>
                  <b>{compliance.insurance.carrier}</b>
                </dd>
              </div>
              {compliance.insurance.liability ? (
                <div>
                  <dt className={"credit"}>Liability</dt>
                  <dd>
                    <b>{compliance.insurance.liability}</b>
                  </dd>
                </div>
              ) : null}
              {compliance.insurance.cargo ? (
                <div>
                  <dt className={"credit"}>Cargo</dt>
                  <dd>
                    <b>{compliance.insurance.cargo}</b>
                  </dd>
                </div>
              ) : null}
              {compliance.insurance.expires ? (
                <div>
                  <dt className={"credit"}>Insurance through</dt>
                  <dd>
                    <b>{formatDay(compliance.insurance.expires)}</b>
                  </dd>
                </div>
              ) : null}
            </dl>
          ) : null}
          <p>
            {compliance.dot ? <span>DOT {compliance.dot} </span> : null}
            {compliance.mc ? <span>MC {compliance.mc}</span> : null}
          </p>
        </section>
      ) : null}
      <p style={{ textAlign: "center", marginTop: 24 }}>
        <Link href="/#quote" className={`${"pill"} ${"centerCta"}`}>
          <b>Get My Free Quote</b>
          <span>{client.shortName}</span>
        </Link>
      </p>
    </div>
  );
}
