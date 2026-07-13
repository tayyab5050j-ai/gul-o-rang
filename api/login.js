export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const PASS = process.env.ADMIN_PASSWORD || 'admin123';
  if (req.body.password === PASS) {
    return res.json({ token: 'admin-token' });
  }
  return res.status(401).json({ error: 'Invalid password' });
}
