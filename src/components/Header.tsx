


import { Search, Menu, User, Ticket, LogOut, X, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useState } from "react";


const Header = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  const handleMobileNavigation = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <Ticket className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold gradient-text">TicketPulse</span>
        </div>

        {/* Top navigation removed to avoid duplication with middle section filters */}

        <div className="hidden lg:flex items-center gap-3 flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events, artists, venues..."
              className="pl-10 bg-secondary/50 border-border/50 focus:border-primary"
              defaultValue={searchParams.get('q') ?? ''}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const value = (e.target as HTMLInputElement).value;
                  const next = new URLSearchParams(searchParams);
                  if (value) next.set('q', value); else next.delete('q');
                  setSearchParams(next, { replace: false });
                  navigate(`/?${next.toString()}`);
                }
              }}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">

          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(true)}
          >
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

                    <DropdownMenuItem onClick={() => handleMobileNavigation('/orders')}>
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      My Orders
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleMobileNavigation('/tickets')}>
                      <Ticket className="h-4 w-4 mr-2" />
                      My Tickets
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
          
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              
              {/* Mobile Search */}
              <div className="mt-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search events, artists, venues..."
                    className="pl-10 bg-secondary/50 border-border/50 focus:border-primary"
                    defaultValue={searchParams.get('q') ?? ''}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const value = (e.target as HTMLInputElement).value;
                        const next = new URLSearchParams(searchParams);
                        if (value) next.set('q', value); else next.delete('q');
                        setSearchParams(next, { replace: false });
                        navigate(`/?${next.toString()}`);
                        setMobileMenuOpen(false);
                      }
                    }}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4 mt-8">
                <Button 
                  variant="ghost" 
                  className="justify-start h-12 text-lg"
                  onClick={() => handleMobileNavigation('/')}
                >
                  <Ticket className="h-5 w-5 mr-3" />
                  Home
                </Button>
                

                {user ? (
                  <>
                    <Button 
                      variant="ghost" 
                      className="justify-start h-12 text-lg"
                      onClick={() => handleMobileNavigation('/orders')}
                    >
                      <ShoppingBag className="h-5 w-5 mr-3" />
                      My Orders
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="justify-start h-12 text-lg"
                      onClick={() => handleMobileNavigation('/tickets')}
                    >
                      <Ticket className="h-5 w-5 mr-3" />
                      My Tickets
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="justify-start h-12 text-lg text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={handleSignOut}
                    >
                      <LogOut className="h-5 w-5 mr-3" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <Button 
                    variant="hero" 
                    className="justify-start h-12 text-lg"
                    onClick={() => handleMobileNavigation('/auth')}
                  >
                    <User className="h-5 w-5 mr-3" />
                    Sign In
                  </Button>

                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
