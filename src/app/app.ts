import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { ShopHeaderComponent } from './shop/shared/shop-header.component';
import * as CartActions from './state/cart/cart.actions';
import * as OrdersActions from './state/orders/orders.actions';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ShopHeaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('my-shop');
  private store = inject(Store);

  ngOnInit() {
    // Load cart from localStorage on app initialization
    try {
      const cartData = localStorage.getItem('cart');
      if (cartData) {
        const items = JSON.parse(cartData);
        this.store.dispatch(CartActions.loadCartFromStorage({ items }));
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
    }

    // Load orders from localStorage on app initialization
    try {
      const ordersData = localStorage.getItem('orders');
      if (ordersData) {
        const orders = JSON.parse(ordersData);
        this.store.dispatch(OrdersActions.loadOrdersFromStorage({ orders }));
      }
    } catch (error) {
      console.error('Failed to load orders from localStorage:', error);
    }
  }
}

