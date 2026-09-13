import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { introRequestUrl } from "@/lib/talent";

type Props = {
  talentId: string;
  talentName: string;
  skills: string[];
  source?: string;
  trigger: React.ReactNode;
  onRequested?: () => void;
};

const RequestIntroDialog = ({ talentId, talentName, skills, source = "talent_pool", trigger, onRequested }: Props) => {
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ name: "", org: "", contact: "", message: "" });

  const firstName = talentName.split(" ")[0];

  const submit = async () => {
    if (form.name.trim().length < 2 || form.contact.trim().length < 5) {
      toast({ title: "Almost there", description: "Add your name and a phone number or email we can reply to.", variant: "destructive" });
      return;
    }
    setSending(true);
    const { error } = await supabase.rpc("request_talent_intro", {
      _profile_id: talentId,
      _requester_name: form.name.trim().slice(0, 120),
      _requester_contact: form.contact.trim().slice(0, 160),
      _requester_org: form.org.trim().slice(0, 160) || null,
      _message: form.message.trim().slice(0, 1000) || null,
      _source: source,
    });
    setSending(false);
    if (error) {
      toast({ title: "Could not send that", description: error.message, variant: "destructive" });
      return;
    }
    toast({
      title: "Request received",
      description: `We will introduce you to ${firstName} on WhatsApp shortly.`,
    });
    onRequested?.();
    setOpen(false);
    setForm({ name: "", org: "", contact: "", message: "" });
    window.open(
      introRequestUrl(talentName, skills),
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request an introduction to {firstName}</DialogTitle>
          <DialogDescription>
            Tell us who you are and we handle the introduction, the assessment and the working agreement on WhatsApp.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label htmlFor="intro-name">Your name</Label>
            <Input id="intro-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={120} />
          </div>
          <div>
            <Label htmlFor="intro-org">Company (optional)</Label>
            <Input id="intro-org" value={form.org} onChange={(e) => setForm({ ...form, org: e.target.value })} maxLength={160} />
          </div>
          <div>
            <Label htmlFor="intro-contact">WhatsApp number or email</Label>
            <Input id="intro-contact" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} maxLength={160} />
          </div>
          <div>
            <Label htmlFor="intro-message">What do you need done? (optional)</Label>
            <Textarea id="intro-message" rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} maxLength={1000} />
          </div>
          <Button className="w-full" onClick={submit} disabled={sending}>
            {sending && <Loader2 size={14} className="mr-1.5 animate-spin" />}
            Send request and open WhatsApp
          </Button>
          <p className="text-xs text-muted-foreground">
            Contact details, emails and CVs of our talent stay private.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RequestIntroDialog;
