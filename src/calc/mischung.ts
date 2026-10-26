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

/** Anrechenbare Flugasche f ≤ Faktor·z nach Zementart (Lehrstand; Präzisierung nach DIN 1045-2 offen, AP 4.4) */
export function maxFaFaktor(zementArt: string): number {
  return zementArt === 'CEM I' || zementArt === 'CEM II/A' ? 0.33 : zementArt === 'CEM II/B' ? 0.25 : 0;
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
  if (Math.abs(summe - 100) >= 0.1) h.push({ stufe: 'warnung', feld: 'fraktionen', text: `Die Fraktionsanteile ergeben ${summe.toLocaleString('de-DE')} % statt 100 %.` });
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
    hinweise.push({ stufe: 'fehler', feld: 'zement', text: `Leim, Luft und Fasern füllen bereits ${Math.round(volOhneGestein).toLocaleString('de-DE')} dm³ – für die Gesteinskörnung bleibt kein Stoffraum.` });
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

  // Anrechenbare Zusatzstoffe: Flugasche f ≤ maxFaFaktor·z, Silikastaub s ≤ 0,11·z (DIN 1045-2)
  const maxFa = e.maxFaFaktor * e.zement;
  const anrechenbarFa = Math.min(e.fa, maxFa);
  const maxSf = 0.11 * e.zement;
  const anrechenbarSf = Math.min(e.sf, maxSf);
  const bindemittelEq = e.zement + e.k.fa * anrechenbarFa + e.k.sf * anrechenbarSf + e.k.hues * e.hues + e.k.biochar * e.biochar;

  return {
    hinweise, fehlerhaft, vol, volGestein, masseGestein, fraktionen: fr,
    wasserAusGestein, wasserAusBiochar, zugabewasser: e.wasser - wasserAusGestein - wasserAusBiochar,
    biocharFeucht: e.biochar * (1 + e.biocharFeuchte / 100),
    wz: fehlerhaft ? NaN : e.wasser / e.zement,
    wzEq: fehlerhaft ? NaN : e.wasser / bindemittelEq,
    wb: fehlerhaft ? NaN : e.wasser / (e.zement + e.fa + e.sf + e.hues + e.biochar),
    maxFa, anrechenbarFa, maxSf, anrechenbarSf,
    volLeim: vol.zement + vol.wasser + vol.fa + vol.sf + vol.hues + vol.biochar + vol.zusatzmittel,
    rohdichte: fehlerhaft ? NaN : (e.zement + e.wasser + e.fa + e.sf + e.hues + e.biochar + e.zusatzmittel + e.stahlfaser + e.ppFaser + masseGestein) / 1000,
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
