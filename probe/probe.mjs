const UA = { 'user-agent': 'Mozilla/5.0 (compatible; karims-rezepte-preise/1.0)', 'accept-language': 'de-AT,de;q=0.9', origin: 'https://www.hofer.at', referer: 'https://www.hofer.at/' };
const B = 'https://asl.api.hofer.at/commerce/v3/product-search?currency=EUR&limit=60&offset=0&q=';
const seen = new Set();
const all = await (async () => { const out = []; let total = 1; for (let o = 0; o < total; o += 60) { const j = await (await fetch(B.replace('offset=0', 'offset=' + o), { headers: UA })).json(); total = j.meta.pagination.totalCount; (j.data || []).forEach(d => out.push(d.sku)); } return out; })();
all.forEach(s => seen.add(s));
console.log('Leere Suche:', all.length);
for (const q of ['zwiebel', 'spaghetti', 'mehl', 'olivenöl', 'paradeiser', 'karotten', 'reis', 'zucker', 'knoblauch', 'kartoffeln', 'banane', 'passata', 'hüttenkäse', 'mayonnaise', 'limette']) {
  const j = await (await fetch(B + encodeURIComponent(q), { headers: UA })).json();
  const d = j.data || [];
  const neu = d.filter(x => !seen.has(x.sku)).length;
  console.log(q.padEnd(12), 'Treffer', String(j.meta.pagination.totalCount).padStart(4), '| neu ggü. leerer Suche:', neu, '|', d.slice(0, 4).map(x => x.name + ' ' + (x.sellingSize || '') + ' ' + (x.price && x.price.amountRelevantDisplay)).join(' ; '));
}
const fac = await (await fetch(B, { headers: UA })).json();
const ct = (fac.meta.facets || []).find(f => /categor/i.test(f.name));
console.log('Kategorie-Facette:', JSON.stringify(ct && (ct.values || ct.config)).slice(0, 1500));
