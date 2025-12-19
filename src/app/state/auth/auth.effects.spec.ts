import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { AuthEffects } from './auth.effects';
import * as AuthActions from './auth.actions';
import { ShopApiService } from '../../services/shop-api.service';
import { NotificationService } from '../../services/notification.service';
import { Router } from '@angular/router';

describe('Auth Effects', () => {
  let actions$: Observable<any>;
  let effects: AuthEffects;
  let apiService: jasmine.SpyObj<ShopApiService>;
  let notificationService: jasmine.SpyObj<NotificationService>;
  let router: jasmine.SpyObj<Router>;

  const mockTokenResponse = {
    access: btoa(JSON.stringify({ id: 1, email: 'test@example.com', name: 'Test' })),
    refresh: 'refresh-token'
  };

  beforeEach(() => {
    const apiSpy = jasmine.createSpyObj('ShopApiService', ['login', 'register', 'loginWithGoogle']);
    const notificationSpy = jasmine.createSpyObj('NotificationService', ['success', 'error', 'warning', 'info']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthEffects,
        provideMockActions(() => actions$),
        { provide: ShopApiService, useValue: apiSpy },
        { provide: NotificationService, useValue: notificationSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    effects = TestBed.inject(AuthEffects);
    apiService = TestBed.inject(ShopApiService) as jasmine.SpyObj<ShopApiService>;
    notificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('login$', () => {
    it('should return loginSuccess on successful login', (done) => {
      apiService.login.and.returnValue(of(mockTokenResponse));
      actions$ = of(AuthActions.login({ username: 'test@example.com', password: 'password' }));

      effects.login$.subscribe((action: any) => {
        expect(action.type).toBe(AuthActions.loginSuccess.type);
        expect(action.access).toBe(mockTokenResponse.access);
        done();
      });
    });

    it('should return loginFailure on failed login', (done) => {
      apiService.login.and.returnValue(throwError(() => ({ message: 'Invalid credentials' })));
      actions$ = of(AuthActions.login({ username: 'test@example.com', password: 'wrong' }));

      effects.login$.subscribe((action: any) => {
        expect(action.type).toBe(AuthActions.loginFailure.type);
        expect(action.error).toBe('Invalid credentials');
        done();
      });
    });
  });

  describe('showLoginFailureNotification$', () => {
    it('should call error notification on login failure', (done) => {
      actions$ = of(AuthActions.loginFailure({ error: 'Invalid credentials' }));

      effects.showLoginFailureNotification$.subscribe(() => {
        expect(notificationService.error).toHaveBeenCalledWith('Échec de connexion: Invalid credentials');
        done();
      });
    });

    it('should call error notification on Google login failure', (done) => {
      actions$ = of(AuthActions.loginWithGoogleFailure({ error: 'Google auth failed' }));

      effects.showLoginFailureNotification$.subscribe(() => {
        expect(notificationService.error).toHaveBeenCalledWith('Échec de connexion: Google auth failed');
        done();
      });
    });
  });

  describe('redirectAfterLogin$', () => {
    it('should navigate to home on login success', (done) => {
      actions$ = of(AuthActions.loginSuccess({ 
        access: 'token', 
        refresh: 'refresh', 
        user: { id: 1 } 
      }));

      effects.redirectAfterLogin$.subscribe(() => {
        expect(router.navigate).toHaveBeenCalledWith(['/']);
        done();
      });
    });
  });

  describe('redirectAfterLogout$', () => {
    it('should navigate to home on logout', (done) => {
      actions$ = of(AuthActions.logout());

      effects.redirectAfterLogout$.subscribe(() => {
        expect(router.navigate).toHaveBeenCalledWith(['/']);
        done();
      });
    });
  });
});
