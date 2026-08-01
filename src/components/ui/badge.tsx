import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

const variants = {
  default: "border border-border bg-white text-foreground",
  muted: "border-transparent bg-muted-bg text-muted",
  brand: "border-transparent bg-brand/15 text-foreground",
  dark: "border-transparent bg-foreground text-white",
  success: "border-transparent bg-success/10 text-success",
  danger: "border-transparent bg-danger/10 text-danger",
  warning: "border-transparent bg-amber-500/10 text-amber-700",
};

type BadgeVariant = keyof typeof variants;

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-wide",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
