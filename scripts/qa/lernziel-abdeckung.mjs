#!/usr/bin/env node
/**
 * Lernziel-Abdeckung (Auftrag 03.11.2026, didaktische Konsistenz der Fachmodule):
 * Je Modul mit Lernzielen (src/data/lernziele.ts) werden abgeglichen
 *  (I) Lernziel ↔ Inhalt: Schlüsselbegriffe des Ziels im Modultext (Komponente und Importkette laut
 *      scripts/qa/kennwert-abgleich.mjs, also Modul-TSX und content/<modul>/*.json); Fundstelle = Abschnitt mit den
 *      meisten Treffern. Unter 50 % gefundener Begriffe → „ohne Inhaltsfundstelle“ (zur Sichtung).
 *  (Q) Lernziel ↔ Quiz: jede Frage der Route wird dem Lernziel mit der größten Begriffsüberdeckung zugeordnet
 *      (mindestens 2 Begriffe); dazu die gesichtete Zuordnung ZUORDNUNG_MANUELL. Bloom-Stufe der Fragen gegen die
 *      Stufe des Ziels („passend“ = gleiche oder höhere Stufe, höchstens eine Stufe darunter).
 *  (K) „Das Wichtigste“ (src/data/kurzfassung.ts): Zahlenwerte und Begriffe jedes Punkts im Modultext oder Quiz.
 *  (E) „Ausprobieren“ (src/data/erkundung.ts): in „…“ genannte Bedienelemente (Reiter, Regler, Vorgaben) im Modultext;
 *      Bezug des Auftrags zu einem Lernziel (Begriffsüberdeckung).
 * Ergebnis ist eine Prüfliste (heuristisch, kein Urteil). tests/lernzielAbdeckung.test.ts nutzt dieselben Funktionen
 * als Ratsche (Ausnahmen dort begründet).
 *
 * Aufruf:  node scripts/qa/lernziel-abdeckung.mjs                → Zusammenfassung
 *          node scripts/qa/lernziel-abdeckung.mjs --json <datei>  → alle Ergebnisse als JSON
 *          node scripts/qa/lernziel-abdeckung.mjs --modul <id>    → Einzelansicht eines Moduls
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { modulZuordnung } from './kennwert-abgleich.mjs';
import { text } from './quiz-text-abgleich.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const lies = p => fs.readFileSync(path.join(ROOT, p), 'utf8');

export const BLOOM = ['Erinnern', 'Verstehen', 'Anwenden', 'Analysieren', 'Bewerten', 'Erschaffen'];
export const rang = s => BLOOM.indexOf(s);

/**
 * Gesichtete Zuordnung Frage → Lernziel (Index ab 0), wo der Stichwortabgleich nicht trifft, die Frage das Ziel
 * aber fachlich prüft (Sichtung 03.11.2026, docs/pruefung/lernziel-abdeckung-2026-11-03.md).
 */
export const ZUORDNUNG_MANUELL = {
  // Grundlagen, Labor
  qn_normen_ausblick_3: ['normen_ausblick#1'],
  qn_labor_auslagerung_2: ['labor_auslagerung#1'],
  qn_labor_frischbeton_1: ['labor_frischbeton#2'], qn_labor_frischbeton_2: ['labor_frischbeton#2'],
  qn_labor_moertelprismen_1: ['labor_moertelprismen#2'], qn_labor_moertelprismen_2: ['labor_moertelprismen#2'], qn_labor_moertelprismen_3: ['labor_moertelprismen#2'], qn_labor_moertelprismen_5: ['labor_moertelprismen#4'],
  qn_keramik_ziegel_6: ['keramik_ziegel#5'],
  q_stb_7: ['stahlbeton_bemessung#3'],
  qn_bodenmechanik_3: ['bodenmechanik#3'], q_boden_2: ['bodenmechanik#4'], qn_bodenmechanik_4: ['bodenmechanik#4'],
  q_bstat_1: ['baustatik#3'], qn_baustatik_3: ['baustatik#3'],
  qn_baustoffkenngroessen_1: ['baustoffkenngroessen#3'], q_kg_3: ['baustoffkenngroessen#3'],
  qn_bauwerksunters_monitoring_4: ['bauwerksunters_monitoring#1'], q_ms_mo_2: ['bauwerksunters_monitoring#1'],
  qt_pruefverfahren_katalog_2: ['pruefverfahren_katalog#2'],
  qn_betonkennwerte_6: ['betonkennwerte#5'],
  // Bauprodukte
  q_bab_1: ['bp_abdichtung#2'], qn_bp_abdichtung_1: ['bp_abdichtung#2'],
  q_bbf_1: ['bp_befestigung#4'], qn_bp_befestigung_4: ['bp_befestigung#5'],
  qn_bp_daemmung_1: ['bp_daemmung#2'], q_bpd_1: ['bp_daemmung#3'], qn_bp_daemmung_2: ['bp_daemmung#4'], q_daemm_1: ['bp_daemmung#4'],
  q_bmw_2: ['bp_mauerwerk#1'], qn_bp_mauerwerk_2: ['bp_mauerwerk#1'],
  qn_bp_metallisch_1: ['bp_metallisch#2'],
  qn_bp_putz_estrich_1: ['bp_putz_estrich#1'], qn_bp_putz_estrich_4: ['bp_putz_estrich#4'],
  qn_bp_verkehr_asphalt_2: ['bp_verkehr_asphalt#2'], qn_bp_verkehr_asphalt_3: ['bp_verkehr_asphalt#2'], qn_bp_verkehr_asphalt_5: ['bp_verkehr_asphalt#3'],
  q_bps_2: ['bp_stahlbauprofile#3'],
  // Selbsttest des Nachbarreiters (BpRechtliches): AVCP-Systeme und Aufgaben der notifizierten Stelle
  q_bre_2: ['bp_recht_avcp#1'], q_bre_4: ['bp_recht_avcp#1'], qn_bp_recht_konformitaet_6: ['bp_recht_avcp#2', 'bp_recht_avcp#3'],
  // Dauerhaftigkeit, Baustoffe
  q_dh_2: ['dauerhaftigkeit#2'], qn_dauerhaftigkeit_1: ['dauerhaftigkeit#2'], qn_dauerhaftigkeit_3: ['dauerhaftigkeit#5'],
  qn_einheiten_1: ['einheiten#4'],
  q_erd_1: ['erdbau#1'], qn_erdbau_3: ['erdbau#1'],
  q_exk_1: ['expositionsklassen#2'], q_exk_6: ['expositionsklassen#2'],
  qn_festbeton_statistik_4: ['festbeton_statistik#1'], qn_festbeton_statistik_3: ['festbeton_statistik#4'],
  qn_gesteine_2: ['gesteine#5'],
  qn_herstellung_einbau_2: ['herstellung_einbau#3'],
  qn_historische_bauprodukte_2: ['historische_bauprodukte#2'],
  qn_historische_bauweisen_4: ['historische_bauweisen#5'],
  qn_holzbau_bauphysik_4: ['holzbau_bauphysik#3'], qn_holzbau_bauphysik_5: ['holzbau_bauphysik#3'],
  qn_holzbau_konstruktion_3: ['holzbau_konstruktion#2'], qn_holzbau_konstruktion_5: ['holzbau_konstruktion#2'],
  qn_holzbau_verbindung_2: ['holzbau_verbindung#2'], qn_holzbau_verbindung_3: ['holzbau_verbindung#2'], qn_holzbau_verbindung_6: ['holzbau_verbindung#2'],
  q_hw_4: ['holzbau_werkstoffe#3'],
  q_is_im_1: ['instandsetzung_materialien#1'], qn_instandsetzung_materialien_4: ['instandsetzung_materialien#1'],
  q_hol_4: ['holz#5'],
  q_knick_2: ['knicken#1'],
  qn_korrosion_3: ['korrosion#5'], q_ko_2: ['korrosion#5'],
  qn_lebenszyklus_kosten_3: ['lebenszyklus_kosten#3'], q_lk_2: ['lebenszyklus_kosten#3'],
  q_matm_2: ['materialmodelle#4'], qn_materialmodelle_4: ['materialmodelle#5'],
  q_mo_2: ['materialoptimierung#4'], qn_materialoptimierung_4: ['materialoptimierung#5'],
  q_mwk_3: ['mauerwerk#5'],
  q_mk_1: ['mechanische_kenngroessen#1'], qn_mechanische_kenngroessen_4: ['mechanische_kenngroessen#4'], q_mk_2: ['mechanische_kenngroessen#4'],
  q_mech_2: ['mechanische_pruefungen#2'], q_mech_5: ['mechanische_pruefungen#2'],
  q_met_2: ['metalle#2'], qn_metalle_2: ['metalle#2'], qn_metalle_3: ['metalle#4'],
  qn_nachbehandlung_4: ['nachbehandlung#4'],
  qn_nawaro_3: ['nawaro#4'],
  qn_oekobilanz_lca_g1: ['oekobilanz_lca#5'],
  qn_lca_regulatorik_3: ['lca_regulatorik#4'],
  qn_online_tools_1: ['online_tools#1'],
  qn_px_bautagebuch_3: ['px_bautagebuch#2'],
  qn_rechnung_bestand_1: ['rechnung_bestand#2'],
  qn_ressourcen_umwelt_4: ['ressourcen_umwelt#4'],
  qn_ressourceneffizienz_4: ['ressourceneffizienz#5'],
  qn_rueckbau_1: ['rueckbau#3'],
  qn_schadreaktionen_beton_4: ['schadreaktionen_beton#5'],
  q_son_1: ['sonstiges#1'], qn_sonstiges_2: ['sonstiges#1'], qn_sonstiges_4: ['sonstiges#4'],
  qn_spannbeton_5: ['spannbeton_kennwerte#3'], qn_spannbeton_6: ['spannbeton_kennwerte#3'], qt_spannbeton_kennwerte_1: ['spannbeton_kennwerte#3'],
  q_bst_6: ['bestand#1'],
  qn_labor_sicherheit_4: ['labor_sicherheit#1'],
  qn_ki_lokal_2: ['ki_lokal#5'], qn_ki_lokal_1: ['ki_lokal#5'],
  // Neue Fragen (Lernziel-Abdeckung 03.11.2026), die der Stichwortabgleich einem Nachbarziel zuordnet
  qlz_zfp_1: ['zfp#3'], qlz_pruefverfahren_katalog_1: ['pruefverfahren_katalog#3'], qlz_sonderbetone_1: ['sonderbetone#4'],
  qlz_mechanische_kenngroessen_1: ['mechanische_kenngroessen#5'], qlz_material_schaeden_gross_1: ['material_schaeden_gross#5'],
  qlz_stahlbeton_1: ['stahlbeton_bemessung#2'], qlz_bauwerksunters_monitoring_1: ['bauwerksunters_monitoring#5'],
};

/** Gesichtete Inhaltsfundstellen, wo der Stichwortabgleich unter 50 % bleibt (Ziel → Fundstelle) */
export const INHALT_GESICHTET = {
  'labor_moertelprismen#4': 'src/data/laborhandouts/moertelprismen.ts (Auswertung R_c nach 28 d, Klassen 32,5/42,5/52,5 mit Grenzen)',
  'festbeton_statistik#4': 'content/festbetonstatistik/FestbetonStatistik.json (Konformitätskriterien 1 und 2, Rechner)',
  'innovative_werkstoffe#4': 'src/modules/InnovativeWerkstoffe.tsx, Reiter „4. Bewehrungstechniken“ (Optionen A bis D mit Vor- und Nachteilen)',
  'px_bautagebuch#5': 'src/modules/Bautagebuch.tsx (Prüfung des Eintrags mit Punktzahl und Hinweisen je Prüfpunkt)',
};

/** Gesichteter Lernzielbezug von Ausprobieren-Aufträgen, die der Stichwortabgleich nicht zuordnet ('modul#auftrag' → Ziel-Nr.) */
export const ERKUNDUNG_BEZUG_GESICHTET = {
  'labor_moertelprismen#3': 4, 'stahlbeton_bemessung#1': 2, 'bauchemie#1': 2, 'bauchemie#2': 2, 'bauwerksdiagnose#1': 2,
  'zfp#2': 2, 'betonkennwerte#3': 4, 'dpp#2': 2, 'festigkeit#4': 5, 'holzbau_bauphysik#3': 3, 'hydratation_folgen#1': 5,
  'mischungsberechnung#1': 3, 'rechnung_u_wert#2': 3, 'schallschutz#4': 5, 'stahl#6': 5, 'baustoffkenngroessen#1': 3,
};

/** Bezeichner in „…“, die kein Bedienelement sind (Freitext-Eingaben u. Ä.) */
export const BEZEICHNER_KEIN_ELEMENT = { 'px_bautagebuch#1': ['Deckenplatte betoniert'] };

// ------------------------------------------------------------------------------------------------ Begriffe

const STOPP = new Set(`aber alle allem allen aller alles als also anhand anderen andere anderer anders auch auf aus
außer beim bei beide beiden beider beim bestimmen bis bzw dabei dafür daher damit dann daran darauf daraus darin
darunter das dass davon dazu dem den denen der deren des dessen die dies diese diesem diesen dieser dieses doch dort
durch eine einem einen einer eines einem einzelne einzelnen etwa für gegen gegenüber hinsichtlich ihre ihrem ihren
ihrer ihres indem innerhalb jede jedem jeden jeder jedes jeweils kann können sowie sich sie sind ohne oder sowohl
über unter und vom von vor während warum weil welche welchem welchen welcher welches wenn werden wie wird wobei
zum zur zwischen nach mit nicht noch nur ob oft sehr so solche solchen sowie statt unterschiedliche unterschiedlichen
verschiedene verschiedenen wesentliche wesentlichen jeweilige jeweiligen einfachen einfache eigene eigenen
erläutern beschreiben berechnen bestimmen ermitteln beurteilen bewerten unterscheiden benennen zuordnen einordnen
vergleichen analysieren anwenden auswählen begründen nennen erklären darstellen ableiten herleiten prüfen planen
untersuchen aufzeigen abschätzen auswerten entwickeln erstellen erkennen aufzählen interpretieren formulieren
durchführen protokollieren einstufen anwenden skizzieren identifizieren gliedern entwerfen diskutieren übertragen
bemessen nachweisen kontrollieren klassifizieren einschätzen charakterisieren gegenüberstellen festlegen abgrenzen
angeben ablesen vorbereiten zuweisen verknüpfen zusammenfassen erarbeiten reflektieren berücksichtigen einsetzen
nutzen verwenden anzugeben dazu geeignete geeigneten geeigneter mögliche möglichen typische typischen wichtige
wichtigsten wichtigen grundlegende grundlegenden zugehörige zugehörigen jeweils daraus folgende folgenden
anhand eines einer einem gegebene gegebenen gegebener vorgegebene vorgegebenen konkreten konkrete beispiel beispiel
beispielen beispiels bedeutung grenzen optionen geforderte geforderten fehlende unplausible korrigieren eigenen
gegebenen gegebener`.split(/\s+/).filter(Boolean));

/** Stamm eines Begriffs für den Teilzeichenkettenvergleich (Kleinschreibung, Endungen gekappt) */
export function stamm(w) {
  const k = w.toLowerCase();
  if (k.includes('_') || /[\d]/.test(k) || /^[A-ZÄÖÜ0-9]{2,}$/.test(w)) return k;
  if (k.length <= 6) { const s = k.replace(/(en|es|er|e|n|s)$/, ''); return s.length >= 4 ? s : k; }
  return k.slice(0, 7);
}

/** Schlüsselbegriffe eines Textes: Fachwörter ab 5 Buchstaben, Formelzeichen (mit _), Kürzel aus Großbuchstaben */
export function begriffe(roh) {
  const t = text(roh).replace(/[„“”"()[\]{}:;!?·=≤≥<>+*/]/g, ' ');
  const aus = new Map();
  for (const m of t.matchAll(/[\p{L}\p{N}][\p{L}\p{N}_,.\-]*[\p{L}\p{N}]|[\p{L}]/gu)) {
    let w = m[0].replace(/[.,]+$/, '');
    for (const teil of (w.includes('_') ? [w] : w.split('-'))) {
      if (!teil) continue;
      const sym = teil.includes('_');
      const kuerzel = /^[A-ZÄÖÜ][A-ZÄÖÜ0-9]{1,6}$/.test(teil) && !/^\d+$/.test(teil);
      if (/^\d+([.,]\d+)?$/.test(teil)) continue;
      if (!sym && !kuerzel && (teil.length < 5 || STOPP.has(teil.toLowerCase()))) continue;
      const s = stamm(teil);
      if (!aus.has(s)) aus.set(s, teil);
    }
  }
  return [...aus].map(([s, roh]) => ({ s, roh }));
}

const enthaelt = (klein, s) => klein.includes(s);

// ------------------------------------------------------------------------------------------------ Daten

async function ladeDaten() {
  const { tsImport } = await import('tsx/esm/api');
  const imp = p => tsImport(pathToFileURL(path.join(ROOT, p)).href, import.meta.url);
  const [{ LERNZIELE }, { KURZFASSUNG }, { ERKUNDUNG }, { quizRoute }] = await Promise.all([
    imp('src/data/lernziele.ts'), imp('src/data/kurzfassung.ts'), imp('src/data/erkundung.ts'), imp('src/data/quizZuordnung.ts'),
  ]);
  const quiz = JSON.parse(lies('src/data/quiz.json'));
  return { LERNZIELE, KURZFASSUNG, ERKUNDUNG, quizRoute, quiz };
}

function jsonAbschnitte(v, weg, aus, datei) {
  if (typeof v === 'string') aus.push({ ort: `${datei} › ${weg.join('.')}`, text: v });
  else if (Array.isArray(v)) v.forEach((x, i) => jsonAbschnitte(x, [...weg, i], aus, datei));
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) jsonAbschnitte(x, [...weg, k], aus, datei);
  return aus;
}

/** Abschnitte des Modultexts: JSON-Zeichenketten und TSX-Zeilen, je mit Ort und vereinheitlichtem Kleintext */
function abschnitte(dateien) {
  const aus = [];
  for (const d of dateien) {
    const roh = lies(d);
    if (d.endsWith('.json')) { try { jsonAbschnitte(JSON.parse(roh), [], aus, d); } catch { /* keine Fachdatei */ } }
    else roh.split('\n').forEach((z, i) => aus.push({ ort: `${d}:${i + 1}`, text: z }));
  }
  for (const a of aus) a.klein = text(a.text).toLowerCase();
  return aus;
}

const quizText = q => [q.topic, q.question, ...(q.options ?? []), q.explanation, q.gapAnalysis?.topic, q.gapAnalysis?.coreRule].filter(Boolean).join(' \n ');

// ------------------------------------------------------------------------------------------------ Analyse

/** Fundstelle eines Begriffssatzes im Modultext → { anteil, fehlend, ort, ausschnitt } */
function fundstelle(bg, absch, gesamt) {
  const gefunden = bg.filter(b => enthaelt(gesamt, b.s));
  let best = null, bestN = 0;
  // Fenster aus 3 aufeinanderfolgenden Abschnitten, damit Ziel-Begriffe über Zeilen verteilt zählen
  for (let i = 0; i < absch.length; i++) {
    const fenster = absch[i].klein + ' ' + (absch[i + 1]?.klein ?? '') + ' ' + (absch[i + 2]?.klein ?? '');
    let n = 0;
    for (const b of bg) if (enthaelt(fenster, b.s)) n++;
    if (n > bestN) { bestN = n; best = absch[i]; }
  }
  return {
    anteil: bg.length ? gefunden.length / bg.length : 1,
    fehlend: bg.filter(b => !enthaelt(gesamt, b.s)).map(b => b.roh),
    ort: best?.ort ?? '–', ausschnitt: best ? text(best.text).replace(/\s+/g, ' ').trim().slice(0, 140) : '', imFenster: bestN,
  };
}

/** Bloom-Passung einer Frage zu einem Ziel: gleiche/höhere Stufe oder höchstens eine darunter */
export const passendeStufe = (frage, ziel) => frage != null && rang(frage) >= rang(ziel) - 1;

export async function analysiere({ nurModul } = {}) {
  const { LERNZIELE, KURZFASSUNG, ERKUNDUNG, quizRoute, quiz } = await ladeDaten();
  const { einheiten } = modulZuordnung();
  const idZuEinheit = new Map(einheiten.flatMap(e => e.ids.map(id => [id, e])));
  const quizJe = new Map();
  for (const q of quiz) { const r = quizRoute(q.moduleId) ?? q.moduleId; if (!quizJe.has(r)) quizJe.set(r, []); quizJe.get(r).push(q); }
  // Routen ohne eigene Lernziele in einer Einheit mit genau einem Lernziel-Modul (Unterreiter wie biegebemessung →
  // stahlbeton_bemessung): deren Fragen zählen für dieses Modul
  for (const e of einheiten) {
    const mitLz = e.ids.filter(i => LERNZIELE[i]);
    if (mitLz.length !== 1) continue;
    for (const i of e.ids) if (!LERNZIELE[i] && quizJe.has(i)) quizJe.set(mitLz[0], [...(quizJe.get(mitLz[0]) ?? []), ...quizJe.get(i)]);
  }
  const quizById = new Map(quiz.map(q => [q.id, q]));
  const fehlerManuell = [];
  const cache = new Map();
  const module = [];
  for (const [id, lz] of Object.entries(LERNZIELE)) {
    if (nurModul && nurModul !== id) continue;
    const e = idZuEinheit.get(id);
    if (e && !cache.has(e.name)) { const a = abschnitte(e.dateien); cache.set(e.name, { a, gesamt: a.map(x => x.klein).join(' \n ') }); }
    const { a: absch, gesamt } = e ? cache.get(e.name) : { a: [], gesamt: '' };
    const fragen = quizJe.get(id) ?? [];
    const zielBg = lz.ziele.map(z => begriffe(z.text));
    // Quiz: jede Frage den Zielen mit (nahezu) größter Überdeckung zuordnen (≥ 2 Begriffe, höchstens 1 unter dem Größtwert)
    const zuordnung = lz.ziele.map(() => []);
    for (const q of fragen) {
      const qt = text(quizText(q)).toLowerCase();
      const n = zielBg.map(bg => bg.filter(b => enthaelt(qt, b.s)).length);
      const max = Math.max(0, ...n);
      if (max < 2) continue;
      n.forEach((x, i) => { if (x >= 2 && x >= max - 1) zuordnung[i].push({ id: q.id, bloom: q.bloom ?? null, treffer: x }); });
    }
    // gesichtete Zuordnung (auch Fragen anderer Routen, z. B. Selbsttest des Nachbarreiters)
    for (const [qid, ziele] of Object.entries(ZUORDNUNG_MANUELL)) {
      for (const k of ziele) {
        const [mod, nr] = k.split('#');
        if (mod !== id) continue;
        const q = quizById.get(qid);
        const i = Number(nr) - 1;
        if (!q || !zuordnung[i]) { fehlerManuell.push(`${qid} → ${k}`); continue; }
        if (!zuordnung[i].some(x => x.id === qid)) zuordnung[i].push({ id: qid, bloom: q.bloom ?? null, treffer: null, manuell: true });
      }
    }
    const ziele = lz.ziele.map((z, i) => {
      const f = fundstelle(zielBg[i], absch, gesamt);
      const qs = zuordnung[i];
      return {
        nr: i + 1, stufe: z.stufe, text: z.text, begriffe: zielBg[i].map(b => b.roh),
        inhalt: f, fragen: qs, passend: qs.filter(q => passendeStufe(q.bloom, z.stufe)).length,
      };
    });
    const hoechsteZiel = Math.max(...lz.ziele.map(z => rang(z.stufe)));
    const hoechsteFrage = Math.max(-1, ...fragen.map(q => rang(q.bloom ?? '')));
    const bloomVerteilung = Object.fromEntries(BLOOM.map(b => [b, fragen.filter(q => q.bloom === b).length]));
    // Kurzfassung: Zahlen (mit Komma/Punkt) und Begriffe je Punkt im Modultext oder Quiz
    const quizGesamt = text(fragen.map(quizText).join(' \n ')).toLowerCase();
    const kurz = (KURZFASSUNG[id] ?? []).map((p, i) => {
      const bg = begriffe(p);
      const t = text(p);
      const zahlen = [...t.matchAll(/(?<![\w,.])\d+(?:,\d+)?(?![\w])/g)].map(m => m[0]).filter(z => z.includes(',') || Number(z) >= 10);
      const formen = z => { const k = z.includes(',') ? z.replace(/0+$/, '').replace(/,$/, '') : z; return [z, z.replace(',', '.'), k, k.replace(',', '.')]; };
      const ohneZahl = zahlen.filter(z => !formen(z).some(f => gesamt.includes(f) || quizGesamt.includes(f)));
      const fehlend = bg.filter(b => !enthaelt(gesamt, b.s) && !enthaelt(quizGesamt, b.s)).map(b => b.roh);
      return { nr: i + 1, text: p, zahlenOhneFundstelle: ohneZahl, begriffeFehlend: fehlend, anteil: bg.length ? 1 - fehlend.length / bg.length : 1 };
    });
    // Erkundung: „…“-Bezeichner (Reiter, Regler, Vorgaben) im Modultext; Bezug zu einem Lernziel
    const erk = ERKUNDUNG[id];
    const auftraege = erk ? [...erk.auftraege.map(x => ({ ...x, reiter: null })), ...(erk.reiter ?? []).flatMap(r => r.auftraege.map(x => ({ ...x, reiter: r.reiter })))] : [];
    const ausprobieren = auftraege.map((x, i) => {
      const roh = `${x.frage} ${x.hinweis ?? ''}`;
      const keinElement = BEZEICHNER_KEIN_ELEMENT[`${id}#${i + 1}`] ?? [];
      const labels = [...roh.matchAll(/„([^“]{2,60})“/g)].map(m => m[1]).filter(l => !/^(ohne Abschlag)$/.test(l) && !keinElement.includes(l));
      const fehlendeLabels = labels.filter(l => {
        const k = text(l).toLowerCase();
        if (gesamt.includes(k)) return false;
        // Bezeichner mit Zusatz („Beispiel 1: XC3, vor Regen geschützt“) → erster Teil genügt
        const kopf = k.split(/[:,–(]/)[0].trim();
        return !(kopf.length >= 4 && gesamt.includes(kopf));
      });
      const bg = begriffe(`${x.frage} ${x.aufloesung}`);
      const bezug = zielBg.map(zb => zb.filter(b => bg.some(y => y.s === b.s || y.s.startsWith(b.s) || b.s.startsWith(y.s))).length);
      const besterBezug = Math.max(0, ...bezug);
      const gesichtet = ERKUNDUNG_BEZUG_GESICHTET[`${id}#${i + 1}`];
      const lernziel = besterBezug > 0 ? bezug.indexOf(besterBezug) + 1 : gesichtet ?? null;
      return { nr: i + 1, reiter: x.reiter, frage: x.frage, labels, fehlendeLabels, lernziel, bezug: besterBezug, gesichtet: besterBezug === 0 && gesichtet !== undefined };
    });
    module.push({
      id, niveau: lz.niveau, einheit: e?.name ?? null, dateien: e?.dateien.length ?? 0, fragen: fragen.length, fragenIds: fragen.map(q => q.id),
      hoechsteZiel: BLOOM[hoechsteZiel], hoechsteFrage: BLOOM[hoechsteFrage] ?? null, bloomVerteilung, ohneBloom: fragen.filter(q => !q.bloom).length,
      ziele, kurz, ausprobieren,
    });
  }
  for (const [qid, ziele] of Object.entries(ZUORDNUNG_MANUELL)) for (const k of ziele) if (!LERNZIELE[k.split('#')[0]]) fehlerManuell.push(`${qid} → ${k}`);
  module.fehlerManuell = fehlerManuell;
  return module;
}

/** Kennzahlen und Lückenlisten aus dem Analyseergebnis */
export function luecken(module) {
  const L = { manuellUngueltig: module.fehlerManuell ?? [], ohneQuiz: [], ohneInhalt: [], ohnePassendeStufe: [], hoechsteStufeOffen: [], kurzZahlen: [], erkLabels: [], erkOhneBezug: [], ohneEinheit: [] };
  for (const m of module) {
    if (!m.einheit) L.ohneEinheit.push(m.id);
    for (const z of m.ziele) {
      const k = `${m.id}#${z.nr}`;
      if (!z.fragen.length) L.ohneQuiz.push(k);
      else if (!z.passend) L.ohnePassendeStufe.push(k);
      if (m.einheit && z.inhalt.anteil < 0.5 && !INHALT_GESICHTET[k]) L.ohneInhalt.push(k);
    }
    if (m.fragen && rang(m.hoechsteFrage ?? '') < rang(m.hoechsteZiel)) L.hoechsteStufeOffen.push(m.id);
    for (const p of m.kurz) if (p.zahlenOhneFundstelle.length) L.kurzZahlen.push(`${m.id}#${p.nr}`);
    for (const a of m.ausprobieren) {
      if (a.fehlendeLabels.length) L.erkLabels.push(`${m.id}#${a.nr}`);
      if (a.lernziel === null) L.erkOhneBezug.push(`${m.id}#${a.nr}`);
    }
  }
  return L;
}

// ------------------------------------------------------------------------------------------------ Ausgabe

function einzel(m) {
  console.log(`\n=== ${m.id} (${m.niveau}, Einheit ${m.einheit ?? '–'}, ${m.dateien} Dateien, ${m.fragen} Fragen, höchste Stufe Ziel ${m.hoechsteZiel} / Quiz ${m.hoechsteFrage ?? '–'})`);
  console.log(`    Bloom Quiz: ${BLOOM.map(b => `${b.slice(0, 3)} ${m.bloomVerteilung[b]}`).join(', ')}${m.ohneBloom ? `, ohne ${m.ohneBloom}` : ''}`);
  for (const z of m.ziele) {
    console.log(`  Z${z.nr} [${z.stufe}] ${z.text}`);
    console.log(`     Inhalt ${(z.inhalt.anteil * 100).toFixed(0)} %${z.inhalt.fehlend.length ? ` (fehlt: ${z.inhalt.fehlend.join(', ')})` : ''} – ${z.inhalt.ort}`);
    console.log(`     Quiz: ${z.fragen.length ? z.fragen.map(q => `${q.id} (${q.bloom ?? '–'}${q.manuell ? ', manuell' : ''})`).join(', ') : 'KEINE'}`);
  }
  for (const p of m.kurz) if (p.zahlenOhneFundstelle.length || p.anteil < 0.6) console.log(`  K${p.nr}: Zahlen ohne Fundstelle ${p.zahlenOhneFundstelle.join(', ') || '–'}; Begriffe fehlen ${p.begriffeFehlend.join(', ') || '–'}`);
  for (const a of m.ausprobieren) if (a.fehlendeLabels.length || a.lernziel === null) console.log(`  E${a.nr}${a.reiter ? ` (${a.reiter})` : ''}: ${a.fehlendeLabels.length ? `Bezeichner nicht im Modul: ${a.fehlendeLabels.join(' | ')}` : ''}${a.lernziel === null ? ' ohne Lernzielbezug' : ''} – ${a.frage.slice(0, 90)}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const arg = n => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : undefined; };
  const nurModul = arg('--modul');
  const module = await analysiere({ nurModul });
  if (nurModul) { module.forEach(einzel); process.exit(0); }
  const L = luecken(module);
  const ziele = module.reduce((s, m) => s + m.ziele.length, 0);
  console.log(`Lernziel-Abdeckung: ${module.length} Module, ${ziele} Lernziele`);
  const st = Object.fromEntries(BLOOM.map(b => [b, module.reduce((s, m) => s + m.ziele.filter(z => z.stufe === b).length, 0)]));
  console.log(`  Bloom Lernziele: ${BLOOM.map(b => `${b} ${st[b]}`).join(', ')}`);
  for (const [k, v] of Object.entries(L)) console.log(`  ${k}: ${v.length}`);
  if (process.argv.includes('--liste')) for (const [k, v] of Object.entries(L)) console.log(`\n${k}:\n  ${v.join('\n  ')}`);
  const j = arg('--json');
  if (j) { fs.writeFileSync(j, JSON.stringify({ module, luecken: L }, null, 1)); console.log(`JSON: ${j}`); }
}
