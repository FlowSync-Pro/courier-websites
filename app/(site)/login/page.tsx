import type { Metadata } from "next";
import { client } from "@/config/site";
import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = { title: "Owner login" };

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <p className="text-sm font-semibold uppercase tracking-wide text-accent-ink">Owner</p>
      <h1 className="mt-1 font-display text-5xl font-bold leading-none">Dashboard</h1>
      <p className="mt-3 text-muted">
        Sign in to {client.shortName}. Customers do not need an account — this is the owner&apos;s book.
      </p>
      <div className="mt-6 rounded-lg border border-line bg-white p-5">
        <LoginForm />
      </div>
    </div>
  );
}
