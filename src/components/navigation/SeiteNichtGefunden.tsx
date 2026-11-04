// Hinweis „Seite nicht gefunden“ für unbekannte Adressen (Gesamtgutachten 03.11.2026, 3.1/3.4, Maßnahme 5.1):
// statt kommentarlos die Startseite zu zeigen, nennt die Seite die Adresse, schlägt ähnliche Module vor und bietet eine
// Suche über alle Module. Status 404 setzt der Server (server.ts) bzw. Vercel (dist/404.html); die Adresse bleibt stehen.
// Nur bei Bedarf geladen (React.lazy in App.tsx), kein Inline-Skript.
import React, { useId, useMemo, useState } from 'react';
import { SearchX, Search, Home, Network, ArrowRight } from 'lucide-react';
import { useTabContext, type TabId } from '../../contexts/TabContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { MODUL_KERN, type ModulKern } from '../../registry/kern';
import { kompakt, modulPasst } from '../../utils/suchNormalisierung';

/** Buchstabenpaare (Dice-Koeffizient) */
function paare(s: string): Map<string, number> {
  const m = new Map<string, number>();
  for (let i = 0; i < s.length - 1; i++) { const p = s.slice(i, i + 2); m.set(p, (m.get(p) ?? 0) + 1); }
  return m;
}
function dice(a: string, b: string): number {
  if (a.length < 2 || b.length < 2) return a === b ? 1 : 0;
  const pa = paare(a), pb = paare(b);
  let gemeinsam = 0;
  for (const [p, n] of pa) gemeinsam += Math.min(n, pb.get(p) ?? 0);
  return (2 * gemeinsam) / (a.length - 1 + b.length - 1);
}

/** Ähnliche Module zu einer unbekannten Adresse (ID, Beschriftung, Titel); reine Funktion, getestet in tests/seiteNichtGefunden.test.ts */
export function aehnlicheModule(adresse: string, module: Iterable<ModulKern> = MODUL_KERN.values(), max = 5): ModulKern[] {
  const roh = adresse.replace(/^\/(?:modul\/)?/, '').replace(/\.html?$/i, '');
  const k = kompakt(roh);
  if (k.length < 2) return [];
  const bewertet: [ModulKern, number][] = [];
  for (const m of module) {
    if (m.id === 'start' || m.id.startsWith('divider_')) continue;
    const kandidaten = [m.id, m.label, m.titel ?? ''].map(kompakt).filter(Boolean);
    let p = Math.max(...kandidaten.map(c => dice(k, c)));
    if (k.length >= 4 && kandidaten.some(c => c.includes(k) || (c.length >= 4 && k.includes(c)))) p = Math.max(p, 0.9);
    if (p >= 0.45) bewertet.push([m, p]);
  }
  return bewertet.sort((a, b) => b[1] - a[1] || a[0].label.localeCompare(b[0].label, 'de')).slice(0, max).map(([m]) => m);
}

export default function SeiteNichtGefunden({ adresse }: { adresse: string }) {
  const { setActiveTab } = useTabContext();
  const { language, getTabLabel } = useLanguage();
  const en = language === 'en';
  const [anfrage, setAnfrage] = useState('');
  const sucheId = useId();
  const aehnlich = useMemo(() => aehnlicheModule(adresse), [adresse]);
  const treffer = useMemo(() => {
    if (anfrage.trim().length < 2) return [];
    return [...MODUL_KERN.values()]
      .filter(m => m.id !== 'start' && !m.id.startsWith('divider_') && modulPasst(anfrage, m.id, [m.label, m.titel, getTabLabel(m.id, m.label)]))
      .slice(0, 8);
  }, [anfrage, getTabLabel]);
  const anzeige = adresse.startsWith('/') ? adresse : `/modul/${adresse}`;
  const name = (m: ModulKern) => getTabLabel(m.id, m.titel ?? m.label);
  const modulKnopf = (m: ModulKern) => (
    <li key={m.id}>
      <button
        type="button"
        onClick={() => setActiveTab(m.id as TabId)}
        className="w-full flex items-center justify-between gap-2 text-left px-3 py-2 rounded-lg border border-home-grau/30 dark:border-slate-700 bg-off-white dark:bg-slate-800 hover:border-shiraz dark:hover:border-rose-400 text-sm text-text-main dark:text-slate-100"
      >
        <span>{name(m)}</span>
        <ArrowRight size={14} aria-hidden="true" className="text-shiraz dark:text-rose-300 shrink-0" />
      </button>
    </li>
  );

  return (
    <div className="flex flex-col gap-6 w-full mt-4 max-w-3xl mx-auto">
      <section className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl shadow-sm border border-home-grau/30 dark:border-slate-700" aria-labelledby="nicht-gefunden-titel">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-shiraz/10 dark:bg-rose-400/10 rounded-full flex items-center justify-center shrink-0">
            <SearchX size={24} aria-hidden="true" className="text-shiraz dark:text-rose-300" />
          </div>
          <div className="min-w-0">
            <h2 id="nicht-gefunden-titel" className="text-2xl font-bold text-text-main dark:text-white mb-2">
              {en ? 'Page not found' : 'Seite nicht gefunden'}
            </h2>
            <p className="text-text-main/80 dark:text-slate-300">
              {en ? 'There is no page at ' : 'Unter der Adresse '}
              <code className="px-1.5 py-0.5 rounded bg-off-white dark:bg-slate-800 text-sm break-all">{anzeige}</code>
              {en ? '. The module may have been renamed, merged or switched off.' : ' gibt es keine Seite. Das Modul wurde vielleicht umbenannt, zusammengelegt oder abgeschaltet.'}
            </p>
          </div>
        </div>

        {aehnlich.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-bold text-text-main dark:text-slate-100 mb-2">{en ? 'Did you mean' : 'Meinten Sie'}</h3>
            <ul className="flex flex-col gap-2" role="list">{aehnlich.map(modulKnopf)}</ul>
          </div>
        )}

        <div className="mt-6">
          <label htmlFor={sucheId} className="text-sm font-bold text-text-main dark:text-slate-100 mb-2 flex items-center gap-1.5">
            <Search size={14} aria-hidden="true" /> {en ? 'Search modules' : 'Module durchsuchen'}
          </label>
          <input
            id={sucheId}
            type="search"
            value={anfrage}
            onChange={e => setAnfrage(e.target.value)}
            placeholder={en ? 'e.g. w/z ratio, Glaser, PFAS' : 'z. B. w/z-Wert, Glaser, PFAS'}
            className="w-full px-3 py-2 border border-home-grau/30 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800 text-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-shiraz"
          />
          {anfrage.trim().length >= 2 && (
            treffer.length
              ? <ul className="flex flex-col gap-2 mt-3" role="list" aria-label={en ? 'Matching modules' : 'Passende Module'}>{treffer.map(modulKnopf)}</ul>
              : <p className="mt-3 text-sm text-text-main/70 dark:text-slate-400" role="status">{en ? 'No module found. The search in the sidebar also searches the content.' : 'Kein Modul gefunden. Die Suche in der Seitenleiste durchsucht auch die Inhalte.'}</p>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" onClick={() => setActiveTab('start')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-shiraz text-white text-sm font-semibold hover:opacity-90">
            <Home size={16} aria-hidden="true" /> {en ? 'Home page' : 'Zur Startseite'}
          </button>
          <button type="button" onClick={() => setActiveTab('modulstruktur' as TabId)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-shiraz text-shiraz dark:border-rose-300 dark:text-rose-300 text-sm font-semibold hover:bg-shiraz/5">
            <Network size={16} aria-hidden="true" /> {en ? 'Module overview' : 'Zur Modulübersicht'}
          </button>
        </div>
      </section>
    </div>
  );
}
