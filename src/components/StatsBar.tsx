import { GraduationCap, TrendingUp, BookOpen, Award } from "lucide-react";

const stats = [
  { icon: GraduationCap, value: "5,000+", label: "Students Trained" },
  { icon: TrendingUp, value: "87%", label: "Employed Within 6 Months" },
  { icon: BookOpen, value: "12", label: "Industry-Recognized Courses" },
  { icon: Award, value: "3+", label: "Years Training Excellence" },
];

const StatsBar = () => {
  return (
    <section className="py-12 px-4 bg-primary/5 border-y border-border">
      <div className="container mx-auto max-w-5xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center text-center gap-2">
              <stat.icon className="w-7 h-7 text-primary" aria-hidden="true" />
              <span className="text-3xl md:text-4xl font-bold text-foreground">{stat.value}</span>
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground text-center mt-8 max-w-3xl mx-auto leading-relaxed">
          According to the{" "}
          <a
            href="https://www.weforum.org/publications/the-future-of-jobs-report-2025/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-primary"
          >
            World Economic Forum Future of Jobs Report (2025)
          </a>
          , AI and data skills are among the fastest-growing globally, with demand projected to rise 25% annually.
        </p>
      </div>
    </section>
  );
};

export default StatsBar;
