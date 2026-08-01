import { ProjectShowcase } from "@/components/community/project-showcase";

export const metadata = {
  title: "Project Showcase & Open Source | BEROJGAR ENGINEER CLUB",
  description: "Student portfolio project gallery, live demos, fork ideas, and beginner open source repository contribution.",
};

export default function ProjectsPage() {
  return (
    <div className="py-6 space-y-8">
      <ProjectShowcase />
    </div>
  );
}
