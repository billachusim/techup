import { defineTool } from "@lovable.dev/mcp-js";
import { jobPlatforms } from "../../../data/jobPlatforms";
import { SITE } from "../_shared/publicClient";

export default defineTool({
  name: "list_job_platforms",
  title: "List remote job platforms",
  description:
    "List the remote work and AI-training platforms (Micro1, Mercor, Outlier, Alignerr and others) Tech Faculty guides Nigerians and Africans to, with what each pays for and the guide page.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const platforms = jobPlatforms.map((p) => ({
      slug: p.slug,
      name: p.name,
      summary: p.blurb,
      about: p.about,
      guideUrl: `${SITE}/careers/platforms/${p.slug}`,
      signupUrl: p.signupUrl,
    }));
    return { content: [{ type: "text", text: JSON.stringify({ platforms }, null, 2) }], structuredContent: { platforms } };
  },
});
