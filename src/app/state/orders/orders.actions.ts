import { createAction, props } from '@ngrx/store';

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  items: Array<{
    productId: number;
    productName: string;
    quantity: number;
    price: number;
  }>;
  address?: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    zip: string;
  };
}

export const addOrder = createAction(
  '[Orders] Add Order',
  props<{ order: Order }>()
);

export const loadOrdersFromStorage = createAction(
  '[Orders] Load Orders From Storage',
  props<{ orders: Order[] }>()
);

export const updateOrderStatus = createAction(
  '[Orders] Update Order Status',
  props<{ orderId: string; status: Order['status'] }>()
);

