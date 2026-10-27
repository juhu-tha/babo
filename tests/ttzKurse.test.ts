// TTZ-Weiterbildungspfad (Umsetzungsplan Phase 6, AP 6.3): Kursdaten, Fragenauswahl, Bestehensgrenze, PDF
import fs from 'fs';
import { TTZ_KURSE, KURS_STRAENGE, KURSQUIZ_FRAGEN, BESTEHENSGRENZE, ENTWURF_HINWEIS, BESTAETIGUNG_HINWEIS } from '../src/data/ttzKurse';
import { eindeutigeFragen, waehleKursFragen, istBestanden, prozent } from '../src/components/weiterbildung/kursQuiz';
import { erzeugeTeilnahmebestaetigung, pdfText, bereinigeName, datumText } from '../src/components/weiterbildung/teilnahmebestaetigung';
import { MODUL_BY_ID } from '../src/registry/modules';
import { istFachmodul, FACHMODULE, pruefvermerkFuer } from '../src/data/pruefvermerke';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
console.log('--- Test: TTZ-Weiterbildungspfad ---');

type Roh = { id: string; moduleId: string; question: string };
const pool = JSON.parse(fs.readFileSync('src/data/quiz.json', 'utf8')) as Roh[];

// 1. Kursdaten: 13 Kurse, vier Stränge, alle als Entwurf, Module existieren und liefern ≥ 10 verschiedene Fragen
pruefe(TTZ_KURSE.length === 13, `13 Kurse erwartet, ${TTZ_KURSE.length} vorhanden`);
pruefe(new Set(TTZ_KURSE.map(k => k.id)).size === TTZ_KURSE.length, 'Kurs-IDs nicht eindeutig');
for (const s of KURS_STRAENGE) pruefe(TTZ_KURSE.filter(k => k.strang === s.id).length >= 3, `Strang ${s.id}: weniger als 3 Kurse`);
pruefe(KURS_STRAENGE.length === 4, 'vier Stränge erwartet');
for (const k of TTZ_KURSE) {
  pruefe(k.status === 'entwurf', `${k.id}: Status muss bis zur Freigabe 'entwurf' sein`);
  pruefe(k.kind === 'weiterbildung', `${k.id}: kind 'weiterbildung' erwartet`);
  pruefe(!!k.ziel && !!k.zielgruppe && !!k.umfang && k.module.length >= 2, `${k.id}: Ziel/Zielgruppe/Umfang/Module unvollständig`);
  for (const m of k.module) {
    pruefe(MODUL_BY_ID.has(m), `${k.id}: Modul ${m} fehlt in der Registry`);
    pruefe(pool.some(f => f.moduleId === m), `${k.id}: Modul ${m} hat keine Quizfragen`);
  }
  const kursPool = eindeutigeFragen(pool.filter(f => (k.module as readonly string[]).includes(f.moduleId)));
  pruefe(kursPool.length >= KURSQUIZ_FRAGEN, `${k.id}: nur ${kursPool.length} verschiedene Fragen (≥ ${KURSQUIZ_FRAGEN} nötig)`);
}
pruefe(ENTWURF_HINWEIS === 'Entwurf – Kursliste noch nicht freigegeben', 'Entwurfshinweis geändert');
pruefe(BESTAETIGUNG_HINWEIS === 'Teilnahmebestätigung über ein Selbstlernangebot – kein Zertifikat, keine Prüfung', 'Bestätigungshinweis geändert');

// 2. Fragenauswahl: Anzahl, keine Wiederholung (ID und Text), zufällig, deterministisch mit gleichem Zufall
const testPool = [
  ...Array.from({ length: 15 }, (_, i) => ({ id: `q${i}`, question: `Frage ${i}` })),
  { id: 'q3', question: 'Duplikat-ID' },
  { id: 'qx', question: 'frage 4 ' },
];
pruefe(eindeutigeFragen(testPool).length === 15, 'eindeutigeFragen entfernt doppelte IDs/Texte nicht');
let saat = 1;
const lcg = () => { saat = (saat * 16807) % 2147483647; return (saat - 1) / 2147483646; };
for (let lauf = 0; lauf < 50; lauf++) {
  const a = waehleKursFragen(testPool, 10, lcg);
  pruefe(a.length === 10, `Auswahl liefert ${a.length} statt 10 Fragen`);
  pruefe(new Set(a.map(f => f.id)).size === 10 && new Set(a.map(f => f.question.trim().toLowerCase())).size === 10, 'Auswahl enthält Wiederholungen');
}
saat = 7; const r1 = waehleKursFragen(testPool, 10, lcg).map(f => f.id).join();
saat = 7; const r2 = waehleKursFragen(testPool, 10, lcg).map(f => f.id).join();
saat = 99; const r3 = waehleKursFragen(testPool, 10, lcg).map(f => f.id).join();
pruefe(r1 === r2, 'Auswahl mit gleichem Zufall nicht reproduzierbar');
pruefe(r1 !== r3, 'Auswahl hängt nicht vom Zufall ab');
pruefe(waehleKursFragen(testPool.slice(0, 4), 10).length === 4, 'kleiner Pool: Auswahl darf nicht mehr Fragen liefern als vorhanden');
// echter Kurspool: jede Auswahl hat KURSQUIZ_FRAGEN verschiedene Fragen
for (const k of TTZ_KURSE) {
  const a = waehleKursFragen(pool.filter(f => (k.module as readonly string[]).includes(f.moduleId)));
  pruefe(a.length === KURSQUIZ_FRAGEN && new Set(a.map(f => f.id)).size === a.length, `${k.id}: Kursauswahl fehlerhaft`);
  pruefe(a.every(f => (k.module as readonly string[]).includes(f.moduleId)), `${k.id}: Frage außerhalb der Kursmodule`);
}

// 3. Bestehensgrenze 80 %
pruefe(BESTEHENSGRENZE === 0.8, 'Bestehensgrenze 0,8 erwartet');
pruefe(istBestanden(8, 10), '8/10 muss bestanden sein');
pruefe(istBestanden(10, 10), '10/10 muss bestanden sein');
pruefe(!istBestanden(7, 10), '7/10 darf nicht bestanden sein');
pruefe(istBestanden(12, 15), '12/15 (80 %) muss bestanden sein');
pruefe(!istBestanden(11, 15), '11/15 (73 %) darf nicht bestanden sein');
pruefe(!istBestanden(4, 5), 'weniger als 10 Fragen darf nie bestanden sein');
pruefe(!istBestanden(0, 0) && !istBestanden(11, 10) && !istBestanden(-1, 10), 'ungültige Werte dürfen nicht bestehen');
pruefe(prozent(8, 10) === 80 && prozent(2, 3) === 67 && prozent(0, 0) === 0, 'prozent falsch');

// 4. PDF-Erzeugung (lokal, jsPDF)
const kurs = TTZ_KURSE[0];
const bytes = erzeugeTeilnahmebestaetigung({ kurs, name: '  Erika   Mustermann ', datum: new Date(2026, 9, 25), richtig: 9, gesamt: 10 });
const kopf = String.fromCharCode(...bytes.slice(0, 5));
pruefe(bytes instanceof Uint8Array && kopf === '%PDF-', `PDF beginnt nicht mit %PDF (${kopf})`);
const inhalt = Buffer.from(bytes).toString('latin1');
pruefe(bytes.length > 2000 && /%%EOF\s*$/.test(inhalt), 'PDF unvollständig');
pruefe(inhalt.includes('Erika Mustermann'), 'Name fehlt im PDF');
pruefe(inhalt.includes('25.10.2026'), 'Datum fehlt im PDF');
pruefe(inhalt.includes('90 %'), 'Ergebnis fehlt im PDF');
pruefe(inhalt.includes('kein Zertifikat') && inhalt.includes('keine Pr'), 'Hinweis „kein Zertifikat, keine Prüfung“ fehlt im PDF');
let ohneName = false;
try { erzeugeTeilnahmebestaetigung({ kurs, name: '   ', datum: new Date(), richtig: 9, gesamt: 10 }); } catch { ohneName = true; }
pruefe(ohneName, 'PDF ohne Name muss abgelehnt werden');
pruefe(pdfText('Łukasz – „CO₂“') === 'Lukasz - "CO2"', `pdfText: ${pdfText('Łukasz – „CO₂“')}`);
pruefe(bereinigeName('a\u0007b ' + 'x'.repeat(100)).length === 80, 'bereinigeName kürzt nicht auf 80 Zeichen');
pruefe(datumText(new Date(2026, 0, 5)) === '05.01.2026', 'datumText falsch');

// 5. Kein Fachmodul, kein Prüfvermerk
const seite = MODUL_BY_ID.get('ttz_weiterbildung');
pruefe(!!seite, 'Route ttz_weiterbildung fehlt in der Registry');
pruefe(!istFachmodul(seite) && !FACHMODULE.some(m => m.id === 'ttz_weiterbildung') && pruefvermerkFuer('ttz_weiterbildung') === undefined, 'ttz_weiterbildung darf kein Fachmodul sein');

// 6. Datenschutz: kein Web Storage, kein Netzwerkzugriff, kein direkter Import des Fragenpools
for (const d of fs.readdirSync('src/components/weiterbildung')) {
  const q = fs.readFileSync(`src/components/weiterbildung/${d}`, 'utf8');
  pruefe(!/localStorage|sessionStorage|indexedDB|document\.cookie/.test(q), `${d}: Web Storage/Cookies verboten`);
  pruefe(!/\bfetch\(|XMLHttpRequest|sendBeacon|WebSocket/.test(q), `${d}: Netzwerkzugriff verboten`);
  pruefe(!/quiz\.json|quizData/.test(q), `${d}: Fragenpool nur über quizLader laden`);
}
const quizSeite = fs.readFileSync('src/components/weiterbildung/KursQuiz.tsx', 'utf8');
pruefe(!/^import .*teilnahmebestaetigung/m.test(quizSeite) && quizSeite.includes("import('./teilnahmebestaetigung')"), 'jsPDF muss per dynamischem import() geladen werden');

if (fehler.length) {
  for (const f of fehler) console.error(`FAIL: ${f}`);
  process.exit(1);
}
console.log(`OK: ${TTZ_KURSE.length} Kurse, PDF ${bytes.length} Bytes`);
