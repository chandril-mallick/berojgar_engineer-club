"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Bot, Send, Sparkles, User, FileText, Code2, DollarSign, BrainCircuit, RefreshCw } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { saveAIChatMessage } from "@/lib/firestore-service";

interface Message {
  id: string;
  sender: "ai" | "user";
  text: string;
  mode?: string;
}

type AIMode = "coach" | "resume" | "interview" | "negotiate";

const AI_MODES = [
  { id: "coach" as AIMode, name: "Career Coach", icon: Bot, badge: "24/7 AI", color: "border-purple-300 bg-purple-50 text-purple-900" },
  { id: "resume" as AIMode, name: "Resume Roaster", icon: FileText, badge: "ATS AI", color: "border-red-300 bg-red-50 text-red-900" },
  { id: "interview" as AIMode, name: "Mock Interviewer", icon: Code2, badge: "SDE Drill", color: "border-blue-300 bg-blue-50 text-blue-900" },
  { id: "negotiate" as AIMode, name: "Salary Negotiator", icon: DollarSign, badge: "CTC AI", color: "border-emerald-300 bg-emerald-50 text-emerald-900" },
];

const PRESETS_BY_MODE: Record<AIMode, string[]> = {
  coach: [
    "What should I learn today?",
    "How do I drop my Berojgar Score?",
    "Am I ready for Google / Amazon?",
    "Why am I getting rejected in HR/OA?",
  ],
  resume: [
    "Roast my resume line-by-line!",
    "Calculate my ATS keyword match score.",
    "Convert my project bullet into Google X-Y-Z formula.",
    "Fix my skills section for SDE-1.",
  ],
  interview: [
    "Ask me 1 Amazon Leadership STAR question.",
    "Test me on Binary Tree Graph BFS vs DFS.",
    "Give me 1 System Design question for SDE-1.",
    "Conduct a 2-minute mock HR phone screen.",
  ],
  negotiate: [
    "How do I negotiate SDE base pay from ₹12 LPA to ₹16 LPA?",
    "Should I accept joining bonus vs stocks?",
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
      text: "⚡ AI Mode ACTIVE! I am your AI Career Mentor at BEROJGAR ENGINEER CLUB. I analyze your score, projects, resume ATS match, and target companies. Select an AI mode above or ask me anything!",
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

          // Save chat to Cloud Firestore if logged in
          if (user?.uid) {
            saveAIChatMessage(user.uid, {
              prompt: query,
              reply: data.reply,
              mode: activeMode,
              model: data.model || "nvidia/llama-3.1-nemotron-70b-instruct:free",
            });
          }
          return;
        }
      }
    } catch (err) {
      console.warn("AI route fetch fallback:", err);
    }

    // Fallback response if offline
    const qLower = query.toLowerCase();
    let aiResponse = "";
    if (activeMode === "resume") {
      aiResponse = "🔥 ROAST MODE (NVIDIA Nemotron): Your resume needs 3 quick fixes: 1) Replace buzzwords with LeetCode metrics. 2) Add live GitHub demo URLs. 3) Use Google X-Y-Z formula for bullet points.";
    } else if (activeMode === "interview") {
      aiResponse = "🎯 Mock Interview Drill (NVIDIA Nemotron): Practice articulating constraints out loud! For array/string problems, clarify O(1) space constraints and null checks first.";
    } else if (activeMode === "negotiate") {
      aiResponse = "💰 Negotiation Strategy (NVIDIA Nemotron): Never state your expectations first. Ask HR for their approved base salary band and leverage competing offers.";
    } else {
      aiResponse = "⚡ NVIDIA Nemotron AI Mentor: Focus on solving 2 Medium DSA problems daily, building 1 full-stack app with a demo link, and requesting campus referrals on BEC!";
    }

    setMessages((prev) => [...prev, { id: `a-${Date.now()}`, sender: "ai", text: aiResponse, mode: activeMode }]);
    setLoading(false);
  };

  const currentModeObj = AI_MODES.find((m) => m.id === activeMode) || AI_MODES[0];

  return (
    <div className="rounded-[16px] border border-border bg-white p-6 shadow-md space-y-5 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-foreground text-white text-2xl shadow-xs">
            <BrainCircuit size={24} className="text-purple-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading text-lg font-bold text-foreground">AI Career Intelligence System</h3>
              <span className="inline-flex items-center gap-1 rounded-full border border-purple-300 bg-purple-50 px-2.5 py-0.5 text-xs font-bold text-purple-900 font-mono">
                <Sparkles size={12} className="text-purple-600 animate-spin" /> AI Mode ACTIVE
              </span>
            </div>
            <p className="text-xs text-muted">Multi-agent AI for Resume Roasting, SDE Mock Interviews, & CTC Negotiation</p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMessages([{ id: "m1", sender: "ai", text: "AI Session reset. Select a mode or type your query below!", mode: activeMode }])}
          className="gap-1 text-xs text-muted hover:text-foreground"
        >
          <RefreshCw size={13} /> Reset Chat
        </Button>
      </div>

      {/* Mode Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {AI_MODES.map((mode) => {
          const Icon = mode.icon;
          const isActive = activeMode === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => setActiveMode(mode.id)}
              className={`flex items-center gap-2 rounded-[12px] border p-2.5 text-left transition-all ${
                isActive
                  ? "border-foreground bg-foreground text-white shadow-xs"
                  : "border-border bg-surface text-muted hover:border-foreground/30 hover:text-foreground"
              }`}
            >
              <Icon size={16} className={isActive ? "text-purple-300" : "text-foreground"} />
              <div>
                <p className="text-xs font-bold leading-tight">{mode.name}</p>
                <p className={`text-[10px] ${isActive ? "text-white/70" : "text-muted"}`}>{mode.badge}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Presets for current active mode */}
      <div>
        <p className="text-[10px] uppercase font-semibold text-muted mb-2">Suggested {currentModeObj.name} Prompts</p>
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

      {/* Chat Messages Container */}
      <div className="space-y-3 max-h-96 overflow-y-auto pr-1 py-2 rounded-[12px] border border-border bg-surface/40 p-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-2.5 ${m.sender === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold shrink-0 shadow-xs ${
                m.sender === "user"
                  ? "bg-brand text-white"
                  : "bg-foreground text-purple-300"
              }`}
            >
              {m.sender === "user" ? "U" : <BrainCircuit size={16} />}
            </div>
            <div
              className={`rounded-[14px] p-3.5 text-xs leading-relaxed max-w-[85%] whitespace-pre-line ${
                m.sender === "user"
                  ? "bg-foreground text-white"
                  : "bg-white border border-border text-foreground shadow-xs"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-xs text-muted font-mono p-2">
            <Sparkles size={14} className="animate-spin text-purple-600" /> AI {currentModeObj.name} processing...
          </div>
        )}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex gap-2 border-t border-border pt-3"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask AI ${currentModeObj.name} anything...`}
          className="flex-1 h-10 rounded-[10px] border border-border bg-white px-3.5 text-xs outline-none focus:border-foreground/40 font-medium"
        />
        <Button type="submit" variant="dark" size="sm" className="h-10 px-4 gap-1.5">
          <Send size={14} /> Send
        </Button>
      </form>
    </div>
  );
}
