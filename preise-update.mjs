// Karim’s Rezepte – tägliches Preis-Update (läuft in GitHub Actions, siehe .github/workflows/kochbuch.yml)
// Holt die aktuellen Supermarktpreise von heisse-preise.io (Open-Source-Projekt von Mario Zechner)
// und – weil Hofer dort veraltet ist – das Hofer-Sortiment direkt von hofer.at,
// sucht für jede Zutat die günstigsten passenden Produkte je Laden (Logik in preise-core.cjs)
// und schreibt preise.json (für die App), produkte.json (Suche für unbekannte Zutaten)
// und preise-check.txt (zum Nachprüfen).
import { readFile, writeFile } from 'node:fs/promises';
import core from './preise-core.cjs';

const SOURCE = process.env.PREIS_QUELLE || 'https://heisse-preise.io/data/latest-canonical.json';
const SITE = (process.env.SITE_URL || '').replace(/\/?$/, '/');
const here = (f) => new URL(f, import.meta.url);

async function keepOld(reason) {
  console.log('⚠️  ' + reason);
  if (!SITE || SITE === '/') return console.log('Keine alten Preise verfügbar – App läuft ohne Preise weiter.');
  try {
    for (const f of ['preise.json', 'preise-check.txt', 'produkte.json']) {
      const res = await fetch(SITE + f);
      if (!res.ok) throw new Error(f + ': HTTP ' + res.status);
      await writeFile(here('./' + f), await res.text());
    }
    console.log('Alte Preise von ' + SITE + ' übernommen.');
  } catch (e) {
    console.log('Alte Preise nicht abrufbar (' + e.message + ').');
  }
}

const UA = {
  'user-agent': 'Mozilla/5.0 (compatible; karims-rezepte-preise/1.0; privat, 1x täglich)',
  'accept-language': 'de-AT,de;q=0.9', origin: 'https://www.hofer.at', referer: 'https://www.hofer.at/'
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
// Hofer: öffentliche Produktsuche der Website (gleiche Schnittstelle, die hofer.at/produkte nutzt)
async function fetchHofer(today) {
  const base = 'https://asl.api.hofer.at/commerce/v3/product-search?currency=EUR&q=&limit=60&offset=';
  const out = [];
  let total = 1;
  for (let off = 0; off < total && off < 12000; off += 60) {
    const res = await fetch(base + off, { headers: UA });
    if (!res.ok) throw new Error('HTTP ' + res.status + ' bei Offset ' + off);
    const j = await res.json();
    total = (j.meta && j.meta.pagination && j.meta.pagination.totalCount) || 0;
    for (const d of j.data || []) { const it = core.hoferItem(d, today); if (it) out.push(it); }
    await sleep(250);
  }
  return out;
}

function loadCatalog(html) {
  const m = html.match(/<script type="application\/json" id="katalog">([\s\S]*?)<\/script>/);
  if (!m) throw new Error('Katalog in index.html nicht gefunden');
  return JSON.parse(m[1]);
}

async function main() {
  const catalog = loadCatalog(await readFile(here('./index.html'), 'utf8'));
  console.log('Lade ' + SOURCE + ' …');
  let data;
  try {
    const res = await fetch(SOURCE, { headers: { 'user-agent': 'karims-rezepte-preise (privat, 1x täglich)' } });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    data = await res.json();
  } catch (e) {
    return keepOld('Preisdaten konnten nicht geladen werden: ' + e.message);
  }
  let all = Array.isArray(data) ? data : (data.items || data.data || []);
  const today = new Date().toISOString().slice(0, 10);
  let sources = 'heisse-preise.io';
  try {
    const hofer = await fetchHofer(today);
    console.log('Hofer (hofer.at): ' + hofer.length + ' Produkte mit Preis.');
    if (hofer.length >= 300) {
      all = all.filter((it) => String(it.store || '').toLowerCase() !== 'hofer').concat(hofer);
      sources = 'heisse-preise.io, hofer.at';
    }
  } catch (e) {
    console.log('⚠️  Hofer nicht abrufbar (' + e.message + ') – nehme die Daten von heisse-preise.io.');
  }
  const r = core.build(all, catalog, today, sources);
  console.log(all.length + ' Produkte geladen, ' + r.stats.products + ' verwendbar.');
  console.log('Stand je Laden: ' + JSON.stringify(r.out.asOf));
  if (r.stats.products < 1000) return keepOld('Zu wenige Produkte – Datenformat geändert?');
  await writeFile(here('./preise.json'), JSON.stringify(r.out));
  await writeFile(here('./preise-check.txt'), r.report);
  await writeFile(here('./produkte.json'), JSON.stringify(r.idx));
  console.log('Produktindex: ' + r.stats.index + ' Produkte, ' + Math.round(JSON.stringify(r.idx).length / 1024) + ' KB.');
  console.log(r.stats.matched + ' von ' + catalog.length + ' Zutaten mit Preisen. Ohne Treffer: ' + (r.stats.none.join(', ') || '–'));
}

main().catch((e) => keepOld('Fehler: ' + (e && e.stack || e)));
