// Lernziel-Abdeckung (Auftrag 03.11.2026, docs/pruefung/lernziel-abdeckung-2026-11-03.md): Ratsche über alle Fachmodule
// mit Lernzielen. Grundlage ist das Prüfskript scripts/qa/lernziel-abdeckung.mjs (Stichwortabgleich + gesichtete Zuordnung).
//  1. Jedes Lernziel hat mindestens eine Quizfrage (Ausnahmen begründet in AUSNAHMEN_OHNE_QUIZ; Liste darf nur kürzer werden).
//  2. Die Bloom-Stufen der Fragen eines Moduls reichen bis zur höchsten Lernzielstufe (Ausnahmen in AUSNAHMEN_HOECHSTE_STUFE).
//  3. Jedes Lernziel hat eine Inhaltsfundstelle; Zahlen in „Das Wichtigste“ stehen im Modul oder Quiz; in „…“ genannte
//     Bedienelemente der Ausprobieren-Aufträge gibt es im Modul; jeder Auftrag bezieht sich auf ein Lernziel.
//  4. Zahl der Lernziele ohne Frage auf passender Bloom-Stufe darf nicht steigen.
import { analysiere, luecken, begriffe, ZUORDNUNG_MANUELL } from '../scripts/qa/lernziel-abdeckung.mjs';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
console.log('--- Test: Lernziel-Abdeckung ---');

// 0. Erkennung
const bg = begriffe('die Karbonatisierungstiefe mit dem Wurzel-t-Gesetz berechnen und mit c_min,dur vergleichen.').map(b => b.roh);
pruefe(bg.includes('Karbonatisierungstiefe') && bg.includes('c_min,dur') && !bg.includes('berechnen'), `Begriffe erkannt (${bg.join(', ')})`);

const OFFEN = 'Frage noch nicht erstellt – Nachtrag offen (Bericht, Abschnitt „Offen“)';
const OHNE_SELBSTTEST_AZ = 'Nachschlagewerk ohne eigenen Selbsttest (kein ModulTest, nicht in MODULTEST_IN_APP); Entscheidung offen';
const OHNE_SELBSTTEST_NORMEN = 'Unterreiter von BpRechtliches ohne eigenen Selbsttest; Fragen zur Normenarbeit fehlen (Entscheidung offen)';
const PR_DICHTSTOFF = 'laufender PR Kleb-/Dichtstoff-Reiter-Umzug – Modul in dieser Runde nicht bearbeitet';
const PR_FCKIS = 'laufender PR Historische Kennwerte f_ck,is – Modul in dieser Runde nicht bearbeitet';

/** Lernziele ohne Quizfrage ('modul#ziel' → Begründung). Ratsche: Einträge nur streichen, wenn eine Frage ergänzt ist. */
const AUSNAHMEN_OHNE_QUIZ: Readonly<Record<string, string>> = {
  'beton_a_z#1': OHNE_SELBSTTEST_AZ, 'beton_a_z#2': OHNE_SELBSTTEST_AZ, 'beton_a_z#3': OHNE_SELBSTTEST_AZ, 'beton_a_z#4': OHNE_SELBSTTEST_AZ,
  'bp_recht_normen#1': OHNE_SELBSTTEST_NORMEN, 'bp_recht_normen#2': OHNE_SELBSTTEST_NORMEN, 'bp_recht_normen#3': OHNE_SELBSTTEST_NORMEN,
  'bauschaeden#1': PR_DICHTSTOFF, 'bauschaeden#3': PR_DICHTSTOFF, 'bauschaeden#4': PR_DICHTSTOFF,
  'historisch#4': PR_FCKIS,
  'bp_glaeser#5': 'Schall- und Sonnenschutzaufbauten im Modul nur knapp behandelt; vor einer Frage Inhalt oder Lernziel präzisieren',
  'korrosionsschutz_beschichtungen#2': OFFEN, 'bauchemie#1': OFFEN, 'boden_materialaufbereitung#1': OFFEN, 'bp_betonfertigteile#3': OFFEN,
  'bp_farben_lacke#1': OFFEN, 'dpp#2': OFFEN, 'ki_llmpraxis#2': OFFEN, 'ki_prompting#2': OFFEN, 'ki_system#1': OFFEN, 'kombinationen#2': OFFEN,
  'kreislauf_dpp#1': OFFEN, 'kreislauf_dpp#2': OFFEN, 'materialmodelle#1': OFFEN, 'messen_pruefen#2': OFFEN, 'online_tools#5': OFFEN,
  'ressourcen_umwelt#1': OFFEN, 'ressourceneffizienz#2': OFFEN, 'rueckbau#5': OFFEN, 'sonderbetone#2': OFFEN, 'sonderbetone#3': OFFEN,
  'bp_beton#1': OFFEN, 'nachhaltigkeit_daten_regeln#1': OFFEN, 'schadensbilder#4': OFFEN, 'ki_ressourcen#1': OFFEN,
};

const STUFE_OFFEN = 'Frage auf der höchsten Lernzielstufe noch nicht erstellt – Nachtrag offen';
/** Module, deren Fragen die höchste Lernzielstufe nicht erreichen (Modul → Begründung). Ratsche wie oben. */
const AUSNAHMEN_HOECHSTE_STUFE: Readonly<Record<string, string>> = {
  mischungsberechnung: 'höchste Stufe „Erschaffen“ (Mischungsentwurf) ist im Auswahlformat nicht prüfbar; Entwurf im Rechner',
  historisch: PR_FCKIS,
  ...Object.fromEntries(['membranen_etfe', 'altholz_urban_mining', 'pfas_baustoffe', 'stahlbeton_bemessung', 'bauphysik', 'betonpraxis',
    'bp_farben_lacke', 'bp_innovationen', 'denkmalpflege', 'holz', 'hydratation_folgen', 'innenausbau', 'kalk', 'kombinationen',
    'materialitaet_architektur', 'labor', 'mechanische_pruefungen', 'oekobilanz_lca', 'stahl', 'materialkennwerte', 'regularien', 'analytik',
    'daemmstoffe', 'bp_stahlbauprofile', 'waermeeigenschaften', 'brandschutz', 'nachhaltigkeit_daten_regeln', 'schadensbilder', 'wta',
    'materialdatenbanken', 'bp_recht_grundlagen', 'holzbau_werkstoffe'].map(m => [m, STUFE_OFFEN])),
};

/** Ausprobieren-Aufträge ohne Lernzielbezug ('modul#auftrag' → Begründung) */
const AUSNAHMEN_ERKUNDUNG: Readonly<Record<string, string>> = {
  'instandhaltung#2': 'Chloridrechner des Moduls ohne eigenes Lernziel (fünf Lernziele vergeben); Lernzielfassung offen',
};

/** Ratsche: Lernziele mit Frage, aber keiner auf passender Bloom-Stufe (Stand 03.11.2026) */
const MAX_OHNE_PASSENDE_STUFE = 62;

const module = await analysiere();
const L = luecken(module);
pruefe(module.length >= 190, `nur ${module.length} Module analysiert`);
pruefe(L.ohneEinheit.length === 0, `Module ohne Komponente/Inhalt: ${L.ohneEinheit.join(', ')}`);
pruefe(L.manuellUngueltig.length === 0, `gesichtete Zuordnung verweist ins Leere: ${L.manuellUngueltig.join(', ')}`);
for (const qid of Object.keys(ZUORDNUNG_MANUELL)) pruefe(/^q[a-z0-9_]+$/.test(qid), `ZUORDNUNG_MANUELL: ungültige Fragen-ID ${qid}`);

// 1. Lernziel ↔ Quiz
for (const k of L.ohneQuiz) pruefe(k in AUSNAHMEN_OHNE_QUIZ, `${k}: Lernziel ohne Quizfrage (Frage ergänzen oder begründete Ausnahme)`);
for (const k of Object.keys(AUSNAHMEN_OHNE_QUIZ)) pruefe(L.ohneQuiz.includes(k), `${k}: hat jetzt eine Quizfrage – aus AUSNAHMEN_OHNE_QUIZ streichen (Ratsche)`);

// 2. höchste Lernzielstufe im Quiz
for (const m of L.hoechsteStufeOffen) pruefe(m in AUSNAHMEN_HOECHSTE_STUFE, `${m}: keine Frage auf der höchsten Lernzielstufe`);
for (const m of Object.keys(AUSNAHMEN_HOECHSTE_STUFE)) pruefe(L.hoechsteStufeOffen.includes(m), `${m}: erreicht jetzt die höchste Stufe – aus AUSNAHMEN_HOECHSTE_STUFE streichen (Ratsche)`);

// 3. Inhalt, Kurzfassung, Ausprobieren
pruefe(L.ohneInhalt.length === 0, `Lernziele ohne Inhaltsfundstelle: ${L.ohneInhalt.join(', ')}`);
pruefe(L.kurzZahlen.length === 0, `„Das Wichtigste“ mit Zahlen ohne Fundstelle im Modul: ${L.kurzZahlen.join(', ')}`);
pruefe(L.erkLabels.length === 0, `Ausprobieren mit Bedienelement, das im Modul nicht vorkommt: ${L.erkLabels.join(', ')}`);
for (const k of L.erkOhneBezug) pruefe(k in AUSNAHMEN_ERKUNDUNG, `${k}: Ausprobieren-Auftrag ohne Lernzielbezug`);
for (const k of Object.keys(AUSNAHMEN_ERKUNDUNG)) pruefe(L.erkOhneBezug.includes(k), `${k}: hat jetzt einen Lernzielbezug – aus AUSNAHMEN_ERKUNDUNG streichen`);

// 4. Bloom-Passung je Lernziel
pruefe(L.ohnePassendeStufe.length <= MAX_OHNE_PASSENDE_STUFE, `${L.ohnePassendeStufe.length} Lernziele ohne Frage auf passender Stufe (Grenze ${MAX_OHNE_PASSENDE_STUFE})`);

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
const ziele = module.reduce((s, m) => s + m.ziele.length, 0);
console.log(`OK: ${module.length} Module, ${ziele} Lernziele; ohne Quizfrage ${L.ohneQuiz.length} (begründet), höchste Stufe offen ${L.hoechsteStufeOffen.length}, ohne passende Stufe ${L.ohnePassendeStufe.length}`);
