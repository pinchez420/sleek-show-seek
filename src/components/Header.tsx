import { Search, Menu, User, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Ticket className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold gradient-text">TicketPulse</span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#" className="text-foreground/80 hover:text-primary transition-colors font-medium">
            Events
          </a>
          <a href="#" className="text-foreground/80 hover:text-primary transition-colors font-medium">
            Concerts
          </a>
          <a href="#" className="text-foreground/80 hover:text-primary transition-colors font-medium">
            Sports
          </a>
          <a href="#" className="text-foreground/80 hover:text-primary transition-colors font-medium">
            Theatre
          </a>
        </nav>

        <div className="hidden lg:flex items-center gap-3 flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events, artists, venues..."
              className="pl-10 bg-secondary/50 border-border/50 focus:border-primary"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
          <Button variant="hero" size="sm" className="hidden sm:flex">
            Sell Tickets
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
