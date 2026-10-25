/**
 * Vite-Plugin „modul-kopf“ (Umsetzungsplan Phase 5, AP 5.5): stellt die Kopfdaten eines Fachmoduls
 * (Lernziele, Kurzfassung, Erkundungsauftrag, Rechner-Grenzen) je Modul als eigenen kleinen Chunk bereit.
 * Vorher lagen alle Einträge (~87 kB gzip) in einem Chunk, den jede Modulseite vor dem Rendern lud.
 * Die Datendateien in src/data/ bleiben die einzige Quelle; Tests importieren sie weiterhin direkt.
 *
 * Virtuelle Module:
 *   virtual:modul-kopf               ladeKopf: moduleId → () => import('virtual:modul-kopf/kopf-<id>')
 *   virtual:modul-kopf/kopf-<id>     { lernziele?, kurzfassung?, erkundung?, grenzen? } eines Moduls
 * Die Grenzen werden wie zur Laufzeit über grenzenFuer() ermittelt (Unterreiter der Stahlbetonbemessung).
 */
import path from 'path';
import { build } from 'esbuild';
import type { Plugin } from 'vite';

export const MODUL_KOPF_ID = 'virtual:modul-kopf';
const AUFGELOEST = '\0' + MODUL_KOPF_ID;
const DATEN = ['lernziele', 'kurzfassung', 'erkundung', 'rechnerGrenzen'];

export interface KopfEintrag { lernziele?: unknown; kurzfassung?: unknown; erkundung?: unknown; grenzen?: unknown }

/** Kopfdaten aller Module aus den Datendateien (per esbuild gebündelt und ausgewertet) */
export async function ladeKopfdaten(datenDir = path.resolve(process.cwd(), 'src/data')): Promise<{ eintraege: Map<string, KopfEintrag>; dateien: string[] }> {
  const datei = (n: string) => JSON.stringify(path.join(datenDir, n + '.ts'));
  const ergebnis = await build({
    stdin: {
      contents: `export { LERNZIELE } from ${datei('lernziele')};\n`
        + `export { KURZFASSUNG } from ${datei('kurzfassung')};\n`
        + `export { ERKUNDUNG } from ${datei('erkundung')};\n`
        + `export { RECHNER_GRENZEN, STAHLBETON_REITER, grenzenFuer } from ${datei('rechnerGrenzen')};\n`,
      resolveDir: datenDir, loader: 'ts',
    },
    bundle: true, format: 'esm', platform: 'node', write: false, metafile: true, logLevel: 'silent',
  });
  const code = ergebnis.outputFiles[0].text;
  const m = await import('data:text/javascript;base64,' + Buffer.from(code).toString('base64'));
  const eintraege = new Map<string, KopfEintrag>();
  const setze = (id: string, feld: keyof KopfEintrag, wert: unknown) => {
    if (wert === undefined) return;
    eintraege.set(id, { ...eintraege.get(id), [feld]: wert });
  };
  for (const [id, w] of Object.entries(m.LERNZIELE)) setze(id, 'lernziele', w);
  for (const [id, w] of Object.entries(m.KURZFASSUNG)) setze(id, 'kurzfassung', w);
  for (const [id, w] of Object.entries(m.ERKUNDUNG)) setze(id, 'erkundung', w);
  // alle IDs mit Grenzen: Einträge der Tabelle + Unterreiter, die über grenzenFuer() erben
  const kandidaten = new Set<string>([...Object.keys(m.RECHNER_GRENZEN), ...m.STAHLBETON_REITER]);
  for (const id of kandidaten) setze(id, 'grenzen', m.grenzenFuer(id));
  // Pfade im Metafile sind relativ zum Arbeitsverzeichnis von esbuild (cwd)
  const dateien = Object.keys(ergebnis.metafile!.inputs).filter(f => !f.startsWith('<')).map(f => path.resolve(process.cwd(), f));
  return { eintraege, dateien };
}

export function modulKopfPlugin(datenDir?: string): Plugin {
  let cache: Promise<Awaited<ReturnType<typeof ladeKopfdaten>>> | undefined;
  const daten = () => (cache ??= ladeKopfdaten(datenDir));
  return {
    name: 'modul-kopf',
    buildStart() { cache = undefined; },
    resolveId(id) {
      if (id === MODUL_KOPF_ID || id.startsWith(MODUL_KOPF_ID + '/')) return '\0' + id;
    },
    async load(id) {
      if (id !== AUFGELOEST && !id.startsWith(AUFGELOEST + '/')) return;
      const { eintraege, dateien } = await daten();
      for (const f of dateien) this.addWatchFile(f);
      if (id === AUFGELOEST) {
        const lader = [...eintraege.keys()].sort().map(m => `  ${JSON.stringify(m)}: () => import(${JSON.stringify(`${MODUL_KOPF_ID}/kopf-${encodeURIComponent(m)}`)})`);
        return `export const ladeKopf = {\n${lader.join(',\n')}\n};\n`;
      }
      const kopf = /^kopf-(.+)$/.exec(id.slice(AUFGELOEST.length + 1));
      const eintrag = kopf && eintraege.get(decodeURIComponent(kopf[1]));
      if (!eintrag) this.error(`modul-kopf: unbekanntes Modul ${id}`);
      return `export default JSON.parse(${JSON.stringify(JSON.stringify(eintrag))});\n`;
    },
    // Dev-Server: Änderung an einer Datendatei → Cache verwerfen, virtuelle Module neu laden
    async handleHotUpdate(ctx) {
      if (!cache) return;
      const { dateien } = await cache;
      if (!dateien.includes(path.resolve(ctx.file))) return;
      cache = undefined;
      for (const m of ctx.server.moduleGraph.idToModuleMap.values()) if (m.id?.startsWith(AUFGELOEST)) ctx.server.moduleGraph.invalidateModule(m);
      ctx.server.ws.send({ type: 'full-reload' });
      return [];
    },
  };
}
