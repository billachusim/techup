// Talent approval rule (Bill, 2026-11-20): every talent profile is approved as
// soon as it is saved, whatever its strength. Approval only lists the talent;
// it never gives a Faculty ID or the Vetted badge. A profile is auto-approved
// once: if staff later un-approve it, the automation leaves it alone.

export type ApprovalCandidate = { id: string; approved_at: string | null };

export function profilesToAutoApprove<T extends ApprovalCandidate>(
  profiles: T[],
  autoApprovedBefore: Set<string>,
): T[] {
  return profiles.filter((p) => !p.approved_at && !autoApprovedBefore.has(p.id));
}
