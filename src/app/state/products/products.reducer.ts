import { createReducer, on } from '@ngrx/store';
import * as ProductsActions from './products.actions';
import { Product } from '../../../mocks/data';

export interface ProductsState {
  list: Product[];
  count: number;
  loading: boolean;
  error: string | null;
  lastQueryParams: ProductsActions.ProductsQueryParams | null;
}

export const initialState: ProductsState = {
  list: [],
  count: 0,
  loading: false,
  error: null,
  lastQueryParams: null,
};

export const productsReducer = createReducer(
  initialState,

  on(ProductsActions.loadProducts, (state, { params }) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(ProductsActions.loadProductsSuccess, (state, { response, params }) => ({
    ...state,
    list: response.results,
    count: response.count,
    loading: false,
    error: null,
    lastQueryParams: params,
  })),

  on(ProductsActions.loadProductsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);

