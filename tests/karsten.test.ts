// Rechenkern Karsten-Röhrchen (Runde 5): einheitliche Prüffläche und Einstufung nach DIN 4108-3 für ZfP und Bauwerksuntersuchung
import { KARSTEN_FLAECHE_CM2, W_GRENZEN_4108_3, wWertAusKarsten, saugKlasse, karstenAuswertung } from '../src/calc/karsten';
import { karstenZfp } from '../src/calc/pruefverfahren';
import { karsten } from '../src/calc/bauwerksuntersuchung';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (ist: number, soll: number, tol: number) => Math.abs(ist - soll) <= tol * Math.max(1, Math.abs(soll));
console.log('--- Test: Karsten-Röhrchen ---');

// 1. Handrechnung: w = Δm/(A·√t) (Definition wie DIN EN ISO 15148). 1,0 ml in 60 min auf 5,73 cm²:
//    w = 0,001 kg / (5,73·10⁻⁴ m² · 1 √h) = 1,745 kg/(m²·√h) → wasserhemmend (0,5 < w ≤ 2,0)
//    Prüffläche 5,73 cm² nach core.ac.uk/download/55871097.pdf, Abschn. 2.2.2 (Glockenfläche des Karsten-Röhrchens)
pruefe(KARSTEN_FLAECHE_CM2 === 5.73 && nahe(wWertAusKarsten(1.0, 1), 1.74520, 1e-5), `w(1 ml, 1 h) = ${wWertAusKarsten(1.0, 1)}`);
pruefe(saugKlasse(1.745) === 'wasserhemmend', 'Einstufung wasserhemmend');
// √t-Gesetz: viermal so lange → doppelte Wassermenge bei gleichem w
pruefe(nahe(wWertAusKarsten(2.0, 4), wWertAusKarsten(1.0, 1), 1e-12), '√t-Gesetz');
// eigene Prüffläche (gemessene Benetzungsfläche) wird berücksichtigt
pruefe(nahe(wWertAusKarsten(1.0, 1, 4.91), 10 / 4.91, 1e-12), 'Prüffläche als Parameter');

// 2. Grenzen nach DIN 4108-3 (öffentlich: baunetzwissen.de, „Regenschutz im Hochbau nach DIN 4108-3“: wasserabweisend w ≤ 0,5)
pruefe(W_GRENZEN_4108_3.abweisend === 0.5 && W_GRENZEN_4108_3.hemmend === 2.0, 'Grenzwerte');
pruefe(saugKlasse(0.5) === 'wasserabweisend' && saugKlasse(0.5001) === 'wasserhemmend' && saugKlasse(2.0) === 'wasserhemmend' && saugKlasse(2.0001) === 'wassersaugend', 'Klassengrenzen einschließlich');

// 3. Einheitlich: ZfP (beliebige Zeit) und Bauwerksuntersuchung (60 min) liefern bei gleicher Messung denselben w-Wert
for (const v of [0.1, 0.3, 1.0, 1.5, 4.0]) {
  const a = karstenZfp(60, v), b = karsten(v);
  const stufe = { wasserabweisend: 'abweisend', wasserhemmend: 'hemmend', wassersaugend: 'saugend' }[b.klasse];
  pruefe(nahe(a.w, b.w, 1e-12) && a.stufe === stufe, `ZfP und Bauwerksuntersuchung gleich bei ${v} ml: ${a.w}/${b.w} ${a.stufe}/${b.klasse}`);
}

// 4. Randfälle
pruefe(karstenAuswertung(1, 0).hinweise.some(h => h.stufe === 'fehler') && karstenAuswertung(-1, 10).hinweise.some(h => h.stufe === 'fehler'), 't = 0 / V < 0 → Fehler');
pruefe(karstenAuswertung(0, 10).w === 0 && karstenAuswertung(0, 10).klasse === 'wasserabweisend', 'V = 0 → w = 0');

// 5. Fuzz
let seed = 7;
const z = (a: number, c: number) => { seed = (seed * 1103515245 + 12345) % 2147483648; return a + (c - a) * (seed / 2147483648); };
for (let i = 0; i < 1000; i++) {
  const r = karstenAuswertung(z(-1, 10), z(-5, 120), z(-1, 10));
  if (!Number.isFinite(r.w) || !Number.isFinite(r.tHours)) { pruefe(false, `Fuzz ${i}`); break; }
}

if (fehler.length) { for (const x of fehler) console.error(`FAIL: ${x}`); process.exit(1); }
console.log('OK: Karsten-Röhrchen');
