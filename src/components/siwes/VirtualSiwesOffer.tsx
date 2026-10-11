import { Link } from "@/lib/router-compat";
import { ArrowRight, Check, Laptop, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VIRTUAL_SIWES, formatNaira } from "@/data/virtualSiwes";

type Props = {
  /** Attribution string, usually the article slug. */
  source: string;
  /**
   * inline — short mid-article nudge
   * full   — end-of-article offer with prices and what's included
   */
  variant?: "inline" | "full";
};

const SIGNUP_PATH = "/virtual-siwes#reserve-virtual-it";

const whatsappHref = (source: string) => {
  const message = `Hello Tech Faculty NG, I read your article (${source}) and I want to do Virtual SIWES (online IT). Please send me the details for the ${formatNaira(
    VIRTUAL_SIWES.placementPriceNGN,
  )} placement.`;
  return `https://wa.me/${VIRTUAL_SIWES.whatsappNumber}?text=${encodeURIComponent(message)}`;
};

const OFFER_POINTS = [
  "Official placement letter addressed to your school within 48 hours of payment",
  "Weekly live sessions and real project work with a mentor from your department",
  "Logbook reviewed, signed and stamped, with courier pickup and return to your city",
  "Completion certificate, recommendation letter and a project portfolio link",
];

const VirtualSiwesOffer = ({ source, variant = "full" }: Props) => {
  if (variant === "inline") {
    return (
      <aside className="not-prose my-10 rounded-lg border border-primary/30 bg-primary/5 p-5 sm:flex sm:items-center sm:justify-between sm:gap-6">
        <div className="flex items-start gap-3">
          <Laptop size={18} className="mt-0.5 text-primary shrink-0" />
          <div>
            <p className="font-semibold leading-snug">
              Can't find a host near you? Do your SIWES online with Tech Faculty
              NG.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Virtual SIWES is {formatNaira(VIRTUAL_SIWES.placementPriceNGN)}{" "}
              for your full IT, from any Nigerian city, with your logbook signed
              and stamped.
            </p>
          </div>
        </div>
        <div className="mt-4 sm:mt-0 shrink-0 flex gap-2">
          <Button size="sm" asChild>
            <a
              href={whatsappHref(source)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={14} className="mr-1.5" /> WhatsApp us
            </a>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link to="/virtual-siwes">How it works</Link>
          </Button>
        </div>
      </aside>
    );
  }

  return (
    <section
      className="not-prose my-12 rounded-xl border-2 border-primary/40 bg-card p-6 md:p-8"
      aria-labelledby={`virtual-siwes-offer-${source}`}
    >
      <div className="flex items-center gap-2 mb-2">
        <Laptop size={16} className="text-primary" />
        <span className="text-xs font-semibold uppercase tracking-wide text-primary">
          Virtual SIWES
        </span>
      </div>
      <h2
        id={`virtual-siwes-offer-${source}`}
        className="text-xl md:text-2xl font-bold mb-2"
      >
        Do your SIWES online, from any city in Nigeria
      </h2>
      <p className="text-muted-foreground mb-5 max-w-2xl">
        No host near you, or your placement fell through? Tech Faculty NG,
        licensed by FMSTI through NBTI, places you online for your full IT and
        documents it exactly like an on-site intern.
      </p>

      <ul className="space-y-2 mb-6">
        {OFFER_POINTS.map((point) => (
          <li key={point} className="flex items-start gap-2 text-sm">
            <Check size={16} className="mt-0.5 text-primary shrink-0" />
            <span>{point}</span>
          </li>
        ))}
      </ul>

      <div className="rounded-lg bg-muted/50 p-4 mb-6 text-sm">
        <p>
          <span className="font-semibold">
            {formatNaira(VIRTUAL_SIWES.placementPriceNGN)}
          </span>{" "}
          for the placement, whether your IT is three or six months.{" "}
          <span className="font-semibold">
            {formatNaira(VIRTUAL_SIWES.logbookPriceNGN)}
          </span>{" "}
          for logbook review, signing, stamping and two-way waybill delivery.
        </p>
        <p className="text-muted-foreground mt-2">
          Near one of our campuses? On-site SIWES has no placement fee. Only
          Virtual SIWES is charged, because it covers the waybill and online
          supervision.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button size="lg" asChild>
          <a
            href={whatsappHref(source)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle size={18} className="mr-2" /> Ask on WhatsApp
          </a>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link to={SIGNUP_PATH}>
            Reserve your slot <ArrowRight size={18} className="ml-2" />
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default VirtualSiwesOffer;
