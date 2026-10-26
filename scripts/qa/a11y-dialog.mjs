#!/usr/bin/env node
/**
 * axe-Prüfung des geöffneten Barrierefreiheits-Dialogs (src/components/a11y/A11yPanel.tsx).
 * Der Routenlauf (scripts/qa/a11y.mjs) sieht den Dialog nie geöffnet; hier wird er in allen vier
 * Darstellungen geprüft: hell/dunkel × normaler/hoher Kontrast. Ohne Baseline: jeder Verstoß der
 * Schwere „critical“ oder „serious“ im Dialog bricht ab.
 *   node scripts/qa/a11y-dialog.mjs [--basis URL]   (gebaute App muss laufen)
 * Voraussetzungen wie a11y.mjs: npm i --no-save playwright @axe-core/playwright
 */
import fs from 'fs';
import { createRequire } from 'module';

const lade = async n => { try { return await import(n); } catch { return createRequire(import.meta.url)(n); } };
const { chromium } = await lade('playwright');
const { AxeBuilder } = await lade('@axe-core/playwright');

const i = process.argv.indexOf('--basis');
const BASIS = i > 0 ? process.argv[i + 1] : 'http://localhost:4173/';
const DIALOG = '[role="dialog"][aria-label="Barrierefreiheits-Einstellungen"]';
const exe = process.env.CHROMIUM_PATH || (fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);
const browser = await chromium.launch(exe ? { executablePath: exe } : {});

const faelle = [];
for (const scheme of ['light', 'dark']) for (const kontrast of [false, true]) for (const breite of ['standard', 'wide', 'full']) faelle.push({ scheme, kontrast, breite });
const fehler = [];
for (const f of faelle) {
  const name = `${f.scheme === 'dark' ? 'dunkel' : 'hell'}${f.kontrast ? '+kontrast' : ''} (${f.breite})`;
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: f.scheme });
  await ctx.addInitScript(([s, k, b]) => {
    try {
      localStorage.setItem('theme', s);
      localStorage.setItem('baustoffboard_screen_width', b);
      localStorage.setItem('th_bauboard_a11y_prefs', JSON.stringify({ fontSizeScale: 1, highContrast: k, dyslexicFont: false, reducedMotion: true, focusHighlight: false }));
    } catch { /* ignorieren */ }
  }, [f.scheme, f.kontrast, f.breite]);
  const page = await ctx.newPage();
  await page.goto(`${BASIS}#start`, { waitUntil: 'networkidle' });
  await page.click('#a11y-toggle-btn');
  await page.waitForSelector(DIALOG);
  await page.waitForTimeout(300);
  const r = await new AxeBuilder({ page }).include(DIALOG).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  const v = r.violations.filter(x => x.impact === 'critical' || x.impact === 'serious');
  console.log(`${name}: ${v.length ? v.map(x => `${x.id} (${x.nodes.length})`).join(', ') : 'ok'}`);
  for (const x of v) for (const n of x.nodes) fehler.push(`${name} ${x.id}: ${n.target.join(' ')} – ${n.failureSummary?.split('\n').slice(1).join(' ').trim()}`);
  await ctx.close();
}
await browser.close();
if (fehler.length) { console.error('Verstöße im A11y-Dialog:\n' + fehler.join('\n')); process.exit(1); }
console.log(`A11y-Dialog: ${faelle.length} Darstellungen ohne Verstöße.`);
