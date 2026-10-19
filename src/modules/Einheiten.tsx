import React, { useState } from 'react';
import { Scale, Calculator, ArrowRight } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { BlockMath, InlineMath } from 'react-katex';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';

type UnitCategory = 'Länge' | 'Fläche' | 'Volumen' | 'Kraft' | 'Spannung/Druck' | 'Masse' | 'Dichte' | 'Moment' | 'Energie' | 'Temperatur';

// offset: additive Verschiebung zur Basiseinheit (nur Temperatur: Basis = Kelvin)
const units: Record<UnitCategory, { name: string; factor: number; offset?: number }[]> = {
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
  ],
  'Moment': [
    { name: 'kNm', factor: 1000 },
    { name: 'Nm', factor: 1 },
    { name: 'Nmm', factor: 0.001 },
    { name: 'kNcm', factor: 10 },
    { name: 'MNm', factor: 1000000 },
  ],
  'Energie': [
    { name: 'kWh', factor: 3600000 },
    { name: 'J (Ws)', factor: 1 },
    { name: 'kJ', factor: 1000 },
    { name: 'MJ', factor: 1000000 },
    { name: 'kcal', factor: 4186.8 },
  ],
  'Temperatur': [
    { name: '°C', factor: 1, offset: 273.15 },
    { name: 'K', factor: 1, offset: 0 },
    { name: '°F', factor: 5 / 9, offset: 273.15 - 32 * 5 / 9 },
  ]
};

/** Ergebnisanzeige: sehr kleine/große Beträge in Zehnerpotenz-Schreibweise statt gerundeter 0 */
const HOCH: Record<string, string> = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
const formatErgebnis = (x: number): string => {
  if (!Number.isFinite(x)) return '–';
  const a = Math.abs(x);
  if (a === 0 || (a >= 1e-4 && a < 1e12)) return x.toLocaleString('de-DE', { maximumSignificantDigits: 10 });
  const exp = Math.floor(Math.log10(a));
  const mant = x / Math.pow(10, exp);
  return `${mant.toLocaleString('de-DE', { maximumSignificantDigits: 6 })} · 10${String(exp).split('').map(c => HOCH[c] ?? c).join('')}`;
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
    const from = units[category].find(u => u.name === fromUnit) ?? units[category][0];
    const to = units[category].find(u => u.name === toUnit) ?? units[category][0];
    // In Basiseinheit umrechnen (bei Temperatur mit Nullpunktverschiebung), dann in Zieleinheit
    const baseValue = inputValue * from.factor + (from.offset ?? 0);
    return (baseValue - (to.offset ?? 0)) / to.factor;
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
                  <td className="px-4 py-2 font-bold">Thermodynamische Temperatur</td>
                  <td className="px-4 py-2"><InlineMath math="T" /></td>
                  <td className="px-4 py-2">Kelvin</td>
                  <td className="px-4 py-2">K</td>
                </tr>
                <tr className="hover:bg-home-grau/5">
                  <td className="px-4 py-2 font-bold">Elektrische Stromstärke</td>
                  <td className="px-4 py-2"><InlineMath math="I" /></td>
                  <td className="px-4 py-2">Ampere</td>
                  <td className="px-4 py-2">A</td>
                </tr>
                <tr className="hover:bg-home-grau/5">
                  <td className="px-4 py-2 font-bold">Stoffmenge</td>
                  <td className="px-4 py-2"><InlineMath math="n" /></td>
                  <td className="px-4 py-2">Mol</td>
                  <td className="px-4 py-2">mol</td>
                </tr>
                <tr className="hover:bg-home-grau/5">
                  <td className="px-4 py-2 font-bold">Lichtstärke</td>
                  <td className="px-4 py-2"><InlineMath math="I_v" /></td>
                  <td className="px-4 py-2">Candela</td>
                  <td className="px-4 py-2">cd</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-2 p-3 bg-off-white rounded-lg text-xs text-text-main/80 border border-home-grau/20">
            Seit der SI-Revision 2019 sind alle sieben Basiseinheiten über festgelegte Naturkonstanten definiert (z. B. das Kilogramm über die Planck-Konstante). Die <strong>Celsius-Temperatur</strong> ist eine abgeleitete Größe: <InlineMath math="\vartheta / {}^\circ\text{C} = T/\text{K} - 273{,}15" />. Temperatur<em>differenzen</em> sind in K und °C zahlengleich – deshalb stehen Wärmedehnzahlen und U-Werte mit „K“ im Nenner.
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
              <div>🍫 <strong className="text-shiraz">1 N</strong> ≈ Gewichtskraft einer Tafel Schokolade (100 g)</div>
              <div>👷 <strong className="text-shiraz">1 kN</strong> ≈ Gewichtskraft eines Bauarbeiters mit Ausrüstung (100 kg)</div>
              <div>🐋 <strong className="text-shiraz">1 MN</strong> ≈ Gewichtskraft eines großen Wals (100 t)</div>
            </div>
            <BlockMath math="1 \text{ MPa} = 1 \frac{\text{N}}{\text{mm}^2} = 10^6 \text{ Pa} = 1000 \frac{\text{kN}}{\text{m}^2}" />
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
                  <td className="px-4 py-2 font-bold">Hekto</td>
                  <td className="px-4 py-2">h</td>
                  <td className="px-4 py-2"><InlineMath math="10^2" /> (Hundert, z. B. Hektar)</td>
                </tr>
                <tr className="hover:bg-home-grau/5">
                  <td className="px-4 py-2 font-bold">Dezi</td>
                  <td className="px-4 py-2">d</td>
                  <td className="px-4 py-2"><InlineMath math="10^{-1}" /> (Zehntel, z. B. dm³ = Liter)</td>
                </tr>
                <tr className="hover:bg-home-grau/5">
                  <td className="px-4 py-2 font-bold">Zenti</td>
                  <td className="px-4 py-2">c</td>
                  <td className="px-4 py-2"><InlineMath math="10^{-2}" /> (Hundertstel)</td>
                </tr>
                <tr className="hover:bg-home-grau/5">
                  <td className="px-4 py-2 font-bold">Milli</td>
                  <td className="px-4 py-2">m</td>
                  <td className="px-4 py-2"><InlineMath math="10^{-3}" /> (Tausendstel)</td>
                </tr>
                <tr className="hover:bg-home-grau/5">
                  <td className="px-4 py-2 font-bold">Mikro</td>
                  <td className="px-4 py-2">µ</td>
                  <td className="px-4 py-2"><InlineMath math="10^{-6}" /> (Millionstel, z. B. µm Rissbreite)</td>
                </tr>
                <tr className="hover:bg-home-grau/5">
                  <td className="px-4 py-2 font-bold">Nano</td>
                  <td className="px-4 py-2">n</td>
                  <td className="px-4 py-2"><InlineMath math="10^{-9}" /> (Milliardstel, z. B. nm Gelporen)</td>
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
                    {formatErgebnis(calculateConversion())}
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

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-2">
        <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2">Anwendung: Einheiten sicher durch eine Rechnung führen</h3>
        <p className="text-sm text-text-main/80">
          Die häufigsten Fehler in Prüfungen und Statik entstehen nicht in der Formel, sondern beim Umrechnen. Bewährte Regel: <strong>alle Größen zuerst in N und mm</strong> umrechnen – dann ergibt sich jede Spannung direkt in N/mm² (= MPa).
        </p>
        <FormulaDerivationBox
          title="Beispiel 1: Druckspannung in einer Stütze"
          zielGleichung="\sigma = \frac{F}{A}"
          schritte={[
            { titel: 'Gegeben', erklaerung: 'Normalkraft F = 500 kN, Querschnitt 30 cm × 30 cm.', formel: 'F = 500\,\text{kN} = 500\,000\,\text{N},\quad A = 300 \cdot 300 = 90\,000\,\text{mm}^2' },
            { titel: 'Spannung', erklaerung: 'Division in N und mm liefert direkt N/mm²:', formel: '\sigma = \frac{500\,000\,\text{N}}{90\,000\,\text{mm}^2} = 5{,}56\,\frac{\text{N}}{\text{mm}^2} = 5{,}56\,\text{MPa}', einheit: 'N/mm²' },
            { titel: 'Typischer Fehler', erklaerung: 'Wer kN durch cm² teilt, erhält kN/cm² – das Ergebnis 0,556 ist um den Faktor 10 kleiner als der MPa-Wert (1 kN/cm² = 10 N/mm²).', formel: '\frac{500\,\text{kN}}{900\,\text{cm}^2} = 0{,}556\,\frac{\text{kN}}{\text{cm}^2} = 5{,}56\,\frac{\text{N}}{\text{mm}^2}' }
          ]}
          ergebnisHinweis="Vergleich mit der Festigkeit: Ein C30/37 hat f_ck = 30 N/mm² – die Stütze ist gering ausgenutzt."
          normQuelle="DIN 1301-1 (Einheitenzeichen), DIN EN 1992-1-1 (Bezeichnungen)"
        />
        <FormulaDerivationBox
          title="Beispiel 2: Biegespannung eines Balkens – Moment in Nmm"
          zielGleichung="\sigma = \frac{M}{W},\quad W = \frac{b\,h^2}{6}"
          schritte={[
            { titel: 'Moment', erklaerung: 'Einfeldträger, Streckenlast q = 10 kN/m, Spannweite l = 6 m:', formel: 'M = \frac{q\,l^2}{8} = \frac{10 \cdot 6^2}{8} = 45\,\text{kNm} = 45 \cdot 10^6\,\text{Nmm}' },
            { titel: 'Widerstandsmoment', erklaerung: 'Rechteck b = 30 cm, h = 50 cm, in mm:', formel: 'W = \frac{300 \cdot 500^2}{6} = 12{,}5 \cdot 10^6\,\text{mm}^3' },
            { titel: 'Spannung', erklaerung: 'Die Zehnerpotenzen kürzen sich:', formel: '\sigma = \frac{45 \cdot 10^6\,\text{Nmm}}{12{,}5 \cdot 10^6\,\text{mm}^3} = 3{,}6\,\frac{\text{N}}{\text{mm}^2}', einheit: 'N/mm²' }
          ]}
          ergebnisHinweis="1 kNm = 10⁶ Nmm – diese Umrechnung prüfen Sie im Einheitenumrechner unter „Moment“."
          normQuelle="Technische Mechanik; Einheiten nach DIN 1301-1"
        />
        <FormulaDerivationBox
          title="Beispiel 3: Flächenlast in Spannung umrechnen"
          zielGleichung="1\,\frac{\text{kN}}{\text{m}^2} = 10^{-3}\,\frac{\text{N}}{\text{mm}^2}"
          schritte={[
            { titel: 'Umrechnung', erklaerung: '1 kN = 10³ N und 1 m² = 10⁶ mm²:', formel: '1\,\frac{\text{kN}}{\text{m}^2} = \frac{10^3\,\text{N}}{10^6\,\text{mm}^2} = 0{,}001\,\frac{\text{N}}{\text{mm}^2} = 1\,\text{kPa}' },
            { titel: 'Anwendung', erklaerung: 'Eine Nutzlast von 5 kN/m² entspricht einem Flächendruck von nur 0,005 N/mm² – Bodenpressungen und Lasten werden deshalb in kN/m², Materialspannungen in N/mm² angegeben.', formel: '5\,\frac{\text{kN}}{\text{m}^2} = 0{,}005\,\frac{\text{N}}{\text{mm}^2}' }
          ]}
          normQuelle="DIN EN 1991-1-1 (Nutzlasten in kN/m²)"
        />
      </div>

      <ModulTest moduleId="einheiten" />

      <ModuleFooter 
        wikipedia={[
          { title: 'Internationales Einheitensystem', url: 'https://de.wikipedia.org/wiki/Internationales_Einheitensystem' },
          { title: 'Basiseinheit', url: 'https://de.wikipedia.org/wiki/SI-Basiseinheit' },
          { title: 'Pascal (Einheit)', url: 'https://de.wikipedia.org/wiki/Pascal_(Einheit)' }
        ]}
        literatur={[
          'BIPM: Le Système international d’unités (SI-Broschüre), 9. Auflage 2019',
          'PTB: Die gesetzlichen Einheiten in Deutschland. Braunschweig: Physikalisch-Technische Bundesanstalt (aktuelle Fassung unter ptb.de)',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011'
        ]}
        regelwerke={[
          { title: 'DIN 1301-1:2010-10 (Einheiten – Einheitennamen, Einheitenzeichen)', url: 'https://www.dinmedia.de/de/suche?q=DIN+1301-1' },
          { title: 'DIN 1301-2:1978-02 (Einheiten – Allgemein angewendete Teile und Vielfache)', url: 'https://www.dinmedia.de/de/suche?q=DIN+1301-2' },
          { title: 'DIN EN ISO 80000-1 (Größen und Einheiten – Teil 1: Allgemeines; Deutsche Fassung EN ISO 80000-1:2022)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+ISO+80000-1' },
          { title: 'Einheiten- und Zeitgesetz (EinhZeitG) und Einheitenverordnung (EinhV)', url: 'https://www.gesetze-im-internet.de/einhv/' }
        ]}
        formeln={[
          {
            formel: '1\\,\\text{MPa} = 1\\,\\frac{\\text{N}}{\\text{mm}^2} = 10^6\\,\\frac{\\text{N}}{\\text{m}^2} = 10\\,\\text{bar} = 1000\\,\\text{kN/m}^2',
            erklaerung: 'Spannungs- und Druckäquivalenzen im Bauingenieurwesen: 1 Megapascal entspricht exakt einem Newton pro Quadratmillimeter.',
            quelle: 'DIN 1301-1'
          },
          {
            formel: '1\\,\\text{W/(m}\\cdot\\text{K)} = 1\\,\\frac{\\text{J}}{\\text{s}\\cdot\\text{m}\\cdot\\text{K}} \\quad \\text{und} \\quad 1\\,\\text{kN} = 1000\\,\\text{kg}\\cdot\\frac{\\text{m}}{\\text{s}^2} \\approx 102\\,\\text{kp}',
            erklaerung: 'Zusammenhang zwischen Wärmeleitfähigkeits- und Krafteinheiten im SI-System (Kraft F = m · a). Das Kilopond (kp) ist keine gesetzliche Einheit mehr, begegnet aber in Altstatiken (1 kp = 9,806 65 N).',
            quelle: 'DIN EN ISO 80000-1'
          }
        ]}
        lastReviewed="Oktober 2026 (AP 3 Grundlagen: DIN 1301, DIN EN ISO 80000-1, SI-Broschüre geprüft; fachliche Freigabe durch den Autor ausstehend)"
      />
    </div>
  );
} 