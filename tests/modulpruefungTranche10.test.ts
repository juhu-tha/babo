// Modulprüfung Tranche 10 (28.10.2026): unabhängige Nachrechnungen Holzbau (Werkstoffe, Verbindungen, Bauphysik) und Mechanik
// (Befundliste docs/pruefung/module-tranche-10.md). Die Sollwerte stammen aus einem eigenen Prüfskript (eigene Umsetzung der
// Norm- bzw. Modellgleichungen in Python), nicht aus den Kernen oder vorhandenen Tests übernommen.
import { holzschraube, abbrandQuerschnitt } from '../src/calc/holzbau';
import { bspSchwingung, BSP_AUFBAUTEN } from '../src/calc/bspSchwingung';
import { stabKenngroessen } from '../src/calc/mechanischeKenngroessen';
import { biegelinie } from '../src/calc/biegelinie';
import { traeger, dreigelenkrahmen } from '../src/calc/statik';
import { EULER_BETA, eulerEigenform, KL_EULER_FALL_3 } from '../src/calc/stabilitaet';
import { ecmEc2, verbundSchranken } from '../src/calc/emodul';
import { grenzhoehen, wuerfelstapel } from '../src/calc/festigkeitsvergleich';
import { hauptspannungen, transformiere } from '../src/calc/spannungszustand';
import { bilinearVerfestigung } from '../src/calc/werkstoffmodelle';
import { maxwellRelaxation, zenerRelaxation, halbwertszeit } from '../src/calc/kriechenSchwinden';
import { MATERIALIEN } from '../src/modules/mechanischekenngroessen/daten';
import { dataholzConstructions } from '../src/modules/holzbaubeta/daten';

const fehler: string[] = [];
const nahe = (ist: number, soll: number, tol = 5e-3) => Math.abs(ist - soll) <= tol * Math.max(Math.abs(soll), 1e-9);
const pruefe = (fall: string, ist: number, soll: number, tol = 5e-3) => { if (!nahe(ist, soll, tol)) fehler.push(`${fall}: ist ${ist}, soll ${soll}`); };
const gilt = (ok: boolean, fall: string) => { if (!ok) fehler.push(fall); };

console.log('--- Test: Modulprüfung Tranche 10 (Nachrechnungen) ---');

// 1. Holzschrauben DIN EN 1995-1-1, 8.7.2 (8.38–8.41) und 8.2.2 (Johansen mit Seileffekt), γ_M = 1,3
const hs1 = holzschraube({ rhok: 350, d: 8, lef: 80, alpha: 90, n: 4, nkl: 1, kled: 'mtl' });
pruefe('HS1 f_ax,k', hs1.f_ax_k, 12.8648); pruefe('HS1 F_ax,Rk je Schraube', hs1.F_ax_Rk_single_N, 8233.49);
pruefe('HS1 F_ax,Rd Gruppe', hs1.F_ax_Rd_total_kN, 17.6435); pruefe('HS1 f_h,k', hs1.f_h_k, 26.404);
pruefe('HS1 M_y,Rk', hs1.M_y_Rk, 26743.3); pruefe('HS1 F_v,Rk je Schraube', hs1.F_v_Rk_single_N, 5923.82); pruefe('HS1 F_v,Rd', hs1.F_v_Rd_total_kN, 14.5817);
const hs2 = holzschraube({ rhok: 385, d: 10, lef: 120, alpha: 45, n: 6, nkl: 2, kled: 'krt' });
pruefe('HS2 F_ax,Rd (45°)', hs2.F_ax_Rd_total_kN, 45.1729); pruefe('HS2 F_v,Rd', hs2.F_v_Rd_total_kN, 38.3986);
const hs3 = holzschraube({ rhok: 380, d: 12, lef: 60, alpha: 90, n: 2, nkl: 3, kled: 'mtl' });
pruefe('HS3 F_ax,Rd (NKL 3, k_mod = 0,65)', hs3.F_ax_Rd_total_kN, 7.75629); pruefe('HS3 F_v,Rd', hs3.F_v_Rd_total_kN, 10.2510);
gilt(hs3.hinweise.some(h => h.feld === 'lef'), 'HS3 Hinweis l_ef < 6·d');

// 2. Abbrand mit reduziertem Querschnitt (DIN EN 1995-1-2:2010-12, 4.2.2)
const br1 = abbrandQuerschnitt('nadel', 30, 120, 240, 4);
pruefe('BR1 d_ef', br1.d_ef, 31); pruefe('BR1 b_fi', br1.b_fi, 58); pruefe('BR1 h_fi', br1.h_fi, 178);
pruefe('BR1 Flächenverlust', br1.areaLossPercent, 64.1528); pruefe('BR1 W-Verlust', br1.stiffnessLossPercent, 73.4133);
const br2 = abbrandQuerschnitt('bsh', 60, 160, 320, 3);
pruefe('BR2 b_fi', br2.b_fi, 62); pruefe('BR2 h_fi (3-seitig)', br2.h_fi, 271); pruefe('BR2 W-Verlust', br2.stiffnessLossPercent, 72.2086);
pruefe('BR3 d_ef mit k₀ = 0,5 (10 min, BSP)', abbrandQuerschnitt('clt', 10, 200, 200, 4).d_ef, 10);
const br4 = abbrandQuerschnitt('laub', 90, 100, 200, 4);
pruefe('BR4 d_ef', br4.d_ef, 56.5); gilt(br4.isCollapsed && br4.stiffnessLossPercent === 100, 'BR4 kein Restquerschnitt');

// 3. BSP-Deckenschwingung (proHolz Band II, Gl. 4.1/4.2; EN 1995-1-1 Gl. 7.5 und Anhang B)
const bsp1 = bspSchwingung({ spannweite: 4.8, lagen: BSP_AUFBAUTEN.l5_150.lagen, deckenbreite: 5, zusatzmasse: 100, estrichDicke: 0, estrichArt: 'zement', verfahren: 'gamma' });
pruefe('BSP1 γ₁', bsp1.gamma_aussen ?? NaN, 0.935886); pruefe('BSP1 (EI)_γ', bsp1.EI_l, 2412811); pruefe('BSP1 m', bsp1.masse, 184.098);
pruefe('BSP1 f₁', bsp1.f1, 7.80503); pruefe('BSP1 b_F', bsp1.b_F, 3.17433); pruefe('BSP1 w(1 kN)', bsp1.w1kN, 0.300820);
const bsp2 = bspSchwingung({ spannweite: 3.5, lagen: [30, 40, 30], deckenbreite: 4, zusatzmasse: 50, estrichDicke: 0, estrichArt: 'zement', verfahren: 'gamma' });
pruefe('BSP2 γ (3-lagig)', bsp2.gamma_aussen ?? NaN, 0.920897); pruefe('BSP2 f₁', bsp2.f1, 11.3688); pruefe('BSP2 w(1 kN)', bsp2.w1kN, 0.645828);

// 4. Mechanische Kenngrößen (Beispiel 1 des Moduls und Druckstab C24)
const s235 = MATERIALIEN.s235;
const mk1 = stabKenngroessen({ werkstoff: s235, lastArt: 'zug', kraftKn: 120, laengeM: 4, querschnitt: 'rund', durchmesserMm: 30, breiteMm: 0, hoeheMm: 0, kriechZahl: 0, schwindPromille: 0 });
pruefe('MK1 A', mk1.A0_mm2, 706.858); pruefe('MK1 EA', mk1.EA_MN, 148.440); pruefe('MK1 σ', mk1.sigma, 169.765);
pruefe('MK1 ΔL', mk1.deltaL_mm, 3.23362); pruefe('MK1 Δd', mk1.deltaD_mm, -0.00727565); pruefe('MK1 U', mk1.U_Joule, 194.017);
pruefe('MK1 G', mk1.G_MPa, 80769.2); pruefe('MK1 K', mk1.K_MPa, 175000);
const mk2 = stabKenngroessen({ werkstoff: MATERIALIEN.holz_c24, lastArt: 'druck', kraftKn: 50, laengeM: 3, querschnitt: 'rechteck', durchmesserMm: 0, breiteMm: 100, hoeheMm: 200, kriechZahl: 0, schwindPromille: 0 });
pruefe('MK2 I_min', mk2.I_min_mm4, 16666667); pruefe('MK2 F_K (Fall 2)', mk2.F_K_kN, 201.047); pruefe('MK2 σ', mk2.sigma, -2.5);
pruefe('MK2 w (F mittig, starke Achse)', mk2.biegedurchbiegung_mm, 38.3523);
gilt(MATERIALIEN.alu_6060.fy === 160 && MATERIALIEN.alu_6060.fu === 215 && MATERIALIEN.alu_6060.name.includes('T66'), 'Alu 6060: 160/215 N/mm² gehören zu T66 (EN 755-2), nicht T6');

// 5. Biegelinie (Grundlastfälle, Gross/Hauger/Schröder/Wall TM 2)
pruefe('BL1 w Gleichlast C24 12/24, 5 m', biegelinie({ lagerung: 'einfeldtraeger', L: 5, F: 0, a: 0, q: 10, E: 11000, I: 13824 }).wMax, 53.5171);
const bl2 = biegelinie({ lagerung: 'einfeldtraeger', L: 5, F: 20, a: 1.5, q: 0, E: 210000, I: 8356 });
pruefe('BL2 x(w_max) = L − √((L² − a²)/3)', bl2.xWMax, 2.24621, 1e-4); pruefe('BL2 w_max', bl2.wMax, 2.38014); pruefe('BL2 w Feldmitte', bl2.wKenn, 2.35075);
const bl3 = biegelinie({ lagerung: 'kragarm', L: 3, F: 5, a: 2, q: 2, E: 11500, I: 13824 });
pruefe('BL3 w Kragarmende', bl3.wKenn, 27.4150); pruefe('BL3 Neigung Ende', bl3.phiB, 11.9515);

// 6. Baustatik (Gleichgewicht, Dreimomentengleichung)
const st1 = traeger({ system: 'einfeld', l: 6, l1: 3, q: 10, f: 50, a: 2, m0: 0, am: 0 });
pruefe('ST1 A', st1.A, 63.3333); pruefe('ST1 B', st1.B, 46.6667); pruefe('ST1 M(2)', st1.M(2), 106.667);
const st2 = traeger({ system: 'zweifeld', l: 10, l1: 4, q: 10, f: 0, a: 0, m0: 0, am: 0 });
pruefe('ST2 M_B (l₁ = 4, l₂ = 6)', st2.MB, -35); pruefe('ST2 A', st2.A, 11.25); pruefe('ST2 B', st2.B, 64.5833); pruefe('ST2 C', st2.C, 24.1667);
pruefe('ST3 M_B Einzellast Feld 1', traeger({ system: 'zweifeld', l: 10, l1: 5, q: 0, f: 30, a: 2, m0: 0, am: 0 }).MB, -12.6);
const st4 = dreigelenkrahmen(4, 6, 10, 20);
pruefe('ST4 A_v', st4.Av, 16.6667); pruefe('ST4 B_v', st4.Bv, 43.3333); pruefe('ST4 B_h (nach innen)', st4.Bh, 21.25);
pruefe('ST4 |M_Ecke links|', Math.abs(st4.M_Ecke_Links), 5); pruefe('ST4 |M_Ecke rechts|', Math.abs(st4.M_Ecke_Rechts), 85);
const st5 = traeger({ system: 'kragarm', l: 3, l1: 1, q: 5, f: 10, a: 3, m0: 4, am: 3 });
pruefe('ST5 A Kragarm', st5.A, 25); pruefe('ST5 M_A', st5.MA, -56.5);

// 7. Knicken (Euler-Fälle, Eigenform Fall 3)
const fk2 = (Math.PI ** 2 * 210000 * 8.5e6) / (EULER_BETA[2] * 3500) ** 2 / 1000;
pruefe('KN1 F_K Fall 2 (Beispiel)', fk2, 1438.14);
pruefe('KN1 F_K Fall 3 / Fall 2', 1 / EULER_BETA[3] ** 2, 2934.98 / 1438.14);
pruefe('KN2 β Fall 3 = π/kℓ ≈ 0,7', Math.PI / KL_EULER_FALL_3, 0.699156);
pruefe('KN2 Fall 3: w(ℓ) = 0', eulerEigenform(3, 1) + 1, 1, 1e-9);
pruefe('KN2 Fall 3: Größtwert 1 bei ξ ≈ 0,60', eulerEigenform(3, 0.6015), 1, 1e-4);
gilt(Math.abs(eulerEigenform(3, 0.3)) > 0.3 && eulerEigenform(3, 0.85) > 0.3, 'KN2 Fall 3: Ausbiegung auch oberhalb von 0,7·ℓ (vorher w = 0)');
gilt(Math.abs(eulerEigenform(1, 1) - 1) < 1e-12 && Math.abs(eulerEigenform(2, 0.5) - 1) < 1e-12 && Math.abs(eulerEigenform(4, 0.5) - 1) < 1e-12, 'KN2 Fälle 1, 2, 4 auf 1 normiert');
for (const f of [1, 2, 3, 4] as const) for (let i = 0; i <= 100; i++) { const w = eulerEigenform(f, i / 100); gilt(Number.isFinite(w) && w > -1e-9 && w <= 1 + 1e-9, `KN2 Fall ${f} ξ = ${i / 100}: 0 ≤ w ≤ 1`); }

// 8. E-Modul (DIN EN 1992-1-1, 3.1.3; Voigt, Reuss, Hashin-Shtrikman)
pruefe('EM1 E_cm C30/37', ecmEc2(30), 32.8366); pruefe('EM1 Kalkstein', ecmEc2(30, 0.9), 29.5529); pruefe('EM1 Sandstein', ecmEc2(30, 0.7), 22.9856);
const sch = verbundSchranken(60, 20, 0.7);
pruefe('EM2 Voigt', sch.voigt, 48); pruefe('EM2 Reuss', sch.reuss, 37.5); pruefe('EM2 HS unten', sch.hsUnten, 41.5385); pruefe('EM2 HS oben', sch.hsOben, 44.3478);

// 9. Festigkeit (Grenzhöhe, Reißlänge, Würfelstapel, ebener Spannungszustand)
const c20 = { rho: 2400, fc: 20, ft: 2.2, E: 30000 };
pruefe('FE1 H_max C20/25', grenzhoehen(c20).H_max, 849.473); pruefe('FE1 L_max S235', grenzhoehen({ rho: 7850, fc: 235, ft: 360, E: 210000 }).L_max, 4674.81);
const wu = wuerfelstapel(c20, 10);
pruefe('FE2 N', wu.N_max, 8494); pruefe('FE2 σ unten', wu.sigma_bottom, 19.9983); pruefe('FE2 δ unten', wu.delta_bottom, 0.0666609); pruefe('FE2 δ gesamt', wu.delta_total, 283.142);
const sz = hauptspannungen({ sx: 80, sy: -40, txy: 30 }, 235);
pruefe('FE3 σ₁', sz.sigma1, 87.0820); pruefe('FE3 σ₂', sz.sigma2, -47.0820); pruefe('FE3 φ₁', sz.phi1Grad, 13.2825);
pruefe('FE3 von Mises', sz.sigmaVMises, 117.898); pruefe('FE3 Tresca', sz.sigmaVTresca, 134.164);
const gs = transformiere({ sx: 80, sy: -40, txy: 30 }, 30);
pruefe('FE4 σ_ξ(30°)', gs.sXi, 75.9808); pruefe('FE4 τ_ξη(30°)', gs.tXiEta, -36.9615);

// 10. Materialmodelle und Rheologie (Beispiele des Moduls)
const bv = bilinearVerfestigung({ fy: 500, E: 200000, Et: 2000, epsMaxPromille: 20 });
pruefe('MM1 ε_y', bv.epsYPromille, 2.5); pruefe('MM1 σ_max', bv.sigmaMax, 535); pruefe('MM1 ε_p', bv.epsPlastischPromille, 17.325); pruefe('MM1 k', bv.k, 1.07);
pruefe('MM2 Maxwell σ(3 s)', maxwellRelaxation(10, 3, 2), 2.23130); pruefe('MM2 t½', halbwertszeit(2), 1.38629); pruefe('MM2 Zener σ(10 s)', zenerRelaxation(10, 10, 2), 4.04043);

// 11. Bruchmechanik (LEBM, K_I = Y·σ·√(π·a); Inline-Formel des Moduls)
const kI = (Y: number, s: number, aM: number) => Y * s * Math.sqrt(Math.PI * aM);
pruefe('BM1 σ_c Glas (a = 0,5 mm)', 0.75 / kI(1.12, 1, 5e-4), 16.8960); pruefe('BM1 K_I Stahl (a = 10 mm)', kI(1.12, 200, 0.01), 39.7030);

// 12. Bauteilaufbauten: U-Wert der BSP-Geschossdecke aus den angegebenen Schichten nachgerechnet
pruefe('HW1 U Geschossdecke BSP 140', dataholzConstructions.find(c => c.id === 'de_clt_01')?.uValue ?? NaN, 1 / (0.34 + 0.065 / 1.2 + 0.03 / 0.035 + 0.06 / 0.7 + 0.14 / 0.13), 0.02);

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log('OK: Modulprüfung Tranche 10');
