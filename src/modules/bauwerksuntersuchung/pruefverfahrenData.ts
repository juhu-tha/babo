export interface PruefverfahrenDetail {
  id: string;
  name: string;
  shortName: string;
  category: 'zfp' | 'minimalinvasiv' | 'zerstoerend';
  categoryLabel: string;
  badge: string;
  standard: string;
  principle: string;
  formula: string;
  formulaExplanation: string;
  steps: string[];
  pros: string[];
  cons: string[];
  referenceValues: string;
  interactiveType: 'schmidthammer' | 'ultraschall' | 'potentialfeld' | 'covermeter' | 'karsten' | 'bohrmehl' | 'haftabzug' | 'bohrkern' | 'bohrwiderstand' | 'impact_echo' | 'karbonatisierung' | 'darrmethode';
}

export const PRUEFVERFAHREN_LIST: PruefverfahrenDetail[] = [
  // 1. BOHRWIDERSTAND (GOLD STANDARD AUS DEM VORBILD)
  {
    id: 'bohrwiderstand',
    name: 'Bohrprofil-Widerstandsmessung (Resistographie)',
    shortName: 'Bohrwiderstand (Holz)',
    category: 'minimalinvasiv',
    categoryLabel: 'Minimalinvasives Prüfverfahren',
    badge: 'Nadel-Torque',
    standard: 'DIN EN 338, WTA-Merkblatt 8-15-20/D, DIN 1052-1',
    principle: 'Mechanisch-energetische Dichteanalyse von Holzquerschnitten. Eine ultradünne Bohrnadel (Ø 1,5–3,0 mm) mit speziellem Schneidkopf wird mit konstantem linearem Vorschub und geregelter Drehzahl ins Holz getrieben. Die elektrische Stromaufnahme des Antriebsmotors oder die mechanische Torsionsenergie korreliert proportional zur lokalen Festigkeit und Rohdichte des durchstoßenen Holzes. Frühholz (geringere Dichte) erzeugt Täler, Spätholz (hohe Dichte) erzeugt Peaks. Fäulnis, Insektenfraßgänge oder Risse führen zu einem abrupten Abfall des Messwerts auf den Leerlauf-Reibungswert der Nadelwelle.',
    formula: 'M_{\\text{Bohr}}(z) = c_1 \\cdot \\rho_{\\text{local}}(z) \\cdot A_{\\text{Nadel}} + f_{\\text{friction}}(z)',
    formulaExplanation: 'Das gemessene Bohrdrehmoment M_Bohr an der Bohrtiefe z ist proportional zur lokalen Rohdichte ρ_local und der projizierten Nadelquerschnittsfläche A_Nadel. f_friction(z) ist die mit der Tiefe ansteigende Mantelreibung der Nadelwelle im Bohrkanal.',
    steps: [
      'Visuelle Voruntersuchung des tragenden Holzbauteils (Auflagerknoten, Risse, Feuchteflecken lokalisieren).',
      'Messgerät (Resistograph) exakt rechtwinklig zur Faserrichtung auf die Holzoberfläche aufsetzen und kraftschlüssig arretieren.',
      'Sicherstellen, dass die feine Nadel vollkommen unverbogen und der Bohrkopf scharf geschliffen ist.',
      'Bohrvorgang starten: Automatisch geregelter Vortrieb mit gleichzeitiger digitaler Profilerfassung (Wegauflösung ca. 0,1 mm).',
      'Echtzeit-Kurvendiagnose auf dem Display prüfen (Oszillation Früh-/Spätholz vs. Dichteeinbrüche).',
      'Verschließen des winzigen Einstichlochs (Ø 1,5 mm) mit dauerelastischem Wachs oder Holzdübel gegen Feuchte- und Sporeneintrag.'
    ],
    pros: [
      'Extrem geringer Eingriff (minimales Bohrloch d ≤ 2 mm, keine statische Relevanz).',
      'Erfasst den gesamten Querschnitt im Bauteilinneren bis zu 500 mm Tiefe.',
      'Ermöglicht eine quantitative Aussage über die verbleibende Resttragfähigkeit (Restholzquerschnitt).'
    ],
    cons: [
      'Nadeldrift: An schrägen Ästen oder Rissen kann die dünne Nadel im Holz verlaufen.',
      'Mantelreibung nimmt mit zunehmender Bohrtiefe zu und muss rechnerisch korrigiert werden.',
      'Erfordert fundierte Holzartenkenntnisse zur Unterscheidung von natürlicher Dichtevarianz und Schadstellen.'
    ],
    referenceValues: 'Gesundes Nadelholz (Fichte/Kiefer): Regelmäßige Oszillation mit Amplituden von 35–65 %. Kern- oder Braunfäule: Einbruch auf < 10 %. Insektenfraß (Anobien): Totaler Dichteverlust in den äußeren 10–30 mm.',
    interactiveType: 'bohrwiderstand'
  },

  // 2. COVERMETER / BEWEHRUNGSSUCHGERÄT
  {
    id: 'covermeter',
    name: 'Elektromagnetische Betondeckungsmessung (Covermeter)',
    shortName: 'Bewehrungssuchgerät',
    category: 'zfp',
    categoryLabel: 'Zerstörungsfreie Prüfung (ZfP / NDT)',
    badge: 'Wirbelstrom',
    standard: 'DIN EN 1992-1-1 (Eurocode 2), DGZfP-Merkblatt B2/B3, DBV-Merkblatt „Betondeckung und Bewehrung“ (2015)',
    principle: 'Elektromagnetische Induktion nach dem Wirbelstromverfahren. Eine Sensorspule im Prüfkopf erzeugt ein hochfrequentes magnetisches Wechselfeld. Befindet sich ein ferromagnetischer Bewehrungsstab im Wirkungsbereich, induziert das Wechselfeld Wirbelströme im Stahl, welche ein sekundäres Gegenmagnetfeld aufbauen. Die Phasenverschiebung und Amplitudenänderung der Sensorspannung wird präzise gemessen. Bei bekanntem oder kalibriertem Stabdurchmesser Ø lässt sich die Betondeckung c millimetergenau bestimmen.',
    formula: 'U_{\\text{ind}}(c) = K_0 \\cdot \\frac{\\emptyset^{a} \\cdot f}{(c + z_0)^b} \\quad \\implies \\quad c = \\left( \\frac{K_0 \\cdot \\emptyset^a \\cdot f}{U_{\\text{ind}}} \\right)^{1/b} - z_0',
    formulaExplanation: 'Die induzierte Sensorspannung U_ind fällt streng nichtlinear mit der Betondeckung c ab (typischer Exponent b ≈ 2,5–3,0) und steigt mit dem Stabdurchmesser Ø (Exponent a ≈ 1,0–1,5). K_0 und z_0 sind gerätespezifische Spulengeometrie-Konstanten, f ist die Arbeitsfrequenz.',
    steps: [
      'Betonoberfläche im Untersuchungsbereich von losem Staub, Salzkrusten und metallischen Anbauteilen reinigen.',
      'Messgerät abseits metallischer Einflüsse in der Luft oder auf unbewehrtem Referenzbeton nullen (Kalibrierabgleich).',
      'Sensorsonde mäanderförmig oder im rechtwinkligen Prüfraster über die Bauteilfläche führen.',
      'Peak-Signal (maximaler Signalausschlag bzw. minimaler Abstandswert) markiert die Achse des darunterliegenden Stabs.',
      'Prüfkopf um 90° drehen, um die Querbewehrung zu orten und Kreuzungspunkte im Bewehrungsplan zu erfassen.',
      'Betondeckungswerte c_nom im Raster protokollieren und statistisch nach DBV-Merkblatt auswerten (c_min-Konformität).'
    ],
    pros: [
      'Vollkommen zerstörungsfrei, beliebig oft wiederholbar und berührungslos messbar.',
      'Extrem schnelle flächige Kartierung von Bewehrungsmaschen und Überdeckungsdefiziten.',
      'Ermöglicht verlässliche Aussagen über die Dauerhaftigkeit (Carbonatisierungsschutz nach Eurocode 2).'
    ],
    cons: [
      'Kopplungseffekte bei eng liegenden Bewehrungslagen führen zu Scheinunterwerten der Betondeckung.',
      'Magnetische Zuschläge (z.B. Basalt, Schlacken, Magnetit) verzerren das primäre Spulenfeld.',
      'Physikalische Eindringtiefe ist konstruktionsbedingt auf ca. 120–150 mm begrenzt.'
    ],
    referenceValues: 'Mindestbetondeckung c_min nach DIN EN 1992-1-1: XC1 (trockener Innenraum) ≥ 15 mm; XC3/XC4 (Außenbauteil) ≥ 25–30 mm zzgl. Vorhaltemaß Δc_dev = 10 mm. Ist c_ist < c_min, besteht akute Korrosionsgefahr.',
    interactiveType: 'covermeter'
  },

  // 3. RÜCKPRALLHAMMER (SCHMIDT-HAMMER)
  {
    id: 'schmidthammer',
    name: 'Rückprallhammer-Prüfung nach Schmidt',
    shortName: 'Rückprallhammer',
    category: 'zfp',
    categoryLabel: 'Zerstörungsfreie Prüfung (ZfP / NDT)',
    badge: 'Kinetischer Impuls',
    standard: 'DIN EN 12504-2 („Bestimmung der Rückprallzahl“), DIN EN 13791 („In-situ-Druckfestigkeit“)',
    principle: 'Messung des elastischen Rückpralls einer definierten Masse von der Betonoberfläche. Ein federbelasteter Schlagbolzen schlägt mit genormter kinetischer Energie (Typ N: 2,207 Nm) auf die Betonoberfläche auf. Der beim Aufprall zurückprallende Weg der Hammermasse wird auf einer Skala als Rückprallwert R erfasst. Die Rückprallenergie korreliert mit der Oberflächenhärte und Elastizität des oberflächennahen Betongefüges. Über Kalibrierkurven und Bohrkernkorrelationen nach DIN EN 13791 wird hieraus die statische Druckfestigkeit f_c abgeschätzt.',
    formula: 'R = \\frac{s_{\\text{rebound}}}{s_{\\text{max}}} \\cdot 100 \\quad \\implies \\quad f_{c,\\text{is}} = \\alpha \\cdot R^\\beta \\cdot k_{\\text{carb}} \\cdot k_{\\text{angle}}',
    formulaExplanation: 'R ist die dimensionslose Rückprallzahl (0–100). Die abgeleitete Druckfestigkeit f_c,is wird über Potenz- oder Polynomgleichungen errechnet und mit Korrekturfaktoren für die Schlagrichtung (k_angle: horizontal, vertikal nach oben/unten) und Karbonatisierungstiefe (k_carb: Carbonatisierung erhärtet die Randzone künstlich) kalibriert.',
    steps: [
      'Messstelle auswählen: Ebener, dichter Beton ohne Kiesnester oder Risse; Abstand zu Kanten > 50 mm.',
      'Oberfläche mit dem beiliegenden Siliziumkarbid-Schleifstein kreisend von Zementhaut und Verunreinigungen befreien.',
      'Gerät senkrecht zur Oberfläche ansetzen und den Auslösemechanismus gleichmäßig gegen die Federkraft eindrücken.',
      'Schlagbolzen löst aus; Taste drücken, um den Messwert R auf der Skala zu arretieren.',
      'Mindestens 9 bis 12 Einzelschläge im Raster (Abstand je Schlag ≥ 25–30 mm) durchführen.',
      'Ausreißer eliminieren (Werte mit > 6 Einheiten Abweichung vom Median streichen) und Median berechnen.'
    ],
    pros: [
      'Sehr rasche und kostengünstige Vor-Ort-Prüfung zur Homogenitäts- und Festigkeitsabschätzung.',
      'Geringste Spuren an der Oberfläche (punktuelle Eindrücke d ≈ 10 mm).',
      'Hervorragend geeignet zur Abgrenzung schwacher Betonierabschnitte von qualitativ hochwertigen Bauteilzonen.'
    ],
    cons: [
      'Erfasst nur eine Randzone von ca. 20–30 mm Tiefe; innere Hohlräume werden nicht erkannt.',
      'Karbonatisierter Randbeton täuscht eine um bis zu 25–40 % zu hohe Festigkeit vor (Karbonatisierungskorrektur zwingend!).',
      'Treffer auf grobe Zuschlagskörner direkt unter der Oberfläche erzeugen extreme Falsch-Hochwerte.'
    ],
    referenceValues: 'Rückprallwert R (Typ N, horizontal): R < 20 (f_c < 15 N/mm², sehr weicher/minderfester Beton); R = 25–35 (Normalbeton C20/25 bis C25/30); R = 40–50 (Hochfester Beton C35/45 bis C50/60); R > 50 (sehr harter Beton bzw. Zuschlagstreffer).',
    interactiveType: 'schmidthammer'
  },

  // 4. ULTRASCHALL-LAUFZEITMESSUNG
  {
    id: 'ultraschall',
    name: 'Mehrkanal-Ultraschall-Laufzeitmessung (US)',
    shortName: 'Ultraschall (Beton)',
    category: 'zfp',
    categoryLabel: 'Zerstörungsfreie Prüfung (ZfP / NDT)',
    badge: 'Akustische Wellen',
    standard: 'DIN EN 12504-4 („Ultraschall-Impulsgeschwindigkeit“), DGZfP-Merkblatt B4, RILEM TC 43-CND',
    principle: 'Piezoelektrische Impulslaufzeitmessung von elastischen Longitudinalwellen (P-Wellen). Ein piezoelektrischer Prüfkopf koppelt hochfrequente Druckwellen (20–100 kHz) über ein Koppelmedium (Viskosegel) in den Baustoff ein. Die Wellen breiten sich im Kontinuum mit materialspezifischer Schallgeschwindigkeit aus und werden von einem Empfänger registriert. Fehlstellen wie Kiesnester, Risse oder Hohlräume besitzen eine verschwindend geringe akustische Impedanz im Vergleich zum dichten Zementstein, wodurch der Schall umgelenkt wird – dies führt zu signifikanten Laufzeitverzögerungen und Amplitudendämpfungen.',
    formula: 'v_p = \\frac{s}{\\Delta t} \\quad \\implies \\quad E_{\\text{dyn}} = \\rho \\cdot v_p^2 \\cdot \\frac{(1 + \\nu)(1 - 2\\nu)}{1 - \\nu}',
    formulaExplanation: 'v_p ist die Schallgeschwindigkeit (m/s), s ist die Messstrecke (m), Δt die Signallaufzeit (s). E_dyn ist der dynamische Elastizitätsmodul (N/m²), ρ die Rohdichte des Betons (kg/m³) und ν die Querdehnzahl (Poisson-Zahl, für Festbeton typisch ν ≈ 0,20).',
    steps: [
      'Messanordnung festlegen: Direktes Verfahren (Durchschallung gegenüberliegender Flächen), Halbdirektes Verfahren oder Indirektes Verfahren (Oberflächenschallung).',
      'Koppelmedium (Ultraschallgel, Vaseline oder Silikonpaste) luftblasenfrei auf die Prüfflächen auftragen.',
      'Sende- und Empfangsköpfe koaxial gegeneinander positionieren und mit gleichmäßigem Anpressdruck anhalten.',
      'Akustischen Impuls triggern und Signallaufzeit Δt am Oszilloskop/Prüfgerät mit Nanosekunden-Genauigkeit ablesen.',
      'Schallgeschwindigkeit v_p = s / Δt errechnen und auf thermische Dämpfungseinflüsse korrigieren.',
      'Im Rasterprofil Schallgeschwindigkeits-Tomogramme erstellen zur Lokalisierung innerer Inhomogenitäten.'
    ],
    pros: [
      'Zerstörungsfreie Detektion verborgener Gefügemängel (Kiesnester, Entmischungen, Hohlräume).',
      'Direkte quantitative Bestimmung des dynamischen E-Moduls in-situ.',
      'In Kombination mit dem Rückprallhammer (SonReb-Methode) hochpräzise Festigkeitsschätzung.'
    ],
    cons: [
      'Stahlbewehrung leitet Schall mit ca. 5.900 m/s (Beton nur ca. 4.000 m/s); längs verlaufende Stäbe führen zu Messfehlern.',
      'Oberflächenkopplung ist empfindlich gegen Rauheiten und unzureichenden Kontaktdruck.',
      'Feuchter Beton weist höhere Schallgeschwindigkeiten auf als trockener Beton (Feuchtekorrektur erforderlich).'
    ],
    referenceValues: 'Schallgeschwindigkeit v_p im Festbeton: v_p > 4.500 m/s (Hervorragende Qualität / Sehr hohe Homogenität); v_p = 3.500–4.500 m/s (Guter Normalbeton); v_p = 3.000–3.500 m/s (Zweifelhafte Qualität / Mikrorisse); v_p < 3.000 m/s (Mangelhaftes Gefüge / Kiesnester / Delaminationen).',
    interactiveType: 'ultraschall'
  },

  // 5. POTENTIALFELDMESSUNG
  {
    id: 'potentialfeld',
    name: 'Elektrochemische Potentialfeldmessung (Halbzellenpotential)',
    shortName: 'Potentialfeldmessung',
    category: 'zfp',
    categoryLabel: 'Zerstörungsfreie Prüfung (ZfP / NDT)',
    badge: 'Halbzelle / Korrosion',
    standard: 'DGZfP-Merkblatt B1 („Potenzialmessung zur Korrosionsortung“), SIA 2006, ASTM C876-09',
    principle: 'Elektrochemische Lokalisierung aktiv korrodierender Bewehrungsbereiche. Bei chloridinduzierter Lochfraßkorrosion oder Karbonatisierung bilden sich Makroelemente: Der korrodierende Bewehrungsstahl fungiert als Anode (Eisenlösung: Fe → Fe²⁺ + 2e⁻), während unbeschädigte Passivbereiche als Kathode wirken (Sauerstoffreduktion). Über eine elektrochemische Referenzelektrode (Kupfer/Kupfersulfat Cu/CuSO₄ oder Silber/Silberchlorid Ag/AgCl) auf der feuchten Betonoberfläche wird das elektrochemische Oberflächenpotential gegen das Bewehrungsgitter gemessen.',
    formula: 'E_{\\text{cell}} = E_{\\text{Ref}} - E_{\\text{Stahl}} = E^0 - \\frac{R \\cdot T}{z \\cdot F} \\ln\\left( \\frac{a_{\\text{Fe}^{2+}}}{a_{\\text{Fe}}} \\right) - I \\cdot R_{\\Omega}',
    formulaExplanation: 'E_cell ist das an der Betonoberfläche gemessene Potential. Gemäß Nernst-Gleichung verschiebt sich das Potential bei aktiver Eisenauflösung stark ins Negative. I · R_Ω repräsentiert den ohmschen Spannungsabfall im Beton-Elektrolyten.',
    steps: [
      'Lokalen Bewehrungsanschluss herstellen: An einer unkritischen Stelle die Bewehrung freistemmen und eine dauerhafte, niederohmige Klemmverbindung (< 1 Ω) befestigen.',
      'Prüffläche im Raster (z.B. 15 × 15 cm oder 20 × 20 cm) einmessen und kreidemarkieren.',
      'Betonoberfläche ausreichend vornässen (Trinkwasser mit Netzmittel), um einen geschlossenen elektrolytischen Kontakt herzustellen.',
      'Referenzelektrode (z.B. Cu/CuSO₄-Stab- oder Radelektrode) auf die Messpunkte aufsetzen.',
      'Potentialwert (in mV) am hochohmigen Voltmeter (Innenwiderstand R_i > 10 MΩ) ablesen.',
      'Erstellen einer flächigen Farb-Potentialkarte (Äquipotentiallinien) zur Visualisierung der Korrosionshotspots.'
    ],
    pros: [
      'Einziges zerstörungsfreies Verfahren zur Ortung aktiver Korrosion VOR dem Auftreten von Rissen und Rostfahnen.',
      'Sehr hohe Flächenleistung mit fahrbaren Mehrelektroden-Radsonden auf Parkdecks und Brückenfahrbahnen.',
      'Ermöglicht gezielte, minimalinvasive Instandsetzungskonzepte statt vollflächigem Betonabtrag.'
    ],
    cons: [
      'Erfordert die punktuelle Freilegung der Bewehrung zur elektrischen Kontaktierung.',
      'Trockener Beton blockiert den Ionenstrom (zu hoher Übergangswiderstand erzeugt Schein-Ruhewerte).',
      'Liefert ausschließlich die Korrosionswahrscheinlichkeit, nicht direkt den bereits eingetretenen Querschnittsverlust.'
    ],
    referenceValues: 'Potentialwerte gegen Cu/CuSO₄ nach ASTM C876 / DGZfP B1: E > -200 mV (Korrosionswahrscheinlichkeit < 10 %, passiver Zustand); E = -200 bis -350 mV (Übergangsbereich / Ungewiss); E < -350 mV (Korrosionswahrscheinlichkeit > 90 %, akute Lochfraßkorrosion); E < -500 mV (Extrem aktive Korrosionsanode).',
    interactiveType: 'potentialfeld'
  },

  // 6. GEORADAR (GPR)
  {
    id: 'georadar',
    name: 'Georadar (GPR - Ground Penetrating Radar)',
    shortName: 'Georadar (GPR)',
    category: 'zfp',
    categoryLabel: 'Zerstörungsfreie Prüfung (ZfP / NDT)',
    badge: 'Radarwellen / B-Scan',
    standard: 'ASTM D6432-19, DGZfP-Merkblatt B5 („Georadar im Bauwesen“), EN 302 065',
    principle: 'Elektromagnetische Impulsreflexionsmessung im Mikrowellenbereich (1,0 bis 4,0 GHz). Eine Sendeantenne sendet ultrakurze elektromagnetische Wellenpulse in das Bauteil. An Grenzflächen zwischen Medien mit unterschiedlicher relativer Permittivität (Dielektrizitätskonstante ε_r) – z.B. Beton zu Stahl, Beton zu Luft (Hohlraum), feuchter zu trockenem Beton – wird ein Teil der Welle reflektiert. Die Empfangsantenne registriert die Zweiwegelaufzeit t und Amplitude. Aus der Schar einzelner A-Scans entlang einer Messlinie entsteht das zweidimensionale Radargramm (B-Scan) mit charakteristischen Hyperbeln an stiftförmigen Reflektoren.',
    formula: 'v = \\frac{c_0}{\\sqrt{\\varepsilon_r}} \\quad \\implies \\quad z = v \\cdot \\frac{t}{2} = \\frac{c_0 \\cdot t}{2 \\cdot \\sqrt{\\varepsilon_r}}',
    formulaExplanation: 'v ist die Ausbreitungsgeschwindigkeit der Radarwelle im Material, c_0 die Vakuumlichtgeschwindigkeit (≈ 300.000 km/s), ε_r die relative Dielektrizitätskonstante des Baustoffs und t die Zweiwegelaufzeit. Die Tiefenlage z errechnet sich aus v · (t / 2).',
    steps: [
      'Messbereich rastern und Scanbahnen mit definiertem Spurabstand (z.B. 10 cm) anzeichnen.',
      'GPR-Antenne (z.B. 2,0 GHz Hochfrequenzantenne) mit integriertem Wegstrecken-Encoder aufsetzen.',
      'Antenne gleichmäßig mit kontinuierlicher Geschwindigkeit über die Prüflinie schieben.',
      'Echtzeit-Radargramm beobachten: Punktuelle metallische Reflektoren erzeugen scharfe parabelförmige Hyperbeln.',
      'Permittivität ε_r kalibrieren (z.B. durch Hyperbelanpassung oder an einer bekannten Bauteildicke).',
      '3D-Volumendatensätze (C-Scans) generieren, um Bewehrungslagen, Spannglieder und Hohlrohre räumlich darzustellen.'
    ],
    pros: [
      'Extrem hohe Messgeschwindigkeit und berührungslose, vollständig trockene Arbeitsweise.',
      'Deckt Spannglieder, Hüllrohre, Fußbodenheizungsrohre und Hohlräume im Bauteilinneren auf.',
      'Hohe räumliche Auflösung im Millimeterbereich bei hochfrequenten Antennen.'
    ],
    cons: [
      'Stark feuchter oder salzkontaminierter Beton dämpft elektromagnetische Wellen extrem stark (Signalverlust).',
      'Engmaschige obere Bewehrungslagen schirmen tiefere Bauteilschichten radaroptisch ab (Faradayscher Effekt).',
      'Unterscheidung zwischen metallischen und wassergefüllten Kunststoffrohren erfordert hohe Auswerteerfahrung.'
    ],
    referenceValues: 'Relative Permittivität ε_r: Luft = 1; Trockener Beton ≈ 6–8; Feuchter Beton ≈ 10–16; Wasser ≈ 81; Stahl/Metalle = unendlich (Totalreflexion mit Phasenumkehr). Ausbreitungsgeschwindigkeit im trockenen Beton: v ≈ 10–12 cm/ns.',
    interactiveType: 'schmidthammer'
  },

  // 7. IMPACT-ECHO VERFAHREN
  {
    id: 'impact_echo',
    name: 'Impact-Echo-Verfahren (Resonanzfrequenzanalyse)',
    shortName: 'Impact-Echo',
    category: 'zfp',
    categoryLabel: 'Zerstörungsfreie Prüfung (ZfP / NDT)',
    badge: 'Resonanz / Dicke',
    standard: 'DGZfP-Merkblatt B11 („Impact-Echo-Verfahren“), ASTM C1383-15',
    principle: 'Kurzzeit-Schallanregung und Spektralanalyse von Spannungsresonanzwellen. Ein kleiner mechanischer Impaktor (Stahlkugel Ø 3–12 mm) schlägt punktförmig auf die Betonoberfläche und erzeugt niederfrequente elastische P- und S-Wellen sowie Rayleigh-Oberflächenwellen. Die P-Wellen reflektieren an der Bauteilrückwand oder an inneren Fehlstellen (Kiesnester, Delaminationen, Verpressmängel von Spanngliedern) und laufen mehrfach hin und her. Ein hochempfindlicher Piezo-Aufnehmer registriert die Oberflächenverschiebung. Mittels Fast-Fourier-Transformation (FFT) wird das Frequenzspektrum berechnet; der dominante Resonanzpeak f_peak korrespondiert direkt mit der Reflektortiefe.',
    formula: 'f_{\\text{peak}} = \\frac{\\beta_T \\cdot v_p}{2 \\cdot d} \\quad \\implies \\quad d = \\frac{\\beta_T \\cdot v_p}{2 \\cdot f_{\\text{peak}}}',
    formulaExplanation: 'f_peak ist die dominante Resonanzfrequenz im Amplitudenspektrum (Hz), v_p die P-Wellengeschwindigkeit im Beton (m/s), d die Bauteildicke bzw. Tiefe der Fehlstelle (m) und β_T ein Formfaktor (für unendlich ausgedehnte Platten typisch β_T ≈ 0,96).',
    steps: [
      'Messpunkt auf ebener Betonfläche markieren; Sensor-Kontaktstelle säubern.',
      'Piezoelektrischen Breitband-Wegaufnehmer nahe der Schlagstelle (< 5 cm Abstand) aufsetzen.',
      'Mit dem Federstahlkugel-Impaktor einen definierten Schlag rechtwinklig zur Oberfläche ausführen.',
      'Aufzeichnung des Zeitsignals der Oberflächenbeschleunigung (ca. 1–2 Millisekunden Abtastfenster).',
      'Automatische Transformation in den Frequenzbereich via FFT (Fast Fourier Transformation).',
      'Resonanzpeak f_peak identifizieren: Entspricht er der Bauteildicke oder liegt er bei höheren Frequenzen (interne Delamination)?'
    ],
    pros: [
      'Einseitige Zugänglichkeit genügt vollkommen (ideal für Tunnelinnenschalen, Stützwände, Brückenüberbauten).',
      'Präzise Dickenmessung ohne Kernbohrung und zerstörungsfreie Ortung von Hohlstellen unter Spanngliedern.',
      'Unempfindlich gegenüber dicht liegenden Bewehrungslagen im Vergleich zum Georadar.'
    ],
    cons: [
      'Erfordert die genaue Kenntnis der Schallgeschwindigkeit v_p zur korrekten Tiefenumrechnung.',
      'Sehr oberflächennahe Delaminationen (< 3 cm) erzeugen Biegeschwingungen, die die Plattendickenresonanz überlagern.',
      'Schlagenergie und Kugelgröße müssen sorgfältig auf die vermutete Bauteiltiefe abgestimmt werden.'
    ],
    referenceValues: 'Plattendickenresonanz: Für eine 30 cm starke Betonwand (v_p = 4.000 m/s) liegt der Dickenpeak bei ca. f = (0,96 · 4.000) / (2 · 0,30) ≈ 6,4 kHz. Liegt der Peak bei 18 kHz, befindet sich in ca. 10,7 cm Tiefe eine Delamination oder ein Hohlraum.',
    interactiveType: 'impact_echo'
  },

  // 8. KARBONATISIERUNGS-INDIKATORTEST
  {
    id: 'karbonatisierung',
    name: 'Karbonatisierungs-Tiefenmessung (Phenolphthalein-Test)',
    shortName: 'Phenolphthalein-Test',
    category: 'minimalinvasiv',
    categoryLabel: 'Minimalinvasives Prüfverfahren',
    badge: 'pH-Indikator / Chemie',
    standard: 'DIN EN 14630 („Bestimmung der Karbonatisierungstiefe im Festbeton“), DIN EN 206, DAfStb TR Instandhaltung',
    principle: 'Farbindikatorbasierte pH-Wert-Analyse des Porenwassers. Im unkarbonatisierten Beton herrscht durch das bei der Zementhydratation freigesetzte Calciumhydroxid Ca(OH)₂ ein stark alkalisches Milieu (pH ≈ 12,6 bis 13,5), das den Bewehrungsstahl durch eine dichte Passivschicht aus Eisenoxiden vor Korrosion schützt. Reagiert das Ca(OH)₂ mit dem atmosphärischen Kohlendioxid CO₂ zu Calciumcarbonat CaCO₃, sinkt der pH-Wert auf unter 9,0 ab (Depassivierung). Wird eine 1 %ige ethanolische Phenolphthalein-Lösung auf eine frische Bruchfläche gesprüht, schlägt der Farbstoff im basischen Bereich (pH ≥ 9,2) schlagartig in leuchtendes Purpur/Weinrot um, während entalkalisierter Beton farblos bleibt.',
    formula: '\\text{Ca(OH)}_2 + \\text{CO}_2 \\xrightarrow{} \\text{CaCO}_3 + \\text{H}_2\\text{O} \\quad \\implies \\quad d_k(t) = k_{\\text{carb}} \\cdot \\sqrt{t}',
    formulaExplanation: 'Die Karbonatisierungsreaktion verbraucht Calciumhydroxid und bildet Kalkstein. Die Karbonatisierungstiefe d_k wächst näherungsweise mit der Wurzel der Expositionszeit t (Diffusionsgesetz). k_carb ist der Karbonatisierungsbeiwert (mm/√Jahr), abhängig von Betonporosität, w/z-Wert und Feuchtegehalt.',
    steps: [
      'Messstelle auswählen und durch vorsichtiges Anstemmen oder Spalten eines Bohrkerns eine absolut frische Bruchfläche erzeugen (Niemals nass sägen, da Sägewasser den pH-Wert verschleppt!).',
      'Bruchfläche sofort mit ölfreier Druckluft oder einem trockenen Pinsel gründlich vom losen Bohrmehl und Staub befreien.',
      '1 %ige alkoholische Phenolphthalein-Indikatorlösung mit einem Zerstäuber gleichmäßig und fein aufnebeln.',
      'Reaktionszeit von ca. 60 bis 120 Sekunden abwarten, bis sich der Farbumschlag klar stabilisiert hat.',
      'Karbonatisierungstiefe d_k als Abstand von der Außenoberfläche bis zur Umschlagfront an mehreren Punkten mit der Schieblehre/Messlupe messen.',
      'Mittelwert d_k,mean und Maximalwert d_k,max protokollieren und mit der vorhandenen Betondeckung c abgleichen.'
    ],
    pros: [
      'Extrem anschauliches, kontrastreiches und gerichtlich unanfechtbares Prüfergebnis vor Ort.',
      'Sehr geringe Material- und Gerätekosten bei unmittelbarer Ergebnisverfügbarkeit.',
      'Ermöglicht über das Wurzelsystem die rechnerische Prognose der Rest-Passivierungsdauer des Stahls.'
    ],
    cons: [
      'Erfordert zwingend eine mechanische Bauteilöffnung (Stemm- oder Bohrkernbruch).',
      'Verschleppter Bohrstaub kann die farblose Zone kontaminieren und Fehlurteile auslösen.',
      'Bei vollständig wassergesättigtem Beton diffundiert kein CO₂, weshalb die Messung nur den aktuellen Ist-Zustand widerspiegelt.'
    ],
    referenceValues: 'Sicherheitskriterium: d_k,max < c_min (Betondeckung). Beträgt die Betondeckung c = 30 mm und die gemessene Karbonatisierungstiefe d_k = 28 mm, beträgt die verbleibende Schutzschicht nur 2 mm – Depassivierung und Korrosion stehen unmittelbar bevor.',
    interactiveType: 'karbonatisierung'
  },

  // 9. BOHRKERNENTNAHME (DRUCKFESTIGKEIT)
  {
    id: 'bohrkern',
    name: 'Zylindrische Bohrkernentnahme & Druckprüfung',
    shortName: 'Bohrkern (Druckfestigkeit)',
    category: 'zerstoerend',
    categoryLabel: 'Zerstörendes Laborprüfverfahren',
    badge: 'Referenzprüfung',
    standard: 'DIN EN 12504-1 („Bohrkerne - Entnahme und Prüfung“), DIN EN 13791 („Bewertung der In-situ-Druckfestigkeit“), DIN 1045-2',
    principle: 'Echtes physikalisches Referenzprüfverfahren zur Bestimmung der realen In-situ-Betondruckfestigkeit. Eine wassergekühlte Diamantkernbohrlafette schneidet zylindrische Prüfkörper (Regeldurchmesser Ø 100 mm oder Ø 50 mm) direkt aus dem Tragwerk. Die Stirnflächen der entnommenen Zylinder werden im Baustofflabor planparallel geschliffen oder mit Schwefelmörtel/Capping präpariert. In einer kalibrierten hydraulischen Universalprüfmaschine wird der Kern anschließend unter axialer, weggesteuerter Lasteinleitung bis zum Gefügebruch belastet.',
    formula: 'f_{c,\\text{is}} = \\frac{F_{\\text{max}}}{A_c} \\quad \\implies \\quad f_{c,\\text{cube150}} = k_{\\text{shape}} \\cdot f_{c,\\text{is}}',
    formulaExplanation: 'f_c,is ist die In-situ-Zylinderdruckfestigkeit (N/mm²), F_max die Höchstlast beim Bruch (N), A_c die Querschnittsfläche (mm²). k_shape ist der Umrechnungsfaktor auf Standard-Würfelfestigkeit (für L/D = 1,0 gilt typisch k ≈ 1,00, für L/D = 2,0 gilt k ≈ 1,25; Bohrkern-Schlankheitskorrektur nach DIN EN 12504-1).',
    steps: [
      'Bewehrung vorab mittels Covermeter lokalisieren, um das Durchtrennen tragender Hauptbewehrung zwingend zu vermeiden.',
      'Bohrlafette mit Dübelanker oder Vakuumpumpe schwingungsfrei am Bauteil befestigen.',
      'Wasserkühlung anschließen und Diamantbohrkrone unter stetiger Vorschubkraft einfahren.',
      'Bohrkern am Grund abscheren, sorgfältig entnehmen, nummerieren und Bohrloch sofort vermessen.',
      'Im Labor die Stirnflächen des Bohrkerns planschleifen (Toleranz: Planparallelität ≤ 0,05 mm, L/D = 1,0 bis 2,0).',
      'Druckversuch nach DIN EN 12390-3 mit stetiger Laststeigerung (0,6 ± 0,2 N/mm²s) bis zum Bruch durchführen.'
    ],
    pros: [
      'Einziges rechtssicheres, baurechtlich und gutachterlich unanfechtbares Prüfverfahren für Festigkeitsnachweise.',
      'Liefert ungestörtes Probenmaterial für Folgeuntersuchungen (Rohdichte, statischer E-Modul, Porosität, Dünnschliff).',
      'Ermöglicht die verbindliche Kalibrierung aller indirekten ZfP-Verfahren (SonReb, Schmidt-Hammer).'
    ],
    cons: [
      'Zerstörender Eingriff erfordert statische Vorprüfung und fachgerechte Reprofilierung der Bohrlöcher mit Quellmörtel.',
      'Gefahr von Querschnittsfehlern bei unzureichend verankertem Bohrstativ (Riffelungen am Zylindermantel).',
      'Bewehrungstreffer im Bohrkern verfälschen das Bruchbild und führen zur Ungültigkeit der Druckprüfung.'
    ],
    referenceValues: 'Druckfestigkeitsklassen nach DIN EN 206-1: C20/25 (f_ck,cyl = 20 N/mm², f_ck,cube = 25 N/mm²); C30/37 (f_ck,cyl = 30 N/mm²); C50/60 (f_ck,cyl = 50 N/mm²). In-situ-Kerne erreichen normgemäß etwa 85 % der 28-Tage-Laborprobekörperfestigkeit (DIN EN 13791).',
    interactiveType: 'bohrkern'
  },

  // 10. BOHRMEHLANALYSE (CHLORIDPROFIL)
  {
    id: 'bohrmehl',
    name: 'Tiefengestaffelte Bohrmehlanalyse (Chloriddiffusionsprofil)',
    shortName: 'Bohrmehlanalyse (Chloride)',
    category: 'zerstoerend',
    categoryLabel: 'Zerstörendes Labor- & Feldprüfverfahren',
    badge: 'Lochfraß / Titration',
    standard: 'DIN EN 14629 („Chloridgehalt von Festbeton“), DBV-Merkblatt „Chloridbestimmung an Betonbauwerken“ (2018), DAfStb TR Instandhaltung',
    principle: 'Quantitative Erfassung der Tiefenverteilung korrosionsauslösender Chloridionen (Cl⁻). Tausalze im Sprühnebelbereich von Brücken oder Parkdecks penetrieren über Kapillartransport und Diffusion die Zementsteinmatrix. Durch schrittweises Bohren mit Spezialbohrern (Ø 12–20 mm) in definierten Tiefenstufen (z.B. 0–5, 5–10, 10–20, 20–30 mm) wird reines Bohrmehl fraktionsweise abgesaugt. Im Labor wird das Bohrmehl mit Salpetersäure aufgeschlossen; die freigesetzten Chloride werden mittels potentiometrischer Titration mit Silbernitrat (AgNO₃) quantifiziert.',
    formula: '\\text{Cl}^{-}_{\\text{Gew.-\\% bez. auf Zement}} = \\frac{V_{\\text{AgNO}_3} \\cdot c_{\\text{AgNO}_3} \\cdot M_{\\text{Cl}}}{m_{\\text{Einwaage}} \\cdot f_{\\text{Zement}}} \\cdot 100',
    formulaExplanation: 'V_AgNO3 ist das verbrauchte Titrationsvolumen, c_AgNO3 die Stoffmengenkonzentration (typ. 0,1 mol/l), M_Cl die Molmasse von Chlor (35,45 g/mol), m_Einwaage die Masse des getrockneten Bohrmehls und f_Zement der Zementsteinanteil des Betons (typisch ca. 14–18 Gew.-%).',
    steps: [
      'Messpunkte im chloridbelasteten Sprüh- oder Pfützenbereich auswählen; stahlfreie Zonen mit dem Covermeter orten.',
      'Bohrtiefenstufen festlegen (z.B. Stufe 1: 0–5 mm, Stufe 2: 5–15 mm, Stufe 3: 15–30 mm, Stufe 4: 30–50 mm).',
      'Erste Stufe abbohren; Bohrmehl über einen staubdichten Absaugtrichter direkt auf einem Spezialfilterpapier auffangen.',
      'Bohrloch vor Beginn der nächsten Tiefenstufe gründlich mit Druckluft aussaugen, um Staubverschleppung zu verhindern.',
      'Proben fraktionsweise in gasdichte Gefäße füllen und eindeutig mit Bauteilkoordinaten und Tiefenstufe beschriften.',
      'Laboranalyse durchführen: Säureaufschluss, Filtration und Titration; Diffusionsprofil C(x) über die Tiefe x plotten.'
    ],
    pros: [
      'Einzige Methode zur Erstellung des exakten Chlorid-Diffusionsprofils C(x) als Basis für Instandsetzungsberechnungen.',
      'Geringe Querschnittsschwächung (kleine Bohrlöcher Ø 14 mm, leicht mit Zementmörtel zu schließen).',
      'Ermöglicht den Nachweis, ob an der Bewehrungslage der kritische korrosionsauslösende Chloridgehalt überschritten ist.'
    ],
    cons: [
      'Aufwendige, zeitverzögerte nasschemische Laboranalytik.',
      'Unsauberes Aussaugen zwischen den Stufen verschleppt Chloride von außen in tiefere Schichten (Schein-Tiefenwerte).',
      'Der Zementgehalt des Altbetons muss geschätzt oder petrografisch bestimmt werden, um auf Gew.-% bezogen auf Zement umzurechnen.'
    ],
    referenceValues: 'Kritischer Chloridgehalt nach DAfStb / Eurocode 2: Schlaff bewehrter Beton: Cl_krit = 0,40 Gew.-% bezogen auf Zement; Spannbeton (extrem hohe Riss- und Lochfraßgefahr): Cl_krit = 0,20 Gew.-% bezogen auf Zement. Bei Werten > Cl_krit ist Betonabtrag bis hinter die Bewehrung erforderlich.',
    interactiveType: 'bohrmehl'
  },

  // 11. HAFTABZUGSPRÜFUNG
  {
    id: 'haftabzug',
    name: 'Haftabzugsprüfung (Abreißversuch)',
    shortName: 'Haftzugprüfung',
    category: 'zerstoerend',
    categoryLabel: 'Zerstörendes Prüfverfahren',
    badge: 'Abreißkraft',
    standard: 'DIN EN 1542 („Messung der Haftfestigkeit im Abreißversuch“), DAfStb TR Instandhaltung (Teil 4), ZTV-ING',
    principle: 'Mechanische Prüfung der Abreißfestigkeit der oberflächennahen Betonschichten oder der Verbundfestigkeit von Instandsetzungsmörteln und Beschichtungen (OS-Systeme). Ein kreisrunder Prüfstempel aus Stahl (Ø 50 mm) wird mit schnellhärtendem Zweikomponenten-Epoxidharzklebstoff kraftschlüssig auf die vorbereitete Oberfläche geklebt. Anschließend wird der Beton koaxial um den Stempel herum ca. 10–15 mm tief kreisförmig eingeschnitten (Ringnut), um Querdehnungs- und Randschubkräfte zu eliminieren. Das Abzugsgerät zieht den Stempel mit konstanter Laststeigerung senkrecht ab.',
    formula: 'f_{ct} = \\frac{4 \\cdot F_{\\text{break}}}{\\pi \\cdot d^2} \\quad \\implies \\quad f_{ct} = \\frac{F_{\\text{break}}}{A_{\\text{Stempel}}}',
    formulaExplanation: 'f_ct ist die Abreißfestigkeit (N/mm²), F_break die Bruchkraft beim Versagen (N), d der Stempeldurchmesser (für d = 50 mm ist A_Stempel = 1.963,5 mm²). Neben dem Zahlenwert muss zwingend das Bruchbild protokolliert werden (z.B. A = Kohäsionsbruch im Beton, B = Adhäsionsbruch, C = Kleberversagen).',
    steps: [
      'Prüffläche reinigen, leicht anschleifen und staubfrei absaugen.',
      'Prüfstempel (Ø 50 mm) mit 2K-Epoxidharz vollflächig und ohne Lufteinschlüsse auf die Prüfstelle kleben.',
      'Nach Aushärtung des Klebers mit einer Diamant-Hohlkrone eine Ringnut koaxial zum Stempel ca. 10–15 mm in den Beton schneiden.',
      'Abreißprüfgerät zugkraftfrei und zentrisch auf das Gewinde des Prüfstempels aufschrauben.',
      'Last stetig und stoßfrei mit einer Spannungsrate von 0,05 ± 0,01 N/mm²s bis zum Bruch steigern.',
      'Bruchlast F_break am Schleppzeiger/Digitaldisplay notieren und Bruchbild (Bruchfläche in %) visuell klassifizieren.'
    ],
    pros: [
      'Normativ zwingend vorgeschriebene Abnahmeprüfung vor und nach jeder Betoninstandsetzung.',
      'Eindeutige Aussage über die Festigkeit der oberflächennahen Randzone und den Verbund neuer Schichten.',
      'Direkte Unterscheidung zwischen Werkstoffversagen (Betonbruch) und Verarbeitungsfehlern (Verbundversagen).'
    ],
    cons: [
      'Nicht-zentrischer, schräger Kraftangriff erzeugt Biegemomente und führt zu drastisch zu niedrigen Bruchwerten.',
      'Erfordert mehrmalige Baustellenanfahrten (Klebemörtel benötigt Aushärtezeit von mehreren Stunden).',
      'Zerstört die Oberfläche lokal (Reprofilierung mit Reparaturmörtel erforderlich).'
    ],
    referenceValues: 'Anforderungen nach DAfStb TR Instandhaltung / ZTV-ING: Untergrund vor Betonersatz: Mittelwert f_ct,mean ≥ 1,5 N/mm², kein Einzelwert < 1,0 N/mm². Für starre PCC-Beschichtungen (OS 8 / OS 11): f_ct,mean ≥ 1,5 N/mm² bei 100 % Betonbruch.',
    interactiveType: 'haftabzug'
  },

  // 12. KARSTENSCHES PRÜFRÖHRCHEN
  {
    id: 'karsten',
    name: 'Karstensches Prüfröhrchen (Kapillare Wasseraufnahme)',
    shortName: 'Karstensches Röhrchen',
    category: 'minimalinvasiv',
    categoryLabel: 'Minimalinvasives Prüfverfahren',
    badge: 'Wasseraufnahme / Fassade',
    standard: 'DIN EN 15148 („Kapillare Wasseraufnahme“), WTA-Merkblatt 2-11 („Natursteinmauerwerk“), RILEM II.4',
    principle: 'Messtechnische Erfassung der kapillaren Wasseraufnahme mineralischer Baustoffoberflächen (Putz, Beton, Mauerziegel, Naturstein) unter realitätsnahem hydrostatischem Druck. Ein graduiertes Glas-Prüfröhrchen mit glockenförmigem Flansch wird mit plastischem Dichtungskitt absolut wasserdicht auf die Oberfläche geklebt. Das Röhrchen wird bis zur 0-Marke mit Wasser befüllt. Die Wassersäule von 10 cm Höhe erzeugt einen hydrostatischen Überdruck von ca. 1.000 Pa (10 hPa), was dem Staudruck von orkanartigem Schlagregen bei Windgeschwindigkeiten von ca. 140 km/h entspricht. Das in die Poren eingesaugte Wasservolumen wird zeitabhängig gemessen.',
    formula: 'w_{\\text{kap}} = \\frac{\\Delta V \\cdot \\rho_w}{A \\cdot \\sqrt{t}} \\quad \\left[ \\frac{\\text{kg}}{\\text{m}^2 \\cdot \\sqrt{\\text{h}}} \\right]',
    formulaExplanation: 'w_kap ist der Wasseraufnahmekoeffizient, ΔV das absorbierte Wasservolumen (ml = cm³), ρ_w die Wasserdichte (1 g/cm³), A die kreisförmige Kontaktfläche des Röhrchens (typisch A ≈ 4,5 cm²) und t die Messzeit (h).',
    steps: [
      'Prüfstelle an der Fassade oder Wand vorsichtig von losem Schmutz und Moos befreien; Untergrund muss trocken sein.',
      'Plastischen Kitt (z.B. dauerelastischen Butylkitt) zu einer gleichmäßigen Wulst rollen und um den Glasflansch legen.',
      'Prüfröhrchen fest gegen den Untergrund drücken, sodass der Kitt ringsum gleichmäßig und luftdicht herausquillt.',
      'Wasser vorsichtig über eine Spritzflasche blasenfrei bis zur obersten Skalenmarke (0 ml) einfüllen.',
      'Stoppuhr starten und den fallenden Meniskus des Wasserstands nach 5, 10, 15, 30 und 60 Minuten millimetergenau ablesen.',
      'Messwerte in ein Diagramm (ml über √t) eintragen und den Steigungskoeffizienten w_kap ermitteln.'
    ],
    pros: [
      'Extrem einfache, zerstörungsfreie und anschauliche Vor-Ort-Prüfung ohne Strom- oder Laborbedarf.',
      'Hervorragend geeignet zur Überprüfung der Wirksamkeit von Hydrophobierungen und Imprägnierungen.',
      'Simuliert realitätsnah den Wasserandrang bei schlagregenbeanspruchten Außenfassaden.'
    ],
    cons: [
      'Sehr empfindlich gegen Undichtigkeiten im Dichtungskitt (Kittabrisse täuschen gigantische Wasseraufnahmen vor).',
      'Nicht anwendbar auf extrem rauen Oberflächen oder offenen Rissen.',
      'Stark abhängig von der Ausgangsfeuchte des Baustoffs zum Messzeitpunkt.'
    ],
    referenceValues: 'Fassaden-Beurteilung nach w-Wert: w < 0,1 kg/(m²√h): Wasserabweisend (Hydrophobiert, hervorragender Feuchteschutz); w = 0,1 bis 0,5 kg/(m²√h): Wasserhemmend (Normale Außenputze); w > 0,5 kg/(m²√h): Saugschwach bis stark saugend (akute Durchfeuchtungs- und Frostschadengefahr!).',
    interactiveType: 'karsten'
  },

  // 13. FASEROPTISCHE ENDOSKOPIE
  {
    id: 'endoskopie',
    name: 'Faseroptische Endoskopie & Videoskopie',
    shortName: 'Videoskopie / Endoskopie',
    category: 'minimalinvasiv',
    categoryLabel: 'Minimalinvasives Prüfverfahren',
    badge: 'Optik / Hohlraum',
    standard: 'DIN 1076 („Ingenieurbauwerke - Prüfung“), WTA-Merkblatt 8-3, WTA-Merkblatt 2-9',
    principle: 'Direkte optische Visualisierung verborgener Bauwerkshohlräume durch Mikrobohrungen. Über eine Kleinstbohrung (Ø 6–10 mm) wird eine flexible oder starre optische Sonde eingeführt. Hochleistungs-LED-Lichtquellen an der Sondenspitze leuchten das Bauteilinnere aus. Ein hochauflösender CMOS-Kamerasensor mit Weitwinkelobjektiv überträgt Live-Videobilder und Fotos an eine Inspektionseinheit. Bei lenkbaren Videoskopen kann die Spitze um bis zu 360° geschwenkt werden, um Hüllrohre, Hohlräume in zweischaligem Mauerwerk, Holzbalkenauflager oder Spanngliedverpressungen millimetergenau zu begutachten.',
    formula: 'B_{\\text{sicht}} = 2 \\cdot d_{\\text{objekt}} \\cdot \\tan\\left( \\frac{\\theta_{\\text{FOV}}}{2} \\right)',
    formulaExplanation: 'B_sicht ist der sichtbare Bildfelddurchmesser im Hohlraum, d_objekt der Arbeitsabstand der Linse zur Zielfläche und θ_FOV das optische Sichtfeld (Field of View, typisch 70° bis 120°).',
    steps: [
      'Bohrpunkt sorgfältig auswählen (abseits von Bewehrungseisen, Spanndrähten oder Medienleitungen).',
      'Kleinstbohrung mit scharfem Hartmetallbohrer (Ø 8–10 mm) erschütterungsarm niederbringen.',
      'Bohrstaub vollständig mit einer feinen Saug- und Blaslanze aus dem Kanal und Hohlraum entfernen.',
      'Videoskop-Sonde vorsichtig einschieben, Bildfokus einstellen und Helligkeit regulieren.',
      'Systematischer Kameraschwenk: Risssuche, Verpressfehlstellen, Korrosionsspuren oder Holzwurmbefall dokumentieren.',
      'Bohrloch mit mineralischem Injektionsmörtel oder farblich passendem Dübel witterungsdicht verschließen.'
    ],
    pros: [
      'Bietet ein unverfälschtes, hochauflösendes Farbbild direkt aus dem verborgenen Bauteilinneren.',
      'Minimaler Querschnittseingriff (Bohrlochgröße d < 10 mm, keine statische Beeinträchtigung).',
      'Unverzichtbar zur Kontrolle von Hüllrohren auf Spanndrahtbrüche und Hohlstellen.'
    ],
    cons: [
      'Staubige oder feuchte Hohlräume können die winzige Kameralinse sofort beschlagen und erblinden lassen.',
      'Liefert immer nur punktuelle Einblicke ohne flächenhafte Gesamterfassung.',
      'Ausleuchtungstiefe in großen Hohlräumen ist physikalisch auf ca. 1–2 m beschränkt.'
    ],
    referenceValues: 'Typische Einsatzgebiete: Überprüfung der Einpressmörtel-Füllung in Spanngliedhüllrohren nach DIN EN 446; Schwellen- und Zapfenüberprüfung im Fachwerk; Kontrolle von Luftschichten in Klinkerfassaden.',
    interactiveType: 'bohrwiderstand'
  },

  // 14. GRAVIMETRISCHE DARR-METHODE
  {
    id: 'darrmethode',
    name: 'Gravimetrische Darr-Methode (Feuchtereferenz)',
    shortName: 'Darr-Methode (Feuchte)',
    category: 'zerstoerend',
    categoryLabel: 'Zerstörendes Labor-Referenzverfahren',
    badge: 'Referenz / Feuchte',
    standard: 'DIN EN ISO 12570 („Bestimmung des Feuchtegehalts durch Trocknung bei erhöhter Temperatur“), DIN EN ISO 12571',
    principle: 'Absolutes physikalisches Referenzprüfverfahren zur Bestimmung des wahren Wassergehalts poröser Baustoffe. Eine Baustoffprobe (Betonbruch, Ziegelstein, Mörtel, Estrich) wird unmittelbar nach der Entnahme gasdicht verpackt, im Labor auf einer Analysenwaage auf 0,01 g genau gewogen (Feuchtmasse m_feucht) und anschließend im Umlufttrockenschrank bei exakt 105 ± 2 °C (bei Gips/Anhydrit nur bei 40 °C, um Kristallwasserabspaltung zu verhindern) getrocknet, bis sich Massekonstanz einstellt. Die Massendifferenz entspricht dem freien und kapillaren Porenwasser.',
    formula: 'u_{\\text{Masse-\\%}} = \\frac{m_{\\text{feucht}} - m_{\\text{trocken}}}{m_{\\text{trocken}}} \\cdot 100 \\quad [\\text{M.-\\%}]',
    formulaExplanation: 'u_Masse-% ist der gravimetrische Feuchtegehalt bezogen auf die Trockenmasse m_trocken. m_feucht ist die Ausgangsmasse vor der Trocknung.',
    steps: [
      'Probenahme: Mindestens 50–100 g Material aus der gewünschten Tiefe herausstemmen oder meißeln (kein Nassbohren!).',
      'Probenstücke sofort in diffusionsdichte Alu-Verbundbeutel oder Schraubgläser füllen, um Verdunstungsverluste zu verhindern.',
      'Im Labor Einwaage der Feuchtmasse m_feucht auf einer kalibrierten Analysenwaage (Genauigkeit 0,01 g).',
      'Probe im belüfteten Trockenschrank bei 105 °C (bzw. 40 °C bei Gips) bis zur Gewichtskonstanz temperieren.',
      'Nach dem Trocknen im Exsikkator über Kieselgel auf Raumtemperatur abkühlen lassen (verhindert Feuchteaufnahme aus der Luft).',
      'Trockenmasse m_trocken wiegen und Masseprozent berechnen.'
    ],
    pros: [
      'Unerlässliches Referenzverfahren zur Eichung aller elektronischen Feuchtesonden (CM-Gerät, Mikrowelle, TDR).',
      'Vollkommen unbeeinflusst von Salzen, Chloriden oder chemischen Inhaltsstoffen im Porenwasser.',
      'Gilt vor Gericht als unanfechtbarer Beweis für Feuchteschäden und Trocknungszustände.'
    ],
    cons: [
      'Zerstörendes Verfahren mit Probenahmeaufwand vor Ort.',
      'Mehrtägige Trocknungsdauer (mind. 24 bis 48 Stunden bis zur Massekonstanz).',
      'Organisch vergütete Baustoffe (z.B. kunstharzmodifizierte Mörtel) können bei 105 °C zersetzt werden.'
    ],
    referenceValues: 'Praktische Feuchtewerte im Festbeton: Ausgleichsfeuchte Innenraum (trocken) ≈ 2,0–3,0 M.-%; Freie Bewitterung Außenbereich ≈ 4,5–5,5 M.-%; Vollständige Porenwassersättigung ≈ 8,0–10,0 M.-%. Estrich-Belegreife (Zementestrich unbeheizt) nach DIN 18560: ≤ 2,0 CM-% (entspricht ca. 3,0–3,5 M.-% Darrfeuchte).',
    interactiveType: 'darrmethode'
  }
];
