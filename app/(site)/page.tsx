import Link from "next/link";
import { client } from "@/config/site";
import { PhotoFrame } from "@/components/photo-frame";
import { piecesLabel, previewServices, smsHref, telHref, trustItems } from "@/lib/catalog";
import { QuoteCard } from "./_components/quote-card";
import { Highlight } from "./_components/highlight";
import { SectionHeading } from "./_components/section-heading";
import { CheckIcon, LockIcon, StepIcon } from "./_components/icons";
import "./_components/site.module.css";

const steps = [
  {
    title: "Request a quote",
    body: "Tell us the pickup, the drop-off, and the day.",
    icon: "quote" as const,
  },
  {
    title: "Get your price and pickup window",
    body: "We call or text back with a straight answer.",
    icon: "price" as const,
  },
  {
    title: "We pick up and deliver",
    body: "The vehicle that fits the job makes the run.",
    icon: "truck" as const,
  },
  {
    title: "Delivered and confirmed",
    body: "You hear from us when the load is handed over.",
    icon: "done" as const,
  },
];

export default function HomePage() {
  const services = previewServices();
  const photos = [
    ...client.vehicles.map((vehicle) => vehicle.photo),
    ...client.gallery,
  ];
  const chips = vehicleChips();
  const checks = trustItems().slice(0, 3);
  const pallets = Math.max(0, ...client.vehicles.map((vehicle) => vehicle.palletCapacity ?? 0));
  const shield = pallets ? `${pallets}\nPALLETS` : /same[-\s]?day/i.test(`${client.headline} ${client.subline}`) ? "SAME\nDAY" : client.shortName;

  return (
    <>
      <section className={"wrap"}>
        <div className={"heroGrid"}>
          <div>
            <h1 className={"heroTitle"}>
              <Highlight text={client.headline} />
            </h1>
            <p className={"heroSub"}>{client.subline}</p>
            <div className={"collage"}>
              {client.vehicles.slice(0, 2).map((vehicle) => (
                <div key={vehicle.id} className={client.vehicles.length > 1 ? "shot" : "shotSolo"}>
                  <PhotoFrame
                    src={vehicle.photo.src}
                    alt={vehicle.photo.alt}
                    credit={vehicle.photo.credit}
                    showCredit={false}
                  />
                </div>
              ))}
              {chips.map((chip) => (
                <span key={chip} className={"chip"}>
                  {chip}
                </span>
              ))}
            </div>
            <ul className={"heroCredits"}>
              {client.vehicles.slice(0, 2).map((vehicle) => (
                <li key={vehicle.id}>
                  {vehicle.name}: {vehicle.photo.credit}
                </li>
              ))}
            </ul>
            <div className={"audience"}>
              <div className={"audienceBadge"}>
                WE
                <br />
                DELIVER
                <br />
                FOR
              </div>
              <p>{client.audiences.join(" · ")}</p>
            </div>
          </div>
          <div>
            <QuoteCard piecesLabel={piecesLabel()} buttonSubline={`Across ${client.serviceArea.region}`} />
            <div className={"guarantee"}>
              <div className={"shield"}>
                {shield.split("\n").map((line) => (
                  <span key={line}>
                    {line}
                    <br />
                  </span>
                ))}
              </div>
              <div>
                <h2>{client.about.heading}</h2>
                {checks.length > 0 ? (
                  <ul className={"checks"}>
                    {checks.map((item) => (
                      <li key={item}>
                        <CheckIcon />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
            <div className={"lockRow"}>
              <LockIcon />
              <span>Your details are only used to quote your delivery</span>
              <span className={"desktopOnly"}>
                <a href={telHref()}>Call {client.phoneDisplay}</a>
                {" · "}
                <a href={smsHref()}>Text {client.phoneDisplay}</a>
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className={`${"section"} ${"wash"}`}>
        <div className={"wrap"}>
          <SectionHeading title={"What's [[included]]"} />
          <div className={"stack"} style={{ marginTop: 28 }}>
            {includedRows().map((row) => (
              <div key={row.label} className={"stackRow"}>
                <b>{row.label}</b>
                <span>{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={"section"}>
        <div className={`${"wrap"} ${"badgeRow"}`}>
          <span className={"arrow"} aria-hidden>
            →
          </span>
          <span className={"free"}>FREE QUOTE</span>
          <span className={"arrow"} aria-hidden>
            ←
          </span>
          <p>No obligation. Call, text, or fill in the form.</p>
        </div>
      </section>

      <section className={`${"section"} ${"wash"}`}>
        <div className={"wrap"}>
          <SectionHeading title="How It Works" />
          <div className={"steps"}>
            {steps.map((step, index) => (
              <article key={step.title} className={"stepCard"}>
                <span className={"num"}>{index + 1}</span>
                <div className={"iconCircle"}>
                  <StepIcon name={step.icon} />
                </div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={"section"}>
        <div className={"wrap"}>
          <Link href="/#quote" className={`${"pill"} ${"centerCta"}`}>
            <b>Get My Free Quote 🚚</b>
            <span>Same-day and scheduled delivery</span>
          </Link>
        </div>
      </section>

      <section className={`${"section"} ${"wash"}`}>
        <div className={"wrap"}>
          <SectionHeading title="Our Trucks & Recent Work" />
          <div className={"scroller"}>
            {photos.map((photo) => (
              <div key={photo.src} className={"slide"}>
                <PhotoFrame src={photo.src} alt={photo.alt} caption={photo.caption} credit={photo.credit} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={"section"}>
        <div className={"wrap"}>
          <Link href="/#quote" className={`${"pill"} ${"centerCta"}`}>
            <b>Get My Free Quote 🚚</b>
            <span>Same-day and scheduled delivery</span>
          </Link>
        </div>
      </section>

      <section className={`${"section"} ${"wash"}`}>
        <div className={"wrap"}>
          <SectionHeading title="Real People, Real Results." />
          <div className={"reviews"}>
            {client.reviews.map((review) => (
              <figure key={review.name} className={"review"}>
                <div className={"who"}>
                  <span className={"avatar"} aria-hidden>
                    {initials(review.name)}
                  </span>
                  <div>
                    <b>{review.name}</b>
                    <p>{review.detail}</p>
                  </div>
                </div>
                <blockquote>“{review.quote}”</blockquote>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className={"section"}>
        <div className={"wrap"}>
          <SectionHeading title="Services" />
          <div className={"cards"}>
            {services.map((service) => (
              <Link key={service.id} href={`/services#${service.id}`} className={"serviceCard"}>
                <h3>{service.name}</h3>
                <p>{service.blurb}</p>
                <span className={"more"}>See this service</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={`${"section"} ${"wash"}`}>
        <div className={"wrap"}>
          <SectionHeading title={client.serviceArea.region} />
          <p className={"lede"} style={{ textAlign: "center", marginTop: 16 }}>
            {client.serviceArea.intro}
          </p>
          <div className={"cards"}>
            {client.serviceArea.areas.slice(0, 4).map((area) => (
              <article key={area.name} className={"areaCard"}>
                <h2>{area.name}</h2>
                <p>{area.body}</p>
              </article>
            ))}
          </div>
          <p style={{ textAlign: "center", marginTop: 18 }}>
            <Link href="/service-area" className={"more"}>
              Full service area
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase();
}

function vehicleChips() {
  const vehicle = client.vehicles[0];
  if (!vehicle) return [];
  const chips: string[] = [];
  if (vehicle.liftgate) {
    const spec = vehicle.specs.find((item) => /liftgate/i.test(item.label) && !/^no/i.test(item.value));
    chips.push(spec ? `Liftgate ${spec.value}` : "Liftgate");
  }
  if (vehicle.palletCapacity) chips.push(`${vehicle.palletCapacity} pallets`);
  const size = vehicle.specs.find((item) => /box|body/i.test(item.label));
  if (size) {
    const feet = size.value.match(/(\d+)\s*ft/i);
    chips.push(feet ? `${feet[1]}-ft box` : size.value);
  }
  for (const spec of vehicle.specs) {
    if (chips.length >= 3) break;
    if (chips.some((chip) => chip.includes(spec.value))) continue;
    chips.push(`${spec.label} ${spec.value}`);
  }
  return chips.slice(0, 3);
}

function includedRows() {
  const rows: { label: string; value: string }[] = [];
  if (client.vehicles.length) {
    rows.push({ label: client.vehicles.map((vehicle) => vehicle.name).join(" and "), value: "Included" });
  }
  const lift = client.vehicles.find((vehicle) => vehicle.liftgate);
  if (lift) {
    const spec = lift.specs.find((item) => /liftgate/i.test(item.label));
    rows.push({ label: "Liftgate", value: spec?.value ?? "Included" });
  }
  const pallets = Math.max(0, ...client.vehicles.map((vehicle) => vehicle.palletCapacity ?? 0));
  if (pallets) rows.push({ label: "Pallet capacity", value: `Up to ${pallets} pallets` });
  const areas = client.serviceArea.areas;
  const counties = areas.filter((area) => /county/i.test(area.name)).length;
  rows.push({
    label: client.serviceArea.region,
    value:
      counties === areas.length && counties > 0
        ? `${counties} ${counties === 1 ? "county" : "counties"}`
        : `${areas.length} ${areas.length === 1 ? "area" : "areas"}`,
  });
  if (client.ownerOperated) rows.push({ label: "Owner-operated", value: "Included" });
  const names = previewServices().map((service) => service.name);
  if (names.length) rows.push({ label: names.join(", "), value: "Offered" });
  return rows;
}
