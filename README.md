# 🛍️ LuxeShop - Premium Angular E-Commerce Application

![Angular](https://img.shields.io/badge/Angular-20+-dd0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![NgRx](https://img.shields.io/badge/NgRx-State_Management-ba2bd2.svg?style=for-the-badge&logo=ngrx&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Material UI](https://img.shields.io/badge/Material_UI-0081CB?style=for-the-badge&logo=material-ui&logoColor=white)
![Storybook](https://img.shields.io/badge/Storybook-FF4785?style=for-the-badge&logo=storybook&logoColor=white)
![CI](https://github.com/afif-yassine/MyShop---Angular-E-Commerce-Application/actions/workflows/ci.yml/badge.svg)

**LuxeShop** is a state-of-the-art, premium e-commerce platform built with modern web technologies. It delivers a seamless, high-performance shopping experience with a focus on aesthetic excellence and robust architecture.

---

## 🚀 Quick Start

### Prerequisites
- Node.js v20 or higher
- npm v9 or higher
- Docker Desktop (optional, for containerized deployment)

### Installation

```bash
# Clone the repository
git clone https://github.com/afif-yassine/MyShop---Angular-E-Commerce-Application.git
cd MyShop---Angular-E-Commerce-Application

# Install dependencies (--force is required due to peer dependency conflicts)
npm install --force

# Start the development server
npm start
```

> ⚠️ **Important:** This project uses `npm install --force` due to some peer dependency conflicts between Angular 20 and Storybook. This is safe and does not affect functionality.

Open `http://localhost:4200/` in your browser.

---

## 🔐 Authentication System

### Demo Accounts

| Role | Email | Password | Access |
|------|-------|----------|--------|
| **Admin** | demo@example.com | demo123456 | Full admin + user access |
| **User** | user@example.com | user123456 | Standard user access |

### Google OAuth Support
The application includes mock OAuth support with Google authentication:
- Click "Sign in with Google" on the login page
- A simulated Google OAuth flow will authenticate you
- Social login tokens are handled via the `/api/auth/social/` endpoint

### Authentication Features
- 🔑 **JWT-based authentication** with access/refresh token flow
- 🔄 **Token refresh** automatic handling
- 💾 **Persistent sessions** via localStorage
- 🛡️ **Route guards** for protected pages
- 👤 **User roles** (Admin, User) with different permissions

---

## ✨ Features Overview

### 🛒 Shopping Experience
| Feature | Description |
|---------|-------------|
| **Product Catalog** | Browse products with filtering by category, price, rating |
| **Search** | Full-text search across product names and descriptions |
| **Product Details** | Rich product pages with images, reviews, and stock status |
| **Shopping Cart** | Add/remove items, update quantities, persistent storage |
| **Wishlist** | Save favorites with animated heart toggle |
| **Promo Codes** | Apply discount codes at checkout |
| **Checkout** | Multi-step process: Summary → Address → Confirmation |

### 📦 Product Management (Admin)
| Feature | Description |
|---------|-------------|
| **Add Products** | Create new products with images, descriptions, stock |
| **Stock Management** | Track inventory with low stock alerts |
| **Product Reviews** | View and moderate customer reviews |

### 👤 User Account
| Feature | Description |
|---------|-------------|
| **Profile** | Edit personal info, contact details, default address |
| **Preferences** | Newsletter subscription, default rating filter |
| **Order History** | View all past orders with status filtering |
| **Order Details** | Complete breakdown with items, taxes, shipping |

### 📊 Admin Dashboard
| Feature | Description |
|---------|-------------|
| **Stats Cards** | Revenue, orders, users, avg order value |
| **Top Products** | Best-selling items with revenue |
| **Recent Orders** | Latest orders with status tracking |

---

## 🧪 Testing

### Running Tests

```bash
# Run all unit tests
npm test

# Run tests in headless mode (CI)
npm test -- --watch=false --browsers=ChromeHeadless

# Run tests with coverage report
npm test -- --code-coverage
```

### Test Coverage

| Category | Test Files | Tests |
|----------|------------|-------|
| **Reducers** | `cart.reducer.spec.ts`, `auth.reducer.spec.ts` | 20+ |
| **Selectors** | `cart.selectors.spec.ts`, `auth.selectors.spec.ts` | 12+ |
| **Effects** | `notification.effects.spec.ts`, `auth.effects.spec.ts` | 15+ |
| **Services** | `notification.service.spec.ts` | 8+ |
| **Components** | `product-card.component.spec.ts` | 10+ |

**Total: 72 passing tests**

---

## 🔧 CI/CD Pipeline

GitHub Actions runs automatically on push/PR to `main` or `master`:

```yaml
# .github/workflows/ci.yml
1. Setup Node.js 20
2. Install Chrome (for headless tests)
3. npm install --force
4. npm run lint
5. npm test (72 tests)
6. npm run build (production)
7. Upload build artifacts
```

Check status: [GitHub Actions](https://github.com/afif-yassine/MyShop---Angular-E-Commerce-Application/actions)

---

## 🐳 Docker Deployment

### Quick Start with Docker Compose

```bash
# Build and run
docker-compose up --build

# Access at http://localhost:4200

# Stop containers
docker-compose down
```

### Manual Docker Build

```bash
docker build -t luxeshop:latest .
docker run -p 4200:80 luxeshop:latest
```

### Docker Files
| File | Description |
|------|-------------|
| `Dockerfile` | Multi-stage build (Node → Nginx) |
| `nginx.conf` | Production Nginx config with SPA routing |
| `docker-compose.yml` | Container orchestration |

---

## 🎁 Promo Codes

| Code | Effect | Condition |
|------|--------|-----------|
| `WELCOME10` | 10% off items | None |
| `FREESHIP` | Free shipping | None |
| `VIP20` | 20% off | Order ≥ €50 |

---

## 📚 Storybook

```bash
npm run storybook
# Open http://localhost:6006
```

### Available Stories (14 Total)

**Shop Components:** ProductCard, ProductsList, CartItem, CartSummary, WishlistButton, PromoSummary, ProductReviewsSection, ProductDetails, LoginForm

**Account Pages:** UserProfilePage, OrdersListPage, OrderDetailsPage

**Admin:** AdminDashboard, AdminStatsCard

---

## 🏗️ Architecture

### Module Structure (Lazy Loaded)
```
src/app/
├── components/           # Shared components
├── pages/
│   ├── account/          # AccountModule (lazy)
│   ├── admin/            # AdminModule (lazy)
│   └── auth/
├── shop/                 # ShopModule (lazy)
├── state/                # NgRx State
│   ├── auth/
│   ├── products/
│   ├── cart/
│   ├── orders/
│   ├── user/
│   ├── wishlist/
│   ├── reviews/
│   └── admin/
└── mocks/                # MSW Mock API
```

### NgRx State Slices
| Slice | Purpose |
|-------|---------|
| `auth` | JWT tokens & user session (persisted) |
| `products` | Product catalog with caching |
| `cart` | Shopping cart, promo codes, discounts |
| `orders` | Order history with status tracking |
| `user` | User profile & preferences |
| `wishlist` | Favorite products |
| `reviews` | Product reviews by product ID |
| `admin` | Admin statistics |

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Angular 20 |
| **State Management** | NgRx (Redux pattern) |
| **Styling** | Tailwind CSS 4, Angular Material |
| **Mock API** | MSW (Mock Service Worker) |
| **Component Library** | Storybook 10 |
| **Testing** | Jasmine, Karma |
| **CI/CD** | GitHub Actions |
| **Containerization** | Docker, Nginx |

---

## 📜 Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start dev server (port 4200) |
| `npm run build` | Production build |
| `npm run storybook` | Start Storybook (port 6006) |
| `npm run lint` | Run ESLint |
| `npm test` | Run unit tests |

---

## 📡 API Endpoints (MSW)

### Authentication
- `POST /api/auth/token/` - Login
- `POST /api/auth/token/refresh/` - Refresh token
- `POST /api/auth/social/` - Social login (Google)

### Products
- `GET /api/products/` - List with filters
- `GET /api/products/:id/` - Details
- `POST /api/admin/products/` - Create (Admin)

### Cart & Orders
- `POST /api/cart/apply-promo/` - Apply promo code
- `POST /api/order/` - Create order
- `GET /api/me/orders/` - Order history

---

## ⚡ Performance Optimizations

- ✅ **Lazy Loading** - All feature modules
- ✅ **OnPush Change Detection** - All components
- ✅ **trackBy Functions** - All ngFor loops
- ✅ **Memoized Selectors** - NgRx selectors
- ✅ **localStorage Persistence** - Auth, cart, orders

---

## 📄 License

MIT License - Built with ❤️ by Yassine Afif

