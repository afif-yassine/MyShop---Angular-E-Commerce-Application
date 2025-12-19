import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of } from 'rxjs';
import { NotificationEffects } from './notification.effects';
import * as CartActions from './cart/cart.actions';
import { NotificationService } from '../services/notification.service';
import { Product } from '../../mocks/data';

describe('Notification Effects', () => {
  let actions$: Observable<any>;
  let effects: NotificationEffects;
  let notificationService: jasmine.SpyObj<NotificationService>;

  const mockProduct: Product = {
    id: 1,
    name: 'Test Product',
    price: 99.99,
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

  beforeEach(() => {
    const notificationSpy = jasmine.createSpyObj('NotificationService', ['success', 'error', 'warning', 'info']);

    TestBed.configureTestingModule({
      providers: [
        NotificationEffects,
        provideMockActions(() => actions$),
        { provide: NotificationService, useValue: notificationSpy }
      ]
    });

    effects = TestBed.inject(NotificationEffects);
    notificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
  });

  describe('showSuccess$', () => {
    it('should call success notification when addItem action is dispatched', (done) => {
      actions$ = of(CartActions.addItem({ product: mockProduct, quantity: 1 }));

      effects.showSuccess$.subscribe(() => {
        expect(notificationService.success).toHaveBeenCalledWith('Produit ajouté au panier');
        done();
      });
    });

    it('should call success notification when promo code is applied successfully', (done) => {
      actions$ = of(CartActions.applyPromoCodeSuccess({ code: 'SAVE10', discount: 10 }));

      effects.showSuccess$.subscribe(() => {
        expect(notificationService.success).toHaveBeenCalledWith('Code promo appliqué !');
        done();
      });
    });
  });

  describe('showError$', () => {
    it('should call error notification when promo code fails', (done) => {
      actions$ = of(CartActions.applyPromoCodeFailure({ error: 'Code invalide' }));

      effects.showError$.subscribe(() => {
        expect(notificationService.error).toHaveBeenCalledWith('Code invalide');
        done();
      });
    });
  });
});
