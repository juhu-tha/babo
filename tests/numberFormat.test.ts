import { formatDeZahl, formatDeTeX, formatDeTeXWert, formatDeWert, formatDeIntl, parseDeZahl, umgruppiereDe, gruppiere, TAUSENDER_TRENNER } from '../src/utils/numberFormat';
const S = '\u202F'; // schmales geschütztes Leerzeichen
let fails = 0;
const eq = (name: string, a: string, b: string) => {
  const ok = a === b;
  if (!ok) fails++;
  console.log(`${ok ? 'OK  ' : 'FAIL'} ${name}: "${a}" (soll "${b}")`);
};
eq('Dezimalkomma', formatDeZahl(3.14159, 2), '3,14');
eq('Tausendertrennung U+202F', formatDeZahl(210000, 0), `210${S}000`);
eq('vierstellig ungegliedert (DIN 5008)', formatDeZahl(1000, 0), '1000');
eq('fünfstellig gegliedert', formatDeZahl(10000, 0), `10${S}000`);
eq('Rundung über die Grenze', formatDeZahl(9999.6, 0), `10${S}000`);
eq('Millionen negativ', formatDeZahl(-1234567.891, 2), `-1${S}234${S}567,89`);
eq('Nachkommastellen nicht gegliedert', formatDeZahl(0.123456, 6), '0,123456');
eq('feste Nachkommastellen', formatDeZahl(5, 1), '5,0');
eq('Rundung', formatDeZahl(0.125, 2), '0,13');
eq('negativ', formatDeZahl(-1.5, 1), '-1,5');
eq('String-Eingabe mit Komma', formatDeZahl('2,5', 1), '2,5');
eq('NaN → Strich', formatDeZahl(NaN, 2), '–');
eq('Infinity → Strich', formatDeZahl(Infinity, 2), '–');
eq('-Infinity → Strich', formatDeZahl(-Infinity), '–');
eq('null → Strich', formatDeZahl(null), '–');
eq('nicht-numerischer String bleibt', formatDeZahl('k. A.'), 'k. A.');
eq('TeX Dezimal', formatDeTeX(0.5, 2), '0{,}50');
eq('TeX Tausender (\\, als schmaler Abstand)', formatDeTeX(12345.678, 2), '12\\,345{,}68');
eq('TeX-Wert Tausender', formatDeTeXWert(210000), '210\\,000');
eq('TeX vierstellig', formatDeTeX(2160, 0), '2160');
eq('Wert ohne Gruppierung unter 10 000', formatDeWert(2160), '2160');
eq('Wert gegliedert ab 10 000', formatDeWert(12345.5), `12${S}345,5`);
eq('Trennzeichen-Konstante', TAUSENDER_TRENNER, '\u202F');
eq('Intl-Ersatz mit Optionen', formatDeIntl(1234567.4, { maximumFractionDigits: 0 }), `1${S}234${S}567`);
eq('Intl-Ersatz ohne Gliederung', formatDeIntl(1234567, { useGrouping: false }), '1234567');
eq('Intl-Ersatz signifikante Stellen', formatDeIntl(123456.789, { maximumSignificantDigits: 4 }), `123${S}500`);
eq('Intl-Ersatz NaN', formatDeIntl(NaN), '–');
eq('parse U+202F', String(parseDeZahl(`12${S}345,5`)), '12345.5');
eq('parse Punkt', String(parseDeZahl('12.345,5')), '12345.5');
eq('TeX NaN', formatDeTeX(NaN, 1), '\\text{–}');
eq('TeX Division durch 0', formatDeTeX(1 / 0, 1), '\\text{–}');
eq('Chart.js-Ausgabe umgruppiert', umgruppiereDe('-1.234.567,5'), `-1${S}234${S}567,5`);
eq('Chart.js-Ausgabe vierstellig', umgruppiereDe('2.500'), '2500');
eq('Chart.js-Ausgabe klein', umgruppiereDe('0,25'), '0,25');
// Wiederverwendete Formatierer (TBT 04.11.2026): Ausgabe wie toLocaleString mit denselben Optionen, auch bei Wechsel
const OPTIONEN: Intl.NumberFormatOptions[] = [{}, { maximumFractionDigits: 6 }, { minimumFractionDigits: 2, maximumFractionDigits: 2 }, { maximumFractionDigits: 0 }, { useGrouping: false }, { maximumSignificantDigits: 3 }, { minimumFractionDigits: undefined, maximumFractionDigits: 2 }];
let abweichend = 0;
for (let i = 0; i < 3000; i++) {
  const o = OPTIONEN[i % OPTIONEN.length];
  const v = (((i * 7919) % 1000) / 1000 - 0.3) * 10 ** ((i % 12) - 3);
  const alt = v.toLocaleString('de-DE', { ...o, useGrouping: false });
  if (formatDeIntl(v, o) !== (o.useGrouping === false ? alt : gruppiere(alt))) abweichend++;
}
eq('Intl-Ersatz gleich toLocaleString (3000 Werte, 7 Optionensätze)', String(abweichend), '0');
if (fails) { console.log(`${fails} FAIL`); process.exit(1); }
