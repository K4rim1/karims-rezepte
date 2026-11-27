const UA = { 'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1', 'accept-language': 'de-AT,de;q=0.9' };
const get = async (u, h = {}) => { try { const r = await fetch(u, { headers: { ...UA, ...h } }); return { s: r.status, t: await r.text() }; } catch (e) { return { s: 'ERR ' + e.message, t: '' }; } };
const show = (l, x) => console.log('\n### ' + l + '\n' + x);
const cat = await get('https://www.hofer.at/produkte/milchprodukte/k/158816141856710103');
const tiles = cat.t.split('class="product-tile ').length - 1;
show('Milchprodukte: ' + cat.s + ', Kacheln: ' + tiles, '');
const i = cat.t.indexOf('product-tile__name');
show('Kachel-HTML', cat.t.slice(Math.max(0, i - 1500), i + 2200).replace(/<!--[^>]*-->/g, '').replace(/\s+/g, ' '));
show('Seitenzahl-Hinweise', [...new Set([...cat.t.matchAll(/(page=\d+|[?&]p=\d+|totalCount["':\s]+\d+|"total"\s*:\s*\d+|Seite \d+ von \d+|\d+ Produkte)/gi)].map(m => m[0]))].slice(0, 20).join(' | '));
const nuxt = cat.t.match(/window\.__NUXT__\s*=\s*([\s\S]{0,600})/); show('NUXT-Anfang', nuxt ? nuxt[1].replace(/\s+/g, ' ') : 'keins');
const p2 = await get('https://www.hofer.at/produkte/milchprodukte/k/158816141856710103?page=2');
show('Seite 2: ' + p2.s + ', Kacheln ' + (p2.t.split('class="product-tile ').length - 1) + ', erste: ' + ((p2.t.match(/product-tile__name"[^>]*><p aria-label="([^"]+)"/) || [])[1]), '');
const js = [...cat.t.matchAll(/src="(\/_nuxt\/[^"]+\.js)"/g)].map(m => m[1]);
const pre = [...cat.t.matchAll(/href="(\/_nuxt\/[^"]+\.js)"/g)].map(m => m[1]);
show('Nuxt-Dateien', js.concat(pre).slice(0, 30).join(' '));
const paths = new Set();
for (const f of js.concat(pre).slice(0, 60)) {
  const r = await get('https://www.hofer.at' + f);
  for (const m of r.t.matchAll(/["'`](\/v\d+\/[a-zA-Z0-9\-\/{}$]+)["'`]/g)) paths.add(m[1]);
  for (const m of r.t.matchAll(/asl\.api[^"'`]{0,80}/g)) paths.add(m[0]);
}
show('API-Pfade in Nuxt-Dateien', [...paths].slice(0, 60).join('\n'));
