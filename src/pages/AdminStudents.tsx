import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useIsStaff } from "@/hooks/useIsStaff";
import { listStudentWork, reviewStudentWork } from "@/lib/student-review.functions";
import AdminNav from "@/components/admin/AdminNav";
import { PendingPayments } from "@/components/student/PendingPayments";

type Status = "submitted" | "reviewed" | "needs_changes" | "all";
const FILTERS: { v: Status; label: string }[] = [
  { v: "submitted", label: "Awaiting review" },
  { v: "needs_changes", label: "Needs changes" },
  { v: "reviewed", label: "Accepted" },
  { v: "all", label: "All" },
];

export default function AdminStudents() {
  const { loading, isStaff, isAdmin } = useIsStaff();
  const list = useServerFn(listStudentWork);
  const review = useServerFn(reviewStudentWork);
  const [filter, setFilter] = useState<Status>("submitted");
  const [rows, setRows] = useState<Awaited<ReturnType<typeof list>>>([]);
  const [busy, setBusy] = useState(false);
  const [drafts, setDrafts] = useState<Record<string, { score: string; note: string }>>({});
  const [saving, setSaving] = useState<string | null>(null);

  const load = async () => {
    setBusy(true);
    try {
      const data = await list({ data: { status: filter } });
      setRows(data);
      setDrafts(Object.fromEntries(data.map((r) => [r.id, { score: r.score?.toString() ?? "", note: r.reviewer_note ?? "" }])));
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (isStaff) void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStaff, filter]);

  const submit = async (id: string, status: "reviewed" | "needs_changes") => {
    const d = drafts[id] ?? { score: "", note: "" };
    const score = d.score.trim() === "" ? null : Math.max(0, Math.min(100, parseInt(d.score, 10)));
    if (score !== null && Number.isNaN(score)) {
      toast.error("Score must be 0–100");
    } else {
      await save(id, status, score, d.note);
    }
  };

  const save = async (id: string, status: "reviewed" | "needs_changes", score: number | null, note: string) => {
    setSaving(id);
    try {
      await review({ data: { id, status, score, note } });
      toast.success(status === "reviewed" ? "Accepted — student notified" : "Changes requested — student notified");
      await load();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 pt-28 pb-16 max-w-4xl space-y-6">
        <AdminNav />
        <div>
          <h1 className="text-2xl font-bold">Student work review</h1>
          <p className="text-sm text-muted-foreground">Score weekly submissions. Each review emails the student and, when accepted, posts in their class group on Slack.</p>
        </div>
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : !isStaff ? (
          <p className="text-sm text-muted-foreground">This page is for Tech Faculty staff. Sign in with a staff account.</p>
        ) : (
          <>
            {isAdmin && <PendingPayments />}
            <h2 className="text-xl font-bold pt-2">Submissions</h2>
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((f) => (
                <Button key={f.v} size="sm" variant={filter === f.v ? "default" : "outline"} onClick={() => setFilter(f.v)}>{f.label}</Button>
              ))}
            </div>
            {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : rows.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nothing here yet.</p>
            ) : rows.map((r) => (
              <Card key={r.id}>
                <CardContent className="p-5 space-y-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold">{r.class_number ? `Class ${r.class_number}: ` : ""}{r.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {r.student_name} · {r.faculty_id} · {r.course_name ?? "Programme"} · {new Date(r.created_at).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Running score: {r.average_score != null ? `${r.average_score}% over ${r.reviewed_count} reviewed` : "not scored yet"}
                      </p>
                    </div>
                    <Badge variant={r.status === "reviewed" ? "default" : r.status === "needs_changes" ? "destructive" : "secondary"}>
                      {FILTERS.find((f) => f.v === r.status)?.label ?? r.status}
                    </Badge>
                  </div>
                  {r.proof_url && <a href={r.proof_url} target="_blank" rel="noreferrer" className="text-sm underline break-all">{r.proof_url}</a>}
                  {r.summary && <p className="text-sm border-l-2 pl-2 text-muted-foreground">{r.summary}</p>}
                  <div className="grid sm:grid-cols-[120px_1fr] gap-2">
                    <Input
                      type="number" min={0} max={100} placeholder="Score %"
                      value={drafts[r.id]?.score ?? ""}
                      onChange={(e) => setDrafts((p) => ({ ...p, [r.id]: { ...(p[r.id] ?? { note: "" }), score: e.target.value } }))}
                    />
                    <Textarea
                      rows={2} maxLength={1000} placeholder="Feedback for the student"
                      value={drafts[r.id]?.note ?? ""}
                      onChange={(e) => setDrafts((p) => ({ ...p, [r.id]: { ...(p[r.id] ?? { score: "" }), note: e.target.value } }))}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" disabled={saving === r.id} onClick={() => submit(r.id, "reviewed")}>
                      {saving === r.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Accept
                    </Button>
                    <Button size="sm" variant="outline" disabled={saving === r.id} onClick={() => submit(r.id, "needs_changes")}>Needs changes</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
