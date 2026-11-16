import type { ReactNode } from "react";
import { useDeviceLocation } from "@/hooks/use-device-location";

/**
 * A short line naming the visitor's state, e.g. "SIWES placements for students in
 * Enugu". Shows only after the visitor has shared their location with "Find my
 * nearest centre"; otherwise the page stays national.
 */
const VisitorStateLine = ({
  children,
  className = "",
}: {
  children: (state: string) => ReactNode;
  className?: string;
}) => {
  const loc = useDeviceLocation();
  if (!loc) return null;
  return (
    <p
      className={`text-sm font-medium text-muted-foreground md:text-base ${className}`}
    >
      {children(loc.state)}
    </p>
  );
};

export default VisitorStateLine;
