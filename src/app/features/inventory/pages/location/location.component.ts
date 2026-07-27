import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LocationService } from '../../services/location.service';
import { Location, LocationStatus, LocationType } from '../../models/inventory.model';

@Component({
  selector: 'app-locations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './location.component.html',
  styleUrl: '../../inventory.css'
})
export class LocationsComponent implements OnInit {
  private locationService = inject(LocationService);

  types = Object.values(LocationType);
  statuses = Object.values(LocationStatus);
  // Expose the enum so the template can reference it (avoids raw strings).
  readonly Status = LocationStatus;

  locations = signal<Location[]>([]);
  editingId: number | null = null;
  form = this.blankForm();

  loading = signal(false);
  message = signal<string | null>(null);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.locationService.getAll().subscribe({
      next: (data) => { this.locations.set(data); this.loading.set(false); },
      error: () => { this.error.set('Could not load locations.'); this.loading.set(false); }
    });
  }

  save(): void {
    this.message.set(null); this.error.set(null);
    if (!this.form.locationName || !this.form.city) {
      this.error.set('Name and city are required.');
      return;
    }
    const done = () => { this.message.set('Saved.'); this.resetForm(); this.load(); };
    const fail = (err: any) => this.error.set(err.error?.message || 'Could not save location.');

    if (this.editingId) {
      this.locationService.update(this.editingId, this.form).subscribe({ next: done, error: fail });
    } else {
      this.locationService.create(this.form).subscribe({ next: done, error: fail });
    }
  }

  edit(l: Location): void {
    this.editingId = l.locationId ?? null;
    this.form = { locationName: l.locationName, type: l.type, city: l.city, status: l.status };
  }

  remove(l: Location): void {
    if (!l.locationId) return;
    this.locationService.remove(l.locationId).subscribe({
      next: () => { this.message.set('Location deleted.'); this.load(); },
      error: (err) => this.error.set(err.error?.message || 'Could not delete location.')
    });
  }

  resetForm(): void {
    this.editingId = null;
    this.form = this.blankForm();
  }

  private blankForm(): Location {
    return { locationName: '', type: LocationType.Store, city: '', status: LocationStatus.Active };
  }
}
