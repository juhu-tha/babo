/** Versuchs-Handout (AP 6.4): Daten für src/modules/laborhandouts/DruckfestigkeitWuerfel.tsx – reine Werte, geprüft in tests/handoutExport.test.ts */
import type { VersuchsHandoutDaten } from '@/src/components/handout/handoutTypen';
import { FESTIGKEITSKLASSEN } from '@/src/calc/laborversuche';

export const DRUCK_HANDOUT: VersuchsHandoutDaten = {
  id: 'labor_druckfestigkeit',
  titel: 'Druckfestigkeit von Betonwürfeln',
  normen: ['DIN EN 12390-2', 'DIN EN 12390-3', 'DIN EN 206 / DIN 1045-2 (Klassen)'],
  dauer: 'etwa 60 min für 3 bis 6 Würfel',
  gruppe: '3 Würfel je Mischung und Prüfalter, 2 bis 4 Studierende',
  ziel: [
    'Würfel nach DIN EN 12390-2 herstellen, lagern und für die Prüfung vorbereiten (Maße, Masse, Rohdichte),',
    'die Druckfestigkeit nach DIN EN 12390-3 mit konstanter Belastungsgeschwindigkeit bestimmen und die Bruchbilder beurteilen,',
    'Würfel aus Trockenlagerung auf Wasserlagerung umrechnen,',
    'das Ergebnis einer Druckfestigkeitsklasse zuordnen – als Lehrvereinfachung der Konformitätskriterien nach DIN EN 206 / DIN 1045-2.',
  ],
  geraete: [
    { name: 'Druckprüfmaschine nach DIN EN 12390-4', hinweis: 'Kraftbereich z. B. 3000 kN, kraft- oder spannungsgeregelt', laborAnpassen: true },
    { name: 'Würfelformen 150 mm', hinweis: 'bei kleinem Größtkorn auch 100 mm', laborAnpassen: true },
    { name: 'Messschieber bzw. Würfelmessgerät (0,1 mm), Waage (1 g), Winkel' },
    { name: 'Rütteltisch oder Innenrüttler, Wasserbecken oder Klimaraum für die Lagerung', laborAnpassen: true },
  ],
  material: [
    { name: 'Frischbeton aus dem Labormischer bzw. Probenahme nach DIN EN 12350-1' },
    { name: 'Würfel in gleichem Alter (z. B. 7 und 28 Tage)', laborAnpassen: true },
    { name: 'Trennmittel für die Formen, Kennzeichnungsstift' },
  ],
  sicherheit: [
    { gefahr: 'Splitter und Bruchstücke beim Versagen', massnahme: 'Schutzgitter bzw. Schutztür der Prüfmaschine geschlossen halten, Schutzbrille, nicht in den Prüfraum greifen.' },
    { gefahr: 'Quetschgefahr zwischen den Druckplatten', massnahme: 'Probekörper nur bei stehender Maschine einlegen und ausrichten, Handsteuerung nur durch eingewiesene Person.' },
    { gefahr: 'Gewicht der Würfel (etwa 8 kg)', massnahme: 'Sicherheitsschuhe, mit beiden Händen tragen.' },
    { gefahr: 'Zementleim beim Herstellen', massnahme: 'Schutzbrille und flüssigkeitsdichte Handschuhe.' },
  ],
  ablauf: [
    { titel: 'Herstellen und Lagern', text: 'Formen in Lagen füllen und verdichten, abziehen, kennzeichnen. Nach (24 ± 4) h ausschalen. Lagerung nach DIN EN 12390-2 im Wasser (Referenz) oder nach dem nationalen Anhang 7 Tage im Wasser und danach an der Luft (Trockenlagerung).', laborAnpassen: true },
    { titel: 'Vorbereiten', text: 'Würfel aus der Lagerung nehmen, Oberfläche abwischen. Maße der beiden späteren Druckflächen und die Höhe messen, Masse bestimmen. Würfel so drehen, dass die Schalflächen an den Druckplatten liegen (nicht die abgezogene Oberseite).' },
    { titel: 'Einlegen und zentrieren', text: 'Druckplatten säubern, Würfel mittig ausrichten. Keine Zwischenlagen verwenden.' },
    { titel: 'Belasten', text: 'Last stoßfrei mit konstanter Spannungsrate von (0,6 ± 0,2) MPa/s bis zum Bruch steigern; das entspricht bei 150-mm-Würfeln etwa 13,5 kN/s. Höchstkraft F auf 0,1 kN ablesen.', dauer: 'etwa 1 min je Würfel' },
    { titel: 'Bruchbild beurteilen', text: 'Regelmäßiges Bruchbild: gleichmäßige Abplatzungen an allen vier Seiten, zwei aufeinanderstehende Kegelstümpfe. Unregelmäßige Bruchbilder (Zugrisse, einseitige Schäden) notieren – sie deuten auf Maßabweichungen oder ungleichmäßige Lasteinleitung.' },
    { titel: 'Auswerten', text: 'Druckfestigkeit je Würfel auf 0,1 MPa, Mittelwert und kleinsten Einzelwert bilden, bei Trockenlagerung umrechnen und mit der Zielklasse vergleichen.' },
  ],
  protokoll: {
    titel: 'Messprotokoll Würfeldruckfestigkeit',
    hinweis: 'Je Zeile ein Würfel. a und b sind die Kantenlängen der Druckfläche, h die Höhe zwischen den Druckflächen.',
    kopf: [
      { id: 'beton', label: 'Betonsorte / Mischung', typ: 'text' },
      { id: 'alter', label: 'Prüfalter', einheit: 'd', typ: 'zahl', standard: '28' },
      { id: 'lagerung', label: 'Lagerung', typ: 'auswahl', optionen: [{ wert: 'wasser', label: 'Wasserlagerung (Referenz)' }, { wert: 'trocken', label: 'Trockenlagerung (nationaler Anhang)' }], standard: 'wasser' },
      { id: 'ziel', label: 'Zielklasse', typ: 'auswahl', optionen: FESTIGKEITSKLASSEN.map(k => ({ wert: k.name, label: k.name })), standard: 'C25/30' },
      { id: 'maschine', label: 'Prüfmaschine / Belastungsrate', typ: 'text', laborAnpassen: true },
    ],
    spalten: [
      { id: 'nr', label: 'Würfel', typ: 'text' },
      { id: 'a', label: 'Kante a', einheit: 'mm', typ: 'zahl' },
      { id: 'b', label: 'Kante b', einheit: 'mm', typ: 'zahl' },
      { id: 'h', label: 'Höhe h', einheit: 'mm', typ: 'zahl' },
      { id: 'm', label: 'Masse m', einheit: 'kg', typ: 'zahl' },
      { id: 'F', label: 'Höchstkraft F', einheit: 'kN', typ: 'zahl' },
      { id: 'bruch', label: 'Bruchbild', typ: 'text' },
    ],
    zeilen: 3,
    beispiel: {
      kopf: { beton: 'Lehrbeispiel C30/37, CEM II/A-S 42,5 N', alter: '28', lagerung: 'wasser', ziel: 'C30/37', maschine: '3000 kN, 13,5 kN/s' },
      zeilen: [
        { nr: 'W1', a: '150,2', b: '149,8', h: '150,1', m: '8,120', F: '955,0', bruch: 'regelmäßig' },
        { nr: 'W2', a: '149,9', b: '150,1', h: '150,0', m: '8,085', F: '980,0', bruch: 'regelmäßig' },
        { nr: 'W3', a: '150,0', b: '150,3', h: '149,8', m: '8,150', F: '935,0', bruch: 'regelmäßig' },
      ],
    },
  },
  fehlerquellen: [
    { quelle: 'abgezogene Oberseite an der Druckplatte', wirkung: 'unebene Lasteinleitung, Festigkeit zu niedrig', abhilfe: 'Würfel um 90° drehen, Schalflächen belasten' },
    { quelle: 'Belastungsgeschwindigkeit zu hoch', wirkung: 'Festigkeit zu hoch (Beton reagiert auf schnelle Belastung fester)', abhilfe: 'Rate einstellen und im Protokoll angeben' },
    { quelle: 'Maße nicht gemessen, Nennmaß verwendet', wirkung: 'systematischer Fehler von bis zu etwa 1 bis 2 %', abhilfe: 'Druckflächen messen; Formen regelmäßig prüfen' },
    { quelle: 'Würfel aus Trockenlagerung ohne Umrechnung bewertet', wirkung: 'Klasse wird zu hoch eingeschätzt (trockene Würfel sind fester)', abhilfe: 'Lagerungsart dokumentieren und umrechnen' },
    { quelle: 'schlechte Verdichtung, Kiesnester', wirkung: 'niedrige Einzelwerte, große Streuung', abhilfe: 'lagenweise verdichten, Rohdichte als Kontrolle' },
    { quelle: 'Würfel vor der Prüfung ausgetrocknet (bei Wasserlagerung)', wirkung: 'Festigkeit zu hoch, nicht vergleichbar', abhilfe: 'unmittelbar nach der Entnahme prüfen, feucht halten' },
  ],
  fragen: [
    'Warum ergibt ein Würfel eine höhere Druckfestigkeit als ein Zylinder aus demselben Beton?',
    'Welche Druckfestigkeitsklasse erreicht Ihr Beton nach der vereinfachten Bewertung? Wäre die Zielklasse eingehalten?',
    'Wie verändert die Umrechnung von Trocken- auf Wasserlagerung das Ergebnis, und warum sind trockene Würfel fester?',
    'Warum reicht der Mittelwert allein nicht, und was sagt der kleinste Einzelwert aus?',
    'Worin unterscheidet sich die vereinfachte Bewertung im Handout von der Konformitätskontrolle eines Transportbetonwerks?',
    'Wie würden Sie ein unregelmäßiges Bruchbild im Prüfbericht behandeln?',
  ],
};
