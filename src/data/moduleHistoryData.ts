export interface HistoryMilestone {
  era: string;
  title: string;
  category: 'Normung' | 'Technologie' | 'Paradigmenwechsel' | 'Recht & Regularien' | 'Werkstoffwende' | 'Sicherheit';
  description: string;
  impact: string;
  keyReference?: string;
}

export interface GroupHistory {
  groupKey: string;
  title: string;
  leadSummary: string;
  milestones: HistoryMilestone[];
  keyTakeaway: string;
}

export const MODULE_HISTORY_DATA: Record<string, GroupHistory> = {
  grundlagen: {
    groupKey: 'grundlagen',
    title: 'Bauingenieur-Grundlagen',
    leadSummary: 'Die Entwicklung des Bauingenieurwesens vollzog sich von empirischen Handwerksregeln der Antike über die mathematisch-physikalische Grundlegung der Mechanik in der Aufklärung bis hin zum modernen, semiprobabilistischen Sicherheitskonzept der Eurocodes.',
    milestones: [
      {
        era: 'Antike & Renaissance (ca. 25 v. Chr. – 1600)',
        title: 'Empirische Baukunst & Vitruvianische Trias',
        category: 'Paradigmenwechsel',
        description: 'Vitruv formuliert mit Firmitas (Festigkeit), Utilitas (Zweckmäßigkeit) und Venustas (Schönheit) die Grundpfeiler des Bauens. Tragstrukturen basieren auf geometrischen Proportionen, Erfahrungswerten und empirischer Musterbemessung ohne formale Spannungsberechnung.',
        impact: 'Grundlegung des ingenieurmäßigen Baugedankens; monumentale Gewölbebauten (Pantheon, Kuppeln) als geometrische Meisterleistungen.',
        keyReference: 'Vitruv: De architectura libri decem'
      },
      {
        era: '17. & 18. Jahrhundert',
        title: 'Begründung der Elastizitätstheorie und Balkenmechanik',
        category: 'Technologie',
        description: 'Robert Hooke formuliert 1678 das lineare Elastizitätsgesetz (Ut tensio, sic vis: σ = E · ε). Leonhard Euler und Daniel Bernoulli entwickeln um 1750 die klassische Balkentheorie für elastische Biegelinien.',
        impact: 'Kräfte und elastische Verformungen werden erstmals mathematisch exakt berechenbar, was den Bau weitgespannter Holz- und erster Eisenbrücken ermöglicht.',
        keyReference: 'Hooke (1678), Euler-Bernoulli (1750)'
      },
      {
        era: '1875 / 1960',
        title: 'Internationale Vereinheitlichung der Maßeinheiten (SI)',
        category: 'Normung',
        description: 'Mit der Meterkonvention 1875 und der Verabschiedung des Internationalen Einheitensystems (SI) auf der 11. CGPM 1960 werden die inkonsistenten historischen Maßsysteme (Zoll, Fuß, Kilopond kp/cm²) durch das Basissystem (m, kg, s, N, Pa) abgelöst.',
        impact: 'Vollständige internationale Vergleichbarkeit aller Materialprüfungen, Spannungen (N/mm² = MPa) und Festigkeitsnachweise.',
        keyReference: 'DIN EN ISO 80000-1 / CGPM 1960'
      },
      {
        era: '1970er–1990er Jahre',
        title: 'Vom deterministischen zum semiprobabilistischen Sicherheitskonzept',
        category: 'Sicherheit',
        description: 'Ablösung des alten Konzepts der „zulässigen Spannungen“ (Globaler Sicherheitsbeiwert ν ≈ 1,75 bis 2,1) durch das getrennte Teilsicherheitskonzept auf Basis probabilistischer Grenzzustände (GZT/GZG).',
        impact: 'Sicherheit wird nun realitätsnah auf Einwirkungsseite (γ_F > 1,0 für Eigengewicht und Nutzlasten) und Widerstandsseite (γ_M > 1,0 für Materialstreuungen) getrennt nachgewiesen: E_d ≤ R_d.',
        keyReference: 'DIN EN 1990 (Eurocode 0) / ISO 2394'
      },
      {
        era: '2020er–heute (2024–2026)',
        title: 'Second Generation Eurocodes & Klimaresilienz',
        category: 'Normung',
        description: 'Umfassende Neuausgabe der Eurocodes (Eurocode Generation 2). Integration harmonisierter Regeln zur Wiederverwendung bestehender Bauteile, Bemessung unter extremen Klimawandellasten (Wind, Starkregen, Schnee) und ressourceneffiziente Grenzwertdefinitionen.',
        impact: 'Planungsingenieure bilanzieren Bestandsreserven rechtssicher und planen für eine veränderte klimatische Belastungssituation.',
        keyReference: 'CEN/TC 250 Mandate M/515'
      }
    ],
    keyTakeaway: 'Die Bauingenieur-Grundlagen transformierten sich von bloßer Geometrie und Handwerkstradition zu einer formal mathematisch abgesicherten Grenzzustands-Wissenschaft mit probabilistischer Risikokontrolle.'
  },

  labor: {
    groupKey: 'labor',
    title: 'Labor, Sensorik & Analytik',
    leadSummary: 'Vom destruktiven Großversuch im späten 19. Jahrhundert entwickelte sich die Baustoffprüfung über normierte Laborprüfmaschinen und statistische Güteüberwachung hin zur modernen, nanostrukturellen In-situ-Diagnostik und KI-unterstützten Sensorüberwachung.',
    milestones: [
      {
        era: '1880–1900',
        title: 'Gründung der ersten Materialprüfungsanstalten (MPA)',
        category: 'Technologie',
        description: 'Johann Bauschinger (München) und Adolf Martens (Berlin) begründen die systematische Baustoffprüfung. Gründung staatlicher Prüfanstalten zur Verhinderung katastrophaler Baustoffversagen bei Brücken- und Kesselexplosionen.',
        impact: 'Einführung genormter Prüfkörper, standardisierter Zug- und Druckprüfmaschinen und erster einheitlicher Prüfzeugnisse.',
        keyReference: 'MPA-Gründungserlasse / Bauschinger-Spiegelfeinzeiger'
      },
      {
        era: '1948',
        title: 'Erfindung des Rückprallhammers (Ernst Schmidt)',
        category: 'Technologie',
        description: 'Der Schweizer Ingenieur Ernst Schmidt entwickelt das erste praxistaugliche, handliche Prüfgerät zur zerstörungsfreien Bestimmung der Oberflächenhärte und Abschätzung der Betondruckfestigkeit am Bauwerk.',
        impact: 'Zerstörungsfreie Prüfung (ZfP) wird zum Standard für Bauwerksbegutachtungen vor Ort, ohne tragende Querschnitte zu beschädigen.',
        keyReference: 'DIN EN 12504-2 / Schmidt-Hammer'
      },
      {
        era: '1970er–1980er Jahre',
        title: 'Einzug der Mikroanalytik: REM-EDX und Röntgendiffraktometrie (XRD)',
        category: 'Paradigmenwechsel',
        description: 'Etablierung elektronenmikroskopischer und kristallographischer Analysen für zementgebundene Baustoffe. Exakte Identifikation schadensrelevanter Phasen wie Ettringit, Thaumasit, Friedelschem Salz oder Alkalikieselsäure-Gelen (AKR).',
        impact: 'Schadensursachen werden nicht mehr nur makroskopisch vermutet, sondern auf Kristallgitterebene gerichtsfest bewiesen.',
        keyReference: 'Forschungsinstitut der Zementindustrie (VDZ)'
      },
      {
        era: '2000er Jahre',
        title: 'Normative Verankerung statistischer Konformitätskontrollen',
        category: 'Normung',
        description: 'Mit DIN EN 206 und DIN ISO 12491 wird die Qualitätsbeurteilung von Beton- und Baustoffserien verbindlich an Normalverteilungs-Statistik gekoppelt (5%-Quantilwert f_ck = f_cm - 1,64 · s).',
        impact: 'Abschied von willkürlichen Mittelwerten: Statistische Ausreißertests, gleitende Standardabweichungen und Güteklassen werden Pflicht in Werks- und Baustellenlaboren.',
        keyReference: 'DIN EN 206 / DIN ISO 12491'
      },
      {
        era: '2020er–heute (2024–2026)',
        title: 'Faseroptik, In-situ-Sensorik & KI-gestützte Bauwerksdiagnostik',
        category: 'Technologie',
        description: 'Einbetonierte faseroptische Sensoren (FOS) erfassen Dehnungen und Temperaturprofile kontinuierlich über Kilometerlängen. Drohnengestützte Bildverarbeitung lokalisiert Risse submillimetergenau und überführt Schadensmuster automatisiert in BIM-Modelle.',
        impact: 'Kontinuierliches Structural Health Monitoring (SHM) ersetzt rein stichprobenartige turnusmäßige Bauwerksprüfungen.',
        keyReference: 'RILEM TC 280-CBM / VDI 4551'
      }
    ],
    keyTakeaway: 'Die Labor- und Prüftechnik wandelte sich von der reinen Zerstörung von Probekörpern hin zu mikroskopischer Forensik und kontinuierlicher, zerstörungsfreier Sensorüberwachung von Bauwerken im Betrieb.'
  },

  baustoffe: {
    groupKey: 'baustoffe',
    title: 'Baustoffkunde im Detail',
    leadSummary: 'Vom antiken Opus Caementitium über die Erfindung des Portlandzements und die Erforschung metallischer Gefüge bis hin zu biobasierten und CO2-negativen Hochleistungswerkstoffen vollzog die Werkstoffkunde eine fundamentale Evolution.',
    milestones: [
      {
        era: 'Antike (1. Jh. v. Chr. – 2. Jh. n. Chr.)',
        title: 'Römisches Opus Caementitium & Puzzolankalke',
        category: 'Technologie',
        description: 'Römer nutzen Kalkmörtel unter Zusatz vulkanischer Asche (Pulvis Puteolanus aus Pozzuoli) zur Erzielung hydraulischer Reaktionen. Meisterwerke wie das Pantheon (Kuppeldurchmesser 43,3 m) entstehen mit abgestuften Gesteinsdichten.',
        impact: 'Erster hydraulischer Kunststein der Menschheitsgeschichte mit jahrtausendelanger Dauerhaftigkeit unter Wasser.',
        keyReference: 'Opus Caementitium / Vitruv'
      },
      {
        era: '1824',
        title: 'Erfindung des Portlandzements (Joseph Aspdin)',
        category: 'Werkstoffwende',
        description: 'Der britische Maurer Joseph Aspdin brennt kohlensauren Kalk mit fein gemahlenem Ton bei Sintertemperatur und patentiert 1824 den „Portland Cement“, dessen Farbe an den Werkstein von der Halbinsel Portland erinnert.',
        impact: 'Geburtsstunde des modernen Industrie-Bindemittels mit standardisierbaren Erhärtungszeiten und extrem hohen Druckfestigkeiten.',
        keyReference: 'Brit. Patent Nr. 5022 (1824)'
      },
      {
        era: '19. & 20. Jahrhundert',
        title: 'Aufstieg der Baustähle & Eisen-Kohlenstoff-Metallurgie',
        category: 'Technologie',
        description: 'Entwicklung der Massenstahlverfahren (Bessemer 1856, Siemens-Martin, Thomas-Verfahren). Das Eisen-Kohlenstoff-Diagramm und Phasenumwandlungen (Ferrit, Perlit, Austenit, Martensit) machen Festigkeit und Duktilität von Stählen gezielt steuerbar.',
        impact: 'Ermöglichung des Hochhaus-, Brücken- und Industriehallenbaus mit reproduzierbaren Festigkeiten (S235 bis S960) und hoher Kerbschlagarbeit.',
        keyReference: 'DIN EN 10025 / Martens & Osmond'
      },
      {
        era: '1952',
        title: 'Floatglas-Verfahren revolutioniert die Glasbautechnik',
        category: 'Technologie',
        description: 'Sir Alastair Pilkington erfindet das kontinuierliche Aufschwimmen von flüssigem Glas auf einem Zinnbad. Das Verfahren liefert planparallele, fehlerfreie Flachglasscheiben ohne Schleif- und Polieraufwand.',
        impact: 'Grundlage für die moderne transparente Architektur, Isolierverglasungen, Einscheiben- (ESG) und Verbundsicherheitsgläser (VSG).',
        keyReference: 'Pilkington-Patent / DIN 18008'
      },
      {
        era: '2020er–heute (2024–2026)',
        title: 'Zirkuläre & biobasierte Werkstoffwende (Lehm, Holz, LC3)',
        category: 'Werkstoffwende',
        description: 'Normierung des Lehmbaus (DIN 18945–18948), Durchbruch klinkerarmer Calcinierter Ton-Zemente (LC3) und Entwicklung kreislauffähiger Verbundbaustoffe. Radikale Senkung des „Embodied Carbon“ (graue Energie) im Rohbau.',
        impact: 'Baustoffauswahl erfolgt heute nicht mehr isoliert nach Festigkeit, sondern primär nach Ökobilanzwerten (GWP in kg CO2-Äq.) und Sortenreinheit beim Rückbau.',
        keyReference: 'DIN EN 15804 / DIN 18945'
      }
    ],
    keyTakeaway: 'Die Werkstoffkunde wandelte sich vom Streben nach rein maximaler Druck- und Zugfestigkeit zur Entwicklung ressourceneffizienter, kreislaufgerechter und emissionsarmer Hochleistungsmaterialien.'
  },

  bauprodukte: {
    groupKey: 'bauprodukte',
    title: 'Bauprodukte & Regulatives',
    leadSummary: 'Vom Schutz des lokalen Bauherrn durch erste preußische Baupolizeiverordnungen hin zum harmonisierten europäischen Binnenmarkt mit CE-Kennzeichnung, Leistungserklärung und dem neuen digitalen Produktpass nach EU-BauPVO 2024.',
    milestones: [
      {
        era: '1917 / 1920er',
        title: 'Gründung des Normenausschusses (DIN) & Bauregellisten',
        category: 'Normung',
        description: 'Gründung des Normenausschusses der Deutschen Industrie (1917). Etablierung nationaler DIN-Normen und staatlicher Prüfzeugnisse zur Vermeidung von Pfusch am Bau und Standardisierung von Ziegel- und Mörtelformaten.',
        impact: 'Verlässliche Mindestanforderungen an Baustoffqualitäten, Toleranzen und Sicherheitsabstände im deutschen Baurecht.',
        keyReference: 'DIN 1 / DIBt-Vorläufer'
      },
      {
        era: '1989',
        title: 'Europäische Bauproduktenrichtlinie (BPR 89/106/EWG)',
        category: 'Recht & Regularien',
        description: 'Die Europäische Gemeinschaft beschließt die Harmonisierung der technischen Bauanforderungen im Binnenmarkt. Einführung der 6 wesentlichen Anforderungen an Bauwerke (später 7 Grundanforderungen) und der CE-Kennzeichnung.',
        impact: 'Abbau nationaler Handelshemmnisse; Baustoffe mit harmonisierten europäischen Normen (hEN) dürfen frei im Binnenmarkt gehandelt werden.',
        keyReference: 'Richtlinie 89/106/EWG'
      },
      {
        era: '2011 / 2013',
        title: 'EU-Bauproduktenverordnung (EU-BauPVO Nr. 305/2011)',
        category: 'Recht & Regularien',
        description: 'Vollständige Rechtsverbindlichkeit ohne nationale Umsetzungsgesetze. Einführung der obligatorischen Leistungserklärung (DoP – Declaration of Performance) und Festlegung der Konformitätsnachweissysteme (AVCP 1+ bis 4).',
        impact: 'Klare Haftungsverteilung: Hersteller bürgen juristisch für die deklarierten Leistungswerte ihrer Bauprodukte.',
        keyReference: 'EU-Verordnung Nr. 305/2011'
      },
      {
        era: '2014 / 2017',
        title: 'EuGH-Urteil (Rs. C-100/13) & Verwaltungsvorschrift Technische Baubestimmungen (VV TB)',
        category: 'Recht & Regularien',
        description: 'Der Europäische Gerichtshof untersagt Deutschland zusätzliche nationale Zulassungen (Ü-Zeichen) für bereits CE-gekennzeichnete Bauprodukte. Deutschland strukturiert das Bauordnungsrecht grundlegend um und führt die Muster-VV TB ein.',
        impact: 'Klare Trennung: Die EU regelt das Inverkehrbringen von Bauprodukten, die Bundesländer regeln die sichere Verwendung im fertigen Bauwerk über die VV TB.',
        keyReference: 'EuGH Rs. C-100/13 / MVV TB'
      },
      {
        era: '2024–2026',
        title: 'Neufassung der EU-BauPVO (CPR 2024) & Digitaler Produktpass (DPP)',
        category: 'Normung',
        description: 'Revision der Bauproduktenverordnung mit verbindlicher Berücksichtigung ökologischer Nachhaltigkeit (Treibhauspotenzial GWP), verpflichtenden Rezyklat-Mindestanteilen und Einführung des maschinenlesbaren Digitalen Produktpasses (DPP per QR-Code).',
        impact: 'Lückenlose Rückverfolgbarkeit aller Baustoffe über den gesamten Lebenszyklus und rechtsverbindliche Grüne Beschaffung.',
        keyReference: 'CPR-Revision 2024 / ESPR 2024'
      }
    ],
    keyTakeaway: 'Das Bauproduktenrecht entwickelte sich von regionalen Schutzvorschriften zum volldigitalisierten europäischen Marktregime, in dem Umweltleistung und Nachverfolgbarkeit denselben Rang wie mechanische Festigkeit einnehmen.'
  },

  beton: {
    groupKey: 'beton',
    title: 'Betontechnologie',
    leadSummary: 'Vom unbewehrten Stampfbeton des 19. Jahrhunderts über die Entdeckung des Wasserzementwerts und chemischer Hochleistungsfließmittel bis hin zu klinkereffizienten Öko-Betonen und der leistungsorientierten Dauerhaftigkeitsbemessung (Performance Concept).',
    milestones: [
      {
        era: '1918',
        title: 'Abrams\' Gesetz: Das Wasserzementwert-Prinzip',
        category: 'Paradigmenwechsel',
        description: 'Duff A. Abrams entdeckt am Lewis Institute in Chicago das fundamentale Gesetz der Betontechnologie: Die Druckfestigkeit hängt maßgeblich vom Verhältnis der Masse des Anmachwassers zur Masse des Zements ab: f_c = A / B^(w/z).',
        impact: 'Ende des willkürlichen „Nassanrührens“ auf Baustellen; wissenschaftliche Steuerung von Zementsteinporosität und Festigkeit.',
        keyReference: 'Duff Abrams (1918) Bulletin 1'
      },
      {
        era: '1930er–1950er Jahre',
        title: 'Transportbeton & Erfindung von Luftporenbildnern (LP)',
        category: 'Technologie',
        description: 'Entstehung moderner Transportbetonwerke mit Fahrmischern. In den USA wird die Frost-Tausalz-Widerstandsfähigkeit durch Mikroluftporen (LP-Mittel) entdeckt, die dem gefrierenden Porenwasser Expansionsräume bieten.',
        impact: 'Sicherer Bau von Autobahnen, Brücken und Infrastrukturbauten in frostgefährdeten Zonen ohne Frostabplatzungen.',
        keyReference: 'ASTM C260 / Powers-Theorie'
      },
      {
        era: '1980er–1990er Jahre',
        title: 'Polycarboxylatether (PCE) & Selbstverdichtender Beton (SVB)',
        category: 'Technologie',
        description: 'Hajime Okamura (Universität Tokio) entwickelt 1988 den selbstverdichtenden Beton (SCC / SVB). Zeitgleich revolutionieren Fließmittel der 3. Generation (PCE mit sterischer Hinderung) die Rheologie: Höchste Fließfähigkeit bei extrem niedrigem w/z-Wert (< 0,35).',
        impact: 'Ermöglichung sichtbarer Architekturbetone, hochbewehrter Bauteile ohne Rüttelenergie und Entstehung ultrahochfester Betone (UHPC mit Festigkeiten > 150 N/mm²).',
        keyReference: 'Okamura & Ouchi (2003) / DIN EN 206-9'
      },
      {
        era: '2001',
        title: 'Einführung DIN EN 206-1 / DIN 1045-2: Expositionsklassen-Konzept',
        category: 'Normung',
        description: 'Paradigmenwechsel in der Normung: Beton wird nicht mehr primär nach B-Klassen (z. B. B 25) bestellt, sondern nach Umwelteinwirkungen (Expositionsklassen XC, XD, XS, XF, XA, XM) mit normativen Grenzwerten für max. w/z, Mindestzement und Mindestdruckfestigkeit.',
        impact: 'Verbindliche Verknüpfung der Rezeptur mit der geplanten Nutzungsdauer (in der Regel 50 Jahre) des Bauteils.',
        keyReference: 'DIN EN 206-1:2001 / DIN 1045-2'
      },
      {
        era: '2023–2026',
        title: 'Dekarbonisierung: CEM II/C-M, CEM VI, LC3 & Neue DIN 1045',
        category: 'Werkstoffwende',
        description: 'Neufassung von DIN EN 197-5 (klinkereffiziente Mehrstoffzemente CEM II/C-M mit bis zu 50 % Klinkerersatz durch Kalkstein und Hüttensand) sowie Einführung der Neuausgabe DIN 1045 (2023/2024). Verankerung des Performance-Konzepts (gleichwertige Dauerhaftigkeit).',
        impact: 'Drastische Senkung des CO2-Fußabdrucks von Beton um bis zu 40–50 % ohne Einbußen bei Festigkeit und Beständigkeit.',
        keyReference: 'DIN EN 197-5 / DIN 1045-2:2023'
      }
    ],
    keyTakeaway: 'Die Betontechnologie vollzog den Wandel vom reinen Festigkeitsbaustoff zu einem hochgradig maßgeschneiderten, rheologisch kontrollierten und heute dekarbonisierten Verbundsystem.'
  },

  stahlbeton: {
    groupKey: 'stahlbeton',
    title: 'Massivbau & Stahlbeton',
    leadSummary: 'Vom Patent Moniers auf Drahtgeflecht-Blumentöpfe über die bahnbrechende Spannbetontechnik Freyssinets und Leonhardts bis hin zum Eurocode 2 und dem modernen, korrosionsfreien Carbon- und Textilbeton.',
    milestones: [
      {
        era: '1867 / 1892',
        title: 'Monier-Patent & Hennebique-System',
        category: 'Technologie',
        description: 'Der Gärtner Joseph Monier patentiert 1867 Eisenbewehrung in Betonkübeln. François Hennebique erfindet 1892 die Bügelbewehrung zur Aufnahme von Schubspannungen und das monolithische T-Balkensystem (Plattenbalken).',
        impact: 'Das ideale Zusammenwirken von hohem Druckwiderstand des Betons und hoher Zugfestigkeit des Stahls bei nahezu identischem Wärmeausdehnungskoeffizienten (α ≈ 10^-5 1/K) begründet den Massivbau.',
        keyReference: 'Monier (1867) / Hennebique (1892)'
      },
      {
        era: '1904 / 1907',
        title: 'Emil Mörsch: Die Fachwerkanalogie für Querkraft',
        category: 'Paradigmenwechsel',
        description: 'Emil Mörsch begründet an der TH Stuttgart mit seinem Grundlagenwerk „Der Eisenbetonbau“ die wissenschaftliche Bemessung. Er führt das Sprengwerk- bzw. Fachwerkanalogiemodell mit Druckstreben und Zugbändern für Schubspannungen ein.',
        impact: 'Bis heute das universelle Rechenmodell für Querkraft- und Torsionsnachweise im Stahlbetonbau nach Eurocode 2.',
        keyReference: 'Mörsch: Der Eisenbetonbau (1902/1908)'
      },
      {
        era: '1928 / 1950er',
        title: 'Eugène Freyssinet & Fritz Leonhardt: Der Spannbeton-Durchbruch',
        category: 'Technologie',
        description: 'Eugène Freyssinet erkennt 1928, dass Kriechen und Schwinden die Vorspannung zunichte machen, wenn kein hochfester Vergütungsstahl verwendet wird. Fritz Leonhardt perfektioniert die Spannbetontechnik (Spannverfahren Baur-Leonhardt) in Deutschland.',
        impact: 'Ermöglichung schlankester, rissfreier Weitspannbrücken, Hallenbinder und Decken durch gezielten Eintrag einer Drucküberdrückung.',
        keyReference: 'Freyssinet-Patent (1928) / DIN 4227'
      },
      {
        era: '2001 / 2011',
        title: 'Harmonisierung: Von DIN 1045 zu DIN EN 1992-1-1 (Eurocode 2)',
        category: 'Normung',
        description: 'Ablösung des n-Verfahrens durch die nichtlineare Grenzzustandsbemessung (GZT mit Parabel-Rechteck-Diagramm für Beton) und detaillierte Nachweise der Rissbreitenbeschränkung (GZG, w_k ≤ 0,2–0,4 mm) zur Sicherung der Dauerhaftigkeit.',
        impact: 'Einheitlicher europäischer Berechnungsrahmen für unbewehrten, schlaff bewehrten und vorgespannten Beton.',
        keyReference: 'DIN EN 1992-1-1:2011 (Eurocode 2)'
      },
      {
        era: '2015–heute (2024–2026)',
        title: 'Carbonbeton (C3) & Bewehrungseffizienz',
        category: 'Werkstoffwende',
        description: 'Erforschung und Markteinführung von Carbonbeton (Projekt C3 – Carbon Concrete Composite, TU Dresden). Nichtkorrodierende Carbon- und Basaltgelege erfordern keine schützende 40–50 mm dicke Betondeckung mehr.',
        impact: 'Materialeinsparungen von bis zu 50 % Betonvolumen; Erstellung extrem schlanker, langlebiger Schalentragwerke und Brückensanierungen.',
        keyReference: 'Allgemeine Bauartgenehmigung (aBG) Carbonbeton'
      }
    ],
    keyTakeaway: 'Vom intuitiv eingelegten Eisendraht entwickelte sich der Massivbau zu einer hochentwickelten Verbundwerkstoffdisziplin mit gezielter Rissweiten- und Verformungssteuerung sowie zukunftsweisenden Carbongelegen.'
  },

  holzbau: {
    groupKey: 'holzbau',
    title: 'Holzbau (Ingenieurholzbau)',
    leadSummary: 'Vom zimmermannsmäßigen Fachwerk über das Hetzer-Brettschichtholz und die Erfindung von Brettsperrholz (CLT) bis hin zu Hochhäusern in Holz-Hybridbauweise und der neuen Muster-Holzbaurichtlinie (MHolzBauR 2024).',
    milestones: [
      {
        era: 'Mittelalter bis 19. Jahrhundert',
        title: 'Zimmermannsmäßige Holzverbindungen & Tragwerke',
        category: 'Paradigmenwechsel',
        description: 'Holzbau wird rein handwerklich durch formschlüssige Holz-Holz-Verbindungen (Verblattungen, Verzapfungen, Schwalbenschwanz, Holznägel) geprägt. Dachwerke und Hallen sind durch die Wuchsdimension natürlicher Rundhölzer geometrisch begrenzt.',
        impact: 'Hunderte Jahre alte Fachwerk- und Dachstuhlbauten beweisen die außerordentliche Dauerhaftigkeit bei konstruktivem Holzschutz.',
        keyReference: 'Historische Zimmermannskunst'
      },
      {
        era: '1906',
        title: 'Otto Hetzer patentiert das Brettschichtholz (Hetzer-Träger)',
        category: 'Technologie',
        description: 'Der Weimarer Zimmermeister Otto Hetzer erhält das Reichspatent Nr. 197773 auf gebogene, verleimte Brettschichtträger aus einzelnen Brettlamellen unter Verwendung von Kaseinleimen.',
        impact: 'Geburtsstunde des modernen Ingenieurholzbaus: Überwindung natürlicher Baumgrenzen; stützenfreie Hallenspannweiten von über 50 m werden realisierbar.',
        keyReference: 'Deutsches Reichspatent Nr. 197773'
      },
      {
        era: '1990er Jahre',
        title: 'Erfindung von Brettsperrholz (BSP / CLT – Cross Laminated Timber)',
        category: 'Technologie',
        description: 'Entwicklung kreuzweise verleimter Massivholzplatten an der TU Graz und in Deutschland. Durch die kreuzweise Orientierung werden Schwind- und Quellmaße in Plattenebene auf ein Minimum reduziert.',
        impact: 'Holz wird zu einem flächigen, tragenden Wandscheiben- und Deckenbaustoff mit hoher Scheiben- und Plattensteifigkeit für mehrgeschossige Gebäude.',
        keyReference: 'DIN EN 16351 / TU Graz'
      },
      {
        era: '2004 / 2012',
        title: 'Semiprobabilistischer Eurocode 5 (DIN EN 1995-1-1)',
        category: 'Normung',
        description: 'Einführung des Grenzzustandskonzepts im Holzbau. Berücksichtigung von Feuchte- und Temperatureinflüssen über Nutzungsklassen (NKL 1 bis 3) und Lasteinwirkungsdauern über den Modifikationsbeiwert k_mod.',
        impact: 'Gleiche probabilistische Sicherheitsstandards wie im Stahl- und Massivbau; exakte Bemessung moderner Verbindungsmittel (Vollgewindeschrauben, Stabdübel).',
        keyReference: 'DIN EN 1995-1-1 (Eurocode 5)'
      },
      {
        era: '2020er–heute (2024–2026)',
        title: 'Mehrgeschossiger Holzbau, MHolzBauR 2024 & Holz-Hochhäuser',
        category: 'Recht & Regularien',
        description: 'Neufassung der Muster-Holzbaurichtlinie (MHolzBauR 2024) erleichtert die Planung in den Gebäudeklassen 4 und 5 (bis zur Hochhausgrenze). Realisierung von Gebäuden wie „Roots“ in Hamburg (65 m) oder „HoHo Wien“ (84 m).',
        impact: 'Konstruktiver Brandschutz durch Kapselung und planmäßigen Restquerschnittabbrand (d_char,0) etabliert Holz als gleichwertige Alternative im urbanen Geschoßbau.',
        keyReference: 'MHolzBauR 2024 / DIN EN 1995-1-2'
      }
    ],
    keyTakeaway: 'Der Holzbau wandelte sich vom zimmermannsmäßigen Handwerk zu einer hochpräzisen, digital vorgefertigten Ingenieurdisziplin, die den Hochhausbau als CO2-Speicher maßgeblich prägt.'
  },

  mechanik: {
    groupKey: 'mechanik',
    title: 'Technische Mechanik & Statik',
    leadSummary: 'Von den Gleichgewichtsaxiomen Newtons und den Schnittprinzipien Eulers über die Mohrsche Kreislehre bis hin zu Energiemethoden, plastischer Grenzwerttheorie und der Finite-Elemente-Methode (FEM).',
    milestones: [
      {
        era: '1687 / 1750',
        title: 'Newtonsche Axiome & Eulers Schnittprinzip',
        category: 'Paradigmenwechsel',
        description: 'Isaac Newton formuliert die Bewegungsgesetze und das Reaktionsprinzip (Actio = Reactio). Leonhard Euler begründet das Schnittprinzip: Durch das gedankliche Freischneiden von Körpern werden innere Kräfte (Schnittgrößen N, V, M) berechenbar.',
        impact: 'Grundlegendes Fundament aller Tragwerksberechnungen bis zum heutigen Tag.',
        keyReference: 'Newton: Philosophiae Naturalis Principia Mathematica'
      },
      {
        era: '1826 / 1850er',
        title: 'Navier & Saint-Venant: Spannungen und Torsion',
        category: 'Technologie',
        description: 'Henri Navier verknüpft Statik und Verformungsgeometrie (Naviersche Biegung: σ = M/W). Adhémar Jean Claude Barré de Saint-Venant löst das Torsionsproblem nicht-kreisförmiger Querschnitte (Wölbkrafttorsion).',
        impact: 'Exakte Dimensionierung von Tragwerkselementen unter Biegung, Schub und Verdrehung.',
        keyReference: 'Navier: Résumé des leçons (1826)'
      },
      {
        era: '1882',
        title: 'Christian Otto Mohr: Mohrscher Spannungskreis & Biegelinien-Analogie',
        category: 'Technologie',
        description: 'Otto Mohr entwickelt das grafische Verfahren zur Koordinatentransformation ebener Spannungszustände (Mohrscher Kreis) zur Ermittlung von Hauptspannungen sowie das Mohr\'sche Analogieverfahren (Wegbereiter des Prinzips der virtuellen Kräfte PvK).',
        impact: 'Ermöglichte Ingenieuren vor dem Computerzeitalter die rasche grafische Kontrolle mehraxialer Spannungs- und Rissrisikozustände.',
        keyReference: 'Mohr: Zivilingenieur (1882)'
      },
      {
        era: '1879 / 1883',
        title: 'Castigliano & Maxwell: Das Prinzip der virtuellen Arbeiten (PvK)',
        category: 'Technologie',
        description: 'Alberto Castigliano formuliert die Sätze über die Ableitung der Formänderungsenergie nach den Kräften (Satz von Castigliano). James Clerk Maxwell und Heinrich Müller-Breslau entwickeln das Kraftgrößenverfahren.',
        impact: 'Erstmals können statisch unbestimmte Tragwerke (Durchlaufträger, Rahmenwerke, Bogenbrücken) systematisch berechnet werden.',
        keyReference: 'Castigliano: Théorie de l\'équilibre des systèmes élastiques'
      },
      {
        era: '1960er–heute (2024–2026)',
        title: 'Die Finite-Elemente-Revolution (FEM) & Nichtlineare Kontinuumsmechanik',
        category: 'Technologie',
        description: 'John Argyris, Ray Clough und O.C. Zienkiewicz überführen die Differentialgleichungen der Elastomechanik in algebraische Matrizengleichungen auf diskretisierten Netzen. Moderne FEM löst physikalisch und geometrisch nichtlineare Probleme (Fließen, Rissbildung, Kontakt).',
        impact: 'Berechnung komplexester Freiform-Architektur, 3D-Boden-Bauwerk-Interaktionen und dynamischer Erdbebenbelastungen im Minutentakt.',
        keyReference: 'Zienkiewicz: The Finite Element Method (1967)'
      }
    ],
    keyTakeaway: 'Die Technische Mechanik schuf das formale Gerüst, um Naturkräfte im Tragwerk durch Gleichgewicht, Kinematik und Stoffgesetze mathematisch exakt beherrschbar zu machen.'
  },

  bauphysik: {
    groupKey: 'bauphysik',
    title: 'Bauphysik',
    leadSummary: 'Von dicken, ungedämmten Speicherwänden über die erste Wärmeschutzverordnung nach den Ölkrisen der 1970er bis hin zum modernen Gebäudeenergiegesetz (GEG 2024) und instationären hygrothermischen Simulationsverfahren (WUFI).',
    milestones: [
      {
        era: '1952',
        title: 'Erste DIN 4108: Mindestwärmeschutz zur Bauschadensvermeidung',
        category: 'Normung',
        description: 'Veröffentlichung der DIN 4108 „Wärmeschutz im Hochbau“. Ziel war nicht Energieeinsparung, sondern reiner Bautenschutz: Vermeidung von Schimmelbildung und Oberflächenkondensat durch Festlegung minimaler Wärmedurchlasswiderstände.',
        impact: 'Etablierung der Bauphysik als eigene bautechnische Disziplin an deutschen Hochschulen.',
        keyReference: 'DIN 4108:1952'
      },
      {
        era: '1977',
        title: 'Erste Wärmeschutzverordnung (WSchV 1977) nach der Ölkrise',
        category: 'Recht & Regularien',
        description: 'Die Ölpreiskrisen 1973/1974 verdeutlichen die Verwundbarkeit durch fossile Brennstoffabhängigkeit. Deutschland erlässt 1977 die 1. WSchV auf Basis des Energieeinsparungsgesetzes (EnEG 1976) mit maximalen k-Werten (heute U-Werte).',
        impact: 'Paradigmenwechsel: Dämmen von Außenwänden, Dächern und Fenstern wird gesetzliche Pflicht für alle Neubauten.',
        keyReference: 'WSchV 1977 / EnEG 1976'
      },
      {
        era: '1995 / 2002',
        title: 'Vom Bauteilverfahren zur ganzheitlichen Energieeinsparverordnung (EnEV)',
        category: 'Recht & Regularien',
        description: 'Die WSchV 1995 führt das Bilanzierungsverfahren für den Jahresheizwärmebedarf ein. Die EnEV 2002 verknüpft Bauphysik und Heizungs-/Anlagentechnik zum Primärenergiebedarf (Q_p) unter Berücksichtigung von Primärenergiefaktoren.',
        impact: 'Ganzheitliche energetische Betrachtung des Gebäudes; Beginn des Passiv- und KfW-Effizienzhaus-Booms.',
        keyReference: 'EnEV 2002 / DIN V 4108-6 / DIN V 4701-10'
      },
      {
        era: '1990er–2000er Jahre',
        title: 'Von Glaser zur instationären Hygrothermik (WUFI)',
        category: 'Technologie',
        description: 'Hartwig Künzel (Fraunhofer IBP) entwickelt das hygrothermische Simulationsverfahren WUFI (Wärme und Feuchte instationär). Das vereinfachende stationäre Glaser-Verfahren (DIN 4108-3) wird bei komplexen Konstruktionen durch instationäre Klimadaten abgelöst.',
        impact: 'Sichere feuchtetechnische Planung von Innendämmungen, Holzbalkenköpfen im Mauerwerk und schadensfreien Flachdächern.',
        keyReference: 'Künzel (1995) / DIN EN 15026'
      },
      {
        era: '2020 / 2024 (GEG-Novelle)',
        title: 'Gebäudeenergiegesetz (GEG) & 65-%-Erneuerbare-Energien-Vorgabe',
        category: 'Recht & Regularien',
        description: 'Zusammenführung von EnEV, EEWärmeG und EnEG im Gebäudeenergiegesetz (GEG 2020) und Novellierung 2024 („Heizungsgesetz“) mit verbindlicher Pflicht zu mindestens 65 % erneuerbarer Energie bei neuen Heizungsanlagen.',
        impact: 'Koppelung von hochgedämmter Gebäudehülle (Niedrigstenergiegebäude) mit Wärmepumpen, PV-Eigenstrom und kommunaler Wärmeplanung.',
        keyReference: 'GEG 2024 / EU-Gebäuderichtlinie EPBD'
      }
    ],
    keyTakeaway: 'Die Bauphysik entwickelte sich von der reinen Schadensvermeidung (Schimmel/Tauwasser) zu einer Schlüsseldisziplin der Energiewende, des Klimaschutzes und des akustischen Wohlbefindens.'
  },

  nachhaltigkeit: {
    groupKey: 'nachhaltigkeit',
    title: 'Nachhaltigkeit & Ökologie',
    leadSummary: 'Vom Club-of-Rome-Bericht 1972 über die Entstehung der Gebäudezertifizierungen (DGNB, LEED) bis zur Lebenszyklusanalyse (LCA), der EU-Taxonomie und dem Paradigma des zirkulären Bauens (Cradle to Cradle).',
    milestones: [
      {
        era: '1972 / 1987',
        title: 'Club of Rome & Brundtland-Definition',
        category: 'Paradigmenwechsel',
        description: 'Der Bericht „Die Grenzen des Wachstums“ (1972) und der Brundtland-Bericht „Unsere gemeinsame Zukunft“ (1987) definieren nachhaltige Entwicklung: Befriedigung der Bedürfnisse der Gegenwart, ohne künftigen Generationen ihre Lebenschancen zu nehmen.',
        impact: 'Bauwesen rückt als größter Ressourcenverbraucher (über 50 % des weltweiten Rohstoffbedarfs) in den Fokus ökologischer Debatten.',
        keyReference: 'Brundtland-Bericht (1987)'
      },
      {
        era: '1990 / 1998',
        title: 'Pioniere der Gebäudezertifizierung: BREEAM & LEED',
        category: 'Normung',
        description: 'Entwicklung der ersten quantitativen Bewertungssysteme für ökologisches Bauen im Vereinigten Königreich (BREEAM 1990) und in den USA (LEED 1998).',
        impact: 'Nachhaltigkeit wird erstmals messbar, marktfähig und zu einem zentralen Kriterium für internationale Immobilieninvestoren.',
        keyReference: 'BREEAM (1990) / USGBC LEED (1998)'
      },
      {
        era: '2007 / 2009',
        title: 'Gründung der DGNB & Deutsches Bewertungssystem Nachhaltiges Bauen (BNB)',
        category: 'Normung',
        description: 'Gründung der Deutschen Gesellschaft für Nachhaltiges Bauen (DGNB). Entwicklung eines Drei-Säulen-Modells mit gleichwertiger Gewichtung von Ökologie, Ökonomie und soziokulturellen Faktoren über den gesamten Lebenszyklus.',
        impact: 'Ganzheitliche Ökobilanzierung (LCA) von Wiege bis Bahre (Cradle-to-Grave nach DIN EN 15978) wird zum Gold-Standard in Deutschland.',
        keyReference: 'DGNB System / BNB Bundesbauten'
      },
      {
        era: '2012 / 2019',
        title: 'Umweltproduktdeklarationen (EPD) nach DIN EN 15804',
        category: 'Recht & Regularien',
        description: 'Veröffentlichung der europäischen Norm DIN EN 15804 (später Novelle +A2) zur standardisierten Umweltproduktdeklaration. Hersteller weisen Treibhauspotenzial (GWP), Primärenergieverbrauch und Versauerung transparent aus.',
        impact: 'Baustoffhersteller müssen wissenschaftlich verifizierte Ökobilanzdaten liefern; Basis für das staatliche QNG-Siegel (Qualitätssiegel Nachhaltiges Gebäude).',
        keyReference: 'DIN EN 15804+A2 / IBU'
      },
      {
        era: '2020er–heute (2024–2026)',
        title: 'EU-Taxonomie, Zirkularität & Materialpässe (Madaster)',
        category: 'Werkstoffwende',
        description: 'Einführung der EU-Taxonomie-Verordnung für nachhaltige Finanzierung. Fokus verschiebt sich von der Betriebsenergie zur „grauen Energie“ (Embodied Carbon) und Zirkularität nach dem Cradle-to-Cradle-Prinzip mit Gebäudematrizen und Materialpässen.',
        impact: 'Gebäude werden als Rohstofflager der Zukunft (Urban Mining) geplant; zirkuläre Rückbaubarkeit wird zu einer harten Finanzierungsbedingung.',
        keyReference: 'EU-Taxonomie VO 2020/852 / Madaster'
      }
    ],
    keyTakeaway: 'Nachhaltigkeit wandelte sich vom idealistischen Zusatzaspekt zum zentralen Steuerungsfaktor der Bauwirtschaft mit harten Vorgaben für graue Emissionen, Lebenszykluskosten und Materialzirkularität.'
  },

  digitales: {
    groupKey: 'digitales',
    title: 'Digitales Bauen & BIM',
    leadSummary: 'Vom Zeichentisch und Tuschestift über 2D- und 3D-CAD bis zum objektorientierten Building Information Modeling (BIM), offenen IFC-Schnittstellen, digitalen Zwillingen und KI-gestützter Bauablaufsteuerung.',
    milestones: [
      {
        era: '1970er–1980er Jahre',
        title: 'Vom Zeichentisch zu 2D-CAD',
        category: 'Technologie',
        description: 'Einführung von Computer-Aided Design (CAD) in Ingenieurbüros. Zeichnungen werden digital als Vektoren (Linien, Kreise, Texte) auf Bildschirmen erstellt statt mit Reißfeder und Tusche auf Transparentpapier gezeichnet.',
        impact: 'Massive Beschleunigung von Planänderungen, Einführung von DXF/DWG-Formaten und exaktere Planungsmaße.',
        keyReference: 'Autodesk AutoCAD (1982) / Nemetschek'
      },
      {
        era: '1994 / 1997',
        title: 'Gründung der IAI (buildingSMART) & Erfindung des IFC-Standards',
        category: 'Normung',
        description: '12 Unternehmen gründen die International Alliance for Interoperability (heute buildingSMART). 1997 wird die erste Version der Industry Foundation Classes (IFC) als offenes, neutrales Datenformat veröffentlicht.',
        impact: 'Grundstein für Open BIM: Bauteile sind nicht mehr bloße Linien, sondern semantische Objekte (Wand, Stütze, Fenster) mit physikalischen Attributen und Herstellerdaten.',
        keyReference: 'ISO 16739 (IFC)'
      },
      {
        era: '2015',
        title: 'BMVI-Stufenplan Digitales Planen und Bauen',
        category: 'Recht & Regularien',
        description: 'Das Bundesministerium für Verkehr und digitale Infrastruktur (BMVI) veröffentlicht den Stufenplan zur schrittweisen Einführung von BIM für Bundesfernstraßen- und Schieneninfrastrukturprojekte bis 2020.',
        impact: 'BIM wird in Deutschland von der akademischen Nische zur verbindlichen Vergabevoraussetzung bei Großprojekten.',
        keyReference: 'BMVI Stufenplan 2015 / BIM Deutschland'
      },
      {
        era: '2018 / 2020',
        title: 'Normenreihe DIN EN ISO 19650: Informationsmanagement mit BIM',
        category: 'Normung',
        description: 'Internationale Harmonisierung der BIM-Prozesse: Einführung einheitlicher Rollen (BIM-Manager, BIM-Koordinator), Begrifflichkeiten (AIA – Auftraggeber-Informationsanforderungen, BAP – BIM-Abwicklungsplan) und der gemeinsamen Datenumgebung (CDE – Common Data Environment).',
        impact: 'Strukturierte und rechtssichere digitale Kollaboration über alle Leistungsphasen hinweg.',
        keyReference: 'DIN EN ISO 19650-1/-2'
      },
      {
        era: '2024–2026',
        title: 'Digitale Zwillinge (Digital Twins), Punktwolken & KI-Planungsautomatisierung',
        category: 'Technologie',
        description: 'Echtzeit-Synchronisation zwischen physischem Bauwerk und digitalem Modell via IoT-Sensoren. Laserscan-Drohnen erzeugen fotorealistische 3D-Punktwolken (Scan-to-BIM), während generative KI Grundrissoptimierungen und automatische Kollisionsprüfungen vornimmt.',
        impact: 'Nahtloser Übergang von der Planung in den Betrieb (CAFM) mit prädiktiver Wartung und reduzierten Baukosten.',
        keyReference: 'buildingSMART BCF / ISO 23386'
      }
    ],
    keyTakeaway: 'Digitales Bauen wandelte sich vom rechnergestützten Zeichnen von Linien hin zu einer vernetzten Datenökosystem-Methode mit intelligenten Bauwerksobjekten und lebenszyklusweiten Digitalen Zwillingen.'
  },

  bestand: {
    groupKey: 'bestand',
    title: 'Bauen im Bestand & Denkmalpflege',
    leadSummary: 'Vom stilreinen Restaurierungsstreit des 19. Jahrhunderts über die Charta von Venedig bis zum heutigen Paradigmenwechsel: Der Bestand ist die Hauptbauaufgabe der Zukunft zur Schonung von Ressourcen und kulturellem Erbe.',
    milestones: [
      {
        era: '19. Jahrhundert',
        title: 'Der Denkmalstreit: Konservieren vs. Rekonstruieren',
        category: 'Paradigmenwechsel',
        description: 'Konflikt zwischen Eugène Viollet-le-Duc (puristische Wiederherstellung eines idealen, nie dagewesenen Zustands) und John Ruskin bzw. Georg Dehio („Konservieren, nicht restaurieren!“). Alois Riegl formuliert 1903 den modernen Denkmalkultus mit dem Wert des Alters.',
        impact: 'Anerkennung von Zeitschichten und historischer Originalsubstanz als schützenswertes Kulturgut.',
        keyReference: 'Dehio (1905) / Riegl (1903)'
      },
      {
        era: '1964',
        title: 'Die Charta von Venedig',
        category: 'Normung',
        description: 'Der 2. Internationale Kongress der Architekten und Denkmalspezialisten verabschiedet das maßgebende internationale Dokument für die Erhaltung und Restaurierung von Denkmälern und Ensembles.',
        impact: 'Verpflichtung zu reversiblen Eingriffen, Unterscheidbarkeit moderner Ergänzungen vom historischen Bestand und Verbot stilistischer Verfälschungen.',
        keyReference: 'Charta von Venedig (ICOMOS 1964)'
      },
      {
        era: '1975',
        title: 'Europäisches Denkmalschutzjahr: Die Wende zur behutsamen Stadterneuerung',
        category: 'Recht & Regularien',
        description: 'Abkehr von der rücksichtslosen Flächensanierung („Autogerechte Stadt“, Abriss historischer Altbauviertel). Beginn der denkmalpflegerischen Landesgesetze in den deutschen Bundesländern.',
        impact: 'Rettung hunderttausender Gründerzeitaltbauten und historischer Innenstädte vor dem Abriss; Etablierung steuerlicher Förderungen (Denkmal-AfA).',
        keyReference: 'Charta von Amsterdam (1975)'
      },
      {
        era: '2000er–2010er Jahre',
        title: 'Tragwerksertüchtigung im Bestand: Verbundbau & Nachrechnungsrichtlinie',
        category: 'Technologie',
        description: 'Veröffentlichung der BMVI-Nachrechnungsrichtlinie für bestehende Brücken. Etablierung moderner Ertüchtigungsmethoden wie Holz-Beton-Verbund (HBV-Decken) und nachträglich aufgeklebter CFK-Lamellen.',
        impact: 'Aktivierung verborgener Tragfähigkeitsreserven historischer Konstruktionen ohne Totalersatz.',
        keyReference: 'BMVI Nachrechnungsrichtlinie'
      },
      {
        era: '2020er–heute (2024–2026)',
        title: 'Paradigmenwechsel: Bestandserhalt als primärer Klimaschutz',
        category: 'Paradigmenwechsel',
        description: 'Über 70 % der Bauinvestitionen in Deutschland entfallen heute auf den Bestand. Umbauordnung der Architektenkammern und Gebäudetyp-e-Initiativen fordern Erleichterungen für das Bauen im Bestand, um Abriss und Neubauemissionen zu stoppen.',
        impact: 'Der Bestand wird als unverzichtbarer CO2-Speicher begriffen; Sanierung und Umnutzung genießen Vorrang vor Neubau.',
        keyReference: 'Bundesstiftung Baukultur / Gebäudetyp e'
      }
    ],
    keyTakeaway: 'Bauen im Bestand wandelte sich von einer nostalgischen Nischendisziplin zum unbestrittenen Hauptvolumen des Bauens und dem effektivsten Hebel zur Vermeidung grauer Emissionen.'
  },

  rueckbau: {
    groupKey: 'rueckbau',
    title: 'Rückbau, Recycling & Kreislaufwirtschaft',
    leadSummary: 'Vom ungeordneten Abriss mit der Abrissbirne über das Kreislaufwirtschaftsgesetz hin zum selektiven Rückbau, der historischen Ersatzbaustoffverordnung (EBV 2023) und dem zirkulären Urban Mining.',
    milestones: [
      {
        era: 'Bis in die 1980er Jahre',
        title: 'Traditioneller Trümmerabbruch & ungeordnete Deponierung',
        category: 'Paradigmenwechsel',
        description: 'Bauwerke werden mittels Birne oder unkontrolliertem Einsturz abgerissen. Bauschutt, Holz, Metalle und gefährliche Schadstoffe (Asbest, Teer, PCB) landen vermischt in Gruben und Hausmülldeponien.',
        impact: 'Enorme Altlastenprobleme, Verunreinigung von Grundwasserleitern und Verlust wertvoller metallischer und mineralischer Rohstoffe.',
        keyReference: 'Historische Deponiepraxis'
      },
      {
        era: '1994 / 1996',
        title: 'Kreislaufwirtschafts- und Abfallgesetz (KrW-/AbfG)',
        category: 'Recht & Regularien',
        description: 'Einführung der gesetzlichen 5-stufigen Abfallhierarchie (Vermeidung vor Wiederverwendung vor Recycling vor sonstiger Verwertung vor Beseitigung). Verursacherprinzip für Abfallerzeuger.',
        impact: 'Beginn der gezielten Aufbereitung mineralischer Bauabfälle in stationären und mobilen Brech- und Siebanlagen.',
        keyReference: 'KrW-/AbfG (1994) / KrWG (2012)'
      },
      {
        era: '2000er Jahre',
        title: 'Selektiver Rückbau & Schadstoffsanierung (DIN 18007)',
        category: 'Technologie',
        description: 'Standardisierung des selektiven Rückbaus von innen nach außen: Vorab-Entkernung, manuelle Schadstoffentfrachtung (Asbestsanierung nach TRGS 519, KMF nach TRGS 521) und sortenreine Trennung mineralischer Fraktionen.',
        impact: 'Gewinnung schadstofffreier mineralischer Rezyklate für den Straßen-, Erd- und Tiefbau.',
        keyReference: 'DIN 18007 / TRGS 519'
      },
      {
        era: '01. August 2023',
        title: 'Inkrafttreten der Bundes-Ersatzbaustoffverordnung (EBV)',
        category: 'Recht & Regularien',
        description: 'Historischer Meilenstein nach über 15 Jahren Verhandlung: Die EBV löst den uneinheitlichen Flickenteppich der Landesregelungen (wie LAGA M20) bundesweit ab. Einführung bundeseinheitlicher Materialwerte (MEB 1 bis MEB 3) und Güteüberwachungen.',
        impact: 'Erstmals vollkommene Rechts- und Planungssicherheit beim Einbau von RC-Baustoffen in technischen Bauwerken ohne wasserrechtliche Einzelgenehmigung.',
        keyReference: 'EBV (BGBl. 2021 I S. 2598) / MantelV'
      },
      {
        era: '2024–2026',
        title: 'Urban Mining, R-Beton & Kreislaufwirtschaft 2.0',
        category: 'Werkstoffwende',
        description: 'Verstärkter Einsatz von rezyklierten Gesteinskörnungen (Typ 1 und Typ 2 nach DIN EN 12620) im Hochbau für R-Betone nach DIN 1045-2. Verpflichtung zu Rückbau- und Verwertungskonzepten vor Beginn von Abbrucharbeiten.',
        impact: 'Schließung des mineralischen Stoffkreislaufs im Hochbau bei gleichzeitiger Schonung natürlicher Kies- und Sandvorkommen.',
        keyReference: 'DIN EN 12620 / GewAbfV'
      }
    ],
    keyTakeaway: 'Der Rückbau wandelte sich vom brachialen Abriss zu einem hochgradig qualitätsgesicherten Rohstoffgewinnungsverfahren, geregelt durch die bundesweite EBV für echtes zirkuläres Bauen.'
  },

  dauerhaftigkeit: {
    groupKey: 'dauerhaftigkeit',
    title: 'Dauerhaftigkeit & Korrosion',
    leadSummary: 'Vom Irrglauben an den „ewigen Werkstoff Beton“ über die Erforschung von Carbonatisierung und chloridinduzierter Lochfraßkorrosion bis zur modellgestützten Lebensdauerbemessung nach fib Model Code.',
    milestones: [
      {
        era: 'Frühes 20. Jahrhundert',
        title: 'Die Illusion des unverwüstlichen Betons',
        category: 'Paradigmenwechsel',
        description: 'In den ersten Jahrzehnten des Stahlbetonbaus ging man davon aus, dass Beton baupraktisch ewig halte und keinerlei Schutz- oder Unterhaltsmaßnahmen bedürfe. Korrosionsmechanismen waren unzureichend verstanden.',
        impact: 'Planung mit zu geringen Betondeckungen (teilweise nur 10–15 mm), was Jahrzehnte später zu gravierenden Bauschäden führte.',
        keyReference: 'Frühe DIN 1045 Fassungen'
      },
      {
        era: '1960er–1970er Jahre',
        title: 'Entdeckung der Chloridkorrosion an Brücken & Parkhäusern',
        category: 'Technologie',
        description: 'Massiver Einsatz von Auftausalzen (NaCl, CaCl2) im Winter führt weltweit zu plötzlichen Abplatzungen und Tragsicherheitsverlusten. Erforschung der chloridinduzierten Lochfraßkorrosion ohne visuelle Vorankündigung.',
        impact: 'Erkenntnis, dass Chloridionen die schützende Passivschicht des Stahls lokal durchbrechen, selbst wenn der Beton alkalisch (pH > 12,5) bleibt.',
        keyReference: 'DAfStb-Forschungsberichte Chloridkorrosion'
      },
      {
        era: '1980er Jahre',
        title: 'Modellierung der Carbonatisierung (Ficksches Diffusionsgesetz)',
        category: 'Technologie',
        description: 'Mathematische Quantifizierung der Neutralisation des alkalischen Zementsteins durch atmosphärisches CO2 (Ca(OH)2 + CO2 -> CaCO3 + H2O). Formulierung des Wurzel-Zeit-Gesetzes für die Carbonatisierungstiefe: x = k · √t.',
        impact: 'Gezielte Festlegung erforderlicher Betondeckungen c_nom in Abhängigkeit von geplanter Nutzungsdauer und w/z-Wert.',
        keyReference: 'Tuutti (1982) / Klopfer'
      },
      {
        era: '2001',
        title: 'Einführung normativer Expositionsklassen & Mindestbetondeckung',
        category: 'Normung',
        description: 'DIN EN 206 und DIN EN 1992-1-1 kodifizieren das Expositionsklassen-System für Korrosionsrisiken: XC (Carbonatisierung), XD (Taumittel), XS (Meerwasser). Festlegung des Nennmaßes der Betondeckung c_nom = c_min + Δc_dev.',
        impact: 'Dauerhaftigkeit wird zu einem gleichberechtigten statischen Bemessungskriterium wie Biege- oder Querkraftwiderstand.',
        keyReference: 'DIN EN 1992-1-1 / DIN 1045-1'
      },
      {
        era: '2020er–heute (2024–2026)',
        title: 'Probabilistische Lebensdauerbemessung & Performance-Konzepte',
        category: 'Sicherheit',
        description: 'Ablösung rein starrer Deskriptivregeln durch vollprobabilistische Lebensdauermodelle nach fib Model Code for Service Life Design (Bulletin 34). Berechnung von Depassivierungswahrscheinlichkeiten p_dep ≤ 10 % nach 50 oder 100 Jahren.',
        impact: 'Planung von Mega-Infrastrukturprojekten (Tunnel, Brücken, Offshore) mit garantierten Lebensdauern von 100 bis 120 Jahren.',
        keyReference: 'fib Model Code / ISO 16204'
      }
    ],
    keyTakeaway: 'Die Dauerhaftigkeit entwickelte sich von einer vernachlässigten Randnotiz zu einer exakten elektrochemischen und diffusionsphysikalischen Ingenieurwissenschaft mit probabilistischer Lebensdauervorhersage.'
  },

  schaeden: {
    groupKey: 'schaeden',
    title: 'Bauschäden & Mängel',
    leadSummary: 'Von spektakulären Einsturzkatastrophen über die Etablierung des öffentlich bestellten Sachverständigenwesens und der WTA bis hin zu modernen forensischen Untersuchungsmethoden und rechtssicheren Mängelrügen nach BGB und VOB.',
    milestones: [
      {
        era: '1879 / 1980',
        title: 'Katastrophen als Lehrmeister: Tay-Brücke & Kongresshalle Berlin',
        category: 'Paradigmenwechsel',
        description: 'Einstürze wie die schottische Tay-Brücke (1879, Ermüdung/Wind) oder der Teileinsturz der Kongresshalle Berlin (1980, Spannungsrisskorrosion vergüteter Spannstähle) decken gravierende Wissenslücken in Statik und Werkstoffverhalten auf.',
        impact: 'Verbot anfälliger Baustähle, Neufassung von Sicherheitskonzepten und Einführung engmaschiger Bauwerksüberprüfungen (DIN 1076 für Brücken).',
        keyReference: 'Untersuchungsausschuss Kongresshalle Berlin'
      },
      {
        era: '1976',
        title: 'Gründung der WTA (Wissenschaftlich-Technische Arbeitsgemeinschaft)',
        category: 'Normung',
        description: 'Gründung der WTA e.V. zur interdisziplinären Erforschung und Schließung von Regelungslücken in Bauwerkserhaltung, Denkmalpflege und Sanierungspraxis.',
        impact: 'WTA-Merkblätter (z. B. Sanierputzsysteme, Mauerwerkstrockenlegung, Innendämmung) werden zu anerkannten Regeln der Technik bei Bauschäden.',
        keyReference: 'WTA e.V. Merkblatt-Reihen'
      },
      {
        era: '1990er Jahre',
        title: 'Neue Schadensbilder: Schimmelpilz- und WDVS-Schäden',
        category: 'Technologie',
        description: 'Der Einbau hochdichter Isolierglasfenster ohne nutzerunabhängige Lüftungskonzepte führt zu einer Explosion von Schimmelpilzschäden. Zeitgleich häufen sich Veralgungen und Risse in ersten Wärmedämmverbundsystemen (WDVS).',
        impact: 'Einführung der Lüftungsnorm DIN 1946-6 (Lüftungskonzept) und Verschärfung der bauphysikalischen Detailausbildung an Wärmebrücken.',
        keyReference: 'DIN 1946-6 / Umweltbundesamt Schimmel-Leitfaden'
      },
      {
        era: '2002 / 2018',
        title: 'Reform des Schuldrechts & Neues BGB-Bauvertragsrecht 2018',
        category: 'Recht & Regularien',
        description: 'Schuldrechtsmodernisierung 2002 führt die 5-jährige Verjährungsfrist für Bauwerksmängel im BGB (§ 634a BGB) ein. 2018 folgt die historische Reform des Bauvertragsrechts (§§ 650a ff. BGB) mit gesetzlicher Definition des Baumangels.',
        impact: 'Rechtliche Schärfung des Mangelbegriffs: Abweichung von der vereinbarten Beschaffenheit oder den anerkannten Regeln der Technik.',
        keyReference: 'BGB §§ 633, 650a–v / VOB/B § 13'
      },
      {
        era: '2024–2026',
        title: 'Forensische Sensorik, Mikrotomographie & KI-Mängelanalyse',
        category: 'Technologie',
        description: 'Einsatz industrieller Computertomographie (µCT) für Baustoffgefüge, Drohnenthermografie mit KI-Schadenserkennung und laseroptische Verformungsanalysen bei Gerichtsgutachten.',
        impact: 'Gerichtsfeste, unstrittige Schadensursachenzuordnung ohne aufwändige destruktive Großbaustellen-Freilegungen.',
        keyReference: 'BVS-Richtlinien / DGSV'
      }
    ],
    keyTakeaway: 'Die Bauschadensanalyse wandelte sich vom subjektiven Augenschein zur forensischen Ingenieurwissenschaft, gestützt auf das Zusammenspiel von Physik, Normen und modernem Werkvertragsrecht.'
  },

  instandsetzung: {
    groupKey: 'instandsetzung',
    title: 'Schutz & Instandsetzung von Bauwerken',
    leadSummary: 'Von den ersten provisorischen Flickschustereien über die legendäre DAfStb-Instandsetzungs-Richtlinie und die europäische DIN EN 1504 bis hin zur DIBt TR Instandhaltung (2020/2021) und kathodischem Korrosionsschutz (KKS).',
    milestones: [
      {
        era: '1970er–1980er Jahre',
        title: 'Reparaturkrisen & erste PCC-Mörtel',
        category: 'Technologie',
        description: 'Frühe Versuche, Betonschäden mit reinem Zementmörtel oder Teeranstrichen auszubessern, scheitern dramatisch an schlechter Haftung und Schwindrissen. Entwicklung kunststoffmodifizierter zementgebundener Mörtel (PCC) und Reaktionsharze (SPCC).',
        impact: 'Erkenntnis, dass Reparaturmörtel denselben thermischen Ausdehnungskoeffizienten und E-Modul wie der Altbeton aufweisen müssen.',
        keyReference: 'Forschungsgemeinschaft Bauen und Wohnen'
      },
      {
        era: '1990 / 2001',
        title: 'Die DAfStb-Instandsetzungs-Richtlinie & SIVV-Zertifizierung',
        category: 'Normung',
        description: 'Der Deutsche Ausschuss für Stahlbeton (DAfStb) veröffentlicht die bahnbrechende 4-teilige Richtlinie „Schutz und Instandsetzung von Betonbauteilen“. Einführung definierter Oberflächenschutzsysteme (OS 1 bis OS 11) und des SIVV-Scheins.',
        impact: 'Verpflichtung zur Beschäftigung von SIVV-Fachpersonal auf Instandsetzungsbaustellen und Etablierung des Sachkundigen Planers (SKP).',
        keyReference: 'DAfStb Rili-SIB (1990/2001)'
      },
      {
        era: '2004–2009',
        title: 'Europäische Normenreihe DIN EN 1504 (Teile 1–10)',
        category: 'Normung',
        description: 'Europaweite Harmonisierung von Produkten und Systemen für den Schutz und die Instandsetzung von Betontragwerken. Definition der 11 grundlegenden Instandsetzungsprinzipien (Prinzip 1 Schutz gegen Eindringen bis Prinzip 11 Kathodischer Schutz).',
        impact: 'CE-Kennzeichnung für Betonersatzmörtel, Rissinjektionsmittel und Schutzbeschichtungen im gesamten Binnenmarkt.',
        keyReference: 'DIN EN 1504-1 bis 1504-10'
      },
      {
        era: '2020 / 2021',
        title: 'DIBt Technische Regel Instandhaltung (TR Instandhaltung)',
        category: 'Recht & Regularien',
        description: 'Das DIBt veröffentlicht die TR Instandhaltung (Teil 1 Planung und Grundsätze, Teil 2 Bauprodukte und Systeme). Sie löst die DAfStb-Richtlinie in den Muster-Verwaltungsvorschriften Technische Baubestimmungen (MVV TB) baurechtlich ab.',
        impact: 'Klarstellung von Standsicherheitsrelevanz, verbindliche Beauftragung des Sachkundigen Planers (SKP) und qualifizierte Baustellenüberwachung.',
        keyReference: 'DIBt TR Instandhaltung (2020/2021)'
      },
      {
        era: '2024–2026',
        title: 'Kathodischer Korrosionsschutz (KKS nach DIN EN ISO 12696) & Hochdruckwasserstrahlen (HDW)',
        category: 'Technologie',
        description: 'Verstärkter Einsatz von KKS mit Fremdstromanoden (Titan-Mischoxid) bei chloridbelasteten Tiefgaragen und Brücken. Vermeidung massiven Betonabtrags; zerstörungsfreier Schutz der Bewehrung durch Polarisierung.',
        impact: 'Erhalt tragender Bauteile bei geringsten Ausfallzeiten und maximaler Ressourceneffizienz ohne statische Schwächung.',
        keyReference: 'DIN EN ISO 12696 / ZTV-ING'
      }
    ],
    keyTakeaway: 'Die Instandsetzung entwickelte sich vom empirischen Flicken zu einer baurechtlich hochregulierten Ingenieurdisziplin, bei der Planung durch Sachkundige Planer (SKP) und SIVV-Qualifikation gesetzlich gefordert sind.'
  },

  praxiswissen: {
    groupKey: 'praxiswissen',
    title: 'Baubetrieb, Bauleitung & Praxiswissen',
    leadSummary: 'Vom mittelalterlichen Bauhüttenmeister über den preußischen Staatsbaumeister bis zur VOB-Entstehung 1926, der Baustellenverordnung (SiGe-Koordination), modernem Bauvertragsrecht und Lean Construction.',
    milestones: [
      {
        era: 'Mittelalter bis 19. Jahrhundert',
        title: 'Vom Bauhüttenwesen zum Generalbaumeister',
        category: 'Paradigmenwechsel',
        description: 'Mittelalterliche Dombauhütten vereinten Entwurf, Statik, Baustoffbeschaffung und handwerkliche Ausführung in einer Person. Im 19. Jahrhundert trennt sich die Disziplin durch staatliche Bauverwaltungen in Planer (Architekt/Ingenieur) und Bauausführende.',
        impact: 'Begründung des modernen Bauleitungs- und Ausschreibungswesens mit Leistungsverzeichnissen und Bautagebüchern.',
        keyReference: 'Preußische Bauordnung / Schinkel'
      },
      {
        era: '1926',
        title: 'Geburtsstunde der VOB (Vergabe- und Vertragsordnung für Bauleistungen)',
        category: 'Recht & Regularien',
        description: 'Gründung des Deutschen Vergabe- und Vertragsausschusses für Bauleistungen (DVA). Veröffentlichung der ersten VOB als ausgewogene Vertragsordnung für die Vergabe und Abwicklung von Bauverträgen der öffentlichen Hand.',
        impact: 'Bis heute die unbestrittene Leitwährung des deutschen Baurechts (VOB/A Vergabe, VOB/B Vertrag, VOB/C Allgemeine Technische Vertragsbedingungen).',
        keyReference: 'VOB 1926 / DVA'
      },
      {
        era: '1998',
        title: 'Baustellenverordnung (BaustellV) & SiGe-Koordination',
        category: 'Sicherheit',
        description: 'Umsetzung der europäischen Baustellenrichtlinie 92/57/EWG im deutschen Recht. Gesetzliche Pflicht des Bauherrn zur Bestellung eines Sicherheits- und Gesundheitsschutzkoordinators (SiGeKo) bei Gewerkeüberschneidung.',
        impact: 'Drastischer Rückgang tödlicher Arbeitsunfälle durch Vorankündigung, SiGe-Pläne und Unterlagen für spätere Arbeiten am Bauwerk.',
        keyReference: 'BaustellV 1998 / RAB 30'
      },
      {
        era: '2018',
        title: 'Große Reform des Bauvertragsrechts im BGB',
        category: 'Recht & Regularien',
        description: 'Einführung des eigenständigen Bauvertragsrechts in das Bürgerliche Gesetzbuch (§§ 650a–v BGB). Gesetzliche Regelung des einseitigen Anordnungsrechts des Bestellers und der Vergütungsanpassung bei Nachträgen.',
        impact: 'Klarheit bei Leistungsänderungen und Stärkung des Verbraucherschutzes bei schlüsselfertigen Bauten.',
        keyReference: 'BGB Bauvertragsreform 2018'
      },
      {
        era: '2024–2026',
        title: 'Lean Construction (Last Planner), Tablet-Baudokumentation & BIMtoField',
        category: 'Technologie',
        description: 'Ablösung chaotischer Baustellenkoordination durch Taktplanung und Taktsteuerung (Last Planner System). Digitale Bauleitung via Tablets (Capmo, PlanRadar) mit GPS-Verortung von Mängeln direkt im 3D-BIM-Modell.',
        impact: 'Minimierung von Bauzeitüberschreitungen, lückenlose Beweissicherung in Echtzeit und drastische Reduktion von Mängelbeseitigungskosten.',
        keyReference: 'GLCI (German Lean Construction Institute)'
      }
    ],
    keyTakeaway: 'Baubetrieb und Bauleitung entwickelten sich von reiner handwerklicher Koordination zu einem hochgradig rechtssicheren, prozessgesteuerten und digital synchronisierten Baustellen-Management.'
  }
};
