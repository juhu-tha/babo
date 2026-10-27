import React, { useState } from 'react';
import { 
  Cloud, 
  Server, 
  Gauge 
} from 'lucide-react';
import inhalt from '@/content/ki/ModelBenchmarkMatrix.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { AuswahlGruppe, alsOption } from '../../components/ui/Auswahlgruppe';

interface ModelComparison {
  name: string;
  type: 'cloud' | 'local';
  providerOrWeights: string;
  normAccuracy: number; // 1-5 Sterne
  mathConsistency: number; // 1-5
  costPer1kPages: string;
  dataPrivacyLevel: 'Hoch (lokal, keine Datenübermittlung)' | 'Mittel (US-Cloud, EU-SCC)' | 'Niedrig (Training aktiv)';
  vramOrSetup: string;
  idealUseInCivilEng: string;
  ratingNotes: string;
}

const COMPARISON_DATA: ModelComparison[] = [
  {
    name: inhalt.werte.frontierDokumenteCode,
    type: 'cloud',
    providerOrWeights: inhalt.werte.cloudApiUs,
    normAccuracy: 5,
    mathConsistency: 5,
    costPer1kPages: 'ca. 3,80 €',
    dataPrivacyLevel: 'Mittel (US-Cloud, EU-SCC)',
    vramOrSetup: inhalt.werte.reinerApiKeyWeb,
    idealUseInCivilEng: inhalt.werte.komplexeBaugutachtenStatischeBegründungs,
    ratingNotes: inhalt.werte.starkBeiTechnischerDokumentation
  },
  {
    name: inhalt.werte.frontierMultimodal,
    type: 'cloud',
    providerOrWeights: inhalt.werte.cloudApiUs2,
    normAccuracy: 5,
    mathConsistency: 5,
    costPer1kPages: inhalt.werte.ca160Bis,
    dataPrivacyLevel: 'Mittel (US-Cloud, EU-SCC)',
    vramOrSetup: inhalt.werte.reinerApiKeyWeb2,
    idealUseInCivilEng: inhalt.werte.reasoningVariantenFürMathematisch,
    ratingNotes: inhalt.werte.verbindetMultimodalitätMitIntegriertem
  },
  {
    name: inhalt.werte.proprietaerLangkontext,
    type: 'cloud',
    providerOrWeights: inhalt.werte.cloudPlattformHyperscaler,
    normAccuracy: 5,
    mathConsistency: 5,
    costPer1kPages: inhalt.werte.ca050Bis,
    dataPrivacyLevel: 'Mittel (US-Cloud, EU-SCC)',
    vramOrSetup: inhalt.werte.apiKeyEuRegion,
    idealUseInCivilEng: inhalt.werte.sehrGroßesKontextfensterGrößenordnung,
    ratingNotes: inhalt.werte.schnelleLatenzNativerMultimodal
  },
  {
    name: inhalt.werte.openWeightReasoning,
    type: 'local',
    providerOrWeights: inhalt.werte.openWeightsGguf,
    normAccuracy: 5,
    mathConsistency: 5,
    costPer1kPages: inhalt.werte.t000LokalerStrom,
    dataPrivacyLevel: 'Hoch (lokal, keine Datenübermittlung)',
    vramOrSetup: inhalt.werte.t1024GbVram,
    idealUseInCivilEng: inhalt.werte.offeneTransparenteNachweisPlausibilisier,
    ratingNotes: inhalt.werte.offenesReasoningModellMit
  },
  {
    name: inhalt.werte.openWeightCode32b,
    type: 'local',
    providerOrWeights: inhalt.werte.openSourceGgufQ4,
    normAccuracy: 5,
    mathConsistency: 5,
    costPer1kPages: inhalt.werte.t000LokalerStrom2,
    dataPrivacyLevel: 'Hoch (lokal, keine Datenübermittlung)',
    vramOrSetup: inhalt.werte.t2024GbVram,
    idealUseInCivilEng: inhalt.werte.automatisierungPythonPrüfmaschinenauswer,
    ratingNotes: inhalt.werte.starkBeimGenerierenVon
  },
  {
    name: inhalt.werte.openWeight70b,
    type: 'local',
    providerOrWeights: inhalt.werte.openWeightsGgufQ4b,
    normAccuracy: 5,
    mathConsistency: 5,
    costPer1kPages: inhalt.werte.t000LokalerStrom3,
    dataPrivacyLevel: 'Hoch (lokal, keine Datenübermittlung)',
    vramOrSetup: inhalt.werte.t4048GbVram,
    idealUseInCivilEng: inhalt.werte.gerichtlicheBaugutachtenVertraulicheSchi,
    ratingNotes: inhalt.werte.leistungsfähigesOfflineModellDaten
  },
  {
    name: inhalt.werte.openWeight14b,
    type: 'local',
    providerOrWeights: inhalt.werte.openWeightsGgufC,
    normAccuracy: 5,
    mathConsistency: 5,
    costPer1kPages: inhalt.werte.t000LokalerStrom4,
    dataPrivacyLevel: 'Hoch (lokal, keine Datenübermittlung)',
    vramOrSetup: inhalt.werte.t1012GbVram,
    idealUseInCivilEng: inhalt.werte.guterKompromissFürBüro,
    ratingNotes: inhalt.werte.herausragendesDeutschesNormenverständnis
  }
];

export default function ModelBenchmarkMatrix() {
  const [filterType, setFilterType] = useState<'all' | 'cloud' | 'local'>('all');

  const filtered = COMPARISON_DATA.filter(m => {
    if (filterType === 'cloud') return m.type === 'cloud';
    if (filterType === 'local') return m.type === 'local';
    return true;
  });

  const renderStars = (count: number) => {
    return (
      <div className="flex gap-0.5 text-amber-500">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={i < count ? 'opacity-100 font-bold' : 'opacity-20'}>★</span>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-xs space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-home-grau/20">
        <div>
          <h4 className="font-bold text-base text-text-main flex items-center gap-2">
            <Gauge className="text-shiraz w-5 h-5" /><MdText text={inhalt.texte.benchmarkingMatrixCloudVs} /></h4>
          <p className="text-xs text-text-main/70 mt-1"><MdText text={inhalt.texte.objektiveGegenüberstellungFürIngenieurbü} /></p>
        </div>

        {/* Filter Buttons */}
        <AuswahlGruppe label="Filter Betriebsart" className="flex p-1 bg-slate-100 rounded-xl max-w-max self-start sm:self-center">
          <button {...alsOption(filterType === 'all')}
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              filterType === 'all' ? 'bg-white text-text-main shadow-xs' : 'text-slate-500 hover:text-text-main'
            }`}
          ><MdText text={inhalt.texte.alleModelle} /></button>
          <button {...alsOption(filterType === 'cloud')}
            onClick={() => setFilterType('cloud')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              filterType === 'cloud' ? 'bg-white text-text-main shadow-xs' : 'text-slate-500 hover:text-text-main'
            }`}
          >
            Nur Cloud
          </button>
          <button {...alsOption(filterType === 'local')}
            onClick={() => setFilterType('local')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              filterType === 'local' ? 'bg-white text-text-main shadow-xs' : 'text-slate-500 hover:text-text-main'
            }`}
          ><MdText text={inhalt.texte.nurLokalOffline} /></button>
        </AuswahlGruppe>
      </div>

      {/* Tabelle */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-home-grau/20 bg-off-white text-text-main/70 uppercase text-[10px] font-bold">
              <th className="p-3"><MdText text={inhalt.texte.modellArchitektur} /></th>
              <th className="p-3"><MdText text={inhalt.texte.typPlattform} /></th>
              <th className="p-3"><MdText text={inhalt.texte.normengenauigkeitDinEc} /></th>
              <th className="p-3">Rechenkonsistenz</th>
              <th className="p-3"><MdText text={inhalt.texte.kosten1000S} /></th>
              <th className="p-3"><MdText text={inhalt.texte.datenschutzDsgvo} /></th>
              <th className="p-3"><MdText text={inhalt.texte.hardwareAnforderung} /></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-home-grau/20 text-xxs">
            {filtered.map((m) => (
              <tr key={m.name} className="hover:bg-slate-50/80 transition-colors">
                <td className="p-3 font-bold text-text-main">
                  <div>{m.name}</div>
                  <div className="text-[10px] text-slate-400 font-normal mt-0.5">{m.idealUseInCivilEng}</div>
                </td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase inline-flex items-center gap-1 ${
                    m.type === 'cloud' 
                      ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {m.type === 'cloud' ? <Cloud size={10} /> : <Server size={10} />}
                    {m.type}
                  </span>
                </td>
                <td className="p-3">
                  {renderStars(m.normAccuracy)}
                </td>
                <td className="p-3">
                  {renderStars(m.mathConsistency)}
                </td>
                <td className="p-3 font-mono font-bold text-slate-700">
                  {m.costPer1kPages}
                </td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-semibold ${
                    m.dataPrivacyLevel.includes('Hoch') 
                      ? 'bg-emerald-100 text-emerald-900 font-bold' 
                      : 'bg-amber-100 text-amber-900'
                  }`}>
                    {m.dataPrivacyLevel}
                  </span>
                </td>
                <td className="p-3 text-slate-600 font-mono text-[10px]">
                  {m.vramOrSetup}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Fazit Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs">
        <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl space-y-1.5">
          <h5 className="font-bold text-blue-900 flex items-center gap-1.5">
            <Cloud size={14} className="text-blue-700" /><MdText text={inhalt.texte.wannIstDieCloud} /></h5>
          <p className="text-xxs text-blue-950 leading-relaxed"><MdText text={inhalt.texte.fürWissenschaftlicheLiteraturrecherchenU} /></p>
        </div>

        <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1.5">
          <h5 className="font-bold text-emerald-900 flex items-center gap-1.5">
            <Server size={14} className="text-emerald-700" /><MdText text={inhalt.texte.wannIstLokaleKi} /></h5>
          <p className="text-xxs text-emerald-950 leading-relaxed"><MdText text={inhalt.texte.beiPatentiertenRezepturenInternen} /></p>
        </div>
      </div>

    </div>
  );
}
