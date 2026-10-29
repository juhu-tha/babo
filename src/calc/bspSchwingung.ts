/**
 * Schwingung einer Brettsperrholz-Decke (BSP/CLT) als Einfeldträger, zweiseitig gelenkig gelagert
 * (Umsetzungsplan Phase 4, AP 4.6). Reiner Rechenkern – geprüft in tests/bspSchwingung.test.ts.
 *
 * - Biegesteifigkeit nur aus den Lagen in Spannrichtung (Längslagen, Steiner-Anteile), wahlweise
 *   „netto“ (starrer Verbund, schubstarr) oder nach dem γ-Verfahren (DIN EN 1995-1-1 Anhang B,
 *   Querlagen als nachgiebige Verbindung mit dem Rollschubmodul G_R).
 * - Eigenfrequenz f₁ = π/(2·ℓ²)·√((EI)_ℓ/m) (DIN EN 1995-1-1, Gl. 7.5).
 * - Steifigkeitskriterium: Durchbiegung w unter F = 1 kN in Feldmitte auf der mitwirkenden Breite
 *   b_F = ℓ/1,1 · ⁴√((EI)_b/(EI)_ℓ) (Hamm/Richter 2009, Wiedergabe in proHolz Austria,
 *   Bemessung Brettsperrholz Band II, 2018, Beispiel 4.1).
 * Lehr- und Vorbemessungswerkzeug: Ergebnisse werden mit Orientierungswerten verglichen,
 * eine Deckenklasse wird nicht bestätigt.
 * Abgleich 27.10.2026: Kennwerte und Orientierungswerte wörtlich in proHolz Austria, „Brettsperrholz Bemessung Band II –
 * Anwendungsfälle“, 1. Aufl. 01/2018 (Tab. 3-1, 3-2; Gl. 4.1/4.2, S. 17; f₁,min = 4,5 Hz, S. 18; Beispiel 4.1, S. 19–23).
 * Die eigenen Grenzwerte der DIN EN 1995-1-1/NA:2013-08 (NCI zu 7.3.3) sind öffentlich nicht im Wortlaut zugänglich und
 * daher nicht abgebildet (vorläufig, F-Freigabe); der Anwendungsgrenzwert 8 Hz der EN 1995-1-1, 7.3.3(1), ist belegt
 * (Dlubal, Wissensdatenbank KB 000694, 29.03.2021).
 */
import { type Hinweis, bereich, hatFehler, istEndlich, muss } from './plausibilitaet';

/** Materialkennwerte BSP nach proHolz Austria, Bemessung Brettsperrholz Band II (2018): E_0,mean und G_r,mean Tab. 3-2 (S. 12), Wichte Tab. 3-1 (S. 11) */
export const BSP_KENNWERTE = {
  /** E_0,mean [N/mm²] */
  E0mean: 11550,
  /** Rollschubmodul G_r,mean [N/mm²] */
  GRmean: 65,
  /** Wichte für Lastannahmen [kN/m³] */
  wichte: 5.5,
} as const;

/**
 * Rollschubmodul wählbar (T10-HB-2, Umsetzung 29.10.2026): 50 N/mm² wie in vielen ETAs und der Neuausgabe von EC 5
 * (Standard), 65 N/mm² nach proHolz Austria (2018).
 */
export const BSP_ROLLSCHUB = { standard: 50, proHolz: BSP_KENNWERTE.GRmean } as const;

/** E-Moduln von Estrichen [N/mm²] nach Hamm, KI-Journal 01/2016, S. 41 (Lehrwerte) */
export const ESTRICH_E = { zement: 25000, anhydrit: 14000, gussasphalt: 10000 } as const;
export type Estrichart = keyof typeof ESTRICH_E;

/** Orientierungswerte nach Hamm/Richter (2009), ÖNORM B 1995-1-1:2015 – Wiedergabe proHolz Band II, Gl. 4.1/4.2 (S. 17) und S. 18 (4,5 Hz) */
export const ORIENTIERUNG = {
  /** Anwendungsgrenze DIN EN 1995-1-1, 7.3.3, und Frequenzwert Deckenklasse I [Hz] */
  f1KlasseI: 8,
  /** Frequenzwert Deckenklasse II [Hz] */
  f1KlasseII: 6,
  /** Mindestfrequenz (darunter gesonderte Untersuchung) [Hz] */
  f1Min: 4.5,
  /** w unter 1 kN, Deckenklasse I [mm] */
  wKlasseI: 0.25,
  /** w unter 1 kN, Deckenklasse II [mm] */
  wKlasseII: 0.5,
} as const;

export type EiVerfahren = 'netto' | 'gamma';

export interface BspSchwingungEingabe {
  /** Spannweite ℓ [m] */
  spannweite: number;
  /** Lagendicken [mm] von oben nach unten; Lage 1 in Spannrichtung, danach abwechselnd quer/längs (ungerade Anzahl) */
  lagen: readonly number[];
  /** Deckenbreite b_D quer zur Spannrichtung [m] (begrenzt b_F) */
  deckenbreite: number;
  /** Zusätzliche ständige Masse (Estrich, Schüttung, Belag) [kg/m²] */
  zusatzmasse: number;
  /** Estrich mit Biegesteifigkeit ansetzen; Dicke 0 = nicht ansetzen */
  estrichDicke: number; // [mm]
  estrichArt: Estrichart;
  verfahren: EiVerfahren;
  /** optional abweichende Kennwerte */
  E0mean?: number;  // [N/mm²]
  GR?: number;      // [N/mm²]
  wichte?: number;  // [kN/m³]
}

export interface BspSchwingungErgebnis {
  dicke: number;          // Gesamtdicke BSP [mm]
  eigenmasse: number;     // m_BSP [kg/m²]
  masse: number;          // m gesamt [kg/m²]
  EI_l_netto: number;     // [Nm²/m], nur Längslagen, starrer Verbund
  EI_l_gamma: number | null; // [Nm²/m], γ-Verfahren (null, wenn nicht anwendbar)
  gamma_aussen: number | null;
  EI_b: number;           // [Nm²/m], Querlagen (netto)
  EI_estrich: number;     // [Nm²/m]
  EI_l: number;           // angesetzt in Spannrichtung inkl. Estrich [Nm²/m]
  EI_b_ges: number;       // quer inkl. Estrich [Nm²/m]
  verfahrenAngesetzt: EiVerfahren;
  f1: number;             // [Hz]
  b_F: number;            // [m]
  b_ef: number;           // min(b_F, b_D) [m]
  w1kN: number;           // [mm]
  /** neutrale Einordnung gegenüber den Orientierungswerten */
  f1UeberAnwendungsgrenze: boolean;
  wUnterOrientierungI: boolean;
  wUnterOrientierungII: boolean;
  hinweise: Hinweis[];
}

const G = 9.81;

/** Flächenträgheitsmoment je m Breite [m⁴/m] der Lagen mit Index-Parität `paritaet` (0 = längs, 1 = quer) um ihren gemeinsamen Schwerpunkt */
function steinerNetto(lagen: readonly number[], paritaet: 0 | 1): number {
  let z = 0;
  const teile: { t: number; z: number }[] = [];
  lagen.forEach((tmm, i) => {
    const t = tmm / 1000;
    if (i % 2 === paritaet) teile.push({ t, z: z + t / 2 });
    z += t;
  });
  const A = teile.reduce((s, p) => s + p.t, 0);
  const zs = teile.reduce((s, p) => s + p.t * p.z, 0) / A;
  return teile.reduce((s, p) => s + p.t ** 3 / 12 + p.t * (p.z - zs) ** 2, 0);
}

const istSymmetrisch = (l: readonly number[]) => l.every((t, i) => t === l[l.length - 1 - i]);

export function bspSchwingung(e: BspSchwingungEingabe): BspSchwingungErgebnis {
  const hinweise: Hinweis[] = [];
  const E0 = e.E0mean ?? BSP_KENNWERTE.E0mean;
  const GR = e.GR ?? BSP_ROLLSCHUB.standard;
  const wichte = e.wichte ?? BSP_KENNWERTE.wichte;
  const lagen = Array.isArray(e.lagen) ? e.lagen : [];

  muss(hinweise, istEndlich(e.spannweite, e.deckenbreite, e.zusatzmasse, e.estrichDicke, E0, GR, wichte, ...lagen), 'eingabe', 'Alle Eingaben müssen Zahlen sein.');
  if (!hatFehler(hinweise)) {
    muss(hinweise, e.spannweite > 0, 'spannweite', 'Die Spannweite muss größer als 0 sein.');
    muss(hinweise, e.deckenbreite > 0, 'deckenbreite', 'Die Deckenbreite muss größer als 0 sein.');
    muss(hinweise, lagen.length >= 3 && lagen.length % 2 === 1, 'lagen', 'Brettsperrholz braucht eine ungerade Lagenzahl ≥ 3 (Decklagen in Spannrichtung).');
    muss(hinweise, lagen.every(t => t > 0), 'lagen', 'Alle Lagendicken müssen größer als 0 sein.');
    muss(hinweise, e.zusatzmasse >= 0, 'zusatzmasse', 'Die Zusatzmasse muss ≥ 0 sein.');
    muss(hinweise, e.estrichDicke >= 0, 'estrichDicke', 'Die Estrichdicke muss ≥ 0 sein (0 = Estrichsteifigkeit nicht ansetzen).');
    muss(hinweise, E0 > 0 && GR > 0 && wichte > 0, 'kennwerte', 'E-Modul, Rollschubmodul und Wichte müssen größer als 0 sein.');
    muss(hinweise, e.estrichArt in ESTRICH_E, 'estrichArt', 'Unbekannte Estrichart.');
  }
  const leer: BspSchwingungErgebnis = {
    dicke: 0, eigenmasse: 0, masse: 0, EI_l_netto: 0, EI_l_gamma: null, gamma_aussen: null, EI_b: 0, EI_estrich: 0, EI_l: 0, EI_b_ges: 0,
    verfahrenAngesetzt: e.verfahren, f1: 0, b_F: 0, b_ef: 0, w1kN: 0,
    f1UeberAnwendungsgrenze: false, wUnterOrientierungI: false, wUnterOrientierungII: false, hinweise,
  };
  if (hatFehler(hinweise)) return leer;

  const l = e.spannweite;
  const dicke = lagen.reduce((s, t) => s + t, 0);
  const eigenmasse = (wichte * 1000 * (dicke / 1000)) / G; // [kg/m²]
  const masse = eigenmasse + e.zusatzmasse;
  const Epa = E0 * 1e6;

  const EI_l_netto = Epa * steinerNetto(lagen, 0);
  const EI_b = Epa * steinerNetto(lagen, 1);

  // γ-Verfahren nach DIN EN 1995-1-1 Anhang B: Querlage zwischen zwei Längslagen als Verbindung mit
  // Steifigkeit K/s = G_R·b/d_q. 5-lagig: mittlere Längslage γ = 1, äußere γ₁ = 1/(1 + π²·E·A₁·d_q/(G_R·b·ℓ²)).
  // 3-lagig (zwei Gurte): für zwei gleiche Gurte ist Anhang B gleichwertig mit γ = 1/(1 + π²·E·A·d_q/(2·G_R·b·ℓ²)) je Gurt.
  let EI_l_gamma: number | null = null;
  let gamma_aussen: number | null = null;
  if (istSymmetrisch(lagen) && (lagen.length === 3 || lagen.length === 5)) {
    const t1 = lagen[0] / 1000, dq = lagen[1] / 1000;
    const A1 = t1; // je m Breite
    const faktor = lagen.length === 3 ? 2 : 1;
    gamma_aussen = 1 / (1 + (Math.PI ** 2 * Epa * A1 * dq) / (faktor * GR * 1e6 * l ** 2));
    const H = dicke / 1000;
    const a1 = H / 2 - t1 / 2; // Abstand Schwerpunkt Decklage – Plattenmitte
    let I = 2 * (t1 ** 3 / 12) + 2 * gamma_aussen * A1 * a1 ** 2;
    if (lagen.length === 5) I += (lagen[2] / 1000) ** 3 / 12; // mittlere Längslage im Schwerpunkt
    EI_l_gamma = Epa * I;
  } else if (e.verfahren === 'gamma') {
    hinweise.push({ stufe: 'warnung', feld: 'verfahren', text: 'Das γ-Verfahren ist hier nur für symmetrische 3- und 5-lagige Platten umgesetzt. Angesetzt ist die Netto-Biegesteifigkeit (schubstarr, obere Abschätzung); für 7 und mehr Lagen das Schubanalogieverfahren (Kreuzinger) oder Herstellerwerte verwenden.' });
  }
  const verfahrenAngesetzt: EiVerfahren = e.verfahren === 'gamma' && EI_l_gamma !== null ? 'gamma' : 'netto';

  const EI_estrich = e.estrichDicke > 0 ? ESTRICH_E[e.estrichArt] * 1e6 * (e.estrichDicke / 1000) ** 3 / 12 : 0;
  const EI_l = (verfahrenAngesetzt === 'gamma' ? (EI_l_gamma as number) : EI_l_netto) + EI_estrich;
  const EI_b_ges = EI_b + EI_estrich;

  const f1 = (Math.PI / (2 * l ** 2)) * Math.sqrt(EI_l / masse);
  const b_F = (l / 1.1) * Math.pow(EI_b_ges / EI_l, 0.25);
  const b_ef = Math.min(b_F, e.deckenbreite);
  const w1kN = ((1000 * l ** 3) / (48 * EI_l * b_ef)) * 1000; // [mm]

  if (b_F > e.deckenbreite) hinweise.push({ stufe: 'warnung', feld: 'deckenbreite', text: 'Die mitwirkende Breite b_F ist größer als die Deckenbreite; angesetzt ist b_D.' });
  bereich(hinweise, 'spannweite', l, 2, 9, 'Spannweite außerhalb von 2 bis 9 m: für Brettsperrholzdecken unüblich, Ergebnis nur als Größenordnung lesen.');
  bereich(hinweise, 'lagen', dicke, 60, 320, 'Plattendicke außerhalb von 60 bis 320 mm: unüblicher Aufbau.');
  if (f1 <= ORIENTIERUNG.f1KlasseI) hinweise.push({ stufe: 'warnung', feld: 'f1', text: 'f₁ ≤ 8 Hz: Das Verfahren nach DIN EN 1995-1-1, 7.3.3, ist nicht anwendbar; eine gesonderte Untersuchung ist nötig.' });
  if (f1 < ORIENTIERUNG.f1Min) hinweise.push({ stufe: 'warnung', feld: 'f1', text: 'f₁ < 4,5 Hz: Resonanz mit der Schrittfrequenz ist möglich; Decke konstruktiv anpassen.' });
  if (EI_estrich > 0) hinweise.push({ stufe: 'warnung', feld: 'estrichDicke', text: 'Estrichsteifigkeit angesetzt: nur zulässig, wenn der Estrich dauerhaft ungerissen und ohne Fugen quer zur Spannrichtung ausgeführt wird (Annahme prüfen).' });

  return {
    dicke, eigenmasse, masse, EI_l_netto, EI_l_gamma, gamma_aussen, EI_b, EI_estrich, EI_l, EI_b_ges, verfahrenAngesetzt,
    f1, b_F, b_ef, w1kN,
    f1UeberAnwendungsgrenze: f1 > ORIENTIERUNG.f1KlasseI,
    wUnterOrientierungI: w1kN <= ORIENTIERUNG.wKlasseI,
    wUnterOrientierungII: w1kN <= ORIENTIERUNG.wKlasseII,
    hinweise,
  };
}

/** Lehr-Beispielaufbauten [mm]; reale Aufbauten sind herstellerabhängig (Zulassung/ETA). */
export const BSP_AUFBAUTEN: Readonly<Record<string, { label: string; lagen: readonly number[] }>> = {
  l3_100: { label: '100 L3s (30-40-30)', lagen: [30, 40, 30] },
  l5_120: { label: '120 L5s (30-15-30-15-30)', lagen: [30, 15, 30, 15, 30] },
  l5_150: { label: '150 L5s (30-30-30-30-30), Beispiel proHolz', lagen: [30, 30, 30, 30, 30] },
  l5_160: { label: '160 L5s (40-20-40-20-40)', lagen: [40, 20, 40, 20, 40] },
  l5_200: { label: '200 L5s (40-40-40-40-40)', lagen: [40, 40, 40, 40, 40] },
  l7_200: { label: '200 L7s (30-20-30-40-30-20-30)', lagen: [30, 20, 30, 40, 30, 20, 30] },
};
