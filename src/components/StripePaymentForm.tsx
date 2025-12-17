import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { PaymentMethod } from './PaymentMethodSelector';

interface StripePaymentFormProps {
  clientSecret: string;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
  paymentMethod: PaymentMethod;
}

const StripePaymentForm: React.FC<StripePaymentFormProps> = ({
  clientSecret,
  onSuccess,
  onError,
  paymentMethod,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      onError('Stripe has not loaded yet. Please try again.');
      return;
    }

    setIsLoading(true);

    try {
      // Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
        redirect: 'if_required',
      });


      if (error) {
        onError(error.message || 'Payment failed. Please try again.');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        setIsComplete(true);
        toast.success('Payment successful!');
        onSuccess(paymentIntent.id);
      } else {
        onError('Payment was not completed. Please try again.');
      }
    } catch (err) {
      console.error('Payment error:', err);
      onError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // For Apple Pay and Google Pay
  const handleWalletPayment = async () => {
    if (!stripe) {
      onError('Stripe has not loaded yet. Please try again.');
      return;
    }

    setIsLoading(true);

    try {
      // Create payment request for wallet payments
      const { error: confirmError } = await stripe.confirmCardPayment(clientSecret);

      if (confirmError) {
        onError(confirmError.message || 'Wallet payment failed.');
      } else {
        // For wallet payments, we need to handle the payment result differently
        toast.success('Wallet payment processing...');
        onSuccess('wallet_payment'); // Temporary ID for wallet payments
      }
    } catch (err) {
      console.error('Wallet payment error:', err);
      onError('Wallet payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderPaymentElement = () => {
    if (paymentMethod === 'apple_pay' || paymentMethod === 'google_pay') {
      return (
        <div className="text-center space-y-4">
          <div className="p-6 border rounded-lg bg-muted/20">
            <div className="text-2xl mb-2">
              {paymentMethod === 'apple_pay' ? '🍎' : '📱'}
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Complete payment using {paymentMethod === 'apple_pay' ? 'Apple Pay' : 'Google Pay'}
            </p>
            <Button
              onClick={handleWalletPayment}
              disabled={!stripe || isLoading}
              className="w-full"
              variant="hero"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pay with {paymentMethod === 'apple_pay' ? 'Apple Pay' : 'Google Pay'}
                </>
              )}
            </Button>
          </div>
        </div>
      );
    }

    if (paymentMethod === 'paypal') {
      return (
        <div className="text-center space-y-4">
          <div className="p-6 border rounded-lg bg-muted/20">
            <div className="text-2xl mb-2">🅿️</div>
            <p className="text-sm text-muted-foreground mb-4">
              You'll be redirected to PayPal to complete your payment
            </p>
            <Button
              onClick={handleWalletPayment}
              disabled={!stripe || isLoading}
              className="w-full"
              variant="hero"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pay with PayPal
                </>
              )}
            </Button>
          </div>
        </div>
      );
    }

    // Regular card payment
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <PaymentElement
          options={{
            layout: 'tabs',
            paymentMethodOrder: ['card', 'apple_pay', 'google_pay'],
          }}
        />
        
        <Button
          type="submit"
          disabled={!stripe || isLoading}
          className="w-full"
          variant="hero"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4 mr-2" />
              Pay Now
            </>
          )}
        </Button>
      </form>
    );
  };

  if (isComplete) {
    return (
      <div className="text-center space-y-4 py-8">
        <div className="text-green-500 text-4xl mb-4">✓</div>
        <h3 className="text-lg font-semibold">Payment Complete!</h3>
        <p className="text-sm text-muted-foreground">
          Your payment has been processed successfully.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Payment Details</h3>
      
      {renderPaymentElement()}
      
      <div className="text-xs text-muted-foreground text-center">
        <p>Your payment is secured with 256-bit SSL encryption.</p>
        <p className="mt-1">
          By completing this payment, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default StripePaymentForm;
