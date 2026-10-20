// diagnoseData.ts
// Fachspezifische Datenbasis für Bauwerksdiagnostik:
// 1. Notwendige Anzahl Prüfungen / Prüfpunkte & Entnahmestellen (Normative Stichprobenregeln)
// 2. Proben- und Prüfstellenkonditionierung (Vorbereitung, Vorlagerung & Fehlervermeidung)
// 3. Relevante Normen und Regelwerke (mit Monats-/Jahresausgaben und DIN Media Verweisen)
// 4. Interpretation und bautechnische Anwendung der Ergebnisse (Ingenieurpraxis, Statik & Instandsetzung)

export interface StandardReference {
  code: string;
  title: string;
  date: string;
  url: string;
  scope: string;
}

export interface ThresholdItem {
  parameter: string;
  wert: string;
  einheit: string;
  status: 'ok' | 'warn' | 'crit';
  bewertung: string;
  massnahme: string;
}

export interface MethodDiagnoseInfo {
  id: string;
  samplingPoints: {
    titel: string;
    normVorgabe: string;
    mindestAnzahl: string;
    rasterMass: string;
    auswahlKriterien: string[];
    statistischeBegruendung: string;
  };
  conditioning: {
    titel: string;
    oberflaeche: string;
    klimaUndFeuchte: string;
    vorbereitungLabor: string;
    kritischeFehlerVermeidung: string[];
  };
  standards: StandardReference[];
  interpretation: {
    titel: string;
    kerndiagnose: string;
    grenzwerte: ThresholdItem[];
    tragwerksAuswirkung: string;
    instandsetzungsKonsequenz: string;
    praxisFallbeispiel: string;
  };
}

export const METHOD_DIAGNOSE_DETAILS: Record<string, MethodDiagnoseInfo> = {
  // 1. BOHRWIDERSTAND (HOLZ)
  bohrwiderstand: {
    id: 'bohrwiderstand',
    samplingPoints: {
      titel: 'Bohrwiderstandsmessung (Holzresistographie)',
      normVorgabe: 'Verfahren nicht genormt; Bewertung nach DIN 68800-2/-4 und Herstellerangaben',
      mindestAnzahl: 'Mind. 2–3 Bohrungen je verdächtigem Balkenkopf / Auflagerknoten; 100 % aller Träger im Spritz- und Nassbereich.',
      rasterMass: 'Bohrungsabstand mind. 30–50 mm axial versetzt; Einstichwinkel 90° zur Faserachse (radial/tangential).',
      auswahlKriterien: [
        'Auflagerbereiche in Außenwänden (Taupunktunterschreitung und Kondensatausfall).',
        'Nasszellenunterzüge, Küchen- und Sanitärbereiche.',
        'Sichtbare Feuchteflecken, Pilzfruchtkörper oder Insektenausfluglöcher.',
        'Bereiche maximaler Querkraft- und Biegemomentenbeanspruchung.'
      ],
      statistischeBegruendung: 'Holz ist ein inhomogener, anisotroper Baustoff. Einzelbohrungen können Fehlstellen knapp verfehlen oder lokale Astbereiche treffen. Erst 2–3 versetzte Profile sichern den intakten Restquerschnitt statistisch ab.'
    },
    conditioning: {
      titel: 'Proben- und Prüfstellenkonditionierung Holz',
      oberflaeche: 'Entfernen von losem Putz, Farbanstrichen oder Verkleidungen; plane Auflagefläche für das Führungsgehäuse des Resistographen sicherstellen.',
      klimaUndFeuchte: 'Holzfeuchte u vorab mittels Widerstandsfeuchtemessgerät (DIN EN 13183-2) erfassen. Bei erhöhter Holzfeuchte sinkt der Bohrwiderstand; Profile nur bei vergleichbarer Feuchte vergleichen.',
      vorbereitungLabor: 'Nicht erforderlich (Vor-Ort-Direktverfahren). Bei Pilzverdacht Holzspan-Sicherung in sterilem Gefäß für mykologische Laboranalyse.',
      kritischeFehlerVermeidung: [
        'Bohrung nicht durch Astknoten führen (führt zu scheinbar überhöhten Festigkeiten).',
        'Nadelbiegung bei stark verhärtetem Spätholz vermeiden (Nadel regelmäßig auf Geradheit kalibrieren).',
        'Nadelverschleiß kontrollieren (stumpfe Nadelspitze erhöht den Reibungswiderstand f_friction künstlich).'
      ]
    },
    standards: [
      {
        code: 'DIN 68800-4:2020-12',
        title: 'Holzschutz – Bekämpfende Maßnahmen (Bohrwiderstandsmessung selbst ist nicht genormt)',
        date: '2020-12',
        url: 'https://www.dinmedia.de/de/suche?q=DIN+68800-4',
        scope: 'Bewertung und Bekämpfung von Pilz- und Insektenbefall; Gerätehinweise des Herstellers beachten.'
      },
      {
        code: 'DIN EN 338:2016-07',
        title: 'Bauholz für tragende Zwecke – Festigkeitsklassen',
        date: '2016-07',
        url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+338',
        scope: 'Zuordnung von Rohdichte, Biegefestigkeit und E-Modul zu Festigkeitsklassen C24, D30 etc.'
      },
      {
        code: 'DIN 68800-4:2020-12',
        title: 'Holzschutz – Teil 4: Bekämpfende Maßnahmen gegen holzzerstörende Pilze und Insekten',
        date: '2020-12',
        url: 'https://www.dinmedia.de/de/suche?q=DIN+68800-4',
        scope: 'Regelwerk für Schadensbegrenzung und chemische/konstruktive Sanierung.'
      }
    ],
    interpretation: {
      titel: 'Interpretation & Statische Resttragfähigkeitsberechnung',
      kerndiagnose: 'Auswertung des Drehmomentprofils zur Bestimmung des gesunden Restquerschnitts b_eff × h_eff unter Abzug von Randfäule, Insektenfraß und Kernmürbe.',
      grenzwerte: [
        { parameter: 'Restquerschnitt A_eff / A_0', wert: '> 85 %', einheit: '%', status: 'ok', bewertung: 'Voll tragfähig', massnahme: 'Keine statische Verstärkung; Feuchteursache beseitigen.' },
        { parameter: 'Restquerschnitt A_eff / A_0', wert: '65–85 %', einheit: '%', status: 'warn', bewertung: 'Tragfähigkeit eingeschränkt', massnahme: 'Statische Nachrechnung; ggf. seitliche Laschenverstärkung oder Stützenunterstellung.' },
        { parameter: 'Restquerschnitt A_eff / A_0', wert: '< 65 %', einheit: '%', status: 'crit', bewertung: 'Orientierung: erheblicher Querschnittsverlust – statischer Nachweis erforderlich', massnahme: 'Ggf. Notabstützung; Rückschnitt und Sanierung nach DIN 68800-4 (bei Echtem Hausschwamm deutlich über den sichtbaren Befall hinaus), Prothesen/Balkenschuhe.' }
      ],
      tragwerksAuswirkung: 'Das Widerstandsmoment W = b·h²/6 sinkt mit dem Quadrat der Höhe, die Biegesteifigkeit (I = b·h³/12) mit der dritten Potenz. 20 % Höhenverlust → W auf 64 % (−36 %), I auf 51 %. Schwellen A_eff/A_0 nur als Orientierung, statischer Nachweis erforderlich.',
      instandsetzungsKonsequenz: 'Konstruktiver Holzschutz nach DIN 68800: Hinterlüftung des Auflagers (mind. 20 mm Luftspalt), Bitumen-Dachpappe als kapillare Trennschicht zum Mauerwerk, thermische Dämmung der Außenwandnische zur Taupunktverlagerung.',
      praxisFallbeispiel: 'Historische Holzbalkendecke (BJ 1905): Sichtbare Risse am Auflager. Bohrwiderstandsprofil zeigt ab 35 mm Tiefe einen Abfall des Widerstands auf 5 % über eine Länge von 120 mm (Verdacht auf Pilzbefall; Art – z. B. Echter Hausschwamm – nur durch mykologische Laboranalyse einer Probe bestimmbar). Konsequenz: Austausch der Balkenköpfe; bei bestätigtem Echtem Hausschwamm Sanierung nach DIN 68800-4 einschließlich Mauerwerksbehandlung.'
    }
  },

  // 2. COVERMETER (BETONDECKUNG)
  covermeter: {
    id: 'covermeter',
    samplingPoints: {
      titel: 'Elektromagnetische Betondeckungsmessung (Covermeter)',
      normVorgabe: 'DIN EN 1992-1-1 (EC 2), DIN 1045-2, DBV-Merkblatt „Betondeckung und Bewehrung“ (2015)',
      mindestAnzahl: 'Mind. 20–30 Messwerte je homogenem Prüffeld (mind. 1 Prüffeld je 25–50 m² Bauteiloberfläche bzw. Bauteiltyp).',
      rasterMass: 'Flächenraster 10 × 10 cm bis 25 × 25 cm; linienhafte Profile im Abstand von 20 cm quer zur Hauptbewehrung.',
      auswahlKriterien: [
        'Bauteile mit hoher Umweltbeanspruchung (XD3, XS3, XC4).',
        'Stützenkanten, Balkenunterseiten und auskragende Bauteile (Balkone).',
        'Zonen mit sichtbaren Rostfahnen oder beginnenden Längsrissen.',
        'Bereiche, in denen Schalungstoleranzen vermutet werden.'
      ],
      statistischeBegruendung: 'Das 5%-Quantil der Betondeckung c_min,act ist die maßgebliche Kenngröße für Dauerhaftigkeit und Brandschutz. Weniger als 20 Messwerte führen zu unzulässig hohen statistischen Sicherheitsabschlägen nach DBV.'
    },
    conditioning: {
      titel: 'Prüfstellenkonditionierung & Störquellenelimination',
      oberflaeche: 'Trockene, saubere Betonoberfläche; Entfernen von Gerüstteilen, metallischen Ankern oder Drähten in einem Umkreis von mind. 50 cm.',
      klimaUndFeuchte: 'Oberflächentrocken; keine Wasserfilme (können kapazitive Sensoren stören).',
      vorbereitungLabor: 'Nicht erforderlich (In-situ-ZfP). Vorab Nullpunkt-Kalibrierung des Messgeräts an metallfreier Referenzplatte.',
      kritischeFehlerVermeidung: [
        'Magnetit- oder eisenschlackehaltige Gesteinskörnungen führen zu Scheindeckungen (vorab Kalibrierung am Bohrkernbruch vornehmen).',
        'Mehrlagige Bewehrung oder enge Bügelabstände (< 50 mm) erzeugen Signalüberlagerungen; orthogonale Scans und B-Scan-Funktion nutzen.',
        'Stabdurchmesser d_s muss bekannt sein oder an Kontrollstelle kalibriert werden, da Deckungswert vom Durchmesser abhängt.'
      ]
    },
    standards: [
      {
        code: 'DIN EN 1992-1-1:2011-01',
        title: 'Eurocode 2: Bemessung und Konstruktion von Stahlbeton- und Spannbetontragwerken',
        date: '2011-01',
        url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+1992-1-1',
        scope: 'Definition von c_min und Vorhaltemaß Delta c_dev für alle Expositionsklassen.'
      },
      {
        code: 'DBV-Merkblatt Betondeckung',
        title: 'Betondeckung und Bewehrung (Deutscher Beton- und Bautechnik-Verein)',
        date: '2015-12',
        url: 'https://www.betonverein.de/',
        scope: 'Verbindliche Vorgaben zur statistischen Auswertung von Covermeter-Messungen im Bestand.'
      },
      {
        code: 'DGZfP-Merkblatt B 02',
        title: 'Zerstörungsfreie Ortung von Bewehrung und Bestimmung der Betondeckung',
        date: '2014-06',
        url: 'https://www.dgzfp.de/',
        scope: 'Praxisleitfaden für elektromagnetische und induktive Prüfsysteme.'
      }
    ],
    interpretation: {
      titel: 'Statistische Auswertung (5 %-Quantil) & Dauerhaftigkeitsnachweis',
      kerndiagnose: 'Vergleich des 5 %-Quantils der gemessenen Betondeckung c_act,0.05 mit der normativ geforderten Mindestbetondeckung c_min sowie der Karbonatisierungstiefe d_k.',
      grenzwerte: [
        { parameter: 'c_act,0.05 vs. c_min', wert: 'c_act ≥ c_min + 10 mm', einheit: 'mm', status: 'ok', bewertung: 'Vollständiger Korrosionsschutz', massnahme: 'Standard-Wartung, keine Sondermaßnahmen.' },
        { parameter: 'c_act,0.05 vs. c_min', wert: 'c_min ≤ c_act < c_min + 10 mm', einheit: 'mm', status: 'warn', bewertung: 'Vorhaltemaß unterschritten', massnahme: 'Engmaschige Überwachung; hydrophobierende Imprägnierung oder OS 2 Beschichtung erwägen.' },
        { parameter: 'c_act,0.05 vs. c_min', wert: 'c_act < c_min bzw. c_act ≤ d_k', einheit: 'mm', status: 'crit', bewertung: 'Depassivierungsgefahr / Brandschutzmangel', massnahme: 'Aufbringen von zusätzlichem Betonersatzmörtel (PCC) oder carbonatisierungsbremsendem Oberflächenschutzsystem OS 4 / OS 5a.' }
      ],
      tragwerksAuswirkung: 'Geringe Betondeckung führt bei Brandbeanspruchung nach DIN EN 1992-1-2 zu vorzeitigem Erreichen der kritischen Stahltemperatur (500 °C) und damit zum Verlust der Tragfähigkeit. Bei Korrosion droht Abplatzen der Betondeckung und Verbundbruch.',
      instandsetzungsKonsequenz: 'DIBt TR Instandhaltung: Fehlende Betondeckung kann rechnerisch durch diffusionsoffene, rissüberbrückende Beschichtungen mit äquivalenter Luftschichtdicke s_d,CO2 > 50 m kompensiert werden.',
      praxisFallbeispiel: 'Parkhaus-Stützen (BJ 1982): Soll-Deckung 35 mm. Covermeter-Rasterscan (60 Punkte) liefert c_act,0.05 = 14 mm. Karbonatisierungstiefe d_k = 12 mm. Restpassivierungsreserve nur 2 mm! Maßnahme: Sofortige Reprofilierung mit SPCC-Mörtel und OS 4 Beschichtung zur Verhinderung flächiger Bewehrungskorrosion.'
    }
  },

  // 3. SCHMIDT-HAMMER (RÜCKPRALLHAMMER)
  schmidthammer: {
    id: 'schmidthammer',
    samplingPoints: {
      titel: 'Rückprallhammer-Prüfung nach Schmidt (DIN EN 12504-2)',
      normVorgabe: 'DIN EN 12504-2, DIN EN 13791 (Verfahren mit indirekten Prüfverfahren)',
      mindestAnzahl: 'Mind. 9–10 Rückprallwerte je Prüfstelle; mind. 9–18 Prüfstellen je Prüfbereich zur Kalibrierung mit Bohrkernen.',
      rasterMass: 'Prüfstellenabstand mind. 25 mm zwischen zwei Einschlägen; Prüffläche ca. 300 × 300 mm.',
      auswahlKriterien: [
        'Homogene Bauteilabschnitte desselben Betonierabschnitts.',
        'Prüfstellen nicht näher als 50 mm von Kanten oder Fugen entfernt.',
        'Freie Zonen ohne Hohlstellen oder Bewehrung direkt unter der Oberfläche (Covermeter vorab nutzen!).'
      ],
      statistischeBegruendung: 'Der Median oder Mittelwert aus 9–10 Schlägen eliminiert lokale Ausreißer (z.B. Treffer auf großes Zuschlagskorn oder Pore). Kalibrierung an Bohrkernen nach DIN EN 13791 ist zwingend zur Umrechnung in Druckfestigkeit.'
    },
    conditioning: {
      titel: 'Prüfflächenkonditionierung & Stoßwinkel-Korrektur',
      oberflaeche: 'Entfernen der karbonatisierten Zementschlämme mittels Siliziumkarbid-Schleifstein (Schleifstein mit Körnung 60 im Lieferumfang) bis zu einer glatten, dichten Matrix.',
      klimaUndFeuchte: 'Prüffläche muss lufttrocken sein. Nasser Beton liefert bis zu 20 % niedrigere Rückprallwerte R als trockener Beton bei gleicher Festigkeit!',
      vorbereitungLabor: 'Vor und nach jeder Messserie: Kalibrierung des Hammers auf dem genormten Amboss (Härte ≥ 52 HRC; Sollwert R = 80 ± 2).',
      kritischeFehlerVermeidung: [
        'Karbonatisierte Oberflächen nicht ungeschliffen prüfen (erzeugt bis zu 10–15 Einheiten zu hohe R-Werte = Scheinfestigkeit!).',
        'Stoßrichtung α beachten: Bei Abweichung von horizontaler Schlagrichtung (α = 0°) zwingend Winkelkorrektur Delta R_alpha nach DIN EN 12504-2 anwenden.',
        'Dünne Bauteile (< 100 mm Dicke) federn elastisch nach; Rückprallenergie wird gedämpft (Bauteilschwingung).'
      ]
    },
    standards: [
      {
        code: 'DIN EN 12504-2:2021-08',
        title: 'Prüfung von Beton in Bauwerken – Teil 2: Bestimmung der Rückprallzahl',
        date: '2021-08',
        url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+12504-2',
        scope: 'Prüfvorschrift für Rückprallhämmer vom Typ N (Standard) und Typ L (dünnwandige Elemente).'
      },
      {
        code: 'DIN EN 13791:2020-02',
        title: 'Bewertung der Druckfestigkeit von Beton in Bauwerken oder in Bauwerksteilen',
        date: '2020-02',
        url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+13791',
        scope: 'Normative Umrechnung von Rückprallwerten in charakteristische Druckfestigkeit f_ck,is via Basiskurven.'
      }
    ],
    interpretation: {
      titel: 'Interpretation: Homogenitätsanalyse & Festigkeitsabschätzung',
      kerndiagnose: 'Primär zur Detektion von Schwächezonen, Betontrennstellen und Betonierabschnittsunterschieden. Quantitative Festigkeitsaussage NUR mit Bohrkern-Referenzierung zulässig.',
      grenzwerte: [
        { parameter: 'Rückprallwert R (Typ N, horiz.)', wert: 'R ≥ 40', einheit: '-', status: 'ok', bewertung: 'Sehr hohe Oberflächenhärte (typ. ≥ C30/37)', massnahme: 'Normaler Tragwerksbestandteil.' },
        { parameter: 'Rückprallwert R (Typ N, horiz.)', wert: '28 ≤ R < 40', einheit: '-', status: 'warn', bewertung: 'Mittlere Festigkeit (typ. C16/20 bis C25/30)', massnahme: 'Bohrkern-Kalibrierung zur statischen Einstufung durchführen.' },
        { parameter: 'Rückprallwert R (Typ N, horiz.)', wert: 'R < 28', einheit: '-', status: 'crit', bewertung: 'Geringe Festigkeit oder Gefügestörung (< C12/15)', massnahme: 'Verdacht auf Fehlmischung, Frostschaden oder Auslaugung; Bohrkernentnahme zwingend.' }
      ],
      tragwerksAuswirkung: 'Berechnung des In-situ-Festigkeitsniveaus nach DIN EN 13791 zur Überprüfung der Tragfähigkeitsreserven bei Nutzlaststeigerung oder Umbau.',
      instandsetzungsKonsequenz: 'Dient der räumlichen Eingrenzung mangelhafter Betonierabschnitte, sodass Betonersatzmaßnahmen punktgenau auf geschädigte Zonen beschränkt werden können.',
      praxisFallbeispiel: 'Brückenpfeiler nach Brand: Schmidt-Hammer-Rasterung (120 Stellen) identifiziert einen scharf abgegrenzten Bereich von 4 m² mit R < 22 (Brandzerrüttung bis 6 cm Tiefe). Restlicher Pfeiler weist R = 42 auf. Sanierungsbeschränkung auf lokale Reprofilierung.'
    }
  },

  // 4. ULTRASCHALL (BETON)
  ultraschall: {
    id: 'ultraschall',
    samplingPoints: {
      titel: 'Ultraschall-Impulslaufzeitmessung (DIN EN 12504-4)',
      normVorgabe: 'DIN EN 12504-4, DGZfP-Merkblatt B 04',
      mindestAnzahl: 'Direkte Durchschallung: Mind. 3–5 Messpunkte je Bauteilquerschnitt; Indirekte Durchschallung (Oberfläche): Messlinie mit mind. 5–8 Messabständen.',
      rasterMass: 'Raster 20 × 20 cm bis 50 × 50 cm; Messlinienabstand bei Rissiefenbestimmung 50–100 mm.',
      auswahlKriterien: [
        'Zweiseitig zugängliche Bauteile (Wände, Stützen, Balken) für direkte Durchschallung bevorzugen.',
        'Verdacht auf innere Entmischungen, Hohlräume oder Kiesnester.',
        'Tiefe Risse zur Bestimmung der Rissausbreitungstiefe.',
        'Frost-Tausalz-geschädigte Gefügebereiche.'
      ],
      statistischeBegruendung: 'Die Ultraschallgeschwindigkeit v_L erfasst das gesamte durchstrahlte Volumen. Mehrere Messpunkte sichern die räumliche Tomographie und schließen Messfehler durch Einzelluftporen aus.'
    },
    conditioning: {
      titel: 'Kopplung, Sensoranpressung & Wegmessung',
      oberflaeche: 'Entfernen loser Partikel; ebene Prüffläche; Auftragen eines homogenen Koppelmittels (Akustik-Gel, Vaseline oder Silikonfett) zur lückenlosen akustischen Übertragung.',
      klimaUndFeuchte: 'Feuchtigkeit erhöht die Ultraschallgeschwindigkeit um 2–5 % (Wasser leitet Schall schneller als Luft). Feuchtezustand dokumentieren.',
      vorbereitungLabor: 'Elektronische Nullpunkt-Kalibrierung der Sonden mit dem genormten Kalibrierstab (Referenzlaufzeit typisch t_0 = 25,4 µs).',
      kritischeFehlerVermeidung: [
        'Parallel zur Bewehrung verlaufende Schallwege meiden: Stahl leitet Schall mit ~5.900 m/s (Beton ~4.000 m/s); führt zu massiv überhöhter Schein-Geschwindigkeit!',
        'Unzureichender Anpressdruck erzeugt Phasenverschiebung und Messfehler beim Ersteinsatz des Signals (Triggerpunkt).',
        'Weglänge L muss millimetergenau mit Laserdistanzmesser ermittelt werden, da v_L = L / t direkt von L abhängt.'
      ]
    },
    standards: [
      {
        code: 'DIN EN 12504-4:2021-08',
        title: 'Prüfung von Beton in Bauwerken – Teil 4: Bestimmung der Ultraschallimpulsgeschwindigkeit',
        date: '2021-08',
        url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+12504-4',
        scope: 'Verfahren zur direkten, halb-direkten und indirekten Schalleinspeisung.'
      },
      {
        code: 'DGZfP-Merkblatt B 04',
        title: 'Ultraschallverfahren zur zerstörungsfreien Prüfung im Bauwesen',
        date: '2012-05',
        url: 'https://www.dgzfp.de/',
        scope: 'Richtlinie zur Messung elastischer Kennwerte und Tomographie.'
      }
    ],
    interpretation: {
      titel: 'Interpretation von v_L & Dynamischem E-Modul',
      kerndiagnose: 'Hohe Geschwindigkeiten indizieren ein dichtes, porenarmes Gefüge und hohe Festigkeit. Geschwindigkeitsabfälle zeigen Mikrorissbildung, Entmischung oder Schädigung an.',
      grenzwerte: [
        { parameter: 'Schallgeschwindigkeit v_L', wert: '> 4.200 m/s', einheit: 'm/s', status: 'ok', bewertung: 'Ausgezeichnete Gefügequalität (dicht, hochfest)', massnahme: 'Keine Mängel.' },
        { parameter: 'Schallgeschwindigkeit v_L', wert: '3.500–4.200 m/s', einheit: 'm/s', status: 'ok', bewertung: 'Guter Normalbeton', massnahme: 'Regelkonforme Festigkeit.' },
        { parameter: 'Schallgeschwindigkeit v_L', wert: '3.000–3.500 m/s', einheit: 'm/s', status: 'warn', bewertung: 'Mäßige Qualität / Mikrorisse', massnahme: 'Prüfung auf Frostschäden oder Entmischung; Bohrkernkontrolle.' },
        { parameter: 'Schallgeschwindigkeit v_L', wert: '< 3.000 m/s', einheit: 'm/s', status: 'crit', bewertung: 'Stark zerrüttetes Gefüge / Hohlraum', massnahme: 'Instandsetzungsbedarf; Rissinjektion oder Betonersatz.' }
      ],
      tragwerksAuswirkung: 'Ermittlung des dynamischen Elastizitätsmoduls E_dyn = v_L² · rho · (1+nu)(1-2nu)/(1-nu) zur Modellierung von Schwingungs- und Verformungsverhalten im Tragwerk.',
      instandsetzungsKonsequenz: 'Dient der Erfolgskontrolle bei Rissinjektionen: Vor der Injektion ist die Schallübertragung über den Riss unterbrochen; nach vollständiger Kunstharzverfüllung steigt v_L wieder auf das Niveau des ungerissenen Betons an.',
      praxisFallbeispiel: 'Staumauer mit Frost-Tausalz-Schaden: Ultraschall-Transmissionsmessung zeigt im Kronenbereich Geschwindigkeitsabfall von 4.300 auf 2.800 m/s bis in 25 cm Tiefe. Darunter intakter Kernbeton. Gezielter Teilabtrag der Krone statt Komplettabriss.'
    }
  },

  // 5. POTENTIALFELDMESSUNG
  potentialfeld: {
    id: 'potentialfeld',
    samplingPoints: {
      titel: 'Elektrochemische Potentialfeldmessung (Halbzellenpotential)',
      normVorgabe: 'DGZfP-Merkblatt B 03 (2025), ASTM C876-15, RILEM TC 154-EMC',
      mindestAnzahl: 'Flächendeckendes Raster: Mind. 50–200 Messpunkte je Bauteilabschnitt; mind. 1 Anschluss an das Bewehrungsnetz je 10–20 m².',
      rasterMass: 'Rastermaß 15 × 15 cm oder 20 × 20 cm (in stark gradientsbehafteten Zonen Verdichtung auf 10 × 10 cm).',
      auswahlKriterien: [
        'Horizontale und geneigte Flächen mit Tausalzbeaufschlagung (Tiefgaragendecken, Rampen, Brückenkappen).',
        'Stützenfüße in Tiefgaragen (Spritzwasserbereich 0–50 cm über OKFF).',
        'Spritzwasserbereiche an Meerwasserbauwerken (XS-Klassen).'
      ],
      statistischeBegruendung: 'Korrosion im Stahlbeton bildet galvanische Makroelemente. Nur ein engmaschiges Raster bildet die steilen Potentialgradienten (Delta U / Delta s) zwischen Anode (Lochfraß) und Kathode zuverlässig ab.'
    },
    conditioning: {
      titel: 'Vorbefeuchtung, Bewehrungskontakt & Übergangswiderstand',
      oberflaeche: 'Entfernen von isolierenden Beschichtungen, Ölen oder Teppichklebern; gründliches Vorreinigen.',
      klimaUndFeuchte: 'Vorbefeuchten der Betonoberfläche mind. 20–45 Minuten vor der Messung mit Netzwasser (Zugabe von tensidhaltigem Spülmittel), um den Übergangswiderstand R_c < 10 kOhm zu senken. ABER: Keine stehenden Wasserpfützen (Gefahr von Kurzschlussfeldern!).',
      vorbereitungLabor: 'Kalibrierung der Referenzelektrode (Kupfer/Kupfersulfat CSE oder Ag/AgCl) gegen Standard-Wasserstoffelektrode; gesättigte CuSO4-Lösung und sauberen Holz-/Keramik-Diaphragma-Stopfen sicherstellen.',
      kritischeFehlerVermeidung: [
        'Elektrische Durchgängigkeit des Bewehrungsnetzes vorab mit Multimeter prüfen (Widerstand zwischen zwei weit entfernten Freilegungsstellen muss R < 1 Ohm betragen).',
        'Trockener Beton führt zu unendlich hohem Innenwiderstand und fehlerhaften Zufallspotentialen.',
        'Sauerstoffmangel bei dauerwassergesättigtem Beton erzeugt stark negative Potentiale auch ohne Korrosion (Verschiebung des Ruhepotentials).'
      ]
    },
    standards: [
      {
        code: 'DGZfP-Merkblatt B 03',
        title: 'Merkblatt für elektrochemische Potenzialmessungen an Stahlbetonbauwerken',
        date: '2018-06',
        url: 'https://www.dgzfp.de/',
        scope: 'Standardisiertes Prüf- und Bewertungsverfahren in Deutschland.'
      },
      {
        code: 'ASTM C876-15',
        title: 'Standard Test Method for Corrosion Potentials of Uncoated Reinforcing Steel in Concrete',
        date: '2015-11',
        url: 'https://www.astm.org/',
        scope: 'Internationale Schwellenwert-Klassifikation für CSE-Elektroden.'
      },
      {
        code: 'DIN EN ISO 12696:2022-09',
        title: 'Kathodischer Korrosionsschutz von Stahl in Beton',
        date: '2022-09',
        url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+ISO+12696',
        scope: 'Regelwerk für Messungen vor und während des Betriebs von KKS-Anlagen.'
      }
    ],
    interpretation: {
      titel: 'Interpretation nach ASTM C876 & Potentialfeld-Gradienten',
      kerndiagnose: 'Die absolute Potentiallage und vor allem der Potentialgradient Delta U / Delta s kennzeichnen aktive Korrosionsherde (Anoden) und passive Schutzbereiche (Kathoden).',
      grenzwerte: [
        { parameter: 'U_CSE (vs. Cu/CuSO4)', wert: '> -200 mV', einheit: 'mV', status: 'ok', bewertung: 'Korrosionswahrscheinlichkeit < 10 % (passiv)', massnahme: 'Keine Instandsetzung erforderlich.' },
        { parameter: 'U_CSE (vs. Cu/CuSO4)', wert: '-200 bis -350 mV', einheit: 'mV', status: 'warn', bewertung: 'Ungewisser Übergangsbereich (Korrosionsbeginn)', massnahme: 'Bohrmehlanalyse auf Chloridgehalt an dieser Stelle durchführen.' },
        { parameter: 'U_CSE (vs. Cu/CuSO4)', wert: '< -350 mV', einheit: 'mV', status: 'crit', bewertung: 'Korrosionswahrscheinlichkeit > 90 % (aktive Korrosion)', massnahme: 'Schadensfläche freilegen, Betonabtrag bis hinter die Bewehrung.' },
        { parameter: 'Gradient Delta U / Delta s', wert: '> 100 mV/m', einheit: 'mV/m', status: 'crit', bewertung: 'Scharfer Makroelement-Korrosionsherd', massnahme: 'Akute Lochfraßgefahr; sofortige Instandsetzungsplanung.' }
      ],
      tragwerksAuswirkung: 'Chloridinduzierte Lochfraßkorrosion kann bis zu 50 % des Bewehrungsquerschnitts zerstören, OHNE dass Risse an der Betonoberfläche sichtbar sind (keine Volumenzunahme durch lösliche Eisenchloride!). Plötzlicher spröder Querschnittsbruch droht.',
      instandsetzungsKonsequenz: 'Ermöglicht eine zentimetergenaue Kartierung der Abtragsgrenzen für Höchstdruckwasserstrahlen (HDW). Nicht betroffene Flächen verbleiben unangetastet (Kostenersparnis von bis zu 60 % gegenüber Vollaustausch).',
      praxisFallbeispiel: 'Tiefgaragendecke (BJ 1990): 1.500 m² Fläche. Potentialfeldmessung mit Rollenelektrode liefert auf 180 m² Potentiale unter -380 mV mit Gradienten bis 150 mV/m. Gezielter HDW-Abtrag nur in diesen 180 m²; Restfläche erhält OS 11b Beschichtung.'
    }
  },

  // 6. BOHRMEHLANALYSE (CHLORIDE)
  bohrmehl: {
    id: 'bohrmehl',
    samplingPoints: {
      titel: 'Tiefengestaffelte Bohrmehlanalyse (DIN EN 14629)',
      normVorgabe: 'DIN EN 14629, DBV-Merkblatt Chloridbestimmung, TR Instandhaltung (DIBt)',
      mindestAnzahl: 'Mind. 3–5 Entnahmestellen je Schadensbereich / Expositionszone; mind. 5 Tiefenstufen je Messstelle.',
      rasterMass: 'Tiefenstufung: 0–5 mm, 5–10 mm, 10–15 mm, 15–20 mm, 20–30 mm, 30–40 mm; Probenmenge mind. 5 g Feinbohrmehl je Stufe.',
      auswahlKriterien: [
        'Stellen mit extrem negativen Potentialen aus der Potentialfeldmessung.',
        'Tiefe Risse und Arbeitsfugen im Fahrbahnbereich.',
        'Stützen- und Wandfüße (Tausalz-Sprüh- und Spritzwasserbereich).',
        'Ungeschädigte Referenzstelle zur Ermittlung des Grundchloridgehalts des Betons.'
      ],
      statistischeBegruendung: 'Das Diffusionsprofil nach Fick II erlaubt die Bestimmung des Oberflächenchloridgehalts C_s und des scheinbaren Diffusionskoeffizienten D_app zur rechnerischen Restlebensdauerprognose.'
    },
    conditioning: {
      titel: 'Trockenbohrung, Absaugung & Laborsäureaufschluss',
      oberflaeche: 'Entfernen von losem Schmutz und Reifenabrieb; Vorbohren der obersten 1 mm und Verwerfen dieses Mehls.',
      klimaUndFeuchte: 'Ausschließlich TROCKENBOHREN mit Schlagbohrmaschine (Bohrer-Ø 12–20 mm) und staubdicht aufgesetztem Bohrmehlsauger mit Filtertüte. KEIN NASSBOHREN (Spülwasser wäscht die wasserlöslichen Chloride sofort aus!).',
      vorbereitungLabor: 'Trocknung des Bohrmehls bei 105 °C bis zur Gewichtskonstanz im Trockenschrank; Aufschluss mit verdünnter Salpetersäure (HNO3); potentiometrische Titration mit Silbernitrat (AgNO3) oder Photometrie.',
      kritischeFehlerVermeidung: [
        'Vermischung der Tiefenstufen zwingend verhindern (Bohrloch nach jeder Stufe gründlich mit Staubsauger aussaugen, erst dann nächste Stufe anbohren).',
        'Bohrer nicht an Bewehrungsstahl reiben lassen (metallischer Abrieb verfälscht die Einwaage).',
        'Zementgehalt des Betons muss bekannt sein oder über Säureunlösliches / Ca-Gehalt bestimmt werden, um M.-% bezogen auf Zement zu berechnen.'
      ]
    },
    standards: [
      {
        code: 'DIN EN 14629:2007-06',
        title: 'Produkte und Systeme für den Schutz und die Instandsetzung von Betontragwerken – Prüfverfahren: Bestimmung des Chloridgehaltes in Festbeton',
        date: '2007-06',
        url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+14629',
        scope: 'Genormtes Laborprüfverfahren für Säureaufschluss und Titration.'
      },
      {
        code: 'DIBt TR Instandhaltung',
        title: 'Technische Regel Instandhaltung von Betonbauwerken – Teile 1 und 2',
        date: '2020-05',
        url: 'https://www.dibt.de/',
        scope: 'Definition des kritischen korrosionsauslösenden Chloridgehalts C_krit.'
      }
    ],
    interpretation: {
      titel: 'Interpretation: Diffusionsprofil & Korrosionsgrenzwerte',
      kerndiagnose: 'Liegt der Chloridgehalt an der Bewehrungslage über dem korrosionsauslösenden Anhaltswert (≈ 0,5 M.-% bez. Zement, objektspezifisch festzulegen), ist mit Depassivierung und Lochkorrosion ohne äußere Anzeichen zu rechnen.',
      grenzwerte: [
        { parameter: 'Chlorid an Bewehrung (Stahlbeton, Anhaltswert – objektspezifisch durch SKP)', wert: '< ≈ 0,5 M.-% bez. Zement', einheit: 'M.-%', status: 'ok', bewertung: 'Keine Depassivierung', massnahme: 'Präventiver Schutz (Oberflächenschutz nach TR Instandhaltung).' },
        { parameter: 'Chlorid an Bewehrung (Stahlbeton)', wert: '0,50–0,80 M.-%', einheit: 'M.-%', status: 'warn', bewertung: 'Kritischer Schwellenwert erreicht/überschritten', massnahme: 'Chloridabtrag oder KKS-Installation.' },
        { parameter: 'Chlorid an Bewehrung (Stahlbeton)', wert: '> 0,80 M.-%', einheit: 'M.-%', status: 'crit', bewertung: 'Hohes Lochfraß- & Querschnittsverlustrisiko', massnahme: 'Instandsetzungsprinzip nach TR Instandhaltung wählen (z. B. Chloridentfernung durch HDW-Abtrag, KKS nach DIN EN ISO 12696).' },
        { parameter: 'Chlorid an Spannstahl (Spannbeton)', wert: 'deutlich niedriger als bei Stahlbeton – gesonderte Beurteilung', einheit: 'M.-%', status: 'crit', bewertung: 'Gefahr von Spannungsrisskorrosion', massnahme: 'Sofortige statische Überprüfung, Spannglieder freilegen/ersetzen.' }
      ],
      tragwerksAuswirkung: 'Im Gegensatz zu Karbonatisierungskorrosion führt Chloridkorrosion zu lokalem Lochfraß mit Querschnittsreduktionen von > 30 % innerhalb weniger Jahre. Bei Spannbeton droht spröder Spannstahlbruch ohne Vorwarnung!',
      instandsetzungsKonsequenz: 'TR Instandhaltung (DIBt): Prinzip W (Trockenhalten), Prinzip R (chloridbelasteten Beton entfernen und reprofilieren) oder Prinzip K (Kathodischer Korrosionsschutz nach DIN EN ISO 12696).',
      praxisFallbeispiel: 'Rampenbauwerk Parkhaus: Bohrmehlanalyse zeigt an Bewehrungstiefe (25 mm) einen Chloridgehalt von 1,42 M.-% bezogen auf Zement (Anhaltswert ≈ 0,5 M.-% bez. Zement knapp um das Dreifache – 2,8-fach – überschritten). Entscheidung: HDW-Abtrag um 50 mm, neue Bewehrung einbauen, SPCC Reprofilierung und rissüberbrückendes OS 11a System.'
    }
  },

  // 7. KARBONATISIERUNG (PHENOLPHTHALEIN)
  karbonatisierung: {
    id: 'karbonatisierung',
    samplingPoints: {
      titel: 'Karbonatisierungs-Tiefenmessung (DIN EN 14630)',
      normVorgabe: 'DIN EN 14630, DIN EN 206-1, DIBt TR Instandhaltung',
      mindestAnzahl: 'Mind. 3–5 Prüfstellen je Bauteil / Himmelsrichtung; mind. 5–10 Einzelablesungen entlang der Bruchkante.',
      rasterMass: 'Messstellen über Bauteilhöhe verteilt (z.B. 0,5 m, 1,5 m, 2,5 m); Sonnen- und Wetterseite getrennt untersuchen.',
      auswahlKriterien: [
        'Außenbauteile unter atmosphärischer Einwirkung (XC3, XC4).',
        'Bauteile mit geringer planmäßiger Betondeckung.',
        'Oberflächen mit beginnenden Längsrissen entlang der Bewehrungsführung.'
      ],
      statistischeBegruendung: 'Die Karbonatisierungsfront verläuft wellenförmig infolge inhomogener Porenradienverteilung. Mittelwert d_k,mean und Maximalwert d_k,max müssen getrennt dokumentiert werden.'
    },
    conditioning: {
      titel: 'Bruchstellenherstellung & Indikatoranwendung',
      oberflaeche: 'Ausschließlich FRISCH HERGESTELLTE BRUCHFLÄCHEN prüfen (durch Meißeln/Spalten erzeugt).',
      klimaUndFeuchte: 'Prüffläche sofort mit sauberer, ölfreier Druckluft trocken entstauben. KEIN NASS-SCHNEIDEN (Sägeschlämme verschmiert den pH-Wert und verfälscht die Messung!).',
      vorbereitungLabor: 'Herstellung der Indikatorlösung: 1 g Phenolphthalein-Pulver in 70 ml Ethanol (96 %) lösen und mit 30 ml destilliertem Wasser auf 100 ml auffüllen.',
      kritischeFehlerVermeidung: [
        'Ablesung MUSS innerhalb von 30 bis 60 Sekunden nach Aufsprühen erfolgen! Längeres Warten führt zur Rückkarbonatisierung der Bruchfläche durch das CO2 der Raumluft (Verfärbung schlägt zurück).',
        'Zuschlagskörner nicht mitmessen: Nur den Zementstein bewerten (violett = pH > 9,0 = passiv; farblos = pH < 9,0 = karbonatisiert).',
        'Feinskalierte Risslupe oder Messschieber mit Tiefentaster zur Messung nutzen (Genauigkeit ± 0,5 mm).'
      ]
    },
    standards: [
      {
        code: 'DIN EN 14630:2007-01',
        title: 'Produkte und Systeme für den Schutz und die Instandsetzung von Betontragwerken – Prüfverfahren: Bestimmung der Karbonatisierungstiefe im Festbeton mit der Phenolphthalein-Prüfung',
        date: '2007-01',
        url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+14630',
        scope: 'Verbindliche Prüfvorschrift in ganz Europa.'
      },
      {
        code: 'DIN EN 206-1:2021-06',
        title: 'Beton – Teil 1: Festlegung, Eigenschaften, Herstellung und Konformität',
        date: '2021-06',
        url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+206-1',
        scope: 'Definition der Expositionsklassen XC1 bis XC4.'
      }
    ],
    interpretation: {
      titel: 'Interpretation: Passivierungsreserve & Wurzel-Zeit-Prognose',
      kerndiagnose: 'Vergleich der Karbonatisierungstiefe d_k mit der Betondeckung c. Die Restpassivierungsreserve beträgt Delta c = c - d_k. Sinkt Delta c auf 0, setzt bei Zutritt von Feuchte und Sauerstoff Rostbildung ein.',
      grenzwerte: [
        { parameter: 'Restpassivierungsreserve c - d_k', wert: '> 15 mm', einheit: 'mm', status: 'ok', bewertung: 'Ausreichender Passivierungsschutz für Jahrzehnte', massnahme: 'Keine Instandsetzung.' },
        { parameter: 'Restpassivierungsreserve c - d_k', wert: '5–15 mm', einheit: 'mm', status: 'warn', bewertung: 'Depassivierungsfront nähert sich Bewehrung', massnahme: 'Prognose mit d_k = k_carb · sqrt(t); vorbeugende CO2-Bremse (OS 4).' },
        { parameter: 'Restpassivierungsreserve c - d_k', wert: '< 5 mm bzw. ≤ 0 mm', einheit: 'mm', status: 'crit', bewertung: 'Bewehrung depassiviert (Rostgefahr!)', massnahme: 'Betonersatz oder carbonatisierungsbremsende Schutzsysteme.' }
      ],
      tragwerksAuswirkung: 'Depassivierung führt bei feuchter Witterung zu flächiger Muldenkorrosion. Das Rostvolumen (bis zum 6-fachen des Ursprungsvolumens) erzeugt Ringspannungen > 10 N/mm² und sprengt die Betondeckung ab.',
      instandsetzungsKonsequenz: 'DIBt TR Instandhaltung: Reprofilierung mit PCC/SPCC nach vorherigem Entrosten der Bewehrung auf Reinheitsgrad Sa 2½ (DIN EN ISO 8501-1) und Applikation von mineralischem Korrosionsschutz.',
      praxisFallbeispiel: 'Wohnanlage Baujahr 1974: Balkonbrüstungen. Gemessene Betondeckung c = 22 mm. Karbonatisierungstiefe d_k = 25 mm. Bewehrung liegt bereits 3 mm im karbonatisierten Zementstein! Rostfahnen sichtbar. Sanierung: Betondeckung abtragen, entrosten, 2K-Korrosionsschutz, Reprofilierung mit PCC I Mörtel, Anstrich OS 5a.'
    }
  },

  // 8. BOHRKERN (DRUCKFESTIGKEIT)
  bohrkern: {
    id: 'bohrkern',
    samplingPoints: {
      titel: 'Zylindrische Bohrkernentnahme & Druckprüfung (DIN EN 12504-1)',
      normVorgabe: 'DIN EN 12504-1, DIN EN 13791 (Bewertung der In-situ-Druckfestigkeit)',
      mindestAnzahl: 'Statistische Auswertung ab 8 Bohrkernen je Prüfbereich (k_n = 2,00 bei n = 8); bei kleineren Stichproben gesondertes, konservativeres Verfahren.',
      rasterMass: 'Gleichmäßig über den Prüfbereich verteilt; Kerndurchmesser bevorzugt d = 100 mm (mind. 3-faches Größtkorn d_max).',
      auswahlKriterien: [
        'Statisch geringer beanspruchte Querschnittsbereiche zur Schonung der Tragfähigkeit.',
        'Vorab-Ortung der Bewehrung mit Covermeter (bewehrungsfreie Kernentnahme anstreben!).',
        'Ausschluss von Bereichen mit Rissen oder Schwindrissen.'
      ],
      statistischeBegruendung: 'DIN EN 13791:2020-02: f_ck,is = min(f_c,m(n),is − k_n · s; f_c,is,lowest + M), k_n = 2,00 (n = 8) bis 1,64 (n → ∞), s mindestens entsprechend V = 8 %, M = 1 bis 4 N/mm² je nach Tiefstwert; Einstufung mit f_ck = f_ck,is / 0,85. Die Fassung 2008 verwendete 1,48 · s ab 15 Kernen.'
    },
    conditioning: {
      titel: 'Konditionierung, Ablängen & Stirnflächenbearbeitung',
      oberflaeche: 'Entnahme mit diamantbesetzter Kernbohrkrone unter Wasserkühlung.',
      klimaUndFeuchte: 'Lagerungskonditionierung gem. DIN EN 13791: Vor Prüfung mind. 3 Tage im Prüfraum bei 20 ± 2 °C und 50–65 % r.F. lagern (lufttrocken) ODER mind. 48 h wassergesättigt. Feuchtezustand muss dokumentiert werden, da nasser Beton ~10–15 % geringere Festigkeit zeigt!',
      vorbereitungLabor: 'Ablängen auf Schlankheit h/d = 1,0 oder 2,0 (Sägeschnitt orthogonal zur Zylinderachse). Stirnflächen zwingend planparallel schleifen (Abweichung < 0,05 mm) oder Deckschicht nach DIN EN 12390-3 (Schwefelgemisch oder Tonerdeschmelzzement-Mörtel).',
      kritischeFehlerVermeidung: [
        'Querliegende Bewehrungsstäbe im Kern verfälschen die Druckfestigkeit drastisch (Korrekturfaktoren nach DIN EN 12504-1 anwenden, besser bewehrungsfrei bohren!).',
        'Beschädigte, ausgebrochene Kernränder führen zu exzentrischer Krafteinleitung und vorzeitigem Kantenbruch.',
        'Belastungsgeschwindigkeit normgerecht auf 0,6 ± 0,2 MPa/s einstellen (DIN EN 12390-3).'
      ]
    },
    standards: [
      {
        code: 'DIN EN 12504-1:2019-09',
        title: 'Prüfung von Beton in Bauwerken – Teil 1: Bohrkernproben – Herstellung, Untersuchung und Prüfung der Druckfestigkeit',
        date: '2019-09',
        url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+12504-1',
        scope: 'Entnahme und Probenaufbereitung.'
      },
      {
        code: 'DIN EN 13791:2020-02',
        title: 'Bewertung der Druckfestigkeit von Beton in Bauwerken oder in Bauwerksteilen',
        date: '2020-02',
        url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+13791',
        scope: 'Bestimmung der charakteristischen In-situ-Druckfestigkeit f_ck,is aus Bohrkernen und indirekten Verfahren (mit Kalibrierung).'
      },
      {
        code: 'DIN EN 12390-3:2019-10',
        title: 'Prüfung von Festbeton – Teil 3: Druckfestigkeit von Probekörpern',
        date: '2019-10',
        url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+12390-3',
        scope: 'Durchführung der Druckprüfung auf kalibrierter Prüfmaschine.'
      }
    ],
    interpretation: {
      titel: 'Interpretation: f_ck,is & Zuordnung zu Druckfestigkeitsklassen',
      kerndiagnose: 'Nach DIN EN 13791 gilt f_ck ≈ f_ck,is / 0,85 (Verhältnis In-situ- zu Normprobekörperfestigkeit). Davon zu trennen ist der Dauerstandsbeiwert α_cc = 0,85 im Bemessungswert f_cd = α_cc · f_ck / γ_c (EC2).',
      grenzwerte: [
        { parameter: 'f_ck,is / f_ck,plan', wert: '≥ 0,85', einheit: '-', status: 'ok', bewertung: 'Volle Tragfähigkeit nachgewiesen', massnahme: 'Keine Tragfähigkeitsminderung.' },
        { parameter: 'f_ck,is / f_ck,plan', wert: '0,75–0,85', einheit: '-', status: 'warn', bewertung: 'Geringe Abweichung von Planwerten', massnahme: 'Statische Nachrechnung mit tatsächlichem f_cd,is = f_ck,is / gamma_c.' },
        { parameter: 'f_ck,is / f_ck,plan', wert: '< 0,75', einheit: '-', status: 'crit', bewertung: 'Erhebliche Festigkeitsunterschreitung', massnahme: 'Lastbeschränkung oder Ertüchtigung mit CFK-Lamellen / Spritzbeton.' }
      ],
      tragwerksAuswirkung: 'Direkte Eingangsgröße für die statische Nachrechnung der Grenzzustände der Tragfähigkeit (GZT) und Gebrauchstauglichkeit (GZG) nach Eurocode 2.',
      instandsetzungsKonsequenz: 'Belastbare Klärung von Gewährleistungs- und Bauschadensfragen bei Festigkeitsunterschreitungen auf Neubaustellen oder Bestandsgebäuden.',
      praxisFallbeispiel: 'Umnutzung eines Industriegebäudes (BJ 1968) zu Archivräumen mit erhöhter Verkehrslast (5,0 kN/m²). 14 Bohrkerne (statistische Auswertung, k_n ≈ 1,80) ergeben f_ck,is = 24,8 N/mm² -> entspricht rechnerisch C25/30. Nachrechnung zeigt ausreichende Querkraft- und Biegereserven.'
    }
  },

  // 9. HAFTABZUGSPRÜFUNG
  haftabzug: {
    id: 'haftabzug',
    samplingPoints: {
      titel: 'Haftabzugsprüfung / Abreißversuch (DIN EN 1542)',
      normVorgabe: 'DIN EN 1542, ZTV-ING Teil 3 Abschnitt 4, DIBt TR Instandhaltung',
      mindestAnzahl: 'Mind. 3–5 Prüfstellen je Prüflos / Bauteilabschnitt (mind. 1 Prüflos je 25–50 m² oder je Bauabschnitt).',
      rasterMass: 'Prüfstellenabstand mind. 200 mm; Abstand zu Bauteilkanten mind. 100 mm.',
      auswahlKriterien: [
        'Vorbereitete Untergründe vor Applikation von Instandsetzungsmörtel / Beschichtungen.',
        'Applizierte Instandsetzungssysteme zur Abnahmeprüfung des Verbunds.',
        'Zonen mit unterschiedlicher Untergrundvorbereitung (Kugelstrahlen, Fräsen, HDW).'
      ],
      statistischeBegruendung: 'Die Abreißfestigkeit unterliegt hoher Streuung. Die Norm fordert sowohl einen Mindest-Mittelwert f_ct,mean als auch einen Mindest-Einzelwert f_ct,min.'
    },
    conditioning: {
      titel: 'Kernbohrung, Klebung & Zuggeschwindigkeit',
      oberflaeche: 'Trockene, saubere, staub- und fettfreie Oberfläche.',
      klimaUndFeuchte: 'Objekttemperatur mind. +5 °C (bzw. gemäß Klebstoffspezifikation); keine Taubildung.',
      vorbereitungLabor: 'Ringnut bohren: Kernbohrung Ø 50 mm rechtwinklig zur Oberfläche mind. 10–15 mm tief in den Altbeton eintiefen (bei Beschichtungen: mind. Schichtdicke + 5 mm). Bohrloch gründlich mit ölfreier Druckluft reinigen. Prüfstempel (Stahl oder Aluminium, d ≥ 20 mm) mit 2K-Epoxidharzkleber aufkleben. Aushärtung mind. 24 h abwarten.',
      kritischeFehlerVermeidung: [
        'Schief aufgeklebter Stempel oder schräge Zugkraft erzeugt Schäl- und Biegespannungen (führt zu stark reduzierten Schein-Werten; Kugelgelenk am Zuggerät zwingend!).',
        'Bruch im Klebstoff (Bruchtyp Y) ist ungültig und muss wiederholt werden.',
        'Laststeigerungsrate muss exakt 0,05 ± 0,01 MPa/s betragen.'
      ]
    },
    standards: [
      {
        code: 'DIN EN 1542:1999-07',
        title: 'Produkte und Systeme für den Schutz und die Instandsetzung von Betontragwerken – Prüfverfahren: Messung der Haftfestigkeit im Abreißversuch',
        date: '1999-07',
        url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+1542',
        scope: 'Genormte Prüfvorschrift für Untergrund und Instandsetzungsschichten.'
      },
      {
        code: 'ZTV-ING Teil 3',
        title: 'Zusätzliche Technische Vertragsbedingungen und Richtlinien für Ingenieurbauten – Instandsetzung von Betonbauteilen',
        date: '2021-03',
        url: 'https://www.bast.de/',
        scope: 'Erhöhte Anforderungen für Brücken- und Ingenieurbauwerke.'
      }
    ],
    interpretation: {
      titel: 'Interpretation: Abreißfestigkeit & Bruchbildanalyse',
      kerndiagnose: 'Die Bewertung erfolgt IMMER zweistufig: 1. Numerischer Festigkeitswert f_ct [N/mm²], 2. Bruchbild (A, A/B, B, Y). Nur ein Bruch im Altbeton (Typ A) beweist eine optimale Verbundzone!',
      grenzwerte: [
        { parameter: 'f_ct,mean Untergrund (Hochbau)', wert: '≥ 1,5 N/mm² (Einzelwert ≥ 1,0)', einheit: 'N/mm²', status: 'ok', bewertung: 'Tragfähiger Untergrund für PCC/SPCC', massnahme: 'Freigabe für Reprofilierung.' },
        { parameter: 'f_ct,mean Untergrund (ZTV-ING)', wert: 'systemabhängig', einheit: 'N/mm²', status: 'ok', bewertung: 'Anforderung je OS-System und Bauteil nach ZTV-ING Teil 3-4 (Tabellenwert der geltenden Ausgabe)', massnahme: 'Freigabe nur bei Einhaltung des Tabellenwerts.' },
        { parameter: 'f_ct,mean Untergrund', wert: '< 1,5 N/mm²', einheit: 'N/mm²', status: 'crit', bewertung: 'Ungenügende Abreißfestigkeit / Mürber Beton', massnahme: 'Weiterer Betonabtrag erforderlich (z.B. HDW-Strahlen).' },
        { parameter: 'Bruchbild A/B (Verbundfuge)', wert: '> 50 % Fugenbruch', einheit: '%', status: 'crit', bewertung: 'Mangelhafte Haftung des Instandsetzungsmörtels', massnahme: 'Mangel; Rückbau der Instandsetzungsschicht.' }
      ],
      tragwerksAuswirkung: 'Bei Schub- und Biegung in verstärkten Bauteilen (z.B. Aufbeton oder Spritzbetonverstärkung) entscheidet die Haftzugfestigkeit über die Schubkraftübertragung in der Verbundfuge nach Eurocode 2.',
      instandsetzungsKonsequenz: 'Qualitätssicherungsschritt vor jeder Beschichtung (OS 8, OS 11) oder Mörtelapplikation. Mangelhafte Untergrundfestigkeit führt unweigerlich zu Hohllagen und Abplatzungen.',
      praxisFallbeispiel: 'Tiefgaragenboden nach Kugelstrahlen: 5 Haftzugstempel zeigen Mittelwert f_ct = 0,82 N/mm² mit Bruchtyp A (Gefügezerrüttung im Altbeton durch vorherigen Fräseinsatz). Freigabe verweigert; Nachbehandlung durch Feinfräsen und erneutes Kugelstrahlen bringt f_ct auf 1,75 N/mm².'
    }
  },

  // 10. KARSTENSCHES RÖHRCHEN (KAPILLARE WASSERAUFNAHME)
  karsten: {
    id: 'karsten',
    samplingPoints: {
      titel: 'Karstensches Prüfröhrchen (RILEM II.4)',
      normVorgabe: 'RILEM II.4, DIN EN 16302 – nicht gleichzusetzen mit dem w-Wert nach DIN EN ISO 15148',
      mindestAnzahl: 'Mind. 3–5 Prüfstellen je Fassadenseite / Bauteiltyp (Schlagregenseite vs. wetterabgewandte Seite).',
      rasterMass: 'Messstellen in Sockelzone, Fassadenmitte und unter Fensterbänken anordnen.',
      auswahlKriterien: [
        'Fassadenputze vor und nach Hydrophobierung.',
        'Historisches Ziegel- und Natursteinmauerwerk.',
        'Bereiche mit sichtbaren Feuchteflecken oder Salzausblühungen.'
      ],
      statistischeBegruendung: 'Fassaden weisen mikroklimatische Zonen auf. Die Wasseraufnahmegeschwindigkeit variiert stark zwischen Ziegel, Fugenmörtel und Putz.'
    },
    conditioning: {
      titel: 'Abdichtung, Prüfflüssigkeit & Zeitabstände',
      oberflaeche: 'Oberfläche trocken und staubfrei abbürsten; keine Risse im Bereich des Kleberings.',
      klimaUndFeuchte: 'Messung bei trockenem Wetter (mind. 24 h nach dem letzten Regen); Untergrundfeuchte dokumentieren.',
      vorbereitungLabor: 'Befestigung des Prüfröhrchens mit plastischer Knetdichtung (z.B. Terostat-Knetmasse) absolut wasserdicht an der Wand. Befüllung mit destilliertem Wasser bis zur 0-Marke (Wassersäule erzeugt hydrostatischen Druck von ca. 100 mm WS, entsprechend Schlagregendruck bei ca. 50 km/h Wind).',
      kritischeFehlerVermeidung: [
        'Undichtigkeit des Knetrings führt zu Scheinauslauf (sofortige visuelle Kontrolle auf seitlichen Wasseraustritt).',
        'Direkte Sonneneinstrahlung vermeiden (Erwärmung dehnt die Wassersäule aus und verfälscht die Ablesung).',
        'Ablesungen in festen Zeitintervallen dokumentieren: 5, 10, 15, 30 und 60 Minuten.'
      ]
    },
    standards: [
      {
        code: 'DIN EN 16302:2013-05',
        title: 'Erhaltung des kulturellen Erbes – Prüfverfahren – Messung der Wasseraufnahme mit dem Karstenschen Prüfröhrchen',
        date: '2013-05',
        url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+16302',
        scope: 'Offizielle europäische Norm für die Karsten-Prüfung.'
      },
      {
        code: 'WTA-Merkblatt 4-5-20',
        title: 'Beurteilung von Mauerwerk – Mauerwerksdiagnostik',
        date: '2020-04',
        url: 'https://www.wta-international.org/',
        scope: 'Richtlinie zur Bewertung von Fassaden und Hydrophobierungen.'
      }
    ],
    interpretation: {
      titel: 'Interpretation: Wasseraufnahmekoeffizient w & Hydrophobierung',
      kerndiagnose: 'Die Wasseraufnahme nach 60 Minuten [ml] korreliert mit dem kapillaren Wasseraufnahmekoeffizienten w [kg/(m²·h^0,5)]. Ein intakter Fassadenschutz erfordert w ≤ 0,5 kg/(m²·h^0,5).',
      grenzwerte: [
        { parameter: 'Wasserverlust nach 60 min', wert: '< 0,5 ml', einheit: 'ml', status: 'ok', bewertung: 'Wasserabweisend (w < 0,2 kg/(m²·h^0,5))', massnahme: 'Sehr guter Schlagregenschutz / wirksame Hydrophobierung.' },
        { parameter: 'Wasserverlust nach 60 min', wert: '0,5–3,0 ml', einheit: 'ml', status: 'warn', bewertung: 'Wasserhemmend', massnahme: 'Normale Schlagregenbeanspruchung tolerierbar; Fassadenhydrophobierung prüfen.' },
        { parameter: 'Wasserverlust nach 60 min', wert: '> 3,0 ml', einheit: 'ml', status: 'crit', bewertung: 'Sauggfähig / Wasserdurchlässig', massnahme: 'Gefahr von Durchfeuchtung und Frostschäden; Fassadensanierung erforderlich.' }
      ],
      tragwerksAuswirkung: 'Ständige Durchfeuchtung von Mauerwerk führt im Winter zu Frostabsprengungen, Reduktion der Mauerwerksdruckfestigkeit und starker Verschlechterung des Wärmedämmwerts U.',
      instandsetzungsKonsequenz: 'Dient der Erfolgskontrolle von Hydrophobierungen (Silan-/Siloxan-Imprägnierungen nach WTA 4-5) sowie Sanierputzsystemen nach WTA 2-9.',
      praxisFallbeispiel: 'Historische Schlossfassade (Kalksandstein): Karsten-Messung vor Sanierung: 12 ml Wasserverlust nach 60 min. Nach Applikation einer Creme-Hydrophobierung auf Silanbasis: 0,2 ml nach 60 min. Vollständiger Schlagregenschutz nachgewiesen.'
    }
  },

  // 11. DARR-METHODE (FEUCHTEREFERENZ)
  darrmethode: {
    id: 'darrmethode',
    samplingPoints: {
      titel: 'Gravimetrische Darr-Methode (DIN EN ISO 12570)',
      normVorgabe: 'DIN EN ISO 12570, DIN 18560, WTA-Merkblatt 4-11',
      mindestAnzahl: 'Mind. 3 Proben je Schicht / Bauteilquerschnitt (Oberfläche, Bauteilmitte, Bauteilunterseite).',
      rasterMass: 'Tiefengestaffelte Entnahme (z.B. alle 2–5 cm Kernbohrungsscheiben); Probenmenge mind. 50–100 g je Messprobe.',
      auswahlKriterien: [
        'Estrichböden vor Belegung mit feuchteempfindlichen Belägen (Parkett, Epoxidharz).',
        'Durchfeuchtete Außenwände, Kellerwände und Flachdächer.',
        'Kalibrierreferenz für CM-Geräte, Mikrowellen- und Widerstandsfeuchtemesser.'
      ],
      statistischeBegruendung: 'Die Darr-Methode ist das anerkannte Schieds- und Referenzverfahren im Baurecht. Nur die gravimetrische Wägung bei 105 °C erfasst das physikalisch freie und kapillar gebundene Wasser exakt.'
    },
    conditioning: {
      titel: 'Probenentnahme, Transportbehälter & Trocknung',
      oberflaeche: 'Entnahme durch Stemmen/Meißeln oder Bohren mit niedriger Drehzahl.',
      klimaUndFeuchte: 'Sofortiges luftdichtes Verpacken der Probe vor Ort in dampfdichten Glasgefäßen mit Schraubdeckel oder versiegelten Alubeuteln. KEIN Verdunsten während des Transports!',
      vorbereitungLabor: 'Einwaage m_feucht auf Analysenwaage (Genauigkeit ± 0,01 g). Trocknung im belüfteten Wärmeschrank bei 105 ± 2 °C (bei Gips/Calciumsulfat: 40 ± 2 °C zur Vermeidung von Kristallwasserabspaltung!). Trocknen bis zur Gewichtskonstanz (Massenänderung < 0,1 % zwischen zwei Wägungen im Abstand von 4 h). Rückwaage m_trocken.',
      kritischeFehlerVermeidung: [
        'Hochtouriges Bohren erzeugt Reibungswärme, die das Porenwasser bereits beim Entnehmen verdampft (Temperatur der Probe < 40 °C halten).',
        'Gipshaltige Baustoffe NIEMALS bei 105 °C darren (Dihydrat wandelt sich sonst in Halbhydrat/Anhydrit um = Scheinfeuchte!).',
        'Heiße Proben vor der Rückwägung im Exsikkator mit Kieselgel auf Raumtemperatur abkühlen lassen (warme Luft erzeugt Auftrieb auf der Waage).'
      ]
    },
    standards: [
      {
        code: 'DIN EN ISO 12570:2000-04',
        title: 'Wärme- und feuchtetechnisches Verhalten von Baustoffen – Bestimmung des Feuchtegehaltes durch Trocknen bei erhöhter Temperatur',
        date: '2000-04',
        url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+ISO+12570',
        scope: 'Internationales Referenzverfahren für alle festen Baustoffe.'
      },
      {
        code: 'DIN 18560-1:2021-02',
        title: 'Estriche im Bauwesen – Teil 1: Allgemeine Anforderungen, Prüfung und Ausführung',
        date: '2021-02',
        url: 'https://www.dinmedia.de/de/suche?q=DIN+18560-1',
        scope: 'Definition der Belegreife-Grenzwerte.'
      },
      {
        code: 'WTA-Merkblatt 4-11',
        title: 'Messung der Feuchte von mineralischen Baustoffen',
        date: '2016-08',
        url: 'https://www.wta-international.org/',
        scope: 'Praxisleitfaden für vergleichende Feuchtemessmethoden.'
      }
    ],
    interpretation: {
      titel: 'Interpretation: Massebezogene Feuchte u & Belegreife',
      kerndiagnose: 'Berechnung des Feuchtegehalts: u = (m_feucht - m_trocken) / m_trocken · 100 [M.-%]. Vergleich mit Ausgleichsfeuchte und Belegreifegrenzen.',
      grenzwerte: [
        { parameter: 'Zementestrich unbeheizt (CM-Methode)', wert: '≤ 2,0 CM-%', einheit: 'CM-%', status: 'ok', bewertung: 'Belegreif für alle Beläge', massnahme: 'Freigabe für Bodenbelagsarbeiten.' },
        { parameter: 'Zementestrich beheizt (CM-Methode)', wert: '≤ 1,8 CM-%', einheit: 'CM-%', status: 'ok', bewertung: 'Belegreif bei Fußbodenheizung', massnahme: 'Freigabe nach Aufheizprotokoll.' },
        { parameter: 'Calciumsulfatestrich (CM-Methode)', wert: '≤ 0,5 CM-% (beheizt ≤ 0,3)', einheit: 'CM-%', status: 'ok', bewertung: 'Belegreif', massnahme: 'Freigabe.' },
        { parameter: 'Beton vor Beschichtung OS 8/OS 11', wert: '> 4,0 M.-%', einheit: 'M.-%', status: 'crit', bewertung: 'Überfeuchtet für dichte Epoxidharze', massnahme: 'Osmose- & Blasenbildungsgefahr! Bautrocknung fortsetzen oder dampfdiffusionsoffene Systeme nutzen.' }
      ],
      tragwerksAuswirkung: 'Hohe Bauteilfeuchte begünstigt Schimmelbildung, Korrosion der eingebetteten Bewehrung, Frostsprengung und chemische Treibreaktionen (z.B. Ettringit-/Thaumasitbildung).',
      instandsetzungsKonsequenz: 'Entscheidungskriterium für Vertikal- und Horizontalabdichtungen, Injektionsmittel (PUR vs. Acrylatgel) und Trocknungsmaßnahmen.',
      praxisFallbeispiel: 'Neubau Gewerbehalle: Zementestrich nach 6 Wochen. Vor-Ort-CM-Messung liefert 2,4 CM-% (Grenzwert 2,0 CM-%). Die Darr-Gegenprüfung ergibt systematisch höhere Werte (hier ca. 3,5 M.-%) und ist nicht direkt mit CM-Grenzwerten vergleichbar. Parkettleger verweigert zu Recht die Belegung. Nach 10 Tagen technischer Trocknung CM 1,8 % -> Belegreife.'
    }
  },

  // 12. GEORADAR (GPR)
  georadar: {
    id: 'georadar',
    samplingPoints: {
      titel: 'Georadar-Messung (GPR - Ground Penetrating Radar)',
      normVorgabe: 'ASTM D6432-19, DGZfP-Merkblatt B 10, ETSI EN 302 066',
      mindestAnzahl: 'Linienraster: Mind. 5–10 Scanlinien orthogonal zur vermuteten Schadens-/Bewehrungsrichtung; Flächenscan: Raster 10–25 cm.',
      rasterMass: 'Raster 10 × 10 cm bis 25 × 25 cm mit polarisierten Antennen (1,5 bis 2,6 GHz für Bauwerksdiagnostik).',
      auswahlKriterien: [
        'Ortung von Spanngliedern, Hüllrohren und mehrlagiger Bewehrung.',
        'Detektion von Hohlräumen hinter Tunnelinnenschalen oder unter Fahrbahnplatten.',
        'Dickenbestimmung von Fundamenten und Schichtaufbauten.',
        'Ortung historischer Holzbalkenlagen unter Estrich.'
      ],
      statistischeBegruendung: 'Radargramme (B-Scans) zeigen Hyperbeln an dielektrischen Grenzübergängen. Ein dichtes Profilnetz verhindert Fehlinterpretationen durch einzelne Reflexionsartefakte.'
    },
    conditioning: {
      titel: 'Oberflächenführung, Antennenpolarisation & Kalibrierung',
      oberflaeche: 'Glatte, hindernisfreie Oberfläche für kontinuierliche Raddistanzmessung (Odometer-Rad).',
      klimaUndFeuchte: 'Trockener Beton bevorzugt. Nasse Zonen dämpfen elektromagnetische Mikrowellen extrem stark (hohe Leitfähigkeit sigma absorbiert Radarwellen).',
      vorbereitungLabor: 'Ermittlung der relativen Dielektrizitätskonstante epsilon_r (Beton typisch epsilon_r = 6–9; Ausbreitungsgeschwindigkeit v = c_0 / sqrt(epsilon_r) ~ 10–12 cm/ns). Kalibrierung der Tiefe an bekannter Bauteildicke oder Bohrkernbohrung.',
      kritischeFehlerVermeidung: [
        'Dichte obere Bewehrungslage (Matten mit Maschenweite < 100 mm) wirkt als Faradayscher Käfig und schirmt tiefere Schichten ab.',
        'Falsch kalibriertes epsilon_r erzeugt systematische Tiefenfehler von bis zu 30 %.',
        'Metallische Leitungen erzeugen Mehrfachreflexionen (Ghosts).'
      ]
    },
    standards: [
      {
        code: 'DGZfP-Merkblatt B 10',
        title: 'Georadar im Bauwesen – Grundlagen und Anwendungen',
        date: '2015-11',
        url: 'https://www.dgzfp.de/',
        scope: 'Leitfaden für zerstörungsfreie Radarprüfung im Hoch- und Tiefbau.'
      },
      {
        code: 'ASTM D6432-19',
        title: 'Standard Guide for Using the Surface Ground Penetrating Radar Method for Subsurface Investigation',
        date: '2019-06',
        url: 'https://www.astm.org/',
        scope: 'Internationale Norm für GPR-Messungen.'
      }
    ],
    interpretation: {
      titel: 'Interpretation: Radargramm-Reflexionen & Schichtgrenzen',
      kerndiagnose: 'Die Phasenumkehr und Amplitude der elektromagnetischen Reflexion kennzeichnet den Übergang: Beton zu Luft (Hohlraum) zeigt positive Polarität; Beton zu Wasser zeigt stark negative Polarität; Beton zu Metall (Bewehrung) erzeugt Totalreflexion.',
      grenzwerte: [
        { parameter: 'Reflexionshyperbel Metall', wert: 'Hohe Amplitude, Phasenumkehr', einheit: '-', status: 'ok', bewertung: 'Bewehrungsstab / Spannglied geortet', massnahme: 'Lage und Überdeckung dokumentieren.' },
        { parameter: 'Signaldämpfung (feuchter Bereich)', wert: 'Starker Amplitudenabfall', einheit: 'dB', status: 'warn', bewertung: 'Wasseransammlung / Chloridkontamination', massnahme: 'Bohrmehlanalyse zur Verifikation veranlassen.' },
        { parameter: 'Unterbrechung Sohlenreflexion', wert: 'Hohlraumhyperbel', einheit: '-', status: 'crit', bewertung: 'Ausspülung / Hohlstelle unter Bauteil', massnahme: 'Verfüllung durch Zementsuspensions-Injektion.' }
      ],
      tragwerksAuswirkung: 'Verhindert das versehentliche Durchtrennen von Spanngliedern bei nachträglichen Kernbohrungen für Haustechnik oder Aufzüge.',
      instandsetzungsKonsequenz: 'Zerstörungsfreie Vorerkundung vor statischen Eingriffen; Auffinden von Hohlräumen hinter Bauteilen vor Injektionsmaßnahmen.',
      praxisFallbeispiel: 'Brückenbauwerk: Vor Einbau neuer Brückenentwässerung muss Kernbohrung Ø 200 mm gesetzt werden. GPR-3D-Scan (2,6 GHz Antenne) lokalisiert das Spannglied exakt bei Tiefe 145 mm mit Achsabstand 80 mm zur Bohrstelle. Bohrung wird um 15 cm versetzt -> Spanngliedkollision abgewendet.'
    }
  },

  // 13. IMPACT-ECHO
  impact_echo: {
    id: 'impact_echo',
    samplingPoints: {
      titel: 'Impact-Echo-Verfahren (Resonanzfrequenzanalyse)',
      normVorgabe: 'ASTM C1383-15, DGZfP-Merkblatt B 11 (2022)',
      mindestAnzahl: 'Punktmessungen im Raster 20 × 20 cm bis 50 × 50 cm über den Untersuchungsbereich.',
      rasterMass: 'Messpunkte entlang vermuteter Delaminations- und Hüllrohrtrassen im Abstand von 10–25 cm.',
      auswahlKriterien: [
        'Einseitig zugängliche massive Bauteile (Bodenplatten, Tunnelwände, Decken).',
        'Verdacht auf Delaminationen unter Brückenkappen und Parkhausbeschichtungen.',
        'Prüfung des Verpresszustands von Spanngliedhüllrohren.'
      ],
      statistischeBegruendung: 'Das Frequenzspektrum (FFT) liefert die Resonanzfrequenz f_p. Bei konstanter Schallgeschwindigkeit korreliert f_p mit der Dicke d = v_P / (2 · f_p). Abweichungen zeigen Fehlstellen an.'
    },
    conditioning: {
      titel: 'Schlagimpuls, Wandlerkontakt & Rauschunterdrückung',
      oberflaeche: 'Feste, ebene Betonoberfläche; lose Partikel entfernen.',
      klimaUndFeuchte: 'Trockene Oberfläche; akustischer Kontakt über piezoelektrischen Aufnehmer (trockener Kontakt oder dünner Film).',
      vorbereitungLabor: 'Auswahl des Kugelimpulsors (Stahlkugeln Ø 3 bis 12 mm je nach Prüftiefe; kleine Kugeln für oberflächennahe Auflösung, große Kugeln für tiefere Bauteile bis 1 m). Kalibrierung der P-Wellengeschwindigkeit v_P an Referenzstelle bekannter Dicke.',
      kritischeFehlerVermeidung: [
        'Zu großer Impulsorkugeldurchmesser regt keine hohen Frequenzen an (oberflächennahe Risse werden übersehen).',
        'Mehrfachanschlag (Prellen des Impulsors) erzeugt Doppelpeaks im Frequenzspektrum.',
        'Sensor muss unmittelbar neben der Einschlagstelle positioniert werden (Abstand < 50 mm).'
      ]
    },
    standards: [
      {
        code: 'ASTM C1383-15',
        title: 'Standard Test Method for Measuring the P-Wave Speed and the Thickness of Concrete Plates Using the Impact-Echo Method',
        date: '2015-05',
        url: 'https://www.astm.org/',
        scope: 'US- und weltweiter Standard für Impact-Echo.'
      },
      {
        code: 'DGZfP-Merkblatt B 11',
        title: 'Das Impact-Echo-Verfahren zur zerstörungsfreien Prüfung von Betonbauteilen',
        date: '2011-09',
        url: 'https://www.dgzfp.de/',
        scope: 'Deutsche Anwendungsrichtlinie.'
      }
    ],
    interpretation: {
      titel: 'Interpretation: FFT-Frequenzpeaks & Resonanzdicken',
      kerndiagnose: 'Ein Einzelfrequenzpeak bei Soll-Dicke zeigt ein intaktes Bauteil. Eine Frequenzverschiebung nach oben indiziert eine geringere Tiefe (Reflexion an Delamination, Riss oder Hohlraum). Fehlende Resonanz zeigt extreme Zerrüttung.',
      grenzwerte: [
        { parameter: 'Resonanzpeak f_p', wert: 'f_p = v_P / (2 · d_soll)', einheit: 'kHz', status: 'ok', bewertung: 'Intaktes Bauteil, volle Wanddicke reflektiert', massnahme: 'Keine Schäden.' },
        { parameter: 'Höherer Frequenzpeak f_p', wert: 'd_calc < 0,7 · d_soll', einheit: 'kHz', status: 'crit', bewertung: 'Innere Delamination / Trennriss in Tiefe d_calc', massnahme: 'Instandsetzungsbereich markieren, Rissverpressung.' },
        { parameter: 'Niedrige Frequenzen / Flexural Mode', wert: 'Plattenschwingung', einheit: 'kHz', status: 'crit', bewertung: 'Großflächige Hohlstelle dicht unter der Oberfläche', massnahme: 'Hohlstelle abtragen und neu reprofilieren.' }
      ],
      tragwerksAuswirkung: 'Nicht verpresste Spannkanäle gefährden die Dauerhaftigkeit der Spannglieder (Chloridkorrosion) und reduzieren den statischen Verbund.',
      instandsetzungsKonsequenz: 'Auffinden von unverpressten Spanngliedabschnitten zur gezielten Nachverpressung mit Zementsuspension.',
      praxisFallbeispiel: 'Tunnelinnenschale (Dicke 40 cm): Impact-Echo-Scan detektiert auf 15 m Länge eine Resonanzfrequenz von 10,2 kHz (entsprechend Tiefe 18 cm) statt Soll 4,8 kHz (40 cm). Kontrollbohrung bestätigt horizontalen Trennriss in 18 cm Tiefe. Nachinjektion mit Epoxidharz.'
    }
  },

  // 14. ENDOSKOPIE / VIDEOSKOPIE
  endoskopie: {
    id: 'endoskopie',
    samplingPoints: {
      titel: 'Faseroptische Endoskopie & Videoskopie (DIN 1076, WTA)',
      normVorgabe: 'DIN 1076, WTA-Merkblatt 2-9, VDI 6200',
      mindestAnzahl: 'Mind. 2–4 Bohrungen je Hohlraum / Kastenquerschnitt / zweischaligem Mauerwerk.',
      rasterMass: 'Minimalinvasive Zugangsbohrung Ø 8 bis 12 mm; Inspektionslänge flexibler Sonden bis 2–5 m.',
      auswahlKriterien: [
        'Zweischaliges Mauerwerk (Zustand der Drahtanker und Hohlschichtdämmung).',
        'Holzbalkenköpfe in geschlossenen Deckenkonstruktionen.',
        'Spannbeton-Kastenträger und nicht begehbare Hohlräume.',
        'Entwässerungsleitungen und Einbaukästen.'
      ],
      statistischeBegruendung: 'Ermöglicht die direkte visuelle Kontrolle verdeckter Bauteile ohne großflächige Zerstörung von Schalungen, Putzen oder Verkleidungen.'
    },
    conditioning: {
      titel: 'Bohrlochherstellung, Staubabsaugung & Beleuchtung',
      oberflaeche: 'Saubere Bohrung mit scharfem Stein- oder Holzbohrer setzen.',
      klimaUndFeuchte: 'Feuchtigkeitsfilm auf der Endoskoplinse vermeiden (ggf. Antibeschlagspray auf die Frontlinse auftragen).',
      vorbereitungLabor: 'Sondenkalibrierung: Weißabgleich der Videokamera; Ausleuchtung über LED-Lichtleiter prüfen; Maßstabskörper (Messspitze) an der Sondenspitze anbringen.',
      kritischeFehlerVermeidung: [
        'Bohrmehl im Bohrloch nicht ausblasen, sondern absaugen (Ausblasen verschmutzt den Hohlraum und vernebelt die Optik).',
        'Knickradien der flexiblen Glasfasersonde beachten (Bruchgefahr der Lichtleiterfasern bei R < 50 mm).',
        'Elektrische Leitungen vor dem Bohren zwingend mit Leitungsfinder ausschließen!'
      ]
    },
    standards: [
      {
        code: 'DIN 1076:2026-01',
        title: 'Ingenieurbauwerke im Zuge von Straßen und Wegen – Überwachung und Prüfung',
        date: '2026-01',
        url: 'https://www.dinmedia.de/de/suche?q=DIN+1076',
        scope: 'Prüfvorschrift für nicht begehbare Hohlräume in Brücken.'
      },
      {
        code: 'WTA-Merkblatt 2-9',
        title: 'Mauerwerksinstandsetzung – Schadensanalyse und Instandsetzungsplanung',
        date: '2019-03',
        url: 'https://www.wta-international.org/',
        scope: 'Zustandserfassung von zweischaligem Mauerwerk und Verankerungen.'
      }
    ],
    interpretation: {
      titel: 'Interpretation: Visuelle Schadensklassifikation verdeckter Zonen',
      kerndiagnose: 'Qualitative und halb-quantitative Bewertung von Korrosionsgraden, Pilzmyzelien, Rissbildungen, Dämmstoffabsackungen und Verankerungsschäden.',
      grenzwerte: [
        { parameter: 'Drahtanker zweischaliges Mauerwerk', wert: 'Rostfrei / verzinkt', einheit: '-', status: 'ok', bewertung: 'Standsicherheit der Vorsatzschale gegeben', massnahme: 'Reguläre Überwachung.' },
        { parameter: 'Drahtanker zweischaliges Mauerwerk', wert: 'Blattrost / stark korrodiert', einheit: '-', status: 'crit', bewertung: 'Verankerungsverlust! Einsturzgefahr Vorsatzschale', massnahme: 'Nachträglicher Einbau von Edelstahl-Sanierankern.' },
        { parameter: 'Holzbalkenkopf', wert: 'Myzel / Weißfäule sichtbar', einheit: '-', status: 'crit', bewertung: 'Aktiver Pilzbefall im Auflager', massnahme: 'Öffnung der Decke, Sanierung nach DIN 68800.' }
      ],
      tragwerksAuswirkung: 'Verrostete Drahtanker führen bei Winddruck- und Windsogbeanspruchung zum plötzlichen Ausknicken oder Umstürzen der äußeren Verblendschale.',
      instandsetzungsKonsequenz: 'Gezielte statische Ertüchtigung mit mechanischen oder chemischen Spiralankern ohne Zerstörung des Fassadenbildes.',
      praxisFallbeispiel: 'Schulgebäude (BJ 1972) mit Klinkerfassade: Endoskopie durch 10 mm Fugenbohrungen zeigt vollständiges Durchrosten der verzinkten Drahtanker (Drahtbruch bei Berührung mit Sonde). Sofortige Nachrüstung von 5 Edelstahl-Schraubankern je m² verhindert Absturz der Verblenderwand.'
    }
  }
};

// -------------------------------------------------------------
// Normative Stichproben- & Planungs-Presets für den interaktiven Planer
// -------------------------------------------------------------
export interface SamplingPreset {
  id: string;
  name: string;
  bauteilTyp: string;
  flaeche: number; // m²
  pruefaufgabe: string;
  empfohleneVerfahren: string[];
  mindestUmfang: {
    bohrkerne: number;
    zfpMesspunkte: number;
    bohrmehlStellen: number;
    haftzugStempel: number;
    rasterMass: string;
  };
  normativeBegruendung: string;
  konditionierungsFokus: string;
}

export const SAMPLING_PRESETS: SamplingPreset[] = [
  {
    id: 'tiefgarage',
    name: 'Tiefgarage / Parkdeck (Tausalz & Lochfraß)',
    bauteilTyp: 'Stahlbetondecke / Rampe',
    flaeche: 1000,
    pruefaufgabe: 'Chloridinduzierte Korrosion, Betondeckung & Abreißfestigkeit vor OS-Beschichtung',
    empfohleneVerfahren: ['potentialfeld', 'covermeter', 'bohrmehl', 'haftabzug', 'karbonatisierung'],
    mindestUmfang: {
      bohrkerne: 3,
      zfpMesspunkte: 250, // Potentialfeld + Covermeter
      bohrmehlStellen: 6,
      haftzugStempel: 10,
      rasterMass: '15 × 15 cm bis 25 × 25 cm'
    },
    normativeBegruendung: 'DBV-Merkblatt und DGZfP B1 fordern engmaschiges Raster zur Makroelementdetektion; DIBt TR Instandhaltung fordert Chloridprofile an mind. 5–6 Stellen.',
    konditionierungsFokus: 'Oberflächenvorbefeuchtung für Potentialmessung (R_c < 10 kΩ); absolut trockenes Bohren bei Bohrmehl; Fräsen/Strahlen vor Haftzug.'
  },
  {
    id: 'industriehalle',
    name: 'Industriehalle / Hochbau (Nutzlaststeigerung)',
    bauteilTyp: 'Stahlbetonstützen & Unterzüge',
    flaeche: 500,
    pruefaufgabe: 'In-situ-Druckfestigkeit nach DIN EN 13791 (statistisch, n ≥ 8), Karbonatisierungstiefe & Homogenität',
    empfohleneVerfahren: ['bohrkern', 'schmidthammer', 'ultraschall', 'karbonatisierung', 'covermeter'],
    mindestUmfang: {
      bohrkerne: 14, // DIN EN 13791: statistische Auswertung (n ≥ 8)
      zfpMesspunkte: 120, // Schmidt-Hammer
      bohrmehlStellen: 0,
      haftzugStempel: 0,
      rasterMass: '300 × 300 mm Prüffelder'
    },
    normativeBegruendung: 'DIN EN 13791 erlaubt die statistische Ermittlung von f_ck,is ab 8 Kernen; 14 Kerne senken k_n von 2,00 auf ca. 1,80 und verringern damit den statistischen Abzug.',
    konditionierungsFokus: 'Bohrkerne auf Schlankheit h/d = 1,0 oder 2,0 planparallel schleifen (Toleranz < 0,05 mm); 3 Tage lufttrockene Lagerung bei 20 °C vor Druckprüfung.'
  },
  {
    id: 'brueckenbauwerk',
    name: 'Spannbeton-Brückenüberbau (Zustandsanalyse)',
    bauteilTyp: 'Hohlkastenbrücke / Kappen',
    flaeche: 800,
    pruefaufgabe: 'Betondeckung nach ZTV-ING, Spanngliedortung via Georadar & Impact-Echo, Chlorid an Kappe',
    empfohleneVerfahren: ['georadar', 'impact_echo', 'covermeter', 'bohrmehl', 'endoskopie'],
    mindestUmfang: {
      bohrkerne: 4,
      zfpMesspunkte: 180,
      bohrmehlStellen: 8,
      haftzugStempel: 6,
      rasterMass: '10 × 10 cm Raster (Georadar)'
    },
    normativeBegruendung: 'ZTV-ING Teil 3 und DIN 1076 fordern zerstörungsfreie Spanngliedortung zur Vermeidung von Treffern; bei Spannstahl ist der kritische Chloridgehalt wegen Spannungsrisskorrosion gesondert und deutlich vorsichtiger zu beurteilen.',
    konditionierungsFokus: 'Metallfreie Kalibrierstrecken für Radar; Trockenbohrung für Chloride; zentrische Zugbelastung bei Haftzugstempeln.'
  },
  {
    id: 'altbau_holz',
    name: 'Historisches Fachwerk / Holzbalkendecke',
    bauteilTyp: 'Holztragwerk / Auflager',
    flaeche: 250,
    pruefaufgabe: 'Resttragfähigkeit (Bohrwiderstand), Feuchteprofil & Insekten-/Pilzbefall',
    empfohleneVerfahren: ['bohrwiderstand', 'endoskopie', 'darrmethode'],
    mindestAnzahlBohrwiderstand: 'Mind. 2 Bohrungen je Auflager',
    mindestUmfang: {
      bohrkerne: 0,
      zfpMesspunkte: 45, // Resistograph Einstiche
      bohrmehlStellen: 0,
      haftzugStempel: 0,
      rasterMass: 'Punktuell versetzt um 30–50 mm'
    },
    normativeBegruendung: 'Bohrwiderstandsmessungen mehrfach quer zur Faser ausführen (nicht genormt); DIN 68800 fordert 100%ige Sichtung und Beprobung aller feuchtegefährdeten Knoten.',
    konditionierungsFokus: 'Holzfeuchte u vorab elektrisch messen; Feuchtekorrektur des Bohrwiderstands bei u > 20 M.-%; Vermeidung von Astbereichen.'
  },
  {
    id: 'fassade_denkmal',
    name: 'Historische Putz- & Natursteinfassade',
    bauteilTyp: 'Mauerwerk & Fassadenputz',
    flaeche: 400,
    pruefaufgabe: 'Kapillare Wasseraufnahme, Salzkontamination & Verbundfestigkeit',
    empfohleneVerfahren: ['karsten', 'haftabzug', 'darrmethode', 'endoskopie'],
    mindestUmfang: {
      bohrkerne: 0,
      zfpMesspunkte: 30, // Karstensche Röhrchen
      bohrmehlStellen: 6, // Salzanalyse
      haftzugStempel: 8,
      rasterMass: 'Sockel, Mitte, Gesims (wetterseitig & wetterabgewandt)'
    },
    normativeBegruendung: 'WTA 4-5 und DIN EN 16302 fordern Beprobung in unterschiedlichen Expositionshöhen zur Differenzierung von Spritzwasser vs. Schlagregen.',
    konditionierungsFokus: 'Trockenes Wetter (24 h regenfrei); plastische Knetabdichtung ohne Leckage; schonendes Abbürsten ohne Zerstörung historischer Fassungen.'
  }
] as any[];
