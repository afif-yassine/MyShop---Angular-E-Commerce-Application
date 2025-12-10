import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import { selectAuthToken } from '../state/auth/auth.selectors';

export const authGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectAuthToken).pipe(
    take(1),
    map((token) => {
      if (token) {
        return true;
      } else {
        router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
      }
    })
  );
};

export const adminGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectAuthToken).pipe( // Ideally selectUser and check isAdmin
    take(1),
    map((token) => {
      // For now, we decode the token again or check the store user
      // But since we don't have a selectUser yet, let's just check token existence and maybe role if possible
      // Better: Let's assume we have selectUser
      if (token) {
         // In a real app we would check user.isAdmin
         // For this mock, let's check if the token payload has isAdmin
         try {
            const payload = JSON.parse(atob(token));
            if (payload.isAdmin) {
                return true;
            }
         } catch (e) {}
      }
      
      router.navigate(['/']);
      return false;
    })
  );
};

