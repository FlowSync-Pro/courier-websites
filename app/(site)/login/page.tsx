import type { Metadata } from "next";
import { client } from "@/config/site";
import { LoginForm } from "@/components/login-form";
import "../_components/site.module.css";

export const metadata: Metadata = { title: "Owner login" };

export default function LoginPage() {
  return (
    <div className={`${"wrap"} ${"page"}`} style={{ maxWidth: 520 }}>
      <p className={"kicker"}>Owner</p>
      <h1>Dashboard</h1>
      <p className={"lede"} style={{ textAlign: "center" }}>
        Sign in to {client.shortName}. Customers do not need an account. This is the owner&apos;s book.
      </p>
      <div className={`${"pageCard"} ${"loginCard"}`} style={{ marginTop: 20 }}>
        <LoginForm />
      </div>
    </div>
  );
}
