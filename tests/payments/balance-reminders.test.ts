import { describe, expect, it } from "vitest";
import {
  daysUntil,
  dueReminder,
  inSendingHours,
} from "../../src/lib/balance-reminders";

describe("dueReminder", () => {
  const due = "2026-11-20";

  it("waits until 7 days before the due date", () => {
    expect(dueReminder(due, "2026-11-12", {})).toBeNull();
    expect(dueReminder(due, "2026-11-13", {})).toBe("due_soon");
  });

  it("sends each stage once", () => {
    expect(
      dueReminder(due, "2026-11-15", { due_soon_sent_at: "x" }),
    ).toBeNull();
    expect(dueReminder(due, "2026-11-19", { due_soon_sent_at: "x" })).toBe(
      "due_tomorrow",
    );
    expect(
      dueReminder(due, "2026-11-20", { due_tomorrow_sent_at: "x" }),
    ).toBeNull();
  });

  it("covers the due date itself when the day-before email was missed", () => {
    expect(dueReminder(due, "2026-11-20", {})).toBe("due_tomorrow");
  });

  it("sends one overdue email, only for recently missed balances", () => {
    expect(dueReminder(due, "2026-11-21", {})).toBe("overdue");
    expect(dueReminder(due, "2026-11-22", { overdue_sent_at: "x" })).toBeNull();
    expect(dueReminder(due, "2026-12-04", {})).toBe("overdue");
    expect(dueReminder(due, "2026-12-05", {})).toBeNull();
  });

  it("counts days across months", () => {
    expect(daysUntil("2026-12-01", "2026-11-30")).toBe(1);
  });
});

describe("inSendingHours", () => {
  it("uses Lagos time (UTC+1)", () => {
    expect(inSendingHours(new Date("2026-11-01T06:30:00Z"))).toBe(false);
    expect(inSendingHours(new Date("2026-11-01T07:00:00Z"))).toBe(true);
    expect(inSendingHours(new Date("2026-11-01T18:59:00Z"))).toBe(true);
    expect(inSendingHours(new Date("2026-11-01T19:00:00Z"))).toBe(false);
  });
});
