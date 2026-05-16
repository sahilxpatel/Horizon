<h1 align="center">Horizon – Intelligent Tour Management</h1>
<p align="center">
  <img src="https://github.com/Dhruv110903/Horizon/assets/93207042/5aad5484-44c8-4c0f-867a-e93a5aef2632" width="280" alt="Horizon logo" />
</p>

Horizon is a premium, full-stack **Next.js 14** application that helps travellers discover curated tours and complete secure bookings in minutes.

**[🌐 Live Demo](https://horizon-two-pi.vercel.app/)**

The platform ships with a Stripe-powered checkout flow, rich documentation, and a resilient authentication experience.

---

## ✨ Features

### Core Functionality
- **Secure Authentication**: JWT-based session management with secure storage.
- **Tour Discovery**: Advanced server-side filters, star ratings, and media galleries.
- **Stripe Integration**: Automated booking creation with payment status dashboard and receipt links.
- **Database Management**: Robust data handling and schema management using **Prisma ORM**.
- **Responsive UI**: Modern, state-of-the-art components built on Reactstrap and Framer Motion.

### Advanced Features ⭐
#### 1. Wishlist/Favorites System
- Heart icon on every tour card with instant feedback.
- Dedicated wishlist page for managing saved adventures.
- Real-time synchronization with the database.

#### 2. Tour Categories System 🏷️
- **12+ Categories**: Adventure, Beach, City, Cultural, Family, Hiking, Luxury, Nature, Religious, Safari, Wildlife, Weekend.
- Beautiful horizontal filter with unique icons and smooth animations.
- Intelligent server-side filtering across 50+ tours.

#### 3. Detailed Tour Itinerary 📅
- Day-by-day breakdown with timeline display.
- Activities, meals, and accommodation information.
- What's included/excluded sections for clear expectations.

#### 4. Newsletter Subscription 📧
- Email validation and duplicate prevention.
- Seamless integration for community building.

#### 5. Social Media Sharing 📱
- Share on WhatsApp, Facebook, Twitter, LinkedIn, Telegram.
- One-click copy link for quick distribution.

#### 6. Contact Us Page 📞
- Professional contact form with validation and feedback.
- Social media links and contact information display.

#### 7. Dark/Light Theme System 🌓
- CSS variable-driven theming with persistence.
- Automatic detection of system preferences (`prefers-color-scheme`).

#### 8. Tour Comparison 🔄
- Compare up to 3 tours side-by-side.
- Detailed comparison of price, category, duration, and capacity.

#### 9. Advanced Discovery Engine
- **Infinite Scroll**: Smoothly browse the entire tour inventory.
- **Smart Sorting**: Sort by price (asc/desc), duration, or newest destinations.

---

## 🧱 Tech Stack

### Frontend & Backend (Unified)
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Vanilla CSS + Reactstrap
- **Animations**: Framer Motion
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Payments**: [Stripe](https://stripe.com/)
- **Auth**: JWT (JSON Web Tokens)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ and npm
- PostgreSQL database (Neon.tech or local)
- Stripe account with test API keys

### 1. Clone & Install
```bash
git clone https://github.com/Dhruv110903/Horizon.git
cd Horizon
npm install
```

### 2. Configure Environment
Create a `.env` file in the root:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/horizon"
JWT_SECRET_KEY="your-secret-key"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_CURRENCY="inr"
STRIPE_SERVICE_FEE="200"

# Application URL
NEXT_PUBLIC_API_URL="/api/v1"
```

### 3. Setup Database
```bash
npx prisma generate
npx prisma migrate dev
npm run prisma:seed
```

### 4. Run the Application
```bash
npm run dev
```
Browse to [http://localhost:3000](http://localhost:3000) to begin exploring!

---

## 🤖 GitHub Actions CI
The project includes a robust CI pipeline that automatically validates:
- Dependency installation
- Prisma client generation
- Linting rules (`npm run lint`)
- Type safety (`npm run type-check`)
- Production build compilation (`npm run build`)

---

## 💳 Payment Flow Overview
1. Users choose a tour and fill in booking details.
2. Frontend calls `POST /api/v1/payments/checkout-session`.
3. Stripe redirects to the hosted secure checkout page.
4. On successful payment, Stripe Webhook updates the booking status to **Paid**.
5. Users land on the status page to view their booking confirmation and receipt link.

---

## 🛠️ Useful Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run lint` | Run ESLint checks |
| `npm run type-check`| Run TypeScript validation |
| `npm run prisma:seed`| Seed tours into database |
| `npm run db:reset` | Reset database and re-seed |

---

## 🧩 Project Structure
```text
Horizon/
├── app/              # Next.js App Router (Routes & API)
│   ├── api/v1/       # Backend API Endpoints
│   └── (main)/       # Frontend Pages
├── components/       # UI Components
├── prisma/           # Database Schema & Seeding
├── lib/              # Core Clients (Prisma, Stripe)
├── hooks/            # Custom State Logic
├── context/          # Global State Management
└── utils/            # Shared Helpers
```

---

## 🧪 Testing Stripe Webhooks Locally
1. Install [Stripe CLI](https://stripe.com/docs/stripe-cli).
2. Run `stripe login`.
3. Forward events:
```bash
stripe listen --forward-to localhost:3000/api/v1/payments/webhook
```
4. Copy the `whsec_...` secret to your `.env` file.

---

## 🔒 Security Features
- JWT authentication with secure session management.
- Password hashing with bcrypt.
- Input validation on all forms.
- Stripe secure payment processing.
- Environment variable protection.

---

## 🤝 Contributing
Issues and pull requests are welcome! 
1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Open a Pull Request.

---

## 📝 License
This project is open source and available under the MIT License.

---

## 🙏 Acknowledgments
- Stripe for payment processing.
- Prisma for excellent database tooling.
- React community for state-of-the-art libraries.

---

## 📚 Version History

### Version 3.0.0 - Next.js 14 Modernization (Current)
- Complete rewrite from MERN to **Next.js 14 App Router**.
- Migrated MongoDB to **PostgreSQL with Prisma**.
- Unified server/client architecture.
- Implemented **GitHub Actions CI**.
- Enhanced Gallery with CSS Columns and **LazyImage**.

### Version 2.0.0 - Major Feature Update
- Wishlist, Categories, Itinerary, and Comparison systems added.
- Dark/Light mode integration.

<p align="center">
  <b>Happy travels and thank you for exploring Horizon!</b> ✈️🌍
</p>
