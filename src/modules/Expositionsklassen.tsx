import React, { useState, useMemo } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { 
  Grid, 
  BookOpen, 
  Beaker, 
  Calculator, 
  HelpCircle, 
  ShieldAlert, 
  ShieldCheck,
  Droplets, 
  Snowflake, 
  Waves, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  ArrowRight,
  Filter,
  Check,
  Scale,
  Building2,
  Compass,
  Eye
} from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';
import { formatDeZahl } from '@/src/utils/numberFormat';

// ============================================================================
// NORMATIVE DATENBANK: DIN EN 206:2021-06 & DIN 1045-2:2023-08 (Tab. F.2.1/F.2.2)
// KEINE Krell-Näherungswerte – 100% reine Normenwerte nach DIN 1045-2
// ============================================================================

export interface NormExposureClass {
  code: string;
  family: 'X0' | 'XC' | 'XD' | 'XS' | 'XF' | 'XA' | 'XM';
  title: string;
  description: string;
  examples: string;
  maxWzEq: number | null; // null bedeutet keine normative Begrenzung
  minStrengthClass: string;
  minCement: {
    dmax32: number;
    dmax22: number;
    dmax16: number;
    dmax8: number;
  } | null;
  minAirContent?: {
    dmax32: number;
    dmax16: number;
    dmax8: number;
  };
  requiresAirEntrainment?: boolean;
  minCoverDurMm: number; // nach DIN EN 1992-1-1/NA:2013-04 (50 Jahre Nutzungsdauer)
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
    minCoverDurMm: 10,
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
    minCement: { dmax32: 240, dmax22: 250, dmax16: 260, dmax8: 280 },
    minCoverDurMm: 15,
    specialNotes: 'Bei ständig unter Wasser getauchten Bauteilen gilt c_min,dur = 20 mm.'
  },
  {
    code: 'XC2',
    family: 'XC',
    title: 'Nass, selten trocken',
    description: 'Teile von Wasserbehältern; Gründungsbauteile; Bauteile, die langzeitig Wasser oder feuchtem Boden ausgesetzt sind.',
    examples: 'Fundamente im feuchten Erdreich (ohne Frost); Schachtbauwerke; Wasserbehälter.',
    maxWzEq: 0.65,
    minStrengthClass: 'C20/25',
    minCement: { dmax32: 240, dmax22: 250, dmax16: 260, dmax8: 280 },
    minCoverDurMm: 25,
    specialNotes: 'Bewehrte Fundamente in Deutschland meist standardmäßig C25/30.'
  },
  {
    code: 'XC3',
    family: 'XC',
    title: 'Mäßige Feuchte',
    description: 'Bauteile, zu denen die Außenluft häufigen Zutritt hat; Innenräume mit mäßiger bis hoher Luftfeuchtigkeit.',
    examples: 'Offene Hallen, Vordächer, Viehställe, gewerbliche Großküchen, Hallenbäder.',
    maxWzEq: 0.65,
    minStrengthClass: 'C20/25',
    minCement: { dmax32: 260, dmax22: 270, dmax16: 280, dmax8: 300 },
    minCoverDurMm: 25
  },
  {
    code: 'XC4',
    family: 'XC',
    title: 'Wechselnd nass und trocken',
    description: 'Außenbauteile mit direkter Beregnung und anschließender Austrocknung.',
    examples: 'Außenwände, Balkone, frei bewitterte Stützen und Fassadenelemente.',
    maxWzEq: 0.60,
    minStrengthClass: 'C25/30',
    minCement: { dmax32: 280, dmax22: 290, dmax16: 300, dmax8: 320 },
    minCoverDurMm: 30
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
    minCement: { dmax32: 300, dmax22: 310, dmax16: 320, dmax8: 340 },
    minCoverDurMm: 35
  },
  {
    code: 'XD2',
    family: 'XD',
    title: 'Nass, selten trocken (Sole)',
    description: 'Bauteile, die chloridhaltigen Industrieabwässern oder Solebädern ausgesetzt sind.',
    examples: 'Schwimmbecken mit Sole/Meerwasserzusatz; Industrieanlagen mit salzhaltigem Brauchwasser.',
    maxWzEq: 0.50,
    minStrengthClass: 'C35/45',
    minCement: { dmax32: 320, dmax22: 330, dmax16: 340, dmax8: 360 },
    minCoverDurMm: 40,
    specialNotes: 'Nach DIN 1045-2 Anhang F ist alternativ C30/37 bei w/z_eq <= 0,50 zulässig.'
  },
  {
    code: 'XD3',
    family: 'XD',
    title: 'Wechselnd nass und trocken (Direkte Taumittel)',
    description: 'Teile von Brücken und Straßen, die direkt mit taumittelhaltigem Spritzwasser beaufschlagt werden; Parkdecks.',
    examples: 'Fahrbahndecken von Parkhäusern ohne Oberflächenschutz; Brückenkappen; Spritzwasserbereiche von Autobahnstützwänden.',
    maxWzEq: 0.45,
    minStrengthClass: 'C35/45',
    minCement: { dmax32: 320, dmax22: 330, dmax16: 340, dmax8: 360 },
    minCoverDurMm: 45,
    specialNotes: 'Bei ZTV-ING ist LP-Beton vorgeschrieben; bei direkt befahrenen Parkbauten zwingend OS-Beschichtung oder WU-Konstruktion.'
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
    minCement: { dmax32: 300, dmax22: 310, dmax16: 320, dmax8: 340 },
    minCoverDurMm: 35
  },
  {
    code: 'XS2',
    family: 'XS',
    title: 'Ständig unter Meerwasser',
    description: 'Teile von Meeresbauwerken dauerhaft untergetaucht.',
    examples: 'Pfeiler und Gründungen im Hafenbecken unter dem Niedrigwasserstand.',
    maxWzEq: 0.50,
    minStrengthClass: 'C35/45',
    minCement: { dmax32: 320, dmax22: 330, dmax16: 340, dmax8: 360 },
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
    minCement: { dmax32: 320, dmax22: 330, dmax16: 340, dmax8: 360 },
    minCoverDurMm: 45
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
    minCement: { dmax32: 280, dmax22: 290, dmax16: 300, dmax8: 320 },
    minCoverDurMm: 30,
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
    minCement: { dmax32: 300, dmax22: 310, dmax16: 320, dmax8: 340 },
    requiresAirEntrainment: true,
    minAirContent: { dmax32: 4.0, dmax16: 4.5, dmax8: 5.5 },
    minCoverDurMm: 35,
    specialNotes: 'DIN 1045-2 erlaubt alternativ Beton ohne LP mit w/z_eq <= 0,50 und C35/45 (z_min = 320 kg/m³).'
  },
  {
    code: 'XF3',
    family: 'XF',
    title: 'Hohe Sättigung ohne Taumittel',
    description: 'Horizontale Außenbauteile mit Wasseransammlung bei Frost (ohne Tausalze).',
    examples: 'Frei bewitterte Decken, Brüstungsabdeckungen, Wehre und Klärbecken im Frostbereich.',
    maxWzEq: 0.55,
    minStrengthClass: 'C25/30',
    minCement: { dmax32: 300, dmax22: 310, dmax16: 320, dmax8: 340 },
    requiresAirEntrainment: true,
    minAirContent: { dmax32: 4.0, dmax16: 4.5, dmax8: 5.5 },
    minCoverDurMm: 30,
    specialNotes: 'DIN 1045-2 erlaubt alternativ Beton ohne LP mit w/z_eq <= 0,50 und C35/45 (z_min = 320 kg/m³).'
  },
  {
    code: 'XF4',
    family: 'XF',
    title: 'Hohe Sättigung mit Taumittel',
    description: 'Horizontale Bauteile mit direkter Tausalzbeaufschlagung und hoher Wassersättigung.',
    examples: 'Direkt befahrene Fahrbahnen von Straßen und Brücken; Flugbetriebsflächen; Parkdecks.',
    maxWzEq: 0.50,
    minStrengthClass: 'C30/37',
    minCement: { dmax32: 320, dmax22: 330, dmax16: 340, dmax8: 360 },
    requiresAirEntrainment: true,
    minAirContent: { dmax32: 4.0, dmax16: 4.5, dmax8: 5.5 },
    minCoverDurMm: 40,
    specialNotes: 'Beton ohne LP bei XF4 nur nach speziellem Eignungsnachweis (z. B. CDF-Prüfung) mit w/z_eq <= 0,45 und C35/45 zulässig.'
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
    minCement: { dmax32: 280, dmax22: 290, dmax16: 300, dmax8: 320 },
    minCoverDurMm: 30
  },
  {
    code: 'XA2',
    family: 'XA',
    title: 'Chemisch mäßig angreifend',
    description: 'Böden und Grundwässer mit mäßigem chemischen Angriff sowie sulfatreiche Wässer.',
    examples: 'Klärbecken, Güllebehälter, Erdbauwerke in sulfatreichen Böden (SO4: 600–3000 mg/l im Wasser).',
    maxWzEq: 0.50,
    minStrengthClass: 'C35/45',
    minCement: { dmax32: 320, dmax22: 330, dmax16: 340, dmax8: 360 },
    minCoverDurMm: 35,
    specialNotes: 'Bei Sulfatgehalt > 600 mg/l im Wasser ist zwingend SR-Zement (hoher Sulfatwiderstand nach DIN EN 197-1) vorgeschrieben!'
  },
  {
    code: 'XA3',
    family: 'XA',
    title: 'Chemisch stark angreifend',
    description: 'Stark saure Böden (pH 4,0–4,5) oder stark sulfathaltiges Grundwasser (3000–6000 mg/l).',
    examples: 'Industrieabwasserkanäle, Kühltürme, Biogasanlagen, Silos.',
    maxWzEq: 0.45,
    minStrengthClass: 'C35/45',
    minCement: { dmax32: 320, dmax22: 330, dmax16: 340, dmax8: 360 },
    minCoverDurMm: 40,
    specialNotes: 'Zwingend SR-Zement + zusätzliche Schutzmaßnahmen (z. B. Beschichtungen nach DIN EN 1504).'
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
    minCement: { dmax32: 300, dmax22: 310, dmax16: 320, dmax8: 340 },
    minCoverDurMm: 30,
    specialNotes: 'Oberflächenbehandlung (z. B. Vakuumieren oder maschinelles Flügelglätten) erforderlich.'
  },
  {
    code: 'XM2',
    family: 'XM',
    title: 'Schwere Verschleißbeanspruchung',
    description: 'Flächen befahren von luft- oder vollgummibereiften Gabelstaplern bis 90 kN.',
    examples: 'Industriehallenböden mit regelmäßigem Gabelstaplerverkehr.',
    maxWzEq: 0.45,
    minStrengthClass: 'C35/45',
    minCement: { dmax32: 320, dmax22: 330, dmax16: 340, dmax8: 360 },
    minCoverDurMm: 35,
    specialNotes: 'Oberflächenvergütung oder Hartstoffeinstreuung nach DIN 1100 erforderlich.'
  },
  {
    code: 'XM3',
    family: 'XM',
    title: 'Sehr schwere Verschleißbeanspruchung',
    description: 'Flächen mit Kettenfahrzeugen, Stahlrollen-Hubwagen oder extremem Schleifabrieb.',
    examples: 'Panzerhallen, Umschlaghallen für Schrott, Holzbringungsanlagen.',
    maxWzEq: 0.45,
    minStrengthClass: 'C35/45',
    minCement: { dmax32: 320, dmax22: 330, dmax16: 340, dmax8: 360 },
    minCoverDurMm: 35,
    specialNotes: 'Zwingend Hartstoffestrich nach DIN 18560-7 unter Verwendung von Hartstoffen nach DIN 1100.'
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
// DIN EN 206-1 / DIN 1045-2 / DIN EN 1992-1-1 (Eurocode 2)
// ============================================================================

interface BuildingZoneInfo {
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

const BUILDING_ZONES: BuildingZoneInfo[] = [
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
    cNom: 50,
    mechanism: 'Lochfraßkorrosion durch Tausalz-Chloride ohne pH-Absenkung + Frost-Tau-Skalierung + Schleifabrieb von PKW-Reifen. AKR-Gefahr durch ständige Alkalizufuhr (Feuchteklasse WA).',
    practicalTips: 'Rissbreitenbeschränkung w_k <= 0,2 mm oder geprüfte Schutzbeschichtung (OS 8 / OS 11a nach TR Instandhaltung). NA-Zement oder alkalifreie Gesteinskörnung (Klasse E I) erforderlich.',
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
    cNom: 35,
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
    minCement: 280,
    cMinDur: 25,
    cNom: 35,
    mechanism: 'Starke Durchfeuchtung durch stehendes Wasser führt bei Frosteinbruch zu hohem hydrostatischem Porenwasserdruck ohne Taumittel (XF3).',
    practicalTips: 'Dichtende Bauwerksabdichtung nach DIN 18531 erforderlich. Bei ungeschützter Bewitterung ist ein reduzierter w/z-Wert (<= 0,55) Pflicht.',
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
    cNom: 50,
    mechanism: 'Extremer Kombinationsangriff: Taumitteleinsatz im Winterdienst ruft osmotischen Kälteschock hervor; Anfahren am Berg verursacht mechanischen Scherabrieb.',
    practicalTips: 'Künstliche Mikroluftporen (LP-Beton) oder CDF-Eignungsnachweis obligatorisch. Bei XM2 ist eine Hartstoffeinstreuung (DIN 1100) oder Riffelung vorzusehen.',
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
    minCement: 260,
    cMinDur: 15,
    cNom: 25,
    mechanism: 'Wegen geringer Porenfeuchte ist die elektrolytische Korrosionsgeschwindigkeit vernachlässigbar gering. Niedrigste Schutzanforderung im Hochbau.',
    practicalTips: 'Standard im Hochbau ist C20/25 oder C25/30 aus statischen Gründen. Mindestbetondeckung c_nom = 25 mm (c_min,dur = 15 mm + 10 mm Vorhaltemaß).',
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
    cMinDur: 25,
    cNom: 35,
    mechanism: 'Ständige Feuchte verhindert Karbonatisierung mangels Sauerstoffzutritt, jedoch chemischer Angriff durch Porenwassersulfate und Huminsäuren.',
    practicalTips: 'Gegen ungeschalten Baugrund muss das Vorhaltemaß auf delta_c_dev = 50 mm erhöht werden (c_nom >= 75 mm nach DIN EN 1992-1-1 / NA). Bei WU-Beton Mindestbauteildicke beachten.',
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
    cMinDur: 25,
    cNom: 35,
    mechanism: 'Sulfationen reagieren mit Calciumaluminathydraten zu Ettringit unter starkem Quelldruck (Sulfattreiben). Gabelstapler führen zu hohem Rollabrieb.',
    practicalTips: 'Ab 600 mg/l SO₄²⁻ im Wasser ist Zement mit hohem Sulfatwiderstand (SR-Zement nach DIN EN 197-1) gesetzlich zwingend vorgeschrieben. Hartstoffschicht nach DIN 1100 vorsehen.',
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
    cMinDur: 45,
    cNom: 55,
    mechanism: 'Massive Zufuhr von Meerwasserchloriden in der Gezeitenzone kombiniert mit Frost-Tau-Angriff. Zerstörung des Passivfilms bei C_crit >= 0,40 % bezogen auf Zementmasse.',
    practicalTips: 'Höchste Mindestbetondeckung nach EC2 (c_min,dur = 45 mm, c_nom >= 55 mm). Dichter Zementstein mit hüttensandreichen Zementen (CEM III/A oder III/B) empfohlen.',
    normRef: 'DIN 1045-2 Tab. F.2.1 & DIN EN 1992-1-1/NA'
  }
];

interface ExpositionsklassenSkizzeProps {
  selectedClasses: string[];
  onApplyClasses: (classes: string[]) => void;
  onToggleClass?: (cls: string) => void;
  compact?: boolean;
}

export function ExpositionsklassenSkizze({
  selectedClasses,
  onApplyClasses,
  onToggleClass,
  compact = false
}: ExpositionsklassenSkizzeProps) {
  const [activeMode, setActiveMode] = useState<'building' | 'cover'>('building');
  const [activeZoneId, setActiveZoneId] = useState<string>('tiefgarage');
  const [selectedCoverClass, setSelectedCoverClass] = useState<'XC1' | 'XC4' | 'XD3' | 'XS3'>('XC4');

  const currentZone = BUILDING_ZONES.find(z => z.id === activeZoneId) || BUILDING_ZONES[0];

  // Betondeckungswerte für Detailzoom
  const coverDetails = {
    XC1: { cMinDur: 15, deltaC: 10, cNom: 25, desc: 'Trockene Innenbauteile: Minimaler Bewehrungsschutz', color: '#0284c7' },
    XC4: { cMinDur: 25, deltaC: 10, cNom: 35, desc: 'Außenbauteile mit Beregnung: Standard-Bewehrungsschutz', color: '#b91c1c' },
    XD3: { cMinDur: 40, deltaC: 10, cNom: 50, desc: 'Tausalzbeaufschlagte Parkdecks & Rampen: Hoher Schutz', color: '#c2410c' },
    XS3: { cMinDur: 45, deltaC: 10, cNom: 55, desc: 'Meerwasser-Gezeitenzone: Maximaler Schutz gegen Chloride', color: '#0f766e' }
  }[selectedCoverClass];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-6">
      
      {/* HEADER & MODUS-UMSCHALTER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-home-grau/20">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-shiraz/10 text-shiraz rounded-xl">
            <Building2 size={22} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-text-main flex items-center gap-2">
              Interaktive Bauteil- &amp; Expositionszonierung
            </h3>
            <p className="text-xs text-text-main/70">
              Verortung der Expositionsklassen im Bauwerk (DIN EN 206 / DIN 1045-2) &amp; Betondeckung nach EC2
            </p>
          </div>
        </div>

        {/* Tab Switcher: Gebäudeschnitt vs Betondeckung */}
        <div className="flex p-1 bg-off-white rounded-xl border border-home-grau/20 self-start sm:self-auto text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveMode('building')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeMode === 'building'
                ? 'bg-shiraz text-white shadow-xs'
                : 'text-text-main/70 hover:text-text-main hover:bg-white'
            }`}
          >
            <Compass size={14} /> 1. Bauwerks-Zonierung
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('cover')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeMode === 'cover'
                ? 'bg-shiraz text-white shadow-xs'
                : 'text-text-main/70 hover:text-text-main hover:bg-white'
            }`}
          >
            <Eye size={14} /> 2. Detailzoom Betondeckung (EC2)
          </button>
        </div>
      </div>

      {/* QUICK PRESET PILLS */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-text-main/70 block">
          Schnellauswahl typischer Ingenieurbauteile (Klicken zum Inspizieren &amp; Aktivieren):
        </span>
        <div className="flex flex-wrap gap-2">
          {BUILDING_ZONES.map(z => {
            const isActive = activeZoneId === z.id && activeMode === 'building';
            const isFullyApplied = z.classes.every(c => selectedClasses.includes(c));

            return (
              <button
                key={z.id}
                type="button"
                onClick={() => {
                  setActiveZoneId(z.id);
                  setActiveMode('building');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-shiraz text-white border-shiraz shadow-sm'
                    : isFullyApplied
                    ? 'bg-shiraz/10 text-shiraz border-shiraz/30 hover:bg-shiraz/20'
                    : 'bg-white text-text-main/80 border-home-grau/25 hover:bg-off-white'
                }`}
              >
                <span>{z.title.split('&')[0].trim()}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                  isActive ? 'bg-white/20 text-white' : 'bg-off-white text-text-main/60 border border-home-grau/20'
                }`}>
                  {z.classes.join('+')}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* =================================================================== */}
      {/* ANSICHT 1: GEBÄUDESCHNITT & UMWELTZONIERUNG                          */}
      {/* =================================================================== */}
      {activeMode === 'building' && (
        <div className="space-y-5">
          {/* Technischer Vektor-Gebäudeschnitt SVG */}
          <div className="w-full bg-[#fcf8f2] rounded-2xl border border-home-grau/30 p-3 sm:p-4 overflow-hidden shadow-inner">
            <svg
              viewBox="0 0 940 430"
              className="w-full h-auto select-none font-sans"
              style={{ maxHeight: '420px' }}
            >
              <defs>
                {/* Schraffur Erdreich */}
                <pattern id="soilPattern" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <line x1="0" y1="0" x2="0" y2="16" stroke="#94a3b8" strokeWidth="1" strokeOpacity="0.4" />
                  <circle cx="8" cy="8" r="1" fill="#94a3b8" fillOpacity="0.4" />
                </pattern>
                {/* Schraffur Wasser */}
                <pattern id="waterPattern" width="20" height="12" patternUnits="userSpaceOnUse">
                  <path d="M0,6 Q5,2 10,6 T20,6" fill="none" stroke="#38bdf8" strokeWidth="1.2" strokeOpacity="0.5" />
                </pattern>
                {/* Beton-Pünktelung */}
                <pattern id="concreteDotPattern" width="12" height="12" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="0.8" fill="#475569" fillOpacity="0.3" />
                  <circle cx="8" cy="7" r="0.6" fill="#475569" fillOpacity="0.3" />
                  <circle cx="5" cy="11" r="0.9" fill="#475569" fillOpacity="0.25" />
                </pattern>
              </defs>

              {/* HINTERGRUND-ZONEN */}
              {/* Himmel / Atmosphäre */}
              <rect x="0" y="0" width="940" height="230" fill="#f8fafc" />
              {/* Erdreich Baugrund */}
              <rect x="0" y="230" width="600" height="200" fill="#e2e8f0" />
              <rect x="0" y="230" width="600" height="200" fill="url(#soilPattern)" />
              {/* Grundwasser-Bereich */}
              <rect x="0" y="300" width="600" height="130" fill="#0284c7" fillOpacity="0.08" />
              <line x1="0" y1="300" x2="600" y2="300" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="6,4" />
              <text x="14" y="318" fill="#0369a1" fontSize="11" fontWeight="bold">
                Grundwasserspiegel (GW) – Sulfatbelastung (XA1–XA3 / SR-Zement)
              </text>

              {/* Meeresbecken rechts */}
              <rect x="740" y="200" width="200" height="230" fill="#0284c7" fillOpacity="0.15" />
              <rect x="740" y="200" width="200" height="230" fill="url(#waterPattern)" />
              {/* Tide-Wellenlinie */}
              <path d="M740,215 Q790,205 840,215 T940,215 L940,430 L740,430 Z" fill="#0284c7" fillOpacity="0.2" />
              <text x="760" y="235" fill="#0369a1" fontSize="11" fontWeight="bold">
                Meerwasser / Brandung (XS3)
              </text>

              {/* GEBÄUDESTRUKTUR */}

              {/* 1. FUNDAMENTPLATTE (Erdreich: XC2 + XA1 + WF) */}
              <g 
                onClick={() => setActiveZoneId('fundament')}
                className="cursor-pointer transition-all"
              >
                <rect 
                  x="200" y="280" width="400" height="50" 
                  fill={activeZoneId === 'fundament' ? '#fee2e2' : '#cbd5e1'}
                  stroke={activeZoneId === 'fundament' ? '#9b111e' : '#475569'}
                  strokeWidth={activeZoneId === 'fundament' ? 3 : 1.5}
                  rx="3"
                />
                <rect x="200" y="280" width="400" height="50" fill="url(#concreteDotPattern)" />
                <text x="400" y="310" textAnchor="middle" fill="#1e293b" fontSize="12" fontWeight="bold">
                  Fundamentplatte &amp; Sohle [XC2 | XA1 | WF]
                </text>
              </g>

              {/* 2. KELLERAUSSENWÄNDE */}
              <rect x="200" y="180" width="24" height="100" fill="#94a3b8" stroke="#475569" strokeWidth="1.5" />
              <rect x="576" y="180" width="24" height="100" fill="#94a3b8" stroke="#475569" strokeWidth="1.5" />

              {/* 3. TIEFGARAGE / BODENPLATTE & FAHRGASSE (XD3 + XF4 + XM1 + WA) */}
              <g 
                onClick={() => setActiveZoneId('tiefgarage')}
                className="cursor-pointer transition-all"
              >
                <rect 
                  x="224" y="235" width="352" height="45" 
                  fill={activeZoneId === 'tiefgarage' ? '#fee2e2' : '#e2e8f0'}
                  stroke={activeZoneId === 'tiefgarage' ? '#9b111e' : '#64748b'}
                  strokeWidth={activeZoneId === 'tiefgarage' ? 2.5 : 1.5}
                />
                {/* PKW-Silhouette */}
                <path d="M260,252 L275,242 L310,242 L325,252 L335,252 L335,260 L255,260 L255,252 Z" fill="#475569" fillOpacity="0.7" />
                <circle cx="272" cy="261" r="5" fill="#1e293b" />
                <circle cx="318" cy="261" r="5" fill="#1e293b" />
                {/* Schneematsch-Tropfen & Tausalz */}
                <circle cx="280" cy="268" r="2" fill="#ef4444" />
                <circle cx="310" cy="268" r="2" fill="#ef4444" />
                <circle cx="330" cy="268" r="1.5" fill="#ef4444" />
                <text x="420" y="258" textAnchor="middle" fill={activeZoneId === 'tiefgarage' ? '#9b111e' : '#0f172a'} fontSize="12" fontWeight="bold">
                  Tiefgarage Fahrgasse [XD3 | XF4 | XM1 | WA]
                </text>
                <text x="420" y="272" textAnchor="middle" fill="#64748b" fontSize="9.5">
                  Tausalz-Schneematsch &bull; Lochfraß &bull; c_nom &gt;= 50 mm
                </text>
              </g>

              {/* 4. EINFAHRTSRAMPE LINKS (XD3 + XF4 + XM2 + WA) */}
              <g 
                onClick={() => setActiveZoneId('rampe')}
                className="cursor-pointer transition-all"
              >
                <polygon 
                  points="60,180 200,240 200,265 60,205"
                  fill={activeZoneId === 'rampe' ? '#fee2e2' : '#cbd5e1'}
                  stroke={activeZoneId === 'rampe' ? '#9b111e' : '#475569'}
                  strokeWidth={activeZoneId === 'rampe' ? 3 : 1.5}
                />
                <text x="130" y="210" textAnchor="middle" transform="rotate(22, 130, 210)" fill={activeZoneId === 'rampe' ? '#9b111e' : '#1e293b'} fontSize="10.5" fontWeight="bold">
                  Freie Rampe [XD3 | XF4 | XM2]
                </text>
              </g>

              {/* 5. ERDGESCHOSS- & OBERGESCHOSSDECKE */}
              <rect x="200" y="168" width="400" height="16" fill="#94a3b8" stroke="#475569" strokeWidth="1.2" />
              <rect x="320" y="65" width="280" height="16" fill="#94a3b8" stroke="#475569" strokeWidth="1.2" />

              {/* INNENSTÜTZEN */}
              <rect x="380" y="81" width="18" height="87" fill="#64748b" />
              <rect x="490" y="81" width="18" height="87" fill="#64748b" />

              {/* 6. WOHN- & BÜRORÄUME INNEN (X0 / XC1 / WO) */}
              <g 
                onClick={() => setActiveZoneId('innen')}
                className="cursor-pointer transition-all"
              >
                <rect 
                  x="330" y="83" width="260" height="83" 
                  fill={activeZoneId === 'innen' ? '#fee2e2' : '#f8fafc'}
                  fillOpacity={activeZoneId === 'innen' ? 0.6 : 0.8}
                  stroke={activeZoneId === 'innen' ? '#9b111e' : '#cbd5e1'}
                  strokeWidth={activeZoneId === 'innen' ? 2 : 1}
                  strokeDasharray={activeZoneId === 'innen' ? undefined : '4,3'}
                  rx="6"
                />
                <text x="445" y="115" textAnchor="middle" fill={activeZoneId === 'innen' ? '#9b111e' : '#1e293b'} fontSize="12" fontWeight="bold">
                  Wohn- &amp; Büroräume [XC1 | WO]
                </text>
                <text x="445" y="132" textAnchor="middle" fill="#64748b" fontSize="10">
                  Trockene Raumluft (RH 30–65%) &bull; kein Frost
                </text>
                <text x="445" y="148" textAnchor="middle" fill="#0284c7" fontSize="9.5" fontWeight="bold">
                  c_nom = 25 mm &bull; min. C16/20
                </text>
              </g>

              {/* 7. BALKON LINKS (XC4 + XF1 + WF) */}
              <g 
                onClick={() => setActiveZoneId('balkon')}
                className="cursor-pointer transition-all"
              >
                {/* Kragarm-Platte */}
                <rect 
                  x="190" y="68" width="130" height="14" 
                  fill={activeZoneId === 'balkon' ? '#fee2e2' : '#cbd5e1'}
                  stroke={activeZoneId === 'balkon' ? '#9b111e' : '#475569'}
                  strokeWidth={activeZoneId === 'balkon' ? 2.5 : 1.5}
                />
                {/* Balkongeländer */}
                <line x1="192" y1="68" x2="192" y2="35" stroke="#64748b" strokeWidth="2" />
                <line x1="192" y1="35" x2="310" y2="35" stroke="#64748b" strokeWidth="2" />
                <line x1="250" y1="68" x2="250" y2="35" stroke="#64748b" strokeWidth="1.5" />
                {/* Regenpfeile */}
                <path d="M210,15 L200,30" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="3,2" />
                <path d="M240,15 L230,30" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="3,2" />
                <path d="M270,15 L260,30" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="3,2" />
                <text x="250" y="60" textAnchor="middle" fill={activeZoneId === 'balkon' ? '#9b111e' : '#0f172a'} fontSize="11" fontWeight="bold">
                  Balkon [XC4 | XF1 | WF]
                </text>
              </g>

              {/* 8. FLACHDACH & ATTIKA (XC4 + XF3 + WF) */}
              <g 
                onClick={() => setActiveZoneId('dach')}
                className="cursor-pointer transition-all"
              >
                {/* Dachdecke */}
                <rect 
                  x="320" y="24" width="280" height="18" 
                  fill={activeZoneId === 'dach' ? '#fee2e2' : '#cbd5e1'}
                  stroke={activeZoneId === 'dach' ? '#9b111e' : '#475569'}
                  strokeWidth={activeZoneId === 'dach' ? 2.5 : 1.5}
                />
                {/* Attika-Aufkantung */}
                <rect x="320" y="10" width="18" height="16" fill="#94a3b8" stroke="#475569" strokeWidth="1.2" />
                <rect x="582" y="10" width="18" height="16" fill="#94a3b8" stroke="#475569" strokeWidth="1.2" />
                {/* Regenwolke Symbol */}
                <path d="M420,10 Q425,2 435,4 Q445,0 455,6 Q465,4 470,10 Z" fill="#94a3b8" fillOpacity="0.4" />
                <line x1="435" y1="12" x2="430" y2="20" stroke="#0284c7" strokeWidth="1.2" />
                <line x1="450" y1="12" x2="445" y2="20" stroke="#0284c7" strokeWidth="1.2" />
                <line x1="465" y1="12" x2="460" y2="20" stroke="#0284c7" strokeWidth="1.2" />
                <text x="460" y="20" textAnchor="middle" fill={activeZoneId === 'dach' ? '#9b111e' : '#0f172a'} fontSize="11" fontWeight="bold">
                  Flachdach &amp; Attika [XC4 | XF3 | WF]
                </text>
              </g>

              {/* 9. INDUSTRIEBODEN / SCHACHT RECHTS (XA2 + XM2 + WF) */}
              <g 
                onClick={() => setActiveZoneId('industrie')}
                className="cursor-pointer transition-all"
              >
                <rect 
                  x="615" y="170" width="115" height="110" 
                  fill={activeZoneId === 'industrie' ? '#fee2e2' : '#e2e8f0'}
                  stroke={activeZoneId === 'industrie' ? '#9b111e' : '#475569'}
                  strokeWidth={activeZoneId === 'industrie' ? 2.5 : 1.5}
                  rx="3"
                />
                <rect x="615" y="170" width="115" height="110" fill="url(#concreteDotPattern)" />
                {/* Chemikalienbecken-Schraffur */}
                <rect x="625" y="195" width="95" height="40" fill="#fef08a" fillOpacity="0.4" stroke="#ca8a04" strokeWidth="1" strokeDasharray="3,2" />
                <text x="672" y="215" textAnchor="middle" fill="#854d0e" fontSize="10" fontWeight="bold">
                  Säure / Sulfat
                </text>
                <text x="672" y="228" textAnchor="middle" fill="#854d0e" fontSize="9">
                  600–3.000 mg/l
                </text>
                <text x="672" y="255" textAnchor="middle" fill={activeZoneId === 'industrie' ? '#9b111e' : '#1e293b'} fontSize="10.5" fontWeight="bold">
                  Schacht [XA2 | XM2]
                </text>
                <text x="672" y="270" textAnchor="middle" fill="#dc2626" fontSize="9" fontWeight="bold">
                  SR-Zement Pflicht!
                </text>
              </g>

              {/* 10. KÜSTENBAUWERK / KAIMAUER GANZ RECHTS (XS3 + XF4 + WA) */}
              <g 
                onClick={() => setActiveZoneId('kueste')}
                className="cursor-pointer transition-all"
              >
                <polygon 
                  points="740,150 820,150 820,380 770,380 740,310"
                  fill={activeZoneId === 'kueste' ? '#fee2e2' : '#cbd5e1'}
                  stroke={activeZoneId === 'kueste' ? '#9b111e' : '#0369a1'}
                  strokeWidth={activeZoneId === 'kueste' ? 3 : 2}
                />
                <rect x="745" y="155" width="70" height="150" fill="url(#concreteDotPattern)" />
                {/* Wellenspritzer */}
                <circle cx="830" cy="180" r="3" fill="#38bdf8" />
                <circle cx="845" cy="190" r="2.5" fill="#38bdf8" />
                <circle cx="838" cy="170" r="2" fill="#38bdf8" />
                <text x="780" y="200" textAnchor="middle" fill={activeZoneId === 'kueste' ? '#9b111e' : '#0c4a6e'} fontSize="11" fontWeight="bold">
                  Kaimauer
                </text>
                <text x="780" y="215" textAnchor="middle" fill={activeZoneId === 'kueste' ? '#9b111e' : '#0c4a6e'} fontSize="9.5" fontWeight="bold">
                  [XS3 | XF4]
                </text>
                <text x="780" y="235" textAnchor="middle" fill="#0369a1" fontSize="9">
                  c_nom = 55 mm
                </text>
              </g>

              {/* HINWEIS-LEGENDEN-BOX */}
              <rect x="15" y="15" width="165" height="60" fill="#ffffff" fillOpacity="0.9" rx="6" stroke="#cbd5e1" strokeWidth="1" />
              <text x="25" y="32" fill="#1e293b" fontSize="10.5" fontWeight="bold">Interaktive Vektorskizze:</text>
              <text x="25" y="48" fill="#64748b" fontSize="9.5">Klicken Sie auf ein Bauteil,</text>
              <text x="25" y="62" fill="#9b111e" fontSize="9.5" fontWeight="bold">um DIN-Grenzwerte zu laden.</text>
            </svg>
          </div>

          {/* DETAIL-INSPEKTIONS-KARTE DES AKTIVEN BAUTEILS */}
          <div className="p-5 bg-off-white rounded-xl border border-home-grau/30 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-home-grau/20">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg bg-shiraz text-white">
                    {currentZone.classes.join(' + ')}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-white border border-home-grau/20 text-text-main">
                    Feuchteklasse: {currentZone.feuchteklasse}
                  </span>
                  <span className="text-xs text-text-main/60 hidden sm:inline">
                    {currentZone.normRef}
                  </span>
                </div>
                <h4 className="text-base font-bold text-text-main mt-1">
                  {currentZone.title}
                </h4>
                <p className="text-xs text-text-main/70">
                  {currentZone.subtitle}
                </p>
              </div>

              {/* 1-Klick-Übernahme in den Rechner */}
              <button
                type="button"
                onClick={() => onApplyClasses(currentZone.classes)}
                className="px-4 py-2 rounded-xl bg-shiraz text-white hover:bg-shiraz/90 font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto shrink-0"
              >
                <Check size={14} /> Im Rechner übernehmen ({currentZone.classes.join('+')})
              </button>
            </div>

            {/* Normative Grenzwerte-Gitter nach DIN 1045-2 */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="p-3 bg-white rounded-lg border border-home-grau/20 text-center">
                <span className="text-[11px] text-text-main/60 block">Max. (w/z)eq</span>
                <span className="text-sm font-bold font-mono text-shiraz">
                  &le; {formatDeZahl(currentZone.maxWz, 2)}
                </span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-home-grau/20 text-center">
                <span className="text-[11px] text-text-main/60 block">Min. Festigkeit</span>
                <span className="text-sm font-bold font-mono text-text-main">
                  {currentZone.minStrength}
                </span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-home-grau/20 text-center">
                <span className="text-[11px] text-text-main/60 block">Min. Zement (d16)</span>
                <span className="text-sm font-bold font-mono text-text-main">
                  &ge; {currentZone.minCement} kg/m&sup3;
                </span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-home-grau/20 text-center">
                <span className="text-[11px] text-text-main/60 block">c_min,dur (EC2)</span>
                <span className="text-sm font-bold font-mono text-text-main">
                  {currentZone.cMinDur} mm
                </span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-home-grau/20 text-center col-span-2 sm:col-span-1">
                <span className="text-[11px] text-text-main/60 block">Nennmaß c_nom</span>
                <span className="text-sm font-bold font-mono text-emerald-800">
                  {currentZone.cNom} mm
                </span>
              </div>
            </div>

            {/* Schädigungsmechanismus & Baustellenpraxis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white rounded-lg border border-home-grau/20 space-y-1">
                <span className="font-bold text-amber-800 block">Kritischer Schädigungsmechanismus:</span>
                <p className="text-text-main/80 leading-relaxed">{currentZone.mechanism}</p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-home-grau/20 space-y-1">
                <span className="font-bold text-emerald-800 block">Praxisempfehlung &amp; Zusatzvorgaben:</span>
                <p className="text-text-main/80 leading-relaxed">{currentZone.practicalTips}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* ANSICHT 2: DETAILZOOM BETONDECKUNG & DEPASSIVIERUNG                 */}
      {/* =================================================================== */}
      {activeMode === 'cover' && (
        <div className="space-y-5">
          {/* Klassen-Umschalter für Betondeckungs-Visualisierung */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-off-white rounded-xl border border-home-grau/20 text-xs">
            <span className="font-bold text-text-main">Expositionsklasse zur Betondeckung wählen:</span>
            <div className="flex flex-wrap gap-1.5">
              {(['XC1', 'XC4', 'XD3', 'XS3'] as const).map(cKey => (
                <button
                  key={cKey}
                  type="button"
                  onClick={() => setSelectedCoverClass(cKey)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    selectedCoverClass === cKey
                      ? 'bg-shiraz text-white shadow-xs'
                      : 'bg-white text-text-main border border-home-grau/25 hover:bg-off-white'
                  }`}
                >
                  {cKey} (c_nom = {
                    cKey === 'XC1' ? '25' : cKey === 'XC4' ? '35' : cKey === 'XD3' ? '50' : '55'
                  } mm)
                </button>
              ))}
            </div>
          </div>

          {/* Vektor-Querschnitt Betondeckung SVG */}
          <div className="w-full bg-[#fcf8f2] rounded-2xl border border-home-grau/30 p-3 sm:p-4 overflow-hidden shadow-inner">
            <svg
              viewBox="0 0 920 370"
              className="w-full h-auto select-none font-sans"
              style={{ maxHeight: '380px' }}
            >
              <defs>
                <pattern id="concretePores" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="4" cy="5" r="1.2" fill="#64748b" fillOpacity="0.3" />
                  <circle cx="14" cy="12" r="1.8" fill="#64748b" fillOpacity="0.25" />
                  <circle cx="16" cy="4" r="0.8" fill="#64748b" fillOpacity="0.35" />
                  <circle cx="7" cy="16" r="1.4" fill="#64748b" fillOpacity="0.2" />
                </pattern>
                {/* Stahlrippen-Muster */}
                <pattern id="rebarRibs" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
                  <line x1="0" y1="0" x2="0" y2="10" stroke="#334155" strokeWidth="2.5" />
                </pattern>
              </defs>

              {/* 1. ATMOSPHÄRE LINKS (x < 0) */}
              <rect x="0" y="30" width="160" height="310" fill="#f1f5f9" />
              <text x="80" y="60" textAnchor="middle" fill="#475569" fontSize="12" fontWeight="bold">
                Außenluft / Umwelt
              </text>
              <text x="80" y="80" textAnchor="middle" fill="#64748b" fontSize="10">
                CO₂ &bull; H₂O &bull; Cl⁻ &bull; Frost
              </text>

              {/* Pfeile Umweltangriff */}
              <path d="M110,120 L155,120" stroke="#b91c1c" strokeWidth="2" markerEnd="url(#arrow)" />
              <text x="130" y="112" textAnchor="middle" fill="#b91c1c" fontSize="11" fontWeight="bold">CO₂</text>

              <path d="M100,180 L155,180" stroke="#0284c7" strokeWidth="2" />
              <text x="125" y="172" textAnchor="middle" fill="#0284c7" fontSize="11" fontWeight="bold">Cl⁻</text>

              <path d="M110,240 L155,240" stroke="#0f766e" strokeWidth="2" />
              <text x="130" y="232" textAnchor="middle" fill="#0f766e" fontSize="11" fontWeight="bold">H₂O</text>

              {/* BAUTEILOBERFLÄCHE (x = 0) */}
              <line x1="160" y1="30" x2="160" y2="340" stroke="#1e293b" strokeWidth="3" />
              <text x="160" y="22" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="bold">
                x = 0 (Oberfläche)
              </text>

              {/* 2. KARBONATISIERTE ZONE (Phenolphthalein farblos: pH < 9.0) */}
              <rect x="160" y="30" width="110" height="310" fill="#e2e8f0" fillOpacity="0.7" />
              <rect x="160" y="30" width="110" height="310" fill="url(#concretePores)" />
              <line x1="270" y1="30" x2="270" y2="340" stroke="#b91c1c" strokeWidth="2" strokeDasharray="5,3" />
              <text x="215" y="60" textAnchor="middle" fill="#991b1b" fontSize="11" fontWeight="bold">
                Depassiviert
              </text>
              <text x="215" y="76" textAnchor="middle" fill="#991b1b" fontSize="9.5">
                pH &lt; 9,0 (farblos)
              </text>
              <text x="215" y="92" textAnchor="middle" fill="#991b1b" fontSize="9">
                dk(t) = k·&radic;t
              </text>

              {/* 3. ALKALISCHE BETONMATRIX (Phenolphthalein magenta: pH > 12.5) */}
              <rect x="270" y="30" width="620" height="310" fill="#fdf2f8" fillOpacity="0.9" />
              <rect x="270" y="30" width="620" height="310" fill="url(#concretePores)" />
              <text x="370" y="60" fill="#831843" fontSize="12" fontWeight="bold">
                Alkalische Schutzmatrix (pH &approx; 12,5 &ndash; 13,5)
              </text>
              <text x="370" y="78" fill="#9d174d" fontSize="10">
                Stabiler Passivierungsfilm (&gamma;-Fe₂O₃) schützt den Bewehrungsstahl
              </text>

              {/* DYNAMISCHE POSITION DER BEWEHRUNG JE NACH KLASSE */}
              {(() => {
                // Skalierung: 160 mm = x=0.
                // Pro mm Betondeckung nehmen wir ca. 6.5 px im Zoom
                const scalePxPerMm = 6.2;
                const cNomVal = coverDetails.cNom;
                const cMinVal = coverDetails.cMinDur;
                const stirrupOuterX = 160 + cNomVal * scalePxPerMm;
                const stirrupThick = 12; // 10 mm Bügel
                const rebarDiameter = 48; // 20 mm Längsstab
                const rebarCenterX = stirrupOuterX + stirrupThick + rebarDiameter / 2;
                const rebarCenterY = 190;

                return (
                  <g>
                    {/* BÜGEL (Stirrup) */}
                    <rect 
                      x={stirrupOuterX} 
                      y="110" 
                      width={stirrupThick} 
                      height="170" 
                      rx="4"
                      fill="#64748b" 
                      stroke="#1e293b" 
                      strokeWidth="1.5" 
                    />
                    <text x={stirrupOuterX + 6} y="98" textAnchor="middle" fill="#334155" fontSize="10" fontWeight="bold">
                      Bügel &phi;w
                    </text>

                    {/* LÄNGSBEWEHRUNGSSTAB (Rebar) */}
                    <circle 
                      cx={rebarCenterX} 
                      cy={rebarCenterY} 
                      r={rebarDiameter / 2} 
                      fill="#475569" 
                      stroke="#0f172a" 
                      strokeWidth="2" 
                    />
                    <circle 
                      cx={rebarCenterX} 
                      cy={rebarCenterY} 
                      r={rebarDiameter / 2 - 1} 
                      fill="url(#rebarRibs)" 
                    />
                    {/* Passivschicht Kontur (grün leuchtend) */}
                    <circle 
                      cx={rebarCenterX} 
                      cy={rebarCenterY} 
                      r={rebarDiameter / 2 + 2} 
                      fill="none" 
                      stroke="#10b981" 
                      strokeWidth="2" 
                      strokeDasharray="4,2" 
                    />

                    <text x={rebarCenterX} y={rebarCenterY + 4} textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">
                      ds = 20
                    </text>
                    <text x={rebarCenterX} y={rebarCenterY + 42} textAnchor="middle" fill="#047857" fontSize="10" fontWeight="bold">
                      Passivfilm (&gamma;-Fe₂O₃)
                    </text>

                    {/* MASSKETTEN (DIMENSION LINES) */}
                    {/* 1. c_nom Maßkette ganz unten */}
                    <line x1="160" y1="305" x2={stirrupOuterX} y2="305" stroke="#9b111e" strokeWidth="2" />
                    <line x1="160" y1="295" x2="160" y2="315" stroke="#9b111e" strokeWidth="1.5" />
                    <line x1={stirrupOuterX} y1="295" x2={stirrupOuterX} y2="315" stroke="#9b111e" strokeWidth="1.5" />
                    <text x={(160 + stirrupOuterX) / 2} y="325" textAnchor="middle" fill="#9b111e" fontSize="12" fontWeight="bold">
                      cnom = {cNomVal} mm
                    </text>

                    {/* 2. c_min,dur Teilmaßkette */}
                    <line x1="160" y1="270" x2={160 + cMinVal * scalePxPerMm} y2="270" stroke="#0369a1" strokeWidth="1.5" />
                    <line x1="160" y1="264" x2="160" y2="276" stroke="#0369a1" strokeWidth="1.2" />
                    <line x1={160 + cMinVal * scalePxPerMm} y1="264" x2={160 + cMinVal * scalePxPerMm} y2="276" stroke="#0369a1" strokeWidth="1.2" />
                    <text x={(160 + 160 + cMinVal * scalePxPerMm) / 2} y="262" textAnchor="middle" fill="#0369a1" fontSize="10" fontWeight="bold">
                      cmin,dur = {cMinVal} mm
                    </text>

                    {/* 3. delta_c_dev Teilmaßkette */}
                    <line x1={160 + cMinVal * scalePxPerMm} y1="270" x2={stirrupOuterX} y2="270" stroke="#d97706" strokeWidth="1.5" />
                    <line x1={stirrupOuterX} y1="264" x2={stirrupOuterX} y2="276" stroke="#d97706" strokeWidth="1.2" />
                    <text x={(160 + cMinVal * scalePxPerMm + stirrupOuterX) / 2} y="262" textAnchor="middle" fill="#b45309" fontSize="10" fontWeight="bold">
                      &Delta;cdev = 10 mm
                    </text>
                  </g>
                );
              })()}

              {/* CHLORID-DIFFUSIONS-GRADIENTENKURVE (GESTICHELT BLAU) */}
              <path 
                d="M160,140 Q250,210 400,240 T700,245" 
                fill="none" 
                stroke="#0284c7" 
                strokeWidth="2.5" 
                strokeDasharray="6,4" 
              />
              <text x="320" y="195" fill="#0284c7" fontSize="10.5" fontWeight="bold">
                Chloridprofil C(x,t) &ndash; Fick'sches Diffusionsgesetz
              </text>
              <line x1="160" y1="220" x2="600" y2="220" stroke="#0284c7" strokeWidth="1" strokeDasharray="2,2" />
              <text x="470" y="215" fill="#0284c7" fontSize="9">
                Kritischer Grenzwert Ccrit &approx; 0,40–0,50 M.-% bez. auf Zement
              </text>
            </svg>
          </div>

          {/* FORMEL- & BEMESSUNGSLEITFADEN BETONDECKUNG */}
          <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 space-y-3">
            <h4 className="font-bold text-sm text-text-main flex items-center gap-2">
              <ShieldCheck className="text-shiraz" size={18} />
              Normative Bemessung der Betondeckung nach DIN EN 1992-1-1 (EC2) &amp; DIN 1045-2:
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-white rounded-lg border border-home-grau/20 space-y-1">
                <span className="font-bold text-text-main block">1. Nennmaß-Gleichung:</span>
                <div className="text-center py-1 font-mono text-shiraz font-bold">
                  cnom = cmin + &Delta;cdev
                </div>
                <p className="text-text-main/70">
                  <InlineMath math="c_{\min} = \max\{c_{\min,b};\, c_{\min,\text{dur}};\; 10\text{ mm}\}" />. Für Ortbeton gilt normativ <InlineMath math="\Delta c_{\text{dev}} = 10\text{ mm}" />.
                </p>
              </div>

              <div className="p-3 bg-white rounded-lg border border-home-grau/20 space-y-1">
                <span className="font-bold text-text-main block">2. Karbonatisierungsfortschritt:</span>
                <div className="text-center py-1 font-mono text-amber-800 font-bold">
                  dk(t) = kcarb &middot; &radic;t
                </div>
                <p className="text-text-main/70">
                  Erreicht die Karbonatisierungsfront den Bewehrungsstahl (<InlineMath math="d_k \ge c" />), wird die Passivschicht durch pH-Absenkung zerstört.
                </p>
              </div>

              <div className="p-3 bg-white rounded-lg border border-home-grau/20 space-y-1">
                <span className="font-bold text-text-main block">3. Chlorid-Lochfraß:</span>
                <div className="text-center py-1 font-mono text-cyan-800 font-bold">
                  Ccrit &approx; 0,40 &ndash; 0,50 M.-%
                </div>
                <p className="text-text-main/70">
                  Chloride initiieren Lochfraßkorrosion lokal auch bei intaktem alkalischem Milieu ohne vorherige Karbonatisierung.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Rangfolge der Festigkeitsklassen für den Hüllwert-Vergleich
const STRENGTH_RANKS: Record<string, number> = {
  'C8/10': 1,
  'C12/15': 2,
  'C16/20': 3,
  'C20/25': 4,
  'C25/30': 5,
  'C30/37': 6,
  'C35/45': 7,
  'C40/50': 8,
  'C45/55': 9,
  'C50/60': 10
};

export default function Expositionsklassen() {
  const [activeTab, setActiveTab] = useState<'grundlagen' | 'pruefungen' | 'rechner' | 'test'>('grundlagen');

  // Filter-State für Grundlagen-Tabelle
  const [filterFamily, setFilterFamily] = useState<string>('ALLE');

  // Selektor-State für Interaktiven Hüllwert-Rechner
  const [selectedClasses, setSelectedClasses] = useState<string[]>(['XC4', 'XF1']);
  const [selectedDmax, setSelectedDmax] = useState<32 | 22 | 16 | 8>(16);
  const [deltaCdev, setDeltaCdev] = useState<number>(10); // Vorhaltemaß Vorbereitung: 10 mm (Ortbeton Standard), 5 mm (Fertigteil)

  // k-Wert-Rechner States
  const [zementGehalt, setZementGehalt] = useState<number>(310);
  const [wasserGehalt, setWasserGehalt] = useState<number>(165);
  const [flugascheGehalt, setFlugascheGehalt] = useState<number>(50);
  const [silikaGehalt, setSilikaGehalt] = useState<number>(0);
  const [zementTyp, setZementTyp] = useState<'CEM_I' | 'CEM_II_A'>('CEM_I');

  // Quiz-State
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Toggle class selection for calculator
  const toggleClassSelection = (code: string) => {
    setSelectedClasses(prev => 
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  // Berechnung der maßgebenden Hüllwerte
  const calculatedEnvelopes = useMemo(() => {
    if (selectedClasses.length === 0) {
      return null;
    }

    const matched = NORMATIVE_EXPOSURE_CLASSES.filter(c => selectedClasses.includes(c.code));
    
    // Strengster (niedrigster) max (w/z)_eq
    let minWzEq: number | null = null;
    matched.forEach(c => {
      if (c.maxWzEq !== null) {
        if (minWzEq === null || c.maxWzEq < minWzEq) {
          minWzEq = c.maxWzEq;
        }
      }
    });

    // Höchste Mindestdruckfestigkeitsklasse
    let highestClass = 'C8/10';
    let highestRank = 1;
    matched.forEach(c => {
      const rank = STRENGTH_RANKS[c.minStrengthClass] || 0;
      if (rank > highestRank) {
        highestRank = rank;
        highestClass = c.minStrengthClass;
      }
    });

    // Höchster Mindestzementgehalt z_min für gewähltes dmax
    let maxCement = 0;
    matched.forEach(c => {
      if (c.minCement) {
        const val = selectedDmax === 32 ? c.minCement.dmax32 :
                    selectedDmax === 22 ? c.minCement.dmax22 :
                    selectedDmax === 16 ? c.minCement.dmax16 : c.minCement.dmax8;
        if (val > maxCement) {
          maxCement = val;
        }
      }
    });

    // Erforderlicher Mindestluftporengehalt (wenn mindestens eine Klasse LP fordert)
    const requiresLP = matched.some(c => c.requiresAirEntrainment);
    let minAirVal: number | null = null;
    if (requiresLP) {
      matched.forEach(c => {
        if (c.minAirContent) {
          const air = selectedDmax === 32 ? c.minAirContent.dmax32 :
                      selectedDmax === 16 ? c.minAirContent.dmax16 : c.minAirContent.dmax8;
          if (minAirVal === null || air > minAirVal) {
            minAirVal = air;
          }
        }
      });
    }

    // Größte Mindestbetondeckung c_min,dur
    let maxCoverDur = 10;
    matched.forEach(c => {
      if (c.minCoverDurMm > maxCoverDur) {
        maxCoverDur = c.minCoverDurMm;
      }
    });

    const cNom = maxCoverDur + deltaCdev;

    // Sonderanforderungen (SR-Zement, Hartstoffe, Beschichtung)
    const specialReqs: string[] = [];
    if (selectedClasses.includes('XA2') || selectedClasses.includes('XA3')) {
      specialReqs.push('SR-Zement mit hohem Sulfatwiderstand nach DIN EN 197-1 obligatorisch (ab 600 mg/l SO₄²⁻).');
    }
    if (selectedClasses.includes('XA3')) {
      specialReqs.push('Zusätzlicher chemischer Oberflächenschutz (z. B. OS-System nach DIN EN 1504 / TR Instandhaltung) zwingend erforderlich.');
    }
    if (selectedClasses.includes('XM2')) {
      specialReqs.push('Oberflächenvergütung oder Hartstoffeinstreuung nach DIN 1100 erforderlich.');
    }
    if (selectedClasses.includes('XM3')) {
      specialReqs.push('Zwingend Hartstoffestrich nach DIN 18560-7 / DIN 1100 erforderlich.');
    }
    if (selectedClasses.includes('XD3') || selectedClasses.includes('XF4')) {
      specialReqs.push('Hohe Chlorideinwirkung: Erhöhte Rissbreitenbeschränkung (w_k <= 0,2 mm) und/oder Schutzbeschichtung einplanen.');
    }

    return {
      minWzEq,
      highestClass,
      maxCement,
      requiresLP,
      minAirVal,
      maxCoverDur,
      cNom,
      specialReqs
    };
  }, [selectedClasses, selectedDmax, deltaCdev]);

  // Berechnung k-Wert-Ansatz
  const kValueCalc = useMemo(() => {
    // Flugasche: k = 0,40 bei CEM I; max f/z = 0,33
    const maxF = zementGehalt * 0.33;
    const effectiveF = Math.min(flugascheGehalt, maxF);
    const kF = 0.40;

    // Silika: k = 1,0 (bei w/z <= 0,45) bzw. k = 2,0 (bei w/z > 0,45); max s/z = 0,11
    const rawWz = zementGehalt > 0 ? wasserGehalt / zementGehalt : 0;
    const kS = rawWz > 0.45 ? 2.0 : 1.0;
    const maxS = zementGehalt * 0.11;
    const effectiveS = Math.min(silikaGehalt, maxS);

    // Äquivalenter Bindemittelgehalt
    const beq = zementGehalt + kF * effectiveF + kS * effectiveS;
    const wzEq = beq > 0 ? wasserGehalt / beq : 0;

    // Mindestzementgehalt-Check (in D nach DIN 1045-2: bei Anrechnung von Flugasche darf Zementgehalt z_min um max. kf * f abgesenkt werden, aber i.d.R. mind. 240 bzw. 270 kg/m³)
    return {
      rawWz,
      maxF,
      effectiveF,
      kF,
      maxS,
      effectiveS,
      kS,
      beq,
      wzEq
    };
  }, [zementGehalt, wasserGehalt, flugascheGehalt, silikaGehalt]);

  // Quizfragen (5 forensische Praxisfragen)
  const quizQuestions = [
    {
      question: "Eine ungeschützte Außenwand eines Wohngebäudes in Deutschland ist direktem Schlagregen und Frostwechseln ausgesetzt. Welche Expositionsklassen-Kombination muss normativ nach DIN 1045-2 angesetzt werden?",
      options: [
        "Ausschließlich XC1 (Karbonatisierung trocken)",
        "XC4 (Karbonatisierung wechselnd nass/trocken) + XF1 (Frost mäßige Sättigung ohne Taumittel)",
        "XD3 (Chloride) + XF4 (Frost mit Taumitteln)",
        "XA2 (Mäßiger chemischer Angriff) + XM1 (Abrieb)"
      ],
      correctIndex: 1,
      explanation: "Außenbauteile mit direkter Beregnung und Trocknungsphasen fallen für den Bewehrungsschutz zwingend unter XC4 (w/z_eq <= 0,60; Min.-Festigkeit C25/30). Die Frostbeanspruchung durch Beregnung ohne Taumitteleinfluss entspricht XF1. Beide Anforderungen müssen gleichzeitig erfüllt sein."
    },
    {
      question: "Welche Festlegung trifft DIN 1045-2 bei der Expositionsklasse XF4 (z. B. direkt befahrene Fahrbahndecken im Winter) hinsichtlich Luftporen?",
      options: [
        "Luftporen sind grundsätzlich verboten, da sie die Druckfestigkeit mindern.",
        "Ein künstlicher Mindestluftporengehalt (LP) ist obligatorisch (z. B. >= 4,0 Vol.-% bei d_max = 32 mm bzw. >= 4,5 % bei 16 mm), außer bei speziellem Frost-Tausalz-Eignungsnachweis (CDF-Test mit w/z_eq <= 0,45).",
        "Luftporen sind erst ab einer Betontemperatur unter -20 °C erforderlich.",
        "Der Luftgehalt muss durch Rütteln auf unter 1,0 Vol.-% gesenkt werden."
      ],
      correctIndex: 1,
      explanation: "Bei XF4 erfordert DIN 1045-2 standardmäßig künstliche Mikroluftporen mit Mindestgesamtluftgehalten von 4,0 bis 5,5 Vol.-% (je nach Größtkorn), um dem gefrierenden Wasser Dehnungsräume zu bieten (Abstandsfaktor L <= 0,20 mm). Beton ohne LP ist bei XF4 nur im Ausnahmefall mit spezieller Eignungsprüfung (CDF-Verfahren) und w/z_eq <= 0,45 zulässig."
    },
    {
      question: "Ein Baugrundgutachten weist im anstehenden Grundwasser einen Sulfatgehalt von 1.200 mg/l SO₄²⁻ aus. Welche Expositionsklasse liegt vor und welche zwingende Zementanforderung gilt nach DIN 1045-2?",
      options: [
        "XA1; Standard-Portlandzement CEM I 42,5 R ist uneingeschränkt zulässig.",
        "XA2 (Bereich 600–3.000 mg/l); es muss zwingend Zement mit hohem Sulfatwiderstand (SR-Zement nach DIN EN 197-1) verwendet werden.",
        "XM2; es muss ein Hartstoffestrich aufgebracht werden.",
        "XC3; kein Einfluss auf die Zementauswahl."
      ],
      correctIndex: 1,
      explanation: "Nach DIN EN 206 Tabelle 2 liegt bei 600 bis 3.000 mg/l Sulfat im Wasser die Klasse XA2 (chemisch mäßig angreifend) vor. Bei SO₄²⁻ > 600 mg/l im Wasser (bzw. > 3.000 mg/kg im Boden) ist nach DIN 1045-2 zwingend sulfatwiderstandsfähiger Zement (SR-Zement) vorgeschrieben, um Treibreaktionen (Ettringitbildung / Thaumasit) zu unterbinden."
    },
    {
      question: "Wie berechnet sich der anrechenbare äquivalente Wasserzementwert (w/z)_eq bei Einsatz von Steinkohlenflugasche (Typ II) nach dem k-Wert-Konzept (DIN EN 206 / DIN 1045-2)?",
      options: [
        "(w/z)_eq = (w + f) / z",
        "(w/z)_eq = w / (z + 0,40 · f) unter Beachtung von max. f/z <= 0,33 (bei CEM I)",
        "(w/z)_eq = w / (z + 1,0 · f) ohne Mengenbegrenzung",
        "(w/z)_eq = w / (z - f)"
      ],
      correctIndex: 1,
      explanation: "Das k-Wert-Konzept nach DIN EN 206 setzt die Flugasche mit dem Wirkungsfaktor k = 0,40 (bei CEM I) an: (w/z)_eq = w / (z + 0,40 · f). Zudem darf die Flugasche nur bis zu einem Masseverhältnis von f/z <= 0,33 auf den äquivalenten Wasserzementwert und Mindestzementgehalt angerechnet werden."
    },
    {
      question: "Welche Feuchtigkeitsklasse nach der Alkali-Richtlinie des DAfStb / DIN 1045-2 Anhang D muss für ein befahrenes Parkdeck angesetzt werden?",
      options: [
        "WO (trockene Innenbauteile)",
        "WF (feucht ohne Alkalizufuhr)",
        "WA (feucht mit externer Zufuhr von Alkalien durch Taumitteleintrag von Fahrzeugen)",
        "WS (nur für unbeschichtete Bundesautobahnen)"
      ],
      correctIndex: 2,
      explanation: "Parkdecks werden durch Fahrzeuge mit tauenden Schneematsch- und Tausalzmengen befrachtet. Daher liegt neben Feuchte eine ständige Alkalizufuhr von außen vor -> Einstufung WA. Hierfür dürfen nur unbedenkliche Gesteinskörnungen (Klasse E I) oder NA-Zemente verwendet werden."
    }
  ];

  const handleQuizSelect = (qIdx: number, oIdx: number) => {
    if (quizSubmitted) return;
    setQuizAnswers(prev => ({ ...prev, [qIdx]: oIdx }));
  };

  const calculateScore = () => {
    let score = 0;
    quizQuestions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctIndex) score++;
    });
    return score;
  };

  return (
    <div className="flex flex-col gap-8">
      {/* 1. HEADER & INTRO */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex items-center justify-between pb-4 border-b border-home-grau/20 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-shiraz/10 text-shiraz rounded-xl">
              <Grid size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-main">
                Expositionsklassen nach DIN EN 206 / DIN 1045-2
              </h2>
              <p className="text-xs text-text-main/70">
                Normative Grenzwerte für Umweltbeanspruchung, Zementgehalte, w/z-Werte, Luftporen und Betondeckung
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 bg-off-white text-shiraz border border-home-grau/20 rounded-lg hidden sm:inline-block">
            DIN 1045-2:2023-08 (Tab. F.2.1/F.2.2)
          </span>
        </div>

        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 leading-relaxed">
          <p>
            Die Bemessung dauerhafter Betonbauteile basiert nach <strong>DIN EN 206-1</strong> und den nationalen Anwendungsregeln der <strong>DIN 1045-2</strong> auf 
            der Zuordnung aller planmäßig auftretenden Umwelteinflüsse zu standardisierten <strong>Expositionsklassen</strong> (X0, XC, XD, XS, XF, XA, XM) sowie 
            <strong>Feuchtigkeitsklassen</strong> (WO, WF, WA, WS nach Alkali-Richtlinie). Jede Klasse definiert verbindliche Mindestanforderungen an den maximalen 
            äquivalenten Wasserzementwert <InlineMath math="(w/z)_{\text{eq}}" />, die Mindestdruckfestigkeitsklasse, den Mindestzementgehalt <InlineMath math="z_{\min}" /> und 
            die erforderliche Betondeckung nach Eurocode 2.
          </p>
        </div>

        {/* TAB-NAVIGATION (4-Stufen-Lehrpfad) */}
        <div className="flex flex-wrap gap-2 pt-5 border-t border-home-grau/20 mt-4">
          <button
            onClick={() => setActiveTab('grundlagen')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'grundlagen'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
          >
            <BookOpen size={16} /> 1. Grundlagen &amp; Klassenkatalog
          </button>
          <button
            onClick={() => setActiveTab('pruefungen')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'pruefungen'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
          >
            <Beaker size={16} /> 2. Labor- &amp; Baustellenprüfungen
          </button>
          <button
            onClick={() => setActiveTab('rechner')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'rechner'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
          >
            <Calculator size={16} /> 3. Interaktiver Hüllwert- &amp; k-Wert-Rechner
          </button>
          <button
            onClick={() => setActiveTab('test')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'test'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white'
            }`}
          >
            <HelpCircle size={16} /> 4. Wissenstest &amp; Feedback
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* TAB 1: GRUNDLAGEN & NORMATIVER KLASSENKATALOG                          */}
      {/* ===================================================================== */}
      {activeTab === 'grundlagen' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Interaktive grafische Bauteil- & Expositionszonierung */}
          <ExpositionsklassenSkizze
            selectedClasses={selectedClasses}
            onApplyClasses={(cls) => {
              setSelectedClasses(cls);
            }}
            onToggleClass={toggleClassSelection}
          />

          {/* Einordnung und Schädigungsmechanismen */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-4">
            <h3 className="text-lg font-bold text-text-main flex items-center gap-2 pb-2 border-b border-home-grau/20">
              <ShieldAlert className="text-shiraz" size={20} />
              Normatives Schutzkonzept: Beton- und Bewehrungsschutz
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/20 space-y-2">
                <span className="text-xs font-bold text-shiraz uppercase tracking-wider block">Bewehrungskorrosion</span>
                <h4 className="font-bold text-sm text-text-main">Karbonatisierung (XC) &amp; Chloride (XD / XS)</h4>
                <p className="text-xs text-text-main/75 leading-relaxed">
                  Zementstein schützt Stahlbewehrung durch hochalkalisches Porenwasser (<InlineMath math="\text{pH} \approx 12{,}5 - 13{,}5" />) 
                  passivierend. Dringt <InlineMath math="\text{CO}_2" /> ein, sinkt der pH-Wert unter 9 (Depassivierung). Chloride zerstören 
                  den Passivfilm punktuell (Lochfraßkorrosion ohne vorherige pH-Wert-Absenkung).
                </p>
              </div>

              <div className="p-4 bg-off-white rounded-xl border border-home-grau/20 space-y-2">
                <span className="text-xs font-bold text-cyan-800 uppercase tracking-wider block">Gefügezerstörung Frost</span>
                <h4 className="font-bold text-sm text-text-main">Frost- &amp; Frost-Tausalz-Angriff (XF)</h4>
                <p className="text-xs text-text-main/75 leading-relaxed">
                  Gefrierendes Porenwasser expandiert um ca. 9 Vol.-%. Bei hoher Wassersättigung (<InlineMath math="S_r > 91\,\%" />) 
                  entsteht hydrostatischer Sprengdruck. Tausalze verschärfen den Angriff drastisch durch osmotischen Druck und Kälteschock 
                  (oberflächliche Skalierung / Abplatzungen).
                </p>
              </div>

              <div className="p-4 bg-off-white rounded-xl border border-home-grau/20 space-y-2">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">Chemischer Betonangriff</span>
                <h4 className="font-bold text-sm text-text-main">Säuren, Sulfate (XA) &amp; AKR (WO–WS)</h4>
                <p className="text-xs text-text-main/75 leading-relaxed">
                  Säuren lösen Calciumhydroxid aus dem Gefüge auf. Sulfate reagieren mit Aluminationen zu Ettringit oder Thaumasit unter 
                  massiver Volumenzunahme (Sulfattreiben). Alkaliempfindliche Kieselsäure bildet mit Porenalkalien quellfähiges Gel (AKR).
                </p>
              </div>
            </div>
          </div>

          {/* Filter-Bar für Klassenkatalog */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-home-grau/20">
              <div>
                <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                  <Filter size={18} className="text-shiraz" />
                  Klassenkatalog DIN EN 206 / DIN 1045-2 (Tabelle F.2.1 &amp; F.2.2)
                </h3>
                <p className="text-xs text-text-main/70">Wählen Sie eine Expositionsgruppen-Kategorie zur Detailansicht:</p>
              </div>

              <div className="flex flex-wrap gap-1 p-1 bg-off-white rounded-xl border border-home-grau/20 text-xs">
                {['ALLE', 'XC', 'XD', 'XS', 'XF', 'XA', 'XM', 'X0'].map(f => (
                  <button
                    key={f}
                    onClick={() => setFilterFamily(f)}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      filterFamily === f
                        ? 'bg-shiraz text-white shadow-xs'
                        : 'text-text-main/70 hover:text-text-main hover:bg-white'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Matrix-Tabelle */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-off-white border-b border-home-grau/30 text-text-main font-bold">
                    <th className="p-3">Klasse</th>
                    <th className="p-3">Bezeichnung &amp; Umgebungsbedingungen</th>
                    <th className="p-3 text-center">max. (w/z)eq</th>
                    <th className="p-3 text-center">Min.-Festigkeit</th>
                    <th className="p-3 text-center">z_min (kg/m³) [16 / 32 mm]</th>
                    <th className="p-3 text-center">c_min,dur (mm)</th>
                    <th className="p-3">Besondere Anforderungen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-home-grau/15">
                  {NORMATIVE_EXPOSURE_CLASSES
                    .filter(c => filterFamily === 'ALLE' || c.family === filterFamily)
                    .map(c => (
                      <tr key={c.code} className="hover:bg-off-white/60 transition-colors">
                        <td className="p-3 font-mono font-bold text-shiraz text-sm whitespace-nowrap">
                          {c.code}
                        </td>
                        <td className="p-3 space-y-0.5 max-w-xs sm:max-w-md">
                          <div className="font-bold text-text-main">{c.title}</div>
                          <div className="text-[11px] text-text-main/70 leading-relaxed">{c.description}</div>
                          <div className="text-[10px] text-text-main/60 italic">Bsp.: {c.examples}</div>
                        </td>
                        <td className="p-3 text-center font-mono font-bold text-text-main whitespace-nowrap">
                          {c.maxWzEq !== null ? formatDeZahl(c.maxWzEq, 2) : '—'}
                        </td>
                        <td className="p-3 text-center font-mono font-semibold text-text-main whitespace-nowrap">
                          {c.minStrengthClass}
                        </td>
                        <td className="p-3 text-center font-mono text-text-main/80 whitespace-nowrap">
                          {c.minCement ? `${c.minCement.dmax16} / ${c.minCement.dmax32}` : '—'}
                        </td>
                        <td className="p-3 text-center font-mono font-bold text-shiraz whitespace-nowrap">
                          {c.minCoverDurMm} mm
                        </td>
                        <td className="p-3 text-[11px] text-text-main/80">
                          {c.requiresAirEntrainment && (
                            <span className="inline-block px-1.5 py-0.5 rounded bg-cyan-50 text-cyan-800 border border-cyan-200 font-semibold mr-1 mb-1">
                              LP-Beton: &ge; {c.minAirContent?.dmax16}% (16 mm)
                            </span>
                          )}
                          {c.specialNotes || 'Standard-Betonzusammensetzung'}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Chemische Grenzwerte für XA */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-4">
            <h3 className="text-lg font-bold text-text-main flex items-center gap-2 pb-2 border-b border-home-grau/20">
              <Beaker className="text-shiraz" size={18} />
              Chemische Grenzwerte nach DIN EN 206:2021-06 Tabelle 2 (Klassen XA1, XA2, XA3)
            </h3>
            <p className="text-xs text-text-main/75">
              Für die Einstufung in XA1 bis XA3 ist der jeweils strengste Einzelwert aller untersuchten Wasser- bzw. Bodenparameter maßgebend:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-off-white border-b border-home-grau/30 text-text-main font-bold">
                    <th className="p-2.5">Chemischer Parameter</th>
                    <th className="p-2.5">Einheit</th>
                    <th className="p-2.5 bg-emerald-50 text-emerald-900 text-center">XA1 (schwach)</th>
                    <th className="p-2.5 bg-amber-50 text-amber-900 text-center">XA2 (mäßig)</th>
                    <th className="p-2.5 bg-rose-50 text-rose-900 text-center">XA3 (stark)</th>
                    <th className="p-2.5">Prüfverfahren</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-home-grau/15">
                  {CHEMICAL_LIMITS_XA.map((item, idx) => (
                    <tr key={idx} className="hover:bg-off-white/40">
                      <td className="p-2.5 font-medium text-text-main">{item.stoff}</td>
                      <td className="p-2.5 font-mono text-text-main/70">{item.einheit}</td>
                      <td className="p-2.5 text-center font-mono bg-emerald-50/40 text-emerald-900">{item.xa1}</td>
                      <td className="p-2.5 text-center font-mono bg-amber-50/40 text-amber-900 font-semibold">{item.xa2}</td>
                      <td className="p-2.5 text-center font-mono bg-rose-50/40 text-rose-900 font-bold">{item.xa3}</td>
                      <td className="p-2.5 text-[11px] text-text-main/60 font-mono">{item.pruefnorm}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Feuchtigkeitsklassen für AKR */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-4">
            <h3 className="text-lg font-bold text-text-main flex items-center gap-2 pb-2 border-b border-home-grau/20">
              <Droplets className="text-shiraz" size={18} />
              Feuchtigkeitsklassen gegen Alkali-Kieselsäure-Reaktion (AKR) nach DIN 1045-2 Anhang D
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MOISTURE_CLASSES_AKR.map(m => (
                <div key={m.code} className="p-4 bg-off-white rounded-xl border border-home-grau/20 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-sm px-2.5 py-0.5 rounded bg-white border border-home-grau/20 text-shiraz">
                      {m.code} – {m.title}
                    </span>
                    <span className="text-[10px] text-text-main/60 font-mono">Alkali-Richtlinie</span>
                  </div>
                  <p className="text-xs text-text-main/80 leading-relaxed">{m.description}</p>
                  <p className="text-[11px] text-text-main/60 italic">Typisch: {m.examples}</p>
                  <div className="text-[11px] font-semibold text-text-main pt-1.5 border-t border-home-grau/15">
                    Anforderung: <span className="text-shiraz">{m.anforderung}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 2: LABOR- & BAUSTELLENPRÜFUNGEN                                   */}
      {/* ===================================================================== */}
      {activeTab === 'pruefungen' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-6">
            <div className="border-b border-home-grau/20 pb-3">
              <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                <Beaker className="text-shiraz" size={20} />
                Prüfverfahren zur Verifikation von Dauerhaftigkeit &amp; Expositionskonformität
              </h3>
              <p className="text-xs text-text-main/70 mt-1">
                Forensische Nachweise und genormte Prüfungen für Karbonatisierung, Frost, Chloride und Abrieb:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* 1. Karbonatisierung */}
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/20 space-y-2.5">
                <div className="flex items-center gap-2 text-shiraz font-bold text-sm">
                  <CheckCircle2 size={16} /> Karbonatisierungstiefe mit Phenolphthalein
                </div>
                <div className="text-xs text-text-main/80 space-y-1.5 leading-relaxed">
                  <p><strong>Norm:</strong> DIN EN 14630 (Bestimmung der Karbonatisierungstiefe an frischen Bruchflächen)</p>
                  <p><strong>Prinzip:</strong> 1%ige ethanolische Phenolphthaleinlösung wird auf die frisch gebrochene Betonfläche gesprüht.</p>
                  <p><strong>Farbumschlag:</strong> Unkarbonatisierter Beton (<InlineMath math="\text{pH} > 9{,}0" />) verfärbt sich kräftig violett/magenta; karbonatisierter Beton bleibt farblos.</p>
                  <div className="text-[11px] text-text-main bg-white p-2 rounded border border-home-grau/15">
                    <strong>Zeit-Diffusionsgesetz:</strong> <InlineMath math="d_k(t) = k_{\text{carb}} \cdot \sqrt{t}" />
                  </div>
                </div>
              </div>

              {/* 2. Frost-Tausalz-Prüfung CDF/CIF */}
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/20 space-y-2.5">
                <div className="flex items-center gap-2 text-cyan-800 font-bold text-sm">
                  <Snowflake size={16} /> Frost-Tausalz-Prüfung (CDF / CIF-Verfahren)
                </div>
                <div className="text-xs text-text-main/80 space-y-1.5 leading-relaxed">
                  <p><strong>Norm:</strong> DIN CEN/TS 12390-9 / BAW-Merkblatt Frostprüfung</p>
                  <p><strong>CDF-Test:</strong> Prüfung mit 3%iger NaCl-Lösung und 28 Frost-Tau-Wechseln (-20 °C bis +20 °C).</p>
                  <p><strong>Kriterium XF4:</strong> Mittlere Abwitterung <InlineMath math="m_{28} \le 1.500\text{ g/m}^2" /> (für ZTV-ING oft <InlineMath math="\le 1.000\text{ g/m}^2" />).</p>
                  <p><strong>CIF-Test:</strong> Zusätzliche Messung des relativen dynamischen E-Moduls (RDM) zur Detektion innerer Gefügeschädigung (<InlineMath math="RDM \ge 75\,\%" />).</p>
                </div>
              </div>

              {/* 3. Schnellchloridmigration RCM */}
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/20 space-y-2.5">
                <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                  <Waves size={16} /> Chlorid-Migrationsversuch (RCM-Test)
                </div>
                <div className="text-xs text-text-main/80 space-y-1.5 leading-relaxed">
                  <p><strong>Norm / Richtlinie:</strong> BAW-Merkblatt MDCC / NT BUILD 492</p>
                  <p><strong>Prinzip:</strong> Anlegen einer elektrischen Gleichspannung (10–60 V) an einen Betonbohrkern zur Beschleunigung der Chloridionenwanderung.</p>
                  <p><strong>Auswertung:</strong> Spalten des Prüfkörpers und Besprühen mit <InlineMath math="0{,}1\text{ M } \text{AgNO}_3" />-Lösung. Weißer Silbersalz-Niederschlag markiert die Eindringfront <InlineMath math="x_d" />.</p>
                  <div className="text-[11px] text-text-main bg-white p-2 rounded border border-home-grau/15 overflow-x-auto">
                    <InlineMath math="D_{RCM} = \frac{287{,}3 \cdot T \cdot L}{(U - 2) \cdot t} \left(x_d - 3{,}338 \sqrt{\frac{T \cdot L \cdot x_d}{U - 2}}\right) \cdot 10^{-12} \text{ m}^2/\text{s}" />
                  </div>
                </div>
              </div>

              {/* 4. Luftporenprüfung im Frischbeton */}
              <div className="p-4 bg-off-white rounded-xl border border-home-grau/20 space-y-2.5">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <Layers size={16} /> Frischbeton-Luftporenprüfung (Druckausgleich)
                </div>
                <div className="text-xs text-text-main/80 space-y-1.5 leading-relaxed">
                  <p><strong>Norm:</strong> DIN EN 12350-7 (Prüfung von Frischbeton – Luftgehalt – Druckverfahren)</p>
                  <p><strong>Gerät:</strong> 8-Liter-Luftporentopf mit Druckkammer und Manometer.</p>
                  <p><strong>Grenzwerte XF:</strong> Mindestluftgehalt je nach Größtkorn: 4,0 Vol.-% (<InlineMath math="d_{\max}=32\text{ mm}" />), 4,5 Vol.-% (16 mm), 5,5 Vol.-% (8 mm).</p>
                  <p><strong>Festbetonprüfung:</strong> Bestimmung von Luftporengrößenverteilung und Abstandsfaktor <InlineMath math="L \le 0{,}20\text{ mm}" /> nach DIN EN 480-11 am Dünnschliff.</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 3: INTERAKTIVER HÜLLWERT- & K-WERT-RECHNER                         */}
      {/* ===================================================================== */}
      {activeTab === 'rechner' && (
        <div className="space-y-6 animate-in fade-in duration-300">

          {/* Interaktive grafische Bauteil- & Betondeckungs-Skizze */}
          <ExpositionsklassenSkizze
            selectedClasses={selectedClasses}
            onApplyClasses={(cls) => {
              setSelectedClasses(cls);
            }}
            onToggleClass={toggleClassSelection}
          />

          {/* TEIL A: MEHRFACH-SELEKTOR & HÜLLWERTBILDUNG */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-5">
            <div className="border-b border-home-grau/20 pb-3">
              <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                <Calculator className="text-shiraz" size={20} />
                A. Interaktiver Expositionsklassen-Selektor &amp; Hüllwert-Ermittler
              </h3>
              <p className="text-xs text-text-main/70 mt-1">
                Wählen Sie alle für das Bauteil gleichzeitig zutreffenden Expositionsklassen. Das Tool ermittelt automatisch die strengsten Grenzwert-Hüllwerte nach DIN 1045-2:
              </p>
            </div>

            {/* Checkboxen für alle Klassen */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-text-main block">1. Expositionsklassen anwählen (Mehrfachauswahl):</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                {NORMATIVE_EXPOSURE_CLASSES.map(c => {
                  const isSelected = selectedClasses.includes(c.code);
                  return (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => toggleClassSelection(c.code)}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                        isSelected
                          ? 'bg-shiraz text-white border-shiraz shadow-sm font-bold'
                          : 'bg-off-white text-text-main/80 border-home-grau/30 hover:border-text-main/60'
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        {isSelected && <Check size={14} />}
                        <span className="font-mono text-sm">{c.code}</span>
                      </div>
                      <span className="text-[10px] opacity-80 truncate max-w-full">{c.family}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Randbedingungen: dmax & Vorhaltemaß */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-off-white rounded-xl border border-home-grau/20">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-main block">
                  Größtkorn der Gesteinskörnung <InlineMath math="d_{\max}" />:
                </label>
                <div className="flex gap-2">
                  {[32, 22, 16, 8].map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setSelectedDmax(d as any)}
                      className={`flex-1 py-1.5 rounded-lg font-mono text-xs font-bold border transition-all cursor-pointer ${
                        selectedDmax === d
                          ? 'bg-shiraz text-white border-shiraz'
                          : 'bg-white text-text-main border-home-grau/30 hover:bg-slate-50'
                      }`}
                    >
                      {d} mm
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-main block">
                  Vorhaltemaß der Betondeckung <InlineMath math="\Delta c_{\text{dev}}" />:
                </label>
                <div className="flex gap-2">
                  {[
                    { val: 10, label: '10 mm (Ortbeton Standard)' },
                    { val: 5, label: '5 mm (Fertigteil mit QS)' },
                    { val: 15, label: '15 mm (unebener Untergrund)' }
                  ].map(item => (
                    <button
                      key={item.val}
                      type="button"
                      onClick={() => setDeltaCdev(item.val)}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer text-center ${
                        deltaCdev === item.val
                          ? 'bg-shiraz text-white border-shiraz'
                          : 'bg-white text-text-main border-home-grau/30 hover:bg-slate-50'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Ausgabe der Hüllwerte */}
            {calculatedEnvelopes && (
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold text-text-main uppercase tracking-wider block">
                  2. Maßgebende Hüllwerte (Grenzwerte nach DIN 1045-2):
                </span>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <div className="p-3 bg-white rounded-xl border border-home-grau/30 shadow-xs text-center">
                    <span className="text-[10px] text-text-main/70 uppercase block font-semibold">max. (w/z)eq</span>
                    <span className="text-lg font-mono font-black text-shiraz">
                      {calculatedEnvelopes.minWzEq !== null ? formatDeZahl(calculatedEnvelopes.minWzEq, 2) : 'keine Begr.'}
                    </span>
                    <span className="text-[10px] text-text-main/60 block mt-0.5">Strengster Einzelwert</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-home-grau/30 shadow-xs text-center">
                    <span className="text-[10px] text-text-main/70 uppercase block font-semibold">Min.-Festigkeitsklasse</span>
                    <span className="text-lg font-mono font-black text-shiraz">
                      {calculatedEnvelopes.highestClass}
                    </span>
                    <span className="text-[10px] text-text-main/60 block mt-0.5">Höchste Anforderung</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-home-grau/30 shadow-xs text-center">
                    <span className="text-[10px] text-text-main/70 uppercase block font-semibold">Min.-Zementgehalt z_min</span>
                    <span className="text-lg font-mono font-black text-shiraz">
                      {calculatedEnvelopes.maxCement > 0 ? `${calculatedEnvelopes.maxCement} kg/m³` : '—'}
                    </span>
                    <span className="text-[10px] text-text-main/60 block mt-0.5">für d_max = {selectedDmax} mm</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-home-grau/30 shadow-xs text-center">
                    <span className="text-[10px] text-text-main/70 uppercase block font-semibold">Luftporengehalt (LP)</span>
                    <span className="text-lg font-mono font-black text-cyan-800">
                      {calculatedEnvelopes.requiresLP && calculatedEnvelopes.minAirVal !== null
                        ? `≥ ${formatDeZahl(calculatedEnvelopes.minAirVal, 1)} %`
                        : 'Nicht gefordert'}
                    </span>
                    <span className="text-[10px] text-text-main/60 block mt-0.5">Frischbetonwert</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-home-grau/30 shadow-xs text-center col-span-2 md:col-span-1">
                    <span className="text-[10px] text-text-main/70 uppercase block font-semibold">Nennmaß Betondeckung</span>
                    <span className="text-lg font-mono font-black text-emerald-800">
                      {calculatedEnvelopes.cNom} mm
                    </span>
                    <span className="text-[10px] text-text-main/60 block mt-0.5">c_min = {calculatedEnvelopes.maxCoverDur} + Δc = {deltaCdev} mm</span>
                  </div>
                </div>

                {calculatedEnvelopes.specialReqs.length > 0 && (
                  <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-amber-900">
                      <AlertTriangle size={14} className="text-amber-700" />
                      Wichtige bauchemische &amp; konstruktive Sonderanforderungen:
                    </div>
                    <ul className="list-disc pl-4 text-xs text-amber-900/90 space-y-0.5">
                      {calculatedEnvelopes.specialReqs.map((req, i) => (
                        <li key={i}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* TEIL B: K-WERT-RECHNER NACH DIN EN 206 / DIN 1045-2 */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-5">
            <div className="border-b border-home-grau/20 pb-3">
              <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                <Scale className="text-shiraz" size={20} />
                B. k-Wert-Rechner für Zusatzstoffe (Flugasche &amp; Silikastaub)
              </h3>
              <p className="text-xs text-text-main/70 mt-1">
                Berechnung des äquivalenten Wasserzementwerts nach der Formel: <InlineMath math="(w/z)_{\text{eq}} = \frac{w}{z + k_f \cdot f + k_s \cdot s}" />
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-off-white rounded-xl border border-home-grau/20">
              <div className="space-y-1">
                <label className="text-xs font-bold text-text-main">Zementgehalt z (kg/m³):</label>
                <input
                  type="number"
                  min={150}
                  max={550}
                  step={5}
                  value={zementGehalt}
                  onChange={(e) => setZementGehalt(Number(e.target.value))}
                  className="w-full p-2 bg-white rounded-lg border border-home-grau/30 font-mono text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-text-main">Wassergehalt w (kg/m³):</label>
                <input
                  type="number"
                  min={100}
                  max={250}
                  step={1}
                  value={wasserGehalt}
                  onChange={(e) => setWasserGehalt(Number(e.target.value))}
                  className="w-full p-2 bg-white rounded-lg border border-home-grau/30 font-mono text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-text-main">Flugasche f (kg/m³):</label>
                <input
                  type="number"
                  min={0}
                  max={150}
                  step={5}
                  value={flugascheGehalt}
                  onChange={(e) => setFlugascheGehalt(Number(e.target.value))}
                  className="w-full p-2 bg-white rounded-lg border border-home-grau/30 font-mono text-sm"
                />
                <span className="text-[10px] text-text-main/60 block">k = 0,40 (max. f/z = 0,33)</span>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-text-main">Silikastaub s (kg/m³):</label>
                <input
                  type="number"
                  min={0}
                  max={50}
                  step={2}
                  value={silikaGehalt}
                  onChange={(e) => setSilikaGehalt(Number(e.target.value))}
                  className="w-full p-2 bg-white rounded-lg border border-home-grau/30 font-mono text-sm"
                />
                <span className="text-[10px] text-text-main/60 block">k = {formatDeZahl(kValueCalc.kS, 1)} (max. s/z = 0,11)</span>
              </div>
            </div>

            {/* Rechenergebnisse k-Wert */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3.5 bg-white rounded-xl border border-home-grau/30 shadow-xs">
                <span className="text-xs text-text-main/70 block">Klassischer Wasserzementwert w/z:</span>
                <span className="text-xl font-mono font-bold text-text-main">
                  {formatDeZahl(kValueCalc.rawWz, 3)}
                </span>
                <span className="text-[10px] text-text-main/60 block mt-0.5">Ohne Zusatzstoffanrechnung</span>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-home-grau/30 shadow-xs">
                <span className="text-xs text-text-main/70 block">Äquivalenter Bindemittelgehalt b_eq:</span>
                <span className="text-xl font-mono font-bold text-text-main">
                  {formatDeZahl(kValueCalc.beq, 1)} kg/m³
                </span>
                <span className="text-[10px] text-text-main/60 block mt-0.5">
                  z ({zementGehalt}) + 0,4·{formatDeZahl(kValueCalc.effectiveF, 0)} + {formatDeZahl(kValueCalc.kS, 1)}·{formatDeZahl(kValueCalc.effectiveS, 0)}
                </span>
              </div>

              <div className="p-3.5 bg-white rounded-xl border-2 border-shiraz shadow-xs">
                <span className="text-xs text-shiraz font-bold block">Äquivalenter (w/z)eq:</span>
                <span className="text-2xl font-mono font-black text-shiraz">
                  {formatDeZahl(kValueCalc.wzEq, 3)}
                </span>
                <span className="text-[10px] text-text-main/70 block mt-0.5">
                  {calculatedEnvelopes && calculatedEnvelopes.minWzEq !== null ? (
                    kValueCalc.wzEq <= calculatedEnvelopes.minWzEq ? (
                      <span className="text-emerald-700 font-bold">✓ Eingehalten (Grenzwert: {formatDeZahl(calculatedEnvelopes.minWzEq, 2)})</span>
                    ) : (
                      <span className="text-rose-700 font-bold">✕ Überschritten (Grenzwert: {formatDeZahl(calculatedEnvelopes.minWzEq, 2)})</span>
                    )
                  ) : 'Maßgeblicher Prüfwert'}
                </span>
              </div>
            </div>

            {/* Normative Herleitungsbox */}
            <FormulaDerivationBox
              title="Normative Herleitung: Das k-Wert-Konzept nach DIN EN 206 & DIN 1045-2"
              zielGleichung="(w/z)_{\text{eq}} = \frac{w}{z + k_f \cdot f + k_s \cdot s}"
              normQuelle="DIN EN 206:2021-06 (Abschnitt 5.2.5.2) & DIN 1045-2:2023-08"
              schritte={[
                {
                  titel: "1. Wirkungsfaktor für Flugasche (k_f)",
                  formel: "k_f = 0{,}40, \\quad f / z \\le 0{,}33",
                  erklaerung: "Flugasche nach DIN EN 450-1 reagiert puzzolanisch mit Ca(OH)2. Bei Verwendung von CEM I darf Flugasche mit k = 0,40 angerechnet werden, jedoch nur bis zu maximal 33 % des Zementgehalts."
                },
                {
                  titel: "2. Wirkungsfaktor für Silikastaub (k_s)",
                  formel: "k_s = 1{,}0 \\text{ (für } w/z \\le 0{,}45\\text{)} \\quad \\text{bzw.} \\quad k_s = 2{,}0 \\text{ (für } w/z > 0{,}45\\text{)}, \\quad s / z \\le 0{,}11",
                  erklaerung: "Hochfeiner Silikastaub nach DIN EN 13263-1 weist eine extrem hohe puzzolanische Reaktivität auf. Die anrechenbare Menge ist auf 11 % des Zementgewichts begrenzt."
                },
                {
                  titel: "3. Mindestzementgehalt-Prüfung",
                  formel: "z \\ge z_{\\min} - k_f \\cdot f \\quad \\text{bzw.} \\quad z \\ge 240 \\text{ kg/m}^3",
                  erklaerung: "Trotz Flugascheanrechnung darf der tatsächliche Zementgehalt aus Gründen des Korrosionsschutzes und der Karbonatisierungsbremse die normativen Mindestwerte nicht unzulässig unterschreiten."
                }
              ]}
            />
          </div>

        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 4: WISSENSTEST & PRAXIS-FEEDBACK                                  */}
      {/* ===================================================================== */}
      {activeTab === 'test' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-6 animate-in fade-in duration-300">
          <div className="border-b border-home-grau/20 pb-3 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                <HelpCircle className="text-shiraz" size={20} />
                Fachkompetenz-Prüfung: Expositionsklassen &amp; Dauerhaftigkeit
              </h3>
              <p className="text-xs text-text-main/70 mt-1">
                Beantworten Sie 5 anspruchsvolle Prüfungsfragen zur normativen Zuordnung nach DIN EN 206 und DIN 1045-2:
              </p>
            </div>
            {quizSubmitted && (
              <div className="px-3 py-1.5 rounded-xl bg-shiraz text-white font-bold text-sm">
                Ergebnis: {calculateScore()} / {quizQuestions.length} Punkte
              </div>
            )}
          </div>

          <div className="space-y-6">
            {quizQuestions.map((q, qIdx) => {
              const selectedOpt = quizAnswers[qIdx];
              const isCorrect = selectedOpt === q.correctIndex;

              return (
                <div key={qIdx} className="p-4 bg-off-white rounded-xl border border-home-grau/20 space-y-3">
                  <div className="font-bold text-sm text-text-main">
                    Frage {qIdx + 1}: {q.question}
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    {q.options.map((opt, oIdx) => {
                      const isOptionSelected = selectedOpt === oIdx;
                      let btnStyle = 'bg-white text-text-main/80 border-home-grau/30 hover:border-shiraz/50';

                      if (quizSubmitted) {
                        if (oIdx === q.correctIndex) {
                          btnStyle = 'bg-emerald-50 text-emerald-900 border-emerald-500 font-bold';
                        } else if (isOptionSelected) {
                          btnStyle = 'bg-rose-50 text-rose-900 border-rose-500';
                        }
                      } else if (isOptionSelected) {
                        btnStyle = 'bg-shiraz/10 text-shiraz border-shiraz font-bold';
                      }

                      return (
                        <button
                          key={oIdx}
                          type="button"
                          onClick={() => handleQuizSelect(qIdx, oIdx)}
                          className={`p-2.5 rounded-lg border text-left text-xs transition-all cursor-pointer flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {quizSubmitted && oIdx === q.correctIndex && (
                            <CheckCircle2 size={16} className="text-emerald-700 shrink-0 ml-2" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {quizSubmitted && (
                    <div className={`p-3 rounded-lg text-xs leading-relaxed border ${
                      isCorrect 
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' 
                        : 'bg-rose-50/70 border-rose-200 text-rose-950'
                    }`}>
                      <div className="font-bold mb-1 flex items-center gap-1.5">
                        {isCorrect ? '✓ Korrekt gelöst!' : '✕ Leider falsch.'}
                      </div>
                      <p>{q.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-2 flex justify-end">
            {!quizSubmitted ? (
              <button
                type="button"
                onClick={() => setQuizSubmitted(true)}
                disabled={Object.keys(quizAnswers).length < quizQuestions.length}
                className="px-6 py-2.5 bg-shiraz text-white font-bold text-sm rounded-xl hover:opacity-90 transition-all disabled:opacity-40 cursor-pointer"
              >
                Antworten auswerten
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setQuizSubmitted(false);
                  setQuizAnswers({});
                }}
                className="px-6 py-2.5 bg-off-white text-text-main border border-home-grau/30 font-bold text-sm rounded-xl hover:bg-white transition-all cursor-pointer"
              >
                Test wiederholen
              </button>
            )}
          </div>
        </div>
      )}

      {/* 4. MODUL-FOOTER (OHNE Links bei DIN-Normen nach Systemanweisung!) */}
      <ModuleFooter
        wikipedia={[
          { title: 'Beton (Abschnitt Dauerhaftigkeit)', url: 'https://de.wikipedia.org/wiki/Beton' },
          { title: 'Karbonatisierung (Beton)', url: 'https://de.wikipedia.org/wiki/Karbonatisierung_(Beton)' },
          { title: 'Betondeckung', url: 'https://de.wikipedia.org/wiki/Betondeckung' }
        ]}
        literatur={[
          'Wendehorst Baustoffkunde: Grundlagen, Baustoffe und Werkstoffprüfung (37. Auflage, Springer Vieweg)',
          'Grübl, P.; Weigler, H.; Siebel, E.: Beton – Arten, Herstellung und Eigenschaften (Ernst & Sohn)',
          'DAfStb-Heft 600: Erläuterungen zu DIN EN 1992-1-1 (Eurocode 2)',
          'DBV-Merkblatt: Betondeckung und Bewehrung nach Eurocode 2 (Deutscher Beton- und Bautechnik-Verein e.V.)',
          'DAfStb-Richtlinie: Vorbeugende Maßnahmen gegen schädigende Alkalireaktion im Beton (Alkali-Richtlinie)'
        ]}
        regelwerke={[
          { title: 'DIN EN 206:2021-06 (Beton – Festlegung, Eigenschaften, Herstellung und Konformität)' },
          { title: 'DIN 1045-2:2023-08 (Tragwerke aus Beton, Stahlbeton und Spannbeton – Teil 2: Beton; Anwendungsregeln zu DIN EN 206)' },
          { title: 'DIN EN 1992-1-1:2011-01 + DIN EN 1992-1-1/NA:2013-04 (Eurocode 2: Bemessung und Konstruktion von Stahlbeton- und Spannbetontragwerken)' },
          { title: 'DAfStb Alkali-Richtlinie (Ausgabe 2013-10)' }
        ]}
        formeln={
          activeTab === 'grundlagen'
            ? [
                {
                  formel: '(w/z)_{\\text{eq}} = \\frac{w}{z + k_f \\cdot f + k_s \\cdot s}',
                  erklaerung: 'Äquivalenter Wasserzementwert nach DIN EN 206 und DIN 1045-2 unter Anrechnung reaktiver Typ-II-Zusatzstoffe mit den Wirkungsfaktoren k_f = 0,40 und k_s = 1,0 bis 2,0.',
                  quelle: 'DIN EN 206'
                },
                {
                  formel: 'c_{\\text{nom}} = c_{\\text{min}} + \\Delta c_{\\text{dev}} = \\max\\{c_{\\text{min},b}; c_{\\text{min},\\text{dur}}; 10\\text{ mm}\\} + \\Delta c_{\\text{dev}}',
                  erklaerung: 'Nennmaß der Betondeckung nach Eurocode 2 (DIN EN 1992-1-1) aus Mindestbetondeckung zur Verbundsicherung, Dauerhaftigkeitsmindestmaß c_min,dur und dem Vorhaltemaß Delta c_dev.',
                  quelle: 'DIN EN 1992-1-1'
                }
              ]
            : []
        }
      />
    </div>
  );
}
