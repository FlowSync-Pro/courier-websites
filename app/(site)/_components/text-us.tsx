import { smsHref } from "@/lib/catalog";
import "./site.module.css";

export function TextUs() {
  return (
    <a className={"textUs"} href={smsHref()}>
      💬 Text us
    </a>
  );
}
