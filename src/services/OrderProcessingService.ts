
import { orderService } from './OrderService';
import { paymentService } from './PaymentService';
import { inventoryService } from './InventoryService';
import { Order, OrderStatus } from '@/types/order';

class OrderProcessingService {
  async processNewOrder(order: Order): Promise<void> {
    console.log(`[OrderProcessingService] Starting processing for order ${order.id}`);
    
    try {
      // Step 1: Reserve inventory
      for (const item of order.items) {
        const reservationResult = inventoryService.reserveStock(item.productId, item.quantity);
        if (!reservationResult.success) {
          await this.handleOrderFailure(order, `Inventory reservation failed: ${reservationResult.error}`);
          return;
        }
      }

      // Step 2: Process payment
      orderService.updateOrderStatus(order.id, 'processing');
      const paymentResult = await paymentService.processPayment(
        order.id, 
        order.totalAmount, 
        'credit_card'
      );

      if (!paymentResult.success || !paymentResult.data?.success) {
        await this.handlePaymentFailure(order, paymentResult.data?.error || 'Payment processing failed');
        return;
      }

      // Step 3: Confirm order
      orderService.updateOrderStatus(order.id, 'confirmed');
      
      // Step 4: Start fulfillment process
      this.startFulfillmentProcess(order);
      
    } catch (error) {
      console.error(`[OrderProcessingService] Error processing order ${order.id}:`, error);
      await this.handleOrderFailure(order, 'Unexpected error during processing');
    }
  }

  private async handlePaymentFailure(order: Order, error: string): Promise<void> {
    console.log(`[OrderProcessingService] Payment failed for order ${order.id}: ${error}`);
    
    // Release inventory reservations
    for (const item of order.items) {
      inventoryService.releaseReservation(item.productId, item.quantity);
    }
    
    orderService.updateOrderStatus(order.id, 'cancelled');
  }

  private async handleOrderFailure(order: Order, error: string): Promise<void> {
    console.log(`[OrderProcessingService] Order failed ${order.id}: ${error}`);
    orderService.updateOrderStatus(order.id, 'cancelled');
  }

  private async startFulfillmentProcess(order: Order): Promise<void> {
    console.log(`[OrderProcessingService] Starting fulfillment for order ${order.id}`);
    
    // Simulate fulfillment steps with delays
    const fulfillmentSteps: { status: OrderStatus; delay: number }[] = [
      { status: 'picking', delay: 3000 },
      { status: 'packed', delay: 2000 },
      { status: 'shipped', delay: 1000 }
    ];

    for (const step of fulfillmentSteps) {
      await new Promise(resolve => setTimeout(resolve, step.delay));
      orderService.updateOrderStatus(order.id, step.status);
      
      if (step.status === 'packed') {
        // Fulfill inventory when packed
        for (const item of order.items) {
          inventoryService.fulfillOrder(item.productId, item.quantity);
        }
      }
    }

    // Simulate delivery (longer delay)
    setTimeout(() => {
      orderService.updateOrderStatus(order.id, 'delivered');
    }, 10000);
  }
}

export const orderProcessingService = new OrderProcessingService();
