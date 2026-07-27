import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShipmentService } from '../../services/shiment.service';
import { Shipment } from '../../models/shipment.model';
import { ShipmentCreateRequest } from '../../models/shipment-create-request.model';
import { ShipmentStatus } from '../../models/shipment-status.enum';


@Component({
  selector: 'app-shipments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shipment.component.html',
  styleUrl: '../../orders.css'
})
export class ShipmentsComponent implements OnInit {
  private shipmentService = inject(ShipmentService);

  statuses = Object.values(ShipmentStatus);
  shipments = signal<Shipment[]>([]);
  pending: Record<number, ShipmentStatus> = {};

  form = this.blankForm();

  loading = signal(false);
  message = signal<string | null>(null);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.shipmentService.getAll().subscribe({
      next: (data) => {
        data.forEach(s => { if (s.shipmentId) this.pending[s.shipmentId] = s.status!; });
        this.shipments.set(data);
        this.loading.set(false);
      },
      error: () => { this.error.set('Could not load shipments.'); this.loading.set(false); }
    });
  }

  create(): void {
    this.message.set(null); this.error.set(null);
    if (!this.form.orderId) { this.error.set('Order ID is required.'); return; }

    const request: ShipmentCreateRequest = {
      order: { orderId: Number(this.form.orderId) },
      trackingNumber: this.form.trackingNumber,
      carrier: this.form.carrier,
      shippedDate: this.form.shippedDate || undefined,
      estimatedDelivery: this.form.estimatedDelivery || undefined,
      status: this.form.status
    };

    this.shipmentService.createShipment(request).subscribe({
      next: () => { this.message.set('Shipment created.'); this.resetForm(); this.load(); },
      error: (err) => this.error.set(err.error?.message || 'Could not create shipment.')
    });
  }

  updateStatus(s: Shipment): void {
    if (!s.shipmentId) return;
    const status = this.pending[s.shipmentId];
    this.shipmentService.updateStatus(s.shipmentId, status).subscribe({
      next: () => { this.message.set('Shipment #' + s.shipmentId + ' → ' + status); this.load(); },
      error: (err) => this.error.set(err.error?.message || 'Could not update status.')
    });
  }

  remove(s: Shipment): void {
    if (!s.shipmentId) return;
    this.shipmentService.deleteShipment(s.shipmentId).subscribe({
      next: () => { this.message.set('Shipment deleted.'); this.load(); },
      error: (err) => this.error.set(err.error?.message || 'Could not delete shipment.')
    });
  }

  resetForm(): void { this.form = this.blankForm(); }

  private blankForm() {
    return {
      orderId: null as number | null,
      trackingNumber: '',
      carrier: '',
      shippedDate: '',
      estimatedDelivery: '',
      status: ShipmentStatus.InTransit
    };
  }

  badgeClass(status?: ShipmentStatus): string {
    switch (status) {
      case ShipmentStatus.Delivered: return 'badge-green';
      case ShipmentStatus.InTransit: return 'badge-blue';
      case ShipmentStatus.Failed: return 'badge-red';
      default: return 'badge-gray';
    }
  }
}
