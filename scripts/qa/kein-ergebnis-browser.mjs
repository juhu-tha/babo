#!/usr/bin/env node
/**
 * Browserprüfung „Kein Ergebnis in der Anzeige“ (02.11.2026, docs/pruefung/kein-ergebnis-anzeige-2026-11-02.md).
 * Bedient auf jeder Rechner-Route (scripts/qa/rechner-routen.mjs) in jedem Reiter (eine Ebene verschachtelt) die
 * ersten Zahleneingaben nacheinander mit ungültigen Werten (0, leer, −1) und die Regler mit ihren Bereichsgrenzen
 * (min, max – andere Werte sind dort nicht eingebbar) und prüft den sichtbaren Text:
 *   - kein „NaN“, „Infinity“, „undefined“
 *   - kein Erfolgstext („erfüllt“, „eingehalten“, „nachgewiesen“, „ok“ …), der erst durch die ungültige Eingabe
 *     erscheint oder neben „–“ steht, während ein Fehlerhinweis („Eingabe unzulässig“) angezeigt wird
 *   - keine Konsolenfehler / Seitenausnahmen
 *   node scripts/qa/kein-ergebnis-browser.mjs (--routen a,b | --alle) [--basis URL] [--teil k/n] [--json datei]
 * Voraussetzungen wie a11y-reiter.mjs (playwright, gebaute App muss laufen).
 */
import fs from 'fs';
import { createRequire } from 'module';
import { seitenUrl } from './seitenUrl.mjs';
import { rechnerRouten } from './rechner-routen.mjs';

const lade = async (n) => { try { return await import(n); } catch { return createRequire(import.meta.url)(n); } };
const { chromium } = await lade('playwright');

const wert = (n) => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : undefined; };
const BASIS = wert('--basis') ?? 'http://localhost:4173/';
const [TEIL_K, TEIL_N] = (wert('--teil') ?? '1/1').split('/').map(Number);
const ROUTEN = (process.argv.includes('--alle') ? rechnerRouten().map((r) => r.id) : (wert('--routen') ?? '').split(',').filter(Boolean))
  .filter((_, i) => i % TEIL_N === TEIL_K - 1);
const MAX_EINGABEN = Number(wert('--max') ?? 6);
const MAX_REGLER = Number(wert('--max-regler') ?? 8);
const WERTE = ['0', '', '-1'];
if (!ROUTEN.length) { console.error('--routen a,b,… oder --alle angeben'); process.exit(2); }

const exe = process.env.CHROMIUM_PATH || (fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);
const browser = await chromium.launch(exe ? { executablePath: exe } : {});
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
let konsole = [];
page.on('console', (m) => { if (m.type() === 'error') konsole.push(m.text().slice(0, 200)); });
page.on('pageerror', (e) => konsole.push('Ausnahme: ' + String(e.message).slice(0, 200)));

const REITER = 'main [role="tab"]:visible';
const ROH = /\bNaN\b|\bInfinity\b|\bundefined\b/;
const ERFOLG = /\b(erfüllt|eingehalten|nachgewiesen|ausreichend|bestanden|zulässig|OK|ok)\b|✓|✔/;
const VERNEINT = /nicht|un(zulässig|zureichend)|überschritten|kein|ohne|Eingabe unzulässig|wenn|falls|Prüfe|prüfen|ob\b/i;

const reiterNamen = () => page.locator(REITER).evaluateAll((els) => els.map((e) => (e.textContent ?? '').trim().replace(/\s+/g, ' ')));
async function klicke(name) {
  const loc = page.locator(REITER); const n = await loc.count();
  for (let i = 0; i < n; i++) if (((await loc.nth(i).textContent()) ?? '').trim().replace(/\s+/g, ' ') === name) { await loc.nth(i).click(); await page.waitForTimeout(250); return true; }
  return false;
}
const text = () => page.locator('main').innerText().catch(() => '');
const erfolgsZeilen = (t) => t.split('\n').map((z) => z.trim()).filter((z) => ERFOLG.test(z) && !VERNEINT.test(z) && z.length < 160);

const zeilen = []; // je Route/Reiter
const befunde = [];

async function pruefeZustand(id, reiter) {
  const eingaben = page.locator('main input:visible:not([type=range]):not([type=checkbox]):not([type=radio]):not([type=search]):not([type=file]):not([readonly]):not([disabled])');
  const n = Math.min(await eingaben.count(), MAX_EINGABEN);
  const zeile = { id, reiter, felder: 0, regler: 0, faelle: 0, fehlerhinweis: 0, befunde: 0 };
  konsole = [];
  const basis = await text();
  if (ROH.test(basis)) { befunde.push({ id, reiter, feld: '(Ausgangszustand)', wert: '', art: 'Rohwert', text: basis.match(new RegExp(`.{0,60}(${ROH.source}).{0,40}`))?.[0] }); zeile.befunde++; }
  const basisErfolg = new Set(erfolgsZeilen(basis));
  const pruefeWert = async (loc, name, w, anzeige) => {
    try { await loc.fill(w, { timeout: 1500 }); await loc.press('Tab', { timeout: 1500 }); } catch { return; }
    await page.waitForTimeout(120);
    const t = await text();
    zeile.faelle++;
    const fehler = /Eingabe unzulässig/.test(t);
    if (fehler) zeile.fehlerhinweis++;
    const f = [];
    const roh = t.match(new RegExp(`.{0,60}(${ROH.source}).{0,40}`));
    if (roh) f.push(['Rohwert', roh[0]]);
    if (fehler) {
      const neu = erfolgsZeilen(t).filter((z) => !basisErfolg.has(z) || /–/.test(z));
      if (neu.length) f.push(['Erfolg trotz Fehler', neu.slice(0, 2).join(' | ')]);
    }
    if (konsole.length) { f.push(['Konsole', konsole.join(' | ')]); konsole = []; }
    for (const [art, tx] of f) { befunde.push({ id, reiter, feld: name, wert: anzeige, art, text: tx.replace(/\s+/g, ' ').slice(0, 200) }); zeile.befunde++; }
  };
  const feldName = async (loc, i) => (await loc.getAttribute('aria-label').catch(() => null)) ?? (await loc.getAttribute('id').catch(() => null)) ?? (await loc.getAttribute('name').catch(() => null)) ?? `#${i + 1}`;
  for (let i = 0; i < n; i++) {
    const loc = eingaben.nth(i);
    const typ = (await loc.getAttribute('type').catch(() => '')) ?? '';
    if (!['', 'number', 'text', 'tel'].includes(typ)) continue;
    const name = await feldName(loc, i);
    const alt = await loc.inputValue().catch(() => null);
    if (alt === null || alt === '' && typ === 'text') continue; // reine Textfelder (Name, Notiz) übergehen
    if (typ === 'text' && !/^[-+]?[\d\s.,\u202f]+$/.test(alt)) continue;
    for (const w of WERTE) await pruefeWert(loc, name, w, w === '' ? 'leer' : w);
    zeile.felder++;
    try { await loc.fill(alt, { timeout: 1500 }); await loc.press('Tab', { timeout: 1500 }); } catch { /* weiter */ }
    await page.waitForTimeout(80);
  }
  // Regler: nur Bereichsgrenzen erreichbar (min und max)
  const regler = page.locator('main input[type=range]:visible:not([disabled])');
  const nr = Math.min(await regler.count(), MAX_REGLER);
  for (let i = 0; i < nr; i++) {
    const loc = regler.nth(i);
    const name = await feldName(loc, i);
    const alt = await loc.inputValue().catch(() => null);
    if (alt === null) continue;
    const min = (await loc.getAttribute('min').catch(() => null)) ?? '0';
    const max = (await loc.getAttribute('max').catch(() => null)) ?? '100';
    zeile.regler++;
    await pruefeWert(loc, name, min, `Regler min ${min}`);
    await pruefeWert(loc, name, max, `Regler max ${max}`);
    try { await loc.fill(alt, { timeout: 1500 }); } catch { /* weiter */ }
    await page.waitForTimeout(60);
  }
  zeilen.push(zeile);
}

for (const id of ROUTEN) {
  try {
    await page.goto('about:blank');
    konsole = [];
    await page.goto(seitenUrl(BASIS, id), { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(300);
    if (konsole.length) { befunde.push({ id, reiter: '', feld: '(Laden)', wert: '', art: 'Konsole', text: konsole.join(' | ').slice(0, 200) }); }
    const oben = await reiterNamen();
    if (!oben.length) { await pruefeZustand(id, ''); continue; }
    for (const a of oben) {
      if (!(await klicke(a))) continue;
      const unter = (await reiterNamen()).filter((x) => !oben.includes(x));
      if (!unter.length) { await pruefeZustand(id, a); continue; }
      for (const b of unter) { if (await klicke(b)) await pruefeZustand(id, `${a} › ${b}`); }
    }
  } catch (e) { befunde.push({ id, reiter: '', feld: '', wert: '', art: 'Ablauf', text: String(e.message).slice(0, 160) }); }
  const z = zeilen.filter((x) => x.id === id);
  console.log(`${id}: ${z.length} Zustände, ${z.reduce((s, x) => s + x.felder, 0)} Felder, ${z.reduce((s, x) => s + x.regler, 0)} Regler, ${z.reduce((s, x) => s + x.faelle, 0)} Fälle, ${z.reduce((s, x) => s + x.fehlerhinweis, 0)} mit Fehlerhinweis, ${befunde.filter((b) => b.id === id).length} Befunde`);
}
await browser.close();

const aus = wert('--json');
if (aus) fs.writeFileSync(aus, JSON.stringify({ zeilen, befunde }, null, 1));
for (const b of befunde) console.log(`BEFUND ${b.id}[${b.reiter}] ${b.feld}=${b.wert}: ${b.art}: ${b.text}`);
console.log(`${ROUTEN.length} Routen, ${zeilen.length} Zustände, ${zeilen.reduce((s, x) => s + x.faelle, 0)} Fälle, ${befunde.length} Befunde`);
process.exit(befunde.length ? 1 : 0);
