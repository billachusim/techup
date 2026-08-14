import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock, Users } from "lucide-react";
import { departments } from "@/data/departments";

const url = "https://techfaculty.ng/departments";
const description =
  "Explore Tech Faculty departments in Nigeria: AI, web and mobile development, data analytics, cybersecurity, cloud, design, digital marketing, robotics and digital literacy.";

const DepartmentsIndex = () => {
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Tech Faculty NG Departments",
    numberOfItems: departments.length,
    itemListElement: departments.map((d, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `${d.title} Department`,
      url: `${url}/${d.slug}`,
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://techfaculty.ng/" },
      { "@type": "ListItem", position: 2, name: "Departments", item: url },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Tech Departments & Bootcamps in Nigeria | Tech Faculty</title>
        <meta name="description" content={description} />
        <meta property="og:title" content="Tech Departments & Bootcamps in Nigeria | Tech Faculty" />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <link rel="canonical" href={url} />
        <script type="application/ld+json">{JSON.stringify(itemListSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>
      <Header />
      <main className="pt-20">
        <section className="px-4 pt-8 pb-10">
          <div className="container mx-auto max-w-4xl">
            <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground mb-4">
              <Link to="/" className="hover:text-primary">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-foreground">Departments</span>
            </nav>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Our <span className="text-gradient">Departments</span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Ten departments, one philosophy: AI for everything. Every programme runs online, hybrid, or on campus
              inside a Technology Incubation Centre, and every graduate leaves with projects, a verifiable certificate,
              and access to our jobs board. Pick a department to see the full curriculum, tools, salaries, and how to join.
            </p>
          </div>
        </section>

        <section className="px-4 pb-20">
          <div className="container mx-auto max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-5">
            {departments.map((d) => (
              <Link key={d.slug} to={`/departments/${d.slug}`}>
                <Card className="h-full hover:border-primary/50 transition-colors group">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">{d.difficulty}</Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock size={12} /> {d.duration}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Users size={12} /> {d.enrollment}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                      {d.title}
                    </h2>
                    <p className="text-sm text-muted-foreground flex-1">{d.tagline}</p>
                    <div className="flex items-center gap-1 text-primary text-sm font-medium mt-4">
                      Enter department <ArrowRight size={14} />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default DepartmentsIndex;