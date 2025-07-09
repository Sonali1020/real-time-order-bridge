
import React from 'react';
import { InventoryItem } from '@/types/order';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Package } from 'lucide-react';

interface InventoryStatusProps {
  inventory: InventoryItem[];
}

export const InventoryStatus: React.FC<InventoryStatusProps> = ({ inventory }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          Inventory Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {inventory.map((item) => {
            const isLowStock = item.availableStock <= item.reorderLevel;
            const totalStock = item.availableStock + item.reservedStock;
            
            return (
              <div 
                key={item.productId} 
                className={`p-3 rounded-lg border ${isLowStock ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-gray-50'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.productName}</h4>
                    <p className="text-xs text-gray-600">ID: {item.productId}</p>
                  </div>
                  {isLowStock && (
                    <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Low Stock
                    </Badge>
                  )}
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="text-center">
                    <div className="font-semibold text-green-600">{item.availableStock}</div>
                    <div className="text-xs text-gray-600">Available</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-orange-600">{item.reservedStock}</div>
                    <div className="text-xs text-gray-600">Reserved</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-gray-700">{totalStock}</div>
                    <div className="text-xs text-gray-600">Total</div>
                  </div>
                </div>
                
                {/* Stock level bar */}
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${isLowStock ? 'bg-red-500' : 'bg-green-500'}`}
                      style={{ 
                        width: `${Math.max(10, (item.availableStock / (item.reorderLevel * 2)) * 100)}%` 
                      }}
                    />
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    Reorder at: {item.reorderLevel} units
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
