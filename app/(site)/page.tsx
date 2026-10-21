import Link from "next/link";
import { client } from "@/config/site";
import { PhotoFrame } from "@/components/photo-frame";
import { buttonVariants } from "@/components/ui/button";
import { previewServices, smsHref, telHref, trustItems } from "@/lib/catalog";

export default function HomePage() {
  const services = previewServices();
  const heroVehicles = client.vehicles.slice(0, 2);
  return (
    <>
      <section className="bg-brand text-white">
        <div className="mx-auto grid max-w-6xl gap-5 px-4 py-5 md:grid-cols-[1.1fr_0.9fr] md:items-center md:py-12">
          <div>
            <p className="text-sm font-semibold text-accent">{client.ownerLine}</p>
            <h1 className="mt-2 max-w-xl font-display text-[2.05rem] font-bold leading-[0.98] sm:text-5xl md:text-6xl">
              {client.headline}
            </h1>
            <p className="mt-3 max-w-xl text-base leading-snug text-white/90 md:text-lg">{client.subline}</p>
            <p className="mt-2 text-sm font-semibold text-white/80">{client.phoneDisplay}</p>
            <div className="mt-4 grid max-w-md gap-2">
              <Link href="/quote" className={buttonVariants({ size: "lg" })}>
                Get a Quote
              </Link>
              <div className="grid grid-cols-2 gap-2">
                <a href={telHref()} className={buttonVariants({ variant: "white", size: "lg" })}>
                  Call
                </a>
                <a href={smsHref()} className={buttonVariants({ variant: "white", size: "lg" })}>
                  Text
                </a>
              </div>
            </div>
          </div>
          <div className={heroVehicles.length > 1 ? "grid grid-cols-2 gap-2" : "grid gap-2"}>
            {heroVehicles.map((vehicle) => (
              <PhotoFrame
                key={vehicle.id}
                src={vehicle.photo.src}
                alt={vehicle.photo.alt}
                credit={vehicle.photo.credit}
                className="h-32 w-full rounded-md object-cover sm:h-44 md:h-64"
                creditClass="text-white/60"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-white">
        <ul className="mx-auto flex max-w-6xl gap-x-6 gap-y-2 overflow-x-auto px-4 py-4 text-sm font-semibold">
          {trustItems().map((item) => (
            <li key={item} className="flex shrink-0 items-center gap-2">
              <span className="h-2.5 w-2.5 bg-accent" aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="font-display text-4xl font-bold md:text-5xl">Services</h2>
        <p className="mt-2 max-w-2xl text-lg text-muted">{client.servicesIntro}</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {services.map((service) => (
            <Link
              key={service.id}
              href={`/services#${service.id}`}
              className="rounded-lg border border-line bg-white p-5 hover:border-brand"
            >
              <h3 className="font-display text-3xl font-bold">{service.name}</h3>
              <p className="mt-2 text-muted">{service.blurb}</p>
              <p className="mt-4 text-sm font-semibold text-accent-ink">See this service</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <h2 className="font-display text-4xl font-bold">{client.audienceHeading}</h2>
          <ul className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-5">
            {client.audiences.map((audience) => (
              <li key={audience} className="border-t-4 border-accent bg-paper px-3 py-4 font-display text-2xl font-bold leading-none">
                {audience}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {client.gallery.length > 0 ? (
        <section className="mx-auto max-w-6xl px-4 py-10">
          <h2 className="font-display text-4xl font-bold">On the job</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {client.gallery.map((photo) => (
              <PhotoFrame
                key={photo.src}
                src={photo.src}
                alt={photo.alt}
                caption={photo.caption}
                credit={photo.credit}
                className="h-64 w-full rounded-md object-cover"
              />
            ))}
          </div>
        </section>
      ) : null}

      <section className="bg-brand text-white">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <h2 className="font-display text-4xl font-bold">What customers say</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {client.reviews.map((review) => (
              <figure key={review.name} className="border border-white/15 p-5">
                <blockquote className="text-lg leading-snug">“{review.quote}”</blockquote>
                <figcaption className="mt-4 text-sm text-white/75">
                  <span className="font-semibold text-white">{review.name}</span>
                  <span className="block">{review.detail}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="max-w-xl font-display text-5xl font-bold leading-none">
          Tell us the pickup, the drop-off, and the day.
        </h2>
        <p className="mt-3 max-w-xl text-lg text-muted">
          You get a straight answer back. Call, text, or send the form.
        </p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Link href="/quote" className={buttonVariants({ size: "lg" })}>
            Get a Quote
          </Link>
          <a href={telHref()} className={buttonVariants({ variant: "outline", size: "lg" })}>
            Call {client.phoneDisplay}
          </a>
        </div>
        <p className="mt-6 text-sm text-muted">
          {client.vehicles.map((vehicle) => vehicle.summary).join(" ")}
        </p>
      </section>
    </>
  );
}
