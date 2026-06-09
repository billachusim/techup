import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, MessageCircle, Send, Smartphone, Headphones, Sparkles, Globe } from "lucide-react";
import heroImage from "@/assets/tinypeople-hero.jpg";

const START_URL = "https://tinypeople.ai/start";
const LEARN_URL = "https://tinypeople.ai";

const TinyPeople = () => {
  return (
    <>
      <Helmet>
        <title>Tiny People AI in Africa | Tech Faculty × Natura Inc</title>
        <meta
          name="description"
          content="Tech Faculty has partnered with Natura Inc to bring Tiny People AI — a powerful personal AI agent on WhatsApp, Telegram and iMessage — to Africa."
        />
        <link rel="canonical" href="https://techfaculty.ng/tinypeople" />
      </Helmet>

      <Header />

      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-medium bg-primary/10 text-primary px-3 py-1.5 rounded-full mb-4">
                <Sparkles size={14} /> Tech Faculty × Natura Inc
              </div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                Meet Tiny People AI — Your Personal AI Agent, Now in Africa
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Tech Faculty has partnered with Natura Inc to bring Tiny People AI to users
                across Nigeria and Africa. Talk to one of the world's most capable AI agents
                right from WhatsApp, Telegram or iMessage — no app to install.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" className="bg-gradient-to-r from-primary to-[hsl(180,100%,45%)] text-background hover:opacity-90 gap-2">
                  <a href={START_URL} target="_blank" rel="noopener noreferrer">
                    Start Using Tiny People <ArrowRight size={16} />
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href={LEARN_URL} target="_blank" rel="noopener noreferrer">
                    Learn more about Tiny People AI
                  </a>
                </Button>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden border border-border shadow-lg">
              <img
                src={heroImage}
                alt="Tiny People AI agent connecting through messaging apps"
                width={1280}
                height={736}
                className="w-full h-auto"
              />
            </div>
          </div>
        </section>

        {/* What is it */}
        <section className="container mx-auto px-4 max-w-4xl mt-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">An AI agent that lives in your messages</h2>
          <p className="text-muted-foreground text-lg">
            Tiny People is not just a chatbot — it's a powerful personal AI agent that can plan,
            research, remember, and take action on your behalf. The best part? You talk to it
            exactly the same way you talk to your friends.
          </p>
        </section>

        {/* Channels */}
        <section className="container mx-auto px-4 max-w-6xl mt-16">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: MessageCircle, name: "WhatsApp", desc: "Chat with your AI agent from the app you already use every day." },
              { icon: Send, name: "Telegram", desc: "Fast, private, secure conversations with your personal agent." },
              { icon: Smartphone, name: "iMessage", desc: "Native Apple experience — talk to Tiny People right from Messages." },
            ].map(({ icon: Icon, name, desc }) => (
              <Card key={name} className="border-border/60">
                <CardContent className="p-6 space-y-3">
                  <div className="w-11 h-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Icon size={22} />
                  </div>
                  <h3 className="text-xl font-semibold">{name}</h3>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-6 border-primary/30 bg-primary/5">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="w-11 h-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Headphones size={22} />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Coming soon: AI Earbuds</h3>
                <p className="text-sm text-muted-foreground">
                  Pre-order Tiny People earbuds for hands-free conversations with your agent
                  anywhere you go. Delivery available across Nigeria and Africa.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Why */}
        <section className="container mx-auto px-4 max-w-4xl mt-20 text-center">
          <div className="inline-flex items-center gap-2 text-xs font-medium bg-primary/10 text-primary px-3 py-1.5 rounded-full mb-4">
            <Globe size={14} /> Built for our region
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">World-class AI, on the channels we already use</h2>
          <p className="text-muted-foreground text-lg">
            We partnered with Natura Inc because Africa deserves first-class access to the
            best AI tools — not after, but right alongside the rest of the world. With Tiny
            People, the gift of AI is just one message away.
          </p>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4 max-w-4xl mt-20">
          <div className="rounded-2xl bg-gradient-to-r from-primary to-[hsl(180,100%,45%)] p-10 text-center text-background">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Start chatting with Tiny People</h2>
            <p className="opacity-90 mb-6 max-w-xl mx-auto">
              Click below to connect via WhatsApp, Telegram or iMessage and meet your new AI agent.
            </p>
            <Button asChild size="lg" variant="secondary" className="gap-2">
              <a href={START_URL} target="_blank" rel="noopener noreferrer">
                Start Using Tiny People <ArrowRight size={16} />
              </a>
            </Button>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-6">
            Powered by Natura Inc · Brought to you by Tech Faculty
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default TinyPeople;