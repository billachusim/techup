import { useState } from "react";
import { Helmet } from "react-helmet-async";
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

const AdminCertificates = () => {
  const { toast } = useToast();
  // Enforced again by the admin-add-certificate function, which checks the admin role
  const { loading, isAdmin } = useIsStaff();

  const [form, setForm] = useState({
    certificateNumber: "",
    studentName: "",
    courseName: "",
    certificateType: "Certificate of Achievement",
    issuedBy: "Tech Faculty NG",
    dateIssued: "",
    facultyId: "",
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
    setSubmitting(false);

    const fnError = (data as { error?: string } | null)?.error;
    if (error || fnError) {
      toast({
        title: "Failed to add certificate",
        description: fnError || error?.message || "Unknown error",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Certificate added",
      description: `${form.certificateNumber.toUpperCase()} is now verifiable at /verify`,
    });
    setForm({
      certificateNumber: "",
      studentName: "",
      courseName: "",
      certificateType: "Certificate of Achievement",
      issuedBy: "Tech Faculty NG",
      dateIssued: "",
      facultyId: "",
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Admin · Add Certificate | Tech Faculty NG</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
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