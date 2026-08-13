import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import JobCard from "@/components/jobs/JobCard";
import { fetchJobs } from "@/lib/jobs";

const companies = [
  { name: "Microsoft", color: "bg-[hsl(200,80%,50%)]", initials: "MS" },
  { name: "Google", color: "bg-[hsl(4,80%,56%)]", initials: "G" },
  { name: "Andela", color: "bg-[hsl(145,65%,42%)]", initials: "A" },
  { name: "Flutterwave", color: "bg-[hsl(45,90%,50%)]", initials: "FW" },
  { name: "Paystack", color: "bg-[hsl(210,70%,50%)]", initials: "PS" },
  { name: "MTN", color: "bg-[hsl(48,95%,50%)]", initials: "MTN" },
  { name: "Interswitch", color: "bg-[hsl(220,60%,45%)]", initials: "IS" },
  { name: "Kuda Bank", color: "bg-[hsl(270,60%,50%)]", initials: "K" },
];

const LatestJobs = () => {
  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ["jobs"],
    queryFn: () => fetchJobs(),
    staleTime: 1000 * 60 * 30,
  });

  const featured = jobs.slice(0, 6);

  return (
    <section className="py-16 px-4 bg-secondary/20">
      <div className="container mx-auto max-w-6xl space-y-10">
        <div className="text-center space-y-3">
          <h2 className="text-2xl md:text-3xl font-bold">Latest Remote AI &amp; Tech Jobs</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Fresh roles from Mercor, Turing, Micro1, Mindrift and other leading AI work platforms — refreshed weekly and filtered for talent in Nigeria and across Africa.
          </p>
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-56 rounded-lg border border-border bg-card animate-pulse" />
            ))}
          </div>
        ) : featured.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {featured.map((job) => <JobCard key={job.id} job={job} />)}
          </div>
        ) : null}

        <div className="text-center space-y-8">
          <Link to="/careers">
            <Button size="sm" className="gap-2">
              Browse the full jobs board <ArrowRight size={16} />
            </Button>
          </Link>

          <div className="space-y-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Where Our Graduates Work
            </h3>
            <div className="flex flex-wrap justify-center gap-6 md:gap-10">
              {companies.map((company) => (
                <div key={company.name} className="flex flex-col items-center gap-2">
                  <div className={`w-12 h-12 rounded-full ${company.color} flex items-center justify-center`}>
                    <span className="text-xs font-bold text-white">{company.initials}</span>
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">{company.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatestJobs;
