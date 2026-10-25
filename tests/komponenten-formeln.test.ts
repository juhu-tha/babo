// Komponententests Formeldarstellung: FormulaText, FormulaDerivationBox (AP 5.6)
import { h, rendere, text, anzahl, sicher, testlauf } from './hilfen/komponenten';
const { FormulaText } = await import('../src/components/ui/FormulaText');
const { FormulaDerivationBox } = await import('../src/components/ui/FormulaDerivationBox');

const t = testlauf('Komponenten Formeln');

// ── FormulaText ──────────────────────────────────────────────────────────────
t.test('FormulaText: $…$ wird mit KaTeX gesetzt (MathML + TeX-Annotation)', () => {
  const html = rendere(h(FormulaText, { text: 'Es gilt $f_{ck} = 30$ MPa.' }));
  sicher(html.includes('class="katex"') && html.includes('<math'), 'KaTeX-Ausgabe fehlt');
  sicher(html.includes('<annotation encoding="application/x-tex">f_{ck} = 30</annotation>'), 'TeX-Quelle fehlt');
  sicher(text(html).startsWith('Es gilt'), 'Text vor der Formel fehlt');
});
t.test('FormulaText: mehrere $…$-Abschnitte → je ein KaTeX-Block', () => {
  const html = rendere(h(FormulaText, { text: '$a$ und $b$ sowie $c$' }));
  sicher(anzahl(html, /class="katex"/) === 3, `3 Formeln erwartet, ${anzahl(html, /class="katex"/)} gefunden`);
});
t.test('FormulaText: reiner Text ohne KaTeX', () => {
  const html = rendere(h(FormulaText, { text: 'Normalbeton nach DIN EN 206' }));
  sicher(!html.includes('katex'), 'KaTeX bei reinem Text');
  sicher(text(html) === 'Normalbeton nach DIN EN 206', 'Text verändert');
  sicher(!html.includes('data-formula'), 'data-formula bei reinem Text');
});
t.test('FormulaText: Indizes ohne $ als <sub>/<sup>', () => {
  const html = rendere(h(FormulaText, { text: 'f_{ck} und m^2' }));
  sicher(html.includes('f<sub>ck</sub>') && html.includes('m<sup>2</sup>'), `Index fehlt: ${html}`);
});
t.test('FormulaText: formelartiger Text erhält pdf-formula und data-formula', () => {
  const html = rendere(h(FormulaText, { text: 'w/z = 0,5' }));
  sicher(html.includes('pdf-formula') && html.includes('data-formula="w/z = 0,5"'), 'Formelmarkierung fehlt');
});
t.test('FormulaText: HTML in Text wird maskiert (kein XSS)', () => {
  const html = rendere(h(FormulaText, { text: '<img src=x onerror=alert(1)> Beton' }));
  sicher(!html.includes('<img') && html.includes('&lt;img'), 'HTML nicht maskiert');
});
t.test('FormulaText: className wird übernommen', () => {
  const html = rendere(h(FormulaText, { text: 'abc', className: 'text-xs' }));
  sicher(/^<span class="text-xs"/.test(html), 'Klasse fehlt');
});

// ── FormulaDerivationBox ─────────────────────────────────────────────────────
const schritte = [
  { titel: 'Bemessungswert', erklaerung: 'Teilsicherheitsbeiwert anwenden.', formel: 'f_{cd} = \\alpha_{cc} f_{ck}/\\gamma_c', einheit: 'MPa' },
  { titel: 'Ergebnis', erklaerung: 'Einsetzen der Werte.' },
];
const box = (p: Record<string, unknown> = {}) => rendere(h(FormulaDerivationBox, { title: 'Druckfestigkeit', zielGleichung: 'f_{cd}', schritte, ...p }));
t.test('FormulaDerivationBox: Titel und Zielgleichung (KaTeX) im Kopf', () => {
  const html = box();
  sicher(text(html).includes('Druckfestigkeit'), 'Titel fehlt');
  sicher(html.includes('<annotation encoding="application/x-tex">f_{cd}</annotation>'), 'Zielgleichung fehlt');
});
t.test('FormulaDerivationBox: Badge „Herleitung“ ohne live, „Live“ mit live', () => {
  const ohne = text(box()), mit = text(box({ live: true }));
  sicher(ohne.includes('Herleitung') && !/\bLive\b/.test(ohne), 'Badge ohne live falsch');
  sicher(/\bLive\b/.test(mit), 'Live-Badge fehlt');
});
t.test('FormulaDerivationBox: standardmäßig eingeklappt (keine Schritte, aria-expanded=false)', () => {
  const html = box();
  sicher(html.includes('aria-expanded="false"'), 'aria-expanded fehlt');
  sicher(!text(html).includes('Teilsicherheitsbeiwert anwenden') && text(html).includes('Rechenweg aufklappen'), 'Schritte sichtbar, obwohl eingeklappt');
});
t.test('FormulaDerivationBox: defaultExpanded zeigt alle Schritte, Formel und Einheit', () => {
  const html = box({ defaultExpanded: true });
  const s = text(html);
  sicher(html.includes('aria-expanded="true"'), 'aria-expanded=true fehlt');
  sicher(s.includes('Bemessungswert') && s.includes('Ergebnis') && s.includes('Einsetzen der Werte.'), 'Schritte fehlen');
  sicher(html.includes('katex-display'), 'Schrittformel nicht als BlockMath gesetzt');
  sicher(s.includes('Einheit: MPa'), 'Einheit fehlt');
  sicher(s.includes('Didaktischer Nachweis'), 'Einleitung (statisch) fehlt');
});
t.test('FormulaDerivationBox: live + aufgeklappt zeigt Hinweis „Ihr Rechenweg“', () => {
  const s = text(box({ defaultExpanded: true, live: true }));
  sicher(s.includes('Ihr Rechenweg') && !s.includes('Didaktischer Nachweis'), 'Live-Einleitung fehlt');
});
t.test('FormulaDerivationBox: Normquelle und Ergebnishinweis in der Fußzeile', () => {
  const s = text(box({ defaultExpanded: true, normQuelle: 'DIN EN 1992-1-1', ergebnisHinweis: 'Gerundet auf 0,1 MPa.' }));
  sicher(s.includes('Regelwerk: DIN EN 1992-1-1') && s.includes('Gerundet auf 0,1 MPa.'), 'Fußzeile fehlt');
});

t.ende();
