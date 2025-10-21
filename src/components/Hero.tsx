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
      {/* White grid pattern background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Animated gradient overlay */}
      <div className="absolute inset-0 opacity-40">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grid-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(158, 100%, 50%)" stopOpacity="0.2">
                <animate attributeName="stop-opacity" values="0.2;0.4;0.2" dur="4s" repeatCount="indefinite" />
              </stop>
              <stop offset="100%" stopColor="hsl(180, 100%, 45%)" stopOpacity="0.2">
                <animate attributeName="stop-opacity" values="0.2;0.4;0.2" dur="4s" repeatCount="indefinite" begin="2s" />
              </stop>
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-gradient)" />
        </svg>
      </div>

      <div className="container mx-auto max-w-4xl text-center space-y-8 relative z-10">
        {/* Main Heading */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
          Get trained. Get certified.{" "}
          <span className="text-gradient">Get employed.</span>
        </h1>

        {/* Subheading */}
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Tech Faculty transforms Nigeria and Africa's youth into world-class tech professionals. Learn cutting-edge skills, earn globally recognized certifications, and start working with top companies—all while earning from month 3. Your tech career starts here.
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
