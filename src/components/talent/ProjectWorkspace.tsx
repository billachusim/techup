import { useCallback, useEffect, useState } from "react";
import { Loader2, MessageCircle, Slack, ListChecks, FolderOpen, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  DELIVERABLE_STATUS_LABEL,
  fetchProjectWorkspace,
  hasWorkspaceLinks,
  startOfWeek,
  trialDaysLeft,
  type ProjectWorkspace as Workspace,
  type TalentDeliverable,
} from "@/lib/talent";

type Props = {
  roleId: string;
  roleTitle: string;
  company: string;
  profileId: string;
  /** "trial": matched talent proving themselves with work submissions. "selected": on the team, work runs on Slack. */
  mode?: "trial" | "selected";
  trialWorks?: number;
  trialDueAt?: string | null;
  trialBrief?: string | null;
};

const emptyLog = { title: "", link_url: "", summary: "" };

/**
 * Trial mode: the trial brief and a form to submit work, which staff use to confirm or
 * reject the selection. Selected mode: the private team links; day-to-day work runs on
 * Slack (WhatsApp as backup), not on this site (Bill, 2026-11-09).
 */
const ProjectWorkspace = ({ roleId, roleTitle, company, profileId, mode = "selected", trialWorks = 1, trialDueAt, trialBrief }: Props) => {
  const isTrial = mode === "trial";
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [logs, setLogs] = useState<TalentDeliverable[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState(emptyLog);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const [w, d] = await Promise.all([
      fetchProjectWorkspace(roleId),
      supabase
        .from("talent_deliverables")
        .select("*")
        .eq("role_id", roleId)
        .eq("talent_profile_id", profileId)
        .order("week_of", { ascending: false }),
    ]);
    setWorkspace(w);
    setLogs((d.data ?? []) as TalentDeliverable[]);
    setLoading(false);
  }, [roleId, profileId]);

  useEffect(() => { load(); }, [load]);

  const submitted = logs.length;
  const daysLeft = trialDaysLeft(trialDueAt);

  const addLog = async () => {
    if (!draft.title.trim()) {
      toast({ title: "Give your work a title", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("talent_deliverables").insert({
      role_id: roleId,
      talent_profile_id: profileId,
      title: draft.title.trim().slice(0, 160),
      link_url: draft.link_url.trim() || null,
      summary: draft.summary.trim().slice(0, 600) || null,
      week_of: startOfWeek(),
    });
    setSaving(false);
    if (error) {
      toast({ title: "Could not save that", description: error.message, variant: "destructive" });
      return;
    }
    setDraft(emptyLog);
    toast({ title: "Work submitted", description: "Our team will review it before confirming your selection." });
    load();
  };

  const removeLog = async (id: string) => {
    const { error } = await supabase.from("talent_deliverables").delete().eq("id", id);
    if (error) {
      toast({ title: "Could not remove that", description: error.message, variant: "destructive" });
      return;
    }
    load();
  };

  if (loading) {
    return (
      <div className="rounded-lg border border-border bg-card p-5">
        <Loader2 className="animate-spin text-muted-foreground" size={16} />
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-lg border border-primary/30 bg-card p-5">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-primary">{isTrial ? "Work trial" : "Project workspace"}</p>
        <h3 className="mt-1 font-semibold">{roleTitle}</h3>
        <p className="text-xs text-muted-foreground">{company}</p>
      </div>

      {isTrial && (
        <div className="space-y-2 rounded-md bg-muted/40 p-3 text-sm">
          <p>
            Before we confirm your selection, submit{" "}
            <b>{trialWorks === 1 ? "1 piece of work" : `${trialWorks} pieces of work`}</b>
            {trialDueAt && <> by <b>{new Date(trialDueAt).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}</b></>}.
          </p>
          <p className="text-xs text-muted-foreground">
            {Math.min(submitted, trialWorks)} of {trialWorks} submitted
            {daysLeft != null && (daysLeft >= 0 ? ` · ${daysLeft} day${daysLeft === 1 ? "" : "s"} left` : " · past the due date, submit as soon as you can")}
          </p>
          {trialBrief && <p className="whitespace-pre-line text-muted-foreground">{trialBrief}</p>}
        </div>
      )}

      {workspace?.project_brief && (
        <p className="whitespace-pre-line text-sm text-muted-foreground">{workspace.project_brief}</p>
      )}

      {isTrial ? (
        workspace?.drive_url ? (
          <a href={workspace.drive_url} target="_blank" rel="noopener noreferrer">
            <Button size="sm" variant="outline"><FolderOpen className="mr-1.5" size={14} /> Shared files</Button>
          </a>
        ) : null
      ) : hasWorkspaceLinks(workspace) ? (
        <div className="flex flex-wrap gap-2">
          {workspace?.whatsapp_group_url && (
            <a href={workspace.whatsapp_group_url} target="_blank" rel="noopener noreferrer">
              <Button size="sm"><MessageCircle className="mr-1.5" size={14} /> Project group</Button>
            </a>
          )}
          {workspace?.slack_channel_url && (
            <a href={workspace.slack_channel_url} target="_blank" rel="noopener noreferrer">
              <Button size="sm" variant="outline"><Slack className="mr-1.5" size={14} /> Slack channel</Button>
            </a>
          )}
          {workspace?.task_board_url && (
            <a href={workspace.task_board_url} target="_blank" rel="noopener noreferrer">
              <Button size="sm" variant="outline"><ListChecks className="mr-1.5" size={14} /> My tasks</Button>
            </a>
          )}
          {workspace?.drive_url && (
            <a href={workspace.drive_url} target="_blank" rel="noopener noreferrer">
              <Button size="sm" variant="outline"><FolderOpen className="mr-1.5" size={14} /> Shared files</Button>
            </a>
          )}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Your project lead is still setting up the team space. You will see the links here as soon as they are added.
        </p>
      )}

      {!isTrial && (
        <p className="text-sm text-muted-foreground">
          Your tasks, updates and check-ins happen on the project Slack channel, with WhatsApp as a backup.
        </p>
      )}

      {isTrial && (
      <div className="space-y-3 border-t border-border pt-4">
        <p className="text-sm font-medium">Your trial work</p>
        {logs.length > 0 && (
          <div className="divide-y divide-border overflow-hidden rounded-md border border-border">
            {logs.map((log) => (
              <div key={log.id} className="flex flex-wrap items-start justify-between gap-3 p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{log.title}</p>
                  <p className="text-xs text-muted-foreground">
                    Submitted {new Date(log.created_at).toLocaleDateString("en-GB")}
                    {log.link_url && (
                      <>
                        {" · "}
                        <a href={log.link_url} target="_blank" rel="noopener noreferrer" className="text-link hover:underline">
                          Open link
                        </a>
                      </>
                    )}
                  </p>
                  {log.summary && <p className="mt-1 text-xs text-muted-foreground">{log.summary}</p>}
                  {log.reviewer_note && (
                    <p className="mt-1 text-xs text-foreground">Feedback: {log.reviewer_note}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{DELIVERABLE_STATUS_LABEL[log.status] ?? log.status}</Badge>
                  {log.status === "submitted" && (
                    <Button size="icon" variant="ghost" aria-label="Remove this entry" onClick={() => removeLog(log.id)}>
                      <Trash2 size={14} />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label className="text-xs">What is this work?</Label>
            <Input
              className="mt-1"
              value={draft.title}
              maxLength={160}
              placeholder="Product page design for the store"
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2">
            <Label className="text-xs">Link to the work (Drive, GitHub, TikTok, Figma…)</Label>
            <Input
              className="mt-1"
              value={draft.link_url}
              placeholder="https://…"
              onChange={(e) => setDraft({ ...draft, link_url: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2">
            <Label className="text-xs">Short note (optional)</Label>
            <Textarea
              className="mt-1"
              rows={2}
              maxLength={600}
              value={draft.summary}
              onChange={(e) => setDraft({ ...draft, summary: e.target.value })}
            />
          </div>
        </div>
        <Button size="sm" onClick={addLog} disabled={saving}>
          {saving ? <Loader2 size={14} className="mr-1.5 animate-spin" /> : <Plus size={14} className="mr-1.5" />}
          Submit this work
        </Button>
      </div>
      )}
    </div>
  );
};

export default ProjectWorkspace;
