import { cn } from "@/lib/utils";
import { InputHTMLAttributes } from "react";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-[8px] border border-border bg-white px-3.5 text-sm text-foreground placeholder:text-muted/60 outline-none transition-shadow duration-150",
        "focus:border-foreground/30 focus:ring-2 focus:ring-foreground/8",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    />
  );
}
