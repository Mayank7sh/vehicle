import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-ops',
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
          <h1>Welcome to Ops</h1>
          <p>Monitor the order pipeline, handle exceptions, and keep fulfillment on track.</p>

          <div class="quick-grid">
            <a class="quick-card" routerLink="/orders">
              <i class="pi pi-list qc-icon"></i>
              <h3>Order Pipeline</h3>
              <p>Watch every order and advance statuses across the pipeline.</p>
            </a>
            <a class="quick-card" routerLink="/shipments">
              <i class="pi pi-truck qc-icon"></i>
              <h3>Shipments</h3>
              <p>Create shipments and track deliveries end to end.</p>
            </a>
          </div>
        </div>
      </main>
    </div>
  `,
  styleUrl: './ops.component.css'
})
export class OpsComponent {
  private authService = inject(AuthService);
  user = this.authService.currentUser;

  logout(): void { 
    this.authService.logout(); 
  }
}