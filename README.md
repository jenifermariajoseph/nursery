# Nursery — Full-Stack Plant Store

- Live Frontend: https://nursery-sigma.vercel.app/
- Backend: to be deployed (Node.js + Express)
- Database: PostgreSQL (to be done)

## Overview
Nursery is a full-stack e-commerce application for plants. The frontend (React) provides a responsive catalog, product pages, and cart UI. The backend (Express) exposes REST APIs for authentication and cart operations, backed by a relational PostgreSQL schema.


### Backend
Either a single `DATABASE_URL` or discrete PG vars:
- `PORT=4000`
- `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD`
- Optional for hosted DBs: `PGSSL=true` (or set `ssl` in `pg` config)

## API Overview

### Auth
- `POST /api/auth/register`
  - Body: `{ name, email, password }`
  - Returns: user payload and/or token.
- `POST /api/auth/login`
  - Body: `{ email, password }`
  - Returns: token and user info.

### Cart
- `GET /api/cart?sessionId=<id>`
  - Returns: `{ items: [...], subtotal: number }`
- `POST /api/cart/items`
  - Body: `{ product_id, name, price, image_url, quantity }`
  - Returns: item created.
- `PUT /api/cart/items/:id`
  - Body: `{ quantity }`
  - Returns: updated item.
- `DELETE /api/cart/items/:id`
  - Returns: success status.

Note: Session-based carts may use `sessionId` for anonymous users; authenticated users associate carts to their user ID.

## Database Schema (Summary)
- `users`: id, name, email, password_hash, created_at
- `products`: id, name, price, image_url, created_at
- `carts`: id, user_id (nullable for guest), created_at
- `cart_items`: id, cart_id, product_id, name, price, image_url, quantity

See `backend/db/init.sql` for exact definitions.

## Local Development

### Frontend
1. `cd frontend`
2. Install: `npm install`
3. Optional: create `.env` with `REACT_APP_API_URL=http://localhost:4000`
4. Run: `npm start`

### Backend
1. `cd backend`
2. Install: `npm install`
3. Ensure PostgreSQL is running and env vars are set (or adjust `src/server.js`).
4. Run: `npm start` (or `node src/server.js`)

## Deployment

### Frontend (Vercel)
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `build`
- Env Vars: set `REACT_APP_API_URL` to your backend URL once the backend is live.

### Backend (Render/Railway/Supabase)
- Expose on `PORT` (platform will provide).
- Configure CORS to allow your Vercel domain (e.g., `https://<project>.vercel.app`).
- Use SSL for cloud Postgres where required.

Example CORS snippet:
```js
const cors = require('cors')
app.use(cors({
  origin: [
    'http://localhost:3000',
    /\.vercel\.app$/,
  ],
  credentials: true,
}))
```

## Known Notes
- Frontend-only deployments will load UI but API calls will fail until `REACT_APP_API_URL` points to a live backend.
- Cart thumbnails should use the `cart-thumb` class to avoid oversized images.
- If using GSAP features, ensure `gsap` is installed and `ScrollTrigger` is registered.

