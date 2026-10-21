"use client";

import { useActionState } from "react";
import { createJob, type FormState } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const initial: FormState = { ok: false, message: "", errors: {} };

type Option = { id: string; name: string };

export function JobForm({
  level,
  clients,
  services,
  vehicles,
  drivers,
  defaultDate,
  defaultClient = "",
  defaultPickup = "",
  defaultDropoff = "",
}: {
  level: "A" | "B";
  clients: Option[];
  services: Option[];
  vehicles: Option[];
  drivers: string[];
  defaultDate: string;
  defaultClient?: string;
  defaultPickup?: string;
  defaultDropoff?: string;
}) {
  const [state, action, pending] = useActionState(createJob, initial);

  if (clients.length === 0) {
    return (
      <p className="rounded-lg border border-line bg-white p-4">
        Add a client first, or send a test quote. Quote senders are saved under Clients.
      </p>
    );
  }

  return (
    <form action={action} className="grid gap-4">
      {state.message ? (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
          {state.message}
        </p>
      ) : null}
      <Select label="Client" name="clientId" error={state.errors.clientId} required defaultValue={defaultClient}>
        <option value="" disabled>
          Choose a client
        </option>
        {clients.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </Select>
      <div className="grid gap-4 sm:grid-cols-2">
        <Select label="Service" name="serviceId" error={state.errors.serviceId} required defaultValue={services[0]?.id}>
          {services.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </Select>
        <Field label="Date" name="jobDate" type="date" defaultValue={defaultDate} error={state.errors.jobDate} required />
      </div>
      <Field label="Pickup" name="pickup" defaultValue={defaultPickup} error={state.errors.pickup} required />
      <Field label="Drop-off" name="dropoff" defaultValue={defaultDropoff} error={state.errors.dropoff} required />
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Amount charged" name="amount" inputMode="decimal" placeholder="180.00" error={state.errors.amount} required />
        <Field label="Miles" name="miles" inputMode="decimal" error={state.errors.miles} />
        <label className="flex items-end gap-2 pb-3 text-sm font-semibold">
          <input type="checkbox" name="paid" className="h-5 w-5 accent-[var(--accent)]" />
          Paid
        </label>
      </div>
      {level === "B" ? (
        <fieldset className="grid gap-4 rounded-lg border border-line bg-paper p-4">
          <legend className="px-1 font-display text-2xl font-bold">Load, vehicle, driver</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <Select label="Vehicle" name="vehicleId" error={state.errors.vehicleId} required defaultValue={vehicles[0]?.id}>
              {vehicles.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </Select>
            <div className="grid gap-1.5">
              <Label htmlFor="driverName">Driver</Label>
              <Input id="driverName" name="driverName" list="driver-names" placeholder="Who ran this job" />
              <datalist id="driver-names">
                {drivers.map((name) => (
                  <option key={name} value={name} />
                ))}
              </datalist>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Pallets" name="pallets" />
            <Field label="Pieces" name="pieces" />
            <Field label="Weight" name="weight" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Waiting time (minutes)" name="waitingMinutes" inputMode="numeric" error={state.errors.waitingMinutes} />
            <Field label="Driver pay" name="driverPay" inputMode="decimal" placeholder="80.00" error={state.errors.driverPay} />
          </div>
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input type="checkbox" name="liftgate" className="h-5 w-5 accent-[var(--accent)]" />
            Liftgate needed
          </label>
          <div className="grid gap-1.5">
            <Label htmlFor="pod">Proof of delivery photo</Label>
            <Input id="pod" name="pod" type="file" accept="image/jpeg,image/png,image/webp,image/gif" />
            {state.errors.pod ? <p className="text-sm text-red-700">{state.errors.pod}</p> : null}
          </div>
        </fieldset>
      ) : null}
      <div className="grid gap-1.5">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" className="min-h-20" />
      </div>
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Saving…" : "Save job"}
      </Button>
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
      <Input id={name} name={name} {...props} />
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </div>
  );
}

function Select({
  label,
  name,
  error,
  children,
  ...props
}: React.ComponentProps<"select"> & { label: string; name: string; error?: string }) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={name}>{label}</Label>
      <select
        id={name}
        name={name}
        className="h-12 w-full rounded-md border border-line bg-white px-3 text-base"
        {...props}
      >
        {children}
      </select>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
