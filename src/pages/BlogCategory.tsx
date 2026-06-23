import { Helmet } from "react-helmet-async";
import { Link, useParams, Navigate } from "react-router-dom";
import { useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllBlogPosts } from "@/data/blogPosts";
import { getCategoryBySlug, blogCategories } from "@/data/blogCategories";

const BlogCategory = () => {
  const { slug } = useParams<{ slug: string }>();
  const category = slug ? getCategoryBySlug(slug) : undefined;

  const posts = useMemo(() => {
    if (!category) return [];
    return getAllBlogPosts().filter((p) => p.tags[0] === category.name);
  }, [category]);

  if (!category) return <Navigate to="/blog" replace />;

  const url = `https://techfaculty.ng/blog/category/${category.slug}`;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://techfaculty.ng/" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://techfaculty.ng/blog" },
      { "@type": "ListItem", position: 3, name: category.name, item: url },
    ],
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${category.name} — Tech Faculty NG Blog`,
    description: category.description,
    url,
    isPartOf: { "@type": "Blog", name: "Tech Faculty NG Blog", url: "https://techfaculty.ng/blog" },
    keywords: category.keywords.join(", "),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: posts.length,
      itemListElement: posts.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `https://techfaculty.ng/blog/${p.slug}`,
        name: p.title,
      })),
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{category.title}</title>
        <meta name="description" content={category.description} />
        <meta name="keywords" content={category.keywords.join(", ")} />
        <meta property="og:title" content={category.title} />
        <meta property="og:description" content={category.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <link rel="canonical" href={url} />
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(collectionSchema)}</script>
      </Helmet>
      <Header />
      <main className="pt-20">
        {/* Breadcrumb + back */}
        <section className="px-4 pt-8">
          <div className="container mx-auto max-w-4xl">
            <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground mb-4">
              <Link to="/" className="hover:text-primary">Home</Link>
              <span className="mx-2">/</span>
              <Link to="/blog" className="hover:text-primary">Blog</Link>
              <span className="mx-2">/</span>
              <span className="text-foreground">{category.name}</span>
            </nav>
            <Link to="/blog">
              <Button variant="ghost" size="sm" className="-ml-2 mb-4">
                <ArrowLeft size={16} className="mr-1" /> All categories
              </Button>
            </Link>
          </div>
        </section>

        {/* Hero */}
        <section className="px-4 pb-6">
          <div className="container mx-auto max-w-4xl">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              <span className="text-gradient">{category.name}</span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl leading-relaxed">
              {category.intro}
            </p>
          </div>
        </section>

        {/* Category nav */}
        <section className="px-4 pb-8">
          <div className="container mx-auto max-w-4xl flex flex-wrap gap-2">
            <Link to="/blog">
              <Badge variant="outline" className="cursor-pointer px-4 py-1.5 text-sm">All</Badge>
            </Link>
            {blogCategories.map((c) => (
              <Link key={c.slug} to={`/blog/category/${c.slug}`}>
                <Badge
                  variant={c.slug === category.slug ? "default" : "outline"}
                  className="cursor-pointer px-4 py-1.5 text-sm"
                >
                  {c.name}
                </Badge>
              </Link>
            ))}
          </div>
        </section>

        {/* Posts grid */}
        <section className="px-4 pb-20">
          <div className="container mx-auto max-w-4xl">
            {posts.length === 0 ? (
              <p className="text-muted-foreground">No posts in this category yet — check back soon.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {posts.map((post) => (
                  <Link key={post.slug} to={`/blog/${post.slug}`}>
                    <Card className="h-full hover:border-primary/50 transition-colors group">
                      <CardContent className="p-6 flex flex-col h-full">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="secondary" className="text-xs">{post.tags[0]}</Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock size={12} /> {post.readTime} min read
                          </span>
                        </div>
                        <h2 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                          {post.title}
                        </h2>
                        <p className="text-sm text-muted-foreground flex-1">{post.description}</p>
                        <div className="flex items-center gap-1 text-primary text-sm font-medium mt-4">
                          Read article <ArrowRight size={14} />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BlogCategory;
