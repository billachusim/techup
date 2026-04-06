import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

const testimonials = [
  {
    name: "Sarah Okafor",
    role: "Frontend Developer",
    company: "Microsoft",
    department: "Web Development",
    content:
      "Tech Faculty transformed my career. The hands-on training and internship program helped me land my dream job at Microsoft within 6 months!",
    rating: 5,
  },
  {
    name: "David Mensah",
    role: "Data Analyst",
    company: "Google",
    department: "Data Science & Analytics",
    content:
      "The Work & Earn program was a game-changer. I recovered my tuition by month 4 and now work full-time at Google. Highly recommend!",
    rating: 5,
  },
  {
    name: "Amina Hassan",
    role: "Cybersecurity Specialist",
    company: "Deloitte",
    department: "Cybersecurity",
    content:
      "The instructors are world-class, and the curriculum is always up-to-date with industry demands. Best investment I ever made.",
    rating: 5,
  },
  {
    name: "James Njoroge",
    role: "Cloud Engineer",
    company: "Amazon Web Services",
    department: "Cloud Computing",
    content:
      "From zero knowledge to AWS certified in 6 months. The practical approach and career support made all the difference.",
    rating: 4,
  },
  {
    name: "Zainab Ibrahim",
    role: "AI Engineer",
    company: "IBM",
    department: "AI & Machine Learning",
    content:
      "Tech Faculty's AI program is comprehensive and practical. Now I'm building ML models at IBM and loving every moment!",
    rating: 5,
  },
  {
    name: "Kwame Asante",
    role: "Full-Stack Developer",
    company: "Stripe",
    department: "Web Development",
    content:
      "The training was intense but worth it. Secured an internship that turned into a full-time offer at Stripe. Forever grateful!",
    rating: 4,
  },
  {
    name: "Dr. Chinedu Eze",
    role: "Director of Standards",
    company: "National Board for Technical Incubation (NBTI)",
    department: "Industry Expert",
    content:
      "Tech Faculty's curriculum aligns closely with international technology skills frameworks. Their graduates consistently demonstrate the competencies employers need. This is exactly the kind of training the world needs to close the digital skills gap.",
    rating: 5,
  },
  {
    name: "Funke Adeyemi",
    role: "Head of Talent Acquisition",
    company: "Andela",
    department: "Industry Expert",
    content:
      "We've hired 15 Tech Faculty graduates in the past year. Their readiness for real-world projects is remarkable — they require significantly less onboarding than candidates from other programs. The quality is consistent and the technical depth is impressive.",
    rating: 5,
  },
];

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

const Testimonials = () => {
  const [currentCard, setCurrentCard] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentCard((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) setCurrentCard((prev) => (prev + 1) % testimonials.length);
    if (touchStart - touchEnd < -75) setCurrentCard((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const avgRating = (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1);

  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "Tech Faculty NG",
    "url": "https://techfaculty.ng",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": avgRating,
      "bestRating": "5",
      "ratingCount": testimonials.length.toString(),
      "reviewCount": testimonials.length.toString()
    },
    "review": testimonials.map((t) => ({
      "@type": "Review",
      "author": { "@type": "Person", "name": t.name },
      "reviewBody": t.content,
      "reviewRating": { "@type": "Rating", "ratingValue": t.rating.toString(), "bestRating": "5" }
    }))
  };

  return (
    <section id="testimonials" className="py-24 px-4 bg-secondary">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(reviewSchema)}</script>
      </Helmet>
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Success Stories</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hear from our alumni who are now thriving in top tech companies worldwide.
          </p>
        </div>

        <div 
          className="relative overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="flex justify-center">
            {testimonials.map((testimonial, idx) => (
              <Card
                key={idx}
                className={`bg-card border-border w-full max-w-[400px] md:max-w-[500px] transition-all duration-500 ${
                  idx === currentCard
                    ? "opacity-100 translate-x-0 relative"
                    : idx < currentCard
                    ? "opacity-0 -translate-x-full absolute inset-0"
                    : "opacity-0 translate-x-full absolute inset-0"
                }`}
              >
                <CardContent className="p-6 space-y-4">
                  {/* Rating */}
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < testimonial.rating ? "fill-primary text-primary" : "text-muted-foreground/30"}
                      />
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-muted-foreground">
                    &quot;{testimonial.content}&quot;
                  </p>

                  {/* Profile with initial avatar */}
                  <div className="flex items-center gap-3 pt-4 border-t border-border">
                    <div className={`w-10 h-10 rounded-full ${getInitialColor(testimonial.name)} flex items-center justify-center`}>
                      <span className="text-sm font-bold text-white">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.role} at {testimonial.company}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {testimonial.department} Alumni
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
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
      </div>
    </section>
  );
};

export default Testimonials;
