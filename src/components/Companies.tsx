import { Briefcase, MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
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
  const [currentCard, setCurrentCard] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCard((prev) => (prev + 1) % jobs.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleApply = (company: string) => {
    setSelectedJob(company);
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (facultyId.trim()) {
      // Here you would handle the application submission
      window.open("https://forms.gle/Mk9PiAcoY9ykW6LZ7", "_blank");
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

        {/* Job Cards Slider */}
        <div className="relative mb-12 overflow-hidden">
          <div className="flex justify-center">
            {jobs.map((job, index) => (
              <div
                key={index}
                className={`w-full max-w-[320px] md:max-w-[400px] transition-all duration-500 ${
                  index === currentCard
                    ? "opacity-100 translate-x-0 relative"
                    : index < currentCard
                    ? "opacity-0 -translate-x-full absolute inset-0"
                    : "opacity-0 translate-x-full absolute inset-0"
                }`}
              >
                <div className="bg-card border border-border rounded-lg p-6 space-y-4 shadow-lg mx-auto">
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
              </div>
            ))}
          </div>

          {/* Slide indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {jobs.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentCard(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentCard ? "bg-primary w-8" : "bg-muted-foreground/30"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-muted-foreground mb-6">
            These opportunities and hundreds more are available to our graduates
          </p>
          <Button
            size="lg"
            onClick={() => {
              const element = document.getElementById("see-how-you-are-doing");
              element?.scrollIntoView({ behavior: "smooth" });
            }}
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
