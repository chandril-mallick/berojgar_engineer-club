import { OfferWall } from "@/components/community/offer-wall";

export const metadata = {
  title: "Offer Letter Wall | BEROJGAR ENGINEER CLUB",
  description: "Celebrate student achievements, placement offers, CTC packages, and preparation journeys.",
};

export default function OfferWallPage() {
  return (
    <div className="py-6 space-y-8">
      <OfferWall />
    </div>
  );
}
