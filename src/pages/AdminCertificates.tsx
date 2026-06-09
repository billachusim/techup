import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Award, LogOut, ShieldCheck } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ADMIN_EMAIL = "nnewitech@gmail.com";
const ADMIN_PASSWORD = "nnewitech7242";
const SESSION_KEY = "tfng_admin_cert_session";

const AdminCertificates = () => {
  const { toast } = useToast();
  const [authed, setAuthed] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === "1") setAuthed(true);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "1");
      setAuthed(true);
    } else {
      toast({ title: "Invalid credentials", description: "Email or password is incorrect.", variant: "destructive" });
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthed(false);
    setEmail("");
    setPassword("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.certificateNumber || !form.studentName || !form.courseName || !form.dateIssued) {
      toast({ title: "Missing fields", description: "Certificate number, student name, course, and date are required.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { data, error } = await supabase.functions.invoke("admin-add-certificate", {
      body: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD, ...form },
    });
    setSubmitting(false);

    if (error || (data as any)?.error) {
      toast({
        title: "Failed to add certificate",
        description: (data as any)?.error || error?.message || "Unknown error",
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
          <div className="text-center space-y-2">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <ShieldCheck className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Certificate Admin</h1>
            <p className="text-muted-foreground text-sm">
              Add new certificates so they become verifiable on the public /verify page.
            </p>
          </div>

          {!authed ? (
            <Card>
              <CardHeader>
                <CardTitle>Admin sign-in</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  </div>
                  <Button type="submit" className="w-full">Sign in</Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2"><Award className="h-5 w-5 text-primary" /> Add new certificate</CardTitle>
                <Button variant="ghost" size="sm" onClick={handleLogout}><LogOut className="h-4 w-4 mr-1" /> Sign out</Button>
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