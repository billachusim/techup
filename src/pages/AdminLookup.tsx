import { useState, type FormEvent, type ReactNode } from "react";
import { useServerFn } from "@tanstack/react-start";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";
import { toast } from "sonner";
import { Link } from "@/lib/router-compat";
import { useIsStaff } from "@/hooks/useIsStaff";
import AdminNav from "@/components/admin/AdminNav";
import {
  getStudentRecord,
  searchStudents,
  type StudentMatch,
} from "@/lib/student-lookup.functions";

type StudentRecord = Awaited<ReturnType<typeof getStudentRecord>>;

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const date = (s: string | null | undefined) =>
  s ? new Date(s).toLocaleDateString() : "—";
const money = (n: number | null, currency: string | null) =>
  n == null
    ? "—"
    : `${currency === "NGN" || !currency ? "₦" : `${currency} `}${Number(n).toLocaleString()}`;
const digits = (phone: string) => phone.replace(/\D/g, "").replace(/^0/, "234");

const STATUS_VARIANT: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  active: "default",
  paid: "default",
  completed: "default",
  reviewed: "default",
  pending: "secondary",
  submitted: "secondary",
  cancelled: "destructive",
  needs_changes: "destructive",
};
const StatusBadge = ({ status }: { status: string }) => (
  <Badge variant={STATUS_VARIANT[status] ?? "outline"}>
    {status.replace(/_/g, " ")}
  </Badge>
);

function Section({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: ReactNode;
}) {
  return (
    <Card>
      <CardContent className="p-5 space-y-3">
        <h2 className="font-semibold">
          {title}{" "}
          <span className="text-muted-foreground font-normal">({count})</span>
        </h2>
        {count === 0 ? (
          <p className="text-sm text-muted-foreground">None yet.</p>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}

/** Admin: find a student by name, phone, email or Faculty ID and see their whole record. */
export default function AdminLookup() {
  const { loading, isAdmin } = useIsStaff();
  const search = useServerFn(searchStudents);
  const fetchRecord = useServerFn(getStudentRecord);
  const [q, setQ] = useState("");
  const [matches, setMatches] = useState<StudentMatch[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [record, setRecord] = useState<StudentRecord | null>(null);
  const [opening, setOpening] = useState<string | null>(null);

  const onSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (q.trim().length < 2) {
      toast.error("Type at least 2 characters");
      return;
    }
    setSearching(true);
    setRecord(null);
    try {
      const found = await search({ data: { q } });
      setMatches(found);
      if (found.length === 1) await open(found[0]);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSearching(false);
    }
  };

  const open = async (m: StudentMatch) => {
    const key = m.facultyId ?? m.userId ?? "";
    setOpening(key);
    try {
      setRecord(
        await fetchRecord({
          data: m.facultyId
            ? { facultyId: m.facultyId }
            : { userId: m.userId! },
        }),
      );
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setOpening(null);
    }
  };

  const paid =
    record?.enrollments.filter((e) => e.status === "active" || e.paid_at) ?? [];
  const totalPaid = paid.reduce((s, e) => s + (e.amount_due ?? 0), 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 pt-28 pb-16 max-w-4xl space-y-6">
        <AdminNav />
        <div>
          <h1 className="text-2xl font-bold">Student lookup</h1>
          <p className="text-sm text-muted-foreground">
            Search by name, phone, email or Faculty ID to see a student's
            enrolments, payments, work and certificates together.
          </p>
        </div>
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : !isAdmin ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This page is for Tech Faculty admins. Sign in with an admin
              account.
            </p>
            <Link to="/login?next=/admin/lookup">
              <Button>Sign in</Button>
            </Link>
          </div>
        ) : (
          <>
            <form onSubmit={onSearch} className="flex gap-2">
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                maxLength={100}
                autoFocus
                placeholder="e.g. Chioma, 0803 123 4567 or TF-2026-0012"
                aria-label="Search students"
              />
              <Button type="submit" disabled={searching}>
                {searching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                <span className="ml-2">Search</span>
              </Button>
            </form>

            {matches &&
              !record &&
              (matches.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No student matches "{q}".
                </p>
              ) : (
                <ul className="divide-y rounded-md border">
                  {matches.map((m) => {
                    const key = m.facultyId ?? m.userId ?? "";
                    return (
                      <li key={key}>
                        <button
                          type="button"
                          onClick={() => open(m)}
                          disabled={opening !== null}
                          className="w-full text-left px-4 py-3 hover:bg-muted flex items-center justify-between gap-2"
                        >
                          <span className="min-w-0">
                            <span className="font-medium">{m.name}</span>
                            <span className="block text-xs text-muted-foreground truncate">
                              {[
                                m.facultyId ?? "No Faculty ID",
                                m.phone,
                                m.email,
                              ]
                                .filter(Boolean)
                                .join(" · ")}
                            </span>
                          </span>
                          {opening === key && (
                            <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ))}

            {record && (
              <div className="space-y-4">
                {matches && matches.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setRecord(null)}
                  >
                    Back to {matches.length} results
                  </Button>
                )}
                <Card>
                  <CardContent className="p-5 space-y-2">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="text-xl font-bold">{record.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {record.facultyId ?? "No Faculty ID yet"}
                        </p>
                      </div>
                      {!record.userId && (
                        <Badge variant="outline">
                          Registered, no account yet
                        </Badge>
                      )}
                    </div>
                    <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm">
                      <Row label="Phone">
                        {record.phone ? (
                          <>
                            {record.phone} ·{" "}
                            <a
                              className="underline"
                              href={`https://wa.me/${digits(record.phone)}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              WhatsApp
                            </a>
                          </>
                        ) : (
                          "—"
                        )}
                      </Row>
                      <Row label="Email">
                        {record.email ? (
                          <a
                            className="underline break-all"
                            href={`mailto:${record.email}`}
                          >
                            {record.email}
                          </a>
                        ) : (
                          "—"
                        )}
                      </Row>
                      <Row label="Department">
                        {record.department ?? record.courseInterest ?? "—"}
                      </Row>
                      <Row label="Learning mode">
                        {record.learningMode ?? "—"}
                      </Row>
                      <Row label="Cohort">
                        {record.cohort
                          ? `${MONTHS[record.cohort.month - 1]} ${record.cohort.year}`
                          : "—"}
                      </Row>
                      <Row label="Slack group">
                        {record.slackChannel ?? "—"}
                      </Row>
                      <Row label="Registered">{date(record.registeredAt)}</Row>
                      <Row label="Account created">
                        {date(record.signedUpAt)}
                      </Row>
                      {record.heardAboutUs && (
                        <Row label="Heard about us">{record.heardAboutUs}</Row>
                      )}
                    </dl>
                  </CardContent>
                </Card>

                <Section
                  title="Enrolments and payments"
                  count={record.enrollments.length}
                >
                  <p className="text-sm text-muted-foreground">
                    Paid so far:{" "}
                    <span className="font-medium text-foreground">
                      {money(totalPaid, "NGN")}
                    </span>{" "}
                    across {paid.length} enrolment{paid.length === 1 ? "" : "s"}
                    .
                  </p>
                  <ul className="space-y-2">
                    {record.enrollments.map((e) => (
                      <li
                        key={e.id}
                        className="rounded-md border p-3 text-sm space-y-1"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-medium">
                            {e.plan_name}
                            {e.learning_mode ? ` · ${e.learning_mode}` : ""}
                          </span>
                          <StatusBadge status={e.status} />
                        </div>
                        <p className="text-muted-foreground">
                          {money(e.amount_due, e.currency)} · started{" "}
                          {date(e.created_at)}
                          {e.paid_at ? ` · paid ${date(e.paid_at)}` : ""}
                          {e.coupon_code ? ` · coupon ${e.coupon_code}` : ""}
                        </p>
                        {(e.payment_reference || e.tx_ref) && (
                          <p className="text-xs text-muted-foreground break-all">
                            {e.payment_reference?.startsWith("manual:")
                              ? "Marked paid by hand"
                              : e.payment_reference
                                ? `Ref ${e.payment_reference}`
                                : ""}
                            {e.tx_ref
                              ? `${e.payment_reference ? " · " : ""}Tx ${e.tx_ref}`
                              : ""}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                  {record.enrollments.some((e) => e.status === "pending") && (
                    <p className="text-xs text-muted-foreground">
                      Confirm pending payments on{" "}
                      <Link to="/admin/students" className="underline">
                        Students
                      </Link>
                      .
                    </p>
                  )}
                </Section>

                <Section title="Courses" count={record.courses.length}>
                  <ul className="space-y-2">
                    {record.courses.map((c) => (
                      <li
                        key={c.id}
                        className="flex flex-wrap items-center justify-between gap-2 text-sm"
                      >
                        <span>
                          <span className="font-medium">{c.name}</span>
                          <span className="text-muted-foreground">
                            {" "}
                            · since {date(c.enrollmentDate)}
                            {c.progress
                              ? ` · ${c.progress.progress_percentage}% done${c.progress.classes_completed ? `, ${c.progress.classes_completed} classes` : ""}`
                              : ""}
                          </span>
                        </span>
                        <StatusBadge status={c.status} />
                      </li>
                    ))}
                  </ul>
                </Section>

                <Section title="Work" count={record.work.length}>
                  <p className="text-sm text-muted-foreground">
                    Running score:{" "}
                    <span className="font-medium text-foreground">
                      {record.averageScore != null
                        ? `${record.averageScore}%`
                        : "not scored yet"}
                    </span>
                    {record.reviewedCount
                      ? ` over ${record.reviewedCount} scored`
                      : ""}
                    .
                  </p>
                  <ul className="space-y-2">
                    {record.work.map((w) => (
                      <li
                        key={w.id}
                        className="rounded-md border p-3 text-sm space-y-1"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-medium">
                            {w.class_number ? `Class ${w.class_number}: ` : ""}
                            {w.title}
                          </span>
                          <span className="flex items-center gap-2">
                            {w.score != null && (
                              <span className="font-medium">{w.score}%</span>
                            )}
                            <StatusBadge status={w.status} />
                          </span>
                        </div>
                        <p className="text-muted-foreground">
                          {w.course_name ?? "Programme"} · {date(w.created_at)}
                        </p>
                        {w.proof_url && (
                          <a
                            href={w.proof_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs underline break-all"
                          >
                            {w.proof_url}
                          </a>
                        )}
                        {w.reviewer_note && (
                          <p className="text-xs border-l-2 pl-2 text-muted-foreground">
                            {w.reviewer_note}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </Section>

                <Section
                  title="Certificates"
                  count={record.certificates.length}
                >
                  <ul className="space-y-2">
                    {record.certificates.map((c) => (
                      <li
                        key={c.id}
                        className="flex flex-wrap items-center justify-between gap-2 text-sm"
                      >
                        <span>
                          <span className="font-medium">{c.course_name}</span>
                          <span className="text-muted-foreground">
                            {" "}
                            · {c.certificate_type} ·{" "}
                            {date(c.date_issued ?? c.issued_at ?? c.created_at)}
                          </span>
                        </span>
                        <Link
                          to={`/verify/${c.certificate_number}`}
                          className="underline"
                        >
                          {c.certificate_number}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </Section>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex gap-2">
      <dt className="text-muted-foreground shrink-0">{label}:</dt>
      <dd className="min-w-0">{children}</dd>
    </div>
  );
}
