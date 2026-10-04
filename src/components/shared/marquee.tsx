import { cn } from "@/lib/utils";

interface MarqueeProps {
  items: string[];
  speed?: "normal" | "slow";
  className?: string;
}

export function Marquee({ items, speed = "normal", className = "" }: MarqueeProps) {
  // Triple the items to ensure seamless loop on large screens
  const tripleItems = [...items, ...items, ...items];

  return (
    <div
      className={cn("relative flex overflow-hidden py-3 select-none w-full", className)}
      aria-hidden="true"
    >
      {/* Fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-background to-transparent" />

      <div
        className={cn(
          "flex shrink-0 gap-8 items-center w-max",
          speed === "slow" ? "animate-marquee-slow" : "animate-marquee"
        )}
      >
        {tripleItems.map((item, i) => (
          <div key={`m-${i}`} className="flex items-center gap-8 shrink-0">
            <span className="text-xs font-mono font-bold text-foreground/80 uppercase tracking-wider whitespace-nowrap flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand inline-block animate-pulse" />
              {item}
            </span>
            <span className="text-muted/40 font-mono text-xs select-none">&bull;</span>
          </div>
        ))}
      </div>
    </div>
  );
}
