import { formatDeWert } from '@/src/utils/numberFormat';
import React from 'react';
import { cn } from '@/src/lib/utils';
import { InfoTooltip } from './InfoTooltip';

interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value'> {
  label: React.ReactNode;
  value: number;
  unit?: React.ReactNode;
  min: number;
  max: number;
  step?: number;
  info?: string;
  /** Klartext für Screenreader (aria-valuetext); ohne Angabe: angezeigter Wert mit Einheit */
  valueText?: string;
}

/** Text der Einheit, wenn sie als Zeichenkette oder Zahl vorliegt (sonst null: aus der Anzeige lesen). Exportiert für Tests. */
export function einheitText(unit: React.ReactNode): string | null {
  if (unit === undefined || unit === null || unit === false || unit === '') return '';
  if (typeof unit === 'string' || typeof unit === 'number') return String(unit);
  return null;
}

/** aria-valuetext: deutsch formatierter Wert mit Einheit (WCAG 4.1.2). Exportiert für Tests. */
export function reglerText(wert: number, einheit: string): string {
  return `${formatDeWert(wert)}${einheit ? ` ${einheit}` : ''}`;
}

export function Slider({ label, value, unit, info, className, id: propId, valueText, ...props }: SliderProps) {
  // useId als Rückfall: auch Slider mit Formel-Beschriftung (ReactNode) bekommen ein über <label htmlFor> verknüpftes Eingabefeld (axe „label“)
  const reactId = React.useId();
  const anzeige = React.useRef<HTMLSpanElement>(null);
  const feld = React.useRef<HTMLInputElement>(null);
  const einheit = einheitText(unit);
  const text = valueText ?? (einheit !== null ? reglerText(value, einheit) : undefined);
  // Einheit als Formel/Element (ReactNode): Klartext aus der sichtbaren Anzeige übernehmen
  React.useLayoutEffect(() => {
    if (text !== undefined || !feld.current || !anzeige.current) return;
    const t = (anzeige.current.textContent ?? '').replace(/\s+/g, ' ').trim();
    if (t) feld.current.setAttribute('aria-valuetext', t);
  });
  const generatedId = propId || (typeof label === 'string' ? 'slider-' + label.toLowerCase().replace(/[^a-z0-9]/g, '-') : 'slider-' + reactId.replace(/[^a-zA-Z0-9]/g, ''));
  return (
    <div className={cn("flex flex-col gap-2 pdf-parameter", className)} data-label={typeof label === 'string' ? label : undefined} data-value={value} data-unit={unit || ''}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <label htmlFor={generatedId} className="text-sm font-medium text-text-main pdf-parameter-label">{label}</label>
          {/* Erläuterung auch per Tastatur erreichbar (InfoTooltip, WCAG 1.4.13) */}
          {info && <InfoTooltip text={info} />}
        </div>
        <span ref={anzeige} className="text-sm font-bold text-shiraz" aria-hidden="true">
          {formatDeWert(value)} {unit}
        </span>
      </div>
      <input
        ref={feld}
        id={generatedId}
        aria-valuetext={text}
        aria-label={typeof label === 'string' ? label : undefined}
        type="range"
        value={value}
        className="w-full"
        {...props}
      />
      <div className="flex justify-between text-xs text-home-grau mt-1">
        <span>{formatDeWert(props.min)}</span>
        <span>{formatDeWert(props.max)}</span>
      </div>
    </div>
  );
}
