// Server-only HR API for the external automation agent. Reached through
// /api/public/hr-api/*. Every request needs x-hr-api-key === HR_API_KEY.
import { z } from "zod";
import {
  HR_EMAIL_DEFAULTS,
  HR_RATE_LIMIT_PER_MINUTE,
  HR_STATUSES,
  fillTemplate,
  isHrEmailKey,
  sameKey,
  toApplicationStatus,
  toMatchStatus,
} from "@/lib/hr-api-rules";

type Admin = (typeof import("@/integrations/supabase/client.server"))["supabaseAdmin"];

const json = (body: unknown, status = 200) => Response.json(body, { status });
const UUID = z.string().uuid();
const StatusBody = z.object({ status: z.enum(HR_STATUSES), note: z.string().max(4000).optional() });
const EmailBody = z.object({
  talent_id: UUID,
  template: z.string(),
  variables: z.record(z.string(), z.union([z.string().max(4000), z.number(), z.null()])).default({}),
  role_id: UUID.optional(),
});
const ManagerBody = z.object({ manager_user_id: UUID });
const NoteBody = z.object({ talent_id: UUID, role_id: UUID.nullable().optional(), text: z.string().trim().min(1).max(8000) });

function paging(url: URL) {
  const limit = Math.min(100, Math.max(1, Number(url.searchParams.get("limit")) || 50));
  const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
  return { limit, page, from: (page - 1) * limit, to: page * limit - 1 };
}

const sinceParam = (url: URL) => {
  const s = url.searchParams.get("since");
  return s && !Number.isNaN(Date.parse(s)) ? new Date(s).toISOString() : null;
};

export async function handleHrApi(request: Request, splat: string): Promise<Response> {
  const key = process.env["HR_API_KEY"] ?? "";
  if (!key || !sameKey(request.headers.get("x-hr-api-key") ?? "", key)) {
    return json({ error: "Unauthorized" }, 401);
  }

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const method = request.method.toUpperCase();
  const path = "/" + splat.replace(/^\/+|\/+$/g, "");
  const endpoint = `${method} ${path}`;

  // Simple rate limit counted from the audit log.
  const { count } = await supabaseAdmin
    .from("hr_api_audit")
    .select("id", { count: "exact", head: true })
    .gte("created_at", new Date(Date.now() - 60_000).toISOString());
  if ((count ?? 0) >= HR_RATE_LIMIT_PER_MINUTE) {
    await audit(supabaseAdmin, method, path, 429, {});
    return json({ error: "Rate limit exceeded: 60 requests per minute" }, 429);
  }

  let res: { status: number; body: unknown; changes?: Record<string, unknown> };
  try {
    res = await route(supabaseAdmin, request, method, path);
  } catch (e) {
    if (e instanceof z.ZodError) res = { status: 400, body: { error: "Invalid input", issues: e.issues } };
    else {
      console.error("hr-api error", endpoint, (e as Error).message);
      res = { status: 500, body: { error: "Server error" } };
    }
  }
  await audit(supabaseAdmin, method, path, res.status, res.changes ?? {});
  return json(res.body, res.status);
}

async function audit(admin: Admin, method: string, endpoint: string, status: number, changes: Record<string, unknown>) {
  const { error } = await admin.from("hr_api_audit").insert({ method, endpoint, status, changes: changes as never });
  if (error) console.error("hr-api audit failed", error.message);
}

async function route(admin: Admin, request: Request, method: string, path: string) {
  const url = new URL(request.url);
  const parts = path.split("/").filter(Boolean);
  const body = async () => (method === "POST" ? await request.json().catch(() => ({})) : {});

  if (method === "GET" && path === "/roles") return getRoles(admin, url);
  if (method === "GET" && path === "/matches") return listPairs(admin, url, "role_matches");
  if (method === "GET" && path === "/applications") return listPairs(admin, url, "talent_applications");
  if (method === "GET" && parts[0] === "talents" && parts.length === 2) return getTalent(admin, UUID.parse(parts[1]));

  if (method === "POST" && parts.length === 3 && parts[2] === "status" && (parts[0] === "matches" || parts[0] === "applications")) {
    return setStatus(admin, parts[0], UUID.parse(parts[1]), StatusBody.parse(await body()));
  }
  if (method === "POST" && path === "/emails/send") return sendEmail(admin, EmailBody.parse(await body()));
  if (method === "POST" && parts[0] === "roles" && parts[2] === "manager" && parts.length === 3) {
    return setManager(admin, UUID.parse(parts[1]), ManagerBody.parse(await body()));
  }
  if (method === "POST" && path === "/notes") return addNote(admin, NoteBody.parse(await body()));

  return { status: 404, body: { error: "Not found" } };
}

async function getRoles(admin: Admin, url: URL) {
  const { limit, page, from, to } = paging(url);
  const status = url.searchParams.get("status") ?? "open";
  let q = admin
    .from("talent_roles")
    .select("id, slug, title, company, summary, description, project_brief, employment_type, budget_min, budget_max, budget_currency, budget_unit, apply_deadline, openings, auto_match_threshold, manager_user_id, status, applications_closed", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);
  if (status === "open") q = q.eq("status", "published").eq("applications_closed", false);
  else if (status !== "all") q = q.eq("status", status);
  const { data, count, error } = await q;
  if (error) throw new Error(error.message);
  const ids = (data ?? []).map((r) => r.id);
  const { data: filled } = ids.length
    ? await admin.from("role_matches").select("role_id").in("role_id", ids).in("status", ["hired", "onboarded"])
    : { data: [] as { role_id: string }[] };
  const managers = [...new Set((data ?? []).map((r) => r.manager_user_id).filter(Boolean))] as string[];
  const { data: mgr } = managers.length
    ? await admin.from("profiles").select("id, name, email").in("id", managers)
    : { data: [] as { id: string; name: string; email: string }[] };
  return {
    status: 200,
    body: {
      page, limit, total: count ?? 0,
      data: (data ?? []).map((r) => ({
        id: r.id,
        slug: r.slug,
        title: r.title,
        client: { name: r.company, brief: r.project_brief ?? r.summary },
        description: r.description,
        engagement_type: r.employment_type,
        budget: { min: r.budget_min, max: r.budget_max, currency: r.budget_currency, unit: r.budget_unit },
        timeline: { apply_deadline: r.apply_deadline },
        openings: r.openings,
        openings_filled: (filled ?? []).filter((f) => f.role_id === r.id).length,
        threshold: r.auto_match_threshold,
        status: r.applications_closed ? "applications_closed" : r.status,
        manager: r.manager_user_id
          ? { user_id: r.manager_user_id, ...(mgr ?? []).filter((m) => m.id === r.manager_user_id).map((m) => ({ name: m.name, email: m.email }))[0] }
          : null,
      })),
    },
  };
}

async function listPairs(admin: Admin, url: URL, table: "role_matches" | "talent_applications") {
  const { limit, page, from, to } = paging(url);
  const cols = table === "role_matches" ? "id, role_id, talent_profile_id, score, status, source, created_at, updated_at" : "id, role_id, talent_profile_id, status, created_at, updated_at";
  let q = admin.from(table).select(cols, { count: "exact" }).order("created_at", { ascending: false }).range(from, to);
  const roleId = url.searchParams.get("role_id");
  if (roleId) q = q.eq("role_id", UUID.parse(roleId));
  const status = url.searchParams.get("status");
  if (status) q = q.eq("status", status);
  const since = sinceParam(url);
  if (since) q = q.gte("updated_at", since);
  const { data, count, error } = await q;
  if (error) throw new Error(error.message);
  const rows = (data ?? []) as unknown as Array<{ id: string; role_id: string; talent_profile_id: string; score?: number; status: string; source?: string; created_at: string; updated_at: string }>;
  return {
    status: 200,
    body: {
      page, limit, total: count ?? 0,
      data: rows.map((r) => ({
        id: r.id,
        role_id: r.role_id,
        talent_id: r.talent_profile_id,
        score: r.score ?? null,
        status: r.status,
        created_at: r.created_at,
        updated_at: r.updated_at,
        origin: table === "talent_applications" ? "application" : r.source === "manual" ? "manual" : "auto",
      })),
    },
  };
}

async function getTalent(admin: Admin, id: string) {
  const { data: t } = await admin
    .from("talent_profiles")
    .select("id, full_name, email, phone, whatsapp, faculty_id, skills, tools, cv_path, linkedin_url, availability, hours_per_week, rate_amount, rate_currency, slack_user_id, city, country, headline")
    .eq("id", id)
    .maybeSingle();
  if (!t) return { status: 404, body: { error: "Talent not found" } };
  let cv_url: string | null = null;
  if (t.cv_path) {
    const { data } = await admin.storage.from("talent-cvs").createSignedUrl(t.cv_path, 3600);
    cv_url = data?.signedUrl ?? null;
  }
  return {
    status: 200,
    body: {
      id: t.id,
      name: t.full_name,
      email: t.email,
      phone: t.phone,
      whatsapp: t.whatsapp ?? t.phone,
      faculty_id: t.faculty_id,
      headline: t.headline,
      location: [t.city, t.country].filter(Boolean).join(", ") || null,
      skills: t.skills,
      tools: t.tools,
      cv_url,
      cv_url_expires_in_seconds: cv_url ? 3600 : null,
      linkedin_url: t.linkedin_url,
      availability: t.availability,
      hours_per_week: t.hours_per_week,
      expected_rate: t.rate_amount ? { amount: t.rate_amount, currency: t.rate_currency } : null,
      slack_user_id: t.slack_user_id,
    },
  };
}

async function setStatus(admin: Admin, kind: "matches" | "applications", id: string, input: z.infer<typeof StatusBody>) {
  const table = kind === "matches" ? "role_matches" : "talent_applications";
  const { data: row } = await admin.from(table).select("id, status, role_id, talent_profile_id").eq("id", id).maybeSingle();
  if (!row) return { status: 404, body: { error: "Not found" } };
  const stored = kind === "matches" ? toMatchStatus(input.status) : toApplicationStatus(input.status);
  const { error } = await admin.from(table).update({ status: stored }).eq("id", id);
  if (error) throw new Error(error.message);
  if (input.note) {
    await admin.from("talent_notes").insert({ talent_profile_id: row.talent_profile_id, role_id: row.role_id, body: `[${input.status}] ${input.note}`, source: "hr_api" });
  }
  if (kind === "matches" && stored !== row.status) {
    const { afterMatchStageChange } = await import("@/lib/match-slack.server");
    await afterMatchStageChange(id);
  }
  return {
    status: 200,
    body: { id, status: input.status, stored_status: stored },
    changes: { table, id, from: row.status, to: stored, note: input.note ?? null },
  };
}

async function sendEmail(admin: Admin, input: z.infer<typeof EmailBody>) {
  if (!isHrEmailKey(input.template)) {
    return { status: 400, body: { error: `Unknown template. Use one of: ${Object.keys(HR_EMAIL_DEFAULTS).join(", ")}` } };
  }
  const { data: t } = await admin.from("talent_profiles").select("id, full_name, email").eq("id", input.talent_id).maybeSingle();
  if (!t?.email) return { status: 404, body: { error: "Talent not found or has no email" } };
  const { data: override } = await admin.from("hr_email_templates").select("subject, body").eq("key", input.template).maybeSingle();
  const tpl = override ?? HR_EMAIL_DEFAULTS[input.template];
  const vars = { name: t.full_name?.split(" ")[0] ?? "", ...input.variables };
  const subject = fillTemplate(tpl.subject, vars);
  const text = fillTemplate(tpl.body, vars);
  const { sendTemplateEmail } = await import("@/lib/email-templates/send-email");
  const sent = await sendTemplateEmail("hr-message", t.email, {
    templateData: { subject, title: subject, body: text },
    idempotencyKey: `hr-${input.template}-${t.id}-${crypto.randomUUID()}`,
  });
  return {
    status: 200,
    body: { sent: sent.sent, ...(sent.sent ? {} : { reason: sent.reason }) },
    changes: { email: input.template, talent_id: t.id, subject },
  };
}

async function setManager(admin: Admin, roleId: string, input: z.infer<typeof ManagerBody>) {
  const { data: staff } = await admin.rpc("is_staff", { _user_id: input.manager_user_id });
  if (!staff) return { status: 400, body: { error: "manager_user_id must be a staff account" } };
  const { data: role } = await admin.from("talent_roles").select("id, manager_user_id").eq("id", roleId).maybeSingle();
  if (!role) return { status: 404, body: { error: "Role not found" } };
  const { error } = await admin.from("talent_roles").update({ manager_user_id: input.manager_user_id }).eq("id", roleId);
  if (error) throw new Error(error.message);
  return { status: 200, body: { id: roleId, manager_user_id: input.manager_user_id }, changes: { role_id: roleId, from: role.manager_user_id, to: input.manager_user_id } };
}

async function addNote(admin: Admin, input: z.infer<typeof NoteBody>) {
  const { data, error } = await admin
    .from("talent_notes")
    .insert({ talent_profile_id: input.talent_id, role_id: input.role_id ?? null, body: input.text, source: "hr_api" })
    .select("id, created_at")
    .single();
  if (error) return { status: 400, body: { error: "Could not save the note (check talent_id / role_id)" } };
  return { status: 201, body: data, changes: { note_id: data.id, talent_id: input.talent_id, role_id: input.role_id ?? null } };
}
