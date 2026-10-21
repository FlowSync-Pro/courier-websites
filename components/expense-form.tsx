"use client";

import { useActionState } from "react";
import { createExpense, type FormState } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initial: FormState = { ok: false, message: "", errors: {} };

export function ExpenseForm({
  level,
  categories,
  vehicles,
  defaultDate,
}: {
  level: "A" | "B";
  categories: { id: string; label: string }[];
  vehicles: { id: string; name: string }[];
  defaultDate: string;
}) {
  const [state, action, pending] = useActionState(createExpense, initial);
  return (
    <form action={action} className="grid gap-4">
      {state.message ? (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
          {state.message}
        </p>
      ) : null}
      <fieldset>
        <legend className="mb-2 text-sm font-semibold">Category</legend>
        <div className="flex flex-wrap gap-2">
          {categories.map((category, index) => (
            <label key={category.id} className="cursor-pointer">
              <input
                type="radio"
                name="category"
                value={category.id}
                defaultChecked={index === 0}
                className="peer sr-only"
                required
              />
              <span className="inline-flex h-11 items-center rounded-full border border-line bg-white px-4 text-sm font-semibold peer-checked:border-brand peer-checked:bg-brand peer-checked:text-white">
                {category.label}
              </span>
            </label>
          ))}
        </div>
        {state.errors.category ? <p className="mt-1 text-sm text-red-700">{state.errors.category}</p> : null}
      </fieldset>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="amount">Amount</Label>
          <Input id="amount" name="amount" inputMode="decimal" placeholder="46.20" required />
          {state.errors.amount ? <p className="text-sm text-red-700">{state.errors.amount}</p> : null}
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="expenseDate">Date</Label>
          <Input id="expenseDate" name="expenseDate" type="date" defaultValue={defaultDate} required />
          {state.errors.expenseDate ? <p className="text-sm text-red-700">{state.errors.expenseDate}</p> : null}
        </div>
      </div>
      {level === "B" ? (
        <div className="grid gap-1.5">
          <Label htmlFor="vehicleId">Vehicle</Label>
          <select id="vehicleId" name="vehicleId" className="h-12 w-full rounded-md border border-line bg-white px-3 text-base" defaultValue={vehicles[0]?.id ?? ""}>
            <option value="">Overhead — not one vehicle</option>
            {vehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.name}
              </option>
            ))}
          </select>
        </div>
      ) : null}
      <div className="grid gap-1.5">
        <Label htmlFor="receipt">Receipt photo</Label>
        <Input id="receipt" name="receipt" type="file" accept="image/jpeg,image/png,image/webp,image/gif" />
        {state.errors.receipt ? <p className="text-sm text-red-700">{state.errors.receipt}</p> : null}
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="notes">Notes</Label>
        <Input id="notes" name="notes" />
      </div>
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Saving…" : "Save expense"}
      </Button>
    </form>
  );
}
