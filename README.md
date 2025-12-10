************\*\*\*************#### YASSINE AFIF ####************\*\*\*\*************

# remote

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
- **Products State**: `src/app/state/products/`
- **Cart State**: `src/app/state/cart/`
- **Wishlist State**: `src/app/state/wishlist/`
- **Reviews State**: `src/app/state/reviews/`
- **Orders State**: `src/app/state/orders/`

State is registered in `src/app/app.config.ts` using `provideStore()` and effects are registered with `provideEffects()`.

### Architecture

The application follows a modular architecture with lazy loading:

- **Core Modules**:
  - `ShopModule`: Products, Cart, Checkout, Wishlist
  - `AccountModule`: User Profile, Orders
  - `AdminModule`: Dashboard, Stats

- **Standalone Components**: Used throughout for better tree-shaking and modularity.

### API Layer

The `ShopApiService` (`src/app/services/shop-api.service.ts`) handles all HTTP requests, including new endpoints for wishlist, reviews, and orders.

### Routing

Routes are defined in `src/app/app.routes.ts` and use lazy loading:

- `/shop` - Shop module (Products, Cart, Checkout, Wishlist)
- `/account` - Account module (Profile, Orders)
- `/admin` - Admin module (Dashboard)
- `/login` - Login page

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
