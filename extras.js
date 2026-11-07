(() => {
  const sp = document.createElement('div'); sp.id = 'sp'; document.body.appendChild(sp);
  const up = document.createElement('button'); up.id = 'up'; up.setAttribute('aria-label', 'Top'); up.textContent = '↑';
  up.onclick = () => scrollTo({ top: 0, behavior: 'smooth' }); document.body.appendChild(up);
  addEventListener('scroll', () => {
    const h = document.documentElement, p = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight);
    sp.style.width = (p * 100) + '%'; up.classList.toggle('on', h.scrollTop > 600);
  }, { passive: true });
  const s = (window.__CMS || {}).settings || {};
  if (s.announcementOn && s.announcement) {
    const a = document.createElement('div'); a.id = 'ann'; a.textContent = s.announcement; document.body.prepend(a);
  }
})();

/* ===== admin panel integrated into the site (overlay) + live stats ===== */
(() => {
  const C = window.__CMS || {}, set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v };
  set('sPl', C.players ?? 0); set('sPk', Object.keys(C.donations || {}).length); set('sPd', (C.peds || []).length); set('sSt', (C.staff || []).length);
  let saved = false;
  const ov = document.createElement('div'); ov.id = 'admOv';
  ov.innerHTML = '<button class="cl" aria-label="Close">✕</button>'; document.body.appendChild(ov);
  const open = () => { if (!ov.querySelector('iframe')) { const f = document.createElement('iframe'); f.src = 'admin.html?embed=1'; f.title = 'Admin panel'; ov.appendChild(f) } ov.classList.add('on'); document.body.style.overflow = 'hidden'; history.replaceState(null, '', '#admin') };
  const close = () => { ov.classList.remove('on'); document.body.style.overflow = ''; history.replaceState(null, '', location.pathname); if (saved) location.reload() };
  ov.querySelector('.cl').onclick = close; addEventListener('keydown', e => e.key === 'Escape' && ov.classList.contains('on') && close());
  addEventListener('message', e => { if (e.data === 'bc-saved') saved = true });
  const mk = (cls, txt) => { const b = document.createElement('button'); b.className = cls; b.textContent = txt; b.onclick = open; return b };
  const foot = document.querySelector('.f-bottom'); if (foot) foot.appendChild(mk('adm-link', 'Ekipa · Admin'));
  fetch('/api/me', { credentials: 'same-origin' }).then(r => r.ok ? r.json() : null).then(m => {
    if (!m) return; const a = document.querySelector('.nav-inner a.btn-primary');
    const b = mk('btn btn-ghost btn-sm', '⚙ Admin'); a ? a.before(b) : document.querySelector('.nav-inner')?.appendChild(b);
  }).catch(() => {});
  if (location.hash === '#admin') open();
})();
