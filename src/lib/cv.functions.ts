import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { normaliseParsedCv, type ParsedCv } from "./cv";

const SCHEMA_HINT = `Return ONLY valid JSON with this exact shape:
{
  "headline": "short professional headline, max 120 chars",
  "bio": "2-4 sentence professional summary written in the first person",
  "city": "city only",
  "country": "country",
  "years_experience": 0,
  "skills": ["max 15 concrete skills"],
  "tools": ["software and tools"],
  "languages": ["spoken languages"],
  "experiences": [
    { "title": "", "company": "", "location": "", "start": "MMM YYYY", "end": "MMM YYYY or Present", "description": "1-3 sentences of achievements" }
  ],
  "education": [
    { "qualification": "", "institution": "", "field": "", "start": "YYYY", "end": "YYYY", "grade": "" }
  ],
  "certifications": [{ "name": "", "issuer": "", "year": "" }]
}
Use only facts present in the CV. Use "" or [] when something is missing. Never invent employers, dates or qualifications.`;

export type ParseCvResult = { parsed: ParsedCv } | { error: string };

/**
 * Reads a member's own uploaded CV and returns structured suggestions. It never
 * writes to the profile — the member reviews and saves the result themselves.
 */
export const parseCv = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { path: string }) => {
    if (!input || typeof input.path !== "string" || input.path.length > 300) {
      throw new Error("Invalid CV reference");
    }
    return { path: input.path };
  })
  .handler(async ({ data, context }): Promise<ParseCvResult> => {
    const { path } = data;
    // Storage paths are prefixed with the owner's user id, so this keeps a
    // member from asking us to read somebody else's CV.
    if (!path.startsWith(`${context.userId}/`)) {
      return { error: "We could not find that CV. Please upload it again." };
    }
    if (!path.toLowerCase().endsWith(".pdf")) {
      return { error: "Automatic filling works with PDF CVs. Please upload a PDF version." };
    }

    const lovableKey = process.env["LOVABLE_API_KEY"];
    if (!lovableKey) return { error: "Automatic CV reading is unavailable right now." };

    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: file, error: dlError } = await supabaseAdmin.storage.from("talent-cvs").download(path);
      if (dlError || !file) return { error: "We could not open that file. Please upload it again." };

      const { extractText, getDocumentProxy } = await import("unpdf");
      const buffer = new Uint8Array(await file.arrayBuffer());
      const pdf = await getDocumentProxy(buffer);
      const extracted = await extractText(pdf, { mergePages: true });
      const raw = Array.isArray(extracted.text) ? extracted.text.join("\n") : extracted.text;
      const cvText = raw.replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();

      if (cvText.length < 120) {
        return {
          error:
            "We could not read any text in that CV — it may be a scanned image. Please upload a text PDF or fill your details in by hand.",
        };
      }

      const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${lovableKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: `You extract structured CV data for a talent marketplace. ${SCHEMA_HINT}` },
            { role: "user", content: cvText.slice(0, 24000) },
          ],
          response_format: { type: "json_object" },
        }),
      });

      if (!aiRes.ok) {
        console.error("parseCv gateway error", aiRes.status, await aiRes.text().catch(() => ""));
        return {
          error:
            aiRes.status === 429
              ? "Our CV reader is busy right now. Please try again in a minute."
              : "We could not read that CV automatically. You can still fill your details in by hand.",
        };
      }

      const payload = (await aiRes.json()) as { choices?: { message?: { content?: string } }[] };
      const content = payload.choices?.[0]?.message?.content ?? "{}";
      let json: unknown = {};
      try {
        json = JSON.parse(content);
      } catch {
        const match = content.match(/\{[\s\S]*\}/);
        json = match ? JSON.parse(match[0]) : {};
      }

      return { parsed: normaliseParsedCv(json) };
    } catch (err) {
      console.error("parseCv failed", err);
      return { error: "Something went wrong reading that CV. You can fill your details in by hand." };
    }
  });
