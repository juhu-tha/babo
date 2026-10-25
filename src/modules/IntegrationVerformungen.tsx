import React from 'react';
import { Network, ThermometerSun, Layers, Activity, Timer, ArrowRight, AlertTriangle } from 'lucide-react';
import inhalt from '@/content/integrationverformungen/IntegrationVerformungen.json';
import { MdText } from '@/src/components/inhalt/MdText';

export default function IntegrationVerformungen() {
  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main mb-6 flex items-center gap-2">
          <Network className="text-shiraz" /><MdText text={inhalt.texte.ganzheitlichesModellFrühesBetonalter} /></h2>
        
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
          <div className="text-sm text-text-main/80 bg-off-white p-5 rounded-xl border border-home-grau/30">
            <p><MdText text={inhalt.texte.dieModuleHydratationEigenspannungen} /></p>
          </div>

          <section>
            <h3 className="text-lg font-bold text-home-prim mb-4"><MdText text={inhalt.texte.dasPhysikalischeNetzwerk} /></h3>
            
            {/* Visual Flow Diagram */}
            <div className="relative p-6 bg-gradient-to-br from-slate-50 to-indigo-50/30 rounded-xl border border-home-grau/30 overflow-hidden">
              <div className="flex flex-col gap-6 md:gap-8">
                
                {/* Ursache */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-center relative z-10">
                  <div className="bg-orange-50 border-2 border-orange-200 p-4 rounded-xl w-64 shadow-sm flex flex-col items-center text-center">
                    <ThermometerSun className="text-orange-500 mb-2" size={32} />
                    <h4 className="font-bold text-orange-900"><MdText text={inhalt.texte.t1Hydratation} /></h4>
                    <p className="text-xs text-orange-700 mt-1"><MdText text={inhalt.texte.zementWasserReagiertEs} /></p>
                  </div>
                </div>
                
                <div className="hidden md:flex justify-center -my-4 relative z-0">
                  <div className="h-10 w-0.5 bg-gray-300"></div>
                </div>

                {/* Mechanismus */}
                <div className="flex flex-col md:flex-row gap-4 items-start justify-center relative z-10">
                  <div className="bg-blue-50 border-2 border-blue-200 p-4 rounded-xl w-64 shadow-sm flex flex-col items-center text-center">
                    <Layers className="text-blue-500 mb-2" size={32} />
                    <h4 className="font-bold text-blue-900"><MdText text={inhalt.texte.t2VolumenänderungZwang} /></h4>
                    <p className="text-xs text-blue-700 mt-1"><MdText text={inhalt.texte.betonDehntSichAus} /></p>
                  </div>

                  <div className="flex items-center justify-center self-center md:px-4 py-2 md:py-0">
                    <ArrowRight className="text-gray-400 rotate-90 md:rotate-0" />
                  </div>

                  <div className="bg-purple-50 border-2 border-purple-200 p-4 rounded-xl w-64 shadow-sm flex flex-col items-center text-center">
                    <Activity className="text-purple-500 mb-2" size={32} />
                    <h4 className="font-bold text-purple-900"><MdText text={inhalt.texte.t3SpannungsaufbauEigenspannungen} /></h4>
                    <p className="text-xs text-purple-700 mt-1"><MdText text={inhalt.texte.durchDenZwangUnd} /></p>
                  </div>
                </div>

                <div className="hidden md:flex justify-center -my-4 relative z-0">
                  <div className="h-10 border-l-2 border-dashed border-gray-300"></div>
                </div>

                {/* Relaxation & Result */}
                <div className="flex flex-col md:flex-row gap-4 items-start justify-center relative z-10">
                  <div className="bg-emerald-50 border-2 border-emerald-200 p-4 rounded-xl w-64 shadow-sm flex flex-col items-center text-center">
                    <Timer className="text-emerald-500 mb-2" size={32} />
                    <h4 className="font-bold text-emerald-900"><MdText text={inhalt.texte.t4KriechenRelaxation} /></h4>
                    <p className="text-xs text-emerald-700 mt-1"><MdText text={inhalt.texte.derJungeBetonReagiert} /></p>
                  </div>

                  <div className="flex items-center justify-center self-center md:px-4 py-2 md:py-0">
                    <ArrowRight className="text-gray-400 rotate-90 md:rotate-0" />
                  </div>

                  <div className="bg-red-50 border-2 border-red-200 p-4 rounded-xl w-64 shadow-sm flex flex-col items-center text-center">
                    <AlertTriangle className="text-red-500 mb-2" size={32} />
                    <h4 className="font-bold text-red-900"><MdText text={inhalt.texte.t5RissrisikoBewertung} /></h4>
                    <p className="text-xs text-red-700 mt-1"><MdText text={inhalt.texte.spannungTZugfestigkeitF} /></p>
                  </div>
                </div>
                
              </div>
            </div>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="bg-stone-50 p-4 rounded-xl border border-home-grau/30">
                 <h4 className="font-bold text-indigo-800 mb-2"><MdText text={inhalt.texte.wieDieModuleBesser} /></h4>
                 <ul className="text-sm text-gray-700 space-y-2 list-disc pl-4">
                   <li><MdText text={inhalt.texte.isolierteBetrachtungNutzenSie} /></li>
                   <li><MdText text={inhalt.texte.vernetzteBetrachtungNutzenSie} /></li>
                 </ul>
               </div>
               <div className="bg-stone-50 p-4 rounded-xl border border-home-grau/30">
                 <h4 className="font-bold text-indigo-800 mb-2"><MdText text={inhalt.texte.ansätzeZurOptimierungIm} /></h4>
                 <ul className="text-sm text-gray-700 space-y-2 list-disc pl-4">
                   <li><MdText text={inhalt.texte.zementMitNiedrigenHydratationswärmen} /></li>
                   <li><MdText text={inhalt.texte.gleitfolienUnterBodenplattenVerringert} /></li>
                   <li><MdText text={inhalt.texte.betonageImSommerGgf} /></li>
                 </ul>
               </div>
            </div>

          </section>

        </div>
      </div>
      
    </div>
  );
}
