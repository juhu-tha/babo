#!/usr/bin/env node
/**
 * Barrierefreiheit über axe hinaus (WCAG 2.1 AA / BITV 2.0): Tastaturbedienung, Screenreader-Semantik,
 * Zoom/Umbruch, Textabstände, reduzierte Bewegung und erzwungene Farben (forced-colors).
 * Ergänzt a11y.mjs/a11y-reiter.mjs (axe), a11y-struktur.mjs (Baum-Stichprobe), a11y-dialog.mjs und
 * a11y-diagramme.mjs um Prüfungen, die axe nicht findet. Ersetzt keinen BITV-Test mit echtem Screenreader.
 *
 *   node scripts/qa/a11y-tastatur.mjs [--basis URL] [--routen a,b] [--modi desk,mob] [--nur global,modul,zoom,bewegung,kontrast]
 *        [--json datei] [--details]
 *     ohne --routen: Stichprobe (Startseite, 10 Rechner aus der Registry mit Startwert 20261103, Quiz, Diagramme, 3D)
 *
 * Geprüft wird (Kennung in Klammern = WCAG-Kriterium):
 *   global  Sprunglink als erster Tabstopp, sichtbar, führt in den Hauptbereich (2.4.1); sichtbarer Fokus mit
 *           Kontrast ≥ 3 : 1 zur Umgebung (2.4.7, 1.4.11); keine Tastaturfalle (2.1.2); Dialoge und Menüs
 *           (Barrierefreiheit, mobiles Menü, Werkzeuge, Haftungshinweis): Fokus hinein, Escape schließt,
 *           Fokus kehrt zum Auslöser zurück (2.4.3); Suche: Ergebnisse per Tab erreichbar, Trefferzahl als
 *           Statusmeldung (4.1.3); Sprache der Seite (3.1.1)
 *   modul   Kopfleiste (aria-expanded per Enter), Reiter (Pfeiltasten, Pos1/Ende, aria-controls), Regler
 *           (Pfeiltasten, aria-valuetext mit Einheit), Live-Region nach Eingabe (4.1.3, höchstens 300 Zeichen),
 *           Überschriften (genau ein h1, keine Sprünge, 1.3.1), Landmarken, Namen (4.1.2), Tabellen (th mit scope,
 *           Beschriftung), Formeln (MathML), Bilder/SVG/Canvas mit Textalternative (1.1.1)
 *   zoom    200 % (720 px) und 400 % (320 px): kein waagerechtes Scrollen der Seite (1.4.10); Textabstände nach
 *           1.4.12: kein zusätzlich abgeschnittener Text
 *   bewegung  prefers-reduced-motion: keine Endlos- oder langen Animationen/Übergänge (2.3.3, 2.2.2)
 *   kontrast  forced-colors: gewählter Reiter/gedrückte Schalter unterscheidbar, Fokus sichtbar (1.4.1, 1.4.11)
 *
 * Voraussetzungen wie a11y.mjs: playwright (npm i --no-save oder NODE_PATH), gebaute App muss laufen.
 * Exit-Code 1 bei Befunden.
 */
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { seitenUrl } from './seitenUrl.mjs';

const lade = async n => { try { return await import(n); } catch { return createRequire(import.meta.url)(n); } };

const wert = n => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : undefined; };
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');

/** Rechner der Registry (typ: 'calculator') in Reihenfolge der Registry */
export function rechnerAusRegistry(reg) {
  const teil = reg.slice(reg.indexOf('export const MODULE = ['), reg.indexOf('] as const satisfies readonly ModulEintrag[]'));
  return teil.split(/\n(?= {2}\{ id: ')/).filter(b => /typ: 'calculator'/.test(b))
    .map(b => b.match(/^ {2}\{ id: '([a-z0-9_-]+)'/m)?.[1]).filter(Boolean);
}
/** reproduzierbare Auswahl (mulberry32) */
export function stichprobe(ids, n, startwert) {
  let s = startwert >>> 0;
  const rnd = () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const pool = [...ids]; const aus = [];
  while (aus.length < n && pool.length) aus.push(pool.splice(Math.floor(rnd() * pool.length), 1)[0]);
  return aus;
}

// ---------------------------------------------------------------- Hilfen im Browser (als Text übergeben)
const BROWSER_HILFEN = `
window.__bb = (() => {
  const cv = document.createElement('canvas'); cv.width = cv.height = 1; const cx = cv.getContext('2d', { willReadFrequently: true });
  const rgba = c => { cx.clearRect(0, 0, 1, 1); cx.fillStyle = '#000'; cx.fillStyle = c; cx.fillRect(0, 0, 1, 1); const d = cx.getImageData(0, 0, 1, 1).data; return [d[0], d[1], d[2], d[3] / 255]; };
  const lum = ([r, g, b]) => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const kontrast = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  // Hintergrund hinter einem Element: Vorfahren bis zur ersten deckenden Fläche, halbtransparente gemischt
  const hintergrund = el => {
    const schichten = [];
    for (let e = el; e; e = e.parentElement) {
      const c = rgba(getComputedStyle(e).backgroundColor);
      if (c[3] > 0) { schichten.push(c); if (c[3] >= 0.99) break; }
    }
    let erg = [255, 255, 255];
    const htmlBg = rgba(getComputedStyle(document.documentElement).backgroundColor);
    if (htmlBg[3] > 0.99) erg = htmlBg.slice(0, 3);
    for (const c of schichten.reverse()) erg = erg.map((v, i) => v * (1 - c[3]) + c[i] * c[3]);
    return erg;
  };
  const sel = el => {
    if (!el || el === document.body) return 'body';
    const name = (el.getAttribute('aria-label') || el.textContent || '').trim().replace(/\\s+/g, ' ').slice(0, 40);
    return el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (el.getAttribute('role') ? '[role=' + el.getAttribute('role') + ']' : '') + (name ? ' „' + name + '“' : '');
  };
  const sichtbar = el => !!el && el.checkVisibility?.({ checkOpacity: false, checkVisibilityCSS: true }) && !el.closest('[aria-hidden="true"],[hidden],[inert]');
  /** Fokusanzeige des aktiven Elements: Umriss (outline) oder Rahmenwechsel/Schatten; Kontrast zur Umgebung */
  const fokusAnzeige = () => {
    const el = document.activeElement; if (!el || el === document.body) return null;
    const cs = getComputedStyle(el);
    const breite = cs.outlineStyle !== 'none' ? parseFloat(cs.outlineWidth) || 0 : 0;
    const farbe = rgba(cs.outlineColor);
    const umgebung = hintergrund(el.parentElement || el);
    // zweifarbiger Fokus: Saum (box-shadow) zwischen Element und Umriss zählt als direkte Umgebung des Umrisses
    const saum = (cs.boxShadow || '').match(/^(rgba?\\([^)]*\\))\\s+0px 0px 0px (\\d+)px/);
    const kSaum = saum && parseFloat(saum[2]) >= parseFloat(cs.outlineOffset || '0') ? kontrast(farbe, rgba(saum[1])) : 0;
    const k = breite > 0 && farbe[3] > 0.5 ? Math.max(kontrast(farbe, umgebung), kSaum) : 0;
    const schatten = cs.boxShadow && cs.boxShadow !== 'none';
    const r = el.getBoundingClientRect();
    let deckkraft = 1; for (let e = el; e; e = e.parentElement) deckkraft *= parseFloat(getComputedStyle(e).opacity) || 0;
    return { sel: sel(el), breite, kontrast: Math.round(k * 100) / 100, schatten, deckkraft, flaeche: r.width * r.height, imBild: r.bottom > 0 && r.right > 0 && r.top < innerHeight && r.left < innerWidth };
  };
  return { rgba, kontrast, hintergrund, sel, sichtbar, fokusAnzeige };
})();
`;

// ---------------------------------------------------------------- Prüfungen
async function laden(page, basis, id, warte = 400) {
  await page.goto('about:blank');
  await page.goto(seitenUrl(basis, id), { waitUntil: 'networkidle' });
  // per CDP ausgewertet, nicht als Skript-Element (CSP der Seite)
  await page.evaluate(BROWSER_HILFEN);
  await page.waitForTimeout(warte);
}
const aktiv = page => page.evaluate(() => window.__bb.sel(document.activeElement));

/** Tab-Lauf: Fokusreihenfolge, Sichtbarkeit und Falle */
/** Fokusanzeige nach Ablauf von Übergängen (Tailwind transition-colors/-all: 150 ms, auch outline-color) */
const fokusNachTab = async page => { await page.keyboard.press('Tab'); await page.waitForTimeout(180); return page.evaluate(() => window.__bb.fokusAnzeige()); };

async function tabLauf(page, schritte) {
  await page.evaluate(() => { document.activeElement?.blur?.(); window.scrollTo(0, 0); });
  await page.mouse.click(1, 1).catch(() => {});
  await page.evaluate(() => document.activeElement?.blur?.());
  const stopps = [];
  for (let i = 0; i < schritte; i++) stopps.push(await fokusNachTab(page));
  return stopps;
}

function fokusBefunde(stopps, ort) {
  const b = [];
  for (const s of stopps) {
    if (!s) continue;
    if (s.flaeche === 0 && !/Zum Inhalt springen|Skip to content/.test(s.sel)) continue; // unsichtbare Reste prüft axe
    if (s.deckkraft < 0.5) b.push(`2.4.7 ${ort}: fokussiertes Element unsichtbar (Deckkraft ${Math.round(s.deckkraft * 100)} %) an ${s.sel}`);
    else if (s.breite < 2 && !s.schatten) b.push(`2.4.7 ${ort}: kein sichtbarer Fokus an ${s.sel}`);
    else if (s.breite >= 2 && s.kontrast < 3) b.push(`1.4.11 ${ort}: Fokuskontrast ${s.kontrast} : 1 an ${s.sel}`);
  }
  return [...new Set(b)];
}

function fallenBefund(stopps, ort) {
  const namen = stopps.map(s => s?.sel ?? 'body');
  const rest = namen.slice(-40);
  const verschieden = new Set(rest).size;
  // Falle: am Ende kreist der Fokus zwischen höchstens 3 Elementen, obwohl die Seite mehr hat
  if (namen.length >= 60 && verschieden <= 3 && new Set(namen).size > 6) return [`2.1.2 ${ort}: Tastaturfalle (Fokus kreist zwischen ${[...new Set(rest)].join(', ')})`];
  return [];
}

async function pruefeGlobal(page, basis, modus, befunde, details) {
  const ort = `${modus}:start`;
  await laden(page, basis, 'start');
  // Sprache
  const lang = await page.evaluate(() => document.documentElement.lang);
  if (!/^de\b/.test(lang)) befunde.push(`3.1.1 ${ort}: html lang="${lang}"`);
  // Sprunglink
  await page.evaluate(() => document.activeElement?.blur?.());
  await page.keyboard.press('Tab');
  const erst = await page.evaluate(() => { const el = document.activeElement; const r = el.getBoundingClientRect(); return { sel: window.__bb.sel(el), sichtbar: r.width > 20 && r.height > 10 && r.top >= 0 && r.left >= 0 }; });
  if (!/Zum Inhalt springen/.test(erst.sel)) befunde.push(`2.4.1 ${ort}: erster Tabstopp ist ${erst.sel}, nicht der Sprunglink`);
  else {
    if (!erst.sichtbar) befunde.push(`2.4.7 ${ort}: Sprunglink bei Fokus nicht sichtbar`);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(100);
    const ziel = await page.evaluate(() => document.activeElement?.id);
    if (ziel !== 'scroll-container') befunde.push(`2.4.1 ${ort}: Sprunglink führt nicht in den Hauptbereich (Fokus auf ${ziel || 'body'})`);
    else {
      await page.keyboard.press('Tab');
      const nach = await page.evaluate(() => !!document.activeElement?.closest('main'));
      if (!nach) befunde.push(`2.4.3 ${ort}: nach dem Sprunglink liegt der nächste Tabstopp nicht im Hauptbereich (${await aktiv(page)})`);
    }
  }
  // Fokus sichtbar + Falle
  const stopps = await tabLauf(page, modus === 'mob' ? 60 : 90);
  befunde.push(...fokusBefunde(stopps, ort), ...fallenBefund(stopps, ort));
  if (details) console.log(`  ${ort} Tabstopps: ${stopps.slice(0, 25).map(s => s?.sel ?? 'body').join(' → ')}`);

  // Dialoge / Menüs: Fokus hinein, Escape, Fokus zurück
  const faelle = modus === 'mob'
    ? [{ name: 'Menü', ausloeser: 'header button[aria-label="Menü öffnen"]', offen: 'aside[aria-label="Modulnavigation"]:not([inert])' },
       { name: 'Werkzeuge', ausloeser: 'button[aria-controls="mobil-werkzeuge"]', offen: '#mobil-werkzeuge' }]
    : [{ name: 'Barrierefreiheits-Dialog', ausloeser: '#a11y-toggle-btn:visible', offen: '[role="dialog"][aria-label="Barrierefreiheits-Einstellungen"]' }];
  for (const f of faelle) {
    await laden(page, basis, 'start', 250);
    const btn = page.locator(f.ausloeser).first();
    if (!(await btn.count())) { befunde.push(`${ort}: Auslöser ${f.name} fehlt`); continue; }
    await btn.focus();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(450);
    const drin = await page.evaluate(s => { const d = document.querySelector(s); return !!d && d.contains(document.activeElement); }, f.offen);
    if (!drin) befunde.push(`2.4.3 ${ort}: ${f.name} geöffnet, Fokus bleibt außerhalb (${await aktiv(page)})`);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(450);
    const zu = await page.evaluate(s => { const d = document.querySelector(s); return !d || !window.__bb.sichtbar(d); }, f.offen);
    if (!zu) befunde.push(`2.1.1 ${ort}: ${f.name} schließt nicht mit Escape`);
    const zurueck = await page.evaluate(s => document.activeElement === document.querySelector(s.replace(':visible', '')) || document.activeElement?.matches?.(s.replace(':visible', '')), f.ausloeser);
    if (zu && !zurueck) befunde.push(`2.4.3 ${ort}: Fokus nach Schließen von ${f.name} nicht auf dem Auslöser (${await aktiv(page)})`);
  }

  // Haftungshinweis in der Modulfußzeile: modaler Dialog
  await laden(page, basis, 'knicken', 500);
  const haft = page.getByRole('button', { name: /Haftungsausschluss lesen/ });
  if (await haft.count()) {
    await haft.first().scrollIntoViewIfNeeded();
    await haft.first().focus();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(300);
    const d = await page.evaluate(() => { const d = document.querySelector('[role="dialog"][aria-modal="true"]'); return { da: !!d, name: d ? (d.getAttribute('aria-label') || document.getElementById(d.getAttribute('aria-labelledby') || '')?.textContent || '') : '', drin: !!d && d.contains(document.activeElement) }; });
    if (!d.da) befunde.push(`4.1.2 ${ort}: Haftungshinweis ohne role="dialog" und aria-modal`);
    else {
      if (!d.name.trim()) befunde.push(`4.1.2 ${ort}: Haftungshinweis-Dialog ohne Namen`);
      if (!d.drin) befunde.push(`2.4.3 ${ort}: Haftungshinweis geöffnet, Fokus bleibt außerhalb`);
      let raus = 0;
      for (let i = 0; i < 6; i++) { await page.keyboard.press('Tab'); if (!(await page.evaluate(() => !!document.querySelector('[role="dialog"][aria-modal="true"]')?.contains(document.activeElement)))) raus++; }
      if (raus) befunde.push(`2.4.3 ${ort}: Tab verlässt den modalen Haftungshinweis`);
    }
    await page.keyboard.press('Escape');
    await page.waitForTimeout(250);
    const offen = await page.getByText('Wichtiger Hinweis zur Haftung').count();
    if (offen) befunde.push(`2.1.1 ${ort}: Haftungshinweis schließt nicht mit Escape`);
    else if (!(await page.evaluate(() => /Haftungsausschluss lesen/.test(document.activeElement?.textContent || '')))) befunde.push(`2.4.3 ${ort}: Fokus nach dem Haftungshinweis nicht auf dem Auslöser (${await aktiv(page)})`);
  }
  // PDF-Export: Fokus bleibt auf der Schaltfläche, Fortschritt als Statusmeldung
  if (modus === 'desk') {
    await laden(page, basis, 'start', 300);
    const pdf = page.locator('header button[aria-label="PDF-Export"]:visible').first();
    if (await pdf.count()) {
      await pdf.focus();
      await page.keyboard.press('Enter');
      let fertig = false;
      for (let i = 0; i < 60 && !fertig; i++) { await page.waitForTimeout(500); fertig = await page.evaluate(() => [...document.querySelectorAll('[role="status"]')].some(e => /PDF (erstellt|konnte)/.test(e.textContent || ''))); }
      if (!fertig) befunde.push(`4.1.3 ${ort}: PDF-Export ohne Statusmeldung zum Abschluss`);
      if (!(await page.evaluate(() => document.activeElement?.getAttribute('aria-label') === 'PDF-Export'))) befunde.push(`2.4.3 ${ort}: Fokus nach dem PDF-Export verloren (${await aktiv(page)})`);
    }
  }

  // Suche (Desktop-Seitenleiste; mobil im Menü)
  await laden(page, basis, 'start', 250);
  if (modus === 'mob') { await page.locator('header button[aria-label="Menü öffnen"]').click(); await page.waitForTimeout(400); }
  const suche = page.getByRole('textbox', { name: 'Module und Inhalte durchsuchen' });
  if (!(await suche.count())) befunde.push(`4.1.2 ${ort}: Suchfeld ohne zugänglichen Namen`);
  else {
    await suche.focus();
    await page.keyboard.type('beton', { delay: 20 });
    await page.waitForTimeout(900);
    const status = await page.evaluate(() => [...document.querySelectorAll('[role="status"],[aria-live]')].filter(e => e.closest('aside')).map(e => (e.textContent || '').trim()).filter(Boolean));
    if (!status.some(t => /\d/.test(t))) befunde.push(`4.1.3 ${ort}: Trefferzahl der Suche nicht als Statusmeldung angesagt`);
    await page.keyboard.press('Tab');
    const t1 = await page.evaluate(() => ({ sel: window.__bb.sel(document.activeElement), inNav: !!document.activeElement?.closest('aside') }));
    await page.keyboard.press('Tab');
    const t2 = await page.evaluate(() => ({ sel: window.__bb.sel(document.activeElement), inNav: !!document.activeElement?.closest('nav') }));
    if (!t1.inNav || !t2.inNav) befunde.push(`2.1.1 ${ort}: Suchergebnisse nicht per Tab erreichbar (${t1.sel} → ${t2.sel})`);
    if (details) console.log(`  ${ort} Suche: Status ${JSON.stringify(status).slice(0, 120)}; Tab → ${t1.sel} → ${t2.sel}`);
  }
}

async function pruefeModul(page, basis, modus, id, befunde, details) {
  const ort = `${modus}:${id}`;
  await laden(page, basis, id, 700);
  // ---- Kopfleiste
  const kopf = page.locator('main [role="group"][aria-label="Hilfen zum Modul"] button');
  const nKopf = await kopf.count();
  for (let i = 0; i < nKopf; i++) {
    const b = kopf.nth(i);
    const name = ((await b.textContent()) ?? '').trim();
    await b.focus();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(80);
    const auf = await b.getAttribute('aria-expanded');
    const ziel = await b.getAttribute('aria-controls');
    const sichtbar = ziel ? await page.evaluate(z => { const e = document.getElementById(z); return !!e && !e.hidden; }, ziel) : false;
    if (auf !== 'true' || !sichtbar) befunde.push(`2.1.1 ${ort}: Kopfleiste „${name}“ öffnet nicht per Enter`);
    await page.keyboard.press('Space');
    await page.waitForTimeout(80);
    if ((await b.getAttribute('aria-expanded')) !== 'false') befunde.push(`2.1.1 ${ort}: Kopfleiste „${name}“ schließt nicht per Leertaste`);
  }
  // ---- Reiter
  const listen = page.locator('main [role="tablist"]:visible');
  const nListen = Math.min(await listen.count(), 3);
  for (let li = 0; li < nListen; li++) {
    const liste = listen.nth(li);
    const tabs = liste.locator('[role="tab"]');
    const n = await tabs.count();
    if (n < 2) continue;
    const name = await liste.getAttribute('aria-label');
    const gew = liste.locator('[role="tab"][aria-selected="true"]');
    if ((await gew.count()) !== 1) { befunde.push(`4.1.2 ${ort}: Reiterleiste „${name}“ mit ${await gew.count()} gewählten Reitern`); continue; }
    const tabindex = await tabs.evaluateAll(els => els.map(e => e.tabIndex));
    if (tabindex.filter(t => t === 0).length !== 1) befunde.push(`2.4.3 ${ort}: Reiterleiste „${name}“ ohne „roving tabindex“ (${tabindex.join(',')})`);
    const ctrl = await gew.getAttribute('aria-controls');
    if (!ctrl || !(await page.evaluate(c => !!document.getElementById(c), ctrl))) befunde.push(`1.3.1 ${ort}: Reiter in „${name}“ ohne gültiges aria-controls`);
    await gew.focus();
    const start = await gew.evaluate(e => e.id || e.textContent);
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(150);
    const nach = await page.evaluate(() => { const e = document.activeElement; return { rolle: e?.getAttribute('role'), sel: e?.getAttribute('aria-selected'), id: e?.id || e?.textContent }; });
    if (nach.rolle !== 'tab' || nach.id === start) befunde.push(`2.1.1 ${ort}: Pfeil rechts bewegt den Fokus in „${name}“ nicht`);
    else if (nach.sel !== 'true') befunde.push(`2.1.1 ${ort}: Pfeil rechts wählt den Reiter in „${name}“ nicht`);
    await page.keyboard.press('End');
    await page.waitForTimeout(120);
    const ende = await page.evaluate(() => { const e = document.activeElement; const l = e?.closest('[role="tablist"]'); const t = l ? [...l.querySelectorAll('[role="tab"]')] : []; return t.indexOf(e) === t.length - 1; });
    if (!ende) befunde.push(`2.1.1 ${ort}: Ende springt in „${name}“ nicht zum letzten Reiter`);
    await page.keyboard.press('Home');
    await page.waitForTimeout(120);
    // zurück auf den ersten gewählten Reiter, damit die folgende Prüfung den Startzustand sieht
    if (li === 0) { await laden(page, basis, id, 500); break; }
  }
  // ---- Regler
  const regler = page.locator('main input[type="range"]:visible');
  // in einem Schritt lesen (Regler werden beim Neuzeichnen ersetzt; einzelne Locator-Aufrufe liefen dann ins Leere)
  const reglerInfos = await page.evaluate(() => [...document.querySelectorAll('main input[type="range"]')].filter(e => window.__bb.sichtbar(e))
    .map(e => ({ vt: e.getAttribute('aria-valuetext'), name: e.getAttribute('aria-label') || e.labels?.[0]?.textContent?.trim() || e.id, v: e.value })));
  const nRegler = reglerInfos.length;
  const ohneText = [];
  for (let i = 0; i < nRegler; i++) {
    const info = reglerInfos[i];
    // Klartext für Screenreader: vorhanden, deutsch formatiert (kein Dezimalpunkt) und – wenn die Beschriftung eine
    // Einheit nennt, z. B. „Dicke (cm)“ oder „in °C“ – mit dieser Einheit; dimensionslose Beiwerte bleiben reine Zahlen
    const einheit = (info.name ?? '').match(/\((mm|cm|m|kN|MPa|N\/mm²|°C|K|%|kg\/m³|W\/\(m·K\)|d|a)\)\s*$|\sin\s+(\S+)\s*$/);
    const e = einheit?.[1] ?? einheit?.[2];
    if (!info.vt || /^-?\d+\.\d+$/.test(info.vt.trim()) || (e && !info.vt.includes(e))) ohneText.push(info.name?.slice(0, 40) || `Regler ${i + 1}`);
  }
  if (ohneText.length) befunde.push(`4.1.2 ${ort}: ${ohneText.length} von ${nRegler} Reglern ohne passenden aria-valuetext (${ohneText.slice(0, 4).join('; ')})`);
  if (nRegler) {
    const r = regler.first();
    // Live-Regionen beobachten, dann Pfeiltaste
    await page.evaluate(() => {
      window.__live = [];
      const ziele = [...document.querySelectorAll('[aria-live]:not([aria-live="off"]),[role="status"],[role="alert"]')];
      window.__liveObs = new MutationObserver(m => { for (const x of m) { const t = (x.target.nodeType === 1 ? x.target : x.target.parentElement)?.closest('[aria-live],[role="status"],[role="alert"]'); if (t) window.__live.push(t); } });
      for (const z of ziele) window.__liveObs.observe(z, { childList: true, subtree: true, characterData: true });
    });
    const vorher = await r.inputValue();
    await r.focus();
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(80);
    let nachher = await r.inputValue();
    if (nachher === vorher) { await page.keyboard.press('ArrowLeft'); await page.keyboard.press('ArrowLeft'); await page.waitForTimeout(80); nachher = await r.inputValue(); }
    if (nachher === vorher) befunde.push(`2.1.1 ${ort}: erster Regler reagiert nicht auf Pfeiltasten`);
    await page.waitForTimeout(1300);
    const live = await page.evaluate(() => { const s = [...new Set(window.__live)]; window.__liveObs?.disconnect(); return s.filter(e => window.__bb.sichtbar(e) || e.classList.contains('sr-only')).map(e => ({ n: (e.textContent || '').trim().replace(/\s+/g, ' ').length, t: (e.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 90) })); });
    if (!live.length) befunde.push(`4.1.3 ${ort}: Ergebnis nach Reglereingabe nicht als Statusmeldung angesagt`);
    for (const l of live) if (l.n > 300) befunde.push(`4.1.3 ${ort}: Live-Region zu geschwätzig (${l.n} Zeichen: „${l.t}…“)`);
    if (details) console.log(`  ${ort} Live: ${JSON.stringify(live).slice(0, 200)}`);
  }
  // ---- 3D-Ansicht (Mauerwerk, Reiter „Mauerwerksverband“)
  if (id === 'mauerwerk') {
    await page.getByRole('tab', { name: /Mauerwerksverband/ }).first().click();
    await page.waitForTimeout(1500);
    const bild = page.locator('main [role="img"][aria-label^="3D-Ansicht"]');
    if (!(await bild.count())) befunde.push(`1.1.1 ${ort}: 3D-Ansicht ohne Textalternative`);
    const rechts = page.getByRole('button', { name: /Nach rechts drehen/ });
    if (!(await rechts.count())) befunde.push(`2.1.1 ${ort}: 3D-Ansicht nicht per Tastatur drehbar`);
    else {
      await rechts.first().focus();
      await page.keyboard.press('Enter');
      await page.waitForTimeout(150);
      if (!/gedreht/.test((await bild.first().getAttribute('aria-label')) ?? '')) befunde.push(`2.1.1 ${ort}: Drehen per Tastatur ohne Wirkung`);
    }
    await laden(page, basis, id, 500);
  }
  // ---- Quiz: Antwort per Tastatur, Rückmeldung als Statusmeldung, Fokus bleibt
  if (id === 'aufgaben_quiz') {
    const start = page.getByRole('button', { name: /Wissenscheck starten/ });
    if (await start.count()) {
      await start.first().focus();
      await page.keyboard.press('Enter');
      await page.waitForTimeout(600);
      const opt = page.locator('main button:has(> span.w-6)').first();
      if (await opt.count()) {
        await opt.focus();
        await page.keyboard.press('Enter');
        await page.waitForTimeout(300);
        const z = await page.evaluate(() => ({ fokus: document.activeElement?.tagName === 'BUTTON' && !!document.activeElement.closest('main'), gewaehlt: document.activeElement?.getAttribute('aria-pressed'),
          status: [...document.querySelectorAll('main [role="status"]')].map(e => (e.textContent || '').trim()).join(' | ') }));
        if (!z.fokus) befunde.push(`2.4.3 ${ort}: Fokus nach der Antwort verloren (${await aktiv(page)})`);
        if (z.gewaehlt !== 'true') befunde.push(`4.1.2 ${ort}: gewählte Antwort nicht als gewählt ausgezeichnet`);
        if (!/Antwort (richtig|falsch)/.test(z.status)) befunde.push(`4.1.3 ${ort}: Rückmeldung zur Antwort nicht als Statusmeldung (${z.status.slice(0, 60) || 'keine'})`);
      } else befunde.push(`${ort}: keine Antwortoption gefunden`);
      await laden(page, basis, id, 500);
    }
  }
  // ---- Struktur (DOM, nur zugängliche Teile)
  const s = await page.evaluate(() => {
    const B = window.__bb;
    const h = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6,[role="heading"]')].filter(B.sichtbar)
      .map(e => ({ l: Number(e.getAttribute('aria-level') || e.tagName.slice(1)) || 2, t: (e.textContent || '').trim().slice(0, 50) }));
    const spruenge = [];
    for (let i = 1; i < h.length; i++) if (h[i].l > h[i - 1].l + 1) spruenge.push(`h${h[i - 1].l}→h${h[i].l} „${h[i].t}“`);
    const navs = [...document.querySelectorAll('nav,[role="navigation"]')].filter(B.sichtbar);
    const navOhne = navs.length > 1 ? navs.filter(n => !n.getAttribute('aria-label') && !n.getAttribute('aria-labelledby')).length : 0;
    const main = document.querySelector('main');
    const tabellen = [...main.querySelectorAll('table')].filter(B.sichtbar);
    const thOhne = tabellen.reduce((a, t) => a + [...t.querySelectorAll('th')].filter(th => !th.getAttribute('scope') && !th.closest('thead')).length, 0);
    const tabOhneName = tabellen.filter(t => !t.querySelector('caption') && !t.getAttribute('aria-label') && !t.getAttribute('aria-labelledby')).length;
    const tabOhneTh = tabellen.filter(t => !t.querySelector('th') && t.rows.length > 1).length;
    const katex = [...main.querySelectorAll('.katex')];
    const katexOhne = katex.filter(k => !k.querySelector('.katex-mathml math') && !k.getAttribute('aria-label') && !k.closest('[aria-label]')).length;
    const imgOhne = [...main.querySelectorAll('img')].filter(i => B.sichtbar(i) && !i.hasAttribute('alt')).length;
    const svgOhne = [...main.querySelectorAll('svg')].filter(v => B.sichtbar(v) && !v.closest('[aria-hidden="true"],button,a,[role="img"][aria-label],figure[aria-label]') && v.getAttribute('aria-hidden') !== 'true'
      && !(v.getAttribute('role') === 'img' && (v.getAttribute('aria-label') || v.querySelector('title')))
      && !v.closest('.recharts-wrapper[role],.recharts-surface[role],[data-diagramm]')).length;
    const canvasOhne = [...main.querySelectorAll('canvas')].filter(c => B.sichtbar(c) && !c.getAttribute('aria-label') && !c.closest('[role="img"][aria-label]') && !c.getAttribute('aria-hidden')).length;
    const felder = [...main.querySelectorAll('input:not([type=hidden]),select,textarea')].filter(B.sichtbar);
    const feldOhne = felder.filter(f => !f.getAttribute('aria-label') && !f.getAttribute('aria-labelledby') && !(f.labels && f.labels.length) && !f.getAttribute('title')).length;
    const ohneName = [...document.querySelectorAll('button,a[href],[role="button"],[role="tab"],[role="switch"]')].filter(e => B.sichtbar(e) && !(e.getAttribute('aria-label') || e.getAttribute('aria-labelledby') || e.getAttribute('title') || (e.textContent || '').trim() || e.querySelector('img[alt]:not([alt=""])'))).map(B.sel);
    return { h1: h.filter(x => x.l === 1).length, spruenge, navOhne, mains: document.querySelectorAll('main,[role="main"]').length, banner: !!document.querySelector('header:not(main header):not(article header)'),
      thOhne, tabOhneName, tabOhneTh, tabellen: tabellen.length, katex: katex.length, katexOhne, imgOhne, svgOhne, canvasOhne, feldOhne, ohneName };
  });
  if (s.h1 !== 1) befunde.push(`1.3.1 ${ort}: ${s.h1} Überschriften der Ebene 1`);
  if (s.spruenge.length) befunde.push(`1.3.1 ${ort}: Überschriftensprünge ${s.spruenge.slice(0, 4).join(', ')}${s.spruenge.length > 4 ? ` (+${s.spruenge.length - 4})` : ''}`);
  if (s.mains !== 1) befunde.push(`1.3.1 ${ort}: ${s.mains} main-Landmarken`);
  if (!s.banner) befunde.push(`1.3.1 ${ort}: keine banner-Landmarke`);
  if (s.navOhne) befunde.push(`1.3.1 ${ort}: ${s.navOhne} Navigationsbereiche ohne Namen (mehrere nav)`);
  if (s.thOhne) befunde.push(`1.3.1 ${ort}: ${s.thOhne} Zeilenköpfe (th außerhalb thead) ohne scope`);
  if (s.tabOhneTh) befunde.push(`1.3.1 ${ort}: ${s.tabOhneTh} Tabellen ohne Kopfzellen`);
  if (s.tabOhneName) befunde.push(`1.3.1 ${ort}: ${s.tabOhneName} von ${s.tabellen} Tabellen ohne Beschriftung (caption/aria-label)`);
  if (s.katexOhne) befunde.push(`1.3.1 ${ort}: ${s.katexOhne} von ${s.katex} Formeln ohne MathML/aria-label`);
  if (s.imgOhne) befunde.push(`1.1.1 ${ort}: ${s.imgOhne} Bilder ohne alt`);
  if (s.svgOhne) befunde.push(`1.1.1 ${ort}: ${s.svgOhne} SVG-Grafiken ohne Textalternative und nicht ausgeblendet`);
  if (s.canvasOhne) befunde.push(`1.1.1 ${ort}: ${s.canvasOhne} Zeichenflächen (canvas) ohne Textalternative`);
  if (s.feldOhne) befunde.push(`4.1.2 ${ort}: ${s.feldOhne} Formularfelder ohne Namen`);
  if (s.ohneName.length) befunde.push(`4.1.2 ${ort}: ${s.ohneName.length} Bedienelemente ohne Namen (${s.ohneName.slice(0, 3).join(', ')})`);
  // ---- Fokus im Modul (Stichprobe der ersten Tabstopps im Hauptbereich)
  await page.evaluate(() => document.getElementById('scroll-container')?.focus());
  const stopps = [];
  for (let i = 0; i < 40; i++) stopps.push(await fokusNachTab(page));
  befunde.push(...fokusBefunde(stopps, ort), ...fallenBefund(stopps, ort));
}

/** Reflow: Elemente rechts außerhalb des Bildes, die nicht in einem waagerecht scrollbaren Bereich liegen */
async function ueberstand(page) {
  return page.evaluate(() => {
    const B = window.__bb; const w = document.documentElement.clientWidth; const raus = [];
    const scrollbar = el => { for (let e = el.parentElement; e && e !== document.body; e = e.parentElement) { const o = getComputedStyle(e).overflowX; if ((o === 'auto' || o === 'scroll') && e.id !== 'scroll-container') return true; } return false; };
    for (const el of document.querySelectorAll('#scroll-container *')) {
      if (!B.sichtbar(el) || el.closest('.sr-only,[class*="print:"]')) continue;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.right <= w + 2) continue;
      if (scrollbar(el)) continue;
      raus.push(B.sel(el) + ` (${Math.round(r.right - w)} px)`);
    }
    const sc = document.getElementById('scroll-container');
    return { seite: document.documentElement.scrollWidth - w, haupt: sc ? sc.scrollWidth - sc.clientWidth : 0, raus: raus.slice(0, 5), n: raus.length };
  });
}

const TEXTABSTAND_CSS = '* { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; } p { margin-bottom: 2em !important; }';
/** Text, der in Behältern mit overflow hidden/clip abgeschnitten wird (ohne absichtlich gekürzte .truncate/.line-clamp) */
async function abgeschnitten(page) {
  return page.evaluate(() => {
    const B = window.__bb; const out = [];
    for (const el of document.querySelectorAll('main button, main [role="tab"], main label, main p, main span, main h2, main h3, main h4, main li, main td, main th, header button')) {
      if (!B.sichtbar(el) || el.closest('.sr-only')) continue;
      const t = (el.textContent || '').trim(); if (t.length < 2) continue;
      const cs = getComputedStyle(el);
      const hidden = /hidden|clip/.test(cs.overflow + cs.overflowX + cs.overflowY);
      if (!hidden || cs.textOverflow === 'ellipsis' || cs.webkitLineClamp !== 'none') continue;
      if (el.scrollHeight > el.clientHeight + 2 || el.scrollWidth > el.clientWidth + 2) out.push(B.sel(el));
    }
    return out;
  });
}

async function pruefeZoom(browser, basis, routen, befunde, alleBefunde) {
  for (const [stufe, vp] of [['200 %', { width: 720, height: 450 }], ['400 %', { width: 320, height: 256 }]]) {
    const ctx = await browser.newContext({ viewport: vp });
    await ctx.addInitScript(() => { try { localStorage.setItem('theme', 'light'); } catch { /* ignorieren */ } });
    const page = await ctx.newPage();
    for (const id of routen) {
      await laden(page, basis, id, 500);
      const u = await ueberstand(page);
      if (u.seite > 2 || u.haupt > 2 || u.n) befunde.push(`1.4.10 zoom ${stufe}:${id}: waagerechtes Scrollen (Seite ${u.seite} px, Hauptbereich ${u.haupt} px; ${u.n} Elemente, z. B. ${u.raus.slice(0, 3).join('; ')})`);
    }
    await ctx.close();
  }
  // Textabstände (Desktop)
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  for (const id of routen) {
    await laden(page, basis, id, 500);
    const vorher = new Set(await abgeschnitten(page));
    await page.addStyleTag({ content: TEXTABSTAND_CSS });
    await page.waitForTimeout(300);
    const nachher = (await abgeschnitten(page)).filter(x => !vorher.has(x));
    if (nachher.length) befunde.push(`1.4.12 textabstand:${id}: ${nachher.length} Elemente abgeschnitten (${nachher.slice(0, 3).join('; ')})`);
    if (alleBefunde) alleBefunde.push({ id, abgeschnitten: nachher });
  }
  await ctx.close();
}

async function pruefeBewegung(browser, basis, routen, befunde) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  for (const id of routen) {
    await laden(page, basis, id, 150);
    const r = await page.evaluate(() => {
      const B = window.__bb; const out = [];
      const sek = s => Math.max(...s.split(',').map(x => x.trim().endsWith('ms') ? parseFloat(x) / 1000 : parseFloat(x) || 0));
      for (const el of document.querySelectorAll('body *')) {
        if (!B.sichtbar(el)) continue;
        const cs = getComputedStyle(el);
        if (cs.animationName !== 'none') {
          const d = sek(cs.animationDuration);
          if (d > 0.01 && (cs.animationIterationCount === 'infinite' || d > 0.2)) out.push(`Animation ${cs.animationName} ${cs.animationDuration}${cs.animationIterationCount === 'infinite' ? ' endlos' : ''} an ${B.sel(el)}`);
        }
        if (cs.transitionProperty !== 'none' && /transform|all/.test(cs.transitionProperty) && sek(cs.transitionDuration) > 0.2) out.push(`Übergang ${cs.transitionProperty} ${cs.transitionDuration} an ${B.sel(el)}`);
      }
      return out;
    });
    if (r.length) befunde.push(`2.3.3 bewegung:${id}: ${r.length} Bewegungen trotz prefers-reduced-motion (${[...new Set(r)].slice(0, 3).join('; ')})`);
  }
  await ctx.close();
}

async function pruefeKontrast(browser, basis, routen, befunde) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, forcedColors: 'active' });
  const page = await ctx.newPage();
  for (const id of routen) {
    await laden(page, basis, id, 400);
    const r = await page.evaluate(() => {
      const B = window.__bb; const out = [];
      // sichtbare Merkmale nach Farbersetzung (Hintergrundfarben und Schatten entfallen in forced-colors)
      const merkmal = e => { const cs = getComputedStyle(e); return [cs.borderTopWidth, cs.borderTopStyle, cs.borderBottomWidth, cs.outlineStyle, cs.outlineWidth, cs.fontWeight, cs.textDecorationLine, cs.borderTopColor, cs.color, cs.backgroundColor].join('|'); };
      const gruppen = [
        ['Reiter', '[role="tablist"]', '[role="tab"]', e => e.getAttribute('aria-selected') === 'true'],
        ['Optionen', '[role="radiogroup"]', '[role="radio"],button[aria-pressed],button[aria-checked]', e => e.getAttribute('aria-checked') === 'true' || e.getAttribute('aria-pressed') === 'true'],
        ['Schaltergruppe', '[role="group"]', 'button[aria-pressed]', e => e.getAttribute('aria-pressed') === 'true'],
      ];
      for (const [art, lsel, esel, an] of gruppen) for (const l of document.querySelectorAll(lsel)) {
        if (!B.sichtbar(l)) continue;
        const el = [...l.querySelectorAll(esel)].filter(B.sichtbar); if (el.length < 2) continue;
        const ja = el.filter(an), nein = el.filter(e => !an(e)); if (!ja.length || !nein.length) continue;
        if (merkmal(ja[0]) === merkmal(nein[0])) out.push(`${art} „${(l.getAttribute('aria-label') || '').slice(0, 40)}“: gewählt/nicht gewählt gleich dargestellt`);
      }
      // Schalter (role=switch): Zustand erkennbar?
      const sw = [...document.querySelectorAll('[role="switch"]')].filter(B.sichtbar);
      const an1 = sw.find(s => s.getAttribute('aria-checked') === 'true'), aus1 = sw.find(s => s.getAttribute('aria-checked') !== 'true');
      if (an1 && aus1 && merkmal(an1) === merkmal(aus1)) out.push('Schalter: an/aus gleich dargestellt');
      return out;
    });
    // Fokus in forced-colors
    await page.evaluate(() => document.getElementById('scroll-container')?.focus());
    let ohneFokus = 0;
    for (let i = 0; i < 15; i++) { const f = await fokusNachTab(page); if (f && f.flaeche > 0 && f.deckkraft >= 0.5 && f.breite < 1) ohneFokus++; }
    if (ohneFokus) r.push(`${ohneFokus} Tabstopps ohne sichtbaren Umriss`);
    if (r.length) befunde.push(`1.4.1 kontrast:${id}: ${[...new Set(r)].slice(0, 4).join('; ')}`);
  }
  await ctx.close();
}

// ---------------------------------------------------------------- Hauptlauf
if (process.argv[1] && fs.realpathSync(process.argv[1]) === fs.realpathSync(new URL(import.meta.url).pathname)) {
  const { chromium } = await lade('playwright');
  const BASIS = wert('--basis') ?? 'http://localhost:4173/';
  const DETAILS = process.argv.includes('--details');
  const reg = fs.readFileSync(path.join(ROOT, 'src/registry/modules.ts'), 'utf8');
  const RECHNER = stichprobe(rechnerAusRegistry(reg), 10, 20261103);
  const STICHPROBE = [...RECHNER, 'aufgaben_quiz', 'kriechen', 'mauerwerk'];
  const ROUTEN = (wert('--routen') ?? STICHPROBE.join(',')).split(',').filter(Boolean);
  const MODI = (wert('--modi') ?? 'desk,mob').split(',');
  const NUR = (wert('--nur') ?? 'global,modul,zoom,bewegung,kontrast').split(',');
  const exe = process.env.CHROMIUM_PATH || (fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);
  const browser = await chromium.launch(exe ? { executablePath: exe } : {});
  const befunde = [];
  console.log(`Routen: start, ${ROUTEN.join(', ')}`);
  for (const modus of MODI) {
    const m = modus === 'mob' ? { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } : { viewport: { width: 1440, height: 900 } };
    const ctx = await browser.newContext(m);
    await ctx.addInitScript(() => { try { localStorage.setItem('theme', 'light'); } catch { /* ignorieren */ } });
    const page = await ctx.newPage();
    if (NUR.includes('global')) { const vor = befunde.length; await pruefeGlobal(page, BASIS, modus, befunde, DETAILS); console.log(`${befunde.length > vor ? 'FEHLER' : 'ok    '} ${modus}:global`); }
    if (NUR.includes('modul')) for (const id of ROUTEN) {
      const vor = befunde.length;
      try { await pruefeModul(page, BASIS, modus, id, befunde, DETAILS); } catch (e) { befunde.push(`${modus}:${id}: Prüfung abgebrochen (${String(e.message).split('\n')[0].slice(0, 120)})`); }
      console.log(`${befunde.length > vor ? 'FEHLER' : 'ok    '} ${modus}:${id}`);
    }
    await ctx.close();
  }
  const alle = ['start', ...ROUTEN];
  if (NUR.includes('zoom')) { const vor = befunde.length; await pruefeZoom(browser, BASIS, alle, befunde); console.log(`${befunde.length > vor ? 'FEHLER' : 'ok    '} zoom/textabstand`); }
  if (NUR.includes('bewegung')) { const vor = befunde.length; await pruefeBewegung(browser, BASIS, alle, befunde); console.log(`${befunde.length > vor ? 'FEHLER' : 'ok    '} reduzierte Bewegung`); }
  if (NUR.includes('kontrast')) { const vor = befunde.length; await pruefeKontrast(browser, BASIS, alle, befunde); console.log(`${befunde.length > vor ? 'FEHLER' : 'ok    '} forced-colors`); }
  await browser.close();
  const json = wert('--json');
  if (json) fs.writeFileSync(json, JSON.stringify({ routen: alle, modi: MODI, befunde }, null, 2));
  if (befunde.length) { console.error(befunde.join('\n')); console.error(`${befunde.length} Befunde.`); process.exit(1); }
  console.log('0 Befunde.');
}
