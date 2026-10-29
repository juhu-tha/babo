// Ausgelagert aus src/modules/Stahlbetoninstandhaltung.tsx (AP 5.2)
import React from 'react';
import { BookOpen } from 'lucide-react';
import { szenarien } from './daten';
import inhalt from '@/content/stahlbetoninstandhaltung/RegelwerkeTab.json';
import { MdText } from '@/src/components/inhalt/MdText';

export interface RegelwerkeTabProps {
  selectedScenario: string;
  setSelectedScenario: React.Dispatch<React.SetStateAction<string>>;
}

export default function RegelwerkeTab({ selectedScenario, setSelectedScenario }: RegelwerkeTabProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white border-y border-r border-l-4 border-shiraz border-home-grau/20 p-4 rounded-xl">
        <h3 className="font-bold text-shiraz flex items-center gap-2 text-base">
          <BookOpen size={20} /><MdText text={inhalt.texte.regelwerkeInDeutschlandWer} /></h3>
        <p className="text-text-main mt-2 text-sm leading-relaxed"><MdText text={inhalt.texte.beiDerBetoninstandsetzungTreffen} /></p>
      </div>

      {/* Die drei Hauptpfeiler */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* TR Instandhaltung */}
        <div className="bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
          <div>
            <div className="text-xs uppercase font-extrabold tracking-widest text-[#475569] dark:text-sky-100 bg-sky-50 border border-sky-100 rounded-full px-2.5 py-0.5 inline-block mb-3"><MdText text={inhalt.texte.staatlichGesetzlichStandsicherheit} /></div>
            <h4 className="text-lg font-bold text-text-main mb-2"><MdText text={inhalt.texte.trInstandhaltung} /></h4>
            <p className="text-xs text-home-grau mb-3 leading-relaxed"><MdText text={inhalt.texte.herausgegebenVomDeutschenInstitut} /></p>
            <div className="border-t border-home-grau/30 pt-3 mt-2 space-y-2">
              <span className="text-xs font-bold text-shiraz block"><MdText text={inhalt.texte.gliederungStruktur} /></span>
              <ul className="text-xs space-y-1 text-text-main list-disc pl-4">
                <li><MdText text={inhalt.texte.teil1AnwendungsbereichUnd} /></li>
                <li><MdText text={inhalt.texte.teil2MerkmaleVon} /></li>
              </ul>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-home-grau/30">
            <div className="bg-sky-50 text-sky-950 p-2.5 rounded text-xs"><MdText text={inhalt.texte.gültigkeitBauaufsichtlichVerbindlichNach} /></div>
          </div>
        </div>

        {/* DAfStb RiLi-SIB */}
        <div className="bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
          <div>
            <div className="text-xs uppercase font-extrabold tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-0.5 inline-block mb-3"><MdText text={inhalt.texte.historischAnerkannteTechnikregel} /></div>
            <h4 className="text-lg font-bold text-text-main mb-2"><MdText text={inhalt.texte.historischInstandsetzungsprinzipienDerDa} /></h4>
            <p className="text-xs text-home-grau mb-3 leading-relaxed"><MdText text={inhalt.texte.vomDeutschenAusschussFür} /></p>
            <div className="border-t border-home-grau/30 pt-3 mt-2 space-y-2">
              <span className="text-xs font-bold text-shiraz block"><MdText text={inhalt.texte.gliederungStruktur2} /></span>
              <ul className="text-xs space-y-1 text-text-main list-disc pl-4">
                <li><MdText text={inhalt.texte.teil1AllgemeineRegelungen} /></li>
                <li><MdText text={inhalt.texte.teil2BauprodukteUnd} /></li>
                <li><MdText text={inhalt.texte.teil3AnforderungenAn} /></li>
                <li><MdText text={inhalt.texte.teil4Prüfverfahren} /></li>
              </ul>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-home-grau/30">
            <div className="bg-emerald-50 text-emerald-950 p-2.5 rounded text-xs"><MdText text={inhalt.texte.gültigkeitNichtMehrBauaufsichtlich} /></div>
          </div>
        </div>

        {/* DIN EN 1504 */}
        <div className="bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm flex flex-col justify-between">
          <div>
            <div className="text-xs uppercase font-extrabold tracking-widest text-purple-700 bg-purple-50 border border-purple-100 rounded-full px-2.5 py-0.5 inline-block mb-3"><MdText text={inhalt.texte.europäischeProduktnorm} /></div>
            <h4 className="text-lg font-bold text-text-main mb-2"><MdText text={inhalt.texte.dinEn1504Reihe} /></h4>
            <p className="text-xs text-home-grau mb-3 leading-relaxed"><MdText text={inhalt.texte.harmonisierteEuropäischeNormRegelt} /></p>
            <div className="border-t border-home-grau/30 pt-3 mt-2 space-y-2">
              <span className="text-xs font-bold text-shiraz block"><MdText text={inhalt.texte.gliederungStruktur3} /></span>
              <ul className="text-xs space-y-1 text-text-main list-disc pl-4">
                <li><MdText text={inhalt.texte.teile18Definitionen} /></li>
                <li><MdText text={inhalt.texte.teil9AllgemeinePrinzipien} /></li>
                <li><MdText text={inhalt.texte.teil10BaustellenanwendungUnd} /></li>
              </ul>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-home-grau/30">
            <div className="bg-purple-50 text-purple-950 p-2.5 rounded text-xs"><MdText text={inhalt.texte.gültigkeitStändigAnwendbarFür} /></div>
          </div>
        </div>
      </div>

      {/* Interaktiver Szenarien-Check */}
      <div className="bg-slate-50 p-6 rounded-2xl border border-home-grau/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <h3 className="text-xl font-bold text-text-main flex items-center gap-2"><MdText text={inhalt.texte.regelwerksKollisionWelchesRegelwerk} /></h3>
  <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
    <p><MdText text={inhalt.texte.wählenSieEinPraxisnahes} /></p>
  </div>
          <div className="shrink-0">
            <select 
              value={selectedScenario} 
              onChange={(e) => setSelectedScenario(e.target.value)}
              className="p-2 border border-home-grau/30 rounded-lg text-xs font-bold text-text-main bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-shiraz"
            >
              {szenarien.map((sz) => (
                <option key={sz.id} value={sz.id}>{sz.title}</option>
              ))}
            </select>
          </div>
        </div>

        {szenarien.filter(s => s.id === selectedScenario).map((sz) => (
          <div key={sz.id} className="bg-white p-5 rounded-xl border border-home-grau/25 shadow-sm space-y-4 animate-in fade-in duration-300">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-home-grau/30 pb-3">
              <span className="font-bold text-sm text-text-main">{sz.title}</span>
              <span className={`text-xs font-extrabold uppercase px-2.5 py-1 rounded inline-block border ${sz.badgeColor}`}>
                {sz.regulatoryAnswer}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-off-white/60 p-3.5 rounded-lg border border-home-grau/10">
                <span className="font-bold text-shiraz block mb-1"><MdText text={inhalt.texte.schadenfallAufgabenstellung} /></span>
                <p className="text-text-main leading-relaxed">{sz.problem}</p>
              </div>
              <div className="bg-off-white/60 p-3.5 rounded-lg border border-home-grau/10">
                <span className="font-bold text-emerald-700 block mb-1"><MdText text={inhalt.texte.rechtlicheNormativeEinstufung} /></span>
                <p className="text-text-main leading-relaxed">{sz.details}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chronologische Übersicht */}
      <div className="bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm">
        <h3 className="font-bold text-text-main text-base mb-4"><MdText text={inhalt.texte.chronologischeVertraglicheKlarstellung} /></h3>
        <div className="space-y-3.5 text-xs text-text-main">
          <p><MdText text={inhalt.texte.imFalleEinerAbweichung} /></p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            <div className="p-3 bg-red-50/40 rounded-lg border border-red-100">
              <span className="font-bold text-red-800 block mb-1"><MdText text={inhalt.texte.t1StandsicherheitsrelevanteBauteileGesetz} /></span><MdText text={inhalt.texte.dieTrInstandhaltungSteht} /></div>
            <div className="p-3 bg-emerald-50/40 rounded-lg border border-emerald-100">
              <span className="font-bold text-emerald-800 block mb-1"><MdText text={inhalt.texte.t2VertraglicherSollZustand} /></span><MdText text={inhalt.texte.liegtKeineStatischeRelevanz} /></div>
            <div className="p-3 bg-purple-50/40 rounded-lg border border-purple-100">
              <span className="font-bold text-purple-800 block mb-1"><MdText text={inhalt.texte.t3ProduktEigenschaftenCe} /></span><MdText text={inhalt.texte.alleEingesetztenMörtelAnstriche} /></div>
          </div>
        </div>
      </div>
    </div>
  );
}
