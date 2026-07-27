import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { User, AuthResponse, UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:6060/api/auth';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  currentUser = signal<User | null>(this.getUserFromStorage());
  isAuthenticated = computed(() => !!this.currentUser());

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap(response => this.handleAuthSuccess(response))
    );
  }

  register(userData: any): Observable<User> {
    return this.http.post<User>(`${this.API_URL}/register`, userData);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private handleAuthSuccess(response: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
    this.currentUser.set(response.user);
    this.redirectBasedOnRole(response.user.role);
  }

  public redirectBasedOnRole(role: UserRole): void {
    switch (role) {
      case UserRole.Customer:
        this.router.navigate(['/dashboard/home']);
        break;
      case UserRole.StoreManager:
        this.router.navigate(['/dashboard/store-manager']);
        break;
      case UserRole.InventoryAnalyst:
        this.router.navigate(['/dashboard/inventory-analyst']);
        break;
      case UserRole.Ops:
        this.router.navigate(['/dashboard/ops']);
        break;
      case UserRole.Marketing:
        this.router.navigate(['/dashboard/marketing']);
        break;
      case UserRole.Admin:
        this.router.navigate(['/dashboard/admin']);
        break;
      default:
        this.router.navigate(['/dashboard/home']);
        break;
    }
  }

  private getUserFromStorage(): User | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }
}