"use client";

import { useState } from "react";
import { OFFER_WALL_DATA } from "@/lib/community-data";
import { OfferWallPost } from "@/types/community";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Sparkles, PartyPopper, CheckCircle2, Share2, MessageSquare, Trophy } from "lucide-react";

export function OfferWall() {
  const [offers, setOffers] = useState<OfferWallPost[]>(OFFER_WALL_DATA);
  const [congratsMap, setCongratsMap] = useState<Record<string, boolean>>({});

  const handleCongratulate = (id: string) => {
    if (congratsMap[id]) return;
    setCongratsMap((prev) => ({ ...prev, [id]: true }));
    setOffers((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, congratulationsCount: o.congratulationsCount + 1 } : o
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <PartyPopper size={16} className="text-emerald-500" />
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">Hall of Placed Engineers</p>
          </div>
          <h2 className="font-heading text-2xl font-bold text-foreground">Offer Letter Wall</h2>
          <p className="text-xs text-muted mt-1">
            Celebrating real success stories from the BEC community. See packages, prep duration, and exact resources used.
          </p>
        </div>
      </div>

      {/* Offers Grid */}
      <div className="grid gap-6 sm:grid-cols-2">
        {offers.map((offer) => (
          <motion.div
            key={offer.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col justify-between rounded-[16px] border border-border bg-white p-6 shadow-xs hover:border-foreground/30 transition-all space-y-4"
          >
            <div className="space-y-4">
              {/* Header Info */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-white shrink-0"
                    style={{ background: offer.avatarColor }}
                  >
                    {offer.studentName[0]}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">{offer.studentName}</h3>
                    <p className="text-xs text-muted">{offer.college} &middot; {offer.branch}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono text-lg font-bold text-emerald-600">₹{offer.packageLpa} LPA</span>
                  <p className="text-[10px] text-muted">Offered: {offer.offerDate}</p>
                </div>
              </div>

              {/* Company & Role Badge */}
              <div className="flex items-center gap-2.5 rounded-[12px] border border-border bg-surface p-3">
                <span className="text-2xl">{offer.logo}</span>
                <div>
                  <p className="text-xs font-bold text-foreground">{offer.company}</p>
                  <p className="text-xs text-muted">{offer.role}</p>
                </div>
              </div>

              {/* Journey */}
              <div>
                <p className="text-[10px] uppercase font-semibold text-muted mb-1">Preparation Journey ({offer.prepTimeMonths} Months Prep)</p>
                <p className="text-xs text-muted leading-relaxed italic">&ldquo;{offer.journey}&rdquo;</p>
              </div>

              {/* Resources Used */}
              <div>
                <p className="text-[10px] uppercase font-semibold text-muted mb-1.5">Resources That Helped</p>
                <div className="flex flex-wrap gap-1">
                  {offer.resourcesUsed.map((res) => (
                    <span key={res} className="rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-2 py-0.5 text-[10px] font-semibold">
                      {res}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <Button
                variant={congratsMap[offer.id] ? "ghost" : "dark"}
                size="sm"
                onClick={() => handleCongratulate(offer.id)}
                className={`gap-2 text-xs ${congratsMap[offer.id] ? "text-emerald-600 bg-emerald-50" : ""}`}
              >
                <PartyPopper size={13} />
                <span>{congratsMap[offer.id] ? "Congratulated!" : "Congratulate"} ({offer.congratulationsCount})</span>
              </Button>

              <Button variant="ghost" size="sm" onClick={() => alert("Shared to LinkedIn!")} className="gap-1.5 text-xs text-muted">
                <Share2 size={13} /> Share
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
