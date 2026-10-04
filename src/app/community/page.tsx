"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  Handshake,
  Flame,
  PartyPopper,
  Zap,
  Radio,
  Award,
  Bot,
  ArrowRight,
  Sparkles,
  Cpu,
} from "lucide-react";
import Link from "next/link";

const COMMUNITY_HUBS = [
  {
    title: "Real-World DSA Lab",
    href: "/real-world-dsa",
    icon: Cpu,
    badge: "Engineering Scenarios",
    description: "Learn DSA by solving realistic business problems from Swiggy, Google Maps, 1mg, and Amazon.",
    color: "bg-amber-50 text-amber-700 border-amber-200",
  },
  {
    title: "Referral Queue",
    href: "/referrals",
    icon: Handshake,
    badge: "Candidate Matching",
    description: "Join the verified candidate referral queue to match with real engineers as our referrer network grows.",
    color: "bg-purple-50 text-purple-700 border-purple-200",
  },
  {
    title: "Meme Feed & Confessions",
    href: "/memes",
    icon: Flame,
    badge: "Daily Laughs",
    description: "Placement memes, hostel stories, coding confessions, and daily engineering coping mechanisms.",
    color: "bg-rose-50 text-rose-700 border-rose-200",
  },
  {
    title: "Offer Letter Wall",
    href: "/offer-wall",
    icon: PartyPopper,
    badge: "Celebrations",
    description: "Celebrate placed students, inspect CTC packages, preparation time, and exact resources used.",
    color: "bg-teal-50 text-teal-700 border-teal-200",
  },
  {
    title: "Daily Coding Grind",
    href: "/daily-challenge",
    icon: Zap,
    badge: "+150 XP Daily",
    description: "Solve daily DSA, Aptitude, SQL, CS MCQ, and AI questions to build your streak and climb the leaderboard.",
    color: "bg-yellow-50 text-yellow-700 border-yellow-200",
  },
  {
    title: "Study Groups & Live Voice Rooms",
    href: "/study-groups",
    icon: Radio,
    badge: "Live Audio",
    description: "Join GATE CSE, DSA Grind, and Google Interview peer study rooms with active evening voice channels.",
    color: "bg-cyan-50 text-cyan-700 border-cyan-200",
  },
  {
    title: "Campus Ambassador Program",
    href: "/ambassador",
    icon: Award,
    badge: "Earn Rewards",
    description: "Lead your college engineering community. Earn XP, leadership certificates, and cash stipends.",
    color: "bg-orange-50 text-orange-700 border-orange-200",
  },
];

export default function CommunityPage() {
  return (
    <div className="space-y-12 py-4">
      {/* Hero Header */}
      <div className="space-y-4">
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-2">
            BEROJGAR ENGINEER CLUB
          </p>
          <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl leading-tight max-w-3xl">
            India&apos;s Largest Engineering Community & Career Hub
          </h1>
          <p className="mt-3 text-sm text-muted max-w-2xl leading-relaxed">
            Stop studying alone. Connect with 12,000+ engineers across India to roast resumes, share placement tips, compete on college leaderboards, join referral queues, and crack dream jobs together.
          </p>
        </motion.div>
      </div>

      {/* Community Hubs Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {COMMUNITY_HUBS.map((hub, idx) => {
          const IconComponent = hub.icon;
          return (
            <motion.div
              key={hub.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
            >
              <Link
                href={hub.href}
                className="flex flex-col justify-between h-full rounded-[16px] border border-border bg-white p-5 shadow-xs hover:border-foreground/30 hover:shadow-md transition-all group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${hub.color}`}>
                      <IconComponent size={20} />
                    </div>
                    <Badge variant="muted">{hub.badge}</Badge>
                  </div>

                  <div>
                    <h3 className="font-heading text-base font-bold text-foreground group-hover:text-brand transition-colors">
                      {hub.title}
                    </h3>
                    <p className="text-xs text-muted leading-relaxed mt-1">{hub.description}</p>
                  </div>
                </div>

                <div className="flex items-center text-xs font-bold text-foreground group-hover:text-brand pt-4 mt-2 border-t border-border">
                  Explore Hub <ArrowRight size={13} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
