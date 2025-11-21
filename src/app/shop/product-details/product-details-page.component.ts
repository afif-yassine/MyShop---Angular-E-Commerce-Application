import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ShopApiService } from '../../services/shop-api.service';
import * as CartActions from '../../state/cart/cart.actions';
import { Product } from '../../../mocks/data';
import { avgRating } from '../../../mocks/utils';

@Component({
  standalone: true,
  selector: 'app-product-details-page',
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="product-details-page">
      <button mat-button routerLink="/shop/products" class="back-button">
        <mat-icon>arrow_back</mat-icon>
        Back to Products
      </button>

      <div *ngIf="loading" class="loading">
        <mat-spinner></mat-spinner>
      </div>

      <div *ngIf="error" class="error">
        <p>{{ error }}</p>
        <button mat-raised-button routerLink="/shop/products">Go to Products</button>
      </div>

      <div *ngIf="product && !loading" class="product-details">
        <mat-card class="product-card">
          <mat-card-header>
            <mat-card-title>{{ product.name }}</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="product-info">
              <div class="price-section">
                <span class="price">{{ product.price | number: '1.2-2' }} €</span>
              </div>
              <div class="rating-section">
                <mat-chip-set>
                  <mat-chip>
                    <mat-icon>star</mat-icon>
                    {{ getAvgRating() | number: '1.1-1' }}
                  </mat-chip>
                </mat-chip-set>
              </div>
              <div class="meta-section">
                <p><strong>Product ID:</strong> {{ product.id }}</p>
                <p><strong>Created:</strong> {{ formatDate(product.created_at) }}</p>
                <p><strong>Owner ID:</strong> {{ product.owner_id }}</p>
              </div>
            </div>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary" (click)="onAddToCart()">
              <mat-icon>shopping_cart</mat-icon>
              Add to Cart
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [
    `
      .product-details-page {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem;
      }

      .back-button {
        margin-bottom: 2rem;
      }

      .loading,
      .error {
        text-align: center;
        padding: 4rem 2rem;
      }

      .error p {
        color: #d32f2f;
        margin-bottom: 1rem;
      }

      .product-details {
        margin-top: 2rem;
      }

      .product-card {
        padding: 2rem;
      }

      .product-info {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .price-section {
        font-size: 2rem;
        font-weight: bold;
        color: #1976d2;
      }

      .rating-section {
        margin: 1rem 0;
      }

      .meta-section {
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid #eee;
      }

      .meta-section p {
        margin: 0.5rem 0;
      }

      mat-card-actions {
        margin-top: 2rem;
        padding-top: 1rem;
        border-top: 1px solid #eee;
      }

      mat-card-actions button {
        width: 100%;
      }
    `,
  ],
})
export class ProductDetailsPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private store = inject(Store);
  private apiService = inject(ShopApiService);
  private snackBar = inject(MatSnackBar);

  product: Product | null = null;
  loading = false;
  error: string | null = null;

  ngOnInit() {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProduct(Number(productId));
    }
  }

  loadProduct(id: number) {
    this.loading = true;
    this.error = null;
    this.apiService.getProduct(id).subscribe({
      next: (product) => {
        this.product = product;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.detail || 'Failed to load product';
        this.loading = false;
      },
    });
  }

  getAvgRating(): number {
    if (!this.product) return 0;
    return avgRating(this.product.ratings);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  onAddToCart() {
    if (this.product) {
      this.store.dispatch(CartActions.addItem({ product: this.product, quantity: 1 }));
      this.snackBar.open('Product added to cart!', 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
      });
    }
  }
}

