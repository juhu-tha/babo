/**
 * Rechenkern Prüfverfahren (Umsetzungsplan Phase 4, AP 4.2), übernommen 1:1 aus
 *  - src/modules/ZfP.tsx (zerstörungsfreie Prüfverfahren, Lehrsimulatoren)
 *  - src/modules/MessenPruefen.tsx und messenpruefen/BegriffeTab.tsx (GUM-Messunsicherheit, Ringversuch, Werkzeugtoleranzen)
 *  - src/modules/MechanischePruefungen.tsx (Bohrkern, Spaltzug, Marshall, Zugversuch Stahl, Holz)
 *  - src/modules/Festbeton.tsx (Bemessungswerte je Klasse, Festigkeitsentwicklung mit Geometrie und Lagerung)
 * Bereits vorhandene Bausteine werden genutzt: E_dyn und Impact-Echo aus bauwerksuntersuchung.ts, Bohrkern-Grundwerte
 * aus bauwerksuntersuchung.bohrkern, β_cc(t) und s aus betonkennwerte.ts, Stichprobenkennwerte aus statistik.ts.
 *
 * Formeln (Einheiten an den Feldern):
 *  - Rückprallhammer (ZfP): Richtungskorrektur ΔR(R, α) nach Herstellerformel Original Schmidt Typ N aus bauwerksuntersuchung.ts
 *    (Entscheidung 27.10.; vorher pauschal ∓3 mit vertauschtem Vorzeichen), einheitliche Lehrkurve f_c ≈ 0,0125·R^2,22 aus
 *    bauwerksuntersuchung.ts (Runde 5, Z55; vorher 0,027·R^2,1); ohne Kalibrierkerne nach DIN EN 13791:2020 nur Schätzung
 *  - Ultraschall: E_dyn = ρ·v²·(1 + ν)(1 − 2ν)/(1 − ν) mit ρ = 2400 kg/m³, ν = 0,2; f_c ≈ 20·(v − 2) (v in km/s, grob)
 *  - Georadar: v = c/√ε_r mit c = 300 mm/ns, Tiefe d = v·t/2
 *  - Wenner-Sonde: ρ = 2π·a·R; 1 Ω·m = 0,1 kΩ·cm; Korrosionsrisiko nach RILEM TC 154-EMC (Polder 2000, Tab. 2):
 *    < 100 Ω·m hoch, 100 … 500 mäßig, 500 … 1000 niedrig, > 1000 Ω·m vernachlässigbar (vorher Grenze 120 Ω·m)
 *  - Potential: einheitliche Einstufung potentialStufe aus bauwerksuntersuchung.ts (ASTM C876)
 *  - Karsten-Röhrchen: w = V·10/(A·√t) [kg/(m²·√h)] und Einstufung nach DIN 4108-3 einheitlich aus src/calc/karsten.ts
 *  - Durchstrahlung: I/I₀ = exp(−μ·d) mit μ = 0,15/E (cm⁻¹, stark vereinfachtes Lehrmodell)
 *  - GUM: u_A = s/√n, u_B,1 = d/(2√3) (Rechteckverteilung), u_B,2 = U_kal/2, u_c = √(Σu²), U = k·u_c
 *  - Ringversuch (DIN EN ISO 13528): z = (x − X)/σ_pt, E_n = (x − X)/√(U_lab² + U_ref²)
 *  - Bohrkern: f = F/A, Lehrfaktoren für Bewehrung und Bohrrichtung; nach DIN EN 13791:2020 entspricht ein Kern mit
 *    h/d = 1 dem Würfel 150 mm, ein Kern mit h/d = 2 dem Zylinder 150/300 mm (Runde 5: Faktor 0,82 entfällt); die jeweils
 *    andere Probenform über die Festigkeitsklassen (fckCubeVonFck/fckVonFckCube), Zwischenwerte von h/d über ASTM C42
 *  - Spaltzug: f_ct = 2F/(π·d·l); Marshall-Quotient S/F
 *  - Zugversuch: R_e = F_e/S₀, R_m = F_m/S₀, A_gt = (L_m − L₀)/L₀ mit der Messlänge L_m unter Höchstkraft (Runde 5:
 *    als A_gt beschriftet und mit DIN 488-1 verglichen: R_e ≥ 500, R_m/R_e ≥ 1,05/1,08, A_gt ≥ 2,5/5,0 %)
 *  - Holz: f_c,0 ≈ 90·ρ − 3, Feuchtefaktor 1 − 0,035·(min(u; 28) − 12), f_m = F·L/(b·h²) (4-Punkt-Biegung, Drittelspunkte),
 *    E ≈ 25 000·ρ·k_u (Lehr-Näherungen)
 *  - Festbeton: f_cd = α_cc·f_ck/γ_c, f_ctd = α_ct·f_ctk;0,05/γ_c, f_cm(t) = (f_ck + 8)·β_cc(t), f_ck(t) nach 3.1.2(5),
 *    Würfel 150 über f_ck,cube/f_ck der Festigkeitsklasse (statt pauschal 1,25), Lagerungsfaktoren
 * Reiner Rechenkern ohne Rundung – geprüft in tests/pruefverfahren.test.ts.
 */
import { type Hinweis, istEndlich, istAnzahl, hatFehler, muss, bereich, nurGueltig, MAX_STUETZSTELLEN, KEINE_KLASSE, type KeineKlasse } from './plausibilitaet';
import { dynamischerEModul, impactEcho, bohrkern, rueckprallLehrkurve, rueckprallRichtungskorrektur, RUECKPRALL_LEHRKURVE, RUECKPRALL_HINWEIS_SCHAETZUNG, potentialStufe } from './bauwerksuntersuchung';
import { fckZumAlter, fckCubeVonFck, fckVonFckCube, BETONSTAHL } from '../data/kennwerte';
import { betaCc, ZEMENT_S } from './betonkennwerte';
import type { Zementklasse } from './kriechenSchwinden';
import { stichprobe } from './statistik';
import { karstenAuswertung, saugKlasse } from './karsten';

export interface PruefErgebnis { gueltig: boolean; hinweise: Hinweis[] }
const abschluss = (h: Hinweis[]): PruefErgebnis => nurGueltig(({ gueltig: !hatFehler(h), hinweise: h }));

// ================================================================ ZfP
// ---------------------------------------------------------------- Rückprallhammer
/** Schlagwinkel α in Grad (Proceq-Konvention): '90' = senkrecht nach oben (Decke), '-90' = senkrecht nach unten (Boden) */
export type PruefWinkel = '0' | '90' | '45' | '-45' | '-90';
/** Einheitliche Lehrkurve f_c = a·R^b (bauwerksuntersuchung.ts; keine Bezugskurve nach DIN EN 13791) */
export const RUECKPRALL_ZFP = RUECKPRALL_LEHRKURVE;
/** Richtungskorrektur ΔR(R, α) auf horizontale Schlagrichtung (zentrale Funktion in bauwerksuntersuchung.ts) */
export function rueckprallKorrektur(winkel: PruefWinkel, r: number): number {
  return rueckprallRichtungskorrektur(r, Number(winkel));
}
/** Geschätzte Druckfestigkeit in N/mm² aus dem (korrigierten) Rückprallwert; unter R = 10 wird mit 10 gerechnet */
export function rueckprallFestigkeitLehr(r: number): number {
  return rueckprallLehrkurve(r);
}
export interface RueckprallZfpErgebnis extends PruefErgebnis { rCorr: number; fc: number }
export function rueckprallZfp(rueckprallwert: number, winkel: PruefWinkel): RueckprallZfpErgebnis {
  const h: Hinweis[] = [];
  muss(h, Number.isFinite(rueckprallwert), 'rebound', 'Der Rückprallwert muss eine Zahl sein.');
  const rCorr = rueckprallwert + rueckprallKorrektur(winkel, rueckprallwert);
  const fc = rueckprallFestigkeitLehr(rCorr);
  if (rCorr < RUECKPRALL_ZFP.rMin) h.push({ stufe: 'warnung', feld: 'rebound', text: 'Korrigierter Rückprallwert unter 10: Die Lehrkurve wird mit R = 10 ausgewertet.' });
  bereich(h, 'rebound', rueckprallwert, 20, 60, 'Rückprallwert außerhalb 20 … 60: Die Lehr-Näherung ist dort nicht abgesichert.');
  h.push({ stufe: 'warnung', feld: 'fc', text: RUECKPRALL_HINWEIS_SCHAETZUNG });
  return nurGueltig({ rCorr, fc, ...abschluss(h) });
}
/** Kurvenschar des Diagramms (horizontal, nach unten α = −90°, nach oben α = +90°) über dem abgelesenen R = von … bis */
export function rueckprallKurven(von = 20, bis = 60, schritt = 2) {
  const labels: number[] = [], horizontal: number[] = [], unten: number[] = [], oben: number[] = [];
  // Grenzfallprüfung 02.11.2026: ungültiger Bereich oder Schritt ≤ 0 → leere Kurven (vorher Endlosschleife)
  if (!istEndlich(von, bis, schritt) || schritt <= 0 || (bis - von) / schritt > MAX_STUETZSTELLEN) return { labels, horizontal, unten, oben };
  for (let r = von; r <= bis; r += schritt) {
    labels.push(r);
    horizontal.push(rueckprallFestigkeitLehr(r));
    unten.push(rueckprallFestigkeitLehr(r + rueckprallKorrektur('-90', r)));
    oben.push(rueckprallFestigkeitLehr(r + rueckprallKorrektur('90', r)));
  }
  return { labels, horizontal, unten, oben };
}

// ---------------------------------------------------------------- Ultraschall
export interface UltraschallZfpErgebnis extends PruefErgebnis {
  /** dynamischer E-Modul in GPa */
  eDyn: number;
  /** grobe Festigkeitsabschätzung in N/mm² */
  fcEst: number;
}
/** v in km/s; Dichte in kg/m³ (Modul: 2400), ν = 0,2 */
export function ultraschallZfp(vKmS: number, dichte = 2400, nu = 0.2): UltraschallZfpErgebnis {
  const h: Hinweis[] = [];
  muss(h, istEndlich(vKmS, dichte, nu) && vKmS > 0 && dichte > 0, 'velocity', 'Schallgeschwindigkeit und Dichte müssen größer als 0 sein.');
  const eDyn = dynamischerEModul(dichte, vKmS * 1000, nu) * 1e-9;
  const fcEst = Math.max(0, (vKmS - 2.0) * 20);
  if (vKmS < 2.0) h.push({ stufe: 'warnung', feld: 'velocity', text: 'v < 2 km/s: Die grobe Festigkeitsabschätzung liefert 0 N/mm².' });
  bereich(h, 'velocity', vKmS, 2.0, 5.5, 'Schallgeschwindigkeit außerhalb 2 … 5,5 km/s ist für Beton unüblich.');
  return nurGueltig({ eDyn, fcEst, ...abschluss(h) });
}

// ---------------------------------------------------------------- Impact-Echo
export interface ImpactEchoZfpErgebnis extends PruefErgebnis { /** Dicke in mm */ depth: number }
/** f in kHz, v_p in m/s; d = β·v_p/(2f) mit β = 0,96 (Kern bauwerksuntersuchung.impactEcho) */
export function impactEchoZfp(frequenzKHz: number, vp: number): ImpactEchoZfpErgebnis {
  const ie = impactEcho(frequenzKHz, vp, 0);
  return nurGueltig({ depth: ie.dickeCm * 10, ...abschluss(ie.hinweise.filter(x => x.stufe === 'fehler')) });
}

// ---------------------------------------------------------------- Bewehrungssucher und Georadar
/** Signalstärke in % (Anzeigemodell): max(0; 100 − 20·c/Ø) */
export function bewehrungsSignal(deckungMm: number, stabDmMm: number): number {
  return Math.max(0, 100 - (deckungMm / stabDmMm) * 20);
}
/** Lichtgeschwindigkeit im Vakuum in mm/ns */
export const C_MM_NS = 300;
export interface RadarErgebnis extends PruefErgebnis { /** mm/ns */ vRadar: number; /** mm */ depth: number }
export function georadar(epsilonR: number, laufzeitNs: number): RadarErgebnis {
  const h: Hinweis[] = [];
  muss(h, istEndlich(epsilonR, laufzeitNs) && epsilonR >= 1 && laufzeitNs >= 0, 'dielectric', 'ε_r muss ≥ 1 und die Laufzeit ≥ 0 sein.');
  const vRadar = C_MM_NS / Math.sqrt(epsilonR);
  return nurGueltig({ vRadar, depth: (vRadar * laufzeitNs) / 2, ...abschluss(h) });
}

// ---------------------------------------------------------------- Potentialfeld, Wenner, Torrent
export type PotentialRisiko = 'gering' | 'mittel' | 'hoch' | KeineKlasse;
/** Einstufung im Modul ZfP (mV gegen Cu/CuSO₄) mit den einheitlichen Grenzen nach ASTM C876 (potentialStufe):
 *  < −350 hoch, −350 … −200 mittel (ungewiss), > −200 gering. Vorher galt −200 mV selbst als „gering“. */
export function potentialRisikoZfp(potentialMv: number): PotentialRisiko {
  const s = potentialStufe(potentialMv);
  return s === KEINE_KLASSE ? KEINE_KLASSE : s === 'hoch' ? 'hoch' : s === 'ungewiss' ? 'mittel' : 'gering';
}
/** Grenzen des Korrosionsrisikos aus dem Betonwiderstand in Ω·m (RILEM TC 154-EMC, Polder 2000, Tab. 2; OPC-Beton, 20 °C) */
export const WENNER_GRENZEN_OHM_M = { hoch: 100, maessig: 500, niedrig: 1000 } as const;
export type WennerStufe = 'sehr_hoch' | 'mittel' | 'niedrig' | 'vernachlaessigbar' | KeineKlasse;
export interface WennerErgebnis extends PruefErgebnis { /** Ω·m */ rho: number; /** kΩ·cm */ rhoKohmCm: number; stufe: WennerStufe }
/** Elektrodenabstand a in mm, Widerstand R in Ω */
export function wenner(abstandMm: number, widerstandOhm: number): WennerErgebnis {
  const h: Hinweis[] = [];
  muss(h, istEndlich(abstandMm, widerstandOhm) && abstandMm > 0 && widerstandOhm >= 0, 'wenner', 'Elektrodenabstand > 0 und Widerstand ≥ 0 erforderlich.');
  const rho = 2 * Math.PI * (abstandMm / 1000) * widerstandOhm;
  const g = WENNER_GRENZEN_OHM_M;
  const stufe: WennerStufe = rho < g.hoch ? 'sehr_hoch' : rho < g.maessig ? 'mittel' : rho < g.niedrig ? 'niedrig' : 'vernachlaessigbar';
  if (!hatFehler(h)) h.push({ stufe: 'warnung', feld: 'wenner', text: 'Klassengrenzen nach RILEM TC 154-EMC als Anhalt für OPC-Beton bei 20 °C; Feuchte, Temperatur und Zementart verschieben den Widerstand stark.' });
  return nurGueltig({ rho, rhoKohmCm: rho / 10, stufe, ...abschluss(h) }, ['stufe']);
}
/** Permeabilitätsklasse 1 … 5 (sehr niedrig … sehr hoch) aus k_T in 10⁻¹⁶ m² */
export function torrentKlasse(kT: number): 1 | 2 | 3 | 4 | 5 | KeineKlasse {
  if (!Number.isFinite(kT)) return KEINE_KLASSE; // F-1 (02.11.2026): keine Zahl → keine Klasse
  if (kT >= 10.0) return 5;
  if (kT >= 1.0) return 4;
  if (kT >= 0.1) return 3;
  if (kT >= 0.01) return 2;
  return 1;
}
/** Betonfeuchte in %: > 85 kritisch, > 70 hoch */
export function torrentFeuchte(feuchteProzent: number): 'normal' | 'hoch' | 'kritisch' | KeineKlasse {
  if (!Number.isFinite(feuchteProzent)) return KEINE_KLASSE; // F-1 (02.11.2026): keine Zahl → keine Klasse
  return feuchteProzent > 85 ? 'kritisch' : feuchteProzent > 70 ? 'hoch' : 'normal';
}

// ---------------------------------------------------------------- Karsten-Röhrchen
export type KarstenStufe = 'abweisend' | 'hemmend' | 'saugend' | KeineKlasse;
export interface KarstenZfpErgebnis extends PruefErgebnis { /** kg/(m²·√h) */ w: number; tHours: number; stufe: KarstenStufe }
/** Prüfzeit in min, aufgenommene Wassermenge in ml */
export function karstenZfp(zeitMin: number, wasserMl: number): KarstenZfpErgebnis {
  const h: Hinweis[] = [];
  muss(h, istEndlich(zeitMin, wasserMl) && zeitMin > 0 && wasserMl >= 0, 'karsten', 'Prüfzeit > 0 und Wassermenge ≥ 0 erforderlich.');
  const tHours = zeitMin / 60;
  // Runde 5: Prüffläche und Grenzwerte DIN 4108-3 (0,5 / 2,0 kg/(m²·√h)) einheitlich mit der Bauwerksuntersuchung
  const k = karstenAuswertung(wasserMl, zeitMin);
  const klasse = saugKlasse(k.w);
  const stufe: KarstenStufe = klasse === 'wassersaugend' ? 'saugend' : klasse === 'wasserhemmend' ? 'hemmend' : 'abweisend';
  if (!hatFehler(h)) h.push(...k.hinweise);
  return nurGueltig({ w: hatFehler(h) ? 0 : k.w, tHours, stufe, ...abschluss(h) }, ['stufe']);
}

// ---------------------------------------------------------------- Thermografie und Durchstrahlung
/** Temperaturkontrast ΔT in K: > 2 deutlich, > 0,5 möglich */
export function thermografieStufe(deltaT: number): 'unauffaellig' | 'moeglich' | 'deutlich' | KeineKlasse {
  if (!Number.isFinite(deltaT)) return KEINE_KLASSE; // F-1 (02.11.2026): keine Zahl → keine Klasse
  return deltaT > 2.0 ? 'deutlich' : deltaT > 0.5 ? 'moeglich' : 'unauffaellig';
}
export interface DurchstrahlungErgebnis extends PruefErgebnis { /** % */ transmission: number; stufe: 'gut' | 'ausreichend' | 'schlecht' | KeineKlasse }
/** Bauteildicke in cm, Strahlungsenergie in MeV */
export function durchstrahlung(dickeCm: number, energieMeV: number): DurchstrahlungErgebnis {
  const h: Hinweis[] = [];
  muss(h, istEndlich(dickeCm, energieMeV) && energieMeV > 0 && dickeCm >= 0, 'radiation', 'Energie > 0 und Dicke ≥ 0 erforderlich.');
  const mu = 0.15 / energieMeV;
  const transmission = Math.exp(-mu * dickeCm) * 100;
  const stufe: DurchstrahlungErgebnis['stufe'] = transmission < 1 ? 'schlecht' : transmission < 5 ? 'ausreichend' : 'gut';
  return nurGueltig({ transmission, stufe, ...abschluss(h) }, ['stufe']);
}

// ================================================================ Messen & Prüfen
/** Messwerte aus Text: mit Semikolon → Semikolon trennt, Komma ist Dezimalzeichen; sonst trennt das Komma (Punkt dezimal) */
export function messwerteAusText(text: string): number[] {
  const teile = text.includes(';')
    ? text.split(';').map(v => v.trim().replace(',', '.'))
    : text.split(',').map(v => v.trim());
  return teile.map(v => parseFloat(v)).filter(v => Number.isFinite(v));
}

export interface GumErgebnis extends PruefErgebnis {
  n: number; mean: number; sampleStdDev: number;
  uA: number; uB1: number; uB2: number; uc: number; expandedU: number;
  minInterval: number; maxInterval: number;
}
/** GUM-Unsicherheitsbudget: Auflösung d (Rechteck), Kalibrierunsicherheit U_kal (k = 2), Erweiterungsfaktor k */
export function gumMessunsicherheit(werte: readonly number[], aufloesung: number, uKal: number, k = 2): GumErgebnis {
  const h: Hinweis[] = [];
  const n = werte.length;
  muss(h, istEndlich(aufloesung, uKal, k) && aufloesung >= 0 && uKal >= 0 && k > 0, 'aufloesung', 'Auflösung und Kalibrierunsicherheit müssen ≥ 0 sein.');
  muss(h, n >= 2, 'messwerte', 'Für die Typ-A-Unsicherheit sind mindestens 2 Messwerte nötig.');
  // Grenzfallprüfung 02.11.2026: Messwerte prüfen (vorher NaN/∞ ohne Hinweis)
  muss(h, istEndlich(...werte), 'messwerte', 'Alle Messwerte müssen Zahlen sein.');
  if (n < 2) {
    return nurGueltig({ n, mean: n === 1 ? werte[0] : 0, sampleStdDev: 0, uA: 0, uB1: 0, uB2: 0, uc: 0, expandedU: 0, minInterval: 0, maxInterval: 0, ...abschluss(h) });
  }
  const st = stichprobe(werte);
  const uA = st.stdAbw / Math.sqrt(n);
  const uB1 = aufloesung / (2 * Math.sqrt(3));
  const uB2 = uKal / 2;
  const uc = Math.sqrt(uA * uA + uB1 * uB1 + uB2 * uB2);
  const expandedU = k * uc;
  if (n < 10 && uA > Math.max(uB1, uB2)) h.push({ stufe: 'warnung', feld: 'messwerte', text: 'Wenige Messwerte und u_A dominiert: k = 2 deckt dann weniger als 95 % ab (GUM: k aus der t-Verteilung mit effektivem Freiheitsgrad).' });
  return nurGueltig({ n, mean: st.mittelwert, sampleStdDev: st.stdAbw, uA, uB1, uB2, uc, expandedU, minInterval: st.mittelwert - expandedU, maxInterval: st.mittelwert + expandedU, ...abschluss(h) });
}

export interface RingversuchEingabe {
  /** Laborergebnis x_lab */ x: number;
  /** zugewiesener Wert X */ X: number;
  /** Standardabweichung für die Eignungsbeurteilung σ_pt */ sigmaPt: number;
  /** erweiterte Unsicherheiten (k = 2) */ uLab: number; uRef: number;
  /** Versatz Probe B für den Youden-Plot */ offsetB: number;
}
export interface RingversuchErgebnis extends PruefErgebnis {
  dVal: number; zScore: number; absZ: number; zStatus: 'ok' | 'warning' | 'critical' | KeineKlasse;
  denomEn: number; enScore: number; absEn: number; enStatus: 'ok' | 'critical' | KeineKlasse;
  /** eigener Punkt im Youden-Plot (Probe A, Probe B) */
  currentLab: { a: number; b: number };
}
/** z-Score und E_n-Wert nach DIN EN ISO 13528: |z| ≤ 2 zufriedenstellend, 2 < |z| < 3 fraglich, |z| ≥ 3 unbefriedigend; |E_n| ≤ 1 */
export function ringversuch(e: RingversuchEingabe): RingversuchErgebnis {
  const h: Hinweis[] = [];
  muss(h, istEndlich(e.x, e.X, e.sigmaPt, e.uLab, e.uRef, e.offsetB), 'eingabe', 'Alle Eingaben müssen Zahlen sein.');
  muss(h, e.sigmaPt > 0, 'sigmaPt', 'σ_pt muss größer als 0 sein, sonst ist kein z-Score definiert.');
  muss(h, e.uLab >= 0 && e.uRef >= 0 && (e.uLab > 0 || e.uRef > 0), 'uLab', 'Die Unsicherheiten müssen ≥ 0 sein und dürfen nicht beide 0 sein.');
  const dVal = e.x - e.X;
  const zScore = e.sigmaPt > 0 ? dVal / e.sigmaPt : 0;
  const absZ = Math.abs(zScore);
  const zStatus = absZ <= 2.0 ? 'ok' : absZ < 3.0 ? 'warning' : 'critical';
  const denomEn = Math.sqrt(e.uLab * e.uLab + e.uRef * e.uRef);
  const enScore = denomEn > 0 ? dVal / denomEn : 0;
  const absEn = Math.abs(enScore);
  const currentLab = { a: e.x, b: e.X + e.offsetB + dVal * 0.95 };
  return nurGueltig({ dVal, zScore, absZ, zStatus, denomEn, enScore, absEn, enStatus: absEn <= 1.0 ? 'ok' : 'critical', currentLab, ...abschluss(h) }, ['zStatus', 'enStatus']);
}

export type Messwerkzeug = 'meterstab' | 'messschieber' | 'laser' | 'risslupe' | 'nivellier';
/** Fehlergrenze bzw. Standardabweichung in mm für eine Messgröße in mm (Richtwerte des Moduls):
 *  Gliedermaßstab Kl. II ±(0,3 + 0,2·L), Messschieber ±0,03 (≤ 100 mm) / ±0,05, Laser ±(1,0 + 0,05·L) (L in m),
 *  Risslupe ±0,05, Nivellier 1,5 mm/√km, mindestens 0,5 mm */
export function werkzeugToleranz(werkzeug: Messwerkzeug, wertMm: number): number {
  const lM = wertMm / 1000;
  switch (werkzeug) {
    case 'meterstab': return 0.3 + 0.2 * lM;
    case 'messschieber': return wertMm <= 100 ? 0.03 : 0.05;
    case 'laser': return 1.0 + 0.05 * lM;
    case 'risslupe': return 0.05;
    case 'nivellier': return Math.max(0.5, 1.5 * Math.sqrt(lM / 1000));
  }
}

// ================================================================ Mechanische Prüfungen
/** Schlankheitsfaktoren auf h/d = 2 nach ASTM C42/C42M (Stützstellen, linear interpoliert) */
export const ASTM_C42_FAKTOREN: readonly (readonly [number, number])[] = [[1.0, 0.87], [1.25, 0.93], [1.5, 0.96], [1.75, 0.98], [2.0, 1.0]];
/** Lehrannahme: +3,5 % je querendem Bewehrungsstab */
export const FAKTOR_JE_STAB = 0.035;
/** Bohrrichtung horizontal: Literaturansatz BS 1881-120 (2,5/2,3 ≈ 1,085) */
export const FAKTOR_HORIZONTAL = 1.085;

/** Schlankheitsfaktor λ(h/d): NaN für h/d < 1 (nicht prüfbar), 1,0 für h/d > 2 */
export function schlankheitsfaktorAstm(hd: number): number {
  if (hd > 2.0) return 1.0;
  for (let i = 0; i < ASTM_C42_FAKTOREN.length - 1; i++) {
    const [l0, k0] = ASTM_C42_FAKTOREN[i];
    const [l1, k1] = ASTM_C42_FAKTOREN[i + 1];
    if (hd >= l0 && hd <= l1) return k0 + (k1 - k0) * (hd - l0) / (l1 - l0);
  }
  return NaN;
}
export interface BohrkernPruefungEingabe { dMm: number; hMm: number; kraftKn: number; staebe: number; richtung: 'vertikal' | 'horizontal' }
export interface BohrkernPruefungErgebnis extends PruefErgebnis {
  area: number; rawStrength: number; aspect: number;
  lambdaAspect: number; lambdaRebar: number; lambdaDirection: number;
  fcCore: number; equivalentCylinder: number; equivalentCube: number;
}
export function bohrkernPruefung(e: BohrkernPruefungEingabe): BohrkernPruefungErgebnis {
  const b = bohrkern(e.dMm, e.hMm, e.kraftKn);
  const h: Hinweis[] = b.hinweise.filter(x => x.stufe === 'fehler');
  muss(h, Number.isFinite(e.staebe) && e.staebe >= 0, 'staebe', 'Die Anzahl der Bewehrungsstäbe muss ≥ 0 sein.');
  const lambdaAspect = schlankheitsfaktorAstm(b.schlankheit);
  const lambdaRebar = 1.0 + FAKTOR_JE_STAB * e.staebe;
  const lambdaDirection = e.richtung === 'horizontal' ? FAKTOR_HORIZONTAL : 1.0;
  // Runde 5 (Z55): DIN EN 13791:2020 – Kern h/d = 1 entspricht dem Würfel 150 mm, h/d = 2 dem Zylinder 150/300 mm.
  // Die andere Probenform folgt über die Festigkeitsklassen (Tab. 3.1), nicht über 1/0,82; ASTM C42 nur für Zwischenwerte.
  const fKern = b.festigkeit * lambdaRebar * lambdaDirection;
  let lambda = lambdaAspect, equivalentCylinder: number, equivalentCube: number;
  if (b.bezug === 'wuerfel') {
    lambda = 1.0; equivalentCube = fKern; equivalentCylinder = fckVonFckCube(fKern);
  } else if (b.bezug === 'zylinder' || b.schlankheit > 2) {
    lambda = 1.0; equivalentCylinder = fKern; equivalentCube = fckCubeVonFck(fKern);
  } else {
    equivalentCylinder = fKern * lambdaAspect; equivalentCube = fckCubeVonFck(equivalentCylinder);
    if (b.schlankheit >= 1) h.push({ stufe: 'warnung', feld: 'concreteHeight', text: 'h/d weder 1 noch 2: Umrechnung auf h/d = 2 mit den Schlankheitsfaktoren nach ASTM C42 (DIN EN 13791 sieht h/d = 1 oder 2 vor).' });
  }
  const fcCore = b.festigkeit * lambda * lambdaRebar * lambdaDirection;
  if (b.schlankheit < 1) h.push({ stufe: 'fehler', feld: 'concreteHeight', text: 'h/d < 1: Der Kern ist nicht prüfbar.' });
  if (b.schlankheit > 2) h.push({ stufe: 'warnung', feld: 'concreteHeight', text: 'h/d > 2: Kern auf h/d = 2 kürzen; gerechnet wird wie mit h/d = 2.' });
  if (e.staebe > 0) h.push({ stufe: 'warnung', feld: 'staebe', text: 'Bewehrung im Kern: +3,5 % je Stab ist eine Lehrannahme; nach DIN EN 12504-1 sollen Kerne möglichst bewehrungsfrei sein.' });
  if (!hatFehler(h)) h.push({ stufe: 'warnung', feld: 'equivalentCube', text: 'Umrechnung Zylinder ↔ Würfel über das Verhältnis f_ck,cube/f_ck der Festigkeitsklassen (Tab. 3.1) – für Einzelwerte eine Näherung.' });
  return nurGueltig({
    area: b.flaecheMm2, rawStrength: b.festigkeit, aspect: b.schlankheit, lambdaAspect: lambda, lambdaRebar, lambdaDirection,
    fcCore, equivalentCylinder, equivalentCube, ...abschluss(h),
  });
}

/** Spaltzugfestigkeit f_ct = 2F/(π·d·l) in N/mm² (F in kN, d und l in mm) */
export function spaltzugfestigkeit(kraftKn: number, dMm: number, lMm: number): number {
  return (2 * kraftKn * 1000) / (Math.PI * dMm * lMm);
}
/** Biegezugfestigkeit bei 4-Punkt-Biegung mit Lasten in den Drittelspunkten: f_m = 3F·(L/3)/(b·h²) = F·L/(b·h²) */
export function biegezug4Punkt(kraftKn: number, stuetzweiteMm: number, bMm: number, hMm: number): number {
  return (3 * kraftKn * 1000 * (stuetzweiteMm / 3)) / (bMm * hMm * hMm);
}
/** Marshall-Quotient Stabilität/Fließwert in kN/mm */
export function marshallQuotient(stabilitaetKn: number, fliesswertMm: number): number {
  return stabilitaetKn / fliesswertMm;
}

export type StahlEinstufung = 'nicht' | 'B500A' | 'B500B' | KeineKlasse;
/** luMm: Messlänge L_m unter Höchstkraft F_m (Extensometer) in mm – daraus die Gesamtdehnung bei Höchstkraft A_gt */
export interface ZugversuchEingabe { dMm: number; kraftReKn: number; kraftRmKn: number; l0Mm: number; luMm: number }
export interface ZugversuchErgebnis extends PruefErgebnis {
  /** elongation: Gesamtdehnung bei Höchstkraft A_gt in % */
  area: number; yieldStrength: number; ultimateStrength: number; ratio: number; elongation: number;
  yieldPassed: boolean; ratiosPassed: boolean; elongationPassed: boolean; einstufung: StahlEinstufung;
}
/** Einzelwertvergleich mit B500A/B500B nach DIN 488-1 (R_e ≥ 500; R_m/R_e ≥ 1,05/1,08; A_gt ≥ 2,5/5,0 %; Werte aus
 *  src/data/kennwerte.ts BETONSTAHL, ε_uk = A_gt). Die Flags yield/ratios/elongationPassed beziehen sich auf B500B. */
export function zugversuchStahl(e: ZugversuchEingabe): ZugversuchErgebnis {
  const h: Hinweis[] = [];
  muss(h, istEndlich(e.dMm, e.kraftReKn, e.kraftRmKn, e.l0Mm, e.luMm), 'eingabe', 'Alle Eingaben müssen Zahlen sein.');
  muss(h, e.dMm > 0 && e.kraftReKn > 0 && e.l0Mm > 0, 'steelDiam', 'Durchmesser, Streckgrenzenkraft und Anfangsmesslänge müssen größer als 0 sein.');
  const area = Math.PI * Math.pow(e.dMm / 2, 2);
  const yieldStrength = (e.kraftReKn * 1000) / area;
  const ultimateStrength = (e.kraftRmKn * 1000) / area;
  const ratio = ultimateStrength / yieldStrength;
  const elongation = ((e.luMm - e.l0Mm) / e.l0Mm) * 100;
  const A = BETONSTAHL.B500A, B = BETONSTAHL.B500B;
  const einstufung: StahlEinstufung = yieldStrength >= B.fyk && ratio >= B.k && elongation >= B.euk / 10 ? 'B500B'
    : yieldStrength >= A.fyk && ratio >= A.k && elongation >= A.euk / 10 ? 'B500A' : 'nicht';
  if (e.kraftRmKn < e.kraftReKn) h.push({ stufe: 'warnung', feld: 'steelForceUltimate', text: 'F_m < F_e: Die Höchstkraft liegt unter der Streckgrenzenkraft.' });
  h.push({ stufe: 'warnung', feld: 'elongation', text: 'A_gt = (L_m − L₀)/L₀ aus der Messlänge unter Höchstkraft (einschließlich elastischem Anteil). Die Bruchdehnung A nach dem Bruch ist größer und darf nicht mit den A_gt-Grenzen der DIN 488-1 verglichen werden. Einzelwert – die Norm bewertet charakteristische Werte aus Prüfserien.' });
  if (einstufung === 'B500B' && yieldStrength > 1.3 * B.fyk) h.push({ stufe: 'warnung', feld: 'steelForceYield', text: 'R_e > 1,30·R_e,nenn: Die Obergrenze R_e,ist/R_e,nenn für B500B ist zu prüfen (vorläufig, Normprüfung ausstehend).' });
  return nurGueltig({ area, yieldStrength, ultimateStrength, ratio, elongation, yieldPassed: yieldStrength >= B.fyk, ratiosPassed: ratio >= B.k, elongationPassed: elongation >= B.euk / 10, einstufung, ...abschluss(h) }, ['einstufung']);
}

export type HolzNiveau = 'unterC18' | 'laubholz' | 'C30' | 'C24' | 'C18' | KeineKlasse;
export interface HolzEingabe { rohdichte: number; feuchte: number; bMm: number; hMm: number; stuetzweiteMm: number; kraftKn: number }
export interface HolzErgebnis extends PruefErgebnis {
  feuchteFaktor: number; fc0_actual: number; f_bending: number; e_modul: number; niveau: HolzNiveau;
}
/** Lehr-Näherungen für Nadelholz: Rohdichte in g/cm³, Holzfeuchte in %, Biegeprüfung nach DIN EN 408 (4-Punkt) */
export function holzSchaetzung(e: HolzEingabe): HolzErgebnis {
  const h: Hinweis[] = [];
  muss(h, istEndlich(e.rohdichte, e.feuchte, e.bMm, e.hMm, e.stuetzweiteMm, e.kraftKn), 'eingabe', 'Alle Eingaben müssen Zahlen sein.');
  muss(h, e.rohdichte > 0 && e.bMm > 0 && e.hMm > 0 && e.stuetzweiteMm > 0 && e.kraftKn >= 0, 'woodWidth', 'Rohdichte und Abmessungen müssen größer als 0 sein, die Kraft ≥ 0.');
  const fc0Basis = 90 * e.rohdichte - 3;
  const feuchteFaktor = 1.0 - 0.035 * (Math.min(e.feuchte, 28) - 12);
  const f_bending = biegezug4Punkt(e.kraftKn, e.stuetzweiteMm, e.bMm, e.hMm);
  const niveau: HolzNiveau = e.rohdichte >= 0.65 ? 'laubholz' : f_bending >= 30 ? 'C30' : f_bending >= 24 ? 'C24' : f_bending >= 18 ? 'C18' : 'unterC18';
  if (e.feuchte > 28) h.push({ stufe: 'warnung', feld: 'woodMoisture', text: 'Holzfeuchte über Fasersättigung (≈ 28 %): Der Feuchtefaktor wird nicht weiter abgemindert.' });
  return nurGueltig({ feuchteFaktor, fc0_actual: fc0Basis * feuchteFaktor, f_bending, e_modul: 25000 * e.rohdichte * feuchteFaktor, niveau, ...abschluss(h) }, ['niveau']);
}

// ================================================================ Festbeton
/** Bemessungswerte f_cd = α_cc·f_ck/γ_c und f_ctd = α_ct·f_ctk;0,05/γ_c in N/mm² */
export function bemessungswerteBeton(fck: number, fctk005: number, alphaCc: number, alphaCt: number, gammaC: number) {
  const h: Hinweis[] = [];
  muss(h, istEndlich(fck, fctk005, alphaCc, alphaCt, gammaC) && gammaC > 0, 'gammaC', 'γ_c muss größer als 0 sein.');
  return nurGueltig({ fcd: (alphaCc * fck) / gammaC, fctd: (alphaCt * fctk005) / gammaC, ...abschluss(h) });
}

export type Probekoerper = 'zyl_150' | 'cube_150' | 'cube_100' | 'cube_200';
export type Lagerung = 'norm' | 'feucht' | 'luft' | 'heiss';
/** Lehrfaktoren der Würfelgröße bezogen auf den Würfel 150 mm (aus dem Modul übernommen: 1,30/1,25 bzw. 1,20/1,25) */
export const WUERFEL_GROESSE_FAKTOR: Readonly<Record<Exclude<Probekoerper, 'zyl_150'>, number>> = { cube_150: 1.0, cube_100: 1.04, cube_200: 0.96 };
/** Faktor bezogen auf den Zylinder 150/300 mm: Würfel 150 über f_ck,cube/f_ck der Festigkeitsklasse (Runde 5, statt pauschal 1,25) */
export function geometrieFaktor(geo: Probekoerper, fck: number): number {
  if (geo === 'zyl_150') return 1.0;
  return (fckCubeVonFck(fck) / fck) * WUERFEL_GROESSE_FAKTOR[geo];
}
/** Lehrfaktoren der Lagerung bezogen auf die Normlagerung */
export const LAGERUNG_FAKTOR: Readonly<Record<Lagerung, number>> = { norm: 1.0, feucht: 0.95, luft: 0.90, heiss: 0.85 };

export interface FestigkeitsentwicklungEingabe { fck: number; alterTage: number; zement: Zementklasse; geometrie: Probekoerper; lagerung: Lagerung }
export interface FestigkeitsentwicklungErgebnis extends PruefErgebnis {
  s: number; betaCc: number; fcmRef: number; fcmT: number; geoFaktor: number; lagerungsFaktor: number; fcmTeff: number;
  /** charakteristische Zylinderfestigkeit f_ck(t) nach DIN EN 1992-1-1, 3.1.2(5): f_cm(t) − 8 für t < 28 d, f_ck für t ≥ 28 d */
  fckT: number;
}
/** f_cm(t) = (f_ck + 8)·β_cc(t) nach DIN EN 1992-1-1, Gl. (3.1)/(3.2), umgerechnet auf Probekörper und Lagerung */
export function festigkeitsentwicklung(e: FestigkeitsentwicklungEingabe): FestigkeitsentwicklungErgebnis {
  const h: Hinweis[] = [];
  muss(h, istEndlich(e.fck, e.alterTage) && e.alterTage > 0, 'alter', 'Das Betonalter muss größer als 0 Tage sein.');
  muss(h, e.fck > 0, 'fck', 'f_ck muss größer als 0 sein.');
  const s = ZEMENT_S[e.zement];
  const bcc = betaCc(s, e.alterTage);
  const fcmRef = e.fck + 8;
  const fcmT = fcmRef * bcc;
  const geoFaktor = geometrieFaktor(e.geometrie, e.fck);
  const lagerungsFaktor = LAGERUNG_FAKTOR[e.lagerung];
  if (e.alterTage > 28) h.push({ stufe: 'warnung', feld: 'alter', text: 'Nach 28 Tagen: β_cc > 1 beschreibt die Nacherhärtung des Mittelwerts f_cm(t); nach DIN EN 1992-1-1, 3.1.2(5) gilt für t ≥ 28 d f_ck(t) = f_ck.' });
  if (e.alterTage <= 3) h.push({ stufe: 'warnung', feld: 'alter', text: 't ≤ 3 d: f_ck(t) = f_cm(t) − 8 ist nach 3.1.2(5) erst für 3 d < t < 28 d angegeben.' });
  const fckT = fckZumAlter(e.fck, fcmT, e.alterTage);
  return nurGueltig({ s, betaCc: bcc, fcmRef, fcmT, geoFaktor, lagerungsFaktor, fcmTeff: fcmT * geoFaktor * lagerungsFaktor, fckT, ...abschluss(h) });
}
