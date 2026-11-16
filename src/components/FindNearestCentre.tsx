import { useState } from "react";
import { LocateFixed, MapPin } from "lucide-react";
import { Link } from "@/lib/router-compat";
import { Button } from "@/components/ui/button";
import { campuses } from "@/data/campuses";
import { locateVisitor, useDeviceLocation } from "@/hooks/use-device-location";

const MESSAGES = {
  unsupported: "Your browser can't share location. Browse all centres below.",
  denied:
    "Location is blocked for this site. Allow it in your browser settings, or browse all centres below.",
  outside:
    "You seem to be outside Nigeria. You can still study online from anywhere.",
  failed: "We couldn't get your location just now. Please try again.",
} as const;

/** "Find my nearest centre": asks for location only when tapped, then shows the nearest campus. */
const FindNearestCentre = ({ className = "" }: { className?: string }) => {
  const saved = useDeviceLocation();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const centre = saved
    ? campuses.find((c) => c.slug === saved.centreSlug)
    : undefined;

  const find = async () => {
    setBusy(true);
    setError(null);
    const res = await locateVisitor();
    setBusy(false);
    if (!res.ok) setError(MESSAGES[res.reason]);
  };

  return (
    <div className={`rounded-lg border border-border bg-card p-4 ${className}`}>
      {saved && centre ? (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-2 text-sm">
            <MapPin size={18} className="mt-0.5 shrink-0 text-link" />
            <span>
              You're in {saved.city ? `${saved.city}, ` : ""}
              {saved.state}. Nearest centre:{" "}
              <Link
                to={`/locations/${centre.slug}`}
                className="font-medium text-link hover:underline"
              >
                {centre.name}
              </Link>{" "}
              (about {saved.centreKm} km)
            </span>
          </div>
          <Button size="sm" variant="ghost" onClick={find} disabled={busy}>
            {busy ? "Updating…" : "Update"}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            See the Tech Faculty centre closest to you.
          </p>
          <Button size="sm" onClick={find} disabled={busy}>
            <LocateFixed size={16} className="mr-2" />
            {busy ? "Finding…" : "Find my nearest centre"}
          </Button>
        </div>
      )}
      {error && <p className="mt-2 text-sm text-muted-foreground">{error}</p>}
    </div>
  );
};

export default FindNearestCentre;
