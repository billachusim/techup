import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Ban, Loader2, Pencil, RotateCcw, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  searchCertificates,
  setCertificateRevoked,
  updateCertificate,
  type AdminCertificate,
} from "@/lib/admin-certificates.functions";

type EditForm = {
  studentName: string;
  courseName: string;
  certificateType: string;
  issuedBy: string;
  dateIssued: string;
};

/** Search, edit, revoke and reinstate certificates. `refreshKey` reloads the list. */
const CertificateManager = ({ refreshKey }: { refreshKey: number }) => {
  const { toast } = useToast();
  const search = useServerFn(searchCertificates);
  const update = useServerFn(updateCertificate);
  const setRevoked = useServerFn(setCertificateRevoked);

  const [query, setQuery] = useState("");
  const [rows, setRows] = useState<AdminCertificate[]>([]);
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState<AdminCertificate | null>(null);
  const [editForm, setEditForm] = useState<EditForm | null>(null);
  const [revoking, setRevoking] = useState<AdminCertificate | null>(null);
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(
    async (q: string) => {
      setLoading(true);
      try {
        setRows(await search({ data: { query: q } }));
      } catch (e) {
        toast({ title: "Could not load certificates", description: (e as Error).message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    },
    [search, toast],
  );

  // Reload when a certificate is added; the search box keeps its text.
  useEffect(() => {
    load(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  const replaceRow = (row: AdminCertificate) => setRows((rs) => rs.map((r) => (r.id === row.id ? row : r)));

  const openEdit = (c: AdminCertificate) => {
    setEditing(c);
    setEditForm({
      studentName: c.student_name ?? "",
      courseName: c.course_name,
      certificateType: c.certificate_type,
      issuedBy: c.issued_by,
      dateIssued: c.date_issued ?? "",
    });
  };

  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing || !editForm) return;
    if (!editForm.studentName.trim() || !editForm.courseName.trim() || !editForm.dateIssued.trim()) {
      toast({ title: "Missing fields", description: "Student name, course, and date are required.", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      replaceRow(await update({ data: { id: editing.id, ...editForm } }));
      toast({ title: "Certificate updated", description: `${editing.certificate_number} now shows the new details on /verify.` });
      setEditing(null);
    } catch (err) {
      toast({ title: "Update failed", description: (err as Error).message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const confirmRevoke = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revoking) return;
    if (!reason.trim()) {
      toast({ title: "Reason needed", description: "Say why this certificate is being revoked.", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      replaceRow(await setRevoked({ data: { id: revoking.id, revoke: true, reason: reason.trim() } }));
      toast({ title: "Certificate revoked", description: `${revoking.certificate_number} no longer verifies on /verify.` });
      setRevoking(null);
      setReason("");
    } catch (err) {
      toast({ title: "Revoke failed", description: (err as Error).message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const reinstate = async (c: AdminCertificate) => {
    if (!window.confirm(`Reinstate ${c.certificate_number}? It will verify on /verify again.`)) return;
    try {
      replaceRow(await setRevoked({ data: { id: c.id, revoke: false } }));
      toast({ title: "Certificate reinstated", description: `${c.certificate_number} verifies again.` });
    } catch (err) {
      toast({ title: "Reinstate failed", description: (err as Error).message, variant: "destructive" });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5 text-primary" /> Find and manage certificates
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            load(query);
          }}
        >
          <Input
            placeholder="Certificate number, student name, course or faculty ID"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search certificates"
          />
          <Button type="submit" variant="outline" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
          </Button>
        </form>

        {loading && rows.length === 0 ? (
          <Loader2 className="mx-auto h-5 w-5 animate-spin" />
        ) : rows.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">No certificates found.</p>
        ) : (
          <ul className="divide-y divide-border rounded-md border border-border">
            {rows.map((c) => (
              <li key={c.id} className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 space-y-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-sm font-semibold">{c.certificate_number}</span>
                    {c.revoked_at ? <Badge variant="destructive">Revoked</Badge> : null}
                  </div>
                  <p className="truncate text-sm">
                    {c.student_name || "—"} · {c.course_name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {c.date_issued || (c.issued_at ? new Date(c.issued_at).toLocaleDateString() : "")}
                    {c.revoked_at
                      ? ` · Revoked ${new Date(c.revoked_at).toLocaleDateString()}${c.revoked_reason ? `: ${c.revoked_reason}` : ""}`
                      : ""}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button size="sm" variant="outline" onClick={() => openEdit(c)}>
                    <Pencil className="h-4 w-4" /> Edit
                  </Button>
                  {c.revoked_at ? (
                    <Button size="sm" variant="outline" onClick={() => reinstate(c)}>
                      <RotateCcw className="h-4 w-4" /> Reinstate
                    </Button>
                  ) : (
                    <Button size="sm" variant="destructive" onClick={() => { setRevoking(c); setReason(""); }}>
                      <Ban className="h-4 w-4" /> Revoke
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
        {rows.length === 50 ? (
          <p className="text-xs text-muted-foreground">Showing the 50 newest matches. Search to narrow the list.</p>
        ) : null}
      </CardContent>

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          <form onSubmit={saveEdit} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Edit {editing?.certificate_number}</DialogTitle>
              <DialogDescription>
                The certificate number can't change. Saving does not email the graduate.
              </DialogDescription>
            </DialogHeader>
            {editForm ? (
              <div className="grid gap-3">
                {(
                  [
                    ["studentName", "Student Name *"],
                    ["courseName", "Course *"],
                    ["certificateType", "Certificate Type"],
                    ["issuedBy", "Issued By"],
                    ["dateIssued", "Date Issued *"],
                  ] as const
                ).map(([key, label]) => (
                  <div key={key} className="space-y-1">
                    <Label htmlFor={`edit-${key}`}>{label}</Label>
                    <Input
                      id={`edit-${key}`}
                      value={editForm[key]}
                      onChange={(e) => setEditForm({ ...editForm, [key]: e.target.value })}
                    />
                  </div>
                ))}
              </div>
            ) : null}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
              <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save changes"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!revoking} onOpenChange={(open) => !open && setRevoking(null)}>
        <DialogContent>
          <form onSubmit={confirmRevoke} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Revoke {revoking?.certificate_number}?</DialogTitle>
              <DialogDescription>
                Anyone checking it on /verify will be told it has been revoked. You can reinstate it later.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-1">
              <Label htmlFor="revoke-reason">Reason (only admins see this) *</Label>
              <Textarea id="revoke-reason" value={reason} onChange={(e) => setReason(e.target.value)} maxLength={500} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setRevoking(null)}>Cancel</Button>
              <Button type="submit" variant="destructive" disabled={saving}>
                {saving ? "Revoking..." : "Revoke certificate"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default CertificateManager;
