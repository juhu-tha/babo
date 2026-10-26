import { formatDeWert } from '@/src/utils/numberFormat';
import React from 'react';
import { cn } from '@/src/lib/utils';
import { Info } from 'lucide-react';

interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value'> {
  label: React.ReactNode;
  value: number;
  unit?: React.ReactNode;
  min: number;
  max: number;
  step?: number;
  info?: string;
}

export function Slider({ label, value, unit, info, className, id: propId, ...props }: SliderProps) {
  // useId als Rückfall: auch Slider mit Formel-Beschriftung (ReactNode) bekommen ein über <label htmlFor> verknüpftes Eingabefeld (axe „label“)
  const reactId = React.useId();
  const generatedId = propId || (typeof label === 'string' ? 'slider-' + label.toLowerCase().replace(/[^a-z0-9]/g, '-') : 'slider-' + reactId.replace(/[^a-zA-Z0-9]/g, ''));
  return (
    <div className={cn("flex flex-col gap-2 pdf-parameter", className)} data-label={typeof label === 'string' ? label : undefined} data-value={value} data-unit={unit || ''}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <label htmlFor={generatedId} className="text-sm font-medium text-text-main pdf-parameter-label">{label}</label>
          {info && (
            <div className="group relative flex items-center">
              <Info size={14} className="text-text-main/40 hover:text-shiraz cursor-help transition-colors" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-56 p-2 bg-text-main text-white text-xs rounded shadow-lg z-50 text-center">
                {info}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-text-main"></div>
              </div>
            </div>
          )}
        </div>
        <span className="text-sm font-bold text-shiraz">
          {formatDeWert(value)} {unit}
        </span>
      </div>
      <input
        id={generatedId}
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
