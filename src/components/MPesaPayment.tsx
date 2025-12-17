import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Smartphone, Phone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface MPesaPaymentProps {
  orderId: string;
  amount: number;
  currency: string;
  onPaymentSuccess: (paymentData: MPesaPaymentResult) => void;
  onPaymentError: (error: string) => void;
  eventTitle: string;
}

interface MPesaPaymentData {
  phone: string;
  email: string;
}

interface MPesaPaymentResult {
  paymentMethod: string;
  amount: number;
  currency: string;
  phone: string;
  email: string;
}

export const MPesaPayment: React.FC<MPesaPaymentProps> = ({
  orderId,
  amount,
  currency,
  onPaymentSuccess,
  onPaymentError,
  eventTitle,
}) => {
  const [paymentData, setPaymentData] = useState<MPesaPaymentData>({
    phone: '',
    email: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'form' | 'processing' | 'confirm'>('form');

  const formatPhoneNumber = (phone: string): string => {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Handle Kenyan phone numbers
    if (cleaned.startsWith('254')) {
      return cleaned;
    } else if (cleaned.startsWith('0')) {
      return '254' + cleaned.substring(1);
    } else if (cleaned.startsWith('7') || cleaned.startsWith('1')) {
      return '254' + cleaned;
    }
    
    return cleaned;
  };

  const validatePhoneNumber = (phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 10 && cleaned.length <= 13;
  };

  const handleInputChange = (field: keyof MPesaPaymentData, value: string) => {
    setPaymentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const initiateMPesaPayment = async () => {
    if (!paymentData.phone || !paymentData.email) {
      toast.error('Please fill in all fields');
      return;
    }

    const formattedPhone = formatPhoneNumber(paymentData.phone);
    if (!validatePhoneNumber(formattedPhone)) {
      toast.error('Please enter a valid phone number');
      return;
    }

    setIsProcessing(true);
    setStep('processing');

    try {
      // Create M-Pesa payment record in database
      const { data: paymentRecord, error: paymentError } = await supabase
        .from('payments')
        .insert({
          order_id: orderId,
          amount_cents: amount,
          currency: currency,
          status: 'processing',
          payment_method_type: 'mpesa',
          payment_method_details: {
            phone: formattedPhone,
            email: paymentData.email,
            payment_method: 'mpesa'
          }
        })
        .select()
        .single();

      if (paymentError) {
        throw new Error('Failed to create payment record');
      }

      // Update order status to processing
      const { error: orderError } = await supabase
        .from('orders')
        .update({
          status: 'processing',
          payment_method: 'mpesa'
        })
        .eq('id', orderId);

      if (orderError) {
        throw new Error('Failed to update order status');
      }

      // Simulate M-Pesa STK push initiation
      // In a real implementation, this would call your backend API
      // which would then call Safaricom's M-Pesa API
      setTimeout(() => {
        setStep('confirm');
        setIsProcessing(false);
        
        toast.success('M-Pesa payment initiated!', {
          description: `Please check your phone (${formattedPhone}) for the M-Pesa prompt`,
          duration: 5000,
        });
      }, 2000);

    } catch (error) {
      console.error('M-Pesa payment error:', error);
      setIsProcessing(false);
      setStep('form');
      onPaymentError('Failed to initiate M-Pesa payment. Please try again.');
    }
  };

  const simulatePaymentConfirmation = async () => {
    try {
      // In a real implementation, this would be called when M-Pesa sends
      // a callback to your backend indicating successful payment
      
      // Update payment status to succeeded
      const { error: paymentError } = await supabase
        .from('payments')
        .update({
          status: 'succeeded',
          completed_at: new Date().toISOString()
        })
        .eq('order_id', orderId);

      if (paymentError) {
        throw new Error('Failed to update payment status');
      }

      // Update order status to paid
      const { error: orderError } = await supabase
        .from('orders')
        .update({
          status: 'paid',
          completed_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (orderError) {
        throw new Error('Failed to update order status');
      }

      onPaymentSuccess({
        paymentMethod: 'mpesa',
        amount: amount,
        currency: currency,
        phone: formatPhoneNumber(paymentData.phone),
        email: paymentData.email
      });

    } catch (error) {
      console.error('Payment confirmation error:', error);
      onPaymentError('Payment confirmation failed. Please contact support.');
    }
  };

  if (step === 'processing') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <div>
              <h3 className="font-semibold">Initiating M-Pesa Payment</h3>
              <p className="text-sm text-muted-foreground">
                Setting up payment for {formatCurrency(amount, currency)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === 'confirm') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-green-600" />
            Check Your Phone
          </CardTitle>
          <CardDescription>
            Please complete the payment on your M-Pesa app
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Phone className="h-4 w-4" />
            <AlertDescription>
              <strong>Action Required:</strong> Check your phone for the M-Pesa prompt and complete the payment.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              <strong>Amount:</strong> {formatCurrency(amount, currency)}
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Phone:</strong> {formatPhoneNumber(paymentData.phone)}
            </p>
          </div>

          <div className="space-y-2">
            <Button 
              onClick={simulatePaymentConfirmation}
              className="w-full"
              variant="hero"
            >
              I've Completed the Payment
            </Button>
            <Button 
              onClick={() => {
                setStep('form');
                setIsProcessing(false);
              }}
              variant="outline"
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="h-6 w-6 bg-green-600 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">M</span>
          </div>
          M-Pesa Payment
        </CardTitle>
        <CardDescription>
          Pay securely with M-Pesa mobile money
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="phone">M-Pesa Phone Number</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="phone"
              type="tel"
              placeholder="e.g., 0712345678 or 254712345678"
              value={paymentData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="pl-10"
              disabled={isProcessing}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Enter your M-Pesa registered phone number
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={paymentData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            disabled={isProcessing}
          />
        </div>

        <div className="bg-muted/50 p-3 rounded-lg">
          <p className="text-sm">
            <strong>Amount:</strong> {formatCurrency(amount, currency)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            You'll receive an M-Pesa prompt on your phone to complete the payment
          </p>
        </div>

        <Button
          onClick={initiateMPesaPayment}
          disabled={isProcessing || !paymentData.phone || !paymentData.email}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Smartphone className="mr-2 h-4 w-4" />
              Pay with M-Pesa
            </>
          )}
        </Button>

        <div className="text-xs text-muted-foreground text-center">
          <p>✓ Secure M-Pesa payment</p>
          <p>✓ Instant confirmation</p>
        </div>
      </CardContent>
    </Card>
  );
};

// Utility function to format currency
const formatCurrency = (amount: number, currency: string = 'KES'): string => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: currency,
  }).format(amount / 100);
};

export default MPesaPayment;
