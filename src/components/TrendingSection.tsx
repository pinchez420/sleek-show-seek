import { TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const trendingEvents = [
  {
    rank: 1,
    title: "Coldplay - Music of the Spheres",
    tickets: "12,450 tickets sold today",
    image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400&auto=format&fit=crop",
  },
  {
    rank: 2,
    title: "UFC 310 Championship Night",
    tickets: "8,320 tickets sold today",
    image: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=400&auto=format&fit=crop",
  },
  {
    rank: 3,
    title: "Cirque du Soleil - Kooza",
    tickets: "6,890 tickets sold today",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop",
  },
  {
    rank: 4,
    title: "Dave Chappelle Live",
    tickets: "5,200 tickets sold today",
    image: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=400&auto=format&fit=crop",
  },
];

const TrendingSection = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-transparent via-secondary/20 to-transparent">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-10">
          <div className="p-2 rounded-lg bg-primary/10">
            <TrendingUp className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Trending Now
            </h2>
            <p className="text-muted-foreground">
              What everyone's buying right now
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trendingEvents.map((event, index) => (
            <div
              key={event.title}
              className="group flex items-center gap-4 p-4 rounded-xl glass hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer"
            >
              <span className="text-4xl font-black gradient-text w-12">
                {event.rank}
              </span>
              <img
                src={event.image}
                alt={event.title}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                  {event.title}
                </h3>
                <p className="text-sm text-primary">{event.tickets}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingSection;
