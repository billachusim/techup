import { useState } from "react";
import { UserPlus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ApplyDialog from "@/components/jobs/ApplyDialog";
import { jobPlatforms, JobPlatform } from "@/data/jobPlatforms";

type Props = {
  /** Called with the platform's source_platform name to filter the board below */
  onViewRoles: (platformName: string) => void;
  /** Live role count per platform, used to hide the filter link when empty */
  counts: Record<string, number>;
};

const PlatformPartners = ({ onViewRoles, counts }: Props) => {
  const [active, setActive] = useState<JobPlatform | null>(null);

  return (
    <section className="mb-12" aria-labelledby="platform-partners-heading">
      <div className="mb-6">
        <h2 id="platform-partners-heading" className="text-xl md:text-2xl font-bold">
          Our AI work platform partners
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Create your free account on any of these platforms to start applying for remote AI and tech work.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobPlatforms.map((platform) => {
          const liveCount = platform.match.reduce((sum, m) => sum + (counts[m] ?? 0), 0);
          return (
            <div
              key={platform.name}
              className="border border-border rounded-lg p-6 bg-card space-y-4 shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="space-y-1">
                <h3 className="font-semibold text-lg">{platform.name}</h3>
                <p className="text-sm text-muted-foreground">{platform.blurb}</p>
              </div>
              <div className="mt-auto space-y-3">
                <Button className="w-full" size="sm" onClick={() => setActive(platform)}>
                  <UserPlus size={14} className="mr-2" />
                  Get Started with {platform.name}
                </Button>
                {liveCount > 0 && (
                  <button
                    type="button"
                    onClick={() => onViewRoles(platform.match.find((m) => counts[m]) ?? platform.name)}
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    View {liveCount} live {platform.name} {liveCount === 1 ? "role" : "roles"}
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {active && (
        <ApplyDialog
          open={!!active}
          onOpenChange={(open) => !open && setActive(null)}
          platform={active}
          jobUrl={active.signupUrl}
        />
      )}
    </section>
  );
};

export default PlatformPartners;
