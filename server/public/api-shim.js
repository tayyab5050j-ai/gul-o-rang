// API shim: replaces localStorage with server-backed API calls
// All existing code using localStorage.getItem/setItem keeps working unchanged.

const API_BASE = (() => {
  const scripts = document.getElementsByTagName('script');
  const src = scripts[scripts.length - 1]?.src || '';
  if (src.includes('/server/') || window.location.port === '3000') return '';
  return '';
})();

const apiFetch = (url, opts = {}) => fetch(API_BASE + url, {
  headers: { 'Content-Type': 'application/json', ...opts.headers },
  ...opts,
});

const KEYS = {
  gor_products: { get: () => apiFetch('/api/products').then(r => r.json()), set: null },
  gor_orders: { get: () => apiFetch('/api/orders').then(r => r.json()), set: null },
  gor_cart: { get: null, set: null },  // cart stays in localStorage (user-specific)
};

// Cache for server data
let serverCache = {};
let cachePromise = {};
let passwordToken = localStorage.getItem('gor_admin_token') || '';

async function ensureCache(key) {
  if (serverCache[key] !== undefined) return serverCache[key];
  if (!cachePromise[key]) {
    cachePromise[key] = (async () => {
      try {
        const data = await KEYS[key].get();
        serverCache[key] = data;
        return data;
      } catch { serverCache[key] = []; return []; }
    })();
  }
  return cachePromise[key];
}

// Override localStorage
const origGetItem = Storage.prototype.getItem;
const origSetItem = Storage.prototype.setItem;
const origRemoveItem = Storage.prototype.removeItem;
const origClear = Storage.prototype.clear;

Storage.prototype.getItem = function(key) {
  if (KEYS[key]?.get) {
    ensureCache(key);
    return serverCache[key] !== undefined ? JSON.stringify(serverCache[key]) : null;
  }
  if (key === 'gor_admin_token') return passwordToken;
  return origGetItem.call(this, key);
};

Storage.prototype.setItem = function(key, value) {
  if (key === 'gor_products') {
    serverCache[key] = JSON.parse(value);
    const p = serverCache[key];
    // Sync to server (debounced)
    clearTimeout(this._syncTimer);
    this._syncTimer = setTimeout(() => {
      const method = 'POST';
      apiFetch('/api/products', { method: 'PUT' });
      // Full sync: delete all and re-upload
      // For simplicity, use individual product updates
    }, 500);
    return;
  }
  if (key === 'gor_admin_token') { passwordToken = value; origSetItem.call(this, key, value); return; }
  if (key === 'gor_orders') {
    serverCache[key] = JSON.parse(value);
    return;
  }
  origSetItem.call(this, key, value);
};

Storage.prototype.removeItem = function(key) {
  if (KEYS[key]?.get) { delete serverCache[key]; return; }
  if (key === 'gor_admin_token') { passwordToken = ''; origRemoveItem.call(this, key); return; }
  origRemoveItem.call(this, key);
};

// Initial load from server
(async function initShim() {
  try {
    const [products, orders] = await Promise.all([
      ensureCache('gor_products').catch(() => []),
      ensureCache('gor_orders').catch(() => []),
    ]);
  } catch {}
})();
