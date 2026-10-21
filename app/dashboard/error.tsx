"use client";

export default function DashboardError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="rounded-lg border border-line bg-white p-5">
      <h1 className="font-display text-4xl font-bold">The dashboard hit an error.</h1>
      <button type="button" onClick={reset} className="mt-4 h-12 rounded-md bg-accent px-4 font-semibold text-brand">
        Try again
      </button>
    </div>
  );
}
