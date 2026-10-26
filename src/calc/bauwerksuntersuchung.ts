/**
 * Rechenkern Bauwerksuntersuchung (Z3), übernommen aus src/modules/bauwerksuntersuchung/
 * (PruefverfahrenSimulatoren.tsx, ProbenahmePlaner.tsx, InterpretationNavigator.tsx). Die Module runden und formatieren
 * selbst; der Kern liefert ungerundete Zahlen.
 *  - Rückprallhammer: Schlagrichtung −3,0 (abwärts) / +3,5 (aufwärts), Karbonatisierungsabminderung
 *    k = max(0,75; 1 − 0,015·(d_k − 5)) für d_k > 5 mm, f_c ≈ 0,0125·R^2,22 (Lehr-Näherung, keine Normkurve)
 *  - Ultraschall: v_p = s/t, E_dyn = ρ·v_p²·(1 + ν)(1 − 2ν)/(1 − ν) mit ν = 0,2
 *  - Potentialfeld (gegen Cu/CuSO₄, ASTM C876): > −200 mV gering, −200 … −350 mV ungewiss, < −350 mV hoch
 *  - Betondeckung: c_nom = c_min,dur + Δc_dev nach DIN EN 1992-1-1/NA, Tab. 4.4DE (Betonstahl)
 *  - Chlorid: Anhaltswert 0,5 M.-% bez. Zement (Spannstahl 0,2 M.-%)
 *  - Haftzug: f_ht = F/A mit Stempel Ø 50 mm; Anforderung ≥ 1,5 N/mm² und Bruch im Beton
 *  - Karsten-Röhrchen: w ≈ ΔV/(A·√t) mit A = 4,5 cm², t = 1 h → w = 2,222·ΔV [kg/(m²·√h)], Klassen nach DIN 4108-3
 *  - Karbonatisierung: √t-Gesetz d = K·√t, t_depass = (c/K)² mit K ≥ 0,1 mm/√a
 *  - Bohrkern: f = F/(π·d²/4), Schlankheit L/D (keine Umrechnung)
 *  - Impact-Echo: d = β·v_p/(2·f) mit β = 0,96 (ASTM C1383)
 *  - Probenahmeplaner (Lehransätze) und Befundsynthese des Interpretations-Navigators
 * Einheiten stehen an den Feldern. Reiner Rechenkern – geprüft in tests/bauwerksuntersuchung.test.ts.
 */
import { type Hinweis, istEndlich, hatFehler, muss } from './plausibilitaet';

export interface Ergebnis { gueltig: boolean; hinweise: Hinweis[] }
const abschluss = (h: Hinweis[]): Ergebnis => ({ gueltig: !hatFehler(h), hinweise: h });

// ---------------------------------------------------------------- Rückprallhammer
export type Schlagrichtung = 'horiz' | 'down' | 'up';
export interface RueckprallErgebnis extends Ergebnis {
  rKorr: number; kKarb: number; rFinal: number;
  /** geschätzte Druckfestigkeit in N/mm² */
  fcSchaetz: number;
  /** grobe Klasseneinordnung des Moduls (Schwellen = f_ck der Klasse) */
  klasse: string;
}
export function rueckprall(rueckprallwert: number, richtung: Schlagrichtung, karbTiefeMm: number): RueckprallErgebnis {
  const h: Hinweis[] = [];
  muss(h, istEndlich(rueckprallwert, karbTiefeMm), 'eingabe', 'Rückprallwert und Karbonatisierungstiefe müssen Zahlen sein.');
  muss(h, karbTiefeMm >= 0, 'karbTiefeMm', 'Die Karbonatisierungstiefe darf nicht negativ sein.');
  let rKorr = rueckprallwert;
  if (richtung === 'down') rKorr -= 3.0;
  if (richtung === 'up') rKorr += 3.5;
  const kKarb = karbTiefeMm > 5 ? Math.max(0.75, 1.0 - (karbTiefeMm - 5) * 0.015) : 1.0;
  const rFinal = rKorr * kKarb;
  const fcSchaetz = 0.0125 * Math.pow(rFinal, 2.22);
  let klasse = 'C16/20';
  if (fcSchaetz >= 50) klasse = 'C50/60';
  else if (fcSchaetz >= 45) klasse = 'C45/55';
  else if (fcSchaetz >= 35) klasse = 'C35/45';
  else if (fcSchaetz >= 30) klasse = 'C30/37';
  else if (fcSchaetz >= 25) klasse = 'C25/30';
  else if (fcSchaetz >= 20) klasse = 'C20/25';
  if (rueckprallwert < 20 || rueckprallwert > 55) h.push({ stufe: 'warnung', feld: 'rueckprall', text: 'Rückprallwert außerhalb 20 … 55: Die Lehr-Näherung ist dort nicht abgesichert.' });
  h.push({ stufe: 'warnung', feld: 'fcSchaetz', text: 'Schätzwert ohne Kalibrierung an Bohrkernen (DIN EN 13791) – nur zur Orientierung.' });
  return { rKorr, kKarb, rFinal, fcSchaetz, klasse, ...abschluss(h) };
}

// ---------------------------------------------------------------- Ultraschall
export type GefuegeStufe = 'gut' | 'maessig' | 'kritisch';
export interface UltraschallErgebnis extends Ergebnis {
  /** Schallgeschwindigkeit in m/s */
  vp: number;
  /** dynamischer E-Modul in GPa */
  eDynGPa: number;
  stufe: GefuegeStufe;
}
export function ultraschall(abstandM: number, laufzeitUs: number, dichte: number, nu = 0.2): UltraschallErgebnis {
  const h: Hinweis[] = [];
  muss(h, istEndlich(abstandM, laufzeitUs, dichte) && laufzeitUs > 0 && abstandM > 0, 'laufzeitUs', 'Messstrecke und Laufzeit müssen größer als 0 sein.');
  const vp = abstandM / (laufzeitUs * 1e-6);
  const faktor = ((1 + nu) * (1 - 2 * nu)) / (1 - nu);
  const eDynGPa = dichte * Math.pow(vp, 2) * faktor * 1e-9;
  const stufe: GefuegeStufe = vp < 3000 ? 'kritisch' : vp < 3800 ? 'maessig' : 'gut';
  if (vp > 5500) h.push({ stufe: 'warnung', feld: 'vp', text: 'v_p > 5500 m/s ist für Beton unplausibel – Messstrecke oder Laufzeit prüfen.' });
  return { vp, eDynGPa, stufe, ...abschluss(h) };
}

// ---------------------------------------------------------------- Potentialfeld
export type KorrosionsWahrscheinlichkeit = 'gering' | 'ungewiss' | 'hoch';
/** Einstufung im Prüfsimulator: < −350 mV hoch, ≤ −200 mV ungewiss (Potential in mV gegen Cu/CuSO₄) */
export function potentialStufe(potentialMv: number): KorrosionsWahrscheinlichkeit {
  if (potentialMv < -350) return 'hoch';
  if (potentialMv <= -200) return 'ungewiss';
  return 'gering';
}
/** Einstufung im Interpretations-Navigator: ≤ −350 mV aktiv (abweichend vom Simulator genau bei −350 mV) */
export function potentialStatus(potentialMv: number): 'passiv' | 'unsicher' | 'aktiv' {
  if (potentialMv <= -350) return 'aktiv';
  if (potentialMv <= -200) return 'unsicher';
  return 'passiv';
}

// ---------------------------------------------------------------- Betondeckung
export type DeckungsKlasse = 'XC1' | 'XC3' | 'XC4' | 'XD1' | 'XD3';
/** c_min,dur und Δc_dev in mm nach DIN EN 1992-1-1/NA, Tab. 4.4DE */
export const DECKUNG: Readonly<Record<DeckungsKlasse, { min: number; dev: number; req: number }>> = {
  XC1: { min: 10, dev: 10, req: 20 }, XC3: { min: 20, dev: 15, req: 35 }, XC4: { min: 25, dev: 15, req: 40 },
  XD1: { min: 40, dev: 15, req: 55 }, XD3: { min: 40, dev: 15, req: 55 },
};
export interface DeckungErgebnis extends Ergebnis { cMin: number; cNom: number; differenz: number; ok: boolean }
export function betondeckung(klasse: DeckungsKlasse, gemessenMm: number): DeckungErgebnis {
  const h: Hinweis[] = [];
  muss(h, Number.isFinite(gemessenMm) && gemessenMm >= 0, 'gemessenMm', 'Die gemessene Betondeckung muss ≥ 0 mm sein.');
  const r = DECKUNG[klasse];
  const differenz = gemessenMm - r.req;
  h.push({ stufe: 'warnung', feld: 'cMin', text: 'c_min,b (≥ Stabdurchmesser) ist nicht berücksichtigt.' });
  return { cMin: r.min, cNom: r.req, differenz, ok: differenz >= 0, ...abschluss(h) };
}

// ---------------------------------------------------------------- Chlorid
export interface ChloridErgebnis extends Ergebnis { grenze: number; ueberschritten: boolean; verhaeltnis: number; stufe: 'unkritisch' | 'Beobachtung / Prävention' | 'Korrosion wahrscheinlich' }
/** Chloridgehalt in M.-% bezogen auf den Zement */
export function chlorid(gehaltProzent: number, vorgespannt: boolean): ChloridErgebnis {
  const h: Hinweis[] = [];
  muss(h, Number.isFinite(gehaltProzent) && gehaltProzent >= 0, 'gehalt', 'Der Chloridgehalt muss ≥ 0 sein.');
  const grenze = 0.5;
  const ueberschritten = vorgespannt ? gehaltProzent >= 0.2 : gehaltProzent >= grenze;
  const stufe = gehaltProzent < 0.2 ? 'unkritisch' : gehaltProzent < 0.5 ? 'Beobachtung / Prävention' : 'Korrosion wahrscheinlich';
  return { grenze, ueberschritten, verhaeltnis: gehaltProzent / grenze, stufe, ...abschluss(h) };
}

// ---------------------------------------------------------------- Haftzug
export type HaftBruch = 'beton' | 'verbund' | 'kleber';
export interface HaftzugErgebnis extends Ergebnis { flaecheMm2: number; fct: number; ok: boolean }
export function haftzug(kraftKn: number, bruch: HaftBruch, stempelMm = 50): HaftzugErgebnis {
  const h: Hinweis[] = [];
  muss(h, Number.isFinite(kraftKn) && kraftKn >= 0, 'kraftKn', 'Die Abreißkraft muss ≥ 0 kN sein.');
  const flaecheMm2 = (Math.PI * Math.pow(stempelMm, 2)) / 4;
  const fct = (kraftKn * 1000) / flaecheMm2;
  if (bruch === 'kleber') h.push({ stufe: 'warnung', feld: 'bruch', text: 'Bruch im Kleber: Die Haftzugfestigkeit ist nur ein unterer Grenzwert, Prüfung wiederholen.' });
  return { flaecheMm2, fct, ok: fct >= 1.5 && bruch === 'beton', ...abschluss(h) };
}

// ---------------------------------------------------------------- Karsten
export type SaugKlasse = 'wasserabweisend' | 'wasserhemmend' | 'wassersaugend';
export interface KarstenErgebnis extends Ergebnis { w: number; klasse: SaugKlasse }
/** Wasseraufnahme nach 60 min in ml → w in kg/(m²·√h) */
export function karsten(wasserMl60: number): KarstenErgebnis {
  const h: Hinweis[] = [];
  muss(h, Number.isFinite(wasserMl60) && wasserMl60 >= 0, 'wasserMl60', 'Die Wasseraufnahme muss ≥ 0 ml sein.');
  const w = wasserMl60 * 2.222;
  const klasse: SaugKlasse = w > 2.0 ? 'wassersaugend' : w > 0.5 ? 'wasserhemmend' : 'wasserabweisend';
  h.push({ stufe: 'warnung', feld: 'w', text: 'Das Karsten-Röhrchen liefert nur einen Schätzwert; der w-Wert nach DIN 4108-3 wird nach DIN EN ISO 15148 bestimmt.' });
  return { w, klasse, ...abschluss(h) };
}

// ---------------------------------------------------------------- Karbonatisierung
export interface KarbonatisierungErgebnis extends Ergebnis {
  /** Karbonatisierungskoeffizient K in mm/√a */
  k: number;
  /** Zeit bis zur Depassivierung in Jahren (ab Herstellung) */
  tDepass: number;
  restJahre: number;
  depassiviert: boolean;
}
export function karbonatisierung(tiefeMm: number, alterJahre: number, deckungMm: number): KarbonatisierungErgebnis {
  const h: Hinweis[] = [];
  muss(h, istEndlich(tiefeMm, alterJahre, deckungMm), 'eingabe', 'Alle Eingaben müssen Zahlen sein.');
  muss(h, alterJahre > 0, 'alterJahre', 'Das Bauteilalter muss größer als 0 sein.');
  muss(h, tiefeMm >= 0 && deckungMm >= 0, 'tiefeMm', 'Tiefe und Deckung dürfen nicht negativ sein.');
  const k = tiefeMm / Math.sqrt(alterJahre);
  const tDepass = Math.pow(deckungMm / Math.max(0.1, k), 2);
  const restJahre = Math.max(0, Math.round(tDepass - alterJahre));
  if (k < 0.1) h.push({ stufe: 'warnung', feld: 'tiefeMm', text: 'K < 0,1 mm/√a: Für die Prognose wird K = 0,1 mm/√a angesetzt.' });
  return { k, tDepass, restJahre, depassiviert: deckungMm <= tiefeMm, ...abschluss(h) };
}

// ---------------------------------------------------------------- Bohrkern
export interface BohrkernErgebnis extends Ergebnis { flaecheMm2: number; festigkeit: number; schlankheit: number; bezug: 'wuerfel' | 'zylinder' | 'keiner' }
export function bohrkern(durchmesserMm: number, laengeMm: number, kraftKn: number): BohrkernErgebnis {
  const h: Hinweis[] = [];
  muss(h, istEndlich(durchmesserMm, laengeMm, kraftKn) && durchmesserMm > 0 && laengeMm > 0 && kraftKn >= 0, 'eingabe', 'Durchmesser und Länge müssen größer als 0 sein, die Bruchkraft ≥ 0.');
  const flaecheMm2 = Math.PI * Math.pow(durchmesserMm / 2, 2);
  const festigkeit = (kraftKn * 1000) / flaecheMm2;
  const schlankheit = laengeMm / durchmesserMm;
  const bezug = Math.abs(schlankheit - 1) < 0.05 ? 'wuerfel' : Math.abs(schlankheit - 2) < 0.1 ? 'zylinder' : 'keiner';
  if (bezug === 'keiner') h.push({ stufe: 'warnung', feld: 'laengeMm', text: 'Kein Bezugskörper nach DIN EN 13791 – Kern auf L/D = 1 oder 2 ablängen.' });
  return { flaecheMm2, festigkeit, schlankheit, bezug, ...abschluss(h) };
}

// ---------------------------------------------------------------- Impact-Echo
export interface ImpactEchoErgebnis extends Ergebnis { dickeCm: number; delamination: boolean }
export function impactEcho(frequenzKHz: number, vp: number, nennDickeCm: number, beta = 0.96): ImpactEchoErgebnis {
  const h: Hinweis[] = [];
  muss(h, istEndlich(frequenzKHz, vp, nennDickeCm) && frequenzKHz > 0 && vp > 0, 'frequenzKHz', 'Frequenz und Wellengeschwindigkeit müssen größer als 0 sein.');
  const dickeCm = ((beta * vp) / (2 * (frequenzKHz * 1000))) * 100;
  const delamination = Math.abs(dickeCm - nennDickeCm) > 4.0 && dickeCm < nennDickeCm;
  return { dickeCm, delamination, ...abschluss(h) };
}

// ---------------------------------------------------------------- Probenahmeplaner
export type Untersuchungsziel = 'druckfestigkeit' | 'chlorid' | 'karbonatisierung' | 'haftzug' | 'potentialfeld';
export interface ProbenahmeEingabe {
  ziel: Untersuchungsziel;
  verfahren: 'verfahrenA' | 'verfahrenB';
  /** untersuchte Fläche in m² */
  flaecheM2: number;
  bauteilAnzahl: number;
}
export interface ProbenahmeErgebnis extends Ergebnis { bohrkerne: number; zfpPunkte: number; bohrmehlStellen: number; haftzugStempel: number; rasterMass: string }
export function probenahmeUmfang(e: ProbenahmeEingabe): ProbenahmeErgebnis {
  const h: Hinweis[] = [];
  muss(h, istEndlich(e.flaecheM2, e.bauteilAnzahl) && e.flaecheM2 >= 0 && e.bauteilAnzahl >= 0, 'flaecheM2', 'Fläche und Bauteilanzahl müssen ≥ 0 sein.');
  const { ziel, verfahren, flaecheM2, bauteilAnzahl } = e;
  let bohrkerne: number;
  if (ziel === 'druckfestigkeit') {
    bohrkerne = verfahren === 'verfahrenA'
      ? Math.max(8, Math.round(8 + (flaecheM2 > 1000 ? (flaecheM2 - 1000) / 300 : 0)))
      : Math.min(7, Math.max(3, Math.round(3 + flaecheM2 / 150)));
  } else if (ziel === 'chlorid') bohrkerne = Math.max(2, Math.round(flaecheM2 / 300));
  else bohrkerne = 2;
  let zfpPunkte: number;
  let rasterMass = '20 × 20 cm';
  if (ziel === 'potentialfeld') { zfpPunkte = Math.min(600, Math.max(60, Math.round(flaecheM2 * 0.4))); rasterMass = '15 × 15 cm bis 20 × 20 cm'; }
  else if (ziel === 'chlorid') { zfpPunkte = Math.min(300, Math.max(40, Math.round(flaecheM2 * 0.2))); rasterMass = '25 × 25 cm (Covermeter-Vorlauf)'; }
  else if (ziel === 'druckfestigkeit') { zfpPunkte = bauteilAnzahl * 9; rasterMass = '30 × 30 cm Prüffelder'; }
  else zfpPunkte = Math.round(flaecheM2 * 0.1);
  const bohrmehlStellen = ziel === 'chlorid' ? Math.max(4, Math.round(3 + flaecheM2 / 200)) : ziel === 'karbonatisierung' ? 2 : 1;
  let haftzugStempel = 0;
  if (ziel === 'haftzug') haftzugStempel = Math.max(5, Math.round(5 + flaecheM2 / 100));
  else if (ziel === 'chlorid' || ziel === 'druckfestigkeit') haftzugStempel = Math.max(3, Math.round(3 + flaecheM2 / 250));
  h.push({ stufe: 'warnung', feld: 'zfpPunkte', text: 'Lehransatz: Die Messpunktzahl entspricht nicht dem angegebenen Rastermaß (vollflächiges Raster ergibt deutlich mehr Punkte).' });
  return { bohrkerne, zfpPunkte, bohrmehlStellen, haftzugStempel, rasterMass, ...abschluss(h) };
}

// ---------------------------------------------------------------- Befundsynthese (Interpretations-Navigator)
export interface BefundEingabe {
  /** Chlorid in M.-% bez. Zement */
  chlorid: number;
  /** Betondeckung und Karbonatisierungstiefe in mm */
  deckung: number;
  karbonatisierung: number;
  /** In-situ- und Planfestigkeit f_ck in N/mm² (Plan 0 = nicht bekannt) */
  fckIs: number;
  fckPlan: number;
  /** Potential in mV gegen Cu/CuSO₄ */
  potential: number;
  /** Haftzugfestigkeit in N/mm² und Bruchbild A (Beton), AB, B, Y */
  haftzug: number;
  bruchTyp: 'A' | 'AB' | 'B' | 'Y';
  /** tragfähiger Holz-Restquerschnitt in % */
  holzRest: number;
}
export interface BefundErgebnis extends Ergebnis {
  passivierungsReserve: number; isCarbDepassivated: boolean;
  isChlorideCritical: boolean; isChlorideSevere: boolean;
  potentialStatus: 'passiv' | 'unsicher' | 'aktiv';
  festigkeitsVerhaeltnis: number; isStrengthDeficient: boolean;
  isHaftzugOk: boolean; isHolzCrit: boolean;
  /** Restwiderstandsmoment in % bei Höhenverlust (W ∝ h²) */
  holzRestWiderstand: number;
  overallRisk: 'gering' | 'mittel' | 'hoch' | 'akut';
}
export function befundSynthese(e: BefundEingabe): BefundErgebnis {
  const h: Hinweis[] = [];
  muss(h, istEndlich(e.chlorid, e.deckung, e.karbonatisierung, e.fckIs, e.fckPlan, e.potential, e.haftzug, e.holzRest), 'eingabe', 'Alle Messwerte müssen Zahlen sein.');
  const passivierungsReserve = e.deckung - e.karbonatisierung;
  const isCarbDepassivated = passivierungsReserve <= 0;
  const isChlorideCritical = e.chlorid >= 0.50;
  const isChlorideSevere = e.chlorid >= 0.80;
  const pStatus = potentialStatus(e.potential);
  const festigkeitsVerhaeltnis = e.fckPlan > 0 ? e.fckIs / e.fckPlan : 1;
  const isStrengthDeficient = festigkeitsVerhaeltnis < 0.85;
  const isHaftzugOk = e.haftzug >= 1.5 && e.bruchTyp === 'A';
  const isHolzCrit = e.holzRest < 70;
  let overallRisk: BefundErgebnis['overallRisk'] = 'gering';
  if (isChlorideSevere || (isCarbDepassivated && pStatus === 'aktiv') || isHolzCrit || festigkeitsVerhaeltnis < 0.65) overallRisk = 'akut';
  else if (isChlorideCritical || isCarbDepassivated || isStrengthDeficient || !isHaftzugOk) overallRisk = 'hoch';
  else if (pStatus === 'unsicher' || passivierungsReserve < 10) overallRisk = 'mittel';
  if (e.haftzug === 0) h.push({ stufe: 'warnung', feld: 'haftzug', text: 'Haftzug = 0 (nicht gemessen) wird als „nicht bestanden“ gewertet und hebt das Risiko mindestens auf „hoch“.' });
  if (e.deckung === 0 && e.karbonatisierung === 0) h.push({ stufe: 'warnung', feld: 'deckung', text: 'Deckung und Karbonatisierungstiefe 0 (nicht gemessen) gelten als depassiviert.' });
  return {
    passivierungsReserve, isCarbDepassivated, isChlorideCritical, isChlorideSevere, potentialStatus: pStatus,
    festigkeitsVerhaeltnis, isStrengthDeficient, isHaftzugOk, isHolzCrit, holzRestWiderstand: Math.pow(e.holzRest / 100, 2) * 100,
    overallRisk, ...abschluss(h),
  };
}
