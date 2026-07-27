import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inventory } from '../models/inventory.model';
import { InventoryCreateRequest } from '../models/inventory.model';

/** Talks to the /inventory endpoints. */
@Injectable({ providedIn: 'root' })
export class InventoryService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:6060/inventory';

  create(inventory: InventoryCreateRequest): Observable<Inventory> {
    return this.http.post<Inventory>(this.apiUrl, inventory);
  }

  getAll(): Observable<Inventory[]> {
    return this.http.get<Inventory[]>(this.apiUrl);
  }

  getById(id: number): Observable<Inventory> {
    return this.http.get<Inventory>(`${this.apiUrl}/${id}`);
  }

  // Items that have dropped to/under their reorder level.
  getLowStock(): Observable<Inventory[]> {
    return this.http.get<Inventory[]>(`${this.apiUrl}/low-stock`);
  }

  getByLocation(locationId: number): Observable<Inventory[]> {
    return this.http.get<Inventory[]>(`${this.apiUrl}/location/${locationId}`);
  }

  remove(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
  }
}
