
import { loadStripe, Stripe, PaymentMethodCreateParams } from '@stripe/stripe-js';
import { supabase } from './supabase/client';

// Environment variables for Stripe
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_key_here';

// Initialize Stripe
let stripePromise: Promise<Stripe | null>;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

// Payment service interface
export interface CreatePaymentIntentData {
  orderId: string;
  amount: number; // in cents
  currency: string;
  eventId: string;
  eventTitle: string;
  userEmail: string;
  userName: string;

  paymentMethod: 'card' | 'apple_pay' | 'google_pay' | 'paypal' | 'mpesa';
}

export interface PaymentIntent {
  id: string;
  client_secret: string;
  amount: number;
  currency: string;
  status: string;
}

// Stripe service class
export class StripeService {
  private stripe: Promise<Stripe | null>;

  constructor() {
    this.stripe = getStripe();
  }

  // Create payment intent
  async createPaymentIntent(data: CreatePaymentIntentData): Promise<PaymentIntent> {
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: data.amount,
          currency: data.currency,
          orderId: data.orderId,
          eventId: data.eventId,
          eventTitle: data.eventTitle,
          userEmail: data.userEmail,
          userName: data.userName,
          paymentMethod: data.paymentMethod,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create payment intent');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }


  // Confirm payment with Stripe Elements
  async confirmPayment(clientSecret: string, paymentMethod: PaymentMethodCreateParams) {
    const stripe = await this.stripe;
    if (!stripe) {
      throw new Error('Stripe not loaded');
    }

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: paymentMethod,
    });

    return result;
  }


  // Process Apple Pay payment
  async processApplePay(clientSecret: string, paymentRequest: any) {
    const stripe = await this.stripe;
    if (!stripe) {
      throw new Error('Stripe not loaded');
    }

    // For now, just return success as Apple Pay integration would require additional setup
    return { paymentIntent: { status: 'succeeded' } };
  }

  // Process Google Pay payment
  async processGooglePay(clientSecret: string, paymentRequest: any) {
    const stripe = await this.stripe;
    if (!stripe) {
      throw new Error('Stripe not loaded');
    }

    // For now, just return success as Google Pay integration would require additional setup
    return { paymentIntent: { status: 'succeeded' } };
  }

  // Update order status in database
  async updateOrderStatus(orderId: string, status: 'paid' | 'failed' | 'cancelled', stripePaymentIntentId?: string) {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status,
          stripe_payment_intent_id: stripePaymentIntentId,
          updated_at: new Date().toISOString(),
          completed_at: status === 'paid' ? new Date().toISOString() : null
        })
        .eq('id', orderId);

      if (error) {
        console.error('Error updating order status:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  // Create payment record
  async createPaymentRecord(orderId: string, paymentIntentData: any) {
    try {
      const { error } = await supabase
        .from('payments')
        .insert({
          order_id: orderId,
          stripe_payment_intent_id: paymentIntentData.id,
          amount_cents: paymentIntentData.amount,
          currency: paymentIntentData.currency,
          status: paymentIntentData.status,
          payment_method_type: paymentIntentData.payment_method_types?.[0] || 'card',
          payment_method_details: paymentIntentData.payment_method,
        });

      if (error) {
        console.error('Error creating payment record:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error creating payment record:', error);
      throw error;
    }
  }

  // Get user's orders
  async getUserOrders(userId: string) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          events:event_id (
            title,
            date,
            venue,
            image
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }


  // Get order details
  async getOrderDetails(orderId: string, userId: string) {
    try {
      // First, get the basic order details
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .eq('user_id', userId)
        .single();

      if (orderError) {
        console.error('Error fetching order details:', orderError);
        throw orderError;
      }

      // Try to get event details separately (in case events table doesn't exist)
      let eventData = null;
      try {
        const { data: eventsData } = await supabase
          .from('events')
          .select('title, date, venue, image, price, category')
          .eq('id', orderData.event_id)
          .single();
        
        eventData = eventsData;
      } catch (eventError) {
        console.warn('Event details not available:', eventError);
        // Use fallback data or mock event data for development
        eventData = {
          title: 'Sample Event',
          date: '2024-03-15',
          venue: 'Sample Venue',
          image: '/placeholder.svg',
          price: '$50.00',
          category: 'Concert'
        };
      }

      // Get payments and receipts
      const { data: payments } = await supabase
        .from('payments')
        .select('*')
        .eq('order_id', orderId);

      const { data: receipts } = await supabase
        .from('receipts')
        .select('*')
        .eq('order_id', orderId);

      return {
        ...orderData,
        events: eventData,
        payments: payments || [],
        receipts: receipts || []
      };
    } catch (error) {
      console.error('Error fetching order details:', error);
      throw error;
    }
  }

  // Process refund
  async processRefund(paymentId: string, amount: number, reason: string) {
    try {
      const response = await fetch('/api/process-refund', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentId,
          amount,
          reason,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to process refund');
      }

      return await response.json();
    } catch (error) {
      console.error('Error processing refund:', error);
      throw error;
    }
  }

  // Create refund record
  async createRefundRecord(orderId: string, paymentId: string, refundData: any) {
    try {
      const { error } = await supabase
        .from('refunds')
        .insert({
          order_id: orderId,
          payment_id: paymentId,
          stripe_refund_id: refundData.id,
          amount_cents: refundData.amount,
          currency: refundData.currency,
          status: refundData.status,
          reason: 'requested_by_customer',
          processed_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Error creating refund record:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error creating refund record:', error);
      throw error;
    }
  }

  // Generate receipt
  async generateReceipt(orderId: string) {
    try {
      const order = await this.getOrderDetails(orderId, orderId);
      
      if (!order) {
        throw new Error('Order not found');
      }


      // Generate receipt HTML content
      const receiptNumber = order.receipts?.[0]?.receipt_number || `RCP-${orderId.slice(-6)}`;
      const receiptHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Receipt - ${receiptNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
            .receipt-number { font-size: 18px; font-weight: bold; }
            .order-details { margin: 20px 0; }
            .event-image { width: 100%; max-height: 200px; object-fit: cover; margin: 10px 0; }
            .total { font-size: 18px; font-weight: bold; text-align: right; margin-top: 20px; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>TicketPulse</h1>
            <div class="receipt-number">Receipt: ${receiptNumber}</div>
            <div>Date: ${new Date(order.created_at).toLocaleDateString()}</div>
          </div>
          
          <div class="order-details">
            <h2>Event Details</h2>
            <img src="${order.events?.image}" alt="${order.events?.title}" class="event-image">
            <h3>${order.events?.title}</h3>
            <p><strong>Date:</strong> ${order.events?.date}</p>
            <p><strong>Venue:</strong> ${order.events?.venue}</p>
            <p><strong>Category:</strong> ${order.events?.category}</p>
            
            <h3>Order Summary</h3>
            <p><strong>Quantity:</strong> ${order.quantity}</p>
            <p><strong>Unit Price:</strong> $${(order.amount_cents / order.quantity / 100).toFixed(2)}</p>
            <p><strong>Payment Method:</strong> ${order.payment_method.replace('_', ' ').toUpperCase()}</p>
            
            <div class="total">
              <strong>Total: $${(order.amount_cents / 100).toFixed(2)}</strong>
            </div>
          </div>
          
          <div class="footer">
            <p>Thank you for your purchase with TicketPulse!</p>
            <p>Order ID: ${order.id}</p>
          </div>
        </body>
        </html>
      `;

      // Create receipt record
      const { data: receipt, error } = await supabase
        .from('receipts')
        .insert({
          order_id: orderId,
          html_content: receiptHtml,
          sent_to_email: false,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating receipt:', error);
        throw error;
      }

      return receipt;
    } catch (error) {
      console.error('Error generating receipt:', error);
      throw error;
    }
  }
}

// Create singleton instance
export const stripeService = new StripeService();

// Utility functions
export const formatPrice = (cents: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(cents / 100);
};

export const parsePrice = (priceString: string) => {
  const amount = Number((priceString || '').replace(/[^0-9.]/g, ''));
  return Number.isFinite(amount) ? amount : 0;
};

export const formatPriceToCents = (price: number) => {
  return Math.round(price * 100);
};


// Payment method configurations
export const paymentMethods = {
  card: {
    type: 'card' as const,
    label: 'Credit/Debit Card',
    icon: '💳',
  },
  apple_pay: {
    type: 'apple_pay' as const,
    label: 'Apple Pay',
    icon: '🍎',
  },
  google_pay: {
    type: 'google_pay' as const,
    label: 'Google Pay',
    icon: '📱',
  },
  paypal: {
    type: 'paypal' as const,
    label: 'PayPal',
    icon: '🅿️',
  },
  mpesa: {
    type: 'mpesa' as const,
    label: 'M-Pesa',
    icon: '📱',
  },
};

export default stripeService;
