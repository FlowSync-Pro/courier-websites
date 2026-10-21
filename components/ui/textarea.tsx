import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full rounded-md border border-line bg-white px-3 py-3 text-base text-brand outline-none placeholder:text-muted focus:border-brand focus:ring-2 focus:ring-accent/40",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
