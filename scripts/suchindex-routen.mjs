/**
 * Routen des Volltextindex (public/suchindex.json) – gemeinsam genutzt von scripts/gen-suchindex.mjs
 * und tests/suchindexAktuell.test.ts (Prüfung, dass der Index zur Registry passt).
 * Liest die IDs ohne TypeScript-Import aus src/registry/modules.ts (der Generator läuft mit node).
 */
import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

/** Nicht indexiert: Trenner, Admin, Rechtstexte, Versionshistorie */
export const NICHT_INDEXIERT = ['admin', 'impressum', 'datenschutz', 'barrierefreiheit', 'versionen'];

/** Alle Modul-IDs der Registry in Reihenfolge (Textauszug zwischen MODULE-Beginn und -Ende) */
export function registryIds(quelle = fs.readFileSync(path.join(ROOT, 'src/registry/modules.ts'), 'utf8')) {
  const teil = quelle.slice(quelle.indexOf('export const MODULE = ['), quelle.indexOf('] as const satisfies readonly ModulEintrag[]'));
  return [...teil.matchAll(/^\s*\{ id: '([a-z0-9_-]+)'/gm)].map(m => m[1]);
}

/**
 * Inaktive Modul-IDs (Menügruppe in INAKTIVE_GRUPPEN, src/registry/modules.ts) aus dem Text: Gruppenliste aus der
 * einzeiligen Konstante, Gruppe je Eintrag aus dessen erster Zeile (tests/lernpfadeInaktiv.test.ts prüft den Gleichlauf
 * mit INAKTIVE_MODULE).
 */
export function inaktiveIds(quelle = fs.readFileSync(path.join(ROOT, 'src/registry/modules.ts'), 'utf8')) {
  const zeile = /^export const INAKTIVE_GRUPPEN[^=]*=\s*\[(.*)\];\s*$/m.exec(quelle);
  if (!zeile) throw new Error('suchindex-routen: INAKTIVE_GRUPPEN nicht gefunden (einzeilig lassen)');
  const gruppen = new Set([...zeile[1].matchAll(/'([^']+)'/g)].map(m => m[1]));
  const teil = quelle.slice(quelle.indexOf('export const MODULE = ['), quelle.indexOf('] as const satisfies readonly ModulEintrag[]'));
  return [...teil.matchAll(/^\s*\{ id: '([a-z0-9_-]+)'[^\n]*?gruppe: '([^']+)'/gm)].filter(m => gruppen.has(m[2])).map(m => m[1]);
}

/** IDs, die im Suchindex stehen müssen (ohne inaktive Seiten) */
export function suchindexRouten(ids = registryIds(), inaktiv = inaktiveIds()) {
  return ids.filter(id => !id.startsWith('divider_') && !NICHT_INDEXIERT.includes(id) && !inaktiv.includes(id));
}
