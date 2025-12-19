import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, of } from 'rxjs';
import { Router } from '@angular/router';
import * as ProductsActions from './products.actions';
import { ShopApiService } from '../../services/shop-api.service';

@Injectable()
export class ProductsEffects {
  private actions$ = inject(Actions);
  private api = inject(ShopApiService);

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

  private router = inject(Router);
}

