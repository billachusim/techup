import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Hash, ExternalLink, Upload, CheckCircle2, Clock, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { onboardStudent, notifyStudentWork } from "@/lib/student-onboarding.functions";
import { findProgram, SLACK_JOIN_URL, slackChannelUrl } from "@/data/coursePrograms";

interface Props {
  facultyId?: string | null;
  department?: string | null;
  courseName?: string | null;
  classNumber?: number;
  classTitle?: string | null;
  meetingLink?: string | null;
  whatsappGroupLink?: string | null;
  liveClassMessage?: string | null;
}

interface Deliverable {
  id: string;
  title: string;
  proof_url: string | null;
  status: string;
  score: number | null;
  reviewer_note: string | null;
  class_number: number | null;
  created_at: string;
}

const STATUS_LABEL: Record<string, string> = {
  submitted: "Awaiting review",
  reviewed: "Accepted",
  needs_changes: "Needs changes",
};

export const StudentClassroom = ({ facultyId, department, courseName, classNumber, classTitle, meetingLink, whatsappGroupLink, liveClassMessage }: Props) => {
  const { toast } = useToast();
  const runOnboarding = useServerFn(onboardStudent);
  const runNotify = useServerFn(notifyStudentWork);

  const program = findProgram(department);
  const [channelName, setChannelName] = useState<string>(program.channel);
  const [channelId, setChannelId] = useState<string | null>(null);
  const [slackLinked, setSlackLinked] = useState<boolean | null>(null);
  const [joinUrl, setJoinUrl] = useState<string>(SLACK_JOIN_URL);
  const [connecting, setConnecting] = useState(false);
  const [items, setItems] = useState<Deliverable[]>([]);
  const [title, setTitle] = useState("");
  const [proofUrl, setProofUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [saving, setSaving] = useState(false);

  const loadDeliverables = async () => {
    const { data } = await supabase
      .from("student_deliverables")
      .select("id, title, proof_url, status, score, reviewer_note, class_number, created_at")
      .order("created_at", { ascending: false })
      .limit(10);
    setItems((data as Deliverable[]) ?? []);
  };

  const connect = async (silent = false) => {
    setConnecting(true);
    try {
      const res = await runOnboarding();
      if (res?.ok) {
        setChannelName(res.channelName ?? program.channel);
        if (res.channelId) setChannelId(res.channelId);
        setSlackLinked(!!res.slackLinked);
        if (res.joinUrl) setJoinUrl(res.joinUrl);
        if (!silent) {
          toast({
            title: res.slackLinked ? "You're in your class group" : "Join Slack with your email",
            description: res.slackLinked
              ? `Added to #${res.channelName}. Class briefings and questions happen there.`
              : "Join the Tech Faculty Slack with the same email you registered with, then tap Connect again.",
          });
        }
      }
    } catch (e) {
      if (!silent) toast({ title: "Could not connect your class group", description: (e as Error).message, variant: "destructive" });
    } finally {
      setConnecting(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || cancelled) return;
      const { data: profile } = await supabase
        .from("profiles")
        .select("slack_user_id, slack_channel_name, slack_channel_id")
        .eq("id", user.id)
        .maybeSingle();
      if (cancelled) return;
      if (profile?.slack_channel_name) setChannelName(profile.slack_channel_name);
      if (profile?.slack_channel_id) setChannelId(profile.slack_channel_id);
      setSlackLinked(!!profile?.slack_user_id);
      await loadDeliverables();
      if (!profile?.slack_channel_name || !profile?.slack_user_id) void connect(true);
    };
    void init();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facultyId]);

  const submit = async () => {
    if (!facultyId) {
      toast({ title: "Enrol first", description: "You need a Faculty ID before submitting work.", variant: "destructive" });
      return;
    }
    if (title.trim().length < 3) {
      toast({ title: "Add a title", description: "Tell us what you worked on.", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const { data, error } = await supabase
        .from("student_deliverables")
        .insert({
          faculty_id: facultyId,
          title: title.trim().slice(0, 160),
          proof_url: proofUrl.trim() ? proofUrl.trim().slice(0, 500) : null,
          summary: summary.trim() ? summary.trim().slice(0, 1000) : null,
          course_name: courseName ?? program.title,
          class_number: classNumber ?? null,
        })
        .select("id")
        .single();
      if (error) throw error;
      setTitle("");
      setProofUrl("");
      setSummary("");
      await loadDeliverables();
      if (data?.id) {
        try {
          await runNotify({ data: { deliverableId: data.id } });
        } catch { /* Slack notice is best effort */ }
      }
      toast({ title: "Work submitted", description: "Your tutor will review it and score your progress." });
    } catch (e) {
      toast({ title: "Could not submit", description: (e as Error).message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Hash className="h-5 w-5" />
              <h3 className="font-semibold">Your class group</h3>
            </div>
            <Badge variant={slackLinked ? "default" : "secondary"}>{slackLinked ? "Connected" : "Not connected"}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {program.title} · <span className="font-medium text-foreground">#{channelName}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            {slackLinked
              ? "Class briefings, notes and questions happen in your class group on Slack."
              : "Join the Tech Faculty Slack with the same email you registered with, then connect to be added automatically."}
          </p>
          <div className="flex flex-wrap gap-2">
            {slackChannelUrl(channelId) && (
              <Button size="sm" onClick={() => window.open(slackChannelUrl(channelId)!, "_blank")}>
                Open #{channelName} <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            )}
            <Button size="sm" variant="outline" onClick={() => window.open(joinUrl, "_blank")}>
              Tech Faculty Slack <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
            {meetingLink && (
              <Button size="sm" onClick={() => window.open(meetingLink, "_blank")}>
                Join Class <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            )}
            <Button size="sm" variant="outline" onClick={() => window.open(`https://wa.me/2348068597140?text=${encodeURIComponent(liveClassMessage ?? `Hi! I'm ready for my next ${program.title} class`)}`, "_blank")}>
              Join Live Class
            </Button>
            {whatsappGroupLink && (
              <Button size="sm" variant="outline" onClick={() => window.open(whatsappGroupLink, "_blank")}>
                Class WhatsApp Group <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            )}
            {!slackLinked && (
              <Button size="sm" variant="secondary" onClick={() => connect(false)} disabled={connecting}>
                {connecting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Connect my class group
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            <h3 className="font-semibold">Submit this week's work</h3>
          </div>
          {classTitle && (
            <p className="text-sm text-muted-foreground">
              Current class: <span className="font-medium text-foreground">{classTitle}</span>
            </p>
          )}
          <div className="grid gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="work-title">What did you build or complete?</Label>
              <Input id="work-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Class 3 project: portfolio page" maxLength={160} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="work-link">Link to your work (optional)</Label>
              <Input id="work-link" value={proofUrl} onChange={(e) => setProofUrl(e.target.value)} placeholder="GitHub, live link, Figma or Google Doc" maxLength={500} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="work-notes">Anything you struggled with? (optional)</Label>
              <Textarea id="work-notes" value={summary} onChange={(e) => setSummary(e.target.value)} rows={3} maxLength={1000} />
            </div>
            <Button onClick={submit} disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Submit my work
            </Button>
          </div>

          {items.length > 0 && (
            <div className="space-y-3 pt-2">
              <p className="text-sm font-medium">Your submissions</p>
              {items.map((d) => (
                <div key={d.id} className="rounded-lg border p-3 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium">
                      {d.class_number ? `Class ${d.class_number}: ` : ""}
                      {d.title}
                    </p>
                    <Badge variant={d.status === "reviewed" ? "default" : d.status === "needs_changes" ? "destructive" : "secondary"} className="shrink-0">
                      {d.status === "reviewed" ? <CheckCircle2 className="mr-1 h-3 w-3" /> : d.status === "needs_changes" ? <AlertCircle className="mr-1 h-3 w-3" /> : <Clock className="mr-1 h-3 w-3" />}
                      {STATUS_LABEL[d.status] ?? d.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{new Date(d.created_at).toLocaleDateString()}{typeof d.score === "number" ? ` · Score ${d.score}%` : ""}</p>
                  {d.proof_url && (
                    <a href={d.proof_url} target="_blank" rel="noreferrer" className="text-xs underline break-all">
                      {d.proof_url}
                    </a>
                  )}
                  {d.reviewer_note && <p className="text-xs text-muted-foreground border-l-2 pl-2">{d.reviewer_note}</p>}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentClassroom;
