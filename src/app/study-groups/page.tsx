import { StudyGroups } from "@/components/community/study-groups";

export const metadata = {
  title: "Study Groups & Live Voice Rooms | BEROJGAR ENGINEER CLUB",
  description: "Join GATE CSE, DSA Grind, Google Interview, and System Design peer study groups with live simulated voice channels.",
};

export default function StudyGroupsPage() {
  return (
    <div className="py-6 space-y-8">
      <StudyGroups />
    </div>
  );
}
