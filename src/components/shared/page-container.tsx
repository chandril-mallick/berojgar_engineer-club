import React from "react";
import { cn } from "@/lib/utils";

type ContainerSize = "narrow" | "default" | "wide" | "full";

const SIZE_MAP: Record<ContainerSize, string> = {
  narrow: "max-w-3xl",
  default: "max-w-6xl",
  wide: "max-w-7xl",
  full: "max-w-full",
};

interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  size?: ContainerSize;
  className?: string;
}

export function PageContainer({
  children,
  size = "default",
  className,
  ...props
}: PageContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full py-12 space-y-12",
        SIZE_MAP[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
