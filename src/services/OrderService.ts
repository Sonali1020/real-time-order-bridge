
import { Order, OrderStatus, OrderItem, ServiceResponse } from '@/types/order';

class OrderService {
  private orders: Map<string, Order> = new Map();
  private listeners: Set<(order: Order) => void> = new Set();

  constructor() {
    // Initialize with some sample orders
    this.initializeSampleOrders();
  }

  private initializeSampleOrders() {
    const sampleOrders: Order[] = [
      {
        id: 'ORD-001',
        customerId: 'CUST-001',
        customerName: 'John Smith',
        customerEmail: 'john@example.com',
        items: [
          {
            id: 'ITEM-001',
            productId: 'PROD-001',
            productName: 'Wireless Headphones',
            quantity: 1,
            price: 99.99,
            imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop'
          }
        ],
        totalAmount: 99.99,
        status: 'processing',
        paymentStatus: 'completed',
        createdAt: new Date(Date.now() - 1800000).toISOString(),
        updatedAt: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'ORD-002',
        customerId: 'CUST-002',
        customerName: 'Sarah Johnson',
        customerEmail: 'sarah@example.com',
        items: [
          {
            id: 'ITEM-002',
            productId: 'PROD-002',
            productName: 'Smart Watch',
            quantity: 1,
            price: 299.99,
            imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop'
          }
        ],
        totalAmount: 299.99,
        status: 'confirmed',
        paymentStatus: 'completed',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        updatedAt: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    sampleOrders.forEach(order => this.orders.set(order.id, order));
  }

  createOrder(orderData: Omit<Order, 'id' | 'status' | 'paymentStatus' | 'createdAt' | 'updatedAt'>): ServiceResponse<Order> {
    const orderId = `ORD-${Date.now().toString().slice(-6)}`;
    const order: Order = {
      ...orderData,
      id: orderId,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
    };

    this.orders.set(orderId, order);
    this.notifyListeners(order);
    
    console.log(`[OrderService] Created order: ${orderId}`);
    return { success: true, data: order };
  }

  updateOrderStatus(orderId: string, status: OrderStatus): ServiceResponse<Order> {
    const order = this.orders.get(orderId);
    if (!order) {
      return { success: false, error: 'Order not found' };
    }

    order.status = status;
    order.updatedAt = new Date().toISOString();
    this.orders.set(orderId, order);
    this.notifyListeners(order);
    
    console.log(`[OrderService] Updated order ${orderId} status to: ${status}`);
    return { success: true, data: order };
  }

  getOrder(orderId: string): ServiceResponse<Order> {
    const order = this.orders.get(orderId);
    if (!order) {
      return { success: false, error: 'Order not found' };
    }
    return { success: true, data: order };
  }

  getAllOrders(): Order[] {
    return Array.from(this.orders.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  subscribeToUpdates(callback: (order: Order) => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notifyListeners(order: Order) {
    this.listeners.forEach(listener => listener(order));
  }
}

export const orderService = new OrderService();
