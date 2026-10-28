import React, { useState, useMemo } from 'react';
import { 
  Scale, Layers, ShieldCheck, FileText, ArrowRight,
  Search, Calendar, Globe, Info, ChevronDown, ChevronUp, HardHat, Sparkles
} from 'lucide-react';
import { BlockMath } from 'react-katex';
import { AuswahlGruppe, ReiterLeiste, alsOption, alsReiter, reiterPanel } from './Auswahlgruppe';

export type HierarchyLevel = 
  | 'all'
  | 'ebene_1_strategie'
  | 'ebene_2_gebaeude'
  | 'ebene_3_baustoffe'
  | 'ebene_4_bepreisung'
  | 'ebene_5_finanzen';

export type TargetAudience = 
  | 'all'
  | 'bestand'
  | 'baustoffe'
  | 'planer'
  | 'finanzen';

export type ViewMode = 'kaskade' | 'diagramm' | 'timeline' | 'synopse';

export interface LegalInstrument {
  id: string;
  shortName: string;
  fullName: string;
  norm: string;
  level: 'ebene_1_strategie' | 'ebene_2_gebaeude' | 'ebene_3_baustoffe' | 'ebene_4_bepreisung' | 'ebene_5_finanzen';
  levelLabel: string;
  legalType: 'EU-Verordnung (unmittelbar)' | 'EU-Richtlinie (national umzusetzen)' | 'Deutsches Bundesgesetz' | 'Bundesverordnung' | 'EU-/Finanz-Standard' | 'Gesetzesinitiative';
  audiences: Array<'bestand' | 'baustoffe' | 'planer' | 'finanzen'>;
  primaryTarget: string;
  leadQuote: string;
  coreSummary: string;
  keyDuties: string[];
  impactOnMaterials: string;
  milestones: { year: string; text: string }[];
  formula?: {
    math: string;
    explanation: string;
    source: string;
  };
  linkPlaceholder?: string;
}

export const LEGAL_INSTRUMENTS: LegalInstrument[] = [
  // EBENE 1: Strategischer Überbau & Klimaziele
  {
    id: 'green_deal',
    shortName: 'European Green Deal',
    fullName: 'Der europäische Grüne Deal & Renovierungswelle',
    norm: 'Mitteilung COM(2019) 640 final & Renovierungswelle COM(2020) 662',
    level: 'ebene_1_strategie',
    levelLabel: 'Ebene 1: Strategischer Überbau',
    legalType: 'EU-/Finanz-Standard',
    audiences: ['bestand', 'baustoffe', 'planer', 'finanzen'],
    primaryTarget: 'Gesamte EU-Wirtschaft, Gebäude- und Bausektor',
    leadQuote: 'Europa bis 2050 zum ersten klimaneutralen Kontinent machen und die jährliche Sanierungsrate verdoppeln.',
    coreSummary: 'Der Grüne Deal ist die politische Wachstumsstrategie der Europäischen Union zur Transformation hin zu einer ressourceneffizienten, kreislauforientierten und emissionsfreien Wirtschaft. Kernstück für den Bausektor ist die "Renovierungswelle" (Renovation Wave), die eine Verdopplung der energetischen Sanierungsquote von rund 1 % auf mindestens 2 % pro Jahr bis 2030 anstrebt.',
    keyDuties: [
      'Mindestens 35 Millionen Bestandsgebäude in der EU bis 2030 energetisch tiefensanieren.',
      'Forcierung des zirkulären Bauens durch den Circular Economy Action Plan (CEAP).',
      'Bekämpfung von Energiearmut durch vorrangige Sanierung der schlechtesten Gebäude (Worst Performing Buildings).',
      'Schaffung geschlossener Materialkreisläufe und Reduktion der Rohstoffabhängigkeit.'
    ],
    impactOnMaterials: 'Definiert den Paradigmenwechsel vom linearen Verbrauchsmodell ("Take-Make-Waste") zur Kreislaufwirtschaft. Fordert Rezyklateinsatz, Langlebigkeit und Rückbaubarkeit als künftige Zulassungsvoraussetzung für Bauprodukte.',
    milestones: [
      { year: '2019', text: 'Beschluss des European Green Deal durch die EU-Kommission.' },
      { year: '2020', text: 'Start der "Renovierungswelle für Europa" mit Fokus auf Quartierssanierung.' },
      { year: '2030', text: 'Verdopplung der Sanierungsrate; 35 Mio. sanierte Gebäude.' },
      { year: '2050', text: 'Vollständige Netto-Treibhausgasneutralität der gesamten EU.' }
    ]
  },
  {
    id: 'eu_klimagesetz',
    shortName: 'Europäisches Klimagesetz',
    fullName: 'Europäisches Klimagesetz (European Climate Law)',
    norm: 'Verordnung (EU) 2021/1119',
    level: 'ebene_1_strategie',
    levelLabel: 'Ebene 1: Strategischer Überbau',
    legalType: 'EU-Verordnung (unmittelbar)',
    audiences: ['bestand', 'baustoffe', 'planer', 'finanzen'],
    primaryTarget: 'EU-Mitgliedstaaten und alle Wirtschaftsbranchen',
    leadQuote: 'Rechtlich verbindliches Netto-Null-Emissionsziel bis 2050 und -55 % bis 2030.',
    coreSummary: 'Das Klimagesetz überführt die politischen Zielsetzungen des Green Deals in hartes, einklagbares Unionsrecht. Es verpflichtet die EU-Institutionen und Mitgliedstaaten, die Treibhausgasemissionen bis 2030 um mindestens 55 % gegenüber 1990 zu senken und bis 2050 Netto-Null zu erreichen. Es bildet das juristische Dach für alle sektoralen Fachgesetze (EPBD, ETS, BauPVO).',
    keyDuties: [
      'Verbindliche Einhaltung des Unions-Treibhausgasbudgets für 2030–2050.',
      'Sektorübergreifende Überprüfung der nationalen Energie- und Klimapläne (NECPs).',
      'Gebäudesektor muss bis 2030 mindestens 60 % seiner betrieblichen Emissionen gegenüber 2015 einsparen.',
      'Festlegung eines wissenschaftlich fundierten Zwischenziels für 2040 (Empfehlung: -90 % THG).'
    ],
    impactOnMaterials: 'Macht CO₂ zu einem knappen und teuren Wirtschaftsgut. Zwingt Baustoffhersteller zu radikalen Dekarbonisierungsfahrplänen bei der Klinker-, Stahl- und Ziegelherstellung.',
    milestones: [
      { year: '2021', text: 'Inkrafttreten der VO (EU) 2021/1119 mit 2030-Ziel von -55 %.' },
      { year: '2024', text: 'Vorschlag für das EU-Klimaziel 2040 (-90 % Netto-THG).' },
      { year: '2030', text: 'Strikte Überprüfung des 55-%-Zwischenziels.' },
      { year: '2050', text: 'Rechtliche Pflicht zur Erreichung von Netto-Negativ-Emissionen nach 2050.' }
    ],
    formula: {
      math: '\\Delta \\text{GHG}_{\\text{EU}, 2030} \\le -55\\% \\quad (\\text{Ref. } 1990)',
      explanation: 'Verbindliche prozentuale Reduktion der Netto-Treibhausgasemissionen der EU-27 bis zum Jahr 2030.',
      source: 'VO (EU) 2021/1119 Art. 4'
    }
  },
  {
    id: 'fit_for_55',
    shortName: 'Fit for 55 Paket',
    fullName: 'Fit-for-55 Gesetzes- & Maßnahmenpaket',
    norm: 'Legislativpaket COM(2021) 550 final (14 Einzelrechtsakte)',
    level: 'ebene_1_strategie',
    levelLabel: 'Ebene 1: Strategischer Überbau',
    legalType: 'EU-Verordnung (unmittelbar)',
    audiences: ['bestand', 'baustoffe', 'planer', 'finanzen'],
    primaryTarget: 'Gebäude, Industrie, Energieerzeugung, Mobilität, Außenhandel',
    leadQuote: 'Das legislative Vollzugspaket, das europäische Klimaziele in konkrete Verordnungen und Richtlinien gießt.',
    coreSummary: 'Fit for 55 ist das umfangreichste klimapolitische Regelungspaket in der Geschichte der EU. Es bündelt die zeitgleiche Revision von Schlüsseldirektiven: Revision der Gebäuderichtlinie (EPBD), Einführung des EU-ETS II für Gebäude und Verkehr, Start des CO₂-Grenzausgleichs CBAM, Anhebung der Erneuerbare-Energien-Quote (RED III auf 42,5 %) und Verschärfung der Energieeffizienzrichtlinie (EED).',
    keyDuties: [
      'Synchronisation von ordnungsrechtlichen Hüllstandards (EPBD) mit marktbasierten CO₂-Preisen (ETS II).',
      'Vermeidung von Carbon Leakage bei heimischen Baustoffen durch CBAM.',
      'Verpflichtender Ausbau erneuerbarer Wärme und Fernwärmenetze über RED III.',
      'Jährliche Senkung des Endenergieverbrauchs um 1,49 % im Schnitt über die EED.'
    ],
    impactOnMaterials: 'Verbindet Baustoffpreise direkt mit ihrem CO₂-Rucksack. Importierte und heimische Materialien werden gleichermaßen dem europäischen CO₂-Preissystem unterworfen.',
    milestones: [
      { year: '2021', text: 'Vorlage des Pakets durch die Europäische Kommission.' },
      { year: '2023', text: 'Finale Verabschiedung der Kernrichtlinien (ETS II, CBAM, RED III).' },
      { year: '2024', text: 'Abschluss mit der reformierten EPBD und revidierten BauPVO.' },
      { year: '2030', text: 'Vollständige Erreichung des 55-%-Emissionsabbaus.' }
    ]
  },
  {
    id: 'ksg_bund',
    shortName: 'Bundes-Klimaschutzgesetz (KSG)',
    fullName: 'Bundes-Klimaschutzgesetz (KSG Deutschland)',
    norm: 'KSG vom 12.12.2019 i.d.F. der Novellen 2021 & 2024',
    level: 'ebene_1_strategie',
    levelLabel: 'Ebene 1: Strategischer Überbau',
    legalType: 'Deutsches Bundesgesetz',
    audiences: ['bestand', 'baustoffe', 'planer', 'finanzen'],
    primaryTarget: 'Sektor Gebäude und Gesamtwirtschaft in Deutschland',
    leadQuote: 'Klimaneutralität Deutschlands bereits 2045: -65 % bis 2030 und -88 % bis 2040.',
    coreSummary: 'Das KSG normiert verbindliche nationale Reduktionsziele, die über das EU-Klimagesetz hinausgehen: Treibhausgasneutralität bis 2045 (5 Jahre vor der EU). Es legte historische Jahresemissionsbudgets fest. Für den Gebäudesektor bedeutet dies: Absenkung der Jahres-Emissionen von 120 Mio. t CO₂e (2020) auf maximal 67 Mio. t CO₂e im Jahr 2030.',
    keyDuties: [
      'Erreichung von -65 % THG bis 2030, -88 % bis 2040 und Netto-Null bis 2045.',
      'Sektor Gebäude muss bis 2030 seinen Ausstoß nahezu halbieren.',
      'Gesetzliche Pflicht zu Gegensteuerungsmaßnahmen bei Verfehlung der Sektorziele.',
      'Bildet die verfassungsrechtliche Verankerung (BVerfG-Klimabeschluss 2021).'
    ],
    impactOnMaterials: 'Treibt das nationale Gebäudeenergiegesetz (GEG), die Bundesförderung für effiziente Gebäude (BEG) und die Einführung von grauen Emissionskriterien in deutschen Förderkulissen (QNG) voran.',
    milestones: [
      { year: '2021', text: 'Verschärfung nach Urteil des BVerfG: Ziel 2045 Netto-Null verankert.' },
      { year: '2030', text: 'Gebäudesektor-Emissionen dürfen max. 67 Mio. t CO₂e betragen.' },
      { year: '2040', text: 'Deutschlandweit -88 % Treibhausgasemissionen.' },
      { year: '2045', text: 'Netto-Treibhausgasneutralität der Bundesrepublik Deutschland.' }
    ]
  },

  // EBENE 2: Gebäude, Quartiere & Bestand
  {
    id: 'epbd_2024',
    shortName: 'EPBD (EU 2024/1275)',
    fullName: 'EPBD IV – Richtlinie über die Gesamtenergieeffizienz von Gebäuden',
    norm: 'Richtlinie (EU) 2024/1275 vom 24. April 2024',
    level: 'ebene_2_gebaeude',
    levelLabel: 'Ebene 2: Gebäude, Quartiere & Bestand',
    legalType: 'EU-Richtlinie (national umzusetzen)',
    audiences: ['bestand', 'baustoffe', 'planer', 'finanzen'],
    primaryTarget: 'Gebäudebestand, Neubau, Bauherren, Kommunen, Planer',
    leadQuote: 'Null-Emissions-Gebäude (ZEB), verbindliches Lebenszyklus-GWP im Energieausweis und Ausstieg aus fossilen Kesseln.',
    coreSummary: 'Die neugefasste EPBD ist das zentraleuropäische Leitgesetz für den Bau- und Immobiliensektor. Sie verlangt ab 2028 (öffentliche Neubauten) bzw. 2030 (alle Neubauten) den Standard des Null-Emissions-Gebäudes (Zero-Emission Building, ZEB). Revolutionär: Sie dehnt das Baurecht erstmals von der reinen Betriebsenergie auf den gesamten Lebenszyklus aus – das Treibhauspotenzial (Lebenszyklus-GWP) muss zwingend im Energieausweis ausgewiesen werden.',
    keyDuties: [
      'Null-Emissions-Gebäude (ZEB): 0 kg CO₂e operative Emissionen aus fossilen Brennstoffen vor Ort (ab 2028 für öffentliche Bauten, ab 2030 für alle Neubauten).',
      'Lebenszyklus-GWP (GWP_tot in kg CO₂e/m²a): Verpflichtende Ausweisung im Energieausweis ab 2028 (> 1000 m²) und ab 2030 für alle Neubauten.',
      'Sanierung Nichtwohngebäude: Mindesteffizienzstandards (MEPS) – 16 % der schlechtesten Bestandsgebäude bis 2030, 26 % bis 2033 sanieren.',
      'Sanierung Wohngebäude: Senkung des durchschnittlichen Primärenergieverbrauchs um 16 % bis 2030 und 20–22 % bis 2035 (55 % durch die schlechtesten 43 % des Bestands).',
      'Fossiler Kesselausstieg: Komplettes Verbot fossiler Heizkessel bis spätestens 2040; Subventionsstopp ab 01.01.2025.',
      'Solar-Mandat: Schrittweise Verpflichtung zur Solarenergienutzung auf Neubauten und öffentlichen/gewerblichen Dächern.'
    ],
    impactOnMaterials: 'Durch die Pflicht zur Berechnung des Lebenszyklus-GWP nach EN 15978 werden Baumaterialien mit hoher grauer Energie (Module A1–A3) unmittelbar bewertungsrelevant für die Baugenehmigung und den Gebäudewert.',
    milestones: [
      { year: '2024', text: 'Inkrafttreten (Mai 2024); Start der 24-monatigen Umsetzungsfrist für Mitgliedstaaten.' },
      { year: '2025', text: 'Subventionsstopp für eigenständige fossile Heizkessel (Öl/Gas).' },
      { year: '2028', text: 'ZEB-Standard für neue öffentliche Gebäude; Lebenszyklus-GWP-Ausweis für alle Neubauten > 1000 m².' },
      { year: '2030', text: 'ZEB & GWP für ausnahmslos alle Neubauten; 16 % MEPS-Sanierung Nichtwohn.' },
      { year: '2035', text: '20–22 % Primärenergiereduktion im Wohngebäudebestand.' },
      { year: '2040', text: 'Vollständiger Ausstieg aus fossilen Brennstoffen in der Gebäudeheizung.' }
    ],
    formula: {
      math: '\\text{GWP}_{\\text{life-cycle}} = \\frac{\\text{GWP}_{\\text{emb}} + \\sum_{t=1}^{50} \\text{GWP}_{\\text{use}}(t) + \\text{GWP}_{\\text{EoL}}}{A_{\\text{NFA}} \\cdot 50\\,\\text{a}} \\quad [\\text{kg CO}_2\\text{e/(m}^2\\cdot\\text{a})]',
      explanation: 'Lebenszyklus-GWP gemäß EPBD Anhang III & EN 15978 über 50 Jahre Betrachtungszeitraum.',
      source: 'EPBD (EU 2024/1275) Art. 7 & Anhang III'
    }
  },
  {
    id: 'geg_gmodg',
    shortName: 'GModG (vormals GEG)',
    fullName: 'Gebäudemodernisierungsgesetz (GModG) / vormals Gebäudeenergiegesetz',
    norm: 'GModG vom 23.07.2026 (BGBl. 2026 I Nr. 226), in Kraft seit 29.07.2026',
    level: 'ebene_2_gebaeude',
    levelLabel: 'Ebene 2: Gebäude, Quartiere & Bestand',
    legalType: 'Deutsches Bundesgesetz',
    audiences: ['bestand', 'baustoffe', 'planer'],
    primaryTarget: 'Gebäudeeigentümer, Bauherren, Handwerk, Fachplaner',
    leadQuote: 'Ablösung des GEG 2024: Entfall des 65-%-EE-Zwangs, Einführung der Bio-Treppe ab 2029 und modernisierte Hüllanforderungen (§§ 35, 36 GModG).',
    coreSummary: 'Das GModG regelt die energetischen Anforderungen an Gebäude in Deutschland und löst das GEG 2024 („Heizungsgesetz“) ab. Die starre 65-%-EE-Pflicht beim Heizungstausch ist entfallen. Neue Gas- und Ölheizungen dürfen weiter eingebaut werden, müssen jedoch ab 2029 nach der gesetzlichen Bio-Treppe schrittweise steigende Anteile klimaneutraler Brennstoffe (10 % bis 100 % im Jahr 2045) nutzen. Bei Sanierung von mehr als 10 % der Außenbauteilfläche greifen die Höchstwerte des Wärmedurchgangskoeffizienten nach § 36 GModG.',
    keyDuties: [
      'Stufenweise Bio-Treppe für flüssige/gasförmige Neuanlagen ab 2029 (10 % in 2029, 15 % in 2030, 30 % in 2035, 60 % in 2040, 100 % in 2045).',
      'Unbedingte Nachrüstpflicht: Dämmung der obersten Geschossdecke (§ 35 GModG, U ≤ 0,24 W/m²K) und von Wärmeverteilungsleitungen (§ 69 GModG).',
      'Bedingte Sanierungspflicht: Einhaltung der Bauteil-U-Werte nach § 36 GModG bei mehr als 10 % Flächenänderung (Außenwand U ≤ 0,24, Dach U ≤ 0,14, Fenster Uw ≤ 1,30 W/m²K).',
      'Ausnahmeregelung für Alt-Eigentümer (Stichtag 01.02.2002) mit 2-Jahres-Erfüllungsfrist bei Eigentumsübergang (§ 35 Abs. 3, § 69 Abs. 3 GModG).',
      'Wegfall des pauschalen 30-Jahre-Kesselaustausch-Betriebsverbots (bisher § 72 GEG a.F. entfallen).'
    ],
    impactOnMaterials: 'Nachfrage nach Hochleistungsdämmstoffen (Mineralwolle, Holzfaser, EPS, PUR/PIR, Resol), 3-fach-Wärmeschutzverglasungen und Wärmepumpensystemen (Propan R290).',
    milestones: [
      { year: '2026', text: 'Inkrafttreten des GModG am 29.07.2026 (Ablösung GEG 2024 / Entfall 65-%-Zwang).' },
      { year: '2029', text: 'Start der Bio-Treppe: mind. 10 % erneuerbare Brennstoffe für Neuanlagen.' },
      { year: '2030', text: 'Stufe 2 der Bio-Treppe: mind. 15 % erneuerbare Brennstoffe.' },
      { year: '2035', text: 'Stufe 3 der Bio-Treppe: mind. 30 % erneuerbare Brennstoffe.' },
      { year: '2040', text: 'Stufe 4 der Bio-Treppe: mind. 60 % erneuerbare Brennstoffe.' },
      { year: '2045', text: 'Zieljahr Klimaneutralität: 100 % erneuerbare Brennstoffe für alle Gebäudeheizungen.' }
    ]
  },
  {
    id: 'wpg_waerme',
    shortName: 'WPG (Wärmeplanungsgesetz)',
    fullName: 'Gesetz für die Wärmeplanung und zur Dekarbonisierung der Wärmenetze',
    norm: 'WPG vom 20. Dezember 2023 (BGBl. 2023 I Nr. 394)',
    level: 'ebene_2_gebaeude',
    levelLabel: 'Ebene 2: Gebäude, Quartiere & Bestand',
    legalType: 'Deutsches Bundesgesetz',
    audiences: ['bestand', 'planer', 'finanzen'],
    primaryTarget: 'Kommunen, Netzbetreiber, Stadtwerke, Hauseigentümer',
    leadQuote: 'Verbindliche kommunale Wärmepläne bis 2026 bzw. 2028 als Grundlage für Sanierungsentscheidungen.',
    coreSummary: 'Das WPG verpflichtet alle rund 11 000 deutschen Kommunen zur Erstellung eines verbindlichen Wärmeplans. Dadurch erfahren Hauseigentümer verlässlich, ob ihr Gebäude an ein Fernwärmenetz oder Wasserstoffnetz angeschlossen werden kann oder ob sie eigenständig dezentral (Wärmepumpe + Dämmung) dekarbonisieren müssen.',
    keyDuties: [
      'Wärmeplanpflicht für Großstädte (> 100 000 Einw.) bis 30. Juni 2026.',
      'Wärmeplanpflicht für kleinere Kommunen (< 100 000 Einw.) bis 30. Juni 2028.',
      'Wärmenetze müssen bis 2030 mindestens 30 % und bis 2040 mindestens 80 % erneuerbare Wärme einspeisen.',
      'Vollständige Klimaneutralität aller Wärmenetze bis 2045.'
    ],
    impactOnMaterials: 'Entscheidet über den Sanierungsumfang: Gebäude ohne Wärmenetzanschluss benötigen tiefere Hüllsanierungen, um Vorlauftemperaturen für Niedertemperatur-Wärmepumpen (≤ 55 °C) zu erreichen.',
    milestones: [
      { year: '2024', text: 'Inkrafttreten am 01.01.2024.' },
      { year: '2026', text: 'Stichtag Wärmeplanung für Städte > 100 000 Einwohner.' },
      { year: '2028', text: 'Stichtag Wärmeplanung für alle übrigen Kommunen in Deutschland.' },
      { year: '2030', text: 'Wärmenetze müssen mind. 30 % Erneuerbare/Abwärme liefern.' }
    ]
  },
  {
    id: 'levels_eu',
    shortName: 'Level(s) Framework',
    fullName: 'Level(s) – Europäischer Rahmen für nachhaltige Gebäude',
    norm: 'Europäischer Standardrahmen (JRC / DG Environment)',
    level: 'ebene_2_gebaeude',
    levelLabel: 'Ebene 2: Gebäude, Quartiere & Bestand',
    legalType: 'EU-/Finanz-Standard',
    audiences: ['baustoffe', 'planer', 'finanzen'],
    primaryTarget: 'Architekten, Ingenieure, Zertifizierer (DGNB, BREEAM), Bauherren',
    leadQuote: 'Der ganzheitliche EU-Standard mit 6 Makrozielen und 16 Kernindikatoren für den Gebäudelebenszyklus.',
    coreSummary: 'Level(s) ist der von der EU-Kommission entwickelte methodische Referenzrahmen zur Messung und Berichterstattung über die Nachhaltigkeit von Gebäuden. Er verknüpft Baupraxis mit den Umweltzielen der EU und fungiert als Schablone für die EPBD, die EU-Taxonomie und nationale Gütesiegel (z. B. QNG).',
    keyDuties: [
      'Makroziel 1: Treibhausgasemissionen entlang des Lebenszyklus (Indikator 1.2 Lebenszyklus-GWP).',
      'Makroziel 2: Ressourceneffiziente und zirkuläre Materiallebenszyklen (Indikatoren 2.1 Bauteillisten, 2.2 Abbruchabfälle, 2.3 Zirkuläres Design).',
      'Makroziel 3: Effiziente Nutzung der Wasserressourcen.',
      'Makroziel 4: Gesunde und behagliche Innenräume (Raumluftqualität, thermischer Komfort).',
      'Makroziel 5: Anpassung und Widerstandsfähigkeit gegenüber dem Klimawandel (Sommerlicher Hitzeschutz).',
      'Makroziel 6: Lebenszykluskosten (LCC) und Werthaltigkeit.'
    ],
    impactOnMaterials: 'Etabliert die standardisierte Material- und Rückbaudokumentation (Building Circularity Passports) und die einheitliche Methodik zur Quantifizierung grauer Emissionen nach EN 15978.',
    milestones: [
      { year: '2020', text: 'Offizieller Start von Level(s) nach dreijähriger europaweiter Testphase.' },
      { year: '2022', text: 'Integration von Level(s)-Indikatoren in die EU-Taxonomie (DNSH).' },
      { year: '2024', text: 'Übernahme des Indikators 1.2 als Pflichtelement in die EPBD 2024/1275.' },
      { year: '2028', text: 'Vollständige EU-Harmonisierung digitaler Gebäude-Materialpässe.' }
    ]
  },
  {
    id: 'crrem_v2',
    shortName: 'CRREM v2',
    fullName: 'Carbon Risk Real Estate Monitor (CRREM)',
    norm: 'Global Decarbonisation Pathways (EU Horizon 2020 gefördert)',
    level: 'ebene_2_gebaeude',
    levelLabel: 'Ebene 2: Gebäude, Quartiere & Bestand',
    legalType: 'EU-/Finanz-Standard',
    audiences: ['bestand', 'finanzen', 'planer'],
    primaryTarget: 'Immobilieninvestoren, Banken, Asset Manager, Bestandsprüfer',
    leadQuote: 'Misalignment Year und Stranded Assets: Das anerkannte Barometer für den Wertverlust ineffizienter Bestände.',
    coreSummary: 'CRREM liefert wissenschaftlich kalibrierte 1,5°C-Dekarbonisierungspfade (kg CO₂e/m²a) für 28 Gebäudetypen weltweit bis 2050. Das Überschreiten des Pfades definiert das "Stranding Year", ab dem eine Immobilie regulatorischen Risiken, Strafabgaben und dem "Brown Discount" (Marktwertabschlag) ausgesetzt ist.',
    keyDuties: [
      'Messung der Treibhausgasintensität des Gebäudebetriebs (Scope 1 und Scope 2).',
      'Ermittlung des Misalignment Years und der kumulierten Budgetüberschreitung.',
      'Berechnung des optimalen Capex-Sanierungszeitpunkts vor dem Stranding.',
      'Anerkannter Standard für ESG-Ratings (GRESB, INREV, PCAF).'
    ],
    impactOnMaterials: 'Setzt Budgets für Sanierungs-Capex fest und bewertet Baustoffe danach, wie schnell sie die betriebliche CO₂-Last amortisieren können.',
    milestones: [
      { year: '2020', text: 'Veröffentlichung der CRREM v1 Dekarbonisierungspfade.' },
      { year: '2023', text: 'Veröffentlichung von CRREM v2 mit Angleichung an SBTi und EPBD.' },
      { year: '2030', text: 'Drastischer Knick in den Pfaden: Erfordert > 60 % CO₂-Senkung.' },
      { year: '2050', text: 'Zielwert: 0,0 kg CO₂e pro Quadratmeter NFA.' }
    ],
    formula: {
      math: '\\text{GHG}_{\\text{actual}}(t) > \\text{Target}_{\\text{CRREM}}(t) \\implies \\text{Status: Stranded Asset}',
      explanation: 'Stranding-Kriterium: Liegt die tatsächliche Treibhausgasintensität über dem Jahres-Zielpfad, gilt die Immobilie als stranded.',
      source: 'CRREM Methodology v2.0'
    }
  },

  // EBENE 3: Baustoffe, Bauprodukte & Ökodesign
  {
    id: 'baupvo_2024',
    shortName: 'BauPVO 2024 (CPR)',
    fullName: 'Revidierte EU-Bauprodukteverordnung (Construction Products Regulation)',
    norm: 'Verordnung (EU) 2024/3110 (Ablösung der alten VO 305/2011)',
    level: 'ebene_3_baustoffe',
    levelLabel: 'Ebene 3: Baustoffe, Bauprodukte & Ökodesign',
    legalType: 'EU-Verordnung (unmittelbar)',
    audiences: ['baustoffe', 'planer'],
    primaryTarget: 'Baustoffhersteller, Händler, Importeure, Bauprüfämter, Tragwerksplaner',
    leadQuote: 'Verbindliche Umweltdeklaration (GWP) in der CE-Kennzeichnung und Digitaler Bauproduktpass.',
    coreSummary: 'Die Novelle der BauPVO verändert den europäischen Binnenmarkt für Bauprodukte grundlegend. Sie aktiviert die "Grundanforderung 7: Nachhaltige Nutzung der natürlichen Ressourcen" als verbindliche CE-Pflicht. Hersteller dürfen Bauprodukte künftig nur noch mit CE-Kennzeichnung in Verkehr bringen, wenn sie neben mechanischen Eigenschaften auch standardisierte Umweltleistungsdaten (Lebenszyklus-GWP, Rezyklatanteil) in der Leistungserklärung (DoP) ausweisen.',
    keyDuties: [
      'Verpflichtende Ausweisung von Umwelt- und Klimadaten nach EN 15804 in der CE-Kennzeichnung.',
      'Einführung des Digitalen Bauproduktpasses (Digital Construction Product Passport) mit QR-Code am Bauteil.',
      'Ermächtigung der EU-Kommission zur Festlegung verbindlicher THG-Höchstgrenzen für Bauprodukte.',
      'Rezyklatmindestanteile für spezifische Produktgruppen (z. B. mineralische Dämmstoffe, Betonbauteile).',
      'Bevorzugung wiederverwendeter und wiederaufbereiteter Bauprodukte im Binnenmarkt.'
    ],
    impactOnMaterials: 'Hersteller müssen für jedes Bauprodukt verifizierte EPD-Daten liefern. Klinkerreiche Zemente oder ungedeckte Baustoffe riskieren den Verlust der CE-Marktfähigkeit bei Einführung von Produkt-Emissionsgrenzen.',
    milestones: [
      { year: '2024', text: 'Finale Verabschiedung der revidierten Verordnung im EU-Parlament/Rat.' },
      { year: '2025', text: 'Start der Überarbeitung harmonisierter europäischer Produktnormen (hEN).' },
      { year: 'ab 2027', text: 'Schrittweise Einführung des Digitalen Produktpasses je Produktfamilie; verpflichtend 18 Monate nach Inkrafttreten des delegierten Rechtsakts nach Art. 75 Abs. 1 VO (EU) 2024/3110 (Stand 10/2026 noch nicht erlassen).' },
      { year: '2040', text: 'Spätestes Ende der schrittweisen Aufhebung der VO (EU) 305/2011 (2026 bis 2040); bis dahin gelten für Produkte unter alten harmonisierten Normen Übergangsregeln.' }
    ]
  },
  {
    id: 'espr_2024',
    shortName: 'ESPR (EU 2024/1781)',
    fullName: 'Ökodesign-Verordnung für nachhaltige Produkte (Ecodesign Regulation)',
    norm: 'Verordnung (EU) 2024/1781 vom 13. Juni 2024 (Inkrafttreten 18.07.2024)',
    level: 'ebene_3_baustoffe',
    levelLabel: 'Ebene 3: Baustoffe, Bauprodukte & Ökodesign',
    legalType: 'EU-Verordnung (unmittelbar)',
    audiences: ['baustoffe', 'planer'],
    primaryTarget: 'Produkthersteller in der EU und Importeure',
    leadQuote: 'Kreislaufdesign, Reparierbarkeit, Rezyklatquoten und Digitaler Produktpass (DPP) für Vor- und Baustoffe.',
    coreSummary: 'Die ESPR erweitert die bisherige Ökodesign-Logik auf nahezu alle physischen Produkte. Baustoffe – namentlich Stahl, Aluminium, Zement und Chemikalien – gehören zu den von der Kommission benannten prioritären Produktgruppen. Sie setzt verbindliche Anforderungen an Haltbarkeit, Wiederverwendbarkeit, Rezykliergehalt und den CO₂-Fußabdruck fest und schafft die IT-Infrastruktur des Digitalen Produktpasses.',
    keyDuties: [
      'Digitaler Produktpass (DPP): Lückenlose digitale Datenkette von Rohstoffherkunft bis Entsorgung.',
      'Festlegung von Mindestrezyklatanteilen und Kriterien zur zirkulären Demontierbarkeit.',
      'Verbot der Vernichtung unbenutzter Textilien und Konsumgüter (Modell für Überproduktion am Bau).',
      'Ausschluss von Substanzen, die die Kreislauffähigkeit oder das Recycling hemmen.'
    ],
    impactOnMaterials: 'Erzwingt standardisierte Maschinenschnittstellen für Baustoffdaten. Baustoffe ohne DPP können künftig von BIM-gestützten Ausschreibungen und Green-Public-Procurement-Verfahren ausgeschlossen werden.',
    milestones: [
      { year: '2024', text: 'Inkrafttreten am 18. Juli 2024.' },
      { year: '2025', text: 'Verabschiedung des ersten ESPR-Arbeitsplans mit Fokus auf Bau-Grundstoffe.' },
      { year: '2027', text: 'Scharfstellung der ersten delegierten Rechtsakte mit konkreten DPP-Pflichten.' }
    ]
  },
  {
    id: 'emoco_embodied',
    shortName: 'EMoCo / Embodied Carbon',
    fullName: 'Embodied Carbon Frameworks & Grenzwerte für graue Emissionen',
    norm: 'EPBD Art. 7 Lebenszyklus-GWP, EN 15978 / RE2020 / BR18 / QNG',
    level: 'ebene_3_baustoffe',
    levelLabel: 'Ebene 3: Baustoffe, Bauprodukte & Ökodesign',
    legalType: 'EU-Richtlinie (national umzusetzen)',
    audiences: ['baustoffe', 'planer', 'bestand'],
    primaryTarget: 'Tragwerksplaner, Architekten, Baustoffhersteller, Zertifizierungsstellen',
    leadQuote: 'Vom Betriebsenergie-Fokus zur harten Begrenzung des Herstellungskohlenstoffs pro Quadratmeter.',
    coreSummary: 'Unter EMoCo (Embodied Carbon / Embedded Carbon) bündeln sich die europäischen und nationalen Rechtsakte zur Begrenzung von grauen Treibhausgasen (Module A1–A5 Herstellung und Errichtung, B1–B7 Nutzung, C1–C4 Entsorgung). Während in Frankreich (RE2020) und Dänemark (BR18) bereits progressive CO₂-Obergrenzen pro Quadratmeter gesetzlich gelten, bereitet die EU-Kommission verbindliche EU-Höchstwerte für 2030 vor.',
    keyDuties: [
      'Ganzheitliche Ökobilanzierung (LCA) aller Konstruktions- und Dämmschichten vor Baubeginn.',
      'Einhaltung maximaler CO₂e-Grenzwerte pro Quadratmeter Bruttogrundfläche (BGF) oder Nettoraumfläche (NRF).',
      'Substitution CO₂-intensiver Baustoffe durch klinkerarme Zemente, Lehmbaustoffe (DIN 18940) oder Holz.',
      'Nachweis des Dekarbonisierungspfads nach QNG Kriteriensteckbrief 3.1.1 (Deutschland).'
    ],
    impactOnMaterials: 'Katalysator für die ökologische Materialsubstitution: Belohnt CO₂-senkende Baustoffe und straft Klinker, Primärstahl und energieintensive Hartschaumdämmungen ab.',
    milestones: [
      { year: '2022', text: 'Frankreich führt RE2020 mit verbindlichem Grenzwert für Neubauten ein.' },
      { year: '2023', text: 'Dänemark setzt BR18-Grenzwert von 12 kg CO₂e/(m²·a) gesetzlich in Kraft.' },
      { year: '2027', text: 'Vorlage des EU-Berichts mit Entwurf für europaweite Embodied-Carbon-Grenzwerte.' },
      { year: '2030', text: 'Einführung verbindlicher Höchstgrenzen für graue Emissionen in der EU.' }
    ],
    formula: {
      math: '\\text{GWP}_{\\text{emb}} = \\sum_{i=1}^n \\left( m_i \\cdot \\text{GWP}_{\\text{spec}, i}^{\\text{A1-A3}} \\right) \\le \\text{Limit}_{\\text{LCA}} \\quad [\\text{kg CO}_2\\text{e/m}^2]',
      explanation: 'Summe der Herstellungs-Treibhausgase aller Baustoffmassen mi im Verhältnis zur gesetzlichen Obergrenze.',
      source: 'DIN EN 15978 / QNG Anforderung'
    }
  },
  {
    id: 'ebv_mantel',
    shortName: 'EBV (Ersatzbaustoffverordnung)',
    fullName: 'Ersatzbaustoffverordnung – Verordnung über Anforderungen an den Einbau mineralischer Ersatzbaustoffe',
    norm: 'Artikel 1 der Mantelverordnung vom 09.07.2021 (BGBl. I S. 2598), in Kraft seit 01.08.2023',
    level: 'ebene_3_baustoffe',
    levelLabel: 'Ebene 3: Baustoffe, Bauprodukte & Ökodesign',
    legalType: 'Bundesverordnung',
    audiences: ['baustoffe', 'planer'],
    primaryTarget: 'Tiefbauunternehmen, Recyclingbetriebe, Straßenbau, Bodenschutzbehörden',
    leadQuote: 'Rechtlich belastbares Ende der Abfalleigenschaft und bundesweit einheitliche Einbauklassen für RC-Baustoffe.',
    coreSummary: 'Die EBV harmonisiert das deutsche Verwertungsrecht für mineralische Sekundärbaustoffe und löste die fragmentierten LAGA-Regelungen der Bundesländer ab. Sie definiert einheitliche Materialwerte und Einbauweisen für güteüberwachte Recycling-Baustoffe (RC-1 bis RC-3), Bodenmaterial (BM-0 bis BM-F3), Schlacken und Bauschutt im Erd- und Tiefbau.',
    keyDuties: [
      'Güteüberwachung durch werkseigene Produktionskontrolle (WPK) und Fremdüberwachung.',
      'Klassifizierung nach Schadstoff-Eluatwerten (Schwermetalle, Sulfat, PAK, MKW).',
      'Kataster- und Anzeigepflicht nach § 22 EBV: Einbaumengen ab 250 m³ müssen bei den unteren Bodenschutzbehörden dokumentiert werden.',
      'Sicherstellung des vorsorgenden Grundwasserschutzes in Wasserschutzgebieten.'
    ],
    impactOnMaterials: 'Schafft erstmals Rechtssicherheit beim Einbau von Recycling-Schotter, RC-Betonsplitt und aufbereitetem Bodenaushub. Beseitigt das Stigma des "Abfalls", sofern das Gütezeichen vorliegt.',
    milestones: [
      { year: '2023', text: '01. August 2023: Vollständiges Inkrafttreten der EBV nach über 15 Jahren Verhandlung.' },
      { year: '2025', text: 'Erste Zwischenbilanz der Bundesregierung zu Recycling-Quoten im Tiefbau.' },
      { year: '2027', text: 'Mögliche Anpassung von Eluatgrenzwerten und vereinfachte Katastermeldungen.' }
    ]
  },
  {
    id: 'krwg_gewabfv',
    shortName: 'KrWG & GewAbfV',
    fullName: 'Kreislaufwirtschaftsgesetz & Gewerbeabfallverordnung',
    norm: 'KrWG vom 24.02.2012 i.d.F. 2020 & GewAbfV vom 18.04.2017',
    level: 'ebene_3_baustoffe',
    levelLabel: 'Ebene 3: Baustoffe, Bauprodukte & Ökodesign',
    legalType: 'Deutsches Bundesgesetz',
    audiences: ['baustoffe', 'planer'],
    primaryTarget: 'Bauunternehmer, Abbruchbetriebe, Bauherren, Abfallwirtschaft',
    leadQuote: 'Getrennthaltungspflicht auf Baustellen und gesetzliche 70-%-Recyclingquote für Bauabfälle.',
    coreSummary: 'Das KrWG verankert die fünfstufige Abfallhierarchie im deutschen Baurecht. Die Gewerbeabfallverordnung verpflichtet Bau- und Abbruchunternehmen zur getrennten Sammlung von Baustellenabfällen in zehn Fraktionen (u. a. Glas, Kunststoff, Metalle, Holz, Dämmmaterial, Bitumengemische, Baustoffe auf Gipsbasis, Beton, Ziegel, Fliesen und Keramik; § 8 GewAbfV), um die stoffliche Verwertung sicherzustellen.',
    keyDuties: [
      'Strikte Getrennthaltungspflicht auf der Baustelle vor Ort.',
      'Dokumentationspflicht für Ausnahmen (technische Unmöglichkeit oder unverhältnismäßige Kosten).',
      'Erfüllung der gesetzlichen Quote: Mindestens 70 Masse-% aller Bau- und Abbruchabfälle müssen stofflich recycelt werden.',
      'Vorrang für selektiven Rückbau und sortenreine Bauteiltrennung vor dem Totalabbruch.'
    ],
    impactOnMaterials: 'Verbundwerkstoffe (z. B. verklebte WDVS-Systeme) werden durch Entsorgungskosten massiv benachteiligt; trennbare Konstruktionen (mechanisch befestigt, sortenrein lösbar) gewinnen an Marktwert.',
    milestones: [
      { year: '2017', text: 'Novelle der GewAbfV mit schärferen Getrennthaltungspflichten.' },
      { year: '2020', text: 'Novelle des KrWG zur Umsetzung des EU-Kreislaufwirtschaftspakets.' },
      { year: '2030', text: 'Anstrebung einer echten Closed-Loop-Quote für mineralische Bauabfälle.' }
    ]
  },

  // EBENE 4: Emissionshandel, Bepreisung & Handelsschutz
  {
    id: 'eu_ets_1',
    shortName: 'EU-ETS I (Industrie)',
    fullName: 'Europäisches Emissionshandelssystem I – Energieintensive Baustoffindustrie',
    norm: 'Richtlinie 2003/87/EG i.d.F. der Richtlinie (EU) 2023/958',
    level: 'ebene_4_bepreisung',
    levelLabel: 'Ebene 4: Emissionshandel & Bepreisung',
    legalType: 'EU-Richtlinie (national umzusetzen)',
    audiences: ['baustoffe', 'finanzen'],
    primaryTarget: 'Zementwerke, Stahlhütten, Ziegeleien, Flachglashersteller, Kalkbrennereien',
    leadQuote: 'Auslaufen kostenloser Zuteilungen bis 2034 verteuert klinkerreiche Zemente und Primärbaustoffe massiv.',
    coreSummary: 'Das EU-ETS I ist das marktwirtschaftliche Herzstück des EU-Klimaschutzes für Industrieanlagen. Bislang erhielten Baustoffhersteller einen Großteil ihrer CO₂-Zertifikate kostenlos, um Abwanderung zu verhindern. Im Zuge des Fit-for-55-Pakets wird diese freie Zuteilung zwischen 2026 und 2034 stufenweise auf null abgeschmolzen (parallel zum Hochlauf des CBAM).',
    keyDuties: [
      'Abgabe von 1 EU-Allowance (EUA) für jede emittierte Tonne CO₂ aus industriellen Prozessen.',
      'Schrittweises Abschmelzen der freien Zuteilung für Zement, Stahl, Aluminium und Kalk ab 2026.',
      'Vollständige Auktionspflicht für 100 % der Emissionen ab 2034.',
      'Verstärkter Kostendruck zur Umstellung auf alternative Bindemittel, Wasserstoff oder CCS/CCU.'
    ],
    impactOnMaterials: 'Klassischer CEM-I-Portlandzement (ca. 0,8 t CO₂ pro Tonne Zement) erfährt bei 100 €/t CO₂ einen direkten Kostenaufschlag von rund 80 €/t! Dies begünstigt CEM II/C, CEM III und zementfreie Geopolymere im Preisvergleich gravierend.',
    milestones: [
      { year: '2026', text: 'Start des Auslaufens freier Zuteilungen (-2,5 % Reduktion).' },
      { year: '2030', text: 'Freie Zuteilungen sinken um 48,5 %; drastischer Preissprung für Klinker.' },
      { year: '2034', text: '0 % kostenlose Zuteilung für Baustoffe im ETS I; 100 % Vollkostenauktion.' }
    ],
    formula: {
      math: '\\Delta C_{\\text{Zement}} = \\text{Klinkeranteil} \\cdot 0{,}86\\,\\frac{\\text{t CO}_2}{\\text{t Klinker}} \\cdot P_{\\text{EUA}} \\cdot (1 - f_{\\text{free}})',
      explanation: 'Mehrkosten pro Tonne Zement durch CO2-Zertifikatspreis P_EUA bei sinkender freier Zuteilung f_free.',
      source: 'EU-ETS Richtlinie (EU) 2023/958'
    }
  },
  {
    id: 'eu_ets_2',
    shortName: 'EU-ETS II (Gebäude & Brennstoffe)',
    fullName: 'Europäisches Emissionshandelssystem II – Gebäude und Straßenverkehr (Start auf 2028 verschoben)',
    norm: 'Richtlinie (EU) 2023/959',
    level: 'ebene_4_bepreisung',
    levelLabel: 'Ebene 4: Emissionshandel & Bepreisung',
    legalType: 'EU-Richtlinie (national umzusetzen)',
    audiences: ['bestand', 'finanzen', 'planer'],
    primaryTarget: 'Brennstoffhändler (Gas, Öl, Kohle), Immobilieneigentümer, Vermieter',
    leadQuote: 'Das europaweite Preissignal ab 2028: Fossile Heizenergie im Gebäudebestand wird marktgetrieben verteuert.',
    coreSummary: 'Ursprünglich für 2027 geplant, durch Verordnung (EU) 2026/667 (politische Einigung November 2025) auf 2028 verschoben. Dann startet das EU-ETS II als eigenständiges Handelssystem für Brennstoffe, die in Gebäuden verbrannt werden. Inverkehrbringer fossiler Brennstoffe müssen Zertifikate erwerben. Die Kosten werden auf die Heizkosten umgelegt. Ein Marktstabilitätsmechanismus soll Preisspitzen dämpfen (Richtwert 45 € je Tonne in Preisen von 2020); die schrittweise Mengenverknappung verteuert den Betrieb unsanierter Bestandsgebäude dennoch deutlich.',
    keyDuties: [
      'Inverkehrbringer von Brennstoffen müssen ab Start des ETS II für die mit Gas und Öl verbundenen Emissionen Zertifikate abgeben; bis dahin gilt in Deutschland das BEHG.',
      'Strikte jährliche Reduktion der Zertifikatemenge um über 5 % pro Jahr.',
      'Mechanismus zur Preisdämpfung (Freigabe zusätzlicher Zertifikate bei Überschreiten von ca. 45 €/t vor 2030).',
      'Einnahmen fließen direkt in den EU-Klima-Sozialfonds (Social Climate Fund) zur Förderung von Sanierungen.'
    ],
    impactOnMaterials: 'Erhöht die Wirtschaftlichkeit energetischer Dämmmaßnahmen dramatisch. Die statische und dynamische Amortisationszeit von Fassaden- und Dachdämmungen sinkt durch hohe fossile Heizkosten um 30–50 %.',
    milestones: [
      { year: '2025', text: 'Start der Zertifikatsüberwachung und Monitoring-Pflicht der Brennstoffhändler.' },
      { year: '2027', text: 'Ursprünglich geplanter Handelsstart (durch VO (EU) 2026/667 verschoben).' },
      { year: '2028', text: 'Start des Handels (Auktionierung der Brennstoffzertifikate).' },
      { year: '2030', text: 'Freie Preisbildung; Marktanalysen prognostizieren 100–200 €/t CO₂.' }
    ]
  },
  {
    id: 'behg_co2k',
    shortName: 'BEHG & CO2KostAufG',
    fullName: 'Brennstoffemissionshandelsgesetz & CO₂-Kostenaufteilungsgesetz',
    norm: 'BEHG vom 12.12.2019 & CO2KostAufG vom 05.12.2022 (BGBl. I S. 2154)',
    level: 'ebene_4_bepreisung',
    levelLabel: 'Ebene 4: Emissionshandel & Bepreisung',
    legalType: 'Deutsches Bundesgesetz',
    audiences: ['bestand', 'finanzen'],
    primaryTarget: 'Vermieter, Mieter, Brennstofflieferanten in Deutschland',
    leadQuote: 'Das 10-Stufen-Modell: Vermieter zahlen bei schlechten Energiekennwerten bis zu 95 % der CO₂-Kosten.',
    coreSummary: 'Das BEHG bepreist fossile Brennstoffe in Deutschland (2024: 45 €/t CO₂, 2025: 55 €/t, 2026: 55–65 €/t). Das CO2KostAufG verteilt diese Kosten anhand der spezifischen CO₂-Emissionen des Gebäudes zwischen Vermieter und Mieter: Je ineffizienter das Gebäude, desto mehr zahlt der Vermieter (Stufe 10: 95 % Vermieteranteil bei > 52 kg CO₂/m²a).',
    keyDuties: [
      'Ermittlung der CO₂-Kosten auf der Heizkostenabrechnung anhand des Brennstoffverbrauchs.',
      'Berechnung der spezifischen Gebäude-Emissionsintensität in kg CO₂ pro m² Wohnfläche und Jahr.',
      'Übernahme von bis zu 95 % der CO₂-Abgabe durch den Vermieter bei energetisch schlechtem Zustand.',
      'Überleitung des nationalen Systems in den EU-ETS II ab dem Jahr 2028.'
    ],
    impactOnMaterials: 'Schafft einen sofortigen finanziellen Cashflow-Anreiz für Vermieter, Dämmstoff- und Fensterinvestitionen vorzuziehen, um nicht dauerhaft hohe CO₂-Strafzahlungen aus der Kaltmiete tragen zu müssen.',
    milestones: [
      { year: '2023', text: 'Inkrafttreten des 10-Stufen-Modells (CO2KostAufG).' },
      { year: '2024', text: 'Erhöhung des BEHG-Festpreises auf 45 €/t CO₂.' },
      { year: '2025', text: 'Erhöhung auf 55 €/t CO₂; 2026: Auktionskorridor 55–65 €/t.' },
      { year: '2028', text: 'Vollständige Überführung in den europäischen ETS II.' }
    ]
  },
  {
    id: 'cbam_grenzausgleich',
    shortName: 'CBAM (VO EU 2023/956)',
    fullName: 'CO₂-Grenzausgleichsmechanismus (Carbon Border Adjustment Mechanism)',
    norm: 'Verordnung (EU) 2023/956 vom 10. Mai 2023',
    level: 'ebene_4_bepreisung',
    levelLabel: 'Ebene 4: Emissionshandel & Bepreisung',
    legalType: 'EU-Verordnung (unmittelbar)',
    audiences: ['baustoffe', 'finanzen', 'planer'],
    primaryTarget: 'Importeure von Zement, Stahl, Eisen, Aluminium, Düngemitteln, Strom',
    leadQuote: 'Verhindert Carbon Leakage: Gleicher CO₂-Preis für Import-Baustoffe wie für europäische Produktion.',
    coreSummary: 'Der CBAM schützt die europäische Grundstoffindustrie vor Billigimporten aus Drittländern ohne CO₂-Preis. Importeure von Zement, Stahl und Aluminium müssen ab 2026 CBAM-Zertifikate erwerben, deren Preis an die wöchentlichen EU-ETS-Auktionen gekoppelt ist. Dadurch wird der CO₂-Preisunterschied zwischen der EU und dem Herkunftsland an der EU-Außengrenze exakt ausgeglichen.',
    keyDuties: [
      'Übergangsphase 2023–2025: quartalsweise Berichte über eingebettete Emissionen (Scope 1 und Vorprodukte); ab 2026 jährliche CBAM-Erklärung (Art. 6).',
      'Zulassung als "autorisierter CBAM-Anmelder" bei der zuständigen nationalen Behörde (in DE: DEHSt); die Einfuhr selbst wickelt der Zoll ab.',
      'Ab 2026: Verpflichtender Kauf und Abgabe von CBAM-Zertifikaten für jede importierte Tonne Baustoff.',
      'Verifizierung der Emissionsdaten durch akkreditierte EU-Prüfstellen.'
    ],
    impactOnMaterials: 'Macht billige, CO₂-intensive Importe von chinesischem oder türkischem Klinker und Primärstahl unrentabel. Stärkt die Wettbewerbsfähigkeit von ressourcenschonenden europäischen Sekundärbaustoffen und klinkerarmen Rezepturen.',
    milestones: [
      { year: '2023', text: '01. Oktober 2023: Start der Übergangsphase (Berichtspflicht ohne Zahlung).' },
      { year: '2025', text: '31. Dezember 2025: Ende der zollrechtlichen Übergangsphase.' },
      { year: '2026', text: '01. Januar 2026: Zertifikatspflicht für Einfuhren ab 2026; Verkauf der Zertifikate ab 01.02.2027 (rückwirkend für 2026).' },
      { year: '2034', text: 'Vollständige Deckung aller Importemissionen (analog 100 % ETS-Auktion).' }
    ],
    formula: {
      math: '\\text{CBAM-Kosten} = \\text{Importmenge} \\cdot \\text{GWP}_{\\text{spec}} \\cdot \\left( P_{\\text{ETS}} - P_{\\text{Origin}} \\right)',
      explanation: 'Endzustand ohne kostenlose Zuteilung (ab 2034): eingebettete Emissionen mal Zertifikatspreis (Art. 21) abzüglich des im Ursprungsland gezahlten CO2-Preises (Art. 9). Bis 2034 wird die Zertifikatszahl zusätzlich um die Anpassung an die kostenlose EU-ETS-Zuteilung gekürzt (Art. 31; der CBAM-Faktor sinkt von 2026 bis 2034 schrittweise auf 0 %).',
      source: 'VO (EU) 2023/956 Art. 9, 21, 31'
    }
  },

  // EBENE 5: Nachhaltige Finanzierung, Vergabe & Lieferketten
  {
    id: 'eu_taxonomie',
    shortName: 'EU-Taxonomie (2020/852)',
    fullName: 'EU-Taxonomie-Verordnung & Delegierte Rechtsakte zum Klimaschutz',
    norm: 'Verordnung (EU) 2020/852 & Delegierte Verordnung (EU) 2021/2139',
    level: 'ebene_5_finanzen',
    levelLabel: 'Ebene 5: Finanzen, Vergabe & Lieferketten',
    legalType: 'EU-Verordnung (unmittelbar)',
    audiences: ['finanzen', 'planer', 'bestand'],
    primaryTarget: 'Banken, Kapitalmärkte, Projektentwickler, Immobilienfonds, Großkonzerne',
    leadQuote: 'Das Gold-Standard-Klassifizierungssystem für Green Financing: 10 % unter NZEB und striktes DNSH.',
    coreSummary: 'Die EU-Taxonomie legt Kriterien fest, wann eine Bau- oder Immobilientätigkeit als ökologisch nachhaltig gilt. Zentral ist das Doppelkriterium: Substantial Contribution zu einem Umweltziel (z. B. Primärenergiebedarf 10 % unter dem Niedrigstenergiegebäude-Standard NZEB) UND die Einhaltung aller Do-No-Significant-Harm-Kriterien (DNSH) bezüglich Kreislaufwirtschaft, Schadstoffen, Wasser und Biodiversität.',
    keyDuties: [
      'Neubau: Primärenergiebedarf mindestens 10 % besser als der nationale GEG-Standard.',
      'Neubau > 5000 m²: Verpflichtende Lebenszyklus-Ökobilanz (LCA nach EN 15978) und Offenlegung des GWP.',
      'Sanierung: Mindestens 30 % Primärenergieeinsparung nachgewiesen im Energieausweis.',
      'DNSH Kreislaufwirtschaft: Mindestens 70 % der Bau- und Abbruchabfälle müssen stofflich recycelt werden.',
      'DNSH Schadstoffe: Ausschluss von SVHC-Gefahrstoffen (REACH Art. 57) in verbauten Materialien.'
    ],
    impactOnMaterials: 'Baustoffe müssen lückenlos schadstoffarm sein und über EPDs verfügen. Nicht-taxonomiekonforme Gebäude drohen von günstigen Green Loans (z. B. KfW) und institutionellen Investoren ausgeschlossen zu werden.',
    milestones: [
      { year: '2020', text: 'Verabschiedung der Rahmenverordnung 2020/852.' },
      { year: '2022', text: 'Vollständige Anwendbarkeit der Klimaziele 1 & 2 (Mitigation & Adaptation).' },
      { year: '2024', text: 'Erweiterung auf die 4 weiteren Umweltziele (Kreislaufwirtschaft, Schadstoffe).' }
    ]
  },
  {
    id: 'csrd_esrs',
    shortName: 'CSRD / ESRS E1',
    fullName: 'Corporate Sustainability Reporting Directive & ESRS E1 Klimawandel',
    norm: 'Richtlinie (EU) 2022/2464 & Delegierte Verordnung (EU) 2023/2772',
    level: 'ebene_5_finanzen',
    levelLabel: 'Ebene 5: Finanzen, Vergabe & Lieferketten',
    legalType: 'EU-Richtlinie (national umzusetzen)',
    audiences: ['finanzen', 'baustoffe'],
    primaryTarget: 'Börsennotierte und große Bauunternehmen, Wohnungsbaugesellschaften, Baustoffindustrie',
    leadQuote: 'Doppelte Wesentlichkeit und auditierte Offenlegung der Scope-3-Emissionen der Lieferkette.',
    coreSummary: 'Die CSRD löst die bisherige NFRD ab und zwingt rund 50 000 Unternehmen in Europa zu einer extern geprüften Nachhaltigkeitsberichterstattung im Lagebericht. Baukonzerne und Bestandshalter müssen nach Standard ESRS E1 ihre vor- und nachgelagerten Scope-3-Emissionen quantifizieren – das umfasst alle grauen Emissionen der eingekauften Baustoffe und Nachunternehmerleistungen.',
    keyDuties: [
      'Berichterstattung nach dem Prinzip der doppelten Wesentlichkeit (Impact & Financial Materiality).',
      'Detaillierte Bilanzierung von Scope 1, Scope 2 und vor allem Scope 3 (eingekaufte Güter & Baustoffe).',
      'Externe Prüfungspflicht durch Wirtschaftsprüfer (zunächst Limited, später Reasonable Assurance).',
      'Offenlegung von Transitionsplänen zur Erreichung des 1,5°C-Klimaziels.'
    ],
    impactOnMaterials: 'Baustoffhersteller, die ihren Kunden keine auditierten CO₂-Kennwerte (EPDs) liefern können, scheiden aus den Bieterlisten großer Baukonzerne und Wohnungsbaugesellschaften aus.',
    milestones: [
      { year: '2024', text: 'Große kapitalmarktorientierte Unternehmen (> 500 MA) berichten erstmals.' },
      { year: '2025', text: 'Alle großen Unternehmen (> 250 MA / 50 Mio. € Umsatz) unterliegen der CSRD.' },
      { year: '2026', text: 'Börsennotierte KMU folgen mit vereinfachten Standards.' }
    ]
  },
  {
    id: 'csddd_lksg',
    shortName: 'CSDDD & LkSG',
    fullName: 'EU-Lieferkettenrichtlinie (CSDDD) & deutsches Lieferkettensorgfaltspflichtengesetz',
    norm: 'Richtlinie (EU) 2024/1760 & deutsches LkSG vom 16.07.2021',
    level: 'ebene_5_finanzen',
    levelLabel: 'Ebene 5: Finanzen, Vergabe & Lieferketten',
    legalType: 'EU-Richtlinie (national umzusetzen)',
    audiences: ['baustoffe', 'finanzen'],
    primaryTarget: 'Große Bauunternehmen, Baustoffkonzerne, Importeure von Rohstoffen',
    leadQuote: 'Verbindliche menschenrechtliche und umweltbezogene Sorgfaltspflichten entlang der Rohstoffkette.',
    coreSummary: 'Die CSDDD und das deutsche LkSG verpflichten Großunternehmen zur Überwachung ihrer Lieferketten auf Menschenrechtsverletzungen (z. B. Kinderarbeit, Zwangsarbeit) und gravierende Umweltschäden (z. B. Gewässerverschmutzung, illegale Rodung). Im Bausektor stehen insbesondere Abbaugebiete für Natursteine, Sand/Kies, Kupfer, Bauxit und Holz im Fokus.',
    keyDuties: [
      'Einrichtung eines wirksamen betrieblichen Risikomanagements und regelmäßige Risikoanalysen.',
      'Verabschiedung einer Grundsatzerklärung zur Achtung der Menschenrechte und Umweltstandards.',
      'Ergreifung von Präventions- und Abhilfemaßnahmen bei festgestellten Verstößen von Vorlieferanten.',
      'Einrichtung eines zugänglichen Beschwerdeverfahrens entlang der Lieferkette.'
    ],
    impactOnMaterials: 'Erzwingt Auditierungen von Steinbrüchen in Übersee und zertifizierte Herkunftsnachweise für Gesteinskörnungen, Metalle und Hölzer.',
    milestones: [
      { year: '2023', text: 'LkSG gilt in DE für Unternehmen > 3000 Mitarbeiter.' },
      { year: '2024', text: 'LkSG-Schwelle sinkt in DE auf Unternehmen > 1000 Mitarbeiter.' },
      { year: '2027', text: 'Start der CSDDD für Konzerne > 5000 MA und 1,5 Mrd. € Umsatz.' },
      { year: '2029', text: 'Vollständige Anwendbarkeit der CSDDD (> 1000 MA / 450 Mio. € Umsatz).' }
    ]
  },
  {
    id: 'eudr_wald',
    shortName: 'EUDR (Entwaldung)',
    fullName: 'EU-Verordnung für entwaldungsfreie Lieferketten (Deforestation Regulation)',
    norm: 'Verordnung (EU) 2023/1115 vom 31. Mai 2023',
    level: 'ebene_5_finanzen',
    levelLabel: 'Ebene 5: Finanzen, Vergabe & Lieferketten',
    legalType: 'EU-Verordnung (unmittelbar)',
    audiences: ['baustoffe', 'planer'],
    primaryTarget: 'Holzbauunternehmen, Sägewerke, Holzbaustoffhersteller, Holzhändler',
    leadQuote: 'Verbot von Holzbaustoffen aus Entwaldung und Pflicht zur GPS-Geolokalisierung der Ursprungswälder.',
    coreSummary: 'Die EUDR verbietet das Inverkehrbringen und den Export von Holz und Holzerzeugnissen, es sei denn, sie sind nachweislich entwaldungsfrei (keine Entwaldung nach dem Stichtag 31.12.2020), wurden nach den Rechtsvorschriften des Erzeugerlandes geschlagen und verfügen über eine digital verifizierte Sorgfaltserklärung (Due Diligence Statement).',
    keyDuties: [
      'Erfassung der exakten GPS-Geokoordinaten aller Grundstücke, auf denen das Holz geerntet wurde.',
      'Abgleich mit hochauflösenden Satellitendaten zur Bestätigung von Nicht-Entwaldung seit 31.12.2020.',
      'Einreichung der Sorgfaltserklärung im zentralen EU-Informationssystem vor dem Inverkehrbringen.',
      'Umfasst Konstruktionsholz (BSH, KVH, CLT), Schalungsholz, Holzfaserdämmstoffe und Möbel.'
    ],
    impactOnMaterials: 'Verhindert den Einsatz von illegal geschlagenem oder waldschädigendem Holz im Bauwesen. Erhöht den Dokumentationsaufwand, stärkt jedoch zertifiziertes europäisches Holz nachhaltig.',
    milestones: [
      { year: '2023', text: 'Inkrafttreten der VO (EU) 2023/1115 am 29. Juni 2023.' },
      { year: '2024', text: 'Vorbereitung der IT-Schnittstellen und des EU-Tracingsystems.' },
      { year: '2026', text: 'Nach zweimaliger Verschiebung Anwendung ab 30.12.2026 für große und mittlere, ab 30.06.2027 für Kleinst- und Kleinunternehmen.' }
    ]
  },
  {
    id: 'gebaeudetyp_e',
    shortName: 'Gebäudetyp E (§ 650o BGB)',
    fullName: 'Gebäudetyp-E-Gesetz – Gesetz zur Erleichterung des einfachen Bauens (Entwurf)',
    norm: 'Entwurf § 650o BGB (BMJ Initiative 2024)',
    level: 'ebene_5_finanzen',
    levelLabel: 'Ebene 5: Finanzen, Vergabe & Lieferketten',
    legalType: 'Gesetzesinitiative',
    audiences: ['planer', 'bestand', 'baustoffe'],
    primaryTarget: 'Architekten, Ingenieure, Bauherren, Bauunternehmer, Wohnungsbau',
    leadQuote: 'Rechtlich belastbares Abweichen von übertriebenen Komfortnormen für ressourcenschonendes, einfaches Bauen.',
    coreSummary: 'Das geplante Gebäudetyp-E-Gesetz (Stand Oktober 2026 noch nicht in Kraft) schafft nach dem Entwurf eine zivilrechtliche Grundlage im Werkvertragsrecht (§ 650o BGB), damit Vertragsparteien wirksam von nicht-sicherheitsrelevanten Komfort- und Ausstattungsnormen (z. B. überdimensionierter Trittschallschutz, überbordende Elektroinstallationen) abweichen können. Die Haftungsfalle der "anerkannten Regeln der Technik" (aRdT) wird entschärft, ohne Standards bei Brandschutz und Statik zu senken.',
    keyDuties: [
      'Möglichkeit der vertraglichen Vereinbarung einfacher, suffizienter Bauweisen zwischen Fachkundigen.',
      'Abweichung von Komfortstandards führt nicht mehr automatisch zum Sachmangel nach BGB.',
      'Sicherheitsrelevante Basisanforderungen (Standsicherheit, Gesundheit, Brandschutz) bleiben uneingeschränkt verbindlich.',
      'Reduktion bautechnischer Komplexität zugunsten von Low-Tech und zirkulären Monomaterialien.'
    ],
    impactOnMaterials: 'Ermöglicht den Einsatz monolithischer Wandaufbauten (z. B. ungedämmter porosierter Hochlochziegel oder tragender Lehmbau DIN 18940), spart graue Energie in der TGA und senkt die Baukosten um bis zu 25 %.',
    milestones: [
      { year: '2024', text: 'Vorlage des Regierungsentwurfs für § 650o BGB durch das BMJ.' },
      { year: '2026', text: 'Gesetzgebungsverfahren noch nicht abgeschlossen (Stand Oktober 2026); Übernahme in Landesbauordnungen offen.' }
    ]
  }
];

export const RechtsrahmenKompendium: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<HierarchyLevel>('all');
  const [selectedAudience, setSelectedAudience] = useState<TargetAudience>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('kaskade');
  const [expandedId, setExpandedId] = useState<string | null>('epbd_2024');

  // Filter logic
  const filteredInstruments = useMemo(() => {
    return LEGAL_INSTRUMENTS.filter(item => {
      // Level filter
      if (selectedLevel !== 'all' && item.level !== selectedLevel) return false;
      // Audience filter
      if (selectedAudience !== 'all' && !item.audiences.includes(selectedAudience)) return false;
      // Search filter
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesName = item.shortName.toLowerCase().includes(q) || item.fullName.toLowerCase().includes(q);
        const matchesNorm = item.norm.toLowerCase().includes(q);
        const matchesSummary = item.coreSummary.toLowerCase().includes(q) || item.impactOnMaterials.toLowerCase().includes(q);
        const matchesDuties = item.keyDuties.some(d => d.toLowerCase().includes(q));
        if (!matchesName && !matchesNorm && !matchesSummary && !matchesDuties) return false;
      }
      return true;
    });
  }, [selectedLevel, selectedAudience, searchQuery]);

  // Count by level
  const countsByLevel = useMemo(() => {
    const counts: Record<string, number> = {
      all: LEGAL_INSTRUMENTS.length,
      ebene_1_strategie: 0,
      ebene_2_gebaeude: 0,
      ebene_3_baustoffe: 0,
      ebene_4_bepreisung: 0,
      ebene_5_finanzen: 0
    };
    LEGAL_INSTRUMENTS.forEach(inst => {
      counts[inst.level] = (counts[inst.level] || 0) + 1;
    });
    return counts;
  }, []);

  // Level Meta Information
  const levelMetadata = [
    {
      id: 'ebene_1_strategie' as HierarchyLevel,
      badge: 'Ebene 1',
      title: 'Strategischer Überbau & Klimaziele',
      desc: 'Makroökonomische Leitplanken, völker- und unionsrechtliche Treibhausgasminderungsziele bis 2030, 2040 und 2050.',
      color: 'border-shiraz/40 bg-shiraz/5 text-shiraz',
      activeColor: 'bg-shiraz text-white border-shiraz shadow-md'
    },
    {
      id: 'ebene_2_gebaeude' as HierarchyLevel,
      badge: 'Ebene 2',
      title: 'Gebäude, Quartiere & Bestand',
      desc: 'Ordnungsrechtliche Hüll-, Anlagentechnik- und Lebenszyklusstandards für Bestandsmodernisierung und Neubau.',
      color: 'border-sky-300 bg-sky-50/50 text-sky-900',
      activeColor: 'bg-sky-700 text-white border-sky-700 shadow-md'
    },
    {
      id: 'ebene_3_baustoffe' as HierarchyLevel,
      badge: 'Ebene 3',
      title: 'Baustoffe, Bauprodukte & Ökodesign',
      desc: 'Produktzulassungen, CE-Leistungserklärungen, digitale Produktpässe, Rezyklatquoten und Graue-Emissionen-Grenzwerte.',
      color: 'border-amber-300 bg-amber-50/50 text-amber-900',
      activeColor: 'bg-amber-700 text-white border-amber-700 shadow-md'
    },
    {
      id: 'ebene_4_bepreisung' as HierarchyLevel,
      badge: 'Ebene 4',
      title: 'Emissionshandel, Bepreisung & CBAM',
      desc: 'Marktwirtschaftliche CO₂-Zertifikate für Industrie und Gebäude sowie zollrechtlicher CO₂-Grenzausgleich gegen Carbon Leakage.',
      color: 'border-purple-300 bg-purple-50/50 text-purple-900',
      activeColor: 'bg-purple-700 text-white border-purple-700 shadow-md'
    },
    {
      id: 'ebene_5_finanzen' as HierarchyLevel,
      badge: 'Ebene 5',
      title: 'Finanzen, Vergabe & Lieferketten',
      desc: 'ESG-Offenlegung, Green Banking, Due Diligence in der Rohstoffgewinnung, Waldschutz und zivilrechtliche Suffizienz.',
      color: 'border-emerald-300 bg-emerald-50/50 text-emerald-900',
      activeColor: 'bg-emerald-700 text-white border-emerald-700 shadow-md'
    }
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-home-grau/20 pb-4">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-shiraz uppercase flex items-center gap-1.5 mb-1">
              <Scale size={14} /> Europäische &amp; Nationale Bau-Regulatorik
            </span>
            <h3 className="text-xl md:text-2xl font-extrabold text-text-main">
              Rechtsrahmen für Gebäudebestand &amp; Baumaterialien
            </h3>
            <p className="text-xs md:text-sm text-text-main/80 mt-1 max-w-3xl leading-relaxed">
              Hierarchische und didaktisch aufbereitete Synopse aller maßgeblichen europäischen und nationalen Rechtsvereinbarungen – vom europäischen Green Deal über die EPBD, BauPVO und ESPR bis zu den CO₂-Preisen des EU-ETS II und CBAM.
            </p>
          </div>
          
          {/* View Mode Toggle Buttons */}
          <ReiterLeiste label="Ansicht Rechtsrahmen" className="flex flex-wrap items-center gap-1.5 p-1 bg-off-white rounded-xl border border-home-grau/30 shrink-0">
            <button {...alsReiter(viewMode === 'kaskade', 'rechtsrahmen-ansicht', 'kaskade')}
              onClick={() => setViewMode('kaskade')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'kaskade'
                  ? 'bg-shiraz text-white shadow-xs'
                  : 'text-text-main/80 hover:bg-white hover:text-text-main'
              }`}
            >
              <Layers size={13} /> Kaskade (5 Ebenen)
            </button>
            <button {...alsReiter(viewMode === 'diagramm', 'rechtsrahmen-ansicht', 'diagramm')}
              onClick={() => setViewMode('diagramm')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'diagramm'
                  ? 'bg-shiraz text-white shadow-xs'
                  : 'text-text-main/80 hover:bg-white hover:text-text-main'
              }`}
            >
              <Globe size={13} /> System-Fluss
            </button>
            <button {...alsReiter(viewMode === 'timeline', 'rechtsrahmen-ansicht', 'timeline')}
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'timeline'
                  ? 'bg-shiraz text-white shadow-xs'
                  : 'text-text-main/80 hover:bg-white hover:text-text-main'
              }`}
            >
              <Calendar size={13} /> Fahrplan 2024–2050
            </button>
            <button {...alsReiter(viewMode === 'synopse', 'rechtsrahmen-ansicht', 'synopse')}
              onClick={() => setViewMode('synopse')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'synopse'
                  ? 'bg-shiraz text-white shadow-xs'
                  : 'text-text-main/80 hover:bg-white hover:text-text-main'
              }`}
            >
              <FileText size={13} /> Synopse-Matrix
            </button>
          </ReiterLeiste>
        </div>

        {/* Filter & Search Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Suchen Sie nach Gesetz, Kürzel (z.B. CBAM, BauPVO, EPBD), Pflicht..."
              className="w-full pl-9 pr-8 py-2 rounded-xl text-xs bg-off-white border border-home-grau/30 text-text-main placeholder:text-slate-400 focus:outline-none focus:border-shiraz focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700"
              >
                &times;
              </button>
            )}
          </div>

          {/* Audience Filter Pills */}
          <AuswahlGruppe label="Filter Zielgruppe" className="md:col-span-7 flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">Fokus:</span>
            {[
              { id: 'all' as TargetAudience, label: 'Alle Sektoren' },
              { id: 'bestand' as TargetAudience, label: '🏢 Gebäudebestand' },
              { id: 'baustoffe' as TargetAudience, label: '🧱 Baustoffe & Hersteller' },
              { id: 'planer' as TargetAudience, label: '📐 Planer & Architekten' },
              { id: 'finanzen' as TargetAudience, label: '💼 Finanzen & ESG' }
            ].map((aud) => (
              <button {...alsOption(selectedAudience === aud.id)}
                key={aud.id}
                onClick={() => setSelectedAudience(aud.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                  selectedAudience === aud.id
                    ? 'bg-shiraz text-white border-shiraz shadow-2xs'
                    : 'bg-white text-text-main/80 border-home-grau/30 hover:bg-off-white'
                }`}
              >
                {aud.label}
              </button>
            ))}
          </AuswahlGruppe>

        </div>

        {/* Level Selector Tabs */}
        <AuswahlGruppe label="Filter Ebene" className="flex flex-wrap gap-2 pt-2 border-t border-home-grau/15">
          <button {...alsOption(selectedLevel === 'all')}
            onClick={() => setSelectedLevel('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer flex items-center gap-1.5 ${
              selectedLevel === 'all'
                ? 'bg-shiraz text-white border-shiraz shadow-xs'
                : 'bg-white text-text-main/80 border-home-grau/30 hover:bg-off-white'
            }`}
          >
            Alle 5 Ebenen
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
              selectedLevel === 'all' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {countsByLevel.all}
            </span>
          </button>

          {levelMetadata.map((lvl) => (
            <button {...alsOption(selectedLevel === lvl.id)}
              key={lvl.id}
              onClick={() => setSelectedLevel(lvl.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer flex items-center gap-1.5 ${
                selectedLevel === lvl.id
                  ? `${lvl.activeColor} shadow-xs`
                  : 'bg-white text-text-main/80 border-home-grau/30 hover:bg-off-white'
              }`}
            >
              <span className="opacity-80">{lvl.badge}:</span> {lvl.title.split('&')[0].trim()}
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                selectedLevel === lvl.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {countsByLevel[lvl.id] || 0}
              </span>
            </button>
          ))}
        </AuswahlGruppe>

      </div>

      {/* VIEW MODE 1: KASKADEN-ANSICHT (HEURISTISCH 5 EBENEN) */}
      {viewMode === 'kaskade' && (
        <div {...reiterPanel('rechtsrahmen-ansicht', viewMode)} className="flex flex-col gap-8">
          {levelMetadata
            .filter(lvl => selectedLevel === 'all' || selectedLevel === lvl.id)
            .map((lvl) => {
              const itemsInLevel = filteredInstruments.filter(item => item.level === lvl.id);
              if (itemsInLevel.length === 0) return null;

              return (
                <div key={lvl.id} className="flex flex-col gap-3">
                  {/* Level Header Banner */}
                  <div className={`p-4 rounded-xl border ${lvl.color} flex flex-col md:flex-row md:items-center justify-between gap-2 shadow-2xs`}>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-white/80 border border-current shadow-2xs">
                          {lvl.badge}
                        </span>
                        <h4 className="text-base font-extrabold">{lvl.title}</h4>
                      </div>
                      <p className="text-xs opacity-90 mt-1 max-w-3xl leading-relaxed">
                        {lvl.desc}
                      </p>
                    </div>
                    <span className="text-xs font-bold opacity-80 shrink-0">
                      {itemsInLevel.length} Rechtsinstrument{itemsInLevel.length !== 1 ? 'e' : ''}
                    </span>
                  </div>

                  {/* Cards Grid for this level */}
                  <div className="grid grid-cols-1 gap-4">
                    {itemsInLevel.map((item) => {
                      const isExpanded = expandedId === item.id;
                      return (
                        <div
                          key={item.id}
                          className={`bg-white rounded-2xl border transition-all ${
                            isExpanded 
                              ? 'border-shiraz/50 shadow-md ring-1 ring-shiraz/20' 
                              : 'border-home-grau/30 shadow-xs hover:border-home-grau/50'
                          }`}
                        >
                          {/* Card Summary Header (Clickable) */}
                          <div
                            onClick={() => setExpandedId(isExpanded ? null : item.id)}
                            className="p-5 flex flex-col md:flex-row md:items-start justify-between gap-4 cursor-pointer select-none"
                          >
                            <div className="flex flex-col gap-1.5 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-extrabold text-sm md:text-base text-text-main flex items-center gap-1.5">
                                  {item.shortName}
                                </span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                                  item.legalType.includes('Verordnung')
                                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                                    : item.legalType.includes('Richtlinie')
                                    ? 'bg-purple-50 text-purple-700 border-purple-200'
                                    : item.legalType.includes('Bundesgesetz')
                                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                                    : 'bg-slate-100 text-slate-700 border-slate-200'
                                }`}>
                                  {item.legalType}
                                </span>
                                <span className="text-[10px] font-mono text-slate-400">
                                  {item.norm}
                                </span>
                              </div>

                              <h5 className="text-xs font-semibold text-slate-600">
                                {item.fullName}
                              </h5>

                              <p className="text-xs text-text-main/80 mt-1 leading-relaxed italic border-l-2 border-shiraz/40 pl-2 py-0.5 bg-off-white/60 rounded-r-lg">
                                &bdquo;{item.leadQuote}&ldquo;
                              </p>
                            </div>

                            <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                              {/* Audience Badges */}
                              <div className="hidden sm:flex items-center gap-1">
                                {item.audiences.map(aud => (
                                  <span key={aud} className="text-[9px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                                    {aud === 'bestand' ? 'Bestand' : aud === 'baustoffe' ? 'Baustoffe' : aud === 'planer' ? 'Planer' : 'Finanzen'}
                                  </span>
                                ))}
                              </div>

                              <button type="button" aria-expanded={isExpanded} aria-label={`${item.fullName}: Details ${isExpanded ? 'einklappen' : 'aufklappen'}`} className="w-8 h-8 rounded-lg bg-off-white border border-home-grau/30 flex items-center justify-center text-slate-600 hover:text-shiraz transition-colors">
                                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                              </button>
                            </div>
                          </div>

                          {/* Expanded Details Body */}
                          {isExpanded && (
                            <div className="px-5 pb-6 pt-2 border-t border-home-grau/20 flex flex-col gap-5 animate-in fade-in duration-200">
                              
                              {/* 1. Core Summary */}
                              <div className="bg-off-white p-4 rounded-xl border border-home-grau/25 text-xs text-text-main/90 leading-relaxed">
                                <strong className="text-text-main block mb-1 font-bold text-xs">
                                  Systematik &amp; Gesetzgebungshintergrund:
                                </strong>
                                <p>{item.coreSummary}</p>
                              </div>

                              {/* 2. Key Duties & Duties for Buildings */}
                              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                <div className="md:col-span-7 bg-slate-50/70 p-4 rounded-xl border border-home-grau/25 flex flex-col gap-2">
                                  <h6 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
                                    <ShieldCheck size={14} className="text-shiraz" />
                                    Verbindliche Kernpflichten für den Gebäudebestand
                                  </h6>
                                  <ul className="text-xs space-y-2 text-text-main/80 mt-1">
                                    {item.keyDuties.map((duty, idx) => (
                                      <li key={idx} className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-shiraz shrink-0 mt-1.5" />
                                        <span>{duty}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                <div className="md:col-span-5 bg-rose-50/40 p-4 rounded-xl border border-rose-200/60 flex flex-col gap-2">
                                  <h6 className="text-xs font-bold text-rose-900 flex items-center gap-1.5 uppercase tracking-wide">
                                    <HardHat size={14} className="text-shiraz" />
                                    Konsequenz für Baustoffe &amp; Materialwahl
                                  </h6>
                                  <p className="text-xs text-rose-950/80 leading-relaxed mt-1">
                                    {item.impactOnMaterials}
                                  </p>
                                </div>
                              </div>

                              {/* 3. Mathematical Formula if present */}
                              {item.formula && (
                                <div className="bg-[#fcf8f2] p-4 rounded-xl border border-amber-200/60 flex flex-col gap-2">
                                  <div className="flex items-center justify-between text-[10px] font-bold text-amber-900 uppercase">
                                    <span>Berechnungsvorschrift &amp; Gesetzesnorm</span>
                                    <span className="font-mono text-slate-500">{item.formula.source}</span>
                                  </div>
                                  <div className="my-1 text-center overflow-x-auto py-1">
                                    <BlockMath math={item.formula.math} />
                                  </div>
                                  <p className="text-xs text-slate-700 italic text-center">
                                    {item.formula.explanation}
                                  </p>
                                </div>
                              )}

                              {/* 4. Timeline Milestones */}
                              <div className="border-t border-home-grau/20 pt-3 flex flex-col gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                                  <Calendar size={12} /> Stichtage &amp; Vollzugsmeilensteine:
                                </span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                                  {item.milestones.map((ms, idx) => (
                                    <div key={idx} className="p-2.5 rounded-lg bg-off-white border border-home-grau/25 text-[11px]">
                                      <strong className="block text-shiraz font-mono font-bold text-xs">{ms.year}</strong>
                                      <span className="text-slate-600 leading-tight block mt-0.5">{ms.text}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                            </div>
                          )}

                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* VIEW MODE 2: INTERAKTIVES KASKADEN-DIAGRAMM (SYSTEMATIK-FLUSS) */}
      {viewMode === 'diagramm' && (
        <div {...reiterPanel('rechtsrahmen-ansicht', viewMode)} className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
          <div className="border-b border-home-grau/20 pb-3">
            <span className="text-[10px] font-bold text-shiraz uppercase tracking-widest">Top-Down Kaskade</span>
            <h4 className="text-base font-extrabold text-text-main mt-0.5">
              Wie der europäische Green Deal bis in die Baustelle und den Baustoff durchgreift
            </h4>
            <p className="text-xs text-text-main/80 mt-1">
              Die regulatorische Architektur folgt einem strengen kaskadierenden Prinzip: Übergeordnete Klimaziele werden in sektorales Ordnungsrecht, Produktzulassungen und CO₂-Preissignale transformiert.
            </p>
          </div>

          <div className="flex flex-col gap-4 relative">
            
            {/* Step 1: Überbau */}
            <div className="p-5 rounded-xl border border-rose-300 bg-rose-50/50 flex flex-col gap-2 relative">
              <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider">
                1. Politischer Überbau &amp; Klimaziele (EU &amp; Bund)
              </span>
              <h5 className="font-extrabold text-sm text-rose-950">
                European Green Deal &bull; EU-Klimagesetz (-55 % bis 2030, Netto-Null 2050) &bull; Fit for 55 &bull; KSG 2045
              </h5>
              <p className="text-xs text-rose-900/80 leading-relaxed">
                Legt das unumstößliche Budget für alle Wirtschaftsbereiche fest. Dekretiert die Verdopplung der Sanierungsrate und schließt Nichtstun juristisch aus.
              </p>
              <div className="flex justify-center -mb-7 mt-2 z-10">
                <span className="w-6 h-6 rounded-full bg-rose-700 text-white flex items-center justify-center text-xs shadow-md">
                  &darr;
                </span>
              </div>
            </div>

            {/* Split Grid: 4 Säulen */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-3">
              
              {/* Säule A: Gebäudeordnung */}
              <div className="p-4 rounded-xl border border-blue-300 bg-blue-50/40 flex flex-col gap-2.5">
                <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider">
                  2. Gebäude-Ordnungsrecht
                </span>
                <h6 className="font-bold text-xs text-blue-950">
                  EPBD (2024/1275) &bull; GEG / GModG &bull; WPG
                </h6>
                <p className="text-[11px] text-blue-900/80 leading-relaxed">
                  <strong>Anforderung:</strong> Null-Emissions-Gebäude (ZEB), 65-%-EE-Heizungen, Pflicht zum Lebenszyklus-GWP im Energieausweis, MEPS-Sanierungspfad für den Bestand.
                </p>
                <div className="mt-auto pt-2 border-t border-blue-200 text-[10px] text-blue-900 font-semibold">
                  Wirkt auf: Bauherren &amp; Eigentümer
                </div>
              </div>

              {/* Säule B: Baustoffzulassung & Ökodesign */}
              <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/40 flex flex-col gap-2.5">
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                  3. Baustoffe &amp; Ökodesign
                </span>
                <h6 className="font-bold text-xs text-amber-950">
                  BauPVO 2024 &bull; ESPR &bull; EMoCo &bull; EBV
                </h6>
                <p className="text-[11px] text-amber-900/80 leading-relaxed">
                  <strong>Anforderung:</strong> CE-Umweltdeklaration (GWP), Digitaler Bauproduktpass (DPP), Begrenzung grauer Emissionen (Embodied Carbon), Ersatzbaustoffe.
                </p>
                <div className="mt-auto pt-2 border-t border-amber-200 text-[10px] text-amber-900 font-semibold">
                  Wirkt auf: Baustoffindustrie &amp; Planer
                </div>
              </div>

              {/* Säule C: CO2-Bepreisung & Außenhandel */}
              <div className="p-4 rounded-xl border border-purple-300 bg-purple-50/40 flex flex-col gap-2.5">
                <span className="text-[10px] font-bold text-purple-800 uppercase tracking-wider">
                  4. CO₂-Bepreisung &amp; ETS
                </span>
                <h6 className="font-bold text-xs text-purple-950">
                  EU-ETS I &bull; EU-ETS II &bull; CBAM &bull; BEHG
                </h6>
                <p className="text-[11px] text-purple-900/80 leading-relaxed">
                  <strong>Anforderung:</strong> ETS II verteuert fossiles Heizen im Bestand ab 2027; CBAM gleicht CO₂-Preise an Außengrenzen für Zement und Stahl aus; Klinker wird im ETS I teurer.
                </p>
                <div className="mt-auto pt-2 border-t border-purple-200 text-[10px] text-purple-900 font-semibold">
                  Wirkt auf: Brennstoffpreise &amp; Materialkosten
                </div>
              </div>

              {/* Säule D: Finanzmarkt & Transparenz */}
              <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50/40 flex flex-col gap-2.5">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                  5. Kapitalmarkt &amp; ESG
                </span>
                <h6 className="font-bold text-xs text-emerald-950">
                  EU-Taxonomie &bull; CSRD / ESRS &bull; CSDDD
                </h6>
                <p className="text-[11px] text-emerald-900/80 leading-relaxed">
                  <strong>Anforderung:</strong> DNSH-Kriterien, Scope-3-Offenlegung (graue Emissionen der Lieferkette), Banken fordern Green-Loan-Konformität (Primärenergie -10 %).
                </p>
                <div className="mt-auto pt-2 border-t border-emerald-200 text-[10px] text-emerald-900 font-semibold">
                  Wirkt auf: Kreditzinsen &amp; Marktwert
                </div>
              </div>

            </div>

            {/* Bottom Target Convergence */}
            <div className="p-4 rounded-xl border border-home-grau/30 bg-off-white text-text-main flex flex-col md:flex-row md:items-center justify-between gap-3 mt-2 shadow-xs">
              <div className="flex items-center gap-3">
                <Sparkles size={20} className="text-shiraz shrink-0" />
                <div>
                  <strong className="block text-xs md:text-sm font-bold text-shiraz">
                    Zielpunkt 2045 / 2050: Der vollständig dekarbonisierte, zirkuläre Gebäudebestand
                  </strong>
                  <span className="text-[11px] text-text-main/80 font-normal">
                    Kombination aus hocheffizienter Hülle (U ≤ 0,14 W/m²K), Niedertemperatur-Wärmepumpen / Wärmenetzen und biogenen bzw. klinkerminimalen Baustoffen.
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold px-3 py-1 bg-shiraz/10 text-shiraz rounded-full border border-shiraz/20 shrink-0">
                100 % Paris 1,5&deg;C Aligniert
              </span>
            </div>

          </div>
        </div>
      )}

      {/* VIEW MODE 3: TIMELINE (CHRONOLOGISCHER STUFENFAHRPLAN 2024–2050) */}
      {viewMode === 'timeline' && (
        <div {...reiterPanel('rechtsrahmen-ansicht', viewMode)} className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
          <div className="border-b border-home-grau/20 pb-3">
            <span className="text-[10px] font-bold text-shiraz uppercase tracking-widest">Chronologischer Stufenfahrplan</span>
            <h4 className="text-base font-extrabold text-text-main mt-0.5">
              Meilensteine &amp; Stichtage: Wann welche Vorschrift verbindlich scharfgestellt wird
            </h4>
            <p className="text-xs text-text-main/80 mt-1">
              Überblick aller regulatorischen Pflichttermine zwischen 2024 und 2050 für Bauherren, Bestandshalter und Baustoffproduzenten.
            </p>
          </div>

          <div className="relative border-l-2 border-shiraz/30 ml-4 md:ml-6 pl-4 md:pl-6 space-y-6">
            
            {[
              {
                year: '2023 / 2024',
                status: 'Bereits wirksam',
                title: 'Inkrafttreten der Basispakete',
                badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
                items: [
                  'EBV (01.08.2023): Mineralische Ersatzbaustoffe bundesweit einheitlich klassifiziert; Katasterpflicht ab 250 m³.',
                  'CBAM (01.10.2023): Start der Übergangsphase mit Quartalsberichten über Importemissionen für Zement und Stahl.',
                  'GEG (01.01.2024): 65-%-EE-Pflicht bei Neubauten in Neubaugebieten.',
                  'EPBD IV (Mai 2024): Inkrafttreten der Richtlinie EU 2024/1275; 24 Monate Umsetzungsfrist.',
                  'ESPR (Juli 2024): Inkrafttreten der Ökodesign-Verordnung EU 2024/1781.'
                ]
              },
              {
                year: '2025',
                status: 'Kommender Stichtag',
                title: 'Subventionsstopp & Vorbereitung ETS II',
                badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
                items: [
                  'EPBD Subventionsstopp: Ab 01.01.2025 dürfen die EU-Staaten keine finanziellen Anreize mehr für eigenständige fossile Kessel gewähren.',
                  'CSRD Ausweitung: Große nicht-kapitalmarktorientierte Unternehmen (> 250 MA) müssen Scope-3-Emissionen erfassen.',
                  'ETS II Monitoring: Start der behördlichen Emissionserfassung für Brennstoffhändler.',
                  'EUDR Entwaldung: Scharfstellung für Großunternehmen beim Inverkehrbringen von Holzprodukten.'
                ]
              },
              {
                year: '2026',
                status: 'Zentraler Wendepunkt',
                title: 'Nationale EPBD-Umsetzung, CBAM-Zahlungen & Wärmeplanung',
                badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
                items: [
                  'EPBD Nationale Frist (Mai 2026): Novelle des deutschen Gebäudeenergiegesetzes (GEG) zur Verankerung der EPBD-Vorgaben.',
                  'CBAM Zahlungsphase (01.01.2026): Importeure von Zement, Stahl und Aluminium müssen offizielle CBAM-Zertifikate erwerben.',
                  'Wärmeplanung Großstädte: Bis 30.06.2026 müssen Kommunen > 100 000 Einw. Wärmepläne vorlegen.',
                  'EU-ETS I Klinker-Abschlag: Erstes Abschmelzen freier Zertifikatezuteilungen für Zementwerke (-2,5 %).'
                ]
              },
              {
                year: '2027',
                status: 'Kostenrevolution',
                title: 'Start des EU-ETS II & Digitaler Bauproduktpass',
                badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
                items: [
                  'EU-ETS II Start: Europaweiter CO₂-Handel für Heizöl und Erdgas im Gebäudesektor beginnt (sprunghafter Preisanstieg bei fossilen Heizungen).',
                  'BauPVO Digitaler Bauproduktpass: Erste delegierte Rechtsakte verpflichten zur digitalen Bereitstellung von EPDs per QR-Code.'
                ]
              },
              {
                year: '2028',
                status: 'Neubau-Zäsur',
                title: 'ZEB & Lebenszyklus-GWP für öffentliche Großbauten',
                badgeColor: 'bg-rose-100 text-rose-900 border-rose-300',
                items: [
                  'EPBD ZEB-Pflicht: Alle neuen öffentlichen Gebäude müssen dem Null-Emissions-Standard (ZEB) entsprechen.',
                  'EPBD GWP-Pflicht: Verpflichtende Ausweisung des Lebenszyklus-Treibhauspotenzials (GWP) im Energieausweis für Neubauten > 1000 m².',
                  'Wärmeplanung flächendeckend: Bis 30.06.2028 müssen alle 11 000 deutschen Kommunen fertige Wärmepläne haben.'
                ]
              },
              {
                year: '2030',
                status: 'Fit-for-55 Zieljahr',
                title: 'ZEB für ALLE Neubauten & MEPS-Sanierungspfad',
                badgeColor: 'bg-shiraz/15 text-shiraz border-shiraz/30',
                items: [
                  'EPBD ZEB für ALLE Neubauten: Ausnahmslos jedes neue Gebäude muss ein Null-Emissions-Gebäude sein.',
                  'EPBD Lebenszyklus-GWP für ALLE Neubauten: GWP-Berechnung wird ausnahmslos für jedes Wohn- und Nichtwohngebäude zur Pflicht.',
                  'MEPS Nichtwohngebäude: Die schlechtesten 16 % aller gewerblichen Bestandsgebäude müssen saniert sein.',
                  'Wohngebäude: 16 % Einsparung des durchschnittlichen Primärenergieverbrauchs im nationalen Wohnbestand.',
                  'KSG Sektorziel: Deutsche Gebäudeemissionen sinken auf maximal 67 Mio. t CO₂e.'
                ]
              },
              {
                year: '2033 / 2035',
                status: 'Tiefensanierung',
                title: 'Zweite Stufe MEPS & 20–22 % Einsparung',
                badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
                items: [
                  '2033: 26 % der ineffizientesten Nichtwohngebäude müssen energetisch modernisiert sein.',
                  '2035: Durchschnittlicher Primärenergieverbrauch im Wohngebäudebestand sinkt um 20–22 %.'
                ]
              },
              {
                year: '2040',
                status: 'Fossilausstieg',
                title: 'Komplettes Verbot fossiler Kessel in der gesamten EU',
                badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
                items: [
                  'EPBD Fossilausstieg: Spätestens 2040 dürfen keine Gebäude in der EU mehr mit fossilen Brennstoffen (Erdgas, Öl, Kohle) beheizt werden.'
                ]
              },
              {
                year: '2045 / 2050',
                status: 'Zielzustand',
                title: 'Vollständige Netto-Treibhausgasneutralität',
                badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
                items: [
                  '2045: Deutschland erreicht gesetzlich verbindliche Treibhausgasneutralität (KSG).',
                  '2050: Gesamte Europäische Union erreicht Klimaneutralität (Europäisches Klimagesetz).'
                ]
              }
            ].map((slot, idx) => (
              <div key={idx} className="relative flex flex-col gap-2">
                <span className="absolute -left-[25px] md:-left-[33px] top-1 w-4 h-4 rounded-full bg-shiraz border-4 border-white shadow-xs" />
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono font-bold text-sm md:text-base text-shiraz">{slot.year}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${slot.badgeColor}`}>
                    {slot.status}
                  </span>
                  <h5 className="font-bold text-xs md:text-sm text-text-main">{slot.title}</h5>
                </div>
                <div className="p-3 rounded-xl bg-off-white border border-home-grau/25 space-y-1.5 text-xs text-text-main/80">
                  {slot.items.map((it, iIdx) => (
                    <div key={iIdx} className="flex items-start gap-2">
                      <ArrowRight size={13} className="text-shiraz shrink-0 mt-0.5" />
                      <span>{it}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

          </div>
        </div>
      )}

      {/* VIEW MODE 4: SYNOPSE-MATRIX (TABELLARISCHER SCHNELLVERGLEICH) */}
      {viewMode === 'synopse' && (
        <div {...reiterPanel('rechtsrahmen-ansicht', viewMode)} className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
          <div className="border-b border-home-grau/20 pb-3">
            <span className="text-[10px] font-bold text-shiraz uppercase tracking-widest">Rechtsnormen-Synopse</span>
            <h4 className="text-base font-extrabold text-text-main mt-0.5">
              Direktvergleich aller {LEGAL_INSTRUMENTS.length} Rechtsinstrumente
            </h4>
            <p className="text-xs text-text-main/80 mt-1">
              Gegenüberstellung von Rechtscharakter, Adressatenkreis, Kernpflichten und Relevanz für Baumaterialien.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-home-grau/30 bg-off-white text-[11px] font-bold text-text-main uppercase">
                  <th className="p-3">Kürzel &amp; Name</th>
                  <th className="p-3">Ebene &amp; Norm</th>
                  <th className="p-3">Rechtscharakter</th>
                  <th className="p-3">Geltungsbereich</th>
                  <th className="p-3">Kernpflicht</th>
                  <th className="p-3">Auswirkung Baustoffe</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-home-grau/20">
                {filteredInstruments.map((item) => (
                  <tr key={item.id} className="hover:bg-off-white/60 transition-colors">
                    <td className="p-3 font-bold text-text-main align-top whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-shiraz font-bold">{item.shortName}</span>
                        <span className="text-[10px] text-slate-400 font-normal max-w-[140px] truncate">{item.fullName}</span>
                      </div>
                    </td>
                    <td className="p-3 align-top whitespace-nowrap">
                      <span className="block text-[10px] font-semibold text-slate-500">{item.levelLabel.split(':')[0]}</span>
                      <span className="font-mono text-[10px] text-slate-400">{item.norm.slice(0, 24)}...</span>
                    </td>
                    <td className="p-3 align-top">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border inline-block whitespace-nowrap ${
                        item.legalType.includes('Verordnung')
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : item.legalType.includes('Richtlinie')
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                        {item.legalType.split('(')[0].trim()}
                      </span>
                    </td>
                    <td className="p-3 align-top text-[11px] text-slate-600">
                      {item.primaryTarget}
                    </td>
                    <td className="p-3 align-top text-[11px] text-slate-700 max-w-xs">
                      {item.keyDuties[0]}
                    </td>
                    <td className="p-3 align-top text-[11px] text-slate-700 max-w-xs">
                      {item.impactOnMaterials}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Info Callout */}
      <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30 text-xs text-text-main/80 flex items-start gap-2 leading-relaxed">
        <Info size={16} className="text-shiraz shrink-0 mt-0.5" />
        <span>
          <strong>Praxishinweis zur Rechtsanwendung:</strong> EU-Verordnungen (wie BauPVO 2024/3110, ESPR 2024/1781 oder CBAM 2023/956) gelten ab ihrem Inkrafttreten unmittelbar und verbindlich in jedem Mitgliedstaat. EU-Richtlinien (wie EPBD 2024/1275 oder CSRD 2022/2464) bedürfen der Überführung in deutsches Bundesrecht (insbesondere über GEG-Novellen und HGB).
        </span>
      </div>

    </div>
  );
};
