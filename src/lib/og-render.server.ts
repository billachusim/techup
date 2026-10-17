import { Resvg } from "@cf-wasm/resvg";
import fontData from "@/assets/og/brand-bold.ttf?inline";
import logoData from "../../public/logo.png?inline";
import styles from "../styles.css?raw";
import { renderOgSvg, type OgPalette } from "./og-svg";
import type { OgInput } from "./og-image";

const palette = Object.fromEntries(
  ["background", "grid", "accent", "foreground", "muted", "surface"].map((role) => {
    const value = styles.match(new RegExp(`--og-${role}:\\s*([^;]+);`))?.[1]?.trim();
    if (!value) throw new Error(`Missing OG design token: ${role}`);
    return [role, value];
  }),
) as unknown as OgPalette;

export async function renderOgImage(input: OgInput) {
  const svg = renderOgSvg(input, palette, logoData);
  if (input.format === "svg") return { body: svg, contentType: "image/svg+xml; charset=utf-8" };
  const base64 = fontData.split(",")[1];
  if (!base64) throw new Error("Missing bundled OG font");
  const font = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  const renderer = await Resvg.async(svg, { font: { fontBuffers: [font], loadSystemFonts: false, defaultFontFamily: "Work Sans" } });
  try {
    const rendered = renderer.render();
    try {
      return { body: new Uint8Array(rendered.asPng()).buffer, contentType: "image/png" };
    } finally { rendered.free(); }
  } finally { renderer.free(); }
}