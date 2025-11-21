import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CartItemComponent } from './cart-item.component';
import * as CartActions from '../../state/cart/cart.actions';
import { selectCartItems, selectCartTotal } from '../../state/cart/cart.selectors';

@Component({
  standalone: true,
  selector: 'app-cart-page',
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    CartItemComponent,
  ],
  template: `
    <div class="cart-page">
      <h1>Shopping Cart</h1>

      <div *ngIf="(cartItems$ | async)?.length === 0" class="empty-cart">
        <mat-icon>shopping_cart</mat-icon>
        <p>Your cart is empty</p>
        <button mat-raised-button color="primary" routerLink="/shop/products">
          Continue Shopping
        </button>
      </div>

      <div *ngIf="(cartItems$ | async)?.length! > 0" class="cart-content">
        <div class="cart-items">
          <app-cart-item
            *ngFor="let item of cartItems$ | async"
            [item]="item"
            (quantityChange)="onQuantityChange(item.product.id, $event)"
            (remove)="onRemoveItem(item.product.id)"
          ></app-cart-item>
        </div>

        <mat-card class="cart-summary">
          <mat-card-content>
            <div class="summary-row">
              <span>Subtotal:</span>
              <span class="total">{{ cartTotal$ | async | number: '1.2-2' }} €</span>
            </div>
            <div class="summary-actions">
              <button mat-button (click)="onClearCart()">Clear Cart</button>
              <button mat-raised-button color="primary" routerLink="/shop/checkout">
                Proceed to Checkout
              </button>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [
    `
      .cart-page {
        max-width: 1200px;
        margin: 0 auto;
        padding: var(--spacing-xl) var(--spacing-md);
      }

      .cart-page h1 {
        font-size: var(--font-size-3xl);
        font-weight: 700;
        margin: 0 0 var(--spacing-md) 0;
        color: var(--color-text-primary);
      }

      .empty-cart {
        text-align: center;
        padding: var(--spacing-3xl) var(--spacing-md);
        background: white;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-sm);
      }

      .empty-cart mat-icon {
        font-size: 96px;
        width: 96px;
        height: 96px;
        color: var(--color-text-disabled);
        margin-bottom: var(--spacing-lg);
      }

      .empty-cart p {
        font-size: var(--font-size-xl);
        color: var(--color-text-secondary);
        margin-bottom: var(--spacing-2xl);
      }

      .cart-content {
        display: grid;
        grid-template-columns: 1fr 380px;
        gap: var(--spacing-2xl);
        margin-top: var(--spacing-xl);
      }

      .cart-items {
        display: flex;
        flex-direction: column;
      }

      .cart-summary {
        height: fit-content;
        position: sticky;
        top: calc(64px + var(--spacing-md));
        background: white;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-md);
        padding: var(--spacing-lg);
      }

      .summary-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--spacing-md) 0;
        font-size: var(--font-size-lg);
        border-bottom: 2px solid var(--color-divider);
      }

      .summary-row .total {
        font-weight: 700;
        font-size: var(--font-size-2xl);
        color: var(--color-primary);
      }

      .summary-actions {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-md);
        margin-top: var(--spacing-lg);
      }

      .summary-actions button {
        width: 100%;
        height: 48px;
      }

      @media (max-width: 900px) {
        .cart-content {
          grid-template-columns: 1fr;
          gap: var(--spacing-xl);
        }

        .cart-summary {
          position: static;
        }
      }
    `,
  ],
})
export class CartPageComponent {
  private store = inject(Store);
  cartItems$ = this.store.select(selectCartItems);
  cartTotal$ = this.store.select(selectCartTotal);

  onQuantityChange(productId: number, quantity: number) {
    this.store.dispatch(CartActions.updateQuantity({ productId, quantity }));
  }

  onRemoveItem(productId: number) {
    this.store.dispatch(CartActions.removeItem({ productId }));
  }

  onClearCart() {
    this.store.dispatch(CartActions.clearCart());
  }
}

