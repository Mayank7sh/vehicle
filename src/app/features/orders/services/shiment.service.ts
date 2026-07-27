import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Shipment } from '../models/shipment.model';
import { ShipmentCreateRequest } from '../models/shipment-create-request.model';
import { ShipmentStatus } from '../models/shipment-status.enum';

@Injectable({ providedIn: 'root' })
export class ShipmentService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:6060/shipments';

  createShipment(shipment: ShipmentCreateRequest): Observable<Shipment> {
    return this.http.post<Shipment>(this.apiUrl, shipment);
  }

  getAll(): Observable<Shipment[]> {
    return this.http.get<Shipment[]>(this.apiUrl);
  }

  getById(id: number): Observable<Shipment> {
    return this.http.get<Shipment>(`${this.apiUrl}/${id}`);
  }

  updateStatus(id: number, status: ShipmentStatus): Observable<Shipment> {
    return this.http.patch<Shipment>(`${this.apiUrl}/${id}/status/${status}`, {});
  }

  track(trackingNumber: string): Observable<Shipment> {
    return this.http.get<Shipment>(`${this.apiUrl}/track/${trackingNumber}`);
  }

  deleteShipment(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
  }
}
