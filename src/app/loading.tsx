import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="relative min-h-[60vh] flex flex-col items-center justify-center px-4 py-12">
      {/* Centered Branded Logo Loader */}
      <div className="flex flex-col items-center text-center space-y-4 mb-8 z-10">
        <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-border bg-white p-0.5 shadow-md animate-pulse">
          {/* eslint-disable-next-next/no-img-element */}
          <img
            src="/berojgar-logo.png"
            alt="Berojgar Engineer Logo"
            className="w-full h-full object-contain"
          />
        </div>
        <p className="text-xs font-semibold text-muted tracking-wide animate-pulse">
          Loading Berojgar Engineer...
        </p>
      </div>

      {/* Page Content Skeleton Wireframe */}
      <div className="w-full max-w-4xl space-y-6">
        <div className="flex flex-col items-center space-y-3 text-center">
          <Skeleton className="h-8 w-64 rounded-xl" />
          <Skeleton className="h-4 w-96 max-w-full rounded-lg" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <Skeleton className="h-44 w-full rounded-2xl" />
          <Skeleton className="h-44 w-full rounded-2xl" />
          <Skeleton className="h-44 w-full rounded-2xl" />
        </div>

        <div className="space-y-3 pt-2">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-4/5 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
