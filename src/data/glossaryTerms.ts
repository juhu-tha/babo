export interface GlossaryTerm {
  term: string;
  category: 'Bindemittel' | 'Beton' | 'Mechanik' | 'Bauphysik' | 'Dauerhaftigkeit' | 'Normung' | 'Kreislaufwirtschaft';
  kurzdefinition: string;
  details: string;
  formel?: string;
  norm?: string;
  synonyme?: string[];
}

export const GLOSSARY_TERMS: Record<string, GlossaryTerm> = {
  // Bindemittel & Bauchemie
  'karbonatisierung': {
    term: 'Karbonatisierung',
    category: 'Dauerhaftigkeit',
    kurzdefinition: 'Chemische Reaktion von Calciumhydroxid mit atmosphärischem CO₂ zu Calciumcarbonat.',
    details: 'Führt zum Absinken des alkalischen pH-Werts von > 12,5 auf < 9,0, wodurch der Passivierungsschutz des Bewehrungsstahls verloren geht und Depassivierung/Rostbildung einsetzt.',
    formel: 'Ca(OH)_2 + CO_2 \\rightarrow CaCO_3 + H_2O',
    norm: 'DIN EN 206 / DIN 1045-2 (XC-Klassen)'
  },
  'kalzinieren': {
    term: 'Kalzinieren (Kalkbrennen)',
    category: 'Bindemittel',
    kurzdefinition: 'Thermische Entsäuerung von Kalkstein (CaCO₃) bei ca. 900–1100 °C zu Branntkalk (CaO).',
    details: 'Stark endothermer Prozess, bei dem pro Tonne Branntkalk rohstoffbedingt ca. 785 kg CO₂ gasförmig freigesetzt werden.',
    formel: 'CaCO_3 \\xrightarrow{\\Delta T} CaO + CO_2 \\uparrow',
    norm: 'DIN EN 459-1'
  },
  'hydratation': {
    term: 'Hydratation',
    category: 'Beton',
    kurzdefinition: 'Exotherme chemische Reaktion zwischen Zementklinker und Anmachwasser.',
    details: 'Bildet feste Calciumsilikathydrat-Phasen (C-S-H-Phasen) und Portlandit (CH), die das Porengefüge verfilzen und die Festigkeit aufbauen.',
    formel: '2 C_3S + 6 H_2O \\rightarrow C-S-H + 3 Ca(OH)_2 + \\Delta Q',
    norm: 'DIN EN 197-1'
  },
  'ettringit': {
    term: 'Ettringit (AFt-Phase)',
    category: 'Beton',
    kurzdefinition: 'Trisulfathydrat-Mineral, das primär als Erstarrungsregler wirkt.',
    details: 'Primärer Ettringit bildet sich beim Ansteifen und verhindert das Blitzansteifen von C₃A. Sekundärer, verzögerter Ettringit (DEF) bei Wärmebehandlung (> 60 °C) kann destruktives Treiben und Rissbildung verursachen.',
    formel: 'C_3A \\cdot 3 CaSO_4 \\cdot 32 H_2O',
    norm: 'DAfStb-Leitfaden'
  },
  'thixotropie': {
    term: 'Thixotropie',
    category: 'Beton',
    kurzdefinition: 'Strukturviskoses Fließverhalten: Viskosität sinkt unter Scherbelastung und regeneriert im Ruhezustand.',
    details: 'Ermöglicht bei Frischbeton und Mörteln leichtes Pumpen und Rütteln, während das Gemisch nach Beendigung der Schwingung rasch standfest wird und Schalungsdrücke reduziert.',
    norm: 'DIN EN 12350'
  },
  'bluten': {
    term: 'Bluten (Bleeding)',
    category: 'Beton',
    kurzdefinition: 'Entmischungsvorgang, bei dem Anmachwasser durch Sedimentation der Gesteinskörner an die Oberfläche steigt.',
    details: 'Führt zu unzureichendem Zusammenhaltevermögen, erhöhter Kapillarporosität in der oberflächennahen Randschicht und Hohlräumen unter horizontalen Bewehrungsstäben.',
    formel: 'k = \\frac{w - 70}{mk} \\le 0{,}30',
    norm: 'DIN 1045-2 / DBV-Merkblatt'
  },
  'wasserzementwert': {
    term: 'Wasserzementwert (w/z-Wert)',
    category: 'Beton',
    kurzdefinition: 'Massenverhältnis des wirksamen Wassergehalts zum Zementgehalt in der Betonmischung.',
    details: 'Der entscheidende Parameter für Kapillarporosität, Festigkeit und Dichtigkeit. Für vollständige Hydratation sind stöchiometrisch ca. 0,25 nötig, zzgl. 0,15 Gelwasser (Walz-Formel).',
    formel: 'w/z = \\frac{w}{z} \\quad [-]',
    norm: 'DIN EN 206 / DIN 1045-2'
  },
  'krell_tabelle': {
    term: 'Krell-Tabelle',
    category: 'Normung',
    kurzdefinition: 'Systematische Verknüpfung der Expositionsklassen mit den betontechnologischen Grenzwerten.',
    details: 'Definiert für XC, XD, XS, XF, XA und XM den maximal zulässigen w/z-Wert, die Mindestdruckfestigkeit, Mindestzementgehalte und empfohlene Mindestbetondeckungen c_min.',
    norm: 'DIN 1045-2 Tabelle F.2.1 / F.2.2'
  },
  'kriechen': {
    term: 'Kriechen',
    category: 'Mechanik',
    kurzdefinition: 'Zeitabhängige, irreversible Verformungszunahme eines Bauteils unter konstanter Dauerlast.',
    details: 'Verursacht durch Umlagerungen im C-S-H-Gefüge und Porenwasserverschiebung. Wird quantifiziert über die Kriechzahl φ(t, t₀) nach Eurocode 2.',
    formel: '\\varepsilon_{cc}(t, t_0) = \\frac{\\sigma_c}{E_c} \\cdot \\varphi(t, t_0)',
    norm: 'DIN EN 1992-1-1'
  },
  'schwinden': {
    term: 'Schwinden',
    category: 'Mechanik',
    kurzdefinition: 'Volumenverringerung des Betons durch Feuchtigkeitsabgabe unabhängig von äußerer mechanischer Last.',
    details: 'Unterteilt sich in autogenes Schwinden (chemische Kontraktion) und Trocknungsschwinden (Verdampfung von Kapillarwasser). Hauptursache für Zwangsrissbildung.',
    formel: '\\varepsilon_{cs} = \\varepsilon_{cd} + \\varepsilon_{ca}',
    norm: 'DIN EN 1992-1-1'
  },
  'betondeckung': {
    term: 'Betondeckung (c_nom)',
    category: 'Dauerhaftigkeit',
    kurzdefinition: 'Dicke der Betonüberdeckung über dem äußersten Bewehrungsstahl.',
    details: 'Schützt den Bewehrungsstahl vor Korrosion (Passivierungserhalt) und sichert den Verbund sowie den Feuerwiderstand. c_nom = c_min + Δc_dev.',
    formel: 'c_{\\text{nom}} = c_{\\min} + \\Delta c_{\\text{dev}} \\quad [\\text{mm}]',
    norm: 'DIN EN 1992-1-1 / DIN 1045-2'
  },
  'passivschicht': {
    term: 'Passivschicht',
    category: 'Dauerhaftigkeit',
    kurzdefinition: 'Mikroskopisch dünne Eisenoxid-/Hydroxidschicht auf Bewehrungsstahl im alkalischen Milieu (pH > 12,5).',
    details: 'Verhindert den anodischen Eisenabtrag. Wird durch Karbonatisierung (pH < 9,0) oder durch kritischen Chloridgehalt (Cl⁻ > 0,40 Gew.-% bez. auf Zement) zerstört.',
    norm: 'DIN EN 1504 / DAfStb'
  },
  'akr': {
    term: 'Alkali-Kieselsäure-Reaktion (AKR)',
    category: 'Dauerhaftigkeit',
    kurzdefinition: 'Reaktion alkalischer Porenlösung mit amorpher/kristalliner Kieselsäure der Gesteinskörnung („Betonkrebs“).',
    details: 'Bildet quellfähiges Alkali-Kiesel-Gel, das bei Wasserzutritt enorme Sprengdrücke (> 10 MPa) aufbaut und netzartige Netzrissmuster an Autobahnbelägen und Brücken hervorruft.',
    norm: 'DAfStb Alkali-Richtlinie / Feuchtigkeitsklassen WO, WF, WA, WS'
  },
  'zirkulaeritaet': {
    term: 'Zirkularitätsindex / R-Beton',
    category: 'Kreislaufwirtschaft',
    kurzdefinition: 'Maß für die Rückführung von aufbereiteten mineralischen Abbruchstoffen in den Stoffkreislauf.',
    details: 'Geregelt nach DIN EN 206 / DIN 1045-2 für Typ-1 (Betonsplitt) und Typ-2 (Mischabbruch) sowie der Bundes-Ersatzbaustoffverordnung (EBV).',
    norm: 'DIN SPEC 91525 / DIN EN 12620 / EBV'
  }
};
