"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Bot,
  Send,
  Sparkles,
  FileText,
  Code2,
  DollarSign,
  BrainCircuit,
  RefreshCw,
  Paperclip,
  Mic,
  BookOpen
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { saveAIChatMessage } from "@/lib/firestore-service";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  sender: "ai" | "user";
  text: string;
  mode?: string;
}

type AIMode = "coach" | "resume" | "interview" | "negotiate";

const AI_MODES = [
  { id: "coach" as AIMode, name: "Career Coach", icon: Bot, badge: "24/7 Mentor", color: "border-amber-200 bg-amber-50/50 text-amber-900" },
  { id: "resume" as AIMode, name: "Resume Roaster", icon: FileText, badge: "ATS Scorer", color: "border-blue-200 bg-blue-50/50 text-blue-900" },
  { id: "interview" as AIMode, name: "Mock Interviewer", icon: Code2, badge: "STAR Drills", color: "border-emerald-200 bg-emerald-50/50 text-emerald-900" },
  { id: "negotiate" as AIMode, name: "Salary Negotiator", icon: DollarSign, badge: "CTC Strategy", color: "border-pink-200 bg-pink-50/50 text-pink-900" },
];

const PRESETS_BY_MODE: Record<AIMode, string[]> = {
  coach: [
    "What should I learn today to beat placement competition?",
    "How do I improve my current Berojgar Score?",
    "Am I ready for Google / Amazon?",
  ],
  resume: [
    "Roast my resume line-by-line!",
    "Calculate my ATS keyword match score.",
    "Convert my project bullets into Google X-Y-Z formula.",
  ],
  interview: [
    "Ask me 1 Amazon Leadership STAR question.",
    "Test me on Binary Tree BFS vs DFS.",
    "Give me 1 System Design question for SDE-1.",
  ],
  negotiate: [
    "How do I negotiate SDE base pay from ₹12 LPA to ₹16 LPA?",
    "Draft a counter-offer email for HR.",
    "Compare Amazon vs Microsoft offer packages.",
  ],
};

export function AICoachDrawer() {
  const { user } = useAuth();
  const [activeMode, setActiveMode] = useState<AIMode>("coach");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m1",
      sender: "ai",
      text: "⚡ BEC AI Coach active! Select a tool below or start typing. I specialize in resume roasting, technical mock interview runs, and CTC pay negotiation.",
      mode: "coach",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: Message = { id: `u-${Date.now()}`, sender: "user", text: query, mode: activeMode };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: query, mode: activeMode }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.reply) {
          setMessages((prev) => [
            ...prev,
            { id: `a-${Date.now()}`, sender: "ai", text: data.reply, mode: activeMode },
          ]);
          setLoading(false);

          if (user?.uid) {
            saveAIChatMessage(user.uid, {
              prompt: query,
              reply: data.reply,
              mode: activeMode,
              model: data.model || "gemini-2.0-flash",
            });
          }
          return;
        }
      }
    } catch (err) {
      console.warn("AI route fetch fallback:", err);
    }

    const aiResponse = activeMode === "resume"
      ? "🔥 ROAST MODE: Your resume needs 3 quick fixes: 1) Replace abstract buzzwords with LeetCode metrics. 2) Add live GitHub deployment URLs. 3) Use Google's X-Y-Z formula for project bullet points."
      : activeMode === "interview"
      ? "🎯 Mock Interview Drill: Practice explaining constraints out loud! For array/string problems, clarify O(1) space constraints and null check inputs first."
      : activeMode === "negotiate"
      ? "💰 Negotiation Strategy: Never state your expectations first. Ask HR for their approved base salary bands and leverage competing offers."
      : "⚡ AI Coach: Focus on solving 2 Medium DSA problems daily, building 1 full-stack app with a demo link, and requesting campus referrals on BEC!";

    setMessages((prev) => [...prev, { id: `a-${Date.now()}`, sender: "ai", text: aiResponse, mode: activeMode }]);
    setLoading(false);
  };

  const currentModeObj = AI_MODES.find((m) => m.id === activeMode) || AI_MODES[0];

  return (
    <div className="rounded-[24px] border border-border bg-white p-6 md:p-8 shadow-xs max-w-4xl mx-auto space-y-6">
      {/* 1. Header Toolbar */}
      <div className="flex flex-row items-center justify-between gap-4 border-b border-border/60 pb-4.5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground text-white shrink-0">
            <BrainCircuit size={20} className="text-purple-400" />
          </div>
          <div>
            <h3 className="font-heading text-sm font-bold text-foreground">AI Chat</h3>
            <p className="text-[10px] text-muted">India's first brutally honest career mentor</p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMessages([{ id: "m1", sender: "ai", text: "AI Session reset. Select a tool or type your query below!", mode: activeMode }])}
          className="gap-1.5 text-xs text-muted hover:text-foreground"
        >
          <RefreshCw size={12} /> Reset Chat
        </Button>
      </div>

      {/* 2. Welcome State (Only shown when there are no user messages yet, only the initial welcome message) */}
      {messages.length <= 1 && (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-10 space-y-10 max-w-xl mx-auto">
          <div>
            <h2 className="font-heading text-3xl font-extrabold text-foreground tracking-tight">
              Welcome to AI Chat
            </h2>
            <p className="text-xs text-muted mt-2 max-w-xs leading-relaxed">
              Get started by selecting an AI tool below. Not sure where to start? Let the AI Coach guide you.
            </p>
          </div>

          {/* 2x2 Action Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            {/* Career Coach (Yellow Card) */}
            <button
              type="button"
              onClick={() => {
                setActiveMode("coach");
                handleSend("What should I learn today to beat placement competition?");
              }}
              className="flex items-center justify-between rounded-[20px] border border-amber-200 bg-amber-50/40 p-4.5 text-left transition-all hover:bg-amber-100/40 group"
            >
              <div className="space-y-1">
                <p className="text-xs font-bold text-amber-900">Career Coach</p>
                <p className="text-[10px] text-amber-700/80">Custom roadmap & DSA strategy</p>
              </div>
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white border border-amber-300 text-amber-700 group-hover:scale-105 transition-transform shrink-0">
                <Bot size={14} />
              </div>
            </button>

            {/* Resume Roaster (Blue Card) */}
            <button
              type="button"
              onClick={() => {
                setActiveMode("resume");
                handleSend("Roast my resume line-by-line!");
              }}
              className="flex items-center justify-between rounded-[20px] border border-blue-200 bg-blue-50/40 p-4.5 text-left transition-all hover:bg-blue-100/40 group"
            >
              <div className="space-y-1">
                <p className="text-xs font-bold text-blue-900">Resume Roaster</p>
                <p className="text-[10px] text-blue-700/80">ATS keyword scoring & roast</p>
              </div>
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white border border-blue-300 text-blue-700 group-hover:scale-105 transition-transform shrink-0">
                <FileText size={14} />
              </div>
            </button>

            {/* Mock Interviewer (Green Card) */}
            <button
              type="button"
              onClick={() => {
                setActiveMode("interview");
                handleSend("Conduct a 2-minute mock HR phone screen.");
              }}
              className="flex items-center justify-between rounded-[20px] border border-emerald-200 bg-emerald-50/40 p-4.5 text-left transition-all hover:bg-emerald-100/40 group"
            >
              <div className="space-y-1">
                <p className="text-xs font-bold text-emerald-900">Mock Interviewer</p>
                <p className="text-[10px] text-emerald-700/80">Real-world System Design STAR drills</p>
              </div>
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white border border-emerald-300 text-emerald-700 group-hover:scale-105 transition-transform shrink-0">
                <Code2 size={14} />
              </div>
            </button>

            {/* Salary Negotiator (Pink Card) */}
            <button
              type="button"
              onClick={() => {
                setActiveMode("negotiate");
                handleSend("How do I negotiate SDE base pay?");
              }}
              className="flex items-center justify-between rounded-[20px] border border-pink-200 bg-pink-50/40 p-4.5 text-left transition-all hover:bg-pink-100/40 group"
            >
              <div className="space-y-1">
                <p className="text-xs font-bold text-pink-900">Salary Negotiator</p>
                <p className="text-[10px] text-pink-700/80">Base pay negotiation & counter-offers</p>
              </div>
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white border border-pink-300 text-pink-700 group-hover:scale-105 transition-transform shrink-0">
                <DollarSign size={14} />
              </div>
            </button>
          </div>
        </div>
      )}

      {/* 3. Messages Stream (Hidden on welcome, shown once chat is active) */}
      {messages.length > 1 && (
        <div className="space-y-4">
          {/* Active Mode Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {AI_MODES.map((mode) => {
              const Icon = mode.icon;
              const isActive = activeMode === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => setActiveMode(mode.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-[12px] border p-2 text-left transition-all",
                    isActive
                      ? "border-foreground bg-foreground text-white shadow-2xs"
                      : "border-border bg-surface text-muted hover:border-foreground/30 hover:text-foreground"
                  )}
                >
                  <Icon size={14} className={isActive ? "text-purple-300" : "text-foreground"} />
                  <div>
                    <p className="text-[10px] font-bold leading-tight">{mode.name}</p>
                    <p className={cn("text-[9px]", isActive ? "text-white/70" : "text-muted")}>{mode.badge}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Messages Wrapper */}
          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 py-2 rounded-[16px] border border-border/80 bg-surface/30 p-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn("flex items-start gap-2.5", m.sender === "user" && "flex-row-reverse")}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold shrink-0 shadow-xs",
                    m.sender === "user" ? "bg-brand text-white" : "bg-foreground text-purple-300"
                  )}
                >
                  {m.sender === "user" ? "U" : <BrainCircuit size={15} />}
                </div>
                <div
                  className={cn(
                    "rounded-[14px] p-3 text-xs leading-relaxed max-w-[85%] whitespace-pre-line shadow-2xs",
                    m.sender === "user"
                      ? "bg-foreground text-white"
                      : "bg-white border border-border text-foreground"
                  )}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-xs text-muted font-mono p-2">
                <Sparkles size={13} className="animate-spin text-purple-600" /> AI {currentModeObj.name} processing...
              </div>
            )}
          </div>

          {/* Quick suggestions */}
          <div>
            <p className="text-[9px] uppercase font-semibold text-muted mb-2">Suggested {currentModeObj.name} Prompts</p>
            <div className="flex flex-wrap gap-1.5">
              {PRESETS_BY_MODE[activeMode].map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted hover:border-foreground/30 hover:text-foreground transition-colors text-left"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. Custom consolidated input container */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="space-y-2"
      >
        <div className="rounded-[16px] border border-border bg-white shadow-2xs focus-within:border-foreground/30 focus-within:ring-1 focus-within:ring-foreground/10 overflow-hidden">
          {/* Upper row: Input field + Send button */}
          <div className="flex items-center px-4 py-3 gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask AI ${currentModeObj.name} anything...`}
              className="flex-1 text-xs outline-none bg-transparent text-foreground placeholder:text-muted/60 font-medium"
              maxLength={2000}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg transition-all shrink-0",
                input.trim() && !loading
                  ? "bg-foreground text-white hover:opacity-90"
                  : "text-muted bg-surface cursor-not-allowed"
              )}
            >
              <Send size={13} />
            </button>
          </div>

          {/* Lower row: Actions Toolbar */}
          <div className="border-t border-border/50 bg-surface px-4 py-2 flex items-center justify-between text-[11px] text-muted font-medium select-none">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => handleSend("Analyze my resume formatting guidelines")}
                className="flex items-center gap-1.5 hover:text-foreground transition-colors"
              >
                <Paperclip size={13} className="text-muted" />
                <span>Attach</span>
              </button>
              <button
                type="button"
                onClick={() => handleSend("Simulate voice assessment run")}
                className="flex items-center gap-1.5 hover:text-foreground transition-colors"
              >
                <Mic size={13} className="text-muted" />
                <span>Voice Message</span>
              </button>
              <button
                type="button"
                onClick={() => handleSend("Browse popular interview advice prompts")}
                className="flex items-center gap-1.5 hover:text-foreground transition-colors"
              >
                <BookOpen size={13} className="text-muted" />
                <span>Browse Prompts</span>
              </button>
            </div>
            <div className="text-muted/80 font-mono text-[9px] shrink-0">
              {input.length} / 2,000
            </div>
          </div>
        </div>

        {/* Disclaimer footer */}
        <p className="text-[10px] text-muted/70 text-center">
          BEC Coach may generate inaccurate career info. Primary Model: paid-tier OpenRouter AI (Gemini 2.0 Flash).
        </p>
      </form>
    </div>
  );
}


