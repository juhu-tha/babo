// Rechenkern Material-Orientierungsrechner Putze & Mörtel (Modulprüfung Tranche 5, 28.10.2026)
import { putzbedarf, mauermoertelNormalfuge, duennbettmoertel, sackanzahl, PUTZ_VERBRAUCH, MOERTEL_GRUNDBEDARF, WANDDICKE_FAKTOR, type Putzart, type Steinformat, type Wanddicke } from '../src/calc/moertelbedarf';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (ist: number, soll: number, tol = 1e-9) => Math.abs(ist - soll) <= tol;
console.log('--- Test: Mörtelbedarf ---');

// 1. Anwendungsbeispiel im Modul (content/putzemoertel, Standardwerte): Gipsputz 50 m², 15 mm, f = 1,1 kg/(m²·mm)
//    m = 50 · 15 · 1,1 = 825 kg → 33 Säcke à 25 kg (vorher wegen 825,0000000000001 kg: 34); Wasser 0,6 · 825 = 495 l (Gipsputz, Umsetzung 29.10. T5-PM-5; vorher pauschal 0,26 → 214,5 l)
const p0 = putzbedarf({ flaeche: 50, dickeMm: 15, art: 'gips' });
pruefe(p0.gueltig && nahe(p0.masse, 825) && p0.saecke === 33 && nahe(p0.wasser, 495), `Beispiel Gipsputz ${p0.masse} kg, ${p0.saecke} Säcke`);
// 2. Quizfall qn_putzemoertel_1: 80 m², 20 mm, Kalk-Zement-Leichtputz 1,25 → 2 000 kg = 80 Säcke
const p1 = putzbedarf({ flaeche: 80, dickeMm: 20, art: 'kalkzement' });
pruefe(nahe(p1.masse, 2000) && p1.saecke === 80 && nahe(p1.wasser, 400), `Quiz 80 m² ${p1.saecke} ${p1.wasser}`);
// Wasser je Putzart (Lehrwerte): Gips 0,6, Kalkzement 0,2, Aerogel 1,0 l/kg → je 100 kg Trockenmörtel 60 / 20 / 100 l
pruefe(nahe(putzbedarf({ flaeche: 10, dickeMm: 10, art: 'aerogel' }).wasser, 28) && nahe(putzbedarf({ flaeche: 10, dickeMm: 10, art: 'zement' }).wasser, 25.6), 'Wasser je Putzart');
// 3. Normalfuge 30 m², 24 cm, NF: 30 · 30 · 2,1 = 1 890 l; 1 890 · 1,55 = 2 929,5 kg → 118 Säcke; Wasser 615,2 l
const n0 = mauermoertelNormalfuge({ flaeche: 30, wanddicke: '24.0', format: 'nf' });
pruefe(n0.gueltig && nahe(n0.liter ?? NaN, 1890) && nahe(n0.masse, 2929.5) && n0.saecke === 118 && nahe(n0.wasser, 615.2), `Normalfuge ${n0.liter} l ${n0.masse} kg ${n0.saecke}`);
// 4. Dünnbett 30 m², 30 cm: 30 · 3,0 · 1,2 = 108 kg → 5 Säcke; Wasser 28,1 l
const d0 = duennbettmoertel({ flaeche: 30, wanddickeCm: 30 });
pruefe(d0.gueltig && nahe(d0.masse, 108) && d0.saecke === 5 && nahe(d0.wasser, 28.1), `Dünnbett ${d0.masse} ${d0.saecke}`);
// 5. Grenzen: genau volle Säcke, angebrochener Sack, Fehler bei Fläche/Dicke ≤ 0
pruefe(sackanzahl(50) === 2 && sackanzahl(50.01) === 3 && sackanzahl(0) === 0 && sackanzahl(75.0000000000001) === 3, 'Sackanzahl');
pruefe(!putzbedarf({ flaeche: 0, dickeMm: 15, art: 'gips' }).gueltig && !putzbedarf({ flaeche: 10, dickeMm: 0, art: 'gips' }).gueltig, 'Putz Fehler');
pruefe(!mauermoertelNormalfuge({ flaeche: -1, wanddicke: '24.0', format: 'nf' }).gueltig && !duennbettmoertel({ flaeche: 10, wanddickeCm: NaN }).gueltig, 'Mauermörtel Fehler');
pruefe(!putzbedarf({ flaeche: 10, dickeMm: 10, art: 'unbekannt' as Putzart }).gueltig, 'unbekannte Art meldet Fehler statt Ersatzwert');

// 6. Fuzz: 1 000 Zufallseingaben ohne NaN/∞ bei gültigen Ergebnissen; Säcke · 25 ≥ Masse > (Säcke − 1) · 25
let s = 7;
const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
const arten = Object.keys(PUTZ_VERBRAUCH) as Putzart[], formate = Object.keys(MOERTEL_GRUNDBEDARF) as Steinformat[], dicken = Object.keys(WANDDICKE_FAKTOR) as Wanddicke[];
for (let i = 0; i < 1000; i++) {
  const a = Math.round(rnd() * 250 * 10) / 10;
  const r = [
    putzbedarf({ flaeche: a, dickeMm: Math.round(rnd() * 80), art: arten[i % arten.length] }),
    mauermoertelNormalfuge({ flaeche: a, wanddicke: dicken[i % dicken.length], format: formate[i % formate.length] }),
    duennbettmoertel({ flaeche: a, wanddickeCm: [11.5, 17.5, 24, 30][i % 4] }),
  ];
  for (const e of r) {
    if (!e.gueltig) continue;
    if (![e.masse, e.saecke, e.wasser].every(Number.isFinite) || e.saecke * 25 < e.masse - 0.05 || (e.saecke - 1) * 25 >= e.masse + 0.05) { pruefe(false, `Fuzz ${i}: ${JSON.stringify(e)}`); break; }
  }
}

if (fehler.length) { for (const x of fehler) console.error(`FAIL: ${x}`); process.exit(1); }
console.log('OK: Mörtelbedarf');
