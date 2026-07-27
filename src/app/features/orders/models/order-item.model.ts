import {OrderItemStatus} from './order-item-status.enum';

export interface OrderItem{
    orderItemId:number;
    orderId:number;
    productVariantId:number;
    quantity:number;
    unitPrice:number;
    lineTotal:number;
    status:OrderItemStatus;
}