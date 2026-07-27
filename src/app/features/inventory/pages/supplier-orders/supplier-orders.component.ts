import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupplierOrderService } from '../../services/supplier-order.service';
import { SupplierOrder, SupplierOrderCreateRequest, SupplierOrderStatus } from '../../models/inventory.model';

@Component({
  selector: 'app-supplier-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './supplier-orders.component.html',
  styleUrl: '../../inventory.css'
})
export class SupplierOrdersComponent implements OnInit {
  private supplierOrderService = inject(SupplierOrderService);

  // Expose the enum so the template can reference it (avoids raw strings).
  readonly Status = SupplierOrderStatus;

  orders = signal<SupplierOrder[]>([]);
  form = this.blankForm();

  loading = signal(false);
  message = signal<string | null>(null);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.supplierOrderService.getAll().subscribe({
      next: (data) => { this.orders.set(data); this.loading.set(false); },
      error: () => { this.error.set('Could not load supplier orders.'); this.loading.set(false); }
    });
  }

  create(): void {
    this.message.set(null); this.error.set(null);
    if (!this.form.supplierId || !this.form.productVariantId || !this.form.orderDate) {
      this.error.set('Supplier ID, Variant ID and Order Date are required.');
      return;
    }
    const request: SupplierOrderCreateRequest = {
      supplierId: Number(this.form.supplierId),
      productVariant: { variantId: Number(this.form.productVariantId) },
      quantityOrdered: Number(this.form.quantityOrdered),
      orderDate: this.form.orderDate,
      expectedDelivery: this.form.expectedDelivery || undefined,
      status: SupplierOrderStatus.Pending
    };
    this.supplierOrderService.create(request).subscribe({
      next: () => { this.message.set('Supplier order created.'); this.resetForm(); this.load(); },
      error: (err) => this.error.set(err.error?.message || 'Could not create supplier order.')
    });
  }

  receive(o: SupplierOrder): void {
    if (!o.supplierOrderId) return;
    this.supplierOrderService.receive(o.supplierOrderId).subscribe({
      next: () => { this.message.set('Marked as received.'); this.load(); },
      error: (err) => this.error.set(err.error?.message || 'Could not receive order.')
    });
  }

  cancel(o: SupplierOrder): void {
    if (!o.supplierOrderId) return;
    this.supplierOrderService.cancel(o.supplierOrderId).subscribe({
      next: () => { this.message.set('Order cancelled.'); this.load(); },
      error: (err) => this.error.set(err.error?.message || 'Could not cancel order.')
    });
  }

  remove(o: SupplierOrder): void {
    if (!o.supplierOrderId) return;
    this.supplierOrderService.remove(o.supplierOrderId).subscribe({
      next: () => { this.message.set('Supplier order deleted.'); this.load(); },
      error: (err) => this.error.set(err.error?.message || 'Could not delete order.')
    });
  }

  resetForm(): void { this.form = this.blankForm(); }

  private blankForm() {
    return {
      supplierId: null as number | null,
      productVariantId: null as number | null,
      quantityOrdered: 1,
      orderDate: '',
      expectedDelivery: ''
    };
  }

  badgeClass(status?: SupplierOrderStatus): string {
    switch (status) {
      case SupplierOrderStatus.Received: return 'badge-green';
      case SupplierOrderStatus.Pending: return 'badge-amber';
      case SupplierOrderStatus.Cancelled: return 'badge-red';
      default: return 'badge-gray';
    }
  }
}
