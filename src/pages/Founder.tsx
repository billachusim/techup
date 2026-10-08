import { getRouteApi } from "@tanstack/react-router";
import { Instagram, Linkedin, Twitter } from "lucide-react";
import { Link } from "@/lib/router-compat";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AUTHOR_URL, BLOG_AUTHOR, authorSchema } from "@/data/author";

const route = getRouteApi("/team/bill-achusim");

const Founder = () => {
  const { articles } = route.useLoaderData();

  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: AUTHOR_URL,
    mainEntity: {
      ...authorSchema,
      description:
        "Founder and lead technical developer of Tech Faculty NG, a licensed tech school in Nnewi, Anambra State, Nigeria.",
      knowsAbout: ["Software engineering", "Software architecture", "Tech education", "AI automation"],
      homeLocation: { "@type": "Place", name: "Nnewi, Anambra State, Nigeria" },
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
      <Header />
      <main className="pt-20">
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-3xl">
            <p className="text-sm text-muted-foreground mb-2">
              <Link to="/about" className="hover:text-primary">About Tech Faculty NG</Link> / Team
            </p>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">{BLOG_AUTHOR.name}</h1>
            <p className="text-lg text-muted-foreground mb-6">{BLOG_AUTHOR.role}</p>
            <div className="flex items-center gap-4 text-muted-foreground mb-10">
              <a href={BLOG_AUTHOR.linkedin} target="_blank" rel="me noopener" aria-label="Bill Achusim on LinkedIn" className="hover:text-foreground"><Linkedin size={20} /></a>
              <a href={BLOG_AUTHOR.x} target="_blank" rel="me noopener" aria-label="Bill Achusim on X" className="hover:text-foreground"><Twitter size={20} /></a>
              <a href={BLOG_AUTHOR.instagram} target="_blank" rel="me noopener" aria-label="Bill Achusim on Instagram" className="hover:text-foreground"><Instagram size={20} /></a>
            </div>

            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                {BLOG_AUTHOR.fullName} is a software architect and programmer who founded Tech Faculty NG in 2022 at the
                Digital Village in Nnewi, Anambra State. He holds a master's degree in Systems Engineering from the
                University of Lagos and is still the school's lead technical developer: he builds the platforms our
                students learn on and the Talent Pool that matches graduates to paid work.
              </p>
              <p>
                He started Tech Faculty NG so that young people in South-East Nigeria could learn job-ready tech skills
                without moving to Lagos, and get paid work at the end of it. That idea, train, certify and employ, still
                runs the school, which is licensed by the Federal Ministry of Science, Technology and Innovation through
                NBTI.
              </p>
              <p>
                He is also the founder of the Nnewi Tech Meetup, and writes on this site about tech careers, AI
                automation and hiring in Nigeria.
              </p>
            </div>

            <p className="mt-8 text-sm">
              <Link to="/outcomes" className="text-primary hover:underline">See our student outcomes and how we count them</Link>
            </p>
          </div>
        </section>

        {articles.length > 0 && (
          <section className="py-16 px-4 bg-muted/30">
            <div className="container mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold mb-6">Recent articles by Bill</h2>
              <ul className="space-y-3">
                {articles.map((a) => (
                  <li key={a.slug} className="flex flex-col sm:flex-row sm:items-baseline sm:gap-4">
                    <time dateTime={a.date} className="text-sm text-muted-foreground shrink-0 w-28">
                      {new Date(a.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </time>
                    <Link to={`/blog/${a.slug}`} className="font-medium hover:text-primary">{a.title}</Link>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm">
                <Link to="/blog" className="text-primary hover:underline">All articles</Link>
              </p>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Founder;
