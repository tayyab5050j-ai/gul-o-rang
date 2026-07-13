import { readDB, writeDB, DEFAULT_PRODUCTS } from './_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const db = await readDB();

    if (req.method === 'GET') {
      if (!db.products || !db.products.length) {
        db.products = DEFAULT_PRODUCTS;
        await writeDB(db);
      }
      return res.json(db.products);
    }

    if (req.method === 'POST') {
      const p = { id: Date.now(), ...req.body };
      if (!db.products) db.products = [];
      db.products.push(p);
      await writeDB(db);
      return res.json(p);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
