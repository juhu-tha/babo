// f_cd zentral (src/data/kennwerte.ts → fcdBeton, FCD_MODUL): die Lehrmodule, die f_cd früher selbst als
// 0,85·f_ck/1,5 gerechnet haben, liefern nach der Umstellung je Modul über den ganzen Eingabebereich dieselben Werte.
import fs from 'fs';
import { fcdBeton, FCD_MODUL, BETON_EC2 } from '../src/data/kennwerte';
import { EC2_CONCRETE_CLASSES } from '../src/modules/betonkennwerte/daten';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
console.log('--- Test: f_cd in den Modulen (vorher = nachher) ---');

const bereich = (von: number, bis: number, schritt: number) => Array.from({ length: Math.round((bis - von) / schritt) + 1 }, (_, i) => von + i * schritt);
const gleich = (a: number, b: number) => a === b || Math.abs(a - b) <= 1e-12 * Math.max(1, Math.abs(b));
const fckKlassen = [...new Set([...Object.values(BETON_EC2), ...EC2_CONCRETE_CLASSES].map(c => c.fck))];

/** Modul → (alte Formel, neue Formel, Eingabebereich) */
const FAELLE: { modul: keyof typeof FCD_MODUL; datei: string; alt: (fck: number) => number; werte: number[]; runden?: number }[] = [
  { modul: 'beispielrechnungen', datei: 'src/modules/Beispielrechnungen.tsx', alt: f => 0.85 * f / 1.5, werte: [20, 25, 30] },
  { modul: 'beispielBestand', datei: 'src/modules/Beispielrechnungen.tsx', alt: f => 0.85 * (f / 1.5), werte: [...bereich(0, 60, 0.1), 8, 12, 16, 20, 25, 30] },
  { modul: 'stahlbetonNullBisHundert', datei: 'src/modules/stahlbeton/StahlbetonNullBisHundert.tsx', alt: f => (0.85 * f) / 1.5, werte: [20, 25, 30, 35, 40, 50] },
  { modul: 'betonkennwerteTabelle', datei: 'src/modules/betonkennwerte/TabelleTab.tsx', alt: f => (0.85 * f) / 1.50, werte: fckKlassen },
  { modul: 'spannbetonKennwerte', datei: 'src/modules/spannbeton/SpannbetonKennwerte.tsx', alt: f => Number((0.85 * f / 1.5).toFixed(1)), werte: [...fckKlassen, ...bereich(0, 100, 0.1)], runden: 1 },
  { modul: 'carbonbeton', datei: 'src/calc/carbonbeton.ts', alt: f => (0.85 * f) / 1.5, werte: bereich(30, 100, 5) },
  { modul: 'interpretationNavigator', datei: 'src/modules/bauwerksuntersuchung/InterpretationNavigator.tsx', alt: f => (0.85 * f) / 1.5, werte: bereich(10, 50, 1) },
  { modul: 'historischStandard', datei: 'src/modules/HistorischeMaterialkennwerte.tsx', alt: f => (0.85 * f) / 1.5, werte: bereich(0, 120, 0.25) },
  { modul: 'historischBewertung', datei: 'src/modules/HistorischeMaterialkennwerte.tsx', alt: f => (0.85 * f) / 1.35, werte: bereich(0, 120, 0.25) },
];

for (const fall of FAELLE) {
  const opt = FCD_MODUL[fall.modul];
  let n = 0;
  for (const fck of fall.werte) {
    const roh = fcdBeton(fck, opt);
    const neu = fall.runden !== undefined ? Number(roh.toFixed(fall.runden)) : roh;
    const alt = fall.alt(fck);
    if (!gleich(neu, alt)) { pruefe(false, `${fall.modul}: f_ck = ${fck} → vorher ${alt}, nachher ${neu}`); if (++n > 3) break; }
  }
  // Quelltext: Modul nutzt die zentrale Funktion mit seinem Eintrag und rechnet f_cd nicht mehr selbst
  const src = fs.readFileSync(fall.datei, 'utf8');
  pruefe(src.includes(`FCD_MODUL.${fall.modul}`), `${fall.datei}: FCD_MODUL.${fall.modul} wird nicht verwendet`);
  pruefe(!/0\.85\s*\*\s*\(?\s*[\w.]*f_?c[kK]|\(\s*alphaCc\s*\*\s*\w+\s*\)\s*\/\s*gammaC/.test(src), `${fall.datei}: rechnet f_cd noch selbst (0,85·f_ck/γ_c)`);
}

// jeder FCD_MODUL-Eintrag ist abgedeckt
for (const k of Object.keys(FCD_MODUL)) pruefe(FAELLE.some(f => f.modul === k), `FCD_MODUL.${k} ohne Vorher/Nachher-Test`);
// Bestandsbewertung bewusst mit γ_c = 1,35, nicht mit dem Standard 1,5
pruefe(FCD_MODUL.historischBewertung.gammaC === 1.35, 'historischBewertung: γ_c = 1,35 erwartet');
// Module mit Bereich ≥ C55/67 rechnen ohne Hochfest-Abminderung (bisheriger Stand, Prüfpunkt F-Freigabe)
for (const k of ['betonkennwerteTabelle', 'spannbetonKennwerte', 'carbonbeton'] as const) {
  pruefe(gleich(fcdBeton(70, FCD_MODUL[k]), 0.85 * 70 / 1.5), `${k}: f_cd(C70/85) weicht von 0,85·70/1,5 ab`);
}

if (fehler.length) {
  for (const f of fehler) console.error(`FAIL: ${f}`);
  process.exit(1);
}
console.log(`OK: ${FAELLE.length} Modulfälle, f_cd vorher = nachher`);
