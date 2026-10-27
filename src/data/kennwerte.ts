/**
 * Zentrale Materialkennwerte (Umsetzungsplan Phase 0, AP 0.6).
 *
 * Betonkennwerte nach DIN EN 1992-1-1:2011-01, Tabelle 3.1, kommen ausschließlich aus
 * CONCRETE in src/utils/ec2Spannbeton.ts (getestet in tests/ec2Spannbeton.test.ts).
 * Rechner und Module verwenden diese Funktionen statt eigener Tabellen;
 * tests/kennwerte.test.ts prüft, dass keine abweichenden lokalen Kopien entstehen.
 */
import { CONCRETE, type ConcreteClassData } from '../utils/ec2Spannbeton';

export { CONCRETE as BETON_EC2 };
export type { ConcreteClassData };

const ALLE = Object.values(CONCRETE);

/** Betonfestigkeitsklasse, z. B. 'C30/37' */
export function betonNachKlasse(klasse: string): ConcreteClassData | undefined {
  return CONCRETE[klasse];
}

/** Betonfestigkeitsklasse zur charakteristischen Zylinderdruckfestigkeit fck [MPa] */
export function betonNachFck(fck: number): ConcreteClassData | undefined {
  return ALLE.find(c => c.fck === fck);
}

/**
 * Mittelwert der zentrischen Zugfestigkeit fctm [MPa]: Tabellenwert nach EC2 Tab. 3.1,
 * sonst Gl. in Tab. 3.1 (fctm = 0,30·fck^(2/3) bis C50/60, darüber 2,12·ln(1 + fcm/10)).
 */
export function fctmVonFck(fck: number): number {
  const tab = betonNachFck(fck);
  if (tab) return tab.fctm;
  return fck <= 50 ? 0.3 * Math.pow(fck, 2 / 3) : 2.12 * Math.log(1 + (fck + 8) / 10);
}

/**
 * Charakteristische Druckfestigkeit zum Alter t nach DIN EN 1992-1-1, 3.1.2(5):
 * f_ck(t) = f_cm(t) − 8 N/mm² für 3 d < t < 28 d, f_ck(t) = f_ck für t ≥ 28 d.
 * Für t ≤ 3 d ist die Beziehung in 3.1.2(5) nicht angegeben; der Wert wird wie für 3 < t < 28 d gebildet und
 * soll vom Aufrufer als Warnung gekennzeichnet werden (Werte in N/mm², t in d).
 */
export function fckZumAlter(fck: number, fcmT: number, t: number): number {
  if (t >= 28) return fck;
  return Math.max(0, fcmT - 8);
}

/** Spannungs-Dehnungs-Kennwerte nach DIN EN 1992-1-1, Tab. 3.1 (Dehnungen in ‰) */
export interface DehnungsKennwerte {
  ec1: number; ecu1: number; ec2: number; ecu2: number; n: number; ec3: number; ecu3: number;
  /** true, wenn f_ck > 90 N/mm²: Werte von C90/105 gehalten (Gleichungen der Tab. 3.1 gelten nur bis C90/105) */
  ueberC90: boolean;
}

/**
 * ε_c1, ε_cu1, ε_c2, ε_cu2, n, ε_c3, ε_cu3 nach DIN EN 1992-1-1, Tab. 3.1.
 * Klassenwerte (C12/15 … C90/105) kommen aus der Tabelle; für Zwischenwerte gelten die Gleichungen der Tab. 3.1
 * (ε_c2 = 2,0 + 0,085·(f_ck − 50)^0,53; ε_cu2 = ε_cu3 = 2,6 + 35·[(90 − f_ck)/100]^4; n = 1,4 + 23,4·[(90 − f_ck)/100]^4;
 * ε_c3 = 1,75 + 0,55·(f_ck − 50)/40; ε_cu1 = 2,8 + 27·[(98 − f_cm)/100]^4 für f_ck ≥ 50; ε_c1 = 0,7·f_cm^0,31 ≤ 2,8).
 * Die Gleichungen gelten nur bis f_ck = 90 N/mm² – darüber steigen ε_cu und n wieder an. Für f_ck > 90 werden deshalb die
 * Werte von C90/105 gehalten (die Spalte C100/115 des NA DE nennt dieselben Dehnungswerte – vorläufig, F-Freigabe).
 */
export function dehnungsKennwerte(fck: number): DehnungsKennwerte {
  const tab = betonNachFck(fck);
  if (tab) return { ec1: tab.eps_c1, ecu1: tab.eps_cu1, ec2: tab.eps_c2, ecu2: tab.eps_cu2, n: tab.n, ec3: tab.eps_c3, ecu3: tab.eps_cu3, ueberC90: false };
  if (fck > 90) {
    const c = CONCRETE['C90/105'];
    return { ec1: c.eps_c1, ecu1: c.eps_cu1, ec2: c.eps_c2, ecu2: c.eps_cu2, n: c.n, ec3: c.eps_c3, ecu3: c.eps_cu3, ueberC90: true };
  }
  const fcm = fck + 8;
  const ec1 = Math.min(2.8, 0.7 * Math.pow(fcm, 0.31));
  if (fck <= 50) return { ec1, ecu1: 3.5, ec2: 2.0, ecu2: 3.5, n: 2.0, ec3: 1.75, ecu3: 3.5, ueberC90: false };
  const q = Math.pow((90 - fck) / 100, 4);
  const ecu2 = 2.6 + 35 * q;
  return {
    ec1, ecu1: 2.8 + 27 * Math.pow((98 - fcm) / 100, 4), ec2: 2.0 + 0.085 * Math.pow(fck - 50, 0.53), ecu2,
    n: 1.4 + 23.4 * q, ec3: 1.75 + 0.55 * (fck - 50) / 40, ecu3: ecu2, ueberC90: false,
  };
}

// ---------------------------------------------------------------------------------------------
// Bemessungswert der Betondruckfestigkeit f_cd (Entscheidung Prof. Huber 27.10.).
// Einzige Stelle für f_cd in den Rechenkernen (Biegung, Querkraft, Stütze, Durchstanzen, Werkstoffmodelle).
// ---------------------------------------------------------------------------------------------

/** Teilsicherheitsbeiwerte γ_c nach DIN EN 1992-1-1/NA, Tab. 2.1DE (ständig/vorübergehend 1,5; außergewöhnlich 1,3) */
export const GAMMA_C = { staendig: 1.5, aussergewoehnlich: 1.3 } as const;

/** α_cc = 0,85 nach DIN EN 1992-1-1/NA, NDP zu 3.1.6(1)P */
export const ALPHA_CC = 0.85;

/**
 * Zusätzliche Abminderung für hochfesten Beton ab C55/67 – vorläufig, F-Freigabe (Prof. Huber):
 * f_cd = α_cc·f_ck/(γ_c·γ_c') mit γ_c' = 1/(1,1 − f_ck/500) ≥ 1, d. h. Faktor (1,1 − f_ck/500) ≤ 1 auf f_cd.
 * Öffentlich belegt ist der Faktor als γ_c' in DIN 1045-1:2008, 5.3.3(9) (Verweis in 9.1.6(2), Wiedergabe umwelt-online)
 * sowie im NA DE als Beiwert ν₂ = 1,1 − f_ck/500 ≤ 1,0 auf die Festigkeitsabminderung ν von Druckstreben/Fugen
 * (LBV Brandenburg, bautechnik-Tipps 15-03 und 15-06; FRILO-Handbuch „Nachweise am Stahlbetonquerschnitt“, NA-D).
 * Eine globale Abminderung von f_cd im NDP zu 3.1.6(1) war öffentlich nicht eindeutig belegbar → Schalter hier zentral.
 */
export const FCD_HOCHFEST_AKTIV = false; // Entscheidung Prof. Huber 27.10. (später): aus, bis der Normtext vorliegt (Gefahr der Doppelabminderung mit η)

/** Faktor (1,1 − f_ck/500) für f_ck ≥ 55 N/mm² (≤ 1,0), sonst 1,0 – zugleich ν₂ nach NA DE */
export function hochfestFaktor(fck: number): number {
  return fck >= 55 ? Math.min(1, 1.1 - fck / 500) : 1;
}

export interface FcdOptionen {
  /** α_cc (Standard 0,85) */
  alphaCc?: number;
  /** γ_c (Standard 1,5; außergewöhnlich GAMMA_C.aussergewoehnlich = 1,3) */
  gammaC?: number;
  /** zusätzliche Abminderung ab C55/67 (Standard FCD_HOCHFEST_AKTIV) */
  hochfest?: boolean;
}

/**
 * Bemessungswert der Betondruckfestigkeit f_cd = α_cc·f_ck/γ_c [N/mm²] nach DIN EN 1992-1-1/NA, 3.1.6(1),
 * ab C55/67 zusätzlich · (1,1 − f_ck/500) (vorläufig, F-Freigabe; siehe FCD_HOCHFEST_AKTIV).
 */
export function fcdBeton(fck: number, opt: FcdOptionen = {}): number {
  const alphaCc = opt.alphaCc ?? ALPHA_CC;
  const gammaC = opt.gammaC ?? GAMMA_C.staendig;
  const hf = (opt.hochfest ?? FCD_HOCHFEST_AKTIV) ? hochfestFaktor(fck) : 1;
  return (alphaCc * fck * hf) / gammaC;
}

/** Hinweistext, wenn die Hochfest-Abminderung greift (f_ck ≥ 55 N/mm² und Schalter aktiv), sonst null */
export function fcdHochfestHinweis(fck: number): string | null {
  if (!FCD_HOCHFEST_AKTIV || !(fck >= 55)) return null;
  const f = hochfestFaktor(fck).toFixed(3).replace('.', ',');
  return `Hochfester Beton (≥ C55/67): f_cd zusätzlich mit (1,1 − f_ck/500) = ${f} abgemindert (γ_c' = 1/(1,1 − f_ck/500); vorläufig, F-Freigabe).`;
}

/**
 * f_cd-Optionen der Lehrmodule, die f_cd früher selbst als 0,85·f_ck/1,5 gerechnet haben (Umstellung 27.10.).
 * Die Werte sind gegenüber vorher unverändert (tests/fcdModule.test.ts). Module, deren Eingabebereich C55/67 und
 * höher erreicht, rechnen bewusst ohne Hochfest-Abminderung (`hochfest: false`) – bisheriger Stand; ob sie dem
 * zentralen Schalter FCD_HOCHFEST_AKTIV folgen sollen, ist Prüfpunkt (vorläufig, F-Freigabe).
 * Module mit Bereich < C55/67 folgen dem Schalter (dort ohne Wirkung).
 */
export const FCD_MODUL = {
  /** Beispielrechnungen, Stahlbeton-Biegung (C20/25 … C30/37) */
  beispielrechnungen: {},
  /** Beispielrechnungen, Bauen im Bestand (Altbeton aus Unterlagen bzw. Prüfung) */
  beispielBestand: { hochfest: false },
  /** Stahlbeton von 0 bis 100 (C20/25 … C50/60) */
  stahlbetonNullBisHundert: {},
  /** Betonkennwerte, Tabelle C12/15 … C100/115: Spalte „f_cd (DE)“ = α_cc·f_ck/γ_c */
  betonkennwerteTabelle: { hochfest: false },
  /** Spannbeton-Kennwerte, f_cd(28 d) und f_cd(t) (C30/37 … C80/95) */
  spannbetonKennwerte: { hochfest: false },
  /** Carbonbeton, Spannungsblock (f_ck 30 … 100 N/mm²) */
  carbonbeton: { hochfest: false },
  /** Interpretations-Navigator, f_cd,is aus f_ck,is (10 … 50 N/mm²) */
  interpretationNavigator: {},
  /** Historische Materialkennwerte, Neubau-Ansatz γ_c = 1,5 */
  historischStandard: { hochfest: false },
  /**
   * Historische Materialkennwerte, Bestandsbewertung mit γ_c = 1,35: fachlich bewusst abgeminderter Teilsicherheitsbeiwert
   * für die Bewertung mit am Bauwerk über Bohrkerne bestätigter Festigkeit (Lehransatz des Moduls, kein Wert aus Tab. 2.1DE;
   * Quelle bei der F-Freigabe benennen).
   */
  historischBewertung: { gammaC: 1.35, hochfest: false },
} as const satisfies Record<string, FcdOptionen>;

/** Stützstellen f_ck → f_ck,cube der Tab. 3.1 (aufsteigend) */
const WUERFEL_STUETZ: readonly (readonly [number, number])[] = ALLE.map(c => [c.fck, c.fck_cube] as const).sort((a, b) => a[0] - b[0]);

/**
 * Charakteristische Würfeldruckfestigkeit f_ck,cube zur Zylinderfestigkeit f_ck über die Festigkeitsklassen der
 * DIN EN 206 / DIN EN 1992-1-1, Tab. 3.1 (linear zwischen den Klassen; außerhalb C12/15 … C90/105 mit dem Verhältnis
 * der Randklasse). Ersetzt den pauschalen Faktor 1,25 (C30/37: 37/30 = 1,233; C50/60: 1,20; C12/15: 1,25).
 */
export function fckCubeVonFck(fck: number): number {
  const s = WUERFEL_STUETZ;
  if (fck <= s[0][0]) return fck * (s[0][1] / s[0][0]);
  const last = s[s.length - 1];
  if (fck >= last[0]) return fck * (last[1] / last[0]);
  for (let i = 0; i < s.length - 1; i++) {
    const [x0, y0] = s[i], [x1, y1] = s[i + 1];
    if (fck >= x0 && fck <= x1) return y0 + (y1 - y0) * (fck - x0) / (x1 - x0);
  }
  return NaN;
}

/** Umkehrung von fckCubeVonFck: Zylinderfestigkeit zur Würfelfestigkeit über die Festigkeitsklassen */
export function fckVonFckCube(fckCube: number): number {
  const s = WUERFEL_STUETZ;
  if (fckCube <= s[0][1]) return fckCube * (s[0][0] / s[0][1]);
  const last = s[s.length - 1];
  if (fckCube >= last[1]) return fckCube * (last[0] / last[1]);
  for (let i = 0; i < s.length - 1; i++) {
    const [x0, y0] = s[i], [x1, y1] = s[i + 1];
    if (fckCube >= y0 && fckCube <= y1) return x0 + (x1 - x0) * (fckCube - y0) / (y1 - y0);
  }
  return NaN;
}

/** Auswahl einzelner Klassen als Nachschlagetabelle (für Auswahlfelder in Modulen) */
export function betonAuswahl<K extends string>(klassen: readonly K[]): Record<K, ConcreteClassData> {
  const out = {} as Record<K, ConcreteClassData>;
  for (const k of klassen) {
    const c = CONCRETE[k];
    if (!c) throw new Error(`Betonklasse ${k} fehlt in EC2 Tab. 3.1`);
    out[k] = c;
  }
  return out;
}

// ---------------------------------------------------------------------------------------------
// Stahlkennwerte (Runde 4, Entscheidung Prof. Huber 26.10.: Normwerte vereinheitlichen).
// Einzige Quelle für Baustahl S235/S355/S460 und Betonstahl B500A/B500B; Module und Rechenkerne
// verwenden diese Konstanten. tests/kennwerte.test.ts prüft die Werte und sucht abweichende Kopien.
// ---------------------------------------------------------------------------------------------

export type BaustahlGuete = 'S235' | 'S355' | 'S460';

/**
 * Nennwerte der Streckgrenze f_y und Zugfestigkeit f_u für Erzeugnisdicken t ≤ 40 mm nach DIN EN 1993-1-1,
 * Tab. 3.1 (S235/S355 nach EN 10025-2, S460 als S460N/NL nach EN 10025-3) [N/mm²].
 * Hinweis: 470 N/mm² für S355 ist der Tabellenwert für 40 mm < t ≤ 80 mm bzw. die Untergrenze des
 * Zugfestigkeitsbereichs nach EN 10025-2 – nicht der Bemessungsnennwert für t ≤ 40 mm.
 */
export const BAUSTAHL_EC3: Readonly<Record<BaustahlGuete, { fy: number; fu: number }>> = {
  S235: { fy: 235, fu: 360 },
  S355: { fy: 355, fu: 490 },
  S460: { fy: 460, fu: 540 },
};

/** Elastizitätsmodul von Baustahl E = 210 000 N/mm² nach DIN EN 1993-1-1, 3.2.6 */
export const E_BAUSTAHL = 210000;

export type BetonstahlSorte = 'B500A' | 'B500B';

/** Elastizitätsmodul von Betonstahl E_s = 200 000 N/mm² nach DIN EN 1992-1-1, 3.2.7(4) */
export const E_BETONSTAHL = 200000;

/**
 * Betonstahl B500 nach DIN 488-1 und DIN EN 1992-1-1, Anhang C (Tab. C.1): f_yk = 500 N/mm²,
 * k = (f_t/f_y)_k ≥ 1,05 (A) bzw. ≥ 1,08 (B), f_tk = k·f_yk (525 bzw. 540 N/mm²), ε_uk ≥ 25 ‰ (A) bzw. 50 ‰ (B).
 */
export const BETONSTAHL: Readonly<Record<BetonstahlSorte, { fyk: number; k: number; ftk: number; euk: number }>> = {
  B500A: { fyk: 500, k: 1.05, ftk: 525, euk: 25 },
  B500B: { fyk: 500, k: 1.08, ftk: 540, euk: 50 },
};

// ---------------------------------------------------------------------------------------------
// Holzkennwerte (Runde 5, Entscheidung Prof. Huber 27.10.: Normwerte vereinheitlichen).
// Einzige Quelle für Vollholz (DIN EN 338:2016-07, Tab. 1/3) und Brettschichtholz (DIN EN 14080:2013-09, Tab. 4/5).
// Module und Rechenkerne verwenden diese Konstanten; tests/kennwerte.test.ts prüft die Werte.
// Öffentliche Wiedergaben: studiomadera.it (UNI EN 338:2016, Tab. 15.1, Nadel- und Laubholz),
// structuralbasics.com und HASSLACHER-Broschüre „Brettschichtholz“ (EN 14080:2013, Tab. 4/5).
// ---------------------------------------------------------------------------------------------

export interface HolzKennwerte {
  /** charakteristische Festigkeiten [N/mm²] */
  fmk: number; ft0k: number; ft90k: number; fc0k: number; fc90k: number; fvk: number;
  /** Steifigkeiten [N/mm²] */
  E0mean: number; E005: number; Gmean: number;
  /** Rohdichten [kg/m³] */
  rhok: number; rhoMean: number;
}

export type VollholzKlasse = 'C16' | 'C24' | 'C30' | 'D30' | 'D40';

/** Vollholz nach DIN EN 338:2016-07 (C: Nadelholz und Pappel, D: Laubholz) */
export const HOLZ_EN338: Readonly<Record<VollholzKlasse, HolzKennwerte>> = {
  C16: { fmk: 16, ft0k: 8.5, ft90k: 0.4, fc0k: 17, fc90k: 2.2, fvk: 3.2, E0mean: 8000, E005: 5400, Gmean: 500, rhok: 310, rhoMean: 370 },
  C24: { fmk: 24, ft0k: 14.5, ft90k: 0.4, fc0k: 21, fc90k: 2.5, fvk: 4.0, E0mean: 11000, E005: 7400, Gmean: 690, rhok: 350, rhoMean: 420 },
  C30: { fmk: 30, ft0k: 19, ft90k: 0.4, fc0k: 24, fc90k: 2.7, fvk: 4.0, E0mean: 12000, E005: 8000, Gmean: 750, rhok: 380, rhoMean: 460 },
  D30: { fmk: 30, ft0k: 18, ft90k: 0.6, fc0k: 24, fc90k: 5.3, fvk: 3.9, E0mean: 11000, E005: 9200, Gmean: 690, rhok: 530, rhoMean: 640 },
  D40: { fmk: 40, ft0k: 24, ft90k: 0.6, fc0k: 27, fc90k: 5.5, fvk: 4.2, E0mean: 13000, E005: 10900, Gmean: 810, rhok: 550, rhoMean: 660 },
};

export type BshKlasse = 'GL24h' | 'GL28h' | 'GL30h' | 'GL24c' | 'GL28c';

/** Brettschichtholz nach DIN EN 14080:2013-09 (h: homogen, Tab. 5; c: kombiniert, Tab. 4); f_t,90 = 0,5, G = 650 N/mm² */
export const BSH_EN14080: Readonly<Record<BshKlasse, HolzKennwerte>> = {
  GL24h: { fmk: 24, ft0k: 19.2, ft90k: 0.5, fc0k: 24, fc90k: 2.5, fvk: 3.5, E0mean: 11500, E005: 9600, Gmean: 650, rhok: 385, rhoMean: 420 },
  GL28h: { fmk: 28, ft0k: 22.3, ft90k: 0.5, fc0k: 28, fc90k: 2.5, fvk: 3.5, E0mean: 12600, E005: 10500, Gmean: 650, rhok: 425, rhoMean: 460 },
  GL30h: { fmk: 30, ft0k: 24, ft90k: 0.5, fc0k: 30, fc90k: 2.5, fvk: 3.5, E0mean: 13600, E005: 11300, Gmean: 650, rhok: 430, rhoMean: 480 },
  GL24c: { fmk: 24, ft0k: 17, ft90k: 0.5, fc0k: 21.5, fc90k: 2.5, fvk: 3.5, E0mean: 11000, E005: 9100, Gmean: 650, rhok: 365, rhoMean: 400 },
  GL28c: { fmk: 28, ft0k: 19.5, ft90k: 0.5, fc0k: 24, fc90k: 2.5, fvk: 3.5, E0mean: 12500, E005: 10400, Gmean: 650, rhok: 390, rhoMean: 420 },
};

/** Kennwerte einer Holzklasse (Vollholz oder BSH) nach Bezeichnung, z. B. 'C24' oder 'GL28h' */
export function holzKennwerte(klasse: string): HolzKennwerte | undefined {
  return (HOLZ_EN338 as Record<string, HolzKennwerte>)[klasse] ?? (BSH_EN14080 as Record<string, HolzKennwerte>)[klasse];
}
