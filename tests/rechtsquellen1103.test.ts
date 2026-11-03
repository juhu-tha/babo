// Zweite Prüfrunde Rechtsquellen 03.11.2026 (docs/pruefung/rechtsquellen-2026-11-03.md): Korrekturen an
// Rechtszuordnungen, Fristen und Einstufungen in freigegebenen Modulen und deren Quizfragen.
import { readFileSync } from 'fs';
import quiz from '../src/data/quiz.json';
import checklisten from '../content/abfaelle/Checklisten.json';
import pfas from '../content/pfasbaustoffe/PfasBaustoffe.json';
import { FRISTEN_SCHWELLEN, type FristSchwelle } from '../src/data/fristenSchwellen';
import { bereite, pruefeText, leseWert } from '../scripts/qa/fristen-abgleich.mjs';

const fehler: string[] = [];
const gilt = (ok: boolean, fall: string) => { if (!ok) fehler.push(fall); };
const frage = (id: string) => (quiz as Array<Record<string, any>>).find(q => q.id === id) as Record<string, any>;
const lies = (p: string) => readFileSync(p, 'utf-8');

console.log('--- Test: Rechtsquellen 03.11.2026 ---');

// RQ-1 TrinkwV Anlage 2 Teil I: Werte unter der Bestimmungsgrenze bleiben unberücksichtigt
const p6 = frage('qn_pfas_baustoffe_6');
gilt(p6.correctIdx === 0 && /eingehalten/.test(p6.options[0]) && /unberücksichtigt/.test(p6.explanation), 'RQ-1 Quiz PFAS-20: eingehalten nach TrinkwV');
gilt(p6.verified === false && !p6.reviewer && p6.vorpruefung?.ergebnis === 'korrigiert', 'RQ-1 Quiz zurückgesetzt mit Vermerk');
gilt(/unberücksichtigt/.test(pfas.werte.derGrenzwertLiegtInnerhalb) && /untere Schranke/.test(pfas.werte.derGrenzwertLiegtInnerhalb), 'RQ-1 Modulhinweis Spanne');
gilt(/unberücksichtigt/.test(pfas.werte.trinkwv2023Anlage2), 'RQ-1 Normquelle des Rechners');
gilt(/unberücksichtigt/.test(lies('src/data/rechnerGrenzen.ts')) && /nur die untere Schranke/.test(lies('src/data/erkundung.ts')), 'RQ-1 Rechnergrenzen und Erkundung');

// RQ-2 Klimagesetz Art. 2 Abs. 1: negative Emissionen nach 2050 nur angestrebt; KSG-Sektormengen seit 2024 nicht sektorscharf
const rk = lies('src/components/ui/RechtsrahmenKompendium.tsx');
gilt(!/Rechtliche Pflicht zur Erreichung von Netto-Negativ/.test(rk) && /strebt die EU negative Emissionen an/.test(rk), 'RQ-2 Klimagesetz 2050');
gilt(!/dürfen max\. 67/.test(rk) && !/Sektor Gebäude muss bis 2030/.test(rk) && /sektorübergreifend/.test(rk), 'RQ-3 KSG Gebäudesektor');
// RQ-4 EPBD Art. 7: Eigentum öffentlicher Einrichtungen, kein „ausnahmslos“
gilt(!/ausnahmslos/i.test(rk) && !/Alle neuen öffentlichen Gebäude müssen/.test(rk) && /im Eigentum öffentlicher Einrichtungen/.test(rk), 'RQ-4 EPBD Art. 7 im Rechtsrahmen');

// RQ-5 GefStoffV: Asbestverbote seit 05.12.2024 in § 11 Abs. 1, Anhang II Nr. 1 weggefallen
const ab7 = frage('q_ab_7');
gilt(ab7.normRef === 'KrWG § 9a; GefStoffV § 11 Abs. 1' && ab7.verified === false && ab7.vorpruefung?.ergebnis === 'korrigiert', 'RQ-5 Quiz q_ab_7 Normverweis');
const refs = JSON.stringify(checklisten);
gilt(!/"GefStoffV Anhang II"/.test(refs) && /GefStoffV §§ 5a, 6, 11a/.test(refs), 'RQ-5 Checkliste Gefahrstoff-Identifikation');
gilt(/nach § 11 Abs\. 1 GefStoffV weder zerkleinert/.test(lies('src/data/kurzfassung.ts')), 'RQ-6 Kurzfassung: Verbot aus GefStoffV, nicht TRGS');
gilt(/GefStoffV § 11 Abs\. 1 \/ TRGS 519: Jede Art/.test(lies('content/bodenmaterialaufbereitung/BodenMaterialAufbereitung.json')), 'RQ-6 Boden: Verbot aus GefStoffV');

// RQ-7 TRGS 519 gliedert in Nummern; Abfälle Nr. 18, schwach gebunden Nr. 14; Anlage 3 = Sachkundelehrgang
gilt(!/TRGS 519 Abs\./.test(refs) && /TRGS 519 Nr\. 18/.test(refs) && /TRGS 519 Nr\. 8 und 14/.test(refs), 'RQ-7 TRGS-519-Verweise in der Checkliste');
gilt(/schwach gebundenem Asbest \(TRGS 519 Nr\. 14\)/.test(lies('src/data/tasks/rueckbauTasks.ts')), 'RQ-7 Aufgabe Rückbau');
// RQ-8 NachwV § 4 ist die Eingangsbestätigung
gilt(!/NachwV\) § 4"/.test(refs) && /NachwV\) §§ 3, 10, 17, 25/.test(refs), 'RQ-8 NachwV-Verweis');

// RQ-9 Gebäudetyp E: § 650o BGB besteht (abweichende Vereinbarungen); nur die Fassung des Entwurfs ist erledigt
const n2 = frage('q_ndr_2');
gilt(/§ 650o BGB-E/.test(n2.distraktorFeedback[0]) && /geltende § 650o BGB/.test(n2.distraktorFeedback[0]) && n2.verified === false, 'RQ-9 Quiz q_ndr_2');

// RQ-10 BauPVO: Art. 96 Inkrafttreten/Geltung, Art. 95 Übergang
const fs = (id: string) => FRISTEN_SCHWELLEN.find(e => e.id === id)!;
gilt(/^Art\. 96/.test(fs('BAUPVO_INKRAFT').fundstelle) && /^Art\. 96/.test(fs('BAUPVO_GELTUNG').fundstelle) && fs('BAUPVO_EAD_UEBERGANG').fundstelle.startsWith('Art. 95 Abs. 4'), 'RQ-10 BauPVO-Artikel');

// Neue Einträge der zentralen Liste: Werte und Erkennung
const w = (id: string) => fs(id).wert;
gilt(w('EBV_ANZEIGE_250') === 250 && w('EBV_VORANZEIGE_FRIST') === 4 && w('EBV_SICHERHEITSABSTAND') === 0.5 && w('EBV_LIEFERSCHEIN_5J') === 5
  && w('GEFSTOFFV_ASBEST_ANZEIGE') === 1 && w('GEFSTOFFV_ASBEST_ZULASSUNG') === 6 && w('NACHWV_REGISTER_3J') === 3 && w('TRINKWV_BLEI_FRIST') === '2026-01-12'
  && w('TRINKWV_PFAS4_AB') === '2028-01-12' && w('EBV_RC2_SULFAT') === 1000, 'neue Einträge: Sollwerte');
gilt(leseWert('vier') === 4 && leseWert('eine') === 1 && leseWert('fünf') === 5, 'Zahlwörter');
const E = bereite(FRISTEN_SCHWELLEN as FristSchwelle[]);
const erg = (t: string) => pruefeText(t, E).map(x => `${x.id}:${x.ok ? 'ok' : 'ABW'}`);
gilt(erg('RC-3: ab 250 m³ Voranzeige vier Wochen vor Beginn (§ 22 EBV).').includes('EBV_VORANZEIGE_FRIST:ok'), 'Erkennung Voranzeige richtig');
gilt(erg('Für RC-3 ab 250 m³ Voranzeige zwei Wochen vor Beginn nach § 22 EBV.').includes('EBV_VORANZEIGE_FRIST:ABW'), 'Erkennung Voranzeige falsch');
gilt(erg('Tätigkeiten mit Asbest sind spätestens zwei Woche vor Beginn anzuzeigen (§ 11a GefStoffV).').includes('GEFSTOFFV_ASBEST_ANZEIGE:ABW'), 'Erkennung Asbestanzeige falsch');
gilt(erg('Nach TrinkwV gilt die Summe PFAS-4 ab 12.01.2026.').includes('TRINKWV_PFAS4_AB:ABW'), 'Erkennung PFAS-4 falsches Datum');

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log('OK: Rechtsquellen 03.11.2026');
