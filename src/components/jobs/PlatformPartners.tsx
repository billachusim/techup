import { UserPlus, ArrowRight } from "lucide-react";
import { Link } from "@/lib/router-compat";
import { Button } from "@/components/ui/button";
import { jobPlatforms } from "@/data/jobPlatforms";

const PlatformPartners = () => (
  <section aria-labelledby="external-platforms-heading">
    <div className="mb-6">
      <h2 id="external-platforms-heading" className="text-xl md:text-2xl font-bold">
        External work platforms
      </h2>
      <p className="text-sm text-muted-foreground mt-1">
        Independent platforms where you can find additional AI and remote work. These are not Tech Faculty roles.
      </p>
    </div>

    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobPlatforms.map((platform) => (
          <div
            key={platform.name}
            className="border border-border rounded-lg p-5 bg-card space-y-4 flex flex-col"
          >
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">{platform.name}</h3>
              <p className="text-sm text-muted-foreground">{platform.blurb}</p>
            </div>
            <div className="mt-auto space-y-3">
              <a href={platform.signupUrl} target="_blank" rel="noopener noreferrer nofollow" className="block">
                <Button className="w-full" variant="outline" size="sm" aria-label={`Get started with ${platform.name}`}>
                  <UserPlus size={14} className="mr-2" />
                  Get Started with {platform.name}
                </Button>
              </a>
              <Link
                to={`/careers/platforms/${platform.slug}`}
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                  View {platform.name} jobs
                  <ArrowRight size={14} />
              </Link>
            </div>
          </div>
      ))}
    </div>
  </section>
);

export default PlatformPartners;
