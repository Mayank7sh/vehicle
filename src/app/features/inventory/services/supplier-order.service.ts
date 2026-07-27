import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SupplierOrder, SupplierOrderCreateRequest } from '../models/inventory.model';


/** Talks to the /supplier-orders endpoints (replenishment). */
@Injectable({ providedIn: 'root' })
export class SupplierOrderService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:6060/supplier-orders';

  create(order: SupplierOrderCreateRequest): Observable<SupplierOrder> {
    return this.http.post<SupplierOrder>(this.apiUrl, order);
  }

  getAll(): Observable<SupplierOrder[]> {
    return this.http.get<SupplierOrder[]>(this.apiUrl);
  }

  getById(id: number): Observable<SupplierOrder> {
    return this.http.get<SupplierOrder>(`${this.apiUrl}/${id}`);
  }

  update(id: number, order: SupplierOrderCreateRequest): Observable<SupplierOrder> {
    return this.http.put<SupplierOrder>(`${this.apiUrl}/${id}`, order);
  }

  // Mark the supplier order as received (backend also tops up stock).
  receive(id: number): Observable<SupplierOrder> {
    return this.http.patch<SupplierOrder>(`${this.apiUrl}/${id}/receive`, {});
  }

  cancel(id: number): Observable<SupplierOrder> {
    return this.http.patch<SupplierOrder>(`${this.apiUrl}/${id}/cancel`, {});
  }

  remove(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
  }
}
