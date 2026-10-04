"use client";

import { useState } from "react";
import { PLACEMENT_STORIES_DATA } from "@/lib/community-data";
import { AnonymousPlacementStory } from "@/types/community";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Ghost, Sparkles, MessageSquare, ThumbsUp, Plus, Tag, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { recordWorkSubmission } from "@/services/task-service";

export function PlacementStories() {
  const { user, requireAuth } = useAuth();
  const [stories, setStories] = useState<AnonymousPlacementStory[]>(PLACEMENT_STORIES_DATA);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [category, setCategory] = useState<AnonymousPlacementStory["category"]>("Placement Experience");

  const filtered = stories.filter((s) => {
    if (selectedCategory !== "All" && s.category !== selectedCategory) return false;
    return true;
  });

  const handleReact = (id: string, type: keyof AnonymousPlacementStory["reactions"]) => {
    setStories((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              reactions: { ...s.reactions, [type]: s.reactions[type] + 1 },
            }
          : s
      )
    );
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    requireAuth(async () => {
      const newStory: AnonymousPlacementStory = {
        id: `ps-${Date.now()}`,
        category,
        title: title.trim(),
        content: content.trim(),
        company: company.trim() || "Unspecified Firm",
        branch: "Computer Science",
        role: role.trim() || "Software Engineer",
        college: "Anonymous Student",
        difficulty: "Medium",
        upvotes: 1,
        reactions: { cry: 0, skull: 0, rocket: 1, clown: 0, clap: 1 },
        commentsCount: 0,
        timeAgo: "Just now",
      };

      setStories([newStory, ...stories]);
      setTitle("");
      setContent("");
      setModalOpen(false);

      if (user) {
        await recordWorkSubmission(user.uid, {
          type: "placement_story",
          title: title.trim(),
          payload: { category, company, role },
        });
      }
    }, "Authentication Required: You must be signed in to post placement stories.");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Ghost size={16} className="text-purple-500" />
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">Confidential Stories</p>
          </div>
          <h2 className="font-heading text-2xl font-bold text-foreground">Anonymous Placement & HR Stories</h2>
          <p className="text-xs text-muted mt-1">
            Unfiltered experiences, ghosted emails, dream job offers, and hard lessons learned without revealing identities.
          </p>
        </div>

        <Button variant="dark" size="sm" onClick={() => setModalOpen(true)} className="gap-2">
          <Plus size={13} /> Share Story Anonymously
        </Button>
      </div>

      {/* Stories List */}
      <div className="space-y-4">
        {filtered.map((story) => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[16px] border border-border bg-white p-5 shadow-xs space-y-3"
          >
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="muted">{story.category}</Badge>
                  <span className="text-xs text-muted font-semibold">• AI Auto-Tagged:</span>
                  <Badge variant="muted">{story.company}</Badge>
                  <Badge variant="muted">{story.role}</Badge>
                  <Badge variant={story.difficulty === "Hard" ? "danger" : "warning"}>{story.difficulty}</Badge>
                </div>
                <h3 className="font-heading text-base font-bold text-foreground mt-2">{story.title}</h3>
              </div>
              <span className="text-[10px] text-muted font-mono">{story.timeAgo}</span>
            </div>

            <p className="text-xs text-muted leading-relaxed whitespace-pre-line">{story.content}</p>

            {/* Reaction Bar */}
            <div className="flex items-center justify-between pt-3 border-t border-border flex-wrap gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => handleReact(story.id, "rocket")}
                  className="flex items-center gap-1 rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-medium hover:border-foreground/30 transition-colors"
                >
                  🚀 <span>{story.reactions.rocket}</span>
                </button>

                <button
                  onClick={() => handleReact(story.id, "cry")}
                  className="flex items-center gap-1 rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-medium hover:border-foreground/30 transition-colors"
                >
                  😭 <span>{story.reactions.cry}</span>
                </button>

                <button
                  onClick={() => handleReact(story.id, "skull")}
                  className="flex items-center gap-1 rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-medium hover:border-foreground/30 transition-colors"
                >
                  💀 <span>{story.reactions.skull}</span>
                </button>

                <button
                  onClick={() => handleReact(story.id, "clown")}
                  className="flex items-center gap-1 rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-medium hover:border-foreground/30 transition-colors"
                >
                  🤡 <span>{story.reactions.clown}</span>
                </button>

                <button
                  onClick={() => handleReact(story.id, "clap")}
                  className="flex items-center gap-1 rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-medium hover:border-foreground/30 transition-colors"
                >
                  👏 <span>{story.reactions.clap}</span>
                </button>
              </div>

              <div className="flex items-center gap-3 text-xs text-muted">
                <span className="flex items-center gap-1 font-mono"><MessageSquare size={13} /> {story.commentsCount} comments</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Share Anonymous Story Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalOpen(false)} className="fixed inset-0 bg-black/40 backdrop-blur-xs" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative z-10 w-full max-w-md rounded-[16px] border border-border bg-white p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-lg font-bold text-foreground">Post Anonymous Story</h3>
                <button onClick={() => setModalOpen(false)} className="text-muted hover:text-foreground"><X size={18} /></button>
              </div>

              <form onSubmit={handleCreate} className="space-y-3">
                <div>
                  <label className="text-[10px] font-semibold uppercase text-muted">Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value as typeof category)} className="w-full h-9 rounded-[8px] border border-border px-3 text-xs outline-none focus:border-foreground/40 mt-1">
                    <option value="Placement Experience">Placement Experience</option>
                    <option value="Interview Experience">Interview Experience</option>
                    <option value="Ghosted by HR">Ghosted by HR</option>
                    <option value="Offer Revoked">Offer Revoked</option>
                    <option value="Dream Job">Dream Job</option>
                    <option value="Rejected Story">Rejected Story</option>
                    <option value="Funny Story">Funny Story</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-semibold uppercase text-muted">Title</label>
                  <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Cleared 4 rounds then HR ghosted..." className="w-full h-9 rounded-[8px] border border-border px-3 text-xs outline-none focus:border-foreground/40 mt-1" />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-semibold uppercase text-muted">Company</label>
                    <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g. Swiggy" className="w-full h-9 rounded-[8px] border border-border px-3 text-xs outline-none focus:border-foreground/40 mt-1" />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold uppercase text-muted">Role</label>
                    <input type="text" value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. SDE-1" className="w-full h-9 rounded-[8px] border border-border px-3 text-xs outline-none focus:border-foreground/40 mt-1" />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-semibold uppercase text-muted">Story Details</label>
                  <textarea required rows={4} value={content} onChange={(e) => setContent(e.target.value)} placeholder="Share what actually happened..." className="w-full rounded-[8px] border border-border p-2.5 text-xs outline-none focus:border-foreground/40 mt-1 resize-none" />
                </div>

                <Button type="submit" variant="dark" size="sm" className="w-full gap-2">
                  <Sparkles size={13} /> Publish Anonymously
                </Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
