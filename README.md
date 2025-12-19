# 🛍️ LuxeShop - Premium Angular E-Commerce Application

![Angular](https://img.shields.io/badge/Angular-18+-dd0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![NgRx](https://img.shields.io/badge/NgRx-State_Management-ba2bd2.svg?style=for-the-badge&logo=ngrx&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Material UI](https://img.shields.io/badge/Material_UI-0081CB?style=for-the-badge&logo=material-ui&logoColor=white)
![Storybook](https://img.shields.io/badge/Storybook-FF4785?style=for-the-badge&logo=storybook&logoColor=white)

**LuxeShop** is a state-of-the-art, premium e-commerce platform built with modern web technologies. It delivers a seamless, high-performance shopping experience with a focus on aesthetic excellence and robust architecture.

---

## 📋 Exercise Summary

### Exercises 1 & 2 (Base Features)
- ✅ **Authentication** - JWT-based login/register with token storage
- ✅ **Product Catalog** - Dynamic listing with filters & pagination
- ✅ **Product Ratings** - Average rating display
- ✅ **Shopping Cart** - Add/remove/update with localStorage persistence
- ✅ **Multi-step Checkout** - Summary → Address → Confirmation
- ✅ **Product Details** - Rich product pages with add to cart
- ✅ **Storybook** - Basic component stories

### Exercise 3 (Advanced Features) ✨
- ✅ **User Account** - Profile management with preferences
- ✅ **User Preferences** - Newsletter subscription & default min rating filter
- ✅ **Order History** - Full order list with status filtering & search
- ✅ **Order Details** - Complete breakdown (items, taxes, shipping, discounts)
- ✅ **Wishlist** - Add/remove favorites with heart animation
- ✅ **Reviews System** - Customer reviews with ratings
- ✅ **Promo Codes** - WELCOME10, FREESHIP, VIP20 discounts
- ✅ **Stock Management** - In stock / Low stock / Out of stock display
- ✅ **Admin Dashboard** - Stats, top products, recent orders
- ✅ **Product Creation** - Admin can add new products
- ✅ **Performance Optimizations** - Lazy loading, OnPush, memoized selectors

---

## ✨ Key Features

### 🎨 Premium UI/UX
- **Responsive Design:** Fluid layout adapting to mobile, tablet, and desktop
- **Glassmorphism & Animations:** Micro-interactions and smooth transitions
- **Sticky Header:** Dynamic header with scroll behavior
- **Stock Status Badges:** Visual indicators for product availability

### 🛒 Shopping Experience
- **Product Catalog:** Dynamic filtering, category browsing, search
- **Product Details:** Image galleries, stock status, customer reviews
- **Shopping Cart:** Real-time management with persistent state
- **Promo Codes:** Apply discount codes at checkout
- **Checkout Process:** Multi-step flow with price breakdown
- **Wishlist:** Save favorites with animated heart toggle

### 👤 User Account
- **Profile Management:** Edit name, contact info, default address
- **Preferences:** Newsletter toggle, default minimum rating filter
- **Order History:** View all past orders with status filtering
- **Order Details:** Complete breakdown with items, totals, and shipping info

### 🔐 Authentication
- **Secure Auth:** JWT-based login/registration (mocked)
- **Demo Account:** demo@example.com / demo123456 (Admin access)
- **Protected Routes:** Guard-based route protection
- **Persistent Sessions:** User data saved to localStorage

### 📊 Admin Dashboard
- **Statistics Cards:** Revenue, orders, users, avg order value
- **Top Products:** Best-selling items with revenue
- **Recent Orders:** Latest orders with status tracking
- **Product Management:** Create new products

---

## 🏗️ Architecture

### Module Structure (Lazy Loaded)
```
src/app/
├── components/           # Shared components
│   ├── login-form/
│   ├── product-card/
│   └── products-list/
├── pages/
│   ├── account/          # AccountModule (lazy)
│   │   ├── user-profile/
│   │   ├── orders/
│   │   └── wishlist/
│   ├── admin/            # AdminModule (lazy)
│   │   ├── dashboard/
│   │   └── products/
│   └── auth/
├── shop/                 # ShopModule (lazy)
│   ├── cart/
│   ├── checkout/
│   ├── product-details/
│   ├── promotions/
│   └── wishlist/
├── state/                # NgRx State
│   ├── auth/
│   ├── products/
│   ├── cart/
│   ├── orders/
│   ├── user/
│   ├── wishlist/
│   ├── reviews/
│   ├── admin/
│   └── navigation/
└── mocks/                # MSW Mock API
```

### NgRx State Slices
| Slice | Purpose |
|-------|---------|
| `auth` | Authentication tokens & user session (persisted) |
| `products` | Product catalog with caching |
| `cart` | Shopping cart items, promo codes, discounts |
| `orders` | Order history with status tracking |
| `user` | User profile & preferences |
| `wishlist` | Favorite products |
| `reviews` | Product reviews by product ID |
| `admin` | Admin statistics |
| `navigation` | UI navigation state |

### Memoized Selectors
- `selectCartTotalItems` - Total items in cart
- `selectWishlistProducts` - All wishlist products
- `selectWishlistCount` - Wishlist item count
- `selectOrdersByStatus(status)` - Filter orders by status
- `selectRecentOrders(count)` - Get N most recent orders
- `selectTotalOrdersRevenue` - Sum of all order totals

---

## ⚡ Performance Optimizations

### Lazy Loading
All major feature modules are lazy loaded:
- `/shop/*` → ShopModule
- `/account/*` → AccountModule  
- `/admin/*` → AdminModule

### Change Detection
- `ChangeDetectionStrategy.OnPush` used on all page and list components
- Improves performance by reducing unnecessary change detection cycles

### trackBy Functions
All `*ngFor` directives use `trackBy` for efficient DOM updates

### Data Persistence
- Auth state persisted to localStorage (tokens + user data)
- Cart items persisted to localStorage
- Orders persisted to localStorage
- Custom products persisted to localStorage

---

## 🎯 Technical Decisions

### Wishlist Storage
**Decision:** Dedicated `wishlist` NgRx slice

**Rationale:**
- Separation of concerns
- Simpler reducer logic
- Independent loading/error states
- Matches cart pattern for consistency

### Promo Code System
| Code | Effect | Condition |
|------|--------|-----------|
| WELCOME10 | 10% off items | None |
| FREESHIP | Free shipping | None |
| VIP20 | 20% off | Order ≥ €50 |

### Stock Status Display
| Condition | Display |
|-----------|---------|
| stock = 0 | "Out of Stock" (red badge) |
| stock ≤ lowStockThreshold | "Only X left" (orange badge) |
| stock > lowStockThreshold | "In Stock" (green text) |

---

## 🧩 MSW Endpoints

### Authentication
- `POST /api/auth/token/` - Login
- `POST /api/auth/token/refresh/` - Refresh token

### User & Profile
- `GET /api/me/` - User profile
- `PATCH /api/me/` - Update profile/preferences
- `GET /api/me/orders/` - User's orders
- `GET /api/orders/:id/` - Order details

### Products
- `GET /api/products/` - Product list (with filters)
- `GET /api/products/:id/` - Product details
- `GET /api/products/:id/rating/` - Product rating

### Wishlist
- `GET /api/me/wishlist/` - Get wishlist IDs
- `POST /api/me/wishlist/` - Add/remove/toggle

### Reviews
- `GET /api/products/:id/reviews/` - Product reviews
- `POST /api/products/:id/reviews/` - Create review

### Cart & Checkout
- `POST /api/cart/apply-promo/` - Validate & apply promo
- `POST /api/cart/validate-stock/` - Check stock availability
- `POST /api/cart/validate` - Validate cart items
- `POST /api/order` - Create order

### Admin
- `GET /api/admin/stats/` - Dashboard statistics

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Angular 18+ |
| **State Management** | NgRx (Redux pattern) |
| **Styling** | Tailwind CSS, Angular Material, Custom CSS |
| **Mock API** | MSW (Mock Service Worker) |
| **Component Library** | Storybook |
| **Icons** | Material Icons & SVG |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

```bash
# Clone the repository
git clone https://github.com/afif-yassine/MyShop---Angular-E-Commerce-Application.git
cd MyShop---Angular-E-Commerce-Application

# Install dependencies
npm install

# Start the development server
npm start
```

Open `http://localhost:4200/` in your browser.

### Running Storybook
```bash
npm run storybook
```
Open `http://localhost:6006/` in your browser.

### Demo Account
| Field | Value |
|-------|-------|
| **Email** | demo@example.com |
| **Password** | demo123456 |
| **Access** | Admin privileges |

---

## 📚 Storybook Stories (14 Total)

### Shop Components
| Story | Description |
|-------|-------------|
| `ProductCard` | Product display with stock states (InStock, LowStock, OutOfStock) |
| `ProductsList` | Product grid with loading/error states |
| `CartItem` | Cart item with quantity controls |
| `CartSummary` | Cart total summary |
| `WishlistButton` | Heart toggle button |
| `PromoSummary` | Price breakdown with discounts |
| `ProductReviewsSection` | Customer reviews list |
| `ProductDetails` | Full product page |
| `LoginForm` | Authentication form |

### Account Pages
| Story | Description |
|-------|-------------|
| `UserProfilePage` | Profile editing with preferences |
| `OrdersListPage` | Orders with filtering & search |
| `OrderDetailsPage` | Full order breakdown |

### Admin Components
| Story | Description |
|-------|-------------|
| `AdminDashboard` | Full dashboard with stats |
| `AdminStatsCard` | Individual stat cards |

---

## 📁 Project Structure

```
├── src/
│   ├── app/
│   │   ├── components/       # Shared UI components
│   │   ├── guards/           # Route guards
│   │   ├── pages/            # Feature pages
│   │   ├── services/         # API services
│   │   ├── shop/             # Shop module
│   │   └── state/            # NgRx state management
│   ├── mocks/                # MSW handlers & data
│   └── styles.css            # Global styles
├── .storybook/               # Storybook configuration
├── angular.json              # Angular configuration
└── package.json
```

---

## 🧪 Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start dev server (port 4200) |
| `npm run build` | Production build |
| `npm run storybook` | Start Storybook (port 6006) |
| `npm run lint` | Run ESLint |
| `npm test` | Run unit tests |
| `npm test -- --code-coverage` | Run tests with coverage report |

---

## 🧪 Quality

### Unit Tests
The project includes comprehensive unit tests covering:

| Category | Files Tested |
|----------|--------------|
| **Reducers** | `cart.reducer.spec.ts`, `auth.reducer.spec.ts` |
| **Selectors** | `cart.selectors.spec.ts`, `auth.selectors.spec.ts` |
| **Effects** | `notification.effects.spec.ts`, `auth.effects.spec.ts` |
| **Services** | `notification.service.spec.ts` |
| **Components** | `product-card.component.spec.ts` |

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --code-coverage

# Run tests in CI mode (headless)
npm test -- --watch=false --browsers=ChromeHeadless
```

### CI/CD Pipeline
GitHub Actions workflow (`.github/workflows/ci.yml`) runs on every push/PR to `main`:

1. **Install** - `npm ci`
2. **Lint** - `npm run lint`
3. **Test** - Unit tests with coverage report
4. **Build** - Production bundle

### Docker Support
```bash
# Build and run with Docker Compose
docker-compose up --build

# Access the app
open http://localhost:4200
```

Docker configuration:
- `Dockerfile` - Multi-stage build (Node → Nginx)
- `nginx.conf` - Production-ready nginx config with SPA routing
- `docker-compose.yml` - Easy container orchestration

---

*Built with ❤️ by Yassine Afif*
