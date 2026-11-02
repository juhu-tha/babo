/**
 * Rechenkern Zwangspannungen (Lehrmodell), übernommen aus src/modules/Zwang.tsx (Modulprüfung Tranche 16, 02.11.2026).
 *
 * Verhinderte freie Verkürzung aus Abkühlen und Schwinden:
 *   ε_frei = α_T·ΔT + ε_cs,   σ_z = ε_frei · E · R
 * mit α_T = 10·10⁻⁶ 1/K (DIN EN 1992-1-1, 3.1.3(5)), E als wirksamer E-Modul (z. B. E_cm/(1 + φ)) und dem
 * Festhaltungsgrad R (0 … 1). Rissbildung, wenn σ_z ≥ f_ct. Keine Rissbreite, keine Mindestbewehrung.
 *
 * Einheiten: ΔT in K (Abkühlung positiv), ε_cs in ‰ (Verkürzung positiv), E und f_ct in N/mm², R in %.
 * Reiner Rechenkern – geprüft in tests/tranche16.test.ts.
 */
import { type Hinweis, istEndlich, hatFehler, muss } from './plausibilitaet';

/** Wärmedehnzahl von Beton α_T = 10·10⁻⁶ 1/K (DIN EN 1992-1-1, 3.1.3(5)) */
export const ALPHA_T_BETON = 1e-5;

export interface ZwangEingabe {
  /** Temperaturabfall ΔT in K (Abkühlung positiv) */
  deltaT: number;
  /** freies Schwindmaß ε_cs in ‰ (Verkürzung positiv) */
  epsCsPromille: number;
  /** wirksamer E-Modul in N/mm² */
  eModul: number;
  /** Festhaltungsgrad R in % (0 = frei, 100 = voll behindert) */
  festhaltungProzent: number;
  /** wirksame Zugfestigkeit f_ct in N/mm² */
  fct: number;
}

export interface ZwangErgebnis {
  /** Dehnungen dimensionslos */
  epsT: number; epsS: number; epsFrei: number;
  /** Zwangspannung σ_z in N/mm² (Zug positiv) */
  sigma: number;
  gerissen: boolean;
  /** Spannung über dem Festhaltungsgrad 0, 10, … 100 % (Diagramm) */
  verlauf: { festhaltungProzent: number; sigma: number }[];
  gueltig: boolean;
  hinweise: Hinweis[];
}

export function zwangSpannung(e: ZwangEingabe): ZwangErgebnis {
  const hinweise: Hinweis[] = [];
  const { deltaT, epsCsPromille, eModul, festhaltungProzent, fct } = e;
  muss(hinweise, istEndlich(deltaT, epsCsPromille, eModul, festhaltungProzent, fct), 'eingabe', 'Alle Eingaben müssen endliche Zahlen sein.');
  muss(hinweise, eModul > 0, 'eModul', 'Der E-Modul muss größer als 0 sein.');
  muss(hinweise, fct > 0, 'fct', 'Die Zugfestigkeit muss größer als 0 sein.');
  muss(hinweise, festhaltungProzent >= 0 && festhaltungProzent <= 100, 'festhaltung', 'Der Festhaltungsgrad muss zwischen 0 und 100 % liegen.');
  if (deltaT < 0 || epsCsPromille < 0) hinweise.push({ stufe: 'warnung', feld: 'deltaT', text: 'Erwärmung bzw. Quellen (negative Werte) erzeugen bei Behinderung Druck- statt Zugspannungen; das Lehrmodell bewertet nur Zug.' });

  const epsT = ALPHA_T_BETON * deltaT;
  const epsS = epsCsPromille / 1000;
  const epsFrei = epsT + epsS;
  const spannungBei = (rProzent: number) => epsFrei * eModul * (rProzent / 100);
  const sigma = spannungBei(festhaltungProzent);
  const verlauf = Array.from({ length: 11 }, (_, i) => ({ festhaltungProzent: i * 10, sigma: spannungBei(i * 10) }));
  return { epsT, epsS, epsFrei, sigma, gerissen: sigma >= fct, verlauf, gueltig: !hatFehler(hinweise), hinweise };
}
