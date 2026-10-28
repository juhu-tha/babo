/**
 * Rechenkern Bauwerksuntersuchung (Z3), übernommen aus src/modules/bauwerksuntersuchung/
 * (PruefverfahrenSimulatoren.tsx, ProbenahmePlaner.tsx, InterpretationNavigator.tsx). Die Module runden und formatieren
 * selbst; der Kern liefert ungerundete Zahlen.
 *  - Rückprallhammer: Richtungskorrektur nach Herstellerformel Original Schmidt Typ N (rueckprallRichtungskorrektur,
 *    Entscheidung 27.10.; vorher pauschal −3,0 abwärts / +3,5 aufwärts mit vertauschtem Vorzeichen), Karbonatisierungsabminderung
 *    k = max(0,75; 1 − 0,015·(d_k − 5)) für d_k > 5 mm, f_c ≈ 0,0125·R^2,22 (Lehr-Näherung, keine Normkurve).
 *    Runde 5 (Z55): einzige Lehrkurve des Repos (RUECKPRALL_LEHRKURVE, auch ZfP und Labor); Zuordnung zur
 *    Bauwerksfestigkeit nur über Kalibrierkerne nach DIN EN 13791:2020, Abschnitt 8.2/8.3 (rueckprallKalibrierung)
 *  - Ultraschall: v_p = s/t, E_dyn = ρ·v_p²·(1 + ν)(1 − 2ν)/(1 − ν) mit ν = 0,2
 *  - Potentialfeld (gegen Cu/CuSO₄, ASTM C876): > −200 mV gering, −350 … −200 mV ungewiss, < −350 mV hoch
 *    (Runde 5: einheitlich für ZfP, Bauwerksuntersuchung und Labor; DGZfP-Merkblatt B 03: objektbezogene Auswertung)
 *  - Betondeckung: c_nom = c_min,dur + Δc_dev nach DIN EN 1992-1-1/NA, Tab. 4.4DE (Betonstahl)
 *  - Chlorid: Anhaltswert 0,5 M.-% bez. Zement (Spannstahl 0,2 M.-%)
 *  - Haftzug: f_ht = F/A mit Stempel Ø 50 mm; Anforderung ≥ 1,5 N/mm² und Bruch im Beton
 *  - Karsten-Röhrchen: w = ΔV·10/(A·√t), t = 1 h, Prüffläche und Klassen nach DIN 4108-3 einheitlich aus src/calc/karsten.ts
 *  - Karbonatisierung: √t-Gesetz d = K·√t, t_depass = (c/K)² mit K ≥ 0,1 mm/√a
 *  - Bohrkern: f = F/(π·d²/4), Schlankheit L/D (keine Umrechnung)
 *  - Impact-Echo: d = β·v_p/(2·f) mit β = 0,96 (ASTM C1383)
 *  - Probenahmeplaner (Lehransätze) und Befundsynthese des Interpretations-Navigators
 * Einheiten stehen an den Feldern. Reiner Rechenkern – geprüft in tests/bauwerksuntersuchung.test.ts.
 */
import { type Hinweis, istEndlich, hatFehler, muss } from './plausibilitaet';
import { saugKlasse, wWertAusKarsten, type SaugKlasse } from './karsten';
import { koeffizientAusTiefe, zeitBisTiefe } from './schnellkarbonatisierung';

export interface Ergebnis { gueltig: boolean; hinweise: Hinweis[] }
const abschluss = (h: Hinweis[]): Ergebnis => ({ gueltig: !hatFehler(h), hinweise: h });

// ---------------------------------------------------------------- Rückprallhammer
export type Schlagrichtung = 'horiz' | 'down' | 'up';

/**
 * Richtungskorrektur des Rückprallwerts auf horizontale Schlagrichtung (α = 0°), Original Schmidt Typ N.
 * Quelle: Screening Eagle (Proceq), Academy-FAQ „What are the formulae used in the compressive strength correlation curves –
 * rebound hammers“ (OS8000 Typ N): R_korr = R + (−a₀ + a₁·R)·sin α mit a₀ = 7,1, a₁ = 0,08 für α ≥ 0° und
 * a₀ = 4,3, a₁ = 0,043 für α < 0°. Winkelkonvention wie in den Proceq-Anleitungen: α = +90° Schlag senkrecht nach oben
 * (Decke), α = −90° senkrecht nach unten (Boden). Physik: Beim Schlag nach oben fällt die Schlagmasse beim Rückprall mit
 * der Schwerkraft – R wird zu hoch abgelesen und abgemindert; beim Schlag nach unten umgekehrt (Zuschlag).
 * Kontrollwerte ΔR (R = 20/30/40/50/60): +90°: −5,5/−4,7/−3,9/−3,1/−2,3; −90°: +3,4/+3,0/+2,6/+2,2/+1,7.
 */
export const RUECKPRALL_RICHTUNG = { aufwaerts: { a0: 7.1, a1: 0.08 }, abwaerts: { a0: 4.3, a1: 0.043 } } as const;
/** ΔR für den abgelesenen Rückprallwert r bei Schlagwinkel α in Grad (+90 = nach oben, −90 = nach unten) */
export function rueckprallRichtungskorrektur(r: number, alphaGrad: number): number {
  if (alphaGrad === 0) return 0;
  const k = alphaGrad >= 0 ? RUECKPRALL_RICHTUNG.aufwaerts : RUECKPRALL_RICHTUNG.abwaerts;
  return (-k.a0 + k.a1 * r) * Math.sin((alphaGrad * Math.PI) / 180);
}
/** Korrekturtabelle ΔR (Zeilen R, Spalten α = +90°, +45°, −45°, −90°) aus rueckprallRichtungskorrektur */
export function rueckprallKorrekturtabelle(rWerte: readonly number[] = [20, 25, 30, 35, 40, 45, 50, 55, 60]) {
  const winkel = [90, 45, -45, -90] as const;
  return rWerte.map(r => ({ r, dR: winkel.map(a => rueckprallRichtungskorrektur(r, a)) }));
}
/** Schlagrichtung des Bauwerksuntersuchungs-Simulators → Winkel α in Grad */
export const SCHLAGWINKEL: Readonly<Record<Schlagrichtung, number>> = { horiz: 0, up: 90, down: -90 };
export interface RueckprallErgebnis extends Ergebnis {
  rKorr: number; kKarb: number; rFinal: number;
  /** geschätzte Druckfestigkeit in N/mm² */
  fcSchaetz: number;
  /** grobe Klasseneinordnung des Moduls (Schwellen = f_ck der Klasse) */
  klasse: string;
}
/**
 * Einheitliche Lehrkurve des Rückprallhammers (Typ N, horizontaler Schlag): f_c ≈ a·R^b in N/mm² mit a = 0,0125, b = 2,22.
 * Keine Bezugskurve nach DIN EN 13791 – ohne Kalibrierung an Bohrkernen nur ein Schätzwert. Unter R = 10 wird mit 10 gerechnet.
 * Runde 5 (Z55): ersetzt die bisherigen Kurven 0,027·R^2,1 (ZfP) und 0,027·R^1,85 (Labor).
 */
export const RUECKPRALL_LEHRKURVE = { a: 0.0125, b: 2.22, rMin: 10 } as const;
/** Schätzwert der Druckfestigkeit in N/mm² aus dem korrigierten Rückprallwert R (Lehrkurve, optional um Δf verschoben) */
export function rueckprallLehrkurve(r: number, deltaF = 0): number {
  return RUECKPRALL_LEHRKURVE.a * Math.pow(Math.max(RUECKPRALL_LEHRKURVE.rMin, r), RUECKPRALL_LEHRKURVE.b) + deltaF;
}
/** Text für Ergebnis-Hinweise: ohne Kalibrierung nur Schätzung */
export const RUECKPRALL_HINWEIS_SCHAETZUNG = 'Schätzwert nach Lehrkurve f_c ≈ 0,0125·R^2,22 ohne Kalibrierung an Bohrkernen. Eine Bauwerksdruckfestigkeit nach DIN EN 13791:2020 (Abschnitt 8.2/8.3) erfordert die Verschiebung der Kurve über mindestens drei Kalibrierkerne aus demselben Prüfbereich.';

export interface KalibrierPaar { /** korrigierter Rückprallwert am Kernort */ r: number; /** Kernfestigkeit in N/mm² */ fKern: number }
export interface KalibrierErgebnis extends Ergebnis {
  n: number;
  /** Verschiebung Δf = Mittelwert(f_Kern − f_Lehr(R)) in N/mm² */
  deltaF: number;
  /** Streuung der Differenzen s(f_Kern − f_Lehr) in N/mm² */
  sDelta: number;
}
/**
 * Verschiebung der Lehrkurve über Kalibrierkerne (Vorgehen nach DIN EN 13791:2020, 8.2/8.3: indirekte Prüfung plus
 * mindestens drei Bohrkerne aus demselben Prüfbereich). Δf = Mittelwert der Differenzen Kern − Kurve. Den in der Norm
 * zusätzlich geforderten Abschlag für die Aussagewahrscheinlichkeit setzt der Kern nicht an (vorläufig, F-Freigabe).
 */
export function rueckprallKalibrierung(paare: readonly KalibrierPaar[]): KalibrierErgebnis {
  const h: Hinweis[] = [];
  muss(h, paare.every(p => istEndlich(p.r, p.fKern) && p.fKern > 0), 'kalibrierung', 'Rückprallwerte und Kernfestigkeiten müssen Zahlen sein, die Kernfestigkeit > 0.');
  muss(h, paare.length >= 3, 'kalibrierung', 'Für die Verschiebung der Kurve sind mindestens drei Kalibrierkerne erforderlich (DIN EN 13791:2020, 8.3).');
  if (hatFehler(h)) return { n: paare.length, deltaF: 0, sDelta: 0, ...abschluss(h) };
  const d = paare.map(p => p.fKern - rueckprallLehrkurve(p.r));
  const deltaF = d.reduce((a, x) => a + x, 0) / d.length;
  const sDelta = d.length > 1 ? Math.sqrt(d.reduce((a, x) => a + (x - deltaF) ** 2, 0) / (d.length - 1)) : 0;
  h.push({ stufe: 'warnung', feld: 'kalibrierung', text: 'Verschiebung Δf als Mittelwert der Differenzen; der Abschlag für die Aussagewahrscheinlichkeit nach DIN EN 13791 ist nicht enthalten (Lehrdarstellung).' });
  return { n: paare.length, deltaF, sDelta, ...abschluss(h) };
}

/**
 * Auswertung eines Messsatzes (Einzelschläge einer Prüffläche) nach DIN EN 12504-2:2021-10 (Umsetzung 29.10.2026,
 * T4-PN-2/T12-BU-7): Kennwert ist der Median aller Einzelwerte; Einzelwerte werden nicht gestrichen. Weichen mehr als
 * 20 % der Einzelwerte um mehr als 6 Einheiten vom Median ab, wird der ganze Messsatz verworfen. Schwelle und Anteil
 * öffentlich nicht im Wortlaut belegt (vorläufig, F-Freigabe Rückprall am Normtext DIN EN 12504-2).
 */
export const RUECKPRALL_MESSSATZ = { abweichungEinheiten: 6, anteilMax: 0.2, nMin: 9 } as const;
export interface RueckprallMesssatzErgebnis extends Ergebnis {
  n: number; median: number;
  /** Einzelwerte mit |R − Median| > 6 */
  abweichend: number[];
  /** Anteil der abweichenden Werte (0 … 1) */
  anteil: number;
  verworfen: boolean;
}
export function rueckprallMesssatz(werte: readonly number[]): RueckprallMesssatzErgebnis {
  const h: Hinweis[] = [];
  muss(h, werte.length > 0 && werte.every(v => Number.isFinite(v)), 'messsatz', 'Der Messsatz braucht mindestens einen Rückprallwert, alle Werte als Zahl.');
  if (hatFehler(h)) return { n: werte.length, median: NaN, abweichend: [], anteil: NaN, verworfen: false, ...abschluss(h) };
  const s = [...werte].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  const median = s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
  const abweichend = werte.filter(v => Math.abs(v - median) > RUECKPRALL_MESSSATZ.abweichungEinheiten + 1e-9);
  const anteil = abweichend.length / werte.length;
  const verworfen = anteil > RUECKPRALL_MESSSATZ.anteilMax + 1e-12;
  if (werte.length < RUECKPRALL_MESSSATZ.nMin) h.push({ stufe: 'warnung', feld: 'messsatz', text: `Weniger als ${RUECKPRALL_MESSSATZ.nMin} Einzelwerte: DIN EN 12504-2 verlangt mindestens 9 gültige Schläge je Prüffläche.` });
  if (verworfen) h.push({ stufe: 'warnung', feld: 'messsatz', text: 'Mehr als 20 % der Einzelwerte weichen um mehr als 6 Einheiten vom Median ab: Messsatz verwerfen und wiederholen (DIN EN 12504-2; vorläufig, Normtext prüfen).' });
  return { n: werte.length, median, abweichend, anteil, verworfen, ...abschluss(h) };
}

export function rueckprall(rueckprallwert: number, richtung: Schlagrichtung, karbTiefeMm: number): RueckprallErgebnis {
  const h: Hinweis[] = [];
  muss(h, istEndlich(rueckprallwert, karbTiefeMm), 'eingabe', 'Rückprallwert und Karbonatisierungstiefe müssen Zahlen sein.');
  muss(h, karbTiefeMm >= 0, 'karbTiefeMm', 'Die Karbonatisierungstiefe darf nicht negativ sein.');
  const rKorr = rueckprallwert + rueckprallRichtungskorrektur(rueckprallwert, SCHLAGWINKEL[richtung]);
  const kKarb = karbTiefeMm > 5 ? Math.max(0.75, 1.0 - (karbTiefeMm - 5) * 0.015) : 1.0;
  const rFinal = rKorr * kKarb;
  const fcSchaetz = rueckprallLehrkurve(rFinal);
  let klasse = 'C16/20';
  if (fcSchaetz >= 50) klasse = 'C50/60';
  else if (fcSchaetz >= 45) klasse = 'C45/55';
  else if (fcSchaetz >= 35) klasse = 'C35/45';
  else if (fcSchaetz >= 30) klasse = 'C30/37';
  else if (fcSchaetz >= 25) klasse = 'C25/30';
  else if (fcSchaetz >= 20) klasse = 'C20/25';
  if (rueckprallwert < 20 || rueckprallwert > 55) h.push({ stufe: 'warnung', feld: 'rueckprall', text: 'Rückprallwert außerhalb 20 … 55: Die Lehr-Näherung ist dort nicht abgesichert.' });
  h.push({ stufe: 'warnung', feld: 'fcSchaetz', text: RUECKPRALL_HINWEIS_SCHAETZUNG });
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
/** Dynamischer E-Modul E_dyn = ρ·v_p²·(1 + ν)(1 − 2ν)/(1 − ν) in N/m² (ρ in kg/m³, v_p in m/s) */
export function dynamischerEModul(dichte: number, vp: number, nu = 0.2): number {
  return dichte * Math.pow(vp, 2) * ((1 + nu) * (1 - 2 * nu)) / (1 - nu);
}
export function ultraschall(abstandM: number, laufzeitUs: number, dichte: number, nu = 0.2): UltraschallErgebnis {
  const h: Hinweis[] = [];
  muss(h, istEndlich(abstandM, laufzeitUs, dichte) && laufzeitUs > 0 && abstandM > 0, 'laufzeitUs', 'Messstrecke und Laufzeit müssen größer als 0 sein.');
  const vp = abstandM / (laufzeitUs * 1e-6);
  const eDynGPa = dynamischerEModul(dichte, vp, nu) * 1e-9;
  const stufe: GefuegeStufe = vp < 3000 ? 'kritisch' : vp < 3800 ? 'maessig' : 'gut';
  if (vp > 5500) h.push({ stufe: 'warnung', feld: 'vp', text: 'v_p > 5500 m/s ist für Beton unplausibel – Messstrecke oder Laufzeit prüfen.' });
  return { vp, eDynGPa, stufe, ...abschluss(h) };
}

// ---------------------------------------------------------------- Potentialfeld
export type KorrosionsWahrscheinlichkeit = 'gering' | 'ungewiss' | 'hoch';
/** Grenzen der Potentialeinstufung in mV gegen Cu/CuSO₄ (ASTM C876): positiver als −200 mV gering, negativer als −350 mV hoch */
export const POTENTIAL_GRENZEN_MV = { gering: -200, hoch: -350 } as const;
/**
 * Einheitliche Einstufung (Runde 5) für ZfP, Bauwerksuntersuchung und Labor: E < −350 mV hoch, −350 ≤ E ≤ −200 mV ungewiss,
 * E > −200 mV gering (Potential in mV gegen Cu/CuSO₄; ASTM C876). Das DGZfP-Merkblatt B 03 empfiehlt statt fester Grenzen die
 * objektbezogene statistische Auswertung (Häufigkeitsverteilung) – die festen Grenzen sind eine Lehr-Orientierung.
 * Vorher: Grenze −350 mV in der Bauwerksuntersuchung eingeschlossen (≤ −350 hoch), im Modul ZfP ausgeschlossen.
 */
export function potentialStufe(potentialMv: number): KorrosionsWahrscheinlichkeit {
  if (potentialMv < POTENTIAL_GRENZEN_MV.hoch) return 'hoch';
  if (potentialMv <= POTENTIAL_GRENZEN_MV.gering) return 'ungewiss';
  return 'gering';
}
/** Einstufung im Interpretations-Navigator mit denselben Grenzen wie potentialStufe */
export function potentialStatus(potentialMv: number): 'passiv' | 'unsicher' | 'aktiv' {
  const s = potentialStufe(potentialMv);
  return s === 'hoch' ? 'aktiv' : s === 'ungewiss' ? 'unsicher' : 'passiv';
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
export type { SaugKlasse };
export interface KarstenErgebnis extends Ergebnis { w: number; klasse: SaugKlasse }
/** Wasseraufnahme nach 60 min in ml → w in kg/(m²·√h) */
export function karsten(wasserMl60: number): KarstenErgebnis {
  const h: Hinweis[] = [];
  muss(h, Number.isFinite(wasserMl60) && wasserMl60 >= 0, 'wasserMl60', 'Die Wasseraufnahme muss ≥ 0 ml sein.');
  const w = Number.isFinite(wasserMl60) && wasserMl60 >= 0 ? wWertAusKarsten(wasserMl60, 1) : 0;
  const klasse: SaugKlasse = saugKlasse(w);
  h.push({ stufe: 'warnung', feld: 'w', text: 'Das Karsten-Röhrchen liefert nur einen Schätzwert (Prüffläche geräteabhängig); der w-Wert nach DIN 4108-3 wird nach DIN EN ISO 15148 bestimmt.' });
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
  // Wurzel-t-Gesetz aus dem gemeinsamen Kern src/calc/schnellkarbonatisierung.ts (Runde 7, Ergebnis unverändert)
  const k = koeffizientAusTiefe(tiefeMm, alterJahre);
  const tDepass = zeitBisTiefe(deckungMm, Math.max(0.1, k));
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
  /** Haftzug gemessen und bestanden (≥ 1,5 N/mm², Bruch im Beton) */
  isHaftzugOk: boolean;
  /** Haftzug gemessen und nicht bestanden (ungemessen = weder bestanden noch nicht bestanden) */
  isHaftzugFailed: boolean;
  isHolzCrit: boolean;
  /** 0 bzw. leer = „nicht gemessen“ (Befund 12 aus #160): Deckung, Haftzug, In-situ-Festigkeit */
  deckungGemessen: boolean; haftzugGemessen: boolean; festigkeitGemessen: boolean;
  /** Restwiderstandsmoment in % bei Höhenverlust (W ∝ h²) */
  holzRestWiderstand: number;
  overallRisk: 'gering' | 'mittel' | 'hoch' | 'akut';
}
/** Messwert liegt vor: endlich und > 0 (0 oder leer = nicht gemessen) */
const gemessen = (x: number) => Number.isFinite(x) && x > 0;
export function befundSynthese(e: BefundEingabe): BefundErgebnis {
  const h: Hinweis[] = [];
  muss(h, istEndlich(e.chlorid, e.deckung, e.karbonatisierung, e.fckIs, e.fckPlan, e.potential, e.haftzug, e.holzRest), 'eingabe', 'Alle Messwerte müssen Zahlen sein.');
  const deckungGemessen = gemessen(e.deckung);
  const haftzugGemessen = gemessen(e.haftzug);
  const festigkeitGemessen = gemessen(e.fckIs) && gemessen(e.fckPlan);
  const passivierungsReserve = e.deckung - e.karbonatisierung;
  const isCarbDepassivated = deckungGemessen && passivierungsReserve <= 0;
  const isChlorideCritical = e.chlorid >= 0.50;
  const isChlorideSevere = e.chlorid >= 0.80;
  const pStatus = potentialStatus(e.potential);
  const festigkeitsVerhaeltnis = festigkeitGemessen ? e.fckIs / e.fckPlan : 1;
  const isStrengthDeficient = festigkeitsVerhaeltnis < 0.85;
  const haftzugBestanden = e.haftzug >= 1.5 && e.bruchTyp === 'A';
  const isHaftzugOk = haftzugGemessen && haftzugBestanden;
  const isHaftzugFailed = haftzugGemessen && !haftzugBestanden;
  const isHolzCrit = e.holzRest < 70;
  let overallRisk: BefundErgebnis['overallRisk'] = 'gering';
  if (isChlorideSevere || (isCarbDepassivated && pStatus === 'aktiv') || isHolzCrit || festigkeitsVerhaeltnis < 0.65) overallRisk = 'akut';
  else if (isChlorideCritical || isCarbDepassivated || isStrengthDeficient || isHaftzugFailed) overallRisk = 'hoch';
  else if (pStatus === 'unsicher' || (deckungGemessen && passivierungsReserve < 10)) overallRisk = 'mittel';
  if (!haftzugGemessen) h.push({ stufe: 'warnung', feld: 'haftzug', text: 'Haftzug = 0 gilt als „nicht gemessen“ und geht nicht in die Risikostufe ein.' });
  if (!deckungGemessen) h.push({ stufe: 'warnung', feld: 'deckung', text: 'Betondeckung = 0 gilt als „nicht gemessen“: keine Aussage zur Depassivierung.' });
  if (!festigkeitGemessen) h.push({ stufe: 'warnung', feld: 'fckIs', text: 'In-situ- oder Planfestigkeit = 0 gilt als „nicht gemessen“: kein Festigkeitsvergleich.' });
  return {
    passivierungsReserve, isCarbDepassivated, isChlorideCritical, isChlorideSevere, potentialStatus: pStatus,
    festigkeitsVerhaeltnis, isStrengthDeficient, isHaftzugOk, isHaftzugFailed, isHolzCrit,
    deckungGemessen, haftzugGemessen, festigkeitGemessen,
    holzRestWiderstand: Math.pow(e.holzRest / 100, 2) * 100,
    overallRisk, ...abschluss(h),
  };
}
