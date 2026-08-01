import { cn } from "@/lib/utils";
import { SelectHTMLAttributes } from "react";

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-10 w-full rounded-[8px] border border-border bg-white px-3.5 text-sm text-foreground outline-none transition-shadow duration-150 cursor-pointer appearance-none",
        "focus:border-foreground/30 focus:ring-2 focus:ring-foreground/8",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    />
  );
}
