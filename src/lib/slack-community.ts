// Slack community rules: weekly #general update and which messages the assistant answers.
// Pure functions, no I/O (tested in tests/slack-community.test.ts).
export const SITE = "https://techfaculty.ng";

export const LINKS = {
  freeBootcamp: `${SITE}/#free-bootcamp`,
  courses: `${SITE}/#pricing`,
  departments: `${SITE}/departments`,
  careers: `${SITE}/careers`,
  events: `${SITE}/events`,
  siwes: `${SITE}/siwes`,
  virtualSiwes: `${SITE}/virtual-siwes`,
  locations: `${SITE}/locations`,
  verify: `${SITE}/verify`,
};

export type OpenRole = {
  slug: string;
  title: string;
  company: string | null;
  city: string | null;
  is_remote: boolean | null;
  pay_text: string | null;
  is_featured: boolean | null;
  applications_closed: boolean | null;
};

export type UpcomingEvent = { slug: string; title: string; city: string | null; starts_at: string | null };

export const roleUrl = (slug: string) => `${SITE}/talent/roles/${slug}`;

/** Tech Faculty's own roles (incl. Aboutbot) come first, then featured client roles. Closed roles are dropped. */
export function prioritiseRoles(roles: OpenRole[]): OpenRole[] {
  const own = (r: OpenRole) => /tech faculty|aboutbot/i.test(r.company ?? "");
  return roles
    .filter((r) => !r.applications_closed)
    .sort((a, b) => Number(own(b)) - Number(own(a)) || Number(!!b.is_featured) - Number(!!a.is_featured));
}

const where = (r: OpenRole) => (r.is_remote ? "remote" : r.city ? `on-site, ${r.city}` : "");

export function buildWeeklyUpdate(roles: OpenRole[], events: UpcomingEvent[], maxRoles = 8): string {
  const list = prioritiseRoles(roles).slice(0, maxRoles);
  const roleLines = list.map((r) => `• <${roleUrl(r.slug)}|${r.title}>${where(r) ? ` (${where(r)})` : ""}`);
  const eventLines = events.slice(0, 3).map((e) => `• <${SITE}/events/${e.slug}|${e.title}>${e.city ? ` (${e.city})` : ""}`);
  return [
    ":sunrise: *This week at Tech Faculty*",
    roleLines.length
      ? `:briefcase: *Open roles. Apply now; we match applicants automatically:*\n${roleLines.join("\n")}\nAll openings: <${LINKS.careers}|techfaculty.ng/careers>`
      : "",
    `:mortar_board: *Learn:* <${LINKS.freeBootcamp}|Free bootcamp> for beginners, plus <${LINKS.courses}|affordable online courses> with instalments. Online anywhere, or at our campuses across Nigeria (<${LINKS.locations}|locations>).`,
    `:school: *SIWES:* on-site at our campuses or <${LINKS.virtualSiwes}|Virtual SIWES> online.`,
    eventLines.length ? `:calendar: *Upcoming tech events:*\n${eventLines.join("\n")}\nMore: <${LINKS.events}|techfaculty.ng/events>` : "",
    ":speech_balloon: Got a question? Ask in this channel and we'll answer.",
  ].filter(Boolean).join("\n\n");
}

export type SlackMessageEvent = {
  type?: string;
  subtype?: string;
  bot_id?: string;
  user?: string;
  text?: string;
  channel?: string;
  ts?: string;
  thread_ts?: string;
};

const QUESTION_START = /^(how|what|where|when|why|who|which|can|could|is|are|do|does|did|will|should|pls|please|any|i need|i want|help)\b/;

export function looksLikeQuestion(text: string): boolean {
  const t = text.toLowerCase().replace(/<[^>]+>/g, "").trim();
  if (t.length < 8) return false;
  return t.includes("?") || QUESTION_START.test(t) || /\b(lost|confused|how do i|how can i)\b/.test(t);
}

/** Should the assistant consider replying? Mentions always count; plain channel messages only if they read as a question. */
export function shouldConsider(e: SlackMessageEvent, opts: { excludedChannelIds?: string[] } = {}): boolean {
  if (!e.user || e.bot_id || e.subtype || !e.text || !e.channel) return false;
  if (opts.excludedChannelIds?.includes(e.channel)) return false;
  if (e.text.length > 1200) return false;
  if (e.type === "app_mention") return true;
  if (e.type !== "message") return false;
  return looksLikeQuestion(e.text);
}

export const SKIP = "SKIP";

export function assistantInstructions(facts: string): string {
  return [
    "You are the Tech Faculty NG assistant in the Tech Faculty Slack community (Nigeria).",
    "Answer the member's question briefly (max ~90 words) and warmly, in Slack mrkdwn. Links as <url|label>.",
    "Use ONLY the facts below. Never invent prices, dates, pay or promises. If facts don't cover it, say the team will follow up and point to the most relevant link.",
    "Payments, refunds, discounts, certificates, account problems or complaints: say Mr. Bill Achusim's team will help, and give the official WhatsApp +234 806 859 7140.",
    "For job-seekers: point to the matching role link and say applications are matched automatically.",
    `If the message is not a question or request for help (greetings, skill lists, chatter), reply exactly ${SKIP}.`,
    "",
    "FACTS:",
    facts,
  ].join("\n");
}
