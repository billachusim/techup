// The queues shown in the "Needs you today" strip on /admin and in the
// morning digest email. Counts come from the needs_you_today_counts database function.

export interface NeedsYouTodayCounts {
  new_leads: number;
  payments_to_confirm: number;
  work_to_review: number;
  talent_requests: number;
  /** null until the referral programme's table exists. */
  referral_rewards: number | null;
}

export interface NeedsYouTodayItem {
  key: keyof NeedsYouTodayCounts;
  label: string;
  path: string;
}

export const NEEDS_YOU_TODAY: NeedsYouTodayItem[] = [
  { key: "new_leads", label: "New leads", path: "/admin/leads" },
  { key: "payments_to_confirm", label: "Payments to confirm", path: "/admin/students" },
  { key: "work_to_review", label: "Work awaiting review", path: "/admin/students" },
  { key: "talent_requests", label: "Talent requests", path: "/admin/talent" },
  { key: "referral_rewards", label: "Referral rewards owed", path: "/admin/referrals" },
];

/** The items that exist on this site, with their counts. */
export function needsYouTodayRows(counts: NeedsYouTodayCounts) {
  return NEEDS_YOU_TODAY.filter((i) => counts[i.key] != null).map((i) => ({ ...i, count: Number(counts[i.key]) }));
}
