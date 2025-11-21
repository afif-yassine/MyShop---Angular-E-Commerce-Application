import { createReducer, on } from '@ngrx/store';
import * as CartActions from './cart.actions';

export interface CartState {
  items: CartActions.CartItem[];
}

export const initialState: CartState = {
  items: [],
};

export const cartReducer = createReducer(
  initialState,

  on(CartActions.addItem, (state, { product, quantity }) => {
    const existingItem = state.items.find((item) => item.product.id === product.id);
    if (existingItem) {
      return {
        ...state,
        items: state.items.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        ),
      };
    }
    return {
      ...state,
      items: [...state.items, { product, quantity }],
    };
  }),

  on(CartActions.removeItem, (state, { productId }) => ({
    ...state,
    items: state.items.filter((item) => item.product.id !== productId),
  })),

  on(CartActions.updateQuantity, (state, { productId, quantity }) => {
    if (quantity <= 0) {
      return {
        ...state,
        items: state.items.filter((item) => item.product.id !== productId),
      };
    }
    return {
      ...state,
      items: state.items.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      ),
    };
  }),

  on(CartActions.clearCart, (state) => ({
    ...state,
    items: [],
  })),

  on(CartActions.loadCartFromStorage, (state, { items }) => ({
    ...state,
    items,
  }))
);

