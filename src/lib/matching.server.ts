// Server-only auto-matching. Uses the same keyword pre-rank + AI scoring as the
// "Run AI matching" button, then creates matches that clear the role threshold
// exactly like a manual approval (match email + Slack invite).
import {
  autoMatchBlocker,
  facultyFieldBoost,
  FILLED_STATUSES,
  keywordScore,
  pickAutoMatches,
  type MatchCandidate,
  type MatchRole,
} from "@/lib/matching";

type Candidate = MatchCandidate & {
  full_name: string;
  country: string | null;
  headline: string | null;
  years_experience: number | null;
  hours_per_week: number | null;
  work_mode: string | null;
  user_id: string | null;
  faculty_id: string | null;
};

type FullRole = MatchRole & {
  title: string;
  company: string;
  seniority: string;
  summary: string;
  description: string;
};

async function aiScore(role: FullRole, shortlist: Candidate[]): Promise<{ id: string; score: number; reason: string }[] | null> {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key || !shortlist.length) return null;
  const prompt = `You are matching talent to a role for Tech Faculty, a Nigerian tech training and talent company.

ROLE
Title: ${role.title}
Company: ${role.company}
Location: ${role.city ?? "Anywhere"}${role.is_remote ? " (remote friendly)" : " (on-site)"}
Seniority: ${role.seniority}
Summary: ${role.summary}
Description: ${role.description.slice(0, 2000)}
Required skills: ${(role.required_skills ?? []).join(", ") || "not specified"}
Nice to have: ${(role.nice_to_have ?? []).join(", ") || "none"}

CANDIDATES
${shortlist
  .map(
    (c, i) => `${i + 1}. id=${c.id}
   location: ${[c.city, c.country].filter(Boolean).join(", ") || "unknown"}
   headline: ${c.headline ?? "-"}
   skills: ${(c.skills ?? []).join(", ") || "-"}
   tools: ${(c.tools ?? []).join(", ") || "-"}
   experience: ${c.years_experience ?? "unknown"} years
   availability: ${c.hours_per_week ?? "?"} hrs/week, ${c.work_mode ?? "?"}
   vetted: ${c.is_vetted ? "yes" : "no"}`,
  )
  .join("\n")}

Return ONLY JSON: {"matches":[{"id":"<candidate id>","score":<0-100>,"reason":"<one sentence, max 200 chars, plain English>"}]}
Score every candidate. Judge on skill fit, seniority fit, location/remote fit and availability. Never invent facts.`;
  try {
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "openai/gpt-6-astra",
        reasoning_effort: "low",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      }),
    });
    if (!res.ok) {
      console.error("auto-match AI error", res.status);
      return null;
    }
    const json = await res.json();
    const raw: string = json?.choices?.[0]?.message?.content ?? "";
    const parsed = JSON.parse(raw.replace(/^```json\s*|```$/g, "").trim());
    if (!Array.isArray(parsed?.matches)) return null;
    return parsed.matches
      .filter((m: { id?: unknown }) => typeof m?.id === "string" && shortlist.some((c) => c.id === m.id))
      .map((m: { id: string; score?: unknown; reason?: unknown }) => ({
        id: m.id,
        score: Math.max(0, Math.min(100, Math.round(Number(m.score) || 0))),
        reason: String(m.reason ?? "").slice(0, 240) || "Strong fit for this role.",
      }));
  } catch (e) {
    console.error("auto-match AI failed", (e as Error).message);
    return null;
  }
}

export type AutoMatchResult = {
  rolesChecked: number;
  created: number;
  /** "Run AI matching" suggestions that cleared the role threshold and were approved. */
  promoted: number;
  channelsCreated: number;
  /** Talent profiles approved automatically (strength 70%+). */
  talentApproved: number;
  skipped: Record<string, string>;
};

/**
 * Scores open roles against open talent and creates matches above each role's threshold.
 * Pass roleIds and/or talentIds to narrow the scan; omit both to rescan everything.
 */
export async function runAutoMatch(opts: { roleIds?: string[]; talentIds?: string[] } = {}): Promise<AutoMatchResult> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { afterMatchStageChange, ensureProjectChannels } = await import("@/lib/match-slack.server");
  const result: AutoMatchResult = { rolesChecked: 0, created: 0, promoted: 0, channelsCreated: 0, talentApproved: 0, skipped: {} };

  // Approval follows its own rule and doesn't depend on the pause switch.
  if (opts.talentIds?.length || !opts.roleIds?.length) {
    try {
      const { autoApproveStrongProfiles } = await import("@/lib/talent-auto-approve.server");
      result.talentApproved = (await autoApproveStrongProfiles(opts.talentIds)).approved;
    } catch (e) {
      console.error("talent auto-approve failed", (e as Error).message);
    }
  }

  // Project channels don't depend on the pause switch; a profile save alone doesn't need the scan.
  if (opts.roleIds?.length || !opts.talentIds?.length) {
    try {
      result.channelsCreated = (await ensureProjectChannels(opts.roleIds)).created;
    } catch (e) {
      console.error("project channels failed", (e as Error).message);
    }
  }

  const { data: settings } = await supabaseAdmin.from("marketplace_settings").select("auto_match_paused").maybeSingle();
  const paused = !!settings?.auto_match_paused;
  if (paused) {
    result.skipped.all = "Auto-matching is paused";
    return result;
  }

  let rq = supabaseAdmin.from("talent_roles").select("*").eq("status", "published");
  if (opts.roleIds?.length) rq = rq.in("id", opts.roleIds);
  const { data: roles } = await rq;

  let tq = supabaseAdmin
    .from("talent_profiles")
    .select("id, full_name, city, country, headline, skills, tools, years_experience, hours_per_week, work_mode, is_vetted, profile_strength, user_id, faculty_id")
    .eq("availability", "open")
    .order("profile_strength", { ascending: false })
    .limit(200);
  if (opts.talentIds?.length) tq = tq.in("id", opts.talentIds);
  const { data: talents } = await tq;
  const pool = (talents ?? []) as Candidate[];
  const { loadFacultyTalent } = await import("@/lib/faculty-talent.server");
  const students = await loadFacultyTalent(pool);
  const boostFor = (role: FullRole, talentId: string) => facultyFieldBoost(role, students.get(talentId)?.field);

  for (const role of (roles ?? []) as unknown as FullRole[]) {
    result.rolesChecked++;
    const { data: existing } = await supabaseAdmin.from("role_matches").select("id, talent_profile_id, status, score").eq("role_id", role.id);
    const filled = (existing ?? []).filter((m) => FILLED_STATUSES.includes(m.status)).length;
    const blocker = autoMatchBlocker(role, filled, paused);
    if (blocker) {
      result.skipped[role.id] = blocker;
      continue;
    }
    const threshold = role.auto_match_threshold ?? 75;
    // Suggestions from the "Run AI matching" button follow the same bar as auto-matches.
    const toPromote = (existing ?? [])
      .filter((m) => m.status === "suggested" && m.score + boostFor(role, m.talent_profile_id) >= threshold)
      .map((m) => m.id);
    if (toPromote.length) {
      const { data: promoted } = await supabaseAdmin
        .from("role_matches")
        .update({ status: "approved" })
        .in("id", toPromote)
        .eq("status", "suggested")
        .select("id");
      for (const row of promoted ?? []) {
        result.promoted++;
        await afterMatchStageChange(row.id);
      }
    }

    const already = new Set((existing ?? []).map((m) => m.talent_profile_id));
    const fresh = pool.filter((c) => !already.has(c.id));
    if (!fresh.length) continue;

    // Keyword pre-rank first; skip AI cost when nobody is close to the bar.
    const shortlist = fresh
      .map((c) => ({ c, base: keywordScore(role, c) + boostFor(role, c.id) }))
      .filter((x) => x.base >= threshold - 25)
      .sort((a, b) => b.base - a.base)
      .slice(0, 15);
    if (!shortlist.length) continue;

    const ai = await aiScore(role, shortlist.map((x) => x.c));
    const scored =
      ai ??
      shortlist.map(({ c, base }) => ({
        id: c.id,
        score: base,
        reason: `Skills overlap with the role requirements${c.city ? ` and based in ${c.city}` : ""}.`,
      }));

    // Students and alumni get extra points on roles in the field they studied.
    const boosted = scored.map((s) => {
      const extra = boostFor(role, s.id);
      if (!extra) return s;
      // Keyword fallback scores already include the boost; AI scores don't.
      return {
        id: s.id,
        score: Math.min(100, s.score + (ai ? extra : 0)),
        reason: `${s.reason} Tech Faculty trained in this field (+${extra}).`.slice(0, 280),
      };
    });
    const picks = pickAutoMatches(boosted, threshold, already);
    if (!picks.length) continue;

    const { data: inserted, error } = await supabaseAdmin
      .from("role_matches")
      .upsert(
        picks.map((p) => ({
          role_id: role.id,
          talent_profile_id: p.id,
          score: p.score,
          reason: p.reason,
          status: "approved",
          source: "auto",
        })),
        { onConflict: "role_id,talent_profile_id", ignoreDuplicates: true },
      )
      .select("id");
    if (error) {
      console.error("auto-match insert failed", error.message);
      continue;
    }
    for (const row of inserted ?? []) {
      result.created++;
      await afterMatchStageChange(row.id);
    }
  }
  return result;
}
