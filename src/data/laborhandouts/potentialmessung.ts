/** Versuchs-Handout (AP 6.4): Daten für src/modules/laborhandouts/Potentialmessung.tsx – reine Werte, geprüft in tests/handoutExport.test.ts */
import type { VersuchsHandoutDaten } from '@/src/components/handout/handoutTypen';
import { BEZUGSELEKTRODEN } from '@/src/calc/laborversuche';

export const POTENTIAL_HANDOUT: VersuchsHandoutDaten = {
  id: 'labor_potentialmessung',
  titel: 'Potentialmessung an Betonstahl in gesättigter Ca(OH)₂-Lösung mit NaCl-Zugabe',
  normen: ['ASTM C876 (Bewertung, Richtwerte)', 'DIN EN ISO 8044 (Begriffe)'],
  dauer: 'Aufbau 2 h, danach 1 bis 2 Wochen täglich 15 min',
  gruppe: '2 bis 3 Studierende je Messzelle',
  ziel: [
    'das freie Korrosionspotential (Ruhepotential) von Betonstahl in einer Lösung messen, die die alkalische Porenlösung des Betons nachbildet,',
    'durch schrittweise NaCl-Zugabe den Übergang vom passiven in den aktiven Zustand (Depassivierung) am Potentialabfall erkennen,',
    'Messwerte zwischen Bezugselektroden umrechnen (SHE, CSE) und nach Potentialbereichen als Richtwerte einordnen,',
    'das Verhältnis Cl⁻/OH⁻ beim Potentialabfall bestimmen und mit Literaturwerten vergleichen.',
  ],
  geraete: [
    { name: 'hochohmiges Voltmeter bzw. Potentiostat im Messmodus', hinweis: 'Eingangswiderstand mindestens 10 MΩ, Auflösung 1 mV', laborAnpassen: true },
    { name: 'Bezugselektrode', hinweis: 'z. B. Ag/AgCl (KCl gesättigt) oder Cu/CuSO₄; Elektrolytfüllung und Diaphragma vor Versuchsbeginn prüfen', laborAnpassen: true },
    { name: 'Messzelle', hinweis: 'Becherglas oder Kunststoffgefäß mit Deckel (etwa 1 L), Halterung für Stab und Elektrode', laborAnpassen: true },
    { name: 'Analysenwaage (0,01 g), pH-Messgerät oder Indikatorstäbchen, Thermometer' },
    { name: 'Magnetrührer (nur zum Lösen des Salzes, während der Messung aus)' },
  ],
  material: [
    { name: 'Betonstahlabschnitte B500B', hinweis: 'z. B. Ø 10 bis 12 mm, Länge 100 mm, blank geschliffen und entfettet; Stirnseiten und Übergang Luft/Lösung abgedeckt (Epoxidharz, Schrumpfschlauch)', laborAnpassen: true },
    { name: 'gesättigte Calciumhydroxidlösung', hinweis: 'Ca(OH)₂ im Überschuss in entionisiertem Wasser, 24 h gerührt, Bodensatz belassen, pH etwa 12,5' },
    { name: 'Natriumchlorid (NaCl), p. a.', hinweis: 'in vorab abgewogenen Portionen' },
    { name: 'Ethanol oder Aceton zum Entfetten, Schleifpapier, Kabel mit Krokodilklemmen' },
  ],
  sicherheit: [
    { gefahr: 'Calciumhydroxid (stark alkalisch, Gefahr ernster Augenschäden)', massnahme: 'Schutzbrille mit Seitenschutz, Nitrilhandschuhe, Laborkittel; Spritzer sofort mit viel Wasser abspülen, Augendusche in Reichweite.' },
    { gefahr: 'Staub beim Ansetzen der Lösung', massnahme: 'Pulver langsam und staubarm einrieseln lassen, nicht über Kopfhöhe arbeiten.' },
    { gefahr: 'Entfettungsmittel (entzündbar)', massnahme: 'nur kleine Mengen, keine Zündquellen, Gefäße geschlossen halten.' },
    { gefahr: 'Schleifen der Stahlproben', massnahme: 'Schutzbrille; Grat entfernen, Proben mit Handschuhen anfassen (kein Hautfett auf der Messfläche).' },
    { gefahr: 'Entsorgung', massnahme: 'alkalische, chloridhaltige Lösung nach Betriebsanweisung des Labors sammeln bzw. neutralisieren – nicht ungeprüft in den Ausguss.' },
  ],
  ablauf: [
    { titel: 'Lösung ansetzen', text: 'Gesättigte Ca(OH)₂-Lösung herstellen, 24 h abgedeckt rühren und absetzen lassen. pH-Wert und Temperatur notieren. Die Gefäße abgedeckt halten, damit die Lösung nicht karbonatisiert.', dauer: '24 h vorab' },
    { titel: 'Proben vorbereiten', text: 'Stahlabschnitte schleifen, entfetten, wiegen und kennzeichnen. Messkabel anschließen und Stirnflächen sowie die Zone an der Lösungsoberfläche abdecken, sodass nur eine definierte Fläche frei bleibt.', laborAnpassen: true },
    { titel: 'Passivieren', text: 'Proben in die Lösung stellen und mindestens 3 bis 7 Tage ohne Chlorid lagern, bis sich ein stabiles Ruhepotential eingestellt hat (Änderung unter etwa 5 mV je Tag).', dauer: '3 bis 7 Tage', laborAnpassen: true },
    { titel: 'Nullmessung', text: 'Bezugselektrode nahe am Stab eintauchen (Abstand stets gleich, z. B. 1 cm), Potential des Stahls gegen die Bezugselektrode ablesen, sobald der Wert stabil ist. Vorzeichen: Stahl am Pluseingang, Bezugselektrode am Minus (COM).' },
    { titel: 'NaCl schrittweise zugeben', text: 'Eine vorab gewogene NaCl-Portion zugeben, durch kurzes Rühren lösen, Verdunstungsverluste mit entionisiertem Wasser ausgleichen. Die kumulierte NaCl-Masse ins Protokoll eintragen.', laborAnpassen: true },
    { titel: 'Messen nach jeder Zugabe', text: 'Nach einer festen Wartezeit (z. B. 24 h) das Potential messen und Auffälligkeiten an der Probe (Verfärbung, Rostpunkte) als Bemerkung notieren. Bei einem deutlichen Potentialabfall noch zwei bis drei weitere Stufen messen.', dauer: 'je Stufe 15 min' },
    { titel: 'Versuchsende', text: 'Proben ausbauen, fotografieren, Lochfraßstellen zählen. Bezugselektrode spülen und in ihrer Aufbewahrungslösung lagern.' },
  ],
  protokoll: {
    titel: 'Messprotokoll Potentialmessung',
    hinweis: 'Je Zeile eine Zugabestufe; die NaCl-Masse kumuliert eintragen (Gesamtmenge seit Versuchsbeginn), das Potential so, wie es das Messgerät gegen die Bezugselektrode anzeigt.',
    kopf: [
      { id: 'probe', label: 'Probe / Messzelle', typ: 'text' },
      { id: 'bezug', label: 'Bezugselektrode', typ: 'auswahl', optionen: BEZUGSELEKTRODEN.map(b => ({ wert: b.id, label: `${b.name} (+${b.eSHE} mV gegen SHE)` })), standard: 'agcl_ges' },
      { id: 'volumen', label: 'Lösungsvolumen', einheit: 'L', typ: 'zahl', standard: '1,0', laborAnpassen: true },
      { id: 'ph', label: 'pH-Wert der Lösung', typ: 'zahl', standard: '12,5' },
      { id: 'temperatur', label: 'Temperatur', einheit: '°C', typ: 'zahl', standard: '20' },
      { id: 'sprung', label: 'Sprungschwelle Depassivierung', einheit: 'mV', typ: 'zahl', standard: '100' },
    ],
    spalten: [
      { id: 'zeit', label: 'Tag / Uhrzeit', typ: 'text' },
      { id: 'mNaCl', label: 'NaCl kumuliert', einheit: 'g', typ: 'zahl' },
      { id: 'eMess', label: 'Potential gegen Bezugselektrode', einheit: 'mV', typ: 'zahl' },
      { id: 'bemerkung', label: 'Bemerkung', typ: 'text' },
    ],
    zeilen: 8,
    beispiel: {
      kopf: { probe: 'Lehrbeispiel, Stab 1', bezug: 'agcl_ges', volumen: '1,0', ph: '12,6', temperatur: '20', sprung: '100' },
      zeilen: [
        { zeit: 'Tag 0', mNaCl: '0', eMess: '-80', bemerkung: 'passiv, blank' },
        { zeit: 'Tag 1', mNaCl: '0,5', eMess: '-85', bemerkung: '' },
        { zeit: 'Tag 2', mNaCl: '1,0', eMess: '-90', bemerkung: '' },
        { zeit: 'Tag 3', mNaCl: '2,0', eMess: '-100', bemerkung: '' },
        { zeit: 'Tag 4', mNaCl: '3,0', eMess: '-115', bemerkung: '' },
        { zeit: 'Tag 5', mNaCl: '4,0', eMess: '-330', bemerkung: 'erste Rostpunkte' },
        { zeit: 'Tag 6', mNaCl: '6,0', eMess: '-410', bemerkung: 'Lochfraß sichtbar' },
      ],
    },
  },
  fehlerquellen: [
    { quelle: 'Voltmeter mit zu geringem Eingangswiderstand', wirkung: 'Messstrom polarisiert den Stahl, Potential wird verfälscht', abhilfe: 'Gerät mit mindestens 10 MΩ verwenden, Messbereich mV' },
    { quelle: 'Bezugselektrode ausgetrocknet, Diaphragma verstopft oder falsche Füllung', wirkung: 'driftende oder um einen festen Betrag verschobene Werte', abhilfe: 'vor Versuchsbeginn gegen eine zweite Elektrode prüfen (Abweichung wenige mV)' },
    { quelle: 'Vorzeichen vertauscht', wirkung: 'positive statt negative Potentiale, Fehlbewertung', abhilfe: 'Stahl an „+“/„V“, Bezugselektrode an „COM“ anschließen und im Protokoll vermerken' },
    { quelle: 'Spaltkorrosion an der Abdeckung oder an der Luft-Lösung-Grenze', wirkung: 'früher Potentialabfall ohne Bezug zur Chloridmenge', abhilfe: 'Übergänge sorgfältig abdichten, Probe nach dem Versuch begutachten' },
    { quelle: 'Karbonatisierung der offenen Lösung', wirkung: 'pH sinkt, Cl⁻/OH⁻ steigt ohne Salzzugabe', abhilfe: 'Gefäß abdecken, pH zu Beginn und Ende messen' },
    { quelle: 'zu kurze Wartezeit nach der Zugabe', wirkung: 'Potential noch nicht eingeschwungen, Sprung wird später erkannt', abhilfe: 'feste Wartezeit je Stufe und stabile Ablesung (Änderung unter 1 mV je Minute)' },
  ],
  fragen: [
    'Warum ist Stahl in gesättigter Ca(OH)₂-Lösung passiv, und welche Rolle spielt der pH-Wert für die Passivschicht?',
    'Rechnen Sie Ihr Ruhepotential von der verwendeten Bezugselektrode auf SHE und CSE um. Welche Werte ergeben sich?',
    'Bei welchem Cl⁻/OH⁻-Verhältnis fiel das Potential ab? Vergleichen Sie mit dem Richtwert 0,6 nach Hausmann und begründen Sie Abweichungen.',
    'Warum sind die Potentialbereiche der ASTM C876 für Bauwerke nur eingeschränkt auf einen Lösungsversuch übertragbar?',
    'Welche Unterschiede zwischen Lösung und realem Beton (Porenlösung, Sauerstoffzutritt, Bindung von Chlorid) beeinflussen den kritischen Chloridgehalt?',
    'Wie würde sich eine karbonatisierte Lösung (pH 9) auf das Potential und den Chloridgrenzwert auswirken?',
  ],
};
