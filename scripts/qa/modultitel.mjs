#!/usr/bin/env node
/**
 * Abgleich der Modultitel (Gesamtgutachten 03.11.2026, Abschnitt 3.3; Regel in docs/architektur.md „Modultitel“).
 *
 * Regel:
 *  1. `label` (Registry) ist die Kurzform für Menü, Brotkrumen, Mobil-Kopfleiste, Kacheln und Reiter.
 *  2. `baum.titel` ist der Modultitel. Er steht überall, wo das Modul ohne Menükontext genannt wird: Hauptüberschrift
 *     (h1), Fenstertitel und `<title>`/og:title der vorgerenderten Seite, Volltexttreffer, Lernziel-Querverweise,
 *     Modulnamen im Quiz, PDF-Kopf, Modulübersicht.
 *  3. Das Label muss im Titel erkennbar sein: jedes Wort des Labels (ohne Klammerzusatz, ab 3 Zeichen, ohne Füllwörter)
 *     steht im Titel – „Label“, „Label & Zusatz“, „Label (Zusatz)“ oder „Bereich: Label …“.
 *  4. Die sichtbare Modulüberschrift (erste h2 im Modulinhalt) nennt das Modul: wie 3., nur gegen die Überschrift.
 *     Ausgenommen sind Bereichsüberschriften geteilter Komponenten (mehrere Module als Reiter einer Seite) und die
 *     „Bereich: …“-Überschriften der Modulinfos – Liste AUSNAHMEN_UEBERSCHRIFT mit Grund (Ratsche: darf nur schrumpfen).
 *
 * Aufruf:  node scripts/qa/modultitel.mjs [--dist dist]   prüft 3. für alle aktiven Module und 4. über dist/modul/*.html
 * tests/modultitel.test.ts ruft dieselben Funktionen auf.
 */
import fs from 'fs';
import path from 'path';
import { pathToFileURL, fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

const FUELL = new Set(['und', 'der', 'die', 'das', 'des', 'den', 'dem', 'mit', 'nach', 'fuer', 'von', 'vom', 'im', 'in', 'am', 'zum', 'zur']);

/** Wörter des Labels für den Vergleich (gefaltet, ohne Klammerzusatz) */
export function labelWoerter(label, { falte, kompakt }) {
  return falte(label.replace(/\([^)]*\)/g, ' '))
    .split(/[\s&,/:–\-+]+/)
    .map(kompakt)
    .filter(w => w.length >= 3 && !FUELL.has(w));
}

/** Wörter des Labels, die im Text fehlen (Stamm oder die ersten 5 Zeichen genügen: „Hydratation“ ~ „Hydratations…“) */
export function fehlendeWoerter(label, text, h) {
  const t = h.kompakt(text);
  return labelWoerter(label, h).filter(w => !t.includes(h.stamm(w)) && !t.includes(w.slice(0, 5)));
}

/**
 * Bereichsüberschriften geteilter Komponenten und Modulinfos (Regel 4). Schlüssel: Modul-ID, Wert: Grund.
 * Ein Eintrag gilt nur, solange die Überschrift das Modul nicht nennt; wird sie angepasst, Eintrag entfernen.
 */
export const AUSNAHMEN_UEBERSCHRIFT = {
  // Modulinfos: Überschrift „Bereich: …“, das Label „Modulinfos“ steht im Menü der Gruppe
  ...Object.fromEntries(['grundlagen_info', 'labor_info', 'baustoffe_info', 'bauprodukte_info', 'stahlbeton_info', 'holzbau_info', 'mechanik_info',
    'bauphysik_info', 'nachhaltigkeit_info', 'bestand_info', 'rueckbau_info', 'dauerhaftigkeit_info', 'schaeden_info', 'instandsetzung_info',
    'digitales_info', 'praxiswissen_info'].map(id => [id, 'Modulinfos: Bereichsüberschrift „Bereich: …“'])),
  // Geteilte Komponenten: Bereichsüberschrift über den Reitern, der Reiter nennt das Modul
  ...Object.fromEntries(['bp_verkehr_rsto', 'bp_verkehr_asphalt', 'bp_verkehr_bitumen', 'bp_verkehr_pruefung', 'bp_verkehr_betondecken',
    'bp_verkehr_tiefbau', 'bp_verkehr_bahn', 'bp_verkehr_tunnel'].map(id => [id, 'Reiter von „Verkehr und Tiefbau“'])),
  ...Object.fromEntries(['holzbau_werkstoffe', 'holzbau_konstruktion', 'holzbau_bemessung', 'holzbau_verbindung', 'holzbau_bauphysik']
    .map(id => [id, 'Reiter von „Holzbau (Ingenieurholzbau)“'])),
  ...Object.fromEntries(['px_planung', 'px_bauleitung', 'px_produktion', 'px_karriere'].map(id => [id, 'Reiter von „Praxiswissen & Bau-Checklisten“'])),
  ...Object.fromEntries(['weiter_bauing', 'weiter_pm', 'weiter_ausbau', 'weiter_fassade', 'weiter_holzbau', 'weiter_ttz', 'weiter_mapr']
    .map(id => [id, 'Reiter von „Weiterführende Studienangebote (THA & ibi)“'])),
  ...Object.fromEntries(['rechnung_u_wert', 'rechnung_beton', 'rechnung_stahlbeton', 'rechnung_holzbau', 'rechnung_mauerwerk', 'rechnung_nachhaltigkeit',
    'rechnung_bestand', 'rechnung_schallschutz', 'rechnung_brandschutz'].map(id => [id, 'Reiter von „Interaktive Beispielrechnungen“'])),
  ...Object.fromEntries(['vl_bauen_im_bestand', 'vl_nachhaltiges_bauen', 'vl_bauschaeden', 'vl_baustoffkunde', 'vl_instandhaltung']
    .map(id => [id, 'Reiter von „Vorlesungen & Lehrveranstaltungen (THA)“'])),
  ...Object.fromEntries(['spannbeton_grundlagen', 'spannbeton_kennwerte'].map(id => [id, 'Teile eines geteilten Moduls (src/registry/teilmodule.ts), gemeinsame Überschrift „Spannbeton …“'])),
  weiter_tha: 'Übersichtsreiter von „Weiterführende Studienangebote (THA & ibi)“',
  start: 'Startseite: Begrüßung statt Modultitel',
  // offen (03.11.2026): Modul ohne eigene Hauptüberschrift; erste h2 ist der erste Abschnitt bzw. wird zusammengesetzt
  zfp: 'offen: erste h2 ist der erste Simulator („Rückprallhammer“), keine Modulüberschrift',
  ausbau: 'offen: erste h2 ist der erste Abschnitt („Trockenbau“), keine Modulüberschrift',
  nawaro: 'offen: Überschrift „NaWaRo | Biobasierte Baustoffe“ zusammengesetzt (Label „Biogene Baustoffe (NaWaRo)“)',
  aufgaben_kennwerte: 'offen: Überschrift aus der Aufgabenkomponente zusammengesetzt („Übungsaufgaben: Labor, Prüftechnik & Kenngrößen“)',
};

/** Text einer HTML-Überschrift ohne Tags und Entities */
const htmlText = s => s.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&nbsp;|&#160;/g, ' ').replace(/\s+/g, ' ').trim();

/** Erste h2 im Modulinhalt einer vorgerenderten Seite (nach dem Modulkopf) */
export function ersteUeberschrift(html) {
  const i = html.indexOf('id="module-content"');
  if (i < 0) return null;
  const m = /<h2\b[^>]*>([\s\S]*?)<\/h2>/.exec(html.slice(i));
  return m ? htmlText(m[1]) : null;
}

async function ladeTs(rel) {
  const { tsImport } = await import('tsx/esm/api');
  return tsImport(pathToFileURL(path.join(ROOT, rel)).href, import.meta.url);
}

/** Gesamtprüfung: { labelFehler: [{id,label,titel,fehlt}], kopfFehler: [{id,label,titel,ueberschrift,fehlt}], ausnahmenUngenutzt, geprueft } */
export async function abgleich({ dist = path.join(ROOT, 'dist') } = {}) {
  const reg = await ladeTs('src/registry/modules.ts');
  const h = await ladeTs('src/utils/suchNormalisierung.ts');
  const labelFehler = [];
  const kopfFehler = [];
  const genutzt = new Set();
  let geprueft = 0;
  for (const m of reg.AKTIVE_MODULE) {
    const titel = m.baum?.titel;
    if (!titel) continue;
    const f = fehlendeWoerter(m.label, titel, h);
    if (f.length) labelFehler.push({ id: m.id, label: m.label, titel, fehlt: f });
    // dist/modul/admin.html ist im Statik-Build keine vorgerenderte Modulseite, sondern eine Kopie der Startseite
    // (buildCommand in vercel.json: cp dist/index.html dist/modul/admin.html) – ihre Überschrift ist die Begrüßung
    if (m.id === 'admin') continue;
    const datei = path.join(dist, 'modul', `${m.id}.html`);
    if (!fs.existsSync(datei)) continue;
    const ueberschrift = ersteUeberschrift(fs.readFileSync(datei, 'utf8'));
    if (!ueberschrift) continue;
    geprueft++;
    const fk = fehlendeWoerter(m.label, ueberschrift, h);
    if (!fk.length) continue;
    if (m.id in AUSNAHMEN_UEBERSCHRIFT) { genutzt.add(m.id); continue; }
    kopfFehler.push({ id: m.id, label: m.label, titel, ueberschrift, fehlt: fk });
  }
  const ausnahmenUngenutzt = geprueft ? Object.keys(AUSNAHMEN_UEBERSCHRIFT).filter(id => !genutzt.has(id) && fs.existsSync(path.join(dist, 'modul', `${id}.html`))) : [];
  return { labelFehler, kopfFehler, ausnahmenUngenutzt, geprueft };
}

const istHaupt = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (istHaupt) {
  const i = process.argv.indexOf('--dist');
  const erg = await abgleich(i > 0 ? { dist: path.resolve(process.argv[i + 1]) } : {});
  console.log(`Modultitel: ${erg.labelFehler.length} Label nicht im Titel; ${erg.geprueft} Modulüberschriften geprüft, ${erg.kopfFehler.length} nennen das Modul nicht.`);
  for (const f of erg.labelFehler) console.log(`  TITEL ${f.id}: Label „${f.label}“, Titel „${f.titel}“ – fehlt: ${f.fehlt.join(', ')}`);
  for (const f of erg.kopfFehler) console.log(`  KOPF  ${f.id}: Label „${f.label}“, Titel „${f.titel}“, Überschrift „${f.ueberschrift}“ – fehlt: ${f.fehlt.join(', ')}`);
  for (const id of erg.ausnahmenUngenutzt) console.log(`  Hinweis: Ausnahme ${id} nicht mehr nötig (entfernen)`);
  process.exit(erg.labelFehler.length || erg.kopfFehler.length ? 1 : 0);
}
