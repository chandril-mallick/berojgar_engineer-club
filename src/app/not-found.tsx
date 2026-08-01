import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md py-20 text-center">
      <p className="font-mono text-6xl font-bold text-foreground">404</p>
      <h1 className="mt-4 font-heading text-xl font-bold text-foreground">
        This page is still unemployed.
      </h1>
      <p className="mt-2 text-sm text-muted">
        Let&apos;s send you back to the main career mission.
      </p>
      <Link href="/" className="inline-block mt-6">
        <Button variant="dark" size="md">
          Go Home
        </Button>
      </Link>
    </div>
  );
}
