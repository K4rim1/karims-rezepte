// Karim’s Rezepte – tägliches Preis-Update (läuft in GitHub Actions, siehe .github/workflows/kochbuch.yml)
// Holt die aktuellen Supermarktpreise von heisse-preise.io (Open-Source-Projekt von Mario Zechner),
// sucht für jede Zutat im Katalog die günstigsten passenden Produkte je Laden
// und schreibt das Ergebnis nach preise.json (für die App) und preise-check.txt (zum Nachprüfen).
import { readFile, writeFile } from 'node:fs/promises';

const SOURCE = process.env.PREIS_QUELLE || 'https://heisse-preise.io/data/latest-canonical.json';
const SITE = (process.env.SITE_URL || '').replace(/\/?$/, '/');
const STORES = ['hofer', 'lidl', 'spar', 'billa', 'penny'];
const PER_STORE = 3;
const BIO = /(?<![a-zäöüß])bio(?![a-zäöüß])/;
const NOT_FOOD = /hunde|katzen|tiernahrung|futter|babynahrung|\bbaby\b|gutschein|shampoo|duschgel|kosmetik|deko/;

const here = (f) => new URL(f, import.meta.url);

async function keepOld(reason) {
  console.log('⚠️  ' + reason);
  if (!SITE || SITE === '/') return console.log('Keine alten Preise verfügbar – App läuft ohne Preise weiter.');
  try {
    const res = await fetch(SITE + 'preise.json');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const old = await res.text();
    JSON.parse(old);
    await writeFile(here('./preise.json'), old);
    console.log('Alte Preise von ' + SITE + ' übernommen.');
  } catch (e) {
    console.log('Alte Preise nicht abrufbar (' + e.message + ').');
  }
}

function loadCatalog(html) {
  const m = html.match(/<script type="application\/json" id="katalog">([\s\S]*?)<\/script>/);
  if (!m) throw new Error('Katalog in index.html nicht gefunden');
  return JSON.parse(m[1]).map((it) => ({ ...it, P: new RegExp(it.p), X: it.x ? new RegExp(it.x) : null }));
}

const UNIT = {
  g: ['g', 1], gr: ['g', 1], gramm: ['g', 1], kg: ['g', 1000], dag: ['g', 10], mg: ['g', 0.001],
  ml: ['ml', 1], l: ['ml', 1000], liter: ['ml', 1000], cl: ['ml', 10], dl: ['ml', 100],
  stk: ['stk', 1], 'stk.': ['stk', 1], stück: ['stk', 1], st: ['stk', 1], pkg: ['stk', 1], pck: ['stk', 1],
  packung: ['stk', 1], bund: ['stk', 1], beutel: ['stk', 1], wg: null, cm: null, m: null
};

// Packungsgröße bestimmen: zuerst die Angaben aus den Daten, sonst aus dem Produktnamen lesen
function sizeOf(item, lname) {
  const u = String(item.unit ?? '').trim().toLowerCase();
  const q = Number(item.quantity);
  if (UNIT[u] && q > 0) return { unit: UNIT[u][0], qty: q * UNIT[u][1] };
  let m = lname.match(/(\d+)\s*[x×]\s*(\d+(?:[.,]\d+)?)\s*(kg|dag|g|ml|cl|dl|l)(?![a-zäöüß])/);
  if (m) { const t = UNIT[m[3]]; return { unit: t[0], qty: +m[1] * parseFloat(m[2].replace(',', '.')) * t[1] }; }
  m = lname.match(/(\d+(?:[.,]\d+)?)\s*(kg|dag|g|ml|cl|dl|l|stk|stück)(?![a-zäöüß])/);
  if (m) { const t = UNIT[m[2]]; return { unit: t[0], qty: parseFloat(m[1].replace(',', '.')) * t[1] }; }
  return null;
}

function median(a) { const s = [...a].sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : 0; }
function round2(v) { return Math.round(v * 100) / 100; }

async function main() {
  const html = await readFile(here('./index.html'), 'utf8');
  const catalog = loadCatalog(html);

  console.log('Lade ' + SOURCE + ' …');
  let data;
  try {
    const res = await fetch(SOURCE, { headers: { 'user-agent': 'karims-rezepte-preise (privat, 1x täglich)' } });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    data = await res.json();
  } catch (e) {
    return keepOld('Preisdaten konnten nicht geladen werden: ' + e.message);
  }
  const all = Array.isArray(data) ? data : (data.items || data.data || []);
  const products = [];
  for (const it of all) {
    const store = String(it.store || '').toLowerCase();
    if (!STORES.includes(store)) continue;
    const price = Number(it.price);
    if (!(price > 0) || !it.name) continue;
    const lname = String(it.name).toLowerCase();
    if (NOT_FOOD.test(lname)) continue;
    const size = sizeOf(it, lname);
    if (!size || !(size.qty > 0)) continue;
    products.push({ store, name: String(it.name).trim(), lname, price, unit: size.unit, qty: size.qty, bio: !!it.bio || BIO.test(lname) });
  }
  console.log(all.length + ' Produkte geladen, ' + products.length + ' davon aus ' + STORES.join(', ') + ' verwendbar.');
  if (products.length < 1000) return keepOld('Zu wenige Produkte – Datenformat geändert?');

  const present = STORES.filter((s) => products.some((p) => p.store === s));
  const out = { updated: new Date().toISOString().slice(0, 10), source: 'heisse-preise.io', stores: present, items: {} };
  const report = ['Karim’s Rezepte – Preis-Zuordnung vom ' + out.updated, 'Quelle: heisse-preise.io · Läden: ' + present.join(', '), ''];
  const none = [];

  for (const it of catalog) {
    let cands = [];
    for (const p of products) {
      if (!it.P.test(p.lname)) continue;
      if (it.X && it.X.test(p.lname)) continue;
      if (p.bio && !it.bo) continue;
      let qty = p.qty, unit = p.unit;
      if (unit !== it.u) {
        if (it.cv && it.cv[unit]) qty = qty * it.cv[unit];
        else if (unit === 'stk' && it.pc) qty = qty * it.pc;
        else if (!((unit === 'g' && it.u === 'ml') || (unit === 'ml' && it.u === 'g'))) continue;
      }
      if (it.r && (qty < it.r[0] || qty > it.r[1])) continue;
      cands.push({ store: p.store, name: p.name, price: p.price, qty, up: p.price / qty });
    }
    // Ausreißer (meist falsch erkannte Packungsgrößen) entfernen
    const med = median(cands.map((c) => c.up));
    cands = cands.filter((c) => c.up >= med * 0.3 && c.up <= med * 8);
    const offers = [];
    report.push('■ ' + it.n + ' (' + it.id + ')');
    for (const s of present) {
      const best = cands.filter((c) => c.store === s).sort((a, b) => a.up - b.up).slice(0, PER_STORE);
      best.forEach((c) => offers.push([s, c.name, round2(c.price), Math.round(c.qty * 10) / 10]));
      report.push('   ' + s.padEnd(6) + (best.length ? best.map((c) => c.name + ' · ' + c.price.toFixed(2) + ' € / ' + Math.round(c.qty) + ' ' + it.u).join('  |  ') : '–'));
    }
    if (offers.length) out.items[it.id] = offers; else none.push(it.n);
  }
  report.push('', 'Ohne Treffer: ' + (none.join(', ') || '–'));
  await writeFile(here('./preise.json'), JSON.stringify(out));
  await writeFile(here('./preise-check.txt'), report.join('\n'));
  console.log(Object.keys(out.items).length + ' von ' + catalog.length + ' Zutaten mit Preisen. Ohne Treffer: ' + (none.join(', ') || '–'));
}

main().catch((e) => keepOld('Fehler: ' + (e && e.stack || e)));
