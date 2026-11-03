import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Link } from "@/lib/router-compat";
import { useIsStaff } from "@/hooks/useIsStaff";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import AdminNav from "@/components/admin/AdminNav";
import { normalizeRef } from "@/lib/ref-code";
import { FIELD_REP_COMMISSION_PERCENT } from "../../supabase/functions/_shared/pricing.ts";

type Rep =
  Database["public"]["Functions"]["admin_field_rep_summary"]["Returns"][number];
type Activity = {
  leads: {
    created_at: string;
    name: string | null;
    contact: string;
    interest: string;
    status: string;
  }[];
  enrolments: {
    created_at: string;
    name: string | null;
    phone: string | null;
    faculty_id: string;
    plan_name: string;
    status: string;
    received: number | null;
  }[];
};

const SITE = "https://techfaculty.ng";
const WINDOWS = [7, 30, 90];
const naira = (n: number) => `₦${Math.round(Number(n)).toLocaleString()}`;

/** A code from the rep's first name plus two digits, e.g. CHIDI07. */
const suggestCode = (name: string) => {
  const base =
    name
      .trim()
      .split(/\s+/)[0]
      ?.toUpperCase()
      .replace(/[^A-Z]/g, "")
      .slice(0, 10) || "REP";
  return `${base}${String(Math.floor(Math.random() * 90) + 10)}`;
};

/** Admin: field reps, their share links, what they brought in and what they're owed. */
export default function AdminReps() {
  const { loading, isAdmin } = useIsStaff();
  const [reps, setReps] = useState<Rep[]>([]);
  const [days, setDays] = useState(7);
  const [busy, setBusy] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [activity, setActivity] = useState<Activity | null>(null);
  const [form, setForm] = useState({ name: "", code: "", phone: "", area: "" });

  const load = async () => {
    setBusy(true);
    const { data, error } = await supabase.rpc("admin_field_rep_summary", {
      _days: days,
    });
    if (error) toast.error(error.message);
    else setReps(data ?? []);
    setBusy(false);
  };

  useEffect(() => {
    if (isAdmin) void load();
  }, [isAdmin, days]);

  const addRep = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = normalizeRef(form.code || suggestCode(form.name));
    if (!form.name.trim() || !code) {
      toast.error("Add a name, and a code of 3-24 letters, numbers or dashes.");
      return;
    }
    setSaving("new");
    const { error } = await supabase.from("field_reps").insert({
      name: form.name.trim(),
      code,
      phone: form.phone.trim() || null,
      area: form.area.trim() || null,
    });
    if (error)
      toast.error(
        error.message.includes("duplicate")
          ? "That code is taken. Pick another."
          : error.message,
      );
    else {
      toast.success(`Added ${form.name.trim()} with code ${code}`);
      setForm({ name: "", code: "", phone: "", area: "" });
      await load();
    }
    setSaving(null);
  };

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Link copied");
    } catch {
      toast.error("Couldn't copy. Select the link and copy it.");
    }
  };

  const recordPayout = async (r: Rep) => {
    const raw = window.prompt(
      `How much did you pay ${r.name}? (₦, owed now ${naira(r.owed)})`,
      String(Math.max(0, r.owed)),
    );
    const amount = Number((raw ?? "").replace(/[^\d.]/g, ""));
    if (!raw || !(amount > 0)) return;
    const note =
      window.prompt("Note (optional), e.g. week ending 7 Nov, bank transfer") ??
      "";
    setSaving(r.id);
    const { error } = await supabase
      .from("field_rep_payouts")
      .insert({ rep_id: r.id, amount, note: note.trim() || null });
    if (error) toast.error(error.message);
    else {
      toast.success(`Recorded ${naira(amount)} paid to ${r.name}`);
      await load();
    }
    setSaving(null);
  };

  const setStatus = async (r: Rep, status: "active" | "paused") => {
    setSaving(r.id);
    const { error } = await supabase
      .from("field_reps")
      .update({ status })
      .eq("id", r.id);
    if (error) toast.error(error.message);
    else await load();
    setSaving(null);
  };

  const toggleActivity = async (r: Rep) => {
    if (open === r.id) {
      setOpen(null);
      return;
    }
    setOpen(r.id);
    setActivity(null);
    const { data, error } = await supabase.rpc("admin_field_rep_activity", {
      _code: r.code,
      _days: Math.max(days, 30),
    });
    if (error) toast.error(error.message);
    else setActivity(data as unknown as Activity);
  };

  const owedTotal = reps.reduce(
    (sum, r) => sum + Math.max(0, Number(r.owed)),
    0,
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 pt-28 pb-16 max-w-4xl space-y-6">
        <AdminNav />
        <div>
          <h1 className="text-2xl font-bold">Field reps</h1>
          <p className="text-sm text-muted-foreground">
            Each rep shares their own link. Leads, free-bootcamp sign-ups and
            enrolments that come through it are credited to them, and they earn{" "}
            {FIELD_REP_COMMISSION_PERCENT}% of what their recruits pay
            (instalments included). The student gets no discount. Visit pay and
            bootcamp attendance bonuses are tracked in the field-reps sheet.
          </p>
        </div>
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : !isAdmin ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This page is for Tech Faculty admins.
            </p>
            <Link to="/login?next=/admin/reps">
              <Button>Sign in</Button>
            </Link>
          </div>
        ) : (
          <>
            <Card>
              <CardContent className="p-4">
                <form onSubmit={addRep} className="grid gap-2 sm:grid-cols-5">
                  <Input
                    placeholder="Rep's name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="sm:col-span-2"
                  />
                  <Input
                    placeholder="Code (optional)"
                    value={form.code}
                    onChange={(e) =>
                      setForm({ ...form, code: e.target.value.toUpperCase() })
                    }
                  />
                  <Input
                    placeholder="Phone"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Area"
                    value={form.area}
                    onChange={(e) => setForm({ ...form, area: e.target.value })}
                  />
                  <Button
                    type="submit"
                    disabled={saving === "new"}
                    className="sm:col-span-5 sm:justify-self-start"
                  >
                    {saving === "new" && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Add rep
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm">
                {owedTotal > 0 ? (
                  <>
                    <span className="font-semibold">{naira(owedTotal)}</span> in
                    commission to pay.
                  </>
                ) : (
                  "No commission owed right now."
                )}
              </p>
              <div className="flex items-center gap-1 text-sm">
                <span className="text-muted-foreground mr-1">
                  Counts for the last
                </span>
                {WINDOWS.map((d) => (
                  <Button
                    key={d}
                    size="sm"
                    variant={d === days ? "default" : "ghost"}
                    onClick={() => setDays(d)}
                  >
                    {d} days
                  </Button>
                ))}
              </div>
            </div>

            {busy ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : reps.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No reps yet. Add one above to get their link.
              </p>
            ) : (
              <div className="space-y-3">
                {reps.map((r) => {
                  const link = `${SITE}/?ref=${r.code}`;
                  const shortLink = `${SITE}/r/${r.code}`;
                  return (
                    <Card key={r.id}>
                      <CardContent className="p-4 space-y-3">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0 space-y-1">
                            <p className="font-semibold">
                              {r.name}{" "}
                              <span className="text-muted-foreground font-normal">
                                · {r.code}
                              </span>
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {[r.area, r.phone].filter(Boolean).join(" · ") ||
                                "No area or phone yet"}
                            </p>
                            <p className="text-xs break-all">
                              <button
                                type="button"
                                className="text-link hover:underline"
                                onClick={() => copy(link)}
                              >
                                {link}
                              </button>
                              <span className="text-muted-foreground">
                                {" "}
                                · QR/short: {shortLink}
                              </span>
                            </p>
                          </div>
                          <Badge
                            variant={
                              r.status === "active" ? "default" : "secondary"
                            }
                          >
                            {r.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
                          <Stat label={`Leads (${days}d)`} value={r.leads} />
                          <Stat
                            label={`Bootcamp sign-ups (${days}d)`}
                            value={r.bootcamp_signups}
                          />
                          <Stat
                            label={`Paid enrolments (${days}d)`}
                            value={r.paid_enrolments}
                          />
                          <Stat
                            label="Owed now"
                            value={naira(r.owed)}
                            hint={`${naira(r.commission)} earned on ${naira(r.received)} received · ${naira(r.paid_out)} paid`}
                          />
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            disabled={saving === r.id}
                            onClick={() => recordPayout(r)}
                          >
                            Record payout
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleActivity(r)}
                          >
                            {open === r.id ? "Hide sign-ups" : "Sign-ups"}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={saving === r.id}
                            onClick={() =>
                              setStatus(
                                r,
                                r.status === "active" ? "paused" : "active",
                              )
                            }
                          >
                            {r.status === "active" ? "Pause" : "Activate"}
                          </Button>
                        </div>
                        {open === r.id && <ActivityList activity={activity} />}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: number | string;
  hint?: string;
}) {
  return (
    <div className="rounded-md bg-muted/50 p-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-semibold">{value}</p>
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

function ActivityList({ activity }: { activity: Activity | null }) {
  if (!activity) return <Loader2 className="h-4 w-4 animate-spin" />;
  const rows = [
    ...activity.enrolments.map((e) => ({
      at: e.created_at,
      who: e.name || e.faculty_id,
      what: `${e.plan_name} · ${e.status}${e.received ? ` · ${naira(e.received)} received` : ""}`,
      contact: e.phone,
    })),
    ...activity.leads.map((l) => ({
      at: l.created_at,
      who: l.name || "Lead",
      what: `Lead · ${l.interest} · ${l.status}`,
      contact: l.contact,
    })),
  ].sort((a, b) => b.at.localeCompare(a.at));
  if (rows.length === 0)
    return (
      <p className="text-sm text-muted-foreground">
        Nothing through this link yet.
      </p>
    );
  return (
    <ul className="divide-y text-sm">
      {rows.map((row, i) => (
        <li key={i} className="py-1.5 flex flex-wrap justify-between gap-2">
          <span>
            <span className="font-medium">{row.who}</span>{" "}
            <span className="text-muted-foreground">{row.what}</span>
          </span>
          <span className="text-xs text-muted-foreground">
            {[row.contact, new Date(row.at).toLocaleDateString()]
              .filter(Boolean)
              .join(" · ")}
          </span>
        </li>
      ))}
    </ul>
  );
}
