import { Component, signal, HostListener } from '@angular/core';
import { NgClass } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { Header } from "../header/header";
import { Sidebar } from "../sidebar/sidebar";
import { Footer } from "../footer/footer";
import { AuthService } from '../../core/auth/auth.service';
import { AuthModal } from '../../shared/components/auth-modal/auth-modal';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [Header, Sidebar, RouterOutlet, Footer, NgClass, AuthModal],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {
  sidebarCollapsed = signal(false);
  showAuthModal = signal(false);
  isMobile = signal(false);

  constructor(
    public authService: AuthService,
    private router: Router
  ) {
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    const mobile = window.innerWidth < 768;
    this.isMobile.set(mobile);
    if (mobile) {
      this.sidebarCollapsed.set(true);
    }
  }

  toggleSidebar() {
    this.sidebarCollapsed.update(val => !val);
  }

  closeSidebar() {
    this.sidebarCollapsed.set(true);
  }

  openAuthModal() {
    this.showAuthModal.set(true);
  }

  closeAuthModal() {
    this.showAuthModal.set(false);
  }

  onAuthModalLogin() {
    this.closeAuthModal();
    this.router.navigate(['/login']);
  }

  onAuthModalRegister() {
    this.closeAuthModal();
    this.router.navigate(['/signup']);
  }
}
