// Gezielte Durchsicht Tranche D (29.10.2026): Baustoffe, Holzbau, Mechanik – Befundliste
// docs/pruefung/durchsicht-D-2026-10-29.md. Die Sollwerte der Nachrechnungen stammen aus einem eigenen Prüfskript
// (Python, eigene Umsetzung der Gleichungen), nicht aus den Kernen. Zusätzlich sichert der Test die Korrekturen DSD-*
// gegen ein Zurückfallen (Werte aus den zentralen Konstanten statt Modulkopien).
import { readFileSync } from 'node:fs';
import { SCHWINDBEIWERTE } from '../src/calc/holzphysik';
import { bemesseDruckstab as holzDruckstab, festigkeitswerte, KDEF, BETA_C, GAMMA_M_HOLZ, knickbeiwert } from '../src/calc/holzbau';
import { traeger } from '../src/calc/statik';
import { zustandsgrenzen, erddruckRankine, konsolidierung, aLinie } from '../src/calc/boden';
import { bemesseDruckstab as stahlDruckstab, biegewiderstandY, profil } from '../src/calc/stahlbau';
import { bilinearVerfestigung } from '../src/calc/werkstoffmodelle';
import { ecmEc2 } from '../src/calc/emodul';
import { ALPHA_E } from '../src/calc/betonkennwerte';
import { GWP_LEHRWERTE } from '../src/data/gwpLehrwerte';
import { HOLZ_EN338 } from '../src/data/kennwerte';
import { REGELSIEBLINIEN } from '../src/calc/mischung';
import { PUTZ_VERBRAUCH } from '../src/calc/moertelbedarf';
import holzbau from '../content/holzbaubeta/HolzbauBeta.json';
import holzbauWerkstoffe from '../content/holzbaubeta/HolzbauWerkstoffe.json';
import kombi from '../content/kombinationen/Kombinationen.json';
import gesteine from '../content/gesteine/Gesteine.json';

const fehler: string[] = [];
const nahe = (ist: number, soll: number, tol = 5e-3) => Math.abs(ist - soll) <= tol * Math.max(Math.abs(soll), 1e-9);
const pruefe = (fall: string, ist: number, soll: number, tol = 5e-3) => { if (!nahe(ist, soll, tol)) fehler.push(`${fall}: ist ${ist}, soll ${soll}`); };
const gilt = (ok: boolean, fall: string) => { if (!ok) fehler.push(fall); };
const quelle = (pfad: string) => readFileSync(new URL(`../${pfad}`, import.meta.url), 'utf8');

console.log('--- Test: Durchsicht D 29.10.2026 (Nachrechnungen und Korrekturen) ---');

// holz: Anwendungsbeispiel Biegung C24 100/200, NKL 1, KLED mittel
const c24 = HOLZ_EN338.C24;
const fw = festigkeitswerte({ fm: c24.fmk, ft0: c24.ft0k, ft90: c24.ft90k, fc0: c24.fc0k, fc90: c24.fc90k, fv: c24.fvk, gammaM: GAMMA_M_HOLZ, nkl: 1, kled: 'mtl', kc90: 1, winkel: 0 });
pruefe('HO Beispiel f_m,d', fw.fmd, 14.769);
pruefe('HO Beispiel M_Rd [kNm]', fw.fmd * (100 * 200 ** 2 / 6) / 1e6, 9.846);

// holzwerkstoffe: Endverformung w_fin = w_inst · (1 + k_def)
pruefe('HW OSB NKL 1', 4.0 * (1 + (KDEF.osb[1] ?? NaN)), 10.0);
pruefe('HW Vollholz NKL 1', 4.0 * (1 + (KDEF.vollholz[1] ?? NaN)), 6.4);
pruefe('HW OSB NKL 2', 4.0 * (1 + (KDEF.osb[2] ?? NaN)), 13.0);

// holzbau_bemessung: Stütze C24 120/160, l_ef = 3,0 m, N_Ed = 50 kN
const st = holzDruckstab({ b: 120, h: 160, laenge: 3.0, eulerFall: 2, nEd: 50, fc0k: c24.fc0k, E005: c24.E005, brettschichtholz: false, nkl: 1, kled: 'mtl' });
pruefe('HB λ_rel', st.lambda_rel_z, 1.4685);
pruefe('HB k_c', st.k_cz, 0.39343);
pruefe('HB F_c,R,d', st.F_c_R_d_kN, 97.618);
pruefe('HB Ausnutzung', st.utilization, 51.22);
gilt(BETA_C.vollholz === 0.2 && BETA_C.bsh === 0.1 && knickbeiwert(st.lambda_rel_z, false) === st.k_cz, 'DSD-HB-1: β_c zentral (0,2/0,1)');

// baustatik: Beispiel 1 Einfeldträger und Beispiel 2 Zweifeldträger
const t1 = traeger({ system: 'einfeld', l: 6, l1: 3, q: 10, f: 50, a: 2, m0: 0, am: 0 });
pruefe('BS A', t1.A, 63.333);
pruefe('BS B', t1.B, 46.667);
pruefe('BS M(2)', t1.M(2), 106.667);
const t2 = traeger({ system: 'zweifeld', l: 10, l1: 5, q: 20, f: 0, a: 0, m0: 0, am: 0 });
pruefe('BS M_B', t2.MB, -62.5);
pruefe('BS B Zweifeld', t2.B, 125);

// bodenmechanik: Beispiele 1 und 2
const z = zustandsgrenzen(25, 45, 20);
pruefe('BM I_C', z.iC, 0.8);
gilt(z.zustand === 'halbfest' && z.klasse.startsWith('TM'), `BM Zustand/Gruppe (${z.zustand}, ${z.klasse})`);
gilt(zustandsgrenzen(35, 45, 20).zustand === 'weich', 'BM w = 35 % → weich (I_C = 0,40)');
pruefe('BM A-Linie', aLinie(45), 18.25);
pruefe('BM E_a', erddruckRankine(30, 20, 5).E_a, 83.333);
const ko = konsolidierung(4, 50, 5, 2, 'zweiseitig');
pruefe('BM s', ko.s_end, 40);
pruefe('BM t_90', ko.t_90, 1.696);
pruefe('BM t_90 einseitig', konsolidierung(4, 50, 5, 2, 'einseitig').t_90, 6.784);

// stahlbau_ec3: Beispiele 2 und 3
const ipe = profil('IPE 300');
if (ipe) pruefe('ST M_pl,Rd IPE 300 S235', biegewiderstandY(ipe, 'S235').MplRd, 147.674); else fehler.push('ST IPE 300 fehlt');
const heb = stahlDruckstab({ profil: 'HEB 200', guete: 'S235', LcrY: 4, LcrZ: 4, nEd: 800 });
pruefe('ST χ_z HEB 200', heb.z.chi, 0.637, 5e-3);
pruefe('ST N_b,z,Rd', heb.z.NbRd, 1062.9, 5e-3);
pruefe('ST N_c,Rd', heb.NcRd, 1835.35, 5e-3);
pruefe('ST Zugstab N_u,Rd [kN]', 0.9 * 980 * 360 / 1.25 / 1000, 254.016);

// materialmodelle: Beispiel 1 B500B bilinear
const bl = bilinearVerfestigung({ fy: 500, E: 200000, Et: 2000, epsMaxPromille: 20 });
pruefe('MM σ_max', bl.sigmaMax, 535);
pruefe('MM ε_p', bl.epsPlastischPromille, 17.325);

// emodul: Beispiel 1 (Kalkstein) und Sandstein-Hinweis
pruefe('EM E_cm Quarzit', ecmEc2(30), 32.837);
pruefe('EM E_cm Kalkstein', ecmEc2(30, ALPHA_E.kalkstein), 29.553);
pruefe('EM E_cm Sandstein', ecmEc2(30, ALPHA_E.sandstein), 22.986);

// gesteine: Körnungsziffer B16 aus der zentralen Regelsieblinie
const b16 = REGELSIEBLINIEN[16].B;
const rueckstaende = [...b16.map(d => 100 - d), 0, 0].reduce((s, r) => s + r, 0);
pruefe('GE k(B16)', rueckstaende / 100, 3.66);
gilt(/0\{,\}25: 8\\,\\%;\\; 0\{,\}5: 20/.test(String(gesteine.daten['Gesteine.schritte'][0].formel)), 'GE Durchgänge B16 im Beispiel wie REGELSIEBLINIEN');

// putzemoertel: Gipsputz 50 m², 15 mm
pruefe('PM Trockenmörtel', 50 * 15 * PUTZ_VERBRAUCH.gips, 825);

// ---------------------------------------------------------------- Korrekturen
// DSD-HO-1: Buche (und Lärche) zentral; Holz und Holzbau lesen aus SCHWINDBEIWERTE
gilt(SCHWINDBEIWERTE.buche.radial === 0.2 && SCHWINDBEIWERTE.buche.tangential === 0.4, 'DSD-HO-1: Buche 0,20/0,40');
gilt(SCHWINDBEIWERTE.laerche.radial === 0.14 && SCHWINDBEIWERTE.laerche.tangential === 0.29, 'DSD-HO-1: Lärche 0,14/0,29');
const holzTsx = quelle('src/modules/Holz.tsx');
gilt(holzTsx.includes('schwindQ(SCHWINDBEIWERTE.buche)') && !/qr: 0\.22, qt: 0\.45/.test(holzTsx), 'DSD-HO-1: Holz-Modul Buche aus dem Kern');
gilt(quelle('src/modules/HolzbauBeta.tsx').includes('SCHWINDBEIWERTE[art as keyof typeof SCHWINDBEIWERTE]'), 'DSD-HO-1: Holzbau-Schwindrechner aus dem Kern');
const hbJson = (holzbau as { daten: Record<string, Record<string, { radial: number; tangential: number; longitudinal: number }>> }).daten['HolzbauBeta.shrinkageCoeffs'];
for (const art of Object.keys(SCHWINDBEIWERTE) as (keyof typeof SCHWINDBEIWERTE)[]) {
  const j = hbJson[art], c = SCHWINDBEIWERTE[art];
  gilt(!!j && j.radial === c.radial && j.tangential === c.tangential && j.longitudinal === c.longitudinal, `DSD-HO-1: ${art} im Holzbau-Inhalt wie zentral`);
}

// DSD-HO-2/-3, DSD-ME-1/-2, DSD-KU-1: Steckbriefe (BaustoffProfil)
const profilTsx = quelle('src/components/ui/BaustoffProfil.tsx');
gilt(GWP_LEHRWERTE.kvh.biogen === -820 && profilTsx.includes('${KVH_BIOGEN_T} t CO₂ je m³') && !profilTsx.includes('0,9 t CO2/m³'), 'DSD-HO-2: biogener Speicher aus GWP_LEHRWERTE.kvh (0,82 t/m³)');
gilt(profilTsx.includes('${FICHTE_T_ZU_L}-mal') && !profilTsx.includes('rund 30-mal stärker'), 'DSD-HO-3: Verhältnis tangential/längs aus SCHWINDBEIWERTE (36)');
gilt(Math.round(SCHWINDBEIWERTE.fichte.tangential / SCHWINDBEIWERTE.fichte.longitudinal) === 36, 'DSD-HO-3: 0,36/0,01 = 36');
gilt(!profilTsx.includes('21809') && profilTsx.includes('DIN 17860'), 'DSD-ME-1: Titanbleche nicht nach DIN EN ISO 21809 (Rohrbeschichtung)');
gilt(!profilTsx.includes('Edelmetall der Extraklasse') && !profilTsx.includes('entdeckte Edelmetall wurde'), 'DSD-ME-2: Titan nicht als Edelmetall');
gilt(profilTsx.includes('etwa 7- bis 20-mal größer als Beton/Stahl') && !profilTsx.includes('bis zu 10-mal größer'), 'DSD-KU-1: Wärmedehnung Kunststoffe wie Modul (7- bis 20-mal)');

// DSD-BM-1: Zustandsgrenzen im Rechenweg mit 0,25; A-Linie aus dem Kern
const bmTsx = quelle('src/modules/Bodenmechanik.tsx');
gilt(bmTsx.includes('0 / 0,25 / 0,50 / 0,75 / 1,00') && !bmTsx.includes('0 / 0,50 / 0,75 / 1,00:'), 'DSD-BM-1: Grenze 0,25 (DIN EN ISO 14688-2) im Rechenweg');
gilt(bmTsx.includes('aLinie(wL)') && !bmTsx.includes('0.73 * (wL - 20)'), 'DSD-BM-2: A-Linie aus src/calc/boden.ts');

// DSD-KO-1/-2: Kombinationen
gilt(/vorläufig, Normprüfung ausstehend/.test(kombi.texte.wasseraufnahmeW01), 'DSD-KO-1: Kriterium Hydrophobierung gekennzeichnet');
gilt(/OS 8, OS 11/.test(kombi.texte.haftzugAnforderung) && /1,0 N\/mm²/.test(kombi.texte.haftzugAnforderung), 'DSD-KO-2: Haftzug 1,5/1,0 N/mm² nur für befahrbare Systeme');
gilt(!quelle('src/modules/Kombinationen.tsx').includes('Mindestanforderung Betoninstandsetzung'), 'DSD-KO-2: keine pauschale Mindestanforderung 1,5 MPa');
gilt(!quelle('src/data/kurzfassung.ts').includes('für die Betoninstandsetzung gilt mindestens 1,5 MPa'), 'DSD-KO-2: Kurzfassung angeglichen');

// DSD-HW-1: Rechenwert 0,24 %/% gekennzeichnet
gilt(/0,24 %\/%.*vorläufig, Normprüfung ausstehend/.test(holzbauWerkstoffe.texte.holzIstEinHygroskopischer), 'DSD-HW-1: 0,24 %/% gekennzeichnet');

// DSD-HB-1, DSD-MM-1, DSD-EM-1, DSD-ST-1: Faktoren aus den Kernen statt fest verdrahtet
const hbTsx = quelle('src/modules/holzbaubeta/HolzbauBemessung.tsx');
gilt(!hbTsx.includes("'0{,}1' : '0{,}2'") && !hbTsx.includes('γ_M = 1,3.') && !hbTsx.includes('${calculationResults.k_mod} \\\\times'), 'DSD-HB-1: β_c, γ_M und k_mod im Rechenweg aus dem Kern/formatiert');
const mmTsx = quelle('src/modules/Materialmodelle.tsx');
gilt(mmTsx.includes('setFyVal(BETONSTAHL.B500B.fyk)') && mmTsx.includes('setFyVal(BAUSTAHL_EC3.S355.fy)') && !mmTsx.includes('setEModVal(210000)'), 'DSD-MM-1: Stahlkennwerte aus src/data/kennwerte.ts');
gilt(quelle('src/modules/EModul.tsx').includes('value={ALPHA_E.basalt}') && ALPHA_E.basalt === 1.2 && ALPHA_E.sandstein === 0.7, 'DSD-EM-1: α_E aus src/calc/betonkennwerte.ts');
const stTsx = quelle('src/modules/StahlbauEC3.tsx');
gilt(!stTsx.includes('\\\\pi^2 \\\\cdot 210\\\\,000') && !stTsx.includes('}}{1{,}1} ='), 'DSD-ST-1: E und γ_M1 im Rechenweg aus EC3_NA_DE');

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log('OK: Durchsicht D 29.10.2026');
