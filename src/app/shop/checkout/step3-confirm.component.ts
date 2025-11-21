import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { CheckoutStepperComponent } from './checkout-stepper.component';
import { ShopApiService } from '../../services/shop-api.service';
import { selectCartItems, selectCartTotal } from '../../state/cart/cart.selectors';
import * as CartActions from '../../state/cart/cart.actions';
import * as OrdersActions from '../../state/orders/orders.actions';

export interface OrderResponse {
  order_number: string;
  total: number;
}

@Component({
  standalone: true,
  selector: 'app-step3-confirm',
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    CheckoutStepperComponent,
  ],
  template: `
    <div class="checkout-step">
      <app-checkout-stepper [currentStep]="3"></app-checkout-stepper>
      <h2>Order Confirmation</h2>

      <div *ngIf="loading" class="loading">
        <mat-spinner></mat-spinner>
        <p>Processing your order...</p>
      </div>

      <div *ngIf="error" class="error">
        <mat-icon color="warn">error</mat-icon>
        <p>{{ error }}</p>
        <button mat-raised-button (click)="retryOrder()">Retry</button>
      </div>

      <div *ngIf="orderNumber && !loading" class="success">
        <mat-card>
          <mat-card-content>
            <div class="success-content">
              <mat-icon class="success-icon">check_circle</mat-icon>
              <h3>Order Confirmed!</h3>
              <p><strong>Order Number:</strong> {{ orderNumber }}</p>
              <p><strong>Total:</strong> {{ orderTotal | number: '1.2-2' }} €</p>
              <p>Thank you for your purchase!</p>
            </div>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary" routerLink="/shop/products">
              Continue Shopping
            </button>
          </mat-card-actions>
        </mat-card>
      </div>

      <div *ngIf="!orderNumber && !loading && !error" class="review-section">
        <mat-card>
          <mat-card-content>
            <h3>Review Your Order</h3>
            <div class="order-items">
              <div *ngFor="let item of cartItems$ | async" class="order-item">
                <span>{{ item.product.name }}</span>
                <span>{{ item.quantity }}x</span>
                <span>{{ item.product.price * item.quantity | number: '1.2-2' }} €</span>
              </div>
            </div>
            <div class="order-total">
              <strong>Total: {{ cartTotal$ | async | number: '1.2-2' }} €</strong>
            </div>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button routerLink="/shop/checkout/address">Back</button>
            <button mat-raised-button color="primary" (click)="placeOrder()">
              Place Order
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [
    `
      .checkout-step {
        max-width: 900px;
        margin: 0 auto;
        padding: var(--spacing-xl) var(--spacing-md);
      }

      .checkout-step h2 {
        font-size: var(--font-size-2xl);
        font-weight: 700;
        margin: var(--spacing-2xl) 0 var(--spacing-xl) 0;
        text-align: center;
        color: var(--color-text-primary);
      }

      .loading,
      .error,
      .success {
        text-align: center;
        padding: 2rem;
      }

      .loading p {
        margin-top: 1rem;
      }

      .error mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        margin-bottom: 1rem;
      }

      .error p {
        color: #d32f2f;
        margin-bottom: 1rem;
      }

      .success-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
      }

      .success-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        color: #4caf50;
      }

      .review-section {
        margin-top: 2rem;
      }

      .order-items {
        margin: 1rem 0;
      }

      .order-item {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem 0;
        border-bottom: 1px solid #eee;
      }

      .order-total {
        text-align: right;
        font-size: 1.5rem;
        padding: 1rem 0;
        border-top: 2px solid #eee;
        margin-top: 1rem;
      }

      mat-card-actions {
        display: flex;
        justify-content: space-between;
      }
    `,
  ],
})
export class Step3ConfirmComponent implements OnInit {
  private store = inject(Store);
  private apiService = inject(ShopApiService);
  private router = inject(Router);

  cartItems$ = this.store.select(selectCartItems);
  cartTotal$ = this.store.select(selectCartTotal);

  loading = false;
  error: string | null = null;
  orderNumber: string | null = null;
  orderTotal = 0;

  ngOnInit() {
    // Check if address is stored (from step 2)
    const address = sessionStorage.getItem('checkoutAddress');
    if (!address) {
      // Redirect to address step if not completed
      this.router.navigate(['/shop/checkout/address']);
    }
  }

  placeOrder() {
    this.loading = true;
    this.error = null;

    this.store
      .select(selectCartItems)
      .pipe(take(1))
      .subscribe((items) => {
        const address = JSON.parse(sessionStorage.getItem('checkoutAddress') || '{}');
        const orderData = {
          items: items.map((item) => ({
            product_id: item.product.id,
            quantity: item.quantity,
          })),
          address,
        };

        this.apiService.createOrder(orderData).subscribe({
          next: (response) => {
            this.orderNumber = response.order_number;
            this.orderTotal = response.total;
            this.loading = false;
            
            // Save order to state
            const address = JSON.parse(sessionStorage.getItem('checkoutAddress') || '{}');
            const order: OrdersActions.Order = {
              id: `order-${Date.now()}`,
              orderNumber: response.order_number,
              date: new Date().toISOString().split('T')[0],
              total: response.total,
              status: 'Processing',
              items: items.map((item) => ({
                productId: item.product.id,
                productName: item.product.name,
                quantity: item.quantity,
                price: item.product.price,
              })),
              address,
            };
            this.store.dispatch(OrdersActions.addOrder({ order }));
            
            // Clear cart and address
            this.store.dispatch(CartActions.clearCart());
            sessionStorage.removeItem('checkoutAddress');
          },
          error: (err) => {
            this.error = err.error?.detail || 'Failed to place order';
            this.loading = false;
          },
        });
      });
  }

  retryOrder() {
    this.error = null;
    this.placeOrder();
  }
}

