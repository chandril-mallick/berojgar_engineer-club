"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { REAL_WORLD_DSA_CHALLENGES } from "@/lib/real-world-dsa-data";
import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  ArrowRight, 
  Cpu, 
  Code2, 
  Search, 
  Filter, 
  Flame, 
  Building2,
  Sparkles,
  Trophy,
  Check,
  ChevronRight,
  Layers,
  Zap,
  BookOpen
} from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";

export default function RealWorldDSAProblemsetPage() {
  const [completedSlugs] = useLocalStorage<string[]>("bec-rwdsa-completed", []);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const totalCount = REAL_WORLD_DSA_CHALLENGES.length;
  const completedCount = completedSlugs.length;

  const easyCount = REAL_WORLD_DSA_CHALLENGES.filter(c => c.difficulty === "Easy").length;
  const easySolved = REAL_WORLD_DSA_CHALLENGES.filter(c => c.difficulty === "Easy" && completedSlugs.includes(c.slug)).length;

  const mediumCount = REAL_WORLD_DSA_CHALLENGES.filter(c => c.difficulty === "Medium").length;
  const mediumSolved = REAL_WORLD_DSA_CHALLENGES.filter(c => c.difficulty === "Medium" && completedSlugs.includes(c.slug)).length;

  const hardCount = REAL_WORLD_DSA_CHALLENGES.filter(c => c.difficulty === "Hard").length;
  const hardSolved = REAL_WORLD_DSA_CHALLENGES.filter(c => c.difficulty === "Hard" && completedSlugs.includes(c.slug)).length;

  // Filtered Challenges
  const filteredChallenges = useMemo(() => {
    return REAL_WORLD_DSA_CHALLENGES.filter((c) => {
      const matchesSearch =
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.dsaConcept.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.realWorldContext.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDiff = selectedDifficulty === "All" || c.difficulty === selectedDifficulty;
      
      const isSolved = completedSlugs.includes(c.slug);
      const matchesStatus =
        selectedStatus === "All" ||
        (selectedStatus === "Solved" && isSolved) ||
        (selectedStatus === "Todo" && !isSolved);

      const matchesCat = selectedCategory === "All" || c.category === selectedCategory;

      return matchesSearch && matchesDiff && matchesStatus && matchesCat;
    });
  }, [searchQuery, selectedDifficulty, selectedStatus, selectedCategory, completedSlugs]);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(REAL_WORLD_DSA_CHALLENGES.map(c => c.category)));
    return ["All", ...cats];
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      
      {/* ── 1. Top LeetCode Banner Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300">
              BEC Real-World Lab
            </span>
            <span className="text-xs text-muted font-mono">Industry Engineering Scenarios</span>
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Real-World DSA Problem Set
          </h1>
          <p className="text-sm text-muted max-w-2xl leading-relaxed">
            Practice Data Structures &amp; Algorithms by solving real engineering systems used at Swiggy, Google Maps, 1mg, Razorpay, and Amazon.
          </p>
        </div>

        {/* ── LeetCode Progress Ring Card ── */}
        <div className="shrink-0 bg-surface border border-border rounded-2xl p-5 flex items-center gap-6 shadow-xs">
          {/* Progress Circle Stats */}
          <div className="text-center">
            <div className="text-3xl font-bold text-foreground font-mono">
              {completedCount} <span className="text-sm text-muted font-normal">/ {totalCount}</span>
            </div>
            <div className="text-[11px] font-mono text-emerald-600 font-bold uppercase tracking-wider mt-1">
              Solved ({totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}%)
            </div>
          </div>

          <div className="h-10 w-px bg-border" />

          {/* Easy / Medium / Hard Progress breakdown */}
          <div className="space-y-1.5 font-mono text-xs min-w-[140px]">
            <div className="flex justify-between items-center">
              <span className="text-[#00b8a3] font-bold">Easy</span>
              <span className="text-foreground">{easySolved} / {easyCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#ffc01e] font-bold">Medium</span>
              <span className="text-foreground">{mediumSolved} / {mediumCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#ff375f] font-bold">Hard</span>
              <span className="text-foreground">{hardSolved} / {hardCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Search & Filter Bar ── */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-surface p-4 rounded-2xl border border-border">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search problem title, concept, or company (e.g. Swiggy, Heap, BFS)..."
            className="w-full bg-white border border-border pl-10 pr-4 py-2 rounded-xl text-xs text-foreground placeholder:text-muted focus:outline-none focus:border-foreground/60 font-sans"
          />
        </div>

        {/* Filters Group */}
        <div className="flex items-center gap-2 overflow-x-auto font-mono text-xs shrink-0">
          
          {/* Difficulty Dropdown */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="bg-white border border-border text-foreground px-3 py-2 rounded-xl text-xs font-semibold focus:outline-none"
          >
            <option value="All">Difficulty: All</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          {/* Status Dropdown */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-white border border-border text-foreground px-3 py-2 rounded-xl text-xs font-semibold focus:outline-none"
          >
            <option value="All">Status: All</option>
            <option value="Solved">Solved</option>
            <option value="Todo">Todo</option>
          </select>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white border border-border text-foreground px-3 py-2 rounded-xl text-xs font-semibold focus:outline-none"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "All" ? "Category: All" : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── 3. LeetCode Problem Set Table ── */}
      <div className="rounded-2xl border border-border bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface/80 border-b border-border text-[11px] font-mono font-bold text-muted uppercase tracking-wider">
                <th className="py-3.5 px-4 w-12 text-center">Status</th>
                <th className="py-3.5 px-4">Title &amp; Scenario</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">DSA Concept</th>
                <th className="py-3.5 px-4">Difficulty</th>
                <th className="py-3.5 px-4 text-center">XP</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border text-xs">
              {filteredChallenges.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-muted font-mono">
                    No matching problems found. Try clearing your search query or filters.
                  </td>
                </tr>
              ) : (
                filteredChallenges.map((challenge, idx) => {
                  const isSolved = completedSlugs.includes(challenge.slug);

                  return (
                    <tr
                      key={challenge.id}
                      className="hover:bg-surface/60 transition-colors group"
                    >
                      {/* Solved Status Checkmark */}
                      <td className="py-4 px-4 text-center">
                        {isSolved ? (
                          <CheckCircle2 size={16} className="text-[#00b8a3] mx-auto fill-[#00b8a3]/10" />
                        ) : (
                          <span className="inline-block w-4 h-4 rounded-full border border-border mx-auto" />
                        )}
                      </td>

                      {/* Problem Title & Short Description */}
                      <td className="py-4 px-4">
                        <Link
                          href={`/real-world-dsa/${challenge.slug}`}
                          className="font-bold text-foreground hover:text-[#00b8a3] transition-colors text-sm font-heading flex items-center gap-2"
                        >
                          <span>{idx + 1}. {challenge.title}</span>
                        </Link>
                        <p className="text-xs text-muted mt-0.5 line-clamp-1">
                          {challenge.shortDescription}
                        </p>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-4 font-mono text-[#8a8a8a]">
                        <span className="px-2 py-1 rounded-md bg-surface border border-border">
                          {challenge.category}
                        </span>
                      </td>

                      {/* DSA Concept */}
                      <td className="py-4 px-4 font-mono font-semibold text-foreground">
                        {challenge.dsaConcept}
                      </td>

                      {/* Difficulty Badge */}
                      <td className="py-4 px-4 font-mono font-bold">
                        <span
                          className={`px-2.5 py-0.5 rounded text-[11px] ${
                            challenge.difficulty === "Easy"
                              ? "bg-[#00b8a3]/10 text-[#00b8a3]"
                              : challenge.difficulty === "Medium"
                              ? "bg-[#ffc01e]/10 text-[#ffc01e]"
                              : "bg-[#ff375f]/10 text-[#ff375f]"
                          }`}
                        >
                          {challenge.difficulty}
                        </span>
                      </td>

                      {/* XP Reward */}
                      <td className="py-4 px-4 text-center font-mono font-bold text-amber-600">
                        +100
                      </td>

                      {/* Action Button */}
                      <td className="py-4 px-4 text-right">
                        <Link href={`/real-world-dsa/${challenge.slug}`}>
                          <button
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all inline-flex items-center gap-1 ${
                              isSolved
                                ? "bg-surface hover:bg-border text-foreground border border-border"
                                : "bg-foreground text-white hover:bg-foreground/85 shadow-xs"
                            }`}
                          >
                            <span>{isSolved ? "Review" : "Solve"}</span>
                            <ArrowRight size={12} />
                          </button>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
