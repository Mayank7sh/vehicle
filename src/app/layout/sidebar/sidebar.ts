import { Component, signal, computed, input, output } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';
import { UserRole } from '../../core/models/user.model';

interface NavItem {
  label: string;
  route: string;
  icon: string;
  roles?: UserRole[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, NgClass],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {
  collapsed = input<boolean>(false);
  isMobile = input<boolean>(false);
  sidebarToggle = output<void>();
  openAuthModal = output<void>();

  searchQuery = signal('');

  // Guest navigation items
  guestNavItems: NavItem[] = [
    { label: 'Home / Catalog', route: '/home', icon: 'pi pi-home' },
    { label: 'Categories', route: '/categories', icon: 'pi pi-th-large' },
    { label: 'Offers & Promotions', route: '/promotion', icon: 'pi pi-tags' }
  ];

  // Customer navigation items
  customerNavItems: NavItem[] = [
    { label: 'Home', route: '/home', icon: 'pi pi-home' },
    { label: 'Shop', route: '/shop', icon: 'pi pi-shopping-cart' },
    { label: 'My Orders', route: '/my-orders', icon: 'pi pi-shopping-bag' },
    { label: 'Wishlist', route: '/wishlist', icon: 'pi pi-heart' },
    { label: 'Returns', route: '/returns', icon: 'pi pi-undo' }
  ];

  // Role-based nav items mapping
  roleNavMap: Partial<Record<UserRole, NavItem[]>> = {
    [UserRole.StoreManager]: [
      { label: 'Dashboard', route: '/dashboard/store-manager', icon: 'pi pi-chart-bar' },
      { label: 'Orders', route: '/orders', icon: 'pi pi-list' },
      { label: 'Shipments', route: '/shipments', icon: 'pi pi-truck' }
    ],
    [UserRole.InventoryAnalyst]: [
      { label: 'Dashboard', route: '/dashboard/inventory-analyst', icon: 'pi pi-chart-bar' },
      { label: 'Inventory', route: '/inventory', icon: 'pi pi-box' },
      { label: 'Locations', route: '/locations', icon: 'pi pi-map-marker' },
      { label: 'Supplier Orders', route: '/supplier-orders', icon: 'pi pi-shopping-cart' }
    ],
    [UserRole.Ops]: [
      { label: 'Dashboard', route: '/dashboard/ops', icon: 'pi pi-chart-bar' },
      { label: 'Orders Pipeline', route: '/orders', icon: 'pi pi-list' },
      { label: 'Shipments', route: '/shipments', icon: 'pi pi-truck' },
      { label: 'Returns & Refunds', route: '/returns', icon: 'pi pi-undo' },
      { label: 'Analytics', route: '/analytics', icon: 'pi pi-chart-line' }
    ],
    [UserRole.Marketing]: [
      { label: 'Dashboard', route: '/dashboard/marketing', icon: 'pi pi-chart-bar' },
      { label: 'Promotions', route: '/promotion', icon: 'pi pi-tags' },
      { label: 'Loyalty', route: '/loyalty', icon: 'pi pi-star' },
      { label: 'Analytics', route: '/analytics', icon: 'pi pi-chart-line' }
    ],
    [UserRole.Admin]: [
      { label: 'Dashboard', route: '/dashboard/admin', icon: 'pi pi-chart-bar' },
      { label: 'Inventory', route: '/inventory', icon: 'pi pi-box' },
      { label: 'Locations', route: '/locations', icon: 'pi pi-map-marker' },
      { label: 'Supplier Orders', route: '/supplier-orders', icon: 'pi pi-shopping-cart' },
      { label: 'Orders Pipeline', route: '/orders', icon: 'pi pi-list' },
      { label: 'Shipments', route: '/shipments', icon: 'pi pi-truck' },
      { label: 'Promotions', route: '/promotion', icon: 'pi pi-tags' },
      { label: 'Returns & Refunds', route: '/returns', icon: 'pi pi-undo' },
      { label: 'Analytics', route: '/analytics', icon: 'pi pi-chart-line' },
      { label: 'Users', route: '/users', icon: 'pi pi-users' }
    ]
  };

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  // Computed nav items based on auth state and role
  navItems = computed(() => {
    const user = this.authService.currentUser();
    if (!user) {
      return this.guestNavItems;
    }
    // Staff roles get their own menu; customers get the shopper menu.
    const roleItems = this.roleNavMap[user.role];
    if (roleItems) {
      return roleItems;
    }
    return this.customerNavItems;
  });

  // Computed user display info
  userDisplay = computed(() => {
    const user = this.authService.currentUser();
    if (!user) return null;
    const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    return {
      name: user.name,
      email: user.email,
      role: user.role,
      initials
    };
  });

  isGuest = computed(() => !this.authService.currentUser());

  onToggle() {
    this.sidebarToggle.emit();
  }

  onAuthClick() {
    this.openAuthModal.emit();
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }


  trackByRoute(index: number, item: NavItem): string {
    return item.route;
  }
}
