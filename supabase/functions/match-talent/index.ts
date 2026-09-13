import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

type Candidate = {
  id: string;
  full_name: string;
  city: string | null;
  country: string | null;
  headline: string | null;
  bio: string | null;
  skills: string[];
  tools: string[];
  years_experience: number | null;
  hours_per_week: number | null;
  work_mode: string | null;
  rate_amount: number | null;
  rate_currency: string | null;
  is_vetted: boolean;
  profile_strength: number;
};

function keywordScore(role: { required_skills: string[]; nice_to_have: string[]; city: string | null; is_remote: boolean }, c: Candidate) {
  const have = [...(c.skills ?? []), ...(c.tools ?? [])].map((s) => s.toLowerCase());
  const req = (role.required_skills ?? []).map((s) => s.toLowerCase());
  const nice = (role.nice_to_have ?? []).map((s) => s.toLowerCase());
  const hit = (list: string[]) => list.filter((s) => have.some((h) => h.includes(s) || s.includes(h))).length;
  let score = req.length ? (hit(req) / req.length) * 65 : 40;
  if (nice.length) score += (hit(nice) / nice.length) * 10;
  if (role.is_remote || (role.city && c.city && role.city.toLowerCase() === c.city.toLowerCase())) score += 10;
  score += Math.min(c.profile_strength, 100) * 0.1;
  if (c.is_vetted) score += 5;
  return Math.max(5, Math.min(99, Math.round(score)));
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace("Bearer ", "").trim();
    if (!token) return json({ error: "Sign in required" }, 401);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

    const { data: userData, error: userError } = await admin.auth.getUser(token);
    if (userError || !userData.user) return json({ error: "Invalid session" }, 401);

    const { data: isStaff } = await admin.rpc("is_staff", { _user_id: userData.user.id });
    if (!isStaff) return json({ error: "Staff access required" }, 403);

    const body = await req.json().catch(() => ({}));
    const roleId = typeof body?.role_id === "string" ? body.role_id : "";
    if (!roleId) return json({ error: "role_id is required" }, 400);

    const { data: role, error: roleError } = await admin.from("talent_roles").select("*").eq("id", roleId).maybeSingle();
    if (roleError || !role) return json({ error: "Role not found" }, 404);

    const { data: profiles } = await admin
      .from("talent_profiles")
      .select("id, full_name, city, country, headline, bio, skills, tools, years_experience, hours_per_week, work_mode, rate_amount, rate_currency, is_vetted, profile_strength")
      .eq("availability", "open")
      .order("profile_strength", { ascending: false })
      .limit(80);

    const candidates = (profiles ?? []) as Candidate[];
    if (!candidates.length) return json({ created: 0, message: "No open talent profiles to score." });

    const { data: existing } = await admin.from("role_matches").select("talent_profile_id").eq("role_id", roleId);
    const already = new Set((existing ?? []).map((m) => m.talent_profile_id));
    const pool = candidates.filter((c) => !already.has(c.id)).slice(0, 40);
    if (!pool.length) return json({ created: 0, message: "Everyone suitable is already matched to this role." });

    // Pre-rank locally so the AI only reasons over a small, plausible shortlist.
    const preRanked = pool
      .map((c) => ({ candidate: c, base: keywordScore(role, c) }))
      .sort((a, b) => b.base - a.base)
      .slice(0, 15);

    let scored: { id: string; score: number; reason: string }[] = preRanked.map(({ candidate, base }) => ({
      id: candidate.id,
      score: base,
      reason: `Skills overlap with the role requirements${candidate.city ? ` and based in ${candidate.city}` : ""}.`,
    }));

    const lovableKey = Deno.env.get("LOVABLE_API_KEY");
    if (lovableKey) {
      const prompt = `You are matching talent to a role for Tech Faculty, a Nigerian tech training and talent company.

ROLE
Title: ${role.title}
Company: ${role.company}
Location: ${role.city ?? "Anywhere"}${role.is_remote ? " (remote friendly)" : " (on-site)"}
Seniority: ${role.seniority}
Summary: ${role.summary}
Description: ${role.description}
Required skills: ${(role.required_skills ?? []).join(", ") || "not specified"}
Nice to have: ${(role.nice_to_have ?? []).join(", ") || "none"}

CANDIDATES
${preRanked
  .map(({ candidate: c }, i) => `${i + 1}. id=${c.id}
   name: ${c.full_name}
   location: ${[c.city, c.country].filter(Boolean).join(", ") || "unknown"}
   headline: ${c.headline ?? "-"}
   skills: ${(c.skills ?? []).join(", ") || "-"}
   tools: ${(c.tools ?? []).join(", ") || "-"}
   experience: ${c.years_experience ?? "unknown"} years
   availability: ${c.hours_per_week ?? "?"} hrs/week, ${c.work_mode ?? "?"}
   rate: ${c.rate_amount ? `${c.rate_currency} ${c.rate_amount}` : "unspecified"}
   vetted: ${c.is_vetted ? "yes" : "no"}`)
  .join("\n")}

Return ONLY JSON: {"matches":[{"id":"<candidate id>","score":<0-100>,"reason":"<one sentence, max 200 chars, plain English, no markdown>"}]}
Include only candidates scoring 55 or above, at most 10, best first. Judge on skill fit, seniority fit, location/remote fit and availability. Never invent facts about a candidate.`;

      try {
        const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: { Authorization: `Bearer ${lovableKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" },
          }),
        });

        if (aiRes.ok) {
          const aiJson = await aiRes.json();
          const raw = aiJson?.choices?.[0]?.message?.content ?? "";
          const parsed = JSON.parse(raw.replace(/^```json\s*|```$/g, "").trim());
          const valid = Array.isArray(parsed?.matches)
            ? parsed.matches
                .filter((m: { id?: string; score?: number }) => typeof m?.id === "string" && preRanked.some((p) => p.candidate.id === m.id))
                .map((m: { id: string; score?: number; reason?: string }) => ({
                  id: m.id,
                  score: Math.max(0, Math.min(100, Math.round(Number(m.score) || 0))),
                  reason: String(m.reason ?? "").slice(0, 240) || "Strong fit for this role.",
                }))
            : [];
          if (valid.length) scored = valid;
        } else if (aiRes.status === 402 || aiRes.status === 403) {
          console.error("AI gateway blocked", aiRes.status, await aiRes.text());
        } else {
          console.error("AI gateway error", aiRes.status, await aiRes.text());
        }
      } catch (aiErr) {
        console.error("AI matching fell back to keyword scoring:", aiErr);
      }
    }

    const rows = scored
      .filter((s) => s.score >= 50)
      .slice(0, 12)
      .map((s) => ({
        role_id: roleId,
        talent_profile_id: s.id,
        score: s.score,
        reason: s.reason,
        status: "suggested",
        source: "ai",
        created_by: userData.user!.id,
      }));

    if (!rows.length) return json({ created: 0, message: "No candidate scored high enough for this role." });

    const { error: insertError, data: inserted } = await admin.from("role_matches").insert(rows).select("id");
    if (insertError) return json({ error: insertError.message }, 500);

    return json({ created: inserted?.length ?? 0 });
  } catch (err) {
    console.error("match-talent failed:", err);
    return json({ error: err instanceof Error ? err.message : "Unexpected error" }, 500);
  }
});
