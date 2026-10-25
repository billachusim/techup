import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  CHART_ROLES,
  EMPLOYER_RANGES,
  PAYLAB_ROLES,
  REPORT,
  SALARY_REPORT_CSV,
  roleByName,
  rolesCsv,
  shortNaira,
} from "../../src/data/salaryReport";
import { advertisedPay, median, MIN_LISTINGS } from "../../src/lib/salaryStats";

describe("Nigerian tech salary report", () => {
  it("keeps the downloadable CSV in step with the data file", () => {
    expect(readFileSync(`public${SALARY_REPORT_CSV}`, "utf8")).toBe(rolesCsv());
  });

  it("has a sane range for every role and the role count the title claims", () => {
    expect(REPORT.title).toContain(`${PAYLAB_ROLES.length} Tech Roles`);
    expect(new Set(PAYLAB_ROLES.map((r) => r.role)).size).toBe(
      PAYLAB_ROLES.length,
    );
    for (const r of PAYLAB_ROLES) expect(r.p10).toBeLessThan(r.p90);
  });

  it("only charts and compares roles that exist in the data", () => {
    for (const name of CHART_ROLES) expect(roleByName(name)).toBeDefined();
    for (const e of EMPLOYER_RANGES)
      if (e.compareTo) expect(roleByName(e.compareTo)).toBeDefined();
  });

  it("formats short naira labels", () => {
    expect(shortNaira(964_595)).toBe("₦965k");
    expect(shortNaira(1_200_000)).toBe("₦1.2M");
    expect(shortNaira(3_000_000)).toBe("₦3M");
  });
});

describe("advertised pay from the jobs board", () => {
  const row = (
    min: number | null,
    max: number | null,
    cur: string,
    unit: string | null,
  ) => ({
    salary_min: min,
    salary_max: max,
    salary_currency: cur,
    salary_unit: unit,
  });

  it("takes medians of range midpoints, normalising yearly naira to monthly", () => {
    expect(median([3, 1, 2])).toBe(2);
    expect(median([1, 2, 3, 4])).toBe(2.5);
    const rows = [
      row(400_000, 600_000, "NGN", "MONTH"),
      row(6_000_000, 6_000_000, "NGN", "YEAR"),
      row(300_000, null, "NGN", null),
      row(700_000, 900_000, "NGN", "MONTH"),
      row(1_000_000, 1_000_000, "NGN", "MONTH"),
      row(20, 40, "USD", "HOUR"),
      row(5000, 6000, "USD", "MONTH"),
    ];
    const pay = advertisedPay(rows);
    expect(pay.ngnMonthly).toEqual({ count: 5, median: 500_000 });
    // One hourly ad is below the threshold, so no median is shown.
    expect(pay.usdHourly).toEqual({ count: 1, median: null });
  });

  it("hides the median below the minimum sample", () => {
    const rows = Array.from({ length: MIN_LISTINGS - 1 }, () =>
      row(100, 200, "NGN", "MONTH"),
    );
    expect(advertisedPay(rows).ngnMonthly.median).toBeNull();
  });
});
