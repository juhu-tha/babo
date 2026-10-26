import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, ArrowRight, CalendarDays, ClipboardCheck, GraduationCap, ListChecks, Route, Target, Trophy } from 'lucide-react';
import { ModuleTabs, type ModulTab } from '@/src/components/ui/ModuleTabs';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { KlausurSimulator } from '@/src/components/klausur/KlausurSimulator';
import { springeZu } from '@/src/components/ui/Querverweis';
import { useTabContext, type TabId } from '@/src/contexts/TabContext';
import { MODUL_BY_ID, type ModulId } from '@/src/registry/modules';
import { anzahlFragenModul, quizModuleDerRouten } from '@/src/data/quizLader';
import { quizRoute } from '@/src/data/quizZuordnung';
import { ladeKopfDaten } from '@/src/routing/modulKopfDaten';
import type { ModulLernziele } from '@/src/data/lernziele';
import { KI_UEBUNGEN } from '@/src/data/kiUebungen';
import { ENTWURF_HINWEIS, LERNPFADE, LERNPFAD_BY_ID, moduleDesLernpfads, terminKennung, type Lernpfad } from '@/src/data/lernpfade';
import { formatDeGanzzahl } from '@/src/utils/numberFormat';
import { setzeSprungziel } from '@/src/utils/sprungziel';
import inhalt from '@/content/lehrveranstaltungen/Lehrveranstaltungen.json';
import { MdText } from '@/src/components/inhalt/MdText';

/**
 * Lernpfade „Lehrveranstaltungen“ (Umsetzungsplan Phase 6, AP 6.1): eine Seite je Lehrveranstaltung mit
 * Terminplan, Lernzielen der zugeordneten Module, Quizset und Klausurtraining. Daten: src/data/lernpfade.ts.
 * Ohne kursId: Übersicht aller Lernpfade.
 */

type Bereich = 'termine' | 'lernziele' | 'quiz' | 'klausur';
const BEREICHE: readonly ModulTab<Bereich>[] = [
  { id: 'termine', label: 'Terminplan', icon: CalendarDays },
  { id: 'lernziele', label: 'Lernziele', icon: Target },
  { id: 'quiz', label: 'Quizset', icon: ListChecks },
  { id: 'klausur', label: 'Klausurtraining', icon: Trophy },
];

const NIVEAU = { B: 'Bachelor', M: 'Master', 'B/M': inhalt.werte.bachelorUndMaster } as const;

const titelVon = (id: string) => MODUL_BY_ID.get(id)?.baum?.titel ?? MODUL_BY_ID.get(id)?.label ?? id;
const plural = (n: number, eins: string, viele: string) => `${formatDeGanzzahl(n)} ${n === 1 ? eins : viele}`;

function EntwurfBanner({ lp }: { lp: Lernpfad }) {
  if (lp.status !== 'entwurf') return null;
  return (
    <div role="note" className="mt-4 rounded-xl border-2 border-amber-400 bg-amber-50 p-4 text-sm text-amber-950 flex gap-3 items-start">
      <AlertTriangle size={20} className="shrink-0 mt-0.5 text-amber-700" aria-hidden="true" />
      <div>
        <p className="font-bold">{ENTWURF_HINWEIS}</p>
        <p className="mt-1 text-xs leading-relaxed"><MdText text={inhalt.texte.termineReihenfolgeUndModulzuordnung} /></p>
      </div>
    </div>
  );
}

function ModulKnopf({ id }: { id: ModulId }) {
  const { setActiveTab } = useTabContext();
  return (
    <button
      type="button"
      onClick={() => springeZu(setActiveTab, id)}
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-home-grau/30 bg-white text-xs font-medium text-text-main hover:border-shiraz hover:text-shiraz transition-colors cursor-pointer"
    >
      {titelVon(id)} <ArrowRight size={12} aria-hidden="true" />
    </button>
  );
}

function Terminplan({ lp }: { lp: Lernpfad }) {
  const { setActiveTab } = useTabContext();
  const ueGesamt = lp.termine.reduce((s, t) => s + (t.ue ?? 0), 0);
  const zurUebung = (uebung: string) => {
    setzeSprungziel('ki_uebungen', uebung);
    springeZu(setActiveTab, 'ki_uebungen');
  };
  return (
    <section aria-labelledby="lp-terminplan" className="pt-5">
      <h3 id="lp-terminplan" className="text-base font-bold text-text-main">Terminplan</h3>
      <p className="text-xs text-text-main/70 mt-0.5">
        {plural(lp.termine.length, 'Termin', 'Termine')}
        {ueGesamt > 0 && ` · ${formatDeGanzzahl(ueGesamt)} UE à 45 min im Grundlagenteil`}
        {' · '}{plural(moduleDesLernpfads(lp).length, inhalt.werte.zugeordnetesModul, inhalt.werte.zugeordneteModule)}
      </p>
      <ol className="mt-4 space-y-3" role="list">
        {lp.termine.map(t => {
          const uebung = t.uebung ? KI_UEBUNGEN.find(u => u.id === t.uebung) : undefined;
          return (
            <li key={t.nr} className="p-4 rounded-xl border border-home-grau/30 bg-off-white/60">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-shiraz/10 text-shiraz border border-shiraz/20">{terminKennung(lp, t)}</span>
                <h4 className="text-sm font-bold text-text-main">{t.titel}</h4>
              </div>
              <p className="mt-1 text-xs text-text-main/70">
                Datum: {t.datum ?? 'offen'}
                {t.ue !== undefined && ` · ${plural(t.ue, 'UE', 'UE')}`}
              </p>
              {t.hinweis && <p className="mt-1.5 text-xs text-text-main/85 italic">{t.hinweis}</p>}
              <div className="mt-2.5 flex flex-wrap gap-1.5" aria-label={`Module zu ${terminKennung(lp, t)}`} role="group">
                {t.module.map(m => <ModulKnopf key={m} id={m} />)}
              </div>
              {uebung && (
                <button
                  type="button"
                  onClick={() => zurUebung(uebung.id)}
                  className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-shiraz text-white text-xs font-bold hover:bg-shiraz/90 transition-colors cursor-pointer"
                >
                  <ClipboardCheck size={14} aria-hidden="true" /> Hands-on-Übung: {uebung.kurz}
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function Lernziele({ lp }: { lp: Lernpfad }) {
  const { setActiveTab } = useTabContext();
  const module = useMemo(() => moduleDesLernpfads(lp), [lp]);
  const [daten, setDaten] = useState<Record<string, ModulLernziele | undefined> | null>(null);
  useEffect(() => {
    let aktiv = true;
    setDaten(null);
    Promise.all(module.map(m => ladeKopfDaten(m).then(d => [m, d.lernziele] as const)))
      .then(paare => { if (aktiv) setDaten(Object.fromEntries(paare)); });
    return () => { aktiv = false; };
  }, [module]);

  const ersterTermin = (m: ModulId) => lp.termine.find(t => t.module.includes(m));
  const mit = daten ? module.filter(m => daten[m]) : [];
  const ohne = daten ? module.filter(m => !daten[m]) : [];
  const anzahlZiele = mit.reduce((s, m) => s + (daten?.[m]?.ziele.length ?? 0), 0);

  return (
    <section aria-labelledby="lp-lernziele" className="pt-5">
      <h3 id="lp-lernziele" className="text-base font-bold text-text-main"><MdText text={inhalt.texte.lernzieleDerZugeordnetenModule} /></h3>
      {!daten && <p role="status" className="mt-2 text-xs text-text-main/70"><MdText text={inhalt.texte.lernzieleWerdenGeladen} /></p>}
      {daten && (
        <>
          <p className="text-xs text-text-main/70 mt-0.5">
            {plural(anzahlZiele, 'Lernziel', 'Lernziele')} aus {plural(mit.length, 'Modul', 'Modulen')}<MdText text={inhalt.texte.ausDenModulköpfenZusammengeführt} /></p>
          <ul className="mt-4 space-y-3" role="list">
            {mit.map(m => {
              const d = daten[m] as ModulLernziele;
              const t = ersterTermin(m);
              return (
                <li key={m} className="p-4 rounded-xl border border-home-grau/30 bg-white">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h4 className="text-sm font-bold text-text-main">{titelVon(m)}</h4>
                    {t && <span className="text-xs text-text-main/70">ab {terminKennung(lp, t)}</span>}
                    <span className="text-xs text-text-main/70">{NIVEAU[d.niveau]} · ca. {formatDeGanzzahl(d.minuten)} min</span>
                  </div>
                  <ol className="mt-2 space-y-1 list-decimal pl-5 text-sm">
                    {d.ziele.map((z, i) => (
                      <li key={i}><span className="text-[11px] font-bold uppercase tracking-wide text-shiraz mr-1.5">{z.stufe}</span>{z.text}</li>
                    ))}
                  </ol>
                  <button type="button" onClick={() => springeZu(setActiveTab, m)} className="mt-2 text-xs font-bold text-shiraz underline underline-offset-2 cursor-pointer">
                    Modul „{titelVon(m)}“ öffnen
                  </button>
                </li>
              );
            })}
          </ul>
          {ohne.length > 0 && (
            <p className="mt-4 text-xs text-text-main/75">
              <span className="font-semibold"><MdText text={inhalt.texte.ohneHinterlegteLernzieleÜbersichts} /></span>
              {ohne.map(titelVon).join(', ')}
            </p>
          )}
        </>
      )}
    </section>
  );
}

function Quizset({ lp }: { lp: Lernpfad }) {
  // jede Quiz-Gruppe nur einmal, beim ersten Termin, in dem ihr Modul vorkommt
  const gruppen = useMemo(() => {
    const gesehen = new Set<string>();
    return lp.termine.map(t => {
      const ids = quizModuleDerRouten(t.module).filter(q => !gesehen.has(q));
      ids.forEach(q => gesehen.add(q));
      return { t, ids };
    }).filter(g => g.ids.length > 0);
  }, [lp]);
  const gesamt = gruppen.reduce((s, g) => s + g.ids.reduce((n, q) => n + anzahlFragenModul(q), 0), 0);
  return (
    <section aria-labelledby="lp-quiz" className="pt-5">
      <h3 id="lp-quiz" className="text-base font-bold text-text-main">Quizset</h3>
      <p className="text-xs text-text-main/70 mt-0.5">
        {plural(gesamt, 'Frage', 'Fragen')}<MdText text={inhalt.texte.ausDenSelbsttestsDer} /></p>
      {gruppen.length === 0 && <p className="mt-3 text-sm text-text-main/80"><MdText text={inhalt.texte.zuDenZugeordnetenModulen} /></p>}
      <div className="mt-4 space-y-6">
        {gruppen.map(({ t, ids }) => (
          <div key={t.nr}>
            <h4 className="text-sm font-bold text-text-main mb-2">{terminKennung(lp, t)} · {t.titel}</h4>
            <div className="space-y-3">
              {ids.map(q => <ModulTest key={q} moduleId={q} title={`Selbsttest: ${titelVon(quizRoute(q) ?? q)}`} />)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Kursseite({ lp }: { lp: Lernpfad }) {
  const [bereich, setBereich] = useState<Bereich>('termine');
  const routen = useMemo(() => moduleDesLernpfads(lp), [lp]);
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <p className="text-xs font-bold uppercase tracking-wider text-shiraz flex items-center gap-1.5">
          <Route size={14} aria-hidden="true" /><MdText text={inhalt.texte.lernpfadLehrveranstaltung} /></p>
        <h2 className="mt-1 text-xl font-bold text-text-main">{lp.titel}</h2>
        <dl className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          <div className="p-2.5 rounded-lg bg-off-white border border-home-grau/20"><dt className="font-semibold text-text-main/70">Studiengang</dt><dd className="text-text-main">{lp.studiengang}</dd></div>
          <div className="p-2.5 rounded-lg bg-off-white border border-home-grau/20"><dt className="font-semibold text-text-main/70">Semester</dt><dd className="text-text-main">{lp.semester}</dd></div>
          <div className="p-2.5 rounded-lg bg-off-white border border-home-grau/20"><dt className="font-semibold text-text-main/70">Umfang</dt><dd className="text-text-main">{lp.umfang}</dd></div>
        </dl>
        <EntwurfBanner lp={lp} />
        {lp.hinweis && <p className="mt-4 text-sm text-text-main/85 leading-relaxed">{lp.hinweis}</p>}

        <div className="mt-6">
          <ModuleTabs label={inhalt.werte.bereicheDesLernpfads} tabs={BEREICHE} aktiv={bereich} onWechsel={setBereich}>
            {bereich === 'termine' && <Terminplan lp={lp} />}
            {bereich === 'lernziele' && <Lernziele lp={lp} />}
            {bereich === 'quiz' && <Quizset lp={lp} />}
            {bereich === 'klausur' && (
              <div className="pt-5">
                <p className="mb-4 text-xs text-text-main/75"><MdText text={inhalt.texte.prüfungssimulationNurMitFragen} />{plural(routen.length, inhalt.werte.zugeordnetenModul, inhalt.werte.zugeordnetenModule)}<MdText text={inhalt.texte.dieserLehrveranstaltung} /></p>
                <KlausurSimulator routen={routen} titel={`Klausurtraining: ${lp.kurztitel}`} />
              </div>
            )}
          </ModuleTabs>
        </div>
      </div>
    </div>
  );
}

function Uebersicht() {
  const { setActiveTab } = useTabContext();
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <GraduationCap className="text-shiraz" aria-hidden="true" /><MdText text={inhalt.texte.lernpfadeNachLehrveranstaltung} /></h2>
        <p className="mt-2 text-sm text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.jedeLehrveranstaltungBündeltDie} /></p>
        {LERNPFADE.some(l => l.status === 'entwurf') && (
          <div role="note" className="mt-4 rounded-xl border-2 border-amber-400 bg-amber-50 p-4 text-sm text-amber-950 flex gap-3 items-start">
            <AlertTriangle size={20} className="shrink-0 mt-0.5 text-amber-700" aria-hidden="true" />
            <p><strong>{ENTWURF_HINWEIS}.</strong><MdText text={inhalt.texte.alleMitEntwurfGekennzeichneten} /></p>
          </div>
        )}
        <ul className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3" role="list">
          {LERNPFADE.map(l => (
            <li key={l.id}>
              <button
                type="button"
                onClick={() => springeZu(setActiveTab, l.id as TabId)}
                className="w-full h-full text-left p-4 rounded-xl border border-home-grau/30 bg-off-white hover:border-shiraz hover:bg-shiraz/5 transition-colors cursor-pointer"
              >
                <span className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-text-main">{l.titel}</span>
                  {l.status === 'entwurf' && <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300">Entwurf</span>}
                </span>
                <span className="block mt-1 text-xs text-text-main/75">{l.studiengang} · {l.semester}</span>
                <span className="block mt-1 text-xs text-text-main/75">
                  {plural(l.termine.length, 'Termin', 'Termine')} · {plural(moduleDesLernpfads(l).length, 'Modul', 'Module')}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Lehrveranstaltungen({ kursId }: { kursId?: string }) {
  const lp = kursId ? LERNPFAD_BY_ID.get(kursId) : undefined;
  return lp ? <Kursseite key={lp.id} lp={lp} /> : <Uebersicht />;
}
