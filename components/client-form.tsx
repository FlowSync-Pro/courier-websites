"use client";

import { useActionState } from "react";
import { addClient, type FormState } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initial: FormState = { ok: false, message: "", errors: {} };

export function ClientForm({ level }: { level: "A" | "B" }) {
  const [state, action, pending] = useActionState(addClient, initial);
  return (
    <form action={action} className="grid gap-3 rounded-lg border border-line bg-white p-4">
      <h2 className="font-display text-3xl font-bold">Add a client</h2>
      {state.message ? (
        <p className={`text-sm ${state.ok ? "text-emerald-800" : "text-red-700"}`} role="status">
          {state.message}
        </p>
      ) : null}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="businessName">Business</Label>
          <Input id="businessName" name="businessName" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" inputMode="tel" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" />
        </div>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="notes">Notes</Label>
        <Input id="notes" name="notes" />
      </div>
      {level === "B" ? (
        <div className="grid gap-3 rounded-md bg-paper p-3">
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input type="checkbox" name="recurring" className="h-5 w-5" />
            Recurring route client
          </label>
          <div className="grid gap-1.5">
            <Label htmlFor="schedule">Standing schedule</Label>
            <Input id="schedule" name="schedule" placeholder="Tue and Thu, standing morning route" />
          </div>
        </div>
      ) : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save client"}
      </Button>
    </form>
  );
}
