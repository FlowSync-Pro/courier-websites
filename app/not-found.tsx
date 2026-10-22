import Link from "next/link";
import { Poppins } from "next/font/google";
import { client } from "@/config/site";
import "./(site)/_components/site.module.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export default function NotFound() {
  return (
    <div className={`${poppins.className} ${"root"}`}>
      <div className={`${"wrap"} ${"page"}`} style={{ textAlign: "center" }}>
        <h1>That page is not on this site.</h1>
        <p className={"lede"}>{client.legalName} does not have a page at this address.</p>
        <Link href="/" className={`${"pill"} ${"centerCta"}`}>
          <b>Back home</b>
        </Link>
      </div>
    </div>
  );
}
