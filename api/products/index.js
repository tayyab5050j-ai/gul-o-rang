import { readDB, writeDB, DEFAULT_PRODUCTS } from '../_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const db = await readDB();

    if (req.method === 'GET') {
      if (!db.products || !db.products.length) {
        db.products = DEFAULT_PRODUCTS;
        await writeDB(db);
      }
      const list = db.products.map(p => {
        const { images, ...rest } = p;
        return { ...rest, hasImages: !!(images && images.length), imageCount: images ? images.length : 0 };
      });
      return res.json(list);
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
