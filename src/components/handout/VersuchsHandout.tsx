import React, { useEffect, useMemo, useState } from 'react';
import { Target, ShieldAlert, ListOrdered, ClipboardList, Calculator, HelpCircle, Download, Printer, Plus, Minus, RotateCcw, Eraser, Wrench, Clock, Users, Info } from 'lucide-react';
import { ModuleTabs, type ModulTab } from '@/src/components/ui/ModuleTabs';
import { Querverweis } from '@/src/components/ui/Querverweis';
import { exportToCSV, openPrintableReport } from '@/src/utils/labExportUtils';
import { dateiname, handoutHtml, istGleich, kopie, ladeProtokoll, leeresProtokoll, protokollCsv, speichereProtokoll } from '@/src/utils/handoutExport';
import { LABOR_ANPASSEN, type HandoutErgebnis, type HandoutPosten, type ProtokollStand, type VersuchsHandoutDaten } from './handoutTypen';
import { ErgebnisAnsage } from '@/src/components/ui/ErgebnisAnsage';

/**
 * Wiederverwendbares Versuchs-Handout (AP 6.4): Reiter Ziel & Ausstattung, Sicherheit, Ablauf, Messprotokoll,
 * Auswertung, Nachbereitung. Das Protokoll wird nur in diesem Browser gespeichert (bb_labor_protokolle).
 * Die Auswertung rechnet das Modul selbst aus dem Protokollstand (Rechenkern in src/calc).
 */
export interface AuswertungsAnsicht {
  inhalt: React.ReactNode;
  /** Kennwerte für CSV-Export und Druck */
  ergebnisse: HandoutErgebnis[];
  /**
   * Kurzzeile für Screenreader (WCAG 4.1.3, Kurzzeilen 04.11.2026): Hauptergebnis aus dem Rechenkern mit Zahl, Einheit
   * und ggf. Klasse, „–“ bei ungültigem Protokoll. Wird bei jeder Protokolländerung angesagt (auch im Reiter Messprotokoll).
   */
  kurzzeile: string;
}

interface Props {
  daten: VersuchsHandoutDaten;
  auswertung: (stand: ProtokollStand) => AuswertungsAnsicht;
}

type Reiter = 'ziel' | 'sicherheit' | 'ablauf' | 'protokoll' | 'auswertung' | 'nachbereitung';

const REITER: readonly ModulTab<Reiter>[] = [
  { id: 'ziel', label: 'Ziel & Ausstattung', icon: Target },
  { id: 'sicherheit', label: 'Sicherheit', icon: ShieldAlert },
  { id: 'ablauf', label: 'Ablauf', icon: ListOrdered },
  { id: 'protokoll', label: 'Messprotokoll', icon: ClipboardList },
  { id: 'auswertung', label: 'Auswertung', icon: Calculator },
  { id: 'nachbereitung', label: 'Fehlerquellen & Fragen', icon: HelpCircle },
];

const th = 'p-2.5 text-left text-xs font-bold text-text-main border-b border-home-grau/30 bg-off-white';
const td = 'p-2.5 text-xs text-text-main/85 border-b border-home-grau/15 align-top';
const knopf = 'inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-home-grau/40 bg-white text-xs font-bold text-text-main hover:bg-off-white focus:outline-none focus-visible:ring-2 focus-visible:ring-shiraz cursor-pointer';
const feldKlasse = 'w-full min-w-[5.5rem] p-1.5 border border-home-grau/50 rounded-lg bg-white text-sm font-mono focus:outline-none focus:border-shiraz';

export function AnpassenMarke() {
  return <span className="ml-1.5 inline-block text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 align-middle">{LABOR_ANPASSEN}</span>;
}

function PostenListe({ titel, posten }: { titel: string; posten: readonly HandoutPosten[] }) {
  return (
    <section className="p-4 rounded-xl border border-home-grau/30 bg-white">
      <h3 className="text-sm font-bold text-text-main mb-2">{titel}</h3>
      <ul className="list-disc pl-5 space-y-1.5 text-sm text-text-main/85">
        {posten.map(p => (
          <li key={p.name}>
            {p.name}{p.hinweis && <span className="text-text-main/65"> – {p.hinweis}</span>}{p.laborAnpassen && <AnpassenMarke />}
          </li>
        ))}
      </ul>
    </section>
  );
}

const spaltenText = (label: string, einheit?: string) => (einheit ? `${label} in ${einheit}` : label);

export function VersuchsHandout({ daten, auswertung }: Props) {
  const [reiter, setReiter] = useState<Reiter>('ziel');
  const [stand, setStand] = useState<ProtokollStand>(() => ladeProtokoll(daten) ?? kopie(daten.protokoll.beispiel));
  const [leerenFragen, setLeerenFragen] = useState(false);

  const lehrwerte = istGleich(stand, daten.protokoll.beispiel);
  useEffect(() => { speichereProtokoll(daten.id, lehrwerte ? null : stand); }, [daten.id, stand, lehrwerte]);

  const ansicht = useMemo(() => auswertung(stand), [auswertung, stand]);

  const setzeKopf = (id: string, wert: string) => setStand(s => ({ ...s, kopf: { ...s.kopf, [id]: wert } }));
  const setzeZelle = (i: number, id: string, wert: string) =>
    setStand(s => ({ ...s, zeilen: s.zeilen.map((z, j) => (j === i ? { ...z, [id]: wert } : z)) }));
  const neueZeile = () => setStand(s => ({ ...s, zeilen: [...s.zeilen, Object.fromEntries(daten.protokoll.spalten.map(sp => [sp.id, '']))] }));
  const zeileWeg = () => setStand(s => (s.zeilen.length > 1 ? { ...s, zeilen: s.zeilen.slice(0, -1) } : s));

  const csv = () => {
    const { headers, rows } = protokollCsv(daten, stand, ansicht.ergebnisse);
    exportToCSV(dateiname(daten), headers, rows);
  };
  const drucken = (leer: boolean) => openPrintableReport(handoutHtml(daten, leer ? null : stand, leer ? [] : ansicht.ergebnisse), daten.titel);

  return (
    <ModuleTabs label={`Abschnitte des Versuchs-Handouts ${daten.titel}`} tabs={REITER} aktiv={reiter} onWechsel={setReiter}>
      <div className="pt-5 animate-in fade-in duration-300">
        <ErgebnisAnsage text={`${daten.titel}: ${ansicht.kurzzeile}`} />
        {reiter === 'ziel' && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-3 text-xs text-text-main/80">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-off-white border border-home-grau/30"><Clock size={14} aria-hidden="true" /> Dauer: {daten.dauer}</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-off-white border border-home-grau/30"><Users size={14} aria-hidden="true" /> {daten.gruppe}</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-off-white border border-home-grau/30"><Wrench size={14} aria-hidden="true" /> {daten.normen.join(' · ')}</span>
            </div>
            <section className="p-4 rounded-xl border border-shiraz/25 bg-shiraz/5">
              <h3 className="text-sm font-bold text-text-main mb-2">Ziel des Versuchs</h3>
              <ul className="list-disc pl-5 space-y-1.5 text-sm text-text-main/85">{daten.ziel.map(z => <li key={z}>{z}</li>)}</ul>
            </section>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PostenListe titel="Geräte" posten={daten.geraete} />
              <PostenListe titel="Material" posten={daten.material} />
            </div>
            <p className="text-xs text-text-main/65 flex items-start gap-1.5">
              <Info size={14} className="shrink-0 mt-0.5" aria-hidden="true" />
              Lehrhandout mit den Kernpunkten der Regelwerke; maßgebend ist der Normtext. Markierte Angaben sind {LABOR_ANPASSEN}.
            </p>
          </div>
        )}

        {reiter === 'sicherheit' && (
          <div className="flex flex-col gap-4">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[520px]">
                <caption className="text-left text-sm font-bold text-text-main pb-2">Gefährdungen und Schutzmaßnahmen</caption>
                <thead><tr><th scope="col" className={th}>Gefährdung</th><th scope="col" className={th}>Maßnahme</th></tr></thead>
                <tbody>{daten.sicherheit.map(s => <tr key={s.gefahr}><td className={td}><strong>{s.gefahr}</strong></td><td className={td}>{s.massnahme}</td></tr>)}</tbody>
              </table>
            </div>
            <Querverweis ziel="labor_sicherheit" titel="Laborordnung und Unterweisung" linkText="Zum Modul Baustofflabor">
              <p>Vor dem ersten Versuch ist die Sicherheitsunterweisung des Labors verbindlich. Betriebsanweisungen und Sicherheitsdatenblätter der verwendeten Stoffe gehen diesem Handout vor.</p>
            </Querverweis>
          </div>
        )}

        {reiter === 'ablauf' && (
          <ol className="flex flex-col gap-3">
            {daten.ablauf.map((a, i) => (
              <li key={a.titel} className="p-4 rounded-xl border border-home-grau/30 bg-white flex gap-3">
                <span className="shrink-0 w-7 h-7 rounded-full bg-shiraz text-white text-xs font-bold flex items-center justify-center" aria-hidden="true">{i + 1}</span>
                <div className="text-sm text-text-main/85 leading-relaxed">
                  <h3 className="font-bold text-text-main">{a.titel}{a.dauer && <span className="font-normal text-text-main/60"> ({a.dauer})</span>}{a.laborAnpassen && <AnpassenMarke />}</h3>
                  <p>{a.text}</p>
                </div>
              </li>
            ))}
          </ol>
        )}

        {reiter === 'protokoll' && (
          <div className="flex flex-col gap-4">
            {lehrwerte && (
              <p className="p-3 rounded-xl border border-amber-300/60 bg-amber-50 text-xs text-text-main/85">
                <strong>Lehrwerte:</strong> Das Protokoll enthält fiktive Beispielwerte. Überschreiben Sie sie mit Ihren Messwerten oder leeren Sie das Protokoll.
              </p>
            )}
            {daten.protokoll.hinweis && <p className="text-sm text-text-main/80 leading-relaxed">{daten.protokoll.hinweis}</p>}
            <fieldset className="p-4 rounded-xl border border-home-grau/30 bg-off-white">
              <legend className="px-1 text-xs font-bold text-text-main uppercase tracking-wider">Kopfdaten</legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {daten.protokoll.kopf.map(k => (
                  <label key={k.id} className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-text-main">{spaltenText(k.label, k.einheit)}{k.laborAnpassen && <AnpassenMarke />}</span>
                    {k.typ === 'auswahl' ? (
                      <select value={stand.kopf[k.id] ?? ''} onChange={e => setzeKopf(k.id, e.target.value)} className="p-2 border border-home-grau/50 rounded-lg bg-white text-sm focus:outline-none focus:border-shiraz">
                        {k.optionen?.map(o => <option key={o.wert} value={o.wert}>{o.label}</option>)}
                      </select>
                    ) : (
                      <input
                        type="text"
                        inputMode={k.typ === 'zahl' ? 'decimal' : undefined}
                        value={stand.kopf[k.id] ?? ''}
                        onChange={e => setzeKopf(k.id, e.target.value)}
                        className={feldKlasse}
                      />
                    )}
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <caption className="text-left text-sm font-bold text-text-main pb-2">{daten.protokoll.titel}</caption>
                <thead>
                  <tr>
                    <th scope="col" className={th}>Nr.</th>
                    {daten.protokoll.spalten.map(s => (
                      <th key={s.id} scope="col" className={th}>{s.label}{s.einheit && <span className="block font-normal text-text-main/60">in {s.einheit}</span>}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {stand.zeilen.map((z, i) => (
                    <tr key={i}>
                      <th scope="row" className={`${td} font-bold`}>{i + 1}</th>
                      {daten.protokoll.spalten.map(s => (
                        <td key={s.id} className={td}>
                          <input
                            type="text"
                            inputMode={s.typ === 'zahl' ? 'decimal' : undefined}
                            aria-label={`${spaltenText(s.label, s.einheit)}, Zeile ${i + 1}`}
                            value={z[s.id] ?? ''}
                            onChange={e => setzeZelle(i, s.id, e.target.value)}
                            className={feldKlasse}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Protokoll bearbeiten und exportieren">
              <button type="button" className={knopf} onClick={neueZeile}><Plus size={14} aria-hidden="true" /> Zeile hinzufügen</button>
              <button type="button" className={knopf} onClick={zeileWeg} disabled={stand.zeilen.length <= 1}><Minus size={14} aria-hidden="true" /> Letzte Zeile entfernen</button>
              <button type="button" className={knopf} onClick={() => setStand(kopie(daten.protokoll.beispiel))}><RotateCcw size={14} aria-hidden="true" /> Lehrwerte laden</button>
              {!leerenFragen ? (
                <button type="button" className={knopf} onClick={() => setLeerenFragen(true)}><Eraser size={14} aria-hidden="true" /> Protokoll leeren</button>
              ) : (
                <span className="inline-flex items-center gap-2 text-xs font-bold text-text-main" role="group" aria-label="Leeren bestätigen">
                  Alle Einträge löschen?
                  <button type="button" className={`${knopf} border-rose-300`} onClick={() => { setStand(leeresProtokoll(daten)); setLeerenFragen(false); }}>Ja, leeren</button>
                  <button type="button" className={knopf} onClick={() => setLeerenFragen(false)}>Abbrechen</button>
                </span>
              )}
              <span className="grow" />
              <button type="button" className={knopf} onClick={csv}><Download size={14} aria-hidden="true" /> CSV exportieren</button>
              <button type="button" className={knopf} onClick={() => drucken(false)}><Printer size={14} aria-hidden="true" /> Protokoll drucken / PDF</button>
              <button type="button" className={knopf} onClick={() => drucken(true)}><Printer size={14} aria-hidden="true" /> Leeres Handout drucken</button>
            </div>
            <p className="text-[11px] text-text-main/60">
              Die Einträge bleiben nur in diesem Browser gespeichert und werden nicht übertragen. Dezimalkomma oder -punkt sind möglich. Für ein PDF im Druckdialog „Als PDF speichern“ wählen.
            </p>
          </div>
        )}

        {reiter === 'auswertung' && (
          <div className="flex flex-col gap-4">
            {lehrwerte && <p className="text-xs text-text-main/65">Auswertung der Lehrwerte – mit eigenen Werten im Reiter „Messprotokoll“ rechnet sie automatisch neu.</p>}
            {ansicht.inhalt}
          </div>
        )}

        {reiter === 'nachbereitung' && (
          <div className="flex flex-col gap-6">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[620px]">
                <caption className="text-left text-sm font-bold text-text-main pb-2">Typische Fehlerquellen</caption>
                <thead><tr><th scope="col" className={th}>Fehlerquelle</th><th scope="col" className={th}>Wirkung auf das Ergebnis</th><th scope="col" className={th}>Abhilfe</th></tr></thead>
                <tbody>{daten.fehlerquellen.map(f => <tr key={f.quelle}><td className={td}><strong>{f.quelle}</strong></td><td className={td}>{f.wirkung}</td><td className={td}>{f.abhilfe}</td></tr>)}</tbody>
              </table>
            </div>
            <section className="p-4 rounded-xl border border-home-grau/30 bg-white">
              <h3 className="text-sm font-bold text-text-main mb-2">Fragen zur Nachbereitung</h3>
              <ol className="list-decimal pl-5 space-y-2 text-sm text-text-main/85">{daten.fragen.map(f => <li key={f}>{f}</li>)}</ol>
            </section>
          </div>
        )}
      </div>
    </ModuleTabs>
  );
}

/** Kennwert-Kachel für die Auswertung */
export function Kennwert({ label, wert, einheit }: { label: string; wert: string; einheit?: string }) {
  return (
    <div className="p-3 rounded-lg border border-home-grau/30 bg-off-white">
      <div className="text-[10px] text-text-main/70 font-bold">{label}</div>
      <div className="font-mono font-bold text-text-main text-sm">{wert}{einheit && <span className="text-[10px] text-text-main/70"> {einheit}</span>}</div>
    </div>
  );
}

export default VersuchsHandout;
