export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  return res.json({
    hasToken: !!process.env.GH_TOKEN,
    tokenPrefix: process.env.GH_TOKEN ? process.env.GH_TOKEN.substring(0, 4) + '...' : 'none',
    node: process.version,
  });
}
