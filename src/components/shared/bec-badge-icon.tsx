"use client";

import React from "react";
import { BadgeRarity } from "@/types";

interface BECBadgeIconProps {
  id: string;
  rarity: BadgeRarity;
  unlocked?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function BECBadgeIcon({
  id,
  rarity,
  unlocked = true,
  size = "md",
  className = "",
}: BECBadgeIconProps) {
  const sizePixels = {
    sm: "w-10 h-10",
    md: "w-14 h-14",
    lg: "w-20 h-20",
    xl: "w-24 h-24",
  }[size];

  // Rarity Metallic Gradients & Glowing Borders
  const rarityStyles = {
    common: {
      gradient: "from-slate-200 via-slate-100 to-slate-300",
      border: "border-slate-300",
      glow: "shadow-[0_0_12px_rgba(148,163,184,0.3)]",
      accent: "#64748b",
      badgeBg: "bg-gradient-to-b from-slate-100 to-slate-200",
    },
    rare: {
      gradient: "from-sky-400 via-blue-500 to-indigo-600",
      border: "border-sky-400",
      glow: "shadow-[0_0_16px_rgba(56,189,248,0.4)]",
      accent: "#0284c7",
      badgeBg: "bg-gradient-to-b from-sky-50 to-indigo-100",
    },
    epic: {
      gradient: "from-purple-400 via-fuchsia-500 to-pink-600",
      border: "border-purple-400",
      glow: "shadow-[0_0_20px_rgba(168,85,247,0.5)]",
      accent: "#9333ea",
      badgeBg: "bg-gradient-to-b from-purple-50 to-pink-100",
    },
    legendary: {
      gradient: "from-[#fbbf24] via-[#f59e0b] to-[#d97706]",
      border: "border-amber-400",
      glow: "shadow-[0_0_24px_rgba(245,158,11,0.6)]",
      accent: "#d97706",
      badgeBg: "bg-gradient-to-b from-amber-50 via-amber-100 to-amber-200",
    },
  }[rarity];

  // Custom Vector Emblem paths per badge ID
  const renderEmblemSVG = () => {
    switch (id) {
      case "first-blood":
        return (
          // Lightning Blade Shield
          <g>
            <path d="M12 2L4 6V12C4 17.5 7.4 22.6 12 24C16.6 22.6 20 17.5 20 12V6L12 2Z" fill="url(#grad-shield)" stroke={rarityStyles.accent} strokeWidth="1.5" />
            <path d="M13 6L7 14H12L11 20L17 12H12L13 6Z" fill="#ffffff" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.3))" />
          </g>
        );

      case "resume-warrior":
        return (
          // Flame Document Armor
          <g>
            <path d="M12 2L4 6V12C4 17.5 7.4 22.6 12 24C16.6 22.6 20 17.5 20 12V6L12 2Z" fill="url(#grad-shield)" stroke={rarityStyles.accent} strokeWidth="1.5" />
            <path d="M8 8H16V16H8V8Z" fill="#ffffff" rx="1.5" opacity="0.9" />
            <path d="M10 10H14M10 12H14M10 14H12" stroke={rarityStyles.accent} strokeWidth="1.5" strokeLinecap="round" />
            <path d="M12 15C13.5 15 14.5 16 14.5 17.5C14.5 19 13 20 12 21C11 20 9.5 19 9.5 17.5C9.5 16 10.5 15 12 15Z" fill="#f59e0b" />
          </g>
        );

      case "dsa-hero":
        return (
          // Binary Node Crown Shield
          <g>
            <path d="M12 2L4 6V12C4 17.5 7.4 22.6 12 24C16.6 22.6 20 17.5 20 12V6L12 2Z" fill="url(#grad-shield)" stroke={rarityStyles.accent} strokeWidth="1.5" />
            <circle cx="12" cy="9" r="2.5" fill="#ffffff" />
            <circle cx="8" cy="16" r="2" fill="#ffffff" />
            <circle cx="16" cy="16" r="2" fill="#ffffff" />
            <path d="M12 11.5L8 14M12 11.5L16 14" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        );

      case "github-beast":
        return (
          // Octocat Emerald Core
          <g>
            <path d="M12 2L4 6V12C4 17.5 7.4 22.6 12 24C16.6 22.6 20 17.5 20 12V6L12 2Z" fill="url(#grad-shield)" stroke={rarityStyles.accent} strokeWidth="1.5" />
            <path d="M12 6C8.7 6 6 8.7 6 12C6 14.7 7.7 16.9 10.1 17.7C10.4 17.8 10.5 17.6 10.5 17.4C10.5 17.3 10.5 16.8 10.5 16.2C8.8 16.5 8.5 15.4 8.5 15.4C8.2 14.7 7.8 14.5 7.8 14.5C7.3 14.1 7.8 14.1 7.8 14.1C8.4 14.1 8.7 14.7 8.7 14.7C9.2 15.6 10.1 15.3 10.5 15.1C10.5 14.7 10.7 14.4 10.9 14.2C9.5 14.1 8.1 13.5 8.1 11.1C8.1 10.4 8.3 9.8 8.7 9.4C8.7 9.2 8.5 8.5 8.8 7.6C8.8 7.6 9.3 7.4 10.5 8.2C11 8.1 11.5 8 12 8C12.5 8 13 8.1 13.5 8.2C14.7 7.4 15.2 7.6 15.2 7.6C15.5 8.5 15.3 9.2 15.3 9.4C15.7 9.8 15.9 10.4 15.9 11.1C15.9 13.5 14.5 14.1 13.1 14.2C13.3 14.4 13.5 14.8 13.5 15.4C13.5 16.3 13.5 17.1 13.5 17.4C13.5 17.6 13.6 17.8 13.9 17.7C16.3 16.9 18 14.7 18 12C18 8.7 15.3 6 12 6Z" fill="#ffffff" />
          </g>
        );

      case "placement-slayer":
        return (
          // Flame Trophy Sovereign
          <g>
            <path d="M12 2L4 6V12C4 17.5 7.4 22.6 12 24C16.6 22.6 20 17.5 20 12V6L12 2Z" fill="url(#grad-shield)" stroke={rarityStyles.accent} strokeWidth="1.5" />
            <path d="M12 7L13.5 10H17L14.2 12.2L15.3 15.5L12 13.5L8.7 15.5L9.8 12.2L7 10H10.5L12 7Z" fill="#ffffff" />
            <path d="M9 17H15V19H9V17Z" fill="#ffffff" />
          </g>
        );

      case "night-coder":
        return (
          // Crescent Moon & Stars Shield
          <g>
            <path d="M12 2L4 6V12C4 17.5 7.4 22.6 12 24C16.6 22.6 20 17.5 20 12V6L12 2Z" fill="url(#grad-shield)" stroke={rarityStyles.accent} strokeWidth="1.5" />
            <path d="M14.5 8C12 8 10 10 10 12.5C10 15 12 17 14.5 17C15.2 17 15.8 16.8 16.3 16.5C14.5 17.5 12.2 17.2 10.8 15.7C9.3 14.2 9.2 11.9 10.3 10.2C11.3 8.6 13.2 7.8 15 8.2C14.8 8.1 14.6 8 14.5 8Z" fill="#ffffff" />
            <circle cx="8" cy="9" r="1" fill="#ffffff" />
            <circle cx="16.5" cy="8.5" r="0.8" fill="#ffffff" />
          </g>
        );

      case "streak-7":
        return (
          // 7-Day Flame Crest Shield
          <g>
            <path d="M12 2L4 6V12C4 17.5 7.4 22.6 12 24C16.6 22.6 20 17.5 20 12V6L12 2Z" fill="url(#grad-shield)" stroke={rarityStyles.accent} strokeWidth="1.5" />
            <path d="M12 7C14 9.5 15.5 11 15.5 13C15.5 15 14 16.5 12 16.5C10 16.5 8.5 15 8.5 13C8.5 11 10 9.5 12 7Z" fill="#ffffff" />
            <text x="12" y="19" textAnchor="middle" fill="#ffffff" fontSize="5" fontWeight="bold" fontFamily="monospace">7D</text>
          </g>
        );

      case "streak-30":
        return (
          // Imperial 30 Titan Laurel Shield
          <g>
            <path d="M12 2L4 6V12C4 17.5 7.4 22.6 12 24C16.6 22.6 20 17.5 20 12V6L12 2Z" fill="url(#grad-shield)" stroke={rarityStyles.accent} strokeWidth="1.5" />
            <path d="M6 15L8 9L12 11.5L16 9L18 15H6Z" fill="#ffffff" />
            <circle cx="6" cy="8" r="1" fill="#ffffff" />
            <circle cx="12" cy="7" r="1.3" fill="#ffffff" />
            <circle cx="18" cy="8" r="1" fill="#ffffff" />
            <text x="12" y="19.5" textAnchor="middle" fill="#ffffff" fontSize="4.5" fontWeight="bold" fontFamily="monospace">30D</text>
          </g>
        );

      case "top-1-percent":
        return (
          // Crown Imperial Diamond Shield
          <g>
            <path d="M12 2L4 6V12C4 17.5 7.4 22.6 12 24C16.6 22.6 20 17.5 20 12V6L12 2Z" fill="url(#grad-shield)" stroke={rarityStyles.accent} strokeWidth="1.5" />
            <path d="M12 6L16 10L12 17L8 10L12 6Z" fill="#ffffff" />
            <path d="M8 10H16" stroke={rarityStyles.accent} strokeWidth="1" />
          </g>
        );

      case "referral-king":
        return (
          // Network Alliance Hands Shield
          <g>
            <path d="M12 2L4 6V12C4 17.5 7.4 22.6 12 24C16.6 22.6 20 17.5 20 12V6L12 2Z" fill="url(#grad-shield)" stroke={rarityStyles.accent} strokeWidth="1.5" />
            <circle cx="9" cy="10" r="2.2" fill="#ffffff" />
            <circle cx="15" cy="10" r="2.2" fill="#ffffff" />
            <path d="M6.5 16C6.5 13.8 8 13 9 13C10 13 11 13.5 12 14.5C13 13.5 14 13 15 13C16 13 17.5 17.5 16" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        );

      case "interview-master":
        return (
          // STAR Audio Wave Spectrum Shield
          <g>
            <path d="M12 2L4 6V12C4 17.5 7.4 22.6 12 24C16.6 22.6 20 17.5 20 12V6L12 2Z" fill="url(#grad-shield)" stroke={rarityStyles.accent} strokeWidth="1.5" />
            <path d="M8 14V10M10.5 16V8M13.5 17V7M16 14V10" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
          </g>
        );

      case "overachiever":
        return (
          // BEC Golden Certified Wings Crest Shield
          <g>
            <path d="M12 2L4 6V12C4 17.5 7.4 22.6 12 24C16.6 22.6 20 17.5 20 12V6L12 2Z" fill="url(#grad-shield)" stroke={rarityStyles.accent} strokeWidth="1.5" />
            <path d="M12 6.5L13.8 10.2L17.8 10.8L14.9 13.6L15.6 17.6L12 15.7L8.4 17.6L9.1 13.6L6.2 10.8L10.2 10.2L12 6.5Z" fill="#ffffff" />
          </g>
        );

      default:
        return (
          // Default Sovereign Crest
          <g>
            <path d="M12 2L4 6V12C4 17.5 7.4 22.6 12 24C16.6 22.6 20 17.5 20 12V6L12 2Z" fill="url(#grad-shield)" stroke={rarityStyles.accent} strokeWidth="1.5" />
            <circle cx="12" cy="12" r="4.5" fill="#ffffff" />
            <path d="M12 9.5V14.5M9.5 12H14.5" stroke={rarityStyles.accent} strokeWidth="1.5" strokeLinecap="round" />
          </g>
        );
    }
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${sizePixels} ${className} transition-all duration-300 ${
        unlocked ? `${rarityStyles.glow} scale-100` : "opacity-40 grayscale scale-95"
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        className="w-full h-full drop-shadow-sm overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="grad-shield" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={rarityStyles.accent} stopOpacity="0.9" />
            <stop offset="100%" stopColor={rarityStyles.accent} stopOpacity="1" />
          </linearGradient>
        </defs>

        {renderEmblemSVG()}
      </svg>
    </div>
  );
}
