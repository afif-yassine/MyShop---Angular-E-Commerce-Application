import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import * as ProductsActions from './products.actions';
import { ShopApiService } from '../../services/shop-api.service';
import { NotificationService } from '../../services/notification.service';

@Injectable()
export class ProductsEffects {
  private actions$ = inject(Actions);
  private api = inject(ShopApiService);
  private router = inject(Router);
  private notifications = inject(NotificationService);

  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.loadProducts),
      switchMap(({ params }) =>
        this.api.getProducts(params).pipe(
          map((response) =>
            ProductsActions.loadProductsSuccess({ response, params })
          ),
          catchError((error) =>
            of(
              ProductsActions.loadProductsFailure({
                error: error?.message ?? 'Failed to load products',
              })
            )
          )
        )
      )
    )
  );

  // ✅ Scenario 2: Show notification on products loading failure
  showProductsLoadFailureNotification$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ProductsActions.loadProductsFailure),
        tap(({ error }) => {
          this.notifications.error(`Échec du chargement des produits: ${error}`);
        })
      ),
    { dispatch: false }
  );

  addProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.addProduct),
      switchMap(({ product }) =>
        this.api.addProduct(product).pipe(
          map((newProduct) => {
            this.router.navigate(['/shop/products']);
            return ProductsActions.addProductSuccess({ product: newProduct });
          }),
          catchError((error: any) =>
            of(
              ProductsActions.addProductFailure({
                error: error?.message ?? 'Failed to add product',
              })
            )
          )
        )
      )
    )
  );
}

