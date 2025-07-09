
import React from 'react';
import { Order, OrderStatus } from '@/types/order';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, CreditCard, Package, Package2, Truck, CheckCircle, XCircle } from 'lucide-react';

interface OrderStatusTrackerProps {
  order: Order;
}

const statusSteps: { status: OrderStatus; label: string; icon: React.ReactNode }[] = [
  { status: 'pending', label: 'Order Placed', icon: <Clock className="w-5 h-5" /> },
  { status: 'confirmed', label: 'Payment Confirmed', icon: <CreditCard className="w-5 h-5" /> },
  { status: 'processing', label: 'Processing', icon: <Package className="w-5 h-5" /> },
  { status: 'picking', label: 'Picking Items', icon: <Package className="w-5 h-5" /> },
  { status: 'packed', label: 'Packed', icon: <Package2 className="w-5 h-5" /> },
  { status: 'shipped', label: 'Shipped', icon: <Truck className="w-5 h-5" /> },
  { status: 'delivered', label: 'Delivered', icon: <CheckCircle className="w-5 h-5" /> },
];

export const OrderStatusTracker: React.FC<OrderStatusTrackerProps> = ({ order }) => {
  const currentStatusIndex = statusSteps.findIndex(step => step.status === order.status);
  const isCancelled = order.status === 'cancelled';

  if (isCancelled) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <XCircle className="w-5 h-5" />
            Order Cancelled
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <p className="text-lg font-semibold text-red-600">Order {order.id} has been cancelled</p>
            <p className="text-gray-600 mt-2">
              This order was cancelled and any payments will be refunded.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Status Tracker</CardTitle>
        <p className="text-sm text-gray-600">Order {order.id}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {statusSteps.map((step, index) => {
            const isCompleted = index <= currentStatusIndex;
            const isCurrent = index === currentStatusIndex;
            
            return (
              <div key={step.status} className="flex items-center gap-4">
                <div 
                  className={`
                    flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300
                    ${isCompleted 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : isCurrent
                      ? 'bg-blue-500 border-blue-500 text-white animate-pulse'
                      : 'bg-gray-100 border-gray-300 text-gray-400'
                    }
                  `}
                >
                  {step.icon}
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                    {step.label}
                  </p>
                  {isCurrent && (
                    <p className="text-sm text-blue-600 font-medium">Current Status</p>
                  )}
                </div>
                {isCompleted && index < currentStatusIndex && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
              </div>
            );
          })}
        </div>
        
        {order.estimatedDelivery && currentStatusIndex < statusSteps.length - 1 && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-blue-900">Estimated Delivery</p>
            <p className="text-blue-700">
              {new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
