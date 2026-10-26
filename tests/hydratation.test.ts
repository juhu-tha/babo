// Rechenkern Hydratation, Reife und Nachbehandlung (Umsetzungsplan Phase 4, AP 4.2)
import {
  hydratation, reissrahmen, verdunstungsrate, nachbehandlungsdauer, festigkeitsentwicklungAusR, oberflaechenTempBereich,
  temperaturfaktorReife, wirksamesAlterKonstant, zementbeiwertS, betaCcBegrenzt, kennwerte28, kennwerteZumAlter,
  waermeKennwerte, hydratationswaerme, hydratationsgrad, adiabatischeErwaermung, rissgefahrAusDeltaT, REIFEVERFAHREN,
  type HydratationEingabe, type ZementProfil, type Zementart, type ZementFestigkeitsklasse, type Erhaertung, type Zusatzstoff,
  type Festigkeitsentwicklung, type ExpositionNB, type OberflaechenTemp,
} from '../src/calc/hydratation';
import { temperaturFaktor } from '../src/calc/betonkennwerte';
import inhalt from '../content/hydratationpruefverfahren/HydratationPruefverfahren.json';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (ist: number, soll: number, tol: number) => Math.abs(ist - soll) <= tol * Math.abs(soll);
console.log('--- Test: Hydratation ---');

// 1. Reifefunktionen (Handrechnung)
//    Rastrup: 2^((30 − 20)/10) = 2,0; Saul: (20 + 10)/30 = 1,0, (−10 + 10)/30 = 0; Arrhenius E_a = 40 kJ/mol, 30 °C:
//    exp[40 000/8,31446 · (1/293,15 − 1/303,15)] = exp(0,5414) = 1,718.
pruefe(nahe(temperaturfaktorReife('DIN 1045-3 (Rastrup)', 30), 2.0, 1e-12), 'Rastrup 30 °C = 2');
pruefe(nahe(temperaturfaktorReife('Saul', 20), 1.0, 1e-12) && temperaturfaktorReife('Saul', -10) === 0, 'Saul 20 °C = 1, −10 °C = 0');
pruefe(temperaturfaktorReife('Arrhenius', -10.5, 40) === 0 && temperaturfaktorReife('de Vree', -11) === 0, 'unter −10 °C kein Erhärten');
pruefe(nahe(temperaturfaktorReife('Arrhenius', 30, 40), 1.718, 0.02), `Arrhenius 30 °C ${temperaturfaktorReife('Arrhenius', 30, 40)}`);
for (const v of REIFEVERFAHREN) pruefe(nahe(temperaturfaktorReife(v, 20, 38), 1.0, 1e-12), `${v}: k_T(20 °C) = 1`);
//    fib Model Code 2010, Gl. (5.1-85): t_T = Δt·exp[13,65 − 4000/(273 + T)] (= temperaturFaktor in betonkennwerte.ts);
//    der Modulansatz ist auf 20 °C bezogen und weicht davon um weniger als 2 % ab.
for (const T of [0, 10, 30, 50]) pruefe(nahe(temperaturfaktorReife('fib Model Code 2010', T), temperaturFaktor(T), 0.02), `fib MC2010 ${T} °C`);
pruefe(nahe(wirksamesAlterKonstant('DIN 1045-3 (Rastrup)', 10, 14), 7, 1e-12), 'Rastrup: 14 d bei 10 °C = 7 d wirksames Alter');

// 2. Festigkeitsentwicklung nach DIN EN 1992-1-1, Gl. (3.2): s = 0,25 (Zement N), t = 7 d → β_cc = exp(0,25·(1 − 2)) = 0,7788
pruefe(nahe(betaCcBegrenzt(0.25, 7), 0.7788, 0.02), 'β_cc(7 d, s = 0,25) = 0,779');
pruefe(nahe(betaCcBegrenzt(0.38, 28), 1, 1e-12) && betaCcBegrenzt(0.25, 0) === 0, 'β_cc(28 d) = 1, β_cc(0) = 0');
pruefe(betaCcBegrenzt(0.38, 1e6) === 1.25, 'β_cc auf 1,25 begrenzt');
//    Tab. 3.1: C30/37 f_ctm = 2,9 N/mm², E_cm = 33 GPa; C50/60 f_ctm = 4,1; C60/75 f_ctm = 4,4 N/mm²
pruefe(nahe(kennwerte28(30).fctm, 2.9, 0.02) && nahe(kennwerte28(30).Ecm, 33, 0.02), `C30/37 ${JSON.stringify(kennwerte28(30))}`);
pruefe(nahe(kennwerte28(50).fctm, 4.1, 0.02) && nahe(kennwerte28(60).fctm, 4.4, 0.02), 'f_ctm C50/60, C60/75');
//    Zementklasse 52,5 (f_ck > 50): f_ctm = 2,12·ln(1 + 60,5/10) = 4,14 N/mm²
pruefe(nahe(kennwerte28(52.5).fctm, 4.14, 0.005), `f_ctm(52,5) ${kennwerte28(52.5).fctm}`);
//    Gl. (3.4): α = 1 für t < 28 d, 2/3 ab 28 d; Gl. (3.5): E(t) = β^0,3·E_cm
const k7 = kennwerteZumAlter(0.25, 7, 30);
pruefe(nahe(k7.fct, 0.7788 * 2.9, 0.005) && nahe(k7.E, Math.pow(0.7788, 0.3) * kennwerte28(30).Ecm, 0.005), 'Kennwerte nach 7 d');
const k56 = kennwerteZumAlter(0.25, 56, 30);
pruefe(nahe(k56.fct, Math.pow(k56.beta, 2 / 3) * 2.9, 1e-9), 'f_ctm(56 d) mit α = 2/3');
//    Zementbeiwert s (Moduldatei)
const sSoll: [ZementFestigkeitsklasse, Erhaertung, number][] = [
  ['32.5', 'N', 0.38], ['32.5', 'R', 0.25], ['42.5', 'N', 0.25], ['42.5', 'R', 0.20], ['52.5', 'N', 0.20], ['52.5', 'R', 0.20],
  ['32.5', 'L', 0.30], ['42.5', 'L', 0.30], ['52.5', 'L', 0.25],
];
for (const [k, e, soll] of sSoll) pruefe(nahe(zementbeiwertS(k, e), soll, 1e-12), `s(${k} ${e}) = ${soll}`);

// 3. Wärme: CEM I 42,5 N, z = 350 kg/m³: H_max = 380 J/g; volle adiabatische Erwärmung 350 · 380/2400 = 55,4 K (Handrechnung)
pruefe(nahe(adiabatischeErwaermung(350, 380), 55.42, 0.005), 'ΔT_ad = 55,4 K');
pruefe(nahe(hydratationswaerme(380, 1.2, 1.2), 190, 1e-12) && nahe(hydratationsgrad(1.2, 1.2), 0.5, 1e-12), 'Q(t₅₀) = H_max/2');
const wFA = waermeKennwerte('CEM I', 'N', 'FA', 70, 350);
pruefe(nahe(wFA.Hmax, 360, 1e-12) && nahe(wFA.t50, 1.2 * 1.12, 1e-12), 'FA 70/350: H_max = 360 J/g, t₅₀ = 1,344 d');
const wR = waermeKennwerte('CEM III', 'R', 'SF', 35, 350);
pruefe(nahe(wR.Hmax, 280, 1e-12) && nahe(wR.t50, 3.0 * 0.7 * 0.9, 1e-12), 'CEM III R + SF');
pruefe(rissgefahrAusDeltaT(15.01) === 'Hoch' && rissgefahrAusDeltaT(15) === 'Mittel' && rissgefahrAusDeltaT(10) === 'Gering', 'Rissgefahr-Grenzen');

// 4. Bauteilsimulation – Gleichheit mit dem bisherigen Modulalgorithmus (Referenz unten, ohne Rundungen, f_ck ≤ 42,5)
const basis: HydratationEingabe = {
  zement: 350, tempUmgebung: 15, tempFrischbeton: 20, zementArt: 'CEM I', festigkeitsklasse: '42.5', erhaertung: 'N',
  zusatzstoff: 'Ohne', zusatzstoffMenge: 0, bauteildicke: 0.5, ausschalAnteil: 50, reifeVerfahren: 'Arrhenius', aktivierungsEnergie: 38,
};
function referenzModul(e: HydratationEingabe) {
  const s = zementbeiwertS(e.festigkeitsklasse, e.erhaertung);
  const fck = Number(e.festigkeitsklasse);
  const { Hmax, t50 } = waermeKennwerte(e.zementArt, e.erhaertung, e.zusatzstoff, e.zusatzstoffMenge, e.zement);
  let kern = e.tempFrischbeton, rand = e.tempFrischbeton, te = 0, prev = 0, Hp = 0, maxD = 0, aus = -1, te28 = 0;
  // Die Moduldatei zählte `for (i = 0; i <= 28; i += 0.1)`; durch Rundungsfehler endete die Schleife bei 27,9 d,
  // sodass t_e,28 nie gesetzt wurde (Anzeige 0,0 Tage). Referenz und Kern zählen daher ganzzahlig bis 28,0 d.
  for (let k = 1; k <= 280; k++) {
    const t = k / 10;
    const dt = t - prev;
    te += temperaturfaktorReife(e.reifeVerfahren, kern, e.aktivierungsEnergie) * dt;
    if (t === 28) te28 = te;
    const b = te > 0 ? Math.min(1.25, Math.exp(s * (1 - Math.sqrt(28 / te)))) : 0;
    if (aus === -1 && b * fck >= fck * e.ausschalAnteil / 100) aus = t;
    const H = Hmax * (te / (te + t50)); const dH = Math.max(0, H - Hp); Hp = H;
    const dT = (e.zement * dH) / 2400;
    kern = Math.max(e.tempUmgebung, kern + dT - 0.5 * (kern - e.tempUmgebung) / (e.bauteildicke ** 2) * dt);
    rand = Math.max(e.tempUmgebung, rand + dT * 0.4 - 3.0 * (rand - e.tempUmgebung) / e.bauteildicke * dt);
    if (kern - rand > maxD) maxD = kern - rand;
    prev = t;
  }
  return { te28, aus, maxD };
}
const varianten: Partial<HydratationEingabe>[] = [
  {}, { bauteildicke: 2.0 }, { zementArt: 'CEM III', erhaertung: 'L' }, { reifeVerfahren: 'Saul', tempUmgebung: 5, tempFrischbeton: 10 },
  { reifeVerfahren: 'de Vree', zusatzstoff: 'FA', zusatzstoffMenge: 100 }, { reifeVerfahren: 'fib Model Code 2010', zusatzstoff: 'SF', zusatzstoffMenge: 30 },
  { reifeVerfahren: 'DIN 1045-3 (Rastrup)', ausschalAnteil: 80, festigkeitsklasse: '32.5' },
];
for (const v of varianten) {
  const e = { ...basis, ...v };
  const r = hydratation(e), ref = referenzModul(e);
  pruefe(r.gueltig && nahe(r.te28, ref.te28, 1e-6) && nahe(r.maxTempDiff, ref.maxD, 1e-6) && (r.ausschalTage ?? -1) === ref.aus,
    `1:1 ${JSON.stringify(v)}: t_e,28 ${r.te28}/${ref.te28}, ΔT ${r.maxTempDiff}/${ref.maxD}, Ausschalen ${r.ausschalTage}/${ref.aus}`);
}
const r0 = hydratation(basis);
pruefe(r0.zeit.length === 281 && r0.zeit[20] === 2 && r0.zeit[280] === 28, 'Zeitachse 0 … 28 d, Δt = 0,1 d');
pruefe([r0.fcAkt, r0.fctAkt, r0.EAkt, r0.tempKern, r0.tempRand, r0.tempAdiabat, r0.hydratationsgrad].every(a => a.length === 281), 'Reihenlängen');
//    Adiabatischer Verlauf: Endwert = T₀ + z·Q(t_e,28)/2400 (Telekopsumme), Kern ≤ adiabatisch
pruefe(nahe(r0.tempAdiabat[280] - 20, adiabatischeErwaermung(350, hydratationswaerme(r0.Hmax, r0.t50, r0.te28)), 1e-9), 'adiabatischer Endwert');
pruefe(r0.tempKern.every((t, i) => t <= r0.tempAdiabat[i] + 1e-9), 'Kern ≤ adiabatisch');
//    Ausschalfrist: β_cc ≥ 0,50 erstmals beim angegebenen Zeitpunkt
const ia = Math.round((r0.ausschalTage ?? 0) * 10);
pruefe(r0.ausschalTage !== null && r0.fcAktRel[ia] >= 50 && r0.fcAktRel[ia - 1] < 50, `Ausschalfrist ${r0.ausschalTage} d`);
pruefe(nahe(r0.fc2d, r0.beta2d * r0.fcm28, 1e-12) && r0.te2d > 0, 'Kennwerte nach 2 d');
//    Massiges Bauteil: größerer Kern-Rand-Unterschied als dünnes Bauteil
pruefe(hydratation({ ...basis, bauteildicke: 2.5 }).maxTempDiff > hydratation({ ...basis, bauteildicke: 0.5 }).maxTempDiff, 'ΔT steigt mit der Dicke');

// 5. Randfälle und Grenzen
pruefe(hydratation({ ...basis, ausschalAnteil: 130 }).ausschalTage === null, 'Ausschalfestigkeit > 125 % nie erreicht');
pruefe(hydratation({ ...basis, bauteildicke: 0.2 }).hinweise.some(h => h.feld === 'bauteildicke' && h.stufe === 'warnung'), 'd < 0,30 m → Warnung');
//    Dünnes Bauteil, Frischbeton kälter als die Umgebung (d = 0,1 m, 10 → 40 °C): kein Überschwingen über Umgebung und adiabatischen Verlauf
const duenn = hydratation({ ...basis, bauteildicke: 0.1, tempUmgebung: 40, tempFrischbeton: 10 });
pruefe(duenn.tempKern.every((t, i) => t <= 40 + (duenn.tempAdiabat[i] - 10) + 1e-9), `dünnes Bauteil max T_Kern ${Math.max(...duenn.tempKern)}`);
pruefe(hydratation({ ...basis, festigkeitsklasse: '52.5' }).hinweise.some(h => h.feld === 'festigkeitsklasse'), '52,5 → Hinweis f_ctm');
const unz: Partial<HydratationEingabe>[] = [
  { zement: 0 }, { bauteildicke: 0 }, { zusatzstoffMenge: -1 }, { ausschalAnteil: 0 }, { aktivierungsEnergie: 0 },
  { zusatzstoff: 'SF', zusatzstoffMenge: 350 }, { zementArt: 'CEM III', erhaertung: 'L', zusatzstoff: 'FA', zusatzstoffMenge: 900 },
  { tempUmgebung: NaN }, { tempFrischbeton: -300 },
];
for (const u of unz) {
  const ru = hydratation({ ...basis, ...u });
  pruefe(!ru.gueltig && ru.hinweise.some(h => h.stufe === 'fehler') && ru.zeit.length === 0 && [ru.te28, ru.fcm28, ru.maxTempDiff, ru.fReq].every(Number.isFinite),
    `unzulässig ${JSON.stringify(u)}`);
}

// 6. Reißrahmen-Lehrmodell
const CEMENT_MAP: Record<string, ZementProfil> = inhalt.daten.CEMENT_MAP;
const rr = (p: Partial<{ z: string; tf: number; tu: number; f: number; g: number }>) => reissrahmen({
  zement: CEMENT_MAP[p.z ?? 'CEM I 42.5 N (Standard)'], tFrisch: p.tf ?? 20, tUmgebung: p.tu ?? 20, fasergehalt: p.f ?? 0, festhaltegrad: p.g ?? 100,
});
const rrBasis = rr({});
pruefe(rrBasis.gueltig && rrBasis.punkte.length === 73 && rrBasis.punkte[0].fct === 0 && rrBasis.punkte[0].stress === 0, 'Reißrahmen 0 … 72 h');
pruefe(rrBasis.maxTemp > 20, 'Reißrahmen: Erwärmung durch Hydratation');
const riss = (x: ReturnType<typeof reissrahmen>) => x.rissStunde ?? Infinity;
pruefe(riss(rr({ z: 'CEM I 52.5 R (Schnell)' })) <= riss(rr({ z: 'CEM III/B 32.5 N-LH (Slow)' })), 'CEM I 52,5 R reißt nicht später als CEM III/B');
pruefe(riss(rr({ g: 100 })) <= riss(rr({ g: 30 })), 'geringere Festhaltung → späterer oder kein Riss');
pruefe(riss(rr({ tf: 30 })) <= riss(rr({ tf: 10 })), 'kühlerer Frischbeton → späterer oder kein Riss');
for (const x of [rr({ z: 'CEM I 52.5 R (Schnell)' }), rrBasis]) {
  if (x.rissStunde === null) continue;
  const i = x.rissStunde;
  pruefe(x.punkte[i].stress > x.punkte[i].fct && x.punkte.slice(i).every(p => p.isPointCracked) && x.punkte.slice(0, i).every(p => !p.isPointCracked), 'Rissereignis konsistent');
}
pruefe(!reissrahmen({ zement: { ...CEMENT_MAP['CEM I 42.5 N (Standard)'], hydrationSpeed: 0 }, tFrisch: 20, tUmgebung: 20, fasergehalt: 0, festhaltegrad: 100 }).gueltig, 'hydrationSpeed 0 → unzulässig');
pruefe(!reissrahmen({ zement: CEMENT_MAP['CEM I 42.5 N (Standard)'], tFrisch: 20, tUmgebung: 20, fasergehalt: 0, festhaltegrad: 120 }).gueltig, 'Festhaltegrad > 100 % → unzulässig');

// 7. Verdunstungsrate nach ACI 305R (Gleichung nach Uno, metrisch; öffentlich wiedergegeben z. B. bei Kestrel „How to Prevent Plastic
//    Shrinkage Cracks“). Handbeispiel des Moduls: T_a = T_c = 25 °C, r = 0,30, V = 25 km/h → 5 · 43^2,5 · 0,70 · 29 · 10⁻⁶ = 1,23 kg/(m²·h)
const v1 = verdunstungsrate({ tLuft: 25, tBeton: 25, rh: 30, wind: 25 });
pruefe(nahe(v1.E, 1.23, 0.02) && v1.kritisch, `Verdunstung Beispiel ${v1.E}`);
//    Grundeinstellung: 25/25 °C, r = 0,50, V = 15 km/h → 5 · 12 124,7 · 0,5 · 19 · 10⁻⁶ = 0,576 kg/(m²·h)
const v2 = verdunstungsrate({ tLuft: 25, tBeton: 25, rh: 50, wind: 15 });
pruefe(nahe(v2.E, 0.576, 0.02) && !v2.kritisch, `Verdunstung Grundeinstellung ${v2.E}`);
pruefe(verdunstungsrate({ tLuft: 20, tBeton: 20, rh: 100, wind: 30 }).E === 0, 'r = 100 %, T_a = T_c → E = 0');
const v3 = verdunstungsrate({ tLuft: 30, tBeton: 15, rh: 90, wind: 10 });
pruefe(v3.E === 0 && v3.Eroh < 0 && v3.hinweise.some(h => h.feld === 'rh'), 'negativer Rechenwert → E = 0 mit Hinweis');
pruefe(verdunstungsrate({ tLuft: 25, tBeton: 25, rh: 50, wind: 0 }).E < v2.E, 'Wind erhöht E');
for (const u of [{ rh: 120 }, { rh: -1 }, { wind: -1 }, { tLuft: -20 }, { tBeton: NaN }]) {
  const vu = verdunstungsrate({ tLuft: 25, tBeton: 25, rh: 50, wind: 15, ...u });
  pruefe(!vu.gueltig && vu.E === 0, `Verdunstung unzulässig ${JSON.stringify(u)}`);
}

// 8. Mindestdauer der Nachbehandlung nach DIN 1045-3 (Tabelle öffentlich wiedergegeben z. B. MPA Hannover,
//    „Nachbehandlung mit ZTV“, 2020): XC4, 12 °C, r = 0,25 (langsam) → 7 d; XM doppelt → 14 d; 5 … 10 °C, r < 0,15 → 15 d
pruefe(festigkeitsentwicklungAusR(0.25) === 'langsam' && oberflaechenTempBereich(12) === '10_15', 'Klassenzuordnung Beispiel');
pruefe(nachbehandlungsdauer('langsam', 'andere', '10_15').tage === 7, 'XC4, 12 °C, langsam → 7 d');
pruefe(nachbehandlungsdauer('langsam', 'xm', '10_15').tage === 14, 'XM → 14 d');
pruefe(nachbehandlungsdauer('sehr_langsam', 'andere', '5_10').tage === 15 && nachbehandlungsdauer('schnell', 'andere', 'ge25').tage === 1, 'Tabellenecken');
pruefe(nachbehandlungsdauer('sehr_langsam', 'x0_xc1', '5_10').tage === 0.5, 'X0/XC1 → 0,5 d');
const nb5 = nachbehandlungsdauer('mittel', 'x0_xc1', '<5');
pruefe(nb5.tage === null && nb5.sondermassnahmen, 'T < 5 °C → Sondermaßnahmen');
pruefe(festigkeitsentwicklungAusR(0.5) === 'schnell' && festigkeitsentwicklungAusR(0.3) === 'mittel' && festigkeitsentwicklungAusR(0.15) === 'langsam'
  && festigkeitsentwicklungAusR(0.1499) === 'sehr_langsam', 'Grenzen r');
pruefe(oberflaechenTempBereich(25) === 'ge25' && oberflaechenTempBereich(24.9) === '15_25' && oberflaechenTempBereich(5) === '5_10' && oberflaechenTempBereich(4.9) === '<5', 'Grenzen T');
//    Monotonie: längere Dauer bei kälterer Oberfläche und langsamerer Festigkeitsentwicklung
const ents: Festigkeitsentwicklung[] = ['schnell', 'mittel', 'langsam', 'sehr_langsam'];
const temps: OberflaechenTemp[] = ['ge25', '15_25', '10_15', '5_10'];
for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
  const t = nachbehandlungsdauer(ents[i], 'andere', temps[j]).tage ?? NaN;
  if (i > 0) pruefe(t >= (nachbehandlungsdauer(ents[i - 1], 'andere', temps[j]).tage ?? NaN), `Monotonie r ${ents[i]} ${temps[j]}`);
  if (j > 0) pruefe(t >= (nachbehandlungsdauer(ents[i], 'andere', temps[j - 1]).tage ?? NaN), `Monotonie T ${ents[i]} ${temps[j]}`);
}

// 9. Fuzz: 1 000 Zufallseingaben ohne NaN/∞
let seed = 11;
const z = (a: number, c: number) => { seed = (seed * 1103515245 + 12345) % 2147483648; return a + (c - a) * (seed / 2147483648); };
const arten: Zementart[] = ['CEM I', 'CEM II', 'CEM III', 'CEM IV', 'CEM V'];
const klassen: ZementFestigkeitsklasse[] = ['32.5', '42.5', '52.5'];
const erh: Erhaertung[] = ['L', 'N', 'R'];
const zs: Zusatzstoff[] = ['Ohne', 'FA', 'SF'];
const expo: ExpositionNB[] = ['x0_xc1', 'andere', 'xm'];
const profile = Object.values(CEMENT_MAP);
for (let i = 0; i < 1000; i++) {
  const r = hydratation({
    zement: z(-50, 600), tempUmgebung: z(-30, 50), tempFrischbeton: z(-5, 45), zementArt: arten[i % 5], festigkeitsklasse: klassen[i % 3],
    erhaertung: erh[(i >> 1) % 3], zusatzstoff: zs[(i >> 2) % 3], zusatzstoffMenge: z(-10, 300), bauteildicke: z(-0.1, 4),
    ausschalAnteil: z(-10, 150), reifeVerfahren: REIFEVERFAHREN[i % 5], aktivierungsEnergie: z(-5, 80),
  });
  const reihen = [r.fcAkt, r.fcRef, r.fctAkt, r.EAkt, r.tempKern, r.tempRand, r.tempAdiabat, r.fcAktRel, r.fctAktRel, r.hydratationsgrad].flat();
  const skalare = [r.te28, r.te2d, r.beta2d, r.fc2d, r.fct2d, r.E2d, r.maxTempDiff, r.fReq, r.Hmax, r.t50, r.fcm28, r.fctm28, r.Ecm28];
  if (![...reihen, ...skalare].every(Number.isFinite)) { pruefe(false, `Fuzz Hydratation ${i}: ${JSON.stringify(skalare)} ${reihen.findIndex(x => !Number.isFinite(x))}`); break; }
  const x = reissrahmen({ zement: profile[i % profile.length], tFrisch: z(-10, 45), tUmgebung: z(-10, 40), fasergehalt: z(-5, 100), festhaltegrad: z(-10, 110) });
  if (![x.maxTemp, ...x.punkte.flatMap(p => [p.temp, p.fct, p.stress, p.displayStress])].every(Number.isFinite)) { pruefe(false, `Fuzz Reißrahmen ${i}`); break; }
  const v = verdunstungsrate({ tLuft: z(-30, 50), tBeton: z(-30, 50), rh: z(-10, 110), wind: z(-5, 60) });
  if (![v.E, v.Eroh].every(Number.isFinite) || v.E < 0) { pruefe(false, `Fuzz Verdunstung ${i}`); break; }
  const nb = nachbehandlungsdauer(festigkeitsentwicklungAusR(z(-0.2, 1.2)), expo[i % 3], oberflaechenTempBereich(z(-10, 40)));
  if (nb.tage !== null && !(Number.isFinite(nb.tage) && nb.tage > 0)) { pruefe(false, `Fuzz Nachbehandlung ${i}`); break; }
}

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log('OK: Hydratation');
