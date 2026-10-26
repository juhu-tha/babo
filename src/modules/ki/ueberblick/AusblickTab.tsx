// Ausgelagert aus src/modules/ki/KiUeberblick.tsx (AP 5.2)
import { Cpu, Bot, Workflow, Boxes, Compass } from 'lucide-react';
import inhalt from '@/content/ki/ueberblick/AusblickTab.json';
import { MdText } from '@/src/components/inhalt/MdText';

export default function AusblickTab() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-6 animate-in fade-in duration-300">
      <div className="space-y-1">
        <h3 className="text-base font-bold text-text-main flex items-center gap-2">
          <Compass className="text-shiraz" size={20} /><MdText text={inhalt.texte.blickNachVornWie} /></h3>
        <p className="text-xs text-text-main/70"><MdText text={inhalt.texte.vierSchlüsseltechnologienDieDas} /></p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 bg-off-white rounded-xl border border-home-grau/30 space-y-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-100 text-blue-800 rounded-lg">
              <Cpu size={16} />
            </span>
            <h4 className="font-bold text-sm text-text-main"><MdText text={inhalt.texte.physicsInformedNeuralNetworks} /></h4>
          </div>
          <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.bisherigeKiLerntNur} /></p>
          <div className="text-[11px] text-text-main/70 bg-white p-2.5 rounded-lg border border-home-grau/20"><MdText text={inhalt.texte.effektFemSimulationenUnd} /></div>
        </div>

        <div className="p-5 bg-off-white rounded-xl border border-home-grau/30 space-y-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
              <Bot size={16} />
            </span>
            <h4 className="font-bold text-sm text-text-main"><MdText text={inhalt.texte.autonomeBaustellenrobotik3dDruck} /></h4>
          </div>
          <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.der3dBetondruckLeidet} /></p>
          <div className="text-[11px] text-text-main/70 bg-white p-2.5 rounded-lg border border-home-grau/20"><MdText text={inhalt.texte.effektFehlerfreierFreiformBetondruck} /></div>
        </div>

        <div className="p-5 bg-off-white rounded-xl border border-home-grau/30 space-y-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-purple-100 text-purple-800 rounded-lg">
              <Workflow size={16} />
            </span>
            <h4 className="font-bold text-sm text-text-main"><MdText text={inhalt.texte.multimodaleAgentenSchwärme} /></h4>
          </div>
          <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.spezialisierteKiAgentenArbeiten} /></p>
          <div className="text-[11px] text-text-main/70 bg-white p-2.5 rounded-lg border border-home-grau/20"><MdText text={inhalt.texte.effektDerVorentwurfBeschleunigt} /></div>
        </div>

        <div className="p-5 bg-off-white rounded-xl border border-home-grau/30 space-y-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-amber-100 text-amber-800 rounded-lg">
              <Boxes size={16} />
            </span>
            <h4 className="font-bold text-sm text-text-main"><MdText text={inhalt.texte.zirkuläresBauenUrbanMining} /></h4>
          </div>
          <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.vorDemRückbauEines} /></p>
          <div className="text-[11px] text-text-main/70 bg-white p-2.5 rounded-lg border border-home-grau/20"><MdText text={inhalt.texte.effektDirekteWiederverwendungRe} /></div>
        </div>
      </div>
    </div>
  );
}
