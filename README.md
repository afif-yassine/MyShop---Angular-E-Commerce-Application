************\*\*\*************#### YASSINE AFIF ####************\*\*\*\*************

# MyShop - Angular E-Commerce Application

This project is an Angular-based e-commerce application that demonstrates modern Angular development practices including NgRx state management, Angular Material UI components, and Storybook for component development.

## Project Goal

This application implements a shop management system with the following features:

- User authentication (login with JWT tokens)
- Product listing with filtering and pagination
- Product rating information display
- State management using NgRx
- Component development with Storybook

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

### Running the Application

1. Start the development server:

```bash
npm start
# or
ng serve
```

2. Open your browser and navigate to `http://localhost:4200/`

The application will automatically reload when you modify source files.

### Running Storybook

To view and develop components in isolation:

```bash
npm run storybook
```

Storybook will be available at `http://localhost:6006/`

### MSW (Mock Service Worker)

The project uses MSW to mock API endpoints during development. The mock service worker is automatically configured and will intercept API calls to:

- `/api/auth/token/` - Login endpoint
- `/api/auth/token/refresh/` - Token refresh endpoint
- `/api/products/` - Products listing endpoint
- `/api/products/:id/rating/` - Product rating endpoint

No additional configuration is needed - MSW runs automatically in development mode.

## Project Structure

### State Management (NgRx)

The application uses NgRx for state management. State slices are located in:

- **Auth State**: `src/app/state/auth/`
  - `auth.actions.ts` - Auth actions (login, loginSuccess, loginFailure)
  - `auth.reducer.ts` - Auth reducer and state interface
  - `auth.selectors.ts` - Auth selectors
  - `auth.effects.ts` - Auth side effects (API calls)

- **Products State**: `src/app/state/products/`
  - `products.actions.ts` - Products actions (loadProducts, loadProductsSuccess, loadProductsFailure)
  - `products.reducer.ts` - Products reducer and state interface
  - `products.selectors.ts` - Products selectors
  - `products.effects.ts` - Products side effects (API calls)

State is registered in `src/app/app.config.ts` using `provideStore()` and effects are registered with `provideEffects()`.

### Architecture

The application follows a container/presentational component pattern:

- **Container Components** (pages): Connect to NgRx store, handle business logic
  - `src/app/pages/login-page/` - Login page
  - `src/app/pages/products-page/` - Products listing page
  - `src/app/pages/product-rating-page/` - Product rating page

- **Presentational Components**: Pure UI components, no NgRx dependencies
  - `src/app/components/product-card/` - Product card display
  - `src/app/components/products-list/` - Products list display
  - `src/app/components/login-form/` - Login form component

### API Layer

The `ShopApiService` (`src/app/services/shop-api.service.ts`) handles all HTTP requests:

- `login(username, password)` - Authenticate user
- `refresh(refreshToken)` - Refresh access token
- `getProducts(params)` - Fetch products with filters
- `getRating(productId)` - Get product rating information

### Routing

Routes are defined in `src/app/app.routes.ts`:

- `/login` - Login page
- `/shop/products` - Products listing page
- `/shop/rating` - Product rating page
- `/app` - App placeholder with navigation links

## Quick Usage Flow

1. **Login**
   - Navigate to `/login`
   - Enter credentials (demo/demo for testing)
   - Submit the form
   - Access token is stored in NgRx auth state

2. **View Products**
   - Navigate to `/shop/products`
   - Use filters (min rating, ordering)
   - Products are loaded via NgRx effects
   - Pagination is available

3. **Check Product Rating**
   - Navigate to `/shop/rating`
   - Enter a product ID
   - View rating information (average rating, count)

4. **Storybook**
   - Run `npm run storybook`
   - Browse component stories
   - Test components in isolation

## Building

To build the project for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Testing

To run unit tests:

```bash
npm test
```

## Additional Resources

- [Angular Documentation](https://angular.dev)
- [NgRx Documentation](https://ngrx.io)
- [Angular Material](https://material.angular.io)
- [Storybook Documentation](https://storybook.js.org)

## Documentation

For detailed architecture documentation, see [docs/architecture.md](./docs/architecture.md).
