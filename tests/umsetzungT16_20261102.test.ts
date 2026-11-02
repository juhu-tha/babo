// Umsetzung der Entscheidungen vom 02.11.2026 zur Modulprüfung Tranche 16 (docs/pruefung/module-tranche-16.md,
// Abschnitte „Umsetzung 02.11.2026“, „Normtext offen“ und „Freigabe 02.11.2026“). Reine Text- und Registry-Änderungen,
// keine Rechenkerne betroffen. src/data/pruefvermerke.ts bleibt unverändert (keine Fachmodule).
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MODUL_BY_ID } from '../src/registry/modules';
import { MODUL_KERN } from '../src/registry/kern';
import { istFachmodul, pruefvermerkFuer, PRUEFVERMERKE } from '../src/data/pruefvermerke';
import { MODULE_HISTORY_DATA } from '../src/data/moduleHistoryData';
import { LERNZIELE } from '../src/data/lernziele';
import zwangInhalt from '../content/zwang/Zwang.json';
import nachhaltigkeitCl from '../content/nachhaltigkeitchecklisten/NachhaltigkeitChecklisten.json';
import dauerhaftigkeitCl from '../content/dauerhaftigkeitchecklisten/DauerhaftigkeitChecklisten.json';
import instandsetzungCl from '../content/instandsetzungchecklisten/InstandsetzungChecklisten.json';
import kiStand from '../content/ki/ueberblick/StandTab.json';
import kiAusblick from '../content/ki/ueberblick/AusblickTab.json';
import kiDaten from '../content/ki/ueberblick/daten.json';
import kiKurse from '../content/ki/KiOnlinekurse.json';
import moduleinfo from '../content/moduleinfo/daten.json';
import wta from '../content/wta/WTA.json';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fehler: string[] = [];
const gilt = (ok: boolean, fall: string) => { if (!ok) fehler.push(fall); };
const text = (o: unknown) => JSON.stringify(o);
const VORL = 'vorläufig, Normprüfung ausstehend';
console.log('--- Test: Umsetzung Tranche 16 (02.11.2026) ---');

// T16-ZW-3: Heft 555 nicht mehr als Erläuterung zur Richtlinie Massige Bauteile
const zw = text(zwangInhalt);
gilt(!zw.includes('Heft 555'), 'ZW-3: Heft 555 im Modul Zwang');
gilt(zw.includes('DAfStb-Richtlinie Massige Bauteile aus Beton (Ausgabe April 2010)'), 'ZW-3: Richtlinie Massige Bauteile als Regelwerk');

// T16-NC-2/-3 und T11-ZS-2
const nc = text(nachhaltigkeitCl);
gilt(!nc.includes('25 M.-%') && nc.includes('25 Vol.-% rezyklierter Gesteinskörnung (Projektziel'), 'NC-2: R-Beton-Anteil in Vol.-% als Projektziel');
gilt(!/Steckbrief 313/.test(nc) && nc.includes('QNG-Anhangdokument 3.1.3') && nc.includes(VORL), 'T11-ZS-2: QNG-Anhangdokument 3.1.3, Zuordnung gekennzeichnet');
const ncEintrag = MODUL_BY_ID.get('nachhaltigkeit_checklisten');
gilt(ncEintrag?.gruppe === 'Nachhaltigkeit', 'NC-3: gruppe Nachhaltigkeit in der Registry');
gilt(MODUL_KERN.get('nachhaltigkeit_checklisten')?.gruppe === 'Nachhaltigkeit', 'NC-3: Kernauszug ohne Gruppe');
gilt(!istFachmodul(ncEintrag) && pruefvermerkFuer('nachhaltigkeit_checklisten') === undefined, 'NC-3: Checkliste darf kein Fachmodul werden');

// T16-DC-2 (Normtext): gekennzeichnet
const dc = dauerhaftigkeitCl.werte.dieBetondeckungRichtetSich;
gilt(dc.includes('F.2.1/F.2.2') && dc.includes(VORL) && !dc.includes('am Normtext der Ausgabe 2023-08 prüfen'), 'DC-2: Kennzeichnung Normtext');
gilt(dc.includes('Tab. 4.4DE'), 'DC-2: c_min,dur nach EC2/NA');

// T16-IC-2 (Normtext): Einzelwert und Kürzel gekennzeichnet
gilt(instandsetzungCl.werte.mittelwertFCtm1.includes(VORL), 'IC-2: kleinster Einzelwert CFK gekennzeichnet');
const icLinks = text(instandsetzungCl);
gilt(icLinks.includes('Kürzel „BÜV“ vorläufig, Normprüfung ausstehend') && !icLinks.includes('Betonbauwerken e.V. (BÜV)'), 'IC-2: Kürzel BÜV gekennzeichnet');

// T16-KU-2: keine unbelegten Nutzenzahlen, Ausblick als Erwartung
const ku = text(kiStand) + text(kiAusblick);
for (const s of ['40% CO', '40 % CO', '80% Zeit', '80 % Zeit', 'präzise vorher', 'Millisekunden auf dem Tablet', 'mikrosekundengenau', 'Fehlerfreier Freiform', 'drastisch'])
  gilt(!ku.includes(s), `KU-2: „${s}“ im KI-Überblick`);
gilt((text(kiAusblick).match(/Erwarteter Effekt/g) ?? []).length === 4, 'KU-2: vier Ausblick-Effekte als Erwartung');
// Kernbegriffe: Vergleich klassisch/KI (roiSummary, aiAdvantage) ohne Prozent-/Faktorangaben
const vergleiche = text(kiDaten).match(/"(roiSummary|aiAdvantage)":"[^"]*"/g) ?? [];
gilt(vergleiche.length === 14, `KU-2: 14 Nutzenzeilen erwartet, gefunden ${vergleiche.length}`);
for (const v of vergleiche) gilt(!/\d\s?%|Faktor \d|\b0 unbemerkte/.test(v), `KU-2: Nutzenzeile mit Zahl – ${v.slice(0, 80)}`);

// T16-KO-2: kein Medizinkurs, technischer Kurs
const ko = text(kiKurse);
gilt(!ko.includes('Dr. med') && kiKurse.werte.kursElementsOfAi?.includes('Elements of AI'), 'KO-2: Kursangabe Elements of AI');
gilt(fs.readFileSync(path.join(ROOT, 'src/modules/ki/KiOnlinekurse.tsx'), 'utf8').includes('inhalt.werte.kursElementsOfAi'), 'KO-2: Komponente nutzt neuen Schlüssel');

// T16-MI-2 / MI-5
const hist = text(MODULE_HISTORY_DATA);
gilt(hist.includes('"era":"1970er Jahre","title":"Gründung der WTA'), 'MI-2: WTA-Gründung 1970er Jahre');
gilt(!text(moduleinfo).includes('MAWEG'), 'MI-5: MAWEG gestrichen');

// Begriff DIN 18533:2026-06 – Wasserbeanspruchungsklasse; DIN 18534 bleibt Wassereinwirkungsklasse
gilt(text(moduleinfo).includes('nach Wasserbeanspruchungsklasse W2.1-E'), 'Begriff: baustoffe_info');
gilt(text(wta).includes('seit 2026-06 „Wasserbeanspruchungsklassen“'), 'Begriff: WTA 4-6-Text mit Ausgabe');
gilt(text(LERNZIELE).includes('Wasserbeanspruchungsklasse nach DIN 18533 im Leistungsverzeichnis'), 'Begriff: Lernziel px_planung');
const quiz = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/quiz.json'), 'utf8')) as { id: string; normRef?: string; verified?: boolean; vorpruefung?: { hinweis?: string } }[];
for (const id of ['q_bab_1', 'qn_bp_abdichtung_1']) {
  const q = quiz.find(x => x.id === id);
  gilt(!!q && !text(q).includes('Wassereinwirkungsklasse'), `Begriff: Quiz ${id} angeglichen`);
  gilt(q?.verified === true && !!q?.vorpruefung?.hinweis?.includes('Begriff angeglichen 02.11.'), `Begriff: Quiz ${id} verified mit Vermerk`);
}
for (const q of quiz.filter(x => /DIN 18533/.test(x.normRef ?? '')))
  gilt(!/Wassereinwirkungsklasse/.test(text(q)) || /2017/.test(text(q)), `Begriff: Quiz ${q.id} (DIN 18533) mit altem Begriff`);
const iax = quiz.find(x => x.id === 'q_iax_3');
gilt(!!iax && text(iax).includes('Wassereinwirkungsklasse') && /18534/.test(iax.normRef ?? ''), 'Begriff: DIN 18534 behält Wassereinwirkungsklasse');
gilt(fs.readFileSync(path.join(ROOT, 'tests/begriffe.test.ts'), 'utf8').includes('Wasserbeanspruchungsklasse (DIN 18533:2026-06)'), 'Begriff: Regel in tests/begriffe.test.ts');

// Freigabe 02.11.2026 in der Befundliste, ohne Prüfvermerke
const IDS = ['kriechen', 'eigenspannungen', 'schaeden_checklisten', 'grundlagen_info', 'labor_info', 'baustoffe_info', 'instandsetzung_info', 'praxiswissen_info',
  'zwang', 'nachhaltigkeit_checklisten', 'dauerhaftigkeit_checklisten', 'instandsetzung_checklisten', 'ki_ueberblick', 'ki_onlinekurse', 'schaeden_info', 'digitales_info'];
const doku = fs.readFileSync(path.join(ROOT, 'docs/pruefung/module-tranche-16.md'), 'utf8');
const abschnitt = /^## Freigabe 02\.11\.2026\n([\s\S]*?)(?=^## |(?![\s\S]))/m.exec(doku)?.[1] ?? '';
const frei = abschnitt.split(/^Nicht freigegeben/m)[0];
for (const id of IDS) {
  gilt(new RegExp('^- `' + id + '` – Fachlich geprüft am 02\\.11\\.2026', 'm').test(frei), `Freigabe: ${id} fehlt im Abschnitt „Freigabe 02.11.2026“`);
  gilt(!(id in PRUEFVERMERKE) && pruefvermerkFuer(id) === undefined, `Freigabe: ${id} darf keinen Prüfvermerk bekommen`);
}
gilt(!/Prof\.|Huber/.test(frei), 'Freigabe: passiv ohne Namen');
gilt(/^## Normtext offen$/m.test(doku) && /T16-DC-2 \| `dauerhaftigkeit_checklisten`/.test(doku) && /T16-IC-2 \| `instandsetzung_checklisten`/.test(doku), 'Normtext offen: DC-2 und IC-2 gelistet');

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log('OK: Umsetzung Tranche 16 (02.11.2026)');
