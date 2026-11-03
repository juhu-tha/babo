import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import React, { useState } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { Layers, ShieldAlert, Sparkles, ArrowRight, BookOpen } from 'lucide-react';
import { useTabContext } from '@/src/contexts/TabContext';
import BaustoffProfil from '@/src/components/ui/BaustoffProfil';
import inhalt from '@/content/metalle/Metalle.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs, type ModulTab } from '@/src/components/ui/ModuleTabs';
import { AuswahlGruppe, alsOption } from '../components/ui/Auswahlgruppe';

function MetalThematicLinks({ current }: { current: 'baustoff' | 'bauprodukt' | 'dauerhaftigkeit' }) {
  const { setActiveTab } = useTabContext();
  
  return (
    <div className="bg-shiraz/5 border border-shiraz/35 rounded-2xl p-4 sm:p-5 flex flex-col gap-4">
      <div>
        <h4 className="text-xs font-bold text-shiraz uppercase tracking-wider"><MdText text={inhalt.texte.materialLehrpfadMetalleIm} /></h4>
        <p className="text-xs text-slate-700 font-medium mt-0.5"><MdText text={inhalt.texte.wechselnSieNahtlosZwischen} /></p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Säule 1: Baustoffe */}
        <button
          onClick={() => setActiveTab('metalle')}
          className={`flex flex-col gap-1.5 p-3.5 rounded-xl border text-left transition-all ${
            current === 'baustoff'
              ? 'bg-shiraz/5 border-shiraz/40 text-shiraz shadow-inner cursor-default'
              : 'bg-white hover:bg-slate-50 border-home-grau/30 text-slate-700 hover:border-shiraz/30 hover:shadow-sm'
          }`}
          disabled={current === 'baustoff'}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <BookOpen size={16} className={current === 'baustoff' ? 'text-shiraz' : 'text-slate-400'} />
            <span><MdText text={inhalt.texte.t1BaustoffKennwerte} /></span>
          </div>
          <span className="text-[11px] text-slate-500 font-normal leading-relaxed"><MdText text={inhalt.texte.physikalischeEigenschaftenSchmelzpunktLe} /></span>
          {current !== 'baustoff' && (
            <span className="text-[10px] font-bold text-shiraz mt-auto flex items-center gap-1">
              Ansehen <ArrowRight size={12} />
            </span>
          )}
        </button>

        {/* Säule 2: Bauprodukte */}
        <button
          onClick={() => setActiveTab('bp_metallisch')}
          className={`flex flex-col gap-1.5 p-3.5 rounded-xl border text-left transition-all ${
            current === 'bauprodukt'
              ? 'bg-shiraz/5 border-shiraz/40 text-shiraz shadow-inner cursor-default'
              : 'bg-white hover:bg-slate-50 border-home-grau/30 text-slate-700 hover:border-shiraz/30 hover:shadow-sm'
          }`}
          disabled={current === 'bauprodukt'}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <Layers size={16} className={current === 'bauprodukt' ? 'text-shiraz' : 'text-slate-400'} />
            <span><MdText text={inhalt.texte.t2MechanikPraxis} /></span>
          </div>
          <span className="text-[11px] text-slate-500 font-normal leading-relaxed"><MdText text={inhalt.texte.plattenrechnerKontaktkorrosionsPrüfungHe} /></span>
          {current !== 'bauprodukt' && (
            <span className="text-[10px] font-bold text-shiraz mt-auto flex items-center gap-1">
              Ansehen <ArrowRight size={12} />
            </span>
          )}
        </button>

        {/* Säule 3: Dauerhaftigkeit */}
        <button
          onClick={() => setActiveTab('metallkorrosion')}
          className={`flex flex-col gap-1.5 p-3.5 rounded-xl border text-left transition-all ${
            current === 'dauerhaftigkeit'
              ? 'bg-shiraz/5 border-shiraz/40 text-shiraz shadow-inner cursor-default'
              : 'bg-white hover:bg-slate-50 border-home-grau/30 text-slate-700 hover:border-shiraz/30 hover:shadow-sm'
          }`}
          disabled={current === 'dauerhaftigkeit'}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <ShieldAlert size={16} className={current === 'dauerhaftigkeit' ? 'text-shiraz' : 'text-slate-400'} />
            <span><MdText text={inhalt.texte.t3Dauerhaftigkeit} /></span>
          </div>
          <span className="text-[11px] text-slate-500 font-normal leading-relaxed"><MdText text={inhalt.texte.galvanischeZellenKorrosionsartenSchutz} /></span>
          {current !== 'dauerhaftigkeit' && (
            <span className="text-[10px] font-bold text-shiraz mt-auto flex items-center gap-1">
              Ansehen <ArrowRight size={12} />
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

const METALS_DATA = inhalt.daten.METALS_DATA;

type MetalleReiter = 'steckbrief' | 'kennwerte';
const REITER: readonly ModulTab<MetalleReiter>[] = [
  { id: 'steckbrief', label: 'Baustoff-Steckbrief', icon: BookOpen },
  { id: 'kennwerte', label: inhalt.texte.metalleKennwerte.trim(), icon: Sparkles },
];

export default function Metalle() {
  const [activeTab, setActiveTab] = useState<MetalleReiter>('steckbrief');
  const [selectedMetal, setSelectedMetal] = useState(METALS_DATA[0].name);
  const [selectedSteckbriefMetal, setSelectedSteckbriefMetal] = useState<string>('aluminium');

  const activeMetal = METALS_DATA.find(m => m.name === selectedMetal) || METALS_DATA[0];

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-shiraz/10 rounded-lg text-shiraz">
            <Layers size={24} />
          </div>
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2"><MdText text={inhalt.texte.metalleImBauwesen} /></h2>
        </div>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.metalleInsbBaustahlEdelstahl} /></p>
        </div>
        
        <ModuleTabs label={inhalt.werte.reiterBereiche} tabs={REITER} aktiv={activeTab} onWechsel={setActiveTab} className="flex flex-col gap-6 [&>[role=tablist]]:pb-3 [&>[role=tablist]]:border-b [&>[role=tablist]]:border-home-grau/20">
        <div className="flex flex-col gap-6">

        {activeTab === 'steckbrief' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-300">
            <div className="lg:col-span-3 flex flex-col gap-2">
              <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-2"><MdText text={inhalt.texte.materialAuswählen} /></h3>
              <AuswahlGruppe label="Metall" className="flex flex-col gap-2">
                {[
                  { key: 'aluminium', name: 'Aluminium', symbol: 'Al' },
                  { key: 'kupfer', name: 'Kupfer', symbol: 'Cu' },
                  { key: 'baustahl', name: 'Baustahl', symbol: 'Fe+C' },
                  { key: 'edelstahl', name: 'Edelstahl', symbol: 'Fe+Cr' },
                  { key: 'zink', name: inhalt.werte.zinkTitanzink, symbol: 'Zn' },
                  { key: 'blei', name: 'Blei', symbol: 'Pb' },
                  { key: 'titan', name: 'Titan', symbol: 'Ti' }
                ].map((item) => (
                  <button {...alsOption(selectedSteckbriefMetal === item.key)}
                    key={item.key}
                    onClick={() => setSelectedSteckbriefMetal(item.key)}
                    className={`p-3 text-left rounded-xl border transition-all ${
                      selectedSteckbriefMetal === item.key 
                        ? 'bg-shiraz/10 border-shiraz text-shiraz font-bold' 
                        : 'bg-off-white border-home-grau/30 text-text-main hover:border-shiraz/50'
                    }`}
                  >
                    <div className="flex justify-between items-center text-sm">
                      <span>{item.name}</span>
                      <span className="text-xs opacity-90 font-mono">{item.symbol}</span>
                    </div>
                  </button>
                ))}
              </AuswahlGruppe>
            </div>
            <div className="lg:col-span-9">
              <BaustoffProfil materialKey={selectedSteckbriefMetal} />
            </div>
          </div>
        )}

        {activeTab === 'kennwerte' && (
          <>
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
              <p><MdText text={inhalt.texte.nebenBaustahlWerdenIm} /></p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4 flex flex-col gap-4">
                <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-2"><MdText text={inhalt.texte.metallAuswählen} /></h3>
                <div className="flex flex-col gap-2">
                  {METALS_DATA.map((metal) => (
                    <button
                      key={metal.name}
                      onClick={() => setSelectedMetal(metal.name)}
                      className={`p-3 text-left rounded-xl border transition-all ${
                        selectedMetal === metal.name 
                          ? 'bg-shiraz/10 border-shiraz text-shiraz font-bold' 
                          : 'bg-off-white border-home-grau/30 text-text-main hover:border-shiraz/50'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{metal.name}</span>
                        <span className="text-xs opacity-90 font-mono">{metal.symbol}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-8 flex flex-col gap-6">
                <div className="bg-off-white p-6 rounded-xl border border-home-grau/30">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-text-main">{activeMetal.name}</h3>
                    <div className="px-3 py-1 bg-white border border-home-grau/30 rounded-lg font-mono text-shiraz font-bold">
                      {activeMetal.symbol}
                    </div>
                  </div>
                  
                  <p className="text-text-main/80 mb-6 leading-relaxed">
                    {activeMetal.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg border border-home-grau/30">
                      <div className="text-xs text-home-grau uppercase tracking-wider mb-1">Dichte</div>
                      <div className="text-lg font-bold text-text-main">{formatDeWert(activeMetal.density)} <span className="text-sm font-normal">kg/m³</span></div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-home-grau/30">
                      <div className="text-xs text-home-grau uppercase tracking-wider mb-1">E-Modul</div>
                      <div className="text-lg font-bold text-text-main">{formatDeZahl((activeMetal.eModul / 1000), 0)} <span className="text-sm font-normal">GPa</span></div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-home-grau/30">
                      <div className="text-xs text-home-grau uppercase tracking-wider mb-1">Wärmeleitfähigkeit</div>
                      <div className="text-lg font-bold text-text-main">{formatDeWert(activeMetal.thermalConductivity)} <span className="text-sm font-normal">W/(m·K)</span></div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-home-grau/30">
                      <div className="text-xs text-home-grau uppercase tracking-wider mb-1">Schmelzpunkt</div>
                      <div className="text-lg font-bold text-text-main">{formatDeWert(activeMetal.meltingPoint)} <span className="text-sm font-normal">°C</span></div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-bold text-text-main mb-1"><MdText text={inhalt.texte.korrosionsverhaltenWiderstand} /></div>
                      <div className="text-sm text-text-main/80 bg-white p-3 rounded-lg border border-home-grau/30 leading-relaxed">
                        {activeMetal.corrosionBehavior}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-text-main mb-1"><MdText text={inhalt.texte.korrosionsschutzVerhaltensmaßnahmen} /></div>
                      <div className="text-sm text-text-main/80 bg-shiraz/5 p-3 rounded-lg border border-shiraz/20 leading-relaxed">
                        {activeMetal.corrosionProtection}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-text-main mb-1"><MdText text={inhalt.texte.typischeEinsatzbereiche} /></div>
                      <div className="text-sm text-text-main/80 bg-white p-3 rounded-lg border border-home-grau/30 leading-relaxed">
                        {activeMetal.applications}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vergleichstabelle */}
                <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-sm overflow-x-auto">
                  <h3 className="text-sm font-bold text-text-main mb-4"><MdText text={inhalt.texte.vergleichDerPhysikalischenEigenschaften} /></h3>
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-home-grau uppercase bg-off-white border-b border-home-grau/30">
                      <tr>
                        <th className="px-4 py-3">Metall</th>
                        <th className="px-4 py-3"><MdText text={inhalt.texte.dichteKgM} /></th>
                        <th className="px-4 py-3"><MdText text={inhalt.texte.eModulGpa} /></th>
                        <th className="px-4 py-3"><MdText text={inhalt.texte.wärmeleitfWMk} /></th>
                      </tr>
                    </thead>
                    <tbody>
                      {METALS_DATA.map((metal) => (
                        <tr key={metal.name} className={`border-b border-home-grau/10 ${selectedMetal === metal.name ? 'bg-shiraz/5' : ''}`}>
                          <td className="px-4 py-3 font-bold">{metal.name}</td>
                          <td className="px-4 py-3">{formatDeWert(metal.density)}</td>
                          <td className="px-4 py-3">{formatDeZahl((metal.eModul / 1000), 0)}</td>
                          <td className="px-4 py-3">{formatDeWert(metal.thermalConductivity)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
        </div>
        </ModuleTabs>
      </div>

      <MetalThematicLinks current="baustoff" />

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <FormulaDerivationBox
          title={inhalt.werte.anwendungsbeispielWärmedehnungVonFassade}
          zielGleichung="\Delta l = l_0 \cdot \alpha_T \cdot \Delta T"
          normQuelle={inhalt.werte.wärmedehnzahlenAlsRichtwerteHerstelleran}
          schritte={inhalt.daten["Metalle.schritte"]}
          ergebnisHinweis={inhalt.werte.aluminiumprofileDehnenSichDoppelt}
        />
      </div>

      <ModulTest moduleId="metalle" />

      <ModuleFooter 
        wikipedia={[
          { title: 'Metall', url: 'https://de.wikipedia.org/wiki/Metalle' },
          { title: 'Korrosion', url: 'https://de.wikipedia.org/wiki/Korrosion' },
          { title: 'Passivierung', url: 'https://de.wikipedia.org/wiki/Passivierung' },
          { title: 'Bimetallkorrosion', url: 'https://de.wikipedia.org/wiki/Bimetallkorrosion' }
        ]}
        literatur={inhalt.daten["Metalle.literatur"]}
        regelwerke={inhalt.daten["Metalle.regelwerke"]}
        formeln={inhalt.daten["Metalle.formeln"]}
      />
    </div>
  );
} 