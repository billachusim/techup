import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, BriefcaseBusiness, ExternalLink, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TalentNav from "@/components/talent/TalentNav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import RequestIntroDialog from "@/components/talent/RequestIntroDialog";
import { WORK_MODE_LABEL, fetchPublicTalentById } from "@/lib/talent";

const TalentPublicProfile = () => {
  const { id = "" } = useParams();
  const { data: person, isLoading, refetch } = useQuery({
    queryKey: ["public-talent", id],
    queryFn: () => fetchPublicTalentById(id),
    enabled: Boolean(id),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto max-w-3xl px-4 pt-28">
          <div className="h-64 animate-pulse rounded-lg border border-border bg-card" />
        </main>
      </div>
    );
  }

  if (!person) {
    return (
      <div className="min-h-screen bg-background">
        <Helmet>
          <title>Profile not available | Tech Faculty Talent</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <Header />
        <main className="container mx-auto max-w-3xl px-4 pb-20 pt-28 text-center">
          <h1 className="mb-3 text-2xl font-bold">This profile is not public</h1>
          <p className="mb-6 text-muted-foreground">The person may have hidden it, or the link is out of date.</p>
          <Link to="/talent/pool"><Button>Browse the talent pool</Button></Link>
        </main>
        <Footer />
      </div>
    );
  }

  const canonical = `https://techfaculty.ng/talent/pool/${person.id}`;
  const location = [person.city, person.country].filter(Boolean).join(", ");
  const description = (person.headline ?? `${person.skills.slice(0, 4).join(", ")} talent based in ${location}`).slice(0, 158);
  const links = [
    { label: "LinkedIn", url: person.linkedin_url },
    { label: "GitHub", url: person.github_url },
    { label: "Portfolio", url: person.portfolio_url },
  ].filter((item) => item.url);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{`${person.full_name} — ${person.headline ?? "Tech talent"}`.slice(0, 60)}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={`${person.full_name} | Tech Faculty Talent`} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content={canonical} />
        <link rel="canonical" href={canonical} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: person.full_name,
          jobTitle: person.headline ?? undefined,
          knowsAbout: person.skills,
          address: { "@type": "PostalAddress", addressLocality: person.city ?? undefined, addressCountry: person.country },
          affiliation: { "@type": "Organization", name: "Tech Faculty", url: "https://techfaculty.ng" },
          url: canonical,
        })}</script>
      </Helmet>
      <Header />

      <main className="pt-20">
        <TalentNav />
        <article className="container mx-auto max-w-3xl px-4 py-12">
          <Link to="/talent/pool" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft size={14} /> All talent
          </Link>

          <header className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {person.is_vetted && <Badge className="gap-1"><ShieldCheck size={12} /> Vetted by Tech Faculty</Badge>}
              {person.is_client_interested && <Badge variant="secondary">Client interested</Badge>}
              {person.is_matched && <Badge variant="outline" className="gap-1"><Sparkles size={12} /> Matched to a project</Badge>}
              {person.is_working && <Badge variant="outline" className="gap-1"><BriefcaseBusiness size={12} /> Currently working</Badge>}
            </div>
            <h1 className="text-3xl font-bold md:text-4xl">{person.full_name}</h1>
            {person.headline && <p className="text-lg text-muted-foreground">{person.headline}</p>}
            {person.faculty_id && (
              <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">Faculty ID {person.faculty_id}</p>
            )}
            <div className="grid gap-2 pt-2 text-sm text-muted-foreground sm:grid-cols-2">
              <p className="flex items-center gap-2"><MapPin size={14} /> {location}</p>
              <p>{WORK_MODE_LABEL[person.work_mode] ?? person.work_mode}{person.hours_per_week ? ` · ${person.hours_per_week} hrs/week` : ""}</p>
              <p>{person.years_experience != null ? `${person.years_experience} years experience` : "Experience shared on request"}</p>
              <p>{person.availability === "open" ? "Open to work" : "Not available right now"}</p>
            </div>
          </header>

          {person.bio && (
            <section className="mt-8">
              <h2 className="mb-2 text-xl font-semibold">About</h2>
              <p className="whitespace-pre-line leading-relaxed text-muted-foreground">{person.bio}</p>
            </section>
          )}

          {person.skills.length > 0 && (
            <section className="mt-8">
              <h2 className="mb-2 text-xl font-semibold">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {person.skills.map((skill) => (
                  <span key={skill} className="rounded-full border border-border px-3 py-1 text-sm text-muted-foreground">{skill}</span>
                ))}
              </div>
            </section>
          )}

          {person.tools.length > 0 && (
            <section className="mt-8">
              <h2 className="mb-2 text-xl font-semibold">Tools</h2>
              <p className="text-muted-foreground">{person.tools.join(", ")}</p>
            </section>
          )}

          {links.length > 0 && (
            <section className="mt-8">
              <h2 className="mb-2 text-xl font-semibold">Work links</h2>
              <ul className="space-y-1.5">
                {links.map((item) => (
                  <li key={item.label}>
                    <a href={item.url as string} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1.5 text-primary hover:underline">
                      {item.label} <ExternalLink size={13} />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="mt-10 rounded-lg border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">Want to work with {person.full_name.split(" ")[0]}?</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Phone numbers, emails and CVs stay private. Message us and we handle the introduction, the assessment and the
              working agreement.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <RequestIntroDialog
                talentId={person.id}
                talentName={person.full_name}
                skills={person.skills}
                source="talent_profile"
                onRequested={() => refetch()}
                trigger={<Button>Request an introduction</Button>}
              />
              <Link to="/hire"><Button variant="outline">Send a full brief</Button></Link>
            </div>
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default TalentPublicProfile;
