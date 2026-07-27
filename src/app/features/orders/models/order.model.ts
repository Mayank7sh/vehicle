import {OrderItem} from './order-item.model';
import { OrderStatus } from './order-status.enum';
import { OrderChannel } from './order-channel.enum';
export interface Order {
  orderId: number;
  customerId: number;
  customerName: string;
  customerEmail: string;
  channel: OrderChannel;
  orderDate: string;
  totalAmount: number;
  discountApplied: number;
  status: OrderStatus;
  items: OrderItem[];
}