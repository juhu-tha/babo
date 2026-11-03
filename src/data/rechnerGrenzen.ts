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
    'Rechteckquerschnitte bis C50/60 (λ = 0,8, η = 1,0); darüber im Kern λ, η, ε_cu3 nach EC2 3.1.7/Tab. 3.1 und ξ_lim = 0,35 (vorläufig); weitere NA-Regeln für hochfesten Beton fehlen.',
    'f_cd zentral = α_cc·f_ck/γ_c (α_cc = 0,85, γ_c = 1,5); Zusatzabminderung ab C55/67 vorbereitet, aber aus (Normtext ausstehend); Hochfestigkeit über λ, η, ξ_lim = 0,35.',
    'Biegung: eine Zug- und eine Druckbewehrungslage, ξ_lim = 0,45; nichtmetallische Bewehrung vereinfacht linear-elastisch, maßgebend ist die Zulassung.',
    'Querkraft: z = min(0,9·d; max(d − c_v,l − 30 mm; d − 2·c_v,l)) nach NA DE, NCI zu 6.2.3(1) (c_v,l Standard 3,5 cm, einstellbar); senkrechte Bügel, ohne Normalkraft (σ_cp = 0).',
    'Stütze: Theorie I. Ordnung mit e_i = l₀/400 und Mindestausmitte; bei λ > λ_lim nur Hinweis, kein Nachweis nach Theorie II. Ordnung.',
    'Stütze: Interaktion mit Parabel-Rechteck-Diagramm (n = 2, ε_c2 = 2 ‰, ε_cu2 = 3,5 ‰), zwei symmetrische Lagen, ε_ud unbegrenzt; Spannungsblock nur Vergleich (bei |ν| > 0,8 bis rund 10 % unsicher).',
    'Durchstanzen: nur Flachdecken; Fundamente und Bodenplatten (NA DE 6.4.4(2)) sind nicht abgebildet.',
    'Durchstanzen: konstantes β nach NA DE 6.4.3(6) (1,10/1,40/1,50; unverschiebliche Systeme, Stützweiten ±25 %), keine genauere β-Ermittlung; keine Öffnungen, keine Bodenpressung, ohne erhöhte κ_sw der ersten Reihen.',
    'Durchstanzen: Rand-/Eckstützen mit u₁ nach EC2 Bild 6.15 (Rand parallel zu c_x; Ecke mit gleichem Abstand zu beiden Rändern; runde Stützen sinngemäß); u₀ nach 6.4.5(3) nur Anzeige.',
    'Querkraft/Verankerung: ρ_w,min = 0,16·f_ctm/f_yk nach NA DE Gl. (9.5aDE); gegliederte Querschnitte mit vorgespanntem Zuggurt (9.5bDE) sind nicht abgebildet.',
    'Verankerung: NA-Form l_bd = α₁·α₄·α₅·l_b,rqd·A_s,erf/A_s,vorh, α₅ = 2/3 bei direkter Lagerung, Mindestwerte ohne 100 mm; α₆ nach NA DE Tab. 8.3DE; l₀,min nach (8.11) (vorläufig, Normprüfung ausstehend).',
    'Rissbreite: direkte Berechnung mit einer Bewehrungslage; bei Stababständen > 5·(c + φ/2) gilt 7.3.4(4) (nur Hinweis).',
    'σ-ε-Linien: Parabel-Rechteck und Gl. (3.14) mit den Parametern der Tab. 3.1 bis C90/105 (darüber auf C90/105 gehalten); Betonstahl B500 bilinear mit E_s = 200 000 N/mm² und ε_ud = 25 ‰ (NA DE).',
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
  ec_kennwerte: {"kurz": "Kennwerte einer Festigkeitsklasse und Bemessungswert nach Eurocode mit NA DE (Beton, Betonstahl, Baustahl, Holz, Mauerwerk) sowie charakteristischer Wert als 5-%-Quantil aus einer Prüfserie nach DIN EN 1990, Anhang D.", "grenzen": ["Nur Baustoffwerte; kein Bauteilnachweis (Querschnitt, Stabilität, Verbindungen, Verankerung).", "Beton bis C50/60 im Rechner; hochfeste Betone, Leichtbeton und Spannstahl nicht abgebildet. Ständige/vorübergehende und außergewöhnliche Situation; keine Brand- und Erdbebensituation.", "Baustahl außergewöhnlich mit γ_M0/γ_M1/γ_M2 wie ständig, Holz außergewöhnlich γ_M = 1,0 und ζ = 1,0 für kurzzeitige Last im Mauerwerk: vorläufig, Normprüfung ausstehend.", "Prüfserie: unabhängige Werte aus einer Grundgesamtheit, Normal- oder Lognormalverteilung; k_n nach Tab. D1 (Zwischenwerte linear in 1/n); keine Ausreißerprüfung, keine Konformitätsbewertung nach DIN EN 206.", "Mauerwerk: Tafelwerte f_k nach DIN EN 1996-3/NA aus Herstellerunterlagen; KS P und KS L-P vorläufig."]},
  lebensdauerbemessung: {"kurz": "Versagenswahrscheinlichkeit p_f(t) und Zuverlässigkeitsindex β(t) für den Grenzzustand Depassivierung (Karbonatisierung oder Chlorid nach fib Bulletin 34) per Monte-Carlo-Simulation, mit erforderlicher Betondeckung und rechnerischer Lebensdauer.", "grenzen": ["Nur Einleitungsphase bis zur Depassivierung; Schädigungsphase, Rissbildung, Abplatzungen und Querschnittsverlust sind nicht berechnet.", "Kennwerte sind Lehrwerte nach fib Bulletin 34 (Sekundärquellen), vorläufig; einzelne D_RCM,0-Werte, Streuung von R⁻¹_ACC,0, K_AC → R⁻¹, p_SR, ToW, C_S, C₀ und Temperaturstreuung vorläufig, Normprüfung ausstehend.", "Übernommene Werte der Einzelrechner werden geprüft; K nach dem Wurzel-t-Gesetz dient nur zum Vergleich, a wird auf das nächstliegende Bindemittel abgebildet.", "Ungerissener Beton, unlegierter Betonstahl, konstante Umgebung; keine Kombination von Karbonatisierung und Chlorid, keine Instandsetzung.", "Basisvariablen unabhängig; Monte-Carlo mit festem Startwert, β bei p_f = 0 nur als Untergrenze; Zeitachse in Schritten von 1 Jahr.", "Kein Nachweis nach den eingeführten Regeln: maßgebend bleiben Expositionsklasse, c_min,dur und Betonzusammensetzung nach DIN EN 1992-1-1/NA und DIN 1045-2."]},
  sommerlicher_waermeschutz: {"kurz": "Vorhandener und zulässiger Sonneneintragskennwert eines Raums nach dem vereinfachten Verfahren der DIN 4108-2:2013-02 mit Prüfung der Verzichtsregeln.", "grenzen": ["Tabellenwerte S1 bis S6 und F_C nach DIN 4108-2:2013-02 (Wiedergabe in KS-Planungshandbuch und BVRS-TR Sonnenschutz); die Neuausgabe 2026-05 ist nicht abgeglichen.", "F_C aus Tab. 7 als Anhaltswert; produktspezifische g_tot-Werte und Teilverschattung durch Vorsprünge (F_S nach DIN V 18599-2) werden nicht abgebildet.", "S3, S4 und S5 flächenanteilig; f_neig und f_nord auf die gesamte Fensterfläche bezogen; Nordwest und Nordost zählen in Tab. 6 zur 10-%-Gruppe.", "Nicht anwendbar bei Doppelfassaden, transparenter Wärmedämmung, unbeheizten Glasvorbauten, Hallen und mehrgeschossigen offenen Räumen; dort thermische Simulation nach 8.4.", "Bauart wird vorgegeben; C_wirk/A_G ist gesondert zu ermitteln. Die Raumtiefe ist bei A_G auf das Dreifache der lichten Raumhöhe zu begrenzen."]},
  membranen_etfe: {"kurz": "Membrankraft gewölbter Membranstreifen und Kissen unter Innendruck nach der Kesselformel (Zylinder n = p·r, Kugel n = p·r/2) und Vergleich mit einer zulässigen Membrankraft.", "grenzen": ["Membrantheorie für Kreiszylinder bzw. Kugel mit konstantem Radius; reale Kissen sind doppelt gekrümmt mit veränderlichen Radien, die Formfindung bleibt unberücksichtigt.", "Radius aus Spannweite und Stich als Kreisbogen; Dehnung der Membran unter Last (Zunahme des Stichs) nicht berücksichtigt (Theorie I. Ordnung).", "Festigkeiten (ETFE: Spannung bei 10 % Dehnung, Gewebe: Kurzzeitzugfestigkeit) und Gesamtsicherheitsbeiwert sind Lehrwerte; die Bemessung erfolgt mit Abminderungsbeiwerten nach abZ/aBG bzw. vBG oder CEN/TS 19102.", "Kein Nachweis von Nähten, Klemmprofilen, Randseilen, Weiterreißen, Kriechen, Temperatur oder Schneesack; bei mehrlagigen Kissen ist die maßgebende Druckdifferenz je Lage selbst anzusetzen."]},
  korrosionsschutz_beschichtungen: {"kurz": "Schutzdauer einer Zinkschicht aus Schichtdicke und Zinkabtragsrate je Korrosivitätskategorie, optional als Duplex-System, im Vergleich mit der Schutzdauerklasse.", "grenzen": ["Lineares Modell t = d_Zn / r_corr mit den Erstjahresraten nach DIN EN ISO 9223; der tatsächliche Langzeitabtrag (DIN EN ISO 9224) ist meist etwas geringer.", "Maßgebend ist die obere Abtragsrate der Kategorie; örtliche Einflüsse (Kondensat, Spritzwasser, Mikroklima) sind nicht erfasst.", "Synergiefaktor des Duplex-Systems und Schutzdauer der Beschichtung sind Literatur- bzw. Lehrwerte, keine Normwerte.", "Keine Bemessung von Beschichtungssystemen nach den Systemtabellen der DIN EN ISO 12944-5; Im-Kategorien sind nicht berechenbar."]},
  altholz_urban_mining: {"kurz": "Massenbilanz einer sensorgestützten Altholzsortierung in eine stoffliche und eine energetische Linie mit Fehlsortierquote, Reinheit, A-IV-Anteil und stofflicher Verwertungsquote.", "grenzen": ["Zwei-Linien-Modell: A I/A II gelten als Ziel der stofflichen, A III/A IV als Ziel der energetischen Linie; die stoffliche Verwertung von A III nach Entfernen der Beschichtung ist nicht abgebildet.", "Ein konstantes Ausbringen je Kategorie; Stückgrößen, Bandbelegung, Mehrfachsortierung und Verwechslungen innerhalb einer Linie (z. B. A I gegen A II) sind nicht modelliert.", "Die Warnschwellen für den A-IV-Anteil (0,5 %) und die Fehlsortierquote (10 %) sind Lehrannahmen. Maßgebend für Holzwerkstoffe sind die Schadstoffgrenzwerte nach Anhang II AltholzV, nachgewiesen durch Analyse.", "Die Kategorie ist im Rechner als bekannt vorausgesetzt; in der Praxis hängt sie auch von Herkunft und Regelzuordnung nach Anhang III AltholzV ab."]},
  pfas_baustoffe: {"kurz": "Summen PFAS-20 und PFAS-4 einer Wasserprobe und Vergleich mit den Grenzwerten der TrinkwV (100 ng/l ab 12.01.2026, 20 ng/l ab 12.01.2028), mit Spanne durch Werte unter der Bestimmungsgrenze.", "grenzen": ["Nur die 20 Einzelstoffe der TrinkwV; andere PFAS, Vorläufer und Summenparameter (AOF, TOP-Assay) sind nicht erfasst.", "Eine gemeinsame Bestimmungsgrenze für alle Stoffe; reale Labore geben stoffspezifische Bestimmungsgrenzen und Messunsicherheiten an.", "Der Ansatz der Werte unter der Bestimmungsgrenze (0, BG/2, BG) ist eine Lehrvariante; maßgebend sind die Vorgaben der TrinkwV und des Labors.", "Die Grenzwerte gelten für Trinkwasser. Für Grundwasser, Eluate von Bauschutt und Bodenmaterial gelten andere Bewertungsmaßstäbe (z. B. Leitfaden zur PFAS-Bewertung)."]},
  keramik_ziegel: {"kurz": "Wasseraufnahme E_b, Fliesengruppe nach DIN EN 14411, Rohdichte sowie offene und Gesamtporosität aus Trocken-, Nass- und Unterwasserwägung.", "grenzen": ["Ein Sättigungszustand für alle Größen; die Norm unterscheidet Kochverfahren (E_b) und Vakuumverfahren (E_v). Prüfkörperanzahl und Mittelung sind nicht abgebildet.", "Dichte des Wassers fest 1,0 g/cm³; keine Temperaturkorrektur der Unterwasserwägung.", "Gruppe nur aus E_b und Formgebung; die Unterteilung AIIa/AIIb in Teil 1 und 2 sowie weitere Anforderungen (Bruchkraft, Frost) werden nicht geprüft.", "Für Mauerziegel gelten andere Prüfverfahren (DIN EN 772-21, DIN EN 772-7); die Fliesengruppe dient dort nur zum Vergleich."]},
  stahlbau_ec3: {"kurz": "Querschnittsklasse, Querschnittswiderstände und Biegeknickwiderstand N_b,Rd gewalzter I-Profile unter zentrischem Druck nach DIN EN 1993-1-1 mit NA (DE).", "grenzen": ["Zentrischer Druck ohne Biegemomente; Biegedrillknicken, Drillknicken und die Interaktion nach 6.3.3 sind nicht enthalten.", "Querschnittsklasse 4 wird nur erkannt; der Nachweis mit wirksamer Fläche A_eff nach DIN EN 1993-1-5 fehlt (Ergebnis auf der unsicheren Seite).", "Nennwerte f_y und f_u für Erzeugnisdicken t ≤ 40 mm (Tab. 3.1); S460 als S460N/NL nach DIN EN 10025-3.", "Auswahl auf zehn IPE-, HEA- und HEB-Profile beschränkt; die Knicklängen L_cr sind vorzugeben und werden nicht aus Lagerung oder Rahmensystem ermittelt."]},
  stahlbeton_bemessung: STAHLBETON,
  // Spannbeton in zwei Teilmodulen (28.10.2026): Grenzen des früheren Moduls „spannbeton“ nach Reitern verteilt
  spannbeton_kennwerte: {
    kurz: 'Spannkraftverluste (Reibung, Keilschlupf, elastische Verkürzung, Kriechen, Schwinden, Relaxation) und Spannungsnachweise eines Rechteckquerschnitts.',
    grenzen: [
      'Einfeldträger mit Nachweisschnitt in Feldmitte, Rechteckquerschnitt ohne Spannglied-Hüllrohrabzug.',
      'Zeitabhängige Verluste nach Gl. (5.46) mit φ(∞,t₀) und ε_cs(∞) nach Anhang B; Relaxation für 500 000 h.',
      'Dekompression als größte Betonspannung an den Grenzen e_p ± max(100 mm; h/10) nach NA DE (EN-Empfehlung: 25 mm), vereinfacht am ungerissenen Querschnitt (Zustand I).',
    ],
  },
  spannbeton_grundlagen: {
    kurz: 'Lehrdemos zur Vorspannung: Dehnungsanimation eines Spannbetonträgers sowie Stauchungsverlust, Lastausgleich und Litzenanzahl im Leitfaden „Von 0 bis 100“.',
    grenzen: [
      'Dehnungsanimation: Lehrträger L = 20 m, 500 × 1000 mm, C40/50 (E_cm, f_ctm aus Tab. 3.1), linear-elastisch am Bruttoquerschnitt; Randzug gegen f_ctm,fl (3.1.8), danach qualitativ.',
      '„Von 0 bis 100“: Verlust durch Betonstauchung Δσ = E·Δε ohne Relaxation; Lastausgleich u = 8·P·f/L²; Litzen = ⌈P/173 kN⌉ (150 mm² · 1360 N/mm², 15 % Verluste als Lehrannahme).',
    ],
  },
  holzbau_bemessung: {
    kurz: 'Knicknachweis von Druckstäben und Querdrucknachweis nach DIN EN 1995-1-1 mit NA (DE).',
    grenzen: [
      'Zentrischer Druck um die schwache Achse; Biegung, Exzentrizitäten und Kippen sind nicht enthalten.',
      'Vollholz nach EN 338 und Brettschichtholz nach EN 14080, γ_M = 1,3; k_mod nach Tab. 3.1.',
      'Querdruck: wirksame Kontaktlänge mit pauschal 30 mm Überstand je Seite.',
      'Querdruck: k_c,90 = 1,5/1,75 bei Einzelauflagern auch am Trägerende, sofern l₁ ≥ 2h (nicht geprüft, Fall „Allgemein“ mit 1,0 wählbar); BSH mit l > 400 mm: k_c,90 = 1,0.',
      'Druckstab: EN 1995-1-1 nennt keine Grenzschlankheit; der Hinweis ab λ > 200 ist eine Lehrgrenze.',
    ],
  },
  bauphysik: {
    kurz: 'U-Wert nach DIN EN ISO 6946, Temperaturverlauf und Temperaturfaktor f_Rsi, sommerlicher Wärmeschutz und Raumakustik (Glaser-Verfahren im Modul Feuchteschutz).',
    grenzen: [
      'Homogene Schichten ohne Wärmebrücken, Befestigungsmittel und Luftschichtkorrekturen.',
      'f_Rsi mit R_si = 0,25 m²K/W in der ungestörten Fläche; Wärmebrücken sind nicht erfasst.',
      'GModG-Höchstwerte (vormals GEG) für die Änderung bestehender Gebäude (Anlage 7).',
      'Phasenverschiebung und Amplitudenverhältnis als Summe d/δ der Schichten (ohne Übergangswiderstände und Reflexionen an Schichtgrenzen) – Größenordnung, kein Rechenverfahren nach DIN EN ISO 13786.',
      'Nachhallzeit nach Sabine (diffuses Schallfeld, ohne Personen und Möblierung); T_soll nach DIN 18041 Gruppe A, Büro als Orientierungswert.',
    ],
  },
  feuchteschutz: {
    kurz: 'Taupunkt, Schimmeltemperatur, s_d-Werte und Tauwassernachweis nach dem Glaser-Verfahren (DIN 4108-3).',
    grenzen: [
      'Sättigungsdampfdruck nach der Magnus-Formel der DIN 4108-3 (über Eis unter 0 °C).',
      'Glaser-Verfahren (Periodenbilanz) mit Tangentenkonstruktion über der s_d-Achse; Tauwasserebenen und -bereiche werden erkannt, die p_sat-Kurve wird je Schicht in 40 Teilpunkten aufgelöst.',
      'Tauperiode nach DIN 4108-3 (seit 2014): 2160 h, innen 20 °C / 50 %, außen −5 °C / 80 %, R_si = 0,25 und R_se = 0,04 m²K/W.',
      'Verdunstungsperiode: 2160 h, p_i = p_e = 1200 Pa, 1700 Pa (Wand) bzw. 2000 Pa (Dach) in der Tauwasserzone.',
      'Klimawerte belegt durch BaunetzWissen und den Forschungsbericht T 3288 (Fraunhofer IRB 2012); Abgleich mit dem Normtext DIN 4108-3:2024-03 offen (vorläufig).',
      'Nicht abgebildet (DIN 4108-3:2024-03): Begrenzung des Verfahrens auf Höhenlagen bis 700 m und neue Außendampfdrücke für verschattete oder helle Dächer (Anhang A).',
      'Mehrere Tauwasserzonen: Verdunstung vereinfacht gemeinsam (innerste Zone nach innen, äußerste nach außen); der zeitliche Ablauf des Austrocknens ist nicht abgebildet.',
      'Nicht geprüft: Feuchteerhöhung von Holz und Holzwerkstoffen, Anwendungsgrenzen (z. B. Gründächer, unbelüftete Dächer mit dichter Deckung), Sonderregeln für Schichten mit sehr kleinem s_d-Wert.',
      'Stationäre Betrachtung ohne Feuchtespeicherung, kapillaren Transport und Konvektion.',
    ],
  },
  schallschutz: {
    kurz: 'Bewertetes Schalldämm-Maß einschaliger massiver Bauteile über die Massekurve nach DIN 4109-32 und bewerteter Norm-Trittschallpegel L′_n,w von Massivdecken mit schwimmendem Estrich nach DIN 4109-2.',
    grenzen: [
      'R_w = 30,9·lg(m′) − 22,2 dB, gültig für 65 ≤ m′ ≤ 720 kg/m².',
      'Nur einschalige, biegesteife Bauteile; Vorsatzschalen, WDVS und Holzbau (Masse-Feder-Masse) werden nicht abgebildet.',
      'Ohne Flankenübertragung, also kein Nachweis von R′_w zwischen Räumen.',
      'Trittschall: L_n,eq,0,w = 164 − 35·lg m′ nur für Massivdecken mit 100 ≤ m′ ≤ 720 kg/m²; keine Holz-, Hohl- oder Rippendecken, keine Unterdecken.',
      'Trittschall: zul. L′_n,w = 50 dB (DIN 4109-1:2018), 53 dB wählbar (DIN 4109:1989); ΔL_w-Näherung, K = 0,6 + 5,5·lg(m′_s/m′_f,m) und Treppenwerte vorläufig (Normprüfung ausstehend); ohne Herstellerprüfwerte und Beläge.',
      'Trittschall: Diagonal- und Treppenübertragung, Schallbrücken und Estrichdröhnen werden nicht abgebildet; u_prog = 3 dB pauschal.',
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
      'k-Wert-Ansatz nach DIN 1045-2 (f/z ≤ 0,33/0,25, s/z ≤ 0,11, Alkalitätsreserve f + s); Zementarten ohne Kennbuchstaben des Hauptbestandteils (CEM II/A, CEM II/B) als Lehrannahme mit der Grenze f/z ≤ 0,25.',
      'k-Wert Hüttensandmehl als Eingabe-Lehrannahme (Voreinstellung 0,4); Anrechnung nur nach abZ/aBG.',
      'XF2/XF4: nur Flugasche anrechenbar, bei gleichzeitiger Zugabe von Silikastaub keine Anrechnung; der verringerte Mindestzementgehalt bei Anrechnung wird nicht geprüft.',
      'Kornrohdichte als ofentrockener Wert (ρ_rd); das Kernwasser (Wasseraufnahme) zählt zur Frischbetonrohdichte, nicht zum wirksamen Wasser.',
      'Mindestzementgehalt ohne Größtkornabhängigkeit (Beton nach Eigenschaften); die Zuschläge für Standardbeton und die Verringerung bei 63 mm sind nicht abgebildet.',
      'CO₂-Werte sind Lehrwerte und ersetzen keine EPD.',
      'Packungsdichte: Siebdurchgänge der Komponenten sind Lehrwerte; geschätzte Packungsdichte und „reales“ Zweikornmodell veranschaulichen nur (kein CPM nach de Larrard).',
      'Walz-Kurven: Abrams-Näherung f = A/5^(w/z) mit A = 100/120/140 N/mm² (Lehrwerte) für w/z 0,35 bis 0,80; ersetzt keine Erstprüfung.',
      'Regelsieblinien A/B/C 8, 16, 32 als Lehrbuchwerte (DIN 1045-2, Anhang L); Ist-Sieblinie nur an den Sieben ab 4 mm aus den Fraktionsanteilen.',
    ],
  },
  stahl: {
    kurz: 'Lehrmodelle zu Baustahl: Abminderung im Brandfall (DIN EN 1993-1-2), Wöhlerlinie (DIN EN 1993-1-9), Walz- und Schweißeigenspannungen, σ-ε-Linien und M_pl,Rd je Stahlgüte.',
    grenzen: [
      'Brandfall: k_y,θ und k_E,θ nach Tab. 3.1 linear interpoliert; die σ-ε-Linie ist trilinear (Plateau bis 2 %, Verfestigung bis 20 %) statt elliptisch und ohne k_p,θ.',
      'Ermüdung: Wöhlerlinie mit Δσ_D bei 5·10⁶ und Δσ_L bei 10⁸ ohne Teilsicherheitsbeiwerte γ_Ff, γ_Mf und ohne Schadensakkumulation; die Neigung m ist frei wählbar.',
      'Walz- und Schweißeigenspannungen sowie die σ-ε-Linien der Stahlsorten sind qualitative Lehrkurven (Parabel- bzw. Gauß-Näherung), keine Prüf- oder Bemessungswerte.',
      'M_pl,Rd = W_pl·f_y/γ_M0 setzt Querschnittsklasse 1 oder 2 voraus; Biegedrillknicken und Interaktion mit Querkraft bleiben unberücksichtigt.',
      'Fe-C-Diagramm: metastabiles Gleichgewicht bei langsamer Abkühlung, Linien geradlinig zwischen Lehrbuch-Eckpunkten; Martensit, Bainit und Legierungseinflüsse sind nicht abgebildet.',
      'Fe-C-Eckpunkte: Standard S = 0,8 % C/723 °C (deutsche Lehrbuchwerte), Umschalter auf 0,76 %/727 °C (Callister) – bestätigt 27.10.2026.',
      'Hebelgesetz bei Raumtemperatur ohne Tertiärzementit; CEV-Grenzwerte nach EN 10025-2:2004 für Nenndicken ≤ 30 mm, die Schweißeignungsskala ist eine Lehrbucheinstufung.',
    ],
  },
  kunststoffe: {
    kurz: 'E-Modul von Kunststoffen über der Temperatur als Lehrmodell je Strukturtyp (amorph, teilkristallin, Elastomer, Duroplast) und Wärmedehnung ΔL = L₀·α_T·ΔT.',
    grenzen: [
      'Logistische Modellkurven mit festen Übergangstemperaturen (z. B. T_g = 100 °C amorph), Duroplast-Plateau oberhalb T_g 80 MPa (Lehrwert, 50–100 MPa); maßgebend sind Produktdatenblätter.',
      'Kurzzeitmodul ohne Zeit- und Lasteinfluss: Kriechen, Relaxation, Alterung und Feuchte sind nicht abgebildet.',
      'Werte unter 0,1 MPa werden für die logarithmische Darstellung auf 0,1 MPa gesetzt (Fließ- bzw. Schmelzbereich ohne Tragfunktion).',
    ],
  },
  bodenmechanik: {
    kurz: 'Zustandsgrenzen, Auswertung des Fließgrenzenversuchs nach Casagrande und Klassifikation nach DIN 18196, Mohr-Coulomb, Erddruck nach Rankine und Konsolidierung nach Terzaghi.',
    grenzen: [
      'Fließgrenze: Ausgleichsgerade w über lg N (Mehrpunktverfahren); Einpunktverfahren mit dem Exponenten 0,121 (ASTM D4318) vorläufig (Normprüfung ausstehend).',
      'Ausrollgrenze als einfacher Mittelwert; die zulässige Streuung von 2 Prozentpunkten ist eine Lehrannahme.',
      'Erddruck: glatte, lotrechte Wand, waagerechtes Gelände, kohäsionsloser Boden ohne Wasser.',
      'Konsolidierung eindimensional mit konstantem c_v und E_s, Näherungsformel für U(T_v).',
      'Klassifikation nur über das Plastizitätsdiagramm, ohne Korngrößenverteilung; organische Beimengungen (OU/OT) nur nach Angabe, ohne Glühverlust.',
      'Zustandsformen nach DIN EN ISO 14688-2 (I_C-Grenzen 0,25 / 0,50 / 0,75 / 1,00); die deutschen Bezeichnungen breiig/weich/steif/halbfest/fest sind am Normtext zu bestätigen (vorläufig, Normprüfung ausstehend).',
      'Atterberg/DIN 18196 – organischer Boden mit w_L > 50 % unterhalb der A-Linie: keine eindeutige Gruppe im Plastizitätsdiagramm; Ausgabe UA mit Prüfhinweis (vorläufig, Normprüfung ausstehend).',
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
      "Linear, nichtlinear, ideal-plastisch, viskoelastisch und Thixotropie/Rheopexie sind qualitative Kurven mit festen Parametern (E = 210 000, f_y = 355 N/mm²).",
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
      "Rückprallhammer: Lehrkurve 0,0125·R^2,22 (ohne Kalibrierkerne nach DIN EN 13791 nur Schätzung), Richtungskorrektur nach Herstellerformel Original Schmidt Typ N, Karbonatisierungsfaktor 0,85 pauschal.",
      "Frischbeton: Ausbreit-/Setzmaß und Bingham-Kennwerte linear aus w/z, Fließmittel und LP.",
    ],
  },
  statistik: {
    kurz: "Mittelwert, Standardabweichung, Median, Variationskoeffizient, Ausreißertests und 5-%-Fraktilwert x_k = m − k_n·s sowie x_d = x_k/γ_M.",
    grenzen: [
      "k_n nach DIN EN 1990 Anhang D (V_X unbekannt), interpoliert; erst ab n ≥ 3.",
      "Grubbs vereinfacht (nicht iterativ): entfernt ab 1-%-Grenze, zwischen 5 % und 1 % nur markiert (ISO 5725-2); die technische Prüfung vor dem Streichen ersetzt der Rechner nicht.",
      "Boxplot-Quartile ohne Interpolation.",
      "Normalverteilung angenommen, keine log-normale Auswertung.",
      "x_d ohne k_mod und ohne Umrechnungsfaktor η.",
      "t-Test: unabhängige, annähernd normalverteilte Werte vorausgesetzt (nicht geprüft); t-Verteilung numerisch (Betafunktion), p-Werte unter 0,0001 nur als Schranke.",
      "t-Test ersetzt keine Konformitätsbewertung nach DIN EN 206/DIN 1045-2; statistische Signifikanz ist nicht gleich technischer Relevanz.",
    ],
  },
  festbeton_statistik: {
    kurz: "f_ck = f_cm − 1,645·σ und f_cd sowie Darstellung der Konformitätskriterien.",
    grenzen: [
      "Normalverteilung mit bekanntem σ, keine Stichprobenkorrektur.",
      "Würfelwerte über f_ck,cube/f_ck der Festigkeitsklassen (Tab. 3.1, linear zwischen den Klassen); σ ≥ 3 N/mm² im Kriterium der stetigen Herstellung.",
      "Es wird keine Stichprobe aus Einzelwerten geprüft, nur Grenzwerte angezeigt.",
    ],
  },
  // Modulprüfung Tranche 4 (28.10.2026): Module, die rechnen, aber nicht als Rechner einsortiert sind
  sicherheitskonzept: {
    kurz: "Bemessungswert der Einwirkungen nach DIN EN 1990, Gl. 6.10, aus einer ständigen und zwei veränderlichen Einwirkungen.",
    grenzen: [
      "Nur Grundkombination Gl. 6.10 (ständige und vorübergehende Situation); keine Gl. 6.10a/b, keine außergewöhnliche oder Erdbebensituation.",
      "Zwei veränderliche Einwirkungen; beide Kombinationen (Q_k,1 bzw. Q_k,2 als Leiteinwirkung) werden gerechnet, das Maximum wird angezeigt.",
      "Eine ständige Einwirkung mit einem γ_G für alle Anteile; günstig wirkende Anteile mit γ_G,inf = 1,00 nur über die Auswahl.",
    ],
  },
  probenahme: {
    kurz: "Bohrmehlmenge je Tiefenstufe, Größtkorn- und Schlankheitsprüfung von Bohrkernen sowie Korrektur und Lehrschätzung des Rückprallwerts.",
    grenzen: [
      "Bohrmehl mit fester Rohdichte 2,2 g/cm³ und Richtwert 5 g je Stufe; die Mindestmenge legt das Prüflabor fest.",
      "Bohrkern: Faktoren nach ASTM C42 nur für 1 ≤ h/d ≤ 2; keine Bewertung der In-situ-Festigkeit nach DIN EN 13791.",
      "Rückprall: Richtungskorrektur Original Schmidt Typ N, Karbonatisierungsfaktor und Lehrkurve 0,0125·R^2,22 sind Lehransätze ohne Kalibrierkerne.",
    ],
  },
  analytik: {
    kurz: "Lehrsimulatoren für die Massenstufen der Thermogravimetrie und den Porenradius der Quecksilberdruckporosimetrie (Washburn).",
    grenzen: [
      "TGA: feste Massenanteile einer Lehrprobe mit linearen Stufen; keine Heizrate, keine Überlappung der Zersetzungsbereiche.",
      "MIP: Zylinderporenmodell mit γ = 0,485 N/m und θ = 140°; erfasst werden Porenzugänge, nicht die Porenkörper (Flaschenhals-Effekt).",
    ],
  },
  lehm: {
    kurz: "Lehrmodell Stampflehm: Tendenzen von Rohdichte, Druckfestigkeit, Schwindmaß, Wärmeleitfähigkeit und Feuchtepuffer aus Ton-, Schluff- und Sandanteil.",
    grenzen: [
      "Lehrmodell mit linearen Ansätzen ohne Quelle und ohne Normbezug; keine Bemessungswerte nach DIN 18940/18945.",
      "Druckfestigkeit des Modells etwa 0,6 bis 2,2 N/mm²; für Stampflehm nennt die Fachliteratur etwa 2 bis 4 N/mm².",
      "Feuchtepuffer-Kennzahl ohne Zeitbezug; Sorptionsklassen nach DIN 18947 beziehen sich auf Zeitstufen bis 12 h.",
      "Außerhalb des Reglerbereichs (Ton 3–60 %, Sand 15–85 %, Herstellfeuchte 5–25 %) warnt der Kern.",
    ],
  },
  erdbau: {
    kurz: "Grobe Zuordnung zu Bodengruppe und Frostempfindlichkeitsklasse sowie Mindestdicke des frostsicheren Oberbaus nach vereinfachtem RStO-Schema.",
    grenzen: [
      "Klassifikation nur über Feinkorngrenzen, Kies-/Sandanteil (Kies bei Kornanteil > 2 mm ≥ 40 %), Organik und Plastizität, ohne Körnungslinie.",
      "Frostschutz nur mit Ausgangswert, Frostzone und Wasserverhältnissen; weitere Zeilen der RStO-Tabelle nicht berücksichtigt.",
      "Nur F2/F3 wählbar; gebundene Schichten pauschal.",
    ],
  },
  kombinationen: {
    kurz: "Faserverbunde nach Mischungsregeln (Voigt/Reuss) sowie U-Wert, Σs_d und Tauwasser-Hinweis eines Mehrschichtaufbaus.",
    grenzen: [
      "Faserverbund mit idealer Haftung (Lehrmodell).",
      "U-Wert mit R_si = 0,13 und R_se = 0,04 m²K/W, ohne Wärmebrücken und ohne Glaser-Nachweis.",
      "Tauwasser-Hinweis nach den nachweisfreien Dächern der DIN 4108-3 (s_d,i ≥ 1,0 m / 2,0 m / 6·s_d,e), geteilt an der Dämmschicht (größter Wärmedurchlasswiderstand, nicht mitgezählt); kein Glaser-Nachweis.",
      "Außendämmung auf tragender Schicht (z. B. WDVS auf Mauerwerk): Außenwand ohne rechnerischen Tauwassernachweis nach DIN 4108-3; Innendämmung: Hinweis auf Nachweis. Einordnung nur über die Kategorie „tragend“.",
      "Unzulässige Eingaben (Dicke ≤ 0, λ ≤ 0, μ < 1) werden gemeldet statt still begrenzt.",
    ],
  },
  bp_verkehr_rsto: {
    kurz: "Zeigt fest hinterlegte Schichtaufbauten je Belastungsklasse; es wird nichts gerechnet.",
    rechnet: false,
    grenzen: [
      "Gebundene Schichten nach RStO 12/24, Tafel 1/2, Zeile 1 (vorläufig); Gesamtdicken und Frostschutzschicht sind Lehrannahmen.",
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
    kurz: "Speichervolumen und Länge einer Rigole (Lehrmodell in Anlehnung an DWA-A 138-1:2024-10); dazu Betondecken, Bahn- und Tunnelbau.",
    grenzen: [
      "Rigole: vereinfachtes Verfahren DWA-A 138-1:2024-10, k_i = f_Ort·f_Methode·k_f, Seiten/Stirn mit halber bzw. bei vollständiger Durchsickerung voller Höhe; f_Ort, f_Methode vorläufig.",
      "Rigole: Querschnitt 1,2 × 0,6 m und f_Z = 1,2 fest; eine Regendauer ohne Iteration über die Dauerstufen der Regenstatistik (KOSTRA-DWD), kein Drosselabfluss, keine Mulde.",
      "Betondecke: Westergaard-Randspannung (Originalgleichung mit Ersatzradius b, ν = 0,15) ohne Wölbspannungen und Ermüdung; zulässige Spannung pauschal 2,25 N/mm².",
      "Schiene: σ = E·α·ΔT bei vollständiger Behinderung; Tunnel: Kesselformel ohne Biegung, γ_c = 1,5 (vorübergehend); ZTV-ING Teil 5 / Ril 853 nicht abgebildet.",
    ],
  },
  frischbeton: {
    kurz: "Konsistenz gegen Grenzabmaße, korrigierter Luftgehalt, Frischbetonrohdichte, Schalungsdruck und Frischbetontemperatur.",
    grenzen: [
      "Grenzabmaße der Konsistenz nach hinterlegter Tabelle (Staffeln vorläufig, Normprüfung ausstehend).",
      "Luftgehalt als Einzelwert: Mindestwert nach DIN 1045-2, obere Grenze Mindestwert + 4 % (DIN EN 206, 5.4.3), Grenzabweichung −0,5/+1,0 %; keine Annahmekennzahl.",
      "Expositionsklasse XF2/XF3 nur in der LP-Variante bzw. ohne LP-Anforderung wählbar; XF3 mit LP ist nicht getrennt abgebildet.",
      "Schalungsdruck mit genähertem Erstarrungsbeiwert; SVB voll hydrostatisch.",
      "Frischbetontemperatur über Mischungsregel mit festen Wärmekapazitäten.",
    ],
  },
  hydratation_folgen: {
    kurz: "Wärmeentwicklung und Reife, Festigkeits- und E-Modul-Entwicklung, Zwang mit Rissrisiko und Mindestbewehrung, Kriechen und Schwinden.",
    grenzen: [
      "Temperaturverlauf mit pauschaler Wärmeabfuhr und festen Stoffwerten (c·ρ = 2400 kJ/(m³·K) einheitlich in Rechner, Beispiel und Modul Massige Bauteile).",
      "Rissnachweis mit f_ct,eff = 0,7·f_ctm und k_c = 1,0 (zentrischer Zwang), σ_s aus vereinfachter Tabelle.",
      "Praxisbeispiel mit festen Kennwerten, linear mit β_cc skaliert.",
      "Zwang & Risse (massige Bauteile): Temperaturkurve als Lehransatz, Zwang α_T·ΔT·E_c(t)·R nur in der Abkühlphase.",
      "Mindestbewehrung im Praxisbeispiel mit k_c = 1,0, k = 0,8, f_ct,eff = 2,5 N/mm² und σ_s = 240 N/mm² als feste Lehrwerte.",
      "Reife: wirksames Alter aus der Kerntemperatur (Schritt 0,1 d); f_ck aus der Zementfestigkeitsklasse, β_cc ≤ 1,25; Ausschalfrist über f_ck(t_e) = f_cm(t_e) − 8 (EC2 3.1.2(5)).",
      "Reifefunktion gewogene Reife nach NEN 5970 nur als Faktor k_T = C^((T − 20)/10), C = 1,15 … 1,75, Standard 1,45 (einstellbar; Giatec, Kasal 2020); nicht die integrierte Reife in °C·h (vorläufig, Normprüfung ausstehend).",
      "Zementbeiwert s nach EC2 3.1.2(6) (R = 0,20, N = 0,25, S = 0,38); L-Zemente sind dort nicht geregelt und werden nach der Anfangsfestigkeit (DIN EN 197-1) als S bzw. 52,5 L als N eingeordnet.",
      "Wärme mit hyperbolischem Ansatz Q = H_max·t_e/(t_e + t₅₀) und Lehrwerten je Zementart; Zusatzstoffe über lineare Zu- und Abschläge.",
      "Bauteile unter 0,30 m: Die pauschale Wärmeabfuhr gleicht die Temperatur je Zeitschritt vollständig an die Umgebung an.",
      "Reißrahmen: qualitatives Lehrmodell mit festen Kurvenparametern; kein Ersatz für Versuche nach RILEM TC 119-TCE.",
      "Kriechen und Schwinden: lineares Kriechen nach EC2 Anhang B bei 20 °C, h₀ direkt vorgegeben, E_cm für Quarzit.",
    ],
  },

  betonkennwerte: {
    kurz: "EC2-Kennwerte aus der Festigkeitsklasse sowie Zeitentwicklung, Schwinden und Kriechen nach EC2 Anhang B.",
    grenzen: [
      "α_cc = 0,85, γ_c = 1,5 und α_ct = 0,85 fest; zusätzliche f_cd-Abminderung ab C55/67 vorbereitet, aber ausgeschaltet (Normtext ausstehend).",
      "Konstante Umgebungstemperatur über das gesamte Alter; Festigkeitsentwicklung f_cm(t), f_ctm(t), E_cm(t) – Standard: wirksames Alter t_T (fib MC 2010); EC2 3.1.2(6) (tatsächliches Alter t) über den Schalter.",
      "Relative Luftfeuchte auf 20–100 % begrenzt; h₀ ohne Begrenzung wie in Anhang B (k_h ab 500 mm konstant 0,70), Hinweis außerhalb 100–1500 mm.",
      "Nichtlineares Kriechen ohne Obergrenze bei 0,6·f_ck(t₀).",
    ],
  },
  kriechen: {
    kurz: "Kriechzahl φ(t,t₀), Trocknungs- und autogenes Schwinden ε_cs = ε_cd + ε_ca nach EC2 3.1.4 und Anhang B, wirksamer E-Modul sowie Relaxation von Spannstahl nach 3.3.2.",
    grenzen: [
      "Nur lineares Kriechen (σ_c ≤ 0,45·f_ck(t₀)); kein nichtlineares Kriechen nach Gl. (3.7).",
      "Konstante Temperatur von 20 °C (keine Temperaturanpassung von t₀ nach Gl. B.10), E_cm für quarzitische Gesteinskörnung.",
      "h₀ wird direkt vorgegeben; k_h nach Tab. 3.3 mit 1,0 unter 100 mm und 0,70 über 500 mm.",
      "Stützenbeispiel: ε_tot = σ_c/E_cm + φ·σ_c/(1,05·E_cm) + ε_cs (3.1.4(3)) mit σ_c = 8,5 N/mm² und L = 3 m als Lehrannahmen; ohne Bewehrung.",
      "Relaxation: Verlust für σ_pi/f_pk ≤ 0,5 vernachlässigt; ohne Temperatureinfluss und ohne Kopplung an Kriechen und Schwinden.",
    ],
  },
  zwang: {
    kurz: "Zwangspannung σ_z = (α_T·ΔT + ε_cs)·E·R aus behindertem Abkühlen und Schwinden mit Vergleich gegen die Zugfestigkeit f_ct.",
    grenzen: [
      "Lehrmodell: konstante Dehnung über den Querschnitt, linear-elastisch; E als wirksamer E-Modul (z. B. E_cm/(1 + φ)) vorgegeben.",
      "α_T = 10·10⁻⁶ 1/K (EC2 3.1.3(5)); Festhaltungsgrad R vorgegeben, nicht aus der Bauteilgeometrie ermittelt.",
      "Nur Zug aus Verkürzung; keine Rissbreite, keine Mindestbewehrung (dafür Reiter Rissbreite bzw. Hydratation & Folgen).",
    ],
  },
  eigenspannungen: {
    kurz: "Eigenspannungen σ_V aus dem nichtlinearen Anteil einer parabolischen Temperaturverteilung und aus ungleichmäßigem Schwinden über die Bauteildicke.",
    grenzen: [
      "Lehrmodell: Temperaturparabel durch drei Werte (innen, Mitte, außen), Schwinden parabolisch (Rand ε_cs, Kern 0), linear-elastisch.",
      "E_c,eff und f_ctm(t) werden vorgegeben (keine Reife- oder Relaxationsrechnung); α_T = 10·10⁻⁶ 1/K.",
      "Zwangsanteile σ_N und σ_M nur zum Vergleich bei voller Behinderung mit 20 °C Bezugstemperatur (Lehrannahme).",
    ],
  },
  expositionsklassen: {
    kurz: "Maßgebende Anforderungen der gewählten Expositionsklassen und (w/z)_eq nach dem k-Wert-Ansatz.",
    grenzen: [
      "c_nom nur aus c_min,dur + Δc_dev; c_min,b aus dem Stabdurchmesser geht nicht ein.",
      "Flugasche k = 0,4 (f/z ≤ 0,33), Silikastaub k = 1,0 (s/z ≤ 0,11); gemeinsame Begrenzung f ≤ 0,66·z − 3·s für CEM I geprüft, Zementart nicht wählbar.",
      "LP-Werte nur für Größtkorn 8/16/32 mm.",
    ],
  },
  holzbau_verbindung: {
    kurz: "Holzschrauben: Tragfähigkeit auf Herausziehen (Gl. 8.38–8.41) und Abscheren (Johansen mit Seileffekt) nach DIN EN 1995-1-1.",
    grenzen: [
      "Normformeln ohne ETA: f_ax,k = 0,52·d^−0,5·l_ef^−0,1·ρ_k^0,8, M_y,Rk = 0,3·f_u·d_ef^2,6 mit f_u = 400 N/mm² (Lehrwert); Herstellerwerte sind meist höher.",
      "Abscheren mit d_ef = 1,1·d₁; Kerndurchmesser d₁ als Eingabe (leer: Lehrwert 0,65·d); d_ef ≤ 6 mm Lochleibung nach den Regeln für Nägel (nicht vorgebohrt), sonst für Bolzen, ohne Faserwinkel.",
      "k_mod aus NKL und KLED, γ_M = 1,3; einschnittig Holz–Holz, nur Versagensarten Lochleibung und Fließgelenk.",
      "n_ef = n^0,9 nur beim Herausziehen; ohne Mindestabstände, Blockscheren und Interaktion axial/quer (8.7.3).",
    ],
  },
  holzbau_bauphysik: {
    kurz: "Brand mit reduziertem Querschnitt; Eigenfrequenz f₁ und Durchbiegung unter 1 kN einer Brettsperrholzdecke als Einfeldträger.",
    grenzen: [
      "Brand: feste Abbrandraten nach DIN EN 1995-1-2:2010-12 (Neuausgabe 2026-10 nicht berücksichtigt), nur Restquerschnitt und Widerstandsmoment, keine Tragfähigkeit.",
      "Schwingung: zweiseitig gelenkig gelagerter Einfeldstreifen; Biegesteifigkeit nur aus den Längslagen, netto oder nach dem γ-Verfahren (DIN EN 1995-1-1 Anhang B, nur symmetrisch 3- und 5-lagig).",
      "Bei 7 und mehr Lagen wird die Netto-Biegesteifigkeit angesetzt; das Schubanalogieverfahren ist nicht umgesetzt.",
      "Kennwerte E_0,mean = 11 550 N/mm², Wichte 5,5 kN/m³ nach proHolz Austria (Band II, 2018), Rollschubmodul G_r,mean wählbar 50 N/mm² (Standard, viele ETAs) oder 65 N/mm² (proHolz) statt Werten aus der ETA des Herstellers.",
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
    kurz: "Reißlänge und maximale Turmhöhe zweier Werkstoffe, ein Würfelstapel bis zum Druckversagen sowie Hauptspannungen und Mohr'scher Kreis des ebenen Spannungszustands.",
    grenzen: [
      "Werkstoffwerte als feste Lehrwerte.",
      "Reines Eigengewicht, ohne Teilsicherheitsbeiwerte und Stabilität.",
      "Spannungszustand: eben (σ_z = τ_xz = τ_yz = 0), linear-elastisch; von Mises und Tresca gelten für duktile, isotrope Werkstoffe, nicht für Beton, Mauerwerk oder Holz.",
      "Mohr'scher Kreis: τ-Achse nach unten positiv (Konvention nach Gross/Hauger/Schröder/Wall, TM 2) – Bildpunkt dreht im gleichen Sinn wie der Schnitt.",
      "Vergleich mit f_y ohne Teilsicherheitsbeiwerte γ_M und ohne Stabilitäts- oder Ermüdungsnachweis.",
    ],
  },
  knicken: {
    kurz: "Euler-Knicklast für die Euler-Fälle 1–4 und Auslenkung nach Theorie II. Ordnung.",
    grenzen: [
      "Ideal-elastischer Stab ohne Fließen und ohne Knicklinien (keine χ-Abminderung).",
      "Vorkrümmung w₀ = l/300 pauschal.",
      "Biegelinie im Diagramm: erste Eigenform des gewählten Euler-Falls, skaliert auf die Ausbiegung nach Theorie II. Ordnung (Lehrmodell; Imperfektionsform nicht fallabhängig).",
    ],
  },
  energieausweis: {
    kurz: "Grobe Abschätzung von Heizwärme-, End- und Primärenergiebedarf, CO₂ und Effizienzklasse.",
    grenzen: [
      "Hüllflächen pauschal aus der Nutzfläche, U-Werte je Standard fest.",
      "Klimafaktor und Gewinne pauschal; Warmwasser, Verluste und Hilfsstrom als feste Werte.",
      "Kein Nachweis nach DIN V 18599.",
      "Stichtagsschalter GModG: bis 31.12.2026 f_p nach Anlage 4, CO₂ nach Anlage 9 (Strom 1,8 / 560 g/kWh); ab 01.01.2027 neue Anlage 4 (Strom 1,5, Holz 0,7, Fernwärme 0,7). Klassen Anlage 10 unverändert.",
      "CO₂-Faktor Netzstrom ab 2027 (100 g/kWh) vorläufig, Normprüfung ausstehend (GModG Anlage 9, Fassung 2027); Fernwärme bis 2026 mit Lehrwerten f_p 0,4 und 120 g/kWh; das neue Referenzgebäude ist nicht abgebildet.",
      "Interne Gewinne pauschal 35 kWh/(m²a) statt Nutzungsprofil nach DIN/TS 18599-10 (Lehrwert, vorläufig, Normprüfung ausstehend); CO₂ mit dem Faktor des Hauptenergieträgers auf die gesamte Endenergie.",
    ],
  },
  materialoptimierung: {
    kurz: "GWP (A1–A3) eines Referenzbauteils im Vergleich mit einer optimierten Variante.",
    grenzen: [
      "Beton- und Stahlmengen je Bauteil fest hinterlegt, keine Bemessung.",
      "Beton-GWP nur nach Zementart, unabhängig von der Festigkeitsklasse.",
      "Bewertungsklassen über modellinterne Schwellen (Lehreinteilung, nicht die Treibhausgas-Minderungsklassen der DAfStb-Richtlinie).",
      "GWP-Lehrwerte: Beton = 320 kg Zement · GWP_Zement + 45 kg/m³ (Rest wie alle Lehrbetone), Stahl-Referenz ÖKOBAUDAT 0,64 kg/kg; Hochofen 0,98, CEM II/B-S, II/C-M, 56-d-Abschlag vorläufig (Normprüfung ausstehend).",
    ],
  },
  oekobilanz_lca: {
    kurz: "GWP (A1–A3) und Transport (A4) einer Materialmenge aus der EPD-Musterdatenbank.",
    grenzen: [
      "EPD-Werte sind Lehr- und Mittelwerte, keine Produktdaten; Projektwerte aus EPD bzw. ÖKOBAUDAT.",
      "Transport A4 mit festem Emissionsfaktor je t·km: Diesel-Lkw und Güterbahn nach UBA, Emissionsvergleich Güterverkehr 2024 (TREMOD 6.71B, Durchschnitt inkl. Auslastung und Vorkette); Elektro- und H2-Lkw sind Lehrwerte.",
      "Keine Nutzungs- und Entsorgungsphase; die Gebäudebilanz mit B4, B6 und C3/C4 bietet der LCA-Rechner.",
    ],
  },
  lca_rechner: {
    kurz: "Vereinfachte Gebäude-Ökobilanz nach QNG-Bilanzregeln je m² NRF(R) und Jahr: A1–A3, B4, C3/C4, Sockel TGA und B6; A4 und Modul D getrennt; dazu Kreislaufkennzahlen, Wandaufbau-GWP und QNG-Abschätzung.",
    grenzen: [
      "Lehrdatenbank mit 18 Baustoffen (Mittelwerte, keine Produkt-EPD; Betonstahl 0,64 kg/kg nach ÖKOBAUDAT, Profilstahl 1,1 kg/kg Lehrwert); C3 und C4 zusammengefasst; Mengen sind vom Nutzer anzugeben, keine Mengenermittlung.",
      "B4 mit n = ⌈50/ND⌉ − 1 und BNB-Nutzungsdauern des BBSR (Stand 2017, Fassung 24.02.2017); Zuordnungen für Hanfkalk, Stroh, Lehmplatten, Geopolymer und WDVS vorläufig; eine BNB-Neufassung ist nicht eingearbeitet.",
      "B6: Endenergie nach GEG ist einzugeben (keine Energiebilanz); Netzstrom 0,53203 kg/kWh nach QNG-Rechenwerten 2023 v1.3 (Wiedergabe in der Berichtsvorlage der Landeshauptstadt München, FKG 2024).",
      "QNG-PLUS 24 und QNG-PREMIUM 20 kg/(m²·a) (KfW 09/2025); Stand QNG-Handbuch Anlage 3 v1.4; die seit 12/2025 vorübergehend geringeren QNG-Anforderungen sind nicht abgebildet.",
      "Keine Gas-, Öl- oder Pelletkessel im Gebäude (QNG-Rechenwerte nicht öffentlich abgedruckt); Fernwärme nach QNG-Anhang 3.4; TGA nur als Sockelbetrag (Tab. 6).",
      "„Eingehalten“ nur mit B4 und B6, 50 a und Wohngebäude; Nichtwohngebäude mit Lehrwert. Kein QNG-Nachweis, kein Ersatz für die Bilanz einer Zertifizierungsstelle.",
      "Modul D: Referenz-Gutschrift je Baustoff für den deklarierten Weg; Wegfaktoren in der Rangfolge nach § 6 KrWG (1,45 > 1,0 > 0,55 > 0,40; Beträge Lehrwerte); D nur für den Ersteinbau, nicht angerechnet.",
      "Urban-Mining-Index mit modellinternen Gewichtungen; A4 pauschal je t·km auf die gesamte Masse (Lkw-Mittel 0,118 bzw. Güterbahn 0,014 kg/(t·km) nach UBA 2024).",
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
    kurz: "CRREM-Stranding-Jahr eines Büro- oder Wohngebäudes für vier Sanierungsstufen; CBAM-Kosten für Zementimporte im Jahrespfad 2026–2034.",
    grenzen: [
      "CBAM: Anpassung an die kostenlose Zuteilung (CBAM-Faktor nach RL 2003/87/EG Art. 10a, Benchmark nach DVO (EU) 2025/2620), CSCF = 1; Herkunftspreis auf alle Emissionen angerechnet (vorläufig).",
      "CBAM: ein Jahrespreis statt Quartals- bzw. Wochenpreisen; Standardwert-Aufschläge und Schwellenwert 50 t je Jahr nicht abgebildet; nur Zement und Klinker.",
      "Zielpfade als lineare Interpolation vereinfachter CRREM-Stützwerte, nicht die aktuellen länderspezifischen Pfade.",
      "Minderung je Sanierungsstufe pauschal (15, 35 oder 75 %), sofort wirksam und über die Zeit konstant.",
      "Kein Netzdekarbonisierungs-Effekt auf den Bestand.",
    ],
  },
  lebenszyklus_kosten: {
    kurz: "Barwertvergleich der Lebenszykluskosten zweier Optionen (Barwertmethode wie BNB 2.1.1) mit Energie- und allgemeiner Preissteigerung, CO₂-Schattenpreis und Förderung.",
    grenzen: [
      "Fester Zinssatz und konstante Preissteigerungen; Steigerung ab dem 2. Jahr wie BNB 2.1.1 (auch für den CO₂-Preis).",
      "Standard ohne Restwert (BNB 2.1.1); optional linearer Restwert zum Vergleich (Del. VO (EU) 244/2012, Anhang I Nr. 4.2 (5)) nur für das zuletzt eingebaute Bauteil je Option, ohne CO₂-Gutschrift.",
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
      "Lokalelement: i_corr, Rostvolumenfaktor 2,5, E_eff = 12 000 MPa und Schadensschwellen sind qualitative Lehrannahmen; Abtrag 11,6 µm/a je µA/cm² (Faraday, Eisen).",
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
      "Gleichgewichtsfeuchte nach dem Sorptionsmodell von Hailwood-Horrobin mit den Koeffizienten von Simpson (Wood Handbook, 20 °C/65 % → 12,0 %), Mittelwert für Nadelholz ohne Hysterese, begrenzt auf 30 % Fasersättigung.",
      "Feuchteangleich exponentiell mit τ = 15 d · (d/20 mm)²; Kalibrierung als Lehrannahme, ohne Oberflächenbeschichtung und Feuchtegradient.",
      "Schwinden linear mit differentiellen Schwindmaßen je Richtung; Verdrehen, Rissbildung und Jahrringlage nur in der 3D-Darstellung qualitativ.",
      "Festigkeitswerte für ausgewählte Klassen, γ_M = 1,3; kein Bauteilnachweis.",
    ],
  },
  bp_holzprodukte: {
    kurz: "Einfeldbalken unter Gleichlast aus Vollholz oder BSH: Biegung, Schub mit k_cr sowie w_inst, w_fin und w_net,fin mit k_def nach DIN EN 1995-1-1 mit NA (DE).",
    grenzen: [
      "k_mod nach Tab. 3.1, γ_G = 1,35, γ_Q = 1,5; eine Nutzlast (ψ₂ = 0,3, Kategorie A); nachgewiesen werden 1,35·g + 1,5·q (k_mod der Nutzlast) und 1,35·g (k_mod ständig), maßgebend die größere Ausnutzung.",
      "w_fin = w_G·(1 + k_def) + w_Q·(1 + ψ₂·k_def) ≤ l/200, w_net,fin ≤ l/300 ohne Überhöhung, w_inst ≤ l/300 (Empfehlungswerte nach DIN EN 1995-1-1, Tab. 7.2 mit NA, vorläufig); Schwingungen fehlen.",
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
    kurz: "Verformter Holzsparren: Theorie II. Ordnung (E_d = E_0,mean/γ_M, Vorkrümmung max(e₀; l/400), Gl. 6.19) und Ersatzstabverfahren nach 6.3.2 (Gl. 6.23) im Vergleich zum idealisierten Stab.",
    grenzen: [
      "Knicken nur in der Biegeebene, Knicklänge = Stablänge; seitliche Halterung vorausgesetzt, Kippen und Knicken um z nicht enthalten.",
      "Ersatzimperfektion 0,0025·l nach 5.4.4 (vorläufig); Vergrößerungsfaktor 1/(1 − N/N_cr,d) als Näherung der Theorie II. Ordnung.",
      "k_mod = 0,9 (kurze Lasteinwirkung), γ_M = 1,3; Vorverformung als Stich in Feldmitte, Querschnitt ungeschwächt.",
    ],
  },
  modernisierung: {
    kurz: "U-Wert nach Zusatzdämmung, Vergleich mit dem Höchstwert nach GModG (vormals GEG), Endenergieeinsparung, Kosten, CO₂ und statische Amortisation.",
    grenzen: [
      "U_neu = 1/(1/U_alt + d/λ) ohne Korrekturen nach DIN EN ISO 6946.",
      "Arbeitskosten pauschal 85 €/m², CO₂-Faktor 0,22 kg/kWh fest.",
      "Statische Amortisation ohne Zins und Preissteigerung.",
    ],
  },
  // Bauwerksdiagnose in drei Teilmodulen (28.10.2026): Grenzen des früheren Moduls „bauwerksuntersuchung“ verteilt
  bauwerksdiagnose: {
    kurz: "Prüfumfang und Bewertung von Befunden (Probenahme-Planer, Interpretations-Navigator).",
    grenzen: [
      "Prüfumfang über Faustformeln aus der Fläche.",
      "Bewertung mit festen Schwellen (Chlorid, Potential, Festigkeit, Haftzug).",
    ],
  },
  // Prüfverfahren-Katalog (bis 28.10.2026 im Modul „bauwerksuntersuchung“)
  pruefverfahren_katalog: {
    kurz: "Simulatoren des Prüfverfahren-Katalogs: Rückprall, Ultraschall, Karsten, Karbonatisierung, Bohrkern, Impact-Echo.",
    grenzen: [
      "Rückprall-Festigkeit nach Lehr-Näherung, Richtungskorrektur nach Herstellerformel Original Schmidt Typ N (Screening Eagle/Proceq).",
      "Karbonatisierung nach √t-Gesetz ohne Klima- und Feuchteeinfluss.",
    ],
  },
  zfp: {
    kurz: "Lehrsimulatoren der zerstörungsfreien Prüfung: Rückprallhammer, Ultraschall, Impact-Echo, Bewehrungsortung, Georadar, Potentialfeld, Wenner-Sonde, Torrent, Karsten-Röhrchen, Thermografie und Durchstrahlung.",
    grenzen: [
      "Rückprall: Lehrkurve f_c ≈ 0,0125·R^2,22; Richtungskorrektur ΔR(R, α) nach Herstellerformel Original Schmidt Typ N (Screening Eagle/Proceq) – ohne Kalibrierkerne (DIN EN 13791:2020, 8.2/8.3) nur Schätzwert.",
      "Ultraschall: E_dyn mit fester Dichte 2400 kg/m³ und ν = 0,2; die Festigkeit aus v_p ist nur eine grobe Lehrschätzung.",
      "Feste Schwellen: Potential nach ASTM C876 (−200/−350 mV; DGZfP-Merkblatt B 03 empfiehlt objektbezogene Auswertung), Wenner nach RILEM TC 154 (100/500/1000 Ω·m); Torrent, Karsten, Thermografie als Lehrschwellen.",
      "Bewehrungssignal und Durchstrahlung (μ = 0,15/E) sind qualitative Anzeigemodelle ohne Gerätekennlinie.",
    ],
  },
  messen_pruefen: {
    kurz: "Messunsicherheit nach GUM (Typ A, Auflösung, Kalibrierschein, U = k·u_c), Ringversuchsbewertung mit z-Score und E_n-Wert sowie Richtwerte für Messwerkzeuge.",
    grenzen: [
      "Unkorrelierte Eingangsgrößen mit Empfindlichkeitskoeffizient 1; k = 2 fest, ohne effektiven Freiheitsgrad nach Welch-Satterthwaite.",
      "Ringversuch: σ_pt und Referenzwert werden vorgegeben; Youden-Plot mit simulierten Vergleichslaboren.",
      "Werkzeugtoleranzen sind Richtwerte (z. B. Gliedermaßstab Klasse II); maßgebend sind Kalibrierschein und Herstellerangaben.",
    ],
  },
  mechanische_pruefungen: {
    kurz: "Auswertung zerstörender Prüfungen: Bohrkerndruckfestigkeit mit Schlankheitskorrektur, Spaltzug und Marshall (Asphalt), Zugversuch Betonstahl und Schätzwerte für Bauholz.",
    grenzen: [
      "Bohrkern: h/d = 1 gilt als Würfel, h/d = 2 als Zylinder (DIN EN 13791), andere Form über die Klasse; ASTM C42 für Zwischenwerte; Bewehrung (+3,5 %/Stab) und Bohrrichtung (1,085) Lehrannahmen.",
      "Keine Bewertung nach DIN EN 13791 (Prüfreihen, charakteristische In-situ-Festigkeit); alle Einstufungen sind Einzelwertvergleiche.",
      "Zugversuch: A_gt aus der Messlänge unter Höchstkraft, Einzelwertvergleich mit DIN 488-1 (A_gt ≥ 2,5/5,0 %); keine Prüfserie und keine Bruchdehnung.",
      "Holz: Druckfestigkeit, Feuchtefaktor und E-Modul aus der Rohdichte sind Lehr-Näherungen, keine Werte nach DIN EN 338 oder DIN EN 384.",
    ],
  },
  festbeton: {
    kurz: "Bemessungswerte f_cd und f_ctd je Festigkeitsklasse, Festigkeitsentwicklung β_cc(t) mit Probekörper- und Lagerungsfaktoren, 5-%-Fraktil und Schnellevaluator der Konformitätskriterien.",
    grenzen: [
      "β_cc(t) nach DIN EN 1992-1-1, Gl. (3.2), ohne Temperatureinfluss und auch über 28 Tage hinaus fortgeschrieben.",
      "Würfel 150 über f_ck,cube/f_ck der Klasse; Größenfaktoren Würfel 100/200 (1,04/0,96) und Lagerungsfaktoren (0,85 … 0,95) sind Lehrwerte.",
      "Statistik: Normalverteilung mit bekanntem σ, Würfelwerte über die Festigkeitsklasse.",
      "Konformität: stetige Herstellung mit σ der Vorserie (sonst ersatzweise aus der Stichprobe), mindestens 3 N/mm²; keine vollständige Konformitätskontrolle nach DIN EN 206 und DIN 1045-2.",
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
      "Bauteilvolumen und Optimierung pauschal; RC-Anteil als Höchstanteil nach DIN 1045-2 Anhang E bezogen auf einen Grobkornanteil von 70 % (Lehrwert), Vol.-% gleich M.-% gesetzt.",
      "Feste CO₂-Faktoren für Beton, Stahl und Transport.",
      "Kosten-Nutzen-Werte und Förderbonus sind fiktive Lehrwerte.",
    ],
  },
  // Umsetzung 29.10.2026 (Modulprüfung Tranche 13): Grenzen der rechnenden Module „Mängel & Schäden“ / „Schutz & Instandsetzung“
  bauwerksunters_monitoring: {
    kurz: 'Belegreife aus CM-Messung und HF-Digits, Karbonatisierungskoeffizient aus Rückprall und Karbonatisierungstiefe sowie Simulatoren für Rissbewegung und Bohrwiderstand.',
    grenzen: [
      'CM-Richtwerte belagsabhängig (Zementestrich 2,0/1,8, Calciumsulfatestrich 0,5/0,3 CM-%); maßgebend ist die Vereinbarung der Schnittstellenkoordination, Mauerwerk ohne Grenzwert.',
      'HF-Grenzen 40/80 Digits sind gerätespezifische Näherungen und dienen nur der Eingrenzung feuchter Zonen, nicht der Freigabe.',
      'Karbonatisierung nach dem Wurzel-t-Gesetz (k_c = x_c/√t) bei gleichbleibenden Umgebungsbedingungen; Rückprall nur als Einstufung, Festigkeit nur über Bohrkerne nach DIN EN 13791.',
      'Rissbewegungs- und Bohrwiderstandsanzeige sind qualitative Lehrsimulatoren ohne Gerätekalibrierung.',
    ],
  },
  instandhaltung: {
    kurz: 'Chloridprofil nach dem 2. Fickschen Gesetz mit Depassivierungstiefe und Abtragstiefe sowie Packerabstand und Verpressdruck einer Rissinjektion.',
    grenzen: [
      'Chlorid: C₀ = 0, C_s und D konstant (ohne Alterungsexponent, Temperatur und Konvektionszone); C_krit = 0,5 M.-%/z als Anhaltswert, kein Normwert.',
      'Raster 2,5 mm bis 100 mm: Tiefe auf den Rasterpunkt abgerundet; liegt die Front tiefer, sind Tiefe und Abtrag (Front + 15 mm, Lehransatz) nur Mindestwerte („≥“).',
      'Rissinjektion: Packerabstand ≈ halbe Bauteildicke, Verpressdruck 0,08 bar je mm (12 bis 35 bar) sind Lehrwerte, keine Regelwerksgrößen; maßgebend sind TR Instandhaltung und Stoffangaben.',
    ],
  },
  wta: {
    kurz: 'Bohrplan einer Horizontalsperre (Bohrtiefe, Abstand, Wirkstoffbedarf) mit Verfahrenshinweis nach Durchfeuchtungsgrad sowie ein Punkteschema für Innendämmung im Bestand.',
    grenzen: [
      'Bohrtiefe Wand − 5 cm, Abstände 12/10/8 cm und Ø 12 mm fest; Bedarf aus dem Bohrlochvolumen · 1,15 ist eine Untergrenze, Herstellerangaben liegen höher (≈ 15 ml je m und cm).',
      'Verfahren und zulässiger DFG des Mauerwerks laut WTA-Zertifikat bzw. Herstellerangabe des Stoffs (Prüfstufen 60/80/95 %); die Anzeige der Stufe ist ein Lehransatz (vorläufig, Normprüfung ausstehend).',
      'Kombi-Planer: eigenes Punkteschema, keine Bewertung der WTA; Salzstufen im Mauerwerk vereinfacht für alle Salze gemeinsam (vorläufig, Normprüfung ausstehend).',
    ],
  },
  'wu-bauwerke': {
    kurz: 'Druckgefälle, Mindestdicke und Rechenwert der Trennrissbreite für Selbstheilung nach DAfStb-WU-Richtlinie 2017-12.',
    grenzen: [
      'Rissbreite w_k wird eingegeben, nicht nach DIN EN 1992-1-1 berechnet; Selbstheilungsstufen I ≤ 10/15/25 → 0,20/0,15/0,10 mm nur für Beanspruchungsklasse 1.',
      'Beanspruchungsklasse 2 mit Orientierungswert 0,30 mm; die Nutzungsklasse (A/B) geht nicht in die Rechnung ein.',
      'Mindestdicken nach Tab. 1 der Richtlinie; Fugen, Durchdringungen, Betontechnologie und Zwang aus Hydratation werden nicht nachgewiesen.',
    ],
  },
  schutz_grundlagen: {
    kurz: 'Kostensteigerung nach der Fünferregel von de Sitter (K_n = K₀ · 5ⁿ) für Maßnahmen in vier Lebensphasen.',
    grenzen: [
      'Faktor 5 je Phase ist eine Modellvorstellung (de Sitter 1984), kein Kostenansatz; reale Kosten hängen von Bauteil, Zugänglichkeit und Schadensbild ab.',
      'Tuutti-Kurve qualitativ (Einleitungs- und Schädigungsphase), ohne Berechnung der Lebensdauer.',
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
      "Vergleichswert 0,24 W/(m²K) ist der Höchstwert nach Anlage 7 GModG (vormals GEG) für die Änderung von Außenwänden bestehender Wohngebäude; für Neubauten gilt der Referenzgebäude-Nachweis.",
    ],
  },
  rechnung_beton: {
    kurz: "Mischungsentwurf nach der Stoffraumrechnung, k-Wert-Ansatz, Frischbetontemperatur und Festigkeitsentwicklung.",
    grenzen: [
      "Wasseranspruch als Lehrwerte der Größenordnung tabelliert (keine Normwerte), Rohdichten und Luftgehalt fest.",
      "Nur die Expositionsklassen XC4 und XD3.",
      "Reife mit konstanter Temperatur (Arrhenius, t_T nach EC2 Gl. B.10); f_ck(t) = f_cm(t) − 8 bis 28 Tage.",
      "Frischbetontemperatur ohne Phasenwechsel; unter 0 °C nur Hinweis.",
      "Ausschalen (DIN 1045-3): Vergleich von f_ck(t) mit der Vorgabe der Tragwerksplanung in % von f_ck; Voreinstellung 50 % als Lehrannahme (vorläufig, Normprüfung ausstehend).",
    ],
  },
  rechnung_stahlbeton: {
    kurz: "Biegebemessung eines Rechteckquerschnitts mit dem µ-Verfahren.",
    grenzen: [
      "Nur Zugbewehrung, keine Druckbewehrung; oberhalb µ_lim nur Warnung.",
      "Mindestbewehrung (Robustheit, NA DE) nur angezeigt; ohne Höchstbewehrung, Querkraft und Gebrauchstauglichkeit.",
      "Stabwahl ohne Prüfung von Stababständen und Einbaubreite.",
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
      "f_k aus Herstellertafeln (KS-Themenheft Eurocode 6, 10/2012; Lücking 2026) oder frei eingegeben; KS P und KS L-P vorläufig, Übereinstimmung mit der NA-Fassung 2019-12 nicht am Normtext geprüft.",
      "h_ef = ρ2·h mit ρ2 = 0,75/0,90/1,0 nach Wanddicke (bei a < t: 1,0) – belegt durch AMz 2016 (S. 12), TU Dresden 2025 und die KS-Tragfähigkeitstafeln; ρ2 = 1,0 für 2/3 < a/t < 1 vorläufig.",
      "Anwendungsgrenzen nach Tab. NA.2 (Gebäudehöhe, Nutzlast, Windzone) nur teilweise geprüft: l_f ≤ 6,0 m, h_ef/t ≤ 27.",
      "Mauerwerk-Innenwände (Zwischenauflager): Φ1 = 0,9 auch bei teilweise aufliegender Decke (a < t); a/t geht über Φ2 ein (vorläufig, Normprüfung ausstehend).",
      "Wandhöhe über 2,75 m nur als Hinweis auf die erweiterten Bedingungen (DIN EN 1996-3/NA:2019-12; KS-Merkblatt 04/2020): Innenwände ab 115 mm bis 3,60 m, ab 240 mm ohne Höhengrenze; Außenwände vorläufig.",
    ],
  },
  rechnung_nachhaltigkeit: {
    kurz: "CO₂-Aufnahme durch Karbonatisierung und GWP-Vergleich zweier Zemente.",
    grenzen: [
      "Karbonatisierung nach √t-Gesetz mit konstantem k.",
      "GWP-Vergleich nur über den Zement; Vorgaben CEM I 665 kg CO₂-Äq./t (VDZ-Branchen-EPD 2022 nach EN 15804, netto) und CEM III/B 260 kg/t (Lehrwert, vorläufig, Normprüfung ausstehend).",
    ],
  },
  rechnung_bestand: {
    kurz: "f_ck und f_cd aus historischen Betonklassen sowie Fließkraft historischer Betonstähle.",
    grenzen: [
      "Ohne Bauwerksprüfung: Zuordnung nach Tabelle (Schnell/Fischer/Loch 2008, Tab. 2.1; nur Vorbemessung); B 450/B 600 (Spannbeton) ohne Zuordnung.",
      "Mit Bauwerksprüfung (Prüfverfahren Bohrkern): DIN EN 13791 erst ab 8 Kernen, ohne Mindeststandardabweichung (vorläufig, Normprüfung ausstehend); Kerne h/d = 1 als 150-mm-Würfel.",
    ],
  },
  rechnung_schallschutz: {
    kurz: "Schalldämm-Maß einer einschaligen Massivwand und Vergleich mit Anforderungswerten.",
    grenzen: [
      "Massekurve nach DIN 4109-32 (R_w = 30,9·lg m′ − 22,2 dB, gültig 65–720 kg/m², außerhalb nur Hinweis), Putz pauschal 40 kg/m².",
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
      "Feste Annahmen je Aufgabentyp (z. B. Zylinder 150/300 mm, E = 210 000 MPa).",
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
    kurz: "Systematik der Formänderungen sowie Biegelinie, größte Durchbiegung und Neigung von Einfeldträger und Kragarm unter Einzel- und Streckenlast.",
    grenzen: [
      "Lineare Biegetheorie (Bernoulli, kleine Verformungen), E·I konstant, ohne Schubverformung und ohne Eigengewicht, sofern es nicht in q enthalten ist.",
      "Holz ohne Kriechen (k_def) und Feuchteeinfluss; Beton im ungerissenen Zustand I ohne Kriechen und Schwinden – reale Durchbiegungen können ein Mehrfaches betragen.",
      "L/300 bzw. L/150 sind Orientierungswerte; maßgebend sind Einwirkungskombinationen und Grenzwerte der Eurocodes mit NA.",
    ],
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
