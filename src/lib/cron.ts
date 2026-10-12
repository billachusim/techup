/** Parses one cron field ("*", "5", "1,15", "1-5", "*\/2") into the values it allows. */
function parseField(field: string, min: number, max: number): Set<number> | null {
  const values = new Set<number>();
  for (const part of field.split(",")) {
    const [range, stepText] = part.split("/");
    const step = stepText ? Number(stepText) : 1;
    let lo = min;
    let hi = max;
    if (range !== "*") {
      const [a, b] = range.split("-").map(Number);
      lo = a;
      hi = b ?? (stepText ? max : a);
    }
    if (![lo, hi, step].every(Number.isInteger) || step < 1 || lo < min || hi > max) return null;
    for (let v = lo; v <= hi; v += step) values.add(v);
  }
  return values;
}

/**
 * The most recent time at or before `now` that a standard 5-field pg_cron schedule fired,
 * read in UTC as pg_cron does. Returns null for schedules it cannot read (e.g. "30 seconds")
 * or when nothing matched in the last 62 days.
 */
export function previousCronRun(schedule: string, now: Date = new Date()): Date | null {
  const fields = schedule.trim().split(/\s+/);
  if (fields.length !== 5) return null;
  const [minF, hourF, domF, monF, dowF] = fields;
  const minutes = parseField(minF, 0, 59);
  const hours = parseField(hourF, 0, 23);
  const days = parseField(domF, 1, 31);
  const months = parseField(monF, 1, 12);
  const weekdays = parseField(dowF.replace(/\b7\b/g, "0"), 0, 6);
  if (!minutes || !hours || !days || !months || !weekdays) return null;

  // Standard cron: when both day fields are restricted, either one matching is enough.
  const dayMatches = (d: Date) => {
    const dom = days.has(d.getUTCDate());
    const dow = weekdays.has(d.getUTCDay());
    if (domF === "*" && dowF === "*") return true;
    if (domF === "*") return dow;
    if (dowF === "*") return dom;
    return dom || dow;
  };

  const t = new Date(now);
  t.setUTCSeconds(0, 0);
  const stop = now.getTime() - 62 * 864e5;
  while (t.getTime() >= stop) {
    if (!months.has(t.getUTCMonth() + 1) || !dayMatches(t)) {
      // Jump to the last minute of the previous day.
      t.setUTCHours(0, 0, 0, 0);
      t.setUTCMinutes(-1);
      continue;
    }
    if (!hours.has(t.getUTCHours())) {
      t.setUTCMinutes(0);
      t.setUTCMinutes(-1);
      continue;
    }
    if (minutes.has(t.getUTCMinutes())) return t;
    t.setUTCMinutes(t.getUTCMinutes() - 1);
  }
  return null;
}

const ordinal = (n: number) => `${n}${[11, 12, 13].includes(n % 100) ? "th" : ["th", "st", "nd", "rd"][n % 10] ?? "th"}`;
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** Plain-English wording for common schedules, in Nigerian time (WAT, UTC+1). Falls back to the raw schedule. */
export function describeCron(schedule: string): string {
  const fields = schedule.trim().split(/\s+/);
  const raw = `on the schedule "${schedule.trim()}" (UTC)`;
  if (fields.length !== 5) return raw;
  const [m, h, dom, mon, dow] = fields;
  if (!/^\d+$/.test(m) || !/^\d+$/.test(h) || mon !== "*") return raw;
  const wat = (Number(h) + 1) % 24;
  const time = `${String(wat).padStart(2, "0")}:${m.padStart(2, "0")} WAT`;
  if (dom === "*" && dow === "*") return `daily at ${time}`;
  if (dom === "*" && /^[0-7]$/.test(dow)) return `every ${WEEKDAYS[Number(dow) % 7]} at ${time}`;
  if (dow === "*" && /^\d+(,\d+)*$/.test(dom)) {
    const days = dom.split(",").map((d) => ordinal(Number(d)));
    const list = days.length > 1 ? `${days.slice(0, -1).join(", ")} and ${days[days.length - 1]}` : days[0];
    return `on the ${list} of each month at ${time}`;
  }
  return raw;
}
