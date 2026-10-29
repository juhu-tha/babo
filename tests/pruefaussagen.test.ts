// Prüfaussagen vereinheitlicht (Gutachten 29.10.2026, 4.1/4.5): Kopf- und Fußvermerk kommen aus pruefvermerkFuer()
// und stimmen auf jedem Fachmodul überein; veraltete Formulierungen („nicht geprüft“, „fachliche Freigabe durch den
// Autor ausstehend“, „Inhaltlich zuletzt geprüft“) kommen in content/ und src/ nicht mehr vor.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { h, rendere, sicher, testlauf } from './hilfen/komponenten';
const { ModuleFooter } = await import('../src/components/ui/ModuleFooter');
const { PruefVermerk, vermerkOeffentlich } = await import('../src/components/ui/PruefVermerk');
const { pruefvermerkText, inhaltsstandAus, PRUEFVERFAHREN_HINWEIS, PRUEFUNG_IN_BEARBEITUNG } = await import('../src/components/ui/pruefvermerkText');
const { FACHMODULE, pruefvermerkFuer } = await import('../src/data/pruefvermerke');

const t = testlauf('Prüfaussagen Kopf/Fußzeile');

const vermerkText = (html: string, ort: 'kopf' | 'fuss'): string | undefined =>
  new RegExp(`data-pruefvermerk="${ort}">([^<]*)<`).exec(html)?.[1];

t.test('Kopf- und Fußvermerk stimmen auf allen Fachmodulen überein', () => {
  const fehler: string[] = [];
  let geprueft = 0;
  for (const m of FACHMODULE) {
    const v = pruefvermerkFuer(m.id);
    sicher(v, `${m.id}: kein Prüfvermerk`);
    const kopf = vermerkText(rendere(h(PruefVermerk, { vermerk: v })), 'kopf');
    const fussHtml = rendere(h(ModuleFooter, { moduleId: m.id, regelwerke: ['Eigene Richtlinie'], lastReviewed: 'Oktober 2026 (AP 0: Testtext)' }));
    const fuss = vermerkText(fussHtml, 'fuss');
    if (fuss !== pruefvermerkText(v)) fehler.push(`${m.id}: Fußzeile „${fuss}“ ≠ „${pruefvermerkText(v)}“`);
    if (vermerkOeffentlich(v) && kopf !== fuss) fehler.push(`${m.id}: Kopf „${kopf}“ ≠ Fuß „${fuss}“`);
    if (!vermerkOeffentlich(v) && kopf !== undefined) fehler.push(`${m.id}: offener Vermerk im Kopf sichtbar`);
    if (v.status === 'geprueft') {
      geprueft++;
      if (!/^Fachlich geprüft am \d{2}\.\d{2}\.\d{4}$/.test(fuss ?? '')) fehler.push(`${m.id}: geprüft, aber Fußzeile „${fuss}“`);
      if (!fussHtml.includes(PRUEFVERFAHREN_HINWEIS)) fehler.push(`${m.id}: Hinweis zum Prüfverfahren fehlt`);
    }
    if (v.status === 'offen' && fuss !== PRUEFUNG_IN_BEARBEITUNG) fehler.push(`${m.id}: offen, aber Fußzeile „${fuss}“`);
    if (/nicht geprüft|ausstehend|Autor|zuletzt geprüft/i.test(fussHtml.replace(/<[^>]+>/g, ' '))) fehler.push(`${m.id}: widersprüchliche Formulierung in der Fußzeile`);
    if (!fussHtml.includes('Inhaltsstand: Oktober 2026.') || fussHtml.includes('AP 0')) fehler.push(`${m.id}: Inhaltsstand nicht getrennt ausgewiesen`);
  }
  sicher(geprueft > 0, 'keine geprüften Module im Datenbestand');
  sicher(fehler.length === 0, fehler.slice(0, 10).join('\n'));
});

t.test('Nachprüfung: Kopf und Fuß gleich, Prüfverfahrenshinweis sichtbar', () => {
  const v = { status: 're-review' as const, am: '2026-10-01', von: 'Prof. X' };
  const kopf = vermerkText(rendere(h(PruefVermerk, { vermerk: v })), 'kopf');
  sicher(kopf === pruefvermerkText(v) && kopf.includes('Nachprüfung'), `Nachprüfung: ${kopf}`);
});

t.test('Inhaltsstand aus Freitext: nur Monat und Jahr', () => {
  sicher(inhaltsstandAus('Oktober 2026 (AP 5 Mechanik: Euler-Fälle geprüft)') === 'Oktober 2026', 'Monat/Jahr');
  sicher(inhaltsstandAus('2026-10') === '10/2026' && inhaltsstandAus('2026-10-29') === '29.10.2026', 'ISO-Angaben');
  sicher(inhaltsstandAus('nicht geprüft') === undefined && inhaltsstandAus(undefined) === undefined, 'Freitext ohne Datum wird nicht angezeigt');
});

// Alle lastReviewed-Angaben der Module liefern einen Inhaltsstand (sonst fiele er stillschweigend weg)
t.test('lastReviewed-Angaben der Module ergeben einen Inhaltsstand', () => {
  const fehler: string[] = [];
  let n = 0;
  const dateien = (d: string): string[] => readdirSync(d).flatMap(f => {
    const p = join(d, f);
    return statSync(p).isDirectory() ? dateien(p) : /\.tsx?$/.test(f) ? [p] : [];
  });
  for (const datei of dateien('src')) {
    const q = readFileSync(datei, 'utf8');
    for (const [, name, bereich, schluessel] of q.matchAll(/lastReviewed=\{(\w+)\.(werte|texte)\.(\w+)\}/g)) {
      const imp = new RegExp(`import ${name} from '([^']+\\.json)'`).exec(q)?.[1];
      if (!imp) { fehler.push(`${datei}: Import von ${name} nicht gefunden`); continue; }
      const pfad = imp.startsWith('@/') ? imp.slice(2) : resolve(dirname(datei), imp);
      const json = JSON.parse(readFileSync(pfad, 'utf8')) as Record<string, Record<string, string>>;
      const wert = json[bereich]?.[schluessel];
      n++;
      if (!inhaltsstandAus(wert)) fehler.push(`${datei}: ${name}.${bereich}.${schluessel} = „${wert}“ ohne Monat/Jahr`);
    }
  }
  sicher(n > 90, `nur ${n} lastReviewed-Angaben gefunden`);
  sicher(fehler.length === 0, fehler.join('\n'));
});

// Keine widersprüchlichen Freigabeaussagen mehr in Inhalten und Quelltext.
// Ausgenommen: Fragenpool (eigene Freigabe je Frage), Audit-Protokolle (historische Zitate), Admin-Bereich.
const VERBOTEN = [
  /Freigabe durch den Autor/i,
  /durch den Autor (ausstehend|geprüft|freigegeben)/i,
  /fachliche (Freigabe|Prüfung) ausstehend/i,
  /Inhaltlich zuletzt geprüft/i,
  /lastReviewed\s*=\s*['"]nicht geprüft['"]/,
];
const AUSNAHMEN = [/src[\\/]data[\\/]quiz\.json$/, /src[\\/]data[\\/]audit[\\/]/, /src[\\/]components[\\/]admin[\\/]/, /src[\\/]data[\\/]pruefvermerke\.ts$/];
t.test('keine veralteten Prüf-/Freigabeformulierungen in content/ und src/', () => {
  const treffer: string[] = [];
  const lauf = (d: string) => {
    for (const f of readdirSync(d)) {
      const p = join(d, f);
      if (statSync(p).isDirectory()) { lauf(p); continue; }
      if (!/\.(json|tsx?|md)$/.test(f) || AUSNAHMEN.some(a => a.test(p))) continue;
      const s = readFileSync(p, 'utf8');
      for (const v of VERBOTEN) if (v.test(s)) treffer.push(`${p}: ${v}`);
    }
  };
  lauf('content');
  lauf('src');
  sicher(treffer.length === 0, treffer.join('\n'));
});

t.ende();
