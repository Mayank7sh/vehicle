import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard-layout">
      <header class="navbar">
        <div class="logo">App Portal</div>
        <div class="user-info" *ngIf="user()">
          <span>{{ user()?.name }} (<strong>{{ user()?.role }}</strong>)</span>
          <button (click)="logout()" class="btn-logout">Logout</button>
        </div>
      </header>
      <main class="content">
        <div class="welcome-card">
          <h1>Welcome to Admin</h1>
          <p>Oversee the full order and inventory operation across the business.</p>

          <div class="quick-grid">
            <a class="quick-card" routerLink="/orders">
              <i class="pi pi-list qc-icon"></i>
              <h3>Order Pipeline</h3>
              <p>View all orders and manage their statuses.</p>
            </a>
            <a class="quick-card" routerLink="/shipments">
              <i class="pi pi-truck qc-icon"></i>
              <h3>Shipments</h3>
              <p>Create and manage shipments for every order.</p>
            </a>
            <a class="quick-card" routerLink="/inventory">
              <i class="pi pi-box qc-icon"></i>
              <h3>Inventory</h3>
              <p>Manage stock records and low-stock alerts.</p>
            </a>
            <a class="quick-card" routerLink="/locations">
              <i class="pi pi-map-marker qc-icon"></i>
              <h3>Locations</h3>
              <p>Manage stores, warehouses and distribution centres.</p>
            </a>
            <a class="quick-card" routerLink="/supplier-orders">
              <i class="pi pi-shopping-cart qc-icon"></i>
              <h3>Supplier Orders</h3>
              <p>Raise and receive replenishment orders.</p>
            </a>
          </div>
        </div>
      </main>
    </div>
  `,
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  private authService = inject(AuthService);
  user = this.authService.currentUser;

  logout(): void { 
    this.authService.logout(); 
  }
}