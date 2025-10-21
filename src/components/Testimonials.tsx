import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Sarah Okafor",
    role: "Frontend Developer",
    company: "Microsoft",
    image: "👩🏾‍💻",
    content:
      "Tech Faculty transformed my career. The hands-on training and internship program helped me land my dream job at Microsoft within 6 months!",
    rating: 5,
  },
  {
    name: "David Mensah",
    role: "Data Analyst",
    company: "Google",
    image: "👨🏿‍💼",
    content:
      "The Work & Earn program was a game-changer. I recovered my tuition by month 4 and now work full-time at Google. Highly recommend!",
    rating: 5,
  },
  {
    name: "Amina Hassan",
    role: "Cybersecurity Specialist",
    company: "Deloitte",
    image: "👩🏽‍💻",
    content:
      "The instructors are world-class, and the curriculum is always up-to-date with industry demands. Best investment I ever made.",
    rating: 5,
  },
  {
    name: "James Njoroge",
    role: "Cloud Engineer",
    company: "Amazon Web Services",
    image: "👨🏾‍💻",
    content:
      "From zero knowledge to AWS certified in 6 months. The practical approach and career support made all the difference.",
    rating: 5,
  },
  {
    name: "Zainab Ibrahim",
    role: "AI Engineer",
    company: "IBM",
    image: "👩🏾‍🔬",
    content:
      "Tech Faculty's AI program is comprehensive and practical. Now I'm building ML models at IBM and loving every moment!",
    rating: 5,
  },
  {
    name: "Kwame Asante",
    role: "Full-Stack Developer",
    company: "Stripe",
    image: "👨🏿‍💻",
    content:
      "The training was intense but worth it. Secured an internship that turned into a full-time offer at Stripe. Forever grateful!",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Success <span className="text-gradient">Stories</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Hear from our alumni who are now thriving in top tech companies worldwide.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {testimonials.map((testimonial, idx) => (
            <Card
              key={idx}
              className="bg-card border-border hover:border-primary/50 transition-all hover:shadow-lg"
            >
              <CardContent className="p-6 space-y-4">
                {/* Rating */}
                <div className="flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} size={16} className="fill-primary text-primary" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-muted-foreground italic">
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
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
