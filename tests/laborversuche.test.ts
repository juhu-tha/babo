// Rechenkerne der Versuchs-Handouts (AP 6.4): Potentialmessung, Gravimetrie, Frischbeton, Würfel, Mörtelprismen
import {
  BEZUGSELEKTRODEN, umrechnenPotential, bereichCSE, potentialReihe,
  stabflaeche, abtragsrate, auslagerung,
  ausbreitmass, ausbreitklasse, frischRohdichte, frischbeton,
  druckfestigkeit, trockenFaktor, druckpruefung, FESTIGKEITSKLASSEN,
  biegezugPrisma, druckPrisma, druckMittel196, moertelprismen,
} from '../src/calc/laborversuche';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (ist: number, soll: number, tol: number) => Math.abs(ist - soll) <= tol;
console.log('--- Test: Laborversuche ---');

// 1. Potentialmessung
// Ag/AgCl gesättigt +197 mV, CSE +316 mV gegen SHE → Ag/AgCl liegt 119 mV über CSE
const u = umrechnenPotential(-250, 197);
pruefe(u.eSHE === -53 && u.eCSE === -369, `Umrechnung ${JSON.stringify(u)}`);
pruefe(umrechnenPotential(0, 316).eCSE === 0, 'CSE gegen CSE = 0');
pruefe(BEZUGSELEKTRODEN.every(b => b.eSHE > 150 && b.eSHE < 350), 'Elektrodenpotentiale plausibel');
pruefe(bereichCSE(-150) === 'gering' && bereichCSE(-200) === 'unsicher' && bereichCSE(-350) === 'unsicher' && bereichCSE(-351) === 'hoch', 'ASTM-Bereichsgrenzen');
const pm = [[0, -80], [0.5, -85], [1, -90], [2, -100], [3, -115], [4, -330], [6, -410]].map(([m, e]) => ({ mNaCl: m, eMess: e }));
const p = potentialReihe({ messungen: pm, eBezugSHE: 197, volumen: 1, pH: 12.6, sprung: 100 });
//    c(OH) = 10^(12,6 − 14) = 0,039811; c(Cl) bei 4 g = 4/58,44 = 0,068446 mol/L; Verhältnis 1,7193
pruefe(p.gueltig && p.sprungIndex === 5, `Sprung bei Index ${p.sprungIndex}`);
pruefe(nahe(p.cOH, 0.039811, 1e-6) && nahe(p.punkte[5].cCl, 0.068446, 1e-6) && nahe(p.punkte[5].clOh, 1.7193, 1e-4), `Cl/OH ${p.punkte[5].clOh}`);
pruefe(p.punkte[0].eCSE === -199 && p.punkte[5].delta === -215 && p.punkte[5].bereich === 'hoch', 'Punkte umgerechnet');
pruefe(p.hinweise.length === 0, `Lehrwerte ohne Hinweise (${p.hinweise.map(h => h.text).join(' | ')})`);
pruefe(potentialReihe({ messungen: pm, eBezugSHE: 197, volumen: 1, pH: 12.6, sprung: 250 }).sprungIndex === -1, 'Schwelle 250 mV: kein Sprung');
pruefe(!potentialReihe({ messungen: pm.slice(0, 1), eBezugSHE: 197, volumen: 1, pH: 12.6, sprung: 100 }).gueltig, 'eine Zeile → Fehler');
pruefe(!potentialReihe({ messungen: pm, eBezugSHE: 197, volumen: 0, pH: 12.6, sprung: 100 }).gueltig, 'Volumen 0 → Fehler');
// pH −0,6 → c(OH) /≈ 4 → Verhältnis ×≈ 4
const p2 = potentialReihe({ messungen: pm, eBezugSHE: 197, volumen: 1, pH: 12.0, sprung: 100 });
pruefe(nahe(p2.punkte[5].clOh / p.punkte[5].clOh, 10 ** 0.6, 1e-9), 'Cl/OH skaliert mit 10^ΔpH');

// 2. Gravimetrie
//    d = 12 mm, l = 100 mm: A = (π·12·100 + 2·π·36)/100 = 39,961 cm²
pruefe(nahe(stabflaeche(12, 100), 39.9611, 1e-4), `Fläche ${stabflaeche(12, 100)}`);
//    Äquivalenz mit ASTM G1: K·Δm/(A·t_h·ρ), K = 8,76·10⁷ µm/a
pruefe(nahe(abtragsrate(0.24, 40, 7.85, 28), 8.76e7 * 0.24 / (40 * 28 * 24 * 7.85), 1e-9), 'Formel = ASTM-G1-Form');
pruefe(nahe(abtragsrate(0.24, 40, 7.85, 28), 99.64, 0.01), 'Handrechnung ≈ 100 µm/a');
const pr = (d: number, l: number, m0: number, m1: number) => ({ d, l, m0, m1 });
const a = auslagerung({ proben: [pr(12, 100, 88.512, 88.262), pr(12, 100.1, 88.430, 88.198), pr(12, 99.9, 88.655, 88.390)], tage: 28, rho: 7.85, blind: 0.01 });
pruefe(a.gueltig && nahe(a.werte[0].dm, 0.24, 1e-9) && nahe(a.mittelVKorr, 99.32, 0.01) && nahe(a.sVKorr, 6.96, 0.01), `Auslagerung ${a.mittelVKorr} ${a.sVKorr}`);
pruefe(nahe(a.werte[0].abtrag, a.werte[0].vKorr * 28 / 365, 1e-12) && nahe(a.werte[0].rate, 0.24 / (a.werte[0].flaeche / 1e4) / 28, 1e-12), 'Abtrag und Rate konsistent');
pruefe(a.hinweise.length === 0, 'Lehrwerte ohne Hinweise');
pruefe(!auslagerung({ proben: [pr(12, 100, 88, 87)], tage: 0, rho: 7.85, blind: 0 }).gueltig, 'Dauer 0 → Fehler');
pruefe(auslagerung({ proben: [pr(12, 100, 88, 87)], tage: 28, rho: 7.85, blind: 0 }).hinweise.some(h => h.feld === 'proben'), '< 3 Proben → Warnung');
pruefe(auslagerung({ proben: [pr(12, 100, 88, 88.1)], tage: 28, rho: 7.85, blind: 0 }).hinweise.some(h => h.feld === 'masse'), 'Massenzunahme → Warnung');

// 3. Frischbeton
pruefe(ausbreitmass(480, 500) === 490 && ausbreitmass(450, 470) === 460 && ausbreitmass(400, 470) === 440, 'Ausbreitmaß gerundet');
pruefe(ausbreitklasse(340) === 'F1' && ausbreitklasse(350) === 'F2' && ausbreitklasse(480) === 'F3' && ausbreitklasse(490) === 'F4' && ausbreitklasse(620) === 'F5' && ausbreitklasse(630) === 'F6', 'Ausbreitklassen');
pruefe(frischRohdichte(3.2, 22.0, 8) === 2350, `Rohdichte ${frischRohdichte(3.2, 22.0, 8)}`);
const fb = frischbeton([{ d1: 450, d2: 470, mLeer: 3.215, mVoll: 22.045, vol: 8, a1: 2.1, g: 0.2 }], 2400);
pruefe(fb.gueltig && fb.werte[0].klasse === 'F3' && nahe(fb.werte[0].luft, 1.9, 1e-9) && nahe(fb.werte[0].luftAusDichte, 2.0833, 1e-4), `Frischbeton ${JSON.stringify(fb.werte)}`);
pruefe(frischbeton([{ d1: 400, d2: 470, mLeer: 3.215, mVoll: 22.045, vol: 8, a1: 2.1, g: 0.2 }], 2400).hinweise.some(h => h.feld === 'd'), 'Δd > 50 mm → Warnung');
pruefe(!frischbeton([{ d1: 450, d2: 470, mLeer: 5, mVoll: 4, vol: 8, a1: 2, g: 0 }], 2400).gueltig, 'leer schwerer als voll → Fehler');

// 4. Würfeldruckfestigkeit
pruefe(druckfestigkeit(900, 150, 150) === 40 && druckfestigkeit(955, 150.2, 149.8) === 42.4, 'f_c = F/A');
pruefe(trockenFaktor(45) === 0.92 && trockenFaktor(70) === 0.95, 'Trockenfaktor');
pruefe(FESTIGKEITSKLASSEN.length === 16 && FESTIGKEITSKLASSEN[3].name === 'C20/25' && FESTIGKEITSKLASSEN[5].cube === 37, 'Klassentabelle');
const w = [{ a: 150.2, b: 149.8, h: 150.1, m: 8.12, F: 955 }, { a: 149.9, b: 150.1, h: 150, m: 8.085, F: 980 }, { a: 150, b: 150.3, h: 149.8, m: 8.15, F: 935 }];
const d1 = druckpruefung({ wuerfel: w, trocken: false, zielklasse: 'C30/37' });
pruefe(d1.gueltig && nahe(d1.fcm, 42.5, 1e-9) && d1.fmin === 41.5 && d1.erreicht === 'C30/37' && !!d1.ziel?.krit1 && !!d1.ziel?.krit2, `Würfel ${JSON.stringify(d1)}`);
pruefe(d1.werte[0].rohdichte === 2400, 'Rohdichte Würfel');
const d2 = druckpruefung({ wuerfel: w, trocken: true, zielklasse: 'C30/37' });
pruefe(d2.faktor === 0.92 && d2.erreicht === 'C25/30' && d2.ziel?.krit1 === false && d2.ziel?.krit2 === true, `Trocken ${d2.erreicht}`);
// Handbeispiel aus dem Quiz: 33,5 / 35,0 / 31,0 MPa → C20/25
const d3 = druckpruefung({ wuerfel: [33.5, 35.0, 31.0].map(f => ({ a: 100, b: 100, h: 100, m: NaN, F: f * 10 })), trocken: false, zielklasse: '' });
pruefe(d3.erreicht === 'C20/25' && d3.ziel === undefined, `Quizbeispiel ${d3.erreicht}`);
pruefe(druckpruefung({ wuerfel: w.slice(0, 2), trocken: false, zielklasse: '' }).hinweise.some(h => h.feld === 'wuerfel'), '< 3 Würfel → Warnung');

// 5. Mörtelprismen
pruefe(nahe(biegezugPrisma(3.2), 7.5, 1e-12) && nahe(druckPrisma(72), 45, 1e-12), 'R_f und R_c');
const dm = druckMittel196([49.5, 50.6, 50.1, 40.6, 51.4, 49.8]);
pruefe(dm.verworfen === 3 && dm.gueltig && nahe(dm.mittel, (49.5 + 50.6 + 50.1 + 51.4 + 49.8) / 5, 1e-12), `±10 % ${JSON.stringify(dm)}`);
pruefe(!druckMittel196([49.5, 50.6, 50.1, 40.6, 43.8, 49.8]).gueltig, 'zweiter Ausreißer → Serie verwerfen');
pruefe(druckMittel196([50, 50, 50, 50, 50, 50]).verworfen === -1, 'ohne Ausreißer');
const p0 = [{ Ff: 2.9, Fc1: 79.2, Fc2: 81 }, { Ff: 3.1, Fc1: 80.1, Fc2: 78.5 }, { Ff: 3.0, Fc1: 82.3, Fc2: 79.6 }];
const mo = moertelprismen(p0, 28);
pruefe(mo.gueltig && nahe(mo.rfMittel, 7.03125, 1e-9) && nahe(mo.druck.mittel, 50.0729, 1e-4) && mo.klasse === '42,5' && mo.hinweise.length === 0, `Mörtel ${JSON.stringify(mo)}`);
pruefe(moertelprismen(p0, 7).klasse === '–' && moertelprismen(p0, 7).hinweise.some(h => h.feld === 'alter'), '7 Tage: keine Klasse');
pruefe(!moertelprismen([{ Ff: 0, Fc1: 1, Fc2: 1 }], 28).gueltig, 'Kraft 0 → Fehler');

// 6. Fuzz: zufällige Würfel und Prismen → endliche Werte oder sauberer Fehler
let z = 2026;
const rnd = () => { z = (z * 1103515245 + 12345) % 2147483648; return z / 2147483648; };
for (let i = 0; i < 500; i++) {
  const n = 1 + Math.floor(rnd() * 5);
  const ws = Array.from({ length: n }, () => ({ a: 100 + rnd() * 60, b: 100 + rnd() * 60, h: 150, m: 8, F: rnd() * 2000 - 50 }));
  const e = druckpruefung({ wuerfel: ws, trocken: rnd() < 0.5, zielklasse: 'C25/30' });
  if (!e.gueltig) { pruefe(e.hinweise.some(h => h.stufe === 'fehler'), `Fuzz Würfel ${i}: ungültig ohne Fehler`); continue; }
  pruefe(Number.isFinite(e.fcm) && e.fmin <= e.fcm + 1e-9, `Fuzz Würfel ${i}`);
  const ps = Array.from({ length: n }, () => ({ Ff: rnd() * 6, Fc1: rnd() * 120, Fc2: rnd() * 120 }));
  const m = moertelprismen(ps, 28);
  if (m.gueltig) pruefe(Number.isFinite(m.druck.mittel) && m.rc.length === 2 * n, `Fuzz Prismen ${i}`);
}

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log('OK: Laborversuche');
