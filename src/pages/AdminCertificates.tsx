import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import AdminNav from "@/components/admin/AdminNav";
import { Award, Loader2, ShieldCheck } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useIsStaff } from "@/hooks/useIsStaff";
import { getSupabase } from "@/integrations/supabase/lazy";
import { requestGraduateReview, type GraduateReviewResult } from "@/lib/graduate-review.functions";

function reviewNote(r: GraduateReviewResult | null): string {
  if (!r) return "The Google review email could not be sent.";
  switch (r.status) {
    case "sent": return `Google review request emailed to ${r.email}.`;
    case "already_sent": return `${r.email} was already asked for a review, so no new email went out.`;
    case "no_email": return "No graduate email found, so no review request was sent.";
    case "suppressed": return `${r.email} has unsubscribed or bounced, so no review request was sent.`;
    case "failed": return `The Google review email failed: ${r.error}`;
  }
}

const AdminCertificates = () => {
  const { toast } = useToast();
  // Enforced again by the admin-add-certificate function, which checks the admin role
  const { loading, isAdmin } = useIsStaff();
  const askForReview = useServerFn(requestGraduateReview);

  const [form, setForm] = useState({
    certificateNumber: "",
    studentName: "",
    courseName: "",
    certificateType: "Certificate of Achievement",
    issuedBy: "Tech Faculty NG",
    dateIssued: "",
    facultyId: "",
    graduateEmail: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.certificateNumber || !form.studentName || !form.courseName || !form.dateIssued) {
      toast({ title: "Missing fields", description: "Certificate number, student name, course, and date are required.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const supabase = await getSupabase();
    const { data, error } = await supabase.functions.invoke("admin-add-certificate", {
      body: form,
    });

    const fnError = (data as { error?: string } | null)?.error;
    if (error || fnError) {
      setSubmitting(false);
      toast({
        title: "Failed to add certificate",
        description: fnError || error?.message || "Unknown error",
        variant: "destructive",
      });
      return;
    }

    // Ask the graduate for a Google review (once per graduate email).
    const review = await askForReview({
      data: { certificateNumber: form.certificateNumber.trim(), email: form.graduateEmail.trim() || undefined },
    }).catch((e: Error) => ({ status: "failed" as const, error: e.message }));
    setSubmitting(false);

    toast({
      title: "Certificate added",
      description: `${form.certificateNumber.toUpperCase()} is now verifiable at /verify. ${reviewNote(review)}`,
    });
    setForm({
      certificateNumber: "",
      studentName: "",
      courseName: "",
      certificateType: "Certificate of Achievement",
      issuedBy: "Tech Faculty NG",
      dateIssued: "",
      facultyId: "",
      graduateEmail: "",
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto px-4 pt-32 pb-16">
        <section className="mx-auto max-w-2xl space-y-6">
          <AdminNav />
          <div className="text-center space-y-2">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <ShieldCheck className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Certificate Admin</h1>
            <p className="text-muted-foreground text-sm">
              Add new certificates so they become verifiable on the public /verify page.
            </p>
          </div>

          {loading ? (
            <Loader2 className="mx-auto h-6 w-6 animate-spin" />
          ) : !isAdmin ? (
            <Card>
              <CardContent className="pt-6 text-center text-sm text-muted-foreground">
                This page is for Tech Faculty admins. Sign in with an admin account to add certificates.
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2"><Award className="h-5 w-5 text-primary" /> Add new certificate</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="certificateNumber">Certificate Number *</Label>
                      <Input id="certificateNumber" placeholder="TFNG202602" value={form.certificateNumber} onChange={(e) => setForm({ ...form, certificateNumber: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="studentName">Student Name *</Label>
                      <Input id="studentName" value={form.studentName} onChange={(e) => setForm({ ...form, studentName: e.target.value })} required />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="courseName">Course *</Label>
                      <Input id="courseName" placeholder="Fullstack Web Development" value={form.courseName} onChange={(e) => setForm({ ...form, courseName: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="certificateType">Certificate Type</Label>
                      <Input id="certificateType" value={form.certificateType} onChange={(e) => setForm({ ...form, certificateType: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="issuedBy">Issued By</Label>
                      <Input id="issuedBy" value={form.issuedBy} onChange={(e) => setForm({ ...form, issuedBy: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateIssued">Date Issued *</Label>
                      <Input id="dateIssued" placeholder="April 01, 2026" value={form.dateIssued} onChange={(e) => setForm({ ...form, dateIssued: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="facultyId">Faculty ID (optional)</Label>
                      <Input id="facultyId" placeholder="auto-generated if blank" value={form.facultyId} onChange={(e) => setForm({ ...form, facultyId: e.target.value })} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="graduateEmail">Graduate Email (optional)</Label>
                      <Input id="graduateEmail" type="email" placeholder="uses the student's profile email if blank" value={form.graduateEmail} onChange={(e) => setForm({ ...form, graduateEmail: e.target.value })} />
                      <p className="text-xs text-muted-foreground">We email each graduate once, asking for a Google review.</p>
                    </div>
                  </div>
                  <Button type="submit" disabled={submitting} className="w-full">
                    {submitting ? "Adding..." : "Add Certificate"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AdminCertificates;