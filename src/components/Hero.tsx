import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const taglines = [
  "Learn Today. Earn Tomorrow.",
  "Train. Certify. Get Hired.",
  "Your Future in Tech Starts Here.",
  "Build Skills. Build Wealth.",
  "From Student to Professional.",
];

const Hero = () => {
  const [currentTagline, setCurrentTagline] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTagline((prev) => (prev + 1) % taglines.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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
        {/* Main Heading with Animated Taglines */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight min-h-[120px] md:min-h-[140px] lg:min-h-[160px] flex items-center justify-center">
          <span 
            key={currentTagline}
            className="animate-fade-in"
          >
            {taglines[currentTagline].split(' ').slice(0, -2).join(' ')}{" "}
            <span className="bg-gradient-to-r from-primary via-[hsl(170,100%,47%)] to-[hsl(180,100%,45%)] bg-clip-text text-transparent">
              {taglines[currentTagline].split(' ').slice(-2).join(' ')}
            </span>
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Transform your future with Tech Faculty—Africa's premier tech training platform. We equip you with industry-relevant skills, globally recognized certifications, and direct employment pathways with leading companies. Start earning from month 3 with our paid internship model and enjoy a 100% return on your tuition investment within your first year of employment. Your journey from learner to earner starts here.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Button
            size="lg"
            onClick={() => window.open("https://calendly.com/techfaculty/30min", "_blank")}
            className="bg-gradient-to-r from-primary to-[hsl(180,100%,45%)] hover:opacity-90 shadow-lg font-semibold text-background"
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
