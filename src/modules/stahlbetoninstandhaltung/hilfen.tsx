// Ausgelagert aus src/modules/Stahlbetoninstandhaltung.tsx (AP 5.2)
import { Info } from 'lucide-react';
import { FormulaText } from '@/src/components/ui/FormulaText';

// Fehlerfunktion: Kern in src/calc/schutzInstandsetzung.ts
export { erf } from '@/src/calc/schutzInstandsetzung';

export const InfoTooltip = ({ text }: { text: string }) => (
  <div className="group relative inline-block ml-2">
    <Info size={16} className="text-home-grau cursor-help" />
      <div className="invisible group-hover:visible absolute z-10 w-64 p-2 mt-2 text-xs text-white bg-text-main rounded-lg shadow-lg -left-1/2 transform -translate-x-1/2">
        <FormulaText text={text} />
        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-text-main rotate-45"></div>
      </div>
  </div>
);
