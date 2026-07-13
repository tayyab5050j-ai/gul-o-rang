import { readDB, writeDB } from '../_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' });

  const id = parseInt(req.query.id);

  try {
    const db = await readDB();
    const o = db.orders.find(o => o.id === id);
    if (!o) return res.status(404).json({ error: 'Not found' });

    if (req.body.status) o.status = req.body.status;
    await writeDB(db);
    return res.json(o);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
