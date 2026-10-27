// Rechenkern Prüfverfahren (Umsetzungsplan Phase 4, AP 4.2): ZfP, Messen & Prüfen, Mechanische Prüfungen, Festbeton
import {
  rueckprallZfp, rueckprallKurven, rueckprallFestigkeitLehr, ultraschallZfp, impactEchoZfp, bewehrungsSignal, georadar,
  potentialRisikoZfp, wenner, torrentKlasse, torrentFeuchte, karstenZfp, thermografieStufe, durchstrahlung,
  messwerteAusText, gumMessunsicherheit, ringversuch, werkzeugToleranz,
  schlankheitsfaktorAstm, bohrkernPruefung, spaltzugfestigkeit, biegezug4Punkt, marshallQuotient, zugversuchStahl, holzSchaetzung,
  bemessungswerteBeton, festigkeitsentwicklung, type PruefWinkel, type Messwerkzeug, type Probekoerper, type Lagerung,
} from '../src/calc/pruefverfahren';
import { dynamischerEModul, rueckprallLehrkurve, rueckprall } from '../src/calc/bauwerksuntersuchung';
import { fckCubeVonFck, fckVonFckCube } from '../src/data/kennwerte';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (ist: number, soll: number, tol: number) => Math.abs(ist - soll) <= tol;
const relNahe = (ist: number, soll: number, tol = 1e-12) => Math.abs(ist - soll) <= tol * Math.max(1, Math.abs(soll));
console.log('--- Test: Prüfverfahren ---');

// ================================================================ 1. ZfP
// Rückprall: Referenz = Komponentenrechnung (src/modules/ZfP.tsx vor AP 4.2) mit der seit Runde 5 (Z55) einheitlichen
// Lehrkurve f_c = 0,0125·R^2,22 (vorher 0,027·R^2,1 im ZfP-Modul, 0,027·R^1,85 im Labor)
function altRueckprall(rebound: number, angle: PruefWinkel) {
  let deltaR = 0;
  if (angle === '90') deltaR = -3;
  if (angle === '-90') deltaR = 3;
  const rCorr = rebound + deltaR;
  return { rCorr, fc: 0.0125 * Math.pow(Math.max(10, rCorr), 2.22) };
}
for (const w of ['0', '90', '-90'] as const) for (let R = 5; R <= 70; R += 0.5) {
  const n = rueckprallZfp(R, w), o = altRueckprall(R, w);
  pruefe(n.rCorr === o.rCorr && relNahe(n.fc, o.fc), `Rückprall ${R} ${w}`);
}
// Handrechnung Startwert R = 35, horizontal: 0,0125 · 35^2,22 = 0,0125 · 2678,1 = 33,5 N/mm²
pruefe(nahe(rueckprallZfp(35, '0').fc, 0.0125 * Math.pow(35, 2.22), 1e-12) && nahe(rueckprallZfp(35, '0').fc, 33.48, 0.05), `R = 35 → ${rueckprallZfp(35, '0').fc}`);
pruefe(rueckprallZfp(35, '0').hinweise.some(h => h.feld === 'fc' && h.text.includes('Kalibrierkerne')), 'Rückprall: Hinweis „ohne Kalibrierung nur Schätzung“ (DIN EN 13791)');
// Eine Kurve im ganzen Repo: ZfP, Bauwerksuntersuchung (ohne Karbonatisierung) und Laborsimulator liefern denselben Wert
pruefe(rueckprallFestigkeitLehr(42) === rueckprallLehrkurve(42) && rueckprall(42, 'horiz', 0).fcSchaetz === rueckprallLehrkurve(42), 'einheitliche Lehrkurve');
pruefe(rueckprallZfp(8, '0').hinweise.some(h => h.text.includes('R = 10')), 'R < 10 → Hinweis statt stiller Ersatzwert');
pruefe(!rueckprallZfp(NaN, '0').gueltig, 'NaN → Fehler');
// Kurven wie bisher (R = 20 … 60, Schritt 2)
const kv = rueckprallKurven();
pruefe(kv.labels.length === 21 && kv.labels[0] === 20 && kv.labels[20] === 60, 'Kurven-Stützstellen');
pruefe(kv.labels.every((r, i) => relNahe(kv.horizontal[i], 0.0125 * Math.pow(r, 2.22)) && relNahe(kv.unten[i], 0.0125 * Math.pow(Math.max(10, r - 3), 2.22)) && relNahe(kv.oben[i], 0.0125 * Math.pow(r + 3, 2.22))), 'Kurven = Komponentenrechnung mit einheitlicher Lehrkurve');
pruefe(rueckprallFestigkeitLehr(5) === rueckprallFestigkeitLehr(10), 'Lehrkurve unter R = 10 konstant');

// Ultraschall: E_dyn = ρ v² (1+ν)(1−2ν)/(1−ν); ν = 0,2 → Faktor 0,9 (Lehrbuchformel, z. B. DIN EN 12504-4 Anhang / ASTM C597)
//   ρ = 2400 kg/m³, v = 4,0 km/s → 2400 · 4000² · 0,9 = 34,56 GPa
pruefe(nahe(ultraschallZfp(4.0).eDyn, 34.56, 1e-9) && nahe(ultraschallZfp(4.0).fcEst, 40, 1e-12), `Ultraschall 4 km/s ${ultraschallZfp(4.0).eDyn}`);
for (let v = 2; v <= 5.0001; v += 0.1) pruefe(relNahe(ultraschallZfp(v).eDyn, 2.4 * v * v * 0.9, 1e-12) && relNahe(ultraschallZfp(v).fcEst, Math.max(0, (v - 2) * 20), 1e-12), `Ultraschall v = ${v}`);
pruefe(nahe(dynamischerEModul(2400, 4000, 0.2), 34.56e9, 1), 'dynamischerEModul');
pruefe(dynamischerEModul(2400, 4000, 0) === 2400 * 4000 * 4000, 'ν = 0 → E = ρ v²');
pruefe(!ultraschallZfp(0).gueltig && ultraschallZfp(1.5).fcEst === 0 && ultraschallZfp(1.5).hinweise.length > 0, 'v = 0 Fehler, v < 2 Hinweis');

// Impact-Echo: d = 0,96 · 4000 / (2 · 15 000) = 0,128 m = 128 mm (ASTM C1383)
pruefe(nahe(impactEchoZfp(15, 4000).depth, 128, 1e-9), `Impact-Echo ${impactEchoZfp(15, 4000).depth}`);
pruefe(!impactEchoZfp(0, 4000).gueltig, 'f = 0 → Fehler');

// Georadar: ε_r = 9 → v = 100 mm/ns; t = 2 ns → d = 100 mm
pruefe(georadar(9, 2).vRadar === 100 && georadar(9, 2).depth === 100 && nahe(georadar(6, 1.5).depth, 300 / Math.sqrt(6) * 0.75, 1e-12), 'Georadar');
pruefe(!georadar(0.5, 1).gueltig && georadar(1, 1).vRadar === 300, 'ε_r < 1 → Fehler, Vakuum c');
pruefe(bewehrungsSignal(30, 16) === 100 - 30 / 16 * 20 && bewehrungsSignal(100, 6) === 0, 'Bewehrungssignal');

// Potential (Runde 5): einheitlich mit der Bauwerksuntersuchung nach ASTM C876 – negativer als −350 mV hoch,
// −350 … −200 mV ungewiss (beide Grenzen eingeschlossen), positiver als −200 mV gering
pruefe(potentialRisikoZfp(-351) === 'hoch' && potentialRisikoZfp(-350) === 'mittel' && potentialRisikoZfp(-201) === 'mittel' && potentialRisikoZfp(-200) === 'mittel' && potentialRisikoZfp(-199) === 'gering', 'Potential-Einstufung ZfP');

// Wenner: ρ = 2π · 0,05 m · 150 Ω = 47,12 Ω·m = 4,71 kΩ·cm (Formel AASHTO T 358 / RILEM TC 154)
const wn = wenner(50, 150);
pruefe(nahe(wn.rho, 47.1239, 1e-4) && nahe(wn.rhoKohmCm, 4.71239, 1e-5) && wn.stufe === 'sehr_hoch', `Wenner ${wn.rho}`);
pruefe(wenner(50, 400).stufe === 'mittel' && wenner(50, 2000).stufe === 'niedrig' && wenner(50, 4000).stufe === 'vernachlaessigbar' && !wenner(0, 100).gueltig, 'Wenner-Stufen');
// RILEM TC 154-EMC (Polder 2000, Tab. 2): < 100 Ω·m hoch, 100 … 500 mäßig – 110 Ω·m ist jetzt „mittel“ (vorher Grenze 120)
pruefe(wenner(50, 110 / (2 * Math.PI * 0.05)).stufe === 'mittel' && wenner(50, 99 / (2 * Math.PI * 0.05)).stufe === 'sehr_hoch', 'Wenner-Grenze 100 Ω·m');
pruefe(torrentKlasse(0.005) === 1 && torrentKlasse(0.01) === 2 && torrentKlasse(0.1) === 3 && torrentKlasse(1) === 4 && torrentKlasse(10) === 5, 'Torrent-Klassen');
pruefe(torrentFeuchte(70) === 'normal' && torrentFeuchte(71) === 'hoch' && torrentFeuchte(86) === 'kritisch', 'Torrent-Feuchte');

// Karsten (Runde 5, einheitlich mit Bauwerksuntersuchung): V = 2,5 ml, t = 15 min, A = 5,73 cm² → w = 25/(5,73 · 0,5) = 8,726 kg/(m²·√h)
//   Stufen nach DIN 4108-3 (bisher Lehrschwellen 0,1/0,5): 0,2 ml in 60 min → 0,35 abweisend; 1,0 ml → 1,75 hemmend
const ka = karstenZfp(15, 2.5);
pruefe(nahe(ka.w, 8.72600, 1e-4) && ka.tHours === 0.25 && ka.stufe === 'saugend', `Karsten ${ka.w}`);
pruefe(karstenZfp(60, 0.2).stufe === 'abweisend' && karstenZfp(60, 1.0).stufe === 'hemmend' && karstenZfp(60, 1.2).stufe === 'saugend' && !karstenZfp(0, 1).gueltig, 'Karsten-Stufen, t = 0 → Fehler');
pruefe(thermografieStufe(0.5) === 'unauffaellig' && thermografieStufe(0.6) === 'moeglich' && thermografieStufe(2.1) === 'deutlich', 'Thermografie');
// Durchstrahlung: μ = 0,15/1,5 = 0,1 cm⁻¹, d = 20 cm → e⁻² = 13,53 %
const ds = durchstrahlung(20, 1.5);
pruefe(nahe(ds.transmission, 100 * Math.exp(-2), 1e-12) && ds.stufe === 'gut' && durchstrahlung(40, 1.5).stufe === 'ausreichend' && durchstrahlung(60, 1.5).stufe === 'schlecht' && !durchstrahlung(20, 0).gueltig, 'Durchstrahlung');

// ================================================================ 2. Messen & Prüfen
pruefe(JSON.stringify(messwerteAusText('38,5; 39,2; 37,8; 38,9; 39,6')) === '[38.5,39.2,37.8,38.9,39.6]', 'Parser Semikolon/Dezimalkomma');
pruefe(JSON.stringify(messwerteAusText('38.5, 39.2, x, 40')) === '[38.5,39.2,40]', 'Parser Komma/Dezimalpunkt');
// Handrechnung Startwerte: x̄ = 38,8; Σ(x − x̄)² = 1,90; s = √(1,90/4) = 0,6892; u_A = 0,3082; u_B,1 = 0,1/(2√3) = 0,02887; u_B,2 = 0,075
//   u_c = √(0,0950 + 0,000833 + 0,005625) = 0,3185; U = 0,6371
const g = gumMessunsicherheit(messwerteAusText('38,5; 39,2; 37,8; 38,9; 39,6'), 0.1, 0.15);
pruefe(nahe(g.mean, 38.8, 1e-12) && nahe(g.sampleStdDev, Math.sqrt(1.9 / 4), 1e-12) && nahe(g.uB1, 0.1 / Math.sqrt(12), 1e-15) && nahe(g.uB2, 0.075, 1e-15), `GUM Kennwerte ${JSON.stringify(g)}`);
pruefe(nahe(g.uc, Math.sqrt(1.9 / 20 + 0.01 / 12 + 0.075 ** 2), 1e-12) && nahe(g.expandedU, 0.6371, 1e-4) && nahe(g.maxInterval - g.minInterval, 2 * g.expandedU, 1e-12), `GUM u_c/U ${g.uc} ${g.expandedU}`);
pruefe(g.gueltig && g.hinweise.some(h => h.feld === 'messwerte'), 'n = 5, u_A dominiert → Hinweis zu k');
const g1 = gumMessunsicherheit([40], 0.1, 0.15);
pruefe(!g1.gueltig && g1.mean === 40 && g1.expandedU === 0, 'n = 1 → Fehler, Mittel = Einzelwert (wie bisher)');
pruefe(gumMessunsicherheit([], 0.1, 0.15).mean === 0 && !gumMessunsicherheit([1, 2], -0.1, 0).gueltig, 'n = 0, d < 0');
pruefe(nahe(gumMessunsicherheit([5, 5, 5], 0.1, 0).uc, 0.1 / Math.sqrt(12), 1e-15), 'konstante Reihe → nur Auflösung');

// Ringversuch, DIN EN ISO 13528: x = 48,2, X = 50, σ_pt = 1,8 → z = −1,0 (zufriedenstellend); E_n = −1,8/√(1,96 + 0,36) = −1,182
const rv = ringversuch({ x: 48.2, X: 50, sigmaPt: 1.8, uLab: 1.4, uRef: 0.6, offsetB: -1.5 });
pruefe(nahe(rv.zScore, -1, 1e-12) && rv.zStatus === 'ok' && nahe(rv.enScore, -1.8 / Math.sqrt(2.32), 1e-12) && rv.enStatus === 'critical', `Ringversuch ${rv.zScore} ${rv.enScore}`);
pruefe(nahe(rv.currentLab.b, 50 - 1.5 - 1.8 * 0.95, 1e-12) && rv.currentLab.a === 48.2, 'Youden-Punkt');
pruefe(ringversuch({ x: 46, X: 50, sigmaPt: 1.8, uLab: 1.4, uRef: 0.6, offsetB: 0 }).zStatus === 'warning' && ringversuch({ x: 44.5, X: 50, sigmaPt: 1.8, uLab: 1.4, uRef: 0.6, offsetB: 0 }).zStatus === 'critical', 'z-Stufen 2 … 3, ≥ 3');
pruefe(ringversuch({ x: 46, X: 50, sigmaPt: 2, uLab: 1, uRef: 1, offsetB: 0 }).zStatus === 'ok', '|z| = 2 → zufriedenstellend (Grenze eingeschlossen)');
pruefe(!ringversuch({ x: 46, X: 50, sigmaPt: 0, uLab: 1, uRef: 1, offsetB: 0 }).gueltig, 'σ_pt = 0 → Fehler');

// Werkzeugtoleranzen = bisherige Anzeige in messenpruefen/BegriffeTab.tsx
pruefe(nahe(werkzeugToleranz('meterstab', 1000), 0.5, 1e-12) && nahe(werkzeugToleranz('laser', 5000), 1.25, 1e-12), 'Meterstab Kl. II 1 m, Laser 5 m');
pruefe(werkzeugToleranz('messschieber', 100) === 0.03 && werkzeugToleranz('messschieber', 150) === 0.05 && werkzeugToleranz('risslupe', 0.3) === 0.05, 'Messschieber, Risslupe');
pruefe(werkzeugToleranz('nivellier', 1000) === 0.5 && nahe(werkzeugToleranz('nivellier', 1e6), 1.5, 1e-12), 'Nivellier 1,5 mm/√km, min. 0,5');

// ================================================================ 3. Mechanische Prüfungen
// ASTM C42 Tab. Korrekturfaktoren: 1,75 → 0,98; 1,50 → 0,96; 1,25 → 0,93; 1,00 → 0,87 (Zwischenwerte linear)
pruefe(schlankheitsfaktorAstm(1) === 0.87 && schlankheitsfaktorAstm(1.5) === 0.96 && schlankheitsfaktorAstm(2) === 1 && nahe(schlankheitsfaktorAstm(1.125), 0.90, 1e-12), 'ASTM-Stützstellen und Interpolation');
pruefe(Number.isNaN(schlankheitsfaktorAstm(0.9)) && schlankheitsfaktorAstm(2.5) === 1, 'h/d < 1 → NaN, h/d > 2 → 1');
// Startwerte: d = h = 100 mm, F = 350 kN: f = 350 000/7853,98 = 44,56. Runde 5 (Z55): Kern h/d = 1 entspricht nach
// DIN EN 13791:2020 dem Würfel 150 mm → f_c,cube = 44,56 (vorher 44,56·0,87/0,82 = 47,28); Zylinder über die Klassen:
// zwischen C30/37 und C35/45: 30 + 5·(44,56 − 37)/8 = 34,73
const bk = bohrkernPruefung({ dMm: 100, hMm: 100, kraftKn: 350, staebe: 0, richtung: 'vertikal' });
pruefe(nahe(bk.rawStrength, 44.563, 1e-3) && nahe(bk.equivalentCube, 44.563, 1e-3) && nahe(bk.equivalentCylinder, 34.727, 1e-3) && bk.lambdaAspect === 1 && bk.gueltig, `Bohrkern ${JSON.stringify(bk)}`);
// h/d = 2 (d = 100, h = 200): Zylinderwert direkt, Würfel über die Klasse (C30/37: 30 → 37)
const bkZ = bohrkernPruefung({ dMm: 100, hMm: 200, kraftKn: 30 * Math.PI * 2500 / 1000, staebe: 0, richtung: 'vertikal' });
pruefe(nahe(bkZ.equivalentCylinder, 30, 1e-9) && nahe(bkZ.equivalentCube, 37, 1e-9), `Bohrkern h/d = 2 ${bkZ.equivalentCylinder} ${bkZ.equivalentCube}`);
pruefe(nahe(fckCubeVonFck(30), 37, 1e-12) && nahe(fckVonFckCube(60), 50, 1e-12) && nahe(fckCubeVonFck(12), 15, 1e-12), 'Klassenumrechnung Tab. 3.1');
// h/d = 1,5: ASTM C42 auf h/d = 2 (0,96), Bewehrung 2 Stäbe (+7 %), horizontal (1,085)
const bk2 = bohrkernPruefung({ dMm: 100, hMm: 150, kraftKn: 350, staebe: 2, richtung: 'horizontal' });
pruefe(nahe(bk2.fcCore, 44.563 * 0.96 * 1.07 * 1.085, 1e-3) && nahe(bk2.equivalentCylinder, bk2.fcCore, 1e-12) && bk2.hinweise.some(h => h.feld === 'staebe'), 'Bohrkern mit Bewehrung, horizontal');
const bk3 = bohrkernPruefung({ dMm: 100, hMm: 80, kraftKn: 350, staebe: 0, richtung: 'vertikal' });
pruefe(!bk3.gueltig && !Number.isFinite(bk3.equivalentCube), 'h/d < 1 → Fehler, Ergebnis „–“');
pruefe(!bohrkernPruefung({ dMm: 0, hMm: 100, kraftKn: 350, staebe: 0, richtung: 'vertikal' }).gueltig, 'd = 0 → Fehler');
// Spaltzug Asphalt/Beton (DIN EN 12697-23 bzw. DIN EN 12390-6): 2 · 16 500/(π · 100 · 60) = 1,7507 N/mm²
pruefe(nahe(spaltzugfestigkeit(16.5, 100, 60), 1.7507, 1e-4), `Spaltzug ${spaltzugfestigkeit(16.5, 100, 60)}`);
// Zylinder 150/300, F = 200 kN: 2 · 200 000/(π · 150 · 300) = 2,829 N/mm²
pruefe(nahe(spaltzugfestigkeit(200, 150, 300), 2.8294, 1e-4), 'Spaltzug Zylinder 150/300');
pruefe(nahe(marshallQuotient(9.5, 3.2), 2.96875, 1e-12), 'Marshall-Quotient');
// 4-Punkt-Biegung DIN EN 408: F = 6,5 kN, L = 1800, b = 50, h = 100 → 6500 · 1800/(50 · 10⁴) = 23,4 N/mm²
pruefe(nahe(biegezug4Punkt(6.5, 1800, 50, 100), 23.4, 1e-12), 'Biegezug 4-Punkt');
// Zugversuch Startwerte: Ø 12 → S₀ = 113,10 mm²; R_e = 512,8; R_m = 632,2; R_m/R_e = 1,233; A_gt = 15 % (Messlänge unter F_m) → B500B
// DIN 488-1 / EC2 Anhang C (öffentlich: Tab. C.1): B500A k ≥ 1,05, ε_uk = A_gt ≥ 2,5 %; B500B k ≥ 1,08, A_gt ≥ 5,0 %
const zv = zugversuchStahl({ dMm: 12, kraftReKn: 58, kraftRmKn: 71.5, l0Mm: 100, luMm: 115 });
pruefe(nahe(zv.area, 113.097, 1e-3) && nahe(zv.yieldStrength, 512.83, 0.01) && nahe(zv.ratio, 71.5 / 58, 1e-12) && nahe(zv.elongation, 15, 1e-12) && zv.einstufung === 'B500B', `Zugversuch ${JSON.stringify(zv)}`);
pruefe(zugversuchStahl({ dMm: 12, kraftReKn: 58, kraftRmKn: 61.5, l0Mm: 100, luMm: 103 }).einstufung === 'B500A', 'B500A');
// Grenzen: A_gt = 4,9 % mit k = 1,10 → nur B500A; A_gt = 2,4 % → nicht erfüllt; Hinweis A_gt statt Bruchdehnung A
pruefe(zugversuchStahl({ dMm: 12, kraftReKn: 58, kraftRmKn: 63.8, l0Mm: 100, luMm: 104.9 }).einstufung === 'B500A' && zugversuchStahl({ dMm: 12, kraftReKn: 58, kraftRmKn: 63.8, l0Mm: 100, luMm: 102.4 }).einstufung === 'nicht', 'A_gt-Grenzen 2,5/5,0 %');
pruefe(zv.hinweise.some(h => h.feld === 'elongation' && h.text.includes('Bruchdehnung A')), 'Hinweis A_gt ≠ Bruchdehnung A');
pruefe(zugversuchStahl({ dMm: 12, kraftReKn: 50, kraftRmKn: 61.5, l0Mm: 100, luMm: 115 }).einstufung === 'nicht' && !zugversuchStahl({ dMm: 12, kraftReKn: 58, kraftRmKn: 70, l0Mm: 0, luMm: 115 }).gueltig, 'Nicht erfüllt, L₀ = 0 → Fehler');
// Holz Startwerte: ρ = 0,46, u = 12 % → k_u = 1; f_c,0 = 38,4; f_m = 23,4 → C18-Niveau; E = 11 500
const hz = holzSchaetzung({ rohdichte: 0.46, feuchte: 12, bMm: 50, hMm: 100, stuetzweiteMm: 1800, kraftKn: 6.5 });
pruefe(hz.feuchteFaktor === 1 && nahe(hz.fc0_actual, 38.4, 1e-12) && nahe(hz.f_bending, 23.4, 1e-12) && nahe(hz.e_modul, 11500, 1e-9) && hz.niveau === 'C18', `Holz ${JSON.stringify(hz)}`);
const hz2 = holzSchaetzung({ rohdichte: 0.46, feuchte: 35, bMm: 50, hMm: 100, stuetzweiteMm: 1800, kraftKn: 6.5 });
pruefe(nahe(hz2.feuchteFaktor, 0.44, 1e-12) && hz2.hinweise.length === 1, 'Holzfeuchte > 28 % → Faktor 0,44 und Hinweis');
pruefe(holzSchaetzung({ rohdichte: 0.7, feuchte: 12, bMm: 50, hMm: 100, stuetzweiteMm: 1800, kraftKn: 6.5 }).niveau === 'laubholz' && !holzSchaetzung({ rohdichte: 0.46, feuchte: 12, bMm: 0, hMm: 100, stuetzweiteMm: 1800, kraftKn: 6.5 }).gueltig, 'Laubholz, b = 0 → Fehler');

// ================================================================ 4. Festbeton
// C25/30: f_cd = 0,85 · 25/1,5 = 14,17; f_ctd = 0,85 · 1,8/1,5 = 1,02 (DIN EN 1992-1-1/NA)
const bw = bemessungswerteBeton(25, 1.8, 0.85, 0.85, 1.5);
pruefe(nahe(bw.fcd, 14.1667, 1e-4) && nahe(bw.fctd, 1.02, 1e-12) && !bemessungswerteBeton(25, 1.8, 0.85, 0.85, 0).gueltig, 'Bemessungswerte');
// β_cc nach Gl. (3.2): CEM N, t = 7 d → exp(0,25 · (1 − 2)) = 0,7788; f_cm(7) = 38 · 0,7788 = 29,59
const fe = festigkeitsentwicklung({ fck: 30, alterTage: 7, zement: 'N', geometrie: 'zyl_150', lagerung: 'norm' });
pruefe(nahe(fe.betaCc, Math.exp(-0.25), 1e-12) && nahe(fe.fcmTeff, 38 * Math.exp(-0.25), 1e-12) && fe.hinweise.length === 0, `β_cc(7) ${fe.betaCc}`);
// Runde 5: Würfel 150 über die Klasse C30/37 (37/30 = 1,2333) statt pauschal 1,25
pruefe(nahe(festigkeitsentwicklung({ fck: 30, alterTage: 28, zement: 'R', geometrie: 'cube_150', lagerung: 'luft' }).fcmTeff, 38 * (37 / 30) * 0.9, 1e-12), 't = 28 d → β_cc = 1, Würfel/Luft');
const fe90 = festigkeitsentwicklung({ fck: 30, alterTage: 90, zement: 'S', geometrie: 'zyl_150', lagerung: 'norm' });
pruefe(fe90.hinweise.some(h => h.feld === 'alter') && fe90.fckT === 30 && fe90.fcmT > 38, 't > 28 d → f_ck(t) = f_ck, f_cm(t) > f_cm (Z55)');
pruefe(nahe(fe.fckT, 38 * Math.exp(-0.25) - 8, 1e-12), 'f_ck(7 d) = f_cm(7 d) − 8 (3.1.2(5))');
pruefe(!festigkeitsentwicklung({ fck: 30, alterTage: 0, zement: 'N', geometrie: 'zyl_150', lagerung: 'norm' }).gueltig, 't = 0 → Fehler');
// Referenz: bisherige Komponentenrechnung (src/modules/Festbeton.tsx vor AP 4.2) für alle Slider-Werte
const geos: Probekoerper[] = ['zyl_150', 'cube_150', 'cube_100', 'cube_200'], lag: Lagerung[] = ['norm', 'feucht', 'luft', 'heiss'];
for (const z of ['R', 'N', 'S'] as const) for (const geo of geos) for (const la of lag) for (const t of [1, 3, 7, 14, 28, 56, 90, 365]) {
  const sK = z === 'R' ? 0.20 : z === 'N' ? 0.25 : 0.38;
  const b = Math.exp(sK * (1 - Math.sqrt(28 / Math.max(1, t))));
  // C35/45: 45/35 = 1,2857 (Klasse) statt 1,25; Würfel 100/200 mit den relativen Lehrfaktoren 1,30/1,25 bzw. 1,20/1,25
  const gf = geo === 'zyl_150' ? 1.0 : geo === 'cube_150' ? 45 / 35 : geo === 'cube_100' ? (45 / 35) * 1.04 : (45 / 35) * 0.96;
  const lf = la === 'norm' ? 1.0 : la === 'feucht' ? 0.95 : la === 'luft' ? 0.90 : 0.85;
  const n = festigkeitsentwicklung({ fck: 35, alterTage: t, zement: z, geometrie: geo, lagerung: la });
  pruefe(relNahe(n.betaCc, b) && relNahe(n.fcmTeff, 43 * b * gf * lf, 1e-9), `Festbeton alt/neu ${z} ${geo} ${la} ${t}`);
}

// ================================================================ 5. Fuzz: 1 000 Zufallseingaben → endliche Ergebnisse oder sauberer Fehler
let zz = 4242;
const rnd = () => { zz = (zz * 1103515245 + 12345) % 2147483648; return zz / 2147483648; };
const winkel: PruefWinkel[] = ['0', '90', '-90'];
const werkzeuge: Messwerkzeug[] = ['meterstab', 'messschieber', 'laser', 'risslupe', 'nivellier'];
let gueltige = 0;
const endlich = (...x: number[]) => x.every(Number.isFinite);
const pruefFall = (k: string, r: { gueltig: boolean; hinweise: { stufe: string }[] }, werte: number[]) => {
  if (r.gueltig) { gueltige++; pruefe(endlich(...werte), `Fuzz ${k}: nicht endlich ${werte}`); }
  else pruefe(r.hinweise.some(h => h.stufe === 'fehler'), `Fuzz ${k}: ungültig ohne Fehler`);
};
for (let k = 0; k < 1000; k++) {
  const rp = rueckprallZfp(rnd() * 80 - 5, winkel[Math.floor(rnd() * 3)]); pruefFall(`${k} Rückprall`, rp, [rp.fc, rp.rCorr]);
  const us = ultraschallZfp(rnd() * 7 - 0.5); pruefFall(`${k} Ultraschall`, us, [us.eDyn, us.fcEst]);
  const ie = impactEchoZfp(rnd() * 50 - 1, rnd() * 5000); pruefFall(`${k} Impact`, ie, [ie.depth]);
  const gr = georadar(rnd() * 15, rnd() * 6 - 0.5); pruefFall(`${k} Radar`, gr, [gr.vRadar, gr.depth]);
  const wn2 = wenner(rnd() * 100 - 5, rnd() * 2000); pruefFall(`${k} Wenner`, wn2, [wn2.rho]);
  const kz = karstenZfp(rnd() * 60 - 2, rnd() * 10); pruefFall(`${k} Karsten`, kz, [kz.w]);
  const dz = durchstrahlung(rnd() * 100, rnd() * 15 - 0.5); pruefFall(`${k} Durchstrahlung`, dz, [dz.transmission]);
  const werte = Array.from({ length: Math.floor(rnd() * 12) }, () => rnd() * 100);
  const gm = gumMessunsicherheit(werte, rnd() * 0.5 - 0.05, rnd() * 0.5); pruefFall(`${k} GUM`, gm, [gm.uc, gm.expandedU, gm.mean]);
  const rvf = ringversuch({ x: rnd() * 100, X: rnd() * 100, sigmaPt: rnd() * 4 - 0.2, uLab: rnd() * 3, uRef: rnd() * 3, offsetB: rnd() * 4 - 2 }); pruefFall(`${k} Ringversuch`, rvf, [rvf.zScore, rvf.enScore]);
  pruefe(Number.isFinite(werkzeugToleranz(werkzeuge[Math.floor(rnd() * 5)], rnd() * 1e5)), `Fuzz ${k}: Werkzeug`);
  const b = bohrkernPruefung({ dMm: rnd() * 150 - 5, hMm: rnd() * 300, kraftKn: rnd() * 800, staebe: Math.floor(rnd() * 4), richtung: rnd() < 0.5 ? 'vertikal' : 'horizontal' });
  pruefFall(`${k} Bohrkern`, b, [b.fcCore, b.equivalentCube]);
  const zs = zugversuchStahl({ dMm: rnd() * 30 - 1, kraftReKn: rnd() * 300, kraftRmKn: rnd() * 350, l0Mm: rnd() * 200 - 5, luMm: rnd() * 250 }); pruefFall(`${k} Zugversuch`, zs, [zs.yieldStrength, zs.ratio, zs.elongation]);
  const hs = holzSchaetzung({ rohdichte: rnd() * 1.0 - 0.05, feuchte: rnd() * 40, bMm: rnd() * 120, hMm: rnd() * 250, stuetzweiteMm: rnd() * 4000, kraftKn: rnd() * 30 }); pruefFall(`${k} Holz`, hs, [hs.f_bending, hs.e_modul, hs.fc0_actual]);
  const fe2 = festigkeitsentwicklung({ fck: rnd() * 100, alterTage: rnd() * 400 - 5, zement: (['R', 'N', 'S'] as const)[Math.floor(rnd() * 3)], geometrie: geos[Math.floor(rnd() * 4)], lagerung: lag[Math.floor(rnd() * 4)] });
  pruefFall(`${k} Festigkeitsentwicklung`, fe2, [fe2.fcmTeff, fe2.betaCc]);
}
pruefe(gueltige > 9000, `Fuzz: nur ${gueltige} gültige Fälle`);

if (fehler.length) { for (const x of fehler) console.error(`FAIL: ${x}`); process.exit(1); }
console.log(`OK: Prüfverfahren (${gueltige} gültige Fuzz-Fälle)`);
