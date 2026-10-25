// Komponententests Reiter: ModuleTabs, GruppierteModuleTabs (AP 5.6)
import fs from 'node:fs';
import path from 'node:path';
import { h, rendere, anzahl, sicher, testlauf } from './hilfen/komponenten';
const { ModuleTabs, reiterZiel } = await import('../src/components/ui/ModuleTabs');
const { GruppierteModuleTabs, aktiveGruppe, zielBeiGruppenwechsel } = await import('../src/components/ui/GruppierteModuleTabs');
const { RECHNUNG_GRUPPEN } = await import('../src/modules/beispielrechnungen/daten');

const t = testlauf('Komponenten Reiter');
const noop = () => {};
const tabs = [
  { id: 'a', label: 'Grundlagen' },
  { id: 'b', label: 'Rechner' },
  { id: 'c', label: 'Labor' },
] as const;

t.test('ModuleTabs: tablist mit aria-label, je Eintrag ein tab', () => {
  const html = rendere(h(ModuleTabs, { label: 'Bereiche', tabs, aktiv: 'b', onWechsel: noop }));
  sicher(/role="tablist"[^>]*aria-label="Bereiche"|aria-label="Bereiche"[^>]*role="tablist"/.test(html), 'tablist mit Label fehlt');
  sicher(anzahl(html, /role="tab"/) === 3, `3 Reiter erwartet, ${anzahl(html, /role="tab"/)} gefunden`);
});
t.test('ModuleTabs: genau ein aria-selected="true" am aktiven Reiter, roving tabindex', () => {
  const html = rendere(h(ModuleTabs, { label: 'Bereiche', tabs, aktiv: 'b', onWechsel: noop }));
  sicher(anzahl(html, /aria-selected="true"/) === 1 && anzahl(html, /aria-selected="false"/) === 2, 'aria-selected falsch');
  const aktiv = html.match(/<button[^>]*aria-selected="true"[^>]*>/)?.[0] ?? '';
  sicher(aktiv.includes('tabindex="0"') && aktiv.includes('-tab-b"'), 'aktiver Reiter ohne tabindex 0 bzw. falsche ID');
  sicher(anzahl(html, /tabindex="-1"/) === 2, 'inaktive Reiter brauchen tabindex -1');
});
t.test('ModuleTabs: tabpanel nur mit Inhalt, verknüpft per aria-labelledby/aria-controls', () => {
  const ohne = rendere(h(ModuleTabs, { label: 'Bereiche', tabs, aktiv: 'a', onWechsel: noop }));
  sicher(!ohne.includes('role="tabpanel"'), 'tabpanel ohne Inhalt');
  const mit = rendere(h(ModuleTabs, { label: 'Bereiche', tabs, aktiv: 'a', onWechsel: noop }, h('p', null, 'Inhalt A')));
  const panel = mit.match(/<div role="tabpanel"[^>]*>/)?.[0] ?? '';
  const panelId = panel.match(/id="([^"]+)"/)?.[1];
  const labelledby = panel.match(/aria-labelledby="([^"]+)"/)?.[1];
  sicher(panelId && mit.includes(`aria-controls="${panelId}"`), 'aria-controls zeigt nicht auf das Panel');
  sicher(labelledby && mit.includes(`id="${labelledby}"`) && labelledby.endsWith('-tab-a'), 'aria-labelledby zeigt nicht auf aktiven Reiter');
  sicher(mit.includes('Inhalt A'), 'Inhalt fehlt');
});
t.test('ModuleTabs: unbekannter aktiver Reiter → kein Absturz, kein Reiter ausgewählt', () => {
  const html = rendere(h(ModuleTabs, { label: 'B', tabs, aktiv: 'x' as 'a', onWechsel: noop }));
  sicher(anzahl(html, /aria-selected="true"/) === 0, 'kein Reiter darf ausgewählt sein');
  sicher(html.includes('tabindex="-1"'), 'Reiter fehlen');
});
t.test('ModuleTabs: Variante „kachel“ rendert Raster', () => {
  const html = rendere(h(ModuleTabs, { label: 'B', tabs, aktiv: 'a', onWechsel: noop, variante: 'kachel' }));
  sicher(html.includes('grid grid-cols-1'), 'Kachelraster fehlt');
});
t.test('ModuleTabs: Tastatursteuerung (reiterZiel) zyklisch, Pos1/Ende, andere Tasten −1', () => {
  sicher(reiterZiel('ArrowRight', 2, 3) === 0 && reiterZiel('ArrowDown', 0, 3) === 1, '→/↓');
  sicher(reiterZiel('ArrowLeft', 0, 3) === 2 && reiterZiel('ArrowUp', 2, 3) === 1, '←/↑');
  sicher(reiterZiel('Home', 2, 3) === 0 && reiterZiel('End', 0, 3) === 2, 'Pos1/Ende');
  sicher(reiterZiel('Enter', 1, 3) === -1 && reiterZiel('ArrowRight', 0, 0) === -1, 'unbelegte Taste / keine Reiter');
});

const gruppen = [
  { id: 'g1', label: 'Grundlagen', mitglieder: [{ id: 'a', label: 'A' }] },
  { id: 'g2', label: 'Rechner', mitglieder: [{ id: 'b', label: 'B1' }, { id: 'c', label: 'B2' }] },
] as const;
t.test('GruppierteModuleTabs: Einzelgruppe ohne zweite Ebene', () => {
  const html = rendere(h(GruppierteModuleTabs, { label: 'Bereiche', gruppen, aktiv: 'a', onWechsel: noop }, 'X'));
  sicher(anzahl(html, /role="tablist"/) === 1 && anzahl(html, /role="tab"/) === 2, 'nur Hauptreiter erwartet');
  sicher(anzahl(html, /role="tabpanel"/) === 1, 'ein Panel erwartet');
});
t.test('GruppierteModuleTabs: Mehrfachgruppe mit Unterreitern, beide Ebenen markiert', () => {
  const html = rendere(h(GruppierteModuleTabs, { label: 'Bereiche', gruppen, aktiv: 'c', onWechsel: noop }, 'X'));
  sicher(anzahl(html, /role="tablist"/) === 2, 'zwei Reiterleisten erwartet');
  sicher(html.includes('aria-label="Rechner: Unterbereiche"'), 'Label der Unterleiste fehlt');
  sicher(anzahl(html, /aria-selected="true"/) === 2, 'Haupt- und Unterreiter müssen ausgewählt sein');
  sicher(anzahl(html, /role="tabpanel"/) === 2, 'verschachtelte Panels erwartet');
});
t.test('GruppierteModuleTabs: Logik aktiveGruppe / zielBeiGruppenwechsel', () => {
  sicher(aktiveGruppe(gruppen, 'c').id === 'g2' && aktiveGruppe(gruppen, 'zz' as 'a').id === 'g1', 'aktiveGruppe');
  sicher(zielBeiGruppenwechsel(gruppen, 'g2', {}) === 'b', 'erster Bereich ohne Verlauf');
  sicher(zielBeiGruppenwechsel(gruppen, 'g2', { g2: 'c' }) === 'c', 'zuletzt gewählter Bereich');
  sicher(zielBeiGruppenwechsel(gruppen, 'gx', {}) === undefined, 'unbekannte Gruppe');
});
t.test('GruppierteModuleTabs: 7 Gruppen werden vollständig gerendert', () => {
  const sieben = Array.from({ length: 7 }, (_, i) => ({ id: `g${i}`, label: `G${i}`, mitglieder: [{ id: `m${i}`, label: `M${i}` }] }));
  const html = rendere(h(GruppierteModuleTabs, { label: 'B', gruppen: sieben, aktiv: 'm3', onWechsel: noop }));
  sicher(anzahl(html, /role="tab"/) === 7, '7 Reiter erwartet');
});

/** Zählt Objekte der obersten Ebene in einem Array-Literal ab Position start (zeigt auf „[“). */
function objekteImArray(src: string, start: number): number {
  let tiefe = 0, objekte = 0, str: string | null = null;
  for (let i = start; i < src.length; i++) {
    const c = src[i];
    if (str) { if (c === '\\') i++; else if (c === str) str = null; continue; }
    if (c === "'" || c === '"' || c === '`') { str = c; continue; }
    if (c === '[' || c === '{' || c === '(') { if (c === '{' && tiefe === 1) objekte++; tiefe++; }
    else if (c === ']' || c === '}' || c === ')') { tiefe--; if (tiefe === 0) return objekte; }
  }
  return objekte;
}
t.test('Hauptreiter je Modul ≤ 7 (alle ModulTabGruppe-/ModulTab-Listen in src/modules)', () => {
  const zuGross: string[] = [];
  let gefunden = 0;
  const lauf = (dir: string) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) { lauf(p); continue; }
      if (!/\.tsx?$/.test(e.name)) continue;
      const src = fs.readFileSync(p, 'utf8');
      for (const m of src.matchAll(/(\w+)\s*:\s*readonly\s+ModulTab(?:Gruppe)?<[^>]+>\[\]\s*=\s*\[/g)) {
        gefunden++;
        const n = objekteImArray(src, m.index! + m[0].length - 1);
        if (n < 2) zuGross.push(`${path.relative(process.cwd(), p)}:${m[1]} (nur ${n} – Zählung prüfen)`);
        if (n > 7) zuGross.push(`${path.relative(process.cwd(), p)}:${m[1]} (${n})`);
      }
    }
  };
  lauf('src/modules');
  sicher(gefunden >= 8, `zu wenige Reiterlisten gefunden (${gefunden}) – Muster prüfen`);
  sicher(RECHNUNG_GRUPPEN.length <= 7, 'Beispielrechnungen > 7 Gruppen');
  sicher(zuGross.length === 0, `mehr als 7 Hauptreiter: ${zuGross.join(', ')}`);
});

t.ende();
