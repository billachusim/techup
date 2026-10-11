import { Link } from "@/lib/router-compat";
import { Award, CreditCard, Globe, Laptop, MessageCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { departments } from "@/data/departments";
import { LOWEST_PAID_PLAN, NGN_TO_USD_RATE, naira, planMinimum, toUsd } from "@/lib/fees";
import { PLAN_PRICING } from "../../supabase/functions/_shared/pricing.ts";

const HIGHEST_PLAN_MINIMUM = Math.max(...Object.values(PLAN_PRICING).map((p) => p.minimumAmount));

const priceRange = `${naira(LOWEST_PAID_PLAN)} to ${naira(HIGHEST_PLAN_MINIMUM)}`;
const usdRange = `$${toUsd(LOWEST_PAID_PLAN)} to $${toUsd(HIGHEST_PLAN_MINIMUM)}`;

// Departments with a checkout plan can be studied fully online. Robotics & IoT
// has none: its lab hardware is shared at the Nigerian campuses.
const onlineDepartments = departments
  .map((d) => ({ d, min: d.planId ? planMinimum(d.planId) : undefined }))
  .filter((x): x is { d: (typeof departments)[number]; min: number } => x.min !== undefined)
  .sort((a, b) => a.min - b.min);

const WHATSAPP_URL =
  "https://wa.me/2348068597140?text=" +
  encodeURIComponent("Hello Tech Faculty NG, I live outside Nigeria and want to study online. Which course should I start with?");

const studyOnlineAfricaFaqs = [
  {
    q: "Can I study with Tech Faculty NG from outside Nigeria?",
    a: "Yes. Every department except Robotics & IoT, whose lab hardware is at our campuses, can be studied fully online, so you can enrol from Ghana, Kenya, South Africa or anywhere else with an internet connection. All our campuses are in Nigeria, and we have no branches in other countries, so students outside Nigeria study online.",
  },
  {
    q: "How much does it cost, and can I pay in dollars?",
    a: `Online courses cost from ${priceRange} depending on the department and the modules you pick. Visitors outside Nigeria see prices in US dollars at checkout, converted at ₦${NGN_TO_USD_RATE.toLocaleString("en-NG")} to $1, which is about ${usdRange}. Card payments go through Flutterwave and are charged in US dollars.`,
  },
  {
    q: "What if my card payment does not go through?",
    a: "Whether a foreign card is accepted depends on the card and the bank that issued it. If it is declined, choose WhatsApp or email enrolment at checkout instead, and we will reply with how to pay.",
  },
  {
    q: "What certificate do I get?",
    a: "Graduates receive a Tech Faculty NG certificate with a unique ID that anyone, including an employer in another country, can check on our certificate verification page. Tech Faculty NG is licensed by the Federal Ministry of Science, Technology and Innovation (FMSTI) through the National Board for Technology Incubation (NBTI), a Nigerian licence.",
  },
  {
    q: "How are online classes delivered?",
    a: "Online study is included in the course fee. You learn from recorded lectures at your own pace, in English, and submit projects online. Hybrid and on-site study cost extra and are only for students who can reach one of our campuses in Nigeria.",
  },
];

const steps = [
  {
    title: "Pick a department",
    body: "Compare the departments below. Each page lists the modules, tools and duration.",
  },
  {
    title: "Build your plan",
    body: "In the pricing section, choose the plan and modules you want and keep the learning mode on Online Only, which adds nothing to the fee.",
  },
  {
    title: "Pay or message us",
    body: "Sign in, then pay by card in US dollars through Flutterwave, or choose WhatsApp or email enrolment and we reply with how to pay.",
  },
  {
    title: "Start learning",
    body: "Once your payment is confirmed, your courses open in your student dashboard.",
  },
];

const StudyOnlineAfrica = () => {
  return (
    <div className="min-h-screen bg-background">
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: studyOnlineAfricaFaqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        })}
      </script>
      <Header />
      <main className="pt-20">
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Study tech online from anywhere in Africa</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Tech Faculty NG is a Nigerian tech school licensed by FMSTI through NBTI. Our campuses are all in Nigeria, and
              every department except Robotics & IoT also runs fully online, so you can learn web development, data, AI, cybersecurity, design
              and more from wherever you live.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/#pricing">
                <Button size="lg">See prices and enrol</Button>
              </Link>
              <Button size="lg" variant="outline" asChild>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 w-5 h-5" aria-hidden="true" />
                  Ask us on WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </section>

        <section className="px-4 pb-16">
          <div className="container mx-auto max-w-4xl grid gap-4 md:grid-cols-2">
            <article className="rounded-lg border border-border p-6">
              <Laptop className="w-7 h-7 text-primary mb-3" aria-hidden="true" />
              <h2 className="text-xl font-semibold mb-2">How online study works</h2>
              <p className="text-muted-foreground leading-relaxed">
                Online study is included in every course fee. You learn from recorded lectures at your own pace, in English,
                and submit your projects online. Hybrid and on-site classes are for students who can reach a campus in
                Nigeria.
              </p>
            </article>
            <article className="rounded-lg border border-border p-6">
              <Award className="w-7 h-7 text-primary mb-3" aria-hidden="true" />
              <h2 className="text-xl font-semibold mb-2">A certificate anyone can check</h2>
              <p className="text-muted-foreground leading-relaxed">
                Graduates receive a Tech Faculty NG certificate with a unique ID. An employer anywhere can look it up on
                our <a href="/verify" className="text-primary hover:underline">certificate verification page</a>. Our licence
                is Nigerian: Tech Faculty NG is licensed by the Federal Ministry of Science, Technology and Innovation
                through the National Board for Technology Incubation.
              </p>
            </article>
            <article className="rounded-lg border border-border p-6">
              <CreditCard className="w-7 h-7 text-primary mb-3" aria-hidden="true" />
              <h2 className="text-xl font-semibold mb-2">Paying from outside Nigeria</h2>
              <p className="text-muted-foreground leading-relaxed">
                Courses cost from {priceRange}. Outside Nigeria, checkout shows prices in US dollars at ₦
                {NGN_TO_USD_RATE.toLocaleString("en-NG")} to $1 (about {usdRange}) and charges your card in dollars through
                Flutterwave. Whether a foreign card goes through depends on your bank. If it is declined, pick WhatsApp or
                email enrolment at checkout and we reply with how to pay.
              </p>
            </article>
            <article className="rounded-lg border border-border p-6">
              <Globe className="w-7 h-7 text-primary mb-3" aria-hidden="true" />
              <h2 className="text-xl font-semibold mb-2">No branches outside Nigeria</h2>
              <p className="text-muted-foreground leading-relaxed">
                All{" "}
                <Link to="/locations" className="text-primary hover:underline">our campuses</Link> are in Nigeria, and we
                have no partner centres in other countries. If you want somewhere to learn in person near you, our{" "}
                <Link to="/blog/top-tech-hubs-in-africa-where-to-learn-tech-2026" className="text-primary hover:underline">
                  guide to Africa&apos;s top tech hubs
                </Link>{" "}
                covers independent hubs in Kenya, Ghana, Rwanda, South Africa, Egypt and more.
              </p>
            </article>
          </div>
        </section>

        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-4">What you can study online</h2>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-8">
              Starting prices for online study, in naira with the approximate dollar amount checkout charges outside
              Nigeria.
            </p>
            <ul className="grid gap-3 md:grid-cols-2">
              {onlineDepartments.map(({ d, min }) => (
                <li key={d.slug} className="rounded-lg border border-border bg-card p-4">
                  <Link to={`/departments/${d.slug}`} className="font-semibold hover:text-primary">
                    {d.title}
                  </Link>
                  <p className="text-sm text-muted-foreground mt-1">
                    {d.duration} ·{" "}
                    {min === 0 ? "Free" : `from ${naira(min)} (about $${toUsd(min)})`}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold text-center mb-8">How to enrol</h2>
            <ol className="space-y-4">
              {steps.map((s, i) => (
                <li key={s.title} className="flex gap-4">
                  <span className="flex-none w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold">{s.title}</h3>
                    <p className="text-muted-foreground">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="text-center mt-10">
              <Link to="/#pricing">
                <Button size="lg">Go to pricing</Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold text-center mb-8">Questions from students outside Nigeria</h2>
            <div className="space-y-6">
              {studyOnlineAfricaFaqs.map((f) => (
                <div key={f.q}>
                  <h3 className="font-semibold mb-1">{f.q}</h3>
                  <p className="text-muted-foreground leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default StudyOnlineAfrica;
