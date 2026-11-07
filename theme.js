/* Spectra Roleplay — appearance preferences (theme / accent / motion). Loaded in <head> to avoid a flash. */
(() => {
  const KEY = 'pg_prefs', root = document.documentElement;
  const ACCENTS = {
    cyan:   { n: 'Azur',      d: ['57,219,255', '9,147,239', '#39dbff', '#0993ef', '#0156b1'], l: ['0,120,200', '1,86,177', '#0a7bc4', '#0156b1', '#014a96'] },
    violet: { n: 'Vijolična', d: ['181,140,255', '110,80,255', '#b58cff', '#6e50ff', '#5a3fc4'], l: ['110,70,220', '70,50,190', '#6e46dc', '#4632be', '#4a2fa0'] },
    green:  { n: 'Zelena',    d: ['74,222,128', '16,185,129', '#4ade80', '#10b981', '#0b7a55'], l: ['14,140,80', '8,110,90', '#0e8c50', '#086e5a', '#0a6a40'] },
    amber:  { n: 'Jantarna',  d: ['255,210,74', '255,140,40', '#ffd24a', '#ff8c28', '#a8721a'], l: ['176,120,0', '190,90,10', '#b07800', '#be5a0a', '#8a5a00'] },
    rose:   { n: 'Roza',      d: ['255,120,170', '230,60,130', '#ff78aa', '#e63c82', '#a8346a'], l: ['205,50,110', '170,30,90', '#cd326e', '#aa1e5a', '#8a2058'] }
  };
  const DEFAULTS = { theme: 'dark', accent: 'cyan', motion: 'full' };
  const mq = matchMedia('(prefers-color-scheme: light)');
  const load = () => { try { return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY)) } } catch { return { ...DEFAULTS } } };
  let prefs = load();

  function apply() {
    const resolved = prefs.theme === 'system' ? (mq.matches ? 'light' : 'dark') : prefs.theme;
    const a = ACCENTS[prefs.accent] || ACCENTS.cyan, v = resolved === 'light' ? a.l : a.d;
    root.dataset.theme = resolved;
    root.dataset.motion = prefs.motion;
    root.style.setProperty('--acc-rgb', v[0]); root.style.setProperty('--acc2-rgb', v[1]);
    root.style.setProperty('--cyan', v[2]); root.style.setProperty('--blue', v[3]); root.style.setProperty('--deep', v[4]);
    dispatchEvent(new Event('prefs-change'));
  }
  window.Prefs = {
    ACCENTS, DEFAULTS,
    get: () => ({ ...prefs }),
    set(patch) { prefs = { ...prefs, ...patch }; try { localStorage.setItem(KEY, JSON.stringify(prefs)) } catch {} apply() },
    reset() { try { localStorage.removeItem(KEY) } catch {} prefs = { ...DEFAULTS }; apply() }
  };
  mq.addEventListener?.('change', () => prefs.theme === 'system' && apply());
  apply();
})();
