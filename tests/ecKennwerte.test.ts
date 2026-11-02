// Modul „Kennwerte und Bemessungswerte nach Eurocode“ (ec_kennwerte, 02.11.2026): Rechenkern, Beispiele, Konsistenz
import fs from 'fs';
import {
  ecKennwerte, charakteristischAusSerie, fraktilfaktorKnBekannt, KN_TAB_BEKANNT, GAMMA_WIDERSTAND, EC_KLASSEN,
  vorhaltemass, sigmaAusVorhalt, unterschreitung, type EcBaustoff,
} from '../src/calc/ecKennwerte';
import { BETON_EC2, ALPHA_CC, GAMMA_C, GAMMA_S, BETONSTAHL, BAUSTAHL_EC3, BSH_EN14080, HOLZ_EN338, fcdBeton } from '../src/data/kennwerte';
import { EC2_NA_DE } from '../src/data/normParams';
import { EC2_BETON_NA } from '../src/calc/betonkennwerte';
import { EC3_NA_DE } from '../src/calc/stahlbau';
import { GAMMA_M_HOLZ, KMOD } from '../src/calc/holzbau';
import { GAMMA_M_MW, ZETA_MW, fkNA } from '../src/calc/mauerwerk';
import { GAMMA_M as GAMMA_STATISTIK, fraktilfaktorKn } from '../src/calc/statistik';
import { SIGMA_MIN_KONFORMITAET, konformitaetDruck } from '../src/calc/festbetonStatistik';
import { MODUL_BY_ID } from '../src/registry/modules';
import { QUIZ_QUESTIONS } from '../src/data/quizData';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nah = (a: number, b: number, tol = 1e-9) => Math.abs(a - b) <= tol;
console.log('--- Test: Kennwerte und Bemessungswerte (ec_kennwerte) ---');

// 1. Beispiel 1: C30/37 (Handrechnung: f_cm = 38, f_ctm = 0,30·30^(2/3) = 2,90, E_cm = 22 000·3,8^0,3 = 32 837 → 33 000,
//    f_cd = 0,85·30/1,5 = 17,0, f_ctd = 0,85·2,0/1,5 = 1,133)
const c30 = ecKennwerte({ baustoff: 'beton', klasse: 'C30/37', situation: 'staendig' });
const w = (e: typeof c30, z: string) => e.zeilen.find(x => x.zeichen === z)?.wert ?? NaN;
pruefe(c30.gueltig && c30.xk === 30 && nah(c30.xd, 17) && c30.gamma === 1.5 && c30.beiwert === 0.85, `C30/37 f_cd = 17 (${c30.xd})`);
pruefe(w(c30, 'f_{cm}') === 38 && w(c30, 'f_{ctm}') === 2.9 && w(c30, 'f_{ctk;0,05}') === 2.0 && w(c30, 'E_{cm}') === 33000, 'C30/37 Tab. 3.1');
pruefe(nah(0.3 * 30 ** (2 / 3), 2.896, 1e-3) && nah(22000 * (38 / 10) ** 0.3, 32837, 1), 'Formeln f_ctm, E_cm (Handrechnung)');
pruefe(nah(w(c30, 'f_{ctd}'), 0.85 * 2.0 / 1.5), 'f_ctd = α_ct·f_ctk;0,05/γ_C');
const c30a = ecKennwerte({ baustoff: 'beton', klasse: 'C30/37', situation: 'aussergewoehnlich' });
pruefe(nah(c30a.xd, 0.85 * 30 / 1.3) && c30a.gamma === 1.3, 'C30/37 außergewöhnlich γ_C = 1,3');
const c30en = ecKennwerte({ baustoff: 'beton', klasse: 'C30/37', situation: 'staendig', alphaCc: 1.0 });
pruefe(nah(c30en.xd, 20) && c30en.hinweise.some(h => h.stufe === 'warnung'), 'α_cc = 1,0 nur Vergleich mit Warnung');
for (const k of EC_KLASSEN.beton) pruefe(nah(ecKennwerte({ baustoff: 'beton', klasse: k, situation: 'staendig' }).xd, fcdBeton(BETON_EC2[k].fck)), `f_cd ${k} = fcdBeton`);

// 2. Beispiel 2: B500B f_yd = 500/1,15 = 434,8; ε_yd = 2,17 ‰
const b = ecKennwerte({ baustoff: 'betonstahl', klasse: 'B500B', situation: 'staendig' });
pruefe(nah(b.xd, 434.7826, 1e-3) && nah(w(b, '\\varepsilon_{yd}'), 2.1739, 1e-3) && w(b, 'f_{tk}') === 540, 'B500B');
pruefe(ecKennwerte({ baustoff: 'betonstahl', klasse: 'B500A', situation: 'aussergewoehnlich' }).xd === 500, 'B500A außergewöhnlich γ_S = 1,0');

// 3. Beispiel 3: S355 355/1,0 = 355; 355/1,1 = 322,7; 0,9·490/1,25 = 352,8
const s = ecKennwerte({ baustoff: 'baustahl', klasse: 'S355', situation: 'staendig' });
pruefe(s.xd === 355 && nah(w(s, 'f_y/\\gamma_{M1}'), 322.727, 1e-3) && nah(w(s, '0{,}9\\,f_u/\\gamma_{M2}'), 352.8), 'S355');
const sa = ecKennwerte({ baustoff: 'baustahl', klasse: 'S355', situation: 'aussergewoehnlich' });
pruefe(sa.vorlaeufig && sa.hinweise.some(h => /vorläufig, Normprüfung ausstehend/.test(h.text)), 'Baustahl außergewöhnlich vorläufig gekennzeichnet');

// 4. Beispiel 4: GL24h, NKL 1, mittel: 0,8·24/1,3 = 14,77; NKL 3: 0,65·24/1,3 = 12,0; ständig 0,6·24/1,3 = 11,08
const h = ecKennwerte({ baustoff: 'holz', klasse: 'GL24h', situation: 'staendig', nkl: 1, kled: 'mtl' });
pruefe(nah(h.xd, 14.7692, 1e-3) && h.beiwert === 0.8 && nah(w(h, 'f_{v,d}'), 0.8 * 3.5 / 1.3), 'GL24h NKL 1 mittel');
pruefe(nah(ecKennwerte({ baustoff: 'holz', klasse: 'GL24h', situation: 'staendig', nkl: 3, kled: 'mtl' }).xd, 12), 'GL24h NKL 3');
pruefe(nah(ecKennwerte({ baustoff: 'holz', klasse: 'C24', situation: 'aussergewoehnlich', nkl: 1 }).xd, 1.1 * 24 / 1.0), 'C24 außergewöhnlich: k_mod sehr kurz, γ_M = 1,0');
pruefe(nah(ecKennwerte({ baustoff: 'holz', klasse: 'GL24h', situation: 'staendig', nkl: 2, kled: 'krt' }).xd, 0.9 * 24 / 1.3), 'GL24h NKL 2 kurz (Quizfrage 4: 16,6)');

// 5. Beispiel 5: KS 12 NM IIa f_k = 6,0 → f_d = 0,85·6,0/1,5 = 3,40
const m = ecKennwerte({ baustoff: 'mauerwerk', klasse: 'KS-12-NMIIa', situation: 'staendig' });
pruefe(fkNA('KS-12-NMIIa')?.fk === 6.0 && nah(m.xd, 3.4), `Mauerwerk f_d = 3,40 (${m.xd})`);
pruefe(nah(ecKennwerte({ baustoff: 'mauerwerk', klasse: 'frei', fk: 5, situation: 'aussergewoehnlich' }).xd, 0.85 * 5 / 1.3), 'Mauerwerk frei, außergewöhnlich γ_M = 1,3');

// 6. Ungültige Eingaben → kein Zahlenergebnis
const ungueltig: Parameters<typeof ecKennwerte>[0][] = [
  { baustoff: 'beton', klasse: 'C31/38', situation: 'staendig' },
  { baustoff: 'beton', klasse: 'C30/37', situation: 'staendig', alphaCc: NaN },
  { baustoff: 'beton', klasse: 'C30/37', situation: 'staendig', alphaCc: 1.2 },
  { baustoff: 'betonstahl', klasse: 'B420', situation: 'staendig' },
  { baustoff: 'baustahl', klasse: 'S275', situation: 'staendig' },
  { baustoff: 'holz', klasse: 'GL99', situation: 'staendig' },
  { baustoff: 'holz', klasse: 'C24', situation: 'staendig', nkl: 4 as 1 },
  { baustoff: 'mauerwerk', klasse: 'frei', situation: 'staendig', fk: -1 },
  { baustoff: 'mauerwerk', klasse: 'frei', situation: 'staendig', fk: NaN },
  { baustoff: 'mauerwerk', klasse: 'KS-12-NMIIa', situation: 'staendig', zeta: 0 },
  { baustoff: 'glas' as EcBaustoff, klasse: 'x', situation: 'staendig' },
  { baustoff: 'beton', klasse: 'C30/37', situation: 'erdbeben' as 'staendig' },
];
for (const e of ungueltig) {
  const r = ecKennwerte(e);
  pruefe(!r.gueltig && Number.isNaN(r.xk) && Number.isNaN(r.xd) && r.zeilen.every(z => Number.isNaN(z.wert)), `ungültig ohne Zahl: ${JSON.stringify(e)}`);
}

// 7. Beispiel 6: Prüfserie (n = 6): m = 37,933, s = 2,308, k_6 = 2,18 → X_k = 32,90, X_d = 0,85·32,90/1,5 = 18,64
const serie = [36.1, 39.4, 34.8, 41.2, 37.5, 38.6];
const sn = charakteristischAusSerie({ werte: serie, verteilung: 'normal', gammaM: 1.5, beiwert: 0.85 });
pruefe(nah(sn.mittelwert, 37.9333, 1e-3) && nah(sn.stdAbw, 2.30796, 1e-4) && sn.kn === 2.18 && nah(sn.xk, 32.902, 1e-3) && nah(sn.xd, 18.644, 1e-3), `Serie normal (${sn.xk})`);
const ln = serie.map(Math.log), my = ln.reduce((a, x) => a + x, 0) / 6, sy = Math.sqrt(ln.reduce((a, x) => a + (x - my) ** 2, 0) / 5);
const sl = charakteristischAusSerie({ werte: serie, verteilung: 'lognormal', gammaM: 1.5 });
pruefe(nah(sl.xk, Math.exp(my - 2.18 * sy), 1e-9) && sl.xk > sn.xk, `Serie lognormal (${sl.xk})`);
const s3 = charakteristischAusSerie({ werte: serie.slice(0, 3), verteilung: 'normal', gammaM: 1.5, beiwert: 0.85 });
pruefe(s3.kn === 3.37 && nah(s3.xk, 28.775, 1e-3), 'n = 3 (Quizfrage 5: 28,8)');
const sb = charakteristischAusSerie({ werte: serie.slice(0, 3), verteilung: 'normal', vxBekannt: 0.1, gammaM: 1.5 });
pruefe(sb.kn === 1.89 && nah(sb.xk, 36.7667 * (1 - 0.189), 1e-3), 'V_x bekannt');
pruefe(!charakteristischAusSerie({ werte: [30, 31], verteilung: 'normal', gammaM: 1.5 }).gueltig, 'n < 3 bei V_x unbekannt ungültig');
pruefe(!charakteristischAusSerie({ werte: [30, -1, 31], verteilung: 'lognormal', gammaM: 1.5 }).gueltig, 'lognormal mit Wert ≤ 0 ungültig');
pruefe(Number.isNaN(charakteristischAusSerie({ werte: [30, NaN, 31], verteilung: 'normal', gammaM: 1.5 }).xk), 'NaN in Serie → kein Ergebnis');

// 8. k_n (V_X bekannt) nach Tab. D1 folgt 1,64·√(1 + 1/n), Tabelle V_X unbekannt aus statistik.ts
for (const [n, k] of KN_TAB_BEKANNT) pruefe(Math.abs(k - 1.64 * Math.sqrt(1 + (Number.isFinite(n) ? 1 / n : 0))) < 0.01, `k_n bekannt n = ${n}`);
pruefe(fraktilfaktorKnBekannt(6) === 1.77 && fraktilfaktorKn(3) === 3.37 && fraktilfaktorKn(10) === 1.92 && Number.isNaN(fraktilfaktorKnBekannt(0)), 'k_n Tabellenwerte');

// 9. Vorhaltemaß: 8 N/mm² ↔ σ = 4,86 N/mm²; Φ(−1,645) = 5 %
pruefe(nah(sigmaAusVorhalt(8), 4.863, 1e-3) && nah(vorhaltemass(sigmaAusVorhalt(8)), 8) && nah(unterschreitung(1.645), 0.05, 1e-3), 'Vorhaltemaß / Quantil');
for (const k of Object.values(BETON_EC2)) pruefe(k.fcm === k.fck + 8, `f_cm = f_ck + 8 (${k.id})`);

// 10. Konsistenz mit den zentralen Konstanten (Bestandsaufnahme 02.11.2026)
pruefe(GAMMA_S.staendig === EC2_NA_DE.gammaS && GAMMA_C.staendig === EC2_NA_DE.gammaC && ALPHA_CC === EC2_NA_DE.alphaCC, 'GAMMA_S/GAMMA_C/ALPHA_CC = EC2_NA_DE');
pruefe(EC2_BETON_NA.alphaCc === ALPHA_CC && EC2_BETON_NA.gammaC === GAMMA_C.staendig, 'EC2_BETON_NA aus zentralen Konstanten');
pruefe(GAMMA_STATISTIK.beton === GAMMA_WIDERSTAND.beton.staendig && GAMMA_STATISTIK.stahl === GAMMA_WIDERSTAND.betonstahl.staendig && GAMMA_STATISTIK.holz === GAMMA_WIDERSTAND.holz.staendig, 'Statistik-γ = ec_kennwerte');
pruefe(GAMMA_WIDERSTAND.holz.staendig === GAMMA_M_HOLZ && GAMMA_WIDERSTAND.mauerwerk.staendig === GAMMA_M_MW && GAMMA_WIDERSTAND.baustahl.staendig === EC3_NA_DE.gammaM0, 'γ je Baustoff zentral');
pruefe(EC3_NA_DE.gammaM0 === 1.0 && EC3_NA_DE.gammaM1 === 1.1 && EC3_NA_DE.gammaM2 === 1.25 && GAMMA_C.aussergewoehnlich === 1.3 && GAMMA_S.aussergewoehnlich === 1.0 && GAMMA_WIDERSTAND.mauerwerk.aussergewoehnlich === 1.3 && ZETA_MW === 0.85, 'γ-Werte NA DE');
pruefe(KMOD[1].mtl === 0.8 && KMOD[2].krt === 0.9 && KMOD[3].mtl === 0.65 && KMOD[1].stnd === 0.6, 'k_mod Tab. 3.1');
pruefe(SIGMA_MIN_KONFORMITAET === 3, 'σ_min Konformität');
pruefe(EC_KLASSEN.betonstahl.every(k => k in BETONSTAHL) && EC_KLASSEN.baustahl.every(k => k in BAUSTAHL_EC3) && EC_KLASSEN.holz.every(k => k in HOLZ_EN338 || k in BSH_EN14080), 'Klassenlisten aus zentralen Tabellen');
// Quizfrage 6 (Konformität stetige Herstellung): 30 + 1,48·max(2,5; 3) = 34,44 > 34,2 → nicht erfüllt
const kf = konformitaetDruck({ werte: Array(15).fill(34.2), fckCube: 30, pruefArt: 'stetig', sigmaVorserie: 2.5 });
pruefe(nah(kf.sollMittelwert, 34.44) && !kf.mittelOk, 'Quizfrage 6 nachgerechnet');

// 11. Modul: keine lokalen γ-/α_cc-Literale in Modul und Kern (nur zentrale Konstanten)
const kern = fs.readFileSync('src/calc/ecKennwerte.ts', 'utf8');
const modul = fs.readFileSync('src/modules/EcKennwerte.tsx', 'utf8');
pruefe(!/gamma\w*\s*[:=]\s*1\.(5|15|3|1|25)\b/i.test(kern) && !/alphaCc\s*[:=]\s*0\.85/.test(kern + modul), 'keine lokalen γ-/α_cc-Literale');
pruefe(MODUL_BY_ID.has('ec_kennwerte') && MODUL_BY_ID.get('ec_kennwerte')?.gruppe === 'Grundlagen', 'Registry-Eintrag');
const fragen = QUIZ_QUESTIONS.filter(q => q.moduleId === 'ec_kennwerte');
pruefe(fragen.length >= 6 && fragen.every(q => q.verified === false) && new Set(fragen.map(q => q.bloom)).size >= 4, `Quiz: ${fragen.length} Fragen, unveröffentlicht, Bloom gemischt`);
// Querverweise aus den Fachmodulen
for (const f of ['Betonkennwerte', 'Stahlbetonbemessung', 'HolzbauBeta', 'StahlbauEC3', 'Mauerwerk', 'Statistik', 'FestbetonStatistik', 'Sicherheitskonzept']) {
  pruefe(fs.readFileSync(`src/modules/${f}.tsx`, 'utf8').includes('<EcKennwerteVerweis'), `Querverweis in ${f}`);
}

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log('OK: Kennwerte und Bemessungswerte nach Eurocode');
