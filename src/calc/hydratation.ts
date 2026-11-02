/**
 * Rechenkern Hydratation, Reife und Nachbehandlung (Umsetzungsplan Phase 4, AP 4.2).
 * Übernimmt die Rechnungen aus src/modules/Hydratation.tsx, src/modules/HydratationPruefverfahren.tsx und
 * src/modules/Nachbehandlung.tsx (Verhalten 1:1, Abweichungen unten benannt):
 *  1. Reifefunktionen k_T(T): Arrhenius exp[E_a/R·(1/T_r − 1/T)], fib Model Code 2010 (Q = 4000 K, auf 20 °C bezogen),
 *     Saul (T + 10)/30, Rastrup 2^((T − 20)/10) (Rastrup, E.: Heat of hydration in concrete. Magazine of Concrete
 *     Research 6 (1954) 17, S. 79–92; vorher irreführend als „DIN 1045-3 (Rastrup)“ bezeichnet – DIN 1045-3 enthält
 *     keine Reifefunktion), gewogene Reife nach NEN 5970 als Temperaturfaktor C^((T − 20)/10) mit zementabhängigem
 *     C = 1,15 … 1,75, Standard 1,45 (vorläufig, F-Freigabe, siehe GEWOGENE_REIFE_C); unter −10 °C k_T = 0.
 *     Wirksames Alter t_e = Σ k_T(T_Kern)·Δt mit Δt = 0,1 d (explizit, Kerntemperatur des vorigen Schritts).
 *  2. Festigkeitsentwicklung nach DIN EN 1992-1-1, 3.1.2 und 3.1.3: β_cc(t_e) = exp[s·(1 − √(28/t_e))] (Gl. 3.2,
 *     im Modul auf 1,25 begrenzt), f_cm(t) = β_cc·f_cm, f_ctm(t) = β_cc^α·f_ctm (Gl. 3.4, α = 1 für t_e < 28 d, sonst 2/3),
 *     E_cm(t) = β_cc^0,3·E_cm (Gl. 3.5). f_cm = f_ck + 8, f_ctm über fctmVonFck (Tab. 3.1), E_cm über ecmVonFcm.
 *  3. Hydratationswärme Q(t_e) = H_max·t_e/(t_e + t_50) (hyperbolischer Lehransatz), adiabatische Erwärmung
 *     ΔT = z·ΔQ/(c·ρ) mit c·ρ = 1,0 kJ/(kg·K)·2400 kg/m³; Kern- und Randtemperatur mit pauschaler Wärmeabfuhr.
 *  4. Reißrahmen-Simulation (Lehrmodell, 0 … 72 h): Temperatur, Zugfestigkeit, Zwangspannung und Risszeitpunkt.
 *  5. Verdunstungsrate nach ACI 305R (Gleichung nach Uno, metrisch):
 *     E = 5·[(T_c + 18)^2,5 − r·(T_a + 18)^2,5]·(V + 4)·10⁻⁶ in kg/(m²·h), T in °C, V in km/h.
 *  6. Mindestdauer der Nachbehandlung nach DIN 1045-3 (Tabellenwerte in src/data/normParams.ts).
 *  7. Praxisbeispiel massiges Bauteil aus src/modules/Praxisbeispiele.tsx (Temperatur, Zwang, Mindestbewehrung; Lehrmodell).
 * Abweichungen gegenüber der Moduldatei: Zeitachse ganzzahlig bis 28,0 d (die Gleitkommaschleife endete bei 27,9 d,
 * t_e,28 blieb 0); Abfuhrfaktor der Wärmeabfuhr je Schritt ≤ 1 (vorher Überschwingen bis > 150 °C bei d = 0,1 m); f_ctm für f_ck > 50 N/mm² (Zementklasse 52,5) nach Tab. 3.1 mit
 * 2,12·ln(1 + f_cm/10) statt 0,30·f_ck^(2/3); Kennwerte werden nicht mehr vor der Weiterrechnung gerundet.
 * Reiner Rechenkern – geprüft in tests/hydratation.test.ts.
 */
import { type Hinweis, istEndlich, hatFehler, muss, bereich, nurGueltig, KEINE_KLASSE, type KeineKlasse } from './plausibilitaet';
import { ZEMENT_S, betaCc, ecmVonFcm } from './betonkennwerte';
import { fctmVonFck, fckZumAlter } from '../data/kennwerte';
import { DIN1045_3_NACHBEHANDLUNG } from '../data/normParams';

// ---------------------------------------------------------------------------------------------
// 1. Reifefunktionen
// ---------------------------------------------------------------------------------------------

export type Reifeverfahren = 'Arrhenius' | 'fib Model Code 2010' | 'Saul' | 'Rastrup (1954)' | 'gewogene Reife nach NEN 5970';
export const REIFEVERFAHREN: readonly Reifeverfahren[] = ['Arrhenius', 'fib Model Code 2010', 'Saul', 'Rastrup (1954)', 'gewogene Reife nach NEN 5970'];

/** Allgemeine Gaskonstante R in J/(mol·K) */
export const GASKONSTANTE = 8.31446;
/** Bezugstemperatur 20 °C in K */
export const T_REF_K = 293.15;
/** Untere Grenze der Erhärtung (Datumstemperatur) in °C */
export const T_DATUM = -10;

/**
 * Gewogene Reife nach NEN 5970 (Entscheidung 27.10. spät): Temperaturfaktor k_T = C^((T − 20)/10) mit zementabhängiger
 * Konstante C. Quellenlage (Recherche 27.10.2026, öffentliche Fundstellen):
 *  - NEN 5970:2001 „Determination of strength of fresh concrete with the method of weighted maturity“ (Normtitel und
 *    Anwendungsbereich laut GlobalSpec-Katalog; enthält auch die Bestimmung des C-Werts der Bindemittel).
 *  - Giatec Scientific, „Concrete Maturity Calculation Methods“: Verfahren von Papadakis/Bresson (1970er), 1979 von de Vree
 *    angepasst, in den Niederlanden genormt; C „typically varies from 1.25 to 1.75“.
 *  - Kasal, P.: Metoda zralosti – princip, kalibrace, použití a přesnost. ČVUT Praha, PhD-Workshop 2020: „metoda De Vree“
 *    (gewogene Reife), C etwa 1,15 … 1,65, Bestimmung nach NEN 5970 oder Angabe des Betonlieferanten.
 * Zusammengefasster Bereich 1,15 … 1,75, Standard 1,45 (Bereichsmitte). Die integrierte Form der NEN 5970 (Reife in °C·h)
 * ist öffentlich nicht vollständig wiedergegeben; der Rechner verwendet daher nur den Temperaturfaktor C^((T − 20)/10)
 * bezogen auf 20 °C. Vorläufig, F-Freigabe: Form und C-Bereich am Normtext NEN 5970 prüfen.
 * (Bis 27.10.: „de Vree“ mit festem C = 10^0,3 ≈ 2,0, ohne Beleg.)
 */
export const GEWOGENE_REIFE_C = { min: 1.15, max: 1.75, standard: 1.45 } as const;

/**
 * Temperaturfaktor k_T einer Reifefunktion bei der Betontemperatur T in °C (bezogen auf 20 °C, k_T(20 °C) = 1).
 * E_a in kJ/mol (nur Arrhenius). Unter −10 °C erhärtet der Beton nicht (k_T = 0).
 */
export function temperaturfaktorReife(verfahren: Reifeverfahren, temperatur: number, aktivierungsEnergie = 38, cGewogen: number = GEWOGENE_REIFE_C.standard): number {
  if (temperatur < T_DATUM) return 0;
  const tK = temperatur + 273.15;
  switch (verfahren) {
    case 'Saul': return (temperatur + 10) / 30.0;
    case 'Rastrup (1954)': return Math.pow(2, (temperatur - 20) / 10.0);
    case 'gewogene Reife nach NEN 5970': return Math.pow(cGewogen, (temperatur - 20) / 10.0); // vorläufig, F-Freigabe (s. GEWOGENE_REIFE_C)
    case 'fib Model Code 2010': return Math.exp(4000 * (1 / T_REF_K - 1 / tK));
    case 'Arrhenius':
    default: return Math.exp(((aktivierungsEnergie * 1000) / GASKONSTANTE) * (1 / T_REF_K - 1 / tK));
  }
}

/** Wirksames Alter t_e in d bei konstanter Temperatur über die Dauer t in d */
export function wirksamesAlterKonstant(verfahren: Reifeverfahren, temperatur: number, t: number, aktivierungsEnergie = 38, cGewogen: number = GEWOGENE_REIFE_C.standard): number {
  return temperaturfaktorReife(verfahren, temperatur, aktivierungsEnergie, cGewogen) * t;
}

// ---------------------------------------------------------------------------------------------
// 2. Festigkeitsentwicklung
// ---------------------------------------------------------------------------------------------

export type Zementart = 'CEM I' | 'CEM II' | 'CEM III' | 'CEM IV' | 'CEM V';
export type ZementFestigkeitsklasse = '32.5' | '42.5' | '52.5';
export type Erhaertung = 'L' | 'N' | 'R';
export type Zusatzstoff = 'Ohne' | 'FA' | 'SF';

/** Obergrenze für β_cc im Modul (Lehrvereinfachung) */
export const BETA_CC_MAX = 1.25;

/**
 * Zuordnung Zement → Zementklasse für den Beiwert s nach DIN EN 1992-1-1, 3.1.2(6):
 * Klasse R (s = 0,20): CEM 42,5 R, 52,5 N, 52,5 R; Klasse N (s = 0,25): CEM 32,5 R, 42,5 N; Klasse S (s = 0,38): CEM 32,5 N.
 * Zemente mit niedriger Anfangsfestigkeit (L, nach DIN EN 197-1 nur CEM III) nennt EC2 nicht; sie werden nach den
 * Anfangsfestigkeiten der DIN EN 197-1, Tab. 3, eingeordnet (vorläufig, F-Freigabe):
 * 32,5 L (7 d ≥ 12 N/mm²) und 42,5 L (7 d ≥ 16 N/mm², wie 32,5 N) → S; 52,5 L (2 d ≥ 10 N/mm², wie 42,5 N) → N.
 * Damit erhärtet L nie schneller als N derselben Festigkeitsklasse.
 * Vorher: L = Grundwert + 0,05 (32,5 L und 42,5 L 0,30, 52,5 L 0,25) – 32,5 L wäre schneller als 32,5 N (0,38) gewesen.
 */
export const ZEMENTKLASSE_EC2: Readonly<Record<ZementFestigkeitsklasse, Readonly<Record<Erhaertung, 'S' | 'N' | 'R'>>>> = {
  '32.5': { L: 'S', N: 'S', R: 'N' },
  '42.5': { L: 'S', N: 'N', R: 'R' },
  '52.5': { L: 'N', N: 'R', R: 'R' },
};

/** Zementbeiwert s nach DIN EN 1992-1-1, 3.1.2(6) (Zuordnung siehe ZEMENTKLASSE_EC2) */
export function zementbeiwertS(klasse: ZementFestigkeitsklasse, erhaertung: Erhaertung): number {
  const k = ZEMENTKLASSE_EC2[klasse]?.[erhaertung] ?? 'N';
  return ZEMENT_S[k];
}

/** β_cc(t_e) nach Gl. (3.2), auf 1,25 begrenzt; für t_e ≤ 0 gilt β_cc = 0 */
export function betaCcBegrenzt(s: number, te: number): number {
  if (Number.isNaN(s) || Number.isNaN(te)) return NaN; // Grenzfallprüfung 02.11.2026: NaN-Eingabe nicht als Zahl ausgeben
  return te > 0 ? Math.min(BETA_CC_MAX, betaCc(s, te)) : 0;
}

/** Exponent α in Gl. (3.4): 1 für t < 28 d, 2/3 für t ≥ 28 d */
export function zugExponent(t: number): number {
  if (Number.isNaN(t)) return NaN; // Grenzfallprüfung 02.11.2026: NaN-Eingabe nicht als Zahl ausgeben
  return t < 28 ? 1.0 : 2 / 3;
}

/** 28-Tage-Kennwerte aus f_ck: f_cm = f_ck + 8, f_ctm (Tab. 3.1) in N/mm², E_cm in GPa */
export function kennwerte28(fck: number): { fcm: number; fctm: number; Ecm: number } {
  const fcm = fck + 8;
  return { fcm, fctm: fctmVonFck(fck), Ecm: ecmVonFcm(fcm) / 1000 };
}

/** Kennwerte zum wirksamen Alter t_e (Festigkeiten in N/mm², E in GPa, Anteile bezogen auf 28 d) */
export function kennwerteZumAlter(s: number, te: number, fck: number) {
  const k = kennwerte28(fck);
  const beta = betaCcBegrenzt(s, te);
  const fc = beta * k.fcm;
  const fct = Math.pow(beta, zugExponent(te)) * k.fctm;
  const E = Math.pow(beta, 0.3) * k.Ecm;
  return { beta, fc, fct, E, fcRel: beta, fctRel: k.fctm > 0 ? fct / k.fctm : 0, ERel: Math.pow(beta, 0.3) };
}

// ---------------------------------------------------------------------------------------------
// 3. Hydratationswärme und Temperaturentwicklung im Bauteil
// ---------------------------------------------------------------------------------------------

/** Lehrwerte H_max in J/g und t_50 in d je Zementart (Moduldatei) */
export const ZEMENT_WAERME: Readonly<Record<Zementart, { Hmax: number; t50: number }>> = {
  'CEM I': { Hmax: 380, t50: 1.2 },
  'CEM II': { Hmax: 320, t50: 1.8 },
  'CEM III': { Hmax: 250, t50: 3.0 },
  'CEM IV': { Hmax: 280, t50: 2.5 },
  'CEM V': { Hmax: 260, t50: 2.8 },
};

/** Volumetrische Wärmekapazität c·ρ des Betons in kJ/(m³·K) (1,0 kJ/(kg·K) · 2400 kg/m³) */
export const WAERMEKAPAZITAET_VOL = 2400.0;
/** Pauschale Wärmeabfuhr im Kern in m²/d (bezogen auf d²) und am Rand in m/d (bezogen auf d) */
export const ABFUHR_KERN = 0.5;
export const ABFUHR_RAND = 3.0;
/** Anteil der Hydratationswärme, der am Rand wirksam wird */
export const RAND_WAERMEANTEIL = 0.4;
/** Zeitschritt in d und Simulationsdauer in d */
export const DT_TAGE = 0.1;
export const DAUER_TAGE = 28;

/**
 * Wärmekennwerte H_max (J/g) und t_50 (d) mit Zu- und Abschlägen für Erhärtung (R: +20 J/g, t_50·0,7;
 * L: −20 J/g, t_50·1,4) und Zusatzstoffe bezogen auf das Verhältnis Zusatzstoff/Zement
 * (FA: −100·m/z, t_50·(1 + 0,6·m/z); SF: +100·m/z, t_50·(1 − m/z)).
 */
export function waermeKennwerte(zementArt: Zementart, erhaertung: Erhaertung, zusatzstoff: Zusatzstoff, zusatzstoffMenge: number, zement: number) {
  let { Hmax, t50 } = ZEMENT_WAERME[zementArt];
  if (erhaertung === 'R') { Hmax += 20; t50 *= 0.7; }
  if (erhaertung === 'L') { Hmax -= 20; t50 *= 1.4; }
  const zsRatio = Number.isNaN(zement) || Number.isNaN(zusatzstoffMenge) ? NaN : zement > 0 ? zusatzstoffMenge / zement : 0; // Grenzfallprüfung 02.11.2026: NaN nicht als 0
  if (zusatzstoff === 'FA') { Hmax -= 100 * zsRatio; t50 *= (1 + 0.6 * zsRatio); }
  if (zusatzstoff === 'SF') { Hmax += 100 * zsRatio; t50 *= (1 - 1.0 * zsRatio); }
  return { Hmax, t50, zsRatio };
}

/** Freigesetzte Hydratationswärme Q(t_e) = H_max·t_e/(t_e + t_50) in J/g */
export function hydratationswaerme(Hmax: number, t50: number, te: number): number {
  if (Number.isNaN(Hmax) || Number.isNaN(t50) || Number.isNaN(te)) return NaN; // Grenzfallprüfung 02.11.2026: NaN-Eingabe nicht als Zahl ausgeben
  return te > 0 ? Hmax * (te / (te + t50)) : 0;
}

/** Hydratationsgrad α(t_e) = Q(t_e)/H_max = t_e/(t_e + t_50) */
export function hydratationsgrad(t50: number, te: number): number {
  if (Number.isNaN(t50) || Number.isNaN(te)) return NaN; // Grenzfallprüfung 02.11.2026: NaN-Eingabe nicht als Zahl ausgeben
  return te > 0 ? te / (te + t50) : 0;
}

/** Adiabatische Temperaturerhöhung ΔT = z·Q/(c·ρ) in K (z in kg/m³, Q in J/g = kJ/kg) */
export function adiabatischeErwaermung(zement: number, waerme: number): number {
  return (zement * waerme) / WAERMEKAPAZITAET_VOL;
}

export type Rissgefahr = 'Hoch' | 'Mittel' | 'Gering' | KeineKlasse;

/** Einstufung der Rissgefahr aus ΔT_Kern−Rand: > 15 K hoch, > 10 K mittel */
export function rissgefahrAusDeltaT(deltaT: number): Rissgefahr {
  if (!Number.isFinite(deltaT)) return KEINE_KLASSE; // F-1 (02.11.2026): keine Zahl → keine Klasse
  return deltaT > 15 ? 'Hoch' : deltaT > 10 ? 'Mittel' : 'Gering';
}

export interface HydratationEingabe {
  /** Zementgehalt z in kg/m³ */
  zement: number;
  /** Umgebungstemperatur in °C */
  tempUmgebung: number;
  /** Frischbetontemperatur in °C */
  tempFrischbeton: number;
  zementArt: Zementart;
  festigkeitsklasse: ZementFestigkeitsklasse;
  erhaertung: Erhaertung;
  zusatzstoff: Zusatzstoff;
  /** Zusatzstoffmenge in kg/m³ */
  zusatzstoffMenge: number;
  /** Bauteildicke d in m */
  bauteildicke: number;
  /** erforderliche Ausschalfestigkeit in % von f_ck */
  ausschalAnteil: number;
  reifeVerfahren: Reifeverfahren;
  /** scheinbare Aktivierungsenergie E_a in kJ/mol (nur Arrhenius) */
  aktivierungsEnergie: number;
  /** Zementkonstante C der gewogenen Reife nach NEN 5970 (nur dieses Verfahren); ohne Angabe 1,45 (vorläufig, F-Freigabe) */
  cGewogen?: number;
}

export interface HydratationErgebnis {
  /** Zeitachse in d (0 … 28, Δt = 0,1 d) */
  zeit: number[];
  /** Druckfestigkeit f_cm(t) unter Kerntemperatur und bei 20 °C in N/mm² sowie bezogen in % */
  fcAkt: number[]; fcRef: number[]; fcAktRel: number[]; fcRefRel: number[];
  /** Zugfestigkeit f_ctm(t) in N/mm² und bezogen in % */
  fctAkt: number[]; fctRef: number[]; fctAktRel: number[];
  /** E-Modul E_cm(t) in GPa und bezogen in % */
  EAkt: number[]; ERef: number[]; EAktRel: number[];
  /** Temperaturen in °C */
  tempKern: number[]; tempRand: number[]; tempAdiabat: number[];
  /** Hydratationsgrad α(t_e) im Kern (0 … 1) */
  hydratationsgrad: number[];
  s: number; fck: number; fcm28: number; fctm28: number; Ecm28: number;
  Hmax: number; t50: number;
  /** wirksames Alter nach 2 d und 28 d in d */
  te2d: number; te28: number;
  beta2d: number;
  /** Kennwerte nach 2 d */
  fc2d: number; fct2d: number; E2d: number; fc2dRel: number; fct2dRel: number; E2dRel: number;
  /** größte Differenz Kern − Rand in K */
  maxTempDiff: number;
  rissgefahr: Rissgefahr;
  /** erforderliche Ausschalfestigkeit in N/mm² */
  fReq: number;
  /** erster Zeitpunkt in d mit f_ck(t_e) ≥ f_req, f_ck(t_e) = β_cc·f_cm − 8 (t_e < 28 d) bzw. f_ck (DIN EN 1992-1-1, 3.1.2(5));
   *  null, wenn bis 28 d nicht erreicht */
  ausschalTage: number | null;
  gueltig: boolean;
  hinweise: Hinweis[];
}

const FCK_ZEMENTKLASSE: Readonly<Record<ZementFestigkeitsklasse, number>> = { '32.5': 32.5, '42.5': 42.5, '52.5': 52.5 };

export function hydratation(e: HydratationEingabe): HydratationErgebnis {
  const hinweise: Hinweis[] = [];
  const { zement, tempUmgebung, tempFrischbeton, zementArt, festigkeitsklasse, erhaertung, zusatzstoff, zusatzstoffMenge,
    bauteildicke, ausschalAnteil, reifeVerfahren, aktivierungsEnergie } = e;
  const cGewogen = e.cGewogen ?? GEWOGENE_REIFE_C.standard;
  muss(hinweise, istEndlich(zement, tempUmgebung, tempFrischbeton, zusatzstoffMenge, bauteildicke, ausschalAnteil, aktivierungsEnergie),
    'eingabe', 'Alle Eingaben müssen endliche Zahlen sein.');
  muss(hinweise, zement > 0, 'zement', 'Der Zementgehalt muss größer als 0 sein.');
  muss(hinweise, bauteildicke > 0, 'bauteildicke', 'Die Bauteildicke muss größer als 0 sein.');
  muss(hinweise, zusatzstoffMenge >= 0, 'zusatzstoffMenge', 'Die Zusatzstoffmenge darf nicht negativ sein.');
  muss(hinweise, ausschalAnteil > 0, 'ausschalAnteil', 'Die erforderliche Ausschalfestigkeit muss größer als 0 % sein.');
  muss(hinweise, aktivierungsEnergie > 0, 'aktivierungsEnergie', 'Die Aktivierungsenergie muss größer als 0 sein.');
  if (reifeVerfahren === 'gewogene Reife nach NEN 5970') muss(hinweise, Number.isFinite(cGewogen) && cGewogen > 1, 'cGewogen', 'Die Zementkonstante C der gewogenen Reife muss größer als 1 sein.');
  muss(hinweise, tempUmgebung > -273.15 && tempFrischbeton > -273.15, 'temperatur', 'Temperaturen müssen über dem absoluten Nullpunkt liegen.');

  const s = zementbeiwertS(festigkeitsklasse, erhaertung);
  const fck = FCK_ZEMENTKLASSE[festigkeitsklasse];
  const { fcm: fcm28, fctm: fctm28, Ecm: Ecm28 } = kennwerte28(fck);
  const { Hmax, t50, zsRatio } = waermeKennwerte(zementArt, erhaertung, zusatzstoff, zusatzstoffMenge, zement);
  muss(hinweise, !(zusatzstoff === 'SF' && zsRatio >= 1), 'zusatzstoffMenge',
    'Silikastaub/Zement ≥ 1: Die Halbwertszeit t₅₀ wäre ≤ 0 (außerhalb des Modells).');
  muss(hinweise, !Number.isFinite(Hmax) || Hmax > 0, 'zusatzstoffMenge', 'Die Hydratationswärme H_max wäre ≤ 0 (Zusatzstoffanteil zu hoch).');

  const fReq = fck * (ausschalAnteil / 100);
  const leer: HydratationErgebnis = {
    zeit: [], fcAkt: [], fcRef: [], fcAktRel: [], fcRefRel: [], fctAkt: [], fctRef: [], fctAktRel: [],
    EAkt: [], ERef: [], EAktRel: [], tempKern: [], tempRand: [], tempAdiabat: [], hydratationsgrad: [],
    s, fck, fcm28, fctm28, Ecm28, Hmax: 0, t50: 0, te2d: 0, te28: 0, beta2d: 0,
    fc2d: 0, fct2d: 0, E2d: 0, fc2dRel: 0, fct2dRel: 0, E2dRel: 0,
    maxTempDiff: 0, rissgefahr: KEINE_KLASSE, fReq: Number.isFinite(fReq) ? fReq : 0, ausschalTage: null, gueltig: false, hinweise,
  };
  if (hatFehler(hinweise)) return nurGueltig(leer);

  // Anwendungsbereich (Warnungen; die Rechnung bleibt unverändert)
  bereich(hinweise, 'zement', zement, 250, 450, 'Zementgehalt außerhalb 250 … 450 kg/m³: Wärmeansatz nur für übliche Betone abgestimmt.');
  bereich(hinweise, 'tempUmgebung', tempUmgebung, 0, 40, 'Umgebungstemperatur außerhalb 0 … 40 °C.');
  bereich(hinweise, 'tempFrischbeton', tempFrischbeton, 5, 35, 'Frischbetontemperatur außerhalb 5 … 35 °C (DIN EN 206/DIN 1045-2: in der Regel 5 … 30 °C).');
  if (bauteildicke < 0.3) hinweise.push({ stufe: 'warnung', feld: 'bauteildicke',
    text: 'Bauteildicke < 0,30 m: Beim Zeitschritt 0,1 d wird die pauschale Wärmeabfuhr überschätzt; Kern und Rand fallen auf die Umgebungstemperatur zurück.' });
  if (fck > 50) hinweise.push({ stufe: 'warnung', feld: 'festigkeitsklasse',
    text: 'f_ck = 52,5 N/mm² (Normfestigkeit des Zements als Beton-f_ck): f_ctm nach Tab. 3.1 für Klassen über C50/60.' });
  if (zusatzstoff !== 'Ohne') bereich(hinweise, 'zusatzstoffMenge', zsRatio, 0, 0.4,
    'Zusatzstoff/Zement > 0,4: Die linearen Zu- und Abschläge für H_max und t₅₀ sind nur für kleine Anteile gedacht.');
  if (reifeVerfahren === 'Arrhenius') bereich(hinweise, 'aktivierungsEnergie', aktivierungsEnergie, 30, 60, 'E_a außerhalb 30 … 60 kJ/mol (übliche Werte für Portland- bis Hochofenzement).');
  if (reifeVerfahren === 'gewogene Reife nach NEN 5970') bereich(hinweise, 'cGewogen', cGewogen, GEWOGENE_REIFE_C.min, GEWOGENE_REIFE_C.max, 'Zementkonstante C außerhalb des öffentlich genannten Bereichs 1,15 … 1,75 (Giatec; Kasal, ČVUT 2020).');

  const r: HydratationErgebnis = { ...leer, Hmax, t50, gueltig: true };
  let kern = tempFrischbeton, rand = tempFrischbeton, adiabat = tempFrischbeton;
  let te = 0, prevT = 0, Hprev = 0, maxTempDiff = 0;
  let ausschalTage: number | null = null;
  const nSchritte = Math.round(DAUER_TAGE / DT_TAGE);

  for (let k = 0; k <= nSchritte; k++) {
    const t = k / 10;
    r.zeit.push(t);
    if (k === 0) {
      for (const a of [r.fcAkt, r.fcRef, r.fcAktRel, r.fcRefRel, r.fctAkt, r.fctRef, r.fctAktRel, r.EAkt, r.ERef, r.EAktRel, r.hydratationsgrad]) a.push(0);
      r.tempKern.push(tempFrischbeton); r.tempRand.push(tempFrischbeton); r.tempAdiabat.push(tempFrischbeton);
      continue;
    }
    const dt = t - prevT;

    // Referenz 20 °C: wirksames Alter = tatsächliches Alter
    const ref = kennwerteZumAlter(s, t, fck);
    r.fcRef.push(ref.fc); r.fcRefRel.push(ref.beta * 100); r.fctRef.push(ref.fct); r.ERef.push(ref.E);

    // Reife unter der Kerntemperatur des vorigen Schritts
    te += temperaturfaktorReife(reifeVerfahren, kern, aktivierungsEnergie, cGewogen) * dt;
    if (k === nSchritte) r.te28 = te;
    const akt = kennwerteZumAlter(s, te, fck);
    if (k === 20) { r.te2d = te; r.beta2d = akt.beta; }
    r.fcAkt.push(akt.fc); r.fcAktRel.push(akt.beta * 100);
    r.fctAkt.push(akt.fct); r.fctAktRel.push(akt.fctRel * 100);
    r.EAkt.push(akt.E); r.EAktRel.push(akt.ERel * 100);
    // Runde 5 (Z55): Vergleich mit f_ck(t_e) nach 3.1.2(5) statt β_cc·f_ck
    if (ausschalTage === null && fckZumAlter(fck, akt.fc, te) >= fReq) ausschalTage = t;

    // Wärme und Temperatur
    const H = hydratationswaerme(Hmax, t50, te);
    r.hydratationsgrad.push(hydratationsgrad(t50, te));
    const dH = Math.max(0, H - Hprev);
    Hprev = H;
    const dTad = adiabatischeErwaermung(zement, dH);
    adiabat += dTad;
    r.tempAdiabat.push(adiabat);
    // Abfuhrfaktor je Schritt auf 1 begrenzt: bis d ≈ 0,22 m (Kern) bzw. 0,30 m (Rand) unverändert; bei dünneren Bauteilen
    // gleicht sich die Temperatur in einem Schritt an die Umgebung an, statt wie bisher über sie hinauszuschwingen.
    const verlustKern = Math.min(1, ABFUHR_KERN * dt / (bauteildicke * bauteildicke)) * (kern - tempUmgebung);
    kern = Math.max(tempUmgebung, kern + dTad - verlustKern);
    r.tempKern.push(kern);
    const verlustRand = Math.min(1, ABFUHR_RAND * dt / bauteildicke) * (rand - tempUmgebung);
    rand = Math.max(tempUmgebung, rand + dTad * RAND_WAERMEANTEIL - verlustRand);
    r.tempRand.push(rand);
    if (kern - rand > maxTempDiff) maxTempDiff = kern - rand;
    prevT = t;
  }

  const i2 = 20;
  r.fc2d = r.fcAkt[i2]; r.fct2d = r.fctAkt[i2]; r.E2d = r.EAkt[i2];
  r.fc2dRel = r.fcAktRel[i2]; r.fct2dRel = r.fctAktRel[i2]; r.E2dRel = r.EAktRel[i2];
  r.maxTempDiff = maxTempDiff;
  r.rissgefahr = rissgefahrAusDeltaT(maxTempDiff);
  r.ausschalTage = ausschalTage;
  if (te > 0 && betaCc(s, te) > BETA_CC_MAX) hinweise.push({ stufe: 'warnung', feld: 'reifeVerfahren', text: 'β_cc wird im Modell auf 1,25 begrenzt.' });
  r.gueltig = !hatFehler(hinweise);
  if (!r.gueltig) r.rissgefahr = KEINE_KLASSE; // F-1
  return r;
}

// ---------------------------------------------------------------------------------------------
// 4. Reißrahmen-Simulation (HydratationPruefverfahren.tsx)
// ---------------------------------------------------------------------------------------------

export interface ZementProfil {
  name: string;
  /** Wärmepotenzial in J/g */
  baseHeat: number;
  /** relative Hydratationsgeschwindigkeit (1 = CEM I 42,5 N) */
  hydrationSpeed: number;
  /** relative Festigkeitsentwicklung (1 = CEM I 42,5 N) */
  strengthSpeed: number;
}

export interface ReissrahmenEingabe {
  zement: ZementProfil;
  /** Frischbetontemperatur in °C */
  tFrisch: number;
  /** Umgebungstemperatur in °C */
  tUmgebung: number;
  /** Fasergehalt in kg/m³ */
  fasergehalt: number;
  /** Festhaltegrad des Rahmens in % (100 = starr) */
  festhaltegrad: number;
}

export interface ReissrahmenPunkt {
  /** Zeit in h */
  t: number;
  /** Temperatur in °C */
  temp: number;
  /** Zugfestigkeit in N/mm² */
  fct: number;
  /** rechnerische Zwangspannung in N/mm² (Zug positiv) */
  stress: number;
  /** angezeigte Spannung (nach dem Riss Restspannung) in N/mm² */
  displayStress: number;
  isPointCracked: boolean;
}

export interface ReissrahmenErgebnis {
  punkte: ReissrahmenPunkt[];
  /** Risszeitpunkt in h; null = kein Riss bis 72 h */
  rissStunde: number | null;
  maxTemp: number;
  gueltig: boolean;
  hinweise: Hinweis[];
}

/** Elastizitätsmodul des erhärteten Betons im Modell in N/mm² und Temperaturdehnzahl in 1/K */
export const RR_E_END = 31000;
export const RR_ALPHA_T = 1.0e-5;
export const RR_STUNDEN = 72;

export function reissrahmen(e: ReissrahmenEingabe): ReissrahmenErgebnis {
  const hinweise: Hinweis[] = [];
  const { zement, tFrisch, tUmgebung, fasergehalt, festhaltegrad } = e;
  muss(hinweise, istEndlich(zement.baseHeat, zement.hydrationSpeed, zement.strengthSpeed, tFrisch, tUmgebung, fasergehalt, festhaltegrad),
    'eingabe', 'Alle Eingaben müssen endliche Zahlen sein.');
  muss(hinweise, zement.baseHeat >= 0 && zement.hydrationSpeed > 0 && zement.strengthSpeed > 0, 'zement', 'Die Zementkennwerte müssen positiv sein.');
  muss(hinweise, fasergehalt >= 0, 'fasergehalt', 'Der Fasergehalt darf nicht negativ sein.');
  muss(hinweise, festhaltegrad >= 0 && festhaltegrad <= 100, 'festhaltegrad', 'Der Festhaltegrad muss zwischen 0 und 100 % liegen.');
  if (hatFehler(hinweise)) return nurGueltig({ punkte: [], rissStunde: null, maxTemp: Number.isFinite(tFrisch) ? tFrisch : 0, gueltig: false, hinweise });
  bereich(hinweise, 'fasergehalt', fasergehalt, 0, 60, 'Fasergehalt über 60 kg/m³: Faseransatz nur bis 60 kg/m³ abgestimmt.');
  bereich(hinweise, 'tFrisch', tFrisch, 5, 35, 'Frischbetontemperatur außerhalb 5 … 35 °C.');

  const faserAbminderung = Math.min(0.20, (fasergehalt / 40) * 0.15);
  let maxTemp = tFrisch;
  const roh = Array.from({ length: RR_STUNDEN + 1 }, (_, t) => {
    const tNorm = t * zement.hydrationSpeed;
    const waerme = zement.baseHeat * (1 - Math.exp(-0.08 * tNorm));
    const dT = (waerme / 15) * Math.exp(-0.06 * Math.max(0, tNorm - 4));
    const temp = tFrisch + dT * (1 - Math.exp(-0.15 * t)) - (tFrisch - tUmgebung) * (1 - Math.exp(-0.05 * t));
    if (temp > maxTemp) maxTemp = temp;
    const fct = 3.2 * (t > 4 ? (1 - Math.exp(-0.06 * (t - 4) * zement.strengthSpeed)) : 0) * (1 + fasergehalt * 0.005);
    const epsT = RR_ALPHA_T * (temp - tFrisch);
    const epsS = t > 5 ? 2.5e-5 * ((t - 5) / (t + 10)) : 0;
    const eJung = RR_E_END * (t > 3 ? (1 - Math.exp(-0.055 * (t - 3) * zement.strengthSpeed)) : 0);
    const kRelax = 0.55 + 0.15 * Math.exp(-0.03 * t);
    let stress = eJung * (-epsT + epsS) * kRelax * (festhaltegrad / 100.0);
    if (stress > 0) stress *= (1 - faserAbminderung);
    return { t, temp, fct, stress };
  });

  let rissStunde: number | null = null;
  const punkte = roh.map(pt => {
    let gerissen = false;
    if (rissStunde !== null) gerissen = true;
    else if (pt.t > 6 && pt.stress > pt.fct && pt.fct > 0.2) { rissStunde = pt.t; gerissen = true; }
    let displayStress = pt.stress;
    if (gerissen && rissStunde !== pt.t) {
      const rest = (fasergehalt / 30) * 0.55;
      displayStress = Math.max(0, Math.min(pt.fct * 0.15, rest));
    }
    return { ...pt, displayStress, isPointCracked: gerissen };
  });
  return nurGueltig({ punkte, rissStunde, maxTemp, gueltig: true, hinweise });
}

// ---------------------------------------------------------------------------------------------
// 5. Verdunstungsrate (Nachbehandlung.tsx)
// ---------------------------------------------------------------------------------------------

/** Grenzwert der Verdunstungsrate in kg/(m²·h), ab dem Frühschwindrisse zu erwarten sind (ACI 305R) */
export const VERDUNSTUNG_KRITISCH = 1.0;

export interface VerdunstungEingabe {
  /** Lufttemperatur T_a in °C */
  tLuft: number;
  /** Betontemperatur T_c in °C */
  tBeton: number;
  /** relative Luftfeuchte in % */
  rh: number;
  /** Windgeschwindigkeit V in km/h */
  wind: number;
}

export interface VerdunstungErgebnis {
  /** Verdunstungsrate E in kg/(m²·h), nicht negativ */
  E: number;
  /** Rechenwert vor der Begrenzung auf ≥ 0 (negativ: Tauwasser statt Verdunstung) */
  Eroh: number;
  kritisch: boolean;
  gueltig: boolean;
  hinweise: Hinweis[];
}

export function verdunstungsrate(e: VerdunstungEingabe): VerdunstungErgebnis {
  const hinweise: Hinweis[] = [];
  const { tLuft, tBeton, rh, wind } = e;
  muss(hinweise, istEndlich(tLuft, tBeton, rh, wind), 'eingabe', 'Alle Eingaben müssen endliche Zahlen sein.');
  muss(hinweise, tLuft > -18 && tBeton > -18, 'temperatur', 'Die Gleichung ist nur für Temperaturen über −18 °C definiert.');
  muss(hinweise, rh >= 0 && rh <= 100, 'rh', 'Die relative Luftfeuchte muss zwischen 0 und 100 % liegen.');
  muss(hinweise, wind >= 0, 'wind', 'Die Windgeschwindigkeit darf nicht negativ sein.');
  if (hatFehler(hinweise)) return nurGueltig({ E: 0, Eroh: 0, kritisch: false, gueltig: false, hinweise });
  bereich(hinweise, 'temperatur', Math.min(tLuft, tBeton), 5, 40, 'Temperaturen außerhalb 5 … 40 °C: Die Näherungsgleichung ist für übliche Baustellenbedingungen abgestimmt.');
  bereich(hinweise, 'wind', wind, 0, 40, 'Windgeschwindigkeit über 40 km/h: außerhalb des Diagrammbereichs nach ACI 305R.');
  const Eroh = 5 * (Math.pow(tBeton + 18, 2.5) - (rh / 100) * Math.pow(tLuft + 18, 2.5)) * (wind + 4) * 1e-6;
  if (Eroh < 0) hinweise.push({ stufe: 'warnung', feld: 'rh', text: 'Rechenwert negativ (Luft wärmer und feuchter als der Beton): Es verdunstet kein Wasser, E = 0.' });
  const E = Math.max(0, Eroh);
  return nurGueltig({ E, Eroh, kritisch: E > VERDUNSTUNG_KRITISCH, gueltig: true, hinweise });
}

// ---------------------------------------------------------------------------------------------
// 6. Mindestdauer der Nachbehandlung (Nachbehandlung.tsx)
// ---------------------------------------------------------------------------------------------

export type Festigkeitsentwicklung = 'schnell' | 'mittel' | 'langsam' | 'sehr_langsam';
/** xf34: XF3/XF4 – Verdopplung wie XM (Umsetzung 29.10.2026, T9-NB-1; vorläufig, F-Freigabe Beton DIN 1045-3, Tab. 3) */
export type ExpositionNB = 'x0_xc1' | 'andere' | 'xm' | 'xf34';
export type OberflaechenTemp = 'ge25' | '15_25' | '10_15' | '5_10' | '<5';

/** Klasse der Festigkeitsentwicklung aus r = f_cm,2/f_cm,28 (r ≥ 0,50 schnell, ≥ 0,30 mittel, ≥ 0,15 langsam) */
export function festigkeitsentwicklungAusR(r: number): Festigkeitsentwicklung | KeineKlasse {
  if (!Number.isFinite(r)) return KEINE_KLASSE; // F-1 (02.11.2026): keine Zahl → keine Klasse
  if (r >= 0.50) return 'schnell';
  if (r >= 0.30) return 'mittel';
  if (r >= 0.15) return 'langsam';
  return 'sehr_langsam';
}

/** Temperaturbereich der Bauteiloberfläche aus T in °C */
export function oberflaechenTempBereich(t: number): OberflaechenTemp | KeineKlasse {
  if (!Number.isFinite(t)) return KEINE_KLASSE; // F-1 (02.11.2026): keine Zahl → keine Klasse
  if (t >= 25) return 'ge25';
  if (t >= 15) return '15_25';
  if (t >= 10) return '10_15';
  if (t >= 5) return '5_10';
  return '<5';
}

export interface NachbehandlungErgebnis {
  /** Mindestdauer in d; null, wenn Sondermaßnahmen erforderlich sind (T < 5 °C) */
  tage: number | null;
  sondermassnahmen: boolean;
  hinweise: Hinweis[];
}

/**
 * Mindestdauer der Nachbehandlung nach DIN 1045-3: Tabellenwert je Oberflächentemperatur und Festigkeitsentwicklung,
 * X0/XC1 pauschal 0,5 d, XM und (vorläufig) XF3/XF4 doppelte Dauer; unter 5 °C kein Tabellenwert: Die Dauer ist um die
 * Zeit unter 5 °C zu verlängern, zusätzlich sind Winterbaumaßnahmen nötig (Hinweis, Umsetzung 29.10.2026, T9-NB-1).
 */
export function nachbehandlungsdauer(entwicklung: Festigkeitsentwicklung, exposition: ExpositionNB, oberflaeche: OberflaechenTemp): NachbehandlungErgebnis {
  const hinweise: Hinweis[] = [];
  if (oberflaeche === '<5') {
    hinweise.push({ stufe: 'warnung', feld: 'oberflaeche', text: 'Unter 5 °C: Nachbehandlungsdauer um die Zeit verlängern, in der die Oberflächentemperatur unter 5 °C lag; Winterbaumaßnahmen (Wärmedämmung, Beheizung) zusätzlich.' });
    return nurGueltig({ tage: null, sondermassnahmen: true, hinweise });
  }
  if (exposition === 'x0_xc1') return nurGueltig({ tage: DIN1045_3_NACHBEHANDLUNG.x0_xc1_tage, sondermassnahmen: false, hinweise });
  const tage = DIN1045_3_NACHBEHANDLUNG.mindestdauerTage[oberflaeche][entwicklung];
  if (exposition === 'xf34') hinweise.push({ stufe: 'warnung', feld: 'exposition', text: 'Verdopplung für XF3/XF4 wie für XM nach der Wiedergabe der DIN 1045-3, Tab. 3 (vorläufig, Normprüfung ausstehend).' });
  return nurGueltig({ tage: exposition === 'xm' || exposition === 'xf34' ? tage * 2 : tage, sondermassnahmen: false, hinweise });
}

// ---------------------------------------------------------------------------------------------
// 7. Praxisbeispiel „Zwang & Risse bei massigen Bauteilen“ (src/modules/Praxisbeispiele.tsx, AP 4.2 Runde 3)
//    Qualitatives Lehrmodell, Verhalten 1:1 übernommen; geprüft in tests/demosBeton.test.ts:
//    ΔT_ad = z/100 · w_Z (w_Z: K je 100 kg Zement), T_max = T_frisch + ΔT_ad · (1 − e^(−h)) mit h in m,
//    Spitze bei t_p = 1 + h [d]; Erwärmung T_frisch + (T_max − T_frisch)·(t/t_p)·e^(1 − t/t_p),
//    Abkühlung T_umg + (T_max − T_umg)·e^(−(t − t_p)/(2h)).
//    f_ct(t) = β_cc(t)·2,5 N/mm², E_c(t) = β_cc(t)^0,3 · 30 000 N/mm² (DIN EN 1992-1-1, 3.1.2 und 3.1.3),
//    Zwang σ = α_T·(T_max − T)·E_c(t)·R mit α_T = 10⁻⁵ 1/K, nur in der Abkühlphase.
//    Mindestbewehrung je Seite A_s,min = k_c·k·f_ct,eff·A_ct/σ_s mit k_c = 1,0, k = 0,8, f_ct,eff = 2,5 N/mm²,
//    σ_s = 240 N/mm², A_ct = 100 cm · h_c,ef und h_c,ef = min(2,5·(h − d); h/2), Randabstand 5 cm.
//    Korrektur gegenüber dem Modul: Der Zementbeiwert s wurde dort über cementType.includes('CEM I') bestimmt –
//    das trifft auch „CEM II…“ und „CEM III…“, alle Zemente erhielten s = 0,20. Jetzt je Zement aus PRAXIS_ZEMENTE
//    (R → 0,20, N → 0,25, S → 0,38 wie im Modul beabsichtigt).
// ---------------------------------------------------------------------------------------------

/** Lehrwerte je Zement: adiabatische Erwärmung [K je 100 kg/m³ Zement] und Zementbeiwert s nach DIN EN 1992-1-1, 3.1.2 */
export const PRAXIS_ZEMENTE: Readonly<Record<string, { waerme: number; s: number }>> = {
  'CEM I 42.5 R': { waerme: 12, s: 0.2 },
  'CEM II/A-LL 32.5 R': { waerme: 10, s: 0.25 },
  'CEM III/B 32.5 N': { waerme: 7, s: 0.38 },
};
export const PRAXIS_LEHRWERTE = { fctm: 2.5, Ec: 30000, alphaT: 10e-6, kc: 1.0, k: 0.8, sigmaS: 240, randabstandCm: 5, dt: 0.5, dauer: 28 } as const;

export interface PraxisEingabe {
  /** Bauteildicke h [m] */
  dicke: number;
  /** Schlüssel aus PRAXIS_ZEMENTE */
  zement: string;
  /** Zementgehalt [kg/m³] */
  zementgehalt: number;
  /** Frischbeton- und Umgebungstemperatur [°C] */
  tFrisch: number;
  tUmgebung: number;
  /** Behinderungsgrad R [-] */
  behinderung: number;
}

export interface PraxisErgebnis {
  T_max: number;
  maxStress: number;
  crackRisk: boolean;
  /** Mindestbewehrung je Seite [cm²/m] */
  As_min: number;
  /** Zeitachse 0 … 28 d in Schritten von 0,5 d */
  zeit: number[];
  temperatur: number[];
  spannung: number[];
  zugfestigkeit: number[];
  gueltig: boolean;
  hinweise: Hinweis[];
}

export function praxisbeispielMassigesBauteil(e: PraxisEingabe): PraxisErgebnis {
  const hinweise: Hinweis[] = [];
  muss(hinweise, istEndlich(e.dicke, e.zementgehalt, e.tFrisch, e.tUmgebung, e.behinderung), 'eingabe', 'Alle Eingaben müssen Zahlen sein.');
  const zem = PRAXIS_ZEMENTE[e.zement];
  muss(hinweise, zem !== undefined, 'zement', 'Unbekannte Zementart.');
  if (!hatFehler(hinweise)) {
    muss(hinweise, e.dicke > 0, 'dicke', 'Die Bauteildicke muss größer als 0 sein.');
    muss(hinweise, e.zementgehalt >= 0, 'zementgehalt', 'Der Zementgehalt darf nicht negativ sein.');
    muss(hinweise, e.behinderung >= 0 && e.behinderung <= 1, 'behinderung', 'Der Behinderungsgrad muss zwischen 0 und 1 liegen.');
  }
  const L = PRAXIS_LEHRWERTE;
  const zeit = Array.from({ length: Math.round(L.dauer / L.dt) + 1 }, (_, i) => i * L.dt);
  if (hatFehler(hinweise)) {
    const leer = zeit.map(() => NaN);
    return nurGueltig({ T_max: NaN, maxStress: NaN, crackRisk: false, As_min: NaN, zeit, temperatur: leer, spannung: leer, zugfestigkeit: leer, gueltig: false, hinweise });
  }
  const deltaT_ad = (e.zementgehalt / 100) * zem.waerme;
  const thicknessFactor = 1 - Math.exp(-e.dicke);
  const T_max = e.tFrisch + deltaT_ad * thicknessFactor;
  const t_p = 1 + e.dicke;
  if (e.tUmgebung > T_max) hinweise.push({ stufe: 'warnung', feld: 'tUmgebung', text: 'Die Umgebung ist wärmer als die höchste Kerntemperatur – das Lehrmodell liefert dann Druck- statt Zugzwang.' });

  const temperatur: number[] = [], spannung: number[] = [], zugfestigkeit: number[] = [];
  let maxStress = 0;
  let crackRisk = false;
  for (const t of zeit) {
    let T: number;
    if (t === 0) T = e.tFrisch;
    else if (t <= t_p) T = e.tFrisch + (T_max - e.tFrisch) * (t / t_p) * Math.exp(1 - t / t_p);
    else T = e.tUmgebung + (T_max - e.tUmgebung) * Math.exp(-(t - t_p) / (e.dicke * 2));
    temperatur.push(T);

    const f_ct = t > 0 ? L.fctm * betaCc(zem.s, t) : 0;
    zugfestigkeit.push(f_ct);
    const E_c = t > 0 ? L.Ec * Math.pow(betaCc(zem.s, t), 0.3) : 0;

    const sigma = t > t_p ? L.alphaT * (T_max - T) * E_c * e.behinderung : 0;
    spannung.push(sigma);
    if (sigma > maxStress) maxStress = sigma;
    if (sigma > f_ct && t > 0) crackRisk = true;
  }

  const hCm = e.dicke * 100;
  const d_cm = hCm - L.randabstandCm;
  const hc_eff = Math.min(2.5 * (hCm - d_cm), hCm / 2);
  const Act = 100 * hc_eff;
  const As_min = (L.kc * L.k * L.fctm * Act) / L.sigmaS;

  return nurGueltig({ T_max, maxStress, crackRisk, As_min, zeit, temperatur, spannung, zugfestigkeit, gueltig: true, hinweise });
}
