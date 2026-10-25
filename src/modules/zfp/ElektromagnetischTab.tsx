// Ausgelagert aus src/modules/ZfP.tsx (AP 5.2)
import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React from 'react';
import { Slider } from '@/src/components/ui/Slider';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { Magnet, Zap, Waves } from 'lucide-react';

export interface ElektromagnetischTabProps {
  barDiameter: number;
  bewehrungssucherResults: { signalStrength: number; };
  cover: number;
  dielectric: number;
  radarResults: { vRadar: number; depth: number; };
  renderEmbeddedGeraete: (tabKey: string, deviceIds: string[]) => React.JSX.Element | null;
  setBarDiameter: React.Dispatch<React.SetStateAction<number>>;
  setCover: React.Dispatch<React.SetStateAction<number>>;
  setDielectric: React.Dispatch<React.SetStateAction<number>>;
  setTimeOfFlight: React.Dispatch<React.SetStateAction<number>>;
  timeOfFlight: number;
}

export default function ElektromagnetischTab({ barDiameter, bewehrungssucherResults, cover, dielectric, radarResults, renderEmbeddedGeraete, setBarDiameter, setCover, setDielectric, setTimeOfFlight, timeOfFlight }: ElektromagnetischTabProps) {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Elektromagnetischer Bewehrungssucher */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-shiraz/10 rounded-lg text-shiraz">
            <Magnet size={24} />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Elektromagnetischer Bewehrungssucher</h2>
        </div>
        
        <div className="text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-home-grau/30">
          <p>
            Nutzt das Wirbelstromverfahren zur Ortung von Bewehrungsstäben und Messung der Betondeckung.
          </p>
        </div>

        <Slider
          label="Betondeckung"
          min={10} max={100} step={1}
          value={cover} unit="mm"
          info="Abstand der Bewehrung zur Oberfläche."
          onChange={(e) => setCover(Number(e.target.value))}
        />
        
        <Slider
          label="Stabdurchmesser"
          min={6} max={40} step={2}
          value={barDiameter} unit="mm"
          
          onChange={(e) => setBarDiameter(Number(e.target.value))}
        />

        <div className="mt-4 p-4 bg-shiraz text-white rounded-xl shadow-md relative overflow-hidden">
          <div className="text-sm opacity-90 mb-1">Relative Signalstärke</div>
          <div className="text-3xl font-bold">{formatDeZahl(bewehrungssucherResults.signalStrength, 0)} %</div>
          
          {/* Animation für Signalstärke */}
          <div className="relative w-full h-48 bg-slate-200 rounded-lg overflow-hidden border border-home-grau/30 mt-4">
            {/* Concrete Texture */}
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
            
            {/* Sensor */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-6 bg-shiraz rounded-b-md flex items-center justify-center z-10 shadow-md">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
            
            {/* Magnetic Field Lines (simplified) */}
            <svg className="absolute inset-0 w-full h-full" style={{ opacity: bewehrungssucherResults.signalStrength / 100 }}>
              {/* SVG-Pfade akzeptieren keine %-Koordinaten → zentriertes Unter-SVG */}
              <svg x="50%" overflow="visible">
                <path d="M 0 24 Q -40 50 0 100" stroke="rgba(230, 57, 70, 0.3)" strokeWidth="2" fill="none" className="animate-pulse" />
                <path d="M 0 24 Q 40 50 0 100" stroke="rgba(230, 57, 70, 0.3)" strokeWidth="2" fill="none" className="animate-pulse" />
              </svg>
            </svg>

            {/* Rebar */}
            <div 
              className="absolute left-0 w-full bg-gray-700 shadow-inner flex items-center justify-center transition-all duration-300"
              style={{ 
                top: `${Math.max(15, Math.min(85, (cover / 100) * 100))}%`, 
                height: `${Math.max(6, barDiameter * 1.5)}px` 
              }}
            >
              <div className="w-full h-full opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(255,255,255,0.8) 10px, rgba(255,255,255,0.8) 12px)' }}></div>
            </div>
            
            {/* Dimension line */}
            <div 
              className="absolute left-1/2 -translate-x-1/2 border-l-2 border-shiraz z-10 transition-all duration-300"
              style={{
                top: '24px',
                height: `calc(${Math.max(15, Math.min(85, (cover / 100) * 100))}% - 24px)`
              }}
            >
              <div className="absolute -left-1 top-0 w-2 h-0.5 bg-shiraz"></div>
              <div className="absolute -left-1 bottom-0 w-2 h-0.5 bg-shiraz"></div>
            </div>
            
            <div 
              className="absolute left-1/2 ml-3 text-xs font-bold text-shiraz bg-white/90 px-1.5 py-0.5 rounded shadow-sm z-10 transition-all duration-300"
              style={{
                top: `calc(${Math.max(15, Math.min(85, (cover / 100) * 100)) / 2}% + 12px)`,
                transform: 'translateY(-50%)'
              }}
            >
              c = {formatDeWert(cover)} mm
            </div>
          </div>
          <div className="absolute bottom-0 left-0 h-1 bg-white/50 w-full">
            <div 
              className="h-full bg-white transition-all duration-300 ease-out" 
              style={{ width: `${bewehrungssucherResults.signalStrength}%` }}
            />
          </div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center">
            <div 
              className="rounded-full border-2 border-white/50 animate-ping absolute"
              style={{ width: `${bewehrungssucherResults.signalStrength}%`, height: `${bewehrungssucherResults.signalStrength}%`, minWidth: '20px', minHeight: '20px', maxWidth: '80px', maxHeight: '80px' }}
            ></div>
            <div className="w-4 h-4 bg-white rounded-full z-10"></div>
          </div>
        </div>
      </div>

      {/* Georadar */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-shiraz/10 rounded-lg text-shiraz">
            <Zap size={24} />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Georadar (GPR)</h2>
        </div>
        
        <div className="text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-home-grau/30">
          <p>
            Sendet elektromagnetische Impulse aus. Reflexionen an Materialgrenzen (z.B. Stahl, Hohlräume) werden gemessen.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Slider info="Parameter zur Anpassung der Berechnung."
            label={<FormulaText text="Dielektrizitätszahl (\varepsilon_r)" />}
            min={4.0} max={12.0} step={0.5}
            value={dielectric} unit="-"
            onChange={(e) => setDielectric(Number(e.target.value))}
          />
          
          <Slider
            label={<FormulaText text="Laufzeit (t)" />}
            min={0.5} max={5.0} step={0.1}
            value={timeOfFlight} unit="ns"
            info="Zeit vom Senden bis zum Empfang des Echos."
            onChange={(e) => setTimeOfFlight(Number(e.target.value))}
          />
        </div>

        <div className="mt-4 p-4 bg-shiraz text-white rounded-xl shadow-md relative overflow-hidden">
          <div className="text-sm opacity-90 mb-1">Berechnete Tiefe des Objekts</div>
          <div className="text-3xl font-bold">{formatDeZahl(radarResults.depth, 1)} mm</div>
          <div className="text-xs opacity-75 mt-2">
            Radargeschwindigkeit: {formatDeZahl(radarResults.vRadar, 1)} mm/ns
          </div>
          {/* Animation */}
          <div className="relative w-full h-48 bg-slate-200 rounded-lg overflow-hidden border border-home-grau/30 mt-4">
            {/* Concrete Texture */}
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '15px 15px' }}></div>
            
            {/* Sensor */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-8 bg-blue-600 rounded-b-md flex items-center justify-center z-10 shadow-md">
              <Zap size={16} className="text-white" />
            </div>
            
            {/* Radar Waves (SVG) */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="radarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(37, 99, 235, 0.6)" />
                  <stop offset="100%" stopColor="rgba(37, 99, 235, 0)" />
                </linearGradient>
              </defs>
              <path 
                d={`M 50 16.7 L ${50 - radarResults.depth/5} ${Math.min(90, 32 + radarResults.depth/2)} L ${50 + radarResults.depth/5} ${Math.min(90, 32 + radarResults.depth/2)} Z`} /* viewBox 0–100: Prozentkoordinaten ohne %-Zeichen (in SVG-Pfaden ungültig); Start = Unterkante Sensor (32 px von 192 px) */ 
                fill="url(#radarGrad)" 
                className="animate-pulse"
                style={{ animationDuration: '2s' }}
              />
            </svg>

            {/* Target Object (e.g. void or pipe) */}
            <div 
              className="absolute left-1/2 -translate-x-1/2 w-16 h-8 bg-gray-800 rounded-full border-2 border-gray-600 shadow-inner transition-all duration-300"
              style={{ 
                top: `${Math.min(85, 15 + radarResults.depth/3)}%`,
              }}
            ></div>
            
            {/* Dimension line */}
            <div 
              className="absolute left-[60%] border-l-2 border-blue-600 z-10 transition-all duration-300"
              style={{
                top: '32px',
                height: `calc(${Math.min(85, 15 + radarResults.depth/3)}% - 32px)`
              }}
            >
              <div className="absolute -left-1 top-0 w-2 h-0.5 bg-blue-600"></div>
              <div className="absolute -left-1 bottom-0 w-2 h-0.5 bg-blue-600"></div>
            </div>
            
            <div 
              className="absolute left-[60%] ml-3 text-xs font-bold text-blue-700 bg-white/90 px-1.5 py-0.5 rounded shadow-sm z-10 transition-all duration-300"
              style={{
                top: `calc(${Math.min(85, 15 + radarResults.depth/3)} / 2% + 16px)`,
                transform: 'translateY(-50%)'
              }}
            >
              d = {formatDeZahl(radarResults.depth, 0)} mm
            </div>
          </div>
          <div className="absolute right-8 top-0 h-full w-32 flex flex-col items-center justify-between py-2">
            <div className="w-full h-1 bg-white/30 rounded-full animate-pulse"></div>
            <div className="w-4 h-4 bg-white rounded-full animate-bounce"></div>
            <div className="w-full h-1 bg-white/30 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
      </div>
      {/* Section: Zugehörige Geräte aus Gerätepool */}
      {renderEmbeddedGeraete('elektromagnetisch', ['georadar', 'betondeckung'])}
    </div>
  );
}
