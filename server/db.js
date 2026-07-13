import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, 'data');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

function read(name) {
  const p = path.join(DATA_DIR, name + '.json');
  if (!fs.existsSync(p)) return [];
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return []; }
}

function write(name, data) {
  const p = path.join(DATA_DIR, name + '.json');
  const tmp = p + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf8');
  fs.renameSync(tmp, p);
}

// Default products
const DEFAULT_PRODUCTS = [
  { id: 1, name: 'Rosetta Rose', price: 1200, category: 'rose', desc: 'A romantic bloom with layered coral-peach petals. Each rose takes 45 minutes to hand-twist.', colors: ['#D4897A','#C47A6A','#E0A090'] },
  { id: 2, name: 'Solara Sunflower', price: 1000, category: 'sunflower', desc: 'Bring sunshine indoors. Nearly three feet of pipe cleaner in every golden bloom.', colors: ['#D4A373','#C49060','#E0B890'] },
  { id: 3, name: 'Violet Dream Tulip', price: 950, category: 'tulip', desc: 'Sleek and elegant, capturing the grace of spring in rich violet hues.', colors: ['#C8B0D8','#B8A0C8','#D8C0E8'] },
  { id: 4, name: 'Jade Lotus', price: 1300, category: 'wildflower', desc: 'A serene teal-green lotus inspired by tranquil garden ponds.', colors: ['#4A8B7A','#3D7A6A','#5A9B8A'] },
  { id: 5, name: 'Scarlet Poppy', price: 1100, category: 'wildflower', desc: 'Bold crimson petals with a dark center. A striking statement piece.', colors: ['#D47070','#C46060','#E08080'] },
  { id: 6, name: 'Daisy Chain', price: 850, category: 'wildflower', desc: 'Simple, cheerful daisies that brighten any corner.', colors: ['#F0E8D8','#E8D5B0','#FFF8EE'] },
  { id: 7, name: 'Golden Marigold', price: 900, category: 'sunflower', desc: 'Warm golden-orange petals that bring a touch of sunlight.', colors: ['#E8C870','#DCC060','#F0D880'] },
  { id: 8, name: 'Blush Peony', price: 1400, category: 'rose', desc: 'Lush, full-bodied bloom with soft blush petals. Our most intricate design.', colors: ['#E0B0A0','#D4A090','#E8C0B0'] },
];

export function getProducts() {
  const p = read('products');
  if (!p.length) { write('products', DEFAULT_PRODUCTS); return DEFAULT_PRODUCTS; }
  return p;
}

export function saveProducts(products) { write('products', products); }

export function getOrders() { return read('orders'); }
export function saveOrders(orders) { write('orders', orders); }

export function getMessages() { return read('messages'); }
export function saveMessages(m) { write('messages', m); }
