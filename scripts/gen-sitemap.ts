/**
 * Erzeugt public/sitemap.xml aus der zentralen Modul-Registry (src/registry/modules.ts).
 * Aufruf: npm run gen:sitemap   ·   Prüfung in CI: tests/registry.test.ts (Datei muss aktuell sein)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { AKTIVE_MODULE, NAV_GRUPPEN, type ModulEintrag } from '../src/registry/modules';
import { CURRENT_RELEASE_DATE } from '../src/data/versionData';

const BASIS = 'https://baustoffboard.de/';

export function sitemapEintraege(): ModulEintrag[] {
  // ohne inaktive Seiten (INAKTIVE_GRUPPEN)
  return AKTIVE_MODULE.filter(m => m.meta && m.id !== 'start' && m.id !== 'admin' && !m.id.startsWith('divider_'));
}

export function erzeugeSitemap(): string {
  const [t, mo, j] = CURRENT_RELEASE_DATE.split('.');
  const lastmod = `${j}-${mo}-${t}`;
  const url = (loc: string, freq: string, prio: string) =>
    `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${freq}</changefreq>\n    <priority>${prio}</priority>\n  </url>`;
  const teile: string[] = ['<?xml version="1.0" encoding="UTF-8"?>', '<!-- Generiert aus src/registry/modules.ts (npm run gen:sitemap) – nicht von Hand bearbeiten -->', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">', url(BASIS, 'daily', '1.0')];
  const eintraege = sitemapEintraege();
  for (const g of [...NAV_GRUPPEN, undefined]) {
    const inGruppe = eintraege.filter(m => m.gruppe === g);
    if (!inGruppe.length) continue;
    teile.push('', `  <!-- ${g ?? 'Direktlinks (ohne Menüeintrag)'} -->`);
    for (const m of inGruppe) teile.push(url(`${BASIS}modul/${m.id}`, 'weekly', g ? '0.8' : '0.6'));
  }
  teile.push('</urlset>', '');
  return teile.join('\n');
}

const ziel = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'sitemap.xml');
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  fs.writeFileSync(ziel, erzeugeSitemap());
  console.log(`sitemap.xml: ${sitemapEintraege().length + 1} URLs`);
}
