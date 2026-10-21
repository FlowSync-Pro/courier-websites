import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "h-12 w-full rounded-md border border-line bg-white px-3 text-base text-brand outline-none placeholder:text-muted focus:border-brand focus:ring-2 focus:ring-accent/40",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
