// Kleinfragen der Modulprüfung Tranche 1–3, umgesetzt nach den Entscheidungen vom 28.10.2026 (Handwerte, eigene Nachrechnung)
import { stoffraum, type MischungEingabe } from '../src/calc/mischung';
import { bemesseWandVereinfacht, fvk0NA, fkEmpfehlungENGenormt, fkEmpfehlungEN, normalmoertelGruppe } from '../src/calc/mauerwerk';
import { bemesseQuerdruck, bemesseDruckstab } from '../src/calc/holzbau';
import { statistikAuswertung, grubbsKritisch } from '../src/calc/statistik';
import { zustandsgrenzen, bodengruppePlastizitaet } from '../src/calc/boden';
import { adiabatischeErwaermung, WAERMEKAPAZITAET_VOL } from '../src/calc/hydratation';
import mauerwerk from '../content/mauerwerk/Mauerwerk.json';
import hydr from '../content/hydratationfolgen/HydratationFolgen.json';
import { BENCHMARK_EXAMPLES } from '../src/data/mischungBeispiele';

const fehler: string[] = [];
const pruefe = (name: string, ist: number, soll: number, tol = 1e-4) => { if (!(Math.abs(ist - soll) <= tol * Math.max(1, Math.abs(soll)))) fehler.push(`${name}: ist ${ist}, soll ${soll}`); };
const gilt = (ok: boolean, name: string) => { if (!ok) fehler.push(name); };
console.log('--- Test: Kleinfragen Tranche 1–3 ---');

// M-5: Mindestzementgehalt ohne Größtkornzuschlag – Beispiel 1 (XC4/XF1, D_max 16) fordert 280 kg/m³ (Tab. F.2.1)
gilt(BENCHMARK_EXAMPLES.find(b => b.id === 'bsp_hochbau')?.normVorgaben.minZement === 280, 'M-5: Beispiel 1 z_min = 280');

// M-6/M-7: z = 320 (CEM I, ρ = 3,1), w = 176, Luft 1,5 %, ρ_g = 2,65, Fraktionen 35/20/45 % (Feuchte 4/1/0,5 %, WA 0,5 %)
const mB: MischungEingabe = { zement: 320, rhoZement: 3.1, wasser: 176, fa: 0, sf: 0, hues: 0, biochar: 0, zusatzmittel: 0, luft: 1.5, stahlfaser: 0, ppFaser: 0, rhoGestein: 2.65,
  fraktionen: [{ anteil: 35, feuchte: 4, wa: 0.5 }, { anteil: 20, feuchte: 1, wa: 0.5 }, { anteil: 45, feuchte: 0.5, wa: 0.5 }], biocharFeuchte: 0, biocharWa: 0,
  k: { fa: 0.4, sf: 1.0, hues: 0, biochar: 0 }, maxFaFaktor: 0.33 };
// V_G = 1000 − 103,226 − 176 − 15 = 705,774 dm³; G = 1 870,30 kg; Kernwasser = 0,5 % · G = 9,3515 kg
// ρ_fb = (320 + 176 + 9,3515 + 1 870,30)/1000 = 2,37565 kg/dm³ (vorher 2,3663 ohne Kernwasser)
const m1 = stoffraum(mB);
pruefe('M-7 Kernwasser', m1.kernwasser, 9.35150); pruefe('M-7 ρ_fb', m1.rohdichte, 2.37565, 2e-5);
// M-6: XF4, f = 60, s = 20 → keine Anrechnung: (w/z)_eq = 176/320 = 0,55; nur f = 60 → 176/(320 + 0,4·60) = 0,51163
pruefe('M-6 FA+SF bei XF', stoffraum({ ...mB, fa: 60, sf: 20, zementArt: 'CEM I', frostTausalz: true }).wzEq, 0.55);
pruefe('M-6 nur FA bei XF', stoffraum({ ...mB, fa: 60, frostTausalz: true }).wzEq, 0.511628);
pruefe('M-6 FA+SF ohne XF', stoffraum({ ...mB, fa: 60, sf: 20, zementArt: 'CEM I' }).wzEq, 176 / (320 + 0.4 * 60 + 20));

// W-1: Innenwand h = 2,50 m, t = 240, a = 160 (a/t = 2/3 → ρ2 = 1,0), f_k = 5,0: Φ1 = 0,9; h_ef/t = 10,417;
// Φ2 = 0,85·2/3 − 0,0011·10,417² = 0,44731; f_d = 2,8333; n_Rd = 0,44731·240·2,8333 = 304,17 kN/m
const w1 = bemesseWandVereinfacht({ lage: 'innen', h: 2.5, t: 240, a: 160, lf: 5, fk: 5, nEd: 200 });
pruefe('W-1 Φ1', w1.phi1, 0.9); pruefe('W-1 Φ2', w1.phi2, 0.447309); pruefe('W-1 n_Rd', w1.nRd, 304.170, 1e-4);
gilt(w1.hinweise.some(h => h.feld === 'a' && h.text.includes('Zwischenauflager')), 'W-1 Hinweis a < t');
gilt(!bemesseWandVereinfacht({ lage: 'innen', h: 2.5, t: 240, a: 240, lf: 5, fk: 5, nEd: 200 }).hinweise.some(h => h.text.includes('Zwischenauflager')), 'W-1 kein Hinweis bei a = t');

// MW-1: f_vk0 nach NA aus der Mörtelgruppe; f_vk = f_vk0 + 0,4·σ_d
const fv = (m: 'NM' | 'LM' | 'DM', fm: number) => fvk0NA(m, fm).fvk0;
pruefe('MW-1 NM I', fv('NM', 1), 0.02); pruefe('MW-1 NM II', fv('NM', 2.5), 0.08); pruefe('MW-1 NM IIa', fv('NM', 5), 0.18);
pruefe('MW-1 NM III', fv('NM', 10), 0.22); pruefe('MW-1 NM IIIa', fv('NM', 20), 0.26); pruefe('MW-1 LM', fv('LM', 5), 0.18); pruefe('MW-1 DM', fv('DM', 5), 0.22);
gilt(normalmoertelGruppe(4.9) === 'NM II' && fvk0NA('NM', 2.5).vorlaeufig && !fvk0NA('NM', 5).vorlaeufig, 'MW-1 Gruppen/vorläufig');
// MW-2: kein K-Wert für Lehmstein und KS + LM → gesperrt; sonst unverändert (MZ NM: 0,55·12^0,7·5^0,3 = 5,076)
const st = mauerwerk.daten.stoneTypes;
gilt(fkEmpfehlungENGenormt(st.LH.K.NM, 2, 2, 'NM', false) === null && fkEmpfehlungENGenormt(st.LH.K.DM, 2, 2, 'DM', false) === null && fkEmpfehlungENGenormt(st.KSV.K.LM, 20, 5, 'LM', false) === null, 'MW-2 gesperrt');
pruefe('MW-2 MZ NM', fkEmpfehlungENGenormt(st.MZ.K.NM, 12, 5, 'NM', false) ?? NaN, fkEmpfehlungEN(0.55, 12, 5, 'NM', false));
pruefe('MW-2 MZ NM Handwert', fkEmpfehlungEN(0.55, 12, 5, 'NM', false), 5.0759, 1e-4);

// H-3: Trägerende BSH GL24h (f_c,90,k = 2,5), b = 160, l = 200 mm, Überstand: l_ef = 230 mm; f_c,90,d = 0,8·2,5/1,3 = 1,53846;
// k_c,90 = 1,75 → Grenze 2,69231 N/mm²; F = 40 kN → σ = 40 000/36 800 = 1,08696 N/mm² (vorher Grenze mit 1,0: 1,53846)
const q3 = bemesseQuerdruck({ F: 40, b: 160, l: 200, fall: 'traeger_ende', ueberstand: true, fc90k: 2.5, art: 'bsh', nkl: 1, kled: 'mtl' });
pruefe('H-3 l_ef', q3.l_ef, 230); pruefe('H-3 k_c,90', q3.k_c90, 1.75); pruefe('H-3 Grenze', q3.stressLimit, 2.692308); pruefe('H-3 σ', q3.sigma_c90d, 1.086957);
pruefe('H-3 NH', bemesseQuerdruck({ F: 40, b: 160, l: 200, fall: 'traeger_ende', ueberstand: true, fc90k: 2.5, art: 'nadelvollholz', nkl: 1, kled: 'mtl' }).k_c90, 1.5);
const qa = bemesseQuerdruck({ F: 40, b: 160, l: 200, fall: 'allgemein', ueberstand: true, fc90k: 2.5, art: 'bsh', nkl: 1, kled: 'mtl' });
pruefe('H-3 allgemein k', qa.k_c90, 1.0); pruefe('H-3 allgemein l_ef', qa.l_ef, 260);
// #239-H-3 (Umsetzung 29.10.2026): BSH-Einzelauflager l = 450 mm > 400 mm → k_c,90 = 1,0; f_c,90,d = 0,8·2,5/1,3 = 1,5385 N/mm²,
// F_c,90,Rd = 1,0 · 1,5385 · 160 · 450 / 1000 = 110,77 kN (l = 400 mm: 1,75 · 1,5385 · 160 · 400 / 1000 = 172,31 kN)
const q450 = bemesseQuerdruck({ F: 40, b: 160, l: 450, fall: 'traeger_ende', ueberstand: false, fc90k: 2.5, art: 'bsh', nkl: 1, kled: 'mtl' });
gilt(q450.hinweise.some(h => h.text.includes('400 mm')), 'H-3 Hinweis l > 400');
pruefe('#239-H-3 BSH l > 400 mm', q450.k_c90, 1.0); pruefe('#239-H-3 F_c,90,Rd l = 450', q450.F_c90Rd_kN, 110.769);
const q400 = bemesseQuerdruck({ F: 40, b: 160, l: 400, fall: 'pfosten_riegel', ueberstand: false, fc90k: 2.5, art: 'bsh', nkl: 1, kled: 'mtl' });
pruefe('#239-H-3 BSH l = 400 mm', q400.k_c90, 1.75); pruefe('#239-H-3 F_c,90,Rd l = 400', q400.F_c90Rd_kN, 172.308);
// H-2: keine Grenzschlankheit 120 – erst ab λ > 200 ein Lehrhinweis (C24 100/100, l = 6 m: λ = 207,8)
const d2 = bemesseDruckstab({ b: 100, h: 100, laenge: 6, nEd: 5, fc0k: 21, E005: 7400, nkl: 1, kled: 'mtl', eulerFall: 2, brettschichtholz: false });
pruefe('H-2 λ', d2.lambda_z, 207.846); gilt(d2.hinweise.some(h => h.text.includes('λ > 200')), 'H-2 Hinweis λ > 200');
gilt(!bemesseDruckstab({ b: 100, h: 100, laenge: 4, nEd: 5, fc0k: 21, E005: 7400, nkl: 1, kled: 'mtl', eulerFall: 2, brettschichtholz: false }).hinweise.some(h => h.text.includes('λ >')), 'H-2 kein Hinweis bei λ = 138,6');

// T2-ST-1: n = 8 (Beispiel Tranche 2): 31,0 mit G = 2,233 – 5 %: 2,127 < G < 2,274 (1 %) → nur markiert
const s1 = statistikAuswertung({ werte: [38.2, 41.5, 39.9, 40.3, 42.1, 37.6, 40.8, 31.0], methode: 'grubbs', material: 'beton', ausreisserPruefen: true });
gilt(s1.ausreisser.length === 0 && s1.auffaellig.length === 1, 'T2-ST-1 Straggler'); pruefe('T2-ST-1 X_k', s1.xk, 31.8275, 1e-4);
// mit 28,0 statt 31,0: x̄ = 38,55; s = 4,5290; G = 2,329 > 2,274 → Ausreißer entfernt, X_k aus 7 Werten = 40,0571 − 2,0771·1,6521 = 36,626
const s2 = statistikAuswertung({ werte: [38.2, 41.5, 39.9, 40.3, 42.1, 37.6, 40.8, 28.0], methode: 'grubbs', material: 'beton', ausreisserPruefen: true });
gilt(s2.ausreisser.length === 1 && s2.ausreisser[0] === 28.0 && s2.auffaellig.length === 0, 'T2-ST-1 Ausreißer'); pruefe('T2-ST-1 X_k bereinigt', s2.xk, 36.6255, 2e-4);
pruefe('T2-ST-1 G_krit 1 % n = 8', grubbsKritisch(8, 0.01), 2.274);

// T2-B-1: DIN EN ISO 14688-2 – w_L = 45, w_P = 20: w = 25 → I_C = 0,80 halbfest; w = 35 → 0,40 weich; w = 40 → 0,20 breiig
gilt(zustandsgrenzen(25, 45, 20).zustand === 'halbfest' && zustandsgrenzen(35, 45, 20).zustand === 'weich' && zustandsgrenzen(40, 45, 20).zustand === 'breiig' && zustandsgrenzen(19, 45, 20).zustand === 'fest', 'T2-B-1 Zustandsformen');
// T2-B-2: organisch, w_L = 62,4 %, I_P = 21,9 % (A-Linie 30,95) → UA mit Prüfhinweis statt OU
const b2 = bodengruppePlastizitaet(62.4, 21.9, true);
gilt(b2.kuerzel === 'UA' && b2.text.includes('DIN 18196 prüfen') && !b2.oberhalbALinie, 'T2-B-2 UA statt OU');
gilt(bodengruppePlastizitaet(45, 10, true).kuerzel === 'OU', 'T2-B-2 OU bei w_L 35 … 50 bleibt');

// HY-2: c·ρ = 2 400 einheitlich – Beispiel z = 320, Q = 350 → ΔT = 112 000/2 400 = 46,67 K ≈ 47 K
pruefe('HY-2 Kern', WAERMEKAPAZITAET_VOL, 2400); pruefe('HY-2 ΔT', adiabatischeErwaermung(320, 350), 46.6667);
const schritte = JSON.stringify((hydr.daten as Record<string, unknown>)['HydratationFolgen.schritte_2']);
gilt(schritte.includes('2400') && schritte.includes('47') && !schritte.includes('2500'), 'HY-2 Beispiel mit 2 400');

if (fehler.length) { console.log('FAIL ' + fehler.join('\nFAIL ')); process.exit(1); }
console.log('OK: Kleinfragen Tranche 1–3');
