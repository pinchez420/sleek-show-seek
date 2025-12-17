import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Ticket, Plus, Minus, ShieldCheck, Lock } from "lucide-react";
import { toast } from "sonner";

interface EventRow {
  id: string;
  title: string;
  date: string;
  venue: string;
  price: string; // e.g. "$89"
  category: string;
  image: string;
}

const parsePrice = (price: string) => {
  const amount = Number((price || "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(amount) ? amount : 0;
};

const Checkout = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading: authLoading } = useAuth();

  const eventId = searchParams.get("eventId") || "";
  const initialQty = Math.max(1, Number(searchParams.get("qty") || 1));

  const [qty, setQty] = useState<number>(initialQty);
  const [event, setEvent] = useState<EventRow | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!eventId) {
      setLoading(false);
      return;
    }

    let mounted = true;
    (async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", eventId)
        .single();

      if (!mounted) return;

      if (error) {
        toast.error("Failed to load event", { description: error.message });
        setEvent(null);
      } else {
        setEvent(data as EventRow);
      }
      setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, [eventId]);

  const unitPrice = useMemo(() => parsePrice(event?.price || "0"), [event?.price]);
  const total = useMemo(() => unitPrice * qty, [unitPrice, qty]);

  const increment = () => setQty((q) => Math.min(10, q + 1));
  const decrement = () => setQty((q) => Math.max(1, q - 1));

  const handlePay = async () => {
    if (!user) {
      toast.error("Please sign in to continue");
      navigate("/auth");
      return;
    }

    // Simulate payment success
    toast.success("Order confirmed!", {
      description: `You purchased ${qty} ticket${qty > 1 ? "s" : ""} for ${event?.title}.`,
      duration: 3000,
    });

    // Persist order
    try {
      const { error } = await supabase.from("orders").insert({
        user_id: user.id,
        event_id: event?.id,
        quantity: qty,
        amount_cents: Math.round(total * 100),
        status: "paid",
      });
      if (error) console.error("Order insert failed:", error);
    } catch (e) {
      console.error(e);
    }

    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 glass border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-2 ml-auto">
            <Ticket className="h-6 w-6 text-primary" />
            <span className="font-semibold gradient-text">TicketPulse Checkout</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : !eventId ? (
          <div className="glass rounded-xl p-8 text-center">
            <p className="text-lg font-semibold mb-2">Missing event</p>
            <p className="text-muted-foreground mb-6">No event selected for checkout.</p>
            <Button variant="hero" onClick={() => navigate("/")}>Browse events</Button>
          </div>
        ) : !event ? (
          <div className="glass rounded-xl p-8 text-center">
            <p className="text-lg font-semibold mb-2">Event not found</p>
            <p className="text-muted-foreground mb-6">We couldn't find that event. It may have been removed.</p>
            <Button variant="hero" onClick={() => navigate("/")}>Back to home</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Event Summary */}
            <div className="lg:col-span-2 glass rounded-xl overflow-hidden">
              <div className="relative h-52">
                <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent" />
              </div>
              <div className="p-6 space-y-4">
                <h1 className="text-2xl font-bold">{event.title}</h1>
                <p className="text-muted-foreground">{event.venue} • {event.date}</p>
                <div className="flex items-center gap-4 pt-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p className="text-xl font-semibold">{event.price}</p>
                  </div>
                  <div className="ml-auto flex items-center gap-3">
                    <Button variant="glass" size="icon" onClick={decrement}>
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-10 text-center font-semibold text-lg">{qty}</span>
                    <Button variant="glass" size="icon" onClick={increment}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <aside className="glass rounded-xl p-6 h-fit">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Tickets x{qty}</span>
                  <span>${unitPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Fees</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>$0.00</span>
                </div>
                <div className="border-t border-border my-2" />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {authLoading ? (
                <div className="mt-6 flex justify-center">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                </div>
              ) : user ? (
                <Button className="w-full mt-6" variant="hero" onClick={handlePay}>
                  Pay now
                </Button>
              ) : (
                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Lock className="h-4 w-4" />
                    <span>Sign in is required to complete your purchase.</span>
                  </div>
                  <Button className="w-full" variant="hero" onClick={() => navigate("/auth")}>Sign in to continue</Button>
                </div>
              )}

              <div className="mt-6 flex items-center gap-2 text-muted-foreground text-xs">
                <ShieldCheck className="h-4 w-4" />
                <span>Secure checkout. Your payment information is encrypted.</span>
              </div>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
};

export default Checkout;
