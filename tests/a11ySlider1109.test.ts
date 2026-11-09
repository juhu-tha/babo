// a11y 09.11.2026, Folgeauftrag aus #330 (docs/pruefung/a11y-slider-2026-11-09.md): Klartext für Regler.
// reglerName/reglerEinheit machen aus Inline-Markdown-Beschriftungen reinen Text für aria-label/aria-valuetext;
// Stichproben prüfen, dass die Schwerpunktdateien Name und Wert mit Einheit (deutsch formatiert) tragen.
import fs from 'node:fs';
import { reglerName, reglerEinheit, texKlartext } from '../src/lib/reglerName';
import { formatDeWert } from '../src/utils/numberFormat';

const fehler: string[] = [];
const gilt = (ok: boolean, fall: string) => { if (!ok) fehler.push(fall); };
console.log('--- Test: a11y Regler-Klartext 09.11.2026 ---');

gilt(reglerName('Karbonatisierungstiefe d_k:') === 'Karbonatisierungstiefe d_k', 'reglerName: Doppelpunkt am Ende entfällt');
gilt(reglerName('Druckfestigkeit $f_{ck}$ (**Soll**):') === 'Druckfestigkeit fck (Soll)', `reglerName: Formel und Fett (${reglerName('Druckfestigkeit $f_{ck}$ (**Soll**):')})`);
gilt(reglerName('Zeile<br>zwei') === 'Zeile zwei', 'reglerName: Umbruch als Leerzeichen');
gilt(texKlartext('\\Delta t_{\\text{eff}}') === 'Δ teff', `texKlartext: Griechisch und \\text (${texKlartext('\\Delta t_{\\text{eff}}')})`);
gilt(texKlartext('\\sigma_{c} \\le 0') === 'σc ≤ 0', 'texKlartext: Operatoren');
gilt(reglerEinheit(' N/mm² (Soll: ') === ' N/mm² (Soll: ', 'reglerEinheit: Leerraum und Doppelpunkt bleiben');
gilt(reglerEinheit(' $\\cdot 10^{-12}$ m²/s') === ' · 10-12 m²/s', `reglerEinheit: Formel (${reglerEinheit(' $\\cdot 10^{-12}$ m²/s')})`);
gilt(formatDeWert(12500) === '12 500', 'Tausender ab 5 Stellen mit U+202F');

// Stichproben in den Schwerpunktdateien (Name + Wert mit Einheit)
const PROBEN: Record<string, RegExp[]> = {
  'src/modules/bauwerksuntersuchung/PruefverfahrenSimulatoren.tsx': [/aria-label=\{reglerName\(inhalt\.texte\.karbonatisierungstiefeDK\)\}\s+aria-valuetext=\{`\$\{formatDeWert\(carbDepth\)\} mm`\}/],
  'src/modules/HistorischeBauweisen.tsx': [/aria-valuetext=\{`Ø \$\{formatDeWert\(tieRodDiameter\)\} mm`\}/],
  'src/modules/MechanischePruefungen.tsx': [/aria-valuetext=\{`\$\{formatDeZahl\(woodBendingForce, 1\)\} kN`\}/],
  'src/modules/beispielrechnungen/RechnungBeton.tsx': [/aria-valuetext=\{`\$\{formatDeWert\(tempCement\)\} °C`\}/],
  'src/modules/beispielrechnungen/RechnungNachhaltigkeit.tsx': [/aria-valuetext=\{`\$\{formatDeWert\(durabilityYears\)\} Jahre`\}/],
  'src/modules/BpStahlbauprofile.tsx': [/aria-label=\{inhalt\.werte\.normalkraftNEd\}\s+type="range"/],
};
for (const [d, res] of Object.entries(PROBEN)) {
  const s = fs.readFileSync(d, 'utf8');
  for (const re of res) gilt(re.test(s), `${d}: ${re.source.slice(0, 60)} fehlt`);
}
// keine HTML-Entitäten oder Roh-Markdown im Klartext
for (const d of Object.keys(PROBEN)) {
  const s = fs.readFileSync(d, 'utf8');
  gilt(!/aria-valuetext=\{`[^`]*&[a-z]+;/.test(s), `${d}: HTML-Entität in aria-valuetext`);
}

// Überschriftenfolge zur Laufzeit (scripts/qa/a11y-ueberschriften.mjs): angehobene Ebenen behalten ihr Aussehen
const css = fs.readFileSync('src/index.css', 'utf8');
gilt(/h3:where\(\.wie-h5\) \{\s*font-size: 0\.875rem !important;/.test(css), 'index.css: h3.wie-h5 wie h5');
gilt(/p:where\(\.wie-h4\) \{\s*font-size: 0\.9375rem !important;/.test(css) && /\.dark p:where\(\.wie-h4\) \{\s*color: #e2e8f0 !important;/.test(css), 'index.css: p.wie-h4 wie h4 (hell/dunkel)');
gilt(/h5:where\(\.wie-h6\.text-xs\)/.test(css), 'index.css: h5.wie-h6 mit eigener Schriftgröße');
gilt(css.indexOf('h3:where(.wie-h5)') > css.lastIndexOf('\nh5 {'), 'index.css: Regeln nach der h5-Regel');
gilt(/ebene === 3 \? 'h3' : 'h4'/.test(fs.readFileSync('src/components/ui/Querverweis.tsx', 'utf8')), 'Querverweis: Ebene wählbar');
gilt(/<KlausurSimulator ebene=\{2\} \/>/.test(fs.readFileSync('src/modules/Aufgaben.tsx', 'utf8')), 'Aufgaben: Klausur direkt unter dem Seitentitel als h2');
gilt(fs.existsSync('scripts/qa/a11y-ueberschriften.mjs'), 'Laufzeitprüfung der Überschriftenfolge vorhanden');
// Slider: eindeutige Kennung auch bei gleicher oder leerer Beschriftung
gilt(/'slider-' \+ label\.toLowerCase\(\)\.replace\(\/\[\^a-z0-9\]\/g, '-'\) \+ '-' \+ eindeutig/.test(fs.readFileSync('src/components/ui/Slider.tsx', 'utf8')), 'Slider: Kennung mit useId-Anhang');

if (fehler.length) { fehler.forEach(f => console.error('FAIL: ' + f)); process.exit(1); }
console.log('OK: a11y Regler-Klartext 09.11.2026');
