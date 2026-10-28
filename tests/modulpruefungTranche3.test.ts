// Modulprüfung Tranche 3 (28.10.2026): unabhängige Nachrechnungen der Rechenkerne (Befundliste docs/pruefung/module-tranche-3.md).
// Die Sollwerte stammen aus einem eigenen Prüfskript (eigene Umsetzung der Norm- bzw. Modellgleichungen in Python),
// nicht aus den Kernen oder vorhandenen Tests übernommen.
import { sonneneintrag, type Raum } from '../src/calc/sommerWaermeschutz';
import { uWert } from '../src/calc/waermeschutz';
import { uwFenster } from '../src/calc/fenster';
import { fkEmpfehlungEN, fdAusFk, phiAusmitte, bemesseWandVereinfacht } from '../src/calc/mauerwerk';
import { bewerteLuftgehalt } from '../src/calc/frischbeton';
import { temperaturfaktorReife, wirksamesAlterKonstant, kennwerteZumAlter, adiabatischeErwaermung } from '../src/calc/hydratation';
import { huellwerte, kWertAnsatz } from '../src/calc/expositionsklassen';
import { NORMATIVE_EXPOSURE_CLASSES } from '../src/modules/expositionsklassen/daten';
import { bemesseDruckstab, biegewiderstandY, bemesseZugstab, profil } from '../src/calc/stahlbau';
import { asphaltRaumdichte, ntaModell, marshallLehrmodell } from '../src/calc/asphalt';
import { trittschall, rwMassiv, resonanzfrequenzEstrich } from '../src/calc/schall';
import { EC2_BRAND_MINDESTMASSE } from '../src/data/brandschutzBeton';

const fehler: string[] = [];
const nahe = (ist: number, soll: number, tol = 5e-3) => Math.abs(ist - soll) <= tol * Math.max(Math.abs(soll), 1e-9);
const pruefe = (fall: string, ist: number, soll: number, tol = 5e-3) => { if (!nahe(ist, soll, tol)) fehler.push(`${fall}: ist ${ist}, soll ${soll}`); };
const gilt = (ok: boolean, fall: string) => { if (!ok) fehler.push(fall); };

console.log('--- Test: Modulprüfung Tranche 3 (Nachrechnungen) ---');

// 1. Sommerlicher Wärmeschutz (DIN 4108-2:2013-02, 8.3, Tab. 6–8)
const raumB: Raum = { nutzung: 'wohn', region: 'B', bauart: 'mittel', nachtlueftung: 'erhoeht', passiveKuehlung: false, AG: 25,
  fenster: [{ A: 11, g: 0.59, scheiben: 2, orientierung: 'S', neigung: 90, schutz: 'rollladen_34' }] };
const sw1 = sonneneintrag(raumB);
pruefe('SW1 S_vorh', sw1.Svorh, 0.07788); pruefe('SW1 S_zul', sw1.Szul, 0.06136); gilt(!sw1.erfuellt && !sw1.verzicht.entbehrlich, 'SW1 nicht erfüllt, kein Verzicht');
const sw2 = sonneneintrag({ ...raumB, bauart: 'schwer', fenster: [{ ...raumB.fenster[0], schutz: 'raffstore_45' }] });
pruefe('SW2 S_vorh', sw2.Svorh, 0.0649); pruefe('SW2 S_zul', sw2.Szul, 0.07136); gilt(sw2.erfuellt, 'SW2 erfüllt');
const sw3 = sonneneintrag({ ...raumB, bauart: 'leicht', AG: 14, fenster: [
  { A: 1.5, g: 0.50, scheiben: 3, orientierung: 'S', neigung: 45, schutz: 'rollladen_34' },
  { A: 1.2, g: 0.50, scheiben: 3, orientierung: 'W', neigung: 90, schutz: 'ohne' }] });
pruefe('SW3 S_vorh', sw3.Svorh, 0.0589286); pruefe('SW3 S_zul', sw3.Szul, 0.0840056); gilt(sw3.verzicht.grenzeTab6 === 0.07, 'SW3 Tab. 6: 7 % bei Dachfenster');
const sw4 = sonneneintrag({ nutzung: 'nichtwohn', region: 'C', bauart: 'schwer', nachtlueftung: 'hoch', passiveKuehlung: true, AG: 20,
  fenster: [{ A: 4, g: 0.35, scheiben: 2, orientierung: 'N', neigung: 90, schutz: 'innen_weiss' }] });
pruefe('SW4 S_vorh', sw4.Svorh, 0.0455); pruefe('SW4 S_zul', sw4.Szul, 0.342);
const sw5 = sonneneintrag({ ...raumB, fenster: [{ ...raumB.fenster[0], A: 2 }] });
pruefe('SW5 f_WG', sw5.fWG, 0.08); gilt(sw5.verzicht.tab6 && sw5.verzicht.entbehrlich, 'SW5 Verzicht nach Tab. 6');

// 2. U-Werte (DIN EN ISO 6946; Fenster DIN EN ISO 10077-1)
pruefe('UW1 U', uWert([{ d: 0.20, lambda: 2.3 }, { d: 0.14, lambda: 0.035 }, { d: 0.015, lambda: 0.70 }], 0.13, 0.04).U, 0.233733);
pruefe('UW2 U', uWert([{ d: 0.40, lambda: 2.3 }, { d: 0.12, lambda: 0.035 }, { d: 0.015, lambda: 0.70 }], 0.13, 0.04).U, 0.26358);
const fw = { g: 0.5, strahlung: 500 };
pruefe('UW3 U_w', uwFenster({ breite: 1.23, hoehe: 1.48, rahmenMm: 110, ug: 0.6, uf: 1.0, psi: 0.038, ...fw }).uw, 0.81514);
pruefe('UW4 U_w', uwFenster({ breite: 1.0, hoehe: 1.0, rahmenMm: 100, ug: 1.1, uf: 1.3, psi: 0.08, ...fw }).uw, 1.428);

// 3. Mauerwerk (EN 1996-1-1, Gl. 3.1–3.4 und 6.1.2.2; DIN EN 1996-3/NA, erweiterte Bedingungen)
const fk1 = fkEmpfehlungEN(0.55, 12, 5, 'NM', false);
pruefe('MW1 f_k', fk1, 5.07552); pruefe('MW1 f_d', fdAusFk(fk1), 2.87613); pruefe('MW1 Φ', phiAusmitte(0.05, 0.24), 0.583333);
pruefe('MW1 N_Rd', phiAusmitte(0.05, 0.24) * 0.24 * fdAusFk(fk1) * 1000, 402.658);
pruefe('MW2 f_k HLz DM', fkEmpfehlungEN(0.70, 12, 0, 'DM', true), 3.98589);
pruefe('MW3 f_k KS DM', fkEmpfehlungEN(0.80, 20, 0, 'DM', false), 10.2086);
const mw5 = bemesseWandVereinfacht({ lage: 'innen', h: 3.5, t: 175, a: 175, lf: 5, fk: 7.1, nEd: 300 });
pruefe('MW5 Φ', mw5.phi, 0.6025); pruefe('MW5 n_Rd', mw5.nRd, 424.21);
gilt(mw5.hinweise.some(h => h.text.includes('t ≥ 115 mm bis h ≤ 3,60 m')), 'MW5 Hinweis erweiterte Bedingungen');
gilt(bemesseWandVereinfacht({ lage: 'innen', h: 3.8, t: 175, a: 175, lf: 5, fk: 7.1, nEd: 300 }).hinweise.some(h => h.text.includes('> 3,60 m')), 'MW6 h > 3,60 m außerhalb');

// 4. Frischbeton – Luftgehalt (DIN 1045-2 Tab. F.2.2; DIN EN 206, 5.4.3; Grenzabweichung −0,5/+1,0 %)
const fb1 = bewerteLuftgehalt({ ablesung: 4.8, gesteinskorrektur: 0.2, klasse: 'XF4', dmax: 32 });
pruefe('FB1 L', fb1.luftgehalt, 4.6); pruefe('FB1 obere Grenze', fb1.obergrenze, 8); gilt(fb1.bewertung === 'erfuellt', 'FB1 erfüllt');
const fb2 = bewerteLuftgehalt({ ablesung: 9.0, gesteinskorrektur: 0, klasse: 'XF4', dmax: 16 });
pruefe('FB2 obere Grenze', fb2.obergrenze, 8.5); pruefe('FB2 oberer Einzelwert', fb2.einzelwertMax, 9.5); gilt(fb2.bewertung === 'ueberObergrenze', 'FB2 über oberer Grenze');
pruefe('FB3 unterer Einzelwert', bewerteLuftgehalt({ ablesung: 5.2, gesteinskorrektur: 0, klasse: 'XF2', dmax: 8 }).einzelwertMin, 5.0);

// 5. Hydratation / Reife
pruefe('HY1 k_T Arrhenius 10 °C', temperaturfaktorReife('Arrhenius', 10, 38), 0.576599);
pruefe('HY2 k_T fib 5 °C', temperaturfaktorReife('fib Model Code 2010', 5), 0.479104);
pruefe('HY3 t_e Saul 48 h bei 10 °C', wirksamesAlterKonstant('Saul', 10, 48), 32);
pruefe('HY4 k_T gewogene Reife C = 1,45, 5 °C', temperaturfaktorReife('gewogene Reife nach NEN 5970', 5, 38, 1.45), 0.572727);
const hy5 = kennwerteZumAlter(0.25, 7, 30);
pruefe('HY5 β_cc', hy5.beta, 0.778801); pruefe('HY5 f_cm(7)', hy5.fc, 29.5944); pruefe('HY5 f_ctm(7)', hy5.fct, 2.25577); pruefe('HY5 E_cm(7)', hy5.E, 30.4639);
pruefe('HY6 ΔT_ad (cρ = 2400)', adiabatischeErwaermung(320, 350), 46.6667);

// 6. Expositionsklassen (DIN 1045-2 Tab. F.2.1/F.2.2; DIN EN 1992-1-1/NA Tab. 4.4DE)
const ex1 = huellwerte(NORMATIVE_EXPOSURE_CLASSES, ['XC4', 'XF4'], 16, 15);
gilt(!!ex1 && ex1.minWzEq === 0.5 && ex1.highestClass === 'C30/37' && ex1.maxCement === 320 && ex1.minAirVal === 4.5 && ex1.maxCoverDur === 25 && ex1.cNom === 40, `EX1 ${JSON.stringify(ex1)}`);
const ex2 = huellwerte(NORMATIVE_EXPOSURE_CLASSES, ['XD3', 'XF2', 'XA2'], 32, 15);
gilt(!!ex2 && ex2.minWzEq === 0.45 && ex2.highestClass === 'C35/45' && ex2.maxCement === 320 && ex2.minAirVal === 4.0 && ex2.cNom === 55, `EX2 ${JSON.stringify(ex2)}`);
const ex3 = kWertAnsatz({ zement: 300, wasser: 165, flugasche: 120, silika: 20 });
pruefe('EX3 z_eq', ex3.beq, 359.6); pruefe('EX3 (w/z)_eq', ex3.wzEq, 0.458843);
const ex4 = huellwerte(NORMATIVE_EXPOSURE_CLASSES, ['XC1'], 32, 10);
gilt(!!ex4 && ex4.cNom === 20 && ex4.specialReqs.some(s => s.includes('Δc_dev')), 'EX4 nur XC1');

// 7. Stahlbau EC 3 (6.2, 6.3.1, Tab. 5.2, 6.1, 6.2; γ_M1 = 1,1 NA DE)
const st1 = bemesseDruckstab({ profil: 'HEB 200', guete: 'S235', LcrY: 4, LcrZ: 4, nEd: 800 });
pruefe('ST1 λ̄_z', st1.z.lambdaQuer, 0.840091); pruefe('ST1 χ_z', st1.z.chi, 0.637015); pruefe('ST1 N_b,Rd', st1.NbRd, 1062.86); pruefe('ST1 N_b,Rd,y', st1.y.NbRd, 1476.24);
gilt(st1.z.knicklinie === 'c' && st1.y.knicklinie === 'b', 'ST1 Knicklinien b/c');
const ipe300 = profil('IPE 300');
const st2 = ipe300 ? biegewiderstandY(ipe300, 'S355') : null;
gilt(!!st2 && st2.klasse.klasse === 1, 'ST2 IPE 300 S355 Klasse 1'); pruefe('ST2 M_pl,Rd', st2?.McRd ?? NaN, 223.082);
const st3 = bemesseZugstab({ A: 20, Anet: 17, guete: 'S355', nEd: 500 });
pruefe('ST3 N_pl,Rd', st3.NplRd, 710); pruefe('ST3 N_u,Rd', st3.NuRd, 599.76); gilt(st3.nettoMassgebend, 'ST3 Nettoquerschnitt maßgebend');
const st4 = bemesseDruckstab({ profil: 'HEA 300', guete: 'S460', LcrY: 2, LcrZ: 2, nEd: 100 });
gilt(st4.vernachlaessigbar && st4.klasse?.klasse === 3 && st4.z.knicklinie === 'a', `ST4 ${st4.klasse?.klasse} ${st4.z.knicklinie}`);
pruefe('ST4 N_Rd = N_c,Rd', st4.NRd, 5175); pruefe('ST4 N_cr,z', st4.z.Ncr, 32695.5);

// 8. Asphalt (DIN EN 12697-5/-8; Lehrmodelle)
const as1 = asphaltRaumdichte({ bitumen: 5, hohlraum: 3, rhoGestein: 2.65, rhoBitumen: 1.03 });
pruefe('AS1 ρ_m', as1.rohdichte, 2.4568); pruefe('AS1 ρ_b', as1.raumdichte, 2.38309);
const as2 = asphaltRaumdichte({ bitumen: 6, hohlraum: 4, rhoGestein: 2.70, rhoBitumen: 1.02 });
pruefe('AS2 ρ_m', as2.rohdichte, 2.45717); pruefe('AS2 ρ_b', as2.raumdichte, 2.35889);
pruefe('AS3 Aerosol 165 °C', ntaModell({ verfahren: 'standard', temperatur: 165, rcAnteil: 0 }).aerosol, 5.38656);
const as4 = ntaModell({ verfahren: 'organic', temperatur: 130, rcAnteil: 0 });
pruefe('AS4 Viskosität', as4.viskositaet, 1.16829); gilt(as4.bewertung === 'optimal' && as4.verdichtungsfenster === 19, 'AS4 optimal, 19 min');
gilt(marshallLehrmodell(5.5) === 12 && marshallLehrmodell(7) === 9, 'AS5 Marshall-Lehrkurve');

// 9. Brandschutz: Tabellenwerte DIN EN 1992-1-2, Tab. 5.5 (Balken, erste Spalte) und Tab. 5.8 (Platten) – Befund T3-BR-1
const soll = [[80, 25, 60], [120, 40, 80], [150, 55, 100], [200, 65, 120]];
EC2_BRAND_MINDESTMASSE.forEach((z, i) => gilt(z.balkenB === soll[i][0] && z.balkenA === soll[i][1] && z.platteH === soll[i][2], `BR ${z.klasse}: ${z.balkenB}/${z.balkenA}/${z.platteH}`));

// 10. Trittschall (DIN 4109-2/-32/-34)
const ts1 = trittschall({ dDecke: 0.18, rhoDecke: 2400, mZusatz: 10, dEstrich: 0.05, rhoEstrich: 2000, sStrich: 20, mFlanke: 250, zulLnw: 50 });
pruefe('TS1 L_n,eq,0,w', ts1.lnEq0w, 71.4102); pruefe('TS1 ΔL_w', ts1.deltaLw, 28.3254); pruefe('TS1 K', ts1.k, 1.96115); pruefe('TS1 L′_n,w', ts1.lnwStrich, 45.046);
gilt(ts1.erfuellt, 'TS1 erfüllt (48,0 ≤ 50 dB)');
const ts2 = trittschall({ dDecke: 0.14, rhoDecke: 2400, mZusatz: 0, dEstrich: 0.045, rhoEstrich: 2200, sStrich: 30, mFlanke: 350, zulLnw: 50 });
pruefe('TS2 L′_n,w', ts2.lnwStrich, 50.3125); gilt(!ts2.erfuellt, 'TS2 nicht erfüllt (53,3 > 50 dB)');
pruefe('TS3 K = 0 bei schweren Flanken', trittschall({ dDecke: 0.125, rhoDecke: 2400, mZusatz: 0, dEstrich: 0.05, rhoEstrich: 2000, sStrich: 20, mFlanke: 450, zulLnw: 50 }).k + 1, 1);
pruefe('TS4 R_w HLz 243 kg/m²', rwMassiv(243), 51.5152);
pruefe('TS5 f₀ (Näherung 160 statt 159,2)', resonanzfrequenzEstrich(20, 100), 71.1763, 6e-3);

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log('OK: Modulprüfung Tranche 3');
