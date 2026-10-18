import React from 'react';
import { AlertCircle } from 'lucide-react';

interface CalculatorDisclaimerBannerProps {
  customText?: string;
  className?: string;
}

export function CalculatorDisclaimerBanner({
  customText,
  className = ''
}: CalculatorDisclaimerBannerProps) {
  return (
    <div
      className={`p-3 rounded-xl border border-amber-200/80 bg-amber-50/60 text-amber-950 flex items-center gap-2.5 text-xs ${className}`}
      role="note"
      aria-label="Vorbemessungshinweis"
    >
      <AlertCircle size={15} className="text-amber-700 shrink-0" />
      <span className="font-medium leading-snug">
        {customText || 'Lehr- & Vorbemessungstool – Ergebnisse ersetzen keinen bauaufsichtlichen Nachweis nach MVV TB / LBO.'}
      </span>
    </div>
  );
}

export default CalculatorDisclaimerBanner;
