import { AmbassadorPortal } from "@/components/community/ambassador-portal";

export const metadata = {
  title: "Campus Ambassador Program | BEROJGAR ENGINEER CLUB",
  description: "Become an official Campus Ambassador for your college engineering community. Earn XP, certificates, and cash rewards.",
};

export default function AmbassadorPage() {
  return (
    <div className="py-6 space-y-8 max-w-4xl mx-auto">
      <AmbassadorPortal />
    </div>
  );
}
