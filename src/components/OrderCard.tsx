
import React from 'react';
import { Order } from '@/types/order';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Package, Truck, CheckCircle, XCircle, CreditCard } from 'lucide-react';

interface OrderCardProps {
  order: Order;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending': return <Clock className="w-4 h-4" />;
    case 'confirmed':
    case 'processing': return <CreditCard className="w-4 h-4" />;
    case 'picking':
    case 'packed': return <Package className="w-4 h-4" />;
    case 'shipped': return <Truck className="w-4 h-4" />;
    case 'delivered': return <CheckCircle className="w-4 h-4" />;
    case 'cancelled': return <XCircle className="w-4 h-4" />;
    default: return <Clock className="w-4 h-4" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'processing': return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'picking':
    case 'packed': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'shipped': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
    case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'processing': return 'bg-blue-100 text-blue-800';
    case 'completed': return 'bg-green-100 text-green-800';
    case 'failed': return 'bg-red-100 text-red-800';
    case 'refunded': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  return (
    <Card className="w-full transition-all duration-200 hover:shadow-lg border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Order {order.id}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">{order.customerName}</p>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <Badge className={`${getStatusColor(order.status)} flex items-center gap-1`}>
              {getStatusIcon(order.status)}
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
            <Badge className={getPaymentStatusColor(order.paymentStatus)}>
              {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total Amount</span>
            <span className="font-semibold text-lg text-green-600">
              ${order.totalAmount.toFixed(2)}
            </span>
          </div>
          
          <div className="space-y-2">
            <span className="text-sm font-medium text-gray-700">Items:</span>
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                {item.imageUrl && (
                  <img 
                    src={item.imageUrl} 
                    alt={item.productName}
                    className="w-10 h-10 rounded object-cover"
                  />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{item.productName}</p>
                  <p className="text-xs text-gray-600">Qty: {item.quantity} × ${item.price}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between items-center text-sm text-gray-600 pt-2 border-t">
            <span>Created</span>
            <span>{new Date(order.createdAt).toLocaleString()}</span>
          </div>
          
          {order.estimatedDelivery && (
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>Est. Delivery</span>
              <span>{new Date(order.estimatedDelivery).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
