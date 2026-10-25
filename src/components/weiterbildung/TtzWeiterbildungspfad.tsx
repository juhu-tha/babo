import React, { useState } from 'react';
import { AlertTriangle, ArrowUpRight, ChevronDown, Clock, Target, Users } from 'lucide-react';
import { useTabContext, type TabId } from '@/src/contexts/TabContext';
import { MODUL_BY_ID } from '@/src/registry/modules';
import { ENTWURF_HINWEIS, KURS_STRAENGE, TTZ_KURSE, BESTAETIGUNG_HINWEIS, type TtzKurs } from '@/src/data/ttzKurse';
import { formatDeWert } from '@/src/utils/numberFormat';
import { KursQuiz } from './KursQuiz';

/**
 * TTZ-Weiterbildungspfad (Umsetzungsplan Phase 6, AP 6.3): 13 Selbstlernkurse in vier Strängen.
 * Kein Fachmodul (Menügruppe Weiter@THA, Typ info). Alles läuft lokal im Browser: Kursquiz aus dem
 * Fragenpool der zugeordneten Module, Teilnahmebestätigung als PDF ab 80 %; der Server speichert nichts.
 */
function KursKarte({ kurs, nr }: { kurs: TtzKurs; nr: number }) {
  const { setActiveTab } = useTabContext();
  const [quizOffen, setQuizOffen] = useState(false);
  const quizId = `${kurs.id}-quiz`;
  return (
    <li className="bg-white rounded-2xl border border-home-grau/30 p-4 sm:p-5 flex flex-col gap-3 min-w-0">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-off-white text-text-main border border-home-grau/30">Kurs {formatDeWert(nr)}</span>
        {kurs.status === 'entwurf' && (
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-shiraz/10 text-text-main border border-shiraz/30">Entwurf</span>
        )}
      </div>
      <h4 className="text-base sm:text-lg font-bold text-text-main leading-snug">{kurs.titel}</h4>
      <dl className="grid grid-cols-1 gap-2 text-sm text-text-main/85">
        <div className="flex flex-nowrap gap-2"><dt className="shrink-0"><Target size={16} className="text-shiraz mt-0.5" aria-hidden="true" /><span className="sr-only">Ziel</span></dt><dd className="min-w-0">{kurs.ziel}</dd></div>
        <div className="flex flex-nowrap gap-2"><dt className="shrink-0"><Users size={16} className="text-shiraz mt-0.5" aria-hidden="true" /><span className="sr-only">Zielgruppe</span></dt><dd className="min-w-0">{kurs.zielgruppe}</dd></div>
        <div className="flex flex-nowrap gap-2"><dt className="shrink-0"><Clock size={16} className="text-shiraz mt-0.5" aria-hidden="true" /><span className="sr-only">Umfang</span></dt><dd className="min-w-0">{kurs.umfang}</dd></div>
      </dl>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-text-main/75 mb-2">Module (empfohlene Reihenfolge)</p>
        <ol className="flex flex-wrap gap-2 list-none p-0 m-0">
          {kurs.module.map(m => {
            const eintrag = MODUL_BY_ID.get(m);
            return (
              <li key={m}>
                <button
                  type="button"
                  onClick={() => setActiveTab(m as TabId)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-text-main bg-off-white border border-home-grau/30 hover:border-shiraz/50 cursor-pointer"
                >
                  {eintrag?.baum?.titel ?? eintrag?.label ?? m} <ArrowUpRight size={12} aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </ol>
      </div>
      <button
        type="button"
        onClick={() => setQuizOffen(o => !o)}
        aria-expanded={quizOffen}
        aria-controls={quizId}
        className="self-start mt-1 px-3 py-2 rounded-xl text-sm font-bold text-white bg-shiraz cursor-pointer flex items-center gap-2"
      >
        {quizOffen ? 'Kursquiz schließen' : 'Kursquiz starten'}
        <ChevronDown size={16} className={`transition-transform ${quizOffen ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      <div id={quizId} hidden={!quizOffen} className="border-t border-home-grau/20 pt-4">
        {quizOffen && <KursQuiz kurs={kurs} />}
      </div>
    </li>
  );
}

export default function TtzWeiterbildungspfad() {
  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      <div role="note" className="flex items-start gap-3 p-4 rounded-2xl border-2 border-shiraz/60 bg-shiraz/10 text-text-main">
        <AlertTriangle size={20} className="text-shiraz shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-sm font-bold">{ENTWURF_HINWEIS}</p>
      </div>

      <section className="bg-white border border-home-grau/30 border-t-4 border-t-shiraz rounded-3xl p-5 md:p-8 flex flex-col gap-3" aria-labelledby="ttz-pfad-titel">
        <h2 id="ttz-pfad-titel" className="text-2xl md:text-3xl font-extrabold tracking-tight text-text-main">TTZ-Weiterbildungspfad</h2>
        <p className="text-sm md:text-base text-text-main/80 leading-relaxed max-w-3xl">
          Selbstlernpfad des Technologietransferzentrums (TTZ) Aichach der TH Augsburg: {formatDeWert(TTZ_KURSE.length)} Kurse in vier Strängen –
          Zirkularität, Ökobilanz, Zertifizierung sowie Technologie &amp; Produkte. Jeder Kurs bündelt bestehende Module dieser Plattform
          und schließt mit einem Kursquiz ab. Ab 80 % richtiger Antworten können Sie eine Teilnahmebestätigung als PDF erzeugen.
        </p>
        <ul className="text-xs sm:text-sm text-text-main/80 list-disc pl-5 flex flex-col gap-1">
          <li>{BESTAETIGUNG_HINWEIS}.</li>
          <li>Alles läuft lokal in Ihrem Browser: Antworten, Ergebnis und Name werden nicht an einen Server gesendet und nicht gespeichert. Das Ergebnis bleibt nur bis zum Schließen der Seite erhalten.</li>
        </ul>
      </section>

      {KURS_STRAENGE.map(s => {
        const kurse = TTZ_KURSE.filter(k => k.strang === s.id);
        return (
          <section key={s.id} aria-labelledby={`ttz-strang-${s.id}`} className="flex flex-col gap-4">
            <div>
              <h3 id={`ttz-strang-${s.id}`} className="text-xl font-bold text-text-main">{s.titel} <span className="text-sm font-normal text-text-main/75">({formatDeWert(kurse.length)} Kurse)</span></h3>
              <p className="text-sm text-text-main/75">{s.kurz}</p>
            </div>
            <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4 list-none p-0 m-0">
              {kurse.map(k => <KursKarte key={k.id} kurs={k} nr={TTZ_KURSE.indexOf(k) + 1} />)}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
