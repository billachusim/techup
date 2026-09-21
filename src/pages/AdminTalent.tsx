import { Helmet } from "react-helmet-async";
import { useCallback, useEffect, useState } from "react";
import { Link } from "@/lib/router-compat";
import { Loader2, Sparkles, Download, Check, X, Plus, MessageCircle, Wallet } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TalentNav from "@/components/talent/TalentNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useIsStaff } from "@/hooks/useIsStaff";
import {
  MATCH_STATUS_LABEL,
  APPLICATION_STATUS_LABEL,
  ENGAGEMENT_STATUS_LABEL,
  DELIVERABLE_STATUS_LABEL,
  ROLE_KIND_LABEL,
  formatMoney,
  parseList,
  slugify,
  contactUrl,
  type BusinessBrief,
  type TalentDeliverable,
  type TalentProfile,
  type TalentRole,
} from "@/lib/talent";

type MatchRow = {
  id: string; score: number; reason: string | null; status: string; source: string;
  role_id: string; talent_profile_id: string;
  talent_roles: { title: string; company: string } | null;
  talent_profiles: { full_name: string; city: string | null; skills: string[]; phone: string | null } | null;
};

type InterestRow = {
  id: string; talent_profile_id: string; requester_name: string; requester_org: string | null;
  requester_contact: string; message: string | null; source: string; status: string; created_at: string;
  talent_profiles: { full_name: string } | null;
};

type EngagementRow = {
  id: string; talent_profile_id: string; role_id: string | null; weekly_amount: number | null;
  currency: string; started_on: string; status: string; note: string | null;
  talent_roles: { title: string } | null;
  talent_profiles: { full_name: string } | null;
};

type ApplicationRow = {
  id: string; status: string; message: string | null; created_at: string;
  talent_roles: { title: string } | null;
  talent_profiles: { full_name: string; phone: string | null; email: string | null } | null;
};

type DeliverableRow = TalentDeliverable & {
  talent_roles: { title: string } | null;
  talent_profiles: { full_name: string } | null;
};

type ProjectDraft = { slack: string; task: string; drive: string; brief: string };

const emptyRole = {
  title: "", role_kind: "internal", company: "Tech Faculty", city: "", country: "Nigeria",
  is_remote: "true", employment_type: "full_time", summary: "", description: "",
  responsibilities: "", required_skills: "", nice_to_have: "", seniority: "mid",
  budget_min: "", budget_max: "", budget_currency: "NGN", budget_unit: "MONTH", openings: "1",
};

const AdminTalent = () => {
  const { loading: roleLoading, isStaff } = useIsStaff();
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<TalentRole[]>([]);
  const [talents, setTalents] = useState<TalentProfile[]>([]);
  const [matches, setMatches] = useState<MatchRow[]>([]);
  const [applications, setApplications] = useState<ApplicationRow[]>([]);
  const [briefs, setBriefs] = useState<BusinessBrief[]>([]);
  const [engagements, setEngagements] = useState<EngagementRow[]>([]);
  const [interests, setInterests] = useState<InterestRow[]>([]);
  const [newRole, setNewRole] = useState(emptyRole);
  const [creating, setCreating] = useState(false);
  const [matchingRoleId, setMatchingRoleId] = useState<string | null>(null);
  const [manualRole, setManualRole] = useState("");
  const [manualTalent, setManualTalent] = useState("");
  const [groupDrafts, setGroupDrafts] = useState<Record<string, string>>({});
  const [projectDrafts, setProjectDrafts] = useState<Record<string, ProjectDraft>>({});
  const [deliverables, setDeliverables] = useState<DeliverableRow[]>([]);
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});
  const [newEngagement, setNewEngagement] = useState({ talent: "", role: "", amount: "", currency: "NGN", note: "" });

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setSignedIn(Boolean(data.user)));
  }, []);

  const load = useCallback(async () => {
    const [r, t, m, a, b, e, i, d] = await Promise.all([
      supabase.from("talent_roles").select("*").order("created_at", { ascending: false }),
      supabase.from("talent_profiles").select("*").order("profile_strength", { ascending: false }),
      supabase
        .from("role_matches")
        .select("id, score, reason, status, source, role_id, talent_profile_id, talent_roles(title, company), talent_profiles(full_name, city, skills, phone)")
        .order("score", { ascending: false }),
      supabase
        .from("talent_applications")
        .select("id, status, message, created_at, talent_roles(title), talent_profiles(full_name, phone, email)")
        .order("created_at", { ascending: false }),
      supabase.from("business_briefs").select("*").order("created_at", { ascending: false }),
      supabase
        .from("talent_engagements")
        .select("id, talent_profile_id, role_id, weekly_amount, currency, started_on, status, note, talent_roles(title), talent_profiles(full_name)")
        .order("started_on", { ascending: false }),
      supabase
        .from("talent_interest_requests")
        .select("*, talent_profiles(full_name)")
        .order("created_at", { ascending: false }),
      supabase
        .from("talent_deliverables")
        .select("*, talent_roles(title), talent_profiles(full_name)")
        .order("week_of", { ascending: false }),
    ]);
    setRoles(r.data ?? []);
    setTalents(t.data ?? []);
    setMatches((m.data ?? []) as MatchRow[]);
    setApplications((a.data ?? []) as ApplicationRow[]);
    setBriefs(b.data ?? []);
    setEngagements((e.data ?? []) as EngagementRow[]);
    setInterests((i.data ?? []) as InterestRow[]);
    setDeliverables((d.data ?? []) as DeliverableRow[]);
    setGroupDrafts(Object.fromEntries((r.data ?? []).map((role) => [role.id, role.whatsapp_group_url ?? ""])));
    setProjectDrafts(
      Object.fromEntries(
        (r.data ?? []).map((role) => [
          role.id,
          {
            slack: role.slack_channel_url ?? "",
            task: role.task_board_url ?? "",
            drive: role.drive_url ?? "",
            brief: role.project_brief ?? "",
          } satisfies ProjectDraft,
        ])
      )
    );
    setNoteDrafts(Object.fromEntries((d.data ?? []).map((row) => [row.id, row.reviewer_note ?? ""])));
    setLoading(false);
  }, []);

  useEffect(() => { if (isStaff) load(); else if (!roleLoading) setLoading(false); }, [isStaff, roleLoading, load]);

  const createRole = async () => {
    if (!newRole.title.trim() || !newRole.summary.trim() || !newRole.description.trim()) {
      toast({ title: "Title, summary and description are required", variant: "destructive" });
      return;
    }
    setCreating(true);
    try {
      const { data: auth } = await supabase.auth.getUser();
      const { error } = await supabase.from("talent_roles").insert({
        slug: `${slugify(newRole.title)}-${Date.now().toString().slice(-4)}`,
        title: newRole.title.trim(),
        role_kind: newRole.role_kind,
        company: newRole.company.trim() || "Tech Faculty",
        city: newRole.city.trim() || null,
        country: newRole.country.trim() || "Nigeria",
        is_remote: newRole.is_remote === "true",
        employment_type: newRole.employment_type,
        summary: newRole.summary.trim(),
        description: newRole.description.trim(),
        responsibilities: parseList(newRole.responsibilities),
        required_skills: parseList(newRole.required_skills),
        nice_to_have: parseList(newRole.nice_to_have),
        seniority: newRole.seniority,
        budget_min: newRole.budget_min ? Number(newRole.budget_min) : null,
        budget_max: newRole.budget_max ? Number(newRole.budget_max) : null,
        budget_currency: newRole.budget_currency,
        budget_unit: newRole.budget_unit,
        openings: Number(newRole.openings) || 1,
        status: "draft",
        created_by: auth.user?.id ?? null,
      });
      if (error) throw error;
      toast({ title: "Role created as a draft", description: "Publish it when you are ready." });
      setNewRole(emptyRole);
      load();
    } catch (err) {
      toast({ title: "Could not create the role", description: err instanceof Error ? err.message : "", variant: "destructive" });
    } finally {
      setCreating(false);
    }
  };

  const setRoleStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("talent_roles").update({ status }).eq("id", id);
    if (error) { toast({ title: "Update failed", description: error.message, variant: "destructive" }); return; }
    load();
  };

  const runMatching = async (roleId: string) => {
    setMatchingRoleId(roleId);
    try {
      const { data, error } = await supabase.functions.invoke("match-talent", { body: { role_id: roleId } });
      if (error) throw error;
      const created = (data as { created?: number } | null)?.created ?? 0;
      toast({
        title: created ? `${created} suggested matches ready` : "No new matches",
        description: created ? "Review them in the Matches tab and approve the good ones." : "Everyone suitable has already been matched to this role.",
      });
      load();
    } catch (err) {
      toast({ title: "Matching failed", description: err instanceof Error ? err.message : "Please try again.", variant: "destructive" });
    } finally {
      setMatchingRoleId(null);
    }
  };

  const setMatchStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("role_matches").update({ status }).eq("id", id);
    if (error) { toast({ title: "Update failed", description: error.message, variant: "destructive" }); return; }
    load();
  };

  const addManualMatch = async () => {
    if (!manualRole || !manualTalent) {
      toast({ title: "Pick a role and a talent", variant: "destructive" });
      return;
    }
    const { data: auth } = await supabase.auth.getUser();
    const { error } = await supabase.from("role_matches").insert({
      role_id: manualRole,
      talent_profile_id: manualTalent,
      score: 100,
      reason: "Matched by the Tech Faculty team.",
      status: "approved",
      source: "manual",
      created_by: auth.user?.id ?? null,
    });
    if (error) {
      toast({ title: "Could not add the match", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Match added and shared with the talent" });
    setManualRole(""); setManualTalent("");
    load();
  };

  const toggleVetted = async (talent: TalentProfile) => {
    const { error } = await supabase
      .from("talent_profiles")
      .update({ is_vetted: !talent.is_vetted, vetted_at: talent.is_vetted ? null : new Date().toISOString() })
      .eq("id", talent.id);
    if (error) { toast({ title: "Update failed", description: error.message, variant: "destructive" }); return; }
    load();
  };

  const toggleProfileFlag = async (talent: TalentProfile, field: "is_client_interested" | "is_public") => {
    const update =
      field === "is_client_interested"
        ? { is_client_interested: !talent.is_client_interested }
        : { is_public: !talent.is_public };
    const { error } = await supabase.from("talent_profiles").update(update).eq("id", talent.id);
    if (error) { toast({ title: "Update failed", description: error.message, variant: "destructive" }); return; }
    load();
  };

  const approveTalent = async (talent: TalentProfile) => {
    const { data, error } = await supabase.rpc("approve_talent", { _talent_id: talent.id });
    if (error) { toast({ title: "Could not approve", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Approved as talent", description: data ? `Faculty ID ${data}` : "Faculty ID issued." });
    load();
  };

  const issueFacultyId = async (talent: TalentProfile) => {
    const { data, error } = await supabase.rpc("issue_talent_faculty_id", { _talent_id: talent.id });
    if (error) { toast({ title: "Could not issue a Faculty ID", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Faculty ID issued", description: String(data ?? "") });
    load();
  };

  const saveGroupUrl = async (roleId: string) => {
    const value = (groupDrafts[roleId] ?? "").trim();
    const { error } = await supabase.from("talent_roles").update({ whatsapp_group_url: value || null }).eq("id", roleId);
    if (error) { toast({ title: "Could not save the group link", description: error.message, variant: "destructive" }); return; }
    toast({ title: value ? "Group link saved" : "Group link removed", description: "Only matched talent and staff can see it." });
    load();
  };

  const saveProjectLinks = async (roleId: string) => {
    const draft = projectDrafts[roleId] ?? { slack: "", task: "", drive: "", brief: "" };
    const { error } = await supabase
      .from("talent_roles")
      .update({
        slack_channel_url: draft.slack.trim() || null,
        task_board_url: draft.task.trim() || null,
        drive_url: draft.drive.trim() || null,
        project_brief: draft.brief.trim() || null,
      })
      .eq("id", roleId);
    if (error) { toast({ title: "Could not save the project links", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Project workspace saved", description: "Only selected talent and staff can see these links." });
    load();
  };

  const toggleApplications = async (role: TalentRole) => {
    const { error } = await supabase
      .from("talent_roles")
      .update({ applications_closed: !role.applications_closed })
      .eq("id", role.id);
    if (error) { toast({ title: "Update failed", description: error.message, variant: "destructive" }); return; }
    load();
  };

  const reviewDeliverable = async (id: string, status: string) => {
    const { error } = await supabase
      .from("talent_deliverables")
      .update({ status, reviewer_note: (noteDrafts[id] ?? "").trim() || null })
      .eq("id", id);
    if (error) { toast({ title: "Update failed", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Review saved" });
    load();
  };

  const addEngagement = async () => {
    if (!newEngagement.talent) { toast({ title: "Pick the talent", variant: "destructive" }); return; }
    const { data: auth } = await supabase.auth.getUser();
    const { error } = await supabase.from("talent_engagements").insert({
      talent_profile_id: newEngagement.talent,
      role_id: newEngagement.role || null,
      weekly_amount: newEngagement.amount ? Number(newEngagement.amount) : null,
      currency: newEngagement.currency,
      note: newEngagement.note.trim() || null,
      created_by: auth.user?.id ?? null,
    });
    if (error) { toast({ title: "Could not save the engagement", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Engagement recorded", description: "The talent now sees their weekly pay on their dashboard." });
    setNewEngagement({ talent: "", role: "", amount: "", currency: "NGN", note: "" });
    load();
  };

  const setInterestStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("talent_interest_requests").update({ status }).eq("id", id);
    if (error) { toast({ title: "Update failed", description: error.message, variant: "destructive" }); return; }
    load();
  };

  const setEngagementStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("talent_engagements").update({ status }).eq("id", id);
    if (error) { toast({ title: "Update failed", description: error.message, variant: "destructive" }); return; }
    load();
  };

  const openCv = async (path: string | null) => {
    if (!path) return;
    const { data, error } = await supabase.storage.from("talent-cvs").createSignedUrl(path, 300);
    if (error || !data) { toast({ title: "Could not open the CV", description: error?.message, variant: "destructive" }); return; }
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  };

  const setBriefStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("business_briefs").update({ status }).eq("id", id);
    if (error) { toast({ title: "Update failed", description: error.message, variant: "destructive" }); return; }
    load();
  };

  const setApplicationStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("talent_applications").update({ status }).eq("id", id);
    if (error) { toast({ title: "Update failed", description: error.message, variant: "destructive" }); return; }
    load();
  };

  if (roleLoading || signedIn === null) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto max-w-4xl px-4 pt-28">
          <Loader2 className="mx-auto animate-spin text-muted-foreground" />
        </main>
      </div>
    );
  }

  if (!isStaff) {
    return (
      <div className="min-h-screen bg-background">
        <Helmet>
          <title>Talent admin | Tech Faculty</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <Header />
        <main className="container mx-auto max-w-lg px-4 pb-20 pt-28 text-center">
          <h1 className="text-2xl font-bold">Staff access only</h1>
          <p className="mt-3 text-muted-foreground">
            {signedIn
              ? "This account does not have talent admin access. Ask the owner to grant it."
              : "Sign in with a staff account to manage roles, talent and matches."}
          </p>
          {!signedIn && (
            <Link to="/login?next=/admin/talent" className="mt-6 inline-block">
              <Button>Sign in</Button>
            </Link>
          )}
        </main>
        <Footer />
      </div>
    );
  }

  const suggested = matches.filter((m) => m.status === "suggested");
  const decided = matches.filter((m) => m.status !== "suggested");

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Talent admin | Tech Faculty</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Header />

      <main className="pt-20">
        <TalentNav />
        <div className="container mx-auto max-w-6xl px-4 py-12">
          <h1 className="text-3xl font-bold">Talent admin</h1>
          <p className="mt-1 text-muted-foreground">Add roles, review talent, approve matches and read business briefs.</p>

          {loading ? (
            <Loader2 className="mx-auto mt-12 animate-spin text-muted-foreground" />
          ) : (
            <Tabs defaultValue="roles" className="mt-8">
              <TabsList className="flex-wrap">
                <TabsTrigger value="roles">Roles ({roles.length})</TabsTrigger>
                <TabsTrigger value="talent">Talent ({talents.length})</TabsTrigger>
                <TabsTrigger value="matches">Matches ({suggested.length})</TabsTrigger>
                <TabsTrigger value="applications">Applications ({applications.length})</TabsTrigger>
                <TabsTrigger value="briefs">Briefs ({briefs.filter((b) => b.status === "new").length})</TabsTrigger>
                <TabsTrigger value="interest">Interest ({interests.filter((i) => i.status === "new").length})</TabsTrigger>
                <TabsTrigger value="pay">Work &amp; pay ({engagements.filter((e) => e.status === "active").length})</TabsTrigger>
                <TabsTrigger value="logs">Work logs ({deliverables.filter((d) => d.status === "submitted").length})</TabsTrigger>
              </TabsList>

              {/* ROLES */}
              <TabsContent value="roles" className="space-y-8 pt-6">
                <section className="rounded-lg border border-border bg-card p-6">
                  <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold"><Plus size={18} /> Add a role</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label>Title</Label>
                      <Input value={newRole.title} onChange={(e) => setNewRole({ ...newRole, title: e.target.value })} />
                    </div>
                    <div>
                      <Label>Company</Label>
                      <Input value={newRole.company} onChange={(e) => setNewRole({ ...newRole, company: e.target.value })} />
                    </div>
                    <div>
                      <Label>Kind</Label>
                      <Select value={newRole.role_kind} onValueChange={(v) => setNewRole({ ...newRole, role_kind: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="internal">Tech Faculty role</SelectItem>
                          <SelectItem value="partner">Partner role</SelectItem>
                          <SelectItem value="client">Client project</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Type</Label>
                      <Select value={newRole.employment_type} onValueChange={(v) => setNewRole({ ...newRole, employment_type: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full_time">Full-time</SelectItem>
                          <SelectItem value="part_time">Part-time</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                          <SelectItem value="internship">Internship</SelectItem>
                          <SelectItem value="freelance">Freelance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>City</Label>
                      <Input value={newRole.city} onChange={(e) => setNewRole({ ...newRole, city: e.target.value })} />
                    </div>
                    <div>
                      <Label>Remote?</Label>
                      <Select value={newRole.is_remote} onValueChange={(v) => setNewRole({ ...newRole, is_remote: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Remote friendly</SelectItem>
                          <SelectItem value="false">On-site</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Seniority</Label>
                      <Select value={newRole.seniority} onValueChange={(v) => setNewRole({ ...newRole, seniority: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="entry">Entry level</SelectItem>
                          <SelectItem value="mid">Mid level</SelectItem>
                          <SelectItem value="senior">Senior</SelectItem>
                          <SelectItem value="lead">Lead</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Openings</Label>
                      <Input type="number" min="1" value={newRole.openings} onChange={(e) => setNewRole({ ...newRole, openings: e.target.value })} />
                    </div>
                    <div>
                      <Label>Pay from</Label>
                      <Input type="number" value={newRole.budget_min} onChange={(e) => setNewRole({ ...newRole, budget_min: e.target.value })} />
                    </div>
                    <div>
                      <Label>Pay to</Label>
                      <Input type="number" value={newRole.budget_max} onChange={(e) => setNewRole({ ...newRole, budget_max: e.target.value })} />
                    </div>
                    <div>
                      <Label>Currency</Label>
                      <Select value={newRole.budget_currency} onValueChange={(v) => setNewRole({ ...newRole, budget_currency: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NGN">Naira</SelectItem>
                          <SelectItem value="USD">US Dollar</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Pay period</Label>
                      <Select value={newRole.budget_unit} onValueChange={(v) => setNewRole({ ...newRole, budget_unit: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MONTH">Per month</SelectItem>
                          <SelectItem value="WEEK">Per week</SelectItem>
                          <SelectItem value="HOUR">Per hour</SelectItem>
                          <SelectItem value="PROJECT">Per project</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="mt-4 space-y-4">
                    <div>
                      <Label>One-line summary</Label>
                      <Input value={newRole.summary} onChange={(e) => setNewRole({ ...newRole, summary: e.target.value })} />
                    </div>
                    <div>
                      <Label>Full description</Label>
                      <Textarea rows={4} value={newRole.description} onChange={(e) => setNewRole({ ...newRole, description: e.target.value })} />
                    </div>
                    <div>
                      <Label>Responsibilities (one per line)</Label>
                      <Textarea rows={3} value={newRole.responsibilities} onChange={(e) => setNewRole({ ...newRole, responsibilities: e.target.value })} />
                    </div>
                    <div>
                      <Label>Required skills (comma separated)</Label>
                      <Input value={newRole.required_skills} onChange={(e) => setNewRole({ ...newRole, required_skills: e.target.value })} />
                    </div>
                    <div>
                      <Label>Nice to have (comma separated)</Label>
                      <Input value={newRole.nice_to_have} onChange={(e) => setNewRole({ ...newRole, nice_to_have: e.target.value })} />
                    </div>
                    <Button onClick={createRole} disabled={creating}>{creating ? "Saving…" : "Create draft role"}</Button>
                  </div>
                </section>

                <section className="space-y-3">
                  {roles.map((role) => {
                    const roleMatches = matches.filter((m) => m.role_id === role.id);
                    const count = (statuses: string[]) => roleMatches.filter((m) => statuses.includes(m.status)).length;
                    return (
                      <div key={role.id} className="space-y-3 rounded-lg border border-border bg-card p-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="font-medium">{role.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {ROLE_KIND_LABEL[role.role_kind]} · {role.company} · {role.city ?? "Anywhere"} ·{" "}
                              <Badge variant="outline" className="ml-1">{role.status}</Badge>
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {count(["approved", "accepted", "assessment", "interview", "hired"])} matched ·{" "}
                              {count(["accepted"])} accepted · {count(["assessment"])} in assessment ·{" "}
                              {count(["interview"])} in interview · {count(["hired"])} hired
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Button size="sm" variant="outline" onClick={() => runMatching(role.id)} disabled={matchingRoleId === role.id}>
                              {matchingRoleId === role.id ? <Loader2 size={14} className="mr-1.5 animate-spin" /> : <Sparkles size={14} className="mr-1.5" />}
                              Run AI matching
                            </Button>
                            {role.status !== "published" ? (
                              <Button size="sm" onClick={() => setRoleStatus(role.id, "published")}>Publish</Button>
                            ) : (
                              <Button size="sm" variant="ghost" onClick={() => setRoleStatus(role.id, "closed")}>Close</Button>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-wrap items-end gap-2">
                          <div className="min-w-[16rem] flex-1">
                            <Label className="text-xs">Project WhatsApp group link (matched talent only)</Label>
                            <Input
                              className="mt-1"
                              placeholder="https://chat.whatsapp.com/…"
                              value={groupDrafts[role.id] ?? ""}
                              onChange={(e) => setGroupDrafts({ ...groupDrafts, [role.id]: e.target.value })}
                            />
                          </div>
                          <Button size="sm" variant="outline" onClick={() => saveGroupUrl(role.id)}>Save link</Button>
                        </div>
                        <div className="grid gap-3 border-t border-border pt-3 sm:grid-cols-3">
                          <div>
                            <Label className="text-xs">Slack channel link</Label>
                            <Input
                              className="mt-1"
                              placeholder="https://slack.com/…"
                              value={projectDrafts[role.id]?.slack ?? ""}
                              onChange={(e) => setProjectDrafts({ ...projectDrafts, [role.id]: { ...(projectDrafts[role.id] ?? { slack: "", task: "", drive: "", brief: "" }), slack: e.target.value } })}
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Task board link</Label>
                            <Input
                              className="mt-1"
                              placeholder="https://…"
                              value={projectDrafts[role.id]?.task ?? ""}
                              onChange={(e) => setProjectDrafts({ ...projectDrafts, [role.id]: { ...(projectDrafts[role.id] ?? { slack: "", task: "", drive: "", brief: "" }), task: e.target.value } })}
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Shared files link</Label>
                            <Input
                              className="mt-1"
                              placeholder="https://drive.google.com/…"
                              value={projectDrafts[role.id]?.drive ?? ""}
                              onChange={(e) => setProjectDrafts({ ...projectDrafts, [role.id]: { ...(projectDrafts[role.id] ?? { slack: "", task: "", drive: "", brief: "" }), drive: e.target.value } })}
                            />
                          </div>
                          <div className="sm:col-span-3">
                            <Label className="text-xs">Project brief selected talent will see</Label>
                            <Textarea
                              className="mt-1"
                              rows={2}
                              value={projectDrafts[role.id]?.brief ?? ""}
                              onChange={(e) => setProjectDrafts({ ...projectDrafts, [role.id]: { ...(projectDrafts[role.id] ?? { slack: "", task: "", drive: "", brief: "" }), brief: e.target.value } })}
                            />
                          </div>
                          <div className="flex flex-wrap items-center gap-2 sm:col-span-3">
                            <Button size="sm" variant="outline" onClick={() => saveProjectLinks(role.id)}>Save project workspace</Button>
                            <Button size="sm" variant="ghost" onClick={() => toggleApplications(role)}>
                              {role.applications_closed ? "Reopen applications" : "Close applications"}
                            </Button>
                            {role.applications_closed && <Badge variant="outline">Applications closed</Badge>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </section>
              </TabsContent>

              {/* TALENT */}
              <TabsContent value="talent" className="space-y-3 pt-6">
                {talents.length === 0 && (
                  <p className="rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground">
                    No talent profiles yet. Share techfaculty.ng/talent in the WhatsApp group.
                  </p>
                )}
                {talents.map((t) => (
                  <div key={t.id} className="rounded-lg border border-border bg-card p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">
                          {t.full_name} {t.is_vetted && <Badge className="ml-1">Vetted</Badge>}
                          {t.is_client_interested && <Badge variant="secondary" className="ml-1">Client interested</Badge>}
                          {!t.is_public && <Badge variant="outline" className="ml-1">Hidden</Badge>}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t.faculty_id ? `${t.faculty_id} · ` : ""}
                          {[t.city, t.country].filter(Boolean).join(", ")} · {t.phone} · strength {t.profile_strength}% ·{" "}
                          {t.availability === "open" ? "open to work" : "unavailable"}
                        </p>
                        {t.skills.length > 0 && (
                          <p className="mt-1 text-xs text-muted-foreground">{t.skills.join(", ")}</p>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {t.cv_path && (
                          <Button size="sm" variant="outline" onClick={() => openCv(t.cv_path)}>
                            <Download size={14} className="mr-1.5" /> CV
                          </Button>
                        )}
                        {(t.whatsapp || t.phone) && (
                          <a href={contactUrl(t.whatsapp || t.phone, t.full_name)} target="_blank" rel="noopener noreferrer">
                            <Button size="sm" variant="outline"><MessageCircle size={14} className="mr-1.5" /> Message</Button>
                          </a>
                        )}
                        {!t.faculty_id && (
                          <Button size="sm" onClick={() => approveTalent(t)}>Approve &amp; issue Faculty ID</Button>
                        )}
                        {!t.faculty_id && t.is_vetted && (
                          <Button size="sm" variant="outline" onClick={() => issueFacultyId(t)}>Issue Faculty ID only</Button>
                        )}
                        <Button size="sm" variant={t.is_vetted ? "ghost" : "default"} onClick={() => toggleVetted(t)}>
                          {t.is_vetted ? "Remove vetted" : "Mark vetted"}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => toggleProfileFlag(t, "is_client_interested")}>
                          {t.is_client_interested ? "Clear client interest" : "Mark client interested"}
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => toggleProfileFlag(t, "is_public")}>
                          {t.is_public ? "Hide from directory" : "Show in directory"}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>

              {/* MATCHES */}
              <TabsContent value="matches" className="space-y-6 pt-6">
                <section className="rounded-lg border border-border bg-card p-5">
                  <h2 className="mb-3 text-lg font-semibold">Match someone manually</h2>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <Select value={manualRole} onValueChange={setManualRole}>
                      <SelectTrigger><SelectValue placeholder="Role" /></SelectTrigger>
                      <SelectContent>
                        {roles.map((r) => <SelectItem key={r.id} value={r.id}>{r.title}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Select value={manualTalent} onValueChange={setManualTalent}>
                      <SelectTrigger><SelectValue placeholder="Talent" /></SelectTrigger>
                      <SelectContent>
                        {talents.map((t) => <SelectItem key={t.id} value={t.id}>{t.full_name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Button onClick={addManualMatch}>Add match</Button>
                  </div>
                </section>

                <section>
                  <h2 className="mb-3 text-lg font-semibold">Awaiting your review ({suggested.length})</h2>
                  <div className="space-y-3">
                    {suggested.length === 0 && (
                      <p className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
                        Nothing waiting. Use “Run AI matching” on a role to generate suggestions.
                      </p>
                    )}
                    {suggested.map((m) => (
                      <div key={m.id} className="rounded-lg border border-border bg-card p-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="font-medium">
                              {m.talent_profiles?.full_name} → {m.talent_roles?.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {m.score}% · {m.talent_profiles?.city} · {m.talent_profiles?.skills?.slice(0, 5).join(", ")}
                            </p>
                            {m.reason && <p className="mt-2 text-sm text-muted-foreground">{m.reason}</p>}
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => setMatchStatus(m.id, "approved")}>
                              <Check size={14} className="mr-1.5" /> Approve
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setMatchStatus(m.id, "declined")}>
                              <X size={14} className="mr-1.5" /> Decline
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h2 className="mb-3 text-lg font-semibold">Decided ({decided.length})</h2>
                  <div className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
                    {decided.map((m) => (
                      <div key={m.id} className="flex flex-wrap items-center justify-between gap-2 p-3 text-sm">
                        <span>{m.talent_profiles?.full_name} → {m.talent_roles?.title}</span>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="outline">{MATCH_STATUS_LABEL[m.status] ?? m.status}</Badge>
                          {m.talent_profiles?.phone && (
                            <a href={contactUrl(m.talent_profiles.phone, m.talent_profiles.full_name)} target="_blank" rel="noopener noreferrer">
                              <Button size="sm" variant="outline"><MessageCircle size={14} className="mr-1.5" /> Message</Button>
                            </a>
                          )}
                          <Select value={m.status} onValueChange={(v) => setMatchStatus(m.id, v)}>
                            <SelectTrigger className="h-8 w-[11rem]"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="approved">Shared with talent</SelectItem>
                              <SelectItem value="accepted">Talent accepted</SelectItem>
                              <SelectItem value="assessment">In assessment</SelectItem>
                              <SelectItem value="interview">In interview</SelectItem>
                              <SelectItem value="hired">Hired</SelectItem>
                              <SelectItem value="declined">Declined</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </TabsContent>

              {/* APPLICATIONS */}
              <TabsContent value="applications" className="space-y-3 pt-6">
                {applications.length === 0 && (
                  <p className="rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground">
                    No applications yet.
                  </p>
                )}
                {applications.map((app) => (
                  <div key={app.id} className="rounded-lg border border-border bg-card p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">{app.talent_profiles?.full_name} → {app.talent_roles?.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {app.talent_profiles?.phone} · {new Date(app.created_at).toLocaleDateString("en-GB")}
                        </p>
                        {app.message && <p className="mt-2 text-sm text-muted-foreground">{app.message}</p>}
                      </div>
                      <Select value={app.status} onValueChange={(v) => setApplicationStatus(app.id, v)}>
                        <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {Object.entries(APPLICATION_STATUS_LABEL).map(([value, label]) => (
                            <SelectItem key={value} value={value}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </TabsContent>

              {/* BRIEFS */}
              <TabsContent value="briefs" className="space-y-3 pt-6">
                {briefs.length === 0 && (
                  <p className="rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground">
                    No business briefs yet. Share techfaculty.ng/hire with prospects.
                  </p>
                )}
                {briefs.map((b) => (
                  <div key={b.id} className="rounded-lg border border-border bg-card p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">{b.project_title}</p>
                        <p className="text-xs text-muted-foreground">
                          {b.company} · {b.contact_name} · {b.phone} · {[b.city, b.country].filter(Boolean).join(", ")}
                        </p>
                        <p className="mt-2 text-sm text-muted-foreground">{b.description}</p>
                        <p className="mt-2 text-xs text-muted-foreground">
                          {b.skills_needed.join(", ")}{b.budget_text ? ` · budget ${b.budget_text}` : ""}{b.timeline ? ` · ${b.timeline}` : ""}
                        </p>
                      </div>
                      <Select value={b.status} onValueChange={(v) => setBriefStatus(b.id, v)}>
                        <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="reviewing">Reviewing</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="rejected">Not a fit</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </TabsContent>

              {/* INTEREST REQUESTS */}
              <TabsContent value="interest" className="space-y-3 pt-6">
                {interests.length === 0 && (
                  <p className="rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground">
                    No introduction requests yet. They arrive automatically from the public talent directory.
                  </p>
                )}
                {interests.map((i) => (
                  <div key={i.id} className="rounded-lg border border-border bg-card p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">
                          {i.requester_name}
                          {i.requester_org ? ` · ${i.requester_org}` : ""} → {i.talent_profiles?.full_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {i.requester_contact} · {new Date(i.created_at).toLocaleString("en-GB")} · from {i.source}
                        </p>
                        {i.message && <p className="mt-2 text-sm text-muted-foreground">{i.message}</p>}
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <a href={contactUrl(i.requester_contact, i.requester_name)} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" variant="outline"><MessageCircle size={14} className="mr-1.5" /> Message</Button>
                        </a>
                        <Select value={i.status} onValueChange={(v) => setInterestStatus(i.id, v)}>
                          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="contacted">Contacted</SelectItem>
                            <SelectItem value="introduced">Introduced</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>

              {/* WORK & PAY */}
              <TabsContent value="pay" className="space-y-6 pt-6">
                <section className="rounded-lg border border-border bg-card p-5">
                  <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold"><Wallet size={18} /> Record someone as working</h2>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Select value={newEngagement.talent} onValueChange={(v) => setNewEngagement({ ...newEngagement, talent: v })}>
                      <SelectTrigger><SelectValue placeholder="Talent" /></SelectTrigger>
                      <SelectContent>
                        {talents.map((t) => <SelectItem key={t.id} value={t.id}>{t.full_name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Select value={newEngagement.role} onValueChange={(v) => setNewEngagement({ ...newEngagement, role: v })}>
                      <SelectTrigger><SelectValue placeholder="Project (optional)" /></SelectTrigger>
                      <SelectContent>
                        {roles.map((r) => <SelectItem key={r.id} value={r.id}>{r.title}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <div>
                      <Label>Weekly pay</Label>
                      <Input
                        type="number"
                        value={newEngagement.amount}
                        onChange={(e) => setNewEngagement({ ...newEngagement, amount: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Currency</Label>
                      <Select value={newEngagement.currency} onValueChange={(v) => setNewEngagement({ ...newEngagement, currency: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NGN">NGN</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="sm:col-span-2">
                      <Label>Note the talent will see (optional)</Label>
                      <Input value={newEngagement.note} onChange={(e) => setNewEngagement({ ...newEngagement, note: e.target.value })} />
                    </div>
                  </div>
                  <Button className="mt-4" onClick={addEngagement}>Save</Button>
                </section>

                <section className="space-y-3">
                  {engagements.length === 0 && (
                    <p className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
                      Nobody is recorded as working yet.
                    </p>
                  )}
                  {engagements.map((e) => (
                    <div key={e.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-4">
                      <div>
                        <p className="font-medium">{e.talent_profiles?.full_name} · {e.talent_roles?.title ?? "Project"}</p>
                        <p className="text-xs text-muted-foreground">
                          Started {new Date(e.started_on).toLocaleDateString("en-GB")} ·{" "}
                          {e.weekly_amount != null ? `${formatMoney(Number(e.weekly_amount), e.currency)} / week` : "pay being agreed"}
                          {e.note ? ` · ${e.note}` : ""}
                        </p>
                      </div>
                      <Select value={e.status} onValueChange={(v) => setEngagementStatus(e.id, v)}>
                        <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {Object.entries(ENGAGEMENT_STATUS_LABEL).map(([value, label]) => (
                            <SelectItem key={value} value={value}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </section>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminTalent;
