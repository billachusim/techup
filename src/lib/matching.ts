// Pure matching rules shared by the "Run AI matching" button, auto-matching and tests.

export type MatchRole = {
  id: string;
  status: string;
  applications_closed: boolean;
  openings: number;
  auto_match_enabled: boolean;
  auto_match_threshold: number;
  required_skills: string[];
  nice_to_have: string[];
  city: string | null;
  is_remote: boolean;
};

export type MatchCandidate = {
  id: string;
  city: string | null;
  skills: string[];
  tools: string[];
  is_vetted: boolean;
  profile_strength: number;
};

export const DEFAULT_AUTO_MATCH_THRESHOLD = 75;

/** Match stages that fill one of the role's openings. */
export const FILLED_STATUSES = ["hired", "onboarded"];

/** Quick keyword score (5-99) used to shortlist before the AI scores. */
export function keywordScore(
  role: Pick<MatchRole, "required_skills" | "nice_to_have" | "city" | "is_remote">,
  c: MatchCandidate,
): number {
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

/** Why a role can't take auto-matches right now, or null when it can. */
export function autoMatchBlocker(role: MatchRole, filled: number, globallyPaused: boolean): string | null {
  if (globallyPaused) return "Auto-matching is paused";
  if (!role.auto_match_enabled) return "Auto-matching is off for this role";
  if (role.status !== "published") return "Role is not open";
  if (role.applications_closed) return "Applications are closed";
  if (filled >= Math.max(1, role.openings)) return "All openings are filled";
  return null;
}

/** Scores that clear the role's threshold, minus pairs that already exist. */
export function pickAutoMatches(
  scored: { id: string; score: number; reason: string }[],
  threshold: number,
  alreadyMatched: Set<string>,
) {
  const seen = new Set<string>();
  return scored.filter((s) => {
    if (s.score < threshold || alreadyMatched.has(s.id) || seen.has(s.id)) return false;
    seen.add(s.id);
    return true;
  });
}
