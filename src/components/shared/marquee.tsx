"use client";

interface MarqueeProps {
  items: string[];
  speed?: "normal" | "slow";
  className?: string;
}

export function Marquee({ items, speed = "normal", className = "" }: MarqueeProps) {
  // Duplicate items for seamless loop
  const doubled = [...items, ...items];

  return (
    <div
      className={`relative overflow-hidden py-3 ${className}`}
      aria-hidden="true"
    >
      {/* Fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent" />

      <div
        className={`flex gap-10 whitespace-nowrap ${speed === "slow" ? "animate-marquee-slow" : "animate-marquee"}`}
        style={{ width: "max-content" }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className="text-sm font-medium text-muted shrink-0"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
