// API client for gul-o-rang server
// All data loads/saves go through this module instead of localStorage

const API = (() => {
  const base = '';

  async function req(url, opts = {}) {
    const sep = url.includes('?') ? '&' : '?';
    const cacheUrl = !opts.method || opts.method === 'GET' ? url + sep + '_t=' + Date.now() : url;
    const res = await fetch(base + cacheUrl, {
      headers: { 'Content-Type': 'application/json', ...opts.headers },
      ...opts,
    });
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
  }

  return {
    // Products
    async getProducts() {
      try { return await req('/api/products'); } catch { return []; }
    },
    async getProduct(id) {
      return req('/api/products/' + id);
    },
    async saveProducts(products) {
      try { await req('/api/products/batch', { method: 'PUT', body: JSON.stringify(products) }); } catch (e) { console.error('saveProducts failed:', e); }
    },
    async saveOrders(orders) {
      try { await req('/api/orders/batch', { method: 'PUT', body: JSON.stringify(orders) }); } catch (e) { console.error('saveOrders failed:', e); }
    },
    async addProduct(p) {
      return req('/api/products', { method: 'POST', body: JSON.stringify(p) });
    },
    async updateProduct(id, data) {
      return req('/api/products/' + id, { method: 'PUT', body: JSON.stringify(data) });
    },
    async deleteProduct(id) {
      return req('/api/products/' + id, { method: 'DELETE' });
    },

    // Orders
    async getOrders(email) {
      const q = email ? '?email=' + encodeURIComponent(email) : '';
      try { return await req('/api/orders' + q); } catch { return []; }
    },
    async placeOrder(order) {
      return req('/api/orders', { method: 'POST', body: JSON.stringify(order) });
    },
    async updateOrderStatus(id, status) {
      return req('/api/orders/' + id, { method: 'PUT', body: JSON.stringify({ status }) });
    },

    // Contact
    async sendMessage(msg) {
      return req('/api/contact', { method: 'POST', body: JSON.stringify(msg) });
    },

    // Auth
    async login(password) {
      try {
        const res = await req('/api/login', { method: 'POST', body: JSON.stringify({ password }) });
        if (res.token) localStorage.setItem('gor_admin_token', res.token);
        return !!res.token;
      } catch { return false; }
    },
  };
})();
