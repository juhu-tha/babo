// Rechenkern Einheitenumrechnung: Bezugswerte, Rundreise jeder Umrechnung, Plausibilität (AP 4.2)
import { EINHEITEN, GROESSENARTEN, umrechnen, umrechnung, PFUND_KRAFT, PSI, type Groessenart } from '../src/calc/einheiten';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const relNahe = (ist: number, soll: number, tol = 1e-12) => Math.abs(ist - soll) <= tol * Math.max(1, Math.abs(soll));
console.log('--- Test: Einheiten ---');

// 1. Bezugswerte (exakte Definitionen nach NIST SP 811, Anhang B; SI-Broschüre BIPM)
const fall = (art: Groessenart, wert: number, von: string, nach: string, soll: number, tol = 1e-12) =>
  pruefe(relNahe(umrechnen(wert, art, von, nach), soll, tol), `${wert} ${von} → ${nach}: ${umrechnen(wert, art, von, nach)} statt ${soll}`);
fall('Länge', 1, 'in (Zoll)', 'mm', 25.4);
fall('Länge', 1, 'ft (Fuß)', 'in (Zoll)', 12);
fall('Länge', 1.5, 'km', 'cm', 150000);
fall('Fläche', 1, 'ha (Hektar)', 'm²', 10000);
fall('Fläche', 1, 'km²', 'a (Ar)', 10000);
fall('Volumen', 1, 'm³', 'dm³', 1000);
fall('Volumen', 1, 'dm³', 'cm³', 1000);
fall('Kraft', 1, 'lbf', 'N', 4.4482216152605);
fall('Kraft', 1, 'MN', 'kN', 1000);
fall('Spannung/Druck', 1, 'MPa (N/mm²)', 'bar', 10);
fall('Spannung/Druck', 1, 'psi', 'Pa (N/m²)', 6894.757293168361, 1e-12);
fall('Spannung/Druck', 1000, 'psi', 'MPa (N/mm²)', 6.894757293168361);
fall('Masse', 1, 'lb (Pfund)', 'g', 453.59237);
fall('Dichte', 2.65, 'g/cm³', 'kg/m³', 2650);
fall('Dichte', 1, 't/m³', 'kg/dm³', 1);
fall('Moment', 45, 'kNm', 'Nmm', 45e6);
fall('Moment', 1, 'kNm', 'kNcm', 100);
fall('Energie', 1, 'kWh', 'MJ', 3.6);
fall('Energie', 1, 'kcal', 'kJ', 4.1868);
fall('Temperatur', 0, '°C', '°F', 32);
fall('Temperatur', 100, '°C', '°F', 212);
fall('Temperatur', -40, '°C', '°F', -40);
fall('Temperatur', 0, '°F', 'K', 255.37222222222223);
fall('Temperatur', 20, '°C', 'K', 293.15);
pruefe(relNahe(PSI, PFUND_KRAFT / 0.0254 ** 2) && relNahe(PFUND_KRAFT, 0.45359237 * 9.80665), 'lbf und psi aus Definitionen');
//    Handbeispiele des Moduls (content/einheiten/Einheiten.json): 500 kN/90 000 mm² = 5,56 N/mm²; 1 kN/m² = 0,001 N/mm² = 1 kPa
const sigma = umrechnen(500, 'Kraft', 'kN', 'N') / 90000;
pruefe(relNahe(sigma, 5.5556, 1e-4) && relNahe(umrechnen(sigma, 'Spannung/Druck', 'MPa (N/mm²)', 'kPa'), 5555.56, 1e-6), 'σ = F/A in N/mm²');
pruefe(relNahe(umrechnen(1, 'Spannung/Druck', 'kPa', 'MPa (N/mm²)'), 0.001), '1 kN/m² = 1 kPa = 0,001 N/mm²');

// 2. Rundreise: jede Umrechnung hin und zurück (alle geordneten Einheitenpaare jeder Größenart, auch a → a)
const werte = [0, 1, -1, 0.001, 2.5, 123.456, 1e-9, 1e9, -273.15, 6894.76];
let paare = 0;
for (const art of GROESSENARTEN) {
  for (const a of EINHEITEN[art]) for (const b of EINHEITEN[art]) {
    paare++;
    for (const x of werte) {
      const hin = umrechnen(x, art, a.name, b.name);
      const zurueck = umrechnen(hin, art, b.name, a.name);
      // Temperatur: absolute Toleranz (Nullpunktverschiebung), sonst relativ
      const ok = art === 'Temperatur' ? Math.abs(zurueck - x) <= 1e-9 : relNahe(zurueck, x, 1e-12);
      if (!ok) { pruefe(false, `Rundreise ${art}: ${x} ${a.name} → ${b.name} → ${zurueck}`); break; }
    }
    // Identität a → a
    pruefe(umrechnen(7.25, art, a.name, a.name) === 7.25 || Math.abs(umrechnen(7.25, art, a.name, a.name) - 7.25) < 1e-12, `Identität ${art} ${a.name}`);
  }
}
pruefe(paare === 6 * 6 + 6 * 6 + 4 * 4 + 4 * 4 + 5 * 5 + 4 * 4 + 4 * 4 + 5 * 5 + 5 * 5 + 3 * 3, `Anzahl Paare ${paare}`);
//    Kette über drei Einheiten (transitiv): m → in → ft → m
pruefe(relNahe(umrechnen(umrechnen(umrechnen(3.7, 'Länge', 'm', 'in (Zoll)'), 'Länge', 'in (Zoll)', 'ft (Fuß)'), 'Länge', 'ft (Fuß)', 'm'), 3.7), 'Kette m → in → ft → m');
pruefe(Math.abs(umrechnen(umrechnen(umrechnen(37, 'Temperatur', '°C', '°F'), 'Temperatur', '°F', 'K'), 'Temperatur', 'K', '°C') - 37) < 1e-9, 'Kette °C → °F → K → °C');
//    eindeutige Einheitennamen je Größenart und positive Faktoren
for (const art of GROESSENARTEN) {
  const namen = EINHEITEN[art].map(u => u.name);
  pruefe(new Set(namen).size === namen.length && EINHEITEN[art].every(u => u.faktor > 0), `Tabelle ${art}`);
}

// 3. Plausibilität und Grenzen
pruefe(umrechnung(-273.15, 'Temperatur', '°C', 'K').gueltig && umrechnung(-459.67, 'Temperatur', '°F', 'K').gueltig, 'absoluter Nullpunkt zulässig');
pruefe(!umrechnung(-300, 'Temperatur', '°C', 'K').gueltig && !umrechnung(-1, 'Temperatur', 'K', '°C').gueltig, 'unter 0 K → Fehler');
const neg = umrechnung(-5, 'Länge', 'm', 'mm');
pruefe(neg.gueltig && neg.hinweise.length === 1 && neg.hinweise[0].stufe === 'warnung' && neg.wert === -5000, 'negative Länge → Warnung, Ergebnis bleibt');
pruefe(umrechnung(-5, 'Kraft', 'kN', 'N').hinweise.length === 0, 'negative Kraft ohne Hinweis (Druck/Zug)');
pruefe(!umrechnung(NaN, 'Länge', 'm', 'mm').gueltig && !umrechnung(Infinity, 'Länge', 'm', 'mm').gueltig, 'NaN/∞ → Fehler');
pruefe(!umrechnung(1, 'Länge', 'm', 'kg').gueltig && Number.isNaN(umrechnen(1, 'Länge', 'm', 'kg')), 'fremde Einheit → Fehler/NaN');

// 4. Fuzz: 1 000 Zufallseingaben ohne NaN/∞ bei gültigem Ergebnis, Rundreise relativ ≤ 1e-12
let seed = 8128;
const z = (a: number, c: number) => { seed = (seed * 1103515245 + 12345) % 2147483648; return a + (c - a) * (seed / 2147483648); };
for (let i = 0; i < 1000; i++) {
  const art = GROESSENARTEN[i % GROESSENARTEN.length];
  const liste = EINHEITEN[art];
  const a = liste[Math.floor(z(0, liste.length))], b = liste[Math.floor(z(0, liste.length))];
  const x = z(-1, 1) * Math.pow(10, z(-6, 9));
  const r = umrechnung(x, art, a.name, b.name);
  if (r.gueltig) {
    const zur = umrechnen(r.wert, art, b.name, a.name);
    const ok = Number.isFinite(r.wert) && (art === 'Temperatur' ? Math.abs(zur - x) <= 1e-9 * Math.max(1, Math.abs(x)) : relNahe(zur, x, 1e-12));
    if (!ok) { pruefe(false, `Fuzz ${i}: ${x} ${a.name} → ${b.name}`); break; }
  }
}

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log(`OK: Einheiten (${paare} Einheitenpaare in Rundreise)`);
