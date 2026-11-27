const UA = { 'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1', 'accept-language': 'de-AT,de;q=0.9', origin: 'https://www.hofer.at', referer: 'https://www.hofer.at/' };
const get = async (u) => { try { const r = await fetch(u, { headers: UA }); return { s: r.status, t: await r.text() }; } catch (e) { return { s: 'ERR ' + e.message, t: '' }; } };
const show = (l, x) => console.log('\n### ' + l + '\n' + x);
const home = await get('https://www.hofer.at/produkte');
const sid = (home.t.match(/WEB_STORE_CONFIGURATION_ID:"([^"]+)"/) || [])[1];
show('Store-ID', sid);
const B = 'https://asl.api.hofer.at/commerce';
for (const p of [`/product-search?q=milch&limit=12&offset=0&currency=EUR`, `/v3/product-search?q=milch&limit=12&offset=0&currency=EUR`, `/product-search?q=milch&limit=12&offset=0&currency=EUR&storeId=${sid}`, `/v3/product-search?q=milch&limit=12&offset=0&currency=EUR&serviceType=walk-in`]) {
  const r = await get(B + p); show(p + ' → ' + r.s, r.t.slice(0, 250).replace(/\s+/g, ' '));
  if (r.s === 200) {
    const j = JSON.parse(r.t);
    show('Pagination', JSON.stringify(j.meta && j.meta.pagination));
    show('Produkt 1', JSON.stringify(j.data && j.data[0]).slice(0, 2500));
    show('Liste', (j.data || []).map(d => [d.name, d.brandName, d.sellingSize, d.price && (d.price.amountRelevantDisplay || d.price.amount), d.price && d.price.comparisonDisplay, (d.categories || []).map(c => c.name).join('/')].join(' | ')).join('\n'));
    const all = await get(B + p.replace('q=milch', 'q=').replace('limit=12', 'limit=60'));
    show('Ohne Suchbegriff → ' + all.s, all.t.slice(0, 300).replace(/\s+/g, ' '));
    try { const ja = JSON.parse(all.t); show('Gesamt', JSON.stringify(ja.meta.pagination)); } catch {}
    break;
  }
}
const tree = await get(B + '/product-category-tree?currency=EUR'); show('Kategorie-Baum → ' + tree.s, tree.t.slice(0, 600).replace(/\s+/g, ' '));
