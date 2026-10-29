// Nachprüfung 29.10.2026 (AKR-Gefügesimulation, Modul schadreaktionen_beton): Lehrmodell akrGefuege.
// Sollwerte aus eigenem Prüfskript (eigene Umsetzung der Gleichungen in Python), nicht aus dem Kern übernommen.
import { akrGefuege, AKR_FAKTOR_FEUCHTE, AKR_NA_GRENZE_CEM_I, type AkrFeuchte, type AkrKlasseE } from '../src/calc/akrGefuege';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (ist: number, soll: number) => Math.abs(ist - soll) <= Math.max(1e-3, Math.abs(soll) * 0.005);

const faelle: [number, AkrFeuchte, number, AkrKlasseE, boolean, number, number, number, string][] = [
  // Na₂O-Äq., Feuchte, Jahre, Klasse → ausgelöst, p_gel [MPa], w [mm], ε [mm/m], Stufe
  [1.10, 'WS', 8, 'E3', true, 4.6614, 0.3722, 0.8094, 'netzriss'],
  [1.30, 'WA', 20, 'E3', true, 12.15, 2.8, 3.48, 'stark'],
  [0.90, 'WF', 15, 'E2', true, 1.95, 0, 0, 'latenz'],
  [0.60, 'WS', 25, 'E3', false, 0, 0, 0, 'keine'],
  [1.60, 'WS', 25, 'E3', true, 13.5, 2.8, 3.48, 'stark'],
  [1.10, 'WO', 25, 'E3', false, 0, 0, 0, 'keine'],
  [1.10, 'WS', 25, 'E1', false, 0, 0, 0, 'keine'],
  [0.80, 'WF', 10, 'E2', true, 0.8290, 0, 0, 'latenz'],
  [1.00, 'WA', 12, 'E3', true, 5.5563, 0.8589, 1.3448, 'netzriss'],
];

for (const [a, feuchte, t, e, ausgeloest, p, w, eps, stufe] of faelle) {
  const r = akrGefuege(a, feuchte, t, e);
  const fall = `${a}/${feuchte}/${t} a/${e}`;
  pruefe(r.ausgeloest === ausgeloest, `${fall}: ausgelöst ${r.ausgeloest}`);
  pruefe(nahe(r.pGel, p), `${fall}: p_gel ${r.pGel} ≠ ${p}`);
  pruefe(nahe(r.w, w), `${fall}: w ${r.w} ≠ ${w}`);
  pruefe(nahe(r.dehnung, eps), `${fall}: ε ${r.dehnung} ≠ ${eps}`);
  pruefe(r.stufe === stufe, `${fall}: Stufe ${r.stufe} ≠ ${stufe}`);
}

// Alle vier Feuchtigkeitsklassen der Alkali-Richtlinie (WO, WF, WA, WS), Wirkung steigend
const f = Object.values(AKR_FAKTOR_FEUCHTE);
pruefe(Object.keys(AKR_FAKTOR_FEUCHTE).join() === 'WO,WF,WA,WS', 'Feuchtigkeitsklassen WO/WF/WA/WS');
pruefe(f.every((x, i) => i === 0 || x > f[i - 1]), 'Feuchtefaktoren steigend');

// Auslöseschwelle = NA-Grenze CEM I
pruefe(AKR_NA_GRENZE_CEM_I === 0.60, 'NA-Grenze CEM I 0,60 M.-%');
pruefe(!akrGefuege(0.60, 'WS', 25, 'E3').ausgeloest && akrGefuege(0.65, 'WS', 25, 'E3').ausgeloest, 'Schwelle > 0,60');

if (fehler.length) { for (const x of fehler) console.error(`FAIL: ${x}`); process.exit(1); }
console.log(`OK: AKR-Gefügesimulation (${faelle.length} Fälle)`);
