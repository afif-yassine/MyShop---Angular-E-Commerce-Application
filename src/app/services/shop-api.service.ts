import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductsQueryParams, ProductsResponse } from '../state/products/products.actions';
import { Product } from '../../mocks/data';

export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface RefreshResponse {
  access: string;
}

export interface ProductRatingResponse {
  product_id: number;
  avg_rating: number;
  count: number;
}

export interface CartValidationResponse {
  valid: boolean;
  total: number;
  items: Array<{
    product_id: number;
    quantity: number;
    price: number;
  }>;
}

export interface OrderRequest {
  items: Array<{
    product_id: number;
    quantity: number;
  }>;
  address: {
    fullName: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

export interface OrderResponse {
  order_number: string;
  total: number;
}

@Injectable({ providedIn: 'root' })
export class ShopApiService {
  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/api/auth/token/', {
      username,
      password,
    });
  }

  refresh(refreshToken: string): Observable<RefreshResponse> {
    return this.http.post<RefreshResponse>('/api/auth/token/refresh/', {
      refresh: refreshToken,
    });
  }

  getProducts(params: ProductsQueryParams): Observable<ProductsResponse> {
    let httpParams = new HttpParams();
    if (params.page) {
      httpParams = httpParams.set('page', params.page.toString());
    }
    if (params.pageSize) {
      httpParams = httpParams.set('page_size', params.pageSize.toString());
    }
    if (params.minRating !== undefined) {
      httpParams = httpParams.set('min_rating', params.minRating.toString());
    }
    if (params.ordering) {
      httpParams = httpParams.set('ordering', params.ordering);
    }

    return this.http.get<ProductsResponse>('/api/products/', { params: httpParams });
  }

  getRating(productId: number): Observable<ProductRatingResponse> {
    return this.http.get<ProductRatingResponse>(`/api/products/${productId}/rating/`);
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`/api/products/${id}`);
  }

  validateCart(items: Array<{ product_id: number; quantity: number }>): Observable<CartValidationResponse> {
    return this.http.post<CartValidationResponse>('/api/cart/validate', { items });
  }

  createOrder(orderData: OrderRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>('/api/order', orderData);
  }
}
