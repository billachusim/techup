import { useState, useEffect } from "react";
import { PhoneCall, MessageSquare, Calendar, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AIChatModal } from "@/components/AIChatModal";

const cards = [
  {
    icon: PhoneCall,
    title: "Not Sure Where to Start?",
    buttons: [
      { label: "Talk to Faculty AI", icon: MessageSquare, action: "ai" },
      { label: "Book a Clarity Call", icon: Calendar, action: "call" },
    ],
  },
  {
    icon: Sparkles,
    title: "Need A Custom Package?",
    description: "Looking for corporate training or personalized learning paths?",
    buttons: [
      { label: "Contact Us for Custom Package", icon: MessageSquare, action: "custom" },
    ],
  },
];

const Clarity = () => {
  const [showAIChat, setShowAIChat] = useState(false);
  const [showClarityCall, setShowClarityCall] = useState(false);
  const [currentCard, setCurrentCard] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCard((prev) => (prev + 1) % cards.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleButtonClick = (action: string) => {
    if (action === "ai") {
      setShowAIChat(true);
    } else if (action === "call") {
      setShowClarityCall(true);
    } else if (action === "custom") {
      const message = `Hi! I'd like to discuss a custom training package tailored to my needs.`;
      window.open(`https://wa.me/2348068597140?text=${encodeURIComponent(message)}`, "_blank");
    }
  };

  return (
    <section className="py-24 px-4 bg-muted/30">
      <div className="container mx-auto max-w-4xl">
        <div className="relative overflow-hidden">
          {cards.map((card, index) => (
            <Card
              key={index}
              className={`p-8 md:p-12 text-center space-y-6 bg-gradient-to-br from-background to-muted/50 border-2 transition-all duration-500 ${
                index === currentCard
                  ? "opacity-100 translate-x-0"
                  : index < currentCard
                  ? "opacity-0 -translate-x-full absolute inset-0"
                  : "opacity-0 translate-x-full absolute inset-0"
              }`}
            >
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <card.icon className="w-8 h-8 text-primary" />
                </div>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold">{card.title}</h2>
              
              {card.description && (
                <p className="text-muted-foreground max-w-2xl mx-auto">{card.description}</p>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                {card.buttons.map((button, btnIndex) => (
                  <Button
                    key={btnIndex}
                    size="lg"
                    variant={btnIndex === 0 ? "default" : "outline"}
                    onClick={() => handleButtonClick(button.action)}
                    className={btnIndex === 0 ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg" : "shadow-lg"}
                  >
                    <button.icon className="mr-2" size={20} />
                    {button.label}
                  </Button>
                ))}
              </div>
            </Card>
          ))}
        </div>
        
        {/* Slide indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {cards.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentCard(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentCard ? "bg-primary w-8" : "bg-muted-foreground/30"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <AIChatModal open={showAIChat} onOpenChange={setShowAIChat} />

      <Dialog open={showClarityCall} onOpenChange={setShowClarityCall}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Book Your Free Clarity Call</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <p className="text-muted-foreground">
              Choosing the right tech career path can be overwhelming. That's why we offer a <span className="font-semibold text-foreground">free clarity call</span> with our expert advisors.
            </p>

            <div className="space-y-4">
              <p className="text-sm font-medium">In this 30-minute call, you'll get:</p>
              <ul className="text-sm text-muted-foreground space-y-2">
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
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Calendar className="mr-2" size={20} />
              Open Calendly
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              No commitment required. Just honest advice to help you succeed.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Clarity;