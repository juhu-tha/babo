import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Circle, CircleDashed, Clock, MinusCircle, ExternalLink } from 'lucide-react';
import daten from 'virtual:audit-daten';
import { GUTACHTEN_27_10, notenMittel } from '@/src/data/audit/gutachten';
import { ZULIEFERUNGEN, ZULIEFERUNGEN_STAND } from '@/src/data/audit/zulieferungen';
import { UMSETZUNGSPLAN, UMSETZUNGSPLAN_STAND, PRS_GEMERGT, phasenStand } from '@/src/data/audit/umsetzungsplan';
import { AUDIT_STATUS_TEXT, passtFilter, type AuditStatus, type ZulieferFilter } from '@/src/data/audit/typen';
import { datumDe } from '@/src/data/pruefvermerke';
import { formatDeZahl } from '@/src/utils/numberFormat';

/**
 * Admin-Bereich „Audit“ und die erzeugten Kennzahlen der Reiter „Sprachen & Tools“ / „Tool-Umfang & Code“.
 * Wird von src/modules/Admin.tsx lazy geladen (eigener Chunk, nicht im Einstieg). Statische Daten:
 * src/data/audit/*.ts; Zählungen aus dem Quelltext: scripts/auditDaten.ts (virtual:audit-daten, beim Build erzeugt).
 */
export type AuditAnsicht = 'gutachten' | 'zulieferungen' | 'umsetzungsplan' | 'ffreigabe' | 'pruefliste' | 'kennzahlen' | 'pakete';

const REPO = 'https://github.com/juhu-tha/babo';
const zahl = (n: number, stellen?: number) => formatDeZahl(n, stellen);
const note = (n: number) => formatDeZahl(n, 1);

const STATUS_ICON: Record<AuditStatus, typeof Circle> = {
  erledigt: CheckCircle2, entschieden: CheckCircle2, wartet: Clock, in_arbeit: CircleDashed, offen: Circle, zurueckgestellt: MinusCircle,
};
const STATUS_STIL: Record<AuditStatus, string> = {
  erledigt: 'bg-off-white text-text-main border-home-grau/40',
  entschieden: 'bg-off-white text-text-main border-home-grau/40',
  wartet: 'bg-shiraz/10 text-shiraz border-shiraz/40 font-bold',
  in_arbeit: 'bg-white text-text-main border-dashed border-home-grau/60',
  offen: 'bg-white text-shiraz border-shiraz/40',
  zurueckgestellt: 'bg-off-white text-text-main/80 border-home-grau/30',
};

/** Status immer als Text (mit Symbol), nie nur als Farbe */
export function StatusMarke({ status, text }: { status: AuditStatus; text?: string }) {
  const Icon = STATUS_ICON[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[11px] whitespace-nowrap ${STATUS_STIL[status]}`}>
      <Icon size={12} aria-hidden="true" /> {text ?? AUDIT_STATUS_TEXT[status]}
    </span>
  );
}

function Pfad({ p }: { p: string }) {
  return (
    <a href={`${REPO}/blob/main/${p}`} target="_blank" rel="noopener noreferrer" className="font-mono text-[11px] text-shiraz underline underline-offset-2 break-all">
      {p}<span className="sr-only"> (GitHub, neues Fenster)</span>
    </a>
  );
}

function PrLinks({ prs }: { prs?: readonly number[] }) {
  if (!prs?.length) return null;
  return (
    <span className="inline-flex flex-wrap gap-x-2">
      {prs.map(n => (
        <a key={n} href={`${REPO}/pull/${n}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center min-h-[24px] min-w-[24px] font-mono text-[11px] text-shiraz underline underline-offset-2">
          #{n}<span className="sr-only"> (Pull Request, neues Fenster)</span>
        </a>
      ))}
    </span>
  );
}

const karte = 'bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm space-y-4';
const titel = 'text-base font-bold text-text-main';
const info = 'text-xs text-text-main/80 bg-off-white p-3 rounded-xl border border-home-grau/30 leading-relaxed';
const tabelle = 'w-full text-left text-xs border border-home-grau/20 rounded-lg';
const kopf = 'bg-off-white border-b border-home-grau/20';
const th = 'p-2.5 font-bold align-bottom';
const td = 'p-2.5 align-top';

function TabellenRahmen({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="overflow-x-auto" tabIndex={0} role="region" aria-label={label}>{children}</div>;
}

// ---------------------------------------------------------------- a) Gutachten
function GutachtenAnsicht() {
  const g = GUTACHTEN_27_10;
  const zaehl = (s: AuditStatus) => g.massnahmen.filter(m => m.status === s).length;
  return (
    <div className="space-y-6">
      <section className={karte} aria-labelledby="gutachten-noten">
        <h3 id="gutachten-noten" className={titel}>Gutachten vom {datumDe(g.datum)} – Noten je Kategorie</h3>
        <p className={info}>{g.grundlage}. {g.ziel}. Mittelwert der sechs Kategorien: <strong>{note(notenMittel(g))}</strong> (ungewichtet).</p>
        <TabellenRahmen label="Noten je Kategorie">
          <table className={tabelle}>
            <caption className="sr-only">Noten des Gutachtens je Kategorie mit Kurzbegründung</caption>
            <thead className={kopf}><tr><th scope="col" className={th}>Kategorie</th><th scope="col" className={th}>Note</th><th scope="col" className={th}>Kurzbegründung</th></tr></thead>
            <tbody className="divide-y divide-home-grau/15">
              {g.kategorien.map(k => (
                <tr key={k.kategorie}>
                  <th scope="row" className={`${td} font-semibold whitespace-nowrap`}>{k.kategorie}</th>
                  <td className={`${td} font-mono font-bold ${k.note > 1.3 ? 'text-shiraz' : 'text-text-main'}`}>{note(k.note)}{k.note > 1.3 && <span className="sr-only"> (über dem Ziel 1,3)</span>}</td>
                  <td className={`${td} leading-relaxed`}>{k.begruendung}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TabellenRahmen>
      </section>

      <section className={karte} aria-labelledby="gutachten-massnahmen">
        <h3 id="gutachten-massnahmen" className={titel}>Top-10-Maßnahmen (nach Wirkung)</h3>
        <p className="text-xs text-text-main/80">
          {zahl(zaehl('erledigt'))} erledigt · {zahl(zaehl('in_arbeit'))} in Arbeit · {zahl(zaehl('wartet'))} wartet auf Zulieferung/Freigabe · {zahl(zaehl('offen'))} offen.
          Status gepflegt in <Pfad p="src/data/audit/gutachten.ts" />.
        </p>
        <TabellenRahmen label="Top-10-Maßnahmen">
          <table className={tabelle}>
            <caption className="sr-only">Top-10-Maßnahmen mit Wirkung und Status</caption>
            <thead className={kopf}><tr><th scope="col" className={th}>Nr.</th><th scope="col" className={th}>Maßnahme</th><th scope="col" className={th}>Wirkung</th><th scope="col" className={th}>Status</th></tr></thead>
            <tbody className="divide-y divide-home-grau/15">
              {g.massnahmen.map(m => (
                <tr key={m.nr}>
                  <td className={`${td} font-mono`}>{zahl(m.nr)}</td>
                  <td className={td}>{m.titel}{m.hinweis && <span className="block text-text-main/70 mt-0.5">{m.hinweis}</span>}</td>
                  <td className={td}>{m.wirkung ?? '–'}</td>
                  <td className={td}><StatusMarke status={m.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </TabellenRahmen>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------- b) Zulieferungen
const FILTER: readonly { id: ZulieferFilter; label: string }[] = [
  { id: 'alle', label: 'alle' }, { id: 'offen', label: 'offen' }, { id: 'wartet', label: 'wartet auf mich' }, { id: 'erledigt', label: 'erledigt' },
];

function ZulieferungenAnsicht() {
  const [filter, setFilter] = useState<ZulieferFilter>('alle');
  const sichtbar = ZULIEFERUNGEN.filter(z => passtFilter(z.status, filter));
  const anzahl = (f: ZulieferFilter) => ZULIEFERUNGEN.filter(z => passtFilter(z.status, f)).length;
  return (
    <section className={karte} aria-labelledby="zulieferungen-titel">
      <h3 id="zulieferungen-titel" className={titel}>Zulieferungen und Entscheidungen (Stand {datumDe(ZULIEFERUNGEN_STAND)})</h3>
      <p className={info}>
        „wartet auf mich“ = Zulieferung, Entscheidung oder Durchsicht ausstehend; „offen“ = noch nicht begonnen, in Arbeit oder
        zurückgestellt; „erledigt“ = erledigt oder entschieden. Gepflegt in <Pfad p="src/data/audit/zulieferungen.ts" />.
      </p>
      <fieldset className="flex flex-wrap items-center gap-2">
        <legend className="text-xs font-bold text-text-main mb-1 w-full">Filter</legend>
        {FILTER.map(f => (
          <label key={f.id} className={`cursor-pointer px-3 py-2 min-h-[36px] rounded-xl text-xs font-bold border inline-flex items-center gap-1.5 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-shiraz ${filter === f.id ? 'bg-shiraz text-white border-shiraz' : 'bg-white text-text-main border-home-grau/30'}`}>
            <input type="radio" name="zuliefer-filter" value={f.id} checked={filter === f.id} onChange={() => setFilter(f.id)} className="sr-only" />
            {f.label} ({zahl(anzahl(f.id))})
          </label>
        ))}
      </fieldset>
      <p className="text-xs text-text-main/70" aria-live="polite">{zahl(sichtbar.length)} von {zahl(ZULIEFERUNGEN.length)} Punkten angezeigt.</p>
      <TabellenRahmen label="Zulieferungen">
        <table className={tabelle}>
          <caption className="sr-only">Zulieferungen Teil B mit Stand und Status</caption>
          <thead className={kopf}><tr><th scope="col" className={th}>Nr.</th><th scope="col" className={th}>Gegenstand</th><th scope="col" className={th}>Entscheidung/Stand</th><th scope="col" className={th}>Status</th><th scope="col" className={th}>Verweise</th></tr></thead>
          <tbody className="divide-y divide-home-grau/15">
            {sichtbar.map((z, i) => (
              <tr key={`${z.nr}-${i}`}>
                <td className={`${td} font-mono whitespace-nowrap`}>{z.nr}</td>
                <td className={td}>{z.gegenstand}</td>
                <td className={td}>{z.stand}</td>
                <td className={td}><StatusMarke status={z.status} text={z.statusText} /></td>
                <td className={`${td} space-y-1`}>
                  <PrLinks prs={z.prs} />
                  {z.dateien?.map(d => <span key={d} className="block"><Pfad p={d} /></span>)}
                  {!z.prs?.length && !z.dateien?.length && '–'}
                </td>
              </tr>
            ))}
            {sichtbar.length === 0 && <tr><td colSpan={5} className="p-4 text-center text-text-main/70">Keine Punkte für diesen Filter.</td></tr>}
          </tbody>
        </table>
      </TabellenRahmen>
    </section>
  );
}

// ---------------------------------------------------------------- c) Umsetzungsplan
function UmsetzungsplanAnsicht() {
  const gesamt = UMSETZUNGSPLAN.map(phasenStand).reduce((s, p) => ({ g: s.g + p.gesamt, e: s.e + p.erledigt }), { g: 0, e: 0 });
  return (
    <div className="space-y-4">
      <p className={info}>
        Umsetzungsplan Phasen 0–6, Stand {datumDe(UMSETZUNGSPLAN_STAND)}; zusammengeführte Pull Requests {PRS_GEMERGT}.
        Insgesamt {zahl(gesamt.e)} von {zahl(gesamt.g)} erfassten Arbeitspaketen erledigt. Der Plan selbst liegt nicht im Repository;
        erfasst sind die im Audit-Stand genannten und im Code mit „AP x.y“ belegten Arbeitspakete. Gepflegt in <Pfad p="src/data/audit/umsetzungsplan.ts" />.
      </p>
      {UMSETZUNGSPLAN.map(p => {
        const s = phasenStand(p);
        const pct = Math.round(s.anteil * 100);
        const text = `${zahl(s.erledigt)} von ${zahl(s.gesamt)} erledigt (${zahl(pct)} %) · ${zahl(s.wartet)} wartet auf Zulieferung/Freigabe · ${zahl(s.offen)} offen/in Arbeit`;
        return (
          <section key={p.nr} className={karte} aria-labelledby={`phase-${String(p.nr)}`}>
            <h3 id={`phase-${String(p.nr)}`} className={titel}>Phase {zahl(p.nr)}: {p.titel}</h3>
            <div>
              <div className="h-3 w-full rounded-full bg-off-white border border-home-grau/30 overflow-hidden"
                role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-valuetext={text} aria-label={`Fortschritt Phase ${zahl(p.nr)}`}>
                <div className="h-full bg-shiraz" style={{ width: `${pct}%` }} />
              </div>
              <p className="text-xs text-text-main/80 mt-1.5">{text}</p>
            </div>
            <ul className="grid gap-1.5 sm:grid-cols-2">
              {p.aps.map(a => (
                <li key={a.ap} className="flex flex-wrap items-start gap-2 text-xs p-2 rounded-lg border border-home-grau/20 bg-off-white">
                  <span className="font-mono font-bold">AP {a.ap}</span>
                  <span className="flex-1 min-w-[10rem]">{a.titel}{a.hinweis && <span className="block text-text-main/70">{a.hinweis}</span>}</span>
                  <StatusMarke status={a.status} />
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------- d) Prüfpunkte F-Freigabe
function FFreigabeAnsicht() {
  const f = daten.fFreigabe;
  return (
    <div className="space-y-4">
      <section className={karte} aria-labelledby="ffreigabe-titel">
        <h3 id="ffreigabe-titel" className={titel}>Prüfpunkte „vorläufig, Normprüfung ausstehend“</h3>
        <p className={info}>
          {zahl(f.gesamt)} Fundstellen in {zahl(f.dateien)} Dateien, beim Build am {datumDe(daten.erzeugtAm)} aus dem Quelltext erzeugt
          (Suche nach „F-Freigabe“ in {f.ordner.map((o, i) => <React.Fragment key={o}>{i > 0 && ', '}<code className="font-mono">{o}</code></React.Fragment>)};
          Skript <Pfad p="scripts/auditDaten.ts" />). Belege und offene Normstellen: <Pfad p="docs/normwerte-belege.md" /> und{' '}
          <Pfad p="docs/entwuerfe/literatur-fehlliste.md" />. Die Liste ist nicht von Hand zu pflegen: Ein Wert verschwindet, sobald die
          Kennzeichnung im Code nach der Freigabe entfernt wird.
        </p>
        <ul className="flex flex-wrap gap-2 text-xs">
          {f.gruppen.map(g => <li key={g.fachgebiet} className="px-2.5 py-1 rounded-lg border border-home-grau/30 bg-off-white">{g.fachgebiet}: <strong>{zahl(g.eintraege.length)}</strong></li>)}
        </ul>
      </section>
      {f.gruppen.map(g => (
        <details key={g.fachgebiet} className="bg-white rounded-xl border border-home-grau/30 shadow-sm">
          <summary className="cursor-pointer p-4 text-sm font-bold text-text-main">{g.fachgebiet} ({zahl(g.eintraege.length)})</summary>
          <div className="px-4 pb-4">
            <TabellenRahmen label={`Prüfpunkte ${g.fachgebiet}`}>
              <table className={tabelle}>
                <thead className={kopf}><tr><th scope="col" className={th}>Datei und Zeile</th><th scope="col" className={th}>Kontext</th></tr></thead>
                <tbody className="divide-y divide-home-grau/15">
                  {g.eintraege.map(e => (
                    <tr key={`${e.datei}:${e.zeile}`}>
                      <td className={`${td} whitespace-nowrap`}>
                        <a href={`${REPO}/blob/main/${e.datei}#L${e.zeile}`} target="_blank" rel="noopener noreferrer" className="font-mono text-[11px] text-shiraz underline underline-offset-2">
                          {e.datei}:{String(e.zeile)}<span className="sr-only"> (GitHub, neues Fenster)</span>
                        </a>
                      </td>
                      <td className={`${td} leading-relaxed break-words`}>{e.kontext}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TabellenRahmen>
          </div>
        </details>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------- e) Prüflisten
function PrueflistenAnsicht() {
  const q = daten.quiz;
  const summe = q.cluster.reduce((s, c) => ({ a: s.a + c.auffaellig, g: s.g + c.gesamt, v: s.v + c.verified }), { a: 0, g: 0, v: 0 });
  return (
    <section className={karte} aria-labelledby="pruefliste-titel">
      <h3 id="pruefliste-titel" className={titel}>Quiz-Prüflisten je Cluster</h3>
      <p className={info}>
        Zahlen beim Build am {datumDe(daten.erzeugtAm)} aus <code className="font-mono">src/data/quiz.json</code> ermittelt:
        „auffällig“ = Vorprüfung „korrigiert“ oder „fraglich“, offener Prüfhinweis in <Pfad p="docs/quiz-pruefhinweise.md" /> oder
        neu seit 26.10.2026 ohne Freigabe;
        „verified“ = fachlich freigegeben. Die Spalte „Prüfliste“ zeigt die Kopfzahlen der Datei; weichen sie ab, ist die Liste
        mit <code className="font-mono">npx tsx scripts/pruefliste.ts</code> neu zu erzeugen. Freigabe im Reiter „Fragenfreigabe“.
      </p>
      <TabellenRahmen label="Prüflisten je Cluster">
        <table className={tabelle}>
          <caption className="sr-only">Quizfragen je Cluster: auffällig, gesamt, verified und Stand der Prüfliste</caption>
          <thead className={kopf}>
            <tr><th scope="col" className={th}>Cluster</th><th scope="col" className={th}>auffällig</th><th scope="col" className={th}>gesamt</th><th scope="col" className={th}>verified</th><th scope="col" className={th}>Prüfliste (Datei, Stand)</th></tr>
          </thead>
          <tbody className="divide-y divide-home-grau/15">
            {q.cluster.map(c => {
              const veraltet = c.liste && (c.liste.gesamt !== c.gesamt || c.liste.auffaellig !== c.auffaellig);
              return (
                <tr key={c.cluster}>
                  <th scope="row" className={`${td} font-semibold`}>{c.cluster} · {c.name}</th>
                  <td className={`${td} font-mono`}>{zahl(c.auffaellig)}<span className="block text-text-main/70 font-sans">{zahl(c.korrigiert)} korrigiert, {zahl(c.fraglich)} fraglich, {zahl(c.mitPruefhinweis)} mit Prüfhinweis</span></td>
                  <td className={`${td} font-mono`}>{zahl(c.gesamt)}</td>
                  <td className={`${td} font-mono`}>{zahl(c.verified)}</td>
                  <td className={td}>
                    {c.datei ? <Pfad p={c.datei} /> : <span className="text-shiraz font-bold">keine Prüfliste</span>}
                    {c.liste && (
                      <span className={`block mt-0.5 ${veraltet ? 'text-shiraz font-bold' : 'text-text-main/70'}`}>
                        {c.liste.stand}: {zahl(c.liste.auffaellig)} auffällig / {zahl(c.liste.gesamt)} gesamt
                        {veraltet ? ` – veraltet (${zahl(c.gesamt - c.liste.gesamt)} Fragen neu)` : ' – aktuell'}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="border-t border-home-grau/30 font-bold">
            <tr><th scope="row" className={td}>Summe</th><td className={`${td} font-mono`}>{zahl(summe.a)}</td><td className={`${td} font-mono`}>{zahl(summe.g)}</td><td className={`${td} font-mono`}>{zahl(summe.v)}</td><td className={td}>{q.ohneCluster ? `${zahl(q.ohneCluster)} Fragen ohne Cluster` : 'alle Fragen einem Cluster zugeordnet'}</td></tr>
          </tfoot>
        </table>
      </TabellenRahmen>
    </section>
  );
}

// ---------------------------------------------------------------- Tool-Umfang & Code (erzeugte Kennzahlen)
function KennzahlenAnsicht() {
  const k = daten.kennzahlen;
  const [gemessen, setGemessen] = useState<{ einstiegGzipKB: number; gemessenAm: string } | null>(null);
  useEffect(() => {
    let aktiv = true;
    fetch('/audit-bundle.json').then(r => (r.ok ? r.json() : null)).then(j => {
      if (aktiv && j && typeof j.einstiegGzipKB === 'number') setGemessen(j);
    }).catch(() => { /* Dev-Server oder ohne Build: Angabe aus docs/metriken.json */ });
    return () => { aktiv = false; };
  }, []);
  const kacheln: readonly { wert: string; text: string }[] = [
    { wert: zahl(k.module), text: 'Module in der Registry' },
    { wert: zahl(k.fachmodule), text: `Fachmodule (${zahl(k.fachmoduleOffen)} Prüfung ausstehend)` },
    { wert: zahl(k.rechenkerne), text: 'Rechenkerne (src/calc)' },
    { wert: zahl(k.testdateien), text: 'Testdateien (tests/*.test.ts)' },
    { wert: zahl(k.quizfragen), text: `Quizfragen (${zahl(k.quizVerified)} freigegeben)` },
    { wert: zahl(k.inhaltsdateien), text: 'Fachtext-Dateien (content/*.json)' },
    { wert: zahl(k.quelldateien), text: 'Quelldateien' },
    { wert: zahl(k.zeilenGesamt), text: 'Zeilen gesamt' },
  ];
  const b = k.bundle;
  return (
    <div className="space-y-4">
      <p className={info}>Kennzahlen beim Build am {datumDe(daten.erzeugtAm)} aus dem Quelltext ermittelt (<Pfad p="scripts/auditDaten.ts" />) – nicht von Hand pflegen.</p>
      <ul className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {kacheln.map(x => (
          <li key={x.text} className="p-3 bg-off-white rounded-xl border border-home-grau/20 text-center">
            <span className="text-xl font-extrabold text-shiraz font-mono block">{x.wert}</span>
            <span className="text-xs font-semibold text-text-main/80 mt-1 block">{x.text}</span>
          </li>
        ))}
      </ul>
      <div className="grid gap-4 md:grid-cols-2">
        <section className={karte} aria-labelledby="kennzahlen-bereiche">
          <h3 id="kennzahlen-bereiche" className={titel}>Verteilung der Codebasis</h3>
          <TabellenRahmen label="Zeilen je Bereich">
            <table className={tabelle}>
              <thead className={kopf}><tr><th scope="col" className={th}>Bereich</th><th scope="col" className={`${th} text-right`}>Dateien</th><th scope="col" className={`${th} text-right`}>Zeilen</th></tr></thead>
              <tbody className="divide-y divide-home-grau/15">
                {k.bereiche.map(x => (
                  <tr key={x.bereich}>
                    <th scope="row" className={`${td} font-semibold`}>{x.bereich}<span className="block font-mono font-normal text-[11px] text-text-main/70">{x.ordner}</span></th>
                    <td className={`${td} text-right font-mono`}>{zahl(x.dateien)}</td>
                    <td className={`${td} text-right font-mono`}>{zahl(x.zeilen)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TabellenRahmen>
        </section>
        <section className={karte} aria-labelledby="kennzahlen-bundle">
          <h3 id="kennzahlen-bundle" className={titel}>Bundle (Einstieg, gzip)</h3>
          <dl className="text-xs space-y-2">
            <div className="flex justify-between gap-3"><dt className="font-semibold">dieser Build</dt><dd className="font-mono">{gemessen ? `${zahl(gemessen.einstiegGzipKB, 1)} kB (${datumDe(gemessen.gemessenAm)})` : 'nicht verfügbar (Dev-Server)'}</dd></div>
            <div className="flex justify-between gap-3"><dt className="font-semibold">Baseline docs/metriken.json</dt><dd className="font-mono">{b.einstiegGzipKB !== null ? `${zahl(b.einstiegGzipKB, 1)} kB${b.stand ? ` (${datumDe(b.stand)})` : ''}` : '–'}</dd></div>
            <div className="flex justify-between gap-3"><dt className="font-semibold">Budget (check-bundle.mjs)</dt><dd className="font-mono">{b.grenzeKB !== null ? `≤ ${zahl(b.grenzeKB)} kB` : '–'}</dd></div>
          </dl>
          <p className="text-xs text-text-main/70">Prüfung: <code className="font-mono">node scripts/qa/check-bundle.mjs</code> nach dem Build.</p>
        </section>
      </div>
    </div>
  );
}

function PaketeAnsicht() {
  return (
    <section className={karte} aria-labelledby="pakete-titel">
      <h3 id="pakete-titel" className={titel}>Kernpakete laut package.json</h3>
      <p className="text-xs text-text-main/80">Versionen beim Build am {datumDe(daten.erzeugtAm)} aus <code className="font-mono">package.json</code> gelesen (Mindestversion des Bereichs).</p>
      <ul className="grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 text-xs">
        {daten.pakete.map(p => (
          <li key={p.name} className="p-2 rounded-lg border border-home-grau/20 bg-off-white flex justify-between gap-2">
            <span className="font-mono font-semibold break-all">{p.name}</span><span className="font-mono">{p.version}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function AuditBereich({ ansicht }: { ansicht: AuditAnsicht }) {
  const inhalt = useMemo(() => {
    switch (ansicht) {
      case 'gutachten': return <GutachtenAnsicht />;
      case 'zulieferungen': return <ZulieferungenAnsicht />;
      case 'umsetzungsplan': return <UmsetzungsplanAnsicht />;
      case 'ffreigabe': return <FFreigabeAnsicht />;
      case 'pruefliste': return <PrueflistenAnsicht />;
      case 'kennzahlen': return <KennzahlenAnsicht />;
      case 'pakete': return <PaketeAnsicht />;
    }
  }, [ansicht]);
  return <div className="animate-in fade-in duration-300">{inhalt}</div>;
}
