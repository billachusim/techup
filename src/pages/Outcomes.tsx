import { useQuery } from "@tanstack/react-query";
import { Link } from "@/lib/router-compat";
import { Award, BriefcaseBusiness, GraduationCap, ShieldCheck, Star, TrendingUp, Users } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { OUTCOMES } from "@/data/outcomes";
import { GOOGLE_RATING, GOOGLE_REVIEWS_URL, GOOGLE_WRITE_REVIEW_URL, googleReviews } from "@/data/googleReviews";
import { fetchPublicTalent } from "@/lib/talent";

const headline = [
  { icon: GraduationCap, ...OUTCOMES.studentsTrained },
  { icon: TrendingUp, ...OUTCOMES.employmentRate },
  { icon: Award, ...OUTCOMES.courses },
];

// Live counts from the public Talent Pool, so visitors can check them against the profiles listed there.
const TalentPoolEvidence = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["public-talent-pool"],
    queryFn: fetchPublicTalent,
    staleTime: 5 * 60 * 1000,
  });

  const counts = data && [
    { icon: Users, value: data.length, label: "Graduates and students with a public Talent Pool profile" },
    { icon: ShieldCheck, value: data.filter((p) => p.is_vetted).length, label: "Vetted by our instructors" },
    { icon: BriefcaseBusiness, value: data.filter((p) => p.is_matched).length, label: "Matched to a client role" },
    { icon: TrendingUp, value: data.filter((p) => p.is_working).length, label: "Working on a client engagement now" },
  ];

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      {counts ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {counts.map((c) => (
            <div key={c.label} className="text-center">
              <c.icon className="w-6 h-6 text-primary mx-auto mb-2" aria-hidden="true" />
              <div className="text-3xl font-bold">{c.value.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground mt-1">{c.label}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center">
          {isLoading && !isError ? "Loading live Talent Pool counts…" : "Live counts are unavailable right now. You can browse the profiles directly."}
        </p>
      )}
      <p className="text-xs text-muted-foreground text-center mt-6">
        Counted live from the{" "}
        <Link to="/talent/pool" className="underline hover:text-primary">public Talent Pool</Link>. Only people who chose to
        publish a profile appear there, so these numbers are a floor, not the full picture.
      </p>
    </div>
  );
};

const Outcomes = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Student outcomes at Tech Faculty NG</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The numbers we quote across this site, what each one counts, and the evidence you can check yourself.
              Figures as of {OUTCOMES.asOf}.
            </p>
          </div>
        </section>

        <section className="px-4 pb-16">
          <div className="container mx-auto max-w-4xl space-y-6">
            {headline.map((item) => (
              <article key={item.label} className="rounded-lg border border-border p-6 md:flex md:gap-8">
                <div className="md:w-48 shrink-0 mb-4 md:mb-0">
                  <item.icon className="w-7 h-7 text-primary mb-2" aria-hidden="true" />
                  <div className="text-4xl font-bold">{item.value}</div>
                  <h2 className="text-base font-semibold mt-1">{item.label}</h2>
                </div>
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-2">How we count it</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.method}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-4">Where graduates work</h2>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-8">
              Graduates work at companies in Nigeria and abroad, and many take paid client projects through our Talent
              Pool, where we match them to roles and track the engagement from start to finish.
            </p>
            <TalentPoolEvidence />
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-4">What students say on Google</h2>
            <p className="text-muted-foreground text-center mb-8">
              <Star className="inline w-4 h-4 text-primary fill-primary -mt-1" aria-hidden="true" />{" "}
              {GOOGLE_RATING.rating} from {GOOGLE_RATING.count} reviews on our{" "}
              <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">
                Google Business Profile
              </a>{" "}
              ({GOOGLE_RATING.checked}).
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              {googleReviews.slice(0, 3).map((r) => (
                <blockquote key={r.name} className="rounded-lg border border-border p-5 text-sm">
                  <p className="text-muted-foreground leading-relaxed">“{r.text}”</p>
                  <footer className="mt-3 font-semibold">
                    {r.name}
                    {r.context && <span className="block font-normal text-muted-foreground">{r.context}</span>}
                  </footer>
                </blockquote>
              ))}
            </div>
            <p className="text-sm text-center mt-6">
              Studied with us?{" "}
              <a href={GOOGLE_WRITE_REVIEW_URL} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Leave a Google review
              </a>
              .
            </p>
          </div>
        </section>

        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold text-center mb-8">Other ways to check us</h2>
            <ul className="space-y-4 text-muted-foreground">
              <li>
                <span className="font-semibold text-foreground">Certificates.</span> Every certificate we issue carries an ID
                anyone can look up on our <a href="/verify" className="text-primary hover:underline">certificate verification page</a>.
              </li>
              <li>
                <span className="font-semibold text-foreground">Licence.</span> Tech Faculty NG is licensed by the Federal
                Ministry of Science, Technology and Innovation through the National Board for Technology Incubation (NBTI).
              </li>
              <li>
                <span className="font-semibold text-foreground">People.</span> Our founder,{" "}
                <Link to="/team/bill-achusim" className="text-primary hover:underline">Bill Achusim</Link>, and many of our
                graduates are on{" "}
                <a href="https://www.linkedin.com/company/techfaculty" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  LinkedIn
                </a>
                .
              </li>
            </ul>
            <div className="text-center mt-10">
              <Link to="/departments">
                <Button size="lg">See our courses</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Outcomes;
