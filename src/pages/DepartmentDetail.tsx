import { Helmet } from "react-helmet-async";
import { Link, Navigate, useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import JoinWhatsAppButton from "@/components/JoinWhatsAppButton";
import { COMMUNITY_WHATSAPP_URL } from "@/lib/whatsapp";
import { ArrowLeft, CheckCircle2, Clock, MessageCircle, Users, TrendingUp } from "lucide-react";
import { departments, getDepartmentBySlug } from "@/data/departments";

const DepartmentDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const dept = slug ? getDepartmentBySlug(slug) : undefined;

  if (!dept) return <Navigate to="/departments" replace />;

  const url = `https://techfaculty.ng/departments/${dept.slug}`;

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: `${dept.title} Programme — Tech Faculty NG`,
    description: dept.metaDescription,
    url,
    keywords: dept.keywords.join(", "),
    inLanguage: "en-NG",
    teaches: dept.courses,
    provider: {
      "@type": "EducationalOrganization",
      name: "Tech Faculty NG",
      url: "https://techfaculty.ng/",
      areaServed: "NG",
    },
    hasCourseInstance: [
      {
        "@type": "CourseInstance",
        courseMode: ["Online", "Onsite"],
        courseWorkload: dept.duration,
        location: {
          "@type": "Place",
          name: "Technology Incubation Centre, Nnewi",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Nnewi",
            addressRegion: "Anambra State",
            addressCountry: "NG",
          },
        },
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: dept.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://techfaculty.ng/" },
      { "@type": "ListItem", position: 2, name: "Departments", item: "https://techfaculty.ng/departments" },
      { "@type": "ListItem", position: 3, name: dept.title, item: url },
    ],
  };

  const related = departments.filter((d) => d.slug !== dept.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{dept.metaTitle}</title>
        <meta name="description" content={dept.metaDescription} />
        <meta name="keywords" content={dept.keywords.join(", ")} />
        <meta property="og:title" content={dept.metaTitle} />
        <meta property="og:description" content={dept.metaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <link rel="canonical" href={url} />
        <script type="application/ld+json">{JSON.stringify(courseSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>
      <Header />
      <main className="pt-20">
        <section className="px-4 pt-8">
          <div className="container mx-auto max-w-4xl">
            <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground mb-4">
              <Link to="/" className="hover:text-primary">Home</Link>
              <span className="mx-2">/</span>
              <Link to="/departments" className="hover:text-primary">Departments</Link>
              <span className="mx-2">/</span>
              <span className="text-foreground">{dept.title}</span>
            </nav>
            <Link to="/departments">
              <Button variant="ghost" size="sm" className="-ml-2 mb-4">
                <ArrowLeft size={16} className="mr-1" /> All departments
              </Button>
            </Link>
          </div>
        </section>

        {/* Hero */}
        <section className="px-4 pb-8">
          <div className="container mx-auto max-w-4xl">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {dept.trending && (
                <Badge variant="secondary" className="gap-1 text-xs">
                  <TrendingUp className="h-3 w-3" /> Trending
                </Badge>
              )}
              <Badge variant="outline" className="text-xs">{dept.difficulty}</Badge>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" /> {dept.duration}
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Users className="h-3 w-3" /> {dept.enrollment} enrolled
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              <span className="text-gradient">{dept.title}</span> Department
            </h1>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-4">
              {dept.intro}
            </p>
            <JoinWhatsAppButton
              url={COMMUNITY_WHATSAPP_URL}
              groupName="the Tech Faculty WhatsApp community"
              size="lg"
            >
              <span className="flex items-center justify-center gap-2">
                Join the {dept.title} community <MessageCircle size={16} />
              </span>
            </JoinWhatsAppButton>
          </div>
        </section>

        {/* Curriculum */}
        <section className="px-4 pb-10">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-2xl font-bold mb-4">What you will learn</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {dept.courses.map((course) => (
                <div key={course} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                  <span>{course}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tools */}
        <section className="px-4 pb-10">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-2xl font-bold mb-4">Tools and technologies</h2>
            <div className="flex flex-wrap gap-2">
              {dept.tools.map((tool) => (
                <Badge key={tool} variant="secondary" className="px-3 py-1 text-sm">{tool}</Badge>
              ))}
            </div>
          </div>
        </section>

        {/* Audience */}
        <section className="px-4 pb-10">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-2xl font-bold mb-4">Who this department is for</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {dept.audience.map((a) => (
                <li key={a} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Outcomes */}
        <section className="px-4 pb-10">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-2xl font-bold mb-4">Career outcomes and earning potential</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {dept.outcomes.map((o) => (
                <Card key={o.role}>
                  <CardContent className="p-5">
                    <p className="font-semibold mb-1">{o.role}</p>
                    <p className="text-sm text-muted-foreground">{o.salary}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Ranges reflect advertised Nigerian and remote-contract pay observed on our jobs board and partner platforms; individual offers vary.
            </p>
          </div>
        </section>

        {/* How to join */}
        <section className="px-4 pb-10">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-2xl font-bold mb-4">How to join</h2>
            <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
              <li>Join the Tech Faculty WhatsApp community and tell us which department you want.</li>
              <li>Create your account to receive a Faculty ID.</li>
              <li>Choose online, hybrid, or on-campus study at any of our centres nationwide.</li>
              <li>Complete your projects and receive a verifiable Tech Faculty certificate.</li>
            </ol>
            <div className="flex flex-wrap gap-3 mt-5">
              <JoinWhatsAppButton url={COMMUNITY_WHATSAPP_URL} groupName="the Tech Faculty WhatsApp community">
                <span className="flex items-center justify-center gap-2">
                  Join Community <MessageCircle size={14} />
                </span>
              </JoinWhatsAppButton>
              <Link to="/locations">
                <Button variant="outline">Find a campus near you</Button>
              </Link>
              <Link to="/careers">
                <Button variant="outline">See live tech jobs</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-4 pb-10">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-2xl font-bold mb-4">{dept.title} — frequently asked questions</h2>
            <div className="space-y-4">
              {dept.faqs.map((f) => (
                <Card key={f.q}>
                  <CardContent className="p-5">
                    <h3 className="font-semibold mb-2">{f.q}</h3>
                    <p className="text-sm text-muted-foreground">{f.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Related */}
        <section className="px-4 pb-20">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-2xl font-bold mb-4">Explore other departments</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((d) => (
                <Link key={d.slug} to={`/departments/${d.slug}`}>
                  <Card className="h-full hover:border-primary/50 transition-colors">
                    <CardContent className="p-5">
                      <p className="font-semibold mb-1">{d.title}</p>
                      <p className="text-sm text-muted-foreground">{d.tagline}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default DepartmentDetail;