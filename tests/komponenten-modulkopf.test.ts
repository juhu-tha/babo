// Komponententests Modulkopf und Selbsttest: ModulTest, ModulLernziele, ErkundungsAuftrag, ModulKurzfassung (AP 5.6)
import { h, rendere, text, kompakt, anzahl, sicher, testlauf } from './hilfen/komponenten';
const { ModulTest } = await import('../src/components/quiz/ModulTest');
const { ModulLernziele } = await import('../src/components/ui/ModulLernziele');
const { ErkundungsAuftrag } = await import('../src/components/ui/ErkundungsAuftrag');
const { ModulKurzfassung } = await import('../src/components/ui/ModulKurzfassung');
const { QUIZ_QUESTIONS } = await import('../src/data/quizData');
const { LERNZIELE } = await import('../src/data/lernziele');
const { ERKUNDUNG } = await import('../src/data/erkundung');
const { KURZFASSUNG } = await import('../src/data/kurzfassung');
const { ladeModulFragen, anzahlFragenModul, anzahlFragenRoute } = await import('../src/data/quizLader');

const t = testlauf('Komponenten Modulkopf/Selbsttest');
const proModul = new Map<string, number>();
for (const q of QUIZ_QUESTIONS) proModul.set(q.moduleId, (proModul.get(q.moduleId) ?? 0) + 1);
const viele = [...proModul].sort((a, b) => b[1] - a[1])[0];
const einzeln = [...proModul].find(([, n]) => n === 1);

// ── ModulTest ────────────────────────────────────────────────────────────────
t.test('ModulTest: unbekanntes Modul rendert nichts', () => {
  sicher(rendere(h(ModulTest, { moduleId: 'gibt_es_nicht' })) === '', 'leere Ausgabe erwartet');
});
t.test('ModulTest: Anzahltext Plural („N Fragen“)', () => {
  const [id, n] = viele;
  sicher(n > 1, 'Modul mit mehreren Fragen fehlt');
  sicher(text(rendere(h(ModulTest, { moduleId: id }))).includes(`${n} Fragen`), `„${n} Fragen“ fehlt für ${id}`);
});
t.test('ModulTest: Anzahltext Singular („1 Frage“)', () => {
  sicher(einzeln, 'kein Modul mit genau einer Frage im Pool – Test anpassen');
  const s = text(rendere(h(ModulTest, { moduleId: einzeln![0] })));
  sicher(/\b1 Frage\b/.test(s) && !s.includes('1 Fragen'), `Singular falsch: ${s.slice(0, 160)}`);
});
t.test('ModulTest: standardmäßig eingeklappt (aria-expanded=false, keine Fragen)', () => {
  const [id] = viele;
  const html = rendere(h(ModulTest, { moduleId: id }));
  const erste = QUIZ_QUESTIONS.find(q => q.moduleId === id)!;
  sicher(html.includes('aria-expanded="false"'), 'aria-expanded fehlt');
  sicher(!text(html).includes(kompakt(erste.question)), 'Frage sichtbar, obwohl eingeklappt');
});
// Fragen kommen asynchron aus dem virtuellen Fragenpool (AP 5.4): vor dem Laden Ladezustand,
// nach `await ladeModulFragen()` rendert ModulTest sie sofort aus dem Cache.
t.test('ModulTest: aufgeklappt vor dem Laden Ladehinweis, Anzahl schon aus dem Index', () => {
  const [id, n] = viele;
  const s = text(rendere(h(ModulTest, { moduleId: id, defaultOpen: true })));
  sicher(s.includes('Fragen werden geladen') && s.includes(`${n} Fragen`), 'Ladezustand/Anzahl fehlt');
  sicher(anzahlFragenModul(id) === n, 'Index-Anzahl weicht von quiz.json ab');
});
const geladen = await ladeModulFragen(viele[0]);
t.test('Fragenpool-Lader: Modulpaket entspricht quiz.json (Reihenfolge, Zuordnung)', () => {
  const erwartet = QUIZ_QUESTIONS.filter(q => q.moduleId === viele[0]);
  sicher(geladen.map(q => q.id).join() === erwartet.map(q => q.id).join(), 'IDs/Reihenfolge weichen ab');
  sicher(geladen.every(q => q.route === erwartet[0].route && q.clusterId === erwartet[0].clusterId), 'Zuordnung (Route/Cluster) fehlt');
});
t.test('ModulTest: aufgeklappt alle Fragen des Moduls mit Nummerierung und Optionen', () => {
  const [id, n] = viele;
  const html = rendere(h(ModulTest, { moduleId: id, defaultOpen: true }));
  const s = text(html);
  const fragen = QUIZ_QUESTIONS.filter(q => q.moduleId === id);
  const fehlend = fragen.filter(q => !s.includes(kompakt(q.question)));
  sicher(fehlend.length === 0, `${fehlend.length} Fragen fehlen, z. B. „${fehlend[0]?.question.slice(0, 50)}“`);
  sicher(s.includes(`Frage 1 / ${n}`) && s.includes(`Frage ${n} / ${n}`), 'Nummerierung „Frage i / n“ fehlt');
  const optionen = fragen.reduce((a, q) => a + q.options.length, 0);
  sicher(anzahl(html, /<button[^>]*type="button"[^>]*class="w-full p-4/) === optionen, 'Anzahl Antwortschaltflächen passt nicht');
  sicher(s.includes(`0 von ${n} beantwortet`) || s.includes(`von ${n} beantwortet`), 'Fortschrittsanzeige fehlt');
});
t.test('ModulTest: fremde Fragen erscheinen nicht', () => {
  const [id] = viele;
  const s = text(rendere(h(ModulTest, { moduleId: id, defaultOpen: true })));
  const fremd = QUIZ_QUESTIONS.find(q => q.moduleId !== id && q.question.length > 40)!;
  sicher(!s.includes(kompakt(fremd.question)), 'Frage eines anderen Moduls erscheint');
});
t.test('ModulTest: eigener Titel ersetzt Standardtitel', () => {
  const s = text(rendere(h(ModulTest, { moduleId: viele[0], title: 'Kurzcheck Spannbeton' })));
  sicher(s.includes('Kurzcheck Spannbeton') && !s.includes('Haben Sie es verstanden'), 'Titel nicht übernommen');
});

// ── ModulLernziele ───────────────────────────────────────────────────────────
const lzId = Object.keys(LERNZIELE).find(id => QUIZ_QUESTIONS.some(q => q.route === id))!;
const lz = LERNZIELE[lzId];
t.test('ModulLernziele: Kopf mit Niveau, Dauer und Selbsttest-Anzahl', () => {
  const s = text(rendere(h(ModulLernziele, { moduleId: lzId, daten: lz, oeffneModul: () => {} })));
  const niveau = { B: 'Bachelor', M: 'Master', 'B/M': 'Bachelor und Master' }[lz.niveau];
  const n = QUIZ_QUESTIONS.filter(q => q.route === lzId).length;
  sicher(anzahlFragenRoute(lzId) === n, 'Index-Anzahl je Route weicht ab');
  sicher(s.includes('Lernziele') && s.includes(niveau), 'Titel/Niveau fehlt');
  sicher(s.includes(`ca. ${lz.minuten} min`), 'Bearbeitungsdauer fehlt');
  sicher(s.includes(`Selbsttest: ${n} ${n === 1 ? 'Frage' : 'Fragen'}`), `Selbsttest-Anzahl ${n} fehlt`);
});
t.test('ModulLernziele: eingeklappt, Ziele erst nach Aufklappen; ARIA-Verknüpfung', () => {
  const html = rendere(h(ModulLernziele, { moduleId: lzId, daten: lz, oeffneModul: () => {} }));
  sicher(html.includes('aria-label="Lernziele"') && html.includes('aria-expanded="false"') && html.includes('aria-controls="'), 'ARIA fehlt');
  sicher(!text(html).includes(kompakt(lz.ziele[0].text)), 'Ziele sichtbar, obwohl eingeklappt');
});
t.test('ModulLernziele: ohne Selbsttestfragen keine Anzahl', () => {
  const s = text(rendere(h(ModulLernziele, { moduleId: 'ohne_fragen', daten: lz, oeffneModul: () => {} })));
  sicher(!s.includes('Selbsttest:'), 'Selbsttest-Anzahl darf fehlen, wenn keine Fragen');
});
t.test('ModulLernziele: Niveau B/M und M werden ausgeschrieben', () => {
  const m = text(rendere(h(ModulLernziele, { moduleId: 'x', daten: { ...lz, niveau: 'M' }, oeffneModul: () => {} })));
  const bm = text(rendere(h(ModulLernziele, { moduleId: 'x', daten: { ...lz, niveau: 'B/M' }, oeffneModul: () => {} })));
  sicher(m.includes('Master') && !m.includes('Bachelor'), 'Master');
  sicher(bm.includes('Bachelor und Master'), 'Bachelor und Master');
});

// ── ErkundungsAuftrag ────────────────────────────────────────────────────────
const [ekId, ek] = Object.entries(ERKUNDUNG)[0];
t.test('ErkundungsAuftrag: Kopf „Ausprobieren“ mit Anzahl der Vorhersagen', () => {
  const html = rendere(h(ErkundungsAuftrag, { daten: ek }));
  sicher(html.includes('aria-label="Ausprobieren"'), `section-Label fehlt (${ekId})`);
  sicher(text(html).includes(`${ek.auftraege.length} Vorhersagen zum Rechner`), 'Anzahl fehlt');
});
t.test('ErkundungsAuftrag: eingeklappt ohne Fragen und Auflösungen', () => {
  const html = rendere(h(ErkundungsAuftrag, { daten: ek }));
  const s = text(html);
  sicher(html.includes('aria-expanded="false"'), 'aria-expanded fehlt');
  sicher(!s.includes(kompakt(ek.auftraege[0].frage)) && !s.includes(kompakt(ek.auftraege[0].aufloesung)), 'Inhalt sichtbar, obwohl eingeklappt');
});
t.test('ErkundungsAuftrag: alle Datensätze rendern fehlerfrei', () => {
  for (const [id, d] of Object.entries(ERKUNDUNG)) {
    const html = rendere(h(ErkundungsAuftrag, { daten: d }));
    sicher(html.includes(`${d.auftraege.length + (d.reiter ?? []).reduce((s, r) => s + r.auftraege.length, 0)} Vorhersagen`), `${id}: Kopf fehlt`);
  }
});

// ── ModulKurzfassung ─────────────────────────────────────────────────────────
const [kfId, kf] = Object.entries(KURZFASSUNG)[0];
t.test('ModulKurzfassung: standardmäßig aufgeklappt mit 5 Punkten in Reihenfolge', () => {
  const html = rendere(h(ModulKurzfassung, { punkte: kf }));
  const s = text(html);
  sicher(html.includes('aria-expanded="true"') && html.includes('aria-label="Das Wichtigste in 5 Punkten"'), 'ARIA/Label fehlt');
  sicher(anzahl(html, /<li>/) === 5, `${kfId}: 5 Listenpunkte erwartet`);
  const pos = kf.map(p => s.indexOf(kompakt(p)));
  sicher(pos.every((p, i) => p >= 0 && (i === 0 || p > pos[i - 1])), 'Punkte fehlen oder falsche Reihenfolge');
});
t.test('ModulKurzfassung: Sonderzeichen werden maskiert', () => {
  const html = rendere(h(ModulKurzfassung, { punkte: ['w/z < 0,45 & <b>fett</b>'] }));
  sicher(html.includes('&lt;b&gt;') && !html.includes('<b>'), 'HTML nicht maskiert');
});

t.ende();
