#!/usr/bin/env node
/**
 * Abgleich der Klassengrenzen (Gesamtgutachten 03.11.2026, Abschnitt 5.1; Vorschlag Nachstichprobe 5c).
 *
 * Prüft content/**.json, src/data/quiz.json (Felder wie scripts/qa/fristen-abgleich.mjs) und die Fachtexte in
 * TypeScript-Dateien (src/data/tasks, src/data/kurzfassung.ts, src/data/lernziele.ts, src/components/ui/
 * RechtsrahmenKompendium.tsx, src/modules) gegen die zentrale Liste src/data/klassengrenzen.ts:
 *  1. Materialwerte der EBV (Zahlen) – Erkennung wie fristen-abgleich.mjs (Anker = Parameter, Familie = Klasse+Einheit),
 *  2. Einstufungen (KLASSEN_AUSSAGEN): falsche Aussagen zu PFAS-Kettenlänge, LAGA M 20 und EBV-Materialklassen.
 *
 * Aufruf:  node scripts/qa/klassengrenzen-abgleich.mjs          → Zusammenfassung, Exit 1 bei Abweichungen
 *          node scripts/qa/klassengrenzen-abgleich.mjs --alle   → zusätzlich alle erkannten Zahlenwerte
 * tests/klassengrenzen.test.ts hält 0 Abweichungen (Ratsche).
 */
import fs from 'fs';
import path from 'path';
import { pathToFileURL, fileURLToPath } from 'url';
import { bereite, pruefeText, texteinheiten, normalisiere } from './fristen-abgleich.mjs';

/** Parameter vor der Angabe zählt vor einem Parameter dahinter */
export const NACH = { nachherFaktor: 4 };

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

/** TypeScript-Dateien mit Fachtext (außer content/ und quiz.json) */
export function tsTextDateien(root = ROOT) {
  const aus = [];
  const lauf = d => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) lauf(p);
      else if (/\.(ts|tsx)$/.test(e.name)) aus.push(p);
    }
  };
  for (const d of ['src/modules', 'src/data/tasks', 'src/components']) if (fs.existsSync(path.join(root, d))) lauf(path.join(root, d));
  for (const f of ['src/data/kurzfassung.ts', 'src/data/lernziele.ts', 'src/data/moduleOverviewsData.ts', 'src/data/moduleHistoryData.ts'])
    if (fs.existsSync(path.join(root, f))) aus.push(path.join(root, f));
  return aus.sort();
}

/** Alle Texteinheiten: content/, quiz.json, TS-Dateien (je Zeile) */
export function alleEinheiten(root = ROOT) {
  const aus = texteinheiten(root);
  for (const d of tsTextDateien(root)) {
    const rel = path.relative(root, d).split(path.sep).join('/');
    fs.readFileSync(d, 'utf8').split('\n').forEach((z, i) => { if (z.trim()) aus.push({ ort: `${rel}:${i + 1}`, text: z }); });
  }
  return aus;
}

/** Einstufungen prüfen: Treffer { id, ort, auszug, richtig } */
export function pruefeAussagen(einheiten, aussagen) {
  const res = aussagen.map(a => ({ ...a, re: new RegExp(a.falsch, 'giu') }));
  const aus = [];
  for (const u of einheiten) {
    const t = normalisiere(u.text);
    for (const a of res) {
      for (const m of t.matchAll(a.re)) {
        aus.push({ id: a.id, ort: u.ort, auszug: t.slice(Math.max(0, m.index - 50), m.index + m[0].length + 40).replace(/\s+/g, ' '), richtig: a.richtig });
      }
    }
  }
  return aus;
}

export async function abgleich({ root = ROOT, einheiten } = {}) {
  const { tsImport } = await import('tsx/esm/api');
  const mod = await tsImport(pathToFileURL(path.join(root, 'src/data/klassengrenzen.ts')).href, import.meta.url);
  const vorb = bereite(mod.EBV_MATERIALWERTE);
  const alle = einheiten ?? alleEinheiten(root);
  const treffer = [];
  for (const u of alle) for (const t of pruefeText(u.text, vorb, NACH)) treffer.push({ ...t, ort: u.ort });
  const aussagen = pruefeAussagen(alle, mod.KLASSEN_AUSSAGEN);
  return { treffer, abweichungen: treffer.filter(t => !t.ok), aussagen, mod };
}

const istHaupt = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (istHaupt) {
  const erg = await abgleich();
  console.log(`Klassengrenzen-Abgleich: ${erg.mod.EBV_MATERIALWERTE.length} Materialwerte, ${erg.treffer.length} erkannte Angaben, ` +
    `${erg.treffer.filter(t => t.ok).length} übereinstimmend, ${erg.abweichungen.length} Abweichung(en); ` +
    `${erg.mod.KLASSEN_AUSSAGEN.length} Einstufungsregeln, ${erg.aussagen.length} falsche Einstufung(en).`);
  const zeig = t => `  ${t.ok ? 'ok ' : 'ABW'} ${t.id}: gefunden ${t.wert}, Soll ${t.soll}\n      ${t.ort}\n      … ${t.auszug} …`;
  for (const t of process.argv.includes('--alle') ? erg.treffer : erg.abweichungen) console.log(zeig(t));
  for (const a of erg.aussagen) console.log(`  EINST ${a.id}\n      ${a.ort}\n      … ${a.auszug} …\n      richtig: ${a.richtig}`);
  process.exit(erg.abweichungen.length || erg.aussagen.length ? 1 : 0);
}
