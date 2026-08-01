import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

const variants = {
  primary: "bg-brand text-black hover:bg-brand/90 active:scale-[0.98]",
  ghost:
    "bg-transparent text-foreground border border-border hover:bg-muted-bg active:scale-[0.98]",
  dark: "bg-foreground text-white hover:bg-foreground/85 active:scale-[0.98]",
  danger: "bg-danger text-white hover:bg-danger/90 active:scale-[0.98]",
};

const sizes = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-sm",
};

type Variant = keyof typeof variants;
type Size = keyof typeof sizes;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-[10px] font-medium whitespace-nowrap shrink-0 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed select-none",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
