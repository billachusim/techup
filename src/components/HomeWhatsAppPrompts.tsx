import { useEffect, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import WhatsAppLeadDialog, { hasCapturedLead } from "@/components/leads/WhatsAppLeadDialog";
import { COMMUNITY_WHATSAPP_URL, isMobileDevice } from "@/lib/whatsapp";

const PROMPT_KEY = "tf_home_prompt_seen";

/**
 * Homepage-only conversion helpers: a sticky mobile WhatsApp bar after the hero,
 * plus a single scroll-depth / exit-intent prompt per visitor.
 */
const HomeWhatsAppPrompts = () => {
  const [sticky, setSticky] = useState(false);
  const [prompt, setPrompt] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [source, setSource] = useState("home-sticky-bar");

  const alreadyLead = hasCapturedLead();

  useEffect(() => {
    const onScroll = () => setSticky(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (alreadyLead) return;
    let seen = false;
    try {
      seen = sessionStorage.getItem(PROMPT_KEY) === "1";
    } catch {
      /* storage may be unavailable */
    }
    if (seen) return;

    const show = () => {
      setPrompt(true);
      try {
        sessionStorage.setItem(PROMPT_KEY, "1");
      } catch {
        /* ignore */
      }
      cleanup();
    };

    const onScroll = () => {
      const depth = (window.scrollY + window.innerHeight) / document.body.scrollHeight;
      if (depth > 0.55) show();
    };
    const onLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) show();
    };
    const cleanup = () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseleave", onLeave);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    if (!isMobileDevice()) document.addEventListener("mouseleave", onLeave);
    return cleanup;
  }, [alreadyLead]);

  const openDialog = (src: string) => {
    setSource(src);
    setPrompt(false);
    if (alreadyLead) {
      window.open(COMMUNITY_WHATSAPP_URL, "_blank", "noopener,noreferrer");
      return;
    }
    setDialogOpen(true);
  };

  return (
    <>
      {/* Sticky mobile bar */}
      <div
        className={`sm:hidden fixed bottom-0 left-0 right-0 z-30 p-3 bg-background/95 backdrop-blur border-t border-border transition-transform ${
          sticky ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <Button
          className="w-full bg-[#25D366] text-black font-semibold hover:opacity-90"
          onClick={() => openDialog("home-sticky-bar")}
        >
          <MessageCircle size={18} className="mr-2" />
          Join our WhatsApp community
        </Button>
      </div>

      {/* One-time scroll / exit prompt */}
      {prompt && (
        <div className="fixed bottom-40 sm:bottom-24 left-3 right-3 sm:left-auto sm:right-6 sm:w-80 z-50 rounded-xl border border-border bg-card shadow-xl p-4">
          <button
            type="button"
            aria-label="Close"
            onClick={() => setPrompt(false)}
            className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
          >
            <X size={16} />
          </button>
          <p className="font-semibold text-sm pr-6">
            Get free SIWES + AI updates on WhatsApp
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Class dates, placement openings and free AI sessions — sent to your WhatsApp. No spam.
          </p>
          <Button
            size="sm"
            className="w-full mt-3 bg-[#25D366] text-black font-semibold hover:opacity-90"
            onClick={() => openDialog("home-scroll-prompt")}
          >
            <MessageCircle size={16} className="mr-2" />
            Join free
          </Button>
        </div>
      )}

      <WhatsAppLeadDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        variant="community"
        source={source}
        groupUrl={COMMUNITY_WHATSAPP_URL}
        context="Homepage"
        onCaptured={() => window.open(COMMUNITY_WHATSAPP_URL, "_blank", "noopener,noreferrer")}
      />
    </>
  );
};

export default HomeWhatsAppPrompts;
