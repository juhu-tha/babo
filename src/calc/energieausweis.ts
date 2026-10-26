/**
 * Rechenkern Energieausweis-Simulator (Z3), übernommen aus src/modules/Energieausweis.tsx (Lehrmodell, kein Nachweis
 * nach DIN V 18599):
 *  - Hüllflächen aus der Bezugsfläche A_N (EFH: Wand 1,2·A_N, Dach 0,6·A_N; MFH: 0,7·A_N bzw. 0,3·A_N; Fenster 0,22·A_N; Boden = Dach)
 *  - H_T = Σ A·U·F_x + A_ges·ΔU_WB (F_x = 0,6 gegen Erdreich), H'_T = H_T/A_ges
 *  - H_V = 0,34·n·V mit V = 2,5 m·A_N
 *  - Verluste Q = H·72 kKh/a/A_N; Gewinne η·(Q_S + 35) mit Q_S = A_F·(140 bzw. 160)/A_N
 *  - Q_h = max(10; round(Q_T + Q_V − η·Q_G)); Q_W = 12,5; Verteilverluste 7 bzw. 14; Hilfsstrom 2,5 (WP) bzw. 3,5
 *  - Endenergie Q_E = round((Q_h + Q_W + Q_d)/η bzw. /JAZ + W_Hilf); Primärenergie mit f_p (Hilfsstrom 1,8)
 *  - CO₂ = round(Q_E·Faktor/1000); Effizienzklasse aus Q_E nach GEG Anlage 10 (A+ ≤ 30 … G ≤ 250, sonst H)
 * Einheiten: Flächen m², U in W/(m²K), H in W/K, Energiekennwerte in kWh/(m²a), CO₂ in kg/(m²a).
 * Reiner Rechenkern – geprüft in tests/energieausweis.test.ts.
 */
import { type Hinweis, hatFehler, muss } from './plausibilitaet';

export type Gebaeudetyp = 'efh' | 'mfh';
export type Huellstandard = 'unsaniert' | 'bestand_teilsaniert' | 'geg_standard' | 'effizienzhaus40';
export type Lueftung = 'fenster' | 'abluft' | 'kwl_wrg';
export type Heizung = 'gas_brennwert' | 'oel_kessel' | 'pellets' | 'wp_luft' | 'wp_sole' | 'fernwaerme';

export const HUELLE: Readonly<Record<Huellstandard, { wand: number; dach: number; fenster: number; wb: number; boden: number }>> = {
  unsaniert: { wand: 1.40, dach: 1.20, fenster: 3.00, wb: 0.10, boden: 0.90 },
  bestand_teilsaniert: { wand: 0.45, dach: 0.30, fenster: 1.60, wb: 0.07, boden: 0.50 },
  geg_standard: { wand: 0.24, dach: 0.18, fenster: 1.10, wb: 0.05, boden: 0.25 },
  effizienzhaus40: { wand: 0.14, dach: 0.11, fenster: 0.75, wb: 0.02, boden: 0.25 },
};
export const LUFTWECHSEL: Readonly<Record<Lueftung, number>> = { fenster: 0.5, abluft: 0.45, kwl_wrg: 0.18 };
export const ERZEUGER: Readonly<Record<Heizung, { eta: number; jaz: number; fp: number; co2: number }>> = {
  gas_brennwert: { eta: 0.96, jaz: 1.0, fp: 1.1, co2: 240 },
  oel_kessel: { eta: 0.84, jaz: 1.0, fp: 1.1, co2: 310 },
  pellets: { eta: 0.88, jaz: 1.0, fp: 0.2, co2: 30 },
  wp_luft: { eta: 1.0, jaz: 3.3, fp: 1.8, co2: 380 },
  wp_sole: { eta: 1.0, jaz: 4.3, fp: 1.8, co2: 380 },
  fernwaerme: { eta: 0.98, jaz: 1.0, fp: 0.4, co2: 120 },
};
/** Klassengrenzen der Endenergie in kWh/(m²a) nach GEG Anlage 10 */
export const EFFIZIENZKLASSEN: readonly (readonly [string, number])[] = [['A+', 30], ['A', 50], ['B', 75], ['C', 100], ['D', 130], ['E', 160], ['F', 200], ['G', 250]];

export function effizienzklasse(qe: number): string {
  return EFFIZIENZKLASSEN.find(([, grenze]) => qe <= grenze)?.[0] ?? 'H';
}

export interface EnergieausweisEingabe {
  typ: Gebaeudetyp;
  /** Bezugsfläche A_N in m² */
  flaeche: number;
  huelle: Huellstandard;
  lueftung: Lueftung;
  heizung: Heizung;
}

export interface EnergieausweisErgebnis {
  h_t: number; h_t_prime: number; h_v: number; n_eff: number; v_netto: number; f_klima_k: number;
  q_t_roh: number; q_v_roh: number; q_solar: number; q_intern: number; eta_ausnutzung: number; q_gewinne_roh: number;
  q_t_jahr: number; q_v_jahr: number; q_gewinne: number;
  q_h: number; q_w: number; q_verlust_netz: number; w_hilfsstrom: number; jaz: number; eta_erzeuger: number; f_p: number;
  q_e: number; q_p: number; co2_emissionen: number; klasse: string; istWP: boolean;
  gueltig: boolean;
  hinweise: Hinweis[];
}

export function energieausweis(e: EnergieausweisEingabe): EnergieausweisErgebnis {
  const hinweise: Hinweis[] = [];
  muss(hinweise, Number.isFinite(e.flaeche) && e.flaeche > 0, 'flaeche', 'Die Bezugsfläche muss größer als 0 sein.');
  const u = HUELLE[e.huelle];
  const a_wand = e.typ === 'efh' ? e.flaeche * 1.2 : e.flaeche * 0.7;
  const a_dach = e.typ === 'efh' ? e.flaeche * 0.6 : e.flaeche * 0.3;
  const a_fenster = e.flaeche * 0.22;
  const a_boden = a_dach;
  const a_huelle_ges = a_wand + a_dach + a_fenster + a_boden;
  const h_t = a_wand * u.wand * 1.0 + a_dach * u.dach * 1.0 + a_fenster * u.fenster * 1.0 + a_boden * u.boden * 0.6 + a_huelle_ges * u.wb;
  const h_t_prime = h_t / a_huelle_ges;
  const v_netto = e.flaeche * 2.5;
  const n_eff = LUFTWECHSEL[e.lueftung];
  const h_v = v_netto * 0.34 * n_eff;
  const f_klima_k = 72;
  const q_t_roh = (h_t * f_klima_k) / e.flaeche;
  const q_v_roh = (h_v * f_klima_k) / e.flaeche;
  const q_solar = (a_fenster * (e.huelle === 'effizienzhaus40' ? 140 : 160)) / e.flaeche;
  const q_intern = 35;
  const eta_ausnutzung = e.huelle === 'effizienzhaus40' ? 0.75 : e.huelle === 'unsaniert' ? 0.98 : 0.88;
  const q_gewinne_roh = eta_ausnutzung * (q_solar + q_intern);
  const q_h = Math.max(10, Math.round(q_t_roh + q_v_roh - q_gewinne_roh));
  const q_w = 12.5;
  const erz = ERZEUGER[e.heizung];
  const istWP = e.heizung.startsWith('wp');
  const q_verlust_netz = e.huelle === 'unsaniert' ? 14 : 7;
  const w_hilfsstrom = istWP ? 2.5 : 3.5;
  const q_e = Math.round((q_h + q_w + q_verlust_netz) / (istWP ? erz.jaz : erz.eta) + w_hilfsstrom);
  const q_p = istWP ? Math.round(q_e * erz.fp) : Math.round(((q_h + q_w + q_verlust_netz) / erz.eta) * erz.fp + w_hilfsstrom * 1.8);
  const co2_emissionen = Math.round((q_e * erz.co2) / 1000);
  const klasse = effizienzklasse(q_e);
  if (q_t_roh + q_v_roh - q_gewinne_roh < 10) hinweise.push({ stufe: 'warnung', feld: 'q_h', text: 'Rechnerischer Heizwärmebedarf unter 10 kWh/(m²a): Das Lehrmodell setzt mindestens 10 an.' });
  hinweise.push({ stufe: 'warnung', feld: 'klasse', text: 'Lehrmodell mit Pauschalflächen und Gradstunden – kein Energieausweis nach GEG/DIN V 18599.' });
  return {
    h_t, h_t_prime, h_v, n_eff, v_netto, f_klima_k, q_t_roh, q_v_roh, q_solar, q_intern, eta_ausnutzung, q_gewinne_roh,
    q_t_jahr: Math.round(q_t_roh), q_v_jahr: Math.round(q_v_roh), q_gewinne: Math.round(q_gewinne_roh),
    q_h, q_w, q_verlust_netz, w_hilfsstrom, jaz: erz.jaz, eta_erzeuger: erz.eta, f_p: erz.fp,
    q_e, q_p, co2_emissionen, klasse, istWP, gueltig: !hatFehler(hinweise), hinweise,
  };
}
