import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import { selectCartItems } from '../state/cart/cart.selectors';

/**
 * Guard that prevents access to checkout if cart is empty.
 * Redirects to /shop/cart with a message.
 */
export const cartNotEmptyGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectCartItems).pipe(
    take(1),
    map(items => {
      if (items.length === 0) {
        router.navigate(['/shop/cart']);
        return false;
      }
      return true;
    })
  );
};
