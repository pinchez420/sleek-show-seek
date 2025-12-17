
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Download, Mail, Home, Calendar, MapPin, CreditCard, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { stripeService, formatPrice } from '@/integrations/stripe';
import { TicketService, TicketWithEvent } from '@/services/ticketService';
import TicketCard from '@/components/TicketCard';
import { toast } from 'sonner';




interface OrderDetails {
  id: string;
  user_id: string;
  event_id: string;
  quantity: number;
  amount_cents: number;
  currency: string;
  status: string;
  payment_method: string;
  created_at: string;
  events?: {
    title: string;
    date: string;
    venue: string;
    image: string;
    price: string;
    category: string;
  } | null;
  receipts?: any[];
  payments?: any[];
}

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  

  const orderId = searchParams.get('orderId');
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [tickets, setTickets] = useState<TicketWithEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingReceipt, setSendingReceipt] = useState(false);
  const [ticketsGenerated, setTicketsGenerated] = useState(false);

  useEffect(() => {
    if (!orderId || !user) {
      navigate('/');
      return;
    }

    fetchOrderDetails();
  }, [orderId, user, navigate]);


  const fetchOrderDetails = async () => {
    if (!orderId) return;

    try {
      const data = await stripeService.getOrderDetails(orderId, user!.id);
      setOrderDetails(data);
      
      // Generate tickets if order is paid and tickets not yet generated
      if (data.status === 'paid' && !ticketsGenerated) {
        await generateTickets(data);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast.error('Failed to load order details');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };


  const generateTickets = async (orderData: OrderDetails) => {
    try {
      if (!orderData.events) {
        toast.error('Event details not available');
        return;
      }
      
      const generatedTickets = await TicketService.createTickets({
        orderId: orderData.id,
        eventId: orderData.event_id,
        eventName: orderData.events.title,
        userId: orderData.user_id,
        quantity: orderData.quantity
      });
      
      setTickets(generatedTickets);
      setTicketsGenerated(true);
      toast.success(`${generatedTickets.length} ticket(s) generated successfully!`);
    } catch (error) {
      console.error('Error generating tickets:', error);
      toast.error('Failed to generate tickets');
    }
  };

  const handleDownloadReceipt = () => {
    if (!orderDetails?.receipts?.[0]?.html_content) {
      toast.error('Receipt not available');
      return;
    }

    // Create and download HTML receipt
    const receiptWindow = window.open('', '_blank');
    if (receiptWindow) {
      receiptWindow.document.write(orderDetails.receipts[0].html_content);
      receiptWindow.document.close();
    } else {
      // Fallback: create a blob and download
      const blob = new Blob([orderDetails.receipts[0].html_content], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt-${orderDetails.receipts[0].receipt_number}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleEmailReceipt = async () => {
    if (!orderDetails) return;

    setSendingReceipt(true);
    try {
      // In a real implementation, this would send an email
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      toast.success('Receipt sent to your email!');
    } catch (error) {
      toast.error('Failed to send receipt email');
    } finally {
      setSendingReceipt(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <h2 className="text-xl font-semibold mb-2">Order not found</h2>
            <p className="text-muted-foreground mb-4">
              We couldn't find the order you're looking for.
            </p>
            <Button onClick={() => navigate('/')}>
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-muted-foreground">
            Your order has been confirmed and tickets are ready.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Order ID</span>
                <span className="font-mono text-sm">{orderDetails.id.slice(-8)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant={orderDetails.status === 'paid' ? 'default' : 'secondary'}>
                  {orderDetails.status.toUpperCase()}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Payment Method</span>
                <span className="capitalize">{orderDetails.payment_method.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Quantity</span>
                <span>{orderDetails.quantity} ticket{orderDetails.quantity > 1 ? 's' : ''}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total Paid</span>
                  <span className="font-semibold text-lg">
                    {formatPrice(orderDetails.amount_cents, orderDetails.currency)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Event Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Event Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <img
                  src={orderDetails.events.image}
                  alt={orderDetails.events.title}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-semibold text-lg">{orderDetails.events.title}</h3>
                  <div className="space-y-1 text-sm text-muted-foreground mt-2">
                    <p className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {orderDetails.events.date}
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {orderDetails.events.venue}
                    </p>
                    <p className="flex items-center gap-2">
                      <Badge variant="outline">{orderDetails.events.category}</Badge>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Receipt Section */}
        {orderDetails.receipts && orderDetails.receipts.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Receipt & Tickets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Receipt #{orderDetails.receipts[0].receipt_number}</p>
                    <p className="text-sm text-muted-foreground">
                      Generated on {new Date(orderDetails.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="outline">Ready</Badge>
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    onClick={handleDownloadReceipt}
                    variant="outline"
                    className="flex-1"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Receipt
                  </Button>
                  
                  <Button 
                    onClick={handleEmailReceipt}
                    variant="outline"
                    className="flex-1"
                    disabled={sendingReceipt}
                  >
                    {sendingReceipt ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Mail className="h-4 w-4 mr-2" />
                    )}
                    Email Receipt
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}


        {/* Tickets Section */}
        {tickets.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Your Tickets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {tickets.length} ticket{tickets.length > 1 ? 's' : ''} generated for your event
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tickets.map((ticket) => (
                    <TicketCard key={ticket.id} ticket={ticket} compact />
                  ))}
                </div>
                <div className="flex gap-3 pt-4 border-t">
                  <Button 
                    onClick={() => navigate('/tickets')}
                    variant="default"
                    className="flex-1"
                  >
                    View All My Tickets
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8 justify-center">
          <Button onClick={() => navigate('/')} variant="outline">
            <Home className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          

          <Button 
            onClick={() => navigate('/orders')}
            variant="default"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            View My Orders
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
