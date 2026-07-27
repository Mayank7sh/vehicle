import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';
import { OrderStatus } from '../../models/order-status.enum';


@Component({
  selector: 'app-orders-pipeline',
  standalone: true,
  imports: [CommonModule, FormsModule],
   templateUrl: './orders-pipeline.component.html',
  styleUrl: '../../orders.css'
})
export class OrdersPipelineComponent implements OnInit {
  private orderService = inject(OrderService);

  statuses = Object.values(OrderStatus);
  orders = signal<Order[]>([]);
  filter = signal<'All' | OrderStatus>('All');

  // Holds the status chosen in each row's dropdown, keyed by order id.
  pending: Record<number, OrderStatus> = {};

  loading = signal(false);
  message = signal<string | null>(null);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.load();
  }

  // Load every order by asking for each status and merging the results.
  // (The /orders/status/{status} endpoint is open to all staff roles.)
  load(): void {
    this.loading.set(true);
    this.error.set(null);
    forkJoin(this.statuses.map(s => this.orderService.getOrdersByStatus(s))).subscribe({
      next: (lists) => {
        const all = lists.flat();
        all.forEach(o => { if (o.orderId) this.pending[o.orderId] = o.status!; });
        this.orders.set(all);
        this.loading.set(false);
      },
      error: () => { this.error.set('Could not load orders.'); this.loading.set(false); }
    });
  }

  setFilter(f: 'All' | OrderStatus): void {
    this.filter.set(f);
  }

  filtered(): Order[] {
    const f = this.filter();
    return f === 'All' ? this.orders() : this.orders().filter(o => o.status === f);
  }

  countByStatus(s: OrderStatus): number {
    return this.orders().filter(o => o.status === s).length;
  }

  apply(o: Order): void {
    if (!o.orderId) return;
    const status = this.pending[o.orderId];
    if (!status || status === o.status) { return; }
    this.orderService.updateStatus(o.orderId, status).subscribe({
      next: () => { this.message.set('Order #' + o.orderId + ' → ' + status); this.load(); },
      error: (err) => this.error.set(err.error?.message || 'Could not update status.')
    });
  }

  badgeClass(status?: OrderStatus): string {
    switch (status) {
      case OrderStatus.Delivered: return 'badge-green';
      case OrderStatus.Shipped:
      case OrderStatus.Packed:
      case OrderStatus.Confirmed: return 'badge-blue';
      case OrderStatus.Cancelled: return 'badge-red';
      default: return 'badge-amber';
    }
  }
}
