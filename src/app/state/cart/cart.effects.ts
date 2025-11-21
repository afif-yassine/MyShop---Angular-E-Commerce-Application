import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { tap, withLatestFrom, take } from 'rxjs/operators';
import * as CartActions from './cart.actions';
import { selectCartItems } from './cart.selectors';

@Injectable()
export class CartEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);

  // Sync cart to localStorage whenever cart changes
  syncCartToStorage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          CartActions.addItem,
          CartActions.removeItem,
          CartActions.updateQuantity,
          CartActions.clearCart
        ),
        withLatestFrom(this.store.select(selectCartItems)),
        tap(([, items]) => {
          try {
            localStorage.setItem('cart', JSON.stringify(items));
          } catch (error) {
            console.error('Failed to save cart to localStorage:', error);
          }
        })
      ),
    { dispatch: false }
  );
}

