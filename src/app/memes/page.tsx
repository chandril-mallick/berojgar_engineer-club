"use client";

import { useState } from "react";
import { MemeFeed } from "@/components/community/meme-feed";
import { PlacementStories } from "@/components/community/placement-stories";

export default function MemesPage() {
  const [activeSubTab, setActiveSubTab] = useState<"memes" | "stories">("memes");

  return (
    <div className="py-6 space-y-6">
      {/* Top Switcher */}
      <div className="flex items-center gap-2 border-b border-border text-xs font-bold max-w-2xl mx-auto">
        <button
          onClick={() => setActiveSubTab("memes")}
          className={`flex-1 py-3 text-center border-b-2 transition-colors ${
            activeSubTab === "memes"
              ? "border-foreground text-foreground"
              : "border-transparent text-muted hover:text-foreground"
          }`}
        >
          🎭 Engineering Meme Feed
        </button>
        <button
          onClick={() => setActiveSubTab("stories")}
          className={`flex-1 py-3 text-center border-b-2 transition-colors ${
            activeSubTab === "stories"
              ? "border-foreground text-foreground"
              : "border-transparent text-muted hover:text-foreground"
          }`}
        >
          🕵️ Anonymous Placement Stories
        </button>
      </div>

      {activeSubTab === "memes" ? <MemeFeed /> : <PlacementStories />}
    </div>
  );
}
