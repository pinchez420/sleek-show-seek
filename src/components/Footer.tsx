import { Ticket, Mail, Instagram, Twitter, Facebook, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  return (
    <footer className="bg-secondary/30 border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Ticket className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold gradient-text">TicketPulse</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Your gateway to unforgettable live experiences. Discover, book, and
              enjoy the best events worldwide.
            </p>
            <div className="flex gap-3">
              <Button variant="glass" size="icon">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="glass" size="icon">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="glass" size="icon">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="glass" size="icon">
                <Youtube className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {["All Events", "Concerts", "Sports", "Theatre", "Comedy"].map(
                (link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      {link}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Support</h4>
            <ul className="space-y-2">
              {[
                "Help Center",
                "Contact Us",
                "Refund Policy",
                "Sell Tickets",
                "FAQs",
              ].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Stay Updated</h4>
            <p className="text-muted-foreground text-sm mb-4">
              Get the latest events and exclusive offers straight to your inbox.
            </p>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Enter your email"
                  className="pl-10 bg-secondary/50 border-border/50"
                />
              </div>
              <Button variant="hero">Subscribe</Button>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © 2025 TicketPulse. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors text-sm"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors text-sm"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
