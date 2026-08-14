import { ExternalLink, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JobPlatform } from "@/data/jobPlatforms";

type Props = {
  platform: JobPlatform;
  jobUrl: string;
  jobTitle: string;
};

/** Two-step apply flow: create an account on the platform, then open the listing. */
const ApplySteps = ({ platform, jobUrl, jobTitle }: Props) => (
  <ol className="space-y-4">
    <li className="flex gap-3">
      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
        1
      </span>
      <div className="flex-1 space-y-2">
        <p className="text-sm font-medium">Create your free {platform.name} account</p>
        <p className="text-xs text-muted-foreground">
          {platform.name} handles the hiring, so you need an account there to apply. Already have one? Move to step 2.
        </p>
        <a href={platform.signupUrl} target="_blank" rel="noopener noreferrer nofollow" className="block">
          <Button className="w-full sm:w-auto" aria-label={`Get started with ${platform.name}`}>
            <UserPlus size={14} className="mr-2" />
            Get Started with {platform.name}
          </Button>
        </a>
      </div>
    </li>
    <li className="flex gap-3">
      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
        2
      </span>
      <div className="flex-1 space-y-2">
        <p className="text-sm font-medium">Open the job listing and apply</p>
        <p className="text-xs text-muted-foreground">
          Opens in a new tab so you can come back here anytime.
        </p>
        <a href={jobUrl} target="_blank" rel="noopener noreferrer nofollow" className="block">
          <Button variant="outline" className="w-full sm:w-auto" aria-label={`Open the ${jobTitle} listing on ${platform.name}`}>
            Open job listing
            <ExternalLink size={14} className="ml-2" />
          </Button>
        </a>
      </div>
    </li>
  </ol>
);

export default ApplySteps;
