import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

/** Cost control: exactly this many articles per weekly run. */
const POSTS_PER_RUN = 2;
/** Cheapest capable model on the Lovable AI gateway. */
const MODEL = "google/gemini-2.5-flash";

type Category = { name: string; slug: string; focus: string };

/** Mirrors src/data/blogCategories.ts — tags[0] must equal `name`. */
const CATEGORIES: Category[] = [
  {
    name: "Artificial Intelligence",
    slug: "artificial-intelligence",
    focus: "practical AI, generative AI, machine learning and AI automation for Nigerian businesses, students and developers",
  },
  {
    name: "Web & Software Development",
    slug: "web-software-development",
    focus: "coding roadmaps, React/Node/Python, mobile development, portfolios and junior developer hiring in Nigeria",
  },
  {
    name: "Data & Analytics",
    slug: "data-analytics",
    focus: "data analytics and data science with Power BI, Tableau, Excel, SQL and Python, plus analyst salaries and career paths",
  },
  {
    name: "Cybersecurity",
    slug: "cybersecurity",
    focus: "cybersecurity careers, certifications, SOC analyst skills, ethical hacking and protecting Nigerian businesses online",
  },
  {
    name: "Tech Careers",
    slug: "tech-careers",
    focus: "getting hired in tech, remote work from Nigeria, CVs, interviews, salary benchmarks and switching careers into tech",
  },
  {
    name: "SIWES & Internships",
    slug: "siwes-internships",
    focus: "SIWES placements, IT attachment, industrial training letters, undergraduate internships and student work experience in Nigeria",
  },
  {
    name: "Startups & Business",
    slug: "startups-business",
    focus: "Nigerian tech startups, digital business models, funding, product launches and using technology to grow SMEs",
  },
  {
    name: "Tech Training for Teens",
    slug: "tech-training-for-teens",
    focus: "coding, AI, digital creation and cybersecurity training for children and teenagers, holiday bootcamps and parent guidance",
  },
];

const articleSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    slug: { type: "string" },
    description: { type: "string" },
    content: { type: "string" },
    tags: { type: "array", items: { type: "string" } },
    read_time: { type: "number" },
  },
  required: ["title", "slug", "description", "content", "tags"],
};

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function prettyDate(): string {
  return new Date().toLocaleDateString("en-NG", { year: "numeric", month: "short", day: "numeric" });
}

function buildPrompt(category: Category, existingTitles: string[]): string {
  return [
    `You are the senior SEO editor for Tech Faculty NG (https://techfaculty.ng), a Nigerian government-licensed tech training institute (licensed by the Federal Ministry of Science, Technology & Innovation via the National Board for Technology Incubation). Over 6,000 students trained, 4+ years of training experience, campuses inside Technology Incubation Centres across Nigeria with HQ in Nnewi, Anambra State, plus online programs worldwide.`,
    ``,
    `Write ONE new long-form blog article for the "${category.name}" category, covering ${category.focus}.`,
    ``,
    `SEO requirements:`,
    `- Target a specific high-intent long-tail keyword a Nigerian reader would actually search in ${new Date().getFullYear()}. Put it in the title, the first paragraph and at least two H2 headings.`,
    `- Title: 55-70 characters, specific, no clickbait, no emoji.`,
    `- description: a meta description of 150-160 characters.`,
    `- content: GitHub-flavoured markdown, 1100-1600 words. Start with an H1 that matches the title, then a line "*By Tech Faculty Editorial · ${prettyDate()}*", then the body.`,
    `- Structure with H2/H3 sections, short paragraphs, bullet lists and at least one markdown table where it genuinely helps.`,
    `- Include a "## Frequently asked questions" section with 4 question H3s and concise answers.`,
    `- Include 3-5 internal markdown links chosen from: /departments, /locations, /careers, /events, /blog, /siwes, /verify, /about.`,
    `- Use Nigerian context: naira figures, real cities (Nnewi, Onitsha, Enugu, Aba, Owerri, Lagos, Abuja), local employers and realistic timelines.`,
    `- End with a short call to action to explore Tech Faculty programs.`,
    `- tags: an array where the FIRST element is exactly "${category.name}", followed by 4 long-tail keyword phrases.`,
    `- slug: a lowercase hyphenated slug derived from the title.`,
    `- read_time: estimated reading minutes as a number.`,
    ``,
    `Accuracy rules: never invent statistics, testimonials, accreditations, prices or partnerships. Only use the institutional facts given above. Where a figure is uncertain, describe a realistic range and say it is an estimate.`,
    ``,
    `Do NOT duplicate or closely rewrite any of these existing articles:`,
    existingTitles.slice(0, 60).map((t) => `- ${t}`).join("\n") || "- (none yet)",
  ].join("\n");
}

// deno-lint-ignore no-explicit-any
async function generateArticle(category: Category, existingTitles: string[], apiKey: string): Promise<any | null> {
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: "user", content: buildPrompt(category, existingTitles) }],
      tools: [
        {
          type: "function",
          function: {
            name: "publish_article",
            description: "Publish the finished SEO article.",
            parameters: articleSchema,
          },
        },
      ],
      tool_choice: { type: "function", function: { name: "publish_article" } },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error(`generate-weekly-blog: AI gateway [${res.status}] ${body.slice(0, 400)}`);
    return null;
  }

  const data = await res.json();
  const call = data?.choices?.[0]?.message?.tool_calls?.[0];
  if (!call?.function?.arguments) {
    console.error("generate-weekly-blog: no tool call returned");
    return null;
  }
  try {
    return JSON.parse(call.function.arguments);
  } catch (err) {
    console.error("generate-weekly-blog: unparsable arguments", err);
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const started = Date.now();
  const report: Record<string, string> = {};

  try {
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) throw new Error("LOVABLE_API_KEY is not configured");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: existing, error: existingError } = await supabase
      .from("blog_posts")
      .select("slug, title, category, published_at")
      .order("published_at", { ascending: false });
    if (existingError) throw new Error(`read failed: ${existingError.message}`);

    const rows = existing ?? [];
    const takenSlugs = new Set(rows.map((r) => r.slug));
    const titles = rows.map((r) => r.title);

    // Rotation: the categories whose newest generated post is oldest go first.
    const lastPublished = new Map<string, string>();
    for (const row of rows) {
      if (!lastPublished.has(row.category)) lastPublished.set(row.category, row.published_at);
    }
    const queue = [...CATEGORIES].sort((a, b) => {
      const av = lastPublished.get(a.name) ?? "0000-00-00";
      const bv = lastPublished.get(b.name) ?? "0000-00-00";
      return av < bv ? -1 : av > bv ? 1 : 0;
    }).slice(0, POSTS_PER_RUN);

    let published = 0;
    for (const category of queue) {
      const article = await generateArticle(category, titles, apiKey);
      if (!article) {
        report[category.name] = "generation failed — skipped";
        continue;
      }

      let slug = slugify(String(article.slug || article.title || ""));
      if (!slug) {
        report[category.name] = "invalid slug — skipped";
        continue;
      }
      if (takenSlugs.has(slug)) slug = `${slug}-${todayIso()}`;

      const content = String(article.content ?? "").trim();
      if (content.length < 1200) {
        report[category.name] = "article too short — skipped";
        continue;
      }

      const tags = Array.isArray(article.tags)
        ? [category.name, ...article.tags.map((t: unknown) => String(t).slice(0, 60)).filter((t: string) => t !== category.name)].slice(0, 6)
        : [category.name];

      const readTime = Number.isFinite(article.read_time)
        ? Math.max(4, Math.min(20, Math.round(article.read_time)))
        : Math.max(4, Math.round(content.split(/\s+/).length / 200));

      const { error } = await supabase.from("blog_posts").insert({
        slug,
        title: String(article.title).slice(0, 180),
        description: String(article.description).slice(0, 300),
        content,
        category: category.name,
        tags,
        read_time: `${readTime} min read`,
        published_at: todayIso(),
        source: "auto",
        is_published: true,
      });

      if (error) {
        report[category.name] = `insert failed: ${error.message}`;
        continue;
      }

      takenSlugs.add(slug);
      titles.push(String(article.title));
      report[category.name] = `published /blog/${slug}`;
      published++;
    }

    // Housekeeping runs here too so archiving happens even if a scrape fails.
    await supabase.rpc("archive_stale_listings");

    return new Response(
      JSON.stringify({ success: true, published, ms: Date.now() - started, report }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("generate-weekly-blog error", error);
    // Graceful degradation: never fail the weekly schedule.
    return new Response(
      JSON.stringify({ success: false, error: String(error), report }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
