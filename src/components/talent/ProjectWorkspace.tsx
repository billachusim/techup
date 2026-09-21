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
  type ProjectWorkspace as Workspace,
  type TalentDeliverable,
} from "@/lib/talent";

type Props = { roleId: string; roleTitle: string; company: string; profileId: string };

const emptyLog = { title: "", link_url: "", summary: "" };

/**
 * What a selected member sees once they are on a project: the private team
 * links, and a simple weekly log of work with a link to the proof.
 */
const ProjectWorkspace = ({ roleId, roleTitle, company, profileId }: Props) => {
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

  const addLog = async () => {
    if (!draft.title.trim()) {
      toast({ title: "Say what you worked on", variant: "destructive" });
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
    toast({ title: "Work logged", description: "Your project lead can now review it." });
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
        <p className="text-xs font-medium uppercase tracking-wide text-primary">Project workspace</p>
        <h3 className="mt-1 font-semibold">{roleTitle}</h3>
        <p className="text-xs text-muted-foreground">{company}</p>
      </div>

      {workspace?.project_brief && (
        <p className="whitespace-pre-line text-sm text-muted-foreground">{workspace.project_brief}</p>
      )}

      {hasWorkspaceLinks(workspace) ? (
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

      <div className="space-y-3 border-t border-border pt-4">
        <p className="text-sm font-medium">This week&apos;s work</p>
        {logs.length > 0 && (
          <div className="divide-y divide-border overflow-hidden rounded-md border border-border">
            {logs.map((log) => (
              <div key={log.id} className="flex flex-wrap items-start justify-between gap-3 p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{log.title}</p>
                  <p className="text-xs text-muted-foreground">
                    Week of {new Date(log.week_of).toLocaleDateString("en-GB")}
                    {log.link_url && (
                      <>
                        {" · "}
                        <a href={log.link_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
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
            <Label className="text-xs">What did you work on?</Label>
            <Input
              className="mt-1"
              value={draft.title}
              maxLength={160}
              placeholder="Built the product page layout"
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2">
            <Label className="text-xs">Link to the work (optional)</Label>
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
          Log this work
        </Button>
      </div>
    </div>
  );
};

export default ProjectWorkspace;
