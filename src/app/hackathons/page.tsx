import { HackathonHub } from "@/components/community/hackathon-hub";

export const metadata = {
  title: "Hackathon Hub & Team Finder | BEROJGAR ENGINEER CLUB",
  description: "Discover national hackathons, find teammates with complementary tech stacks, and register for upcoming competitions.",
};

export default function HackathonsPage() {
  return (
    <div className="py-6 space-y-8">
      <HackathonHub />
    </div>
  );
}
