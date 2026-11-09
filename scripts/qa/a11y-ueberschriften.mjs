#!/usr/bin/env node
/**
 * Überschriftenfolge zur Laufzeit (a11y 09.11.2026): prüft die gerenderte Hierarchie aller sichtbaren Überschriften
 * (h1–h6 und role="heading" mit aria-level) je Route und je Reiter – über Komponentengrenzen hinweg (Modulrahmen →
 * eingebettete Komponente), was die statische Ratsche in tests/a11yRegler1109.test.ts nicht sieht.
 * Gemeldet wird jeder Sprung um mehr als eine Ebene nach unten (z. B. h2 → h4, WCAG 1.3.1 / 2.4.6), mit Route,
 * Reiterpfad, beiden Überschriftentexten und dem nächsten Vorfahren mit data-modul/id als Fundhinweis.
 * Reiter werden wie in a11y-reiter.mjs angeklickt (alle sichtbaren role="tab" im Hauptbereich, verschachtelte eine Ebene tief).
 *
 *   node scripts/qa/a11y-ueberschriften.mjs (--routen a,b | --alle) [--modi desk,mob] [--basis URL] [--teil k/n] [--json datei]
 *     --alle   alle Routen der Modul-Registry (wie a11y.mjs)
 *     --json   Befunde zusätzlich als JSON schreiben
 * Ausgang 1, wenn mindestens ein Sprung gefunden wurde. Voraussetzungen: playwright, gebaute App muss laufen.
 */
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { seitenUrl } from './seitenUrl.mjs';

const lade = async n => { try { return await import(n); } catch { return createRequire(import.meta.url)(n); } };
const { chromium } = await lade('playwright');

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
const MODI = (wert('--modi') ?? 'desk').split(',');
const JSON_DATEI = wert('--json');
if (!ROUTEN.length) { console.error('--routen a,b,… oder --alle angeben'); process.exit(2); }

const ALLE = {
  desk: { viewport: { width: 1440, height: 900 }, scheme: 'light' },
  mob: { viewport: { width: 390, height: 844 }, scheme: 'light', mobil: true },
};
const exe = process.env.CHROMIUM_PATH || (fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);
const browser = await chromium.launch(exe ? { executablePath: exe } : {});

const SICHTBARE_REITER = 'main [role="tab"]:visible';
const befunde = [];
const gesehen = new Set();
let zustaende = 0;

/** Sprünge der gerenderten Überschriften (im Browser ausgewertet) */
function spruengeImDokument() {
  const sichtbar = el => {
    if (el.closest('[aria-hidden="true"], [hidden], [inert]')) return false;
    if (typeof el.checkVisibility === 'function' && !el.checkVisibility({ visibilityProperty: true })) return false;
    return el.getClientRects().length > 0;
  };
  const ebene = el => {
    const a = Number(el.getAttribute('aria-level'));
    if (el.getAttribute('role') === 'heading') return a >= 1 ? a : 2;
    if (el.getAttribute('role') && el.getAttribute('role') !== 'heading') return 0; // Rolle überschrieben → keine Überschrift
    return a >= 1 ? a : Number(el.tagName[1]);
  };
  const text = el => (el.textContent ?? '').replace(/\s+/g, ' ').trim().slice(0, 80);
  const fund = el => {
    const v = el.closest('[id]:not([id^="radix-"]):not([id^="«"]):not([id^=":"]):not([id^="_r"])');
    return v ? `#${v.id}` : '';
  };
  const liste = [...document.querySelectorAll('h1, h2, h3, h4, h5, h6, [role="heading"]')]
    .filter(sichtbar).map(el => ({ el, n: ebene(el) })).filter(x => x.n > 0);
  const aus = [];
  for (let i = 1; i < liste.length; i++) {
    const a = liste[i - 1], b = liste[i];
    if (b.n > a.n + 1) aus.push({ von: `h${a.n}`, nach: `h${b.n}`, vorher: text(a.el), text: text(b.el), fund: fund(b.el), inMain: !!b.el.closest('main') });
  }
  return aus;
}

/** wartet, bis nachgeladene Reiter (React.lazy/Suspense) gerendert sind: Netz ruhig, kein Platzhalter im Hauptbereich */
async function warteAufInhalt(page) {
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForFunction(() => !document.querySelector('main [aria-busy="true"], main .animate-spin'), null, { timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(250);
}

async function pruefe(page, modus, id, reiter) {
  await warteAufInhalt(page);
  zustaende++;
  for (const s of await page.evaluate(spruengeImDokument)) {
    const schluessel = `${id}|${s.von}>${s.nach}|${s.vorher}|${s.text}`;
    if (gesehen.has(schluessel)) continue; // gleicher Sprung in mehreren Reitern/Modi nur einmal
    gesehen.add(schluessel);
    befunde.push({ modus, route: id, reiter, ...s });
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
  const ctx = await browser.newContext({ viewport: m.viewport, colorScheme: m.scheme, isMobile: !!m.mobil, hasTouch: !!m.mobil, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  for (const id of ROUTEN) {
    await page.goto('about:blank');
    await page.goto(seitenUrl(BASIS, id), { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    const oben = await reiterNamen(page);
    if (!oben.length) { await pruefe(page, modus, id, ''); continue; }
    for (const a of oben) {
      if (!(await klicke(page, a))) continue;
      await pruefe(page, modus, id, a);
      const unter = (await reiterNamen(page)).filter(x => !oben.includes(x));
      for (const b of unter) {
        if (!(await klicke(page, b))) continue;
        await pruefe(page, modus, id, `${a} › ${b}`);
      }
    }
  }
  await ctx.close();
}
await browser.close();

if (JSON_DATEI) fs.writeFileSync(JSON_DATEI, JSON.stringify(befunde, null, 1));
console.log(`${zustaende} Zustände (Route × Reiter, ${MODI.join(', ')}) auf ${ROUTEN.length} Routen geprüft`);
if (befunde.length) {
  for (const b of befunde) console.error(`${b.modus}:${b.route}${b.reiter ? `[${b.reiter}]` : ''} ${b.von} → ${b.nach}: „${b.vorher}“ → „${b.text}“${b.fund ? ` (${b.fund})` : ''}${b.inMain ? '' : ' [außerhalb main]'}`);
  console.error(`${befunde.length} Sprünge in der Überschriftenfolge.`);
  process.exit(1);
}
console.log('0 Sprünge in der Überschriftenfolge.');
