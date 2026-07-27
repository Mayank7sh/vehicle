// ============================================================
// Inventory & Warehouse - data models (match the backend)
// ============================================================

export enum LocationType {
  Store = 'Store',
  Warehouse = 'Warehouse',
  DC = 'DC'
}

export enum LocationStatus {
  Active = 'Active',
  InActive = 'InActive'
}

export enum SupplierOrderStatus {
  Pending = 'Pending',
  Received = 'Received',
  Cancelled = 'Cancelled'
}

// --- Response shapes (DTOs from the backend) ---
export interface Inventory {
  inventoryId?: number;
  productVariantId: number;
  locationId: number;
  quantityOnHand: number;
  quantityReserved: number;
  reorderLevel: number;
  lastUpdated?: string;
}

export interface Location {
  locationId?: number;
  locationName: string;
  type: LocationType;
  city: string;
  status: LocationStatus;
}

export interface SupplierOrder {
  supplierOrderId?: number;
  supplierId: number;
  productVariantId: number;
  quantityOrdered: number;
  orderDate: string;
  expectedDelivery?: string;
  status: SupplierOrderStatus;
}

// --- Request shapes (POST bodies map onto JPA entities) ---
export interface InventoryCreateRequest {
  productVariant: { variantId: number };
  location: { locationId: number };
  quantityOnHand: number;
  quantityReserved: number;
  reorderLevel: number;
}

export interface SupplierOrderCreateRequest {
  supplierId: number;
  productVariant: { variantId: number };
  quantityOrdered: number;
  orderDate: string;
  expectedDelivery?: string;
  status: SupplierOrderStatus;
}
