import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const companies = [
  { name: "Flutterwave", logo: "🦋" },
  { name: "Paystack", logo: "💳" },
  { name: "Andela", logo: "🚀" },
  { name: "Kuda Bank", logo: "🏦" },
  { name: "Interswitch", logo: "💼" },
  { name: "Microsoft", logo: "☁️" },
  { name: "Google", logo: "🌐" },
  { name: "MTN", logo: "📱" },
];

const Companies = () => {
  return (
    <section className="py-16 px-4 bg-secondary/20">
      <div className="container mx-auto max-w-5xl text-center space-y-8">
        <h2 className="text-2xl md:text-3xl font-bold">Our Graduates Get Hired By</h2>
        <div className="flex flex-wrap justify-center gap-6 md:gap-10">
          {companies.map((company) => (
            <div key={company.name} className="flex flex-col items-center gap-1">
              <span className="text-3xl">{company.logo}</span>
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
