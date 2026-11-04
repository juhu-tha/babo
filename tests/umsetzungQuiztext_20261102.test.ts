// Umsetzung 02.11.2026: Entscheidungen zum Quiz-Text-Abgleich (docs/pruefung/quiz-text-abgleich-2026-11-02.md,
// Abschnitt „Umsetzung 02.11.2026“) und zu den Hinweisen aus docs/pruefung/module-tranche-16.md (Heft 555, VDI 6205).
// Der Ausziehwiderstand wird hier unabhängig vom Modul nachgerechnet (Gl. (8.39) und Gl. (8.40a) mit deklariertem f_ax,k).
import quiz from '../src/data/quiz.json';
import grundlagen from '../content/grundlagen/Grundlagen.json';
import sonderbetone from '../content/sonderbetone/Sonderbetone.json';
import nachhaltigkeit from '../content/nachhaltigkeitchecklisten/NachhaltigkeitChecklisten.json';
import { holzschraube } from '../src/calc/holzbau';
import { analysiere } from '../scripts/qa/quiz-text-abgleich.mjs';
import { readFileSync } from 'node:fs';

const fehler: string[] = [];
const gilt = (ok: boolean, fall: string) => { if (!ok) fehler.push(fall); };
const nahe = (ist: number, soll: number, tol: number) => Math.abs(ist - soll) <= tol;
const VORL = 'vorläufig, Normprüfung ausstehend';

console.log('--- Test: Umsetzung Quiz-Text-Abgleich (02.11.2026) ---');

type Frage = { id: string; question: string; options: string[]; correctIdx: number; explanation: string; normRef?: string; verified: boolean;
  reviewer?: string; reviewedAt?: string; gapAnalysis?: { actionableAdvice?: string }; vorpruefung?: { am: string; ergebnis: string; hinweis?: string } };
const fragen = quiz as unknown as Frage[];
const frage = (id: string) => fragen.find(q => q.id === id)!;
const gesperrt = (q: Frage) => !q.verified && !q.reviewer && !q.reviewedAt && q.vorpruefung?.am === '2026-11-02'
  && /Umsetzung 02\.11\.: /.test(q.vorpruefung.hinweis ?? '');

// 1. qn_grundlagen_2: Quiz und Modultext tragen den Vorbehalt, Inhalt und Rechnung unverändert
const mk = frage('qn_grundlagen_2');
gilt(gesperrt(mk) && mk.vorpruefung!.ergebnis === 'fraglich', 'qn_grundlagen_2: nicht mit Vermerk vom 02.11. gesperrt');
gilt(mk.explanation.includes(VORL) && (mk.normRef ?? '').includes(VORL), 'qn_grundlagen_2: Vorbehalt fehlt in Erklärung oder normRef');
gilt(mk.options[mk.correctIdx] === '430 kg/m³' && nahe(400 + (330 - 300) / (350 - 300) * 50, 430, 1e-9), 'qn_grundlagen_2: Antwort oder Interpolation geändert');
const mkModul = (grundlagen as { texte: Record<string, string> }).texte.zwischenwerteWerdenLinearInterpoliert;
gilt(mkModul.includes('DIN 1045-2:2008-08') && mkModul.includes(`erweiterte Erstprüfung (Angaben zur Ausgabe DIN 1045-2:2023-08 ${VORL})`),
  'Modul Ausgangsstoffe: Angaben zur Ausgabe 2023-08 nicht als vorläufig gekennzeichnet');

// 2. qn_holzbau_verbindung_4: Erklärung nennt beide Rechenwege, Antwort bleibt 10,4 kN
const hv = frage('qn_holzbau_verbindung_4');
gilt(gesperrt(hv), 'qn_holzbau_verbindung_4: nicht mit Vermerk vom 02.11. gesperrt');
gilt(hv.options[hv.correctIdx] === 'rund 10,4 kN', 'qn_holzbau_verbindung_4: Antwort geändert');
const f840a = 12 * (385 / 350) ** 0.8 * 8 * 100;                  // Gl. (8.40a), k_α = 1, deklariertes f_ax,k
const fax839 = 0.52 * 8 ** -0.5 * 100 ** -0.1 * 385 ** 0.8;       // Gl. (8.39)
gilt(nahe(f840a, 10_360, 5) && nahe(fax839, 13.58, 0.01) && nahe(fax839 * 8 * 100, 10_862, 5), 'Nachrechnung Ausziehwiderstand');
const kern = holzschraube({ rhok: 385, d: 8, lef: 100, alpha: 90, n: 1, nkl: 1, kled: 'mtl' });
gilt(nahe(kern.F_ax_Rk_single_N, fax839 * 8 * 100, 1e-6), 'Modulkern rechnet nicht mit Gl. (8.39)');
gilt(/Gl\. \(8\.40a\)/.test(hv.explanation) && /Gl\. \(8\.39\)/.test(hv.explanation) && hv.explanation.includes('13,6 N/mm²')
  && hv.explanation.includes('10,9 kN') && hv.explanation.includes('10,4 kN'), 'qn_holzbau_verbindung_4: Erklärung ohne Vergleich der Rechenwege');

// 3. Lernhilfen: kein Verweis auf einen „Abschnitt“, dessen Name im Modultext fehlt (Ratsche, Art A des Prüfskripts);
//    die Wortänderung „Abschnitt“ → „Thema“ hebt keine Freigabe auf
const { erg } = await analysiere();
const artA = erg.flatMap(e => e.treffer.filter((t: { art: string }) => t.art === 'A').map(() => e.id));
gilt(artA.length === 0, `Lernhilfe verweist auf nicht vorhandenen Abschnitt: ${[...new Set(artA)].slice(0, 10).join(', ')}`);
const thema = fragen.filter(q => /das Thema „/.test(q.gapAnalysis?.actionableAdvice ?? ''));
gilt(thema.length >= 232, `nur ${thema.length} Lernhilfen mit „das Thema „…““`);
// 217: q_ndr_2 ist seit der Rechtsquellen-Prüfung 03.11.2026 wegen einer berichtigten Rückmeldung (§ 650o BGB) zurückgesetzt
gilt(thema.filter(q => q.verified).length >= 217, 'Wortänderung „Thema“ hat Freigaben aufgehoben');
gilt(fragen.filter(q => /den Abschnitt „/.test(q.gapAnalysis?.actionableAdvice ?? '')).length >= 800, 'Abschnittsverweise mit vorhandenem Namen wurden mit geändert');

// 4. Tranche 16, weitere Hinweise: Heft 555 (WU-Richtlinie) nicht als Quelle für massige Bauteile; VDI 6210 statt 6205
const sb = JSON.stringify(sonderbetone);
gilt(!sb.includes('Heft 555') && sb.includes('DAfStb-Richtlinie Massige Bauteile aus Beton (Ausgabe April 2010)'), 'Sonderbetone: Quelle ΔT_Kern-Rand');
const nc = (nachhaltigkeit as { werte: Record<string, string> }).werte;
gilt(nc.vdi6210Rückbaubarkeit === 'VDI 6210 / Rückbaubarkeit' && !JSON.stringify(nachhaltigkeit).includes('VDI 6205'), 'Nachhaltigkeits-Checkliste: VDI 6210');
gilt(readFileSync('src/modules/NachhaltigkeitChecklisten.tsx', 'utf8').includes('inhalt.werte.vdi6210Rückbaubarkeit'), 'Checkliste nutzt den neuen Schlüssel');

if (fehler.length) {
  for (const f of fehler) console.error(`FAIL: ${f}`);
  process.exit(1);
}
console.log(`OK: Umsetzung Quiz-Text-Abgleich 02.11.2026 (${thema.length} Lernhilfen „Thema“)`);
