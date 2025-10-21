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
      className="min-h-screen flex items-center justify-center py-20 px-4"
    >
      <div className="container mx-auto max-w-4xl text-center space-y-8">
        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
          Get <span className="text-gradient">Trained</span>,{" "}
          <span className="text-gradient">Certified</span>, and{" "}
          <span className="text-gradient">Employed</span>
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Join Africa's leading tech education platform. Learn modern tech skills,
          earn industry certifications, and land your dream job.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Button
            size="lg"
            onClick={() => window.open("https://forms.gle/example", "_blank")}
            className="bg-gradient-to-r from-primary to-[hsl(180,100%,45%)] text-primary-foreground hover:opacity-90"
          >
            Tech Up Now
            <ArrowRight className="ml-2" size={20} />
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={scrollToDepartments}
          >
            Explore Departments
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
