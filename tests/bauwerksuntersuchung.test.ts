// Rechenkern Bauwerksuntersuchung (Z3): Prüfsimulatoren, Probenahmeplaner und Befundsynthese
import {
  rueckprall, ultraschall, potentialStufe, potentialStatus, betondeckung, chlorid, haftzug, karsten, karbonatisierung,
  bohrkern, impactEcho, probenahmeUmfang, befundSynthese, type BefundEingabe, type Untersuchungsziel,
} from '../src/calc/bauwerksuntersuchung';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (ist: number, soll: number, tol: number) => Math.abs(ist - soll) <= tol;
console.log('--- Test: Bauwerksuntersuchung ---');

// 1. Handrechnungen mit den Startwerten der Simulatoren
//    Rückprall R = 36, horizontal, d_k = 12 mm: k = 1 − 7·0,015 = 0,895; R' = 32,22; f_c = 0,0125·32,22^2,22 = 27,86 → C25/30
const rp = rueckprall(36, 'horiz', 12);
pruefe(rp.gueltig && nahe(rp.kKarb, 0.895, 1e-12) && nahe(rp.rFinal, 32.22, 1e-12) && nahe(rp.fcSchaetz, 27.858, 1e-3) && rp.klasse === 'C25/30', `Rückprall ${JSON.stringify(rp)}`);
pruefe(rueckprall(36, 'down', 0).rKorr === 33 && rueckprall(36, 'up', 0).rKorr === 39.5 && rueckprall(36, 'horiz', 5).kKarb === 1 && rueckprall(36, 'horiz', 40).kKarb === 0.75, 'Schlagrichtung und Grenzen von k');
pruefe(rueckprall(60, 'horiz', 0).klasse === 'C50/60' && rueckprall(20, 'horiz', 0).klasse === 'C16/20', 'Klasseneinordnung Ränder');
//    Ultraschall s = 0,30 m, t = 75 µs: v_p = 4000 m/s; E_dyn = 2400·4000²·(1,2·0,6/0,8)·10⁻⁹ = 34,56 GPa
const us = ultraschall(0.30, 75, 2400);
pruefe(nahe(us.vp, 4000, 1e-9) && nahe(us.eDynGPa, 34.56, 1e-9) && us.stufe === 'gut', `Ultraschall ${us.vp} ${us.eDynGPa}`);
pruefe(ultraschall(0.3, 90, 2400).stufe === 'maessig' && ultraschall(0.3, 120, 2400).stufe === 'kritisch' && !ultraschall(0.3, 0, 2400).gueltig, 'Gefügestufen, t = 0 → Fehler');
//    Potentialfeld: Simulator und Navigator schließen −350 mV ein (≤ −350 hoch/aktiv)
pruefe(potentialStufe(-380) === 'hoch' && potentialStufe(-350) === 'hoch' && potentialStufe(-349) === 'ungewiss' && potentialStufe(-200) === 'ungewiss' && potentialStufe(-199) === 'gering', 'Potentialstufen Simulator');
pruefe(potentialStatus(-350) === 'aktiv' && potentialStatus(-200) === 'unsicher' && potentialStatus(-150) === 'passiv', 'Potentialstatus Navigator');
//    Betondeckung XC4, gemessen 22 mm: c_nom = 25 + 15 = 40 → −18 mm
const dk = betondeckung('XC4', 22);
pruefe(dk.cMin === 25 && dk.cNom === 40 && dk.differenz === -18 && !dk.ok && betondeckung('XC1', 20).ok, `Deckung ${JSON.stringify(dk)}`);
//    Chlorid 0,55 M.-%: über 0,5 → Korrosion wahrscheinlich; Verhältnis 1,1
const cl = chlorid(0.55, false);
pruefe(cl.ueberschritten && nahe(cl.verhaeltnis, 1.1, 1e-12) && cl.stufe === 'Korrosion wahrscheinlich' && chlorid(0.25, true).ueberschritten && !chlorid(0.25, false).ueberschritten, 'Chlorid');
//    Haftzug 3,2 kN auf Ø 50 mm: A = 1963,5 mm² → 1,630 N/mm²
const hz = haftzug(3.2, 'beton');
pruefe(nahe(hz.flaecheMm2, 1963.495, 1e-3) && nahe(hz.fct, 1.62975, 1e-5) && hz.ok && !haftzug(3.2, 'verbund').ok && !haftzug(2.5, 'beton').ok, `Haftzug ${hz.fct}`);
//    Karsten 1,8 ml: w = 4,00 kg/(m²·√h) → wassersaugend; Grenzen 0,5 und 2,0
pruefe(nahe(karsten(1.8).w, 3.9996, 1e-12) && karsten(1.8).klasse === 'wassersaugend' && karsten(0.2).klasse === 'wasserabweisend' && karsten(0.5).klasse === 'wasserhemmend', 'Karsten');
//    Karbonatisierung d = 24 mm nach 45 a, c = 30 mm: K = 3,578 mm/√a; t = (30/3,578)² = 70,3 a → Rest 25 a
const kb = karbonatisierung(24, 45, 30);
pruefe(nahe(kb.k, 3.57771, 1e-5) && nahe(kb.tDepass, 70.3125, 1e-9) && kb.restJahre === 25 && !kb.depassiviert, `Karbonatisierung ${JSON.stringify(kb)}`);
pruefe(karbonatisierung(35, 45, 30).depassiviert && karbonatisierung(35, 45, 30).restJahre === 0, 'depassiviert → Rest 0');
//    Bohrkern Ø 100, L = 100, F = 265 kN: A = 7854 mm² → 33,74 N/mm², L/D = 1 → Würfelbezug
const bk = bohrkern(100, 100, 265);
pruefe(nahe(bk.festigkeit, 33.7408, 1e-4) && bk.schlankheit === 1 && bk.bezug === 'wuerfel' && bohrkern(100, 200, 265).bezug === 'zylinder' && bohrkern(100, 150, 265).bezug === 'keiner', 'Bohrkern');
//    Impact-Echo f = 6,5 kHz, v_p = 4000 m/s: d = 0,96·4000/(2·6500) = 29,54 cm (Nenndicke 30) → keine Ablösung
const ie = impactEcho(6.5, 4000, 30);
pruefe(nahe(ie.dickeCm, 29.5385, 1e-4) && !ie.delamination && impactEcho(12, 4000, 30).delamination, `Impact-Echo ${ie.dickeCm}`);

// 2. Probenahmeplaner (Startwerte: Chlorid, 600 m², 12 Bauteile)
//    Bohrkerne max(2; round(2)) = 2; ZfP min(300; max(40; 120)) = 120; Bohrmehl max(4; round(6)) = 6; Haftzug max(3; round(5,4)) = 5
const pn = probenahmeUmfang({ ziel: 'chlorid', verfahren: 'verfahrenA', flaecheM2: 600, bauteilAnzahl: 12 });
pruefe(pn.bohrkerne === 2 && pn.zfpPunkte === 120 && pn.bohrmehlStellen === 6 && pn.haftzugStempel === 5, `Probenahme Chlorid ${JSON.stringify(pn)}`);
//    Druckfestigkeit A, 1600 m²: 8 + 600/300 = 10 Kerne; B: min(7; …) = 7; ZfP = 12·9 = 108
pruefe(probenahmeUmfang({ ziel: 'druckfestigkeit', verfahren: 'verfahrenA', flaecheM2: 1600, bauteilAnzahl: 12 }).bohrkerne === 10, 'Verfahren A');
pruefe(probenahmeUmfang({ ziel: 'druckfestigkeit', verfahren: 'verfahrenB', flaecheM2: 1600, bauteilAnzahl: 12 }).bohrkerne === 7 && probenahmeUmfang({ ziel: 'druckfestigkeit', verfahren: 'verfahrenB', flaecheM2: 0, bauteilAnzahl: 12 }).zfpPunkte === 108, 'Verfahren B, ZfP');
pruefe(probenahmeUmfang({ ziel: 'potentialfeld', verfahren: 'verfahrenA', flaecheM2: 600, bauteilAnzahl: 1 }).zfpPunkte === 240, 'Potentialfeld 0,4 Punkte/m² (Befund: Raster 20 × 20 cm ergäbe 25/m²)');
pruefe(!probenahmeUmfang({ ziel: 'haftzug', verfahren: 'verfahrenA', flaecheM2: -1, bauteilAnzahl: 1 }).gueltig, 'negative Fläche → Fehler');

// 3. Befundsynthese mit den fünf Szenarien des Interpretations-Navigators
const SZ: [string, BefundEingabe, string][] = [
  ['Tiefgarage', { chlorid: 1.25, deckung: 28, karbonatisierung: 15, fckIs: 32, fckPlan: 35, potential: -420, haftzug: 1.6, bruchTyp: 'A', holzRest: 100 }, 'akut'],
  ['Balkon', { chlorid: 0.15, deckung: 18, karbonatisierung: 24, fckIs: 22, fckPlan: 25, potential: -280, haftzug: 1.2, bruchTyp: 'A', holzRest: 100 }, 'hoch'],
  ['Halle', { chlorid: 0.20, deckung: 35, karbonatisierung: 20, fckIs: 16.5, fckPlan: 30, potential: -150, haftzug: 1.8, bruchTyp: 'A', holzRest: 100 }, 'akut'],
  ['Instandsetzung', { chlorid: 0.30, deckung: 30, karbonatisierung: 10, fckIs: 35, fckPlan: 35, potential: -180, haftzug: 0.75, bruchTyp: 'AB', holzRest: 100 }, 'hoch'],
  ['Holz', { chlorid: 0.05, deckung: 0, karbonatisierung: 0, fckIs: 0, fckPlan: 0, potential: 0, haftzug: 0, bruchTyp: 'A', holzRest: 55 }, 'akut'],
];
for (const [name, e, soll] of SZ) pruefe(befundSynthese(e).overallRisk === soll, `Szenario ${name}: ${befundSynthese(e).overallRisk} ≠ ${soll}`);
const bal = befundSynthese(SZ[1][1]);
pruefe(bal.passivierungsReserve === -6 && bal.isCarbDepassivated && bal.potentialStatus === 'unsicher' && nahe(bal.festigkeitsVerhaeltnis, 0.88, 1e-12) && !bal.isStrengthDeficient, 'Balkon Einzelwerte');
const holz = befundSynthese(SZ[4][1]);
pruefe(nahe(holz.holzRestWiderstand, 30.25, 1e-9) && holz.festigkeitsVerhaeltnis === 1 && holz.hinweise.some(x => x.feld === 'haftzug'), 'Holz: W-Rest 30,25 %, ungemessene Nullwerte gemeldet');
//    Befund 12 (#160): 0 = nicht gemessen → weder depassiviert noch Haftzug „nicht bestanden“
pruefe(!holz.isCarbDepassivated && !holz.deckungGemessen && !holz.haftzugGemessen && !holz.isHaftzugFailed && !holz.isHaftzugOk, 'Holz: Deckung/Haftzug nicht gemessen');
const ungemessen: BefundEingabe = { chlorid: 0.05, deckung: 0, karbonatisierung: 0, fckIs: 0, fckPlan: 0, potential: 0, haftzug: 0, bruchTyp: 'A', holzRest: 100 };
pruefe(befundSynthese(ungemessen).overallRisk === 'gering' && befundSynthese({ ...ungemessen, deckung: 20, karbonatisierung: 25 }).isCarbDepassivated && befundSynthese({ ...ungemessen, haftzug: 0.8 }).overallRisk === 'hoch', 'ungemessene Werte heben das Risiko nicht');
const gut: BefundEingabe = { chlorid: 0.1, deckung: 40, karbonatisierung: 10, fckIs: 35, fckPlan: 35, potential: -100, haftzug: 2.0, bruchTyp: 'A', holzRest: 100 };
pruefe(befundSynthese(gut).overallRisk === 'gering' && befundSynthese({ ...gut, deckung: 18 }).overallRisk === 'mittel' && befundSynthese({ ...gut, potential: -250 }).overallRisk === 'mittel', 'gering/mittel');

// 4. Fuzz-Test: endliche Ergebnisse und Monotonie
let zufall = 31337;
const rnd = () => { zufall = (zufall * 1103515245 + 12345) % 2147483648; return zufall / 2147483648; };
const ZIELE: Untersuchungsziel[] = ['druckfestigkeit', 'chlorid', 'karbonatisierung', 'haftzug', 'potentialfeld'];
const RISIKO = { gering: 0, mittel: 1, hoch: 2, akut: 3 } as const;
for (let i = 0; i < 1000; i++) {
  const r = 15 + rnd() * 45, dk = rnd() * 40;
  const a = rueckprall(r, 'horiz', dk), b = rueckprall(r + 1, 'horiz', dk), c = rueckprall(r, 'horiz', dk + 1);
  pruefe(Number.isFinite(a.fcSchaetz) && b.fcSchaetz > a.fcSchaetz && c.fcSchaetz <= a.fcSchaetz, `Fuzz ${i}: Rückprall-Monotonie`);
  const t = 40 + rnd() * 200, u1 = ultraschall(0.3, t, 2300), u2 = ultraschall(0.3, t + 5, 2300);
  pruefe(Number.isFinite(u1.eDynGPa) && u2.vp < u1.vp && u2.eDynGPa < u1.eDynGPa, `Fuzz ${i}: Ultraschall`);
  const tiefe = rnd() * 50, alter = 1 + rnd() * 100, c0 = 5 + rnd() * 60;
  const k1 = karbonatisierung(tiefe, alter, c0), k2 = karbonatisierung(tiefe, alter, c0 + 5);
  pruefe(k1.gueltig && Number.isFinite(k1.tDepass) && k2.tDepass >= k1.tDepass && k1.restJahre >= 0, `Fuzz ${i}: Karbonatisierung`);
  const fl = rnd() * 5000;
  const p = probenahmeUmfang({ ziel: ZIELE[i % 5], verfahren: rnd() < 0.5 ? 'verfahrenA' : 'verfahrenB', flaecheM2: fl, bauteilAnzahl: Math.floor(rnd() * 40) });
  const p2 = probenahmeUmfang({ ziel: ZIELE[i % 5], verfahren: 'verfahrenA', flaecheM2: fl + 500, bauteilAnzahl: 10 }), p1 = probenahmeUmfang({ ziel: ZIELE[i % 5], verfahren: 'verfahrenA', flaecheM2: fl, bauteilAnzahl: 10 });
  pruefe([p.bohrkerne, p.zfpPunkte, p.bohrmehlStellen, p.haftzugStempel].every(x => Number.isInteger(x) && x >= 0), `Fuzz ${i}: ganzzahlige Umfänge`);
  pruefe(p2.bohrkerne >= p1.bohrkerne && p2.zfpPunkte >= p1.zfpPunkte && p2.haftzugStempel >= p1.haftzugStempel && p2.bohrmehlStellen >= p1.bohrmehlStellen, `Fuzz ${i}: Flächenmonotonie`);
  const e: BefundEingabe = { chlorid: rnd() * 1.5, deckung: rnd() * 50, karbonatisierung: rnd() * 40, fckIs: 10 + rnd() * 40, fckPlan: 20 + rnd() * 30, potential: -500 + rnd() * 450, haftzug: rnd() * 3, bruchTyp: rnd() < 0.7 ? 'A' : 'B', holzRest: 50 + rnd() * 50 };
  const s0 = befundSynthese(e), s1 = befundSynthese({ ...e, chlorid: e.chlorid + 0.3 }), s2 = befundSynthese({ ...e, deckung: e.deckung + 10 });
  pruefe(RISIKO[s1.overallRisk] >= RISIKO[s0.overallRisk] && RISIKO[s2.overallRisk] <= RISIKO[s0.overallRisk], `Fuzz ${i}: Risikomonotonie`);
  const h1 = haftzug(rnd() * 10, 'beton');
  pruefe(Number.isFinite(h1.fct) && h1.fct >= 0, `Fuzz ${i}: Haftzug endlich`);
}

if (fehler.length) { for (const x of fehler) console.error(`FAIL: ${x}`); process.exit(1); }
console.log('OK: Bauwerksuntersuchung');
