import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Calendar, MapPin, CreditCard, Download, Eye, Home } from 'lucide-react';
import { stripeService, formatPrice } from '@/integrations/stripe';
import { toast } from 'sonner';

interface Order {
  id: string;
  user_id: string;
  event_id: string;
  quantity: number;
  amount_cents: number;
  currency: string;
  status: string;
  payment_method: string;
  created_at: string;
  events: {
    title: string;
    date: string;
    venue: string;
    image: string;
    price: string;
    category: string;
  };
  receipts: {
    id: string;
    receipt_number: string;
  }[];
}

const MyOrders = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }

    if (user) {
      fetchOrders();
    }
  }, [user, authLoading, navigate]);

  const fetchOrders = async () => {
    if (!user) return;

    try {
      const data = await stripeService.getUserOrders(user.id);
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load your orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'processing':
        return 'outline';
      case 'cancelled':
        return 'destructive';
      case 'refunded':
        return 'outline';
      case 'failed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const handleViewOrder = (orderId: string) => {
    navigate(`/order-confirmation?orderId=${orderId}`);
  };

  const handleDownloadReceipt = async (orderId: string, receiptNumber: string) => {
    try {
      // In a real implementation, this would fetch the receipt HTML
      const order = orders.find(o => o.id === orderId);
      if (order?.receipts?.[0]) {
        const blob = new Blob([order.receipts[0].html_content || 'Receipt HTML not available'], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `receipt-${receiptNumber}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        toast.error('Receipt not available');
      }
    } catch (error) {
      toast.error('Failed to download receipt');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Orders</h1>
            <p className="text-muted-foreground">
              View and manage your ticket purchases
            </p>
          </div>
          <Button onClick={() => navigate('/')} variant="outline">
            <Home className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-muted-foreground text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
              <p className="text-muted-foreground mb-6">
                You haven't made any purchases yet. Start browsing events to find something exciting!
              </p>
              <Button onClick={() => navigate('/')} variant="hero">
                Browse Events
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{order.events.title}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {order.events.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {order.events.venue}
                        </span>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <Badge variant={getStatusColor(order.status)}>
                        {order.status.toUpperCase()}
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        Order #{order.id.slice(-8)}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Event Image and Details */}
                    <div className="space-y-3">
                      <img
                        src={order.events.image}
                        alt={order.events.title}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <div className="space-y-1 text-sm">
                        <p className="flex items-center gap-1">
                          <Badge variant="outline">{order.events.category}</Badge>
                        </p>
                        <p className="text-muted-foreground">
                          {order.quantity} ticket{order.quantity > 1 ? 's' : ''} • {order.payment_method.replace('_', ' ')}
                        </p>
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="space-y-3">
                      <h4 className="font-semibold">Order Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Quantity</span>
                          <span>{order.quantity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Payment Method</span>
                          <span className="capitalize">{order.payment_method.replace('_', ' ')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Order Date</span>
                          <span>{new Date(order.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Status</span>
                          <Badge variant={getStatusColor(order.status)} size="sm">
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Total and Actions */}
                    <div className="space-y-3">
                      <h4 className="font-semibold">Total Paid</h4>
                      <div className="text-2xl font-bold">
                        {formatPrice(order.amount_cents, order.currency)}
                      </div>
                      
                      <div className="space-y-2">
                        <Button 
                          onClick={() => handleViewOrder(order.id)}
                          variant="default"
                          className="w-full"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        
                        {order.receipts && order.receipts.length > 0 && (
                          <Button 
                            onClick={() => handleDownloadReceipt(order.id, order.receipts[0].receipt_number)}
                            variant="outline"
                            className="w-full"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download Receipt
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
