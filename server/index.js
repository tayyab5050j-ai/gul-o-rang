import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { getProducts, saveProducts, getOrders, saveOrders, getMessages, saveMessages } from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// ─── PRODUCTS ───
app.get('/api/products', (req, res) => res.json(getProducts()));

app.post('/api/products', (req, res) => {
  const products = getProducts();
  const p = { id: Date.now(), ...req.body };
  products.push(p);
  saveProducts(products);
  res.json(p);
});

app.put('/api/products/:id', (req, res) => {
  const products = getProducts();
  const idx = products.findIndex(p => p.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  products[idx] = { ...products[idx], ...req.body, id: products[idx].id };
  saveProducts(products);
  res.json(products[idx]);
});

app.put('/api/products/batch', (req, res) => {
  saveProducts(req.body || []);
  res.json({ ok: true });
});

app.delete('/api/products/:id', (req, res) => {
  let products = getProducts();
  products = products.filter(p => p.id !== parseInt(req.params.id));
  saveProducts(products);
  res.json({ ok: true });
});

// ─── ORDERS ───
app.get('/api/orders', (req, res) => {
  let orders = getOrders();
  if (req.query.email) {
    orders = orders.filter(o => o.customer?.email?.toLowerCase() === req.query.email.toLowerCase());
  }
  res.json(orders);
});

app.post('/api/orders', (req, res) => {
  const orders = getOrders();
  const order = {
    id: Date.now(),
    date: new Date().toISOString(),
    items: req.body.items || [],
    total: req.body.total || 0,
    customer: req.body.customer || {},
    status: 'pending'
  };
  orders.push(order);
  saveOrders(orders);
  res.json(order);
});

app.put('/api/orders/batch', (req, res) => {
  saveOrders(req.body || []);
  res.json({ ok: true });
});

app.put('/api/orders/:id/status', (req, res) => {
  const orders = getOrders();
  const o = orders.find(o => o.id === parseInt(req.params.id));
  if (!o) return res.status(404).json({ error: 'Not found' });
  o.status = req.body.status || o.status;
  saveOrders(orders);
  res.json(o);
});

// ─── CONTACT ───
app.post('/api/contact', (req, res) => {
  const messages = getMessages();
  messages.push({ id: Date.now(), date: new Date().toISOString(), ...req.body });
  saveMessages(messages);
  res.json({ ok: true });
});

// ─── AUTH ───
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

app.post('/api/login', (req, res) => {
  if (req.body.password === ADMIN_PASSWORD) return res.json({ token: 'admin-token' });
  res.status(401).json({ error: 'Invalid password' });
});

// SPA fallback — serve index.html for unknown routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
