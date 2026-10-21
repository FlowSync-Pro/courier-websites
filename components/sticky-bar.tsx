import Link from "next/link";
import { smsHref, telHref } from "@/lib/catalog";

export function StickyBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-white p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] md:hidden">
      <div className="grid grid-cols-3 gap-2">
        <a
          href={telHref()}
          className="flex h-12 items-center justify-center rounded-md border-2 border-brand text-sm font-semibold text-brand"
        >
          Call
        </a>
        <a
          href={smsHref()}
          className="flex h-12 items-center justify-center rounded-md border-2 border-brand text-sm font-semibold text-brand"
        >
          Text
        </a>
        <Link
          href="/quote"
          className="flex h-12 items-center justify-center rounded-md bg-accent text-sm font-semibold text-brand"
        >
          Get a Quote
        </Link>
      </div>
    </div>
  );
}
