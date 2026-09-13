import { Helmet } from "react-helmet-async";
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, Sparkles, Briefcase, Pencil, ShieldCheck, Users2, MessageCircle, Wallet, Eye } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  APPLICATION_STATUS_LABEL,
  ENGAGEMENT_STATUS_LABEL,
  MATCH_STATUS_LABEL,
  fetchProjectGroupUrl,
  formatBudget,
  formatMoney,
  projectManagerUrl,
  weeksSince,
  type TalentEngagement,
  type TalentProfile,
} from "@/lib/talent";

const MATCHED_STATUSES = ["approved", "accepted", "assessment", "interview", "hired"];

type MatchRow = {
  id: string;
  score: number;
  reason: string | null;
  status: string;
  role_id: string;
  talent_roles: {
    slug: string; title: string; company: string; summary: string;
    budget_min: number | null; budget_max: number | null; budget_currency: string; budget_unit: string;
  } | null;
};

type ApplicationRow = {
  id: string;
  status: string;
  created_at: string;
  talent_roles: { slug: string; title: string; company: string } | null;
};

const TalentDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<TalentProfile | null>(null);
  const [matches, setMatches] = useState<MatchRow[]>([]);
  const [applications, setApplications] = useState<ApplicationRow[]>([]);
  const [engagements, setEngagements] = useState<(TalentEngagement & { talent_roles: { title: string } | null })[]>([]);
  const [groupUrls, setGroupUrls] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) {
      navigate("/login?next=/talent/dashboard", { replace: true });
      return;
    }
    const { data: p } = await supabase.from("talent_profiles").select("*").eq("user_id", auth.user.id).maybeSingle();
    setProfile(p ?? null);
    if (p) {
      const [{ data: m }, { data: a }, { data: e }] = await Promise.all([
        supabase
          .from("role_matches")
          .select("id, score, reason, status, role_id, talent_roles(slug, title, company, summary, budget_min, budget_max, budget_currency, budget_unit)")
          .eq("talent_profile_id", p.id)
          .order("score", { ascending: false }),
        supabase
          .from("talent_applications")
          .select("id, status, created_at, talent_roles(slug, title, company)")
          .eq("talent_profile_id", p.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("talent_engagements")
          .select("*, talent_roles(title)")
          .eq("talent_profile_id", p.id)
          .order("started_on", { ascending: false }),
      ]);
      const matchRows = (m ?? []) as MatchRow[];
      setMatches(matchRows);
      setApplications((a ?? []) as ApplicationRow[]);
      setEngagements((e ?? []) as (TalentEngagement & { talent_roles: { title: string } | null })[]);

      const matchedRoleIds = Array.from(
        new Set(matchRows.filter((row) => MATCHED_STATUSES.includes(row.status)).map((row) => row.role_id))
      );
      const urls = await Promise.all(matchedRoleIds.map((id) => fetchProjectGroupUrl(id)));
      const urlMap: Record<string, string> = {};
      matchedRoleIds.forEach((id, index) => { const url = urls[index]; if (url) urlMap[id] = url; });
      setGroupUrls(urlMap);
    }
    setLoading(false);
  }, [navigate]);

  useEffect(() => { load(); }, [load]);

  const respond = async (matchId: string, status: "accepted" | "declined") => {
    const { error } = await supabase.from("role_matches").update({ status }).eq("id", matchId);
    if (error) {
      toast({ title: "Could not save that", description: error.message, variant: "destructive" });
      return;
    }
    toast({
      title: status === "accepted" ? "Interest sent" : "Match declined",
      description: status === "accepted" ? "Our team will follow up with next steps." : "We will keep matching you to other roles.",
    });
    load();
  };

  const setAvailability = async (availability: string) => {
    if (!profile) return;
    const { error } = await supabase.from("talent_profiles").update({ availability }).eq("id", profile.id);
    if (error) {
      toast({ title: "Could not update availability", description: error.message, variant: "destructive" });
      return;
    }
    setProfile({ ...profile, availability });
    toast({ title: availability === "open" ? "Marked as open to work" : "Marked as unavailable" });
  };

  const setDirectoryVisible = async (isPublic: boolean) => {
    if (!profile) return;
    const { error } = await supabase.from("talent_profiles").update({ is_public: isPublic }).eq("id", profile.id);
    if (error) {
      toast({ title: "Could not update that", description: error.message, variant: "destructive" });
      return;
    }
    setProfile({ ...profile, is_public: isPublic });
    toast({ title: isPublic ? "Your profile is listed publicly" : "Your profile is hidden from the directory" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto max-w-4xl px-4 pt-28">
          <Loader2 className="mx-auto animate-spin text-muted-foreground" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Talent dashboard | Tech Faculty</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Header />

      <main className="pt-20">
        <div className="container mx-auto max-w-4xl space-y-8 px-4 py-12">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">
                {profile ? `Welcome, ${profile.full_name.split(" ")[0]}` : "Your talent dashboard"}
              </h1>
              <p className="mt-1 text-muted-foreground">Your matches, applications and availability in one place.</p>
            </div>
            <Link to="/talent/profile">
              <Button variant="outline"><Pencil className="mr-2" size={15} /> Edit profile</Button>
            </Link>
          </div>

          {!profile ? (
            <div className="rounded-lg border border-border bg-card p-8 text-center">
              <h2 className="text-lg font-semibold">You have not built your profile yet</h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                Add your skills, CV and availability and you will start being matched to open roles.
              </p>
              <Link to="/talent/profile" className="mt-5 inline-block">
                <Button>Build my profile</Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-border bg-card p-5">
                  <p className="text-sm font-medium">Profile strength</p>
                  <p className="mt-1 text-2xl font-bold">{profile.profile_strength}%</p>
                  <Progress className="mt-3" value={profile.profile_strength} />
                  {profile.profile_strength < 80 && (
                    <Link to="/talent/profile" className="mt-3 inline-block text-xs text-primary hover:underline">
                      Complete your profile to rank higher
                    </Link>
                  )}
                </div>
                <div className="rounded-lg border border-border bg-card p-5">
                  <p className="text-sm font-medium">Availability</p>
                  <Select value={profile.availability} onValueChange={setAvailability}>
                    <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open to work</SelectItem>
                      <SelectItem value="unavailable">Not available</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="mt-3 text-xs text-muted-foreground">Only open profiles enter new matching runs.</p>
                </div>
                <div className="rounded-lg border border-border bg-card p-5">
                  <p className="text-sm font-medium">Vetting</p>
                  <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <ShieldCheck size={16} className={profile.is_vetted ? "text-primary" : ""} />
                    {profile.is_vetted ? "Vetted talent" : "Not vetted yet"}
                  </p>
                  <p className="mt-3 text-xs text-muted-foreground">
                    {profile.is_vetted
                      ? "You are prioritised for client projects."
                      : "Our team reviews profiles as roles come in."}
                  </p>
                </div>
              </div>

              <section>
                <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
                  <Sparkles size={18} className="text-primary" /> Your matches
                </h2>
                {matches.length ? (
                  <div className="space-y-4">
                    {matches.map((match) => (
                      <div key={match.id} className="rounded-lg border border-border bg-card p-5">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <h3 className="font-semibold">{match.talent_roles?.title ?? "Role"}</h3>
                            <p className="text-sm text-muted-foreground">{match.talent_roles?.company}</p>
                          </div>
                          <Badge variant={match.status === "accepted" ? "default" : "outline"}>
                            {match.status === "approved" ? `${match.score}% match` : match.status === "accepted" ? "You accepted" : "Declined"}
                          </Badge>
                        </div>
                        {match.reason && <p className="mt-3 text-sm text-muted-foreground">{match.reason}</p>}
                        {match.talent_roles && (
                          <p className="mt-2 text-xs text-muted-foreground">{formatBudget(match.talent_roles)}</p>
                        )}
                        <div className="mt-4 flex flex-wrap gap-2">
                          {match.talent_roles && (
                            <Link to={`/talent/roles/${match.talent_roles.slug}`}>
                              <Button size="sm" variant="outline">View role</Button>
                            </Link>
                          )}
                          {match.status === "approved" && (
                            <>
                              <Button size="sm" onClick={() => respond(match.id, "accepted")}>I am interested</Button>
                              <Button size="sm" variant="ghost" onClick={() => respond(match.id, "declined")}>Not for me</Button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground">
                    No matches yet. Every new role is scored against your profile, so keep it complete and current.
                  </div>
                )}
              </section>

              <section>
                <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
                  <Briefcase size={18} className="text-primary" /> Your applications
                </h2>
                {applications.length ? (
                  <div className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
                    {applications.map((app) => (
                      <div key={app.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                        <div>
                          <p className="font-medium">{app.talent_roles?.title ?? "Role"}</p>
                          <p className="text-xs text-muted-foreground">
                            {app.talent_roles?.company} · {new Date(app.created_at).toLocaleDateString("en-GB")}
                          </p>
                        </div>
                        <Badge variant="outline">{APPLICATION_STATUS_LABEL[app.status] ?? app.status}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground">
                    You have not applied to anything yet.{" "}
                    <Link to="/talent" className="text-primary hover:underline">Browse open roles</Link>.
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TalentDashboard;
