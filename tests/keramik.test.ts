// Rechenkern Keramik und Ziegel (AP 3.13): Wasseraufnahme E_b, Fliesengruppe nach DIN EN 14411, Rohdichte, Porosität, Formmaß
import fs from 'fs';
import { keramikKennwerte, fliesenGruppe, scherbenTyp, schwindmass, formmass } from '../src/calc/keramik';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (ist: number, soll: number, tol: number) => Math.abs(ist - soll) <= tol;
console.log('--- Test: Keramik ---');

// 1. Handrechnung: m_t = 200,0 g, m_n = 210,0 g, m_a = 118,0 g, ρ_rein = 2,65 g/cm³, trockengepresst
//    E_b = 10,0/200,0 = 5,00 %  → BIIa (3 < E_b ≤ 6)
//    V = 210,0 − 118,0 = 92,0 cm³; ρ_roh = 200,0/92,0 = 2,1739 g/cm³
//    P_offen = 10,0/92,0 = 10,870 %; P_ges = 1 − 2,1739/2,65 = 17,966 %
const h = keramikKennwerte({ mt: 200, mn: 210, ma: 118, rhoRein: 2.65, formgebung: 'B' });
pruefe(h.gueltig && nahe(h.eb, 5.0, 1e-12) && h.gruppe === 'BIIa', `Handrechnung E_b/Gruppe ${h.eb} ${h.gruppe}`);
pruefe(nahe(h.volumen, 92, 1e-12) && nahe(h.rhoRoh, 2.1739, 1e-4) && nahe(h.pOffen, 10.870, 1e-3) && nahe(h.pGes, 17.966, 1e-3), `Handrechnung ρ/P ${h.rhoRoh} ${h.pOffen} ${h.pGes}`);
pruefe(h.hinweise.length === 0, `Handrechnung ohne Hinweise (${h.hinweise.map(x => x.text).join(' | ')})`);

// 2. Unabhängige Referenz: synthetischer Probekörper aus Volumenbilanz (ohne geschlossene Poren)
//    V = 100 cm³, offene Poren 20 cm³, Feststoff 80 cm³ · 2,6 g/cm³ = 208 g → m_t = 208, m_n = 228, m_a = m_n − V·ρ_w = 128
//    Erwartung: P_offen = P_ges = 20 %, ρ_roh = 2,08 g/cm³, E_b = 20/208 = 9,615 % → stranggepresst AIIb
const s = keramikKennwerte({ mt: 208, mn: 228, ma: 128, rhoRein: 2.6, formgebung: 'A' });
pruefe(nahe(s.pOffen, 20, 1e-9) && nahe(s.pGes, 20, 1e-9) && nahe(s.rhoRoh, 2.08, 1e-12) && nahe(s.eb, 100 * 20 / 208, 1e-12) && s.gruppe === 'AIIb', `Referenzkörper ${JSON.stringify(s)}`);
// Zusammenhang E_b = P_offen · ρ_w/ρ_roh (aus den Definitionen) für beliebige Wägungen
pruefe(nahe(h.eb, h.pOffen * 1.0 / h.rhoRoh, 1e-9), 'E_b = P_offen/ρ_roh');

// 3. Klassengrenzen DIN EN 14411:2016-12 (Obergrenze jeweils einschließlich)
const G: [number, string, string][] = [[0, 'BIa', 'AIa'], [0.5, 'BIa', 'AIa'], [0.51, 'BIb', 'AIb'], [3, 'BIb', 'AIb'], [3.01, 'BIIa', 'AIIa'], [6, 'BIIa', 'AIIa'], [6.2, 'BIIb', 'AIIb'], [10, 'BIIb', 'AIIb'], [10.01, 'BIII', 'AIII'], [18, 'BIII', 'AIII']];
for (const [eb, b, a] of G) pruefe(fliesenGruppe(eb, 'B') === b && fliesenGruppe(eb, 'A') === a, `Grenze E_b = ${eb} %`);
// Grenze aus Wägung mit Rundungsrauschen: m_t = 300, m_n = 309 → E_b = 3,000… % → Ib
pruefe(keramikKennwerte({ mt: 300, mn: 309, formgebung: 'B' }).gruppe === 'BIb', 'E_b = 3 % aus Wägung → BIb');
pruefe(scherbenTyp(0.2, 'B').includes('Feinsteinzeug') && scherbenTyp(15, 'B').includes('Steingut'), 'Scherbentyp');

// 4. Plausibilität
pruefe(keramikKennwerte({ mt: 100, mn: 95, formgebung: 'B' }).hinweise.some(x => x.stufe === 'fehler' && x.feld === 'mn'), 'm_n < m_t → Fehler');
pruefe(keramikKennwerte({ mt: 100, mn: 110, ma: 110, formgebung: 'B' }).gueltig === false, 'm_a ≥ m_n → Fehler');
pruefe(keramikKennwerte({ mt: 100, mn: 160, ma: 105, formgebung: 'B' }).hinweise.some(x => x.feld === 'ma' && x.stufe === 'fehler'), 'm_a ≥ m_t → Fehler');
pruefe(keramikKennwerte({ mt: 0, mn: 10, formgebung: 'A' }).gueltig === false && keramikKennwerte({ mt: NaN, mn: 10, formgebung: 'A' }).gueltig === false, 'm_t ≤ 0 / NaN → Fehler');
pruefe(keramikKennwerte({ mt: 100, mn: 115, formgebung: 'B' }).hinweise.some(x => x.feld === 'formgebung'), 'BIII trockengepresst → Hinweis glasiert');
pruefe(keramikKennwerte({ mt: 100, mn: 110, ma: 60, rhoRein: 1.8, formgebung: 'B' }).gueltig === false, 'ρ_roh > ρ_rein → Fehler');
pruefe(keramikKennwerte({ mt: 100, mn: 140, formgebung: 'A' }).hinweise.some(x => x.feld === 'mn' && x.stufe === 'warnung'), 'E_b > 25 % → Warnung');
const ohneMa = keramikKennwerte({ mt: 100, mn: 104, formgebung: 'B' });
pruefe(ohneMa.gueltig && Number.isNaN(ohneMa.rhoRoh) && ohneMa.gruppe === 'BIIa', 'ohne Unterwasserwägung nur E_b');

// 5. Schwindmaß und Formmaß: NF-Länge 240 mm, s_T = 6 %, s_B = 2 % → l_0 = 240/(0,94 · 0,98) = 260,53 mm
pruefe(nahe(formmass(240, 0.06, 0.02), 260.53, 0.005), `Formmaß ${formmass(240, 0.06, 0.02)}`);
pruefe(nahe(schwindmass(260.53, 244.9), 0.0600, 1e-4), 'Schwindmaß');
pruefe(nahe(formmass(240, 0, 0), 240, 1e-12), 'Formmaß ohne Schwindung');

// 6. Fuzz-Test: 1000 Zufallseingaben → endliche Ergebnisse oder sauberer Fehler, Gruppe konsistent
let zufall = 12345;
const rnd = () => { zufall = (zufall * 1103515245 + 12345) % 2147483648; return zufall / 2147483648; };
let gueltige = 0;
for (let i = 0; i < 1000; i++) {
  const mt = 1 + rnd() * 2000;
  const mn = mt * (1 + rnd() * 0.3);
  const ma = rnd() < 0.8 ? mt * (0.2 + rnd() * 0.6) : undefined;
  const rhoRein = rnd() < 0.7 ? 2.3 + rnd() * 0.7 : undefined;
  const r = keramikKennwerte({ mt, mn, ma, rhoRein, formgebung: rnd() < 0.5 ? 'A' : 'B' });
  if (!r.gueltig) { pruefe(r.hinweise.some(x => x.stufe === 'fehler'), `Fuzz ${i}: ungültig ohne Fehlerhinweis`); continue; }
  gueltige++;
  pruefe(Number.isFinite(r.eb) && r.eb >= 0 && r.gruppe !== null, `Fuzz ${i}: E_b ${r.eb}`);
  if (ma !== undefined) pruefe(Number.isFinite(r.rhoRoh) && Number.isFinite(r.pOffen) && r.pOffen > 0 && r.pOffen < 100, `Fuzz ${i}: ρ/P ${r.rhoRoh} ${r.pOffen}`);
  if (ma !== undefined && rhoRein !== undefined) pruefe(Number.isFinite(r.pGes) && r.pGes >= 0 && r.pGes < 100, `Fuzz ${i}: P_ges ${r.pGes}`);
  const l = 50 + rnd() * 400, st = rnd() * 0.12, sb = rnd() * 0.08;
  pruefe(Number.isFinite(formmass(l, st, sb)) && formmass(l, st, sb) >= l, `Fuzz ${i}: Formmaß`);
}
pruefe(gueltige > 500, `Fuzz: nur ${gueltige} gültige Fälle`);

// Runde 5 (Z30): Inhaltsdatei verwendet die Begriffe der DIN EN 771-1 (LD-/HD-Ziegel, öffentlich: Normzusammenfassung
// standards.globalspec.com, EN 771-1: LD ≤ 1 000 kg/m³ nur geschütztes Mauerwerk; HD alle ungeschützten Anwendungen)
// und das Verhältnis Mittelwert/Klasse 1,25 der Druckfestigkeitsklassen (Klasse 12 → 15, Klasse 60 → 75 N/mm²; bauprofessor.de)
{
  const kz = JSON.parse(fs.readFileSync('content/keramikziegel/KeramikZiegel.json', 'utf8'));
  const text = JSON.stringify(kz);
  pruefe(!/P-Ziegel|U-Ziegel/.test(text) && /LD-Ziegel/.test(text) && /HD-Ziegel/.test(text), 'LD/HD statt P/U');
  pruefe(/Klasse 12 mindestens 15 N\/mm²/.test(kz.texte.klassenZB4) && /Klasse 60 mindestens 75/.test(kz.texte.klassenZB4), 'Druckfestigkeitsklassen');
}

if (fehler.length) { for (const x of fehler) console.error(`FAIL: ${x}`); process.exit(1); }
console.log(`OK: Keramik (${gueltige} gültige Fuzz-Fälle)`);
