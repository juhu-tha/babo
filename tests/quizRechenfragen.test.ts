// Rechenfragen im Quiz gegen die Rechenkerne (Gutachten 27.10.2026, Maßnahme 3)
//
// Quizfragen, deren Zahlen deterministisch aus einem Rechenkern in src/calc/* folgen („nach dem Modul“), werden hier
// mit dem Kern nachgerechnet. Jede Prüfung legt fest, welche Option richtig ist und – soweit sinnvoll – wie die
// Distraktoren aus typischen Fehlern entstehen. Neue Fragen ergänzen: Eintrag in PRUEFUNGEN anlegen (Werte immer aus
// dem Kern, nie abgeschrieben); für Module in VOLL_ABGEDECKT muss jede Frage einen Eintrag haben (oder in OHNE_RECHNUNG
// mit Begründung stehen), damit neue Fragen nicht ungeprüft bleiben.
import { QUIZ_QUESTIONS } from '../src/data/quizData';
import { formatDeZahl } from '../src/utils/numberFormat';
import { fdAusFk, phi2, ZETA_MW, GAMMA_M_MW, SCHLANKHEIT_MAX } from '../src/calc/mauerwerk';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
console.log('--- Test: Quiz-Rechenfragen gegen Rechenkerne ---');

interface Pruefung {
  id: string;
  /** Text der richtigen Option, aus dem Kern erzeugt */
  richtig: string;
  /** optional: alle Optionen in Reihenfolge (Distraktoren aus definierten Fehlern) */
  optionen?: string[];
  /** Textstücke, die in der Erklärung vorkommen müssen (z. B. Zwischenergebnisse) */
  erklaerung?: string[];
  /** Textstücke, die in der Frage vorkommen müssen (Eingangswerte) */
  frage?: string[];
}

const z = (x: number, n: number) => formatDeZahl(x, n);
const PRUEFUNGEN: Pruefung[] = [];
const VOLL_ABGEDECKT = new Set<string>();
const OHNE_RECHNUNG: Record<string, string> = {};

// ------------------------------------------------------------------------------------------------
// Mauerwerk (src/calc/mauerwerk.ts): f_d = ζ · f_k/γ_M, Φ2 = 0,85·a/t − 0,0011·(h_ef/t)², N_Rd = Φ · t · f_d
// ------------------------------------------------------------------------------------------------
{
  VOLL_ABGEDECKT.add('rechnung_mauerwerk');
  const fkKS = 5.6, fkHLz = 3.2;
  const fdKS = fdAusFk(fkKS), fdHLz = fdAusFk(fkHLz);
  const ohneZeta = (fk: number) => fdAusFk(fk, 1);
  const phiW = (hEf_m: number, t_mm: number) => phi2(hEf_m * 1000, t_mm, 1);
  const nRd = (phi: number, t_mm: number, fd: number) => phi * t_mm * fd; // N/mm = kN/m
  pruefe(ZETA_MW === 0.85 && GAMMA_M_MW === 1.5, 'Kern: ζ = 0,85 und γ_M = 1,5 erwartet');

  // 1: f_d; Distraktoren: mit γ_M multipliziert, ohne ζ, γ = 1,15 (Betonstahl)
  PRUEFUNGEN.push({
    id: 'qn_rechnung_mauerwerk_1',
    richtig: `f_d = ${z(fdKS, 2)} N/mm²`,
    optionen: [`f_d = ${z(ZETA_MW * fkKS * GAMMA_M_MW, 2)} N/mm²`, `f_d = ${z(ohneZeta(fkKS), 2)} N/mm²`,
      `f_d = ${z(fdAusFk(fkKS, ZETA_MW, 1.15), 2)} N/mm²`, `f_d = ${z(fdKS, 2)} N/mm²`],
    frage: ['f_k = 5,6', 'ζ = 0,85', 'γ_M = 1,5'],
    erklaerung: ['0,85 · 5,6/1,5'],
  });

  // 2: Schlankheit gegen die Grenzschlankheit des Kerns
  const s2 = 2.75 / 0.175;
  PRUEFUNGEN.push({
    id: 'qn_rechnung_mauerwerk_2',
    richtig: `h_ef/t = ${z(s2, 1)} ≤ ${SCHLANKHEIT_MAX}, eingehalten`,
    erklaerung: [z(s2, 2), `höchstens ${SCHLANKHEIT_MAX}`],
  });

  // 3: Φ2 bei a/t = 1
  const p175 = phiW(2.75, 175);
  PRUEFUNGEN.push({ id: 'qn_rechnung_mauerwerk_3', richtig: `Φ = ${z(p175, 3)}` });

  // 4: N_Rd; Distraktoren: ohne Φ, ohne ζ, Faktor 10
  const n4 = nRd(p175, 175, fdKS);
  PRUEFUNGEN.push({
    id: 'qn_rechnung_mauerwerk_4',
    richtig: `N_Rd ≈ ${z(n4, 0)} kN/m`,
    optionen: [`N_Rd ≈ ${z(175 * fdKS, 0)} kN/m`, `N_Rd ≈ ${z(n4, 0)} kN/m`, `N_Rd ≈ ${z(nRd(p175, 175, ohneZeta(fkKS)), 0)} kN/m`,
      `N_Rd ≈ ${z(n4 / 10, 1)} kN/m`],
    frage: [`Φ = ${z(p175, 3)}`, `${z(fdKS, 2)} N/mm²`],
    erklaerung: [`rund ${z((90 / n4) * 100, 0)} %`],
  });

  // 5: schlanke Innenwand – Schlankheit knapp unter der Grenze, Tragfähigkeit nicht erfüllt
  const s5 = 3.0 / 0.115, p5 = phiW(3.0, 115), n5 = nRd(p5, 115, fdKS);
  pruefe(s5 <= SCHLANKHEIT_MAX && 60 / n5 > 1, 'qn_rechnung_mauerwerk_5: Annahme „Schlankheit eingehalten, überlastet“ passt nicht mehr zum Kern');
  PRUEFUNGEN.push({
    id: 'qn_rechnung_mauerwerk_5',
    richtig: `Grenze ${SCHLANKHEIT_MAX} knapp eingehalten, doch mit Φ ≈ ${z(p5, 2)} ist die Wand deutlich überlastet`,
    frage: [`h_ef/t = ${z(s5, 1)}`, `Φ = Φ2 ≈ ${z(p5, 2)}`, `η ≈ ${z(60 / n5, 2)}`],
    erklaerung: [`${z(n5, 1)} kN/m`, `η = ${z(60 / n5, 2)}`],
  });

  // 6: Vergleich KS/HLz; Distraktoren: vertauscht, Dicke nur linear, ohne ζ
  const eta = (n: number) => z(150 / n, 2);
  const ks = nRd(p175, 175, fdKS), h175 = nRd(p175, 175, fdHLz), p240 = phiW(2.75, 240), h240 = nRd(p240, 240, fdHLz);
  const zeile = (a: string, b: string, c: string) => `KS 17,5 cm: η ≈ ${a}; HLz 17,5 cm: η ≈ ${b}; HLz 24 cm: η ≈ ${c}`;
  const oz = (fk: number, phi: number, t: number) => eta(nRd(phi, t, ohneZeta(fk)));
  PRUEFUNGEN.push({
    id: 'qn_rechnung_mauerwerk_6',
    richtig: zeile(eta(ks), eta(h175), eta(h240)),
    optionen: [zeile(eta(ks), eta(h175), eta(h240)), zeile(eta(h175), eta(ks), eta(h240)),
      zeile(eta(ks), eta(h175), eta(h175 * 240 / 175)), zeile(oz(fkKS, p175, 175), oz(fkHLz, p175, 175), oz(fkHLz, p240, 240))],
    erklaerung: [`${z(ks, 0)} kN/m`, `${z(h175, 0)} kN/m`, `${z(h240, 0)} kN/m`, `Φ = ${z(p240, 2)} statt ${z(p175, 2)}`],
  });
}

// ------------------------------------------------------------------------------------------------
// Auswertung
// ------------------------------------------------------------------------------------------------
const byId = new Map(QUIZ_QUESTIONS.map(q => [q.id, q]));
for (const p of PRUEFUNGEN) {
  const q = byId.get(p.id);
  if (!q) { fehler.push(`${p.id}: Frage nicht gefunden`); continue; }
  pruefe(q.options[q.correctIdx] === p.richtig, `${p.id}: richtige Option „${q.options[q.correctIdx]}“, Kern ergibt „${p.richtig}“`);
  if (p.optionen) pruefe(JSON.stringify(q.options) === JSON.stringify(p.optionen), `${p.id}: Optionen ${JSON.stringify(q.options)} ≠ Kern ${JSON.stringify(p.optionen)}`);
  for (const s of p.frage ?? []) pruefe(q.question.includes(s), `${p.id}: Frage enthält „${s}“ nicht`);
  for (const s of p.erklaerung ?? []) pruefe(q.explanation.includes(s), `${p.id}: Erklärung enthält „${s}“ nicht`);
}
const geprueft = new Set(PRUEFUNGEN.map(p => p.id));
for (const q of QUIZ_QUESTIONS) {
  if (VOLL_ABGEDECKT.has(q.moduleId)) {
    pruefe(geprueft.has(q.id) || !!OHNE_RECHNUNG[q.id], `${q.id}: Frage im Modul ${q.moduleId} ohne Kernprüfung – Eintrag in PRUEFUNGEN oder OHNE_RECHNUNG ergänzen`);
  }
}

if (fehler.length) { fehler.forEach(f => console.log('FAIL', f)); process.exit(1); }
console.log(`OK: ${PRUEFUNGEN.length} Rechenfragen gegen Kerne geprüft (${[...VOLL_ABGEDECKT].join(', ')})`);
