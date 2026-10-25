// Ausgelagert aus src/modules/ZfP.tsx (AP 5.2)
import React from 'react';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { Activity, Waves, Trees, Droplets } from 'lucide-react';
import inhalt from '@/content/zfp/HolzTab.json';
import { MdText } from '@/src/components/inhalt/MdText';

export interface HolzTabProps {
  renderEmbeddedGeraete: (tabKey: string, deviceIds: string[]) => React.JSX.Element | null;
}

export default function HolzTab({ renderEmbeddedGeraete }: HolzTabProps) {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
        <h3 className="text-lg font-bold text-slate-900 border-b border-home-grau/30 pb-2 flex items-center gap-2">
          <Activity size={20} className="text-shiraz" /><MdText text={inhalt.texte.bohrwiderstandsmessungNadelbohrverfahren} /></h3>
        <p className="text-sm text-slate-700"><MdText text={inhalt.texte.einDünnerBohrerMeist} /></p>
        <ul className="list-disc list-inside text-sm text-slate-700 space-y-2">
          <li><MdText text={inhalt.texte.anwendungErkennungVonFäulnis} /></li>
          <li><MdText text={inhalt.texte.ergebnisEinBohrprofilResistogramm} /></li>
          <li><MdText text={inhalt.texte.vorteilQuasiZerstörungsfreiSehr} /></li>
        </ul>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
        <h3 className="text-lg font-bold text-slate-900 border-b border-home-grau/30 pb-2 flex items-center gap-2">
          <Waves size={20} className="text-shiraz" /><MdText text={inhalt.texte.dynamischerEModulUltraschall} /></h3>
        <p className="text-sm text-slate-700"><MdText text={inhalt.texte.bestimmungDerFestigkeitUnd} /></p>
        <div className="bg-slate-50 p-3 rounded-lg border border-home-grau/30 text-center">
          <FormulaText text="E_{dyn} = \rho \cdot v^2" />
        </div>
        <ul className="list-disc list-inside text-sm text-slate-700 space-y-2">
          <li><MdText text={inhalt.texte.prinzipSchallBreitetSich} /></li>
          <li><MdText text={inhalt.texte.anwendungAbschätzungDerFestigkeitsklasse} /></li>
          <li><MdText text={inhalt.texte.hinweisDerDynamischeE} /></li>
        </ul>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
        <h3 className="text-lg font-bold text-slate-900 border-b border-home-grau/30 pb-2 flex items-center gap-2">
          <Droplets size={20} className="text-shiraz" /> Feuchtemessung
        </h3>
        <p className="text-sm text-slate-700"><MdText text={inhalt.texte.dieHolzfeuchteIstDer} /></p>
        <ul className="list-disc list-inside text-sm text-slate-700 space-y-2">
          <li><MdText text={inhalt.texte.widerstandsmessungZweiElektrodenWerden} /></li>
          <li><MdText text={inhalt.texte.kapazitiveMessungZerstörungsfreiDurch} /></li>
          <li><MdText text={inhalt.texte.darrMethodeZerstörendProbenentnahme} /></li>
        </ul>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
        <h3 className="text-lg font-bold text-slate-900 border-b border-home-grau/30 pb-2 flex items-center gap-2">
          <Trees size={20} className="text-shiraz" /> Dendrochronologie
        </h3>
        <p className="text-sm text-slate-700"><MdText text={inhalt.texte.altersbestimmungVonHolzAnhand} /></p>
        <ul className="list-disc list-inside text-sm text-slate-700 space-y-2">
          <li><MdText text={inhalt.texte.prinzipDasBaumwachstumJahrringbreite} /></li>
          <li><MdText text={inhalt.texte.anwendungExakteDatierungVon} /></li>
          <li><MdText text={inhalt.texte.vorgehenEntnahmeEinesBohrkerns} /></li>
        </ul>
      </div>
      </div>
      {/* Section: Zugehörige Geräte aus Gerätepool */}
      {renderEmbeddedGeraete('holz', ['setzdehnung', 'messverstaerker', 'wegaufnehmer', 'endoskopie', 'laserscanner'])}
    </div>
  );
}
