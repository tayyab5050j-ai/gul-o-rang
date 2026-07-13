import { readDB, writeDB } from '../_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const id = parseInt(req.query.id);

  try {
    const db = await readDB();

    if (req.method === 'GET') {
      const product = db.products.find(p => p.id === id);
      if (!product) return res.status(404).json({ error: 'Not found' });
      return res.json(product);
    }

    if (req.method === 'PUT') {
      const idx = db.products.findIndex(p => p.id === id);
      if (idx === -1) return res.status(404).json({ error: 'Not found' });
      db.products[idx] = { ...db.products[idx], ...req.body, id: db.products[idx].id };
      await writeDB(db);
      return res.json(db.products[idx]);
    }

    if (req.method === 'DELETE') {
      db.products = db.products.filter(p => p.id !== id);
      await writeDB(db);
      return res.json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
