import { readDB, writeDB } from './_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const db = await readDB();

    if (req.method === 'GET') {
      let orders = db.orders || [];
      if (req.query.email) {
        orders = orders.filter(o => o.customer?.email?.toLowerCase() === req.query.email.toLowerCase());
      }
      return res.json(orders);
    }

    if (req.method === 'POST') {
      const order = {
        id: Date.now(),
        date: new Date().toISOString(),
        items: req.body.items || [],
        total: req.body.total || 0,
        customer: req.body.customer || {},
        status: 'pending',
      };
      if (!db.orders) db.orders = [];
      db.orders.push(order);
      await writeDB(db);
      return res.json(order);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
