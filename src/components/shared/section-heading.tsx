import React from "react";
import { cn } from "@/lib/utils";

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
}

export function Eyebrow({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "font-mono text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-muted mb-1.5",
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}

export function PageHeading({
  children,
  subtitle,
  align = "left",
  className,
  ...props
}: HeadingProps) {
  return (
    <div className={cn("space-y-2", align === "center" && "text-center", align === "right" && "text-right")}>
      <h1
        className={cn(
          "font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground",
          className
        )}
        {...props}
      >
        {children}
      </h1>
      {subtitle && (
        <p className="text-sm sm:text-base text-muted max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function SectionHeading({
  children,
  subtitle,
  align = "left",
  className,
  ...props
}: HeadingProps) {
  return (
    <div className={cn("space-y-1.5", align === "center" && "text-center", align === "right" && "text-right")}>
      <h2
        className={cn(
          "font-heading text-xl sm:text-2xl font-bold tracking-tight text-foreground",
          className
        )}
        {...props}
      >
        {children}
      </h2>
      {subtitle && (
        <p className="text-xs sm:text-sm text-muted max-w-xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
