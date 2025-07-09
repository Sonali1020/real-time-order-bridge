
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, Clock } from 'lucide-react';
import { Order } from '@/types/order';
import { orderService } from '@/services/OrderService';

interface Update {
  id: string;
  orderId: string;
  message: string;
  timestamp: string;
  type: 'success' | 'info' | 'warning';
}

export const RealTimeUpdates: React.FC = () => {
  const [updates, setUpdates] = useState<Update[]>([]);

  useEffect(() => {
    const unsubscribe = orderService.subscribeToUpdates((order: Order) => {
      const newUpdate: Update = {
        id: `update-${Date.now()}`,
        orderId: order.id,
        message: `Order ${order.id} status updated to: ${order.status}`,
        timestamp: new Date().toISOString(),
        type: order.status === 'delivered' ? 'success' : 
              order.status === 'cancelled' ? 'warning' : 'info'
      };
      
      setUpdates(prev => [newUpdate, ...prev.slice(0, 9)]); // Keep last 10 updates
    });

    return unsubscribe;
  }, []);

  const getUpdateColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'info': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Real-Time Updates
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {updates.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No updates yet</p>
              <p className="text-sm">Updates will appear here in real-time</p>
            </div>
          ) : (
            updates.map((update) => (
              <div key={update.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <Badge className={getUpdateColor(update.type)}>
                  {update.type}
                </Badge>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {update.message}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {new Date(update.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
