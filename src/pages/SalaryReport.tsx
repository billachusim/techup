import { useQuery } from "@tanstack/react-query";
import { Link } from "@/lib/router-compat";
import { Download } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { AUTHOR_URL, BLOG_AUTHOR, authorSchema } from "@/data/author";
import {
  CHART_ROLES,
  EMPLOYER_RANGES,
  MINIMUM_WAGE_NGN,
  PAYLAB_IT_CATEGORY,
  PAYLAB_ROLES,
  REPORT,
  SALARY_REPORT_CSV,
  SALARY_REPORT_PATH,
  SOURCES,
  formatNaira,
  roleByName,
  shortNaira,
} from "@/data/salaryReport";
import { LOGO_URL, SITE_URL } from "@/lib/seo";
import { getSupabase } from "@/integrations/supabase/lazy";
import { advertisedPay, type SalaryRow } from "@/lib/salaryStats";

const pageUrl = `${SITE_URL}${SALARY_REPORT_PATH}`;
const csvUrl = `${SITE_URL}${SALARY_REPORT_CSV}`;
const sources = Object.values(SOURCES);
const sourceNumber = (id: string) => sources.findIndex((s) => s.id === id) + 1;

/** Superscript link to a numbered entry in the Sources list. */
const Cite = ({ id }: { id: string }) => (
  <sup>
    <a href={`#source-${id}`} className="text-link hover:underline">
      [{sourceNumber(id)}]
    </a>
  </sup>
);

const chartRows = CHART_ROLES.map(roleByName).filter(
  (r): r is NonNullable<typeof r> => Boolean(r),
);
const chartMax = 3_200_000;
const pct = (n: number) => `${(n / chartMax) * 100}%`;

const topRoles = [...PAYLAB_ROLES].sort((a, b) => b.p90 - a.p90).slice(0, 5);
const lowRoles = [...PAYLAB_ROLES].sort((a, b) => a.p90 - b.p90).slice(0, 3);
const wageMultiple = (PAYLAB_IT_CATEGORY.average / MINIMUM_WAGE_NGN).toFixed(1);
const p10Multiple = (PAYLAB_IT_CATEGORY.p10 / MINIMUM_WAGE_NGN).toFixed(1);
const backend = roleByName("Backend developer")!;
const backendEmployer = EMPLOYER_RANGES.find(
  (e) => e.compareTo === "Backend developer",
)!;

const citation = `Tech Faculty NG (${REPORT.published.slice(0, 4)}). ${REPORT.title}. ${pageUrl}`;

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": `${pageUrl}#article`,
      headline: REPORT.title,
      description:
        "Gross monthly pay ranges for 65 tech roles in Nigeria, compared with the national minimum wage and with ranges employers give for senior hires.",
      url: pageUrl,
      datePublished: REPORT.published,
      dateModified: REPORT.modified,
      author: {
        "@id": authorSchema["@id"],
        "@type": "Person",
        name: BLOG_AUTHOR.name,
        url: AUTHOR_URL,
      },
      publisher: {
        "@type": "Organization",
        name: "Tech Faculty NG",
        url: SITE_URL,
        logo: { "@type": "ImageObject", url: LOGO_URL },
      },
      mainEntityOfPage: pageUrl,
      inLanguage: "en-NG",
      about: { "@id": `${pageUrl}#dataset` },
      citation: sources.map((s) => ({
        "@type": "CreativeWork",
        name: s.name,
        publisher: s.publisher,
        url: s.url,
      })),
    },
    {
      "@type": "Dataset",
      "@id": `${pageUrl}#dataset`,
      name: "Nigerian tech salary ranges by role, 2026",
      description:
        "10th and 90th percentile gross monthly salaries in naira for 65 information technology roles in Nigeria, compiled by Tech Faculty NG from Paylab's published salary data, with the source URL and retrieval date on every row.",
      url: pageUrl,
      creator: {
        "@type": "Organization",
        name: "Tech Faculty NG",
        url: SITE_URL,
      },
      license: "https://creativecommons.org/licenses/by/4.0/",
      isAccessibleForFree: true,
      keywords: [
        "Nigeria",
        "tech salaries",
        "software engineer salary Nigeria",
        "IT pay",
        "naira",
      ],
      spatialCoverage: { "@type": "Country", name: "Nigeria" },
      temporalCoverage: "2026",
      dateModified: REPORT.modified,
      isBasedOn: [SOURCES.paylabIt.url],
      variableMeasured: [
        "Gross monthly salary, 10th percentile (NGN)",
        "Gross monthly salary, 90th percentile (NGN)",
      ],
      distribution: {
        "@type": "DataDownload",
        encodingFormat: "text/csv",
        contentUrl: csvUrl,
      },
    },
  ],
};

const SectionTitle = ({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) => (
  <h2 id={id} className="text-2xl md:text-3xl font-bold mb-4 scroll-mt-24">
    {children}
  </h2>
);

async function fetchAdvertisedSalaries(): Promise<SalaryRow[]> {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from("jobs")
    .select("salary_min,salary_max,salary_currency,salary_unit")
    .eq("is_expired", false)
    .not("salary_currency", "is", null)
    .limit(1000);
  if (error) throw error;
  return (data ?? []) as SalaryRow[];
}

// Live medians from the open roles on our own jobs board; hidden until there are enough ads to mean something.
const AdvertisedPay = () => {
  const { data } = useQuery({
    queryKey: ["advertised-salaries"],
    queryFn: fetchAdvertisedSalaries,
    staleTime: 10 * 60 * 1000,
  });
  if (!data) return null;
  const pay = advertisedPay(data);
  if (pay.ngnMonthly.median === null && pay.usdHourly.median === null)
    return null;
  return (
    <section className="mt-12">
      <SectionTitle id="advertised">
        What open roles on our jobs board advertise
      </SectionTitle>
      <div className="grid gap-4 sm:grid-cols-2">
        {pay.ngnMonthly.median !== null && (
          <div className="rounded-lg border border-border p-5">
            <div className="text-3xl font-bold">
              {formatNaira(pay.ngnMonthly.median)}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Median advertised monthly pay across {pay.ngnMonthly.count} open
              roles paid in naira
            </p>
          </div>
        )}
        {pay.usdHourly.median !== null && (
          <div className="rounded-lg border border-border p-5">
            <div className="text-3xl font-bold">
              ${pay.usdHourly.median.toFixed(0)}/hour
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Median advertised rate across {pay.usdHourly.count} open remote
              roles paid in US dollars by the hour
            </p>
          </div>
        )}
      </div>
      <p className="text-sm text-muted-foreground mt-3">
        Counted live from the open listings on our{" "}
        <Link to="/careers" className="text-link hover:underline">
          careers page
        </Link>{" "}
        that state a salary. The midpoint of each advertised range is used, and
        yearly naira figures are divided by 12. Most ads do not state pay, so
        this is a small, changing sample, not a survey.
      </p>
    </section>
  );
};

const SalaryReport = () => (
  <div className="min-h-screen bg-background">
    <script type="application/ld+json">{JSON.stringify(schema)}</script>
    <Header />
    <main className="pt-20">
      <article className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <p className="text-sm text-muted-foreground mb-2">
            Tech Faculty NG research
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {REPORT.title}
          </h1>
          <p className="text-muted-foreground mb-8">
            By{" "}
            <Link
              to="/team/bill-achusim"
              className="text-link hover:underline"
            >
              {BLOG_AUTHOR.name}
            </Link>{" "}
            · Published{" "}
            <time dateTime={REPORT.published}>{REPORT.retrieved}</time> ·
            Figures retrieved {REPORT.retrieved}
          </p>

          <p className="text-lg leading-relaxed mb-8">
            Most salary figures shared about Nigerian tech jobs have no source.
            This report puts the published numbers in one place, with a link for
            every figure, so students, employers and journalists can check them.
            All pay is gross per month, in naira, for roles based in Nigeria.
          </p>

          <section aria-labelledby="key-findings" className="mb-12">
            <SectionTitle id="key-findings">Key findings</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-3 mb-6">
              <div className="rounded-lg border border-border p-5">
                <div className="text-3xl font-bold">
                  {formatNaira(PAYLAB_IT_CATEGORY.average)}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Average monthly pay in Nigerian IT jobs
                  <Cite id="paylab-it" />
                </p>
              </div>
              <div className="rounded-lg border border-border p-5">
                <div className="text-3xl font-bold">{wageMultiple}×</div>
                <p className="text-sm text-muted-foreground mt-1">
                  The national minimum wage of {formatNaira(MINIMUM_WAGE_NGN)}
                  <Cite id="minimum-wage-2024" />
                </p>
              </div>
              <div className="rounded-lg border border-border p-5">
                <div className="text-3xl font-bold">
                  {shortNaira(PAYLAB_IT_CATEGORY.p10)}–
                  {shortNaira(PAYLAB_IT_CATEGORY.p90)}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  What the middle 80% of IT workers earn a month
                  <Cite id="paylab-it" />
                </p>
              </div>
            </div>
            <ul className="list-disc pl-6 space-y-3 leading-relaxed">
              <li>
                Tech pays well above the wage floor. Only 10% of Nigerian IT
                workers earn less than {formatNaira(PAYLAB_IT_CATEGORY.p10)} a
                month, about {p10Multiple} times the minimum wage, and 10% earn
                more than {formatNaira(PAYLAB_IT_CATEGORY.p90)}.
                <Cite id="paylab-it" />
              </li>
              <li>
                Software Engineer is the best-paid title in the data, with the
                top tenth earning more than{" "}
                {formatNaira(roleByName("Software Engineer")!.p90)} a month. It
                rests on only 28 respondents, so treat it as a signal, not a
                precise figure.
                <Cite id="paylab-swe" />
              </li>
              <li>
                After it come{" "}
                {topRoles
                  .slice(1)
                  .map((r) => r.role)
                  .join(", ")}
                : the top tenth in each earns more than ₦1.1M a month.
                Leadership and architecture pay more than any single coding
                language.
                <Cite id="paylab-it" />
              </li>
              <li>
                Support and web roles pay least. In{" "}
                {lowRoles.map((r) => r.role).join(", ")}, only 10% earn more
                than {shortNaira(lowRoles[0].p90)}–
                {shortNaira(lowRoles[lowRoles.length - 1].p90)} a month.
                <Cite id="paylab-it" />
              </li>
              <li>
                Established startups pay well above the wider market. Founders
                and HR leads told TechCabal that mid to senior back-end
                developers get {shortNaira(backendEmployer.min)}–
                {shortNaira(backendEmployer.max)} a month
                <Cite id="techcabal-2025" />, while 90% of back-end developers
                in the survey data earn less than {shortNaira(backend.p90)}.
                <Cite id="paylab-it" />
              </li>
            </ul>
          </section>

          <section aria-labelledby="by-role" className="mb-12">
            <SectionTitle id="by-role">Monthly pay by role</SectionTitle>
            <figure>
              <figcaption className="text-sm text-muted-foreground mb-4">
                Figure 1. Gross monthly pay in Nigeria, 10th to 90th percentile,
                for 16 common tech roles. The dashed line is the{" "}
                {formatNaira(MINIMUM_WAGE_NGN)} minimum wage. Source: Paylab
                <Cite id="paylab-it" />, retrieved {REPORT.retrieved}.
              </figcaption>
              <div
                className="space-y-2"
                role="img"
                aria-label="Range chart of monthly pay by role; the same figures are in the table below."
              >
                {chartRows.map((r) => (
                  <div
                    key={r.role}
                    className="grid grid-cols-[9rem_1fr] sm:grid-cols-[13rem_1fr] items-center gap-3 text-sm"
                  >
                    <span className="text-right leading-tight" title={r.role}>
                      <span className="block truncate">{r.role}</span>
                      <span className="block text-xs text-muted-foreground sm:hidden">
                        {shortNaira(r.p10)}–{shortNaira(r.p90)}
                      </span>
                    </span>
                    <div className="relative h-6 rounded bg-muted">
                      <div
                        className="absolute inset-y-0 border-l border-dashed border-foreground/60"
                        style={{ left: pct(MINIMUM_WAGE_NGN) }}
                      />
                      <div
                        className="absolute inset-y-1 rounded bg-primary"
                        style={{ left: pct(r.p10), width: pct(r.p90 - r.p10) }}
                      />
                      {/* Labels go after the bar, or before it when the bar runs to the right edge. */}
                      <span
                        className="absolute inset-y-0 hidden sm:flex items-center px-2 text-xs text-muted-foreground whitespace-nowrap"
                        style={
                          r.p90 > chartMax * 0.6
                            ? { right: `calc(100% - ${pct(r.p10)})` }
                            : { left: pct(r.p90) }
                        }
                      >
                        {shortNaira(r.p10)}–{shortNaira(r.p90)}
                      </span>
                    </div>
                  </div>
                ))}
                <div className="grid grid-cols-[9rem_1fr] sm:grid-cols-[13rem_1fr] gap-3 text-xs text-muted-foreground">
                  <span />
                  <div className="relative h-4">
                    {[0, 1_000_000, 2_000_000, 3_000_000].map((tick) => (
                      <span
                        key={tick}
                        className="absolute -translate-x-1/2"
                        style={{ left: pct(tick) }}
                      >
                        {tick ? shortNaira(tick) : "₦0"}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </figure>

            <details className="mt-6 rounded-lg border border-border p-4">
              <summary className="cursor-pointer font-semibold">
                All {PAYLAB_ROLES.length} roles as a table
              </summary>
              <div className="overflow-x-auto mt-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left border-b border-border">
                      <th className="py-2 pr-4">Role</th>
                      <th className="py-2 pr-4 text-right">
                        10% earn less than
                      </th>
                      <th className="py-2 text-right">10% earn more than</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...PAYLAB_ROLES]
                      .sort((a, b) => b.p90 - a.p90)
                      .map((r) => (
                        <tr key={r.role} className="border-b border-border/60">
                          <td className="py-1.5 pr-4">{r.role}</td>
                          <td className="py-1.5 pr-4 text-right tabular-nums">
                            {formatNaira(r.p10)}
                          </td>
                          <td className="py-1.5 text-right tabular-nums">
                            {formatNaira(r.p90)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </details>
            <p className="mt-4">
              <a href={SALARY_REPORT_CSV} download>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" aria-hidden="true" />
                  Download the data (CSV)
                </Button>
              </a>
            </p>
          </section>

          <section aria-labelledby="employers" className="mb-12">
            <SectionTitle id="employers">
              What employers say they pay senior hires
            </SectionTitle>
            <p className="leading-relaxed mb-4">
              In 2025 TechCabal asked an HR professional and two founders,
              including Lendsqr founder Deji Olowe, what mid-level and senior
              tech hires earn.
              <Cite id="techcabal-2025" /> These ranges describe well-funded
              startups and fintechs, not the whole market, and rest on
              interviews rather than a survey. Where the survey data has a
              matching role, its 90th percentile is shown alongside.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-border">
                    <th className="py-2 pr-4">Role</th>
                    <th className="py-2 pr-4">Level</th>
                    <th className="py-2 pr-4 text-right">Employers' range</th>
                    <th className="py-2 text-right">
                      Survey: top 10% earn more than
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {EMPLOYER_RANGES.map((e) => {
                    const match = e.compareTo
                      ? roleByName(e.compareTo)
                      : undefined;
                    return (
                      <tr
                        key={`${e.role}-${e.level}`}
                        className="border-b border-border/60"
                      >
                        <td className="py-1.5 pr-4">{e.role}</td>
                        <td className="py-1.5 pr-4">{e.level}</td>
                        <td className="py-1.5 pr-4 text-right tabular-nums">
                          {shortNaira(e.min)}–{shortNaira(e.max)}
                          {e.role === "Chief Technology Officer" ? "+" : ""}
                        </td>
                        <td className="py-1.5 text-right tabular-nums">
                          {match ? shortNaira(match.p90) : "No match"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <AdvertisedPay />

          <section aria-labelledby="method" className="mt-12 mb-12">
            <SectionTitle id="method">Method and limits</SectionTitle>
            <ul className="list-disc pl-6 space-y-3 leading-relaxed text-muted-foreground">
              <li>
                Role ranges are copied as published by Paylab, which collects
                pay from employees who fill in its salary survey and removes
                extreme and duplicate entries. Figures are gross monthly pay
                including bonuses. We did not adjust them.
              </li>
              <li>
                Paylab does not publish a sample size for most roles. Where it
                does, samples are small: 28 respondents for Software Engineer
                and fewer than 20 for DevOps Engineer. Ranges for small samples
                move a lot when refreshed.
              </li>
              <li>
                Paylab publishes no median per role, so we report the 10th and
                90th percentiles it does publish. Its titles are generic:
                "Software Engineer" and "Backend developer" overlap, and
                respondents choose their own title.
              </li>
              <li>
                The employer ranges come from three people interviewed by one
                publication. They are useful for the top of the market and say
                little about pay outside Lagos and Abuja.
              </li>
              <li>
                We do not convert to US dollars, because the naira rate moves
                too much for a fixed conversion to stay true.
              </li>
            </ul>
          </section>

          <section
            aria-labelledby="cite"
            className="mb-12 rounded-lg border border-border bg-muted/30 p-6"
          >
            <SectionTitle id="cite">Use and cite this report</SectionTitle>
            <p className="leading-relaxed mb-3">
              You are free to quote the figures and reuse the chart and data,
              with credit to Tech Faculty NG and a link to this page (CC BY
              4.0). Please also credit the original source of any figure you
              use.
            </p>
            <p className="text-sm font-mono bg-background rounded p-3 break-words">
              {citation}
            </p>
            <p className="text-sm text-muted-foreground mt-3">
              Journalists: for comment or the underlying files, email{" "}
              <a
                href="mailto:thetechfaculty@gmail.com"
                className="text-link hover:underline"
              >
                thetechfaculty@gmail.com
              </a>
              .
            </p>
          </section>

          <section aria-labelledby="sources" className="mb-12">
            <SectionTitle id="sources">Sources</SectionTitle>
            <ol className="list-decimal pl-6 space-y-3 text-sm">
              {sources.map((s) => (
                <li key={s.id} id={`source-${s.id}`} className="scroll-mt-24">
                  {s.publisher}, "
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-link hover:underline"
                  >
                    {s.name}
                  </a>
                  ". Retrieved {REPORT.retrieved}.{" "}
                  <span className="text-muted-foreground">{s.note}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="rounded-lg border border-border p-6 text-center">
            <h2 className="text-xl font-bold mb-2">
              Training for one of these roles?
            </h2>
            <p className="text-muted-foreground mb-4">
              Tech Faculty NG teaches software engineering, data, cybersecurity,
              product and design, online or at campuses across Nigeria.
            </p>
            <Link to="/departments">
              <Button>See our courses</Button>
            </Link>
          </section>
        </div>
      </article>
    </main>
    <Footer />
  </div>
);

export default SalaryReport;
