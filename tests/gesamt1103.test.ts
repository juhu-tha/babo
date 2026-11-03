// Gesamtgutachten 03.11.2026 (docs/review/gesamt-2026-11-03.md): direkt behobene Kleinpunkte.
// 1. Hinweis in der Seitenleiste ohne Anglizismus und Abkürzung („Nur für Lehrzwecke.“), in App und Startseiten-Schale gleich.
// 2. CI-Lauf (qa.yml) baut wie Vercel im Statik-Modus; check-bundle verlangt dann kein server.cjs (vorher brach main hier ab).
import fs from 'fs';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };

console.log('--- Test: Gesamtgutachten 03.11.2026 ---');

const app = fs.readFileSync('src/App.tsx', 'utf8');
const schale = fs.readFileSync('scripts/startschale.html', 'utf8');
pruefe(!/Disclaimer|akad\. Lehrzwecke/.test(app), 'App.tsx: „Disclaimer“/„akad. Lehrzwecke“ steht noch im Seitenleisten-Hinweis');
pruefe(!/Disclaimer|akad\. Lehrzwecke/.test(schale), 'startschale.html: alter Hinweis steht noch in der Schale');
pruefe(app.includes("'Hinweis:'") && app.includes("'Nur für Lehrzwecke.'"), 'App.tsx: neuer Hinweis fehlt');
pruefe(schale.includes('<strong>Hinweis:</strong> Nur für Lehrzwecke.'), 'startschale.html: neuer Hinweis fehlt (Schale muss dem ersten Bild von React entsprechen)');

const qa = fs.readFileSync('.github/workflows/qa.yml', 'utf8');
pruefe(/run:\s*BB_STATISCH=1 npx vite build/.test(qa), 'qa.yml: Build nicht im Statik-Modus');
pruefe(/run:\s*node scripts\/qa\/check-bundle\.mjs --statisch/.test(qa), 'qa.yml: check-bundle ohne --statisch (verlangt sonst server.cjs)');

if (fehler.length) {
  for (const f of fehler) console.log('FAIL: ' + f);
  process.exit(1);
}
console.log('OK: 6 Prüfungen');
