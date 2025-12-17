import { Calendar, MapPin, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/useFavorites";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface EventCardProps {
  id: string;
  image: string;
  title: string;
  date: string;
  venue: string;
  price: string;
  category: string;
}

const EventCardFixed = ({ id, image, title, date, venue, price, category }: EventCardProps) => {
  const { user } = useAuth();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { toast } = useToast();
  const favorited = isFavorite(id);
  const navigate = useNavigate();

  const handleBuy = () => {
    const params = new URLSearchParams({ eventId: id, qty: "1" });
    navigate(`/checkout?${params.toString()}`);
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Favorite button clicked:', { eventId: id, user: !!user });
    
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save favorite events",
        variant: "destructive"
      });
      return;
    }

    try {
      await toggleFavorite(id);
      console.log('Favorite toggle completed for:', id);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive"
      });
    }
  };

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

        {/* Favorite Button */}
        <button 
          type="button"
          onClick={handleToggleFavorite}
          className={cn(
            "absolute top-3 right-3 p-2 rounded-full glass transition-all duration-300 hover:bg-primary/20 z-20",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
            favorited ? "opacity-100" : "opacity-70 group-hover:opacity-100"
          )}
          aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart 
            className={cn(
              "h-4 w-4 transition-all duration-200",
              favorited 
                ? "text-primary fill-primary scale-110" 
                : "text-white hover:text-primary"
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

export default EventCardFixed;
