// Rechenkern Bauchemie: Stellmittel-Rheologie, AKR, Karbonatisierung, Stöchiometrie, pH (AP 4.2)
import {
  stellmittelViskositaet, stellmittelRheologie, SCHERRATEN, akrDehnung, akrKurve, karbonatisierungstiefe, zeitBisBewehrung,
  K_RICHTWERTE, molmasse, stoffumsatz, phAusHydroxid, hydroxidAusPh, phAusOxonium, oxoniumAusPh,
} from '../src/calc/bauchemie';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (ist: number, soll: number, tol: number) => Math.abs(ist - soll) <= tol;
console.log('--- Test: Bauchemie ---');

// 1. Stellmittel-Lehrmodell (Startwerte 0,8 %, 15 s⁻¹): η = 1,5 + 72/(15^0,72 + 0,25) = 1,5 + 72/(7,0236 + 0,25) = 11,4 Pa·s
const rh = stellmittelRheologie(0.8, 15);
pruefe(rh.gueltig && rh.viskositaet === 11.4 && !rh.ruhe && rh.dosierung === 'optimal' && rh.kraftaufwand === 'optimal', `Rheologie ${JSON.stringify(rh)}`);
pruefe(rh.kurve.length === SCHERRATEN.length && rh.referenz.every(x => x === 2), 'Kurve und Referenz-Slurry 2,0 Pa·s');
pruefe(rh.kurve.every((x, i) => i === 0 || x <= rh.kurve[i - 1]), 'scherverdünnend: η fällt mit γ̇');
pruefe(stellmittelViskositaet(0, 50) === 1.5, 'ohne Stellmittel: 1,5 Pa·s');
//    Grenzen 0,4 / 1,5 % und Ruhe unter 5 s⁻¹
pruefe(stellmittelRheologie(0.39, 1).dosierung === 'unter' && stellmittelRheologie(0.4, 1).dosierung === 'optimal' && stellmittelRheologie(1.5, 1).dosierung === 'optimal' && stellmittelRheologie(1.51, 1).dosierung === 'ueber', 'Dosierungsgrenzen');
pruefe(stellmittelRheologie(1, 4.99).ruhe && !stellmittelRheologie(1, 5).ruhe, 'Ruhegrenze 5 s⁻¹');
pruefe(stellmittelRheologie(0, 100).kraftaufwand === 'leicht' && stellmittelRheologie(2, 100).kraftaufwand === 'optimal' && stellmittelRheologie(2, 5).kraftaufwand === 'hoch', 'Kraftaufwand (1,5 / 8,0 / 53,9 Pa·s)');
//    γ̇ = 0: endlich (1,5 + c·90/0,25)
pruefe(stellmittelViskositaet(1, 0) === 361.5, 'γ̇ = 0 endlich');
pruefe(!stellmittelRheologie(-0.1, 10).gueltig && !stellmittelRheologie(0.5, -1).gueltig && !stellmittelRheologie(NaN, 10).gueltig, 'unzulässig');

// 2. AKR-Lehrmodell: k = (Na₂O/5)·(φ/100) für φ > 80 %, sonst 0,1; ε = k·ln(t + 1)
//    3 kg/m³, 90 %: k = 0,54; nach 20 a ε = 0,54·ln 21 = 1,6440 mm/m
pruefe(nahe(akrDehnung(3, 90, 20), 0.54 * Math.log(21), 1e-12) && nahe(akrDehnung(3, 90, 20), 1.64404, 1e-5), 'AKR 3 kg/m³, 90 %');
pruefe(nahe(akrDehnung(3, 80, 20), 0.06 * Math.log(21), 1e-12), 'φ = 80 %: Schwelle nicht überschritten → Faktor 0,1');
pruefe(akrDehnung(3, 90, 0) === 0, 't = 0 → keine Dehnung');
const ak = akrKurve(3, 80);
pruefe(ak.gueltig && ak.jahre.length === 20 && ak.jahre[0] === 1 && ak.jahre[19] === 20, 'Kurve 1 … 20 Jahre');
pruefe(!akrKurve(-1, 80).gueltig && !akrKurve(3, 120).gueltig && !akrKurve(3, 80, 0).gueltig && akrKurve(3, 80, 0).dehnung.length === 0, 'AKR unzulässig');

// 3. Karbonatisierung – Handbeispiel des Moduls (content/bauchemie/Bauchemie.json, „Bauchemie.schritte“):
//    c = 40 mm, K = 4 mm/√a → t = (40/4)² = 100 a; K = 2 → 400 a; c = 30 mm, K = 4 → 56,25 a
pruefe(zeitBisBewehrung(40, 4).jahre === 100 && zeitBisBewehrung(40, 2).jahre === 400 && zeitBisBewehrung(30, 4).jahre === 56.25, 'Zeit bis zur Bewehrung');
pruefe(karbonatisierungstiefe(4, 25) === 20 && karbonatisierungstiefe(4, 0) === 0, 'd_k = K·√t');
pruefe(K_RICHTWERTE.map(x => x.k).join() === '4,2,0.5', 'Richtwerte K je w/z');
//    Rundreise: Tiefe nach t und Zeit bis zu dieser Tiefe
pruefe(nahe(zeitBisBewehrung(karbonatisierungstiefe(2, 37), 2).jahre, 37, 1e-9), 'Rundreise Wurzel-t-Gesetz');
pruefe(!zeitBisBewehrung(40, 0).gueltig && !zeitBisBewehrung(-1, 4).gueltig, 'K = 0 bzw. c < 0 → Fehler');

// 4. Stöchiometrie – molare Massen mit IUPAC-Standard-Atomgewichten (CIAAW, gekürzt):
//    Ca(OH)₂ = 40,078 + 2·(15,999 + 1,008) = 74,092 g/mol; CO₂ = 44,009; CaCO₃ = 100,086; H₂O = 18,015
pruefe(nahe(molmasse('Ca(OH)2'), 74.092, 1e-9) && nahe(molmasse('CO2'), 44.009, 1e-9) && nahe(molmasse('CaCO3'), 100.086, 1e-9) && nahe(molmasse('H2O'), 18.015, 1e-9), 'molare Massen');
//    Massenerhaltung Ca(OH)₂ + CO₂ → CaCO₃ + H₂O
pruefe(nahe(molmasse('Ca(OH)2') + molmasse('CO2'), molmasse('CaCO3') + molmasse('H2O'), 1e-9), 'Massenerhaltung');
//    Handbeispiel des Moduls („Bauchemie.schritte_2“): 1 kg Portlandit bindet 44,0/74,1 = 0,59 kg CO₂
const u = stoffumsatz('Ca(OH)2', 'CO2', 1);
pruefe(u.gueltig && nahe(u.masse, 0.594, 5e-4) && nahe(u.verhaeltnis, 44.009 / 74.092, 1e-12), `CO₂-Bindung ${u.masse}`);
//    C₃S (Alit) = 3·40,078 + 28,085 + 5·15,999 = 228,314 g/mol; Gips CaSO₄·2H₂O ohne Punktnotation als CaSO6H4 = 172,164 g/mol
pruefe(nahe(molmasse('Ca3SiO5'), 228.314, 1e-9) && nahe(molmasse('CaSO6H4'), 172.164, 1e-9), 'Alit, Gips');
pruefe(nahe(molmasse('Ca((OH)2)2'), 40.078 + 4 * 17.007, 1e-9), 'verschachtelte Klammern');
pruefe([ 'Xx2', 'Ca(OH', 'Ca)OH(', '', 'ca' ].every(f => Number.isNaN(molmasse(f))), 'unlesbare Formeln → NaN');
pruefe(!stoffumsatz('Xy', 'CO2', 1).gueltig && !stoffumsatz('CaO', 'CO2', -1).gueltig && !stoffumsatz('CaO', 'CO2', 1, 0).gueltig, 'Umsatz unzulässig');
//    Stoffmengenverhältnis ≠ 1: CaCO₃ → CaO + CO₂, 1 t Kalkstein setzt 44,009/100,086 = 0,4397 t CO₂ frei
pruefe(nahe(stoffumsatz('CaCO3', 'CO2', 1000).masse, 439.71, 0.01) && nahe(stoffumsatz('CO2', 'Ca(OH)2', 1, 2, 1).masse, 74.092 / 88.018, 1e-9), 'Kalkbrennen, ν ≠ 1');

// 5. pH-Wert (25 °C): pH = 14 + lg[OH⁻]; Porenlösung pH 12,6 (Bauchemie.formeln) ↔ [OH⁻] = 10^(−1,4) = 0,0398 mol/l
pruefe(nahe(hydroxidAusPh(12.6), 0.039811, 1e-6) && nahe(phAusHydroxid(0.1), 13, 1e-12) && nahe(phAusOxonium(1e-7), 7, 1e-12), 'pH-Werte');
for (const ph of [0, 3.5, 7, 9, 12.6, 13.5, 14]) {
  pruefe(nahe(phAusHydroxid(hydroxidAusPh(ph)), ph, 1e-12) && nahe(phAusOxonium(oxoniumAusPh(ph)), ph, 1e-12), `Rundreise pH ${ph}`);
}

// 6. Fuzz: 1 000 Zufallseingaben ohne NaN/∞ bei gültigem Ergebnis
let seed = 271828;
const z = (a: number, c: number) => { seed = (seed * 1103515245 + 12345) % 2147483648; return a + (c - a) * (seed / 2147483648); };
const formeln = ['Ca(OH)2', 'CO2', 'CaCO3', 'Ca3SiO5', 'Na2O', 'K2O', 'SiO2', 'Al2O3', 'Fe2O3', 'MgO', 'NaCl', 'CaSO4'];
for (let i = 0; i < 1000; i++) {
  const r = stellmittelRheologie(z(-0.5, 3), z(-1, 150));
  const a = akrKurve(z(-1, 8), z(-10, 110));
  const t = zeitBisBewehrung(z(-5, 80), z(-1, 8));
  const s = stoffumsatz(formeln[i % formeln.length], formeln[(i * 7) % formeln.length], z(-1, 1000));
  const ph = z(0, 14);
  const zahlen = [
    ...(r.gueltig ? [r.viskositaet, ...r.kurve] : []),
    ...(a.gueltig ? a.dehnung : []),
    ...(t.gueltig ? [t.jahre] : []),
    ...(s.gueltig ? [s.masse, s.verhaeltnis] : []),
    hydroxidAusPh(ph), phAusHydroxid(hydroxidAusPh(ph)),
  ];
  if (!zahlen.every(Number.isFinite) || (a.gueltig && a.dehnung.some(x => x < 0))) { pruefe(false, `Fuzz ${i}`); break; }
}

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log('OK: Bauchemie');
