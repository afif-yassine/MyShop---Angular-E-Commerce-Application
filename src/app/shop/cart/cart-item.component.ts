import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CartItem } from '../../state/cart/cart.actions';

@Component({
  standalone: true,
  selector: 'app-cart-item',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  template: `
    <mat-card class="cart-item-card">
      <mat-card-content>
        <div class="cart-item-content">
          <div class="item-image">
            <div class="image-placeholder">
              <mat-icon>inventory_2</mat-icon>
            </div>
          </div>
          <div class="item-info">
            <h3 class="item-name">{{ item.product.name }}</h3>
            <p class="item-unit-price">{{ item.product.price | number: '1.2-2' }} € each</p>
          </div>
          <div class="item-controls">
            <div class="quantity-control">
              <button mat-icon-button (click)="decreaseQuantity()" [disabled]="item.quantity <= 1">
                <mat-icon>remove</mat-icon>
              </button>
              <span class="quantity-display">{{ item.quantity }}</span>
              <button mat-icon-button (click)="increaseQuantity()">
                <mat-icon>add</mat-icon>
              </button>
            </div>
            <div class="item-total">
              <span class="total-label">Total</span>
              <span class="total-amount">{{ item.product.price * item.quantity | number: '1.2-2' }} €</span>
            </div>
            <button mat-icon-button color="warn" (click)="onRemove()" aria-label="Remove item" class="remove-button">
              <mat-icon>delete_outline</mat-icon>
            </button>
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      .cart-item-card {
        margin-bottom: var(--spacing-md);
        box-shadow: var(--shadow-sm);
        border-radius: var(--radius-lg);
        transition: box-shadow var(--transition-base);
      }

      .cart-item-card:hover {
        box-shadow: var(--shadow-md);
      }

      .cart-item-content {
        display: grid;
        grid-template-columns: 80px 1fr auto;
        gap: var(--spacing-lg);
        align-items: center;
      }

      .item-image {
        width: 80px;
        height: 80px;
      }

      .image-placeholder {
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: var(--radius-md);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
      }

      .image-placeholder mat-icon {
        font-size: 32px;
        width: 32px;
        height: 32px;
      }

      .item-info {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xs);
      }

      .item-name {
        margin: 0;
        font-size: var(--font-size-lg);
        font-weight: 600;
        color: var(--color-text-primary);
      }

      .item-unit-price {
        margin: 0;
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);
      }

      .item-controls {
        display: flex;
        align-items: center;
        gap: var(--spacing-lg);
      }

      .quantity-control {
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
        background: var(--color-surface);
        border-radius: var(--radius-md);
        padding: var(--spacing-xs);
      }

      .quantity-display {
        min-width: 40px;
        text-align: center;
        font-weight: 600;
        font-size: var(--font-size-base);
      }

      .item-total {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        min-width: 100px;
      }

      .total-label {
        font-size: var(--font-size-xs);
        color: var(--color-text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .total-amount {
        font-weight: 700;
        font-size: var(--font-size-lg);
        color: var(--color-primary);
      }

      .remove-button {
        transition: transform var(--transition-fast);
      }

      .remove-button:hover {
        transform: scale(1.1);
      }

      @media (max-width: 768px) {
        .cart-item-content {
          grid-template-columns: 60px 1fr;
          gap: var(--spacing-md);
        }

        .item-controls {
          grid-column: 1 / -1;
          justify-content: space-between;
          margin-top: var(--spacing-sm);
          padding-top: var(--spacing-sm);
          border-top: 1px solid var(--color-border);
        }

        .item-image {
          width: 60px;
          height: 60px;
        }
      }
    `,
  ],
})
export class CartItemComponent {
  @Input() item!: CartItem;
  @Output() quantityChange = new EventEmitter<number>();
  @Output() remove = new EventEmitter<void>();

  onQuantityChange(quantity: number) {
    if (quantity > 0) {
      this.quantityChange.emit(quantity);
    }
  }

  increaseQuantity() {
    this.quantityChange.emit(this.item.quantity + 1);
  }

  decreaseQuantity() {
    if (this.item.quantity > 1) {
      this.quantityChange.emit(this.item.quantity - 1);
    }
  }

  onRemove() {
    this.remove.emit();
  }
}

