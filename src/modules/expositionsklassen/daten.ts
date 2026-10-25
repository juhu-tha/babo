// Ausgelagert aus src/modules/Expositionsklassen.tsx (AP 5.2)

// ============================================================================
// NORMATIVE DATENBANK: DIN EN 206:2021-06 & DIN 1045-2:2023-08 (Tab. F.2.1/F.2.2)
// Werte abgeglichen mit src/data/standards/din1045_2.ts
// ============================================================================

export interface NormExposureClass {
  code: string;
  family: 'X0' | 'XC' | 'XD' | 'XS' | 'XF' | 'XA' | 'XM';
  title: string;
  description: string;
  examples: string;
  maxWzEq: number | null; // null bedeutet keine normative Begrenzung
  minStrengthClass: string;
  minCement: number | null; // kg/m³ (DIN 1045-2, Tab. F.2.1/F.2.2)
  minAirContent?: {
    dmax32: number;
    dmax16: number;
    dmax8: number;
  };
  requiresAirEntrainment?: boolean;
  minCoverDurMm: number | null; // Betonstahl, DIN EN 1992-1-1/NA:2013-04 Tab. 4.4DE; null = keine eigene Anforderung
  specialNotes?: string;
}

// Strikte normative Expositionsklassen nach DIN 1045-2 Tabelle F.2.1 & F.2.2
export const NORMATIVE_EXPOSURE_CLASSES: NormExposureClass[] = [
  // X0: Kein Angriffsrisiko
  {
    code: 'X0',
    family: 'X0',
    title: 'Kein Angriffsrisiko',
    description: 'Beton ohne Bewehrung oder eingebettetes Metall ohne Frost, Abrieb oder chemischen Angriff; oder Beton mit Bewehrung in extrem trockener Umgebung.',
    examples: 'Unbewehrte Fundamente ohne Frost; unbewehrte Innenbauteile; bewehrter Beton in dauerhaft trockenen Innenräumen.',
    maxWzEq: null,
    minStrengthClass: 'C8/10',
    minCement: null,
    minCoverDurMm: null,
    specialNotes: 'Bei bewehrtem Beton in Innenräumen gilt i. d. R. mindestens XC1.'
  },

  // XC: Bewehrungskorrosion durch Karbonatisierung
  {
    code: 'XC1',
    family: 'XC',
    title: 'Trocken oder ständig nass',
    description: 'Bauteile in Innenräumen mit normaler Wohn- oder Büroluftfeuchte; oder Bauteile, die dauernd unter Wasser getaucht sind.',
    examples: 'Innenräume von Wohnungen und Büros; ständig unter Wasser stehende Bauteile (Schwimmbeckenunterbauten).',
    maxWzEq: 0.75,
    minStrengthClass: 'C16/20',
    minCement: 240,
    minCoverDurMm: 10,
    specialNotes: 'Δc_dev darf bei XC1 auf 10 mm verringert werden (DIN EN 1992-1-1/NA).'
  },
  {
    code: 'XC2',
    family: 'XC',
    title: 'Nass, selten trocken',
    description: 'Teile von Wasserbehältern; Gründungsbauteile; Bauteile, die langzeitig Wasser oder feuchtem Boden ausgesetzt sind.',
    examples: 'Fundamente im feuchten Erdreich (ohne Frost); Schachtbauwerke; Wasserbehälter.',
    maxWzEq: 0.75,
    minStrengthClass: 'C16/20',
    minCement: 240,
    minCoverDurMm: 20,
    specialNotes: 'Anforderungen an den Beton wie XC1 (DIN 1045-2).'
  },
  {
    code: 'XC3',
    family: 'XC',
    title: 'Mäßige Feuchte',
    description: 'Bauteile, zu denen die Außenluft häufigen Zutritt hat; Innenräume mit mäßiger bis hoher Luftfeuchtigkeit.',
    examples: 'Offene Hallen, Vordächer, Viehställe, gewerbliche Großküchen, Hallenbäder.',
    maxWzEq: 0.65,
    minStrengthClass: 'C20/25',
    minCement: 260,
    minCoverDurMm: 20
  },
  {
    code: 'XC4',
    family: 'XC',
    title: 'Wechselnd nass und trocken',
    description: 'Außenbauteile mit direkter Beregnung und anschließender Austrocknung.',
    examples: 'Außenwände, Balkone, frei bewitterte Stützen und Fassadenelemente.',
    maxWzEq: 0.60,
    minStrengthClass: 'C25/30',
    minCement: 280,
    minCoverDurMm: 25
  },

  // XD: Chloride aus Taumitteln (außer Meerwasser)
  {
    code: 'XD1',
    family: 'XD',
    title: 'Mäßige Feuchte (Sprühnebel)',
    description: 'Bauteiloberflächen, die chloridhaltigem Sprühnebel ausgesetzt sind.',
    examples: 'Wände und Decken von Garagen und Parkdecks im Sprühnebelbereich; Straßenstützwände im Sprühbereich.',
    maxWzEq: 0.55,
    minStrengthClass: 'C30/37',
    minCement: 300,
    minCoverDurMm: 40
  },
  {
    code: 'XD2',
    family: 'XD',
    title: 'Nass, selten trocken (Sole)',
    description: 'Bauteile, die chloridhaltigen Industrieabwässern oder Solebädern ausgesetzt sind.',
    examples: 'Schwimmbecken mit Sole/Meerwasserzusatz; Industrieanlagen mit salzhaltigem Brauchwasser.',
    maxWzEq: 0.50,
    minStrengthClass: 'C35/45',
    minCement: 320,
    minCoverDurMm: 40,
    specialNotes: 'Bei Luftporenbeton (z. B. wegen gleichzeitiger XF-Anforderung) ist eine Festigkeitsklasse niedriger zulässig (DIN 1045-2:2023-08, Fußnote zu Tab. F.1; LP-Beton = Betonklasse BK-E).'
  },
  {
    code: 'XD3',
    family: 'XD',
    title: 'Wechselnd nass und trocken (Direkte Taumittel)',
    description: 'Teile von Brücken und Straßen, die direkt mit taumittelhaltigem Spritzwasser beaufschlagt werden; Parkdecks.',
    examples: 'Fahrbahndecken von Parkhäusern ohne Oberflächenschutz; Brückenkappen; Spritzwasserbereiche von Autobahnstützwänden.',
    maxWzEq: 0.45,
    minStrengthClass: 'C35/45',
    minCement: 320,
    minCoverDurMm: 40,
    specialNotes: 'Für befahrene Parkdecks: rissvermeidende Bauweise oder dauerhafter lokaler Rissschutz (rissüberbrückende Beschichtung nach TR Instandhaltung) und Instandhaltungsplan nach TR Instandhaltung (DIN 1045-2:2023-08).'
  },

  // XS: Chloride aus Meerwasser
  {
    code: 'XS1',
    family: 'XS',
    title: 'Salzhaltige Luft (Küstennähe)',
    description: 'Bauteile in Küstennähe, die salzhaltiger Meeresluft ausgesetzt sind.',
    examples: 'Fassaden und Tragwerke an der Küste (Entfernung < 1 km zum Meer).',
    maxWzEq: 0.55,
    minStrengthClass: 'C30/37',
    minCement: 300,
    minCoverDurMm: 40
  },
  {
    code: 'XS2',
    family: 'XS',
    title: 'Ständig unter Meerwasser',
    description: 'Teile von Meeresbauwerken dauerhaft untergetaucht.',
    examples: 'Pfeiler und Gründungen im Hafenbecken unter dem Niedrigwasserstand.',
    maxWzEq: 0.50,
    minStrengthClass: 'C35/45',
    minCement: 320,
    minCoverDurMm: 40
  },
  {
    code: 'XS3',
    family: 'XS',
    title: 'Tide-, Spritz- und Brandungszone',
    description: 'Bauteile im Gezeitenwechsel und Brandungsbereich von Meerwasser.',
    examples: 'Kaimauern, Molenköpfe, Leuchtturmfundamente.',
    maxWzEq: 0.45,
    minStrengthClass: 'C35/45',
    minCement: 320,
    minCoverDurMm: 40
  },

  // XF: Frost- und Frost-Tausalz-Angriff
  {
    code: 'XF1',
    family: 'XF',
    title: 'Mäßige Sättigung ohne Taumittel',
    description: 'Vertikale Außenflächen, die Regen und Frost ausgesetzt sind.',
    examples: 'Fassadenwände, Außenstützen ohne Taumitteleinwirkung.',
    maxWzEq: 0.60,
    minStrengthClass: 'C25/30',
    minCement: 280,
    minCoverDurMm: null,
    specialNotes: 'Keine künstlichen Luftporen erforderlich.'
  },
  {
    code: 'XF2',
    family: 'XF',
    title: 'Mäßige Sättigung mit Taumittel',
    description: 'Vertikale Bauteile im Sprühnebelbereich von Verkehrsflächen mit Tausalzeinsatz.',
    examples: 'Spritzwasserbereich von Stützwänden an Straßen; Brückenpfeiler im Sprühbereich.',
    maxWzEq: 0.55,
    minStrengthClass: 'C25/30',
    minCement: 300,
    requiresAirEntrainment: true,
    minAirContent: { dmax32: 4.0, dmax16: 4.5, dmax8: 5.5 },
    minCoverDurMm: null,
    specialNotes: 'Alternativ ohne LP: w/z ≤ 0,50, C35/45, z ≥ 320 kg/m³ (DIN 1045-2).'
  },
  {
    code: 'XF3',
    family: 'XF',
    title: 'Hohe Sättigung ohne Taumittel',
    description: 'Horizontale Außenbauteile mit Wasseransammlung bei Frost (ohne Tausalze).',
    examples: 'Frei bewitterte Decken, Brüstungsabdeckungen, Wehre und Klärbecken im Frostbereich.',
    maxWzEq: 0.55,
    minStrengthClass: 'C25/30',
    minCement: 300,
    requiresAirEntrainment: true,
    minAirContent: { dmax32: 4.0, dmax16: 4.5, dmax8: 5.5 },
    minCoverDurMm: null,
    specialNotes: 'Alternativ ohne LP: w/z ≤ 0,50, C35/45, z ≥ 320 kg/m³ (DIN 1045-2).'
  },
  {
    code: 'XF4',
    family: 'XF',
    title: 'Hohe Sättigung mit Taumittel',
    description: 'Horizontale Bauteile mit direkter Tausalzbeaufschlagung und hoher Wassersättigung.',
    examples: 'Direkt befahrene Fahrbahnen von Straßen und Brücken; Flugbetriebsflächen; Parkdecks.',
    maxWzEq: 0.50,
    minStrengthClass: 'C30/37',
    minCement: 320,
    requiresAirEntrainment: true,
    minAirContent: { dmax32: 4.0, dmax16: 4.5, dmax8: 5.5 },
    minCoverDurMm: null,
    specialNotes: 'Nur als Luftporenbeton zulässig (DIN 1045-2).'
  },

  // XA: Chemischer Angriff nach DIN EN 206 Tabelle 2
  {
    code: 'XA1',
    family: 'XA',
    title: 'Chemisch schwach angreifend',
    description: 'Natürliche Böden und Grundwässer mit schwachem Säure- oder Sulfatgehalt.',
    examples: 'Fundamente in schwach sauren Böden (pH 5,5–6,5) oder mäßigem Sulfatgehalt (200–600 mg/l SO4).',
    maxWzEq: 0.60,
    minStrengthClass: 'C25/30',
    minCement: 280,
    minCoverDurMm: null
  },
  {
    code: 'XA2',
    family: 'XA',
    title: 'Chemisch mäßig angreifend',
    description: 'Böden und Grundwässer mit mäßigem chemischen Angriff sowie sulfatreiche Wässer.',
    examples: 'Klärbecken, Güllebehälter, Erdbauwerke in sulfatreichen Böden (SO4: 600–3000 mg/l im Wasser).',
    maxWzEq: 0.50,
    minStrengthClass: 'C35/45',
    minCement: 320,
    minCoverDurMm: null,
    specialNotes: 'Bei SO₄²⁻ > 600 mg/l im Wasser bzw. > 3 000 mg/kg im Boden: SR-Zement; bis 1 500 mg/l alternativ Zement-Flugasche-Gemisch (DIN 1045-2:2023-08; Flugascheanteil an z + f ≥ 30 % bzw. ≥ 10 % je nach Zementart).'
  },
  {
    code: 'XA3',
    family: 'XA',
    title: 'Chemisch stark angreifend',
    description: 'Stark saure Böden (pH 4,0–4,5) oder stark sulfathaltiges Grundwasser (3000–6000 mg/l).',
    examples: 'Industrieabwasserkanäle, Kühltürme, Biogasanlagen, Silos.',
    maxWzEq: 0.45,
    minStrengthClass: 'C35/45',
    minCement: 320,
    minCoverDurMm: null,
    specialNotes: 'SR-Zement bei Sulfatangriff; zusätzlich Schutz des Betons oder Gutachten erforderlich (DIN 1045-2).'
  },

  // XM: Mechanischer Verschleiß nach DIN 1045-2
  {
    code: 'XM1',
    family: 'XM',
    title: 'Mäßige Verschleißbeanspruchung',
    description: 'Flächen mit luftbereiftem Verkehr bis 30 kN Fahrzeuggesamtgewicht.',
    examples: 'Garagen, Parkdecks, Zufahrten von Wohnanlagen.',
    maxWzEq: 0.55,
    minStrengthClass: 'C30/37',
    minCement: 300,
    minCoverDurMm: null
  },
  {
    code: 'XM2',
    family: 'XM',
    title: 'Schwere Verschleißbeanspruchung',
    description: 'Flächen befahren von luft- oder vollgummibereiften Gabelstaplern bis 90 kN.',
    examples: 'Industriehallenböden mit regelmäßigem Gabelstaplerverkehr.',
    maxWzEq: 0.55,
    minStrengthClass: 'C30/37',
    minCement: 300,
    minCoverDurMm: null,
    specialNotes: 'Mit Oberflächenbehandlung (z. B. Vakuumieren und Flügelglätten); ohne: w/z ≤ 0,45, C35/45, z ≥ 320 kg/m³.'
  },
  {
    code: 'XM3',
    family: 'XM',
    title: 'Sehr schwere Verschleißbeanspruchung',
    description: 'Flächen mit Kettenfahrzeugen, Stahlrollen-Hubwagen oder extremem Schleifabrieb.',
    examples: 'Panzerhallen, Umschlaghallen für Schrott, Holzbringungsanlagen.',
    maxWzEq: 0.45,
    minStrengthClass: 'C35/45',
    minCement: 320,
    minCoverDurMm: null,
    specialNotes: 'Hartstoffe nach DIN 1100 erforderlich.'
  }
];

// Chemische Grenzwerte nach DIN EN 206 Tabelle 2
export const CHEMICAL_LIMITS_XA = [
  {
    stoff: 'Sulfat (SO₄²⁻) im Grundwasser',
    einheit: 'mg/l',
    xa1: '200 bis 600',
    xa2: '600 bis 3.000 (SR-Zement)',
    xa3: '3.000 bis 6.000 (SR-Zement + Schutz)',
    pruefnorm: 'DIN EN 196-2 / DIN 38405-5'
  },
  {
    stoff: 'pH-Wert im Grundwasser',
    einheit: 'pH',
    xa1: '5,5 bis 6,5',
    xa2: '4,5 bis 5,5',
    xa3: '4,0 bis 4,5',
    pruefnorm: 'DIN EN ISO 10523'
  },
  {
    stoff: 'Kalklösende Kohlensäure (CO₂)',
    einheit: 'mg/l',
    xa1: '15 bis 40',
    xa2: '40 bis 100',
    xa3: '> 100 bis Sättigung',
    pruefnorm: 'DIN 38404-10'
  },
  {
    stoff: 'Ammonium (NH₄⁺)',
    einheit: 'mg/l',
    xa1: '15 bis 30',
    xa2: '30 bis 60',
    xa3: '60 bis 100',
    pruefnorm: 'DIN 38406-5'
  },
  {
    stoff: 'Magnesium (Mg²⁺)',
    einheit: 'mg/l',
    xa1: '300 bis 1.000',
    xa2: '1.000 bis 3.000',
    xa3: '> 3.000 bis Sättigung',
    pruefnorm: 'DIN EN ISO 7980'
  },
  {
    stoff: 'Sulfat (SO₄²⁻) im Boden',
    einheit: 'mg/kg (getrocknet)',
    xa1: '2.000 bis 3.000',
    xa2: '3.000 bis 12.000 (SR-Zement)',
    xa3: '12.000 bis 24.000 (SR-Zement + Schutz)',
    pruefnorm: 'DIN EN 196-2'
  }
];

// Feuchtigkeitsklassen für Alkali-Kieselsäure-Reaktion (AKR) nach Alkali-Richtlinie / DIN 1045-2 Anhang D
export const MOISTURE_CLASSES_AKR = [
  {
    code: 'WO',
    title: 'Trocken',
    description: 'Beton, der nach dem Erhärten dauerhaft trocken bleibt (relative Luftfeuchtigkeit der Umgebungsluft dauerhaft unter 80 %).',
    examples: 'Innenbauteile von Wohn- und Bürogebäuden ohne Feuchtebeanspruchung.',
    anforderung: 'Keine vorbeugenden Maßnahmen gegen AKR erforderlich. Alle Gesteinskörnungen zugelassen.'
  },
  {
    code: 'WF',
    title: 'Feucht',
    description: 'Beton, der während der Nutzung häufig oder langzeitig feucht ist.',
    examples: 'Ungeschützte Außenbauteile (Fassaden, Brüstungen), Feuchträume, erdberührte Bauteile (Fundamente).',
    anforderung: 'Gesteinskörnung der Alkali-Empfindlichkeitsklasse E I; bei Klasse E II Zemente mit niedrigem wirksamen Alkaligehalt (NA-Zemente nach DIN 1164).'
  },
  {
    code: 'WA',
    title: 'Feucht + Alkalizufuhr von außen',
    description: 'Beton, der häufig feucht ist und zusätzlich Alkalien (insbesondere Taumittel oder Meerwasser) von außen aufnimmt.',
    examples: 'Direkt befahrene Parkdecks, Brückenkappen, Straßenbeläge, Spritzwasserbereiche an Straßen, Meeresbauwerke.',
    anforderung: 'Strengste Einstufung: Gesteinskörnung E I oder E II-S mit nachgewiesenem Eignungsnachweis; NA-Zement obligatorisch.'
  },
  {
    code: 'WS',
    title: 'Feucht + Taumittel + dynamische Beanspruchung',
    description: 'Unbeschichtete Betonfahrbahndecken auf Bundesautobahnen und Flugbetriebsflächen mit extrem hoher Taumittelbeaufschlagung und hoher Verkehrsbelastung.',
    examples: 'Autobahn-Betondecken, Rollbahnen.',
    anforderung: 'Besondere bauaufsichtliche Zulassung, 60 °C-Betonversuch (VDZ-Klimakammerverfahren) zum Nachweis der AKR-Beständigkeit.'
  }
];

// ============================================================================
// INTERAKTIVE GRAFISCHE DARSTELLUNG: GEBÄUDESCHNITT & BETONDECKUNG (EC2)
// DIN EN 206 / DIN 1045-2 / DIN EN 1992-1-1 (Eurocode 2)
// ============================================================================

export interface BuildingZoneInfo {
  id: string;
  title: string;
  subtitle: string;
  classes: string[];
  feuchteklasse: 'WO' | 'WF' | 'WA' | 'WS';
  minStrength: string;
  maxWz: number;
  minCement: number;
  cMinDur: number;
  cNom: number;
  mechanism: string;
  practicalTips: string;
  normRef: string;
}

export const BUILDING_ZONES: BuildingZoneInfo[] = [
  {
    id: 'tiefgarage',
    title: 'Tiefgaragen-Bodenplatte & Fahrgasse',
    subtitle: 'Chlorideintrag durch PKW-Schneematsch, Spritzwasser & Rollreibung',
    classes: ['XD3', 'XF4', 'XM1'],
    feuchteklasse: 'WA',
    minStrength: 'C35/45',
    maxWz: 0.45,
    minCement: 320,
    cMinDur: 40,
    cNom: 55,
    mechanism: 'Lochfraßkorrosion durch Tausalz-Chloride ohne pH-Absenkung + Frost-Tau-Skalierung + Schleifabrieb von PKW-Reifen. AKR-Gefahr durch ständige Alkalizufuhr (Feuchteklasse WA).',
    practicalTips: 'Zusätzliche Schutzmaßnahmen für befahrene Flächen planen (XD3: rissvermeidende Bauweise oder dauerhafter lokaler Rissschutz nach TR Instandhaltung; mit vollflächigem Oberflächenschutz XD1; Instandhaltungsplan erforderlich). AKR: Maßnahmen nach Alkali-Richtlinie für Feuchtigkeitsklasse WA.',
    normRef: 'DIN 1045-2 Tab. F.2.2 / DAfStb-Heft 600'
  },
  {
    id: 'balkon',
    title: 'Auskragender Balkon & Vordach',
    subtitle: 'Direkter Schlagregen, zyklische Trocknung & Frost ohne Enteisungsmittel',
    classes: ['XC4', 'XF1'],
    feuchteklasse: 'WF',
    minStrength: 'C25/30',
    maxWz: 0.60,
    minCement: 280,
    cMinDur: 25,
    cNom: 40,
    mechanism: 'Wechselnde Durchfeuchtung beschleunigt die Karbonatisierung der oberen Zugbewehrung. Mäßige Frostbeanspruchung bei normaler Wassersättigung.',
    practicalTips: 'Gefälle >= 1,5 % zur raschen Entwässerung einplanen. Rissbreite w_k <= 0,3 mm. Auf thermische Trennung (Isokorb) zur Vermeidung von Wärmebrücken achten.',
    normRef: 'DIN 1045-2 Tab. F.2.1 / DIN EN 1992-1-1'
  },
  {
    id: 'dach',
    title: 'Flachdach, Attika & Dachterrasse',
    subtitle: 'Horizontale Freibewitterung, Pfützenbildung & Frost mit hoher Sättigung',
    classes: ['XC4', 'XF3'],
    feuchteklasse: 'WF',
    minStrength: 'C25/30',
    maxWz: 0.55,
    minCement: 300,
    cMinDur: 25,
    cNom: 40,
    mechanism: 'Starke Durchfeuchtung durch stehendes Wasser führt bei Frosteinbruch zu hohem hydrostatischem Porenwasserdruck ohne Taumittel (XF3).',
    practicalTips: 'Gefälle zur Entwässerung einplanen; Abdichtung nach DIN 18531. XF3 verlangt LP-Beton oder ohne LP w/z ≤ 0,50 und C35/45.',
    normRef: 'DIN 1045-2 Tab. F.2.1 / DIN 18531'
  },
  {
    id: 'rampe',
    title: 'Freie Tiefgaragen-Einfahrtsrampe',
    subtitle: 'Direkte Taumittelstreuung, Frost-Tau-Wechsel & dynamischer Anfahr- und Bremsabrieb',
    classes: ['XD3', 'XF4', 'XM2'],
    feuchteklasse: 'WA',
    minStrength: 'C35/45',
    maxWz: 0.45,
    minCement: 320,
    cMinDur: 40,
    cNom: 55,
    mechanism: 'Extremer Kombinationsangriff: Taumitteleinsatz im Winterdienst ruft osmotischen Kälteschock hervor; Anfahren am Berg verursacht mechanischen Scherabrieb.',
    practicalTips: 'XF4: Luftporenbeton erforderlich. XM2: Oberflächenbehandlung des Betons (sonst w/z ≤ 0,45 / C35/45).',
    normRef: 'DIN 1045-2 Tab. F.2.2 / ZTV-ING'
  },
  {
    id: 'innen',
    title: 'Wohn- & Büroräume (Decken, Wände, Stützen)',
    subtitle: 'Trockenes Innenraumklima (RH 30–65 %), keine Chloride, frostfrei',
    classes: ['XC1'],
    feuchteklasse: 'WO',
    minStrength: 'C16/20',
    maxWz: 0.75,
    minCement: 240,
    cMinDur: 10,
    cNom: 20,
    mechanism: 'Wegen geringer Porenfeuchte ist die elektrolytische Korrosionsgeschwindigkeit vernachlässigbar gering. Niedrigste Schutzanforderung im Hochbau.',
    practicalTips: 'Statisch oft C20/25 oder C25/30. c_nom = 10 mm (c_min,dur) + 10 mm (Δc_dev bei XC1) = 20 mm; maßgebend kann c_min,b (Stabdurchmesser) sein.',
    normRef: 'DIN 1045-2 Tab. F.2.1 / DIN EN 1992-1-1'
  },
  {
    id: 'fundament',
    title: 'Kelleraußenwand & Fundamentplatte im Baugrund',
    subtitle: 'Dauerfeuchtes Erdreich (langzeitig nass), Grundwasser mit leichtem Sulfat (XA1)',
    classes: ['XC2', 'XA1'],
    feuchteklasse: 'WF',
    minStrength: 'C25/30',
    maxWz: 0.60,
    minCement: 280,
    cMinDur: 20,
    cNom: 35,
    mechanism: 'Ständige Feuchte verhindert Karbonatisierung mangels Sauerstoffzutritt, jedoch chemischer Angriff durch Porenwassersulfate und Huminsäuren.',
    practicalTips: 'Betonieren gegen unebene Flächen: Vorhaltemaß Δc_dev nach DIN EN 1992-1-1/NA, 4.4.1.3(4) um das Differenzmaß der Unebenheit, mindestens um 20 mm erhöhen (z. B. unebene Sauberkeitsschicht); bei Betonieren direkt gegen Baugrund um 50 mm.',
    normRef: 'DIN 1045-2 Tab. F.2.1 / WU-Richtlinie DAfStb'
  },
  {
    id: 'industrie',
    title: 'Industrieboden / Schacht / Auffangbecken',
    subtitle: 'Chemischer Angriff (Sulfate 600–3.000 mg/l) & schwerer Flurförderzeug-Verkehr',
    classes: ['XA2', 'XM2'],
    feuchteklasse: 'WF',
    minStrength: 'C35/45',
    maxWz: 0.50,
    minCement: 320,
    cMinDur: 20,
    cNom: 35,
    mechanism: 'Sulfationen reagieren mit Calciumaluminathydraten zu Ettringit unter starkem Quelldruck (Sulfattreiben). Gabelstapler führen zu hohem Rollabrieb.',
    practicalTips: 'Bei SO₄²⁻ > 600 mg/l im Wasser SR-Zement nach DIN 1045-2. XM2: Oberflächenbehandlung; Hartstoffe nach DIN 1100 bei hoher Beanspruchung.',
    normRef: 'DIN 1045-2 Tab. F.2.2 & DIN EN 197-1'
  },
  {
    id: 'kueste',
    title: 'Kaimauer & Gezeitenzone (Meerwasser)',
    subtitle: 'Meerwasserchlorid-Sprühnebel, Brandung, Tidenhub & Frostwechsel',
    classes: ['XS3', 'XF4'],
    feuchteklasse: 'WA',
    minStrength: 'C35/45',
    maxWz: 0.45,
    minCement: 320,
    cMinDur: 40,
    cNom: 55,
    mechanism: 'Massive Zufuhr von Meerwasserchloriden in der Gezeitenzone kombiniert mit Frost-Tau-Angriff. Zerstörung des Passivfilms bei C_crit >= 0,40 % bezogen auf Zementmasse.',
    practicalTips: 'c_min,dur = 40 mm, c_nom = 55 mm (DIN EN 1992-1-1/NA). Dichter Zementstein, z. B. mit hüttensandreichen Zementen (CEM III/A, III/B).',
    normRef: 'DIN 1045-2 Tab. F.2.1 & DIN EN 1992-1-1/NA'
  }
];
