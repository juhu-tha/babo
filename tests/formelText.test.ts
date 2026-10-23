// FormulaText: HTML wird maskiert (Umsetzungsplan Phase 1, AP 1.9)
import { formelTextZuHtml } from '../src/utils/formelText';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
console.log('--- Test: FormulaText-Maskierung ---');

const boese = formelTextZuHtml('<img src=x onerror=alert(1)> f_{ck}');
pruefe(!/<img/i.test(boese), `Tag nicht maskiert: ${boese}`);
pruefe(boese.includes('&lt;img'), `Maskierung fehlt: ${boese}`);
pruefe(boese.includes('<sub>ck</sub>'), `Tiefstellung fehlt: ${boese}`);
pruefe(formelTextZuHtml('p < p_{sat}').includes('p &lt; p<sub>sat</sub>'), 'Kleiner-Zeichen falsch');
pruefe(formelTextZuHtml('A & B').includes('A &amp; B'), 'Ampersand falsch');
pruefe(formelTextZuHtml('\\approx 3{,}5').includes('≈ 3,5'), 'TeX-Ersetzung falsch');
pruefe(!/<(?!\/?(sub|sup|strong|em)>)/.test(formelTextZuHtml('"><script>x</script> **fett** m2')), 'Nur sub/sup/strong/em als Tags erlaubt');

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log('OK: Formeltext sicher');
