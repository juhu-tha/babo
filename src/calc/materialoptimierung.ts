/**
 * Rechenkern Materialoptimierung – THG-Vergleich Referenz/optimiertes Bauteil (Z3), übernommen aus
 * src/modules/Materialoptimierung.tsx (DAfStb-Richtlinie, Lehrbeispiel):
 *  - Mengen je Bauteil und Bauweise (Beton in m³, Betonstahl in kg) wie im Modul
 *  - Beton: GWP = 320 kg/m³ · GWP_Zement + 45 kg/m³ (Lehrbeton C30/37, Rest einheitlich seit 30.10.2026), Referenz CEM I = 258,
 *    optimiert nach Zementart, bei Prüfalter 56 d ×0,91 (gerundet)
 *  - Betonstahl: Referenz ÖKOBAUDAT „Bewehrungsstahl (de)“ 0,64 kg CO₂e/kg (überwiegend Elektrostahl); wählbar
 *    Hochofen-Route (BOF) 0,98 und Elektrostahl mit Grünstrom 0,42 (Lehrwerte)
 *  - Umsetzung 29.10.2026 (T11-MO-3): Lehrwerte vereinheitlicht (vorher Referenz 310 kg/m³ und BOF-Stahl)
 *  - Umsetzung 29.10.2026 (T15-NH-3): Zement-GWP aus der gemeinsamen Konstante src/data/zementGwp.ts (CEM I 0,665 statt 0,80)
 *  - Summen jeweils gerundet; Minderung ΔGWP = max(0; Ref − Opt), Δ% = max(0; (Ref − Opt)/Ref·100)
 *  - Klasse: ≥ 50 % A+, ≥ 40 % A, ≥ 25 % B, ≥ 10 % C, sonst Referenz (Lehreinteilung)
 * Einheiten: kg CO₂e; spezifisch je Bezugsgröße (m² bzw. m). Reiner Rechenkern – geprüft in tests/materialoptimierung.test.ts.
 */
import { type Hinweis, hatFehler, nurGueltig } from './plausibilitaet';
import { ZEMENT_GWP_KG } from '../data/zementGwp';
import { GWP_LEHRWERTE, LEHRBETON_C3037 } from '../data/gwpLehrwerte';

export type DafstbBauteil = 'decke' | 'stuetze' | 'wand' | 'bodenplatte';
export type DafstbZement = 'cem1' | 'cem2_all' | 'cem2_bs' | 'cem3_a' | 'cem2_cm';

/** Zementgehalt des Lehrbetons (C30/37) in kg/m³ und pauschaler Anteil aus Gesteinskörnung, Wasser, Zusatzmitteln, Werkstransport */
export const ZEMENTGEHALT_LEHR = LEHRBETON_C3037.zement;
export const REST_GWP_LEHR = LEHRBETON_C3037.rest;
/**
 * GWP A1–A3 je kg Zement [kg CO₂e/kg] aus src/data/zementGwp.ts (T15-NH-3): CEM I 0,665 und CEM II/C-M 0,40 nach
 * VDZ-Branchen-EPD (netto); CEM II/A-LL 0,60 (mit 300 kg Zement und Rest 45: 225 kg/m³ ≈ ÖKOBAUDAT 2024-I „Transportbeton C25/30“, 221,7 kg/m³),
 * CEM II/B-S 0,53 und CEM III/A 0,40 Lehrwerte (vorläufig, F-Freigabe). Projektbezogen gelten EPD des Betonwerks bzw. ÖKOBAUDAT.
 */
export const ZEMENT_GWP_JE_KG: Readonly<Record<DafstbZement, number>> = {
  cem1: ZEMENT_GWP_KG['CEM I'], cem2_all: ZEMENT_GWP_KG['CEM II/A'], cem2_bs: ZEMENT_GWP_KG['CEM II/B'], cem3_a: ZEMENT_GWP_KG['CEM III/A'], cem2_cm: ZEMENT_GWP_KG['CEM II/C-M'],
};
/** GWP A1–A3 des Lehrbetons je m³ nach Zementart [kg CO₂e/m³] = round(320 · GWP_Zement + 45): 258 / 237 / 215 / 173 / 173 */
export const ZEMENT_GWP: Readonly<Record<DafstbZement, number>> = Object.fromEntries(
  (Object.keys(ZEMENT_GWP_JE_KG) as DafstbZement[]).map(z => [z, Math.round(ZEMENTGEHALT_LEHR * ZEMENT_GWP_JE_KG[z] + REST_GWP_LEHR)]),
) as Record<DafstbZement, number>;
export type DafstbStahlRoute = 'eaf_de' | 'standard_bof' | 'gruen_eaf';
/**
 * Betonstahl [kg CO₂e/kg]: eaf_de = ÖKOBAUDAT 2023 „Bewehrungsstahl (de)“ 0,642 (Referenz, in Deutschland überwiegend
 * Elektrostahl); standard_bof = Hochofen-/Oxygenstahl-Route, Lehrwert 0,98 (vorläufig, F-Freigabe: EPD bzw. ÖKOBAUDAT-Datensatz);
 * gruen_eaf = Elektrostahl mit Grünstrom, Lehrwert 0,42 (EPD des Herstellers maßgebend)
 */
export const STAHL_GWP: Readonly<Record<DafstbStahlRoute, number>> = { eaf_de: GWP_LEHRWERTE.betonstahl.gwp / 1000, standard_bof: 0.98, gruen_eaf: 0.42 };
/** LEHRWERT Abschlag auf das Beton-GWP bei Prüfalter 56 d (Zementreduktion durch Nacherhärtung) */
export const ABSCHLAG_56D = 0.91;

interface Menge { betonM3: number; stahlKg: number }
interface BauteilDaten { label: string; bezug: number; einheit: string; referenz: Menge; varianten: Readonly<Record<string, Menge>> }

export const DAFSTB_BAUTEILE: Readonly<Record<DafstbBauteil, BauteilDaten>> = {
  decke: { label: 'Geschossdecke (100 m² Fläche)', bezug: 100, einheit: 'm² Decke', referenz: { betonM3: 26.0, stahlKg: 2860 },
    varianten: { massiv: { betonM3: 24.0, stahlKg: 2520 }, hohlkoerper: { betonM3: 19.5, stahlKg: 2470 }, vorgespannt: { betonM3: 20.0, stahlKg: 1400 } } },
  stuetze: { label: 'Innenstützen (4 Stützen à 3,50 m = 14 m Gesamtlänge)', bezug: 14, einheit: 'm Stütze', referenz: { betonM3: 2.835, stahlKg: 397 },
    varianten: { hochfest_c50_schlank: { betonM3: 1.26, stahlKg: 202 } } },
  wand: { label: 'Tragwand / Kernwand (60 m² Ansichtsfläche)', bezug: 60, einheit: 'm² Wand', referenz: { betonM3: 14.4, stahlKg: 1152 },
    varianten: { optimiert_18: { betonM3: 10.8, stahlKg: 864 } } },
  bodenplatte: { label: 'Fundamentplatte / Bodenplatte (120 m² Grundfläche)', bezug: 120, einheit: 'm² Platte', referenz: { betonM3: 42.0, stahlKg: 3780 },
    varianten: { optimiert_28: { betonM3: 33.6, stahlKg: 2856 } } },
};

export interface DafstbEingabe {
  bauteil: DafstbBauteil;
  /** Bauweise; unbekannte Varianten = Referenzmengen (Decke: unbekannt = Referenz 26 m³/2860 kg) */
  bauweise: string;
  zement: DafstbZement;
  pruefalter: 28 | 56;
  stahlRoute: DafstbStahlRoute;
}

export interface DafstbErgebnis {
  label: string; areaUnit: string; refArea: number;
  refBetonVol: number; refStahlKg: number; optBetonVol: number; optStahlKg: number;
  optConcreteGwpPerM3: number;
  refConcreteGwpTotal: number; refSteelGwpTotal: number; refTotalGwp: number; refSpecificGwp: number;
  optConcreteGwpTotal: number; optSteelGwpTotal: number; optTotalGwp: number; optSpecificGwp: number;
  diffAbs: number; diffPct: number;
  efficiencyClass: 'Referenz' | 'Klasse C' | 'Klasse B' | 'Klasse A' | 'Klasse A+';
  gueltig: boolean;
  hinweise: Hinweis[];
}

export function effizienzKlasseThg(diffPct: number): DafstbErgebnis['efficiencyClass'] {
  if (diffPct >= 50) return 'Klasse A+';
  if (diffPct >= 40) return 'Klasse A';
  if (diffPct >= 25) return 'Klasse B';
  if (diffPct >= 10) return 'Klasse C';
  return 'Referenz';
}

export function dafstbVergleich(e: DafstbEingabe): DafstbErgebnis {
  const hinweise: Hinweis[] = [];
  const b = DAFSTB_BAUTEILE[e.bauteil];
  const opt = b.varianten[e.bauweise] ?? b.referenz;
  if (!(e.bauweise in b.varianten)) hinweise.push({ stufe: 'warnung', feld: 'bauweise', text: 'Bauweise für dieses Bauteil nicht hinterlegt: Es werden die Referenzmengen angesetzt.' });
  const optConcreteGwpPerM3 = Math.round(ZEMENT_GWP[e.zement] * (e.pruefalter === 56 ? ABSCHLAG_56D : 1.0));
  const refSteel = STAHL_GWP.eaf_de;
  const optSteel = STAHL_GWP[e.stahlRoute];
  hinweise.push({ stufe: 'warnung', feld: 'gwp', text: 'Lehrwerte: GWP-Faktoren für Beton (je Zementart, Lehrbeton mit 320 kg Zement), Betonstahl (Referenz ÖKOBAUDAT-Mittel Deutschland) und den 56-Tage-Abschlag sind gerundete Lehrannahmen, keine Projektwerte; Mengen und Klassengrenzen sind Lehrbeispiele.' });
  const refConcreteGwpTotal = Math.round(b.referenz.betonM3 * ZEMENT_GWP.cem1);
  const refSteelGwpTotal = Math.round(b.referenz.stahlKg * refSteel);
  const refTotalGwp = refConcreteGwpTotal + refSteelGwpTotal;
  const optConcreteGwpTotal = Math.round(opt.betonM3 * optConcreteGwpPerM3);
  const optSteelGwpTotal = Math.round(opt.stahlKg * optSteel);
  const optTotalGwp = optConcreteGwpTotal + optSteelGwpTotal;
  const diffAbs = Math.max(0, refTotalGwp - optTotalGwp);
  const diffPct = Math.max(0, ((refTotalGwp - optTotalGwp) / refTotalGwp) * 100);
  if (e.pruefalter === 56 && e.zement === 'cem1') hinweise.push({ stufe: 'warnung', feld: 'pruefalter', text: 'Der Abschlag für 56 Tage Prüfalter ist bei CEM I kaum begründbar (geringe Nacherhärtung).' });
  return nurGueltig({
    label: b.label, areaUnit: b.einheit, refArea: b.bezug,
    refBetonVol: b.referenz.betonM3, refStahlKg: b.referenz.stahlKg, optBetonVol: opt.betonM3, optStahlKg: opt.stahlKg,
    optConcreteGwpPerM3, refConcreteGwpTotal, refSteelGwpTotal, refTotalGwp, refSpecificGwp: refTotalGwp / b.bezug,
    optConcreteGwpTotal, optSteelGwpTotal, optTotalGwp, optSpecificGwp: optTotalGwp / b.bezug,
    diffAbs, diffPct, efficiencyClass: effizienzKlasseThg(diffPct), gueltig: !hatFehler(hinweise), hinweise,
  });
}
