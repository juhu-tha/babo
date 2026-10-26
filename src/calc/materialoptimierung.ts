/**
 * Rechenkern Materialoptimierung – THG-Vergleich Referenz/optimiertes Bauteil (Z3), übernommen aus
 * src/modules/Materialoptimierung.tsx (DAfStb-Richtlinie, Lehrbeispiel):
 *  - Mengen je Bauteil und Bauweise (Beton in m³, Betonstahl in kg) wie im Modul
 *  - Beton: Referenz 310 kg CO₂e/m³ (CEM I), optimiert nach Zementart, bei Prüfalter 56 d ×0,91 (gerundet)
 *  - Betonstahl: 0,98 kg CO₂e/kg (Hochofen-Route), grüne Elektrostahl-Route 0,42
 *  - Summen jeweils gerundet; Minderung ΔGWP = max(0; Ref − Opt), Δ% = max(0; (Ref − Opt)/Ref·100)
 *  - Klasse: ≥ 50 % A+, ≥ 40 % A, ≥ 25 % B, ≥ 10 % C, sonst Referenz (Lehreinteilung)
 * Einheiten: kg CO₂e; spezifisch je Bezugsgröße (m² bzw. m). Reiner Rechenkern – geprüft in tests/materialoptimierung.test.ts.
 */
import { type Hinweis, hatFehler } from './plausibilitaet';

export type DafstbBauteil = 'decke' | 'stuetze' | 'wand' | 'bodenplatte';
export type DafstbZement = 'cem1' | 'cem2_all' | 'cem2_bs' | 'cem3_a' | 'cem2_cm';

export const ZEMENT_GWP: Readonly<Record<DafstbZement, number>> = { cem1: 310, cem2_all: 250, cem2_bs: 190, cem3_a: 135, cem2_cm: 105 };

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
  stahlRoute: 'standard_bof' | 'gruen_eaf';
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
  const optConcreteGwpPerM3 = Math.round(ZEMENT_GWP[e.zement] * (e.pruefalter === 56 ? 0.91 : 1.0));
  const refSteel = 0.98;
  const optSteel = e.stahlRoute === 'gruen_eaf' ? 0.42 : 0.98;
  const refConcreteGwpTotal = Math.round(b.referenz.betonM3 * 310);
  const refSteelGwpTotal = Math.round(b.referenz.stahlKg * refSteel);
  const refTotalGwp = refConcreteGwpTotal + refSteelGwpTotal;
  const optConcreteGwpTotal = Math.round(opt.betonM3 * optConcreteGwpPerM3);
  const optSteelGwpTotal = Math.round(opt.stahlKg * optSteel);
  const optTotalGwp = optConcreteGwpTotal + optSteelGwpTotal;
  const diffAbs = Math.max(0, refTotalGwp - optTotalGwp);
  const diffPct = Math.max(0, ((refTotalGwp - optTotalGwp) / refTotalGwp) * 100);
  if (e.pruefalter === 56 && e.zement === 'cem1') hinweise.push({ stufe: 'warnung', feld: 'pruefalter', text: 'Der Abschlag für 56 Tage Prüfalter ist bei CEM I kaum begründbar (geringe Nacherhärtung).' });
  return {
    label: b.label, areaUnit: b.einheit, refArea: b.bezug,
    refBetonVol: b.referenz.betonM3, refStahlKg: b.referenz.stahlKg, optBetonVol: opt.betonM3, optStahlKg: opt.stahlKg,
    optConcreteGwpPerM3, refConcreteGwpTotal, refSteelGwpTotal, refTotalGwp, refSpecificGwp: refTotalGwp / b.bezug,
    optConcreteGwpTotal, optSteelGwpTotal, optTotalGwp, optSpecificGwp: optTotalGwp / b.bezug,
    diffAbs, diffPct, efficiencyClass: effizienzKlasseThg(diffPct), gueltig: !hatFehler(hinweise), hinweise,
  };
}
