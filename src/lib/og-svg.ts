import type { OgInput } from "./og-image";

// These roles are shared with the global --og-* design tokens.
export interface OgPalette { background: string; grid: string; accent: string; foreground: string; muted: string; surface: string }
export const escapeXml = (text: string) => text.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c] ?? c);

/** Conservative font-width estimate, including breaking exceptionally long words. */
function wrap(text: string, size: number, width: number, maxLines: number): string[] {
  const measure = (value: string) => [...value].reduce((sum, char) => sum + size * (/[MW@%]/.test(char) ? .95 : /[ilI.,'!:;]/.test(char) ? .32 : /\s/.test(char) ? .3 : .64), 0);
  const words = text.replace(/\s+/g, " ").trim().split(" ").flatMap((word) => {
    const parts: string[] = []; let part = "";
    for (const char of word) {
      if (measure(part + char) > width && part) { parts.push(part); part = ""; }
      part += char;
    }
    if (part) parts.push(part);
    return parts;
  });
  const lines: string[] = []; let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (measure(next) > width && line) { lines.push(line); line = word; }
    else line = next;
  }
  if (line) lines.push(line);
  if (lines.length <= maxLines) return lines;
  const visible = lines.slice(0, maxLines);
  let last = visible[maxLines - 1] ?? "";
  while (last && measure(last + "…") > width) last = last.slice(0, -1);
  visible[maxLines - 1] = last.trimEnd() + "…";
  return visible;
}

export function renderOgSvg(input: OgInput, palette: OgPalette, logoData: string) {
  const p = Object.fromEntries(Object.entries(palette).map(([key, value]) => [key, escapeXml(value)]));
  let size = 64;
  while (size > 42 && wrap(input.title, size, 1056, 20).length > 3) size -= 2;
  const title = wrap(input.title, size, 1056, 3);
  const subtitleY = 242 + title.length * (size + 8) + 24;
  const textLines = (lines: string[], y: number, fontSize: number, color: string) => lines.map((line, i) => `<text x="72" y="${y + i * (fontSize + 8)}" fill="${color}" font-size="${fontSize}">${escapeXml(line)}</text>`).join("");
  const category = wrap(input.category.toUpperCase(), 19, 820, 1)[0] ?? "TECH SKILLS";
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1200" height="630" viewBox="0 0 1200 630">
    <defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="${p.grid}" stroke-width="1"/></pattern><clipPath id="body"><rect x="64" y="170" width="1080" height="370"/></clipPath></defs>
    <rect width="1200" height="630" fill="${p.background}"/><rect width="1200" height="630" fill="url(#grid)"/>
    <rect width="12" height="630" fill="${p.accent}"/>
    <g font-family="Work Sans" font-weight="700">
    <rect x="72" y="48" width="88" height="88" rx="8" fill="${p.foreground}"/>
    <image x="80" y="56" width="72" height="72" xlink:href="${escapeXml(logoData)}"/>
    <text x="184" y="85" fill="${p.foreground}" font-size="32">Tech Faculty NG</text>
    <text x="184" y="121" fill="${p.muted}" font-size="21">Licensed Technology Training Institute</text>
    <g clip-path="url(#body)">
    <rect x="72" y="174" width="${Math.min(1040, category.length * 15 + 36)}" height="36" rx="6" fill="${p.surface}"/>
    <text x="90" y="199" fill="${p.accent}" font-size="19">${escapeXml(category)}</text>
    ${textLines(title, 274, size, p.foreground)}
    ${textLines(wrap(input.subtitle, 25, 1056, 2), subtitleY, 25, p.muted)}
    </g>
    <rect x="12" y="558" width="1188" height="72" fill="${p.background}"/>
    <path d="M72 558H1128" stroke="${p.grid}"/>
    <text x="72" y="603" fill="${p.accent}" font-size="25">techfaculty.ng</text>
    <rect x="1080" y="586" width="48" height="6" fill="${p.accent}"/>
    </g></svg>`;
}