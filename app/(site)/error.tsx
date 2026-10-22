"use client";

import "./_components/site.module.css";

export default function SiteError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className={`${"wrap"} ${"page"}`} style={{ textAlign: "center" }}>
      <h1>Something went wrong.</h1>
      <p className={"lede"}>Try the page again. If it keeps failing, call or text the number in the header.</p>
      <button type="button" className={`${"pill"} ${"centerCta"}`} onClick={reset}>
        <b>Try again</b>
      </button>
    </div>
  );
}
