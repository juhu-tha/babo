/**
 * Vite-Plugin „sitemap-stand“ (Gutachten 29.10.2026, 4.6): public/sitemap.xml wird ohne <lastmod> gepflegt
 * (scripts/gen-sitemap.ts, tests/registry.test.ts prüft Gleichstand mit der Registry). Beim Build setzt dieses
 * Plugin in dist/sitemap.xml je URL <lastmod> mit dem Build-Datum (process.env.BB_STAND, s. src/data/stand.ts).
 * Eigene Datei ohne Registry-Import, damit vite.config.ts schlank bleibt.
 */
import fs from 'fs';
import path from 'path';
import type { Plugin } from 'vite';

/** setzt nach jedem <loc>…</loc> ein <lastmod> (vorhandene <lastmod> werden ersetzt) */
export function mitLastmod(xml: string, iso: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) throw new Error(`sitemap-stand: ungültiges Datum ${iso}`);
  return xml
    .replace(/\n\s*<lastmod>[^<]*<\/lastmod>/g, '')
    .replace(/^(\s*)(<loc>[^<]*<\/loc>)$/gm, (_, einzug: string, loc: string) => `${einzug}${loc}\n${einzug}<lastmod>${iso}</lastmod>`);
}

export function sitemapStandPlugin(stand: () => string): Plugin {
  let outDir = 'dist';
  let ssr = false;
  return {
    name: 'sitemap-stand',
    apply: 'build',
    configResolved(c) { outDir = path.resolve(c.root, c.build.outDir); ssr = !!c.build.ssr; },
    closeBundle() {
      if (ssr) return;
      const datei = path.join(outDir, 'sitemap.xml');
      if (!fs.existsSync(datei)) return;
      fs.writeFileSync(datei, mitLastmod(fs.readFileSync(datei, 'utf8'), stand()));
    },
  };
}
