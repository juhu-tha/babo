import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState, useMemo } from 'react';
import { 
  Layers, 
  Maximize2, 
  ShieldCheck, 
  Sparkles, 
  Zap, 
  Thermometer, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Calculator, 
  Compass, 
  Building2, 
  Sliders, 
  ChevronRight, 
  FileText 
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { InlineMath } from 'react-katex';

// Types and Interfaces
interface GlassProduct {
  id: string;
  name: string;
  shortName: string;
  standard: string;
  thicknessRange: string;
  typicalThickness: string;
  production: string;
  safetyCategory: 'Normalglas' | 'Sicherheitsglas (ESG)' | 'Verbundsicherheitsglas (VSG)' | 'Teilvorgespannt (TVG)' | 'Sonderglas';
  coatingBedampfung: string;
  gasFilling: string;
  uValueRange: string; // W/(m²K)
  gValueRange: string;
  soundRw: string; // dB
  pricePerSqm: string; // €/m² (Großhandel/Einbaufertig)
  applications: string[];
  pros: string[];
  cons: string[];
  normen: string[];
}

interface WindowType {
  id: string;
  name: string;
  frameMaterial: 'Holz' | 'Kunststoff (PVC)' | 'Aluminium' | 'Holz-Aluminium' | 'Stahl (Schlankprofil)';
  glazingType: string;
  typicalUw: number; // W/(m²K)
  soundProtectionClass: string; // SSK 1 bis 6
  airTightnessClass: string; // Klasse 1-4 (DIN EN 12207)
  waterTightnessClass: string; // 1A-9A, Exxx (DIN EN 12208)
  windResistanceClass: string; // C1-C5, B1-B5 (DIN EN 12210)
  resistanceClassRC: string; // RC 1 N bis RC 3 / RC 4
  typicalPricePerSqm: number; // €/m² inkl. Flügel & Beschläge
  pros: string[];
  cons: string[];
  normen: string[];
}

const GLASS_PRODUCTS: GlassProduct[] = [
  {
    id: 'floatglas',
    name: 'Floatglas (Spiegelglas / Normalglas)',
    shortName: 'Floatglas',
    standard: 'DIN EN 572-2',
    thicknessRange: '2 mm bis 25 mm',
    typicalThickness: '4 mm, 6 mm, 8 mm',
    production: 'Kontinuierlicher Float-Prozess: Aufschmelzen von Quarzsand, Kalk und Soda bei 1.600 °C, kontrolliertes Ausgießen auf ein flüssiges Zinnbad (ca. 1.000 °C) und stufenfreie Kühlung.',
    safetyCategory: 'Normalglas',
    coatingBedampfung: 'Unbeschichtet oder pyrolytische Hartbeschichtung direkt auf der Floatlinie.',
    gasFilling: 'Entfällt (Einzelscheibe)',
    uValueRange: 'Ug ≈ 5,7 – 5,8 W/(m²K)',
    gValueRange: 'g ≈ 0,82 – 0,86 (hoher solarer Eintrag)',
    soundRw: 'Rw ≈ 28 – 34 dB (nach Dicke)',
    pricePerSqm: '18 – 45 €/m²',
    applications: [
      'Basisglas für alle weiterveredelten Isolier-, ESG- und VSG-Gläser',
      'Möbelbau, Bilderrahmen, Innenraum-Regalböden',
      'Gewächshäuser, einfache Innenverglasungen ohne Personenstoßgefahr'
    ],
    pros: [
      'Absolut plane, verzerrungsfreie Oberfläche',
      'Sehr wirtschaftliche Massenfertigung',
      'Ausgezeichnete Lichttransmission (τ_v ≈ 90 %)'
    ],
    cons: [
      'Geringe Biegezugfestigkeit (f_k ≈ 45 N/mm²)',
      'Gefährlicher Schollenbruch mit messerscharfen Bruchkanten',
      'Sehr empfindlich gegenüber thermischen Spannungen (ΔT > 40 K führt zu Thermosprung)'
    ],
    normen: ['DIN EN 572-2', 'DIN EN 572-1']
  },
  {
    id: 'esg',
    name: 'Einscheibensicherheitsglas (ESG & ESG-H)',
    shortName: 'ESG / ESG-H',
    standard: 'DIN EN 12150-1 & DIN EN 14179',
    thicknessRange: '3 mm bis 19 mm',
    typicalThickness: '6 mm, 8 mm, 10 mm, 12 mm',
    production: 'Thermisches Vorspannen: Erhitzen einer zugeschnittenen Scheibe auf ca. 620–680 °C und schlagartiges Abblasen mit Kaltluft. Dies erzeugt permanente Druckspannungen in der Oberfläche (~90–120 MPa) und Zugspannungen im Kern.',
    safetyCategory: 'Sicherheitsglas (ESG)',
    coatingBedampfung: 'Vor dem Vorspannen aufgebrachte vorspannbare Low-E- oder Sonnenschutz-Schichten.',
    gasFilling: 'Entfällt als Einzelscheibe (im Isolierglas integrierbar)',
    uValueRange: 'Ug ≈ 5,6 W/(m²K) (monolithisch)',
    gValueRange: 'g ≈ 0,82 (unbeschichtet)',
    soundRw: 'Rw ≈ 31 – 36 dB',
    pricePerSqm: '45 – 95 €/m² (ESG-H ca. +25 %)',
    applications: [
      'Ganzglastüren, Duschkabinen, Trennwände',
      'Außenscheiben von Isoliergläsern bei starker Sonnenabsorption (Thermosprung-Schutz)',
      'Punktgehaltene Fassadengläser, Seiten- und Heckscheiben im Fahrzeugbau'
    ],
    pros: [
      'Hohe charakteristische Biegezugfestigkeit (f_k = 120 N/mm²)',
      'Temperaturwechselbeständigkeit bis ΔT = 200 K',
      'Krümelbruch: Zerfällt bei Überlastung in harmlose, stumpfkantige Kleinteile (Verletzungsschutz)'
    ],
    cons: [
      'Nach dem Vorspannen weder schneid-, bohr- noch schleifbar (führt sofort zum Totalkollaps)',
      'Null Resttragfähigkeit nach dem Bruch',
      'Gefahr von Spontanbrüchen durch mikroskopische Nickelsulfid-Einschlüsse (NiS); für Fassaden ist der Heat-Soak-Test (ESG-H nach DIN EN 14179) zwingend erforderlich'
    ],
    normen: ['DIN EN 12150-1', 'DIN EN 14179-1 (ESG-H)', 'DIN 18008-1/2']
  },
  {
    id: 'tvg',
    name: 'Teilvorgespanntes Glas (TVG)',
    shortName: 'TVG',
    standard: 'DIN EN 1863-1',
    thicknessRange: '4 mm bis 12 mm',
    typicalThickness: '6 mm, 8 mm, 10 mm',
    production: 'Ähnlich wie ESG erhitzt, jedoch deutlich langsamer und sanfter abgekühlt. Hierdurch baut sich eine moderate Oberflächendruckspannung (40–70 MPa) auf.',
    safetyCategory: 'Teilvorgespannt (TVG)',
    coatingBedampfung: 'Vorspannbare Dünnschichten analog ESG.',
    gasFilling: 'Entfällt monolithisch',
    uValueRange: 'Ug ≈ 5,6 W/(m²K)',
    gValueRange: 'g ≈ 0,82',
    soundRw: 'Rw ≈ 32 – 36 dB',
    pricePerSqm: '55 – 110 €/m²',
    applications: [
      'Zwingende Basiskomponente für Verbundsicherheitsglas (VSG aus TVG)',
      'Überkopfverglasungen, Vordächer, begehbare Gläser, punktgehaltene Fassaden'
    ],
    pros: [
      'Charakteristische Biegezugfestigkeit f_k = 70 N/mm² (deutlich über Floatglas)',
      'Temperaturbeständig bis ΔT = 100 K',
      'Grobscholliges Bruchbild mit Verkeilung: Bietet im VSG-Verbund eine herausragende statische Resttragfähigkeit!'
    ],
    cons: [
      'Gilt als Einzelscheibe NICHT als Sicherheitsglas (große, spitzkantige Bruchstücke)',
      'Darf nach der Thermobehandlung ebenfalls nicht mehr mechanisch bearbeitet werden'
    ],
    normen: ['DIN EN 1863-1', 'DIN 18008-1/3/4']
  },
  {
    id: 'vsg',
    name: 'Verbundsicherheitsglas (VSG)',
    shortName: 'VSG',
    standard: 'DIN EN ISO 12543-1 bis 6 & DIN EN 14449',
    thicknessRange: '6 mm bis über 80 mm (Panzerglas)',
    typicalThickness: '8 mm (4.4.2), 10 mm (5.5.2), 17 mm (8.8.4)',
    production: 'Zwei oder mehrere Glasscheiben (Float, TVG oder ESG) werden im Autoklaven unter Hitze (~135–140 °C) und Hochdruck (~12 bar) mit zähelastischen Zwischenschichten (Polyvinylbutyral PVB, Dicke n × 0,38 mm oder SentryGlas/Ionoschichten) unlösbar verpresst.',
    safetyCategory: 'Verbundsicherheitsglas (VSG)',
    coatingBedampfung: 'Low-E-Beschichtungen auf den geschützten Innenraumseiten (Position 2 oder 3).',
    gasFilling: 'Entfällt monolithisch',
    uValueRange: 'Ug ≈ 5,2 – 5,5 W/(m²K)',
    gValueRange: 'g ≈ 0,75 – 0,80',
    soundRw: 'Rw ≈ 35 – 44 dB (mit Akustik-PVB-Spezialfolie)',
    pricePerSqm: '75 – 220 €/m² (bei Sonderfolien/Mehrfachverbund bis 600 €)',
    applications: [
      'Absturzsichernde Verglasungen nach DIN 18008-4 (Brüstungen, bodentiefe Fenster)',
      'Überkopf- und Dachverglasungen nach DIN 18008-3 (mindestens die untere Scheibe)',
      'Einbruch-, Beschuss- und Sprengwirkungshemmende Sicherheitsverglasungen (P1A bis P8B nach DIN EN 356)'
    ],
    pros: [
      'Hervorragende Splitterbindung: Scherben haften an der Folie, Öffnung bleibt verschlossen',
      'Hohe Resttragfähigkeit (besonders bei VSG aus 2 × TVG)',
      'Hervorragender UV-Schutz (Folie filtert > 99 % der UV-Strahlung)',
      'Signifikante Schallschutzverbesserung durch Dämpfung des Koinzidenz-Einbruchs'
    ],
    cons: [
      'Höheres Eigengewicht (erfordert stärkere Beschläge und Rahmen)',
      'Offene Kanten müssen vor dauerhafter Feuchtigkeit geschützt werden (Delaminationsrisiko)'
    ],
    normen: ['DIN EN ISO 12543', 'DIN EN 14449', 'DIN EN 356', 'DIN 18008-1/4']
  },
  {
    id: 'isolierglas_2fach',
    name: '2-Scheiben-Wärmedämm-Isolierglas (2-IV)',
    shortName: '2-fach Isolierglas',
    standard: 'DIN EN 1279-1 bis 6',
    thicknessRange: '20 mm bis 32 mm Gesamtaufbau',
    typicalThickness: '24 mm (Aufbau 4 / 16 SZR / 4)',
    production: 'Zwei Scheiben Floatglas (oder ESG/VSG) mit gasdichtem Randverbund: Primärdichtung aus Butyl (Wasserdampfsperre), Sekundärdichtung aus Polysulfid oder Polyurethan, Abstandhalter mit integriertem Trocknungsmittel (Molekularsieb).',
    safetyCategory: 'Normalglas',
    coatingBedampfung: 'Low-E (Wärmefunktionsschicht): Nanometerdünne Silberbedampfung auf Position 3 reflektiert langwellige Infrarot-Raumwärme.',
    gasFilling: 'Argon (90 %) im Scheibenzwischenraum (SZR 14–16 mm)',
    uValueRange: 'Ug = 1,1 – 1,2 W/(m²K)',
    gValueRange: 'g = 0,60 – 0,65 (hoher passiver solarer Wärmegewinn)',
    soundRw: 'Rw ≈ 31 – 34 dB',
    pricePerSqm: '65 – 110 €/m²',
    applications: [
      'Standard-Altbausanierung, Denkmalpflege, unbeheizte Nebengebäude',
      'Leichte Fensterkonstruktionen mit schmalen Profilbautiefen'
    ],
    pros: [
      'Geringes Gewicht (nur ca. 20 kg/m² Glasfläche)',
      'Geringe Rahmenbautiefe erforderlich (auch für schlanke historische Profile)',
      'Sehr günstiger Anschaffungspreis'
    ],
    cons: [
      'Erfüllt bei Neubauten die GEG-Mindestanforderungen für Gesamtelemente oft nur knapp',
      'Spürbar kühlere innere Scheibenoberfläche im Winter (~15 °C bei -10 °C außen)',
      'Kondensatbildung an den Scheibenrändern bei Aluminium-Abstandhaltern'
    ],
    normen: ['DIN EN 1279', 'DIN EN 673', 'GModG (vormals GEG)']
  },
  {
    id: 'isolierglas_3fach',
    name: '3-Scheiben-Wärmeschutz-Isolierglas (3-IV, GEG-Standard)',
    shortName: '3-fach Isolierglas',
    standard: 'DIN EN 1279-1 bis 6',
    thicknessRange: '36 mm bis 52 mm Gesamtaufbau',
    typicalThickness: '44 mm (Aufbau 4 / 16 SZR / 4 / 16 SZR / 4)',
    production: 'Drei Scheiben mit zweifachem gasgefülltem Zwischenraum und Randverbund mit "Warmer Kante" (Edelstahl/Kunststoff-Abstandhalter zur Wärmebrückenminimierung).',
    safetyCategory: 'Normalglas',
    coatingBedampfung: 'Zwei Low-E-Schichten auf Position 2 und 5 (Magnetron-Sputtern mit Silber-Multilayer).',
    gasFilling: 'Argon (90 %) liefert Ug = 0,6 – 0,7 W/(m²K); Krypton liefert Ug = 0,5 W/(m²K)',
    uValueRange: 'Ug = 0,5 – 0,7 W/(m²K)',
    gValueRange: 'g = 0,50 – 0,60',
    soundRw: 'Rw ≈ 34 – 38 dB (asymmetrischer Aufbau bis 48 dB)',
    pricePerSqm: '95 – 175 €/m²',
    applications: [
      'Aktueller Stand der Technik für Neubau und Kernsanierung (GEG / KfW / Passivhaus)',
      'Wohnungsbau, moderne Verwaltungs- und Bildungsbauten'
    ],
    pros: [
      'Exzellenter Wärmeschutz: Halbiert Wärmeverluste gegenüber 2-fach Glas!',
      'Hohe innere Oberflächentemperatur (> 17,5 °C bei -10 °C außen) verhindert Kaltluftabfall und Zugerscheinungen',
      'Keine Kondensatbildung im Innenraum'
    ],
    cons: [
      'Hohes Gewicht (ca. 30 kg/m²; belastet Fensterbeschläge und erschwert Montage)',
      'Geringerer g-Wert (weniger passive solare Gewinne als 2-fach Glas)',
      'Gelegentliches Beschlagen auf der Außenseite (Tauwasser außen) in den Morgenstunden'
    ],
    normen: ['DIN EN 1279', 'DIN EN ISO 10077-1', 'GModG (vormals GEG)']
  },
  {
    id: 'sonnenschutzglas',
    name: 'Sonnenschutz-Isolierglas (Selektivglas)',
    shortName: 'Sonnenschutzglas',
    standard: 'DIN EN 1279 & DIN EN 410',
    thicknessRange: '28 mm bis 54 mm',
    typicalThickness: '44 mm (Aufbau z. B. 6 SSG / 16 / 4 / 16 / 4 Low-E)',
    production: 'Spezielle metallische Interferenzschichten (Silber- und Metalloxid-Nanobeschichtungen), die sichtbares Licht durchlassen, jedoch das nahe Infrarot (Wärmestrahlung der Sonne) reflektieren.',
    safetyCategory: 'Normalglas',
    coatingBedampfung: 'Hochselektive Beschichtung auf Position 2. Selektivitätskennzahl S = Lichttransmission τ_v / g-Wert (Idealwert S ≈ 2,0).',
    gasFilling: 'Argon 90 %',
    uValueRange: 'Ug = 0,6 – 1,0 W/(m²K)',
    gValueRange: 'g = 0,22 – 0,38 (drastische Reduktion der Kühllast!)',
    soundRw: 'Rw ≈ 36 – 42 dB',
    pricePerSqm: '140 – 260 €/m²',
    applications: [
      'Großflächige Glasfassaden, Bürogebäude, Süd- und Westfassaden',
      'Wintergärten, Glasüberdachungen ohne mechanische Außenbeschattung'
    ],
    pros: [
      'Verhindert sommerliche Überhitzung nach DIN 4108-2 ohne zwingende Außenjalousie',
      'Senkt die Betriebs- und Investitionskosten für Klimatechnik drastisch',
      'Hohe Farbneutralität bei modernen Beschichtungen'
    ],
    cons: [
      'Geringere solare Wärmegewinne in der winterlichen Heizperiode',
      'Leicht reduzierte Tageslichttransmission (τ_v = 50–70 %)',
      'Höherer Beschaffungspreis'
    ],
    normen: ['DIN EN 410', 'DIN EN 1279', 'DIN 4108-2']
  },
  {
    id: 'vakuumisolierglas',
    name: 'Vakuum-Isolierglas (VIG - Ultra-Schlankglas)',
    shortName: 'Vakuumglas (VIG)',
    standard: 'ISO 19916-1 / DIN SPEC Zulassungen',
    thicknessRange: '6 mm bis 12 mm Gesamtdicke!',
    typicalThickness: '8,3 mm (4 mm Glas / 0,3 mm Vakuum / 4 mm Glas)',
    production: 'Zwei Glasscheiben mit hoch-evakuiertem Zwischenraum (Druck p < 0,1 Pa). Ein unsichtbares Raster mikrofeiner zylindrischer Stützkörper (Abstand ca. 20–40 mm) verhindert das Zusammenpressen der Scheiben durch den atmosphärischen Luftdruck. Randverbund hermetisch verlötet (Glaslot/Metallot).',
    safetyCategory: 'Normalglas',
    coatingBedampfung: 'Doppelte Low-E-Beschichtung auf Vakuumseite.',
    gasFilling: 'Hochvakuum (< 10⁻³ mbar, eliminiert Wärmeleitung und Konvektion vollständig)',
    uValueRange: 'Ug = 0,4 – 0,7 W/(m²K)',
    gValueRange: 'g = 0,55 – 0,62',
    soundRw: 'Rw ≈ 36 – 39 dB (sehr hohe Schalldämmung trotz geringer Masse)',
    pricePerSqm: '320 – 580 €/m²',
    applications: [
      'Denkmalgeschützte Bauten: Energetische Sanierung historischer Kastenfenster ohne Profiländerung!',
      'Schlanke Schiebeflügel und filigrane Vorhangfassaden',
      'Kühlmöbelbau und Schienenfahrzeuge'
    ],
    pros: [
      'Sensationell geringe Bautiefe (nur ~8 mm statt 44 mm)',
      'Geringes Gewicht (nur ~20 kg/m² bei Ug-Werten von 3-fach Glas)',
      'Hervorragende akustische Entkopplung durch das Vakuum'
    ],
    cons: [
      'Noch hohe Herstellkosten und begrenzte Lieferkapazitäten',
      'Mikro-Stützkörper aus nächster Nähe bei direktem Streiflicht sichtbar',
      'Sehr strenge Maßtoleranzen bei der Bestellung (kein Nachschneiden möglich)'
    ],
    normen: ['ISO 19916-1', 'abZ / aBG des DIBt']
  }
];

const WINDOW_TYPES: WindowType[] = [
  {
    id: 'kunststoff_fenster',
    name: 'Kunststoff-Fenster (PVC-U mit Mehrkammerprofil)',
    frameMaterial: 'Kunststoff (PVC)',
    glazingType: '3-fach Wärmeschutzglas (Ug = 0,6 W/m²K, Warme Kante)',
    typicalUw: 0.85,
    soundProtectionClass: 'SSK 2 bis SSK 5 (bis 45 dB)',
    airTightnessClass: 'Klasse 4',
    waterTightnessClass: 'Klasse 9A (bis 600 Pa)',
    windResistanceClass: 'Klasse C5',
    resistanceClassRC: 'RC 2 / RC 3',
    typicalPricePerSqm: 280,
    pros: [
      'Sehr wirtschaftliches Preis-Leistungs-Verhältnis',
      'Extrem pflegeleicht und witterungsbeständig (nie streichen)',
      'Hervorragende thermische Rahmendämmung durch 5–7 Kammern mit Mitteldichtung (Uf ≈ 0,9–1,1 W/m²K)',
      '100 % recycelbarer PVC-Kern im Closed-Loop-System'
    ],
    cons: [
      'Größere Profilansichtsbreiten als Aluminium oder Stahl',
      'Höhere thermische Längenausdehnung (erfordert Stahlversteifungen im Kern)',
      'Statisch begrenzt bei überhohen Elementen'
    ],
    normen: ['DIN EN 12608', 'RAL-GZ 716', 'DIN EN 14351-1']
  },
  {
    id: 'holz_fenster',
    name: 'Massivholz-Fenster (Kiefer, Lärche, Eiche)',
    frameMaterial: 'Holz',
    glazingType: '3-fach Isolierglas (Ug = 0,6 W/m²K, Warme Kante)',
    typicalUw: 0.88,
    soundProtectionClass: 'SSK 2 bis SSK 5',
    airTightnessClass: 'Klasse 4',
    waterTightnessClass: 'Klasse 9A',
    windResistanceClass: 'Klasse C4',
    resistanceClassRC: 'RC 2 / RC 3',
    typicalPricePerSqm: 420,
    pros: [
      'Nachhaltiger, biogener Rohstoff mit negativer CO₂-Bilanz (Kohlenstoffspeicher)',
      'Natürliche Wohnatmosphäre, hervorragende Haptik und antistatisch',
      'Hohe Eigensteifigkeit und sehr gute werkstoffliche Wärmedämmung (Uf ≈ 1,1–1,3 W/m²K)',
      'Problemlos reparierbar und farblich umgestaltbar'
    ],
    cons: [
      'Regelmäßiger Wartungsaufwand (Lasuren oder deckende Lacke alle 5–8 Jahre erneuern)',
      'Feuchteempfindlich bei mangelhafter Wasserableitung im Falz'
    ],
    normen: ['DIN EN 14351-1', 'DIN 68121', 'VFF-Merkblatt HO.01']
  },
  {
    id: 'holz_alu_fenster',
    name: 'Holz-Aluminium-Verbundfenster (Premium-Standard)',
    frameMaterial: 'Holz-Aluminium',
    glazingType: '3-fach Isolierglas (Ug = 0,5 – 0,6 W/m²K)',
    typicalUw: 0.78,
    soundProtectionClass: 'SSK 3 bis SSK 5 (bis 47 dB)',
    airTightnessClass: 'Klasse 4',
    waterTightnessClass: 'Klasse E900',
    windResistanceClass: 'Klasse C5',
    resistanceClassRC: 'RC 2 / RC 3',
    typicalPricePerSqm: 580,
    pros: [
      'Kombiniert die Vorteile beider Welten: Warme Holzatmosphäre innen + unverwüstliche Aluschale außen',
      'Absolut wartungsfrei an der bewitterten Außenseite',
      'Hinterlüftete Alu-Vorsatzschale verhindert Feuchtestau am Holz',
      'Höchste Lebensdauer (> 40–50 Jahre) und Passivhaus-Zertifizierung möglich'
    ],
    cons: [
      'Höhere Investitionskosten (ca. 40 % über reinem Holz, 100 % über PVC)',
      'Aufwendigere Fertigung und Demontage beim Rückbau'
    ],
    normen: ['DIN EN 14351-1', 'VFF HO.03']
  },
  {
    id: 'alu_fenster',
    name: 'Aluminium-Fenster mit thermischer Trennung',
    frameMaterial: 'Aluminium',
    glazingType: '3-fach Isolierglas oder Sonnenschutzglas',
    typicalUw: 0.92,
    soundProtectionClass: 'SSK 3 bis SSK 5',
    airTightnessClass: 'Klasse 4',
    waterTightnessClass: 'Klasse E900',
    windResistanceClass: 'Klasse C5',
    resistanceClassRC: 'RC 2 bis RC 4',
    typicalPricePerSqm: 520,
    pros: [
      'Sehr schlanke Rahmenprofile und maximale Glasanteile (Tageslichtausbeute)',
      'Enorme statische Belastbarkeit für raumhohe Schiebeelemente und Vorhangfassaden',
      'Absolut korrosionsfrei und dimensionsstabil (kein Verziehen bei Feuchte)',
      'Thermisch getrennte Profile mit Polyamid-Isolierstegen (Uf ≈ 1,0–1,4 W/m²K)'
    ],
    cons: [
      'Höherer Primärenergieaufwand bei der Rohaluminium-Herstellung (durch Rezyklat-Alu stark reduzierbar)',
      'Kühlere Rahmenhaptik im Innenraum'
    ],
    normen: ['DIN EN 14351-1', 'DIN 17615', 'RAL-GZ 695']
  },
  {
    id: 'kastenfenster',
    name: 'Denkmal-Kastenfenster (Zweischalig / Verbundkasten)',
    frameMaterial: 'Holz',
    glazingType: 'Außen: Float / Restaurierungsglas (4 mm); Innen: 2-IV oder Vakuumglas (VIG)',
    typicalUw: 1.10,
    soundProtectionClass: 'SSK 4 bis SSK 6 (bis 52 dB - Weltklasse!)',
    airTightnessClass: 'Klasse 3-4',
    waterTightnessClass: 'Klasse 7A',
    windResistanceClass: 'Klasse B3',
    resistanceClassRC: 'RC 1 N bis RC 2',
    typicalPricePerSqm: 850,
    pros: [
      'Uneingeschränkte Denkmalverträglichkeit mit historischen Profilansichten',
      'Herausragender Schallschutz durch großen Luftzwischenraum (100–180 mm) zwischen den Flügeln',
      'Optimierte natürliche Pufferzone gegen sommerliche Hitze und winterliche Kälte'
    ],
    cons: [
      'Hohe Anschaffungs- und Restaurierungskosten (hoher handwerklicher Tischleranteil)',
      'Reinigungsaufwand verdoppelt (vier Scheibenoberflächen zu putzen)',
      'Große Wandstärken erforderlich'
    ],
    normen: ['DIN 68121', 'WTA-Merkblätter Fenster', 'Denkmalschutzgesetze der Länder']
  }
];

export default function BpGlaeser() {
  const [activeTab, setActiveTab] = useState<'uebersicht' | 'glasarten' | 'beschichtungen' | 'fenster' | 'kalkulator' | 'normen'>('uebersicht');

  // Interactive U_w Calculator state
  const [fensterBreite, setFensterBreite] = useState<number>(1.23); // m
  const [fensterHoehe, setFensterHoehe] = useState<number>(1.48); // m
  const [rahmenBreiteMm, setRahmenBreiteMm] = useState<number>(110); // mm
  const [ugWert, setUgWert] = useState<number>(0.6); // W/m²K
  const [ufWert, setUfWert] = useState<number>(1.1); // W/m²K
  const [abstandhalterTyp, setAbstandhalterTyp] = useState<'alu' | 'edelstahl' | 'warm_edge_kunststoff'>('warm_edge_kunststoff');
  const [gWert, setGWert] = useState<number>(0.53);
  const [sonneneinstrahlung, setSonneneinstrahlung] = useState<number>(450); // W/m²
  const [selectedGlassId, setSelectedGlassId] = useState<string>('isolierglas_3fach');
  const [selectedWindowId, setSelectedWindowId] = useState<string>('kunststoff_fenster');

  // Spacer Psi values (DIN EN ISO 10077-1)
  const psiValues = {
    alu: 0.080,
    edelstahl: 0.060,
    warm_edge_kunststoff: 0.038
  };

  // Calculation of Window Geometry and U_w
  const calcResults = useMemo(() => {
    const Af_total = fensterBreite * fensterHoehe;
    const b_frame = rahmenBreiteMm / 1000; // in m

    const sichtGlasB = Math.max(0.1, fensterBreite - 2 * b_frame);
    const sichtGlasH = Math.max(0.1, fensterHoehe - 2 * b_frame);

    const Ag = sichtGlasB * sichtGlasH;
    const Af = Af_total - Ag;
    const Lg = 2 * (sichtGlasB + sichtGlasH); // Umfang der Glasscheibe

    const psi = psiValues[abstandhalterTyp];

    // Formula DIN EN ISO 10077-1:
    // U_w = (A_g * U_g + A_f * U_f + l_g * Psi_g) / (A_g + A_f)
    const waermestromGlas = Ag * ugWert;
    const waermestromRahmen = Af * ufWert;
    const waermestromKante = Lg * psi;
    const waermestromGesamt = waermestromGlas + waermestromRahmen + waermestromKante;
    const uw = waermestromGesamt / Af_total;

    // Solar gain: Q_sol = A_g * g * I_sol
    const solareGewinneWatt = Ag * gWert * sonneneinstrahlung;

    // Energiebilanz nach GEG: Erfüllt GEG 2024 (Uw <= 1.30 W/m²K für Sanierung, 0.95 für KfW 40 / 0.80 Passivhaus)
    const gegKonform = uw <= 1.30;
    const passivhausStandard = uw <= 0.80;

    return {
      Af_total,
      Ag,
      Af,
      Lg,
      psi,
      waermestromGlas,
      waermestromRahmen,
      waermestromKante,
      uw,
      solareGewinneWatt,
      gegKonform,
      passivhausStandard
    };
  }, [fensterBreite, fensterHoehe, rahmenBreiteMm, ugWert, ufWert, abstandhalterTyp, gWert, sonneneinstrahlung]);

  return (
    <div className="flex flex-col gap-8" id="bp-glaeser-modul">
      {/* Header Container */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-home-grau/20 pb-4">
          <div>
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
              <Maximize2 className="text-shiraz" size={24} /> Gläser & Fenstertechnik (Bauprodukte)
            </h2>
            <p className="text-xs text-home-grau mt-1">
              Bauarten, Glasdicken, Nanobeschichtungen, Gasfüllungen, Fensterprofile, Normen &amp; Kostenanalysen
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-shiraz/10 text-shiraz rounded-full text-xs font-bold border border-shiraz/20">
              DIN EN 1279 • DIN 18008 • GModG (vormals GEG)
            </span>
          </div>
        </div>

        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-4 leading-relaxed">
          <p>
            Moderne Fenster und Glasfassaden sind hochkomplexe multifunktionale Bauteilsysteme. Sie verbinden Tageslichtnutzung 
            mit extremem Wärmeschutz (<InlineMath math="U_w \le 0{,}80\,\text{W}/(\text{m}^2\text{K})" />), 
            sommerlicher Hitzeabschirmung (<InlineMath math="g\text{-Wert}" />), Schallschutz (<InlineMath math="R_w \ge 45\,\text{dB}" />) 
            und statischer Personensicherheit nach <strong>DIN 18008</strong>. Erfahre hier alle physikalischen Wirkungsweisen 
            von Low-E-Beschichtungen, Scheibenzwischenraum-Füllungen, Sicherheitsgläsern und Rahmenmaterialien.
          </p>
        </div>

        {/* Tab-Navigation */}
        <div className="flex flex-wrap gap-2 pt-6 border-t border-home-grau/20 mt-4">
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'uebersicht' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('uebersicht')}
          >
            <Layers size={16} /> Übersicht &amp; Aufbau
          </button>

          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'glasarten' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('glasarten')}
          >
            <ShieldCheck size={16} /> Glasprodukte &amp; Dicken
          </button>

          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'beschichtungen' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('beschichtungen')}
          >
            <Sparkles size={16} /> Bedampfung, Schichten &amp; Gase
          </button>

          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'fenster' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('fenster')}
          >
            <Building2 size={16} /> Fensterarten &amp; Rahmen
          </button>

          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'kalkulator' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('kalkulator')}
          >
            <Calculator size={16} /> Interaktiver Uw-Rechner
          </button>

          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'normen' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('normen')}
          >
            <FileText size={16} /> Normen &amp; Prüfungen
          </button>
        </div>
      </div>

      {/* TAB 1: ÜBERSICHT & SYSTEMATIK */}
      {activeTab === 'uebersicht' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
            <h3 className="text-base font-bold text-text-main flex items-center gap-2 mb-4">
              <Zap className="text-shiraz" size={18} />
              Anatomie des modernen Mehrscheiben-Isolierglases (MIG nach DIN EN 1279)
            </h3>
            
            <p className="text-xs text-text-main/80 leading-relaxed mb-6">
              Ein modernes Isolierglas besteht aus weit mehr als nur zwei Glasscheiben. Es ist ein hermetisch abgeschlossener, 
              gasgefüllter Hohlkörper mit Nanobeschichtungen und hochpräziser Randsiegelung. 
              Die Bezeichnungsweise der Glasoberflächen erfolgt immer von <strong>außen nach innen</strong> mit den Ziffern 1 bis 4 (bei 2-fach) 
              bzw. 1 bis 6 (bei 3-fach Verglasung).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Aufbau-Visualisierung */}
              <div className="md:col-span-2 bg-off-white p-6 rounded-xl border border-home-grau/25">
                <h4 className="text-xs font-bold text-text-main uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Sliders size={14} className="text-shiraz" /> Scheibenaufbau 3-fach Isolierglas (Position 1 bis 6)
                </h4>

                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 bg-white rounded-lg border border-home-grau/30 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800">Außenscheibe (Pos. 1 &amp; 2)</span>
                      <p className="text-[11px] text-home-grau font-sans">Pos. 1: Wetterseite unbeschichtet | Pos. 2: Sonnenschutz-Bedampfung (optional)</p>
                    </div>
                    <span className="px-2 py-1 bg-slate-100 rounded text-[11px] font-bold">4 – 8 mm Float/ESG</span>
                  </div>

                  <div className="p-2.5 bg-blue-50/70 border border-blue-200 rounded-lg text-blue-900 flex items-center justify-between">
                    <span className="font-sans font-semibold">Scheibenzwischenraum 1 (SZR 1)</span>
                    <span className="font-bold">14 – 18 mm (90 % Argon / Krypton)</span>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-home-grau/30 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800">Mittelscheibe (Pos. 3 &amp; 4)</span>
                      <p className="text-[11px] text-home-grau font-sans">Pos. 3 / 4: Meist unbeschichtet oder zusätzliche Funktionsschicht</p>
                    </div>
                    <span className="px-2 py-1 bg-slate-100 rounded text-[11px] font-bold">4 mm Float/TVG</span>
                  </div>

                  <div className="p-2.5 bg-blue-50/70 border border-blue-200 rounded-lg text-blue-900 flex items-center justify-between">
                    <span className="font-sans font-semibold">Scheibenzwischenraum 2 (SZR 2)</span>
                    <span className="font-bold">14 – 18 mm (90 % Argon / Krypton)</span>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-home-grau/30 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800">Innenscheibe (Pos. 5 &amp; 6)</span>
                      <p className="text-[11px] text-home-grau font-sans">Pos. 5: Low-E-Wärmeschutzschicht (Silber) | Pos. 6: Raumseite (VSG bei Absturzsicherung)</p>
                    </div>
                    <span className="px-2 py-1 bg-slate-100 rounded text-[11px] font-bold">4 – 8 mm Float/VSG</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-home-grau/20 text-xs text-text-main/70 flex items-center gap-2">
                  <Info size={14} className="text-shiraz shrink-0" />
                  <span><strong>Merksatz:</strong> Die Low-E-Schicht liegt geschützt im Zwischenraum (Pos. 3 bei 2-IV, Pos. 2 &amp; 5 bei 3-IV), niemals frei auf der Außenseite, um Oxidation zu verhindern.</span>
                </div>
              </div>

              {/* Randsiegelung */}
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/25 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-text-main uppercase tracking-wider mb-3">
                    Der Randverbund (Zweistufig)
                  </h4>
                  <ul className="text-xs text-text-main/80 space-y-2.5 leading-relaxed">
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 size={14} className="text-shiraz shrink-0 mt-0.5" />
                      <span><strong>Primärdichtung (Polyisobutylen / Butyl):</strong> Dichtet gegen Gasaustritt und verhindert das Eindringen von Wasserdampf (Diffusionssperre).</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 size={14} className="text-shiraz shrink-0 mt-0.5" />
                      <span><strong>Abstandhalter:</strong> Hohlprofil mit Molekularsieb (Zeolith-Trocknungsmittel) bindet eventuelle Restfeuchte.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 size={14} className="text-shiraz shrink-0 mt-0.5" />
                      <span><strong>Sekundärdichtung (Polysulfid / Silikon):</strong> Verklebt die Scheiben mechanisch elastisch im Kantenbereich (3–5 mm Tiefe).</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-[11px]">
                  <strong>Achtung:</strong> Konventionelle Aluminium-Abstandhalter bilden eine massive Kältebrücke (<InlineMath math="\Psi \approx 0{,}08\,\text{W}/(\text{mK})" />). 
                  Standard ist heute die <strong>"Warme Kante"</strong> aus Kunststoff/Edelstahl (<InlineMath math="\Psi \le 0{,}04\,\text{W}/(\text{mK})" />).
                </div>
              </div>
            </div>
          </div>

          {/* Kennwerte-Übersichtstabelle */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
            <h3 className="text-base font-bold text-text-main mb-4 flex items-center gap-2">
              <Thermometer className="text-shiraz" size={18} />
              Wichtige bauphysikalische Kennwerte im Fensterbau
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-off-white border-b border-home-grau/30 text-text-main font-bold">
                    <th className="p-3">Kennwert</th>
                    <th className="p-3">Symbol / Einheit</th>
                    <th className="p-3">Physikalische Bedeutung</th>
                    <th className="p-3">Typische Werte (Stand 2026)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-home-grau/20 text-text-main/80">
                  <tr className="hover:bg-off-white/50">
                    <td className="p-3 font-bold text-slate-900">Glas-Wärmedurchgangskoeffizient</td>
                    <td className="p-3 font-mono font-bold text-shiraz">Ug [W/(m²K)]</td>
                    <td className="p-3">Gibt den Wärmeverlust durch das Verbundglas an (je kleiner, desto besser dämmend).</td>
                    <td className="p-3 font-semibold">2-IV: 1,1 | 3-IV: 0,5 – 0,7 | VIG: 0,5</td>
                  </tr>
                  <tr className="hover:bg-off-white/50">
                    <td className="p-3 font-bold text-slate-900">Rahmen-Wärmedurchgangskoeffizient</td>
                    <td className="p-3 font-mono font-bold text-shiraz">Uf [W/(m²K)]</td>
                    <td className="p-3">Wärmeverlust des Fensterrahmens (abhängig von Kammern, Holzstärke, thermischer Trennung).</td>
                    <td className="p-3 font-semibold">PVC: 0,9–1,2 | Holz: 1,1–1,3 | Alu: 1,1–1,4</td>
                  </tr>
                  <tr className="hover:bg-off-white/50">
                    <td className="p-3 font-bold text-slate-900">Fenster-Gesamtwert</td>
                    <td className="p-3 font-mono font-bold text-shiraz">Uw [W/(m²K)]</td>
                    <td className="p-3">Gesamter Wärmeverlust des Fensters inkl. Glas, Rahmen und Glasrandverbund (<InlineMath math="\Psi_g" />).</td>
                    <td className="p-3 font-semibold">GEG-Max: 1,30 | Standard: 0,80 – 0,95</td>
                  </tr>
                  <tr className="hover:bg-off-white/50">
                    <td className="p-3 font-bold text-slate-900">Gesamtenergiedurchlassgrad</td>
                    <td className="p-3 font-mono font-bold text-shiraz">g-Wert [- / %]</td>
                    <td className="p-3">Anteil der gesamten Sonnenenergie, die durch das Glas in den Raum gelangt (0 bis 1).</td>
                    <td className="p-3 font-semibold">Wärmeschutz: 0,50–0,62 | Sonnenschutz: 0,22–0,38</td>
                  </tr>
                  <tr className="hover:bg-off-white/50">
                    <td className="p-3 font-bold text-slate-900">Lichttransmissionsgrad</td>
                    <td className="p-3 font-mono font-bold text-shiraz">τ_v (TL) [%]</td>
                    <td className="p-3">Anteil der für das menschliche Auge sichtbaren Sonnenstrahlung (380–780 nm).</td>
                    <td className="p-3 font-semibold">Float: ~90 % | 3-IV: 70–75 % | Sonnenschutz: 50–70 %</td>
                  </tr>
                  <tr className="hover:bg-off-white/50">
                    <td className="p-3 font-bold text-slate-900">Lineare Wärmebrücke Glasrand</td>
                    <td className="p-3 font-mono font-bold text-shiraz">Ψg [W/(mK)]</td>
                    <td className="p-3">Zusatzwärmeverlust durch den Abstandhalter im Randverbund des Isolierglases.</td>
                    <td className="p-3 font-semibold">Alu: 0,080 | Edelstahl: 0,060 | Warme Kante: 0,035–0,040</td>
                  </tr>
                  <tr className="hover:bg-off-white/50">
                    <td className="p-3 font-bold text-slate-900">Schallbewertetes Schalldämmmaß</td>
                    <td className="p-3 font-mono font-bold text-shiraz">Rw (C; Ctr) [dB]</td>
                    <td className="p-3">Schalldämmung gegenüber Außenlärm mit Spektrum-Anpassungswerten für Stadtverkehr (Ctr).</td>
                    <td className="p-3 font-semibold">Standard: 32–34 dB | Akustik-VSG: 42–48 dB</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GLASPRODUKTE & DICKEN */}
      {activeTab === 'glasarten' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {GLASS_PRODUCTS.map((prod) => (
              <div 
                key={prod.id} 
                className={`bg-white p-6 rounded-2xl shadow-sm border transition-all flex flex-col justify-between ${
                  selectedGlassId === prod.id ? 'border-shiraz ring-1 ring-shiraz' : 'border-home-grau/30 hover:border-shiraz/40'
                }`}
                onClick={() => setSelectedGlassId(prod.id)}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-off-white border border-home-grau/25 text-text-main/80">
                      {prod.standard}
                    </span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                      prod.safetyCategory.includes('Sicherheit') 
                        ? 'bg-shiraz/10 text-shiraz border border-shiraz/30' 
                        : prod.safetyCategory.includes('Teilvorgespannt')
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : 'bg-slate-100 text-slate-800 border border-slate-200'
                    }`}>
                      {prod.safetyCategory}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-text-main leading-snug">
                    {prod.name}
                  </h3>

                  <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-home-grau/15 text-xs">
                    <div>
                      <span className="text-home-grau text-[10px] uppercase font-bold block">Dickenbereich:</span>
                      <span className="font-semibold text-text-main">{prod.thicknessRange}</span>
                    </div>
                    <div>
                      <span className="text-home-grau text-[10px] uppercase font-bold block">Typische Dicken:</span>
                      <span className="font-semibold text-text-main">{prod.typicalThickness}</span>
                    </div>
                    <div>
                      <span className="text-home-grau text-[10px] uppercase font-bold block">U_g-Bereich:</span>
                      <span className="font-bold text-shiraz">{prod.uValueRange}</span>
                    </div>
                    <div>
                      <span className="text-home-grau text-[10px] uppercase font-bold block">Richtpreis (Glas):</span>
                      <span className="font-bold text-emerald-800">{prod.pricePerSqm}</span>
                    </div>
                  </div>

                  <p className="text-xs text-text-main/80 mt-3 leading-relaxed">
                    {prod.production}
                  </p>

                  <div className="mt-3 bg-off-white p-3 rounded-xl border border-home-grau/20 text-xs">
                    <strong className="text-slate-900 block mb-1">Typische Einsatzbereiche:</strong>
                    <ul className="list-disc pl-4 space-y-0.5 text-text-main/75 text-[11px]">
                      {prod.applications.map((app, i) => (
                        <li key={i}>{app}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-home-grau/20 flex items-center justify-between text-xs">
                  <div className="text-[11px] text-home-grau font-mono">
                    Schallschutz: {prod.soundRw}
                  </div>
                  <button 
                    onClick={() => {
                      if (prod.id === 'isolierglas_2fach') { setUgWert(1.1); setGWert(0.62); }
                      if (prod.id === 'isolierglas_3fach') { setUgWert(0.6); setGWert(0.53); }
                      if (prod.id === 'sonnenschutzglas') { setUgWert(0.8); setGWert(0.28); }
                      if (prod.id === 'vakuumisolierglas') { setUgWert(0.5); setGWert(0.58); }
                      setActiveTab('kalkulator');
                    }}
                    className="text-shiraz font-bold flex items-center gap-1 hover:underline"
                  >
                    Im Rechner testen <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Bruchbilder & Sicherheitsklassen-Erklärung */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
            <h3 className="text-base font-bold text-text-main flex items-center gap-2 mb-3">
              <AlertTriangle className="text-amber-600" size={18} />
              Bruchmechanik &amp; Personensicherheit: Floatglas vs. ESG vs. TVG vs. VSG
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="bg-off-white p-4 rounded-xl border border-home-grau/25">
                <h4 className="font-bold text-slate-900 mb-1 text-sm">Floatglas (Kühlglas)</h4>
                <div className="text-shiraz font-bold text-xs mb-2">f_k = 45 N/mm²</div>
                <p className="text-text-main/80 text-[11px] leading-relaxed">
                  Bricht radial in große, messerscharfe spitze Schollen (Dolchwirkung). 
                  <strong> Verboten</strong> für Brüstungen, Glastüren oder bodentiefe Verglasungen ohne Anprallschutz!
                </p>
              </div>

              <div className="bg-off-white p-4 rounded-xl border border-home-grau/25">
                <h4 className="font-bold text-slate-900 mb-1 text-sm">ESG (Voll vorgespannt)</h4>
                <div className="text-shiraz font-bold text-xs mb-2">f_k = 120 N/mm²</div>
                <p className="text-text-main/80 text-[11px] leading-relaxed">
                  Hohe Eigenspannung. Zerfällt bei Bruch schlagartig in tausende stumpfkantige Krümel (&lt; 1 cm²). 
                  Gefahrlose Bergung, aber <strong>keine Resttragfähigkeit</strong> (Scheibe fällt komplett heraus).
                </p>
              </div>

              <div className="bg-off-white p-4 rounded-xl border border-home-grau/25">
                <h4 className="font-bold text-slate-900 mb-1 text-sm">TVG (Teilvorgespannt)</h4>
                <div className="text-shiraz font-bold text-xs mb-2">f_k = 70 N/mm²</div>
                <p className="text-text-main/80 text-[11px] leading-relaxed">
                  Bricht in großformatige, ineinander verkrallte Schollen. Nur im VSG-Verbund zulässig! 
                  Garantiert exzellente <strong>statische Resttragfähigkeit</strong> bei Überkopf- und Brüstungsgläsern.
                </p>
              </div>

              <div className="bg-off-white p-4 rounded-xl border border-home-grau/25">
                <h4 className="font-bold text-slate-900 mb-1 text-sm">VSG (Verbundglas)</h4>
                <div className="text-shiraz font-bold text-xs mb-2">Splitterbindend + Zäh</div>
                <p className="text-text-main/80 text-[11px] leading-relaxed">
                  Mindestens zwei Scheiben mit zäher PVB-Folie (0,38 bis 1,52 mm). 
                  Splitter haften fest an der Folie; schützt zuverlässig gegen Absturz, Durchsturz und Einbruch (RC 2/RC 3).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: BESCHICHTUNGEN, BEDAMPFUNGEN & GASE */}
      {activeTab === 'beschichtungen' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
            <h3 className="text-base font-bold text-text-main flex items-center gap-2 mb-4">
              <Sparkles className="text-shiraz" size={18} />
              Nanobeschichtungen &amp; Bedampfungsverfahren auf Flachglas
            </h3>

            <p className="text-xs text-text-main/80 leading-relaxed mb-6">
              Reines Glas besitzt ein hohes Strahlungsemissionsvermögen (<InlineMath math="\varepsilon \approx 0{,}84" />), 
              wodurch rund zwei Drittel des Wärmeverlusts auf langwellige Wärmestrahlung zurückzuführen sind. 
              Durch das Aufbringen hauchdünner metallischer Funktionsschichten (typisch 10 bis 100 Nanometer) 
              wird die Wärmestrahlung wie von einem Spiegel reflektiert, während das sichtbare Sonnenlicht fast ungedämpft hindurchtritt.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sputtern vs Pyrolyse */}
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/25">
                <h4 className="text-xs font-bold text-text-main uppercase tracking-wider mb-3">
                  1. Magnetron-Sputtern (Offline-Beschichtung / Soft Coatings)
                </h4>
                <p className="text-xs text-text-main/80 leading-relaxed mb-3">
                  Das moderne Hochleistungsverfahren im Vakuum (PVD - Physical Vapour Deposition). Das fertige Floatglas wird 
                  durch eine Vakuum-Beschichtungsanlage gefahren, in der Targetmaterialien (Silber, Titan, Zinkoxid) 
                  mittels Magnetron-Plasma atomar aufgedampft werden.
                </p>
                <div className="bg-white p-3 rounded-lg border border-home-grau/20 text-xs">
                  <span className="font-bold text-shiraz block mb-1">Schichtaufbau (Silber-Multilayer):</span>
                  <p className="text-[11px] text-text-main/80">
                    Glas → Dielektrikum (Entspiegelung) → Silber-Funktionsschicht (ca. 10 nm) → Opferschicht (Blocker) → Schutzschicht.
                    Erreicht eine extrem niedrige Emissivität von <InlineMath math="\varepsilon_n \le 0{,}01" />!
                  </p>
                </div>
                <div className="mt-3 text-[11px] text-home-grau">
                  <strong>Einschränkung:</strong> Nicht witterungsstabil – muss zwingend auf der geschützten SZR-Seite eingebaut werden.
                </div>
              </div>

              <div className="bg-off-white p-5 rounded-xl border border-home-grau/25">
                <h4 className="text-xs font-bold text-text-main uppercase tracking-wider mb-3">
                  2. Pyrolytische Beschichtung (Online-Beschichtung / Hard Coatings)
                </h4>
                <p className="text-xs text-text-main/80 leading-relaxed mb-3">
                  Erfolgt direkt im Floatglas-Zinnbad bei ca. 600 °C. Zinnchlorid oder Silane werden auf das noch weiche Glas 
                  gesprüht und verschmelzen pyrolytisch mit der Glasoberfläche zu einer extrem harten Zinnoxidschicht (SnO₂:F).
                </p>
                <div className="bg-white p-3 rounded-lg border border-home-grau/20 text-xs">
                  <span className="font-bold text-slate-800 block mb-1">Eigenschaften:</span>
                  <p className="text-[11px] text-text-main/80">
                    Mechanisch und chemisch unzerstörbar; kann sogar auf der wetterexponierten Außenseite liegen. 
                    Die Emissivität ist mit <InlineMath math="\varepsilon_n \approx 0{,}15" /> jedoch deutlich schlechter als bei Sputter-Silberschichten.
                  </p>
                </div>
                <div className="mt-3 text-[11px] text-home-grau">
                  <strong>Anwendung:</strong> Selbstreinigende Gläser (TiO₂-Photokatalyse), Heizelemente, historische Fenster.
                </div>
              </div>
            </div>
          </div>

          {/* Gasfüllungen im Scheibenzwischenraum */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
            <h3 className="text-base font-bold text-text-main flex items-center gap-2 mb-4">
              <Zap className="text-shiraz" size={18} />
              Gasfüllungen im Scheibenzwischenraum (SZR) im Vergleich
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-off-white border-b border-home-grau/30 text-text-main font-bold">
                    <th className="p-3">Gasart</th>
                    <th className="p-3">Wärmeleitfähigkeit λ bei 10 °C</th>
                    <th className="p-3">Dichte ρ [kg/m³]</th>
                    <th className="p-3">Optimaler SZR-Abstand</th>
                    <th className="p-3">Erreichbarer Ug (3-IV)</th>
                    <th className="p-3">Kosten &amp; Verfügbarkeit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-home-grau/20 text-text-main/80">
                  <tr className="hover:bg-off-white/50">
                    <td className="p-3 font-bold text-slate-800">Luft (trocken)</td>
                    <td className="p-3 font-mono">0,0250 W/(mK)</td>
                    <td className="p-3 font-mono">1,24</td>
                    <td className="p-3">16 mm</td>
                    <td className="p-3 font-bold text-slate-700">~ 0,9 W/(m²K)</td>
                    <td className="p-3 text-emerald-700">Kostenlos (heute nur noch bei Billig- oder Altglas)</td>
                  </tr>
                  <tr className="hover:bg-off-white/50 bg-shiraz/5">
                    <td className="p-3 font-bold text-shiraz">Argon (Ar, 90 %) - Industriestandard</td>
                    <td className="p-3 font-mono font-bold text-shiraz">0,0170 W/(mK)</td>
                    <td className="p-3 font-mono">1,70</td>
                    <td className="p-3 font-semibold">14 – 16 mm</td>
                    <td className="p-3 font-bold text-shiraz">0,6 – 0,7 W/(m²K)</td>
                    <td className="p-3 font-bold text-emerald-800">Sehr günstig (~0,93 % in Luft), Standard bei &gt; 95 % aller Fenster</td>
                  </tr>
                  <tr className="hover:bg-off-white/50">
                    <td className="p-3 font-bold text-blue-900">Krypton (Kr, 90 %)</td>
                    <td className="p-3 font-mono font-bold text-blue-900">0,0094 W/(mK)</td>
                    <td className="p-3 font-mono">3,56</td>
                    <td className="p-3 font-semibold">10 – 12 mm</td>
                    <td className="p-3 font-bold text-blue-900">0,5 W/(m²K)</td>
                    <td className="p-3 text-amber-800">Sehr teuer (Edelgas mit extrem geringem Luftanteil). Eingesetzt für schlanke Profile</td>
                  </tr>
                  <tr className="hover:bg-off-white/50">
                    <td className="p-3 font-bold text-purple-900">Xenon (Xe)</td>
                    <td className="p-3 font-mono font-bold text-purple-900">0,0056 W/(mK)</td>
                    <td className="p-3 font-mono">5,59</td>
                    <td className="p-3 font-semibold">6 – 8 mm</td>
                    <td className="p-3 font-bold text-purple-900">&lt; 0,4 W/(m²K)</td>
                    <td className="p-3 text-red-700">Extrem teuer; im Bauwesen wirtschaftlich nicht relevant (nur Luft- und Raumfahrt)</td>
                  </tr>
                  <tr className="hover:bg-off-white/50 bg-amber-50/50">
                    <td className="p-3 font-bold text-amber-900">Vakuum (p &lt; 0,1 Pa)</td>
                    <td className="p-3 font-mono font-bold text-amber-900">0,0000 W/(mK) (Keine Konvektion!)</td>
                    <td className="p-3 font-mono">~ 0,00</td>
                    <td className="p-3 font-bold text-amber-900">0,2 – 0,3 mm!</td>
                    <td className="p-3 font-bold text-amber-900">0,4 – 0,7 W/(m²K)</td>
                    <td className="p-3 text-amber-900">Aufwendige Randversiegelung, Zukunftstechnologie VIG für Denkmalschutz</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 p-4 bg-off-white rounded-xl border border-home-grau/25 text-xs text-text-main/80 flex items-start gap-2">
              <Info size={16} className="text-shiraz shrink-0 mt-0.5" />
              <div>
                <strong>Diffusionsverlust über die Lebensdauer:</strong> 
                Nach DIN EN 1279-3 darf der jährliche Gasaustritt aus dem Randverbund höchstens <strong>1,0 % pro Jahr</strong> betragen (<InlineMath math="L_i \le 1{,}0\,\%/a" />). 
                Hochwertige Isoliergläser behalten auch nach 25–30 Jahren noch über 80 % ihrer ursprünglichen Argon-Füllung!
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: FENSTERARTEN & RAHMENMATERIALIEN */}
      {activeTab === 'fenster' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {WINDOW_TYPES.map((win) => (
              <div 
                key={win.id}
                className={`bg-white p-6 rounded-2xl shadow-sm border transition-all flex flex-col justify-between ${
                  selectedWindowId === win.id ? 'border-shiraz ring-1 ring-shiraz' : 'border-home-grau/30 hover:border-shiraz/40'
                }`}
                onClick={() => setSelectedWindowId(win.id)}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-off-white border border-home-grau/25 text-slate-800">
                      Rahmen: {win.frameMaterial}
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Einbruchschutz: {win.resistanceClassRC}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-text-main leading-snug">
                    {win.name}
                  </h3>

                  <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-home-grau/15 text-xs">
                    <div>
                      <span className="text-home-grau text-[10px] uppercase font-bold block">Typischer Uw-Wert:</span>
                      <span className="font-bold text-shiraz text-sm">{formatDeWert(win.typicalUw)} W/(m²K)</span>
                    </div>
                    <div>
                      <span className="text-home-grau text-[10px] uppercase font-bold block">Richtpreis Element:</span>
                      <span className="font-bold text-emerald-800 text-sm">~ {formatDeWert(win.typicalPricePerSqm)} €/m²</span>
                    </div>
                    <div>
                      <span className="text-home-grau text-[10px] uppercase font-bold block">Schallschutz:</span>
                      <span className="font-semibold text-text-main">{win.soundProtectionClass}</span>
                    </div>
                    <div>
                      <span className="text-home-grau text-[10px] uppercase font-bold block">Schlagregendichtheit:</span>
                      <span className="font-semibold text-text-main">{win.waterTightnessClass}</span>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 text-xs">
                    <div>
                      <strong className="text-emerald-800 text-[11px] block">Vorteile:</strong>
                      <ul className="list-disc pl-4 text-text-main/80 space-y-0.5 text-[11px]">
                        {win.pros.map((p, idx) => <li key={idx}>{p}</li>)}
                      </ul>
                    </div>

                    <div>
                      <strong className="text-amber-800 text-[11px] block">Einschränkungen:</strong>
                      <ul className="list-disc pl-4 text-text-main/80 space-y-0.5 text-[11px]">
                        {win.cons.map((c, idx) => <li key={idx}>{c}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-home-grau/20 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-home-grau font-mono">
                    {win.normen.join(' • ')}
                  </span>
                  <button 
                    onClick={() => {
                      if (win.id === 'kunststoff_fenster') { setUfWert(1.1); setRahmenBreiteMm(115); }
                      if (win.id === 'holz_fenster') { setUfWert(1.2); setRahmenBreiteMm(110); }
                      if (win.id === 'holz_alu_fenster') { setUfWert(1.0); setRahmenBreiteMm(110); }
                      if (win.id === 'alu_fenster') { setUfWert(1.2); setRahmenBreiteMm(95); }
                      if (win.id === 'kastenfenster') { setUfWert(1.4); setRahmenBreiteMm(140); setUgWert(1.1); }
                      setActiveTab('kalkulator');
                    }}
                    className="text-shiraz font-bold flex items-center gap-1 hover:underline"
                  >
                    Geometrie simulieren <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Rahmenmaterialien im Lebenszyklusvergleich */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
            <h3 className="text-base font-bold text-text-main flex items-center gap-2 mb-3">
              <Compass className="text-shiraz" size={18} />
              Ökologische &amp; Technische Lebenszyklusbetrachtung der Rahmenwerkstoffe
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              <div className="bg-off-white p-4 rounded-xl border border-home-grau/25">
                <h4 className="font-bold text-slate-900 mb-1">Kunststoff (PVC-U)</h4>
                <p className="text-text-main/80 text-[11px] leading-relaxed">
                  Geringste Anschaffungskosten, Lebensdauer ~30 Jahre. Rezyklatanteil in Kernprofilen bis zu 60 %. 
                  Aufgrund von Stabilisatoren (Calcium/Zink statt Blei) voll recyclingfähig im Rewindo-System.
                </p>
              </div>

              <div className="bg-off-white p-4 rounded-xl border border-home-grau/25">
                <h4 className="font-bold text-slate-900 mb-1">Holz (Kiefer / Eiche)</h4>
                <p className="text-text-main/80 text-[11px] leading-relaxed">
                  Beste CO₂-Bilanz aller Werkstoffe (-15 bis -30 kg CO₂-Äq pro Fenster). 
                  Erfordert jedoch regelmäßige Anstriche alle 5–8 Jahre, um Pilzbefall und Verzug vorzubeugen.
                </p>
              </div>

              <div className="bg-off-white p-4 rounded-xl border border-home-grau/25">
                <h4 className="font-bold text-slate-900 mb-1">Holz-Aluminium</h4>
                <p className="text-text-main/80 text-[11px] leading-relaxed">
                  Höchste Lebensdauer (&gt; 45 Jahre) ohne Sanierungsanstriche. Trotz höherer Grauer Energie der Aluschale 
                  durch die lange Lebensdauer im Gebäude-LCA überaus positiv bewertet.
                </p>
              </div>

              <div className="bg-off-white p-4 rounded-xl border border-home-grau/25">
                <h4 className="font-bold text-slate-900 mb-1">Aluminium</h4>
                <p className="text-text-main/80 text-[11px] leading-relaxed">
                  Hohe Primärenergie bei Neualuminium (~14 kWh/kg). Rezyklat-Aluminium (Hydro CIRCAL mit ≥ 75 % Post-Consumer-Schrott) 
                  senkt den Carbon Footprint um über 80 % auf unter 2,3 kg CO₂/kg Alu.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: INTERAKTIVER UW-RECHNER */}
      {activeTab === 'kalkulator' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
            <h3 className="text-base font-bold text-text-main flex items-center gap-2 mb-2">
              <Calculator className="text-shiraz" size={20} />
              Interaktiver Fenster-Uw-Rechner nach DIN EN ISO 10077-1
            </h3>
            <p className="text-xs text-home-grau mb-6">
              Berechnung des exakten Gesamtwärmedurchgangskoeffizienten <InlineMath math="U_w" /> und der solaren Wärmegewinne 
              in Abhängigkeit von Geometrie, Rahmenbautiefe, Verglasungsart und Glasrandverbund.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Steuerung / Slider */}
              <div className="lg:col-span-2 space-y-5 bg-off-white p-6 rounded-2xl border border-home-grau/30">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Fensterbreite */}
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span>Fensterbreite (B):</span>
                      <span className="font-mono text-shiraz">{formatDeZahl(fensterBreite, 2)} m</span>
                    </div>
                    <input 
                      type="range"
                      min={0.60}
                      max={3.00}
                      step={0.05}
                      value={fensterBreite}
                      onChange={(e) => setFensterBreite(parseFloat(e.target.value))}
                      className="w-full accent-shiraz cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-home-grau">
                      <span>0,60 m</span>
                      <span>1,23 m (DIN-Standard)</span>
                      <span>3,00 m</span>
                    </div>
                  </div>

                  {/* Fensterhöhe */}
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span>Fensterhöhe (H):</span>
                      <span className="font-mono text-shiraz">{formatDeZahl(fensterHoehe, 2)} m</span>
                    </div>
                    <input 
                      type="range"
                      min={0.60}
                      max={3.00}
                      step={0.05}
                      value={fensterHoehe}
                      onChange={(e) => setFensterHoehe(parseFloat(e.target.value))}
                      className="w-full accent-shiraz cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-home-grau">
                      <span>0,60 m</span>
                      <span>1,48 m (DIN-Standard)</span>
                      <span>3,00 m</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-home-grau/20">
                  {/* Rahmenansichtsbreite */}
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span>Rahmenbreite (b_f):</span>
                      <span className="font-mono text-shiraz">{formatDeWert(rahmenBreiteMm)} mm</span>
                    </div>
                    <input 
                      type="range"
                      min={60}
                      max={160}
                      step={5}
                      value={rahmenBreiteMm}
                      onChange={(e) => setRahmenBreiteMm(parseInt(e.target.value))}
                      className="w-full accent-shiraz cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-home-grau">
                      <span>60 mm (Schlank)</span>
                      <span>110 mm (Standard)</span>
                      <span>160 mm</span>
                    </div>
                  </div>

                  {/* Rahmen-Uf */}
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span>Rahmen Uf-Wert:</span>
                      <span className="font-mono text-shiraz">{formatDeZahl(ufWert, 2)} W/(m²K)</span>
                    </div>
                    <input 
                      type="range"
                      min={0.70}
                      max={2.00}
                      step={0.05}
                      value={ufWert}
                      onChange={(e) => setUfWert(parseFloat(e.target.value))}
                      className="w-full accent-shiraz cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-home-grau">
                      <span>0,70 (Passivhaus)</span>
                      <span>1,10 (PVC)</span>
                      <span>2,00 (Alt-Holz)</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-home-grau/20">
                  {/* Glas-Ug */}
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span>Glas Ug-Wert:</span>
                      <span className="font-mono text-shiraz">{formatDeZahl(ugWert, 2)} W/(m²K)</span>
                    </div>
                    <input 
                      type="range"
                      min={0.40}
                      max={3.00}
                      step={0.05}
                      value={ugWert}
                      onChange={(e) => setUgWert(parseFloat(e.target.value))}
                      className="w-full accent-shiraz cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-home-grau">
                      <span>0,50 (3-IV Krypton)</span>
                      <span>0,60 (3-IV Argon)</span>
                      <span>1,10 (2-IV)</span>
                    </div>
                  </div>

                  {/* Abstandhalter / Warme Kante */}
                  <div>
                    <label className="text-xs font-bold block mb-1">Glasrandverbund (Abstandhalter):</label>
                    <select aria-label="Glasrandverbund (Abstandhalter)"
                      value={abstandhalterTyp}
                      onChange={(e) => setAbstandhalterTyp(e.target.value as any)}
                      className="w-full p-2 bg-white border border-home-grau/30 rounded-xl text-xs font-medium focus:ring-1 focus:ring-shiraz outline-none"
                    >
                      <option value="warm_edge_kunststoff">Warme Kante Kunststoff (Ψ = 0,038 W/mK)</option>
                      <option value="edelstahl">Edelstahl-Abstandhalter (Ψ = 0,060 W/mK)</option>
                      <option value="alu">Standard Aluminium (Ψ = 0,080 W/mK - Veraltet)</option>
                    </select>
                  </div>
                </div>

                {/* Solarstrahlung & g-Wert */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-home-grau/20">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span>Gesamtenergiedurchlass (g-Wert):</span>
                      <span className="font-mono text-shiraz">{formatDeZahl((gWert * 100), 0)} % ({formatDeZahl(gWert, 2)})</span>
                    </div>
                    <input 
                      type="range"
                      min={0.20}
                      max={0.80}
                      step={0.02}
                      value={gWert}
                      onChange={(e) => setGWert(parseFloat(e.target.value))}
                      className="w-full accent-shiraz cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-home-grau">
                      <span>0,25 (Sonnenschutz)</span>
                      <span>0,53 (3-IV Standard)</span>
                      <span>0,65 (2-IV)</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span>Sonneneinstrahlung auf Fassade:</span>
                      <span className="font-mono text-shiraz">{formatDeWert(sonneneinstrahlung)} W/m²</span>
                    </div>
                    <input 
                      type="range"
                      min={100}
                      max={900}
                      step={50}
                      value={sonneneinstrahlung}
                      onChange={(e) => setSonneneinstrahlung(parseInt(e.target.value))}
                      className="w-full accent-shiraz cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-home-grau">
                      <span>150 (Bewölkt)</span>
                      <span>450 (Frühjahr/Herbst)</span>
                      <span>850 (Hochsommer)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ergebnis-Panel */}
              <div className="bg-white p-6 rounded-2xl border-2 border-shiraz shadow-md flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-home-grau/20 pb-3 mb-4">
                    <span className="text-xs uppercase tracking-wider font-bold text-home-grau">Ergebnis nach DIN EN ISO 10077-1</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      calcResults.passivhausStandard 
                        ? 'bg-slate-800 text-white' 
                        : calcResults.gegKonform 
                          ? 'bg-slate-600 text-white' 
                          : 'bg-shiraz text-white'
                    }`}>
                      {calcResults.passivhausStandard ? 'Passivhaus-Tauglich' : calcResults.gegKonform ? 'GModG-Konform' : 'Nicht zulässig (GModG)'}
                    </span>
                  </div>

                  <div className="text-center my-3">
                    <span className="text-xs text-home-grau font-semibold block">Gesamter Wärmedurchgangskoeffizient</span>
                    <div className="text-4xl font-extrabold text-shiraz font-mono mt-1">
                      {formatDeZahl(calcResults.uw, 2)}
                      <span className="text-base font-normal text-text-main ml-1">W/(m²K)</span>
                    </div>
                  </div>

                  {/* Aufschlüsselung der Wärmeströme */}
                  <div className="mt-4 pt-4 border-t border-home-grau/20 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-text-main/70">Gesamtfensterfläche (A_w):</span>
                      <span className="font-mono font-bold text-slate-800">{formatDeZahl(calcResults.Af_total, 2)} m²</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-main/70">Sichtbare Glasfläche (A_g):</span>
                      <span className="font-mono font-bold text-slate-800">{formatDeZahl(calcResults.Ag, 2)} m² ({formatDeZahl((calcResults.Ag / calcResults.Af_total * 100), 0)} %)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-main/70">Rahmenfläche (A_f):</span>
                      <span className="font-mono font-bold text-slate-800">{formatDeZahl(calcResults.Af, 2)} m²</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-main/70">Glasumfang (l_g):</span>
                      <span className="font-mono font-bold text-slate-800">{formatDeZahl(calcResults.Lg, 2)} m</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-home-grau/20 space-y-1.5 text-[11px] bg-off-white p-3 rounded-xl border border-home-grau/25">
                    <div className="font-bold text-slate-900 mb-1">Anteilige Wärmeverluste (bei ΔT = 1 K):</div>
                    <div className="flex justify-between">
                      <span>Glasverlust (A_g · U_g):</span>
                      <span className="font-mono font-semibold">{formatDeZahl(calcResults.waermestromGlas, 2)} W/K ({formatDeZahl((calcResults.waermestromGlas / (calcResults.uw * calcResults.Af_total) * 100), 0)} %)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rahmenverlust (A_f · U_f):</span>
                      <span className="font-mono font-semibold">{formatDeZahl(calcResults.waermestromRahmen, 2)} W/K ({formatDeZahl((calcResults.waermestromRahmen / (calcResults.uw * calcResults.Af_total) * 100), 0)} %)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Kantenverlust (l_g · Ψ_g):</span>
                      <span className="font-mono font-semibold">{formatDeZahl(calcResults.waermestromKante, 2)} W/K ({formatDeZahl((calcResults.waermestromKante / (calcResults.uw * calcResults.Af_total) * 100), 0)} %)</span>
                    </div>
                  </div>

                  {/* Solare Gewinne */}
                  <div className="mt-4 p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs">
                    <div className="flex items-center justify-between text-amber-900 font-bold mb-0.5">
                      <span>Solare Wärmezufuhr:</span>
                      <span className="font-mono">{formatDeZahl(calcResults.solareGewinneWatt, 0)} Watt</span>
                    </div>
                    <p className="text-[10px] text-amber-800">
                      Passive Erwärmung durch Sonneneinstrahlung bei {formatDeWert(sonneneinstrahlung)} W/m² (Winter-Heizunterstützung vs. Sommer-Kühllast).
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-home-grau/20 text-[10px] text-home-grau text-center">
                  Berechnungsgrundlage: DIN EN ISO 10077-1:2020-10
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: NORMEN & PRÜFVERFAHREN */}
      {activeTab === 'normen' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
            <h3 className="text-base font-bold text-text-main flex items-center gap-2 mb-4">
              <FileText className="text-shiraz" size={18} />
              Relevante Normen &amp; Prüfungen für Glas und Fenster
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/25">
                <h4 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-1.5">
                  <ShieldCheck size={16} className="text-shiraz" />
                  1. Bemessung im Bauwesen: DIN 18008 Reihe
                </h4>
                <ul className="text-xs text-text-main/80 space-y-2 leading-relaxed">
                  <li><strong>DIN 18008-1:</strong> Begriffe, allgemeine Grundlagen und Teilsicherheitskonzept nach Eurocode.</li>
                  <li><strong>DIN 18008-2:</strong> Linienförmig gelagerte Verglasungen (Standardfenster, Fassadenriegel).</li>
                  <li><strong>DIN 18008-3:</strong> Punktförmig gelagerte Verglasungen (Punkthalter, Glasklammern).</li>
                  <li><strong>DIN 18008-4:</strong> Zusatzanforderungen an absturzsichernde Verglasungen (Pendelschlagversuch mit Doppelreifen nach DIN EN 12600).</li>
                  <li><strong>DIN 18008-5:</strong> Begehbare Verglasungen (Treppenstufen, Glasböden; mind. 3 Scheiben VSG).</li>
                </ul>
              </div>

              <div className="bg-off-white p-5 rounded-xl border border-home-grau/25">
                <h4 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-shiraz" />
                  2. Produktnormen &amp; CE-Kennzeichnung
                </h4>
                <ul className="text-xs text-text-main/80 space-y-2 leading-relaxed">
                  <li><strong>DIN EN 14351-1:</strong> Fenster und Außentüren – Produktnorm, Leistungseigenschaften (CE-Kennzeichnung, Windlast, Schlagregen).</li>
                  <li><strong>DIN EN 1279 (Teile 1–6):</strong> Glas im Bauwesen – Mehrscheiben-Isolierglas (Feuchteaufnahme, Gasaustrittsrate, Alterungsbeständigkeit).</li>
                  <li><strong>DIN EN 12150:</strong> Thermisch vorgespanntes Kalknatron-Einscheibensicherheitsglas (ESG).</li>
                  <li><strong>DIN EN ISO 12543:</strong> Verbundglas und Verbund-Sicherheitsglas (VSG).</li>
                  <li><strong>DIN EN ISO 10077:</strong> Wärmetechnisches Verhalten von Fenstern, Türen und Abschlüssen (Berechnung von Uw und Uf).</li>
                </ul>
              </div>
            </div>

            {/* Prüfmethoden Prüfstand */}
            <div className="mt-6 bg-off-white p-5 rounded-xl border border-home-grau/25">
              <h4 className="font-bold text-slate-900 text-sm mb-3">
                Zertifizierungs-Prüfungen am Fensterprüfstand (ift Rosenheim / Prüfinstitute)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="bg-white p-3.5 rounded-lg border border-home-grau/20">
                  <span className="font-bold text-slate-800 block mb-1">1. Luftdurchlässigkeit (DIN EN 1026)</span>
                  <p className="text-[11px] text-text-main/75">
                    Druckstufen bis 600 Pa. Klasse 4 ist Standard für Neubauten (höchste Dichtheit gegen Zugluft).
                  </p>
                </div>
                <div className="bg-white p-3.5 rounded-lg border border-home-grau/20">
                  <span className="font-bold text-slate-800 block mb-1">2. Schlagregendichtheit (DIN EN 1027)</span>
                  <p className="text-[11px] text-text-main/75">
                    Berieselung mit Wasser bei pulsierendem Überdruck. Klasse 9A / E900 garantiert Dichtheit bei Orkanregen.
                  </p>
                </div>
                <div className="bg-white p-3.5 rounded-lg border border-home-grau/20">
                  <span className="font-bold text-slate-800 block mb-1">3. Einbruchhemmung (DIN EN 1627)</span>
                  <p className="text-[11px] text-text-main/75">
                    Widerstandsklassen RC 1 N bis RC 4. Prüfung statisch, dynamisch (Pendel) und manueller Werkzeugangriff (Kuhfuß).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Standardisierter Footer */}
      <ModuleFooter
        wikipedia={[
          { title: 'Flachglas', url: 'https://de.wikipedia.org/wiki/Flachglas' },
          { title: 'Mehrscheiben-Isolierglas', url: 'https://de.wikipedia.org/wiki/Mehrscheiben-Isolierglas' },
          { title: 'Sicherheitsglas', url: 'https://de.wikipedia.org/wiki/Sicherheitsglas' },
          { title: 'Fenster', url: 'https://de.wikipedia.org/wiki/Fenster' }
        ]}
        regelwerke={[
          { title: 'DIN EN 14351-1: Fenster und Außentüren – Produktnorm, Leistungseigenschaften' },
          { title: 'DIN EN 1279-1 bis 6: Glas im Bauwesen – Mehrscheiben-Isolierglas' },
          { title: 'DIN 18008-1 bis 5: Glas im Bauwesen – Bemessungs- und Konstruktionsregeln' },
          { title: 'DIN EN ISO 10077-1: Wärmetechnisches Verhalten von Fenstern, Türen und Abschlüssen – Berechnung des Wärmedurchgangskoeffizienten' },
          { title: 'Gebäudemodernisierungsgesetz (GModG, in Kraft seit 29.07.2026, vormals GEG): Anforderungen an den sommerlichen und winterlichen Wärmeschutz von Fenstern', url: 'https://www.gesetze-im-internet.de/geg/' }
        ]}
        literatur={[
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011',
          'Feldmann, M.; Kasper, R.: Glasbau im Praxistest und nach DIN 18008 (Ernst & Sohn, Berlin)',
          'Wurm, J.: Glass Structures – Design and Construction of Self-Supporting Skins (Birkhäuser)',
          'ift Rosenheim: Richtlinien und Fachinformationen zur Fenster- und Fassadentechnik'
        ]}
        weblinks={[
          { title: 'Bundesverband Flachglas (BF) – Technische Richtlinien', url: 'https://www.bundesverband-flachglas.de/' },
          { title: 'ift Rosenheim – Institut für Fenstertechnik', url: 'https://www.ift-rosenheim.de/' },
          { title: 'Verband Fenster + Fassade (VFF)', url: 'https://www.window.de/' }
        ]}
        formeln={[
          {
            formel: 'U_w = \\frac{A_g \\cdot U_g + A_f \\cdot U_f + l_g \\cdot \\Psi_g}{A_g + A_f}',
            erklaerung: 'Berechnung des gesamten Wärmedurchgangskoeffizienten U_w eines Fensters nach DIN EN ISO 10077-1: Zusammensetzung aus Glasfläche A_g mit U_g, Rahmenfläche A_f mit U_f und dem linearen Wärmedurchgangskoeffizienten des Glasrandes Ψ_g über den Umfang l_g.',
            quelle: 'DIN EN ISO 10077-1'
          },
          {
            formel: 'S = \\frac{\\tau_v}{g}',
            erklaerung: 'Selektivitätskennzahl S von Sonnenschutzverglasungen: Verhältnis von Lichttransmission τ_v zum Gesamtenergiedurchlassgrad g. Hochselektive Gläser erreichen Werte von S ≈ 1,8 bis 2,0 (viel Licht bei wenig Wärme).',
            quelle: 'DIN EN 410'
          },
          {
            formel: '\\sigma_{\\text{max}} = \\frac{3 \\cdot F \\cdot L}{2 \\cdot b \\cdot h^2} \\le f_{g,d} = \\frac{k_{\\text{mod}} \\cdot f_{g,k}}{\\gamma_M}',
            erklaerung: 'Nachweis der Biegezugspannung im Glas nach DIN 18008 mit charakteristischer Festigkeit f_{g,k} (Float: 45 N/mm², TVG: 70 N/mm², ESG: 120 N/mm²), Modifikationsbeiwert k_{mod} für Lasteinwirkungsdauer und Teilsicherheitsbeiwert γ_M.',
            quelle: 'DIN 18008-1'
          }
        ]}
      />
    </div>
  );
}
