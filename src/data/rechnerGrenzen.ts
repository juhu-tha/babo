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
  ],
};

export const RECHNER_GRENZEN: Readonly<Record<string, RechnerGrenzen>> = {
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
      'Glaser-Verfahren vereinfacht: Wand mit R_si = 0,13 und R_se = 0,04 m²K/W, eine Tauwasserebene an einer Schichtgrenze, Verdunstungsklima 12 °C / 70 % über 90 Tage; die Randbedingungen der DIN 4108-3:2024 weichen ab.',
      'Stationäre Betrachtung ohne Feuchtespeicherung und kapillaren Transport.',
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
      "Angloamerikanische Faktoren gerundet (lbf 4,44822; psi 6894,76; lb 0,453592; kcal 4186,8 J).",
      "Keine Plausibilitätsprüfung: Temperaturen unter 0 K und negative Längen werden umgerechnet.",
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
    kurz: "Brand mit reduziertem Querschnitt und Eigenfrequenz einer Brettsperrholzdecke.",
    grenzen: [
      "Brand: feste Abbrandraten, nur Restquerschnitt und Widerstandsmoment, keine Tragfähigkeit.",
      "Schwingung: volle Plattendicke ohne Abminderung der Querlagen, nur Frequenzkriterium f₁ > 8 Hz.",
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
      "Keine Nutzungs- und Entsorgungsphase.",
    ],
  },
  lca_rechner: {
    kurz: "Vereinfachte Gebäude-Ökobilanz A1–A3, A4 und C (optional D) je m² NRF und Jahr mit Kreislaufkennzahlen, Wandaufbau-GWP und QNG-Abschätzung.",
    grenzen: [
      "Ohne Ersatz (B4) und Betrieb (B6) im CO₂-Rechner – kein QNG-Nachweis; QNG-Schwellen nur als Lehrwert.",
      "Transport A4 pauschal je t·km auf die gesamte Masse.",
      "Modul D und Urban-Mining-Index mit modellinternen Gewichtungen.",
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
    kurz: "Barwertvergleich der Lebenszykluskosten zweier Optionen.",
    grenzen: [
      "Fester Zinssatz und konstante Preissteigerungen.",
      "Kein Restwert für Bauteile, deren Lebensdauer über das Betrachtungsende hinausreicht.",
      "Förderung nur für Option B als Abzug von der Investition.",
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
    kurz: "Vertikale Tragfähigkeit einer Mauerwerkswand mit dem vereinfachten Abminderungsbeiwert Φ.",
    grenzen: [
      "h_ef = lichte Höhe, ohne Halterung durch Decken.",
      "f_k fest für zwei Steinarten, f_d = f_k/1,5 ohne weitere Beiwerte.",
      "Keine Exzentrizität aus dem Deckenauflager; fachliche Überarbeitung mit AP 4.7.",
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
