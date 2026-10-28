// Ratsche Tausendertrennung (Entscheidung 28.10.2026, DIN 5008/DIN 1333): Anzeigetexte gliedern mit U+202F,
// ein Tausenderpunkt oder normales Leerzeichen als Trenner wird gemeldet (Grenze 0). Prüft die Erkennung an
// Beispielen (Treffer und Ausnahmen) und den Gesamtbestand des Repos.
import { pruefeText, scanne, GRENZE } from '../scripts/qa/zahlformat-tausender.mjs';

let fails = 0;
const fall = (name: string, text: string, sollTreffer: boolean) => {
  const n = (pruefeText(text) as string[]).length;
  const ok = sollTreffer ? n > 0 : n === 0;
  if (!ok) fails++;
  console.log(`${ok ? 'OK  ' : 'FAIL'} ${name}: ${n} Befund(e) in „${text}“`);
};
const S = ' ';

// Treffer
fall('Tausenderpunkt fünfstellig', 'Kredit bis 100.000 Euro je Wohneinheit', true);
fall('Tausenderpunkt vierstellig (soll ungegliedert sein)', 'bis 1.500 €/m²', true);
fall('Millionen mit Punkten', 'rund 1.234.567 t pro Jahr', true);
fall('vierstellig mit U+202F', `Rohdichte 2${S}400 kg/m³`, true);
fall('vierstellig in KaTeX mit \\,', String.raw`\rho = 2\,400\,\text{kg/m}^3`, true);
fall('normales Leerzeichen als Trenner', 'E-Modul 210 000 N/mm²', true);

// keine Treffer
fall('KaTeX fünfstellig mit \\,', String.raw`E = 210\,000\,\text{N/mm}^2`, false);
fall('KaTeX vierstellig ungegliedert, Einheitenabstand', String.raw`\rho = 2400\,\text{kg/m}^3`, false);
fall('U+202F korrekt', `E-Modul 210${S}000 N/mm²`, false);
fall('vierstellig ungegliedert', 'Rohdichte 2400 kg/m³', false);
fall('Dezimalkomma', 'λ = 0,035 W/(m·K)', false);
fall('Normnummer', 'nach DIN 1045-2 und DIN EN 206', false);
fall('Normnummer mit Punkt', 'siehe DIN 4108.100 (fiktiv)', false);
fall('Datum', 'Stand 28.10.2026', false);
fall('Paragraf', 'gemäß § 1.000 (fiktiv)', false);
fall('Version', 'Version 2.100 (fiktiv)', false);
fall('URL', 'https://example.org/seite/100.000', false);
fall('Zahlenfolge Prüfalter', 'Prüfalter 7 28 90 Tage', false);

// Gesamtbestand (Ratsche)
const { befunde } = scanne() as { befunde: string[]; locale: number };
const okBestand = befunde.length <= GRENZE;
if (!okBestand) { fails++; befunde.slice(0, 20).forEach((b) => console.log('  ' + b)); }
console.log(`${okBestand ? 'OK  ' : 'FAIL'} Bestand: ${befunde.length} Befunde (Grenze ${GRENZE})`);

if (fails) { console.log(`${fails} FAIL`); process.exit(1); }
