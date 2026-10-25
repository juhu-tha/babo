// Ausgelagert aus src/modules/ZfP.tsx (AP 5.2)
import { formatDeZahl } from '@/src/utils/numberFormat';
import React from 'react';
import { Slider } from '@/src/components/ui/Slider';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { InlineMath } from 'react-katex';
import { Zap, Battery } from 'lucide-react';

export interface ElektrochemischTabProps {
  potential: number;
  potentialResults: { risk: string; color: string; };
  renderEmbeddedGeraete: (tabKey: string, deviceIds: string[]) => React.JSX.Element | null;
  setPotential: React.Dispatch<React.SetStateAction<number>>;
  setWennerResistance: React.Dispatch<React.SetStateAction<number>>;
  setWennerSpacing: React.Dispatch<React.SetStateAction<number>>;
  wennerResistance: number;
  wennerResults: { rho: number; rhoKohmCm: number; rate: string; color: string; textClass: string; description: string; };
  wennerSpacing: number;
}

export default function ElektrochemischTab({ potential, potentialResults, renderEmbeddedGeraete, setPotential, setWennerResistance, setWennerSpacing, wennerResistance, wennerResults, wennerSpacing }: ElektrochemischTabProps) {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Potentialmessung */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-shiraz/10 rounded-lg text-shiraz">
              <Battery size={24} />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Potentialmessung (Half-cell)</h2>
          </div>
          
          <div className="text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-home-grau/30">
            <p>
              <FormulaText text="Misst das elektrochemische Potential der Bewehrung gegen eine Referenzelektrode (z.B. \text{Cu/CuSO}_4), um aktive Korrosion zu lokalisieren." />
            </p>
          </div>

          <Slider
            label="Gemessenes Potential"
            min={-600} max={0} step={10}
            value={potential} unit="mV"
            onChange={(e) => setPotential(Number(e.target.value))}
          />

          <div className={`mt-4 p-4 text-white rounded-xl shadow-md transition-colors duration-500 ${potentialResults.color}`}>
            <div className="text-sm opacity-90 mb-1">Korrosionswahrscheinlichkeit</div>
            <div className="text-3xl font-bold">{potentialResults.risk}</div>
            <div className="text-xs opacity-75 mt-2">
              <FormulaText text="Referenzelektrode: \text{Cu/CuSO}_4" />
            </div>
          </div>
        </div>

        {/* Wenner-Sonde (Betonwiderstandsmessung) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-shiraz/10 rounded-lg text-shiraz">
              <Zap size={24} />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Betonwiderstand (Wenner-Sonde)</h2>
          </div>

          <div className="text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-home-grau/30">
            <p>
              Das 4-Punkt Wenner-Sonden-Verfahren misst den spezifischen elektrischen Widerstand <InlineMath math="\rho" />. Dies korreliert mit der Durchfeuchtung und der Korrosionsgeschwindigkeit im Beton.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Slider 
              label="Elektrodenabstand (a)"
              min={20} max={100} step={5}
              value={wennerSpacing} unit="mm"
              info="Gleichmäßiger Abstand zwischen den 4 Messnadeln."
              onChange={(e) => setWennerSpacing(Number(e.target.value))}
            />
            <Slider 
              label="Elektrolytwiderstand (R)"
              min={10} max={2000} step={10}
              value={wennerResistance} unit="Ohm"
              info="Gemessener Widerstandswert zwischen den Innenelektroden."
              onChange={(e) => setWennerResistance(Number(e.target.value))}
            />
          </div>

          <div className="mt-2 p-4 rounded-xl border border-home-grau/20 bg-slate-50 flex flex-col gap-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Spezifischer elektrischer Widerstand</div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">{formatDeZahl(wennerResults.rho, 1)} Ω·m</span>
              <span className="text-sm text-slate-500">({formatDeZahl(wennerResults.rhoKohmCm, 1)} kΩ·cm)</span>
            </div>

            <div className={`mt-2 p-3 rounded-lg border text-xs flex flex-col gap-1 ${wennerResults.textClass}`}>
              <span className="font-bold">Korrosionsrate: {wennerResults.rate}</span>
              <p className="text-slate-600 font-normal">{wennerResults.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Zugehörige Geräte aus Gerätepool */}
      {renderEmbeddedGeraete('elektrochemisch', ['potentialfeld', 'elektrolyt'])}
    </div>
  );
}
