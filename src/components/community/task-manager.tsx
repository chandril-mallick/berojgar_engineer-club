"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import {
  getUserTasks,
  createUserTask,
  toggleUserTask,
  deleteUserTask,
  UserTask,
} from "@/services/task-service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { UserXP } from "@/types";
import { DEFAULT_USER_XP, awardXP } from "@/lib/xp";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Filter,
  Zap,
  Lock,
  Sparkles,
  ListTodo,
  Brain,
  Code2,
  FileText,
  Briefcase,
  Users,
} from "lucide-react";

const CATEGORY_ICONS: Record<string, any> = {
  dsa: Brain,
  project: Code2,
  interview: Users,
  aptitude: Zap,
  resume: FileText,
  general: Briefcase,
};

const CATEGORY_LABELS: Record<string, string> = {
  dsa: "DSA & LeetCode",
  project: "Web / App Dev",
  interview: "Interview Prep",
  aptitude: "Aptitude & Quant",
  resume: "Resume & Portfolio",
  general: "General Work",
};

export function TaskManager() {
  const { user, requireAuth } = useAuth();
  const [userXP, setUserXP] = useLocalStorage<UserXP>("bec-user-xp", DEFAULT_USER_XP);

  const [tasks, setTasks] = useState<UserTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "completed">("all");

  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<UserTask["category"]>("dsa");
  const [priority, setPriority] = useState<UserTask["priority"]>("medium");
  const [xpReward, setXpReward] = useState<number>(50);

  // Initial Sample Tasks for New / Unauthenticated Users
  const DEFAULT_SAMPLE_TASKS: UserTask[] = [
    {
      id: "sample-1",
      title: "Solve 3 LeetCode Medium Problems (Array & Two Pointers)",
      category: "dsa",
      priority: "high",
      completed: false,
      xpReward: 100,
    },
    {
      id: "sample-2",
      title: "Build & Deploy Next.js Portfolio Project to Vercel",
      category: "project",
      priority: "high",
      completed: true,
      xpReward: 150,
    },
    {
      id: "sample-3",
      title: "Revamp Resume with STAR Method Metrics (ATS Score > 80)",
      category: "resume",
      priority: "medium",
      completed: false,
      xpReward: 75,
    },
  ];

  // Load tasks on mount or user change
  useEffect(() => {
    async function loadTasks() {
      setLoading(true);
      if (user) {
        const fetched = await getUserTasks(user.uid);
        if (fetched.length === 0) {
          // Initialize default sample tasks into Firestore for user
          for (const st of DEFAULT_SAMPLE_TASKS) {
            const { id, ...cleanTask } = st;
            await createUserTask(user.uid, cleanTask);
          }
          const updated = await getUserTasks(user.uid);
          setTasks(updated);
        } else {
          setTasks(fetched);
        }
      } else {
        setTasks(DEFAULT_SAMPLE_TASKS);
      }
      setLoading(false);
    }
    loadTasks();
  }, [user]);

  // Add Task handler guarded by Auth
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    requireAuth(async () => {
      if (!user) return;
      const newTask = await createUserTask(user.uid, {
        title: title.trim(),
        category,
        priority,
        completed: false,
        xpReward,
      });
      setTasks((prev) => [newTask, ...prev]);
      setTitle("");
    }, "Authentication Required: You cannot add or save tasks without logging in.");
  };

  // Toggle Task completion guarded by Auth
  const handleToggleTask = (task: UserTask) => {
    requireAuth(async () => {
      if (!user || !task.id) return;
      const nextCompleted = !task.completed;
      await toggleUserTask(user.uid, task.id, nextCompleted);

      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, completed: nextCompleted } : t))
      );

      // Award XP when completed
      if (nextCompleted) {
        const updatedXP = awardXP("challenge_complete", userXP);
        setUserXP({ ...updatedXP, total: updatedXP.total + (task.xpReward || 50) });
      }
    }, "Authentication Required: You cannot complete or check off tasks without logging in.");
  };

  // Delete Task handler
  const handleDeleteTask = (taskId: string) => {
    requireAuth(async () => {
      if (!user) return;
      await deleteUserTask(user.uid, taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    }, "Authentication Required: You cannot delete tasks without logging in.");
  };

  const filteredTasks = tasks.filter((t) => {
    if (filterCategory !== "all" && t.category !== filterCategory) return false;
    if (filterStatus === "pending" && t.completed) return false;
    if (filterStatus === "completed" && !t.completed) return false;
    return true;
  });

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalXP = tasks.filter((t) => t.completed).reduce((sum, t) => sum + (t.xpReward || 50), 0);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ListTodo size={16} className="text-brand" />
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">Work & Task Center</p>
          </div>
          <h2 className="font-heading text-2xl font-bold text-foreground">Engineering Task Manager</h2>
          <p className="text-xs text-muted mt-1">
            Track daily engineering work, set priorities, and earn XP. Backed by Firebase Cloud Database.
          </p>
        </div>

        {/* Status Pill */}
        <div className="flex items-center gap-3">
          {!user ? (
            <div className="flex items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-3.5 py-1.5 text-xs font-bold text-amber-900 shadow-2xs">
              <Lock size={14} className="text-amber-600 shrink-0" />
              <span>Login Required to Enter Tasks</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-emerald-900 shadow-2xs">
              <Sparkles size={14} className="text-emerald-600 shrink-0" />
              <span>Synced with Firebase</span>
            </div>
          )}
        </div>
      </div>

      {/* Task Entry Form */}
      <Card className="p-5 border-border bg-white shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Plus size={16} className="text-brand" />
            Add New Work / Task Entry
          </h3>
          <span className="text-[11px] font-semibold text-muted">
            {!user ? "🔒 Login Required" : "Firebase Real-time Sync"}
          </span>
        </div>

        <form onSubmit={handleAddTask} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="What work do you need to complete today? (e.g. Solve 2 Dynamic Programming problems)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 rounded-xl border border-border bg-surface px-3.5 py-2.5 text-xs text-foreground outline-none focus:border-foreground transition-colors"
            />

            <Button
              type="submit"
              variant="dark"
              size="md"
              className="gap-2 shrink-0 text-xs font-bold h-[38px]"
            >
              {!user ? <Lock size={14} /> : <Plus size={14} />}
              <span>Add Task</span>
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full mt-1 rounded-lg border border-border bg-white px-2.5 py-1.5 text-xs font-medium text-foreground outline-none"
              >
                <option value="dsa">🧠 DSA & LeetCode</option>
                <option value="project">🛠️ Web / App Dev</option>
                <option value="interview">🎤 Interview Prep</option>
                <option value="aptitude">⚡ Aptitude & Quant</option>
                <option value="resume">📄 Resume & Portfolio</option>
                <option value="general">💼 General Work</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full mt-1 rounded-lg border border-border bg-white px-2.5 py-1.5 text-xs font-medium text-foreground outline-none"
              >
                <option value="high">🔴 High Priority</option>
                <option value="medium">🟡 Medium Priority</option>
                <option value="low">🟢 Low Priority</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted">XP Reward</label>
              <select
                value={xpReward}
                onChange={(e) => setXpReward(Number(e.target.value))}
                className="w-full mt-1 rounded-lg border border-border bg-white px-2.5 py-1.5 text-xs font-medium text-foreground outline-none"
              >
                <option value={50}>+50 XP</option>
                <option value={100}>+100 XP</option>
                <option value={150}>+150 XP</option>
                <option value={200}>+200 XP</option>
              </select>
            </div>

            <div className="flex items-end">
              <div className="w-full text-center text-xs font-semibold text-muted bg-surface py-1.5 rounded-lg border border-border">
                Earns <span className="font-bold text-amber-600">+{xpReward} XP</span>
              </div>
            </div>
          </div>
        </form>
      </Card>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-border bg-white p-3.5 text-center">
          <p className="text-[11px] font-bold uppercase text-muted">Total Tasks</p>
          <p className="text-xl font-bold font-mono text-foreground mt-0.5">{tasks.length}</p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3.5 text-center">
          <p className="text-[11px] font-bold uppercase text-emerald-800">Completed</p>
          <p className="text-xl font-bold font-mono text-emerald-700 mt-0.5">{completedCount}</p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3.5 text-center">
          <p className="text-[11px] font-bold uppercase text-amber-800">XP Earned</p>
          <p className="text-xl font-bold font-mono text-amber-700 mt-0.5">+{totalXP} XP</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {["all", "dsa", "project", "interview", "aptitude", "resume"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors shrink-0 ${
                filterCategory === cat
                  ? "bg-foreground text-white"
                  : "bg-surface text-muted hover:text-foreground border border-border"
              }`}
            >
              {cat === "all" ? "All Categories" : CATEGORY_LABELS[cat] || cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 text-xs shrink-0">
          <Filter size={13} className="text-muted mr-1" />
          {(["all", "pending", "completed"] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-2.5 py-1 rounded-md font-medium capitalize transition-colors ${
                filterStatus === st ? "bg-muted-bg text-foreground font-bold" : "text-muted hover:text-foreground"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      {loading ? (
        <div className="py-12 text-center text-xs text-muted">Loading your tasks from Firebase...</div>
      ) : filteredTasks.length === 0 ? (
        <div className="py-12 text-center space-y-2 border border-dashed border-border rounded-xl">
          <ListTodo size={28} className="mx-auto text-muted" />
          <p className="text-xs font-bold text-foreground">No tasks found matching your filters.</p>
          <p className="text-[11px] text-muted">Add a new task above to get started.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          <AnimatePresence>
            {filteredTasks.map((task, idx) => {
              const IconComp = CATEGORY_ICONS[task.category] || Briefcase;
              return (
                <motion.div
                  key={task.id ? `task-${task.id}-${idx}` : `task-${idx}`}
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className={`flex items-center justify-between gap-3 rounded-xl border p-4 transition-all ${
                    task.completed
                      ? "border-emerald-200 bg-emerald-50/20 text-muted"
                      : "border-border bg-white text-foreground hover:border-foreground/20"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={() => handleToggleTask(task)}
                      className="shrink-0 text-foreground hover:scale-105 transition-transform"
                      title={task.completed ? "Mark pending" : "Mark completed"}
                    >
                      {task.completed ? (
                        <CheckCircle2 size={20} className="text-emerald-600 fill-emerald-100" />
                      ) : (
                        <Circle size={20} className="text-muted hover:text-foreground" />
                      )}
                    </button>

                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-xs font-semibold ${
                            task.completed ? "line-through text-muted" : "text-foreground"
                          }`}
                        >
                          {task.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[10px] text-muted">
                        <span className="flex items-center gap-1 font-medium">
                          <IconComp size={11} className="text-brand" />
                          {CATEGORY_LABELS[task.category] || task.category}
                        </span>
                        <span>•</span>
                        <span
                          className={`font-semibold capitalize ${
                            task.priority === "high"
                              ? "text-rose-600"
                              : task.priority === "medium"
                              ? "text-amber-600"
                              : "text-slate-600"
                          }`}
                        >
                          {task.priority} Priority
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={task.completed ? "muted" : "warning"} className="text-[10px]">
                      +{task.xpReward} XP
                    </Badge>

                    <button
                      onClick={() => handleDeleteTask(task.id!)}
                      className="p-1.5 text-muted hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Task"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
