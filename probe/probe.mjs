const UA = { 'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1', 'accept-language': 'de-AT,de;q=0.9' };
const get = async (u, h = {}) => { try { const r = await fetch(u, { headers: { ...UA, ...h } }); return { s: r.status, t: await r.text() }; } catch (e) { return { s: 'ERR ' + e.message, t: '' }; } };
const show = (l, x) => console.log('\n### ' + l + '\n' + x);
const cat = await get('https://www.hofer.at/produkte/milchprodukte/k/158816141856710103');
const files = [...new Set([...cat.t.matchAll(/(?:src|href)="(\/_nuxt\/[^"]+\.js)"/g)].map(m => m[1]))];
const hits = new Set(), ctx = [];
for (const f of files) {
  const r = await get('https://www.hofer.at' + f);
  for (const m of r.t.matchAll(/[A-Za-z0-9_\-\/.${}`'"]{0,40}(?:product-search|productSearch|\/products?\b|search\?|v[1-9]\/[a-z-]+)[A-Za-z0-9_\-\/.${}`'"?=&]{0,60}/g)) hits.add(m[0]);
  const k = r.t.indexOf('API_AZURE_BASE_URL'); if (k > -1) ctx.push(f + ': ' + r.t.slice(Math.max(0, k - 300), k + 500));
}
show('Treffer (' + files.length + ' Dateien)', [...hits].slice(0, 80).join('\n'));
show('Kontext', ctx.join('\n---\n').slice(0, 3000));
// Seite: Grundpreis-Beispiele
const cmp = [...cat.t.matchAll(/product-tile__name"[^>]*><p aria-label="([^"]+),"[\s\S]{0,400}?unit-of-measurement"><p>([^<]*)<\/p>[\s\S]{0,200}?comparison-price">([\s\S]{0,120}?)<\/div>[\s\S]{0,300}?base-price__regular"><span>([^<]+)</g)].slice(0, 15).map(m => [m[1], m[2], m[3].replace(/<[^>]+>/g, '').trim(), m[4]].join(' | '));
show('Beispiele Name|Einheit|Grundpreis|Preis', cmp.join('\n'));
