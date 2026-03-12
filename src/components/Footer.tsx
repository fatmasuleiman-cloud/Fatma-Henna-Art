import { Instagram, Facebook, MessageCircle } from "lucide-react";
import logo from "@/assets/fatma-logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <img src={logo} alt="Fatma Henna Art" className="h-20 w-auto mb-4" />
            <p className="font-inter text-muted-foreground mb-4">
              Professional henna artist in Nairobi specializing in bridal, custom designs, and event henna. 
              Creating beautiful art for your special moments.
            </p>
           
          </div>

          <div>
            <h3 className="font-playfair text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 font-inter text-muted-foreground">
              <li>
                <a href="#home" className="hover:text-primary transition-[var(--transition-smooth)]">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-primary transition-[var(--transition-smooth)]">
                  About
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-primary transition-[var(--transition-smooth)]">
                  Services
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-primary transition-[var(--transition-smooth)]">
                  Gallery
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-playfair text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 font-inter text-muted-foreground">
              <li>Fatma Suleiman</li>
              <li>
                <a href="tel:0114532154" className="hover:text-primary transition-[var(--transition-smooth)]">
                  0114 532154
                </a>
              </li>
              <li>
                <a href="mailto:fatmasquare71@gmail.com" className="hover:text-primary transition-[var(--transition-smooth)]">
                  fatmasquare71@gmail.com
                </a>
              </li>
              <li className="text-sm">Nairobi, Kenya</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center">
          <p className="font-inter text-sm text-muted-foreground">
            © {currentYear} Fatma Henna Art. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
