/**
 * Vite-Plugin „inhalt-einbetten“ (Umsetzungsplan Phase 5, AP 5.3): setzt die Werte aus content/**.json
 * beim Build und im Dev-Server direkt an den Verweisstellen ein.
 *
 *   import inhalt from '@/content/bauchemie/Bauchemie.json';
 *   … <MdText text={inhalt.texte.einleitung} /> …   →   … <MdText text={"Die Bauchemie …"} /> …
 *
 * Grund: Ein importiertes JSON-Objekt brächte Schlüsselnamen und Verweise zusätzlich in jeden Modul-Chunk
 * (gemessen +15 % gzip im Median). Eingebettet entsteht derselbe Chunk-Inhalt wie vor der Auslagerung; die
 * Texte bleiben im Chunk des Moduls (kein Einstieg, kein gemeinsamer Chunk). Verweise der Form
 * `<name>.<gruppe>.<schlüssel>` bzw. `<name>.<gruppe>["schlüssel"]` werden ersetzt; bleibt der Name danach
 * noch anderweitig in Gebrauch, bleibt auch der Import stehen (dann lädt Vite die JSON wie üblich).
 * Unbekannte Schlüssel brechen den Build ab. Tests (tsx) und tsc lesen die JSON-Dateien direkt.
 */
import fs from 'fs';
import path from 'path';
import type { Plugin } from 'vite';

const IMPORT = /^import\s+([A-Za-z_$][\w$]*)\s+from\s+'(@\/content\/[^']+\.json)';[ \t]*\n?/gm;

/** Ersetzt Verweise in einem Quelltext; Rückgabe null, wenn nichts zu tun ist. Exportiert für Tests. */
export function inhaltEinbetten(code: string, lade: (importPfad: string) => Record<string, Record<string, unknown>>): { code: string; dateien: string[] } | null {
  const importe = [...code.matchAll(IMPORT)];
  if (!importe.length) return null;
  let aus = code;
  const dateien: string[] = [];
  for (const m of importe) {
    const [zeile, name, pfad] = m;
    const json = lade(pfad);
    dateien.push(pfad);
    const esc = name.replace(/\$/g, '\\$');
    const ref = new RegExp(`(?<![\\w$.])${esc}\\.(texte|werte|daten)(?:\\.([A-Za-zÄÖÜäöüß_$][\\wÄÖÜäöüß$]*)|\\[("(?:[^"\\\\]|\\\\.)*")\\])(?![\\w$])`, 'g');
    aus = aus.replace(ref, (_t, gruppe: string, k1: string | undefined, k2: string | undefined) => {
      const k = k1 ?? (JSON.parse(k2!) as string);
      const g = json[gruppe];
      if (!g || !Object.prototype.hasOwnProperty.call(g, k)) throw new Error(`inhalt-einbetten: ${pfad} → ${gruppe}.${k} fehlt`);
      const v = JSON.stringify(g[k]);
      return typeof g[k] === 'object' && g[k] !== null ? `(${v})` : v;
    });
    // noch in Gebrauch? (Pfade wie '@/src/components/inhalt/MdText' zählen nicht)
    if (!new RegExp(`(?<![\\w$./])${esc}(?![\\w$/])`).test(aus.replace(zeile, ''))) aus = aus.replace(zeile, '');
  }
  return { code: aus, dateien };
}

export function inhaltEinbettenPlugin(wurzel = process.cwd()): Plugin {
  const src = path.resolve(wurzel, 'src') + path.sep;
  return {
    name: 'inhalt-einbetten',
    enforce: 'pre',
    transform(code, id) {
      const datei = id.split('?')[0];
      if (!datei.startsWith(src) || !/\.tsx?$/.test(datei) || !code.includes("from '@/content/")) return;
      const r = inhaltEinbetten(code, p => JSON.parse(fs.readFileSync(path.join(wurzel, p.slice(2)), 'utf8')));
      if (!r) return;
      for (const p of r.dateien) this.addWatchFile(path.join(wurzel, p.slice(2)));
      return { code: r.code, map: null };
    },
  };
}
