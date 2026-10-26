import inhalt from '@/content/lca/TransportbetonExcelExport.json';
// xlsx (~145 kB gzip) erst beim Herunterladen laden, nicht mit der Ökobilanz-Seite (Phase 5, AP 5.5 Nachtrag)

export interface TransportbetonMix {
  name: string;
  strengthClass: string;
  cemType: string;
  cemAmount: number; // kg/m³
  waterAmount: number; // kg/m³ or L/m³
  aggregateSand: number; // 0/4 mm in kg/m³
  aggregateGravel: number; // 4/16 or 4/32 mm in kg/m³
  superplasticizer: number; // FM in kg/m³
  flyAshOrSlag: number; // SCM in kg/m³
  recycledAggregate: number; // RC-Körnung in kg/m³
}

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

/**
 * Erzeugt eine strukturierte, professionell formatierte Excel-Arbeitsmappe (.xlsx)
 * mit mehreren Tabellenblättern:
 * 1. "Übersicht & Anleitung": Fachliche Grundlagen, DIN EN 15804, Modul A1-A5
 * 2. "Transportbeton_Rechner": Interaktive Exceltabelle mit LIVE-Excel-Formeln (!), Rezepturvergleich CEM I vs. CEM III
 * 3. "Aufgabe_Studierende": Konkrete Laboraufgabe mit Sollwerten und Selbstkontrolle
 * 4. "EPD_Stammdaten": Referenzdatenbank (ÖKOBAUDAT) für Zemente, Gesteinskörnungen, Transporte
 */
export async function generateTransportbetonExcel(): Promise<void> {
  const XLSX = await import('xlsx');
  const wb = XLSX.utils.book_new();

  // -------------------------------------------------------------
  // SHEET 1: Anleitung & Methodik
  // -------------------------------------------------------------
  const ws1_data = inhalt.daten["generateTransportbetonExcel.ws1_data"];

  const ws1 = XLSX.utils.aoa_to_sheet(ws1_data);
  ws1['!cols'] = [{ wch: 45 }, { wch: 65 }, { wch: 25 }];
  XLSX.utils.book_append_sheet(wb, ws1, inhalt.werte.übersichtAnleitung);

  // -------------------------------------------------------------
  // SHEET 2: Transportbeton_Rechner (Mit echten Excel-Formeln!)
  // -------------------------------------------------------------
  // We formulate rows and Excel formulas referencing cells:
  // Col A: Parameter
  // Col B: Einheit
  // Col C: Emissionsfaktor (EF)
  // Col D: Standard C25/30 (CEM I)
  // Col E: GWP CEM I (kg CO2-eq) = Menge * EF
  // Col F: Öko-Beton C25/30 (CEM III/A)
  // Col G: GWP CEM III (kg CO2-eq) = Menge * EF
  // Col H: RC-Öko-Beton C25/30 (CEM III/B + RC-Kies)
  // Col I: GWP RC-Beton (kg CO2-eq) = Menge * EF

  const ws2_data = inhalt.daten["generateTransportbetonExcel.ws2_data"];

  const ws2 = XLSX.utils.aoa_to_sheet(ws2_data);
  ws2['!cols'] = [
    { wch: 44 }, // A
    { wch: 14 }, // B
    { wch: 26 }, // C
    { wch: 24 }, // D
    { wch: 22 }, // E
    { wch: 25 }, // F
    { wch: 22 }, // G
    { wch: 28 }, // H
    { wch: 22 }  // I
  ];
  XLSX.utils.book_append_sheet(wb, ws2, 'Transportbeton_Rechner');

  // -------------------------------------------------------------
  // SHEET 3: Aufgabe_Studierende (Interaktive Optimierungsaufgabe)
  // -------------------------------------------------------------
  const ws3_data = inhalt.daten["generateTransportbetonExcel.ws3_data"];

  const ws3 = XLSX.utils.aoa_to_sheet(ws3_data);
  ws3['!cols'] = [
    { wch: 38 },
    { wch: 14 },
    { wch: 14 },
    { wch: 20 },
    { wch: 18 },
    { wch: 25 },
    { wch: 18 },
    { wch: 26 }
  ];
  XLSX.utils.book_append_sheet(wb, ws3, 'Aufgabe_Studierende');

  // -------------------------------------------------------------
  // SHEET 4: EPD_Stammdaten (ÖKOBAUDAT Kennwerte)
  // -------------------------------------------------------------
  const ws4_data = inhalt.daten["generateTransportbetonExcel.ws4_data"];

  const ws4 = XLSX.utils.aoa_to_sheet(ws4_data);
  ws4['!cols'] = [
    { wch: 42 },
    { wch: 18 },
    { wch: 14 },
    { wch: 22 },
    { wch: 14 },
    { wch: 16 },
    { wch: 16 },
    { wch: 28 }
  ];
  XLSX.utils.book_append_sheet(wb, ws4, 'EPD_Stammdaten');

  // Trigger Excel file download in browser
  XLSX.writeFile(wb, 'Oekobilanz_Transportbeton_DIN_EN_15804_THA.xlsx');
}
