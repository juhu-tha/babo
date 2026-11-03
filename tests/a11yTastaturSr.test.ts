// Barrierefreiheit über axe hinaus (Prüfung 03.11.2026, docs/pruefung/a11y-tastatur-sr-2026-11-03.md):
// Regler-Texte, Fokusführung in Dialogen, Ergebnisansage, Erläuterungen, Suchstatus. Browserseitige Abläufe
// prüft scripts/qa/a11y-tastatur.mjs.
import fs from 'fs';
import { h, rendere, sicher, testlauf } from './hilfen/komponenten';
const { Slider, einheitText, reglerText } = await import('../src/components/ui/Slider');
const { InfoTooltip } = await import('../src/components/ui/InfoTooltip');
const { ErgebnisAnsage, ansageText, ANSAGE_MAX } = await import('../src/components/ui/ErgebnisAnsage');
const { FormulaDerivationBox } = await import('../src/components/ui/FormulaDerivationBox');
const { einheitAusBeschriftung, anzeigeNebenRegler, reglerWertText } = await import('../src/components/a11y/useAutoFormLabels');
const { tabZiel } = await import('../src/components/a11y/useDialogFokus');
const { suchStatusText } = await import('../src/components/navigation/ModulNavigation');

const t = testlauf('Barrierefreiheit Tastatur/Screenreader');

t.test('Slider: aria-valuetext mit deutschem Wert und Einheit', () => {
  const html = rendere(h(Slider, { label: 'Steinlänge', value: 0.45, unit: 'mm', min: 0, max: 1, step: 0.05, onChange: () => {} }));
  sicher(html.includes('aria-valuetext="0,45 mm"'), html.slice(0, 300));
  sicher(reglerText(12500, 'kN') === '12 500 kN' || reglerText(12500, 'kN').endsWith(' kN'), reglerText(12500, 'kN'));
  sicher(einheitText(undefined) === '' && einheitText('MPa') === 'MPa' && einheitText(h('span', null, 'x')) === null, 'einheitText');
});
t.test('Slider: eigener valueText hat Vorrang; Erläuterung per Tastatur (Schaltfläche mit Beschreibung)', () => {
  const html = rendere(h(Slider, { label: 'w', value: 3, min: 0, max: 5, valueText: 'drei Prozent', info: 'Wassergehalt', onChange: () => {} }));
  sicher(html.includes('aria-valuetext="drei Prozent"'), 'valueText fehlt');
  sicher(/<button[^>]*aria-describedby=/.test(html) && html.includes('role="tooltip"'), 'Erläuterung nicht per Tastatur erreichbar');
});
t.test('InfoTooltip: Schaltfläche mit Namen, Tooltip per Fokus einblendbar', () => {
  const html = rendere(h(InfoTooltip, { text: 'Hinweis zur Eingabe' }));
  sicher(html.includes('aria-label="Erläuterung"') && html.includes('group-focus-within:block'), html);
  sicher(!/<div/.test(html), 'Blockelemente im Tooltip (darf in Beschriftungen stehen)');
});
t.test('ErgebnisAnsage: Statusregion, beim Seitenaufbau leer, Text gekürzt', () => {
  const html = rendere(h(ErgebnisAnsage, { text: 'U-Wert 0,24 W/(m²K)' }));
  sicher(html.includes('role="status"') && html.includes('aria-live="polite"') && !html.includes('0,24'), html);
  sicher(ansageText('a  b\n c') === 'a b c', 'Leerraum');
  sicher(ansageText('x'.repeat(500)).length === ANSAGE_MAX, 'Kürzung');
});
t.test('FormulaDerivationBox: Ergebnis wird als Statusmeldung bereitgestellt', () => {
  const html = rendere(h(FormulaDerivationBox, { title: 'Knicklast', zielGleichung: 'F', schritte: [], ergebnisHinweis: 'F_K = 10 kN' }));
  sicher(html.includes('data-ergebnis-ansage'), 'Ansage fehlt');
});
t.test('Regler ohne eigene Angabe: Anzeige daneben, sonst Wert mit Einheit aus der Beschriftung', () => {
  sicher(einheitAusBeschriftung('Dicke (cm)') === 'cm', 'Klammer');
  sicher(einheitAusBeschriftung('Innentemperatur Ti in °C') === '°C', 'in');
  sicher(einheitAusBeschriftung('Charakt. Druckfestigkeit (fck)') === null, 'Formelzeichen ist keine Einheit');
  sicher(anzeigeNebenRegler({ kinder: 2, letzterText: '934,8 kN (65 % FK)' }) === '934,8 kN (65 % FK)', 'Anzeige');
  sicher(anzeigeNebenRegler({ kinder: 1, letzterText: '5 kN' }) === null, 'eine Zeile ohne Name');
  sicher(reglerWertText('0.45', null, 'w/z-Wert') === '0,45', reglerWertText('0.45', null, 'w/z-Wert'));
  sicher(reglerWertText('12', null, 'Dicke (cm)') === '12 cm', 'mit Einheit');
});
t.test('Dialog: Tab bleibt im modalen Dialog', () => {
  sicher(tabZiel(2, 3, false) === 0 && tabZiel(0, 3, true) === 2 && tabZiel(1, 3, false) === -1 && tabZiel(-1, 3, false) === 0, 'tabZiel');
});
t.test('Suche: Trefferzahl als Text', () => {
  sicher(suchStatusText(1, null) === '1 Modul gefunden', suchStatusText(1, null));
  sicher(suchStatusText(4, 7) === '4 Module gefunden, 7 Treffer im Inhalt', suchStatusText(4, 7));
});
t.test('Quelltext: Dialoge mit Fokusführung, Seitenleistenschalter benannt, keine Hover-Tooltips ohne Fokus', () => {
  const app = fs.readFileSync('src/App.tsx', 'utf8');
  sicher((app.match(/useDialogFokus\(/g) ?? []).length >= 2, 'mobiles Menü/Werkzeuge ohne Fokusführung');
  sicher(/aria-label=\{language === 'en' \? 'Hide navigation' : 'Navigation ausblenden'\} aria-controls="seitenleiste"/.test(app), 'Seitenleistenschalter ohne Namen/aria-controls');
  sicher(!/onClick=\{handleExport\} disabled=/.test(app), 'PDF-Export mit disabled (Fokusverlust)');
  sicher(/useDialogFokus\(/.test(fs.readFileSync('src/components/a11y/AccessibilityToolbar.tsx', 'utf8')), 'A11y-Dialog ohne Fokusführung');
  sicher(/aria-modal="true"/.test(fs.readFileSync('src/components/ui/ModuleFooter.tsx', 'utf8')), 'Haftungshinweis ohne aria-modal');
  for (const f of ['src/components/ui/Slider.tsx', 'src/components/ui/InfoTooltip.tsx', 'src/modules/mischungsberechnung/MischungEingaben.tsx']) {
    const s = fs.readFileSync(f, 'utf8');
    sicher(!/group-hover:block(?![^"`]*group-focus-within:block)/.test(s), `${f}: Tooltip nur beim Überfahren`);
  }
  const css = fs.readFileSync('src/index.css', 'utf8');
  sicher(/@media \(forced-colors: active\)/.test(css) && /\.opacity-0:focus-visible/.test(css), 'CSS forced-colors/Fokus');
});
t.ende();
