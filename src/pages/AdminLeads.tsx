import { useCallback, useEffect, useMemo, useState } from "react";
import { Inbox, Loader2, Mail, MessageCircle, RefreshCw, Search } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminNav from "@/components/admin/AdminNav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useIsStaff } from "@/hooks/useIsStaff";
import { getSupabase } from "@/integrations/supabase/lazy";
import { Link } from "@/lib/router-compat";
import { cn } from "@/lib/utils";

const STATUSES = ["new", "contacted", "enrolled", "not_interested"] as const;
type LeadStatus = (typeof STATUSES)[number];

const STATUS_LABEL: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  enrolled: "Enrolled",
  not_interested: "Not interested",
};

const INTEREST_LABEL: Record<string, string> = {
  free_checklist: "Free SIWES checklist",
  success_kit: "SIWES Success Kit",
  partner_enquiry: "Partner enquiry",
  siwes_placement: "SIWES placement",
  virtual_siwes: "Virtual SIWES",
  logbook_service: "Logbook service",
  community_join: "Join WhatsApp community",
  whatsapp_chat: "WhatsApp chat",
};

/** The checklist form inserts a second "marker" row when someone opens WhatsApp; it is folded into the original lead. */
const UNLOCK_SUFFIX = "#whatsapp-unlock";

type Lead = {
  id: string;
  name: string | null;
  channel: string;
  contact: string;
  school: string | null;
  interest: string;
  source: string | null;
  notes: string | null;
  status: string;
  created_at: string;
};

const interestLabel = (interest: string) => INTEREST_LABEL[interest] ?? interest.replace(/_/g, " ");

const looksLikePhone = (contact: string) => !contact.includes("@") && contact.replace(/\D/g, "").length >= 10;

/** Nigerian numbers are usually typed as 080...; wa.me needs the international form. */
const whatsappUrl = (lead: Lead) => {
  const digits = lead.contact.replace(/\D/g, "");
  const normalised = digits.startsWith("0") ? `234${digits.slice(1)}` : digits;
  const firstName = lead.name?.trim().split(/\s+/)[0];
  const message =
    `Hello${firstName ? ` ${firstName}` : ""}, this is Tech Faculty NG. ` +
    `Thanks for your enquiry about ${interestLabel(lead.interest)}. How can we help?`;
  return `https://wa.me/${normalised}?text=${encodeURIComponent(message)}`;
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("en-NG", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });

/** Admin inbox for every enquiry saved by the site's lead forms. */
export default function AdminLeads() {
  const { toast } = useToast();
  const { loading: roleLoading, isAdmin } = useIsStaff();
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filter, setFilter] = useState<LeadStatus | "all">("new");
  const [interest, setInterest] = useState("all");
  const [query, setQuery] = useState("");
  const [saving, setSaving] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from("leads")
      .select("id, name, channel, contact, school, interest, source, notes, status, created_at")
      .order("created_at", { ascending: false })
      .limit(1000);
    setLoading(false);
    if (error) {
      toast({ title: "Couldn't load leads", description: error.message, variant: "destructive" });
      return;
    }
    setLeads(data ?? []);
  }, [toast]);

  useEffect(() => {
    if (isAdmin) void load();
  }, [isAdmin, load]);

  // Fold WhatsApp-unlock marker rows into the lead they belong to.
  const { inbox, openedWhatsApp } = useMemo(() => {
    const opened = new Set<string>();
    const rows: Lead[] = [];
    for (const lead of leads) {
      if (lead.source?.endsWith(UNLOCK_SUFFIX)) opened.add(lead.contact.toLowerCase());
      else rows.push(lead);
    }
    return { inbox: rows, openedWhatsApp: opened };
  }, [leads]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: inbox.length };
    for (const s of STATUSES) c[s] = 0;
    for (const lead of inbox) c[lead.status] = (c[lead.status] ?? 0) + 1;
    return c;
  }, [inbox]);

  const interests = useMemo(() => [...new Set(inbox.map((l) => l.interest))].sort(), [inbox]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return inbox.filter(
      (l) =>
        (filter === "all" || l.status === filter) &&
        (interest === "all" || l.interest === interest) &&
        (!q || [l.name, l.contact, l.school, l.notes].some((v) => v?.toLowerCase().includes(q))),
    );
  }, [inbox, filter, interest, query]);

  const setStatus = async (lead: Lead, status: LeadStatus) => {
    if (lead.status === status) return;
    setSaving(lead.id);
    const supabase = await getSupabase();
    const { error } = await supabase
      .from("leads")
      .update({ status, status_updated_at: new Date().toISOString() })
      .eq("id", lead.id);
    setSaving(null);
    if (error) {
      toast({ title: "Couldn't update status", description: error.message, variant: "destructive" });
      return;
    }
    setLeads((prev) => prev.map((l) => (l.id === lead.id ? { ...l, status } : l)));
    toast({ title: `Marked ${STATUS_LABEL[status].toLowerCase()}`, description: lead.name || lead.contact });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 pt-28 pb-16 max-w-5xl space-y-6">
        <AdminNav />
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Leads</h1>
            <p className="text-sm text-muted-foreground">Every enquiry from the site's forms. Follow up, then update its status.</p>
          </div>
          {isAdmin && (
            <Button variant="outline" size="sm" onClick={() => void load()} disabled={loading}>
              <RefreshCw className={cn("h-4 w-4 mr-1.5", loading && "animate-spin")} /> Refresh
            </Button>
          )}
        </div>

        {roleLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : !isAdmin ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">This page is for Tech Faculty admins. Sign in with an admin account.</p>
            <Link to="/login?next=/admin/leads">
              <Button>Sign in</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by status">
              {([...STATUSES, "all"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  role="tab"
                  aria-selected={filter === s}
                  onClick={() => setFilter(s)}
                  className={cn(
                    "rounded-full px-3.5 py-1.5 text-sm transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring",
                    filter === s
                      ? "bg-primary text-primary-foreground font-medium"
                      : "bg-muted text-muted-foreground hover:text-foreground",
                  )}
                >
                  {s === "all" ? "All" : STATUS_LABEL[s]} ({counts[s] ?? 0})
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search name, phone, email, school or notes"
                  className="pl-9"
                  aria-label="Search leads"
                />
              </div>
              <Select value={interest} onValueChange={setInterest}>
                <SelectTrigger className="sm:w-60" aria-label="Filter by interest">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All interests</SelectItem>
                  {interests.map((i) => (
                    <SelectItem key={i} value={i}>
                      {interestLabel(i)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {loading && !leads.length ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : !visible.length ? (
              <Card>
                <CardContent className="flex flex-col items-center gap-2 py-12 text-center text-muted-foreground">
                  <Inbox className="h-8 w-8" />
                  <p className="text-sm">{inbox.length ? "No leads match these filters." : "No enquiries yet."}</p>
                </CardContent>
              </Card>
            ) : (
              <ul className="space-y-3">
                {visible.map((lead) => {
                  const phone = looksLikePhone(lead.contact);
                  return (
                    <li key={lead.id}>
                      <Card>
                        <CardContent className="p-4 space-y-3">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="min-w-0 space-y-1">
                              <p className="font-semibold">{lead.name || "No name given"}</p>
                              <p className="text-sm break-all">
                                {lead.contact}
                                <span className="text-muted-foreground"> · {lead.channel === "whatsapp" ? "WhatsApp" : "Email"}</span>
                              </p>
                              <div className="flex flex-wrap items-center gap-1.5">
                                <Badge variant="secondary">{interestLabel(lead.interest)}</Badge>
                                {openedWhatsApp.has(lead.contact.toLowerCase()) && (
                                  <Badge variant="outline">Opened WhatsApp</Badge>
                                )}
                                <span className="text-xs text-muted-foreground">{formatDate(lead.created_at)}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {phone ? (
                                <Button asChild size="sm" className="bg-[#25D366] text-white hover:bg-[#1ebe5b]">
                                  <a href={whatsappUrl(lead)} target="_blank" rel="noopener noreferrer">
                                    <MessageCircle className="h-4 w-4 mr-1.5" /> WhatsApp
                                  </a>
                                </Button>
                              ) : (
                                <Button asChild size="sm" variant="outline">
                                  <a href={`mailto:${lead.contact}`}>
                                    <Mail className="h-4 w-4 mr-1.5" /> Email
                                  </a>
                                </Button>
                              )}
                              <Select
                                value={lead.status}
                                onValueChange={(v) => void setStatus(lead, v as LeadStatus)}
                                disabled={saving === lead.id}
                              >
                                <SelectTrigger className="w-36" aria-label={`Status for ${lead.name || lead.contact}`}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {STATUSES.map((s) => (
                                    <SelectItem key={s} value={s}>
                                      {STATUS_LABEL[s]}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          {(lead.school || lead.notes || lead.source) && (
                            <dl className="grid gap-1 text-sm text-muted-foreground sm:grid-cols-[auto_1fr] sm:gap-x-3">
                              {lead.school && (
                                <>
                                  <dt className="font-medium text-foreground">School</dt>
                                  <dd>{lead.school}</dd>
                                </>
                              )}
                              {lead.notes && (
                                <>
                                  <dt className="font-medium text-foreground">Notes</dt>
                                  <dd className="break-words">{lead.notes}</dd>
                                </>
                              )}
                              {lead.source && (
                                <>
                                  <dt className="font-medium text-foreground">From</dt>
                                  <dd className="break-all">{lead.source}</dd>
                                </>
                              )}
                            </dl>
                          )}
                        </CardContent>
                      </Card>
                    </li>
                  );
                })}
              </ul>
            )}
            {leads.length >= 1000 && (
              <p className="text-xs text-muted-foreground">Showing the latest 1,000 enquiries.</p>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
