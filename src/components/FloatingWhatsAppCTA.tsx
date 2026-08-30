import { useEffect, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import WhatsAppLeadDialog from "@/components/leads/WhatsAppLeadDialog";
import { useLocation } from "react-router-dom";

const DISMISS_KEY = "tf_wa_float_dismissed";

/**
 * Site-wide WhatsApp entry point. Opens a short capture form so the first
 * message we receive already contains name, city and intent.
 */
const FloatingWhatsAppCTA = () => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(() => {
    try {
      return sessionStorage.getItem(DISMISS_KEY) === "1";
    } catch {
      return false;
    }
  });
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (hidden || pathname !== "/") return;
    const t = window.setTimeout(() => {
      if (window.scrollY > 400) setPulse(true);
    }, 15000);
    return () => window.clearTimeout(t);
  }, [hidden, pathname]);

  const dismiss = () => {
    setHidden(true);
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* storage may be unavailable */
    }
  };

  if (hidden) return null;

  return (
    <>
      <div className={`fixed right-3 sm:right-4 z-40 flex items-center gap-2 ${pathname === "/" ? "bottom-20 sm:bottom-4" : "bottom-4"}`}>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Hide the WhatsApp chat button"
          className="h-7 w-7 rounded-full bg-background/80 border border-border text-muted-foreground hover:text-foreground flex items-center justify-center shadow-sm"
        >
          <X size={13} />
        </button>
        <button
          type="button"
          onClick={() => {
            setPulse(false);
            setOpen(true);
          }}
          aria-label="Chat with Tech Faculty on WhatsApp"
          className={`flex items-center gap-2 rounded-full bg-[#25D366] text-black font-semibold pl-4 pr-5 py-3 shadow-lg hover:opacity-90 transition-opacity ${
            pulse ? "animate-pulse" : ""
          }`}
        >
          <MessageCircle size={20} />
          <span className="text-sm">Chat with us</span>
        </button>
      </div>

      <WhatsAppLeadDialog
        open={open}
        onOpenChange={setOpen}
        variant="chat"
        source={`floating-whatsapp:${pathname}`}
      />
    </>
  );
};

export default FloatingWhatsAppCTA;
