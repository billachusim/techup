import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, Building2, ExternalLink, GraduationCap, Handshake, MapPin, Briefcase, Info } from "lucide-react";
import LeadCaptureForm from "@/components/leads/LeadCaptureForm";

type Kind = "internship" | "entry_level_job" | "scholarship" | "partner";

type Listing = {
  id: string;
  kind: Kind;
  title: string;
  organisation: string;
  location: string | null;
  description: string;
  apply_url: string | null;
  deadline: string | null;
  is_paid_placement: boolean;
};

const kindMeta: Record<Kind, { label: string; icon: typeof Briefcase; blurb: string }> = {
  internship: {
    label: "Internship",
    icon: GraduationCap,
    blurb: "SIWES and industrial training placements from employers.",
  },
  entry_level_job: {
    label: "Entry-level role",
    icon: Briefcase,
    blurb: "Junior and graduate roles open to recent trainees.",
  },
  scholarship: {
    label: "Scholarship",
    icon: Building2,
    blurb: "Funded training and study opportunities.",
  },
  partner: {
    label: "Partner",
    icon: Handshake,
    blurb: "Programs and services from organisations we work with.",
  },
};

const fetchListings = async (): Promise<Listing[]> => {
  const { data, error } = await supabase
    .from("partner_listings")
    .select("id, kind, title, organisation, location, description, apply_url, deadline, is_paid_placement")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Listing[];
};

const Opportunities = () => {
  const [kind, setKind] = useState<Kind | "all">("all");

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ["partner-listings"],
    queryFn: fetchListings,
    staleTime: 1000 * 60 * 10,
  });

  const filtered = useMemo(
    () => (kind === "all" ? listings : listings.filter((l) => l.kind === kind)),
    [listings, kind],
  );

  const counts = useMemo(
    () =>
      listings.reduce<Record<string, number>>((acc, l) => {
        acc[l.kind] = (acc[l.kind] ?? 0) + 1;
        return acc;
      }, {}),
    [listings],
  );

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Opportunities Board — Internships, Jobs &amp; Scholarships</title>
        <meta
          name="description"
          content="Curated internship, entry-level job, scholarship and partner opportunities for Nigerian students and graduates. Reviewed listings, clearly labelled, no clutter."
        />
        <meta property="og:title" content="Opportunities Board | Tech Faculty NG" />
        <meta
          property="og:description"
          content="Internships, entry-level roles, scholarships and partner programs for Nigerian students — curated and clearly labelled."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://techfaculty.ng/opportunities" />
        <link rel="canonical" href="https://techfaculty.ng/opportunities" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Opportunities Board",
            description:
              "Curated internships, entry-level roles, scholarships and partner programs for Nigerian students and graduates.",
            url: "https://techfaculty.ng/opportunities",
            isPartOf: { "@type": "WebSite", name: "Tech Faculty NG", url: "https://techfaculty.ng" },
          })}
        </script>
      </Helmet>

      <Header />

      <main className="pt-20">
        <section className="py-14 md:py-16 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="max-w-2xl space-y-4 mb-10">
              <h1 className="text-3xl md:text-4xl font-bold">Opportunities Board</h1>
              <p className="text-muted-foreground leading-relaxed">
                Internships, entry-level roles, scholarships and partner programs worth a Nigerian
                student's attention. Every listing is reviewed by our team before it appears, and
                anything we're paid to feature is labelled as such.
              </p>
              <div className="flex flex-wrap gap-3 text-sm">
                <Link to="/careers" className="text-primary hover:underline inline-flex items-center gap-1">
                  Live remote AI &amp; tech jobs board <ArrowRight size={14} />
                </Link>
                <Link to="/siwes" className="text-primary hover:underline inline-flex items-center gap-1">
                  SIWES placements with us <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Filter listings by type">
              <Button
                variant={kind === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setKind("all")}
              >
                All ({listings.length})
              </Button>
              {(Object.keys(kindMeta) as Kind[]).map((k) => (
                <Button
                  key={k}
                  variant={kind === k ? "default" : "outline"}
                  size="sm"
                  onClick={() => setKind(k)}
                >
                  {kindMeta[k].label} ({counts[k] ?? 0})
                </Button>
              ))}
            </div>

            {/* Listings */}
            {isLoading ? (
              <div className="grid sm:grid-cols-2 gap-5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-40 rounded-lg border border-border bg-card animate-pulse" />
                ))}
              </div>
            ) : filtered.length ? (
              <div className="grid sm:grid-cols-2 gap-5">
                {filtered.map((listing) => {
                  const meta = kindMeta[listing.kind];
                  const Icon = meta.icon;
                  return (
                    <article
                      key={listing.id}
                      className="rounded-lg border border-border bg-card p-5 flex flex-col gap-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <Badge variant="secondary" className="text-xs inline-flex items-center gap-1">
                          <Icon size={12} /> {meta.label}
                        </Badge>
                        {listing.is_paid_placement && (
                          <span className="text-[10px] uppercase tracking-wide text-muted-foreground border border-border rounded px-1.5 py-0.5">
                            Paid placement
                          </span>
                        )}
                      </div>
                      <div>
                        <h2 className="font-semibold leading-snug">{listing.title}</h2>
                        <p className="text-sm text-muted-foreground">{listing.organisation}</p>
                        {listing.location && (
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <MapPin size={12} /> {listing.location}
                          </p>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {listing.description}
                      </p>
                      <div className="mt-auto pt-2 flex items-center justify-between gap-3">
                        {listing.deadline && (
                          <span className="text-xs text-muted-foreground">
                            Closes{" "}
                            {new Date(listing.deadline).toLocaleDateString("en-NG", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        )}
                        {listing.apply_url && (
                          <Button size="sm" variant="outline" asChild className="ml-auto">
                            <a href={listing.apply_url} target="_blank" rel="noopener noreferrer nofollow">
                              View details <ExternalLink size={13} className="ml-1.5" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-lg border border-border bg-card p-8 text-center space-y-3">
                <Info size={20} className="mx-auto text-muted-foreground" />
                <p className="font-medium">
                  {listings.length
                    ? "No listings in that category right now."
                    : "The board is being curated — the first listings go live shortly."}
                </p>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  In the meantime, our live remote AI and tech jobs board is updated every week with
                  roles open to Nigerian talent.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/careers">Browse the jobs board</Link>
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Employer / partner enquiry */}
        <section className="py-14 px-4 bg-muted/30">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold mb-2">List an opportunity</h2>
            <p className="text-muted-foreground mb-6">
              Employers, schools and program partners: tell us what you're offering and we'll come back
              with placement options and rates. Listings stay clearly labelled and on-topic — we don't
              run display advertising.
            </p>
            <div className="rounded-xl border border-border bg-card p-6 md:p-8">
              <LeadCaptureForm
                interest="partner_enquiry"
                source="page:opportunities"
                submitLabel="Send enquiry"
                hint="We reply within two working days."
                whatsappMessage="Hello Tech Faculty, I'd like to list an opportunity on your Opportunities Board."
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Opportunities;
