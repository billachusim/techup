import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, Check, CheckCheck, Clock, Loader2, Paperclip, RefreshCw, Search, Send, X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminNav from "@/components/admin/AdminNav";
import { WhatsAppCampaign } from "@/components/admin/WhatsAppCampaign";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useIsStaff } from "@/hooks/useIsStaff";
import { getSupabase } from "@/integrations/supabase/lazy";
import { cn } from "@/lib/utils";
import { HANDOFF_LABEL, HANDOFF_ORDER, handoffMessage } from "@/lib/whatsapp-handoff";
import { renderStoredBody, shortUrl, splitLinks } from "@/lib/whatsapp-render";
import { AUTO_ANSWER_LABEL, AUTO_ANSWER_RULES } from "@/lib/whatsapp-auto-answers";
import {
  createWhatsAppTemplate, deleteWhatsAppTemplate, getWhatsAppMedia, listWhatsAppTemplates, sendWhatsAppMessage,
} from "@/lib/whatsapp.functions";

type Msg = {
  id: string; direction: string; contact_phone: string; contact_name: string | null; type: string; body: string | null;
  media_id: string | null; media_mime: string | null; status: string; error: any; created_at: string; provider_timestamp: string | null;
};
type AutoReply = {
  contact_phone: string; intent: string; outcome: string; reason: string | null; reply_message_id: string | null;
  resolved_at: string | null; created_at: string;
};
type Template = { name: string; status: string; language: string; category: string; components: any[] };

const DAY = 24 * 3600 * 1000;

function dayLabel(ts: string) {
  const d = new Date(ts); const now = new Date();
  const y = new Date(now); y.setDate(now.getDate() - 1);
  if (d.toDateString() === now.toDateString()) return "Today";
  if (d.toDateString() === y.toDateString()) return "Yesterday";
  return d.toLocaleDateString([], { day: "numeric", month: "short", year: d.getFullYear() === now.getFullYear() ? undefined : "numeric" });
}
function timeLabel(ts: string) {
  const l = dayLabel(ts);
  return l === "Today" ? new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : l;
}

function StatusIcon({ s }: { s: string }) {
  if (s === "read") return <CheckCheck className="h-3.5 w-3.5 text-primary" aria-label="Read" />;
  if (s === "delivered") return <CheckCheck className="h-3.5 w-3.5" aria-label="Delivered" />;
  if (s === "sent") return <Check className="h-3.5 w-3.5" aria-label="Sent" />;
  if (s === "failed") return <X className="h-3.5 w-3.5 text-destructive" aria-label="Failed" />;
  return <Clock className="h-3.5 w-3.5" aria-label="Waiting" />;
}

function Media({ id }: { id: string }) {
  const fetchMedia = useServerFn(getWhatsAppMedia);
  const [state, setState] = useState<{ url?: string; mime?: string; err?: string; loading?: boolean }>({});
  const load = async () => {
    setState({ loading: true });
    const r = await fetchMedia({ data: { mediaId: id } });
    setState(r.ok ? { url: r.dataUrl, mime: r.mime } : { err: r.error });
  };
  if (state.url) {
    return state.mime?.startsWith("image/")
      ? <img src={state.url} alt="Attachment sent on WhatsApp" className="mt-1 max-h-60 rounded" />
      : <a href={state.url} download className="mt-1 block text-sm underline">Download attachment</a>;
  }
  return (
    <Button size="sm" variant="ghost" className="mt-1 h-7 px-2" onClick={load} disabled={state.loading}>
      {state.loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Paperclip className="h-3 w-3" />}
      <span className="ml-1">{state.err ?? "Open attachment"}</span>
    </Button>
  );
}

export default function AdminWhatsApp() {
  const { isStaff, isAdmin, loading: staffLoading } = useIsStaff() as any;
  const { toast } = useToast();
  const send = useServerFn(sendWhatsAppMessage);
  const listTpl = useServerFn(listWhatsAppTemplates);
  const createTpl = useServerFn(createWhatsAppTemplate);
  const deleteTpl = useServerFn(deleteWhatsAppTemplate);

  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [paused, setPaused] = useState<string | null>(null);
  const [autoOn, setAutoOn] = useState<boolean | null>(null);
  const [autoReplies, setAutoReplies] = useState<AutoReply[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [newTo, setNewTo] = useState("");
  const [templates, setTemplates] = useState<Template[]>([]);
  const [tplErr, setTplErr] = useState<string | null>(null);
  const [tplPick, setTplPick] = useState("");
  const [tplParams, setTplParams] = useState<string[]>([]);
  const [form, setForm] = useState({ name: "", category: "UTILITY", body: "", examples: "" });
  const [filter, setFilter] = useState<"waiting" | "open" | "all">("all");
  const [query, setQuery] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    const sb = await getSupabase();
    const [{ data }, { data: st }, { data: auto }] = await Promise.all([
      sb.from("whatsapp_messages").select("*").order("created_at", { ascending: false }).limit(1000),
      sb.from("whatsapp_account_state").select("*").eq("id", 1).maybeSingle(),
      sb.from("whatsapp_auto_replies").select("contact_phone,intent,outcome,reason,reply_message_id,resolved_at,created_at")
        .order("created_at", { ascending: false }).limit(1000),
    ]);
    setMsgs((data ?? []) as Msg[]);
    setPaused(st?.sending_paused ? st.last_event ?? "paused" : null);
    // Missing until the auto-answer migration runs.
    setAutoOn(st && "auto_answer_enabled" in st ? st.auto_answer_enabled !== false : null);
    setAutoReplies((auto ?? []) as AutoReply[]);
  }, []);

  const loadTemplates = useCallback(async () => {
    const r = await listTpl();
    setTemplates(r.templates);
    setTplErr(r.ok ? null : r.error ?? null);
  }, [listTpl]);

  useEffect(() => {
    if (!isStaff) return;
    load();
    loadTemplates();
    let ch: any;
    getSupabase().then((sb) => {
      ch = sb.channel("wa-inbox").on("postgres_changes", { event: "*", schema: "public", table: "whatsapp_messages" }, () => load()).subscribe();
    });
    return () => { ch?.unsubscribe?.(); };
  }, [isStaff, load, loadTemplates]);

  const threads = useMemo(() => {
    const map = new Map<string, { phone: string; name: string | null; last: Msg; lastInbound: number | null; unreadish: number }>();
    for (const m of msgs) {
      const t = map.get(m.contact_phone) ?? { phone: m.contact_phone, name: null, last: m, lastInbound: null, unreadish: 0 };
      if (!t.name && m.contact_name) t.name = m.contact_name;
      if (m.direction === "inbound") {
        const ts = new Date(m.provider_timestamp ?? m.created_at).getTime();
        if (!t.lastInbound || ts > t.lastInbound) t.lastInbound = ts;
      }
      map.set(m.contact_phone, t);
    }
    return [...map.values()];
  }, [msgs]);

  const autoReplyIds = useMemo(() => new Set(autoReplies.map((a) => a.reply_message_id).filter(Boolean)), [autoReplies]);
  /** Latest open handoff per contact: the chats that need a staff reply. */
  const waiting = useMemo(() => {
    const map = new Map<string, AutoReply>();
    for (const a of autoReplies) if (a.outcome === "handed_off" && !a.resolved_at && !map.has(a.contact_phone)) map.set(a.contact_phone, a);
    return map;
  }, [autoReplies]);

  const toggleAuto = async (on: boolean) => {
    const sb = await getSupabase();
    const { error } = await sb.rpc("set_whatsapp_auto_answer", { _enabled: on });
    if (error) toast({ title: "Not changed", description: error.message, variant: "destructive" });
    else setAutoOn(on);
  };

  const thread = useMemo(() => msgs.filter((m) => m.contact_phone === active).reverse(), [msgs, active]);
  const shownThreads = useMemo(() => {
    const q = query.trim().toLowerCase();
    const qd = q.replace(/\D/g, "");
    return threads.filter((t) => {
      if (filter === "waiting" && !waiting.has(t.phone)) return false;
      if (filter === "open" && !(t.lastInbound && Date.now() - t.lastInbound < DAY)) return false;
      if (!q) return true;
      return (t.name ?? "").toLowerCase().includes(q) || (qd.length > 2 && t.phone.includes(qd));
    });
  }, [threads, filter, query, waiting]);
  useEffect(() => { endRef.current?.scrollIntoView({ block: "end" }); }, [active, thread.length]);
  const activeT = threads.find((t) => t.phone === active);
  const windowOpen = !!activeT?.lastInbound && Date.now() - activeT.lastInbound < DAY;
  const approved = templates.filter((t) => t.status === "APPROVED");
  const pickedTpl = approved.find((t) => `${t.name}|${t.language}` === tplPick);
  const pickedVars = pickedTpl?.components?.find((c: any) => c.type === "BODY")?.text?.match(/\{\{\d+\}\}/g)?.length ?? 0;

  const doSend = async (to: string, payload: { text?: string; template?: { name: string; language: string; params: string[] } }) => {
    setSending(true);
    const r = await send({ data: { to, ...payload } });
    setSending(false);
    if (!r.ok) toast({ title: "Not sent", description: r.error, variant: "destructive" });
    else { setDraft(""); setTplParams([]); load(); }
    return r.ok;
  };

  if (staffLoading) return null;
  if (!isStaff) return (<><Header /><main className="container py-16"><h1 className="text-2xl font-bold">WhatsApp inbox</h1><p className="mt-2 text-muted-foreground">Staff only.</p></main><Footer /></>);

  return (
    <>
      <Header />
      <main className="container space-y-6 py-8">
        <AdminNav />
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-2xl font-bold">WhatsApp inbox</h1>
          <div className="flex flex-wrap items-center gap-3">
            {autoOn !== null && (
              <label className="flex items-center gap-2 text-sm">
                <Switch checked={autoOn} disabled={!isAdmin} onCheckedChange={toggleAuto} aria-label="Automatic answers" />
                Auto-answers {autoOn ? "on" : "off"}
              </label>
            )}
            <Button variant="outline" size="sm" onClick={() => { load(); loadTemplates(); }}><RefreshCw className="mr-1 h-4 w-4" /> Refresh</Button>
          </div>
        </div>
        {autoOn !== null && (
          <p className="text-sm text-muted-foreground">
            Questions about prices, campus locations and SIWES are answered automatically. Everything else is marked "Needs reply" for you, and the sender is told someone will reply shortly. Auto-answers stay quiet for {AUTO_ANSWER_RULES.staffActiveHours} hours after you reply in a chat.
          </p>
        )}
        {paused && <p className="rounded border border-destructive p-3 text-sm text-destructive">Sending is paused because WhatsApp reported "{paused}". Reconnect WhatsApp in Connectors.</p>}

        <Tabs defaultValue="inbox">
          <TabsList><TabsTrigger value="inbox">Chats</TabsTrigger><TabsTrigger value="templates">Templates</TabsTrigger>{isAdmin && <TabsTrigger value="campaign">Revamp message</TabsTrigger>}</TabsList>
          {isAdmin && <TabsContent value="campaign"><WhatsAppCampaign /></TabsContent>}

          <TabsContent value="inbox">
            <div className="flex h-[calc(100dvh-12rem)] min-h-[520px] overflow-hidden rounded-lg border bg-card">
              {/* Chat list */}
              <aside className={cn("flex w-full min-w-0 flex-col border-r md:w-[340px] md:shrink-0", active && "hidden md:flex")}>
                <div className="space-y-2 border-b p-3">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input className="pl-8" placeholder="Search name or number" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search chats" />
                  </div>
                  <div className="flex gap-1">
                    {(["waiting", "open", "all"] as const).map((f) => (
                      <Button key={f} size="sm" variant={filter === f ? "default" : "ghost"} className="h-7 rounded-full px-3 text-xs" onClick={() => setFilter(f)}>
                        {f === "waiting" ? `Needs reply (${waiting.size})` : f === "open" ? "Open (24h)" : "All"}
                      </Button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input className="h-8" placeholder="New chat: 0803..." value={newTo} onChange={(e) => setNewTo(e.target.value)} aria-label="Phone number for a new chat" />
                    <Button size="sm" className="h-8" onClick={() => { const d = newTo.replace(/\D/g, ""); const p = d.startsWith("0") && d.length === 11 ? "234" + d.slice(1) : d; if (p.length >= 8) { setActive(p); setNewTo(""); } }}>Open</Button>
                  </div>
                </div>
                <ul className="flex-1 overflow-y-auto">
                  {shownThreads.length === 0 && <li className="p-4 text-sm text-muted-foreground">No chats here.</li>}
                  {shownThreads.map((t) => {
                    const preview = renderStoredBody(t.last.body, templates);
                    return (
                      <li key={t.phone}>
                        <button onClick={() => setActive(t.phone)} className={cn("flex w-full min-w-0 flex-col gap-0.5 border-b px-3 py-2.5 text-left hover:bg-muted/60", active === t.phone && "bg-muted")}>
                          <div className="flex min-w-0 items-center justify-between gap-2">
                            <span className="truncate font-medium">{t.name ?? `+${t.phone}`}</span>
                            <span className="shrink-0 text-[11px] text-muted-foreground">{timeLabel(t.last.provider_timestamp ?? t.last.created_at)}</span>
                          </div>
                          <div className="flex min-w-0 items-center justify-between gap-2">
                            <p className="truncate text-sm text-muted-foreground">{t.last.direction === "outbound" ? "You: " : ""}{preview.text.replace(/\s+/g, " ")}</p>
                            {waiting.has(t.phone) ? <Badge className="shrink-0">Needs reply</Badge> : t.lastInbound && Date.now() - t.lastInbound < DAY ? <Badge variant="secondary" className="shrink-0">Open</Badge> : null}
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </aside>

              {/* Conversation */}
              <section className={cn("min-w-0 flex-1 flex-col", active ? "flex" : "hidden md:flex")}>
                {!active ? <div className="m-auto p-6 text-sm text-muted-foreground">Pick a chat to start replying.</div> : (
                  <>
                    <header className="flex min-w-0 items-center gap-2 border-b px-3 py-2">
                      <Button size="icon" variant="ghost" className="shrink-0 md:hidden" onClick={() => setActive(null)} aria-label="Back to chats"><ArrowLeft className="h-4 w-4" /></Button>
                      <div className="min-w-0">
                        <p className="truncate font-semibold">{activeT?.name ?? `+${active}`}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          +{active} · {windowOpen ? "Handled by staff · reply freely (24h window open)" : "No message in 24h — approved template needed"}
                        </p>
                        {waiting.get(active) && <p className="truncate text-xs font-medium text-primary">Needs you: {waiting.get(active)!.reason ?? AUTO_ANSWER_LABEL.other}</p>}
                      </div>
                    </header>

                    <div className="flex-1 space-y-1.5 overflow-y-auto bg-muted/40 px-3 py-4">
                      {thread.map((m, i) => {
                        const ts = m.provider_timestamp ?? m.created_at;
                        const day = dayLabel(ts);
                        const showDay = i === 0 || dayLabel(thread[i - 1].provider_timestamp ?? thread[i - 1].created_at) !== day;
                        const r = renderStoredBody(m.body, templates);
                        const out = m.direction === "outbound";
                        return (
                          <div key={m.id}>
                            {showDay && <p className="my-3 text-center"><span className="rounded-full bg-card px-3 py-1 text-[11px] text-muted-foreground shadow-sm">{day}</span></p>}
                            <div className={cn("flex", out ? "justify-end" : "justify-start")}>
                              <div className={cn("max-w-[85%] rounded-lg px-3 py-1.5 text-sm shadow-sm sm:max-w-[70%]", out ? "rounded-tr-none bg-primary/15" : "rounded-tl-none bg-card")}>
                                {r.template && <p className="mb-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Template</p>}
                                <p className="whitespace-pre-wrap break-words">
                                  {splitLinks(r.text).map((p, j) => p.type === "link"
                                    ? <a key={j} href={p.value} target="_blank" rel="noreferrer" className="text-link underline break-all">{shortUrl(p.value)}</a>
                                    : <span key={j}>{p.value}</span>)}
                                </p>
                                {m.media_id && <Media id={m.media_id} />}
                                <div className="mt-0.5 flex items-center justify-end gap-1 text-[10px] text-muted-foreground">
                                  {autoReplyIds.has(m.id) && <span className="font-medium">Auto ·</span>}
                                  {new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                  {out && <StatusIcon s={m.status} />}
                                </div>
                                {m.status === "failed" && <p className="text-[11px] text-destructive">{m.error?.message ?? m.error?.[0]?.title ?? "Failed"}</p>}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={endRef} />
                    </div>

                    <footer className="space-y-2 border-t p-2">
                      {windowOpen ? (
                        <>
                          <div className="flex gap-1.5 overflow-x-auto pb-1" aria-label="Quick replies">
                            {HANDOFF_ORDER.map((k) => (
                              <Button key={k} type="button" size="sm" variant="outline" className="h-7 shrink-0 rounded-full px-3 text-xs" onClick={() => setDraft(handoffMessage(k, { name: activeT?.name }))}>{HANDOFF_LABEL[k]}</Button>
                            ))}
                          </div>
                          <form className="flex items-end gap-2" onSubmit={(e) => { e.preventDefault(); if (draft.trim()) doSend(active, { text: draft.trim() }); }}>
                            <Textarea rows={Math.min(6, Math.max(1, draft.split("\n").length))} className="min-h-[40px] resize-none" value={draft} onChange={(e) => setDraft(e.target.value)}
                              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); if (draft.trim() && !sending) doSend(active, { text: draft.trim() }); } }}
                              placeholder="Type a message (Enter to send, Shift+Enter for new line)" aria-label="Reply message" />
                            <Button type="submit" size="icon" className="shrink-0 rounded-full" disabled={sending || !!paused} aria-label="Send reply">{sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}</Button>
                          </form>
                        </>
                      ) : (
                        <div className="space-y-2">
                          {approved.length === 0 ? <p className="text-sm text-muted-foreground">No approved templates yet.</p> : (
                            <>
                              <Select value={tplPick} onValueChange={(v) => { setTplPick(v); setTplParams([]); }}>
                                <SelectTrigger aria-label="Choose a template"><SelectValue placeholder="Choose a template" /></SelectTrigger>
                                <SelectContent>{approved.map((t) => <SelectItem key={t.name + t.language} value={`${t.name}|${t.language}`}>{t.name} ({t.language})</SelectItem>)}</SelectContent>
                              </Select>
                              {pickedTpl && <p className="whitespace-pre-wrap rounded bg-muted p-2 text-sm text-muted-foreground">{pickedTpl.components.find((c: any) => c.type === "BODY")?.text}</p>}
                              <div className="grid gap-2 sm:grid-cols-2">
                                {Array.from({ length: pickedVars }).map((_, i) => (
                                  <Input key={i} placeholder={`Blank {{${i + 1}}}`} value={tplParams[i] ?? ""} onChange={(e) => { const p = [...tplParams]; p[i] = e.target.value; setTplParams(p); }} />
                                ))}
                              </div>
                              <Button disabled={!pickedTpl || sending || !!paused || tplParams.filter(Boolean).length < pickedVars}
                                onClick={() => pickedTpl && doSend(active, { template: { name: pickedTpl.name, language: pickedTpl.language, params: tplParams.slice(0, pickedVars) } })}>
                                Send template
                              </Button>
                            </>
                          )}
                        </div>
                      )}
                    </footer>
                  </>
                )}
              </section>
            </div>
          </TabsContent>

          <TabsContent value="templates" className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader><CardTitle className="text-lg">Your templates</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {tplErr && <p className="text-sm text-destructive">{tplErr}</p>}
                {templates.length === 0 && !tplErr && <p className="text-sm text-muted-foreground">None yet.</p>}
                {templates.map((t) => (
                  <div key={t.name + t.language} className="rounded border p-2 text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium">{t.name} <span className="text-muted-foreground">({t.language}, {t.category.toLowerCase()})</span></span>
                      <Badge variant={t.status === "APPROVED" ? "default" : t.status === "REJECTED" ? "destructive" : "secondary"}>{t.status.toLowerCase()}</Badge>
                    </div>
                    <p className="mt-1 whitespace-pre-wrap text-muted-foreground">{t.components?.find((c: any) => c.type === "BODY")?.text}</p>
                    {isAdmin && <Button variant="ghost" size="sm" className="mt-1 h-7 px-2 text-destructive" onClick={async () => {
                      if (!confirm(`Delete template "${t.name}"?`)) return;
                      const r = await deleteTpl({ data: { name: t.name } });
                      if (!r.ok) toast({ title: "Not deleted", description: r.error, variant: "destructive" }); else loadTemplates();
                    }}>Delete</Button>}
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-lg">New template</CardTitle></CardHeader>
              <CardContent>
                <form className="space-y-2" onSubmit={async (e) => {
                  e.preventDefault();
                  const examples = form.examples.split("|").map((s) => s.trim()).filter(Boolean);
                  const r = await createTpl({ data: { name: form.name, language: "en", category: form.category as any, body: form.body, examples } });
                  if (!r.ok) toast({ title: "Not created", description: r.error, variant: "destructive" });
                  else { toast({ title: "Sent for WhatsApp review", description: "Usually approved within 48 hours." }); setForm({ name: "", category: "UTILITY", body: "", examples: "" }); loadTemplates(); }
                }}>
                  <Input placeholder="Name, e.g. class_reminder" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "_") })} aria-label="Template name" />
                  <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                    <SelectTrigger aria-label="Template type"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="UTILITY">Update (reminders, payments, classes)</SelectItem><SelectItem value="MARKETING">Marketing (promotions — paid)</SelectItem></SelectContent>
                  </Select>
                  <Textarea rows={4} placeholder="Hi {{1}}, your next {{2}} class starts tomorrow. Reply here if you have any questions." value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} aria-label="Template message" />
                  <Input placeholder="Examples for blanks, separated by | e.g. Ada | Data Analytics" value={form.examples} onChange={(e) => setForm({ ...form, examples: e.target.value })} aria-label="Examples for blanks" />
                  <p className="text-xs text-muted-foreground">Use {"{{1}}"}, {"{{2}}"} for blanks. Write a full sentence around them or WhatsApp will reject it.</p>
                  <Button type="submit">Submit for review</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </>
  );
}
