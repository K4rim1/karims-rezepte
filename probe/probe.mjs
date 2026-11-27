const UA = { 'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1', 'accept-language': 'de-AT,de;q=0.9' };
const get = async (u, h = {}) => { try { const r = await fetch(u, { headers: { ...UA, ...h } }); return { s: r.status, t: await r.text(), url: r.url }; } catch (e) { return { s: 'ERR ' + e.message, t: '' }; } };
const show = (label, x) => console.log('\n### ' + label + '\n' + x);
// ---- Lidl Suche
for (const q of ['milch', 'butter', 'spaghetti', 'hendl', 'paradeiser', 'mehl']) {
  const { s, t } = await get(`https://www.lidl.at/q/api/search?assortment=AT&locale=de_AT&version=v2.0.0&q=${q}&fetchsize=50`);
  let j = {}; try { j = JSON.parse(t); } catch {}
  const items = (j.items || []).map(i => { const g = i.gridbox && i.gridbox.data || {}; return (g.fullTitle || g.title || i.label || '?') + ' | ' + (g.price && g.price.price) + ' | ' + (g.price && g.price.basePrice && g.price.basePrice.text) + ' | ' + (g.category || ''); });
  show('Lidl q=' + q + ' → ' + s + ' numFound ' + j.numFound, items.slice(0, 8).join('\n'));
}
{ const { t } = await get(`https://www.lidl.at/q/api/search?assortment=AT&locale=de_AT&version=v2.0.0&q=milch&fetchsize=5`); let j = {}; try { j = JSON.parse(t); } catch {}; show('Lidl Item-Struktur', JSON.stringify(j.items && j.items[0]).slice(0, 1500)); show('Lidl Facetten', JSON.stringify(j.facets || j.filters || Object.keys(j)).slice(0, 800)); }
// ---- Hofer
const h = await get('https://www.hofer.at/produkte');
const scripts = [...h.t.matchAll(/<script[^>]+src="([^"]+)"/g)].map(m => m[1]);
show('Hofer Skripte', scripts.slice(0, 20).join('\n'));
show('Hofer api-Stellen', [...new Set([...h.t.matchAll(/[a-z0-9.\/:-]*api[a-z0-9.\/:_-]{3,60}/gi)].map(m => m[0]))].slice(0, 40).join('\n'));
show('Hofer Datenblöcke', [...h.t.matchAll(/(window\.__[A-Z_]+__|__NUXT__|__NEXT_DATA__|application\/ld\+json|data-product[a-z-]*)/g)].map(m => m[0]).slice(0, 20).join(', '));
const links = [...new Set([...h.t.matchAll(/href="(\/produkte\/[^"#?]+)"/g)].map(m => m[1]))];
show('Hofer Kategorie-Links (' + links.length + ')', links.slice(0, 40).join('\n'));
const i1 = h.t.search(/€|EUR|price/i); show('Hofer Preis-Stelle', h.t.slice(Math.max(0, i1 - 400), i1 + 400).replace(/\s+/g, ' '));
if (links.length) {
  const c = await get('https://www.hofer.at' + links.find(l => /milch|molkerei|kaese|joghurt|brot|obst|gemuese|fleisch/i.test(l)) || links[0]);
  show('Hofer Kategorie ' + c.url + ' → ' + c.s + ' ' + c.t.length, '');
  const i2 = c.t.search(/€/); show('Kategorie Preis-Stelle', c.t.slice(Math.max(0, i2 - 600), i2 + 300).replace(/\s+/g, ' '));
  show('Kategorie Produkt-Links', [...new Set([...c.t.matchAll(/href="(\/produkte\/[^"#?]+\.html)"/g)].map(m => m[1]))].slice(0, 10).join('\n'));
  show('Kategorie api-Stellen', [...new Set([...c.t.matchAll(/https?:\/\/[a-z0-9.-]*(?:api|aldi|hofer)[a-z0-9.\/_-]{0,60}/gi)].map(m => m[0]))].slice(0, 30).join('\n'));
}
// Aldi-Süd-API mit erlaubter Seitengröße und Varianten
for (const u of ['https://api.aldi-sued.de/v3/product-search?q=milch&limit=12&currency=EUR', 'https://api.aldi-sued.de/v3/product-search?q=milch&limit=12&currency=EUR&serviceType=walk-in&locale=de-AT', 'https://api.hofer.at/v3/product-search?q=milch&limit=12&currency=EUR', 'https://api.aldi.at/v3/product-search?q=milch&limit=12']) {
  const r = await get(u); show(u + ' → ' + r.s, r.t.slice(0, 700).replace(/\s+/g, ' '));
}
