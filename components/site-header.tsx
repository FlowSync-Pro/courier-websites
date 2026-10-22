"use client";

import Link from "next/link";
import { useState } from "react";
import { client } from "@/config/site";
import { telHref } from "@/lib/catalog";
import { Logo } from "@/components/logo";
import "@/app/(site)/_components/site.module.css";

const links = [
  ["/", "Home"],
  ["/services", "Services"],
  ["/service-area", "Service Area"],
  ["/about", "About"],
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className={"header"}>
      <div className={`${"wrap"} ${"headerInner"}`}>
        <Link href="/" aria-label={client.legalName} onClick={close}>
          <Logo />
        </Link>
        <nav className={"desktopNav"} aria-label="Primary">
          {links.map(([href, label]) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
          <a className={"phoneLink"} href={telHref()}>
            {client.phoneDisplay}
          </a>
          <Link href="/#quote" className={`${"pill"} ${"pillSlim"}`}>
            <b>Get a Quote</b>
          </Link>
        </nav>
        <button
          type="button"
          className={"menuBtn"}
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen((value) => !value)}
        >
          Menu
        </button>
      </div>
      {open ? (
        <nav id="site-menu" className={`${"wrap"} ${"mobileNav"}`} aria-label="Mobile">
          {links.map(([href, label]) => (
            <Link key={href} href={href} onClick={close}>
              {label}
            </Link>
          ))}
          <a href={telHref()} onClick={close}>
            {client.phoneDisplay}
          </a>
          <Link href="/#quote" onClick={close}>
            Get a Quote
          </Link>
          <Link href="/login" onClick={close}>
            Owner login
          </Link>
        </nav>
      ) : null}
    </header>
  );
}
