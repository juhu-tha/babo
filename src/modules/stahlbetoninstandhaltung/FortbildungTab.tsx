// Ausgelagert aus src/modules/Stahlbetoninstandhaltung.tsx (AP 5.2)
import { Wrench, AlertTriangle, Activity, BookOpen } from 'lucide-react';
import inhalt from '@/content/stahlbetoninstandhaltung/FortbildungTab.json';
import { MdText } from '@/src/components/inhalt/MdText';

export default function FortbildungTab() {
  return (
    <div className="space-y-6">
      <div className="bg-white border-y border-r border-l-4 border-amber-500 border-home-grau/20 p-4 rounded-xl">
        <h3 className="font-bold text-amber-800 flex items-center gap-2">
          <AlertTriangle size={20} /><MdText text={inhalt.texte.qualifikationsanforderungenInDerBetonins} /></h3>
        <p className="text-amber-900 mt-2 text-sm"><MdText text={inhalt.texte.dieInstandsetzungVonBetonbauteilen} /></p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-home-grau/30">
          <h4 className="text-lg font-bold text-text-main mb-3 flex items-center gap-2">
            <BookOpen className="text-shiraz" size={20} /><MdText text={inhalt.texte.skpSachkundigerPlaner} /></h4>
          <p className="text-sm text-text-main mb-4"><MdText text={inhalt.texte.sachkundigerPlanerFürSchutz} /></p>
          <ul className="list-disc pl-5 space-y-1 text-sm text-home-grau">
            <li><MdText text={inhalt.texte.ermittlungDesIstZustandes} /></li>
            <li><MdText text={inhalt.texte.erstellungDesInstandsetzungskonzepts} /></li>
            <li><MdText text={inhalt.texte.auswahlGeeigneterStoffeUnd} /></li>
            <li><MdText text={inhalt.texte.bauüberwachungUndQualitätssicherung} /></li>
          </ul>
          <div className="mt-4 p-3 bg-off-white rounded-lg text-xs text-text-main border border-home-grau/10"><MdText text={inhalt.texte.zugangsvoraussetzungenIDR} /></div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-home-grau/30">
          <h4 className="text-lg font-bold text-text-main mb-3 flex items-center gap-2">
            <Wrench className="text-shiraz" size={20} />
            SIVV-Schein
          </h4>
          <p className="text-sm text-text-main mb-4"><MdText text={inhalt.texte.schützenInstandsetzenVerbindenUnd} /></p>
          <ul className="list-disc pl-5 space-y-1 text-sm text-home-grau">
            <li><MdText text={inhalt.texte.untergrundvorbereitungUndPrüfung} /></li>
            <li><MdText text={inhalt.texte.verarbeitungVonInstandsetzungsmörtelnZ} /></li>
            <li><MdText text={inhalt.texte.applikationVonOberflächenschutzsystemen} /></li>
            <li><MdText text={inhalt.texte.risikoUndFehlerminimierungAuf} /></li>
          </ul>
          <div className="mt-4 p-3 bg-off-white rounded-lg text-xs text-text-main border border-home-grau/10"><MdText text={inhalt.texte.regelwerkNachTrInstandhaltung} /></div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-home-grau/30 md:col-span-2">
          <h4 className="text-lg font-bold text-text-main mb-3 flex items-center gap-2">
            <Activity className="text-shiraz" size={20} /><MdText text={inhalt.texte.weitereQualifikationenQualitätssicherung} /></h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-off-white p-4 rounded-lg">
              <strong className="text-text-main block mb-1"><MdText text={inhalt.texte.eScheinErweiterteBetontechnologische} /></strong>
              <p className="text-home-grau"><MdText text={inhalt.texte.berechtigtUAZur} /></p>
            </div>
            <div className="bg-off-white p-4 rounded-lg">
              <strong className="text-text-main block mb-1"><MdText text={inhalt.texte.düsenführerscheinSpccSpritzbeton} /></strong>
              <p className="text-home-grau"><MdText text={inhalt.texte.speziellerNachweisFürDas} /></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
