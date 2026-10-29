import { useEffect, useRef, type CSSProperties } from "react";
import { Link } from "@/lib/router-compat";
import { ArrowUpRight, CalendarDays, MapPin, Percent, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import JoinWhatsAppButton from "@/components/JoinWhatsAppButton";
import { AI_FELLOWSHIP_WHATSAPP_URL } from "@/lib/whatsapp";
import { START_FREE_BOOTCAMP_EVENT } from "@/lib/free-bootcamp";
import aiForEverything from "@/assets/ai-for-everything.jpg";
import nnewiTechMeetup from "@/assets/nnewi-tech-meetup.jpg";
import siwesCover from "@/assets/siwes-featured.jpg";
import talentMarketplace from "@/assets/talent-marketplace.jpg";

type Program = {
  title: string;
  badge: string;
  description: string;
  image: string;
  alt: string;
  cta: string;
  href: string;
  external?: boolean;
};

const programs: Program[] = [
  {
    title: "SIWES / Industrial Training",
    badge: "Hot right now",
    description:
      "IT placement for university students at an FMSTI-licensed centre — choose the Learn & Pay track or the Tutor & Earn track, complete real projects, and get your logbook signed.",
    image: siwesCover,
    alt: "SIWES and Industrial Training programme at Tech Faculty",
    cta: "Explore SIWES",
    href: "/siwes",
  },
  {
    title: "AI for Everything",
    badge: "Cohort forming",
    description:
      "Our AI Agents & Data Training Fellowship. Use AI agents to solve real-world tasks, train the models powering intelligent systems and robotics, and earn a certificate on completion.",
    image: aiForEverything,
    alt: "AI for Everything — AI Agents and Data Training Fellowship",
    cta: "Join the AI Fellowship",
    href: AI_FELLOWSHIP_WHATSAPP_URL,
    external: true,
  },
  {
    title: "Nnewi Tech Meetup",
    badge: "Last Saturday monthly",
    description:
      "The monthly gathering of the Nnewi tech community, on the last Saturday of every month — product demos, lightning talks, networking, and collaboration at Tech Faculty HQ.",
    image: nnewiTechMeetup,
    alt: "Nnewi Tech Meetup community event poster",
    cta: "See event details",
    href: "/events#nnewi-tech-meetup",
  },
  {
    title: "Talent & Jobs Marketplace",
    badge: "Now hiring",
    description:
      "Create your talent profile, apply to open roles with one click, and get matched to real projects with Nigerian and African businesses.",
    image: talentMarketplace,
    alt: "Tech Faculty Talent and Jobs Marketplace",
    cta: "Browse open roles",
    href: "/careers",
  },
];

const bootcampFacts = [
  { icon: CalendarDays, label: "3 weeks, hands-on" },
  { icon: MapPin, label: "Free at every campus" },
  { icon: Percent, label: "Up to 50% off a full course" },
];

/**
 * On phones the cards stick on top of each other as you scroll: the next card
 * slides up over the current one, which shrinks and dims behind it. Nothing
 * moves on larger screens or when the visitor prefers reduced motion.
 */
function useStackedCards() {
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const query = window.matchMedia("(max-width: 767px) and (prefers-reduced-motion: no-preference)");
    const items = Array.from(list.children) as HTMLElement[];
    const cardOf = (item: HTMLElement) => item.firstElementChild as HTMLElement | null;
    let frame = 0;

    const update = () => {
      frame = 0;
      items.forEach((item, i) => {
        const card = cardOf(item);
        const next = items[i + 1];
        if (!card) return;
        if (!query.matches || !next) {
          card.style.transform = "";
          card.style.filter = "";
          return;
        }
        const current = item.getBoundingClientRect();
        const covered = (current.bottom - next.getBoundingClientRect().top) / current.height;
        const progress = Math.min(Math.max(covered, 0), 1);
        card.style.transform = progress ? `scale(${1 - progress * 0.06})` : "";
        card.style.filter = progress ? `brightness(${1 - progress * 0.3})` : "";
      });
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    query.addEventListener("change", schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      query.removeEventListener("change", schedule);
    };
  }, []);

  return listRef;
}

/** Each list item sticks a little lower than the one before, so the stack shows its edges. */
const stackItemClass =
  "fp-reveal max-md:motion-safe:sticky max-md:top-[calc(5rem+var(--i)*0.75rem)]";
const cardShellClass =
  "h-full origin-top rounded-[1.75rem] transition-[box-shadow,translate] duration-500 ease-out max-md:min-h-[30rem]";

/** Starts the free Bootcamp Starter enrolment in the pricing section below. */
const startFreeBootcamp = () => window.dispatchEvent(new Event(START_FREE_BOOTCAMP_EVENT));

const BootcampCard = () => (
  <article
    className={`${cardShellClass} relative isolate flex flex-col overflow-hidden bg-[hsl(165_35%_7%)] p-6 text-white shadow-xl shadow-primary/10 sm:p-8 md:min-h-[24rem] lg:p-10`}
  >
    <div aria-hidden className="fp-grid absolute inset-0 -z-10 opacity-40" />
    <div
      aria-hidden
      className="fp-glow absolute -right-24 -top-24 -z-10 size-80 rounded-full bg-primary/40 blur-3xl"
    />
    <div
      aria-hidden
      className="fp-glow fp-glow-slow absolute -bottom-32 -left-16 -z-10 size-72 rounded-full bg-[hsl(190_100%_45%)]/25 blur-3xl"
    />

    <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
      <Sparkles size={14} className="text-primary" />
      Free · Every campus
    </span>

    <h3 className="mt-5 max-w-xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
      Free Tech <span className="text-gradient">Bootcamp</span>
    </h3>
    <p className="mt-3 max-w-xl text-base text-white/70 sm:text-lg">
      Three weeks of hands-on tech training at any Tech Faculty NG campus, at no cost. Top performers
      qualify for up to 50% off any of our department courses.
    </p>

    <ul className="mt-6 flex flex-wrap gap-2">
      {bootcampFacts.map(({ icon: Icon, label }) => (
        <li
          key={label}
          className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] px-3.5 py-2 text-sm text-white/85 ring-1 ring-white/10"
        >
          <Icon size={15} className="text-primary" />
          {label}
        </li>
      ))}
    </ul>

    <div className="mt-auto flex flex-col gap-3 pt-8 sm:flex-row sm:items-center">
      <Button
        size="lg"
        onClick={startFreeBootcamp}
        className="group/cta h-12 rounded-full bg-primary px-6 text-base font-semibold text-primary-foreground hover:bg-primary/90"
      >
        Join the free bootcamp
        <ArrowUpRight className="ml-1 transition-transform duration-300 group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5" />
      </Button>
      <p className="text-sm text-white/55">Create your free account and start today.</p>
    </div>
  </article>
);

const ctaArrow = (
  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-foreground text-background transition-transform duration-300 group-hover:-rotate-45 motion-reduce:transition-none">
    <ArrowUpRight size={18} className="rotate-45" />
  </span>
);

const ProgramCard = ({ program }: { program: Program }) => (
  <article
    className={`${cardShellClass} group flex flex-col border border-border bg-card p-2 hover:shadow-2xl hover:shadow-foreground/5 md:hover:-translate-y-1 motion-reduce:hover:translate-y-0`}
  >
    <div className="relative aspect-[16/10] overflow-hidden rounded-[1.35rem] bg-muted">
      <img
        src={program.image}
        alt={program.alt}
        loading="lazy"
        className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
      />
      <span className="absolute left-3 top-3 rounded-full bg-background/85 px-3 py-1 text-xs font-medium shadow-sm backdrop-blur">
        {program.badge}
      </span>
    </div>
    <div className="flex flex-1 flex-col px-4 pb-4 pt-5">
      <h3 className="text-xl font-semibold tracking-tight">{program.title}</h3>
      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
        {program.description}
      </p>
      <div className="mt-5">
        {program.external ? (
          <JoinWhatsAppButton
            url={program.href}
            groupName={program.title}
            captureSource={`home-featured:${program.title}`}
            captureContext={program.title}
            variant="ghost"
            className="h-auto w-full justify-between rounded-full p-0 text-base font-semibold hover:bg-transparent"
          >
            <span>{program.cta}</span>
            {ctaArrow}
          </JoinWhatsAppButton>
        ) : (
          <Link
            to={program.href}
            className="flex items-center justify-between rounded-full text-base font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
          >
            {program.cta}
            {ctaArrow}
          </Link>
        )}
      </div>
    </div>
  </article>
);

const FeaturedPrograms = () => {
  const listRef = useStackedCards();

  return (
    <section id="featured-programs" className="px-4 py-24">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col gap-4 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Featured programs
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">
              Find your way <span className="text-gradient">into tech</span>
            </h2>
          </div>
          <p className="max-w-md text-base text-muted-foreground md:text-right">
            The programs and events our community is joining right now, open to students,
            professionals and complete beginners.
          </p>
        </div>

        <ul ref={listRef} className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <li className={`${stackItemClass} md:col-span-2`} style={{ "--i": 0 } as CSSProperties}>
            <BootcampCard />
          </li>
          {programs.map((program, i) => (
            <li
              key={program.title}
              className={stackItemClass}
              style={{ "--i": i + 1 } as CSSProperties}
            >
              <ProgramCard program={program} />
            </li>
          ))}
        </ul>
      </div>

    </section>
  );
};

export default FeaturedPrograms;
