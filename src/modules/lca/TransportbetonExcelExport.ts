import * as XLSX from 'xlsx';

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
export function generateTransportbetonExcel(): void {
  const wb = XLSX.utils.book_new();

  // -------------------------------------------------------------
  // SHEET 1: Anleitung & Methodik
  // -------------------------------------------------------------
  const ws1_data = [
    ['HOCHSCHULE AUGSBURG – FAKULTÄT FÜR ARCHITEKTUR UND BAUWESEN'],
    ['LEHRGEBIET BAUSTOFFKUNDE & NACHHALTIGES BAUEN'],
    ['STUDIENARBEITSBLATT: ÖKOBILANZIERUNG (LCA) VON TRANSPORTBETON NACH DIN EN 15804'],
    [],
    ['1. Didaktisches Lernziel'],
    ['In diesem Arbeitsblatt lernen Sie die quantitative Treibhausgasbilanzierung (Global Warming Potential, GWP)'],
    ['von 1 m³ Transportbeton für die Lebenszyklusphasen der Wiege bis zum Werkstor mit Baustelleneinbau (A1 bis A5).'],
    ['Sie untersuchen den Einfluss von Zementart, Klinkersubstitution (Hüttensand, Flugasche), RC-Gesteinskörnung'],
    ['sowie Transportdistanzen (Fahrmischer-Logistik) auf die Ökobilanz.'],
    [],
    ['2. Normativer Rahmen'],
    ['- DIN EN 15804:2022-03 (Nachhaltigkeit von Bauwerken – EPD – Grundregeln für die Produktkategorie Bauprodukte)'],
    ['- DIN EN 206 / DIN 1045-2 (Beton: Festlegung, Eigenschaften, Herstellung und Konformität)'],
    ['- ÖKOBAUDAT (Bundesministerium für Wohnen, Stadtentwicklung und Bauwesen - BMWSB)'],
    [],
    ['3. Gliederung der Module im Arbeitsblatt'],
    ['Modul A1: Rohstoffgewinnung und -verarbeitung (Zementherstellung, Klinkerentsäuerung CaCO3 -> CaO + CO2, Kiesaufbereitung)'],
    ['Modul A2: Transport der Rohstoffe zum Transportbetonwerk (Lkw- und Bahnlogistik)'],
    ['Modul A3: Herstellung im Betonmischwerk (Elektrische Mischerenergie, Warmwasser, Siloentstaubung)'],
    ['Modul A4: Transport des Frischbetons zur Baustelle (Fahrmischer mit Mischtrommel-Drehung)'],
    ['Modul A5: Einbau auf der Baustelle (Betonpumpe, Rüttelflaschenverdichtung)'],
    [],
    ['4. Struktur der Tabellenblätter in dieser Arbeitsmappe'],
    ['Blatt 2 [Transportbeton_Rechner]: Vollständige LCA-Berechnung mit dynamischen Excel-Formeln (CEM I vs. CEM III vs. RC-Beton)'],
    ['Blatt 3 [Aufgabe_Studierende]: Interaktive Übung zur Mischungsoptimierung für eine Tiefgaragen-Bodenplatte (C30/37)'],
    ['Blatt 4 [EPD_Stammdaten]: Amtliche ÖKOBAUDAT-Emissionsfaktoren für GWP, Primärenergie (PENRT) und Transportaufwände'],
    [],
    ['Bearbeitungshinweis: Grüne Zellen in den Tabellenblättern dürfen Sie selbst verändern! Formeln sind mit "=" hinterlegt.']
  ];

  const ws1 = XLSX.utils.aoa_to_sheet(ws1_data);
  ws1['!cols'] = [{ wch: 45 }, { wch: 65 }, { wch: 25 }];
  XLSX.utils.book_append_sheet(wb, ws1, 'Übersicht & Anleitung');

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

  const ws2_data = [
    ['LCA-VERGLEICHSRECHNER TRANSPORTBETON (1 m³ Festbeton C25/30)', '', '', '', '', '', '', '', ''],
    ['Lebenszyklusmodule A1 bis A5 nach DIN EN 15804+A2 / DGNB ENV1.1', '', '', '', '', '', '', '', ''],
    [],
    [
      'Komponente / Lebenszyklusphase',
      'Einheit',
      'GWP-Faktor (kg CO2/Einheit)',
      'Rezeptur 1: CEM I (Standard)',
      'GWP Rez. 1 [kg CO2-eq]',
      'Rezeptur 2: CEM III/A (Klinkerarm)',
      'GWP Rez. 2 [kg CO2-eq]',
      'Rezeptur 3: CEM III/B + RC (Zirkulär)',
      'GWP Rez. 3 [kg CO2-eq]'
    ],
    // Zeile 5: MODUL A1: Rohstoffe
    ['--- MODUL A1: ROHSTOFFGEWINNUNG & ZEMENTWERK ---', '', '', '', '', '', '', '', ''],
    ['Zement CEM I 42.5 R (Klinker ca. 95%)', 'kg/m³', 0.850, 320, { f: 'C6*D6' }, 0, { f: 'C6*F6' }, 0, { f: 'C6*H6' }],
    ['Zement CEM III/A 42.5 N (Hüttensand ca. 50%)', 'kg/m³', 0.420, 0, { f: 'C7*D7' }, 300, { f: 'C7*F7' }, 0, { f: 'C7*H7' }],
    ['Zement CEM III/B 32.5 N (Hüttensand ca. 70%)', 'kg/m³', 0.280, 0, { f: 'C8*D8' }, 0, { f: 'C8*F8' }, 280, { f: 'C8*H8' }],
    ['Zusatzstoff: Flugasche (steinkohlebefeuert)', 'kg/m³', 0.015, 0, { f: 'C9*D9' }, 40, { f: 'C9*F9' }, 50, { f: 'C9*H9' }],
    ['Gesteinskörnung: Sand 0/4 mm (natürlich gewaschen)', 'kg/m³', 0.0035, 720, { f: 'C10*D10' }, 710, { f: 'C10*F10' }, 650, { f: 'C10*H10' }],
    ['Gesteinskörnung: Kies 4/16 mm (natürlich)', 'kg/m³', 0.0035, 1150, { f: 'C11*D11' }, 1160, { f: 'C11*F11' }, 600, { f: 'C11*H11' }],
    ['Rezyklierte Gesteinskörnung: RC-Kies 4/16 mm (Typ 1)', 'kg/m³', 0.0018, 0, { f: 'C12*D12' }, 0, { f: 'C12*F12' }, 550, { f: 'C12*H12' }],
    ['Zugabewasser (Trink- / Brunnenwasser)', 'kg/m³', 0.0003, 175, { f: 'C13*D13' }, 165, { f: 'C13*F13' }, 160, { f: 'C13*H13' }],
    ['Betonzusatzmittel: Fließmittel PCE (Wirkstoff 30%)', 'kg/m³', 1.650, 2.5, { f: 'C14*D14' }, 3.2, { f: 'C14*F14' }, 3.5, { f: 'C14*H14' }],
    ['ZWISCHENSUMME MODUL A1 (Rohstoffe)', 'kg CO2-eq/m³', '', '', { f: 'SUM(E6:E14)' }, '', { f: 'SUM(G6:G14)' }, '', { f: 'SUM(I6:I14)' }],
    [],
    // Zeile 17: MODUL A2: Transport Rohstoffe zum Betonwerk
    ['--- MODUL A2: TRANSPORT DER AUSGANGSSTOFFE ZUM WERK ---', '', '', '', '', '', '', '', ''],
    ['Transport Zement (Lkw 40t, 80 km Entfernung)', 't · km', 0.068, { f: '(D6+D7+D8)/1000*80' }, { f: 'C18*D18' }, { f: '(F6+F7+F8)/1000*80' }, { f: 'C18*F18' }, { f: '(H6+H7+H8)/1000*80' }, { f: 'C18*H18' }],
    ['Transport Gesteinskörnung (Lkw 40t, 25 km Nahbereich)', 't · km', 0.068, { f: '(D10+D11+D12)/1000*25' }, { f: 'C19*D19' }, { f: '(F10+F11+F12)/1000*25' }, { f: 'C19*F19' }, { f: '(H10+H11+H12)/1000*25' }, { f: 'C19*H19' }],
    ['ZWISCHENSUMME MODUL A2 (Rohstoff-Transporte)', 'kg CO2-eq/m³', '', '', { f: 'SUM(E18:E19)' }, '', { f: 'SUM(G18:G19)' }, '', { f: 'SUM(I18:I19)' }],
    [],
    // Zeile 22: MODUL A3: Mischwerk
    ['--- MODUL A3: HERSTELLUNG IM BETONMISCHWERK ---', '', '', '', '', '', '', '', ''],
    ['Mischwerk-Strom, Siloheizung, Mischerreinigung', 'm³', 5.20, 1, { f: 'C23*D23' }, 1, { f: 'C23*F23' }, 1, { f: 'C23*H23' }],
    ['ZWISCHENSUMME MODUL A3 (Mischprozess)', 'kg CO2-eq/m³', '', '', { f: 'E23' }, '', { f: 'G23' }, '', { f: 'I23' }],
    [],
    // Zeile 26: Bilanzsumme Cradle-to-Gate (A1-A3)
    ['>>> CRADLE-TO-GATE (A1-A3) ÖKOBAUDAT-WERKSTOR <<<', 'kg CO2-eq/m³', '', '', { f: 'E15+E20+E24' }, '', { f: 'G15+G20+G24' }, '', { f: 'I15+I20+I24' }],
    [],
    // Zeile 28: MODUL A4 & A5: Baustellenlogistik & Einbau
    ['--- MODUL A4: TRANSPORT ZUR BAUSTELLE (FAHRMISCHER) ---', '', '', '', '', '', '', '', ''],
    ['Fahrmischer-Transport (4-Achser, Distanz x km)', 'm³ · km', 0.185, 15, { f: 'C29*D29' }, 15, { f: 'C29*F29' }, 15, { f: 'C29*H29' }],
    ['--- MODUL A5: BAUSTELLENEINBAU & PUMPEN ---', '', '', '', '', '', '', '', ''],
    ['Betonpumpe + Verdichtung mit Innenrüttler', 'm³', 3.50, 1, { f: 'C31*D31' }, 1, { f: 'C31*F31' }, 1, { f: 'C31*H31' }],
    [],
    // Zeile 33: GESAMTBILANZ A1-A5
    ['=========================================', '', '', '', '', '', '', '', ''],
    ['GESAMT-TREIBHAUSPOTENZIAL A1-A5 (GWP gesamt)', 'kg CO2-eq/m³', '', '', { f: 'E26+E29+E31' }, '', { f: 'G26+G29+G31' }, '', { f: 'I26+I29+I31' }],
    ['CO2-Einsparung gegenüber Standardrezeptur CEM I', '%', '', '', '0.0 % (Referenz)', '', { f: '(E34-G34)/E34*100' }, '', { f: '(E34-I34)/E34*100' }],
    ['Spezifisches GWP pro Festigkeitsklasse (C25/30 = 30 N/mm²)', 'kg CO2/(m³·MPa)', '', '', { f: 'E34/30' }, '', { f: 'G34/30' }, '', { f: 'I34/30' }],
    ['=========================================', '', '', '', '', '', '', '', '']
  ];

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
  const ws3_data = [
    ['STUDIERENDEN-ÜBUNGSAUFGABE: ÖKOBILANZIERUNG & OPTIMIERUNG EINES TIEFGARAGENBETONS'],
    ['Fallstudie: Bodenplatte 850 m³ in Augsburg (Expositionsklasse XC4, XD1, XF1 nach DIN EN 206)'],
    [],
    ['1. Aufgabenstellung:'],
    ['Für ein Wohnbauprojekt in Augsburg werden 850 m³ Transportbeton für die elastisch gebettete Sohlplatte benötigt.'],
    ['Der Bauherr strebt das DGNB-Zertifikat in Gold an. Das Tragwerksplanungsbüro fordert die Festigkeitsklasse C30/37.'],
    ['Bisher ist ein Standardbeton mit 340 kg CEM I 42.5 R und reiner Primärkörnung ausgeschrieben.'],
    [],
    ['Ihre Ingenieuraufgabe:'],
    ['Entwickle im untenstehenden Berechnungsbereich "Mein Entwurf" eine klinkereffiziente Betonrezeptur,'],
    ['die folgende Bedingungen erfüllt:'],
    ['a) Mindestzementgehalt nach DIN 1045-2: mindestens 280 kg/m³ (bei Verwendung von CEM II/A-LL oder CEM III/A)'],
    ['b) Maximaler äquivalenter Wasserzementwert (w/z)_eq <= 0.50'],
    ['c) Ziel: Mindestens 35 % CO2-Reduktion gegenüber der Ausgangsrezeptur (Referenz)'],
    ['d) Ermitteln Sie die absolute CO2-Ersparnis für das gesamte Bauvorhaben (850 m³) in Tonnen CO2-Äquivalent!'],
    [],
    ['2. Berechnungs- und Eingabebereich für Studierende:'],
    [
      'Komponente / Eingabeparameter',
      'Einheit',
      'GWP-Faktor',
      'Referenz (Standard)',
      'GWP Referenz',
      'MEIN ENTWURF (Hier anpassen!)',
      'GWP Mein Entwurf',
      'Prüfung / Bemerkung'
    ],
    ['Zement: CEM I 42.5 R', 'kg/m³', 0.850, 340, { f: 'C17*D17' }, 0, { f: 'C17*F17' }, 'Klinkerreich'],
    ['Zement: CEM II/A-LL 42.5 N (Kalkstein)', 'kg/m³', 0.680, 0, { f: 'C18*D18' }, 0, { f: 'C18*F18' }, 'Mittlerer Klinker'],
    ['Zement: CEM III/A 42.5 N (Hüttensand)', 'kg/m³', 0.420, 0, { f: 'C19*D19' }, 290, { f: 'C19*F19' }, 'Klinkerarm (Empfohlen)'],
    ['Zusatzstoff: Flugasche oder Gesteinsmehl', 'kg/m³', 0.015, 0, { f: 'C20*D20' }, 40, { f: 'C20*F20' }, 'k-Wert = 0.4 anrechenbar'],
    ['Sand 0/4 mm (natürlich)', 'kg/m³', 0.0035, 700, { f: 'C21*D21' }, 680, { f: 'C21*F21' }, 'Kornaufbau nach Fuller'],
    ['Kies 4/16 mm (natürlich)', 'kg/m³', 0.0035, 1140, { f: 'C22*D22' }, 700, { f: 'C22*F22' }, 'Kornzusammensetzung'],
    ['RC-Korn 4/16 mm (Typ 1 Bauschutt)', 'kg/m³', 0.0018, 0, { f: 'C23*D23' }, 450, { f: 'C23*F23' }, 'DIN 4226-101'],
    ['Fließmittel PCE', 'kg/m³', 1.650, 2.0, { f: 'C24*D24' }, 3.2, { f: 'C24*F24' }, 'Konsistenz F3/F4'],
    ['Wasser (netto)', 'kg/m³', 0.0003, 170, { f: 'C25*D25' }, 155, { f: 'C25*F25' }, '(w/z) = 155 / 290 = 0.53'],
    ['Mischwerk-Herstellung (A3)', 'm³/m³', 5.20, 1, 5.2, 1, 5.2, 'Mischwerk'],
    ['Fahrmischer-Transport (A4, 18 km)', 'm³ · km', 0.185, 18, { f: 'C27*D27' }, 18, { f: 'C27*F27' }, 'Baustellen-Distanz'],
    ['Baustelleneinbau Pumpe (A5)', 'm³', 3.50, 1, 3.5, 1, 3.5, 'Einbau'],
    [],
    ['ERGEBNIS PRO m³ BETON (A1-A5):', '', '', '', { f: 'SUM(E17:E28)' }, '', { f: 'SUM(G17:G28)' }, 'kg CO2-eq/m³'],
    ['ERZIELTE CO2-MINDERUNG:', '', '', '', '', '', { f: '(E30-G30)/E30*100' }, '% Reduktion'],
    [],
    ['HOCHRECHNUNG FÜR DAS GESAMTBAUWERK (850 m³):', '', '', '', '', '', '', ''],
    ['Gesamt-CO2-Emission Referenz (850 m³):', 't CO2-eq', '', '', { f: 'E30*850/1000' }, '', '', 'Tonnen CO2-eq'],
    ['Gesamt-CO2-Emission Mein Entwurf (850 m³):', 't CO2-eq', '', '', '', '', { f: 'G30*850/1000' }, 'Tonnen CO2-eq'],
    ['ABSOLUTE CO2-ERSPARNIS DES BAUPROJEKTS:', 't CO2-eq', '', '', '', '', { f: 'E34-G35' }, 'Tonnen CO2 eingespart!'],
    [],
    ['Selbstkontrolle für die Abgabe:'],
    ['- Liegt Ihre CO2-Minderung bei mindestens 35 %? (Aktuell: siehe Zelle G31)'],
    ['- Entspricht der Zementgehalt mindestens 280 kg/m³? (Zelle F19)'],
    ['- Ist der w/z-Wert normgerecht? (Wassergehalt F25 geteilt durch Zement F19)']
  ];

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
  const ws4_data = [
    ['ÖKOBAUDAT / DIN EN 15804 STAMMDATENBANK (Stand 2024/2025)'],
    ['Kennwerte für die Ökobilanzierung mineralischer Baustoffe'],
    [],
    [
      'Materialbezeichnung / Prozess',
      'Kategorie',
      'Bezugseinheit',
      'GWP fossil [kg CO2-eq]',
      'PENRT [MJ]',
      'AP [kg SO2-eq]',
      'EP [kg PO4-eq]',
      'Datenquelle / Zertifikat'
    ],
    ['Portlandzement CEM I 42.5 R', 'Bindemittel', '1 kg', 0.850, 3.80, 0.0018, 0.00035, 'ÖKOBAUDAT / VDZ EPD'],
    ['Portlandkalksteinzement CEM II/A-LL 42.5', 'Bindemittel', '1 kg', 0.680, 3.10, 0.0014, 0.00028, 'ÖKOBAUDAT / VDZ EPD'],
    ['Hochofenzement CEM III/A 42.5 N', 'Bindemittel', '1 kg', 0.420, 2.15, 0.0009, 0.00018, 'ÖKOBAUDAT / VDZ EPD'],
    ['Hochofenzement CEM III/B 32.5 N', 'Bindemittel', '1 kg', 0.280, 1.55, 0.0006, 0.00012, 'ÖKOBAUDAT / VDZ EPD'],
    ['Steinkohlenflugasche', 'Zusatzstoff', '1 kg', 0.015, 0.12, 0.00008, 0.00002, 'ÖKOBAUDAT / WIN-EPD'],
    ['Hüttensandmehl gemahlen', 'Zusatzstoff', '1 kg', 0.050, 0.45, 0.00015, 0.00004, 'ÖKOBAUDAT'],
    ['Kies / Sand gewaschen (0/32 mm)', 'Gestein', '1 kg', 0.0035, 0.045, 0.00002, 0.000005, 'ÖKOBAUDAT / MIRO'],
    ['Rezyklierte Gesteinskörnung RC-Kies', 'Sekundärrohstoff', '1 kg', 0.0018, 0.028, 0.00001, 0.000003, 'ÖKOBAUDAT / BRB e.V.'],
    ['Betonverflüssiger / Fließmittel PCE', 'Zusatzmittel', '1 kg', 1.650, 32.5, 0.0045, 0.00080, 'EFCA / EPD Fließmittel'],
    ['Trinkwasser / Anmachwasser', 'Wasser', '1 kg (1 L)', 0.0003, 0.005, 0.000001, 0.0000002, 'Umweltbundesamt'],
    ['Transport Lkw 40t Euro 6 (Nutzlast 26t)', 'Transport', '1 t · km', 0.068, 0.98, 0.00018, 0.00004, 'TREMOD / ÖKOBAUDAT'],
    ['Transport Güterzug elektrisch (D-Strommix)', 'Transport', '1 t · km', 0.018, 0.24, 0.00005, 0.00001, 'TREMOD / Deutsche Bahn'],
    ['Transport Binnenschiff', 'Transport', '1 t · km', 0.012, 0.18, 0.00008, 0.00002, 'TREMOD'],
    ['Fahrmischer-Transport Frischbeton', 'Baustellenlogistik', '1 m³ · km', 0.185, 2.85, 0.00055, 0.00012, 'BTB Bundesverband Transportbeton'],
    ['Betonförderung Betonpumpe 36m Mast', 'Baustellengerät', '1 m³', 3.50, 48.0, 0.0095, 0.0022, 'ZTV-ING / ÖKOBAUDAT']
  ];

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
