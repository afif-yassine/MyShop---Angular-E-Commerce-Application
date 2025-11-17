import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, of } from 'rxjs';
import * as AuthActions from './auth.actions';
import { ShopApiService } from '../../services/shop-api.service';

@Injectable()
export class AuthEffects {
  // ✅ inject() works safely with class field initializers
  private actions$ = inject(Actions);
  private api = inject(ShopApiService);

  // Effect: login
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ username, password }) =>
        this.api.login(username, password).pipe(
          map(({ access, refresh }) =>
            AuthActions.loginSuccess({ access, refresh })
          ),
          catchError((error) =>
            of(
              AuthActions.loginFailure({
                error: error?.message ?? 'Login failed',
              })
            )
          )
        )
      )
    )
  );
}
