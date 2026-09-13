import { ArrowRight, BriefcaseBusiness } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import RoleCard from "@/components/talent/RoleCard";
import { fetchPublishedRoles } from "@/lib/talent";

const LatestJobs = () => {
  const { data: roles = [], isLoading } = useQuery({
    queryKey: ["talent-roles-home"],
    queryFn: () => fetchPublishedRoles(),
    staleTime: 1000 * 60 * 10,
  });
  const featured = roles.slice(0, 6);

  return (
    <section className="bg-secondary/20 px-4 py-16">
      <div className="container mx-auto max-w-6xl space-y-10">
        <div className="space-y-3 text-center">
          <h2 className="text-2xl font-bold md:text-3xl">Open roles for African talent</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Build one Tech Faculty talent profile and get matched to our openings and approved business projects.
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => <div key={index} className="h-56 animate-pulse rounded-lg border border-border bg-card" />)}
          </div>
        ) : featured.length > 0 ? (
          <div className="grid gap-6 text-left sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((role) => <RoleCard key={role.id} role={role} />)}
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground">
            New openings are added as businesses submit approved work.
          </div>
        )}

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/careers"><Button className="gap-2">Browse Careers <ArrowRight size={16} /></Button></Link>
          <Link to="/hire"><Button variant="outline" className="gap-2"><BriefcaseBusiness size={16} /> Hire talent</Button></Link>
        </div>
      </div>
    </section>
  );
};

export default LatestJobs;