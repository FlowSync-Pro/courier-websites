import Link from "next/link";
import { smsHref, telHref } from "@/lib/catalog";
import "@/app/(site)/_components/site.module.css";

export function StickyBar() {
  return (
    <div className={"sticky"}>
      <a href={telHref()}>Call</a>
      <a href={smsHref()}>Text</a>
      <Link href="/#quote">Get a Quote</Link>
    </div>
  );
}
