import type { Metadata } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import { client } from "@/config/site";
import { textOn } from "@/lib/color";
import "./globals.css";

const sans = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-barlow",
});

const display = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-barlow-condensed",
});

export const metadata: Metadata = {
  title: {
    default: client.seo.title,
    template: `%s · ${client.shortName}`,
  },
  description: client.seo.description,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${display.variable} h-full antialiased`}
      style={{
        ["--brand" as string]: client.colors.primary,
        ["--accent" as string]: client.colors.accent,
        ["--accent-fg" as string]: textOn(client.colors.accent, client.colors.primary),
      }}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
