import React, { useEffect, useId, useState } from 'react';
import { CheckCircle2, XCircle, RotateCcw, FileDown, ShieldCheck } from 'lucide-react';
import { ladeModulFragen } from '@/src/data/quizLader';
import type { QuizQuestion } from '@/src/data/quizModell';
import { mischeAntworten } from '@/src/utils/mischeAntworten';
import { BESTAETIGUNG_HINWEIS, KURSQUIZ_FRAGEN, type TtzKurs } from '@/src/data/ttzKurse';
import { MODUL_BY_ID } from '@/src/registry/modules';
import { formatDeWert } from '@/src/utils/numberFormat';
import { istBestanden, prozent, waehleKursFragen } from './kursQuiz';

/** bestes Ergebnis je Kurs – nur im Arbeitsspeicher dieser Sitzung (kein Web Storage) */
const sitzungsBestwert = new Map<string, number>();

async function ladeKursPool(kurs: TtzKurs): Promise<QuizQuestion[]> {
  const teile = await Promise.all(kurs.module.map(m => ladeModulFragen(m)));
  return teile.flat();
}

function dateiname(kurs: TtzKurs): string {
  return `Teilnahmebestaetigung_${kurs.id}.pdf`;
}

export function KursQuiz({ kurs }: { kurs: TtzKurs }) {
  const basisId = useId();
  const [fragen, setFragen] = useState<QuizQuestion[] | null>(null);
  const [fehler, setFehler] = useState(false);
  const [versuch, setVersuch] = useState(0);
  const [antworten, setAntworten] = useState<Record<string, number>>({});
  const [ausgewertet, setAusgewertet] = useState(false);
  const [name, setName] = useState('');
  const [pdfStatus, setPdfStatus] = useState<'' | 'laeuft' | 'fertig' | 'fehler'>('');
  const [bestwert, setBestwert] = useState<number | undefined>(sitzungsBestwert.get(kurs.id));

  useEffect(() => {
    let aktiv = true;
    setFragen(null);
    setFehler(false);
    ladeKursPool(kurs).then(pool => {
      if (aktiv) setFragen(waehleKursFragen(pool, KURSQUIZ_FRAGEN).map(q => mischeAntworten(q)));
    }, () => { if (aktiv) setFehler(true); });
    return () => { aktiv = false; };
  }, [kurs, versuch]);

  if (fehler) return <p className="text-sm text-shiraz" role="alert">Die Fragen konnten nicht geladen werden. Bitte später erneut versuchen.</p>;
  if (!fragen) return <p className="text-sm text-text-main/70" role="status">Fragen werden geladen …</p>;

  const gesamt = fragen.length;
  const beantwortet = fragen.filter(q => antworten[q.id] !== undefined).length;
  const richtig = fragen.filter(q => antworten[q.id] === q.correctIdx).length;
  const bestanden = ausgewertet && istBestanden(richtig, gesamt);

  const auswerten = () => {
    setAusgewertet(true);
    const p = prozent(richtig, gesamt);
    const alt = sitzungsBestwert.get(kurs.id);
    if (alt === undefined || p > alt) { sitzungsBestwert.set(kurs.id, p); setBestwert(p); }
  };
  const neuerVersuch = () => {
    setAntworten({});
    setAusgewertet(false);
    setPdfStatus('');
    setVersuch(v => v + 1);
  };
  const pdfErzeugen = async () => {
    setPdfStatus('laeuft');
    try {
      const { erzeugeTeilnahmebestaetigung } = await import('./teilnahmebestaetigung');
      const bytes = erzeugeTeilnahmebestaetigung({
        kurs, name, datum: new Date(), richtig, gesamt,
        modulTitel: kurs.module.map(m => MODUL_BY_ID.get(m)?.baum?.titel ?? MODUL_BY_ID.get(m)?.label ?? m),
      });
      const url = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = dateiname(kurs);
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
      setPdfStatus('fertig');
    } catch (e) {
      console.error('Teilnahmebestätigung konnte nicht erzeugt werden', e);
      setPdfStatus('fehler');
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <p className="text-xs text-text-main/75">
        {formatDeWert(gesamt)} zufällig ausgewählte Fragen aus den Kursmodulen · bestanden ab 80 % richtiger Antworten
        {bestwert !== undefined && <> · bestes Ergebnis in dieser Sitzung: <strong>{formatDeWert(bestwert)} %</strong></>}
      </p>
      <ol className="flex flex-col gap-5 list-none p-0 m-0">
        {fragen.map((q, i) => {
          const gewaehlt = antworten[q.id];
          const gruppe = `${basisId}-${q.id}`;
          return (
            <li key={q.id}>
              <fieldset className="p-4 sm:p-5 bg-off-white rounded-2xl border border-home-grau/30 flex flex-col gap-3 min-w-0">
                <legend className="float-left w-full flex flex-col gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-shiraz">Frage {formatDeWert(i + 1)} / {formatDeWert(gesamt)} · {q.moduleTitle}</span>
                  <span className="text-sm sm:text-base font-bold text-text-main leading-snug">{q.question}</span>
                </legend>
                <div className="flex flex-col gap-2 clear-both">
                  {q.options.map((opt, oi) => {
                    const istRichtig = oi === q.correctIdx;
                    let stil = 'bg-white border-home-grau/30';
                    if (ausgewertet && istRichtig) stil = 'bg-white border-slate-500 ring-1 ring-slate-500';
                    else if (ausgewertet && gewaehlt === oi) stil = 'bg-white border-shiraz ring-1 ring-shiraz';
                    return (
                      <label key={oi} className={`flex items-start gap-3 p-3 rounded-xl border text-sm text-text-main cursor-pointer ${stil}`}>
                        <input
                          type="radio"
                          name={gruppe}
                          className="mt-1 accent-[var(--color-shiraz)] shrink-0"
                          checked={gewaehlt === oi}
                          disabled={ausgewertet}
                          onChange={() => setAntworten(a => ({ ...a, [q.id]: oi }))}
                        />
                        <span className="flex-1 leading-relaxed">{opt}</span>
                        {ausgewertet && istRichtig && <span className="text-xs font-bold text-text-main flex items-center gap-1 shrink-0"><CheckCircle2 size={15} aria-hidden="true" /> richtig</span>}
                        {ausgewertet && !istRichtig && gewaehlt === oi && <span className="text-xs font-bold text-shiraz flex items-center gap-1 shrink-0"><XCircle size={15} aria-hidden="true" /> Ihre Antwort</span>}
                      </label>
                    );
                  })}
                </div>
                {ausgewertet && (
                  <p className="text-xs sm:text-sm text-text-main/80 leading-relaxed border-t border-home-grau/20 pt-3">
                    <strong>Erläuterung:</strong> {q.explanation}
                  </p>
                )}
              </fieldset>
            </li>
          );
        })}
      </ol>

      {!ausgewertet ? (
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={auswerten}
            disabled={beantwortet < gesamt}
            className="px-4 py-2 rounded-xl text-sm font-bold bg-shiraz text-white disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            Quiz auswerten
          </button>
          <span className="text-xs text-text-main/75" aria-live="polite">{formatDeWert(beantwortet)} von {formatDeWert(gesamt)} beantwortet</span>
        </div>
      ) : (
        <div className="flex flex-col gap-4 p-4 sm:p-5 rounded-2xl border border-home-grau/30 bg-white" role="status">
          <p className="text-base font-bold text-text-main">
            Ergebnis: {formatDeWert(richtig)} von {formatDeWert(gesamt)} richtig ({formatDeWert(prozent(richtig, gesamt))} %) –{' '}
            {bestanden ? 'bestanden.' : 'noch nicht bestanden (80 % erforderlich).'}
          </p>
          {bestanden && (
            <div className="flex flex-col gap-3">
              <p className="text-sm text-text-main/80 flex items-start gap-2">
                <ShieldCheck size={18} className="text-shiraz shrink-0 mt-0.5" aria-hidden="true" />
                <span>{BESTAETIGUNG_HINWEIS}. Ihr Name wird nur in Ihrem Browser in das PDF geschrieben – er wird weder gespeichert noch übertragen.</span>
              </p>
              <div className="flex flex-col sm:flex-row sm:items-end gap-3">
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <label htmlFor={`${basisId}-name`} className="text-xs font-bold text-text-main">Name für die Teilnahmebestätigung</label>
                  <input
                    id={`${basisId}-name`}
                    type="text"
                    autoComplete="off"
                    maxLength={80}
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-home-grau/40 bg-white text-sm text-text-main"
                  />
                </div>
                <button
                  type="button"
                  onClick={pdfErzeugen}
                  disabled={!name.trim() || pdfStatus === 'laeuft'}
                  className="px-4 py-2 rounded-xl text-sm font-bold bg-shiraz text-white disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                >
                  <FileDown size={16} aria-hidden="true" /> PDF erzeugen
                </button>
              </div>
              <p className="text-xs text-text-main/75" aria-live="polite">
                {pdfStatus === 'laeuft' && 'PDF wird erzeugt …'}
                {pdfStatus === 'fertig' && `PDF erzeugt (${dateiname(kurs)}).`}
                {pdfStatus === 'fehler' && 'Das PDF konnte nicht erzeugt werden.'}
              </p>
            </div>
          )}
          <button
            type="button"
            onClick={neuerVersuch}
            className="self-start px-3 py-1.5 rounded-xl text-xs font-bold text-text-main bg-white border border-home-grau/40 cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw size={13} aria-hidden="true" /> Neuer Versuch mit neuen Fragen
          </button>
        </div>
      )}
    </div>
  );
}
