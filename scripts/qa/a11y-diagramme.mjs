#!/usr/bin/env node
/**
 * Diagramm-Textalternativen (Paket Z8, src/lib/diagrammAlternative.tsx) auf Routen mit Chart.js-Diagrammen:
 * hell/dunkel (Desktop) und Mobil (390 px). Der Routenlauf (scripts/qa/a11y.mjs) sieht die Datentabellen nie
 * geöffnet; hier wird je Route
 *   1. jedes Diagramm gezeichnet (Seite durchscrollen) und geprüft: Leinwand mit role="img" und aria-label,
 *   2. in jedem Diagramm die Tabelle geöffnet (caption, th scope="col"/"row", aria-expanded="true"),
 *   3. axe (WCAG 2.1 A/AA) auf die Diagrammhüllen angewandt – jeder Verstoß „critical“/„serious“ bricht ab,
 *   4. die Druckansicht geprüft: Schaltfläche und Tabelle ausgeblendet, Kurzbeschreibung sichtbar.
 *   node scripts/qa/a11y-diagramme.mjs [--basis URL] [--routen a,b,c]   (gebaute App muss laufen)
 * Voraussetzungen wie a11y.mjs: npm i --no-save playwright @axe-core/playwright
 */
import fs from 'fs';
import { createRequire } from 'module';
import { seitenUrl } from './seitenUrl.mjs';

const lade = async n => { try { return await import(n); } catch { return createRequire(import.meta.url)(n); } };
const { chromium } = await lade('playwright');
const { AxeBuilder } = await lade('@axe-core/playwright');

const wert = n => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : undefined; };
const BASIS = wert('--basis') ?? 'http://localhost:4173/';
// kriechen: 3 Liniendiagramme mit fester Behälterhöhe (Tabelle über der Fläche); festigkeit: Balkendiagramm;
// bruchmechanik: Liniendiagramm mit Punkten verschiedener x-Werte
const ROUTEN = wert('--routen')?.split(',') ?? ['kriechen', 'festigkeit', 'bruchmechanik'];
const MODI = [
  { name: 'hell', viewport: { width: 1440, height: 900 }, scheme: 'light' },
  { name: 'dunkel', viewport: { width: 1440, height: 900 }, scheme: 'dark' },
  { name: 'mobil', viewport: { width: 390, height: 844 }, scheme: 'light', mobil: true },
];

const exe = process.env.CHROMIUM_PATH || (fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);
const browser = await chromium.launch(exe ? { executablePath: exe } : {});
const fehler = [];
let diagramme = 0, tabellen = 0;

for (const m of MODI) {
  const ctx = await browser.newContext({ viewport: m.viewport, colorScheme: m.scheme, isMobile: !!m.mobil, hasTouch: !!m.mobil });
  await ctx.addInitScript(s => { try { localStorage.setItem('theme', s); } catch { /* ignorieren */ } }, m.scheme);
  const page = await ctx.newPage();
  for (const id of ROUTEN) {
    const wo = `${m.name} #${id}`;
    await page.goto('about:blank');
    await page.goto(seitenUrl(BASIS, id), { waitUntil: 'networkidle' });
    // durchscrollen, damit alle Diagramme gezeichnet werden (Zeichnen nach Sichtbarkeit)
    await page.evaluate(async () => {
      for (const p of document.querySelectorAll('[data-diagramm-platzhalter]')) { p.scrollIntoView({ block: 'center' }); await new Promise(r => setTimeout(r, 150)); }
      window.scrollTo(0, 0);
    });
    await page.waitForFunction(() => !document.querySelector('[data-diagramm-platzhalter]'), null, { timeout: 15000 }).catch(() => fehler.push(`${wo}: Diagramme nicht gezeichnet`));
    const zustand = await page.evaluate(() => [...document.querySelectorAll('[data-diagramm]')].map(h => {
      const c = h.querySelector('canvas');
      return { canvas: !!c, role: c?.getAttribute('role'), label: c?.getAttribute('aria-label') ?? '', knopf: !!h.querySelector(':scope > div > button[aria-expanded]') };
    }));
    if (!zustand.length) { fehler.push(`${wo}: keine Diagrammhülle gefunden`); continue; }
    diagramme += zustand.length;
    zustand.forEach((z, i) => {
      if (!z.canvas || z.role !== 'img' || z.label.trim().length < 8) fehler.push(`${wo} Diagramm ${i + 1}: Leinwand ohne role="img"/aria-label (${JSON.stringify(z)})`);
    });
    // alle Tabellen öffnen und Aufbau prüfen
    const knoepfe = page.locator('[data-diagramm] button[aria-expanded="false"]');
    for (let i = await knoepfe.count(); i > 0; i--) {
      const k = knoepfe.first();
      await k.scrollIntoViewIfNeeded();
      await k.click();
    }
    const tab = await page.evaluate(() => [...document.querySelectorAll('[data-diagramm] [role="region"]')].map(r => ({
      caption: !!r.querySelector('table > caption')?.textContent?.trim(),
      col: r.querySelectorAll('th[scope="col"]').length,
      row: r.querySelectorAll('th[scope="row"]').length,
      expanded: document.querySelector(`[aria-controls="${r.id}"]`)?.getAttribute('aria-expanded'),
    })));
    tabellen += tab.length;
    if (tab.length !== zustand.filter(z => z.knopf).length) fehler.push(`${wo}: ${tab.length} Tabellen offen, ${zustand.filter(z => z.knopf).length} Schaltflächen`);
    tab.forEach((t, i) => { if (!t.caption || t.col < 2 || t.row < 1 || t.expanded !== 'true') fehler.push(`${wo} Tabelle ${i + 1}: ${JSON.stringify(t)}`); });
    await page.waitForTimeout(200);
    const r = await new AxeBuilder({ page }).include('[data-diagramm]').withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    const v = r.violations.filter(x => x.impact === 'critical' || x.impact === 'serious');
    for (const x of v) for (const n of x.nodes) fehler.push(`${wo} ${x.id}: ${n.target.join(' ')} – ${n.failureSummary?.split('\n').slice(1).join(' ').trim()}`);
    // Druckansicht: Bedienelemente weg, Kurzbeschreibung da
    await page.emulateMedia({ media: 'print' });
    const druck = await page.evaluate(() => [...document.querySelectorAll('[data-diagramm]')].map(h => ({
      knopf: [...h.querySelectorAll('button, [role="region"]')].some(e => e.getClientRects().length > 0),
      text: [...h.querySelectorAll(':scope > p')].some(p => p.getClientRects().length > 0 && p.textContent.trim().length > 8),
    })));
    await page.emulateMedia({ media: 'screen' });
    druck.forEach((d, i) => { if (d.knopf || !d.text) fehler.push(`${wo} Diagramm ${i + 1} im Druck: ${JSON.stringify(d)}`); });
    console.log(`${wo}: ${zustand.length} Diagramme, ${tab.length} Tabellen, ${v.length ? v.map(x => `${x.id} (${x.nodes.length})`).join(', ') : 'axe ok'}`);
  }
  await ctx.close();
}
await browser.close();
if (fehler.length) { console.error('Diagramm-Textalternativen:\n' + fehler.join('\n')); process.exit(1); }
console.log(`Diagramm-Textalternativen: ${diagramme} Diagramme, ${tabellen} Tabellen in ${MODI.length} Darstellungen ohne Befund.`);
