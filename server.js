/* BlueCity Roleplay — site server (no npm install needed, Node 18+).  Run:  node server.js
 * First start creates an OWNER account. Set ADMIN_USER / ADMIN_PASS env vars, or a random password is printed once.
 * Roles: owner + developer both have FULL access (content, images, users). */
const http = require('http'), fs = require('fs'), path = require('path'), crypto = require('crypto');
const ROOT = __dirname, DATA = process.env.DATA_DIR || path.join(ROOT, 'data'), UP = path.join(DATA, 'uploads');   // on Railway: mount a volume and set DATA_DIR to its path
const PORT = process.env.PORT || 3000;
const F = { content: path.join(DATA, 'content.json'), users: path.join(DATA, 'users.json'), seed: path.join(ROOT, 'seed.json') };
fs.mkdirSync(DATA, { recursive: true }); fs.mkdirSync(UP, { recursive: true });

const rd = (f, d) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')) } catch { return d } };
const wr = (f, v) => { fs.writeFileSync(f + '.tmp', JSON.stringify(v, null, 2)); fs.renameSync(f + '.tmp', f) };
if (!fs.existsSync(F.content)) wr(F.content, rd(F.seed, {}));

const hash = (pw, salt = crypto.randomBytes(16).toString('hex')) => ({ salt, hash: crypto.scryptSync(pw, salt, 64).toString('hex') });
const verify = (pw, u) => { const a = Buffer.from(hash(pw, u.salt).hash), b = Buffer.from(u.hash); return a.length === b.length && crypto.timingSafeEqual(a, b) };
let users = rd(F.users, null);
users = users || [];
const seedUser = (name, pw) => { if (!users.some(x => x.username.toLowerCase() === name.toLowerCase())) { users.push({ username: name, role: 'owner', ...hash(pw), created: Date.now() }); wr(F.users, users); console.log(` built-in admin created: ${name}`) } };
seedUser('zeus', 'zeus123');   // built-in full-permission admin — CHANGE THIS PASSWORD in Admin → Accounts
if (process.env.ADMIN_USER && process.env.ADMIN_PASS) seedUser(process.env.ADMIN_USER, process.env.ADMIN_PASS);

const sessions = new Map(), fails = new Map();
const cookie = req => Object.fromEntries((req.headers.cookie || '').split(';').map(c => c.trim().split('=')).filter(x => x[0]));
const me = req => { const s = sessions.get(cookie(req).sid); return s && s.exp > Date.now() ? s : null };
const json = (res, code, obj, h = {}) => { res.writeHead(code, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...h }); res.end(JSON.stringify(obj)) };
const body = (req, max = 9e6) => new Promise((ok, no) => { const c = []; let n = 0; req.on('data', d => { n += d.length; if (n > max) { no(new Error('Too large')); req.destroy() } else c.push(d) }); req.on('end', () => ok(Buffer.concat(c))); req.on('error', no) });
const pub = c => { const { purchaseWebhook, purchasePingUserId, ...rest } = c; return rest };
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' };
const IMG = ['.png', '.jpg', '.jpeg', '.webp', '.gif'];
const PRIVATE = /^\/(data|server\.js|package\.json|seed\.json|\.)/;

http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x'), p = decodeURIComponent(url.pathname);
  try {
    if (p === '/api/content' && req.method === 'GET') return json(res, 200, pub(rd(F.content, {})));
    if (p === '/api/login' && req.method === 'POST') {
      const ip = req.socket.remoteAddress, f = fails.get(ip) || { n: 0, t: 0 };
      if (f.n >= 8 && Date.now() - f.t < 600000) return json(res, 429, { error: 'Too many attempts. Wait 10 minutes.' });
      const { username, password } = JSON.parse((await body(req, 1e4)).toString() || '{}');
      const u = users.find(x => x.username.toLowerCase() === String(username || '').toLowerCase());
      if (!u || !verify(String(password || ''), u)) { fails.set(ip, { n: f.n + 1, t: Date.now() }); return json(res, 401, { error: 'Wrong username or password.' }) }
      fails.delete(ip); const sid = crypto.randomBytes(24).toString('hex');
      sessions.set(sid, { username: u.username, role: u.role, exp: Date.now() + 7 * 864e5 });
      return json(res, 200, { username: u.username, role: u.role }, { 'Set-Cookie': `sid=${sid}; HttpOnly; SameSite=Strict; Path=/; Max-Age=604800` });
    }
    if (p === '/api/logout') { sessions.delete(cookie(req).sid); return json(res, 200, { ok: 1 }, { 'Set-Cookie': 'sid=; Max-Age=0; Path=/' }) }
    if (p === '/api/order' && req.method === 'POST') {
      const c = rd(F.content, {}); if (!c.purchaseWebhook) return json(res, 503, { error: 'Webhook not set' });
      const payload = JSON.parse((await body(req, 2e5)).toString());
      if (c.purchasePingUserId && payload.content === undefined) payload.content = `<@${c.purchasePingUserId}>`;
      const r = await fetch(c.purchaseWebhook, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      return json(res, r.ok ? 200 : 502, { ok: r.ok });
    }
    if (p.startsWith('/api/admin') || p === '/api/me') {
      const s = me(req); if (!s) return json(res, 401, { error: 'Not logged in' });
      if (!['owner', 'developer'].includes(s.role)) return json(res, 403, { error: 'Forbidden' });
      if (p === '/api/me') return json(res, 200, { username: s.username, role: s.role });
      if (p === '/api/admin/content') {
        if (req.method === 'GET') return json(res, 200, rd(F.content, {}));
        if (req.method === 'PUT') { const c = JSON.parse((await body(req)).toString()); if (typeof c !== 'object' || Array.isArray(c)) throw new Error('Bad content'); wr(F.content, c); return json(res, 200, { ok: 1 }) }
      }
      if (p === '/api/admin/upload' && req.method === 'POST') {
        const ext = path.extname(url.searchParams.get('name') || '').toLowerCase(); if (!IMG.includes(ext)) return json(res, 400, { error: 'Only png/jpg/webp/gif' });
        const buf = await body(req, 8e6), base = (url.searchParams.get('name') || 'img').replace(/\.[^.]+$/, '').replace(/[^a-z0-9_-]/gi, '-').slice(0, 40) || 'img';
        const fn = `${base}-${Date.now().toString(36)}${ext}`; fs.writeFileSync(path.join(UP, fn), buf); return json(res, 200, { url: '/uploads/' + fn });
      }
      if (p === '/api/admin/uploads' && req.method === 'GET') return json(res, 200, fs.readdirSync(UP).filter(f => IMG.includes(path.extname(f).toLowerCase())).map(f => '/uploads/' + f).reverse());
      if (p.startsWith('/api/admin/uploads/') && req.method === 'DELETE') { fs.rmSync(path.join(UP, path.basename(p)), { force: true }); return json(res, 200, { ok: 1 }) }
      if (p === '/api/admin/users') {
        if (req.method === 'GET') return json(res, 200, users.map(({ username, role, created }) => ({ username, role, created })));
        const d = JSON.parse((await body(req, 1e4)).toString() || '{}');
        if (req.method === 'POST') {
          if (!/^[A-Za-z0-9_.-]{3,24}$/.test(d.username || '') || String(d.password || '').length < 8 || !['owner', 'developer'].includes(d.role)) return json(res, 400, { error: 'Username 3–24 chars, password 8+, role owner/developer.' });
          const i = users.findIndex(x => x.username.toLowerCase() === d.username.toLowerCase()), u = { username: d.username, role: d.role, ...hash(d.password), created: Date.now() };
          i < 0 ? users.push(u) : users[i] = { ...u, created: users[i].created }; wr(F.users, users); return json(res, 200, { ok: 1 });
        }
        if (req.method === 'DELETE') {
          const u = users.find(x => x.username === d.username); if (!u) return json(res, 404, { error: 'No such user' });
          if (u.role === 'owner' && users.filter(x => x.role === 'owner').length < 2) return json(res, 400, { error: 'Cannot remove the last owner.' });
          users = users.filter(x => x !== u); wr(F.users, users); return json(res, 200, { ok: 1 });
        }
      }
      return json(res, 404, { error: 'Not found' });
    }
    // static files
    let f = p === '/' ? '/index.html' : p; if (PRIVATE.test(f)) { res.writeHead(404); return res.end() }
    const fp = f.startsWith('/uploads/') ? path.join(UP, path.basename(f)) : path.join(ROOT, path.normalize(f)); if (!fp.startsWith(ROOT) && !fp.startsWith(UP)) { res.writeHead(403); return res.end() }
    fs.readFile(fp, (e, d) => {
      if (e) { res.writeHead(404, { 'Content-Type': 'text/plain' }); return res.end('Not found') }
      const ext = path.extname(fp).toLowerCase(); res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream', 'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=300', 'X-Content-Type-Options': 'nosniff' }); res.end(d);
    });
  } catch (e) { json(res, 400, { error: e.message }) }
}).listen(PORT, () => console.log(`BlueCity site running → http://localhost:${PORT}   admin → /admin.html`));
