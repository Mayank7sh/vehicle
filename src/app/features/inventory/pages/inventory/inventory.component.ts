import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../../services/inventory.service';
import { Inventory, InventoryCreateRequest } from '../../models/inventory.model';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventory.component.html',
  styleUrl: '../../inventory.css'
})
export class InventoryComponent implements OnInit {
  private inventoryService = inject(InventoryService);

  items = signal<Inventory[]>([]);
  showLowOnly = signal(false);
  form = this.blankForm();

  loading = signal(false);
  message = signal<string | null>(null);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.showAll();
  }

  showAll(): void {
    this.showLowOnly.set(false);
    this.loading.set(true);
    this.inventoryService.getAll().subscribe({
      next: (data) => { this.items.set(data); this.loading.set(false); },
      error: () => { this.error.set('Could not load inventory.'); this.loading.set(false); }
    });
  }

  showLow(): void {
    this.showLowOnly.set(true);
    this.loading.set(true);
    this.inventoryService.getLowStock().subscribe({
      next: (data) => { this.items.set(data); this.loading.set(false); },
      error: () => { this.error.set('Could not load low-stock items.'); this.loading.set(false); }
    });
  }

  isLow(i: Inventory): boolean {
    return i.quantityOnHand <= i.reorderLevel;
  }

  totalOnHand(): number {
    return this.items().reduce((sum, i) => sum + (i.quantityOnHand || 0), 0);
  }

  create(): void {
    this.message.set(null); this.error.set(null);
    if (!this.form.productVariantId || !this.form.locationId) {
      this.error.set('Variant ID and Location ID are required.');
      return;
    }
    const request: InventoryCreateRequest = {
      productVariant: { variantId: Number(this.form.productVariantId) },
      location: { locationId: Number(this.form.locationId) },
      quantityOnHand: Number(this.form.quantityOnHand),
      quantityReserved: Number(this.form.quantityReserved),
      reorderLevel: Number(this.form.reorderLevel)
    };
    this.inventoryService.create(request).subscribe({
      next: () => { this.message.set('Inventory record added.'); this.resetForm(); this.showAll(); },
      error: (err) => this.error.set(err.error?.message || 'Could not add inventory record.')
    });
  }

  remove(i: Inventory): void {
    if (!i.inventoryId) return;
    this.inventoryService.remove(i.inventoryId).subscribe({
      next: () => { this.message.set('Record deleted.'); this.showLowOnly() ? this.showLow() : this.showAll(); },
      error: (err) => this.error.set(err.error?.message || 'Could not delete record.')
    });
  }

  resetForm(): void { this.form = this.blankForm(); }

  private blankForm() {
    return {
      productVariantId: null as number | null,
      locationId: null as number | null,
      quantityOnHand: 0,
      quantityReserved: 0,
      reorderLevel: 0
    };
  }
}
