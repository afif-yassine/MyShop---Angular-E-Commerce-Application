# 🛍️ LuxeShop - Premium Angular E-Commerce Application

![Angular](https://img.shields.io/badge/Angular-18+-dd0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![NgRx](https://img.shields.io/badge/NgRx-State_Management-ba2bd2.svg?style=for-the-badge&logo=ngrx&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Material UI](https://img.shields.io/badge/Material_UI-0081CB?style=for-the-badge&logo=material-ui&logoColor=white)

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

### Exercise 3 (Advanced Features) ✨ NEW
- ✅ **User Account** - Profile management with preferences
- ✅ **User Preferences** - Newsletter subscription & default min rating filter
- ✅ **Order History** - Full order list with status tracking
- ✅ **Order Details** - Complete breakdown (items, taxes, shipping, discounts)
- ✅ **Wishlist** - Add/remove favorites with heart animation
- ✅ **Reviews System** - Customer reviews with ratings
- ✅ **Promo Codes** - WELCOME10, FREESHIP, VIP20 discounts
- ✅ **Stock Management** - In stock / Low stock / Out of stock display
- ✅ **Admin Dashboard** - Stats, top products, recent orders
- ✅ **Performance Optimizations** - Lazy loading, OnPush, memoized selectors

---

## ✨ Key Features

### 🎨 **Premium UI/UX**
* **Responsive Design:** Fluid layout adapting to mobile, tablet, and desktop
* **Glassmorphism & Animations:** Micro-interactions and smooth transitions
* **Sticky Header:** Dynamic header with scroll behavior
* **Stock Status Badges:** Visual indicators for product availability

### 🛒 **Shopping Experience**
* **Product Catalog:** Dynamic filtering and category browsing
* **Product Details:** Image galleries, stock status, customer reviews
* **Shopping Cart:** Real-time management with persistent state
* **Promo Codes:** Apply discount codes at checkout
* **Checkout Process:** Multi-step flow with price breakdown (subtotal, taxes, shipping, discounts)
* **Wishlist:** Save favorites with animated heart toggle

### 👤 **User Account**
* **Profile Management:** Edit name, contact info, default address
* **Preferences:** Newsletter toggle, default minimum rating filter
* **Order History:** View all past orders with status
* **Order Details:** Complete breakdown with items, totals, and shipping info

### 🔐 **Authentication**
* **Secure Auth:** JWT-based login/registration (mocked)
* **Demo Account:** demo@example.com / demo123456 (Admin access)
* **Protected Routes:** Guard-based route protection

### 📊 **Admin Dashboard**
* **Statistics Cards:** Revenue, orders, users, avg order value
* **Top Products:** Best-selling items with revenue
* **Recent Orders:** Latest orders with status tracking

---

## 🏗️ Architecture

### Module Structure (Lazy Loaded)
```
src/app/
├── pages/
│   ├── account/          # AccountModule (lazy)
│   │   ├── user-profile/
│   │   ├── orders/
│   │   └── wishlist/
│   ├── admin/            # AdminModule (lazy)
│   │   └── dashboard/
│   └── auth/
├── shop/                 # ShopModule (lazy)
│   ├── cart/
│   ├── checkout/
│   ├── product-details/
│   ├── promotions/
│   └── wishlist/
└── state/                # NgRx State
```

### NgRx State Slices
| Slice | Purpose |
|-------|---------|
| `auth` | Authentication tokens & user session |
| `products` | Product catalog with caching |
| `cart` | Shopping cart items, promo codes, discounts |
| `orders` | Order history with status tracking |
| `user` | User profile & preferences |
| `wishlist` | Favorite products |
| `reviews` | Product reviews by product ID |
| `admin` | Admin statistics |
| `navigation` | UI navigation state |

### Memoized Selectors (Section 6.3)
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
All `*ngFor` directives use `trackBy` for efficient DOM updates:
- Product lists, order lists, review lists, cart items

### Stale-While-Revalidate Cache
Product list caching with background refresh:
- Immediate display of cached data
- Background API call for updates
- State updated only if data changed
- Tracked via `lastQueryParams` in products state

---

## 🎯 Technical Decisions

### Wishlist Storage
**Decision:** Dedicated `wishlist` NgRx slice (not part of `user` slice)

**Rationale:**
- Separation of concerns - wishlist changes frequently
- Simpler reducer logic
- Independent loading/error states
- Easier to test in isolation
- Matches cart pattern for consistency

### Promo Code System
**Implemented Codes:**
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

### User & Profile
- `GET /api/me/` - User profile
- `PATCH /api/me/` - Update profile/preferences
- `GET /api/me/orders/` - User's orders
- `GET /api/orders/:id/` - Order details

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

* **Framework:** [Angular 18+](https://angular.io/)
* **State Management:** [NgRx](https://ngrx.io/) (Redux pattern)
* **Styling:** 
    * [Tailwind CSS](https://tailwindcss.com/)
    * [Angular Material](https://material.angular.io/)
    * Custom CSS Variables
* **Mock API:** [MSW](https://mswjs.io/) (Mock Service Worker)
* **Component Library:** [Storybook](https://storybook.js.org/)
* **Icons:** Material Icons & SVG

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v18 or higher)
* npm (v9 or higher)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/luxeshop.git
    cd luxeshop
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Start the development server**
    ```bash
    npm start
    ```

4.  **Open in browser**
    Navigate to `http://localhost:4200/`

### Running Storybook
```bash
npm run storybook
```

### Demo Account
- **Email:** demo@example.com
- **Password:** demo123456
- **Access:** Admin privileges

---

## 📚 Storybook Stories

### Existing Stories
- `ProductCard` - Product display with variants
- `LoginForm` - Authentication form
- `CartItem` - Cart item display
- `CartSummary` - Cart total summary
- `UserProfilePage` - Profile editing
- `AdminStatsCard` - Dashboard stat cards
- `ProductReviewsSection` - Reviews display
- `PromoSummary` - Price breakdown
- `WishlistButton` - Wishlist toggle

---

## 📄 License

This project is not licensed.

---

*Built with ❤️ by Yassine Afif*
