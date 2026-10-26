/** Versuchs-Handout (AP 6.4): Daten für src/modules/laborhandouts/Moertelprismen.tsx – reine Werte, geprüft in tests/handoutExport.test.ts */
import type { VersuchsHandoutDaten } from '@/src/components/handout/handoutTypen';

export const MOERTEL_HANDOUT: VersuchsHandoutDaten = {
  id: 'labor_moertelprismen',
  titel: 'Biegezug- und Druckfestigkeit an Mörtelprismen nach DIN EN 196-1',
  normen: ['DIN EN 196-1', 'DIN EN 197-1 (Festigkeitsklassen)'],
  dauer: 'Herstellung 60 min, Prüfung 45 min je Prüfalter',
  gruppe: '3 Prismen je Prüfalter (eine Dreifachform), 2 bis 4 Studierende',
  ziel: [
    'Normmörtel aus Zement, CEN-Normsand und Wasser im Verhältnis 1 : 3 : 0,5 nach DIN EN 196-1 herstellen und Prismen 40 mm × 40 mm × 160 mm formen,',
    'die Biegezugfestigkeit im Dreipunkt-Biegeversuch und die Druckfestigkeit an den Prismenhälften bestimmen,',
    'die Druckfestigkeit mit der ±10-%-Regel der Norm auswerten,',
    'das Ergebnis nach 28 Tagen einer Zementfestigkeitsklasse nach DIN EN 197-1 zuordnen.',
  ],
  geraete: [
    { name: 'Mörtelmischer nach DIN EN 196-1 mit Programmablauf', laborAnpassen: true },
    { name: 'Dreifachform 40 mm × 40 mm × 160 mm mit Aufsatzrahmen, Verdichtungsgerät (Schocktisch, 60 Schläge)', hinweis: 'alternativ Rütteltisch nach Norm', laborAnpassen: true },
    { name: 'Biegevorrichtung (Stützweite 100 mm) und Druckvorrichtung (Fläche 40 mm × 40 mm) in der Prüfmaschine', laborAnpassen: true },
    { name: 'Waage (1 g), Messzylinder bzw. Bürette, Feuchtkasten und Wasserlagerung (20 ± 1) °C' },
  ],
  material: [
    { name: 'Zement, 450 g ± 2 g je Mischung' },
    { name: 'CEN-Normsand, 1350 g ± 5 g (ein Beutel)' },
    { name: 'Wasser, 225 g ± 1 g (w/z = 0,50)' },
    { name: 'Formöl, Kennzeichnung, Abdeckplatte' },
  ],
  sicherheit: [
    { gefahr: 'Zement und Mörtel (stark alkalisch, Gefahr ernster Augenschäden, Hautreizung)', massnahme: 'Schutzbrille, flüssigkeitsdichte Handschuhe, Kittel; staubarm einfüllen.' },
    { gefahr: 'Quarzhaltiger Staub beim Einfüllen des Normsands', massnahme: 'langsam einfüllen, Absaugung bzw. Staubschutzmaske nach Betriebsanweisung.' },
    { gefahr: 'Rotierender Mischer, Schocktisch', massnahme: 'nicht in laufende Geräte greifen, Hände weg vom Hubnocken.' },
    { gefahr: 'Bruchstücke bei der Prüfung', massnahme: 'Schutzeinrichtung der Prüfmaschine schließen, Schutzbrille.' },
  ],
  ablauf: [
    { titel: 'Mischen', text: 'Wasser und Zement in den Trog geben, nach Programm mischen: 30 s langsam, Sand während der nächsten 30 s zugeben, 30 s schnell, 90 s Pause (Rand abstreifen), 60 s schnell.', dauer: '4 min' },
    { titel: 'Formen und verdichten', text: 'Form in zwei Lagen füllen, jede Lage mit 60 Schlägen verdichten, überstehenden Mörtel mit dem Lineal sägend abziehen, kennzeichnen.', dauer: '10 min' },
    { titel: 'Lagern', text: 'Formen abgedeckt im Feuchtkasten lagern, nach 20 bis 24 h ausschalen, Prismen bis zur Prüfung im Wasser bei (20 ± 1) °C lagern.', laborAnpassen: true },
    { titel: 'Biegezugprüfung', text: 'Prisma unmittelbar vor der Prüfung abtrocknen, mit einer Seitenfläche auf die Auflager legen. Last mittig mit (50 ± 10) N/s bis zum Bruch steigern, Bruchkraft F_f notieren.', dauer: '1 min je Prisma' },
    { titel: 'Druckprüfung', text: 'Beide Hälften seitlich zwischen die Druckplatten (40 mm × 40 mm) legen, Last mit (2400 ± 200) N/s bis zum Bruch steigern, Bruchkräfte F_c notieren.', dauer: '1 min je Hälfte' },
    { titel: 'Auswerten', text: 'Biegezugfestigkeit als Mittel der drei Werte; Druckfestigkeit als Mittel der sechs Werte mit der ±10-%-Regel, jeweils auf 0,1 MPa.' },
  ],
  protokoll: {
    titel: 'Messprotokoll Mörtelprismen',
    hinweis: 'Je Zeile ein Prisma mit seiner Biegezugbruchkraft und den Druckbruchkräften der beiden Hälften.',
    kopf: [
      { id: 'zement', label: 'Zement (Art, Lieferung)', typ: 'text' },
      { id: 'alter', label: 'Prüfalter', einheit: 'd', typ: 'zahl', standard: '28' },
      { id: 'herstellung', label: 'Herstellung (Datum, Uhrzeit)', typ: 'text' },
      { id: 'temperatur', label: 'Raumtemperatur', einheit: '°C', typ: 'zahl', standard: '20' },
    ],
    spalten: [
      { id: 'prisma', label: 'Prisma', typ: 'text' },
      { id: 'Ff', label: 'Bruchkraft Biegezug F_f', einheit: 'kN', typ: 'zahl' },
      { id: 'Fc1', label: 'Bruchkraft Druck Hälfte 1', einheit: 'kN', typ: 'zahl' },
      { id: 'Fc2', label: 'Bruchkraft Druck Hälfte 2', einheit: 'kN', typ: 'zahl' },
      { id: 'bemerkung', label: 'Bemerkung', typ: 'text' },
    ],
    zeilen: 3,
    beispiel: {
      kopf: { zement: 'Lehrbeispiel CEM I 42,5 R', alter: '28', herstellung: 'Lehrbeispiel', temperatur: '20' },
      zeilen: [
        { prisma: 'A', Ff: '2,90', Fc1: '79,2', Fc2: '81,0', bemerkung: '' },
        { prisma: 'B', Ff: '3,10', Fc1: '80,1', Fc2: '78,5', bemerkung: '' },
        { prisma: 'C', Ff: '3,00', Fc1: '82,3', Fc2: '79,6', bemerkung: '' },
      ],
    },
  },
  fehlerquellen: [
    { quelle: 'Wasser- oder Zementmenge falsch abgewogen', wirkung: 'w/z ≠ 0,50, Festigkeit nicht vergleichbar', abhilfe: 'Einwaage auf 1 g bzw. 0,1 g, Mischprogramm einhalten' },
    { quelle: 'Prisma vor der Prüfung angetrocknet', wirkung: 'höhere, nicht normgerechte Festigkeiten', abhilfe: 'erst unmittelbar vor der Prüfung aus dem Wasser nehmen' },
    { quelle: 'Prisma mit der abgezogenen Fläche nach oben gedrückt', wirkung: 'unebene Lasteinleitung, Werte zu niedrig', abhilfe: 'Prisma auf eine Seitenfläche (Schalfläche) drehen' },
    { quelle: 'Hälfte nicht mittig unter der Druckplatte', wirkung: 'Kantenbruch, Werte zu niedrig und streuend', abhilfe: 'Anschläge der Druckvorrichtung nutzen' },
    { quelle: 'Belastungsgeschwindigkeit nicht eingehalten', wirkung: 'zu schnelle Belastung ergibt höhere Werte', abhilfe: 'Rate prüfen und protokollieren' },
    { quelle: 'Ausreißer einfach weggelassen', wirkung: 'geschönte Ergebnisse', abhilfe: 'nur nach der ±10-%-Regel verwerfen und dokumentieren' },
  ],
  fragen: [
    'Warum prüft die Norm Zement an einem Normmörtel und nicht an Zementstein oder Beton?',
    'Welche Festigkeitsklasse nach DIN EN 197-1 erreicht Ihr Zement nach 28 Tagen? Liegt der Wert innerhalb der Ober- und Untergrenze?',
    'Leiten Sie die Formel R_f = 1,5 · F_f · l / b³ aus der Biegespannung eines Einfeldträgers mit Einzellast her.',
    'Warum ist die Biegezugfestigkeit des Mörtels deutlich kleiner als seine Druckfestigkeit, und welche Größenordnung hat das Verhältnis?',
    'Was bedeutet es für die Auswertung, wenn ein Druckwert um mehr als 10 % vom Mittel abweicht?',
    'Wie unterscheidet sich die Anfangsfestigkeit von Zementen der Klassen N und R, und warum?',
  ],
};
