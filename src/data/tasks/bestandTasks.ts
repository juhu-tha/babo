import { Task } from '../aufgabenData';

export const bestandTasks: Task[] = [
  {
    id: 't21',
    difficulty: 'Mittel',
    title: 'ZfP: Rückprallhammer nach DIN EN 12504-2',
    question: 'Bei der Prüfung einer Bestandsstütze mit dem Schmidt-Rückprallhammer messen Sie einen mittleren Rückprallwert von R = 38. Welche ungefähre Würfeldruckfestigkeit können Sie erwarten?',
    moduleHint: { id: 'zfp', name: 'Prüfverfahren & ZfP' },
    solution: 'Ein Rückprallwert von R = 38 entspricht bei waagerechter Prüfung und normalem Alter des Betons nach einer typischen Herstellerkurve einer Würfeldruckfestigkeit von grob 35–40 N/mm² (Größenordnung C25/30 bis C30/37). Der Wert ist nur ein Schätzwert, da die Umrechnungskurven geräte- und betonabhängig sind. Bei Bestandsbeton muss jedoch berücksichtigt werden, dass eine carbonatisierte Randzone die Oberflächenhärte künstlich erhöht. Für statisch verwertbare Gutachten ist eine Kalibrierung an Bohrkernen nach DIN EN 13791:2020-02 + A20:2022-04 erforderlich; die Prüfung selbst erfolgt nach DIN EN 12504-2:2021-10.'
  },
  {
    id: 't22',
    difficulty: 'Leicht',
    title: 'Historische Kennwerte: Umrechnung historischer Klassen',
    question: 'In alten Bestandsplänen von 1975 finden Sie die Angabe "Beton B 25" und "Betonstahl III". Welchen heutigen Klassen entsprechen diese Angaben näherungsweise, und ist der Stahl einem B500 gleichzusetzen?',
    moduleHint: { id: 'historisch', name: 'Historische Kennwerte' },
    solution: '"B 25" nach DIN 1045:1978 (1972: „Bn 250“) bezeichnet eine Nennfestigkeit β_WN = 25 N/mm² am 200-mm-Würfel; die Zuordnung erfolgt heute näherungsweise zu C16/20 bis C20/25, je nach Quelle und Ansatz des Lagerungsfaktors (Zuordnungstabellen z. B. im DBV-Merkblatt „Bauen im Bestand – Beton und Betonstahl“, Fassung März 2016, oder bei Schnell/Loch, Der Prüfingenieur 04/2009). "Betonstahl III" ist BSt 420 S bzw. BSt 420/500 mit einer Streckgrenze von 420 N/mm² und Zugfestigkeit 500 N/mm². Er ist **nicht** mit B500 (f_yk = 500 N/mm²) gleichzusetzen: In der Nachrechnung ist f_yk = 420 N/mm² anzusetzen, Duktilität und Schweißeignung sind gesondert zu bewerten.'
  },
  {
    id: 't_hist_beton_umrechnung',
    difficulty: 'Schwer',
    title: 'Bauen im Bestand: Umrechnung historischer Beton B 225 (Bezeichnung nach DIN 1045:1959)',
    question: 'Auf Altplänen aus dem Jahr 1978 wird für eine Deckenplatte die Festigkeitsklasse "B 225" angegeben. Rechnen Sie diese Festigkeitsklasse auf die heutige Zylinderdruckfestigkeit f_{ck} sowie f_{cd} um (ohne Bauteilprüfung vs. mit Bohrkernprüfung: 8 Kerne, auf Würfel umgerechneter Mittelwert 28,5 N/mm², Standardabweichung 2,0 N/mm²).',
    moduleHint: { id: 'historisch', name: 'Historische Kennwerte' },
    solution: 'Die Zuordnung alter Betonbezeichnungen erfolgt mit Zuordnungstabellen (z. B. DBV-Merkblatt „Bauen im Bestand – Beton und Betonstahl“, Fassung März 2016; Schnell/Loch, Der Prüfingenieur 04/2009) oder mit Bauteilprüfung nach DIN EN 13791.\n\n1. **Ohne Bauteilprüfung (reine Aktenlage):**\n- B 225 bedeutet $\\beta_W \\ge 225\\text{ kp/cm}^2 \\approx 22{,}5\\text{ N/mm}^2$ am 200-mm-Würfel (Mindestwert der Serienfestigkeit, kein 5-%-Quantil).\n- Der kleinere 150-mm-Würfel liefert höhere Werte: $f_{c,cube150} \\approx 22{,}5 / 0{,}95 \\approx 23{,}7\\text{ N/mm}^2$; Zylinder grob $0{,}8 \\times 23{,}7 \\approx 19\\text{ N/mm}^2$.\n- Wegen unbekannter Streuung und Bauausführung wird auf Aktenlage konservativ **C12/15** angesetzt: $f_{cd} = 0{,}85 \\times 12 / 1{,}5 = 6{,}8\\text{ N/mm}^2$.\n\n2. **Mit Bohrkernprüfung (n = 8, Mittel 28,5 N/mm², s = 2,0 N/mm²):**\n- Charakteristischer Würfelwert: $f_{ck,is,cube} = 28{,}5 - 1{,}48 \\times 2{,}0 = 25{,}5\\text{ N/mm}^2 \\ge 25$ ⇒ Einstufung **C20/25** (Mindeststandardabweichung und Faktoren nach DIN EN 13791 am Normtext prüfen).\n- Neuer Bemessungswert: $f_{cd} = 0{,}85 \\times 20 / 1{,}5 = 11{,}3\\text{ N/mm}^2$ (rund +66 % gegenüber der Aktenlage).'
  },
  {
    id: 't_denkmal_kalk',
    difficulty: 'Mittel',
    title: 'Denkmalpflege: Mörtelwahl für historisches Natursteinmauerwerk',
    question: 'Bei der Sanierung einer denkmalgeschützten Bruchsteinmauer aus dem 15. Jahrhundert soll verwitterter Mörtel erneuert werden. Warum führt die Verwendung eines modernen, hochfesten Zementmörtels (M10) zu massiven Folgeschäden?',
    moduleHint: { id: 'denkmalpflege', name: 'Denkmalpflege' },
    solution: 'Zementmörtel ist viel zu starr (hoher E-Modul) und dampfdicht. Historische Bruchsteine oder Ziegel dehnen sich thermisch aus; der zu harte Mörtel erzeugt Spannungsspitzen, die die empfindlichen historischen Steine zerdrücken oder abplatzen lassen. Zudem staut der dichte Zement Feuchtigkeit und Mauersalze im weicheren Stein, wo Salzkristallisation den Naturstein zerstört. Lösung: Verwendung kompatibler, kapillaraktiver Kalkmörtel oder Natürlich Hydraulischer Kalke (NHL 2 oder NHL 3,5).'
  },
  {
    id: 't_hist_mauerwerk_fk',
    difficulty: 'Schwer',
    title: 'Bauen im Bestand: Tragfähigkeit historisches Ziegelmauerwerk (Reichsformat)',
    question: 'Eine Außenwand eines Altbaus (Baujahr 1905, Mauerstärke 24 cm, Reichsformat) mit Ziegeln SFK 12 und Kalkmörtel MG I (f_m = 0,5 N/mm²) soll auf Lasten überprüft werden. Berechnen Sie die charakteristische Mauerwerksdruckfestigkeit f_k mit der Gleichung (3.1) aus DIN EN 1996-1-1 (Empfehlungswert K = 0,50) und den Bemessungswert f_d.',
    moduleHint: { id: 'mauerwerk', name: 'Mauerwerk: Tragfähigkeit' },
    solution: 'Berechnung nach Eurocode 6 (DIN EN 1996-1-1, Gl. 3.1; der deutsche NA verwendet stattdessen Tabellenwerte für f_k):\n$$f_k = K \\cdot f_b^{0{,}7} \\cdot f_m^{0{,}3}$$\nMit $K = 0{,}50$, $f_b = 12{,}0\\text{ N/mm}^2$ und Kalkmörtel $f_m = 0{,}5\\text{ N/mm}^2$:\n$$f_k = 0{,}50 \\times 12^{0{,}7} \\times 0{,}5^{0{,}3} = 0{,}50 \\times 5{,}69 \\times 0{,}812 \\approx 2{,}31\\text{ N/mm}^2$$\nMit $\\zeta = 0{,}85$ (Dauerstandseinfluss nach NA) und $\\gamma_M = 1{,}5$ beträgt der Bemessungswert $f_d = 0{,}85 \\times 2{,}31 / 1{,}5 = 1{,}31\\text{ N/mm}^2$. Der weiche Kalkmörtel reduziert die Festigkeit drastisch, da er unter Druck quer ausweicht und Spaltzug im Ziegel induziert.'
  },
  {
    id: 't_preussische_kappe',
    difficulty: 'Mittel',
    title: 'Historische Bauweisen: Preußische Kappendecke & Auflagerkorrosion',
    question: 'Erläutern Sie das Tragverhalten einer preußischen Kappendecke (Segmentbogengewölbe zwischen gewalzten Stahl- oder Schmiedeeisenträgern) und nennen Sie die typische Schadensursache an den Auflagern.',
    moduleHint: { id: 'historische_bauweisen', name: 'Historische Bauweisen' },
    solution: '1. **Tragverhalten:**\n   Das gemauerte Ziegelsegmentgewölbe leitet vertikale Lasten über Gewölbedrucklinien als geneigte Druckkräfte in die Trägerflansche ab. Dies erzeugt neben Vertikalkräften erhebliche **Horizontalschubkräfte (Gewölbeschub)**, die durch Zugbänder (Rundeisen mit Spannschlössern) oder massive Außenwände aufgenommen werden müssen.\n2. **Typische Schäden:**\n   An den Außenwandauflagern wirken dauerhafte Mauerwerksfeuchte (Schlagregen, aufsteigende Feuchte) und Tauwasser aus feuchter Keller- oder Raumluft. Die im Mauerwerk aufliegenden Trägerenden rosten stark (Blattrostbildung). Die Rostsprengung drückt das Mauerwerk auseinander und schwächt das Auflager, bis die Trägerauflager abbrechen können.'
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
    question: 'Warum eignen sich Calciumsilikatplatten für eine Innendämmung von Bestandswänden ohne Dampfbremse, und welcher Nachweis ist dafür erforderlich?',
    moduleHint: { id: 'modernisierung', name: 'Modernisierung' },
    solution: 'Calciumsilikat ist ein hochporöser, mineralischer Dämmstoff mit ausgeprägter **Kapillaraktivität** und hohem pH-Wert (~ 10–11). Kondensiert im Winter Feuchtigkeit an der Grenzschicht zur kalten Bestandswand, saugen die feinen Kapillaren der Platte das flüssige Wasser schwammartig auf und leiten es kapillar zurück an die raumseitige Oberfläche, wo es abtrocknet. So kann bei nachgewiesener Eignung auf eine Dampfbremse verzichtet werden; der hohe pH-Wert hemmt zusätzlich Schimmelpilzwachstum. Erforderlich ist ein hygrothermischer Nachweis (DIN 4108-3:2024-03 bzw. WTA-Merkblatt 6-5); bei Fachwerk sind die Gefach-Holz-Anschlüsse und die Schlagregenbelastung besonders zu prüfen (WTA-Merkblatt 8-5-18/D).'
  }
];
