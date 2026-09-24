const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-Memory Mock Database for AURA LAB
const mockProducts = [
  {
    id: 'prod-storm-shell',
    title: 'Aura Aerovent™ Storm Shell',
    category: 'Outerwear',
    discipline: 'Running Lab',
    price: 220.00,
    inStock: true,
    stockCount: 42,
    badge: 'WATERPROOF 20K',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Matte Obsidian', 'Slate Gray'],
    image: 'https://lh3.googleusercontent.com/aida/AEtjO1WnvWyVnFYd1n2oCSmfTDSRriqC56edzzytCNzW9t2Unt0Q6cCtEsUEfswsPUnAxSQMwsn3fEfEAH9lzYQBcqqSFJFxL8EA-5MFFtchj3RbdWxXno20LrFosYZzmldoFZfg6UvgedKf0zSFxBk3w7DQiZHa2DlgiZDu0sl-thmGOmHVb3x2CpQ-zsa2IKXgly7xxj-PGBS40s_RToRV9IuUfUW7mpm07l6iIaE0gkIRByEPvRd0bK9WIOKf'
  },
  {
    id: 'prod-training-tee',
    title: 'Performance Essential Training T-Shirt',
    category: 'Tops & Tees',
    discipline: 'Running Lab',
    price: 95.00,
    inStock: true,
    stockCount: 118,
    badge: 'BESTSELLER // 112G',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Matte Obsidian', 'Mineral Slate', 'Frost White'],
    image: 'https://lh3.googleusercontent.com/aida/AEtjO1XhmTK9Zk7HhARA54Cck6EDWx2JYs7o5rkdfJ9Rrkj0ZVsVji0Xt_tfSX_8F6WqRM2bnNasSb6B5wDpMabtDFxVC5bauWpnX2z9Tl2UVQXvhlij8n8YqPQWDKva8tCBkDEqAQ-dl5z6lGOBfjjjdRy7YQDkpEM-1sBB-FzBlLlgQ0dVhi4WrebasEntrqWKmtwpkgnRhWJ4Y9YKdIdjxoIb6wwQY1UZi48xCkPNMgz2VKv3UnX8N3ZmTGph'
  },
  {
    id: 'prod-seamless-set',
    title: 'Sculpt Seamless Compression Set',
    category: 'Sets',
    discipline: 'Seamless Training',
    price: 145.00,
    inStock: true,
    stockCount: 35,
    badge: 'SEAMLESS RIB',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Mineral Slate', 'Obsidian Black'],
    image: 'https://lh3.googleusercontent.com/aida/AEtjO1Uz7fx5bGomJqieSdFI4mv_uw_3vgeOhkN1iPlCnX4QJxiJyQM7uaKEuTUFNBGudfUeeTMyaK2DuS_-JkyTwqLTwEtt7bbCCpyxVwKf3mZrlq6_IjcAlkkdlQ-biJM-4JLHwvZ4ZthDil0p4vk4-DlGP9ggJayjOrayBYSKHu6xB0mw8xkYbS6HkuHNQmaVSKURrke2TocAKvzXGpcw9Rd1enPihlzmah68gRdS8FdHS7EB1G5lbTQXeFD4'
  },
  {
    id: 'prod-carbon-shorts',
    title: 'Kinetic Carbon Training Shorts',
    category: 'Shorts',
    discipline: 'Track & Field',
    price: 88.00,
    inStock: true,
    stockCount: 64,
    badge: 'CARBON SPLIT',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Matte Obsidian'],
    image: 'https://lh3.googleusercontent.com/aida/AEtjO1X5urk3CYU1AsUjF7idhC5hneGf0ckVTbwEA4h6BZllLQicYTvDiR88fc8Njp55J2yzr3weR78OFfIe9Zooj6JUmCVr8mL6lUcDZcsTmXum97f_S8PGISfnr_6kw1x27moXnKXgt-fo4CFQLchCmVM2pWw6MN1HyFOciNGvSpjvun7CSjhMwXgzCoFld9_i-2sbEUMagxSP8iVNWtLjSD-KoferxJsGB2zNTfnz8J-gZa9XUnI48Tdo1xs_'
  }
];

let mockOrders = [
  {
    orderId: 'AUR-98024',
    athlete: 'Markus Lindqvist',
    items: ['Aura Aerovent™ Storm Shell (L)', 'Kinetic Carbon Shorts (M)'],
    total: 308.00,
    status: 'Dispatched',
    node: 'Zurich Hub',
    timestamp: new Date().toISOString()
  },
  {
    orderId: 'AUR-98025',
    athlete: 'Dr. Sarah Vance',
    items: ['Sculpt Seamless Compression Set (S)'],
    total: 145.00,
    status: 'Processing',
    node: 'London Node',
    timestamp: new Date().toISOString()
  }
];

// --- API ROUTES ---

// Health & Status
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'AURA LAB Core API Node',
    node: 'Zurich EU-1',
    uptimeSeconds: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Products API
app.get('/api/products', (req, res) => {
  const { discipline, category } = req.query;
  let results = [...mockProducts];
  if (discipline) {
    results = results.filter(p => p.discipline.toLowerCase().includes(discipline.toLowerCase()));
  }
  if (category) {
    results = results.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }
  res.json({
    count: results.length,
    products: results
  });
});

app.get('/api/products/:id', (req, res) => {
  const product = mockProducts.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product SKU not found' });
  }
  res.json(product);
});

// Categories & Disciplines
app.get('/api/categories', (req, res) => {
  res.json({
    disciplines: [
      { name: 'Running Lab', stylesCount: 18 },
      { name: 'Seamless Training', stylesCount: 24 },
      { name: 'Technical Outerwear', stylesCount: 12 },
      { name: 'Mobility & Yoga', stylesCount: 15 },
      { name: 'Track & Field', stylesCount: 10 }
    ]
  });
});

// Orders API
app.get('/api/orders', (req, res) => {
  res.json({
    count: mockOrders.length,
    orders: mockOrders
  });
});

app.post('/api/orders', (req, res) => {
  const { athlete, items, total, shippingAddress } = req.body;
  const newOrder = {
    orderId: 'AUR-' + Math.floor(10000 + Math.random() * 90000),
    athlete: athlete || 'Guest Athlete',
    items: items || [],
    total: total || 0,
    shippingAddress: shippingAddress || 'Standard Delivery',
    status: 'Processing',
    node: 'Zurich Hub',
    timestamp: new Date().toISOString()
  };
  mockOrders.unshift(newOrder);
  res.status(201).json({
    message: 'Order created successfully and queued for fulfillment.',
    order: newOrder
  });
});

// Analytics & Telemetry API
app.get('/api/analytics', (req, res) => {
  res.json({
    grossRevenue: '$148,920.40',
    completedOrders: mockOrders.length + 1046,
    activeSkus: mockProducts.length,
    avgOrderValue: '$142.20',
    fulfillmentVelocity: '98.2%',
    aerodynamicDragIndex: '-14.2%',
    thermalDissipationRate: '+38.0%'
  });
});

// Optional: Serve frontend static files if present
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendPath));

// Start Server
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 AURA LAB Backend Server running on port ${PORT}`);
  console.log(`📡 Health: http://localhost:${PORT}/api/health`);
  console.log(`📦 Products: http://localhost:${PORT}/api/products`);
  console.log(`📋 Orders: http://localhost:${PORT}/api/orders`);
  console.log(`===============================================`);
});
