/**
 * Glaser-Verfahren (Periodenbilanzverfahren nach DIN 4108-3) – die einzige Implementierung der Plattform
 * (Umsetzungsplan Phase 4, AP 4.9; genutzt im Modul Feuchteschutz, das Modul Bauphysik verweist darauf).
 * Reiner Rechenkern – geprüft in tests/glaser.test.ts.
 *
 * Ablauf:
 *  1. Temperaturverlauf im Bauteil (stationär, Wärmeübergangswiderstände der Tauperiode) und daraus der
 *     Sättigungsdampfdruck p_sat nach der Magnus-Formel (psat aus waermeschutz.ts), aufgetragen über der
 *     diffusionsäquivalenten Luftschichtdicke s_d. Jede Schicht wird in Teilpunkte zerlegt, weil p_sat
 *     innerhalb einer Schicht gekrümmt verläuft.
 *  2. Tangentenkonstruktion: Der Dampfdruckverlauf p(s_d) ist der „straff gespannte Faden“ von p_i nach p_e
 *     unterhalb von p_sat, also die untere konvexe Hülle aus p_i, p_e und der p_sat-Kurve. Berührt die Hülle
 *     p_sat in einem Punkt, ist das eine Tauwasserebene; folgt sie p_sat über eine Strecke, ein Tauwasserbereich.
 *  3. Tauwassermassenstrom je Ebene/Bereich = δ₀ · (Gefälle zuströmend − Gefälle abströmend),
 *     Tauwassermasse M_c = Σ g_c · t_Tau.
 *  4. Verdunstungsperiode: In allen Tauwasserebenen/-bereichen herrscht der Sättigungsdampfdruck der
 *     Verdunstungsperiode; Abgabe von der innersten Zone nach innen und von der äußersten nach außen.
 *
 * Massen in kg/m², Ströme in kg/(m²·h), Drücke in Pa, s_d in m.
 * Lehr- und Vorbemessungswerkzeug; ersetzt keinen Nachweis und keine hygrothermische Simulation (DIN EN 15026).
 */
import { type Hinweis, istEndlich } from './plausibilitaet';
import { psat, pruefeSchichten, type Schicht } from './waermeschutz';
import { formatDeZahl } from '../utils/numberFormat';

export interface GlaserSchicht extends Schicht {
  mu: number;
  /** Schicht ist nicht kapillar wasseraufnahmefähig (z. B. Folie, Dämmstoff) → Grenze 0,5 kg/m² an ihrer Berührungsfläche */
  nichtKapillar?: boolean;
}

/** Klima der Tauperiode */
export interface GlaserTauklima {
  thetaI: number; phiI: number; thetaE: number; phiE: number;
  /** Wärmeübergangswiderstände für den Feuchteschutznachweis [m²K/W] */
  Rsi: number; Rse: number;
  /** Dauer [h] */
  stunden: number;
}

/** Klima der Verdunstungsperiode (Dampfdrücke vorgegeben, wie in DIN 4108-3 seit 2014) */
export interface GlaserVerdunstungsklima {
  /** Wasserdampfteildruck innen bzw. außen [Pa] */
  pI: number; pE: number;
  /** Sättigungsdampfdruck in Tauwasserebenen/-bereichen [Pa] */
  pSatTauwasser: number;
  /** Dauer [h] */
  stunden: number;
}

/**
 * Randbedingungen der Tauperiode nach DIN 4108-3 (seit Ausgabe 2014-11, in 2018-10 unverändert übernommen):
 * 90 d Dezember–Februar, innen 20 °C / 50 %, außen −5 °C / 80 %, R_si = 0,25 und R_se = 0,04 m²K/W.
 * Öffentliche Belege: BaunetzWissen „Normativer Rechenweg: Randbedingungen“ (Dezember–Februar, −5 °C/80 %, 20 °C/50 %);
 * Ackermann/Kießl/Grafe, „Systematische rechnerische Untersuchungen zur ergänzenden Absicherung vereinfachter
 * nationaler Klima-Randbedingungen“, Forschungsbericht T 3288, Fraunhofer IRB 2012 (DIBt-gefördert), Tab. 1 und
 * Abschn. 4.1.1 (2 160 h, R_si = 0,25, R_se = 0,04 m²K/W); ubakus.de; Künzel, HolzBauSpezial 2019.
 * DIN 4108-3:2024-03 (Änderungsvermerk, DIN Media): Periodenbilanzverfahren nur noch bis 700 m Höhenlage – hier nicht
 * geprüft. Dass die Tauperiodenwerte in der Ausgabe 2024-03 unverändert sind, ist nur über den Normtext (Anhang A,
 * A.2.2, Tabelle A.3) bestätigbar: vorläufig, F-Freigabe.
 */
export const TAUPERIODE_DIN_4108_3: Readonly<GlaserTauklima> = { thetaI: 20, phiI: 50, thetaE: -5, phiE: 80, Rsi: 0.25, Rse: 0.04, stunden: 2160 };

/**
 * Randbedingungen der Verdunstungsperiode nach DIN 4108-3 (seit 2014-11): 90 d Juni–August, p_i = p_e = 1 200 Pa,
 * Sättigungsdampfdruck im Tauwasserbereich 1 700 Pa (Wände), 2 000 Pa bei Dächern (außer Gründächern).
 * Öffentliche Belege: BaunetzWissen (p_i = p_e = 1 200 Pa, Wand 1 700 Pa); Forschungsbericht T 3288 (2012), Tab. 1
 * (gerundet 1 200 / 1 700 / 2 000 Pa für Dächer). DIN 4108-3:2024-03 führt in Anhang A neue Außendampfdruckbedingungen
 * für verschattete Dächer und Dächer mit heller Deckung oder Abdichtung ein (Änderungsvermerk f); die Zahlenwerte sind
 * nicht öffentlich – der Dachwert 2 000 Pa gilt hier nur für unverschattete Dächer mit dunkler Deckung (vorläufig,
 * F-Freigabe: DIN 4108-3:2024-03, Anhang A, Tabelle A.3).
 */
export function verdunstungDin4108_3(bauteil: 'wand' | 'dach'): GlaserVerdunstungsklima {
  return { pI: 1200, pE: 1200, pSatTauwasser: bauteil === 'dach' ? 2000 : 1700, stunden: 2160 };
}

/**
 * Wasserdampf-Diffusionsleitkoeffizient ruhender Luft δ₀ = 2,0 · 10⁻¹⁰ kg/(m·s·Pa) = 7,2 · 10⁻⁷ kg/(m·h·Pa)
 * (Wert der DIN EN ISO 13788; physikalisch D/(R_v·T) ≈ 2,5 · 10⁻⁵/(461,5 · 293) = 1,85 · 10⁻¹⁰). Dass DIN 4108-3:2024-03
 * diesen Wert verwendet (und nicht den älteren 1/(1,5 · 10⁶) = 6,7 · 10⁻⁷ kg/(m·h·Pa)), ist öffentlich nicht belegt:
 * vorläufig, F-Freigabe (DIN 4108-3:2024-03, Anhang A, A.2.5).
 */
export const DELTA_0_KG_MHPA = 7.2e-7;

/** Grenzwerte der Tauwassermasse nach DIN 4108-3 [kg/m²] (BaunetzWissen; Forschungsbericht T 3288, 2012: 1,0 bzw. 0,5 kg/m²) */
export const MC_GRENZE_ALLGEMEIN = 1.0;
export const MC_GRENZE_NICHT_KAPILLAR = 0.5;

export interface GlaserZone {
  art: 'ebene' | 'bereich';
  /** Lage auf der s_d-Achse [m] */
  sdVon: number; sdBis: number;
  /** Index der Schichtgrenze (0 = raumseitige Oberfläche, n = Außenoberfläche) oder −1, wenn innerhalb einer Schicht */
  grenzeVon: number; grenzeBis: number;
  /** Schicht (0-basiert), in der die Zone beginnt bzw. endet; an einer Grenze die Schicht raumseitig davor */
  schichtVon: number; schichtBis: number;
  /** Sättigungsdampfdruck in der Zone (Tauperiode) [Pa] */
  pSatVon: number; pSatBis: number;
  /** Tauwassermassenstrom [kg/(m²·h)] und Tauwassermasse [kg/m²] */
  gc: number; mc: number;
  /** maßgebende Grenze 1,0 bzw. 0,5 kg/m² */
  mcGrenze: number;
}

export interface GlaserKriterium { text: string; eingehalten: boolean }

export interface GlaserOptionen {
  /** δ₀ in kg/(m·h·Pa), Vorgabe 7,2 · 10⁻⁷ */
  delta0?: number;
  /** Teilpunkte je Schicht für die p_sat-Kurve (Vorgabe 40) */
  teilpunkte?: number;
}

export function pruefeGlaser(schichten: readonly GlaserSchicht[], tau: GlaserTauklima, verd: GlaserVerdunstungsklima): Hinweis[] {
  const h = pruefeSchichten(schichten);
  schichten.forEach((s, i) => {
    if (s.mu === undefined) h.push({ stufe: 'fehler', feld: `schicht${i}`, text: `${s.name ?? `Schicht ${i + 1}`}: Die Wasserdampf-Diffusionswiderstandszahl μ fehlt.` });
  });
  if (!istEndlich(tau.thetaI, tau.thetaE, tau.phiI, tau.phiE, tau.Rsi, tau.Rse, tau.stunden)) {
    h.push({ stufe: 'fehler', feld: 'tauklima', text: 'Das Klima der Tauperiode muss aus Zahlen bestehen.' });
    return h;
  }
  if (!(tau.phiI > 0 && tau.phiI <= 100) || !(tau.phiE > 0 && tau.phiE <= 100)) h.push({ stufe: 'fehler', feld: 'phi', text: 'Die relative Luftfeuchte muss zwischen 0 und 100 % liegen.' });
  if (!(tau.thetaI > tau.thetaE)) h.push({ stufe: 'fehler', feld: 'theta', text: 'Für die Tauperiode muss die Innentemperatur über der Außentemperatur liegen.' });
  if (tau.Rsi < 0 || tau.Rse < 0) h.push({ stufe: 'fehler', feld: 'R', text: 'Die Wärmeübergangswiderstände dürfen nicht negativ sein.' });
  if (!(tau.stunden > 0)) h.push({ stufe: 'fehler', feld: 'tauperiode', text: 'Die Dauer der Tauperiode muss größer als 0 sein.' });
  if (tau.thetaI < -30 || tau.thetaI > 40 || tau.thetaE < -40 || tau.thetaE > 40) h.push({ stufe: 'warnung', feld: 'theta', text: 'Lufttemperaturen außerhalb des üblichen Bereichs (innen −30 bis 40 °C, außen −40 bis 40 °C).' });
  if (!istEndlich(verd.pI, verd.pE, verd.pSatTauwasser, verd.stunden) || !(verd.pI > 0 && verd.pE > 0 && verd.pSatTauwasser > 0 && verd.stunden > 0)) {
    h.push({ stufe: 'fehler', feld: 'verdunstungsklima', text: 'Das Klima der Verdunstungsperiode muss aus positiven Zahlen bestehen.' });
  } else if (verd.pSatTauwasser <= Math.max(verd.pI, verd.pE)) {
    h.push({ stufe: 'warnung', feld: 'verdunstungsklima', text: 'Der Sättigungsdampfdruck in der Tauwasserzone liegt nicht über dem Dampfdruck der Umgebung: Rechnerisch verdunstet nach mindestens einer Seite nichts.' });
  }
  return h;
}

interface Punkt { x: number; y: number; i: number }

/** Untere konvexe Hülle (monotone Kette); Punkte nach x sortiert, kollineare Punkte entfallen */
function untereHuelle(pkt: readonly Punkt[]): Punkt[] {
  const h: Punkt[] = [];
  for (const p of pkt) {
    while (h.length >= 2) {
      const o = h[h.length - 2], a = h[h.length - 1];
      const kreuz = (a.x - o.x) * (p.y - o.y) - (a.y - o.y) * (p.x - o.x);
      // Toleranz relativ zur Größenordnung, damit Rundungsrauschen keine Scheinberührung erzeugt
      const tol = 1e-12 * (Math.abs(p.x - o.x) + 1) * (Math.abs(p.y) + Math.abs(o.y) + 1);
      if (kreuz <= tol) h.pop(); else break;
    }
    h.push(p);
  }
  return h;
}

export function glaser(
  schichten: readonly GlaserSchicht[],
  tau: GlaserTauklima = TAUPERIODE_DIN_4108_3,
  verd: GlaserVerdunstungsklima = verdunstungDin4108_3('wand'),
  opt: GlaserOptionen = {},
) {
  const hinweise = pruefeGlaser(schichten, tau, verd);
  const delta0 = opt.delta0 ?? DELTA_0_KG_MHPA;
  const N = Math.max(2, Math.min(400, Math.round(opt.teilpunkte ?? 40)));
  if (!(delta0 > 0)) hinweise.push({ stufe: 'fehler', feld: 'delta0', text: 'δ₀ muss größer als 0 sein.' });

  if (hinweise.some(x => x.stufe === 'fehler')) {
    return {
      gueltig: false as const, hinweise,
      U: NaN, R_T: NaN, pi: NaN, pe: NaN, sdGes: NaN,
      grenzen: { sd: [] as number[], T: [] as number[], psat: [] as number[], p: [] as number[] },
      verlauf: { sd: [] as number[], T: [] as number[], psat: [] as number[], p: [] as number[] },
      zonen: [] as GlaserZone[], tauwasser: false, oberflaechenTauwasser: false,
      gc: NaN, mc: NaN, gev: NaN, mev: NaN, trocknungsTage: NaN, kriterien: [] as GlaserKriterium[],
    };
  }

  // 1. Temperaturen und s_d an den Schichtgrenzen
  const R_T = tau.Rsi + tau.Rse + schichten.reduce((a, s) => a + s.d / s.lambda, 0);
  const U = 1 / R_T;
  const q = U * (tau.thetaI - tau.thetaE);
  const Tg = [tau.thetaI - q * tau.Rsi];
  const sdg = [0];
  for (const s of schichten) {
    Tg.push(Tg[Tg.length - 1] - q * (s.d / s.lambda));
    sdg.push(sdg[sdg.length - 1] + s.mu * s.d);
  }
  const sdGes = sdg[sdg.length - 1];
  const pi = psat(tau.thetaI) * (tau.phiI / 100);
  const pe = psat(tau.thetaE) * (tau.phiE / 100);

  // Teilpunkte: T linear über s_d innerhalb jeder Schicht
  const vSd: number[] = [0], vT: number[] = [Tg[0]], vSchicht: number[] = [0], vGrenze: number[] = [0];
  schichten.forEach((_, k) => {
    for (let j = 1; j <= N; j++) {
      const f = j / N;
      vSd.push(sdg[k] + f * (sdg[k + 1] - sdg[k]));
      vT.push(Tg[k] + f * (Tg[k + 1] - Tg[k]));
      vSchicht.push(k);
      vGrenze.push(j === N ? k + 1 : -1);
    }
  });
  const vPs = vT.map(psat);
  const M = vSd.length;

  const oberflaechenTauwasser = pi > vPs[0];
  if (oberflaechenTauwasser) hinweise.push({ stufe: 'warnung', feld: 'oberflaeche', text: 'Der Dampfdruck der Raumluft liegt über dem Sättigungsdampfdruck an der raumseitigen Oberfläche: Oberflächentauwasser. Das Glaser-Verfahren setzt eine tauwasserfreie Oberfläche voraus; gerechnet wird ab p_sat(θ_si).' });
  if (pe > vPs[M - 1]) hinweise.push({ stufe: 'warnung', feld: 'oberflaeche', text: 'Der Außendampfdruck liegt über dem Sättigungsdampfdruck an der Außenoberfläche; gerechnet wird ab p_sat(θ_se).' });

  // 2. Tangentenkonstruktion als untere Hülle
  const pkt: Punkt[] = [{ x: 0, y: Math.min(pi, vPs[0]), i: 0 }];
  for (let k = 1; k < M - 1; k++) pkt.push({ x: vSd[k], y: vPs[k], i: k });
  pkt.push({ x: sdGes, y: Math.min(pe, vPs[M - 1]), i: M - 1 });
  const huelle = untereHuelle(pkt);

  // p(s_d) an allen Teilpunkten durch lineare Interpolation der Hülle
  const pVerlauf = vSd.map(x => {
    let k = 1;
    while (k < huelle.length - 1 && huelle[k].x < x) k++;
    const a = huelle[k - 1], b = huelle[k];
    return b.x > a.x ? a.y + ((x - a.x) / (b.x - a.x)) * (b.y - a.y) : Math.min(a.y, b.y);
  });

  // 3. Zonen = zusammenhängende Berührpunkte der Hülle (innere Hüllenpunkte)
  const innen = huelle.slice(1, -1);
  const gruppen: Punkt[][] = [];
  for (const p of innen) {
    const g = gruppen[gruppen.length - 1];
    if (g && p.i === g[g.length - 1].i + 1) g.push(p); else gruppen.push([p]);
  }
  const zonen: GlaserZone[] = [];
  for (const g of gruppen) {
    const A = g[0], B = g[g.length - 1];
    const ia = huelle.indexOf(A), ib = huelle.indexOf(B);
    const P = huelle[ia - 1], Q = huelle[ib + 1];
    const ein = (P.y - A.y) / (A.x - P.x);
    const aus = (B.y - Q.y) / (Q.x - B.x);
    const gc = delta0 * (ein - aus);
    if (!(gc > 1e-12)) continue; // Berührung ohne Massenstrom (Rundungsrest)
    const nachbarn = new Set<number>();
    for (const p of g) {
      nachbarn.add(vSchicht[p.i]);
      if (vGrenze[p.i] > 0 && vGrenze[p.i] < schichten.length) nachbarn.add(vGrenze[p.i]);
    }
    const nichtKap = [...nachbarn].some(k => schichten[k]?.nichtKapillar);
    zonen.push({
      art: g.length > 1 ? 'bereich' : 'ebene',
      sdVon: A.x, sdBis: B.x,
      grenzeVon: vGrenze[A.i], grenzeBis: vGrenze[B.i],
      schichtVon: vSchicht[A.i], schichtBis: vSchicht[B.i],
      pSatVon: A.y, pSatBis: B.y,
      gc, mc: gc * tau.stunden,
      mcGrenze: nichtKap ? MC_GRENZE_NICHT_KAPILLAR : MC_GRENZE_ALLGEMEIN,
    });
  }
  const tauwasser = zonen.length > 0;
  const gc = zonen.reduce((a, z) => a + z.gc, 0);
  const mc = gc * tau.stunden;

  // 4. Verdunstungsperiode
  let gev = 0;
  if (tauwasser) {
    const erste = zonen[0], letzte = zonen[zonen.length - 1];
    const nachInnen = (verd.pSatTauwasser - verd.pI) / erste.sdVon;
    const nachAussen = (verd.pSatTauwasser - verd.pE) / (sdGes - letzte.sdBis);
    gev = delta0 * (Math.max(0, nachInnen) + Math.max(0, nachAussen));
    if (zonen.length > 1) hinweise.push({ stufe: 'warnung', feld: 'zonen', text: `${zonen.length} getrennte Tauwasserzonen (z. B. durch den Knick der Sättigungskurve bei 0 °C oder mehrere dichte Schichten): Die Verdunstung wird vereinfacht für alle Zonen gemeinsam angesetzt – von der innersten Zone nach innen und von der äußersten nach außen.` });
  }
  const mev = gev * verd.stunden;
  const trocknungsTage = tauwasser && gev > 0 ? mc / gev / 24 : tauwasser ? Infinity : 0;

  // Kriterien neutral formuliert (rechnerischer Vergleich, kein Nachweis)
  const kriterien: GlaserKriterium[] = tauwasser ? [
    { text: 'Tauwassermasse ≤ Verdunstungsmasse (M_c ≤ M_ev)', eingehalten: mc <= mev },
    { text: `Tauwassermasse insgesamt ≤ ${formatDeZahl(MC_GRENZE_ALLGEMEIN, 1)} kg/m²`, eingehalten: mc <= MC_GRENZE_ALLGEMEIN },
    ...zonen.filter(z => z.mcGrenze < MC_GRENZE_ALLGEMEIN).map(z => ({
      text: `Tauwassermasse an der Berührungsfläche mit einer nicht kapillar wasseraufnahmefähigen Schicht (s_d = ${formatDeZahl(z.sdVon, 2)} m) ≤ ${formatDeZahl(MC_GRENZE_NICHT_KAPILLAR, 1)} kg/m²`,
      eingehalten: z.mc <= MC_GRENZE_NICHT_KAPILLAR,
    })),
  ] : [];

  const anGrenzen = (arr: readonly number[]) => [0, ...schichten.map((_, k) => (k + 1) * N)].map(i => arr[i]);
  return {
    gueltig: true as const, hinweise,
    U, R_T, pi, pe, sdGes,
    /** Werte an Oberflächen und Schichtgrenzen (Index 0 = raumseitige Oberfläche) */
    grenzen: { sd: sdg, T: Tg, psat: anGrenzen(vPs), p: anGrenzen(pVerlauf) },
    /** Fein aufgelöster Verlauf für Diagramme */
    verlauf: { sd: vSd, T: vT, psat: vPs, p: pVerlauf },
    zonen, tauwasser, oberflaechenTauwasser,
    gc, mc, gev, mev, trocknungsTage, kriterien,
  };
}

export type GlaserErgebnis = ReturnType<typeof glaser>;
