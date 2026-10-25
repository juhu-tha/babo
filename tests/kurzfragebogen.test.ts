// Anonymer Kurzfragebogen (Umsetzungsplan Phase 6, AP 6.9): Semester, Validierung, Aggregation, Speicher
import fs from 'fs';
import os from 'os';
import path from 'path';
import { KF_ITEMS, KF_FREITEXT_MAX, pruefeAntwort, semesterSchluessel, semesterText, bereinigeFreitext } from '../src/data/kurzfragebogen';
import { leererSpeicher, nimmAuf, statistik, bereinigeSpeicher, ladeSpeicher, speichereSpeicher, KF_GRENZEN } from '../server/kurzfragebogen';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
console.log('--- Test: Kurzfragebogen ---');

// 1. Semester (SS 15.03.–30.09., WS 01.10.–14.03.)
const d = (j: number, m: number, t: number) => new Date(j, m - 1, t, 12);
pruefe(semesterSchluessel(d(2026, 3, 14)) === 'WS2025', '14.03.2026 → WS2025');
pruefe(semesterSchluessel(d(2026, 3, 15)) === 'SS2026', '15.03.2026 → SS2026');
pruefe(semesterSchluessel(d(2026, 9, 30)) === 'SS2026', '30.09.2026 → SS2026');
pruefe(semesterSchluessel(d(2026, 10, 1)) === 'WS2026', '01.10.2026 → WS2026');
pruefe(semesterSchluessel(d(2027, 1, 10)) === 'WS2026', '10.01.2027 → WS2026');
pruefe(semesterText('WS2026') === 'Wintersemester 2026/27', 'semesterText WS');
pruefe(semesterText('WS2099') === 'Wintersemester 2099/00', 'semesterText Jahrhundertwechsel');
pruefe(semesterText('SS2027') === 'Sommersemester 2027', 'semesterText SS');

// 2. Validierung
pruefe(KF_ITEMS.length === 5, 'genau 5 Aussagen');
const ok = pruefeAntwort({ werte: { verstaendlich: 5, navigation: 2 }, freitext: '  Gut\u0000 so!  ' });
pruefe(ok.ok && ok.antwort.werte.verstaendlich === 5 && ok.antwort.freitext === 'Gut so!', 'gültige Antwort wird bereinigt angenommen');
pruefe(pruefeAntwort({ freitext: 'Nur ein Kommentar.' }).ok, 'nur Freitext ist erlaubt');
pruefe(pruefeAntwort({ werte: { lernhilfe: 3 } }).ok, 'nur Bewertung ist erlaubt');
for (const [name, eingabe] of [
  ['leer', {}],
  ['nur Leerraum', { freitext: '   \n ' }],
  ['Wert 0', { werte: { verstaendlich: 0 } }],
  ['Wert 6', { werte: { verstaendlich: 6 } }],
  ['Kommazahl', { werte: { verstaendlich: 2.5 } }],
  ['Text als Wert', { werte: { verstaendlich: '3' } }],
  ['unbekannte Aussage', { werte: { ip: 3 } }],
  ['Zusatzfeld', { werte: { verstaendlich: 3 }, zeit: '2026-10-25T10:00' }],
  ['Freitext zu lang', { freitext: 'x'.repeat(KF_FREITEXT_MAX + 1) }],
  ['Freitext kein Text', { freitext: 42 }],
  ['Array', [1, 2, 3]],
  ['null', null],
  ['Werte als Array', { werte: [5, 5] }],
] as [string, unknown][]) pruefe(!pruefeAntwort(eingabe).ok, `abgelehnt: ${name}`);
pruefe(pruefeAntwort({ freitext: 'ä'.repeat(KF_FREITEXT_MAX) }).ok, 'genau 500 Zeichen erlaubt');
pruefe(bereinigeFreitext('a\r\n\n\n\nb\u200B') === 'a\n\nb', 'Zeilenumbrüche/unsichtbare Zeichen bereinigt');

// 3. Aggregation: nur Zählwerte, Freitexte ohne Metadaten
const s = leererSpeicher();
const a1 = pruefeAntwort({ werte: { verstaendlich: 5, lernhilfe: 4 }, freitext: 'Mehr Beispiele bitte.' });
const a2 = pruefeAntwort({ werte: { verstaendlich: 3 } });
const a3 = pruefeAntwort({ werte: { verstaendlich: 5 }, freitext: 'Dunkelmodus verbessern.' });
if (a1.ok && a2.ok && a3.ok) {
  pruefe(nimmAuf(s, a1.antwort, 'WS2026', () => 0), 'Antwort 1 aufgenommen');
  pruefe(nimmAuf(s, a2.antwort, 'WS2026'), 'Antwort 2 aufgenommen');
  pruefe(nimmAuf(s, a3.antwort, 'WS2026', () => 0), 'Antwort 3 aufgenommen');
  pruefe(nimmAuf(s, a2.antwort, 'SS2027'), 'anderes Semester aufgenommen');
  pruefe(!nimmAuf(s, a2.antwort, '2026-10-25'), 'ungültiger Semesterschlüssel abgelehnt');
} else fehler.push('Testantworten ungültig');
const ws = s.semester.WS2026;
pruefe(ws.teilnahmen === 3, `3 Teilnahmen erwartet, ${ws.teilnahmen}`);
pruefe(JSON.stringify(ws.items.verstaendlich) === '[0,0,1,0,2]', `Verteilung verstaendlich ${JSON.stringify(ws.items.verstaendlich)}`);
pruefe(JSON.stringify(ws.items.lernhilfe) === '[0,0,0,1,0]', 'Verteilung lernhilfe');
pruefe(JSON.stringify(ws.items.vertrauen) === '[0,0,0,0,0]', 'unbeantwortete Aussage bleibt 0');
pruefe(ws.freitexte.length === 2 && ws.freitexte.every(t => typeof t === 'string'), 'Freitexte als bloße Zeichenketten');
pruefe(ws.freitexte[0] === 'Dunkelmodus verbessern.', 'Freitext an zufälliger Position eingefügt (Zufall 0 → vorne)');
pruefe(Object.keys(ws).sort().join(',') === 'freitexte,items,teilnahmen', 'Semesterobjekt ohne weitere Felder');
pruefe(!/\d{4}-\d{2}-\d{2}T|\b(ip|userAgent|zeit|timestamp)\b/i.test(JSON.stringify(s)), 'Speicher enthält keine Zeitstempel oder Gerätedaten');
const st = statistik(s);
pruefe(st.semester.WS2026.items.verstaendlich.n === 3 && st.semester.WS2026.items.verstaendlich.mittelwert === 4.33, `Mittelwert ${st.semester.WS2026.items.verstaendlich.mittelwert}`);
pruefe(st.semester.WS2026.items.vertrauen.mittelwert === null, 'Mittelwert ohne Antworten = null');

// 4. Grenzen
const g = leererSpeicher();
const nur = pruefeAntwort({ werte: { verstaendlich: 1 } });
if (nur.ok) {
  for (let i = 0; i < KF_GRENZEN.semester; i++) nimmAuf(g, nur.antwort, `SS${2000 + i}`);
  pruefe(!nimmAuf(g, nur.antwort, 'SS2099'), 'Semestergrenze greift');
}

// 5. Speicher: tolerantes Einlesen, atomares Schreiben
const kaputt = bereinigeSpeicher({ semester: { WS2026: { teilnahmen: -1, items: { verstaendlich: [1, 2], fremd: [1, 1, 1, 1, 1] }, freitexte: ['ok', 5] }, hack: {} } });
pruefe(Object.keys(kaputt.semester).join() === 'WS2026', 'ungültige Semester verworfen');
pruefe(kaputt.semester.WS2026.teilnahmen === 0 && JSON.stringify(kaputt.semester.WS2026.items.verstaendlich) === '[0,0,0,0,0]' && !('fremd' in kaputt.semester.WS2026.items), 'ungültige Zählwerte verworfen');
pruefe(JSON.stringify(kaputt.semester.WS2026.freitexte) === '["ok"]', 'nur Text-Freitexte übernommen');
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'kf-'));
const datei = path.join(dir, 'unter', 'kurzfragebogen.json');
pruefe(Object.keys(ladeSpeicher(datei).semester).length === 0, 'fehlende Datei → leerer Speicher');
speichereSpeicher(datei, s);
pruefe(JSON.stringify(ladeSpeicher(datei)) === JSON.stringify(s), 'Speichern und Laden verlustfrei');
fs.writeFileSync(datei, '{kaputt', 'utf-8');
pruefe(Object.keys(ladeSpeicher(datei).semester).length === 0, 'beschädigte Datei → leerer Speicher');
fs.rmSync(dir, { recursive: true, force: true });

// 6. Server: Endpunkte, Admin-Schutz der Auswertung, keine Metadaten im Speichercode, Datei nicht im Repository
const server = fs.readFileSync('server.ts', 'utf8');
pruefe(server.includes('app.post("/api/feedback"') && /\/api\/feedback", rateLimit\(/.test(server), 'POST /api/feedback mit Anfragebegrenzung');
pruefe(/app\.get\("\/api\/feedback\/stats", \(req, res\) => \{[\s\S]{0,120}verifyToken\(bearer\(req\), adminPassword\(\)\)/.test(server), 'GET /api/feedback/stats nur mit Admin-Token');
const speicherCode = fs.readFileSync('server/kurzfragebogen.ts', 'utf8').replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '');
pruefe(!/\bDate\b|\breq\.|headers|cookie/i.test(speicherCode), 'Speichercode verwendet keine Zeit-, Anfrage- oder Cookie-Daten');
pruefe(/^laufzeitdaten\/$/m.test(fs.readFileSync('.gitignore', 'utf8')), 'laufzeitdaten/ ist in .gitignore');
pruefe(fs.readFileSync('src/modules/Datenschutz.tsx', 'utf8').includes('Anonymer Kurzfragebogen'), 'Datenschutzerklärung beschreibt den Kurzfragebogen');

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log('OK: Kurzfragebogen (Semester, Validierung, Aggregation, Speicher)');
