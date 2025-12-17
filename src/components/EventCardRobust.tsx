import { Calendar, MapPin, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/useFavorites";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface EventCardProps {
  id: string;
  image: string;
  title: string;
  date: string;
  venue: string;
  price: string;
  category: string;
}

const EventCardRobust = ({ id, image, title, date, venue, price, category }: EventCardProps) => {
  const { user } = useAuth();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isToggling, setIsToggling] = useState(false);
  
  const favorited = isFavorite(id);

  const handleBuy = () => {
    const params = new URLSearchParams({ eventId: id, qty: "1" });
    navigate(`/checkout?${params.toString()}`);
  };

  const handleToggleFavorite = async () => {
    console.log('=== FAVORITES DEBUG START ===');
    console.log('Event ID:', id);
    console.log('User authenticated:', !!user);
    console.log('Currently favorited:', favorited);
    console.log('Toggle function:', typeof toggleFavorite);
    
    if (!user) {
      console.log('No user - showing sign in toast');
      toast({
        title: "Sign in required",
        description: "Please sign in to save favorite events",
        variant: "destructive"
      });
      return;
    }

    if (isToggling) {
      console.log('Already toggling - ignoring click');
      return;
    }

    setIsToggling(true);
    
    try {
      console.log('Calling toggleFavorite...');
      await toggleFavorite(id);
      console.log('Toggle completed successfully');
    } catch (error) {
      console.error('Toggle failed:', error);
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsToggling(false);
      console.log('=== FAVORITES DEBUG END ===');
    }
  };

  // Always show the button on mobile for better UX
  const showFavoriteButton = true;

  return (
    <div className="group relative rounded-xl overflow-hidden glass hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
        
        {/* Category Badge */}
        <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-semibold">
          {category}
        </span>

        {/* Favorite Button - Enhanced Implementation */}
        <button 
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Button clicked directly');
            handleToggleFavorite();
          }}
          disabled={isToggling}
          className={cn(
            "absolute top-3 right-3 p-2 rounded-full transition-all duration-300 z-50",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
            "hover:scale-110 active:scale-95",
            favorited 
              ? "bg-primary/90 text-primary-foreground hover:bg-primary" 
              : "bg-black/30 text-white hover:bg-primary/70",
            showFavoriteButton ? "opacity-100" : "opacity-0 group-hover:opacity-100",
            isToggling && "opacity-50 cursor-not-allowed"
          )}
          aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
          title={favorited ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart 
            className={cn(
              "h-4 w-4 transition-all duration-200",
              favorited && "fill-current",
              isToggling && "animate-pulse"
            )} 
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="truncate">{venue}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-muted-foreground">From</span>
            <p className="text-xl font-bold gradient-text">{price}</p>
          </div>
          <Button variant="hero" size="sm" onClick={handleBuy}>
            Get Tickets
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventCardRobust;
