import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { BriefcaseBusiness, Search, Sparkles, UserRoundSearch } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PlatformPartners from "@/components/jobs/PlatformPartners";
import RoleCard from "@/components/talent/RoleCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUser } from "@/contexts/UserContext";
import { EMPLOYMENT_LABEL, fetchPublishedRoles, roleLocationLabel } from "@/lib/talent";

const steps = [
  { icon: UserRoundSearch, title: "Build one profile", body: "Add your skills, CV, availability and preferred rate once, then keep improving your profile." },
  { icon: Sparkles, title: "Receive reviewed matches", body: "Our system scores suitable roles, and our team reviews every match before sharing it with you." },
  { icon: BriefcaseBusiness, title: "Apply and get hired", body: "Apply to Tech Faculty openings and approved client projects directly with your talent profile." },
];

const Careers = () => {
  const { isLoggedIn } = useUser();
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [workplace, setWorkplace] = useState("all");
  const { data: roles = [], isLoading } = useQuery({
    queryKey: ["talent-roles-careers"],
    queryFn: () => fetchPublishedRoles(),
    staleTime: 1000 * 60 * 10,
  });

  const types = useMemo(() => Array.from(new Set(roles.map((role) => role.employment_type))).sort(), [roles]);
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return roles.filter((role) => {
      if (type !== "all" && role.employment_type !== type) return false;
      if (workplace === "remote" && !role.is_remote) return false;
      if (workplace === "onsite" && role.is_remote) return false;
      if (!query) return true;
      return `${role.title} ${role.company} ${role.summary} ${role.description} ${role.required_skills.join(" ")} ${roleLocationLabel(role)}`
        .toLowerCase()
        .includes(query);
    });
  }, [roles, search, type, workplace]);

  const joinHref = isLoggedIn ? "/talent/profile" : "/login?next=/talent/profile";
  const itemList = filtered.map((role, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: `https://techfaculty.ng/talent/roles/${role.slug}`,
    name: `${role.title} at ${role.company}`,
  }));

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Tech Jobs & Talent Marketplace | Tech Faculty</title>
        <meta name="description" content="Build one talent profile and get matched to verified tech roles and business projects across Nigeria and Africa, or hire skilled African talent." />
        <meta property="og:title" content="Tech Jobs & Talent Marketplace | Tech Faculty" />
        <meta property="og:description" content="Join our African talent pipeline, find open roles, or hire skilled people for your next project." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://techfaculty.ng/careers" />
        <link rel="canonical" href="https://techfaculty.ng/careers" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Tech Faculty Careers and Talent Marketplace",
          description: "A talent marketplace matching skilled African professionals to Tech Faculty and approved client roles.",
          url: "https://techfaculty.ng/careers",
          mainEntity: { "@type": "ItemList", numberOfItems: itemList.length, itemListElement: itemList },
        })}</script>
      </Helmet>
      <Header />
      <main className="pt-20">
        <section className="px-4 py-16">
          <div className="container mx-auto max-w-5xl text-center">
            <p className="mb-3 text-sm font-semibold text-primary">Tech Faculty Talent</p>
            <h1 className="text-3xl font-bold md:text-5xl">One profile. Real roles. <span className="text-gradient">Work that matters.</span></h1>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
              We connect skilled people across Nigeria and Africa with Tech Faculty openings and approved business projects. Build your profile once and get matched as new work becomes available.
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to={joinHref}><Button size="lg">Join as talent</Button></Link>
              <Link to="/hire"><Button size="lg" variant="outline">Hire talent</Button></Link>
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-card/40 px-4 py-12">
          <div className="container mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.title} className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium"><step.icon size={18} className="text-primary" /> Step {index + 1}</div>
                <h2 className="text-lg font-semibold">{step.title}</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="px-4 py-16" aria-labelledby="open-roles-heading">
          <div className="container mx-auto max-w-6xl">
            <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 id="open-roles-heading" className="text-2xl font-bold md:text-3xl">Open roles</h2>
                <p className="mt-1 text-sm text-muted-foreground">Roles from Tech Faculty and businesses using our talent pipeline.</p>
              </div>
              <span className="text-sm text-muted-foreground">{filtered.length} {filtered.length === 1 ? "opening" : "openings"}</span>
            </div>

            <div className="mb-8 grid gap-3 md:grid-cols-[minmax(0,1fr)_12rem_12rem]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search role, skill, company or location" className="pl-9" aria-label="Search open roles" />
              </div>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger aria-label="Filter by role type"><SelectValue placeholder="Role type" /></SelectTrigger>
                <SelectContent><SelectItem value="all">All role types</SelectItem>{types.map((item) => <SelectItem key={item} value={item}>{EMPLOYMENT_LABEL[item] ?? item}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={workplace} onValueChange={setWorkplace}>
                <SelectTrigger aria-label="Filter by workplace"><SelectValue placeholder="Workplace" /></SelectTrigger>
                <SelectContent><SelectItem value="all">Any workplace</SelectItem><SelectItem value="remote">Remote friendly</SelectItem><SelectItem value="onsite">On-site</SelectItem></SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 3 }).map((_, index) => <div key={index} className="h-64 animate-pulse rounded-lg border border-border bg-card" />)}</div>
            ) : filtered.length ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((role) => <RoleCard key={role.id} role={role} />)}</div>
            ) : (
              <div className="rounded-lg border border-border bg-card p-10 text-center">
                <p className="text-muted-foreground">No roles match those filters right now.</p>
                <Link to={joinHref}><Button className="mt-5" variant="outline">Complete my profile for future matches</Button></Link>
              </div>
            )}
          </div>
        </section>

        <section className="border-t border-border px-4 py-16">
          <div className="container mx-auto max-w-6xl"><PlatformPartners /></div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Careers;