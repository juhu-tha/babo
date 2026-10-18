export interface VersionItem {
  version: string;
  date: string;
  title: string;
  badge: 'major' | 'minor' | 'patch';
  changes: string[];
}

export const VERSION_HISTORY: VersionItem[] = [
  {
    version: 'v3.18.0',
    date: '17.10.2026',
    title: 'GModG-Vollaktualisierung, Elasto-Plastizität & Rheologie, Cluster III & Zusatzstoffe',
    badge: 'minor',
    changes: [
      'GModG-Vollaktualisierung (Gebäudemodernisierungsgesetz): Vollständige normative Umstellung auf das am 29.07.2026 in Kraft getretene GModG (BGBl. 2026 I Nr. 226) mit der Bio-Treppe (§ 35 GModG: 15% bis 100%), Bauteil-Grenzwerten (§ 36 GModG) und Kesselaustausch (§ 69 GModG). Inklusive interaktivem U-Wert- & Amortisationsrechner sowie Harmonisierung im Rechtsrahmen-Kompendium, Bestand.tsx und Dämmungsberater.',
      'Werkstoffmodelle: Elasto-Plastisch mit Verfestigung & Rheologie-Simulator: Vollständige Überarbeitung beider Mechanik-Rechner. Elasto-Plastizität mit Werkstoff-Presets (B500B, S355, S235, Aluminium), linearer Verfestigung vs. Ramberg-Osgood-Potenzgesetz, elastischer Rückfederung und plastischer Dissipationsenergie. Rheologie-Simulator mit rigoroser Korrektur aller Differentialgleichungen, Relaxationszeiten, Kriechfunktionen und Promille-Dehnungen für Maxwell-, Kelvin-Voigt-, Zener-, Burgers- und Bingham-Systeme.',
      'Didaktik & 0-100-Reiter: Sachliche, akademische Einleitungen ohne O-Ton, vollständige Beseitigung dunkler/schwarzer Hintergründe gemäß Styleguide (GEMINI_md) und Integration des 0-100-Reiters im Modul Stahlbeton.',
      'Verschiebung Zusatzstoff-Wirkungsmechanismen: Hydratationswärme & ITZ (Interfacial Transition Zone mit Wall-Effekt und CH-Phasen) aus der Mischungsberechnung in das Nachschlagewerk Grundlagen & Regularien (Tab "Zusätze") transferiert.',
      'Cluster-Harmonisierung: Einheitliche Umbenennung von Cluster III von "Konstr. & Bemessung" in "Entwurf & Bemessung" über das gesamte Quiz-Dashboard, InteractiveQuizSystem, Routing und den Fragenkatalog.'
    ]
  },
  {
    version: 'v3.17.0',
    date: '16.10.2026',
    title: 'Spannbeton: Systemberechnung-Reiter, Grundprinzipien & Kriechbeiwerte in Promille',
    badge: 'minor',
    changes: [
      'Strukturierung der Spannbeton-Grundlagen: Trennung in die beiden fokussierten Unterreiter "1. Grundprinzipien" (Dehnungs-Simulator, B500-Dilemma, rheologische Verluste) und "2. Systemberechnung" (interaktiver Einfeldträger-Vergleich unbewehrt vs. Stahlbeton vs. Spannbeton mit variabler Spanngliedlage).',
      'Kriechbeiwerte nach EC2 & Promille-Ausweisung: Vollständige Korrektur aller KaTeX-Formelformate in der didaktischen Vergleichsbox sowie explizite Ausweisung der Kriech- und Gesamtstauchungen in Promille (‰ bzw. mm/m) für Standard-, Brücken- und Hochbauquerschnitte.',
      'Mechanische Schnittgrößen- & Randspannungsbilanz: Exakte normative Berechnung der Randspannungen in Feldmitte und am Auflager (DIN EN 1992-1-1) inklusive Kopfzugriss-Warnung bei gerader Lage unten und Umlenkkraft-Ausweisung (u = 8 P f / L²).'
    ]
  },
  {
    version: 'v3.16.0',
    date: '15.10.2026',
    title: 'Ökobilanzierung: Implementierung DIN EN 17472 & Modul-D-Eingabemaske für Zirkularität',
    badge: 'minor',
    changes: [
      'DIN EN 17472 (Ingenieurbauwerke & Infrastruktur): Vollständige normative Implementierung des europäischen Standards (Ausgabe 2022-09) für Brücken, Tunnel, Straßen und Bahntrassen unter CEN/TC 350 / DIN EN 15643 als eigenständiger Hauptreiter in der Ökobilanzierung inklusive 100-Jahre-Brückensimulator und Modul B8 (Stauemissionen).',
      'Eingabemaske Modul D & dynamische Zirkularitäts-Steuerung: Erweiterung des interaktiven LCA-Rechners um eine dedizierte Modul-D-Maske zur Bilanzierung von Vermeidungspotenzialen außerhalb der Systemgrenze mit dynamischen Eingabefeldern und Schiebereglern für kreislauffähige Stoffanteile (0–100%), Sortenreinheit (VDI 6210) und Kaskadenpfade (Reuse, Closed-Loop, Downcycling, Thermal).',
      'Harmonisierung & formatDeZahl-Standardisierung: Konsequente Bereinigung aller Zahlen- und Nachkommaausgaben im gesamten LCA-Rechner auf formatDeZahl nach deutscher Typografie sowie Verknüpfung mit DIN Media Normen-Referenzen und KaTeX-Gleichungen.'
    ]
  },
  {
    version: 'v3.15.0',
    date: '14.10.2026',
    title: 'Nachhaltigkeit & Baurecht: Hierarchisches Rechtsrahmen-Kompendium & Styleguide-Harmonisierung',
    badge: 'major',
    changes: [
      'Hierarchisches Rechtsrahmen-Kompendium (5 Ebenen) & LCA-Integration: Systematische Aufbereitung aller maßgebenden EU- und Bundesgesetze für Gebäudebestand und Baustoffe (Ebenen 1–5: Pariser Abkommen/Green Deal/KSG, EPBD IV/GEG/GModG, neue BauPVO/ESPR/Level(s), EU-ETS/CBAM, QNG/DGNB/EPDs/EMOCO/CRREM) mit direkter Anbindung an Ökobilanzierung (DIN EN 15978/15804) und Bauteil-Rechner.',
      'Interaktive Navigation, Meilenstein-Zeitleiste & Gesetzessteckbriefe: Zielgerichtete Filterung nach Relevanz (Baumaterialien vs. Bestand), amtliche Rechtsquellen und Schwellenwerte (GWP-Berechnungspflicht 2028/2030) sowie chronologische Meilenstein-Roadmap (2024 bis 2050 Netto-Null).',
      'Styleguide-Harmonisierung (GEMINI_md & Gold Standard Kalk.tsx): Vollständige Beseitigung dunkler Boxen und Verläufe in allen neuen Nachhaltigkeits- und Rechner-Modulen zugunsten des lichten akademischen Layouts (bg-white, bg-off-white, border-home-grau/30, Shiraz-Akzentuierung).'
    ]
  },
  {
    version: 'v3.14.0',
    date: '11.10.2026',
    title: 'Spannbeton: Schätz- vs. Rechenwerte für Beiwerte & Plattform-Titelaktualisierung',
    badge: 'minor',
    changes: [
      'Plattform-Untertitel & Metadaten: Ergänzung des offiziellen Plattform-Titels um "Nachhaltiges Bauen" zu "Interaktive Lern- und Wissensplattform für Baustoffkunde, Werkstoffmechanik, Bauen im Bestand, Kreislaufwirtschaft, Nachhaltiges Bauen & Co".',
      'Spannbeton: Systematische Gegenüberstellung von Schätzwerten (Vordimensionierung) und normativen Rechenwerten (Eurocode 2 DIN EN 1992-1-1 / DIN EN 10138) für alle maßgebenden Beiwerte (Kriechen φ, Feuchtebeiwert φ_RH, Spannalter β(t₀), Schwinden ε_cs, Autogenschwinden ε_ca, Trocknung k_h, Stahlrelaxation ρ₁₀₀₀ & Δσ_pr, gekoppelte Verluste c+s+r, Reibung μ, Ungewollter Knickbeiwert k, Keilschlupf w sowie Teilsicherheits- und Streubeizahlen γ_P, r_sup/inf).',
      'Didaktischer Beiwerte-Katalog: Interaktives Nachschlagewerk mit Filterfunktion nach Phänomenen, Formeldarstellung (KaTeX), baupraktischen Größenordnungen, Einflussfaktoren und Praxishinweisen zu Gültigkeitsgrenzen (z. B. nichtlineares Kriechen bei σ_c > 0.45 f_ck).'
    ]
  },
  {
    version: 'v3.13.0',
    date: '11.10.2026',
    title: 'Bauwerksdiagnose: Stichprobenumfang, Konditionierung & Ingenieurinterpretation',
    badge: 'minor',
    changes: [
      'Normative Prüfpunkte & Entnahmestellen: Neuer interaktiver Probenahme-Planer mit normativer Mindeststichprobenberechnung nach DIN EN 13791 (Verfahren A ≥ 14 Kerne vs. Verfahren B), DBV-Merkblatt (5 %-Quantil Betondeckung) und DGZfP-Rasterweiten.',
      'Proben- & Prüfstellenkonditionierung: Umfassende Richtlinien für Stirnflächenplanparallelität (≤ 0,05 mm), Feuchtelagerung, Vorbefeuchtung für Halbzellenpotential (Rc < 10 kΩ) sowie striktes Trockenbohren bei chloridinduzierter Bohrmehlanalyse.',
      'Ingenieurtechnische Interpretation & Anwendung: Interaktive Entscheidungsanalyse mit Schwellenwertanalyse (C_krit = 0,50 M.-%, EC2-Dauerlastfaktor η = 0,85, f_ct ≥ 1,5 N/mm²) und Ableitung von Tragwerks- und Instandsetzungskonzepten (DIBt TR Prinzipien W, C, R, KKS).'
    ]
  },
  {
    version: 'v3.12.0',
    date: '11.10.2026',
    title: 'Gesamtrevision Mängel, Schäden & Instandsetzung (AP 15 & AP 16)',
    badge: 'minor',
    changes: [
      'Gesamtrevision Mängel & Schäden (AP 15): Harmonisierung von Tragwerks-Monitoring (SHM-Rückprallkorrektur nach DIN EN 13791) und VDI 6200 Zustandsbewertung auf deutsche Zahlenformatierung (formatDeZahl) sowie strukturierte Prüfdimension-3-Validierung.',
      'Gesamtrevision Schutz & Instandsetzung (AP 16): Bereinigung aller Instandsetzungsmodelle der TR Instandhaltung / DIN EN 1504 (Fick’sche Diffusionsgleichung, Rissfüllstoffe) und WTA-Injektionsbedarfsrechner nach Merkblatt 4-10 auf normkonforme Kommaschreibweise.',
      'Systemische Fehlerbeseitigung & Normenharmonisierung: Vollständige Bereinigung unformatierter Dezimalausgaben in den Diagnostikmodulen, Aktualisierung der Regelwerksverweise auf DIN Media und erfolgreiche Linter- und Build-Validierung.'
    ]
  },
  {
    version: 'v3.11.0',
    date: '11.10.2026',
    title: 'Gesamtrevision Rückbau, Schadstoffe & Dauerhaftigkeit (AP 13 & AP 14)',
    badge: 'minor',
    changes: [
      'Gesamtrevision Rückbau & Schadstoffe (AP 13): Beprobungsbilanzierung nach LAGA PN 98 (Abfaelle.tsx), TRGS 521 KMF-Kanzerogenitätsindex (Schadstoffe.tsx) sowie Haufwerksdichte (BodenMaterialAufbereitung.tsx) auf normgerechte deutsche Zahlenformatierung (formatDeZahl) umgestellt.',
      'Gesamtrevision Dauerhaftigkeit & Korrosion (AP 14): Vollständige Neukonzeption von Lebensdauern (4 Tabs nach GEMINI_md inkl. ISO 15686 Faktorenmethode und BBSR/BNB-Tabelle) sowie mathematische Bereinigung aller Carbonatisierungs- (Wurzel-Zeit-Gesetz), AKR- und Chlorid-Sprengdruckrechner.',
      'Regelwerks- & Qualitätsstandard (Prüfdimension 3): Beseitigung unendlicher Scroll-Strukturen, Verknüpfung der Regelwerke auf DIN Media (DIN EN ISO 15686-1, DIN EN 206, TRGS 521, LAGA PN 98) und vollständige Typensicherheit.'
    ]
  },
  {
    version: 'v3.10.0',
    date: '11.10.2026',
    title: 'Gesamtrevision Nachhaltigkeit & Bauen im Bestand (AP 11 & AP 12)',
    badge: 'major',
    changes: [
      'Gesamtrevision Nachhaltigkeit & Ökologie (AP 11): Umfassende Überarbeitung von Materialoptimierung (DAfStb-Richtlinie Treibhausgasreduzierte Betone, LC3-Klinkersubstitution), Kreislaufwirtschaft (UMI- und MCI-Zirkularitätsindizes) sowie Harmonisierung aller LCA/LCC-Rechner auf deutsche Zahlenformatierung (formatDeZahl).',
      'Gesamtrevision Bauen im Bestand & Denkmalpflege (AP 12): Vollständige Neukonzeption des Altbauatlas (Bestand.tsx) mit 4 thematischen Reitern nach GEMINI_md, Integration von Modernisierungsberechnungen nach GModG/GEG, Sanierungs-WTA-Vorgaben und Bereinigung aller U-Wert- und Verformungsberechnungen auf normkonforme Kommaschreibweise.',
      'Durchgängige Qualitätssicherung (Prüfdimension 3): Vollständige Beseitigung unendlicher Scroll-Strukturen in Bestandsmodulen, synchrone Einbindung von DIN Media Regelwerken (DIN 4108-3, DIN EN ISO 6946, WTA 6-5) und verifizierte Barrierefreiheit bei allen Rechner- und Diagrammausgaben.'
    ]
  },
  {
    version: 'v3.9.0',
    date: '10.10.2026',
    title: 'Gesamtrevision Mechanik, Statik & Bauphysik (AP 09 & AP 10)',
    badge: 'major',
    changes: [
      'Gesamtrevision Mechanik, Statik & Werkstoffmodelle (AP 09): Vollständige Neukonzeption von Bruchmechanik (5 Tabs: K_I-Rechner, Griffith/Irwin-Theorie, K_Ic/G_F-Kennwerte, Prüfverfahren SENB/CT/Tschegg, Schadensfälle) und E-Modul (4 Tabs: Voigt/Reuss/HS-Schranken, EC2-Normalbeton, Materialtabelle, Elastizitätstheorie).',
      'Gesamtrevision Bauphysik (AP 10): Vollständige Neukonzeption von Wärmeeigenschaften (4 Tabs: Kennwerte a/b/C_vol, GEG-Dämmstoffvergleich, Sommerschutz), Feuchteschutz (4 Tabs: Taupunkt/Schimmel f_Rsi ≥ 0,70, sd-Rechner, Glaser-Verfahren) und Schallschutz (5 Tabs: Luftschall DIN 4109-32, Zweischaligkeit, Trittschall, Sabine-Nachhallzeit).',
      'Universale Integration Prüfdimension 3 (Thematische Vollständigkeit): Durchsetzung der Kernbedingung lückenloser Fachvermittlung sowie systemweite deutsche Zahlenformatierung (formatDeZahl) und Regelwerks-Harmonisierung auf DIN Media.'
    ]
  },
  {
    version: 'v3.8.0',
    date: '10.10.2026',
    title: 'Metallkorrosion: Durchlässige/Undurchlässige Deckschichten & 6 Prüfdimensionen',
    badge: 'minor',
    changes: [
      'Metallkorrosion, Deckschichten & Schutzmaßnahmen: Differenzierte Analyse durchlässiger vs. undurchlässiger Deckschichten (Corten, Al₂O₃, Patina), thermodynamisches Pilling-Bedworth-Verhältnis (PBR) mit Live-Rechner sowie aktive vs. passive Schutzsysteme (KKS, ECE, Verzinkung, OS-Beschichtungen).',
      'Didaktische Leitfaden- & Modulstruktur-Evolution: Umzug des 6-dimensionalen Prüfrasters in das Modul Anleitung sowie Implementierung des interaktiven radialen Stern-Graphen für den THA-Campus-Hub mit 4 umschaltbaren Strukturansichten.',
      'Normenharmonisierung Massiv- & Holzbau (AP 07 & AP 08): Umfassende Neukonzeption von WUBauwerke (5 Tabs nach GEMINI_md), EC2-Stahlbetonbemessung (DIN EN 1992-1-1:2023-08) und universale deutsche Zahlenformatierung für Holzbau-Nachweise nach Eurocode 5 (DIN EN 1995-1-1:2024-03).'
    ]
  },
  {
    version: 'v3.7.0',
    date: '09.10.2026',
    title: 'Großaudit: Fachliche Gesamtrevision aller Module (AP 01–17) & Startseiten-Redesign',
    badge: 'major',
    changes: [
      'Großaudit AP 01–17: Vollständige fachliche Gesamtrevision aller 17 Arbeitspakete von Bauchemie und Prüflaboren über Beton- und Mauerwerkstechnologie bis zu Nachhaltigkeit, Bauforensik und zirkulärem Rückbau.',
      'Normen- & Linkaktualisierung: Systemweite Umstellung aller Regelwerkszitate auf DIN Media mit präzisen Monats-/Jahresausgaben (DIN 1045-2:2023-08, DIN EN 1992-1-1:2023-08, DIN EN 1995-1-1:2024-03) und Beseitigung aller Platzhalter.',
      'UI-Refinement & Typografie: Dezentes Startseiten-Design unterhalb des Leitspruchs, Beseitigung farbiger Versions-Pills zugunsten klarer typografischer Hierarchie und vereinheitlichte Containerhintergründe.'
    ]
  },
  {
    version: 'v3.6.0',
    date: '09.10.2026',
    title: 'Definitionen Nachhaltigkeit, Vorlesungshierarchie & Startseiten-Update',
    badge: 'minor',
    changes: [
      'Neuer Standard-Reiter „Definitionen & Leitprinzipien“ im Modul Nachhaltigkeit (Daten & Regeln): Fundierte, quellenbasierte Definitionen von Nachhaltigkeit (Carlowitz, Daly, Brundtland) und nachhaltigem Bauen (DIN EN 15643, ISO 15392, BNB/DGNB-Kriterien).',
      'Bereinigte Vorlesungsarchitektur in Cluster VII: Flache Struktur aller Vorlesungseinheiten ohne redundante Zwischenebene für direkten Zugriff im Hörsaal.',
      'Systemweite Angleichung der Überblick-Reiter (konsequent helle Containerhintergründe) sowie Wiedereinführung der Versionsanzeige auf der Startseite.'
    ]
  },
  {
    version: 'v3.5.0',
    date: '07.10.2026',
    title: 'Systemweiter Überblick, Barrierefreiheit & Live-Vorlesungsvotings',
    badge: 'major',
    changes: [
      'Systemweiter Reiter „Überblick“ in allen Modulinfos: Fundamentale Grundprinzipien in Textform gepaart mit interaktiven grafischen Prozess- und Kausalketten.',
      'Live-Hörsaalabstimmungen per QR-Code ohne Google-Konto: Vollständig anonyme Teilnahme per Smartphone und direkte Verschiebung aller Vorlesungsmodule unter Cluster VII.',
      'A11y-Schriftgrößenregelung: Stufenlose Verringerung und Vergrößerung per Schieberegler (80 % bis 135 %) sowie DAfStb-Richtlinie im Modul Materialoptimierung.'
    ]
  },
  {
    version: 'v3.4.0',
    date: '05.10.2026',
    title: 'Innovationen & F&E (TRL 1–9) & SEO-Optimierung',
    badge: 'minor',
    changes: [
      'Neues Fachmodul "Innovationen & F&E" mit bauspezifischer Reifegradbewertung (TRL 1–9 nach DIN EN ISO 16290) und interaktivem Rechner.',
      'Zukunftswerkstoffe im Überblick: Carbonbeton, Geopolymere, Myzel-Dämmung, Bio-Beton und CO₂-Mineralisierung.',
      'Zulassungspfade (abZ/aBG, ETA, ZiE) und Förderprogramme (Zukunft Bau, ZIM).'
    ]
  },
  {
    version: 'v3.3.5',
    date: '02.10.2026',
    title: 'Rheologie-Simulator, Zener-Modell & Knickprüfung',
    badge: 'patch',
    changes: [
      'Rheologie-Simulator mit linear skalierten Zeit- und Dehnungsachsen für alle 8 Ersatzmodelle.',
      'Erweiterung um das Zener-Modell (SLS) zur Analyse von Spannungsrelaxation (Asphalt, Lager).',
      'Integration von Euler-Knicknachweisen und materialspezifischen Bruchkriterien (Duktilität vs. Sprödbruch).'
    ]
  },
  {
    version: 'v3.3.0',
    date: '02.10.2026',
    title: 'Mischungsberechnung 2.0 & Bauschadensforensik',
    badge: 'minor',
    changes: [
      'Mischungsentwurf mit LP-Beton-Automatik, Faserdosierung, Hüttensandmehl (HüS) und 1-Klick-Benchmark nach VDZ B20.',
      'Bauschadensforensik-Simulator: Schadensfall-Diagnostik mit Budget- und Analysetools.',
      'Dynamischer Prüfungs-Trainer mit Zufallsaufgaben und KaTeX-Musterlösungen.'
    ]
  },
  {
    version: 'v3.2.0',
    date: '28.09.2026',
    title: 'Barrierefreier Zugang & Normenharmonisierung',
    badge: 'patch',
    changes: [
      'Vollständig offener, barrierefreier Hochschulzugang ohne Registrierung oder Passwörter.',
      'Harmonisierung aller Bemessungsrechner nach DIN EN 1992-1-1 mit deutschem Nationalem Anhang (NA DE).',
      'Einheitliches Farbschema und didaktische Modulstruktur nach Baustoff-Styleguide.'
    ]
  },
  {
    version: 'v3.0.0',
    date: '25.09.2026',
    title: 'Major Release: 6 Meta-Cluster & Neue Fachmodule',
    badge: 'major',
    changes: [
      'Strukturierung des Portals in 6 thematische Meta-Cluster mit intuitiver Akkordeon-Navigation.',
      'Neue Module: Spannbeton-Biegezugprüfung (DIN EN 1992-1-1 / DIN 4227) und Ringversuche (ISO/IEC 17043).',
      'Single-Source-Normen-Registry und dynamische ModuleFooter-Schnittstelle.'
    ]
  }
];

export const CURRENT_VERSION: VersionItem = VERSION_HISTORY[0];
export const CURRENT_VERSION_NUMBER: string = VERSION_HISTORY[0].version;
export const CURRENT_RELEASE_DATE: string = VERSION_HISTORY[0].date;
