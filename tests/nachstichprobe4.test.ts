// Nachstichprobe 4 (02.11.2026): 20 geschichtet gezogene freigegebene Fachmodule, die in keiner bisherigen
// Nachstichprobe und nicht in der Gegenprüfung waren (Befundliste docs/pruefung/nachstichprobe4-2026-11-02.md).
// Die Sollwerte stammen aus einem eigenen Prüfskript (Python, eigene Umsetzung der Gleichungen), nicht aus den Kernen.
// Zusätzlich sichert der Test die Korrekturen NS4-* gegen ein Zurückfallen.
import { biegelinie, traegheitRechteck, BIEGE_WERKSTOFFE } from '../src/calc/biegelinie';
import { bohrkernPruefung, spaltzugfestigkeit, zugversuchStahl, holzSchaetzung, wenner, torrentKlasse } from '../src/calc/pruefverfahren';
import { wuNachweis, zustandsnote, schulnoteAusZustandsnote } from '../src/calc/schutzInstandsetzung';
import { verformterDruckstab, KMOD, GAMMA_M_HOLZ } from '../src/calc/holzbau';
import { bemesseBiegung } from '../src/calc/biegung';
import { asphaltHohlraum } from '../src/calc/verkehrswegebau';
import { zinkSchutzdauer, zinkMindestschicht } from '../src/calc/korrosionsschutz';
import { blechMasse } from '../src/calc/bauprodukte';
import { biogenesCo2DinEn16449, SCHWINDBEIWERTE } from '../src/calc/holzphysik';
import { zustandsgrenzen, erddruckRankine, konsolidierung, mohrCoulomb, fliessgrenzeEinpunkt, aLinie, bodengruppePlastizitaet } from '../src/calc/boden';
import { holzKennwerte } from '../src/data/kennwerte';
import ingenieurbau from '../content/lca/IngenieurbauLCA.json';
import betonpraxis from '../content/betonpraxis/Betonpraxis.json';
import erfassung from '../content/bauwerkserfassung/Bauwerkserfassung.json';
import zustand from '../content/zustandsbewertung/Zustandsbewertung.json';

const fehler: string[] = [];
const nahe = (ist: number, soll: number, tol = 5e-3) => Math.abs(ist - soll) <= tol * Math.max(Math.abs(soll), 1e-9);
const pruefe = (fall: string, ist: number, soll: number, tol = 5e-3) => { if (!nahe(ist, soll, tol)) fehler.push(`${fall}: ist ${ist}, soll ${soll}`); };
const gilt = (ok: boolean, fall: string) => { if (!ok) fehler.push(fall); };

console.log('--- Test: Nachstichprobe 4 (02.11.2026, Nachrechnungen und Korrekturen) ---');

// formaenderungen: Biegelinie, Standardeingabe (Einfeldträger 5 m, q = 5 kN/m, GL24h 120/300 mm) und Quizfälle
const bl = biegelinie({ lagerung: 'einfeldtraeger', L: 5, F: 0, a: 2.5, q: 5, E: BIEGE_WERKSTOFFE.bshGL24h.E, I: traegheitRechteck(120, 300) });
pruefe('FA Biegelinie w_max Standard', bl.wMax, 13.10535);
pruefe('FA Biegelinie EI', bl.EI, 3105);
const bq = biegelinie({ lagerung: 'einfeldtraeger', L: 4, F: 0, a: 2, q: 10, E: 1e4, I: 1e5 }); // E·I = 10 000 kNm²
pruefe('FA Quiz bl_1 w', bq.wMax, 3.33333);
const bk = biegelinie({ lagerung: 'kragarm', L: 2, F: 12, a: 2, q: 0, E: 4000, I: 1e5 }); // E·I = 4000 kNm²
pruefe('FA Quiz bl_2 w', bk.wKenn, 8.0);
pruefe('FA Quiz bl_2 φ', bk.phiB, 6.0);

// mechanische_pruefungen: Spaltzug, Betonstahl, Holz-Biegung, Bohrkern-Standardeingabe
pruefe('MP f_ct,sp Beispiel 2', spaltzugfestigkeit(250, 150, 300), 3.53678);
const zs = zugversuchStahl({ dMm: 12, kraftReKn: 62, kraftRmKn: 69.5, l0Mm: 100, luMm: 107.5 });
pruefe('MP Re', zs.yieldStrength, 548.204); pruefe('MP Rm', zs.ultimateStrength, 614.513); pruefe('MP A_gt', zs.elongation, 7.5);
gilt(zs.einstufung === 'B500B', 'MP Beispiel 3: B500B');
const zq = zugversuchStahl({ dMm: 10, kraftReKn: 42, kraftRmKn: 45, l0Mm: 100, luMm: 106 });
gilt(zq.einstufung === 'B500A', 'MP Quiz: R_m/R_e = 1,07 → nur B500A');
pruefe('MP Quiz f_m Holz', holzSchaetzung({ rohdichte: 0.46, feuchte: 12, bMm: 50, hMm: 100, stuetzweiteMm: 1800, kraftKn: 6.5 }).f_bending, 23.4);
const bkp = bohrkernPruefung({ dMm: 100, hMm: 100, kraftKn: 350, staebe: 0, richtung: 'vertikal' });
pruefe('MP Bohrkern h/d = 1 → Würfelwert', bkp.equivalentCube, 44.5634);
gilt(bkp.equivalentCube >= 37, 'MP Bohrkern-Standard: Einstufung „≥ C30/37“ aus dem Würfelwert');

// ressourcen_umwelt / Nawaro: biogener Kohlenstoff nach DIN EN 16449
pruefe('RU CO₂ KVH 500 kg/m³', biogenesCo2DinEn16449(500), 818.452);
pruefe('RU Quiz BSP 12 m³', biogenesCo2DinEn16449(470, 12, 12), 9232.14);
pruefe('NW CO₂ BSH 420 kg/m³', biogenesCo2DinEn16449(420), 687.5);

// vdi6200: Notenrechner (didaktisch) und Schulnoten-Zuordnung
pruefe('VDI Quiz Note', zustandsnote(2, 1, 3, 2), 3.2);
gilt(schulnoteAusZustandsnote(3.2) === 5, 'VDI 3,2 → nicht ausreichend (5)');
gilt(schulnoteAusZustandsnote(1.4) === 1 && schulnoteAusZustandsnote(2.2) === 3, 'VDI Notenbereiche 1,0–1,4 / 2,0–2,4');

// wu-bauwerke: Beispiel (h_w = 3 m, h = 300 mm, BK 1) und Quiz (4,5 m)
const wu = wuNachweis(3.0, 300, 0.2, '1', 'Wand', 'ortbeton');
pruefe('WU I', wu.druckgefaelle, 10); pruefe('WU w_k', wu.zulRissbreite, 0.2); gilt(wu.dickeOk && wu.mindestDicke === 240, 'WU h_min 240 mm');
pruefe('WU Quiz w_k bei I = 15', wuNachweis(4.5, 300, 0.15, '1', 'Wand', 'ortbeton').zulRissbreite, 0.15);
gilt(wuNachweis(3, 250, 0.1, '1', 'Bodenplatte', 'ortbeton').mindestDicke === 250 && wuNachweis(1, 150, 0.1, '2', 'Bodenplatte', 'ortbeton').mindestDicke === 150, 'WU Bodenplatte 250/150 mm');

// bauwerkserfassung: Beispiel 2 (b/h = 100/140, l = 4 m, N_d = 20 kN, q_d = 2 kN/m, e₀ = 45 mm, C24, k_mod = 0,9)
const c24 = holzKennwerte('C24')!;
const ds = verformterDruckstab({ b: 100, h: 140, l: 4000, nd: 20, qd: 2.0, e0: 45, fmk: c24.fmk, fc0k: c24.fc0k, E0mean: c24.E0mean, E005: c24.E005, kmod: KMOD[1].krt, gammaM: GAMMA_M_HOLZ });
pruefe('BWE σ_m,d aus q', ds.sigma_m_d_primary, 12.2449); pruefe('BWE Δσ aus N·e₀', ds.sigma_m_d_eccentric, 2.75510);
pruefe('BWE λ_rel,y', ds.lambda_rel_y, 1.67832); pruefe('BWE k_c,y', ds.k_cy, 0.310884, 1e-2);
pruefe('BWE Gl. 6.23 [%]', ds.etaErsatzstab, 121.89, 1e-2);

// bodenmechanik: Beispiele 1 und 2, Quizfälle
const zg = zustandsgrenzen(25, 45, 20);
pruefe('BM I_C', zg.iC, 0.8); pruefe('BM I_P', zg.iP, 25);
gilt(bodengruppePlastizitaet(45, 25).kuerzel === 'TM' && bodengruppePlastizitaet(45, 12).kuerzel === 'UM', 'BM TM bzw. UM (A-Linie 18,25 %)');
pruefe('BM A-Linie', aLinie(45), 18.25);
pruefe('BM E_a φ = 30°', erddruckRankine(30, 20, 5).E_a, 83.3333); pruefe('BM Quiz E_a φ = 35°', erddruckRankine(35, 19, 4).E_a, 41.1901);
const ko = konsolidierung(4, 50, 5, 2, 'zweiseitig');
pruefe('BM s_∞', ko.s_end, 40); pruefe('BM t_90', ko.t_90, 1.696); pruefe('BM t_90 einseitig', konsolidierung(4, 50, 5, 2, 'einseitig').t_90, 6.784);
gilt(mohrCoulomb(0, 30, 160, 50).isFailing, 'BM Quiz Mohr-Coulomb: Bruchzustand bei σ₁/σ₃ = 3,2 > K_p');
pruefe('BM Quiz Einpunktverfahren', fliessgrenzeEinpunkt(42.6, 22), 41.9456);

// holzbau_werkstoffe: Schwindbeiwerte Fichte (Quiz q_hw_4)
pruefe('HW Δb tangential', SCHWINDBEIWERTE.fichte.tangential / 100 * 8 * 200, 5.76);
pruefe('HW Δb radial', SCHWINDBEIWERTE.fichte.radial / 100 * 8 * 200, 3.04);

// zfp: Wenner-Sonde und Torrent-Klassen
const we = wenner(50, 1000);
pruefe('ZFP ρ Wenner', we.rho, 314.159);
gilt(we.stufe === 'mittel', 'ZFP Wenner 314 Ω·m: mäßiges Risiko (RILEM 100 … 500 Ω·m)');
gilt(torrentKlasse(0.005) === 1 && torrentKlasse(0.2) === 3 && torrentKlasse(12) === 5, 'ZFP Torrent-Klassen I/III/V');

// korrosionsschutz_beschichtungen: Beispiele 1 (C3) und 2 (C5, Duplex f = 1,5)
pruefe('KS d_Zn > 6 mm', zinkMindestschicht(10).mittel, 85);
const z3 = zinkSchutzdauer({ dZn: 85, kategorie: 'C3', ziel: 'VH', duplex: false, tBeschichtung: 0, synergie: 1, stahlDickeMm: 10 });
pruefe('KS C3 t_min', z3.tMin, 40.4762); pruefe('KS C3 t_max', z3.tMax ?? NaN, 121.429);
const z5 = zinkSchutzdauer({ dZn: 85, kategorie: 'C5', ziel: 'VH', duplex: true, tBeschichtung: 10, synergie: 1.5 });
pruefe('KS C5 t_min', z5.tMin, 10.119); pruefe('KS Duplex t_min', z5.tDuplexMin, 30.1786);

// bp_verkehr_pruefung: Hohlraumgehalt (Quiz und Standardeingabe)
const ah = asphaltHohlraum({ gesteinAnteil: 95, bitumenAnteil: 5, rhoGestein: 2.70, rhoBitumen: 1.02, raumdichteMischung: 2.40 });
pruefe('VP ρ_max', ah.maxDichte, 2.49458); pruefe('VP Hohlraum', ah.hohlraum, 3.7908);
const ah0 = asphaltHohlraum({ gesteinAnteil: 94.5, bitumenAnteil: 5.5, rhoGestein: 2.68, rhoBitumen: 1.02, raumdichteMischung: 2.41 });
pruefe('VP Standard Hohlraum', ah0.hohlraum, 2.02538); gilt(ah0.ok, 'VP Standard im Lehrbereich 1,5 … 4,5 Vol.-%');

// bp_metallisch: Titanzink-Bahn und Quiz-Aluminiumtafel
const tz = blechMasse(10, 0.5, 0.7, 7200);
pruefe('ME Masse Bahn', tz.masse, 25.2); pruefe('ME g_k', tz.gkFlaeche, 0.0494424);
pruefe('ME Quiz Alu', blechMasse(3, 1.5, 3, 2700).masse, 36.45);

// rechnung_stahlbeton: Standardeingabe (M_Ed = 160 kNm, C25/30, 30/50, d₁ = 4,5 cm) und Quizfälle
const rs = bemesseBiegung({ b: 30, h: 50, d1: 4.5, d2: 4.5, med: 160, fck: 25, bewehrung: 'Stahl', fyk: 500, ftk: 0, gammaFRP: 1 });
pruefe('RS μ_Ed', rs.mu_Ed, 0.181848); pruefe('RS A_s,erf', rs.as1_req, 8.9981, 2e-3); pruefe('RS μ_lim', rs.muLim, 0.2952);
pruefe('RS Quiz μ 200 kNm', bemesseBiegung({ b: 30, h: 50, d1: 4.5, d2: 4.5, med: 200, fck: 30, bewehrung: 'Stahl', fyk: 500, ftk: 0, gammaFRP: 1 }).mu_Ed, 0.189423);
pruefe('RS Quiz A_s 120 kNm', bemesseBiegung({ b: 30, h: 50, d1: 4.5, d2: 4.5, med: 120, fck: 25, bewehrung: 'Stahl', fyk: 500, ftk: 0, gammaFRP: 1 }).as1_req, 6.5479, 2e-3);

// Korrekturen NS4-* gegen ein Zurückfallen
gilt(!/kein Modul B8/.test(ingenieurbau.texte.imHochbauMeistNicht) && /15978:2026/.test(ingenieurbau.texte.imHochbauMeistNicht),
  'NS4-LI-1: Hochbau-Spalte nennt B8 nach DIN EN 15978:2026 (optional) statt „kein Modul B8“');
gilt(!/Alleinstellungsmerkmal/.test(ingenieurbau.texte.einWesentlichesAlleinstellungsmerkmalDer) && /15978:2026/.test(ingenieurbau.texte.einWesentlichesAlleinstellungsmerkmalDer),
  'NS4-LI-1: B8 nicht mehr als Alleinstellungsmerkmal der DIN EN 17472');
gilt(/einzuarbeiten, ist $/.test(betonpraxis.texte.dieInDin1045), 'NS4-BP-1: „ist“ statt „is“');
gilt(/Kritikpunkt:/.test(erfassung.texte.kritikpunkUnsicherBeiKomplexer) && /Grundrissaufteilungen/.test(erfassung.texte.genauigkeitseignungAusreichendFürMachbar), 'NS4-BWE-1: Schreibfehler behoben');
gilt(/Normprüfung ausstehend/.test(zustand.texte.cc3Alle23) && /Normprüfung ausstehend/.test(zustand.texte.cc3Alle69), 'NS4-VDI-1: Prüfintervalle VDI 6200 gekennzeichnet (Normtext)');

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log('OK: Nachstichprobe 4 (02.11.2026)');
