// Ausgelagert aus src/modules/ZfP.tsx (AP 5.2)
import { formatDeZahl, formatDeTeX } from '@/src/utils/numberFormat';
import React from 'react';
import { Slider } from '@/src/components/ui/Slider';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { Search, Waves } from 'lucide-react';
import inhalt from '@/content/zfp/AkustischTab.json';
import { MdText } from '@/src/components/inhalt/MdText';

export interface AkustischTabProps {
  frequency: number;
  impactEchoResults: { depth: number; };
  renderEmbeddedGeraete: (tabKey: string, deviceIds: string[]) => React.JSX.Element | null;
  setFrequency: React.Dispatch<React.SetStateAction<number>>;
  setVelocity: React.Dispatch<React.SetStateAction<number>>;
  setWaveVelocity: React.Dispatch<React.SetStateAction<number>>;
  ultrasonicResults: { eDyn: number; fcEst: number; };
  velocity: number;
  waveVelocity: number;
}

export default function AkustischTab({ frequency, impactEchoResults, renderEmbeddedGeraete, setFrequency, setVelocity, setWaveVelocity, ultrasonicResults, velocity, waveVelocity }: AkustischTabProps) {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Ultraschall */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-shiraz/10 rounded-lg text-shiraz">
            <Search size={24} />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Ultraschalllaufzeit</h2>
        </div>

        <div className="text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.dieUltraschallgeschwindigkeitHängtVon} /></p>
        </div>

        <Slider
          label={<FormulaText text={inhalt.werte.ultraschallgeschwindigkeitV} />}
          min={2.0} max={5.0} step={0.1}
          value={velocity} unit="km/s"
          onChange={(e) => setVelocity(Number(e.target.value))}
        />

        <div className="mt-4 p-4 bg-shiraz text-white rounded-xl shadow-md relative overflow-hidden">
          <div className="text-sm opacity-90 mb-1"><FormulaText text={inhalt.werte.dynElastizitätsmodulEDyn} /></div>
          <div className="text-3xl font-bold">{formatDeZahl(ultrasonicResults.eDyn, 1)} GPa</div>
          <div className="text-xs opacity-75 mt-2">
            <FormulaText text={`\\text{Grobe Festigkeitsabschätzung: } \\approx ${formatDeTeX(ultrasonicResults.fcEst, 1)} \\text{ N/mm}^2`} />
          </div>
          {/* Animation */}
          <div className="absolute right-0 top-0 h-full w-full pointer-events-none">
            <div 
              className="h-full w-2 bg-white/30 absolute top-0 left-0"
              style={{ animation: `scan ${6 - velocity}s linear infinite` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Impact-Echo */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-shiraz/10 rounded-lg text-shiraz">
            <Waves size={24} />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Impuls-Echo-Verfahren</h2>
        </div>
        
        <div className="text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.einMechanischerImpulsErzeugt} /></p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Slider
            label={inhalt.werte.resonanzfrequenzF}
            min={2} max={50} step={1}
            value={frequency} unit="kHz"
            info={inhalt.werte.gemesseneDominanteFrequenzIm}
            onChange={(e) => setFrequency(Number(e.target.value))}
          />
          <Slider
            label={inhalt.werte.wellengeschwindigkeitV}
            min={3000} max={5000} step={100}
            value={waveVelocity} unit="m/s"
            
            onChange={(e) => setWaveVelocity(Number(e.target.value))}
          />
        </div>

        <div className="mt-4 p-4 bg-shiraz text-white rounded-xl shadow-md relative overflow-hidden">
          <div className="text-sm opacity-90 mb-1"><MdText text={inhalt.texte.berechneteTiefeBauteildickeFehlstelle} /></div>
          <div className="text-3xl font-bold">{formatDeZahl(impactEchoResults.depth, 0)} mm</div>
          <div className="text-[11px] opacity-80 mt-1"><MdText text={inhalt.texte.dVP2} /></div>
          
          {/* Impact-Echo Animation */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1">
            <div className="w-8 h-1 bg-white/50 rounded-full animate-ping" style={{ animationDuration: `${100/frequency}s` }}></div>
            <div className="w-12 h-1 bg-white/30 rounded-full animate-ping" style={{ animationDuration: `${100/frequency}s`, animationDelay: '0.1s' }}></div>
            <div className="w-16 h-1 bg-white/10 rounded-full animate-ping" style={{ animationDuration: `${100/frequency}s`, animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
      </div>
      {/* Section: Zugehörige Geräte aus Gerätepool */}
      {renderEmbeddedGeraete('akustisch', ['ultraschall'])}
    </div>
  );
}
