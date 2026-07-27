import { ShipmentStatus } from "./shipment-status.enum";

export interface Shipment{
    shipmentId:number;
    orderId:number;
    trackingNumber:string;
    carrier:string;
    shippedDate:string;
    estimatedDelivery:string;
    status:ShipmentStatus;
}