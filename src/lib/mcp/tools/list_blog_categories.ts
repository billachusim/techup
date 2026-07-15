import { defineTool } from "@lovable.dev/mcp-js";
import { blogCategories } from "../../../data/blogCategories";

export default defineTool({
  name: "list_blog_categories",
  title: "List blog categories",
  description: "List blog categories with slugs, names, and intros.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const items = blogCategories.map((c) => ({
      slug: c.slug,
      name: c.name,
      description: c.description,
      intro: c.intro,
    }));
    return {
      content: [{ type: "text", text: JSON.stringify(items, null, 2) }],
      structuredContent: { categories: items },
    };
  },
});
