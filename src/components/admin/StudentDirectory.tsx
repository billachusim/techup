import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Loader2, Mail, MessageCircle, Search } from "lucide-react";
import { toast } from "sonner";
import {
  listStudentDirectory,
  type DirectoryStudent,
  type StudentMatch,
  type StudentStanding,
} from "@/lib/student-lookup.functions";
import { StudentLookupPanel } from "@/pages/AdminLookup";

const STANDINGS: { v: StudentStanding | "all"; label: string }[] = [
  { v: "all", label: "All" },
  { v: "current", label: "Current" },
  { v: "pending", label: "Awaiting payment" },
  { v: "past", label: "Past" },
  { v: "registered", label: "Registered only" },
];
const STANDING_BADGE: Record<StudentStanding, "default" | "secondary" | "outline"> = {
  current: "default",
  pending: "secondary",
  past: "outline",
  registered: "outline",
};
const waDigits = (phone: string) => phone.replace(/\D/g, "").replace(/^0/, "234");

/** Admin: every student, filterable by department and current/past, with contact shortcuts. */
export function StudentDirectory() {
  const list = useServerFn(listStudentDirectory);
  const [rows, setRows] = useState<DirectoryStudent[] | null>(null);
  const [q, setQ] = useState("");
  const [dept, setDept] = useState("all");
  const [standing, setStanding] = useState<StudentStanding | "all">("current");
  const [open, setOpen] = useState<StudentMatch | null>(null);
  const [limit, setLimit] = useState(50);

  useEffect(() => {
    list().then(setRows, (e) => toast.error((e as Error).message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const departments = useMemo(() => {
    const counts = new Map<string, number>();
    for (const r of rows ?? []) counts.set(r.department ?? "No department", (counts.get(r.department ?? "No department") ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [rows]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: 0 };
    for (const r of rows ?? []) {
      if (dept !== "all" && (r.department ?? "No department") !== dept) continue;
      c.all++;
      c[r.standing] = (c[r.standing] ?? 0) + 1;
    }
    return c;
  }, [rows, dept]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    const digits = term.replace(/\D/g, "");
    return (rows ?? []).filter((r) => {
      if (dept !== "all" && (r.department ?? "No department") !== dept) return false;
      if (standing !== "all" && r.standing !== standing) return false;
      if (!term) return true;
      return (
        r.name.toLowerCase().includes(term) ||
        r.facultyId.toLowerCase().includes(term) ||
        (r.email ?? "").toLowerCase().includes(term) ||
        (digits.length >= 4 && (r.phone ?? "").replace(/\D/g, "").includes(digits.slice(-10)))
      );
    });
  }, [rows, q, dept, standing]);

  if (open) {
    return <StudentLookupPanel openWith={open} onClose={() => setOpen(null)} />;
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-2 sm:grid-cols-[1fr_220px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => { setQ(e.target.value); setLimit(50); }}
            placeholder="Search name, phone, email or Faculty ID"
            aria-label="Search students"
            className="pl-9"
          />
        </div>
        <select
          value={dept}
          onChange={(e) => { setDept(e.target.value); setLimit(50); }}
          aria-label="Department"
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="all">All departments ({rows?.length ?? 0})</option>
          {departments.map(([d, n]) => (
            <option key={d} value={d}>{d} ({n})</option>
          ))}
        </select>
      </div>
      <div className="flex flex-wrap gap-2">
        {STANDINGS.map((s) => (
          <Button key={s.v} size="sm" variant={standing === s.v ? "default" : "outline"} onClick={() => { setStanding(s.v); setLimit(50); }}>
            {s.label} <span className="ml-1.5 opacity-70">{counts[s.v] ?? 0}</span>
          </Button>
        ))}
      </div>

      {!rows ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">No students match these filters.</p>
      ) : (
        <Card>
          <CardContent className="p-0">
            <ul className="divide-y">
              {filtered.slice(0, limit).map((r) => (
                <li key={r.facultyId} className="flex flex-wrap items-center gap-3 px-4 py-3">
                  <button
                    type="button"
                    onClick={() => setOpen({ facultyId: r.facultyId, userId: r.userId, name: r.name, email: r.email, phone: r.phone })}
                    className="min-w-0 flex-1 text-left"
                  >
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-medium hover:underline">{r.name}</span>
                      <Badge variant={STANDING_BADGE[r.standing]} className="capitalize">
                        {STANDINGS.find((s) => s.v === r.standing)?.label}
                      </Badge>
                      {r.hasCertificate && <Badge variant="outline">Certified</Badge>}
                    </span>
                    <span className="block text-xs text-muted-foreground truncate">
                      {[r.facultyId, r.department, r.plan, r.learningMode, r.location, `Joined ${new Date(r.joinedAt).toLocaleDateString()}`]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                  </button>
                  <div className="flex shrink-0 gap-2">
                    {r.phone && (
                      <Button asChild size="sm" variant="outline">
                        <a href={`https://wa.me/${waDigits(r.phone)}?text=${encodeURIComponent(`Hi ${r.name.split(" ")[0]}, this is Tech Faculty.`)}`} target="_blank" rel="noreferrer" aria-label={`WhatsApp ${r.name}`}>
                          <MessageCircle className="h-4 w-4" /><span className="ml-1.5 hidden sm:inline">WhatsApp</span>
                        </a>
                      </Button>
                    )}
                    {r.email && (
                      <Button asChild size="sm" variant="outline">
                        <a href={`mailto:${r.email}?subject=${encodeURIComponent("Tech Faculty")}`} aria-label={`Email ${r.name}`}>
                          <Mail className="h-4 w-4" /><span className="ml-1.5 hidden sm:inline">Email</span>
                        </a>
                      </Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
      {filtered.length > limit && (
        <Button variant="outline" size="sm" onClick={() => setLimit((l) => l + 100)}>
          Show more ({filtered.length - limit} left)
        </Button>
      )}
    </div>
  );
}
