// Komponententests Suche: Menüsuche in ModulNavigation, VolltextTreffer, Volltextindex (AP 5.6)
import fs from 'node:fs';
import { h, rendere, text, sicher, testlauf } from './hilfen/komponenten';
const { ModulNavigation } = await import('../src/components/navigation/ModulNavigation');
const { VolltextTreffer } = await import('../src/components/navigation/VolltextTreffer');
const { suche } = await import('../src/utils/volltextsuche');
const { MODUL_BY_ID, TAB_KEYWORDS } = await import('../src/registry/modules');
const { META_CLUSTERS } = await import('../src/data/metaClusters');

const t = testlauf('Komponenten Suche');
const noop = () => {};
const nav = (searchQuery: string) => rendere(h(ModulNavigation, {
  searchQuery, openClusters: {}, setOpenClusters: noop, openDropdown: null, setOpenDropdown: noop,
  favorites: [], toggleFavorite: noop, toggleCluster: noop, setMobileMenuOpen: noop,
}));
const label = (id: string) => MODUL_BY_ID.get(id)!.label;

t.test('Menüsuche: ohne Suchbegriff alle Meta-Cluster, eingeklappt', () => {
  const html = nav('');
  const s = text(html);
  const fehlend = META_CLUSTERS.filter(c => !s.includes(c.name));
  sicher(fehlend.length === 0, `Cluster fehlen: ${fehlend.map(c => c.number).join(', ')}`);
  sicher(!s.includes(label('spannbeton')), 'Modul sichtbar, obwohl Cluster eingeklappt');
});
t.test('Menüsuche: Bezeichnung „spannbeton“ findet Modul Spannbeton und klappt Cluster auf', () => {
  const s = text(nav('spannbeton'));
  sicher(s.includes(label('spannbeton')), 'Spannbeton nicht gefunden');
  const fremd = META_CLUSTERS.filter(c => c.id !== 'beton' && s.includes(c.name));
  sicher(fremd.length === 0, `nicht passende Cluster sichtbar: ${fremd.map(c => c.number).join(', ')}`);
});
t.test('Menüsuche: Treffer über Suchbegriff (Keyword) statt Bezeichnung', () => {
  const [id, kw] = Object.entries(TAB_KEYWORDS)
    .flatMap(([i, ks]) => ks.map(k => [i, k] as const))
    .find(([i, k]) => k.length >= 6 && !label(i).toLowerCase().includes(k) && MODUL_BY_ID.get(i)?.gruppe !== 'Allgemein' && !/^v?\d/.test(k))!;
  sicher(text(nav(kw)).includes(label(id)), `Keyword „${kw}“ findet ${id} nicht`);
});
t.test('Menüsuche: Groß-/Kleinschreibung egal', () => {
  sicher(text(nav('SPANNBETON')).includes(label('spannbeton')), 'Großschreibung findet nichts');
});
t.test('Menüsuche: unbekannter Begriff → kein Cluster, nur Volltextbereich', () => {
  const s = text(nav('xqzxqz'));
  sicher(META_CLUSTERS.every(c => !s.includes(c.name)), 'Cluster trotz fehlender Treffer');
  sicher(s.includes('Im Inhalt gefunden'), 'Volltextbereich fehlt');
});
t.test('VolltextTreffer: unter 3 Zeichen keine Ausgabe, ab 3 Zeichen Ladezustand', () => {
  sicher(rendere(h(VolltextTreffer, { anfrage: 'be', oeffne: noop })) === '', 'Ausgabe bei 2 Zeichen');
  const html = rendere(h(VolltextTreffer, { anfrage: 'beton', oeffne: noop }));
  sicher(html.includes('aria-label="Treffer im Inhalt der Module"') && text(html).includes('Suchindex wird geladen'), 'Ladezustand fehlt');
});

// Volltextindex der App (public/suchindex.json, erzeugt mit scripts/gen-suchindex.mjs)
const index = JSON.parse(fs.readFileSync('public/suchindex.json', 'utf8')).module;
const titel = (id: string) => MODUL_BY_ID.get(id)?.baum?.titel ?? MODUL_BY_ID.get(id)?.label ?? id;
t.test('Volltextsuche (echter Index): „Rückprallhammer“ findet Modul Messen & Prüfen', () => {
  const tr = suche(index, 'Rückprallhammer', titel);
  sicher(tr.some(x => x.id === 'messen_pruefen'), `messen_pruefen nicht unter ${tr.map(x => x.id).join(', ')}`);
  sicher(tr.every(x => MODUL_BY_ID.has(x.id)), 'Treffer ohne Route');
});
t.test('Volltextsuche (echter Index): „Spannbeton“ → Modul Spannbeton zuerst', () => {
  const tr = suche(index, 'Spannbeton', titel);
  sicher(tr[0]?.id === 'spannbeton', `erster Treffer ${tr[0]?.id}`);
});
t.test('Volltextsuche (echter Index): jeder Eintrag hat eine gültige Route', () => {
  const ohne = index.filter((e: { id: string }) => !MODUL_BY_ID.has(e.id)).map((e: { id: string }) => e.id);
  sicher(ohne.length === 0, `Indexeinträge ohne Route: ${ohne.slice(0, 5).join(', ')}`);
});

t.ende();
