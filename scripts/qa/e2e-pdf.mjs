#!/usr/bin/env node
/**
 * E2E-Prüfung PDF-Export und Drucken (ersetzt die manuelle Sichtprüfung nach AP 5.5)
 *
 * Seit AP 5.5 werden Diagramme erst bei Sichtbarkeit gezeichnet (src/lib/chartBedarf.tsx), KaTeX wird bei
 * Bedarf geladen (src/lib/katexBedarf.tsx) und Abschnitte unterhalb des Bildausschnitts erscheinen erst nach
 * dem ersten Bild (NachErstemBild). Vor PDF-Export und Druck muss alles vollständig gezeichnet sein.
 * Geprüft wird im gebauten Frontend:
 *
 *   A  PDF-Export der Kopfleiste („PDF-Export“, src/lib/pdfExport.ts) auf Routen mit Diagrammen/Formeln
 *   B  LCC-Gutachten („Bericht exportieren (PDF)“, ebenfalls pdfExport.ts)
 *      → Download abfangen; Datei beginnt mit %PDF-, endet mit %%EOF, ≥ 1 Seite, enthält ein Bild,
 *        Größe plausibel; Zustand der exportierten Seite im Moment der Aufnahme (Anhang eingefügt):
 *        alle <canvas> gezeichnet, keine Diagramm-, Formel- oder Abschnittsplatzhalter
 *   C  Druckknöpfe der Module (window.print): Knopf drücken, Zustand im Moment des Druckens prüfen
 *      (beforeprint, synchron wie im Browser), danach page.pdf() („Als PDF speichern“) und PDF prüfen
 *   D  Labor-Prüfbericht im iframe (src/utils/labExportUtils.ts, openPrintableReport)
 *   E  Druckansicht (emulateMedia print + beforeprint) auf den Routen aus A ohne vorheriges Scrollen;
 *      Druck-PDF muss zur Höhe des Modulinhalts passende Seitenzahl haben (nicht nur den ersten Bildschirm)
 *   F  PDF-Export bei langsamem Netz: KaTeX- und Chart.js-Chunk um 2,5 s verzögert, Export sofort nach dem
 *      ersten Rendern → Export muss auf beide warten (Platzhalter vorher vorhanden, im Export keine)
 *
 *   npx vite build && npx vite preview --port 4173 --strictPort &
 *   node scripts/qa/e2e-pdf.mjs [--basis http://localhost:4173/] [--nur A,C]
 *
 * Playwright ist keine Projektabhängigkeit (npm i --no-save playwright, global oder per NODE_PATH).
 * Chromium: $CHROMIUM_PATH, sonst /opt/pw-browsers/chromium, sonst der Playwright-eigene Browser.
 * Exit-Code 1, sobald eine Prüfung nicht besteht.
 */
import fs from 'fs';
import os from 'os';
import path from 'path';
import { createRequire } from 'module';
import { execSync } from 'child_process';
import { seitenUrl } from './seitenUrl.mjs';

async function ladePlaywright() {
  try { return await import('playwright'); } catch { /* nicht lokal installiert */ }
  try { return createRequire(import.meta.url)('playwright'); } catch { /* NODE_PATH nicht gesetzt */ }
  const global = execSync('npm root -g', { encoding: 'utf8' }).trim();
  return createRequire(path.join(global, 'noop.js'))('playwright');
}
const { chromium } = await ladePlaywright();

const argWert = n => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : undefined; };
const BASIS = argWert('--basis') || 'http://localhost:4173/';
const NUR = argWert('--nur')?.split(',');
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'e2e-pdf-'));

/** A/E: Routen mit Diagrammen (Chart.js) und Formeln (KaTeX), teils mit NachErstemBild-Abschnitten */
const EXPORT_ROUTEN = ['mischungsberechnung', 'festbeton', 'kriechen', 'holz', 'knicken', 'feuchteschutz'];

/** C: Druckknöpfe; schritte = Klicks/Eingaben bis zum Knopf, knopf = Name des Druckknopfs */
const DRUCK = [
  { id: 'labor_sicherheit', knopf: 'Aushang drucken' },
  { id: 'instandsetzung_checklisten', knopf: 'Drucken / PDF' },
  { id: 'boden_materialaufbereitung', schritte: [{ klick: 'LAGA PN 98 & Rechner' }], knopf: 'Als offizielles PDF drucken' },
  { id: 'materialpaesse', schritte: [{ klick: 'Pass ansehen' }], knopf: 'GRP Drucken / PDF' },
  { id: 'qualitaetssicherung', schritte: [{ klick: 'Konformitätskontrolle' }], knopf: 'Bericht drucken' },
  {
    id: 'px_bautagebuch',
    schritte: [{ klick: 'Bericht erstellen' }, { fuellen: '#form-fortschritt', text: 'Bodenplatte Achse A–C betoniert, Nachbehandlung mit Folie begonnen.' }, { klick: '#btn-submit-diary' }],
    knopf: '#btn-print',
  },
];

const exe = process.env.CHROMIUM_PATH || (fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);
const browser = await chromium.launch(exe ? { executablePath: exe } : {});

/**
 * Im Browser: Zustand eines Bereichs synchron erfassen (keine await – so wie beim Drucken/bei der Aufnahme).
 * Leere Leinwand: toDataURL gleich dem einer frischen Leinwand derselben Größe (erzeugt keinen Kontext).
 */
function initSkript() {
  const zustand = (wurzel) => {
    const z = { canvas: 0, leer: [], diagrammPlatzhalter: 0, texPlatzhalter: [], abschnittPlatzhalter: 0, texRoh: [] };
    if (!wurzel) return { ...z, fehlt: true };
    for (const c of wurzel.querySelectorAll('canvas')) {
      z.canvas++;
      const name = c.getAttribute('aria-label') || c.id || c.className || `canvas ${z.canvas}`;
      if (!c.width || !c.height) { z.leer.push(`${name} (0×0)`); continue; }
      const leer = document.createElement('canvas');
      leer.width = c.width; leer.height = c.height;
      try { if (c.toDataURL() === leer.toDataURL()) z.leer.push(`${name} (${c.width}×${c.height})`); } catch { /* fremde Quelle */ }
    }
    z.diagrammPlatzhalter = wurzel.querySelectorAll('[data-diagramm-platzhalter]').length;
    z.texPlatzhalter = [...wurzel.querySelectorAll('.katex-platzhalter')].map(e => (e.getAttribute('data-tex') || '').slice(0, 40));
    z.abschnittPlatzhalter = [...wurzel.querySelectorAll('div[aria-busy="true"]:empty')].filter(e => !e.hasAttribute('data-diagramm-platzhalter')).length;
    // TeX-Quelltext außerhalb gerenderter Formeln (KaTeX-MathML-Annotation zählt nicht)
    const w = document.createTreeWalker(wurzel, NodeFilter.SHOW_TEXT);
    for (let n = w.nextNode(); n; n = w.nextNode()) {
      const el = n.parentElement;
      if (!el || el.closest('.katex, script, style, code, pre, textarea, .katex-platzhalter')) continue;
      const t = n.textContent || '';
      if (/\\(frac|cdot|sqrt|mathrm|text|varepsilon|sigma|Delta|lambda)\b/.test(t)) z.texRoh.push(t.trim().slice(0, 60));
    }
    return z;
  };
  window.__pdfZustand = zustand;
  // A/B: der Anhang („Verwendete Parameter & Formeln“) wird unmittelbar vor der Bildaufnahme eingefügt
  new MutationObserver(ms => {
    for (const m of ms) for (const n of m.addedNodes) {
      if (n instanceof HTMLElement && n.classList.contains('pdf-appendix')) window.__exportZustand = zustand(n.parentElement);
      if (n instanceof HTMLIFrameElement && n.id === 'printable-report-frame') {
        // D: Druck im iframe abfangen (document.open() behält das Window-Objekt)
        n.contentWindow.print = () => { window.__iframeDruck = (window.__iframeDruck || 0) + 1; };
      }
    }
  }).observe(document, { childList: true, subtree: true });
  // C: window.print abfangen; der Browser löst beforeprint synchron aus und druckt danach den Ist-Zustand
  window.__druck = [];
  window.print = () => {
    window.dispatchEvent(new Event('beforeprint'));
    window.__druck.push(zustand(document.getElementById('module-content')));
    window.dispatchEvent(new Event('afterprint'));
  };
}

function pruefePdf(buf, minKb = 10) {
  const f = [];
  const kopf = buf.subarray(0, 5).toString('latin1');
  const ende = buf.subarray(Math.max(0, buf.length - 1024)).toString('latin1');
  const text = buf.toString('latin1');
  const seiten = (text.match(/\/Type\s*\/Page(?![s\w])/g) || []).length;
  if (kopf !== '%PDF-') f.push(`kein PDF-Kopf („${kopf}“)`);
  if (!ende.includes('%%EOF')) f.push('kein %%EOF');
  if (seiten < 1) f.push('0 Seiten');
  if (buf.length < minKb * 1024) f.push(`zu klein (${(buf.length / 1024).toFixed(1)} kB)`);
  if (buf.length > 80 * 1024 * 1024) f.push(`zu groß (${(buf.length / 1048576).toFixed(1)} MB)`);
  return { seiten, kb: Math.round(buf.length / 1024), bild: /\/Subtype\s*\/Image/.test(text), fehler: f };
}

/**
 * Druck-PDF: Seitenzahl passend zur Höhe des Modulinhalts im Drucklayout? Eine A4-Seite fasst bei der
 * Druckbreite deutlich weniger als 2000 CSS-px; weniger Seiten heißt: Inhalt abgeschnitten (z. B. nur der
 * erste Bildschirm, weil ein Scrollbehälter im Druck nicht geöffnet wird).
 */
async function seitenFehler(page, pdf) {
  const hoehe = await page.evaluate(() => document.getElementById('module-content')?.getBoundingClientRect().height ?? 0);
  const mindestens = Math.max(1, Math.floor(hoehe / 2000));
  return pdf.seiten < mindestens ? [`nur ${pdf.seiten} Druckseite(n) für ${Math.round(hoehe)} px Modulinhalt (≥ ${mindestens} erwartet) – Inhalt abgeschnitten`] : [];
}

function zustandFehler(z, wo) {
  const f = [];
  if (!z) return [`${wo}: kein Zustand erfasst`];
  if (z.fehlt) return [`${wo}: Bereich nicht gefunden`];
  if (z.leer.length) f.push(`${wo}: ${z.leer.length} von ${z.canvas} Leinwänden leer (${z.leer.slice(0, 3).join(', ')})`);
  if (z.diagrammPlatzhalter) f.push(`${wo}: ${z.diagrammPlatzhalter} Diagramm-Platzhalter`);
  if (z.texPlatzhalter.length) f.push(`${wo}: ${z.texPlatzhalter.length} Formel-Platzhalter (${z.texPlatzhalter.slice(0, 2).join(' | ')})`);
  if (z.abschnittPlatzhalter) f.push(`${wo}: ${z.abschnittPlatzhalter} nicht gerenderte Abschnitte`);
  if (z.texRoh.length) f.push(`${wo}: TeX-Quelltext sichtbar (${z.texRoh.slice(0, 2).join(' | ')})`);
  return f;
}
const kurz = z => (z ? `${z.canvas} Leinwände, ${z.diagrammPlatzhalter} Diagramm-/${z.texPlatzhalter.length} Formel-/${z.abschnittPlatzhalter} Abschnittsplatzhalter` : '–');

async function neueSeite(opt = {}) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true, ...opt });
  await ctx.addInitScript(initSkript);
  const page = await ctx.newPage();
  const seitenfehler = [];
  page.on('pageerror', e => seitenfehler.push(String(e.message || e).slice(0, 200)));
  page.on('console', m => { if (m.type() === 'error' && /PDF|Export|print/i.test(m.text())) seitenfehler.push(m.text().slice(0, 200)); });
  return { ctx, page, seitenfehler };
}
async function oeffne(page, id) {
  await page.goto(seitenUrl(BASIS, id), { waitUntil: 'networkidle' });
  await page.locator('#module-content h1, #module-content h2').first().waitFor({ timeout: 15000 });
  await page.waitForTimeout(400);
}
/** '#id' → Selektor, 'kopf:Name' → Knopf der Kopfleiste (außerhalb des Modulinhalts), sonst Knopf im Modul */
const knopf = (page, name) => {
  if (name.startsWith('#')) return page.locator(name).first();
  if (name.startsWith('kopf:')) return page.getByRole('button', { name: name.slice(5), exact: true }).locator('visible=true').first();
  // Reiter sind teils role="tab" (zugänglicher Name dann nicht „button“) → nach Text unter button und [role=tab]
  return page.locator('#module-content').locator('button, [role="tab"]').filter({ hasText: name }).locator('visible=true').first();
};

const ergebnisse = [];
const laufe = async (teil, name, f) => {
  if (NUR && !NUR.includes(teil)) return;
  const t0 = Date.now();
  const e = { teil, name, fehler: [], info: '' };
  try { await f(e); } catch (err) { e.fehler.push(String(err.message || err).split('\n')[0].slice(0, 240)); }
  e.ms = Date.now() - t0;
  ergebnisse.push(e);
  console.log(`${e.fehler.length ? 'FAIL' : 'ok  '} ${teil} ${name.padEnd(34)} ${e.info} (${(e.ms / 1000).toFixed(1)} s)`);
  for (const x of e.fehler) console.log(`     FAIL: ${x}`);
};

async function pdfExport(e, id, knopfName, vorher_klicks = [], langsam = false) {
  const { ctx, page, seitenfehler } = await neueSeite();
  try {
    if (langsam) {
      await page.route(/\/assets\/(react-katex|chart)-[\w-]+\.js$/, async r => { await new Promise(f => setTimeout(f, 2500)); await r.continue(); });
      await page.goto(seitenUrl(BASIS, id), { waitUntil: 'domcontentloaded' });
      await page.locator('#module-content h1, #module-content h2').first().waitFor({ timeout: 15000 });
    } else await oeffne(page, id);
    for (const k of vorher_klicks) { await knopf(page, k).click(); await page.waitForTimeout(300); }
    const vorher = await page.evaluate(() => window.__pdfZustand(document.getElementById('module-content')));
    const [d] = await Promise.all([page.waitForEvent('download', { timeout: 90000 }), knopf(page, knopfName).click()]);
    const datei = path.join(TMP, d.suggestedFilename());
    await d.saveAs(datei);
    const pdf = pruefePdf(fs.readFileSync(datei), 20);
    const z = await page.evaluate(() => window.__exportZustand);
    e.info = `${d.suggestedFilename()}: ${pdf.seiten} S., ${pdf.kb} kB | vorher ${kurz(vorher)} → Export ${kurz(z)}`;
    e.fehler.push(...pdf.fehler);
    if (!pdf.bild) e.fehler.push('PDF ohne Bild');
    e.fehler.push(...zustandFehler(z, 'Export'));
    if (seitenfehler.length) e.fehler.push(`Seitenfehler: ${seitenfehler.join(' | ')}`);
    if (langsam && !vorher.texPlatzhalter.length && !vorher.diagrammPlatzhalter) e.fehler.push('Testaufbau: vor dem Export keine Platzhalter – Verzögerung wirkungslos');
    e.daten = { vorher, z, pdf };
  } finally { await ctx.close(); }
}

// A – PDF-Export der Kopfleiste
for (const id of EXPORT_ROUTEN) await laufe('A', `#${id} PDF-Export`, e => pdfExport(e, id, 'kopf:PDF-Export'));

// B – LCC-Gutachten
await laufe('B', '#lebenszyklus_kosten LCC-Gutachten', e => pdfExport(e, 'lebenszyklus_kosten', 'Bericht exportieren (PDF)', ['Lebenszykluskosten (LCC)']));

// C – Druckknöpfe
for (const d of DRUCK) {
  await laufe('C', `#${d.id} „${d.knopf}“`, async e => {
    const { ctx, page, seitenfehler } = await neueSeite();
    try {
      await oeffne(page, d.id);
      for (const s of d.schritte || []) {
        if (s.klick) await knopf(page, s.klick).click();
        if (s.fuellen) await page.locator(s.fuellen).fill(s.text);
        await page.waitForTimeout(300);
      }
      await knopf(page, d.knopf).click();
      await page.waitForFunction(() => window.__druck.length > 0, null, { timeout: 5000 });
      const z = await page.evaluate(() => window.__druck[0]);
      await page.emulateMedia({ media: 'print' });
      const pdf = pruefePdf(await page.pdf({ format: 'A4', printBackground: true }), 5);
      e.info = `${pdf.seiten} S., ${pdf.kb} kB | Druck: ${kurz(z)}`;
      e.fehler.push(...pdf.fehler, ...zustandFehler(z, 'Druck'), ...(await seitenFehler(page, pdf)));
      if (seitenfehler.length) e.fehler.push(`Seitenfehler: ${seitenfehler.join(' | ')}`);
    } finally { await ctx.close(); }
  });
}

// D – Labor-Prüfbericht (iframe)
await laufe('D', '#labor Isotopen-Bericht (iframe)', async e => {
  const { ctx, page, seitenfehler } = await neueSeite();
  try {
    await oeffne(page, 'labor');
    await knopf(page, 'Schadensdiagnostik').click();
    await page.waitForTimeout(300);
    await knopf(page, 'Isotopen- & Wasser-Rechner').click();
    await page.waitForTimeout(300);
    await knopf(page, 'Drucken / PDF').click();
    await page.waitForFunction(() => window.__iframeDruck > 0, null, { timeout: 5000 });
    const html = await page.evaluate(() => document.getElementById('printable-report-frame').contentDocument.documentElement.outerHTML);
    const druck = await ctx.newPage();
    await druck.setContent(html);
    await druck.emulateMedia({ media: 'print' });
    const pdf = pruefePdf(await druck.pdf({ format: 'A4' }), 3);
    const text = await druck.evaluate(() => document.body.innerText);
    e.info = `${pdf.seiten} S., ${pdf.kb} kB, ${text.length} Zeichen`;
    e.fehler.push(...pdf.fehler);
    if (!/Isotop/i.test(text) || text.length < 200) e.fehler.push('Bericht ohne erwarteten Inhalt');
    if (/\$\{|undefined|NaN/.test(text)) e.fehler.push('Bericht enthält undefined/NaN/Vorlagenreste');
    if (seitenfehler.length) e.fehler.push(`Seitenfehler: ${seitenfehler.join(' | ')}`);
  } finally { await ctx.close(); }
});

// E – Druckansicht ohne vorheriges Scrollen (Strg+P direkt nach dem Laden)
for (const id of EXPORT_ROUTEN) {
  await laufe('E', `#${id} Druckansicht`, async e => {
    const { ctx, page, seitenfehler } = await neueSeite();
    try {
      await oeffne(page, id);
      const vorher = await page.evaluate(() => window.__pdfZustand(document.getElementById('module-content')));
      await page.emulateMedia({ media: 'print' });
      const z = await page.evaluate(() => {
        window.dispatchEvent(new Event('beforeprint'));
        const z = window.__pdfZustand(document.getElementById('module-content'));
        window.dispatchEvent(new Event('afterprint'));
        return z;
      });
      const pdf = pruefePdf(await page.pdf({ format: 'A4', printBackground: true }), 20);
      e.info = `${pdf.seiten} S., ${pdf.kb} kB | vorher ${kurz(vorher)} → Druck ${kurz(z)}`;
      e.fehler.push(...pdf.fehler, ...zustandFehler(z, 'Druck'), ...(await seitenFehler(page, pdf)));
      if (seitenfehler.length) e.fehler.push(`Seitenfehler: ${seitenfehler.join(' | ')}`);
    } finally { await ctx.close(); }
  });
}

// F – PDF-Export, bevor KaTeX und Chart.js geladen sind
for (const id of ['kriechen', 'feuchteschutz']) await laufe('F', `#${id} PDF-Export, langsames Netz`, e => pdfExport(e, id, 'kopf:PDF-Export', [], true));

await browser.close();
fs.rmSync(TMP, { recursive: true, force: true });
const n = ergebnisse.filter(e => e.fehler.length).length;
console.log(n ? `FAIL: ${n} von ${ergebnisse.length} Prüfungen` : `OK: ${ergebnisse.length} Prüfungen (PDF-Export, Druckknöpfe, Druckansicht)`);
process.exit(n ? 1 : 0);
