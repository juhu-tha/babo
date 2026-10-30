/**
 * Emissionsfaktoren der Transportbeton-Übung (TransportbetonLcaUebung). Eigene kleine Datei, damit die
 * Excel-Erzeugung (TransportbetonExcelExport.ts) überall nur dynamisch geladen wird (Code-Splitting).
 */
// Emissionsfaktoren (DIN EN 15804 + A2); Zement aus der gemeinsamen Konstante src/data/zementGwp.ts (T15-NH-3, netto)
import { ZEMENT_GWP_KG } from '@/src/data/zementGwp';
import { A4_FAKTOR_EINZEL } from '@/src/calc/lca';

/**
 * Lkw-Faktor der Übung (A2) bewusst abweichend vom zentralen A4-Faktor (Entscheidung 29.10.2026 zu NP2-LC-2: belassen,
 * Unterschied im Text ausweisen): 0,068 kg CO₂-Äq./(t·km) gilt für einen voll ausgelasteten 40-t-Sattelzug Euro 6 im
 * Direktverkehr Werk → Werk (Lehrwert der Übung). A4_FAKTOR_EINZEL['lkw-heavy'] = 0,101 ist der UBA-Mittelwert 2024 aller
 * Last- und Sattelzüge einschließlich Leerfahrten und Teilbeladung (TREMOD 6.71B). Durchsicht B 29.10.2026, DSB-LC-3.
 */
export const LKW_FAKTOR_UEBUNG = 0.068;
export const LKW_FAKTOR_ZENTRAL = A4_FAKTOR_EINZEL['lkw-heavy'];

export const LCA_BENCHMARKS = {
  // A1: Rohstoffe (kg CO2-eq / kg Material)
  gwp_cem_I: ZEMENT_GWP_KG['CEM I'], // CEM I 42.5 R – VDZ-Branchen-EPD 2022: 0,665 (netto)
  gwp_cem_II_ALL: ZEMENT_GWP_KG['CEM II/A'], // CEM II/A-LL (Kalksteinmehl) – Lehrwert 0,60
  gwp_cem_III_A: ZEMENT_GWP_KG['CEM III/A'], // CEM III/A (Hüttensand 36-65%) – Lehrwert 0,40
  gwp_cem_III_B: ZEMENT_GWP_KG['CEM III/B'], // CEM III/B (Hüttensand 66-80%) – Lehrwert 0,26
  gwp_aggregate_natural: 0.0035, // Kies / Sand gewaschen (3.5 kg CO2-eq/t)
  gwp_aggregate_rc: 0.0018, // Rezyklierte Körnung aufbereitet (1.8 kg CO2-eq/t)
  gwp_water: 0.0003, // Leitungswasser / Brunnenwasser
  gwp_admixture: 1.650, // Fließmittel (PCE synthetisch)
  gwp_fly_ash: 0.015, // Flugasche (Aufbereitung)
  gwp_slag_ground: 0.050, // Hüttensandmehl gemahlen

  // A2: Transport zur Mischanlage (kg CO2-eq / (t · km))
  transport_truck_40t: LKW_FAKTOR_UEBUNG, // Lkw 40t Euro 6, voll ausgelastet (68 g CO2-eq/tkm, Lehrwert; zentral 101 g, s. o.)
  transport_train: A4_FAKTOR_EINZEL.zug, // Güterbahn, UBA 2024 (14 g CO2-eq/tkm; vorher 18 g ohne Quelle, DSB-LC-3)
  transport_ship: 0.012, // Binnenschiff (12 g CO2-eq/tkm, Lehrwert ohne abgerufene Quelle)

  // A3: Betonmischwerk Herstellung (Strom + Diesel + Heizung pro m³), Lehrwerte
  gwp_mixing_plant_standard: 5.20, // kg CO2-eq / m³ (Lehrwert, Netzstrom)
  gwp_mixing_plant_green: 2.10, // kg CO2-eq / m³ (Lehrwert, 100% Ökostrom + PV-Anlage)

  // A4: Transport zur Baustelle mit Fahrmischer (kg CO2-eq / (m³ · km)), Lehrwert
  gwp_concrete_truck_per_m3_km: 0.185, // 4-Achs-Fahrmischer beladen (185 g CO2-eq / m³ und km)

  // A5: Baustelleneinbau & Verdichten mit Betonpumpe (kg CO2-eq / m³), Lehrwert
  gwp_concrete_pump: 3.50 // Autobetonpumpe / Rüttelflaschen
};
