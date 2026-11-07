/**
 * One card per student and plan in Admin > Payments to confirm. Repeat
 * requests and abandoned card checkouts for the same plan are folded into the
 * newest one (pure, tested in tests/payments/pending-requests.test.ts).
 */
export type PendingRow = {
  id: string;
  faculty_id: string;
  plan_name: string;
  created_at: string;
  pay_link_url?: string | null;
};

export type GroupedPending<T extends PendingRow> = T & {
  /** The older pending rows for the same student and plan. */
  duplicate_ids: string[];
};

export function groupPendingRequests<T extends PendingRow>(
  rows: T[],
): GroupedPending<T>[] {
  const groups = new Map<string, T[]>();
  for (const r of rows) {
    const key = `${r.faculty_id}\u0000${r.plan_name}`;
    const list = groups.get(key);
    if (list) list.push(r);
    else groups.set(key, [r]);
  }
  const out: GroupedPending<T>[] = [];
  for (const list of groups.values()) {
    // Show the request the student can still pay: one with a pay link first, then the newest.
    const sorted = [...list].sort((a, b) => {
      const link = Number(!a.pay_link_url) - Number(!b.pay_link_url);
      return link !== 0 ? link : b.created_at.localeCompare(a.created_at);
    });
    const [main, ...rest] = sorted;
    out.push({ ...main, duplicate_ids: rest.map((r) => r.id) });
  }
  return out.sort((a, b) => b.created_at.localeCompare(a.created_at));
}
