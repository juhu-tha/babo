// Komponententests Hinweise und Verweise: ModuleFooter, CalculatorDisclaimerBanner, EingabeHinweise,
// Querverweis, ExpositionsKurzkarte (AP 5.6)
import { h, rendere, text, anzahl, sicher, testlauf } from './hilfen/komponenten';
const { ModuleFooter } = await import('../src/components/ui/ModuleFooter');
const { CalculatorDisclaimerBanner } = await import('../src/components/ui/CalculatorDisclaimerBanner');
const { EingabeHinweise } = await import('../src/components/ui/EingabeHinweise');
const { Querverweis, springeZu } = await import('../src/components/ui/Querverweis');
const { ExpositionsKurzkarte } = await import('../src/components/ui/ExpositionsKurzkarte');
const { RECHNER_GRENZEN } = await import('../src/data/rechnerGrenzen');
const { DIN1045_2_EXPOSITIONSKLASSEN } = await import('../src/data/standards/din1045_2');

const t = testlauf('Komponenten Hinweise/Verweise');

// ── ModuleFooter ─────────────────────────────────────────────────────────────
t.test('ModuleFooter: ohne Angaben keine Ausgabe', () => {
  sicher(rendere(h(ModuleFooter, {})) === '', 'leere Ausgabe erwartet');
});
t.test('ModuleFooter: Norm aus Registry, „1 Eintrag“, eingeklappt, Prüfdatum und Haftungshinweis', () => {
  const html = rendere(h(ModuleFooter, { normIds: ['DIN_EN_206'], lastReviewed: '2026-10' }));
  const s = text(html);
  sicher(s.includes('Regelwerke & Normen') && s.includes('1 Eintrag'), 'Abschnitt/Anzahl fehlt');
  sicher(html.includes('aria-expanded="false"') && !html.includes('<ul'), 'Abschnitt muss eingeklappt sein');
  sicher(s.includes('Inhaltsstand: 10/2026') && !s.includes('zuletzt geprüft'), 'Inhaltsstand fehlt');
  sicher(s.includes('Haftungsausschluss lesen'), 'Haftungshinweis fehlt');
});
t.test('ModuleFooter: ohne Fachmodul kein Prüfvermerk, kein „nicht geprüft“ (Gutachten 29.10.2026)', () => {
  const s = text(rendere(h(ModuleFooter, { regelwerke: ['Eigene Richtlinie'] })));
  sicher(!s.includes('nicht geprüft') && !s.includes('Fachlich geprüft') && s.includes('Maßgebend sind'), 'Fußzeile ohne Fachmodul falsch');
});
t.test('ModuleFooter: Plural „Einträge“, „Formeln“ und Schnellauswahl bei mehreren Abschnitten', () => {
  const s = text(rendere(h(ModuleFooter, {
    regelwerke: ['DIN_EN_206', { title: 'Merkblatt XY' }],
    formeln: [{ formel: 'a=b', erklaerung: 'x' }, { formel: 'c=d', erklaerung: 'y' }],
  })));
  sicher(s.includes('2 Einträge') && s.includes('2 Formeln'), 'Pluralformen falsch');
  sicher(s.includes('Alle ausklappen'), 'Schnellauswahl fehlt');
});
t.test('ModuleFooter: Singular „1 Formel“, hideFormeln blendet Formeln aus', () => {
  const eine = text(rendere(h(ModuleFooter, { formeln: [{ formel: 'a=b', erklaerung: 'x' }] })));
  sicher(eine.includes('1 Formel') && !eine.includes('Alle ausklappen'), 'Singular/Schnellauswahl falsch');
  sicher(rendere(h(ModuleFooter, { formeln: [{ formel: 'a=b', erklaerung: 'x' }], hideFormeln: true })) === '', 'hideFormeln wirkt nicht');
});
t.test('ModuleFooter: höchstens 2 Wikipedia-Links, ungeprüfte Literatur entfällt', () => {
  const s = text(rendere(h(ModuleFooter, {
    wikipedia: [{ title: 'A' }, { title: 'B' }, { title: 'C' }],
    literatur: ['Möhler: ungeprüfter Titel'],
  })));
  sicher(s.includes('Literatur & Vertiefung') && s.includes('2 Quellen'), `2 Quellen erwartet: ${s.slice(0, 120)}`);
  sicher(rendere(h(ModuleFooter, { literatur: ['Möhler: ungeprüfter Titel'] })) === '', 'ungeprüfte Literatur darf keinen Abschnitt erzeugen');
});

// ── CalculatorDisclaimerBanner ───────────────────────────────────────────────
t.test('CalculatorDisclaimerBanner: role=note, Standardtext', () => {
  const html = rendere(h(CalculatorDisclaimerBanner, {}));
  sicher(html.includes('role="note"') && html.includes('aria-label="Vorbemessungshinweis"'), 'ARIA fehlt');
  sicher(text(html).includes('ersetzen keinen bauaufsichtlichen Nachweis'), 'Standardtext fehlt');
  sicher(!html.includes('<details'), 'ohne grenzen keine Aufklappliste');
});
t.test('CalculatorDisclaimerBanner: mit grenzen aufklappbare Liste mit Anzahl, Kurztext und allen Punkten', () => {
  const [id, g] = Object.entries(RECHNER_GRENZEN).find(([, v]) => v.rechnet !== false && v.grenzen.length > 1)!;
  const html = rendere(h(CalculatorDisclaimerBanner, { grenzen: g }));
  const s = text(html);
  sicher(html.includes('<details') && s.includes(`Annahmen und Grenzen dieses Rechners (${g.grenzen.length})`), `${id}: Kopf fehlt`);
  sicher(anzahl(html, /<li>/) === g.grenzen.length, `${id}: Anzahl Punkte`);
  sicher(s.includes(g.kurz.replace(/\s+/g, ' ')), `${id}: Kurztext fehlt`);
});
t.test('CalculatorDisclaimerBanner: rechnet=false bzw. leere grenzen → keine Liste; customText', () => {
  const a = rendere(h(CalculatorDisclaimerBanner, { grenzen: { kurz: 'k', grenzen: ['x'], rechnet: false } }));
  const b = rendere(h(CalculatorDisclaimerBanner, { grenzen: { kurz: 'k', grenzen: [] }, customText: 'Nur Lehre.' }));
  sicher(!a.includes('<details') && !b.includes('<details'), 'Liste darf nicht erscheinen');
  sicher(text(b).includes('Nur Lehre.') && !text(b).includes('MVV TB'), 'customText ersetzt Standardtext nicht');
});

// ── EingabeHinweise ──────────────────────────────────────────────────────────
t.test('EingabeHinweise: leere Liste → keine Ausgabe', () => {
  sicher(rendere(h(EingabeHinweise, { hinweise: [] })) === '', 'leere Ausgabe erwartet');
});
t.test('EingabeHinweise: Fehler und Warnungen mit Präfix, role=status/aria-live', () => {
  const html = rendere(h(EingabeHinweise, { hinweise: [
    { stufe: 'fehler', feld: 'b', text: 'Breite muss > 0 sein.' },
    { stufe: 'warnung', feld: 'h', text: 'Ungewöhnlich hoher Wert.' },
  ] }));
  const s = text(html);
  sicher(html.includes('role="status"') && html.includes('aria-live="polite"'), 'Live-Region fehlt');
  sicher(s.includes('Eingabe unzulässig: Breite muss > 0 sein.') && s.includes('Hinweis: Ungewöhnlich hoher Wert.'), 'Texte/Präfixe fehlen');
  sicher(anzahl(html, /bg-red-50/) === 1 && anzahl(html, /bg-amber-50/) === 1, 'Farbstufen falsch');
});

// ── Querverweis / ExpositionsKurzkarte ───────────────────────────────────────
t.test('Querverweis: Titel, Einordnung, Linktext und data-querverweis', () => {
  const html = rendere(h(Querverweis, { ziel: 'expositionsklassen', titel: 'Eine Quelle', linkText: 'Zum Modul' }, 'Kurz erklärt.'));
  const s = text(html);
  sicher(html.includes('data-querverweis="expositionsklassen"'), 'Ziel fehlt');
  sicher(s.includes('Eine Quelle') && s.includes('Kurz erklärt.') && s.includes('Zum Modul'), 'Inhalt fehlt');
});
t.test('springeZu: setzt Ziel und scrollt Container bzw. Fenster nach oben', () => {
  const g = globalThis as Record<string, unknown>;
  const alt = { document: g.document, window: g.window };
  const log: string[] = [];
  try {
    g.document = { getElementById: (id: string) => (id === 'scroll-container' ? { scrollTo: (o: { top: number }) => log.push(`c${o.top}`) } : null) };
    g.window = { scrollTo: (o: { top: number }) => log.push(`w${o.top}`) };
    let ziel = '';
    springeZu((x) => { ziel = x; }, 'beton' as never);
    sicher(ziel === 'beton' && log.join() === 'c0', `Container-Scroll erwartet: ${log}`);
    g.document = { getElementById: () => null };
    springeZu(() => {}, 'beton' as never);
    sicher(log.join() === 'c0,w0', `Fenster-Scroll erwartet: ${log}`);
  } finally { g.document = alt.document; g.window = alt.window; }
});
t.test('ExpositionsKurzkarte: 7 Klassengruppen, jede Klasse der Normdatenbank genau einmal', () => {
  const html = rendere(h(ExpositionsKurzkarte, {}));
  const codes = Object.values(DIN1045_2_EXPOSITIONSKLASSEN).map(k => k.code);
  const fehlend = codes.filter(c => anzahl(html, new RegExp(`title="${c}: `)) !== 1);
  sicher(html.includes('data-kurzkarte="expositionsklassen"'), 'Kennung fehlt');
  sicher(fehlend.length === 0, `Klassen fehlen/doppelt: ${fehlend.join(', ')}`);
  for (const p of ['X0', 'XC', 'XD', 'XS', 'XF', 'XA', 'XM']) sicher(html.includes(`w-10 shrink-0">${p}</span>`), `Gruppe ${p} fehlt`);
  sicher(text(html).includes('Zum Modul Expositionsklassen'), 'Sprungschaltfläche fehlt');
});
t.test('ExpositionsKurzkarte: eigener Hinweis ersetzt Standardsatz', () => {
  const s = text(rendere(h(ExpositionsKurzkarte, { hinweis: 'Für Bodenplatten gilt XC2.' })));
  sicher(s.includes('Für Bodenplatten gilt XC2.') && !s.includes('Überblick über die Klassengruppen'), 'Hinweis nicht übernommen');
});

t.ende();
