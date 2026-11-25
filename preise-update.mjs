// Karim’s Rezepte – tägliches Preis-Update (läuft in GitHub Actions, siehe .github/workflows/kochbuch.yml)
// Holt die aktuellen Supermarktpreise von heisse-preise.io (Open-Source-Projekt von Mario Zechner),
// sucht für jede Zutat die günstigsten passenden Produkte je Laden (Logik in preise-core.cjs)
// und schreibt preise.json (für die App) und preise-check.txt (zum Nachprüfen).
import { readFile, writeFile } from 'node:fs/promises';
import core from './preise-core.cjs';

const SOURCE = process.env.PREIS_QUELLE || 'https://heisse-preise.io/data/latest-canonical.json';
const SITE = (process.env.SITE_URL || '').replace(/\/?$/, '/');
const here = (f) => new URL(f, import.meta.url);

async function keepOld(reason) {
  console.log('⚠️  ' + reason);
  if (!SITE || SITE === '/') return console.log('Keine alten Preise verfügbar – App läuft ohne Preise weiter.');
  try {
    for (const f of ['preise.json', 'preise-check.txt']) {
      const res = await fetch(SITE + f);
      if (!res.ok) throw new Error(f + ': HTTP ' + res.status);
      await writeFile(here('./' + f), await res.text());
    }
    console.log('Alte Preise von ' + SITE + ' übernommen.');
  } catch (e) {
    console.log('Alte Preise nicht abrufbar (' + e.message + ').');
  }
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
  const all = Array.isArray(data) ? data : (data.items || data.data || []);
  const today = new Date().toISOString().slice(0, 10);
  const r = core.build(all, catalog, today);
  console.log(all.length + ' Produkte geladen, ' + r.stats.products + ' verwendbar.');
  console.log('Stand je Laden: ' + JSON.stringify(r.out.asOf));
  if (r.stats.products < 1000) return keepOld('Zu wenige Produkte – Datenformat geändert?');
  await writeFile(here('./preise.json'), JSON.stringify(r.out));
  await writeFile(here('./preise-check.txt'), r.report);
  console.log(r.stats.matched + ' von ' + catalog.length + ' Zutaten mit Preisen. Ohne Treffer: ' + (r.stats.none.join(', ') || '–'));
}

main().catch((e) => keepOld('Fehler: ' + (e && e.stack || e)));
