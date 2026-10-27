// Komponententests Ansichtsumschalter/Segment-Schalter: AuswahlGruppe (radiogroup), ReiterLeiste (tablist) – Gutachten-Maßnahme 7
import fs from 'node:fs';
import path from 'node:path';
import { h, rendere, anzahl, sicher, testlauf } from './hilfen/komponenten';
const { AuswahlGruppe, ReiterLeiste, alsOption, alsReiter, reiterPanel, reiterId, fokusIndex, pfeilZiel } = await import('../src/components/ui/Auswahlgruppe');

const t = testlauf('Komponenten Auswahlgruppe');
const werte = ['m', 'kn', 'mpa'] as const;

t.test('AuswahlGruppe: radiogroup mit Label, Optionen mit aria-checked und roving tabindex', () => {
  const html = rendere(h(AuswahlGruppe, { label: 'Einheit', className: 'flex gap-2' },
    werte.map(w => h('button', { key: w, type: 'button', ...alsOption(w === 'kn') }, w))));
  sicher(/role="radiogroup"/.test(html) && html.includes('aria-label="Einheit"'), 'radiogroup mit Label fehlt');
  sicher(html.includes('class="flex gap-2"'), 'Klassen der Fundstelle müssen erhalten bleiben');
  sicher(anzahl(html, /role="radio"/) === 3, 'drei Optionen erwartet');
  sicher(anzahl(html, /aria-checked="true"/) === 1 && anzahl(html, /aria-checked="false"/) === 2, 'aria-checked falsch');
  sicher(!html.includes('aria-pressed'), 'aria-pressed darf nicht mehr vorkommen');
  const an = html.match(/<button[^>]*aria-checked="true"[^>]*>/)?.[0] ?? '';
  sicher(an.includes('tabindex="0"') && anzahl(html, /tabindex="-1"/) === 2, 'roving tabindex falsch');
});
t.test('ReiterLeiste: tablist, Reiter mit aria-selected/aria-controls, Panel verknüpft', () => {
  const html = rendere(h('div', null,
    h(ReiterLeiste, { label: 'Ansicht' }, werte.map(w => h('button', { key: w, type: 'button', ...alsReiter(w === 'mpa', 'xy-ansicht', w) }, w))),
    h('div', { ...reiterPanel('xy-ansicht', 'mpa'), className: 'space-y-4' }, 'Inhalt')));
  sicher(/role="tablist"/.test(html) && html.includes('aria-label="Ansicht"'), 'tablist mit Label fehlt');
  sicher(anzahl(html, /role="tab"/) === 3 && anzahl(html, /aria-controls="xy-ansicht"/) === 3, 'Reiter/aria-controls falsch');
  const panel = html.match(/<div[^>]*role="tabpanel"[^>]*>/)?.[0] ?? '';
  const lb = panel.match(/aria-labelledby="([^"]+)"/)?.[1];
  sicher(panel.includes('id="xy-ansicht"') && panel.includes('class="space-y-4"'), 'Panel-ID/Klassen fehlen');
  const aktiv = html.match(/<button[^>]*aria-selected="true"[^>]*>/)?.[0] ?? '';
  sicher(!!lb && aktiv.includes(`id="${lb}"`), 'aria-labelledby zeigt nicht auf den aktiven Reiter');
});
t.test('reiterId: gültige, stabile IDs auch für Umlaute, Leerzeichen und Zahlen', () => {
  sicher(reiterId('p', 'mörtel') === 'p-reiter-mortel', `Umlaut: ${reiterId('p', 'mörtel')}`);
  sicher(reiterId('p', 'a b/c') === 'p-reiter-a_b_c', 'Sonderzeichen');
  sicher(reiterId('p', 3) === 'p-reiter-3' && reiterId('p', 3) === reiterId('p', '3'), 'Zahl und Zeichenkette gleich');
});
t.test('fokusIndex: gewählter Eintrag, sonst erster bedienbarer, deaktivierte übersprungen', () => {
  sicher(fokusIndex([{ gewaehlt: false, aus: false }, { gewaehlt: true, aus: false }]) === 1, 'gewählter');
  sicher(fokusIndex([{ gewaehlt: false, aus: true }, { gewaehlt: false, aus: false }]) === 1, 'keiner gewählt → erster bedienbarer');
  sicher(fokusIndex([{ gewaehlt: true, aus: true }, { gewaehlt: false, aus: false }]) === 1, 'gewählt, aber deaktiviert');
  sicher(fokusIndex([{ gewaehlt: false, aus: true }]) === -1 && fokusIndex([]) === -1, 'keiner bedienbar');
});
t.test('pfeilZiel: zyklisch, Pos1/Ende, deaktivierte übersprungen, andere Tasten −1', () => {
  const aus = [false, true, false, false];
  sicher(pfeilZiel('ArrowRight', 0, aus) === 2 && pfeilZiel('ArrowDown', 3, aus) === 0, '→/↓ mit Überspringen');
  sicher(pfeilZiel('ArrowLeft', 2, aus) === 0 && pfeilZiel('ArrowUp', 0, aus) === 3, '←/↑ mit Überspringen');
  sicher(pfeilZiel('Home', 3, aus) === 0 && pfeilZiel('End', 0, aus) === 3, 'Pos1/Ende');
  sicher(pfeilZiel('Enter', 0, aus) === -1 && pfeilZiel(' ', 0, aus) === -1, 'Eingabe/Leertaste bleiben beim Button');
  sicher(pfeilZiel('ArrowRight', 1, aus) === -1 && pfeilZiel('ArrowRight', 0, []) === -1, 'deaktivierter Start / leer');
});

// Quelltext-Wächter: Einfachauswahl nicht wieder mit aria-pressed, jede Reiterleiste mit Panel
function tsxDateien(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? tsxDateien(p) : e.name.endsWith('.tsx') ? [p] : [];
  });
}
const DATEIEN = tsxDateien('src').map(p => ({ p, src: fs.readFileSync(p, 'utf8') }));
/** bewusst verbleibende Einzeltoggles mit Vergleich (z. B. „alle anzeigen“) */
const EINZELTOGGLES = ['src/modules/ki/Systemarchitektur.tsx'];
t.test('kein aria-pressed={a === b} (Einfachauswahl) außerhalb der Einzeltoggle-Liste', () => {
  const treffer = DATEIEN.filter(d => /aria-pressed=\{[^}]*===/.test(d.src) && !EINZELTOGGLES.includes(d.p.replace(/\\/g, '/'))).map(d => d.p);
  sicher(treffer.length === 0, `aria-pressed mit Vergleich: ${treffer.join(', ')}`);
});
t.test('jede alsReiter-Panel-ID hat ein reiterPanel in derselben Datei', () => {
  const fehlt: string[] = [];
  let n = 0;
  for (const d of DATEIEN) {
    const ids = new Set([...d.src.matchAll(/alsReiter\([^;]*?,\s*'([a-z0-9-]+)',/g)].map(m => m[1]));
    for (const id of ids) { n++; if (!d.src.includes(`reiterPanel('${id}'`)) fehlt.push(`${d.p}: ${id}`); }
  }
  sicher(n >= 40, `zu wenige Reiterleisten gefunden (${n}) – Muster prüfen`);
  sicher(fehlt.length === 0, `Reiter ohne Panel: ${fehlt.join(', ')}`);
});

t.ende();
