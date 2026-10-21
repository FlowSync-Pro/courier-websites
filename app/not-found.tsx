import Link from "next/link";
import { client } from "@/config/site";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20">
      <h1 className="font-display text-5xl font-bold">That page is not on this site.</h1>
      <p className="mt-3 text-lg text-muted">{client.legalName} does not have a page at this address.</p>
      <Link href="/" className="mt-6 inline-flex h-12 items-center rounded-md bg-accent px-4 font-semibold text-brand">
        Back home
      </Link>
    </div>
  );
}
