// Ausgelagert aus src/modules/ZfP.tsx (AP 5.2)
import { formatDeZahl } from '@/src/utils/numberFormat';
import React from 'react';
import { Slider } from '@/src/components/ui/Slider';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { Thermometer, Radiation } from 'lucide-react';

export interface ThermischTabProps {
  radiationEnergy: number;
  radiographyResults: { transmission: number; quality: string; color: string; };
  renderEmbeddedGeraete: (tabKey: string, deviceIds: string[]) => React.JSX.Element | null;
  setRadiationEnergy: React.Dispatch<React.SetStateAction<number>>;
  setTempDiff: React.Dispatch<React.SetStateAction<number>>;
  setThickness: React.Dispatch<React.SetStateAction<number>>;
  tempDiff: number;
  thermographyResults: { indication: string; color: string; };
  thickness: number;
}

export default function ThermischTab({ radiationEnergy, radiographyResults, renderEmbeddedGeraete, setRadiationEnergy, setTempDiff, setThickness, tempDiff, thermographyResults, thickness }: ThermischTabProps) {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Infrarot-Thermografie */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-shiraz/10 rounded-lg text-shiraz">
            <Thermometer size={24} />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Infrarot-Thermografie</h2>
        </div>
        
        <div className="text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-home-grau/30">
          <p>
            Erfasst die Oberflächentemperatur. Hohlräume oder Ablösungen unter der Oberfläche erwärmen sich bei Sonneneinstrahlung schneller als massiver Beton.
          </p>
        </div>

        <Slider info="Parameter zur Anpassung der Berechnung."
          label={<FormulaText text="Temperaturdifferenz (\Delta T)" />}
          min={0} max={5} step={0.1}
          value={tempDiff} unit="K"
          
          onChange={(e) => setTempDiff(Number(e.target.value))}
        />

        <div className={`mt-4 p-4 text-white rounded-xl shadow-md transition-colors duration-500 ${thermographyResults.color} relative overflow-hidden`}>
          <div className="text-sm opacity-90 mb-1">Befund</div>
          <div className="text-3xl font-bold">{thermographyResults.indication}</div>
          
          {/* Thermografie Animation */}
          <div className="absolute right-0 top-0 h-full w-1/3 opacity-50" style={{
            background: `linear-gradient(90deg, transparent, ${tempDiff > 2 ? 'rgba(255,0,0,0.8)' : tempDiff > 0.5 ? 'rgba(255,255,0,0.8)' : 'rgba(0,255,0,0.8)'})`
          }}></div>
        </div>
      </div>

      {/* Durchstrahlungsprüfung */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-shiraz/10 rounded-lg text-shiraz">
            <Radiation size={24} />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Durchstrahlungsprüfung (Radiographie)</h2>
        </div>
        
        <div className="text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-home-grau/30">
          <p>
            Nutzt Röntgen- oder Gammastrahlung zur Abbildung des Bauteilinneren (z.B. Spannglieder). Die Schwächung hängt von Dicke und Dichte ab.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Slider info="Parameter zur Anpassung der Berechnung."
            label={<FormulaText text="Bauteildicke (d)" />}
            min={5} max={100} step={1}
            value={thickness} unit="cm"
            
            onChange={(e) => setThickness(Number(e.target.value))}
          />
          <Slider
            label="Strahlungsenergie"
            min={0.5} max={15.0} step={0.5}
            value={radiationEnergy} unit="MeV"
            info="Höhere Energie durchdringt dickere Bauteile."
            onChange={(e) => setRadiationEnergy(Number(e.target.value))}
          />
        </div>

        <div className={`mt-4 p-4 text-white rounded-xl shadow-md transition-colors duration-500 ${radiographyResults.color} relative overflow-hidden`}>
          <div className="text-sm opacity-90 mb-1">Transmission & Bildqualität</div>
          <div className="text-3xl font-bold">{formatDeZahl(radiographyResults.transmission, 2)} %</div>
          <div className="text-xs opacity-75 mt-2">
            Qualität: {radiographyResults.quality}
          </div>
          
          {/* Radiography Animation */}
          <div className="absolute right-0 top-0 h-full w-1/2 flex items-center justify-center opacity-30">
            <div className="w-full h-full bg-gradient-to-r from-transparent to-white" style={{ opacity: radiographyResults.transmission / 100 }}></div>
          </div>
        </div>
      </div>
      </div>
      {/* Section: Zugehörige Geräte aus Gerätepool */}
      {renderEmbeddedGeraete('thermisch', ['thermografie', 'bte', 'lanze', 'blowerdoor'])}
    </div>
  );
}
