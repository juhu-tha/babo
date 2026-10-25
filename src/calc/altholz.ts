/**
 * Sortierbilanz einer sensorgestützten Altholzsortierung (AP 6.2 c, Modul „Altholz-NIR-Sortierung und Urban Mining“).
 *
 * Modell: Der Eingangsstrom besteht aus den Massen m_k der tatsächlichen Altholzkategorien k = A I … A IV
 * (AltholzV § 2). Ein Sortierer lenkt jede Kategorie mit dem Ausbringen a_k in ihre Ziellinie:
 *   Ziellinie „stofflich“   (Holzwerkstoffe):  A I, A II
 *   Ziellinie „energetisch“ (Feuerung nach 17. BImSchV): A III, A IV
 * Der Rest (1 − a_k) · m_k landet in der jeweils anderen Linie (Fehlsortierung).
 *
 *   M_st   = Σ_{I,II} a_k m_k + Σ_{III,IV} (1 − a_k) m_k
 *   M_en   = M_in − M_st
 *   M_F    = Σ_k (1 − a_k) m_k                 Fehlsortierquote  q_F  = M_F / M_in
 *   Reinheit stoffliche Linie                 R_st = Σ_{I,II} a_k m_k / M_st
 *   stoffliche Verwertungsquote               q_st = Σ_{I,II} a_k m_k / M_in   (nur richtig sortiertes A I/A II)
 *
 * A III wird hier vereinfachend der energetischen Linie zugeordnet; nach AltholzV Anhang I ist eine stoffliche
 * Verwertung nur zulässig, wenn Lacke und Beschichtungen weitgehend entfernt werden. Die Warnschwelle für A IV
 * im Stoffstrom ist eine Lehrannahme (Richtwert), kein Grenzwert der AltholzV – dort gelten die
 * Schadstoffgrenzwerte des Anhangs II für Holzhackschnitzel und -späne.
 * Reiner Rechenkern – geprüft in tests/altholz.test.ts.
 */
import { type Hinweis, istEndlich, muss, hatFehler } from './plausibilitaet';

export const ALTHOLZ_KATEGORIEN = ['AI', 'AII', 'AIII', 'AIV'] as const;
export type AltholzKategorie = (typeof ALTHOLZ_KATEGORIEN)[number];

export const KATEGORIE_NAME: Readonly<Record<AltholzKategorie, string>> = {
  AI: 'A I', AII: 'A II', AIII: 'A III', AIV: 'A IV',
};

/** Ziellinie je Kategorie im Lehrmodell */
export const ZIEL_STOFFLICH: Readonly<Record<AltholzKategorie, boolean>> = {
  AI: true, AII: true, AIII: false, AIV: false,
};

/** Lehrwerte (Richtwerte, keine Anlagendaten) */
export const ALTHOLZ_LEHRWERTE = {
  /** Warnschwelle Anteil A IV im stofflichen Strom [-] (Lehrannahme) */
  aIVImStoffstromWarnung: 0.005,
  /** Warnschwelle Fehlsortierquote [-] (Lehrannahme) */
  fehlsortierWarnung: 0.1,
  /** Warnschwelle Ausbringen [-]: darunter ist eine Sortierung wenig wirksam (Lehrannahme) */
  ausbringenWarnung: 0.8,
} as const;

export interface AltholzEingabe {
  /** Massen je tatsächlicher Kategorie [t] */
  masse: Readonly<Record<AltholzKategorie, number>>;
  /** Ausbringen je Kategorie in ihre Ziellinie [-], 0 … 1 */
  ausbringen: Readonly<Record<AltholzKategorie, number>>;
}

export interface AltholzStrom {
  kategorie: AltholzKategorie;
  /** Masse im Eingang [t] */
  m: number;
  /** Masse in der stofflichen Linie [t] */
  inStofflich: number;
  /** Masse in der energetischen Linie [t] */
  inEnergetisch: number;
  /** fehlsortierte Masse [t] */
  fehl: number;
}

export interface AltholzErgebnis {
  mIn: number;
  /** Masse stoffliche Linie [t] */
  mSt: number;
  /** Masse energetische Linie [t] */
  mEn: number;
  /** fehlsortierte Masse [t] */
  mFehl: number;
  /** Fehlsortierquote [-] */
  qFehl: number;
  /** Reinheit der stofflichen Linie [-] */
  reinheitSt: number;
  /** Anteil A IV in der stofflichen Linie [-] */
  anteilAIVSt: number;
  /** stoffliche Verwertungsquote [-] */
  qSt: number;
  /** maximal mögliche stoffliche Quote bei idealer Sortierung (Anteil A I + A II) [-] */
  qStMax: number;
  stroeme: AltholzStrom[];
  hinweise: Hinweis[];
}

const LEER = (hinweise: Hinweis[]): AltholzErgebnis => ({
  mIn: NaN, mSt: NaN, mEn: NaN, mFehl: NaN, qFehl: NaN, reinheitSt: NaN, anteilAIVSt: NaN, qSt: NaN, qStMax: NaN, stroeme: [], hinweise,
});

export function sortierbilanz(e: AltholzEingabe): AltholzErgebnis {
  const hinweise: Hinweis[] = [];
  const massen = ALTHOLZ_KATEGORIEN.map(k => e.masse[k]);
  const ausbr = ALTHOLZ_KATEGORIEN.map(k => e.ausbringen[k]);
  muss(hinweise, istEndlich(...massen), 'masse', 'Alle Massen müssen Zahlen sein.');
  muss(hinweise, istEndlich(...ausbr), 'ausbringen', 'Alle Ausbringen müssen Zahlen sein.');
  if (hatFehler(hinweise)) return LEER(hinweise);

  muss(hinweise, massen.every(m => m >= 0), 'masse', 'Massen dürfen nicht negativ sein.');
  muss(hinweise, ausbr.every(a => a >= 0 && a <= 1), 'ausbringen', 'Das Ausbringen muss zwischen 0 und 100 % liegen.');
  const mIn = massen.reduce((s, m) => s + m, 0);
  muss(hinweise, mIn > 0, 'masse', 'Die Eingangsmasse muss größer als 0 sein.');
  if (hatFehler(hinweise)) return LEER(hinweise);

  const stroeme: AltholzStrom[] = ALTHOLZ_KATEGORIEN.map(k => {
    const m = e.masse[k], a = e.ausbringen[k];
    const richtig = a * m, fehl = (1 - a) * m;
    return ZIEL_STOFFLICH[k]
      ? { kategorie: k, m, inStofflich: richtig, inEnergetisch: fehl, fehl }
      : { kategorie: k, m, inStofflich: fehl, inEnergetisch: richtig, fehl };
  });
  const mSt = stroeme.reduce((s, x) => s + x.inStofflich, 0);
  const mEn = stroeme.reduce((s, x) => s + x.inEnergetisch, 0);
  const mFehl = stroeme.reduce((s, x) => s + x.fehl, 0);
  const richtigSt = stroeme.filter(x => ZIEL_STOFFLICH[x.kategorie]).reduce((s, x) => s + x.inStofflich, 0);
  const aIVSt = stroeme.find(x => x.kategorie === 'AIV')?.inStofflich ?? 0;
  const qStMax = (e.masse.AI + e.masse.AII) / mIn;

  const reinheitSt = mSt > 0 ? richtigSt / mSt : NaN;
  const anteilAIVSt = mSt > 0 ? aIVSt / mSt : 0;
  const qFehl = mFehl / mIn;

  if (mSt <= 0) warnung(hinweise, 'masse', 'Die stoffliche Linie bleibt leer – im Eingang ist kein A I/A II vorhanden oder das Ausbringen ist 0.');
  if (anteilAIVSt > ALTHOLZ_LEHRWERTE.aIVImStoffstromWarnung) {
    warnung(hinweise, 'ausbringen', 'A IV im stofflichen Strom über 0,5 % (Lehrannahme): Holzschutzmittel können die Grenzwerte nach Anhang II AltholzV überschreiten – Charge analysieren oder nachsortieren.');
  }
  if (qFehl > ALTHOLZ_LEHRWERTE.fehlsortierWarnung) warnung(hinweise, 'ausbringen', 'Fehlsortierquote über 10 % (Lehrannahme): Sensorik, Vorzerkleinerung oder Bandbelegung prüfen.');
  if (ausbr.some(a => a < ALTHOLZ_LEHRWERTE.ausbringenWarnung)) warnung(hinweise, 'ausbringen', 'Ausbringen unter 80 % in mindestens einer Kategorie: Die Sortierung ist dort wenig wirksam.');
  if (e.masse.AIV / mIn > 0.5) warnung(hinweise, 'masse', 'Mehr als die Hälfte A IV im Eingang: Eine stoffliche Linie lohnt sich dann kaum.');

  return { mIn, mSt, mEn, mFehl, qFehl, reinheitSt, anteilAIVSt, qSt: richtigSt / mIn, qStMax, stroeme, hinweise };
}

function warnung(h: Hinweis[], feld: string, text: string) {
  h.push({ stufe: 'warnung', feld, text });
}
