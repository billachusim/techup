import { defineTool } from "@lovable.dev/mcp-js";

const services = [
  { slug: "business-partnerships", title: "Business Partnerships", description: "Corporate training, AI workshops, and business digitization programs for organizations.", url: "https://techfaculty.ng/business-partnerships" },
  { slug: "school-collaborations", title: "School Collaborations", description: "University bootcamps, curriculum integration, and student certification programs.", url: "https://techfaculty.ng/school-collaborations" },
  { slug: "events", title: "Events", description: "Community tech workshops, hackathons, speaker sessions, and networking events.", url: "https://techfaculty.ng/events" },
  { slug: "siwes", title: "SIWES / Industrial Training", description: "IT placements for university students — Learn & Pay or Tutor & Earn tracks.", url: "https://techfaculty.ng/siwes" },
];

export default defineTool({
  name: "list_services",
  title: "List services",
  description: "List Tech Faculty services beyond training: business partnerships, school collaborations, events, and SIWES.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(services, null, 2) }],
    structuredContent: { services },
  }),
});
