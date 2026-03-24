import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Award, BadgeCheck, Search, ShieldCheck } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const certificateRecords = {
  TFNG202601: {
    name: "Mbanefo Ifunanya Lilian",
    course: "Fullstack Web Development",
    certificateType: "Certificate of Achievement",
    issuedBy: "Tech Faculty NG",
    dateIssued: "April 01, 2026",
  },
} as const;

type CertificateRecord = (typeof certificateRecords)[keyof typeof certificateRecords];
type Status = "idle" | "success" | "error";

const Verify = () => {
  const [certificateId, setCertificateId] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<CertificateRecord | null>(null);

  const normalizedId = useMemo(() => certificateId.trim().toUpperCase(), [certificateId]);

  const handleVerify = () => {
    if (!normalizedId) {
      setStatus("error");
      setResult(null);
      setMessage("Please enter a certificate ID.");
      return;
    }

    const match = certificateRecords[normalizedId as keyof typeof certificateRecords];

    if (!match) {
      setStatus("error");
      setResult(null);
      setMessage(`Certificate ID \"${normalizedId}\" was not found in the Tech Faculty NG database.`);
      return;
    }

    setStatus("success");
    setResult(match);
    setMessage("Certificate verified successfully.");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Verify Certificate | Tech Faculty NG</title>
        <meta
          name="description"
          content="Verify and authenticate certificates issued by Tech Faculty NG using the official online certificate verification system."
        />
        <meta property="og:title" content="Verify Certificate | Tech Faculty NG" />
        <meta
          property="og:description"
          content="Use the official Tech Faculty NG certificate verification system to confirm certificate authenticity online."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://techfaculty.ng/verify" />
        <link rel="canonical" href="https://techfaculty.ng/verify" />
      </Helmet>

      <Header />

      <main className="container mx-auto px-4 pt-32 pb-16">
        <section className="mx-auto max-w-4xl space-y-8">
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
              <img
                src="/verify/TFNGCertVerify.jpg"
                alt="Tech Faculty NG certificate verification logo"
                className="h-full w-full object-cover"
              />
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Official verification portal</p>
            <h1 className="text-4xl font-bold tracking-tight text-gradient md:text-5xl">Certificate Verification System</h1>
            <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg">
              Authenticate any credential issued by Tech Faculty NG. Enter the unique certificate ID to confirm authenticity.
            </p>
          </div>

          <Card className="border-border bg-card/90 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Search className="h-5 w-5 text-primary" />
                Verify a certificate
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-3 md:flex-row">
                <Input
                  value={certificateId}
                  onChange={(event) => setCertificateId(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleVerify();
                    }
                  }}
                  placeholder="e.g. TFNG202601"
                  aria-label="Certificate ID"
                  className="h-12 flex-1 rounded-xl"
                />
                <Button type="button" onClick={handleVerify} className="h-12 rounded-xl px-6">
                  <ShieldCheck className="h-4 w-4" />
                  Verify Certificate
                </Button>
              </div>

              {message ? (
                <div
                  className={[
                    "rounded-2xl border px-4 py-3 text-sm",
                    status === "success"
                      ? "border-primary/30 bg-primary/10 text-foreground"
                      : "border-destructive/30 bg-destructive/10 text-destructive",
                  ].join(" ")}
                >
                  {message}
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card className="border-border bg-card/90 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <BadgeCheck className="h-5 w-5 text-primary" />
                Verified record
              </CardTitle>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-border bg-background p-4">
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="mt-1 text-lg font-semibold">{result.name}</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-background p-4">
                    <p className="text-sm text-muted-foreground">Course</p>
                    <p className="mt-1 text-lg font-semibold">{result.course}</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-background p-4">
                    <p className="text-sm text-muted-foreground">Certificate Type</p>
                    <p className="mt-1 text-lg font-semibold">{result.certificateType}</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-background p-4">
                    <p className="text-sm text-muted-foreground">Certificate ID</p>
                    <p className="mt-1 text-lg font-semibold">{normalizedId}</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-background p-4">
                    <p className="text-sm text-muted-foreground">Issued By</p>
                    <p className="mt-1 text-lg font-semibold">{result.issuedBy}</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-background p-4">
                    <p className="text-sm text-muted-foreground">Date Issued</p>
                    <p className="mt-1 text-lg font-semibold">{result.dateIssued}</p>
                  </div>
                </div>
              ) : (
                <div className="flex min-h-40 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-background px-6 py-10 text-center">
                  <Award className="mb-3 h-10 w-10 text-primary" />
                  <p className="text-lg font-semibold">No certificate verified yet</p>
                  <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                    Enter a certificate ID above to display the official verification record.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Verify;
