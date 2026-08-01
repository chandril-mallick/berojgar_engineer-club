"use client";

import { useState } from "react";
import { STUDY_GROUPS_DATA } from "@/lib/community-data";
import { StudyGroup } from "@/types/community";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Mic, MicOff, Volume2, MessageSquare, BookOpen, Calendar, Plus, X, Radio } from "lucide-react";

import { useAuth } from "@/hooks/use-auth";

export function StudyGroups() {
  const { user, requireAuth } = useAuth();
  const [activeGroup, setActiveGroup] = useState<StudyGroup>(STUDY_GROUPS_DATA[0]);
  const [inVoiceRoom, setInVoiceRoom] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [voiceUsersCount, setVoiceUsersCount] = useState(activeGroup.activeVoiceUsers);
  const [messageInput, setMessageInput] = useState("");

  const handleJoinVoice = () => {
    requireAuth(() => {
      if (!inVoiceRoom) {
        setInVoiceRoom(true);
        setVoiceUsersCount((v) => v + 1);
      } else {
        setInVoiceRoom(false);
        setVoiceUsersCount((v) => Math.max(0, v - 1));
      }
    }, "Authentication Required: You must be logged in to join study voice rooms.");
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    requireAuth(() => {
      setActiveGroup((prev) => ({
        ...prev,
        discussions: [
          ...prev.discussions,
          { author: user?.displayName || "You", text: messageInput.trim(), timeAgo: "Just now" },
        ],
      }));
      setMessageInput("");
    }, "Authentication Required: You must be logged in to post messages in study groups.");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Radio size={16} className="text-emerald-500 animate-pulse" />
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">Study Rooms & Live Audio</p>
          </div>
          <h2 className="font-heading text-2xl font-bold text-foreground">Peer Preparation Study Groups</h2>
          <p className="text-xs text-muted mt-1">
            Join domain-specific study rooms, share Drive notes, and join live evening voice channels.
          </p>
        </div>
      </div>

      {/* Group Selector Ribbon */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {STUDY_GROUPS_DATA.map((group) => (
          <button
            key={group.id}
            onClick={() => {
              setActiveGroup(group);
              setVoiceUsersCount(group.activeVoiceUsers);
              setInVoiceRoom(false);
            }}
            className={`flex items-center gap-2 rounded-[12px] border px-4 py-2.5 text-xs font-bold transition-all shrink-0 ${
              activeGroup.id === group.id
                ? "border-foreground bg-foreground text-white shadow-sm"
                : "border-border bg-white text-muted hover:border-foreground/30 hover:text-foreground"
            }`}
          >
            <span>{group.emoji}</span>
            <span>{group.name}</span>
          </button>
        ))}
      </div>

      {/* Active Group Hub Card */}
      <div className="rounded-[16px] border border-border bg-white p-6 shadow-xs space-y-6">
        {/* Top Info + Voice Channel Widget */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{activeGroup.emoji}</span>
              <h3 className="font-heading text-xl font-bold text-foreground">{activeGroup.name}</h3>
              <Badge variant="muted">{activeGroup.category}</Badge>
            </div>
            <p className="text-xs text-muted mt-1">{activeGroup.description}</p>
          </div>

          {/* Voice Room Join Widget */}
          <div className="rounded-[12px] border border-emerald-200 bg-emerald-50/60 p-3.5 flex items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-2">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-900">Live Voice Room</p>
                <p className="text-[10px] text-emerald-700 font-mono">{voiceUsersCount} Engineers Speaking</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {inVoiceRoom && (
                <button
                  onClick={() => setIsMuted((m) => !m)}
                  className={`p-2 rounded-full border ${isMuted ? "bg-rose-100 text-rose-700 border-rose-300" : "bg-white text-emerald-700 border-emerald-300"}`}
                >
                  {isMuted ? <MicOff size={14} /> : <Mic size={14} />}
                </button>
              )}
              <Button
                variant={inVoiceRoom ? "danger" : "dark"}
                size="sm"
                onClick={handleJoinVoice}
                className="gap-1.5 text-xs"
              >
                {inVoiceRoom ? "Leave Voice" : "Join Voice Room"}
              </Button>
            </div>
          </div>
        </div>

        {/* Discussion + Resources Layout */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Main Discussion Feed */}
          <div className="md:col-span-2 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted flex items-center gap-1.5">
              <MessageSquare size={13} /> Group Discussion Feed
            </p>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {activeGroup.discussions.map((d, i) => (
                <div key={i} className="rounded-[10px] border border-border bg-surface p-3 space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-muted">
                    <span className="font-bold text-foreground">{d.author}</span>
                    <span>{d.timeAgo}</span>
                  </div>
                  <p className="text-xs text-foreground leading-relaxed">{d.text}</p>
                </div>
              ))}
            </div>

            {/* Post Message */}
            <form onSubmit={handleSendMessage} className="flex gap-2 pt-1">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Ask a question or post a solution..."
                className="flex-1 h-9 rounded-[8px] border border-border px-3 text-xs outline-none focus:border-foreground/40"
              />
              <Button type="submit" variant="dark" size="sm">
                Post
              </Button>
            </form>
          </div>

          {/* Resources & Events */}
          <div className="space-y-4 border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted flex items-center gap-1.5 mb-2">
                <BookOpen size={13} /> Shared Resources
              </p>
              <div className="space-y-1.5">
                {activeGroup.resources.map((res, i) => (
                  <a key={i} href={res.link} className="flex items-center justify-between rounded-[8px] border border-border p-2 text-xs font-medium hover:border-foreground/30 transition-colors">
                    <span className="text-foreground truncate">{res.title}</span>
                    <Badge variant="muted">{res.type}</Badge>
                  </a>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted flex items-center gap-1.5 mb-2">
                <Calendar size={13} /> Group Events
              </p>
              <div className="space-y-1.5">
                {activeGroup.upcomingEvents.map((ev, i) => (
                  <div key={i} className="rounded-[8px] border border-border bg-surface p-2 text-xs">
                    <p className="font-bold text-foreground">{ev.title}</p>
                    <p className="text-[10px] text-muted mt-0.5">{ev.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
