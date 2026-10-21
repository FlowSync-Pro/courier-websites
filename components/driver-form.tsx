"use client";

import { useActionState } from "react";
import { addDriver, type FormState } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initial: FormState = { ok: false, message: "", errors: {} };

export function DriverForm() {
  const [state, action, pending] = useActionState(addDriver, initial);
  return (
    <form action={action} className="grid gap-3 rounded-lg border border-line bg-white p-4">
      <h2 className="font-display text-3xl font-bold">Add a driver</h2>
      {state.message ? <p className="text-sm">{state.message}</p> : null}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" />
        </div>
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save driver"}
      </Button>
    </form>
  );
}
