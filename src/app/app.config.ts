import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection, isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';

import { authReducer } from './state/auth/auth.reducer';
import { AuthEffects } from './state/auth/auth.effects';
import { productsReducer } from './state/products/products.reducer';
import { ProductsEffects } from './state/products/products.effects';
import { cartReducer } from './state/cart/cart.reducer';
import { CartEffects } from './state/cart/cart.effects';
import { ordersReducer } from './state/orders/orders.reducer';
import { navigationReducer } from './state/navigation/navigation.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),

    // ⬇️ HERE: register your feature state
    provideStore({
      auth: authReducer,
      products: productsReducer,
      cart: cartReducer,
      orders: ordersReducer,
      navigation: navigationReducer,
    }),
    provideEffects([AuthEffects, ProductsEffects, CartEffects]),

    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
  ],
};

