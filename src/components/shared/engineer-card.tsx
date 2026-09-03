"use client";

import { getLevelInfo } from "@/lib/xp";

interface EngineerCardProps {
  name?: string;
  photoUrl?: string;
  college?: string;
  branch?: string;
  xp: number;
  score: number;
  streak: number;
  badgeEmojis?: string[];
  offer?: string;
}

export function EngineerCard({
  name = "Anonymous Engineer",
  photoUrl,
  college = "Unknown College",
  branch = "CSE",
  xp,
  score,
  streak,
  badgeEmojis = [],
  offer,
}: EngineerCardProps) {
  const level = getLevelInfo(xp);
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="relative overflow-hidden rounded-[16px] bg-foreground p-6 text-white select-none">
      {/* Background grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg,transparent,transparent 20px,white 20px,white 21px),repeating-linear-gradient(90deg,transparent,transparent 20px,white 20px,white 21px)",
        }}
      />

      {/* Brand watermark */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5 opacity-80">
        <img src="/berojgar-logo.png" alt="BE" className="h-4 w-auto object-contain" />
        <span className="text-[10px] font-medium tracking-wide">berojgarengineer.club</span>
      </div>

      {/* Avatar + Info */}
      <div className="flex items-center gap-4">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-brand bg-brand text-black font-heading font-bold text-xl flex items-center justify-center">
          {photoUrl ? (
            <img src={photoUrl} alt={name} className="h-full w-full object-cover" />
          ) : (
            <span>{initials}</span>
          )}
        </div>
        <div>
          <p className="font-heading text-lg font-bold leading-tight">{name}</p>
          <p className="text-xs text-white/60 mt-0.5">{branch} · {college}</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="mt-5 grid grid-cols-3 gap-3">
        <div>
          <p className="text-[10px] text-white/50 uppercase tracking-widest">Score</p>
          <p className="font-mono text-2xl font-bold text-brand mt-0.5">{score}</p>
        </div>
        <div>
          <p className="text-[10px] text-white/50 uppercase tracking-widest">XP</p>
          <p className="font-mono text-2xl font-bold mt-0.5">{xp.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-[10px] text-white/50 uppercase tracking-widest">Streak</p>
          <p className="font-mono text-2xl font-bold mt-0.5">🔥{streak}</p>
        </div>
      </div>

      {/* Level badge */}
      <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-brand">
          Lv.{level.level}
        </span>
        <span className="text-[10px] text-white/70">{level.title}</span>
      </div>

      {/* Badges row */}
      {badgeEmojis.length > 0 && (
        <div className="mt-3 flex gap-2">
          {badgeEmojis.slice(0, 6).map((emoji, i) => (
            <span key={i} className="text-lg leading-none" title="Badge">
              {emoji}
            </span>
          ))}
        </div>
      )}

      {/* Offer */}
      {offer && (
        <div className="mt-4 rounded-[8px] bg-brand/20 border border-brand/30 px-3 py-2">
          <p className="text-[10px] text-brand/70 uppercase tracking-widest">Offer Received</p>
          <p className="text-sm font-bold text-brand mt-0.5">{offer}</p>
        </div>
      )}
    </div>
  );
}
