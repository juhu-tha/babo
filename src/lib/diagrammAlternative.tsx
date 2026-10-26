// Textalternative für alle Chart.js-Diagramme (Paket Z8, WCAG 1.1.1 Nicht-Text-Inhalte / 1.3.1 Info und Beziehungen).
// src/lib/chartBedarf.tsx legt jedes Diagramm in diese Hülle; die Moduldateien bleiben unverändert:
//  - Leinwand bzw. Platzhalter: role="img" + aria-label mit einer Kurzbeschreibung (Art, Titel, Reihen, Wertebereiche),
//    erzeugt aus data/options; ein aria-label am Diagramm (<Line aria-label="…" />) hat Vorrang.
//  - Schaltfläche „Daten als Tabelle anzeigen“ (Aufklappmuster mit aria-expanded/aria-controls): Datentabelle mit
//    caption und th scope, aus labels/datasets erzeugt; erst beim Öffnen berechnet. Bei Diagrammen mit fester
//    Behälterhöhe (maintainAspectRatio: false) liegt die Tabelle über der Diagrammfläche (kein Layoutsprung).
//  - Druck: Schaltfläche und eingeblendete Tabelle entfallen, stattdessen steht die Kurzbeschreibung unter dem Diagramm;
//    der PDF-Export (src/lib/pdfExport.ts) lässt die Schaltfläche weg (data-pdf-ausblenden).
// Modulspezifische Angaben (eigene Kurzbeschreibung, Einheiten je Achse, Titel, Tabelle abschalten):
//   <DiagrammAngaben zusammenfassung="…" einheiten={{ x: 'mm', y: 'N/mm²' }}><Line … /></DiagrammAngaben>
// (je Diagramm eine Hülle; die Angaben gelten für alle Diagramme darin).
import React from 'react';
import { tabellen, zusammenfassung, type DiagrammAngabenWerte, type DiagrammDaten, type DiagrammOptionen, type Tabelle } from './diagrammDaten';

export type { DiagrammAngabenWerte } from './diagrammDaten';

const Angaben = React.createContext<DiagrammAngabenWerte>({});

/** Modulspezifische Angaben für die Diagramme darin (Kurzbeschreibung, Einheiten, Titel, tabelle: false) */
export function DiagrammAngaben({ children, ...werte }: DiagrammAngabenWerte & { children?: React.ReactNode }) {
  const aussen = React.useContext(Angaben);
  const { zusammenfassung: z, titel, einheiten, tabelle } = werte;
  const wert = React.useMemo(() => ({ ...aussen, zusammenfassung: z, titel, einheiten, tabelle }), [aussen, z, titel, einheiten, tabelle]);
  return <Angaben.Provider value={wert}>{children}</Angaben.Provider>;
}

/** 'fuellen': Diagramm füllt den Behälter (maintainAspectRatio: false); 'verhaeltnis': Höhe aus Seitenverhältnis; 'fest': responsive: false */
export type DiagrammModus = 'fuellen' | 'verhaeltnis' | 'fest';

const HUELLE: Record<DiagrammModus, React.CSSProperties> = {
  fuellen: { position: 'relative', display: 'flex', flexDirection: 'column', width: '100%', height: '100%' },
  verhaeltnis: { position: 'relative', display: 'block', width: '100%' },
  fest: { position: 'relative', display: 'inline-block', maxWidth: '100%' },
};
const FLAECHE: Record<DiagrammModus, React.CSSProperties> = {
  fuellen: { position: 'relative', flex: '1 1 0%', minHeight: 0, width: '100%' },
  verhaeltnis: { position: 'relative', width: '100%' },
  fest: { position: 'relative' },
};

export function DatenTabelle({ tabelle }: { tabelle: Tabelle }) {
  return (
    <table className="w-full border-collapse text-xs text-text-main">
      <caption className="text-left font-bold px-1 py-1">
        {tabelle.beschriftung}
        {tabelle.schritt > 1 && <span className="font-normal"> (Auszug: jede {tabelle.schritt}. von {tabelle.gesamt} Zeilen)</span>}
      </caption>
      <thead>
        <tr>
          <th scope="col" className="text-left font-semibold border-b border-home-grau/40 px-1 py-0.5">{tabelle.kopf}</th>
          {tabelle.spalten.map((s, i) => <th key={i} scope="col" className="text-right font-semibold border-b border-home-grau/40 px-1 py-0.5">{s}</th>)}
        </tr>
      </thead>
      <tbody>
        {tabelle.zeilen.map((z, i) => (
          <tr key={i} className="border-b border-home-grau/20">
            <th scope="row" className="text-left font-normal px-1 py-0.5">{z.kopf}</th>
            {z.zellen.map((c, j) => <td key={j} className="text-right tabular-nums px-1 py-0.5">{c}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

type HuelleProps = {
  /** Chart.js-Typ (line, bar, …) */
  art: string;
  daten: unknown;
  optionen: unknown;
  /** aria-label, das das Modul am Diagramm gesetzt hat (hat Vorrang vor der erzeugten Beschreibung) */
  ariaLabel?: unknown;
  modus: DiagrammModus;
  /** Inhalt der Diagrammfläche (Leinwand oder Platzhalter) mit der Kurzbeschreibung für dessen aria-label */
  children: (beschreibung: string) => React.ReactNode;
};

const alsDaten = (d: unknown): DiagrammDaten | undefined => (typeof d === 'object' && d !== null ? (d as DiagrammDaten) : undefined);
const alsOptionen = (o: unknown): DiagrammOptionen | undefined => (typeof o === 'object' && o !== null ? (o as DiagrammOptionen) : undefined);

export function DiagrammHuelle({ art, daten, optionen, ariaLabel, modus, children }: HuelleProps) {
  const angaben = React.useContext(Angaben);
  const [offen, setOffen] = React.useState(false);
  const id = React.useId();
  const knopf = React.useRef<HTMLButtonElement>(null);
  const d = alsDaten(daten), o = alsOptionen(optionen);
  const eigen = typeof ariaLabel === 'string' && ariaLabel.trim() ? ariaLabel.trim() : undefined;
  const beschreibung = React.useMemo(() => eigen ?? zusammenfassung(art, d, o, angaben), [eigen, art, d, o, angaben]);
  // Liegt das Diagramm schon in einem Element mit role="img" (Beschreibung durch das Modul), darf darin nichts
  // Bedienbares stehen (Kinder von role="img" sind präsentational) – dann keine Schaltfläche.
  const huelle = React.useRef<HTMLDivElement>(null);
  const [inBild, setInBild] = React.useState(false);
  React.useEffect(() => { setInBild(!!huelle.current?.parentElement?.closest('[role="img"]')); }, []);
  const mitTabelle = angaben.tabelle !== false && !inBild;
  const ueberlagert = modus === 'fuellen';

  const tabelle = offen && mitTabelle ? (
    <div
      id={id}
      role="region"
      aria-label="Datentabelle zum Diagramm"
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Escape') { e.stopPropagation(); setOffen(false); knopf.current?.focus(); } }}
      className={`overflow-auto rounded-lg border border-home-grau/30 bg-white text-text-main print:hidden ${ueberlagert ? 'absolute inset-0 z-10 p-1' : 'mt-1 max-h-80'}`}
    >
      {tabellen(art, d, o, angaben).map((t, i) => <DatenTabelle key={i} tabelle={t} />)}
    </div>
  ) : null;

  return (
    <div ref={huelle} data-diagramm="" style={HUELLE[modus]}>
      <div style={FLAECHE[modus]}>
        {children(beschreibung)}
        {ueberlagert && tabelle}
      </div>
      {mitTabelle && (
        <div className="flex justify-end print:hidden" data-pdf-ausblenden="">
          <button
            ref={knopf}
            type="button"
            aria-expanded={offen}
            aria-controls={offen ? id : undefined}
            onClick={() => setOffen(x => !x)}
            className="min-h-6 rounded px-1 text-xs text-text-main underline underline-offset-2 hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-1"
          >
            {offen ? 'Tabelle ausblenden' : 'Daten als Tabelle anzeigen'}
          </button>
        </div>
      )}
      {!ueberlagert && tabelle}
      <p className="hidden print:block text-[10px] leading-snug text-text-main">{beschreibung}</p>
    </div>
  );
}
