import { useState } from "react";
import { PhoneCall, MessageSquare, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AIChatModal } from "@/components/AIChatModal";

const Clarity = () => {
  const [showAIChat, setShowAIChat] = useState(false);
  const [showClarityCall, setShowClarityCall] = useState(false);

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
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              size="lg"
              onClick={() => setShowAIChat(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
            >
              <MessageSquare className="mr-2" size={20} />
              Talk to Faculty AI
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              onClick={() => setShowClarityCall(true)}
              className="shadow-lg"
            >
              <Calendar className="mr-2" size={20} />
              Book a Clarity Call
            </Button>
          </div>
        </Card>
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