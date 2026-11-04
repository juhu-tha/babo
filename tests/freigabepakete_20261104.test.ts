// Freigabepakete 04.11.2026 (docs/pruefung/freigabe/README.md, Abschnitt „Kleine Korrekturen“): beim Zusammenstellen
// der Pakete gefundene, eindeutige Kleinfehler. Sollwerte als Handrechnung im Test, nicht aus dem Kern übernommen.
import { readFileSync, readdirSync } from 'fs';
import { kennwerteZumAlter } from '../src/calc/hydratation';
import { KURZFASSUNG } from '../src/data/kurzfassung';
import hydFolgen from '../content/hydratationfolgen/HydratationFolgen.json';

const fehler: string[] = [];
const gilt = (ok: boolean, fall: string) => { if (!ok) fehler.push(fall); };
console.log('--- Test: Freigabepakete 04.11.2026 ---');

// 1. E-Modul nach 2 Tagen (DIN EN 1992-1-1, Gl. 3.2/3.5): E(t)/E_cm = β_cc^0,3 mit β_cc = exp(s·(1 − √(28/t)))
//    t = 2 d: 1 − √14 = −2,741657; s = 0,38 (S): exp(−1,041830)^0,3 = 0,7316; s = 0,25 (N): 0,8139; s = 0,20 (R): 0,8483
//    → „etwa 70 bis 85 %“ (vorher „70 bis 80 %“, Klasse R lag mit 85 % darüber; Hinweis Tranche 3, Nr. 5)
const hand = (s: number) => Math.pow(Math.exp(s * (1 - Math.sqrt(28 / 2))), 0.3);
for (const [s, soll] of [[0.38, 0.7316], [0.25, 0.8139], [0.2, 0.8483]] as const) {
  gilt(Math.abs(hand(s) - soll) < 5e-4, `Handrechnung s = ${s}: ${hand(s)}`);
  gilt(Math.abs(kennwerteZumAlter(s, 2, 30).ERel - soll) < 5e-4, `Kern s = ${s}: ${kennwerteZumAlter(s, 2, 30).ERel}`);
}
const kurz = (KURZFASSUNG as Record<string, readonly string[]>).hydratation_folgen ?? [];
gilt(kurz.some(p => p.includes('nach 2 Tagen bereits etwa 70 bis 85 %')), 'Kurzfassung hydratation_folgen: „70 bis 85 %“');
gilt(!kurz.some(p => p.includes('70 bis 80 %')), 'Kurzfassung hydratation_folgen: alter Bereich „70 bis 80 %“');
const txt = JSON.stringify(hydFolgen);
gilt(txt.includes('nach 2 Tagen ca. 70–85 %: 73 % bei Zement der Klasse S, 81 % bei N, 85 % bei R'), 'HydratationFolgen.json: E-Modul-Erläuterung 70–85 %');
gilt(!txt.includes('0.3-Potenzierung') && !txt.includes('ca. 70–80 % nach 2 Tagen'), 'HydratationFolgen.json: alter Text („0.3-Potenzierung“, „70–80 %“)');

// 2. Freigabepakete: je Paket die Pflichtabschnitte; keine Abschnitte „## Freigabe TT.MM.JJJJ“ (die zählt
//    tests/pruefvermerke.test.ts nur in den Befundlisten module-tranche-<n>.md)
const ordner = 'docs/pruefung/freigabe';
const pakete = readdirSync(ordner).filter(f => f.endsWith('.md') && f !== 'README.md');
gilt(pakete.length >= 50, `Freigabepakete: ${pakete.length}`);
for (const f of pakete) {
  const t = readFileSync(`${ordner}/${f}`, 'utf8');
  for (const h of ['## Zweck', '## Rechenkerne und Testabdeckung', '## Bisherige Befunde', '## Offene Normpunkte', '## Quizfragen', '## Quellen', '## Prüfschritte für die Freigabe (ca. 15 min)', '## Empfehlung'])
    gilt(t.includes(h), `${f}: Abschnitt „${h}“ fehlt`);
  gilt(/\*\*(freigabereif|freigabereif nach Klärung [^*]+|nicht freigabereif)\.\*\*/.test(t), `${f}: Empfehlung fehlt oder ungültig`);
  gilt(!/^## Freigabe \d{2}\.\d{2}\.\d{4}/m.test(t), `${f}: Abschnitt „Freigabe <Datum>“ gehört in die Befundliste`);
  const schritte = (t.split('## Prüfschritte für die Freigabe (ca. 15 min)')[1] ?? '').split('## Empfehlung')[0].match(/^\d+\. /gm) ?? [];
  gilt(schritte.length >= 5 && schritte.length <= 8, `${f}: ${schritte.length} Prüfschritte (5–8 erwartet)`);
}
const readme = readFileSync(`${ordner}/README.md`, 'utf8');
for (const f of pakete) gilt(readme.includes(`](${f})`), `README: Paket ${f} nicht verlinkt`);

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log(`OK: Freigabepakete (${pakete.length}) und Korrekturen 04.11.2026`);
