import { useEffect, useState, type ReactNode } from "react";
import QRCode from "qrcode";
import { Check, Copy, ExternalLink, MessageCircle } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { isMobileDevice } from "@/lib/whatsapp";
import { toast } from "@/hooks/use-toast";
import WhatsAppLeadDialog, { hasCapturedLead } from "@/components/leads/WhatsAppLeadDialog";

interface JoinWhatsAppButtonProps extends Omit<ButtonProps, "onClick" | "asChild"> {
  url: string;
  label?: string;
  groupName?: string;
  children?: ReactNode;
  /** Ask for name/number/city before opening the group. Defaults to true. */
  capture?: boolean;
  /** Attribution for the captured lead. */
  captureSource?: string;
  /** What they were viewing, e.g. a department or campus. */
  captureContext?: string;
}

/**
 * WhatsApp group invite links open natively on mobile, but on desktop browsers
 * they frequently land on an error page unless the invite is opened from a
 * logged-in WhatsApp session. On desktop we show a QR code to scan with the
 * phone plus an explicit "open in browser" escape hatch.
 *
 * When `capture` is on (default), first-time visitors get a short lead form so
 * their name, number and city land in the leads table before they join.
 */
const JoinWhatsAppButton = ({
  url,
  label = "Join Our WhatsApp Community",
  groupName = "our WhatsApp community",
  children,
  capture = true,
  captureSource,
  captureContext,
  ...buttonProps
}: JoinWhatsAppButtonProps) => {
  const [open, setOpen] = useState(false);
  const [leadOpen, setLeadOpen] = useState(false);
  const [qr, setQr] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open || qr) return;
    QRCode.toDataURL(url, { width: 512, margin: 1 })
      .then(setQr)
      .catch(() => setQr(null));
  }, [open, qr, url]);

  const proceed = () => {
    if (isMobileDevice()) {
      window.open(url, "_blank", "noopener,noreferrer");
      return;
    }
    setOpen(true);
  };

  const handleClick = () => {
    if (capture && !hasCapturedLead()) {
      setLeadOpen(true);
      return;
    }
    proceed();
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({ title: "Invite link copied", description: "Paste it into WhatsApp on your phone." });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: "Could not copy", description: url, variant: "destructive" });
    }
  };

  return (
    <>
      <Button {...buttonProps} onClick={handleClick}>
        {children ?? (
          <>
            <MessageCircle className="mr-2" size={20} />
            {label}
          </>
        )}
      </Button>

      <WhatsAppLeadDialog
        open={leadOpen}
        onOpenChange={setLeadOpen}
        variant="community"
        source={captureSource ?? `join-whatsapp:${typeof window !== "undefined" ? window.location.pathname : "/"}`}
        groupUrl={url}
        context={captureContext ?? groupName}
        onCaptured={proceed}
      />



      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Join {groupName}</DialogTitle>
            <DialogDescription>
              WhatsApp group invites work best from your phone. Scan this QR code with
              your phone camera to join instantly.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center gap-4">
            {qr ? (
              <img
                src={qr}
                alt="QR code to join the Tech Faculty WhatsApp group"
                className="w-56 h-56 rounded-lg border border-border bg-card p-2"
              />
            ) : (
              <div className="w-56 h-56 rounded-lg border border-border animate-pulse bg-muted" />
            )}

            <div className="w-full space-y-2">
              <Button variant="outline" className="w-full" onClick={copyLink}>
                {copied ? <Check className="mr-2" size={16} /> : <Copy className="mr-2" size={16} />}
                {copied ? "Link copied" : "Copy invite link"}
              </Button>
              <Button variant="secondary" className="w-full" asChild>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2" size={16} />
                  Open in browser instead
                </a>
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Already have WhatsApp Desktop or WhatsApp Web signed in? "Open in browser"
              will take you straight to the group.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default JoinWhatsAppButton;
