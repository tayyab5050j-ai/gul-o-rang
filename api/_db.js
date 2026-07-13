const OWNER = 'tayyab5050j-ai';
const REPO = 'gul-o-rang';
const PATH = 'data/db.json';
const BRANCH = 'main';

let tokenCache = '';
let shaCache = null;
let dataCache = null;

export function getToken() {
  if (tokenCache) return tokenCache;
  tokenCache = process.env.GH_TOKEN || '';
  return tokenCache;
}

function ghHeaders() {
  return {
    Authorization: 'Bearer ' + getToken(),
    Accept: 'application/vnd.github.v3+json',
  };
}

export async function readDB() {
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}?ref=${BRANCH}`;
  const res = await fetch(url, { headers: ghHeaders() });

  if (!res.ok) {
    if (res.status === 404) return { products: [], orders: [], messages: [] };
    throw new Error('GitHub read failed: ' + res.status);
  }

  const data = await res.json();
  shaCache = data.sha;
  const content = Buffer.from(data.content, 'base64').toString('utf8');
  dataCache = JSON.parse(content);
  return JSON.parse(JSON.stringify(dataCache));
}

export async function writeDB(db) {
  dataCache = JSON.parse(JSON.stringify(db));
  const content = Buffer.from(JSON.stringify(db, null, 2)).toString('base64');

  // Get current SHA first
  if (!shaCache) {
    const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}?ref=${BRANCH}`;
    const res = await fetch(url, { headers: ghHeaders() });
    if (res.ok) {
      const data = await res.json();
      shaCache = data.sha;
    }
  }

  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}`;
  const body = {
    message: 'Auto-update DB from API',
    content,
    branch: BRANCH,
    sha: shaCache || undefined,
  };

  const res = await fetch(url, {
    method: 'PUT',
    headers: ghHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    // SHA conflict — re-read and retry once
    if (res.status === 409) {
      shaCache = null;
      dataCache = null;
      await readDB();
      const retryBody = { ...body, sha: shaCache };
      const retry = await fetch(url, {
        method: 'PUT',
        headers: ghHeaders(),
        body: JSON.stringify(retryBody),
      });
      if (!retry.ok) throw new Error('GitHub write failed after retry: ' + (await retry.text()));
      return;
    }
    throw new Error('GitHub write failed: ' + err);
  }

  const result = await res.json();
  shaCache = result.content?.sha || shaCache;
}

export const DEFAULT_PRODUCTS = [
  { id: 1, name: 'Rosetta Rose', price: 1200, category: 'rose', desc: 'A romantic bloom with layered coral-peach petals. Each rose takes 45 minutes to hand-twist.', colors: ['#D4897A','#C47A6A','#E0A090'] },
  { id: 2, name: 'Solara Sunflower', price: 1000, category: 'sunflower', desc: 'Bring sunshine indoors. Nearly three feet of pipe cleaner in every golden bloom.', colors: ['#D4A373','#C49060','#E0B890'] },
  { id: 3, name: 'Violet Dream Tulip', price: 950, category: 'tulip', desc: 'Sleek and elegant, capturing the grace of spring in rich violet hues.', colors: ['#C8B0D8','#B8A0C8','#D8C0E8'] },
  { id: 4, name: 'Jade Lotus', price: 1300, category: 'wildflower', desc: 'A serene teal-green lotus inspired by tranquil garden ponds.', colors: ['#4A8B7A','#3D7A6A','#5A9B8A'] },
  { id: 5, name: 'Scarlet Poppy', price: 1100, category: 'wildflower', desc: 'Bold crimson petals with a dark center. A striking statement piece.', colors: ['#D47070','#C46060','#E08080'] },
  { id: 6, name: 'Daisy Chain', price: 850, category: 'wildflower', desc: 'Simple, cheerful daisies that brighten any corner.', colors: ['#F0E8D8','#E8D5B0','#FFF8EE'] },
  { id: 7, name: 'Golden Marigold', price: 900, category: 'sunflower', desc: 'Warm golden-orange petals that bring a touch of sunlight.', colors: ['#E8C870','#DCC060','#F0D880'] },
  { id: 8, name: 'Blush Peony', price: 1400, category: 'rose', desc: 'Lush, full-bodied bloom with soft blush petals. Our most intricate design.', colors: ['#E0B0A0','#D4A090','#E8C0B0'] },
];
