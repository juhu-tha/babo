/**
 * TTZ-Weiterbildungspfad (Umsetzungsplan Phase 6, AP 6.3): 13 Selbstlernkurse in vier Strängen.
 *
 * ENTWURF – die verbindliche Kursliste liefert Prof. Huber (TTZ Aichach); bis zur Freigabe tragen
 * alle Kurse status 'entwurf' und die Seite zeigt einen Entwurfshinweis.
 *
 * Jeder Kurs verweist auf bestehende Module der App (IDs aus src/registry/modules.ts). Das Kursquiz
 * zieht seine Fragen über src/data/quizLader.ts aus genau diesen Modulen (tests/ttzKurse.test.ts
 * prüft, dass je Kurs mindestens KURSQUIZ_FRAGEN verschiedene Fragen zur Verfügung stehen).
 *
 * Schema an AP 6.1 angelehnt (src/data/lernpfade.ts): gleiche Status-Werte, Modul-IDs als ModulId,
 * Art des Lernpfads kind 'weiterbildung' (LernpfadArt). Statt eines Terminplans hat ein Kurs eine Modulliste
 * und ein Kursquiz mit Bestehensgrenze.
 */
import type { ModulId } from '../registry/modules';
import type { LernpfadArt, LernpfadStatus } from './lernpfade';

export type KursStrang = 'zirkularitaet' | 'lca' | 'zertifizierung' | 'technologie';
export type KursStatus = LernpfadStatus;

export interface TtzKurs {
  id: string;
  /** Art des Lernpfads – Anschluss an das Schema von AP 6.1 */
  kind: Extract<LernpfadArt, 'weiterbildung'>;
  strang: KursStrang;
  titel: string;
  /** Lernziel des Kurses (ein bis zwei Sätze) */
  ziel: string;
  zielgruppe: string;
  /** Umfang als Selbstlernzeit */
  umfang: string;
  /** Modul-IDs der App, in empfohlener Reihenfolge; zugleich Fragenquelle des Kursquiz */
  module: readonly ModulId[];
  status: KursStatus;
}

export const KURS_STRAENGE: readonly { id: KursStrang; titel: string; kurz: string }[] = [
  { id: 'zirkularitaet', titel: 'Zirkularität', kurz: 'Kreislaufwirtschaft, Rückbau, Urban Mining und Schadstoffe im Stoffkreislauf.' },
  { id: 'lca', titel: 'Ökobilanz (LCA)', kurz: 'Methodik, Datengrundlagen und Anwendung der Ökobilanz für Bauprodukte und Bauwerke.' },
  { id: 'zertifizierung', titel: 'Zertifizierung', kurz: 'Gebäudezertifizierung, Produktnachweise und Lebenszyklusbewertung.' },
  { id: 'technologie', titel: 'Technologie & Produkte', kurz: 'Nachwachsende Rohstoffe, klimafreundlicher Beton und Produktinnovationen.' },
];

/** Anzahl Fragen je Kursquiz (zufällig aus den Fragen der zugeordneten Module) */
export const KURSQUIZ_FRAGEN = 10;
/** Bestehensgrenze des Kursquiz als Anteil richtiger Antworten */
export const BESTEHENSGRENZE = 0.8;

export const ENTWURF_HINWEIS = 'Entwurf – Kursliste noch nicht freigegeben';
export const BESTAETIGUNG_HINWEIS = 'Teilnahmebestätigung über ein Selbstlernangebot – kein Zertifikat, keine Prüfung';

const PRAXIS = 'Praxis/Weiterbildung: Planende, Bauleitung, Sachverständige, Baustoffhandel und Behörden';

export const TTZ_KURSE: readonly TtzKurs[] = [
  // --- Zirkularität ---
  { id: 'ttz_z1', kind: 'weiterbildung', strang: 'zirkularitaet', status: 'entwurf',
    titel: 'Grundlagen der Kreislaufwirtschaft im Bauwesen',
    ziel: 'Abfallhierarchie, Ressourceneffizienz und Kreislaufstrategien kennen und auf Baustoffentscheidungen übertragen.',
    zielgruppe: PRAXIS, umfang: 'ca. 3 h Selbstlernzeit',
    module: ['kreislauf_dpp', 'ressourceneffizienz', 'ressourcen_umwelt'] },
  { id: 'ttz_z2', kind: 'weiterbildung', strang: 'zirkularitaet', status: 'entwurf',
    titel: 'Selektiver Rückbau und Abfallmanagement',
    ziel: 'Rückbau planen, Bau- und Abbruchabfälle getrennt erfassen und Ersatzbaustoffe rechtssicher einordnen.',
    zielgruppe: PRAXIS, umfang: 'ca. 3 h Selbstlernzeit',
    module: ['rueckbau', 'abfaelle', 'boden_materialaufbereitung', 'rueckbau_checklisten'] },
  { id: 'ttz_z3', kind: 'weiterbildung', strang: 'zirkularitaet', status: 'entwurf',
    titel: 'Urban Mining, Altholz und Materialpässe',
    ziel: 'Sekundärrohstoffpotenziale im Bestand bewerten, Altholz kaskadisch nutzen und Materialpässe lesen.',
    zielgruppe: PRAXIS, umfang: 'ca. 2,5 h Selbstlernzeit',
    module: ['altholz_urban_mining', 'materialpaesse'] },
  { id: 'ttz_z4', kind: 'weiterbildung', strang: 'zirkularitaet', status: 'entwurf',
    titel: 'Schadstoffe im Stoffkreislauf (PFAS & Co.)',
    ziel: 'Schadstoffverdachte im Rückbau erkennen und deren Folgen für Verwertung und Entsorgung einschätzen.',
    zielgruppe: PRAXIS, umfang: 'ca. 2,5 h Selbstlernzeit',
    module: ['pfas_baustoffe', 'schadstoffe', 'rueckbau_checklisten'] },
  // --- LCA ---
  { id: 'ttz_l1', kind: 'weiterbildung', strang: 'lca', status: 'entwurf',
    titel: 'Ökobilanz-Grundlagen für Bauprodukte und Gebäude',
    ziel: 'Lebenszyklusmodule, Wirkungskategorien und Systemgrenzen verstehen und eine einfache Bauteil-LCA rechnen.',
    zielgruppe: PRAXIS, umfang: 'ca. 4 h Selbstlernzeit',
    module: ['oekobilanz_lca', 'nachhaltigkeit_daten_regeln', 'lca_rechner'] },
  { id: 'ttz_l2', kind: 'weiterbildung', strang: 'lca', status: 'entwurf',
    titel: 'LCA im Ingenieurbau und Materialoptimierung',
    ziel: 'Treibhauspotenziale von Tragwerksvarianten vergleichen und Einsparhebel über Material und Bemessung ableiten.',
    zielgruppe: PRAXIS, umfang: 'ca. 3 h Selbstlernzeit',
    module: ['lca_ingenieurbau', 'materialoptimierung'] },
  { id: 'ttz_l3', kind: 'weiterbildung', strang: 'lca', status: 'entwurf',
    titel: 'LCA-Daten in der Praxis: EPD, Modul D und CO₂-Aufnahme',
    ziel: 'EPD-Daten korrekt zusammenführen, Modul D und Recarbonatisierung einordnen und GWP-Vergleiche nachvollziehen.',
    zielgruppe: PRAXIS, umfang: 'ca. 3 h Selbstlernzeit',
    module: ['dpp', 'rechnung_nachhaltigkeit'] },
  // --- Zertifizierung ---
  { id: 'ttz_c1', kind: 'weiterbildung', strang: 'zertifizierung', status: 'entwurf',
    titel: 'Gebäudezertifizierung DGNB und QNG',
    ziel: 'Aufbau von DGNB und QNG kennen, Ökobilanzanforderungen und EPBD-Vorgaben in Zertifizierungen einordnen.',
    zielgruppe: PRAXIS, umfang: 'ca. 3,5 h Selbstlernzeit',
    module: ['zertifizierung_siegel', 'nachhaltigkeit_daten_regeln', 'lca_regulatorik', 'oekobilanz_lca'] },
  { id: 'ttz_c2', kind: 'weiterbildung', strang: 'zertifizierung', status: 'entwurf',
    titel: 'Produktnachweise: Leistungserklärung, Konformität und Materialpass',
    ziel: 'DoP, CE-Kennzeichnung, AVCP-Systeme und Materialpässe als Nachweisgrundlage für Zertifizierungen nutzen.',
    zielgruppe: PRAXIS, umfang: 'ca. 3 h Selbstlernzeit',
    module: ['bp_recht_grundlagen', 'bp_recht_konformitaet', 'materialpaesse'] },
  { id: 'ttz_c3', kind: 'weiterbildung', strang: 'zertifizierung', status: 'entwurf',
    titel: 'Lebenszykluskosten, CRREM und CO₂-Bepreisung',
    ziel: 'Lebenszykluskosten barwertig berechnen und Klimarisiken (CRREM, CBAM, CO₂-Preis) in Bewertungen berücksichtigen.',
    zielgruppe: PRAXIS, umfang: 'ca. 3 h Selbstlernzeit',
    module: ['lebenszyklus_kosten', 'lca_regulatorik'] },
  // --- Technologie & Produkte ---
  { id: 'ttz_t1', kind: 'weiterbildung', strang: 'technologie', status: 'entwurf',
    titel: 'Holz, Holzwerkstoffe und nachwachsende Rohstoffe',
    ziel: 'Eigenschaften und Einsatzgrenzen von Holz, Holzwerkstoffen und NawaRo-Produkten fachgerecht beurteilen.',
    zielgruppe: PRAXIS, umfang: 'ca. 4 h Selbstlernzeit',
    module: ['holz', 'holzwerkstoffe', 'nawaro', 'bp_holzprodukte'] },
  { id: 'ttz_t2', kind: 'weiterbildung', strang: 'technologie', status: 'entwurf',
    titel: 'Klimafreundlicher Beton: Biokohle und Schnellkarbonatisierung',
    ziel: 'Forschungsstand zu Biokohlebeton und beschleunigter Karbonatisierung von Recyclingmaterial kritisch einordnen.',
    zielgruppe: PRAXIS, umfang: 'ca. 3,5 h Selbstlernzeit',
    module: ['biokohlebeton', 'schnellkarbonatisierung', 'innovative_werkstoffe'] },
  { id: 'ttz_t3', kind: 'weiterbildung', strang: 'technologie', status: 'entwurf',
    titel: 'Bauprodukt-Innovationen: Carbonbeton und Lehm',
    ziel: 'Innovative Bauprodukte hinsichtlich Zulassung, Leistungsfähigkeit und Ressourcenwirkung bewerten.',
    zielgruppe: PRAXIS, umfang: 'ca. 4 h Selbstlernzeit',
    module: ['bp_innovationen', 'carbonbeton', 'lehm', 'bp_lehmbauprodukte'] },
];

export const TTZ_KURS_BY_ID: ReadonlyMap<string, TtzKurs> = new Map(TTZ_KURSE.map(k => [k.id, k]));
