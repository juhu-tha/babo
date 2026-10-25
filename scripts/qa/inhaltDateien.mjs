// Gemeinsame Hilfen der QA-Skripte für ausgelagerte Fachtexte unter content/ (AP 5.3).
// Jede Datei content/<modul>/<Datei>.json hat die Gruppen „texte“ (Inline-Markdown, aus JSX),
// „werte“ (einzelne Zeichenketten) und „daten“ (Literal-Teilbäume unter Pfadschlüsseln).
import fs from 'fs';
import path from 'path';

export const INHALT_ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../../content');

/** Alle JSON-Dateien unter content/ (absolute Pfade, sortiert) */
export function inhaltsDateien(root = INHALT_ROOT) {
  if (!fs.existsSync(root)) return [];
  const aus = [];
  (function lauf(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) lauf(p); else if (e.name.endsWith('.json')) aus.push(p);
    }
  })(root);
  return aus;
}

/**
 * Alle Zeichenketten einer Inhaltsdatei: { gruppe, schluessel, eigenschaft, text }.
 * eigenschaft = letzter Objektschlüssel auf dem Weg zur Zeichenkette (für Daten wie { formel: '…' }).
 */
export function inhaltsTexte(datei) {
  const json = JSON.parse(fs.readFileSync(datei, 'utf8'));
  const aus = [];
  for (const [gruppe, eintraege] of Object.entries(json)) {
    for (const [schluessel, wert] of Object.entries(eintraege)) {
      (function lauf(v, eigenschaft) {
        if (typeof v === 'string') aus.push({ gruppe, schluessel, eigenschaft, text: v });
        else if (Array.isArray(v)) v.forEach(x => lauf(x, eigenschaft));
        else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) lauf(x, k);
      })(wert, null);
    }
  }
  return aus;
}

/** $…$-Formeln in einem Inline-Markdown-Text (wie src/lib/inhaltMd.ts; \$ ist kein Formelbeginn) */
export function mdFormeln(text) {
  const aus = [];
  for (let i = 0; i < text.length; i++) {
    if (text[i] === '\\') { i++; continue; }
    if (text[i] === '`') { const z = text.indexOf('`', i + 1); if (z > i + 1) { i = z; continue; } }
    if (text[i] === '$') { const z = text.indexOf('$', i + 1); if (z > i + 1) { aus.push(text.slice(i + 1, z)); i = z; } }
  }
  return aus;
}

/** Text ohne $…$-Formeln (für Zahlformat-Prüfungen des Fließtextes) */
export function ohneFormeln(text) {
  let s = text;
  for (const f of mdFormeln(text)) s = s.replace('$' + f + '$', ' ');
  return s;
}

export const relativ = datei => path.relative(path.resolve(INHALT_ROOT, '..'), datei);
