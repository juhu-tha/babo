/**
 * Redaktionsmodell: fachlicher Prüfvermerk je Fachmodul (Umsetzungsplan Phase 6, AP 6.6).
 *
 * Jedes Fachmodul (siehe istFachmodul) braucht hier einen Eintrag; tests/pruefvermerke.test.ts prüft das.
 * Neue Fachmodule werden mit { status: 'offen' } eingetragen. Prüfdaten trägt nur ein, wer die Prüfung
 * tatsächlich durchgeführt hat – keine Namen oder Daten vorwegnehmen.
 *
 *   geprüft:    modul_id: { status: 'geprueft', am: '2026-11-03', von: 'Vorname Nachname' },
 *   Nachprüfung: modul_id: { status: 're-review', am: '2026-11-03', von: '…', offenePunkte: ['Normausgabe EC 2 prüfen'] },
 *
 * Getrennt von src/registry/modules.ts gehalten, damit Prüfvermerke ohne Eingriff in die Registry
 * gepflegt werden können. ModulKopf zeigt den Vermerk an, der Admin-Bereich („Meine Module“) listet ihn.
 */
import { MODULE, BAUM_GRUPPEN, MODUL_BY_ID, type ModulEintrag } from '../registry/modules';

export type PruefStatus = 'geprueft' | 'offen' | 're-review';

export interface Pruefvermerk {
  status: PruefStatus;
  /** Datum der (letzten) fachlichen Prüfung, ISO-Format JJJJ-MM-TT; Pflicht bei 'geprueft' und 're-review' */
  am?: string;
  /** prüfende Person; Pflicht bei 'geprueft' und 're-review' */
  von?: string;
  /** offene fachliche Punkte (Anzeige im Admin-Bereich) */
  offenePunkte?: readonly string[];
}

export const PRUEF_STATUS_TEXT: Record<PruefStatus, string> = {
  geprueft: 'geprüft',
  offen: 'Prüfung ausstehend',
  're-review': 'Nachprüfung erforderlich',
};

/** Menügruppen ohne Fachinhalt (wie in tests/lernziele.test.ts) */
export const OHNE_PRUEFVERMERK: ReadonlySet<string> = new Set(['Allgemein', 'Infos & Quellen', 'Studium THA', 'Weiter@THA', 'Vorlesungen', 'Lehrveranstaltungen', 'Übungsaufgaben', 'Thesen & Projekte', 'Kuriositäten']);
const FACH_TYPEN: ReadonlySet<string> = new Set(['standard', 'calculator', 'norm', 'database']);

/** Fachmodul = Modul in der Modulübersicht mit Fachinhalt (Typ standard, calculator, norm oder database) außerhalb der Info-/Studienbereiche */
export function istFachmodul(m: ModulEintrag | undefined): boolean {
  return !!m?.baum && FACH_TYPEN.has(m.baum.typ) && !OHNE_PRUEFVERMERK.has(m.gruppe ?? '');
}

export const FACHMODULE: readonly ModulEintrag[] = (MODULE as readonly ModulEintrag[]).filter(istFachmodul);

const CLUSTER_NR: Record<string, string> = { cluster_1: 'I', cluster_2: 'II', cluster_3: 'III', cluster_4: 'IV', cluster_5: 'V', cluster_6: 'VI' };
const CLUSTER_VON = new Map<string, string>(BAUM_GRUPPEN.flatMap(g => (g.knoten as readonly string[]).map(id => [id, CLUSTER_NR[g.cluster] ?? ''] as [string, string])));

/** Cluster-Nummer (I–VI) eines Moduls laut Modulübersicht, sonst '' */
export function clusterVon(id: string): string {
  return CLUSTER_VON.get(id) ?? '';
}

/** Prüfvermerk eines Fachmoduls; undefined für Nicht-Fachmodule */
export function pruefvermerkFuer(id: string): Pruefvermerk | undefined {
  if (!istFachmodul(MODUL_BY_ID.get(id))) return undefined;
  return PRUEFVERMERKE[id] ?? { status: 'offen' };
}

/** Datum JJJJ-MM-TT → TT.MM.JJJJ */
export function datumDe(iso: string | undefined): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso ?? '');
  return m ? `${m[3]}.${m[2]}.${m[1]}` : (iso ?? '');
}

// Stand 25.10.2026: Im Repository liegen keine dokumentierten Modulprüfungen vor → alle 'offen'.
export const PRUEFVERMERKE: Record<string, Pruefvermerk> = {
  abfaelle: { status: 'offen' },
  altholz_urban_mining: { status: 'offen' },
  analytik: { status: 'offen' },
  asphalt: { status: 'offen' },
  ausbau: { status: 'offen' },
  bauchemie: { status: 'offen' },
  bauphysik: { status: 'offen' },
  bauschaeden: { status: 'offen' },
  baustatik: { status: 'offen' },
  baustoffkenngroessen: { status: 'offen' },
  baustoffkunde: { status: 'offen' },
  bauwerkserfassung: { status: 'offen' },
  bauwerksunters_monitoring: { status: 'offen' },
  bauwerksuntersuchung: { status: 'offen' },
  bestand: { status: 'offen' },
  beton_a_z: { status: 'offen' },
  betonkennwerte: { status: 'offen' },
  betonpraxis: { status: 'offen' },
  bim_baustoffe: { status: 'offen' },
  bindemittel: { status: 'offen' },
  biokohlebeton: { status: 'offen' },
  boden_materialaufbereitung: { status: 'offen' },
  bodenmechanik: { status: 'offen' },
  bp_abdichtung: { status: 'offen' },
  bp_befestigung: { status: 'offen' },
  bp_beton: { status: 'offen' },
  bp_betonfertigteile: { status: 'offen' },
  bp_betonwaren: { status: 'offen' },
  bp_betonzusatzmittel: { status: 'offen' },
  bp_dach_fassade: { status: 'offen' },
  bp_daemmung: { status: 'offen' },
  bp_farben_lacke: { status: 'offen' },
  bp_glaeser: { status: 'offen' },
  bp_holzprodukte: { status: 'offen' },
  bp_innovationen: { status: 'offen' },
  bp_klebstoffe: { status: 'offen' },
  bp_kunststoffe: { status: 'offen' },
  bp_lehmbauprodukte: { status: 'offen' },
  bp_mauerwerk: { status: 'offen' },
  bp_metallisch: { status: 'offen' },
  bp_mineralisch: { status: 'offen' },
  bp_putz_estrich: { status: 'offen' },
  bp_recht_avcp: { status: 'offen' },
  bp_recht_grundlagen: { status: 'offen' },
  bp_recht_konformitaet: { status: 'offen' },
  bp_recht_normen: { status: 'offen' },
  bp_stahlbauprofile: { status: 'offen' },
  bp_trockenbau: { status: 'offen' },
  bp_verkehr_asphalt: { status: 'offen' },
  bp_verkehr_bahn: { status: 'offen' },
  bp_verkehr_betondecken: { status: 'offen' },
  bp_verkehr_bitumen: { status: 'offen' },
  bp_verkehr_pruefung: { status: 'offen' },
  bp_verkehr_rsto: { status: 'offen' },
  bp_verkehr_tiefbau: { status: 'offen' },
  bp_verkehr_tunnel: { status: 'offen' },
  brandschutz: { status: 'offen' },
  bruchmechanik: { status: 'offen' },
  carbonbeton: { status: 'offen' },
  daemmstoffe: { status: 'offen' },
  daemmung_vergleich: { status: 'offen' },
  dauerhaftigkeit: { status: 'offen' },
  denkmalpflege: { status: 'offen' },
  dpp: { status: 'offen' },
  einheiten: { status: 'offen' },
  emodul: { status: 'offen' },
  energieausweis: { status: 'offen' },
  erdbau: { status: 'offen' },
  expositionsklassen: { status: 'offen' },
  festbeton: { status: 'offen' },
  festbeton_statistik: { status: 'offen' },
  festigkeit: { status: 'offen' },
  feuchteschutz: { status: 'offen' },
  formaenderungen: { status: 'offen' },
  frischbeton: { status: 'offen' },
  gesteine: { status: 'offen' },
  gips: { status: 'offen' },
  glas: { status: 'offen' },
  grundlagen: { status: 'offen' },
  herstellung_einbau: { status: 'offen' },
  historisch: { status: 'offen' },
  historische_bauprodukte: { status: 'offen' },
  historische_bauweisen: { status: 'offen' },
  holz: { status: 'offen' },
  holzbau_bauphysik: { status: 'offen' },
  holzbau_bemessung: { status: 'offen' },
  holzbau_konstruktion: { status: 'offen' },
  holzbau_verbindung: { status: 'offen' },
  holzbau_werkstoffe: { status: 'offen' },
  holzkorrosion: { status: 'offen' },
  holzwerkstoffe: { status: 'offen' },
  hydratation_folgen: { status: 'offen' },
  innenausbau: { status: 'offen' },
  innovative_werkstoffe: { status: 'offen' },
  instandhaltung: { status: 'offen' },
  instandsetzung_materialien: { status: 'offen' },
  kalk: { status: 'offen' },
  keramik_ziegel: { status: 'offen' },
  ki_llmpraxis: { status: 'offen' },
  ki_lokal: { status: 'offen' },
  ki_prompting: { status: 'offen' },
  ki_recht_ethik: { status: 'offen' },
  ki_ressourcen: { status: 'offen' },
  ki_system: { status: 'offen' },
  ki_thesen: { status: 'offen' },
  ki_uebungen: { status: 'offen' },
  knicken: { status: 'offen' },
  kombinationen: { status: 'offen' },
  korrosion: { status: 'offen' },
  korrosionsschutz_beschichtungen: { status: 'offen' },
  kreislauf_dpp: { status: 'offen' },
  kunststoffe: { status: 'offen' },
  labor: { status: 'offen' },
  labor_sicherheit: { status: 'offen' },
  lca_ingenieurbau: { status: 'offen' },
  lca_rechner: { status: 'offen' },
  lca_regulatorik: { status: 'offen' },
  lebenszyklus_kosten: { status: 'offen' },
  lehm: { status: 'offen' },
  material_schaeden_gross: { status: 'offen' },
  materialdatenbanken: { status: 'offen' },
  materialitaet_architektur: { status: 'offen' },
  materialkennwerte: { status: 'offen' },
  materialmodelle: { status: 'offen' },
  materialoptimierung: { status: 'offen' },
  materialpaesse: { status: 'offen' },
  mauerwerk: { status: 'offen' },
  mechanische_kenngroessen: { status: 'offen' },
  mechanische_pruefungen: { status: 'offen' },
  membranen_etfe: { status: 'offen' },
  messen_pruefen: { status: 'offen' },
  metalle: { status: 'offen' },
  metallkorrosion: { status: 'offen' },
  mischungsberechnung: { status: 'offen' },
  modernisierung: { status: 'offen' },
  nachbehandlung: { status: 'offen' },
  nachhaltigkeit_daten_regeln: { status: 'offen' },
  nawaro: { status: 'offen' },
  oekobilanz_lca: { status: 'offen' },
  online_tools: { status: 'offen' },
  pfas_baustoffe: { status: 'offen' },
  probenahme: { status: 'offen' },
  putzemoertel: { status: 'offen' },
  px_bauleitung: { status: 'offen' },
  px_bautagebuch: { status: 'offen' },
  px_karriere: { status: 'offen' },
  px_planung: { status: 'offen' },
  px_produktion: { status: 'offen' },
  qualitaetssicherung: { status: 'offen' },
  rechnung_bestand: { status: 'offen' },
  rechnung_beton: { status: 'offen' },
  rechnung_brandschutz: { status: 'offen' },
  rechnung_holzbau: { status: 'offen' },
  rechnung_mauerwerk: { status: 'offen' },
  rechnung_nachhaltigkeit: { status: 'offen' },
  rechnung_schallschutz: { status: 'offen' },
  rechnung_stahlbeton: { status: 'offen' },
  rechnung_u_wert: { status: 'offen' },
  regularien: { status: 'offen' },
  ressourcen_umwelt: { status: 'offen' },
  ressourceneffizienz: { status: 'offen' },
  rueckbau: { status: 'offen' },
  schadensbilder: { status: 'offen' },
  schadreaktionen_beton: { status: 'offen' },
  schadstoffe: { status: 'offen' },
  schallschutz: { status: 'offen' },
  schnellkarbonatisierung: { status: 'offen' },
  schutz_grundlagen: { status: 'offen' },
  sicherheitskonzept: { status: 'offen' },
  sichtbeton: { status: 'offen' },
  sommerlicher_waermeschutz: { status: 'offen' },
  sonderbetone: { status: 'offen' },
  sonstiges: { status: 'offen' },
  spannbeton: { status: 'offen' },
  stahl: { status: 'offen' },
  stahlbau_ec3: { status: 'offen' },
  stahlbeton_bemessung: { status: 'offen' },
  statistik: { status: 'offen' },
  vdi6200: { status: 'offen' },
  waermeeigenschaften: { status: 'offen' },
  weitere_organik: { status: 'offen' },
  wta: { status: 'offen' },
  'wu-bauwerke': { status: 'offen' },
};
