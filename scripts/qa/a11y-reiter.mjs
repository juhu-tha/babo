#!/usr/bin/env node
/**
 * axe-Prüfung aller Reiter (role="tab") einzelner Routen. Der Routenlauf (scripts/qa/a11y.mjs) sieht nur den
 * jeweils ersten Reiter; hier wird jeder Reiter (auch verschachtelte, eine Ebene tief) angeklickt und geprüft.
 * Ohne Baseline: jeder Verstoß (WCAG 2.1 A/AA, alle Schweregrade, dazu WCAG 2.2 AA target-size) bricht ab.
 *   node scripts/qa/a11y-reiter.mjs (--routen a,b | --alle) [--modi desk,mob,desk-dunkel] [--basis URL] [--details]
 *     --alle  alle Routen der Modul-Registry (wie a11y.mjs); Routen ohne Reiter werden einmal geprüft
 *     --teil k/n  nur jede n-te Route ab k (parallele Läufe)
 * Voraussetzungen wie a11y.mjs: npm i --no-save playwright @axe-core/playwright, gebaute App muss laufen.
 */
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { seitenUrl } from './seitenUrl.mjs';

const lade = async n => { try { return await import(n); } catch { return createRequire(import.meta.url)(n); } };
const { chromium } = await lade('playwright');
const { AxeBuilder } = await lade('@axe-core/playwright');

const wert = n => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : undefined; };
const BASIS = wert('--basis') ?? 'http://localhost:4173/';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
function registryRouten() {
  const reg = fs.readFileSync(path.join(ROOT, 'src/registry/modules.ts'), 'utf8');
  const teil = reg.slice(reg.indexOf('export const MODULE = ['), reg.indexOf('] as const satisfies readonly ModulEintrag[]'));
  return [...teil.matchAll(/^ {2}\{ id: '([a-z0-9_-]+)'/gm)].map(m => m[1]).filter(id => !id.startsWith('divider_') && id !== 'admin');
}
const [TEIL_K, TEIL_N] = (wert('--teil') ?? '1/1').split('/').map(Number);
if (!(TEIL_N >= 1 && TEIL_K >= 1 && TEIL_K <= TEIL_N)) { console.error('--teil k/n mit 1 ≤ k ≤ n'); process.exit(2); }
const ROUTEN = (process.argv.includes('--alle') ? registryRouten() : (wert('--routen') ?? '').split(',').filter(Boolean))
  .filter((_, i) => i % TEIL_N === TEIL_K - 1);
const MODI = (wert('--modi') ?? 'desk,mob,desk-dunkel').split(',');
const DETAILS = process.argv.includes('--details');
if (!ROUTEN.length) { console.error('--routen a,b,… oder --alle angeben'); process.exit(2); }

const ALLE = {
  desk: { viewport: { width: 1440, height: 900 }, scheme: 'light' },
  mob: { viewport: { width: 390, height: 844 }, scheme: 'light', mobil: true },
  'desk-dunkel': { viewport: { width: 1440, height: 900 }, scheme: 'dark' },
};
const exe = process.env.CHROMIUM_PATH || (fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);
const browser = await chromium.launch(exe ? { executablePath: exe } : {});

const SICHTBARE_REITER = 'main [role="tab"]:visible';
const verstoesse = [];
let pruefungen = 0;

async function pruefe(page, schluessel) {
  await page.waitForTimeout(250);
  const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
  pruefungen++;
  for (const v of r.violations) {
    verstoesse.push(`${schluessel} ${v.id} (${v.impact}): ${v.nodes.length}`);
    if (DETAILS) for (const n of v.nodes.slice(0, 8)) {
      // bei color-contrast das Element nennen, das den Hintergrund liefert (oft ein Vorfahr mit anderer Klasse)
      const hg = n.any?.[0]?.relatedNodes?.[0]?.html?.match(/class="([^"]*)"/)?.[1];
      verstoesse.push(`    ${n.target.join(' ')} ${(n.failureSummary ?? '').split('\n').slice(1, 2).join('').trim().slice(0, 160)}${hg ? ` [Hintergrund: .${hg.slice(0, 120)}]` : ''}`);
    }
  }
}

async function reiterNamen(page) {
  return page.locator(SICHTBARE_REITER).evaluateAll(els => els.map(e => (e.textContent ?? '').trim().replace(/\s+/g, ' ')));
}

async function klicke(page, name) {
  const loc = page.locator(SICHTBARE_REITER).filter({ hasText: name });
  const n = await loc.count();
  for (let i = 0; i < n; i++) {
    const t = ((await loc.nth(i).textContent()) ?? '').trim().replace(/\s+/g, ' ');
    if (t === name) { await loc.nth(i).click(); return true; }
  }
  return false;
}

for (const modus of MODI) {
  const m = ALLE[modus];
  if (!m) { console.error(`Unbekannter Modus ${modus}`); process.exit(2); }
  const ctx = await browser.newContext({ viewport: m.viewport, colorScheme: m.scheme, isMobile: !!m.mobil, hasTouch: !!m.mobil });
  await ctx.addInitScript(s => { try { localStorage.setItem('theme', s); } catch { /* ignorieren */ } }, m.scheme);
  const page = await ctx.newPage();
  for (const id of ROUTEN) {
    await page.goto('about:blank');
    await page.goto(seitenUrl(BASIS, id), { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    const oben = await reiterNamen(page);
    if (!oben.length) { await pruefe(page, `${modus}:${id}`); continue; }
    for (const a of oben) {
      if (!(await klicke(page, a))) continue;
      await pruefe(page, `${modus}:${id}[${a}]`);
      const unter = (await reiterNamen(page)).filter(x => !oben.includes(x));
      for (const b of unter) {
        if (!(await klicke(page, b))) continue;
        await pruefe(page, `${modus}:${id}[${a} › ${b}]`);
      }
    }
  }
  await ctx.close();
}
await browser.close();

console.log(`${pruefungen} Reiter-Prüfungen (${MODI.join(', ')}) auf ${ROUTEN.length} Routen`);
if (verstoesse.length) { console.error(verstoesse.join('\n')); process.exit(1); }
console.log('0 Verstöße.');
