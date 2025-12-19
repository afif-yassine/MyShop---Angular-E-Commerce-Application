import { cartReducer, initialState, CartState } from './cart.reducer';
import * as CartActions from './cart.actions';
import { Product } from '../../../mocks/data';

describe('Cart Reducer', () => {
  // Mock product for testing
  const mockProduct: Product = {
    id: 1,
    name: 'Test Product',
    price: 99.99,
    created_at: '2024-01-01',
    owner_id: 1,
    ratings: [],
    stock: 10,
    lowStockThreshold: 5,
    description: 'Test description',
    category: 'Test',
    rating: 4.5,
    image: 'test.jpg',
    features: []
  };

  const mockProduct2: Product = {
    ...mockProduct,
    id: 2,
    name: 'Test Product 2',
    price: 49.99
  };

  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = { type: 'Unknown' };
      const result = cartReducer(initialState, action);
      expect(result).toBe(initialState);
    });
  });

  describe('addItem action', () => {
    it('should add a new item to an empty cart', () => {
      const action = CartActions.addItem({ product: mockProduct, quantity: 1 });
      const result = cartReducer(initialState, action);

      expect(result.items.length).toBe(1);
      expect(result.items[0].product.id).toBe(1);
      expect(result.items[0].quantity).toBe(1);
    });

    it('should increase quantity if product already exists', () => {
      const stateWithItem: CartState = {
        ...initialState,
        items: [{ product: mockProduct, quantity: 2 }]
      };
      const action = CartActions.addItem({ product: mockProduct, quantity: 3 });
      const result = cartReducer(stateWithItem, action);

      expect(result.items.length).toBe(1);
      expect(result.items[0].quantity).toBe(5);
    });

    it('should add different products separately', () => {
      const stateWithItem: CartState = {
        ...initialState,
        items: [{ product: mockProduct, quantity: 1 }]
      };
      const action = CartActions.addItem({ product: mockProduct2, quantity: 2 });
      const result = cartReducer(stateWithItem, action);

      expect(result.items.length).toBe(2);
      expect(result.items[0].product.id).toBe(1);
      expect(result.items[1].product.id).toBe(2);
    });
  });

  describe('removeItem action', () => {
    it('should remove an item from the cart', () => {
      const stateWithItems: CartState = {
        ...initialState,
        items: [
          { product: mockProduct, quantity: 1 },
          { product: mockProduct2, quantity: 2 }
        ]
      };
      const action = CartActions.removeItem({ productId: 1 });
      const result = cartReducer(stateWithItems, action);

      expect(result.items.length).toBe(1);
      expect(result.items[0].product.id).toBe(2);
    });

    it('should do nothing if product does not exist', () => {
      const stateWithItem: CartState = {
        ...initialState,
        items: [{ product: mockProduct, quantity: 1 }]
      };
      const action = CartActions.removeItem({ productId: 999 });
      const result = cartReducer(stateWithItem, action);

      expect(result.items.length).toBe(1);
    });
  });

  describe('updateQuantity action', () => {
    it('should update quantity of an existing item', () => {
      const stateWithItem: CartState = {
        ...initialState,
        items: [{ product: mockProduct, quantity: 2 }]
      };
      const action = CartActions.updateQuantity({ productId: 1, quantity: 5 });
      const result = cartReducer(stateWithItem, action);

      expect(result.items[0].quantity).toBe(5);
    });

    it('should remove item if quantity is 0 or less', () => {
      const stateWithItem: CartState = {
        ...initialState,
        items: [{ product: mockProduct, quantity: 2 }]
      };
      const action = CartActions.updateQuantity({ productId: 1, quantity: 0 });
      const result = cartReducer(stateWithItem, action);

      expect(result.items.length).toBe(0);
    });
  });

  describe('clearCart action', () => {
    it('should clear all items and promo code', () => {
      const stateWithData: CartState = {
        items: [{ product: mockProduct, quantity: 2 }],
        promoCode: 'SAVE10',
        discount: 10,
        error: null
      };
      const action = CartActions.clearCart();
      const result = cartReducer(stateWithData, action);

      expect(result.items.length).toBe(0);
      expect(result.promoCode).toBeNull();
      expect(result.discount).toBe(0);
    });
  });

  describe('promo code actions', () => {
    it('should apply promo code on success', () => {
      const action = CartActions.applyPromoCodeSuccess({ code: 'SAVE20', discount: 20 });
      const result = cartReducer(initialState, action);

      expect(result.promoCode).toBe('SAVE20');
      expect(result.discount).toBe(20);
      expect(result.error).toBeNull();
    });

    it('should set error on failure', () => {
      const action = CartActions.applyPromoCodeFailure({ error: 'Invalid code' });
      const result = cartReducer(initialState, action);

      expect(result.error).toBe('Invalid code');
      expect(result.promoCode).toBeNull();
      expect(result.discount).toBe(0);
    });

    it('should remove promo code', () => {
      const stateWithPromo: CartState = {
        ...initialState,
        promoCode: 'SAVE20',
        discount: 20
      };
      const action = CartActions.removePromoCode();
      const result = cartReducer(stateWithPromo, action);

      expect(result.promoCode).toBeNull();
      expect(result.discount).toBe(0);
    });
  });
});
