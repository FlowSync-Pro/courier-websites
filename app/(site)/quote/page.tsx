import type { Metadata } from "next";
import { client } from "@/config/site";
import { piecesLabel } from "@/lib/catalog";
import { QuoteCard } from "../_components/quote-card";
import "../_components/site.module.css";

export const metadata: Metadata = { title: "Get a Quote" };

export default function QuotePage() {
  return (
    <div className={`${"wrap"} ${"page"}`} style={{ maxWidth: 760 }}>
      <p className={"kicker"}>Quote</p>
      <h1>Get a free quote</h1>
      <p className={"lede"} style={{ textAlign: "center" }}>
        {client.subline}
      </p>
      <div style={{ marginTop: 24 }}>
        <QuoteCard piecesLabel={piecesLabel()} buttonSubline={`Across ${client.serviceArea.region}`} />
      </div>
    </div>
  );
}
