// Prüfskript Kennwert-Abgleich (scripts/qa/kennwert-abgleich.mjs, Entscheidung 29.10.2026): kein Gate auf die Funde,
// nur Lauffähigkeit und Erkennung. Das Skript wird wie im Bericht dokumentiert aufgerufen (node …, ohne npm-Skript).
import { execFileSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import {
  leseZahl, zahlenMitEinheit, normVerweise, festeFaktoren, pruefeKennwerte, ladeReferenzen, analysiere, kennzahlen,
} from '../scripts/qa/kennwert-abgleich.mjs';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };

console.log('--- Test: Prüfskript Kennwert-Abgleich ---');

// 1. Zahlen lesen
pruefe(leseZahl('0,665') === 0.665 && leseZahl('33 000') === 33000 && leseZahl('1.800') === 1800 && leseZahl('0.40') === 0.4, 'Zahlformate');
const z = zahlenMitEinheit('CEM I: 0,665 kg CO₂-Äq./kg; Lkw 101 g/tkm; 245 kg CO₂-Äq./m³; E_cm = 33 GPa');
pruefe(z.length === 4, `vier Zahlen mit Einheit erwartet, ${z.length}`);
pruefe(z[1]?.bezug === 'tkm' && Math.abs((z[1]?.wert ?? 0) - 0.101) < 1e-9, 'g/tkm wird in kg/tkm umgerechnet');
pruefe(z[2]?.bezug === 'm³', 'Bezug m³ erkannt');
pruefe(z[3]?.wert === 33000, 'GPa wird in N/mm² umgerechnet');

// 2. Kennwerte gegen zentrale Konstanten
const refs = await ladeReferenzen();
pruefe(refs.length > 100, `Referenzen geladen (${refs.length})`);
const k1 = pruefeKennwerte('Mit CEM I (0,665 kg CO₂-Äq./kg) und CEM III/A mit 0,55 kg CO₂-Äq./kg.', refs);
pruefe(k1.treffer.length === 2 && k1.treffer[0].ok && !k1.treffer[1].ok, 'Zement-GWP: Übereinstimmung und Abweichung erkannt');
pruefe(k1.treffer[1]?.ref.konstante === "ZEMENT_GWP_KG['CEM III/A']", 'CEM III/A der richtigen Konstante zugeordnet');
const k2 = pruefeKennwerte('Lkw 40 t Euro 6 mit 0,068 kg CO₂-Äq./(t·km)', refs);
pruefe(k2.treffer.length === 1 && !k2.treffer[0].ok, 'Transportfaktor 0,068 weicht von A4_FAKTOR_EINZEL ab (NP2-LC-2)');
const k3 = pruefeKennwerte('C30/37 (f_ck = 30 N/mm², f_cm = 38 N/mm², E_cm = 33 000 N/mm²); f_cm ≤ 35 N/mm² gilt Gl. (B.3a)', refs);
pruefe(k3.treffer.length === 3 && k3.treffer.every(t => t.ok), `EC2-Kennwerte C30/37 übereinstimmend, Bedingung ≤ nicht gewertet (${k3.treffer.length})`);
const k4 = pruefeKennwerte('C35/45: f_ctm = 2,9 N/mm²', refs);
pruefe(k4.treffer.length === 1 && !k4.treffer[0].ok, 'falsch zugeordneter Tabellenwert (f_ctm von C30/37 bei C35/45) erkannt');
const k5 = pruefeKennwerte('Emissionsbasis 1,8 kg CO₂/kg Baustahl', refs);
pruefe(k5.treffer.length === 1 && !k5.treffer[0].ok && k5.treffer[0].ref.konstante === 'GWP_LEHRWERTE.profilstahl', 'Profilstahl-GWP 1,8 weicht vom zentralen Lehrwert ab (NP2-ST-2)');
const k6 = pruefeKennwerte('Mineralwolle 1,20 kg CO₂-Äq./kg', refs);
pruefe(k6.treffer.length === 0 && k6.ohne.length === 1, 'GWP ohne zentrale Konstante landet in der Prüfliste');

// 3. Feste Faktoren
const ff = festeFaktoren([
  'const fyd = 500 / 1.15; // Bemessungswert',
  'const a = b * 1.8; // Lehrwert nach UBA',
  'const x = Math.round(v * 100) / 100;',
  "const t = `${formatDeZahl(200000 / ecm, 2)} N/mm²`;",
  '<div className="w-1/2" style={{ width: w * 0.5 }} />',
  "const text = 'Faktor 0,85 * 2,5';",
].join('\n'));
const lits = ff.map(f => f.literal);
pruefe(lits.includes('500') && lits.includes('1.15') && lits.includes('1.8') && lits.includes('200000'), `feste Faktoren erkannt: ${lits.join(', ')}`);
pruefe(!lits.includes('0.85') && !lits.includes('100'), 'Rundung, Darstellung und Zeichenketten ausgenommen');
pruefe(ff.find(f => f.literal === '1.8')?.kommentiert === true && ff.find(f => f.literal === '1.15')?.kommentiert === false, 'Quellkommentar erkannt');

// 4. Normverweise
const nv = normVerweise('nach DIN EN 1992-1-1/NA:2013-04, Tabelle NA.4.2, und DIN 4108-2:2013-02, Abschnitt 8.3.2; Tab. 3.1 der DIN EN 1992-1-1');
pruefe(nv.length === 3, `drei Normverweise erwartet, ${nv.length}`);
pruefe(nv[0]?.na === true && nv[0]?.ausgabe === '2013-04' && nv[0]?.ort === 'Tab. NA.4.2', 'NA, Ausgabe und NA-Tabelle erkannt');
pruefe(nv[1]?.norm === 'DIN 4108-2' && nv[1]?.ort === 'Abschn. 8.3.2', 'Teil und Abschnitt erkannt');
pruefe(nv[2]?.norm === 'EN 1992-1-1' && nv[2]?.ort === 'Tab. 3.1', 'vorangestellte Tabelle erkannt');

// 5. Gesamtlauf: Modulzuordnung und Berichte
const erg = await analysiere();
const namen = erg.einheiten.map(e => e.name);
pruefe(erg.einheiten.length > 150, `Module zugeordnet (${erg.einheiten.length})`);
pruefe(['stahl', 'lca_rechner', 'mischungsberechnung', '_gemeinsam'].every(n => namen.includes(n) || erg.einheiten.some(e => e.ids.includes(n))), 'erwartete Berichte vorhanden');
const summe = erg.einheiten.reduce((s, e) => s + kennzahlen(e).normverweise, 0);
pruefe(summe > 1000, `Normverweise gesammelt (${summe})`);
const ordner = fs.mkdtempSync(path.join(os.tmpdir(), 'kennwert-'));
const aus = execFileSync(process.execPath, [path.resolve('scripts/qa/kennwert-abgleich.mjs'), '--ausgabe', ordner], { encoding: 'utf8' });
pruefe(/^\(1\) abweichend \d+/m.test(aus), 'Konsolenzusammenfassung');
const dateien = fs.readdirSync(ordner);
pruefe(dateien.includes('README.md') && dateien.length === erg.einheiten.length + 1, `Berichte geschrieben (${dateien.length})`);
pruefe(/## 3 Normverweise/.test(fs.readFileSync(path.join(ordner, 'stahl.md'), 'utf8')), 'Modulbericht mit Abschnitten');
fs.rmSync(ordner, { recursive: true, force: true });

if (fehler.length) {
  for (const f of fehler) console.error(`FAIL: ${f}`);
  process.exit(1);
}
console.log(`OK: Prüfskript läuft (${erg.einheiten.length} Berichte, ${refs.length} Referenzwerte)`);
