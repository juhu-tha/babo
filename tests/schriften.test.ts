// Schrift als Base64-Text (statt Binärdatei, wegen Google-AI-Studio-Pull): Daten gültig, Loader nicht im Einstieg
import fs from 'fs';
import { INTER_REGULAR_WOFF2, INTER_BOLD_WOFF2 } from '../src/lib/schriftDaten';

const fehler: string[] = [];
for (const [name, b64] of [['regular', INTER_REGULAR_WOFF2], ['bold', INTER_BOLD_WOFF2]] as const) {
  const bytes = Buffer.from(b64, 'base64');
  if (bytes.subarray(0, 4).toString('latin1') !== 'wOF2') fehler.push(`${name}: keine WOFF2-Signatur`);
  if (bytes.length < 20_000) fehler.push(`${name}: unplausibel klein (${bytes.length} B)`);
}
const main = fs.readFileSync('src/main.tsx', 'utf8');
if (/from '\.\/lib\/schriftDaten'/.test(main)) fehler.push('schriftDaten darf nicht statisch in main.tsx importiert werden (Einstiegs-Chunk)');
const css = fs.readFileSync('src/index.css', 'utf8');
if (/@font-face/.test(css)) fehler.push('index.css enthält wieder @font-face mit Binärdatei');
if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log('OK: Schriftdaten gültig, Laden außerhalb des Einstiegs');
