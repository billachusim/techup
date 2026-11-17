import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { sendBriefQuote } from "@/lib/brief-quotes.functions";
import type { BusinessBrief } from "@/lib/talent";

const naira = (n: number) => `₦${n.toLocaleString("en-NG")}`;

/**
 * Quote a brief: creates a Flutterwave pay link (create-brief-quote), then emails
 * the quote. Paid briefs show as paid; the webhook marks them automatically.
 */
const BriefQuote = ({
  brief,
  onDone,
}: {
  brief: BusinessBrief;
  onDone: () => void;
}) => {
  const [amount, setAmount] = useState(
    brief.quote_amount ? String(brief.quote_amount) : "",
  );
  const [note, setNote] = useState(brief.quote_note ?? "");
  const [busy, setBusy] = useState(false);

  if (brief.paid_at) {
    return (
      <p className="mt-3 text-sm font-medium text-link">
        Paid {brief.quote_amount ? naira(brief.quote_amount) : ""} on{" "}
        {new Date(brief.paid_at).toLocaleDateString("en-GB")}
      </p>
    );
  }

  const send = async () => {
    const value = Math.round(Number(amount.replace(/[^\d]/g, "")));
    if (!value || value < 1000) {
      toast({
        title: "Enter the price in naira (at least ₦1,000)",
        variant: "destructive",
      });
      return;
    }
    setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "create-brief-quote",
        {
          body: {
            briefId: brief.id,
            amount: value,
            note: note.trim() || undefined,
          },
        },
      );
      if (error || !data?.ok)
        throw new Error(
          data?.error ?? error?.message ?? "Could not create the pay link",
        );
      const sent = await sendBriefQuote({ data: { briefId: brief.id } });
      toast(
        sent.ok
          ? {
              title: `Quote of ${naira(value)} emailed`,
              description: "Follow-ups go out on days 2 and 5 if unpaid.",
            }
          : {
              title: "Pay link created",
              description: `${sent.error}. Link: ${data.payUrl}`,
            },
      );
      onDone();
    } catch (e) {
      toast({
        title: "Could not send the quote",
        description: (e as Error).message,
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-3 space-y-2 rounded-md border border-border p-3">
      {brief.quote_sent_at && (
        <p className="text-xs text-muted-foreground">
          Quoted {brief.quote_amount ? naira(brief.quote_amount) : ""} on{" "}
          {new Date(brief.quote_sent_at).toLocaleDateString("en-GB")} ·
          follow-ups sent: {brief.followup_count} ·{" "}
          {brief.pay_link_url && (
            <a
              href={brief.pay_link_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-link hover:underline"
            >
              pay link
            </a>
          )}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <Input
          className="w-40"
          placeholder="Price in ₦"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Button size="sm" onClick={send} disabled={busy}>
          {busy
            ? "Sending…"
            : brief.quote_sent_at
              ? "Re-send quote"
              : "Send quote with pay link"}
        </Button>
      </div>
      <Textarea
        rows={2}
        placeholder="What the price includes (optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
    </div>
  );
};

export default BriefQuote;
