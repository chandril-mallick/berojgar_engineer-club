import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[12px] border border-border bg-card p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)]",
        className,
      )}
      {...props}
    />
  );
}
