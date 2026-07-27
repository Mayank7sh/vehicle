import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { OrderService } from '../../services/order.service';
import { ShipmentService } from '../../services/shiment.service';

import { Order } from '../../models/order.model';
import { Shipment } from '../../models/shipment.model';
import { OrderStatus } from '../../models/order-status.enum';


@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],

  templateUrl: './my-orders.component.html',
  styleUrls: ['../../orders.css']
})
export class MyOrdersComponent implements OnInit {

  private orderService = inject(OrderService);
  private shipmentService = inject(ShipmentService);

  orders = signal<Order[]>([]);
  tracked = signal<Shipment | null>(null);

  trackingNumber = '';

  loading = signal(false);
  message = signal<string | null>(null);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.load();
  }

  load(): void {

    this.loading.set(true);

    this.orderService.getMyOrders().subscribe({

      next: (data) => {

        this.orders.set(data);

        this.loading.set(false);

      },

      error: () => {

        this.error.set('Could not load your orders.');

        this.loading.set(false);

      }

    });

  }

  track(): void {

    this.tracked.set(null);

    this.error.set(null);

    if (!this.trackingNumber.trim()) {

      this.error.set('Enter a tracking number.');

      return;

    }

    this.shipmentService.track(this.trackingNumber.trim()).subscribe({

      next: (shipment) => this.tracked.set(shipment),

      error: () => this.error.set('Shipment not found.')

    });

  }

  badgeClass(status?: OrderStatus): string {

    switch (status) {

      case OrderStatus.Delivered:
        return 'badge-green';

      case OrderStatus.Shipped:

      case OrderStatus.Packed:

      case OrderStatus.Confirmed:
        return 'badge-blue';

      case OrderStatus.Cancelled:
        return 'badge-red';

      default:
        return 'badge-amber';

    }

  }

}