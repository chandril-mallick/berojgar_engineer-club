import { TaskManager } from "@/components/community/task-manager";

export const metadata = {
  title: "Engineering Task & Work Manager | BEROJGAR ENGINEER CLUB",
  description: "Track your engineering tasks, DSA grind, web projects, and interview prep with Firebase sync.",
};

export default function TasksPage() {
  return (
    <div className="py-6 space-y-8 max-w-4xl mx-auto">
      <TaskManager />
    </div>
  );
}
