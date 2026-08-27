import { Link } from "react-router-dom";
import { ArrowRight, FileText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import LeadCaptureForm from "@/components/leads/LeadCaptureForm";
import { SUCCESS_KIT, formatNaira } from "@/data/successKit";

type Props = {
  /** Attribution string, usually the article slug. */
  source: string;
  /**
   * inline  — mid-article nudge to the kit page
   * capture — end-of-article free checklist lead capture
   */
  variant?: "inline" | "capture";
};

const SuccessKitCTA = ({ source, variant = "capture" }: Props) => {
  if (variant === "inline") {
    return (
      <aside className="not-prose my-10 rounded-lg border border-border bg-muted/40 p-5 sm:flex sm:items-center sm:justify-between sm:gap-6">
        <div className="flex items-start gap-3">
          <FileText size={18} className="mt-0.5 text-primary shrink-0" />
          <div>
            <p className="font-semibold leading-snug">
              Doing SIWES this session? Get the free 7-step placement checklist.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Plus the full {SUCCESS_KIT.name} — templates, logbook pack and report outline — from{" "}
              {formatNaira(SUCCESS_KIT.priceNGN)}.
            </p>
          </div>
        </div>
        <div className="mt-4 sm:mt-0 shrink-0">
          <Button size="sm" asChild>
            <Link to="/siwes-success-kit">
              See the kit <ArrowRight size={14} className="ml-1.5" />
            </Link>
          </Button>
        </div>
      </aside>
    );
  }

  return (
    <section
      className="not-prose my-12 rounded-xl border border-border bg-card p-6 md:p-8"
      aria-labelledby={`kit-cta-${source}`}
    >
      <div className="flex items-center gap-2 mb-2">
        <Sparkles size={16} className="text-primary" />
        <span className="text-xs font-semibold uppercase tracking-wide text-primary">
          Free download
        </span>
      </div>
      <h2 id={`kit-cta-${source}`} className="text-xl md:text-2xl font-bold mb-2">
        Get the free SIWES placement checklist
      </h2>
      <p className="text-muted-foreground mb-6 max-w-2xl">
        The 7 steps our placed students follow — from confirming your course is ITF-approved to
        registering your placement before Day 1. Choose email or WhatsApp, whichever you actually check.
      </p>

      <LeadCaptureForm
        interest="free_checklist"
        source={`blog:${source}`}
        submitLabel="Send me the checklist"
        whatsappMessage="Hello Tech Faculty, I requested the free SIWES placement checklist from your blog."
      />

      <div className="mt-6 pt-6 border-t border-border flex flex-wrap items-center gap-3">
        <p className="text-sm text-muted-foreground">
          Want the full templates, logbook pack and report outline?
        </p>
        <Button variant="outline" size="sm" asChild>
          <Link to="/siwes-success-kit">
            View the {SUCCESS_KIT.name} <ArrowRight size={14} className="ml-1.5" />
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default SuccessKitCTA;
