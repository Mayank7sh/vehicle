import { ShipmentStatus } from "./shipment-status.enum";
export interface ShipmentCreateRequest {
  order: { orderId: number };
  trackingNumber: string;
  carrier: string;
  shippedDate?: string;
  estimatedDelivery?: string;
  status: ShipmentStatus;
}