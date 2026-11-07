// Cloudflare Worker: prebere število igralcev iz Cfx.re in ga vrne s CORS glavo.
// Deploy: dash.cloudflare.com > Workers > Create > prilepi kodo > Deploy.
// Nato URL workerja vpiši v app.js pod CONFIG.playerApi.
const CODE = 'pgg7p3y'; // cfx.re/join/<koda>
export default {
  async fetch() {
    try {
      const r = await fetch(`https://servers-frontend.fivem.net/api/servers/single/${CODE}`, {
        headers: { 'User-Agent': 'Mozilla/5.0' }, cf: { cacheTtl: 30 }
      });
      const j = await r.json();
      return new Response(JSON.stringify({ players: j.Data.clients, max: j.Data.sv_maxclients }), {
        headers: { 'content-type': 'application/json', 'access-control-allow-origin': '*', 'cache-control': 'max-age=30' }
      });
    } catch (e) {
      return new Response('{"error":"unavailable"}', { status: 502, headers: { 'access-control-allow-origin': '*' } });
    }
  }
};
