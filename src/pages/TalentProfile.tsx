import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "@/lib/router-compat";
import { Loader2, Upload, FileCheck2, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TalentNav from "@/components/talent/TalentNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SKILL_SUGGESTIONS, parseList, profileStrength } from "@/lib/talent";

type FormState = {
  full_name: string;
  email: string;
  phone: string;
  whatsapp: string;
  city: string;
  country: string;
  headline: string;
  bio: string;
  linkedin_url: string;
  github_url: string;
  portfolio_url: string;
  intro_video_url: string;
  skills: string[];
  tools: string;
  years_experience: string;
  hours_per_week: string;
  work_mode: string;
  rate_amount: string;
  rate_currency: string;
  availability: string;
  cv_path: string | null;
};

const empty: FormState = {
  full_name: "", email: "", phone: "", whatsapp: "", city: "", country: "Nigeria",
  headline: "", bio: "", linkedin_url: "", github_url: "", portfolio_url: "", intro_video_url: "",
  skills: [], tools: "", years_experience: "", hours_per_week: "", work_mode: "remote",
  rate_amount: "", rate_currency: "NGN", availability: "open", cv_path: null,
};

const TalentProfile = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const nextPath = params.get("next");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState<FormState>(empty);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [facultyId, setFacultyId] = useState<string | null>(null);
  const [skillInput, setSkillInput] = useState("");

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  useEffect(() => {
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) {
        navigate("/login?next=/talent/profile", { replace: true });
        return;
      }
      const [{ data: existing }, { data: account }] = await Promise.all([
        supabase.from("talent_profiles").select("*").eq("user_id", auth.user.id).maybeSingle(),
        supabase.from("profiles").select("faculty_id, name, email, phone, department").eq("id", auth.user.id).maybeSingle(),
      ]);
      let profile = existing;
      // Someone we added to the pool before they had an account: claim it by email.
      if (!profile) {
        const { data: claimedId } = await supabase.rpc("claim_my_talent_profile");
        if (claimedId) {
          profile = (await supabase.from("talent_profiles").select("*").eq("id", claimedId).maybeSingle()).data;
          if (profile) toast({ title: "We found your existing talent profile", description: "It is now linked to this account." });
        }
      }
      setFacultyId(profile?.faculty_id ?? account?.faculty_id ?? null);
      if (profile) {
        setProfileId(profile.id);
        setForm({
          full_name: profile.full_name ?? "",
          email: profile.email ?? auth.user.email ?? "",
          phone: profile.phone ?? "",
          whatsapp: profile.whatsapp ?? "",
          city: profile.city ?? "",
          country: profile.country ?? "Nigeria",
          headline: profile.headline ?? "",
          bio: profile.bio ?? "",
          linkedin_url: profile.linkedin_url ?? "",
          github_url: profile.github_url ?? "",
          portfolio_url: profile.portfolio_url ?? "",
          intro_video_url: profile.intro_video_url ?? "",
          skills: profile.skills ?? [],
          tools: (profile.tools ?? []).join(", "),
          years_experience: profile.years_experience?.toString() ?? "",
          hours_per_week: profile.hours_per_week?.toString() ?? "",
          work_mode: profile.work_mode ?? "remote",
          rate_amount: profile.rate_amount?.toString() ?? "",
          rate_currency: profile.rate_currency ?? "NGN",
          availability: profile.availability ?? "open",
          cv_path: profile.cv_path,
        });
      } else {
        setForm({
          ...empty,
          full_name: account?.name ?? "",
          email: account?.email ?? auth.user.email ?? "",
          phone: account?.phone ?? "",
          whatsapp: account?.phone ?? "",
          skills: account?.department ? [account.department] : [],
        });
      }
      setLoading(false);
    })();
  }, [navigate]);

  const strength = profileStrength({
    full_name: form.full_name,
    city: form.city,
    phone: form.phone,
    skills: form.skills,
    cv_path: form.cv_path,
    headline: form.headline,
    bio: form.bio,
    linkedin_url: form.linkedin_url,
    github_url: form.github_url,
    portfolio_url: form.portfolio_url,
    years_experience: form.years_experience ? Number(form.years_experience) : null,
    hours_per_week: form.hours_per_week ? Number(form.hours_per_week) : null,
    rate_amount: form.rate_amount ? Number(form.rate_amount) : null,
  });

  const addSkill = (skill: string) => {
    const clean = skill.trim();
    if (!clean) return;
    if (form.skills.some((s) => s.toLowerCase() === clean.toLowerCase())) return;
    set("skills", [...form.skills, clean].slice(0, 25));
  };

  const uploadCv = async (file: File) => {
    setUploading(true);
    try {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) throw new Error("Please sign in again.");
      if (file.size > 10 * 1024 * 1024) throw new Error("Please keep your CV under 10MB.");
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "pdf";
      const path = `${auth.user.id}/cv-${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("talent-cvs").upload(path, file, { upsert: true });
      if (error) throw error;
      set("cv_path", path);
      toast({ title: "CV uploaded", description: "Remember to save your profile." });
    } catch (err) {
      toast({
        title: "Upload failed",
        description: err instanceof Error ? err.message : "Please try a PDF or Word file.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    if (!form.full_name.trim() || !form.phone.trim() || !form.city.trim() || form.skills.length === 0) {
      toast({
        title: "A few details are missing",
        description: "Name, phone, city and at least one skill are required.",
        variant: "destructive",
      });
      return;
    }
    setSaving(true);
    try {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) throw new Error("Please sign in again.");
      const payload = {
        user_id: auth.user.id,
        faculty_id: facultyId,
        full_name: form.full_name.trim().slice(0, 120),
        email: form.email.trim() || null,
        phone: form.phone.trim().slice(0, 40),
        whatsapp: form.whatsapp.trim().slice(0, 40) || null,
        city: form.city.trim().slice(0, 80),
        country: form.country.trim() || "Nigeria",
        headline: form.headline.trim().slice(0, 160) || null,
        bio: form.bio.trim().slice(0, 2000) || null,
        linkedin_url: form.linkedin_url.trim() || null,
        github_url: form.github_url.trim() || null,
        portfolio_url: form.portfolio_url.trim() || null,
        intro_video_url: form.intro_video_url.trim() || null,
        skills: form.skills,
        tools: parseList(form.tools),
        years_experience: form.years_experience ? Number(form.years_experience) : null,
        hours_per_week: form.hours_per_week ? Number(form.hours_per_week) : null,
        work_mode: form.work_mode,
        rate_amount: form.rate_amount ? Number(form.rate_amount) : null,
        rate_currency: form.rate_currency,
        availability: form.availability,
        profile_strength: strength,
      };

      if (profileId) {
        const { error } = await supabase.from("talent_profiles").update({ ...payload, cv_path: form.cv_path }).eq("id", profileId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("talent_profiles")
          .insert({ ...payload, cv_path: form.cv_path })
          .select("id")
          .single();
        if (error) throw error;
        setProfileId(data.id);
      }
      toast({ title: "Profile saved", description: "You are now in the matching pool." });

      // A fully complete profile earns a Faculty ID straight away.
      if (!facultyId && strength >= 100) {
        const { data: issued } = await supabase.rpc("claim_talent_faculty_id");
        if (issued) {
          setFacultyId(issued);
          toast({ title: "Your Faculty ID is ready", description: `${issued} — your profile is complete and verified.` });
        }
      }
      navigate(nextPath && nextPath.startsWith("/") ? nextPath : "/talent/dashboard");
    } catch (err) {
      toast({
        title: "Could not save your profile",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto max-w-3xl px-4 pt-28">
          <Loader2 className="mx-auto animate-spin text-muted-foreground" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>My talent profile | Tech Faculty</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Header />

      <main className="pt-20">
        <TalentNav />
        <div className="container mx-auto max-w-3xl px-4 py-10 md:py-12">
          <Link to="/talent/dashboard" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft size={14} /> Back to dashboard
          </Link>

          <h1 className="text-2xl font-bold sm:text-3xl">Your talent profile</h1>
          <p className="mt-2 text-muted-foreground">
            Only your name, city and skills are shown to hiring teams we match you with. Your CV and contact details stay private
            until you are shortlisted.
          </p>

          <div className="mt-6 rounded-lg border border-border bg-card p-5">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium">Profile strength</span>
              <span className="text-muted-foreground">{strength}%</span>
            </div>
            <Progress value={strength} />
            {facultyId ? (
              <p className="mt-3 text-xs text-muted-foreground">
                Faculty ID: <span className="font-mono font-medium text-foreground">{facultyId}</span>
              </p>
            ) : (
              <p className="mt-3 text-xs text-muted-foreground">
                Reach 100% and we issue your Faculty ID automatically when you save.
              </p>
            )}
          </div>

          <div className="mt-8 space-y-8">
            <section className="space-y-4">
              <h2 className="text-lg font-semibold">Required details</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="full_name">Full name *</Label>
                  <Input id="full_name" value={form.full_name} onChange={(e) => set("full_name", e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input id="phone" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="08012345678" />
                </div>
                <div>
                  <Label htmlFor="whatsapp">WhatsApp number</Label>
                  <Input id="whatsapp" value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input id="city" value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="Nnewi" />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" value={form.country} onChange={(e) => set("country", e.target.value)} />
                </div>
              </div>

              <div>
                <Label>Skills *</Label>
                <div className="mt-2 flex gap-2">
                  <Input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") { e.preventDefault(); addSkill(skillInput); setSkillInput(""); }
                    }}
                    placeholder="Type a skill and press Enter"
                  />
                  <Button type="button" variant="outline" onClick={() => { addSkill(skillInput); setSkillInput(""); }}>
                    Add
                  </Button>
                </div>
                {form.skills.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {form.skills.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => set("skills", form.skills.filter((s) => s !== skill))}
                        className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs text-primary"
                      >
                        {skill} ×
                      </button>
                    ))}
                  </div>
                )}
                <div className="mt-3 flex flex-wrap gap-2">
                  {SKILL_SUGGESTIONS.filter((s) => !form.skills.includes(s)).slice(0, 14).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => addSkill(s)}
                      className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground hover:border-primary hover:text-foreground"
                    >
                      + {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="cv">CV or résumé</Label>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <Input
                    id="cv"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="max-w-xs"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadCv(f); }}
                  />
                  {uploading && <Loader2 size={16} className="animate-spin text-muted-foreground" />}
                  {form.cv_path && !uploading && (
                    <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <FileCheck2 size={14} /> CV on file
                    </span>
                  )}
                  {!form.cv_path && !uploading && (
                    <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Upload size={14} /> PDF or Word, up to 10MB
                    </span>
                  )}
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold">Optional — but it raises your matches</h2>
                <p className="text-sm text-muted-foreground">You can come back and add these any time.</p>
              </div>
              <div>
                <Label htmlFor="headline">Headline</Label>
                <Input
                  id="headline"
                  value={form.headline}
                  onChange={(e) => set("headline", e.target.value)}
                  placeholder="Frontend developer building dashboards for SMEs"
                />
              </div>
              <div>
                <Label htmlFor="bio">Short bio</Label>
                <Textarea id="bio" rows={4} value={form.bio} onChange={(e) => set("bio", e.target.value)} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="linkedin_url">LinkedIn</Label>
                  <Input id="linkedin_url" value={form.linkedin_url} onChange={(e) => set("linkedin_url", e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="github_url">GitHub</Label>
                  <Input id="github_url" value={form.github_url} onChange={(e) => set("github_url", e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="portfolio_url">Portfolio or work samples</Label>
                  <Input id="portfolio_url" value={form.portfolio_url} onChange={(e) => set("portfolio_url", e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="intro_video_url">Short intro video link</Label>
                  <Input id="intro_video_url" value={form.intro_video_url} onChange={(e) => set("intro_video_url", e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="tools">Tools you use</Label>
                  <Input id="tools" value={form.tools} onChange={(e) => set("tools", e.target.value)} placeholder="Figma, Excel, VS Code" />
                </div>
                <div>
                  <Label htmlFor="years_experience">Years of experience</Label>
                  <Input id="years_experience" type="number" min="0" max="50" value={form.years_experience} onChange={(e) => set("years_experience", e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="hours_per_week">Hours available per week</Label>
                  <Input id="hours_per_week" type="number" min="1" max="80" value={form.hours_per_week} onChange={(e) => set("hours_per_week", e.target.value)} />
                </div>
                <div>
                  <Label>Preferred work mode</Label>
                  <Select value={form.work_mode} onValueChange={(v) => set("work_mode", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                      <SelectItem value="onsite">On-site</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="rate_amount">Expected pay (per month)</Label>
                  <Input id="rate_amount" type="number" min="0" value={form.rate_amount} onChange={(e) => set("rate_amount", e.target.value)} />
                </div>
                <div>
                  <Label>Currency</Label>
                  <Select value={form.rate_currency} onValueChange={(v) => set("rate_currency", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NGN">Naira (₦)</SelectItem>
                      <SelectItem value="USD">US Dollar ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Availability</Label>
                  <Select value={form.availability} onValueChange={(v) => set("availability", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open to work</SelectItem>
                      <SelectItem value="unavailable">Not available right now</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </section>

            <Button size="lg" className="w-full sm:w-auto" onClick={save} disabled={saving}>
              {saving ? "Saving…" : profileId ? "Save changes" : "Join the talent pool"}
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TalentProfile;
