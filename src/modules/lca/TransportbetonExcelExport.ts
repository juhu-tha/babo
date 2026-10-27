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
