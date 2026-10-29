/**
 * Redaktionsmodell: fachlicher Prüfvermerk je Fachmodul (Umsetzungsplan Phase 6, AP 6.6).
 *
 * Jedes Fachmodul (siehe istFachmodul) braucht hier einen Eintrag; tests/pruefvermerke.test.ts prüft das.
 * Neue Fachmodule werden mit { status: 'offen' } eingetragen. Prüfdaten trägt nur ein, wer die Prüfung
 * tatsächlich durchgeführt hat – keine Namen oder Daten vorwegnehmen.
 *
 *   geprüft:    modul_id: { status: 'geprueft', am: '2026-11-03' }   (passiv „Fachlich geprüft am …“, ohne Namen)
 *               modul_id: { status: 'geprueft', am: '2026-11-03', von: 'Vorname Nachname' }   (mit prüfender Person)
 *   Nachprüfung: modul_id: { status: 're-review', am: '2026-11-03', von: '…', offenePunkte: ['Normausgabe EC 2 prüfen'] },
 *
 * Getrennt von src/registry/modules.ts gehalten, damit Prüfvermerke ohne Eingriff in die Registry
 * gepflegt werden können. ModulKopf zeigt den Vermerk an, der Admin-Bereich („Meine Module“) listet ihn.
 */
// Nur der Registry-Auszug (src/registry/kern.ts): ModulKopf zeigt den Vermerk auf jeder Modulseite, die volle
// Registry soll dort nicht mitgeladen werden (Phase 5, AP 5.5 Nachtrag). Cluster-Zuordnung: ./modulCluster.ts.
import { MODUL_KERN, type ModulKern } from '../registry/kern';

export type PruefStatus = 'geprueft' | 'offen' | 're-review';

export interface Pruefvermerk {
  status: PruefStatus;
  /** Datum der (letzten) fachlichen Prüfung, ISO-Format JJJJ-MM-TT; Pflicht bei 'geprueft' und 're-review' */
  am?: string;
  /** prüfende Person; Pflicht bei 're-review'. Bei 'geprueft' optional – ohne Angabe passiver Vermerk ohne Namen */
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

/** Fachmodul = Modul in der Modulübersicht mit Fachinhalt (Typ standard, calculator, norm oder database) außerhalb der Info-/Studienbereiche.
 *  Nimmt einen Registry-Eintrag (baum.typ) oder einen Auszug aus src/registry/kern.ts (typ). */
export function istFachmodul(m: { gruppe?: string; typ?: string; baum?: { typ: string } } | undefined): boolean {
  const typ = m?.typ ?? m?.baum?.typ;
  return !!typ && FACH_TYPEN.has(typ) && !OHNE_PRUEFVERMERK.has(m?.gruppe ?? '');
}

export const FACHMODULE: readonly ModulKern[] = [...MODUL_KERN.values()].filter(istFachmodul);

/** Prüfvermerk eines Fachmoduls; undefined für Nicht-Fachmodule */
export function pruefvermerkFuer(id: string): Pruefvermerk | undefined {
  if (!istFachmodul(MODUL_KERN.get(id))) return undefined;
  return PRUEFVERMERKE[id] ?? { status: 'offen' };
}

/** Datum JJJJ-MM-TT → TT.MM.JJJJ */
export function datumDe(iso: string | undefined): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso ?? '');
  return m ? `${m[3]}.${m[2]}.${m[1]}` : (iso ?? '');
}

// Stand 25.10.2026: Im Repository liegen keine dokumentierten Modulprüfungen vor → alle 'offen'.
// 28.10.2026: Module mit Empfehlung „freigabefähig“ ohne offene Fragen aus den Modulprüfungen Tranche 1–3 freigegeben
// (docs/pruefung/module-tranche-2.md, -3.md); Vermerk passiv ohne Namen.
// 29.10.2026: Module ohne offene Frage nach den Modulprüfungen Tranche 1–12 und den Umsetzungen vom 29.10. freigegeben
// (Entscheidung 28.10.: „Module ohne offene Frage freigeben“; Normtextpunkte des Prüfbogens blockieren); Abschnitte
// „Freigabe 29.10.2026“ in docs/pruefung/module-tranche-<n>.md. Vermerk passiv ohne Namen.
// 29.10.2026 (Nachtrag): betonkennwerte, mischungsberechnung, lca_rechner, lebensdauerbemessung nach den Entscheidungen vom
// 29.10. (Lehrwert-Kennzeichnungen); Abschnitte „Freigabe 29.10.2026 (Nachtrag)“ in den Befundlisten Tranche 1 und 2.
export const PRUEFVERMERKE: Record<string, Pruefvermerk> = {
  abfaelle: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 12, freigegeben 29.10.2026 (docs/pruefung/module-tranche-12.md)
  altholz_urban_mining: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 12, freigegeben 29.10.2026 (docs/pruefung/module-tranche-12.md)
  analytik: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 4, freigegeben 29.10.2026 (docs/pruefung/module-tranche-4.md)
  asphalt: { status: 'offen' },
  ausbau: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 6, freigegeben 29.10.2026 (docs/pruefung/module-tranche-6.md)
  bauchemie: { status: 'offen' },
  bauphysik: { status: 'offen' },
  bauschaeden: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 13, freigegeben 29.10.2026 (Nachtrag; docs/pruefung/module-tranche-13.md)
  baustatik: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 10, freigegeben 29.10.2026 (docs/pruefung/module-tranche-10.md)
  baustoffkenngroessen: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 4, freigegeben 29.10.2026 (docs/pruefung/module-tranche-4.md)
  baustoffkunde: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 4, freigegeben 29.10.2026 (docs/pruefung/module-tranche-4.md)
  bauwerkserfassung: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 12, freigegeben 29.10.2026 (docs/pruefung/module-tranche-12.md)
  bauwerksunters_monitoring: { status: 'offen' },
  bauwerksdiagnose: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 12, freigegeben 29.10.2026 (docs/pruefung/module-tranche-12.md)
  pruefverfahren_katalog: { status: 'offen' },
  zfp: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 12, freigegeben 29.10.2026 (docs/pruefung/module-tranche-12.md)
  bestand: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 12, freigegeben 29.10.2026 (docs/pruefung/module-tranche-12.md)
  beton_a_z: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 9, freigegeben 29.10.2026 (docs/pruefung/module-tranche-9.md)
  betonkennwerte: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 1, freigegeben 29.10.2026 nach den Entscheidungen vom 29.10. (docs/pruefung/module-tranche-1.md, Nachtrag)
  betonpraxis: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 9, freigegeben 29.10.2026 (docs/pruefung/module-tranche-9.md)
  bim_baustoffe: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 14, freigegeben 29.10.2026 (Nachtrag; docs/pruefung/module-tranche-14.md)
  bindemittel: { status: 'offen' },
  biokohlebeton: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 9, freigegeben 29.10.2026 (docs/pruefung/module-tranche-9.md)
  boden_materialaufbereitung: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 12, freigegeben 29.10.2026 (docs/pruefung/module-tranche-12.md)
  bodenmechanik: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 2, freigegeben 29.10.2026 (docs/pruefung/module-tranche-2.md)
  bp_abdichtung: { status: 'offen' },
  bp_befestigung: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 8, freigegeben 29.10.2026 (docs/pruefung/module-tranche-8.md)
  bp_beton: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 7, freigegeben 29.10.2026 (docs/pruefung/module-tranche-7.md)
  bp_betonfertigteile: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 7, freigegeben 29.10.2026 (docs/pruefung/module-tranche-7.md)
  bp_betonwaren: { status: 'offen' },
  bp_betonzusatzmittel: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 8, freigegeben 29.10.2026 (docs/pruefung/module-tranche-8.md)
  bp_dach_fassade: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 7, freigegeben 29.10.2026 (docs/pruefung/module-tranche-7.md)
  bp_daemmung: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 8, freigegeben 29.10.2026 (docs/pruefung/module-tranche-8.md)
  bp_farben_lacke: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 8, freigegeben 29.10.2026 (docs/pruefung/module-tranche-8.md)
  bp_glaeser: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 8, freigegeben 29.10.2026 (docs/pruefung/module-tranche-8.md)
  bp_holzprodukte: { status: 'geprueft', am: '2026-10-28' }, // Zweitprüfung, freigegeben 28.10.2026 (docs/pruefung/module-tranche-2.md)
  bp_innovationen: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 7, freigegeben 29.10.2026 (docs/pruefung/module-tranche-7.md)
  bp_klebstoffe: { status: 'offen' },
  bp_kunststoffe: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 8, freigegeben 29.10.2026 (docs/pruefung/module-tranche-8.md)
  bp_lehmbauprodukte: { status: 'offen' },
  bp_mauerwerk: { status: 'offen' },
  bp_metallisch: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 8, freigegeben 29.10.2026 (docs/pruefung/module-tranche-8.md)
  bp_mineralisch: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 8, freigegeben 29.10.2026 (docs/pruefung/module-tranche-8.md)
  bp_putz_estrich: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 8, freigegeben 29.10.2026 (docs/pruefung/module-tranche-8.md)
  bp_recht_avcp: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 7, freigegeben 29.10.2026 (docs/pruefung/module-tranche-7.md)
  bp_recht_grundlagen: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 7, freigegeben 29.10.2026 (docs/pruefung/module-tranche-7.md)
  bp_recht_konformitaet: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 7, freigegeben 29.10.2026 (docs/pruefung/module-tranche-7.md)
  bp_recht_normen: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 7, freigegeben 29.10.2026 (docs/pruefung/module-tranche-7.md)
  bp_stahlbauprofile: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 8, freigegeben 29.10.2026 (docs/pruefung/module-tranche-8.md)
  bp_trockenbau: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 8, freigegeben 29.10.2026 (docs/pruefung/module-tranche-8.md)
  bp_verkehr_asphalt: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 7, freigegeben 29.10.2026 (docs/pruefung/module-tranche-7.md)
  bp_verkehr_bahn: { status: 'offen' },
  bp_verkehr_betondecken: { status: 'offen' },
  bp_verkehr_bitumen: { status: 'offen' },
  bp_verkehr_pruefung: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 7, freigegeben 29.10.2026 (docs/pruefung/module-tranche-7.md)
  bp_verkehr_rsto: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 7, freigegeben 29.10.2026 (docs/pruefung/module-tranche-7.md)
  bp_verkehr_tiefbau: { status: 'offen' },
  bp_verkehr_tunnel: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 7, freigegeben 29.10.2026 (docs/pruefung/module-tranche-7.md)
  brandschutz: { status: 'offen' },
  bruchmechanik: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 10, freigegeben 29.10.2026 (docs/pruefung/module-tranche-10.md)
  carbonbeton: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 9, freigegeben 29.10.2026 (docs/pruefung/module-tranche-9.md)
  daemmstoffe: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 6, freigegeben 29.10.2026 (docs/pruefung/module-tranche-6.md)
  daemmung_vergleich: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 11, freigegeben 29.10.2026 (docs/pruefung/module-tranche-11.md)
  dauerhaftigkeit: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 12, freigegeben 29.10.2026 (docs/pruefung/module-tranche-12.md)
  denkmalpflege: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 12, freigegeben 29.10.2026 (docs/pruefung/module-tranche-12.md)
  dpp: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 14, freigegeben 29.10.2026 (Nachtrag; docs/pruefung/module-tranche-14.md)
  einheiten: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 4, freigegeben 29.10.2026 (docs/pruefung/module-tranche-4.md)
  emodul: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 10, freigegeben 29.10.2026 (docs/pruefung/module-tranche-10.md)
  energieausweis: { status: 'offen' },
  erdbau: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 5, freigegeben 29.10.2026 (docs/pruefung/module-tranche-5.md)
  expositionsklassen: { status: 'offen' },
  festbeton: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 9, freigegeben 29.10.2026 (docs/pruefung/module-tranche-9.md)
  festbeton_statistik: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 4, freigegeben 29.10.2026 (docs/pruefung/module-tranche-4.md)
  festigkeit: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 10, freigegeben 29.10.2026 (docs/pruefung/module-tranche-10.md)
  feuchteschutz: { status: 'offen' },
  formaenderungen: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 10, freigegeben 29.10.2026 (docs/pruefung/module-tranche-10.md)
  frischbeton: { status: 'offen' },
  gesteine: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 5, freigegeben 29.10.2026 (docs/pruefung/module-tranche-5.md)
  gips: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 5, freigegeben 29.10.2026 (docs/pruefung/module-tranche-5.md)
  glas: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 5, freigegeben 29.10.2026 (docs/pruefung/module-tranche-5.md)
  grundlagen: { status: 'offen' },
  herstellung_einbau: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 9, freigegeben 29.10.2026 (docs/pruefung/module-tranche-9.md)
  historisch: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 12, freigegeben 29.10.2026 (docs/pruefung/module-tranche-12.md)
  historische_bauprodukte: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 12, freigegeben 29.10.2026 (docs/pruefung/module-tranche-12.md)
  historische_bauweisen: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 12, freigegeben 29.10.2026 (docs/pruefung/module-tranche-12.md)
  holz: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 6, freigegeben 29.10.2026 (docs/pruefung/module-tranche-6.md)
  holzbau_bauphysik: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 10, freigegeben 29.10.2026 (docs/pruefung/module-tranche-10.md)
  holzbau_bemessung: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 1, freigegeben 29.10.2026 (docs/pruefung/module-tranche-1.md)
  holzbau_konstruktion: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 10, freigegeben 29.10.2026 (docs/pruefung/module-tranche-10.md)
  holzbau_verbindung: { status: 'offen' },
  holzbau_werkstoffe: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 10, freigegeben 29.10.2026 (docs/pruefung/module-tranche-10.md)
  holzkorrosion: { status: 'offen' },
  holzwerkstoffe: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 6, freigegeben 29.10.2026 (docs/pruefung/module-tranche-6.md)
  hydratation_folgen: { status: 'offen' },
  innenausbau: { status: 'offen' },
  innovative_werkstoffe: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 9, freigegeben 29.10.2026 (docs/pruefung/module-tranche-9.md)
  instandhaltung: { status: 'offen' },
  instandsetzung_materialien: { status: 'offen' },
  kalk: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 5, freigegeben 29.10.2026 (docs/pruefung/module-tranche-5.md)
  keramik_ziegel: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 5, freigegeben 29.10.2026 (docs/pruefung/module-tranche-5.md)
  ki_llmpraxis: { status: 'offen' },
  ki_lokal: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 14, freigegeben 29.10.2026 (Nachtrag; docs/pruefung/module-tranche-14.md)
  ki_prompting: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 14, freigegeben 29.10.2026 (Nachtrag; docs/pruefung/module-tranche-14.md)
  ki_recht_ethik: { status: 'offen' },
  ki_ressourcen: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 14, freigegeben 29.10.2026 (Nachtrag; docs/pruefung/module-tranche-14.md)
  ki_system: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 14, freigegeben 29.10.2026 (Nachtrag; docs/pruefung/module-tranche-14.md)
  ki_thesen: { status: 'offen' },
  ki_uebungen: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 14, freigegeben 29.10.2026 (Nachtrag; docs/pruefung/module-tranche-14.md)
  knicken: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 10, freigegeben 29.10.2026 (docs/pruefung/module-tranche-10.md)
  kombinationen: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 6, freigegeben 29.10.2026 (docs/pruefung/module-tranche-6.md)
  korrosion: { status: 'geprueft', am: '2026-10-28' }, // Zweitprüfung, freigegeben 28.10.2026 (docs/pruefung/module-tranche-2.md)
  korrosionsschutz_beschichtungen: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 12, freigegeben 29.10.2026 (docs/pruefung/module-tranche-12.md)
  kreislauf_dpp: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 11, freigegeben 29.10.2026 (docs/pruefung/module-tranche-11.md)
  kunststoffe: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 6, freigegeben 29.10.2026 (docs/pruefung/module-tranche-6.md)
  labor: { status: 'offen' },
  labor_sicherheit: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 15, freigegeben 29.10.2026 (Nachtrag; docs/pruefung/module-tranche-15.md)
  lca_ingenieurbau: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 11, freigegeben 29.10.2026 (docs/pruefung/module-tranche-11.md)
  lca_rechner: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 2, freigegeben 29.10.2026 nach den Entscheidungen vom 29.10. (docs/pruefung/module-tranche-2.md, Nachtrag)
  lca_regulatorik: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 11, freigegeben 29.10.2026 (docs/pruefung/module-tranche-11.md)
  lebenszyklus_kosten: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 11, freigegeben 29.10.2026 (docs/pruefung/module-tranche-11.md)
  lehm: { status: 'offen' },
  material_schaeden_gross: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 13, freigegeben 29.10.2026 (Nachtrag; docs/pruefung/module-tranche-13.md)
  materialdatenbanken: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 14, freigegeben 29.10.2026 (Nachtrag; docs/pruefung/module-tranche-14.md)
  materialitaet_architektur: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 6, freigegeben 29.10.2026 (docs/pruefung/module-tranche-6.md)
  materialkennwerte: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 4, freigegeben 29.10.2026 (docs/pruefung/module-tranche-4.md)
  materialmodelle: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 10, freigegeben 29.10.2026 (docs/pruefung/module-tranche-10.md)
  materialoptimierung: { status: 'offen' },
  materialpaesse: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 14, freigegeben 29.10.2026 (Nachtrag; docs/pruefung/module-tranche-14.md)
  mauerwerk: { status: 'offen' },
  mechanische_kenngroessen: { status: 'offen' },
  mechanische_pruefungen: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 4, freigegeben 29.10.2026 (docs/pruefung/module-tranche-4.md)
  membranen_etfe: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 6, freigegeben 29.10.2026 (docs/pruefung/module-tranche-6.md)
  messen_pruefen: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 4, freigegeben 29.10.2026 (docs/pruefung/module-tranche-4.md)
  metalle: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 5, freigegeben 29.10.2026 (docs/pruefung/module-tranche-5.md)
  metallkorrosion: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 12, freigegeben 29.10.2026 (docs/pruefung/module-tranche-12.md)
  mischungsberechnung: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 1, freigegeben 29.10.2026 nach den Entscheidungen vom 29.10. (docs/pruefung/module-tranche-1.md, Nachtrag)
  modernisierung: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 12, freigegeben 29.10.2026 (docs/pruefung/module-tranche-12.md)
  nachbehandlung: { status: 'offen' },
  nachhaltigkeit_daten_regeln: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 11, freigegeben 29.10.2026 (docs/pruefung/module-tranche-11.md)
  nawaro: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 6, freigegeben 29.10.2026 (docs/pruefung/module-tranche-6.md)
  normen_ausblick: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 15, freigegeben 29.10.2026 (Nachtrag; docs/pruefung/module-tranche-15.md)
  oekobilanz_lca: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 11, freigegeben 29.10.2026 (docs/pruefung/module-tranche-11.md)
  online_tools: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 14, freigegeben 29.10.2026 (Nachtrag; docs/pruefung/module-tranche-14.md)
  pfas_baustoffe: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 12, freigegeben 29.10.2026 (docs/pruefung/module-tranche-12.md)
  probenahme: { status: 'offen' },
  putzemoertel: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 5, freigegeben 29.10.2026 (docs/pruefung/module-tranche-5.md)
  px_bauleitung: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 15, freigegeben 29.10.2026 (Nachtrag; docs/pruefung/module-tranche-15.md)
  px_bautagebuch: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 15, freigegeben 29.10.2026 (Nachtrag; docs/pruefung/module-tranche-15.md)
  px_karriere: { status: 'offen' },
  px_planung: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 15, freigegeben 29.10.2026 (Nachtrag; docs/pruefung/module-tranche-15.md)
  px_produktion: { status: 'offen' },
  qualitaetssicherung: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 9, freigegeben 29.10.2026 (docs/pruefung/module-tranche-9.md)
  rechnung_bestand: { status: 'offen' },
  rechnung_beton: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 15, freigegeben 29.10.2026 (Nachtrag; docs/pruefung/module-tranche-15.md)
  rechnung_brandschutz: { status: 'offen' },
  rechnung_holzbau: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 15, freigegeben 29.10.2026 (Nachtrag; docs/pruefung/module-tranche-15.md)
  rechnung_mauerwerk: { status: 'offen' },
  rechnung_nachhaltigkeit: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 15, freigegeben 29.10.2026 (Nachtrag; docs/pruefung/module-tranche-15.md)
  rechnung_schallschutz: { status: 'offen' },
  rechnung_stahlbeton: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 15, freigegeben 29.10.2026 (Nachtrag; docs/pruefung/module-tranche-15.md)
  rechnung_u_wert: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 3, freigegeben 29.10.2026 (docs/pruefung/module-tranche-3.md)
  regularien: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 15, freigegeben 29.10.2026 (Nachtrag; docs/pruefung/module-tranche-15.md)
  ressourcen_umwelt: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 11, freigegeben 29.10.2026 (docs/pruefung/module-tranche-11.md)
  ressourceneffizienz: { status: 'offen' },
  rueckbau: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 12, freigegeben 29.10.2026 (docs/pruefung/module-tranche-12.md)
  schadensbilder: { status: 'offen' },
  schadreaktionen_beton: { status: 'offen' },
  schadstoffe: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 12, freigegeben 29.10.2026 (docs/pruefung/module-tranche-12.md)
  schallschutz: { status: 'offen' },
  schnellkarbonatisierung: { status: 'geprueft', am: '2026-10-28' }, // Zweitprüfung, freigegeben 28.10.2026 (docs/pruefung/module-tranche-2.md)
  lebensdauerbemessung: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 2, freigegeben 29.10.2026 nach den Entscheidungen vom 29.10. (docs/pruefung/module-tranche-2.md, Nachtrag)
  labor_potentialmessung: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 4, freigegeben 29.10.2026 (docs/pruefung/module-tranche-4.md)
  labor_auslagerung: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 4, freigegeben 29.10.2026 (docs/pruefung/module-tranche-4.md)
  labor_frischbeton: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 4, freigegeben 29.10.2026 (docs/pruefung/module-tranche-4.md)
  labor_druckfestigkeit: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 4, freigegeben 29.10.2026 (docs/pruefung/module-tranche-4.md)
  labor_moertelprismen: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 4, freigegeben 29.10.2026 (docs/pruefung/module-tranche-4.md)
  schutz_grundlagen: { status: 'offen' },
  sicherheitskonzept: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 4, freigegeben 29.10.2026 (docs/pruefung/module-tranche-4.md)
  sichtbeton: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 9, freigegeben 29.10.2026 (docs/pruefung/module-tranche-9.md)
  sommerlicher_waermeschutz: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 3, freigegeben 29.10.2026 (docs/pruefung/module-tranche-3.md)
  sonderbetone: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 9, freigegeben 29.10.2026 (docs/pruefung/module-tranche-9.md)
  sonstiges: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 6, freigegeben 29.10.2026 (docs/pruefung/module-tranche-6.md)
  spannbeton_grundlagen: { status: 'geprueft', am: '2026-10-28' }, // Zweitprüfung, freigegeben 28.10.2026 (docs/pruefung/module-tranche-2.md; Modul „spannbeton“, seit 28.10. in zwei Teilen)
  spannbeton_kennwerte: { status: 'geprueft', am: '2026-10-28' }, // Zweitprüfung, freigegeben 28.10.2026 (docs/pruefung/module-tranche-2.md; Modul „spannbeton“, seit 28.10. in zwei Teilen)
  stahl: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 5, freigegeben 29.10.2026 (docs/pruefung/module-tranche-5.md)
  stahlbau_ec3: { status: 'geprueft', am: '2026-10-28' }, // Zweitprüfung, freigegeben 28.10.2026 (docs/pruefung/module-tranche-3.md)
  stahlbeton_bemessung: { status: 'offen' },
  statistik: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 2, freigegeben 29.10.2026 (docs/pruefung/module-tranche-2.md)
  vdi6200: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 13, freigegeben 29.10.2026 (Nachtrag; docs/pruefung/module-tranche-13.md)
  waermeeigenschaften: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 11, freigegeben 29.10.2026 (docs/pruefung/module-tranche-11.md)
  weitere_organik: { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 12, freigegeben 29.10.2026 (docs/pruefung/module-tranche-12.md)
  wta: { status: 'offen' },
  'wu-bauwerke': { status: 'geprueft', am: '2026-10-29' }, // Modulprüfung Tranche 13, freigegeben 29.10.2026 (Nachtrag; docs/pruefung/module-tranche-13.md)
};
