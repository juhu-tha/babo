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
