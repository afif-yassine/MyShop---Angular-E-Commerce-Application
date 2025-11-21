import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { selectCartCount } from '../../state/cart/cart.selectors';
import { selectAllNavigationItems } from '../../state/navigation/navigation.selectors';
import { selectIsLoggedIn } from '../../state/auth/auth.selectors';
import * as AuthActions from '../../state/auth/auth.actions';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'app-shop-header',
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatBadgeModule,
    MatButtonModule,
    MatToolbarModule,
    MatMenuModule,
    MatDividerModule,
  ],
  template: `
    <mat-toolbar color="primary">
      <a mat-button routerLink="/">
        <mat-icon>store</mat-icon>
        <span>My Shop</span>
      </a>
      
      <span style="flex: 1 1 auto;"></span>
      
      <ng-container *ngIf="visibleNavItems$ | async as navItems">
        <a
          *ngFor="let item of navItems"
          mat-button
          [routerLink]="item.path"
          routerLinkActive="active"
          [routerLinkActiveOptions]="{ exact: item.path === '/' }">
          <mat-icon>{{ item.icon }}</mat-icon>
          <span>{{ item.label }}</span>
        </a>
      </ng-container>
      
      <span style="flex: 1 1 auto;"></span>
      
      <a
        mat-icon-button
        routerLink="/shop/cart"
        routerLinkActive="active"
        [matBadge]="cartCount$ | async"
        [matBadgeHidden]="!(cartCount$ | async) || (cartCount$ | async) === 0"
        matBadgeColor="accent"
        matBadgeSize="small"
        aria-label="Shopping cart">
        <mat-icon>shopping_cart</mat-icon>
      </a>
      
      <ng-container *ngIf="!(isLoggedIn$ | async)">
        <a mat-button routerLink="/login" routerLinkActive="active">
          <mat-icon>login</mat-icon>
          <span>Login</span>
        </a>
        <a mat-raised-button color="accent" routerLink="/register" routerLinkActive="active">
          <mat-icon>person_add</mat-icon>
          <span>Register</span>
        </a>
      </ng-container>
      
      <button
        *ngIf="isLoggedIn$ | async"
        mat-icon-button
        [matMenuTriggerFor]="userMenu"
        aria-label="User menu">
        <mat-icon>account_circle</mat-icon>
      </button>
      
      <mat-menu #userMenu="matMenu">
        <button mat-menu-item routerLink="/account">
          <mat-icon>person</mat-icon>
          <span>Account</span>
        </button>
        <mat-divider></mat-divider>
        <button mat-menu-item (click)="logout()">
          <mat-icon>logout</mat-icon>
          <span>Logout</span>
        </button>
      </mat-menu>
    </mat-toolbar>
  `,
})
export class ShopHeaderComponent {
  private store = inject(Store);
  private router = inject(Router);

  isLoggedIn$ = this.store.select(selectIsLoggedIn);
  allNavItems$ = this.store.select(selectAllNavigationItems);
  cartCount$ = this.store.select(selectCartCount);

  visibleNavItems$ = combineLatest([
    this.allNavItems$,
    this.isLoggedIn$,
  ]).pipe(
    map(([items, isLoggedIn]) =>
      items.filter((item) => {
        if (item.requiresAuth && !isLoggedIn) return false;
        if (item.showWhenLoggedIn && !isLoggedIn) return false;
        if (item.showWhenLoggedOut && isLoggedIn) return false;
        return true;
      })
    )
  );

  logout() {
    this.store.dispatch(AuthActions.logout());
    this.router.navigate(['/']);
  }
}

