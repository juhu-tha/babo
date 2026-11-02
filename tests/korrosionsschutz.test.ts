// Rechenkern Korrosionsschutz: Zinkschutzdauer, Duplex, Schutzdauerklassen (AP 3.13)
import { zinkSchutzdauer, schutzdauerklasse, zinkMindestschicht, abnahme8020, ZINK_1461_GUSS, KORROSIVITAET, KATEGORIEN, KLASSEN, type ZinkEingabe } from '../src/calc/korrosionsschutz';
import { istUngueltig, keinErgebnis, zahlenPassen } from './hilfen/keinErgebnis';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (ist: number, soll: number, tol: number) => Math.abs(ist - soll) <= tol;
console.log('--- Test: Korrosionsschutz ---');

const basis: ZinkEingabe = { dZn: 85, kategorie: 'C3', ziel: 'VH', duplex: false, tBeschichtung: 10, synergie: 1.5 };

// 1. Handrechnung C3, 85 µm: t = 85/2,1 = 40,48 a bis 85/0,7 = 121,43 a → VH (sicher erfüllt)
const c3 = zinkSchutzdauer(basis);
pruefe(c3.gueltig && nahe(c3.tMin, 40.476, 1e-3) && nahe(c3.tMax ?? 0, 121.429, 1e-3), `C3: ${c3.tMin} / ${c3.tMax}`);
pruefe(c3.klasseUnguenstig === 'VH' && c3.bewertung === 'erfuellt' && c3.hinweise.length === 0, 'C3 → VH erfüllt, keine Hinweise');

// 2. Handrechnung C5, 85 µm: 85/8,4 = 10,12 a bis 85/4,2 = 20,24 a → M bis H
const c5 = zinkSchutzdauer({ ...basis, kategorie: 'C5' });
pruefe(nahe(c5.tMin, 10.119, 1e-3) && nahe(c5.tMax ?? 0, 20.238, 1e-3), `C5: ${c5.tMin}`);
pruefe(c5.klasseUnguenstig === 'M' && c5.klasseGuenstig === 'H' && c5.bewertung === 'nicht_erfuellt', 'C5 → VH nicht erfüllt');
pruefe(zinkSchutzdauer({ ...basis, kategorie: 'C5', ziel: 'H' }).bewertung === 'grenzwertig', 'C5 → H nur im günstigen Fall');

// 3. Duplex C5: t_D = 1,5 · (10,12 + 10) = 30,18 a → VH
const d = zinkSchutzdauer({ ...basis, kategorie: 'C5', duplex: true });
pruefe(nahe(d.tDuplexMin, 30.179, 1e-3) && d.klasseUnguenstig === 'VH' && d.bewertung === 'erfuellt', `Duplex ${d.tDuplexMin}`);
pruefe(nahe(d.tDuplexMax ?? 0, 1.5 * (85 / 4.2 + 10), 1e-9), 'Duplex günstig');

// 4. Unabhängiger Referenzwert: Massenverlust Zink nach DIN EN ISO 9223 (C3 bis 15 g/(m²·a), C5 bis 60 g/(m²·a)),
//    Dichte Zink 7,14 g/cm³ → d/r = 85 µm · 7,14 g/cm³ / (15 g/m²) = 40,46 a bzw. 10,12 a
pruefe(nahe(c3.tMin, 85 * 7.14 / 15, 0.1) && nahe(c5.tMin, 85 * 7.14 / 60, 0.05), 'Referenz über Massenverlust');

// 5. Klassengrenzen nach DIN EN ISO 12944-1 und Mindestschichtdicken nach DIN EN ISO 1461
pruefe(schutzdauerklasse(7) === 'L' && schutzdauerklasse(7.01) === 'M' && schutzdauerklasse(15) === 'M' && schutzdauerklasse(25) === 'H' && schutzdauerklasse(25.1) === 'VH', 'Klassengrenzen');
pruefe(zinkMindestschicht(10).mittel === 85 && zinkMindestschicht(6).mittel === 70 && zinkMindestschicht(3).mittel === 55 && zinkMindestschicht(1.5).mittel === 55 && zinkMindestschicht(1).mittel === 45, 'ISO 1461');
pruefe(zinkSchutzdauer({ ...basis, dZn: 60, stahlDickeMm: 8 }).hinweise.some(h => h.feld === 'dZn'), 'unter ISO-1461-Mindestwert → Warnung');

// 6. Monotonie und Linearität: doppelte Schicht → doppelte Dauer; Kategorien aufsteigend → Dauer fallend
pruefe(nahe(zinkSchutzdauer({ ...basis, dZn: 170 }).tMin, 2 * c3.tMin, 1e-9), 'linear in d');
const reihe = KATEGORIEN.map(k => zinkSchutzdauer({ ...basis, kategorie: k }).tMin);
pruefe(reihe.every((t, i) => i === 0 || t < reihe[i - 1]), 'Kategorien monoton');
pruefe(zinkSchutzdauer({ ...basis, kategorie: 'C1' }).tMax === null, 'C1 nach oben offen');
pruefe(KATEGORIEN.every((k, i) => i === 0 || KORROSIVITAET[k].zink[0] === KORROSIVITAET[KATEGORIEN[i - 1]].zink[1]), 'Spannweiten lückenlos');

// 7. Plausibilität: Fehler und Warnungen
pruefe(!zinkSchutzdauer({ ...basis, dZn: 0 }).gueltig && !zinkSchutzdauer({ ...basis, dZn: NaN }).gueltig, 'd ≤ 0 / NaN → Fehler');
pruefe(!zinkSchutzdauer({ ...basis, duplex: true, synergie: 0 }).gueltig, 'f = 0 → Fehler');
pruefe(zinkSchutzdauer({ ...basis, duplex: true, synergie: 3 }).hinweise.some(h => h.feld === 'synergie'), 'f außerhalb Spanne → Warnung');
pruefe(zinkSchutzdauer({ ...basis, kategorie: 'CX' }).hinweise.some(h => h.feld === 'kategorie'), 'CX → Warnung');

// 8. Fuzz: 1000 Zufallseingaben, alle Ergebnisse endlich
let seed = 29;
const z = (a: number, c: number) => { seed = (seed * 1103515245 + 12345) % 2147483648; return a + (c - a) * (seed / 2147483648); };
for (let i = 0; i < 1000; i++) {
  const r = zinkSchutzdauer({ dZn: z(-20, 400), kategorie: KATEGORIEN[i % 6], ziel: KLASSEN[i % 4], duplex: i % 2 === 0, tBeschichtung: z(-5, 60), synergie: z(-0.5, 3.5), stahlDickeMm: i % 3 ? z(-1, 40) : undefined });
  const werte = [r.tMin, r.tDuplexMin, r.tMassgebend, r.rMin, r.rMax, r.tMax ?? 0, r.tDuplexMax ?? 0];
  if (!zahlenPassen(r, werte)) { pruefe(false, `Fuzz ${i}`); break; }
}

// Runde 5: DIN EN ISO 1461:2022, Tab. 3 (öffentlich: Wedge Galvanizing, „HDG to EN ISO 1461:2022“, 10/2024)
pruefe(zinkMindestschicht(8).mittel === 85 && zinkMindestschicht(8).oertlich === 70 && zinkMindestschicht(5).mittel === 70 && zinkMindestschicht(2).mittel === 55 && zinkMindestschicht(1).mittel === 45, 'ISO 1461 Tab. 3 Stahl');
pruefe(ZINK_1461_GUSS[0].mittel === 80 && ZINK_1461_GUSS[1].oertlich === 60, 'ISO 1461 Tab. 3 Guss');
// 80/20-Regel (ISO 12944-5/-7, ISO 19840): NDFT 240 µm, 10 Messwerte, 2 unter NDFT (20 %), Minimum 200 µm ≥ 192 → erfüllt
const m10 = [250, 260, 245, 240, 230, 200, 255, 270, 248, 262];
const a1 = abnahme8020(m10, 240);
pruefe(a1.erfuellt && a1.anteilUnterNdft === 20 && a1.grenze80 === 192 && a1.minimum === 200, `80/20 erfüllt ${JSON.stringify(a1)}`);
// Grenze: ein Wert unter 80 % (190 < 192) → nicht erfüllt; 3 von 10 unter NDFT (30 %) → nicht erfüllt
pruefe(!abnahme8020(m10.map(w => (w === 200 ? 190 : w)), 240).erfuellt && abnahme8020(m10.map(w => (w === 200 ? 192 : w)), 240).erfuellt, '80-%-Grenze');
pruefe(!abnahme8020([250, 260, 235, 240, 230, 225, 255, 270, 248, 262], 240).erfuellt, '30 % unter NDFT');
pruefe(abnahme8020([], 240).hinweise.some(h => h.stufe === 'fehler') && abnahme8020([200], 0).hinweise.some(h => h.stufe === 'fehler'), 'leere Messreihe / NDFT 0 → Fehler');

if (fehler.length) { for (const x of fehler) console.error(`FAIL: ${x}`); process.exit(1); }
console.log('OK: Korrosionsschutz');
