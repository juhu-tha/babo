#!/usr/bin/env node
/**
 * Mobil-Layout-Prüfung (Umsetzungsplan Phase 2, AP 2.6/2.7)
 * Zählt je Route bei 390 px: abgeschnittene Elemente (rechts über den Rand, nicht in einem
 * scrollbaren Container) und Bedienelemente unter 24 × 24 px (WCAG 2.2, 2.5.8).
 *   node scripts/qa/layout-mobil.mjs [--basis URL] [--routen a,b,c]
 * Voraussetzung: npm i --no-save playwright
 */
import fs from 'fs';
import path from 'path';
const { chromium } = await import('playwright');
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const ai = n => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : undefined; };
const BASIS = ai('--basis') ?? 'http://localhost:4173/';
const reg = fs.readFileSync(path.join(ROOT, 'src/registry/modules.ts'), 'utf8');
const teil = reg.slice(reg.indexOf('export const MODULE = ['), reg.indexOf('] as const satisfies readonly ModulEintrag[]'));
const alle = [...teil.matchAll(/^ {2}\{ id: '([a-z0-9_-]+)'/gm)].map(m => m[1]).filter(id => !id.startsWith('divider_') && id !== 'admin');
const routen = ai('--routen')?.split(',') ?? alle;
const exe = process.env.CHROMIUM_PATH || (fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);
const b = await chromium.launch(exe ? { executablePath: exe } : {});
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
const p = await ctx.newPage();
const erg = {};
for (const id of routen) {
  await p.goto('about:blank');
  await p.goto(`${BASIS}#${id}`, { waitUntil: 'networkidle' });
  await p.waitForTimeout(250);
  erg[id] = await p.evaluate(() => {
    const vw = window.innerWidth;
    const inScroll = el => { for (let e = el.parentElement; e && e.tagName !== 'MAIN' && e !== document.body; e = e.parentElement) { const s = getComputedStyle(e); if (/(auto|scroll)/.test(s.overflowX) && e.scrollWidth > e.clientWidth) return true; if (/(hidden|clip)/.test(s.overflowX) && e !== document.body && e.getBoundingClientRect().right <= vw + 1) return true; } return false; };
    const sichtbar = el => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'; };
    const raus = [...document.querySelectorAll('header *, main *')].filter(e => sichtbar(e) && e.getBoundingClientRect().right > vw + 2 && getComputedStyle(e).position !== 'fixed' && !inScroll(e));
    const klein = [...document.querySelectorAll('main button, main a[href], main input:not([type=hidden]), main select, header button')].filter(e => {
      if (!sichtbar(e)) return false;
      const r = e.getBoundingClientRect();
      if (e.tagName === 'A' && getComputedStyle(e).display === 'inline') return false; // Links im Fließtext ausgenommen (2.5.8)
      return r.width < 24 || r.height < 24;
    });
    const m = document.querySelector('main'); return { seitlich: m ? Math.max(0, m.scrollWidth - m.clientWidth) : 0, abgeschnitten: raus.length, kleineZiele: klein.length, beispiele: raus.slice(0, 3).map(e => e.tagName + '.' + String(e.className).slice(0, 60)) };
  });
}
await b.close();
const s = Object.values(erg);
console.log(`${s.length} Routen · abgeschnitten gesamt ${s.reduce((a, x) => a + x.abgeschnitten, 0)} (Routen mit Befund: ${s.filter(x => x.abgeschnitten).length}) · kleine Ziele gesamt ${s.reduce((a, x) => a + x.kleineZiele, 0)}`);
for (const [id, x] of Object.entries(erg).sort((a, b) => b[1].abgeschnitten - a[1].abgeschnitten).slice(0, 15)) console.log(`  ${id}: ${x.abgeschnitten} abgeschnitten, seitlich ${x.seitlich}px, ${x.kleineZiele} klein  ${x.beispiele.join(' | ')}`);
if (process.argv.includes('--json')) fs.writeFileSync(path.join(ROOT, 'docs/layout-mobil.json'), JSON.stringify(erg, null, 1) + '\n');
