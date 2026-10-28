// Gerätezeichnung der Universalprüfmaschine (UniversalPruefstand): Rahmen mit Querhaupt, Säulen, Kraftmessdose,
// Druckplatten bzw. Spannbacken, Probekörper mit Bruchbild und Hydraulikkolben. Farben aus .pruefgeraet (hell/dunkel).
// Bruchbilder: Würfel/Zylinder aus Beton oder Ziegel unter Druck als Sanduhr (zwei Pyramidenstümpfe, DIN EN 12390-3
// „zufriedenstellender Bruch“), Gusseisen als Schrägbruch, Holz als Stauchfalte, Metalle tonnenförmig ausgebaucht,
// Glas/CFK längs gespalten; unter Zug spröde Werkstoffe mit Trennriss quer, Stahl/Aluminium mit Einschnürung und Bruch.
import React from 'react';
import type { MaterialType, SpecimenShape, TestType } from './UniversalPruefstand';

interface UtmGeraetProps {
  material: MaterialType;
  testType: TestType;
  specimenShape: SpecimenShape;
  progress: number;
  crackSeverity: number;
  materialColor: string;
  woodAngle: number;
  aktiv: boolean;
  beendet: boolean;
  ariaLabel: string;
}

const CX = 120;

export default function UtmGeraet({ material, testType, specimenShape, progress, crackSeverity, materialColor, woodAngle, aktiv, beendet, ariaLabel }: UtmGeraetProps) {
  const p = Math.max(0, Math.min(1, progress / 100));
  const zug = testType === 'zug';
  const druck = testType === 'druck';
  const metall = material === 'stahl' || material === 'aluminium';

  // Probekörper (Ansicht, schematisch): Würfel 150 mm, Zylinder 150/300 mm, Flachzugstab DIN 50125
  const basis = specimenShape === 'wuerfel150' ? { w: 90, h: 90 } : specimenShape === 'zylinder150' ? { w: 64, h: 128 } : { w: 40, h: 150 };
  let w = basis.w;
  let h = basis.h;
  if (druck) {
    const k = material === 'eps' ? 0.4 : metall ? 0.12 : 0.06;
    h = basis.h * (1 - k * p);
    w = basis.w * (1 + (material === 'eps' ? 0.02 : 0.04) * p);
  } else if (zug) {
    h = basis.h * (1 + (metall ? 0.14 : 0.03) * p);
  }
  const oben = 86;
  const unten = oben + h;
  const x0 = CX - w / 2;
  const x1 = CX + w / 2;
  const mitte = (oben + unten) / 2;
  const getrennt = zug && beendet && crackSeverity > 0.5;
  const spalt = getrennt ? 8 : 0;

  // Umriss des Probekörpers (Pfad), Flachstab mit Schultern; Metalle unter Zug mit Einschnürung, unter Druck ausgebaucht
  const umriss = (() => {
    if (specimenShape === 'flachstab') {
      const s = 26; // Schulterlänge
      const ws = w / 2;
      const neck = metall && zug ? 1 - 0.4 * crackSeverity : 1;
      const wg = (w * 0.5) / 2;
      const wm = wg * neck;
      return `M ${CX - ws} ${oben} L ${CX + ws} ${oben} L ${CX + ws} ${oben + s} Q ${CX + wg} ${oben + s + 6} ${CX + wg} ${oben + s + 16}`
        + ` L ${CX + wg} ${mitte - 14} Q ${CX + wm} ${mitte} ${CX + wg} ${mitte + 14} L ${CX + wg} ${unten - s - 16} Q ${CX + wg} ${unten - s - 6} ${CX + ws} ${unten - s}`
        + ` L ${CX + ws} ${unten} L ${CX - ws} ${unten} L ${CX - ws} ${unten - s} Q ${CX - wg} ${unten - s - 6} ${CX - wg} ${unten - s - 16}`
        + ` L ${CX - wg} ${mitte + 14} Q ${CX - wm} ${mitte} ${CX - wg} ${mitte - 14} L ${CX - wg} ${oben + s + 16} Q ${CX - wg} ${oben + s + 6} ${CX - ws} ${oben + s} Z`;
    }
    if (druck && metall) {
      const b = 6 * p; // Ausbauchung (Tonnenform) infolge Reibung an den Druckplatten
      return `M ${x0} ${oben} L ${x1} ${oben} Q ${x1 + 2 * b} ${mitte} ${x1} ${unten} L ${x0} ${unten} Q ${x0 - 2 * b} ${mitte} ${x0} ${oben} Z`;
    }
    if (zug && metall) {
      const e = (w / 2) * 0.3 * crackSeverity;
      return `M ${x0} ${oben} L ${x1} ${oben} L ${x1} ${mitte - 20} Q ${x1 - e} ${mitte} ${x1} ${mitte + 20} L ${x1} ${unten} L ${x0} ${unten} L ${x0} ${mitte + 20} Q ${x0 + e} ${mitte} ${x0} ${mitte - 20} Z`;
    }
    return `M ${x0} ${oben} L ${x1} ${oben} L ${x1} ${unten} L ${x0} ${unten} Z`;
  })();

  // Bruchbild (Linien) und abgeplatzte Bereiche
  const bruch = (() => {
    const s = crackSeverity;
    if (s <= 0 || testType === 'emodul') return null;
    const st = { stroke: 'var(--pg-riss)', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' };
    if (druck && (material === 'beton' || material === 'ziegel')) {
      // Sanduhr: Taille bei halber Höhe, Kernbreite dort etwa 40 % – die Randkeile platzen ab
      const t = w * 0.3;
      return (
        <g opacity={Math.min(1, s * 1.3)}>
          <path d={`M ${x0} ${oben} L ${x0 + t} ${mitte} L ${x0} ${unten} Z`} fill="var(--pg-grund)" opacity={Math.min(0.85, s)} />
          <path d={`M ${x1} ${oben} L ${x1 - t} ${mitte} L ${x1} ${unten} Z`} fill="var(--pg-grund)" opacity={Math.min(0.85, s)} />
          <path d={`M ${x0 + 2} ${oben + 2} L ${x0 + t} ${mitte} L ${x0 + 2} ${unten - 2}`} {...st} strokeWidth={1.2 + s * 1.8} />
          <path d={`M ${x1 - 2} ${oben + 2} L ${x1 - t} ${mitte} L ${x1 - 2} ${unten - 2}`} {...st} strokeWidth={1.2 + s * 1.8} />
          <path d={`M ${x0 + t * 0.4} ${oben + h * 0.2} l -4 6 M ${x1 - t * 0.4} ${unten - h * 0.2} l 4 -6`} {...st} strokeWidth="1" />
        </g>
      );
    }
    if (druck && material === 'gusseisen') {
      return <path d={`M ${x0} ${oben + h * 0.15} L ${x1} ${unten - h * 0.15}`} {...st} strokeWidth={1.2 + s * 2} opacity={s} />;
    }
    if (druck && material === 'holz') {
      if (woodAngle >= 60) return null; // Querpressung: Zusammendrücken ohne Bruchlinie
      const y = oben + h * 0.38;
      return <path d={`M ${x0} ${y} L ${x0 + w * 0.25} ${y + 6} L ${x0 + w * 0.5} ${y} L ${x0 + w * 0.75} ${y + 6} L ${x1} ${y}`} {...st} strokeWidth={1.2 + s * 1.5} opacity={s} />;
    }
    if (druck && (material === 'glas' || material === 'carbon')) {
      return (
        <g opacity={s}>
          {[0.25, 0.45, 0.62, 0.8].map((f, i) => (
            <path key={i} d={`M ${x0 + w * f} ${oben} L ${x0 + w * f + (i % 2 ? 3 : -3)} ${mitte} L ${x0 + w * f} ${unten}`} {...st} strokeWidth="1.2" />
          ))}
        </g>
      );
    }
    if (zug && !metall && !getrennt) {
      return <path d={`M ${x0} ${mitte} L ${x0 + w * 0.3} ${mitte - 2} L ${x0 + w * 0.6} ${mitte + 2} L ${x1} ${mitte}`} {...st} strokeWidth={1 + s * 2} strokeDasharray={s > 0.8 ? undefined : '3 2'} opacity={s} />;
    }
    return null;
  })();

  // Füllmuster je Werkstoff
  const muster = material === 'beton' ? 'url(#utm-beton)' : material === 'holz' ? 'url(#utm-holz)' : material === 'ziegel' ? 'url(#utm-poren)' : undefined;
  const zylinderSchatten = specimenShape === 'zylinder150';

  const probe = (
    <g>
      <path d={umriss} fill={materialColor} />
      {muster && <path d={umriss} fill={muster} />}
      {zylinderSchatten && <path d={umriss} fill="url(#utm-zylinder)" />}
      {material === 'stahl' || material === 'aluminium' ? <path d={umriss} fill="url(#utm-metall)" /> : null}
      {bruch}
      <path d={umriss} fill="none" stroke="var(--pg-kontur)" strokeWidth="1.5" />
    </g>
  );

  // Zugversuch nach dem Bruch: obere Hälfte bleibt, untere wandert mit dem Kolben nach unten
  const probeGezeigt = getrennt ? (
    <g>
      <defs>
        <clipPath id="utm-oben"><rect x="0" y="0" width="240" height={mitte} /></clipPath>
        <clipPath id="utm-unten"><rect x="0" y={mitte} width="240" height="340" /></clipPath>
      </defs>
      <g clipPath="url(#utm-oben)">{probe}</g>
      <g transform={`translate(0 ${spalt})`} clipPath="url(#utm-unten)">{probe}</g>
      <path d={`M ${x0 - 4} ${mitte} L ${CX - 6} ${mitte - 3} L ${CX + 6} ${mitte + 2} L ${x1 + 4} ${mitte}`} stroke="var(--pg-riss)" strokeWidth="1.5" fill="none" />
    </g>
  ) : probe;

  const plattenUnten = unten + spalt;
  const sockel = 300;

  return (
    <svg viewBox="0 0 240 336" className="w-full max-w-[300px] h-auto select-none" role="img" aria-label={ariaLabel}>
      <title>{ariaLabel}</title>
      <defs>
        <pattern id="utm-beton" width="9" height="9" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.6" fill="var(--pg-korn)" opacity="0.55" />
          <circle cx="6.5" cy="6" r="1.1" fill="var(--pg-korn)" opacity="0.45" />
        </pattern>
        <pattern id="utm-poren" width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="1" fill="#3f0a1a" opacity="0.45" />
        </pattern>
        <pattern id="utm-holz" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform={`rotate(${woodAngle})`}>
          <line x1="0" y1="0" x2="0" y2="8" stroke="var(--pg-holz-faser)" strokeWidth="1.4" opacity="0.7" />
        </pattern>
        <linearGradient id="utm-zylinder" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0.18" />
          <stop offset="0.35" stopColor="#fff" stopOpacity="0.18" />
          <stop offset="1" stopColor="#000" stopOpacity="0.22" />
        </linearGradient>
        <linearGradient id="utm-metall" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="utm-saeule" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="var(--pg-stahl2)" />
          <stop offset="0.45" stopColor="var(--pg-glanz)" />
          <stop offset="1" stopColor="var(--pg-stahl3)" />
        </linearGradient>
        <marker id="utm-pfeil" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="var(--pg-akzent)" />
        </marker>
      </defs>

      {/* Säulen */}
      <rect x="12" y="40" width="12" height={sockel - 40} fill="url(#utm-saeule)" stroke="var(--pg-kontur)" strokeWidth="1" />
      <rect x="216" y="40" width="12" height={sockel - 40} fill="url(#utm-saeule)" stroke="var(--pg-kontur)" strokeWidth="1" />

      {/* Querhaupt mit Beschriftung */}
      <rect x="6" y="6" width="228" height="34" rx="4" fill="var(--pg-stahl)" stroke="var(--pg-kontur)" strokeWidth="1.5" />
      <text x={CX} y="21" textAnchor="middle" fontSize="11" fontWeight="bold" fill="var(--pg-text)">Universalprüfmaschine</text>
      <text x={CX} y="34" textAnchor="middle" fontSize="11" fill="var(--pg-text2)">UTM-3000 · 3000 kN</text>

      {/* Kraftmessdose */}
      <rect x="76" y="40" width="88" height="20" rx="2" fill="var(--pg-stahl2)" stroke="var(--pg-kontur)" strokeWidth="1.2" />
      <text x={CX} y="54" textAnchor="middle" fontSize="11" fill="var(--pg-text)">Kraftmessdose</text>

      {/* obere Druckplatte bzw. Spannbacken */}
      {zug ? (
        <g>
          <rect x={CX - 30} y="60" width="60" height="16" fill="var(--pg-stahl2)" stroke="var(--pg-kontur)" strokeWidth="1.2" />
          <path d={`M ${CX - 30} 76 L ${CX - w / 2 - 2} ${oben + 18} L ${CX - w / 2 - 2} 76 Z`} fill="var(--pg-stahl3)" stroke="var(--pg-kontur)" strokeWidth="1" />
          <path d={`M ${CX + 30} 76 L ${CX + w / 2 + 2} ${oben + 18} L ${CX + w / 2 + 2} 76 Z`} fill="var(--pg-stahl3)" stroke="var(--pg-kontur)" strokeWidth="1" />
        </g>
      ) : (
        <rect x={CX - 52} y="60" width="104" height={oben - 60} rx="2" fill="var(--pg-stahl)" stroke="var(--pg-kontur)" strokeWidth="1.5" />
      )}

      {/* Probekörper */}
      {probeGezeigt}

      {/* Ansetzdehnungsaufnehmer (Clip-on) am Probekörper */}
      {!(zug && getrennt) && (
        <g>
          <rect x={x0 - 13} y={oben + h * 0.25} width="7" height={h * 0.5} rx="1.5" fill="var(--pg-stahl2)" stroke="var(--pg-kontur)" strokeWidth="1" />
          <line x1={x0 - 6} y1={oben + h * 0.25 + 2} x2={x0 + (specimenShape === 'flachstab' ? w * 0.25 : 0)} y2={oben + h * 0.25 + 2} stroke="var(--pg-kontur)" strokeWidth="1.2" />
          <line x1={x0 - 6} y1={oben + h * 0.75 - 2} x2={x0 + (specimenShape === 'flachstab' ? w * 0.25 : 0)} y2={oben + h * 0.75 - 2} stroke="var(--pg-kontur)" strokeWidth="1.2" />
        </g>
      )}

      {/* untere Druckplatte bzw. Spannbacken, Kolben */}
      {zug ? (
        <g>
          <path d={`M ${CX - 30} ${plattenUnten - 4 + 4} L ${CX - w / 2 - 2} ${plattenUnten - 18} L ${CX - w / 2 - 2} ${plattenUnten} Z`} fill="var(--pg-stahl3)" stroke="var(--pg-kontur)" strokeWidth="1" />
          <path d={`M ${CX + 30} ${plattenUnten} L ${CX + w / 2 + 2} ${plattenUnten - 18} L ${CX + w / 2 + 2} ${plattenUnten} Z`} fill="var(--pg-stahl3)" stroke="var(--pg-kontur)" strokeWidth="1" />
          <rect x={CX - 30} y={plattenUnten} width="60" height="16" fill="var(--pg-stahl2)" stroke="var(--pg-kontur)" strokeWidth="1.2" />
        </g>
      ) : (
        <rect x={CX - 52} y={plattenUnten} width="104" height="16" rx="2" fill="var(--pg-stahl)" stroke="var(--pg-kontur)" strokeWidth="1.5" />
      )}
      <rect x={CX - 16} y={plattenUnten + 16} width="32" height={Math.max(0, sockel - plattenUnten - 16)} fill="var(--pg-stahl2)" stroke="var(--pg-kontur)" strokeWidth="1" />

      {/* Belastungsrichtung */}
      {(aktiv || beendet) && testType !== 'emodul' && (
        <line x1="196" y1={zug ? plattenUnten - 10 : plattenUnten + 40} x2="196" y2={zug ? plattenUnten + 30 : plattenUnten + 4} stroke="var(--pg-akzent)" strokeWidth="2.5" markerEnd="url(#utm-pfeil)" />
      )}

      {/* Sockel mit Hydraulik */}
      <rect x="6" y={sockel} width="228" height="30" rx="4" fill="var(--pg-stahl)" stroke="var(--pg-kontur)" strokeWidth="1.5" />
      <circle cx="20" cy={sockel + 15} r="4" fill={aktiv ? 'var(--pg-ok)' : 'var(--pg-stahl3)'} stroke="var(--pg-kontur)" strokeWidth="0.8" />
      <text x="30" y={sockel + 19} fontSize="11" fill="var(--pg-text)">{aktiv ? 'Prüfung läuft' : beendet ? 'Prüfung beendet' : 'bereit'}</text>
      <text x="226" y={sockel + 19} textAnchor="end" fontSize="11" fill="var(--pg-text2)">Hub ±100 mm</text>
    </svg>
  );
}
