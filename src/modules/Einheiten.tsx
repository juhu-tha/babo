import React, { useState } from 'react';
import { Scale, Calculator, ArrowRight } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { BlockMath, InlineMath } from 'react-katex';

type UnitCategory = 'Länge' | 'Fläche' | 'Volumen' | 'Kraft' | 'Spannung/Druck' | 'Masse' | 'Dichte';

const units: Record<UnitCategory, { name: string; factor: number }[]> = {
  'Länge': [
    { name: 'm', factor: 1 },
    { name: 'mm', factor: 0.001 },
    { name: 'cm', factor: 0.01 },
    { name: 'km', factor: 1000 },
    { name: 'in (Zoll)', factor: 0.0254 },
    { name: 'ft (Fuß)', factor: 0.3048 },
  ],
  'Fläche': [
    { name: 'm²', factor: 1 },
    { name: 'mm²', factor: 0.000001 },
    { name: 'cm²', factor: 0.0001 },
    { name: 'a (Ar)', factor: 100 },
    { name: 'ha (Hektar)', factor: 10000 },
    { name: 'km²', factor: 1000000 },
  ],
  'Volumen': [
    { name: 'm³', factor: 1 },
    { name: 'mm³', factor: 0.000000001 },
    { name: 'cm³', factor: 0.000001 },
    { name: 'dm³ / Liter (l)', factor: 0.001 },
  ],
  'Kraft': [
    { name: 'N', factor: 1 },
    { name: 'kN', factor: 1000 },
    { name: 'MN', factor: 1000000 },
    { name: 'lbf', factor: 4.44822 },
  ],
  'Spannung/Druck': [
    { name: 'Pa (N/m²)', factor: 1 },
    { name: 'kPa', factor: 1000 },
    { name: 'MPa (N/mm²)', factor: 1000000 },
    { name: 'bar', factor: 100000 },
    { name: 'psi', factor: 6894.76 },
  ],
  'Masse': [
    { name: 'kg', factor: 1 },
    { name: 'g', factor: 0.001 },
    { name: 't', factor: 1000 },
    { name: 'lb (Pfund)', factor: 0.453592 },
  ],
  'Dichte': [
    { name: 'kg/m³', factor: 1 },
    { name: 'g/cm³', factor: 1000 },
    { name: 't/m³', factor: 1000 },
    { name: 'kg/dm³', factor: 1000 },
  ]
};

export default function Einheiten() {
  const [activeTab, setActiveTab] = useState<'grundlagen' | 'umrechner'>('grundlagen');
  
  const [category, setCategory] = useState<UnitCategory>('Länge');
  const [fromUnit, setFromUnit] = useState(units['Länge'][0].name);
  const [toUnit, setToUnit] = useState(units['Länge'][1].name);
  const [inputValue, setInputValue] = useState<number>(1);

  const handleCategoryChange = (cat: UnitCategory) => {
    setCategory(cat);
    setFromUnit(units[cat][0].name);
    setToUnit(units[cat][1].name);
  };

  const calculateConversion = () => {
    const fromFactor = units[category].find(u => u.name === fromUnit)?.factor || 1;
    const toFactor = units[category].find(u => u.name === toUnit)?.factor || 1;
    // Convert to base unit, then to target unit
    const baseValue = inputValue * fromFactor;
    return baseValue / toFactor;
  };
  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Scale className="text-shiraz" /> Einheiten im Bauwesen
        </h2>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            Das Internationale Einheitensystem (SI) bildet die Grundlage für alle physikalischen und technischen Berechnungen im Bauwesen.
            Neben den SI-Basiseinheiten sind abgeleitete Einheiten (wie Newton oder Pascal) und Vorsätze (wie Kilo oder Mega) von zentraler Bedeutung.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20">
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'grundlagen' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('grundlagen')}
          >
            <Scale size={16} /> Grundlagen &amp; SI-System
          </button>
          <button
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'umrechner' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('umrechner')}
          >
            <Calculator size={16} /> Einheitenumrechner
          </button>
        </div>
      </div>

      {activeTab === 'grundlagen' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
          <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2">SI-Basiseinheiten</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-home-grau/10 text-text-main">
                <tr>
                  <th className="px-4 py-2 rounded-tl-lg">Größe</th>
                  <th className="px-4 py-2">Formelzeichen</th>
                  <th className="px-4 py-2">Einheit</th>
                  <th className="px-4 py-2 rounded-tr-lg">Einheitenzeichen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-home-grau/20">
                <tr className="hover:bg-home-grau/5">
                  <td className="px-4 py-2 font-bold">Länge</td>
                  <td className="px-4 py-2"><InlineMath math="l" /></td>
                  <td className="px-4 py-2">Meter</td>
                  <td className="px-4 py-2">m</td>
                </tr>
                <tr className="hover:bg-home-grau/5">
                  <td className="px-4 py-2 font-bold">Masse</td>
                  <td className="px-4 py-2"><InlineMath math="m" /></td>
                  <td className="px-4 py-2">Kilogramm</td>
                  <td className="px-4 py-2">kg</td>
                </tr>
                <tr className="hover:bg-home-grau/5">
                  <td className="px-4 py-2 font-bold">Zeit</td>
                  <td className="px-4 py-2"><InlineMath math="t" /></td>
                  <td className="px-4 py-2">Sekunde</td>
                  <td className="px-4 py-2">s</td>
                </tr>
                <tr className="hover:bg-home-grau/5">
                  <td className="px-4 py-2 font-bold">Temperatur</td>
                  <td className="px-4 py-2"><InlineMath math="T" /></td>
                  <td className="px-4 py-2">Kelvin</td>
                  <td className="px-4 py-2">K</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
          <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2">Wichtige abgeleitete Einheiten</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-home-grau/10 text-text-main">
                <tr>
                  <th className="px-4 py-2 rounded-tl-lg">Größe</th>
                  <th className="px-4 py-2">Einheit</th>
                  <th className="px-4 py-2 rounded-tr-lg">Zusammensetzung</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-home-grau/20">
                <tr className="hover:bg-home-grau/5">
                  <td className="px-4 py-2 font-bold">Kraft (<InlineMath math="F" />)</td>
                  <td className="px-4 py-2">Newton (N)</td>
                  <td className="px-4 py-2"><InlineMath math="1 \text{ N} = 1 \frac{\text{kg} \cdot \text{m}}{\text{s}^2}" /></td>
                </tr>
                <tr className="hover:bg-home-grau/5">
                  <td className="px-4 py-2 font-bold">Druck / Spannung (<InlineMath math="p, \sigma" />)</td>
                  <td className="px-4 py-2">Pascal (Pa)</td>
                  <td className="px-4 py-2"><InlineMath math="1 \text{ Pa} = 1 \frac{\text{N}}{\text{m}^2}" /></td>
                </tr>
                <tr className="hover:bg-home-grau/5">
                  <td className="px-4 py-2 font-bold">Energie / Arbeit (<InlineMath math="E, W" />)</td>
                  <td className="px-4 py-2">Joule (J)</td>
                  <td className="px-4 py-2"><InlineMath math="1 \text{ J} = 1 \text{ N} \cdot \text{m}" /></td>
                </tr>
                <tr className="hover:bg-home-grau/5">
                  <td className="px-4 py-2 font-bold">Leistung (<InlineMath math="P" />)</td>
                  <td className="px-4 py-2">Watt (W)</td>
                  <td className="px-4 py-2"><InlineMath math="1 \text{ W} = 1 \frac{\text{J}}{\text{s}}" /></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-2 p-3 bg-shiraz/10 rounded-lg text-sm text-text-main space-y-2">
            <div>
              <strong>Wichtig im Bauwesen:</strong> Spannungen und Festigkeiten werden meist in <strong>N/mm²</strong> oder <strong>MPa</strong> angegeben.
            </div>
            <div className="text-xs text-text-main/90 bg-white/70 p-2.5 rounded-lg border border-shiraz/10 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>🍫 <strong className="text-shiraz">1 N</strong> entspricht ca. 1 Tafel Schokolade (100 g)</div>
              <div>👷 <strong className="text-shiraz">1 kN</strong> entspricht ca. 1 Bauarbeiter (100 kg)</div>
              <div>🐋 <strong className="text-shiraz">1 MN</strong> entspricht ca. 1 Wal (100 t)</div>
            </div>
            <BlockMath math="1 \text{ MPa} = 1 \frac{\text{N}}{\text{mm}^2} = 1.000.000 \text{ Pa}" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
          <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2">SI-Vorsätze (Präfixe)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-home-grau/10 text-text-main">
                <tr>
                  <th className="px-4 py-2 rounded-tl-lg">Vorsatz</th>
                  <th className="px-4 py-2">Zeichen</th>
                  <th className="px-4 py-2 rounded-tr-lg">Faktor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-home-grau/20">
                <tr className="hover:bg-home-grau/5">
                  <td className="px-4 py-2 font-bold">Giga</td>
                  <td className="px-4 py-2">G</td>
                  <td className="px-4 py-2"><InlineMath math="10^9" /> (Milliarde)</td>
                </tr>
                <tr className="hover:bg-home-grau/5">
                  <td className="px-4 py-2 font-bold">Mega</td>
                  <td className="px-4 py-2">M</td>
                  <td className="px-4 py-2"><InlineMath math="10^6" /> (Million)</td>
                </tr>
                <tr className="hover:bg-home-grau/5">
                  <td className="px-4 py-2 font-bold">Kilo</td>
                  <td className="px-4 py-2">k</td>
                  <td className="px-4 py-2"><InlineMath math="10^3" /> (Tausend)</td>
                </tr>
                <tr className="hover:bg-home-grau/5">
                  <td className="px-4 py-2 font-bold">Milli</td>
                  <td className="px-4 py-2">m</td>
                  <td className="px-4 py-2"><InlineMath math="10^{-3}" /> (Tausendstel)</td>
                </tr>
                <tr className="hover:bg-home-grau/5">
                  <td className="px-4 py-2 font-bold">Mikro</td>
                  <td className="px-4 py-2">µ</td>
                  <td className="px-4 py-2"><InlineMath math="10^{-6}" /> (Millionstel)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      )}

      {activeTab === 'umrechner' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6 animate-in fade-in duration-300">
          <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2">Interaktiver Einheitenumrechner</h3>
          
          <div className="flex flex-col gap-4 max-w-2xl mx-auto w-full">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-text-main">Kategorie</label>
              <select 
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value as UnitCategory)}
                className="p-3 border border-home-grau/30 rounded-lg bg-off-white focus:outline-none focus:border-shiraz"
              >
                {(Object.keys(units) as UnitCategory[]).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center mt-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-text-main">Von</label>
                <div className="flex flex-col gap-2">
                  <input 
                    type="number" 
                    value={inputValue}
                    onChange={(e) => setInputValue(Number(e.target.value))}
                    className="p-3 border border-home-grau/30 rounded-lg bg-off-white focus:outline-none focus:border-shiraz"
                  />
                  <select 
                    value={fromUnit}
                    onChange={(e) => setFromUnit(e.target.value)}
                    className="p-3 border border-home-grau/30 rounded-lg bg-off-white focus:outline-none focus:border-shiraz"
                  >
                    {units[category].map(u => (
                      <option key={u.name} value={u.name}>{u.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-center pt-6">
                <ArrowRight className="text-home-grau hidden md:block" size={24} />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-text-main">Nach</label>
                <div className="flex flex-col gap-2">
                  <div className="p-3 border border-shiraz/30 rounded-lg bg-shiraz/5 font-mono text-shiraz font-bold break-all">
                    {calculateConversion().toLocaleString('de-DE', { maximumFractionDigits: 6 })}
                  </div>
                  <select 
                    value={toUnit}
                    onChange={(e) => setToUnit(e.target.value)}
                    className="p-3 border border-home-grau/30 rounded-lg bg-off-white focus:outline-none focus:border-shiraz"
                  >
                    {units[category].map(u => (
                      <option key={u.name} value={u.name}>{u.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <ModuleFooter 
        wikipedia={[
          { title: 'Internationales Einheitensystem', url: 'https://de.wikipedia.org/wiki/Internationales_Einheitensystem' },
          { title: 'Basiseinheit', url: 'https://de.wikipedia.org/wiki/SI-Basiseinheit' },
          { title: 'Pascal (Einheit)', url: 'https://de.wikipedia.org/wiki/Pascal_(Einheit)' }
        ]}
        literatur={[
          'BIPM: Le Système international d’unités (SI Brochure, 9th Edition)',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011'
        ]}
        regelwerke={[
          { title: 'DIN 1301-1 (Einheiten - Einheitennamen, Einheitenzeichen)', url: 'https://www.dinmedia.de/de/suche?q=DIN+1301-1' },
          { title: 'DIN 1301-2 (Einheiten - Allgemein angewendete Teile und Vielfache)', url: 'https://www.dinmedia.de/de/suche?q=DIN+1301-2' },
          { title: 'DIN EN ISO 80000-1 (Größen und Einheiten - Teil 1: Allgemeines)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+ISO+80000-1' }
        ]}
        formeln={[
          {
            formel: '1\\,\\text{MPa} = 1\\,\\frac{\\text{N}}{\\text{mm}^2} = 10^6\\,\\frac{\\text{N}}{\\text{m}^2} = 10\\,\\text{bar} = 1000\\,\\text{kN/m}^2',
            erklaerung: 'Spannungs- und Druckäquivalenzen im Bauingenieurwesen: 1 Megapascal entspricht exakt einem Newton pro Quadratmillimeter.',
            quelle: 'DIN 1301-1'
          },
          {
            formel: '1\\,\\text{W/(m}\\cdot\\text{K)} = 1\\,\\frac{\\text{J}}{\\text{s}\\cdot\\text{m}\\cdot\\text{K}} \\quad \\text{und} \\quad 1\\,\\text{kN} = 1000\\,\\text{kg}\\cdot\\frac{\\text{m}}{\\text{s}^2} \\approx 100\\,\\text{kg}_F',
            erklaerung: 'Zusammenhang zwischen Wärmeleitfähigkeits- und Krafteinheiten im SI-System (Kraft F = m * a).',
            quelle: 'DIN EN ISO 80000-1'
          }
        ]}
      />
    </div>
  );
} 