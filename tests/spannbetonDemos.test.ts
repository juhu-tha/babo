// Rechenkern Spannbeton – Demonstratoren (Umsetzungsplan Phase 4, AP 4.2, Runde 3):
// Freyssinet-Randspannungen, Dehnungsanimation, „Spannbeton von 0 bis 100“ (B500/Y1860, Lastausgleich)
import {
  freyssinetSpannungen, rechteckQuerschnitt, dekompressionsKraft, dehnungsZustand, DEHNUNG_TRAEGER,
  stauchungsVerlust, lastausgleich, litzenAnzahl, KRAFT_JE_LITZE_KN, KRAFT_JE_LITZE_PM0_KN, LITZE, CONCRETE, fctmFl,
  type DehnungsEingabe, type Spanngliedlage, type Schnittlage,
} from '../src/calc/spannbeton';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
const nahe = (ist: number, soll: number, tol: number) => Math.abs(ist - soll) <= tol * Math.abs(soll);
const gleich = (a: number, b: number) => a === b || Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(b));
console.log('--- Test: Spannbeton-Demonstratoren ---');

/**
 * Referenz: wörtliche Kopie der Rechnung aus src/modules/spannbeton/SpannbetonDehnungsAnimation.tsx
 * (useMemo „calc“, Stand origin/main 0e747ac6, ohne Darstellungsfarben). Belegt die 1:1-Übernahme.
 */
function modulReferenz(prestressForce: number, loadQ: number, eccentricity: number, tendonTrajectory: Spanngliedlage, viewSection: Schnittlage) {
  const L = 20.0, b = 500.0, h = 1000.0;
  const Ac = b * h, Ic = (b * Math.pow(h, 3)) / 12.0, Wc = (b * Math.pow(h, 2)) / 6.0, ku = h / 6.0;
  const Ecm = 35000.0, fctm = 3.5;
  let effectiveEpMid = 0, effectiveEpSup = 0, u_kN_m = 0, w_u_m = 0;
  if (tendonTrajectory === 'centric') { /* alles 0 */ }
  else if (tendonTrajectory === 'straight_bottom') {
    effectiveEpMid = eccentricity; effectiveEpSup = eccentricity;
    const Mp_const = prestressForce * (eccentricity / 1000.0);
    w_u_m = (Mp_const * 1000.0 * Math.pow(L, 2)) / (8.0 * Ecm * 1e6 * (Ic * 1e-12));
  } else {
    effectiveEpMid = eccentricity; effectiveEpSup = 0;
    u_kN_m = (8.0 * prestressForce * (eccentricity / 1000.0)) / Math.pow(L, 2);
    const u_SI = u_kN_m * 1000.0;
    w_u_m = (5.0 * u_SI * Math.pow(L, 4)) / (384.0 * (Ecm * 1e6) * (Ic * 1e-12));
  }
  const beamG = (25.0 * b * h) / 1e6;
  const totalQ = beamG + loadQ;
  const Mq_mid = (totalQ * Math.pow(L, 2)) / 8.0, Mq_sup = 0;
  const Mp_mid = -(prestressForce * (effectiveEpMid / 1000.0)), Mp_sup = -(prestressForce * (effectiveEpSup / 1000.0));
  const Mnet_mid = Mq_mid + Mp_mid, Mnet_sup = Mq_sup + Mp_sup;
  const sigma_N = -(prestressForce * 1000.0) / Ac;
  const isMidspan = viewSection === 'midspan';
  const activeEp = isMidspan ? effectiveEpMid : effectiveEpSup;
  const activeMq = isMidspan ? Mq_mid : Mq_sup;
  const activeMp = isMidspan ? Mp_mid : Mp_sup;
  const activeMnet = isMidspan ? Mnet_mid : Mnet_sup;
  const sigma_top = sigma_N + -(activeMnet * 1e6) / Wc;
  const sigma_bot = sigma_N + +(activeMnet * 1e6) / Wc;
  const sigma_max = Math.max(sigma_top, sigma_bot);
  const sigma_tendon = sigma_N + (activeMnet * 1e6 / Ic) * activeEp;
  const deltaSigma = sigma_bot - sigma_top;
  const neutralAxisDepth = Math.abs(deltaSigma) > 1e-4 ? (-sigma_top / deltaSigma) * h : h / 2;
  const sigma_top_support = sigma_N - (Mp_sup * 1e6) / Wc;
  const hasSupportHeadCracks = tendonTrajectory === 'straight_bottom' && sigma_top_support > fctm;
  const q_SI = totalQ * 1000.0;
  const w_q_m = (5.0 * q_SI * Math.pow(L, 4)) / (384.0 * (Ecm * 1e6) * (Ic * 1e-12));
  const w_net_mm = (w_q_m - w_u_m) * 1000.0;
  let P_dek = 0, P_cr = 0, P_bal = 0;
  if (effectiveEpMid > 0) {
    P_dek = (Mq_mid * 1000.0) / (ku + effectiveEpMid);
    P_cr = Math.max(0, (Mq_mid * 1000.0 - fctm * (Wc / 1000.0)) / (ku + effectiveEpMid));
    P_bal = Math.round((totalQ * Math.pow(L, 2)) / (8.0 * (effectiveEpMid / 1000.0)));
  } else {
    P_dek = (Mq_mid * 1000.0 * Ac) / Wc;
    P_cr = Math.max(0, ((Mq_mid * 1000.0 / Wc) - fctm) * Ac);
    P_bal = 0;
  }
  let phaseKey = 'cracked';
  if (hasSupportHeadCracks) phaseKey = 'support_crack';
  else if (sigma_top <= 0 && sigma_bot <= 0) phaseKey = w_net_mm < -0.5 ? 'camber' : 'full';
  else if (sigma_max <= fctm) phaseKey = 'limited';
  return {
    u_kN_m, sigma_N, sigma_top, sigma_bot, sigma_top_support, neutralAxisDepth, w_net_mm, P_dek, P_cr, P_bal, phaseKey,
    eps_top: (sigma_top / Ecm) * 1000.0, eps_bot: (sigma_bot / Ecm) * 1000.0, eps_tendon: (sigma_tendon / Ecm) * 1000.0,
    eps_Mp_bot: +((activeMp * 1e6) / Wc / Ecm) * 1000.0, eps_Mq_top: -((activeMq * 1e6) / Wc / Ecm) * 1000.0,
    sigma_Mp: (-activeMp * 1e6) / Wc, sigma_Mq: (activeMq * 1e6) / Wc,
  };
}

function gleichModul(e: DehnungsEingabe, tag: string) {
  const k = dehnungsZustand(e);
  const r = modulReferenz(e.P, e.q, e.ep, e.lage, e.schnitt);
  for (const [name, soll] of Object.entries(r)) {
    // bewusst korrigiert (Einheitenfehler im Modul, siehe src/calc/spannbeton.ts): P_cr bei zentrischem Spannglied
    if (name === 'P_cr' && k.effectiveEpMid === 0) continue;
    const ist = name === 'phaseKey' ? k.zustand : (k as unknown as Record<string, number>)[name];
    pruefe(typeof soll === 'string' ? ist === soll : gleich(ist as number, soll), `${tag}: ${name} ${ist} ≠ Modul ${soll}`);
  }
}

// 1. Querschnittswerte 500 × 1000 mm (Handrechnung): A = 500 000 mm², I = b·h³/12 = 4,1667·10¹⁰ mm⁴,
//    W = b·h²/6 = 8,3333·10⁷ mm³, Kernweite h/6 = 166,7 mm
const q = rechteckQuerschnitt(500, 1000);
pruefe(q.A === 500000 && nahe(q.I, 4.16667e10, 1e-5) && nahe(q.W, 8.33333e7, 1e-5) && nahe(q.kern, 166.667, 1e-5), 'Querschnittswerte');

// 2. Freyssinet (Handrechnung, Vorzeichen Druck negativ): P = 1 400 kN, e_p = 280 mm, M = g·L²/8 = 12,5·20²/8 = 625 kNm
//    −P/A = −2,800; P·e/W = 1,4·10⁶·280/8,333·10⁷ = 4,704; M/W = 625·10⁶/8,333·10⁷ = 7,500 N/mm²
//    σ_u = −2,800 − 4,704 + 7,500 = −0,004 N/mm²  (nahezu Dekompression), σ_o = −2,800 + 4,704 − 7,500 = −5,596 N/mm²
const f = freyssinetSpannungen(1400, q.A, q.W, 280, 625);
pruefe(nahe(f.sigmaN, -2.8, 1e-12) && nahe(f.sigmaP, 4.704, 1e-12) && nahe(f.sigmaM, 7.5, 1e-12), `Freyssinet-Anteile ${JSON.stringify(f)}`);
pruefe(Math.abs(f.sigmaUnten - -0.004) < 1e-9 && Math.abs(f.sigmaOben - -5.596) < 1e-9, `σ_u ${f.sigmaUnten}, σ_o ${f.sigmaOben}`);
// Dekompressionskraft P = M/(k + e) = 625 000/(166,67 + 280) = 1 399,25 kN ⇒ σ_u(P_dek) = 0
const pDek = dekompressionsKraft(625, q.kern, 280);
pruefe(nahe(pDek, 1399.25, 1e-5), `P_dek ${pDek}`);
pruefe(Math.abs(freyssinetSpannungen(pDek, q.A, q.W, 280, 625).sigmaUnten) < 1e-12, 'σ_u(P_dek) = 0');
// Grenzfall e = 0, M = 0: reiner zentrischer Druck; unsymmetrisch W_o ≠ W_u
const f0 = freyssinetSpannungen(1000, 2e5, 1e7, 0, 0);
pruefe(f0.sigmaOben === -5 && f0.sigmaUnten === -5, 'zentrisch: σ_o = σ_u = −P/A');
const fu = freyssinetSpannungen(1000, 2e5, 1e7, 100, 0, 2e7);
// σ_u = −5 − 1·10⁶·100/1·10⁷ = −15, σ_o = −5 + 1·10⁸/2·10⁷ = 0 N/mm²
pruefe(nahe(fu.sigmaUnten, -15, 1e-12) && Math.abs(fu.sigmaOben) < 1e-12, `W_o ≠ W_u: ${JSON.stringify(fu)}`);

// 3. Dehnungsanimation: Startzustand (P = 1 400 kN, q = 0, e_p = 280 mm, parabolisch, Feldmitte)
//    entspricht dem Freyssinet-Beispiel; u = 8·P·f/L² = 7,84 kN/m;
//    w_q = 5·12,5·20⁴/(384·E·I) = 17,86 mm, w_u = 5·7,84·20⁴/(384·E·I) = 11,20 mm ⇒ w = 6,66 mm (nach unten)
const z = dehnungsZustand({ P: 1400, q: 0, ep: 280, lage: 'parabolic', schnitt: 'midspan' });
pruefe(z.gueltig && nahe(z.u_kN_m, 7.84, 1e-12), `u ${z.u_kN_m}`);
pruefe(nahe(z.sigma_bot, f.sigmaUnten, 1e-9) && nahe(z.sigma_top, f.sigmaOben, 1e-9), 'Dehnungsanimation = Freyssinet');
pruefe(nahe(z.w_net_mm, 17.857 - 11.2, 1e-3), `w ${z.w_net_mm}`);
pruefe(nahe(z.P_dek, pDek, 1e-12) && z.zustand === 'full', `P_dek ${z.P_dek}, Zustand ${z.zustand}`);
// Lastausgleich: P_bal = g·L²/(8·e) = 12,5·400/(8·0,28) = 2 232 kN; bei P_bal ist die Biegelinie gerade (w = 0)
pruefe(z.P_bal === 2232, `P_bal ${z.P_bal}`);
const zBal = dehnungsZustand({ P: 12.5 * 400 / (8 * 0.28), q: 0, ep: 280, lage: 'parabolic', schnitt: 'midspan' });
pruefe(Math.abs(zBal.w_net_mm) < 1e-9 && Math.abs(zBal.sigma_top - zBal.sigma_bot) < 1e-9, 'Lastausgleich: w = 0, konstante Spannung');
// Gerade Spanngliedlage: am Auflager σ_o = −P/A + P·e/W; P = 3 000 kN, e = 380 mm → −6 + 13,68 = 7,68 > f_ctm → Kopfzugrisse
const zs = dehnungsZustand({ P: 3000, q: 0, ep: 380, lage: 'straight_bottom', schnitt: 'support' });
pruefe(nahe(zs.sigma_top_support, 7.68, 1e-12) && zs.hasSupportHeadCracks && zs.zustand === 'support_crack', `Kopfzug ${zs.sigma_top_support}`);
pruefe(zs.hinweise.some(h => h.stufe === 'warnung'), 'Kopfzugrisse → Hinweis Zustand I');
// Zentrisch: P_cr = (M/W − f_ctm)·A = (7,5 − 3,5)·500 000 = 2 000 kN, P_dek = 7,5·500 000 = 3 750 kN
const zc = dehnungsZustand({ P: 0, q: 0, ep: 280, lage: 'centric', schnitt: 'midspan' });
pruefe(nahe(zc.P_cr, 2000, 1e-12) && nahe(zc.P_dek, 3750, 1e-12) && zc.P_bal === 0 && zc.zustand === 'cracked', `zentrisch ${zc.P_cr} ${zc.P_dek}`);
// Grenzen: unzulässige Eingaben
pruefe(!dehnungsZustand({ P: -1, q: 0, ep: 280, lage: 'parabolic', schnitt: 'midspan' }).gueltig, 'P < 0 → Fehler');
pruefe(!dehnungsZustand({ P: 1000, q: 0, ep: 500, lage: 'parabolic', schnitt: 'midspan' }).gueltig, 'e_p = h/2 → Fehler');
pruefe(!dehnungsZustand({ P: NaN, q: 0, ep: 280, lage: 'parabolic', schnitt: 'midspan' }).gueltig, 'NaN → Fehler');
pruefe(DEHNUNG_TRAEGER.L === 20 && DEHNUNG_TRAEGER.fctm === 3.5, 'Lehrparameter unverändert');
// Runde 5: E_cm und f_ctm aus Tab. 3.1 (C40/50: 35 000 / 3,5 N/mm²), Biegerandzug gegen f_ctm,fl = max((1,6 − 1,0)·3,5; 3,5) = 3,5
pruefe(DEHNUNG_TRAEGER.Ecm === CONCRETE['C40/50'].Ecm && DEHNUNG_TRAEGER.fctm === CONCRETE['C40/50'].fctm && DEHNUNG_TRAEGER.fctmFl === 3.5 && fctmFl(3.5, 300) === 1.3 * 3.5, 'E_cm/f_ctm aus Tab. 3.1, f_ctm,fl (3.1.8)');

// 4. Station 2: Stauchung 1,2 ‰ → B500: Δσ = 200 000·0,0012 = 240 N/mm² (55 % von 435), Rest 195;
//    Y1860: Δσ = 195 000·0,0012 = 234 N/mm² (17 % von 1 360), Rest 1 126 N/mm²
const v = stauchungsVerlust(1.2);
pruefe(nahe(v.b500.deltaSigma, 240, 1e-12) && v.b500.verlustProzent === 55 && nahe(v.b500.rest, 195, 1e-12), `B500 ${JSON.stringify(v.b500)}`);
pruefe(nahe(v.y1860.deltaSigma, 234, 1e-12) && v.y1860.verlustProzent === 17 && nahe(v.y1860.rest, 1126, 1e-12), `Y1860 ${JSON.stringify(v.y1860)}`);
// Grenze: Δσ ≥ f_yd (2,175 ‰ = 435/200 000) → 100 %, Rest 0, Warnung
const v2 = stauchungsVerlust(2.5);
pruefe(v2.b500.verlustProzent === 100 && v2.b500.rest === 0 && v2.hinweise.length === 1 && v2.gueltig, 'B500 vollständig verloren');
pruefe(stauchungsVerlust(0).b500.verlustProzent === 0 && !stauchungsVerlust(-1).gueltig, 'Δε = 0 bzw. < 0');

// 5. Station 4: Lastausgleich L = 20 m, g = 25 kN/m, f = 0,35 m: P = 25·400/(8·0,35) = 3 571 kN, u = 25,0 kN/m, M_rest = 0
const la = lastausgleich(20, 25, 0.35);
//    Runde 5: Litzen aus A_p·σ_pm0 = 150·1 360 = 204 kN, nach 15 % Verlusten (Lehrannahme) 173,4 kN → n = ⌈3 571/173,4⌉ = 21 (vorher P/150 = 24)
pruefe(la.gueltig && la.P === 3571 && la.u === 25 && la.mNetto === 0 && la.litzen === 21, `Lastausgleich ${JSON.stringify(la)}`);
pruefe(KRAFT_JE_LITZE_PM0_KN === 204 && Math.abs(KRAFT_JE_LITZE_KN - 173.4) < 1e-9 && LITZE.Ap === 150, 'Kraft je Litze');
pruefe(litzenAnzahl(173.4) === 1 && litzenAnzahl(174) === 2 && litzenAnzahl(0) === 0 && litzenAnzahl(346.8) === 2, 'Litzenzahl aufgerundet');
pruefe(!lastausgleich(20, 25, 0).gueltig && !lastausgleich(0, 25, 0.3).gueltig && !lastausgleich(20, -1, 0.3).gueltig, 'f = 0 / L = 0 / g < 0 → Fehler');
// Referenz: wörtliche Kopie aus SpannbetonNullBisHundert.tsx (Stand origin/main 0e747ac6)
const laRef = (beamLength: number, deadLoad: number, sagittaF: number) => {
  const requiredP_kN = Math.round((deadLoad * Math.pow(beamLength, 2)) / (8 * sagittaF));
  const upwardLoad_u = Math.round(((8 * requiredP_kN * sagittaF) / Math.pow(beamLength, 2)) * 10) / 10;
  // Runde 5: Litzenzahl n = ⌈P/(150 mm²·1 360 N/mm²·0,85)⌉ statt round(P/150 kN)
  return { P: requiredP_kN, u: upwardLoad_u, mNetto: Math.round(((deadLoad - upwardLoad_u) * Math.pow(beamLength, 2)) / 8), litzen: Math.ceil(requiredP_kN / (150 * 1360 * 0.85 / 1000) - 1e-9) };
};
const verlustRef = (concreteStauchung: number) => {
  const deltaEps = concreteStauchung / 1000;
  const d1 = 200000 * deltaEps, d2 = 195000 * deltaEps;
  return [Math.min(100, Math.round((d1 / 435) * 100)), Math.max(0, 435 - d1), Math.min(100, Math.round((d2 / 1360) * 100)), Math.max(0, 1360 - d2)];
};

// 6. Fuzz: 1 000 Zufallseingaben → endlich, identisch zur Modulrechnung
let zufall = 1026;
const rnd = () => { zufall = (zufall * 1103515245 + 12345) % 2147483648; return zufall / 2147483648; };
const LAGEN: Spanngliedlage[] = ['centric', 'straight_bottom', 'parabolic'];
const SCHNITTE: Schnittlage[] = ['midspan', 'support'];
let n = 0;
for (let i = 0; i < 1000; i++) {
  const e: DehnungsEingabe = { P: Math.round(rnd() * 300) * 10, q: Math.round(rnd() * 50), ep: 150 + Math.round(rnd() * 230), lage: LAGEN[Math.floor(rnd() * 3)], schnitt: SCHNITTE[Math.floor(rnd() * 2)] };
  if (i % 7 === 0) { e.P = rnd() * 5000; e.q = rnd() * 100; e.ep = rnd() * 499; }
  const k = dehnungsZustand(e);
  gleichModul(e, `Fuzz ${i}`);
  const werte = [k.sigma_top, k.sigma_bot, k.eps_tendon, k.neutralAxisDepth, k.w_net_mm, k.P_dek, k.P_cr, k.P_bal, k.sigma_Mp, k.sigma_Mq];
  pruefe(k.gueltig && werte.every(Number.isFinite), `Fuzz ${i}: ${JSON.stringify(e)} → ${JSON.stringify(werte)}`);
  const ff = freyssinetSpannungen(e.P, q.A, q.W, k.activeEp, k.Mq);
  pruefe(Math.abs(ff.sigmaUnten - k.sigma_bot) < 1e-9, `Fuzz ${i}: Freyssinet σ_u`);
  pruefe(Math.abs(ff.sigmaOben - k.sigma_top) < 1e-9, `Fuzz ${i}: Freyssinet σ_o`);

  const stauchung = 0.2 + rnd() * 1.8;
  const sv = stauchungsVerlust(stauchung), svr = verlustRef(stauchung);
  pruefe(sv.b500.verlustProzent === svr[0] && gleich(sv.b500.rest, svr[1]) && sv.y1860.verlustProzent === svr[2] && gleich(sv.y1860.rest, svr[3]), `Fuzz ${i}: Stauchung`);
  const L = 10 + rnd() * 30, g = 5 + rnd() * 55, fs = 0.1 + rnd() * 0.8;
  const a = lastausgleich(L, g, fs), ar = laRef(L, g, fs);
  pruefe(a.P === ar.P && a.u === ar.u && a.mNetto === ar.mNetto && a.litzen === ar.litzen && [a.P, a.u, a.mNetto].every(Number.isFinite), `Fuzz ${i}: Lastausgleich`);
  n++;
}

if (fehler.length) { for (const x of fehler) console.error(`FAIL: ${x}`); process.exit(1); }
console.log(`OK: Spannbeton-Demonstratoren (${n} Fuzz-Fälle, identisch zur Modulrechnung bis auf die P_cr-Korrektur)`);
