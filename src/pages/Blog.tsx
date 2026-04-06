import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowRight } from "lucide-react";
import blogPosts, { getAllBlogPosts } from "@/data/blogPosts";
import { useState, useMemo } from "react";

const Blog = () => {
  const sortedPosts = useMemo(() => getAllBlogPosts(), []);
  const categories = useMemo(() => {
    const cats = new Set(sortedPosts.map((p) => p.tags[0]));
    return Array.from(cats).sort();
  }, [sortedPosts]);

  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = activeCategory
    ? sortedPosts.filter((p) => p.tags.includes(activeCategory))
    : sortedPosts;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Blog & Resources - Tech Faculty NG | Tech Career Tips</title>
        <meta
          name="description"
          content="Tech career guides, course deep-dives, SIWES tips, and AI insights from Tech Faculty NG. Practical advice for starting and growing your tech career in Nigeria."
        />
        <meta property="og:title" content="Blog & Resources - Tech Faculty NG" />
        <meta
          property="og:description"
          content="Tech career guides, SIWES tips, and AI insights for Nigerian professionals and students."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://techfaculty.ng/blog" />
        <link rel="canonical" href="https://techfaculty.ng/blog" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: "Tech Faculty NG Blog",
            description:
              "Tech career guides, course deep-dives, and industry insights from Tech Faculty NG.",
            url: "https://techfaculty.ng/blog",
            publisher: {
              "@type": "Organization",
              name: "Tech Faculty NG",
              url: "https://techfaculty.ng",
            },
            blogPost: sortedPosts.map((post) => ({
              "@type": "BlogPosting",
              headline: post.title,
              description: post.description,
              datePublished: post.date,
              author: {
                "@type": "Organization",
                name: "Tech Faculty NG",
              },
              url: `https://techfaculty.ng/blog/${post.slug}`,
              keywords: post.tags.join(", "),
            })),
          })}
        </script>
      </Helmet>
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Blog & <span className="text-gradient">Resources</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Practical guides, career tips, and industry insights to help you
              launch and grow your tech career in Nigeria.
            </p>
          </div>
        </section>

        {/* Category Filters */}
        <section className="px-4 pb-8">
          <div className="container mx-auto max-w-4xl flex flex-wrap gap-2 justify-center">
            <Badge
              variant={activeCategory === null ? "default" : "outline"}
              className="cursor-pointer px-4 py-1.5 text-sm"
              onClick={() => setActiveCategory(null)}
            >
              All
            </Badge>
            {categories.map((cat) => (
              <Badge
                key={cat}
                variant={activeCategory === cat ? "default" : "outline"}
                className="cursor-pointer px-4 py-1.5 text-sm"
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </Badge>
            ))}
          </div>
        </section>

        {/* Posts Grid */}
        <section className="px-4 pb-20">
          <div className="container mx-auto max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filtered.map((post) => (
                <Link key={post.slug} to={`/blog/${post.slug}`}>
                  <Card className="h-full hover:border-primary/50 transition-colors group">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="secondary" className="text-xs">
                          {post.tags[0]}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock size={12} /> {post.readTime} min read
                        </span>
                      </div>
                      <h2 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-sm text-muted-foreground flex-1">
                        {post.description}
                      </p>
                      <div className="flex items-center gap-1 text-primary text-sm font-medium mt-4">
                        Read article <ArrowRight size={14} />
                      </div>
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

export default Blog;
