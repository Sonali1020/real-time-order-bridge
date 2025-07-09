
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { OrderCard } from '@/components/OrderCard';
import { InventoryStatus } from '@/components/InventoryStatus';
import { CreateOrderForm } from '@/components/CreateOrderForm';
import { OrderStatusTracker } from '@/components/OrderStatusTracker';
import { RealTimeUpdates } from '@/components/RealTimeUpdates';
import { orderService } from '@/services/OrderService';
import { inventoryService } from '@/services/InventoryService';
import { Order, InventoryItem } from '@/types/order';
import { ShoppingCart, Package, TrendingUp, Users, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Load initial data
    loadData();

    // Subscribe to order updates
    const unsubscribeOrders = orderService.subscribeToUpdates((updatedOrder: Order) => {
      setOrders(prev => prev.map(order => 
        order.id === updatedOrder.id ? updatedOrder : order
      ));
      
      // Update selected order if it's the one that changed
      if (selectedOrder?.id === updatedOrder.id) {
        setSelectedOrder(updatedOrder);
      }
    });

    // Subscribe to inventory updates
    const unsubscribeInventory = inventoryService.subscribeToUpdates((updatedItem: InventoryItem) => {
      setInventory(prev => prev.map(item => 
        item.productId === updatedItem.productId ? updatedItem : item
      ));
    });

    return () => {
      unsubscribeOrders();
      unsubscribeInventory();
    };
  }, [selectedOrder?.id]);

  const loadData = async () => {
    setIsRefreshing(true);
    try {
      const allOrders = orderService.getAllOrders();
      const inventoryStatus = inventoryService.getInventoryStatus();
      
      setOrders(allOrders);
      setInventory(inventoryStatus);
      
      // Set first order as selected if none selected
      if (!selectedOrder && allOrders.length > 0) {
        setSelectedOrder(allOrders[0]);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const getOrderStats = () => {
    const totalOrders = orders.length;
    const activeOrders = orders.filter(o => !['delivered', 'cancelled'].includes(o.status)).length;
    const totalRevenue = orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, order) => sum + order.totalAmount, 0);
    
    return { totalOrders, activeOrders, totalRevenue };
  };

  const stats = getOrderStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Real-Time E-Commerce Order Processing System
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Service-Oriented Architecture for Order Management, Payment Processing & Inventory Control
          </p>
          
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.totalOrders}</p>
                </div>
                <ShoppingCart className="w-8 h-8 text-blue-500" />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm text-gray-600">Active Orders</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.activeOrders}</p>
                </div>
                <Package className="w-8 h-8 text-orange-500" />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm text-gray-600">Revenue</p>
                  <p className="text-2xl font-bold text-green-600">${stats.totalRevenue.toFixed(2)}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm text-gray-600">Low Stock Items</p>
                  <p className="text-2xl font-bold text-red-600">
                    {inventory.filter(item => item.availableStock <= item.reorderLevel).length}
                  </p>
                </div>
                <Users className="w-8 h-8 text-red-500" />
              </CardContent>
            </Card>
          </div>

          <Button 
            onClick={loadData} 
            disabled={isRefreshing}
            className="mb-6"
            variant="outline"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="create">Create Order</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="tracking">Tracking</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {orders.slice(0, 3).map((order) => (
                        <div 
                          key={order.id} 
                          className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{order.id}</span>
                            <Badge className={
                              order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                              order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-blue-100 text-blue-800'
                            }>
                              {order.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{order.customerName}</p>
                          <p className="text-sm font-semibold text-green-600">
                            ${order.totalAmount.toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <RealTimeUpdates />
              </div>

              <div className="space-y-6">
                <InventoryStatus inventory={inventory} />
                
                {selectedOrder && (
                  <OrderStatusTracker order={selectedOrder} />
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {orders.map((order) => (
                <div 
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className="cursor-pointer"
                >
                  <OrderCard order={order} />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="create" className="space-y-6">
            <div className="max-w-2xl mx-auto">
              <CreateOrderForm />
            </div>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-6">
            <InventoryStatus inventory={inventory} />
          </TabsContent>

          <TabsContent value="tracking" className="space-y-6">
            {selectedOrder ? (
              <div className="max-w-2xl mx-auto">
                <OrderStatusTracker order={selectedOrder} />
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Order Selected
                  </h3>
                  <p className="text-gray-600">
                    Select an order from the Orders tab to track its status.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
