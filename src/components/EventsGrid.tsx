import EventCard from "./EventCard";

const events = [
  {
    id: "event-1",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&auto=format&fit=crop",
    title: "Electric Dreams Festival 2025",
    date: "Jan 15, 2025 • 7:00 PM",
    venue: "Barclays Center, Brooklyn",
    price: "$89",
    category: "Festival",
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
    category: "Jazz",
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

const EventsGrid = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Upcoming Events
            </h2>
            <p className="text-muted-foreground">
              Don't miss these incredible experiences
            </p>
          </div>
          <a
            href="#"
            className="hidden sm:flex items-center gap-2 text-primary hover:underline font-medium"
          >
            View All
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, index) => (
            <div
              key={event.id}
              className="animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <EventCard {...event} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventsGrid;
