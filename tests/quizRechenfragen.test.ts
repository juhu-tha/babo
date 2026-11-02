// Rechenfragen im Quiz gegen die Rechenkerne (Gutachten 27.10.2026, Maßnahme 3)
//
// Quizfragen, deren Zahlen deterministisch aus einem Rechenkern in src/calc/* folgen („nach dem Modul“), werden hier
// mit dem Kern nachgerechnet. Jede Prüfung legt fest, welche Option richtig ist und – soweit sinnvoll – wie die
// Distraktoren aus typischen Fehlern entstehen. Neue Fragen ergänzen: Eintrag in PRUEFUNGEN anlegen (Werte immer aus
// dem Kern, nie abgeschrieben); für Module in VOLL_ABGEDECKT muss jede Frage einen Eintrag haben (oder in OHNE_RECHNUNG
// mit Begründung stehen), damit neue Fragen nicht ungeprüft bleiben.
import { QUIZ_QUESTIONS } from '../src/data/quizData';
import { formatDeZahl } from '../src/utils/numberFormat';
import { fdAusFk, fkNA, phi2, bemesseWandVereinfacht, ZETA_MW, GAMMA_M_MW, SCHLANKHEIT_MAX, H_ERWEITERT_INNEN_MAX } from '../src/calc/mauerwerk';
import { rwMassiv, wandSchalldaemmung, PUTZ_MASSE_BEIDSEITIG } from '../src/calc/schall';
import { istSieblinie, regelDurchgang } from '../src/calc/mischung';
import { funktionelleEinheitBauteil } from '../src/calc/lca';
import { relaxation } from '../src/utils/ec2Spannbeton';
import { ultraschall, impactEcho, haftzug, chlorid, bohrkern } from '../src/calc/bauwerksuntersuchung';
import { georadar, wenner, potentialRisikoZfp, torrentFeuchte } from '../src/calc/pruefverfahren';
import { WAERMEKAPAZITAET_VOL } from '../src/calc/hydratation';
// Nachrechnung 02.11.2026 (docs/pruefung/quiz-rechenfragen-2026-11-02.md)
import { uWert, temperaturverlauf, taupunkt, psat, temperaturBeiPsat, temperaturleitfaehigkeit, waermeeindringkoeffizient } from '../src/calc/waermeschutz';
import { betaCc, ecmVonFcm } from '../src/calc/betonkennwerte';
import { ecmEc2, verbundSchranken } from '../src/calc/emodul';
import { konformitaetDruck } from '../src/calc/festbetonStatistik';
import { bemessungswert, knickbeiwert, druckUnterWinkel, abbrandQuerschnitt } from '../src/calc/holzbau';
import { biegeknicken, bemesseZugstab, plastischeKapazitaet } from '../src/calc/stahlbau';
import { zustandsgrenzen, mohrCoulomb, erddruckRankine, fliessgrenze, bodengruppePlastizitaet } from '../src/calc/boden';
import { frostschutz, bodengruppe } from '../src/calc/erdbau';
import { abtragsrateFaraday, querschnittsverlust, chloridGehalt, karbonatisierungsFront, schnellUmrechnung } from '../src/calc/korrosion';
import { wurzelZeitRegression } from '../src/calc/schnellkarbonatisierung';
import { rentenbarwertfaktor } from '../src/calc/lcc';
import { zwangSpannung } from '../src/calc/zwang';
// Lernziel-Abdeckung 03.11.2026 (docs/pruefung/lernziel-abdeckung-2026-11-03.md): neue Rechenfragen qlz_*
import { bemesseBiegung } from '../src/calc/biegung';
import { mauermoertelNormalfuge, TROCKENMOERTEL_KG_JE_L } from '../src/calc/moertelbedarf';
import { pn98Probenzahl } from '../src/calc/probenahme';
import { huellwerte } from '../src/calc/expositionsklassen';
import { NORMATIVE_EXPOSURE_CLASSES } from '../src/modules/expositionsklassen/daten';
import { hauptspannungen, vonMises } from '../src/calc/spannungszustand';
import { gefuegeAnteile, cev } from '../src/calc/eisenKohlenstoff';
import { bilinearVerfestigung, binghamScherrate, maxwellSpannung, abminderungStahlBrand } from '../src/calc/werkstoffmodelle';
import { carbonbetonBiegung } from '../src/calc/carbonbeton';
import { einfeldQ, kragF } from '../src/calc/biegelinie';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
console.log('--- Test: Quiz-Rechenfragen gegen Rechenkerne ---');

interface Pruefung {
  id: string;
  /** Text der richtigen Option, aus dem Kern erzeugt */
  richtig: string;
  /** optional: alle Optionen in Reihenfolge (Distraktoren aus definierten Fehlern) */
  optionen?: string[];
  /** Textstücke, die in der Erklärung vorkommen müssen (z. B. Zwischenergebnisse) */
  erklaerung?: string[];
  /** Textstücke, die in der Frage vorkommen müssen (Eingangswerte) */
  frage?: string[];
}

const z = (x: number, n: number) => formatDeZahl(x, n);
const nahe = (a: number, b: number, tol: number) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
const PRUEFUNGEN: Pruefung[] = [];
const VOLL_ABGEDECKT = new Set<string>();
const OHNE_RECHNUNG: Record<string, string> = {};

// ------------------------------------------------------------------------------------------------
// Mauerwerk (src/calc/mauerwerk.ts): f_d = ζ · f_k/γ_M, Φ2 = 0,85·a/t − 0,0011·(h_ef/t)², N_Rd = Φ · t · f_d
// ------------------------------------------------------------------------------------------------
{
  VOLL_ABGEDECKT.add('rechnung_mauerwerk');
  // KS: Tafelwert des Moduls (KS L 12, NM III; Abgleich 02.11.2026), HLz: Annahme der Fragen (3,2 N/mm², nicht in der Tafel)
  const fkKS = fkNA('KSL-12-NMIII')?.fk ?? NaN, fkHLz = 3.2;
  pruefe(fkKS === 5.6, `Tafelwert KS L 12/NM III ist ${fkKS} statt 5,6 N/mm² – qn_rechnung_mauerwerk_1/_5/_6 anpassen`);
  const fdKS = fdAusFk(fkKS), fdHLz = fdAusFk(fkHLz);
  const ohneZeta = (fk: number) => fdAusFk(fk, 1);
  const phiW = (hEf_m: number, t_mm: number) => phi2(hEf_m * 1000, t_mm, 1);
  const nRd = (phi: number, t_mm: number, fd: number) => phi * t_mm * fd; // N/mm = kN/m
  pruefe(ZETA_MW === 0.85 && GAMMA_M_MW === 1.5, 'Kern: ζ = 0,85 und γ_M = 1,5 erwartet');

  // 1: f_d; Distraktoren: mit γ_M multipliziert, ohne ζ, γ = 1,15 (Betonstahl)
  PRUEFUNGEN.push({
    id: 'qn_rechnung_mauerwerk_1',
    richtig: `f_d = ${z(fdKS, 2)} N/mm²`,
    optionen: [`f_d = ${z(ZETA_MW * fkKS * GAMMA_M_MW, 2)} N/mm²`, `f_d = ${z(ohneZeta(fkKS), 2)} N/mm²`,
      `f_d = ${z(fdAusFk(fkKS, ZETA_MW, 1.15), 2)} N/mm²`, `f_d = ${z(fdKS, 2)} N/mm²`],
    frage: ['f_k = 5,6', 'ζ = 0,85', 'γ_M = 1,5'],
    erklaerung: ['0,85 · 5,6/1,5'],
  });

  // 2: Schlankheit gegen die Grenzschlankheit des Kerns
  const s2 = 2.75 / 0.175;
  PRUEFUNGEN.push({
    id: 'qn_rechnung_mauerwerk_2',
    richtig: `h_ef/t = ${z(s2, 1)} ≤ ${SCHLANKHEIT_MAX}, eingehalten`,
    erklaerung: [z(s2, 2), `höchstens ${SCHLANKHEIT_MAX}`],
  });

  // 3: Φ2 bei a/t = 1
  const p175 = phiW(2.75, 175);
  PRUEFUNGEN.push({ id: 'qn_rechnung_mauerwerk_3', richtig: `Φ = ${z(p175, 3)}` });

  // 4: N_Rd; Distraktoren: ohne Φ, ohne ζ, Faktor 10
  const n4 = nRd(p175, 175, fdKS);
  PRUEFUNGEN.push({
    id: 'qn_rechnung_mauerwerk_4',
    richtig: `N_Rd ≈ ${z(n4, 0)} kN/m`,
    optionen: [`N_Rd ≈ ${z(175 * fdKS, 0)} kN/m`, `N_Rd ≈ ${z(n4, 0)} kN/m`, `N_Rd ≈ ${z(nRd(p175, 175, ohneZeta(fkKS)), 0)} kN/m`,
      `N_Rd ≈ ${z(n4 / 10, 1)} kN/m`],
    frage: [`Φ = ${z(p175, 3)}`, `${z(fdKS, 2)} N/mm²`],
    erklaerung: [`rund ${z((90 / n4) * 100, 0)} %`],
  });

  // 5: Innenwand 115 mm mit h = 3,60 m – erweiterte Bedingungen (Tab. NA.2), Schlankheit eingehalten, Tragfähigkeit nicht
  const h5 = 3.6, w5 = bemesseWandVereinfacht({ lage: 'innen', h: h5, t: 115, a: 115, lf: 5, fk: fkKS, nEd: 120 });
  const s5 = w5.schlankheit, p5 = w5.phi, n5 = w5.nRd;
  pruefe(h5 <= H_ERWEITERT_INNEN_MAX && w5.hinweise.some(x => x.feld === 'h' && x.text.includes('bis h ≤ 3,60 m')), 'qn_rechnung_mauerwerk_5: h = 3,60 m nicht mehr im erweiterten Anwendungsbereich des Kerns');
  pruefe(s5 <= SCHLANKHEIT_MAX && w5.eta > 1 && nahe(p5, phiW(0.75 * h5, 115), 1e-12) && nahe(n5, nRd(p5, 115, fdKS), 1e-9), 'qn_rechnung_mauerwerk_5: Annahme „Schlankheit eingehalten, überlastet“ passt nicht mehr zum Kern');
  PRUEFUNGEN.push({
    id: 'qn_rechnung_mauerwerk_5',
    richtig: `Erweiterte Bedingungen erlauben h = 3,60 m, doch mit Φ ≈ ${z(p5, 2)} ist sie überlastet`,
    frage: ['h = 3,60 m', `h_ef = 0,75 · 3,60 m = ${z(w5.hEf, 2)} m`, `h_ef/t = ${z(s5, 1)}`, `Φ = Φ2 ≈ ${z(p5, 2)}`, `η ≈ ${z(w5.eta, 2)}`],
    erklaerung: [`${z(n5, 1)} kN/m`, `η = ${z(w5.eta, 2)}`, `0,0011 · ${z(s5, 2)}² = ${z(p5, 3)}`, 'Tab. NA.2'],
  });

  // 6: Vergleich KS/HLz; Distraktoren: vertauscht, Dicke nur linear, ohne ζ
  const eta = (n: number) => z(150 / n, 2);
  const ks = nRd(p175, 175, fdKS), h175 = nRd(p175, 175, fdHLz), p240 = phiW(2.75, 240), h240 = nRd(p240, 240, fdHLz);
  const zeile = (a: string, b: string, c: string) => `KS 17,5 cm: η ≈ ${a}; HLz 17,5 cm: η ≈ ${b}; HLz 24 cm: η ≈ ${c}`;
  const oz = (fk: number, phi: number, t: number) => eta(nRd(phi, t, ohneZeta(fk)));
  PRUEFUNGEN.push({
    id: 'qn_rechnung_mauerwerk_6',
    richtig: zeile(eta(ks), eta(h175), eta(h240)),
    optionen: [zeile(eta(ks), eta(h175), eta(h240)), zeile(eta(h175), eta(ks), eta(h240)),
      zeile(eta(ks), eta(h175), eta(h175 * 240 / 175)), zeile(oz(fkKS, p175, 175), oz(fkHLz, p175, 175), oz(fkHLz, p240, 240))],
    erklaerung: [`${z(ks, 0)} kN/m`, `${z(h175, 0)} kN/m`, `${z(h240, 0)} kN/m`, `Φ = ${z(p240, 2)} statt ${z(p175, 2)}`],
  });
}

// ------------------------------------------------------------------------------------------------
// Schallschutz (src/calc/schall.ts): m′ = d·ρ + m′_Putz, R_w = 30,9·lg m′ − 22,2 (DIN 4109-32), R′_w = R_w − K_F
// ------------------------------------------------------------------------------------------------
{
  VOLL_ABGEDECKT.add('rechnung_schallschutz');
  const w = (d: number, rho: number, putz: number, kF: number) => wandSchalldaemmung({ dicke: d, rohdichte: rho, putzMasse: putz, kF });
  const ks = w(0.175, 2000, PUTZ_MASSE_BEIDSEITIG, 2);
  PRUEFUNGEN.push({ id: 'qn_rechnung_schallschutz_1', richtig: `m′ = ${z(ks.mStrich, 0)} kg/m²` });
  // 2: R_w; Distraktoren: ohne −22,2; ohne Putz; bereits R′_w
  PRUEFUNGEN.push({
    id: 'qn_rechnung_schallschutz_2',
    richtig: `R_w ≈ ${z(rwMassiv(390), 1)} dB`,
    optionen: [`R_w ≈ ${z(rwMassiv(390) + 22.2, 1)} dB`, `R_w ≈ ${z(rwMassiv(350), 1)} dB`, `R_w ≈ ${z(rwMassiv(390) - 2, 1)} dB`, `R_w ≈ ${z(rwMassiv(390), 1)} dB`],
    frage: ['30,9 · lg m′ − 22,2', '390 kg/m²'],
    erklaerung: [`= ${z(rwMassiv(390), 1)} dB`],
  });
  // 3: HLz 24 cm; Distraktoren: K_F addiert, ohne Putz, K_F = 4
  const hlz = w(0.24, 1200, 40, 2);
  const zeile = (x: number, t: string) => `R′_w ≈ ${z(x, 1)} dB: ${t}`;
  PRUEFUNGEN.push({
    id: 'qn_rechnung_schallschutz_3',
    richtig: zeile(hlz.RwStrich, 'knapp eingehalten'),
    optionen: [zeile(hlz.RwStrich, 'knapp eingehalten'), zeile(hlz.Rw + 2, 'deutlich eingehalten'), zeile(w(0.24, 1200, 0, 2).RwStrich, 'nicht eingehalten'), zeile(hlz.Rw - 4, 'nicht eingehalten')],
    erklaerung: [`R_w = 30,9 · lg 328 − 22,2 = ${z(hlz.Rw, 1)} dB`, `R′_w = ${z(hlz.Rw, 1)} − 2 = ${z(hlz.RwStrich, 1)} dB`],
  });
  pruefe(hlz.RwStrich >= 53, 'qn_rechnung_schallschutz_3: Nachweis müsste erfüllt sein');
  // 4: Porenbeton
  const pb = w(0.24, 500, 40, 4), pb30 = w(0.30, 500, 40, 4);
  PRUEFUNGEN.push({
    id: 'qn_rechnung_schallschutz_4',
    richtig: 'Schwerere Steine (z. B. KS, RDK ≥ 2,0) und günstigere Flanken wählen',
    frage: [`R′_w ≈ ${z(pb.RwStrich, 1)} dB`],
    erklaerung: [`rund ${z(Math.round(53 - pb.RwStrich), 0)} dB`, `≈ ${z(pb30.RwStrich, 1)} dB`],
  });
  pruefe(pb30.RwStrich < 53, 'qn_rechnung_schallschutz_4: 30 cm Porenbeton dürfte 53 dB nicht erreichen');
  // 5: Verdopplung
  PRUEFUNGEN.push({ id: 'qn_rechnung_schallschutz_5', richtig: `um rund ${z(rwMassiv(800) - rwMassiv(400), 1)} dB`, erklaerung: [`≈ ${z(30.9 * Math.log10(2), 1)} dB`] });
  OHNE_RECHNUNG['qn_rechnung_schallschutz_6'] = 'Verständnisfrage zur Flankenübertragung ohne Rechnung';
}

// ------------------------------------------------------------------------------------------------
// Mischungsberechnung (src/calc/mischung.ts): Regelsieblinien A/B/C 16 (Lehrbuchwerte, vorläufig F-Freigabe)
// ------------------------------------------------------------------------------------------------
{
  const w = (l: 'A' | 'B' | 'C') => `${l}16 = ${regelDurchgang(16, l, 4)}/${regelDurchgang(16, l, 8)} %`;
  const e = istSieblinie(16, { f04: 45, f48: 20, f816: 35, f1632: 0 });
  pruefe(e.bereich === 'A–B', 'qn_mischungsberechnung_4: Einordnung laut Kern nicht A–B');
  PRUEFUNGEN.push({
    id: 'qn_mischungsberechnung_4',
    richtig: 'Zwischen A16 und B16 – günstiger Bereich',
    frage: [w('A'), w('B'), w('C'), '45 % bei 4 mm', '65 % bei 8 mm'],
  });
}

// ------------------------------------------------------------------------------------------------
// LCA (src/calc/lca.ts): deklarierte Einheit 1 kg → funktionelle Einheit 1 m² Wand über 50 a
// ------------------------------------------------------------------------------------------------
{
  const s = { name: 'Dämmung', einheit: 'kg' as const, dickeM: 0.15, rohdichte: 20, gwpA1A3: 3.0, gwpC: 2.0, nutzungsdauer: 40 };
  const fe = funktionelleEinheitBauteil([s], 50);
  const ohneErsatz = funktionelleEinheitBauteil([{ ...s, nutzungsdauer: 50 }], 50);
  const zweiErsatz = funktionelleEinheitBauteil([{ ...s, nutzungsdauer: 20 }], 50);
  const opt = (x: number) => `${z(x, 1)} kg CO₂-Äq./m²`;
  // Distraktoren: ohne Ersatz, anteilig 50/40, zwei Ersatzmaßnahmen
  PRUEFUNGEN.push({
    id: 'qn_lca_rechner_fe2',
    richtig: opt(fe.summe),
    optionen: [opt(ohneErsatz.summe), opt(ohneErsatz.summe * 50 / 40), opt(fe.summe), opt(zweiErsatz.summe)],
    frage: ['5,0 kg CO₂-Äq./kg', 'ρ = 20 kg/m³', 'd = 0,15 m', '40 Jahren'],
    erklaerung: ['3,0 kg/m²', 'n = ⌈50/40⌉ − 1 = 1'],
  });
}

// ------------------------------------------------------------------------------------------------
// Hydratation (src/calc/hydratation.ts): ΔT_ad = z·Q/(c·ρ) mit c·ρ = 2400 kJ/(m³·K) (QZ-4, 29.10.2026)
// ------------------------------------------------------------------------------------------------
{
  pruefe(WAERMEKAPAZITAET_VOL === 2400, 'Kern: c·ρ = 2400 kJ/(m³·K) erwartet');
  const dT2 = (280 * 250) / WAERMEKAPAZITAET_VOL;
  // Distraktoren: halbe Wärmemenge, 500 kJ/kg (CEM I), geteilt durch 1000
  PRUEFUNGEN.push({
    id: 'q_hyf_2', richtig: `rund ${z(dT2, 0)} K`,
    optionen: [`rund ${z(dT2 / 2, 0)} K`, `rund ${z(dT2, 0)} K`, `rund ${z((280 * 500) / WAERMEKAPAZITAET_VOL, 0)} K`, `rund ${z((280 * 250) / 1000, 0)} K`],
    frage: ['c·ρ = 2400'], erklaerung: ['/ 2400 = 29,2 K'],
  });
  const dT4 = (320 * 350) / WAERMEKAPAZITAET_VOL;
  PRUEFUNGEN.push({
    id: 'q_hyf_4', richtig: `etwa ${z(15 + dT4, 0)} °C`,
    optionen: [`etwa ${z(dT4, 0)} °C`, `etwa ${z(15 + dT4, 0)} °C`, `etwa ${z((15 + dT4) / 2, 0)} °C`, 'etwa 75 °C'],
    frage: ['c·ρ = 2400'], erklaerung: ['46,7 K'],
  });
}

// ------------------------------------------------------------------------------------------------
// Teilmodul-Aufstockung (QZ-6, 29.10.2026): Spannbeton-Kennwerte, Prüfverfahren-Katalog, ZfP, Bauwerksdiagnose
// ------------------------------------------------------------------------------------------------
{
  // Relaxation Klasse 2, μ = 0,70, Endwert 500 000 h; Distraktoren: 1000-h-Wert, ρ₁₀₀₀ = 8 % in Gl. (3.29), Gl. (3.28) Klasse 1
  const sp = 0.7 * 1860;
  const r = relaxation(sp, 1860, 2).delta_sigma_pr, r1000 = relaxation(sp, 1860, 2, 1000).delta_sigma_pr;
  const r8 = r * 8 / 2.5, rK1 = relaxation(sp, 1860, 1).delta_sigma_pr;
  const ds = (x: number) => `Δσ_pr ≈ ${z(x, 0)} N/mm²`;
  PRUEFUNGEN.push({ id: 'qt_spannbeton_kennwerte_1', richtig: ds(r), optionen: [ds(r1000), ds(r8), ds(r), ds(rK1)], frage: ['σ_pi = 1302 N/mm²', 'μ = 0,70'], erklaerung: ['3,9 %'] });

  // In-situ-Festigkeit → Klasse: f_ck = f_ck,is/0,85
  const fck = 26.5 / 0.85;
  pruefe(fck >= 30 && fck < 35, 'qt_bauwerksdiagnose_2: f_ck nicht in C30/37');
  PRUEFUNGEN.push({ id: 'qt_bauwerksdiagnose_2', richtig: `C30/37 (f_ck ≈ ${z(fck, 0)} N/mm²)`, frage: ['f_ck,is = 26,5'], erklaerung: [`= ${z(fck, 1)} N/mm²`] });

  // Ultraschall: v_p = s/Δt, E_dyn mit ν = 0,2
  const us = ultraschall(0.4, 95, 2400);
  pruefe(us.stufe === 'gut', 'qt_pruefverfahren_katalog_1: Gefügestufe nicht „gut“');
  PRUEFUNGEN.push({ id: 'qt_pruefverfahren_katalog_1', richtig: `v_p ≈ ${z(Math.round(us.vp / 10) * 10, 0)} m/s, E_dyn ≈ ${z(us.eDynGPa, 0)} GPa – gutes, dichtes Gefüge`, frage: ['s = 0,40 m', 'Δt = 95 µs'] });

  // Impact-Echo: d = β·v_p/(2f)
  const ie = impactEcho(9.6, 4000, 30);
  pruefe(ie.delamination, 'qt_pruefverfahren_katalog_2: Kern meldet keine Fehlstelle');
  PRUEFUNGEN.push({ id: 'qt_pruefverfahren_katalog_2', richtig: `d ≈ ${z(ie.dickeCm, 0)} cm: Reflexion vor der Rückwand, Hinweis auf Fehlstelle`, frage: ['f = 9,6 kHz', 'v_p = 4000 m/s'] });

  // Haftzug mit Kleberbruch: Wert, aber Anforderung nicht erfüllt
  const hz = haftzug(3.5, 'kleber');
  pruefe(!hz.ok && hz.fct >= 1.5, 'qt_pruefverfahren_katalog_3: Kern-Einstufung abweichend');
  PRUEFUNGEN.push({ id: 'qt_pruefverfahren_katalog_3', richtig: `f_ct ≈ ${z(hz.fct, 2)} N/mm² ist nur ein unterer Grenzwert; Prüfung wiederholen`, frage: ['F = 3,5 kN'] });

  // Chlorid 0,3 M.-%: Stahlbeton unter Anhaltswert, Spannstahl überschritten
  pruefe(!chlorid(0.3, false).ueberschritten && chlorid(0.3, true).ueberschritten, 'qt_pruefverfahren_katalog_4: Chlorid-Einstufung laut Kern abweichend');
  PRUEFUNGEN.push({ id: 'qt_pruefverfahren_katalog_4', richtig: 'Stahlbeton unter dem Anhaltswert; am Spannstahl (ab 0,2 M.-%) kritisch', frage: ['0,3 M.-%'] });

  // Bohrkern L/D = 1 → Würfel 150 mm
  const bk = bohrkern(100, 100, 275);
  pruefe(bk.bezug === 'wuerfel', 'qt_pruefverfahren_katalog_5: Bezugskörper laut Kern nicht Würfel');
  PRUEFUNGEN.push({ id: 'qt_pruefverfahren_katalog_5', richtig: `f_c,core ≈ ${z(bk.festigkeit, 1)} N/mm², vergleichbar mit dem Würfel (150 mm)`, frage: ['D = 100 mm', 'F = 275 kN'] });

  // Georadar: v = c/√ε_r, d = v·t/2; Distraktoren: ohne Halbierung, c₀·t ohne ε_r, durch ε_r statt √ε_r
  const gr = georadar(9, 2);
  PRUEFUNGEN.push({ id: 'qt_zfp_1', richtig: `d ≈ ${z(gr.depth, 0)} mm`, optionen: [`d ≈ ${z(gr.depth * 2, 0)} mm`, `d ≈ ${z(300 * 2 / 2, 0)} mm`, `d ≈ ${z((300 / 9) * 2 / 2, 1)} mm`, `d ≈ ${z(gr.depth, 0)} mm`], frage: ['ε_r = 9', 't = 2,0 ns'] });

  // Wenner: ρ = 2π·a·R, Einstufung mäßig
  const wn = wenner(50, 1000);
  pruefe(wn.stufe === 'mittel', 'qt_zfp_2: Wenner-Stufe laut Kern nicht „mittel“');
  PRUEFUNGEN.push({ id: 'qt_zfp_2', richtig: `ρ ≈ ${z(wn.rho, 0)} Ω·m – mäßiges Korrosionsrisiko`, frage: ['a = 50 mm', 'R = 1000 Ω'], erklaerung: [`${z(wn.rhoKohmCm, 1)} kΩ·cm`] });

  // Potential −280 mV: ungewiss
  pruefe(potentialRisikoZfp(-280) === 'mittel', 'qt_zfp_3: −280 mV laut Kern nicht „ungewiss“');
  PRUEFUNGEN.push({ id: 'qt_zfp_3', richtig: 'Ungewiss (10 … 90 %); Bewertung objektbezogen im Potentialfeld', frage: ['−280 mV'] });

  // Torrent: Feuchte 90 % → kritisch (Messung ungültig)
  pruefe(torrentFeuchte(90) === 'kritisch', 'qt_zfp_4: 90 % Feuchte laut Kern nicht „kritisch“');
  PRUEFUNGEN.push({ id: 'qt_zfp_4', richtig: 'Ungültig: Porenwasser blockiert den Gasfluss, k_T fällt zu klein aus', frage: ['90 %'] });
}

// ------------------------------------------------------------------------------------------------
// Nachrechnung 02.11.2026: weitere Rechenfragen, die sich über einen Kern rechnen lassen
// (Liste und Handrechnungen der übrigen Fragen: docs/pruefung/quiz-rechenfragen-2026-11-02.md)
// ------------------------------------------------------------------------------------------------
const zm = (x: number, n: number) => (x < 0 ? `−${z(-x, n)}` : z(x, n)); // Minuszeichen U+2212 wie im Quiztext
{
  // Wärmeschutz (src/calc/waermeschutz.ts): R_T = R_si + Σ d/λ + R_se, U = 1/R_T, Temperaturverlauf, Taupunkt
  const putzBeton = [{ d: 0.015, lambda: 0.70 }, { d: 0.20, lambda: 2.3 }];
  const u = (eps: number, beton = 0.20) => uWert([putzBeton[0], { d: beton, lambda: 2.3 }, { d: eps, lambda: 0.035 }], 0.13, 0.04);
  const u14 = u(0.14), u12 = u(0.12), u40 = u(0.14, 0.40);
  PRUEFUNGEN.push({ id: 'qn_rechnung_u_wert_2', richtig: `U = ${z(u14.U, 3)} W/(m²K)`, erklaerung: [`= ${z(u14.R_T, 3)} m²K/W`] });
  pruefe(u12.U > 0.24 && u14.U <= 0.24, 'qn_rechnung_u_wert_3: 12 cm EPS müsste verfehlen, 14 cm einhalten');
  PRUEFUNGEN.push({ id: 'qn_rechnung_u_wert_3', richtig: `U ≈ ${z(u12.U, 2)} W/(m²K): Anforderung verfehlt, Dämmung auf 14 cm erhöhen`, erklaerung: [`= ${z(u12.R_T, 3)} m²K/W`] });
  const rOhne = uWert(putzBeton, 0.13, 0.04).R_T;
  PRUEFUNGEN.push({ id: 'qn_rechnung_u_wert_4', richtig: `d ≥ ${z(((1 / 0.24 - rOhne) * 0.035) * 100, 1)} cm` });
  PRUEFUNGEN.push({ id: 'qn_rechnung_u_wert_5', richtig: 'Beton hat mit λ = 2,3 W/(mK) eine hohe Wärmeleitfähigkeit; 20 cm liefern nur 0,09 m²K/W', frage: [`von ${z(u14.U, 3)} auf ${z(u40.U, 3)}`] });
  PRUEFUNGEN.push({ id: 'qn_rechnung_u_wert_6', richtig: `rund ${z((4.0 / u14.R_T) * 100, 0)} %` });
  const wand = [{ d: 0.20, lambda: 2.0 }, { d: 0.12, lambda: 0.035 }];
  const bp = uWert(wand, 0.13, 0.04);
  pruefe(bp.U > 0.24, 'qn_bauphysik_1: U müsste über 0,24 liegen');
  PRUEFUNGEN.push({ id: 'qn_bauphysik_1', richtig: `U ≈ ${z(bp.U, 2)} W/(m²K); der Höchstwert wird nicht eingehalten`, erklaerung: [`R_T = 0,13 + 0,20/2,0 + 0,12/0,035 + 0,04`, `= ${z(bp.R_T, 2)} m²K/W`] });
  PRUEFUNGEN.push({ id: 'qn_bauphysik_2', richtig: `θ ≈ ${z(temperaturverlauf(wand, 0.13, 0.04, 20, -5)[1], 1)} °C` });
  const innen = temperaturverlauf([{ d: 0.08, lambda: 0.040 }, { d: 0.24, lambda: 0.68 }], 0.13, 0.04, 20, -5);
  PRUEFUNGEN.push({ id: 'qn_daemmung_vergleich_1', richtig: `θ ≈ ${zm(innen[1], 1)} °C` });
  PRUEFUNGEN.push({ id: 'qn_feuchteschutz_1', richtig: `θ_d ≈ ${z(taupunkt(22, 60), 1)} °C` });
  PRUEFUNGEN.push({ id: 'q_fs_1', richtig: `unter ${z(temperaturBeiPsat((psat(20) * 0.5) / 0.8), 1)} °C`, erklaerung: [`Taupunkt liegt bei ${z(taupunkt(20, 50), 1)} °C`] });
  PRUEFUNGEN.push({ id: 'q_we_4', richtig: `${z(temperaturleitfaehigkeit(2.0, 2400, 1000) * 1e7, 1)} · 10⁻⁷ m²/s` });
  PRUEFUNGEN.push({ id: 'qn_nawaro_2', richtig: `etwa Faktor ${z(temperaturleitfaehigkeit(0.035, 20, 1500) / temperaturleitfaehigkeit(0.040, 160, 2100), 0)}` });
  PRUEFUNGEN.push({ id: 'qn_baustoffkenngroessen_1', richtig: `b ≈ ${z(waermeeindringkoeffizient(2.0, 2400, 1000), 0)} J/(m²·K·s^0,5); die Oberfläche wirkt kühl` });
}
{
  // Betonkennwerte (src/calc/betonkennwerte.ts, emodul.ts): β_cc(t) = exp{s·[1 − (28/t)^0,5]}, E_cm = 22·(f_cm/10)^0,3·α_E
  PRUEFUNGEN.push({ id: 'qn_festbeton_1', richtig: `${z(betaCc(0.25, 7) * 38, 1)} N/mm²` });
  PRUEFUNGEN.push({ id: 'qn_betonkennwerte_2', richtig: `${z(betaCc(0.20, 3) * 38, 1)} N/mm²` });
  PRUEFUNGEN.push({ id: 'q_feb_2', richtig: 'Klasse R (s = 0,20)', erklaerung: [`R ${z(betaCc(0.20, 7), 2)}; N ${z(betaCc(0.25, 7), 2)}; S ${z(betaCc(0.38, 7), 2)}`] });
  PRUEFUNGEN.push({ id: 'qn_betonkennwerte_1', richtig: `rund ${z(Math.round(ecmVonFcm(48, 0.9) / 100) * 100, 0)} N/mm²` });
  PRUEFUNGEN.push({ id: 'qn_emodul_1', richtig: `E_cm ≈ ${z(ecmEc2(40, 1.2), 1)} GPa` });
  const s = verbundSchranken(50, 18, 0.65);
  PRUEFUNGEN.push({ id: 'qn_emodul_2', richtig: `Voigt ≈ ${z(s.voigt, 1)} GPa (obere), Reuss ≈ ${z(s.reuss, 1)} GPa (untere Schranke)` });
  const e30 = ecmEc2(30), e50 = ecmEc2(50), e30b = ecmEc2(30, 1.2);
  pruefe(e30b > e50, 'qn_emodul_4: Basalt müsste mehr bewirken als C50/60');
  PRUEFUNGEN.push({
    id: 'qn_emodul_4', richtig: `Basalt bei C30/37: E_cm ≈ ${z(e30b, 1)} GPa, also rund +${z((e30b / e30 - 1) * 100, 0)} % und damit mehr als C50/60`,
    frage: [`E_cm ≈ ${z(e30, 1)} GPa`], erklaerung: [`= ${z(e50, 1)} GPa (+${z((e50 / e30 - 1) * 100, 0)} %)`],
  });
}
{
  // Konformität Druckfestigkeit (src/calc/festbetonStatistik.ts): Erstherstellung f_cm ≥ f_ck + 4, f_ci ≥ f_ck − 4; stetig f_ck + 1,48·σ
  const k = (werte: number[], fckCube: number) => konformitaetDruck({ werte, fckCube, pruefArt: 'erst' });
  const a = k([33.5, 34.8, 32.9], 30);
  pruefe(!a.mittelOk && a.einzelOk, 'q_fbs_1: Kern-Einstufung abweichend');
  PRUEFUNGEN.push({ id: 'q_fbs_1', richtig: 'Nein, Kriterium 1 (Mittelwert ≥ 34) verfehlt', erklaerung: [`Mittelwert = ${z(a.mittelwert, 1)} N/mm²`] });
  const b = k([54.0, 54.5, 40.5], 45);
  pruefe(b.mittelOk && !b.einzelOk, 'qn_festbeton_statistik_2: Kern-Einstufung abweichend');
  PRUEFUNGEN.push({ id: 'qn_festbeton_statistik_2', richtig: `Nein, weil der Einzelwert 40,5 N/mm² unter f_ck − 4 = ${z(b.sollEinzelwert, 0)} N/mm² liegt`, erklaerung: [`f_cm = ${z(b.mittelwert, 1)}`] });
  const c = k([34.0, 32.5, 34.6], 30);
  pruefe(!c.mittelOk && c.einzelOk, 'qn_festbeton_2: Kern-Einstufung abweichend');
  PRUEFUNGEN.push({ id: 'qn_festbeton_2', richtig: `Nein – Mittelwert ${z(c.mittelwert, 1)} < 34,0 N/mm², obwohl alle Einzelwerte ≥ 26 N/mm² sind` });
  const d = k([41, 39, 43], 37);
  pruefe(d.bestanden && d.mittelwert === d.sollMittelwert, 'q_px_pr_2: Mittelwert 41 = f_ck + 4 müsste gerade bestehen (≥)');
  PRUEFUNGEN.push({ id: 'q_px_pr_2', richtig: 'Ja: f_cm = 41 ≥ 37 + 4 und f_ci,min = 39 ≥ 37 − 4' });
  const e = k([30, 32, 37], 30);
  pruefe(!e.mittelOk && e.einzelOk, 'qn_px_produktion_2: Kern-Einstufung abweichend');
  PRUEFUNGEN.push({ id: 'qn_px_produktion_2', richtig: `Nicht erfüllt: f_cm = ${z(e.mittelwert, 1)} < 34 N/mm², Einzelwerte ausreichend` });
  const lab = (fck: number) => k([33.5, 35.0, 31.0], fck).bestanden;
  pruefe(lab(25) && !lab(30), 'qn_labor_druckfestigkeit_4: Einstufung C20/25 laut Kern abweichend');
  PRUEFUNGEN.push({ id: 'qn_labor_druckfestigkeit_4', richtig: 'C20/25', frage: [`(Mittel ${z(k([33.5, 35.0, 31.0], 25).mittelwert, 1)} MPa)`] });
  // stetige Herstellung: σ = max(σ_Vorserie; 3,0)
  const q1 = konformitaetDruck({ werte: Array.from({ length: 15 }, () => 42), fckCube: 37, pruefArt: 'stetig', sigmaVorserie: 2.2 });
  PRUEFUNGEN.push({ id: 'q_qsi_1', richtig: `${z(q1.sollMittelwert, 1)} N/mm²`, erklaerung: [`σ = max(2,2; ${z(q1.sigmaAngesetzt, 1)})`] });
  const f3 = konformitaetDruck({ werte: [34.5, ...Array.from({ length: 14 }, () => (15 * 42.0 - 34.5) / 14)], fckCube: 37, pruefArt: 'stetig', sigmaVorserie: 4.5 });
  pruefe(!f3.mittelOk && f3.einzelOk && nahe(f3.mittelwert, 42.0, 1e-9), 'qn_festbeton_statistik_3: Kern-Einstufung abweichend');
  PRUEFUNGEN.push({ id: 'qn_festbeton_statistik_3', richtig: `Nicht konform, weil 42,0 N/mm² unter f_ck + 1,48 · σ = ${z(f3.sollMittelwert, 1)} N/mm² liegt` });
}
{
  // Holzbau (src/calc/holzbau.ts): f_d = k_mod·f_k/γ_M, k_c (Ersatzstab), f_c,α,d, Abbrand d_ef = β_n·t + k₀·d₀
  const fc0d = bemessungswert(21, 0.9, 1.3);
  PRUEFUNGEN.push({ id: 'qn_rechnung_holzbau_1', richtig: `f_c,0,d = ${z(fc0d, 2)} N/mm²` });
  PRUEFUNGEN.push({ id: 'qn_holzbau_bemessung_2', richtig: `${z(bemessungswert(24, 0.9, 1.3), 1)} N/mm²` });
  PRUEFUNGEN.push({ id: 'q_hol_3', richtig: `ca. ${z(bemessungswert(24, 0.8, 1.3), 1)} N/mm²`, erklaerung: [`${z(bemessungswert(24, 0.8, 1.25), 1)} N/mm² ergäbe sich mit γ_M = 1,25`] });
  const lam = (L_mm: number, b_mm: number) => L_mm / (b_mm / Math.sqrt(12));
  const lrel = (l: number, fc0k = 21, e005 = 7400) => (l / Math.PI) * Math.sqrt(fc0k / e005);
  const l14 = lam(3000, 140);
  PRUEFUNGEN.push({ id: 'qn_rechnung_holzbau_2', richtig: `λ = ${z(l14, 1)}` });
  PRUEFUNGEN.push({ id: 'qn_rechnung_holzbau_3', richtig: `λ_rel = ${z(lrel(l14), 2)}`, erklaerung: [`= ${z(lrel(l14), 3)}`] });
  const kc14 = knickbeiwert(lrel(l14), false);
  PRUEFUNGEN.push({ id: 'qn_rechnung_holzbau_4', richtig: `k_c = ${z(knickbeiwert(1.259, false), 3)}` });
  PRUEFUNGEN.push({ id: 'qn_rechnung_holzbau_5', richtig: `η = ${z(65000 / 19600 / (kc14 * fc0d), 2)}` });
  const eta = (b: number, L: number, fc0k = 21, e005 = 7400) => 90000 / (b * b) / (knickbeiwert(lrel(lam(L, b), fc0k, e005), false) * bemessungswert(fc0k, 0.9, 1.3));
  pruefe(eta(120, 1750) < eta(140, 3500) && eta(140, 3500) < eta(120, 3500, 24, 8000), 'qn_rechnung_holzbau_6: Reihenfolge der Maßnahmen laut Kern abweichend');
  PRUEFUNGEN.push({
    id: 'qn_rechnung_holzbau_6', richtig: `Halterung in halber Höhe, s_k = 1,75 m (η ≈ ${z(eta(120, 1750), 2)})`,
    optionen: [`Wechsel auf C30 bei gleichem Querschnitt (η ≈ ${z(eta(120, 3500, 24, 8000), 2)})`, `Querschnitt auf 14 × 14 cm vergrößern (η ≈ ${z(eta(140, 3500), 2)})`,
      `Halterung in halber Höhe, s_k = 1,75 m (η ≈ ${z(eta(120, 1750), 2)})`, 'k_mod von 0,9 auf 1,1 anheben, da die Last kurz wirkt'],
    frage: [`η = ${z(eta(120, 3500), 2)}`],
  });
  const l12 = lrel(lam(2600, 120));
  PRUEFUNGEN.push({ id: 'qn_holzbau_bemessung_4', richtig: z(l12, 2) });
  PRUEFUNGEN.push({ id: 'qn_holzbau_bemessung_5', richtig: `rund ${z((knickbeiwert(1.27, false) * 19200 * bemessungswert(21, 0.8, 1.3)) / 1000, 0)} kN`, frage: [`k_c,z ≈ ${z(knickbeiwert(l12, false), 2)}`] });
  PRUEFUNGEN.push({ id: 'qn_holz_2', richtig: `ca. ${z(druckUnterWinkel(bemessungswert(21, 0.8, 1.3), bemessungswert(2.5, 0.8, 1.3), 1.0, 30), 1)} N/mm²` });
  const ab = (art: 'nadel' | 'bsh' | 'laub', t: number, b: number, h: number) => abbrandQuerschnitt(art, t, b, h, 3);
  PRUEFUNGEN.push({ id: 'qn_holzbau_bauphysik_2', richtig: `${z(ab('bsh', 60, 160, 400).d_ef, 0)} mm` });
  PRUEFUNGEN.push({ id: 'qn_rechnung_brandschutz_1', richtig: `d_ef = ${z(ab('bsh', 60, 160, 400).d_ef, 1)} mm` });
  PRUEFUNGEN.push({ id: 'q_bs_2', richtig: `${z(ab('bsh', 60, 160, 400).d_ef, 0)} mm` });
  const r1 = ab('bsh', 60, 160, 400), r2 = ab('bsh', 60, 180, 360);
  PRUEFUNGEN.push({ id: 'qn_holzbau_bauphysik_3', richtig: `${z(r1.b_fi, 0)} × ${z(r1.h_fi, 0)} mm` });
  PRUEFUNGEN.push({ id: 'qn_rechnung_brandschutz_2', richtig: `${z(r2.b_fi, 0)} × ${z(r2.h_fi, 0)} mm` });
  PRUEFUNGEN.push({ id: 'qn_rechnung_brandschutz_4', richtig: `Nadelvollholz ${z(ab('nadel', 90, 200, 400).d_ef, 1)} mm; BSH ${z(ab('bsh', 90, 200, 400).d_ef, 1)} mm; Laubholz ${z(ab('laub', 90, 200, 400).d_ef, 1)} mm` });
  PRUEFUNGEN.push({ id: 'q_hbx_2', richtig: `${z(ab('nadel', 30, 200, 400).d_ef, 0)} mm` });
}
{
  // Stahlbau EC3 (src/calc/stahlbau.ts): Biegeknicken HEB 200 (A = 78,1 cm², i_z = 5,07 cm, Linie c), Zugstab, M_pl,Rd
  const k3 = biegeknicken(78.1, 5.07, 235, 3, 'c'), k6 = biegeknicken(78.1, 5.07, 235, 6, 'c'), k4 = biegeknicken(78.1, 5.07, 235, 4, 'c');
  pruefe(z((k6.NbRd / k3.NbRd) * 100, 0) === '53', 'qn_stahlbau_ec3_7: Verhältnis N_b,Rd(6 m)/N_b,Rd(3 m) laut Kern nicht ≈ 53 %');
  PRUEFUNGEN.push({
    id: 'qn_stahlbau_ec3_7', richtig: 'Er sinkt auf etwa 53 % des Ausgangswerts.',
    erklaerung: [`${z(Math.round(k3.NbRd / 10) * 10, 0)} kN (λ̄_z = ${z(k3.lambdaQuer, 2)}; χ = ${z(k3.chi, 3)})`, `${z(k6.NbRd, 0)} kN (λ̄_z = ${z(k6.lambdaQuer, 2)}; χ = ${z(k6.chi, 3)})`],
  });
  PRUEFUNGEN.push({ id: 'qn_stahlbau_ec3_4', richtig: z(k4.lambdaQuer, 2) });
  const zs = bemesseZugstab({ A: 10, Anet: 8.2, guete: 'S235', nEd: 100 });
  pruefe(zs.nettoMassgebend, 'qn_stahlbau_ec3_3: Nettoquerschnitt laut Kern nicht maßgebend');
  PRUEFUNGEN.push({ id: 'qn_stahlbau_ec3_3', richtig: `${z(zs.NuRd, 1)} kN`, erklaerung: [`N_pl,Rd = ${z(zs.NplRd, 1)} kN`] });
  const mpl = plastischeKapazitaet(642.5, 78.1, 235).MplRd;
  PRUEFUNGEN.push({ id: 'qn_stahl_1', richtig: `M_pl,Rd ≈ ${z(mpl, 0)} kNm; η ≈ ${z(130 / mpl, 2)}` });
}
{
  // Boden und Erdbau (src/calc/boden.ts, erdbau.ts)
  const zg = (w: number, wL: number, wP: number) => zustandsgrenzen(w, wL, wP);
  const b1 = zg(25, 45, 20), b2 = zg(32, 48, 22), b3 = zg(30, 42, 22);
  PRUEFUNGEN.push({ id: 'q_boden_1', richtig: `${b1.zustand} (I_C = ${z(b1.iC, 2)})` });
  PRUEFUNGEN.push({ id: 'qn_bodenmechanik_1', richtig: `I_C ≈ ${z(b2.iC, 2)} – ${b2.zustand}` });
  PRUEFUNGEN.push({ id: 'qz24_atterberg_3', richtig: `I_C = ${z(b3.iC, 2)} – ${b3.zustand}` });
  const mc = mohrCoulomb(0, 30, 160, 50);
  pruefe(mc.isFailing, 'qn_bodenmechanik_2: Kern meldet keinen Bruchzustand');
  PRUEFUNGEN.push({ id: 'qn_bodenmechanik_2', richtig: `Ja, weil der Kreis mit r = ${z(mc.radius, 0)} kPa die Bruchgerade schneidet`, erklaerung: [`r = m · sin φ = ${z(mc.center * Math.sin(Math.PI / 6), 1)} kPa`] });
  PRUEFUNGEN.push({ id: 'qn_bodenmechanik_3', richtig: `E_a ≈ ${z(erddruckRankine(35, 19, 4).E_a, 1)} kN/m`, erklaerung: [`K_a = tan²(45° − 17,5°) = ${z(erddruckRankine(35, 19, 4).k_a, 3)}`] });
  PRUEFUNGEN.push({ id: 'qz24_atterberg_2', richtig: `etwa ${z(fliessgrenze([{ schlaege: 22, w: 42.6 }]).wL, 1)} %` });
  const bg = bodengruppePlastizitaet(45, 12);
  pruefe(bg.kuerzel === 'UM', 'qz24_atterberg_4: Kern ordnet nicht UM zu');
  PRUEFUNGEN.push({ id: 'qz24_atterberg_4', richtig: `UM, weil I_P unter der A-Linie (${z(bg.aLinie, 1)} %) liegt` });
  const fs = (frostzone: number, wasser: 'guenstig' | 'unguenstig') => frostschutz({ frostzone, bauklasse: 'BK1', bodengruppe: 'F3', wasser }).gesamtDicke;
  PRUEFUNGEN.push({ id: 'qn_bp_verkehr_rsto_3', richtig: `${fs(2, 'guenstig')} cm` });
  PRUEFUNGEN.push({ id: 'qn_erdbau_2', richtig: `${fs(3, 'unguenstig')} cm` });
  const gr = bodengruppe({ feinanteil: 10, kiesanteil: 30, sandanteil: 70, organik: 'keine', plastizitaet: 'nicht' });
  pruefe(gr.gruppe.replace(/ /g, '') === 'SU/ST' && gr.frost === 'F2', 'qn_erdbau_3: Kern ordnet nicht SU/ST (F2) zu');
  PRUEFUNGEN.push({ id: 'qn_erdbau_3', richtig: `SU/ST – Sand-Schluff-/Sand-Ton-Gemisch (${gr.frost})` });
}
{
  // Korrosion und Karbonatisierung (src/calc/korrosion.ts, schnellkarbonatisierung.ts)
  const r = abtragsrateFaraday(1);
  PRUEFUNGEN.push({ id: 'q_ko_2', richtig: `${z(r, 1)} µm/a` });
  PRUEFUNGEN.push({ id: 'qn_korrosion_3', richtig: `rund ${z(querschnittsverlust(16, 2 * 11.6, 15).verlust * 100, 1)} %` });
  PRUEFUNGEN.push({ id: 'qn_korrosion_2', richtig: `rund ${z(chloridGehalt(40, 50, 0.5, 2.5, 0), 2)} M.-% v. z.` });
  const kf = karbonatisierungsFront(4.0, 50, 25);
  pruefe(kf.depassiviert, 'qn_bauchemie_1: Front müsste die Bewehrung erreicht haben');
  PRUEFUNGEN.push({ id: 'qn_bauchemie_1', richtig: `d_k ≈ ${z(kf.xc, 0)} mm; die Front hat die Bewehrung erreicht` });
  PRUEFUNGEN.push({ id: 'qn_rechnung_nachhaltigkeit_1', richtig: `d_k ≈ ${z(kf.xc, 1)} mm` });
  PRUEFUNGEN.push({ id: 'qn_rechnung_nachhaltigkeit_2', richtig: `nach rund ${z(karbonatisierungsFront(4.0, 50, 30).tDeckung, 0)} Jahren` });
  PRUEFUNGEN.push({ id: 'q_bch_1', richtig: `${z(karbonatisierungsFront(4, 50, 40).tDeckung, 0)} Jahre` });
  PRUEFUNGEN.push({ id: 'qn_dauerhaftigkeit_2', richtig: `nach ${z(karbonatisierungsFront(5.0, 50, 30).tDeckung, 0)} Jahren` });
  PRUEFUNGEN.push({ id: 'qn_schnellkarbonatisierung_5', richtig: `nach etwa ${z(karbonatisierungsFront(3.0, 50, 30).tDeckung, 0)} Jahren` });
  PRUEFUNGEN.push({ id: 'qn_korrosion_1', richtig: `rund ${z(schnellUmrechnung(2.0, 2.0, 0.04).kNat / Math.sqrt(365), 2)} mm/√d` }); // Kern liefert mm/√a
  const reg = wurzelZeitRegression([{ tTage: 7, xMm: 2.0 }, { tTage: 28, xMm: 4.0 }, { tTage: 70, xMm: 6.3 }], false);
  PRUEFUNGEN.push({ id: 'qn_schnellkarbonatisierung_3', richtig: `etwa ${z(reg.k, 2)} mm/√d`, erklaerung: [`= ${z(reg.k, 3)} mm/√d`] });
}
{
  // Weitere Kerne: LCC, Zwang, Spannungszustand, Fe-C, Werkstoffmodelle, Carbonbeton, Biegelinie
  PRUEFUNGEN.push({ id: 'q_lk_1', richtig: `${z(Math.round((2000 * rentenbarwertfaktor(0.02, 30)) / 100) * 100, 0)} €`, erklaerung: [`= ${z(rentenbarwertfaktor(0.02, 30), 2)}`] });
  const zw = (deltaT: number, epsCsPromille: number, eModul: number, festhaltungProzent: number) => zwangSpannung({ deltaT, epsCsPromille, eModul, festhaltungProzent, fct: 3 }).sigma;
  PRUEFUNGEN.push({ id: 'qn_zwang_1', richtig: `${z(zw(20, 0, 30000, 50), 1)} N/mm²`, erklaerung: [`${z(zw(20, 0, 30000, 100), 1)} N/mm² bei voller Festhaltung`] });
  PRUEFUNGEN.push({ id: 'qn_zwang_5', richtig: `${z(zw(0, 0.3, 15000, 100), 1)} N/mm²` });
  const h1 = hauptspannungen({ sx: 120, sy: -40, txy: 60 }), h4 = hauptspannungen({ sx: 0, sy: 0, txy: 50 });
  PRUEFUNGEN.push({ id: 'qn_festigkeit_mohr_1', richtig: `σ₁ = ${zm(h1.sigma1, 0)} N/mm², σ₂ = ${zm(h1.sigma2, 0)} N/mm²` });
  pruefe(h4.sigma1 === 50 && h4.sigma2 === -50, 'qn_festigkeit_mohr_4: reiner Schub laut Kern nicht ±50 N/mm²');
  PRUEFUNGEN.push({ id: 'qn_festigkeit_mohr_4', richtig: `±${z(h4.sigma1, 0)} N/mm² unter 45° zur x-Achse` });
  const vmA = vonMises({ sx: 200, sy: 200, txy: 0 }), vmB = vonMises({ sx: 200, sy: -200, txy: 0 });
  pruefe(vmB > vmA, 'qn_festigkeit_mohr_5: Zustand B müsste ungünstiger sein');
  PRUEFUNGEN.push({ id: 'qn_festigkeit_mohr_5', richtig: `B, weil Zug und Druck zusammenwirken (σ_v ≈ ${z(vmB, 0)} N/mm²)`, erklaerung: [`= ${z(vmA, 0)} N/mm², B ergibt`] });
  const g1 = gefuegeAnteile(0.45), g3 = gefuegeAnteile(1.2);
  PRUEFUNGEN.push({ id: 'qn_stahl_fec_1', richtig: `Perlit ≈ ${z(g1.perlit * 100, 0)} %, Ferrit ≈ ${z(g1.ferrit * 100, 0)} %` });
  PRUEFUNGEN.push({ id: 'qn_stahl_fec_3', richtig: `Fe₃C II ≈ ${z(g3.sekundaerzementit * 100, 1)} %, Perlit ≈ ${z(g3.perlit * 100, 1)} %` });
  PRUEFUNGEN.push({ id: 'qn_stahl_fec_4', richtig: `CEV = ${z(cev({ C: 0.16, Mn: 1.2, Cr: 0.10, Ni: 0.30 }), 2)} %` });
  PRUEFUNGEN.push({ id: 'qn_materialmodelle_1', richtig: `ε_p ≈ ${z(bilinearVerfestigung({ fy: 500, E: 200000, Et: 1600, epsMaxPromille: 30 }).epsPlastischPromille, 1)} ‰` });
  PRUEFUNGEN.push({ id: 'q_matm_2', richtig: `${z(binghamScherrate(800, 500, 50), 0)} s⁻¹` });
  PRUEFUNGEN.push({ id: 'qn_materialmodelle_2', richtig: `σ ≈ ${z(maxwellSpannung(20, 10, 5), 2)} MPa` });
  PRUEFUNGEN.push({ id: 'q_sta_2', richtig: z(abminderungStahlBrand(600).ky, 2), erklaerung: [`500 °C ${z(abminderungStahlBrand(500).ky, 2)}`, `700 °C ${z(abminderungStahlBrand(700).ky, 2)}`] });
  // Carbonbeton (Umsetzung 02.11.2026): Fragen an den Modulrechner angeglichen – Kernwert mit Dehnungskontrolle
  // (E_tex = 200 GPa, ε_cu3 = 3,5 ‰); in allen drei Fällen versagt der Beton vor dem Textil.
  const cbE = (h: number, aTex: number, fTk: number, fCk: number) => carbonbetonBiegung({ h, c: 10, aTex, fTk, eTexGPa: 200, fCk });
  const cb = (h: number, aTex: number, fTk: number, fCk: number) => cbE(h, aTex, fTk, fCk).mRd;
  const cb1 = cbE(30, 80, 3000, 45);
  pruefe(cb1.versagen === 'beton' && cbE(40, 200, 2500, 50).versagen === 'beton', 'qn_carbonbeton: Betonversagen laut Kern erwartet');
  PRUEFUNGEN.push({ id: 'qn_carbonbeton_1', richtig: `rund ${z(cb1.mRd, 1)} kNm/m`, frage: ['E_tex = 200 GPa'],
    optionen: [`rund ${z((80 * cb1.fTd * cb1.d) / 1e6, 1)} kNm/m`, `rund ${z(cb1.mRdOhneDehnungskontrolle, 1)} kNm/m`, `rund ${z((80 * cb1.sigmaTex * cb1.d) / 1e6, 1)} kNm/m`, `rund ${z(cb1.mRd, 1)} kNm/m`],
    erklaerung: [`σ_tex ≈ ${z(Math.round(cb1.sigmaTex), 0)} N/mm²`, `z = 20 − ${z(cb1.y / 2, 1)} = ${z(cb1.z, 1)} mm`] });
  PRUEFUNGEN.push({ id: 'qn_carbonbeton_2', richtig: 'Die Druckzone y wächst mit, der Hebelarm z = d − y/2 wird kleiner', frage: [`von rund ${z(cb(40, 100, 2500, 50), 1)} auf rund ${z(cb(40, 200, 2500, 50), 1)} kNm/m`] });
  PRUEFUNGEN.push({ id: 'qn_formaenderungen_bl_1', richtig: `w ≈ ${z(einfeldQ(2, 4, 10, 10000).w * 1000, 2)} mm` });
  const kr = kragF(2, 12, 2, 4000);
  PRUEFUNGEN.push({ id: 'qn_formaenderungen_bl_2', richtig: `w = ${z(kr.w * 1000, 1)} mm; φ = ${z(kr.phi * 1000, 1)} mrad` });
}

// ------------------------------------------------------------------------------------------------
// Lernziel-Abdeckung 03.11.2026: neue Rechenfragen (qlz_*) gegen die Kerne
// ------------------------------------------------------------------------------------------------
{
  const b = bemesseBiegung({ b: 25, h: 60, d1: 5, d2: 5, med: 180, fck: 25, bewehrung: 'Stahl', fyk: 500, ftk: 0, gammaFRP: 1.3 });
  pruefe(nahe(b.mu_Ed, 0.168, 0.005) && nahe(b.omega, 0.185, 0.005), `qlz_stahlbeton_1: μ = ${b.mu_Ed}, ω = ${b.omega}`);
  PRUEFUNGEN.push({ id: 'qlz_stahlbeton_1', richtig: `A_s1 ≈ ${z(b.as1_req, 1)} cm²`, erklaerung: [z(b.mu_Ed, 3), z(b.omega, 3)] });
  const m = mauermoertelNormalfuge({ flaeche: 20, wanddicke: '24.0', format: 'nf' });
  PRUEFUNGEN.push({ id: 'qlz_putzemoertel_1', richtig: `${z(m.liter!, 0)} l → ${z(m.masse, 0)} kg → ${m.saecke} Säcke`, frage: [z(TROCKENMOERTEL_KG_JE_L, 2)] });
  const p = pn98Probenzahl(250);
  PRUEFUNGEN.push({ id: 'qlz_abfaelle_1', richtig: `${p.einzelproben} Einzel-, ${p.mischproben} Misch-, ${p.laborproben} Laborproben; Einzelprobe mindestens 5 l` });
  const h = huellwerte(NORMATIVE_EXPOSURE_CLASSES, ['XC4', 'XD1', 'XF1'], 32, 15)!;
  PRUEFUNGEN.push({ id: 'qlz_expositionsklassen_1', richtig: `(w/z)_eq ≤ ${z(h.minWzEq!, 2)}, z ≥ ${h.maxCement} kg/m³, mindestens ${h.highestClass}` });
}

// ------------------------------------------------------------------------------------------------
// Auswertung
// ------------------------------------------------------------------------------------------------
const byId = new Map(QUIZ_QUESTIONS.map(q => [q.id, q]));
for (const p of PRUEFUNGEN) {
  const q = byId.get(p.id);
  if (!q) { fehler.push(`${p.id}: Frage nicht gefunden`); continue; }
  pruefe(q.options[q.correctIdx] === p.richtig, `${p.id}: richtige Option „${q.options[q.correctIdx]}“, Kern ergibt „${p.richtig}“`);
  if (p.optionen) pruefe(JSON.stringify(q.options) === JSON.stringify(p.optionen), `${p.id}: Optionen ${JSON.stringify(q.options)} ≠ Kern ${JSON.stringify(p.optionen)}`);
  for (const s of p.frage ?? []) pruefe(q.question.includes(s), `${p.id}: Frage enthält „${s}“ nicht`);
  for (const s of p.erklaerung ?? []) pruefe(q.explanation.includes(s), `${p.id}: Erklärung enthält „${s}“ nicht`);
}
const geprueft = new Set(PRUEFUNGEN.map(p => p.id));
for (const q of QUIZ_QUESTIONS) {
  if (VOLL_ABGEDECKT.has(q.moduleId)) {
    pruefe(geprueft.has(q.id) || !!OHNE_RECHNUNG[q.id], `${q.id}: Frage im Modul ${q.moduleId} ohne Kernprüfung – Eintrag in PRUEFUNGEN oder OHNE_RECHNUNG ergänzen`);
  }
}

if (fehler.length) { fehler.forEach(f => console.log('FAIL', f)); process.exit(1); }
console.log(`OK: ${PRUEFUNGEN.length} Rechenfragen gegen Kerne geprüft (${[...VOLL_ABGEDECKT].join(', ')})`);
