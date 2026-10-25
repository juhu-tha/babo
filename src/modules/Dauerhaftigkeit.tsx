import React, { useState } from 'react';
import {
  ShieldAlert,
  Sun,
  Bug,
  Box,
  Mountain,
  Maximize,
  Layers,
  Activity,
  Zap,
  LucideIcon
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { GruppierteModuleTabs, type ModulTabGruppe } from '@/src/components/ui/GruppierteModuleTabs';
import { ExpositionsKurzkarte } from '@/src/components/ui/ExpositionsKurzkarte';
import { WoodThematicLinks, PlasticsThematicLinks, MauerwerkThematicLinks, ConcreteThematicLinks, MetalThematicLinks } from './dauerhaftigkeit/ThematischeLinks';
import { BetonDauerhaftigkeitsSimulator } from './dauerhaftigkeit/BetonDauerhaftigkeitsSimulator';
import { MetalDurabilitySimulator } from './dauerhaftigkeit/MetalDurabilitySimulator';
import { TimberDurabilitySimulator } from './dauerhaftigkeit/TimberDurabilitySimulator';
import inhalt from '@/content/dauerhaftigkeit/Dauerhaftigkeit.json';
import { MdText } from '@/src/components/inhalt/MdText';

type MaterialTab = 'prinzipien' | 'beton' | 'asphalte' | 'metalle' | 'holz' | 'kunststoffe' | 'naturstein' | 'glas' | 'unvertraeglichkeiten';

export default function Dauerhaftigkeit() {
  const [activeTab, setActiveTab] = useState<MaterialTab>('prinzipien');

  React.useEffect(() => {
    const savedSubtab = localStorage.getItem('dauerhaftigkeit_subtab');
    if (savedSubtab) {
      setActiveTab(savedSubtab as MaterialTab);
      localStorage.removeItem('dauerhaftigkeit_subtab');
    }
  }, []);

  const tab = (id: MaterialTab, label: string, icon: LucideIcon) => ({ id, label, icon });
  const gruppen: readonly ModulTabGruppe<MaterialTab>[] = [
    { id: 'prinzipien_g', label: inhalt.werte.prinzipienKonzepte, icon: Layers, mitglieder: [tab('prinzipien', inhalt.werte.prinzipienKonzepte2, Layers)] },
    { id: 'beton_g', label: inhalt.werte.betonStahlbeton, icon: Box, mitglieder: [tab('beton', inhalt.werte.betonStahlbeton2, Box)] },
    { id: 'metalle_g', label: 'Metalle', icon: Activity, mitglieder: [tab('metalle', 'Metalle', Activity)] },
    { id: 'mineralisch_g', label: inhalt.werte.natursteinMauerwerkGlas, icon: Mountain, mitglieder: [
      tab('naturstein', inhalt.werte.natursteinMauerwerk, Mountain),
      tab('glas', 'Glas', Maximize),
    ] },
    { id: 'organisch_g', label: inhalt.werte.holzKunststoffeAsphalte, icon: Bug, mitglieder: [
      tab('holz', 'Holz', Bug),
      tab('kunststoffe', 'Kunststoffe', Sun),
      tab('asphalte', 'Asphalte', Box),
    ] },
    { id: 'unvertraeglich_g', label: 'Materialunverträglichkeiten', icon: Zap, mitglieder: [tab('unvertraeglichkeiten', 'Materialunverträglichkeiten', Zap)] },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <ShieldAlert className="text-shiraz" /><MdText text={inhalt.texte.dauerhaftigkeitseigenschaftenKorrosionss} /></h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.übersichtDerTypischenSchädigungsmechanis} /></p>
        </div>

        {/* Reiter: 6 Hauptbereiche, mineralische und organische Baustoffe mit zweiter Ebene (AP 3.8) */}
        <GruppierteModuleTabs
          label={inhalt.werte.baustoffeUndPrinzipienDer}
          gruppen={gruppen}
          aktiv={activeTab}
          onWechsel={setActiveTab}
          className="[&>[role=tablist]]:pb-3 [&>[role=tablist]]:border-b [&>[role=tablist]]:border-home-grau/20"
        >

        <div className="p-6">
          
          {/* Prinzipien */}
          {activeTab === 'prinzipien' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <h3 className="text-xl font-bold text-home-prim flex items-center gap-2">
                <Layers className="w-5 h-5 text-gray-500" /><MdText text={inhalt.texte.übergreifendePrinzipienDerDauerhaftigkei} /></h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.dieDauerhaftigkeitEinesBauteils} /></p>
        </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Konstruktiv */}
                <div className="bg-white p-5 rounded-xl border-l-4 border-shiraz shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-shiraz/10 rounded-lg text-shiraz"><Mountain size={20} /></div>
                    <h4 className="font-bold text-text-main"><MdText text={inhalt.texte.t1KonstruktiverSchutz} /></h4>
                  </div>
                  <p className="text-sm text-text-main/80 mb-4"><MdText text={inhalt.texte.dieEffektivsteUndWirtschaftlichste} /></p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                    <li><MdText text={inhalt.texte.wasserableitungGefälle2Tropfkanten} /></li>
                    <li><MdText text={inhalt.texte.vermeidungVonSchmutznesternGlatte} /></li>
                    <li><MdText text={inhalt.texte.belüftungHinterlüfteteFassadenTrocknungs} /></li>
                    <li><MdText text={inhalt.texte.spannungsminimierungDehnfugenGegenThermi} /></li>
                  </ul>
                </div>

                {/* Material */}
                <div className="bg-white p-5 rounded-xl border-l-4 border-emerald-500 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-600"><Box size={20} /></div>
                    <h4 className="font-bold text-text-main"><MdText text={inhalt.texte.t2Materialanpassung} /></h4>
                  </div>
                  <p className="text-sm text-text-main/80 mb-4"><MdText text={inhalt.texte.wennUmwelteinflüsseNichtKonstruktiv} /></p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                    <li><MdText text={inhalt.texte.betontechnologieEinNiedrigerW} /></li>
                    <li><MdText text={inhalt.texte.legierungenMetalleChromUnd} /></li>
                    <li><MdText text={inhalt.texte.natürlicheDauerhaftigkeitHolzRobuste} /></li>
                  </ul>
                </div>

                {/* Schutzsysteme */}
                <div className="bg-white p-5 rounded-xl border-l-4 border-blue-500 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600"><ShieldAlert size={20} /></div>
                    <h4 className="font-bold text-text-main"><MdText text={inhalt.texte.t3AktivePassiveSchutzsysteme} /></h4>
                  </div>
                  <p className="text-sm text-text-main/80 mb-4"><MdText text={inhalt.texte.nachträglicheApplikationenOderSysteme} /></p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                    <li><MdText text={inhalt.texte.passiveSchutzschichtenLackeAnstriche} /></li>
                    <li><MdText text={inhalt.texte.hydrophobierungSilaneSiloxaneMachen} /></li>
                    <li><MdText text={inhalt.texte.aktiverKathodischerKorrosionsschutzOpfer} /></li>
                    <li><MdText text={inhalt.texte.bioziderHolzschutzChemischeBehandlung} /></li>
                  </ul>
                </div>

              </div>
            </div>
          )}

          {/* Beton */}
          {activeTab === 'beton' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
                  <Box className="w-5 h-5 text-gray-500" /><MdText text={inhalt.texte.betonStahlbetonDin1045} /></h3>
                <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 space-y-2">
                  <p><MdText text={inhalt.texte.dieDauerhaftigkeitVonStahlbeton} /></p>
                  <p className="border-t border-home-grau/25 pt-2 text-xs text-slate-700"><MdText text={inhalt.texte.normenUpdateDin1045} /></p>
                </div>
              </div>

              {/* Expositionsklassen: eine Quelle (AP 3.9) – hier nur die Kurzkarte */}
              <ExpositionsKurzkarte hinweis={inhalt.werte.dieExpositionsklassenBeschreibenDie} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30">
                  <h4 className="font-semibold mb-3 text-shiraz"><MdText text={inhalt.texte.tragwerksausführungSchutzgrenzwerte} /></h4>
                  <p className="text-sm text-gray-700 mb-3"><MdText text={inhalt.texte.diePlanmäßigeDauerhaftigkeitDes} /></p>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                    <li><MdText text={inhalt.texte.zementsteinKapillaritätWZ} /></li>
                    <li><strong><MdText text={inhalt.texte.betondeckung} /><FormulaText text="$c_{\text{nom}}$" />):</strong><MdText text={inhalt.texte.berechnetSichAusDem} /><FormulaText text="$c_{\text{min}}$" /><MdText text={inhalt.texte.zurGewährleistungDerDauerhaften} /><FormulaText text="$\Delta c_{\text{dev}}$" /><MdText text={inhalt.texte.nachNa15Mm} /></li>
                    <li><strong><MdText text={inhalt.texte.rissbreitenbeschränkung} /><FormulaText text="$w_k$" />):</strong><MdText text={inhalt.texte.durchGezielteBewehrungsaufteilungGegen} /><FormulaText text="$w_k \le 0{,}3 \text{ mm}$" /> (oder <FormulaText text="$0{,}2 \text{ mm}$" /><MdText text={inhalt.texte.beiXcXdBeaufschlagung} /></li>
                    <li><MdText text={inhalt.texte.sorgfältigeNachbehandlungSchutzDes} /></li>
                  </ul>
                </div>
                <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30">
                   <h4 className="font-semibold mb-3 text-shiraz"><MdText text={inhalt.texte.detailanalyseSchädigungsmechanismenImZem} /></h4>
                   <ul className="list-disc pl-5 space-y-3.5 text-sm text-gray-700">
                     <li><MdText text={inhalt.texte.karbonatisierungBewehrungskorrosionKohle} /><div className="my-1.5 p-2 bg-white/70 rounded border border-home-grau/20 font-mono text-xs text-center"><MdText text={inhalt.texte.coCaOhCaco} /></div><MdText text={inhalt.texte.durchDiesenVerbrauchDes} /></li>
                     <li><MdText text={inhalt.texte.chloridinduzierterLochfraßCatastrophicPi} /></li>
                     <li><MdText text={inhalt.texte.alkaliKieselsäureReaktionAkr} /></li>
                     <li><MdText text={inhalt.texte.treibenderSulfatangriffAusDem} /></li>
                   </ul>
                </div>
              </div>
              <BetonDauerhaftigkeitsSimulator />
              <ConcreteThematicLinks current="dauerhaftigkeit" />
            </div>
          )}

          {/* Asphalte */}
          {activeTab === 'asphalte' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
                  <Box className="w-5 h-5 text-gray-500" /><MdText text={inhalt.texte.asphalteImStraßenUnd} /></h3>
                <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 space-y-2">
                  <p><MdText text={inhalt.texte.dieDauerhaftigkeitVonAsphaltbefestigunge} /></p>
                  <p className="border-t border-home-grau/25 pt-2 text-xs text-slate-700"><MdText text={inhalt.texte.modernesBindemittelTestingAl} /></p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30">
                  <h4 className="font-semibold mb-3 text-shiraz"><MdText text={inhalt.texte.schädigungsmechanismenAlterung} /></h4>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                    <li><MdText text={inhalt.texte.bitumenalterungOxidationSauerstoffUnd} /></li>
                    <li><MdText text={inhalt.texte.adhäsionsversagenStrippingUnterFeuchtigk} /></li>
                    <li><MdText text={inhalt.texte.thermischeRissbildungKälterisseBei} /></li>
                    <li><MdText text={inhalt.texte.plastischeVerformungSpurrinnenBei} /></li>
                  </ul>
                </div>
                <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30">
                  <h4 className="font-semibold mb-3 text-shiraz"><MdText text={inhalt.texte.regelwerkeSchutzmaßnahmen} /></h4>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                    <li><MdText text={inhalt.texte.bitumenmodifikationVerwendungPolymermodi} /></li>
                    <li><MdText text={inhalt.texte.schnittstellenoptimierungHaftbrückenAufs} /></li>
                    <li><MdText text={inhalt.texte.mischgutZielporengehaltEngeEinhaltung} /></li>
                    <li><MdText text={inhalt.texte.flüssigeHaftverbessererZugabeAminischer} /></li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Metalle */}
          {activeTab === 'metalle' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-500" /><MdText text={inhalt.texte.metalleElektrochemischeKorrosionSchutz} /></h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.metallkorrosionIstEinElektrochemischer} /></p>
        </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30">
                  <h4 className="font-semibold mb-3 text-shiraz"><MdText text={inhalt.texte.schädigungsmechanismenChemie} /></h4>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                    <li><MdText text={inhalt.texte.elektrochemischeGrundlagenAnDer} /><FormulaText text="Fe \rightarrow Fe^{2+} + 2e^-" /><MdText text={inhalt.texte.anDerKathodeWird} /><FormulaText text="O_2 + 2H_2O + 4e^- \rightarrow 4OH^-" /><MdText text={inhalt.texte.esBildetSichSchwerlösliches} /></li>
                    <li><MdText text={inhalt.texte.lochfraßkorrosionPittingDurchschlagenDer} /></li>
                    <li><MdText text={inhalt.texte.kontaktkorrosionGalvanischBeiDirektem} /></li>
                  </ul>
                </div>
                <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30">
                  <h4 className="font-semibold mb-3 text-shiraz"><MdText text={inhalt.texte.dinEnIso12944} /></h4>
                  <p className="text-xs text-slate-600 mb-2 font-medium"><MdText text={inhalt.texte.dieAtmosphäreWirdNach} /></p>
                  <ul className="text-xs space-y-1.5 text-gray-700 mb-3">
                    <li><span className="font-bold"><MdText text={inhalt.texte.c1Unbedeutend} /></span><MdText text={inhalt.texte.beheizteInnenräumeMitSauberer} /></li>
                    <li><span className="font-bold"><MdText text={inhalt.texte.c2Gering} /></span><MdText text={inhalt.texte.unbeheizteGebäudeMitKondensationsrisiko} /></li>
                    <li><span className="font-bold">C3 (Mäßig):</span><MdText text={inhalt.texte.stadtUndIndustrieatmosphäreMit} /></li>
                    <li><span className="font-bold">C4 (Stark):</span><MdText text={inhalt.texte.industrieUndKüstenbereicheMit} /></li>
                    <li><span className="font-bold"><MdText text={inhalt.texte.c5SehrStark} /></span><MdText text={inhalt.texte.küstenUndOffshorebereicheMit} /></li>
                    <li><span className="font-bold"><MdText text={inhalt.texte.cxExtrem} /></span><MdText text={inhalt.texte.offshorebereicheMitExtremerSalzbelastung} /></li>
                  </ul>
                  <p className="text-xs text-slate-700"><MdText text={inhalt.texte.schutzdauernBeiBeschichtungenWerden} /></p>
                </div>
              </div>
              <MetalDurabilitySimulator />
              <MetalThematicLinks current="dauerhaftigkeit" />
            </div>
          )}

          {/* Holz */}
          {activeTab === 'holz' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
                  <Bug className="w-5 h-5 text-green-600" /><MdText text={inhalt.texte.holzUndHolzwerkstoffeBiologischer} /></h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.holzschutzIstImDeutschen} /></p>
        </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30">
                  <h4 className="font-semibold mb-3 text-shiraz"><MdText text={inhalt.texte.schädigungsmechanismenPhysiologie} /></h4>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                    <li><MdText text={inhalt.texte.pilzbefallHolzfeuchteU20} /><ul className="list-circle pl-4 mt-1 space-y-1 text-xs">
                        <li><MdText text={inhalt.texte.braunfäuleAbbauDerCellulose} /></li>
                        <li><MdText text={inhalt.texte.weißfäuleAbbauVonLignin} /></li>
                        <li><MdText text={inhalt.texte.moderfäuleAbbauUnterDauernd} /></li>
                      </ul>
                    </li>
                    <li><MdText text={inhalt.texte.insektenbefallLarvenFressenGänge} /></li>
                    <li><MdText text={inhalt.texte.photochemischerAbbauUvStrahlung} /></li>
                  </ul>
                </div>
                <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30 flex flex-col justify-between">
                  <div>
                    <h4 className="font-semibold mb-3 text-shiraz"><MdText text={inhalt.texte.gebrauchsklassenGkNachDin} /></h4>
                    <ul className="text-xs space-y-1 px-1 text-gray-700">
                      <li><span className="font-bold">GK 0:</span><MdText text={inhalt.texte.innenVerbautStändigTrocken} /></li>
                      <li><span className="font-bold">GK 1:</span><MdText text={inhalt.texte.innenVerbautTrockenInsektenbefall} /></li>
                      <li><span className="font-bold">GK 2:</span><MdText text={inhalt.texte.unterDachKeineDirekte} /></li>
                      <li><span className="font-semibold text-shiraz">GK 3.1:</span><MdText text={inhalt.texte.außenBewittertOhneWasseranlagerung} /></li>
                      <li><span className="font-semibold text-shiraz">GK 3.2:</span><MdText text={inhalt.texte.außenBewittertMitWasseranlagerung} /></li>
                      <li><span className="font-bold">GK 4:</span><MdText text={inhalt.texte.ständigerErdkontaktOderDirekter} /></li>
                      <li><span className="font-bold text-blue-600">GK 5:</span><MdText text={inhalt.texte.ständigerMeerwasserkontaktZB} /></li>
                    </ul>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-200 flex flex-col gap-1">
                    <span className="font-bold text-xs text-text-main"><MdText text={inhalt.texte.wichtigeHolzveredelungenEcoHolzschutz} /></span>
                    <span className="text-xs text-gray-600 leading-relaxed"><MdText text={inhalt.texte.thermowoodTmtDurchKochen} /></span>
                    <span className="text-xs text-gray-600 leading-relaxed mt-1"><MdText text={inhalt.texte.acetylierungAccoyaChemischePfropfung} /></span>
                  </div>
                </div>
              </div>
              <TimberDurabilitySimulator />
              <WoodThematicLinks current="dauerhaftigkeit" />
            </div>
          )}

          {/* Kunststoffe */}
          {activeTab === 'kunststoffe' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
                  <Sun className="w-5 h-5 text-yellow-500" /><MdText text={inhalt.texte.kunststoffeBaupolymereAlterung} /></h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.dieDauerhaftigkeitVonKunststoffen} /></p>
        </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30">
                  <h4 className="font-semibold mb-3 text-shiraz"><MdText text={inhalt.texte.schädigungsmechanismenPhysik} /></h4>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                    <li><MdText text={inhalt.texte.photooxidationUvDegradationHochenergetis} /></li>
                    <li><MdText text={inhalt.texte.weichmacherwanderungMigrationInWeich} /></li>
                    <li><MdText text={inhalt.texte.umgebungsbedingteSpannungsrissbildungEsc} /></li>
                  </ul>
                </div>
                <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30">
                  <h4 className="font-semibold mb-3 text-shiraz"><MdText text={inhalt.texte.schutzmaßnahmenBauteildesign} /></h4>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                    <li><MdText text={inhalt.texte.uvStabilisierungZumischungVon} /></li>
                    <li><MdText text={inhalt.texte.oberflächenbeschichtungenKoextrusionSchu} /></li>
                    <li><MdText text={inhalt.texte.einbauMechanischerTrennlagenVerlegung} /></li>
                    <li><MdText text={inhalt.texte.sorgfältigesBauteildesignKonsequenteVerm} /></li>
                  </ul>
                </div>
              </div>
              <PlasticsThematicLinks current="dauerhaftigkeit" />
            </div>
          )}

          {/* Naturstein & Mauerwerk */}
          {activeTab === 'naturstein' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
                  <Mountain className="w-5 h-5 text-stone-600" /><MdText text={inhalt.texte.natursteinMauerwerkVerwitterungWta} /></h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.natursteinUndZiegelmauerwerkSind} /></p>
        </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30">
                  <h4 className="font-semibold mb-3 text-shiraz"><MdText text={inhalt.texte.schädigungsmechanismenSalze} /></h4>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                    <li><MdText text={inhalt.texte.salzkristallisationssprengungEindringend} /><span className="font-bold">Kryptofloreszenz</span><MdText text={inhalt.texte.übersteigtDerEntstehendeÜbersteigt} /></li>
                    <li><MdText text={inhalt.texte.gipsSchalenbildungSchwefeldioxidIn} /><FormulaText text="CaCO_3 \rightarrow CaSO_4 \cdot 2H_2O" /><MdText text={inhalt.texte.dieserGipsLagertSich} /></li>
                    <li><MdText text={inhalt.texte.frostsprengungFreiesWasserDehnt} /></li>
                  </ul>
                </div>
                <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30">
                  <h4 className="font-semibold mb-3 text-shiraz"><MdText text={inhalt.texte.schutzInstandsetzungsmaßnahmen} /></h4>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                    <li><MdText text={inhalt.texte.sanierputzsystemeNachWtaMerkblatt} /></li>
                    <li><MdText text={inhalt.texte.hydrophobierungSilaneSiloxaneChemische} /></li>
                    <li><MdText text={inhalt.texte.kompressenEntsalzungAufbringenFeuchter} /></li>
                    <li><MdText text={inhalt.texte.konstruktiverSchutzEinbauMechanischer} /></li>
                  </ul>
                </div>
              </div>
              <MauerwerkThematicLinks current="dauerhaftigkeit" />
            </div>
          )}

          {/* Glas */}
          {activeTab === 'glas' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
                  <Maximize className="w-5 h-5 text-cyan-500" /><MdText text={inhalt.texte.glasGlaskorrosionEsgSpontanbruch} /></h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.silicatglasGiltAlsÄußerst} /></p>
        </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30">
                  <h4 className="font-semibold mb-3 text-shiraz"><MdText text={inhalt.texte.schädigungsmechanismenChemie2} /></h4>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                    <li><MdText text={inhalt.texte.glaskorrosionHydrolyseStehendesWasser} /></li>
                    <li><MdText text={inhalt.texte.nisSpontanbruchBeiEsg} /><FormulaText text="\alpha" /><MdText text={inhalt.texte.nisInTieftemperatur} /><FormulaText text="\beta" /><MdText text={inhalt.texte.nisUnterEinerVolumenzunahme} /></li>
                    <li><MdText text={inhalt.texte.thermischerBruchThermobruchSchneller} /></li>
                  </ul>
                </div>
                <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30">
                  <h4 className="font-semibold mb-3 text-shiraz"><MdText text={inhalt.texte.prüfverfahrenSchutzmaßnahmen} /></h4>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                    <li><MdText text={inhalt.texte.heißlagerungsprüfungHeatSoakTest} /></li>
                    <li><MdText text={inhalt.texte.kantenbearbeitungSäumenPolierenProfessio} /></li>
                    <li><MdText text={inhalt.texte.thermischeVorspannungEsgTvg} /></li>
                    <li><MdText text={inhalt.texte.kondensatvermeidungAusreichendeHinterlüf} /></li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Unverträglichkeiten */}
          {activeTab === 'unvertraeglichkeiten' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <h3 className="text-xl font-bold text-home-prim flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-500" />
                Materialunverträglichkeiten
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30">
                  <h4 className="font-semibold mb-3 text-shiraz"><MdText text={inhalt.texte.metalleHolzMineralik} /></h4>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                    <li><MdText text={inhalt.texte.metalleUntereinanderBimetallkorrosionDir} /></li>
                    <li><MdText text={inhalt.texte.stahlInGerbstoffreichemHolz} /></li>
                    <li><MdText text={inhalt.texte.aluminiumZinkFrischerBeton} /></li>
                  </ul>
                </div>
                <div className="bg-stone-50 p-5 rounded-xl border border-home-grau/30">
                  <h4 className="font-semibold mb-3 text-shiraz"><MdText text={inhalt.texte.kunststoffeDichtstoffeBitumen} /></h4>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                    <li><MdText text={inhalt.texte.weichmacherwanderungPvcEpsXps} /></li>
                    <li><MdText text={inhalt.texte.bitumenEpsXpsLösungsmittelhaltige} /></li>
                    <li><MdText text={inhalt.texte.dichtstoffeSilikonEssigvernetzendesSilik} /></li>
                  </ul>
                </div>
              </div>
            </div>
          )}

        </div>
        </GruppierteModuleTabs>
      </div>
    
      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title={inhalt.werte.beispiel1NennmaßDer}
        zielGleichung="c_{nom} = c_{min} + \Delta c_{dev}, \quad c_{min} = \max\{c_{min,b};\; c_{min,dur};\; 10\,\text{mm}\}"
        schritte={inhalt.daten["Dauerhaftigkeit.schritte"]}
        ergebnisHinweis={inhalt.werte.zusätzlichGiltFürXd3}
        normQuelle={inhalt.werte.dinEn19921}
      />
      <FormulaDerivationBox
        title={inhalt.werte.beispiel2WieWichtig}
        zielGleichung="t_{krit} = \left(\frac{c}{k}\right)^2"
        schritte={inhalt.daten["Dauerhaftigkeit.schritte_2"]}
        ergebnisHinweis={inhalt.werte.dieZeitBisZur}
        normQuelle={inhalt.werte.tGesetzFibBulletin}
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="dauerhaftigkeit" />

      <ModuleFooter
        lastReviewed={inhalt.werte.oktober2026Ap10} 
        wikipedia={[
          { title: 'Dauerhaftigkeit', url: 'https://de.wikipedia.org/wiki/Dauerhaftigkeit' },
          { title: 'Expositionsklasse', url: 'https://de.wikipedia.org/wiki/Expositionsklasse' },
          { title: 'Betondeckung', url: 'https://de.wikipedia.org/wiki/Betondeckung' }
        ]}
        literatur={inhalt.daten["Dauerhaftigkeit.literatur"]}
        regelwerke={inhalt.daten["Dauerhaftigkeit.regelwerke"]}
        formeln={inhalt.daten["Dauerhaftigkeit.formeln"]}
      />
</div>
  );
}
