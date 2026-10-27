// Kennzeichnung nicht fachlich freigegebener Quizfragen (Gutachten 27.10.2026 abends, Maßnahme 2)
import fs from 'fs';
import path from 'path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { FreigabeEtikett } from '../src/components/quiz/FreigabeEtikett';
import { ETIKETT_UNGEPRUEFT, istFachlichFreigegeben, anzahlFreigegeben } from '../src/data/quizModell';
import { QUIZ_QUESTIONS } from '../src/data/quizData';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
console.log('--- Test: Quiz-Freigabeetikett ---');

// 1. Nur verified === true gilt als freigegeben (fehlend oder false = ungeprüft)
pruefe(istFachlichFreigegeben({ verified: true }), 'verified: true muss freigegeben sein');
pruefe(!istFachlichFreigegeben({ verified: false }), 'verified: false darf nicht freigegeben sein');
pruefe(!istFachlichFreigegeben({}), 'fehlendes verified darf nicht als freigegeben gelten');
pruefe(anzahlFreigegeben([{ verified: true }, { verified: false }, {}]) === 1, 'anzahlFreigegeben zählt nur verified === true');

// 2. Etikett: Text (nicht nur Farbe), Symbol für Screenreader ausgeblendet
const html = (v?: boolean) => renderToStaticMarkup(React.createElement(FreigabeEtikett, { frage: { verified: v } }));
pruefe(html(true) === '', 'freigegebene Frage zeigt kein Etikett');
pruefe(html(false).includes(ETIKETT_UNGEPRUEFT), 'ungeprüfte Frage zeigt den Text des Etiketts');
pruefe(html(undefined).includes(ETIKETT_UNGEPRUEFT), 'Frage ohne verified zeigt das Etikett');
pruefe(/aria-hidden="true"/.test(html(false)), 'Symbol im Etikett muss aria-hidden sein');
pruefe(ETIKETT_UNGEPRUEFT === 'noch nicht fachlich freigegeben', 'Etikettentext geändert – Doku/Erklärungen nachziehen');

// 3. Alle Fragedarstellungen nutzen dieselbe Komponente
for (const datei of ['src/components/quiz/ModulTest.tsx', 'src/components/quiz/InteractiveQuizSystem.tsx', 'src/components/klausur/KlausurSimulator.tsx']) {
  const src = fs.readFileSync(path.resolve(datei), 'utf8');
  pruefe(/<FreigabeEtikett frage=\{/.test(src), `${datei}: FreigabeEtikett fehlt`);
  pruefe(!/verified !== false/.test(src), `${datei}: eigene Freigabelogik statt istFachlichFreigegeben`);
}

// 4. Pool: Zählung plausibel
const frei = anzahlFreigegeben(QUIZ_QUESTIONS);
pruefe(frei > 0 && frei <= QUIZ_QUESTIONS.length, 'Anzahl freigegebener Fragen unplausibel');

if (fehler.length) { fehler.forEach(f => console.log('FAIL', f)); process.exit(1); }
console.log(`OK: Quiz-Freigabeetikett (${frei} von ${QUIZ_QUESTIONS.length} Fragen freigegeben, übrige gekennzeichnet)`);
