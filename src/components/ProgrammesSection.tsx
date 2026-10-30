import { useEffect, useRef, type CSSProperties } from "react";
import { Link } from "@/lib/router-compat";
import {
  ArrowUpRight,
  BadgeCheck,
  Brain,
  CalendarCheck,
  Check,
  Clock,
  Cloud,
  Code,
  Cpu,
  Database,
  Globe,
  MapPin,
  MessageCircle,
  Shield,
  Share2,
  Smartphone,
  Sparkles,
  TrendingUp,
  Wallet,
  Wand2,
  Video,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnrolProvider, useEnrol } from "@/components/enrol/EnrolProvider";
import { FeeLine } from "@/components/enrol/FeeLine";
import { useCurrency } from "@/contexts/CurrencyContext";
import { trackEvent } from "@/lib/analytics";
import { getDepartmentBySlug, type Department } from "@/data/departments";
import {
  CUSTOM_PLAN_ID,
  FREE_PLAN_ID,
  paidDepartments,
  planFee,
  quotedDepartments,
} from "@/lib/programmes";

const departmentIcons: Record<string, LucideIcon> = {
  Code,
  Smartphone,
  Database,
  Shield,
  Brain,
  Globe,
  Share2,
  Video,
  Cloud,
  Cpu,
};

const WHATSAPP_QUOTE_URL = (title: string) =>
  `https://wa.me/2348068597140?text=${encodeURIComponent(`Hello Tech Faculty, I'd like the fee for the ${title} programme.`)}`;

const trustPoints = [
  { icon: BadgeCheck, label: "Licensed by FMSTI through NBTI" },
  { icon: CalendarCheck, label: "Start any time" },
  { icon: Wallet, label: "Pay in 2 instalments" },
  { icon: MapPin, label: "Online, hybrid or on campus" },
];

const tint = (color: string, percent: number) =>
  `color-mix(in oklab, ${color} ${percent}%, transparent)`;

const DepartmentCard = ({ dept }: { dept: Department }) => {
  const { open } = useEnrol();
  const Icon = departmentIcons[dept.icon] ?? Code;
  const fee = dept.planId ? planFee(dept.planId) : undefined;

  return (
    <article className="group flex h-full flex-col rounded-[1.75rem] border border-border bg-card p-6 transition-[box-shadow,translate] duration-500 ease-out hover:shadow-2xl hover:shadow-foreground/5 md:hover:-translate-y-1 motion-reduce:hover:translate-y-0">
      <div className="flex items-start justify-between gap-3">
        <span
          className="grid size-12 place-items-center rounded-2xl"
          style={{ backgroundColor: tint(dept.color, 14), color: dept.color }}
        >
          <Icon className="h-6 w-6" />
        </span>
        {dept.trending && (
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
            <TrendingUp className="h-3 w-3" /> Popular
          </span>
        )}
      </div>

      <h3 className="mt-5 text-xl font-semibold tracking-tight">
        <Link
          to={`/departments/${dept.slug}`}
          className="hover:text-link focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {dept.title}
        </Link>
      </h3>
      <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Clock className="h-3.5 w-3.5" /> {dept.duration}
      </p>

      <ul className="mt-4 space-y-2 text-sm">
        {dept.courses.slice(0, 3).map((course) => (
          <li key={course} className="flex items-start gap-2">
            <Check
              className="mt-0.5 h-4 w-4 shrink-0"
              style={{ color: dept.color }}
            />
            <span>{course}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-6">
        <div className="border-t pt-5">
          {fee !== undefined ? (
            <FeeLine fee={fee} />
          ) : (
            <div>
              <p className="text-2xl font-bold tracking-tight">
                Fee on request
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                We confirm the exact amount on WhatsApp
              </p>
            </div>
          )}
        </div>
        <div className="mt-5 flex items-center gap-2">
          {dept.planId ? (
            <Button
              className="h-11 flex-1 rounded-full font-semibold"
              onClick={() => open(dept.planId!)}
              aria-label={`Enrol in ${dept.title}`}
            >
              Enrol
            </Button>
          ) : (
            <Button asChild className="h-11 flex-1 rounded-full font-semibold">
              <a
                href={WHATSAPP_QUOTE_URL(dept.title)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="mr-1.5 h-4 w-4" /> Ask on WhatsApp
              </a>
            </Button>
          )}
          <Button asChild variant="outline" className="h-11 rounded-full">
            <Link
              to={`/departments/${dept.slug}`}
              aria-label={`${dept.title} department details`}
            >
              Details <ArrowUpRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
};

const freeDept = getDepartmentBySlug("basic-internet-ai-studies");

const FreeBootcampCard = () => {
  const { open } = useEnrol();
  const { formatPrice } = useCurrency();
  return (
    <article className="relative isolate flex flex-col gap-6 overflow-hidden rounded-[1.75rem] bg-[hsl(165_35%_7%)] p-6 text-white sm:p-8 md:flex-row md:items-center md:justify-between">
      <div aria-hidden className="fp-grid absolute inset-0 -z-10 opacity-40" />
      <div
        aria-hidden
        className="fp-glow absolute -right-24 -top-24 -z-10 size-72 rounded-full bg-primary/40 blur-3xl"
      />
      <div className="max-w-xl">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium">
          <Sparkles size={14} className="text-primary" /> Not sure yet? Start
          free
        </span>
        <h3 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
          Free Tech Bootcamp
        </h3>
        <p className="mt-2 text-white/70">
          Three weeks of hands-on tech and everyday AI, free at every campus.
          Top performers qualify for up to 50% off any department below.
        </p>
      </div>
      <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center md:flex-col md:items-end">
        <p className="text-3xl font-bold">{formatPrice(0)}</p>
        <div className="flex gap-2">
          <Button
            size="lg"
            onClick={() => open(FREE_PLAN_ID)}
            className="h-12 rounded-full px-6 font-semibold"
          >
            Join free
          </Button>
          {freeDept && (
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="h-12 rounded-full text-white hover:bg-white/10 hover:text-white"
            >
              <Link to={`/departments/${freeDept.slug}`}>Details</Link>
            </Button>
          )}
        </div>
      </div>
    </article>
  );
};

const CustomCard = () => {
  const { open } = useEnrol();
  const { formatPrice } = useCurrency();
  return (
    <article className="flex h-full flex-col justify-between rounded-[1.75rem] border-2 border-dashed border-border p-6">
      <div>
        <span className="grid size-12 place-items-center rounded-2xl bg-muted">
          <Wand2 className="h-6 w-6" />
        </span>
        <h3 className="mt-5 text-xl font-semibold tracking-tight">
          Build your own programme
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Mix courses from any department, like React with Data Visualization.
          Priced per course, from {formatPrice(planFee(CUSTOM_PLAN_ID))}.
        </p>
      </div>
      <Button
        variant="outline"
        className="mt-6 h-11 rounded-full font-semibold"
        onClick={() => open(CUSTOM_PLAN_ID)}
      >
        Pick your courses
      </Button>
    </article>
  );
};

/** Sends one view_pricing event the first time the section scrolls into view. */
function useViewEvent() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          trackEvent("view_pricing", { page_path: window.location.pathname });
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

/**
 * The homepage's one place to compare departments and enrol: what each
 * teaches, how long it takes and its flat fee. Each card links to its
 * department page, which carries the full curriculum for search engines.
 * Answers both /#departments and /#pricing.
 */
const ProgrammesSection = () => {
  const ref = useViewEvent();
  const cards = [...paidDepartments, ...quotedDepartments];

  return (
    <EnrolProvider handleFreeBootcamp>
      <section ref={ref} id="departments" className="scroll-mt-20 px-4 py-24">
        <span id="pricing" className="block scroll-mt-20" aria-hidden />
        <div className="container mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col gap-4 md:mb-12 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Departments &amp; fees
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">
                One clear price.{" "}
                <span className="text-gradient">Every course included.</span>
              </h2>
            </div>
            <p className="max-w-md text-base text-muted-foreground md:text-right">
              Pick a department, choose online, hybrid or on-campus study, and
              start this week. Open any department for its full curriculum,
              tools and career paths.
            </p>
          </div>

          <ul className="mb-8 flex flex-wrap gap-2">
            {trustPoints.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="inline-flex items-center gap-2 rounded-full border border-border px-3.5 py-2 text-sm"
              >
                <Icon size={15} className="text-primary" />
                {label}
              </li>
            ))}
          </ul>

          <div className="fp-reveal mb-5">
            <FreeBootcampCard />
          </div>

          <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {cards.map((dept, i) => (
              <li
                key={dept.slug}
                className="fp-reveal"
                style={{ "--i": i } as CSSProperties}
              >
                <DepartmentCard dept={dept} />
              </li>
            ))}
            <li className="fp-reveal">
              <CustomCard />
            </li>
          </ul>
        </div>
      </section>
    </EnrolProvider>
  );
};

export default ProgrammesSection;
