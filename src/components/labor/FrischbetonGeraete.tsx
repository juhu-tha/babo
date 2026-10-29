// Gerätezeichnungen der Frischbetonprüfung (FrischbetonPruefung):
// - Ausbreittisch nach DIN EN 12350-5: Draufsicht der Platte 700 × 700 mm mit Mittelkreis Ø 210 mm, Diagonalen und
//   Mittellinien; Kegelstumpf Ø 200/130 mm, h = 200 mm; Ausbreitmaß aus zwei Durchmessern d1/d2 parallel zu den Kanten.
//   Seitenansicht mit Hubhöhe 40 mm und Zähler der Hubschläge.
// - Setzversuch nach DIN EN 12350-2: Abrams-Trichter Ø 200/100 mm, h = 300 mm; nach dem Ziehen steht die Form neben
//   dem Beton, das Setzmaß h wird von der Trichteroberkante bis zur höchsten Stelle des Betons gemessen. Formen:
//   Setzung (gültig), Scherung (ungültig, wiederholen), Zusammenbruch.
import React from 'react';
import { formatDeWert } from '@/src/utils/numberFormat';
import { ausbreitDurchmesser } from '@/src/calc/laborVersuch';
import { PfeilDefs, Masslinie, useSchriftFaktor } from './laborGrafik';

// ── Ausbreittisch ──────────────────────────────────────────────────────────────
const M = 300 / 700; // px je mm in der Draufsicht (Platte 700 mm → 300 px)

export function AusbreitDraufsicht({ ausbreitmass, kegelGehoben, hubschlaege }: { ausbreitmass: number; kegelGehoben: boolean; hubschlaege: number }) {
  const cx = 160;
  const cy = 160;
  const { d1, d2 } = kegelGehoben ? ausbreitDurchmesser(ausbreitmass) : { d1: 200, d2: 200 };
  const label = kegelGehoben
    ? `Draufsicht Ausbreittisch 700 × 700 mm nach ${formatDeWert(hubschlaege)} von 15 Hubschlägen: Betonkuchen mit d1 = ${formatDeWert(d1)} mm parallel zur unteren Kante und d2 = ${formatDeWert(d2)} mm rechtwinklig dazu; Ausbreitmaß f = (d1 + d2)/2 = ${formatDeWert(ausbreitmass)} mm.`
    : 'Draufsicht Ausbreittisch 700 × 700 mm mit Mittelkreis Ø 210 mm, Diagonalen und Mittellinien; in der Mitte der gefüllte Ausbreitkegel (Kegelstumpf Ø 200 mm unten, Ø 130 mm oben).';
  const rx = (d1 / 2) * M;
  const ry = (d2 / 2) * M;
  return (
    <svg viewBox="0 0 320 340" className="w-full max-w-[360px] h-auto select-none" role="img" aria-label={label}>
      <title>{label}</title>
      <PfeilDefs praefix="abt" />
      {/* Platte mit Markierungen */}
      <rect x="10" y="10" width="300" height="300" rx="3" fill="var(--pg-stahl)" stroke="var(--pg-kontur)" strokeWidth="2" />
      <g stroke="var(--pg-stahl3)" strokeWidth="1">
        <line x1="10" y1="10" x2="310" y2="310" />
        <line x1="310" y1="10" x2="10" y2="310" />
        <line x1="10" y1={cy} x2="310" y2={cy} strokeDasharray="5 4" />
        <line x1={cx} y1="10" x2={cx} y2="310" strokeDasharray="5 4" />
      </g>
      <circle cx={cx} cy={cy} r={105 * M} fill="none" stroke="var(--pg-kontur)" strokeWidth="1.3" />
      {/* Beton bzw. Kegel */}
      {kegelGehoben ? (
        <g>
          <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="var(--pg-beton2)" stroke="var(--pg-kontur)" strokeWidth="1.5" className="transition-all duration-300" />
          <ellipse cx={cx} cy={cy} rx={rx * 0.7} ry={ry * 0.7} fill="none" stroke="var(--pg-korn)" strokeWidth="0.8" strokeDasharray="3 3" className="transition-all duration-300" />
          <Masslinie praefix="abt" x1={cx - rx} y1={cy + 2} x2={cx + rx} y2={cy + 2} text="d1" anteil={0.22} versatz={-6} />
          <Masslinie praefix="abt" x1={cx + 2} y1={cy - ry} x2={cx + 2} y2={cy + ry} text="d2" anteil={0.8} />
        </g>
      ) : (
        <g>
          <circle cx={cx} cy={cy} r={100 * M} fill="var(--pg-beton2)" stroke="var(--pg-kontur)" strokeWidth="2" />
          <circle cx={cx} cy={cy} r={65 * M} fill="var(--pg-beton)" stroke="var(--pg-kontur)" strokeWidth="1.5" />
          {/* Griffe */}
          <rect x={cx - 100 * M - 12} y={cy - 4} width="12" height="8" rx="2" fill="var(--pg-stahl2)" stroke="var(--pg-kontur)" />
          <rect x={cx + 100 * M} y={cy - 4} width="12" height="8" rx="2" fill="var(--pg-stahl2)" stroke="var(--pg-kontur)" />
          <text x={cx} y={cy + 100 * M + 16} textAnchor="middle" fontSize="11" fill="var(--pg-text)">Kegel Ø 200/130 mm</text>
        </g>
      )}
      <text x="12" y="332" fontSize="12" fill={kegelGehoben ? 'var(--pg-mass)' : 'var(--pg-text2)'} fontWeight={kegelGehoben ? 'bold' : 'normal'}>
        {kegelGehoben
          ? `d1 = ${formatDeWert(d1)} mm · d2 = ${formatDeWert(d2)} mm → f = ${formatDeWert(ausbreitmass)} mm`
          : 'Platte 700 × 700 mm · Mittelkreis Ø 210 mm'}
      </text>
    </svg>
  );
}

export function AusbreitSeitenansicht({ ausbreitmass, kegelGehoben, hubschlaege, gehoben }: { ausbreitmass: number; kegelGehoben: boolean; hubschlaege: number; gehoben: boolean }) {
  // Seitenansicht: Platte 700 mm → 200 px; Gelenk links, Anschlag rechts (Hubhöhe 40 mm, überhöht dargestellt)
  const s = 200 / 700;
  const winkel = gehoben ? -Math.atan2(40 * s * 1.6, 200) * (180 / Math.PI) : 0;
  const breite = (kegelGehoben ? ausbreitmass : 200) * s;
  const hoehe = kegelGehoben ? Math.max(4, (200 * 200 * 200) / (ausbreitmass * ausbreitmass) * s * 0.5) : 200 * s;
  const label = `Seitenansicht Ausbreittisch: obere Platte am linken Rand gelenkig, wird am rechten Rand um 40 mm angehoben und fällt frei auf den Anschlag; ${formatDeWert(hubschlaege)} von 15 Hubschlägen ausgeführt.`;
  return (
    <svg viewBox="0 0 250 200" className="w-full max-w-[280px] h-auto select-none" role="img" aria-label={label}>
      <title>{label}</title>
      <PfeilDefs praefix="abs" />
      {/* Untergestell */}
      <rect x="15" y="150" width="210" height="10" fill="var(--pg-stahl2)" stroke="var(--pg-kontur)" strokeWidth="1.2" />
      <circle cx="22" cy="138" r="5" fill="var(--pg-stahl3)" stroke="var(--pg-kontur)" />
      <rect x="208" y="134" width="12" height="16" fill="var(--pg-stahl3)" stroke="var(--pg-kontur)" />
      {/* obere Platte (gelenkig links) mit Beton */}
      <g transform={`rotate(${winkel} 22 138)`} className="transition-transform duration-150">
        <rect x="20" y="128" width="200" height="6" fill="var(--pg-stahl)" stroke="var(--pg-kontur)" strokeWidth="1.2" />
        {kegelGehoben ? (
          <path d={`M ${120 - breite / 2} 128 Q ${120 - breite / 4} ${128 - hoehe} 120 ${128 - hoehe} Q ${120 + breite / 4} ${128 - hoehe} ${120 + breite / 2} 128 Z`} fill="var(--pg-beton2)" stroke="var(--pg-kontur)" strokeWidth="1.2" />
        ) : (
          <path d={`M ${120 - 100 * s} 128 L ${120 - 65 * s} ${128 - 200 * s} L ${120 + 65 * s} ${128 - 200 * s} L ${120 + 100 * s} 128 Z`} fill="var(--pg-beton2)" stroke="var(--pg-kontur)" strokeWidth="1.5" />
        )}
      </g>
      {/* Hubhöhe */}
      <line x1="236" y1="140" x2="236" y2={140 - 40 * s * 1.6} stroke="var(--pg-mass)" strokeWidth="1.3" markerStart="url(#abs-mass)" markerEnd="url(#abs-mass)" />
      <text x="230" y="112" fontSize="11" fill="var(--pg-mass)" fontWeight="bold" textAnchor="end">40 mm</text>
      {!kegelGehoben && (
        <g>
          <text x="120" y={128 - 200 * s - 8} textAnchor="middle" fontSize="11" fill="var(--pg-text)">h = 200 mm</text>
        </g>
      )}
      <text x="15" y="182" fontSize="12" fontWeight="bold" fill="var(--pg-text)">Hubschläge: {formatDeWert(hubschlaege)} / 15</text>
      <text x="15" y="197" fontSize="11" fill="var(--pg-text2)">Hubhöhe 40 mm (überhöht gezeichnet)</text>
    </svg>
  );
}

// ── Setzversuch (Slump) ──────────────────────────────────────────────────────────
export type SetzForm = 'setzung' | 'scherung' | 'zusammenbruch';

export function SetzversuchAnsicht({ setzmass, gezogen, form }: { setzmass: number; gezogen: boolean; form: SetzForm }) {
  const fs = useSchriftFaktor();
  const k = 0.6; // px je mm
  const boden = 240;
  const hForm = 300 * k;
  const ruB = 100 * k; // Radius unten
  const roB = 50 * k; // Radius oben
  const cxB = 105; // Beton
  const cxF = 280; // Form nach dem Ziehen
  const hBeton = Math.max(10, (300 - setzmass) * k);
  // Betonform nach dem Ziehen: Kegelstumpf mit abgeflachter Kuppe; Zusammenbruch: flacher, breiter Kuchen
  const ruBeton = form === 'zusammenbruch' ? Math.min(100, ruB + setzmass * 0.25) : ruB + setzmass * 0.12;
  const roBeton = form === 'zusammenbruch' ? ruBeton * 0.4 : Math.max(18, roB + setzmass * 0.05);
  const topY = boden - hBeton;
  const betonPfad = !gezogen
    ? `M ${cxB - ruB} ${boden} L ${cxB - roB} ${boden - hForm} L ${cxB + roB} ${boden - hForm} L ${cxB + ruB} ${boden} Z`
    : form === 'zusammenbruch'
      ? `M ${cxB - ruBeton} ${boden} Q ${cxB - roBeton} ${topY} ${cxB} ${topY} Q ${cxB + roBeton} ${topY} ${cxB + ruBeton} ${boden} Z`
      : `M ${cxB - ruBeton} ${boden} L ${cxB - roBeton - 4} ${topY + 6} Q ${cxB - roBeton} ${topY} ${cxB} ${topY} Q ${cxB + roBeton} ${topY} ${cxB + roBeton + 4} ${topY + 6} L ${cxB + ruBeton} ${boden} Z`;
  const formX = gezogen ? cxF : cxB;
  const formPfad = `M ${formX - ruB} ${boden} L ${formX - roB} ${boden - hForm} L ${formX + roB} ${boden - hForm} L ${formX + ruB} ${boden} Z`;
  const label = gezogen
    ? `Setzversuch: Trichter abgezogen und neben den Beton gestellt; Setzmaß h = ${formatDeWert(setzmass)} mm, gemessen von der Trichteroberkante bis zur höchsten Stelle des Betons; Form ${form === 'zusammenbruch' ? 'Zusammenbruch' : 'Setzung'}.`
    : 'Setzversuch: gefüllter Abrams-Trichter (Kegelstumpf Ø 200 mm unten, Ø 100 mm oben, Höhe 300 mm) auf der Grundplatte.';
  return (
    <svg viewBox="0 0 400 270" className="w-full max-w-[460px] h-auto select-none" role="img" aria-label={label}>
      <title>{label}</title>
      <PfeilDefs praefix="slp" />
      <rect x="6" y={boden} width="388" height="10" fill="var(--pg-stahl2)" stroke="var(--pg-kontur)" strokeWidth="1.2" />
      <path d={betonPfad} fill="var(--pg-beton2)" stroke="var(--pg-kontur)" strokeWidth="1.5" className="transition-all duration-500" />
      {/* Abrams-Trichter mit Fußrasten und Griffen */}
      <path d={formPfad} fill={gezogen ? 'var(--pg-stahl)' : 'none'} fillOpacity={gezogen ? 0.6 : 1} stroke="var(--pg-kontur)" strokeWidth="2" />
      <rect x={formX - ruB - 14} y={boden - 6} width="14" height="5" fill="var(--pg-stahl3)" stroke="var(--pg-kontur)" />
      <rect x={formX + ruB} y={boden - 6} width="14" height="5" fill="var(--pg-stahl3)" stroke="var(--pg-kontur)" />
      <rect x={formX - roB - 18} y={boden - hForm * 0.62} width="10" height="6" rx="2" fill="var(--pg-stahl3)" stroke="var(--pg-kontur)" />
      <rect x={formX + roB + 8} y={boden - hForm * 0.62} width="10" height="6" rx="2" fill="var(--pg-stahl3)" stroke="var(--pg-kontur)" />
      {!gezogen && (
        <g>
          <Masslinie praefix="slp" schrift={12 * fs} x1={cxB + ruB + 30} y1={boden} x2={cxB + ruB + 30} y2={boden - hForm} text="300 mm" />
          <text x={cxB} y={boden - hForm - 8} textAnchor="middle" fontSize={11 * fs} fill="var(--pg-text)">Ø 100 mm</text>
          <text x={cxB} y={boden + 24} textAnchor="middle" fontSize={11 * fs} fill="var(--pg-text)">Ø 200 mm</text>
        </g>
      )}
      {gezogen && (
        <g>
          {/* Bezugslinie Trichteroberkante und Setzmaß h */}
          <line x1={cxF - roB} y1={boden - hForm} x2={cxB - 30} y2={boden - hForm} stroke="var(--pg-mass)" strokeWidth="1" strokeDasharray="4 3" />
          <line x1={cxB - 30} y1={topY} x2={cxB + 30} y2={topY} stroke="var(--pg-mass)" strokeWidth="1" strokeDasharray="4 3" />
          {setzmass > 0 && (
            <Masslinie praefix="slp" schrift={12 * fs} x1={cxB + 22} y1={boden - hForm} x2={cxB + 22} y2={topY} text={`h = ${formatDeWert(setzmass)} mm`} />
          )}
          <text x={cxF} y={boden + 24} textAnchor="middle" fontSize={11 * fs} fill="var(--pg-text)">Trichter (gezogen)</text>
          <text x={cxB} y={boden + 24} textAnchor="middle" fontSize={11 * fs} fill="var(--pg-text)">Beton</text>
        </g>
      )}
    </svg>
  );
}

/** Kleine Übersicht der drei Setzformen nach DIN EN 12350-2; die aktuelle Form ist hervorgehoben */
export function SetzFormen({ aktiv }: { aktiv: SetzForm | null }) {
  const formen: { id: SetzForm; name: string; zusatz: string; pfad: string }[] = [
    { id: 'setzung', name: 'Setzung', zusatz: 'gültig', pfad: 'M 10 56 L 22 22 Q 30 16 38 22 L 50 56 Z' },
    { id: 'scherung', name: 'Scherung', zusatz: 'wiederholen', pfad: 'M 10 56 L 20 16 L 44 34 L 50 56 Z' },
    { id: 'zusammenbruch', name: 'Zusammen­bruch', zusatz: 'sehr fließfähig', pfad: 'M 2 56 Q 18 40 30 40 Q 42 40 58 56 Z' },
  ];
  return (
    <ul className="grid grid-cols-3 gap-2" aria-label="Setzformen nach DIN EN 12350-2">
      {formen.map(f => (
        <li key={f.id} className={`pruefgeraet rounded-lg border p-1.5 flex flex-col items-center text-center ${aktiv === f.id ? 'ring-2 ring-shiraz' : ''}`}>
          <svg viewBox="0 0 60 62" className="w-14 h-auto" aria-hidden="true">
            <rect x="0" y="56" width="60" height="4" fill="var(--pg-stahl2)" />
            <path d={f.pfad} fill="var(--pg-beton2)" stroke="var(--pg-kontur)" strokeWidth="1.2" />
          </svg>
          <span className="text-[11px] font-bold" style={{ color: 'var(--pg-text)' }}>{f.name}{aktiv === f.id ? ' (aktuell)' : ''}</span>
          <span className="text-[11px]" style={{ color: 'var(--pg-text2)' }}>{f.zusatz}</span>
        </li>
      ))}
    </ul>
  );
}
