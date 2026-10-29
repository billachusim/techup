import { useEffect, useRef, useState } from "react";
import { CalendarCheck, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import JoinWhatsAppButton from "@/components/JoinWhatsAppButton";
import { FeeLine } from "./FeeLine";
import { useCurrency } from "@/contexts/CurrencyContext";
import { COMMUNITY_WHATSAPP_URL } from "@/lib/whatsapp";
import { FREE_PLAN_ID, feeInstalments, planFee } from "@/lib/programmes";
import { INSTALMENTS } from "../../../supabase/functions/_shared/pricing.ts";
import type { Department } from "@/data/departments";
import { useEnrol } from "./EnrolProvider";

const quoteUrl = (title: string) =>
  `https://wa.me/2348068597140?text=${encodeURIComponent(`Hello Tech Faculty, I'd like the fee for the ${title} programme.`)}`;

/**
 * A department page's fee and Enrol button, so visitors who land here from
 * search can enrol without going back to the homepage. On phones a slim bar
 * keeps the fee and button in reach once the card scrolls away.
 */
export const DepartmentEnrolCard = ({ dept }: { dept: Department }) => {
  const { open } = useEnrol();
  const { formatPrice } = useCurrency();
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardHidden, setCardHidden] = useState(false);

  const planId = dept.planId;
  const fee = planId ? planFee(planId) : undefined;
  const free = planId === FREE_PLAN_ID;
  const split = fee ? feeInstalments(fee) : null;

  useEffect(() => {
    const el = cardRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) =>
      setCardHidden(!entry.isIntersecting && entry.boundingClientRect.top < 0),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const enrolButton = planId ? (
    <Button
      size="lg"
      className="h-12 rounded-full px-7 text-base font-semibold"
      onClick={() => open(planId)}
    >
      {free ? "Join free" : "Enrol now"}
    </Button>
  ) : (
    <Button
      asChild
      size="lg"
      className="h-12 rounded-full px-7 text-base font-semibold"
    >
      <a href={quoteUrl(dept.title)} target="_blank" rel="noopener noreferrer">
        <MessageCircle className="mr-1.5 h-4 w-4" /> Ask for the fee
      </a>
    </Button>
  );

  return (
    <>
      <div
        ref={cardRef}
        className="mb-4 rounded-[1.75rem] border border-border bg-card p-6 shadow-sm"
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          {fee === undefined ? (
            <div>
              <p className="text-3xl font-bold tracking-tight">
                Fee on request
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                We confirm the exact amount on WhatsApp before you pay
              </p>
            </div>
          ) : free ? (
            <div>
              <p className="text-4xl font-bold tracking-tight">Free</p>
              <p className="mt-1 text-sm text-muted-foreground">
                No fee for classes, community or certificate
              </p>
            </div>
          ) : (
            <FeeLine fee={fee} size="lg" />
          )}
          {enrolButton}
        </div>
        <p className="mt-5 flex items-start gap-2 border-t pt-4 text-sm text-muted-foreground">
          <CalendarCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <span>
            Start any time: registration is continuous, so you join the current{" "}
            {dept.title} cohort or learn one-on-one.
            {split &&
              ` Pay in two instalments within ${INSTALMENTS.balanceDueDays} days if you prefer.`}
          </span>
        </p>
        <JoinWhatsAppButton
          url={COMMUNITY_WHATSAPP_URL}
          groupName="the Tech Faculty WhatsApp community"
          captureSource={`department:${dept.slug}`}
          captureContext={dept.title}
          variant="ghost"
          className="mt-2 h-auto px-0 text-sm font-medium text-muted-foreground hover:bg-transparent hover:text-foreground"
        >
          <span className="flex items-center gap-2">
            <MessageCircle size={15} /> Questions first? Join the {dept.title}{" "}
            community
          </span>
        </JoinWhatsAppButton>
      </div>

      <div
        className={`fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 p-3 backdrop-blur transition-transform duration-300 md:hidden ${
          cardHidden ? "translate-y-0" : "translate-y-full"
        }`}
        aria-hidden={!cardHidden}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{dept.title}</p>
            <p className="text-sm text-muted-foreground">
              {fee === undefined
                ? "Fee on request"
                : free
                  ? "Free"
                  : formatPrice(fee)}
            </p>
          </div>
          {planId ? (
            <Button
              className="h-11 rounded-full px-6 font-semibold"
              onClick={() => open(planId)}
              tabIndex={cardHidden ? 0 : -1}
            >
              {free ? "Join free" : "Enrol"}
            </Button>
          ) : (
            <Button asChild className="h-11 rounded-full px-6 font-semibold">
              <a
                href={quoteUrl(dept.title)}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={cardHidden ? 0 : -1}
              >
                Ask
              </a>
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

/** An Enrol button for anywhere further down a department page. */
export const EnrolButton = ({
  planId,
  label,
}: {
  planId: string;
  label: string;
}) => {
  const { open } = useEnrol();
  return (
    <Button className="rounded-full font-semibold" onClick={() => open(planId)}>
      {label}
    </Button>
  );
};
