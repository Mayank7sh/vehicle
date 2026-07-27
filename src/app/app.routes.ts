import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';

// Guards
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { UserRole } from './core/models/user.model';

export const routes: Routes = [
  // === Auth Pages (Standalone, No Sidebar) ===
  { 
    path: 'login', 
    loadComponent: () => import('./features/users/pages/login/login.component').then(m => m.LoginComponent) 
  },
  { 
    path: 'signup', 
    loadComponent: () => import('./features/users/pages/signup/signup.component').then(m => m.SignupComponent) 
  },

  // === App Shell (Sidebar Always Visible) ===
  {
    path: '',
    component: MainLayout,
    children: [
      // Default redirect
      { path: '', redirectTo: 'home', pathMatch: 'full' },

      // --- Public Routes (Guest accessible - sidebar visible) ---
      {
        path: 'home',
        loadComponent: () => import('./features/dashboard/pages/Customer-Home/customer-home.component').then(m => m.CustomerHomeComponent)
      },
    //   {
    //     path: 'promotion',
    //     loadComponent: () => import('./features/promotion/pages/promotion-list/promotion-list').then(m => m.PromotionList)
    //   },

      // --- Protected Routes (Requires Login) ---
      {
        path: 'dashboard/home',
        loadComponent: () => import('./features/dashboard/pages/Customer-Home/customer-home.component').then(m => m.CustomerHomeComponent),
        canActivate: [authGuard, roleGuard([UserRole.Customer])]
      },
      {
        path: 'dashboard/store-manager',
        loadComponent: () => import('./features/dashboard/pages/store-manager/store-manager.component').then(m => m.StoreManagerComponent),
        canActivate: [authGuard, roleGuard([UserRole.StoreManager])]
      },
      {
        path: 'dashboard/inventory-analyst',
        loadComponent: () => import('./features/dashboard/pages/inventory-analyst/inventory-manager.component').then(m => m.InventoryAnalystComponent),
        canActivate: [authGuard, roleGuard([UserRole.InventoryAnalyst])]
      },
      {
        path: 'dashboard/ops',
        loadComponent: () => import('./features/dashboard/pages/ops/ops.component').then(m => m.OpsComponent),
        canActivate: [authGuard, roleGuard([UserRole.Ops])]
      },
      {
        path: 'dashboard/marketing',
        loadComponent: () => import('./features/dashboard/pages/marketing/marketing.component').then(m => m.MarketingComponent),
        canActivate: [authGuard, roleGuard([UserRole.Marketing])]
      },
      {
        path: 'dashboard/admin',
        loadComponent: () => import('./features/dashboard/pages/admin/admin.component').then(m => m.AdminComponent),
        canActivate: [authGuard, roleGuard([UserRole.Admin])]
      },

      // ===================================================================
      // Order, Inventory & Warehouse Management module (added)
      // ===================================================================

      // --- Customer: shop & track orders ---
    //   {
    //     path: 'shop',
    //     loadComponent: () => import('./features/order-inventory/pages/shop/shop.component').then(m => m.ShopComponent),
    //     canActivate: [authGuard, roleGuard([UserRole.Customer, UserRole.Admin])]
    //   },
      {
        path: 'my-orders',
        loadComponent: () => import('./features/orders/pages/my-orders/my-orders.component').then(m => m.MyOrdersComponent),
        canActivate: [authGuard, roleGuard([UserRole.Customer, UserRole.Admin])]
      },

      // --- Store Manager / Ops / Admin: fulfillment ---
      {
        path: 'orders',
        loadComponent: () => import('./features/orders/pages/orders-pipeline/orders-pipeline.component').then(m => m.OrdersPipelineComponent),
        canActivate: [authGuard, roleGuard([UserRole.StoreManager, UserRole.Ops, UserRole.Admin])]
      },

      {
        path: 'shipments',
        loadComponent: () => import('./features/orders/pages/shipments/shipment.component').then(m => m.ShipmentsComponent),
        canActivate: [authGuard, roleGuard([UserRole.StoreManager, UserRole.Ops, UserRole.Admin])]
      },

      // --- Inventory Analyst / Admin (+ Store Manager, Ops for read): warehouse ---

      {
        // Backend InventoryController allows only InventoryAnalyst + Admin.
        path: 'inventory',
        loadComponent: () => import('./features/inventory/pages/inventory/inventory.component').then(m => m.InventoryComponent),
        canActivate: [authGuard, roleGuard([UserRole.InventoryAnalyst, UserRole.Admin])]
      },


      {
        path: 'locations',
        loadComponent: () => import('./features/inventory/pages/location/location.component').then(m => m.LocationsComponent),
        canActivate: [authGuard, roleGuard([UserRole.InventoryAnalyst, UserRole.Admin])]
      },

      {
        path: 'supplier-orders',
        loadComponent: () => import('./features/inventory/pages/supplier-orders/supplier-orders.component').then(m => m.SupplierOrdersComponent),
        canActivate: [authGuard, roleGuard([UserRole.InventoryAnalyst, UserRole.Admin])]
      }
    ]
  },

  // Fallback redirect
  { path: '**', redirectTo: 'home' }
];
