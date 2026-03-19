import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const companies = [
  { name: "Microsoft", color: "bg-[hsl(200,80%,50%)]", initials: "MS" },
  { name: "Google", color: "bg-[hsl(4,80%,56%)]", initials: "G" },
  { name: "Andela", color: "bg-[hsl(145,65%,42%)]", initials: "A" },
  { name: "Flutterwave", color: "bg-[hsl(45,90%,50%)]", initials: "FW" },
  { name: "Paystack", color: "bg-[hsl(210,70%,50%)]", initials: "PS" },
  { name: "MTN", color: "bg-[hsl(48,95%,50%)]", initials: "MTN" },
  { name: "Interswitch", color: "bg-[hsl(220,60%,45%)]", initials: "IS" },
  { name: "Kuda Bank", color: "bg-[hsl(270,60%,50%)]", initials: "K" },
];

const Companies = () => {
  return (
    <section className="py-16 px-4 bg-secondary/20">
      <div className="container mx-auto max-w-5xl text-center space-y-8">
        <h2 className="text-2xl md:text-3xl font-bold">Where Our Graduates Work</h2>
        <div className="flex flex-wrap justify-center gap-6 md:gap-10">
          {companies.map((company) => (
            <div key={company.name} className="flex flex-col items-center gap-2">
              <div className={`w-12 h-12 rounded-full ${company.color} flex items-center justify-center`}>
                <span className="text-xs font-bold text-white">{company.initials}</span>
              </div>
              <span className="text-xs text-muted-foreground font-medium">{company.name}</span>
            </div>
          ))}
        </div>
        <Link to="/careers">
          <Button variant="outline" size="sm" className="gap-2">
            View Opportunities <ArrowRight size={16} />
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default Companies;
