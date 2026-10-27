// Strukturierte Daten in index.html (Gutachten 27.10.2026, Maßnahme 9): JSON-LD parsebar, ohne HTML-Entities,
// eine Domain wie canonical/robots.txt/Sitemap, Modul-URLs zeigen auf vorhandene Routen.
import fs from 'fs';
import { MODUL_BY_ID } from '../src/registry/modules';

const fehler: string[] = [];
const pruefe = (ok: boolean, msg: string) => { if (!ok) fehler.push(msg); };
console.log('--- Test: JSON-LD in index.html ---');

const html = fs.readFileSync('index.html', 'utf8');
const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1] ?? '';
const domain = new URL(canonical).origin;
pruefe(domain === 'https://baustoffboard.de', `canonical-Domain ${domain}`);
pruefe(fs.readFileSync('public/robots.txt', 'utf8').includes(`Sitemap: ${domain}/sitemap.xml`), 'robots.txt verweist auf eine andere Domain');
pruefe(fs.readFileSync('public/sitemap.xml', 'utf8').includes(`<loc>${domain}/</loc>`), 'Sitemap nutzt eine andere Domain');

const bloecke = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => m[1]);
pruefe(bloecke.length > 0, 'kein JSON-LD-Block gefunden');

const texte: string[] = [];
const sammle = (v: unknown) => {
  if (typeof v === 'string') texte.push(v);
  else if (Array.isArray(v)) v.forEach(sammle);
  else if (v && typeof v === 'object') Object.values(v).forEach(sammle);
};
for (const [i, b] of bloecke.entries()) {
  let daten: unknown;
  try { daten = JSON.parse(b); } catch (e) { fehler.push(`JSON-LD-Block ${i + 1} nicht parsebar: ${(e as Error).message}`); continue; }
  sammle(daten);
}
// In <script> werden Entities nicht aufgelöst – „&amp;“ stünde wörtlich in den Daten
for (const t of texte) pruefe(!/&(?:[a-z]+|#\d+|#x[0-9a-f]+);/i.test(t), `HTML-Entity im JSON-LD: „${t.slice(0, 80)}“`);
const urls = texte.filter(t => /^https?:\/\//.test(t));
for (const u of urls.filter(u => /baustoffboard/.test(u))) {
  pruefe(u.startsWith(`${domain}/`), `JSON-LD-URL mit abweichender Domain: ${u}`);
  const id = u.match(/\/modul\/([a-z0-9_-]+)$/)?.[1];
  if (id) pruefe(MODUL_BY_ID.has(id), `JSON-LD verweist auf unbekanntes Modul ${id}`);
}
pruefe(!texte.some(t => /Prüfkörper-Statik\b/.test(t)), 'Tippfehler „Prüfkörper-Statik“');

if (fehler.length) { fehler.forEach(f => console.log('FAIL', f)); process.exit(1); }
console.log(`OK: ${bloecke.length} JSON-LD-Block, ${texte.length} Texte, ${urls.length} URLs, Domain ${domain}`);
