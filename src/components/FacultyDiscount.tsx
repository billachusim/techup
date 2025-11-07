import { ShoppingBag, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const FacultyDiscount = () => {
  return (
    <section className="py-24 px-4 bg-gradient-to-br from-primary/5 via-background to-primary/5">
      <div className="container mx-auto max-w-5xl">
        <div className="bg-card border-2 border-primary/20 rounded-3xl p-8 md:p-12 shadow-xl">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Icon Section */}
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-[hsl(180,100%,45%)] flex items-center justify-center shadow-lg">
                  <ShoppingBag className="w-12 h-12 text-background" />
                </div>
                <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-accent flex items-center justify-center border-4 border-background shadow-md">
                  <Percent className="w-6 h-6 text-accent-foreground" />
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 text-center md:text-left">
              <p className="text-xl md:text-2xl font-semibold text-foreground">
                Buy recommended laptops, gadgets and accessories at 50% discount from our tech store.
              </p>
            </div>

            {/* CTA Button */}
            <div className="flex-shrink-0">
              <Link to="/tech-store">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-[hsl(180,100%,45%)] hover:opacity-90 shadow-lg font-semibold text-background"
                >
                  <ShoppingBag className="mr-2" size={20} />
                  Shop Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FacultyDiscount;
