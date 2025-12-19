import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { catchError, map, switchMap, of, tap } from 'rxjs';
import * as AuthActions from './auth.actions';
import { ShopApiService } from '../../services/shop-api.service';
import { NotificationService } from '../../services/notification.service';

@Injectable()
export class AuthEffects {
  // ✅ inject() works safely with class field initializers
  private actions$ = inject(Actions);
  private api = inject(ShopApiService);
  private router = inject(Router);
  private notifications = inject(NotificationService);

  // Effect: login
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ username, password }) =>
        this.api.login(username, password).pipe(
          map(({ access, refresh }) => {
            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);
            
            // Decode mock token
            const payload = JSON.parse(atob(access));
            return AuthActions.loginSuccess({ access, refresh, user: payload });
          }),
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

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      switchMap(({ name, email, password }) =>
        this.api.register(name, email, password).pipe(
          map(({ access, refresh }) => {
            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);

            // Decode mock token
            const payload = JSON.parse(atob(access));
            return AuthActions.loginSuccess({ access, refresh, user: payload });
          }),
          catchError((error) =>
            of(
              AuthActions.loginFailure({
                error: error?.message ?? 'Registration failed',
              })
            )
          )
        )
      )
    )
  );

  // Effect: Google Login
  loginWithGoogle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginWithGoogle),
      switchMap(({ googleUser }) =>
        this.api.loginWithGoogle(googleUser).pipe(
          map(({ access, refresh }) => {
            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);

            // Decode token
            const payload = JSON.parse(atob(access));
            return AuthActions.loginWithGoogleSuccess({ access, refresh, user: payload });
          }),
          catchError((error) =>
            of(
              AuthActions.loginWithGoogleFailure({
                error: error?.message ?? 'Google login failed',
              })
            )
          )
        )
      )
    )
  );

  // ✅ Scenario 1: Show notification on login failure
  showLoginFailureNotification$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginFailure, AuthActions.loginWithGoogleFailure),
        tap(({ error }) => {
          this.notifications.error(`Échec de connexion: ${error}`);
        })
      ),
    { dispatch: false }
  );

  redirectAfterLogin$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess, AuthActions.loginWithGoogleSuccess),
        tap(() => this.router.navigate(['/']))
      ),
    { dispatch: false }
  );

  // Redirect to home after logout
  redirectAfterLogout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => this.router.navigate(['/']))
      ),
    { dispatch: false }
  );
}
