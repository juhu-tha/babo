/**
 * Luftschalldämmung einschaliger, biegesteifer massiver Bauteile nach DIN 4109-32:2016-07, Gl. (2):
 * R_w = 30,9·lg(m'/m'₀) − 22,2 dB mit m'₀ = 1 kg/m², gültig für 65 ≤ m' ≤ 720 kg/m².
 * Trittschall nach DIN 4109-2 (Z24) siehe unten.
 * Reiner Rechenkern – geprüft in tests/schall.test.ts.
 */
import { type Hinweis, istEndlich, muss, bereich, hatFehler } from './plausibilitaet';
import { formatDeZahl } from '../utils/numberFormat';

export interface MasseSchicht { name?: string; d: number; density: number } // d [m], ρ [kg/m³]

export const rwMassiv = (mStrich: number) => 30.9 * Math.log10(mStrich) - 22.2;

export function schalldaemmung(schichten: readonly MasseSchicht[]) {
  const hinweise: Hinweis[] = [];
  if (!schichten.length) hinweise.push({ stufe: 'fehler', feld: 'schichten', text: 'Mindestens eine Schicht ist erforderlich.' });
  schichten.forEach((s, i) => {
    const n = s.name ?? `Schicht ${i + 1}`;
    if (!istEndlich(s.d, s.density) || s.d <= 0 || s.density <= 0) hinweise.push({ stufe: 'fehler', feld: `schicht${i}`, text: `${n}: Dicke und Rohdichte müssen größer als 0 sein.` });
  });
  if (hinweise.some(x => x.stufe === 'fehler')) return { mStrich: NaN, Rw: NaN, gueltig: false, hinweise };
  const mStrich = schichten.reduce((a, s) => a + s.d * s.density, 0);
  const Rw = rwMassiv(mStrich);
  if (mStrich < 65 || mStrich > 720) hinweise.push({ stufe: 'warnung', feld: 'm', text: `m' = ${Math.round(mStrich)} kg/m² liegt außerhalb des Gültigkeitsbereichs 65–720 kg/m² der Gleichung (DIN 4109-32).` });
  const weich = schichten.filter(s => s.density < 300 && s.d >= 0.02);
  if (weich.length) hinweise.push({ stufe: 'warnung', feld: 'aufbau', text: 'Der Aufbau enthält leichte Dämm- oder Holzschichten: Die Massekurve gilt nur für einschalige, biegesteife Bauteile. Vorsatzschalen, WDVS und Holzbau verändern R_w (Resonanz, Korrekturwerte ΔR_w nach DIN 4109-34) – Ergebnis nur als Orientierung.' });
  return { mStrich, Rw, gueltig: true, hinweise };
}

/* ────────────────────────────────────────────────────────────────────────────────────────────────
 * Trittschall (Z24): bewerteter Norm-Trittschallpegel einer Massivdecke mit schwimmendem Estrich (Deckenverfahren
 * nach DIN 4109-2:2018-01): L'_n,w = L_n,eq,0,w − ΔL_w + K, Nachweis L'_n,w + u_prog ≤ zul. L'_n,w.
 *  - L_n,eq,0,w = 164 − 35·lg(m'/1 kg/m²) dB, gültig 100 ≤ m' ≤ 720 kg/m² (DIN 4109-32; öffentlich wiedergegeben u. a.
 *    in Schöck/Zapf-Daigfuß, Handout „Trittschall … nach DIN 4109-2“, 2018, und BauNetz Wissen „Nachweis der
 *    Trittschalldämmung in Gebäuden nach DIN 4109-2: 2018“); m' der Rohdecke einschließlich Verbundestrich und Putz.
 *  - Resonanzfrequenz Estrich auf Dämmschicht f₀ = (1/2π)·√(s'/m') ≈ 160·√(s'/m') Hz mit s' in MN/m³, m' in kg/m²
 *    (Masse-Feder-System; vgl. DAGA 2021, Beitrag 418, Gl. (1)); Verbesserung oberhalb f₀ ≈ 30·lg(f/f₀) dB (Diagramm).
 *  - ΔL_w schwimmender Nassestriche ≈ 13·lg(m') − 14,2·lg(s') + 20,8 dB – vorläufig, F-Freigabe (DIN 4109-34, Gleichung
 *    für Zement- und Calciumsulfatestriche; öffentlich nicht belegt).
 *  - Flankenkorrektur K = 0,6 + 5,5·lg(m'_s/m'_f,m) dB, nicht negativ, gültig 100 ≤ m'_s ≤ 900 und 100 ≤ m'_f,m ≤ 500 kg/m²
 *    (Gültigkeitsbereich nach BauNetz Wissen); Formel vorläufig, F-Freigabe (DIN 4109-2, Abschnitt Trittschall Massivdecken;
 *    öffentlich nicht belegt, Prüfpunkt: Formel, Rundung auf ganze dB und Untergrenze 0 dB).
 *  - Sicherheitsbeiwert u_prog = 3 dB (Schöck/Zapf-Daigfuß 2018).
 * ──────────────────────────────────────────────────────────────────────────────────────────────── */

/** äquivalenter bewerteter Norm-Trittschallpegel der Rohdecke L_n,eq,0,w in dB */
export const lnEq0w = (mDecke: number) => 164 - 35 * Math.log10(mDecke);

/** Resonanzfrequenz f₀ in Hz; s' in MN/m³, m' in kg/m² */
export const resonanzfrequenzEstrich = (sStrich: number, mEstrich: number) => 160 * Math.sqrt(sStrich / mEstrich);

/** Trittschallminderung ΔL_w eines schwimmenden Nassestrichs in dB (vorläufig, F-Freigabe) */
export const deltaLwNassestrich = (mEstrich: number, sStrich: number) => 13 * Math.log10(mEstrich) - 14.2 * Math.log10(sStrich) + 20.8;

/** Verbesserung im Terzband f oberhalb der Resonanz, Masse-Feder-Modell: ΔL(f) = 30·lg(f/f₀), unterhalb 0 */
export const deltaLFrequenz = (f: number, f0: number) => (f > f0 ? 30 * Math.log10(f / f0) : 0);

/** Korrekturwert K für die Flankenübertragung in dB (vorläufig, F-Freigabe), nicht negativ */
export const korrekturwertK = (mDecke: number, mFlanke: number) => Math.max(0, 0.6 + 5.5 * Math.log10(mDecke / mFlanke));

/** Sicherheitsbeiwert u_prog in dB */
export const U_PROG_TRITTSCHALL = 3;

/**
 * Anforderungen zul. L'_n,w. Standard 50 dB (DIN 4109-1:2018-01), 53 dB als historische Option DIN 4109:1989-11 – beide
 * bestätigt (Entscheidung Prof. Huber 27.10.). Treppenwerte aus öffentlichen Wiedergaben, vor Freigabe am Normtext prüfen (F-Freigabe).
 */
export const ANFORDERUNGEN_TRITTSCHALL = [
  { id: 'wtd_2018', label: 'Wohnungstrenndecke, Mehrfamilienhaus (DIN 4109-1:2018-01)', wert: 50, quelle: 'DIN 4109-1:2018-01, Tab. 2 (Standard; bestätigt Prof. Huber 27.10.)' },
  { id: 'treppe_2018', label: 'Treppenlauf/-podest, Mehrfamilienhaus (DIN 4109-1:2018-01)', wert: 53, quelle: 'Schöck, „Trittschallschutz Normen“ (Wiedergabe DIN 4109-1) – vorläufig, F-Freigabe' },
  { id: 'wtd_1989', label: 'Wohnungstrenndecke nach DIN 4109:1989-11 (Bestand)', wert: 53, quelle: 'DIN 4109:1989-11, Tab. 3 (historische Option; bestätigt Prof. Huber 27.10.)' },
  { id: 'treppe_rh', label: 'Treppe, Reihen-/Doppelhaus (DIN 4109-1:2018-01)', wert: 46, quelle: 'Schöck, „Trittschallschutz Normen“ (Wiedergabe DIN 4109-1) – vorläufig, F-Freigabe' },
] as const;

export interface TrittschallEingabe {
  /** Rohdecke: Dicke [m] und Rohdichte [kg/m³] */
  dDecke: number;
  rhoDecke: number;
  /** zusätzliche flächenbezogene Masse auf/an der Rohdecke (Verbundestrich, Putz) [kg/m²] */
  mZusatz: number;
  /** schwimmender Estrich: Dicke [m] und Rohdichte [kg/m³] */
  dEstrich: number;
  rhoEstrich: number;
  /** dynamische Steifigkeit der Trittschalldämmung s' [MN/m³] */
  sStrich: number;
  /** mittlere flächenbezogene Masse der flankierenden, nicht verkleideten massiven Bauteile m'_f,m [kg/m²] */
  mFlanke: number;
  /** zulässiger bewerteter Norm-Trittschallpegel zul. L'_n,w [dB] */
  zulLnw: number;
}

export interface TrittschallErgebnis {
  mDecke: number;
  lnEq0w: number;
  mEstrich: number;
  f0: number;
  deltaLw: number;
  k: number;
  /** L'_n,w = L_n,eq,0,w − ΔL_w + K */
  lnwStrich: number;
  uProg: number;
  /** Nachweiswert L'_n,w + u_prog */
  nachweis: number;
  erfuellt: boolean;
  /** zul. L'_n,w − (L'_n,w + u_prog); ≥ 0 → erfüllt */
  reserve: number;
  gueltig: boolean;
  hinweise: Hinweis[];
}

export function trittschall(e: TrittschallEingabe): TrittschallErgebnis {
  const hinweise: Hinweis[] = [];
  const leer: TrittschallErgebnis = { mDecke: NaN, lnEq0w: NaN, mEstrich: NaN, f0: NaN, deltaLw: NaN, k: NaN, lnwStrich: NaN, uProg: U_PROG_TRITTSCHALL, nachweis: NaN, erfuellt: false, reserve: NaN, gueltig: false, hinweise };
  muss(hinweise, istEndlich(e.dDecke, e.rhoDecke, e.mZusatz, e.dEstrich, e.rhoEstrich, e.sStrich, e.mFlanke, e.zulLnw), 'eingabe', 'Alle Eingaben müssen Zahlen sein.');
  if (!hatFehler(hinweise)) {
    muss(hinweise, e.dDecke > 0 && e.rhoDecke > 0, 'decke', 'Dicke und Rohdichte der Rohdecke müssen größer als 0 sein.');
    muss(hinweise, e.mZusatz >= 0, 'mZusatz', 'Die Zusatzmasse darf nicht negativ sein.');
    muss(hinweise, e.dEstrich > 0 && e.rhoEstrich > 0, 'estrich', 'Dicke und Rohdichte des Estrichs müssen größer als 0 sein.');
    muss(hinweise, e.sStrich > 0, 'sStrich', 'Die dynamische Steifigkeit s\' muss größer als 0 sein.');
    muss(hinweise, e.mFlanke > 0, 'mFlanke', 'Die flächenbezogene Masse der flankierenden Bauteile muss größer als 0 sein.');
    muss(hinweise, e.zulLnw > 0, 'zulLnw', 'Die Anforderung zul. L\'_n,w muss größer als 0 sein.');
  }
  if (hatFehler(hinweise)) return leer;

  const mDecke = e.dDecke * e.rhoDecke + e.mZusatz;
  const mEstrich = e.dEstrich * e.rhoEstrich;
  const ln0 = lnEq0w(mDecke);
  const f0 = resonanzfrequenzEstrich(e.sStrich, mEstrich);
  const deltaLw = deltaLwNassestrich(mEstrich, e.sStrich);
  const kRoh = 0.6 + 5.5 * Math.log10(mDecke / e.mFlanke);
  const k = korrekturwertK(mDecke, e.mFlanke);
  const lnwStrich = ln0 - deltaLw + k;
  const nachweis = lnwStrich + U_PROG_TRITTSCHALL;
  const reserve = e.zulLnw - nachweis;

  bereich(hinweise, 'mDecke', mDecke, 100, 720, `m' der Rohdecke = ${formatDeZahl(mDecke, 0)} kg/m² liegt außerhalb des Gültigkeitsbereichs 100–720 kg/m² von L_n,eq,0,w (DIN 4109-32).`);
  bereich(hinweise, 'mFlanke', e.mFlanke, 100, 500, `m'_f,m = ${formatDeZahl(e.mFlanke, 0)} kg/m² liegt außerhalb des Gültigkeitsbereichs 100–500 kg/m² des Korrekturwerts K.`);
  if (mDecke > 900) hinweise.push({ stufe: 'warnung', feld: 'mDecke', text: 'm\'_s > 900 kg/m² liegt außerhalb des Gültigkeitsbereichs des Korrekturwerts K.' });
  if (kRoh < 0) hinweise.push({ stufe: 'warnung', feld: 'k', text: `Die Flanken sind schwerer als die Decke: K wäre rechnerisch ${formatDeZahl(kRoh, 1)} dB und wird mit 0 dB angesetzt.` });
  bereich(hinweise, 'mEstrich', mEstrich, 60, 160, `Estrich m' = ${formatDeZahl(mEstrich, 0)} kg/m² liegt außerhalb des üblichen Bereichs von Nassestrichen (etwa 60–160 kg/m², Lehrannahme); die ΔL_w-Näherung ist dort nicht belegt.`);
  bereich(hinweise, 'sStrich', e.sStrich, 5, 50, `s' = ${formatDeZahl(e.sStrich, 0)} MN/m³ liegt außerhalb des üblichen Bereichs von Trittschalldämmplatten (etwa 5–50 MN/m³, Lehrannahme).`);
  if (f0 > 100) hinweise.push({ stufe: 'warnung', feld: 'f0', text: `f₀ = ${formatDeZahl(f0, 0)} Hz: Eine hohe Resonanzfrequenz verringert die Trittschallminderung im bauakustisch wichtigen tiefen Frequenzbereich – weichere Dämmschicht oder schwereren Estrich wählen.` });
  if (deltaLw <= 0) hinweise.push({ stufe: 'warnung', feld: 'deltaLw', text: 'Die Näherung liefert keine Trittschallminderung – Eingaben prüfen.' });

  return { mDecke, lnEq0w: ln0, mEstrich, f0, deltaLw, k, lnwStrich, uProg: U_PROG_TRITTSCHALL, nachweis, erfuellt: reserve >= 0, reserve, gueltig: true, hinweise };
}
