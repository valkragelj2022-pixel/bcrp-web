/* Spectra Roleplay — customer account panel */
(() => {
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const esc = t => String(t ?? '').replace(/[<>&"']/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;' }[c]));
  const dFmt = (ts, time) => new Date(ts).toLocaleDateString('sl-SI', { day: 'numeric', month: 'long', year: 'numeric', ...(time ? { hour: '2-digit', minute: '2-digit' } : {}) });
  const busy = (b, on, label) => { b.classList.toggle('busy', on); b.disabled = on; b.innerHTML = on ? '<span class="spin"></span>Shranjujem…' : label };

  async function save(btn, label, patch, okMsg) {
    busy(btn, true); let ok = false;
    try { await Auth.update(patch); ok = true; toast(okMsg, 'ok') } catch { toast('Shranjevanje ni uspelo. Poskusite znova (pomnilnik brskalnika je morda poln).', 'err') }
    busy(btn, false, label); return ok;
  }

  if (!window.Auth || !Auth.user()) { location.replace('login.html?next=racun.html'); return }
  $('#accRoot').style.visibility = 'visible';

  /* ---------- header ---------- */
  const avatarMarkup = u => u.avatar ? `<img src="${u.avatar}" alt="">` : esc((Auth.display(u) || '?')[0].toUpperCase());
  function renderHead() {
    const u = Auth.user();
    $('#hName').textContent = Auth.display(u);
    $('#hUser').textContent = '@' + u.username;
    $('#hSince').textContent = 'Član od ' + dFmt(u.created);
    $('#avBig').innerHTML = avatarMarkup(u); $('#avPrev').innerHTML = avatarMarkup(u);
    $('#avDel').style.display = u.avatar ? '' : 'none';
    const dc = $('#hDc'); dc.className = 'stag' + (u.discordLinkedAt ? ' ok' : '');
    dc.textContent = u.discordLinkedAt ? 'Discord: ' + u.discord : 'Discord ni povezan';
    // navbar avatar/name
    const nb = $('#acctBtn'); if (nb) { nb.querySelector('.av').outerHTML = window.__avatarHTML(u); nb.querySelector('.an').textContent = Auth.display(u); $('#acctMenu .am-h b').textContent = Auth.display(u) }
  }

  /* ---------- tabs ---------- */
  const tabs = $$('.acc-tabs button'), secs = $$('.acc-sec'), ind = $('.acc-ind');
  function setTab(t, push = true) {
    if (!secs.some(s => s.dataset.s === t)) t = 'profile';
    tabs.forEach((b, i) => { const on = b.dataset.t === t; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); if (on) { ind.style.width = b.offsetWidth + 'px'; ind.style.transform = `translateX(${b.offsetLeft - 5}px)` } });
    secs.forEach(s => s.classList.toggle('on', s.dataset.s === t));
    if (push) history.replaceState(null, '', '#' + t);
  }
  tabs.forEach(b => b.onclick = () => setTab(b.dataset.t));
  addEventListener('hashchange', () => setTab(location.hash.slice(1), false));
  addEventListener('resize', () => setTab(location.hash.slice(1) || 'profile', false));

  /* ---------- profile: display name ---------- */
  const fP = $('#fProfile'), pName = $('#pName'), pSave = $('#pSave');
  const u0 = Auth.user(); pName.value = u0.name; $('#pUser').value = u0.username; $('#pMail').value = u0.email;
  pName.oninput = () => { pSave.disabled = pName.value.trim() === (Auth.user().name || '') };
  fP.onsubmit = async e => {
    e.preventDefault(); const err = fP.querySelector('.f-err'); err.classList.remove('show');
    const v = pName.value.trim();
    if (v && !/^[\p{L}\p{N} _.'-]{2,24}$/u.test(v)) { err.textContent = 'Ime: 2–24 znakov (črke, številke, presledki).'; err.classList.add('show'); return }
    if (await save(pSave, 'Shrani spremembe', { name: v }, 'Ime je shranjeno.')) { pSave.disabled = true; renderHead() }
  };

  /* ---------- profile picture + cropper ---------- */
  const file = $('#avFile'), ov = $('#cropOv'), cv = $('#cropCv'), cx = cv.getContext('2d'), zoom = $('#cropZoom');
  let img = null, ox = 0, oy = 0, drag = null, base = 1;
  const SZ = 280;
  const draw = () => {
    cx.clearRect(0, 0, SZ, SZ); if (!img) return;
    const z = base * zoom.value, w = img.width * z, h = img.height * z;
    ox = Math.min(0, Math.max(SZ - w, ox)); oy = Math.min(0, Math.max(SZ - h, oy));
    cx.drawImage(img, ox, oy, w, h);
  };
  const open = src => {
    const i = new Image();
    i.onload = () => { img = i; base = SZ / Math.min(i.width, i.height); zoom.value = 1; ox = (SZ - i.width * base) / 2; oy = (SZ - i.height * base) / 2; draw(); ov.classList.add('open') };
    i.onerror = () => toast('Slike ni mogoče prebrati.', 'err');
    i.src = src;
  };
  $('#avBtn').onclick = $('#avPick').onclick = () => file.click();
  file.onchange = () => {
    const f = file.files[0]; file.value = ''; if (!f) return;
    if (!/^image\/(png|jpe?g|webp|gif)$/.test(f.type)) return toast('Dovoljene so le slike PNG, JPG, WebP ali GIF.', 'err');
    if (f.size > 8 * 1024 * 1024) return toast('Slika je prevelika (največ 8 MB).', 'err');
    const r = new FileReader(); r.onload = () => open(r.result); r.readAsDataURL(f);
  };
  zoom.oninput = () => { const c = SZ / 2, old = zoom._z || 1, nz = +zoom.value; ox = c - (c - ox) * (nz / old); oy = c - (c - oy) * (nz / old); zoom._z = nz; draw() };
  cv.onpointerdown = e => { drag = { x: e.clientX - ox, y: e.clientY - oy }; cv.setPointerCapture(e.pointerId) };
  cv.onpointermove = e => { if (!drag) return; ox = e.clientX - drag.x; oy = e.clientY - drag.y; draw() };
  cv.onpointerup = cv.onpointercancel = () => drag = null;
  const closeCrop = () => { ov.classList.remove('open'); zoom._z = 1 };
  $('#cropCancel').onclick = closeCrop;
  ov.onclick = e => { if (e.target === ov) closeCrop() };
  addEventListener('keydown', e => e.key === 'Escape' && closeCrop());
  $('#cropSave').onclick = async function () {
    const out = document.createElement('canvas'); out.width = out.height = 256;
    out.getContext('2d').drawImage(cv, 0, 0, 256, 256);
    if (await save(this, 'Shrani sliko', { avatar: out.toDataURL('image/jpeg', .86) }, 'Profilna slika je posodobljena.')) { closeCrop(); renderHead() }
  };
  $('#avDel').onclick = async () => { try { await Auth.update({ avatar: '' }); renderHead(); toast('Slika je odstranjena.') } catch { toast('Odstranjevanje ni uspelo.', 'err') } };

  /* ---------- Discord ---------- */
  function renderDc() {
    const u = Auth.user(), linked = !!u.discordLinkedAt;
    $('#dcUnlinked').style.display = linked ? 'none' : ''; $('#dcLinked').style.display = linked ? '' : 'none';
    if (linked) { $('#dcShow').textContent = u.discord; $('#dcWhen').textContent = 'od ' + dFmt(u.discordLinkedAt) }
  }
  $('#fDc').onsubmit = async e => {
    e.preventDefault(); const err = $('#dcErr'), btn = e.target.querySelector('.btn'); err.classList.remove('show');
    const v = $('#dcName').value.trim().replace(/^@/, '');
    if (!/^[A-Za-z0-9_.]{2,32}(#\d{4})?$/.test(v)) { err.textContent = 'Vnesite veljavno Discord uporabniško ime (npr. uporabnik ali uporabnik#1234).'; err.classList.add('show'); return }
    if (await save(btn, 'Poveži Discord', { discord: v, discordLinkedAt: Date.now() }, 'Discord je povezan.')) { renderDc(); renderHead() }
  };
  $('#dcUnlink').onclick = async () => { try { await Auth.update({ discord: '', discordLinkedAt: null }); $('#dcName').value = ''; renderDc(); renderHead(); toast('Povezava prekinjena.') } catch { toast('Prekinitev povezave ni uspela.', 'err') } };

  /* ---------- orders ---------- */
  let filter = 'all';
  const STATUS = { pending: ['V preverjanju', 'warn'], done: ['Aktivirano', 'ok'], rejected: ['Zavrnjeno', 'bad'] };
  const METHOD = { paypal: 'PayPal', paysafe: 'Paysafe' };
  const money = n => '€' + (Number.isFinite(n) ? n.toFixed(2) : '0.00');
  const eur = p => String(p ?? '').replace(/\$/g, '€'); // starejša naročila, shranjena v $
  function renderOrders() {
    const all = Auth.orders(), list = all.filter(o => filter === 'all' || (filter === 'ped' ? o.ped : filter === 'mlo' ? o.mlo : !o.ped && !o.mlo));
    $('#ordCount').textContent = all.length;
    const total = all.reduce((s, o) => s + (o.amount || 0), 0), pend = all.filter(o => o.status === 'pending').length;
    $('#ordStats').innerHTML = [['Naročila', all.length], ['Skupaj porabljeno', money(total)], ['V preverjanju', pend]].map(([l, v]) => `<div class="card stat3"><b>${v}</b><span>${l}</span></div>`).join('');
    $('#ordEmpty').style.display = all.length ? 'none' : ''; $('#ordFilter').style.display = all.length ? '' : 'none';
    $('#ordList').innerHTML = list.map(o => {
      const [sl, sc] = STATUS[o.status] || STATUS.pending;
      const thumb = o.photo ? `<img src="${esc(o.photo)}" alt="" onerror="this.remove()">` : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L2 12V2h10l8.6 8.6a2 2 0 0 1 0 2.8z"/><circle cx="7" cy="7" r="1.2"/></svg>`;
      const rows = [['Št. naročila', o.ref], ['Datum', dFmt(o.ts, true)], ['Način plačila', METHOD[o.method] || o.method], o.txId && ['PayPal transakcija', o.txId], o.pedText && ['Želje za ped', o.pedText]].filter(Boolean);
      return `<details class="ord"><summary><span class="ord-th">${thumb}</span><span class="ord-main"><b>${esc(o.name)}</b><small>${dFmt(o.ts)} · ${esc(o.ref)}</small></span><span class="ord-price">${esc(eur(o.price))}<small>${esc(o.period)}</small></span><span class="stag ${sc}">${sl}</span><svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="m6 9 6 6 6-6"/></svg></summary>
        <dl>${rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl></details>`;
    }).join('') || (all.length ? '<div class="ord-none">V tej kategoriji ni nakupov.</div>' : '');
  }
  $$('#ordFilter button').forEach(b => b.onclick = () => { filter = b.dataset.f; $$('#ordFilter button').forEach(x => x.classList.toggle('on', x === b)); renderOrders() });

  /* ---------- appearance ---------- */
  const mark = () => {
    const p = Prefs.get();
    $$('#thPick button').forEach(b => b.classList.toggle('on', b.dataset.v === p.theme));
    $$('#swPick button').forEach(b => b.classList.toggle('on', b.dataset.v === p.accent));
    $$('#motPick button').forEach(b => b.classList.toggle('on', b.dataset.v === p.motion));
  };
  $('#swPick').innerHTML = Object.entries(Prefs.ACCENTS).map(([k, a]) => `<button type="button" data-v="${k}" aria-label="${a.n}" title="${a.n}" style="--a:${a.d[2]};--b:${a.d[3]}"><i></i></button>`).join('');
  $('#thPick').onclick = e => { const b = e.target.closest('button'); if (b) { Prefs.set({ theme: b.dataset.v }); mark() } };
  $('#swPick').onclick = e => { const b = e.target.closest('button'); if (b) { Prefs.set({ accent: b.dataset.v }); mark() } };
  $('#motPick').onclick = e => { const b = e.target.closest('button'); if (b) { Prefs.set({ motion: b.dataset.v }); mark() } };
  $('#thReset').onclick = () => { Prefs.reset(); mark(); toast('Nastavitve ponastavljene.') };

  renderHead(); renderDc(); renderOrders(); mark();
  requestAnimationFrame(() => setTab(location.hash.slice(1) || 'profile', false));
  document.fonts?.ready.then(() => setTab(location.hash.slice(1) || 'profile', false));
})();
