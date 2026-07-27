import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-customer-home',
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
          <h1>Welcome to Home</h1>
          <p>Explore products, view your orders, and manage your account settings.</p>
        </div>
      </main>
    </div>
  `,
  styleUrl: './customer-home.component.css'
})
export class CustomerHomeComponent {
  private authService = inject(AuthService);
  user = this.authService.currentUser;

  logout(): void { 
    this.authService.logout(); 
  }
}