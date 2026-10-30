// Nachstichprobe 3 (30.10.2026): 20 zufällig gezogene freigegebene Fachmodule nach der gezielten Durchsicht
// (Befundliste docs/pruefung/nachstichprobe3-2026-10-30.md). Die Sollwerte stammen aus einem eigenen Prüfskript
// (Python, eigene Umsetzung der Gleichungen), nicht aus den Kernen. Zusätzlich sichert der Test die Korrekturen NS3-*.
import { carbonbetonBiegung } from '../src/calc/carbonbeton';
import { ecmEc2, verbundSchranken } from '../src/calc/emodul';
import { frostschutz, bodengruppe } from '../src/calc/erdbau';
import { bemessungswert, bemesseDruckstab, KMOD } from '../src/calc/holzbau';
import { frischbeton, potentialReihe, BEZUGSELEKTRODEN } from '../src/calc/laborversuche';
import { gumMessunsicherheit, ringversuch } from '../src/calc/pruefverfahren';
import { fraktilfaktorKn, grubbsKritisch } from '../src/calc/statistik';
import { schnellkarbonatisierung } from '../src/calc/schnellkarbonatisierung';
import { spritzbetonRing } from '../src/calc/verkehrswegebau';
import { savings, dRequired, uRetrofit, GMODG_ANLAGE7 } from '../src/utils/bestandKern';
import { HOLZ_EN338 } from '../src/data/kennwerte';
import organik from '../content/weitereorganik/WeitereOrganik.json';
import schaeden from '../content/bauschaeden/Bauschaeden.json';
import befestigung from '../content/bpbefestigung/BpBefestigung.json';
import datenbanken from '../content/materialdatenbanken/Materialdatenbanken.json';

const fehler: string[] = [];
const nahe = (ist: number, soll: number, tol = 5e-3) => Math.abs(ist - soll) <= tol * Math.max(Math.abs(soll), 1e-9);
const pruefe = (fall: string, ist: number, soll: number, tol = 5e-3) => { if (!nahe(ist, soll, tol)) fehler.push(`${fall}: ist ${ist}, soll ${soll}`); };
const gilt = (ok: boolean, fall: string) => { if (!ok) fehler.push(fall); };

console.log('--- Test: Nachstichprobe 3 (30.10.2026, Nachrechnungen und Korrekturen) ---');

// carbonbeton: Beispiel h = 40 mm, c = 10 mm, a_tex = 100 mm²/m, f_tk = 2500, E_tex = 200 GPa, C50/60
const cb = carbonbetonBiegung({ h: 40, c: 10, aTex: 100, fTk: 2500, eTexGPa: 200, fCk: 50 });
gilt(cb.versagen === 'beton', 'CB Betonversagen maßgebend');
pruefe('CB x', cb.x, 8.20429);
pruefe('CB sigma_tex', cb.sigmaTex, 1859.638);
pruefe('CB z', cb.z, 26.71829);
pruefe('CB m_Rd', cb.mRd, 4.96863);
pruefe('CB m_Rd ohne Dehnungskontrolle', cb.mRdOhneDehnungskontrolle, 5.1166);

// emodul: Beispiel 1 (C30/37, Kalkstein) und Beispiel 2 (Schranken 60/20 GPa, 70 Vol.-%)
pruefe('EM E_cm', ecmEc2(30), 32.83657);
pruefe('EM Kalkstein', ecmEc2(30, 0.9), 29.55291);
const sch = verbundSchranken(60, 20, 0.7);
pruefe('EM Voigt', sch.voigt, 48.0);
pruefe('EM Reuss', sch.reuss, 37.5);
pruefe('EM HS unten', sch.hsUnten, 41.53846);
pruefe('EM HS oben', sch.hsOben, 44.34783);

// erdbau: Standardeingabe Frostschutz (F3, BK3, Zone II, ungünstig) und Bodengruppen
pruefe('ER Frostschutz', frostschutz({ frostzone: 2, bauklasse: 'BK3', bodengruppe: 'F3', wasser: 'unguenstig' }).gesamtDicke, 70);
pruefe('ER Frostschutz Bk100 F2 Zone I', frostschutz({ frostzone: 1, bauklasse: 'Bk100', bodengruppe: 'F2', wasser: 'guenstig' }).gesamtDicke, 55);
gilt(bodengruppe({ feinanteil: 10, kiesanteil: 70, sandanteil: 30, organik: 'keine', plastizitaet: 'nicht' }).gruppe === 'GU / GT', 'ER 10 % Feinanteil, Kies → GU/GT');
gilt(bodengruppe({ feinanteil: 50, kiesanteil: 0, sandanteil: 100, organik: 'keine', plastizitaet: 'ausgeprägt' }).frost === 'F2', 'ER TA → F2');

// holz: Beispiel Biegung C24, k_mod = 0,8 (NKL 1, mittel), γ_M = 1,3
pruefe('HO k_mod', KMOD[1].mtl, 0.8);
pruefe('HO f_md', bemessungswert(24, 0.8), 14.76923);
pruefe('HO M_Rd', bemessungswert(24, 0.8) * 100 * 200 ** 2 / 6 / 1e6, 9.84615);

// rechnung_holzbau: Standardeingabe 3,0 m, 14 × 14 cm, 65 kN, C24, k_mod 0,9
const rh = bemesseDruckstab({ b: 140, h: 140, laenge: 3.0, eulerFall: 2, nEd: 65, fc0k: HOLZ_EN338.C24.fc0k, E005: HOLZ_EN338.C24.E005, brettschichtholz: false, nkl: 1, kled: 'krt' });
pruefe('RH f_c0d', rh.f_c0d, 14.53846);
pruefe('RH lambda', rh.lambda_z, 74.23075);
pruefe('RH lambda_rel', rh.lambda_rel_z, 1.25872);
pruefe('RH k_c', rh.k_cz, 0.50681);
pruefe('RH Ausnutzung %', rh.utilization, 45.009);

// labor_frischbeton: Lehrbeispiel des Protokolls
const fb = frischbeton([
  { d1: 450, d2: 470, mLeer: 3.215, mVoll: 22.045, vol: 8.0, a1: 2.1, g: 0.2 },
  { d1: 440, d2: 455, mLeer: 3.215, mVoll: 22.020, vol: 8.0, a1: 2.3, g: 0.2 },
], 2400);
pruefe('FB f1', fb.werte[0].f, 460);
pruefe('FB f2', fb.werte[1].f, 450);
gilt(fb.werte.every(w => w.klasse === 'F3'), 'FB Klasse F3');
pruefe('FB D1', fb.werte[0].rohdichte, 2350);
pruefe('FB Luft 1', fb.werte[0].luft, 1.9);
pruefe('FB Luft aus Dichte', fb.werte[0].luftAusDichte, 2.08333);

// labor_potentialmessung: Lehrbeispiel (Ag/AgCl gesättigt, 1,0 L, pH 12,6, Schwelle 100 mV)
const agcl = BEZUGSELEKTRODEN.find(b => b.id === 'agcl_ges')!;
const pm = potentialReihe({
  messungen: [[0, -80], [0.5, -85], [1.0, -90], [2.0, -100], [3.0, -115], [4.0, -330], [6.0, -410]].map(([mNaCl, eMess]) => ({ mNaCl, eMess })),
  eBezugSHE: agcl.eSHE, volumen: 1.0, pH: 12.6, sprung: 100,
});
pruefe('PM E_CSE Nullmessung', pm.punkte[0].eCSE, -199);
gilt(pm.sprungIndex === 5, 'PM Sprung bei 4,0 g NaCl');
pruefe('PM Cl/OH beim Sprung', pm.punkte[5].clOh, 1.71929);

// messen_pruefen: GUM-Budget und Ringversuch
const gum = gumMessunsicherheit([38.5, 39.2, 37.8, 38.9, 39.6], 0.1, 0.15);
pruefe('MP Mittel', gum.mean, 38.8);
pruefe('MP uA', gum.uA, 0.30822);
pruefe('MP uc', gum.uc, 0.31853);
pruefe('MP U', gum.expandedU, 0.63705);
const rv = ringversuch({ x: 46.0, X: 50.0, sigmaPt: 1.8, uLab: 1.4, uRef: 0.6, offsetB: 0 });
pruefe('MP z', rv.zScore, -2.22222);
pruefe('MP En', rv.enScore, -2.62613);

// statistik: k_n nach DIN EN 1990, Tab. D1, und Grubbs-Grenzen nach ISO 5725-2 (n = 10)
pruefe('ST k_n 10', fraktilfaktorKn(10), 1.92);
pruefe('ST k_n 3', fraktilfaktorKn(3), 3.37);
pruefe('ST X_k', 38.2 - fraktilfaktorKn(10) * 3.1, 32.248);
pruefe('ST G_krit 5 %', grubbsKritisch(10, 0.05), 2.28995);
pruefe('ST G_krit 1 %', grubbsKritisch(10, 0.01), 2.48208);

// schnellkarbonatisierung: Beispiel 7/28/70 d, Regression durch den Ursprung, 3 % → 0,04 %
const sk = schnellkarbonatisierung({ punkte: [{ tTage: 7, xMm: 2.5 }, { tTage: 28, xMm: 4.8 }, { tTage: 70, xMm: 7.5 }], mitAchsenabschnitt: false, cAcc: 3, cNat: 0.04, deckung: 25, nutzungsdauer: 50 });
pruefe('SK K_AC', sk.kAC, 0.90251);
pruefe('SK Faktor', sk.faktor, 2.20605);
pruefe('SK K_nat', sk.kNat, 1.99097);
pruefe('SK x_50', sk.xNutzung, 14.07832);
pruefe('SK t_25', sk.tDeckung, 157.66982);
gilt(sk.ausreichend, 'SK Deckung reicht');

// modernisierung: Beispiel 1 und 2 (§ 36 GModG, Anlage 7)
pruefe('MO U_max Außenwand', GMODG_ANLAGE7.aussenwand, 0.24);
pruefe('MO d_erf', dRequired(1.40, 0.24, 0.032), 0.11048);
const u14 = uRetrofit(1.40, 0.14, 0.032);
pruefe('MO U 14 cm', u14, 0.19649);
const sv = savings({ uOld: 1.40, uNew: u14, A: 160, bauteil: 'aussenwand', Gt: 3500, etaSys: 0.9, price: 0.12, co2: 0.24, invest: 16400, sowiesoKosten: 13600 });
pruefe('MO Q_E', sv.qEnd, 17972.4);
pruefe('MO Einsparung', sv.euro, 2156.69);
pruefe('MO Amortisation Kopplung', sv.amortisation, 1.29829);

// bp_verkehr_tunnel: Standardeingabe R = 4,5 m, p = 0,15 MPa, d = 15 cm, C25/30
const tu = spritzbetonRing(4.5, 0.15, 15, 25);
pruefe('TU sigma', tu.sigmaRing, 4.5);
pruefe('TU f_cd', tu.fcd, 14.16667);
pruefe('TU Ausnutzung', tu.ausnutzung, 31.76471);

// Korrekturen NS3-* gegen ein Zurückfallen
gilt(!/Braunk things/.test(organik.texte.erregerWieDerBraunk) && /Echte Hausschwamm/.test(organik.texte.erregerWieDerBraunk) && /Nassfäule/.test(organik.texte.erregerWieDerBraunk),
  'NS3-WO-1: Trockenfäule dem Echten Hausschwamm zugeordnet, Kellerschwamm als Nassfäulepilz');
gilt(!/φ<sub>Wood<\/sub>/.test(organik.texte.vSubBioSub) && /relative Luftfeuchte/.test(organik.texte.vSubBioSub),
  'NS3-WO-2: Bio-Lehransatz vergleicht Luftfeuchte mit Luftfeuchte (keine Holzfeuchte in der Differenz)');
gilt(!/F60 Brandwand/.test(schaeden.werte.bauaufsichtlicheGeänderteAnordnungZur) && !/F60 Brandwand/.test(schaeden.werte.bauaufsichtlicheGeänderteAnordnungZur2),
  'NS3-BS-1: keine „F60-Brandwand“ im Musterschreiben');
gilt(!/Zugstreckgrenze/.test(befestigung.texte.derZugbolzenReißtMechanisch) && /Zugfestigkeit/.test(befestigung.texte.derZugbolzenReißtMechanisch),
  'NS3-BF-1: Stahlversagen über die Zugfestigkeit f_uk');
gilt(!JSON.stringify(befestigung).includes('Zykon'), 'NS3-BF-2: Katalog ohne Markennamen');
gilt(!/im Falle thermischer Verwertung/.test(datenbanken.texte.negativeGwpWerteZ) && /stofflicher Verwertung/.test(datenbanken.texte.negativeGwpWerteZ),
  'NS3-MDB-1: biogener Kohlenstoff wird auch bei stofflicher Verwertung ausgebucht');

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log('OK: Nachstichprobe 3 (30.10.2026)');
