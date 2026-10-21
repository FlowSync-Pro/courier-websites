"use client";

import { useActionState } from "react";
import { submitQuote, type FormState } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const initial: FormState = { ok: false, message: "", errors: {} };

export function QuoteForm({
  piecesLabel,
  phoneDisplay,
  telHref,
  smsHref,
}: {
  piecesLabel: string;
  phoneDisplay: string;
  telHref: string;
  smsHref: string;
}) {
  const [state, action, pending] = useActionState(submitQuote, initial);

  if (state.ok) {
    return (
      <div className="rounded-lg border border-line bg-white p-6" role="status">
        <h2 className="font-display text-4xl font-bold">Request received</h2>
        <p className="mt-3 text-lg">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={action} className="grid gap-4 rounded-lg border border-line bg-white p-4 sm:p-6">
      {state.message ? (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
          {state.message}
        </p>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" name="name" error={state.errors.name} required autoComplete="name" />
        <Field
          label="Business name"
          name="businessName"
          error={state.errors.businessName}
          autoComplete="organization"
        />
        <Field label="Phone" name="phone" error={state.errors.phone} required autoComplete="tel" inputMode="tel" />
        <Field label="Email" name="email" error={state.errors.email} required autoComplete="email" type="email" />
      </div>
      <Field label="Pickup address" name="pickup" error={state.errors.pickup} required autoComplete="street-address" />
      <Field label="Drop-off address" name="dropoff" error={state.errors.dropoff} required />
      <div className="grid gap-1.5">
        <Label htmlFor="description">What is being delivered</Label>
        <Textarea id="description" name="description" required />
        {state.errors.description ? <ErrorText>{state.errors.description}</ErrorText> : null}
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label={piecesLabel} name="pieces" error={state.errors.pieces} />
        <Field label="Weight, if known" name="weight" error={state.errors.weight} />
        <Field label="Date needed" name="dateNeeded" type="date" error={state.errors.dateNeeded} required />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="photo">Photo (optional)</Label>
        <Input id="photo" name="photo" type="file" accept="image/jpeg,image/png,image/webp,image/gif" />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" />
      </div>
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Sending…" : "Get a Quote"}
      </Button>
      <div className="grid grid-cols-2 gap-3 border-t border-line pt-4">
        <a href={telHref} className="flex h-12 items-center justify-center rounded-md border-2 border-brand font-semibold">
          Call {phoneDisplay}
        </a>
        <a href={smsHref} className="flex h-12 items-center justify-center rounded-md border-2 border-brand font-semibold">
          Text {phoneDisplay}
        </a>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  error,
  ...props
}: React.ComponentProps<"input"> & { label: string; name: string; error?: string }) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} aria-invalid={error ? true : undefined} {...props} />
      {error ? <ErrorText>{error}</ErrorText> : null}
    </div>
  );
}

function ErrorText({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-red-700">{children}</p>;
}
