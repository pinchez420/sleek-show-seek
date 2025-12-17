import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import heroConcert from "@/assets/hero-concert.jpg";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface EventRow {
  id: string;
  title: string;
  date: string;
  venue: string;
  price: string;
  category: string;
  image: string;
}

const HeroSection = () => {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState<EventRow | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!mounted) return;

      if (!error && data) {
        setFeatured(data as EventRow);
      }
    })();

    return () => { mounted = false; };
  }, []);

  const handleGetTickets = () => {
    if (!featured) return;
    const params = new URLSearchParams({ eventId: featured.id, qty: "1" });
    navigate(`/checkout?${params.toString()}`);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroConcert}
          alt="Concert crowd with dramatic stage lighting"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/60" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-3xl">
          <div className="animate-fade-up" style={{ animationDelay: "0.1s" }}>
            <span className="inline-block px-4 py-1.5 rounded-full glass text-primary text-sm font-medium mb-6">
              ✨ Featured Event
            </span>
          </div>

          <h1
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            <span className="text-foreground">Experience the</span>
            <br />
            <span className="gradient-text">Ultimate Live Shows</span>
          </h1>

          <p
            className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl animate-fade-up"
            style={{ animationDelay: "0.3s" }}
          >
            Discover and book tickets to the hottest concerts, festivals, and
            events happening near you. Don't miss out on unforgettable
            experiences.
          </p>

          <div
            className="flex flex-wrap items-center gap-4 mb-10 animate-fade-up"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-5 w-5 text-primary" />
              <span>{featured?.date ?? ""}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-5 w-5 text-primary" />
              <span>{featured?.venue ?? ""}</span>
            </div>
          </div>

          <div
            className="flex flex-wrap gap-4 animate-fade-up"
            style={{ animationDelay: "0.5s" }}
          >
            <Button variant="hero" size="xl" onClick={handleGetTickets} disabled={!featured}>
              Get Tickets
              <ArrowRight className="h-5 w-5" />
            </Button>
            <a href="#events-section">
              <Button variant="glass" size="xl">
                Browse All Events
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
