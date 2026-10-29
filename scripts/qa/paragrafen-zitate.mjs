#!/usr/bin/env node
/**
 * Paragrafen-Inventar: zieht alle Zitate von Paragrafen, Artikeln und Anlagen zu Gesetzen und
 * Verordnungen aus content/ und src/ (inkl. src/data/quiz.json) und gruppiert sie je Zitat mit
 * Fundstellen (Datei:Zeile). Grundlage der Prüfung docs/pruefung/paragrafen-2026-10-29.md.
 *
 *   node scripts/qa/paragrafen-zitate.mjs [--json datei.json] [--md datei.md] [--alle]
 *
 * Erkannt wird ein Zitatkern (§, §§, Art., Artikel, Anlage, Anhang + Nummer, mit Abs./Satz/Nr./lit.)
 * und das zugehörige Gesetz in den folgenden ~60 Zeichen (bzw. davor: „GEG § 48“). Zitate ohne
 * erkennbares Gesetz erscheinen nur mit --alle (Anlage/Anhang ohne Gesetz sind meist Normanhänge).
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const ORDNER = ['content', 'src'];
const ENDUNG = /\.(json|ts|tsx|md|mdx)$/;

// Kanonischer Name ← Muster (Reihenfolge: spezifische zuerst)
const GESETZE = [
  ['KrWG', /\bKrWG\b|Kreislaufwirtschaftsgesetz/],
  ['GewAbfV', /\bGewAbfV\b|Gewerbeabfallverordnung/],
  ['ErsatzbaustoffV', /\bErsatzbaustoffV\b|\bEBV\b|Ersatzbaustoffverordnung/],
  ['BBodSchV', /\bBBodSchV\b|Bundes-Bodenschutz- und Altlastenverordnung/],
  ['BBodSchG', /\bBBodSchG\b|Bundes-Bodenschutzgesetz/],
  ['DepV', /\bDepV\b|Deponieverordnung/],
  ['AVV', /\bAVV\b|Abfallverzeichnis-Verordnung/],
  ['GefStoffV', /\bGefStoffV\b|Gefahrstoffverordnung/],
  ['ChemVerbotsV', /\bChemVerbotsV\b|Chemikalien-Verbotsverordnung/],
  ['GModG', /\bGModG\b|Gebäudemodernisierungsgesetz/],
  ['GEG', /\bGEG\b|Gebäudeenergiegesetz/],
  ['BauPVO 2024/3110', /BauPVO|Bauproduktenverordnung|2024\/3110|\bCPR\b/],
  ['ESPR 2024/1781', /\bESPR\b|Ökodesign-Verordnung|2024\/1781/],
  ['KI-VO (AI Act) 2024/1689', /\bAI Act\b|\bKI-VO\b|KI-Verordnung|2024\/1689/],
  ['DSGVO', /\bDSGVO\b|\bDS-GVO\b|Datenschutz-Grundverordnung/],
  ['UrhG', /\bUrhG\b|Urheberrechtsgesetz/],
  ['VOB/A', /VOB\/A\b/],
  ['VOB/B', /VOB\/B\b/],
  ['HOAI', /\bHOAI\b/],
  ['BGB', /\bBGB\b/],
  ['BayBO', /\bBayBO\b|Bayerische[n]? Bauordnung/],
  ['MBO', /\bMBO\b|Musterbauordnung/],
  ['ArbSchG', /\bArbSchG\b|Arbeitsschutzgesetz/],
  ['BetrSichV', /\bBetrSichV\b|Betriebssicherheitsverordnung/],
  ['ArbStättV', /\bArbStättV\b/],
  ['BaustellV', /\bBaustellV\b/],
  ['BImSchG', /\bBImSchG\b/],
  ['BImSchV', /\bBImSchV\b/],
  ['WHG', /\bWHG\b|Wasserhaushaltsgesetz/],
  ['BauGB', /\bBauGB\b/],
  ['BauNVO', /\bBauNVO\b/],
  ['GWB', /\bGWB\b/],
  ['VgV', /\bVgV\b/],
  ['UVgO', /\bUVgO\b/],
  ['EPBD 2024/1275', /\bEPBD\b|2024\/1275/],
  ['REACH', /\bREACH\b|1907\/2006/],
  ['CLP', /\bCLP\b|1272\/2008/],
  ['POP-VO', /POP-V|2019\/1021/],
  ['Taxonomie-VO', /Taxonomie/],
  ['TEHG', /\bTEHG\b/],
  ['BEHG', /\bBEHG\b/],
  ['KSG', /\bKSG\b|Klimaschutzgesetz/],
  ['CBAM', /\bCBAM\b|2023\/956/],
  ['BITV', /\bBITV\b/],
  ['TMG/DDG', /\bTMG\b|\bDDG\b/],
  ['TDDDG', /\bTDDDG\b/],
  ['MStV', /\bMStV\b/],
  ['BayDSchG', /\bBayDSchG\b|Denkmalschutzgesetz/],
  ['BayDiV', /\bBayDiV\b/],
  ['BayBGG', /\bBayBGG\b/],
  ['BayHIG', /\bBayHIG\b/],
  ['NachwV', /\bNachwV\b|Nachweisverordnung/],
  ['AltholzV', /\bAltholzV\b|Altholzverordnung/],
  ['TrinkwV', /\bTrinkwV\b/],
  ['ZPO', /\bZPO\b/],
  ['StGB', /\bStGB\b/],
  ['EStG/EStDV', /\bEStG\b|\bEStDV\b/],
  ['GG', /\bGG\b|Grundgesetz/],
  ['GewO', /\bGewO\b/],
  ['VwVfG', /\bVwVfG\b/],
  ['ProdHaftG', /\bProdHaftG\b/],
  ['GeschGehG', /\bGeschGehG\b/],
  ['ChemG', /\bChemG\b/],
];

const KERN = /(§§?|Art\.|Artikel|Anlage|Anhang)\s?(\d+[a-z]?(?:\s?(?:bis|–|-|,|und|u\.)\s?\d+[a-z]?)*)((?:\s?(?:Abs\.|Absatz|Satz|S\.|Nr\.|Nummer|lit\.|Buchst\.|UAbs\.|Unterabs\.|Tab\.|Tabelle|Spalte|Teil|Abschnitt)\s?[\dIVXa-z]+[a-z]?\)?(?:\s?(?:und|bis|,|–)\s?\d+)?)*)(\s?ff?\.)?/g;

const argv = process.argv.slice(2);
const opt = (n) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : undefined; };
const alle = argv.includes('--alle');

function* dateien(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (e.name !== 'node_modules') yield* dateien(p); }
    else if (ENDUNG.test(e.name)) yield p;
  }
}

// nächstliegendes Gesetz im Fenster (bei gleichem Beginn gewinnt der spezifischere Eintrag)
function gesetzVon(text, vonHinten = false) {
  let best = null;
  for (const [name, re] of GESETZE) {
    const alle = [...text.matchAll(new RegExp(re.source, 'g'))];
    const m = vonHinten ? alle[alle.length - 1] : alle[0];
    if (!m) continue;
    const pos = vonHinten ? text.length - m.index : m.index;
    if (!best || pos < best.pos) best = { name, pos };
  }
  return best;
}

const zitate = new Map();
for (const ordner of ORDNER) {
  for (const datei of dateien(path.join(ROOT, ordner))) {
    const rel = path.relative(ROOT, datei).split(path.sep).join('/');
    const zeilen = fs.readFileSync(datei, 'utf8').split('\n');
    zeilen.forEach((zeile, i) => {
      for (const m of zeile.matchAll(KERN)) {
        const nach = zeile.slice(m.index + m[0].length, m.index + m[0].length + 60);
        // Gesetz danach, aber nur bis zum nächsten Zitatkern
        const stopp = nach.search(/§|Art\.\s?\d|Artikel\s\d/);
        const fenster = stopp > 0 ? nach.slice(0, stopp) : nach;
        const vor = zeile.slice(Math.max(0, m.index - 25), m.index);
        // „BGB § 633“: unmittelbar vorangestelltes Gesetz hat Vorrang vor einem späteren
        const direkt = GESETZE.find(([, re]) => new RegExp(`(?:${re.source})\\)?\\s?$`).test(vor));
        let g = direkt ? { name: direkt[0], pos: 0 } : gesetzVon(fenster);
        if (!g) {
          const gv = gesetzVon(vor, true);
          if (gv && /^[\s,(]*$/.test(vor.slice(vor.length - 3).replace(/[A-Za-zÄÖÜäöü/\-]/g, ''))) g = gv;
        }
        const art = m[1];
        if (!g && !alle) continue;
        const gesetz = g ? g.name : '(ohne Gesetz)';
        const kern = `${art.replace('Artikel', 'Art.')} ${m[2]}${m[3] || ''}${m[4] || ''}`.replace(/\s+/g, ' ').trim();
        const key = `${kern} ${gesetz}`;
        if (!zitate.has(key)) zitate.set(key, { zitat: kern, gesetz, fundstellen: [], kontext: zeile.slice(Math.max(0, m.index - 60), m.index + 140).trim() });
        zitate.get(key).fundstellen.push(`${rel}:${i + 1}`);
      }
    });
  }
}

const liste = [...zitate.values()].sort((a, b) => a.gesetz.localeCompare(b.gesetz) || a.zitat.localeCompare(b.zitat, 'de', { numeric: true }));
const summe = liste.reduce((s, z) => s + z.fundstellen.length, 0);
console.log(`${liste.length} verschiedene Zitate, ${summe} Fundstellen`);
const jeGesetz = {};
for (const z of liste) jeGesetz[z.gesetz] = (jeGesetz[z.gesetz] || 0) + z.fundstellen.length;
for (const [g, n] of Object.entries(jeGesetz).sort((a, b) => b[1] - a[1])) console.log(`  ${g}: ${n}`);
if (opt('--json')) fs.writeFileSync(opt('--json'), JSON.stringify(liste, null, 2));
if (opt('--md')) {
  const md = ['| Zitat | Gesetz | Fundstellen |', '|---|---|---|',
    ...liste.map(z => `| ${z.zitat} | ${z.gesetz} | ${z.fundstellen.join('<br>')} |`)].join('\n');
  fs.writeFileSync(opt('--md'), md + '\n');
}
