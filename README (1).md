# Localé — Local Business Directory Platform

A full-stack web application for discovering and exploring local businesses across Indian cities. Built with the MERN stack.

---

## Tech Stack

**Frontend:** React 18, TypeScript, Vite, Tailwind CSS, React Router v6, Axios  
**Backend:** Node.js, Express.js, REST API  
**Database:** MongoDB Atlas (Mongoose ODM)  
**Auth:** JWT (JSON Web Tokens) + bcryptjs  
**Maps:** React Leaflet + OpenStreetMap  

---

## Features

### Public
- Browse businesses by category, city, rating
- Full-text search across name, tagline, location
- Business detail page with map, gallery, reviews, contact form
- "Open Now" indicator based on business hours
- Category pages with filtered listings

### Authentication
- Register as User or Business Owner
- JWT-based login with role-based access
- Protected routes per role (user / owner / admin)

### User Dashboard
- Save favourite businesses
- View and manage written reviews
- Edit profile settings

### Owner Dashboard
- Add and manage business listings
- View inquiries from customers
- Track listing views and ratings

### Admin Panel
- Overview stats (businesses, users, reviews, pending)
- Approve / reject / feature business listings
- Manage users and roles
- Moderate reviews (hide / delete)
- Manage categories

---

## Project Structure

```
local-business/
├── client/                  # React frontend (Vite)
│   └── src/
│       ├── components/      # Reusable UI components
│       ├── pages/           # Route-level page components
│       ├── context/         # AuthContext (JWT state)
│       ├── services/        # api.ts — Axios instance + all API calls
│       └── hooks/           # useAuth, useDebounce
│
└── server/                  # Express backend
    ├── controllers/         # Route handler logic
    ├── models/              # Mongoose schemas
    ├── routes/              # Express routers
    ├── middleware/          # Auth, upload, error handlers
    └── seed.js              # Database seeder
```

---

## Local Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/local-business.git
cd local-business
```

### 2. Setup the backend

```bash
cd server
npm install
```

Create `server/.env`:

```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

Seed the database:

```bash
node seed.js
```

Start the server:

```bash
npm run dev
```

### 3. Setup the frontend

```bash
cd ..
npm install
npm run dev
```

App runs at `http://localhost:5173`  
API runs at `http://localhost:5000`

---

## Seeded Accounts

| Role  | Email | Password |
|-------|-------|----------|
| Admin | admin@locale.in | admin123 |
| Owner | krishna@locale.in | owner123 |
| User  | priya@locale.in | user123 |

---

## Seeded Businesses

| Business | Category | City | Rating |
|----------|----------|------|--------|
| Rayalaseema Ruchulu | Restaurants | Hyderabad | 4.7★ |
| Iron Paradise Gym | Fitness | Hyderabad | 4.6★ |
| Lakshmi Medicals | Healthcare | Visakhapatnam | 4.2★ |
| Code Garage | Education | Bangalore | 4.9★ |
| The Wardrobe Edit | Shopping | Chennai | 4.5★ |

---

## API Endpoints

### Auth
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
```

### Businesses
```
GET    /api/businesses          (filter: category, city, rating, search, page)
GET    /api/businesses/:slug
POST   /api/businesses          (owner/admin)
PUT    /api/businesses/:id      (owner/admin)
DELETE /api/businesses/:id      (owner/admin)
GET    /api/businesses/my       (owner's listings)
GET    /api/businesses/admin/all (admin)
```

### Reviews
```
GET    /api/reviews/business/:id
POST   /api/reviews/:businessId  (authenticated)
DELETE /api/reviews/:id          (admin)
PUT    /api/reviews/:id/hide     (admin)
GET    /api/reviews/admin/all    (admin)
```

### Categories
```
GET    /api/categories
POST   /api/categories           (admin)
PUT    /api/categories/:id       (admin)
DELETE /api/categories/:id       (admin)
```

### Users
```
GET    /api/users                (admin)
PUT    /api/users/profile        (authenticated)
GET    /api/users/saved          (authenticated)
POST   /api/users/saved/:id      (toggle save)
DELETE /api/users/:id            (admin)
```

### Admin
```
GET    /api/admin/stats
```

---

## Environment Variables

### Server (`server/.env`)
| Variable | Description |
|----------|-------------|
| PORT | Server port (default: 5000) |
| MONGODB_URI | MongoDB Atlas connection string |
| JWT_SECRET | Secret for signing access tokens |
| JWT_REFRESH_SECRET | Secret for refresh tokens |
| NODE_ENV | development / production |
| CLIENT_URL | Frontend URL for CORS |

### Client (`.env`)
| Variable | Description |
|----------|-------------|
| VITE_API_URL | Backend API URL (optional with proxy) |

---

## Screenshots

| Page | Description |
|------|-------------|
| Home | Hero search, category tiles, featured businesses |
| Browse | Filter sidebar, paginated business listings |
| Detail | Business info, map, reviews, contact form |
| Admin | Stats dashboard, manage businesses/users/reviews |
| Owner | My listings, add/edit business form |

---

## Notes

- Email verification is disabled in development mode
- Images served via Unsplash CDN for demo data
- Maps powered by OpenStreetMap (no API key required)
- Rate limiting: 100 requests per 15 minutes per IP

---

*Built as part of internship assignment — May 2026*
