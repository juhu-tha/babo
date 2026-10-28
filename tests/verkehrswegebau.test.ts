// Rechenkern Verkehrswegebau (Z3): Asphalt-Hohlraum, Gleis-Temperaturspannung, Westergaard, Fugen, Rigole, Spritzbetonring
import { asphaltHohlraum, schienenTemperatur, westergaardRand, westergaardSpannungen, westergaardErsatzradius, betondeckenFugen, rigole, F_METHODE, spritzbetonRing, GAMMA_C_TUNNEL, type Bettung } from '../src/calc/verkehrswegebau';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (ist: number, soll: number, tol: number) => Math.abs(ist - soll) <= tol;
console.log('--- Test: Verkehrswegebau ---');

// 1. Asphalt (Startwerte): 94,5 M.-% Gestein (2,68 g/cm³), 5,5 M.-% Bitumen (1,02 g/cm³), Raumdichte 2,41 g/cm³
//    ρ_m = 100/(94,5/2,68 + 5,5/1,02) = 100/(35,261 + 5,392) = 2,4598 g/cm³; V = (1 − 2,41/2,4598)·100 = 2,03 Vol.-%
const as = asphaltHohlraum({ gesteinAnteil: 94.5, bitumenAnteil: 5.5, rhoGestein: 2.68, rhoBitumen: 1.02, raumdichteMischung: 2.41 });
pruefe(as.gueltig && nahe(as.maxDichte, 2.45982, 1e-5) && nahe(as.hohlraum, 2.02542, 1e-5) && as.ok, `Asphalt ${as.maxDichte} ${as.hohlraum}`);
pruefe(!asphaltHohlraum({ gesteinAnteil: 94.5, bitumenAnteil: 5.5, rhoGestein: 2.68, rhoBitumen: 1.02, raumdichteMischung: 2.6 }).gueltig, 'Raumdichte > Rohdichte → Fehler');
pruefe(!asphaltHohlraum({ gesteinAnteil: 94.5, bitumenAnteil: 5.5, rhoGestein: 2.68, rhoBitumen: 1.02, raumdichteMischung: 2.30 }).ok, 'V > 4,5 % → nicht konform');

// 2. Gleis: T_Schiene = 45 °C, T_neutral = 20 °C: σ = 210 000·1,2·10⁻⁵·25 = 63 N/mm²; F = 63·7686 = 484,2 kN je Schiene, 968,4 kN je Gleis
const g = schienenTemperatur(45, 20, 'schotter_gut');
pruefe(nahe(g.sigmaT, 63, 1e-9) && nahe(g.kraftSchieneKn, 484.218, 1e-6) && nahe(g.kraftGleisKn, 968.436, 1e-6) && g.status === 'unkritisch', `Gleis ${JSON.stringify(g)}`);
//    Grenzen: Schotter gut 135, mager 90 N/mm²; 70 % davon → erhöht; −120 N/mm² Zug kritisch
pruefe(schienenTemperatur(20 + 135 / 2.52, 20, 'schotter_gut').status === 'verwerfung' && schienenTemperatur(45, 20, 'schotter_mager').status === 'erhoeht', 'Verwerfung/erhöht');
pruefe(schienenTemperatur(-30, 20, 'schotter_gut').status === 'zugKritisch' && schienenTemperatur(0, 20, 'schotter_gut').status === 'zug' && schienenTemperatur(60, 20, 'feste_fahrbahn').status === 'festeFahrbahn', 'Zug/feste Fahrbahn');

// 3. Westergaard-Originalgleichungen (Runde 5, Z55). Handbeispiele aus öffentlicher Lehrquelle (engineeringhulk.com,
//    „Rigid Pavement Design – Westergaard’s Theory“, Beispiele 2 und 5; Gleichungen wie NPTEL Kap. 29):
//    Rand: P = 50 kN, h = 250 mm, l = 800 mm, a = 150 mm → b = √(1,6·150² + 250²) − 0,675·250 = 145,10 mm; σ_e = 1,52 N/mm²
//    Ecke: P = 40 kN, a = 150 mm, l = 850 mm, h = 250 mm → σ_c = 3·40 000/250²·[1 − (212,1/850)^0,6] = 1,085 N/mm²
const ws = westergaardSpannungen(50000, 250, 800, 150);
pruefe(nahe(ws.bMm, 145.097, 1e-3) && nahe(ws.rand, 1.5214, 1e-4) && nahe(westergaardSpannungen(40000, 250, 850, 150).ecke, 1.0851, 1e-4), `Westergaard Handbeispiele ${JSON.stringify(ws)}`);
pruefe(westergaardErsatzradius(500, 250) === 500 && westergaardErsatzradius(150, 250) < 150 && ws.rand > ws.innen, 'b = a für a ≥ 1,724·h; Rand > Innen');
//    Betondecke (Startwerte): h = 26 cm, Achslast 120 kN, k = 80 MN/m³, E = 34 000, ν = 0,15 (Koeffizienten für ν = 0,15)
//    l = [34 000·260³/(12·(1 − 0,15²)·0,08)]^¼ = 893,31 mm; a = √(60 000/(0,8·π)) = 154,51 mm; b = 149,76 mm
//    σ_e = 0,572·60 000/260²·(4·lg(893,31/149,76) + 0,359) = 1,7573 N/mm² → 78,1 % von 2,25 (vorher mit l/r und ν = 0,2: 1,734)
const w = westergaardRand({ dickeCm: 26, achslastKn: 120, bettungMNm3: 80 });
pruefe(w.gueltig && nahe(w.lMm, 893.311, 1e-3) && nahe(w.rMm, 154.510, 1e-3) && nahe(w.bMm, 149.765, 1e-3) && nahe(w.sigmaE, 1.75731, 1e-5) && nahe(w.ausnutzung, 78.103, 1e-3) && w.ok, `Westergaard ${JSON.stringify(w)}`);
pruefe(nahe(w.sigmaE, 0.572 * 60000 / 260 ** 2 * (4 * Math.log10(w.lMm / w.bMm) + 0.359), 1e-12) && w.sigmaInnen < w.sigmaE, 'Rand mit b statt r');
pruefe(!westergaardRand({ dickeCm: 15, achslastKn: 180, bettungMNm3: 30 }).ok && !westergaardRand({ dickeCm: 0, achslastKn: 120, bettungMNm3: 80 }).gueltig, 'dünne Platte überlastet, h = 0 → Fehler');
//    Fugen: h = 26 cm → L_max = min(6,5; 5,0) = 5,0 m; 15 Dübel, Anker max(3; ⌊5/1,5⌋ + 1) = 4
const f = betondeckenFugen(5.0, 26);
pruefe(f.maxAbstandM === 5 && f.ok && f.duebel === 15 && f.anker === 4 && !betondeckenFugen(5.5, 26).ok && nahe(betondeckenFugen(4, 18).maxAbstandM, 4.5, 1e-12), 'Fugenabstand');

// 4. Rigole nach DWA-A 138-1:2024-10 (vereinfachtes Verfahren; Runde 28.10.: vorher Ausgabe 2005 mit k_f,u = k_f/2)
//    a) Öffentliche Bemessung Weilheim i. OB, TGB West („vereinfachtes Verfahren nach DWA-A 138-1“): A_u = 272 m², r = 16,3 l/(s·ha),
//       D = 1080 min, k_i = 2,1·10⁻⁶ m/s, b = 5,0 m, h = 1,5 m, s_R = 0,35, f_Z = 1,2 → L = 9,0 m, V_R = 23,7 m³, Q_s = 0,14 l/s
//       Hand: Zähler 272·10⁻⁷·16,3 − 5·1,5·2,1·10⁻⁶ = 4,27585·10⁻⁴; Nenner 2,625/77 760 + 6,5·2,1·10⁻⁶ = 4,74058·10⁻⁵ → L = 9,0198 m
const wh = rigole({ flaecheM2: 272, psi: 1, regenspende: 16.3, dauerMin: 1080, speicherKoeff: 0.35, kf: 2.1e-6, fOrt: 1, fMethode: 1, breiteM: 5, hoeheM: 1.5, fZ: 1.2 });
pruefe(wh.gueltig && nahe(wh.laengeM, 9.01984, 1e-4) && nahe(wh.vNutz, 23.677, 1e-3) && nahe(wh.qSicker, 0.1389, 1e-4) && nahe(wh.aS, 9.01984 * 6.5 + 7.5, 1e-3), `Rigole Weilheim ${wh.laengeM} ${wh.vNutz} ${wh.qSicker}`);
//    b) Startwerte: A = 355 m², ψ = 0,9, r = 240, D = 15 min, s_R = 0,95, k_f = 10⁻⁵, f_Ort = 0,5, f_Methode = 0,8 (Open-End-Test),
//       b × h = 1,2 × 0,6 m, f_Z = 1,2: k_i = 0,4·10⁻⁵ = 4·10⁻⁶ m/s; A_u = 319,5 m²; Q_zu = 7,668 l/s; V_zu = 6,9012 m³
//       Zähler 319,5·10⁻⁷·240 − 2·1,2·0,3·4·10⁻⁶ = 7,668·10⁻³ − 2,88·10⁻⁶ = 7,66512·10⁻³
//       Nenner 1,2·0,6·0,95/(900·1,2) + 1,8·4·10⁻⁶ = 6,33333·10⁻⁴ + 7,2·10⁻⁶ = 6,40533·10⁻⁴ → L = 11,9668 m
//       V_R = 11,9668·0,72 = 8,6161 m³; nutzbar 8,1853 m³ → 35 Boxen à 0,24 m³
const rg = rigole({ flaecheM2: 355, psi: 0.9, regenspende: 240, dauerMin: 15, speicherKoeff: 0.95 });
pruefe(nahe(rg.aRed, 319.5, 1e-12) && nahe(rg.qZu, 7.668, 1e-12) && nahe(rg.vZu, 6.9012, 1e-12) && nahe(rg.ki, 4e-6, 1e-15) && nahe(rg.fK, 0.4, 1e-12), `Rigole Zufluss ${JSON.stringify(rg)}`);
pruefe(nahe(rg.laengeM, 11.9668, 1e-4) && nahe(rg.vRigole, 8.6161, 1e-4) && nahe(rg.vNutz, 8.1853, 1e-4) && rg.boxen === 35 && rg.hWirksam === 0.3, `Rigole Volumen ${rg.laengeM} ${rg.vRigole} ${rg.boxen}`);
//    Bilanz: V_nutz = f_Z·(V_zu − V_s)
pruefe(nahe(rg.vNutz, 1.2 * (rg.vZu - rg.vSicker), 1e-9) && nahe(wh.vNutz, 1.2 * (wh.vZu - wh.vSicker), 1e-9), 'Rigole Bilanz V_nutz = f_Z·(V_zu − V_s)');
//    c) vollständige Durchsickerung: h_w = h → größere Versickerungsfläche, kürzere Rigole (Weilheim: Nenner 3,37577·10⁻⁵ + 8·2,1·10⁻⁶,
//       Zähler 4,4336·10⁻⁴ − 15·2,1·10⁻⁶ → L = 4,1186·10⁻⁴/5,05577·10⁻⁵ = 8,1463 m)
const whv = rigole({ flaecheM2: 272, psi: 1, regenspende: 16.3, dauerMin: 1080, speicherKoeff: 0.35, kf: 2.1e-6, fOrt: 1, fMethode: 1, breiteM: 5, hoeheM: 1.5, fZ: 1.2, vollDurchsickert: true });
pruefe(nahe(whv.laengeM, 8.1463, 1e-3) && whv.hWirksam === 1.5 && whv.laengeM < wh.laengeM && rigole({ flaecheM2: 355, psi: 0.9, regenspende: 240, dauerMin: 15, speicherKoeff: 0.95, vollDurchsickert: true }).laengeM < rg.laengeM, `Rigole voll durchsickert ${whv.laengeM}`);
//    d) Korrekturfaktoren und Fehler
pruefe(F_METHODE.feldGross === 1 && F_METHODE.openEnd === 0.8 && F_METHODE.sieblinie === 0.1 && nahe(rigole({ ...{ flaecheM2: 355, psi: 0.9, regenspende: 240, dauerMin: 15, speicherKoeff: 0.95 }, fOrt: 0.3, fMethode: F_METHODE.doppelring }).ki, 2.7e-6, 1e-15), 'f_Methode-Tabelle, k_i = f_Ort·f_Methode·k_f');
pruefe(!rigole({ flaecheM2: 355, psi: 0.9, regenspende: 240, dauerMin: 15, speicherKoeff: 0 }).gueltig && !rigole({ flaecheM2: 355, psi: 0.9, regenspende: 240, dauerMin: 15, speicherKoeff: 0.3, fOrt: 1.2 }).gueltig && !rigole({ flaecheM2: 355, psi: 0.9, regenspende: 240, dauerMin: 0, speicherKoeff: 0.3 }).gueltig, 's_R = 0, f_Ort > 1, D = 0 → Fehler');
const r0 = rigole({ flaecheM2: 0, psi: 0.9, regenspende: 240, dauerMin: 15, speicherKoeff: 0.3 });
pruefe(r0.gueltig && r0.laengeM === 0 && r0.vRigole === 0 && r0.boxen === 0, 'A = 0 → keine Rigole');
pruefe(rigole({ flaecheM2: 20, psi: 0.3, regenspende: 80, dauerMin: 60, speicherKoeff: 0.3, kf: 1e-3, fOrt: 1, fMethode: 1 }).hinweise.some(x => x.feld === 'flaecheM2'), 'Stirnflächen genügen → Hinweis');

// 5. Spritzbeton (Startwerte): R = 4,5 m, p = 0,15 N/mm², d = 15 cm, C25/30; Runde 5: γ_c = 1,5 (Bauzustand = vorübergehend,
//    DIN EN 1992-1-1/NA Tab. 2.1DE) statt 1,3: σ = 0,15·4,5/0,15 = 4,5 N/mm²; f_cd = 0,85·25/1,5 = 14,17 N/mm² → 31,8 %; N = 675 kN/m
const sp = spritzbetonRing(4.5, 0.15, 15, 25);
pruefe(nahe(sp.sigmaRing, 4.5, 1e-12) && nahe(sp.fcd, 14.1667, 1e-4) && nahe(sp.ausnutzung, 31.7647, 1e-4) && nahe(sp.ringKraftKnM, 675, 1e-9) && sp.ok, `Spritzbeton ${JSON.stringify(sp)}`);
pruefe(!sp.hinweise.some(x => x.feld === 'gammaC') && spritzbetonRing(4.5, 0.15, 15, 25, GAMMA_C_TUNNEL.aussergewoehnlich).hinweise.some(x => x.feld === 'gammaC') && sp.hinweise.some(x => x.feld === 'tunnel'), 'γ_c = 1,5 Standard, 1,3 → Hinweis außergewöhnlich; Hinweis ZTV-ING/DS 853');
pruefe(GAMMA_C_TUNNEL.voruebergehend === 1.5 && GAMMA_C_TUNNEL.aussergewoehnlich === 1.3 && GAMMA_C_TUNNEL.ec2Aussergewoehnlich === 1.2 && !spritzbetonRing(4.5, 0.15, 15, 25, 0).gueltig, 'γ_c-Werte, γ_c = 0 → Fehler');
pruefe(!spritzbetonRing(4.5, 0.15, 0, 25).gueltig, 'd = 0 → Fehler');

// 6. Fuzz-Test: endliche Werte, Monotonie
let zufall = 8080;
const rnd = () => { zufall = (zufall * 1103515245 + 12345) % 2147483648; return zufall / 2147483648; };
const BET: Bettung[] = ['schotter_mager', 'schotter_gut', 'feste_fahrbahn'];
for (let i = 0; i < 1000; i++) {
  const h = 15 + rnd() * 25, P = 80 + rnd() * 100, k = 20 + rnd() * 120;
  const a = westergaardRand({ dickeCm: h, achslastKn: P, bettungMNm3: k }), dicker = westergaardRand({ dickeCm: h + 2, achslastKn: P, bettungMNm3: k }), schwerer = westergaardRand({ dickeCm: h, achslastKn: P + 10, bettungMNm3: k });
  pruefe(a.gueltig && Number.isFinite(a.sigmaE) && a.sigmaE > 0 && dicker.sigmaE < a.sigmaE && schwerer.sigmaE > a.sigmaE, `Fuzz ${i}: Westergaard`);
  const ts = -30 + rnd() * 90, gl = schienenTemperatur(ts, 20, BET[i % 3]), gl2 = schienenTemperatur(ts + 5, 20, BET[i % 3]);
  pruefe(Number.isFinite(gl.kraftGleisKn) && gl2.sigmaT > gl.sigmaT, `Fuzz ${i}: Gleis`);
  const e = { flaecheM2: rnd() * 2000, psi: rnd(), regenspende: 50 + rnd() * 400, dauerMin: 5 + rnd() * 60, speicherKoeff: 0.3 + rnd() * 0.65, kf: 1e-6 + rnd() * 1e-4, fOrt: 0.3 + rnd() * 0.7, fMethode: 0.1 + rnd() * 0.9, vollDurchsickert: rnd() < 0.5 };
  const r1 = rigole(e), r2 = rigole({ ...e, flaecheM2: e.flaecheM2 + 100 }), r3 = rigole({ ...e, vollDurchsickert: true });
  pruefe(r1.gueltig && [r1.vRigole, r1.laengeM, r1.vNutz, r1.aS].every(Number.isFinite) && r1.vRigole >= 0 && r2.vRigole >= r1.vRigole && r2.boxen >= r1.boxen && r3.laengeM <= r1.laengeM + 1e-9, `Fuzz ${i}: Rigole`);
  const s1 = spritzbetonRing(2 + rnd() * 6, rnd() * 0.5, 10 + rnd() * 30, 20 + rnd() * 20), s2 = spritzbetonRing(4, 0.2, 10 + i % 30, 25), s3 = spritzbetonRing(4, 0.2, 11 + i % 30, 25);
  pruefe(Number.isFinite(s1.ausnutzung) && s3.sigmaRing < s2.sigmaRing, `Fuzz ${i}: Spritzbeton`);
  const asE = { gesteinAnteil: 95 - rnd() * 3, bitumenAnteil: 5, rhoGestein: 2.6 + rnd() * 0.3, rhoBitumen: 1.02, raumdichteMischung: 2.1 + rnd() * 0.3 };
  const m1 = asphaltHohlraum(asE), m2 = asphaltHohlraum({ ...asE, raumdichteMischung: asE.raumdichteMischung + 0.02 });
  pruefe(Number.isFinite(m1.maxDichte) && Number.isFinite(m1.hohlraum) && m2.hohlraum < m1.hohlraum, `Fuzz ${i}: Asphalt`);
}

if (fehler.length) { for (const x of fehler) console.error(`FAIL: ${x}`); process.exit(1); }
console.log('OK: Verkehrswegebau');
