import { PhoneCall, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Clarity = () => {
  return (
    <section className="py-24 px-4 bg-muted/30">
      <div className="container mx-auto max-w-4xl">
        <Card className="p-8 md:p-12 text-center space-y-6 bg-gradient-to-br from-background to-muted/50 border-2">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <PhoneCall className="w-8 h-8 text-primary" />
            </div>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold">
            Not Sure Where to Start?
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Choosing the right tech career path can be overwhelming. That's why we offer a <span className="font-semibold text-foreground">free clarity call</span> with our expert advisors. We'll help you discover which department aligns with your passion, strengths, and career goals—no strings attached.
          </p>

          <div className="space-y-4 pt-4">
            <p className="text-sm text-muted-foreground">
              In this 30-minute call, you'll get:
            </p>
            <ul className="text-sm text-muted-foreground space-y-2 max-w-lg mx-auto text-left">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>Personalized career path recommendations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>Insights into industry trends and opportunities</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>Clear roadmap to achieve your tech career goals</span>
              </li>
            </ul>
          </div>

          <Button
            size="lg"
            onClick={() => window.open("https://calendly.com/techfaculty", "_blank")}
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
          >
            <Calendar className="mr-2" size={20} />
            Book Your Free Clarity Call
          </Button>

          <p className="text-xs text-muted-foreground">
            No commitment required. Just honest advice to help you succeed.
          </p>
        </Card>
      </div>
    </section>
  );
};

export default Clarity;