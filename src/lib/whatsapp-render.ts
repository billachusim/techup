type Tpl = { name: string; components?: any[] };

/** Rebuild the text a recipient saw from our stored "[Template] name: a | b" record. */
export function renderStoredBody(body: string | null, templates: Tpl[]): { text: string; template: string | null } {
  const raw = body ?? "";
  const m = raw.match(/^\[Template\]\s+([a-z0-9_]+)(?::\s*([\s\S]*))?$/i);
  if (!m) return { text: raw, template: null };
  const name = m[1];
  const params = m[2] ? m[2].split(" | ") : [];
  const tpl = templates.find((t) => t.name === name);
  const bodyText: string | undefined = tpl?.components?.find((c: any) => c.type === "BODY")?.text;
  if (!bodyText) return { text: params.join("\n"), template: name };
  return { text: bodyText.replace(/\{\{(\d+)\}\}/g, (_, i) => params[Number(i) - 1] ?? ""), template: name };
}

/** Short, readable label for a long tracking link. */
export function shortUrl(url: string): string {
  try {
    const u = new URL(url);
    const path = u.pathname === "/" ? "" : u.pathname.replace(/\/$/, "");
    const label = u.hostname.replace(/^www\./, "") + path + (u.hash && u.hash.length < 20 ? u.hash : "");
    return label.length > 48 ? label.slice(0, 45) + "…" : label;
  } catch {
    return url;
  }
}

export function splitLinks(text: string): Array<{ type: "text" | "link"; value: string }> {
  const out: Array<{ type: "text" | "link"; value: string }> = [];
  let last = 0;
  for (const m of text.matchAll(/https?:\/\/[^\s]+/g)) {
    if (m.index! > last) out.push({ type: "text", value: text.slice(last, m.index) });
    out.push({ type: "link", value: m[0] });
    last = m.index! + m[0].length;
  }
  if (last < text.length) out.push({ type: "text", value: text.slice(last) });
  return out;
}
