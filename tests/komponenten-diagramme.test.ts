// Komponententests Diagramm-Textalternative (Paket Z8, WCAG 1.1.1 / 1.3.1):
// Kurzbeschreibung und Datentabelle aus der Chart.js-Datenkonfiguration (src/lib/diagrammDaten.ts),
// Hülle mit Schaltfläche/Tabelle/Druckbeschreibung (src/lib/diagrammAlternative.tsx) und die Einbindung in
// den Bedarfs-Ersatz für react-chartjs-2 (src/lib/chartBedarf.tsx; ohne window: nur Platzhalter, kein Chart.js).
import { h, rendere, text, anzahl, sicher, testlauf } from './hilfen/komponenten';
const { zusammenfassung, tabellen, zahl, MAX_ZEILEN } = await import('../src/lib/diagrammDaten');
const { DiagrammHuelle, DiagrammAngaben, DatenTabelle } = await import('../src/lib/diagrammAlternative');
const { Line, Bar, Pie, Scatter } = await import('../src/lib/chartBedarf');

const t = testlauf('Komponenten Diagramme');

const linie = {
  labels: [0, 7, 28],
  datasets: [
    { label: 'CEM I', data: [0, 32.5, 52.512] },
    { label: 'CEM III', data: [0, 18, 45] },
  ],
};
const linieOpt = {
  plugins: { title: { display: true, text: 'Festigkeitsentwicklung' } },
  scales: { x: { title: { text: 'Alter in d' } }, y: { title: { text: 'Druckfestigkeit in N/mm²' } } },
};

// ── Kurzbeschreibung ─────────────────────────────────────────────────────────
t.test('Zusammenfassung: Art, Titel, Reihen, Achsen und Wertebereich deutsch formatiert', () => {
  const s = zusammenfassung('line', linie, linieOpt);
  sicher(s.startsWith('Liniendiagramm: Festigkeitsentwicklung.'), s);
  sicher(s.includes('2 Datenreihen (CEM I, CEM III)'), s);
  sicher(s.includes('Alter in d von 0 bis 28'), s);
  sicher(s.includes('Druckfestigkeit in N/mm² von 0 bis 52,51'), s);
});
t.test('Zusammenfassung: eigene Beschreibung hat Vorrang, Titel aus Angaben', () => {
  sicher(zusammenfassung('line', linie, linieOpt, { zusammenfassung: 'Eigene Beschreibung.' }) === 'Eigene Beschreibung.', 'eigene Beschreibung ignoriert');
  sicher(zusammenfassung('bar', linie, {}, { titel: 'Vergleich' }).startsWith('Balkendiagramm: Vergleich.'), 'Titel aus Angaben fehlt');
});
t.test('Zusammenfassung: Kreisdiagramm mit Anteilen in %', () => {
  const s = zusammenfassung('pie', { labels: ['Zement', 'Wasser', 'Gestein'], datasets: [{ data: [1, 1, 2] }] });
  sicher(s.includes('Kreisdiagramm') && s.includes('Zement 25 %') && s.includes('Gestein 50 %'), s);
});
t.test('Zusammenfassung: Streudiagramm mit x/y-Punkten, Einheiten aus Angaben; ohne Daten', () => {
  const s = zusammenfassung('scatter', { datasets: [{ label: 'Proben', data: [{ x: 0.4, y: 50 }, { x: 0.6, y: 30 }] }] }, {}, { einheiten: { y: 'N/mm²' } });
  sicher(s.includes('x-Achse von 0,4 bis 0,6') && s.includes('Werte von 30 bis 50 N/mm²'), s);
  sicher(zusammenfassung('line', { datasets: [] }) === 'Liniendiagramm (keine Daten).', 'leere Daten');
});
t.test('Zahlformat: Komma, 4 signifikante Stellen, Tausendertrennung ab 5 Stellen', () => {
  sicher(zahl(0.12345) === '0,1235' && zahl(1234.6) === '1235' && zahl(210000) === '210.000' && zahl(3) === '3', `${zahl(0.12345)} ${zahl(1234.6)} ${zahl(210000)}`);
});

// ── Tabelle ──────────────────────────────────────────────────────────────────
t.test('Tabelle: Kategorien als Zeilen, Reihen als Spalten, Einheit im Spaltenkopf', () => {
  const [tab, ...rest] = tabellen('line', linie, linieOpt, { einheiten: { y: 'N/mm²' } });
  sicher(!rest.length, 'genau eine Tabelle erwartet');
  sicher(tab.kopf === 'Alter in d' && tab.spalten.join('|') === 'CEM I [N/mm²]|CEM III [N/mm²]', `${tab.kopf} / ${tab.spalten.join('|')}`);
  sicher(tab.zeilen.length === 3 && tab.zeilen[2].kopf === '28' && tab.zeilen[2].zellen.join('|') === '52,51|45', JSON.stringify(tab.zeilen[2]));
  sicher(tab.beschriftung.includes('Festigkeitsentwicklung') && tab.beschriftung.includes('Druckfestigkeit in N/mm²'), tab.beschriftung);
});
t.test('Tabelle: Punkte mit verschiedenen x-Werten → gemeinsame, sortierte x-Spalte mit Lücken', () => {
  const [tab] = tabellen('line', { datasets: [{ label: 'A', data: [{ x: 0, y: 1 }, { x: 2, y: 3 }] }, { label: 'B', data: [{ x: 1, y: 5 }] }] });
  sicher(tab.zeilen.map(z => z.kopf).join(',') === '0,1,2', tab.zeilen.map(z => z.kopf).join(','));
  sicher(tab.zeilen[1].zellen.join('|') === '–|5', tab.zeilen[1].zellen.join('|'));
});
t.test('Tabelle: ganz verschiedene x-Werte → je Reihe eine Tabelle', () => {
  const a = Array.from({ length: 20 }, (_, i) => ({ x: i, y: i }));
  const b = Array.from({ length: 20 }, (_, i) => ({ x: 100 + i, y: i }));
  const tabs = tabellen('scatter', { datasets: [{ label: 'A', data: a }, { label: 'B', data: b }] });
  sicher(tabs.length === 2 && tabs[1].beschriftung.endsWith('– B'), `${tabs.length}`);
});
t.test('Tabelle: lange Reihen werden ausgedünnt (letzte Zeile bleibt), Spannen und Blasen', () => {
  const n = 401;
  const [tab] = tabellen('line', { labels: Array.from({ length: n }, (_, i) => i), datasets: [{ data: Array.from({ length: n }, (_, i) => i * 2) }] });
  sicher(tab.gesamt === n && tab.schritt > 1 && tab.zeilen.length <= MAX_ZEILEN + 1, `${tab.zeilen.length} Zeilen, Schritt ${tab.schritt}`);
  sicher(tab.zeilen[tab.zeilen.length - 1].kopf === '400' && tab.spalten[0] === 'Wert', 'letzte Zeile/Spaltenname');
  const [spanne] = tabellen('bar', { labels: ['C20/25'], datasets: [{ label: 'Streuung', data: [[20, 25]] }] });
  sicher(spanne.zeilen[0].zellen[0] === '20 bis 25', spanne.zeilen[0].zellen[0]);
  const [blase] = tabellen('bubble', { datasets: [{ label: 'B', data: [{ x: 1, y: 2, r: 5 }] }] });
  sicher(blase.zeilen[0].zellen[0] === '2 (Größe 5)', blase.zeilen[0].zellen[0]);
});
t.test('Tabelle: liegende Balken (indexAxis y) nutzen die y-Achse als Kategorie', () => {
  const [tab] = tabellen('bar', { labels: ['Holz', 'Stahl'], datasets: [{ label: 'GWP', data: [-1.2, 1.9] }] }, { indexAxis: 'y', scales: { y: { title: { text: 'Baustoff' } } } }, { einheiten: { x: 'kg CO₂-Äq.' } });
  sicher(tab.kopf === 'Baustoff' && tab.spalten[0] === 'GWP [kg CO₂-Äq.]' && tab.zeilen[0].zellen[0] === '-1,2', `${tab.kopf} ${tab.spalten[0]} ${tab.zeilen[0].zellen[0]}`);
});
t.test('DatenTabelle: caption, th scope="col"/"row", Auszugshinweis', () => {
  const [tab] = tabellen('line', linie, linieOpt);
  const html = rendere(h(DatenTabelle, { tabelle: { ...tab, schritt: 3, gesamt: 9 } }));
  sicher(html.includes('<caption') && anzahl(html, /scope="col"/) === 3 && anzahl(html, /scope="row"/) === 3, html.slice(0, 200));
  sicher(text(html).includes('Auszug: jede 3. von 9 Zeilen'), 'Auszugshinweis fehlt');
});

// ── Hülle ────────────────────────────────────────────────────────────────────
t.test('Hülle: Beschreibung an den Inhalt, eingeklappte Schaltfläche, Druckbeschreibung', () => {
  let erhalten = '';
  const html = rendere(h(DiagrammHuelle, { art: 'line', daten: linie, optionen: linieOpt, modus: 'fuellen', children: (b: string) => { erhalten = b; return h('canvas', { 'aria-label': b }); } }));
  sicher(erhalten.startsWith('Liniendiagramm: Festigkeitsentwicklung'), erhalten);
  sicher(html.includes('aria-expanded="false"') && text(html).includes('Daten als Tabelle anzeigen'), 'Schaltfläche fehlt');
  sicher(!html.includes('<table'), 'Tabelle darf erst nach dem Öffnen erscheinen');
  sicher(html.includes('print:block') && html.includes('data-pdf-ausblenden'), 'Druck-/PDF-Kennzeichnung fehlt');
  sicher(html.includes('height:100%') && html.includes('flex:1 1 0%'), 'Füllmodus: Hülle muss Behälterhöhe übernehmen');
});
t.test('Hülle: aria-label des Moduls hat Vorrang; DiagrammAngaben (Beschreibung, tabelle: false)', () => {
  let b1 = '';
  rendere(h(DiagrammHuelle, { art: 'bar', daten: linie, optionen: {}, ariaLabel: 'Eigenes Label', modus: 'verhaeltnis', children: (b: string) => { b1 = b; return null; } }));
  sicher(b1 === 'Eigenes Label', b1);
  let b2 = '';
  const html = rendere(h(DiagrammAngaben, { zusammenfassung: 'Aus Angaben.', tabelle: false },
    h(DiagrammHuelle, { art: 'bar', daten: linie, optionen: {}, modus: 'verhaeltnis', children: (b: string) => { b2 = b; return null; } })));
  sicher(b2 === 'Aus Angaben.' && !html.includes('<button'), `${b2} / Schaltfläche trotz tabelle: false`);
});

// ── Einbindung in chartBedarf (Platzhalter vor dem Zeichnen) ─────────────────
t.test('chartBedarf: Platzhalter mit role="img", Kurzbeschreibung und Schaltfläche (Line, Bar, Pie, Scatter)', () => {
  const faelle: [unknown, string][] = [[Line, 'Liniendiagramm'], [Bar, 'Balkendiagramm'], [Pie, 'Kreisdiagramm'], [Scatter, 'Streudiagramm']];
  for (const [K, name] of faelle) {
    const html = rendere(h(K as never, { data: linie, options: { maintainAspectRatio: false } } as never));
    sicher(html.includes('data-diagramm-platzhalter') && html.includes('role="img"'), `${name}: Platzhalter fehlt`);
    sicher(new RegExp(`aria-label="${name}`).test(html), `${name}: Kurzbeschreibung fehlt – ${html.slice(0, 300)}`);
    sicher(text(html).includes('Daten als Tabelle anzeigen'), `${name}: Schaltfläche fehlt`);
  }
});
t.test('chartBedarf: Seitenverhältnis-Modus behält Platzhaltergröße, aria-label des Moduls bleibt', () => {
  const html = rendere(h(Line as never, { data: linie, options: {}, 'aria-label': 'Mein Diagramm' } as never));
  sicher(html.includes('aspect-ratio:2') && html.includes('aria-label="Mein Diagramm"'), html.slice(0, 400));
});

t.ende();
