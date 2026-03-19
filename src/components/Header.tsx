import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/tech-faculty-logo.png";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ShoppingBag, ChevronDown, ArrowRight, LogOut, LayoutDashboard } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CurrencyToggle } from "@/components/CurrencyToggle";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Departments", href: "/#departments" },
  {
    label: "Partnerships",
    children: [
      { label: "Business Partnerships", href: "/business-partnerships" },
      { label: "School Collaborations", href: "/school-collaborations" },
    ],
  },
  { label: "Careers", href: "/careers" },
  { label: "Events", href: "/events" },
  { label: "Internships", href: "/siwes" },
  { label: "Tech Store", href: "/tech-store" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
];

const Header = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { isLoggedIn, logout } = useUser();

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const scrollDifference = Math.abs(currentScrollY - lastScrollY);
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

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    if (href.startsWith("/#")) {
      const id = href.replace("/#", "");
      if (location.pathname === "/") {
        const el = document.getElementById(id);
        el?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleSignUpClick = () => {
    setMobileOpen(false);
    if (location.pathname === "/") {
      const el = document.getElementById("get-started");
      el?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = "/#get-started";
    }
  };

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    if (href.startsWith("/#")) return false;
    return location.pathname === href;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src={logo} alt="Tech Faculty Logo" className="h-9 w-9" />
            <div>
              <div className="text-lg font-bold leading-tight">Tech Faculty</div>
              <div className="text-[10px] text-muted-foreground leading-tight">Train, Certify and Employ</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) =>
              link.children ? (
                <DropdownMenu key={link.label}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-sm gap-1">
                      {link.label} <ChevronDown size={14} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {link.children.map((child) => (
                      <DropdownMenuItem key={child.href} asChild>
                        <Link to={child.href} className={isActive(child.href) ? "font-semibold text-primary" : ""}>
                          {child.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link key={link.href} to={link.href} onClick={() => handleNavClick(link.href!)}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`text-sm ${isActive(link.href!) ? "text-primary font-semibold" : ""}`}
                  >
                    {link.label === "Tech Store" && <ShoppingBag className="mr-1" size={14} />}
                    {link.label}
                  </Button>
                </Link>
              )
            )}
            <CurrencyToggle />
            {isLoggedIn ? (
              <Button
                size="sm"
                variant="outline"
                onClick={logout}
                className="ml-2 gap-1"
              >
                Log Out <LogOut size={14} />
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={handleSignUpClick}
                className="ml-2 bg-gradient-to-r from-primary to-[hsl(180,100%,45%)] text-background hover:opacity-90 gap-1"
              >
                Sign Up Free <ArrowRight size={14} />
              </Button>
            )}
          </nav>

          {/* Mobile Menu */}
          <div className="flex items-center gap-2 lg:hidden">
            <CurrencyToggle />
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu size={22} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 pt-12">
                <nav className="flex flex-col gap-1">
                  {navLinks.map((link) =>
                    link.children ? (
                      <div key={link.label} className="space-y-1">
                        <p className="text-sm font-semibold text-muted-foreground px-3 pt-3">{link.label}</p>
                        {link.children.map((child) => (
                          <Link key={child.href} to={child.href} onClick={() => setMobileOpen(false)}>
                            <Button
                              variant="ghost"
                              className={`w-full justify-start pl-6 text-sm ${isActive(child.href) ? "text-primary font-semibold" : ""}`}
                            >
                              {child.label}
                            </Button>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <Link key={link.href} to={link.href!} onClick={() => handleNavClick(link.href!)}>
                        <Button
                          variant="ghost"
                          className={`w-full justify-start text-sm ${isActive(link.href!) ? "text-primary font-semibold" : ""}`}
                        >
                          {link.label === "Tech Store" && <ShoppingBag className="mr-2" size={16} />}
                          {link.label}
                        </Button>
                      </Link>
                    )
                  )}
                  {isLoggedIn ? (
                    <Button
                      variant="outline"
                      onClick={() => { setMobileOpen(false); logout(); }}
                      className="mt-4 gap-1"
                    >
                      Log Out <LogOut size={14} />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSignUpClick}
                      className="mt-4 bg-gradient-to-r from-primary to-[hsl(180,100%,45%)] text-background hover:opacity-90 gap-1"
                    >
                      Sign Up Free <ArrowRight size={14} />
                    </Button>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
