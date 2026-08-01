import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showSubtitle?: boolean;
}

export function Logo({ size = "md", showSubtitle = true }: LogoProps) {
  const containerHeights = {
    sm: "h-9",
    md: "h-11",
    lg: "h-14",
  };

  return (
    <Link href="/" className="flex items-center gap-3 group">
      <div className={`relative overflow-hidden rounded-xl shrink-0 bg-black/5 flex items-center justify-center p-0.5 border border-border/50 shadow-2xs ${containerHeights[size]}`}>
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-auto max-w-[160px] sm:max-w-[200px] object-contain rounded-lg group-hover:scale-105 transition-transform duration-200"
        >
          <source src="/createa_motion_ligo.mp4" type="video/mp4" />
          {/* Fallback image */}
          <img
            src="/berojgar-logo.png"
            alt="Berojgar Engineer Logo"
            className="h-full w-auto object-contain"
          />
        </video>
      </div>
      <div>
        <p className="font-heading text-[16.5px] font-bold tracking-tight text-foreground leading-none">
          BEROJGAR ENGINEER CLUB
        </p>
        {showSubtitle && (
          <p className="text-[10px] text-muted tracking-wide font-medium leading-none mt-1 hidden sm:block">
            From Berojgar to Employable
          </p>
        )}
      </div>
    </Link>
  );
}
