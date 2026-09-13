import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/tech-faculty-logo.png";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  ChevronDown,
  Compass,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  ShoppingBag,
} from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CurrencyToggle } from "@/components/CurrencyToggle";

const navGroups = [
  {
    label: "Programmes",
    icon: BookOpen,
    items: [
      { label: "Departments", description: "Explore our training courses", href: "/departments" },
      { label: "SIWES / IT placements", href: "/siwes" },
      { label: "Virtual SIWES (online IT)", href: "/virtual-siwes" },
      { label: "SIWES Success Kit", href: "/siwes-success-kit" },
    ],
  },
  {
    label: "Explore",
    icon: Compass,
    items: [
      { label: "Careers", href: "/careers" },
      { label: "Opportunities board", href: "/opportunities" },
      { label: "Events", href: "/events" },
      { label: "Tech hubs directory", href: "/hubs" },
    ],
  },
  {
    label: "Resources",
    icon: BriefcaseBusiness,
    items: [
      { label: "Blog", href: "/blog" },
      { label: "Products", href: "/products" },
      { label: "Tech Store", href: "/tech-store" },
      { label: "Business partnerships", href: "/business-partnerships" },
      { label: "School collaborations", href: "/school-collaborations" },
    ],
  },
];

const directLinks = [
  { label: "Home", href: "/" },
  { label: "Locations", href: "/locations", icon: MapPin },
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
    return location.pathname === href || location.pathname.startsWith(`${href}/`);
  };

  const isGroupActive = (items: Array<{ href: string }>) => items.some((item) => isActive(item.href));

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex shrink-0 items-center gap-2.5" aria-label="Tech Faculty home">
            <img src={logo} alt="" className="h-9 w-9" />
            <div className="hidden sm:block">
              <div className="text-base font-bold leading-tight">Tech Faculty</div>
              <div className="text-[10px] leading-tight text-muted-foreground">Train, Certify and Employ</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden min-w-0 flex-1 items-center justify-end gap-0.5 lg:flex" aria-label="Main navigation">
            <Button asChild variant="ghost" size="sm" className={isActive("/") ? "bg-muted font-semibold text-foreground" : "text-muted-foreground"}>
              <Link to="/">Home</Link>
            </Button>

            {navGroups.map((group) => (
              <DropdownMenu key={group.label}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`gap-1 ${isGroupActive(group.items) ? "bg-muted font-semibold text-foreground" : "text-muted-foreground"}`}
                  >
                    {group.label} <ChevronDown className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-64 p-1.5">
                  {group.items.map((item) => (
                    <DropdownMenuItem key={item.href} asChild className="p-0">
                      <Link
                        to={item.href}
                        className={`flex w-full flex-col items-start rounded-sm px-3 py-2.5 ${isActive(item.href) ? "bg-muted font-semibold text-foreground" : ""}`}
                      >
                        <span>{item.label}</span>
                        {"description" in item && item.description ? (
                          <span className="text-xs font-normal text-muted-foreground">{item.description}</span>
                        ) : null}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ))}

            <Button asChild variant="ghost" size="sm" className={`gap-1.5 ${isActive("/locations") ? "bg-muted font-semibold text-foreground" : "text-muted-foreground"}`}>
              <Link to="/locations"><MapPin className="h-3.5 w-3.5" /> Locations</Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className={isActive("/about") ? "bg-muted font-semibold text-foreground" : "text-muted-foreground"}>
              <Link to="/about">About</Link>
            </Button>

            <div className="ml-2 flex items-center gap-1 border-l border-border pl-3">
              <CurrencyToggle />
            {isLoggedIn ? (
              <>
                <Button asChild size="sm" variant="ghost" className="gap-1">
                  <Link to="/dashboard">
                    <LayoutDashboard size={14} /> Dashboard
                  </Link>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={logout}
                  className="gap-1"
                >
                  Log Out <LogOut size={14} />
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                onClick={handleSignUpClick}
                className="ml-1 gap-1"
              >
                Sign Up Free <ArrowRight size={14} />
              </Button>
            )}
            </div>
          </nav>

          {/* Mobile Menu */}
          <div className="flex items-center gap-2 lg:hidden">
            <CurrencyToggle />
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open navigation menu">
                  <Menu size={22} />
                  <span className="sr-only">Open navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[min(22rem,88vw)] overflow-y-auto px-4 pt-12">
                <div className="mb-5 border-b border-border pb-4">
                  <SheetTitle className="text-base font-bold">Menu</SheetTitle>
                  <p className="text-xs text-muted-foreground">Learn, explore and connect</p>
                </div>
                <nav className="flex flex-col gap-5 pb-8" aria-label="Mobile navigation">
                  <div className="grid grid-cols-2 gap-2">
                    {directLinks.map((link) => (
                      <Button
                        key={link.href}
                        asChild
                        variant={isActive(link.href) ? "secondary" : "outline"}
                        className="h-11 justify-start gap-2"
                      >
                        <Link to={link.href} onClick={() => handleNavClick(link.href)}>
                          {link.icon ? <link.icon className="h-4 w-4" /> : null}
                          {link.label}
                        </Link>
                      </Button>
                    ))}
                  </div>

                  {navGroups.map((group) => (
                    <div key={group.label}>
                      <div className="mb-1.5 flex items-center gap-2 px-2 text-xs font-semibold uppercase text-muted-foreground">
                        <group.icon className="h-3.5 w-3.5" />
                        <span>{group.label}</span>
                      </div>
                      <div className="space-y-0.5">
                        {group.items.map((item) => (
                          <Button
                            key={item.href}
                            asChild
                            variant="ghost"
                            className={`h-10 w-full justify-start px-3 ${isActive(item.href) ? "bg-muted font-semibold text-foreground" : "text-foreground"}`}
                          >
                            <Link to={item.href} onClick={() => setMobileOpen(false)}>
                              {item.label === "Tech Store" ? <ShoppingBag className="h-4 w-4" /> : null}
                              {item.label}
                            </Link>
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}

                  {isLoggedIn ? (
                    <div className="space-y-2 border-t border-border pt-4">
                      <Button asChild variant="outline" className="w-full justify-start gap-2">
                        <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
                          <LayoutDashboard size={16} /> Dashboard
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => { setMobileOpen(false); logout(); }}
                        className="w-full gap-1"
                      >
                        Log Out <LogOut size={14} />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={handleSignUpClick}
                      className="h-11 w-full gap-1"
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
