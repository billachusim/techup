import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "@/assets/tech-faculty-logo.png";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

const Header = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const scrollDifference = Math.abs(currentScrollY - lastScrollY);
          
          // Only update if scroll difference is significant (prevents jitter from animations)
          if (scrollDifference > 5) {
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
              setIsVisible(false);
            } else if (currentScrollY < lastScrollY) {
              setIsVisible(true);
            }
            setLastScrollY(currentScrollY);
          }
          
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Tech Faculty Logo" className="h-10 w-10" />
            <div>
              <div className="text-xl font-bold">Tech Faculty</div>
              <div className="text-xs text-muted-foreground">Get Trained, Certified, and Employed</div>
            </div>
          </Link>
          
          <Link to="/tech-store">
            <Button variant="ghost" size="sm">
              <ShoppingBag className="mr-2" size={16} />
              Tech Store
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
