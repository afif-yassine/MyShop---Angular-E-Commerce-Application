import * as fromCart from './cart.selectors';
import { CartState } from './cart.reducer';
import { Product } from '../../../mocks/data';

describe('Cart Selectors', () => {
  // Mock products
  const mockProduct1: Product = {
    id: 1,
    name: 'Product 1',
    price: 100,
    created_at: '2024-01-01',
    owner_id: 1,
    ratings: [],
    stock: 10,
    lowStockThreshold: 5,
    description: 'Test',
    category: 'Test',
    rating: 4,
    image: '',
    features: []
  };

  const mockProduct2: Product = {
    ...mockProduct1,
    id: 2,
    name: 'Product 2',
    price: 50
  };

  // Initial state for testing
  const emptyState: CartState = {
    items: [],
    promoCode: null,
    discount: 0,
    error: null
  };

  const stateWithItems: CartState = {
    items: [
      { product: mockProduct1, quantity: 2 }, // 2 * 100 = 200
      { product: mockProduct2, quantity: 3 }  // 3 * 50 = 150
    ],
    promoCode: 'SAVE20',
    discount: 20,
    error: null
  };

  describe('selectCartItems', () => {
    it('should return empty array for empty cart', () => {
      const result = fromCart.selectCartItems.projector(emptyState);
      expect(result).toEqual([]);
    });

    it('should return all cart items', () => {
      const result = fromCart.selectCartItems.projector(stateWithItems);
      expect(result.length).toBe(2);
      expect(result[0].product.name).toBe('Product 1');
    });
  });

  describe('selectCartCount', () => {
    it('should return 0 for empty cart', () => {
      const result = fromCart.selectCartCount.projector([]);
      expect(result).toBe(0);
    });

    it('should return total quantity of all items', () => {
      const result = fromCart.selectCartCount.projector(stateWithItems.items);
      expect(result).toBe(5); // 2 + 3
    });
  });

  describe('selectCartTotal', () => {
    it('should return 0 for empty cart', () => {
      const result = fromCart.selectCartTotal.projector([]);
      expect(result).toBe(0);
    });

    it('should calculate total price of all items', () => {
      const result = fromCart.selectCartTotal.projector(stateWithItems.items);
      expect(result).toBe(350); // (2 * 100) + (3 * 50)
    });
  });

  describe('selectPromoCode', () => {
    it('should return null when no promo code applied', () => {
      const result = fromCart.selectPromoCode.projector(emptyState);
      expect(result).toBeNull();
    });

    it('should return applied promo code', () => {
      const result = fromCart.selectPromoCode.projector(stateWithItems);
      expect(result).toBe('SAVE20');
    });
  });

  describe('selectDiscount', () => {
    it('should return 0 when no discount', () => {
      const result = fromCart.selectDiscount.projector(emptyState);
      expect(result).toBe(0);
    });

    it('should return discount amount', () => {
      const result = fromCart.selectDiscount.projector(stateWithItems);
      expect(result).toBe(20);
    });
  });

  describe('selectTotalWithDiscount', () => {
    it('should return total minus discount', () => {
      const total = 350;
      const discount = 20;
      const result = fromCart.selectTotalWithDiscount.projector(total, discount);
      expect(result).toBe(330);
    });

    it('should not go below 0', () => {
      const total = 10;
      const discount = 50;
      const result = fromCart.selectTotalWithDiscount.projector(total, discount);
      expect(result).toBe(0);
    });
  });
});
