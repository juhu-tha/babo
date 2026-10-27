import React, { useMemo, useState } from 'react';
import { CheckCircle2, Download, MessageSquare, RotateCcw } from 'lucide-react';
import type { QuizQuestion } from '@/src/data/quizModell';
import { useAlleFragen } from '@/src/data/quizLader';
import { META_CLUSTERS } from '@/src/data/metaClusters';
import { formatDeWert } from '@/src/utils/numberFormat';
import { AuswahlGruppe, alsOption } from '../ui/Auswahlgruppe';

/**
 * Fachliche Freigabe der Quizfragen je Cluster (Umsetzungsplan Phase 3, AP 3.5).
 * Die Entscheidungen werden im Browser zwischengespeichert und als JSON exportiert;
 * scripts/quiz-freigabe.mjs überträgt sie in src/data/quiz.json (reviewer, reviewedAt, verified).
 */
export type FreigabeStatus = 'freigegeben' | 'kommentiert';
export interface FreigabeEintrag { status: FreigabeStatus; kommentar?: string; datum: string }
const SPEICHER = 'bb_quiz_freigabe';

function lade(): Record<string, FreigabeEintrag> {
  try { return JSON.parse(localStorage.getItem(SPEICHER) || '{}'); } catch { return {}; }
}
function speichere(d: Record<string, FreigabeEintrag>) {
  try { localStorage.setItem(SPEICHER, JSON.stringify(d)); } catch { /* Speicher nicht verfügbar */ }
}
const heute = () => new Date().toISOString().slice(0, 10);

export function FragenFreigabe() {
  const [cluster, setCluster] = useState<string>('I');
  const [entscheidungen, setEntscheidungen] = useState<Record<string, FreigabeEintrag>>(lade);
  const [nurOffene, setNurOffene] = useState(true);
  const [entwurf, setEntwurf] = useState<Record<string, string>>({});

  // Gesamtpool in Teilpaketen nachgeladen (quizLader); bis dahin leer
  const pool = useAlleFragen();
  const QUIZ_QUESTIONS = pool ?? [];
  const fragen = useMemo(() => (pool ?? []).filter(q => q.clusterId === cluster), [pool, cluster]);
  const sichtbar = fragen.filter(q => !nurOffene || (!q.verified && !entscheidungen[q.id]));
  const stand = (q: QuizQuestion) => (q.verified ? 'bereits freigegeben' : entscheidungen[q.id]?.status);

  const setze = (id: string, e: FreigabeEintrag | null) => {
    const neu = { ...entscheidungen };
    if (e) neu[id] = e; else delete neu[id];
    setEntscheidungen(neu);
    speichere(neu);
  };

  const exportieren = () => {
    const daten = { format: 'bb-quiz-freigabe-1', exportiert: new Date().toISOString(), entscheidungen };
    const blob = new Blob([JSON.stringify(daten, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `quiz-freigabe-${heute()}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const zaehler = (c: string) => {
    const f = QUIZ_QUESTIONS.filter(q => q.clusterId === c);
    return { gesamt: f.length, erledigt: f.filter(q => q.verified || entscheidungen[q.id]?.status === 'freigegeben').length };
  };

  return (
    <div className="space-y-5">
      <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 leading-relaxed">
        <p>
          Prüfen Sie die Fragen eines Clusters und geben Sie sie frei oder kommentieren Sie sie. Ihre Entscheidungen bleiben in diesem
          Browser gespeichert. Mit <strong>„Entscheidungen exportieren“</strong> laden Sie eine JSON-Datei herunter; diese wird in das
          Repository übernommen und setzt bei freigegebenen Fragen „geprüft von“ und „geprüft am“.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <AuswahlGruppe className="flex flex-wrap items-center gap-2" label="Cluster wählen">
        {META_CLUSTERS.filter(c => QUIZ_QUESTIONS.some(q => q.clusterId === c.number)).map(c => {
          const z = zaehler(c.number);
          return (
            <button key={c.number} type="button" {...alsOption(cluster === c.number)} onClick={() => setCluster(c.number)}
              className={`px-3 py-2 rounded-xl text-xs font-bold border ${cluster === c.number ? 'bg-shiraz text-white border-shiraz' : 'bg-white text-text-main border-home-grau/30'}`}>
              {c.number} {c.name} · {formatDeWert(z.erledigt)}/{formatDeWert(z.gesamt)}
            </button>
          );
        })}
        </AuswahlGruppe>
        <label className="ml-auto flex items-center gap-2 text-xs">
          <input type="checkbox" checked={nurOffene} onChange={e => setNurOffene(e.target.checked)} /> nur offene Fragen
        </label>
        <button type="button" onClick={exportieren} className="px-3 py-2 rounded-xl text-xs font-bold bg-shiraz text-white flex items-center gap-1.5">
          <Download size={14} aria-hidden="true" /> Entscheidungen exportieren ({formatDeWert(Object.keys(entscheidungen).length)})
        </button>
      </div>

      {sichtbar.length === 0 && <p className="text-sm text-text-main/70">Keine offenen Fragen in diesem Cluster.</p>}

      <ol className="space-y-4">
        {sichtbar.map(q => (
          <li key={q.id} className="bg-white p-4 rounded-xl border border-home-grau/30 space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-text-main/70">
              <span className="font-mono">{q.id}</span>
              <span>· {q.moduleTitle}</span>
              {q.difficulty && <span>· {q.difficulty}</span>}
              {q.normRef && <span>· {q.normRef}</span>}
              {stand(q) && <span className="ml-auto font-bold text-shiraz">{stand(q)}</span>}
            </div>
            <p className="text-sm font-semibold text-text-main">{q.question}</p>
            <ol className="text-sm space-y-1 list-[upper-alpha] pl-6">
              {q.options.map((o, i) => (
                <li key={i} className={i === q.correctIdx ? 'font-bold text-emerald-800' : ''}>
                  {o}{i === q.correctIdx ? ' ✓' : ''}
                  {q.distraktorFeedback?.[i] && <span className="block text-xs font-normal text-text-main/70">Rückmeldung: {q.distraktorFeedback[i]}</span>}
                </li>
              ))}
            </ol>
            <p className="text-xs text-text-main/80"><strong>Begründung:</strong> {q.explanation}</p>
            {!q.verified && (
              <div className="flex flex-wrap items-start gap-2 pt-1">
                <button type="button" onClick={() => setze(q.id, { status: 'freigegeben', datum: heute() })}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-700 text-white flex items-center gap-1">
                  <CheckCircle2 size={14} aria-hidden="true" /> freigeben
                </button>
                <label className="sr-only" htmlFor={`k-${q.id}`}>Kommentar zu {q.id}</label>
                <input id={`k-${q.id}`} value={entwurf[q.id] ?? entscheidungen[q.id]?.kommentar ?? ''} onChange={e => setEntwurf({ ...entwurf, [q.id]: e.target.value })}
                  placeholder="Kommentar (Fehler, Korrektur …)" className="flex-1 min-w-[12rem] px-2 py-1.5 text-xs border border-home-grau/30 rounded-lg" />
                <button type="button" disabled={!(entwurf[q.id] ?? '').trim()}
                  onClick={() => setze(q.id, { status: 'kommentiert', kommentar: (entwurf[q.id] ?? '').trim(), datum: heute() })}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-shiraz text-shiraz flex items-center gap-1 disabled:opacity-50">
                  <MessageSquare size={14} aria-hidden="true" /> kommentieren
                </button>
                {entscheidungen[q.id] && (
                  <button type="button" onClick={() => setze(q.id, null)} className="px-2 py-1.5 rounded-lg text-xs border border-home-grau/30 flex items-center gap-1">
                    <RotateCcw size={14} aria-hidden="true" /> zurücksetzen
                  </button>
                )}
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

export default FragenFreigabe;
