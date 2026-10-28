// Modulprüfung Tranche 2 (28.10.2026): unabhängige Nachrechnungen der Rechenkerne (Befundliste docs/pruefung/module-tranche-2.md).
// Die Sollwerte stammen aus einem eigenen Prüfskript (eigene Umsetzung der Norm- bzw. Modellgleichungen in Python mit numpy/scipy),
// nicht aus den Kernen oder vorhandenen Tests übernommen. Monte-Carlo-Werte: eigene Simulation mit 10⁶ Läufen, Toleranz 3 Standardfehler.
import { bemesseVerankerung } from '../src/calc/verankerung';
import { bemesseRiss } from '../src/calc/rissbreite';
import { betonSdParameter, betonParabelRechteck, betonstahlParameter, betonstahlSpannung } from '../src/calc/werkstoffmodelle';
import { bemesseEinfeldbalken } from '../src/calc/holzbau';
import { frictionSlip, creep, shrinkage, relaxation, timeDependentLoss, pruefeSpannbeton } from '../src/calc/spannbeton';
import { lebensdauerbemessung, FIB_KARBONATISIERUNG, FIB_CHLORID, rInvAusAcc, rInvStreuung, type LebensdauerEingabe } from '../src/calc/lebensdauer';
import { abtragsrateFaraday, chloridProfil } from '../src/calc/korrosion';
import { schnellkarbonatisierung } from '../src/calc/schnellkarbonatisierung';
import { grubbsKritisch, fraktilfaktorKn, statistikAuswertung, zweistichprobenTTest } from '../src/calc/statistik';
import { lcaBilanz, type LcaZeile } from '../src/calc/lca';
import { MATERIAL_DATABASE, alsLcaBaustoff } from '../src/modules/interactivelcacalc/daten';
import { atterberg, konsolidierung } from '../src/calc/boden';
import { glaser, TAUPERIODE_DIN_4108_3, verdunstungDin4108_3 } from '../src/calc/glaser';

const fehler: string[] = [];
const nahe = (ist: number, soll: number, tol = 5e-3) => Math.abs(ist - soll) <= tol * Math.max(Math.abs(soll), 1e-9);
const pruefe = (fall: string, ist: number, soll: number, tol = 5e-3) => { if (!nahe(ist, soll, tol)) fehler.push(`${fall}: ist ${ist}, soll ${soll}`); };
const gilt = (ok: boolean, fall: string) => { if (!ok) fehler.push(fall); };

console.log('--- Test: Modulprüfung Tranche 2 (Nachrechnungen) ---');

// 1. Verankerung (EC2 8.4 + NA DE, f_ctk;0,05 aus Tab. 3.1): V1 C30/37 Ø16 gut, Zug, gerade, A_s,erf/A_s,vorh = 10/12
const vB = { fck: 30, fyk: 500, phi: 16, verbund: 'gut', beanspruchung: 'zug', art: 'verankerung', form: 'gerade', alpha2: 1, alpha3: 1, alpha5: 1, asErf: 10, asVorh: 12 } as const;
const v1 = bemesseVerankerung(vB);
pruefe('V1 f_bd', v1.fbd, 3.0); pruefe('V1 l_b,rqd', v1.lbRqd, 579.710); pruefe('V1 l_bd', v1.lbd, 483.092);
// V2: C50/60 Ø28 mäßig, Haken, α₂·α₃ = 0,72 → l_bd = 0,7·0,72·999,5 = 503,7 mm
pruefe('V2 l_bd', bemesseVerankerung({ ...vB, fck: 50, phi: 28, verbund: 'maessig', form: 'haken', alpha2: 0.9, alpha3: 0.8, asErf: 1, asVorh: 1 }).lbd, 503.748);
// V3: Übergreifung C25/30 Ø12, α₆ = 1,5 → l₀ = 724,6 mm; V4: Druck Ø40 (η₂ = 0,92), Mindestlänge 0,6·l_b,rqd = 945,2 mm maßgebend
// V3 seit T2-S-1 (28.10.2026) mit α₆ nach NA DE Tab. 8.3DE (vorläufig): Ø 12, Stoßanteil > 33 % → α₆ = 1,4 (EC2-Empfehlung 1,5: 724,638)
pruefe('V3 l_0', bemesseVerankerung({ ...vB, fck: 25, phi: 12, art: 'uebergreifung', asErf: 1, asVorh: 1 }).lbd, 676.329);
pruefe('V4 l_b,min', bemesseVerankerung({ ...vB, phi: 40, beanspruchung: 'druck', asErf: 2, asVorh: 10 }).lbd, 945.180);
// V5: C70/85 → f_ctd mit C60/75 begrenzt (f_ctk;0,05 = 3,1)
pruefe('V5 f_bd', bemesseVerankerung({ ...vB, fck: 70, asErf: 1, asVorh: 1 }).fbd, 4.65);

// 2. Rissbreite (7.3.4, Gl. 7.11DE, 7.9): R1 Platte h = 200, Ø16/20, σ_s = 250, k_t = 0,4 → x = 38,07 mm, w_k = 0,2156 mm
const rB = { h: 200, b: 1000, cNom: 35, phi: 16, abstand: 20, sigmaS: 250, fctEff: 2.9, ecm: 33000, beanspruchung: 'biegung', zwangNach28d: false, kt: 0.4, wkReq: 0.3 } as const;
const r1 = bemesseRiss(rB);
pruefe('R1 x', r1.x, 38.0689); pruefe('R1 h_c,ef', r1.hcEf, 53.977); pruefe('R1 s_r,max', r1.srMax, 238.631); pruefe('R1 w_k', r1.wkCalc, 0.21559); pruefe('R1 A_s,min', r1.asMinReq, 371.2);
// R2 zentrischer Zug mit Zwang nach 28 d (f_ct,eff ≥ 3,0): s_r,max = σ_s·φ/(3,6·f_ct,eff) = 222,2 mm, A_s,min = 3 600 mm²
const r2 = bemesseRiss({ ...rB, h: 300, cNom: 40, phi: 12, abstand: 10, sigmaS: 200, beanspruchung: 'zug', zwangNach28d: true, kt: 0.6 });
pruefe('R2 s_r,max', r2.srMax, 222.222); pruefe('R2 w_k', r2.wkCalc, 0.133333); pruefe('R2 A_s,min', r2.asMinReq, 3600);
pruefe('R3 w_k', bemesseRiss({ ...rB, h: 600, b: 300, cNom: 30, phi: 25, abstand: 10, sigmaS: 300, fctEff: 3.5, ecm: 35000 }).wkCalc, 0.19668);

// 3. σ-ε-Linien (Tab. 3.1, Gl. 3.17): C70/85 n = 1,45, ε_c2 = 2,4 ‰ → σ(1 ‰) = f_cd·[1 − (1 − 1/2,4)^1,45]; B500B σ_char(10 ‰) = 506,3
const p70 = betonSdParameter(70);
pruefe('SE C70 σ(1 ‰)', betonParabelRechteck(1, p70) ?? NaN, 39.6667 * (1 - Math.pow(1 - 1 / 2.4, 1.45)));
pruefe('SE B500B σ_char(10 ‰)', betonstahlSpannung(10, betonstahlParameter('B500B')).char ?? NaN, 506.316);
gilt(betonstahlSpannung(30, betonstahlParameter('B500B')).bemessung === null, 'SE B500B: Bemessungslinie endet bei ε_ud = 25 ‰');

// 4. Holz-Einfeldbalken (Befund T2-H-1, behoben): ständige Kombination 1,35·g mit k_mod(ständig)
//    HE2: KVH C24 10/20, l = 4,0 m, e = 0,625 m, g_k = 3,0, q_k = 0,5 kN/m²: g = 1,9574, q = 0,3125 kN/m
//    1,35·g + 1,5·q = 3,1112 kN/m mit k_mod 0,8 → η = 63,2 %; 1,35·g = 2,6425 kN/m mit k_mod 0,6 → η = 71,6 % (maßgebend)
const hB = { l: 4.5, abstand: 0.625, gk: 1.0, qk: 1.5, b: 100, h: 200, fmk: 24, fvk: 4.0, E0mean: 11000, rhoMean: 420, brettschichtholz: false, nkl: 1, kled: 'mtl', gammaM: 1.3 } as const;
const he2 = bemesseEinfeldbalken({ ...hB, gk: 3.0, qk: 0.5, l: 4.0 });
gilt(he2.kombination === 'G', `HE2 maßgebend ständige Kombination (ist ${he2.kombination})`);
pruefe('HE2 q_d', he2.q_d, 2.6425); pruefe('HE2 k_mod', he2.kmod, 0.6); pruefe('HE2 η_m', he2.eta_m, 71.5676); pruefe('HE2 η_v', he2.eta_v, 42.9406);
pruefe('HE2 η_m (G+Q)', he2.eta_m_GQ, 63.1972);
// HE1 (Rechenbeispiel des Moduls) bleibt unverändert: 1,35·g + 1,5·q maßgebend, η_m = 60,70 %
const he1 = bemesseEinfeldbalken(hB);
gilt(he1.kombination === 'G+Q', 'HE1 maßgebend 1,35·g + 1,5·q'); pruefe('HE1 η_m', he1.eta_m, 60.7029);
// HE3 BSH NKL 2: w_fin = w_G·1,8 + w_Q·1,24 = 23,43 mm; HE4 ohne Nutzlast: nur ständige Kombination, k_mod = 0,6
const he3 = bemesseEinfeldbalken({ ...hB, gk: 2.5, qk: 2.0, b: 120, h: 240, fvk: 3.5, E0mean: 11500, brettschichtholz: true, nkl: 2, l: 5.0 });
pruefe('HE3 η_m', he3.eta_m, 76.1235); pruefe('HE3 w_fin', he3.w_fin, 23.4251); pruefe('HE3 w_net,fin', he3.w_net_fin, 18.9460);
const he4 = bemesseEinfeldbalken({ ...hB, qk: 0 });
gilt(he4.kombination === 'G' && he4.kmod === 0.6, 'HE4 q_k = 0 → k_mod ständig'); pruefe('HE4 η_m', he4.eta_m, 32.7347);
// Grenze g_k = 3,33·q_k (NKL 1, KLED mittel): knapp darunter G+Q, knapp darüber G
const gq = (g: number, q: number) => bemesseEinfeldbalken({ ...hB, gk: g, qk: q, rhoMean: 1e-9 }).kombination;
gilt(gq(3.30, 1.0) === 'G+Q' && gq(3.36, 1.0) === 'G', 'HE Grenze g/q = 10/3');

// 5. Spannbeton (EC2 5.10.5, 3.3.2, Anhang B, Gl. 5.46)
const fs = frictionSlip(3000, 2250, 195000, 0.2, 0.3, 0.005, 30, 6, 15);
pruefe('SB1 l_set', fs.l_set, 17.4889); pruefe('SB1 σ(15 m) nach Schlupf', fs.sigma_x_final, 1255.622);
pruefe('SB2 φ(∞; 28 d) C40 N', creep(40, 28, 'N', 250, 70), 1.53640); pruefe('SB2 φ(∞; 7 d) C30 R', creep(30, 7, 'R', 150, 50), 2.89828);
pruefe('SB3 ε_cs C40 N', shrinkage(40, 'N', 250, 70).eps_cs, 0.331921);
pruefe('SB4 Δσ_pr Kl. 2', relaxation(1300, 1860, 2, 500000).delta_sigma_pr, 50.4753);
pruefe('SB5 Δσ_p,c+s+r', timeDependentLoss(195000, 35000, 2250, 500 * 1200, (500 * 1200 ** 3) / 12, 450, 2.0, 0.5, 40, 12).delta_sigma_p_csr, 229.683);
const sbH = pruefeSpannbeton({ p0: 3000, b: 500, h: 1200, ep: 450, mG1: 300, mPerm: 600, mChar: 900, concreteAge: 7, spanLength: 30, frictionCoeff: 0.2, wobbleCoeff: 0.005, totalCurvature: 0.3, anchorSlip: 6, nTendons: 4 });
gilt(sbH.some(x => x.feld === 'dekompression' && x.text.includes('100 mm') && !x.text.includes('25 mm')), 'SB Dekompressionshinweis nach NA DE (Befund T2-P-1)');

// 6. Lebensdauerbemessung (fib Bulletin 34), Beispiele des Moduls (N = 20 000, Startwert 1); eigene MC mit 10⁶ Läufen:
//    Beispiel 1 (XC3, c = 35 ± 8 mm, RH Beta 65 ± 10, x_c,ACC = 5 mm): p_f = 0,0760, β = 1,433; Mittelwertrechnung 126,6 a
//    Beispiel 2 (XD3, CEM III/B, D_RCM,0 = 1,9, c = 55 ± 8 mm): p_f = 0,1006; CEM I (D_RCM,0 = 10, a = 0,30): p_f = 0,7269
const FK = FIB_KARBONATISIERUNG, FC = FIB_CHLORID;
const rI = rInvAusAcc(5);
const lE = (mech: 'karbonatisierung' | 'chlorid', drcm = 1.9, binder: 'cemI' | 'huettensand' = 'huettensand'): LebensdauerEingabe => ({
  mechanismus: mech, nutzungsdauer: 50, betaZiel: 1.3, laeufe: 20000, startwert: 1,
  karbonatisierung: { deckung: { typ: 'normal', m: 35, s: 8 }, rh: { typ: 'beta', m: 65, s: 10, a: 40, b: 100 }, tc: 7, bc: FK.bc, kt: FK.kt, rInv: { typ: 'normal', m: rI, s: rInvStreuung(rI) }, epsT: FK.epsT, cS: FK.cSatm, pSR: 0, tow: 0, bw: FK.bw },
  chlorid: { deckung: { typ: 'normal', m: 55, s: 8 }, cCrit: FC.cCrit, c0: 0.1, cS: { typ: 'lognormal', m: 3, s: 1.5 }, dx: FC.dxSpritz, dRcm: { typ: 'normal', m: drcm, s: 0.2 * drcm }, a: FC.alterung[binder], be: FC.be, tReal: { typ: 'normal', m: 10, s: 5 }, kt: 1 },
});
const se = (p: number, n: number) => 3 * (Math.sqrt(p * (1 - p) / n) + Math.sqrt(p * (1 - p) / 1e6));
const l1 = lebensdauerbemessung(lE('karbonatisierung'));
gilt(Math.abs(l1.pf - 0.0760) <= se(0.076, 20000), `LD Beispiel 1 p_f ${l1.pf}`); pruefe('LD Beispiel 1 Mittelwert-Zeit', l1.mittelwerte.vergleich, 126.6, 2e-3);
const l2 = lebensdauerbemessung(lE('chlorid'));
gilt(Math.abs(l2.pf - 0.1006) <= se(0.1006, 20000), `LD Beispiel 2 p_f ${l2.pf}`);
const l3 = lebensdauerbemessung(lE('chlorid', 10, 'cemI'));
gilt(Math.abs(l3.pf - 0.7269) <= se(0.7269, 20000), `LD Beispiel 2 CEM I p_f ${l3.pf}`);

// 7. Korrosion, Schnellkarbonatisierung
pruefe('KO Faraday 1 µA/cm²', abtragsrateFaraday(1), 11.5985);
pruefe('KO C(40 mm; 50 a)', chloridProfil({ t: 50, cNom: 40, dApp: 10, cS: 3, a: 0.4 }).cBewehrung, 1.23123);
const sk = schnellkarbonatisierung({ punkte: [{ tTage: 0, xMm: 0.5 }, { tTage: 7, xMm: 3.1 }, { tTage: 28, xMm: 6.0 }, { tTage: 70, xMm: 9.3 }], mitAchsenabschnitt: true, cAcc: 3, cNat: 0.042, deckung: 25, nutzungsdauer: 50 });
pruefe('SK K_AC', sk.kAC, 1.05651); pruefe('SK K_nat', sk.kNat, 2.38828); pruefe('SK t(25 mm)', sk.tDeckung, 109.574);

// 8. Statistik: G_krit (ISO 5725-2, α = 5 %, zweiseitig) gegen die exakte Formel (Grubbs/Beck); k_n nach D7.2
const GEXAKT: [number, number][] = [[3, 1.1543], [5, 1.7150], [8, 2.1266], [10, 2.2900], [15, 2.5483], [20, 2.7082], [30, 2.9085], [50, 3.1282]];
for (const [n, g] of GEXAKT) pruefe(`ST G_krit n = ${n}`, grubbsKritisch(n), g, 1e-3);
pruefe('ST k_n n = 7', fraktilfaktorKn(7), 2.07735, 2e-3);
const st = statistikAuswertung({ werte: [38.2, 41.5, 39.9, 40.3, 42.1, 37.6, 40.8, 31.0], methode: 'grubbs', material: 'beton', ausreisserPruefen: true });
gilt(st.ausreisser.length === 1 && st.ausreisser[0] === 31.0, 'ST Grubbs: 31,0 auffällig (G = 2,233 > 2,127)'); pruefe('ST X_k', st.xk, 36.6251, 2e-3);
pruefe('ST Welch p', zweistichprobenTTest([31.2, 33.5, 30.8, 34.1, 32.6, 33.0], [29.5, 30.2, 31.8, 28.9, 30.7], 0.05, 'welch').p, 0.011218, 1e-3);

// 9. LCA: 400 m³ Beton CEM I, 20 m³ EPS (ND 40 a → 1 Ersatz), 30 m³ KVH; B6 Netzstrom 9 000 kWh/a + Fernwärme Erdgas-KWK 30 000 kWh/a
const mat = (id: string) => alsLcaBaustoff(MATERIAL_DATABASE.find(m => m.id === id)!);
const zeilen: LcaZeile[] = [
  { baustoff: mat('beton-cem1'), menge: 400, kreislaufquote: 65, sortenreinheit: 85, verwertung: 'downcycling' },
  { baustoff: mat('eps-daemmung'), menge: 20, kreislaufquote: 15, sortenreinheit: 50, verwertung: 'thermal' },
  { baustoff: mat('kvh'), menge: 30, kreislaufquote: 90, sortenreinheit: 92, verwertung: 'reuse' },
];
const lca = lcaBilanz({ zeilen, nrfR: 1000, nrfBeheizt: 900, betrachtungszeitraum: 50, transportDistanz: 50, transportFaktor: 0.118, mitB4: true,
  energie: { stromGeg: 12000, pvEigennutzung: 3000, waerme: 30000, waermeTraeger: 'fw_erdgas_kwk', nutzerstrom: true }, tgaSockel: 'ep_ueber40', gebaeudeart: 'wohnbau' });
pruefe('LCA B4', lca.b4, 2720); pruefe('LCA B6', lca.b6, 939888.93); pruefe('LCA D', lca.d, -25809.827); pruefe('LCA QNG', lca.spez.qng, 22.23458);

// 10. Boden: Mehrpunktverfahren (Ausgleichsgerade w über lg N) → w_L = 43,27 %, I_C = 0,715 (weich), TM
const a1 = atterberg({ w: 28, versuche: [{ schlaege: 16, w: 46.1 }, { schlaege: 22, w: 44.0 }, { schlaege: 29, w: 42.4 }, { schlaege: 37, w: 40.8 }], ausroll: [21.5, 22.3], organisch: false });
pruefe('BO w_L', a1.wL, 43.2722); pruefe('BO I_C', a1.iC, 0.714583); gilt(a1.gruppe?.kuerzel === 'TM' && a1.zustand === 'weich', 'BO TM/weich');
pruefe('BO Einpunkt w_L', atterberg({ w: 18, versuche: [{ schlaege: 24, w: 31.0 }], ausroll: [19.0, 19.6], organisch: false }).wL, 30.8473);
const ko = konsolidierung(4, 100, 5, 2, 'zweiseitig');
pruefe('BO s_end', ko.s_end, 80); pruefe('BO t_90', ko.t_90, 1.696);

// 11. Glaser (DIN 4108-3): Dach ohne Dampfbremse (Tauwasser an der Unterdeckbahn) und Innendämmung
const dach = [
  { name: 'Gipskarton', d: 0.0125, lambda: 0.25, mu: 8 },
  { name: 'Mineralwolle', d: 0.20, lambda: 0.035, mu: 1, nichtKapillar: true },
  { name: 'Unterdeckbahn', d: 0.0005, lambda: 0.2, mu: 200 },
];
const gd = glaser(dach, TAUPERIODE_DIN_4108_3, verdunstungDin4108_3('dach'));
pruefe('GL Dach M_c', gd.mc, 2.60407, 2e-2); pruefe('GL Dach M_ev', gd.mev, 16.5888, 2e-2);
gilt(gd.kriterien.some(k => !k.eingehalten), 'GL Dach: M_c > 1,0 kg/m² nicht eingehalten');
const gdb = glaser([dach[0], { name: 'Dampfbremse', d: 0.0002, lambda: 0.2, mu: 10000, nichtKapillar: true }, dach[1], dach[2]], TAUPERIODE_DIN_4108_3, verdunstungDin4108_3('dach'));
gilt(!gdb.tauwasser, 'GL Dach mit Dampfbremse s_d = 2 m: kein Tauwasser');
const gi = glaser([
  { name: 'Gipsputz', d: 0.01, lambda: 0.51, mu: 10 }, { name: 'PUR', d: 0.06, lambda: 0.025, mu: 50, nichtKapillar: true },
  { name: 'Kleber', d: 0.005, lambda: 0.8, mu: 15 }, { name: 'Ziegel', d: 0.365, lambda: 0.45, mu: 8 },
], TAUPERIODE_DIN_4108_3, verdunstungDin4108_3('wand'));
pruefe('GL Innendämmung M_c', gi.mc, 0.07898, 2e-2); pruefe('GL Innendämmung M_ev', gi.mev, 0.51047, 2e-2);

if (fehler.length) { fehler.forEach(f => console.log('FAIL ' + f)); process.exit(1); }
console.log('Alle Nachrechnungen Tranche 2 bestanden.');
