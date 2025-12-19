import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import * as CartActions from './cart/cart.actions';
import * as WishlistActions from './wishlist/wishlist.actions';
import * as ReviewsActions from './reviews/reviews.actions';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class NotificationEffects {
  private actions$ = inject(Actions);
  private notifications = inject(NotificationService);

  showSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(
      CartActions.addItem,
      CartActions.applyPromoCodeSuccess
    ),
    tap((action) => {
      if (action.type === CartActions.addItem.type) {
        this.notifications.success('Produit ajouté au panier');
      } else if (action.type === CartActions.applyPromoCodeSuccess.type) {
        this.notifications.success('Code promo appliqué !');
      }
    })
  ), { dispatch: false });

  showError$ = createEffect(() => this.actions$.pipe(
    ofType(
      CartActions.applyPromoCodeFailure
    ),
    tap((action) => {
      let message = 'Une erreur est survenue';
      if ('error' in action) {
        message = action.error;
      }
      this.notifications.error(message);
    })
  ), { dispatch: false });
}
