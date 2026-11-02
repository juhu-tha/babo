/**
 * Bewehrungskorrosion (Umsetzungsplan Phase 4, AP 4.2). Reiner Rechenkern – geprüft in tests/korrosion.test.ts.
 * Verhalten 1:1 aus src/modules/Korrosion.tsx übernommen.
 *
 * 1. Abtragsrate nach dem Faradayschen Gesetz:  v_corr = i_corr · M / (z · F · ρ)
 *    Eisen (M = 55,845 g/mol, z = 2, ρ = 7,874 g/cm³): 1 µA/cm² ≙ 11,6 µm/a (im Modul als Lehrwert 11,6 verwendet).
 *    Größenordnung bestätigt durch RILEM TC 154-EMC (Wiedergabe in François, RILEM Technical Letters 6 (2021),
 *    Tab. 1: 1 µA/cm² ≈ 0,01 mm/a).
 * 2. Chlorideindringen (2. Ficksches Gesetz, Fehlerfunktionslösung):
 *      C(x, t) = C_s · [1 − erf(x / (2 · √(D_app(t) · t)))],   D_app(t) = D_app,0 · (t₀/t)^a,  t₀ = 28 d = 0,0767 a
 *    (Ansatz nach fib Bulletin 34, ohne k_e, k_t; kritischer Gehalt als Orientierungswert 0,5 M.-% v. z.).
 *    Gemeinsamer Kern mit der Lebensdauerbemessung: chloridgehalt() und alterungsfaktor() aus src/calc/lebensdauer.ts
 *    mit C₀ = 0 und Δx = 0 (Runde 7: vorher eigene erf-Näherung und t₀ = 28/365 a; Abweichung < 10⁻⁴ relativ).
 * 3. Karbonatisierungsfront x_c = K · √t (Wurzel-t-Gesetz) und Umrechnung eines Schnellkarbonatisierungs-
 *    koeffizienten – beides aus src/calc/schnellkarbonatisierung.ts übernommen (keine Duplikate).
 * 4. Lokalelement-Simulator: qualitatives Lehrmodell (i_corr aus Chloridgehalt und Feuchte, Rostsprengdruck);
 *    alle Beiwerte sind Lehrannahmen, keine Normwerte.
 * Lehr- und Vorbemessungswerkzeug; ersetzt keine Dauerhaftigkeitsbemessung oder Bauwerksuntersuchung.
 */
import { type Hinweis, hatFehler, istEndlich, istAnzahl, muss, nurGueltig, MAX_STUETZSTELLEN } from './plausibilitaet';
import { tiefeNach, umrechnungsfaktor } from './schnellkarbonatisierung';
import { chloridgehalt, alterungsfaktor, T0_JAHRE, D_EINHEIT_MM2_A } from './lebensdauer';

// ---------------------------------------------------------------------------------------------------
// 1. Faraday
// ---------------------------------------------------------------------------------------------------

/** Faraday-Konstante [C/mol] (CODATA 2018, exakt) */
export const FARADAY = 96485.33212;
/** Eisen: molare Masse [g/mol], Wertigkeit, Dichte [g/cm³] */
export const EISEN = { M: 55.845, z: 2, rho: 7.874 } as const;
/** Sekunden je Jahr (Julianisches Jahr, 365,25 d) */
export const SEKUNDEN_JE_JAHR = 365.25 * 86400;
/** Lehrwert im Modul: Abtrag in µm/a je µA/cm² (Eisen) */
export const ABTRAG_UM_JE_UA_CM2 = 11.6;

/** Abtragsrate [µm/a] aus Korrosionsstromdichte i_corr [µA/cm²] nach Faraday */
export function abtragsrateFaraday(iCorr: number, M: number = EISEN.M, z: number = EISEN.z, rho: number = EISEN.rho): number {
  // i [A/cm²] · M / (z · F · ρ) → cm/s; · s/a · 10⁴ µm/cm
  return ((iCorr * 1e-6 * M) / (z * FARADAY * rho)) * SEKUNDEN_JE_JAHR * 1e4;
}

/** Restdurchmesser und Querschnittsverlust eines Stabs bei gleichmäßigem Abtrag (beidseitig am Durchmesser) */
export function querschnittsverlust(d0Mm: number, abtragUmJeJahr: number, jahre: number) {
  const dRest = Math.max(0, d0Mm - (2 * abtragUmJeJahr * jahre) / 1000);
  return { dRest, verlust: 1 - (dRest / d0Mm) ** 2 };
}

// ---------------------------------------------------------------------------------------------------
// 2. Chlorid
// ---------------------------------------------------------------------------------------------------

/** Referenzalter t₀ = 28 d = 0,0767 a (wie src/calc/lebensdauer.ts, fib Bulletin 34) */
export const T0_CHLORID = T0_JAHRE;
/** kritischer korrosionsauslösender Chloridgehalt (Orientierungswert) [M.-% v. z.] */
export const CL_KRITISCH = 0.5;

/** zeitabhängiger Diffusionskoeffizient D_app(t) = D₀ · (t₀/max(t, t₀))^a  (gleiche Einheit wie D₀) */
export const dAppAlterung = (d0: number, tJahre: number, a: number) => d0 * alterungsfaktor(tJahre, a);

/**
 * Chloridgehalt C(x, t) [Einheit von C_s]; x in mm, t in a, D_app,0 in 10⁻¹² m²/s.
 * Gemeinsamer Kern: lebensdauer.chloridgehalt mit C₀ = 0, Δx = 0 und D_app(t) in mm²/a.
 */
export function chloridGehalt(xMm: number, tJahre: number, dApp12: number, cS: number, a: number): number {
  return chloridgehalt(xMm, tJahre, 0, cS, 0, dAppAlterung(dApp12 * D_EINHEIT_MM2_A, tJahre, a));
}

export interface ChloridEingabe {
  /** Zeit [a] */
  t: number;
  /** Betondeckung [mm] */
  cNom: number;
  /** D_app,0 bei t₀ = 28 d [10⁻¹² m²/s] */
  dApp: number;
  /** Oberflächenchloridgehalt C_s [M.-% v. z.] */
  cS: number;
  /** Alterungsexponent a [-] */
  a: number;
}

export interface ChloridErgebnis {
  /** Tiefen 0 … 100 mm (Schritt 1 mm) */
  tiefen: number[];
  /** Chloridgehalte je Tiefe */
  profil: number[];
  /** Gehalt in Höhe der Bewehrung */
  cBewehrung: number;
  /** C(c_nom) ≥ C_krit */
  depassiviert: boolean;
  gueltig: boolean;
  hinweise: Hinweis[];
}

export function chloridProfil(e: ChloridEingabe): ChloridErgebnis {
  const hinweise: Hinweis[] = [];
  muss(hinweise, istEndlich(e.t, e.cNom, e.dApp, e.cS, e.a), 'chlorid', 'Alle Eingaben müssen Zahlen sein.');
  if (!hatFehler(hinweise)) {
    muss(hinweise, e.t > 0, 't', 'Die Zeit muss größer als 0 sein.');
    muss(hinweise, e.dApp > 0, 'dApp', 'Der Diffusionskoeffizient muss größer als 0 sein.');
    muss(hinweise, e.cS >= 0, 'cS', 'Der Oberflächenchloridgehalt darf nicht negativ sein.');
    muss(hinweise, e.cNom >= 0, 'cNom', 'Die Betondeckung darf nicht negativ sein.');
    muss(hinweise, e.a >= 0 && e.a < 1, 'a', 'Der Alterungsexponent muss zwischen 0 und 1 liegen.');
  }
  const tiefen = Array.from({ length: 101 }, (_, i) => i);
  if (hatFehler(hinweise)) return nurGueltig({ tiefen, profil: tiefen.map(() => NaN), cBewehrung: NaN, depassiviert: false, gueltig: false, hinweise });
  const profil = tiefen.map(x => chloridGehalt(x, e.t, e.dApp, e.cS, e.a));
  const cBewehrung = chloridGehalt(e.cNom, e.t, e.dApp, e.cS, e.a);
  return nurGueltig({ tiefen, profil, cBewehrung, depassiviert: cBewehrung >= CL_KRITISCH, gueltig: true, hinweise });
}

// ---------------------------------------------------------------------------------------------------
// 3. Karbonatisierung (Wurzel-t-Gesetz, aus schnellkarbonatisierung.ts)
// ---------------------------------------------------------------------------------------------------

export interface KarbonatisierungsFront {
  /** Tiefe nach t Jahren [mm] */
  xc: number;
  /** Zeit bis zum Erreichen der Deckung (c/K)² [a] */
  tDeckung: number;
  depassiviert: boolean;
  gueltig: boolean;
  hinweise: Hinweis[];
}

/** Karbonatisierungsfront x_c = K · √t gegenüber der Deckung c (K in mm/√a, t in a, c in mm) */
export function karbonatisierungsFront(k: number, tJahre: number, deckungMm: number): KarbonatisierungsFront {
  const hinweise: Hinweis[] = [];
  muss(hinweise, istEndlich(k, tJahre, deckungMm), 'karbonatisierung', 'Alle Eingaben müssen Zahlen sein.');
  if (!hatFehler(hinweise)) {
    muss(hinweise, k >= 0, 'k', 'Der Karbonatisierungskoeffizient darf nicht negativ sein.');
    muss(hinweise, tJahre >= 0, 't', 'Die Zeit darf nicht negativ sein.');
    muss(hinweise, deckungMm > 0, 'deckung', 'Die Betondeckung muss größer als 0 sein.');
  }
  if (hatFehler(hinweise)) return nurGueltig({ xc: NaN, tDeckung: NaN, depassiviert: false, gueltig: false, hinweise });
  const xc = tiefeNach(k, tJahre);
  return nurGueltig({ xc, tDeckung: k > 0 ? (deckungMm / k) ** 2 : Infinity, depassiviert: xc >= deckungMm, gueltig: true, hinweise });
}

export interface KarbonatisierungsLebensdauer extends KarbonatisierungsFront {
  /** Zeit bis zur Depassivierung (c/K)², auf ganze Jahre gerundet [a] */
  tKrit: number;
  /** verbleibende Jahre bis zur Depassivierung t_krit − t (negativ: Front hat die Bewehrung bereits erreicht) [a] */
  restJahre: number;
}

/**
 * Lebensdauersimulator (src/modules/dauerhaftigkeit/BetonDauerhaftigkeitsSimulator.tsx): Front x_c = K·√t,
 * t_krit = round((c/K)²) und Restjahre t_krit − t. Rundung auf ganze Jahre wie im Modul.
 * K muss > 0 sein (früher: Ersatzwert 999 a bei K = 0).
 */
export function karbonatisierungsLebensdauer(k: number, tJahre: number, deckungMm: number): KarbonatisierungsLebensdauer {
  const front = karbonatisierungsFront(k, tJahre, deckungMm);
  if (front.gueltig && !(k > 0)) {
    front.hinweise.push({ stufe: 'fehler', feld: 'k', text: 'Der Karbonatisierungskoeffizient muss größer als 0 sein.' });
    front.gueltig = false;
  }
  if (!front.gueltig) return nurGueltig({ ...front, tKrit: NaN, restJahre: NaN }); // Grenzfallprüfung 02.11.2026: x_c nachträglich ungültig
  const tKrit = Math.round(front.tDeckung);
  if (tKrit > 200) front.hinweise.push({ stufe: 'warnung', feld: 'k', text: 'Rechnerische Zeit bis zur Depassivierung über 200 Jahre – das Wurzel-t-Gesetz ist so weit nicht abgesichert.' });
  return { ...front, tKrit, restJahre: tKrit - tJahre };
}

/** Kurve x_c(t) für t = 0 … tMax (ganzzahlige Schritte) */
/** Karbonatisierungstiefe je Jahr 0 … t_max; ungültiges t_max → leere Liste (Grenzfallprüfung 02.11.2026, vorher Ausnahme) */
export const karbonatisierungsKurve = (k: number, tMax: number) => istAnzahl(tMax) ? Array.from({ length: tMax + 1 }, (_, t) => tiefeNach(k, t)) : [];

export interface SchnellUmrechnung {
  /** K_nat [mm/√a] */
  kNat: number;
  /** Tiefen der Schnellprüfung je Tag [mm] */
  tiefenSchnell: number[];
  /** äquivalente natürliche Tiefen je Tag [mm] */
  tiefenNat: number[];
  gueltig: boolean;
  hinweise: Hinweis[];
}

/**
 * CO₂-Konzentration der Prüfkammer im Schnellverfahren nach DIN EN 12390-12:2020 in Vol.-% (Referenzbedingung
 * 3,0 Vol.-% bei 20 °C und 57 % r. F.; wie src/calc/schnellkarbonatisierung.ts). Vorher im Modul: 2,0 Vol.-%.
 */
export const CO2_KAMMER_EN12390_12 = 3.0;

/** Schnellkarbonatisierung: K_nat = K_acc · √(c_nat/c_acc) · √365 und Kurven für 0 … tageMax Tage */
export function schnellUmrechnung(kAcc: number, cAcc: number, cNat: number, tageMax = 90): SchnellUmrechnung {
  const hinweise: Hinweis[] = [];
  muss(hinweise, istEndlich(kAcc, cAcc, cNat) && kAcc >= 0, 'kAcc', 'Der Koeffizient muss eine nicht negative Zahl sein.');
  muss(hinweise, cAcc > 0 && cNat > 0, 'cAcc', 'Die CO₂-Konzentrationen müssen größer als 0 sein.');
  // Grenzfallprüfung 02.11.2026: Tageszahl begrenzen (vorher Ausnahme bei ∞)
  muss(hinweise, istAnzahl(tageMax), 'tageMax', `Die Prüfdauer muss eine ganze Zahl von 0 bis ${MAX_STUETZSTELLEN} Tagen sein.`);
  const tage = Array.from({ length: istAnzahl(tageMax) ? tageMax + 1 : 0 }, (_, i) => i);
  if (hatFehler(hinweise)) return nurGueltig({ kNat: NaN, tiefenSchnell: tage.map(() => NaN), tiefenNat: tage.map(() => NaN), gueltig: false, hinweise });
  if (cNat >= cAcc) hinweise.push({ stufe: 'warnung', feld: 'cNat', text: 'Die natürliche CO₂-Konzentration ist nicht kleiner als die Prüfkonzentration – die Umrechnung ist dann keine Schnellprüfung mehr.' });
  if (Math.abs(cAcc - CO2_KAMMER_EN12390_12) > 0.5) hinweise.push({ stufe: 'warnung', feld: 'cAcc', text: 'DIN EN 12390-12 prüft bei (3,0 ± 0,5) Vol.-% CO₂; bei anderen Kammerkonzentrationen ist die Übertragbarkeit eingeschränkt.' });
  const kNat = kAcc * umrechnungsfaktor(cAcc, cNat);
  return nurGueltig({
    kNat,
    tiefenSchnell: tage.map(d => kAcc * Math.sqrt(d)),
    tiefenNat: tage.map(d => tiefeNach(kNat, d / 365)),
    gueltig: true,
    hinweise,
  });
}

// ---------------------------------------------------------------------------------------------------
// 4. Lokalelement-Simulator (qualitatives Lehrmodell)
// ---------------------------------------------------------------------------------------------------

/** Depassivierungsgrenze im Simulator [M.-% v. z.] */
export const CL_DEPASSIVIERUNG = CL_KRITISCH;
/** Passivstromdichte [µA/cm²] */
export const I_PASSIV = 0.08;
/** Lehrannahmen: Rostvolumenfaktor (Zuwachs je abgetragener Dicke), wirksamer E-Modul [MPa], f_ctm [MPa] */
export const LOKALELEMENT = { rostFaktor: 2.5, eEff: 12000, fctm: 3.0, iMax: 18.0, sigmaMax: 14.0 } as const;

export type SchadensStufe = 'passiv' | 'initiierung' | 'rissbildung' | 'oberflaechenriss' | 'abplatzung';

export interface LokalelementEingabe {
  /** Chloridgehalt an der Bewehrung [M.-% v. z.] */
  clGehalt: number;
  /** relative Luftfeuchte [%] */
  relFeuchte: number;
  /** Betondeckung [mm] */
  deckungMm: number;
  /** Dauer [a] */
  jahre: number;
}

export interface LokalelementErgebnis {
  depassiviert: boolean;
  /** Korrosionsstromdichte [µA/cm²] */
  iCorr: number;
  /** Abtragsrate [µm/a] */
  vCorr: number;
  /** Abtrag über die Dauer [µm] */
  abtrag: number;
  /** Dicke der Rostschicht [mm] */
  rostDicke: number;
  /** Radialer Sprengdruck (Lehrmodell) [MPa] */
  sigmaRadial: number;
  stufe: SchadensStufe;
  gueltig: boolean;
  hinweise: Hinweis[];
}

/** Feuchtefaktor des Lehrmodells: Maximum bei 85 % r. F., Abfall bei Wassersättigung (O₂-Mangel) */
export function feuchteFaktor(relFeuchte: number): number {
  if (relFeuchte < 50) return Math.max(0.05, ((relFeuchte - 30) / 20) * 0.4);
  if (relFeuchte <= 85) return 0.4 + ((relFeuchte - 50) / 35) * 0.6;
  return Math.max(0.15, 1.0 - ((relFeuchte - 85) / 15) * 0.85);
}

/** Korrosionsstromdichte des Lehrmodells [µA/cm²] */
export function iCorrLehrmodell(clGehalt: number, relFeuchte: number): number {
  if (clGehalt < CL_DEPASSIVIERUNG) return I_PASSIV;
  const clUeberschuss = Math.min(3.5, clGehalt / CL_DEPASSIVIERUNG);
  return Math.min(LOKALELEMENT.iMax, 1.2 * clUeberschuss * feuchteFaktor(relFeuchte) * 2.8);
}

/** Schadensstufe aus dem Sprengdruck relativ zu f_ctm (Schwellen 0,7 / 1,5 / 2,8 · f_ctm) */
export function schadensStufe(depassiviert: boolean, sigmaRadial: number, fctm: number = LOKALELEMENT.fctm): SchadensStufe {
  if (!depassiviert) return 'passiv';
  if (sigmaRadial < fctm * 0.7) return 'initiierung';
  if (sigmaRadial < fctm * 1.5) return 'rissbildung';
  if (sigmaRadial < fctm * 2.8) return 'oberflaechenriss';
  return 'abplatzung';
}

export function lokalelement(e: LokalelementEingabe): LokalelementErgebnis {
  const hinweise: Hinweis[] = [];
  muss(hinweise, istEndlich(e.clGehalt, e.relFeuchte, e.deckungMm, e.jahre), 'lokalelement', 'Alle Eingaben müssen Zahlen sein.');
  if (!hatFehler(hinweise)) {
    muss(hinweise, e.clGehalt >= 0, 'clGehalt', 'Der Chloridgehalt darf nicht negativ sein.');
    muss(hinweise, e.relFeuchte >= 0 && e.relFeuchte <= 100, 'relFeuchte', 'Die relative Luftfeuchte muss zwischen 0 und 100 % liegen.');
    muss(hinweise, e.deckungMm > 0, 'deckungMm', 'Die Betondeckung muss größer als 0 sein.');
    muss(hinweise, e.jahre >= 0, 'jahre', 'Die Dauer darf nicht negativ sein.');
  }
  if (hatFehler(hinweise)) {
    return nurGueltig({ depassiviert: false, iCorr: NaN, vCorr: NaN, abtrag: NaN, rostDicke: NaN, sigmaRadial: NaN, stufe: 'passiv', gueltig: false, hinweise });
  }
  const depassiviert = e.clGehalt >= CL_DEPASSIVIERUNG;
  const iCorr = iCorrLehrmodell(e.clGehalt, e.relFeuchte);
  const vCorr = iCorr * ABTRAG_UM_JE_UA_CM2;
  const abtrag = vCorr * e.jahre;
  const rostDicke = (abtrag * LOKALELEMENT.rostFaktor) / 1000;
  // Lehrmodell Hohlzylinder: σ ≈ E_eff · (Rostdicke/10) / c  (Ansatz unverändert aus dem Modul)
  const sigmaRadial = depassiviert ? Math.min(LOKALELEMENT.sigmaMax, (LOKALELEMENT.eEff * (rostDicke / 10)) / e.deckungMm) : 0;
  return nurGueltig({ depassiviert, iCorr, vCorr, abtrag, rostDicke, sigmaRadial, stufe: schadensStufe(depassiviert, sigmaRadial), gueltig: true, hinweise });
}
