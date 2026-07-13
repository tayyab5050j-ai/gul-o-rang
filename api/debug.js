import { readDB, writeDB, getToken } from './_db.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  const results = {};

  // 1. Check token
  const tok = getToken();
  results.tokenOk = !!tok;
  results.tokenLen = tok ? tok.length : 0;

  // 2. Try read from GitHub
  let db;
  try {
    db = await readDB();
    results.readOk = true;
    results.productCount = (db.products || []).length;
    results.orderCount = (db.orders || []).length;
    results.products = (db.products || []).map(p => ({ id: p.id, name: p.name, price: p.price, hasImages: !!(p.images && p.images.length) }));
    results.dbKeys = Object.keys(db).filter(k => !k.startsWith('_dbg'));
  } catch (e) {
    results.readOk = false;
    results.readError = e.message;
  }

  // 3. Try write a test marker
  try {
    const db3 = await readDB();
    const testKey = '_dbg_' + Date.now();
    db3[testKey] = true;
    await writeDB(db3);
    // read back to confirm
    const db2 = await readDB();
    results.writeOk = !!db2[testKey];
    results.writeReadback = !!db2[testKey];
    // clean up
    delete db2[testKey];
    await writeDB(db2);
  } catch (e) {
    results.writeOk = false;
    results.writeError = e.message;
    results.writeStack = e.stack;
  }

  return res.json(results);
}
