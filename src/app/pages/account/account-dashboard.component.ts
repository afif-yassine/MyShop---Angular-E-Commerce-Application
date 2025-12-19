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
import { selectAuthToken, selectUser } from '../../state/auth/auth.selectors';
import { selectAllOrders } from '../../state/orders/orders.selectors';
import { Router } from '@angular/router';
import { take, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

interface DisplayUser {
  name: string;
  email: string;
  avatar: string;
  picture?: string | null;
  isGoogleUser?: boolean;
}

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

  // Dynamic user observable from store
  user$: Observable<DisplayUser> = this.store.select(selectUser).pipe(
    map(user => {
      if (user) {
        return {
          name: user.name || 'User',
          email: user.email || '',
          avatar: this.getInitials(user.name || 'U'),
          picture: user.picture || null,
          isGoogleUser: user.isGoogleUser || false
        };
      }
      return {
        name: 'Guest',
        email: '',
        avatar: 'G',
        picture: null,
        isGoogleUser: false
      };
    })
  );

  links = [
    { label: 'Profile', path: '/account/profile' },
    { label: 'Orders', path: '/account/orders' },
    { label: 'Wishlist', path: '/account/wishlist' }
  ];

  activeLink = this.links[0].path;
  imageError = false;

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
      
    // Set active link based on current url
    this.activeLink = this.router.url;
  }

  private getInitials(name: string): string {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  onImageError() {
    this.imageError = true;
  }
}

