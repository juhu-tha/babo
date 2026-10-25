import React, { useEffect, useId, useRef, useState } from 'react';
import { MessageSquareHeart, X } from 'lucide-react';
import { useTabContext } from '@/src/contexts/TabContext';
import {
  KF_FREITEXT_MAX, KF_ITEMS, KF_SKALA,
  semesterSchluessel, semesterText, type KfItemId, type KfWert,
} from '@/src/data/kurzfragebogen';
import { formatDeGanzzahl } from '@/src/utils/numberFormat';

/**
 * Anonymer Kurzfragebogen (Umsetzungsplan Phase 6, AP 6.9): erscheint höchstens einmal je Semester und
 * Browser, nicht auf der Startseite und erst nach einer Weile Nutzung. Im Browser wird nur das Semester
 * gespeichert, in dem er angezeigt wurde (Schlüssel bb_kurzfragebogen), nie die Antworten.
 */
const VERZOEGERUNG_MS = 90_000;
/** enthält nur das Semester der Anzeige (Speicher-Register: src/data/speicherRegister.ts) */
const SPEICHER = 'bb_kurzfragebogen';

function schonAngezeigt(semester: string): boolean {
  try {
    return localStorage.getItem(SPEICHER) === semester;
  } catch {
    return true; // ohne Speicher lässt sich „einmal je Semester“ nicht einhalten → nicht anzeigen
  }
}

function merkeAngezeigt(semester: string) {
  try {
    localStorage.setItem(SPEICHER, semester);
  } catch {
    /* Speicher nicht verfügbar */
  }
}

type Phase = 'aus' | 'frage' | 'formular' | 'gesendet';

export default function Kurzfragebogen() {
  const { activeTab } = useTabContext();
  const [phase, setPhase] = useState<Phase>('aus');
  const [werte, setWerte] = useState<Partial<Record<KfItemId, KfWert>>>({});
  const [freitext, setFreitext] = useState('');
  const [sendet, setSendet] = useState(false);
  const [meldung, setMeldung] = useState('');
  const semester = useRef(semesterSchluessel()).current;
  const basis = useId();
  const titelId = `${basis}-titel`;
  const formularRef = useRef<HTMLFormElement>(null);

  // Erst nach einer Weile Nutzung und nie auf der Startseite einblenden
  const [reif, setReif] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setReif(true), VERZOEGERUNG_MS);
    return () => window.clearTimeout(t);
  }, []);
  useEffect(() => {
    if (!reif || phase !== 'aus' || activeTab === 'start' || schonAngezeigt(semester)) return;
    merkeAngezeigt(semester);
    setPhase('frage');
  }, [reif, activeTab, phase, semester]);

  useEffect(() => {
    if (phase === 'formular') formularRef.current?.querySelector<HTMLInputElement>('input')?.focus();
  }, [phase]);

  useEffect(() => {
    if (phase !== 'gesendet') return;
    const t = window.setTimeout(() => setPhase('aus'), 6000);
    return () => window.clearTimeout(t);
  }, [phase]);

  if (phase === 'aus') return null;

  const schliessen = () => setPhase('aus');
  const taste = (e: React.KeyboardEvent) => { if (e.key === 'Escape') { e.stopPropagation(); schliessen(); } };

  const absenden = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = freitext.trim();
    if (Object.keys(werte).length === 0 && !text) {
      setMeldung('Bitte bewerten Sie mindestens eine Aussage oder schreiben Sie einen Kommentar.');
      return;
    }
    setSendet(true);
    setMeldung('');
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'omit',
        body: JSON.stringify(text ? { werte, freitext: text } : { werte }),
      });
      if (res.ok) {
        setPhase('gesendet');
      } else {
        const d: { error?: string } = await res.json().catch(() => ({}));
        setMeldung(d.error || 'Senden fehlgeschlagen. Bitte später erneut versuchen.');
      }
    } catch {
      setMeldung('Server nicht erreichbar. Bitte später erneut versuchen.');
    } finally {
      setSendet(false);
    }
  };

  const knopf = 'px-3.5 py-2 rounded-lg text-xs font-bold cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shiraz';
  const zeichen = [...freitext].length;

  return (
    <aside
      aria-labelledby={titelId}
      onKeyDown={taste}
      className="print:hidden fixed z-50 bottom-4 right-4 left-4 sm:left-auto sm:w-[26rem] max-h-[85vh] overflow-y-auto rounded-2xl border border-home-grau/40 bg-white dark:bg-slate-900 text-text-main dark:text-slate-100 shadow-xl"
    >
      <div className="flex items-start gap-2 p-4 pb-2">
        <MessageSquareHeart size={20} className="text-shiraz shrink-0 mt-0.5" aria-hidden="true" />
        <h2 id={titelId} className="text-sm font-bold flex-1">Kurze Rückmeldung zum BaustoffBoard</h2>
        <button type="button" onClick={schliessen} aria-label="Fragebogen schließen" className="p-1 rounded-lg hover:bg-off-white dark:hover:bg-slate-800 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-shiraz">
          <X size={18} aria-hidden="true" />
        </button>
      </div>

      {phase === 'frage' && (
        <div className="px-4 pb-4 space-y-3 text-sm">
          <p>
            Fünf Aussagen, ein optionaler Kommentar, etwa eine Minute. Die Befragung ist anonym und erscheint
            höchstens einmal im {semesterText(semester)}.
          </p>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setPhase('formular')} className={`${knopf} bg-shiraz text-white hover:bg-shiraz/90`}>Jetzt teilnehmen</button>
            <button type="button" onClick={schliessen} className={`${knopf} border border-home-grau/40 hover:bg-off-white dark:hover:bg-slate-800`}>Nicht jetzt</button>
          </div>
        </div>
      )}

      {phase === 'formular' && (
        <form ref={formularRef} onSubmit={absenden} className="px-4 pb-4 space-y-4 text-sm" noValidate>
          <p className="text-xs">
            Anonym: gespeichert werden nur Zählwerte je Semester und Ihr Kommentar ohne Zeitpunkt oder Gerätedaten.
            Bitte keine Namen oder andere personenbezogenen Angaben in den Kommentar schreiben.
          </p>
          {KF_ITEMS.map(item => (
            <fieldset key={item.id} className="space-y-1.5">
              <legend className="font-semibold text-sm">{item.text}</legend>
              <div className="grid grid-cols-5 gap-1">
                {KF_SKALA.map((label, i) => {
                  const wert = (i + 1) as KfWert;
                  const an = werte[item.id] === wert;
                  return (
                    <label key={i} className={`flex flex-col items-center gap-1 rounded-lg border p-1.5 text-[11px] leading-tight text-center cursor-pointer ${an ? 'border-shiraz bg-shiraz/10 font-bold' : 'border-home-grau/40'} focus-within:outline focus-within:outline-2 focus-within:outline-shiraz`}>
                      <input
                        type="radio"
                        name={`${basis}-${item.id}`}
                        value={wert}
                        checked={an}
                        onChange={() => setWerte({ ...werte, [item.id]: wert })}
                        className="accent-shiraz"
                      />
                      <span>{label}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          ))}
          <div className="space-y-1">
            <label htmlFor={`${basis}-freitext`} className="font-semibold">Was sollten wir verbessern? (optional)</label>
            <textarea
              id={`${basis}-freitext`}
              value={freitext}
              maxLength={KF_FREITEXT_MAX}
              onChange={e => setFreitext(e.target.value)}
              rows={3}
              aria-describedby={`${basis}-zaehler`}
              className="w-full rounded-lg border border-home-grau/40 bg-white dark:bg-slate-800 p-2 text-sm"
            />
            <p id={`${basis}-zaehler`} className="text-xs text-text-main/80 dark:text-slate-300">
              {formatDeGanzzahl(zeichen)} von {formatDeGanzzahl(KF_FREITEXT_MAX)} Zeichen
            </p>
          </div>
          <p role="status" className="text-xs font-semibold text-red-700 dark:text-red-300 min-h-[1em]">{meldung}</p>
          <div className="flex flex-wrap gap-2">
            <button type="submit" disabled={sendet} className={`${knopf} bg-shiraz text-white hover:bg-shiraz/90 disabled:opacity-60`}>
              {sendet ? 'Wird gesendet …' : 'Absenden'}
            </button>
            <button type="button" onClick={schliessen} className={`${knopf} border border-home-grau/40 hover:bg-off-white dark:hover:bg-slate-800`}>Abbrechen</button>
          </div>
        </form>
      )}

      {phase === 'gesendet' && (
        <p role="status" className="px-4 pb-4 text-sm">Vielen Dank für Ihre Rückmeldung!</p>
      )}
    </aside>
  );
}
