import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createClient,
  useFakeDb,
  type FakeDb,
} from "../payments/stubs/supabase";
import {
  FOLLOWUP_DAYS,
  followupDueAt,
  followupEmail,
  isSendingHour,
  startsSequence,
} from "../../src/lib/lead-followups";
import {
  runLeadFollowups,
  unsubscribeLeadFollowups,
  type SendEmail,
} from "../../src/lib/lead-followups.server";

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;
// 10:00 in Lagos.
const NOON = Date.parse("2026-10-25T09:00:00.000Z");
const at = (ms: number) => new Date(ms).toISOString();

let db: FakeDb;
let send: ReturnType<typeof vi.fn> & SendEmail;

const lead = (id: string, over: Record<string, unknown> = {}) => ({
  id,
  name: "Ada Obi",
  email: `${id}@example.com`,
  interest: "virtual_siwes",
  status: "new",
  created_at: at(NOON - 2 * HOUR),
  whatsapp_opt_in: false,
  ...over,
});
const followup = (email: string) =>
  db.tables.lead_email_followups.find((r) => r.email === email)!;
const run = (now: number) => runLeadFollowups(createClient(), send, now);

beforeEach(() => {
  db = {
    users: {},
    tables: {
      leads: [],
      lead_email_followups: [],
      profiles: [],
      enrollments: [],
    },
  };
  useFakeDb(db);
  send = vi.fn(async () => ({ sent: true })) as typeof send;
});

describe("lead follow-up copy and timing", () => {
  it("has three emails for each interest, and none for partner enquiries", () => {
    for (const interest of [
      "free_checklist",
      "success_kit",
      "siwes_placement",
      "virtual_siwes",
      "logbook_service",
      "whatsapp_chat",
      "something_new",
    ]) {
      for (let step = 0; step < FOLLOWUP_DAYS.length; step++)
        expect(followupEmail(interest, step)?.subject).toBeTruthy();
      expect(followupEmail(interest, FOLLOWUP_DAYS.length)).toBeNull();
    }
    expect(followupEmail("partner_enquiry", 0)).toBeNull();
  });

  it("never offers to fill in missing logbook weeks", () => {
    for (let step = 0; step < 3; step++) {
      expect(
        followupEmail("logbook_service", step)!.paragraphs.join(" "),
      ).not.toMatch(/missing weeks/i);
    }
  });

  it("is due 1, 3 and 7 days after the enquiry, at least a day apart", () => {
    const created = at(NOON);
    expect(followupDueAt(created, 0, NOON)).toBe(at(NOON + DAY));
    expect(followupDueAt(created, 1, NOON + DAY)).toBe(at(NOON + 3 * DAY));
    // The first email went out late, on day 3: the second waits a day.
    expect(followupDueAt(created, 1, NOON + 3 * DAY)).toBe(at(NOON + 4 * DAY));
    expect(followupDueAt(created, 3, NOON)).toBeNull();
  });

  it("only sends between 08:00 and 20:00 Lagos time", () => {
    expect(isSendingHour(Date.parse("2026-10-25T06:59:00Z"))).toBe(false);
    expect(isSendingHour(Date.parse("2026-10-25T07:00:00Z"))).toBe(true);
    expect(isSendingHour(Date.parse("2026-10-25T18:59:00Z"))).toBe(true);
    expect(isSendingHour(Date.parse("2026-10-25T19:00:00Z"))).toBe(false);
  });

  it("skips leads without an email, closed leads, WhatsApp opt-ins and old leads", () => {
    const base = lead("a");
    expect(startsSequence(base, NOON)).toBe(true);
    expect(startsSequence({ ...base, email: null }, NOON)).toBe(false);
    expect(startsSequence({ ...base, status: "not_interested" }, NOON)).toBe(
      false,
    );
    expect(startsSequence({ ...base, whatsapp_opt_in: true }, NOON)).toBe(
      false,
    );
    expect(
      startsSequence({ ...base, created_at: at(NOON - 3 * DAY) }, NOON),
    ).toBe(false);
  });
});

describe("runLeadFollowups", () => {
  it("starts one sequence per email address and sends the first email a day later", async () => {
    db.tables.leads.push(
      lead("a"),
      lead("a2", { email: "a@example.com", interest: "free_checklist" }),
    );

    expect(await run(NOON)).toMatchObject({ started: 1, sent: 0 });
    expect(db.tables.lead_email_followups).toHaveLength(1);
    expect(followup("a@example.com")).toMatchObject({
      interest: "virtual_siwes",
      steps_sent: 0,
    });

    expect(await run(NOON + DAY)).toMatchObject({ sent: 1 });
    expect(send).toHaveBeenCalledWith(
      "lead-follow-up",
      "a@example.com",
      expect.objectContaining({
        templateData: expect.objectContaining({
          interest: "virtual_siwes",
          step: 0,
        }),
      }),
    );
    expect(followup("a@example.com")).toMatchObject({
      steps_sent: 1,
      next_due_at: at(NOON - 2 * HOUR + 3 * DAY),
    });

    // Nothing more is due yet, so a second call sends nothing.
    expect(await run(NOON + DAY + HOUR)).toMatchObject({ sent: 0 });
    expect(send).toHaveBeenCalledTimes(1);
  });

  it("sends all three emails, then stops", async () => {
    db.tables.leads.push(lead("a"));
    await run(NOON);
    for (const day of [1, 3, 7]) await run(NOON + day * DAY);
    expect(send).toHaveBeenCalledTimes(3);
    expect(followup("a@example.com")).toMatchObject({
      steps_sent: 3,
      stop_reason: "completed",
      next_due_at: null,
    });
    await run(NOON + 30 * DAY);
    expect(send).toHaveBeenCalledTimes(3);
  });

  it("waits for daytime in Lagos", async () => {
    db.tables.leads.push(lead("a"));
    await run(NOON);
    expect(await run(Date.parse("2026-10-26T22:00:00Z"))).toMatchObject({
      quietHours: true,
      sent: 0,
    });
    expect(send).not.toHaveBeenCalled();
  });

  it("stops when the lead is marked not interested", async () => {
    db.tables.leads.push(lead("a"));
    await run(NOON);
    db.tables.leads[0].status = "not_interested";
    expect(await run(NOON + DAY)).toMatchObject({ sent: 0, stopped: 1 });
    expect(followup("a@example.com")).toMatchObject({
      stop_reason: "lead_closed",
    });
  });

  it("stops when the person has enrolled and paid", async () => {
    db.tables.leads.push(lead("a"));
    await run(NOON);
    db.tables.profiles.push({ faculty_id: "TF001", email: "a@example.com" });
    db.tables.enrollments.push({
      faculty_id: "TF001",
      status: "active",
      plan_name: "Developer Pro",
      paid_at: at(NOON),
    });
    expect(await run(NOON + DAY)).toMatchObject({ sent: 0, stopped: 1 });
    expect(followup("a@example.com")).toMatchObject({
      stop_reason: "enrolled",
    });
  });

  it("puts the email back to retry when sending fails", async () => {
    db.tables.leads.push(lead("a"));
    await run(NOON);
    send.mockRejectedValueOnce(new Error("provider down"));
    expect(await run(NOON + DAY)).toMatchObject({ sent: 0, failed: 1 });
    expect(followup("a@example.com")).toMatchObject({
      steps_sent: 0,
      next_due_at: at(NOON + DAY + HOUR),
    });
    expect(await run(NOON + DAY + HOUR)).toMatchObject({ sent: 1 });
  });

  it("stops writing to a suppressed address", async () => {
    db.tables.leads.push(lead("a"));
    await run(NOON);
    send.mockResolvedValueOnce({ sent: false });
    await run(NOON + DAY);
    expect(followup("a@example.com")).toMatchObject({
      stop_reason: "suppressed",
    });
  });

  it("stops after the unsubscribe link is used", async () => {
    db.tables.leads.push(lead("a"));
    await run(NOON);
    followup("a@example.com").unsubscribe_token =
      "11111111-2222-3333-4444-555555555555";
    expect(
      await unsubscribeLeadFollowups(
        createClient(),
        "11111111-2222-3333-4444-555555555555",
      ),
    ).toBe(true);
    expect(await unsubscribeLeadFollowups(createClient(), "not-a-token")).toBe(
      false,
    );
    await run(NOON + DAY);
    expect(send).not.toHaveBeenCalled();
    expect(followup("a@example.com")).toMatchObject({
      stop_reason: "unsubscribed",
    });
  });
});
