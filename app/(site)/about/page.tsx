import type { Metadata } from "next";
import Link from "next/link";
import { client } from "@/config/site";
import { PhotoFrame } from "@/components/photo-frame";
import { buttonVariants } from "@/components/ui/button";
import { formatDay } from "@/lib/utils";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  const compliance = client.compliance;
  const hasCompliance = Boolean(compliance && (compliance.insurance || compliance.dot || compliance.mc));
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <p className="text-sm font-semibold uppercase tracking-wide text-accent-ink">About</p>
      <h1 className="mt-1 font-display text-5xl font-bold leading-none">{client.about.heading}</h1>
      <div className="mt-5 grid gap-4 text-lg leading-relaxed">
        {client.about.story.map((sentence) => (
          <p key={sentence}>{sentence}</p>
        ))}
      </div>
      <div className="mt-10 grid gap-8">
        {client.vehicles.map((vehicle) => (
          <article key={vehicle.id} className="grid gap-4 rounded-lg border border-line bg-white p-4 sm:grid-cols-2">
            <PhotoFrame
              src={vehicle.photo.src}
              alt={vehicle.photo.alt}
              credit={vehicle.photo.credit}
              className="h-56 w-full rounded-md object-cover"
            />
            <div>
              <h2 className="font-display text-4xl font-bold">{vehicle.name}</h2>
              <p className="mt-2 text-muted">{vehicle.summary}</p>
              <dl className="mt-4 grid grid-cols-2 gap-3">
                {vehicle.specs.map((spec) => (
                  <div key={spec.label}>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-muted">{spec.label}</dt>
                    <dd className="text-lg font-semibold">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </article>
        ))}
      </div>
      {hasCompliance && compliance ? (
        <section className="mt-10 rounded-lg border border-line bg-white p-5">
          <h2 className="font-display text-3xl font-bold">Insurance, DOT, and MC</h2>
          {compliance.insurance ? (
            <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-muted">Carrier</dt>
                <dd className="font-semibold">{compliance.insurance.carrier}</dd>
              </div>
              {compliance.insurance.liability ? (
                <div>
                  <dt className="text-muted">Liability</dt>
                  <dd className="font-semibold">{compliance.insurance.liability}</dd>
                </div>
              ) : null}
              {compliance.insurance.cargo ? (
                <div>
                  <dt className="text-muted">Cargo</dt>
                  <dd className="font-semibold">{compliance.insurance.cargo}</dd>
                </div>
              ) : null}
              {compliance.insurance.expires ? (
                <div>
                  <dt className="text-muted">Insurance through</dt>
                  <dd className="font-semibold">{formatDay(compliance.insurance.expires)}</dd>
                </div>
              ) : null}
            </dl>
          ) : null}
          <p className="mt-4 text-sm">
            {compliance.dot ? <span className="mr-4">DOT {compliance.dot}</span> : null}
            {compliance.mc ? <span>MC {compliance.mc}</span> : null}
          </p>
        </section>
      ) : null}
      <Link href="/quote" className={`${buttonVariants({ size: "lg" })} mt-8`}>
        Get a Quote
      </Link>
    </div>
  );
}
