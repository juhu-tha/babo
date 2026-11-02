/**
 * Lernpfade „Lehrveranstaltungen“ (Umsetzungsplan Phase 6, AP 6.1).
 *
 * Eine Seite je Lehrveranstaltung: Terminplan, je Termin zugeordnete Module, daraus abgeleitet Lernziele
 * (src/data/lernziele.ts über die Modulkopf-Daten), Quizset (Fragen der Module über src/data/quizLader.ts) und
 * Klausurtraining (Klausursimulator, gefiltert auf die Module der Lehrveranstaltung).
 *
 * STAND 25.10.2026: Alle Terminpläne sind ENTWÜRFE (status: 'entwurf'). Termine, Reihenfolge und Modulzuordnung
 * wurden aus vorhandenen Gliederungen und dem Modulbestand abgeleitet; die echten Terminpläne liefert
 * Prof. Dr.-Ing. Jürgen Huber. Deshalb keine Daten (datum) eintragen, solange der Plan nicht freigegeben ist.
 * STAND 27.10.2026: Für das WS 2026/27 ist je Termin eine Vorlesungswoche als Entwurf hinterlegt (wocheEntwurf,
 * Anzeige „Entwurf, zu bestätigen“); Übersicht und Begründung in docs/entwuerfe/terminplaene-ws2627.md.
 * Freigabe: status auf 'freigegeben' setzen, sobald Termine, Daten und Zuordnung bestätigt sind.
 *
 * Diese Datei wird nur von der (lazy geladenen) Seite Lehrveranstaltungen importiert – nicht in den Einstieg.
 * tests/lernpfade.test.ts prüft: IDs eindeutig, jede Modul-ID existiert, jeder Termin hat ≥ 1 Modul.
 */
import type { ModulId } from '../registry/modules';

export type LernpfadStatus = 'entwurf' | 'freigegeben';

/** Art des Lernpfads: Lehrveranstaltung (AP 6.1, diese Datei) oder Weiterbildungskurs (AP 6.3, src/data/ttzKurse.ts) */
export type LernpfadArt = 'lehrveranstaltung' | 'weiterbildung';

/** IDs der Übungen in src/data/kiUebungen.ts (Modul ki_uebungen) */
export type KiUebungId = 'llm_grundlagen' | 'prompting_buero' | 'agenten' | 'rag_normtexte' | 'programmieren_lassen' | 'fehlerbilder';

export interface LernpfadTermin {
  /** laufende Nummer (A.RYC beginnt bei 0 = ARYC-00) */
  nr: number;
  titel: string;
  /** Datum JJJJ-MM-TT – erst eintragen, wenn der Terminplan freigegeben ist */
  datum?: string;
  /**
   * Vorlesungswoche im Entwurf: Montag der Woche (JJJJ-MM-TT), Anzeige „Entwurf, zu bestätigen“.
   * Raster WS 2026/27 der THA (Vorlesungszeit 01.10.2026–22.01.2027, vorlesungsfrei 24.12.2026–06.01.2027);
   * der Wochentag der Lehrveranstaltung ist noch offen. Entfällt, sobald datum eingetragen ist.
   */
  wocheEntwurf?: string;
  /** zugeordnete Module (IDs aus der Registry), mindestens eines */
  module: readonly ModulId[];
  hinweis?: string;
  /** Unterrichtseinheiten à 45 min (nur wo bekannt, z. B. KI-Master) */
  ue?: number;
  /** zugehörige Hands-on-Übung im Modul ki_uebungen */
  uebung?: KiUebungId;
}

export interface Lernpfad {
  /** zugleich Modul-ID der Seite in der Registry */
  id: ModulId;
  /** Art des Lernpfads; fehlt = 'lehrveranstaltung' */
  kind?: LernpfadArt;
  titel: string;
  kurztitel: string;
  studiengang: string;
  semester: string;
  umfang: string;
  status: LernpfadStatus;
  /** Hinweis zur gesamten Lehrveranstaltung */
  hinweis?: string;
  /** Kennung der Termine, z. B. „ARYC-“ → ARYC-00 … ARYC-13; Standard „Termin “ */
  terminPraefix?: string;
  termine: readonly LernpfadTermin[];
}

export const ENTWURF_HINWEIS = 'Entwurf – Terminplan noch nicht freigegeben';

export const LERNPFADE: readonly Lernpfad[] = [
  {
    id: 'lv_baustoffkunde',
    titel: 'Baustoffkunde (Grundlagen)',
    kurztitel: 'Baustoffkunde',
    studiengang: 'Bauingenieurwesen und Architektur (Bachelor)',
    semester: 'Grundlagenstudium (Semesterlage offen)',
    umfang: '12 Termine (Entwurf; SWS noch offen)',
    status: 'entwurf',
    hinweis: 'Abfolge nach der klassischen Gliederung: Kenngrößen → mineralische → metallische → organische Baustoffe; abgeleitet aus der Vorlesungsgliederung „Baustoffkunde (VL)“.',
    termine: [
      { nr: 1, wocheEntwurf: '2026-10-05', titel: 'Einführung, Systematik und Kenngrößen der Baustoffe', module: ['baustoffkunde', 'baustoffkenngroessen', 'einheiten', 'materialkennwerte'] },
      { nr: 2, wocheEntwurf: '2026-10-12', titel: 'Aufbau der Stoffe: Bindungsarten, Gefüge und Bauchemie', module: ['grundlagen_info', 'bauchemie'] },
      { nr: 3, wocheEntwurf: '2026-10-19', titel: 'Mechanisches Verhalten und Baustoffprüfung', module: ['mechanische_kenngroessen', 'mechanische_pruefungen', 'messen_pruefen'] },
      { nr: 4, wocheEntwurf: '2026-10-26', titel: 'Natursteine und Gesteinskörnungen', module: ['gesteine', 'grundlagen'] },
      { nr: 5, wocheEntwurf: '2026-11-02', titel: 'Nichthydraulische Bindemittel: Baukalk und Gips', module: ['kalk', 'gips'] },
      { nr: 6, wocheEntwurf: '2026-11-09', titel: 'Zement und Hydratation', module: ['bindemittel', 'hydratation_folgen'] },
      { nr: 7, wocheEntwurf: '2026-11-16', titel: 'Beton: Zusammensetzung, Frisch- und Festbeton', module: ['mischungsberechnung', 'frischbeton', 'festbeton'] },
      { nr: 8, wocheEntwurf: '2026-11-23', titel: 'Mauerwerk, Ziegel, Putze und Mörtel', module: ['mauerwerk', 'keramik_ziegel', 'putzemoertel'] },
      { nr: 9, wocheEntwurf: '2026-11-30', titel: 'Stahl, NE-Metalle und Metallkorrosion', module: ['stahl', 'metalle', 'metallkorrosion'] },
      { nr: 10, wocheEntwurf: '2026-12-07', titel: 'Holz und Holzwerkstoffe', module: ['holz', 'holzwerkstoffe'] },
      { nr: 11, wocheEntwurf: '2026-12-14', titel: 'Kunststoffe, Bitumen und Dämmstoffe', module: ['kunststoffe', 'asphalt', 'daemmstoffe'] },
      { nr: 12, wocheEntwurf: '2027-01-11', titel: 'Glas, Lehm, nachwachsende und neue Baustoffe', module: ['glas', 'lehm', 'nawaro', 'innovative_werkstoffe'] },
    ],
  },
  {
    id: 'lv_bauen_im_bestand',
    titel: 'Bauen im Bestand',
    kurztitel: 'Bauen im Bestand',
    studiengang: 'Bauingenieurwesen und Architektur (Studiengang und Niveau noch offen)',
    semester: 'offen',
    umfang: '12 Termine (Entwurf; SWS noch offen)',
    status: 'entwurf',
    hinweis: 'Abgeleitet aus der Vorlesungsgliederung „Bauen im Bestand (VL)“ (14 Einheiten), auf 12 Termine verdichtet.',
    termine: [
      { nr: 1, wocheEntwurf: '2026-10-05', titel: 'Einführung: Bestand als Ressource, Baualtersklassen und Epochen', module: ['bestand_info', 'bestand'] },
      { nr: 2, wocheEntwurf: '2026-10-12', titel: 'Bauaufnahme, Archivrecherche und Bauwerkserfassung', module: ['bauwerkserfassung', 'probenahme'] },
      { nr: 3, wocheEntwurf: '2026-10-19', titel: 'Schadenskartierung und Kausalkette', module: ['schadensbilder', 'bauschaeden'] },
      { nr: 4, wocheEntwurf: '2026-10-26', titel: 'Bauwerksdiagnose und zerstörungsfreie Prüfung', module: ['bauwerksdiagnose', 'pruefverfahren_katalog', 'zfp', 'analytik'] },
      { nr: 5, wocheEntwurf: '2026-11-02', titel: 'Holz im Bestand: Diagnostik, Schädlinge und Pilze', module: ['holzkorrosion', 'holz'] },
      { nr: 6, wocheEntwurf: '2026-11-09', titel: 'Mauerwerk im Bestand: Diagnose und historische Bauweisen', module: ['mauerwerk', 'historische_bauweisen'] },
      { nr: 7, wocheEntwurf: '2026-11-16', titel: 'Feuchte und Hygrothermik, Innendämmung', module: ['feuchteschutz', 'daemmung_vergleich'] },
      { nr: 8, wocheEntwurf: '2026-11-23', titel: 'Historische Baustoffe, Bauprodukte und Denkmalpflege', module: ['historische_bauprodukte', 'denkmalpflege'] },
      { nr: 9, wocheEntwurf: '2026-11-30', titel: 'Historische Betonstähle und Eisenwerkstoffe, Materialkennwerte', module: ['historisch', 'stahl'] },
      { nr: 10, wocheEntwurf: '2026-12-07', titel: 'Schadstoffe im Bestand', module: ['schadstoffe', 'pfas_baustoffe'] },
      { nr: 11, wocheEntwurf: '2026-12-14', titel: 'Bestandsschutz, Modernisierung und energetische Anforderungen', module: ['modernisierung', 'energieausweis'] },
      { nr: 12, wocheEntwurf: '2027-01-11', titel: 'Bewertung bestehender Tragwerke und Zustandsbewertung', module: ['sicherheitskonzept', 'vdi6200', 'bestand_checklisten'] },
    ],
  },
  {
    id: 'lv_aryc',
    titel: 'A.RYC – Recycling, Abfälle, Altlasten',
    kurztitel: 'A.RYC',
    studiengang: 'offen (noch zu ergänzen)',
    semester: 'offen',
    umfang: '14 Termine ARYC-00 bis ARYC-13',
    status: 'entwurf',
    terminPraefix: 'ARYC-',
    hinweis: 'Themen der Foliensätze ARYC-00 bis ARYC-13 im Detail noch nicht hinterlegt; Termine aus den Modulen der Bereiche Rückbau & Schadstoffe, Kreislaufwirtschaft, Abfälle und Boden entworfen.',
    termine: [
      { nr: 0, wocheEntwurf: '2026-10-05', titel: 'Einführung: Stoffkreisläufe und Ressourcen im Bauwesen', module: ['rueckbau_info', 'ressourcen_umwelt', 'kreislauf_dpp'] },
      { nr: 1, wocheEntwurf: '2026-10-12', titel: 'Rechtsrahmen: KrWG, Abfallhierarchie und Abfallbegriff', module: ['abfaelle', 'nachhaltigkeit_daten_regeln'] },
      { nr: 2, wocheEntwurf: '2026-10-19', titel: 'Gewerbeabfallverordnung (GewAbfV): Getrennthaltung und Dokumentation', module: ['abfaelle', 'rueckbau'], hinweis: 'Stand der GewAbfV-Novelle prüfen (Kabinettsbeschluss 27.11.2024; Angaben zu Verkündung und Inkrafttreten widersprüchlich, vorläufig – Stand 11/2026).' },
      { nr: 3, wocheEntwurf: '2026-10-26', titel: 'Abfallverzeichnis (AVV), Einstufung und Nachweisführung', module: ['abfaelle', 'rueckbau_checklisten'] },
      { nr: 4, wocheEntwurf: '2026-11-02', titel: 'Rückbau: Planung, Erkundung und Materialstrom', module: ['rueckbau', 'probenahme', 'schadstoffe'], hinweis: 'Stand der GewAbfV-Novelle prüfen (Kabinettsbeschluss 27.11.2024; Angaben zu Verkündung und Inkrafttreten widersprüchlich, vorläufig – Stand 11/2026).' },
      { nr: 5, wocheEntwurf: '2026-11-09', titel: 'Schad- und Gefahrstoffe: Asbest, PAK, PCB, KMF', module: ['schadstoffe'] },
      { nr: 6, wocheEntwurf: '2026-11-16', titel: 'PFAS in Baustoffen und Böden', module: ['pfas_baustoffe'] },
      { nr: 7, wocheEntwurf: '2026-11-23', titel: 'Mineralik I: Beton und Mauerwerk', module: ['rueckbau', 'mauerwerk', 'grundlagen', 'materialoptimierung'], hinweis: 'RC-Gesteinskörnungen, Recyclingbeton, Mauerwerksbruch.' },
      { nr: 8, wocheEntwurf: '2026-11-30', titel: 'Mineralik II: Ersatzbaustoffverordnung (EBV)', module: ['boden_materialaufbereitung', 'erdbau'], hinweis: 'Materialklassen und Grenzwerte nach EBV in der geltenden Fassung prüfen.' },
      { nr: 9, wocheEntwurf: '2026-12-07', titel: 'Boden und Altlasten: Erkundung, Bewertung, Sanierung', module: ['boden_materialaufbereitung', 'bodenmechanik', 'probenahme'] },
      { nr: 10, wocheEntwurf: '2026-12-14', titel: 'Altholz und Urban Mining', module: ['altholz_urban_mining'] },
      { nr: 11, wocheEntwurf: '2026-12-21', titel: 'Metalle, Kunststoffe, Glas und Dämmstoffe: Verwertungswege', module: ['metalle', 'kunststoffe', 'glas', 'daemmstoffe'] },
      { nr: 12, wocheEntwurf: '2027-01-11', titel: 'Design for Disassembly, Materialpässe und Digitaler Produktpass', module: ['kreislauf_dpp', 'materialpaesse', 'dpp'] },
      { nr: 13, wocheEntwurf: '2027-01-18', titel: 'Ressourceneffizienz und Bilanzierung, Abschluss', module: ['ressourceneffizienz', 'oekobilanz_lca'] },
    ],
  },
  {
    id: 'lv_wpf_nachhaltiges_bauen',
    titel: 'Wahlpflichtfach Nachhaltiges Bauen',
    kurztitel: 'WPF Nachhaltiges Bauen',
    studiengang: 'Bauingenieurwesen (Bachelor)',
    semester: '7. Semester',
    umfang: '12 Termine à 1,5 h, davon 2 mit externen Referent:innen',
    status: 'entwurf',
    hinweis: 'Pflichtthemen: Ökobilanzierung mit Übungen, DAfStb-Richtlinie „Treibhausgasreduzierte Tragwerke“, Zertifizierungssysteme mit Schwerpunkt DGNB, Deklarationen und Siegel.',
    termine: [
      { nr: 1, wocheEntwurf: '2026-10-05', titel: 'Einführung: Klimawirkung des Bauens und Rechtsrahmen', module: ['nachhaltigkeit_info', 'nachhaltigkeit_daten_regeln'] },
      { nr: 2, wocheEntwurf: '2026-10-12', titel: 'Ökobilanzierung I: Methode nach DIN EN 15978 und DIN EN 15804', module: ['oekobilanz_lca'] },
      { nr: 3, wocheEntwurf: '2026-10-19', titel: 'Ökobilanzierung II: Übung Bauteil-Ökobilanz', module: ['lca_rechner', 'rechnung_nachhaltigkeit'], hinweis: 'Übung' },
      { nr: 4, wocheEntwurf: '2026-10-26', titel: 'Ökobilanzierung III: Übung Gebäude-Ökobilanz und QNG-Nachweis', module: ['lca_rechner', 'lca_regulatorik'], hinweis: 'Übung' },
      { nr: 5, wocheEntwurf: '2026-11-02', titel: 'DAfStb-Richtlinie „Treibhausgasreduzierte Tragwerke“', module: ['materialoptimierung', 'lca_ingenieurbau'] },
      { nr: 6, wocheEntwurf: '2026-11-09', titel: 'Externer Vortrag 1', module: ['nachhaltigkeit_info'], hinweis: 'Platzhalter: externe:r Referent:in und Thema noch offen; Modulzuordnung nach Thema anpassen.' },
      { nr: 7, wocheEntwurf: '2026-11-16', titel: 'Deklarationen: Umweltproduktdeklarationen (EPD) und Digitaler Produktpass', module: ['zertifizierung_siegel', 'dpp'] },
      { nr: 8, wocheEntwurf: '2026-11-23', titel: 'Zertifizierungssysteme I: DGNB-System', module: ['zertifizierung_siegel', 'nachhaltigkeit_checklisten'] },
      { nr: 9, wocheEntwurf: '2026-11-30', titel: 'Zertifizierungssysteme II: DGNB-Kriterien in der Anwendung, BNB, QNG, LEED', module: ['zertifizierung_siegel', 'lebenszyklus_kosten'], hinweis: 'Übung' },
      { nr: 10, wocheEntwurf: '2026-12-07', titel: 'Siegel und Produktkennzeichnungen', module: ['zertifizierung_siegel', 'bp_recht_grundlagen'] },
      { nr: 11, wocheEntwurf: '2026-12-14', titel: 'Externer Vortrag 2', module: ['nachhaltigkeit_info'], hinweis: 'Platzhalter: externe:r Referent:in und Thema noch offen; Modulzuordnung nach Thema anpassen.' },
      { nr: 12, wocheEntwurf: '2027-01-11', titel: 'Kreislaufgerechtes Bauen und Abschluss', module: ['kreislauf_dpp', 'ressourcen_umwelt'] },
    ],
  },
  {
    id: 'lv_vnhb',
    titel: 'VNHB – Vertiefung Nachhaltiges Bauen',
    kurztitel: 'VNHB',
    studiengang: 'offen (noch zu ergänzen)',
    semester: 'offen',
    umfang: '12 Termine (Entwurf; SWS noch offen)',
    status: 'entwurf',
    hinweis: 'Durchgehendes Fallbeispiel „MFH Augsburg-Nord“: Jeder Termin wendet die Inhalte auf dasselbe Mehrfamilienhaus an.',
    termine: [
      { nr: 1, wocheEntwurf: '2026-10-05', titel: 'Einführung, Rahmen (EPBD, GEG, Taxonomie) und Fallbeispiel', module: ['nachhaltigkeit_daten_regeln', 'nachhaltigkeit_info'], hinweis: 'Fallbeispiel MFH Augsburg-Nord vorstellen.' },
      { nr: 2, wocheEntwurf: '2026-10-12', titel: 'Bilanzrahmen und Lebenszyklusphasen', module: ['oekobilanz_lca'], hinweis: 'MFH Augsburg-Nord: Systemgrenze und funktionelle Einheit festlegen.' },
      { nr: 3, wocheEntwurf: '2026-10-19', titel: 'Datengrundlagen: ÖKOBAUDAT, EPD und Materialdatenbanken', module: ['zertifizierung_siegel', 'materialdatenbanken'] },
      { nr: 4, wocheEntwurf: '2026-10-26', titel: 'Gebäude-Ökobilanz und QNG-Nachweis', module: ['lca_rechner', 'rechnung_nachhaltigkeit'], hinweis: 'MFH Augsburg-Nord: Ökobilanz der Varianten rechnen.' },
      { nr: 5, wocheEntwurf: '2026-11-02', titel: 'Betriebsenergie, GEG und Energieausweis', module: ['energieausweis', 'bauphysik'] },
      { nr: 6, wocheEntwurf: '2026-11-09', titel: 'Materialwahl: Klinkerreduktion, Holz und biogene Baustoffe', module: ['materialoptimierung', 'nawaro', 'holzbau_werkstoffe'] },
      { nr: 7, wocheEntwurf: '2026-11-16', titel: 'Sommerlicher Wärmeschutz und Suffizienz', module: ['sommerlicher_waermeschutz'] },
      { nr: 8, wocheEntwurf: '2026-11-23', titel: 'Lebenszykluskosten und CRREM', module: ['lebenszyklus_kosten', 'lca_regulatorik'] },
      { nr: 9, wocheEntwurf: '2026-11-30', titel: 'Zirkuläres Konstruieren und Materialpässe', module: ['kreislauf_dpp', 'materialpaesse'] },
      { nr: 10, wocheEntwurf: '2026-12-07', titel: 'Rückbau, Abfälle und Ersatzbaustoffe', module: ['rueckbau', 'abfaelle'] },
      { nr: 11, wocheEntwurf: '2026-12-14', titel: 'Zertifizierung (DGNB, QNG) am Fallbeispiel', module: ['zertifizierung_siegel', 'nachhaltigkeit_checklisten'], hinweis: 'MFH Augsburg-Nord: Kriterien bewerten.' },
      { nr: 12, wocheEntwurf: '2027-01-11', titel: 'Bestand oder Neubau? Variantenvergleich und Abschluss', module: ['modernisierung', 'ressourcen_umwelt'], hinweis: 'MFH Augsburg-Nord: Gesamtbewertung.' },
    ],
  },
  {
    id: 'lv_ki_master',
    titel: 'Grundlagen für den Einsatz von KI im Bauwesen – Möglichkeiten und Grenzen',
    kurztitel: 'KI im Bauwesen (Master)',
    studiengang: 'Bauingenieurwesen (Master)',
    semester: 'offen',
    umfang: '2,5 SWS an höchstens 12 Terminen: Grundlagenteil 1,0 SWS (24 UE), Praxisberichte/Gastvorträge 1,5 SWS',
    status: 'entwurf',
    hinweis: 'Gastvorträge der Fachbereiche (1,5 SWS): Termine und Themen gestalten die Fachkolleg:innen selbst – hier nur als Platzhalter vermerkt. Jeder Grundlagenblock schließt mit einer Hands-on-Übung im Modul „Hands-on-Übungen KI (Master)“.',
    termine: [
      { nr: 1, wocheEntwurf: '2026-10-05', titel: 'Einführung: Was ist KI? Maschinelles Lernen und Branchenbezug', module: ['ki_ueberblick'], ue: 2 },
      { nr: 2, wocheEntwurf: '2026-10-12', titel: 'LLM-Grundlagen', module: ['ki_ueberblick', 'ki_system', 'ki_uebungen'], ue: 4, uebung: 'llm_grundlagen' },
      { nr: 3, wocheEntwurf: '2026-10-19', titel: 'Funktionsweise eines KI-Assistenten (cloudbasiert und lokal)', module: ['ki_system', 'ki_lokal', 'ki_uebungen'], ue: 3, uebung: 'llm_grundlagen', hinweis: 'Übung: Vorlage 3 „Funktionsweise“ der Übung zu Block 1.' },
      { nr: 4, wocheEntwurf: '2026-10-26', titel: 'Prompting im Ingenieurbüro', module: ['ki_prompting', 'ki_llmpraxis', 'ki_uebungen'], ue: 3, uebung: 'prompting_buero' },
      { nr: 5, wocheEntwurf: '2026-11-02', titel: 'KI-Agenten', module: ['ki_system', 'ki_uebungen'], ue: 3, uebung: 'agenten' },
      { nr: 6, wocheEntwurf: '2026-11-09', titel: 'Retrieval-Augmented Generation (RAG) mit Normtexten', module: ['ki_system', 'ki_thesen', 'ki_uebungen'], ue: 3, uebung: 'rag_normtexte' },
      { nr: 7, wocheEntwurf: '2026-11-16', titel: '„Sich programmieren lassen“', module: ['ki_llmpraxis', 'online_tools', 'ki_uebungen'], ue: 3, uebung: 'programmieren_lassen' },
      { nr: 8, wocheEntwurf: '2026-11-23', titel: 'Fehlerbilder und Verifikation, Recht und Ethik', module: ['ki_recht_ethik', 'ki_uebungen'], ue: 3, uebung: 'fehlerbilder' },
    ],
  },
  {
    id: 'lv_zert_ausbau_bestand',
    titel: 'Zertifikat „Ausbau und Bestand“',
    kurztitel: 'Zertifikat Ausbau und Bestand',
    studiengang: 'Weiterbildung (Zertifikat Fachingenieur:in / Fachplaner:in, 30 ECTS)',
    semester: '2 Semester, berufsbegleitend',
    umfang: 'Module A 1 bis A 3 (Termine je Modul noch offen)',
    status: 'entwurf',
    hinweis: 'Gliederung nach den Modulen A 1 „Projektmodul“, A 2 „Konzeption und Konstruktion“ und A 3 „Bauphysik und TGA“ (Angaben aus Weiter@THA). Schwerpunkte: Nachhaltigkeit, Schadstoffe, Kreislaufwirtschaft, Projektmanagement, Aus- und Leichtbausysteme.',
    termine: [
      { nr: 1, titel: 'A 1 · Projektauftakt: Bestandsaufnahme am Projektobjekt', module: ['weiter_ausbau', 'bauwerkserfassung', 'bestand'] },
      { nr: 2, titel: 'A 1 · Schadstoffe und Rückbau im Projekt', module: ['schadstoffe', 'rueckbau'] },
      { nr: 3, titel: 'A 1 · Nachhaltigkeit und Kreislaufwirtschaft im Ausbau', module: ['kreislauf_dpp', 'oekobilanz_lca'] },
      { nr: 4, titel: 'A 1 · Projektmanagement, Planung und Ausschreibung', module: ['px_planung', 'px_bauleitung'] },
      { nr: 5, titel: 'A 2 · Trockenbau und Leichtbausysteme', module: ['bp_trockenbau', 'innenausbau'] },
      { nr: 6, titel: 'A 2 · Putz, Estrich und Bodenaufbauten', module: ['bp_putz_estrich', 'putzemoertel'] },
      { nr: 7, titel: 'A 2 · Abdichtung und Ausbau', module: ['ausbau', 'bp_abdichtung'] },
      { nr: 8, titel: 'A 2 · Historische Konstruktionen und Instandsetzung', module: ['historische_bauweisen', 'instandsetzung_materialien'] },
      { nr: 9, titel: 'A 3 · Wärme- und Feuchteschutz, Innendämmung im Bestand', module: ['daemmung_vergleich', 'feuchteschutz'] },
      { nr: 10, titel: 'A 3 · Schallschutz im Ausbau', module: ['schallschutz'] },
      { nr: 11, titel: 'A 3 · Brandschutz im Bestand', module: ['brandschutz'] },
      { nr: 12, titel: 'A 3 · Energetische Modernisierung und Schnittstellen zur TGA', module: ['modernisierung', 'energieausweis'] },
    ],
  },
];

export const LERNPFAD_BY_ID: ReadonlyMap<string, Lernpfad> = new Map(LERNPFADE.map(l => [l.id, l]));

/** Kennung eines Termins, z. B. „ARYC-07“ oder „Termin 3“ */
export function terminKennung(l: Lernpfad, t: LernpfadTermin): string {
  return l.terminPraefix ? `${l.terminPraefix}${String(t.nr).padStart(2, '0')}` : `Termin ${t.nr}`;
}

/** alle Module eines Lernpfads, ohne Doppelungen, in Terminreihenfolge */
export function moduleDesLernpfads(l: Lernpfad): ModulId[] {
  return [...new Set(l.termine.flatMap(t => t.module))];
}
