// Ausgelagert aus src/modules/Stahlbetoninstandhaltung.tsx (AP 5.2)
import { Info } from 'lucide-react';
import { FormulaText } from '@/src/components/ui/FormulaText';

// Analytical approximation of Gauss error function erf(x)
export function erf(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  const absX = Math.abs(x);
  const t = 1.0 / (1.0 + p * absX);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);
  return sign * y;
}

export const InfoTooltip = ({ text }: { text: string }) => (
  <div className="group relative inline-block ml-2">
    <Info size={16} className="text-home-grau cursor-help" />
      <div className="invisible group-hover:visible absolute z-10 w-64 p-2 mt-2 text-xs text-white bg-text-main rounded-lg shadow-lg -left-1/2 transform -translate-x-1/2">
        <FormulaText text={text} />
        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-text-main rotate-45"></div>
      </div>
  </div>
);
