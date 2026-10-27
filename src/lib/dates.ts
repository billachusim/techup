/** Today in Lagos, as YYYY-MM-DD. */
export const lagosToday = (now = new Date()) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Lagos" }).format(now);

/** "Mon, 3 Nov 2026" for a YYYY-MM-DD date. */
export const formatDay = (date: string) =>
  new Date(`${date}T12:00:00Z`).toLocaleDateString("en-NG", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
