/* Spectra Roleplay — customer accounts
 *
 * IMPORTANT: this site is static (no server), so accounts live in the visitor's own browser
 * (localStorage). That is enough to guide customers through "sign up -> sign in -> buy", but it is
 * NOT real security: nobody can verify accounts across devices and the gate can be bypassed by a
 * technical user. To make it real, replace the 4 functions in `backend` below with calls to a
 * server (Supabase, Firebase Auth, your own API). The rest of the site only uses window.Auth.
 */
(() => {
  const USERS = 'pg_users', SESSION = 'pg_session';
  const read = (k, st = localStorage) => { try { return JSON.parse(st.getItem(k)) } catch { return null } };
  const write = (k, v, st = localStorage) => st.setItem(k, JSON.stringify(v));
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const b64 = buf => btoa(String.fromCharCode(...new Uint8Array(buf)));

  async function hash(password, salt) {
    if (crypto?.subtle) {
      const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
      const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: new TextEncoder().encode(salt), iterations: 150000, hash: 'SHA-256' }, key, 256);
      return b64(bits);
    }
    let h = 5381; for (const c of salt + password) h = ((h << 5) + h + c.charCodeAt(0)) >>> 0; // fallback for non-secure contexts
    return 'f' + h.toString(36);
  }
  const rnd = () => b64(crypto.getRandomValues(new Uint8Array(16)));

  /* ---- swap these four for a real server ---- */
  const backend = {
    async signUp({ username, email, password, discord }) {
      const users = read(USERS) || {}, e = email.toLowerCase();
      if (users[e]) throw new Error('Račun s tem e-poštnim naslovom že obstaja. Prijavite se.');
      if (Object.values(users).some(u => u.username.toLowerCase() === username.toLowerCase())) throw new Error('To uporabniško ime je že zasedeno.');
      const salt = rnd();
      users[e] = { username, email, discord, salt, hash: await hash(password, salt), created: Date.now() };
      write(USERS, users);
      return users[e];
    },
    async signIn(id, password) {
      const users = read(USERS) || {}, q = id.toLowerCase();
      const u = users[q] || Object.values(users).find(x => x.username.toLowerCase() === q);
      if (!u || (await hash(password, u.salt)) !== u.hash) throw new Error('Napačno uporabniško ime ali geslo.');
      return u;
    },
    update(email, patch) {
      const users = read(USERS) || {}, e = email.toLowerCase(); if (!users[e]) throw new Error('Račun ne obstaja.');
      users[e] = { ...users[e], ...patch }; write(USERS, users); return users[e];
    },
    orders: email => (read('pg_orders') || {})[email.toLowerCase()] || [],
    addOrder(email, o) { const all = read('pg_orders') || {}, e = email.toLowerCase(); all[e] = [o, ...(all[e] || [])]; write('pg_orders', all); return o },
    session: () => read(SESSION, localStorage) || read(SESSION, sessionStorage),
    signOut() { localStorage.removeItem(SESSION); sessionStorage.removeItem(SESSION) }
  };

  const pub = u => u && { username: u.username, email: u.email, discord: u.discord || '', discordLinkedAt: u.discordLinkedAt || null, name: u.name || '', avatar: u.avatar || '', created: u.created };
  const Auth = window.Auth = {
    user() { const s = backend.session(); if (!s) return null; const u = (read(USERS) || {})[s.email.toLowerCase()]; return u ? pub(u) : null },
    async signUp(d) { await sleep(500); const u = await backend.signUp(d); this._start(u, true); return pub(u) },
    async signIn(id, pw, remember = true) { await sleep(500); const u = await backend.signIn(id, pw); this._start(u, remember); return pub(u) },
    signOut() { backend.signOut(); location.href = 'index.html' },
    async update(patch) { const u = this.user(); if (!u) throw new Error('Niste prijavljeni.'); await sleep(350); return pub(backend.update(u.email, patch)) },
    orders() { const u = this.user(); return u ? backend.orders(u.email) : [] },
    addOrder(o) { const u = this.user(); return u ? backend.addOrder(u.email, o) : null },
    display(u = this.user()) { return u ? (u.name || u.username) : '' },
    _start(u, remember) { write(SESSION, { email: u.email }, remember ? localStorage : sessionStorage) }
  };

  /* ---- account button in the navbar (every page) ---- */
  const initial = n => (n || '?').slice(0, 1).toUpperCase();
  const esc = t => String(t).replace(/[<>&"']/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;' }[c]));
  const avatar = u => u.avatar ? `<span class="av"><img src="${u.avatar}" alt=""></span>` : `<span class="av">${esc(initial(Auth.display(u)))}</span>`;
  window.__avatarHTML = avatar;
  function navUI() {
    const u = Auth.user(), inner = document.querySelector('.nav-inner'), mob = document.getElementById('mobile');
    if (!inner) return;
    const dn = u && esc(Auth.display(u));
    const html = u
      ? `<div class="acct"><button class="acct-btn" id="acctBtn" aria-haspopup="true" aria-expanded="false">${avatar(u)}<span class="an">${dn}</span></button>
          <div class="acct-menu" id="acctMenu"><div class="am-h"><b>${dn}</b><span>${esc(u.email)}</span></div><a href="racun.html#profile">Moj račun</a><a href="racun.html#orders">Moji nakupi</a><a href="racun.html#settings">Nastavitve videza</a><a href="trgovina.html">Trgovina</a><button id="logoutBtn">Odjava</button></div></div>`
      : `<a href="login.html?next=${encodeURIComponent(location.pathname.split('/').pop() || 'index.html')}" class="btn btn-ghost btn-sm nav-login">Prijava</a>`;
    const discord = inner.querySelector('a.btn-primary');
    discord ? discord.insertAdjacentHTML('beforebegin', html) : inner.insertAdjacentHTML('beforeend', html);
    if (mob) mob.insertAdjacentHTML('afterbegin', u
      ? `<a class="ml" href="racun.html">Moj račun</a><a class="ml ml-out" href="#" id="logoutMob">Odjava</a>`
      : `<a class="ml" href="login.html">Prijava</a>`);
    const btn = document.getElementById('acctBtn'), menu = document.getElementById('acctMenu');
    if (btn) {
      btn.onclick = e => { e.stopPropagation(); const o = menu.classList.toggle('open'); btn.setAttribute('aria-expanded', o) };
      document.addEventListener('click', () => { menu.classList.remove('open'); btn.setAttribute('aria-expanded', false) });
    }
    const out = e => { e?.preventDefault(); Auth.signOut() };
    document.getElementById('logoutBtn')?.addEventListener('click', out);
    document.getElementById('logoutMob')?.addEventListener('click', out);
  }
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', navUI) : navUI();

  /* ---- login page ---- */
  document.addEventListener('DOMContentLoaded', () => {
    const wrap = document.getElementById('authForms'); if (!wrap) return;
    const params = new URLSearchParams(location.search);
    const next = (params.get('next') || 'trgovina.html').replace(/[^a-zA-Z0-9_.\-]/g, ''), buy = params.get('buy');
    const go = () => { document.body.classList.add('leaving'); setTimeout(() => location.href = next + (buy ? '?buy=' + encodeURIComponent(buy) : ''), 300) };
    if (Auth.user()) { document.getElementById('already').style.display = 'block'; wrap.style.display = 'none'; document.getElementById('alreadyName').textContent = Auth.user().username; return }
    if (buy) document.getElementById('buyNote').style.display = 'block';

    const tabs = wrap.querySelectorAll('.a-tab'), panes = wrap.querySelectorAll('.a-pane'), ind = wrap.querySelector('.a-ind');
    const setTab = t => { tabs.forEach((b, i) => { const on = b.dataset.t === t; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); if (on) ind.style.transform = `translateX(${i * 100}%)` });
      panes.forEach(p => p.classList.toggle('on', p.dataset.p === t)); document.getElementById('authTitle').textContent = t === 'in' ? 'Prijava' : 'Ustvari račun' };
    tabs.forEach(b => b.onclick = () => setTab(b.dataset.t));
    wrap.querySelectorAll('[data-go]').forEach(a => a.onclick = e => { e.preventDefault(); setTab(a.dataset.go) });
    if (location.hash === '#register') setTab('up');

    wrap.querySelectorAll('.eye').forEach(b => b.onclick = () => { const i = b.parentNode.querySelector('input'); const show = i.type === 'password'; i.type = show ? 'text' : 'password'; b.classList.toggle('on', show); b.setAttribute('aria-label', show ? 'Skrij geslo' : 'Pokaži geslo') });

    const err = (form, msg) => { const e = form.querySelector('.f-err'); e.textContent = msg; e.classList.add('show'); form.classList.remove('shake'); void form.offsetWidth; form.classList.add('shake') };
    const clear = form => form.querySelector('.f-err').classList.remove('show');
    const busy = (b, on, label) => { b.disabled = on; b.classList.toggle('busy', on); b.innerHTML = on ? '<span class="spin"></span>Počakajte…' : label };

    // password strength meter
    const pw = document.getElementById('upPass'), meter = document.getElementById('meter'), mtxt = document.getElementById('meterTxt');
    const score = v => { let s = 0; if (v.length >= 8) s++; if (/[A-Z]/.test(v) && /[a-z]/.test(v)) s++; if (/\d/.test(v)) s++; if (/[^A-Za-z0-9]/.test(v) || v.length >= 14) s++; return s };
    pw.oninput = () => { const s = pw.value ? Math.max(1, score(pw.value)) : 0; meter.dataset.s = s; mtxt.textContent = ['', 'Šibko', 'Zadostno', 'Dobro', 'Odlično'][s] };

    const fIn = document.getElementById('formIn'), fUp = document.getElementById('formUp');
    fIn.onsubmit = async e => {
      e.preventDefault(); clear(fIn);
      const id = fIn.id_.value.trim(), p = fIn.pass.value, btn = fIn.querySelector('.btn');
      if (!id || !p) return err(fIn, 'Vnesite uporabniško ime (ali e-pošto) in geslo.');
      busy(btn, true); try { await Auth.signIn(id, p, fIn.remember.checked); btn.innerHTML = 'Prijavljeni ✓'; toast('Dobrodošli nazaj!', 'ok'); go() }
      catch (x) { busy(btn, false, 'Prijava'); err(fIn, x.message) }
    };
    fUp.onsubmit = async e => {
      e.preventDefault(); clear(fUp);
      const d = { username: fUp.user.value.trim(), email: fUp.email.value.trim(), discord: fUp.discord.value.trim(), password: fUp.pass.value }, btn = fUp.querySelector('.btn');
      if (!/^[A-Za-z0-9_.-]{3,20}$/.test(d.username)) return err(fUp, 'Uporabniško ime: 3–20 znakov (črke, številke, _ . -).');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) return err(fUp, 'Vnesite veljaven e-poštni naslov.');
      if (d.password.length < 8) return err(fUp, 'Geslo mora imeti vsaj 8 znakov.');
      if (d.password !== fUp.pass2.value) return err(fUp, 'Gesli se ne ujemata.');
      if (!fUp.terms.checked) return err(fUp, 'Za nadaljevanje potrdite pogoje.');
      busy(btn, true); try { await Auth.signUp(d); btn.innerHTML = 'Račun ustvarjen ✓'; toast('Račun je ustvarjen.', 'ok'); go() }
      catch (x) { busy(btn, false, 'Ustvari račun'); err(fUp, x.message) }
    };
  });
})();
