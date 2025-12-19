import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductCardComponent } from './product-card.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import * as CartActions from '../../state/cart/cart.actions';
import * as WishlistActions from '../../state/wishlist/wishlist.actions';

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;
  let store: MockStore;
  let dispatchSpy: jasmine.Spy;

  const initialState = {
    wishlist: {
      items: []
    },
    cart: {
      items: []
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ProductCardComponent,
        RouterTestingModule,
        NoopAnimationsModule
      ],
      providers: [
        provideMockStore({ initialState })
      ]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    dispatchSpy = spyOn(store, 'dispatch');
    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    
    // Set inputs
    component.id = 1;
    component.name = 'Test Product';
    component.price = 99.99;
    component.stock = 10;
    component.category = 'Electronics';
    component.description = 'Test description';
    component.created_at = '2024-01-01';
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display product name', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.product-title').textContent).toContain('Test Product');
  });

  it('should display product price', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.price').textContent).toContain('99.99');
  });

  it('should display category', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.category-chip').textContent).toContain('Electronics');
  });

  describe('onAddToCart', () => {
    it('should dispatch addItem action when stock > 0', () => {
      const event = new MouseEvent('click');
      spyOn(event, 'stopPropagation');
      
      component.onAddToCart(event);

      expect(event.stopPropagation).toHaveBeenCalled();
      expect(dispatchSpy).toHaveBeenCalled();
      const action = dispatchSpy.calls.mostRecent().args[0];
      expect(action.type).toBe('[Cart] Add Item');
      expect(action.product.id).toBe(1);
      expect(action.product.name).toBe('Test Product');
      expect(action.quantity).toBe(1);
    });

    it('should not dispatch when stock is 0', () => {
      component.stock = 0;
      const event = new MouseEvent('click');
      
      component.onAddToCart(event);

      expect(dispatchSpy).not.toHaveBeenCalled();
    });
  });

  describe('toggleWishlist', () => {
    it('should dispatch toggleWishlist action', () => {
      const event = new MouseEvent('click');
      spyOn(event, 'stopPropagation');
      
      component.toggleWishlist(event);

      expect(event.stopPropagation).toHaveBeenCalled();
      expect(dispatchSpy).toHaveBeenCalled();
      const action = dispatchSpy.calls.mostRecent().args[0];
      expect(action.type).toBe('[Wishlist] Toggle Wishlist');
      expect(action.product.id).toBe(1);
      expect(action.product.name).toBe('Test Product');
    });
  });

  describe('stock display', () => {
    it('should show "In Stock" when stock is above threshold', () => {
      component.stock = 20;
      component.lowStockThreshold = 10;
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('.in-stock')).toBeTruthy();
    });

    it('should show low stock warning when stock is below threshold', () => {
      component.stock = 3;
      component.lowStockThreshold = 10;
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('.low-stock')).toBeTruthy();
    });

    it('should show "Out of Stock" when stock is 0', () => {
      component.stock = 0;
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('.out-of-stock')).toBeTruthy();
    });
  });

  describe('formatDate', () => {
    it('should format date string', () => {
      const result = component.formatDate('2024-01-15');
      expect(result).toBeTruthy();
      // Date format depends on locale
    });
  });
});
