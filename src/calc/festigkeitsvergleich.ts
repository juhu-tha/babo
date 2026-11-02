/**
 * Rechenkern Festigkeitsvergleich (Z3), übernommen aus src/modules/Festigkeitsberechnungen.tsx:
 *  - Reißlänge bzw. Grenzhöhe unter Eigengewicht: H_max = f_c/(ρ·g) (Druck), L_max = f_t/(ρ·g) (Zug), g = 9,81 m/s²
 *  - Würfelstapel aus Würfeln der Kantenlänge a: N_max = ⌊f_c/(ρ·g·a)⌋, H = N_max·a,
 *    Spannung im untersten Würfel σ = N_max·ρ·g·a, Stauchung des untersten Würfels δ = σ/E·a,
 *    Gesamtstauchung wie im Modul δ_ges = ρ·g·a²/E·N(N + 1)/2 (Stauchung je Würfel mit der Spannung an seiner Unterseite)
 * Einheiten: ρ in kg/m³, f und E in N/mm², a in cm; Ergebnisse H/L in m, δ in mm, σ in N/mm².
 * Reiner Rechenkern – geprüft in tests/festigkeitsvergleich.test.ts.
 */
import { type Hinweis, istEndlich, hatFehler, muss, nurGueltig } from './plausibilitaet';

export const G_ERDE = 9.81;

export interface Festigkeitswerkstoff {
  /** Rohdichte in kg/m³ */
  rho: number;
  /** Druck- und Zugfestigkeit sowie E-Modul in N/mm² */
  fc: number;
  ft: number;
  E: number;
}

export function grenzhoehen(m: Festigkeitswerkstoff): { H_max: number; L_max: number } {
  return { H_max: (m.fc * 1e6) / (m.rho * G_ERDE), L_max: (m.ft * 1e6) / (m.rho * G_ERDE) };
}

export interface WuerfelstapelErgebnis {
  /** Kantenlänge in m */
  a: number;
  N_max_exact: number;
  N_max: number;
  /** Stapelhöhe in m */
  H_total: number;
  delta_bottom: number;
  delta_total: number;
  /** exakte Gesamtstauchung bei linear zunehmender Spannung in mm: ρ·g·a²·N²/(2E) */
  delta_total_exakt: number;
  sigma_bottom: number;
  gueltig: boolean;
  hinweise: Hinweis[];
}

export function wuerfelstapel(m: Festigkeitswerkstoff, kanteCm: number): WuerfelstapelErgebnis {
  const hinweise: Hinweis[] = [];
  muss(hinweise, istEndlich(m.rho, m.fc, m.E, kanteCm) && m.rho > 0 && m.E > 0 && kanteCm > 0 && m.fc >= 0, 'eingabe', 'Dichte, E-Modul und Kantenlänge müssen größer als 0 sein.');
  const a = kanteCm / 100;
  const N_max_exact = (m.fc * 1e6) / (m.rho * G_ERDE * a);
  const N_max = Math.floor(N_max_exact);
  const H_total = N_max * a;
  const sigmaPa = N_max * m.rho * G_ERDE * a;
  const delta_bottom = (sigmaPa / (m.E * 1e6)) * a * 1000;
  const faktor = (m.rho * G_ERDE * a * a) / (m.E * 1e6);
  const delta_total = faktor * (N_max * (N_max + 1) / 2) * 1000;
  const delta_total_exakt = faktor * (N_max * N_max / 2) * 1000;
  if (N_max > 0) hinweise.push({ stufe: 'warnung', feld: 'delta_total', text: 'Die Gesamtstauchung setzt je Würfel die Spannung an seiner Unterseite an und überschätzt sie um den Faktor (N + 1)/N.' });
  return nurGueltig({ a, N_max_exact, N_max, H_total, delta_bottom, delta_total, delta_total_exakt, sigma_bottom: sigmaPa / 1e6, gueltig: !hatFehler(hinweise), hinweise });
}
