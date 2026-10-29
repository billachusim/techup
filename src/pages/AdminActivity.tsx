import { useCallback, useEffect, useMemo, useState } from "react";
import { History, Loader2, RefreshCw, Search } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminNav from "@/components/admin/AdminNav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useIsStaff } from "@/hooks/useIsStaff";
import { getSupabase } from "@/integrations/supabase/lazy";
import type { Json } from "@/integrations/supabase/types";
import { Link } from "@/lib/router-compat";
import { cn } from "@/lib/utils";

const ACTION_LABEL: Record<string, string> = {
  "payment.marked_paid": "Marked payment paid",
  "payment.balance_marked_paid": "Marked instalment balance paid",
  "enrollment.cancelled": "Cancelled enrolment",
  "enrollment.status_changed": "Changed enrolment status",
  "certificate.issued": "Issued certificate",
  "certificate.edited": "Edited certificate",
  "certificate.revoked": "Revoked certificate",
  "certificate.reinstated": "Reinstated certificate",
  "certificate.deleted": "Deleted certificate",
  "lead.status_changed": "Changed lead status",
  "lead.auto_converted": "Marked lead enrolled (they enrolled)",
  "lead.auto_archived": "Archived silent lead",
  "referral.reward_paid": "Paid referral reward",
  "referral.status_changed": "Changed referral status",
  "slack.channel_created": "Created project Slack channel",
  "talent.auto_approved": "Approved talent automatically",
  "work.ai_reviewed": "AI scored student work",
  "work.ai_review_overridden": "Changed AI score on student work",
};

const LIMIT = 500;

type Entry = {
  id: string;
  created_at: string;
  actor_email: string | null;
  action: string;
  target_table: string;
  target_id: string | null;
  faculty_id: string | null;
  subject: string | null;
  details: Json;
};

const actionLabel = (action: string) => ACTION_LABEL[action] ?? action.replace(/[._]/g, " ");

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("en-NG", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });

const pretty = (v: string) => v.replace(/_/g, " ");

/** One line saying what changed, built from the details the trigger or server code saved. */
function describe(entry: Entry): string {
  const d = (entry.details && typeof entry.details === "object" && !Array.isArray(entry.details) ? entry.details : {}) as Record<
    string,
    Json | undefined
  >;
  const parts: string[] = [];
  if (typeof d.from === "string" && typeof d.to === "string") parts.push(`${pretty(d.from)} → ${pretty(d.to)}`);
  else if (typeof d.to === "string") parts.push(pretty(d.to));
  if (typeof d.plan === "string") parts.push(d.plan);
  if (typeof d.course === "string") parts.push(d.course);
  if (typeof d.title === "string") parts.push(d.title);
  if (typeof d.score === "number") parts.push(`${d.score}%`);
  if (typeof d.certificate_number === "string") parts.push(d.certificate_number);
  if (typeof d.channel === "string") parts.push(d.channel);
  if (typeof d.amount === "number" || typeof d.amount === "string") {
    parts.push(`${typeof d.currency === "string" ? `${d.currency} ` : ""}${Number(d.amount).toLocaleString("en-NG")}`);
  }
  if (typeof d.code === "string") parts.push(`code ${d.code}`);
  if (typeof d.method === "string") parts.push(`by ${pretty(d.method)}`);
  if (typeof d.reason === "string") parts.push(`reason: ${d.reason}`);
  return parts.join(" · ");
}

/** Admin: who did what to which student or record, newest first. */
export default function AdminActivity() {
  const { toast } = useToast();
  const { loading: roleLoading, isAdmin } = useIsStaff();
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [action, setAction] = useState("all");
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from("admin_audit_log")
      .select("id, created_at, actor_email, action, target_table, target_id, faculty_id, subject, details")
      .order("created_at", { ascending: false })
      .limit(LIMIT);
    setLoading(false);
    if (error) {
      toast({ title: "Couldn't load the activity log", description: error.message, variant: "destructive" });
      return;
    }
    setEntries(data ?? []);
  }, [toast]);

  useEffect(() => {
    if (isAdmin) void load();
  }, [isAdmin, load]);

  const actions = useMemo(() => [...new Set(entries.map((e) => e.action))].sort(), [entries]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries.filter(
      (e) =>
        (action === "all" || e.action === action) &&
        (!q ||
          [e.actor_email, e.subject, e.faculty_id, e.target_id, describe(e)].some((v) => v?.toLowerCase().includes(q))),
    );
  }, [entries, action, query]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 pt-28 pb-16 max-w-5xl space-y-6">
        <AdminNav />
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Activity log</h1>
            <p className="text-sm text-muted-foreground">
              Every admin action on payments, enrolments, certificates, leads and referral rewards.
            </p>
          </div>
          {isAdmin && (
            <Button variant="outline" size="sm" onClick={() => void load()} disabled={loading}>
              <RefreshCw className={cn("h-4 w-4 mr-1.5", loading && "animate-spin")} /> Refresh
            </Button>
          )}
        </div>

        {roleLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : !isAdmin ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">This page is for Tech Faculty admins. Sign in with an admin account.</p>
            <Link to="/login?next=/admin/activity">
              <Button>Sign in</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search admin, student, Faculty ID or details"
                  className="pl-9"
                  aria-label="Search activity"
                />
              </div>
              <Select value={action} onValueChange={setAction}>
                <SelectTrigger className="sm:w-60" aria-label="Filter by action">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All actions</SelectItem>
                  {actions.map((a) => (
                    <SelectItem key={a} value={a}>
                      {actionLabel(a)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {loading && !entries.length ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : !visible.length ? (
              <Card>
                <CardContent className="flex flex-col items-center gap-2 py-12 text-center text-muted-foreground">
                  <History className="h-8 w-8" />
                  <p className="text-sm">{entries.length ? "No activity matches these filters." : "No admin activity recorded yet."}</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-0">
                  <ul className="divide-y">
                    {visible.map((e) => {
                      const summary = describe(e);
                      return (
                        <li key={e.id} className="flex flex-col gap-1 p-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                          <div className="min-w-0 space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge variant="secondary">{actionLabel(e.action)}</Badge>
                              <span className="font-medium">{e.subject || e.faculty_id || "Record"}</span>
                              {e.faculty_id && e.subject && (
                                <span className="text-xs text-muted-foreground">{e.faculty_id}</span>
                              )}
                            </div>
                            {summary && <p className="text-sm text-muted-foreground break-words">{summary}</p>}
                          </div>
                          <div className="shrink-0 text-sm text-muted-foreground sm:text-right">
                            <p className="break-all">{e.actor_email ?? "Unknown admin"}</p>
                            <p className="text-xs">{formatDate(e.created_at)}</p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </CardContent>
              </Card>
            )}
            {entries.length >= LIMIT && (
              <p className="text-xs text-muted-foreground">Showing the latest {LIMIT.toLocaleString("en-NG")} actions.</p>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
