/**
 * Emissionsfaktoren der Transportbeton-Übung (TransportbetonLcaUebung). Eigene kleine Datei, damit die
 * Excel-Erzeugung (TransportbetonExcelExport.ts) überall nur dynamisch geladen wird (Code-Splitting).
 */
// EPD Emission factors (ÖKOBAUDAT / DIN EN 15804 + A2)
export const LCA_BENCHMARKS = {
  // A1: Rohstoffe (kg CO2-eq / kg Material)
  gwp_cem_I: 0.850, // CEM I 42.5 R (hoher Klinkeranteil ~95%)
  gwp_cem_II_ALL: 0.680, // CEM II/A-LL (Kalksteinmehl)
  gwp_cem_III_A: 0.420, // CEM III/A (Hüttensand 36-65%)
  gwp_cem_III_B: 0.280, // CEM III/B (Hüttensand 66-80%)
  gwp_aggregate_natural: 0.0035, // Kies / Sand gewaschen (3.5 kg CO2-eq/t)
  gwp_aggregate_rc: 0.0018, // Rezyklierte Körnung aufbereitet (1.8 kg CO2-eq/t)
  gwp_water: 0.0003, // Leitungswasser / Brunnenwasser
  gwp_admixture: 1.650, // Fließmittel (PCE synthetisch)
  gwp_fly_ash: 0.015, // Flugasche (Aufbereitung)
  gwp_slag_ground: 0.050, // Hüttensandmehl gemahlen

  // A2: Transport zur Mischanlage (kg CO2-eq / (t · km))
  transport_truck_40t: 0.068, // Lkw 40t Euro 6 (68 g CO2-eq/tkm)
  transport_train: 0.018, // Güterbahn (18 g CO2-eq/tkm)
  transport_ship: 0.012, // Binnenschiff (12 g CO2-eq/tkm)

  // A3: Betonmischwerk Herstellung (Strom + Diesel + Heizung pro m³)
  gwp_mixing_plant_standard: 5.20, // kg CO2-eq / m³ (deutscher Strommix 2024 ca. 380 g/kWh)
  gwp_mixing_plant_green: 2.10, // kg CO2-eq / m³ (100% Ökostrom + PV-Anlage)

  // A4: Transport zur Baustelle mit Fahrmischer (kg CO2-eq / (m³ · km))
  gwp_concrete_truck_per_m3_km: 0.185, // 4-Achs-Fahrmischer beladen (185 g CO2-eq / m³ und km)
  
  // A5: Baustelleneinbau & Verdichten mit Betonpumpe (kg CO2-eq / m³)
  gwp_concrete_pump: 3.50 // Autobetonpumpe / Rüttelflaschen
};
