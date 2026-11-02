// Fristen- und Schwellenliste (src/data/fristenSchwellen.ts) und Abgleichskript (scripts/qa/fristen-abgleich.mjs),
// Auftrag 02.11.2026 (docs/pruefung/normen-fristen-folge-2026-11-02.md):
// (1) Datenprüfung der Liste, (2) Erkennung des Skripts an Beispielsätzen, (3) Ratsche: 0 unbegründete Abweichungen
// in content/ und src/data/quiz.json; begründete Ausnahmen stehen in AUSNAHMEN des Skripts.
import { FRISTEN_SCHWELLEN, type FristSchwelle } from '../src/data/fristenSchwellen';
import { abgleich, bereite, pruefeText, leseWert, stimmt, kompiliere, AUSNAHMEN } from '../scripts/qa/fristen-abgleich.mjs';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };

console.log('--- Test: Fristen- und Schwellenliste ---');

// 1. Daten
const ids = new Set<string>();
for (const e of FRISTEN_SCHWELLEN) {
  pruefe(!ids.has(e.id), `doppelte ID ${e.id}`); ids.add(e.id);
  pruefe(!!e.vorschrift && !!e.fundstelle && !!e.bezeichnung && !!e.einheit, `${e.id}: Pflichtfeld fehlt`);
  pruefe(/^https:\/\/[^\s]+$/.test(e.quelle), `${e.id}: Quelle ist keine https-URL`);
  pruefe(/^\d{4}-\d{2}-\d{2}$/.test(e.stand), `${e.id}: Stand nicht als ISO-Datum`);
  if (e.einheit === 'Datum') pruefe(typeof e.wert === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(e.wert) && !Number.isNaN(Date.parse(e.wert)), `${e.id}: Datum ungültig`);
  else pruefe(typeof e.wert === 'number' && Number.isFinite(e.wert), `${e.id}: Zahlwert erwartet`);
  for (const m of e.erkennung?.muster ?? []) {
    try { pruefe(kompiliere(m).source.includes('(?<w>'), `${e.id}: Muster ohne Wertgruppe: ${m}`); } catch (x) { fehler.push(`${e.id}: Muster ungültig (${(x as Error).message})`); }
  }
  pruefe(!/claude/i.test(JSON.stringify(e)), `${e.id}: unzulässiger Name`);
}
for (const v of ['BAUPVO_GELTUNG', 'BBODSCHV_BBB_FLAECHE', 'GEWABFV_DOKU_10M3', 'GMODG_INKRAFT', 'GMODG_STUFE_2027', 'KIVO_ART50', 'KIVO_ANHANG_III', 'EBV_INKRAFT', 'GEFSTOFFV_NOVELLE_2024', 'KRWG_14_BAUABFALL', 'EPBD_GWP_1000'])
  pruefe(ids.has(v), `Pflichteintrag ${v} fehlt`);
const w = (id: string) => FRISTEN_SCHWELLEN.find(e => e.id === id)?.wert;
pruefe(w('BBODSCHV_BBB_FLAECHE') === 3000 && w('GEWABFV_DOKU_10M3') === 10 && w('BAUPVO_GELTUNG') === '2026-01-08' && w('GMODG_INKRAFT') === '2026-07-29',
  'Kernwerte (3000 m², 10 m³, 08.01.2026, 29.07.2026)');

// 2. Erkennung
pruefe(leseWert('1. August 2023') === '2023-08-01' && leseWert('August 2023') === '2023-08' && leseWert('09.01.2031') === '2031-01-09' && leseWert('3 000') === 3000 && leseWert('0,062') === 0.062 && leseWert('zehn') === 10,
  'Werte lesen (Datum, Monat, Zahl mit Tausenderabstand, Dezimalkomma, Zahlwort)');
pruefe(stimmt('2023-08', '2023-08-01') && stimmt('2028', '2028-01-01') && !stimmt('2023-07', '2023-08-01') && stimmt(10, 10) && !stimmt(1, 10), 'Vergleich mit Monat/Jahr');
const E = bereite(FRISTEN_SCHWELLEN as FristSchwelle[]);
const ergebnis = (t: string) => pruefeText(t, E).map(x => `${x.id}:${x.ok ? 'ok' : 'ABW'}`);
const hat = (t: string, soll: string, msg: string) => pruefe(ergebnis(t).includes(soll), `${msg}: erwartet ${soll}, erkannt ${ergebnis(t).join(', ') || '–'}`);
hat('Die BauPVO (EU) 2024/3110 ist seit 08.01.2026 anwendbar.', 'BAUPVO_GELTUNG:ok', 'BauPVO richtig');
hat('Die BauPVO (EU) 2024/3110 ist seit 01.01.2026 anwendbar.', 'BAUPVO_GELTUNG:ABW', 'BauPVO falsches Datum');
hat('Nach § 8 GewAbfV entfällt die Dokumentation bis 5 m³.', 'GEWABFV_DOKU_10M3:ABW', 'GewAbfV falsche Schwelle');
hat('Ab 10 m³ Abfall ist die Getrennthaltung nach GewAbfV zu dokumentieren.', 'GEWABFV_DOKU_10M3:ok', 'GewAbfV richtig');
hat('Auf einer Fläche von mehr als 5000 m² kann die Behörde eine bodenkundliche Baubegleitung verlangen (§ 4 Abs. 5 BBodSchV).', 'BBODSCHV_BBB_FLAECHE:ABW', 'BBodSchV falsche Fläche');
hat('Die Ersatzbaustoffverordnung (EBV, seit August 2023) regelt …', 'EBV_INKRAFT:ok', 'EBV mit Monatsangabe');
hat('Gebäudemodernisierungsgesetz (GModG, in Kraft seit 01.08.2026)', 'GMODG_INKRAFT:ABW', 'GModG falsches Inkrafttreten');
pruefe(!ergebnis('Das GModG wurde am 28.07.2026 verkündet und tritt gestaffelt in Kraft.').includes('GMODG_INKRAFT:ABW'), 'Verkündungsdatum nicht als Inkrafttreten werten');
// Familie: nächster Anker gewinnt (Omnibus statt KI-VO)
const omni = ergebnis('Mit dem Digital Omnibus zur KI-VO (Verordnung (EU) 2026/1744, in Kraft seit 27.07.2026) gelten neue Termine.');
pruefe(omni.includes('KIVO_OMNIBUS_INKRAFT:ok') && !omni.some(x => x.startsWith('KIVO_INKRAFT')), `Familie Inkrafttreten: ${omni.join(', ')}`);
hat('Hochrisiko-Pflichten nach KI-VO für Anhang III ab 02.08.2026.', 'KIVO_ANHANG_III:ABW', 'KI-VO Anhang III alter Termin');
hat('Lebenszyklus-GWP (EPBD): ab 2028 Neubauten > 1000 m², ab 2030 alle Neubauten.', 'EPBD_GWP_1000:ok', 'EPBD Jahresangabe');
hat('Bei Gebäuden über 5000 m² ist zusätzlich das Lebenszyklus-GWP offenzulegen (EU-Taxonomie).', 'TAXONOMIE_GWP_5000:ok', 'Taxonomie-Schwelle nicht als EPBD-Abweichung');
pruefe(ergebnis('Die DIN 1045-2 gilt seit 01.08.2023.').length === 0, 'ohne Anker kein Treffer');

// 3. Ratsche über content/ und quiz.json
const erg = await abgleich();
pruefe(erg.treffer.length >= 120, `nur ${erg.treffer.length} erkannte Angaben – Erkennung prüfen`);
for (const t of erg.abweichungen) fehler.push(`Abweichung ${t.id}: gefunden ${t.wert}, Soll ${t.soll} – ${t.ort} („${t.auszug}“)`);
for (const k of erg.ausnahmenUngenutzt) fehler.push(`Ausnahme ohne Treffer: ${k}`);
for (const a of AUSNAHMEN as { grund?: string }[]) pruefe(!!a.grund, 'Ausnahme ohne Begründung');
// jeder Eintrag mit Erkennung hat mindestens eine Fundstelle – außer den hier begründeten
const OHNE_FUNDSTELLE = new Set(['KRWG_REFERENTENENTWURF']); // in der App ohne Datum genannt (Rechtsstand 11/2026: KrWG ohne zeitgebundene Aussage)
const mitTreffer = new Set(erg.treffer.map(t => t.id));
for (const e of FRISTEN_SCHWELLEN) if (e.erkennung && !OHNE_FUNDSTELLE.has(e.id)) pruefe(mitTreffer.has(e.id), `${e.id}: keine Fundstelle mehr erkannt (Text geändert? Muster anpassen)`);

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log(`OK: ${FRISTEN_SCHWELLEN.length} Einträge, ${erg.treffer.length} Angaben, 0 Abweichungen`);
