import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  const scrollToDepartments = () => {
    const element = document.getElementById("departments");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center py-20 px-4 relative overflow-hidden"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="absolute inset-0 opacity-30">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="grid-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(158, 100%, 50%)" stopOpacity="0.1">
                  <animate attributeName="stop-opacity" values="0.1;0.3;0.1" dur="4s" repeatCount="indefinite" />
                </stop>
                <stop offset="100%" stopColor="hsl(180, 100%, 45%)" stopOpacity="0.1">
                  <animate attributeName="stop-opacity" values="0.1;0.3;0.1" dur="4s" repeatCount="indefinite" begin="2s" />
                </stop>
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-gradient)" />
            {/* Grid pattern */}
            {[...Array(20)].map((_, i) => (
              <line
                key={`v-${i}`}
                x1={`${i * 5}%`}
                y1="0"
                x2={`${i * 5}%`}
                y2="100%"
                stroke="hsl(158, 100%, 50%)"
                strokeWidth="0.5"
                opacity="0.1"
              />
            ))}
            {[...Array(20)].map((_, i) => (
              <line
                key={`h-${i}`}
                x1="0"
                y1={`${i * 5}%`}
                x2="100%"
                y2={`${i * 5}%`}
                stroke="hsl(158, 100%, 50%)"
                strokeWidth="0.5"
                opacity="0.1"
              />
            ))}
          </svg>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl text-center space-y-8 relative z-10">
        {/* Main Heading */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
          Build your tech career,{" "}
          <span className="text-gradient">we'll handle the rest</span>
        </h1>

        {/* Subheading */}
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Tech Faculty combines expert training, industry certifications, and guaranteed employment opportunities to transform Africa's youth into tech professionals. From software development to AI, we provide world-class education and connect you with top companies eager to hire. Start earning from month 3 while you learn — no risk, all reward.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Button
            size="lg"
            onClick={() => window.open("https://forms.gle/example", "_blank")}
            className="bg-gradient-to-r from-primary to-[hsl(180,100%,45%)] text-white hover:opacity-90 shadow-lg"
          >
            Tech Up Now
            <ArrowRight className="ml-2" size={20} />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
