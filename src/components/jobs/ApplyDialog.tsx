import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ApplySteps from "@/components/jobs/ApplySteps";
import { JobPlatform } from "@/data/jobPlatforms";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  platform: JobPlatform;
  jobTitle?: string;
  jobUrl: string;
};

const ApplyDialog = ({ open, onOpenChange, platform, jobTitle, jobUrl }: Props) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{jobTitle ? `Apply: ${jobTitle}` : `Get started with ${platform.name}`}</DialogTitle>
        <DialogDescription>Two quick steps and you're in.</DialogDescription>
      </DialogHeader>
      <div className="py-2">
        <ApplySteps platform={platform} jobUrl={jobUrl} jobTitle={jobTitle ?? platform.name} />
      </div>
    </DialogContent>
  </Dialog>
);

export default ApplyDialog;
