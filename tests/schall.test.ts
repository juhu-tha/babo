// Rechenkerne Schallschutz und Fenster (Umsetzungsplan Phase 4, AP 4.3)
import { rwMassiv, schalldaemmung, wandSchalldaemmung, PUTZ_MASSE_BEIDSEITIG, lnEq0w, resonanzfrequenzEstrich, deltaLwNassestrich, deltaLFrequenz, korrekturwertK, trittschall, ANFORDERUNGEN_TRITTSCHALL, U_PROG_TRITTSCHALL, type TrittschallEingabe } from '../src/calc/schall';
import { uwFenster, PSI_ABSTANDHALTER } from '../src/calc/fenster';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (ist: number, soll: number, tol: number) => Math.abs(ist - soll) <= tol;
console.log('--- Test: Schall und Fenster ---');

// 1. DIN 4109-32 Gl. (2): R_w(100) = 39,6 dB; R_w(300) = 54,3 dB; R_w(400) = 58,2 dB; Verdopplung der Masse → +9,3 dB
pruefe(nahe(rwMassiv(100), 39.6, 0.05) && nahe(rwMassiv(300), 54.3, 0.05) && nahe(rwMassiv(400), 58.2, 0.05), 'R_w-Stützwerte');
pruefe(nahe(rwMassiv(400) - rwMassiv(200), 30.9 * Math.log10(2), 1e-9), 'Massegesetz +9,3 dB je Verdopplung');
// 240 mm KS (2000 kg/m³) + 2 × 15 mm Kalkputz (1400 kg/m³): m' = 480 + 42 = 522 kg/m² → R_w = 61,8 dB
const ks = schalldaemmung([{ d: 0.015, density: 1400 }, { d: 0.24, density: 2000 }, { d: 0.015, density: 1400 }]);
pruefe(nahe(ks.mStrich, 522, 1e-9) && nahe(ks.Rw, 61.8, 0.05) && ks.hinweise.length === 0, `KS-Wand ${ks.Rw}`);
pruefe(schalldaemmung([{ d: 0.1, density: 400 }]).hinweise.some(x => x.feld === 'm'), 'außerhalb 65–720 → Warnung');
pruefe(schalldaemmung([{ d: 0.24, density: 800 }, { d: 0.16, density: 20 }]).hinweise.some(x => x.feld === 'aufbau'), 'WDVS → Warnung');
pruefe(schalldaemmung([{ d: 0, density: 800 }]).hinweise.some(x => x.stufe === 'fehler') && schalldaemmung([]).gueltig === false, 'Fehlerfälle');
// 1b. Beispielrechnung (Modul Beispielrechnungen, Reiter Schallschutz) – Massekurve DIN 4109-32 statt der früheren
//     Näherung 32,4·lg m′ − 26,0 („Beiblatt 1“): KS 17,5 cm, ρ = 2000, Putz 40 kg/m² → m′ = 390 kg/m²,
//     R_w = 30,9·lg 390 − 22,2 = 57,86 dB, R′_w = 55,86 dB (K_F = 2); HLz 24 cm, ρ = 1200 → m′ = 328, R_w = 55,54 dB
const ksW = wandSchalldaemmung({ dicke: 0.175, rohdichte: 2000, putzMasse: PUTZ_MASSE_BEIDSEITIG, kF: 2 });
pruefe(nahe(ksW.mStrich, 390, 1e-9) && nahe(ksW.Rw, 57.86, 0.005) && nahe(ksW.RwStrich, 55.86, 0.005) && ksW.hinweise.length === 0, `Beispiel KS ${ksW.Rw}`);
pruefe(nahe(wandSchalldaemmung({ dicke: 0.24, rohdichte: 1200, putzMasse: 40, kF: 2 }).Rw, 55.54, 0.005), 'Beispiel HLz');
pruefe(nahe(ksW.Rw, rwMassiv(390), 1e-12), 'Beispielrechnung nutzt dieselbe Massekurve wie der Kern');
// Grenzen: kein Formelwechsel unter 150 kg/m² mehr (stetig), Warnung außerhalb 65–720 kg/m², Fehler bei d ≤ 0
const pb = wandSchalldaemmung({ dicke: 0.24, rohdichte: 500, putzMasse: 0, kF: 0 });
pruefe(nahe(pb.Rw, rwMassiv(120), 1e-12) && pb.hinweise.length === 0, 'Porenbeton 120 kg/m² ohne Ersatzformel');
pruefe(wandSchalldaemmung({ dicke: 0.1, rohdichte: 400, putzMasse: 0, kF: 0 }).hinweise.some(x => x.feld === 'm' && x.stufe === 'warnung'), 'm′ < 65 → Warnung');
pruefe(wandSchalldaemmung({ dicke: 0.365, rohdichte: 2000, putzMasse: 40, kF: 0 }).hinweise.some(x => x.feld === 'm'), 'm′ > 720 → Warnung');
pruefe(wandSchalldaemmung({ dicke: 0, rohdichte: 2000, putzMasse: 40, kF: 0 }).gueltig === false && wandSchalldaemmung({ dicke: 0.2, rohdichte: NaN, putzMasse: 0, kF: 0 }).gueltig === false, 'Fehlerfälle Beispielrechnung');
{
  let sd = 3;
  const zz = (a: number, b: number) => { sd = (sd * 1103515245 + 12345) % 2147483648; return a + (b - a) * (sd / 2147483648); };
  for (let i = 0; i < 1000; i++) {
    const w = wandSchalldaemmung({ dicke: zz(0.1, 0.365), rohdichte: zz(400, 2600), putzMasse: zz(0, 40), kF: zz(0, 4) });
    pruefe([w.mStrich, w.Rw, w.RwStrich].every(Number.isFinite), `Fuzz Beispielrechnung ${i}`);
  }
}

// 2. Normfenster 1,23 × 1,48 m, Rahmen 110 mm, U_g = 0,6, U_f = 1,1, Ψ = 0,038 (Hand):
//    A = 1,8204; A_g = 1,01·1,26 = 1,2726; A_f = 0,5478; l_g = 4,54 m
//    U_w = (0,76356 + 0,60258 + 0,17252)/1,8204 = 0,8452 W/(m²K)
const f = uwFenster({ breite: 1.23, hoehe: 1.48, rahmenMm: 110, ug: 0.6, uf: 1.1, psi: PSI_ABSTANDHALTER.warm_edge_kunststoff, g: 0.53, strahlung: 450 });
pruefe(nahe(f.Ag, 1.2726, 1e-9) && nahe(f.lg, 4.54, 1e-9) && nahe(f.uw, 0.8452, 1e-4) && f.gegKonform && !f.passivhaus, `U_w ${f.uw}`);
// Grenzfall ohne Rahmen: U_w = U_g; Rahmen zu breit → Fehler (vorher stiller Ersatz 0,1 m Glasbreite)
pruefe(nahe(uwFenster({ breite: 1, hoehe: 1, rahmenMm: 0, ug: 1.1, uf: 1.3, psi: 0, g: 0.6, strahlung: 0 }).uw, 1.1, 1e-12), 'U_w = U_g ohne Rahmen');
pruefe(uwFenster({ breite: 0.2, hoehe: 1, rahmenMm: 110, ug: 1, uf: 1, psi: 0.04, g: 0.5, strahlung: 0 }).hinweise.some(x => x.stufe === 'fehler'), 'Rahmen zu breit');

// 3. Trittschall (Z24) – Deckenverfahren nach DIN 4109-2: L'_n,w = L_n,eq,0,w − ΔL_w + K, Nachweis mit u_prog = 3 dB
//    L_n,eq,0,w = 164 − 35·lg m' (DIN 4109-32, öffentlich wiedergegeben im Schöck-Handout 2018):
//    m' = 300 → 164 − 35·2,4771 = 77,30 dB; m' = 500 → 69,54 dB; Verdopplung der Masse → −35·lg 2 = −10,5 dB
pruefe(nahe(lnEq0w(300), 77.30, 0.005) && nahe(lnEq0w(500), 69.536, 0.001) && nahe(lnEq0w(200) - lnEq0w(400), 35 * Math.log10(2), 1e-12), 'L_n,eq,0,w-Stützwerte');
//    f₀ = 160·√(s'/m'): s' = 20 MN/m³, m' = 100 kg/m² → 71,55 Hz; (1/2π)·√(20·10⁶/100) = 71,18 Hz (Rundung 160 statt 159,2)
pruefe(nahe(resonanzfrequenzEstrich(20, 100), 71.554, 1e-3) && nahe(resonanzfrequenzEstrich(20, 100), Math.sqrt(20e6 / 100) / (2 * Math.PI), 0.4), 'f₀ Masse-Feder');
//    ΔL(f) = 30·lg(f/f₀): eine Oktave über f₀ → 9,03 dB, unterhalb f₀ → 0
pruefe(nahe(deltaLFrequenz(200, 100), 30 * Math.log10(2), 1e-12) && deltaLFrequenz(50, 100) === 0, 'ΔL(f)');
//    ΔL_w (vorläufig, F-Freigabe): 13·lg 100 − 14,2·lg 20 + 20,8 = 26 − 18,475 + 20,8 = 28,33 dB; weichere Dämmung (s' = 10) → +4,27 dB
pruefe(nahe(deltaLwNassestrich(100, 20), 28.3254, 1e-4) && nahe(deltaLwNassestrich(100, 10) - deltaLwNassestrich(100, 20), 14.2 * Math.log10(2), 1e-12), 'ΔL_w-Näherung');
//    K (vorläufig, F-Freigabe): gleiche Massen → 0,6 dB; Decke 4-mal so schwer wie Flanken → 0,6 + 5,5·lg 4 = 3,91 dB; leichtere Decke → 0
pruefe(nahe(korrekturwertK(300, 300), 0.6, 1e-12) && nahe(korrekturwertK(400, 100), 3.9113, 1e-4) && korrekturwertK(100, 400) === 0, 'K');
pruefe(U_PROG_TRITTSCHALL === 3 && ANFORDERUNGEN_TRITTSCHALL.some(a => a.wert === 50) && ANFORDERUNGEN_TRITTSCHALL.some(a => a.wert === 53) && ANFORDERUNGEN_TRITTSCHALL[0].id === 'wtd_2018' && ANFORDERUNGEN_TRITTSCHALL[0].wert === 50, 'Anforderungen: Standard 50 dB');
// Entscheidung 27.10.: 50 dB (DIN 4109-1:2018) Standard, 53 dB (DIN 4109:1989) historische Option – bestätigt, ohne F-Freigabe;
// Treppenwerte bleiben vorläufig
const anf = Object.fromEntries(ANFORDERUNGEN_TRITTSCHALL.map(a => [a.id, a]));
pruefe(anf.wtd_1989.wert === 53 && !/F-Freigabe|Normprüfung ausstehend/.test(anf.wtd_2018.quelle) && !/F-Freigabe|Normprüfung ausstehend/.test(anf.wtd_1989.quelle) && anf.treppe_2018.quelle.includes('Normprüfung ausstehend') && anf.treppe_rh.quelle.includes('Normprüfung ausstehend'), 'Kennzeichnung F-Freigabe nur noch für Treppenwerte');

//    Handbeispiel Wohnungstrenndecke: 18 cm Stahlbeton (2400 kg/m³) + 10 kg/m² Putz → m' = 442 kg/m², L_n,eq,0,w = 71,41 dB;
//    50 mm Zementestrich (2000 kg/m³) auf s' = 20 MN/m³ → m' = 100 kg/m², f₀ = 71,6 Hz, ΔL_w = 28,33 dB;
//    Flanken m'_f,m = 250 kg/m² → K = 0,6 + 5,5·lg(442/250) = 1,96 dB; L'_n,w = 71,41 − 28,33 + 1,96 = 45,05 dB; + 3 = 48,05 ≤ 50 dB
const basisT: TrittschallEingabe = { dDecke: 0.18, rhoDecke: 2400, mZusatz: 10, dEstrich: 0.05, rhoEstrich: 2000, sStrich: 20, mFlanke: 250, zulLnw: 50 };
const tr = trittschall(basisT);
pruefe(tr.gueltig && nahe(tr.mDecke, 442, 1e-9) && nahe(tr.lnEq0w, 71.4102, 1e-4) && nahe(tr.mEstrich, 100, 1e-9) && nahe(tr.f0, 71.554, 1e-3), `Trittschall Massen ${JSON.stringify(tr)}`);
pruefe(nahe(tr.deltaLw, 28.3254, 1e-4) && nahe(tr.k, 1.96115, 1e-5) && nahe(tr.lnwStrich, 45.0460, 1e-4) && nahe(tr.nachweis, 48.0460, 1e-4) && tr.erfuellt && nahe(tr.reserve, 1.954, 1e-3) && tr.hinweise.length === 0, `Trittschall Ergebnis ${tr.lnwStrich} ${tr.hinweise.map(h => h.text)}`);
//    Grenze: gleiche Decke mit steifer Dämmung s' = 40 → ΔL_w = 24,05 dB, L'_n,w + 3 = 52,32 dB > 50 → nicht erfüllt, aber ≤ 53 (Bestand 1989)
const steif = trittschall({ ...basisT, sStrich: 40 });
pruefe(!steif.erfuellt && nahe(steif.nachweis, 52.3206, 1e-4) && trittschall({ ...basisT, sStrich: 40, zulLnw: 53 }).erfuellt, `steife Dämmung ${steif.nachweis}`);
//    Randfälle: schwere Flanken → K = 0 mit Warnung; dünne Decke außerhalb 100–720 → Warnung; Null-/Negativwerte → Fehler
pruefe(trittschall({ ...basisT, mFlanke: 600 }).k === 0 && trittschall({ ...basisT, mFlanke: 600 }).hinweise.some(x => x.feld === 'k'), 'K = 0 bei schweren Flanken');
pruefe(trittschall({ ...basisT, dDecke: 0.03, mZusatz: 0 }).hinweise.some(x => x.feld === 'mDecke'), 'm\' < 100 → Warnung');
for (const f of ['dDecke', 'rhoEstrich', 'sStrich', 'mFlanke', 'zulLnw'] as const) pruefe(!trittschall({ ...basisT, [f]: 0 }).gueltig, `${f} = 0 → Fehler`);
pruefe(!trittschall({ ...basisT, mZusatz: -1 }).gueltig && !trittschall({ ...basisT, sStrich: NaN }).gueltig, 'negative Zusatzmasse, NaN → Fehler');

//    Fuzz: 1 000 Zufallsaufbauten – endlich; L'_n,w fällt mit schwererer Decke und weicherer Dämmung, steigt mit leichteren Flanken
let zt = 4109;
const rt = () => { zt = (zt * 1103515245 + 12345) % 2147483648; return zt / 2147483648; };
for (let i = 0; i < 1000; i++) {
  const e: TrittschallEingabe = { dDecke: 0.1 + rt() * 0.25, rhoDecke: 1800 + rt() * 700, mZusatz: rt() * 40, dEstrich: 0.035 + rt() * 0.04, rhoEstrich: 1900 + rt() * 300, sStrich: 5 + rt() * 45, mFlanke: 100 + rt() * 400, zulLnw: 40 + rt() * 20 };
  const r = trittschall(e);
  pruefe(r.gueltig && [r.lnEq0w, r.f0, r.deltaLw, r.k, r.lnwStrich, r.nachweis, r.reserve].every(Number.isFinite) && r.k >= 0, `Fuzz ${i}: endlich`);
  pruefe(nahe(r.nachweis - r.lnwStrich, 3, 1e-12) && r.erfuellt === (r.nachweis <= e.zulLnw), `Fuzz ${i}: Nachweis`);
  pruefe(trittschall({ ...e, dDecke: e.dDecke * 1.1 }).lnwStrich <= r.lnwStrich + 1e-9, `Fuzz ${i}: schwerere Decke`);
  pruefe(trittschall({ ...e, sStrich: e.sStrich * 0.8 }).lnwStrich < r.lnwStrich, `Fuzz ${i}: weichere Dämmung`);
  pruefe(trittschall({ ...e, mFlanke: e.mFlanke * 0.9 }).lnwStrich >= r.lnwStrich - 1e-12, `Fuzz ${i}: leichtere Flanken`);
}

if (fehler.length) { for (const x of fehler) console.error(`FAIL: ${x}`); process.exit(1); }
console.log('OK: Schall und Fenster');
