import { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Link, Navigate, useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CampusMap from "@/components/locations/CampusMap";
import JoinWhatsAppButton from "@/components/JoinWhatsAppButton";
import { COMMUNITY_WHATSAPP_URL } from "@/lib/whatsapp";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Building2, CheckCircle2, MapPin, MessageCircle, Navigation } from "lucide-react";
import { campuses, directionsUrl, getCampusBySlug } from "@/data/campuses";
import {
  campusFaqs,
  campusKeywords,
  campusMetaDescription,
  campusMetaTitle,
  campusProgrammes,
} from "@/data/campusContent";

const LocationDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const campus = slug ? getCampusBySlug(slug) : undefined;

  const items = useMemo(() => (campus ? [campus] : []), [campus]);

  if (!campus) return <Navigate to="/locations" replace />;

  const url = `https://techfaculty.ng/locations/${campus.slug}`;
  const faqs = campusFaqs(campus);
  const programmes = campusProgrammes(campus);
  const nearby = campuses.filter((c) => c.zone === campus.zone && c.slug !== campus.slug).slice(0, 4);

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: `Tech Faculty ${campus.city}`,
    description: campusMetaDescription(campus),
    url,
    parentOrganization: { "@type": "EducationalOrganization", name: "Tech Faculty NG", url: "https://techfaculty.ng/" },
    address: {
      "@type": "PostalAddress",
      streetAddress: campus.address,
      addressLocality: campus.city,
      addressRegion: campus.state,
      addressCountry: "NG",
    },
    geo: { "@type": "GeoCoordinates", latitude: campus.lat, longitude: campus.lng },
    areaServed: { "@type": "AdministrativeArea", name: `${campus.state} State, Nigeria` },
    keywords: campusKeywords(campus).join(", "),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
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
      { "@type": "ListItem", position: 2, name: "Locations", item: "https://techfaculty.ng/locations" },
      { "@type": "ListItem", position: 3, name: `${campus.city} campus`, item: url },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{campusMetaTitle(campus)}</title>
        <meta name="description" content={campusMetaDescription(campus)} />
        <meta name="keywords" content={campusKeywords(campus).join(", ")} />
        <meta property="og:title" content={campusMetaTitle(campus)} />
        <meta property="og:description" content={campusMetaDescription(campus)} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <link rel="canonical" href={url} />
        <script type="application/ld+json">{JSON.stringify(orgSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <Header />

      <main className="pt-24 pb-16">
        <section className="container mx-auto px-4">
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground mb-4">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/locations" className="hover:text-primary">Locations</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{campus.city}</span>
          </nav>
          <Link to="/locations">
            <Button variant="ghost" size="sm" className="-ml-2 mb-4">
              <ArrowLeft size={16} className="mr-1" /> All campuses
            </Button>
          </Link>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            {campus.isHeadquarters && <Badge>Headquarters</Badge>}
            <Badge variant="secondary">{campus.zone}</Badge>
            <Badge variant="outline">{campus.state} State</Badge>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Tech Faculty {campus.city} — Tech Training at {campus.shortVenue}
          </h1>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-3xl">
            {campus.intro}
          </p>

          <div className="flex flex-wrap gap-3 mt-6">
            <JoinWhatsAppButton url={COMMUNITY_WHATSAPP_URL} groupName="the Tech Faculty WhatsApp community">
              <span className="flex items-center justify-center gap-2">
                Join the {campus.city} community <MessageCircle size={14} />
              </span>
            </JoinWhatsAppButton>
            <Button asChild variant="outline">
              <a href={directionsUrl(campus)} target="_blank" rel="noopener noreferrer">
                <Navigation className="w-4 h-4 mr-1" /> Get directions to {campus.city}
              </a>
            </Button>
          </div>
        </section>

        {/* Address + map */}
        <section className="container mx-auto px-4 mt-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Where to find us in {campus.city}</h2>
          <div className="grid lg:grid-cols-[1fr,1.2fr] gap-6 items-start">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">{campus.name}</p>
                    <p className="text-sm text-muted-foreground">{campus.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    {campus.slug === "onitsha"
                      ? "A standalone Tech Faculty centre, operated directly by us."
                      : "Hosted inside the Technology Incubation Centre network of the National Board for Technology Incubation, an agency of the Federal Ministry of Science, Technology and Innovation."}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold mb-2">Sectors our {campus.city} graduates work in</p>
                  <div className="flex flex-wrap gap-2">
                    {campus.sectors.map((s) => (
                      <Badge key={s} variant="secondary" className="text-xs capitalize">{s}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            <CampusMap
              items={items}
              activeId={campus.id}
              center={{ lat: campus.lat, lng: campus.lng }}
              zoom={13}
              className="w-full h-[380px] rounded-xl border border-border bg-muted overflow-hidden"
              ariaLabel={`Map of the Tech Faculty campus in ${campus.city}, ${campus.state} State`}
            />
          </div>
        </section>

        {/* Courses and programmes */}
        <section className="container mx-auto px-4 mt-14">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Courses and programmes available in {campus.city}
          </h2>
          <p className="text-muted-foreground mb-6 max-w-3xl">
            Every Tech Faculty department is open to {campus.city} students — in person at the centre, hybrid, or fully
            online. Graduates receive a certificate anyone can confirm on our public verification portal.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {programmes.map((p) => (
              <Card key={p.title} className="h-full">
                <CardContent className="p-6 flex flex-col h-full">
                  <h3 className="font-bold mb-2">{p.title}</h3>
                  <p className="text-sm text-muted-foreground flex-1">{p.body}</p>
                  <Link
                    to={p.href}
                    className="text-sm font-semibold text-primary hover:underline inline-flex items-center gap-1 mt-4"
                  >
                    See the {p.title} curriculum <ArrowRight size={14} />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-6">
            <Link to="/departments">
              <Button variant="outline">Browse all ten departments <ArrowRight size={16} className="ml-2" /></Button>
            </Link>
          </div>
        </section>

        {/* SIWES */}
        <section className="container mx-auto px-4 mt-14">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            SIWES and industrial training in {campus.city}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                We accept SIWES and industrial training students at {campus.shortVenue} every session, on two tracks:
                <strong className="text-foreground"> Learn & Pay</strong>, where you train while completing your
                attachment, and <strong className="text-foreground"> Tutor & Earn</strong>, where stronger students
                assist in delivery and earn while they train.
              </p>
              <p>
                Placement includes supervised project work, weekly reviews, logbook guidance and documentation your
                institution accepts. Students leave with a portfolio, not photocopies.
              </p>
              <Link to="/siwes" className="text-primary font-semibold hover:underline inline-flex items-center gap-1">
                Read the full SIWES programme details <ArrowRight size={14} />
              </Link>
            </div>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm font-semibold mb-3">
                  Institutions we commonly host from in and around {campus.city}
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {campus.nearbyInstitutions.map((i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span>{i}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-muted-foreground mt-4">
                  Students from any accredited institution are welcome — this list reflects where most of our
                  {" "}{campus.city} placements come from.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Teens + free bootcamp */}
        <section className="container mx-auto px-4 mt-14">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Holiday tech bootcamps for kids and teenagers in {campus.city}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-2">Teen holiday tracks</h3>
                <p className="text-sm text-muted-foreground">
                  During every school holiday we run supervised, project-based tracks for JSS and SSS students in
                  {" "}{campus.city}: Digital Creation, Coding, Artificial Intelligence and Cybersecurity. Each student
                  presents something they built at the end of the session, and parents receive a progress summary.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-2">Free foundation bootcamp</h3>
                <p className="text-sm text-muted-foreground">
                  Our no-fee starter programme is open to everyone in {campus.city} — students, traders, teachers,
                  civil servants and career switchers. It covers computer confidence, internet safety and practical AI
                  tools, and it is the entry point to every paid department.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Events */}
        <section className="container mx-auto px-4 mt-14">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Events and community in {campus.city}</h2>
          <p className="text-muted-foreground max-w-3xl mb-4">
            Learning does not stop at the classroom. Our {campus.city} learners join workshops, hackathons, career
            clinics and the Nnewi Tech Meetup series, and the WhatsApp community is where cohort announcements, job
            alerts and study groups happen daily.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/events"><Button variant="outline">See upcoming events</Button></Link>
            <Link to="/careers"><Button variant="outline">Browse live tech jobs</Button></Link>
            <Link to="/verify"><Button variant="outline">Verify a certificate</Button></Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="container mx-auto px-4 mt-14">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Tech Faculty {campus.city} — frequently asked questions
          </h2>
          <div className="space-y-4 max-w-3xl">
            {faqs.map((f) => (
              <Card key={f.q}>
                <CardContent className="p-5">
                  <h3 className="font-semibold mb-2">{f.q}</h3>
                  <p className="text-sm text-muted-foreground">{f.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Nearby */}
        {nearby.length > 0 && (
          <section className="container mx-auto px-4 mt-14">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Other Tech Faculty campuses in the {campus.zone}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {nearby.map((c) => (
                <Link key={c.slug} to={`/locations/${c.slug}`}>
                  <Card className="h-full hover:border-primary/50 transition-colors">
                    <CardContent className="p-5">
                      <p className="font-semibold mb-1">Tech Faculty {c.city}</p>
                      <p className="text-xs text-muted-foreground">{c.tagline}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default LocationDetail;