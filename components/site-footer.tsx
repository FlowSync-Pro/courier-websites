import Link from "next/link";
import { client } from "@/config/site";
import { smsHref, telHref } from "@/lib/catalog";
import "@/app/(site)/_components/site.module.css";

export function SiteFooter() {
  return (
    <footer className={"footer"}>
      <div className={`${"wrap"} ${"footerGrid"}`}>
        <div>
          <h2>{client.legalName}</h2>
          <p>{client.ownerLine}</p>
        </div>
        <div>
          <p className={"kicker"} style={{ textAlign: "left" }}>
            Reach us
          </p>
          <a href={telHref()}>{client.phoneDisplay}</a>
          <p>
            <a href={smsHref()}>Text this number</a>
          </p>
          <p>
            <a href={`mailto:${client.email}`}>{client.email}</a>
          </p>
        </div>
        <div>
          <p className={"kicker"} style={{ textAlign: "left" }}>
            On this site
          </p>
          <ul>
            <li>
              <Link href="/services">Services</Link>
            </li>
            <li>
              <Link href="/service-area">Service area</Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/#quote">Get a Quote</Link>
            </li>
            <li>
              <Link href="/login">Owner login</Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
