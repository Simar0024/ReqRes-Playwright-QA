// real-setup/backend/server.js
const express = require('express');
const app = express();

app.use(express.json());

// Explicit CORS implementation allowing incoming headers from cross-origin static hosts
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key, Accept');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Mock Database State - Expanded with Additional Catalog Entries
let inventory = [
  { id: 101, item: "Cloud Architecture Blueprint", stock: 5, price: 49.99 },
  { id: 102, item: "Kubernetes Masterclass", stock: 0, price: 99.99 },
  { id: 103, item: "Terraform Multi-Cloud Matrix", stock: 12, price: 79.50 },
  { id: 104, item: "AI/ML Model Pipeline Cluster", stock: 3, price: 149.00 }
];

// 1. SECURE ORDER CHECKOUT CHANNEL (POST)
app.post('/api/v1/orders', (req, res) => {
  const { itemId, quantity, userEmail } = req.body;
  const apiKey = req.headers['x-api-key'];

  // Verification security barrier
  if (!apiKey || apiKey !== 'prod-secret-gate-key') {
    return res.status(401).json({ error: "Unauthorized", message: "Invalid or missing x-api-key header." });
  }

  const product = inventory.find(i => i.id === itemId);
  if (!product) {
    return res.status(404).json({ error: "Not Found", message: "Item ID does not exist in active database." });
  }

  // Inventory validation checks
  if (product.stock < quantity) {
    return res.status(400).json({ 
      error: "Bad Request", 
      message: `Insufficient stock. Requested: ${quantity}, Available: ${product.stock}` 
    });
  }

  // Mutate database transaction records state
  product.stock -= quantity; 
  return res.status(201).json({
    status: "success",
    orderId: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
    item: product.item,
    totalCost: (product.price * quantity).toFixed(2),
    remainingStock: product.stock
  });
});

// Lightweight root health-ping endpoint for automated environment verification tasks
app.get('/', (req, res) => {
  res.status(200).json({ status: "healthy", service: "real-setup-cluster", activeCatalogItems: inventory.length });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Production Backend Gateway online on port ${PORT}`));