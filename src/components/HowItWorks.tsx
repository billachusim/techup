import { GraduationCap, Award, Briefcase } from "lucide-react";

const HowItWorks = () => {
  const features = [
    {
      icon: GraduationCap,
      title: "Get Trained",
      description: "Learn from industry experts with hands-on projects and real-world experience across 8+ tech disciplines.",
    },
    {
      icon: Award,
      title: "Get Certified",
      description: "Earn globally recognized certifications that prove your skills to employers worldwide.",
    },
    {
      icon: Briefcase,
      title: "Get Employed",
      description: "Access our network of 100+ partner companies ready to hire. Start earning from month 3 with our Work & Earn program.",
    },
  ];

  return (
    <section className="py-24 px-4 bg-secondary/30">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold">
            From Learner to Professional in 3 Steps
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Tech Faculty has trained over 1,000 students across dozens of physical campuses in Africa. 
            Now we're bringing that proven success online. Our structured program takes you from beginner 
            to employed professional with a 100% Return on Tuition guarantee. Through our Work & Earn 
            internship program, our best students start earning back their tuition by month 3.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-card border border-border rounded-2xl p-8 text-center space-y-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
