/**
 * Lebenszykluskosten (LCC) mit der Barwertmethode (Umsetzungsplan Phase 4, AP 4.2). Reiner Rechenkern –
 * geprüft in tests/lcc.test.ts. Verhalten 1:1 aus src/modules/LCC.tsx übernommen.
 *
 * Barwert einer Zahlung K im Jahr t bei Preissteigerung p und Kalkulationszins r:
 *      BW = K · (1 + p)^t / (1 + r)^t
 * Summe gleichbleibender, mit p steigender Jahreszahlungen (t = 1 … N), q = (1 + p)/(1 + r):
 *      BWF(r, p, N) = Σ q^t = q · (1 − q^N)/(1 − q)          (q = 1 → N)
 * Sonderfall p = 0: Rentenbarwertfaktor RBF = ((1 + r)^N − 1)/(r · (1 + r)^N); Annuitätenfaktor a = 1/RBF.
 * Öffentliche Quelle der Formel und Kontrollwerte: Bewertungsgesetz (BewG) Anlage 21 „Vervielfältiger“
 * (Fassung JStG 2024, Wiedergabe buzer.de), Formel (qⁿ − 1)/(qⁿ · (q − 1)).
 * Methode und Kennwerte im BNB-Steckbrief 2.1.1 (BNB_BK 2017, aktualisiert): Diskontierungszins 1,5 %,
 * Preissteigerung Bau/Dienstleistungen 2 %/a, Energie 5 %/a, Betrachtungszeitraum 50 a, keine Erneuerung im Jahr 50.
 *
 * Abweichend vom BNB-Steckbrief (dort beginnt die Preissteigerung im Jahr 2) wird hier ab Jahr 1 gesteigert;
 * außerdem fehlt ein Restwert für Bauteile, die über das Betrachtungsende hinaus nutzbar sind (Prüfpunkt, unverändert).
 * Lehr- und Vorbemessungswerkzeug; ersetzt keine Wirtschaftlichkeitsberechnung nach DIN 18960 / ISO 15686-5.
 */
import { type Hinweis, bereich, hatFehler, istEndlich, muss } from './plausibilitaet';
import { ersatzzyklen } from './lca';

/** Kennwerte nach BNB-Steckbrief 2.1.1 (BK 2017, aktualisiert) – nur als Referenz für Hinweise */
export const BNB_211 = { r: 0.015, pAllgemein: 0.02, pEnergie: 0.05, N: 50 } as const;

/** Abzinsungsfaktor (1 + r)^−t */
export const abzinsungsfaktor = (r: number, t: number) => Math.pow(1 + r, -t);

/** Rentenbarwertfaktor (Vervielfältiger) ((1 + r)^N − 1)/(r · (1 + r)^N); r = 0 → N */
export function rentenbarwertfaktor(r: number, N: number): number {
  if (r === 0) return N;
  const qn = Math.pow(1 + r, N);
  return (qn - 1) / (r * qn);
}

/** Annuitätenfaktor (Kapitalwiedergewinnungsfaktor) a = 1/RBF */
export const annuitaetenfaktor = (r: number, N: number) => 1 / rentenbarwertfaktor(r, N);

/** Barwertfaktor für jährlich mit p steigende Zahlungen, t = 1 … N (geschlossene Form der Summe Σ ((1+p)/(1+r))^t) */
export function barwertfaktorPreissteigerung(r: number, p: number, N: number): number {
  const q = (1 + p) / (1 + r);
  if (Math.abs(q - 1) < 1e-12) return N;
  return (q * (1 - Math.pow(q, N))) / (1 - q);
}

export interface LccOption {
  /** Investitionskosten (Jahr 0) [€] */
  capex: number;
  /** jährliche Betriebskosten im Basisjahr [€/a], steigen mit der Energiepreissteigerung */
  opex0: number;
  /** Instandhaltungsintervall [a] */
  maintenanceInterval: number;
  /** Instandhaltungskosten je Zyklus [€] */
  maintenanceCost: number;
  /** Nutzungsdauer bis zum Ersatz [a] */
  lifespan: number;
  /** Ersatzkosten je Ersatz [€] */
  replacementCost: number;
  /** Rückbau-/Entsorgungskosten am Ende (negativ = Restwerterlös) [€] */
  eolCost: number;
  /** Herstellungsemissionen [kg CO₂-Äq.] */
  embodiedCO2: number;
  /** Betriebsemissionen [kg CO₂-Äq./a] */
  operatingCO2: number;
}

export interface LccParameter {
  /** Kalkulationszins r [-] (z. B. 0,02) */
  r: number;
  /** Energiepreissteigerung e [-] */
  e: number;
  /** allgemeine Preissteigerung i [-] (Instandhaltung, Ersatz, Rückbau) */
  i: number;
  /** Betrachtungszeitraum N [a] (ganzzahlig) */
  N: number;
  co2Bepreisung: boolean;
  /** CO₂-Preis im Basisjahr [€/t] */
  co2Preis: number;
  /** jährliche Steigerung des CO₂-Preises [-] */
  co2Steigerung: number;
  /** Investitionsförderung für Option B [%]; 0 = keine Förderung */
  foerderungB: number;
}

export interface LccJahr {
  year: number;
  opexNominal: number;
  opexDiscounted: number;
  maintNominal: number;
  maintDiscounted: number;
  replNominal: number;
  replDiscounted: number;
  co2PricePerTon: number;
  co2Nominal: number;
  co2Discounted: number;
  totalNominal: number;
  totalDiscounted: number;
  cumulativeDiscounted: number;
}

export interface LccOptionErgebnis {
  capex: number;
  initialCO2Cost: number;
  cumulativeOpExNominal: number;
  cumulativeOpExDiscounted: number;
  cumulativeMaintenanceNominal: number;
  cumulativeMaintenanceDiscounted: number;
  cumulativeReplacementNominal: number;
  cumulativeReplacementDiscounted: number;
  cumulativeCO2Nominal: number;
  cumulativeCO2Discounted: number;
  eolNominal: number;
  eolDiscounted: number;
  totalLCCDiscounted: number;
  yearlyBreakdown: LccJahr[];
}

/** Barwert-LCC einer Option; foerderung in % mindert die Investition (im Modul nur für Option B) */
export function lccOption(opt: LccOption, p: LccParameter, foerderung: number): LccOptionErgebnis {
  const { r, e, i, N } = p;
  const capex = foerderung > 0 ? opt.capex * (1 - foerderung / 100) : opt.capex;

  let cumulativeOpEx = 0, cumulativeOpExDiscounted = 0;
  let cumulativeMaintenance = 0, cumulativeMaintenanceDiscounted = 0;
  let cumulativeReplacement = 0, cumulativeReplacementDiscounted = 0;
  let cumulativeCO2Nominal = 0, cumulativeCO2Discounted = 0;

  // CO₂-Schattenpreis der Herstellungsemissionen im Jahr 0
  const initialCO2Cost = p.co2Bepreisung ? (opt.embodiedCO2 / 1000) * p.co2Preis : 0;
  let runningCumulativeDiscounted = capex + initialCO2Cost;
  const yearlyBreakdown: LccJahr[] = [];

  for (let yr = 1; yr <= N; yr++) {
    const df = Math.pow(1 + r, yr);
    // Betriebskosten steigen mit e, abgezinst mit r
    const opexNom = opt.opex0 * Math.pow(1 + e, yr);
    const opexDisc = opexNom / df;
    cumulativeOpEx += opexNom;
    cumulativeOpExDiscounted += opexDisc;

    const co2PricePerTon = p.co2Preis * Math.pow(1 + p.co2Steigerung, yr);
    let co2Nom = 0, co2Disc = 0;
    if (p.co2Bepreisung) {
      co2Nom = (opt.operatingCO2 / 1000) * co2PricePerTon;
      co2Disc = co2Nom / df;
      cumulativeCO2Nominal += co2Nom;
      cumulativeCO2Discounted += co2Disc;
    }

    // Instandhaltung mit i, nicht im letzten Jahr
    let maintNom = 0, maintDisc = 0;
    if (yr % opt.maintenanceInterval === 0 && yr < N) {
      maintNom = opt.maintenanceCost * Math.pow(1 + i, yr);
      maintDisc = maintNom / df;
      cumulativeMaintenance += maintNom;
      cumulativeMaintenanceDiscounted += maintDisc;
    }

    // Ersatz mit i, nicht im letzten Jahr; Herstellungsemissionen werden beim Ersatz erneut bepreist
    let replNom = 0, replDisc = 0, replCO2Cost = 0, replCO2CostDisc = 0;
    if (yr % opt.lifespan === 0 && yr < N) {
      replNom = opt.replacementCost * Math.pow(1 + i, yr);
      replDisc = replNom / df;
      cumulativeReplacement += replNom;
      cumulativeReplacementDiscounted += replDisc;
      if (p.co2Bepreisung) {
        replCO2Cost = (opt.embodiedCO2 / 1000) * co2PricePerTon;
        replCO2CostDisc = replCO2Cost / df;
        cumulativeCO2Nominal += replCO2Cost;
        cumulativeCO2Discounted += replCO2CostDisc;
      }
    }

    const yrTotalNom = opexNom + maintNom + replNom + co2Nom + replCO2Cost;
    const yrTotalDisc = opexDisc + maintDisc + replDisc + co2Disc + replCO2CostDisc;
    runningCumulativeDiscounted += yrTotalDisc;
    yearlyBreakdown.push({
      year: yr, opexNominal: opexNom, opexDiscounted: opexDisc, maintNominal: maintNom, maintDiscounted: maintDisc,
      replNominal: replNom, replDiscounted: replDisc, co2PricePerTon, co2Nominal: co2Nom + replCO2Cost,
      co2Discounted: co2Disc + replCO2CostDisc, totalNominal: yrTotalNom, totalDiscounted: yrTotalDisc,
      cumulativeDiscounted: runningCumulativeDiscounted,
    });
  }

  // Rückbau/Restwert im Jahr N mit i, abgezinst mit r
  const eolNom = opt.eolCost * Math.pow(1 + i, N);
  const eolDisc = eolNom / Math.pow(1 + r, N);
  const totalLCCDiscounted = capex + initialCO2Cost + cumulativeOpExDiscounted + cumulativeMaintenanceDiscounted
    + cumulativeReplacementDiscounted + cumulativeCO2Discounted + eolDisc;

  return {
    capex, initialCO2Cost,
    cumulativeOpExNominal: cumulativeOpEx, cumulativeOpExDiscounted,
    cumulativeMaintenanceNominal: cumulativeMaintenance, cumulativeMaintenanceDiscounted,
    cumulativeReplacementNominal: cumulativeReplacement, cumulativeReplacementDiscounted,
    cumulativeCO2Nominal, cumulativeCO2Discounted,
    eolNominal: eolNom, eolDiscounted: eolDisc, totalLCCDiscounted, yearlyBreakdown,
  };
}

/** Prüft die Eingaben; Fehler → kein Ergebnis, Warnungen → Ergebnis gültig, aber außerhalb des üblichen Bereichs */
export function pruefeLcc(a: LccOption, b: LccOption, p: LccParameter): Hinweis[] {
  const h: Hinweis[] = [];
  muss(h, istEndlich(p.r, p.e, p.i, p.N, p.co2Preis, p.co2Steigerung, p.foerderungB), 'parameter', 'Alle Parameter müssen Zahlen sein.');
  muss(h, Number.isInteger(p.N) && p.N >= 1, 'N', 'Der Betrachtungszeitraum muss eine ganze Zahl von mindestens 1 Jahr sein.');
  muss(h, p.r > -1 && p.e > -1 && p.i > -1 && p.co2Steigerung > -1, 'r', 'Zins- und Steigerungsraten müssen größer als −100 % sein.');
  muss(h, p.foerderungB >= 0 && p.foerderungB <= 100, 'foerderungB', 'Die Förderquote muss zwischen 0 und 100 % liegen.');
  muss(h, p.co2Preis >= 0, 'co2Preis', 'Der CO₂-Preis darf nicht negativ sein.');
  for (const [name, o] of [['A', a], ['B', b]] as const) {
    muss(h, istEndlich(o.capex, o.opex0, o.maintenanceCost, o.replacementCost, o.eolCost, o.embodiedCO2, o.operatingCO2),
      `option${name}`, `Option ${name}: Alle Kostenangaben müssen Zahlen sein.`);
    muss(h, Number.isInteger(o.maintenanceInterval) && o.maintenanceInterval >= 1, `option${name}`, `Option ${name}: Das Instandhaltungsintervall muss eine ganze Zahl ≥ 1 a sein.`);
    muss(h, Number.isInteger(o.lifespan) && o.lifespan >= 1, `option${name}`, `Option ${name}: Die Nutzungsdauer muss eine ganze Zahl ≥ 1 a sein.`);
  }
  if (hatFehler(h)) return h;
  bereich(h, 'r', p.r, 0, 0.06, 'Kalkulationszins außerhalb 0 … 6 % – für öffentliche Bauten setzt der BNB-Steckbrief 2.1.1 1,5 % an.');
  bereich(h, 'N', p.N, 20, 80, 'Betrachtungszeitraum außerhalb 20 … 80 Jahre; BNB und DGNB rechnen mit 50 Jahren.');
  for (const [name, o] of [['A', a], ['B', b]] as const) {
    // Restwert fehlt, wenn das zuletzt eingebaute Bauteil über das Betrachtungsende hinaus nutzbar wäre
    const n = ersatzzyklen(o.lifespan, p.N);
    if ((n + 1) * o.lifespan > p.N) {
      h.push({ stufe: 'warnung', feld: `option${name}`, text: `Option ${name}: Die Nutzungsdauer (${o.lifespan} a) reicht über das Betrachtungsende hinaus; ein Restwert wird nicht angerechnet.` });
    }
  }
  return h;
}

export interface LccVergleich {
  resultA: LccOptionErgebnis;
  resultB: LccOptionErgebnis;
  /** LCC_A − LCC_B [€]; > 0: Option B günstiger */
  saving: number;
  /** Ersparnis bezogen auf LCC_A [%] */
  percentSaving: number;
  gueltig: boolean;
  hinweise: Hinweis[];
}

/** Vergleich zweier Optionen (Förderung nur für Option B, wie im Modul) */
export function lccVergleich(a: LccOption, b: LccOption, p: LccParameter): LccVergleich {
  const hinweise = pruefeLcc(a, b, p);
  if (hatFehler(hinweise)) {
    const leer = lccOption({ ...a, maintenanceInterval: 1, lifespan: 1 }, { ...p, N: 0 }, 0);
    const nan = { ...leer, totalLCCDiscounted: NaN };
    return { resultA: nan, resultB: nan, saving: NaN, percentSaving: NaN, gueltig: false, hinweise };
  }
  const resultA = lccOption(a, p, 0);
  const resultB = lccOption(b, p, p.foerderungB);
  const saving = resultA.totalLCCDiscounted - resultB.totalLCCDiscounted;
  let percentSaving = NaN;
  if (resultA.totalLCCDiscounted > 0) percentSaving = (saving / resultA.totalLCCDiscounted) * 100;
  else hinweise.push({ stufe: 'warnung', feld: 'optionA', text: 'Der Barwert von Option A ist nicht positiv – eine prozentuale Ersparnis ist nicht aussagekräftig.' });
  return { resultA, resultB, saving, percentSaving, gueltig: true, hinweise };
}
