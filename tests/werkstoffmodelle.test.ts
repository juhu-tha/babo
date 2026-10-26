// Rechenkern Werkstoffmodelle: Stahl (Brand, Ermüdung, Eigenspannungen, σ-ε-Linien, Legierungen), Beton/Betonstahl,
// Kunststoffe (Umsetzungsplan Phase 4, AP 4.2)
import {
  abminderungStahlBrand, stahlBrand, stahlLinieVereinfacht, woehlerEc3, woehlerSpannung, walzEigenspannung,
  schweissEigenspannung, stahlSpannungBeiDehnung, stahlVerformungsphase, stahlKennlinienPunkte, pren, gefuegeklasse,
  betonSdParameter, betonParabelRechteck, betonNichtlinear, betonSdLinien, betonstahlParameter, betonstahlLinien,
  emodulKunststoff, kunststoffTemperatur, waermedehnung, KUNSTSTOFF_MODELLE, type StahlKennlinie, type Kunststofftyp,
  bilinearSpannung, bilinearVerfestigung, bilinearKurve, lehrkurveSpannung, lehrkurve, thixotropie, rheopexie, thixotropieKurve,
  binghamScherrate, maxwellSpannung, maxwellHalbwertszeit, type Lehrmodell,
} from '../src/calc/werkstoffmodelle';
import { plastischeKapazitaet, WALZPROFILE } from '../src/calc/stahlbau';
import { ecmEc2 } from '../src/calc/emodul';
import { BAUSTAHL_EC3 } from '../src/data/kennwerte';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (ist: number, soll: number, tol: number) => Math.abs(ist - soll) <= tol * Math.abs(soll);
console.log('--- Test: Werkstoffmodelle ---');

// 1. Brandfall – Abminderungsfaktoren DIN EN 1993-1-2, Tab. 3.1
//    NSC (New Steel Construction) 11/2025, Technical „Tech2511“: „At 500 °C, the value of k_y,θ is 0.78 and k_E,θ is 0.60.“
//    SpringerPlus 5 (2016), Tab. 1 (Retention factors): 600 °C → E 0,31 / σ 0,47; 700 °C → 0,13 / 0,23; 800 °C → 0,09 / 0,11.
const k500 = abminderungStahlBrand(500);
pruefe(nahe(k500.ky, 0.78, 0.02) && nahe(k500.kE, 0.60, 0.02), `500 °C: ${JSON.stringify(k500)}`);
for (const [t, ky, kE] of [[600, 0.47, 0.31], [700, 0.23, 0.13], [800, 0.11, 0.09], [200, 1.0, 0.9]] as const) {
  const k = abminderungStahlBrand(t);
  pruefe(nahe(k.ky, ky, 0.02) && nahe(k.kE, kE, 0.02), `${t} °C: ${JSON.stringify(k)}`);
}
// lineare Interpolation (Hand): 550 °C → k_y = (0,78 + 0,47)/2 = 0,625; k_E = (0,60 + 0,31)/2 = 0,455
const k550 = abminderungStahlBrand(550);
pruefe(nahe(k550.ky, 0.625, 1e-12) && nahe(k550.kE, 0.455, 1e-12), 'Interpolation 550 °C');
pruefe(abminderungStahlBrand(-30).ky === 1 && abminderungStahlBrand(1500).kE === 0, 'Randwerte θ ≤ 20 / ≥ 1200 °C');
// vereinfachte Linie: S355 bei 20 °C und 600 °C
// Runde 4 (bewusst geändert): f_u = 490 N/mm² nach EN 1993-1-1 Tab. 3.1 (t ≤ 40 mm) aus src/data/kennwerte.ts, vorher 470.
const FU355 = BAUSTAHL_EC3.S355.fu;
const b600 = stahlBrand({ fy: 355, fu: FU355, theta: 600 });
pruefe(b600.gueltig && b600.kurve.length === 41 && nahe(b600.kurve[40].eps, 0.2, 1e-12), 'Kurve 0 … 0,20 mit 41 Punkten');
pruefe(nahe(b600.kurve[40].sig20, 490, 1e-12) && nahe(b600.kurve[40].sigT, 490 * 0.47, 1e-12), 'f_u bzw. k_y·f_u bei ε = 0,20');
pruefe(nahe(b600.fyT, 355 * 0.47, 1e-12) && nahe(b600.ET, 210000 * 0.31, 1e-12), 'f_y,θ und E_θ');
pruefe(stahlLinieVereinfacht(0.001, 355, FU355, 210000) === 210 && stahlLinieVereinfacht(0.01, 355, FU355, 210000) === 355, 'elastisch / Plateau');
pruefe(stahlBrand({ fy: 355, fu: FU355, theta: 1200 }).kurve.every(p => p.sigT === 0), '1200 °C: keine Festigkeit, kein NaN');
pruefe(!stahlBrand({ fy: 0, fu: FU355, theta: 20 }).gueltig && !stahlBrand({ fy: 355, fu: 300, theta: 20 }).gueltig && !stahlBrand({ fy: 355, fu: FU355, theta: NaN }).gueltig, 'Brand: unzulässige Eingaben');

// 2. Ermüdung – DIN EN 1993-1-9, 7.1
//    IDEA StatiCa Support Center „Fatigue analysis according to EN 1993-1-9“: Δσ_C = 90/1,15 = 78,3 MPa →
//    Δσ_D = (2/5)^(1/3)·78,3 = 57,7 MPa, Δσ_L = (5/100)^(1/5)·57,7 = 31,7 MPa; Δσ = 60 MPa → N_R ≈ 4 438 234.
const w1 = woehlerEc3({ deltaSigmaC: 90 / 1.15, m: 3, deltaSigma: 60 });
pruefe(nahe(w1.deltaSigmaD, 57.7, 0.02) && nahe(w1.deltaSigmaL, 31.7, 0.02), `IDEA: Δσ_D ${w1.deltaSigmaD}, Δσ_L ${w1.deltaSigmaL}`);
pruefe(nahe(w1.nR, 4438234, 0.02) && w1.bereich === 'zeitfest', `IDEA: N_R ${w1.nR}`);
// Handrechnung Kerbfall 80, Δσ = 150 MPa: N_R = 2·10⁶·(80/150)³ = 303 407
const w2 = woehlerEc3({ deltaSigmaC: 80, m: 3, deltaSigma: 150 });
pruefe(nahe(w2.nR, 303407, 1e-4) && w2.hinweise.length === 0, 'Kerbfall 80 / 150 MPa');
pruefe(nahe(w2.deltaSigmaD, 58.95, 0.002) && nahe(w2.deltaSigmaL, 32.38, 0.002), 'Kerbfall 80: Δσ_D 59, Δσ_L 32');
// Bereiche und Stetigkeit der Wöhlerlinie bei N = 5·10⁶
const w3 = woehlerEc3({ deltaSigmaC: 80, m: 3, deltaSigma: 40 });
pruefe(w3.bereich === 'zwischen' && nahe(w3.nR, 5e6 * Math.pow(w3.deltaSigmaD / 40, 5), 1e-12), 'm = 5-Ast');
pruefe(woehlerEc3({ deltaSigmaC: 80, m: 3, deltaSigma: 30 }).nR === Infinity, 'unter Δσ_L: dauerfest');
pruefe(woehlerEc3({ deltaSigmaC: 80, m: 3, deltaSigma: 0 }).nR === 0, 'Δσ = 0 → 0 (wie im Modul)');
pruefe(nahe(woehlerSpannung(5e6, 80, 3), w2.deltaSigmaD, 1e-12) && nahe(woehlerSpannung(5e6 * (1 + 1e-9), 80, 3), w2.deltaSigmaD, 1e-6), 'stetig bei N_D');
pruefe(nahe(woehlerSpannung(2e6, 80, 3), 80, 1e-12) && w2.kurve.length === 6, 'Δσ_R(2·10⁶) = Δσ_C');
pruefe(woehlerEc3({ deltaSigmaC: 80, m: 5, deltaSigma: 100 }).hinweise.some(h => h.feld === 'm'), 'm ≠ 3 → Hinweis');
pruefe(!woehlerEc3({ deltaSigmaC: 0, m: 3, deltaSigma: 100 }).gueltig && !woehlerEc3({ deltaSigmaC: 80, m: 3, deltaSigma: -1 }).gueltig, 'Wöhler: unzulässig');

// 3. Eigenspannungen
const wz = walzEigenspannung(355, 'h');
pruefe(wz.verlauf.length === 51 && nahe(wz.verlauf[0].sigma, -0.5 * 355, 1e-12) && nahe(wz.verlauf[25].sigma, 0.25 * 355, 1e-12), 'Walz: Rand −0,5·f_y, Mitte +0,25·f_y');
// Gleichgewicht: Mittelwert der Parabel über die Breite = 0 (Simpson-Regel exakt für Parabeln)
const simpson = (ys: number[]) => (ys[0] + ys[ys.length - 1] + ys.slice(1, -1).reduce((s, y, i) => s + (i % 2 === 0 ? 4 : 2) * y, 0)) / (3 * (ys.length - 1));
pruefe(Math.abs(simpson(walzEigenspannung(355, 'i', 50).verlauf.map(p => p.sigma))) < 1e-9, 'Walz: Gleichgewicht ∫σ = 0');
pruefe(walzEigenspannung(235, 'i').maxDruck === -0.3 * 235, 'Walz IPE: 0,3·f_y');
const sw = schweissEigenspannung({ fy: 355, streckenenergie: 1500, blechdicke: 15 });
pruefe(sw.gueltig && nahe(sw.bt, 15, 1e-12) && !sw.mindestbreiteAktiv && sw.verlauf.length === 201, 'Schweiß: b = 0,15·1500/15 = 15 mm');
pruefe(nahe(sw.verlauf[100].sigma, 355, 1e-12), 'Schweiß: σ(0) = f_y');
// Minimum bei x = ±√3·b: σ = f_y·(1 − 3)·e^(−1,5) = −0,446·f_y (Handrechnung)
const ql = (x: number) => 355 * (1 - (x / 15) ** 2) * Math.exp(-0.5 * (x / 15) ** 2);
pruefe(nahe(ql(Math.sqrt(3) * 15), -0.4463 * 355, 0.001), 'Schweiß: Druckminimum −0,446·f_y');
const swMin = schweissEigenspannung({ fy: 355, streckenenergie: 500, blechdicke: 50 });
pruefe(swMin.bt === 10 && swMin.mindestbreiteAktiv && swMin.hinweise.some(h => h.feld === 'streckenenergie'), 'Schweiß: Mindestbreite 10 mm mit Hinweis');
pruefe(!schweissEigenspannung({ fy: 355, streckenenergie: 1500, blechdicke: 0 }).gueltig, 'Schweiß: t = 0 unzulässig');

// 4. Spannungs-Dehnungs-Linien der Stahlsorten (Lehrkurven, Dehnung in %)
const S235: StahlKennlinie = { id: 'S235', E: 210000, fy: 235, fu: 360, A: 26, sh_strain: 1.5, fu_strain: 18, frac_stress: 300, yieldType: 'ausgeprägt' };
const EDEL: StahlKennlinie = { id: 'Edelstahl', E: 200000, fy: 240, fu: 580, A: 45, sh_strain: 0.32, fu_strain: 30, frac_stress: 420, yieldType: 'stetig' };
const Y1860: StahlKennlinie = { id: 'Y1860', E: 195000, fy: 1660, fu: 1860, A: 4, sh_strain: 1.05, fu_strain: 3.5, frac_stress: 1650, yieldType: 'stetig' };
pruefe(nahe(stahlSpannungBeiDehnung(S235, 0.1), 210, 1e-12) && stahlSpannungBeiDehnung(S235, 1.0) === 235, 'S235: Hooke und Plateau');
pruefe(nahe(stahlSpannungBeiDehnung(S235, 18), 360, 1e-12) && nahe(stahlSpannungBeiDehnung(S235, 26), 300, 1e-12), 'S235: R_m bei A_g, Bruchspannung bei A');
pruefe(stahlSpannungBeiDehnung(S235, 26.01) === 0 && stahlSpannungBeiDehnung(S235, -1) === 0, 'nach Bruch / negativ → 0');
// stetiger Fließübergang: Proportionalitätsgrenze 0,65·R_p0,2 (Edelstahl) bzw. 0,75·R_p0,2, R_p0,2 bei ε = f_y/E + 0,2 %
const eP02 = (240 / 200000) * 100 + 0.2;
pruefe(nahe(stahlSpannungBeiDehnung(EDEL, eP02), 240, 1e-9) && nahe(stahlSpannungBeiDehnung(EDEL, (0.65 * 240 / 200000) * 100), 0.65 * 240, 1e-9), 'Edelstahl: R_p0,2 und Proportionalitätsgrenze');
pruefe(nahe(stahlSpannungBeiDehnung(Y1860, (0.75 * 1660 / 195000) * 100), 0.75 * 1660, 1e-9), 'Spannstahl: 0,75·R_p0,2');
pruefe(stahlVerformungsphase(S235, 0.05) === 'elastisch' && stahlVerformungsphase(S235, 1) === 'fliessplateau' && stahlVerformungsphase(S235, 10) === 'verfestigung'
  && stahlVerformungsphase(S235, 20) === 'einschnuerung' && stahlVerformungsphase(S235, 30) === 'bruch' && stahlVerformungsphase(S235, 0) === 'ruhe', 'Phasen S235');
pruefe(stahlVerformungsphase(EDEL, 0.1) === 'fliessuebergang' && stahlVerformungsphase(EDEL, 0.05) === 'elastisch', 'Phasen Edelstahl');
for (const s of [S235, EDEL, Y1860]) {
  const pts = stahlKennlinienPunkte(s);
  pruefe(pts.every((p, i) => i === 0 || p.x > pts[i - 1].x) && pts[0].x === 0 && pts[pts.length - 1].x === s.A, `${s.id}: Punkte streng aufsteigend 0 … A`);
  pruefe(pts.every(p => Number.isFinite(p.y) && p.y >= 0 && p.y <= s.fu * 1.035 + 1e-9), `${s.id}: Spannungen 0 … R_eH`);
}
pruefe(stahlKennlinienPunkte(S235).some(p => p.y === Number((235 * 1.035).toFixed(1))), 'S235: obere Streckgrenze R_eH = 1,035·f_y');

// 5. Plastische Kapazität (stahlbau.ts): IPE 200, W_pl,y = 220,6 cm³, S235 → M_pl,Rd = 220,6·23,5/100 = 51,8 kNm;
//    N_pl,Rd = 28,5 cm² · 23,5 kN/cm² = 669,8 kN (Profilwerte nach stahlbau.ts/Herstellertabelle)
const ipe200 = WALZPROFILE.find(p => p.name === 'IPE 200')!;
const kap = plastischeKapazitaet(ipe200.Wply, ipe200.A, 235);
pruefe(nahe(kap.MplRd, 51.84, 0.002) && nahe(kap.NplRd, 669.75, 0.002) && kap.steigerungGegenS235 === 0, `IPE 200 S235: ${JSON.stringify(kap)}`);
pruefe(nahe(plastischeKapazitaet(220.6, 28.48, 355).steigerungGegenS235, 51.06, 0.001), 'S355: +51,1 %');

// 6. Legierungen: PREN = Cr + 3,3·Mo; 1.4404 (17 Cr / 11 Ni / 2,2 Mo) ≈ 24, 1.4301 (18/8) = 18
pruefe(nahe(pren(17, 2.2), 24.26, 1e-12) && pren(18, 0) === 18, 'PREN');
pruefe(gefuegeklasse(17, 11, 2.2, 0.02) === 'austenitisch_mo' && gefuegeklasse(18, 8, 0, 0.06) === 'austenitisch', '1.4404 / 1.4301 austenitisch');
pruefe(gefuegeklasse(22, 5, 3, 0.02) === 'duplex' && gefuegeklasse(13, 0, 0, 0.2) === 'martensitisch' && gefuegeklasse(17, 0, 0, 0.05) === 'ferritisch' && gefuegeklasse(1, 0, 0, 0.2) === 'unlegiert', 'Duplex / martensitisch / ferritisch / unlegiert');
pruefe(gefuegeklasse(10.49, 8, 0, 0) === 'unlegiert' && gefuegeklasse(10.5, 8, 0, 0) === 'austenitisch', 'Grenze Cr = 10,5 %');

// 7. Beton – DIN EN 1992-1-1, Tab. 3.1 (Formeln wie Oasys AdSec-Dokumentation „EN 1992“; gerundete Tabellenwerte)
//    C30/37: E_cm = 33 GPa, ε_c1 = 2,2 ‰ (Tabelle gerundet), f_cd = 0,85·30/1,5 = 17,0
const c30 = betonSdParameter(30);
pruefe(nahe(c30.fcd, 17.0, 1e-12) && nahe(c30.Ecm, 33000, 0.02) && nahe(c30.ec1, 2.2, 0.02) && nahe(c30.k, 1.96, 0.02), `C30/37: ${JSON.stringify(c30)}`);
pruefe(nahe(c30.Ecm, ecmEc2(30) * 1000, 1e-12), 'E_cm wie emodul.ts');
pruefe(c30.ec2 === 2 && c30.ecu2 === 3.5 && c30.n === 2 && c30.ecu1 === 3.5, 'C30/37: Parabel-Rechteck 2,0/3,5/2');
//    C70/85: ε_c2 = 2,4, ε_cu2 = 2,7, n = 1,45; C90/105: 2,6 / 2,6 / 1,4 (Tab. 3.1, gerundet)
const c70 = betonSdParameter(70), c90 = betonSdParameter(90);
pruefe(nahe(c70.ec2, 2.4, 0.02) && nahe(c70.ecu2, 2.7, 0.02) && nahe(c70.n, 1.45, 0.02), `C70/85: ${c70.ec2}/${c70.ecu2}/${c70.n}`);
pruefe(nahe(c90.ec2, 2.6, 0.02) && nahe(c90.ecu2, 2.6, 1e-12) && nahe(c90.n, 1.4, 1e-12) && nahe(c90.ecu1, 2.8, 1e-12) && c90.ec1 === 2.8, 'C90/105');
pruefe(nahe(betonParabelRechteck(1, c30) ?? NaN, 0.75 * 17, 1e-12) && betonParabelRechteck(2, c30) === 17 && betonParabelRechteck(3.5, c30) === 17 && betonParabelRechteck(3.6, c30) === null, 'Parabel-Rechteck');
pruefe(nahe(betonNichtlinear(c30.ec1, c30) ?? NaN, c30.fcm, 1e-12) && betonNichtlinear(3.6, c30) === null && betonNichtlinear(0, c30) === 0, 'Sargent: f_cm bei ε_c1');
const sd = betonSdLinien(30);
pruefe(sd.gueltig && sd.punkte.length === 51 && sd.punkte[50].eps === 5 && sd.hinweise.length === 0, 'Linien 0 … 5 ‰');
pruefe(betonSdLinien(70).hinweise.some(h => h.feld === 'fck') && betonSdLinien(100).hinweise.length >= 1 && !betonSdLinien(0).gueltig && !betonSdLinien(NaN).gueltig, 'Beton: Hinweise / unzulässig');

// 8. Betonstahl B500: f_yd = 500/1,15 = 434,8 N/mm², ε_yd = 2,17 ‰, ε_uk = 2,5 % (A) / 5,0 % (B), k = 1,05 / 1,08
const bB = betonstahlParameter('B500B'), bA = betonstahlParameter('B500A');
pruefe(nahe(bB.fyd, 434.8, 0.001) && nahe(bB.eyd, 2.174, 0.001) && bB.eu === 50 && bB.fu === 540 && bB.ey === 2.5, 'B500B');
pruefe(bA.eu === 25 && nahe(bA.fu, 525, 1e-12) && bA.eud === 25, 'B500A');
const lB = betonstahlLinien('B500B');
pruefe(lB.punkte.length === 111 && nahe(lB.punkte[100].char ?? NaN, 540, 1e-12) && lB.punkte[101].char === null && lB.punkte[50].bemessung === bB.fyd && lB.punkte[51].bemessung === null, 'B500B: Linienenden');
pruefe(betonstahlLinien('B500A').punkte[50].char === 525 && betonstahlLinien('B500A').punkte[51].char === null, 'B500A: Ende bei 25 ‰');

// 9. Kunststoffe (Lehrmodell) und Wärmedehnung
//    Formelbeispiel des Moduls: PVC-U, L_0 = 10 m, α_T = 80·10⁻⁶ 1/K, ΔT = 40 K → ΔL = 32 mm; Stahl α_T = 12·10⁻⁶ → 4,8 mm
pruefe(nahe(waermedehnung(10000, 80e-6, 40), 32, 1e-12) && nahe(waermedehnung(10000, 12e-6, 40), 4.8, 1e-12), 'Wärmedehnung PVC / Stahl');
pruefe(nahe(emodulKunststoff('elastomer', -40), (3000 + 3) / 2, 1e-12), 'Elastomer: Mittelwert bei T_g');
pruefe(nahe(emodulKunststoff('duroplast', -100), 4000, 0.001) && nahe(emodulKunststoff('duroplast', 300), 800, 0.001), 'Duroplast: Glas- und Plateauwert');
pruefe(emodulKunststoff('amorphous', 300) === 0.1 && emodulKunststoff('semicrystalline', 250) === 0.1, 'Thermoplast oberhalb T_f/T_m: Untergrenze 0,1 MPa');
pruefe(nahe(emodulKunststoff('semicrystalline', 100), 300 + 2700 / (1 + Math.exp(8)), 0.01), 'teilkristallin: lederartiges Plateau ≈ 300 MPa');
for (const typ of Object.keys(KUNSTSTOFF_MODELLE) as Kunststofftyp[]) {
  const r = kunststoffTemperatur(typ, 20);
  pruefe(r.gueltig && r.kurve.length === 201 && r.kurve[r.index].T === 20 && r.kurve.every((p, i) => i === 0 || p.E <= r.kurve[i - 1].E + 1e-9), `${typ}: Kurve monoton fallend`);
}
pruefe(kunststoffTemperatur('amorphous', 145).hinweise.some(h => h.feld === 'T') && kunststoffTemperatur('amorphous', 20).hinweise.length === 0, 'Hinweis nahe T_f');
pruefe(kunststoffTemperatur('amorphous', 301).index === -1 && kunststoffTemperatur('amorphous', 301).hinweise.length >= 1, 'T > 300 °C: kein Kurvenpunkt, Hinweis');
pruefe(!kunststoffTemperatur('amorphous', NaN).gueltig && !kunststoffTemperatur('xyz' as Kunststofftyp, 20).gueltig, 'Kunststoff: unzulässig');

// 9a. Materialmodelle (src/modules/Materialmodelle.tsx)
//    Handbeispiel des Moduls („Materialmodelle.schritte“): f_y = 500, E = 200 000, E_t = 2 000 N/mm², ε_max = 20 ‰
//    ε_y = 2,5 ‰; σ_max = 500 + 2 000·(0,020 − 0,0025) = 535 N/mm²; ε_e = 535/200 000 = 2,675 ‰; ε_p = 17,325 ‰; k = 1,07
const bv = bilinearVerfestigung({ fy: 500, E: 200000, Et: 2000, epsMaxPromille: 20 });
pruefe(bv.gueltig && nahe(bv.epsYPromille, 2.5, 1e-12) && nahe(bv.sigmaMax, 535, 1e-12) && nahe(bv.epsElastischPromille, 2.675, 1e-12) && nahe(bv.epsPlastischPromille, 17.325, 1e-12) && nahe(bv.k, 1.07, 1e-12), `bilinear ${JSON.stringify(bv)}`);
//    Preset B500B (E_t = 1 600, ε_max = 50 ‰): σ_max = 500 + 1 600·0,0475 = 576 N/mm², k = 1,152 ≥ 1,08 (Duktilität B, DIN EN 1992-1-1 Anh. C)
const b5 = bilinearVerfestigung({ fy: 500, E: 200000, Et: 1600, epsMaxPromille: 50 });
pruefe(nahe(b5.sigmaMax, 576, 1e-12) && nahe(b5.k, 1.152, 1e-12) && b5.k >= 1.08, 'B500B-Preset');
//    elastischer Bereich: keine bleibende Dehnung; Grenze genau bei ε_y
const be = bilinearVerfestigung({ fy: 355, E: 210000, Et: 2500, epsMaxPromille: 1 });
pruefe(be.epsPlastischPromille === 0 && nahe(be.sigmaMax, 210, 1e-12) && be.k < 1, 'elastisch: ε_p = 0');
pruefe(nahe(bilinearSpannung(355 / 210000, 355, 210000, 2500), 355, 1e-12), 'σ(ε_y) = f_y');
pruefe(!bilinearVerfestigung({ fy: 0, E: 200000, Et: 1600, epsMaxPromille: 50 }).gueltig && !bilinearVerfestigung({ fy: 500, E: 0, Et: 1600, epsMaxPromille: 50 }).gueltig && !bilinearVerfestigung({ fy: 500, E: 200000, Et: -1, epsMaxPromille: 50 }).gueltig, 'bilinear unzulässig');
pruefe(bilinearVerfestigung({ fy: 500, E: 200000, Et: 250000, epsMaxPromille: 5 }).hinweise.some(x => x.feld === 'Et'), 'E_t ≥ E → Hinweis');
const kv = bilinearKurve({ fy: 500, E: 200000, Et: 2000, epsMaxPromille: 20 });
pruefe(kv.length === 51 && kv[50].epsPromille === 25 && kv[40].entlastung !== null && nahe(kv[40].entlastung ?? 0, 535, 1e-9) && kv[34].entlastung === null && kv[35].entlastung !== null, 'Kurve bis 25 ‰, Entlastungsast 17,5 … 20 ‰');
pruefe(bilinearKurve({ fy: 500, E: 200000, Et: 2000, epsMaxPromille: 50 }).length === 111 && kv.every(p => p.idealPlastisch <= 500), 'Kurvenlänge ε_max + 5 ‰');
//    qualitative Lehrkurven (E = 210 000, f_y = 355, ε₀ = 2 ‰, σ_∞ = 400): Maximum der nichtlinearen Kurve bei ε₀ mit E·ε₀/2 = 210 N/mm²
pruefe(lehrkurveSpannung('linear', 0.002) === 420 && nahe(lehrkurveSpannung('non-linear', 0.002), 210, 1e-12) && lehrkurveSpannung('ideal-plastic', 0.004) === 355, 'Lehrkurven');
pruefe(nahe(lehrkurveSpannung('visco-elastic', 0.005), 400 * (1 - Math.exp(-2.625)), 1e-12) && lehrkurveSpannung('visco-elastic', 1) <= 400 && lehrkurveSpannung('visco-elastic', 0.004) < lehrkurveSpannung('visco-elastic', 0.005), 'viskoelastisch → σ_∞, monoton');
pruefe((['linear', 'non-linear', 'ideal-plastic', 'visco-elastic'] as Lehrmodell[]).every(m => lehrkurve(m).length === 51 && lehrkurve(m)[0].sigma === 0 && nahe(lehrkurve(m)[50].epsPromille, 5, 1e-12)), '51 Punkte 0 … 5 ‰');
//    Thixotropie/Rheopexie: Start 100 bzw. 20 Pa·s, Summe konstant 120 Pa·s
pruefe(thixotropie(0) === 100 && rheopexie(0) === 20 && thixotropieKurve().every(p => nahe(p.thixo + p.rheo, 120, 1e-12)) && thixotropieKurve().length === 51, 'Thixotropie/Rheopexie');
//    Handbeispiel „Materialmodelle.schritte_2“: σ(3 s) = 10·e^(−1,5) = 2,23 MPa; t½ = 2·ln 2 = 1,39 s; Bingham (800 − 500)/50 = 6 s⁻¹
pruefe(nahe(maxwellSpannung(10, 3, 2), 2.2313, 1e-4) && nahe(maxwellHalbwertszeit(2), 1.3863, 1e-4) && nahe(maxwellSpannung(10, maxwellHalbwertszeit(2), 2), 5, 1e-12), 'Maxwell');
pruefe(binghamScherrate(800, 500, 50) === 6 && binghamScherrate(400, 500, 50) === 0 && binghamScherrate(500, 500, 50) === 0, 'Bingham');

// 10. Fuzz: 1 000 Zufallseingaben ohne NaN/∞ bei gültigem Ergebnis
let seed = 19931;
const z = (a: number, c: number) => { seed = (seed * 1103515245 + 12345) % 2147483648; return a + (c - a) * (seed / 2147483648); };
const typen = Object.keys(KUNSTSTOFF_MODELLE) as Kunststofftyp[];
for (let i = 0; i < 1000; i++) {
  const fy = z(-50, 1800), fu = fy + z(-100, 800);
  const b = stahlBrand({ fy, fu, theta: z(-50, 1500) });
  const w = woehlerEc3({ deltaSigmaC: z(-10, 200), m: [3, 4, 5][i % 3], deltaSigma: z(-10, 400) });
  const s = schweissEigenspannung({ fy, streckenenergie: z(-100, 5000), blechdicke: z(-1, 60) });
  const k: StahlKennlinie = { id: i % 4 === 0 ? 'Edelstahl' : 'X', E: z(150000, 220000), fy: z(200, 1700), fu: 0, A: z(4, 50), sh_strain: 0, fu_strain: 0, frac_stress: 0, yieldType: i % 2 ? 'ausgeprägt' : 'stetig' };
  k.fu = k.fy * z(1.02, 2.5); k.fu_strain = k.A * z(0.4, 0.9); k.sh_strain = Math.min(k.fu_strain * 0.5, (k.fy / k.E) * 100 + z(0.25, 2)); k.frac_stress = k.fu * z(0.7, 0.98);
  const e = z(-1, 60);
  const bs = betonSdLinien(z(-10, 120));
  const kt = kunststoffTemperatur(typen[i % 4], z(-500, 2000));
  const bl = bilinearVerfestigung({ fy: z(-50, 800), E: z(-1000, 250000), Et: z(-100, 12000), epsMaxPromille: z(-5, 80) });
  const blk = bl.gueltig ? bilinearKurve({ fy: z(100, 700), E: z(50000, 220000), Et: z(500, 10000), epsMaxPromille: z(3, 60) }) : [];
  const zahlen = [
    ...(b.gueltig ? [b.ky, b.kE, b.fyT, b.ET, ...b.kurve.flatMap(p => [p.sig20, p.sigT])] : []),
    ...(w.gueltig ? [w.deltaSigmaD, w.deltaSigmaL, ...w.kurve.map(p => p.deltaSigma), w.nR === Infinity ? 0 : w.nR] : []),
    ...(s.gueltig ? [s.bt, ...s.verlauf.map(p => p.sigma)] : []),
    stahlSpannungBeiDehnung(k, e), ...stahlKennlinienPunkte(k).map(p => p.y),
    ...(bs.gueltig ? bs.punkte.flatMap(p => [p.bemessung ?? 0, p.real ?? 0]) : []),
    ...(kt.gueltig ? [kt.E, ...kt.kurve.map(p => p.E)] : []),
    ...(bl.gueltig ? [bl.sigmaMax, bl.k, bl.epsPlastischPromille, ...blk.flatMap(p => [p.belastung, p.idealPlastisch, p.entlastung ?? 0])] : []),
    lehrkurveSpannung((['linear', 'non-linear', 'ideal-plastic', 'visco-elastic'] as Lehrmodell[])[i % 4], z(-0.01, 0.05)), binghamScherrate(z(0, 2000), z(0, 1000), z(1, 200)),
  ];
  if (!zahlen.every(Number.isFinite) || (kt.gueltig && kt.E < 0.1) || (b.gueltig && (b.ky < 0 || b.ky > 1))) { pruefe(false, `Fuzz ${i}`); break; }
}

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log('OK: Werkstoffmodelle');
