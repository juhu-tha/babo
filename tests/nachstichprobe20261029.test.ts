// Nachstichprobe 29.10.2026: unabhängige Nachprüfung von 15 freigegebenen Fachmodulen (Befundliste
// docs/pruefung/nachstichprobe-2026-10-29.md). Die Sollwerte stammen aus einem eigenen Prüfskript (eigene Umsetzung
// der Gleichungen in Python), nicht aus den Kernen oder vorhandenen Tests. Zusätzlich sichert der Test die vier
// Inhaltskorrekturen der Nachstichprobe (NS-BD-1, NS-GL-1, NS-DH-1, NS-LC-1) gegen ein Zurückfallen.
import { EULER_BETA, eulerEigenform } from '../src/calc/stabilitaet';
import { stoffraum, K_WERT_DIN1045_2, maxFaFaktor } from '../src/calc/mischung';
import { temperaturFaktor, betaCc, ZEMENT_S } from '../src/calc/betonkennwerte';
import { biokohleBilanz } from '../src/calc/biokohlebeton';
import { uwFenster } from '../src/calc/fenster';
import { thermischeKennwerte, erforderlicheDaemmdicke } from '../src/calc/waermeschutz';
import { einzelbaustoffA1A4 } from '../src/calc/lca';
import { insituDruckfestigkeit13791 } from '../src/calc/bauwerksuntersuchung';
import { kn13791 } from '../src/utils/schadensKern';
import bwu from '../content/bauwerksuntersuchung/Bauwerksuntersuchung.json';
import glas from '../content/bpglaeser/daten.json';
import dauer from '../content/dauerhaftigkeit/Dauerhaftigkeit.json';
import lca from '../content/lca/LCA.json';

const fehler: string[] = [];
const nahe = (ist: number, soll: number, tol = 5e-3) => Math.abs(ist - soll) <= tol * Math.max(Math.abs(soll), 1e-9);
const pruefe = (fall: string, ist: number, soll: number, tol = 5e-3) => { if (!nahe(ist, soll, tol)) fehler.push(`${fall}: ist ${ist}, soll ${soll}`); };
const gilt = (ok: boolean, fall: string) => { if (!ok) fehler.push(fall); };

console.log('--- Test: Nachstichprobe 29.10.2026 (Nachrechnungen und Korrekturen) ---');

// knicken: F_K = π²EI/(β·l)², Wendepunkt der Eigenform von Fall 3
const fk = (fall: 1 | 2 | 3 | 4) => (Math.PI ** 2 * 210000 * 8.5e6) / (EULER_BETA[fall] * 3500) ** 2 / 1000;
pruefe('KN1 F_K Fall 2', fk(2), 1438.14);
pruefe('KN2 F_K Fall 1', fk(1), 359.536);
pruefe('KN3 Ausbiegung bei 65 % F_K', (3500 / 300) / (1 - 0.65), 33.3333);
let wende = 0;
for (let i = 1; i < 999; i++) {
  const h = 1e-3, x = i / 1000;
  const k2 = (xi: number) => eulerEigenform(3, xi + h) - 2 * eulerEigenform(3, xi) + eulerEigenform(3, xi - h);
  if (k2(x) * k2(x + 1e-3) <= 0) { wende = x; break; }
}
pruefe('KN5 Fall 3: Abstand Wendepunkt–Gelenk ≈ 0,7 l', 1 - wende, 0.699156, 3e-3);

// rechnung_beton: Stoffraum, k-Wert, Reife nach EC2 (B.10)
const misch = (z: number, w: number) => stoffraum({
  zement: z, rhoZement: 3.10, wasser: w, fa: 0, sf: 0, hues: 0, biochar: 0, zusatzmittel: 0, luft: 1.5, stahlfaser: 0, ppFaser: 0,
  rhoGestein: 2.65, fraktionen: [{ anteil: 100, feuchte: 0, wa: 0 }], biocharFeuchte: 0, biocharWa: 0,
  k: { fa: K_WERT_DIN1045_2.kF, sf: K_WERT_DIN1045_2.kS, hues: 0, biochar: 0 }, maxFaFaktor: maxFaFaktor('CEM I'),
});
pruefe('RB1 Gesteinskörnung XC4/F3/32', misch(175 / 0.6, 175).masseGestein, 1897.17);
pruefe('RB1 Frischbetonrohdichte', misch(175 / 0.6, 175).rohdichte * 1000, 2363.84);
pruefe('RB2 Quiz qn_rechnung_beton_2', misch(165 / 0.45, 165).masseGestein, 1859.56);
pruefe('RB6 t_T bei 12 °C nach 7 d', 7 * temperaturFaktor(12), 4.76274);
pruefe('RB6 f_ck(t) C25/30, Zement N', betaCc(ZEMENT_S.N, 7 * temperaturFaktor(12)) * 33 - 8, 15.1118);

// biokohlebeton: 44/12, F_perm, Herstellungsemission
const bk = biokohleBilanz({ mPK: 10, cGehalt: 80, fPerm: 0.8, ePK: 0.3, zRef: 320, deltaZ: 0, gwpZ: 0.665, w: 175, wAufnahme: 150 });
pruefe('BK3 Netto-Senke 10 kg/m³', bk.nettoPK, 20.4667);
pruefe('BK3 entspricht CEM I', bk.nettoPK / 0.665, 30.7769);
pruefe('BK4 Quiz qn_biokohlebeton_2', biokohleBilanz({ mPK: 12, cGehalt: 75, fPerm: 0.8, ePK: 0.4, zRef: 320, deltaZ: 0, gwpZ: 0.665, w: 175, wAufnahme: 150 }).nettoPK, 21.6);

// bp_glaeser: U_w nach DIN EN ISO 10077-1
pruefe('GL5 U_w 1,23 × 1,48 m, b_f 110 mm', uwFenster({ breite: 1.23, hoehe: 1.48, rahmenMm: 110, ug: 0.6, uf: 1.0, psi: 0.038, g: 0.5, strahlung: 0 }).uw, 0.81514);

// waermeeigenschaften: b, Kontakttemperatur, Dämmdicken
pruefe('WE1 b Beton', thermischeKennwerte(2.0, 2400, 1000).b, 2190.89);
pruefe('WE2 Kontakttemperatur Beton', thermischeKennwerte(2.0, 2400, 1000).thetaKontakt, 24.3453);
pruefe('WE2 Kontakttemperatur Fichte', thermischeKennwerte(0.13, 500, 1600).thetaKontakt, 30.0528);
const dd = erforderlicheDaemmdicke(0.24, 0.24, 1.0, [0.035, 0.040, 0.025]).dickenCm;
pruefe('WE3 EPS 035', dd[0], 13.1483); pruefe('WE3 Holzfaser 040', dd[1], 15.0267); pruefe('WE3 PIR 025', dd[2], 9.39167);

// oekobilanz_lca: A1–A4 eines Einzelbaustoffs (Lehrwerte)
const a4 = einzelbaustoffA1A4({ menge: 10, volumenbezogen: true, rohdichte: 2400, gwpA1A3: 245, penrt: 1850, distanz: 50, transport: 'lkw-heavy' });
pruefe('LC7 A1–A3 10 m³ CEM-I-Beton', a4.gwpA1A3, 2450);
pruefe('LC7 A4 24 t · 50 km · 0,101', a4.gwpA4, 121.2);

// bauwerksdiagnose: k_n = t(n−1; 0,95)·√(1 + 1/n), Beispiel 2
pruefe('BD1 k_n n = 8', kn13791(8), 2.0095, 5e-3);
pruefe('BD1 k_n n = 12', kn13791(12), 1.86922, 5e-3);
const bd2 = insituDruckfestigkeit13791({ n: 8, mittel: 31.0, s: 2.5, kleinster: 28.0, bezug: 'zylinder' });
pruefe('BD2 f_ck,is', bd2.fckIs, 26.0);
gilt(bd2.klasse === 'C30/37', `BD2 Kerne h/d = 2 (Zylinderbezug) → C30/37, ist ${bd2.klasse}`);
const bd2w = insituDruckfestigkeit13791({ n: 8, mittel: 31.0, s: 2.5, kleinster: 28.0, bezug: 'wuerfel' });
gilt(bd2w.klasse === 'C25/30', `BD2 dieselben Werte mit Würfelbezug (h/d = 1) → C25/30, ist ${bd2w.klasse}`);

// Korrekturen der Nachstichprobe
const bsp2 = bwu.daten['Bauwerksuntersuchung.schritte_2'];
gilt(/h\/d = 2/.test(bsp2[0].erklaerung) && !/\(h\/d = 1\)/.test(bsp2[0].erklaerung), 'NS-BD-1: Beispiel 2 mit Kernen h/d = 2 (Zylinderbezug)');
gilt(/C30\/37/.test(bsp2[2].formel) && /C25\/30/.test(bsp2[2].erklaerung), 'NS-BD-1: Einstufung C30/37 nur für Zylinderbezug, Hinweis C25/30 für h/d = 1');
gilt(/DIN 18008-2/.test(glas.werte.überkopfUndDachverglasungenNach), 'NS-GL-1: Überkopfverglasung linienförmig nach DIN 18008-2');
gilt(/100 K \(TVG\)/.test(dauer.texte.thermischeVorspannungEsgTvg), 'NS-DH-1: Temperaturwechselbeständigkeit TVG 100 K, ESG 200 K');
gilt(!/RC-Betonsysteme/.test(lca.texte.dieTransportfrachtIstGut) && /35 %/.test(lca.texte.dieTransportfrachtIstGut), 'NS-LC-1: RC-Beton nicht als CEM-III/A-Beispiel, Minderung wie Lehrbeispiel');

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log('OK: Nachstichprobe 29.10.2026');
