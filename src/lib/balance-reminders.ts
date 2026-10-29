// When to remind a student on an instalment plan about their balance. The
// emails go out from payment-followups.server.ts; this file only decides which
// one is due, so it can be tested without a database.

export type BalanceReminderStage = "due_soon" | "due_tomorrow" | "overdue";

export const STAGE_COLUMN = {
  due_soon: "due_soon_sent_at",
  due_tomorrow: "due_tomorrow_sent_at",
  overdue: "overdue_sent_at",
} as const;

/** First reminder this many days before the due date. */
export const REMIND_DAYS_BEFORE = 7;
/** Balances missed longer ago than this get no overdue email (e.g. old plans when this went live). */
export const OVERDUE_EMAIL_WITHIN_DAYS = 14;

const DAY = 24 * 60 * 60 * 1000;

/** Whole days from `today` to `dueBy`, both YYYY-MM-DD (negative once it has passed). */
export function daysUntil(dueBy: string, today: string) {
  return Math.round(
    (Date.parse(`${dueBy}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / DAY,
  );
}

/**
 * The reminder due today, or null. Only the latest stage counts: a plan first
 * seen two days before its due date skips "due soon" and gets "due tomorrow" on
 * its day. Each stage is sent at most once.
 */
export function dueReminder(
  dueBy: string,
  today: string,
  sent: Partial<
    Record<(typeof STAGE_COLUMN)[BalanceReminderStage], string | null>
  >,
): BalanceReminderStage | null {
  const days = daysUntil(dueBy, today);
  let stage: BalanceReminderStage | null = null;
  if (days < 0) stage = -days <= OVERDUE_EMAIL_WITHIN_DAYS ? "overdue" : null;
  else if (days <= 1) stage = "due_tomorrow";
  else if (days <= REMIND_DAYS_BEFORE) stage = "due_soon";
  if (!stage || sent[STAGE_COLUMN[stage]]) return null;
  return stage;
}

/** Hour of the day in Lagos, 0-23. */
export const lagosHour = (now = new Date()) =>
  Number(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Africa/Lagos",
      hour: "2-digit",
      hourCycle: "h23",
    }).format(now),
  );

/** Reminders go out 08:00-20:00 Lagos time only. */
export const inSendingHours = (now = new Date()) => {
  const h = lagosHour(now);
  return h >= 8 && h < 20;
};

export const payBalancePath = (token: string) =>
  `/pay-balance?t=${encodeURIComponent(token)}`;
