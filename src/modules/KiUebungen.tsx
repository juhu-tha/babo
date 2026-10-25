import React, { useState } from 'react';
import { ArrowRight, Check, ClipboardCheck, Clock, Copy, FileText, ListChecks, MessageSquareQuote, ShieldAlert, Target } from 'lucide-react';
import { ModuleTabs, type ModulTab } from '@/src/components/ui/ModuleTabs';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { springeZu } from '@/src/components/ui/Querverweis';
import { useTabContext } from '@/src/contexts/TabContext';
import { formatDeGanzzahl } from '@/src/utils/numberFormat';
import { KI_UEBUNGEN, KI_UEBUNG_REGELN, type KiUebung, type PromptVorlage } from '@/src/data/kiUebungen';

/**
 * Hands-on-Übungen zur Master-Vorlesung „KI im Bauwesen“ (Umsetzungsplan Phase 6, AP 6.5):
 * eine code-freie Selbstlernübung je Themenblock, ausgelegt für den Microsoft Copilot der Hochschule.
 */

function KopierFeld({ vorlage }: { vorlage: PromptVorlage }) {
  const [status, setStatus] = useState<'' | 'ok' | 'fehler'>('');
  const kopieren = async () => {
    try {
      await navigator.clipboard.writeText(vorlage.text);
      setStatus('ok');
    } catch {
      setStatus('fehler');
    }
    window.setTimeout(() => setStatus(''), 2500);
  };
  return (
    <div className="rounded-xl border border-home-grau/30 bg-white overflow-hidden">
      <div className="flex items-center justify-between gap-2 px-3 py-2 bg-off-white border-b border-home-grau/20">
        <span className="text-xs font-bold text-text-main">{vorlage.titel}</span>
        <button
          type="button"
          onClick={kopieren}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-shiraz text-white text-xs font-bold hover:bg-shiraz/90 cursor-pointer"
        >
          {status === 'ok' ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
          {status === 'ok' ? 'Kopiert' : 'Kopieren'}
          <span className="sr-only">: {vorlage.titel}</span>
        </button>
      </div>
      <pre className="p-3 text-xs font-mono whitespace-pre-wrap leading-relaxed text-text-main/90">{vorlage.text}</pre>
      <p aria-live="polite" className="sr-only">{status === 'ok' ? 'Prompt in die Zwischenablage kopiert.' : ''}</p>
      {status === 'fehler' && (
        <p className="px-3 pb-2 text-xs text-red-700">Kopieren nicht möglich – bitte den Text markieren und manuell kopieren.</p>
      )}
    </div>
  );
}

function Abschnitt({ icon: Icon, titel, children }: { icon: React.ComponentType<{ size?: number; className?: string; 'aria-hidden'?: boolean }>; titel: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h4 className="text-sm font-bold text-text-main flex items-center gap-2">
        <Icon size={16} className="text-shiraz" aria-hidden={true} /> {titel}
      </h4>
      {children}
    </section>
  );
}

function Uebung({ u }: { u: KiUebung }) {
  const { setActiveTab } = useTabContext();
  const [erledigt, setErledigt] = useState<Record<number, boolean>>({});
  return (
    <article className="space-y-6 pt-5" aria-labelledby={`uebung-${u.id}`}>
      <header className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-wider text-shiraz">{u.block}</p>
        <h3 id={`uebung-${u.id}`} className="text-lg font-bold text-text-main">{u.titel}</h3>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-off-white border border-home-grau/30">
            <Clock size={14} aria-hidden="true" /> Zeitbedarf: etwa {formatDeGanzzahl(u.minuten)} Minuten
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-off-white border border-home-grau/30">
            ohne Programmierung · Microsoft Copilot (Hochschulkonto)
          </span>
        </div>
      </header>

      <Abschnitt icon={Target} titel="Ziel">
        <p className="text-sm text-text-main/85 leading-relaxed">{u.ziel}</p>
      </Abschnitt>

      <Abschnitt icon={FileText} titel="Material">
        <ul className="list-disc pl-6 text-sm text-text-main/85 space-y-1">
          {u.material.map((m, i) => <li key={i}>{m}</li>)}
        </ul>
      </Abschnitt>

      <Abschnitt icon={ListChecks} titel="Aufgabe Schritt für Schritt">
        <ol className="list-decimal pl-6 text-sm text-text-main/85 space-y-1.5">
          {u.schritte.map((s, i) => <li key={i}>{s}</li>)}
        </ol>
      </Abschnitt>

      <Abschnitt icon={MessageSquareQuote} titel="Prompt-Vorlagen zum Kopieren">
        <p className="text-xs text-text-main/70">Platzhalter in eckigen Klammern ersetzen Sie durch eigene, fiktive Angaben.</p>
        <div className="space-y-3">
          {u.prompts.map((p, i) => <KopierFeld key={i} vorlage={p} />)}
        </div>
      </Abschnitt>

      <div className="grid gap-4 md:grid-cols-2">
        <Abschnitt icon={Target} titel="Erwartungshorizont">
          <ul className="list-disc pl-6 text-sm text-text-main/85 space-y-1.5">
            {u.erwartung.map((e, i) => <li key={i}>{e}</li>)}
          </ul>
        </Abschnitt>
        <Abschnitt icon={MessageSquareQuote} titel="Reflexionsfragen">
          <ul className="list-disc pl-6 text-sm text-text-main/85 space-y-1.5">
            {u.reflexion.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
        </Abschnitt>
      </div>

      <Abschnitt icon={ClipboardCheck} titel="Verifikations-Checkliste">
        <fieldset className="rounded-xl border border-shiraz/25 bg-shiraz/5 p-4">
          <legend className="sr-only">Verifikations-Checkliste zu {u.kurz}</legend>
          <ul className="space-y-2">
            {u.checkliste.map((c, i) => (
              <li key={i}>
                <label className="flex items-start gap-2 text-sm text-text-main cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!erledigt[i]}
                    onChange={e => setErledigt({ ...erledigt, [i]: e.target.checked })}
                    className="mt-1 accent-shiraz"
                  />
                  <span>{c}</span>
                </label>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-text-main/70">
            {Object.values(erledigt).filter(Boolean).length} von {u.checkliste.length} Punkten geprüft (wird nicht gespeichert).
          </p>
        </fieldset>
      </Abschnitt>

      <Abschnitt icon={ArrowRight} titel="Theorie zum Block">
        <div className="flex flex-wrap gap-2">
          {u.theorie.map(t => (
            <button
              key={t.ziel}
              type="button"
              onClick={() => springeZu(setActiveTab, t.ziel)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-shiraz/30 text-shiraz text-xs font-bold hover:bg-shiraz/5 cursor-pointer"
            >
              {t.label} <ArrowRight size={14} aria-hidden="true" />
            </button>
          ))}
        </div>
      </Abschnitt>
    </article>
  );
}

export default function KiUebungen() {
  const [aktiv, setAktiv] = useState<string>(KI_UEBUNGEN[0].id);
  const tabs: ModulTab<string>[] = KI_UEBUNGEN.map((u, i) => ({ id: u.id, label: `${i + 1} · ${u.kurz}` }));
  const uebung = KI_UEBUNGEN.find(u => u.id === aktiv) ?? KI_UEBUNGEN[0];
  const gesamt = KI_UEBUNGEN.reduce((s, u) => s + u.minuten, 0);

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <ClipboardCheck className="text-shiraz" aria-hidden="true" /> Hands-on-Übungen: KI im Bauwesen (Master)
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-3 leading-relaxed space-y-2">
          <p>
            Zu jedem Themenblock der Master-Vorlesung „Grundlagen für den Einsatz von Künstlicher Intelligenz im Bauwesen –
            Möglichkeiten und Grenzen“ gibt es eine Selbstlernübung. Die Übungen sind unbenotet, kommen ohne Programmierung aus
            und dauern zusammen etwa {formatDeGanzzahl(gesamt)} Minuten.
          </p>
        </div>

        <section aria-label="Regeln für alle Übungen" className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">
          <h3 className="font-bold flex items-center gap-2 mb-2">
            <ShieldAlert size={16} aria-hidden="true" /> Bevor Sie beginnen: Werkzeug und Datenschutz
          </h3>
          <ul className="list-disc pl-6 space-y-1.5">
            {KI_UEBUNG_REGELN.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
        </section>

        <div className="mt-6">
          <ModuleTabs label="Übungen nach Themenblock" tabs={tabs} aktiv={uebung.id} onWechsel={setAktiv}>
            <Uebung key={uebung.id} u={uebung} />
          </ModuleTabs>
        </div>
      </div>

      {/* SELBSTTEST zu den sechs Übungen */}
      <ModulTest moduleId="ki_uebungen" />

      <ModuleFooter
        lastReviewed="Oktober 2026 (AP 6.5: Übungen neu erstellt; fachliche Freigabe durch den Autor ausstehend)"
        literatur={[
          'Russell, S.; Norvig, P.: Artificial Intelligence – A Modern Approach. 4. Aufl., Hoboken: Pearson 2021',
        ]}
        regelwerke={[
          { title: 'Verordnung (EU) 2024/1689 (KI-Verordnung), Art. 4 KI-Kompetenz', url: 'https://eur-lex.europa.eu/eli/reg/2024/1689/oj' },
          { title: 'Verordnung (EU) 2016/679 (DSGVO)', url: 'https://eur-lex.europa.eu/eli/reg/2016/679/oj' },
          { title: 'VOB/B § 4 Abs. 3 (Bedenkenanzeige)' },
          { title: 'DIN EN ISO 6946 (Wärmedurchlasswiderstand und Wärmedurchgangskoeffizient)' },
        ]}
        hideFormeln={true}
      />
    </div>
  );
}
