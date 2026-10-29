/**
 * Version und Stand der ausgelieferten Fassung – automatisch statt von Hand (Gutachten 29.10.2026, 4.1/4.6).
 * - Version: aus package.json (nur gelesen; tests/versionData.test.ts sichert den Gleichstand mit VERSION_HISTORY[0]).
 * - Stand: Build-Datum (Europe/Berlin), von vite.config.ts als __BB_STAND__ eingesetzt und über process.env.BB_STAND
 *   an Vorrendern, Startseiten-Schale und Sitemap weitergegeben. Ohne Build (tsx, Tests) gilt der heutige Tag.
 * Der Änderungsverlauf (VERSION_HISTORY) behält seine eigenen Daten je Versionseintrag.
 */
import { version as PAKET_VERSION } from '../../package.json';

declare const __BB_STAND__: string | undefined;

/** Kalendertag in Europe/Berlin als JJJJ-MM-TT */
export function tagIso(d: Date = new Date()): string {
  return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
}

/** JJJJ-MM-TT → TT.MM.JJJJ */
export function isoZuDe(iso: string): string {
  const [j, m, t] = iso.split('-');
  return `${t}.${m}.${j}`;
}

const ISO = /^\d{4}-\d{2}-\d{2}$/;

function ermittleStand(): string {
  if (typeof __BB_STAND__ === 'string' && ISO.test(__BB_STAND__)) return __BB_STAND__;
  const env = typeof process !== 'undefined' ? process.env?.BB_STAND : undefined;
  return env && ISO.test(env) ? env : tagIso();
}

/** Versionsnummer mit „v“, z. B. v4.3.0 */
export const APP_VERSION = `v${PAKET_VERSION}`;
/** Stand (Build-Datum) als JJJJ-MM-TT, z. B. für sitemap lastmod */
export const STAND_ISO: string = ermittleStand();
/** Stand (Build-Datum) als TT.MM.JJJJ */
export const STAND_DE: string = isoZuDe(STAND_ISO);
