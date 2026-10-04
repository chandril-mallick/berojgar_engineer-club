"use client";

import { cn } from "@/lib/utils";

interface SectionDividerProps {
  position?: "top" | "bottom";
  variant?: "wave" | "curve" | "layered" | "slant";
  fillColor?: string; // CSS fill class e.g. fill-brand or fill-[var(--color-foreground)]
  className?: string;
}

export function SectionDivider({
  position = "top",
  variant = "wave",
  fillColor = "fill-brand",
  className = "",
}: SectionDividerProps) {
  const isTop = position === "top";

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden leading-none select-none pointer-events-none block z-10",
        className
      )}
    >
      {variant === "wave" && (
        <svg
          className={cn("relative block w-full h-10 md:h-16 lg:h-20", fillColor)}
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          {isTop ? (
            /* Top wave header: fills from y=120 up to curve */
            <path d="M0,120 L0,50 C200,110 450,10 700,70 C950,110 1100,30 1200,50 L1200,120 Z" />
          ) : (
            /* Bottom wave footer: fills from y=0 down to curve */
            <path d="M0,0 L0,50 C200,110 450,10 700,70 C950,110 1100,30 1200,50 L1200,0 Z" />
          )}
        </svg>
      )}

      {variant === "curve" && (
        <svg
          className={cn("relative block w-full h-8 md:h-14", fillColor)}
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          {isTop ? (
            <path d="M0,120 L0,60 Q600,0 1200,60 L1200,120 Z" />
          ) : (
            <path d="M0,0 L0,60 Q600,120 1200,60 L1200,0 Z" />
          )}
        </svg>
      )}

      {variant === "layered" && (
        <svg
          className={cn("relative block w-full h-12 md:h-20", fillColor)}
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          {isTop ? (
            <>
              <path
                d="M0,120 L0,70 C300,20 600,110 900,40 C1050,10 1150,55 1200,70 L1200,120 Z"
                className="opacity-40"
              />
              <path d="M0,120 L0,50 C200,110 450,10 700,70 C950,110 1100,30 1200,50 L1200,120 Z" />
            </>
          ) : (
            <>
              <path
                d="M0,0 L0,70 C300,20 600,110 900,40 C1050,10 1150,55 1200,70 L1200,0 Z"
                className="opacity-40"
              />
              <path d="M0,0 L0,50 C200,110 450,10 700,70 C950,110 1100,30 1200,50 L1200,0 Z" />
            </>
          )}
        </svg>
      )}

      {variant === "slant" && (
        <svg
          className={cn("relative block w-full h-8 md:h-14", fillColor)}
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          {isTop ? (
            <path d="M0,120 L0,120 L1200,0 L1200,120 Z" />
          ) : (
            <path d="M0,0 L1200,0 L1200,120 L0,0 Z" />
          )}
        </svg>
      )}
    </div>
  );
}
