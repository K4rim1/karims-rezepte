const UA = { 'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1', 'accept-language': 'de-AT,de;q=0.9', accept: '*/*' };
async function get(url, opt = {}) {
  try {
    const r = await fetch(url, { headers: { ...UA, ...(opt.headers || {}) }, method: opt.method || 'GET', body: opt.body, redirect: 'follow' });
    const t = await r.text();
    console.log(`\n### ${opt.method || 'GET'} ${url}\n→ ${r.status} ${r.headers.get('content-type')} ${t.length} Zeichen · final ${r.url}`);
    console.log(t.slice(0, opt.n || 400).replace(/\s+/g, ' '));
    return { r, t };
  } catch (e) { console.log(`\n### ${url}\n→ FEHLER ${e.message}`); return {}; }
}
const hosts = (t) => [...new Set((t.match(/https?:\/\/[a-z0-9.-]+\.[a-z]{2,}(?:\/[a-z0-9._\/-]{0,40})?/gi) || []).filter(u => /api|shop|search|product|algolia|graphql/i.test(u)))].slice(0, 40);
// Lidl
await get('https://www.lidl.at/p/api/gridboxes/AT/de/?max=20');
await get('https://www.lidl.at/q/api/search?assortment=AT&locale=de_AT&version=v2.0.0&q=milch&fetchsize=5');
await get('https://www.lidl.at/q/api/search?assortment=AT&locale=de_AT&version=2.1.0&q=milch&fetchsize=5');
const l = await get('https://www.lidl.at/c/lebensmittel-getraenke/s10068374', { n: 200 });
if (l.t) console.log('Lidl-Hosts:', hosts(l.t));
// Hofer
const h = await get('https://www.hofer.at/de/', { n: 200 });
if (h.t) console.log('Hofer-Hosts:', hosts(h.t));
for (const u of ['https://api.hofer.at/v3/product-search?q=milch&limit=5', 'https://api.hofer.at/v2/product-search?q=milch&limit=5', 'https://api.hofer.at/v1/product-search?q=milch&limit=5',
  'https://www.hofer.at/de/sortiment.html', 'https://www.hofer.at/de/produkte.html', 'https://api.aldi-sued.de/v3/product-search?q=milch&limit=3&currency=EUR'])
  await get(u, { n: 600 });
const rk = await get('https://shopservice.roksh.at/session/configure', { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify({ OwnWebshopProviderCode: '', SetUserSelectedShopsOnFirstSiteLoad: true, RedirectToDashboardNeeded: false, ShopsSelectedForRoot: 'hofer', BrandProviderSelectedForRoot: null, UserSelectedShops: [] }) });
if (rk.r) {
  const tok = rk.r.headers.get('jwt-auth');
  console.log('Roksh-Token:', tok ? 'ja' : 'nein');
  if (tok) {
    const c = await get('https://shopservice.roksh.at/category/GetFullCategoryList/', { method: 'POST', headers: { authorization: 'Bearer ' + tok, 'content-type': 'application/json' }, body: '{}', n: 300 });
  }
}
// Angebote (Flugblätter) als Ausweichquelle
const mg = await get('https://www.marktguru.at/', { n: 100 });
if (mg.t) { console.log('marktguru-Hosts:', hosts(mg.t)); const k = mg.t.match(/"apiKey"\s*:\s*"([^"]+)"|x-apikey["']?\s*[:=]\s*["']([^"']+)/i); console.log('marktguru-Schlüssel gefunden:', !!k); }
await get('https://heisse-preise.io/data/latest-canonical.json', { method: 'HEAD', n: 0 });
