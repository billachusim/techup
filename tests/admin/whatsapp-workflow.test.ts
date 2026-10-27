import { afterEach, describe, expect, it, vi } from "vitest";
import { processInboundLeadWhatsApp, runWhatsAppLeadFollowups } from "../../src/lib/whatsapp-followups.server";
import { processEvent } from "../../src/lib/whatsapp.server";
import type { SupabaseClient } from "@supabase/supabase-js";

afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

describe("WhatsApp workflow boundaries", () => {
  it("does not claim or send when approval cannot be verified", async () => {
    const rpc = vi.fn(async () => ({ data: 0, error: null }));
    vi.stubEnv("LOVABLE_API_KEY", "test-only");
    vi.stubEnv("WHATSAPP_API_KEY", "test-only");
    const fetch = vi.fn(async () => new Response("unavailable", { status: 503 }));
    vi.stubGlobal("fetch", fetch);
    const result = await runWhatsAppLeadFollowups({ rpc } as unknown as SupabaseClient);
    expect(result).toMatchObject({ blocked: true, sent: 0, claimed: 0 });
    expect(rpc.mock.calls.map(([name]) => name)).toEqual(["mark_stale_whatsapp_lead_followups_unresolved"]);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("does not claim pending or marketing admissions templates", async () => {
    const rpc = vi.fn(async () => ({ data: 0, error: null }));
    vi.stubEnv("LOVABLE_API_KEY", "test-only");
    vi.stubEnv("WHATSAPP_API_KEY", "test-only");
    const fetch = vi.fn(async () => Response.json({ data: [
      { name: "tf_admissions_confirmation", language: "en_US", category: "UTILITY", status: "PENDING" },
      { name: "tf_admissions_follow_up", language: "en_US", category: "MARKETING", status: "APPROVED" },
    ] }));
    vi.stubGlobal("fetch", fetch);
    expect(await runWhatsAppLeadFollowups({ rpc } as unknown as SupabaseClient)).toMatchObject({ blocked: true, sent: 0 });
    expect(rpc).toHaveBeenCalledTimes(1);
  });

  it("passes incoming STOP and its original timestamp to durable consent processing", async () => {
    const rpc = vi.fn(async () => ({ error: null }));
    const upsert = vi.fn(async () => ({ error: null }));
    const db = { rpc, from: vi.fn(() => ({ upsert })) } as unknown as SupabaseClient;
    await processEvent(db, { delivery_id: "test-stop", event: "whatsapp.message", payload: {
      entry: [{ changes: [{ value: { messages: [{ id: "test-inbound", from: "2348000000000", type: "text", text: { body: "STOP" }, timestamp: "1793088000" }] } }] }],
    } });
    expect(rpc).toHaveBeenCalledWith("process_whatsapp_lead_inbound", {
      inbound_phone: "2348000000000", inbound_message: "STOP", provider_received_at: new Date(1793088000 * 1000).toISOString(),
    });
    expect(upsert).toHaveBeenCalledTimes(1);
  });

  it("keeps inbound work unfinished if consent processing fails", async () => {
    const rpc = vi.fn(async () => ({ error: { message: "write failed" } }));
    await expect(processInboundLeadWhatsApp({ rpc } as unknown as SupabaseClient, { from: "2348000000000", text: "STOP" })).rejects.toThrow("write failed");
  });
});