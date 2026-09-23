import { Helmet } from "react-helmet-async";
import { notifyMarketplaceEvent } from "@/lib/marketplace-emails.functions";
import { Link, useNavigate, useParams } from "@/lib/router-compat";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { MapPin, Wallet, Users, CalendarClock, ArrowLeft, MessageCircle, Users2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/contexts/UserContext";
import TalentNav from "@/components/talent/TalentNav";
import {
  EMPLOYMENT_LABEL,
  SENIORITY_LABEL,
  fetchProjectGroupUrl,
  fetchRoleBySlug,
  formatBudget,
  openingsLabel,
  projectManagerUrl,
  roleBadges,
  roleLocationLabel,
} from "@/lib/talent";

const TalentRoleDetail = () => {
  const { slug = "" } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useUser();
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { data: role, isLoading } = useQuery({
    queryKey: ["talent-role", slug],
    queryFn: () => fetchRoleBySlug(slug),
    enabled: Boolean(slug),
  });

  const { data: mine } = useQuery({
    queryKey: ["talent-role-mine", role?.id, isLoggedIn],
    enabled: Boolean(role?.id) && isLoggedIn,
    queryFn: async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user || !role) return null;
      const { data: profile } = await supabase
        .from("talent_profiles")
        .select("id, full_name")
        .eq("user_id", auth.user.id)
        .maybeSingle();
      if (!profile) return { profile: null, matched: false, applied: false, groupUrl: null as string | null };
      const [{ data: match }, { data: application }, groupUrl] = await Promise.all([
        supabase
          .from("role_matches")
          .select("id, status")
          .eq("role_id", role.id)
          .eq("talent_profile_id", profile.id)
          .maybeSingle(),
        supabase
          .from("talent_applications")
          .select("id")
          .eq("role_id", role.id)
          .eq("talent_profile_id", profile.id)
          .maybeSingle(),
        fetchProjectGroupUrl(role.id),
      ]);
      return {
        profile,
        matched: Boolean(match && ["approved", "accepted", "assessment", "interview", "hired"].includes(match.status)),
        applied: Boolean(application),
        groupUrl,
      };
    },
  });


  const apply = async () => {
    if (!role) return;
    if (!isLoggedIn) {
      navigate(`/login?next=/talent/roles/${slug}`);
      return;
    }
    setSubmitting(true);
    try {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) throw new Error("Please sign in again.");
      const { data: profile } = await supabase
        .from("talent_profiles")
        .select("id")
        .eq("user_id", auth.user.id)
        .maybeSingle();
      if (!profile) {
        toast({
          title: "Create your profile first",
          description: "We need your skills and CV before we can send your application.",
        });
        navigate(`/talent/profile?next=/talent/roles/${slug}`);
        return;
      }
      const { data: inserted, error } = await supabase.from("talent_applications").insert({
        role_id: role.id,
        talent_profile_id: profile.id,
        message: message.trim() || null,
      }).select("id").single();
      if (error) {
        if (error.code === "23505" || error.code === "23514" || error.message.includes("duplicate")) {
          toast({ title: "Already applied", description: "You have applied to this role already." });
          return;
        }
        throw error;
      }
      if (inserted?.id) notifyMarketplaceEvent({ data: { event: "application_submitted", id: inserted.id } }).catch(() => {});
      toast({ title: "Application sent", description: "You can track it on your talent dashboard." });
      setMessage("");
      navigate("/talent/dashboard");
    } catch (err) {
      toast({
        title: "Could not send your application",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

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

  if (!role || role.status !== "published") {
    return (
      <div className="min-h-screen bg-background">
        <Helmet>
          <title>Role not available | Tech Faculty Talent</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <Header />
        <main className="container mx-auto max-w-3xl px-4 pt-28 pb-20 text-center">
          <h1 className="mb-3 text-2xl font-bold">This role is no longer open</h1>
          <p className="mb-6 text-muted-foreground">It may have been filled or closed.</p>
          <Link to="/talent"><Button>See open roles</Button></Link>
        </main>
        <Footer />
      </div>
    );
  }

  const canonical = `https://techfaculty.ng/talent/roles/${role.slug}`;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{`${role.title} at ${role.company} | Tech Faculty`}</title>
        <meta name="description" content={role.summary.slice(0, 158)} />
        <meta property="og:title" content={`${role.title} at ${role.company}`} />
        <meta property="og:description" content={role.summary.slice(0, 158)} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonical} />
        <link rel="canonical" href={canonical} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "JobPosting",
          title: role.title,
          description: role.description,
          datePosted: role.created_at.slice(0, 10),
          employmentType:
            role.employment_type === "internship" ? "INTERN" :
            role.employment_type === "contract" ? "CONTRACTOR" :
            role.employment_type === "part_time" ? "PART_TIME" : "FULL_TIME",
          hiringOrganization: { "@type": "Organization", name: role.company, sameAs: "https://techfaculty.ng" },
          jobLocation: {
            "@type": "Place",
            address: {
              "@type": "PostalAddress",
              addressLocality: role.city ?? "Nnewi",
              addressRegion: role.city === "Lagos" ? "Lagos" : "Anambra",
              addressCountry: role.country === "Nigeria" ? "NG" : role.country,
            },
          },
          ...(role.is_remote
            ? { jobLocationType: "TELECOMMUTE", applicantLocationRequirements: { "@type": "Country", name: role.country } }
            : {}),
          ...(role.budget_min && role.budget_max
            ? {
                baseSalary: {
                  "@type": "MonetaryAmount",
                  currency: role.budget_currency,
                  value: {
                    "@type": "QuantitativeValue",
                    minValue: Number(role.budget_min),
                    maxValue: Number(role.budget_max),
                    unitText: role.budget_unit,
                  },
                },
              }
            : {}),
          ...(role.apply_deadline ? { validThrough: role.apply_deadline } : {}),
          totalJobOpenings: role.openings,
          directApply: true,
          identifier: { "@type": "PropertyValue", name: role.company, value: role.slug },
          ...(role.category ? { occupationalCategory: role.category } : {}),
        })}</script>
      </Helmet>
      <Header />

      <main className="pt-20">
        <TalentNav />
        <article className="container mx-auto max-w-3xl px-4 py-10 md:py-12">
          <Link to="/careers" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft size={14} /> All open roles
          </Link>

          <header className="space-y-3">
            <div className="flex flex-wrap gap-1.5">
              {roleBadges(role).map((badge) => (
                <Badge key={badge} variant={badge === "Paid training" || badge === "New" ? "default" : "secondary"}>
                  {badge}
                </Badge>
              ))}
            </div>
            <h1 className="text-2xl font-bold sm:text-3xl md:text-4xl">{role.title}</h1>
            <p className="text-muted-foreground">{role.company}</p>
            <div className="grid gap-2 pt-2 text-sm text-muted-foreground sm:grid-cols-2">
              <p className="flex items-center gap-2"><MapPin size={14} /> {roleLocationLabel(role)}</p>
              <p className="flex items-center gap-2"><Wallet size={14} /> {formatBudget(role)}</p>
              <p className="flex items-center gap-2"><Users size={14} /> {openingsLabel(role.openings)} · {SENIORITY_LABEL[role.seniority] ?? role.seniority}</p>
              <p className="flex items-center gap-2"><CalendarClock size={14} /> {EMPLOYMENT_LABEL[role.employment_type] ?? role.employment_type}</p>
            </div>
          </header>

          <section className="mt-8 space-y-6">
            <div>
              <h2 className="mb-2 text-xl font-semibold">About this role</h2>
              <p className="whitespace-pre-line leading-relaxed text-muted-foreground">{role.description}</p>
            </div>

            {role.responsibilities.length > 0 && (
              <div>
                <h2 className="mb-2 text-xl font-semibold">What you will do</h2>
                <ul className="list-disc space-y-1.5 pl-5 text-muted-foreground">
                  {role.responsibilities.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            )}

            {role.required_skills.length > 0 && (
              <div>
                <h2 className="mb-2 text-xl font-semibold">Skills we look for</h2>
                <div className="flex flex-wrap gap-2">
                  {role.required_skills.map((s) => (
                    <span key={s} className="rounded-full border border-border px-3 py-1 text-sm text-muted-foreground">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {role.nice_to_have.length > 0 && (
              <div>
                <h2 className="mb-2 text-xl font-semibold">Nice to have</h2>
                <ul className="list-disc space-y-1.5 pl-5 text-muted-foreground">
                  {role.nice_to_have.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            )}
          </section>

          {mine?.matched && (
            <section className="mt-10 rounded-lg border border-primary/40 bg-primary/5 p-6">
              <h2 className="text-lg font-semibold">You have been matched to this role</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                The next step is a short assessment or interview over WhatsApp. If you do not hear back within two days,
                message the project manager yourself.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {mine.groupUrl && (
                  <a href={mine.groupUrl} target="_blank" rel="noopener noreferrer">
                    <Button><Users2 className="mr-2" size={16} /> Join the project group</Button>
                  </a>
                )}
                <a href={projectManagerUrl(role.title, mine.profile?.full_name)} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline"><MessageCircle className="mr-2" size={16} /> Reach out to the project manager</Button>
                </a>
              </div>
            </section>
          )}

          <section className="mt-10 rounded-lg border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">
              {role.applications_closed && !mine?.applied ? "Applications are closed" : "Apply with your talent profile"}
            </h2>
            {role.applications_closed && !mine?.applied ? (
              <>
                <p className="mt-1 text-sm text-muted-foreground">
                  This project has already selected its team. Keep your profile complete and you will be matched to the next one.
                </p>
                <Link to="/careers" className="mt-4 inline-block">
                  <Button variant="outline">See other open roles</Button>
                </Link>
              </>
            ) : mine?.applied ? (
              <>
                <p className="mt-1 text-sm text-muted-foreground">
                  You have already applied to this role. Track it on your dashboard.
                </p>
                <Link to="/talent/dashboard" className="mt-4 inline-block">
                  <Button variant="outline">Go to my dashboard</Button>
                </Link>
              </>
            ) : isLoggedIn && mine?.profile ? (
              <>
                <p className="mt-1 text-sm text-muted-foreground">
                  One click sends your profile, skills and CV to the hiring team. No forms.
                </p>
                <Button className="mt-4 w-full sm:w-auto" onClick={apply} disabled={submitting}>
                  {submitting ? "Sending…" : "Apply with my Faculty profile"}
                </Button>
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm text-muted-foreground">Add a short note (optional)</summary>
                  <Textarea
                    className="mt-3"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value.slice(0, 1000))}
                    placeholder="Why you are a good fit"
                  />
                </details>
              </>
            ) : (
              <>
                <p className="mt-1 text-sm text-muted-foreground">
                  {isLoggedIn
                    ? "Build your talent profile once and applying becomes one click, here and on every other role."
                    : "Sign in with your Faculty account and applying takes one click."}
                </p>
                <Button className="mt-4 w-full sm:w-auto" onClick={apply} disabled={submitting}>
                  {isLoggedIn ? "Build my profile" : "Sign in and apply"}
                </Button>
              </>
            )}
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default TalentRoleDetail;
