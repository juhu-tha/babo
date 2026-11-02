/**
 * Lebenszykluskosten (LCC) mit der Barwertmethode (Umsetzungsplan Phase 4, AP 4.2). Reiner Rechenkern –
 * geprüft in tests/lcc.test.ts. Ursprünglich 1:1 aus src/modules/LCC.tsx übernommen; Runde 4 (Entscheidung
 * 26.10.): Preissteigerung ab Jahr 2 und linearer Restwert (siehe unten).
 *
 * Barwert einer Zahlung K (Preisstand Basisjahr) im Jahr t ≥ 1 bei Preissteigerung p und Kalkulationszins r:
 *      BW = K · (1 + p)^(t − 1) / (1 + r)^t          (BNB 2.1.1: „Die Preissteigerung erfolgt ab dem 2. Jahr.“)
 * Summe gleichbleibender, mit p steigender Jahreszahlungen (t = 1 … N), q = (1 + p)/(1 + r):
 *      BWF(r, p, N) = Σ (1 + p)^(t − 1)/(1 + r)^t = [q · (1 − q^N)/(1 − q)]/(1 + p)          (q = 1 → N/(1 + p))
 * Sonderfall p = 0: Rentenbarwertfaktor RBF = ((1 + r)^N − 1)/(r · (1 + r)^N); Annuitätenfaktor a = 1/RBF.
 * Öffentliche Quelle der Formel und Kontrollwerte: Bewertungsgesetz (BewG) Anlage 21 „Vervielfältiger“
 * (Fassung JStG 2024, Wiedergabe buzer.de), Formel (qⁿ − 1)/(qⁿ · (q − 1)).
 * Methode und Kennwerte im BNB-Steckbrief 2.1.1 (BNB_BK 2017, aktualisiert): Diskontierungszins 1,5 %,
 * Preissteigerung Bau/Dienstleistungen 2 %/a, Energie 5 %/a, Betrachtungszeitraum 50 a, keine Erneuerung im Jahr 50.
 *
 * Restwert (Entscheidung, 27.10.): Standard ist BNB-konform OHNE Restwert – der BNB-Steckbrief 2.1.1
 * enthält keine Restwertregel (keine Erneuerung im 50. Jahr, kein Restwertterm in der Summenformel). Zum Vergleich kann
 * mit restwertLinear = true ein linearer Restwert angesetzt werden: Reicht die Nutzungsdauer des zuletzt eingebauten
 * Bauteils über das Betrachtungsende N hinaus, gilt R = K_Einbau · (Restnutzungsdauer/Nutzungsdauer), im Jahr N
 * abgezinst und von den Kosten abgezogen. Quelle: Delegierte Verordnung (EU) Nr. 244/2012, Anhang I Nr. 4.2 (5)
 * (lineare Abschreibung der Anfangs- bzw. Ersatzinvestition bis zum Ende des Berechnungszeitraums, abgezinst auf den Beginn).
 * Lehr- und Vorbemessungswerkzeug; ersetzt keine Wirtschaftlichkeitsberechnung nach DIN 18960 / ISO 15686-5.
 */
import { type Hinweis, bereich, hatFehler, istEndlich, muss } from './plausibilitaet';
import { ersatzzyklen } from './lca';
import { GWP_LEHRWERTE } from '../data/gwpLehrwerte';

/**
 * EPS-WDVS im Szenario „Außenwand-Dämmsystem (150 m²)“: Herstellung A1–A3 als Lehrwert (Umsetzung 02.11.2026, NS5A-LK-1;
 * vorher pauschal 12 500 kg). EPS-Anteil aus dem zentralen Lehrwert GWP_LEHRWERTE.eps (3,25 kg CO₂-Äq./kg, 20 kg/m³)
 * mit 16 cm Dicke; Systemanteil (Kleber, Armierungsschicht, Oberputz, Dübel) als Lehrwert 16 kg CO₂-Äq./m², so dass das
 * Gesamtsystem in der Größenordnung von 20 bis 35 kg CO₂-Äq./m² liegt (Nachstichprobe 5a) – vorläufig.
 */
export const EPS_WDVS_SZENARIO = { dickeM: 0.16, flaecheM2: 150, systemanteilKgJeM2: 16 } as const;

/** Herstellungs-GWP eines EPS-WDVS [kg CO₂-Äq.]: EPS-Masse · GWP_LEHRWERTE.eps + Systemanteil · Fläche */
export function epsWdvsGwp(dickeM: number, flaecheM2: number, systemanteilKgJeM2: number) {
  const epsMasseKg = dickeM * flaecheM2 * GWP_LEHRWERTE.eps.rohdichte;
  const epsKg = epsMasseKg * GWP_LEHRWERTE.eps.gwp / 1000;
  const systemKg = systemanteilKgJeM2 * flaecheM2;
  return { epsMasseKg, epsKg, systemKg, gesamtKg: epsKg + systemKg };
}

/** Preissteigerungsfaktor im Jahr t nach BNB 2.1.1 (Steigerung ab dem 2. Jahr): (1 + p)^(t − 1) für t ≥ 1, 1 für t = 0 */
export const steigerungsfaktor = (p: number, t: number) => Math.pow(1 + p, Math.max(0, t - 1));

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

/**
 * Barwertfaktor für jährlich mit p steigende Zahlungen, t = 1 … N, Steigerung ab dem 2. Jahr (BNB 2.1.1):
 * Σ (1 + p)^(t − 1)/(1 + r)^t = [Σ ((1 + p)/(1 + r))^t]/(1 + p). Für p = 0 gleich dem Rentenbarwertfaktor.
 */
export function barwertfaktorPreissteigerung(r: number, p: number, N: number): number {
  const q = (1 + p) / (1 + r);
  if (Math.abs(q - 1) < 1e-12) return N / (1 + p);
  return (q * (1 - Math.pow(q, N))) / (1 - q) / (1 + p);
}

/**
 * Linearer Restwert am Betrachtungsende N (nominal, Preisstand des Einbaujahres) nach Del. VO (EU) 244/2012,
 * Anhang I Nr. 4.2 (5): R = K_Einbau · [(n + 1)·L − N]/L mit n = Anzahl der Ersatzzyklen (kein Ersatz im Jahr N).
 * K_Einbau = Investition (n = 0) bzw. Ersatzkosten · (1 + i)^(t_E − 1) im Einbaujahr t_E = n·L.
 */
export function restwertLinear(investition: number, ersatzkosten: number, nutzungsdauer: number, N: number, i: number): { restwert: number; einbaujahr: number; restnutzungsdauer: number } {
  const n = ersatzzyklen(nutzungsdauer, N);
  const einbaujahr = n * nutzungsdauer;
  const restnutzungsdauer = (n + 1) * nutzungsdauer - N;
  if (!(restnutzungsdauer > 0)) return { restwert: 0, einbaujahr, restnutzungsdauer: 0 };
  const kEinbau = n === 0 ? investition : ersatzkosten * steigerungsfaktor(i, einbaujahr);
  return { restwert: kEinbau * restnutzungsdauer / nutzungsdauer, einbaujahr, restnutzungsdauer };
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
  /** linearer Restwert am Betrachtungsende (Del. VO (EU) 244/2012) zum Vergleich; Standard false = ohne Restwert (BNB 2.1.1) */
  restwertLinear?: boolean;
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
  /** linearer Restwert am Betrachtungsende (positiv = Gutschrift), nominal und abgezinst [€] */
  restwertNominal: number;
  restwertDiscounted: number;
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
    // Betriebskosten steigen mit e ab dem 2. Jahr (BNB 2.1.1), abgezinst mit r
    const opexNom = opt.opex0 * steigerungsfaktor(e, yr);
    const opexDisc = opexNom / df;
    cumulativeOpEx += opexNom;
    cumulativeOpExDiscounted += opexDisc;

    const co2PricePerTon = p.co2Preis * steigerungsfaktor(p.co2Steigerung, yr);
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
      maintNom = opt.maintenanceCost * steigerungsfaktor(i, yr);
      maintDisc = maintNom / df;
      cumulativeMaintenance += maintNom;
      cumulativeMaintenanceDiscounted += maintDisc;
    }

    // Ersatz mit i, nicht im letzten Jahr; Herstellungsemissionen werden beim Ersatz erneut bepreist
    let replNom = 0, replDisc = 0, replCO2Cost = 0, replCO2CostDisc = 0;
    if (yr % opt.lifespan === 0 && yr < N) {
      replNom = opt.replacementCost * steigerungsfaktor(i, yr);
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

  // Rückbau im Jahr N mit i (ab dem 2. Jahr), abgezinst mit r
  const eolNom = opt.eolCost * steigerungsfaktor(i, N);
  const eolDisc = eolNom / Math.pow(1 + r, N);
  // linearer Restwert des zuletzt eingebauten Bauteils (Gutschrift), abgezinst mit r
  const restwertNominal = N >= 1 && p.restwertLinear === true ? restwertLinear(capex, opt.replacementCost, opt.lifespan, N, i).restwert : 0;
  const restwertDiscounted = restwertNominal / Math.pow(1 + r, N);
  const totalLCCDiscounted = capex + initialCO2Cost + cumulativeOpExDiscounted + cumulativeMaintenanceDiscounted
    + cumulativeReplacementDiscounted + cumulativeCO2Discounted + eolDisc - restwertDiscounted;

  return {
    capex, initialCO2Cost,
    cumulativeOpExNominal: cumulativeOpEx, cumulativeOpExDiscounted,
    cumulativeMaintenanceNominal: cumulativeMaintenance, cumulativeMaintenanceDiscounted,
    cumulativeReplacementNominal: cumulativeReplacement, cumulativeReplacementDiscounted,
    cumulativeCO2Nominal, cumulativeCO2Discounted,
    eolNominal: eolNom, eolDiscounted: eolDisc, restwertNominal, restwertDiscounted, totalLCCDiscounted, yearlyBreakdown,
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
    // Restwert, wenn das zuletzt eingebaute Bauteil über das Betrachtungsende hinaus nutzbar ist
    const n = ersatzzyklen(o.lifespan, p.N);
    const rest = (n + 1) * o.lifespan - p.N;
    if (rest > 0) {
      h.push({ stufe: 'warnung', feld: `option${name}`, text: p.restwertLinear === true
        ? `Option ${name}: Die Nutzungsdauer (${o.lifespan} a) reicht ${rest} a über das Betrachtungsende hinaus; ${rest}/${o.lifespan} der letzten Investition werden als Restwert gutgeschrieben (Vergleichsrechnung linear nach Del. VO (EU) 244/2012 – nicht BNB-konform, BNB 2.1.1 enthält keinen Restwertansatz).`
        : `Option ${name}: Die Nutzungsdauer (${o.lifespan} a) reicht ${rest} a über das Betrachtungsende hinaus; BNB-konform ohne Restwert gerechnet (BNB 2.1.1). Zum Vergleich: Schalter „Restwert linear (Del. VO (EU) 244/2012)“.` });
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
