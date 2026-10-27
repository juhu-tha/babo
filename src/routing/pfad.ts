// Pfad-Routing (Z52): Fachmodule liegen unter /modul/<id>, die Startseite unter /.
// Alte Direktlinks /#<id> (Lesezeichen, QR-Codes in Folien) werden beim Laden per history.replaceState auf
// /modul/<id> umgeschrieben – ohne neuen Seitenabruf, also ohne Ladeschleife (TabContext.tsx).
// Reine Funktionen ohne Registry-Import: auch im Server, in Tests und im Vorrender-Skript nutzbar.
// Die Inline-Skripte scripts/startschale-boot.js und scripts/vorladen-boot.js wiederholen die Regel für den
// Browser vor dem Einstiegs-Chunk (tests/pfadRouting.test.ts prüft den Gleichlauf).

export const MODUL_PRAEFIX = '/modul/';

/** Kanonischer Pfad eines Moduls ('start' → '/') */
export function modulPfad(id: string): string {
  return id === 'start' ? '/' : MODUL_PRAEFIX + encodeURIComponent(id);
}

/** Modul-ID aus einem Pfad: '/' → 'start', '/modul/<id>' → id (klein, dekodiert), sonst null */
export function tabAusPfad(pfad: string): string | null {
  if (pfad === '/' || pfad === '' || pfad === '/index.html') return 'start';
  const m = /^\/modul\/([^/]+)\/?$/.exec(pfad);
  if (!m) return null;
  try { return decodeURIComponent(m[1]).trim().toLowerCase() || null; } catch { return null; }
}

/** Modul-ID aus einem alten Hash-Link ('#glas' → 'glas'), leer → null */
export function tabAusHash(hash: string): string | null {
  try {
    const h = decodeURIComponent(hash.replace(/^#/, '')).trim().toLowerCase();
    return h || null;
  } catch { return null; }
}
