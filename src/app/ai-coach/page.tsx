import { AICoachDrawer } from "@/components/community/ai-coach-drawer";

export const metadata = {
  title: "AI Career Coach | BEROJGAR ENGINEER CLUB",
  description: "Your personalized AI career mentor for resume roast, score improvement, and company interview readiness.",
};

export default function AICoachPage() {
  return (
    <div className="py-6 space-y-8">
      <AICoachDrawer />
    </div>
  );
}
