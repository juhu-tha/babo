/**
 * Rechenkern Frischbeton: Bewertung des Luftgehalts von LP-Beton (Druckausgleichsverfahren, DIN EN 12350-7).
 * Übernommen aus src/modules/Frischbeton.tsx (Modulprüfung Tranche 3, Befund T3-FB-1):
 *  - Mindestluftgehalt für LP-Beton nach DIN 1045-2, Tab. F.2.2, Fußnote: Größtkorn 8/16/32/63 mm → 5,5/4,5/4,0/3,5 Vol.-%.
 *  - Obere Grenze: festgelegter Mindestwert + 4 % (absolut), DIN EN 206, 5.4.3 – ein Grenzwert der Norm, kein Richtwert
 *    (öffentlich wiedergegeben u. a. bei Glinicki, M. A.: Właściwe napowietrzenie betonu, Budownictwo, Technologie,
 *    Architektura 2/2004: „Górną granicę zawartości powietrza stanowi wyspecyfikowana wartość minimalna powiększona o 4 %“).
 *  - Einzelwerte dürfen den unteren Grenzwert um höchstens 0,5 % (absolut) unterschreiten und den oberen Grenzwert um
 *    höchstens 1,0 % (absolut) überschreiten (Konformitätskriterien für andere Eigenschaften als die Festigkeit,
 *    DIN EN 206-1:2001 Tab. 17; umwelt-online). Ergebnisse zwischen Grenzwert und Grenzabweichung zählen für die
 *    Annahmekennzahl. Tabellennummer in DIN EN 206:2021 vorläufig, F-Freigabe.
 * Vorher: Die Obergrenze hieß „empfohlener Maximalwert (~4 % über Sollwert)“, und ein zu hoher Luftgehalt wurde mit
 * „Mindestluftporengehalt unterschritten“ gemeldet.
 * Reiner Rechenkern – geprüft in tests/frischbeton.test.ts.
 */
import { type Hinweis, istEndlich, hatFehler, muss } from './plausibilitaet';

export type LpKlasse = 'XF2' | 'XF4' | 'X0_XF1_XF3';
export type GroesstkornLp = 8 | 16 | 32 | 63;

/** Mindestluftgehalt (Mittelwert) in Vol.-% nach DIN 1045-2, Tab. F.2.2, Fußnote */
export const MINDEST_LUFTGEHALT: Readonly<Record<GroesstkornLp, number>> = { 8: 5.5, 16: 4.5, 32: 4.0, 63: 3.5 };
/** zulässige Unterschreitung des Mindestwerts durch Einzelwerte [Vol.-%, absolut] */
export const LP_UNTERSCHREITUNG_EINZELWERT = 0.5;
/** obere Grenze = Mindestwert + 4 % (absolut), DIN EN 206, 5.4.3 */
export const LP_SPANNE_OBERGRENZE = 4.0;
/** zulässige Überschreitung der oberen Grenze durch Einzelwerte [Vol.-%, absolut] */
export const LP_UEBERSCHREITUNG_EINZELWERT = 1.0;

/** Mindestluftgehalt in Vol.-% für die Klasse und das Größtkorn; 0 ohne LP-Anforderung */
export function mindestLuftgehalt(klasse: LpKlasse, dmax: GroesstkornLp): number {
  if (klasse === 'X0_XF1_XF3') return 0;
  return MINDEST_LUFTGEHALT[dmax] ?? MINDEST_LUFTGEHALT[32];
}

/**
 * keineAnforderung: Klasse ohne LP-Anforderung
 * erfuellt: Mindestwert ≤ L ≤ obere Grenze
 * unterMindestwert / ueberObergrenze: außerhalb des Grenzwerts, aber innerhalb der Grenzabweichung für Einzelwerte
 * unterschritten / ueberschritten: Einzelwert außerhalb der Grenzabweichung – nicht konform
 */
export type LpBewertung = 'keineAnforderung' | 'erfuellt' | 'unterMindestwert' | 'ueberObergrenze' | 'unterschritten' | 'ueberschritten';

export interface LuftgehaltEingabe {
  /** abgelesener Luftgehalt am Manometer [Vol.-%] */
  ablesung: number;
  /** Korrekturwert der Gesteinskörnung G [Vol.-%] */
  gesteinskorrektur: number;
  klasse: LpKlasse;
  dmax: GroesstkornLp;
}

export interface LuftgehaltErgebnis {
  /** Luftgehalt L = Ablesung − G [Vol.-%] */
  luftgehalt: number;
  mindestwert: number;
  einzelwertMin: number;
  obergrenze: number;
  einzelwertMax: number;
  bewertung: LpBewertung;
  /** Einzelwert innerhalb der Grenzabweichungen (konform als Einzelwert) */
  einzelwertKonform: boolean;
  gueltig: boolean;
  hinweise: Hinweis[];
}

export function bewerteLuftgehalt(e: LuftgehaltEingabe): LuftgehaltErgebnis {
  const hinweise: Hinweis[] = [];
  muss(hinweise, istEndlich(e.ablesung, e.gesteinskorrektur), 'eingabe', 'Ablesung und Gesteinskorrektur müssen Zahlen sein.');
  if (!hatFehler(hinweise)) {
    muss(hinweise, e.ablesung >= 0 && e.ablesung <= 20, 'ablesung', 'Der abgelesene Luftgehalt muss zwischen 0 und 20 Vol.-% liegen.');
    muss(hinweise, e.gesteinskorrektur >= 0 && e.gesteinskorrektur <= e.ablesung, 'gesteinskorrektur', 'Die Gesteinskorrektur muss ≥ 0 und höchstens gleich der Ablesung sein.');
  }
  const mindestwert = mindestLuftgehalt(e.klasse, e.dmax);
  const ohne = mindestwert === 0;
  const einzelwertMin = ohne ? 0 : mindestwert - LP_UNTERSCHREITUNG_EINZELWERT;
  const obergrenze = ohne ? NaN : mindestwert + LP_SPANNE_OBERGRENZE;
  const einzelwertMax = ohne ? NaN : obergrenze + LP_UEBERSCHREITUNG_EINZELWERT;
  if (hatFehler(hinweise)) {
    return { luftgehalt: NaN, mindestwert, einzelwertMin, obergrenze, einzelwertMax, bewertung: 'keineAnforderung', einzelwertKonform: false, gueltig: false, hinweise };
  }
  const L = e.ablesung - e.gesteinskorrektur;
  const tol = 1e-9;
  let bewertung: LpBewertung;
  if (ohne) bewertung = 'keineAnforderung';
  else if (L < einzelwertMin - tol) bewertung = 'unterschritten';
  else if (L < mindestwert - tol) bewertung = 'unterMindestwert';
  else if (L <= obergrenze + tol) bewertung = 'erfuellt';
  else if (L <= einzelwertMax + tol) bewertung = 'ueberObergrenze';
  else bewertung = 'ueberschritten';
  const einzelwertKonform = bewertung !== 'unterschritten' && bewertung !== 'ueberschritten';
  return { luftgehalt: L, mindestwert, einzelwertMin, obergrenze, einzelwertMax, bewertung, einzelwertKonform, gueltig: true, hinweise };
}
