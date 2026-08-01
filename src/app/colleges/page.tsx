import { CollegeRankings } from "@/components/community/college-rankings";

export const metadata = {
  title: "College Rankings | BEROJGAR ENGINEER CLUB",
  description: "Live ranking system for engineering colleges across India based on average Berojgar score, placement rates, and average packages.",
};

export default function CollegesPage() {
  return (
    <div className="py-6 space-y-8">
      <CollegeRankings />
    </div>
  );
}
