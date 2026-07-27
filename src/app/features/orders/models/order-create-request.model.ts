import { OrderChannel } from "./order-channel.enum";
export interface OrderCreateRequest {
  customer: { id: number };
  channel: OrderChannel;
  totalAmount: number;
  discountApplied: number;
  items: {
    productVariant: { variantId: number };
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }[];
}