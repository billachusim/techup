import { Helmet } from "react-helmet-async";
import { useParams, Link, Navigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { getBlogPostBySlug, getRelatedPosts } from "@/data/blogPosts";
import { getCategoryByName } from "@/data/blogCategories";
import ReactMarkdown from "react-markdown";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getBlogPostBySlug(slug) : undefined;

  if (!post) return <Navigate to="/blog" replace />;

  const relatedPosts = getRelatedPosts(post.slug, 2);
  const category = getCategoryByName(post.tags[0]);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{post.title} | Tech Faculty NG Blog</title>
        <meta name="description" content={post.description} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.description} />
        <meta property="og:type" content="article" />
        <meta
          property="og:url"
          content={`https://techfaculty.ng/blog/${post.slug}`}
        />
        <meta property="article:published_time" content={post.date} />
        <meta property="article:author" content="Tech Faculty NG" />
        {post.tags.map((tag) => (
          <meta property="article:tag" content={tag} key={tag} />
        ))}
        <link
          rel="canonical"
          href={`https://techfaculty.ng/blog/${post.slug}`}
        />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.description,
            datePublished: post.date,
            author: {
              "@type": "Organization",
              name: "Tech Faculty NG",
              url: "https://techfaculty.ng",
            },
            publisher: {
              "@type": "Organization",
              name: "Tech Faculty NG",
              url: "https://techfaculty.ng",
            },
            url: `https://techfaculty.ng/blog/${post.slug}`,
            keywords: post.tags.join(", "),
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `https://techfaculty.ng/blog/${post.slug}`,
            },
          })}
        </script>
      </Helmet>
      <Header />
      <main className="pt-20">
        <article className="py-16 px-4">
          <div className="container mx-auto max-w-3xl">
            {/* Back link */}
            <Link to="/blog">
              <Button variant="ghost" size="sm" className="mb-6 -ml-2">
                <ArrowLeft size={16} className="mr-1" /> Back to Blog
              </Button>
            </Link>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {category ? (
                <Link to={`/blog/category/${category.slug}`}>
                  <Badge variant="secondary" className="hover:bg-secondary/80">
                    {post.tags[0]}
                  </Badge>
                </Link>
              ) : (
                <Badge variant="secondary">{post.tags[0]}</Badge>
              )}
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar size={14} />{" "}
                {new Date(post.date).toLocaleDateString("en-NG", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock size={14} /> {post.readTime} min read
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold mb-8">
              {post.title}
            </h1>

            {/* Content */}
            <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-p:text-muted-foreground prose-p:mb-6 prose-p:leading-relaxed prose-li:text-muted-foreground prose-li:leading-relaxed prose-ul:mb-6 prose-ol:mb-6 prose-strong:text-foreground prose-a:text-primary hover:prose-a:underline prose-hr:my-8">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="py-12 px-4 bg-muted/30">
            <div className="container mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold mb-6">More Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedPosts.map((rp) => (
                  <Link key={rp.slug} to={`/blog/${rp.slug}`}>
                    <div className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                      <Badge variant="secondary" className="text-xs mb-2">
                        {rp.tags[0]}
                      </Badge>
                      <h3 className="font-semibold text-sm mb-1">
                        {rp.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {rp.readTime} min read
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
