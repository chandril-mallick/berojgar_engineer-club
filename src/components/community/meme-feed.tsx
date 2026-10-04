"use client";

import { useEffect, useState } from "react";
import { MEMES_DATA } from "@/lib/community-data";
import { MemeItem } from "@/types/community";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageSquare, Share2, Bookmark, PlusCircle, Flame, Sparkles, X, Send } from "lucide-react";

import { useAuth } from "@/hooks/use-auth";

const CATEGORIES = ["All", "Placement", "Coding", "Exam", "Hostel", "Interview", "Confession"];
const MEME_CACHE_KEY = "bec-community-user-memes";

export function MemeFeed() {
  const { user, requireAuth } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [memes, setMemes] = useState<MemeItem[]>(MEMES_DATA);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [savedMap, setSavedMap] = useState<Record<string, boolean>>({});
  const [activeCommentMeme, setActiveCommentMeme] = useState<MemeItem | null>(null);
  const [newCommentText, setNewCommentText] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newCaption, setNewCaption] = useState("");
  const [newCategory, setNewCategory] = useState<MemeItem["category"]>("Placement");

  useEffect(() => {
    try {
      const cached = window.localStorage.getItem(MEME_CACHE_KEY);
      if (cached) {
        const userMemes: MemeItem[] = JSON.parse(cached);
        queueMicrotask(() => setMemes([...userMemes, ...MEMES_DATA]));
      }
    } catch (e) {
      console.error("Failed to load cached user memes", e);
    }
  }, []);

  const filtered = memes.filter((m) => {
    if (selectedCategory !== "All" && m.category !== selectedCategory) return false;
    return true;
  });

  const toggleLike = (id: string) => {
    setLikedMap((prev) => ({ ...prev, [id]: !prev[id] }));
    setMemes((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, likes: m.likes + (likedMap[id] ? -1 : 1) } : m
      )
    );
  };

  const toggleSave = (id: string) => {
    setSavedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCommentMeme || !newCommentText.trim()) return;

    requireAuth(() => {
      const newComment = {
        id: `c-${Date.now()}`,
        author: "You",
        text: newCommentText.trim(),
        timeAgo: "Just now",
      };

      setMemes((prev) =>
        prev.map((m) =>
          m.id === activeCommentMeme.id
            ? {
                ...m,
                commentsCount: m.commentsCount + 1,
                comments: [...(m.comments || []), newComment],
              }
            : m
        )
      );

      setActiveCommentMeme((prev) =>
        prev
          ? {
              ...prev,
              commentsCount: prev.commentsCount + 1,
              comments: [...(prev.comments || []), newComment],
            }
          : null
      );

      setNewCommentText("");
    }, "Authentication Required: You must be signed in to post comments.");
  };

  const handleCreateMeme = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCaption.trim()) return;

    requireAuth(() => {
      const newPost: MemeItem = {
        id: `m-${Date.now()}`,
        author: newCategory === "Confession" ? "Anonymous Engineer" : user?.displayName || "You",
        college: "Your College",
        avatarColor: "#8b5cf6",
        caption: newCaption.trim(),
        category: newCategory,
        likes: 1,
        commentsCount: 0,
        shares: 0,
        timeAgo: "Just now",
        isConfession: newCategory === "Confession",
      };

      try {
        const cached = window.localStorage.getItem(MEME_CACHE_KEY);
        const existing: MemeItem[] = cached ? JSON.parse(cached) : [];
        const updated = [newPost, ...existing];
        window.localStorage.setItem(MEME_CACHE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error("Failed to cache new user meme", err);
      }

      setMemes((prev) => [newPost, ...prev]);
      setNewCaption("");
      setCreateModalOpen(false);
    }, "Authentication Required: You must be signed in to post memes or confessions.");
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Flame size={16} className="text-amber-500" />
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">Engineering Meme Feed</p>
          </div>
          <h2 className="font-heading text-2xl font-bold text-foreground">Relaugh, Relate & Recover</h2>
          <p className="text-xs text-muted mt-1">
            Placement memes, hostel stories, coding confessions, and daily engineering coping mechanisms.
          </p>
        </div>

        <Button variant="dark" size="sm" onClick={() => setCreateModalOpen(true)} className="gap-2">
          <PlusCircle size={13} /> Post Meme or Confession
        </Button>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-1.5">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              selectedCategory === cat
                ? "border-foreground bg-foreground text-white"
                : "border-border text-muted hover:border-foreground/30 hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Feed List */}
      <div className="max-w-2xl mx-auto space-y-4">
        {filtered.map((meme) => (
          <motion.div
            key={meme.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[16px] border border-border bg-white p-5 shadow-xs space-y-4"
          >
            {/* User Meta */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white shrink-0"
                  style={{ background: meme.avatarColor }}
                >
                  {meme.author[0]}
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">{meme.author}</p>
                  <p className="text-[10px] text-muted">{meme.college} &middot; {meme.timeAgo}</p>
                </div>
              </div>
              <Badge variant={meme.isConfession ? "danger" : "muted"}>{meme.category}</Badge>
            </div>

            {/* Caption */}
            <p className="text-sm font-medium text-foreground leading-relaxed font-sans">{meme.caption}</p>

            {/* Optional Image */}
            {meme.imageUrl && (
              <img src={meme.imageUrl} alt="Meme" className="rounded-[12px] w-full border border-border object-cover max-h-72" />
            )}

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-border text-xs text-muted">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleLike(meme.id)}
                  className={`flex items-center gap-1.5 font-mono font-medium transition-colors ${
                    likedMap[meme.id] ? "text-rose-500 font-bold" : "hover:text-foreground"
                  }`}
                >
                  <Heart size={15} className={likedMap[meme.id] ? "fill-rose-500" : ""} />
                  <span>{meme.likes}</span>
                </button>

                <button
                  onClick={() => setActiveCommentMeme(meme)}
                  className="flex items-center gap-1.5 font-mono font-medium hover:text-foreground transition-colors"
                >
                  <MessageSquare size={15} />
                  <span>{meme.commentsCount}</span>
                </button>

                <button
                  onClick={() => navigator.clipboard?.writeText(window.location.href).catch(() => {})}
                  className="flex items-center gap-1.5 hover:text-foreground transition-colors"
                >
                  <Share2 size={15} />
                </button>
              </div>

              <button
                onClick={() => toggleSave(meme.id)}
                className={`transition-colors ${savedMap[meme.id] ? "text-amber-500" : "hover:text-foreground"}`}
              >
                <Bookmark size={15} className={savedMap[meme.id] ? "fill-amber-500" : ""} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Comment Drawer Modal */}
      <AnimatePresence>
        {activeCommentMeme && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveCommentMeme(null)} className="fixed inset-0 bg-black/40 backdrop-blur-xs" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative z-10 w-full max-w-md max-h-[80vh] flex flex-col rounded-[16px] border border-border bg-white p-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-heading text-sm font-bold text-foreground">Comments</h3>
                <button onClick={() => setActiveCommentMeme(null)} className="text-muted hover:text-foreground">
                  <X size={16} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-3 space-y-3">
                {activeCommentMeme.comments && activeCommentMeme.comments.length > 0 ? (
                  activeCommentMeme.comments.map((c) => (
                    <div key={c.id} className="rounded-[8px] border border-border bg-surface p-2.5 space-y-0.5">
                      <div className="flex items-center justify-between text-[10px] text-muted">
                        <span className="font-bold text-foreground">{c.author}</span>
                        <span>{c.timeAgo}</span>
                      </div>
                      <p className="text-xs text-foreground">{c.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted text-center py-4">No comments yet. Be the first!</p>
                )}
              </div>

              <form onSubmit={handlePostComment} className="flex gap-2 border-t border-border pt-3">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  className="flex-1 h-9 rounded-[8px] border border-border px-3 text-xs outline-none focus:border-foreground/40"
                />
                <Button type="submit" variant="dark" size="sm">
                  <Send size={13} />
                </Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create Meme/Confession Modal */}
      <AnimatePresence>
        {createModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setCreateModalOpen(false)} className="fixed inset-0 bg-black/40 backdrop-blur-xs" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative z-10 w-full max-w-md rounded-[16px] border border-border bg-white p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-lg font-bold text-foreground">Post Meme or Confession</h3>
                <button onClick={() => setCreateModalOpen(false)} className="text-muted hover:text-foreground"><X size={18} /></button>
              </div>

              <form onSubmit={handleCreateMeme} className="space-y-3">
                <div>
                  <label className="text-[10px] font-semibold uppercase text-muted">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as typeof newCategory)}
                    className="w-full h-9 rounded-[8px] border border-border px-3 text-xs outline-none focus:border-foreground/40 mt-1"
                  >
                    {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-semibold uppercase text-muted">Caption / Story</label>
                  <textarea
                    required
                    rows={4}
                    value={newCaption}
                    onChange={(e) => setNewCaption(e.target.value)}
                    placeholder="Write your funny experience, HR story, or engineering confession..."
                    className="w-full rounded-[8px] border border-border p-2.5 text-xs outline-none focus:border-foreground/40 mt-1 resize-none"
                  />
                </div>

                <Button type="submit" variant="dark" size="sm" className="w-full gap-2">
                  <Sparkles size={13} /> Publish Post
                </Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
