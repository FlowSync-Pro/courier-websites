"use client";

import { useActionState, useState } from "react";
import { submitQuote, type FormState } from "@/lib/actions";
import "./site.module.css";

const initial: FormState = { ok: false, message: "", errors: {} };
const MAX_PHOTO = 4 * 1024 * 1024;

function digits(value: string) {
  return value.replace(/\D/g, "");
}

function stepOneErrors(data: FormData) {
  const errors: Record<string, string> = {};
  const name = String(data.get("name") ?? "").trim();
  const phone = String(data.get("phone") ?? "");
  const email = String(data.get("email") ?? "").trim();
  if (name.length < 2) errors.name = "Add your name.";
  if (digits(phone).length < 7) errors.phone = "Add a phone number.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Add a real email.";
  return errors;
}

export function QuoteCard({
  piecesLabel,
  buttonSubline,
}: {
  piecesLabel: string;
  buttonSubline: string;
}) {
  const [state, action, pending] = useActionState(submitQuote, initial);
  const [step, setStep] = useState<1 | 2>(1);
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
  const [photoError, setPhotoError] = useState("");
  const [trackedState, setTrackedState] = useState(state);
  if (state !== trackedState) {
    setTrackedState(state);
    if (state.errors.name || state.errors.phone || state.errors.email) setStep(1);
  }

  if (state.ok) {
    return (
      <div className={"formCard"} id="quote" role="status">
        <div className={"success"}>
          <h2>Request received</h2>
          <p className={"lede"}>{state.message}</p>
        </div>
      </div>
    );
  }

  const shown = { ...localErrors, ...state.errors };

  return (
    <form
      id="quote"
      action={action}
      className={"formCard"}
      onSubmit={(event) => {
        const data = new FormData(event.currentTarget);
        const photo = data.get("photo");
        if (photo instanceof File && photo.size > MAX_PHOTO) {
          event.preventDefault();
          setPhotoError("That photo is over 4 MB. Use a smaller one.");
        }
      }}
    >
      <div className={"formHead"}>
        <div className={`${"stepLabel"} ${step === 1 ? "stepOn" : ""}`}>
          <b>1 START QUOTE</b>
          <span>Name & Contact</span>
        </div>
        <div className={`${"stepLabel"} ${step === 2 ? "stepOn" : ""}`}>
          <b>2 LOAD DETAILS</b>
          <span>Pickup & Drop-off</span>
        </div>
        <div className={`${"progress"} ${step === 2 ? "progressFull" : ""}`}>
          <i />
        </div>
      </div>
      <div className={"formBody"}>
        <p className={"requiredNote"}>* Denotes mandatory fields</p>
        {state.message && !state.ok ? (
          <p className={"error"} role="alert">
            {state.message}
          </p>
        ) : null}
        <div hidden={step !== 1} className={"formBody"} style={{ padding: 0 }}>
          <Field
            label="Full name"
            name="name"
            placeholder="Full name…"
            autoComplete="name"
            required={step === 1}
            error={shown.name}
          />
          <div className={"grid2"}>
            <Field
              label="Phone"
              name="phone"
              placeholder="Phone…"
              autoComplete="tel"
              inputMode="tel"
              required={step === 1}
              error={shown.phone}
            />
            <Field
              label="Email"
              name="email"
              type="email"
              placeholder="Email…"
              autoComplete="email"
              required={step === 1}
              error={shown.email}
            />
          </div>
        </div>
        <div hidden={step !== 2}>
          <div className={"formBody"} style={{ padding: 0 }}>
            <Field label="Business name" name="businessName" placeholder="Business name…" autoComplete="organization" visible />
            <Field
              label="Pickup address"
              name="pickup"
              placeholder="Pickup address…"
              autoComplete="street-address"
              required={step === 2}
              error={shown.pickup}
              visible
            />
            <Field
              label="Drop-off address"
              name="dropoff"
              placeholder="Drop-off address…"
              required={step === 2}
              error={shown.dropoff}
              visible
            />
            <label className={"file"}>
              What is being delivered *
              <textarea className={"area"} name="description" required={step === 2} placeholder="What is being delivered…" />
              {shown.description ? <span className={"error"}>{shown.description}</span> : null}
            </label>
            <div className={"grid3"}>
              <Field label={piecesLabel} name="pieces" placeholder={piecesLabel} visible />
              <Field label="Weight, if known" name="weight" placeholder="Weight, if known…" visible />
              <Field label="Date needed" name="dateNeeded" type="date" required={step === 2} error={shown.dateNeeded} visible />
            </div>
            <label className={"file"}>
              Photo (optional)
              <input name="photo" type="file" accept="image/jpeg,image/png,image/webp,image/gif" />
              <small>JPEG, PNG, WebP, or GIF. 4 MB max.</small>
              {photoError ? <span className={"error"}>{photoError}</span> : null}
            </label>
            <label className={"file"}>
              Notes
              <textarea className={"area"} name="notes" placeholder="Notes…" />
            </label>
          </div>
        </div>
        {step === 1 ? (
          <button
            type="button"
            className={"pill"}
            onClick={(event) => {
              const form = event.currentTarget.form;
              if (!form) return;
              const errors = stepOneErrors(new FormData(form));
              setLocalErrors(errors);
              if (Object.keys(errors).length === 0) {
                setStep(2);
                setLocalErrors({});
              }
            }}
          >
            <b>→ Continue</b>
            <span>Takes about 30 seconds</span>
          </button>
        ) : (
          <button type="submit" className={"pill"} disabled={pending}>
            <b>{pending ? "Sending…" : "→ Get My Free Quote"}</b>
            <span>{buttonSubline}</span>
          </button>
        )}
        <p className={"privacy"}>We respect your privacy & information</p>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  error,
  required,
  placeholder,
  type = "text",
  visible = false,
  ...props
}: React.ComponentProps<"input"> & { label: string; name: string; error?: string; visible?: boolean }) {
  const shownPlaceholder = placeholder ?? (required ? `${label}…` : label);
  return (
    <label className={visible ? "field" : undefined}>
      <span className={visible ? "fieldLabel" : "sr-only"}>
        {label}
        {required ? " *" : ""}
      </span>
      <input
        className={"input"}
        name={name}
        type={type}
        placeholder={required ? `${shownPlaceholder.replace(/…$/, "")} *` : shownPlaceholder}
        aria-invalid={error ? true : undefined}
        required={required}
        {...props}
      />
      {error ? <span className={"error"}>{error}</span> : null}
    </label>
  );
}
