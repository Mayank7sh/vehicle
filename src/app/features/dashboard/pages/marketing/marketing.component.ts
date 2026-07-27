import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-marketing',
  standalone: true,
  imports: [CommonModule],
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
          <h1>Welcome to Marketing</h1>
          <p>Manage customer campaigns, promotions, and engagement analytics.</p>
        </div>
      </main>
    </div>
  `,
  styleUrl: './marketing.component.css'
})
export class MarketingComponent {
 private authService = inject(AuthService);
  user = this.authService.currentUser;

  logout(): void { 
    this.authService.logout(); 
  }
}