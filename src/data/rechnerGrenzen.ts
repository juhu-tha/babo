/**
 * Annahmen und Grenzen der Rechner (Umsetzungsplan Phase 4, AP 4.11).
 * Der Haftungshinweis über jedem Rechner zeigt diese Liste aufklappbar an.
 * tests/rechnerGrenzen.test.ts prüft, dass jedes Modul vom Typ „calculator“ einen Eintrag hat.
 */
export interface RechnerGrenzen {
  /** Was der Rechner berechnet (ein Satz) */
  kurz: string;
  /** Vereinfachungen und Anwendungsgrenzen; leer, wenn das Modul nichts berechnet */
  grenzen: string[];
  /** false: Modul ist als Rechner einsortiert, berechnet aber keine Bemessungsgrößen */
  rechnet?: boolean;
}

const STAHLBETON: RechnerGrenzen = {
  kurz: 'Bemessung von Stahlbetonquerschnitten nach DIN EN 1992-1-1 mit NA (DE) für Biegung, Querkraft, Stützen, Durchstanzen, Verankerung und Rissbreite.',
  grenzen: [
    'Rechteckquerschnitte, Normalbeton bis C50/60 (Spannungsblock λ = 0,8, η = 1,0); darüber erscheint ein Hinweis.',
    'Biegung: eine Zug- und eine Druckbewehrungslage, ξ_lim = 0,45; nichtmetallische Bewehrung vereinfacht linear-elastisch, maßgebend ist die Zulassung.',
    'Querkraft: z = 0,9·d, senkrechte Bügel, ohne Normalkraft (σ_cp = 0).',
    'Stütze: Theorie I. Ordnung mit e_i = l₀/400 und Mindestausmitte; bei λ > λ_lim nur Hinweis, kein Nachweis nach Theorie II. Ordnung.',
    'Durchstanzen: konstantes β, keine Öffnungen, keine Abminderung durch Bodenpressung; erhöhte Faktoren κ_sw der ersten Bewehrungsreihen nicht berücksichtigt.',
    'Rissbreite: direkte Berechnung mit einer Bewehrungslage; bei Stababständen > 5·(c + φ/2) gilt 7.3.4(4) (nur Hinweis).',
    'σ-ε-Linien: Parabel-Rechteck und Gl. (3.14) mit den Parametern der Tab. 3.1 bis C90/105; Betonstahl B500 bilinear mit E_s = 200 000 N/mm² und ε_ud = 25 ‰ (NA DE).',
  ],
};

export const RECHNER_GRENZEN: Readonly<Record<string, RechnerGrenzen>> = {
  biokohlebeton: {"kurz": "CO₂-Bilanz je m³ Beton aus gespeichertem Kohlenstoff der Pflanzenkohle (C-Gehalt · 44/12 · F_perm), Herstellungsemission und Zementreduktion; dazu Vornässwasser und w/z-Wert.", "grenzen": ["Lehrmodell: bilanziert nur Zement und Pflanzenkohle je m³; Gesteinskörnung, Transport, Nutzung und Lebensende (Module A4 bis D) fehlen.", "Permanenzfaktoren nach IPCC 2019 Refinement sind für Böden abgeleitet; für Beton gibt es keine Normwerte.", "Treibhauspotenziale von Zement und Pflanzenkohle sind Richtwerte; für Nachweise gelten EPD nach DIN EN 15804.", "Keine Prognose von Festigkeit, Karbonatisierung oder Farbton – diese sind durch Eignungsprüfungen je Rezeptur nachzuweisen."]},
  labor_potentialmessung: {"kurz": "Umrechnung gemessener Stahlpotentiale auf SHE und CSE, Bewertung nach Potentialbereichen (Richtwerte) und Cl⁻/OH⁻-Verhältnis beim ersten Potentialabfall.", "grenzen": ["Elektrodenpotentiale als Literaturwerte bei 25 °C (±3 mV); Temperatur- und Diffusionspotentiale bleiben unberücksichtigt.", "Potentialbereiche nach ASTM C876 gelten für Stahl im Beton am Bauwerk; im Lösungsversuch nur zur Orientierung.", "c(OH⁻) aus dem pH-Wert und c(Cl⁻) aus Masse und Volumen ohne Aktivitätskoeffizienten und Dichteänderung (Lehrvereinfachung).", "Depassivierung wird allein am Potentialabfall zwischen zwei Stufen erkannt; maßgebend bleibt die Begutachtung der Probe."]},
  labor_auslagerung: {"kurz": "Gravimetrische Auswertung von Auslagerungsversuchen: Oberfläche, korrigierter Massenverlust, Massenverlustrate und gleichmäßige Abtragsrate je Medium.", "grenzen": ["Setzt gleichmäßigen Flächenabtrag voraus; bei Lochfraß unterschätzt die Rate die örtliche Eindringtiefe erheblich.", "Lineare Hochrechnung auf ein Jahr; die zeitliche Abnahme der Korrosion durch Deckschichten wird nicht abgebildet.", "Ein einheitlicher Blindwert für alle Proben; Stabgeometrie als Zylinder mit zwei Stirnflächen, Rippen nicht erfasst.", "Ergebnisse gelten für das Prüfmedium; keine Übertragung auf Stahl im Beton oder auf Korrosivitätskategorien."]},
  labor_frischbeton: {"kurz": "Ausbreitmaß mit Klassenzuordnung F1 bis F6, Frischbetonrohdichte und Luftgehalt (A₁ − G) mit Gegenprobe über die Soll-Rohdichte.", "grenzen": ["Rundung und Klassengrenzen nach den Kernpunkten der Normen; Gültigkeitskriterien der Prüfung bleiben dem Normtext vorbehalten.", "Gegenprobe des Luftgehalts setzt eine richtige, luftporenfreie Soll-Rohdichte voraus.", "Druckausgleichsverfahren nur für Beton mit dichter Gesteinskörnung; nicht für Leichtbeton oder sehr poröse Körnungen."]},
  labor_druckfestigkeit: {"kurz": "Würfeldruckfestigkeit aus Höchstkraft und gemessener Fläche, Umrechnung trocken gelagerter Würfel und vereinfachte Klassenzuordnung.", "grenzen": ["Klassenzuordnung als Lehrvereinfachung nach den Kriterien der Erstherstellung (n = 3); keine Konformitätskontrolle einer Produktion.", "Umrechnungsfaktor 0,92 bzw. 0,95 nach dem gemessenen Mittelwert gewählt statt nach der festgelegten Klasse.", "Nur Normalbeton und Würfel; Zylinder, Bohrkerne, Leicht- und Schwerbeton werden nicht abgebildet."]},
  labor_moertelprismen: {"kurz": "Biegezug- und Druckfestigkeit an Normprismen 40 × 40 × 160 mm mit ±10-%-Regel und Zuordnung zur Zementfestigkeitsklasse nach 28 Tagen.", "grenzen": ["Klasse nur nach der Untergrenze der Normfestigkeit nach 28 Tagen; Anfangsfestigkeit (L, N, R) und Obergrenze werden nicht bewertet.", "Feste Prismengeometrie und Stützweite (l = 100 mm, b = 40 mm); abweichende Maße werden nicht berücksichtigt.", "Keine Konformitätsbewertung eines Zements; dafür gelten die statistischen Kriterien der DIN EN 197-1."]},
  schnellkarbonatisierung: {"kurz": "Karbonatisierungskoeffizient K_AC aus Messwerten nach DIN EN 12390-12 (Regression über √t), Umrechnung auf natürliche CO₂-Konzentration und Prognose gegenüber der Betondeckung.", "grenzen": ["Umrechnung nur über die CO₂-Konzentration (K ∝ √c); Feuchte, Beregnung, Temperatur und Nachbehandlung bleiben unberücksichtigt – Größenordnung, kein Normwert.", "Deterministische Prognose mit dem Wurzel-t-Gesetz; keine Streuung von Deckung und Material, kein probabilistischer Nachweis.", "Kein Dauerhaftigkeitsnachweis: Maßgebend bleiben Expositionsklasse, c_min,dur und Betonzusammensetzung nach DIN EN 1992-1-1 und DIN 1045-2.", "Mittelwerte je Zeitpunkt sind vorzugeben; Einzelmessungen, Probekörperanzahl und Messstellenauswahl der Norm werden nicht abgebildet."]},
  sommerlicher_waermeschutz: {"kurz": "Vorhandener und zulässiger Sonneneintragskennwert eines Raums nach dem vereinfachten Verfahren der DIN 4108-2:2013-02 mit Prüfung der Verzichtsregeln.", "grenzen": ["Tabellenwerte S1 bis S6 und F_C nach DIN 4108-2:2013-02 (Wiedergabe in KS-Planungshandbuch und BVRS-TR Sonnenschutz); die Neuausgabe 2026-05 ist nicht abgeglichen.", "F_C aus Tab. 7 als Anhaltswert; produktspezifische g_tot-Werte und Teilverschattung durch Vorsprünge (F_S nach DIN V 18599-2) werden nicht abgebildet.", "S3, S4 und S5 flächenanteilig; f_neig und f_nord auf die gesamte Fensterfläche bezogen; Nordwest und Nordost zählen in Tab. 6 zur 10-%-Gruppe.", "Nicht anwendbar bei Doppelfassaden, transparenter Wärmedämmung, unbeheizten Glasvorbauten, Hallen und mehrgeschossigen offenen Räumen; dort thermische Simulation nach 8.4.", "Bauart wird vorgegeben; C_wirk/A_G ist gesondert zu ermitteln. Die Raumtiefe ist bei A_G auf das Dreifache der lichten Raumhöhe zu begrenzen."]},
  membranen_etfe: {"kurz": "Membrankraft gewölbter Membranstreifen und Kissen unter Innendruck nach der Kesselformel (Zylinder n = p·r, Kugel n = p·r/2) und Vergleich mit einer zulässigen Membrankraft.", "grenzen": ["Membrantheorie für Kreiszylinder bzw. Kugel mit konstantem Radius; reale Kissen sind doppelt gekrümmt mit veränderlichen Radien, die Formfindung bleibt unberücksichtigt.", "Radius aus Spannweite und Stich als Kreisbogen; Dehnung der Membran unter Last (Zunahme des Stichs) nicht berücksichtigt (Theorie I. Ordnung).", "Festigkeiten (ETFE: Spannung bei 10 % Dehnung, Gewebe: Kurzzeitzugfestigkeit) und Gesamtsicherheitsbeiwert sind Lehrwerte; die Bemessung erfolgt mit Abminderungsbeiwerten nach abZ/aBG bzw. vBG oder CEN/TS 19102.", "Kein Nachweis von Nähten, Klemmprofilen, Randseilen, Weiterreißen, Kriechen, Temperatur oder Schneesack; bei mehrlagigen Kissen ist die maßgebende Druckdifferenz je Lage selbst anzusetzen."]},
  korrosionsschutz_beschichtungen: {"kurz": "Schutzdauer einer Zinkschicht aus Schichtdicke und Zinkabtragsrate je Korrosivitätskategorie, optional als Duplex-System, im Vergleich mit der Schutzdauerklasse.", "grenzen": ["Lineares Modell t = d_Zn / r_corr mit den Erstjahresraten nach DIN EN ISO 9223; der tatsächliche Langzeitabtrag (DIN EN ISO 9224) ist meist etwas geringer.", "Maßgebend ist die obere Abtragsrate der Kategorie; örtliche Einflüsse (Kondensat, Spritzwasser, Mikroklima) sind nicht erfasst.", "Synergiefaktor des Duplex-Systems und Schutzdauer der Beschichtung sind Literatur- bzw. Lehrwerte, keine Normwerte.", "Keine Bemessung von Beschichtungssystemen nach den Systemtabellen der DIN EN ISO 12944-5; Im-Kategorien sind nicht berechenbar."]},
  altholz_urban_mining: {"kurz": "Massenbilanz einer sensorgestützten Altholzsortierung in eine stoffliche und eine energetische Linie mit Fehlsortierquote, Reinheit, A-IV-Anteil und stofflicher Verwertungsquote.", "grenzen": ["Zwei-Linien-Modell: A I/A II gelten als Ziel der stofflichen, A III/A IV als Ziel der energetischen Linie; die stoffliche Verwertung von A III nach Entfernen der Beschichtung ist nicht abgebildet.", "Ein konstantes Ausbringen je Kategorie; Stückgrößen, Bandbelegung, Mehrfachsortierung und Verwechslungen innerhalb einer Linie (z. B. A I gegen A II) sind nicht modelliert.", "Die Warnschwellen für den A-IV-Anteil (0,5 %) und die Fehlsortierquote (10 %) sind Lehrannahmen. Maßgebend für Holzwerkstoffe sind die Schadstoffgrenzwerte nach Anhang II AltholzV, nachgewiesen durch Analyse.", "Die Kategorie ist im Rechner als bekannt vorausgesetzt; in der Praxis hängt sie auch von Herkunft und Regelzuordnung nach Anhang III AltholzV ab."]},
  pfas_baustoffe: {"kurz": "Summen PFAS-20 und PFAS-4 einer Wasserprobe und Vergleich mit den Grenzwerten der TrinkwV (100 ng/l ab 12.01.2026, 20 ng/l ab 12.01.2028), mit Spanne durch Werte unter der Bestimmungsgrenze.", "grenzen": ["Nur die 20 Einzelstoffe der TrinkwV; andere PFAS, Vorläufer und Summenparameter (AOF, TOP-Assay) sind nicht erfasst.", "Eine gemeinsame Bestimmungsgrenze für alle Stoffe; reale Labore geben stoffspezifische Bestimmungsgrenzen und Messunsicherheiten an.", "Der Ansatz der Werte unter der Bestimmungsgrenze (0, BG/2, BG) ist eine Lehrvariante; maßgebend sind die Vorgaben der TrinkwV und des Labors.", "Die Grenzwerte gelten für Trinkwasser. Für Grundwasser, Eluate von Bauschutt und Bodenmaterial gelten andere Bewertungsmaßstäbe (z. B. Leitfaden zur PFAS-Bewertung)."]},
  keramik_ziegel: {"kurz": "Wasseraufnahme E_b, Fliesengruppe nach DIN EN 14411, Rohdichte sowie offene und Gesamtporosität aus Trocken-, Nass- und Unterwasserwägung.", "grenzen": ["Ein Sättigungszustand für alle Größen; die Norm unterscheidet Kochverfahren (E_b) und Vakuumverfahren (E_v). Prüfkörperanzahl und Mittelung sind nicht abgebildet.", "Dichte des Wassers fest 1,0 g/cm³; keine Temperaturkorrektur der Unterwasserwägung.", "Gruppe nur aus E_b und Formgebung; die Unterteilung AIIa/AIIb in Teil 1 und 2 sowie weitere Anforderungen (Bruchkraft, Frost) werden nicht geprüft.", "Für Mauerziegel gelten andere Prüfverfahren (DIN EN 772-21, DIN EN 772-7); die Fliesengruppe dient dort nur zum Vergleich."]},
  stahlbau_ec3: {"kurz": "Querschnittsklasse, Querschnittswiderstände und Biegeknickwiderstand N_b,Rd gewalzter I-Profile unter zentrischem Druck nach DIN EN 1993-1-1 mit NA (DE).", "grenzen": ["Zentrischer Druck ohne Biegemomente; Biegedrillknicken, Drillknicken und die Interaktion nach 6.3.3 sind nicht enthalten.", "Querschnittsklasse 4 wird nur erkannt; der Nachweis mit wirksamer Fläche A_eff nach DIN EN 1993-1-5 fehlt (Ergebnis auf der unsicheren Seite).", "Nennwerte f_y und f_u für Erzeugnisdicken t ≤ 40 mm (Tab. 3.1); S460 als S460N/NL nach DIN EN 10025-3.", "Auswahl auf zehn IPE-, HEA- und HEB-Profile beschränkt; die Knicklängen L_cr sind vorzugeben und werden nicht aus Lagerung oder Rahmensystem ermittelt."]},
  stahlbeton_bemessung: STAHLBETON,
  spannbeton: {
    kurz: 'Spannkraftverluste (Reibung, Keilschlupf, elastische Verkürzung, Kriechen, Schwinden, Relaxation) und Spannungsnachweise eines Rechteckquerschnitts.',
    grenzen: [
      'Einfeldträger mit Nachweisschnitt in Feldmitte, Rechteckquerschnitt ohne Spannglied-Hüllrohrabzug.',
      'Zeitabhängige Verluste nach Gl. (5.46) mit φ(∞,t₀) und ε_cs(∞) nach Anhang B; Relaxation für 500 000 h.',
      'Dekompression als größte Betonspannung an den Grenzen e_p ± max(100 mm; h/10) nach NA DE (EN-Empfehlung: 25 mm), vereinfacht am ungerissenen Querschnitt (Zustand I).',
      'Dehnungsanimation: fester Lehrträger (L = 20 m, 500 × 1000 mm, E_cm = 35 000 N/mm², f_ctm = 3,5 N/mm²), Spannungen nach Freyssinet linear-elastisch am Bruttoquerschnitt; nach Überschreiten von f_ctm nur qualitativ.',
      '„Von 0 bis 100“: Verlust durch Betonstauchung Δσ = E·Δε ohne Relaxation; Lastausgleich u = 8·P·f/L² für Parabelspannglied am Einfeldträger, Litzenzahl überschlägig mit 150 kN je Litze (Lehrannahme).',
    ],
  },
  holzbau_bemessung: {
    kurz: 'Knicknachweis von Druckstäben und Querdrucknachweis nach DIN EN 1995-1-1 mit NA (DE).',
    grenzen: [
      'Zentrischer Druck um die schwache Achse; Biegung, Exzentrizitäten und Kippen sind nicht enthalten.',
      'Vollholz nach EN 338 und Brettschichtholz nach EN 14080, γ_M = 1,3; k_mod nach Tab. 3.1.',
      'Querdruck: wirksame Kontaktlänge mit pauschal 30 mm Überstand je Seite.',
    ],
  },
  bauphysik: {
    kurz: 'U-Wert nach DIN EN ISO 6946, Temperaturverlauf und Temperaturfaktor f_Rsi, sommerlicher Wärmeschutz und Raumakustik (Glaser-Verfahren im Modul Feuchteschutz).',
    grenzen: [
      'Homogene Schichten ohne Wärmebrücken, Befestigungsmittel und Luftschichtkorrekturen.',
      'f_Rsi mit R_si = 0,25 m²K/W in der ungestörten Fläche; Wärmebrücken sind nicht erfasst.',
      'GEG-Höchstwerte für die Änderung bestehender Gebäude (Anlage 7).',
    ],
  },
  feuchteschutz: {
    kurz: 'Taupunkt, Schimmeltemperatur, s_d-Werte und Tauwassernachweis nach dem Glaser-Verfahren (DIN 4108-3).',
    grenzen: [
      'Sättigungsdampfdruck nach der Magnus-Formel der DIN 4108-3 (über Eis unter 0 °C).',
      'Glaser-Verfahren (Periodenbilanz) mit Tangentenkonstruktion über der s_d-Achse; Tauwasserebenen und -bereiche werden erkannt, die p_sat-Kurve wird je Schicht in 40 Teilpunkten aufgelöst.',
      'Tauperiode nach DIN 4108-3 (seit 2014): 2 160 h, innen 20 °C / 50 %, außen −5 °C / 80 %, R_si = 0,25 und R_se = 0,04 m²K/W.',
      'Verdunstungsperiode: 2 160 h, p_i = p_e = 1 200 Pa, 1 700 Pa (Wand) bzw. 2 000 Pa (Dach) in der Tauwasserzone.',
      'Klimawerte aus öffentlichen Sekundärquellen; Abgleich mit DIN 4108-3:2024-03 vorläufig (fachliche Freigabe ausstehend).',
      'Mehrere Tauwasserzonen: Verdunstung vereinfacht gemeinsam (innerste Zone nach innen, äußerste nach außen); der zeitliche Ablauf des Austrocknens ist nicht abgebildet.',
      'Nicht geprüft: Feuchteerhöhung von Holz und Holzwerkstoffen, Anwendungsgrenzen (z. B. Gründächer, unbelüftete Dächer mit dichter Deckung), Sonderregeln für Schichten mit sehr kleinem s_d-Wert.',
      'Stationäre Betrachtung ohne Feuchtespeicherung, kapillaren Transport und Konvektion.',
    ],
  },
  schallschutz: {
    kurz: 'Bewertetes Schalldämm-Maß einschaliger massiver Bauteile über die Massekurve nach DIN 4109-32.',
    grenzen: [
      'R_w = 30,9·lg(m′) − 22,2 dB, gültig für 65 ≤ m′ ≤ 720 kg/m².',
      'Nur einschalige, biegesteife Bauteile; Vorsatzschalen, WDVS und Holzbau (Masse-Feder-Masse) werden nicht abgebildet.',
      'Ohne Flankenübertragung, also kein Nachweis von R′_w zwischen Räumen.',
    ],
  },
  bp_glaeser: {
    kurz: 'Wärmedurchgangskoeffizient U_w von Fenstern nach DIN EN ISO 10077-1 und solare Gewinne.',
    grenzen: [
      'Einflügeliges Fenster mit umlaufend gleicher Rahmenbreite.',
      'Ψ-Werte der Abstandhalter als Lehrwerte; maßgebend sind die Herstellerangaben.',
      'Kein Standsicherheitsnachweis der Verglasung nach DIN 18008.',
    ],
  },
  mischungsberechnung: {
    kurz: 'Stoffraumrechnung für 1 m³ Beton mit Feuchtekorrektur, (w/z)_eq, Expositionsanforderungen und CO₂-Abschätzung.',
    grenzen: [
      'Rohdichten der Zusatzstoffe, Zusatzmittel und Fasern als feste Lehrwerte.',
      'Anrechenbarkeit von Flugasche vereinfacht nach Zementart; Präzisierung nach DIN 1045-2 offen.',
      'CO₂-Werte sind Lehrwerte und ersetzen keine EPD.',
      'Packungsdichte: Siebdurchgänge der Komponenten sind Lehrwerte; geschätzte Packungsdichte und „reales“ Zweikornmodell veranschaulichen nur (kein CPM nach de Larrard).',
      'Walz-Kurven: Abrams-Näherung f = A/5^(w/z) mit A = 100/120/140 N/mm² (Lehrwerte) für w/z 0,35 bis 0,80; ersetzt keine Erstprüfung.',
    ],
  },
  stahl: {
    kurz: 'Lehrmodelle zu Baustahl: Abminderung im Brandfall (DIN EN 1993-1-2), Wöhlerlinie (DIN EN 1993-1-9), Walz- und Schweißeigenspannungen, σ-ε-Linien und M_pl,Rd je Stahlgüte.',
    grenzen: [
      'Brandfall: k_y,θ und k_E,θ nach Tab. 3.1 linear interpoliert; die σ-ε-Linie ist trilinear (Plateau bis 2 %, Verfestigung bis 20 %) statt elliptisch und ohne k_p,θ.',
      'Ermüdung: Wöhlerlinie mit Δσ_D bei 5·10⁶ und Δσ_L bei 10⁸ ohne Teilsicherheitsbeiwerte γ_Ff, γ_Mf und ohne Schadensakkumulation; die Neigung m ist frei wählbar.',
      'Walz- und Schweißeigenspannungen sowie die σ-ε-Linien der Stahlsorten sind qualitative Lehrkurven (Parabel- bzw. Gauß-Näherung), keine Prüf- oder Bemessungswerte.',
      'M_pl,Rd = W_pl·f_y/γ_M0 setzt Querschnittsklasse 1 oder 2 voraus; Biegedrillknicken und Interaktion mit Querkraft bleiben unberücksichtigt.',
    ],
  },
  kunststoffe: {
    kurz: 'E-Modul von Kunststoffen über der Temperatur als Lehrmodell je Strukturtyp (amorph, teilkristallin, Elastomer, Duroplast) und Wärmedehnung ΔL = L₀·α_T·ΔT.',
    grenzen: [
      'Logistische Modellkurven mit festen Übergangstemperaturen (z. B. T_g = 100 °C amorph); keine Werkstoffdaten eines bestimmten Kunststoffs, maßgebend sind Produktdatenblätter.',
      'Kurzzeitmodul ohne Zeit- und Lasteinfluss: Kriechen, Relaxation, Alterung und Feuchte sind nicht abgebildet.',
      'Werte unter 0,1 MPa werden für die logarithmische Darstellung auf 0,1 MPa gesetzt (Fließ- bzw. Schmelzbereich ohne Tragfunktion).',
    ],
  },
  bodenmechanik: {
    kurz: 'Zustandsgrenzen und Klassifikation nach DIN 18196, Mohr-Coulomb, Erddruck nach Rankine und Konsolidierung nach Terzaghi.',
    grenzen: [
      'Erddruck: glatte, lotrechte Wand, waagerechtes Gelände, kohäsionsloser Boden ohne Wasser.',
      'Konsolidierung eindimensional mit konstantem c_v und E_s, Näherungsformel für U(T_v).',
      'Klassifikation nur über das Plastizitätsdiagramm, ohne Korngrößen- und organische Anteile.',
    ],
  },
  // Weitere Rechner (Durchsicht 24.10.2026, Belege im PR)
  einheiten: {
    kurz: "Rechnet Einheiten innerhalb einer Größenart über einen Faktor zur SI-Basiseinheit um, bei Temperatur mit Nullpunktverschiebung.",
    grenzen: [
      "Nur Umrechnung innerhalb derselben Kategorie (z. B. kein kg ↔ N, kein kg/m³ ↔ kN/m³).",
      "Angloamerikanische Einheiten über ihre exakten Definitionen (1 lb = 0,45359237 kg, 1 lbf = 1 lb·9,80665 m/s², 1 psi = 1 lbf/in², 1 kcal = 4186,8 J).",
      "Temperaturen unter 0 K werden abgelehnt; negative Längen, Flächen, Volumen, Massen und Dichten werden mit Hinweis umgerechnet.",
      "Anzeige mit höchstens 10 signifikanten Stellen, sehr kleine und große Beträge in Zehnerpotenz-Schreibweise.",
    ],
  },
  asphalt: {
    kurz: "Raumdichte aus Bitumengehalt, Hohlraumgehalt und Dichten, schematische Marshall-Kurve und Lehrmodell Niedrigtemperaturasphalt (Viskosität, Aerosole, Energie, CO₂, Verdichtungsfenster).",
    grenzen: [
      "Raumdichte ρ_b = ρ_m·(1 − V_m/100) aus vorgegebenem Hohlraumgehalt; keine Prüfung nach DIN EN 12697-5/-6, Bindemittelabsorption des Gesteins unberücksichtigt.",
      "Marshall-Stabilität ist eine schematische Lehrkurve mit Optimum bei 5,5 M.-%, keine Prüfwerte nach DIN EN 12697-34.",
      "NTA: Viskosität, Aerosolkonzentration, Energie und CO₂ sind exponentielle bzw. lineare Lehransätze mit festen Faktoren je Verfahren; kein Nachweis des AGW nach TRGS 900.",
      "Verdichtungsfenster nach Newton-Abkühlung für 4 cm Schicht bei 15 °C Luft, ohne Wind, Unterlage und Walzeneinsatz; CO₂-Bilanz mit Untergrenze 3,5 kg/t.",
    ],
  },
  bauchemie: {
    kurz: "Lehrmodelle für Stellmittel-Rheologie, AKR-Dehnung und Karbonatisierung (Wurzel-t-Gesetz) sowie Stöchiometrie mit molaren Massen und pH-Wert.",
    grenzen: [
      "Viskosität des Mörtels als scherverdünnendes Lehrmodell mit festen Beiwerten, gerundet auf 0,1 Pa·s; Bewertungsgrenzen 0,4 bis 1,5 % Stellmittel sind Lehrannahmen.",
      "AKR-Dehnung logarithmisch über der Zeit mit Feuchtesprung bei 80 % r. F.; ersetzt keine Prüfung nach Alkali-Richtlinie des DAfStb.",
      "Karbonatisierung mit Richtwerten K je w/z-Wert ohne Zementart, Nachbehandlung und Feuchte; kein Dauerhaftigkeitsnachweis.",
      "Molare Massen mit gekürzten Standard-Atomgewichten (IUPAC/CIAAW); pH-Umrechnung mit pK_W = 14 (25 °C), ohne Aktivitätskoeffizienten.",
    ],
  },
  materialmodelle: {
    kurz: "Bilineares elasto-plastisches Modell mit Verfestigung und Entlastung (ε_y, σ_max, ε_e, ε_p, k) sowie qualitative σ-ε-, Thixotropie- und Rheopexie-Lehrkurven.",
    grenzen: [
      "Bilinear mit konstantem Verfestigungsmodul E_t, einachsig, monoton bis ε_max und eine Entlastung; keine zyklische Belastung, kein Bauschinger-Effekt, keine Einschnürung.",
      "k = σ_max/f_y bezieht sich auf die gewählte Dehnung ε_max, nicht auf charakteristische Werte (f_t/f_y)_k nach DIN EN 1992-1-1 Anhang C.",
      "Linear, nichtlinear, ideal-plastisch, viskoelastisch und Thixotropie/Rheopexie sind qualitative Kurven mit festen Parametern (E = 210 000, f_y = 355 N/mm²).",
    ],
  },
  baustoffkenngroessen: {
    kurz: "Grundrechner für Spannung/Dehnung, Dichte, Porosität, Feuchtegehalt, Wärmedehnung, s_d- und w-Wert, Einschicht-U-Wert, Wärmespeicherung sowie ein zeitabhängiges Betonbeispiel.",
    grenzen: [
      "Hooke streng linear-elastisch, ohne Fließgrenze und Versagen; Auslastung nur als σ/f_y.",
      "Betonbeispiel: Kriechen mit (t − t₀)/((t − t₀) + 30), Schwinden mit t/(t + 150) – Lehransätze statt EC2 Anhang B.",
      "Zwang mit E_eff = E_cm(t₀)/(1 + φ), ohne Relaxationsbeiwert und ohne Rissbildung.",
      "U-Wert nur einschichtig mit R_si = 0,13 und R_se = 0,04 m²K/W.",
    ],
  },
  labor: {
    kurz: "Lehrsimulationen für Druck/Zug, Spaltzug, Biegezug, Haftzug, Rückprallhammer und Frischbeton; die Kurven entstehen aus hinterlegten Lehrwerten, nicht aus Messdaten.",
    grenzen: [
      "Spannungs-Dehnungs-Linien sind Lehrkurven (Beton: Parabel bis ε_c1, danach linear; Holz: Hankinson-Formel).",
      "Spaltzug und Biegezug mit fest hinterlegten Festigkeiten je Werkstoff.",
      "Rückprallhammer: Festigkeit nach Lehr-Näherung 0,027·R^1,85, Karbonatisierungsfaktor 0,85 pauschal.",
      "Frischbeton: Ausbreit-/Setzmaß und Bingham-Kennwerte linear aus w/z, Fließmittel und LP.",
    ],
  },
  statistik: {
    kurz: "Mittelwert, Standardabweichung, Median, Variationskoeffizient, Ausreißertests und 5-%-Fraktilwert x_k = m − k_n·s sowie x_d = x_k/γ_M.",
    grenzen: [
      "k_n nach DIN EN 1990 Anhang D (V_X unbekannt), interpoliert; erst ab n ≥ 3.",
      "Grubbs-Test vereinfacht (nicht iterativ), Boxplot-Quartile ohne Interpolation.",
      "Normalverteilung angenommen, keine log-normale Auswertung.",
      "x_d ohne k_mod und ohne Umrechnungsfaktor η.",
    ],
  },
  festbeton_statistik: {
    kurz: "f_ck = f_cm − 1,645·σ und f_cd sowie Darstellung der Konformitätskriterien.",
    grenzen: [
      "Normalverteilung mit bekanntem σ, keine Stichprobenkorrektur.",
      "Würfelwerte pauschal als Zylinderwert × 1,25 (tatsächlich klassenabhängig).",
      "Es wird keine Stichprobe aus Einzelwerten geprüft, nur Grenzwerte angezeigt.",
    ],
  },
  erdbau: {
    kurz: "Grobe Zuordnung zu Bodengruppe und Frostempfindlichkeitsklasse sowie Mindestdicke des frostsicheren Oberbaus nach vereinfachtem RStO-Schema.",
    grenzen: [
      "Klassifikation nur über Feinkorngrenzen, Kies-/Sandanteil, Organik und Plastizität, ohne Körnungslinie.",
      "Frostschutz nur mit Ausgangswert, Frostzone und Wasserverhältnissen; weitere Zeilen der RStO-Tabelle nicht berücksichtigt.",
      "Nur F2/F3 wählbar; gebundene Schichten pauschal.",
    ],
  },
  kombinationen: {
    kurz: "Faserverbunde nach Mischungsregeln (Voigt/Reuss) sowie U-Wert, Σs_d und Tauwasser-Hinweis eines Mehrschichtaufbaus.",
    grenzen: [
      "Faserverbund mit idealer Haftung (Lehrmodell).",
      "U-Wert mit R_si = 0,13 und R_se = 0,04 m²K/W, ohne Wärmebrücken und ohne Glaser-Nachweis.",
      "Tauwasser-Hinweis als Faustregel über das s_d-Verhältnis der Schichthälften.",
    ],
  },
  bp_verkehr_rsto: {
    kurz: "Zeigt fest hinterlegte Schichtaufbauten je Belastungsklasse; es wird nichts gerechnet.",
    rechnet: false,
    grenzen: [
      "Schichtdicken sind vereinfachte Lehrwerte, maßgebend sind die Tafeln der RStO 12/24.",
      "Frostzone, Frostempfindlichkeit und Wasserverhältnisse beeinflussen den Aufbau nicht.",
    ],
  },
  bp_verkehr_pruefung: {
    kurz: "Rohdichte (hohlraumfrei) und Hohlraumgehalt eines Asphaltprobekörpers.",
    grenzen: [
      "Feste Dichten 2,68 (Gestein) und 1,02 g/cm³ (Bitumen), Zweistoffsystem ohne Füller.",
      "Sollbereich 1,5–4,5 Vol.-% pauschal (Lehrwert), nicht mischgutabhängig.",
    ],
  },
  bp_verkehr_tiefbau: {
    kurz: "Speichervolumen und Länge einer Rigole (Lehrmodell in Anlehnung an DWA-A 138); dazu Betondecken, Bahn- und Tunnelbau.",
    grenzen: [
      "Rigole: k_f = 1·10⁻⁵ m/s fest, Versickerung nur über die Sohle, Querschnitt fest, ein Regenereignis ohne Häufigkeitsbetrachtung.",
      "Betondecke: Westergaard-Randspannung mit festen Kennwerten, zulässige Spannung pauschal.",
      "Schiene: σ = E·α·ΔT bei vollständiger Behinderung; Tunnel: Kesselformel ohne Biegung.",
    ],
  },
  frischbeton: {
    kurz: "Konsistenz gegen Grenzabmaße, korrigierter Luftgehalt, Frischbetonrohdichte, Schalungsdruck und Frischbetontemperatur.",
    grenzen: [
      "Grenzabmaße nach hinterlegter Tabelle; LP-Obergrenze pauschal Mindestwert + 4 % (keine Normgröße).",
      "Schalungsdruck mit genähertem Erstarrungsbeiwert; SVB voll hydrostatisch.",
      "Frischbetontemperatur über Mischungsregel mit festen Wärmekapazitäten.",
    ],
  },
  hydratation_folgen: {
    kurz: "Wärmeentwicklung und Reife, Festigkeits- und E-Modul-Entwicklung, Zwang mit Rissrisiko und Mindestbewehrung, Kriechen und Schwinden.",
    grenzen: [
      "Temperaturverlauf mit pauschaler Wärmeabfuhr und festen Stoffwerten.",
      "Rissnachweis mit f_ct,eff = 0,7·f_ctm und k_c = 1,0 (zentrischer Zwang), σ_s aus vereinfachter Tabelle.",
      "Praxisbeispiel mit festen Kennwerten, linear mit β_cc skaliert.",
      "Zwang & Risse (massige Bauteile): Temperaturkurve als Lehransatz, Zwang α_T·ΔT·E_c(t)·R nur in der Abkühlphase.",
      "Mindestbewehrung im Praxisbeispiel mit k_c = 1,0, k = 0,8, f_ct,eff = 2,5 N/mm² und σ_s = 240 N/mm² als feste Lehrwerte.",
      "Reife: wirksames Alter aus der Kerntemperatur in Schritten von 0,1 d; f_ck wird aus der Zementfestigkeitsklasse angesetzt, β_cc ist auf 1,25 begrenzt.",
      "Wärme mit hyperbolischem Ansatz Q = H_max·t_e/(t_e + t₅₀) und Lehrwerten je Zementart; Zusatzstoffe über lineare Zu- und Abschläge.",
      "Bauteile unter 0,30 m: Die pauschale Wärmeabfuhr gleicht die Temperatur je Zeitschritt vollständig an die Umgebung an.",
      "Reißrahmen: qualitatives Lehrmodell mit festen Kurvenparametern; kein Ersatz für Versuche nach RILEM TC 119-TCE.",
      "Kriechen und Schwinden: lineares Kriechen nach EC2 Anhang B bei 20 °C, h₀ direkt vorgegeben, E_cm für Quarzit.",
    ],
  },

  betonkennwerte: {
    kurz: "EC2-Kennwerte aus der Festigkeitsklasse sowie Zeitentwicklung, Schwinden und Kriechen nach EC2 Anhang B.",
    grenzen: [
      "α_cc = 0,85, γ_c = 1,5 und α_ct = 0,85 fest.",
      "Konstante Umgebungstemperatur über das gesamte Alter.",
      "Relative Luftfeuchte auf 20–100 % und h₀ auf 20–1500 mm begrenzt.",
      "Nichtlineares Kriechen ohne Obergrenze bei 0,6·f_ck(t₀).",
    ],
  },
  kriechen: {
    kurz: "Kriechzahl φ(t,t₀), Trocknungs- und autogenes Schwinden ε_cs = ε_cd + ε_ca nach EC2 3.1.4 und Anhang B, wirksamer E-Modul sowie Relaxation von Spannstahl nach 3.3.2.",
    grenzen: [
      "Nur lineares Kriechen (σ_c ≤ 0,45·f_ck(t₀)); kein nichtlineares Kriechen nach Gl. (3.7).",
      "Konstante Temperatur von 20 °C (keine Temperaturanpassung von t₀ nach Gl. B.10), E_cm für quarzitische Gesteinskörnung.",
      "h₀ wird direkt vorgegeben; k_h nach Tab. 3.3 mit 1,0 unter 100 mm und 0,70 über 500 mm.",
      "Stützenbeispiel: ε_tot = σ_c/E_cm·(1 + φ) + ε_cs mit σ_c = 8,5 N/mm² und L = 3 m als Lehrannahmen; ohne Bewehrung.",
      "Relaxation: Verlust für σ_pi/f_pk ≤ 0,5 vernachlässigt; ohne Temperatureinfluss und ohne Kopplung an Kriechen und Schwinden.",
    ],
  },
  expositionsklassen: {
    kurz: "Maßgebende Anforderungen der gewählten Expositionsklassen und (w/z)_eq nach dem k-Wert-Ansatz.",
    grenzen: [
      "c_nom nur aus c_min,dur + Δc_dev; c_min,b aus dem Stabdurchmesser geht nicht ein.",
      "Flugasche k = 0,4 (f/z ≤ 0,33), Silikastaub k = 1,0 (s/z ≤ 0,11), ohne gemeinsame Begrenzung.",
      "LP-Werte nur für Größtkorn 8/16/32 mm.",
    ],
  },
  holzbau_verbindung: {
    kurz: "Holzschrauben: Tragfähigkeit auf Herausziehen und Abscheren nach vereinfachtem EC5-Ansatz.",
    grenzen: [
      "f_ax,k = 12 N/mm² als Lehrwert statt Wert aus der ETA der Schraube.",
      "k_mod = 0,8 und γ_M = 1,3 fest; einschnittig Holz–Holz.",
      "Ohne wirksame Anzahl n_ef, Mindestabstände, Blockscheren und Interaktion axial/quer.",
    ],
  },
  holzbau_bauphysik: {
    kurz: "Brand mit reduziertem Querschnitt; Eigenfrequenz f₁ und Durchbiegung unter 1 kN einer Brettsperrholzdecke als Einfeldträger.",
    grenzen: [
      "Brand: feste Abbrandraten, nur Restquerschnitt und Widerstandsmoment, keine Tragfähigkeit.",
      "Schwingung: zweiseitig gelenkig gelagerter Einfeldstreifen; Biegesteifigkeit nur aus den Längslagen, netto oder nach dem γ-Verfahren (DIN EN 1995-1-1 Anhang B, nur symmetrisch 3- und 5-lagig).",
      "Bei 7 und mehr Lagen wird die Netto-Biegesteifigkeit angesetzt; das Schubanalogieverfahren ist nicht umgesetzt.",
      "Kennwerte E_0,mean = 11 550 N/mm², G_r,mean = 65 N/mm² und Wichte 5,5 kN/m³ nach proHolz Austria (Band II, 2018) statt Werten aus der ETA des Herstellers.",
      "Steifigkeitskriterium mit mitwirkender Breite b_F nach Hamm/Richter; Orientierungswerte der Deckenklassen nach ÖNORM B 1995-1-1, keine Grenzwerte nach NA (DE).",
      "Nicht enthalten: Beschleunigungs- und Geschwindigkeitskriterium, Durchlaufträger, vierseitige Lagerung, Auflagernachgiebigkeit; das Ergebnis bestätigt keine Deckenklasse.",
    ],
  },
  mechanische_kenngroessen: {
    kurz: "Stabsimulator für Spannung, Dehnung, Steifigkeiten, Durchbiegung, Euler-Knicklast, Formänderungsenergie und einfache Kriech-, Schwind- und Relaxationsansätze.",
    grenzen: [
      "Durchgehend linear-elastisch, auch oberhalb der Fließgrenze.",
      "Euler-Knicklast nur für Euler-Fall 2.",
      "Kriechen, Schwinden und Relaxation pauschal (Maxwell mit τ = 250 d für alle Werkstoffe).",
    ],
  },
  emodul: {
    kurz: "E_cm nach EC2 und Schranken nach Voigt, Reuss und Hashin-Shtrikman für Gestein/Zementstein.",
    grenzen: [
      "Hashin-Shtrikman mit ν = 0,2 für beide Phasen.",
      "Nur zwei Phasen, ohne Kontaktzone und Porosität.",
    ],
  },
  festigkeit: {
    kurz: "Reißlänge und maximale Turmhöhe zweier Werkstoffe sowie ein Würfelstapel bis zum Druckversagen.",
    grenzen: [
      "Werkstoffwerte als feste Lehrwerte.",
      "Reines Eigengewicht, ohne Teilsicherheitsbeiwerte und Stabilität.",
    ],
  },
  knicken: {
    kurz: "Euler-Knicklast für die Euler-Fälle 1–4 und Auslenkung nach Theorie II. Ordnung.",
    grenzen: [
      "Ideal-elastischer Stab ohne Fließen und ohne Knicklinien (keine χ-Abminderung).",
      "Vorkrümmung w₀ = l/300 pauschal.",
      "Biegelinie im Diagramm qualitativ.",
    ],
  },
  energieausweis: {
    kurz: "Grobe Abschätzung von Heizwärme-, End- und Primärenergiebedarf, CO₂ und Effizienzklasse.",
    grenzen: [
      "Hüllflächen pauschal aus der Nutzfläche, U-Werte je Standard fest.",
      "Klimafaktor und Gewinne pauschal; Warmwasser, Verluste und Hilfsstrom als feste Werte.",
      "Kein Nachweis nach DIN V 18599.",
    ],
  },
  materialoptimierung: {
    kurz: "GWP (A1–A3) eines Referenzbauteils im Vergleich mit einer optimierten Variante.",
    grenzen: [
      "Beton- und Stahlmengen je Bauteil fest hinterlegt, keine Bemessung.",
      "Beton-GWP nur nach Zementart, unabhängig von der Festigkeitsklasse.",
      "Bewertungsklassen über modellinterne Schwellen.",
    ],
  },
  oekobilanz_lca: {
    kurz: "GWP (A1–A3) und Transport (A4) einer Materialmenge aus der EPD-Musterdatenbank.",
    grenzen: [
      "EPD-Werte sind Lehr- und Mittelwerte, keine Produktdaten; Projektwerte aus EPD bzw. ÖKOBAUDAT.",
      "Transport A4 mit festem Emissionsfaktor je t·km und Verkehrsmittel, ohne Leerfahrten.",
      "Keine Nutzungs- und Entsorgungsphase; die Gebäudebilanz mit B4, B6 und C3/C4 bietet der LCA-Rechner.",
    ],
  },
  lca_rechner: {
    kurz: "Vereinfachte Gebäude-Ökobilanz nach QNG-Bilanzregeln je m² NRF(R) und Jahr: A1–A3, B4, C3/C4, Sockel TGA und B6; A4 und Modul D getrennt; dazu Kreislaufkennzahlen, Wandaufbau-GWP und QNG-Abschätzung.",
    grenzen: [
      "Lehrdatenbank mit 17 Baustoffen (Mittelwerte, keine Produkt-EPD); C3 und C4 zusammengefasst; Mengen sind vom Nutzer anzugeben, keine Mengenermittlung.",
      "B4 mit n = ⌈50/ND⌉ − 1 und BNB-Nutzungsdauern (Stand 24.02.2017); Zuordnungen für Hanfkalk, Stroh, Lehmplatten, Geopolymer und WDVS vorläufig.",
      "B6: Endenergie nach GEG ist einzugeben (keine Energiebilanz); Netzstrom 0,532 kg/kWh aus einem öffentlichen QNG-Beispielbericht zurückgerechnet (vorläufig).",
      "Keine Gas-, Öl- oder Pelletkessel im Gebäude (QNG-Rechenwerte nicht öffentlich abgedruckt); Fernwärme nach QNG-Anhang 3.4; TGA nur als Sockelbetrag (Tab. 6).",
      "„Eingehalten“ nur mit B4 und B6, 50 a und Wohngebäude; Nichtwohngebäude mit Lehrwert. Kein QNG-Nachweis, kein Ersatz für die Bilanz einer Zertifizierungsstelle.",
      "Modul D und Urban-Mining-Index mit modellinternen Gewichtungen, D nur für den Ersteinbau; A4 pauschal je t·km auf die gesamte Masse.",
    ],
  },
  lca_ingenieurbau: {
    kurz: "Lebenszyklus-GWP einer Spannbeton-Hohlkasten- und einer Stahlverbundbrücke je m² Deckfläche einschließlich Austauschzyklen (B2–B5) und Stauemissionen (B8).",
    grenzen: [
      "GWP-Kennwerte je m² Deckfläche fest hinterlegt, keine Mengenermittlung oder Bemessung.",
      "Austauschzyklen fest (Belag 15, Lager 30, Korrosionsschutz 25 Jahre), Anzahl abgerundet.",
      "Stauemissionen pauschal 0,95 kg CO₂-Äq. je verzögertem Lkw und 40 % des Schwerverkehrs betroffen.",
    ],
  },
  lca_regulatorik: {
    kurz: "CRREM-Stranding-Jahr eines Büro- oder Wohngebäudes für vier Sanierungsstufen.",
    grenzen: [
      "Zielpfade als lineare Interpolation vereinfachter CRREM-Stützwerte, nicht die aktuellen länderspezifischen Pfade.",
      "Minderung je Sanierungsstufe pauschal (15, 35 oder 75 %), sofort wirksam und über die Zeit konstant.",
      "Kein Netzdekarbonisierungs-Effekt auf den Bestand.",
    ],
  },
  lebenszyklus_kosten: {
    kurz: "Barwertvergleich der Lebenszykluskosten zweier Optionen (Barwertmethode wie BNB 2.1.1) mit Energie- und allgemeiner Preissteigerung, CO₂-Schattenpreis und Förderung.",
    grenzen: [
      "Fester Zinssatz und konstante Preissteigerungen; Steigerung schon ab Jahr 1 (BNB 2.1.1: ab Jahr 2).",
      "Kein Restwert für Bauteile, deren Lebensdauer über das Betrachtungsende hinausreicht.",
      "Förderung nur für Option B als Abzug von der Investition.",
      "Instandhaltung und Ersatz in festen Intervallen, nicht im letzten Jahr; Ersatz bepreist die Herstellungsemissionen erneut.",
      "Kostenkennwerte der Szenarien sind Lehrannahmen; keine Wirtschaftlichkeitsberechnung nach DIN 18960 oder ISO 15686-5.",
    ],
  },
  korrosion: {
    kurz: "Chloridprofil nach dem 2. Fickschen Gesetz mit Alterung, Karbonatisierungsfront x = K·√t, Umrechnung von Schnelltests und Faraday-Abtrag im Lokalelement-Lehrmodell.",
    grenzen: [
      "Chlorid: Fehlerfunktionslösung mit konstantem C_s und D_app(t) = D₀·(t₀/t)^a ohne k_e und k_t; kritischer Gehalt 0,5 M.-% v. z. als Orientierungswert.",
      "Karbonatisierung deterministisch mit dem Wurzel-t-Gesetz; Feuchte, Beregnung und Streuung von Deckung und Material bleiben unberücksichtigt.",
      "Lebensdauersimulator (Dauerhaftigkeit): t_krit = (c/k)² auf ganze Jahre gerundet, k-Werte der Schnellwahl als Lehrwerte; über 200 Jahre nicht abgesichert.",
      "Schnelltest-Umrechnung nur über die CO₂-Konzentration (K ∝ √c) – Größenordnung, kein Normwert.",
      "Lokalelement: i_corr, Rostvolumenfaktor 2,5, E_eff = 12 000 MPa und Schadensschwellen sind qualitative Lehrannahmen; Abtrag 11,6 µm/a je µA/cm² (Faraday, Eisen).",
    ],
  },
  glas: {
    kurz: "Bruchwahrscheinlichkeit nach Weibull, Schubverbund und effektive Dicke von VSG (Verfahren nach Wölfel/Bennison) sowie thermische Zwängungsspannung.",
    grenzen: [
      "Weibull mit σ₀ = 1,5 · f_g,k als Lehrmodell; keine Normgröße, keine Lastdauer- oder Oberflächeneinflüsse.",
      "VSG fest 2 × 8 mm mit 1,52 mm PVB und 1 m Stützweite; Schubmoduln stark vereinfachte Lehrwerte, maßgebend sind Zulassung bzw. EN 16613.",
      "Effektive Dicke nur für die Durchbiegung (h_ef,w); β = 9,6 gilt für Einfeldträger unter Gleichlast.",
      "Kein Standsicherheitsnachweis der Verglasung nach DIN 18008.",
    ],
  },
  holz: {
    kurz: "Gleichgewichtsfeuchte, Feuchteangleich und anisotropes Schwinden von Holz sowie Bemessungswerte der Festigkeiten, Druck unter Winkel (6.16) und k_def nach DIN EN 1995-1-1.",
    grenzen: [
      "Gleichgewichtsfeuchte als Polynom-Lehrmodell (bei 20 °C/65 % rund 13,7 % statt üblicher 12 %), Temperaturkorrektur −1 % je K, begrenzt auf 30 % Fasersättigung.",
      "Feuchteangleich exponentiell mit τ = 15 d · (d/20 mm)²; Kalibrierung als Lehrannahme, ohne Oberflächenbeschichtung und Feuchtegradient.",
      "Schwinden linear mit differentiellen Schwindmaßen je Richtung; Verdrehen, Rissbildung und Jahrringlage nur in der 3D-Darstellung qualitativ.",
      "Festigkeitswerte für ausgewählte Klassen, γ_M = 1,3; kein Bauteilnachweis.",
    ],
  },
  bp_holzprodukte: {
    kurz: "Einfeldbalken unter Gleichlast aus Vollholz oder BSH: Biegung, Schub mit k_cr und Anfangsdurchbiegung nach DIN EN 1995-1-1 mit NA (DE).",
    grenzen: [
      "k_mod = 0,8 (NKL 1, mittlere Lasteinwirkung), γ_G = 1,35, γ_Q = 1,5; nur eine Lastfallkombination.",
      "Durchbiegung w_inst mit E_0,mean und der charakteristischen Kombination gegen l/300; Kriechen (w_fin, k_def) und Schwingungen fehlen.",
      "Kein Kipp-, Auflager- oder Querdrucknachweis; Rohdichten für das Eigengewicht als Mittelwerte.",
    ],
  },
  waermeeigenschaften: {
    kurz: "Wärmespeicherfähigkeit ρc, Temperaturleitfähigkeit a, Wärmeeindringkoeffizient b und Kontakttemperatur eines Stoffs sowie erforderliche Dämmdicke für einen Ziel-U-Wert.",
    grenzen: [
      "Kontakttemperatur für halbunendliche Körper mit Lehrwerten der Haut (b = 1100 J/(m²K√s), 33 °C) und Stoff bei 20 °C.",
      "Dämmdicke für eine einschalige Bestandswand mit R_si + R_se = 0,17 m²K/W; Wärmebrücken, Befestiger und Luftschichten werden nicht berücksichtigt.",
    ],
  },
  bauwerkserfassung: {
    kurz: "Druck- und Biegeausnutzung eines verformten Holzsparrens mit gemessener Vorverformung e₀ und Moment nach Theorie II. Ordnung im Vergleich zum idealisiert geraden Stab.",
    grenzen: [
      "Lineare Interaktion σ_c/f_c,0,d + σ_m/f_m,d; der Ersatzstabnachweis mit k_c nach 6.3.2 ist gesondert zu führen.",
      "Vergrößerungsfaktor 1/(1 − N/N_cr) mit N_cr aus E_0,mean und Knicklänge = Stablänge; keine Abminderung der Steifigkeit.",
      "k_mod = 0,9 (kurze Lasteinwirkung), γ_M = 1,3; Vorverformung als Stich in Feldmitte, Querschnitt ungeschwächt.",
    ],
  },
  modernisierung: {
    kurz: "U-Wert nach Zusatzdämmung, Vergleich mit dem GEG-Höchstwert, Endenergieeinsparung, Kosten, CO₂ und statische Amortisation.",
    grenzen: [
      "U_neu = 1/(1/U_alt + d/λ) ohne Korrekturen nach DIN EN ISO 6946.",
      "Arbeitskosten pauschal 85 €/m², CO₂-Faktor 0,22 kg/kWh fest.",
      "Statische Amortisation ohne Zins und Preissteigerung.",
    ],
  },
  bauwerksuntersuchung: {
    kurz: "Prüfumfang, Bewertung von Befunden und einfache Prüfverfahren (Rückprall, Ultraschall, Karsten, Karbonatisierung, Bohrkern, Impact-Echo).",
    grenzen: [
      "Prüfumfang über Faustformeln aus der Fläche.",
      "Bewertung mit festen Schwellen (Chlorid, Potential, Festigkeit, Haftzug).",
      "Rückprall-Festigkeit nach Lehr-Näherung; Karbonatisierung nach √t-Gesetz ohne Klima- und Feuchteeinfluss.",
    ],
  },
  boden_materialaufbereitung: {
    kurz: "Tonnage, Untersuchungseinheiten, Misch- und Einzelproben nach LAGA PN 98 sowie Probenmassen eines Haufwerks.",
    grenzen: [
      "Untersuchungseinheit höchstens 3000 m³.",
      "Einzelprobenmasse mit fest 1,6 t/m³, unabhängig von der eingegebenen Dichte.",
      "Rückstellproben pauschal.",
    ],
  },
  ressourceneffizienz: {
    kurz: "CO₂ und Primärgesteinsbedarf eines Bauteils im Vergleich mit einem Standardfall sowie eine grobe Kosten-Nutzen-Schätzung.",
    grenzen: [
      "Bauteilvolumen, Optimierungs- und RC-Anteile pauschal.",
      "Feste CO₂-Faktoren für Beton, Stahl und Transport.",
      "Kosten-Nutzen-Werte und Förderbonus sind fiktive Lehrwerte.",
    ],
  },
  vdi6200: {
    kurz: "Zustandsnote aus den Einzelbewertungen S/V/D in Anlehnung an RI-EBW-PRÜF.",
    grenzen: [
      "Stark vereinfachter Algorithmus, nicht der Algorithmus von SIB-Bauwerke.",
      "Bezug auf Brückenprüfung (DIN 1076), nicht auf das Notensystem der VDI 6200.",
      "Die Schulnoten-Zuordnung ist keine Regelwerksgröße.",
    ],
  },
  rechnung_u_wert: {
    kurz: "U-Wert einer dreischichtigen Wand mit Vergleich zum Grenzwert.",
    grenzen: [
      "R_si = 0,13 und R_se = 0,04 m²K/W fest.",
      "Homogene Schichten ohne Wärmebrücken und Korrekturen.",
    ],
  },
  rechnung_beton: {
    kurz: "Mischungsentwurf nach der Stoffraumrechnung, k-Wert-Ansatz, Frischbetontemperatur und Festigkeitsentwicklung.",
    grenzen: [
      "Wasseranspruch tabelliert, Rohdichten und Luftgehalt fest.",
      "Nur die Expositionsklassen XC4 und XD3.",
      "Reife mit konstanter Temperatur (Arrhenius).",
    ],
  },
  rechnung_stahlbeton: {
    kurz: "Biegebemessung eines Rechteckquerschnitts mit dem µ-Verfahren.",
    grenzen: [
      "Nur Zugbewehrung, keine Druckbewehrung; oberhalb µ_lim nur Warnung.",
      "Ohne Mindest- und Höchstbewehrung, Querkraft und Gebrauchstauglichkeit.",
    ],
  },
  rechnung_holzbau: {
    kurz: "Knicknachweis einer Vollholzstütze nach dem Ersatzstabverfahren.",
    grenzen: [
      "Knicklänge gleich Stützenlänge (Euler-Fall 2).",
      "Nur zentrischer Druck, ohne Biegung.",
    ],
  },
  rechnung_mauerwerk: {
    kurz: "Vertikale Tragfähigkeit einer zweiseitig gehaltenen Mauerwerkswand im vereinfachten Verfahren nach DIN EN 1996-3/NA mit Φ = min(Φ1; Φ2).",
    grenzen: [
      "Nur zweiseitig gehaltene Wände unter Massivdecken, Normalkraft je Meter; keine Biegung aus Wind, keine Teilflächenpressung, kein Schub.",
      "f_k aus öffentlich zugänglichen Herstellertafeln (KS, HLz B) oder frei eingegeben; Werte vorläufig bis zur Prüfung am NA-Normtext.",
      "h_ef = ρ2·h mit ρ2 = 0,75/0,90/1,0 nach Wanddicke (bei a < t: 1,0) – aus Herstellertafeln zurückgerechnet, vorläufig.",
      "Anwendungsgrenzen nach Tab. NA.2 (Gebäudehöhe, Nutzlast, Wandhöhe, Windzone) nur teilweise geprüft: l_f ≤ 6,0 m, h ≤ 2,75 m, h_ef/t ≤ 27.",
    ],
  },
  rechnung_nachhaltigkeit: {
    kurz: "CO₂-Aufnahme durch Karbonatisierung und GWP-Vergleich zweier Zemente.",
    grenzen: [
      "Karbonatisierung nach √t-Gesetz mit konstantem k.",
      "GWP-Vergleich nur über den Zement.",
    ],
  },
  rechnung_bestand: {
    kurz: "f_ck und f_cd aus historischen Betonklassen sowie Fließkraft historischer Betonstähle.",
    grenzen: [
      "Pauschale Umrechnung der Würfelfestigkeit auf den Zylinderwert.",
      "Prüfwerte ohne statistische Auswertung einer Klasse zugeordnet.",
    ],
  },
  rechnung_schallschutz: {
    kurz: "Schalldämm-Maß einer einschaligen Massivwand und Vergleich mit Anforderungswerten.",
    grenzen: [
      "Massekurve mit Ersatzformel unterhalb 150 kg/m², Putz pauschal 40 kg/m².",
      "Flankenübertragung als pauschaler Abzug, keine Rechnung nach DIN 4109-2.",
    ],
  },
  rechnung_brandschutz: {
    kurz: "Biegenachweis eines Holzbalkens im Brandfall mit reduziertem Querschnitt.",
    grenzen: [
      "Zerrüttungsschicht k₀·d₀ pauschal 7 mm, Reduktionsbeiwert η_fi pauschal 0,6.",
      "Beton nur als statische Tabelle.",
    ],
  },
  aufgaben_trainer: {
    kurz: "Zufallsaufgaben mit Prüfung der Antwort über eine relative Toleranz.",
    grenzen: [
      "Toleranz ±2–3 % zum gerundeten Sollwert.",
      "Feste Annahmen je Aufgabentyp (z. B. Zylinder 150/300 mm, E = 210 000 MPa).",
    ],
  },
  online_tools: {
    kurz: "Linkkatalog mit Filter; keine Berechnung.",
    rechnet: false,
    grenzen: [],
  },
  dpp: {
    kurz: "Informationsmodul zu Produktpass und EPD; keine Berechnung.",
    rechnet: false,
    grenzen: [],
  },
  ki_prompting: {
    kurz: "Prompting-Inhalte ohne Rechenlogik.",
    rechnet: false,
    grenzen: [],
  },
  px_bautagebuch: {
    kurz: "Formular für ein Bautagebuch; keine Berechnung.",
    rechnet: false,
    grenzen: [],
  },
  formaenderungen: {
    kurz: "Systematik und qualitative Darstellung der Formänderungen; keine Berechnung.",
    rechnet: false,
    grenzen: [],
  },
  baustatik: {
    kurz: 'Schnittgrößen von Einfeldträger, Kragarm und Zweifeldträger sowie Auflagerkräfte eines Dreigelenkrahmens.',
    grenzen: [
      'Linear-elastisch, Theorie I. Ordnung, Biegesteifigkeit EI über die Länge konstant.',
      'Je eine Gleichlast, Einzellast und ein Einzelmoment; keine Lastfallkombinationen.',
    ],
  },
};

/** Grenzen für ein Modul; Unterreiter der Stahlbetonbemessung erben den Eintrag */
export const STAHLBETON_REITER = ['spannung', 'biegebemessung', 'querkraftbemessung', 'stuetzenbemessung', 'durchstanzen', 'verankerungslaenge', 'rissbreite'];
export function grenzenFuer(id: string): RechnerGrenzen | undefined {
  return RECHNER_GRENZEN[id] ?? (STAHLBETON_REITER.includes(id) ? STAHLBETON : undefined);
}
