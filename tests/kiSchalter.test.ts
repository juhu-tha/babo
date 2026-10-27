// KI-Funktion (Google Gemini) zentral abgeschaltet – Entscheidung Prof. Huber 27.10.2026 (src/data/kiSchalter.ts)
import fs from 'fs';
import { KI_FUNKTION_AKTIV, KI_HINWEIS_AUS } from '../src/data/kiSchalter';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
console.log('--- Test: KI-Schalter ---');

pruefe(KI_FUNKTION_AKTIV === false, 'KI-Funktion muss abgeschaltet sein (Standard „aus“)');
pruefe(/derzeit nicht verfügbar/.test(KI_HINWEIS_AUS), 'Hinweistext „KI-Funktion derzeit nicht verfügbar“');

// Server: 503 vor jeder Verarbeitung, also vor Herkunftsprüfung und Gemini-Aufruf
const server = fs.readFileSync('server.ts', 'utf8');
const route = server.slice(server.indexOf('"/api/gemini/analyze"'));
const sperre = route.indexOf('if (!KI_FUNKTION_AKTIV)');
pruefe(sperre > 0 && /status\(503\)/.test(route.slice(sperre, sperre + 200)), 'Server: /api/gemini/analyze antwortet mit 503, wenn abgeschaltet');
pruefe(sperre > 0 && sperre < route.indexOf('getGeminiClient()') && sperre < route.indexOf('gleicheHerkunft(req)'), 'Server: Sperre steht vor Herkunftsprüfung und Gemini-Aufruf');

// Oberfläche: Einwilligung, Startknopf und Ausgabe nur bei eingeschalteter KI
const ki = fs.readFileSync('src/modules/KiBaustoffe.tsx', 'utf8');
const ab = ki.indexOf('{KI_FUNKTION_AKTIV ? (');
pruefe(ab > 0 && ab < ki.indexOf('checked={hinweisBestaetigt}') && ki.indexOf('{KI_HINWEIS_AUS}') > ki.indexOf('onClick={handleRunAiPrompt}'), 'KiBaustoffe: Einwilligung und Startknopf hinter dem Schalter, sonst Hinweis');
pruefe(ki.includes('{KI_FUNKTION_AKTIV && (isLoadingAi || aiOutput) && ('), 'KiBaustoffe: Ausgabefeld hinter dem Schalter');
pruefe((ki.match(/fetch\('\/api\/gemini/g) ?? []).length === 1, 'genau ein Aufrufpunkt des KI-Endpunkts');

// Datenschutzerklärung: keine Übermittlung an Gemini, Reaktivierungstext in den Entwürfen
const ds = fs.readFileSync('src/modules/Datenschutz.tsx', 'utf8');
pruefe(ds.includes('keine Daten an Google Gemini übermittelt'), 'Datenschutz: „keine Daten an Google Gemini übermittelt“');
pruefe(!/Prompt an das Sprachmodell Google Gemini senden/.test(ds), 'Datenschutz: kein Text mehr zur aktiven Übermittlung');
pruefe(fs.readFileSync('docs/entwuerfe/datenschutz-ergaenzungen.md', 'utf8').includes('Reaktivierung der KI-Funktion'), 'Reaktivierungstext in docs/entwuerfe/datenschutz-ergaenzungen.md');

if (fehler.length) { fehler.forEach(f => console.log('FAIL', f)); process.exit(1); }
console.log('OK: KI-Funktion abgeschaltet (Oberfläche, Server, Datenschutzerklärung)');
