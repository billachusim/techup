import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Search, ShieldCheck, Sparkles, BriefcaseBusiness } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import RequestIntroDialog from "@/components/talent/RequestIntroDialog";
import {
  WORK_MODE_LABEL,
  fetchPublicTalent,
  type PublicTalentSummary,
} from "@/lib/talent";

const TalentCard = ({ person, onRequested }: { person: PublicTalentSummary; onRequested: () => void }) => (
  <article className="flex flex-col justify-between rounded-lg border border-border bg-card p-5 transition-shadow hover:shadow-md">
    <div className="space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="text-lg font-semibold leading-snug">
          <Link to={`/talent/pool/${person.id}`} className="hover:text-primary">{person.full_name}</Link>
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {person.is_vetted && <Badge className="gap-1"><ShieldCheck size={12} /> Vetted</Badge>}
          {person.is_client_interested && <Badge variant="secondary">Client interested</Badge>}
        </div>
      </div>
      {person.headline && <p className="text-sm text-muted-foreground">{person.headline}</p>}
      <div className="space-y-1 text-xs text-muted-foreground">
        <p className="flex items-center gap-1.5">
          <MapPin size={12} /> {[person.city, person.country].filter(Boolean).join(", ")} ·{" "}
          {WORK_MODE_LABEL[person.work_mode] ?? person.work_mode}
        </p>
        <p>
          {person.years_experience != null ? `${person.years_experience} yr experience` : "Experience on request"}
          {person.hours_per_week ? ` · ${person.hours_per_week} hrs/week` : ""}
        </p>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {person.skills.slice(0, 5).map((skill) => (
          <span key={skill} className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">{skill}</span>
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5 text-xs">
        {person.is_matched && (
          <span className="inline-flex items-center gap-1 text-primary"><Sparkles size={12} /> Matched to a project</span>
        )}
        {person.is_working && (
          <span className="inline-flex items-center gap-1 text-muted-foreground"><BriefcaseBusiness size={12} /> Currently working</span>
        )}
      </div>
    </div>
    <div className="mt-5 flex flex-wrap gap-2">
      <Link to={`/talent/pool/${person.id}`}><Button size="sm" variant="outline">View profile</Button></Link>
      <RequestIntroDialog
        talentId={person.id}
        talentName={person.full_name}
        skills={person.skills}
        onRequested={onRequested}
        trigger={<Button size="sm">Request an introduction</Button>}
      />
    </div>
  </article>
);

const TalentPool = () => {
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState("all");
  const [status, setStatus] = useState("all");

  const { data: people = [], isLoading, refetch } = useQuery({
    queryKey: ["public-talent-pool"],
    queryFn: fetchPublicTalent,
    staleTime: 1000 * 60 * 5,
  });

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return people.filter((person) => {
      if (mode !== "all" && person.work_mode !== mode) return false;
      if (status === "vetted" && !person.is_vetted) return false;
      if (status === "open" && person.availability !== "open") return false;
      if (!query) return true;
      return `${person.full_name} ${person.headline ?? ""} ${person.city ?? ""} ${person.country} ${person.skills.join(" ")} ${person.tools.join(" ")}`
        .toLowerCase()
        .includes(query);
    });
  }, [people, search, mode, status]);

  const canonical = "https://techfaculty.ng/talent/pool";

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Hire Vetted African Tech Talent | Tech Faculty</title>
        <meta name="description" content="Browse the Tech Faculty talent pool: developers, designers, analysts, marketers and project managers across Nigeria and Africa, ready for remote and on-site work." />
        <meta property="og:title" content="Hire Vetted African Tech Talent | Tech Faculty" />
        <meta property="og:description" content="Search skilled African tech talent by skill, city and availability, then ask us for an introduction." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonical} />
        <link rel="canonical" href={canonical} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Tech Faculty talent pool",
          description: "Searchable directory of skilled African tech talent available for projects and roles.",
          url: canonical,
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: filtered.length,
            itemListElement: filtered.slice(0, 50).map((person, index) => ({
              "@type": "ListItem",
              position: index + 1,
              url: `${canonical}/${person.id}`,
              name: person.full_name,
            })),
          },
        })}</script>
      </Helmet>
      <Header />

      <main className="pt-20">
        <section className="px-4 py-14">
          <div className="container mx-auto max-w-5xl text-center">
            <p className="mb-3 text-sm font-semibold text-primary">Tech Faculty Talent Pool</p>
            <h1 className="text-3xl font-bold md:text-5xl">Skilled people, ready to work</h1>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Browse our talent by skill, city and availability. Contact details stay private — tell us who you want and
              we make the introduction and handle the paperwork.
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/hire"><Button size="lg">Send a hiring brief</Button></Link>
              <Link to="/talent/profile"><Button size="lg" variant="outline">Add my profile</Button></Link>
            </div>
          </div>
        </section>

        <section className="px-4 pb-20" aria-labelledby="pool-heading">
          <div className="container mx-auto max-w-6xl">
            <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
              <h2 id="pool-heading" className="text-2xl font-bold">Available talent</h2>
              <span className="text-sm text-muted-foreground">{filtered.length} {filtered.length === 1 ? "person" : "people"}</span>
            </div>

            <div className="mb-8 grid gap-3 md:grid-cols-[minmax(0,1fr)_12rem_12rem]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search skill, name, tool or city" className="pl-9" aria-label="Search talent" />
              </div>
              <Select value={mode} onValueChange={setMode}>
                <SelectTrigger aria-label="Filter by work mode"><SelectValue placeholder="Work mode" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any work mode</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                  <SelectItem value="onsite">On-site</SelectItem>
                </SelectContent>
              </Select>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger aria-label="Filter by status"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Everyone</SelectItem>
                  <SelectItem value="vetted">Vetted only</SelectItem>
                  <SelectItem value="open">Open to work</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => <div key={index} className="h-64 animate-pulse rounded-lg border border-border bg-card" />)}
              </div>
            ) : filtered.length ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((person) => (
                  <TalentCard key={person.id} person={person} onRequested={() => refetch()} />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-border bg-card p-10 text-center">
                <p className="text-muted-foreground">
                  {people.length ? "Nobody matches those filters yet." : "Our first profiles are being reviewed. Send us a brief and we will shortlist for you."}
                </p>
                <Link to="/hire"><Button className="mt-5" variant="outline">Tell us what you need</Button></Link>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TalentPool;
