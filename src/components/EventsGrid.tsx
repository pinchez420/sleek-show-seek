import { useEffect, useState } from "react";
import EventCard from "./EventCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, PartyPopper, Music, Trophy, Theater, Mic2, Gamepad2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Define the shape of an event matches your Supabase table
interface Event {
  id: string;
  title: string;
  date: string;
  venue: string;
  price: string;
  category: string;
  image: string;
}

const categories = [
  { name: "All", icon: PartyPopper },
  { name: "Concert", icon: Music },
  { name: "Sports", icon: Trophy },
  { name: "Theatre", icon: Theater },
  { name: "Comedy", icon: Mic2 },
  { name: "Gaming", icon: Gamepad2 },
];

const EventsGrid = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch data from Supabase on load
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*');
        
        if (error) throw error;
        
        if (data) {
          setEvents(data);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        toast.error("Failed to load events. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // 2. Filter Logic
  const filteredEvents = events.filter((event) => {
    const matchesCategory = activeCategory === "All" || event.category === activeCategory;
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          event.venue.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="py-8" id="events-section">
      <div className="container mx-auto px-4">
        
        {/* --- SEARCH BAR --- */}
        <div className="flex justify-center mb-8">
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events, artists, or venues..."
              className="pl-10 h-12 bg-secondary/50 border-primary/20 focus:border-primary text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* --- CATEGORY BUTTONS --- */}
        <div className="flex flex-wrap gap-3 justify-center mb-10">
          {categories.map((cat) => (
            <Button
              key={cat.name}
              variant={activeCategory === cat.name ? "hero" : "glass"}
              size="lg"
              className="gap-2 transition-all"
              onClick={() => setActiveCategory(cat.name)}
            >
              <cat.icon className="h-5 w-5" />
              {cat.name}
            </Button>
          ))}
        </div>

        {/* --- RESULTS HEADER --- */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">
            {activeCategory === "All" ? "All Events" : `${activeCategory} Events`}
          </h2>
          <span className="text-muted-foreground">
            {loading ? "Loading..." : `${filteredEvents.length} results`}
          </span>
        </div>

        {/* --- LOADING & GRID STATE --- */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event, index) => (
              <div key={event.id} className="animate-fade-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <EventCard {...event} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-xl">No events found matching "{searchQuery}"</p>
            <Button variant="link" onClick={() => {setSearchQuery(""); setActiveCategory("All");}}>
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default EventsGrid;
