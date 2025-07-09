
import { PaymentResult, ServiceResponse } from '@/types/order';

class PaymentService {
  async processPayment(orderId: string, amount: number, paymentMethod: string): Promise<ServiceResponse<PaymentResult>> {
    console.log(`[PaymentService] Processing payment for order ${orderId}: $${amount}`);
    
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate 95% success rate
    const success = Math.random() > 0.05;
    
    if (success) {
      const transactionId = `TXN-${Date.now().toString().slice(-8)}`;
      console.log(`[PaymentService] Payment successful for order ${orderId}, transaction: ${transactionId}`);
      return {
        success: true,
        data: {
          success: true,
          transactionId
        }
      };
    } else {
      console.log(`[PaymentService] Payment failed for order ${orderId}`);
      return {
        success: true,
        data: {
          success: false,
          error: 'Payment declined by bank'
        }
      };
    }
  }

  async verifyPayment(transactionId: string): Promise<ServiceResponse<boolean>> {
    console.log(`[PaymentService] Verifying payment ${transactionId}`);
    
    // Simulate verification delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Assume all transactions are valid for demo
    return { success: true, data: true };
  }

  async refundPayment(transactionId: string, amount: number): Promise<ServiceResponse<boolean>> {
    console.log(`[PaymentService] Processing refund for transaction ${transactionId}: $${amount}`);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return { success: true, data: true };
  }
}

export const paymentService = new PaymentService();
