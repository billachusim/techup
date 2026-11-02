import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getCampaignOverview, sendCampaignBatch, submitCampaignTemplates } from "@/lib/whatsapp-campaign.functions";

const GROUP_LABEL: Record<string, string> = {
  general: "Everyone else: free bootcamp",
  siwes: "SIWES / internship: Virtual SIWES + free bootcamp",
  course: "Asked about a course: that course + new price",
  student: "Current students: update + keep going",
};
const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  APPROVED: "default", PENDING: "secondary", REJECTED: "destructive", NOT_SUBMITTED: "outline",
};

type Overview = Awaited<ReturnType<typeof getCampaignOverview>>;

/** Admin: the "we've revamped" WhatsApp message to every lead, grouped by what they asked about. */
export function WhatsAppCampaign() {
  const overviewFn = useServerFn(getCampaignOverview);
  const submitFn = useServerFn(submitCampaignTemplates);
  const sendFn = useServerFn(sendCampaignBatch);
  const [data, setData] = useState<Overview | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const load = () => overviewFn().then(setData, (e) => toast.error((e as Error).message));
  useEffect(() => { void load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  const submit = async () => {
    setBusy("submit");
    try {
      const r = await submitFn();
      const bad = r.results.filter((x) => !x.ok);
      bad.length ? toast.error(`${bad.length} not submitted: ${bad[0].error}`) : toast.success("Sent to Meta for approval. This usually takes minutes to a day.");
      await load();
    } finally { setBusy(null); }
  };

  const send = async (retryFailed = false) => {
    setBusy(retryFailed ? "retry" : "send");
    try {
      const r = await sendFn({ data: { limit: 25, retryFailed } });
      if (r.note) toast.error(r.note);
      else toast.success(`Sent ${r.sent}${r.failed ? `, ${r.failed} failed` : ""}. ${r.remaining} left.`);
      await load();
    } catch (e) {
      toast.error((e as Error).message);
    } finally { setBusy(null); }
  };

  if (!data) return <Loader2 className="h-5 w-5 animate-spin" />;
  const approved = data.groups.some((g) => g.templateStatus === "APPROVED");
  const left = data.groups.reduce((n, g) => n + (g.templateStatus === "APPROVED" ? Math.max(0, g.reachable - g.sent - g.failed) : 0), 0);
  const failed = data.groups.reduce((n, g) => n + g.failed, 0);

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="space-y-3 p-5">
          <h2 className="font-semibold">Revamp message to all leads</h2>
          <p className="text-sm text-muted-foreground">
            {data.totalLeads} leads · {data.duplicates} repeat numbers sent once · {data.optedOut} said STOP (skipped) · {data.noPhone} without a phone number.
            Each person gets one message for their group, from Claire's admissions number, with a one-tap link. Free bootcamp links start enrolment straight away.
          </p>
          {data.templateError && <p className="text-sm text-destructive">Couldn't check message approval: {data.templateError}</p>}
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={submit} disabled={busy !== null}>
              {busy === "submit" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Submit messages to Meta
            </Button>
            <Button size="sm" onClick={() => send(false)} disabled={busy !== null || !approved || left === 0}>
              {busy === "send" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              Send next 25 {approved ? `(${left} waiting)` : "(waiting for approval)"}
            </Button>
            {failed > 0 && (
              <Button size="sm" variant="outline" onClick={() => send(true)} disabled={busy !== null}>
                {busy === "retry" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Retry {failed} failed
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      {data.groups.map((g) => (
        <Card key={g.segment}>
          <CardContent className="space-y-2 p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium">{GROUP_LABEL[g.segment]}</p>
              <Badge variant={STATUS_VARIANT[g.templateStatus] ?? "outline"}>
                {g.templateStatus === "NOT_SUBMITTED" ? "Not submitted" : g.templateStatus.toLowerCase()}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{g.reachable} to message · {g.sent} sent{g.failed ? ` · ${g.failed} failed` : ""}</p>
            {g.lastError && <p className="text-xs text-destructive break-words">Last error: {g.lastError}</p>}
            <pre className="whitespace-pre-wrap rounded-md bg-muted p-3 font-sans text-xs">{g.preview}</pre>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
