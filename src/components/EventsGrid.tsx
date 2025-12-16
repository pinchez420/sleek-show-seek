import { useState } from "react";
import EventCard from "./EventCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, PartyPopper, Music, Trophy, Theater, Mic2, Gamepad2 } from "lucide-react";

// --- DATA ---
const allEvents = [
  {
    id: "event-1",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&auto=format&fit=crop",
    title: "Electric Dreams Festival 2025",
    date: "Jan 15, 2025 • 7:00 PM",
    venue: "Barclays Center, Brooklyn",
    price: "$89",
    category: "Concert",
  },
  {
    id: "event-2",
    image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&auto=format&fit=crop",
    title: "Taylor Swift - The Eras Tour",
    date: "Feb 3, 2025 • 8:00 PM",
    venue: "SoFi Stadium, LA",
    price: "$199",
    category: "Concert",
  },
  {
    id: "event-3",
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&auto=format&fit=crop",
    title: "Jazz Under the Stars",
    date: "Jan 22, 2025 • 9:00 PM",
    venue: "Central Park, NYC",
    price: "$45",
    category: "Music",
  },
  {
    id: "event-4",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop",
    title: "NBA All-Star Weekend",
    date: "Feb 16, 2025 • 6:00 PM",
    venue: "Chase Center, SF",
    price: "$350",
    category: "Sports",
  },
  {
    id: "event-5",
    image: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&auto=format&fit=crop",
    title: "Hamilton - Broadway Show",
    date: "Jan 28, 2025 • 7:30 PM",
    venue: "Richard Rodgers Theatre",
    price: "$175",
    category: "Theatre",
  },
  {
    id: "event-6",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&auto=format&fit=crop",
    title: "Techno Warehouse Party",
    date: "Jan 18, 2025 • 11:00 PM",
    venue: "Avant Gardner, Brooklyn",
    price: "$65",
    category: "Nightlife",
  },
];

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

  // FILTER LOGIC: This runs every time you type or click a button
  const filteredEvents = allEvents.filter((event) => {
    const matchesCategory = activeCategory === "All" || event.category === activeCategory;
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          event.venue.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="py-8" id="events-section">
      <div className="container mx-auto px-4">
        
        {/* --- 1. SEARCH BAR --- */}
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

        {/* --- 2. CATEGORY BUTTONS --- */}
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

        {/* --- 3. RESULTS --- */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">
            {activeCategory === "All" ? "All Events" : `${activeCategory} Events`}
          </h2>
          <span className="text-muted-foreground">{filteredEvents.length} results</span>
        </div>

        {filteredEvents.length > 0 ? (
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
