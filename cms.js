/* Loads admin-managed content (from the server) before app.js runs. Falls back silently to defaults in app.js. */
(() => {
  try {
    const x = new XMLHttpRequest();
    x.open('GET', '/api/content?_=' + Date.now(), false);
    x.send();
    if (x.status === 200) window.__CMS = JSON.parse(x.responseText);
  } catch (e) {}
})();
