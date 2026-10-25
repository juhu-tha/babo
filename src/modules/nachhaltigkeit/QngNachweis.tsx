import { formatDeWert, formatDeZahl } from '@/src/utils/numberFormat';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';

interface QngNachweisProps {
  bgf: number;
  constructionType: "holzbau" | "hybrid" | "massiv";
  greenTariff: boolean;
  heatingSystem: string;
  pvSizeKwp: number;
  qngComputation: { materialGwpAnnual: number; heatingGwpAnnual: number; pvYieldCo2Credit: number; totalYearlyGwp: number; label: string; ratingColor: string; status: string; };
  setBgf: Dispatch<SetStateAction<number>>;
  setConstructionType: Dispatch<SetStateAction<"holzbau" | "hybrid" | "massiv">>;
  setGreenTariff: Dispatch<SetStateAction<boolean>>;
  setHeatingSystem: Dispatch<SetStateAction<string>>;
  setPvSizeKwp: Dispatch<SetStateAction<number>>;
}

export default function QngNachweis({ bgf, constructionType, greenTariff, heatingSystem, pvSizeKwp, qngComputation, setBgf, setConstructionType, setGreenTariff, setHeatingSystem, setPvSizeKwp }: QngNachweisProps) {
  return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-300">

        {/* Editor control column (7-cols) */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5">

            <div className="border-b border-home-grau/30 pb-2">
              <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">Gebäudekonfiguration &amp; Primärenergetik</h3>
              <p className="text-xs text-slate-400 mt-0.5">Stellen Sie Bausubstanz und Betriebsenergie ein, um die QNG-Jahresbilanz zu berechnen.</p>
            </div>

            <div className="space-y-4">

              {/* BGF Slider */}
              <div>
                <div className="flex justify-between text-xs text-slate-900 font-bold mb-1.5">
                  <span>Bruttogrundfläche (BGF):</span>
                  <span className="font-mono text-shiraz">{formatDeWert(bgf)} m²</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="1500"
                  step="20"
                  value={bgf}
                  onChange={(e) => setBgf(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-shiraz"
                />
                <div className="flex justify-between text-[9px] text-slate-400 mt-1 uppercase tracking-wider font-mono">
                  <span>Einfamilienhaus (150 m²)</span>
                  <span>Mehrfamilienhaus (&gt; 800 m²)</span>
                </div>
              </div>

              {/* Construction materials selection block */}
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-2">Hauptsächliche Bauweise (Tragwerk &amp; Decken):</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'holzbau', name: 'Holzrahmen- & Massivholzbau', r_coef: 'Niedrige graue Energie' },
                    { id: 'hybrid', name: 'Holz-Beton-Hybridbau', r_coef: 'Ausgewogene graue Energie' },
                    { id: 'massiv', name: 'Klassischer Massivbau (Mauerwerk/Beton)', r_coef: 'Hohe graue Energie' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setConstructionType(item.id as any)}
                      className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                          constructionType === item.id
                            ? 'border-shiraz bg-shiraz/5 shadow-sm font-bold'
                            : 'border-home-grau/30 bg-white hover:border-home-grau/30'
                        }`}
                    >
                      <span className="text-xs text-slate-900 block font-bold leading-tight">{item.name}</span>
                      <span className="text-[9px] text-slate-400 leading-normal">{item.r_coef}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Heating systems */}
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-2">Energieträger / Primär-Heizungssystem:</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { id: 'waermepumpe', name: 'Zentrale Luft-Wasser-Wärmepumpe', details: 'Hocheffizienter Stromprozess' },
                    { id: 'fernwaerme', name: 'Fern- / Nahwärmenetz mit Kraft-Wärme-Kopplung', details: 'Fernwärme fossiler/regenerativer Mix' },
                    { id: 'biomasse', name: 'Pelletkessel / Holzbiomasse', details: 'CO2-neutraler Holzbrennstoff' },
                    { id: 'gasherdfossil', name: 'Fossil-Brennwertkessel (Erdgas)', details: 'Zukunftskritische fossile Verbrennung' }
                  ].map((item) => (
                    <button aria-pressed={heatingSystem === item.id}
                      key={item.id}
                      onClick={() => setHeatingSystem(item.id)}
                      className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                          heatingSystem === item.id
                            ? 'border-shiraz bg-shiraz/5 shadow-sm font-bold'
                            : 'border-home-grau/30 bg-white hover:border-home-grau/30'
                        }`}
                    >
                      <span className="text-xs text-slate-900 block font-bold leading-tight">{item.name}</span>
                      <span className="text-[9px] text-slate-400 leading-normal">{item.details}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tariffs and PV */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">

                {/* Green Tariff Switch */}
                <div className="bg-slate-50 p-4 border border-home-grau/30 rounded-xl flex items-center justify-between">
                  <div>
                    <strong className="text-xs text-slate-900 block">Ökostromvertrag (Zertifiziert)</strong>
                    <span className="text-[10px] text-slate-400">Senkt den Emissionsfaktor der Wärmepumpenschleife.</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={greenTariff}
                      onChange={(e) => setGreenTariff(e.target.checked)}
                      disabled={heatingSystem !== 'waermepumpe'}
                      className="sr-only peer" 
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600 peer-disabled:bg-slate-100 peer-disabled:after:bg-stone-300"></div>
                  </label>
                </div>

                {/* PV sizing slider */}
                <div className="bg-slate-50 p-3.5 border border-home-grau/30 rounded-xl">
                  <div className="flex justify-between text-xs text-slate-900 font-bold mb-1">
                    <span>Photovoltaikanlage:</span>
                    <span className="font-mono text-emerald-700 font-bold">{formatDeWert(pvSizeKwp)} kWp</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="40"
                    step="2"
                    value={pvSizeKwp}
                    onChange={(e) => setPvSizeKwp(parseInt(e.target.value))}
                    className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                  <span className="text-[9px] text-slate-400 block mt-0.5">Erzeugt Strom für Eigenverbrauch &amp; Netzeinspeisung.</span>
                </div>

              </div>

            </div>

          </div>
        </div>

        {/* QNG Certificate Gauge Display (5-cols) */}
        <div className="lg:col-span-5 flex flex-col gap-5 animate-in fade-in duration-300">

          {/* Main result badge */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col items-center justify-center text-center gap-4">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest block font-bold">
              PROGNOSTIZIERTE JAHRESBILANZ
            </span>

            <div className="flex flex-col items-center">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-medium">Nachweis-GWP</span>
              <strong className="text-4xl font-mono text-shiraz font-black mt-1">
                {formatDeZahl(qngComputation.totalYearlyGwp, 1)}
              </strong>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                kg CO₂-eq / m² NRF / Jahr
              </span>
            </div>

            {/* Status block showing certificate limits */}
            <div className={`w-full p-4 rounded-xl border text-center ${qngComputation.ratingColor}`}>
              <strong className="text-xs font-bold block uppercase tracking-wide leading-none">{qngComputation.label}</strong>
            </div>

            {/* Gauge Limits explanation */}
            <div className="w-full text-xs space-y-2 mt-2 leading-relaxed font-normal text-slate-500">
              <div className="flex justify-between items-center text-[11px] border-b border-stone-100 pb-1.5">
                <span className="font-bold">QNG-Premium Grenzwert:</span>
                <span className="font-mono bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">≤ 20,0</span>
              </div>
              <div className="flex justify-between items-center text-[11px] border-b border-stone-100 pb-1.5">
                <span className="font-bold">QNG-Plus Grenzwert:</span>
                <span className="font-mono bg-green-100 text-green-800 px-1.5 py-0.5 rounded font-bold">≤ 24,0</span>
              </div>
              <div className="flex justify-between items-center text-[11px] text-slate-400">
                <span>Projektlaufzeit Referenzwert:</span>
                <span>50 Jahre</span>
              </div>
            </div>

          </div>

          {/* Strategic Consultation Advice box */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-3.5">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 border-b border-home-grau/30 pb-1 flex items-center gap-1.5">
              <AlertTriangle size={14} className="text-amber-500 shrink-0" />
              Nachweis-Optimierungsempfehlungen
            </h4>

            <div className="space-y-3 text-xs leading-relaxed font-normal text-slate-700">

              {qngComputation.status === 'failed' && (
                <div className="flex gap-2.5 items-start bg-red-50 text-red-950 p-3 rounded-lg border border-red-150">
                  <span className="text-red-600 block text-lg leading-none shrink-0 font-bold">&#10007;</span>
                  <div>
                    <strong className="block text-[11px] font-bold">Fossile Energie blockiert das Siegel:</strong>
                    Der Erdgaskessel erzeugt extreme Verbrennungsfrachten von ca. 28 kg CO₂/(m² NRF · a). 
                    Das QNG-Siegel ist so unmöglich zu erreichen. 
                    <span className="font-bold block mt-1 underline">Lösung: Installiere eine Wärmepumpe.</span>
                  </div>
                </div>
              )}

              {constructionType === 'massiv' && (
                <div className="flex gap-2.5 items-start bg-white text-slate-850 p-3 rounded-lg border border-slate-200">
                  <span className="text-amber-600 block text-lg leading-none shrink-0 font-bold">&#9888;</span>
                  <div>
                    <strong className="block text-[11px] font-bold">Graue Energie des Massivbaus senken:</strong>
                    Decken und Pfahlgründungen aus Standardbeton binden Enormen Zement-Footprint. 
                    <span className="block mt-1">Lösung: Ersetze klassischen Beton durch Öko- oder RC-Beton bzw. wandle tragende Wände in Holzständerbauweisen um, um Negativgutschriften zu erwirtschaften.</span>
                  </div>
                </div>
              )}

              {pvSizeKwp < 10 && (
                <div className="flex gap-2.5 items-start bg-indigo-50 text-indigo-950 p-3 rounded-lg border border-indigo-150 animate-in fade-in">
                  <span className="text-indigo-600 block text-lg leading-none shrink-0 font-bold">&#10137;</span>
                  <div>
                    <strong className="block text-[11px] font-bold">PV-Potenziale ausschöpfen:</strong>
                    Die Photovoltaikanlage speist wertvollen Grünstrom ins Netz und verringert die eigene rechnerische Deckungslücke der QNG-Zertifizierung.
                    <span className="font-bold block mt-1">Lösung: PV-Leistung auf mindestens 12 kWp auslegen.</span>
                  </div>
                </div>
              )}

              {qngComputation.status === 'premium' && (
                <div className="flex gap-2.5 items-start bg-emerald-50 text-emerald-950 p-3 rounded-lg border border-emerald-150 animate-in shrink-0">
                  <CheckCircle size={16} className="text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[11px] font-bold text-emerald-900">Ausgezeichnete KfW 40 QNG-Förderfähigkeit:</strong>
                    Ihr Entwurf erzielt mit {formatDeZahl(qngComputation.totalYearlyGwp, 1)} kg CO₂-eq locker die Premium-Stufe. 
                    Sie erfüllen alle Anforderungen des BMWSB zur Beantragung zinsgünstiger Kredite.
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    );
}
