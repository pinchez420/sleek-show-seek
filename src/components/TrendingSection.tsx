import { useEffect, useMemo, useState } from "react";
import { TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface EventRow {
  id: string;
  title: string;
  date: string;
  venue: string;
  price: string;
  category: string;
  image: string;
}

interface TrendingItem {
  event: EventRow;
  todayCount: number;
  weekCount: number;
}

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const now = () => new Date();

const daysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
};

const TrendingSection = () => {
  const [items, setItems] = useState<TrendingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadTrending = async () => {
      setLoading(true);

      // Helper to fetch events by ids maintaining a map
      const fetchEventsByIds = async (ids: string[]): Promise<Record<string, EventRow>> => {
        if (!ids.length) return {};
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .in("id", ids);
        if (error || !data) return {};
        const map: Record<string, EventRow> = {};
        for (const e of data as EventRow[]) map[e.id] = e;
        return map;
      };

      try {
        // 1) Primary: derive trending from orders (past 7 days)
        const weekStart = daysAgo(7).toISOString();
        const todayStart = startOfToday().toISOString();

        const { data: ordersWeek, error: ordersErr } = await supabase
          .from("orders")
          .select("event_id, created_at")
          .gte("created_at", weekStart);

        if (!ordersErr && ordersWeek && ordersWeek.length > 0) {
          // Group counts per event id
          const weekByEvent = new Map<string, number>();
          const todayByEvent = new Map<string, number>();
          for (const row of ordersWeek as { event_id: string; created_at: string }[]) {
            weekByEvent.set(row.event_id, (weekByEvent.get(row.event_id) || 0) + 1);
            if (row.created_at >= todayStart) {
              todayByEvent.set(row.event_id, (todayByEvent.get(row.event_id) || 0) + 1);
            }
          }

          const ids = Array.from(weekByEvent.keys());
          const eventsMap = await fetchEventsByIds(ids);

          const built: TrendingItem[] = ids
            .filter((id) => !!eventsMap[id])
            .map((id) => ({
              event: eventsMap[id],
              weekCount: weekByEvent.get(id) || 0,
              todayCount: todayByEvent.get(id) || 0,
            }))
            .sort((a, b) => (b.todayCount || b.weekCount) - (a.todayCount || a.weekCount))
            .slice(0, 4);

          if (mounted) setItems(built);
          if (mounted) setLoading(false);
          return;
        }

        // 2) Fallback: use favorites in the last 30 days
        const monthStart = daysAgo(30).toISOString();
        const { data: favs, error: favErr } = await supabase
          .from("favorites")
          .select("event_id, created_at")
          .gte("created_at", monthStart);

        if (!favErr && favs && favs.length > 0) {
          const byEvent = new Map<string, number>();
          const todayByEvent = new Map<string, number>();
          for (const row of favs as { event_id: string; created_at: string }[]) {
            byEvent.set(row.event_id, (byEvent.get(row.event_id) || 0) + 1);
            if (row.created_at >= todayStart) {
              todayByEvent.set(row.event_id, (todayByEvent.get(row.event_id) || 0) + 1);
            }
          }

          const ids = Array.from(byEvent.keys());
          const eventsMap = await fetchEventsByIds(ids);

          const built: TrendingItem[] = ids
            .filter((id) => !!eventsMap[id])
            .map((id) => ({
              event: eventsMap[id],
              weekCount: byEvent.get(id) || 0, // treat month as weekCount fallback
              todayCount: todayByEvent.get(id) || 0,
            }))
            .sort((a, b) => (b.todayCount || b.weekCount) - (a.todayCount || a.weekCount))
            .slice(0, 4);

          if (mounted) setItems(built);
          if (mounted) setLoading(false);
          return;
        }

        // 3) Final fallback: just show latest events
        const { data: latest, error: latestErr } = await supabase
          .from("events")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(4);

        if (!latestErr && latest && latest.length > 0) {
          const built: TrendingItem[] = (latest as EventRow[]).map((e) => ({
            event: e,
            todayCount: 0,
            weekCount: 0,
          }));
          if (mounted) setItems(built);
        }
      } catch (e) {
        // In case of unexpected failure, just keep empty list
        console.error("Failed to load trending:", e);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadTrending();
    return () => { mounted = false; };
  }, []);

  const displayItems = useMemo(() => items.map((t, idx) => ({
    rank: idx + 1,
    title: t.event.title,
    image: t.event.image,
    ticketsText: t.todayCount > 0
      ? `${t.todayCount} ticket${t.todayCount === 1 ? "" : "s"} sold today`
      : t.weekCount > 0
        ? `${t.weekCount} sold this week`
        : `Trending pick`,
  })), [items]);

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

        {loading ? (
          <div className="text-muted-foreground py-10">Loading trending events...</div>
        ) : displayItems.length === 0 ? (
          <div className="text-muted-foreground py-10">No trending data yet. Check back soon.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayItems.map((event) => (
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
                  <p className="text-sm text-primary">{event.ticketsText}</p>
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
        )}
      </div>
    </section>
  );
};

export default TrendingSection;
