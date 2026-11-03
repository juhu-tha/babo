// Bohrkernserie nach DIN EN 13791:2020-02 im Modul „Historische Kennwerte“ (Ergänzung 02.11.2026,
// docs/pruefung/hist-kennwerte-13791-2026-11-02.md): Kern src/calc/bohrkernserie13791.ts, Lehrbeispiele, Grenzfälle
// und Konsistenz mit den bestehenden Kernen insituDruckfestigkeit13791 (bauwerksuntersuchung.ts) und fckIs13791 (schadensKern.ts).
import {
  bohrkernserie13791, mindestanzahl13791, LEHRBEISPIELE_13791, KERNLAENGENFAKTOR_11, V_MIN_13791, SPANNWEITE_MAX_KLEIN,
  type BohrkernserieEingabe,
} from '../src/calc/bohrkernserie13791';
import { insituDruckfestigkeit13791, klasseAusInsitu13791 } from '../src/calc/bauwerksuntersuchung';
import { fckIs13791, kn13791 } from '../src/utils/schadensKern';
import inhalt from '../content/historischematerialkennwerte/BohrkernserieTab.json';
import quiz from '../src/data/quiz.json';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (a: number, b: number, tol = 1e-9) => Math.abs(a - b) <= tol;
console.log('--- Test: Bohrkernserie DIN EN 13791 (Historische Kennwerte) ---');

const B: BohrkernserieEingabe = { werte: [], ansatz: 'kerne', bezug: 'zylinder', durchmesserMm: 100, groesstkornMm: 32, volumenM3: 50, mindestStreuung: true };
const lauf = (x: Partial<BohrkernserieEingabe>) => bohrkernserie13791({ ...B, ...x });
const bsp = (id: string) => LEHRBEISPIELE_13791.find(b => b.id === id)!.eingabe;

// 1. Konstanten (Sekundärquellen, vorläufig)
pruefe(KERNLAENGENFAKTOR_11 === 0.82 && V_MIN_13791 === 0.08 && SPANNWEITE_MAX_KLEIN === 0.15, 'Konstanten 0,82 / 0,08 / 0,15');
pruefe(mindestanzahl13791('kerne', 100) === 8 && mindestanzahl13791('kerne', 75) === 8 && mindestanzahl13791('kerne', 74) === 12 && mindestanzahl13791('kerne', 50) === 12, 'Mindestanzahl 8 / 12');
pruefe(mindestanzahl13791('kleinerBereich', 100) === 3 && mindestanzahl13791('indirektKerne', 100) === 3, 'Mindestanzahl kleine Prüfbereiche 3');
pruefe(Number.isNaN(mindestanzahl13791('kerne', 40)) && Number.isNaN(mindestanzahl13791('kerne', NaN)), 'Ø < 50 mm → keine Mindestanzahl');

// 2. Lehrbeispiel 1 (B 225, 10 Kerne h/d = 2): Handrechnung
{
  const r = bohrkernserie13791(bsp('b225_decke'));
  pruefe(r.gueltig && r.n === 10 && nahe(r.mittel, 18.65), `B1 Mittelwert 18,65 (${r.mittel})`);
  pruefe(nahe(r.s, 1.9625663470738, 1e-9) && nahe(r.sEff, r.s), `B1 s = 1,963, Untergrenze greift nicht (${r.s})`);
  pruefe(r.kn === 1.92 && r.M === 2, 'B1 k_n = 1,92, M = 2 (Kleinstwert 15,9)');
  pruefe(nahe(r.fckIs, 18.65 - 1.92 * r.s) && nahe(r.fckIs, 14.8819, 1e-4) && nahe(r.ausKleinstwert, 17.9), `B1 f_ck,is = 14,88 (${r.fckIs})`);
  pruefe(r.klasse === 'C16/20' && r.fckVergleich === 16 && r.naechsteKlasse === 'C20/25' && nahe(r.naechsteGrenze, 17), `B1 Klasse C16/20, nächste ab 17,0 (${r.klasse})`);
  pruefe(r.massgebend === 'streuung' && nahe(r.verhaeltnis, r.fckIs / 16), 'B1 maßgebend Streuung, Verhältnis');
  // Nur über den Mittelwert hätte man C20/25 erhalten (Text im Lehrbeispiel)
  pruefe(klasseAusInsitu13791(18.65, 'zylinder').klasse === 'C20/25', 'B1 Mittelwert allein → C20/25');
}
// 3. Lehrbeispiel 2 (B 300, 8 Kerne h/d = 1): beide Lesarten (NS-BD-3) und Mindeststandardabweichung (T15-BS-5)
{
  const e = bsp('b300_unterzug');
  const w = bohrkernserie13791(e);
  pruefe(w.gueltig && nahe(w.mittel, 28.8125) && nahe(w.sEff, 2.305) && w.s < w.sMin, `B2 Würfel: s_an = 0,08 · 28,81 = 2,305 (${w.sEff})`);
  pruefe(nahe(w.fckIs, 24.2025) && w.klasse === 'C20/25' && w.fckVergleich === 25, `B2 Würfel: f_ck,is 24,2 → C20/25 (${w.fckIs}, ${w.klasse})`);
  pruefe(nahe(w.fckIsOhneMindest, 28.8125 - 2 * w.s) && klasseAusInsitu13791(w.fckIsOhneMindest, 'wuerfel').klasse === 'C25/30', 'B2 Würfel ohne Untergrenze: 27,1 → C25/30');
  pruefe(w.hinweise.some(h => h.feld === 'mindestStreuung'), 'B2: Hinweis Untergrenze angesetzt');
  const z = bohrkernserie13791({ ...e, bezug: 'kern11' });
  pruefe(z.werteBezug.every((v, i) => nahe(v, e.werte[i] * 0.82)) && nahe(z.mittel, 28.8125 * 0.82), 'B2 1:1 → 2:1 mit 0,82');
  pruefe(nahe(z.fckIs, 23.62625 - 2 * 0.08 * 23.62625) && z.klasse === 'C20/25', `B2 umgerechnet: 19,8 → C20/25 (${z.fckIs})`);
  const z0 = bohrkernserie13791({ ...e, bezug: 'kern11', mindestStreuung: false });
  pruefe(z0.klasse === 'C25/30' && nahe(z0.fckIs, z.fckIsOhneMindest), 'B2 umgerechnet ohne Untergrenze → C25/30');
  const w0 = bohrkernserie13791({ ...e, mindestStreuung: false });
  pruefe(w0.klasse === 'C25/30' && !w0.hinweise.some(h => h.feld === 'mindestStreuung'), 'B2 Würfel ohne Untergrenze → C25/30, kein Hinweis');
}
// 4. Lehrbeispiel-Texte stimmen mit dem Kern (gerundete Zahlen im Text)
{
  const t1 = inhalt.daten.beispiele.find(b => b.id === 'b225_decke')!.text;
  const t2 = inhalt.daten.beispiele.find(b => b.id === 'b300_unterzug')!.text;
  for (const s of ['18{,}65', '1{,}96', '14{,}88', 'C16/20', '17,0']) pruefe(t1.includes(s), `Text Beispiel 1 enthält ${s}`);
  for (const s of ['28{,}81', '2{,}31', '24{,}2', '27,1', '23{,}63', '19{,}8', '22,2', 'C20/25', 'C25/30']) pruefe(t2.includes(s), `Text Beispiel 2 enthält ${s}`);
  pruefe(LEHRBEISPIELE_13791.every(b => inhalt.daten.beispiele.some(x => x.id === b.id)), 'jedes Lehrbeispiel hat einen Text');
}

// 5. Konsistenz mit den bestehenden Kernen (ohne Untergrenze identisch)
{
  let zufall = 7;
  const rnd = () => { zufall = (zufall * 16807) % 2147483647; return zufall / 2147483647; };
  for (let fall = 0; fall < 60; fall++) {
    const n = 8 + Math.floor(rnd() * 23);
    const werte = Array.from({ length: n }, () => Math.round((15 + rnd() * 25) * 10) / 10);
    for (const bezug of ['zylinder', 'wuerfel'] as const) {
      const r = lauf({ werte, bezug, mindestStreuung: false });
      const m = werte.reduce((a, b) => a + b, 0) / n;
      const s = Math.sqrt(werte.reduce((a, b) => a + (b - m) ** 2, 0) / (n - 1));
      const alt = insituDruckfestigkeit13791({ n, mittel: m, s, kleinster: Math.min(...werte), bezug });
      pruefe(r.gueltig && alt.gueltig && nahe(r.fckIs, alt.fckIs, 1e-9) && r.klasse === alt.klasse && r.kn === alt.kn && r.M === alt.M, `Konsistenz insitu n = ${n} ${bezug}`);
      const sk = fckIs13791(werte);
      pruefe(nahe(r.fckIs, sk.fckIs, 1e-9) && nahe(r.kn, sk.kn), `Konsistenz schadensKern n = ${n}`);
      const mit = lauf({ werte, bezug, mindestStreuung: true });
      pruefe(mit.fckIs <= r.fckIs + 1e-12 && nahe(mit.sEff, Math.max(s, 0.08 * m)), `Untergrenze nie günstiger n = ${n}`);
    }
  }
  // k_n zwischen den Stützstellen aus kn13791 (in 1/n interpoliert)
  const r9 = lauf({ werte: [20, 21, 22, 23, 24, 25, 26, 27, 28] });
  pruefe(nahe(r9.kn, kn13791(9)) && r9.kn < 2 && r9.kn > 1.92, `k_n(9) zwischen 2,00 und 1,92 (${r9.kn})`);
}

// 6. Grenzfälle: ungültig → keine Zahl, Klasse „–“
const ohneZahl = (r: ReturnType<typeof lauf>) => !r.gueltig && Number.isNaN(r.fckIs) && Number.isNaN(r.mittel) && r.klasse === '–' && r.naechsteKlasse === '–' && r.massgebend === '–';
{
  const sieben = lauf({ werte: [20, 21, 22, 23, 24, 25, 26] });
  pruefe(ohneZahl(sieben) && sieben.hinweise.some(h => h.stufe === 'fehler' && h.feld === 'n' && h.text.includes('mindestens 8')), 'n = 7 nur Kerne → kein Ergebnis mit Hinweis');
  pruefe(ohneZahl(lauf({ werte: [] })), 'keine Werte → kein Ergebnis');
  pruefe(ohneZahl(lauf({ werte: [20, 21, NaN, 23, 24, 25, 26, 27] })), 'nicht lesbarer Wert → kein Ergebnis (nicht still verworfen)');
  pruefe(ohneZahl(lauf({ werte: [20, 21, -1, 23, 24, 25, 26, 27] })), 'negativer Wert → kein Ergebnis');
  pruefe(ohneZahl(lauf({ werte: [20, 21, 22, 23, 24, 25, 26, 27], durchmesserMm: 40 })), 'Ø 40 mm → kein Ergebnis');
  pruefe(ohneZahl(lauf({ werte: [20, 21, 22, 23, 24, 25, 26, 27], groesstkornMm: 0 })), 'Größtkorn 0 → kein Ergebnis');
  pruefe(ohneZahl(lauf({ werte: [20, 21, 22, 23, 24, 25, 26, 27], volumenM3: Infinity })), 'Volumen ∞ → kein Ergebnis');
  // 50 ≤ Ø < 75 mm: 10 Kerne → Ergebnis mit Warnung „unter der Mindestanzahl 12“
  const klein = lauf({ werte: [20, 21, 22, 23, 24, 25, 26, 27, 28, 29], durchmesserMm: 60, groesstkornMm: 16 });
  pruefe(klein.gueltig && klein.nMin === 12 && klein.hinweise.some(h => h.stufe === 'warnung' && h.text.includes('mindestens 12')), 'Ø 60 mm, n = 10 → Warnung Mindestanzahl 12');
  pruefe(lauf({ werte: [20, 21, 22, 23, 24, 25, 26, 27], durchmesserMm: 75, groesstkornMm: 32 }).hinweise.some(h => h.text.includes('Dreifache')), 'Ø < 3 · D_max → Warnung');
  pruefe(lauf({ werte: Array.from({ length: 10 }, (_, i) => 20 + i) }).hinweise.every(h => !h.text.includes('Empfehlung')), 'n = 10 ≥ 8 + 2: keine Reserve-Empfehlung');
  // Klassengrenze: genau 0,85 · 25 = 21,25 → C25/30; unter 0,85 · 8 → keine Klasse
  const g = lauf({ ansatz: 'kleinerBereich', werte: [21.25, 22, 23], volumenM3: 8 });
  pruefe(g.gueltig && nahe(g.fckIs, 21.25) && g.klasse === 'C25/30' && nahe(g.verhaeltnis, 0.85), 'Grenze 21,25 → C25/30, Verhältnis 0,85');
  const tief = lauf({ ansatz: 'kleinerBereich', werte: [6.0, 6.3, 6.5], volumenM3: 8 });
  pruefe(tief.gueltig && tief.klasse === null && tief.naechsteKlasse === 'C8/10' && nahe(tief.naechsteGrenze, 6.8) && tief.hinweise.some(h => h.feld === 'klasse'), 'unter 6,8 → keine Klasse, nächste C8/10');
}
// 7. Kleine Prüfbereiche
{
  const k = lauf({ ansatz: 'kleinerBereich', werte: [22.1, 23.4, 24.0], volumenM3: 8 });
  pruefe(k.gueltig && k.fckIs === 22.1 && k.massgebend === 'kleinstwertBereich' && k.klasse === 'C25/30' && Number.isNaN(k.kn), `kleiner Bereich: Kleinstwert 22,1 → C25/30 (${k.klasse})`);
  pruefe(k.hinweise.some(h => h.text.includes('A20')), 'kleiner Bereich: Hinweis auf A20 (vorläufig)');
  const i = lauf({ ansatz: 'indirektKerne', werte: [22.1, 23.4, 24.0], volumenM3: 25 });
  pruefe(i.gueltig && nahe(i.fckIs, 69.5 / 3) && i.massgebend === 'mittelBereich', 'Ansatz B: Mittelwert der Kerne');
  pruefe(ohneZahl(lauf({ ansatz: 'kleinerBereich', werte: [22.1, 23.4, 24.0], volumenM3: 12 })), 'kleiner Bereich > 10 m³ → kein Ergebnis');
  pruefe(lauf({ ansatz: 'indirektKerne', werte: [22.1, 23.4, 24.0], volumenM3: 30 }).gueltig, 'Ansatz B genau 30 m³ zulässig');
  pruefe(ohneZahl(lauf({ ansatz: 'indirektKerne', werte: [22.1, 23.4, 24.0], volumenM3: 31 })), 'Ansatz B > 30 m³ → kein Ergebnis');
  pruefe(ohneZahl(lauf({ ansatz: 'kleinerBereich', werte: [22, 24], volumenM3: 8 })), 'kleiner Bereich mit 2 Kernen → kein Ergebnis');
  // Spannweite 15 %: 20 / 23 → R = 3, Mittel 21,5 → 14,0 % zulässig; 20 / 23,5 → 16,1 % nicht
  pruefe(lauf({ ansatz: 'kleinerBereich', werte: [20, 21.5, 23], volumenM3: 8 }).gueltig, 'Spannweite 14,0 % zulässig');
  const weit = lauf({ ansatz: 'kleinerBereich', werte: [20, 21.75, 23.5], volumenM3: 8 });
  pruefe(ohneZahl(weit) && weit.hinweise.some(h => h.text.includes('15 %')), 'Spannweite 16,1 % → kein Ergebnis mit Hinweis');
  pruefe(lauf({ ansatz: 'kleinerBereich', werte: [22.1, 23.4, 24.0], volumenM3: 8, durchmesserMm: 60, groesstkornMm: 16 }).hinweise.some(h => h.text.includes('75 mm')), 'kleiner Bereich Ø < 75 mm → Warnung');
}

// 8. Quizfragen des Reiters: nachgerechnet, nicht freigegeben
{
  const fr = (quiz as { id: string; verified: boolean; options: string[]; correctIdx: number }[]).filter(q => q.id.startsWith('qt_hk13791_'));
  pruefe(fr.length === 4 && fr.every(q => q.verified === false), 'vier neue Quizfragen, verified: false');
  const q2 = fr.find(q => q.id === 'qt_hk13791_2')!;
  const r = insituDruckfestigkeit13791({ n: 10, mittel: 30, s: Math.max(3, 0.08 * 30), kleinster: 26, bezug: 'zylinder' });
  pruefe(q2.options[q2.correctIdx] === '24,2 N/mm²' && nahe(r.fckIs, 24.24), `Quiz 2: 24,2 N/mm² (${r.fckIs})`);
  const q4 = fr.find(q => q.id === 'qt_hk13791_4')!;
  pruefe(q4.options[q4.correctIdx] === klasseAusInsitu13791(22, 'zylinder').klasse, 'Quiz 4: Klasse aus dem Kern');
}

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log('OK: Bohrkernserie DIN EN 13791');
