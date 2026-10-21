"use client";

export default function SiteError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <h1 className="font-display text-4xl font-bold">Something went wrong.</h1>
      <p className="mt-2 text-muted">Try the page again. If it keeps failing, call or text the number on the site.</p>
      <button type="button" onClick={reset} className="mt-5 h-12 rounded-md bg-accent px-4 font-semibold text-brand">
        Try again
      </button>
    </div>
  );
}
