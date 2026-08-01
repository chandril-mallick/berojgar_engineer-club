"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-md py-20 text-center">
      <p className="font-mono text-xs font-semibold uppercase tracking-widest text-danger">
        Error
      </p>
      <h2 className="mt-3 font-heading text-xl font-bold text-foreground">
        Oops, recruiter went offline.
      </h2>
      <p className="mt-2 text-sm text-muted">{error.message}</p>
      <Button onClick={reset} variant="ghost" size="md" className="mt-6">
        Try Again
      </Button>
    </div>
  );
}
