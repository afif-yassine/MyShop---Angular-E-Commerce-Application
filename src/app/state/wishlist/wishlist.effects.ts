import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, mergeMap, catchError, tap, take } from 'rxjs/operators';
import * as WishlistActions from './wishlist.actions';
import { selectWishlistItems } from './wishlist.selectors';
import { NotificationService } from '../../services/notification.service';

@Injectable()
export class WishlistEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private notifications = inject(NotificationService);

  loadWishlist$ = createEffect(() => this.actions$.pipe(
    ofType(WishlistActions.loadWishlist),
    map(() => {
      const saved = localStorage.getItem('wishlist');
      if (saved) {
        return WishlistActions.loadWishlistSuccess({ items: JSON.parse(saved) });
      }
      return WishlistActions.loadWishlistSuccess({ items: [] });
    })
  ));

  persistWishlist$ = createEffect(() => this.actions$.pipe(
    ofType(WishlistActions.addToWishlist, WishlistActions.removeFromWishlist, WishlistActions.toggleWishlist),
    // Wait for reducer to update
    mergeMap(() => this.store.select(selectWishlistItems).pipe(take(1))),
    tap(items => {
      localStorage.setItem('wishlist', JSON.stringify(items));
    })
  ), { dispatch: false });

  // ✅ Show notification when adding to wishlist
  showAddNotification$ = createEffect(() => this.actions$.pipe(
    ofType(WishlistActions.addToWishlist),
    tap(({ product }) => {
      this.notifications.success(`"${product.name}" ajouté à la wishlist`);
    })
  ), { dispatch: false });

  // ✅ Show notification when removing from wishlist
  showRemoveNotification$ = createEffect(() => this.actions$.pipe(
    ofType(WishlistActions.removeFromWishlist),
    tap(() => {
      this.notifications.info('Produit retiré de la wishlist');
    })
  ), { dispatch: false });

  // ✅ Show notification when toggling wishlist (used by ProductCard)
  showToggleNotification$ = createEffect(() => this.actions$.pipe(
    ofType(WishlistActions.toggleWishlist),
    tap(({ product }) => {
      // Check if product is being added or removed by checking current wishlist
      this.store.select(selectWishlistItems).pipe(take(1)).subscribe(items => {
        const isInWishlist = items.some(item => item.id === product.id);
        if (isInWishlist) {
          this.notifications.success(`"${product.name}" ajouté à la wishlist`);
        } else {
          this.notifications.info(`"${product.name}" retiré de la wishlist`);
        }
      });
    })
  ), { dispatch: false });
}
