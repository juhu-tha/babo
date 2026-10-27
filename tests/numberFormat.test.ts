import { formatDeZahl, formatDeTeX, formatDeTeXWert, formatDeWert, TAUSENDER_TRENNER } from '../src/utils/numberFormat';
let fails = 0;
const eq = (name: string, a: string, b: string) => {
  const ok = a === b;
  if (!ok) fails++;
  console.log(`${ok ? 'OK  ' : 'FAIL'} ${name}: "${a}" (soll "${b}")`);
};
eq('Dezimalkomma', formatDeZahl(3.14159, 2), '3,14');
eq('Tausenderpunkt', formatDeZahl(210000, 0), '210.000');
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
eq('TeX Tausender (Punkt wie im Fließtext)', formatDeTeX(12345.678, 2), '12.345{,}68');
eq('TeX-Wert Tausender', formatDeTeXWert(210000), '210.000');
eq('Wert ohne Gruppierung unter 10 000', formatDeWert(2160), '2160');
eq('Trennzeichen-Konstante', TAUSENDER_TRENNER, '.');
eq('TeX NaN', formatDeTeX(NaN, 1), '\\text{–}');
eq('TeX Division durch 0', formatDeTeX(1 / 0, 1), '\\text{–}');
if (fails) { console.log(`${fails} FAIL`); process.exit(1); }
