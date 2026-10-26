// Diagramme bei Bedarf (Phase 5, AP 5.5): Ersatz für 'react-chartjs-2' im Browser-Bundle.
// Das Vite-Plugin scripts/bedarfsLaden.ts lenkt Importe von 'react-chartjs-2' aus src/ hierher um;
// die Module bleiben unverändert (Tests unter tsx nutzen weiter die echte Bibliothek).
//  - Chart.js + react-chartjs-2 (~70 kB gzip) werden erst geladen, wenn ein Chunk mit Diagrammen läuft,
//    und blockieren das erste Rendern der Modulseite nicht.
//  - Gezeichnet werden Diagramme erst, wenn sie in die Nähe des Bildausschnitts kommen (IntersectionObserver),
//    jedes in einer eigenen Task – Diagramme weiter unten blockieren den Seitenaufbau nicht (TBT).
//    Vor dem Drucken und vor dem PDF-Export (zeichneAlleDiagramme) werden alle sofort und ohne Animation gezeichnet.
//  - Der Platzhalter hat die Größe, die Chart.js dem Diagramm geben wird (Seitenverhältnis bzw. Behältergröße) → kein Layoutsprung.
//  - Jedes Diagramm liegt in der Hülle aus src/lib/diagrammAlternative.tsx (Paket Z8): aria-label mit Kurzbeschreibung,
//    Datentabelle zum Aufklappen, Kurzbeschreibung im Druck. Platzhalter und Leinwand liegen in derselben Fläche.
import React from 'react';
import { flushSync } from 'react-dom';
import type * as ReactChartjs from 'react-chartjs-2';
import { verbinde, istMarke } from './chartJsBedarf';
import { beimDrucken, STUFE } from './druckVorbereitung';
import { DiagrammHuelle, type DiagrammModus } from './diagrammAlternative';

type Bibliothek = typeof ReactChartjs;
type Art = 'Chart' | 'Line' | 'Bar' | 'Radar' | 'Doughnut' | 'PolarArea' | 'Bubble' | 'Pie' | 'Scatter';

let bibliothek: Bibliothek | undefined;
let laden: Promise<Bibliothek> | undefined;
const warten = new Set<() => void>();

export function ladeDiagramme(): Promise<Bibliothek> {
  // diese Datei ist von der Umlenkung ausgenommen → echtes chart.js / react-chartjs-2
  laden ??= Promise.all([import('react-chartjs-2'), import('chart.js')]).then(([rc, cj]) => {
    const echt = cj as unknown as Record<string, unknown>;
    // Achsen und Tooltips im deutschen Zahlformat (Dezimalkomma, Punkt als Tausendertrenner), passend zu formatDeWert;
    // einzelne Diagramme können options.locale weiterhin selbst setzen.
    cj.Chart.defaults.locale = 'de-DE';
    verbinde(eintraege => cj.Chart.register(...eintraege.map(e => (istMarke(e) ? echt[e.__chartBaustein] : e)) as Parameters<typeof cj.Chart.register>));
    bibliothek = rc;
    warten.forEach(f => f());
    warten.clear();
    plane();
    return rc;
  });
  return laden;
}
if (typeof window !== 'undefined') void ladeDiagramme().catch(() => { laden = undefined; });

// ── Zeichnen nach Sichtbarkeit ───────────────────────────────────────────────
// Chart.js erzeugt das Diagramm im Effekt; mehrere auf einmal ergäben eine lange Task. Daher gibt die
// Warteschlange je Task (setTimeout) ein sichtbar gewordenes Diagramm frei.
type Freigabe = false | 'normal' | 'ohneAnimation';
type Auftrag = { sichtbar: boolean; freigeben: (art: Freigabe) => void };
const auftraege = new Set<Auftrag>();
let geplant = false;
function plane() {
  if (geplant || !bibliothek) return;
  const naechster = [...auftraege].find(a => a.sichtbar);
  if (!naechster) return;
  geplant = true;
  window.setTimeout(() => {
    geplant = false;
    const a = [...auftraege].find(x => x.sichtbar);
    if (a) { auftraege.delete(a); a.freigeben('normal'); }
    plane();
  }, 0);
}

function alleFreigeben() {
  flushSync(() => { for (const a of [...auftraege]) { auftraege.delete(a); a.freigeben('ohneAnimation'); } });
}
/** Alle noch nicht gezeichneten Diagramme sofort und ohne Animation zeichnen (Drucken, PDF-Export) */
export async function zeichneAlleDiagramme(): Promise<void> {
  if (!auftraege.size) return;
  await ladeDiagramme().catch(() => {});
  alleFreigeben();
  await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
}
// Drucken ist synchron: nur möglich, wenn Chart.js schon geladen ist (wird beim Laden dieses Chunks angestoßen).
// Nach den Abschnitten (NachErstemBild), deren Diagramme sich erst beim Erscheinen anmelden.
beimDrucken(STUFE.diagramme, () => { if (bibliothek && auftraege.size) alleFreigeben(); }, zeichneAlleDiagramme);

function useFreigabe(ref: React.RefObject<HTMLElement | null>): Freigabe {
  const [frei, setFrei] = React.useState<Freigabe>(false);
  React.useEffect(() => {
    if (frei) return;
    const auftrag: Auftrag = { sichtbar: false, freigeben: setFrei };
    auftraege.add(auftrag);
    const el = ref.current;
    let io: IntersectionObserver | undefined;
    if (el && typeof IntersectionObserver === 'function') {
      io = new IntersectionObserver(e => { auftrag.sichtbar = e.some(x => x.isIntersecting); plane(); }, { rootMargin: '300px 0px' });
      io.observe(el);
    } else {
      auftrag.sichtbar = true;
      plane();
    }
    return () => { io?.disconnect(); auftraege.delete(auftrag); };
  }, [frei, ref]);
  return frei;
}

function useBibliothek(): Bibliothek | undefined {
  const [, neu] = React.useReducer((n: number) => n + 1, 0);
  const gerendert = bibliothek;
  React.useEffect(() => {
    if (bibliothek) { if (!gerendert) neu(); return; }
    warten.add(neu);
    void ladeDiagramme().catch(() => {});
    return () => { warten.delete(neu); };
  }, []);
  return bibliothek;
}

type Props = {
  type?: string; options?: { responsive?: boolean; maintainAspectRatio?: boolean; aspectRatio?: number; animation?: unknown };
  width?: number; height?: number; style?: React.CSSProperties; className?: string; id?: string;
  ref?: React.Ref<unknown>;
  [k: string]: unknown;
};
const QUADRATISCH = new Set(['doughnut', 'pie', 'polarArea', 'radar']);
const TYP: Record<Art, string | undefined> = { Chart: undefined, Line: 'line', Bar: 'bar', Radar: 'radar', Doughnut: 'doughnut', PolarArea: 'polarArea', Bubble: 'bubble', Pie: 'pie', Scatter: 'scatter' };

/** Platzhaltergröße wie Chart.js (responsive: Behälterbreite, Höhe aus Seitenverhältnis oder Behälter) */
function platzhalterStil(art: Art, p: Props): React.CSSProperties {
  const o = p.options ?? {};
  if (o.responsive === false) return { display: 'block', width: p.width ?? 300, height: p.height ?? 150, ...p.style };
  if (o.maintainAspectRatio === false) return { display: 'block', width: '100%', height: '100%', ...p.style };
  const typ = TYP[art] ?? p.type ?? '';
  const verhaeltnis = o.aspectRatio ?? (QUADRATISCH.has(typ) ? 1 : 2);
  return { display: 'block', width: '100%', aspectRatio: String(verhaeltnis), ...p.style };
}

function modus(p: Props): DiagrammModus {
  const o = p.options ?? {};
  return o.responsive === false ? 'fest' : o.maintainAspectRatio === false ? 'fuellen' : 'verhaeltnis';
}

function erzeuge(art: Art) {
  function BedarfsDiagramm(props: Props) {
    const b = useBibliothek();
    const ref = React.useRef<HTMLDivElement>(null);
    const frei = useFreigabe(ref);
    const typ = TYP[art] ?? (typeof props.type === 'string' ? props.type : '');
    return (
      <DiagrammHuelle art={typ} daten={props.data} optionen={props.options} ariaLabel={props['aria-label']} modus={modus(props)}>
        {beschreibung => {
          if (b && frei) {
            const Echt = b[art] as unknown as React.ComponentType<Props>;
            return frei === 'ohneAnimation'
              ? <Echt {...props} aria-label={beschreibung} options={{ ...props.options, animation: false }} />
              : <Echt {...props} aria-label={beschreibung} />;
          }
          return <div ref={ref} role="img" aria-label={beschreibung} aria-busy="true" className={props.className} id={props.id} data-diagramm-platzhalter="" style={platzhalterStil(art, props)} />;
        }}
      </DiagrammHuelle>
    );
  }
  BedarfsDiagramm.displayName = `Bedarf(${art})`;
  return BedarfsDiagramm as unknown as Bibliothek[typeof art];
}

export const Chart = erzeuge('Chart');
export const Line = erzeuge('Line');
export const Bar = erzeuge('Bar');
export const Radar = erzeuge('Radar');
export const Doughnut = erzeuge('Doughnut');
export const PolarArea = erzeuge('PolarArea');
export const Bubble = erzeuge('Bubble');
export const Pie = erzeuge('Pie');
export const Scatter = erzeuge('Scatter');
