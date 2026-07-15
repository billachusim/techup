import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import blogPosts from "../../../data/blogPosts";

export default defineTool({
  name: "search_blog",
  title: "Search blog",
  description: "Case-insensitive keyword search across blog post titles, descriptions, and tags.",
  inputSchema: {
    query: z.string().min(1).describe("Keyword(s) to search for."),
    limit: z.number().int().min(1).max(50).optional().describe("Max results (default 10)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ query, limit }) => {
    const q = query.toLowerCase();
    const matches = blogPosts
      .filter((p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)),
      )
      .slice(0, limit ?? 10)
      .map((p) => ({
        slug: p.slug,
        title: p.title,
        description: p.description,
        date: p.date,
        tags: p.tags,
        url: `https://techfaculty.ng/blog/${p.slug}`,
      }));
    return {
      content: [{ type: "text", text: JSON.stringify({ matches }, null, 2) }],
      structuredContent: { matches },
    };
  },
});
