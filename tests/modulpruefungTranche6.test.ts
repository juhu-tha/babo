// Modulprüfung Tranche 6 (28.10.2026): unabhängige Nachrechnungen (Befundliste docs/pruefung/module-tranche-6.md).
// Die Sollwerte stammen aus einem eigenen Prüfskript (eigene Umsetzung der Modell- und Normgleichungen in Python,
// Gleichgewichtsfeuchte über die Fahrenheit-Fassung des Wood Handbook), nicht aus den Kernen oder vorhandenen Tests.
import { gleichgewichtsfeuchte, feuchteNachLagerung, schwinden } from '../src/calc/holzphysik';
import { festigkeitswerte, druckUnterWinkel, kdefFuer, KLED_NAME, GAMMA_M_HOLZ } from '../src/calc/holzbau';
import { HOLZ_EN338, BSH_EN14080 } from '../src/data/kennwerte';
import { emodulKunststoff, kunststoffTemperatur, waermedehnung } from '../src/calc/werkstoffmodelle';
import { membranNachweis, radiusAusStich, MEMBRAN_LEHRWERTE } from '../src/calc/membran';
import { sdRegel } from '../src/calc/glaser';

const fehler: string[] = [];
const nahe = (ist: number, soll: number, tol = 5e-3) => Math.abs(ist - soll) <= tol * Math.max(Math.abs(soll), 1e-9);
const pruefe = (fall: string, ist: number, soll: number, tol = 5e-3) => { if (!nahe(ist, soll, tol)) fehler.push(`${fall}: ist ${ist}, soll ${soll}`); };
const gilt = (ok: boolean, fall: string) => { if (!ok) fehler.push(fall); };

console.log('--- Test: Modulprüfung Tranche 6 (Nachrechnungen) ---');

// 1. Holz – Gleichgewichtsfeuchte (Hailwood-Horrobin, Wood Handbook), Feuchteangleich, Schwinden
pruefe('H1 u_gl 20 °C/65 %', gleichgewichtsfeuchte(65, 20).u, 12.002);
pruefe('H2 u_gl 30 °C/80 %', gleichgewichtsfeuchte(80, 30).u, 15.5556);
pruefe('H3 u_gl 10 °C/40 %', gleichgewichtsfeuchte(40, 10).u, 7.8773);
const lag = feuchteNachLagerung(30, 12, 30, 24);
pruefe('H4 τ', lag.tau, 21.6); pruefe('H4 u nach 30 d', lag.u, 16.4883);
const sw = schwinden({ uStart: 30, uEnde: 12, qt: 0.33, qr: 0.16, ql: 0.01, breite: 120, dicke: 24, laenge: 3500 });
pruefe('H5 Breite', sw.neueBreite, 112.872); pruefe('H5 Dicke', sw.neueDicke, 23.3088); pruefe('H5 Länge', sw.neueLaenge, 3493.7);
pruefe('H5 ε_V', sw.epsV * 100, 8.8134);
const sw40 = schwinden({ uStart: 40, uEnde: 12, qt: 0.33, qr: 0.16, ql: 0.01, breite: 120, dicke: 24, laenge: 3500 });
pruefe('H5b ε_T ab Fasersättigung', sw40.epsT * 100, 5.94); gilt(sw40.hinweise.some(h => h.stufe === 'warnung'), 'H5b Hinweis Fasersättigung');

// 2. Holz – Bemessungswerte nach DIN EN 1995-1-1/NA (k_mod Tab. 3.1, γ_M = 1,3), Gl. (6.16)
const c24 = HOLZ_EN338.C24;
const fw = festigkeitswerte({ fm: c24.fmk, ft0: c24.ft0k, ft90: c24.ft90k, fc0: c24.fc0k, fc90: c24.fc90k, fv: c24.fvk, gammaM: GAMMA_M_HOLZ, nkl: 1, kled: KLED_NAME['mittel'], kc90: 1.0, winkel: 30 });
pruefe('H6 k_mod', fw.kmod, 0.8); pruefe('H6 f_m,d', fw.fmd, 14.7692); pruefe('H6 f_c,0,d', fw.fc0d, 12.9231);
pruefe('H6 f_c,90,d', fw.fc90d, 1.53846); pruefe('H6 f_v,d', fw.fvd, 2.46154); pruefe('H7 f_c,30,d', fw.fcad, 4.5344);
pruefe('H7 f_c,90,d mit k_c,90 = 1,5', druckUnterWinkel(fw.fc0d, fw.fc90d, 1.5, 90), 2.30769);
const gl = BSH_EN14080.GL24h;
const fwGl = festigkeitswerte({ fm: gl.fmk, ft0: gl.ft0k, ft90: gl.ft90k, fc0: gl.fc0k, fc90: gl.fc90k, fv: gl.fvk, gammaM: GAMMA_M_HOLZ, nkl: 3, kled: KLED_NAME['kurz'], kc90: 1.75, winkel: 45 });
pruefe('H7 GL24h NKL 3 kurz, 45°', fwGl.fcad, 3.9851);
pruefe('H8 Beispiel M_Rd [kNm]', fw.fmd * 100 * 200 ** 2 / 6 / 1e6, 9.8462);
gilt(kdefFuer('Fichte (Vollholz)', 1) === 0.6 && kdefFuer('OSB', 1) === 1.5 && kdefFuer('OSB', 2) === 2.25 && kdefFuer('OSB', 3) === null, 'HW1 k_def Tab. 3.2');
pruefe('HW1 w_fin OSB/3 NKL 2', 4.0 * (1 + (kdefFuer('OSB', 2) as number)), 13.0);

// 3. Kunststoffe – Lehrmodell E(T) und Wärmedehnung
pruefe('KU1 amorph 20 °C', emodulKunststoff('amorphous', 20), 2999.98);
pruefe('KU1 amorph 100 °C', emodulKunststoff('amorphous', 100), 1504.93);
pruefe('KU1 amorph 150 °C', emodulKunststoff('amorphous', 150), 5.8264);
pruefe('KU2 teilkristallin 20 °C', emodulKunststoff('semicrystalline', 20), 1650);
pruefe('KU2 teilkristallin 160 °C', emodulKunststoff('semicrystalline', 160), 150.001);
pruefe('KU3 Elastomer 20 °C', emodulKunststoff('elastomer', 20), 3.0184);
pruefe('KU4 Duroplast 150 °C', emodulKunststoff('duroplast', 150), 2400);
gilt(kunststoffTemperatur('semicrystalline', 160).hinweise.some(h => h.stufe === 'warnung'), 'KU2 Warnung Schmelzbereich');
pruefe('KU5 ΔL PVC-U', waermedehnung(10000, 80e-6, 40), 32); pruefe('KU5 ΔL Stahl', waermedehnung(10000, 12e-6, 40), 4.8);

// 4. Membranen & ETFE – Kesselformel (Beispiele 1 und 2 des Moduls, Kugel)
const me1 = membranNachweis({ geometrie: 'zylinder', p: 300, radius: 18, werkstoff: 'gewebe', festigkeitGewebe: MEMBRAN_LEHRWERTE.pvcPesTyp2, gamma: MEMBRAN_LEHRWERTE.gammaGewebe });
pruefe('ME1 n', me1.n, 5400); pruefe('ME1 n_zul', me1.nZul, 16000); pruefe('ME1 η', me1.eta, 0.3375);
pruefe('ME1 η Sturm', membranNachweis({ geometrie: 'zylinder', p: 550, radius: 18, werkstoff: 'gewebe', festigkeitGewebe: 4000, gamma: 5 }).eta, 0.61875);
pruefe('ME2 r', radiusAusStich(3.5, 0.35), 4.55);
const me2 = membranNachweis({ geometrie: 'zylinder', p: 600, spannweite: 3.5, stich: 0.35, werkstoff: 'folie', dickeUm: 250, festigkeitFolie: MEMBRAN_LEHRWERTE.etfeSigma10, gamma: MEMBRAN_LEHRWERTE.gammaFolie });
pruefe('ME2 σ 600 Pa', me2.sigma, 10.92); pruefe('ME2 η', me2.eta, 0.94957); gilt(me2.ok, 'ME2 Lehrwert eingehalten');
const me3 = membranNachweis({ geometrie: 'kugel', p: 300, spannweite: 3, stich: 0.3, werkstoff: 'folie', dickeUm: 200, festigkeitFolie: 23, gamma: 2 });
pruefe('ME3 Kugel n', me3.n, 585); pruefe('ME3 σ', me3.sigma, 2.925); pruefe('ME3 η', me3.eta, 0.25435);
gilt(membranNachweis({ geometrie: 'zylinder', p: 300, spannweite: 3, stich: 2, werkstoff: 'folie', dickeUm: 200, festigkeitFolie: 23, gamma: 2 }).hinweise.some(h => h.stufe === 'fehler'), 'ME4 Stich > L/2 abgelehnt');

// 5. Werkstoff-Kombinationen – Standardaufbau (Inline-Rechnung) und s_d-Regel des Kerns
const lagen = [[0.015, 0.70, 10], [0.24, 0.28, 10], [0.16, 0.035, 40], [0.005, 0.85, 25], [0.003, 0.70, 30]];
const RT = 0.17 + lagen.reduce((s, [d, l]) => s + d / l, 0);
pruefe('KO1 U', 1 / RT, 0.177614);
const sdi = lagen.slice(0, 3).reduce((s, [d, , m]) => s + d * m, 0), sde = lagen.slice(3).reduce((s, [d, , m]) => s + d * m, 0);
const regel = sdRegel(sdi, sde);
pruefe('KO1 s_d,i', sdi, 8.95); pruefe('KO1 s_d,e', sde, 0.215); pruefe('KO1 s_d,i erf.', regel.sdiErforderlich as number, 2.0); gilt(regel.eingehalten, 'KO1 Regel eingehalten');
gilt(!sdRegel(2.55, 6.615).eingehalten, 'KO1b Teilung an der Dämmschicht: außerhalb der Regel (Frage T6-KO-1)');

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log('OK: Modulprüfung Tranche 6');
