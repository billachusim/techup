import { Facebook, Twitter, Linkedin, Instagram, Youtube } from "lucide-react";
import logo from "@/assets/tech-faculty-logo.png";

const Footer = () => {
  return (
    <footer className="bg-secondary border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Tech Faculty Logo" className="h-10 w-10" />
              <span className="text-xl font-bold text-gradient">Tech Faculty</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Empowering Africa's next generation of tech leaders. Get trained,
              certified, and employed.
            </p>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all"
              >
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Departments */}
          <div>
            <h4 className="font-semibold mb-4 text-primary">Departments</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#departments" className="hover:text-primary transition-colors">
                  Web Development
                </a>
              </li>
              <li>
                <a href="#departments" className="hover:text-primary transition-colors">
                  Data Science
                </a>
              </li>
              <li>
                <a href="#departments" className="hover:text-primary transition-colors">
                  Cybersecurity
                </a>
              </li>
              <li>
                <a href="#departments" className="hover:text-primary transition-colors">
                  AI & Machine Learning
                </a>
              </li>
              <li>
                <a href="#departments" className="hover:text-primary transition-colors">
                  Cloud Computing
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4 text-primary">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Our Story
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Partner Companies
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4 text-primary">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Success Stories
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Tech Faculty. All rights reserved. Empowering
            Africa's Tech Future.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
