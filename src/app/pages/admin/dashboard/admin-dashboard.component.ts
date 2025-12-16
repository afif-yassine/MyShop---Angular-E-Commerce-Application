import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Store } from '@ngrx/store';
import { AdminStatsCardComponent } from './admin-stats-card.component';
import { loadAdminStats } from '../../../state/admin/admin.actions';
import { 
  selectAdminStats, 
  selectAdminLoading, 
  selectAdminError,
  selectTopProducts,
  selectRecentOrders
} from '../../../state/admin/admin.selectors';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    MatChipsModule,
    RouterModule,
    MatProgressSpinnerModule,
    AdminStatsCardComponent
  ],
  template: `
    <div class="admin-dashboard">
      <div class="dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p class="subtitle">Overview of your store's performance</p>
        </div>
        <div class="actions">
          <button mat-raised-button color="accent" routerLink="/admin/products/new" class="action-btn">
            <mat-icon>add</mat-icon>
            Add Product
          </button>
          <button mat-raised-button color="primary" class="action-btn">
            <mat-icon>download</mat-icon>
            Download Report
          </button>
        </div>
      </div>

      <ng-container *ngIf="loading$ | async; else statsContent">
        <div class="loading-container">
          <mat-spinner diameter="40"></mat-spinner>
          <p>Loading statistics...</p>
        </div>
      </ng-container>

      <ng-template #statsContent>
        <div class="stats-grid" *ngIf="stats$ | async as stats">
          <app-admin-stats-card
            title="Total Revenue"
            [value]="formatCurrency(stats.totalRevenue)"
            icon="attach_money"
            color="primary"
            [trend]="15">
          </app-admin-stats-card>

          <app-admin-stats-card
            title="Total Orders"
            [value]="stats.totalOrders.toString()"
            icon="shopping_cart"
            color="accent"
            [trend]="8">
          </app-admin-stats-card>

          <app-admin-stats-card
            title="Active Users"
            [value]="stats.totalUsers.toString()"
            icon="people"
            color="warn"
            [trend]="-2">
          </app-admin-stats-card>

          <app-admin-stats-card
            title="Avg. Order Value"
            [value]="formatCurrency(stats.totalOrders > 0 ? stats.totalRevenue / stats.totalOrders : 0)"
            icon="analytics"
            color="primary"
            [trend]="5">
          </app-admin-stats-card>
        </div>

        <!-- Top Products -->
        <div class="top-products" *ngIf="topProducts$ | async as topProducts">
          <div class="section-header">
            <h2>Top Selling Products</h2>
          </div>
          
          <mat-card class="table-card" *ngIf="topProducts.length > 0; else noProducts">
            <table mat-table [dataSource]="topProducts" class="full-width">
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>Product</th>
                <td mat-cell *matCellDef="let product">{{ product.name }}</td>
              </ng-container>
              
              <ng-container matColumnDef="sold">
                <th mat-header-cell *matHeaderCellDef>Units Sold</th>
                <td mat-cell *matCellDef="let product" class="text-center">{{ product.sold }}</td>
              </ng-container>
              
              <ng-container matColumnDef="revenue">
                <th mat-header-cell *matHeaderCellDef>Revenue</th>
                <td mat-cell *matCellDef="let product" class="revenue">
                  {{ product.revenue | currency:'EUR' }}
                </td>
              </ng-container>
              
              <tr mat-header-row *matHeaderRowDef="productColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: productColumns;"></tr>
            </table>
          </mat-card>

          <ng-template #noProducts>
            <mat-card class="empty-card">
              <p>No product sales data available yet.</p>
            </mat-card>
          </ng-template>
        </div>

        <!-- Recent Orders -->
        <div class="recent-orders" *ngIf="recentOrders$ | async as recentOrders">
          <div class="section-header">
            <h2>Recent Orders</h2>
            <button mat-button color="primary" routerLink="/account/orders">View All</button>
          </div>
          
          <mat-card class="table-card" *ngIf="recentOrders.length > 0; else noOrders">
            <table mat-table [dataSource]="recentOrders" class="full-width">
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef>Order ID</th>
                <td mat-cell *matCellDef="let order" class="order-id">{{ order.id }}</td>
              </ng-container>
              
              <ng-container matColumnDef="user">
                <th mat-header-cell *matHeaderCellDef>Customer</th>
                <td mat-cell *matCellDef="let order">
                  <div class="customer-cell">
                    <div class="customer-avatar">{{ (order.user || 'G').charAt(0).toUpperCase() }}</div>
                    <span>{{ order.user || 'Guest' }}</span>
                  </div>
                </td>
              </ng-container>
              
              <ng-container matColumnDef="total">
                <th mat-header-cell *matHeaderCellDef>Total</th>
                <td mat-cell *matCellDef="let order" class="order-total">{{ order.total | currency:'EUR' }}</td>
              </ng-container>
              
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let order">
                  <mat-chip [color]="getStatusColor(order.status)" selected>
                    {{ order.status }}
                  </mat-chip>
                </td>
              </ng-container>
              
              <tr mat-header-row *matHeaderRowDef="orderColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: orderColumns;" class="order-row"></tr>
            </table>
          </mat-card>

          <ng-template #noOrders>
            <mat-card class="empty-card">
              <p>No orders have been placed yet.</p>
            </mat-card>
          </ng-template>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .admin-dashboard {
      padding: 32px 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 32px;
      flex-wrap: wrap;
      gap: 16px;
    }

    h1 {
      font-size: 2.5rem;
      font-weight: 700;
      color: #1a237e;
      margin: 0 0 8px 0;
    }

    .subtitle {
      color: #666;
      font-size: 1.1rem;
      margin: 0;
    }

    .actions {
      display: flex;
      gap: 16px;
    }

    .action-btn {
      border-radius: 24px;
      padding: 0 24px;
      height: 48px;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 64px;
      color: #666;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
      margin-bottom: 48px;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    h2 {
      font-size: 1.5rem;
      color: #1a237e;
      margin: 0;
    }

    .table-card, .empty-card {
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.05);
      overflow: hidden;
      margin-bottom: 32px;
    }

    .empty-card {
      padding: 48px;
      text-align: center;
      color: #666;
    }

    .full-width { width: 100%; }

    th.mat-header-cell {
      color: #666;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 0.8rem;
      letter-spacing: 1px;
      padding: 24px;
      background: #f8f9fa;
    }

    td.mat-cell {
      padding: 20px 24px;
      color: #333;
      font-size: 0.95rem;
      border-bottom-color: #f0f0f0;
    }

    .order-id {
      font-family: monospace;
      font-weight: 600;
      color: #1a237e;
    }

    .customer-cell {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .customer-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #e3f2fd;
      color: #1565c0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.8rem;
    }

    .order-total, .revenue {
      font-weight: 600;
    }

    .text-center {
      text-align: center;
    }

    .order-row:hover {
      background: #fcfcfc;
    }

    .top-products {
      margin-bottom: 32px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminDashboardComponent implements OnInit {
  private store = inject(Store);
  
  stats$ = this.store.select(selectAdminStats);
  loading$ = this.store.select(selectAdminLoading);
  error$ = this.store.select(selectAdminError);
  topProducts$ = this.store.select(selectTopProducts);
  recentOrders$ = this.store.select(selectRecentOrders);
  
  orderColumns = ['id', 'user', 'total', 'status'];
  productColumns = ['name', 'sold', 'revenue'];

  ngOnInit() {
    this.store.dispatch(loadAdminStats());
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'EUR' 
    }).format(value);
  }

  getStatusColor(status: string): string {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'accent';
      case 'shipped': return 'primary';
      case 'processing': return 'warn';
      default: return '';
    }
  }

  trackByProduct(index: number, product: any): string {
    return product.productId;
  }

  trackByOrder(index: number, order: any): string {
    return order.id;
  }
}
