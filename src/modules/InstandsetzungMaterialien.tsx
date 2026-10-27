import React, { useState } from 'react';
import { 
  Layers, 
  Trees, 
  Shield, 
  Box, 
  TrendingUp, 
  Wrench, 
  AlertTriangle, 
  Flame, 
  Droplets, 
  Hammer, 
  RefreshCw
} from 'lucide-react';
import { InlineMath } from 'react-katex';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import inhalt from '@/content/instandsetzungmaterialien/InstandsetzungMaterialien.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { AuswahlGruppe, ReiterLeiste, alsOption, alsReiter, reiterPanel } from '../components/ui/Auswahlgruppe';

interface InstandsetzungMaterialienProps {
  initialMaterial?: 'holz' | 'metalle' | 'kunststoffe' | 'asphalt' | 'mauerwerk';
}

export default function InstandsetzungMaterialien({ initialMaterial = 'holz' }: InstandsetzungMaterialienProps) {
  const [selectedMaterial, setSelectedMaterial] = useState<'holz' | 'metalle' | 'kunststoffe' | 'asphalt' | 'mauerwerk'>(initialMaterial);
  const [activeSubSection, setActiveSubSection] = useState<'uebersicht' | 'schutz' | 'instandsetzung' | 'praxis'>('uebersicht');

  return (
    <div className="flex flex-col gap-6 w-full py-4 animate-in fade-in duration-300">
      
      {/* Header Container */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-home-grau/20 pb-4 mb-4">
          <div>
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
              <Layers className="text-shiraz" size={24} /><MdText text={inhalt.texte.schutzInstandsetzungNachMaterialien} /></h2>
            <p className="text-xs text-text-main/70 mt-1"><MdText text={inhalt.texte.werkstoffspezifischeSchutzUndSanierungsv} /></p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-shiraz/10 text-shiraz border border-shiraz/20 self-start md:self-auto"><MdText text={inhalt.texte.din68800DinEn} /></span>
        </div>

        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 leading-relaxed">
          <p><MdText text={inhalt.texte.jederBaustoffUnterliegtWerkstoffspezifis} /></p>
        </div>

        {/* Material Selector Bar */}
        <AuswahlGruppe label="Werkstoff" className="flex flex-wrap gap-2 pt-4 border-t border-home-grau/20 mt-4">
          <button {...alsOption(selectedMaterial === 'holz')}
            onClick={() => { setSelectedMaterial('holz'); setActiveSubSection('uebersicht'); }}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              selectedMaterial === 'holz'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <Trees size={16} /><MdText text={inhalt.texte.holzDin68800} /></button>
          <button {...alsOption(selectedMaterial === 'metalle')}
            onClick={() => { setSelectedMaterial('metalle'); setActiveSubSection('uebersicht'); }}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              selectedMaterial === 'metalle'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <Shield size={16} /><MdText text={inhalt.texte.metalleStahlIso12944} /></button>
          <button {...alsOption(selectedMaterial === 'kunststoffe')}
            onClick={() => { setSelectedMaterial('kunststoffe'); setActiveSubSection('uebersicht'); }}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              selectedMaterial === 'kunststoffe'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <Box size={16} /><MdText text={inhalt.texte.kunststoffeFugenDvsDin} /></button>
          <button {...alsOption(selectedMaterial === 'asphalt')}
            onClick={() => { setSelectedMaterial('asphalt'); setActiveSubSection('uebersicht'); }}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              selectedMaterial === 'asphalt'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <TrendingUp size={16} /><MdText text={inhalt.texte.asphaltBitumenZtvBea} /></button>
          <button {...alsOption(selectedMaterial === 'mauerwerk')}
            onClick={() => { setSelectedMaterial('mauerwerk'); setActiveSubSection('uebersicht'); }}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              selectedMaterial === 'mauerwerk'
                ? 'bg-shiraz text-white border-shiraz shadow-md'
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <Wrench size={16} /><MdText text={inhalt.texte.mauerwerkNatursteinWta} /></button>
        </AuswahlGruppe>
      </div>

      {/* Sub-Section Tabs within the Selected Material */}
      <ReiterLeiste label="Bereiche Instandsetzungsmaterial" className="flex gap-2 border-b border-home-grau/30 pb-2">
        <button {...alsReiter(activeSubSection === 'uebersicht', 'instmat-bereich', 'uebersicht')}
          onClick={() => setActiveSubSection('uebersicht')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeSubSection === 'uebersicht'
              ? 'bg-text-main text-white'
              : 'bg-white text-slate-700 border border-home-grau/30 hover:bg-off-white'
          }`}
        ><MdText text={inhalt.texte.übersichtSchadensmechanismen} /></button>
        <button {...alsReiter(activeSubSection === 'schutz', 'instmat-bereich', 'schutz')}
          onClick={() => setActiveSubSection('schutz')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeSubSection === 'schutz'
              ? 'bg-text-main text-white'
              : 'bg-white text-slate-700 border border-home-grau/30 hover:bg-off-white'
          }`}
        ><MdText text={inhalt.texte.präventiverSchutz} /></button>
        <button {...alsReiter(activeSubSection === 'instandsetzung', 'instmat-bereich', 'instandsetzung')}
          onClick={() => setActiveSubSection('instandsetzung')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeSubSection === 'instandsetzung'
              ? 'bg-text-main text-white'
              : 'bg-white text-slate-700 border border-home-grau/30 hover:bg-off-white'
          }`}
        ><MdText text={inhalt.texte.instandsetzungSanierung} /></button>
        <button {...alsReiter(activeSubSection === 'praxis', 'instmat-bereich', 'praxis')}
          onClick={() => setActiveSubSection('praxis')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeSubSection === 'praxis'
              ? 'bg-text-main text-white'
              : 'bg-white text-slate-700 border border-home-grau/30 hover:bg-off-white'
          }`}
        ><MdText text={inhalt.texte.praxiswissenSchadensfälle} /></button>
      </ReiterLeiste>

      {/* ========================================================================= */}
      {/* MATERIAL 1: HOLZ */}
      {/* ========================================================================= */}
      {selectedMaterial === 'holz' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {activeSubSection === 'uebersicht' && (
            <div {...reiterPanel('instmat-bereich', activeSubSection)} className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-home-grau/20 pb-3">
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <Trees className="text-shiraz" size={20} /><MdText text={inhalt.texte.holzschutzHolzinstandsetzungDin68800} /></h3>
                <span className="text-xs font-mono bg-off-white px-2 py-1 rounded border border-home-grau/30 text-slate-600"><MdText text={inhalt.texte.gebrauchsklassenGk0Bis} /></span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed"><MdText text={inhalt.texte.alsOrganischerAnisotropHygroskopischer} /></p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                  <strong className="text-slate-900 block mb-1"><MdText text={inhalt.texte.pilzbefallBraunfäuleHausschwamm} /></strong>
                  <p className="text-slate-700 leading-relaxed"><MdText text={inhalt.texte.abbauVonCelluloseUnd} /></p>
                </div>
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                  <strong className="text-slate-900 block mb-1"><MdText text={inhalt.texte.insektenbefallHausbockAnobien} /></strong>
                  <p className="text-slate-700 leading-relaxed"><MdText text={inhalt.texte.larvenFressenVerborgeneGänge} /></p>
                </div>
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                  <strong className="text-slate-900 block mb-1"><MdText text={inhalt.texte.verwitterungUvPhotooxidation} /></strong>
                  <p className="text-slate-700 leading-relaxed"><MdText text={inhalt.texte.uvStrahlungSpaltetDas} /></p>
                </div>
              </div>
            </div>
          )}

          {activeSubSection === 'schutz' && (
            <div {...reiterPanel('instmat-bereich', activeSubSection)} className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-slate-900 border-b border-home-grau/20 pb-3"><MdText text={inhalt.texte.präventiverHolzschutzNachDin} /></h3>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                  <strong className="text-shiraz block mb-1"><MdText text={inhalt.texte.t1BaulichKonstruktiverHolzschutz} /></strong>
                  <p className="text-slate-700 leading-relaxed mb-2"><MdText text={inhalt.texte.nachDin688002} /></p>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    <li><MdText text={inhalt.texte.dachüberständeZumSchutzDer} /></li>
                    <li><MdText text={inhalt.texte.sockelabstandVonMindestens30} /></li>
                    <li><MdText text={inhalt.texte.hinterlüftungVonHolzfassadenMind} /></li>
                    <li><MdText text={inhalt.texte.schutzDesHirnholzesDurch} /></li>
                    <li><MdText text={inhalt.texte.dampfdiffusionsoffeneSchichtaufbautenZur} /></li>
                  </ul>
                </div>

                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                  <strong className="text-shiraz block mb-1"><MdText text={inhalt.texte.t2ChemischerHolzschutzDin} /></strong>
                  <p className="text-slate-700 leading-relaxed mb-2"><MdText text={inhalt.texte.nurZulässigWennGefährdung} /></p>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    <li><MdText text={inhalt.texte.kesseldruckimprägnierungKdiVakuumDruck} /></li>
                    <li><MdText text={inhalt.texte.wirkstoffprüfungZertifizierteHolzschutzm} /></li>
                  </ul>
                </div>

                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                  <strong className="text-shiraz block mb-1"><MdText text={inhalt.texte.t3ModifizierteHölzerDauerhaftigkeitsklass} /></strong>
                  <p className="text-slate-700 leading-relaxed"><MdText text={inhalt.texte.einsatzVonHölzernMit} /></p>
                </div>
              </div>
            </div>
          )}

          {activeSubSection === 'instandsetzung' && (
            <div {...reiterPanel('instmat-bereich', activeSubSection)} className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-slate-900 border-b border-home-grau/20 pb-3"><MdText text={inhalt.texte.instandsetzungsverfahrenFürGeschädigteHo} /></h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20 space-y-2">
                  <strong className="text-slate-900 flex items-center gap-1.5">
                    <Flame size={14} className="text-shiraz" /><MdText text={inhalt.texte.bekämpfenderHolzschutzDin68800} /></strong>
                  <p className="text-slate-700 leading-relaxed"><MdText text={inhalt.texte.bekämpfungEchterHausschwammBefallenes} /></p>
                  <p className="text-slate-700 leading-relaxed"><MdText text={inhalt.texte.heißluftverfahrenGegenInsektenBauteilerw} /></p>
                </div>

                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20 space-y-2">
                  <strong className="text-slate-900 flex items-center gap-1.5">
                    <Hammer size={14} className="text-shiraz" /><MdText text={inhalt.texte.statischeInstandsetzungHolzprothesen} /></strong>
                  <p className="text-slate-700 leading-relaxed"><MdText text={inhalt.texte.balkenkopfSanierungMorscheBalkenköpfe} /></p>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    <li><MdText text={inhalt.texte.eingeklebteGewindestangenAusEdelstahl} /></li>
                    <li><MdText text={inhalt.texte.seitlicheStahllaschenOderAufgeschraubte} /></li>
                    <li><MdText text={inhalt.texte.epoxidharzHolzersatzmassenFürLokale} /></li>
                  </ul>
                  <p className="text-slate-700 leading-relaxed"><MdText text={inhalt.texte.schubBiegeverstärkungEinschraubenVon} /></p>
                </div>
              </div>
            </div>
          )}

          {activeSubSection === 'praxis' && (
            <div {...reiterPanel('instmat-bereich', activeSubSection)} className="bg-slate-50 border border-home-grau/30 p-5 rounded-xl space-y-3 text-xs">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <AlertTriangle className="text-shiraz" size={16} /><MdText text={inhalt.texte.häufigerPraxisfehlerLuftdichtesEinpacken} /></h4>
              <p className="text-slate-800 leading-relaxed"><MdText text={inhalt.texte.schadensbildBeiDerEnergetischen} /></p>
              <p className="text-slate-800 leading-relaxed"><MdText text={inhalt.texte.fataleFolgeRaumseitigEindringende} /></p>
              <p className="text-slate-800 leading-relaxed"><MdText text={inhalt.texte.fachgerechteSanierungStirnUnd} /></p>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* MATERIAL 2: METALLE & STAHL */}
      {/* ========================================================================= */}
      {selectedMaterial === 'metalle' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {activeSubSection === 'uebersicht' && (
            <div {...reiterPanel('instmat-bereich', activeSubSection)} className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-home-grau/20 pb-3">
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <Shield className="text-shiraz" size={20} /><MdText text={inhalt.texte.metallschutzKorrosionsschutzDinEn} /></h3>
                <span className="text-xs font-mono bg-off-white px-2 py-1 rounded border border-home-grau/30 text-slate-600"><MdText text={inhalt.texte.klassenC1BisCx} /></span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed"><MdText text={inhalt.texte.ungeschützterBaustahlKorrodiertIn} /></p>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-off-white border-b border-home-grau/30 text-slate-800">
                      <th className="p-2.5 font-bold"><MdText text={inhalt.texte.kategorieIso129442} /></th>
                      <th className="p-2.5 font-bold">Korrosivitätsniveau</th>
                      <th className="p-2.5 font-bold"><MdText text={inhalt.texte.typischeUmgebung} /></th>
                      <th className="p-2.5 font-bold"><MdText text={inhalt.texte.zinkabtragMA} /></th>
                      <th className="p-2.5 font-bold"><MdText text={inhalt.texte.stahlabtragMA} /></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-home-grau/20 text-slate-700">
                    <tr>
                      <td className="p-2.5 font-bold text-blue-700">C1</td>
                      <td className="p-2.5">Sehr gering</td>
                      <td className="p-2.5"><MdText text={inhalt.texte.innenräumeBeheiztBürosSchulen} /></td>
                      <td className="p-2.5">&lt; 0,1</td>
                      <td className="p-2.5">&le; 1,3</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-blue-700">C2</td>
                      <td className="p-2.5">Gering</td>
                      <td className="p-2.5"><MdText text={inhalt.texte.unbeheizteGebäudeLagerhallenSporthallen} /></td>
                      <td className="p-2.5">0,1 bis 0,7</td>
                      <td className="p-2.5"><MdText text={inhalt.texte.t13Bis25} /></td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-amber-700">C3</td>
                      <td className="p-2.5">Mäßig</td>
                      <td className="p-2.5"><MdText text={inhalt.texte.stadtUndIndustrieatmosphäreMit} /></td>
                      <td className="p-2.5">0,7 bis 2,1</td>
                      <td className="p-2.5">&gt; 25 bis 50</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-rose-700">C4</td>
                      <td className="p-2.5">Stark</td>
                      <td className="p-2.5"><MdText text={inhalt.texte.industriegebieteKüstenbereicheMitMäßiger} /></td>
                      <td className="p-2.5">2,1 bis 4,2</td>
                      <td className="p-2.5">&gt; 50 bis 80</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-rose-700">C5</td>
                      <td className="p-2.5">Sehr stark</td>
                      <td className="p-2.5"><MdText text={inhalt.texte.industrieMitHoherFeuchte} /></td>
                      <td className="p-2.5">4,2 bis 8,4</td>
                      <td className="p-2.5"><MdText text={inhalt.texte.t80Bis200} /></td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-purple-700">CX</td>
                      <td className="p-2.5">Extrem</td>
                      <td className="p-2.5"><MdText text={inhalt.texte.offshoreSpritzwasserzonenTunnelsMit} /></td>
                      <td className="p-2.5"><MdText text={inhalt.texte.t84Bis25} /></td>
                      <td className="p-2.5"><MdText text={inhalt.texte.t200Bis700} /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSubSection === 'schutz' && (
            <div {...reiterPanel('instmat-bereich', activeSubSection)} className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-slate-900 border-b border-home-grau/20 pb-3"><MdText text={inhalt.texte.korrosionsschutzsystemeNachDinEn} /></h3>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                  <strong className="text-shiraz block mb-1"><MdText text={inhalt.texte.t1OberflächenvorbereitungNachIso} /></strong>
                  <p className="text-slate-700 leading-relaxed mb-2"><MdText text={inhalt.texte.ohneEinwandfreieEntrostungVersagt} /></p>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    <li><MdText text={inhalt.texte.sa2SehrGründliches} /></li>
                    <li><MdText text={inhalt.texte.sa3OptischReines} /></li>
                    <li><MdText text={inhalt.texte.rauheitDinEnIso} /></li>
                  </ul>
                </div>

                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                  <strong className="text-shiraz block mb-1"><MdText text={inhalt.texte.t2MehrschichtigeBeschichtungssystemeTypis} /></strong>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    <li><MdText text={inhalt.texte.grundbeschichtung6080M} /></li>
                    <li><MdText text={inhalt.texte.zwischenbeschichtung80160M} /></li>
                    <li><MdText text={inhalt.texte.deckbeschichtung6080M} /></li>
                  </ul>
                </div>

                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                  <strong className="text-shiraz block mb-1"><MdText text={inhalt.texte.t3SchutzdauerbereicheNachDin} /></strong>
                  <p className="text-slate-700 leading-relaxed mb-2"><MdText text={inhalt.texte.dieNeufassungDerNormenreihe} /></p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                    <div className="bg-white p-2 rounded border border-home-grau/25">
                      <span className="font-bold text-slate-800 text-xs block">L (Gering)</span>
                      <span className="text-[11px] text-slate-500 font-mono">bis 7 Jahre</span>
                    </div>
                    <div className="bg-white p-2 rounded border border-home-grau/25">
                      <span className="font-bold text-slate-800 text-xs block">M (Mäßig)</span>
                      <span className="text-[11px] text-slate-500 font-mono"><MdText text={inhalt.texte.t7Bis15Jahre} /></span>
                    </div>
                    <div className="bg-white p-2 rounded border border-home-grau/25">
                      <span className="font-bold text-slate-800 text-xs block">H (Hoch)</span>
                      <span className="text-[11px] text-slate-500 font-mono"><MdText text={inhalt.texte.t15Bis25Jahre} /></span>
                    </div>
                    <div className="bg-white p-2 rounded border border-shiraz/30 bg-rose-50/20">
                      <span className="font-bold text-shiraz text-xs block"><MdText text={inhalt.texte.vhSehrHoch} /></span>
                      <span className="text-[11px] text-shiraz font-mono font-bold"><MdText text={inhalt.texte.t25JahreNeu} /></span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                  <strong className="text-shiraz block mb-1"><MdText text={inhalt.texte.t4DuplexSystemeFeuerverzinkung} /></strong>
                  <p className="text-slate-700 leading-relaxed"><MdText text={inhalt.texte.kombinationAusStückverzinkungNach} /></p>
                </div>
              </div>
            </div>
          )}

          {activeSubSection === 'instandsetzung' && (
            <div {...reiterPanel('instmat-bereich', activeSubSection)} className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-slate-900 border-b border-home-grau/20 pb-3"><MdText text={inhalt.texte.instandsetzungUndVerstärkungGeschädigter} /></h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20 space-y-2">
                  <strong className="text-slate-900 flex items-center gap-1.5">
                    <RefreshCw size={14} className="text-shiraz" /><MdText text={inhalt.texte.altanstrichsanierungNachIso4628} /></strong>
                  <p className="text-slate-700 leading-relaxed"><MdText text={inhalt.texte.ermittlungDesRostgradsNach} /></p>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    <li><MdText text={inhalt.texte.ri1BisRi} /></li>
                    <li><MdText text={inhalt.texte.ri4BisRi} /></li>
                  </ul>
                </div>

                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20 space-y-2">
                  <strong className="text-slate-900 flex items-center gap-1.5">
                    <Wrench size={14} className="text-shiraz" /><MdText text={inhalt.texte.statischeErtüchtigungVonStahlbauteilen} /></strong>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    <li><MdText text={inhalt.texte.querschnittsverlustDurchLochfraßAnschwei} /></li>
                    <li><MdText text={inhalt.texte.ermüdungsrisseSetzenVonEntlastungsbohrun} /></li>
                    <li><MdText text={inhalt.texte.nietensanierungGelockerteOderDurchgerost} /></li>
                    <li><MdText text={inhalt.texte.cfkLamellenverstärkungAufklebenHochmodul} /></li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeSubSection === 'praxis' && (
            <div {...reiterPanel('instmat-bereich', activeSubSection)} className="bg-slate-50 border border-home-grau/30 p-5 rounded-xl space-y-3 text-xs">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <AlertTriangle className="text-shiraz" size={16} /><MdText text={inhalt.texte.häufigerPraxisfehlerTaupunktunterschreit} /></h4>
              <p className="text-slate-800 leading-relaxed"><MdText text={inhalt.texte.ursacheBeimBeschichtenVon} /></p>
              <p className="text-slate-800 leading-relaxed"><MdText text={inhalt.texte.anforderungDinEnIso} /></p>
              <p className="text-slate-800 leading-relaxed"><MdText text={inhalt.texte.schadensfolgeEinUnsichtbarerMikroskopisc} /></p>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* MATERIAL 3: KUNSTSTOFFE & FUGEN */}
      {/* ========================================================================= */}
      {selectedMaterial === 'kunststoffe' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {activeSubSection === 'uebersicht' && (
            <div {...reiterPanel('instmat-bereich', activeSubSection)} className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-home-grau/20 pb-3">
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <Box className="text-shiraz" size={20} /><MdText text={inhalt.texte.schutzInstandsetzungVonKunststoffen} /></h3>
                <span className="text-xs font-mono bg-off-white px-2 py-1 rounded border border-home-grau/30 text-slate-600"><MdText text={inhalt.texte.din18540Dvs2207} /></span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed"><MdText text={inhalt.texte.kunststoffeImBauwesenFlachdachbahnen} /></p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                  <strong className="text-slate-900 block mb-1"><MdText text={inhalt.texte.photooxidationVersprödung} /></strong>
                  <p className="text-slate-700 leading-relaxed"><MdText text={inhalt.texte.uvQuantenSpaltenC} /></p>
                </div>
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                  <strong className="text-slate-900 block mb-1">Weichmachermigration</strong>
                  <p className="text-slate-700 leading-relaxed"><MdText text={inhalt.texte.niedermolekulareWeichmacherPhthalateIn} /></p>
                </div>
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                  <strong className="text-slate-900 block mb-1"><MdText text={inhalt.texte.spannungsrisskorrosionEsc} /></strong>
                  <p className="text-slate-700 leading-relaxed"><MdText text={inhalt.texte.gleichzeitigeEinwirkungMechanischerZugsp} /></p>
                </div>
              </div>
            </div>
          )}

          {activeSubSection === 'schutz' && (
            <div {...reiterPanel('instmat-bereich', activeSubSection)} className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-slate-900 border-b border-home-grau/20 pb-3"><MdText text={inhalt.texte.präventiveSchutzmaßnahmenFürBauwerkspoly} /></h3>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                  <strong className="text-shiraz block mb-1"><MdText text={inhalt.texte.t1UvUndAlterungsstabilisierung} /></strong>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    <li><MdText text={inhalt.texte.rußCarbonBlackFein} /></li>
                    <li><MdText text={inhalt.texte.halsLichtschutzmittelHinderedAmine} /></li>
                    <li><MdText text={inhalt.texte.uvAbsorberHydroxyphenylbenztriazoleWande} /></li>
                  </ul>
                </div>

                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                  <strong className="text-shiraz block mb-1"><MdText text={inhalt.texte.t2WeichmacherschutzTrennlagen} /></strong>
                  <p className="text-slate-700 leading-relaxed"><MdText text={inhalt.texte.beiVerlegungVonPvc} /></p>
                </div>

                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                  <strong className="text-shiraz block mb-1"><MdText text={inhalt.texte.t3KonstruktiveFugenplanungDin} /></strong>
                  <p className="text-slate-700 leading-relaxed"><MdText text={inhalt.texte.sicherungDerZweiflankenhaftungDurch} /></p>
                </div>
              </div>
            </div>
          )}

          {activeSubSection === 'instandsetzung' && (
            <div {...reiterPanel('instmat-bereich', activeSubSection)} className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-slate-900 border-b border-home-grau/20 pb-3"><MdText text={inhalt.texte.sanierungsverfahrenFürKunststoffeDichtun} /></h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20 space-y-2">
                  <strong className="text-slate-900 flex items-center gap-1.5">
                    <Flame size={14} className="text-shiraz" /><MdText text={inhalt.texte.thermoplastischesKunststoffschweißenDvs2} /></strong>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    <li><MdText text={inhalt.texte.warmgasziehschweißenWzFügenVon} /></li>
                    <li><MdText text={inhalt.texte.heizelementschweißenHsSpiegelschweißenSt} /></li>
                    <li><MdText text={inhalt.texte.heizwendelschweißenHmAufschiebenVon} /></li>
                  </ul>
                </div>

                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20 space-y-2">
                  <strong className="text-slate-900 flex items-center gap-1.5">
                    <Wrench size={14} className="text-shiraz" /><MdText text={inhalt.texte.flüssigkunststoffInlinerSanierung} /></strong>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    <li><MdText text={inhalt.texte.flüssigkunststoffÜberarbeitungPmma2k} /></li>
                    <li><MdText text={inhalt.texte.fugensanierungAltdichtstoffRestlosHeraus} /></li>
                    <li><MdText text={inhalt.texte.schlauchreliningKanalrohrinstandsetzungE} /></li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeSubSection === 'praxis' && (
            <div {...reiterPanel('instmat-bereich', activeSubSection)} className="bg-slate-50 border border-home-grau/30 p-5 rounded-xl space-y-3 text-xs">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <AlertTriangle className="text-shiraz" size={16} /><MdText text={inhalt.texte.häufigerPraxisfehlerSchweißenAuf} /></h4>
              <p className="text-slate-800 leading-relaxed"><MdText text={inhalt.texte.problemBeiDerInstandsetzung} /></p>
              <p className="text-slate-800 leading-relaxed"><MdText text={inhalt.texte.schadensursacheDurchLangjährigeUv} /></p>
              <p className="text-slate-800 leading-relaxed"><MdText text={inhalt.texte.fachgerechtesVorgehenNachDvs} /></p>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* MATERIAL 4: ASPHALT & BITUMEN */}
      {/* ========================================================================= */}
      {selectedMaterial === 'asphalt' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {activeSubSection === 'uebersicht' && (
            <div {...reiterPanel('instmat-bereich', activeSubSection)} className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-home-grau/20 pb-3">
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <TrendingUp className="text-shiraz" size={20} /><MdText text={inhalt.texte.schutzErhaltungVonAsphaltbefestigungen} /></h3>
                <span className="text-xs font-mono bg-off-white px-2 py-1 rounded border border-home-grau/30 text-slate-600"><MdText text={inhalt.texte.rsto1224Ztv} /></span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed"><MdText text={inhalt.texte.asphaltIstEinThermoviskoelastischer} /></p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                  <strong className="text-slate-900 block mb-1"><MdText text={inhalt.texte.spurrinnenVerformung} /></strong>
                  <p className="text-slate-700 leading-relaxed"><MdText text={inhalt.texte.beiHohenSommertemperaturenSinkt} /></p>
                </div>
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                  <strong className="text-slate-900 block mb-1"><MdText text={inhalt.texte.ermüdungsrisseNetzrisse} /></strong>
                  <p className="text-slate-700 leading-relaxed"><MdText text={inhalt.texte.alterungsbedingteVersprödungFührtBei} /></p>
                </div>
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                  <strong className="text-slate-900 block mb-1"><MdText text={inhalt.texte.schlaglöcherFrostaufbrüche} /></strong>
                  <p className="text-slate-700 leading-relaxed"><MdText text={inhalt.texte.wasserDringtÜberRisse} /></p>
                </div>
              </div>
            </div>
          )}

          {activeSubSection === 'schutz' && (
            <div {...reiterPanel('instmat-bereich', activeSubSection)} className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-slate-900 border-b border-home-grau/20 pb-3"><MdText text={inhalt.texte.präventiveSchutzmaßnahmenFürAsphaltbeläg} /></h3>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                  <strong className="text-shiraz block mb-1"><MdText text={inhalt.texte.t1SamiSchichtenStress} /></strong>
                  <p className="text-slate-700 leading-relaxed"><MdText text={inhalt.texte.elastomermodifizierteBitumenschichtOftMi} /></p>
                </div>

                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                  <strong className="text-shiraz block mb-1"><MdText text={inhalt.texte.t2OberflächenbehandlungenObNach} /></strong>
                  <p className="text-slate-700 leading-relaxed"><MdText text={inhalt.texte.aufspritzenEinerPolymermodifiziertenBitu} /></p>
                </div>

                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                  <strong className="text-shiraz block mb-1"><MdText text={inhalt.texte.t3BitumenVerjüngungsmittelRejuvenators} /></strong>
                  <p className="text-slate-700 leading-relaxed"><MdText text={inhalt.texte.sprühlösungenAufBasisSpezieller} /></p>
                </div>
              </div>
            </div>
          )}

          {activeSubSection === 'instandsetzung' && (
            <div {...reiterPanel('instmat-bereich', activeSubSection)} className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-slate-900 border-b border-home-grau/20 pb-3"><MdText text={inhalt.texte.instandsetzungsverfahrenNachZtvBea} /></h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20 space-y-2">
                  <strong className="text-slate-900 flex items-center gap-1.5">
                    <Wrench size={14} className="text-shiraz" /><MdText text={inhalt.texte.rissesanierungKleinflächigeReparaturen} /></strong>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    <li><MdText text={inhalt.texte.rissheißvergussZtvFugStb} /></li>
                    <li><MdText text={inhalt.texte.schlaglochsanierungKaltmischgutIstNur} /></li>
                  </ul>
                </div>

                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20 space-y-2">
                  <strong className="text-slate-900 flex items-center gap-1.5">
                    <RefreshCw size={14} className="text-shiraz" /><MdText text={inhalt.texte.großflächigeDeckenerneuerungDünnschichte} /></strong>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    <li><MdText text={inhalt.texte.dskDünneSchichtenIm} /></li>
                    <li><MdText text={inhalt.texte.kaltfräsenDeckschichterneuerungAbfräsenD} /></li>
                    <li><MdText text={inhalt.texte.inSituHeißrecyclingRepave} /></li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeSubSection === 'praxis' && (
            <div {...reiterPanel('instmat-bereich', activeSubSection)} className="bg-slate-50 border border-home-grau/30 p-5 rounded-xl space-y-3 text-xs">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <AlertTriangle className="text-shiraz" size={16} /><MdText text={inhalt.texte.häufigerPraxisfehlerMangelhafterSchichte} /></h4>
              <p className="text-slate-800 leading-relaxed"><MdText text={inhalt.texte.schadensbildNach2Bis} /></p>
              <p className="text-slate-800 leading-relaxed"><MdText text={inhalt.texte.ursacheVorDemEinbau} /></p>
              <p className="text-slate-800 leading-relaxed"><MdText text={inhalt.texte.qualitätsprüfungNachZtvAsphalt} /></p>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* MATERIAL 5: MAUERWERK & NATURSTEIN */}
      {/* ========================================================================= */}
      {selectedMaterial === 'mauerwerk' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {activeSubSection === 'uebersicht' && (
            <div {...reiterPanel('instmat-bereich', activeSubSection)} className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-home-grau/20 pb-3">
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <Wrench className="text-shiraz" size={20} /><MdText text={inhalt.texte.schutzInstandsetzungVonMauerwerk} /></h3>
                <span className="text-xs font-mono bg-off-white px-2 py-1 rounded border border-home-grau/30 text-slate-600"><MdText text={inhalt.texte.wtaMerkblätterReihe2} /></span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed"><MdText text={inhalt.texte.mauerwerksUndNatursteinbautenZiegel} /></p>
            </div>
          )}

          {activeSubSection === 'schutz' && (
            <div {...reiterPanel('instmat-bereich', activeSubSection)} className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-slate-900 border-b border-home-grau/20 pb-3"><MdText text={inhalt.texte.präventiverSchutzVonHistorischem} /></h3>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                  <strong className="text-shiraz block mb-1"><MdText text={inhalt.texte.t1HydrophobierungMitAlkylalkoxysilanen} /></strong>
                  <p className="text-slate-700 leading-relaxed"><MdText text={inhalt.texte.eindringtiefeMindestens3Bis} /></p>
                </div>

                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                  <strong className="text-shiraz block mb-1"><MdText text={inhalt.texte.t2KonservierungMitKieselsäureester} /></strong>
                  <p className="text-slate-700 leading-relaxed"><MdText text={inhalt.texte.beiMürbenAbsandendenNatursteinen} /></p>
                </div>
              </div>
            </div>
          )}

          {activeSubSection === 'instandsetzung' && (
            <div {...reiterPanel('instmat-bereich', activeSubSection)} className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-slate-900 border-b border-home-grau/20 pb-3"><MdText text={inhalt.texte.instandsetzungsverfahrenNachWta} /></h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20 space-y-2">
                  <strong className="text-slate-900 flex items-center gap-1.5">
                    <Droplets size={14} className="text-shiraz" /><MdText text={inhalt.texte.nachträglicheHorizontalsperrenWta4} /></strong>
                  <p className="text-slate-700 leading-relaxed"><MdText text={inhalt.texte.bohrlöcherVarnothing12textBis} /></p>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    <li><MdText text={inhalt.texte.silanCremesDrucklosHochkonzentrierte} /></li>
                    <li><MdText text={inhalt.texte.mikroemulsionenNiederdruckinjektionKontr} /></li>
                  </ul>
                </div>

                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20 space-y-2">
                  <strong className="text-slate-900 flex items-center gap-1.5">
                    <Layers size={14} className="text-shiraz" /><MdText text={inhalt.texte.sanierputzsystemeRissverankerung} /></strong>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    <li><MdText text={inhalt.texte.sanierputzNachWtaMerkblatt} /></li>
                    <li><MdText text={inhalt.texte.spiralankerSystemeHelikaleEdelstahl} /></li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeSubSection === 'praxis' && (
            <div {...reiterPanel('instmat-bereich', activeSubSection)} className="bg-slate-50 border border-home-grau/30 p-5 rounded-xl space-y-3 text-xs">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <AlertTriangle className="text-shiraz" size={16} /><MdText text={inhalt.texte.häufigerPraxisfehlerZementputzAuf} /></h4>
              <p className="text-slate-800 leading-relaxed"><MdText text={inhalt.texte.fehlerAufFeuchtemSalzbelastetem} /></p>
              <p className="text-slate-800 leading-relaxed"><MdText text={inhalt.texte.fataleFolgeZementputzBesitzt} /></p>
              <p className="text-slate-800 leading-relaxed"><MdText text={inhalt.texte.lösungAltputzMindestens80} /></p>
            </div>
          )}

        </div>
      )}

      {/* ModuleFooter */}
      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title={inhalt.werte.beispiel1SchutzdauerEines}
        zielGleichung="t_{Duplex} = S \cdot (t_{Zn} + t_{Lack})"
        schritte={inhalt.daten["InstandsetzungMaterialien.schritte"]}
        ergebnisHinweis={inhalt.werte.derSynergieeffektEntstehtWeil}
        normQuelle={inhalt.werte.dinEnIso9223}
      />
      <FormulaDerivationBox
        title={inhalt.werte.beispiel2ResttragfähigkeitEines}
        zielGleichung="\frac{W_{Rest}}{W_0} = \frac{b_r \cdot h_r^2}{b \cdot h^2}"
        schritte={inhalt.daten["InstandsetzungMaterialien.schritte_2"]}
        ergebnisHinweis={inhalt.werte.schon3CmFäule}
        normQuelle={inhalt.werte.din6880042020}
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="instandsetzung_materialien" />

      <ModuleFooter
        lastReviewed={inhalt.werte.oktober2026Ap12}
        weblinks={inhalt.daten["InstandsetzungMaterialien.weblinks"]}
        wikipedia={[
          { title: "Holzschutz", url: "https://de.wikipedia.org/wiki/Holzschutz" },
          { title: "Korrosionsschutz", url: "https://de.wikipedia.org/wiki/Korrosionsschutz" },
          { title: "Asphalt", url: "https://de.wikipedia.org/wiki/Asphalt" },
          { title: "Sanierputz", url: "https://de.wikipedia.org/wiki/Sanierputz" }
        ]}
        literatur={inhalt.daten["InstandsetzungMaterialien.literatur"]}
        regelwerke={inhalt.daten["InstandsetzungMaterialien.regelwerke"]}
        formeln={inhalt.daten["InstandsetzungMaterialien.formeln"]}
      />
    </div>
  );
}
