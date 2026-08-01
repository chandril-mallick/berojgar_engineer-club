"use client";

import { useState } from "react";
import { PROJECTS_DATA, OPEN_SOURCE_REPOS } from "@/lib/community-data";
import { ProjectShowcaseItem, OpenSourceRepo } from "@/types/community";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { ExternalLink, Heart, GitFork, MessageSquare, Plus, Code2, Star, Sparkles } from "lucide-react";

const GithubIcon = ({ size = 15, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.24c3-.3 6-1.5 6-6.76 0-1.5-.5-2.8-1.5-3.78.15-.38.15-1.8-.15-3.72 0 0-1.2-.38-3.9 1.44a13.3 13.3 0 0 0-7 0C4.7 3.96 3.5 4.34 3.5 4.34c-.3 1.92-.3 3.34-.15 3.72A5.9 5.9 0 0 0 2 12c0 5.26 3 6.46 6 6.76-.8.7-1 2-1 3.24v4"></path>
    <path d="M4 19c-2 1-3 0-3 0"></path>
  </svg>
);


import { useAuth } from "@/hooks/use-auth";

export function ProjectShowcase() {
  const { user, requireAuth } = useAuth();
  const [activeTab, setActiveTab] = useState<"projects" | "opensource">("projects");
  const [projects, setProjects] = useState<ProjectShowcaseItem[]>(PROJECTS_DATA);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  const handleSubmitProject = () => {
    requireAuth(() => {
      alert("Project submission dialog: Enter project title, GitHub repo, live URL, and tech stack.");
    }, "Authentication Required: You must be logged in to submit your project to the showcase.");
  };

  const toggleLike = (id: string) => {
    setLikedMap((prev) => ({ ...prev, [id]: !prev[id] }));
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, likes: p.likes + (likedMap[id] ? -1 : 1) } : p
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Code2 size={16} className="text-brand" />
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">Portfolio & Open Source</p>
          </div>
          <h2 className="font-heading text-2xl font-bold text-foreground">Showcase Projects & Contribute</h2>
          <p className="text-xs text-muted mt-1">
            Discover student projects, fork ideas, request collaborators, and earn open-source contribution badges.
          </p>
        </div>

        <Button variant="dark" size="sm" onClick={handleSubmitProject} className="gap-2">
          <Plus size={13} /> Submit Your Project
        </Button>
      </div>

      {/* Main Tabs */}
      <div className="flex items-center gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab("projects")}
          className={`px-4 py-2.5 text-xs font-bold transition-colors border-b-2 ${
            activeTab === "projects"
              ? "border-foreground text-foreground"
              : "border-transparent text-muted hover:text-foreground"
          }`}
        >
          Student Projects
        </button>
        <button
          onClick={() => setActiveTab("opensource")}
          className={`px-4 py-2.5 text-xs font-bold transition-colors border-b-2 ${
            activeTab === "opensource"
              ? "border-foreground text-foreground"
              : "border-transparent text-muted hover:text-foreground"
          }`}
        >
          Beginner Open Source Repos
        </button>
      </div>

      {activeTab === "projects" ? (
        <div className="grid gap-6 sm:grid-cols-2">
          {projects.map((proj) => (
            <motion.div
              key={proj.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col justify-between rounded-[16px] border border-border bg-white p-5 shadow-xs space-y-4"
            >
              <div className="space-y-3">
                <img src={proj.imageUrl} alt={proj.title} className="rounded-[12px] h-40 w-full object-cover border border-border" />

                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading text-base font-bold text-foreground">{proj.title}</h3>
                    <span className="text-[10px] text-muted">{proj.timeAgo}</span>
                  </div>
                  <p className="text-xs font-semibold text-muted mt-0.5">{proj.tagline}</p>
                </div>

                <p className="text-xs text-muted leading-relaxed">{proj.description}</p>

                <div className="flex flex-wrap gap-1">
                  {proj.techStack.map((tech) => (
                    <Badge key={tech} variant="muted">{tech}</Badge>
                  ))}
                </div>
              </div>

              {/* Footer Links & Stats */}
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleLike(proj.id)}
                    className={`flex items-center gap-1 font-mono text-xs font-bold ${
                      likedMap[proj.id] ? "text-rose-500" : "text-muted hover:text-foreground"
                    }`}
                  >
                    <Heart size={14} className={likedMap[proj.id] ? "fill-rose-500" : ""} />
                    <span>{proj.likes}</span>
                  </button>

                  <span className="flex items-center gap-1 font-mono text-xs text-muted">
                    <GitFork size={14} /> {proj.forks}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="sm" className="p-2 text-muted">
                      <GithubIcon size={15} />
                    </Button>
                  </a>
                  <a href={proj.demoUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="dark" size="sm" className="gap-1 text-xs">
                      Live Demo <ExternalLink size={12} />
                    </Button>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {OPEN_SOURCE_REPOS.map((repo) => (
            <motion.div
              key={repo.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-[12px] border border-border bg-white p-4 shadow-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-sm font-bold text-foreground">{repo.owner} / {repo.name}</span>
                  <Badge variant="muted">{repo.language}</Badge>
                  <Badge variant="success">{repo.goodFirstIssues} Good First Issues</Badge>
                </div>
                <p className="text-xs text-muted">{repo.description}</p>
                <p className="text-[10px] text-amber-600 font-semibold">Reward: Badge &ldquo;{repo.badgeReward}&rdquo; on PR merge</p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="flex items-center gap-1 font-mono text-xs font-bold text-foreground">
                  <Star size={14} className="fill-amber-400 text-amber-400" /> {repo.stars}
                </span>
                <a href={repo.repoUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="dark" size="sm" className="gap-1.5 text-xs">
                    <GithubIcon size={13} /> Contribute
                  </Button>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
