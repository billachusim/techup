import { defineTool } from "@lovable.dev/mcp-js";
import { campuses } from "../../../data/campuses";

export default defineTool({
  name: "list_campuses",
  title: "List campuses",
  description: "List Tech Faculty physical campus locations across Nigeria.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(campuses, null, 2) }],
    structuredContent: { campuses },
  }),
});
