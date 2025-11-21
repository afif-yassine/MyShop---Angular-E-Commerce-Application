import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { selectAuthToken } from '../../state/auth/auth.selectors';
import { selectAllOrders } from '../../state/orders/orders.selectors';
import { Router } from '@angular/router';
import { take, map } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'app-account-dashboard',
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTabsModule,
    MatTableModule,
    MatChipsModule,
  ],
  templateUrl: './account-dashboard.component.html',
  styleUrls: ['./account-dashboard.component.css'],
})
export class AccountDashboardComponent implements OnInit {
  private store = inject(Store);
  private router = inject(Router);

  user = {
    name: 'John Doe',
    email: 'demo@example.com',
    avatar: 'JD',
  };

  orders$ = this.store.select(selectAllOrders).pipe(
    map(orders => orders || [])
  );

  wishlist = [
    { id: 1, name: 'Premium Product 1', price: 99.99, image: '🎁' },
    { id: 2, name: 'Premium Product 2', price: 149.99, image: '📦' },
  ];

  displayedColumns: string[] = ['id', 'date', 'total', 'status', 'actions'];

  ngOnInit() {
    // Redirect if not logged in
    this.store
      .select(selectAuthToken)
      .pipe(take(1))
      .subscribe((token) => {
        if (!token) {
          this.router.navigate(['/login']);
        }
      });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Delivered':
        return 'success';
      case 'Shipped':
        return 'primary';
      case 'Processing':
        return 'accent';
      default:
        return '';
    }
  }
}

