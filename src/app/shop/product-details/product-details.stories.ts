import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideStore } from '@ngrx/store';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ProductDetailsPageComponent } from './product-details-page.component';
import { cartReducer } from '../../state/cart/cart.reducer';
import { wishlistReducer } from '../../state/wishlist/wishlist.reducer';
import { productsReducer } from '../../state/products/products.reducer';
import { reviewsReducer } from '../../state/reviews/reviews.reducer';

const meta: Meta<ProductDetailsPageComponent> = {
  title: 'Shop/ProductDetails',
  component: ProductDetailsPageComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    applicationConfig({
      providers: [
        provideStore({ 
          cart: cartReducer, 
          wishlist: wishlistReducer,
          products: productsReducer,
          reviews: reviewsReducer
        }),
        provideRouter([
          { path: '**', component: ProductDetailsPageComponent }
        ]),
        provideHttpClient(),
        provideAnimations()
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<ProductDetailsPageComponent>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Product details page showing product info, images, stock status, and reviews.',
      },
    },
  },
};

export const HighRating: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Product with high customer rating.',
      },
    },
  },
};

export const ExpensiveProduct: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Premium priced product.',
      },
    },
  },
};
