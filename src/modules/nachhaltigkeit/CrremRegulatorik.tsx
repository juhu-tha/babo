import { Scale, TrendingDown } from 'lucide-react';
import { RechtsrahmenKompendium } from '@/src/components/ui/RechtsrahmenKompendium';
import CrremSimulator from './CrremSimulator';
import type { Dispatch, SetStateAction } from 'react';
import inhalt from '@/content/nachhaltigkeit/CrremRegulatorik.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ReiterLeiste, alsReiter, reiterPanel } from '../../components/ui/Auswahlgruppe';

interface CrremRegulatorikProps {
  crremBuildingType: "office" | "residential";
  crremCurrentGwp: number;
  crremResult: { effectiveGwp: number; reductionLabel: string; reductionPct: number; strandingYear: number | null; isCurrentlyStranded: boolean; target2026: number; target2030: number; getTargetForYear: (year: number) => number; };
  crremRetrofit: "none" | "opex" | "capex_huelle" | "capex_deep";
  regulatorikSubTab: "rechtsrahmen" | "crrem_sim";
  setCrremBuildingType: Dispatch<SetStateAction<"office" | "residential">>;
  setCrremCurrentGwp: Dispatch<SetStateAction<number>>;
  setCrremRetrofit: Dispatch<SetStateAction<"none" | "opex" | "capex_huelle" | "capex_deep">>;
  setRegulatorikSubTab: Dispatch<SetStateAction<"rechtsrahmen" | "crrem_sim">>;
}

export default function CrremRegulatorik({ crremBuildingType, crremCurrentGwp, crremResult, crremRetrofit, regulatorikSubTab, setCrremBuildingType, setCrremCurrentGwp, setCrremRetrofit, setRegulatorikSubTab }: CrremRegulatorikProps) {
  return (
      <div className="flex flex-col gap-6 animate-in fade-in duration-300">

        {/* Sub-Navigation: Rechtsrahmen-Kompendium vs. CRREM Simulator */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-shiraz uppercase tracking-widest">Regulatorik-Schwerpunkt</span>
            <span className="text-sm font-extrabold text-text-main"><MdText text={inhalt.texte.wählenSieAnalysebereichWerkzeug} /></span>
          </div>

          <ReiterLeiste label="Analysebereich" className="flex flex-wrap items-center gap-2">
            <button {...alsReiter(regulatorikSubTab === 'rechtsrahmen', 'crrem-bereich', 'rechtsrahmen')}
              onClick={() => setRegulatorikSubTab('rechtsrahmen')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border cursor-pointer ${
                  regulatorikSubTab === 'rechtsrahmen'
                    ? 'bg-shiraz text-white border-shiraz shadow-md'
                    : 'bg-off-white text-text-main border-home-grau/30 hover:bg-white'
                }`}
            >
              <Scale size={16} /><MdText text={inhalt.texte.t1RechtsrahmenKompendiumHierarchie} /></button>
            <button {...alsReiter(regulatorikSubTab === 'crrem_sim', 'crrem-bereich', 'crrem_sim')}
              onClick={() => setRegulatorikSubTab('crrem_sim')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border cursor-pointer ${
                  regulatorikSubTab === 'crrem_sim'
                    ? 'bg-shiraz text-white border-shiraz shadow-md'
                    : 'bg-off-white text-text-main border-home-grau/30 hover:bg-white'
                }`}
            >
              <TrendingDown size={16} /><MdText text={inhalt.texte.t2CrremDekarbonisierungssimulator} /></button>
          </ReiterLeiste>
        </div>

        {/* SubTab 1: Hierarchisches Rechtsrahmen-Kompendium */}
        {regulatorikSubTab === 'rechtsrahmen' && (
          <div {...reiterPanel('crrem-bereich', regulatorikSubTab)}><RechtsrahmenKompendium /></div>
        )}

        {/* SubTab 2: Interaktiver CRREM Simulator */}
        {regulatorikSubTab === 'crrem_sim' && <div {...reiterPanel('crrem-bereich', regulatorikSubTab)}><CrremSimulator crremBuildingType={crremBuildingType} crremCurrentGwp={crremCurrentGwp} crremResult={crremResult} crremRetrofit={crremRetrofit} setCrremBuildingType={setCrremBuildingType} setCrremCurrentGwp={setCrremCurrentGwp} setCrremRetrofit={setCrremRetrofit} setRegulatorikSubTab={setRegulatorikSubTab} /></div>}

      </div>
    );
}
