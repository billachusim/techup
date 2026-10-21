import { useCallback, useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Check, CheckCheck, Clock, Loader2, Paperclip, RefreshCw, Send, X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminNav from "@/components/admin/AdminNav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useIsStaff } from "@/hooks/useIsStaff";
import { getSupabase } from "@/integrations/supabase/lazy";
import { cn } from "@/lib/utils";
import {
  createWhatsAppTemplate, deleteWhatsAppTemplate, getWhatsAppMedia, listWhatsAppTemplates, sendWhatsAppMessage,
} from "@/lib/whatsapp.functions";

type Msg = {
  id: string; direction: string; contact_phone: string; contact_name: string | null; type: string; body: string | null;
  media_id: string | null; media_mime: string | null; status: string; error: any; created_at: string; provider_timestamp: string | null;
};
type Template = { name: string; status: string; language: string; category: string; components: any[] };

const DAY = 24 * 3600 * 1000;

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
  const [active, setActive] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [newTo, setNewTo] = useState("");
  const [templates, setTemplates] = useState<Template[]>([]);
  const [tplErr, setTplErr] = useState<string | null>(null);
  const [tplPick, setTplPick] = useState("");
  const [tplParams, setTplParams] = useState<string[]>([]);
  const [form, setForm] = useState({ name: "", category: "UTILITY", body: "", examples: "" });

  const load = useCallback(async () => {
    const sb = await getSupabase();
    const [{ data }, { data: st }] = await Promise.all([
      sb.from("whatsapp_messages").select("*").order("created_at", { ascending: false }).limit(1000),
      sb.from("whatsapp_account_state").select("sending_paused,last_event").eq("id", 1).maybeSingle(),
    ]);
    setMsgs((data ?? []) as Msg[]);
    setPaused(st?.sending_paused ? st.last_event ?? "paused" : null);
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

  const thread = useMemo(() => msgs.filter((m) => m.contact_phone === active).reverse(), [msgs, active]);
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
          <Button variant="outline" size="sm" onClick={() => { load(); loadTemplates(); }}><RefreshCw className="mr-1 h-4 w-4" /> Refresh</Button>
        </div>
        {paused && <p className="rounded border border-destructive p-3 text-sm text-destructive">Sending is paused because WhatsApp reported "{paused}". Reconnect WhatsApp in Connectors.</p>}

        <Tabs defaultValue="inbox">
          <TabsList><TabsTrigger value="inbox">Chats</TabsTrigger><TabsTrigger value="templates">Templates</TabsTrigger></TabsList>

          <TabsContent value="inbox" className="grid gap-4 md:grid-cols-[280px_1fr]">
            <Card>
              <CardContent className="space-y-2 p-3">
                <div className="flex gap-2">
                  <Input placeholder="New chat: phone e.g. 0803..." value={newTo} onChange={(e) => setNewTo(e.target.value)} aria-label="Phone number for a new chat" />
                  <Button size="sm" onClick={() => { const d = newTo.replace(/\D/g, ""); const p = d.startsWith("0") && d.length === 11 ? "234" + d.slice(1) : d; if (p.length >= 8) { setActive(p); setNewTo(""); } }}>Open</Button>
                </div>
                {threads.length === 0 && <p className="p-2 text-sm text-muted-foreground">No chats yet. Messages people send to your WhatsApp number appear here.</p>}
                <ul className="max-h-[60vh] space-y-1 overflow-y-auto">
                  {threads.map((t) => (
                    <li key={t.phone}>
                      <button onClick={() => setActive(t.phone)} className={cn("w-full rounded p-2 text-left text-sm hover:bg-muted", active === t.phone && "bg-muted")}>
                        <div className="flex justify-between gap-2"><span className="font-medium">{t.name ?? `+${t.phone}`}</span>
                          {t.lastInbound && Date.now() - t.lastInbound < DAY && <Badge variant="secondary">Open</Badge>}</div>
                        <p className="truncate text-muted-foreground">{t.last.direction === "outbound" ? "You: " : ""}{t.last.body}</p>
                      </button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              {!active ? <CardContent className="p-6 text-muted-foreground">Pick a chat.</CardContent> : (
                <>
                  <CardHeader className="pb-2"><CardTitle className="text-lg">{activeT?.name ?? `+${active}`}</CardTitle>
                    <p className="text-xs text-muted-foreground">+{active} · {windowOpen ? "You can reply freely (they messaged in the last 24 hours)." : "They haven't messaged in 24 hours — you must use an approved template."}</p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="max-h-[50vh] space-y-2 overflow-y-auto">
                      {thread.map((m) => (
                        <div key={m.id} className={cn("max-w-[80%] rounded-lg p-2 text-sm", m.direction === "outbound" ? "ml-auto bg-primary/10" : "bg-muted")}>
                          <p className="whitespace-pre-wrap">{m.body}</p>
                          {m.media_id && <Media id={m.media_id} />}
                          <div className="mt-1 flex items-center justify-end gap-1 text-[11px] text-muted-foreground">
                            {new Date(m.provider_timestamp ?? m.created_at).toLocaleString()}
                            {m.direction === "outbound" && <StatusIcon s={m.status} />}
                          </div>
                          {m.status === "failed" && <p className="text-[11px] text-destructive">{m.error?.message ?? m.error?.[0]?.title ?? "Failed"}</p>}
                        </div>
                      ))}
                    </div>
                    {windowOpen ? (
                      <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); if (draft.trim()) doSend(active, { text: draft.trim() }); }}>
                        <Textarea rows={2} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Type a reply" aria-label="Reply message" />
                        <Button type="submit" disabled={sending || !!paused} aria-label="Send reply">{sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}</Button>
                      </form>
                    ) : (
                      <div className="space-y-2 rounded border p-3">
                        {approved.length === 0 ? <p className="text-sm text-muted-foreground">No approved templates yet. Create one in the Templates tab; WhatsApp usually approves within 48 hours.</p> : (
                          <>
                            <Select value={tplPick} onValueChange={(v) => { setTplPick(v); setTplParams([]); }}>
                              <SelectTrigger aria-label="Choose a template"><SelectValue placeholder="Choose a template" /></SelectTrigger>
                              <SelectContent>{approved.map((t) => <SelectItem key={t.name + t.language} value={`${t.name}|${t.language}`}>{t.name} ({t.language})</SelectItem>)}</SelectContent>
                            </Select>
                            {pickedTpl && <p className="text-sm text-muted-foreground whitespace-pre-wrap">{pickedTpl.components.find((c: any) => c.type === "BODY")?.text}</p>}
                            {Array.from({ length: pickedVars }).map((_, i) => (
                              <Input key={i} placeholder={`Blank {{${i + 1}}}`} value={tplParams[i] ?? ""} onChange={(e) => { const p = [...tplParams]; p[i] = e.target.value; setTplParams(p); }} />
                            ))}
                            <Button disabled={!pickedTpl || sending || !!paused || tplParams.filter(Boolean).length < pickedVars}
                              onClick={() => pickedTpl && doSend(active, { template: { name: pickedTpl.name, language: pickedTpl.language, params: tplParams.slice(0, pickedVars) } })}>
                              Send template
                            </Button>
                          </>
                        )}
                      </div>
                    )}
                  </CardContent>
                </>
              )}
            </Card>
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
