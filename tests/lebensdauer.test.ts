// Rechenkern probabilistische Lebensdauerbemessung (fib Bulletin 34, Gehlen): Verteilungen, Modelle, Monte-Carlo
import {
  zufallsgenerator, standardNormal, ziehe, betaFormparameter, lognormalParameter, erf, erfc, phi, phiInvers, betaAusPf, pfAusBeta, erfInvers,
  keFeuchte, kcNachbehandlung, wetterExponent, wetterfunktion, karbonatisierungsrate, karbonatisierungstiefe, rInvAusAcc, rInvAusKac,
  keTemperatur, alterungsfaktor, chloridgehalt, kritischeTiefe, lebensdauerbemessung, mittelwertrechnung, rInvStreuung,
  R_EINHEIT_MM2_A, D_EINHEIT_MM2_A, FIB_KARBONATISIERUNG as K, FIB_CHLORID as C,
  type LebensdauerEingabe, type KarbonatisierungsModell, type ChloridModell, type Verteilung,
} from '../src/calc/lebensdauer';
import { chloridGehalt } from '../src/calc/korrosion';
import inhalt from '../content/lebensdauerbemessung/Lebensdauerbemessung.json';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (ist: number, soll: number, tol: number) => Math.abs(ist - soll) <= tol;
console.log('--- Test: Lebensdauerbemessung ---');

// 1. Mathematische Hilfsfunktionen (Tabellenwerte der Normalverteilung, z. B. DIN EN 1990, Tab. C.1)
pruefe(nahe(erf(0.5), 0.5204998778, 2e-7) && nahe(erf(1), 0.8427007929, 2e-7) && nahe(erf(-1), -0.8427007929, 2e-7) && erf(0) === 1 - erfc(0), 'erf');
pruefe(nahe(erfc(2.406), 0.00066748454, 1e-10) && nahe(erfc(-1), 1.8427007929, 2e-7), `erfc(2,406) ${erfc(2.406)}`);
pruefe(nahe(phi(1.645), 0.950015, 1e-6) && nahe(phi(0), 0.5, 1e-6), 'Φ');
pruefe(nahe(betaAusPf(0.1), 1.2816, 1e-4) && nahe(betaAusPf(7.2e-5), 3.8, 0.002) && nahe(pfAusBeta(1.3), 0.0968, 1e-4), `β(p_f) ${betaAusPf(0.1)}`);
pruefe(nahe(phiInvers(0.975), 1.95996, 1e-5) && nahe(phiInvers(1e-6), -4.7534, 1e-4) && phiInvers(0) === -Infinity, 'Φ⁻¹');
pruefe(nahe(erf(erfInvers(0.3)), 0.3, 1e-6), 'erf⁻¹');

// 2. Zufallszahlen und Verteilungen: Startwert reproduzierbar, Momente der Stichprobe
{
  const a = zufallsgenerator(42), b = zufallsgenerator(42);
  const fa = Array.from({ length: 5 }, a), fb = Array.from({ length: 5 }, b);
  pruefe(fa.join() === fb.join() && fa.every(x => x > 0 && x < 1), 'gleicher Startwert → gleiche Folge');
  const moment = (v: Verteilung, n = 40000) => {
    const u = zufallsgenerator(7); const x = Array.from({ length: n }, () => ziehe(v, u));
    const m = x.reduce((s, y) => s + y, 0) / n; const s = Math.sqrt(x.reduce((q, y) => q + (y - m) ** 2, 0) / (n - 1));
    return { m, s, min: Math.min(...x), max: Math.max(...x) };
  };
  const nv = moment({ typ: 'normal', m: 10, s: 2 });
  pruefe(nahe(nv.m, 10, 0.05) && nahe(nv.s, 2, 0.05), `Normal ${JSON.stringify(nv)}`);
  const ln = moment({ typ: 'lognormal', m: 3, s: 1.5 });
  pruefe(nahe(ln.m, 3, 0.05) && nahe(ln.s, 1.5, 0.06) && ln.min > 0, `Lognormal ${JSON.stringify(ln)}`);
  const be = moment(C.cCrit);
  pruefe(nahe(be.m, 0.6, 0.005) && nahe(be.s, 0.15, 0.005) && be.min >= 0.2 && be.max <= 2, `Beta C_crit ${JSON.stringify(be)}`);
  const dx = moment(C.dxSpritz);
  pruefe(nahe(dx.m, 8.9, 0.15) && nahe(dx.s, 5.6, 0.15) && dx.min >= 0 && dx.max <= 50, `Beta Δx ${JSON.stringify(dx)}`);
  // Beta-Formparameter von Hand: C_crit μ' = 0,4/1,8 = 0,2222, σ' = 0,0833 → k = 0,2222·0,7778/0,006944 − 1 = 23,89
  const p = betaFormparameter(0.6, 0.15, 0.2, 2)!;
  pruefe(nahe(p.alpha, 5.309, 0.002) && nahe(p.beta, 18.58, 0.01), `Beta-Parameter ${JSON.stringify(p)}`);
  pruefe(betaFormparameter(0.5, 0.6, 0, 1) === null && betaFormparameter(0, 0.1, 0, 1) === null, 'unmögliche Beta-Parameter');
  const lp = lognormalParameter(3, 1.5);
  pruefe(nahe(lp.zeta, Math.sqrt(Math.log(1.25)), 1e-12), 'Lognormal ζ');
  const u = zufallsgenerator(3); let s = 0; for (let i = 0; i < 20000; i++) s += standardNormal(u);
  pruefe(Math.abs(s / 20000) < 0.03, 'Standardnormal Mittelwert 0');
  pruefe(ziehe({ typ: 'konstant', m: 4 }, u) === 4 && ziehe({ typ: 'normal', m: 4, s: 0 }, u) === 4, 'konstant / s = 0');
}

// 3. Teilfunktionen Karbonatisierung (fib 34; Werte: Prabowo/Hilmy 2018, Carević/Ignjatović 2022)
pruefe(nahe(keFeuchte(65), 1, 1e-12) && keFeuchte(80) < 1 && keFeuchte(50) > 1 && nahe(keFeuchte(100), 0, 1e-12), 'k_e(RH)');
//   Handrechnung RH = 80 %: (1 − 0,8⁵)/(1 − 0,65⁵) = 0,67232/0,88397 = 0,76057; ^2,5 = 0,50448
pruefe(nahe(keFeuchte(80), 0.50448, 1e-4), `k_e(80) ${keFeuchte(80)}`);
pruefe(nahe(kcNachbehandlung(7, -0.567), 1, 1e-12) && nahe(kcNachbehandlung(1, -0.567), 3.0142, 1e-4), 'k_c');
pruefe(wetterExponent(0, 0.3, 0.446) === 0 && wetterExponent(1, 0.3, -0.2) > 0 && wetterfunktion(0.05, 0.3) === 1, 'W(t) Randfälle');
pruefe(nahe(wetterExponent(1, 0.3, 0.446), 0.3 ** 0.446 / 2, 1e-12) && nahe(wetterfunktion(50, 0.29226), (0.0767 / 50) ** 0.29226, 1e-12), 'W(t)');
pruefe(nahe(R_EINHEIT_MM2_A, 315.36, 1e-9) && nahe(D_EINHEIT_MM2_A, 31.536, 1e-9), 'Einheitenumrechnung');
pruefe(nahe(K.epsT.m * R_EINHEIT_MM2_A, 315.5, 0.2), 'ε_t ≙ 315,5 (mm²/a)/(kg/m³)');
//   ACC-Test: x_c = 5 mm → R⁻¹ = (0,005/420)² = 1,4172·10⁻¹⁰ = 14,17·10⁻¹¹; Kontrolle τ: √(2·0,0368·28 d·86 400) ≈ 422
pruefe(nahe(rInvAusAcc(5), 14.1723, 1e-3), `R⁻¹(5 mm) ${rInvAusAcc(5)}`);
pruefe(nahe(rInvAusKac(Math.sqrt(2 * 0.03 * 1.84 * 1e-11 * 10) * 1000 * Math.sqrt(86400), 3), 10, 1e-9), 'R⁻¹ aus K_AC (Rückrechnung)');
pruefe(nahe(rInvStreuung(1), 0.69, 1e-12) && nahe(rInvStreuung(14.1723), 5.4572, 1e-3), 'Streuung R⁻¹');
//   Beispiel 1 (content, Mittelwerte): √(2·1·1·(1,25·4.469,4 + 315,36)·0,00082) = 3,1112 mm/√a; x(50) = 22,00 mm
const rate = karbonatisierungsrate(1, 1, 1.25, rInvAusAcc(5) * R_EINHEIT_MM2_A, R_EINHEIT_MM2_A, 0.00082);
pruefe(nahe(rate, 3.1112, 1e-4) && nahe(karbonatisierungstiefe(rate, 50, 0), 22.0, 0.01), `Rate ${rate}`);
pruefe(karbonatisierungsrate(1, 1, 1.25, -1e6, 0, 0.00082) === 0, 'negativer Radikand → 0');

// 4. Chlorid: Teilfunktionen und Abgleich mit dem deterministischen Kern des Moduls Bewehrungskorrosion
pruefe(nahe(keTemperatur(293, 4800), 1, 1e-12) && nahe(keTemperatur(283.15, 4800), 0.56559, 1e-4), `k_e(T) ${keTemperatur(283.15, 4800)}`);
pruefe(nahe(alterungsfaktor(50, 0.45), 0.054153, 1e-5) && alterungsfaktor(0.05, 0.45) === 1, 'A(t)');
//   Korrosion.json, Rechenbeispiel 1: C_s = 3,0, D = 0,3·10⁻¹² m²/s, x = 45 mm, t = 50 a → gleicher Wert (a = 0, C₀ = 0, Δx = 0)
{
  const ref = chloridGehalt(45, 50, 0.3, 3.0, 0);
  const neu = chloridgehalt(45, 50, 0, 3.0, 0, 0.3 * D_EINHEIT_MM2_A);
  pruefe(nahe(neu, ref, 2e-6), `Abgleich Korrosionsmodul ${neu} vs ${ref}`);
  pruefe(nahe(neu, 3.0 * (1 - erf(45 / (2 * Math.sqrt(0.3 * 31.536 * 50)))), 1e-9), 'Fick-Lösung');
}
pruefe(nahe(chloridgehalt(5, 50, 0.1, 3, 8.9, 2), 3, 1e-6) && chloridgehalt(55, 0, 0.1, 3, 8.9, 2) === 0.1, 'C für x ≤ Δx bzw. t = 0');
{ const x = kritischeTiefe(50, 0.1, 3, 8.9, 1.835, 0.6); pruefe(nahe(chloridgehalt(x, 50, 0.1, 3, 8.9, 1.835), 0.6, 1e-6), `kritische Tiefe ${x}`); }

// 5. Modelle für die Simulation (Beispiele 1 und 2 im Modul)
const rh: Verteilung = { typ: 'beta', m: 65, s: 10, a: 40, b: 100 };
const rx = rInvAusAcc(5);
const karb = (o: Partial<KarbonatisierungsModell> = {}): KarbonatisierungsModell => ({
  deckung: { typ: 'normal', m: 35, s: 8 }, rh, tc: 7, bc: K.bc, kt: K.kt, rInv: { typ: 'normal', m: rx, s: rInvStreuung(rx) },
  epsT: K.epsT, cS: K.cSatm, pSR: 0, tow: 0, bw: K.bw, ...o,
});
const chl = (o: Partial<ChloridModell> = {}): ChloridModell => ({
  deckung: { typ: 'normal', m: 55, s: 8 }, cCrit: C.cCrit, c0: 0.1, cS: { typ: 'lognormal', m: 3.0, s: 1.5 }, dx: C.dxSpritz,
  dRcm: { typ: 'normal', m: 1.9, s: 0.38 }, a: C.alterung.huettensand, be: C.be, tReal: { typ: 'normal', m: 10, s: 5 }, kt: 1, ...o,
});
const ein = (o: Partial<LebensdauerEingabe> = {}): LebensdauerEingabe => ({
  mechanismus: 'karbonatisierung', karbonatisierung: karb(), chlorid: chl(), nutzungsdauer: 50, betaZiel: 1.3, laeufe: 20000, startwert: 1, ...o,
});

// 5a. Beispiel 1 (content/lebensdauerbemessung, „Lebensdauerbemessung.beispiel1“): Zahlen im Rechenweg = Kern
{
  const e = lebensdauerbemessung(ein());
  pruefe(e.gueltig && e.hinweise.length === 0, `Bsp. 1 gültig ohne Hinweise (${e.hinweise.map(h => h.text).join(' | ')})`);
  pruefe(nahe(e.pf, 0.0765, 0.0005) && nahe(e.beta, 1.43, 0.005) && e.nachweis, `Bsp. 1 p_f ${e.pf} β ${e.beta}`);
  pruefe(e.erfDeckung !== null && nahe(e.erfDeckung, 33.6, 0.05) && e.lebensdauer === 56, `Bsp. 1 erf c ${e.erfDeckung}, L ${e.lebensdauer}`);
  pruefe(nahe(e.mittelwerte.kennwert, 3.11, 0.005) && nahe(e.mittelwerte.einwirkung, 22.0, 0.05) && nahe(e.mittelwerte.vergleich, 127, 0.5), 'Bsp. 1 Mittelwerte');
  const text = JSON.stringify(inhalt.daten['Lebensdauerbemessung.beispiel1']);
  for (const z of ['14{,}17', '3{,}11', '22{,}0', '127', '7{,}6', '1{,}43', '33{,}6', '56']) pruefe(text.includes(z), `Bsp. 1 im Inhalt: ${z}`);
  // Reproduzierbarkeit und Konvergenz: gleicher Startwert → identisch; anderer Startwert → innerhalb 3 Standardfehler
  const f = lebensdauerbemessung(ein());
  pruefe(f.pf === e.pf && f.beta === e.beta, 'deterministisch bei gleichem Startwert');
  const g = lebensdauerbemessung(ein({ startwert: 99, laeufe: 50000 }));
  pruefe(Math.abs(g.pf - e.pf) < 3 * Math.hypot(e.standardfehler, g.standardfehler), `Startwert 99: ${g.pf} vs ${e.pf}`);
  // p_f wächst mit der Zeit (gleiche Stichproben für alle Zeitpunkte)
  pruefe(e.kurve.every((p, i) => i === 0 || p.pf >= e.kurve[i - 1].pf), 'p_f(t) monoton');
  // erforderliche Deckung: mit c_m = erf c wird β₀ gerade erreicht
  const h = lebensdauerbemessung(ein({ karbonatisierung: karb({ deckung: { typ: 'normal', m: e.erfDeckung!, s: 8 } }) }));
  pruefe(h.pf <= h.pfZiel && h.pf > h.pfZiel - 0.01, `erf. Deckung trifft β₀: p_f ${h.pf}`);
}
// 5b. Beispiel 2 („Lebensdauerbemessung.beispiel2“) und Vergleich CEM I
{
  const e = lebensdauerbemessung(ein({ mechanismus: 'chlorid' }));
  pruefe(e.gueltig && nahe(e.pf, 0.1018, 0.0005) && nahe(e.beta, 1.27, 0.005) && !e.nachweis, `Bsp. 2 p_f ${e.pf} β ${e.beta}`);
  pruefe(e.erfDeckung !== null && nahe(e.erfDeckung, 55.8, 0.05) && e.lebensdauer === 48, `Bsp. 2 erf c ${e.erfDeckung}, L ${e.lebensdauer}`);
  const m = e.mittelwerte;
  pruefe(nahe(m.faktoren.ke, 0.566, 0.0005) && nahe(m.faktoren.A, 0.0542, 0.00005) && nahe(m.kennwert, 1.84, 0.005) && nahe(m.einwirkung, 0.102, 0.0005), `Bsp. 2 Mittelwerte ${JSON.stringify(m)}`);
  const text = JSON.stringify(inhalt.daten['Lebensdauerbemessung.beispiel2']);
  for (const z of ['59{,}9', '0{,}566', '0{,}0542', '1{,}84', '0{,}102', '10{,}2', '1{,}27', '55{,}8', '48']) pruefe(text.includes(z), `Bsp. 2 im Inhalt: ${z}`);
  const cemI = lebensdauerbemessung(ein({ mechanismus: 'chlorid', chlorid: chl({ dRcm: { typ: 'normal', m: 10, s: 2 }, a: C.alterung.cemI }) }));
  pruefe(nahe(cemI.beta, -0.59, 0.01) && cemI.lebensdauer === 4 && nahe(cemI.erfDeckung ?? 0, 129, 0.5), `CEM I β ${cemI.beta}`);
  // ohne Konvektionszone (Sprühnebel) zuverlässiger
  const nebel = lebensdauerbemessung(ein({ mechanismus: 'chlorid', chlorid: chl({ dx: { typ: 'konstant', m: 0 } }) }));
  pruefe(nebel.beta > e.beta, 'Δx = 0 → höheres β');
}

// 6. Monte-Carlo ↔ analytische Lösung (nur die Deckung streut, normalverteilt):
//    Karbonatisierung: p_f = Φ((x_c − m)/s); Chlorid: p_f = Φ((x_krit − m)/s) mit x_krit aus erf⁻¹
{
  const fest = (m: number): Verteilung => ({ typ: 'konstant', m });
  const k = karb({ rh: fest(65), bc: fest(-0.567), kt: fest(1.25), rInv: fest(rx), epsT: fest(1), cS: fest(0.00082), deckung: { typ: 'normal', m: 30, s: 6 } });
  const e = lebensdauerbemessung(ein({ karbonatisierung: k, laeufe: 100000 }));
  const xc = karbonatisierungstiefe(karbonatisierungsrate(1, 1, 1.25, rx * R_EINHEIT_MM2_A, R_EINHEIT_MM2_A, 0.00082), 50, 0);
  const soll = phi((xc - 30) / 6);
  pruefe(Math.abs(e.pf - soll) < 4 * Math.sqrt(soll * (1 - soll) / 100000), `MC ↔ analytisch Karbonatisierung ${e.pf} vs ${soll}`);
  const c = chl({ cCrit: fest(0.6), cS: fest(3), dx: fest(8.9), dRcm: fest(1.9), a: fest(0.45), be: fest(4800), tReal: fest(10), deckung: { typ: 'normal', m: 30, s: 6 } });
  const f = lebensdauerbemessung(ein({ mechanismus: 'chlorid', chlorid: c, laeufe: 100000 }));
  const d = keTemperatur(283.15, 4800) * 1.9 * D_EINHEIT_MM2_A * alterungsfaktor(50, 0.45);
  const soll2 = phi((kritischeTiefe(50, 0.1, 3, 8.9, d, 0.6) - 30) / 6);
  pruefe(Math.abs(f.pf - soll2) < 4 * Math.sqrt(soll2 * (1 - soll2) / 100000), `MC ↔ analytisch Chlorid ${f.pf} vs ${soll2}`);
  // analytisch erforderliche Deckung: m = x_c + β₀ · s
  pruefe(nahe(e.erfDeckung ?? 0, xc + 1.3 * 6, 0.2), `erf. Deckung analytisch ${e.erfDeckung} vs ${xc + 7.8}`);
  // alles deterministisch → p_f ∈ {0, 1}
  const det = lebensdauerbemessung(ein({ karbonatisierung: { ...k, deckung: { typ: 'konstant', m: 20, s: 0 } } }));
  pruefe(det.pf === 1 && det.beta === -Infinity && mittelwertrechnung(ein({ karbonatisierung: k })).einwirkung === xc, 'deterministisch: Versagen sicher');
}

// 7. Plausibilität gegen ein veröffentlichtes Beispiel: Carević/Ignjatović (2022), Tab. 1–3 (FORM):
//    XC3, Deckung 25 mm konstant, RH Beta(65; 10; 40; 100), W = 1, t = 50 a, R⁻¹ normal mit V = 10 %:
//    β = 1,3 wird bei R⁻¹ < 3.600 (Mittel) bzw. 3.950 (Maximum) (mm²/a)/(kg/m³) eingehalten.
//    Die Simulation liefert bei 3.600 etwas mehr (β ≈ 1,5) und unterschreitet 1,3 erst knapp über 3.850 – Abweichung FORM ↔ MC.
{
  const fall = (r: number) => lebensdauerbemessung(ein({
    laeufe: 50000,
    karbonatisierung: karb({ deckung: { typ: 'konstant', m: 25, s: 0 }, rInv: { typ: 'normal', m: r / R_EINHEIT_MM2_A, s: 0.1 * r / R_EINHEIT_MM2_A } }),
  }));
  const b3600 = fall(3600).beta, b4150 = fall(4150).beta;
  pruefe(b3600 >= 1.3 && b3600 < 1.7, `Carević 3.600: β ${b3600}`);
  pruefe(b4150 < 1.3, `Carević 4.150: β ${b4150}`);
}

// 8. Plausibilitätsprüfungen der Eingaben (Fehler → kein Ergebnis, Warnungen)
{
  const f = (o: Partial<LebensdauerEingabe>) => lebensdauerbemessung(ein(o));
  pruefe(!f({ nutzungsdauer: 0 }).gueltig && !f({ laeufe: 10 }).gueltig && !f({ betaZiel: NaN }).gueltig, 'Fehler allgemein');
  pruefe(!f({ karbonatisierung: karb({ deckung: { typ: 'normal', m: -5, s: 8 } }) }).gueltig, 'negative Deckung');
  pruefe(!f({ karbonatisierung: karb({ rh: { typ: 'beta', m: 65, s: 40, a: 40, b: 100 } }) }).gueltig, 'unmögliche Beta-Streuung');
  pruefe(!f({ mechanismus: 'chlorid', chlorid: chl({ c0: 0.7 }) }).gueltig, 'C₀ ≥ C_crit');
  pruefe(!f({ mechanismus: 'chlorid', chlorid: chl({ cS: { typ: 'lognormal', m: 0, s: 1 } }) }).gueltig, 'C_S = 0 lognormal');
  pruefe(f({ laeufe: 5000 }).hinweise.some(h => h.feld === 'laeufe'), 'Warnung < 10.000 Läufe');
  pruefe(f({ karbonatisierung: karb({ deckung: { typ: 'normal', m: 20, s: 8 } }) }).hinweise.some(h => h.feld === 'deckung'), 'Warnung m < 3 s');
  const sicher = f({ karbonatisierung: karb({ deckung: { typ: 'normal', m: 120, s: 2 } }), laeufe: 5000 });
  pruefe(sicher.betaUntergrenze && sicher.pf === 0 && sicher.beta > 3, 'p_f = 0 → Untergrenze');
}

// 9. Fuzz: 1.000 Zufallseingaben ohne NaN/∞ in gültigen Ergebnissen
{
  const u = zufallsgenerator(2026);
  const r = (a: number, b: number) => a + (b - a) * u();
  let gueltig = 0;
  for (let i = 0; i < 1000; i++) {
    const deck = { typ: (u() < 0.5 ? 'normal' : 'lognormal') as 'normal' | 'lognormal', m: r(-5, 120), s: r(-1, 20) };
    const e = lebensdauerbemessung(ein({
      mechanismus: u() < 0.5 ? 'karbonatisierung' : 'chlorid', laeufe: 1000, startwert: i, nutzungsdauer: r(-10, 150), betaZiel: r(-0.5, 4.5),
      karbonatisierung: karb({ deckung: deck, rh: { typ: 'beta', m: r(30, 105), s: r(0, 25), a: 40, b: 100 }, tc: r(-1, 30), rInv: { typ: 'normal', m: r(-5, 150), s: r(0, 30) }, pSR: r(-0.2, 1.2), tow: r(0, 1) }),
      chlorid: chl({ deckung: deck, c0: r(0, 0.8), cS: { typ: 'lognormal', m: r(-0.5, 6), s: r(0, 3) }, dRcm: { typ: 'normal', m: r(-1, 30), s: r(0, 6) }, tReal: { typ: 'normal', m: r(-25, 45), s: r(0, 10) } }),
    }));
    if (!e.gueltig) continue;
    gueltig++;
    const zahlen = [e.pf, e.standardfehler, e.pfZiel, ...e.kurve.map(p => p.pf)];
    pruefe(zahlen.every(Number.isFinite) && e.pf >= 0 && e.pf <= 1 && !Number.isNaN(e.beta), `Fuzz ${i}: ${JSON.stringify({ pf: e.pf, beta: e.beta })}`);
    pruefe(e.kurve.every(p => !Number.isNaN(p.beta)) && (e.erfDeckung === null || Number.isFinite(e.erfDeckung)), `Fuzz ${i}: Kurve/Deckung`);
  }
  pruefe(gueltig > 100, `Fuzz: nur ${gueltig} gültige Fälle`);
}

if (fehler.length) { for (const f of fehler) console.error(`FAIL: ${f}`); process.exit(1); }
console.log('OK: Lebensdauerbemessung (Verteilungen, Teilfunktionen, Beispiele, MC ↔ analytisch, Carević/Ignjatović, Fuzz)');
