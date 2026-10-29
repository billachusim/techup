import { beforeEach, describe, expect, it, vi } from "vitest";
import { createClient, useFakeDb, type FakeDb } from "./stubs/supabase.ts";
import { runPayLinkFollowups, type SendEmail } from "../../src/lib/pay-link-followups.server";

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;
const NOW = Date.parse("2026-10-29T10:00:00.000Z");
const at = (ms: number) => new Date(ms).toISOString();

let db: FakeDb;
let send: ReturnType<typeof vi.fn> & SendEmail;

const linked = (id: string, over: Record<string, unknown> = {}) => ({
  id,
  faculty_id: "TF001",
  plan_name: "Developer Pro",
  status: "pending",
  tx_ref: `TF-TF001-${id}`,
  amount_due: 100000,
  currency: "NGN",
  pay_link_url: `https://flw/${id}`,
  pay_link_created_at: at(NOW - HOUR),
  ...over,
});
const row = (id: string) => db.tables.enrollments.find((r) => r.id === id)!;
const run = () => runPayLinkFollowups(createClient() as never, send, NOW);
const templates = () => send.mock.calls.map(([template, , opts]) => [template, (opts as { templateData: { reminder: boolean } }).templateData.reminder]);

beforeEach(() => {
  db = { users: {}, tables: { enrollments: [], admin_audit_log: [], profiles: [{ faculty_id: "TF001", name: "Ada Obi", email: "ada@example.com" }] } };
  useFakeDb(db);
  send = vi.fn(async () => ({ sent: true })) as typeof send;
});

describe("pay link emails", () => {
  it("emails a new pay link once, with the amount and cancel date", async () => {
    db.tables.enrollments.push(linked("a"));
    expect(await run()).toEqual({ payLinksSent: 1, payLinkRemindersSent: 0, cancelNoticesSent: 0 });
    expect(send).toHaveBeenCalledWith("pay-link", "ada@example.com", {
      templateData: expect.objectContaining({ payUrl: "https://flw/a", amount: "₦100,000", cancelOn: "12 November", reminder: false }),
      idempotencyKey: "pay_link_sent_at-a",
    });
    expect(typeof row("a").pay_link_sent_at).toBe("string");
    expect(db.tables.admin_audit_log).toEqual([expect.objectContaining({ action: "payment.pay_link_emailed", actor_email: "automation" })]);

    await run();
    expect(send).toHaveBeenCalledTimes(1);
  });

  it("sends one reminder two days after the link email", async () => {
    db.tables.enrollments.push(
      linked("due", { pay_link_sent_at: at(NOW - 2 * DAY - HOUR) }),
      linked("early", { pay_link_sent_at: at(NOW - DAY) }),
    );
    expect(await run()).toMatchObject({ payLinksSent: 0, payLinkRemindersSent: 1 });
    expect(templates()).toEqual([["pay-link", true]]);
    expect(typeof row("due").pay_link_reminder_sent_at).toBe("string");
    expect(row("early").pay_link_reminder_sent_at).toBeUndefined();
    await run();
    expect(send).toHaveBeenCalledTimes(1);
  });

  it("stops once the plan is paid, and tells the student when it is cancelled", async () => {
    db.tables.enrollments.push(
      linked("paid", { status: "active", pay_link_sent_at: at(NOW - 3 * DAY) }),
      linked("gone", { status: "cancelled", auto_cancelled_at: at(NOW - HOUR), pay_link_sent_at: at(NOW - 14 * DAY), pay_link_reminder_sent_at: at(NOW - 12 * DAY) }),
      linked("admin-cancelled", { status: "cancelled", pay_link_sent_at: at(NOW - 3 * DAY) }),
    );
    expect(await run()).toEqual({ payLinksSent: 0, payLinkRemindersSent: 0, cancelNoticesSent: 1 });
    expect(send.mock.calls.map(([template]) => template)).toEqual(["pay-link-cancelled"]);
  });

  it("frees the email to retry when sending fails, and skips students without an email", async () => {
    db.tables.profiles = [{ faculty_id: "TF001", name: "Ada Obi", email: null }];
    db.tables.enrollments.push(linked("no-email"));
    expect(await run()).toMatchObject({ payLinksSent: 0 });
    expect(row("no-email").pay_link_sent_at).toBeUndefined();

    db.tables.profiles = [{ faculty_id: "TF001", name: "Ada Obi", email: "ada@example.com" }];
    send.mockRejectedValueOnce(new Error("down"));
    expect(await run()).toMatchObject({ payLinksSent: 0 });
    expect(row("no-email").pay_link_sent_at).toBeNull();
    expect(await run()).toMatchObject({ payLinksSent: 1 });
  });
});
