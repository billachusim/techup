import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { HR_EMAIL_DEFAULTS, type HrEmailKey } from "@/lib/hr-api-rules";

type AuditRow = { id: string; created_at: string; method: string; endpoint: string; status: number; changes: unknown };
type NoteRow = { id: string; body: string; source: string; created_at: string; talent_profiles: { full_name: string } | null; talent_roles: { title: string } | null };

/** Global auto-match pause switch. */
export function AutoMatchPauseSwitch() {
  const [paused, setPaused] = useState<boolean | null>(null);
  useEffect(() => {
    supabase.from("marketplace_settings").select("auto_match_paused").maybeSingle().then(({ data }) => setPaused(!!data?.auto_match_paused));
  }, []);
  const toggle = async (next: boolean) => {
    const { data: auth } = await supabase.auth.getUser();
    const { error } = await supabase
      .from("marketplace_settings")
      .upsert({ id: true, auto_match_paused: next, updated_at: new Date().toISOString(), updated_by: auth.user?.id ?? null });
    if (error) { toast({ title: "Could not update", description: error.message, variant: "destructive" }); return; }
    setPaused(next);
    toast({ title: next ? "Auto-matching paused" : "Auto-matching is on" });
  };
  return (
    <section className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-4">
      <div>
        <p className="font-medium">Automatic matching</p>
        <p className="text-xs text-muted-foreground">
          Matches talent at or above each role's threshold when a role is published, a profile is saved, and every Monday and Thursday at 02:00. AI suggestions that clear the threshold are approved too, each published role gets its own #proj- Slack channel, and profiles at 70%+ strength are approved automatically.
        </p>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <span>{paused ? "Paused" : "On"}</span>
        <Switch checked={paused === false} disabled={paused === null} onCheckedChange={(on) => toggle(!on)} aria-label="Auto-matching on" />
      </div>
    </section>
  );
}

/** Editable HR emails, recent screening notes and the HR API call log. */
export function HrAutomationPanel() {
  const [drafts, setDrafts] = useState<Record<string, { subject: string; body: string }>>({});
  const [audit, setAudit] = useState<AuditRow[]>([]);
  const [notes, setNotes] = useState<NoteRow[]>([]);
  const [saving, setSaving] = useState<string | null>(null);

  const load = useCallback(async () => {
    const [tpl, log, nt] = await Promise.all([
      supabase.from("hr_email_templates").select("key, subject, body"),
      supabase.from("hr_api_audit").select("*").order("created_at", { ascending: false }).limit(100),
      supabase.from("talent_notes").select("id, body, source, created_at, talent_profiles(full_name), talent_roles(title)").order("created_at", { ascending: false }).limit(50),
    ]);
    const next: Record<string, { subject: string; body: string }> = {};
    for (const k of Object.keys(HR_EMAIL_DEFAULTS) as HrEmailKey[]) {
      const o = (tpl.data ?? []).find((t) => t.key === k);
      next[k] = { subject: o?.subject ?? HR_EMAIL_DEFAULTS[k].subject, body: o?.body ?? HR_EMAIL_DEFAULTS[k].body };
    }
    setDrafts(next);
    setAudit((log.data ?? []) as AuditRow[]);
    setNotes((nt.data ?? []) as unknown as NoteRow[]);
  }, []);
  useEffect(() => { void load(); }, [load]);

  const save = async (key: HrEmailKey) => {
    setSaving(key);
    const { data: auth } = await supabase.auth.getUser();
    const d = drafts[key];
    const { error } = await supabase.from("hr_email_templates").upsert({ key, subject: d.subject, body: d.body, updated_at: new Date().toISOString(), updated_by: auth.user?.id ?? null });
    setSaving(null);
    if (error) { toast({ title: "Could not save", description: error.message, variant: "destructive" }); return; }
    toast({ title: `${HR_EMAIL_DEFAULTS[key].label} email saved` });
  };

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">HR emails</h2>
        <p className="text-sm text-muted-foreground">Sent by the automation agent from noreply@alerts.techfaculty.ng. Use the placeholders shown under each email.</p>
        {(Object.keys(HR_EMAIL_DEFAULTS) as HrEmailKey[]).map((k) => (
          <div key={k} className="space-y-2 rounded-lg border border-border bg-card p-4">
            <p className="font-medium">{HR_EMAIL_DEFAULTS[k].label}</p>
            <Label className="text-xs">Subject</Label>
            <Input value={drafts[k]?.subject ?? ""} onChange={(e) => setDrafts((s) => ({ ...s, [k]: { ...s[k], subject: e.target.value } }))} />
            <Label className="text-xs">Message</Label>
            <Textarea rows={7} value={drafts[k]?.body ?? ""} onChange={(e) => setDrafts((s) => ({ ...s, [k]: { ...s[k], body: e.target.value } }))} />
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs text-muted-foreground">{HR_EMAIL_DEFAULTS[k].variables.map((v) => `{{${v}}}`).join(" ")}</p>
              <Button size="sm" onClick={() => save(k)} disabled={saving === k}>{saving === k ? "Saving…" : "Save"}</Button>
            </div>
          </div>
        ))}
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Screening notes ({notes.length})</h2>
        <div className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
          {notes.length === 0 && <p className="p-4 text-sm text-muted-foreground">No notes yet.</p>}
          {notes.map((n) => (
            <div key={n.id} className="p-3 text-sm">
              <p className="font-medium">{n.talent_profiles?.full_name ?? "Talent"}{n.talent_roles?.title ? ` · ${n.talent_roles.title}` : ""}</p>
              <p className="whitespace-pre-line text-muted-foreground">{n.body}</p>
              <p className="text-xs text-muted-foreground">{new Date(n.created_at).toLocaleString("en-GB")} · {n.source === "hr_api" ? "Automation agent" : "Admin"}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">HR API log</h2>
          <Button size="sm" variant="outline" onClick={() => void load()}>Refresh</Button>
        </div>
        <div className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
          {audit.length === 0 && <p className="p-4 text-sm text-muted-foreground">No calls yet.</p>}
          {audit.map((a) => (
            <div key={a.id} className="flex flex-wrap items-start justify-between gap-2 p-3 text-sm">
              <div>
                <p className="font-mono text-xs">{a.method} {a.endpoint}</p>
                {a.changes != null && Object.keys(a.changes as object).length > 0 ? (
                  <p className="mt-1 break-all font-mono text-xs text-muted-foreground">{JSON.stringify(a.changes)}</p>
                ) : null}
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={a.status < 400 ? "outline" : "destructive"}>{a.status}</Badge>
                <span className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleString("en-GB")}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
