import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { provideMockStore } from '@ngrx/store/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('App', () => {
  const initialState = {
    auth: { access: null, refresh: null, user: null, loading: false, error: null },
    cart: { items: [], promoCode: null, discount: 0, error: null },
    wishlist: { items: [] },
    navigation: { isMenuOpen: false }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App, RouterTestingModule, NoopAnimationsModule],
      providers: [provideMockStore({ initialState })]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});

