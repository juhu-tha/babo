import { formatDeIntl } from '../utils/numberFormat';
/**
 * Stoffraumrechnung für 1 m³ Beton und Wasserzementwert nach DIN EN 206 / DIN 1045-2.
 * Reiner Rechenkern – geprüft in tests/mischung.test.ts. Die Anforderungen der Expositionsklassen bleiben im Modul.
 */
import { type Hinweis, istEndlich } from './plausibilitaet';

export interface Fraktion { anteil: number; feuchte: number; wa: number } // M.-% der Gesteinskörnung, Gesamtfeuchte, Wasseraufnahme [M.-%]

export interface MischungEingabe {
  zement: number; rhoZement: number;           // kg/m³, kg/dm³
  wasser: number;                              // wirksamer Wassergehalt [kg/m³]
  fa: number; sf: number; hues: number; biochar: number; // kg/m³
  zusatzmittel: number; luft: number;          // kg/m³, Vol.-%
  stahlfaser: number; ppFaser: number;         // kg/m³
  rhoGestein: number;                          // kg/dm³
  fraktionen: Fraktion[];
  biocharFeuchte: number; biocharWa: number;   // M.-%
  k: { fa: number; sf: number; hues: number; biochar: number };
  maxFaFaktor: number;                         // anrechenbare Flugasche f ≤ maxFaFaktor·z
  /** Zementart (Schlüssel aus ZEMENT_DATA) für die Kombinationsregel Flugasche + Silikastaub; ohne Angabe keine Prüfung */
  zementArt?: string;
  /**
   * true, wenn XF2 oder XF4 gefordert ist (M-6, DIN 1045-2): Anrechnung auf w/z-Wert und Mindestzementgehalt nur für
   * Flugasche; Silikastaub wird nicht angerechnet, bei gleichzeitiger Zugabe von Flugasche und Silikastaub auch die
   * Flugasche nicht. Ohne Angabe: false.
   */
  frostTausalz?: boolean;
}

/** Zementarten: Rohdichte [kg/dm³] und GWP-Lehrwert [kg CO₂-Äq./kg] */
export const ZEMENT_DATA: Readonly<Record<string, { co2: number; rho: number }>> = {
  'CEM I': { co2: 0.85, rho: 3.1 },
  'CEM II/A': { co2: 0.75, rho: 3.05 },
  'CEM II/B': { co2: 0.65, rho: 3.0 },
  'CEM II/S': { co2: 0.65, rho: 3.0 },
  'CEM II/C-M': { co2: 0.55, rho: 3.0 }, // DIN EN 197-5 (klinkereffizienter Portlandkompositzement)
  'CEM III/A': { co2: 0.45, rho: 2.95 },
  'CEM III/B': { co2: 0.35, rho: 2.9 },
  'CEM IV': { co2: 0.50, rho: 2.9 },
  'CEM V': { co2: 0.40, rho: 2.9 },
  'CEM VI': { co2: 0.40, rho: 2.95 }, // DIN EN 197-5 (Kompositzement)
};

/**
 * Anrechenbare Flugasche f ≤ Faktor·z nach DIN 1045-2, k-Wert-Ansatz (Runde 5, Z55; öffentliche Sekundärquelle: UniBw München,
 * Lehrunterlage „Flugasche“, und umwelt-online, DIN 1045-2 Abschnitt 5.2.5): f/z ≤ 0,33 für Zemente ohne die Hauptbestandteile
 * P, V oder D; ≤ 0,25 mit P oder V (ohne D); ≤ 0,15 mit D. Zugelassen sind u. a. CEM I, CEM II-S, CEM II/A-D, CEM II-T,
 * CEM II/A-LL, CEM II/A-P, CEM II/A-V, CEM II-M (ausgewählte), CEM III/A und CEM III/B (Hüttensand < 70 M.-%).
 * Die Zementarten des Rechners sind ohne Hauptbestandteil-Kennbuchstaben angegeben; angesetzt wird:
 *   CEM I, CEM II/A, CEM II/S, CEM III/A, CEM III/B → 0,33 (ohne P/V/D angenommen); CEM II/B → 0,25 (mit P/V angenommen);
 *   CEM II/C-M, CEM IV, CEM V, CEM VI → 0 (k-Wert-Ansatz nicht geregelt).
 * Vorher: CEM III/A und CEM III/B → 0, CEM II/S → 0 (vorläufig, F-Freigabe: Zuordnung je Hauptbestandteil).
 */
export function maxFaFaktor(zementArt: string): number {
  if (['CEM I', 'CEM II/A', 'CEM II/S', 'CEM III/A', 'CEM III/B'].includes(zementArt)) return 0.33;
  return zementArt === 'CEM II/B' ? 0.25 : 0;
}

/** k-Werte und Grenzen nach DIN 1045-2 (k-Wert-Ansatz): k_f = 0,4, k_s = 1,0, s/z ≤ 0,11 */
export const K_WERT_DIN1045_2 = { kF: 0.4, kS: 1.0, maxSfFaktor: 0.11 } as const;

/**
 * Alkalitätsreserve bei gemeinsamer Verwendung von Flugasche und Silikastaub (DIN 1045-2, 5.2.5.2.4/5.2.5.2.5):
 * f/z ≤ 3·(0,22 − s/z) für CEM I, f/z ≤ 3·(0,15 − s/z) für CEM II-S, CEM II/A-D, CEM II-T, CEM II/A-LL und CEM III/A;
 * mit anderen Zementen ist die Kombination nicht zulässig. Rückgabe: Grenzwert der Konstanten (0,22 bzw. 0,15) oder null.
 * Zuordnung der Rechner-Zementarten: CEM I → 0,22; CEM II/S, CEM II/A, CEM III/A → 0,15 (CEM II/A als II/A-LL bzw. II/A-D
 * angenommen); übrige → null (vorläufig, F-Freigabe).
 */
export function kombinationsGrenze(zementArt: string): number | null {
  if (zementArt === 'CEM I') return 0.22;
  return ['CEM II/S', 'CEM II/A', 'CEM III/A'].includes(zementArt) ? 0.15 : null;
}

/** Rohdichten [kg/dm³] der Zusatzstoffe, Zusatzmittel und Fasern */
export const RHO = { fa: 2.2, sf: 2.2, hues: 2.9, biochar: 1.5, zusatzmittel: 1.05, stahlfaser: 7.85, ppFaser: 0.91, wasser: 1.0 } as const;

export function pruefeMischung(e: MischungEingabe): Hinweis[] {
  const h: Hinweis[] = [];
  const zahlen = [e.zement, e.rhoZement, e.wasser, e.fa, e.sf, e.hues, e.biochar, e.zusatzmittel, e.luft, e.stahlfaser, e.ppFaser, e.rhoGestein, ...e.fraktionen.flatMap(f => [f.anteil, f.feuchte, f.wa])];
  if (!istEndlich(...zahlen)) return [{ stufe: 'fehler', feld: 'eingabe', text: 'Alle Eingaben müssen Zahlen sein.' }];
  if (e.zement <= 0) h.push({ stufe: 'fehler', feld: 'zement', text: 'Der Zementgehalt muss größer als 0 sein (sonst ist der w/z-Wert nicht definiert).' });
  if (e.wasser <= 0) h.push({ stufe: 'fehler', feld: 'wasser', text: 'Der Wassergehalt muss größer als 0 sein.' });
  if (e.rhoZement <= 0 || e.rhoGestein <= 0) h.push({ stufe: 'fehler', feld: 'rho', text: 'Die Rohdichten müssen größer als 0 sein.' });
  if ([e.fa, e.sf, e.hues, e.biochar, e.zusatzmittel, e.stahlfaser, e.ppFaser, e.luft].some(x => x < 0)) h.push({ stufe: 'fehler', feld: 'eingabe', text: 'Mengen und Luftgehalt dürfen nicht negativ sein.' });
  if (e.fraktionen.some(f => f.anteil < 0 || f.feuchte < 0 || f.wa < 0)) h.push({ stufe: 'fehler', feld: 'fraktionen', text: 'Anteile, Feuchte und Wasseraufnahme der Fraktionen dürfen nicht negativ sein.' });
  const summe = e.fraktionen.reduce((a, f) => a + f.anteil, 0);
  if (Math.abs(summe - 100) >= 0.1) h.push({ stufe: 'warnung', feld: 'fraktionen', text: `Die Fraktionsanteile ergeben ${formatDeIntl(summe)} % statt 100 %.` });
  if (e.luft > 12) h.push({ stufe: 'warnung', feld: 'luft', text: 'Luftgehalt über 12 Vol.-% ist für Normalbeton unüblich.' });
  return h;
}

export function stoffraum(e: MischungEingabe) {
  const hinweise = pruefeMischung(e);
  const vol = {
    zement: e.zement / e.rhoZement,
    wasser: e.wasser / RHO.wasser,
    fa: e.fa / RHO.fa, sf: e.sf / RHO.sf, hues: e.hues / RHO.hues, biochar: e.biochar / RHO.biochar,
    zusatzmittel: e.zusatzmittel / RHO.zusatzmittel,
    luft: e.luft * 10,
    stahlfaser: e.stahlfaser / RHO.stahlfaser, ppFaser: e.ppFaser / RHO.ppFaser,
  };
  const volOhneGestein = Object.values(vol).reduce((a, v) => a + v, 0);
  const volGestein = 1000 - volOhneGestein;
  if (!hinweise.some(x => x.stufe === 'fehler') && volGestein <= 0) {
    hinweise.push({ stufe: 'fehler', feld: 'zement', text: `Leim, Luft und Fasern füllen bereits ${formatDeIntl(Math.round(volOhneGestein))} dm³ – für die Gesteinskörnung bleibt kein Stoffraum.` });
  } else if (volGestein > 0 && volGestein < 500) {
    hinweise.push({ stufe: 'warnung', feld: 'zement', text: 'Weniger als 500 dm³/m³ Gesteinskörnung – sehr leimreiche Mischung, Schwinden und Wärmeentwicklung prüfen.' });
  }
  const fehlerhaft = hinweise.some(x => x.stufe === 'fehler');
  const masseGestein = fehlerhaft ? 0 : volGestein * e.rhoGestein;
  const fr = e.fraktionen.map(f => {
    const trocken = masseGestein * (f.anteil / 100);
    return { trocken, feucht: trocken * (1 + f.feuchte / 100), oberflaechenwasser: trocken * ((f.feuchte - f.wa) / 100) };
  });
  const wasserAusGestein = fr.reduce((a, f) => a + f.oberflaechenwasser, 0);
  const wasserAusBiochar = e.biochar * ((e.biocharFeuchte - e.biocharWa) / 100);
  // M-7 (Entscheidung 28.10.2026): Kornrohdichte ρ_G ofentrocken (ρ_rd nach DIN EN 1097-6). Dann liegt das von der
  // Gesteinskörnung aufgenommene Kernwasser (Wasseraufnahme WA) im Kornvolumen V_G und zählt nicht zum wirksamen Wasser,
  // gehört aber zur Masse des Frischbetons: ρ_fb = (Σ Ausgangsstoffe trocken + wirksames Wasser + Kernwasser)/1 000 dm³.
  const kernwasser = fr.reduce((a, f, i) => a + f.trocken * (e.fraktionen[i].wa / 100), 0) + e.biochar * (e.biocharWa / 100);

  // Anrechenbare Zusatzstoffe: Flugasche f ≤ maxFaFaktor·z, Silikastaub s ≤ 0,11·z (DIN 1045-2); Überschuss wird nicht angerechnet
  const maxFa = e.maxFaFaktor * e.zement;
  const maxSf = K_WERT_DIN1045_2.maxSfFaktor * e.zement;
  // M-6 (Entscheidung 28.10.2026): XF2/XF4 – Anrechnung nur für Flugasche; bei gleichzeitiger Zugabe von Silikastaub
  // entfällt auch die Anrechnung der Flugasche (DIN 1045-2, Fußnote zur Grenzwerttabelle; 5.2.5.2.4 gilt „für alle
  // Expositionsklassen außer XF2 und XF4“). Öffentlich: SCHWENK, „Beton – Herstellung nach den aktuellen Normen“ (2026),
  // Fußnote 4 der Expositionstabelle; umwelt-online, DIN 1045-2, 5.2.5.2.4.
  const xfOhneSf = e.frostTausalz === true;
  const xfOhneFa = xfOhneSf && e.fa > 0 && e.sf > 0;
  const anrechenbarFa = xfOhneFa ? 0 : Math.min(e.fa, maxFa);
  const anrechenbarSf = xfOhneSf ? 0 : Math.min(e.sf, maxSf);
  if (!fehlerhaft && xfOhneSf && e.sf > 0) {
    hinweise.push({ stufe: 'warnung', feld: 'sf', text: xfOhneFa
      ? 'XF2/XF4: Bei gleichzeitiger Zugabe von Flugasche und Silikastaub ist keine Anrechnung zulässig – auch die Flugasche wird im äquivalenten w/z-Wert nicht angerechnet (DIN 1045-2).'
      : 'XF2/XF4: Silikastaub darf nicht auf w/z-Wert und Mindestzementgehalt angerechnet werden, nur Flugasche (DIN 1045-2).' });
  }
  // Runde 5 (Z55): Kombinationsregel Flugasche + Silikastaub (Alkalitätsreserve der Porenlösung)
  let maxFaKombination: number | null = null;
  if (!fehlerhaft && !xfOhneFa && e.fa > 0 && e.sf > 0 && e.zementArt !== undefined) {
    const g = kombinationsGrenze(e.zementArt);
    if (g === null) {
      hinweise.push({ stufe: 'warnung', feld: 'sf', text: `Flugasche und Silikastaub gemeinsam sind nach DIN 1045-2 mit ${e.zementArt} nicht zulässig (nur CEM I, CEM II-S, CEM II/A-D, CEM II-T, CEM II/A-LL, CEM III/A).` });
    } else {
      maxFaKombination = Math.max(0, 3 * (g - e.sf / e.zement)) * e.zement;
      if (e.fa > maxFaKombination + 1e-9) hinweise.push({ stufe: 'warnung', feld: 'fa', text: `Kombination Flugasche + Silikastaub: f/z ≤ 3·(${formatDeIntl(g)} − s/z) verletzt – höchstens ${formatDeIntl(Math.round(maxFaKombination))} kg/m³ Flugasche bei ${e.zementArt} (Alkalitätsreserve, DIN 1045-2).` });
    }
  }
  if (!fehlerhaft && !xfOhneSf && e.sf > maxSf + 1e-9) hinweise.push({ stufe: 'warnung', feld: 'sf', text: 'Silikastaub über s/z = 0,11: Der Überschuss wird im äquivalenten w/z-Wert nicht angerechnet.' });
  const bindemittelEq = e.zement + e.k.fa * anrechenbarFa + e.k.sf * anrechenbarSf + e.k.hues * e.hues + e.k.biochar * e.biochar;

  return {
    hinweise, fehlerhaft, vol, volGestein, masseGestein, fraktionen: fr,
    wasserAusGestein, wasserAusBiochar, zugabewasser: e.wasser - wasserAusGestein - wasserAusBiochar,
    kernwasser, gesamtwasser: e.wasser + kernwasser,
    biocharFeucht: e.biochar * (1 + e.biocharFeuchte / 100),
    wz: fehlerhaft ? NaN : e.wasser / e.zement,
    wzEq: fehlerhaft ? NaN : e.wasser / bindemittelEq,
    wb: fehlerhaft ? NaN : e.wasser / (e.zement + e.fa + e.sf + e.hues + e.biochar),
    maxFa, anrechenbarFa, maxSf, anrechenbarSf, maxFaKombination,
    volLeim: vol.zement + vol.wasser + vol.fa + vol.sf + vol.hues + vol.biochar + vol.zusatzmittel,
    rohdichte: fehlerhaft ? NaN : (e.zement + e.wasser + kernwasser + e.fa + e.sf + e.hues + e.biochar + e.zusatzmittel + e.stahlfaser + e.ppFaser + masseGestein) / 1000,
  };
}

// ---------------------------------------------------------------------------------------------------
// Walz-Kurven (src/modules/mischungsberechnung/WalzKurvenSection.tsx, AP 4.2 Runde 3)
// Näherung nach dem Abrams-Ansatz f_cm,28 = A / B^(w/z) mit B = 5 und A = 100 / 120 / 140 N/mm² für die
// Zementfestigkeitsklassen 32,5 / 42,5 / 52,5 (Lehrwerte, keine Normwerte; maßgebend sind Erstprüfungen).
// Geprüft in tests/demosBeton.test.ts.
// ---------------------------------------------------------------------------------------------------

export type WalzKlasse = 32.5 | 42.5 | 52.5;
export const WALZ_KLASSEN: readonly WalzKlasse[] = [32.5, 42.5, 52.5];
/** Lehrwerte A [N/mm²] je Zementfestigkeitsklasse */
export const WALZ_A: Readonly<Record<WalzKlasse, number>> = { 32.5: 100, 42.5: 120, 52.5: 140 };
/** Basis B des Abrams-Ansatzes */
export const WALZ_B = 5;
/** Darstellungsbereich der Kurven (w/z) */
export const WALZ_WZ_BEREICH = { min: 0.35, max: 0.8, schritt: 0.05 } as const;

/** Mittlere Würfeldruckfestigkeit nach 28 d [N/mm²] aus w/z und Zementfestigkeitsklasse */
export const walzFestigkeit = (wz: number, klasse: WalzKlasse) => WALZ_A[klasse] / Math.pow(WALZ_B, wz);

/** Stützstellen 0,35 … 0,80 im Abstand 0,05 (10 Werte, ohne Gleitkomma-Aufsummierung) */
export function walzStuetzstellen(): number[] {
  const { min, max, schritt } = WALZ_WZ_BEREICH;
  const n = Math.round((max - min) / schritt);
  return Array.from({ length: n + 1 }, (_, i) => Math.round((min + i * schritt) * 100) / 100);
}

export function walzKurve(wz: number, klasse: WalzKlasse) {
  const hinweise: Hinweis[] = [];
  if (!istEndlich(wz) || !(wz > 0)) hinweise.push({ stufe: 'fehler', feld: 'wz', text: 'Der Wasserzementwert muss größer als 0 sein.' });
  else if (wz < WALZ_WZ_BEREICH.min || wz > WALZ_WZ_BEREICH.max) hinweise.push({ stufe: 'warnung', feld: 'wz', text: 'Der w/z-Wert liegt außerhalb des dargestellten Bereichs 0,35 bis 0,80 – die Näherung ist dort nicht abgesichert.' });
  if (!(klasse in WALZ_A)) hinweise.push({ stufe: 'fehler', feld: 'klasse', text: 'Unbekannte Zementfestigkeitsklasse.' });
  const fehler = hinweise.some(x => x.stufe === 'fehler');
  const stuetzstellen = walzStuetzstellen();
  return {
    festigkeit: fehler ? NaN : walzFestigkeit(wz, klasse),
    stuetzstellen,
    kurven: WALZ_KLASSEN.map(k => ({ klasse: k, werte: stuetzstellen.map(x => walzFestigkeit(x, k)) })),
    gueltig: !fehler,
    hinweise,
  };
}

// ---------------------------------------------------------------------------------------------------
// Regelsieblinien A, B, C für Größtkorn 8, 16 und 32 mm (DIN 1045-2, Anhang L, Bilder L.1–L.3)
// ---------------------------------------------------------------------------------------------------
/**
 * Siebdurchgänge in M.-% der Regelsieblinien. DIN 1045-2 stellt sie in Anhang L (informativ) nur als Diagramm dar;
 * hinterlegt sind die üblichen Lehrbuchwerte der Regelsieblinien (bereits in DIN 1045:1988 enthalten), z. B. A16/B16/C16
 * bei 4/8 mm = 36/60, 56/76, 74/88 %.
 * Vorläufig, F-Freigabe: Abgleich mit den Bildern L.1–L.3 der DIN 1045-2 steht aus (öffentlich nur ohne Zahlenwerte
 * zugänglich). Bis 27.10.2026 standen im Modul abweichende Werte (z. B. A16/B16/C16 bei 4/8 mm = 35/50, 50/71, 71/85 %).
 * Siebweiten in mm; das oberste Sieb 31,5 mm wird wie bei den Fraktionen des Moduls als 32 mm geführt.
 */
export type Groesstkorn = 8 | 16 | 32;
export interface Regelsieblinie { siebe: readonly number[]; A: readonly number[]; B: readonly number[]; C: readonly number[] }
export const REGELSIEBLINIEN: Readonly<Record<Groesstkorn, Regelsieblinie>> = {
  8: { siebe: [0.25, 0.5, 1, 2, 4, 8], A: [5, 14, 21, 36, 61, 100], B: [11, 26, 42, 57, 74, 100], C: [21, 39, 57, 71, 85, 100] },
  16: { siebe: [0.25, 0.5, 1, 2, 4, 8, 16], A: [3, 8, 12, 21, 36, 60, 100], B: [8, 20, 32, 42, 56, 76, 100], C: [18, 34, 49, 62, 74, 88, 100] },
  32: { siebe: [0.25, 0.5, 1, 2, 4, 8, 16, 32], A: [2, 5, 8, 14, 23, 38, 62, 100], B: [8, 18, 28, 37, 47, 62, 80, 100], C: [15, 29, 42, 53, 65, 77, 89, 100] },
};

/** Durchgang einer Regelsieblinie an einem ihrer Siebe (M.-%); undefined, wenn das Sieb nicht zur Reihe gehört */
export function regelDurchgang(dmax: Groesstkorn, linie: 'A' | 'B' | 'C', sieb: number): number | undefined {
  const r = REGELSIEBLINIEN[dmax];
  const i = r.siebe.indexOf(sieb);
  return i < 0 ? undefined : r[linie][i];
}

export type SieblinienBereich = 'unter A' | 'A–B' | 'B–C' | 'über C';
/** Bereich eines Durchgangs an einem Sieb; Durchgänge genau auf A oder B zählen zum Bereich A–B, genau auf C zu B–C */
export function bereichAmSieb(dmax: Groesstkorn, sieb: number, durchgang: number): SieblinienBereich | undefined {
  const a = regelDurchgang(dmax, 'A', sieb), b = regelDurchgang(dmax, 'B', sieb), c = regelDurchgang(dmax, 'C', sieb);
  if (a === undefined || b === undefined || c === undefined || !Number.isFinite(durchgang)) return undefined;
  return durchgang < a ? 'unter A' : durchgang <= b ? 'A–B' : durchgang <= c ? 'B–C' : 'über C';
}

/**
 * Ist-Sieblinie aus den Fraktionsanteilen 0/4, 4/8, 8/16, 16/32 (M.-%) an den Sieben 4 mm … D_max und Einordnung je Sieb.
 * Unterhalb 4 mm ist die Ist-Linie aus den Fraktionen nicht bestimmbar (dafür wäre die Sieblinie des Sandes nötig). Das
 * Größtkorn-Sieb wird nicht eingeordnet; `bereich` ist nur gesetzt, wenn alle eingeordneten Siebe im selben Bereich liegen.
 */
export function istSieblinie(dmax: Groesstkorn, fraktionen: { f04: number; f48: number; f816: number; f1632: number }) {
  const s8 = fraktionen.f04 + fraktionen.f48, s16 = s8 + fraktionen.f816;
  const summen: Readonly<Record<number, number>> = { 4: fraktionen.f04, 8: s8, 16: s16, 32: s16 + fraktionen.f1632 };
  const punkte = REGELSIEBLINIEN[dmax].siebe.filter(d => d >= 4).map(d => ({ sieb: d, durchgang: summen[d] }));
  const eingeordnet = punkte.filter(p => p.sieb < dmax).map(p => ({ ...p, bereich: bereichAmSieb(dmax, p.sieb, p.durchgang) }));
  const bereiche = new Set(eingeordnet.map(p => p.bereich));
  const bereich: SieblinienBereich | undefined = bereiche.size === 1 ? eingeordnet[0]?.bereich : undefined;
  return { punkte, eingeordnet, bereich };
}
