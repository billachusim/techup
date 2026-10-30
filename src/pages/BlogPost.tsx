import { useParams, Link, Navigate } from "@/lib/router-compat";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { getCategoryByName } from "@/data/blogCategories";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { BLOG_AUTHOR, authorSchema } from "@/data/author";
import { Linkedin, Twitter } from "lucide-react";
import BlogActions from "@/components/BlogActions";
import SuccessKitCTA from "@/components/siwes/SuccessKitCTA";
import VirtualSiwesOffer from "@/components/siwes/VirtualSiwesOffer";
import PostInternalLinks from "@/components/blog/PostInternalLinks";
import { useAllBlogPosts } from "@/hooks/useBlogPostsData";
import { formatDate } from "@/components/LastUpdated";
import { articleOgImage } from "@/lib/og-image";
import { extractFaq } from "@/lib/blog-faq";

const headingText = (children: unknown): string =>
  Array.isArray(children)
    ? children.map(headingText).join("")
    : typeof children === "string" || typeof children === "number"
      ? String(children)
      : children && typeof children === "object" && "props" in children
        ? headingText((children as { props: { children?: unknown } }).props.children)
        : "";

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[*_`[\]()]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** "## " headings in the post, for the table of contents. */
const tocItems = (markdown: string) =>
  [...markdown.matchAll(/^##\s+(.+)$/gm)].map((m) => {
    const text = m[1].replace(/[*_`]/g, "").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").trim();
    return { text, id: slugify(text) };
  });

const markdownComponents: Components = {
  h1: ({ node, children, ...props }) => (
    <h2 id={slugify(headingText(children))} className="scroll-mt-24" {...props}>
      {children}
    </h2>
  ),
  h2: ({ node, children, ...props }) => (
    <h2 id={slugify(headingText(children))} className="scroll-mt-24" {...props}>
      {children}
    </h2>
  ),
  table: ({ node, ...props }) => (
    <div className="not-prose my-8 w-full overflow-x-auto rounded-md border border-border">
      <table className="w-full min-w-[480px] border-collapse text-sm" {...props} />
    </div>
  ),
  th: ({ node, ...props }) => (
    <th className="border-b border-border bg-muted px-3 py-2 text-left font-semibold text-foreground" {...props} />
  ),
  td: ({ node, ...props }) => (
    <td className="border-b border-border px-3 py-2 align-top text-muted-foreground" {...props} />
  ),
};

/**
 * Splits markdown just before the "## " heading nearest its middle, so an
 * offer can sit between sections. Returns [content, ""] when there is no
 * heading past the first one, or it is inside a code fence.
 */
const splitAtMiddleHeading = (content: string): [string, string] => {
  const starts: number[] = [];
  let inFence = false;
  let offset = 0;
  for (const line of content.split("\n")) {
    if (line.startsWith("```")) inFence = !inFence;
    else if (!inFence && /^## /.test(line)) starts.push(offset);
    offset += line.length + 1;
  }
  const candidates = starts.slice(1);
  if (candidates.length === 0) return [content, ""];
  const middle = content.length / 2;
  const at = candidates.reduce((best, s) =>
    Math.abs(s - middle) < Math.abs(best - middle) ? s : best,
  );
  return [content.slice(0, at), content.slice(at)];
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { posts, isLoading } = useAllBlogPosts();
  const post = slug ? posts.find((p) => p.slug === slug) : undefined;

  // Auto-generated posts arrive from the database, so wait before redirecting.
  if (!post) {
    if (isLoading) {
      return (
        <div className="min-h-screen bg-background">
          <Header />
          <main className="pt-32 px-4">
            <div className="container mx-auto max-w-3xl space-y-4">
              <div className="h-8 w-2/3 rounded bg-muted animate-pulse" />
              <div className="h-4 w-full rounded bg-muted animate-pulse" />
              <div className="h-4 w-5/6 rounded bg-muted animate-pulse" />
            </div>
          </main>
        </div>
      );
    }
    return <Navigate to="/blog" replace />;
  }

  const relatedPosts = posts
    .filter((p) => p.slug !== post.slug && p.tags.some((tag) => post.tags.includes(tag)))
    .slice(0, 2);
  const category = getCategoryByName(post.tags[0]);
  const modified = post.updated ?? post.date;
  // Only call out an edit made on a later day than publication.
  const showUpdated = modified.slice(0, 10) > post.date.slice(0, 10);

  // SIWES/internship articles get the Success Kit funnel; other posts are untouched.
  const isSiwesPost = /siwes|internship|industrial training|\bIT placement\b/i.test(
    `${post.slug} ${post.title} ${post.tags.join(" ")}`,
  );
  // SIWES proper (not general internships) also gets the Virtual SIWES offer.
  const isVirtualSiwesPost = /siwes|industrial training|\bIT placement\b/i.test(
    `${post.slug} ${post.title} ${post.tags.join(" ")}`,
  );

  const body = post.content.replace(/^\s*\*By [^*\n]+\*[ \t]*\n?/m, "");
  const faq = extractFaq(body);
  const [firstHalf, secondHalf] = isVirtualSiwesPost
    ? splitAtMiddleHeading(body)
    : [body, ""];
  const proseClass =
    "prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-p:text-muted-foreground prose-p:mb-6 prose-p:leading-relaxed prose-li:text-muted-foreground prose-li:leading-relaxed prose-ul:mb-6 prose-ol:mb-6 prose-strong:text-foreground prose-a:text-link hover:prose-a:underline prose-hr:my-8";
  const renderMarkdown = (markdown: string) => (
    <div className={proseClass}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {markdown}
      </ReactMarkdown>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.description,
            datePublished: post.date,
            dateModified: modified,
            image: [articleOgImage(post)],
            author: authorSchema,
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
        {faq.length > 0 && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faq.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: { "@type": "Answer", text: item.answer },
              })),
            })}
          </script>
        )}
      </>
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
                <time dateTime={post.date}>{formatDate(post.date)}</time>
              </span>
              {showUpdated && (
                <span className="text-sm text-muted-foreground">
                  Last updated <time dateTime={modified}>{formatDate(modified)}</time>
                </span>
              )}
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock size={14} /> {post.readTime} min read
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-4">
              <span>By <Link to={BLOG_AUTHOR.path} rel="author" className="font-medium text-foreground hover:underline">{BLOG_AUTHOR.name}</Link>, {BLOG_AUTHOR.role}</span>
              <a href={BLOG_AUTHOR.linkedin} target="_blank" rel="author noopener" aria-label="Bill Achusim on LinkedIn" className="hover:text-foreground"><Linkedin size={15} /></a>
                <a href={BLOG_AUTHOR.x} target="_blank" rel="author noopener" aria-label="Bill Achusim on X" className="hover:text-foreground"><Twitter size={15} /></a>
            </div>

            <BlogActions
              slug={post.slug}
              title={post.title}
              description={post.description}
            />

            {isSiwesPost && <SuccessKitCTA source={post.slug} variant="inline" />}

            {tocItems(body).length >= 3 && (
              <nav aria-label="Table of contents" className="my-8 rounded-lg border border-border bg-muted/40 p-5">
                <p className="mb-3 font-semibold text-foreground">In this guide</p>
                <ol className="list-decimal space-y-1.5 pl-5 text-sm">
                  {tocItems(body).map((item) => (
                    <li key={item.id}>
                      <a href={`#${item.id}`} className="text-muted-foreground hover:text-link hover:underline">
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}

            {/* Content */}
            {renderMarkdown(firstHalf)}
            {secondHalf && (
              <>
                <VirtualSiwesOffer source={post.slug} variant="inline" />
                {renderMarkdown(secondHalf)}
              </>
            )}

            <PostInternalLinks post={post} />

            <div className="mt-10 rounded-lg border border-border p-5">
              <p className="text-sm text-muted-foreground">Written by</p>
              <p className="font-semibold"><Link to={BLOG_AUTHOR.path} rel="author" className="hover:underline">{BLOG_AUTHOR.name}</Link></p>
              <p className="text-sm text-muted-foreground mb-3">{BLOG_AUTHOR.role}. Building Africa's remote and physical tech workforce.</p>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <a href={BLOG_AUTHOR.linkedin} target="_blank" rel="author noopener" aria-label="Bill Achusim on LinkedIn" className="hover:text-foreground"><Linkedin size={15} /></a>
                <a href={BLOG_AUTHOR.x} target="_blank" rel="author noopener" aria-label="Bill Achusim on X" className="hover:text-foreground"><Twitter size={15} /></a>
              </div>
            </div>

            {isVirtualSiwesPost && <VirtualSiwesOffer source={post.slug} variant="full" />}

            {isSiwesPost && <SuccessKitCTA source={post.slug} variant="capture" />}

            <BlogActions
              slug={post.slug}
              title={post.title}
              description={post.description}
            />

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
