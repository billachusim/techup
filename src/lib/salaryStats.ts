export type SalaryRow = {
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string | null;
  salary_unit: string | null;
};

/** Fewer advertised salaries than this and the live section stays hidden: a median of three ads says nothing. */
export const MIN_LISTINGS = 5;

export function median(values: number[]): number | null {
  if (!values.length) return null;
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

/** Midpoint of an advertised range, or the single figure when only one end is given. */
const midpoint = (r: SalaryRow) => {
  const lo = r.salary_min ?? r.salary_max;
  const hi = r.salary_max ?? r.salary_min;
  return lo && hi ? (lo + hi) / 2 : null;
};

/**
 * Median advertised pay across the open roles on our jobs board, in the unit the ads
 * use most: naira per month (yearly figures divided by 12) and US dollars per hour.
 * Other currencies and units are left out rather than converted at a guessed rate.
 */
export function advertisedPay(rows: SalaryRow[]) {
  const ngnMonthly: number[] = [];
  const usdHourly: number[] = [];
  for (const r of rows) {
    const mid = midpoint(r);
    if (!mid || mid <= 0) continue;
    const cur = (r.salary_currency ?? "").toUpperCase();
    const unit = (r.salary_unit ?? "").toUpperCase();
    if (cur === "NGN" && (unit === "MONTH" || unit === ""))
      ngnMonthly.push(mid);
    else if (cur === "NGN" && unit === "YEAR") ngnMonthly.push(mid / 12);
    else if (cur === "USD" && unit === "HOUR") usdHourly.push(mid);
  }
  return {
    ngnMonthly: {
      count: ngnMonthly.length,
      median: ngnMonthly.length >= MIN_LISTINGS ? median(ngnMonthly) : null,
    },
    usdHourly: {
      count: usdHourly.length,
      median: usdHourly.length >= MIN_LISTINGS ? median(usdHourly) : null,
    },
  };
}
