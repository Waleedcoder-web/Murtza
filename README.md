# Murtza — AURA LAB

> AURA LAB // High-Performance Luxury Athletic Showcase & Operations Platform  
> Design Source: Stitch Project ID `12378250600321310020`

This project is organized into two main folders:

```
├── frontend/                     # Full Client-Side Showcase Application
│   ├── index.html                # Main Customer Showcase
│   ├── product.html              # Product Detail Page (PDP)
│   ├── categories.html           # Curated Catalog Explorer
│   ├── admin/                    # All 8 Back-Office Admin Pages
│   ├── css/                      # Custom Glassmorphic Styles
│   ├── js/                       # Core Engines (Wishlist, Slider, PDP, Admin)
│   ├── assets/                   # Vector Logo & Imagery
│   └── vercel.json               # Vercel Deployment Configuration
│
└── backend/                      # Node.js + Express API Server
    ├── server.js                 # Express Application & REST Endpoints
    ├── package.json              # Dependencies: express, cors, dotenv
    ├── .env                      # Server Configurations (Port: 5000)
    └── .gitignore
```

## Running the Project

### Frontend
Deploy directly on Vercel (root set to `frontend/`) or serve locally:
```bash
cd frontend
npx serve .
```

### Backend
Run the Express API server:
```bash
cd backend
npm install
npm run dev
# or
npm start
```

#### API Endpoints
- `GET /api/health` — System health and telemetry status
- `GET /api/products` — Catalog products list & filtering
- `GET /api/products/:id` — Single product details
- `GET /api/categories` — Disciplines & categories
- `GET /api/orders` — Orders list for admin
- `POST /api/orders` — Checkout & order creation
- `GET /api/analytics` — Commercial telemetry statistics
