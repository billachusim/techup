import { Facebook, Linkedin, MessageCircle, Mail, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="py-16 px-4 border-t border-border">
      <div className="container mx-auto max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1 space-y-3">
            <h3 className="text-xl font-bold">Tech Faculty</h3>
            <p className="text-sm text-muted-foreground">
              Get trained, certified, and employed.
            </p>
            <div className="flex gap-3 pt-2">
              <a href="https://x.com/TechFacultyNG" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="X (Twitter)">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                  <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
                </svg>
              </a>
              <a href="https://facebook.com/TechFacultyNG" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Facebook">
                <Facebook size={18} />
              </a>
              <a href="https://linkedin.com/company/tech-faculty" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="LinkedIn">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Training */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Training</h4>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link to="/#departments" className="hover:text-primary transition-colors">Departments</Link>
              <Link to="/#pricing" className="hover:text-primary transition-colors">Pricing</Link>
              <Link to="/#get-started" className="hover:text-primary transition-colors">Get Started</Link>
            </nav>
          </div>

          {/* Services */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Services</h4>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link to="/business-partnerships" className="hover:text-primary transition-colors">Business Partnerships</Link>
              <Link to="/school-collaborations" className="hover:text-primary transition-colors">School Collaborations</Link>
              <Link to="/events" className="hover:text-primary transition-colors">Events</Link>
              <Link to="/siwes" className="hover:text-primary transition-colors">Internships</Link>
            </nav>
          </div>

          {/* Company */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Company</h4>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link to="/about" className="hover:text-primary transition-colors">About</Link>
              <Link to="/blog" className="hover:text-primary transition-colors">Blog</Link>
              <Link to="/careers" className="hover:text-primary transition-colors">Careers</Link>
              <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
              <Link to="/tech-store" className="hover:text-primary transition-colors flex items-center gap-1">
                <ShoppingBag size={14} /> Tech Store
              </Link>
              <a href="mailto:thetechfaculty@gmail.com" className="hover:text-primary transition-colors flex items-center gap-1">
                <Mail size={14} /> Email Us
              </a>
              <a href="https://wa.me/2348068597140" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-1">
                <MessageCircle size={14} /> WhatsApp
              </a>
            </nav>
          </div>
        </div>

        <div className="border-t border-border pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            © Tech Faculty {new Date().getFullYear()}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
