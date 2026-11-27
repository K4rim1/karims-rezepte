const UA = { 'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1', 'accept-language': 'de-AT,de;q=0.9', origin: 'https://www.hofer.at', referer: 'https://www.hofer.at/' };
const get = async (u) => { try { const r = await fetch(u, { headers: UA }); return { s: r.status, t: await r.text() }; } catch (e) { return { s: 'ERR ' + e.message, t: '' }; } };
const show = (l, x) => console.log('\n### ' + l + '\n' + x);
const base = 'https://asl.api.hofer.at';
for (const p of ['/v3/product-search?currency=EUR&q=milch&limit=12&offset=0', '/v2/product-search?currency=EUR&q=milch&limit=12', '/v1/product-search?currency=EUR&q=milch&limit=12']) {
  const r = await get(base + p); show(p + ' → ' + r.s, r.t.slice(0, 300).replace(/\s+/g, ' '));
  if (r.s === 200) {
    const j = JSON.parse(r.t);
    show('Treffer gesamt', JSON.stringify(j.meta && j.meta.pagination));
    show('Erstes Produkt', JSON.stringify(j.data && j.data[0]).slice(0, 2500));
    show('Namen+Preise', (j.data || []).map(d => [d.name, d.brandName, d.sellingSize, JSON.stringify(d.price)].join(' | ')).join('\n').slice(0, 2500));
    break;
  }
}
// Kategorie abfragen
for (const p of ['/v3/product-search?currency=EUR&q=&limit=60&offset=0&categoryKey=158816141856710103', '/v3/product-search?currency=EUR&limit=60&offset=0&categoryKey=158816141856710103', '/v3/product-search?currency=EUR&limit=60&offset=0&categoryTree=158816141856710103']) {
  const r = await get(base + p); let j = {}; try { j = JSON.parse(r.t); } catch {}
  show(p + ' → ' + r.s + ' total ' + JSON.stringify(j.meta && j.meta.pagination), (j.data || []).slice(0, 5).map(d => d.name + ' | ' + JSON.stringify(d.price)).join('\n') || r.t.slice(0, 300));
}
// Gesamtzahl ohne Suchbegriff
{ const r = await get(base + '/v3/product-search?currency=EUR&limit=60&offset=0'); let j = {}; try { j = JSON.parse(r.t); } catch {}; show('Alles → ' + r.s, JSON.stringify(j.meta && j.meta.pagination) + ' ' + r.t.slice(0, 200)); 
  const f = (j.meta && j.meta.facets || []).find(x => x.name === 'category-tree'); show('Kategorien', JSON.stringify(f && f.values && f.values.map(v => [v.key, v.label || v.name, v.docCount])).slice(0, 1500)); }
