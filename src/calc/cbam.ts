/**
 * CBAM-Kosten mit Anpassung an die kostenlose Zuteilung im EU-ETS (Runde 28.10.: Jahresschalter 2026–2034).
 * Lehr- und Vorbemessungswerkzeug, keine Rechts- oder Steuerberatung.
 *
 *  - Zertifikate je Tonne Ware: e_pfl = max(0; e − CBAM_j · CSCF · BM)   (VO (EU) 2023/956 Art. 31; Durchführungs-VO
 *    (EU) 2025/2620, Anhang Nr. 2 und 4: FAA_g = SEFA_g,y · M_g mit SEFA = CBAM_y · CSCF_y · BM_g bei Standardwerten)
 *  - CBAM-Faktor CBAM_j nach Art. 10a Abs. 1a RL 2003/87/EG (Anteil der noch kostenlosen Zuteilung):
 *    2026 97,5 %, 2027 95 %, 2028 90 %, 2029 77,5 %, 2030 51,5 %, 2031 39 %, 2032 26,5 %, 2033 14 %, ab 2034 0 %
 *  - Kosten K = M · e_pfl · P_CBAM − Anrechnung des im Ursprungsland gezahlten CO₂-Preises (Art. 9), nicht negativ.
 *    Lehrvereinfachung: Anrechnung M · e · P_Herkunft auf die gesamten eingebetteten Emissionen – vorläufig, F-Freigabe
 *    (Einzelheiten regeln Durchführungsrechtsakte zu Art. 9).
 *  - Benchmark BM für grauen Zementklinker und grauen Portlandzement (KN 2523 10 00, 2523 29 00) 0,666 t CO₂e/t,
 *    weißer Zement 0,859 t CO₂e/t (Durchführungs-VO (EU) 2025/2620, Anhang Nr. 5.3, Spalte B).
 * Einheiten: Masse in t, Emissionen in t CO₂e/t, Preise in €/t CO₂e. Geprüft in tests/cbam.test.ts.
 */
import { type Hinweis, istEndlich, hatFehler, muss, nurGueltig } from './plausibilitaet';

export const CBAM_JAHRE = [2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034] as const;
export type CbamJahr = (typeof CBAM_JAHRE)[number];

/** CBAM-Faktor (Anteil der kostenlosen Zuteilung) nach Art. 10a Abs. 1a RL 2003/87/EG */
export const CBAM_FAKTOR: Readonly<Record<CbamJahr, number>> = {
  2026: 0.975, 2027: 0.95, 2028: 0.90, 2029: 0.775, 2030: 0.515, 2031: 0.39, 2032: 0.265, 2033: 0.14, 2034: 0,
};

/** Benchmarks in t CO₂e je t Ware (DVO (EU) 2025/2620, Anhang Nr. 5.3, Spalte B – Standardwerte) */
export const CBAM_BENCHMARK = { zementGrau: 0.666, klinkerGrau: 0.666, zementWeiss: 0.859 } as const;
export type CbamWare = keyof typeof CBAM_BENCHMARK;

export interface CbamEingabe {
  jahr: CbamJahr;
  /** eingeführte Menge in t */
  mengeT: number;
  /** spezifische eingebettete Emissionen in t CO₂e/t */
  emissionen: number;
  /** Benchmark in t CO₂e/t */
  benchmark: number;
  /** CBAM-Zertifikatspreis (an EU-ETS gekoppelt) in €/t CO₂e */
  preisCbam: number;
  /** im Ursprungsland tatsächlich gezahlter CO₂-Preis in €/t CO₂e */
  preisHerkunft?: number;
  /** sektorübergreifender Korrekturfaktor CSCF (Standard 1) */
  cscf?: number;
}
export interface CbamErgebnis {
  faktor: number;
  /** Anpassung an die kostenlose Zuteilung je t (SEFA) und abgabepflichtige Emissionen je t in t CO₂e/t */
  sefa: number;
  pflichtigJeT: number;
  /** Zertifikate gesamt, Bruttokosten, Anrechnung Herkunftsland und Kosten in € */
  zertifikate: number;
  brutto: number;
  anrechnung: number;
  kosten: number;
  /** Kosten je t Ware in €/t und Anteil an den Kosten ohne kostenlose Zuteilung (Endzustand 2034) */
  kostenJeT: number;
  anteilEndzustand: number;
  gueltig: boolean;
  hinweise: Hinweis[];
}

export function cbamKosten(e: CbamEingabe): CbamErgebnis {
  const h: Hinweis[] = [];
  const pH = e.preisHerkunft ?? 0, cscf = e.cscf ?? 1;
  muss(h, e.jahr in CBAM_FAKTOR, 'jahr', 'Das Jahr muss zwischen 2026 und 2034 liegen.');
  muss(h, istEndlich(e.mengeT, e.emissionen, e.benchmark, e.preisCbam, pH, cscf) && e.mengeT >= 0 && e.emissionen >= 0 && e.benchmark >= 0 && e.preisCbam >= 0 && pH >= 0 && cscf > 0 && cscf <= 1,
    'eingabe', 'Menge, Emissionen, Benchmark und Preise müssen ≥ 0 sein, CSCF zwischen 0 und 1.');
  const faktor = CBAM_FAKTOR[e.jahr] ?? 0;
  const sefa = faktor * cscf * e.benchmark;
  const pflichtigJeT = Math.max(0, e.emissionen - sefa);
  const zertifikate = e.mengeT * pflichtigJeT;
  const brutto = zertifikate * e.preisCbam;
  const anrechnung = Math.min(brutto, e.mengeT * e.emissionen * pH);
  const kosten = brutto - anrechnung;
  const endzustand = Math.max(0, e.mengeT * e.emissionen * (e.preisCbam - pH));
  if (e.emissionen > 0 && e.emissionen < sefa) h.push({ stufe: 'warnung', feld: 'emissionen', text: 'Die eingebetteten Emissionen liegen unter der Anpassung an die kostenlose Zuteilung; es sind keine Zertifikate abzugeben.' });
  if (pH > e.preisCbam) h.push({ stufe: 'warnung', feld: 'preisHerkunft', text: 'Der Herkunftspreis übersteigt den CBAM-Preis; angerechnet wird höchstens bis zu Kosten null.' });
  h.push({ stufe: 'warnung', feld: 'cbam', text: 'Lehrmodell: Anrechnung des Herkunftspreises auf die gesamten eingebetteten Emissionen (Art. 9 vereinfacht, vorläufig); Standardwert-Aufschläge, Schwellenwert 50 t je Jahr (VO (EU) 2025/2083) und Quartals- bzw. Wochenpreise nicht abgebildet.' });
  return nurGueltig({
    faktor, sefa, pflichtigJeT, zertifikate, brutto, anrechnung, kosten,
    kostenJeT: e.mengeT > 0 ? kosten / e.mengeT : 0,
    anteilEndzustand: endzustand > 0 ? kosten / endzustand : 0,
    gueltig: !hatFehler(h), hinweise: h,
  });
}

/** Jahrespfad 2026–2034 bei sonst gleichen Eingaben */
export function cbamJahrespfad(e: Omit<CbamEingabe, 'jahr'>): { jahr: CbamJahr; faktor: number; kosten: number; kostenJeT: number }[] {
  return CBAM_JAHRE.map(jahr => { const r = cbamKosten({ ...e, jahr }); return { jahr, faktor: r.faktor, kosten: r.kosten, kostenJeT: r.kostenJeT }; });
}
