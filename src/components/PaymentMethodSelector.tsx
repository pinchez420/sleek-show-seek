

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Smartphone } from 'lucide-react';


export type PaymentMethod = 'card' | 'apple_pay' | 'google_pay' | 'paypal' | 'mpesa';

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onMethodSelect: (method: PaymentMethod) => void;
  disabled?: boolean;
}

interface PaymentMethodOption {
  type: PaymentMethod;
  label: string;
  icon: React.ReactNode;
  description: string;
  available: boolean;
  badge?: string;
}

const paymentMethodOptions: PaymentMethodOption[] = [
  {
    type: 'card',
    label: 'Credit/Debit Card',
    icon: <CreditCard className="h-5 w-5" />,
    description: 'Visa, MasterCard, American Express',
    available: true,
  },
  {
    type: 'apple_pay',
    label: 'Apple Pay',
    icon: <Smartphone className="h-5 w-5" />,
    description: 'Pay with Face ID or Touch ID',
    available: true,
    badge: 'Secure',
  },
  {
    type: 'google_pay',
    label: 'Google Pay',
    icon: <Smartphone className="h-5 w-5" />,
    description: 'Quick and secure mobile payments',
    available: true,
    badge: 'Fast',
  },


  {
    type: 'paypal',
    label: 'PayPal',
    icon: <div className="h-5 w-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">P</div>,
    description: 'Pay with your PayPal account',
    available: true,
  },
  {
    type: 'mpesa',
    label: 'M-Pesa',
    icon: <div className="h-5 w-5 bg-green-600 rounded text-white text-xs flex items-center justify-center font-bold">M</div>,
    description: 'Pay with M-Pesa mobile money',
    available: true,
    badge: 'Popular',
  },
];

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onMethodSelect,
  disabled = false,
}) => {
  const handleMethodClick = (method: PaymentMethod) => {
    if (disabled) return;
    onMethodSelect(method);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Choose Payment Method</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {paymentMethodOptions.map((option) => (
          <Card
            key={option.type}
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedMethod === option.type
                ? 'ring-2 ring-primary border-primary bg-primary/5'
                : 'hover:bg-muted/50'
            } ${!option.available ? 'opacity-50 cursor-not-allowed' : ''} ${
              disabled ? 'cursor-not-allowed' : ''
            }`}
            onClick={() => handleMethodClick(option.type)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    selectedMethod === option.type
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {option.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm">{option.label}</h4>
                    {option.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {option.badge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {option.description}
                  </p>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border-2 ${
                    selectedMethod === option.type
                      ? 'border-primary bg-primary'
                      : 'border-muted-foreground'
                  }`}
                >
                  {selectedMethod === option.type && (
                    <div className="w-full h-full rounded-full bg-primary-foreground scale-50" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {selectedMethod && (
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Selected:</strong>{' '}
            {paymentMethodOptions.find(opt => opt.type === selectedMethod)?.label}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Your payment is secured with industry-standard encryption.
          </p>
        </div>
      )}
    </div>
  );
};

export default PaymentMethodSelector;
