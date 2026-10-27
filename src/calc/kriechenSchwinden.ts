/**
 * Rechenkern Kriechen und Schwinden (Umsetzungsplan Phase 4, AP 4.2), übernommen aus src/modules/KriechenSchwinden.tsx
 * (ec2KriechenSchwinden, calculateBeton, calculateStahl, Rheologie-Simulator) und
 * src/modules/mechanischekenngroessen/KriechModellDiagramm.tsx (rheologische Grundmodelle).
 *
 * Teil A – Beton nach DIN EN 1992-1-1, 3.1.4 und Anhang B (Bausteine werden auch von src/calc/betonkennwerte.ts genutzt):
 *  - Kriechzahl φ(t,t₀) = φ₀·β_c(t,t₀) mit φ₀ = φ_RH·β(f_cm)·β(t₀) (Gl. B.1–B.5), β_c = [(t − t₀)/(β_H + t − t₀)]^0,3 (Gl. B.7)
 *    φ_RH nach Gl. (B.3a) für f_cm ≤ 35 N/mm², sonst (B.3b) mit α₁, α₂; β_H nach Gl. (B.8a/b) mit α₃ (Gl. B.8c)
 *    Zementart über das wirksame Belastungsalter t₀ = t₀,T·[9/(2 + t₀,T^1,2) + 1]^α ≥ 0,5 d (Gl. B.9)
 *  - Trocknungsschwinden ε_cd(t) = β_ds(t,t_s)·k_h·ε_cd,0 (Gl. 3.9, 3.10, Tab. 3.3), ε_cd,0 nach Gl. (B.11), β_RH nach Gl. (B.12)
 *  - Autogenes Schwinden ε_ca(t) = β_as(t)·ε_ca(∞) mit ε_ca(∞) = 2,5·(f_ck − 10)·10⁻⁶ (Gl. 3.11–3.13)
 *  - Gesamtschwinden ε_cs = ε_cd + ε_ca (Gl. 3.8); wirksamer E-Modul E_c,eff = E_cm/(1 + φ) (Gl. 7.20)
 *  - Stützenverformung ε_tot = σ_c/E_cm + φ·σ_c/E_c + ε_cs mit E_c = 1,05·E_cm (3.1.4(3), Gl. 3.6; Lehrbeispiel im Reiter „Rheologie“)
 * Teil B – Relaxation von Spannstahl nach DIN EN 1992-1-1, 3.3.2 (Gl. 3.28–3.30), Zeit in Stunden.
 * Teil C – Rheologische Grundmodelle (Hooke, Maxwell, Kelvin-Voigt, Zener) als qualitative Lehrkurven.
 *
 * Einheiten: Festigkeiten und Moduln in N/mm², h₀ in mm, Zeiten in Tagen (Relaxation: Stunden, Rheologie: Sekunden),
 * Dehnungen dimensionslos (Anzeige in µm/m bzw. ‰), Längen in mm. Keine Temperaturanpassung (t₀,T = t₀, T = 20 °C).
 * h₀ (Runde 5, Z55): Anhang B begrenzt h₀ nicht; k_h nach Tab. 3.3 ist ab h₀ ≥ 500 mm konstant 0,70, β_H ist auf 1500·α₃
 * begrenzt. betonkennwerte.ts verwendet dieselben Bausteine und dieselben Hinweise (h0Hinweise) – keine Klemmung mehr.
 * Reiner Rechenkern – geprüft in tests/kriechenSchwinden.test.ts.
 */
import { type Hinweis, istEndlich, hatFehler, muss } from './plausibilitaet';

export type Zementklasse = 'S' | 'N' | 'R';

/** Beiwerte α_ds1, α_ds2 nach Gl. (B.11) */
export const ZEMENT_DS: Readonly<Record<Zementklasse, { ads1: number; ads2: number }>> = {
  S: { ads1: 3, ads2: 0.13 }, N: { ads1: 4, ads2: 0.12 }, R: { ads1: 6, ads2: 0.11 },
};
/** Exponent α nach Gl. (B.9) */
export const ZEMENT_ALPHA: Readonly<Record<Zementklasse, number>> = { S: -1, N: 0, R: 1 };

// ---------------------------------------------------------------------------------------------
// Teil A – Bausteine nach Anhang B und 3.1.4 (benannte Einzelformeln)
// ---------------------------------------------------------------------------------------------

/** Geometriebeiwert k_h nach Tab. 3.3, linear interpoliert (h₀ in mm) */
export function beiwertKh(h0: number): number {
  if (h0 <= 100) return 1.0;
  if (h0 <= 200) return 1.0 - ((h0 - 100) / 100) * 0.15;
  if (h0 <= 300) return 0.85 - ((h0 - 200) / 100) * 0.10;
  if (h0 <= 500) return 0.75 - ((h0 - 300) / 200) * 0.05;
  return 0.70;
}

/** Beiwerte α₁ = (35/f_cm)^0,7, α₂ = (35/f_cm)^0,2, α₃ = (35/f_cm)^0,5 nach Gl. (B.8c) */
export function alphaBeiwerte(fcm: number): { alpha1: number; alpha2: number; alpha3: number } {
  return { alpha1: Math.pow(35 / fcm, 0.7), alpha2: Math.pow(35 / fcm, 0.2), alpha3: Math.pow(35 / fcm, 0.5) };
}

/** Feuchtebeiwert φ_RH nach Gl. (B.3a) (f_cm ≤ 35) bzw. (B.3b); RH in %, h₀ in mm */
export function phiRH(fcm: number, rh: number, h0: number): number {
  if (fcm <= 35) return 1 + (1 - rh / 100) / (0.10 * Math.cbrt(h0));
  const { alpha1, alpha2 } = alphaBeiwerte(fcm);
  return (1 + ((1 - rh / 100) / (0.10 * Math.cbrt(h0))) * alpha1) * alpha2;
}

/** Festigkeitsbeiwert β(f_cm) = 16,8/√f_cm nach Gl. (B.4) */
export function betaFcm(fcm: number): number {
  return 16.8 / Math.sqrt(fcm);
}

/** Wirksames Belastungsalter nach Gl. (B.9): t₀ = t₀,T·[9/(2 + t₀,T^1,2) + 1]^α ≥ 0,5 d */
export function wirksamesBelastungsalter(t0T: number, zement: Zementklasse): number {
  return Math.max(0.5, t0T * Math.pow((9 / (2 + Math.pow(t0T, 1.2))) + 1, ZEMENT_ALPHA[zement]));
}

/** Belastungsaltersbeiwert β(t₀) = 1/(0,1 + t₀^0,20) nach Gl. (B.5) */
export function betaT0(t0eff: number): number {
  return 1 / (0.1 + Math.pow(t0eff, 0.20));
}

/** Beiwert β_H nach Gl. (B.8a) (f_cm ≤ 35) bzw. (B.8b); RH in %, h₀ in mm, Ergebnis in Tagen */
export function betaH(fcm: number, rh: number, h0: number): number {
  const roh = 1.5 * (1 + Math.pow(0.012 * rh, 18)) * h0;
  if (fcm <= 35) return Math.min(1500, roh + 250);
  const { alpha3 } = alphaBeiwerte(fcm);
  return Math.min(1500 * alpha3, roh + 250 * alpha3);
}

/** Zeitbeiwert β_c(t,t₀) = [(t − t₀)/(β_H + t − t₀)]^0,3 nach Gl. (B.7); 0 für t ≤ t₀ */
export function betaC(t: number, t0: number, bH: number): number {
  const dt = Math.max(0, t - t0);
  return Math.pow(dt / (bH + dt), 0.3);
}

/** Feuchtebeiwert β_RH = 1,55·[1 − (RH/100)³] nach Gl. (B.12) */
export function betaRH(rh: number): number {
  return 1.55 * (1 - Math.pow(rh / 100, 3));
}

/** Grundwert der Trocknungsschwinddehnung ε_cd,0 nach Gl. (B.11) (dimensionslos) */
export function epsCd0(fcm: number, rh: number, zement: Zementklasse): number {
  const { ads1, ads2 } = ZEMENT_DS[zement];
  return 0.85 * ((220 + 110 * ads1) * Math.exp(-ads2 * (fcm / 10))) * 1e-6 * betaRH(rh);
}

/** Zeitbeiwert β_ds(t,t_s) = (t − t_s)/[(t − t_s) + 0,04·√(h₀³)] nach Gl. (3.10); 0 für t ≤ t_s */
export function betaDs(t: number, ts: number, h0: number): number {
  const dt = Math.max(0, t - ts);
  return dt / (dt + 0.04 * Math.sqrt(Math.pow(h0, 3)));
}

/** Endwert des autogenen Schwindens ε_ca(∞) = 2,5·(f_ck − 10)·10⁻⁶ nach Gl. (3.12), nicht negativ */
export function epsCaUnendlich(fck: number): number {
  return 2.5 * Math.max(0, fck - 10) * 1e-6;
}

/** Zeitbeiwert β_as(t) = 1 − exp(−0,2·√t) nach Gl. (3.13) */
export function betaAs(t: number): number {
  return 1 - Math.exp(-0.2 * Math.sqrt(Math.max(0, t)));
}

/** Mittlerer E-Modul E_cm = 22 000·(f_cm/10)^0,3 nach Tab. 3.1 (quarzitische Gesteinskörnung) */
export function eModulEcm(fcm: number): number {
  return 22000 * Math.pow(fcm / 10, 0.3);
}

/** Einheitliche Hinweise zur wirksamen Bauteildicke h₀ in mm (Tab. 3.3 und Bild 3.1: 100 … 1500 mm) */
export function h0Hinweise(hinweise: Hinweis[], h0: number, feld = 'h0'): void {
  if (!Number.isFinite(h0)) return;
  if (h0 < 100) hinweise.push({ stufe: 'warnung', feld, text: 'h₀ < 100 mm: unterhalb des Tabellenbereichs von Tab. 3.3; k_h wird mit 1,0 angesetzt.' });
  if (h0 > 1500) hinweise.push({ stufe: 'warnung', feld, text: 'h₀ > 1500 mm: sehr massiges Bauteil außerhalb von Bild 3.1; φ_RH und β_ds werden ohne Begrenzung von h₀ gerechnet (k_h = 0,70, β_H ≤ 1500·α₃).' });
}

// ---------------------------------------------------------------------------------------------
// Teil A – Modell für ein Bauteil (Eingaben des Reiters „Beton“)
// ---------------------------------------------------------------------------------------------

export interface KriechSchwindEingabe {
  /** charakteristische Zylinderdruckfestigkeit f_ck in N/mm² */
  fck: number;
  /** relative Luftfeuchte RH in % */
  rh: number;
  /** wirksame Bauteildicke h₀ = 2·A_c/u in mm */
  h0: number;
  /** Belastungsalter t₀ in d (ohne Temperaturanpassung) */
  t0: number;
  /** Beginn des Trocknens (Ende der Nachbehandlung) t_s in d */
  ts: number;
  zement: Zementklasse;
}

export interface KriechSchwindModell {
  eingabe: KriechSchwindEingabe;
  fcm: number; Ecm: number;
  alpha1: number; alpha2: number; alpha3: number;
  phiRH: number; betaFcm: number;
  /** wirksames Belastungsalter t₀,eff in d (Gl. B.9) */
  t0eff: number; betaT0: number; phi0: number;
  /** β_H in d */
  betaH: number;
  betaRH: number; epsCd0: number; kh: number; epsCaInf: number;
  gueltig: boolean;
  hinweise: Hinweis[];
}

export function kriechSchwindModell(e: KriechSchwindEingabe): KriechSchwindModell {
  const hinweise: Hinweis[] = [];
  const { fck, rh, h0, t0, ts, zement } = e;
  muss(hinweise, istEndlich(fck, rh, h0, t0, ts), 'eingabe', 'Alle Eingaben müssen endliche Zahlen sein.');
  muss(hinweise, fck > 0, 'fck', 'f_ck muss größer als 0 sein.');
  muss(hinweise, rh >= 0 && rh <= 100, 'rh', 'Die relative Luftfeuchte muss zwischen 0 und 100 % liegen.');
  muss(hinweise, h0 > 0, 'h0', 'Die wirksame Bauteildicke h₀ muss größer als 0 sein.');
  muss(hinweise, t0 > 0, 't0', 'Das Belastungsalter t₀ muss größer als 0 sein.');
  muss(hinweise, ts >= 0, 'ts', 'Der Trocknungsbeginn t_s darf nicht negativ sein.');
  muss(hinweise, zement in ZEMENT_DS, 'zement', 'Unbekannte Zementklasse (S, N oder R).');

  const fcm = fck + 8;
  const Ecm = eModulEcm(fcm);
  const { alpha1, alpha2, alpha3 } = alphaBeiwerte(fcm);
  const z: Zementklasse = zement in ZEMENT_DS ? zement : 'N';
  const pRH = phiRH(fcm, rh, h0);
  const bFcm = betaFcm(fcm);
  const t0eff = wirksamesBelastungsalter(t0, z);
  const bT0 = betaT0(t0eff);
  const phi0 = pRH * bFcm * bT0;
  const bH = betaH(fcm, rh, h0);
  const bRH = betaRH(rh);
  const eCd0 = epsCd0(fcm, rh, z);
  const kh = beiwertKh(h0);
  const epsCaInf = epsCaUnendlich(fck);

  // Anwendungsbereich (nur Warnungen; die Rechnung bleibt unverändert)
  if (fck < 12 || fck > 90) hinweise.push({ stufe: 'warnung', feld: 'fck', text: 'Anhang B ist für Normalbeton der Festigkeitsklassen C12/15 bis C90/105 aufgestellt.' });
  if (fck < 10) hinweise.push({ stufe: 'warnung', feld: 'fck', text: 'f_ck < 10 N/mm²: Das autogene Schwinden wird zu 0 gesetzt (Gl. 3.12 ergäbe einen negativen Wert).' });
  if (rh < 40) hinweise.push({ stufe: 'warnung', feld: 'rh', text: 'Anhang B gilt für eine mittlere relative Luftfeuchte von 40 bis 100 %.' });
  h0Hinweise(hinweise, h0, 'h0');
  if (t0 < 1) hinweise.push({ stufe: 'warnung', feld: 't0', text: 't₀ < 1 d: Das wirksame Belastungsalter wird nach Gl. (B.9) auf mindestens 0,5 d gesetzt.' });

  return {
    eingabe: { ...e }, fcm, Ecm, alpha1, alpha2, alpha3,
    phiRH: pRH, betaFcm: bFcm, t0eff, betaT0: bT0, phi0, betaH: bH,
    betaRH: bRH, epsCd0: eCd0, kh, epsCaInf,
    gueltig: !hatFehler(hinweise), hinweise,
  };
}

/** Kriechzahl φ(t,t₀) (lineares Kriechen, σ_c ≤ 0,45·f_ck(t₀)); 0 für t ≤ t₀ */
export function kriechzahl(m: KriechSchwindModell, t: number): number {
  const { t0 } = m.eingabe;
  return t <= t0 ? 0 : m.phi0 * betaC(t, t0, m.betaH);
}

/** Trocknungsschwinddehnung ε_cd(t) (dimensionslos, positiv als Verkürzung); 0 für t ≤ t_s */
export function trocknungsschwinden(m: KriechSchwindModell, t: number): number {
  const { ts, h0 } = m.eingabe;
  return t <= ts ? 0 : betaDs(t, ts, h0) * m.kh * m.epsCd0;
}

/** Autogene Schwinddehnung ε_ca(t) (dimensionslos) */
export function autogenesSchwinden(m: KriechSchwindModell, t: number): number {
  return betaAs(t) * m.epsCaInf;
}

/** Gesamtschwinddehnung ε_cs(t) = ε_cd(t) + ε_ca(t) (Gl. 3.8) */
export function gesamtschwinden(m: KriechSchwindModell, t: number): number {
  return trocknungsschwinden(m, t) + autogenesSchwinden(m, t);
}

/** Wirksamer E-Modul E_c,eff = E_cm/(1 + φ(t,t₀)) (Gl. 7.20); vor Belastung E_cm */
export function wirksamerEModul(m: KriechSchwindModell, t: number): number {
  return t < m.eingabe.t0 ? m.Ecm : m.Ecm / (1 + kriechzahl(m, t));
}

/** Zeitpunkte des Diagramms (1 … 10 000 d, logarithmisch abgestuft) */
export function diagrammZeitpunkte(): number[] {
  const punkte: number[] = [];
  let t = 1;
  while (t <= 10000) {
    punkte.push(t);
    if (t < 10) t += 1;
    else if (t < 100) t += 10;
    else if (t < 1000) t += 100;
    else t += 1000;
  }
  if (punkte[punkte.length - 1] !== 10000) punkte.push(10000);
  return punkte;
}

export interface KriechSchwindVerlauf {
  zeitpunkte: number[];
  /** φ(t,t₀) */
  kriechzahl: number[];
  /** Schwinddehnungen in µm/m */
  trocknung: number[]; autogen: number[]; gesamt: number[];
  /** wirksamer E-Modul in N/mm² */
  eModulWirksam: number[];
}

/** Zeitverläufe für die Diagramme des Reiters „Beton“ */
export function kriechSchwindVerlauf(m: KriechSchwindModell, zeitpunkte: readonly number[] = diagrammZeitpunkte()): KriechSchwindVerlauf {
  const v: KriechSchwindVerlauf = { zeitpunkte: [...zeitpunkte], kriechzahl: [], trocknung: [], autogen: [], gesamt: [], eModulWirksam: [] };
  for (const t of zeitpunkte) {
    const cd = trocknungsschwinden(m, t), ca = autogenesSchwinden(m, t);
    v.kriechzahl.push(kriechzahl(m, t));
    v.trocknung.push(cd * 1e6);
    v.autogen.push(ca * 1e6);
    v.gesamt.push((cd + ca) * 1e6);
    v.eModulWirksam.push(wirksamerEModul(m, t));
  }
  return v;
}

export interface StuetzenZustand {
  phiT: number;
  /** Dehnungen (dimensionslos, Verkürzung positiv) */
  epsEl: number; epsCr: number; epsCs: number; epsTot: number;
  /** Verkürzungen in mm */
  dL_el: number; dL_cr: number; dL_cs: number; dL_tot: number;
}

/** Lehrannahmen des Reiters „Rheologie“: Dauerlastspannung 8,5 N/mm², Stützenhöhe 3 m */
export const STUETZE_LEHRWERTE = { sigmaC: 8.5, laengeMm: 3000 } as const;

/**
 * Faktor zwischen Tangentenmodul E_c und mittlerem Sekantenmodul E_cm: E_c = 1,05·E_cm.
 * DIN EN 1992-1-1, 3.1.4(3): Die Kriechzahl φ bezieht sich auf E_c; die Kriechdehnung ist
 * ε_cc(t,t₀) = φ(t,t₀)·σ_c/E_c (Gl. 3.6).
 */
export const EC_TANGENTENFAKTOR = 1.05;

/**
 * Verformung einer Stütze unter Dauerlast zum Zeitpunkt t (d):
 * ε_tot = σ_c/E_cm + φ(t,t₀)·σ_c/(1,05·E_cm) + ε_cs(t).
 * Elastischer Anteil mit E_cm (Sekantenmodul), Kriechanteil nach 3.1.4(3) mit E_c = 1,05·E_cm.
 * Für t ≤ t₀ wird φ(t₀ + 0,01 d) angesetzt (wie im Modul: Lastbeginn als „gerade belastet“).
 */
export function stuetzenVerformung(m: KriechSchwindModell, t: number, sigmaC: number = STUETZE_LEHRWERTE.sigmaC, laengeMm: number = STUETZE_LEHRWERTE.laengeMm): StuetzenZustand {
  const phiT = kriechzahl(m, Math.max(t, m.eingabe.t0 + 0.01));
  const epsCs = gesamtschwinden(m, t);
  const epsEl = sigmaC / m.Ecm;
  const epsCr = phiT * sigmaC / (EC_TANGENTENFAKTOR * m.Ecm);
  const epsTot = epsEl + epsCr + epsCs;
  return { phiT, epsEl, epsCr, epsCs, epsTot, dL_el: epsEl * laengeMm, dL_cr: epsCr * laengeMm, dL_cs: epsCs * laengeMm, dL_tot: epsTot * laengeMm };
}

// ---------------------------------------------------------------------------------------------
// Teil B – Relaxation von Spannstahl (DIN EN 1992-1-1, 3.3.2)
// ---------------------------------------------------------------------------------------------

export type Relaxationsklasse = '1' | '2' | '3';

/** ρ₁₀₀₀ in % sowie Beiwerte k₁, k₂ der Gl. (3.28) bis (3.30) je Relaxationsklasse */
export const RELAXATION_KLASSEN: Readonly<Record<Relaxationsklasse, { rho1000: number; k1: number; k2: number }>> = {
  '1': { rho1000: 8.0, k1: 5.39, k2: 6.7 },
  '2': { rho1000: 2.5, k1: 0.66, k2: 9.1 },
  '3': { rho1000: 4.0, k1: 1.98, k2: 8.0 },
};

/** Zeitpunkte der Relaxationskurve in Stunden */
export const RELAXATION_ZEITPUNKTE_H: readonly number[] = [1, 10, 100, 1000, 10000, 100000, 500000];

/**
 * Relaxationsverlust Δσ_pr/σ_pi in % nach Gl. (3.28)–(3.30): k₁·ρ₁₀₀₀·e^(k₂·μ)·(t/1000)^(0,75·(1 − μ))·10⁻⁵ · 100.
 * μ = σ_pi/f_pk; für μ ≤ 0,5 wird die Relaxation vernachlässigt (Lehrannahme des Moduls). t in Stunden.
 */
export function spannstahlRelaxation(klasse: Relaxationsklasse, mu: number, tStunden: number): number {
  if (!(mu > 0.5)) return 0;
  const { rho1000, k1, k2 } = RELAXATION_KLASSEN[klasse] ?? RELAXATION_KLASSEN['2'];
  return k1 * rho1000 * Math.exp(k2 * mu) * Math.pow(tStunden / 1000, 0.75 * (1 - mu)) * 1e-5 * 100;
}

export interface RelaxationErgebnis {
  zeitpunkteH: number[];
  /** Verlust in % */
  verlustProzent: number[];
  gueltig: boolean;
  hinweise: Hinweis[];
}

export function relaxationsVerlauf(klasse: Relaxationsklasse, mu: number, zeitpunkteH: readonly number[] = RELAXATION_ZEITPUNKTE_H): RelaxationErgebnis {
  const hinweise: Hinweis[] = [];
  muss(hinweise, istEndlich(mu), 'mu', 'Das Spannungsniveau muss eine endliche Zahl sein.');
  muss(hinweise, mu > 0 && mu < 1, 'mu', 'Das Spannungsniveau σ_pi/f_pk muss zwischen 0 und 1 liegen.');
  muss(hinweise, klasse in RELAXATION_KLASSEN, 'klasse', 'Unbekannte Relaxationsklasse (1, 2 oder 3).');
  if (mu > 0.8) hinweise.push({ stufe: 'warnung', feld: 'mu', text: 'μ > 0,8: Die Relaxationsgleichungen sind für übliche Spannungsniveaus bis etwa 0,8·f_pk aufgestellt.' });
  if (mu <= 0.5) hinweise.push({ stufe: 'warnung', feld: 'mu', text: 'μ ≤ 0,5: Die Relaxation wird im Lehrmodell vernachlässigt (Verlust 0).' });
  if (zeitpunkteH.some(t => t > 500000)) hinweise.push({ stufe: 'warnung', feld: 't', text: 'Über 500 000 h (≈ 57 Jahre) hinaus ist die Relaxationsfunktion nicht abgesichert.' });
  return { zeitpunkteH: [...zeitpunkteH], verlustProzent: zeitpunkteH.map(t => spannstahlRelaxation(klasse, mu, t)), gueltig: !hatFehler(hinweise), hinweise };
}

// ---------------------------------------------------------------------------------------------
// Teil C – Rheologische Grundmodelle (qualitative Lehrkurven, KriechModellDiagramm)
// ---------------------------------------------------------------------------------------------

/** Lehrparameter der Kurven: Restspannung Zener 40 %, Kriechanteile Kelvin-Voigt 1,5 und Zener 1,2 (bezogen auf ε_el) */
export const RHEOLOGIE_LEHRWERTE = { zenerRest: 0.4, kelvinKriechfaktor: 1.5, zenerKriechfaktor: 1.2, epsElJeMpa: 0.1 } as const;

/** Maxwell-Relaxation σ(t) = σ₀·e^(−t/τ) */
export const maxwellRelaxation = (sigma0: number, t: number, tau: number) => sigma0 * Math.exp(-t / tau);
/** Zener-Relaxation (Standard-Linear-Solid) σ(t) = σ₀·[0,4 + 0,6·e^(−t/τ)] */
export const zenerRelaxation = (sigma0: number, t: number, tau: number) =>
  sigma0 * (RHEOLOGIE_LEHRWERTE.zenerRest + (1 - RHEOLOGIE_LEHRWERTE.zenerRest) * Math.exp(-t / tau));
/** Kelvin-Voigt-Kriechen (mit Sofortanteil) ε(t) = ε_el·[1 + 1,5·(1 − e^(−t/τ))] */
export const kelvinKriechen = (epsEl: number, t: number, tau: number) => epsEl * (1 + RHEOLOGIE_LEHRWERTE.kelvinKriechfaktor * (1 - Math.exp(-t / tau)));
/** Maxwell-Kriechen ε(t) = ε_el·(1 + t/τ) – unbegrenztes Fließen */
export const maxwellKriechen = (epsEl: number, t: number, tau: number) => epsEl * (1 + t / tau);
/** Zener-Kriechen ε(t) = ε_el·[1 + 1,2·(1 − e^(−t/τ))] */
export const zenerKriechen = (epsEl: number, t: number, tau: number) => epsEl * (1 + RHEOLOGIE_LEHRWERTE.zenerKriechfaktor * (1 - Math.exp(-t / tau)));
/** Halbwertszeit der Relaxation t½ = τ·ln 2 */
export const halbwertszeit = (tau: number) => tau * Math.LN2;
/** Elastische Anfangsdehnung der Lehrkurve in ‰ aus der Dauerlastspannung in MPa (ε_el = σ/10) */
export const lehrDehnungPromille = (sigma: number) => sigma * RHEOLOGIE_LEHRWERTE.epsElJeMpa;

export interface RheologieKennwerte {
  halbwertszeit: number;
  sigmaEndeMaxwell: number; sigmaEndeZener: number;
  /** Spannungsabbau Maxwell bis t_ende in % */
  abbauMaxwellProzent: number;
  epsEl: number; epsEndeKelvin: number; epsEndeMaxwell: number;
  gueltig: boolean;
  hinweise: Hinweis[];
}

/** Kennwerte der Diagrammkarten (Relaxation bzw. Kriechen bis t_ende, Standard 10 s) */
export function rheologieKennwerte(wert0: number, tau: number, tEnde = 10): RheologieKennwerte {
  const hinweise: Hinweis[] = [];
  muss(hinweise, istEndlich(wert0, tau, tEnde), 'eingabe', 'Alle Eingaben müssen endliche Zahlen sein.');
  muss(hinweise, tau > 0, 'tau', 'Die Relaxations- bzw. Retardationszeit τ muss größer als 0 sein.');
  muss(hinweise, wert0 > 0, 'wert0', 'Die Spannung muss größer als 0 sein.');
  const sigmaEndeMaxwell = maxwellRelaxation(wert0, tEnde, tau);
  const sigmaEndeZener = zenerRelaxation(wert0, tEnde, tau);
  const epsEl = lehrDehnungPromille(wert0);
  return {
    halbwertszeit: halbwertszeit(tau), sigmaEndeMaxwell, sigmaEndeZener,
    abbauMaxwellProzent: ((wert0 - sigmaEndeMaxwell) / wert0) * 100,
    epsEl, epsEndeKelvin: kelvinKriechen(epsEl, tEnde, tau), epsEndeMaxwell: maxwellKriechen(epsEl, tEnde, tau),
    gueltig: !hatFehler(hinweise), hinweise,
  };
}
