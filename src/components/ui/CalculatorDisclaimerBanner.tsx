import React from 'react';
import { AlertCircle } from 'lucide-react';
import type { RechnerGrenzen } from '@/src/data/rechnerGrenzen';

interface CalculatorDisclaimerBannerProps {
  customText?: string;
  className?: string;
  /** Annahmen und Grenzen des Rechners (AP 4.11), aufklappbar angezeigt */
  grenzen?: RechnerGrenzen;
}

export function CalculatorDisclaimerBanner({
  customText,
  className = '',
  grenzen,
}: CalculatorDisclaimerBannerProps) {
  return (
    <div
      className={`p-3 rounded-xl border border-amber-200/80 bg-amber-50/60 text-amber-950 text-xs ${className}`}
      role="note"
      aria-label="Vorbemessungshinweis"
    >
      <div className="flex items-center gap-2.5">
        <AlertCircle size={15} className="text-amber-700 shrink-0" aria-hidden="true" />
        <span className="font-medium leading-snug">
          {customText || 'Lehr- & Vorbemessungstool – Ergebnisse ersetzen keinen bauaufsichtlichen Nachweis nach MVV TB / LBO.'}
        </span>
      </div>
      {grenzen && grenzen.rechnet !== false && grenzen.grenzen.length > 0 && (
        <details className="mt-2 pl-6">
          <summary className="cursor-pointer font-semibold text-amber-900 underline underline-offset-2">
            Annahmen und Grenzen dieses Rechners ({grenzen.grenzen.length})
          </summary>
          <p className="mt-1.5 leading-snug">{grenzen.kurz}</p>
          <ul className="mt-1 list-disc pl-4 space-y-0.5 leading-snug">
            {grenzen.grenzen.map((g, i) => <li key={i}>{g}</li>)}
          </ul>
        </details>
      )}
    </div>
  );
}

export default CalculatorDisclaimerBanner;
