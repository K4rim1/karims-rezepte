// Karim’s Rezepte – Zuordnung Supermarktprodukte ↔ Zutaten (wird von preise-update.mjs benutzt)
'use strict';

const STORES = ['hofer', 'lidl', 'spar', 'billa', 'penny'];
const DAY = 86400000;
const BIO = /(?<![a-zäöüß])bio(?![a-zäöüß])/;
const NOT_FOOD = /whiskas|sheba|kitekat|pedigree|frolic|vitakraft|hunde|katzen|tiernahrung|futter|gutschein|shampoo|duschgel|kosmetik|deko|autoduft|duftkerze|raumduft|reiniger|spülmittel|waschmittel|seife|lotion|creme für|zahnpasta|kaugummi|romeo|(?<![a-zäöüß])adult(?![a-zäöüß])|(?<![a-zäöüß])senior(?![a-zäöüß])|kitten|welpe/;
// Bei Obst & Gemüse ohne Warengruppe (z. B. Hofer): verarbeitete Produkte aussortieren
const PROCESSED = /geschmack|(?<![a-zäöüß])(mit|ohne|in)(?![a-zäöüß])|suppe|seafood|risotto|antipasti|alternative|medaillon|laibchen|gegrillt|eingelegt|getrocknet|chips|sauce|soße|pfanne|auflauf|gratin|knödel|aufstrich|tortelloni|ravioli|smoothie|saft|getränk|sirup|joghurt|kuchen|snack|kings crown|king's crown|cucina|good choice|primana|wonnemeyer|rettenswert|gerettet|backhendl|fertig|happen|just veg|bbq|efko|käse|staud|iglo|actimel|danone|kids|passiert|(?<![a-zäöüß])&(?![a-zäöüß])/;

// Warengruppen: Billa nutzt ein älteres Code-Schema als Spar/Hofer
const BILLA = {
  '00': 'obst', '01': 'gemuese', '02': 'obst', '03': 'gemuese', '05': 'nuss',
  '10': 'brot', '11': 'brot', '12': 'brot', '13': 'kuchen', '14': 'brot', '15': 'kuchen',
  '20': 'getraenk', '21': 'getraenk', '22': 'kaffee', '23': 'alkohol', '24': 'alkohol', '25': 'wein', '26': 'alkohol', '27': 'alkohol',
  '30': 'eier', '31': 'feinkost', '32': 'kaese', '33': 'getraenk', '34': 'milch', '35': 'dessert', '36': 'kaese', '37': 'teig',
  '40': 'tk_gemuese', '41': 'tk_fisch', '42': 'tk_fertig', '43': 'tk_fertig', '44': 'tk_fertig', '45': 'tk_fertig', '46': 'eis', '47': 'tk_fertig', '48': 'tk_fertig',
  '50': 'cereal', '51': 'honig', '52': 'zucker', '53': 'konserve', '54': 'nudeln', '55': 'sauce', '56': 'sauce', '57': 'mehl', '58': 'backen', '59': 'getreide',
  '5A': 'international', '5B': 'salz', '5C': 'oel_gewuerz', '5D': 'spezial', '5E': 'dessert', '5F': 'drogerie',
  'A': 'wurst', 'B': 'baby', 'C': 'fisch', 'D': 'fertig', 'F': 'fleisch', '7': 'drogerie', '8': 'haushalt', '9': 'tier',
  '100': 'vegan', '101': 'vegan', '102': 'vegan', '103': 'vegan', '104': 'vegan', '105': 'vegan'
};
const STANDARD = {
  '00': 'obst', '01': 'gemuese', '02': 'gemuese', '03': 'nuss',
  '10': 'brot', '11': 'brot', '12': 'brot', '13': 'kuchen', '14': 'brot',
  '20': 'getraenk', '21': 'alkohol', '22': 'kaffee', '23': 'alkohol', '24': 'alkohol', '25': 'wein', '26': 'getraenk',
  '30': 'fertig', '31': 'eier', '32': 'fleisch', '33': 'kaese', '34': 'milch', '35': 'feinkost', '36': 'teig', '37': 'wurst', '38': 'feinkost', '39': 'fisch', '3A': 'feinkost', '3B': 'vegan',
  '40': 'eis', '41': 'tk_fertig', '42': 'tk_fertig', '43': 'tk_fisch', '44': 'tk_gemuese', '45': 'tk_fertig', '46': 'tk_fertig', '47': 'tk_fertig',
  '50': 'international', '51': 'baby', '52': 'backen', '53': 'oel_gewuerz', '54': 'fertig', '55': 'oel_gewuerz', '56': 'honig', '57': 'konserve', '58': 'kuchen', '59': 'mehl',
  '5A': 'cereal', '5B': 'nudeln', '5C': 'sauce', '5D': 'spezial', '5E': 'zucker', '5F': 'fertig',
  '6': 'suess', '7': 'drogerie', '8': 'haushalt', '9': 'tier', 'A0': ''
};
const NEVER = new Set(['drogerie', 'haushalt', 'tier', 'baby', 'alkohol', 'kaffee', 'eis']);
// Nicht-Lebensmittel und Getränke – gilt für Läden, deren Warengruppen weniger verlässlich sind
const BLACK = new Set([...NEVER, 'getraenk', 'suess', 'wein', 'fertig', 'tk_fertig']);
// Nur bei Billa sind die Warengruppen verlässlich genug für eine Positivliste
const TRUST_GROUPS = new Set(['billa']);

function groupOf(store, code) {
  const c = String(code == null ? '' : code).trim();
  if (!c || c === 'null' || c === 'undefined') return '';
  const t = store === 'billa' ? BILLA : STANDARD;
  return t[c] ?? t[c.slice(0, 2)] ?? t[c[0]] ?? '';
}

// Standard-Warengruppen je Katalog-Kategorie (einzelne Zutaten können mit g: [...] abweichen)
const DEFAULT_GROUPS = {
  gemuese: ['obst', 'gemuese'],
  fleisch: ['fleisch', 'wurst', 'fisch'],
  milch: ['milch', 'kaese', 'eier', 'feinkost'],
  brot: ['brot', 'teig'],
  nudeln: ['nudeln', 'getreide', 'mehl', 'cereal', 'international'],
  konserven: ['konserve', 'sauce', 'international', 'oel_gewuerz', 'feinkost'],
  backen: ['backen', 'zucker', 'mehl', 'honig', 'nuss', 'suess', 'getreide', 'oel_gewuerz'],
  gewuerze: ['oel_gewuerz', 'salz', 'sauce', 'konserve', 'backen']
};

const UNIT = {
  g: ['g', 1], gr: ['g', 1], gramm: ['g', 1], kg: ['g', 1000], dag: ['g', 10], mg: ['g', 0.001],
  ml: ['ml', 1], l: ['ml', 1000], liter: ['ml', 1000], cl: ['ml', 10], dl: ['ml', 100], '100ml': ['ml', 100], '500ml': ['ml', 500],
  stk: ['stk', 1], 'stk.': ['stk', 1], stück: ['stk', 1], st: ['stk', 1], pkg: ['stk', 1], pck: ['stk', 1], packung: ['stk', 1], bund: ['stk', 1]
};

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

function lastDate(it) {
  if (it.lastDate) return String(it.lastDate);
  const h = Array.isArray(it.priceHistory) && it.priceHistory[0];
  return (h && h.date) || '';
}
function median(a) { const s = [...a].sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : 0; }
function round2(v) { return Math.round(v * 100) / 100; }
function rx(s) { return s ? new RegExp(s) : null; }

/**
 * all:     Rohdaten (Array im Format von heisse-preise.io)
 * catalog: Zutaten-Katalog (Regex als Text)
 * today:   'YYYY-MM-DD'
 */
function build(all, catalog, today) {
  const cat = catalog.map((it) => ({ ...it, P: rx(it.p), X: rx(it.x) }));

  // 1. Pro Laden prüfen, ob die Daten aktuell sind
  const info = {};
  for (const it of all) {
    const s = String(it.store || '').toLowerCase();
    if (!STORES.includes(s)) continue;
    const i = info[s] = info[s] || { max: '', avail: 0, total: 0 };
    i.total++;
    const d = lastDate(it);
    if (d > i.max) i.max = d;
    if (it.unavailable !== true) i.avail++;
  }
  const asOf = {}, cutoff = {};
  for (const [s, i] of Object.entries(info)) {
    if (i.avail > 200) { asOf[s] = today; cutoff[s] = null; }
    else { asOf[s] = i.max; cutoff[s] = new Date(new Date(i.max).getTime() - 365 * DAY).toISOString().slice(0, 10); }
  }

  // 2. Produkte aufbereiten
  const products = [];
  for (const it of all) {
    const store = String(it.store || '').toLowerCase();
    if (!info[store]) continue;
    if (cutoff[store] === null ? it.unavailable === true : lastDate(it) < cutoff[store]) continue;
    const price = Number(it.price);
    if (!(price > 0) || !it.name) continue;
    const name = String(it.name).replace(/\s+/g, ' ').trim();
    const lname = name.toLowerCase();
    if (NOT_FOOD.test(lname)) continue;
    const group = groupOf(store, it.category);
    const size = sizeOf(it, lname);
    if (!size || !(size.qty > 0)) continue;
    products.push({ store, name, lname, price, unit: size.unit, qty: size.qty, group, bio: !!it.bio || BIO.test(lname) });
  }

  const present = STORES.filter((s) => products.some((p) => p.store === s));
  const out = { updated: today, source: 'heisse-preise.io', stores: present, asOf: {}, items: {} };
  present.forEach((s) => { out.asOf[s] = asOf[s]; });
  const report = [];
  const none = [];

  for (const it of cat) {
    const groups = it.g || DEFAULT_GROUPS[it.k] || null;
    let cands = [];
    for (const p of products) {
      if (!it.P.test(p.lname)) continue;
      if (it.X && it.X.test(p.lname)) continue;
      if (p.group) {
        if (TRUST_GROUPS.has(p.store)) {
          if (groups && !groups.includes(p.group)) continue;
          if (!groups && NEVER.has(p.group)) continue;
        } else if (BLACK.has(p.group) && !(groups && groups.includes(p.group))) continue;
      }
      if (it.k === 'gemuese' && !TRUST_GROUPS.has(p.store) && PROCESSED.test(p.lname)) continue;
      if (p.unit === 'ml' && it.u === 'g' && (it.k === 'gemuese' || (it.k === 'gewuerze' && it.v))) continue;
      let qty = p.qty;
      if (p.unit !== it.u) {
        if (it.cv && it.cv[p.unit]) qty = qty * it.cv[p.unit];
        else if (p.unit === 'stk' && it.pc) qty = qty * it.pc;
        else if (!((p.unit === 'g' && it.u === 'ml') || (p.unit === 'ml' && it.u === 'g'))) continue;
      }
      if (it.r && (qty < it.r[0] || qty > it.r[1])) continue;
      cands.push({ store: p.store, name: p.name, price: p.price, qty, up: p.price / qty, bio: p.bio });
    }
    // Ausreißer (meist falsch erkannte Packungsgrößen) entfernen
    const med = median(cands.map((c) => c.up));
    cands = cands.filter((c) => c.up >= med * 0.25 && c.up <= med * 6);
    const offers = [];
    report.push('■ ' + it.n + ' (' + it.id + ')');
    for (const s of present) {
      let mine = cands.filter((c) => c.store === s);
      // Bio nur, wenn es in diesem Laden nichts anderes gibt (außer die Zutat erlaubt Bio ausdrücklich)
      if (!it.bo && mine.some((c) => !c.bio)) mine = mine.filter((c) => !c.bio);
      const byUnit = [...mine].sort((a, b) => a.up - b.up).slice(0, 3);
      const cheapest = [...mine].sort((a, b) => a.price - b.price)[0];
      const pick = cheapest && !byUnit.includes(cheapest) ? byUnit.concat(cheapest) : byUnit;
      pick.forEach((c) => offers.push([s, c.name, round2(c.price), Math.round(c.qty * 10) / 10]));
      report.push('   ' + s.padEnd(6) + (pick.length ? pick.map((c) => c.name + ' · ' + c.price.toFixed(2) + ' € / ' + Math.round(c.qty) + ' ' + it.u).join('  |  ') : '–'));
    }
    if (offers.length) out.items[it.id] = offers; else none.push(it.n);
  }
  const head = [
    'Karim’s Rezepte – Preis-Zuordnung vom ' + today,
    'Quelle: heisse-preise.io',
    'Stand je Laden: ' + present.map((s) => s + ' ' + asOf[s] + (asOf[s] === today ? ' (aktuell)' : ' (ältere Daten)')).join(', '),
    ''
  ];
  report.push('', 'Ohne Treffer: ' + (none.join(', ') || '–'));
  return { out, report: head.concat(report).join('\n'), stats: { products: products.length, matched: Object.keys(out.items).length, none } };
}

module.exports = { build, groupOf, STORES };
