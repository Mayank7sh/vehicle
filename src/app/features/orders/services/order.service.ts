import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/order.model';
import { OrderCreateRequest } from '../models/order-create-request.model';
import { OrderStatus } from '../models/order-status.enum';


@Injectable({ providedIn: 'root' })

export class OrderService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:6060/orders';

  createOrder(order: OrderCreateRequest): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, order);
  }

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  getMyOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/my-orders`);
  }

  getOrdersByStatus(status: OrderStatus): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/status/${status}`);
  }

  getOrdersByCustomer(customerId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/customer/${customerId}`);
  }

  updateStatus(orderId: number, status: OrderStatus): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/${orderId}/status/${status}`, {});
  }

  deleteOrder(orderId: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${orderId}`, { responseType: 'text' });
  }
}
