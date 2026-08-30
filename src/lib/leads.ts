/**
 * The leads table policy enforces length limits (contact 3-200, name <= 120,
 * school <= 160, notes <= 1000, source <= 200). Concatenated notes/source
 * strings can breach those limits and the insert then fails as an RLS
 * violation, losing the lead. Clamp every field before inserting.
 */
export const LEAD_LIMITS = {
  name: 120,
  contact: 200,
  school: 160,
  notes: 1000,
  source: 200,
} as const;

export const clampLeadField = (
  value: string | null | undefined,
  field: keyof typeof LEAD_LIMITS,
): string | null => {
  const trimmed = (value ?? "").trim();
  if (!trimmed) return null;
  return trimmed.slice(0, LEAD_LIMITS[field]);
};
