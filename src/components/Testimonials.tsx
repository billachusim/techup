import { ExternalLink, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  GOOGLE_RATING,
  GOOGLE_REVIEWS_URL,
  GOOGLE_WRITE_REVIEW_URL,
  googleReviews,
} from "@/data/googleReviews";

const getInitialColor = (name: string) => {
  const colors = [
    "bg-primary", "bg-[hsl(200,70%,50%)]", "bg-[hsl(270,60%,50%)]",
    "bg-[hsl(340,65%,50%)]", "bg-[hsl(30,80%,50%)]", "bg-[hsl(145,60%,40%)]",
    "bg-[hsl(210,60%,45%)]", "bg-[hsl(0,65%,50%)]",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

// Real Google reviews, shown as a grid so every quote is in the page text.
// No review/rating JSON-LD on purpose: see src/data/googleReviews.ts.
const Testimonials = () => {
  return (
    <section id="testimonials" className="py-24 px-4 bg-secondary">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold">What Our Students Say</h2>
          <a
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-wrap items-center justify-center gap-2 text-lg text-muted-foreground hover:text-foreground"
          >
            <span className="flex gap-0.5" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={18} className="fill-primary text-primary" />
              ))}
            </span>
            <span>
              <strong className="text-foreground">{GOOGLE_RATING.rating}</strong> on Google from{" "}
              {GOOGLE_RATING.count} reviews
            </span>
            <ExternalLink size={14} aria-hidden="true" />
          </a>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {googleReviews.map((review) => (
            <Card key={review.name} className="bg-card border-border">
              <CardContent className="p-6 space-y-4">
                <p className="text-muted-foreground">&quot;{review.text}&quot;</p>
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <div
                    className={`w-10 h-10 shrink-0 rounded-full ${getInitialColor(review.name)} flex items-center justify-center`}
                  >
                    <span className="text-sm font-bold text-white">{review.name.charAt(0)}</span>
                  </div>
                  <div>
                    <div className="font-semibold">{review.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {review.context ? `${review.context} · ` : ""}Google review
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button asChild size="lg">
            <a href={GOOGLE_WRITE_REVIEW_URL} target="_blank" rel="noopener noreferrer">
              Trained with us? Leave a Google review
            </a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer">
              Read all reviews on Google
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
