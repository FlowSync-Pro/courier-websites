import { Poppins } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StickyBar } from "@/components/sticky-bar";
import { TextUs } from "./_components/text-us";
import "./_components/site.module.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={`${poppins.className} ${"root"}`}>
      <SiteHeader />
      <main className={"main"}>{children}</main>
      <SiteFooter />
      <StickyBar />
      <TextUs />
    </div>
  );
}
