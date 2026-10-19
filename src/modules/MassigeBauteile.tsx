import React, { useState } from 'react';
import { Layers, ThermometerSun } from 'lucide-react';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';

export default function MassigeBauteile() {
  const [zementGehalt, setZementGehalt] = useState(350);
  
  // Adiabatischer Temperaturanstieg approx: dt = (z * H) / (c * rho)
  // z: zementgehalt in kg/m3. H ~ 350 kJ/kg, c*rho ~ 2500 kJ/(m3 K)
  // so dt ~ z * 350 / 2500 = z * 0.14
  const deltaT = zementGehalt * 0.14;

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-shiraz/10 rounded-lg text-shiraz">
            <ThermometerSun size={24} />
          </div>
          <h2 className="text-2xl font-bold text-text-main">Massige Bauteile</h2>
        </div>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
              Als massige Bauteile gelten Betonbauteile mit einer kleinsten Abmessung von mehr als 0,80 m (DAfStb-Richtlinie). 
              Durch die hohe Hydratationswärme und die schlechte Wärmeleitfähigkeit von Beton entstehen in solchen 
              Bauteilen große Temperaturgradienten zwischen dem heißen Kern und der abkühlenden Randzone, was 
              ohne Gegenmaßnahmen zu Zwangspannungen und Rissen führt.
            </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-home-grau/30 shadow-sm">
          <h3 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5 text-shiraz" /> Maßnahmen gegen Rissbildung
          </h3>
          <ul className="space-y-3 mb-6">
            <li className="flex gap-2 text-sm text-text-main/80">
              <span className="text-shiraz font-bold">•</span>
              Verwendung von Zementen mit niedriger Hydratationswärme (LH-Zemente, z. B. CEM III).
            </li>
            <li className="flex gap-2 text-sm text-text-main/80">
              <span className="text-shiraz font-bold">•</span>
              Reduktion des Zementgehalts durch Zumischung von Flugasche (FA).
            </li>
            <li className="flex gap-2 text-sm text-text-main/80">
              <span className="text-shiraz font-bold">•</span>
              Kühlung des Frischbetons (Zugabe von Scherbeneis statt Zugabewasser).
            </li>
            <li className="flex gap-2 text-sm text-text-main/80">
              <span className="text-shiraz font-bold">•</span>
              Einbau von Kühlrohren im Bauteil (Rohrkühlung).
            </li>
            <li className="flex gap-2 text-sm text-text-main/80">
              <span className="text-shiraz font-bold">•</span>
              Wärmedämmende Schalungen, um den Temperaturgradienten zum Rand zu reduzieren (verhindert den "Thermoschock" bei frühem Ausschalen).
            </li>
          </ul>

          <div className="bg-home-grau/5 rounded-2xl p-4">
            <div className="text-sm text-blue-700 mb-2"><FormulaText text="\Delta T_{ad} = \frac{z \cdot H}{c_p \cdot \rho}" /></div>
            <p className="text-xs text-text-main/70">
              Maximaler adiabatischer Temperaturanstieg. 
              z: Zementgehalt, H: Hydratationswärme, c_p: Spezifische Wärmekapazität, ρ: Dichte.
            </p>
          </div>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-home-grau/30 shadow-sm relative overflow-hidden">
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-orange-50 rounded-full blur-2xl"></div>
          <h3 className="text-lg font-bold text-text-main mb-4 relative z-10">Erwärmung (Abschätzung)</h3>
          
          <div className="space-y-6 relative z-10">
            <div>
              <label className="text-sm font-medium text-text-main flex justify-between mb-2">
                <span>Zementgehalt <FormulaText text="z" /></span>
                <span className="text-shiraz font-bold">{zementGehalt} kg/m³</span>
              </label>
              <input 
                type="range" min="250" max="500" step="10"
                value={zementGehalt}
                onChange={(e) => setZementGehalt(Number(e.target.value))}
                className="w-full accent-middle-blue"
              />
              <div className="flex justify-between text-xs text-home-grau mt-1">
                <span>Massiv (LH)</span><span>Hochfest</span>
              </div>
            </div>
            
            <div className="bg-orange-50 border border-orange-100 p-6 rounded-2xl flex flex-col items-center justify-center">
              <div className="text-xs text-orange-800/80 mb-2 font-semibold uppercase tracking-wider">Adiabatischer Temp.-Anstieg <FormulaText text="\Delta T_{ad}" /></div>
              <div className="text-4xl font-black text-orange-600 mb-2"><FormulaText text={`+${deltaT.toFixed(1)}`} /> <span className="text-xl">K</span></div>
              <p className="text-[10px] text-orange-900/60 text-center">
                Bei einer Frischbetontemperatur von 20°C erhitzt sich der Betonkern 
                abgeschirmt auf ca. {(20 + deltaT).toFixed(0)}°C!
              </p>
            </div>
          </div>
        </div>
      </div>

      <ModuleFooter
        wikipedia={[
          { title: 'Hydratationswärme', url: 'https://de.wikipedia.org/wiki/Hydratationsw%C3%A4rme' },
          { title: 'Massenbeton', url: 'https://de.wikipedia.org/wiki/Massenbeton' },
          { title: 'Zwangspannung', url: 'https://de.wikipedia.org/wiki/Zwang' }
        ]}
        literatur={[
          'DAfStb-Richtlinie Massige Bauteile aus Beton (Deutscher Ausschuss für Stahlbeton)',
          'Breitenbücher, R.: Zwangsspannungen und Rissbildung im jungen Beton (Bauwerk Verlag)',
          'Springenschmid, R.: Vermeidung von Rissen in jungen Massenbetonbauteilen (Ernst & Sohn)'
        ]}
        regelwerke={[
          { title: 'DAfStb-Richtlinie Massige Bauteile aus Beton', url: 'https://www.dafstb.de/' },
          { title: 'DIN 1045-2:2023-08 / DIN EN 206 (Anforderungen an LH- und VLH-Zemente)', url: 'https://www.dinmedia.de/de/suche?q=DIN+1045-2' },
          { title: 'DIN EN 197-1 (Zement mit niedriger Hydratationswärme LH)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+197-1' }
        ]}
        formeln={[
          {
            formel: '\\Delta T_{ad} = \\frac{z \\cdot Q_h}{c_p \\cdot \\rho}',
            erklaerung: 'Maximal möglicher adiabatischer Temperaturanstieg im Kern massiger Bauteile ohne Wärmeabfuhr (z: Zementgehalt in kg/m³, Q_h: Hydratationswärme in J/kg, c_p: spezifische Wärmekapazität ~ 1.0 kJ/(kg·K), ρ: Betondichte ~ 2400 kg/m³).',
            quelle: 'DAfStb-Richtlinie Massige Bauteile'
          },
          {
            formel: '\\Delta T_{\\text{Kern-Rand}} \\le 15\\,\\text{K} \\dots 20\\,\\text{K}',
            erklaerung: 'Kritischer Grenzwert des Temperaturunterschieds zwischen heißem Kern und abkühlendem Rand zur Vermeidung oberflächennaher Trenn- und Schalenrisse durch Eigenspannungen.',
            quelle: 'DAfStb / DBV-Merkblatt'
          }
        ]}
      />
    </div>
  );
}
