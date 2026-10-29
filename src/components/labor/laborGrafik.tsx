// Gemeinsame Bausteine der Grafiken in den virtuellen Versuchen (Modul Labor):
// - useDiagrammFarben: Achsen-, Raster- und Kurvenfarben für Chart.js aus dem Farbschema (hell/dunkel)
// - linAchse: lineare Achse ab 0 mit glatter Obergrenze (schoeneAchse) und kurzem Titel „Größe in Einheit“
// - SVG-Bausteine für Gerätezeichnungen (Pfeilspitzen, Maßlinien) mit den Farben aus .pruefgeraet (src/index.css)
import React from 'react';
import { useTabContext } from '@/src/contexts/TabContext';
import { schoeneAchse } from '@/src/calc/laborVersuch';

export interface DiagrammFarben {
  linie: string;
  flaeche: string;
  ticks: string;
  titel: string;
  gitter: string;
  achse: string;
  hilfslinie: string;
  hilfslinie2: string;
}

const HELL: DiagrammFarben = {
  linie: '#A3113E', flaeche: 'rgba(163, 17, 62, 0.08)', ticks: '#475569', titel: '#1e293b',
  gitter: 'rgba(15, 23, 42, 0.08)', achse: '#94a3b8', hilfslinie: '#334155', hilfslinie2: '#64748b',
};
const DUNKEL: DiagrammFarben = {
  linie: '#ff85aa', flaeche: 'rgba(255, 133, 170, 0.14)', ticks: '#cbd5e1', titel: '#f1f5f9',
  gitter: 'rgba(203, 213, 225, 0.16)', achse: '#64748b', hilfslinie: '#e2e8f0', hilfslinie2: '#94a3b8',
};

export function useDiagrammFarben(): DiagrammFarben {
  const { theme } = useTabContext();
  return theme === 'dark' ? DUNKEL : HELL;
}

/**
 * Schriftfaktor für breite Gerätezeichnungen (viewBox ≈ 440): auf schmalen Bildschirmen (< 640 px) wird die Zeichnung
 * auf etwa 70 % verkleinert – die Schrift wird dann um 1,5 vergrößert, damit sie lesbar bleibt (≈ 11 px).
 */
export function useSchriftFaktor(): number {
  const [schmal, setSchmal] = React.useState(false);
  React.useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(max-width: 639px)');
    const neu = () => setSchmal(mq.matches);
    neu();
    mq.addEventListener?.('change', neu);
    return () => mq.removeEventListener?.('change', neu);
  }, []);
  return schmal ? 1.5 : 1;
}

/** Lineare Achse 0 … glatte Obergrenze ≥ maxWert; Titel kurz halten („σ in N/mm²“), sonst wird er abgeschnitten */
export function linAchse(farben: DiagrammFarben, titel: string, maxWert: number, gitter: boolean) {
  const a = schoeneAchse(maxWert);
  return {
    type: 'linear' as const,
    min: 0,
    max: a.max,
    title: { display: true, text: titel, color: farben.titel, font: { weight: 'bold' as const, size: 12 } },
    ticks: { stepSize: a.schritt, color: farben.ticks, font: { size: 11 } },
    grid: { display: gitter, color: farben.gitter },
    border: { color: farben.achse },
  };
}

/** Pfeilspitzen-Marker (Kraft = Akzent, Maß = Akzent schmal); id-Präfix je Grafik, damit ids eindeutig bleiben */
export function PfeilDefs({ praefix }: { praefix: string }) {
  return (
    <defs>
      <marker id={`${praefix}-pfeil`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0,0 L10,5 L0,10 z" fill="var(--pg-akzent)" />
      </marker>
      <marker id={`${praefix}-mass`} viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M0,1 L10,5 L0,9 z" fill="var(--pg-mass)" />
      </marker>
    </defs>
  );
}

/** Maßlinie mit Pfeilen an beiden Enden und Beschriftung in der Mitte (Text auf hellem Schild) */
export function Masslinie({ x1, y1, x2, y2, text, praefix, versatz = -6, schrift = 12, anteil = 0.5 }: {
  x1: number; y1: number; x2: number; y2: number; text: string; praefix: string; versatz?: number; schrift?: number;
  /** Lage der Beschriftung entlang der Linie (0 = Anfang, 1 = Ende) */
  anteil?: number;
}) {
  const mx = x1 + (x2 - x1) * anteil;
  const my = y1 + (y2 - y1) * anteil;
  const senkrecht = Math.abs(x2 - x1) < Math.abs(y2 - y1);
  const breite = text.length * schrift * 0.58 + 8;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--pg-mass)" strokeWidth="1.4"
        markerStart={`url(#${praefix}-mass)`} markerEnd={`url(#${praefix}-mass)`} />
      {senkrecht ? (
        <g>
          <rect x={mx + 6} y={my - schrift * 0.75} width={breite} height={schrift * 1.5} rx="3" fill="var(--pg-anzeige)" stroke="var(--pg-mass)" strokeWidth="0.8" />
          <text x={mx + 10} y={my + schrift * 0.35} fontSize={schrift} fontWeight="bold" fill="var(--pg-mass)">{text}</text>
        </g>
      ) : (
        <g>
          <rect x={mx - breite / 2} y={my + versatz - schrift * 1.1} width={breite} height={schrift * 1.45} rx="3" fill="var(--pg-anzeige)" stroke="var(--pg-mass)" strokeWidth="0.8" />
          <text x={mx} y={my + versatz} fontSize={schrift} fontWeight="bold" fill="var(--pg-mass)" textAnchor="middle">{text}</text>
        </g>
      )}
    </g>
  );
}
