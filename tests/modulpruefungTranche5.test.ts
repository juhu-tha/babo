// Modulprüfung Tranche 5 (28.10.2026): unabhängige Nachrechnungen (Befundliste docs/pruefung/module-tranche-5.md).
// Die Sollwerte stammen aus einem eigenen Prüfskript (eigene Umsetzung der Norm- bzw. Modellgleichungen in Python),
// nicht aus den Kernen oder vorhandenen Tests übernommen.
import fs from 'fs';
import { keramikKennwerte, fliesenGruppe, formmass } from '../src/calc/keramik';
import { bodengruppe, frostschutz } from '../src/calc/erdbau';
import { weibull, vsgEffektiveDicke, thermischeSpannung, effektiveDickeW } from '../src/calc/glas';
import { abminderungStahlBrand, woehlerEc3, walzEigenspannung, schweissEigenspannung, pren } from '../src/calc/werkstoffmodelle';
import { gefuegeAnteile, cev } from '../src/calc/eisenKohlenstoff';
import { putzbedarf, mauermoertelNormalfuge, duennbettmoertel } from '../src/calc/moertelbedarf';

const fehler: string[] = [];
const nahe = (ist: number, soll: number, tol = 5e-3) => Math.abs(ist - soll) <= tol * Math.max(Math.abs(soll), 1e-9);
const pruefe = (fall: string, ist: number, soll: number, tol = 5e-3) => { if (!nahe(ist, soll, tol)) fehler.push(`${fall}: ist ${ist}, soll ${soll}`); };
const gilt = (ok: boolean, fall: string) => { if (!ok) fehler.push(fall); };

console.log('--- Test: Modulprüfung Tranche 5 (Nachrechnungen) ---');

// 1. Keramik und Ziegel (DIN EN ISO 10545-3:2018-06, DIN EN 14411:2016-12)
const k1 = keramikKennwerte({ mt: 1250, mn: 1253.5, ma: 717, formgebung: 'B' });
pruefe('K1 E_b', k1.eb, 0.28); pruefe('K1 V', k1.volumen, 536.5); pruefe('K1 ρ', k1.rhoRoh, 2.32992); pruefe('K1 P_offen', k1.pOffen, 0.652377); gilt(k1.gruppe === 'BIa', 'K1 BIa');
const k2 = keramikKennwerte({ mt: 1000, mn: 1150, ma: 560, rhoRein: 2.65, formgebung: 'A' });
pruefe('K2 E_b', k2.eb, 15); pruefe('K2 ρ', k2.rhoRoh, 1.69492); pruefe('K2 P_offen', k2.pOffen, 25.4237); pruefe('K2 P_ges', k2.pGes, 36.0409); gilt(k2.gruppe === 'AIII', 'K2 AIII');
gilt(fliesenGruppe(3.0, 'B') === 'BIb' && fliesenGruppe(6.0, 'A') === 'AIIa' && fliesenGruppe(10.01, 'B') === 'BIII', 'K3 Gruppengrenzen');
pruefe('K4 Formmaß', formmass(240, 0.06, 0.02), 260.53); pruefe('K4 Brennschwindung 3 %', formmass(240, 0.06, 0.02) * 0.94 * 0.97, 237.551);

// 2. Erdbau (DIN 18196 vereinfacht; ZTV E-StB 17, Tab. 1; RStO 12/24, Tab. 6/7)
const B = { organik: 'keine' as const, plastizitaet: 'nicht' as const };
const e1 = bodengruppe({ ...B, feinanteil: 10, kiesanteil: 60, sandanteil: 40 }); gilt(e1.gruppe === 'GU / GT' && e1.frost === 'F2', 'E1 GU/GT F2');
const e2 = bodengruppe({ ...B, feinanteil: 10, kiesanteil: 30, sandanteil: 70 }); gilt(e2.gruppe === 'SU / ST' && e2.frost === 'F2', 'E2 SU/ST F2 (Quiz qn_erdbau_3)');
const e3 = bodengruppe({ ...B, feinanteil: 60, kiesanteil: 50, sandanteil: 50, plastizitaet: 'ausgeprägt' }); gilt(e3.gruppe === 'TA' && e3.frost === 'F2', 'E3 TA → F2 (T5-ER-1)');
const e3b = bodengruppe({ ...B, feinanteil: 25, kiesanteil: 50, sandanteil: 50 }); gilt(e3b.gruppe === 'SU* / ST*' && e3b.frost === 'F3', 'E3b SU*/ST* F3');
const e4 = frostschutz({ frostzone: 2, bauklasse: 'BK3', bodengruppe: 'F3', wasser: 'unguenstig' }); gilt(e4.gesamtDicke === 70 && e4.dickeAsphalt === 15 && e4.dickeFSS === 55, 'E4 70/15/55');
const e5 = frostschutz({ frostzone: 1, bauklasse: 'Bk100', bodengruppe: 'F2', wasser: 'guenstig' }); gilt(e5.gesamtDicke === 55 && e5.dickeAsphalt === 30 && e5.dickeFSS === 25, 'E5 55/30/25');
const e6 = frostschutz({ frostzone: 3, bauklasse: 'BK03', bodengruppe: 'F2', wasser: 'guenstig' }); gilt(e6.gesamtDicke === 55 && e6.dickeFSS === 40, 'E6 55/15/40');
{
  const erd = JSON.parse(fs.readFileSync('content/erdbau/Erdbau.json', 'utf8'));
  gilt(erd.daten.Erdbau_7.frost === 'F2', 'E7 Text TA F2');
  gilt(!/RStO 12\/24\/24/.test(JSON.stringify(erd)), 'E8 Tippfehler RStO 12/24/24 entfernt');
}

// 3. Glas (Weibull; VSG nach Wölfel/Bennison, EN 16612; σ_T = E·α_T·ΔT)
pruefe('G1 P_f', weibull({ sigma: 45, sigma0: 67.5, m: 7, A: 1 }).pf, 0.0568479);
pruefe('G1b P_f A = 4 m²', weibull({ sigma: 45, sigma0: 67.5, m: 7, A: 4 }).pf, 0.208726);
const g2 = vsgEffektiveDicke({ T: 20, dauer: 'short', h1: 8, h2: 8, hv: 1.52, a: 1000 });
pruefe('G2 Γ', g2.Gamma, 0.709937); pruefe('G2 h_ef,w', g2.hef_w, 16.0213);
const g3 = vsgEffektiveDicke({ T: 20, dauer: 'long', h1: 8, h2: 8, hv: 1.52, a: 1000 });
pruefe('G3 Γ lang', g3.Gamma, 0.0238905); pruefe('G3 h_ef,w lang', g3.hef_w, 10.4094);
pruefe('G4 h_ef,w (ω = 0,3; balconette 8,57 mm)', effektiveDickeW(5, 5, 1.52, 0.3), 8.58437);
pruefe('G5 σ_T 40 K', thermischeSpannung(40), 25.2); pruefe('G5 σ_T 60 K', thermischeSpannung(60), 37.8);
{
  const gl = JSON.stringify(JSON.parse(fs.readFileSync('content/glas/Glas.json', 'utf8')));
  gilt(/DIN 18008-3:2024-12/.test(gl) && /DIN 18008-4:2024-12/.test(gl), 'G6 DIN 18008-3/-4:2024-12');
}

// 4. Stahl (DIN EN 1993-1-2 Tab. 3.1; DIN EN 1993-1-9, 7.1; Eigenspannungen; Fe-C; CEV)
const s1 = abminderungStahlBrand(550); pruefe('S1 k_y,550', s1.ky, 0.625); pruefe('S1 k_E,550', s1.kE, 0.455);
const s1b = abminderungStahlBrand(750); pruefe('S1b k_y,750', s1b.ky, 0.17); pruefe('S1b k_E,750', s1b.kE, 0.11);
const w1 = woehlerEc3({ deltaSigmaC: 71, m: 3, deltaSigma: 100 });
pruefe('S2 Δσ_D', w1.deltaSigmaD, 52.3132); pruefe('S2 Δσ_L', w1.deltaSigmaL, 28.7346); pruefe('S2 N_R(100)', w1.nR, 715822);
pruefe('S3 N_R(40)', woehlerEc3({ deltaSigmaC: 71, m: 3, deltaSigma: 40 }).nR, 1.91306e7);
const s4 = walzEigenspannung(355, 'h'); pruefe('S4 Druck', s4.maxDruck, -177.5); pruefe('S4 Zug', s4.maxZug, 88.75);
const integral = s4.verlauf.slice(1).reduce((s, p, i) => s + (p.sigma + s4.verlauf[i].sigma) / 2 * (p.x - s4.verlauf[i].x), 0);
gilt(Math.abs(integral) < 0.5 * 355, `S4 Gleichgewicht (Trapez ${integral})`);
const s5 = schweissEigenspannung({ fy: 355, streckenenergie: 1500, blechdicke: 10 });
pruefe('S5 b', s5.bt, 22.5); pruefe('S5 σ(0)', s5.verlauf[100].sigma, 355);
pruefe('S6 Perlit 0,45 % (Lehrbuch)', gefuegeAnteile(0.45).perlit, 0.551282); pruefe('S6 Perlit 0,45 % (Callister)', gefuegeAnteile(0.45, 'international').perlit, 0.579946);
pruefe('S6 Sekundärzementit 1,2 %', gefuegeAnteile(1.2).sekundaerzementit, 0.0681431);
const s6b = gefuegeAnteile(3.0); pruefe('S6b Ledeburit', s6b.ledeburit, 0.419643); pruefe('S6b Sek.-Zementit', s6b.sekundaerzementit, 0.124574); pruefe('S6b Perlit', s6b.perlit, 0.455783);
pruefe('S7 CEV', cev({ C: 0.17, Mn: 1.4, Cr: 0.1, Mo: 0.05, V: 0.01, Ni: 0.1, Cu: 0.2 }), 0.455333);
pruefe('S9 PREN', pren(17, 2), 23.6);
{
  const st = JSON.stringify(JSON.parse(fs.readFileSync('content/stahl/Stahl.json', 'utf8')));
  gilt(st.includes('10^{-3}') && !st.includes('E_s = \\\\eta'), 'S10 Wärmeeinbringung mit Faktor 10⁻³');
}

// 5. Putze & Mörtel (Orientierungsrechner; Rundungsbefund T5-PM-1)
const pm1 = putzbedarf({ flaeche: 50, dickeMm: 15, art: 'gips' }); pruefe('PM1 Masse', pm1.masse, 825); gilt(pm1.saecke === 33, `PM1 33 Säcke (ist ${pm1.saecke})`);
const pm2 = mauermoertelNormalfuge({ flaeche: 30, wanddicke: '24.0', format: 'nf' }); pruefe('PM2 Liter', pm2.liter ?? NaN, 1890); pruefe('PM2 kg', pm2.masse, 2929.5); gilt(pm2.saecke === 118, 'PM2 118 Säcke');
pruefe('PM3 Dünnbett', duennbettmoertel({ flaeche: 30, wanddickeCm: 30 }).masse, 108);
{
  const pm = JSON.parse(fs.readFileSync('content/putzemoertel/PutzeMoertel.json', 'utf8'));
  const lm = pm.daten.MORTAR_PRODUCTS.find((m: { id: string }) => m.id === 'leicht_m25');
  gilt(/M 5/.test(lm.name) && /≥ 5,0/.test(lm.strengthNmm2), 'PM4 Leichtmauermörtel M 5');
  gilt(!/\d\.\d–\d\.\d Gew/.test(JSON.stringify(pm)), 'PM5 Dezimalkomma Silananteil');
}

if (fehler.length) { for (const x of fehler) console.error(`FAIL: ${x}`); process.exit(1); }
console.log('OK: Modulprüfung Tranche 5');
