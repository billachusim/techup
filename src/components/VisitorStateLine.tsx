import type { ReactNode } from "react";
import { useVisitorLocation } from "@/hooks/use-visitor-location";

/**
 * A short line naming the visitor's Nigerian state (from Cloudflare's IP lookup),
 * e.g. "SIWES placements for students in Enugu". Renders an empty reserved line
 * until the state is known, and nothing extra for visitors outside Nigeria.
 */
const VisitorStateLine = ({
  children,
  className = "",
}: {
  children: (state: string) => ReactNode;
  className?: string;
}) => {
  const { state } = useVisitorLocation();
  return (
    <p
      className={`min-h-[1.5em] text-sm font-medium text-muted-foreground md:text-base ${className}`}
    >
      {state ? children(state) : ""}
    </p>
  );
};

export default VisitorStateLine;
