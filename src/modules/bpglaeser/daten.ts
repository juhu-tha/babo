// Types and Interfaces
export interface GlassProduct {
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

export interface WindowType {
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

export const GLASS_PRODUCTS: GlassProduct[] = [
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
      'Nach dem Vorspannen nicht schneid-, bohr- oder schleifbar (die Scheibe zerspringt)',
      'Als Einfachscheibe keine Resttragfähigkeit nach dem Bruch',
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
      'Grobscholliges Bruchbild mit Verkeilung: im VSG-Verbund gute Resttragfähigkeit'
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
      'Erfüllt die energetischen Anforderungen (GModG, vormals GEG) an Fenster oft nur knapp',
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
      'Sehr guter Wärmeschutz: Halbiert Wärmeverluste gegenüber 2-fach Glas!',
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
      'Gute Schalldämmung bezogen auf die geringe Dicke'
    ],
    cons: [
      'Noch hohe Herstellkosten und begrenzte Lieferkapazitäten',
      'Mikro-Stützkörper aus nächster Nähe bei direktem Streiflicht sichtbar',
      'Sehr strenge Maßtoleranzen bei der Bestellung (kein Nachschneiden möglich)'
    ],
    normen: ['ISO 19916-1', 'abZ / aBG des DIBt']
  }
];

export const WINDOW_TYPES: WindowType[] = [
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
      'Pflegeleicht und witterungsbeständig (kein Anstrich nötig)',
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
      'Nachwachsender Rohstoff, speichert biogenen Kohlenstoff',
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
      'Wartungsarm an der bewitterten Außenseite',
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
      'Hohe Steifigkeit für raumhohe Schiebeelemente und Vorhangfassaden',
      'Korrosionsbeständig und formstabil (kein Verziehen bei Feuchte)',
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
      'Gut denkmalverträglich (historische Profilansichten bleiben erhalten)',
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
