import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Briefcase, ChevronRight, GraduationCap, Users } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getSupabase } from "@/integrations/supabase/lazy";
import { shouldOfferWelcome } from "@/lib/welcome-chooser";

const seenKey = (userId: string) => `tf_welcome_seen:${userId}`;

const CHOICES = [
  {
    to: "/dashboard" as const,
    icon: GraduationCap,
    title: "I want to learn tech",
    text: "Start the free bootcamp or pick a course in your student area.",
  },
  {
    to: "/talent/profile" as const,
    icon: Briefcase,
    title: "I'm looking for work",
    text: "Create a talent profile and get matched to paid roles and side hustles.",
  },
  {
    to: "/hire" as const,
    icon: Users,
    title: "I want to hire talent",
    text: "Tell us what you need and we'll match you with people who can do it.",
  },
];

type Props = { userId: string; createdAt: string; firstName: string; hasFacultyId: boolean; path: string };

/** One-time "What brings you here?" for brand-new accounts. Closing it never asks again. */
export default function WelcomeChooser({ userId, createdAt, firstName, hasFacultyId, path }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = localStorage.getItem(seenKey(userId)) === "1";
    } catch {
      /* storage may be unavailable */
    }
    const quick = { accountCreatedAt: createdAt, now: new Date(), path, hasFacultyId, dismissed };
    if (!shouldOfferWelcome({ ...quick, hasTalentProfile: false })) return;
    let cancelled = false;
    (async () => {
      const supabase = await getSupabase();
      const { data } = await supabase.from("talent_profiles").select("id").eq("user_id", userId).limit(1);
      if (cancelled) return;
      if (shouldOfferWelcome({ ...quick, hasTalentProfile: !!data?.length })) setOpen(true);
    })().catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [userId, createdAt, hasFacultyId, path]);

  const close = () => {
    try {
      localStorage.setItem(seenKey(userId), "1");
    } catch {
      /* ignore */
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => (o ? setOpen(true) : close())}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome to Tech Faculty{firstName ? `, ${firstName}` : ""}!</DialogTitle>
          <DialogDescription>What brings you here? Pick one to get started.</DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          {CHOICES.map(({ to, icon: Icon, title, text }) => (
            <Link
              key={to}
              to={to}
              onClick={close}
              className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 text-left transition-colors hover:border-primary hover:bg-muted/50"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon size={20} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-medium text-foreground">{title}</span>
                <span className="block text-sm text-muted-foreground">{text}</span>
              </span>
              <ChevronRight size={18} className="shrink-0 text-muted-foreground" />
            </Link>
          ))}
        </div>
        <Button variant="ghost" className="w-full" onClick={close}>
          Just looking around
        </Button>
      </DialogContent>
    </Dialog>
  );
}
