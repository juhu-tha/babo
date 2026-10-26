import React, { useState } from 'react';
import { Scale, Calculator, ArrowRight } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { BlockMath, InlineMath } from 'react-katex';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import inhalt from '@/content/einheiten/Einheiten.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs } from '@/src/components/ui/ModuleTabs';
import { EINHEITEN, GROESSENARTEN, LITER, umrechnung, type Groessenart } from '@/src/calc/einheiten';
import { EingabeHinweise } from '@/src/components/ui/EingabeHinweise';

type UnitCategory = Groessenart;

// Rechenkern src/calc/einheiten.ts: Einheitentabelle und Umrechnung; hier nur die Anzeigenamen
const units = EINHEITEN;
const anzeige = (name: string) => (name === LITER ? inhalt.werte.dmLiterL : name);

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

const REITER = [
  { id: 'grundlagen', label: inhalt.texte.grundlagenSiSystem, icon: Scale },
  { id: 'umrechner', label: 'Einheitenumrechner', icon: Calculator },
] as const;

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

  const ergebnis = umrechnung(inputValue, category, fromUnit, toUnit);
  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Scale className="text-shiraz" /><MdText text={inhalt.texte.einheitenImBauwesen} /></h2>
        
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.dasInternationaleEinheitensystemSi} /></p>
        </div>

      </div>

      <ModuleTabs label="Bereiche Einheiten" tabs={REITER} aktiv={activeTab} onWechsel={setActiveTab} className="[&>[role=tablist]]:mb-8">
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
                  <td className="px-4 py-2 font-bold"><MdText text={inhalt.texte.thermodynamischeTemperatur} /></td>
                  <td className="px-4 py-2"><InlineMath math="T" /></td>
                  <td className="px-4 py-2">Kelvin</td>
                  <td className="px-4 py-2">K</td>
                </tr>
                <tr className="hover:bg-home-grau/5">
                  <td className="px-4 py-2 font-bold"><MdText text={inhalt.texte.elektrischeStromstärke} /></td>
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
          <div className="mt-2 p-3 bg-off-white rounded-lg text-xs text-text-main/80 border border-home-grau/20"><MdText text={inhalt.texte.seitDerSiRevision} /></div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
          <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2"><MdText text={inhalt.texte.wichtigeAbgeleiteteEinheiten} /></h3>
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
                  <td className="px-4 py-2 font-bold"><MdText text={inhalt.texte.druckSpannungPSigma} /></td>
                  <td className="px-4 py-2">Pascal (Pa)</td>
                  <td className="px-4 py-2"><InlineMath math="1 \text{ Pa} = 1 \frac{\text{N}}{\text{m}^2}" /></td>
                </tr>
                <tr className="hover:bg-home-grau/5">
                  <td className="px-4 py-2 font-bold"><MdText text={inhalt.texte.energieArbeitEW} /></td>
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
            <div><MdText text={inhalt.texte.wichtigImBauwesenSpannungen} /></div>
            <div className="text-xs text-text-main/90 bg-white/70 p-2.5 rounded-lg border border-shiraz/10 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>🍫 <strong className="text-shiraz">1 N</strong><MdText text={inhalt.texte.gewichtskraftEinerTafelSchokolade} /></div>
              <div>👷 <strong className="text-shiraz">1 kN</strong><MdText text={inhalt.texte.gewichtskraftEinesBauarbeitersMit} /></div>
              <div>🐋 <strong className="text-shiraz">1 MN</strong><MdText text={inhalt.texte.gewichtskraftEinesGroßenWals} /></div>
            </div>
            <BlockMath math="1 \text{ MPa} = 1 \frac{\text{N}}{\text{mm}^2} = 10^6 \text{ Pa} = 1000 \frac{\text{kN}}{\text{m}^2}" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
          <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2"><MdText text={inhalt.texte.siVorsätzePräfixe} /></h3>
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
                  <td className="px-4 py-2"><MdText text={inhalt.texte.t102HundertZ} /></td>
                </tr>
                <tr className="hover:bg-home-grau/5">
                  <td className="px-4 py-2 font-bold">Dezi</td>
                  <td className="px-4 py-2">d</td>
                  <td className="px-4 py-2"><MdText text={inhalt.texte.t101ZehntelZ} /></td>
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
                  <td className="px-4 py-2"><MdText text={inhalt.texte.t106MillionstelZ} /></td>
                </tr>
                <tr className="hover:bg-home-grau/5">
                  <td className="px-4 py-2 font-bold">Nano</td>
                  <td className="px-4 py-2">n</td>
                  <td className="px-4 py-2"><MdText text={inhalt.texte.t109MilliardstelZ} /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      )}

      {activeTab === 'umrechner' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6 animate-in fade-in duration-300">
          <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2"><MdText text={inhalt.texte.interaktiverEinheitenumrechner} /></h3>
          
          <div className="flex flex-col gap-4 max-w-2xl mx-auto w-full">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-text-main">Kategorie</label>
              <select aria-label="Kategorie" 
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value as UnitCategory)}
                className="p-3 border border-home-grau/30 rounded-lg bg-off-white focus:outline-none focus:border-shiraz"
              >
                {GROESSENARTEN.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center mt-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-text-main">Von</label>
                <div className="flex flex-col gap-2">
                  <input aria-label="Von" 
                    type="number" 
                    value={inputValue}
                    onChange={(e) => setInputValue(Number(e.target.value))}
                    className="p-3 border border-home-grau/30 rounded-lg bg-off-white focus:outline-none focus:border-shiraz"
                  />
                  <select aria-label="Ausgangseinheit"
                    value={fromUnit}
                    onChange={(e) => setFromUnit(e.target.value)}
                    className="p-3 border border-home-grau/30 rounded-lg bg-off-white focus:outline-none focus:border-shiraz"
                  >
                    {units[category].map(u => (
                      <option key={u.name} value={u.name}>{anzeige(u.name)}</option>
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
                    {ergebnis.gueltig ? formatErgebnis(ergebnis.wert) : '–'}
                  </div>
                  <select aria-label="Zieleinheit"
                    value={toUnit}
                    onChange={(e) => setToUnit(e.target.value)}
                    className="p-3 border border-home-grau/30 rounded-lg bg-off-white focus:outline-none focus:border-shiraz"
                  >
                    {units[category].map(u => (
                      <option key={u.name} value={u.name}>{anzeige(u.name)}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <EingabeHinweise hinweise={ergebnis.hinweise} />
          </div>
        </div>
      )}
      </ModuleTabs>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-2">
        <h3 className="text-lg font-bold text-text-main border-b border-home-grau/30 pb-2"><MdText text={inhalt.texte.anwendungEinheitenSicherDurch} /></h3>
        <p className="text-sm text-text-main/80"><MdText text={inhalt.texte.dieHäufigstenFehlerIn} /></p>
        <FormulaDerivationBox
          title={inhalt.werte.beispiel1DruckspannungIn}
          zielGleichung="\sigma = \frac{F}{A}"
          schritte={inhalt.daten["Einheiten.schritte"]}
          ergebnisHinweis={inhalt.werte.vergleichMitDerFestigkeit}
          normQuelle={inhalt.werte.din13011Einheitenzeichen}
        />
        <FormulaDerivationBox
          title={inhalt.werte.beispiel2BiegespannungEines}
          zielGleichung="\sigma = \frac{M}{W},\quad W = \frac{b\,h^2}{6}"
          schritte={inhalt.daten["Einheiten.schritte_2"]}
          ergebnisHinweis={inhalt.werte.t1Knm10Nmm}
          normQuelle={inhalt.werte.technischeMechanikEinheitenNach}
        />
        <FormulaDerivationBox
          title={inhalt.werte.beispiel3FlächenlastIn}
          zielGleichung="1\,\frac{\text{kN}}{\text{m}^2} = 10^{-3}\,\frac{\text{N}}{\text{mm}^2}"
          schritte={inhalt.daten["Einheiten.schritte_3"]}
          normQuelle={inhalt.werte.dinEn19911}
        />
      </div>

      <ModulTest moduleId="einheiten" />

      <ModuleFooter 
        wikipedia={[
          { title: inhalt.werte.internationalesEinheitensystem, url: 'https://de.wikipedia.org/wiki/Internationales_Einheitensystem' },
          { title: 'Basiseinheit', url: 'https://de.wikipedia.org/wiki/SI-Basiseinheit' },
          { title: inhalt.werte.pascalEinheit, url: 'https://de.wikipedia.org/wiki/Pascal_(Einheit)' }
        ]}
        literatur={inhalt.daten["Einheiten.literatur"]}
        regelwerke={inhalt.daten["Einheiten.regelwerke"]}
        formeln={inhalt.daten["Einheiten.formeln"]}
        lastReviewed={inhalt.werte.oktober2026Ap3}
      />
    </div>
  );
} 