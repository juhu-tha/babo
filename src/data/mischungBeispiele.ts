/** Geprüfte Beispielmischungen (Stoffraumrechnung) – Daten für das Modul und tests/mischung.test.ts */
export interface BenchmarkData {
  id: string;
  titel: string;
  kategorie: string;
  normKonformitaet: string;
  bauteilTyp: string;
  beschreibung: string;
  zementArt: string;
  zementFestigkeit: string;
  zement: number;
  wasser: number;
  konsistenz: string;
  fa: number;
  sf: number;
  hues: number;
  biochar?: number;
  stahlfaser?: number;
  ppFaser?: number;
  zusatzmittel: number;
  luft: number;
  groesstkorn: 8 | 16 | 32;
  sandFraktion?: '0/4' | '0/2';
  f04: number;
  f48: number;
  f816: number;
  f1632: number;
  feuchte04: number;
  feuchte48: number;
  feuchte816: number;
  feuchte1632: number;
  wa04: number;
  wa48: number;
  wa816: number;
  wa1632: number;
  expClasses: string[];
  /** Rohdichte der Gesteinskörnung [kg/dm³], Standard 2,65 */
  rhoGestein?: number;
  lpSetting?: 'auto' | 'mit_lp' | 'ohne_lp';

  normVorgaben: {
    druckfestigkeit: string;
    maxWz: number;
    minZement: number;
    minLuft?: number;
  };
  stoffraum: {
    zementVol: number;
    wasserVol: number;
    luftVol: number;
    zusatzstoffVol?: number;
    zmVol?: number;
    faserVol?: number;
    gesteinVol: number;
  };
  massenTrocken: {
    gesteinGesamt: number;
    m04: number;
    m48: number;
    m816: number;
    m1632?: number;
  };
  feuchteRechnung: {
    wasserAusGestein: number;
    zugabewasser: number;
    m04Feucht: number;
    m48Feucht: number;
    m816Feucht: number;
    m1632Feucht?: number;
  };
  frischbetonDichte: number;
  didaktischeHinweise: string[];
}

export const BENCHMARK_EXAMPLES: BenchmarkData[] = [
  {
    id: 'bsp_hochbau',
    titel: 'Beispiel 1: Hochbau-Regelbeton C25/30',
    kategorie: 'Hochbau & Wohnungsbau',
    normKonformitaet: 'DIN EN 206-1 / DIN 1045-2 (XC4, XF1)',
    bauteilTyp: 'Außenwand / Balkonplatte (direkt beregnet)',
    beschreibung: 'Klassischer Konstruktionsbeton für direkt bewitterte Hochbau-Bauteile. Nachweis der Stoffraumrechnung mit Mehlkornprüfung, Sieblinienaufteilung A/B 16 und realitätsnaher Feuchtekorrektur.',
    zementArt: 'CEM II/A',
    zementFestigkeit: '32.5 R',
    zement: 320,
    wasser: 190,
    konsistenz: 'F3',
    fa: 0,
    sf: 0,
    hues: 0,
    biochar: 0,
    stahlfaser: 0,
    ppFaser: 0,
    zusatzmittel: 0,
    luft: 2.0,
    groesstkorn: 16,
    sandFraktion: '0/4',
    f04: 45,
    f48: 20,
    f816: 35,
    f1632: 0,
    feuchte04: 3.0,
    feuchte48: 1.0,
    feuchte816: 0.5,
    feuchte1632: 0.5,
    wa04: 0.5,
    wa48: 0.5,
    wa816: 0.5,
    wa1632: 0.5,
    expClasses: ['XC4', 'XF1'],
    lpSetting: 'ohne_lp',
    normVorgaben: {
      druckfestigkeit: 'C25/30',
      maxWz: 0.60,
      minZement: 280, // DIN 1045-2 Tab. F.2.1 (XC4/XF1); kein Zuschlag für Dmax 16 bei Beton nach Eigenschaften (M-5, 28.10.2026; vorher 300)
      minLuft: 2.0,
    },
    stoffraum: {
      zementVol: 104.9, // 320 / 3.05
      wasserVol: 190.0,
      luftVol: 20.0,
      zmVol: 0.0,
      faserVol: 0.0,
      gesteinVol: 685.1, // 1000 - 104.9 - 190 - 20
    },
    massenTrocken: {
      gesteinGesamt: 1815.5, // 685.1 * 2.65
      m04: 817.0, // 45%
      m48: 363.1, // 20%
      m816: 635.4, // 35%
    },
    feuchteRechnung: {
      wasserAusGestein: 22.2, // Sand: 817*(2.5%) = 20.4L, 4/8: 363.1*(0.5%) = 1.8L
      zugabewasser: 167.8, // 190 - 22.2
      m04Feucht: 841.5,
      m48Feucht: 366.7,
      m816Feucht: 638.6,
    },
    frischbetonDichte: 2.335, // inkl. Kernwasser 9,1 kg (M-7, 28.10.2026; vorher 2,326 ohne Kernwasser)
    didaktischeHinweise: [
      'Mindestzementgehalt nach DIN 1045-2 Tabelle F.2.1 beträgt für XC4/XF1 280 kg/m³. Für Beton nach Eigenschaften hängt er nicht vom Größtkorn ab (Dmax = 16 mm ohne Zuschlag; die Erhöhung um 10 % bei 16 mm gilt nur für Standardbeton). Mit 320 kg/m³ ist die Forderung eingehalten.',
      'Der gewählte w/z-Wert von 190 / 320 = 0,594 hält das normative Limit von max. 0,60 sicher ein.',
      'Die Oberflächenfeuchte der Gesteinskörnungen (3,0% Gesamtfeuchte minus 0,5% Kernfeuchte) liefert 22,2 Liter Wasser aus den Zuschlägen, wodurch das tatsächliche Zugabewasser am Mischer auf 167,8 Liter reduziert werden muss.',
    ],
  },
  {
    id: 'bsp_lp_verkehr',
    titel: 'Beispiel 2: LP-Beton C30/37 für Brückenkappe & Straßendecke',
    kategorie: 'Verkehrsbau & Ingenieurbau (Frost-Tausalz)',
    normKonformitaet: 'DIN EN 206-1 / DIN 1045-2 (XC4, XD3, XF4)',
    bauteilTyp: 'Brückenkappe / Sprühnebelbereich mit Tausalz',
    beschreibung: 'Hochresistenter Luftporenbeton (LP) mit gezielt eingebrachten Mikroluftporen gegen Frost-Tausalz-Angriff. Demonstriert die automatische Gesteinsvolumen-Verdrängung, Sandanteilsreduktion nach Walz und die normative Erleichterung der Festigkeitsklasse von C50/60 auf C30/37.',
    zementArt: 'CEM I',
    zementFestigkeit: '42.5 N',
    zement: 340,
    wasser: 168,
    konsistenz: 'F3',
    fa: 0,
    sf: 0,
    hues: 0,
    biochar: 0,
    stahlfaser: 0,
    ppFaser: 0,
    zusatzmittel: 1.2,
    luft: 4.5,
    groesstkorn: 32,
    sandFraktion: '0/4',
    f04: 37, // Walz'sche Sandreduktion: 40% - 3% = 37%
    f48: 18,
    f816: 22,
    f1632: 23,
    feuchte04: 3.0,
    feuchte48: 1.0,
    feuchte816: 0.5,
    feuchte1632: 0.5,
    wa04: 0.5,
    wa48: 0.5,
    wa816: 0.5,
    wa1632: 0.5,
    expClasses: ['XC4', 'XD3', 'XF4'],
    lpSetting: 'mit_lp',
    normVorgaben: {
      druckfestigkeit: 'C30/37', // mit LP normativ zulässig statt C50/60!
      maxWz: 0.50,
      minZement: 320,
      minLuft: 4.0, // Dmax 32 mm: min. 4.0 Vol.-%
    },
    stoffraum: {
      zementVol: 109.7, // 340 / 3.10
      wasserVol: 168.0,
      luftVol: 45.0, // 4.5% Luft = 45 dm³!
      zmVol: 1.1, // 1.2 / 1.05
      faserVol: 0.0,
      gesteinVol: 676.2, // 1000 - 109.7 - 168 - 1.1 - 45
    },
    massenTrocken: {
      gesteinGesamt: 1792.0, // 676.2 * 2.65
      m04: 663.0, // 37%
      m48: 322.6, // 18%
      m816: 394.2, // 22%
      m1632: 412.2, // 23%
    },
    feuchteRechnung: {
      wasserAusGestein: 18.2,
      zugabewasser: 149.8,
      m04Feucht: 682.9,
      m48Feucht: 325.8,
      m816Feucht: 396.2,
      m1632Feucht: 414.3,
    },
    frischbetonDichte: 2.310, // inkl. Kernwasser 9,0 kg (M-7; vorher 2,301)
    didaktischeHinweise: [
      'Gesteinsverdrängung durch LP: Gegenüber Normalbeton (20 dm³ Luft) beanspruchen 45 dm³ Luftporen 25 dm³ zusätzlichen Raum. Dadurch sinkt die Gesteinsmasse um ca. 66 kg/m³!',
      'Kugellagereffekt & Wasserbedarf: Die mikroskopisch kleinen Luftporen (10–300 µm) wirken wie reibungsfreie Kugeln. Dadurch sinkt der Wasseranspruch für Konsistenz F3 von 175 L auf 168 L/m³.',
      'Sandanteilsreduktion nach Walz: Um eine Übermörtelung zu vermeiden, wurde der Sandanteil (0/4 mm) von normüblichen 40% um 3 M.-% auf 37% gesenkt und dem Grobkorn zugeschlagen.',
      'Normative Erleichterung: Ohne LP müsste XF4 als C50/60 ausgeführt werden (kaum praxistauglich). Mit min. 4,0% LP genügt C30/37 mit w/z ≤ 0,50.',
    ],
  },
  {
    id: 'bsp_hues_masse',
    titel: 'Beispiel 3: Massenbeton mit Hüttensandmehl (HüS)',
    kategorie: 'Wasserbau & Massenbauteile (Sohlplatten/Talsperren)',
    normKonformitaet: 'DIN EN 206-1 / DIN 1045-2 (XC2, XA1, LH-Zement)',
    bauteilTyp: 'Massive Bodenplatte (d = 2,50 m) im Grundwasser',
    beschreibung: 'Thermisch optimierter Massenbeton mit 100 kg/m³ Hüttensandmehl (HüS) zur drastischen Dämpfung der Hydratationswärme und Erzielung höchster Sulfatbeständigkeit.',
    zementArt: 'CEM I',
    zementFestigkeit: '42.5 N',
    zement: 240,
    wasser: 155,
    konsistenz: 'F3',
    fa: 0,
    sf: 0,
    hues: 100, // Hüttensandmehl
    biochar: 0,
    stahlfaser: 0,
    ppFaser: 0,
    zusatzmittel: 2.0,
    luft: 2.0,
    groesstkorn: 32,
    sandFraktion: '0/4',
    f04: 38,
    f48: 18,
    f816: 22,
    f1632: 22,
    feuchte04: 3.0,
    feuchte48: 1.0,
    feuchte816: 0.5,
    feuchte1632: 0.5,
    wa04: 0.5,
    wa48: 0.5,
    wa816: 0.5,
    wa1632: 0.5,
    expClasses: ['XC2', 'XA1'],
    lpSetting: 'ohne_lp',
    normVorgaben: {
      druckfestigkeit: 'C25/30',
      maxWz: 0.60,
      minZement: 280, // anrechenbarer Zementgehalt mit k=0.4: 240 + 0.4*100 = 280 kg
      minLuft: 2.0,
    },
    stoffraum: {
      zementVol: 77.4, // 240 / 3.10
      wasserVol: 155.0,
      luftVol: 20.0,
      zusatzstoffVol: 34.5, // HüS: 100 / 2.90
      zmVol: 1.9, // 2.0 / 1.05
      faserVol: 0.0,
      gesteinVol: 711.2, // 1000 - 77.4 - 34.5 - 155 - 1.9 - 20
    },
    massenTrocken: {
      gesteinGesamt: 1884.7, // 711.2 * 2.65
      m04: 716.2,
      m48: 339.2,
      m816: 414.6,
      m1632: 414.6,
    },
    feuchteRechnung: {
      wasserAusGestein: 19.6,
      zugabewasser: 135.4,
      m04Feucht: 737.7,
      m48Feucht: 342.6,
      m816Feucht: 416.7,
      m1632Feucht: 416.7,
    },
    frischbetonDichte: 2.391, // inkl. Kernwasser 9,4 kg (M-7; vorher 2,382)
    didaktischeHinweise: [
      'Latent-hydraulische Wirkung: Hüttensandmehl (HüS nach DIN EN 15167-1) reagiert verzögert mit dem bei der Klinkerhydratation gebildeten Portlandit Ca(OH)₂ zu festigkeitsbildenden C-S-H-Phasen.',
      'Wärmeentwicklung: Durch die Substitution von 100 kg Klinkerzement durch HüS wird die adiabatische Temperaturspitze im Bauteil um über 30% gedämpft, was schädliche Zwang- und Trennrisse wirksam verhindert.',
      'k-Wert Anrechnung: Mit k = 0,40 ergibt sich ein äquivalenter Zementgehalt von z_eq = 240 + 0,40 · 100 = 280 kg/m³, was exakt der normativen Mindestanforderung nach DIN 1045-2 entspricht.',
    ],
  },
  {
    id: 'bsp_stahlfaser_boden',
    titel: 'Beispiel 4: Stahlfaserbeton für beanspruchte Industrieböden',
    kategorie: 'Industriebau & Logistik (Verschleiß XM2)',
    normKonformitaet: 'DIN EN 206 / DAfStb-Richtlinie Stahlfaserbeton',
    bauteilTyp: 'Fugenarmer Hallenboden mit Gabelstaplerverkehr',
    beschreibung: 'Hochleistungsfähiger Stahlfaserbeton mit 35 kg/m³ Stahlfasern und Flugasche. Berücksichtigt die Verdrängung des Gesteinsvolumens durch Fasern und die Erhöhung der Nachrissbiegezugfestigkeit.',
    zementArt: 'CEM I',
    zementFestigkeit: '42.5 N',
    zement: 340,
    wasser: 165,
    konsistenz: 'F4',
    fa: 40,
    sf: 0,
    hues: 0,
    biochar: 0,
    stahlfaser: 35,
    ppFaser: 0,
    zusatzmittel: 2.5,
    luft: 1.5,
    groesstkorn: 16,
    sandFraktion: '0/4',
    f04: 45,
    f48: 25,
    f816: 30,
    f1632: 0,
    feuchte04: 3.0,
    feuchte48: 1.0,
    feuchte816: 0.5,
    feuchte1632: 0.5,
    wa04: 0.5,
    wa48: 0.5,
    wa816: 0.5,
    wa1632: 0.5,
    expClasses: ['XC3', 'XM2'],
    lpSetting: 'ohne_lp',
    normVorgaben: {
      druckfestigkeit: 'C35/45',
      maxWz: 0.45,
      minZement: 320,
      minLuft: 1.5,
    },
    stoffraum: {
      zementVol: 109.7, // 340 / 3.10
      wasserVol: 165.0,
      luftVol: 15.0,
      zusatzstoffVol: 18.2, // 40 / 2.20
      zmVol: 2.4, // 2.5 / 1.05
      faserVol: 4.5, // 35 / 7.85
      gesteinVol: 685.2, // 1000 - 109.7 - 18.2 - 165 - 2.4 - 15 - 4.5
    },
    massenTrocken: {
      gesteinGesamt: 1815.8,
      m04: 817.1,
      m48: 453.9,
      m816: 544.7,
    },
    feuchteRechnung: {
      wasserAusGestein: 22.7,
      zugabewasser: 142.3,
      m04Feucht: 841.6,
      m48Feucht: 458.5,
      m816Feucht: 547.5,
    },
    frischbetonDichte: 2.408, // inkl. Kernwasser 9,1 kg (M-7; vorher 2,403)
    didaktischeHinweise: [
      'Stoffraumwirkung der Fasern: 35 kg Stahlfasern mit einer Dichte von 7,85 kg/dm³ verdrängen 4,46 Liter Gesteinsvolumen im 1000-Liter-Stoffraum (entspricht ca. 11,8 kg Gesteinsmasse).',
      'Flugasche als rheologisches Schmiermittel: Die sphärischen Flugaschepartikel (Kugellagereffekt) kompensieren die Versteifung der Frischbetonmischung durch die sperrigen Stahlfasern.',
      'Verschleißklasse XM2: Der maximale Zementgehalt ist nach DIN 1045-2 zur Vermeidung von Absanden auf 360 kg/m³ begrenzt. Mit 340 kg/m³ Zement wird dieser Grenzwert sicher eingehalten.',
    ],
  },
  {
    id: 'bsp_vdz_b20_erstpruefung',
    titel: 'Beispiel 5: Erstprüfung C30/37 mit Eigenfeuchte (Rechenschema Zement-Merkblatt B 20)',
    kategorie: 'Lehrbeispiel nach dem Rechenschema VDZ / InformationsZentrum Beton',
    normKonformitaet: 'DIN EN 206-1 / DIN 1045-2 (XC4, XF1, F2, Dmax 16)',
    bauteilTyp: 'Außenbauteil mit Beregnung / Erstprüfung nach ZM B20',
    beschreibung: 'Lehrbeispiel zur Bestimmung der Betonzusammensetzung für 1 m³ verdichteten Frischbeton nach dem Rechenschema des Zement-Merkblatts Betontechnik B 20 (Ausgabe 2.2017, Abschn. 4 und 6); die Zahlenwerte sind eigene Annahmen und stehen nicht im Merkblatt.',
    zementArt: 'CEM II/A',
    zementFestigkeit: '32.5 R',
    zement: 318,
    wasser: 175,
    konsistenz: 'F2',
    fa: 0,
    sf: 0,
    hues: 0,
    biochar: 0,
    stahlfaser: 0,
    ppFaser: 0,
    zusatzmittel: 0,
    luft: 1.5,
    groesstkorn: 16,
    sandFraktion: '0/4',
    f04: 40,
    f48: 25,
    f816: 35,
    f1632: 0,
    feuchte04: 2.0,
    feuchte48: 1.0,
    feuchte816: 0.5,
    feuchte1632: 0.5,
    wa04: 0.5,
    wa48: 0.5,
    wa816: 0.5,
    wa1632: 0.5,
    expClasses: ['XC4', 'XF1'],
    rhoGestein: 2.60,
    lpSetting: 'ohne_lp',
    normVorgaben: {
      druckfestigkeit: 'C30/37',
      maxWz: 0.60,
      minZement: 300,
      minLuft: 1.5,
    },
    stoffraum: {
      zementVol: 104.3, // 318 / 3.05 = 104.26 dm³
      wasserVol: 175.0,
      luftVol: 15.0,
      zmVol: 0.0,
      faserVol: 0.0,
      gesteinVol: 705.7, // 1000 - 104.26 - 175 - 15 = 705.74 dm³
    },
    massenTrocken: {
      gesteinGesamt: 1834.9, // 705.74 * 2.60 (Rohdichte Gestein 2,60 kg/dm³ nach VDZ B20)
      m04: 734.0, // 40%
      m48: 458.7, // 25%
      m816: 642.2, // 35%
    },
    feuchteRechnung: {
      wasserAusGestein: 13.3, // 734,0·(2,0 − 0,5) % + 458,7·(1,0 − 0,5) % + 642,2·(0,5 − 0,5) %
      zugabewasser: 161.7,
      m04Feucht: 748.7,
      m48Feucht: 463.3,
      m816Feucht: 645.4,
    },
    frischbetonDichte: 2.337, // inkl. Kernwasser 9,2 kg (M-7; vorher 2,328)
    didaktischeHinweise: [
      'Rechenschema: Zement-Merkblatt Betontechnik B 20 „Zusammensetzung von Normalbeton“ (Ausgabe 2.2017): Stoffraumrechnung (Beispiel 4, Abschn. 6.2) und Zugabewasser = Gesamtwassermenge − Oberflächenfeuchte (Abschn. 4). Unabhängig nachgerechnet in tests/mischungBeispiel5.test.ts.',
      'Stoffraum-Gleichung: 1000 dm³ = (318 / 3,05) + (175 / 1,00) + V_gestein + 15 dm³ Poren => V_gestein = 705,74 dm³.',
      'Gesteinsmasse trocken: 705,74 dm³ · 2,60 kg/dm³ = 1834,9 kg/m³.',
      'w/z-Wert: 175 / 318 = 0,550 <= 0,60 (Grenzwert für XC4/XF1 nach DIN 1045-2, vgl. B 20 Tafel 2: max. w/z 0,60, min. z 280 kg/m³, C25/30).',
      'Zugabewasser am Mischer: Wirksam ist nur die Oberflächenfeuchte (Gesamtfeuchte minus Kernfeuchte 0,5 M.-%): 734,0 · 1,5 % + 458,7 · 0,5 % + 642,2 · 0 % = 13,3 L/m³. Das am Mischer zuzugebende Wasser sinkt damit von 175 L auf 161,7 L/m³; die Kernfeuchte (insgesamt 9,2 L/m³) bleibt in der Körnung gebunden.',
    ],
  },
];
