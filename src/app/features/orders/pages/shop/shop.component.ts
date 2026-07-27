// import { Component, inject, signal, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { AuthService } from '../../../../core/auth/auth.service';
// import { CatalogService } from '../../services/catalog.service';
// import { OrderService } from '../../services/order.service';
// import { Product, ProductVariant } from '../../models/catalog.model';
// import { OrderChannel } from '../../models/order-channel.enum';
// import { OrderCreateRequest } from '../../models/order-create-request.model';


// // One line in the shopping cart.
// interface CartLine {
//   variant: ProductVariant;
//   productName: string;
//   quantity: number;
// }

// @Component({
//   selector: 'app-shop',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './shop.component.html',
//   styleUrl: '../../orders.css'
// })
// export class ShopComponent implements OnInit {
//   private catalog = inject(CatalogService);
//   private orderService = inject(OrderService);
//   private auth = inject(AuthService);

//   channels = Object.values(OrderChannel);
//   channel: OrderChannel = OrderChannel.Online;

//   products = signal<Product[]>([]);
//   selectedProduct = signal<Product | null>(null);
//   variants = signal<ProductVariant[]>([]);
//   cart = signal<CartLine[]>([]);

//   loading = signal(false);
//   placing = signal(false);
//   message = signal<string | null>(null);
//   error = signal<string | null>(null);

//   // Cart total = sum of (price * quantity) for every line.
//   // A plain method so it re-reads the latest quantity each time.
//   cartTotal(): number {
//     return this.cart().reduce((sum, l) => sum + l.variant.price * Number(l.quantity), 0);
//   }

//   ngOnInit(): void {
//     this.loadProducts();
//   }

//   loadProducts(): void {
//     this.loading.set(true);
//     this.catalog.getProducts().subscribe({
//       next: (data) => { this.products.set(data); this.loading.set(false); },
//       error: () => { this.error.set('Could not load products.'); this.loading.set(false); }
//     });
//   }

//   viewVariants(p: Product): void {
//     this.selectedProduct.set(p);
//     this.variants.set([]);
//     this.catalog.getVariants(p.productId).subscribe({
//       next: (data) => this.variants.set(data),
//       error: () => this.error.set('Could not load variants for ' + p.name)
//     });
//   }

//   addToCart(v: ProductVariant): void {
//     const existing = this.cart().find(l => l.variant.variantId === v.variantId);
//     if (existing) {
//       existing.quantity += 1;
//       this.cart.set([...this.cart()]);
//     } else {
//       this.cart.set([
//         ...this.cart(),
//         { variant: v, productName: this.selectedProduct()?.name || 'Product', quantity: 1 }
//       ]);
//     }
//     this.message.set('Added to cart.');
//   }

//   removeLine(index: number): void {
//     this.cart.set(this.cart().filter((_, i) => i !== index));
//   }

//   clearCart(): void {
//     this.cart.set([]);
//   }

//   placeOrder(): void {
//     this.message.set(null);
//     this.error.set(null);

//     const user = this.auth.currentUser();
//     if (!user) { this.error.set('Please log in to place an order.'); return; }
//     if (this.cart().length === 0) { this.error.set('Your cart is empty.'); return; }

//     // Build the request body in the shape the backend expects.
//     const request: OrderCreateRequest = {
//       customer: { id: user.id },
//       channel: this.channel,
//       totalAmount: this.cartTotal(),
//       discountApplied: 0,
//       items: this.cart().map(l => ({
//         productVariant: { variantId: l.variant.variantId },
//         quantity: Number(l.quantity),
//         unitPrice: l.variant.price,
//         lineTotal: l.variant.price * Number(l.quantity)
//       }))
//     };

//     this.placing.set(true);
//     this.orderService.createOrder(request).subscribe({
//       next: (order) => {
//         this.placing.set(false);
//         this.message.set('Order #' + (order.orderId ?? '') + ' placed successfully!');
//         this.clearCart();
//       },
//       error: (err) => {
//         this.placing.set(false);
//         this.error.set(err.error?.message || 'Could not place the order.');
//       }
//     });
//   }
// }
