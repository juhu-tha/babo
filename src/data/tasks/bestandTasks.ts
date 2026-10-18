import { Task } from '../aufgabenData';

export const bestandTasks: Task[] = [
  {
    id: 't21',
    difficulty: 'Mittel',
    title: 'ZfP: Rückprallhammer nach DIN EN 12504-2',
    question: 'Bei der Prüfung einer Bestandsstütze mit dem Schmidt-Rückprallhammer messen Sie einen mittleren Rückprallwert von R = 38. Welche ungefähre Würfeldruckfestigkeit können Sie erwarten?',
    moduleHint: { id: 'bauwerksuntersuchung', name: 'Bauwerksuntersuchung (ZfP)' },
    solution: 'Ein Rückprallwert von R = 38 entspricht bei waagerechter Prüfung und normalem Alter des Betons einer Würfeldruckfestigkeit von ca. 35–40 MPa (entspricht in etwa einem C25/30 bis C30/37). Bei Bestandsbeton muss jedoch berücksichtigt werden, dass eine carbonatisierte Randzone die Oberflächenhärte künstlich erhöht. Eine Kalibrierung an Bohrkernen nach DIN EN 13791 ist für statisch verwertbare Gutachten zwingend erforderlich.'
  },
  {
    id: 't22',
    difficulty: 'Leicht',
    title: 'Historische Kennwerte: Umrechnung historischer Klassen',
    question: 'In alten Bestandsplänen von 1975 finden Sie die Angabe "Beton B 250" und "Betonstahl III". Welche heutigen Festigkeitsklassen (C-Klasse und B500) entsprechen diesen Werten?',
    moduleHint: { id: 'historisch', name: 'Historische Kennwerte' },
    solution: '"B 250" (bzw. B 25 nach DIN 1045) entspricht einer Mindest-Würfeldruckfestigkeit von 25 MPa, was heute der Festigkeitsklasse C20/25 entspricht. "Betonstahl III" (BSt 420) hat eine charakteristische Streckgrenze von 420 MPa (entspricht modernem B500 mit 500 MPa).'
  },
  {
    id: 't_hist_beton_umrechnung',
    difficulty: 'Schwer',
    title: 'Bauen im Bestand: Umrechnung historischer Beton B 225 nach DIN 1045 (1972)',
    question: 'Auf Altplänen aus dem Jahr 1978 wird für eine Deckenplatte die Festigkeitsklasse "B 225" angegeben. Rechnen Sie diese Festigkeitsklasse auf die heutige Zylinderdruckfestigkeit f_{ck} sowie f_{cd} um (ohne Bohrkernprüfung vs. mit Kernbohrung f_cm,cube = 28.5 N/mm²).',
    moduleHint: { id: 'historisch', name: 'Historische Kennwerte' },
    solution: 'Beim Bauen im Bestand erfolgt die Umrechnung nach der DAfStb-Richtlinie "Bauen im Bestand":\n\n1. **Ohne Bauteilprüfung (reine Aktenlage):**\n- B 225 entspricht $\\beta_{WN} = 22.5\\text{ N/mm}^2$ an $200\\text{ mm}$ Würfeln, normiert auf $150\\text{ mm}$ ca. $21.4\\text{ N/mm}^2$.\n- Charakteristischer Zylinderwert: $f_{ck,cyl} \\approx 0.8 \\times 21.4 \\approx 17.1\\text{ N/mm}^2$.\n- Abzug des pauschalen Sicherheitsabschlags für Aktenlage ($3.0\\text{ N/mm}^2$): $f_{ck,act} = 17.1 - 3.0 = 14.1\\text{ N/mm}^2$ (entspricht Klasse **C12/15**).\n- Bemessungswert: $f_{cd} = 0.85 \\times 12 / 1.5 = 6.8\\text{ N/mm}^2$.\n\n2. **Mit Bohrkernprüfung ($f_{cm,cube,150} = 28.5\\text{ N/mm}^2$):**\n- Erlaubt die sichere Einstufung in **C20/25** ($f_{ck} = 20\\text{ N/mm}^2$).\n- Neuer Bemessungswert: $f_{cd} = 0.85 \\times 20 / 1.5 = 11.33\\text{ N/mm}^2$ (+66 % Tragfähigkeit!).'
  },
  {
    id: 't_denkmal_kalk',
    difficulty: 'Mittel',
    title: 'Denkmalpflege: Mörtelwahl für historisches Natursteinmauerwerk',
    question: 'Bei der Sanierung einer denkmalgeschützten Bruchsteinmauer aus dem 15. Jahrhundert soll verwitterter Mörtel erneuert werden. Warum führt die Verwendung eines modernen, hochfesten Zementmörtels (M10) zu massiven Folgeschäden?',
    moduleHint: { id: 'denkmalpflege', name: 'Denkmalpflege' },
    solution: 'Zementmörtel ist viel zu starr (hoher E-Modul) und dampfdicht. Historische Bruchsteine oder Ziegel dehnen sich thermisch aus; der zu harte Mörtel erzeugt Spannungsspitzen, die die empfindlichen historischen Steine zerdrücken oder abplatzen lassen. Zudem staut der dichte Zement Feuchtigkeit und Mauersalze im weicheren Stein, wo Salzkristallisation den Naturstein zerstört. Lösung: Verwendung kompatibler, kapillaraktiver Kalkmörtel oder Natürlich Hydraulischer Kalke (NHL 2 oder NHL 3.5).'
  },
  {
    id: 't_hist_mauerwerk_fk',
    difficulty: 'Schwer',
    title: 'Bauen im Bestand: Tragfähigkeit historisches Ziegelmauerwerk (Reichsformat)',
    question: 'Eine Außenwand eines Altbaus (Baujahr 1905, Mauerstärke 24 cm, Reichsformat) mit Ziegeln SFK 12 und Kalkmörtel MG I (f_m = 0.5 N/mm²) soll auf Lasten überprüft werden. Berechnen Sie die Mauerwerksdruckfestigkeit f_k nach DIN EN 1996-3.',
    moduleHint: { id: 'mauerwerk', name: 'Mauerwerk: Tragfähigkeit' },
    solution: 'Berechnung nach Eurocode 6 (DIN EN 1996-3):\n$$f_k = K \\cdot f_b^{0.7} \\cdot f_m^{0.3}$$\nMit $K = 0.50$, $f_b = 12.0\\text{ N/mm}^2$ und Kalkmörtel $f_m = 0.5\\text{ N/mm}^2$:\n$$f_k = 0.50 \\times 12^{0.7} \\times 0.5^{0.3} = 0.50 \\times 5.698 \\times 0.812 \\approx **2.31\\text{ N/mm}^2$$\nMit $\\gamma_M = 1.5$ beträgt der Bemessungswert $f_d = 2.31 / 1.5 = 1.54\\text{ N/mm}^2$. Der weiche Kalkmörtel reduziert die Festigkeit drastisch, da er unter Druck quer ausweicht und Spaltzug im Ziegel induziert.'
  },
  {
    id: 't_preussische_kappe',
    difficulty: 'Mittel',
    title: 'Historische Bauweisen: Preußische Kappendecke & Auflagerkorrosion',
    question: 'Erläutern Sie das Tragverhalten einer preußischen Kappendecke (Segmentbogengewölbe zwischen gewalzten Stahl- oder Schmiedeeisenträgern) und nennen Sie die typische Schadensursache an den Auflagern.',
    moduleHint: { id: 'historische_bauweisen', name: 'Historische Bauweisen' },
    solution: '1. **Tragverhalten:**\n   Das gemauerte Ziegelsegmentgewölbe leitet vertikale Lasten über Gewölbedrucklinien als geneigte Druckkräfte in die Trägerflansche ab. Dies erzeugt neben Vertikalkräften erhebliche **horizontale Horizontalschubkräfte (Gewölbeschub)**, die durch Zugbänder (Rundeisen mit Spannschlössern) oder massive Außenwände aufgenommen werden müssen.\n2. **Typische Schäden:**\n   An den kühlen Außenwandauflagern kondensiert feuchte Keller- oder Raumluft. Die im Mauerwerk aufliegenden Trägerenden rosten stark (Blattrostbildung). Die Rostsprengung drückt das Mauerwerk auseinander und schwächt das Auflager, bis die Trägerauflager abbrechen können.'
  },
  {
    id: 't_scan_to_bim',
    difficulty: 'Mittel',
    title: 'Bauwerkserfassung: 3D-Laserscanning (TLS) & Scan-to-BIM',
    question: 'Welche Herausforderungen treten bei der Überführung einer terrestrischen Laserscan-Punktwolke (TLS) eines historischen Bestandsgebäudes in ein parametrisches BIM-Modell (Scan-to-BIM) auf?',
    moduleHint: { id: 'bauwerkserfassung', name: 'Bauwerkserfassung' },
    solution: '1. **Nicht-rechtwinklige und verzogene Geometrien:** Historische Bauteile weisen Durchbiegungen, Schiefstellungen und ungleichmäßige Wanddicken auf. Standard-BIM-Bibliotheken basieren auf idealisierten, planen und rechtwinkligen Bauteilen.\n2. **Verdeckte Bauteilschichten:** Der Scanner erfasst nur die sichtbare Oberfläche (z.B. Putz, Verkleidung). Verborgene Konstruktionen (Balkenlagen, Hohlräume, Eisenprofile) müssen durch gezielte Bauteilöffnungen oder ZfP ergänzt werden.\n3. **Datenvolumen & LOD-Konflikt:** Gigantische Punktwolken (Gigabyte bis Terabyte) erfordern Modellierungsentscheidungen: Detaillierungsgrad (Level of Detail, LOD 200 bis LOD 400) muss zwischen Realitätsnähe und Berechnungsaufwand abgewogen werden.'
  },
  {
    id: 't_modernisierung_calciumsilikat',
    difficulty: 'Mittel',
    title: 'Modernisierung: Innendämmung mit kapillaraktiven Calciumsilikatplatten',
    question: 'Warum eignen sich Calciumsilikatplatten hervorragend für die denkmalgerechte Innendämmung von Fachwerkhäusern ohne Dampfbremse?',
    moduleHint: { id: 'modernisierung', name: 'Modernisierung' },
    solution: 'Calciumsilikat ist ein hochporöser, mineralischer Dämmstoff mit ausgeprägter **Kapillaraktivität** und hohem pH-Wert (~ 10–11). Kondensiert im Winter Feuchtigkeit an der Grenzschicht zur kalten Bestandswand, saugen die feinen Kapillaren der Platte das flüssige Wasser schwammartig auf und leiten es kapillar zurück an die raumseitige Oberfläche, wo es abtrocknet. Ein Dampfsperren-Abriss wird vermieden, und der hohe pH-Wert verhindert zuverlässig Schimmelpilzbildung.'
  }
];
