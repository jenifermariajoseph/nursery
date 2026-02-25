# 🌿 Nursery — Full-Stack Plant Store (Flagship Project)

**Live Store (Frontend):** [https://nursery-sigma.vercel.app/](https://nursery-sigma.vercel.app/)

**Business Analytics Dashboard (Tableau):**
[https://public.tableau.com/app/profile/jenifer.maria.joseph/viz/nursery-dash/Dashboard1?publish=yes](https://public.tableau.com/app/profile/jenifer.maria.joseph/viz/nursery-dash/Dashboard1?publish=yes)

**Dashboard (GitHub):**
[https://github.com/jenifermariajoseph/Nursery_Dashboard](https://github.com/jenifermariajoseph/Nursery_Dashboard)

**Backend:** Node.js + Express (to be deployed)
**Database:** PostgreSQL (in progress)

---
🌱 Why This Project Exists

Nursery is a passion project built to support my family’s plan to set up a small plant nursery business.
Instead of building a generic e-commerce app, I wanted to solve a real problem from my own life by creating a platform that could genuinely help run and grow a small nursery.

Learning computer science is what made this possible. Concepts like system design, databases, APIs, and data analysis helped me translate a business idea into an actual working product.
What would have been a manual, offline process is now a structured digital system — from understanding demand using analytics to designing a scalable full-stack application.

This project reflects how I approach problems:
I don’t start with features — I start by understanding the business problem, and then use CS fundamentals to design the right technology around it.

---

## 📊 Business-First Approach (Decisions Before Development)

Before writing a single backend endpoint or frontend component, I built a **Nursery Sales & Demand Analysis Dashboard (Tableau)** to understand:

* Seasonal demand cycles
* Festival-driven demand spikes
* Region-wise performance
* Product category contribution to revenue
* Whether revenue growth is volume-driven or price-driven

**Dashboard Link:**
👉 [https://public.tableau.com/app/profile/jenifer.maria.joseph/viz/nursery-dash/Dashboard1?publish=yes](https://public.tableau.com/app/profile/jenifer.maria.joseph/viz/nursery-dash/Dashboard1?publish=yes)

### How This Influenced System Design

Insights from the dashboard directly shaped product and feature decisions:

* 📦 Inventory planning for peak seasons (Mar, Oct–Nov)
* 🌍 Region-first strategy (Delhi & Tamil Nadu prioritized)
* 🌿 Category focus (Flowering plants, Herbs, Medicinal plants)
* 📈 Metrics-first Admin Dashboard design
* 💰 Marketing spend optimization logic

This ensures the product is built to support **real operational decisions**, not just display data.

---

## ✨ Features

### 🛍️ Customer Store (Live Frontend)

* Responsive plant catalog
* Product detail pages
* Add/update/remove cart items
* Guest carts using session IDs
* API-driven UI

## 🧠 Techniques & Engineering Concepts

* **Frontend:** React, component-based architecture, environment-based configs
* **Backend:** Node.js, Express REST APIs, JWT authentication, CORS
* **Database:** PostgreSQL (normalized relational schema)
* **System Design:** Decoupled frontend & backend, RESTful APIs
* **Business Intelligence:** Tableau dashboard to guide feature prioritization
* **Security:** Password hashing, token-based authentication
* **Scalability:** Designed for future order management & analytics

---

## 🔐 API Overview

### Auth

* `POST /api/auth/register`
* `POST /api/auth/login`

### Cart

* `GET /api/cart?sessionId=<id>`
* `POST /api/cart/items`
* `PUT /api/cart/items/:id`
* `DELETE /api/cart/items/:id`

Supports both:

* Guest users (session-based carts)
* Authenticated users (user-linked carts)

---

## 🗄️ Database Schema (Summary)

* **users**: id, name, email, password_hash, created_at
* **products**: id, name, price, image_url, created_at
* **carts**: id, user_id (nullable), created_at
* **cart_items**: id, cart_id, product_id, name, price, image_url, quantity

---


## 🌍 Deployment

### Frontend (Vercel)

* Root Directory: `frontend`
* Build Command: `npm run build`
* Output Directory: `build`
* Env Var: `REACT_APP_API_URL=<backend_url>`

### Backend (Render / Railway / Supabase)

* Node.js + Express
* PostgreSQL with SSL
* CORS enabled for Vercel frontend

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

---

## 🌼 What This Project Demonstrates

✔️ Business-first thinking
✔️ End-to-end full-stack development
✔️ Data-driven feature design
✔️ Real-world problem solving
✔️ Product & system design mindset

This project reflects how I approach building software:
**with empathy for users, clarity on business goals, and strong engineering fundamentals.**

