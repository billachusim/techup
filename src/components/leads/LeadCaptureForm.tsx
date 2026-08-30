import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { clampLeadField } from "@/lib/leads";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, MessageCircle, CheckCircle2, Loader2, FileDown } from "lucide-react";
import { SUCCESS_KIT } from "@/data/successKit";

export type LeadInterest =
  | "free_checklist"
  | "success_kit"
  | "partner_enquiry"
  | "siwes_placement"
  | "virtual_siwes"
  | "logbook_service";

export type LeadExtraField = {
  id: string;
  label: string;
  placeholder?: string;
  required?: boolean;
};

type Props = {
  interest: LeadInterest;
  /** Page or article the form was submitted from, stored for attribution. */
  source: string;
  submitLabel?: string;
  /** Extra sentence shown above the fields. */
  hint?: string;
  /** Message pre-filled when the student continues on WhatsApp after submitting. */
  whatsappMessage?: string;
  compact?: boolean;
  /** Additional questions saved into the lead's notes field. */
  extraFields?: LeadExtraField[];
};
const UNLOCK_KEY = "tf_checklist_unlocked";



const successCopy: Record<LeadInterest, { title: string; body: string }> = {
  free_checklist: {
    title: "Your free SIWES checklist is ready",
    body: "Download it instantly below — we've also noted your contact in case we need to resend it.",
  },
  success_kit: {
    title: "Kit reserved — we'll confirm shortly",
    body: "Our team replies within one working day with payment details and your download link. Nothing is charged automatically.",
  },
  partner_enquiry: {
    title: "Enquiry received",
    body: "Our partnerships team reviews listing requests within two working days and replies with placement options and rates.",
  },
  siwes_placement: {
    title: "Placement request received",
    body: "A SIWES coordinator will contact you with available tracks, dates and the nearest Tech Faculty centre.",
  },
  virtual_siwes: {
    title: "Virtual IT slot requested",
    body: "A coordinator replies within one working day with your payment details and start date. The ₦45,000 placement fee confirms your slot — nothing is charged automatically, and your acceptance letter follows within 48 hours of payment.",
  },
  logbook_service: {
    title: "Logbook pickup requested",
    body: "We reply within one working day with payment details for the ₦15,000 service and confirm your courier pickup window. Review, signing, stamping and the return delivery are all included.",
  },
};

const LeadCaptureForm = ({
  interest,
  source,
  submitLabel = "Send it to me",
  hint,
  whatsappMessage,
  compact = false,
  extraFields = [],
}: Props) => {
  const [channel, setChannel] = useState<"email" | "whatsapp">("email");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [school, setSchool] = useState("");
  const [extras, setExtras] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "saving" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  
  const [notesValue, setNotesValue] = useState<string | null>(null);
  const [unlocking, setUnlocking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [unlocked, setUnlocked] = useState(() => {
    try {
      return localStorage.getItem(UNLOCK_KEY) === "1";
    } catch {
      return false;
    }
  });

  const valid =
    channel === "email"
      ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.trim())
      : contact.replace(/\D/g, "").length >= 10;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) {
      setError(
        channel === "email"
          ? "Enter a valid email address."
          : "Enter a valid WhatsApp number (at least 10 digits).",
      );
      return;
    }
    const missing = extraFields.find((f) => f.required && !extras[f.id]?.trim());
    if (missing) {
      setError(`Please fill in "${missing.label}".`);
      return;
    }
    setStatus("saving");
    setError(null);
    const notes = extraFields
      .map((f) => (extras[f.id]?.trim() ? `${f.label}: ${extras[f.id].trim()}` : null))
      .filter(Boolean)
      .join(" | ");
    const { error: insertError } = await supabase.from("leads").insert({
      name: clampLeadField(name, "name"),
      channel,
      contact: clampLeadField(contact, "contact") ?? "",
      school: clampLeadField(school, "school"),
      interest,
      source: clampLeadField(source, "source"),
      notes: clampLeadField(notes, "notes"),
    });

    if (insertError) {
      setStatus("idle");
      setError("We couldn't save that. Please try again, or reach us on WhatsApp.");
      return;
    }
    setNotesValue(notes || null);
    setStatus("done");
  };

  const unlockWhatsApp = () => {
    setUnlocking(true);
    try {
      localStorage.setItem(UNLOCK_KEY, "1");
    } catch {
      /* storage may be unavailable */
    }
    // Marker row so you can see who actually opened WhatsApp before downloading.
    void supabase.from("leads").insert({
      name: name.trim() || null,
      channel,
      contact: contact.trim(),
      school: school.trim() || null,
      interest,
      source: `${source}#whatsapp-unlock`,
      notes: [notesValue, "WhatsApp unlock clicked (checklist download unlocked)"]
        .filter(Boolean)
        .join(" | "),
    });
    window.setTimeout(() => {
      setUnlocked(true);
      setUnlocking(false);
    }, 1200);
  };

  const waHref = `https://wa.me/${SUCCESS_KIT.whatsappNumber}?text=${encodeURIComponent(
    whatsappMessage ?? "Hello Tech Faculty, I just submitted the SIWES form on your website.",
  )}`;

  if (status === "done") {
    const copy = successCopy[interest];
    const gated = interest === "free_checklist";
    const checklistWa = `https://wa.me/${SUCCESS_KIT.whatsappNumber}?text=${encodeURIComponent(
      `Hello Tech Faculty, I'd like the free SIWES Placement Checklist.${
        name.trim() ? ` Name: ${name.trim()}.` : ""
      }${school.trim() ? ` School: ${school.trim()}.` : ""}`,
    )}`;

    return (
      <div className="rounded-lg border border-primary/30 bg-primary/5 p-5 space-y-3">
        <div className="flex items-start gap-2">
          <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">
              {gated && !unlocked ? "One quick step to unlock your checklist" : copy.title}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {gated && !unlocked
                ? "Send us the pre-filled WhatsApp message (and save our number) — your download unlocks right after."
                : copy.body}
            </p>
          </div>
        </div>

        {gated ? (
          unlocked ? (
            <Button asChild className="w-full sm:w-auto">
              <a
                href="/downloads/siwes-placement-checklist.pdf"
                download="SIWES-Placement-Checklist-TechFaculty.pdf"
              >
                <FileDown size={16} className="mr-2" />
                Download the checklist (PDF)
              </a>
            </Button>
          ) : (
            <div className="space-y-2">
              <Button asChild className="w-full sm:w-auto" disabled={unlocking}>
                <a href={checklistWa} target="_blank" rel="noopener noreferrer" onClick={unlockWhatsApp}>
                  {unlocking ? (
                    <Loader2 size={16} className="mr-2 animate-spin" />
                  ) : (
                    <MessageCircle size={16} className="mr-2" />
                  )}
                  {unlocking ? "Unlocking your download…" : "Message us on WhatsApp to unlock"}
                </a>
              </Button>
              <p className="text-xs text-muted-foreground">
                Save our number so you get replies:{" "}
                <span className="font-medium text-foreground">+{SUCCESS_KIT.whatsappNumber}</span>{" "}
                <button
                  type="button"
                  className="underline underline-offset-2 hover:text-foreground"
                  onClick={() => {
                    void navigator.clipboard?.writeText(`+${SUCCESS_KIT.whatsappNumber}`);
                    setCopied(true);
                    window.setTimeout(() => setCopied(false), 1500);
                  }}
                >
                  {copied ? "Copied" : "Copy number"}
                </button>
              </p>
              <p className="text-xs text-muted-foreground">
                WhatsApp didn't open?{" "}
                <button
                  type="button"
                  className="underline underline-offset-2 hover:text-foreground"
                  onClick={unlockWhatsApp}
                >
                  Tap here to continue to your download
                </button>
                .
              </p>
            </div>
          )
        ) : (
          <p className="text-sm text-muted-foreground">
            Sent to <span className="font-medium text-foreground">{contact}</span>
            {channel === "whatsapp" ? " on WhatsApp" : " by email"}.
          </p>
        )}

        {(!gated || unlocked) && (
          <Button variant="outline" size="sm" asChild>
            <a href={waHref} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={14} className="mr-2" />
              Continue on WhatsApp
            </a>
          </Button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {hint && <p className="text-sm text-muted-foreground">{hint}</p>}

      <div
        className="inline-flex rounded-md border border-border p-1 bg-muted/40"
        role="group"
        aria-label="Choose how we contact you"
      >
        {(["email", "whatsapp"] as const).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => {
              setChannel(c);
              setContact("");
              setError(null);
            }}
            aria-pressed={channel === c}
            className={`px-3 py-1.5 text-sm rounded-[4px] flex items-center gap-1.5 transition-colors ${
              channel === c
                ? "bg-background font-medium shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {c === "email" ? <Mail size={14} /> : <MessageCircle size={14} />}
            {c === "email" ? "Email" : "WhatsApp"}
          </button>
        ))}
      </div>

      <div className={compact ? "space-y-3" : "grid gap-3 sm:grid-cols-2"}>
        <div className="space-y-1.5">
          <Label htmlFor={`lead-name-${interest}`}>Your name</Label>
          <Input
            id={`lead-name-${interest}`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Chisom Okeke"
            autoComplete="name"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`lead-contact-${interest}`}>
            {channel === "email" ? "Email address" : "WhatsApp number"}
          </Label>
          <Input
            id={`lead-contact-${interest}`}
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            inputMode={channel === "email" ? "email" : "tel"}
            type={channel === "email" ? "email" : "tel"}
            autoComplete={channel === "email" ? "email" : "tel"}
            placeholder={channel === "email" ? "you@example.com" : "0803 000 0000"}
            required
          />
        </div>
        <div className={`space-y-1.5 ${compact ? "" : "sm:col-span-2"}`}>
          <Label htmlFor={`lead-school-${interest}`}>
            School or institution <span className="text-muted-foreground font-normal">(optional)</span>
          </Label>
          <Input
            id={`lead-school-${interest}`}
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            placeholder="e.g. Nnamdi Azikiwe University"
          />
        </div>
        {extraFields.map((f) => (
          <div key={f.id} className="space-y-1.5">
            <Label htmlFor={`lead-${interest}-${f.id}`}>
              {f.label}
              {!f.required && (
                <span className="text-muted-foreground font-normal"> (optional)</span>
              )}
            </Label>
            <Input
              id={`lead-${interest}-${f.id}`}
              value={extras[f.id] ?? ""}
              onChange={(e) => setExtras((prev) => ({ ...prev, [f.id]: e.target.value }))}
              placeholder={f.placeholder}
            />
          </div>
        ))}
      </div>

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <Button type="submit" className="w-full sm:w-auto" disabled={status === "saving"}>
        {status === "saving" && <Loader2 size={16} className="mr-2 animate-spin" />}
        {submitLabel}
      </Button>

      <p className="text-xs text-muted-foreground">
        We use your details only to send what you asked for and occasional SIWES openings. No spam, unsubscribe anytime.
      </p>
    </form>
  );
};

export default LeadCaptureForm;
