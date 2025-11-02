import { Briefcase, MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Companies = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [facultyId, setFacultyId] = useState("");
  const [selectedJob, setSelectedJob] = useState<string>("");

  const handleApply = (company: string) => {
    setSelectedJob(company);
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (facultyId.trim()) {
      // Here you would handle the application submission
      window.open("https://calendly.com/techfacultyafrica/clarity-call", "_blank");
      setIsDialogOpen(false);
      setFacultyId("");
    }
  };

  const jobs = [
    {
      company: "Flutterwave",
      role: "Junior Software Engineer",
      location: "Lagos, Nigeria",
      type: "Full-time Internship",
      logo: "🦋"
    },
    {
      company: "Paystack",
      role: "Frontend Developer",
      location: "Lagos, Nigeria",
      type: "Full-time",
      logo: "💳"
    },
    {
      company: "Andela",
      role: "Software Developer",
      location: "Remote (Africa)",
      type: "Full-time",
      logo: "🚀"
    },
    {
      company: "Kuda Bank",
      role: "Mobile App Developer",
      location: "Lagos, Nigeria",
      type: "Full-time Internship",
      logo: "🏦"
    },
    {
      company: "Interswitch",
      role: "Backend Engineer",
      location: "Lagos, Nigeria",
      type: "Full-time",
      logo: "💼"
    },
    {
      company: "Microsoft Africa",
      role: "Cloud Solutions Developer",
      location: "Lagos, Nigeria",
      type: "Full-time",
      logo: "☁️"
    },
    {
      company: "Google Developer",
      role: "Associate Developer",
      location: "Remote (Global)",
      type: "Contract",
      logo: "🌐"
    },
    {
      company: "MTN Nigeria",
      role: "Systems Engineer",
      location: "Abuja, Nigeria",
      type: "Full-time Internship",
      logo: "📱"
    }
  ];

  return (
    <section className="py-24 px-4 bg-secondary/20">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold">
            Companies Ready to Hire You
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Our graduates are hired by top Nigerian, African, and global companies. These are just some of the opportunities waiting for you upon graduation.
          </p>
        </div>

        {/* Job Cards Scrollable */}
        <div className="relative mb-12">
          <div className="overflow-x-auto pb-4 -mx-4 px-4">
            <div className="flex gap-6 min-w-max">
              {jobs.map((job, index) => (
                <div
                  key={index}
                  className="bg-card border border-border rounded-lg p-6 space-y-4 hover:shadow-lg transition-all hover:-translate-y-1 w-[280px] flex-shrink-0"
                >
                  <div className="flex items-start justify-between">
                    <div className="text-4xl">{job.logo}</div>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                      {job.type}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg">{job.company}</h3>
                      <p className="text-sm font-medium text-foreground">{job.role}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <MapPin size={12} />
                        <span>{job.location}</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={() => handleApply(job.company)}
                    >
                      Apply Now
                      <ExternalLink size={14} className="ml-2" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-muted-foreground mb-6">
            These opportunities and hundreds more are available to our graduates
          </p>
          <Button
            size="lg"
            onClick={() => window.open("https://calendly.com/techfacultyafrica/clarity-call", "_blank")}
            className="bg-gradient-to-r from-primary to-[hsl(180,100%,45%)] text-white hover:opacity-90"
          >
            <Briefcase className="mr-2" size={20} />
            Start Your Journey Today
          </Button>
        </div>
      </div>

      {/* Faculty ID Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply to {selectedJob}</DialogTitle>
            <DialogDescription>
              Enter your Faculty ID to proceed with your application.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="facultyId">Faculty ID</Label>
              <Input
                id="facultyId"
                placeholder="Enter your Faculty ID"
                value={facultyId}
                onChange={(e) => setFacultyId(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDialogOpen(false);
                setFacultyId("");
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!facultyId.trim()}>
              Continue to Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Companies;
