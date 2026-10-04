"use client";

import { useEffect, useState } from "react";
import { OFFER_WALL_DATA } from "@/lib/community-data";
import { OfferWallPost } from "@/types/community";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, PartyPopper, CheckCircle2, Share2, Plus, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { getCommunityOffers, saveCommunityOffer, getUserFirestoreProfile } from "@/lib/firestore-service";

interface OfferProfile {
  college?: string;
  branch?: string;
  year?: string;
}

interface PersistedOffer {
  id?: string;
  studentName?: string;
  college?: string;
  branch?: string;
  company?: string;
  role?: string;
  packageLpa?: number;
  storySnippet?: string;
}

export function OfferWall() {
  const { user, requireAuth } = useAuth();
  const [offers, setOffers] = useState<OfferWallPost[]>(OFFER_WALL_DATA);
  const [congratsMap, setCongratsMap] = useState<Record<string, boolean>>({});
  const [showModal, setShowModal] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [profile, setProfile] = useState<OfferProfile | null>(null);

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [packageLpa, setPackageLpa] = useState("");
  const [journey, setJourney] = useState("");

  useEffect(() => {
    if (!user) {
      queueMicrotask(() => setProfile(null));
      return;
    }
    const uid = user.uid;
    async function fetchProfile() {
      const res = await getUserFirestoreProfile(uid);
      if (res.success && res.data) {
        setProfile(res.data as OfferProfile);
      }
    }
    fetchProfile();
  }, [user]);

  useEffect(() => {
    async function loadOffers() {
      const res = await getCommunityOffers();
      if (res.success && res.data.length > 0) {
        const userOffers: OfferWallPost[] = (res.data as PersistedOffer[]).map((d, idx) => ({
          id: d.id || `user-offer-${idx}`,
          studentName: d.studentName || "Placed Engineer",
          college: d.college || "Engineering College",
          branch: d.branch || "CSE",
          company: d.company || "Tech Company",
          logo: "🎉",
          role: d.role || "Software Engineer",
          packageLpa: Number(d.packageLpa) || 15,
          offerDate: "Recent",
          avatarColor: "#10b981",
          journey: d.storySnippet || "Built projects, practiced daily DSA drills, and aced technical rounds.",
          resourcesUsed: ["BEC Daily Challenge", "Real-World DSA Lab", "Resume Roaster"],
          resumeHighlights: ["3 fullstack projects", "500+ LeetCode solved"],
          congratulationsCount: 12,
          questionsCount: 0,
          prepTimeMonths: 4,
        }));
        setOffers([...userOffers, ...OFFER_WALL_DATA]);
      }
    }
    loadOffers();
  }, []);

  const handleCongratulate = (id: string) => {
    if (congratsMap[id]) return;
    setCongratsMap((prev) => ({ ...prev, [id]: true }));
    setOffers((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, congratulationsCount: o.congratulationsCount + 1 } : o
      )
    );
  };

  const handleCreateOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    requireAuth(async () => {
      const userCollege = profile?.college || "Engineering College";
      const userBranch = profile?.branch || "CSE";
      const userYear = profile?.year || "4";

      const newOfferObj: OfferWallPost = {
        id: `offer-${Date.now()}`,
        studentName: user?.displayName || "You",
        college: userCollege,
        branch: userBranch,
        company: company || "Top Startup",
        logo: "🚀",
        role: role || "SDE-1",
        packageLpa: Number(packageLpa) || 18,
        offerDate: "Just now",
        avatarColor: "#6366f1",
        journey: journey || "Worked hard, solved daily DSA problems on BEC, and got placed!",
        resourcesUsed: ["BEC DSA Lab", "AI Career Coach"],
        resumeHighlights: [],
        congratulationsCount: 1,
        questionsCount: 0,
        prepTimeMonths: 3,
      };

      setOffers((prev) => [newOfferObj, ...prev]);
      setShowModal(false);
      setFormSubmitted(true);

      if (user) {
        await saveCommunityOffer({
          studentName: user.displayName || "Engineer",
          college: userCollege,
          company,
          role,
          packageLpa: Number(packageLpa) || 18,
          branch: userBranch,
          year: userYear,
          storySnippet: journey,
        });
      }
    }, "Authentication Required to share your placement story.");
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

        <Button
          variant="dark"
          size="sm"
          onClick={() => setShowModal(true)}
          className="gap-2 shrink-0 text-xs font-bold"
        >
          <Plus size={14} /> Post Placement Offer
        </Button>
      </div>

      {/* Post Offer Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-[20px] border border-border bg-white p-6 shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <PartyPopper size={18} className="text-emerald-500" />
                  <h3 className="font-heading text-base font-bold text-foreground">Share Placement Offer</h3>
                </div>
                <button onClick={() => setShowModal(false)} className="text-muted hover:text-foreground">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateOffer} className="space-y-3.5">
                <div>
                  <label className="text-[10px] font-semibold uppercase text-muted">Company Name</label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Google, Atlassian, Swiggy"
                    className="w-full h-9 rounded-[8px] border border-border px-3 text-xs outline-none focus:border-foreground/40 mt-1"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-semibold uppercase text-muted">Offered Role</label>
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. SDE 1 / Software Engineer"
                    className="w-full h-9 rounded-[8px] border border-border px-3 text-xs outline-none focus:border-foreground/40 mt-1"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-semibold uppercase text-muted">CTC Package (LPA in ₹ Lakhs)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={packageLpa}
                    onChange={(e) => setPackageLpa(e.target.value)}
                    placeholder="e.g. 18.5"
                    className="w-full h-9 rounded-[8px] border border-border px-3 text-xs outline-none focus:border-foreground/40 mt-1"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-semibold uppercase text-muted">Preparation Journey & Advice</label>
                  <textarea
                    required
                    rows={3}
                    value={journey}
                    onChange={(e) => setJourney(e.target.value)}
                    placeholder="Describe how you prepared, daily DSA drills solved, and tips for juniors..."
                    className="w-full rounded-[8px] border border-border p-2.5 text-xs outline-none focus:border-foreground/40 mt-1 resize-none"
                  />
                </div>

                <Button type="submit" variant="dark" size="sm" className="w-full gap-2 text-xs font-bold mt-2">
                  <PartyPopper size={14} /> Publish Story to Offer Wall
                </Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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

              <Button variant="ghost" size="sm" onClick={() => {
                const url = typeof window !== "undefined" ? window.location.href : "https://berojgarengineer.club";
                navigator.clipboard?.writeText(url).catch(() => {});
              }} className="gap-1.5 text-xs text-muted">
                <Share2 size={13} /> Share
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
