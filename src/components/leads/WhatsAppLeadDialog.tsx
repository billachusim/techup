import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { clampLeadField } from "@/lib/leads";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, Contact, Copy, Loader2, MessageCircle, Users } from "lucide-react";
import { campuses } from "@/data/campuses";
import { SUCCESS_KIT } from "@/data/successKit";
import { isMobileDevice } from "@/lib/whatsapp";

export const LEAD_CAPTURED_KEY = "tf_wa_lead_captured";

export const hasCapturedLead = () => {
  try {
    return localStorage.getItem(LEAD_CAPTURED_KEY) === "1";
  } catch {
    return false;
  }
};

const rememberLead = () => {
  try {
    localStorage.setItem(LEAD_CAPTURED_KEY, "1");
  } catch {
    /* storage may be unavailable */
  }
};

const TOPICS = [
  "SIWES / Industrial Training",
  "Courses & bootcamps",
  "AI for Everything",
  "Jobs & remote work",
  "Tech store",
  "Something else",
];

export const WHATSAPP_NUMBER = SUCCESS_KIT.whatsappNumber;

const vCard = () =>
  [
    "BEGIN:VCARD",
    "VERSION:3.0",
    "N:Faculty;Tech;;;",
    "FN:Tech Faculty NG",
    "ORG:Tech Faculty NG",
    `TEL;TYPE=CELL:+${WHATSAPP_NUMBER}`,
    "URL:https://techfaculty.ng",
    "END:VCARD",
  ].join("\n");

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** community = gate the group invite. chat = start a 1:1 WhatsApp chat. */
  variant: "community" | "chat";
  /** Page or button the capture came from, stored for attribution. */
  source: string;
  /** Group invite link (community variant). */
  groupUrl?: string;
  /** What they were looking at, e.g. a department or campus. */
  context?: string;
  /** Fired after a successful save — community variant uses it to open the group. */
  onCaptured?: () => void;
};

const WhatsAppLeadDialog = ({
  open,
  onOpenChange,
  variant,
  source,
  groupUrl,
  context,
  onCaptured,
}: Props) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [topic, setTopic] = useState<string>(variant === "chat" ? "" : "");
  const [status, setStatus] = useState<"idle" | "saving" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [saidHi, setSaidHi] = useState(false);

  const cityOptions = useMemo(() => {
    const set = new Set(campuses.map((c) => `${c.city}, ${c.state}`));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, []);

  const digits = phone.replace(/\D/g, "");
  const valid = name.trim().length >= 2 && digits.length >= 10;

  const greeting = encodeURIComponent(
    variant === "chat"
      ? `Hello Tech Faculty, I'm ${name.trim() || "a student"}${
          city ? ` from ${city}` : ""
        }. I need help with: ${topic || "Something else"}.${
          context ? ` (from ${context})` : ""
        }`
      : `Hello Tech Faculty, I'm ${name.trim() || "a student"}${
          city ? ` from ${city}` : ""
        } and I just joined your WhatsApp community.${topic ? ` I'm interested in ${topic}.` : ""}`,
  );
  const waHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${greeting}`;

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) {
      setError(
        name.trim().length < 2
          ? "Please enter your name."
          : "Enter a valid WhatsApp number (at least 10 digits).",
      );
      return;
    }
    setStatus("saving");
    setError(null);
    const notes = [
      topic ? `Interest: ${topic}` : null,
      context ? `Context: ${context}` : null,
      variant === "community" ? "Community join capture" : "Floating WhatsApp chat capture",
    ]
      .filter(Boolean)
      .join(" | ");

    const { error: insertError } = await supabase.from("leads").insert({
      name: clampLeadField(name, "name"),
      channel: "whatsapp",
      contact: clampLeadField(phone, "contact") ?? "",
      school: clampLeadField(city, "school"),
      interest: variant === "community" ? "community_join" : "whatsapp_chat",
      source: clampLeadField(source, "source"),
      notes: clampLeadField(notes, "notes"),
    });

    if (insertError) {
      setStatus("idle");
      setError("We couldn't save that. Please try again, or message us on WhatsApp.");
      return;
    }
    rememberLead();
    setStatus("done");
    if (variant === "community") {
      // On mobile the invite opens natively right away; on desktop we wait for
      // an explicit click so the QR dialog doesn't stack over this one.
      if (isMobileDevice()) onCaptured?.();
    } else {
      window.open(waHref, "_blank", "noopener,noreferrer");
    }
  };

  const markSaidHi = () => {
    setSaidHi(true);
    void supabase.from("leads").insert({
      name: clampLeadField(name, "name"),
      channel: "whatsapp",
      contact: clampLeadField(phone, "contact") ?? "",
      school: clampLeadField(city, "school"),
      interest: variant === "community" ? "community_join" : "whatsapp_chat",
      source: clampLeadField(`${source}#said-hi`, "source"),
      notes: "Said hi on WhatsApp (direct chat opened)",
    });
  };

  const downloadVCard = () => {
    const blob = new Blob([vCard()], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Tech-Faculty-NG.vcf";
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyNumber = () => {
    void navigator.clipboard?.writeText(`+${WHATSAPP_NUMBER}`);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {status === "done"
              ? "You're in — two quick things"
              : variant === "community"
                ? "Join the Tech Faculty community"
                : "Chat with Tech Faculty"}
          </DialogTitle>
          <DialogDescription>
            {status === "done"
              ? "Save our number so our replies reach you, and send us a quick hello."
              : variant === "community"
                ? "Takes 20 seconds. We'll send you SIWES openings, class dates and free AI sessions on WhatsApp."
                : "Tell us who we're speaking with and we'll reply on WhatsApp — usually within an hour."}
          </DialogDescription>
        </DialogHeader>

        {status === "done" ? (
          <div className="space-y-3">
            <Button variant="outline" className="w-full" onClick={downloadVCard}>
              <Contact size={16} className="mr-2" />
              Save our number to your phone
            </Button>
            <div className="text-xs text-muted-foreground flex items-center gap-2">
              <span className="font-medium text-foreground">+{WHATSAPP_NUMBER}</span>
              <button
                type="button"
                className="underline underline-offset-2 hover:text-foreground"
                onClick={copyNumber}
              >
                {copied ? "Copied" : "Copy number"}
              </button>
            </div>
            <Button asChild className="w-full">
              <a href={waHref} target="_blank" rel="noopener noreferrer" onClick={markSaidHi}>
                {saidHi ? <Check size={16} className="mr-2" /> : <MessageCircle size={16} className="mr-2" />}
                {saidHi ? "Message opened — we'll reply shortly" : "Say hi on WhatsApp"}
              </a>
            </Button>
            {variant === "community" && groupUrl && (
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => {
                  onOpenChange(false);
                  onCaptured?.();
                }}
              >
                <Users size={16} className="mr-2" />
                Open the community group
              </Button>
            )}
            <p className="text-xs text-muted-foreground">
              We only use your details to send what you asked for and occasional openings. No spam.
            </p>
          </div>
        ) : (
          <form onSubmit={save} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="wa-lead-name">Your name</Label>
              <Input
                id="wa-lead-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Chisom Okeke"
                autoComplete="name"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="wa-lead-phone">WhatsApp number</Label>
              <Input
                id="wa-lead-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="0803 000 0000"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="wa-lead-city">City / State</Label>
              <Select value={city} onValueChange={setCity}>
                <SelectTrigger id="wa-lead-city">
                  <SelectValue placeholder="Where are you based?" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {cityOptions.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                  <SelectItem value="Online / Elsewhere">Online / Elsewhere</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>{variant === "chat" ? "What do you need?" : "What interests you?"}</Label>
              <div className="flex flex-wrap gap-1.5">
                {TOPICS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTopic(topic === t ? "" : t)}
                    aria-pressed={topic === t}
                    className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
                      topic === t
                        ? "border-primary bg-primary/10 text-foreground font-medium"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={status === "saving"}>
              {status === "saving" && <Loader2 size={16} className="mr-2 animate-spin" />}
              {variant === "community" ? "Join the community on WhatsApp" : "Start the chat on WhatsApp"}
            </Button>

            {variant === "community" && groupUrl && (
              <button
                type="button"
                className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground w-full text-center"
                onClick={() => {
                  onOpenChange(false);
                  onCaptured?.();
                }}
              >
                Already a member? Open the group
              </button>
            )}
            {variant === "chat" && (
              <p className="text-xs text-muted-foreground text-center">
                Mon–Sat, 9am–6pm WAT. Typically replies within an hour.
              </p>
            )}
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default WhatsAppLeadDialog;
