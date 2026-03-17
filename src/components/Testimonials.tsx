import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";

const testimonials = [
  {
    name: "Sarah Okafor",
    role: "Frontend Developer",
    company: "Microsoft",
    department: "Web Development",
    image: "👩🏾‍💻",
    content:
      "Tech Faculty transformed my career. The hands-on training and internship program helped me land my dream job at Microsoft within 6 months!",
    rating: 5,
  },
  {
    name: "David Mensah",
    role: "Data Analyst",
    company: "Google",
    department: "Data Science & Analytics",
    image: "👨🏿‍💼",
    content:
      "The Work & Earn program was a game-changer. I recovered my tuition by month 4 and now work full-time at Google. Highly recommend!",
    rating: 5,
  },
  {
    name: "Amina Hassan",
    role: "Cybersecurity Specialist",
    company: "Deloitte",
    department: "Cybersecurity",
    image: "👩🏽‍💻",
    content:
      "The instructors are world-class, and the curriculum is always up-to-date with industry demands. Best investment I ever made.",
    rating: 5,
  },
  {
    name: "James Njoroge",
    role: "Cloud Engineer",
    company: "Amazon Web Services",
    department: "Cloud Computing",
    image: "👨🏾‍💻",
    content:
      "From zero knowledge to AWS certified in 6 months. The practical approach and career support made all the difference.",
    rating: 5,
  },
  {
    name: "Zainab Ibrahim",
    role: "AI Engineer",
    company: "IBM",
    department: "AI & Machine Learning",
    image: "👩🏾‍🔬",
    content:
      "Tech Faculty's AI program is comprehensive and practical. Now I'm building ML models at IBM and loving every moment!",
    rating: 5,
  },
  {
    name: "Kwame Asante",
    role: "Full-Stack Developer",
    company: "Stripe",
    department: "Web Development",
    image: "👨🏿‍💻",
    content:
      "The training was intense but worth it. Secured an internship that turned into a full-time offer at Stripe. Forever grateful!",
    rating: 5,
  },
  {
    name: "Dr. Chinedu Eze",
    role: "Director of Standards",
    company: "National Board for Technical Incubation (NBTI)",
    department: "Industry Expert",
    image: "👨🏾‍🎓",
    content:
      "Tech Faculty's curriculum aligns closely with Nigeria's national technology skills framework. Their graduates consistently demonstrate the competencies employers need. This is exactly the kind of training Africa requires to close the digital skills gap.",
    rating: 5,
  },
  {
    name: "Funke Adeyemi",
    role: "Head of Talent Acquisition",
    company: "Andela",
    department: "Industry Expert",
    image: "👩🏾‍💼",
    content:
      "We've hired 15 Tech Faculty graduates in the past year. Their readiness for real-world projects is remarkable — they require significantly less onboarding than candidates from other programs. The quality is consistent and the technical depth is impressive.",
    rating: 5,
  },
];

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

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      // Swiped left
      setCurrentCard((prev) => (prev + 1) % testimonials.length);
    }

    if (touchStart - touchEnd < -75) {
      // Swiped right
      setCurrentCard((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    }
  };

  return (
    <section id="testimonials" className="py-24 px-4 bg-secondary">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Success Stories
          </h2>
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
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} size={16} className="fill-primary text-primary" />
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-muted-foreground">
                    &quot;{testimonial.content}&quot;
                  </p>

                  {/* Profile */}
                  <div className="flex items-center gap-3 pt-4 border-t border-border">
                    <div className="text-4xl">{testimonial.image}</div>
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

          {/* Slide indicators */}
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
