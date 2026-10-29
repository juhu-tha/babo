/**
 * Rechenkern Energieausweis-Simulator (Z3), übernommen aus src/modules/Energieausweis.tsx (Lehrmodell, kein Nachweis
 * nach DIN V 18599):
 *  - Hüllflächen aus der Bezugsfläche A_N (EFH: Wand 1,2·A_N, Dach 0,6·A_N; MFH: 0,7·A_N bzw. 0,3·A_N; Fenster 0,22·A_N; Boden = Dach)
 *  - H_T = Σ A·U·F_x + A_ges·ΔU_WB (F_x = 0,6 gegen Erdreich), H'_T = H_T/A_ges
 *  - H_V = 0,34·n·V mit V = 2,5 m·A_N
 *  - Verluste Q = H·72 kKh/a/A_N; Gewinne η·(Q_S + 35) mit Q_S = A_F·(140 bzw. 160)/A_N
 *  - Q_h = max(10; round(Q_T + Q_V − η·Q_G)); Q_W = 12,5; Verteilverluste 7 bzw. 14; Hilfsstrom 2,5 (WP) bzw. 3,5
 *  - Endenergie Q_E = round((Q_h + Q_W + Q_d)/η bzw. /JAZ + W_Hilf); Primärenergie mit f_p (Hilfsstrom mit f_p Strom)
 *  - CO₂ = round(Q_E·Faktor/1000); Effizienzklasse aus Q_E nach GModG Anlage 10 (vormals GEG) (A+ ≤ 30 … G ≤ 250, sonst H)
 *  - Stichtagsschalter Rechtsstand (Umsetzung 29.10.2026, T11-EA-2/-3):
 *    „bis 31.12.2026“: f_p nach Anlage 4 GEG/GModG (Lesefassung, buzer.de): Gas/Öl 1,1, Holz 0,2, Netzstrom 1,8;
 *      CO₂ nach Anlage 9 (buzer.de): Erdgas 240, Heizöl 310, Holz 20, Netzstrom 560 g/kWh.
 *    „ab 01.01.2027“: f_p nach Anlage 4 GModG 2027 (Haufe-Synopse): Gas/Öl 1,1, Holz/feste Biomasse 0,7,
 *      Netzstrom 1,5, Fernwärme 0,7; CO₂ Netzstrom 100 g/kWh (Ökozentrum NRW; am Gesetzestext Anlage 9
 *      Fassung 2027 zu bestätigen: vorläufig, F-Freigabe), übrige CO₂-Faktoren wie bis 2026.
 *    Fernwärme bis 2026: f_p 0,4 und CO₂ 120 g/kWh als Lehrwerte (Anlage 4/9 unterscheiden nach Erzeugung).
 *  - Interne Gewinne pauschal 35 kWh/(m²a); maßgebend ist das Nutzungsprofil nach DIN/TS 18599-10 (Normtext,
 *    T11-EA-4): Lehrwert, vorläufig, F-Freigabe.
 * Einheiten: Flächen m², U in W/(m²K), H in W/K, Energiekennwerte in kWh/(m²a), CO₂ in kg/(m²a).
 * Reiner Rechenkern – geprüft in tests/energieausweis.test.ts.
 */
import { type Hinweis, hatFehler, muss } from './plausibilitaet';

export type Gebaeudetyp = 'efh' | 'mfh';
export type Huellstandard = 'unsaniert' | 'bestand_teilsaniert' | 'geg_standard' | 'effizienzhaus40';
export type Lueftung = 'fenster' | 'abluft' | 'kwl_wrg';
export type Heizung = 'gas_brennwert' | 'oel_kessel' | 'pellets' | 'wp_luft' | 'wp_sole' | 'fernwaerme';
/** Rechtsstand des GModG: zweite Stufe (neue Anlage 4, Referenzgebäude, DIN/TS 18599) ab 01.01.2027 */
export type Rechtsstand = 'bis_2026' | 'ab_2027';
export const RECHTSSTAENDE: readonly Rechtsstand[] = ['bis_2026', 'ab_2027'];
/** Stichtag der zweiten Stufe des GModG (01.01.2027) */
export const STICHTAG_2027 = '2027-01-01';
/** Rechtsstand zu einem Datum (Standard im Rechner: heutiges Datum) */
export function rechtsstandAm(datum: Date): Rechtsstand {
  return datum.getTime() >= new Date(`${STICHTAG_2027}T00:00:00`).getTime() ? 'ab_2027' : 'bis_2026';
}

export const HUELLE: Readonly<Record<Huellstandard, { wand: number; dach: number; fenster: number; wb: number; boden: number }>> = {
  unsaniert: { wand: 1.40, dach: 1.20, fenster: 3.00, wb: 0.10, boden: 0.90 },
  bestand_teilsaniert: { wand: 0.45, dach: 0.30, fenster: 1.60, wb: 0.07, boden: 0.50 },
  geg_standard: { wand: 0.24, dach: 0.18, fenster: 1.10, wb: 0.05, boden: 0.25 },
  effizienzhaus40: { wand: 0.14, dach: 0.11, fenster: 0.75, wb: 0.02, boden: 0.25 },
};
export const LUFTWECHSEL: Readonly<Record<Lueftung, number>> = { fenster: 0.5, abluft: 0.45, kwl_wrg: 0.18 };
export const ERZEUGER: Readonly<Record<Heizung, { eta: number; jaz: number }>> = {
  gas_brennwert: { eta: 0.96, jaz: 1.0 },
  oel_kessel: { eta: 0.84, jaz: 1.0 },
  pellets: { eta: 0.88, jaz: 1.0 },
  wp_luft: { eta: 1.0, jaz: 3.3 },
  wp_sole: { eta: 1.0, jaz: 4.3 },
  fernwaerme: { eta: 0.98, jaz: 1.0 },
};
/** Primärenergiefaktor f_p und CO₂-Faktor in g/kWh je Energieträger und Rechtsstand (Quellen im Dateikopf) */
export const FAKTOREN: Readonly<Record<Rechtsstand, Readonly<Record<Heizung, { fp: number; co2: number }>>>> = {
  bis_2026: {
    gas_brennwert: { fp: 1.1, co2: 240 },
    oel_kessel: { fp: 1.1, co2: 310 },
    pellets: { fp: 0.2, co2: 20 },
    wp_luft: { fp: 1.8, co2: 560 },
    wp_sole: { fp: 1.8, co2: 560 },
    fernwaerme: { fp: 0.4, co2: 120 },
  },
  ab_2027: {
    gas_brennwert: { fp: 1.1, co2: 240 },
    oel_kessel: { fp: 1.1, co2: 310 },
    pellets: { fp: 0.7, co2: 20 },
    wp_luft: { fp: 1.5, co2: 100 },
    wp_sole: { fp: 1.5, co2: 100 },
    fernwaerme: { fp: 0.7, co2: 120 },
  },
};
/** Primärenergiefaktor Netzstrom (Hilfsstrom) je Rechtsstand */
export const FP_STROM: Readonly<Record<Rechtsstand, number>> = { bis_2026: 1.8, ab_2027: 1.5 };
/** Interne Gewinne im Lehrmodell in kWh/(m²a) (Lehrwert, vorläufig, F-Freigabe: Nutzungsprofil DIN/TS 18599-10) */
export const Q_INTERN = 35;

/** Klassengrenzen der Endenergie in kWh/(m²a) nach GModG Anlage 10 (vormals GEG) */
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
  /** Rechtsstand für f_p und CO₂-Faktoren (Standard: bis 31.12.2026) */
  rechtsstand?: Rechtsstand;
}

export interface EnergieausweisErgebnis {
  h_t: number; h_t_prime: number; h_v: number; n_eff: number; v_netto: number; f_klima_k: number;
  q_t_roh: number; q_v_roh: number; q_solar: number; q_intern: number; eta_ausnutzung: number; q_gewinne_roh: number;
  q_t_jahr: number; q_v_jahr: number; q_gewinne: number;
  q_h: number; q_w: number; q_verlust_netz: number; w_hilfsstrom: number; jaz: number; eta_erzeuger: number; f_p: number;
  q_e: number; q_p: number; co2_emissionen: number; co2_faktor: number; fp_strom: number; rechtsstand: Rechtsstand; klasse: string; istWP: boolean;
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
  const q_intern = Q_INTERN;
  const eta_ausnutzung = e.huelle === 'effizienzhaus40' ? 0.75 : e.huelle === 'unsaniert' ? 0.98 : 0.88;
  const q_gewinne_roh = eta_ausnutzung * (q_solar + q_intern);
  const q_h = Math.max(10, Math.round(q_t_roh + q_v_roh - q_gewinne_roh));
  const q_w = 12.5;
  const erz = ERZEUGER[e.heizung];
  const rechtsstand: Rechtsstand = e.rechtsstand ?? 'bis_2026';
  const fak = FAKTOREN[rechtsstand][e.heizung];
  const fp_strom = FP_STROM[rechtsstand];
  const istWP = e.heizung.startsWith('wp');
  const q_verlust_netz = e.huelle === 'unsaniert' ? 14 : 7;
  const w_hilfsstrom = istWP ? 2.5 : 3.5;
  const q_e = Math.round((q_h + q_w + q_verlust_netz) / (istWP ? erz.jaz : erz.eta) + w_hilfsstrom);
  const q_p = istWP ? Math.round(q_e * fak.fp) : Math.round(((q_h + q_w + q_verlust_netz) / erz.eta) * fak.fp + w_hilfsstrom * fp_strom);
  // CO₂ wie bisher vereinfacht mit dem Faktor des Hauptenergieträgers auf die gesamte Endenergie
  const co2_emissionen = Math.round((q_e * fak.co2) / 1000);
  const klasse = effizienzklasse(q_e);
  if (q_t_roh + q_v_roh - q_gewinne_roh < 10) hinweise.push({ stufe: 'warnung', feld: 'q_h', text: 'Rechnerischer Heizwärmebedarf unter 10 kWh/(m²a): Das Lehrmodell setzt mindestens 10 an.' });
  hinweise.push({ stufe: 'warnung', feld: 'klasse', text: 'Lehrmodell mit Pauschalflächen und Gradstunden – kein Energieausweis nach GModG/DIN V 18599.' });
  if (rechtsstand === 'ab_2027') hinweise.push({ stufe: 'warnung', feld: 'rechtsstand', text: 'Rechtsstand ab 01.01.2027: f_p nach Anlage 4 GModG 2027; CO₂-Faktor Strom 100 g/kWh vorläufig. Das neue Referenzgebäude (Anlagen 1 und 2) ist im Lehrmodell nicht abgebildet.' });
  return {
    h_t, h_t_prime, h_v, n_eff, v_netto, f_klima_k, q_t_roh, q_v_roh, q_solar, q_intern, eta_ausnutzung, q_gewinne_roh,
    q_t_jahr: Math.round(q_t_roh), q_v_jahr: Math.round(q_v_roh), q_gewinne: Math.round(q_gewinne_roh),
    q_h, q_w, q_verlust_netz, w_hilfsstrom, jaz: erz.jaz, eta_erzeuger: erz.eta, f_p: fak.fp,
    q_e, q_p, co2_emissionen, co2_faktor: fak.co2, fp_strom, rechtsstand, klasse, istWP, gueltig: !hatFehler(hinweise), hinweise,
  };
}
