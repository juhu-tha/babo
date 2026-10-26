import React, { useState } from 'react';
import { 
  Shield, 
  ShieldCheck, 
  Layers, 
  CheckCircle2, 
  Zap, 
  TrendingUp, 
  FileText, 
  Compass
} from 'lucide-react';
import { InlineMath } from 'react-katex';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import inhalt from '@/content/schutzgrundlagen/SchutzGrundlagen.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs, type ModulTab } from '@/src/components/ui/ModuleTabs';

type SchutzReiter = 'prinzipien' | 'mechanismen' | 'lebensdauer' | 'verfahrenswahl';
const REITER: readonly ModulTab<SchutzReiter>[] = [
  { id: 'prinzipien', label: inhalt.texte.t1InstandsetzungsprinzipienDinEn.trim(), icon: Layers },
  { id: 'mechanismen', label: inhalt.texte.t2SchutzmechanismenPassivVs.trim(), icon: Shield },
  { id: 'lebensdauer', label: inhalt.texte.t3LebenszyklusDegradationTuutti.trim(), icon: TrendingUp },
  { id: 'verfahrenswahl', label: inhalt.texte.t4VerfahrenswahlMatrix.trim(), icon: Compass },
];

export default function SchutzGrundlagen() {
  const [activeTab, setActiveTab] = useState<SchutzReiter>('prinzipien');
  const [deSitterInitialCost, setDeSitterInitialCost] = useState<number>(1000);
  const [selectedDamageSource, setSelectedDamageSource] = useState<'carbonatisierung' | 'chloride' | 'feuchte' | 'risse' | 'verschleiss'>('carbonatisierung');

  return (
    <div className="flex flex-col gap-6 w-full py-4 animate-in fade-in duration-300">
      {/* Header Container */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-home-grau/20 pb-4 mb-4">
          <div>
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
              <ShieldCheck className="text-shiraz" size={24} /><MdText text={inhalt.texte.schutzGrundlagenInstandsetzungsprinzipie} /></h2>
            <p className="text-xs text-text-main/70 mt-1"><MdText text={inhalt.texte.systematikDesBauwerksschutzesNormative} /></p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-shiraz/10 text-shiraz border border-shiraz/20 self-start md:self-auto"><MdText text={inhalt.texte.dinEn15049} /></span>
        </div>

        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 leading-relaxed">
          <p><MdText text={inhalt.texte.derSchutzUndDie} /></p>
        </div>
      </div>

      <ModuleTabs label={inhalt.werte.reiterBereiche} tabs={REITER} aktiv={activeTab} onWechsel={setActiveTab} className="flex flex-col gap-6">

      {/* Tab 1: Instandsetzungsprinzipien nach DIN EN 1504-9 & TR Instandhaltung */}
      {activeTab === 'prinzipien' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Normativer Kontext */}
          <div className="bg-slate-50 border border-home-grau/30 p-5 rounded-xl">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 border-b border-home-grau/30 pb-2 mb-3">
              <FileText className="text-shiraz shrink-0" size={18} /><MdText text={inhalt.texte.harmonisiertesEuropäischesPrinzipiensyst} /></h3>
            <p className="text-sm text-slate-800 leading-relaxed"><MdText text={inhalt.texte.dieEuropäischeNormDin} /></p>
          </div>

          {/* Übersicht Prinzipien 1 bis 6: Betonschutz */}
          <div className="bg-white border border-home-grau/30 p-5 rounded-xl shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-home-grau/20 pb-2">
              <h4 className="font-bold text-sm text-text-main flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-shiraz/10 text-shiraz flex items-center justify-center text-xs font-bold">A</span><MdText text={inhalt.texte.prinzipienFürBetonschädenGefügeschutz} /></h4>
              <span className="text-[11px] text-slate-500 font-mono"><MdText text={inhalt.texte.prinzip1Bis6} /></span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                <div className="font-bold text-shiraz mb-1 flex items-center justify-between">
                  <span><MdText text={inhalt.texte.prinzip1PiSchutz} /></span>
                  <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-home-grau/30 text-slate-600"><MdText text={inhalt.texte.protectionAgainstIngress} /></span>
                </div>
                <p className="text-slate-700 leading-relaxed mb-2"><MdText text={inhalt.texte.reduzierungOderVerhinderungDes} /></p>
                <div className="text-[11px] text-slate-600 bg-white p-2 rounded border border-home-grau/20"><MdText text={inhalt.texte.verfahrenHydrophobierendeImprägnierungVe} /></div>
              </div>

              <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                <div className="font-bold text-shiraz mb-1 flex items-center justify-between">
                  <span><MdText text={inhalt.texte.prinzip2McFeuchtegehalt} /></span>
                  <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-home-grau/30 text-slate-600"><MdText text={inhalt.texte.moistureControl} /></span>
                </div>
                <p className="text-slate-700 leading-relaxed mb-2"><MdText text={inhalt.texte.einstellenUndHaltenDes} /></p>
                <div className="text-[11px] text-slate-600 bg-white p-2 rounded border border-home-grau/20"><MdText text={inhalt.texte.verfahrenWasserableitendeBeschichtungenS} /></div>
              </div>

              <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                <div className="font-bold text-shiraz mb-1 flex items-center justify-between">
                  <span><MdText text={inhalt.texte.prinzip3CrBetonersatz} /></span>
                  <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-home-grau/30 text-slate-600"><MdText text={inhalt.texte.concreteRestoration} /></span>
                </div>
                <p className="text-slate-700 leading-relaxed mb-2"><MdText text={inhalt.texte.wiederherstellungDesUrsprünglichenBautei} /></p>
                <div className="text-[11px] text-slate-600 bg-white p-2 rounded border border-home-grau/20"><MdText text={inhalt.texte.verfahrenManuellerMörtelauftragPcc} /></div>
              </div>

              <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                <div className="font-bold text-shiraz mb-1 flex items-center justify-between">
                  <span><MdText text={inhalt.texte.prinzip4SsTragwerksverstärkung} /></span>
                  <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-home-grau/30 text-slate-600"><MdText text={inhalt.texte.structuralStrengthening} /></span>
                </div>
                <p className="text-slate-700 leading-relaxed mb-2"><MdText text={inhalt.texte.erhöhungOderWiederherstellungDer} /></p>
                <div className="text-[11px] text-slate-600 bg-white p-2 rounded border border-home-grau/20"><MdText text={inhalt.texte.verfahrenAufgeklebteCfkLamellen} /></div>
              </div>

              <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                <div className="font-bold text-shiraz mb-1 flex items-center justify-between">
                  <span><MdText text={inhalt.texte.prinzip5PrPhysikalische} /></span>
                  <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-home-grau/30 text-slate-600"><MdText text={inhalt.texte.physicalResistance} /></span>
                </div>
                <p className="text-slate-700 leading-relaxed mb-2"><MdText text={inhalt.texte.erhöhungDesWiderstandesGegen} /></p>
                <div className="text-[11px] text-slate-600 bg-white p-2 rounded border border-home-grau/20"><MdText text={inhalt.texte.verfahrenHartstoffestricheVerschleißschi} /></div>
              </div>

              <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                <div className="font-bold text-shiraz mb-1 flex items-center justify-between">
                  <span><MdText text={inhalt.texte.prinzip6RcChemische} /></span>
                  <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-home-grau/30 text-slate-600"><MdText text={inhalt.texte.resistanceToChemicals} /></span>
                </div>
                <p className="text-slate-700 leading-relaxed mb-2"><MdText text={inhalt.texte.schutzGegenZersetzendeChemikalien} /></p>
                <div className="text-[11px] text-slate-600 bg-white p-2 rounded border border-home-grau/20"><MdText text={inhalt.texte.verfahrenEpoxidharzUndVinylesterbeschich} /></div>
              </div>
            </div>
          </div>

          {/* Übersicht Prinzipien 7 bis 11: Bewehrungskorrosionsschutz */}
          <div className="bg-white border border-home-grau/30 p-5 rounded-xl shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-home-grau/20 pb-2">
              <h4 className="font-bold text-sm text-text-main flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-shiraz/10 text-shiraz flex items-center justify-center text-xs font-bold">B</span><MdText text={inhalt.texte.prinzipienFürBewehrungskorrosionElektroc} /></h4>
              <span className="text-[11px] text-slate-500 font-mono"><MdText text={inhalt.texte.prinzip7Bis11} /></span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                <div className="font-bold text-shiraz mb-1 flex items-center justify-between">
                  <span><MdText text={inhalt.texte.prinzip7RpErhalt} /></span>
                  <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-home-grau/30 text-slate-600"><MdText text={inhalt.texte.restoringPassivity} /></span>
                </div>
                <p className="text-slate-700 leading-relaxed mb-2"><MdText text={inhalt.texte.schaffungVonChemischenBedingungen} /></p>
                <div className="text-[11px] text-slate-600 bg-white p-2 rounded border border-home-grau/20"><MdText text={inhalt.texte.verfahrenErhöhungDerBetondeckung} /></div>
              </div>

              <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                <div className="font-bold text-shiraz mb-1 flex items-center justify-between">
                  <span><MdText text={inhalt.texte.prinzip8IrErhöhung} /></span>
                  <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-home-grau/30 text-slate-600"><MdText text={inhalt.texte.increasingResistivity} /></span>
                </div>
                <p className="text-slate-700 leading-relaxed mb-2"><MdText text={inhalt.texte.steigerungDesElektrischenWiderstands} /></p>
                <div className="text-[11px] text-slate-600 bg-white p-2 rounded border border-home-grau/20"><MdText text={inhalt.texte.verfahrenWasserentzugHydrophobierungDich} /></div>
              </div>

              <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                <div className="font-bold text-shiraz mb-1 flex items-center justify-between">
                  <span><MdText text={inhalt.texte.prinzip9CcKathodische} /></span>
                  <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-home-grau/30 text-slate-600"><MdText text={inhalt.texte.cathodicControl} /></span>
                </div>
                <p className="text-slate-700 leading-relaxed mb-2"><MdText text={inhalt.texte.behinderungDesKathodischenTeilprozesses} /></p>
                <div className="text-[11px] text-slate-600 bg-white p-2 rounded border border-home-grau/20"><MdText text={inhalt.texte.verfahrenSauerstoffbremsendeBeschichtung} /></div>
              </div>

              <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                <div className="font-bold text-shiraz mb-1 flex items-center justify-between">
                  <span><MdText text={inhalt.texte.prinzip10CpKathodischer} /></span>
                  <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-home-grau/30 text-slate-600"><MdText text={inhalt.texte.cathodicProtection} /></span>
                </div>
                <p className="text-slate-700 leading-relaxed mb-2"><MdText text={inhalt.texte.verschiebungDesStahlpotentialsIn} /></p>
                <div className="text-[11px] text-slate-600 bg-white p-2 rounded border border-home-grau/20"><MdText text={inhalt.texte.verfahrenTitanMischoxidAnodenbänder} /></div>
              </div>

              <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                <div className="font-bold text-shiraz mb-1 flex items-center justify-between">
                  <span><MdText text={inhalt.texte.prinzip11CaAnodenkontrolle} /></span>
                  <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-home-grau/30 text-slate-600"><MdText text={inhalt.texte.anodicControl} /></span>
                </div>
                <p className="text-slate-700 leading-relaxed mb-2"><MdText text={inhalt.texte.behinderungDesAnodischenMetallauflösungs} /></p>
                <div className="text-[11px] text-slate-600 bg-white p-2 rounded border border-home-grau/20"><MdText text={inhalt.texte.verfahrenAuftragAktiverKorrosionsschutza} /></div>
              </div>

              <div className="p-3 bg-rose-50/50 rounded-lg border border-shiraz/20 flex flex-col justify-between">
                <div>
                  <span className="font-bold text-shiraz block mb-1"><MdText text={inhalt.texte.historischInstandsetzungsprinzipienDerDa} /></span>
                  <p className="text-[11px] text-slate-700 leading-relaxed"><MdText text={inhalt.texte.nationaleDefinitionenDerHistorischen} /></p>
                  <ul className="list-disc list-inside mt-1 space-y-0.5 text-[11px] text-slate-700">
                    <li><MdText text={inhalt.texte.prinzipWAbsenkungDes} /></li>
                    <li><MdText text={inhalt.texte.prinzipCBeschichtungDer} /></li>
                    <li><MdText text={inhalt.texte.prinzipRRepassivierungWiederherstellung} /></li>
                    <li><MdText text={inhalt.texte.prinzipKKathodischerKorrosionsschutz} /></li>
                  </ul>
                </div>
                <span className="text-[10px] text-slate-500 mt-2 block border-t border-shiraz/10 pt-1"><MdText text={inhalt.texte.trInstandhaltungTeil1} /></span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Schutzmechanismen (Passiv vs. Aktiv) */}
      {activeTab === 'mechanismen' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Einleitende didaktische Gegenüberstellung */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs">
            <h3 className="font-bold text-base text-slate-900 mb-2 flex items-center gap-2">
              <Shield className="text-shiraz" size={20} /><MdText text={inhalt.texte.grundprinzipienPhysikalischerBarrieresch} /></h3>
            <p className="text-xs text-slate-700 leading-relaxed"><MdText text={inhalt.texte.inDerBaustoffkundeUnd} /></p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Passive Schutzmaßnahmen */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-home-grau/20 pb-3">
                <Shield className="text-blue-600 shrink-0" size={20} />
                <div>
                  <h3 className="font-bold text-base text-slate-900"><MdText text={inhalt.texte.passiveSchutzmaßnahmenBarriereschutz} /></h3>
                  <span className="text-xs text-slate-500"><MdText text={inhalt.texte.physikalischeTrennungDiffusionshemmung} /></span>
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed"><MdText text={inhalt.texte.passiveSchutzsystemeErrichtenEine} /></p>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                  <strong className="text-slate-900 block mb-1"><MdText text={inhalt.texte.t1PrimärerBaustoffschutzAlkalische} /></strong>
                  <p className="text-slate-700 leading-relaxed"><MdText text={inhalt.texte.imIntaktenBetonLiegt} /></p>
                </div>

                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                  <strong className="text-slate-900 block mb-1"><MdText text={inhalt.texte.t2HydrophobierungTiefenimprägnierungNach} /></strong>
                  <p className="text-slate-700 leading-relaxed"><MdText text={inhalt.texte.niedermolekulareSilaneOderSiloxane} /></p>
                </div>

                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                  <strong className="text-slate-900 block mb-1"><MdText text={inhalt.texte.t3FilmbildendeBeschichtungenOs} /></strong>
                  <p className="text-slate-700 leading-relaxed"><MdText text={inhalt.texte.synthetischePolymerfilmeEpoxidharzPolyur} /></p>
                </div>

                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                  <strong className="text-slate-900 block mb-1"><MdText text={inhalt.texte.t4KonstruktivGeometrischerSchutz} /></strong>
                  <p className="text-slate-700 leading-relaxed"><MdText text={inhalt.texte.vermeidungVonWasserstauUnd} /></p>
                </div>
              </div>
            </div>

            {/* Aktive Schutzmaßnahmen */}
            <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-home-grau/20 pb-3">
                <Zap className="text-amber-600 shrink-0" size={20} />
                <div>
                  <h3 className="font-bold text-base text-slate-900"><MdText text={inhalt.texte.aktiveSchutzmaßnahmenElektrochemischChem} /></h3>
                  <span className="text-xs text-slate-500"><MdText text={inhalt.texte.thermodynamischeOderKinetischeSteuerung} /></span>
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed"><MdText text={inhalt.texte.aktiveSystemeGreifenDirekt} /></p>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                  <strong className="text-slate-900 block mb-1"><MdText text={inhalt.texte.t1KathodischerKorrosionsschutzKks} /></strong>
                  <p className="text-slate-700 leading-relaxed"><MdText text={inhalt.texte.derBewehrungsstahlWirdDurch} /></p>
                </div>

                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                  <strong className="text-slate-900 block mb-1"><MdText text={inhalt.texte.t2GalvanischerOpferschutzFeuerverzinkung} /></strong>
                  <p className="text-slate-700 leading-relaxed"><MdText text={inhalt.texte.zinkBesitztEinNegativeres} /></p>
                </div>

                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                  <strong className="text-slate-900 block mb-1"><MdText text={inhalt.texte.t3ElektrochemischeChloridextraktionEce} /></strong>
                  <p className="text-slate-700 leading-relaxed"><MdText text={inhalt.texte.temporäreGleichstrombehandlung1textBis} /></p>
                </div>

                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                  <strong className="text-slate-900 block mb-1"><MdText text={inhalt.texte.t4ElektrochemischeRealkalisierungEr} /></strong>
                  <p className="text-slate-700 leading-relaxed"><MdText text={inhalt.texte.temporärerGleichstromeinsatzAnKarbonatis} /></p>
                </div>

                <div className="p-3 bg-off-white rounded-lg border border-home-grau/20">
                  <strong className="text-slate-900 block mb-1"><MdText text={inhalt.texte.t5WanderndeKorrosionsinhibitorenMci} /></strong>
                  <p className="text-slate-700 leading-relaxed"><MdText text={inhalt.texte.organischeAlkanolamineMitHohem} /></p>
                </div>
              </div>
            </div>

          </div>

          {/* Detaillierte Systemvergleichs-Tabelle */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs">
            <h4 className="font-bold text-sm text-text-main mb-3"><MdText text={inhalt.texte.ausführlicheMatrixPassiverVs} /></h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-off-white border-b border-home-grau/30 text-slate-800">
                    <th className="p-2.5 font-bold w-1/4"><MdText text={inhalt.texte.merkmalKriterium} /></th>
                    <th className="p-2.5 font-bold text-blue-700 w-3/8"><MdText text={inhalt.texte.passiverSchutzBarriereOs} /></th>
                    <th className="p-2.5 font-bold text-amber-700 w-3/8"><MdText text={inhalt.texte.aktiverSchutzKksOpferschutz} /></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-home-grau/20 text-slate-700">
                  <tr>
                    <td className="p-2.5 font-semibold"><MdText text={inhalt.texte.triebkraftDerSchutzwirkung} /></td>
                    <td className="p-2.5"><MdText text={inhalt.texte.mechanischeBarriereBehindertDiffusions} /></td>
                    <td className="p-2.5"><MdText text={inhalt.texte.elektrischePotenzialverschiebungInDie} /></td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold"><MdText text={inhalt.texte.verhaltenBeiBeschädigungFehlstellen} /></td>
                    <td className="p-2.5 text-rose-700 font-medium"><MdText text={inhalt.texte.katastrophalKonzentrierteLochkorrosionAn} /></td>
                    <td className="p-2.5 text-emerald-700 font-medium"><MdText text={inhalt.texte.robustFernschutzwirkungSchütztFehlstelle} /></td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold"><MdText text={inhalt.texte.umgangMitVorhandenerChloridlast} /></td>
                    <td className="p-2.5 text-rose-700"><MdText text={inhalt.texte.chloridhaltigerBetonMussZwingend} /></td>
                    <td className="p-2.5 text-emerald-700"><MdText text={inhalt.texte.chloridbelasteterBetonKannIm} /></td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold"><MdText text={inhalt.texte.anlagenUndInstallationsaufwand} /></td>
                    <td className="p-2.5"><MdText text={inhalt.texte.geringBisMittelKugelstrahlen} /></td>
                    <td className="p-2.5"><MdText text={inhalt.texte.hochGleichrichterKabelverbindungenAnoden} /></td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold"><MdText text={inhalt.texte.monitoringDauerüberwachung} /></td>
                    <td className="p-2.5"><MdText text={inhalt.texte.visuelleInspektionAufBlasen} /></td>
                    <td className="p-2.5"><MdText text={inhalt.texte.kontinuierlicheFernüberwachungSchutzstro} /></td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold"><MdText text={inhalt.texte.einsatzgrenzenRisiken} /></td>
                    <td className="p-2.5"><MdText text={inhalt.texte.osmotischeBlasenbildungBeiRückseitiger} /></td>
                    <td className="p-2.5"><MdText text={inhalt.texte.gefahrVonWasserstoffversprödungBei} /></td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold">Hauptanwendungsgebiete</td>
                    <td className="p-2.5"><MdText text={inhalt.texte.neubautenParkdecksOs8} /></td>
                    <td className="p-2.5"><MdText text={inhalt.texte.salzbelasteteBrückenpfeilerTiefgaragenst} /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Fachübergreifende Analogien in anderen Disziplinen */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs">
            <h4 className="font-bold text-sm text-text-main mb-3"><MdText text={inhalt.texte.analogieAktiveUndPassive} /></h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              
              <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/20 space-y-2">
                <span className="font-bold text-slate-900 block border-b border-home-grau/20 pb-1"><MdText text={inhalt.texte.holzschutzDin688002019} /></span>
                <div>
                  <strong className="text-blue-700"><MdText text={inhalt.texte.passivBaulichKonstruktivTeil} /></strong>
                  <p className="text-slate-600"><MdText text={inhalt.texte.dachüberständeTropfkantenSockelabstandGe} /></p>
                </div>
                <div>
                  <strong className="text-amber-700"><MdText text={inhalt.texte.aktivChemischTeil3} /></strong>
                  <p className="text-slate-600"><MdText text={inhalt.texte.kesseldruckimprägnierungMitBiozidenBorat} /></p>
                </div>
              </div>

              <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/20 space-y-2">
                <span className="font-bold text-slate-900 block border-b border-home-grau/20 pb-1"><MdText text={inhalt.texte.brandschutzDin4102Din} /></span>
                <div>
                  <strong className="text-blue-700"><MdText text={inhalt.texte.passivBaulichKonstruktiv} /></strong>
                  <p className="text-slate-600"><MdText text={inhalt.texte.feuerwiderstandsfähigeBauteileRei30} /></p>
                </div>
                <div>
                  <strong className="text-amber-700"><MdText text={inhalt.texte.aktivAnlagentechnischAbwehrend} /></strong>
                  <p className="text-slate-600"><MdText text={inhalt.texte.automatischeSprinkleranlagenGaslöschanla} /></p>
                </div>
              </div>

              <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/20 space-y-2">
                <span className="font-bold text-slate-900 block border-b border-home-grau/20 pb-1"><MdText text={inhalt.texte.metallbauDinEnIso} /></span>
                <div>
                  <strong className="text-blue-700"><MdText text={inhalt.texte.passivBarriereüberzüge} /></strong>
                  <p className="text-slate-600"><MdText text={inhalt.texte.pulverbeschichtungenEpoxidharzZwischensc} /></p>
                </div>
                <div>
                  <strong className="text-amber-700"><MdText text={inhalt.texte.aktivGalvanischerOpferschutz} /></strong>
                  <p className="text-slate-600"><MdText text={inhalt.texte.zinkstaubgrundierungenUndFeuerverzinkung} /></p>
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* Tab 3: Lebenszyklus & Degradation (Tuutti / De Sitter) */}
      {activeTab === 'lebensdauer' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Das Tuutti-Modell */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-home-grau/20 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900"><MdText text={inhalt.texte.dasTuuttiModellDer} /></h3>
                <span className="text-xs text-slate-500"><MdText text={inhalt.texte.klassischePhaseneinteilungDerBauwerksalt} /></span>
              </div>
              <span className="text-xs font-mono bg-off-white px-2 py-1 rounded border border-home-grau/30 text-slate-600"><MdText text={inhalt.texte.tServiceTInitiation} /></span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed"><MdText text={inhalt.texte.nachDemModellVon} /></p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-off-white rounded-lg border border-home-grau/20">
                <span className="font-bold text-blue-700 block mb-1"><MdText text={inhalt.texte.t1InitiierungsphaseT} /></span>
                <p className="text-slate-700 leading-relaxed mb-2"><MdText text={inhalt.texte.dauerVomNeubauBis} /></p>
                <div className="p-2 bg-white rounded border border-home-grau/30 text-[11px] font-mono text-slate-600">
                  <InlineMath math="x(t) = k \cdot \sqrt{t} \quad \rightarrow \quad t_0 = \left(\frac{c}{k}\right)^2" />
                </div>
              </div>

              <div className="p-4 bg-off-white rounded-lg border border-home-grau/20">
                <span className="font-bold text-rose-700 block mb-1"><MdText text={inhalt.texte.t2PropagationsphaseT} /></span>
                <p className="text-slate-700 leading-relaxed mb-2"><MdText text={inhalt.texte.nachZerstörungDerPassivschicht} /></p>
                <div className="p-2 bg-white rounded border border-home-grau/30 text-[11px] font-mono text-slate-600">
                  <InlineMath math="\Delta d(t) = v_{\text{korr}} \cdot (t - t_0)" />
                </div>
              </div>
            </div>

            <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-lg text-xs text-amber-900"><MdText text={inhalt.texte.ingenieurmäßigeKonsequenzPräventiveInsta} /></div>
          </div>

          {/* De-Sitter-Regel ("Law of Fives") Interaktiver Rechner */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-home-grau/20 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900"><MdText text={inhalt.texte.deSitterGesetzDie} /></h3>
                <span className="text-xs text-slate-500"><MdText text={inhalt.texte.exponentiellerKostenanstiegBeiVerzögerte} /></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-600">Basisinvestition:</span>
                <input aria-label="Basisinvestition"
                  type="number" min="0"
                  value={deSitterInitialCost}
                  onChange={(e) => setDeSitterInitialCost(Math.max(100, Number(e.target.value)))}
                  className="w-24 px-2 py-1 text-xs border border-home-grau/30 rounded font-bold text-right"
                  step="500"
                />
                <span className="text-xs font-semibold text-slate-700">€</span>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed"><MdText text={inhalt.texte.dieVonDeSitter} /></p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-off-white rounded-lg border border-home-grau/20 text-center">
                <span className="text-slate-500 font-bold block mb-1"><MdText text={inhalt.texte.entwurfUndBau1} /></span>
                <span className="text-lg font-bold text-slate-800 block">
                  {deSitterInitialCost.toLocaleString('de-DE')} €
                </span>
                <span className="text-[11px] text-slate-500 block mt-1"><MdText text={inhalt.texte.qualitätszementBetondeckung15Mm} /></span>
              </div>

              <div className="p-3 bg-off-white rounded-lg border border-home-grau/20 text-center">
                <span className="text-slate-500 font-bold block mb-1"><MdText text={inhalt.texte.vorSchadensbeginn5} /></span>
                <span className="text-lg font-bold text-blue-700 block">
                  {(deSitterInitialCost * 5).toLocaleString('de-DE')} €
                </span>
                <span className="text-[11px] text-slate-500 block mt-1"><MdText text={inhalt.texte.präventiveHydrophobierungVorBeginn} /></span>
              </div>

              <div className="p-3 bg-off-white rounded-lg border border-home-grau/20 text-center">
                <span className="text-slate-500 font-bold block mb-1"><MdText text={inhalt.texte.schadensfortschrittLokal25} /></span>
                <span className="text-lg font-bold text-amber-700 block">
                  {(deSitterInitialCost * 25).toLocaleString('de-DE')} €
                </span>
                <span className="text-[11px] text-slate-500 block mt-1"><MdText text={inhalt.texte.lokaleBetoninstandsetzungBeiErsten} /></span>
              </div>

              <div className="p-3 bg-rose-50 rounded-lg border border-rose-200 text-center">
                <span className="text-rose-800 font-bold block mb-1"><MdText text={inhalt.texte.umfassendeInstandsetzung125} /></span>
                <span className="text-lg font-bold text-rose-700 block">
                  {(deSitterInitialCost * 125).toLocaleString('de-DE')} €
                </span>
                <span className="text-[11px] text-rose-700 block mt-1"><MdText text={inhalt.texte.umfassendeBetonsanierungQuerschnittsverl} /></span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Verfahrenswahl-Matrix */}
      {activeTab === 'verfahrenswahl' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          <div className="bg-slate-50 border border-home-grau/30 p-5 rounded-xl">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 border-b border-home-grau/30 pb-2 mb-3">
              <Compass className="text-shiraz shrink-0" size={18} /><MdText text={inhalt.texte.entscheidungsmatrixWelchesSchutzUnd} /></h3>
            <p className="text-sm text-slate-800 leading-relaxed mb-4"><MdText text={inhalt.texte.wählenSieDiePrimäre} /></p>

            {/* Selector Buttons */}
            <div className="flex flex-wrap gap-2 mb-4">
              {inhalt.daten.SchutzGrundlagen.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedDamageSource(item.id as typeof selectedDamageSource)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    selectedDamageSource === item.id
                      ? 'bg-shiraz text-white border-shiraz'
                      : 'bg-white text-slate-700 border-home-grau/30 hover:bg-off-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Result Box */}
            <div className="bg-white p-4 rounded-xl border border-home-grau/30 shadow-xs space-y-3 text-xs">
              {selectedDamageSource === 'carbonatisierung' && (
                <div>
                  <div className="flex items-center gap-2 text-shiraz font-bold text-sm border-b border-home-grau/20 pb-2 mb-2">
                    <CheckCircle2 size={16} /><MdText text={inhalt.texte.empfohlenePrinzipienBeiCarbonatisierungs} /></div>
                  <ul className="space-y-2 text-slate-700">
                    <li><MdText text={inhalt.texte.prinzip7RpMit} /></li>
                    <li><MdText text={inhalt.texte.prinzip1PiBzw} /></li>
                    <li><MdText text={inhalt.texte.prinzip7RpElektrochemische} /></li>
                  </ul>
                </div>
              )}

              {selectedDamageSource === 'chloride' && (
                <div>
                  <div className="flex items-center gap-2 text-shiraz font-bold text-sm border-b border-home-grau/20 pb-2 mb-2">
                    <CheckCircle2 size={16} /><MdText text={inhalt.texte.empfohlenePrinzipienBeiTausalz} /></div>
                  <ul className="space-y-2 text-slate-700">
                    <li><MdText text={inhalt.texte.prinzip3CrKonventionell} /></li>
                    <li><MdText text={inhalt.texte.prinzip10CpDafstb} /></li>
                    <li><MdText text={inhalt.texte.präventivOberflächenschutzsystemOs8} /></li>
                  </ul>
                </div>
              )}

              {selectedDamageSource === 'feuchte' && (
                <div>
                  <div className="flex items-center gap-2 text-shiraz font-bold text-sm border-b border-home-grau/20 pb-2 mb-2">
                    <CheckCircle2 size={16} /><MdText text={inhalt.texte.empfohlenePrinzipienBeiDurchfeuchtung} /></div>
                  <ul className="space-y-2 text-slate-700">
                    <li><MdText text={inhalt.texte.prinzip2McWasserhaltung} /></li>
                    <li><MdText text={inhalt.texte.injektionsverfahrenNachDinEn} /></li>
                    <li><MdText text={inhalt.texte.nachträglicheInnenabdichtungKellersanier} /></li>
                  </ul>
                </div>
              )}

              {selectedDamageSource === 'risse' && (
                <div>
                  <div className="flex items-center gap-2 text-shiraz font-bold text-sm border-b border-home-grau/20 pb-2 mb-2">
                    <CheckCircle2 size={16} /><MdText text={inhalt.texte.empfohlenePrinzipienBeiRissbildung} /></div>
                  <ul className="space-y-2 text-slate-700">
                    <li><MdText text={inhalt.texte.füllenVonRissenDin} /></li>
                    <li><MdText text={inhalt.texte.prinzip1PiRissüberbrückende} /></li>
                    <li><MdText text={inhalt.texte.fugensanierungHeraustrennenGealterterFug} /></li>
                  </ul>
                </div>
              )}

              {selectedDamageSource === 'verschleiss' && (
                <div>
                  <div className="flex items-center gap-2 text-shiraz font-bold text-sm border-b border-home-grau/20 pb-2 mb-2">
                    <CheckCircle2 size={16} /><MdText text={inhalt.texte.empfohlenePrinzipienBeiMechanischem} /></div>
                  <ul className="space-y-2 text-slate-700">
                    <li><MdText text={inhalt.texte.prinzip5PrApplikation} /></li>
                    <li><MdText text={inhalt.texte.oberflächenschutzsystemOs8Starre} /></li>
                  </ul>
                </div>
              )}
            </div>
          </div>

        </div>
      )}
      </ModuleTabs>

      {/* ModuleFooter */}
      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title={inhalt.werte.beispiel1KostenfolgeNach}
        zielGleichung="K_n = K_0 \cdot 5^n"
        schritte={inhalt.daten["SchutzGrundlagen.schritte"]}
        ergebnisHinweis={inhalt.werte.dieFünferregelIstEine}
        normQuelle={inhalt.werte.deSitter1984Din}
      />
      <FormulaDerivationBox
        title={inhalt.werte.beispiel2CoSperrwirkung}
        zielGleichung="s_{d,CO_2} = \mu_{CO_2} \cdot d \ge 50\,\text{m}"
        schritte={inhalt.daten["SchutzGrundlagen.schritte_2"]}
        ergebnisHinweis={inhalt.werte.gleichzeitigMussDieBeschichtung}
        normQuelle={inhalt.werte.klopfer1978DinEn}
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="schutz_grundlagen" />

      <ModuleFooter
        lastReviewed={inhalt.werte.oktober2026Ap12}
        weblinks={inhalt.daten["SchutzGrundlagen.weblinks"]}
        wikipedia={[
          { title: "Betoninstandsetzung", url: "https://de.wikipedia.org/wiki/Betoninstandsetzung" },
          { title: inhalt.werte.kathodischerKorrosionsschutz, url: "https://de.wikipedia.org/wiki/Kathodischer_Korrosionsschutz" },
          { title: "Oberflächenschutzsystem", url: "https://de.wikipedia.org/wiki/Oberfl%C3%A4chenschutzsystem" }
        ]}
        literatur={inhalt.daten["SchutzGrundlagen.literatur"]}
        regelwerke={inhalt.daten["SchutzGrundlagen.regelwerke"]}
        formeln={inhalt.daten["SchutzGrundlagen.formeln"]}
      />
    </div>
  );
}
