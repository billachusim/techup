import { describe, expect, it } from "vitest";
import { describeCron, previousCronRun } from "../../src/lib/cron";

const at = (iso: string) => new Date(iso);

describe("previousCronRun", () => {
  it("finds the last 1st/15th run", () => {
    expect(previousCronRun("0 5 1,15 * *", at("2026-10-12T10:00:00Z"))?.toISOString()).toBe("2026-10-01T05:00:00.000Z");
    expect(previousCronRun("0 5 1,15 * *", at("2026-10-15T05:00:30Z"))?.toISOString()).toBe("2026-10-15T05:00:00.000Z");
    expect(previousCronRun("30 5 1,15 * *", at("2026-10-01T05:00:00Z"))?.toISOString()).toBe("2026-09-15T05:30:00.000Z");
  });

  it("handles weekdays, steps and ranges", () => {
    // 2026-10-12 is a Monday.
    expect(previousCronRun("0 5 * * 1", at("2026-10-11T12:00:00Z"))?.toISOString()).toBe("2026-10-05T05:00:00.000Z");
    expect(previousCronRun("*/15 * * * *", at("2026-10-11T12:07:00Z"))?.toISOString()).toBe("2026-10-11T12:00:00.000Z");
    expect(previousCronRun("0 9-17 * * 1-5", at("2026-10-11T12:00:00Z"))?.toISOString()).toBe("2026-10-09T17:00:00.000Z");
    expect(previousCronRun("0 0 * * 7", at("2026-10-12T12:00:00Z"))?.toISOString()).toBe("2026-10-11T00:00:00.000Z");
  });

  it("returns null for schedules it cannot read", () => {
    expect(previousCronRun("30 seconds")).toBeNull();
    expect(previousCronRun("0 99 * * *")).toBeNull();
  });
});

describe("describeCron", () => {
  it("words common schedules in WAT", () => {
    expect(describeCron("0 5 1,15 * *")).toBe("on the 1st and 15th of each month at 06:00 WAT");
    expect(describeCron("30 5 * * 1")).toBe("every Monday at 06:30 WAT");
    expect(describeCron("0 23 * * *")).toBe("daily at 00:00 WAT");
    expect(describeCron("*/5 * * * *")).toBe('on the schedule "*/5 * * * *" (UTC)');
  });
});
