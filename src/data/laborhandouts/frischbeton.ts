/** Versuchs-Handout (AP 6.4): Daten für src/modules/laborhandouts/FrischbetonHandout.tsx – reine Werte, geprüft in tests/handoutExport.test.ts */
import type { VersuchsHandoutDaten } from '@/src/components/handout/handoutTypen';

export const FRISCHBETON_HANDOUT: VersuchsHandoutDaten = {
  id: 'labor_frischbeton',
  titel: 'Frischbetonprüfungen: Ausbreitmaß, Frischbetonrohdichte und Luftgehalt',
  normen: ['DIN EN 12350-1', 'DIN EN 12350-5', 'DIN EN 12350-6', 'DIN EN 12350-7'],
  dauer: 'etwa 90 min je Mischung',
  gruppe: '4 bis 6 Studierende je Mischung (Rollen: Probenahme, Ausbreitversuch, Wägung, Luftgehalt)',
  ziel: [
    'eine repräsentative Frischbetonprobe nach DIN EN 12350-1 entnehmen,',
    'die Konsistenz mit dem Ausbreitversuch nach DIN EN 12350-5 bestimmen und einer Ausbreitmaßklasse F1 bis F6 zuordnen,',
    'die Frischbetonrohdichte nach DIN EN 12350-6 und den Luftgehalt mit dem Druckausgleichsverfahren nach DIN EN 12350-7 bestimmen,',
    'die Ergebnisse mit dem Mischungsentwurf vergleichen (Soll-Rohdichte, Luftgehalt aus der Rohdichte).',
  ],
  geraete: [
    { name: 'Ausbreittisch 700 mm × 700 mm mit Hubbegrenzung (40 mm), Ausbreitform (Kegelstumpf), Stampfer, Maßstab', laborAnpassen: true },
    { name: 'Luftgehaltsprüfer (Druckausgleichsverfahren)', hinweis: 'Behälter z. B. 8 L, vor dem Versuch kalibriert', laborAnpassen: true },
    { name: 'Behälter für die Rohdichte', hinweis: 'Volumen bekannt (kalibriert), Mindestmaß das 4-Fache des Größtkorns; oft der Topf des Luftgehaltsprüfers', laborAnpassen: true },
    { name: 'Waage (Genauigkeit 0,1 % der Messmenge), Rütteltisch oder Innenrüttler, Abziehlineal, Kelle, Schaufel, Gummihammer' },
    { name: 'Thermometer, Stoppuhr, feuchte Tücher' },
  ],
  material: [
    { name: 'Frischbeton aus dem Labormischer', hinweis: 'Menge nach Mischungsentwurf, mindestens das 1,5-Fache des Prüfbedarfs', laborAnpassen: true },
    { name: 'Mischungsentwurf mit Soll-Rohdichte (luftporenfrei gerechnet) und Größtkorn' },
    { name: 'Wasser zum Befeuchten der Geräte, Trennmittel nur wo vorgesehen' },
  ],
  sicherheit: [
    { gefahr: 'Zementleim (stark alkalisch, Verätzung von Haut und Augen)', massnahme: 'Schutzbrille, flüssigkeitsdichte Handschuhe mit Stulpe, lange Kleidung; Spritzer sofort mit Wasser abspülen.' },
    { gefahr: 'Quetschen am Ausbreittisch und Rütteltisch', massnahme: 'Finger von der Anschlagkante fernhalten, nur eine Person bedient den Tisch.' },
    { gefahr: 'Heben schwerer Behälter (bis etwa 25 kg)', massnahme: 'zu zweit tragen, rückenschonend heben.' },
    { gefahr: 'Druckluft am Luftgehaltsprüfer', massnahme: 'Deckel vollständig verriegeln, Druck vor dem Öffnen ablassen.' },
    { gefahr: 'Lärm beim Verdichten', massnahme: 'Gehörschutz bei Rütteltisch und Innenrüttler.' },
  ],
  ablauf: [
    { titel: 'Probe nehmen', text: 'Probe unmittelbar nach dem Mischen nach DIN EN 12350-1 entnehmen und kurz durchmischen; Uhrzeit und Betontemperatur notieren. Alle Prüfungen zügig nacheinander ausführen.' },
    { titel: 'Ausbreitversuch', text: 'Tisch und Form befeuchten, Form in zwei Lagen füllen, jede Lage mit 10 Stößen leicht verdichten, abziehen. Form nach 30 s senkrecht abziehen, Tischplatte 15-mal anheben und fallen lassen. Größte Ausdehnung parallel zu den Tischkanten messen: d₁ und d₂ auf 10 mm.', dauer: '5 min' },
    { titel: 'Beurteilen', text: 'Kuchen auf Entmischung (Wasser- oder Leimrand, Grobkorn in der Mitte) begutachten und im Protokoll vermerken.' },
    { titel: 'Rohdichte: Behälter füllen', text: 'Leeren Behälter wiegen (m₁). In Lagen füllen und vollständig verdichten (Rütteln, bis keine großen Luftblasen mehr aufsteigen), Oberfläche bündig abziehen, außen säubern, wiegen (m₂).', dauer: '10 min' },
    { titel: 'Luftgehalt', text: 'Mit dem gefüllten Behälter weiterarbeiten: Deckel aufsetzen, Ventile öffnen, Wasser einfüllen, bis luftblasenfrei; Ventile schließen, Druckkammer auf den Anfangsdruck pumpen, Überströmventil öffnen und Luftgehalt A₁ ablesen.', dauer: '10 min' },
    { titel: 'Korrekturfaktor', text: 'Den Korrekturfaktor G der Gesteinskörnung vorab oder parallel an einer Gesteinskörnungsprobe bestimmen (bei dichter Gesteinskörnung oft klein, 0,1 bis 0,3 %).', laborAnpassen: true },
    { titel: 'Aufräumen', text: 'Geräte sofort reinigen, Restbeton in den vorgesehenen Behälter, kein Zementleim in den Ausguss.' },
  ],
  protokoll: {
    titel: 'Messprotokoll Frischbeton',
    hinweis: 'Je Zeile eine Probe bzw. Charge. Die Soll-Rohdichte aus dem Mischungsentwurf (ohne Luftporen gerechnet) erlaubt eine Gegenprobe des Luftgehalts.',
    kopf: [
      { id: 'beton', label: 'Betonsorte / Mischung', typ: 'text' },
      { id: 'soll', label: 'Soll-Rohdichte luftporenfrei', einheit: 'kg/m³', typ: 'zahl', standard: '2400' },
      { id: 'dmax', label: 'Größtkorn', einheit: 'mm', typ: 'zahl', standard: '16' },
      { id: 'temperatur', label: 'Betontemperatur', einheit: '°C', typ: 'zahl' },
      { id: 'uhrzeit', label: 'Wasserzugabe / Prüfbeginn (Uhrzeit)', typ: 'text' },
    ],
    spalten: [
      { id: 'd1', label: 'Durchmesser d₁', einheit: 'mm', typ: 'zahl' },
      { id: 'd2', label: 'Durchmesser d₂', einheit: 'mm', typ: 'zahl' },
      { id: 'mLeer', label: 'Behälter leer m₁', einheit: 'kg', typ: 'zahl' },
      { id: 'mVoll', label: 'Behälter gefüllt m₂', einheit: 'kg', typ: 'zahl' },
      { id: 'vol', label: 'Behältervolumen V', einheit: 'L', typ: 'zahl' },
      { id: 'a1', label: 'Luftgehalt abgelesen A₁', einheit: '%', typ: 'zahl' },
      { id: 'g', label: 'Korrekturfaktor G', einheit: '%', typ: 'zahl' },
      { id: 'befund', label: 'Befund', typ: 'text' },
    ],
    zeilen: 3,
    beispiel: {
      kopf: { beton: 'Lehrbeispiel C25/30 F3, CEM II/A-LL 42,5 N', soll: '2400', dmax: '16', temperatur: '19', uhrzeit: '09:10 / 09:15' },
      zeilen: [
        { d1: '450', d2: '470', mLeer: '3,215', mVoll: '22,045', vol: '8,00', a1: '2,1', g: '0,2', befund: 'gleichmäßig, kein Wasserrand' },
        { d1: '440', d2: '455', mLeer: '3,215', mVoll: '22,020', vol: '8,00', a1: '2,3', g: '0,2', befund: 'gleichmäßig' },
      ],
    },
  },
  fehlerquellen: [
    { quelle: 'Ausbreittisch nicht waagerecht oder trocken', wirkung: 'einseitiges Ausbreiten, d₁ und d₂ weichen stark ab bzw. Ausbreitmaß zu klein', abhilfe: 'Tisch ausrichten, Platte und Form befeuchten (nicht nass)' },
    { quelle: 'Zeit zwischen Mischen und Prüfen', wirkung: 'Ansteifen: Ausbreitmaß sinkt, Luftgehalt ändert sich', abhilfe: 'Prüfzeitpunkt protokollieren, Prüfungen zügig nacheinander' },
    { quelle: 'unvollständige Verdichtung im Rohdichtebehälter', wirkung: 'Rohdichte zu niedrig, Luftgehalt zu hoch', abhilfe: 'Lagenweise verdichten, bis die Oberfläche glänzt und keine großen Blasen mehr aufsteigen' },
    { quelle: 'Überverdichtung bei LP-Beton', wirkung: 'künstliche Luftporen werden ausgetrieben, Luftgehalt zu niedrig', abhilfe: 'Verdichtungsdauer begrenzen und einheitlich halten' },
    { quelle: 'Behältervolumen nicht kalibriert, Rand nicht gesäubert', wirkung: 'systematischer Fehler der Rohdichte', abhilfe: 'Volumen mit Wasser und Glasplatte kalibrieren, Außenseite vor dem Wiegen reinigen' },
    { quelle: 'Korrekturfaktor G vergessen', wirkung: 'Luftgehalt zu hoch', abhilfe: 'G bestimmen bzw. Herstellerangabe für die Gesteinskörnung verwenden' },
  ],
  fragen: [
    'Welche Ausbreitmaßklasse hat Ihr Beton, und für welche Einbausituation eignet sich diese Konsistenz?',
    'Vergleichen Sie den gemessenen Luftgehalt mit dem aus Soll- und Ist-Rohdichte berechneten. Wie erklären Sie eine Differenz?',
    'Warum wird der Luftgehalt beim Druckausgleichsverfahren um einen Korrekturfaktor der Gesteinskörnung verringert?',
    'Wie verändert sich das Ausbreitmaß, wenn die Prüfung 30 min später stattfindet, und warum?',
    'Warum ist das Druckausgleichsverfahren für Leichtbeton nicht geeignet?',
    'Welche Rolle spielt der Luftgehalt für die Druckfestigkeit und für den Frost-Tausalz-Widerstand?',
  ],
};
