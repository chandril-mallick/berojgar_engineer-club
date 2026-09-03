import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showSubtitle?: boolean;
  className?: string;
}

export function Logo({ size = "md", className = "" }: LogoProps) {
  const imageHeights = {
    sm: "h-7",
    md: "h-9",
    lg: "h-12",
    xl: "h-16",
  };

  return (
    <Link href="/" className={`inline-flex items-center group select-none shrink-0 ${className}`}>
      <img
        src="/berojgar-logo.png"
        alt="Berojgar Engineer Club Logo"
        className={`${imageHeights[size]} w-auto object-contain transition-transform duration-200 group-hover:scale-105`}
      />
    </Link>
  );
}
