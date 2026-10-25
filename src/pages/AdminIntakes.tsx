import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Link } from "@/lib/router-compat";
import { useIsStaff } from "@/hooks/useIsStaff";
import { supabase } from "@/integrations/supabase/client";
import AdminNav from "@/components/admin/AdminNav";
import { departments } from "@/data/departments";
import {
  INTAKE_MODES,
  formatIntakeDate,
  intakeModeLabel,
  isOpen,
  lagosToday,
  type Intake,
} from "@/lib/intakes";

const ALL = "all";

interface Draft {
  id: string | null;
  department: string;
  starts_on: string;
  enrol_by: string;
  learning_mode: string;
  campus: string;
  seats: string;
  note: string;
  published: boolean;
}

const EMPTY: Draft = {
  id: null,
  department: ALL,
  starts_on: "",
  enrol_by: "",
  learning_mode: "any",
  campus: "",
  seats: "",
  note: "",
  published: true,
};

const departmentTitle = (slug: string | null) =>
  slug
    ? (departments.find((d) => d.slug === slug)?.title ?? slug)
    : "All departments";

/** Admin: the intake dates the department pages show as "Next intake". */
export default function AdminIntakes() {
  const { loading, isAdmin } = useIsStaff();
  const [rows, setRows] = useState<Intake[]>([]);
  const [busy, setBusy] = useState(true);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState<Draft>(EMPTY);

  const load = async () => {
    setBusy(true);
    // Upcoming ones, plus those that started in the last 60 days for reference.
    const since = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10);
    const { data, error } = await supabase
      .from("intakes")
      .select("*")
      .gte("starts_on", since)
      .order("starts_on", { ascending: true });
    if (error) toast.error(error.message);
    else setRows(data ?? []);
    setBusy(false);
  };

  useEffect(() => {
    if (isAdmin) void load();
  }, [isAdmin]);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const save = async () => {
    if (!draft.starts_on) {
      toast.error("Pick the start date");
      return;
    }
    if (draft.enrol_by && draft.enrol_by > draft.starts_on) {
      toast.error("Enrol-by must be on or before the start date");
      return;
    }
    const seats = draft.seats.trim() ? Number(draft.seats) : null;
    if (seats !== null && !(Number.isInteger(seats) && seats > 0)) {
      toast.error("Seats must be a whole number");
      return;
    }
    const row = {
      department_slug: draft.department === ALL ? null : draft.department,
      starts_on: draft.starts_on,
      enrol_by: draft.enrol_by || null,
      learning_mode: draft.learning_mode,
      campus: draft.campus.trim() || null,
      seats,
      note: draft.note.trim() || null,
      published: draft.published,
    };
    setSaving(true);
    const { error } = draft.id
      ? await supabase.from("intakes").update(row).eq("id", draft.id)
      : await supabase.from("intakes").insert(row);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(draft.id ? "Intake updated" : "Intake added");
    setDraft(EMPTY);
    await load();
  };

  const edit = (i: Intake) =>
    setDraft({
      id: i.id,
      department: i.department_slug ?? ALL,
      starts_on: i.starts_on,
      enrol_by: i.enrol_by ?? "",
      learning_mode: i.learning_mode,
      campus: i.campus ?? "",
      seats: i.seats != null ? String(i.seats) : "",
      note: i.note ?? "",
      published: i.published,
    });

  const remove = async (i: Intake) => {
    if (
      !window.confirm(
        `Delete the ${formatIntakeDate(i.starts_on)} intake for ${departmentTitle(i.department_slug)}?`,
      )
    )
      return;
    const { error } = await supabase.from("intakes").delete().eq("id", i.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Intake deleted");
    if (draft.id === i.id) setDraft(EMPTY);
    await load();
  };

  const today = lagosToday();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 pt-28 pb-16 max-w-4xl space-y-6">
        <AdminNav />
        <div>
          <h1 className="text-2xl font-bold">Intakes</h1>
          <p className="text-sm text-muted-foreground">
            Each department page shows its next published intake (and those set
            for all departments) until its enrol-by date, or its start date if
            there is none. With no intakes, the pages show no date at all.
          </p>
        </div>
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : !isAdmin ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This page is for Tech Faculty admins.
            </p>
            <Link to="/login?next=/admin/intakes">
              <Button>Sign in</Button>
            </Link>
          </div>
        ) : (
          <>
            <Card>
              <CardContent className="p-4 space-y-4">
                <h2 className="font-semibold">
                  {draft.id ? "Edit intake" : "Add an intake"}
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>Department</Label>
                    <Select
                      value={draft.department}
                      onValueChange={(v) => set("department", v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={ALL}>All departments</SelectItem>
                        {departments.map((d) => (
                          <SelectItem key={d.slug} value={d.slug}>
                            {d.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Study mode</Label>
                    <Select
                      value={draft.learning_mode}
                      onValueChange={(v) => set("learning_mode", v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {INTAKE_MODES.map((m) => (
                          <SelectItem key={m.value} value={m.value}>
                            {m.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="intake-start">Starts on</Label>
                    <Input
                      id="intake-start"
                      type="date"
                      value={draft.starts_on}
                      onChange={(e) => set("starts_on", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="intake-enrol-by">Enrol by (optional)</Label>
                    <Input
                      id="intake-enrol-by"
                      type="date"
                      value={draft.enrol_by}
                      onChange={(e) => set("enrol_by", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="intake-campus">Campus (optional)</Label>
                    <Input
                      id="intake-campus"
                      placeholder="e.g. Nnewi"
                      value={draft.campus}
                      onChange={(e) => set("campus", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="intake-seats">Seats (optional)</Label>
                    <Input
                      id="intake-seats"
                      inputMode="numeric"
                      value={draft.seats}
                      onChange={(e) => set("seats", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="intake-note">Short note (optional)</Label>
                    <Input
                      id="intake-note"
                      maxLength={200}
                      placeholder="e.g. Weekend classes"
                      value={draft.note}
                      onChange={(e) => set("note", e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <label className="flex items-center gap-2 text-sm">
                    <Switch
                      checked={draft.published}
                      onCheckedChange={(v) => set("published", v)}
                    />
                    Show on the website
                  </label>
                  <div className="flex gap-2">
                    {draft.id && (
                      <Button
                        variant="outline"
                        onClick={() => setDraft(EMPTY)}
                        disabled={saving}
                      >
                        Cancel
                      </Button>
                    )}
                    <Button onClick={save} disabled={saving}>
                      {saving && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {draft.id ? "Save changes" : "Add intake"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {busy ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : rows.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No intakes yet. Add the next start date above.
              </p>
            ) : (
              <div className="space-y-3">
                {rows.map((i) => (
                  <Card key={i.id}>
                    <CardContent className="p-4 flex flex-wrap items-center justify-between gap-3">
                      <div className="min-w-0 space-y-1">
                        <p className="font-semibold">
                          {formatIntakeDate(i.starts_on)} ·{" "}
                          {departmentTitle(i.department_slug)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {[
                            intakeModeLabel(i.learning_mode),
                            i.campus,
                            i.enrol_by &&
                              `enrol by ${formatIntakeDate(i.enrol_by)}`,
                            i.seats && `${i.seats} seats`,
                            i.note,
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {!isOpen(i, today) ? (
                          <Badge variant="secondary">Closed</Badge>
                        ) : i.published ? (
                          <Badge>On the website</Badge>
                        ) : (
                          <Badge variant="outline">Hidden</Badge>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => edit(i)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => remove(i)}
                        >
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
