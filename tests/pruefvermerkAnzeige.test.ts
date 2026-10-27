// Öffentliche Anzeige der Prüfvermerke (Entscheidung Prof. Huber 27.10.2026): „offen“ ausgeblendet, freigegebene sichtbar
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { PruefVermerk, vermerkOeffentlich } from '../src/components/ui/PruefVermerk';
import { PRUEFVERMERKE, type Pruefvermerk } from '../src/data/pruefvermerke';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
console.log('--- Test: Prüfvermerk-Anzeige ---');

const html = (v: Pruefvermerk) => renderToStaticMarkup(React.createElement(PruefVermerk, { vermerk: v }));
pruefe(html({ status: 'offen' }) === '', 'Status „offen“ muss leer rendern (kein „Prüfung ausstehend“)');
pruefe(/Fachlich geprüft am 01\.10\.2026 von Prof\. X/.test(html({ status: 'geprueft', am: '2026-10-01', von: 'Prof. X' })), 'freigegebenes Modul zeigt Datum und Prüfer');
pruefe(html({ status: 're-review', am: '2026-10-01', von: 'Prof. X' }).includes('Nachprüfung'), 'Nachprüfung eines freigegebenen Moduls bleibt sichtbar');
pruefe(!vermerkOeffentlich(undefined), 'ohne Vermerk keine Anzeige');
// Admin „Meine Module“ liest denselben Datenbestand – offene Vermerke bleiben dort erhalten
const alle = Object.values(PRUEFVERMERKE);
pruefe(alle.some(v => v.status === 'offen'), 'Datenbestand enthält weiterhin offene Vermerke');

if (fehler.length) { fehler.forEach(f => console.log('FAIL', f)); process.exit(1); }
console.log(`OK: Prüfvermerk-Anzeige (${alle.filter(vermerkOeffentlich).length} von ${alle.length} öffentlich sichtbar)`);
