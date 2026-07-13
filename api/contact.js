import { readDB, writeDB } from './_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const db = await readDB();
    const msg = { id: Date.now(), date: new Date().toISOString(), ...req.body };
    if (!db.messages) db.messages = [];
    db.messages.push(msg);
    await writeDB(db);
    return res.json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
