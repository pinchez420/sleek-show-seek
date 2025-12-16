import { Search, Menu, User, Ticket, LogOut, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
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
          
          {!loading && (
            <>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <User className="h-5 w-5" />
                      <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium truncate">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Heart className="h-4 w-4 mr-2" />
                      My Favorites
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="ghost" size="icon" onClick={() => navigate('/auth')}>
                  <User className="h-5 w-5" />
                </Button>
              )}
            </>
          )}
          
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
