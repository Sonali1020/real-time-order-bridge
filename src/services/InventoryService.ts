
import { InventoryItem, ServiceResponse } from '@/types/order';

class InventoryService {
  private inventory: Map<string, InventoryItem> = new Map();
  private listeners: Set<(item: InventoryItem) => void> = new Set();

  constructor() {
    this.initializeInventory();
  }

  private initializeInventory() {
    const items: InventoryItem[] = [
      {
        productId: 'PROD-001',
        productName: 'Wireless Headphones',
        availableStock: 25,
        reservedStock: 3,
        reorderLevel: 10
      },
      {
        productId: 'PROD-002',
        productName: 'Smart Watch',
        availableStock: 15,
        reservedStock: 2,
        reorderLevel: 5
      },
      {
        productId: 'PROD-003',
        productName: 'Bluetooth Speaker',
        availableStock: 30,
        reservedStock: 1,
        reorderLevel: 8
      },
      {
        productId: 'PROD-004',
        productName: 'Laptop Stand',
        availableStock: 8,
        reservedStock: 0,
        reorderLevel: 15
      }
    ];

    items.forEach(item => this.inventory.set(item.productId, item));
  }

  checkAvailability(productId: string, quantity: number): ServiceResponse<boolean> {
    const item = this.inventory.get(productId);
    if (!item) {
      return { success: false, error: 'Product not found' };
    }

    const available = item.availableStock >= quantity;
    console.log(`[InventoryService] Checking availability for ${productId}: ${quantity} requested, ${item.availableStock} available`);
    
    return { success: true, data: available };
  }

  reserveStock(productId: string, quantity: number): ServiceResponse<boolean> {
    const item = this.inventory.get(productId);
    if (!item) {
      return { success: false, error: 'Product not found' };
    }

    if (item.availableStock < quantity) {
      return { success: false, error: 'Insufficient stock' };
    }

    item.availableStock -= quantity;
    item.reservedStock += quantity;
    
    this.inventory.set(productId, item);
    this.notifyListeners(item);
    
    console.log(`[InventoryService] Reserved ${quantity} units of ${productId}`);
    return { success: true, data: true };
  }

  releaseReservation(productId: string, quantity: number): ServiceResponse<boolean> {
    const item = this.inventory.get(productId);
    if (!item) {
      return { success: false, error: 'Product not found' };
    }

    item.availableStock += quantity;
    item.reservedStock = Math.max(0, item.reservedStock - quantity);
    
    this.inventory.set(productId, item);
    this.notifyListeners(item);
    
    console.log(`[InventoryService] Released reservation for ${quantity} units of ${productId}`);
    return { success: true, data: true };
  }

  fulfillOrder(productId: string, quantity: number): ServiceResponse<boolean> {
    const item = this.inventory.get(productId);
    if (!item) {
      return { success: false, error: 'Product not found' };
    }

    if (item.reservedStock < quantity) {
      return { success: false, error: 'Insufficient reserved stock' };
    }

    item.reservedStock -= quantity;
    
    this.inventory.set(productId, item);
    this.notifyListeners(item);
    
    console.log(`[InventoryService] Fulfilled order for ${quantity} units of ${productId}`);
    return { success: true, data: true };
  }

  getInventoryStatus(): InventoryItem[] {
    return Array.from(this.inventory.values());
  }

  subscribeToUpdates(callback: (item: InventoryItem) => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notifyListeners(item: InventoryItem) {
    this.listeners.forEach(listener => listener(item));
  }
}

export const inventoryService = new InventoryService();
